import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { checkForUpdate } from '../../../src/update-notification/update-notif';
import * as fs from 'fs';

const mockFetch = vi.fn();

const fakePkgName = 'Yogurt! I hate–YOGURT!';

vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
    return `{"name":${fakePkgName},"version":"1.1.3"}`;
});

describe('update-notif.ts', () => {
    describe('fn(checkForUpdate)', () => {
        beforeEach(() => {
            vi.stubGlobal('fetch', mockFetch);
        });

        afterEach(() => {
            vi.unstubAllGlobals();
            mockFetch.mockReset();
        });

        it('should integration test the happy path', () => {
            const successResponse = {
                ok: true,
                json: async () => ({
                    name: '@abullard/akio',
                    'dist-tags': { latest: '9.9.9' },
                }),
            };

            mockFetch.mockResolvedValueOnce(successResponse as Response);

            const actual = checkForUpdate();

            const expected = {};
            expect(actual).toEqual(expected);
        });

        it('', async () => {
            global.fetch = vi.fn(() => Promise.reject('API is down'));

            await expect(getData()).rejects.toEqual('API is down');
            expect(fetch).toHaveBeenCalledTimes(1);
        });
    });
});
