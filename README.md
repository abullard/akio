# Akio

**Your project scripts, made searchable.**

When your `package.json` grows, it’s easy to forget what `dev:db:reset` or `build:analyze` actually do.
Akio helps you keep track of your scripts and their descriptions, right from the terminal.

## Why Akio?

Sometimes you just want to know:

* What does this script do?
* Is this safe to run?
* What options are there?
* Did I write this or inherit it?

Akio is a dead-simple CLI tool that reads your project’s scripts and surfaces them in a friendly, numbered list—along with short descriptions you write yourself.

## Install

```bash
npm install -g akio
```

Or use it directly:

```bash
npx akio
```

## Usage
Inside any Node.js project with a `package.json`:

```bash
pnpm akio
# or
npx akio
```

You’ll see a list of scripts like this:
```
1. dev        — Starts the dev server with live reload
2. build      — Builds the project for production
3. lint       — Runs ESLint on all source files
4. test       — Runs unit tests with coverage
```

Pick a number to run it, or just use the list as a reference.

## How to Document Scripts

In your `package.json`, add a new section called `scriptDescriptions`:

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "scriptDescriptions": {
    "dev": "Starts the dev server with live reload",
    "build": "Builds the project for production"
  }
}
```

That’s it. No more digging through your history or guessing what `start:proxy` does.

## What It’s For

Akio is great for:

* Teams with lots of internal scripts
* Open source repos with minimal docs
* Personal projects you haven’t touched in months
* New devs onboarding to an unfamiliar codebase

## Zero Config. No Magic.

Akio doesn’t try to run your project or guess what you mean.
It just reads what’s already there and helps you navigate it faster.

## Future Plans (Maybe)

* Support for `jsonc` comments next to scripts
* Search by script key, or value
* auto-generation of descriptions for established packages?
* Terminal colors shut off
* Execute by number shut off

## License

MIT.
