---
name: verify-calc
description: Verifies the deterministic savings engine — formula integrity, overlap handling, one-time savings and documented assumptions — before shipping a change.
---

# /verify-calc

Use before committing any change to `src/lib/calc.ts`, `src/lib/conflicts.ts`,
`src/lib/format.ts`, `src/data/habits.ts` or `src/data/destinations.ts`.

## Steps

1. Run `npm test`.
2. Run `node scripts/assumptions.mjs` and confirm it prints the 24 swaps without
   disagreement between the stored saving and the formula.
3. Open `docs/ASSUMPTIONS.md` and check that every value there still matches the data.
4. Check these invariants by reading the code, not by trusting memory:
   - a recurring swap never contributes to `oneTime`;
   - a one-time swap never contributes to `monthly`;
   - two swaps in the same `exclusiveGroup` are never summed;
   - `monthsToTarget` returns the earliest whole month;
   - `MAX_MONTHS` produces `null`, never `Infinity`.
5. Report: PASS with the test count, or FAIL with the exact swap id and expected value.

## If something fails

Fix the data or the engine, never the test assertion. If a UI number disagrees with the
engine, change the UI to read from the engine.

## Output

A short table: check, result, evidence (test name or file:line).
