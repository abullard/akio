import { describe, it, expect } from "vitest";
import { execa } from 'execa';

describe('index.ts', () => {
    it('should exec(akio) and pipe output', () => {
        const cmd = "pnpm akio -i build";
        const args = ['akio', '-i', 'build'];
        const emptyOpts = {};


        const { stdout } = await execa('pnpm', ['akio', '-i', 'builad']);
        expect(stdout).toContain('Usage');
        const expected = `
pnpm akio
\t-----
1. build      — 
2. build:dev  — local dev buildaaaa
3. build:prod —  build production fake
        `;
    });