import { describe, expect, it } from "vitest";
import { spawnWrapper } from "../utils/test-utils";

describe('invalid-cmd-opt.spec.ts', () => {
    it('should error with wrong cli opts', async () => {
        const cmd = "pnpm";
        const args = ['akio', 'test:stub'];
        const userInput = 'invalid input';

        const { stderr, exitCode } = await spawnWrapper(cmd, args, userInput);

        expect(exitCode).toBe(1);
        expect(stderr).toMatchSnapshot();
    });
});
