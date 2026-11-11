import fs from 'fs';
import path from 'path';
import { readFileSync } from 'fs';
import { dirname, resolve, join } from 'path';
import { pathToFileURL } from 'url';
import { execFileSync } from 'child_process';
import { glob } from 'glob';
import type { Package, PackageJsonContents, PackageScriptsAndDescriptions } from './types';
import { options } from './cli-opts/cli-opts';
import { formatError } from './formatting/format-output';

const NOT_AN_NPM_DIRECTORY_MSG = 'No package.json found. akio must be run from within an npm project directory.';

/*
  Finds the directory akio treats as "the project": the enclosing git
  repo's root, so akio works from any subdirectory without accidentally
  sweeping in unrelated projects above/beside it. Falls back to requiring
  cwd itself to have a package.json when there's no git repo (or no git
  binary) to safely bound a search with.
 */
export const findProjectRoot = (): string => {
    const cwd = process.cwd();

    try {
        return execFileSync('git', ['rev-parse', '--show-toplevel'], {
            cwd,
            stdio: ['ignore', 'pipe', 'ignore'],
        })
            .toString()
            .trim();
    } catch {
        if (!fs.existsSync(path.join(cwd, 'package.json'))) {
            formatError(NOT_AN_NPM_DIRECTORY_MSG);
        }

        return cwd;
    }
};

export const getPkgManager = () => {
    const projectRoot = findProjectRoot();

    if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) return 'yarn';

    return 'npm';
};

export const needsUpdate = (currentVer: string, npmjsVer: string) => {
    const curr = currentVer.split('.');
    const npmjs = npmjsVer.split('.');
    const rightSize = 3;

    if (curr.length !== rightSize || npmjs.length !== rightSize) return false;

    for (let i = 0; i < rightSize; i++) {
        if (curr[i] < npmjs[i]) return true;
    }

    return false;
};

const filterToTargetedPackge = (paths: string[], rootPkgPath: string) => {
    if (!options.targetPackage) return paths;

    if (options.targetPackage === 'root') {
        if (!paths.includes(rootPkgPath)) {
            formatError('No root package.json found in this repository.');
        }

        return [rootPkgPath];
    }

    const filteredPaths = paths.filter((filePath) => {
        const pathList = filePath.split(path.sep);
        const curPackage = pathList[pathList.length - 2];
        return curPackage === options.targetPackage;
    });

    if (!filteredPaths.length) {
        formatError('Invalid package specified.');
    }

    return filteredPaths;
};

const loadJson = async (pkgPath: string) => {
    const fullPath = pathToFileURL(pkgPath).href;
    return await import(fullPath, { with: { type: 'json' } });
};

export const readAllPkgJsons = async (): Promise<PackageScriptsAndDescriptions> => {
    /*
      Note: this should work for now, but will probably
      need to be moved to something like
      `pnpm list -r --depth -1 --json` or something
     */
    const ignorePaths = [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/lib/**',
        '**/out/**',
        '**/coverage/**',
        '**/.turbo/**',
        '**/.next/**',
        '**/.cache/**',
    ];
    const projectRoot = findProjectRoot();
    const paths = await glob('**/package.json', {
        cwd: projectRoot,
        signal: AbortSignal.timeout(5000),
        ignore: ignorePaths,
        absolute: true,
    });

    if (paths.length === 0) {
        formatError(NOT_AN_NPM_DIRECTORY_MSG);
    }

    const rootPkgPath = path.resolve(projectRoot, 'package.json');
    const filteredPaths = filterToTargetedPackge(paths, rootPkgPath);

    const allPkgJsonContents = await Promise.all(
        filteredPaths.map(async (pkgPath) => ({
            pkgPath,
            contents: await loadJson(pkgPath),
        }))
    );

    const scripts = pkgJsonDataDTO(allPkgJsonContents, rootPkgPath);

    return pinRootFirst(scripts);
};

/*
  Puts the root package's scripts first, matching the existing UX where
  the root package is always shown before its workspace members. If no
  discovered package.json actually lives at the project root (e.g. a
  mixed-stack repo with no root-level package.json), there's no root to
  pin — every package is just sorted normally instead.
 */
export const pinRootFirst = (scripts: PackageScriptsAndDescriptions): PackageScriptsAndDescriptions => {
    const indexOfRoot = scripts.findIndex((x) => x.isRoot);

    if (indexOfRoot === -1) {
        return scripts.sort((a, b) => a.name.localeCompare(b.name));
    }

    const rootScripts = scripts.splice(indexOfRoot, 1)[0];
    const sortedScripts = scripts.sort((a, b) => a.name.localeCompare(b.name));
    sortedScripts.unshift(rootScripts);

    return sortedScripts;
};

export const readAkioPkgJson = (): Package => {
    // TODO (AJB) - this is duplication and should be merged with readAllPackageJsons somehow
    const dir = dirname(__dirname ? __dirname : resolve('.'));
    const path = join(dir, 'package.json');

    const contents = JSON.parse(readFileSync(path, 'utf8'));

    return {
        name: contents.name,
        version: contents.version,
    };
};

const pkgJsonDataDTO = (
    allPkgJsonContents: Array<{ pkgPath: string; contents: PackageJsonContents }>,
    rootPkgPath: string
): PackageScriptsAndDescriptions => {
    const npmScriptsAndDescriptionsByPkg: PackageScriptsAndDescriptions = [];

    for (const { pkgPath, contents } of allPkgJsonContents) {
        const cmdMap: Record<string, string> = {};
        const descriptionsMap: Record<string, string> = {};
        const packageScripts = contents.default.scripts;
        const packageScriptDescriptions = contents.default.scriptDescriptions;

        if (packageScripts) {
            for (const [name, cmd] of Object.entries(packageScripts)) {
                cmdMap[name] = cmd as string;
            }
        }

        if (packageScriptDescriptions) {
            for (const [name, description] of Object.entries(packageScriptDescriptions)) {
                descriptionsMap[name] = description as string;
            }
        }

        npmScriptsAndDescriptionsByPkg.push({
            name: contents.default.name,
            version: contents.default.version,
            scripts: cmdMap,
            scriptDescriptions: descriptionsMap,
            isRoot: pkgPath === rootPkgPath,
        });
    }

    return npmScriptsAndDescriptionsByPkg;
};
