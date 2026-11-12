# Monorepos without a root package.json

## Decision
The target package `@root` will not work, but because you're in a `git` repo, `akio` still recognizes your packages, and will still `0`-index them.

In the following screenshot:
![](../photos/no-package-json-at-root.png)

we can see that akio still functions on a project without a `package.json` at the repository root. 

## Tradeoffs:
1. Regressions won't be caught
