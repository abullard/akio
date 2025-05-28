import { describe, it, expect } from "vitest";
import { spawnWrapper } from "./test-utils";

describe('no-input1.spec.ts', () => {
    /*
        1. search #1 w/input
        2. search #2 w/diff input
        3. --no-input
        4. -i
        5. --no-format
        6. -f  
        7. invalid cli-opts x
        8. invalid command number
    */
    it('should skip prompting user for input, -i', async () => {
        const cmd = "pnpm";
        const args = ['akio', '-i'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
