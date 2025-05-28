import fs from 'fs';
import path from 'path';

export const getPkgManager = () => {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';

    return 'npm';
};

export const readPackageJson = () => {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
}
