#!/usr/bin/env node

import { disableColors } from './colors';
import { mapAndOutputCommands, processInput } from './command';
import { getPkgManager } from './utils';
import { disableEmoji } from './emoji';
import { processCliOpts } from './cli-opts/cli-opts';
import { checkForUpdate } from './update-notif';

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

    checkForUpdate();

    if (commandMap && showInput) processInput(commandMap);
};

main();
