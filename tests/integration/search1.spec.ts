import { describe, it, expect } from "vitest";
import { spawnWrapper } from "../utils/test-utils";

describe('search1.spec.ts', () => {
    it('should run search for test npm scripts, skip input', async () => {
        const skipInput = '-i';
        const cmd = "pnpm";
        const args = ['akio', 'build', skipInput];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
