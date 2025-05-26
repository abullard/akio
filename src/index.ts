#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { disableColors, Colors } from "./colors";
import { exec, ExecException } from 'child_process';
import { processCliOpts } from "./cli-opts";
import { formatError } from './format-output';

type CommandMap = Record<string, string>;

const processCommand = (commandMap: CommandMap) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('\nRun command number? ', (input: string) => {
        console.log('\n');
        rl.close();
        executeCommand(commandMap, input);
    });
}

const mapAndOutputCommands = (runner: string) => {
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
        if(name === 'akio') continue;
        
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

    const cmd = `${pkgManager} ${commandMap[input]}`;
    const execCallback = (error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => {
        if (error) {
            console.error(error);
            return;
        }

        if (stderr) {
            console.error(stderr);
            return;
        }

        console.log(stdout);
    };
    const emptyOpts = {};

    exec(cmd, emptyOpts, execCallback);
};

const getPkgManager = () => {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';

    return 'npm run';
};

const main = () => {
    const { showInput, showFormatting } = processCliOpts();
    const pkgManager = getPkgManager();

    if(!showFormatting) disableColors();

    const commandMap = mapAndOutputCommands(pkgManager);

    if (showInput) processCommand(commandMap);
};

main();
