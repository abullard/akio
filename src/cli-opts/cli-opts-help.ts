import commandLineUsage from 'command-line-usage';
import { Colors } from 'src/formatting/colors';
import { emojiWithSpace } from 'src/formatting/emoji';
import { UsageOptionDefintions } from 'src/types';

export const printHelpMenuAndHalt = (definedOpts: UsageOptionDefintions[]) => {
    const usage = commandLineUsage([
        {
            header: `${emojiWithSpace('WAND')}${Colors.yellow}akio${Colors.reset}`,
            content:
                `Surface your ${Colors.green}package.json${Colors.reset} scripts` +
                ` from the depths of your ${Colors.purple}monorepo${Colors.reset}.`,
        },
        {
            header: 'CLI Opts',
            optionList: definedOpts,
        },
        {
            content: '{underline https://npmjs.com/@abullard/akio}',
        },
    ]);

    console.log(usage);
    process.exit(0);
};
