import { formatError } from "./format-output";

type CliOptions = {
    showInput: boolean;
    showFormatting: boolean;
    searchValue?: string
};

const InputOpts: Record<string, string[]> = {
    showInputOpts: ['-i', '--no-input'],
    showFormattingOpts: ['-f', '--no-formatting'],
    searchOpts: ['-s', '--search'],
};

export function processCliOpts(args = process.argv.slice(2)): CliOptions {
    let showInput = true;
    let showFormatting = true;
    let searchValue = undefined;
    const allOpts = buildAllOptsList();

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (InputOpts.searchOpts.includes(arg)) {
            searchValue = args[++i];
        }

        if (InputOpts.showInputOpts.includes(arg)) showInput = false;
        if (InputOpts.showFormattingOpts.includes(arg)) showFormatting = false;

        // treat first unknown (non-flag) value as an implicit search
        const isFlag = arg.startsWith('-');
        if (!isFlag && searchValue === undefined) {
            searchValue = arg;
        } else if (!allOpts.includes(arg)) {
            formatError(`Invalid command line option: ${arg}`);
        }
    }

    return { showInput, showFormatting, searchValue };
}

const buildAllOptsList = () => {
    const allOpts: string[] = [];

    for (const [_, value] of Object.entries(InputOpts)) {

        allOpts.push(...value);
    }

    return allOpts;
}