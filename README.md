# Akio

**Search, understand, and run your project scripts — fast.**

Your `package.json` is full of mystery meat scripts. `dev:db:reset`? `build:analyze`? Larger teams often have newer devs that don't know what they do.

Akio surfaces your scripts and their descriptions in a clean, numbered list — right in your terminal.

![Example](./docs/cli_screenshot.png "Example CLI screenshot")

## 🧭 Why Akio?

You’ve asked:

* *What does this script actually do?*
* *Is it safe to run?*
* *Did I write this or inherit it?*

Akio gives you answers — without running anything, guessing, or being clever.
Just a fast, helpful index of your scripts.

## 🚀 Install

```bash
npm install -g akio
# or use it directly
npx akio
```

## 📖 Usage

In any Node.js project with a `package.json`:

```bash
npx akio
```

You’ll see:

```
pnpm akio
  -----
Found scripts matching: "test"

1. test          — run vitest unit tests  
2. test:unit     — run unit tests  
3. test:int      — run integration tests  
4. test:contract — run API contract tests  
5. test:watch    — re-run tests on save

Run command number? >
```

Hit a number to run that script. Or just use it as a reference.

## 🔍 Search Without Flags

Akio treats the first unnamed CLI argument as a search term:

```bash
npx akio build
```

No need to pass `--search`. You can, though:

```bash
npx akio --search build
```

## ⚙️ CLI Options

* `-i`, `--no-input`: Don’t prompt — just show results
* `-f`, `--no-formatting`: Strip colors (and soon, emojis)
* `-s`, `--search`: Explicit search
* `-d`, `--no-descriptions`: Don’t warn about missing script docs

Example in `package.json`:

```json
"scripts": {
  "akio": "npx akio -f -i -d -s dev"
}
```

I recommend an alias with opts if you need them. Example in a `.zshrc` or a `.bashrc`:
```bash
alias akio="npx @abullard/akio -i" # never prompt for input
alias akio="npx @abullard/akio -d" # never warn about missing scriptDescriptions
alias akio="npx @abullard/akio -f" # never show colors (soon emojis)
```

## 📝 Documenting Scripts

Add a `scriptDescriptions` section to your `package.json`:

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "scriptDescriptions": {
    "dev": "Starts the dev server",
    "build": "Builds the project for production"
  }
}
```

No more guessing what `start:proxy` does.

## 🧠 Best Used For

* Dev teams with lots of internal scripts
* Open source projects that skimp on docs
* Onboarding new teammates
* Old projects you forgot how to run

## 🛣️ On the Roadmap

* Monorepo support (grouped by package)
* CI/CD and README badges
* Optional auto-publish to NPM
* JSONC-style inline comments
* Color + emoji toggle with `--no-formatting`

## 🪪 License

MIT
