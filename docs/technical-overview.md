# Akio Technical Overview

## Purpose
Akio is a Node.js CLI that inspects a project (optionally a PNPM/NPM/Yarn workspace), surfaces every `package.json` script alongside its human-written description, and optionally runs a selected script. It lets developers quickly recall what scripts exist, what they do, and execute them with a single keystroke.

## Top-Level Flow
1. `src/index.ts` kicks off execution, parses CLI flags, and determines the active package manager by inspecting lockfiles (`pnpm-lock.yaml`, `yarn.lock`, or defaulting to `npm`).
2. Colors are optionally disabled when `--no-format`/`-f` is passed so the CLI can render plain text (e.g. for logging or snapshot tests).
3. `mapAndOutputCommands` (in `src/command.ts`) scans every `package.json` reachable from the current working directory using `glob`, builds a consolidated script catalog, and prints a numbered list grouped by package name.
4. When at least one script is discovered the caller receives a map of list indices to runnable commands. If input is enabled (`processCliOpts` defaults to prompting) the CLI waits for a number and executes the corresponding script via `child_process.spawn`.

## CLI Arguments (`src/cli-opts.ts`)
- `-i`, `--no-input`: skip the interactive prompt and only print the catalog.
- `-f`, `--no-format`: disable ANSI color output (emojis are slated for removal as noted in TODOs).
- `-d`, `--no-descriptions`: suppress warnings when scripts lack `scriptDescriptions` metadata.
- First positional argument: treated as a substring filter for script names (e.g. `akio build`). No explicit `--search` flag is currently implemented.
- Any other flag triggers `formatError`, prints an error banner, and exits with status code `1`.

## Script Discovery & Formatting (`src/utils.ts`, `src/command.ts`)
- `readAllPkgJsons` locates every `package.json` (excluding `node_modules`) and dynamically imports it with `{ type: 'json' }`, returning normalized `{ name, scripts, scriptDescriptions }` records.
- `buildScriptMap` walks each package's scripts, skipping the `akio` script and any names that do not match the optional search filter. It prints each entry as `"<index>. <script> — <description>"`, padding names for readability and coloring with `Colors.purple`/`Colors.yellow`.
- If a package omits `scriptDescriptions` and `--no-descriptions` is not set, the CLI emits guidance on how to document scripts.
- When no script matches the filter, the CLI prints `Found no scripts…` with a red-highlighted search term and exits early without prompting.

## Command Execution (`executeCommand` in `src/command.ts`)
- Commands run using the detected package manager. For `npm`, the helper inserts `run` so generated invocations look like `npm run <script>`; for `pnpm`/`yarn`, the script name is passed directly.
- Spawns inherit stdio to allow transparent execution of project scripts. Akio exits with the child process exit code so calling shells can detect failures.

## Output Styling (`src/colors.ts`, `src/format-output.ts`)
- `Colors` centralizes ANSI escape codes; `disableColors` mutates the map to empty strings, effectively turning off styling downstream.
- `formatError` wraps fatal messages in a red "❌ ERROR" banner and terminates the process.

## Build & Distribution
- Built with `esbuild` via `pnpm build:real`, bundling `src/index.ts` into `dist/index.cjs`. The package exposes `./dist/index.cjs` as its binary entrypoint.
- The project ships as an ES module (`"type": "module"`) but outputs a CommonJS bundle for compatibility with Node CLI execution.

## Testing (`tests/`)
- Vitest integration tests spawn the published CLI (`pnpm akio …`) via `execa`, verifying flag behavior, search filtering, and interactive prompts (using snapshot fixtures under `tests/__snapshots__`).
- Test fixtures live under `packages/` to simulate a small PNPM workspace so the discovery logic exercises multi-package output.

## Known Limitations & TODOs
- Monorepo UX: TODO notes in `src/command.ts` call out future grouping improvements, ignoring package pass-through scripts, and adding package selection flows.
- README and CLI flag parity: documentation still references a `--search` flag that is not implemented in code.
- Timeout handling: `glob` searches use `AbortSignal.timeout(1000)`; large repos may need a longer timeout or streaming approach.
- Missing utility export: tests reference `readPackageJson` (not currently implemented in `src/utils.ts`), suggesting either an incomplete helper or stale tests.
- Formatting toggle: TODO notes mention removing emojis when `-f` is passed and reworking flag ergonomics.

## Usage Expectations
- For best results each `package.json` should include a parallel `scriptDescriptions` object. Akio surfaces missing descriptions but does not try to infer them.
- Works out-of-the-box with PNPM/Yarn/NPM projects; other package managers fall back to `npm` execution semantics.

