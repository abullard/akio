import { describe, it, expect } from "vitest";
import { execa } from 'execa';

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
        expect(stdout).toMatchSnapshot();
    });

    it('should run search for build scripts', async () => {
        const cmd = "pnpm";
        const args = ['akio', '-i', 'build'];

        const { stdout } = await execa(cmd, args, {});

        expect(stdout).toMatchSnapshot();
    });

    it('should turn formatting off', async () => {
        const cmd = "pnpm";
        const args = ['akio', '-f'];

        // TODO AJB 05/26/2025: make all of these tests normalized, and run one at a time
        const { stdout } = await execa(cmd, args, {});

        expect(stdout).toMatchSnapshot();
    });

    it('should error with wrong cli opts', async () => {
        const cmd = "pnpm";
        const args = ['akio', '-a'];

        await expect(() => execa(cmd, args, {})).rejects.toThrow();
    });
});
