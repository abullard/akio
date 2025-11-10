# Akio

**Search, understand, and run your project scripts — fast.**

Your `package.json` is full of mystery meat scripts. `dev:db:reset`? `build:analyze`? Larger teams often have newer devs that don't know where to begin.

Monorepos add confusion & complexity. Introducing duplicated commands, cmd name mismatches, and the footgun of incorrect CWDs to the mix.

🪄 _Akio's here to surface your Monorepo's scripts & their descriptions in a clean, numbered list — right in your terminal._ 🔮

![Example](./docs/screenshots/cli_screenshot.png 'Example CLI screenshot')

## 🧭 Why Akio?

You’ve asked:

- _What does this script actually do?_
- _Is it safe to run?_
- _What package has the `types:check` script?_

Akio gives you answers — defined in natural language, by your team.

## 📝 Documenting Scripts

Add a `scriptDescriptions` section to your `package.json`:

```jsonc
{
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "test:integration": "vitest ./tests/integration/**/*.spec.ts",
    },
    "scriptDescriptions": {
        "dev": "Starts the dev server",
        "build": "Builds the project for production",
        "test:integration": "Test that the application works when all components are integrated.",
    },
}
```

No more guessing what `test:integration` does.

## 🚀 Install

```bash
npm install -g @abullard/akio

# or use it directly
npx @abullard/akio
```

## 💪 Suggested Usage Methods

As an alias in your `.zshrc` so you can fetch with `akio test`:

```bash
alias akio="npx @abullard/akio -fid"
```

Example in `package.json`:

```json
"scripts": {
  "akio": "npx akio -fid dev"
}
```

## 🎯 Target a Package

Akio can target a package with the sytnax

```bash
# This assumes your package.json lives just below the ui folder.
# e.g. ...apps/ui/package.json
akio @ui

# to access root
akio @root
```

## 🔍 Search Without Flags

Akio treats the first unnamed CLI argument as a search term:

```bash
akio build
```

## ⚙️ CLI Options

- `-i`, `--input`: Don't request command execution number
- `-f`, `--format`: Strip colors & emojis from output
- `-d`, `--descriptions`: Don’t warn about missing script descriptions
- `-h`, `--help`: Print a help menu

## 🧠 Best Used For

- Dev teams with lots of internal scripts
- Open source projects that skimp on docs
- Onboarding new teammates
- Old projects you forgot how to run

## 🛣️ On the Roadmap

- Paginate Monorepo output
- CI/CD and README badges
- Optional auto-publish to NPM
- JSONC-style inline comments

## 🪪 License

MIT

## Extra Information

- Akio works best with `pnpm` right now. Please setup [Workspaces](https://pnpm.io/workspaces) for proper functionality.
