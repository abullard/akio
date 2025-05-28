import { Colors } from "./colors";
import readline from 'readline';
import path from 'path';
import fs from 'fs';
import { formatError } from "./format-output";
import { spawn } from 'child_process';
import { getPkgManager } from "./utils";

type CommandMap = Record<string, string>;

export const processInput = (commandMap: CommandMap) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`\n${Colors.blue}Run command number? >${Colors.reset} `, (input: string) => {
        console.log('\n');
        rl.close();
        executeCommand(commandMap, input);
    });
}

// TODO AJB 05/27/2025: refactor this, way too many things going on
export const mapAndOutputCommands = (runner: string, searchValue: string | undefined): CommandMap | undefined => {
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
        if (searchValue && !name.includes(searchValue)) continue; // skip this step, not apart of our search

        if (searchValue && count === 0) {
            console.log(`Found scripts matching: "${Colors.green}${searchValue}${Colors.reset}"\n`);
        }

        count++;

        const description = pkg.scriptDescriptions[name] ?? '';
        const formattedOutput = `${count}. ${Colors.purple}${name.padEnd(10)}${Colors.reset} — ${description}`;
        commandMap[count] = name;

        console.log(formattedOutput);
    }

    if (Object.entries(commandMap).length === 0) {
        console.log(`❌ Found no scripts matching: "${Colors.red}${searchValue}${Colors.reset}"\n`);
        return undefined;
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
