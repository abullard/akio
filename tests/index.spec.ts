import { describe, it, expect } from "vitest";
import { execa } from 'execa';

const expected = `
pnpm akio
\t-----
1. build      — 
2. build:dev  — local dev build
3. build:prod —  build production fake
`;

describe('index.ts', () => {
    it('should run test:stub npm script', async () => {
        const cmd = "pnpm";
        const args = ['akio', 'test:stub'];

        const subprocess = execa(cmd, args, {
            stdin: 'pipe'
        });

        subprocess.stdin!.write('1\n');
        subprocess.stdin!.end();

        const { stdout } = await subprocess;
        
        console.log(stdout);
        expect(stdout).toContain('text');

        // expect(stdout).toMatchSnapshot(expected);
    });
});
