import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('no-format2.spec.ts', () => {
    it('should turn formatting off, --format', async () => {
        const stubbedCommandForNoOp = 'test:stub';
        const skipInput = '-i';
        const cmd = 'pnpm';
        const args = ['akio', '--format', skipInput, stubbedCommandForNoOp];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
