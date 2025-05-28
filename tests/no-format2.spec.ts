import { describe, it, expect } from "vitest";
import { spawnWrapper } from "./test-utils";

describe('no-format2.spec.ts', () => {
    it('should turn formatting off, --no-format', async () => {
        const stubbedCommandForNoOp = 'test:stub';
        const skipInput = '-i';
        const cmd = "pnpm";
        const args = ['akio', '--no-format', skipInput, stubbedCommandForNoOp];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
