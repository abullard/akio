#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { disableColors, Colors } from "./colors";
import { spawn } from 'child_process';
import { processCliOpts } from "./cli-opts";
import { formatError } from './format-output';

type CommandMap = Record<string, string>;

const processCommand = (commandMap: CommandMap) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`\n${Colors.green}Run command number?${Colors.reset} `, (input: string) => {
        console.log('\n');
        rl.close();
        executeCommand(commandMap, input);
    });
}

const mapAndOutputCommands = (runner: string, searchValue: string | undefined) => {
    let count = 0;
    const commandMap: CommandMap = {};
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    const descriptions = pkg.scriptDescriptions || {};

    if (!Object.entries(descriptions).length) {
        formatError('No scriptDescriptions in your package.json.');
    }

    console.log(`${Colors.yellow}${runner} akio${Colors.reset}`);
    console.log('\t-----');

    for (const [name, _] of Object.entries(pkg.scripts)) {
        if (name === 'akio') continue;  // not a valid option
        if(searchValue && !name.includes(searchValue)) continue; // skip this step, not apart of our search
        
        count++;

        const description = pkg.scriptDescriptions[name] ?? '';
        const formattedOutput = `${count}. ${Colors.purple}${name.padEnd(10)}${Colors.reset} — ${description}`;
        commandMap[count] = name;

        console.log(formattedOutput);
    }

    return commandMap;
};

const executeCommand = (commandMap: CommandMap, input: string) => {
    if (!commandMap[input]) {
        formatError(`Unknown command number: ${input}`);
    }

    const pkgManager = getPkgManager();
    const isNpm = pkgManager === 'npm' ? 'run' : '';
    const args = [isNpm, commandMap[input]];

    const child = spawn(pkgManager, args, {
        stdio: 'inherit',
        shell: true
    });

    child.on('exit', (code: number) => {
        process.exit(code); 
    });
};

const getPkgManager = () => {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';

    return 'npm';
};

const main = () => {
    const { showInput, showFormatting, searchValue } = processCliOpts();
    const pkgManager = getPkgManager();

    if (!showFormatting) disableColors();

    const commandMap = mapAndOutputCommands(pkgManager, searchValue);

    if (showInput) processCommand(commandMap);
};

main();
