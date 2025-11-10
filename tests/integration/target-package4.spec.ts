import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('target-package4.spec.ts', () => {
    it('should target no package and provide an error', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '@root', '-i'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
