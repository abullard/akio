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

    const options = commandLineArgs(definedOpts, { partial: true });

    if (options.help) {
        printHelpMenuAndHalt(definedOpts);
    }

    const showInput = options.input ? false : true;
    const showFormatting = options.format ? false : true;
    const skipDescriptions = options.descriptions ? false : true;
    const searchValue = options._unknown?.[0];

    return { showInput, showFormatting, searchValue, skipDescriptions };
}
