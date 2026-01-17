import { it, describe, expect } from 'vitest';
import { emojiWithSpace, type EmojiKeys, Emoji, disableEmoji } from '../../src/formatting/emoji';

describe('emoji.ts', () => {
    it.each([
        ['PACKAGE', `${Emoji.PACKAGE} `],
        ['ERROR', `${Emoji.ERROR} `],
        ['WARN', `${Emoji.WARN} `],
        ['MAINTENANCE', `${Emoji.MAINTENANCE} `],
    ])('should return the requested emoji with a space', (emoji: EmojiKeys, expected: string) => {
        const actual = emojiWithSpace(emoji);

        expect(actual).toEqual(expected);
    });

    it.each([
        ['PACKAGE', ''],
        ['ERROR', ''],
        ['WARN', ''],
        ['MAINTENANCE', ''],
    ])('should return empty string when emojis are disabled', (emoji: EmojiKeys, expected: string) => {
        disableEmoji();

        const actual = emojiWithSpace(emoji);

        expect(actual).toEqual(expected);
    });
});
