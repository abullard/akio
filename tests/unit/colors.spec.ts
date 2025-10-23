import { it, describe, expect } from "vitest";
import { Colors, disableColors } from "../../src/colors"

describe('colors.ts', () => {
  it.each([
    ['purple', '\x1b[35m'],
    ['blue', '\x1b[34m'],
    ['yellow', '\x1b[33m'],
    ['green', '\x1b[32m'],
    ['red', '\x1b[31m'],
    ['reset',  '\x1b[0m'],
  ])
    ('should return an empty string when Colors are disabled', (option: string, expected: string) => {

      expect(Colors[option]).toEqual(expected);
    });
});
