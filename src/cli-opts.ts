import { formatError } from "./format-output";

type CliOptions = {
    showInput: boolean;
    showFormatting: boolean;
};

export function processCliOpts(args = process.argv.slice(2)): CliOptions {
    let showInput = true;
    let showFormatting = true;

    const showInputOpts = ['-i', '--no-input'];
    const showFormattingOpts = ['-f', '--no-formatting'];

    for (const arg of args) {
        if (!showInputOpts.concat(showFormattingOpts).includes(arg)) {
            formatError(`Invalid command line option: ${arg}`);
        }

        if (showInputOpts.includes(arg)) showInput = false;
        if (showFormattingOpts.includes(arg)) showFormatting = false;
    }

    return { showInput, showFormatting };
}