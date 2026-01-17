import { execSync } from 'node:child_process';
import * as core from '@actions/core';
// import * as github from '@actions/github';

const run = () => {
    const cwd = process.cwd();
    console.log('AJB: ', cwd);
    try {
        execSync('npm run lint', { stdio: 'inherit', cwd });
    } catch (e) {
        console.error(e);
        core.setFailed(`Linting Failed`);
    }
};

run();
