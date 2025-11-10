import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('target-package3.spec.ts', () => {
    it('should target the root package', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '@root', '-i'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
