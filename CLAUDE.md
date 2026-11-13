# CLAUDE.md

Guidance for AI agents working in this repository.

## Project overview

TripSwap is a travel discovery experience for people who want a meaningful trip but
do not want to manage a budget spreadsheet. Users browse eight curated destinations,
select everyday swaps they would genuinely consider (coffee at home, fewer ride-hailing
trips, repairing instead of replacing) and immediately see the projected savings and
the estimated number of months until the destination's planning target is covered.

The product is a static single-page app. The financial result is deterministic and
computed locally; no generative AI is used for arithmetic. There is no backend, no
authentication, no database and no booking flow.

Tagline: **Small changes. Bigger journeys.**
Supporting line: **Less of this. More of the world.**

## Stack

- React 19 + TypeScript (strict), built with Vite 8
- Tailwind CSS 3.4 (design tokens in `tailwind.config.ts`)
- React Router 7 (`/`, `/destination/:id`, `/unlocks`, `/about`)
- Lucide icons
- Self-hosted fonts via Fontsource: Fraunces (display), Inter Tight (UI),
  JetBrains Mono (tabular numerals)
- Typed PT/EN dictionaries in `src/i18n` (no i18n dependency) and a persisted locale
- Vitest for the calculation engine, data integrity and formatting
- localStorage for saved plans, behind `src/lib/storage.ts`
- Docker (multi-stage) + DevContainer, deployed on Vercel

## Architecture

```
src/
  main.tsx                  # bootstrap + font imports
  App.tsx                   # routes
  types.ts                  # Destination, Habit, SavedPlan
  data/
    destinations.ts         # 8 curated destinations + documented budgets
    habits.ts               # 24 swaps with costs, frequency, assumptions, groups
  i18n/                     # pt/en dictionaries, translated content, locale context
  lib/
    calc.ts                 # deterministic engine (single source of truth)
    conflicts.ts            # exclusive overlap groups + selection sanitising
    presets.ts              # essential / balanced / conscious plans
    format.ts               # EUR, months, percentages (pt-PT)
    planState.ts            # discover / on the way / unlocked / unreachable
    storage.ts              # versioned localStorage read/write
  components/               # presentational components
  views/                    # Discover, DestinationDetail, MyUnlocks, About, NotFound
tests/                      # Vitest suites for the engine and data
docs/                       # MVP, assumptions, decisions, testing, defense, credits
```

Data flow: `views -> lib -> data`. Components never compute money. `calculatePlan`
is the only place where amounts are summed.

## Conventions

- Code, file names and identifiers in English; UI copy and documentation in pt-PT.
- Files kebab-case; components PascalCase.
- Conventional Commits: `feat(scope): ...`, `fix(scope): ...`, `docs: ...`, `test: ...`.
- Never edit `main` or `develop` directly. Branch per task, PR into `develop`.
- Keep money arithmetic in `src/lib/calc.ts`. Never duplicate a formula in a component.
- Keep all user-facing amounts formatted through `src/lib/format.ts`, passing the locale.
- Every user-facing string lives in `src/i18n/pt.ts` and `src/i18n/en.ts`; no copy
  literals in components. Translated data lives in `src/i18n/content.ts`.
- No `any`. No new dependency without a stated reason.
- Run `npm run lint && npm test && npm run build` before committing.

## Rules

- **PT and EN must stay in parity.** `tests/i18n.test.ts` compares keys, arrays and
  function shapes; a missing translation fails the build. Numbers never change with
  the locale.
- **The AI must not invent numbers.** Every swap has one stored `saving` value; a unit
  test asserts it equals `(originalCost - alternativeCost) * monthlyFrequency` for
  recurring swaps and `originalCost - alternativeCost` for one-time swaps.
- **Never add two swaps from the same `exclusiveGroup`.** They assume the same
  underlying spending. The UI replaces one with the other; the engine deduplicates
  defensively.
- **Never treat a one-time saving as monthly income.** Repair and resale values enter
  the projection once.
- **Never present a planning target as a verified price or an offer.** The €0* metaphor
  must always be explained in the same view.
- **No medical, weight-loss, emissions or life-expectancy claims.** Benefit tags are
  qualitative.
- **No moralising copy.** The user is never told what they "should" do.
- Do not add authentication, payments, booking, live pricing, maps, chatbots or a
  backend. Those are explicitly out of scope.
- Explain the plan before large changes. Commit per feature. Do not rewrite history.

## Commands

```bash
npm ci                  # install exact dependencies
npm run dev             # http://localhost:5173
npm run lint            # oxlint
npm run typecheck       # tsc -b
npm test                # Vitest
npm run build           # typecheck + production build
docker compose up       # same dev server in a container
```

## Business context

The UI defaults to English; Portuguese is one toggle away. The audience is a
Lisbon-based traveller who already wants to go somewhere and is tired of generic
budgeting tools. The product's job is to turn desire into a concrete,
believable plan in under a minute. Success is a user who understands the real cost,
sees a plausible timeline and leaves with one small change they are willing to try.

Priority right now: a trustworthy, visually memorable, bilingual Discover -> Swap ->
Unlock flow.
Everything that does not serve that flow is out of scope for v1.0.0.
