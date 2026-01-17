import { describe, expect, it } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('invalid-target-package.spec.ts', () => {
    it('should swallow invalid cli opts and no-op', async () => {
        const invalidTargetPackage = async () => {
            const cmd = 'pnpm';
            const args = ['akio', '@dog'];

            await spawnWrapper(cmd, args);
        };

        await expect(() => invalidTargetPackage()).rejects.toThrow();
    });
});
