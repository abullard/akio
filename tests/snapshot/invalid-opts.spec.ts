import { describe, expect, it } from "vitest";
import { spawnWrapper } from "../utils/test-utils";

describe('invalid-opts.spec.ts', () => {
    it('should error with wrong cli opts', async () => {
        const cmd = "pnpm";
        const args = ['akio', '-a'];

        await expect(() => spawnWrapper(cmd, args)).rejects.toThrow();
    });
});