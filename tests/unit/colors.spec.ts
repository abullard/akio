import { it, describe, expect } from 'vitest';
import { Colors, disableColors } from '../../src/formatting/colors';

describe('colors.ts', () => {
    it.each([
        ['purple', ''],
        ['blue', ''],
        ['yellow', ''],
        ['green', ''],
        ['red', ''],
        ['reset', ''],
    ])('should return an empty string when Colors are disabled', (option: string, expected: string) => {
        disableColors();

        expect(Colors[option]).toEqual(expected);
    });
});
