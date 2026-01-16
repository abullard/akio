import { execSync } from 'node:child_process';
import * as core from '@actions/core';
// import * as github from '@actions/github';

const run = () => {
    try {
        execSync('pnpm lint', { stdio: 'inherit', cwd });
    } catch (e) {
        core.setFailed('Linting Failed');
    }
};

run();
