import { describe, expect, it } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('invalid-opts.spec.ts', () => {
    it('should swallow invalid cli opts and no-op', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '-a'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
