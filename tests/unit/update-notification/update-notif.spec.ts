import * as fs from 'fs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { checkForUpdate } from '../../../src/update-notification/update-notif';

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
            // arrange
            const successResponse = {
                ok: true,
                json: async () => ({
                    name: '@abullard/akio',
                    'dist-tags': { latest: '9.9.9' },
                }),
            };
            fetchMock.mockResolvedValueOnce(successResponse as Response);

            // act
            await checkForUpdate();

            // assert
            expect(consoleMock).toHaveBeenCalled();
        });

        it('should integration test versions matching path)', async () => {
            // arrange
            const successResponse = {
                ok: true,
                json: async () => ({
                    name: '@abullard/akio',
                    'dist-tags': { latest: fakePkgVersion },
                }),
            };
            fetchMock.mockResolvedValueOnce(successResponse as Response);

            // act
            await checkForUpdate();

            // assert
            expect(consoleMock).not.toHaveBeenCalled();
        });

        it('should integration test network failure path)', async () => {
            // arrange
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            const errorResponse = {
                ok: false,
                json: async () => undefined,
            };
            fetchMock.mockRejectedValueOnce(errorResponse as Response);

            // act
            await checkForUpdate();

            // assert
            expect(consoleMock).not.toHaveBeenCalled();
        });
    });
});
