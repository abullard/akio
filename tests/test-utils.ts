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
        // TODO AJB 05/27/2025: figure out how to remove the top two lines of output from stdout
        // result = stdout.replace??;
    }
    console.log(result);

    return result;
}