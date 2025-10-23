import { describe, it, expect } from "vitest";
import { spawnWrapper } from "../utils/test-utils";

describe('no-input1.spec.ts', () => {
    it('should skip prompting user for input, -i', async () => {
        const cmd = "pnpm";
        const args = ['akio', '-i'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
