import { readFileSync } from 'fs';
import { dirname, resolve, join } from 'path';
import { fetchLatestVersion } from './fetch-latest';
import { Colors } from 'src/formatting/colors';
import { emojiWithSpace } from 'src/formatting/emoji';

type Package = {
    name: string;
    version: string;
};

const readAkioPkgJson = (): Package => {
    // TODO (AJB) - this is duplication and should be merged with readAllPackageJsons somehow
    const dir = dirname(__dirname ? __dirname : resolve('.'));
    const path = join(dir, 'package.json');

    const contents = JSON.parse(readFileSync(path, 'utf8'));

    return {
        name: contents.name,
        version: contents.version,
    };
};

const logUpdateMessage = (pkg: Package, originVersion: string) => {
    console.log(`${Colors.yellow}------------------------------${Colors.reset}`);
    console.log(`${Colors.yellow}${emojiWithSpace('STARS')}New akio version available: ${Colors.reset}`);
    console.log(`${Colors.gray}\t${pkg.version} -> ${Colors.green}${originVersion}${Colors.reset}`);
    console.log(`${Colors.yellow}Run: npm i -g ${pkg.name}${Colors.reset}`);
    console.log(`${Colors.yellow}------------------------------${Colors.reset}`);
};

const needsUpdate = (currentVer: string, npmjsVer: string) => {
    const curr = currentVer.split('.');
    const npmjs = npmjsVer.split('.');

    if (curr[0] < npmjs[0]) return true;
    if (curr[1] < npmjs[1]) return true;
    if (curr[2] < npmjs[2]) return true;

    return false;
};

export const checkForUpdate = async () => {
    const pkg = readAkioPkgJson();
    const npmjsdotcomVersion = await fetchLatestVersion(pkg.name);

    if (!pkg || !npmjsdotcomVersion) {
        return;
    }

    if (needsUpdate(pkg.version, npmjsdotcomVersion)) {
        logUpdateMessage(pkg, npmjsdotcomVersion);
    }
};
