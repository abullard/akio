import { Colors } from "./colors";
import { formatError } from "./format-output";
import { spawn } from 'child_process';
import { getPkgManager, readPackageJson } from "./utils";
import readline from 'readline';

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
export const mapAndOutputCommands = (runner: string, searchValue: string | undefined, skipDescriptions: boolean): CommandMap | undefined => {
    let count = 0;
    const commandMap: CommandMap = {};
    // TODO AJB 05/28/2025: can't I just remove the packagejson reading and import now that TS is used?
    const pkg = readPackageJson();

    const descriptions = pkg.scriptDescriptions || {};

    if (!Object.entries(descriptions).length) {
        if(!skipDescriptions) {
            const noDescriptionsFound = "No descriptions found for your commands, you can add them via \"scriptDescriptions\", in your package.json";
            const suppressMessage = "You can suppress this message with -d\n"
            console.log(noDescriptionsFound);
            console.log(suppressMessage);
        }
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

        const description = pkg.scriptDescriptions?.[name] ?? '';
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
