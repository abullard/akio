import { execa } from 'execa';
import { readAllPkgJsons } from '../../src/utils';

export const spawnWrapper = async (cmd: string, args: string[], input?: string) => {
    const userPromptedInputOpt = {
        stdin: 'pipe',
    };

    // pin this NPM package version. This'll keep the snapshot tests from checking for version updates.
    args.push('--pin');

    const subprocess = execa(cmd, args, input ? { ...userPromptedInputOpt } : {});

    if (input) {
        subprocess.stdin!.write(`${input}\n`);
        subprocess.stdin!.end();
    }

    const response = await subprocess;

    return {
        ...response,
        stdout: await removeHeaderText(response),
    };
};

const removeHeaderText = async (response: any) => {
    const { stdout } = response;

    if (!stdout) return;

    const lineList = stdout.split(/\r?\n/);
    const pkgs = await readAllPkgJsons();
    const pkgAndVersions = pkgs.map((pkg) => {
        const { name, version } = pkg;
        return `${name}@${version}`;
    });

    const normalizedLines = lineList.filter((line: string) => shouldKeepLineInOutput(pkgAndVersions, line));

    return normalizedLines.join('\n');
};

const shouldKeepLineInOutput = (pkgAndVersions: string[], line: string) => {
    const pnpmOutputLine = line.startsWith('> pnpm') || line.startsWith('> node');
    const hasPkgId = pkgAndVersions.some((targetLineIdentifier) => line.includes(targetLineIdentifier));

    return pnpmOutputLine === false && hasPkgId === false;
};
