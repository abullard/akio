import { execa } from "execa";

export const spawnWrapper = async (cmd: string, args: string[], input?: string) => {
    const userPromptedInputOpt = {
        stdin: 'pipe'
    };

    const subprocess = execa(
        cmd,
        args,
        input ? { ...userPromptedInputOpt } : {},
    );

    if (input) {
        subprocess.stdin!.write(`${input}\n`);
        subprocess.stdin!.end();
    }

    const response = await subprocess;

    return {
        ...response,
        stdout: removeHeaderText(response)
    };
}

const removeHeaderText = (response: any) => {
    const { stdout } = response;

    let result = undefined;
    if (stdout) {
        result = stdout.split(/\r?\n/).slice(3).join('\n');
    }

    return result;
}