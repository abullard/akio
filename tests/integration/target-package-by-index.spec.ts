import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('target-package-by-index.spec.ts', () => {
    it('targets a package by its numeric position in the sorted package list', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '@2', 'test:stub', '-i'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
