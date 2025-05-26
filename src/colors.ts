export const Colors: Record<string, string> = {
    yellow: '\x1b[33m',
    purple: '\x1b[35m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

export const disableColors = () => {
    for(const [key, _] of Object.entries(Colors)) {
        Colors[key] = '';
    }
}