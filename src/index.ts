#!/usr/bin/env node

import { disableColors } from "./colors";
import { processCliOpts } from "./cli-opts";
import { mapAndOutputCommands, processInput } from "./command";
import { getPkgManager } from "./utils";

// TODO AJB 05/26/2025: 
/*
    1. remove emoji when -f passed
    2. publish this to npm
*/
const main = () => {
    const { showInput, showFormatting, searchValue } = processCliOpts();
    const pkgManager = getPkgManager();

    if (!showFormatting) disableColors();

    const commandMap = mapAndOutputCommands(pkgManager, searchValue);

    if (commandMap && showInput) processInput(commandMap);
};

main();
