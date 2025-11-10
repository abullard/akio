import commandLineArgs from 'command-line-args';
import { printHelpMenuAndHalt } from './cli-opts-help';
import { Options, UsageOptionDefintions } from 'src/types';

export const handleUnknowns = (
    others: string[]
): { searchValue: string | undefined; targetPackage: string | undefined } => {
    let targetPackage: string | undefined;
    let searchValue: string | undefined;
    const packageIndex = others.findIndex((x) => x.startsWith('@'));

    if (packageIndex > -1) {
        targetPackage = others[packageIndex].split('@')[1];
        const searchValueIndex = packageIndex === 0 ? 1 : 0;
        searchValue = others[searchValueIndex];
    } else {
        searchValue = others.length ? others[0] : undefined;
    }

    return {
        searchValue,
        targetPackage,
    };
};

const buildOptions = (): Options => {
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

    const { help, input, format, descriptions, _unknown: others } = commandLineArgs(definedOpts, { partial: true });

    if (help) printHelpMenuAndHalt(definedOpts);

    return {
        input,
        format,
        descriptions,
        ...(others ? handleUnknowns(others) : {}),
    };
};

export const processCliOpts = () => {
    return {
        showInput: !options.input,
        showFormatting: !options.format,
        skipDescriptions: options.descriptions,
        searchValue: options.searchValue,
    };
};

export const options: Options = {
    ...buildOptions(),
};
