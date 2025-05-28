import { describe, expect, it } from "vitest";
import { spawnWrapper } from "./test-utils";

describe('invalid-cmd-opt.spec.ts', () => {
    it('should error with wrong cli opts', async () => {
        const writeInvalidCommandOption = async () => {
            const cmd = "pnpm";
            const args = ['akio', 'test:stub'];
            const userInput = 'invalid input';

            await spawnWrapper(cmd, args, userInput);
        };

        await expect(() => writeInvalidCommandOption()).rejects.toThrow();
    });
});