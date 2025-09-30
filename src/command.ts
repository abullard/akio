import { Colors } from "./colors";
import { formatError } from "./format-output";
import { spawn } from 'child_process';
import { getPkgManager, readAllPkgJsons, ScriptsDescribed } from "./utils";
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

export const mapAndOutputCommands = async (
    runner: string,
    searchValue: string | undefined,
    skipDescriptions: boolean
): Promise<CommandMap | undefined> => {
    let commandMap = {};
    let counter = { value: 0 };
    const scriptsAndDescriptionsByPkg = await readAllPkgJsons();

    console.log(`${Colors.yellow}${runner} akio${Colors.reset}`);
    console.log('\t-----');

    for (const pkg of scriptsAndDescriptionsByPkg) {
        commandMap = {
            ...commandMap,
            ...buildScriptMap(pkg, searchValue, skipDescriptions, counter),
        } 
    }
    
    if (Object.entries(commandMap).length === 0) {
        console.log(`❌ Found no scripts matching: "${Colors.red}${searchValue}${Colors.reset}"\n`);
        return undefined;
    }

    return commandMap;
};

const buildScriptMap = (
    packageScriptsAndDescriptions: ScriptsDescribed,
    searchValue: string | undefined,
    skipDescriptions: boolean,
    counter: { value: number }
): CommandMap | undefined => {
    const commandMap: CommandMap = {};
    const { name: monorepoPkgName, scriptDescriptions, isRoot } = packageScriptsAndDescriptions;

    console.log(`📦 ${Colors.blue}${monorepoPkgName}${Colors.reset}`);

    if (!Object.entries(scriptDescriptions).length) {
        if (!skipDescriptions) {
            const noDescriptionsFound = "No descriptions found for your commands, you can add them via \"scriptDescriptions\", in your package.json";
            const suppressMessage = "You can suppress this message with -d\n"
            console.log(noDescriptionsFound);
            console.log(suppressMessage);
        }
    }

    for (const [name, _] of Object.entries(packageScriptsAndDescriptions.scripts)) {
        if (name === 'akio') continue;  // not a valid option
        if (searchValue && !name.includes(searchValue)) continue; // skip this step, not apart of our search

        if (searchValue && counter.value === 0) {
            console.log(`Found scripts matching: "${Colors.green}${searchValue}${Colors.reset}"\n`);
        }

        counter.value++;

        const description = scriptDescriptions?.[name] ?? '';
        const formattedOutput = `${counter.value}. ${Colors.purple}${name.padEnd(10)}${Colors.reset} — ${description}`;
        
        // TODO AJB 09/12/2025: you need to document how to setup pnpm workspaces, and include npm restrictions in the readme
        // TODO AJB 09/12/2025: ignore commands that are just pnpm package command passthroughs?
        // TODO AJB 09/12/2025: create the package selector flow
        // TODO AJB 09/12/2025: rework cli options once all of this is done
        // Root package scripts skip the workspace prefix so pnpm run:local behaves normally.
        const command = isRoot ? name : `${monorepoPkgName} ${name}`;
        commandMap[counter.value] = command;

        console.log(formattedOutput);
    }

    console.log();

    return commandMap;
};

const executeCommand = (commandMap: CommandMap, input: string) => {
    if (!commandMap[input]) {
        formatError(`Unknown command number: ${input}`);
    }

    const pkgManager = getPkgManager();
    const isNpm = pkgManager === 'npm' ? 'run' : '';
    const args = [isNpm, commandMap[input]];

    console.log(pkgManager, args);

    const child = spawn(pkgManager, args, {
        stdio: 'inherit',
        shell: true
    });

    child.on('exit', (code: number) => {
        process.exit(code);
    });
};
