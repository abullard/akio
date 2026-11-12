import { describe, expect, it } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('invalid-target-package.spec.ts', () => {
    it('should error on an unrecognized target package number', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '@999'];

        const { stderr, exitCode } = await spawnWrapper(cmd, args);

        expect(exitCode).toBe(1);
        expect(stderr).toMatchSnapshot();
    });

    it('should error on an unrecognized target package name', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '@dog'];

        const { stderr, exitCode } = await spawnWrapper(cmd, args);

        expect(exitCode).toBe(1);
        expect(stderr).toMatchSnapshot();
    });
});
