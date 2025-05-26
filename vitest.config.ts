/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['./tests/**/*.spec.ts'],
    exclude: ['node_modules'],
    globals: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
});
