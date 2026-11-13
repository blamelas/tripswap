---
name: ship
description: Runs the full quality gate and produces a release checklist for TripSwap.
---

# /ship

Use when a feature is ready to merge or deploy.

## Steps

1. Confirm the branch is not `main` or `develop`.
2. Run, in order, and stop at the first failure:
   ```bash
   npm ci
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
3. Check the manual smoke list:
   - `/` shows 8 destinations and the €0* note;
   - `/destination/paris-city-break` shows a plan in under 10 seconds with a preset;
   - a deep link `?h=coffee-at-home,lunch-from-home` reproduces the same number;
   - two swaps from the same group cannot be active together;
   - saving a plan and reloading `/unlocks` keeps it;
   - a one-time swap never appears in the monthly total;
   - mobile 390 px: no horizontal scroll, bottom bar visible;
   - console clean.
4. Update `CHANGELOG.md` and, if the number changed, `docs/ASSUMPTIONS.md`.
5. Commit with a Conventional Commit and open a PR into `develop`.
6. After merge, confirm the Vercel deployment and repeat the smoke list on the public URL.

## Output

A checklist with pass/fail, the commands run, and the deploy URL or the blocker.
