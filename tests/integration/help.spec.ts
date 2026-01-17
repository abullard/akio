import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('help.spec.ts', () => {
    it('should output help menu', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '--help'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
