import { execFileSync } from 'child_process';
import fs from 'fs';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { glob } from 'glob';
import { findProjectRoot, readAllPkgJsons, pinRootFirst } from '../../src/utils';
import type { PackageScriptsAndDescriptions } from '../../src/types';

vi.mock('child_process');
vi.mock('fs');
vi.mock('glob', () => ({
    glob: vi.fn(),
}));
vi.mock('../../src/cli-opts/cli-opts', () => ({
    options: {},
}));

const mockProcessExit = () =>
    vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
    });

describe('findProjectRoot', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns the git repo toplevel path when inside a git repo', () => {
        vi.mocked(execFileSync).mockReturnValue(Buffer.from('/fake/repo/root\n'));

        expect(findProjectRoot()).toBe('/fake/repo/root');
    });

    it('falls back to cwd when not in a git repo but cwd has its own package.json', () => {
        vi.mocked(execFileSync).mockImplementation(() => {
            throw new Error('fatal: not a git repository');
        });
        vi.mocked(fs.existsSync).mockReturnValue(true);

        expect(findProjectRoot()).toBe(process.cwd());
    });

    it('errors when not in a git repo and cwd has no package.json of its own', () => {
        vi.mocked(execFileSync).mockImplementation(() => {
            throw new Error('fatal: not a git repository');
        });
        vi.mocked(fs.existsSync).mockReturnValue(false);
        const exitMock = mockProcessExit();
        const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => findProjectRoot()).toThrow('process.exit called');
        expect(exitMock).toHaveBeenCalledWith(1);
        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('No package.json found. akio must be run from within an npm project directory.')
        );
    });
});

describe('readAllPkgJsons', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('errors when no package.json is found anywhere in the project', async () => {
        vi.mocked(execFileSync).mockReturnValue(Buffer.from('/fake/repo/root'));
        vi.mocked(glob).mockResolvedValue([]);
        const exitMock = mockProcessExit();
        const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

        await expect(readAllPkgJsons()).rejects.toThrow('process.exit called');
        expect(exitMock).toHaveBeenCalledWith(1);
        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('No package.json found. akio must be run from within an npm project directory.')
        );
    });

    it('errors clearly when targeting @root but no root package.json exists', async () => {
        const cliOpts = await import('../../src/cli-opts/cli-opts');
        cliOpts.options.targetPackage = 'root';

        vi.mocked(execFileSync).mockReturnValue(Buffer.from('/fake/repo/root'));
        vi.mocked(glob).mockResolvedValue(['/fake/repo/root/frontend/vue-app/package.json']);
        const exitMock = mockProcessExit();
        const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

        await expect(readAllPkgJsons()).rejects.toThrow('process.exit called');
        expect(exitMock).toHaveBeenCalledWith(1);
        expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining('No root package.json found in this repository.'));
    });
});

describe('pinRootFirst', () => {
    const buildScript = (name: string, isRoot: boolean): PackageScriptsAndDescriptions[number] => ({
        name,
        version: '1.0.0',
        scripts: {},
        scriptDescriptions: {},
        isRoot,
        index: 0,
    });

    it('pins the root package first when one exists', () => {
        const scripts = [buildScript('zebra', false), buildScript('root-pkg', true), buildScript('apple', false)];

        const result = pinRootFirst(scripts);

        expect(result.map((x) => x.name)).toEqual(['root-pkg', 'apple', 'zebra']);
    });

    it('does not pin or crash when no package is the root (e.g. a mixed-stack repo with no root package.json)', () => {
        const scripts = [buildScript('zebra', false), buildScript('apple', false)];

        const result = pinRootFirst(scripts);

        expect(result.map((x) => x.name)).toEqual(['apple', 'zebra']);
    });
});
