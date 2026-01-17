import { execSync } from 'node:child_process';
import * as core from '@actions/core';

const run = () => {
    try {
        execSync('npm run lint', { stdio: 'inherit', cwd: process.cwd() });
    } catch (e) {
        console.error(e);
        core.setFailed(`Linting Failed`);
    }
};

run();
