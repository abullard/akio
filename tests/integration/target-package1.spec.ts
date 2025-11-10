import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('target-package1.spec.ts', () => {
    it('should target the ui package', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '@ui', 'test:stub', '-i'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
