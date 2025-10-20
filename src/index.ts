#!/usr/bin/env node

import { disableColors } from "./colors";
import { processCliOpts } from "./cli-opts";
import { mapAndOutputCommands, processInput } from "./command";
import { getPkgManager } from "./utils";

// TODO AJB 05/26/2025: 
/*
    1. remove emoji when -f passed
    2. you need to document how to setup pnpm workspaces, and include npm restrictions in the readme
    3. ignore commands that are just pnpm package command passthroughs?
    4. create the package selector flow
    5. rework cli options once all of this is done
*/
const main = async () => {
    const { showInput, showFormatting, searchValue, skipDescriptions } = processCliOpts();
    const pkgManager = getPkgManager();

    if (!showFormatting) disableColors();

    const commandMap = await mapAndOutputCommands(pkgManager, searchValue, skipDescriptions);

    if (commandMap && showInput) processInput(commandMap);
};

main();
