import { describe, it, expect } from "vitest";
import { spawnWrapper } from "./test-utils";

describe('search2.spec.ts', () => {
    it('should run search for test:sub npm scripts, run test:stub', async () => {
        const cmd = "pnpm";
        const args = ['akio', 'test:stub'];

        // TODO AJB 05/28/2025: inputting a command casues pnpm headers to print, failing the test in the CI/CD pipeline
        const { stdout } = await spawnWrapper(cmd, args, '1');

        expect(stdout).toMatchSnapshot();
    });
});
