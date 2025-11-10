import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('target-package2.spec.ts', () => {
    it('should target the api package', async () => {
        const cmd = 'pnpm';
        const args = ['akio', 'test:stub', '@api', '-i'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
