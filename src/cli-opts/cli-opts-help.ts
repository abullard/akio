import commandLineUsage from 'command-line-usage';
import { Colors } from 'src/formatting/colors';
import { emojiWithSpace } from 'src/formatting/emoji';
import { UsageOptionDefintions } from 'src/types';

export const printHelpMenuAndHalt = (definedOpts: UsageOptionDefintions[]) => {
    const usage = commandLineUsage([
        {
            header: `${emojiWithSpace('WAND')}${Colors.yellow}akio${Colors.reset}`,
            content:
                'Free your brain from npm script chaos–Akio helps you search, understand, and run your project scripts fast.',
        },
        {
            header: 'CLI Opts',
            optionList: definedOpts,
        },
        {
            content: '{underline https://npmjs.com/package/@abullard/akio}',
        },
    ]);

    console.log(usage);
    process.exit(0);
};
