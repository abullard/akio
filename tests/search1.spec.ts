import { describe, it, expect } from "vitest";
import { spawnWrapper } from "./test-utils";

describe('search1.spec.ts', () => {
    it('should run search for start npm scripts, skip input', async () => {
        const skipInput = '-i';
        const cmd = "pnpm";
        const args = ['akio', 'start', skipInput];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
