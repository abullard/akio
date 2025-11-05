#!/usr/bin/env node

import { mapAndOutputCommands, processInput } from './command';
import { getPkgManager } from './utils';
import { processCliOpts } from './cli-opts/cli-opts';
import { disableColors } from './formatting/colors';
import { checkForUpdate } from './update-notification/update-notif';
import { disableEmoji } from './formatting/emoji';

// TODO AJB 05/26/2025:
/*
    1. you need to document how to setup pnpm workspaces, and include npm restrictions in the readme
    2. ignore commands that are just pnpm package command passthroughs?
    3. create the package selector flow
*/
const main = async () => {
    const { showInput, showFormatting, searchValue, skipDescriptions } = processCliOpts();
    const pkgManager = getPkgManager();

    if (!showFormatting) {
        disableColors();
        disableEmoji();
    }

    const commandMap = await mapAndOutputCommands(pkgManager, searchValue, skipDescriptions);

    await checkForUpdate();

    if (commandMap && showInput) processInput(commandMap);
};

main();
