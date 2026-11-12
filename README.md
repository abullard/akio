# Akio

**Free your brain from npm script chaos–Akio helps you search, understand, and run your project scripts fast.**

![Example](./docs/screenshots/cli_screenshot.png 'Example CLI screenshot')

---

# Quick setup

I recommend using `akio` directly from the npm registery to get familiar with its monorepo functionality. See _Documenting Scripts_ below to populate your `scriptDescriptions`.

```bash
# using this DevX tool is as easy as running:
npx @abullard/akio
```

## 🎯 Target a Package

Akio can target a package with the `@pkg` syntax. `@pkg` matches a package's `"name"` field in its `package.json` — **not** the name of the folder it lives in:

```bash
# find commands from the package whose package.json "name" is "ui"
# (its folder can be named anything - apps/client, packages/ui, whatever)
akio @ui

# to target root package.json
akio @root
```

Targeting requires your `package.json` files live at the root of your _package_. e.g.

- `../ui/package.json`
- `../api/package.json`
- `../smoke/package.json`

### Targeting by index

If a package's name is scoped (e.g. `@myorg/ui`) or otherwise awkward to type, you can target it by its position in akio's package list instead, with `@<N>` (0-indexed):

```bash
# target the 3rd package in the list (root pinned first, then alphabetical by name)
akio @2
```

Run `akio` with no target to see the list — every package's index is printed next to its name, e.g. `ui (@2)`, so you can read off the right number directly.

## 🔍 Search Without Flags

Akio treats the first unnamed CLI argument as a search term:

```bash
# search for scripts containing the text "build":
akio build

# search the api package for scripts containing the text "test":
akio @api test

# order doesn't matter
akio coverage @ui
```

## ⚙️ CLI Options

| Long Name        | Short Name | Description                                   |
| ---------------- | ---------- | --------------------------------------------- |
| `--descriptions` | `-d`       | Hide missing script descriptions warning      |
| `--format`       | `-f`       | Strip colors & emojis from output             |
| `--help`         | `-h`       | Print a help menu                             |
| `--input`        | `-i`       | Don't prompt user to run a command            |
| `--pin`          | `-p`       | Pin your version, this skips the update check |

---

## 🚀 Global Install

```bash
npm install -g @abullard/akio
```

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

## 💪 Suggested Usage Methods

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

## 🎬 Inferred Package Manager

- Akio works best with `pnpm`, but supports `npm` and `yarn`. Please setup [pnpm-workspace.yml](https://pnpm.io/workspaces) for proper _Target a Package_ functionality.
- `akio` infers which package manager to use based on your lockfile:

| akio uses | file present in repo |
| --------- | -------------------- |
| `pnpm`    | `pnpm-lock.yaml`     |
| `yarn`    | `yarn.lock`          |
| `npm run` | `package-lock.json`  |

## 🧠 Best Used For

- Dev teams with lots of internal scripts
- Open source projects that skimp on docs
- Onboarding new teammates
- Old projects you forgot how to run

## 🛣️ On the Roadmap

- Auto deploy GHA & README badges
- JSONC-style inline comments

## 🪪 License

MIT
