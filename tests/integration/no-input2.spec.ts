import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('no-input2.spec.ts', () => {
    it('should skip prompting user for input, --input', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '--input'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
