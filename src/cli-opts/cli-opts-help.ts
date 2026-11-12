import commandLineUsage from 'command-line-usage';
import { emojiWithSpace } from 'src/formatting/emoji';
import { Colors } from 'src/formatting/colors';
import { definedOpts } from './defined-options';

export const printHelpMenuAndHalt = () => {
    const usage = commandLineUsage([
        {
            header: `${emojiWithSpace('WAND')}${Colors.yellow}akio${Colors.reset}`,
            content:
                'Free your brain from npm script chaos–Akio helps you search, understand, and run your project scripts fast.',
        },

        {
            header: 'Usage Examples:',
            content:
              `# search root package.json for scripts containing "test"
              $ akio @root test

              # search the second discovered package for scripts containing "build"
              $ akio @1 build

              # search exact package name for scripts containing "coverage"
              $ akio @client coverage
              `,
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
