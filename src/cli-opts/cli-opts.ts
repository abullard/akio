import commandLineArgs from 'command-line-args';
import type { Options } from 'src/types';
import { printHelpMenuAndHalt } from './cli-opts-help';
import { definedOpts } from './defined-options';

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
    const {
        help,
        input,
        format,
        descriptions,
        pin,
        _unknown: others,
    } = commandLineArgs(definedOpts, { partial: true });

    if (help) printHelpMenuAndHalt();

    return {
        input,
        format,
        descriptions,
        pin,
        ...(others ? handleUnknowns(others) : {}),
    };
};

export const options: Options = {
    ...buildOptions(),
};
