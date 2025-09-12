import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export const getPkgManager = () => {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';

    return 'npm';
};

const loadJson = async (path: string) => await import(path, { with: { type: 'json' } });

export const readAllPkgJsons = async () => {
    const paths = await glob('**/package.json', {
        signal: AbortSignal.timeout(1000),
        ignore: 'node_modules/**',
        absolute: true
    });

    const allPkgJsonContents = await Promise.all(paths.map(loadJson));
    for (const contents in allPkgJsonContents) {
        
    }

    // original impl
    return;
}
