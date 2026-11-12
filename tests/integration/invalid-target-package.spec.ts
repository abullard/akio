import { describe, expect, it } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('invalid-target-package.spec.ts', () => {
    it('should error on an unrecognized target package', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '@dog'];

        const { stderr, exitCode } = await spawnWrapper(cmd, args);

        expect(exitCode).toBe(1);
        expect(stderr).toMatchSnapshot();
    });
});
