import { describe, it, expect } from 'vitest';
import { needsUpdate } from '../../src/utils';

describe('utils.ts', () => {
    describe('fn(needsUpdate)', () => {
        it.each([
            ['1.1.1', '1.1.2', true],
            ['1.1.7', '1.2.0', true],
            ['2.15.1', '3.0.0', true],
            ['1.1.5', '1.1.4', false],
            ['1.1.4', '1.1.4', false],
            ['a', 'b', false],
        ])('should properly handle version comparison', (curr, npmjs, expected) => {
            const actual = needsUpdate(curr, npmjs);

            expect(actual).toEqual(expected);
        });
    });
});
