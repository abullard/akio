import { execa } from 'execa';
import { readAllPkgJsons } from '../../src/utils';

export const spawnWrapper = async (cmd: string, args: string[], input?: string) => {
    const userPromptedInputOpt = {
        stdin: 'pipe',
    };

    // pin this NPM package version. This'll keep the snapshot tests from checking for version updates.
    args.push('--pin');

    // don't throw on a non-zero exit - error-path tests need the output, not just a rejection.
    const subprocess = execa(cmd, args, { reject: false, ...(input ? userPromptedInputOpt : {}) });

    if (input) {
        subprocess.stdin!.write(`${input}\n`);
        subprocess.stdin!.end();
    }

    const response = await subprocess;

    return {
        ...response,
        stdout: await removeHeaderText(response.stdout),
        stderr: await removeHeaderText(response.stderr),
    };
};

const removeHeaderText = async (output: string | undefined) => {
    if (!output) return;

    const lineList: string[] = output.split(/\r?\n/);
    const pkgs = await readAllPkgJsons();
    const pkgAndVersions = pkgs.map((pkg) => {
        const { name, version } = pkg;
        return `${name}@${version}`;
    });

    const wrapperLineIndexes = lineList.reduce<number[]>((indexes, line, index) => {
        if (!shouldKeepLineInOutput(pkgAndVersions, line)) indexes.push(index);
        return indexes;
    }, []);

    const removableIndexes = new Set(wrapperLineIndexes);

    /*
      Package-manager wrappers (e.g. pnpm) surround their own command-echo
      lines with a blank line on each side; whether they do at all varies by
      package manager version (CI's pinned pnpm vs a dev's local one). There
      can be more than one such block in a single run's output - e.g. akio's
      own startup echo, plus another when it spawns a chosen script via
      `pnpm <script>` - so flanking blanks are stripped per contiguous block
      of wrapper lines, not just around the first/last one overall. Nothing
      beyond each block's immediate blank neighbors is touched, so content
      in between - including akio's own intentional blank lines - stays put.
     */
    const wrapperRuns: Array<{ start: number; end: number }> = [];
    for (const index of wrapperLineIndexes) {
        const lastRun = wrapperRuns[wrapperRuns.length - 1];

        if (lastRun && index === lastRun.end + 1) {
            lastRun.end = index;
        } else {
            wrapperRuns.push({ start: index, end: index });
        }
    }

    for (const run of wrapperRuns) {
        if (lineList[run.start - 1] === '') removableIndexes.add(run.start - 1);
        if (lineList[run.end + 1] === '') removableIndexes.add(run.end + 1);
    }

    const normalizedLines = lineList.filter((_, index) => !removableIndexes.has(index));

    return normalizedLines.join('\n');
};

const shouldKeepLineInOutput = (pkgAndVersions: string[], line: string) => {
    const pnpmOutputLine =
        line.startsWith('> pnpm') ||
        line.startsWith('> node') ||
        line.startsWith('$ ') ||
        line.startsWith('[ELIFECYCLE]');
    const hasPkgId = pkgAndVersions.some((targetLineIdentifier) => line.includes(targetLineIdentifier));

    return pnpmOutputLine === false && hasPkgId === false;
};
