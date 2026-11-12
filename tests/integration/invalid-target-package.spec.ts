import { describe, expect, it } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('invalid-target-package.spec.ts', () => {
  it('should swallow invalid cli opts and no-op', async () => {

      const invalidTargetPackage = async () => {
          const cmd = 'pnpm';
          const args = ['akio', '@dog'];

          const {stderr} = await spawnWrapper(cmd, args);
          expect(stderr).toMatchSnapshot();
      }

      await expect(() => invalidTargetPackage()).rejects.toThrow();
    });
});
