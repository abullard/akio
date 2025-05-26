import { formatError } from "./format-output";

type CliOptions = {
    showInput: boolean;
    showFormatting: boolean;
    searchValue?: string
};

export function processCliOpts(args = process.argv.slice(2)): CliOptions {
    let showInput = true;
    let showFormatting = true;

    const showInputOpts = ['-i', '--no-input'];
    const showFormattingOpts = ['-f', '--no-formatting'];
    const searchOpts = ['-s', '--search'];

    let searchValue = undefined;
    const allOpts = [...showInputOpts, ...showFormattingOpts, ...searchOpts];
    for(let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (!allOpts.includes(arg)) {
            formatError(`Invalid command line option: ${arg}`);
        }

        if (searchOpts.includes(arg)) {
            searchValue = args[++i];
        }

        if (showInputOpts.includes(arg)) showInput = false;
        if (showFormattingOpts.includes(arg)) showFormatting = false;
    }

    return { showInput, showFormatting, searchValue };
}