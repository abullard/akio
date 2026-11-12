# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0]

### BREAKING

- `@<name>` targeting now resolves against the package.json `"name"` field instead of the containing folder's name. Previously, `@ui` only worked if the package's folder was literally named `ui`, regardless of what its package.json called it; now it matches whatever `"name"` actually is, which is also what akio already displayed and used to build commands. If your folder name and package.json `"name"` differ, update any scripts/CI that used the folder-based alias to use the package's real name instead.

### Added

- `@<N>` targets a package by its position in akio's sorted package list (root first if present, then alphabetical by name), 0-indexed. Useful as an unambiguous alternative when a name is scoped (e.g. `@myorg/ui`) or otherwise awkward to type.
- The package listing and error output now show each package's index, e.g. `ui (@2)`, so you can read off the right `@<N>` directly from `akio`'s own output.
- "Invalid package specified" errors now list the available packages (with their names and indexes) instead of just failing silently.
