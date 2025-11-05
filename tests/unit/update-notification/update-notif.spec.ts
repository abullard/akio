import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { checkForUpdate } from '../../../src/update-notification/update-notif';
import * as fs from 'fs';

vi.mock('fs');
const fetchMock = vi.fn();

const fakePkgName = 'Yogurt! I hate–YOGURT!';
const fakePkgVersion = '1.1.4';

vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
    return JSON.stringify({
        name: fakePkgName,
        version: fakePkgVersion,
    });
});

describe('update-notif.ts', () => {
    describe('fn(checkForUpdate)', () => {
        const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {});

        beforeEach(() => {
            vi.stubGlobal('fetch', fetchMock);
        });

        afterEach(() => {
            vi.unstubAllGlobals();
            fetchMock.mockReset();
            consoleMock.mockReset();
        });

        it('should integration test the needs update path', async () => {
            const successResponse = {
                ok: true,
                json: async () => ({
                    name: '@abullard/akio',
                    'dist-tags': { latest: '9.9.9' },
                }),
            };
            fetchMock.mockResolvedValueOnce(successResponse as Response);

            await checkForUpdate();

            expect(consoleMock).toHaveBeenCalled();
        });

        it('should integration test versions matching path)', async () => {
            const successResponse = {
                ok: true,
                json: async () => ({
                    name: '@abullard/akio',
                    'dist-tags': { latest: fakePkgVersion },
                }),
            };
            fetchMock.mockResolvedValueOnce(successResponse as Response);

            await checkForUpdate();

            expect(consoleMock).not.toHaveBeenCalled();
        });
    });
});
