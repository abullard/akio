#!/usr/bin/env node

import { mapAndOutputCommands, processInput } from './command';
import { getPkgManager } from './utils';
import { options } from './cli-opts/cli-opts';
import { disableColors } from './formatting/colors';
import { checkForUpdate } from './update-notification/update-notif';
import { disableEmoji } from './formatting/emoji';

const main = async () => {
    if (options.format) {
        disableColors();
        disableEmoji();
    }

    const pkgManager = getPkgManager();
    const commandMap = await mapAndOutputCommands(pkgManager);
    await checkForUpdate();
    if (commandMap && !options.input) processInput(commandMap);
};

main();
