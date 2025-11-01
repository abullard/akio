import commandLineArgs from 'command-line-args';
import { printHelpMenuAndHalt, UsageOptionDefintions } from './cli-opts-help';

type CliOptions = {
    showInput: boolean;
    showFormatting: boolean;
    skipDescriptions: boolean;
    searchValue?: string;
};

export function processCliOpts(): CliOptions {
    const definedOpts: UsageOptionDefintions[] = [
        {
            name: 'input',
            alias: 'i',
            type: Boolean,
            description: 'Do not prompt for an input comand.',
        },
        {
            name: 'format',
            alias: 'f',
            type: Boolean,
            description: 'Do not include emoji or color formatting.',
        },
        {
            name: 'descriptions',
            alias: 'd',
            type: Boolean,
            description: 'Do not warn if package.json "scriptDescriptions" are missing.',
        },
        {
            name: 'help',
            alias: 'h',
            type: Boolean,
            description: 'Display this usage guide.',
        },
        // {
        //     name: 'verbose',
        //     alias: 'v',
        //     type: Boolean,
        //     description: 'Print warning logs.',
        // },
    ];

    const { help, input, format, descriptions, _unknown } = commandLineArgs(definedOpts, { partial: true });

    if (help) printHelpMenuAndHalt(definedOpts);

    return {
        showInput: !input,
        showFormatting: !format,
        skipDescriptions: !descriptions,
        searchValue: _unknown?.[0],
    };
}
