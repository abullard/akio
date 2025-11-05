export const Emoji: Record<string, string> = {
    ERROR: '❌',
    MAINTENANCE: '🔧',
    PACKAGE: '📦',
    STARS: '✨',
    WAND: '🪄',
    WARN: '⚠️',
};

export type EmojiKeys = keyof typeof Emoji;

export const disableEmoji = () => {
    for (const [key, _] of Object.entries(Emoji)) {
        Emoji[key] = '';
    }
};

export const emojiWithSpace = (key: EmojiKeys): string => {
    const emoji = Emoji[key];

    return emoji === '' ? '' : `${emoji} `;
};
