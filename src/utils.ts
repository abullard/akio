import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface ScriptsDescribed {
    name: string;
    version: string;
    scripts: Record<string, string>;
    scriptDescriptions: Record<string, string>;
    isRoot: boolean;
};
export type PackageScriptsAndDescriptions = ScriptsDescribed[];

export const getPkgManager = () => {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';

    return 'npm';
};

const loadJson = async (pkgPath: string) => await import(pkgPath, { with: { type: 'json' } });

export const readAllPkgJsons = async (): Promise<PackageScriptsAndDescriptions> => {
    const paths = await glob('**/package.json', {
        signal: AbortSignal.timeout(5000),
        ignore: 'node_modules/**',
        absolute: true
    });
    const rootPkgPath = path.resolve('package.json');
    const allPkgJsonContents = await Promise.all(
        paths.map(async (pkgPath) => ({
            pkgPath,
            contents: await loadJson(pkgPath)
        }))
    );

    const scripts = pkgJsonDataDTO(allPkgJsonContents, rootPkgPath);

    return scripts.sort((a, b) => a.name.localeCompare(b.name));
}

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

       if(packageScripts) {
          for (const [name, cmd] of Object.entries(packageScripts)) {
              cmdMap[name] = cmd as string;
          }
       }

        if(packageScriptDescriptions) {
          for (const [name, description] of Object.entries(packageScriptDescriptions)) {
              descriptionsMap[name] = description as string;
          }
        }

        npmScriptsAndDescriptionsByPkg.push({
            name: contents.default.name,
            version: contents.default.version,
            scripts: cmdMap,
            scriptDescriptions: descriptionsMap,
            isRoot: pkgPath === rootPkgPath
        });
    }

    return npmScriptsAndDescriptionsByPkg;
};
