import { describe, it, expect } from 'vitest';
import { Options } from '../../../src/types';
import { handleUnknowns } from '../../../src/cli-opts/cli-opts';

describe('cli-opts.ts', () => {
    describe('fn(handleUnknowns)', () => {
        it.each([
            [['@api', 'test'], { searchValue: 'test', targetPackage: 'api' }],
            [['build', '@ui'], { searchValue: 'build', targetPackage: 'ui' }],
            [['@ui'], { searchValue: undefined, targetPackage: 'ui' }],
            [['cert'], { searchValue: 'cert', targetPackage: undefined }],
            [[], { searchValue: undefined, targetPackage: undefined }],
        ])('should parse the correct unknown options', (input: string[], expected: Partial<Options>) => {
            const actual = handleUnknowns(input);
            expect(actual).toEqual(expected);
        });
    });
});
