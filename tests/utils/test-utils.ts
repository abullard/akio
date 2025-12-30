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

    const pkgs = await readAllPkgJsons();
    let lines = stdout.split(/\r?\n/);

    for (const pkg of pkgs) {
        const { name, version } = pkg;
        const targetLineIdentifier = `${name}@${version}`;

        lines = lines.filter((l: string) => !l.includes(targetLineIdentifier));
    }

    console.log('AJB: lines[1]: ', lines[1]);
    lines[1] = normalizeCliOpts(lines[1]);

    return lines.join('\n');
};

const normalizeCliOpts = (line: string) => line.replace(/"/g, '');
