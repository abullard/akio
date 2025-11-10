import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('search2.spec.ts', () => {
    it('should support monorepo archeology and script execution', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '@root', '-i'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
