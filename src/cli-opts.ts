import commandLineArgs, { OptionDefinition } from 'command-line-args';

type CliOptions = {
    showInput: boolean;
    showFormatting: boolean;
    skipDescriptions: boolean;
    searchValue?: string;
};

export function processCliOpts(): CliOptions {
    const optionDefinitions: OptionDefinition[] = [
        {
            name: 'input',
            alias: 'i',
            type: Boolean,
        },
        {
            name: 'format',
            alias: 'f',
            type: Boolean,
        },
        {
            name: 'descriptions',
            alias: 'd',
            type: Boolean,
        },
        {
            name: 'verbose',
            alias: 'v',
            type: Boolean,
        },
        {
            name: 'help',
            alias: 'h',
            type: Boolean,
        },
    ];

    const options = commandLineArgs(optionDefinitions, { partial: true });
    const showInput = options.input ? false : true;
    const showFormatting = options.format ? false : true;
    const skipDescriptions = options.descriptions ? false : true;
    const searchValue = options._unknown?.[0];

    return { showInput, showFormatting, searchValue, skipDescriptions };
}
