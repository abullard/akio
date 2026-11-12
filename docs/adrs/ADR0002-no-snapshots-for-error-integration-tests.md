# Expect test .toThrow() captures no snapshots

## Decision
Any integration tests that expect the application to throw an error, do not have snapshots to verify their output. 

The unit tests are still the source of truth.

## Tradeoffs:
1. Regressions on output format won't be caught
