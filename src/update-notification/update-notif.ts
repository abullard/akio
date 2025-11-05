import { fetchLatestVersion } from './fetch-latest';
import { Colors } from 'src/formatting/colors';
import { emojiWithSpace } from 'src/formatting/emoji';
import { Package } from 'src/types';
import { needsUpdate, readAkioPkgJson } from 'src/utils';

const logUpdateMessage = (pkg: Package, originVersion: string) => {
    console.log(`${Colors.yellow}------------------------------${Colors.reset}`);
    console.log(`${Colors.yellow}${emojiWithSpace('STARS')}New akio version available: ${Colors.reset}`);
    console.log(`${Colors.gray}\t${pkg.version} -> ${Colors.green}${originVersion}${Colors.reset}`);
    console.log(`${Colors.yellow}Run: npm i -g ${pkg.name}${Colors.reset}`);
    console.log(`${Colors.yellow}------------------------------${Colors.reset}`);
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
