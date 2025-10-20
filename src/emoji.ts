const Emoji: Record<string, string> = {
    PACKAGE: '📦',
    ERROR: '❌',
    WARN: '⚠️',
    MAINTENANCE: '🔧',
};
export type EmojiKeys = keyof typeof Emoji;

export const disableEmoji = () => {
    for (const [key, _] of Object.entries(Emoji)) {
        Emoji[key] = '';
    }
}

export const emojiWithSpace = (key: EmojiKeys): string => {
  return `${Emoji[key]} `;
}
