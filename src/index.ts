#!/usr/bin/env node

import { Colors } from "./colors";

import { exec } from 'child_process';
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

const mapAndOutputCommands = () => {
    let count = 0;
    const commandMap: CommandMap = {};
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    const descriptions = pkg.scriptDescriptions || {};

    if (!Object.entries(descriptions).length) {
        console.error(`${Colors.red}❌ No scriptDescriptions in your package.json.${Colors.reset}\n`);
        process.exit(1);
    }

    console.log(`${Colors.yellow}pnpm akio${Colors.reset}`);
    console.log('\t-----');

    for (const [name, _] of Object.entries(pkg.scripts)) {
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
        console.error(`❌ Unknown command number: ${input}`);
        return;
    }

    const pkgManager = getRunner();

    const cmd = `${pkgManager} ${commandMap[input]}`;

    exec(cmd, (error: Error, stdout: string, stderr: string) => {
        if (error) {
            console.error(error);
            return;
        }

        if (stderr) {
            console.error(stderr);
            return;
        }

        console.log(stdout);
    });
};

const getRunner = () => {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';

    return 'npm run';
};

const main = () => {
    const commandMap = mapAndOutputCommands();
    processCommand(commandMap);
};

main();