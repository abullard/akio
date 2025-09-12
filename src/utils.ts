import fs from 'fs';
import { glob } from 'glob';

export interface ScriptsDescribed {
    name: string;
    scripts: Record<string, string>;
    scriptDescriptions: Record<string, string>;
};
export type PackageScriptsAndDescriptions = ScriptsDescribed[];

export const getPkgManager = () => {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';

    return 'npm';
};

const loadJson = async (path: string) => await import(path, { with: { type: 'json' } });

export const readAllPkgJsons = async (): Promise<PackageScriptsAndDescriptions> => {
    const paths = await glob('**/package.json', {
        signal: AbortSignal.timeout(1000),
        ignore: 'node_modules/**',
        absolute: true
    });
    const allPkgJsonContents = await Promise.all(paths.map(loadJson));

    return pkgJsonDataDTO(allPkgJsonContents);
}

const pkgJsonDataDTO = (allPkgJsonContents: any): PackageScriptsAndDescriptions => {
    const npmScriptsAndDescriptionsByPkg: PackageScriptsAndDescriptions = [];

    for (const contents of allPkgJsonContents) {
        const cmdMap: Record<string, string> = {};
        const descriptionsMap: Record<string, string> = {};
        
        for (const [name, cmd] of Object.entries(contents.default.scripts)) {
            cmdMap[name] = cmd as string;
        }
        
        for (const [name, description] of Object.entries(contents.default.scriptDescriptions)) {            
            descriptionsMap[name] = description as string;
        }

        npmScriptsAndDescriptionsByPkg.push({
            name: contents.default.name,
            scripts: cmdMap,
            scriptDescriptions: descriptionsMap,
        });

    }
    return npmScriptsAndDescriptionsByPkg;
};
