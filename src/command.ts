import { spawn } from 'child_process';
import readline from 'readline';
import { options } from './cli-opts/cli-opts';
import { Colors } from './formatting/colors';
import { emojiWithSpace } from './formatting/emoji';
import { formatError } from './formatting/format-output';
import type { ScriptsDescribed } from './types';
import { getPkgManager, readAllPkgJsons } from './utils';

type CommandMap = Record<string, string>;

export const processInput = (commandMap: CommandMap) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question(`\n${Colors.blue}Run command number? >${Colors.reset} `, (input: string) => {
        console.log('\n');
        rl.close();
        executeCommand(commandMap, input);
    });
};

export const mapAndOutputCommands = async (runner: string): Promise<CommandMap | undefined> => {
    let commandMap = {};
    const counter = { value: 0 };
    const searchValue = options.searchValue;
    const scriptsAndDescriptionsByPkg = await readAllPkgJsons();
    const pkgManager = getPkgManager();

    console.log(`${Colors.yellow}${runner} akio${Colors.reset}`);
    console.log('\t-----');

    for (const pkg of scriptsAndDescriptionsByPkg) {
        commandMap = {
            ...commandMap,
            ...buildScriptMap(pkg, counter, pkgManager),
        };
    }

    if (Object.entries(commandMap).length === 0) {
        console.log(
            `${emojiWithSpace('ERROR')}Found no scripts matching: "${Colors.red}${searchValue}${Colors.reset}"\n`
        );
        return undefined;
    }

    return commandMap;
};

const buildScriptMap = (
    packageScriptsAndDescriptions: ScriptsDescribed,
    counter: { value: number },
    pkgManager: string
): CommandMap | undefined => {
    const commandMap: CommandMap = {};
    const searchValue = options.searchValue;
    const { name: monorepoPkgName, scriptDescriptions, isRoot, index } = packageScriptsAndDescriptions;
    const packageLabel = `${monorepoPkgName} ${isRoot ? `(root | @${index})` : `(@${index})`}`;

    console.log(`${emojiWithSpace('PACKAGE')}${Colors.blue}${packageLabel}${Colors.reset}`);

    if (!Object.entries(scriptDescriptions).length) {
        if (!options.descriptions) {
            const noDescriptionsFound = `${emojiWithSpace('WARN')}No descriptions found for your commands, you can add them via \"scriptDescriptions\", in your package.json`;
            const suppressMessage = `${emojiWithSpace('MAINTANENCE')}You can suppress this message with -d\n`;
            console.log(noDescriptionsFound);
            console.log(suppressMessage);
        }
    }

    for (const [name] of Object.entries(packageScriptsAndDescriptions.scripts)) {
        if (name === 'akio') continue; // not a valid option
        if (searchValue && !name.includes(searchValue)) continue; // skip this step, not apart of our search

        counter.value++;

        const description = scriptDescriptions?.[name] ?? '';
        const formattedOutput = `${counter.value}. ${Colors.purple}${name.padEnd(10)}${Colors.reset} — ${description}`;

        commandMap[counter.value] = buildRunCommand(pkgManager, monorepoPkgName, name, isRoot);

        console.log(formattedOutput);
    }

    console.log();

    return commandMap;
};

/*
  Builds workspace-targeted scripts directly (pnpm --filter / yarn workspace /
  npm --workspace) instead of relying on the target package also having a
  root-level passthrough script (e.g. "ui": "pnpm --filter ui") - so akio works
  without any extra per-package setup in the consuming repo.
 */
const buildRunCommand = (pkgManager: string, pkgName: string, script: string, isRoot: boolean): string => {
    if (isRoot) return `${pkgManager} run ${script}`;

    switch (pkgManager) {
        case 'yarn':
            return `yarn workspace ${pkgName} run ${script}`;
        case 'npm':
            return `npm run ${script} --workspace=${pkgName}`;
        default:
            return `pnpm --filter ${pkgName} run ${script}`;
    }
};

const executeCommand = (commandMap: CommandMap, input: string) => {
    if (!commandMap[input]) {
        formatError(`Unknown command number: ${input}`);
    }

    // The full command already includes the package manager; passing it as a
    // single string (rather than `args` alongside `shell: true`) avoids Node's
    // DEP0190 deprecation warning around shell-escaping of spawn args.
    const child = spawn(commandMap[input], {
        stdio: 'inherit',
        shell: true,
    });

    child.on('exit', (code: number) => {
        process.exit(code);
    });
};
