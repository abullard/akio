#!/usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
    yellow: '\x1b[33m',
    purple: '\x1b[35m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

const main = () => {
    const commandMap = mapAndOutputCommands();
    processCommand(commandMap);
}

const processCommand = (commandMap) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('\nRun command number? ', input => {
        console.log('\n');
        rl.close();
        executeCommand(commandMap, input);
    });
}

const mapAndOutputCommands = () => {
    let count = 0;
    const commandMap = {};
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    const descriptions = pkg.scriptDescriptions || {};

    if (!Object.entries(descriptions).length) {
        console.error(`${colors.red}❌ No scriptDescriptions in your package.json.${colors.reset}\n`);
        process.exit(1);
    }

    console.log(`${colors.yellow}pnpm accio${colors.reset}`);
    console.log('\t-----');

    for (const [name, _] of Object.entries(pkg.scripts)) {
        count++;

        const description = pkg.scriptDescriptions[name] ?? '';
        const formattedOutput = `${count}. ${colors.purple}${name.padEnd(10)}${colors.reset} — ${description}`;
        commandMap[count] = name;

        console.log(formattedOutput);
    }

    return commandMap;
};

const executeCommand = (commandMap, input) => {
    if (!commandMap[input]) {
        console.error(`❌ Unknown command number: ${input}`);
        return;
    }

    const pkgManager = getRunner();

    const cmd = `${pkgManager} ${commandMap[input]}`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return;
        }

        if (stderr) {
            console.error(stderr);
            return;
        }

        console.log(stdout);
    });
};

const getRunner = () => {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';
    
    return 'npm run';
};

main();