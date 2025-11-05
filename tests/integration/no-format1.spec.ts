import { describe, it, expect } from "vitest";
import { spawnWrapper } from "../utils/test-utils";

describe('no-format1.spec.ts', () => {
    it('should turn formatting off, -f', async () => {
        const stubbedCommandForNoOp = 'test:stub';
        const skipInput = '-i';
        const cmd = "pnpm";
        const args = ['akio', '-f', skipInput, stubbedCommandForNoOp];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
