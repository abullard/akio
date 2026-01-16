import type { UsageOptionDefintions } from 'src/types';

export const definedOpts: UsageOptionDefintions[] = [
    {
        name: 'descriptions',
        alias: 'd',
        type: Boolean,
        description: 'Do not warn if package.json "scriptDescriptions" are missing.',
    },
    {
        name: 'format',
        alias: 'f',
        type: Boolean,
        description: 'Do not include emoji or color formatting.',
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Display this usage guide.',
    },
    {
        name: 'input',
        alias: 'i',
        type: Boolean,
        description: 'Do not prompt for an input command.',
    },
    {
        name: 'pin',
        alias: 'p',
        type: Boolean,
        description: 'Pin the version of this package (skips update available check).',
    },
    // {
    //     name: 'verbose',
    //     alias: 'v',
    //     type: Boolean,
    //     description: 'Print warning logs.',
    // },
];
