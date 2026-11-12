import { describe, it, expect } from 'vitest';
import { spawnWrapper } from '../utils/test-utils';

describe('target-package-mismatched-folder.spec.ts', () => {
    it('targets a package by its package.json name even though it differs from the folder name (packages/mismatch-fixture, name "fixture-pkg")', async () => {
        const cmd = 'pnpm';
        const args = ['akio', '@fixture-pkg', 'test:stub', '-i'];

        const { stdout } = await spawnWrapper(cmd, args);

        expect(stdout).toMatchSnapshot();
    });
});
