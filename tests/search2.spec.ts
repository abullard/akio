import { describe, it, expect } from "vitest";
import { spawnWrapper } from "./test-utils";

describe('search2.spec.ts', () => {
    it('should support monorepo archeology and script execution', async () => {
        const cmd = "pnpm";
        const args = ['akio', 'test:stub'];

        const { stdout } = await spawnWrapper(cmd, args, '5');

        expect(stdout).toMatchSnapshot();
    });
});
