import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import { dirname, resolve, join } from 'path';
import { Package, PackageScriptsAndDescriptions } from './types';
import { options } from './cli-opts/cli-opts';
import { formatError } from './formatting/format-output';
import { pathToFileURL } from 'url';

export const getPkgManager = () => {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';

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
        return [rootPkgPath];
    }

    // TODO AJB 12/30/2025: I don't think this is working in windows
    const filteredPaths = paths.filter((path) => {
        const pathList = path.split('/');
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
    return await import(fullPath, { with: { type: 'json' } })
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
    const paths = await glob('**/package.json', {
        signal: AbortSignal.timeout(5000),
        ignore: ignorePaths,
        absolute: true,
    });

    const rootPkgPath = path.resolve('package.json');
    const filteredPaths = filterToTargetedPackge(paths, rootPkgPath);

    const allPkgJsonContents = await Promise.all(
        filteredPaths.map(async (pkgPath) => ({
            pkgPath,
            contents: await loadJson(pkgPath),
        }))
    );

    const scripts = pkgJsonDataDTO(allPkgJsonContents, rootPkgPath);
    const indexOfRoot = scripts.findIndex((x) => x.isRoot);
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
    allPkgJsonContents: Array<{ pkgPath: string; contents: any }>,
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
