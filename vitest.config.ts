/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: 'node',
        include: ['**/tests/**/*.spec.ts'],
        exclude: ['node_modules'],
        globals: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
});
