export const Colors: Record<string, string> = {
    purple: '\x1b[35m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    gray: '\x1b[30m',
    reset: '\x1b[0m',
};

export const disableColors = () => {
    for (const [key, _] of Object.entries(Colors)) {
        Colors[key] = '';
    }
};
