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

    return await subprocess;
}