# Akio

**Free your brain from npm script chaos–Akio helps you search, understand, and run your project scripts fast.**

![Example](./docs/screenshots/cli_screenshot.png 'Example CLI screenshot')

---

## Quick setup

I recommend starting by using `akio` directly from the npm registery to get familiar with its monorepo functionaltiy. See [Documenting Scripts](#documenting-scripts) below to populate out your script descriptions.

```bash
npx @abullard/akio
```

### 🎯 Target a Package

Akio can target a package with the `@pkg` sytnax

```bash
# This assumes your package.json lives just below the ui folder.
# e.g. ...apps/ui/package.json
akio @ui

# to target root package.json
akio @root
```

### 🔍 Search Without Flags

Akio treats the first unnamed CLI argument as a search term:

```bash
# search for scripts containing the text "build":
akio build

# search the api package for scripts containing the text "test":
akio @api test

# order doesn't matter
akio coverage @ui
```

### ⚙️ CLI Options

- `-i`, `--input`: Don't request command execution number
- `-f`, `--format`: Strip colors & emojis from output
- `-d`, `--descriptions`: Don’t warn about missing script descriptions
- `-h`, `--help`: Print a help menu

---

## More Details

### 🚀 Global Install

```bash
npm install -g @abullard/akio
```

### 📝 Documenting Scripts

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

### 💪 Suggested Usage Methods

For the best UX, use it as an alias in your `.zshrc` so you can fetch with just `akio`:

```bash
# $(npm prefix -g) will fetch your global install location, locking the app version
alias akio="$(npm prefix -g)/bin/akio"

# if you always want the latest version, and have a stable network connection
alias akio="npx @abullard/akio"
```

Example in `package.json`:

```json
"scripts": {
  "akio": "npx @abullard/akio"
}
```

### 🧠 Best Used For

- Dev teams with lots of internal scripts
- Open source projects that skimp on docs
- Onboarding new teammates
- Old projects you forgot how to run

### 🛣️ On the Roadmap

- Paginate Monorepo output
- CI/CD and README badges
- Optional auto-publish to NPM
- JSONC-style inline comments

## 🪪 License

MIT

## Extra Information

- Akio works best with `pnpm` right now. Please setup [Workspaces](https://pnpm.io/workspaces) for proper functionality.
