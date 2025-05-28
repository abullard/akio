#!/usr/bin/env node

import { disableColors } from "./colors";
import { processCliOpts } from "./cli-opts";
import { mapAndOutputCommands, processInput } from "./command";
import { getPkgManager } from "./utils";

// TODO AJB 05/26/2025: 
/*
    1. test the heck outta this
    2. add build and test pipeline to PR
    3. remove emoji when -f passed
    4. get npmjs account fixed
    5. publish this to npm
*/
const main = () => {
    const { showInput, showFormatting, searchValue } = processCliOpts();
    const pkgManager = getPkgManager();

    if (!showFormatting) disableColors();

    const commandMap = mapAndOutputCommands(pkgManager, searchValue);

    if (commandMap && showInput) processInput(commandMap);
};

main();
