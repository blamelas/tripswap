# TripSwap

[Português](README.pt.md) · **English**

**Small changes. Bigger journeys.**

[![CI](https://github.com/blamelas/tripswap/actions/workflows/ci.yml/badge.svg)](https://github.com/blamelas/tripswap/actions/workflows/ci.yml)

TripSwap is a premium travel discovery experience that shows how small, realistic
changes in everyday habits could finance a meaningful trip. Users browse a curated
catalogue, choose swaps they would genuinely consider, and watch the projected savings
and funding horizon update instantly.

> The trip is not free. The **€0\*** is a metaphor for a cost covered by savings
> accumulated through the selected swaps. The real planning target is always visible.

| | |
|---|---|
| **Local demo** | `npm run dev` → http://localhost:5173 |
| **Live demo** | https://tripswap-home.vercel.app/ |
| **Repository** | https://github.com/blamelas/tripswap |
| **Defense script** | [`docs/DEFENSE.md`](docs/DEFENSE.md) (pt-PT) |
| **Assumptions** | [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md) (pt-PT) |
| **Status** | working MVP, 4 user stories, PT/EN toggle, fictional data, local persistence |

![TripSwap catalogue](docs/assets/home-en.jpg)

---

## The problem

People who want to travel already know where they want to go. What is missing is not
inspiration: it is a bridge between desire and money. Existing tools start with
budgets, bank statements and spreadsheets — and lose the person on the first screen.

TripSwap starts with desire. It shows the real planning cost, proposes small swaps and
answers a single question: **how long until this is within my reach?**

## Who it is for

A traveller in Lisbon, 25–40, who already has a destination in mind and wants a
concrete plan without handing financial data to yet another app. One person, one flow,
one primary screen.

## The 4 user stories

1. **Discover** destinations with transparent planning targets.
2. **Select** realistic changes without entering income, expenses or bank details.
3. **Understand** the potential savings and estimated horizon, with the maths visible.
4. **Save** goals and plans locally to come back later.

## What makes it different

- **The insight is the product.** The value is not the CRUD; it is the computed number
  and the horizon that moves as you choose.
- **Overlaps are explicit.** Two swaps that assume the same spending are never added
  together: they belong to the same group and only one can be active.
- **One-time savings are not monthly income.** Repairs and resales enter the projection
  once.
- **Full transparency.** Every result screen includes the calculation receipt and the
  €0\* note.
- **A signature interaction.** Choosing swaps makes the destination rise: a coral rail
  climbs the photograph, the image moves closer and the months counter animates.
- **Bilingual by design.** English is the default and Portuguese is one click away.
  The toggle changes every string — including the 24 swaps and 8 destinations — while
  the numbers stay identical.
- **No health promises.** Benefits are qualitative tags.

![Destination detail with a plan applied](docs/assets/detail-en.jpg)

---

## Design direction

**The world is the reward.** TripSwap is a travel magazine redesigned as a product:
full-bleed photography, condensed display type and one signal colour.

| Token | Value |
|---|---|
| Canvas | `#F7F6F2` |
| Ink | `#151A19` |
| Signal | `#F04A28` |
| Signal deep (small text) | `#B83417` |
| Pale blue | `#D8E8EE` |
| Display | Barlow Condensed |
| Interface | IBM Plex Sans |
| Numbers | IBM Plex Mono |

The €0* block always shows the illustrative budget crossed out, the €0* expression and
the "funded by everyday swaps" line. Every destination card turns the €0* into the
call to action, with "Unlock this experience" directly underneath. In the detail page,
the destination photograph is the progress surface: a rising tide and a coral edge rail
connect selected swaps, the monthly saving and the time to the target. When the plan
reaches the target, the reward card itself turns signal: the same photo, the same
height, a check and **“This is now possible.”** replace the neutral info block. Nothing
is added below; only the card transforms. On mobile the funding bar turns signal.

Habit rows keep only the activity name, the saving and the selected state. Category
labels are quiet, not headings, with a small icon; descriptions, assumptions and
benefits sit behind a chevron. Trip facts are icon-led, and suggested plans live in a
pale-blue band at the start of the swap step, clearly separate from the trip data.

![The success state](docs/assets/success.jpg)

## Stack

| Area | Choice |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS 3.4, Barlow Condensed / IBM Plex Sans / IBM Plex Mono |
| Router | React Router 7 |
| Icons | Lucide |
| Chart | Hand-rolled SVG, no chart library |
| Persistence | `localStorage` (`tripswap:unlocks:v1`) |
| Tests | Vitest — 35 tests |
| Environment | Multi-stage Docker + DevContainer |
| Deploy | Vercel (production, auto-deploy from `main`) |
| AI in development | DeepSeek (`deepseek-flash`) as the coding agent |

## Run it

Requirements: Node.js 20+ and npm.

```bash
npm ci && npm run dev
```

Open http://localhost:5173. Demo data is in the code: no setup, seed or API.

### With Docker

```bash
docker compose up
```

Open http://localhost:5173. Changes reload automatically.

### Quality

```bash
npm run lint        # oxlint
npm run typecheck   # tsc
npm test            # 35 tests (engine, data, assets, formatting, i18n)
npm run build       # production build
node scripts/assumptions.mjs > docs/ASSUMPTIONS.md   # regenerate assumptions
```

## How the calculation works

- **Recurring:** `(original cost − alternative) × monthly frequency`
- **One-time:** `original cost − alternative`, once
- **Projection:** `monthly savings × months + one-time savings`
- **Horizon:** the first whole month at which the projection reaches the target

The engine lives in [`src/lib/calc.ts`](src/lib/calc.ts) and is the single source of
truth. A test asserts that each of the 24 swaps keeps its documented value. The engine
also removes overlaps defensively, even if it receives an unsanitised list (old deep
link or edited `localStorage`).

## Structure

```text
src/
  data/      destinations, swaps, assumptions
  lib/       engine, conflicts, formatting, presets, storage
  i18n/      typed PT/EN dictionaries, content and locale context
  components/
  views/     Discover, Destination detail, Unlocks, About
tests/       engine, data, assets, formatting
docs/        MVP, assumptions, decisions, iterations, testing, defense
```

## Explicit limitations

- **Illustrative** planning targets (Lisbon, 2 travellers, stated scope). They are not
  verified prices, current fares or offers.
- No booking, payments, user accounts or sync.
- No live pricing, maps, weather or external APIs.
- Browser-only persistence; clearing site data removes saved plans.
- The horizon is an arithmetic projection, not a savings guarantee.
- Local photography with licences listed in [`docs/CREDITS.md`](docs/CREDITS.md).

## Documentation

- [`docs/MVP.md`](docs/MVP.md) — scope, user stories, acceptance criteria
- [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md) — every assumption, generated from code
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — decisions and trade-offs
- [`docs/ITERATIONS.md`](docs/ITERATIONS.md) — build cycles
- [`docs/TESTING.md`](docs/TESTING.md) — automated tests and manual checklist
- [`docs/PROMPTS.md`](docs/PROMPTS.md) — real prompts and one real AI failure
- [`docs/DEFENSE.md`](docs/DEFENSE.md) — slides, demo script and Q&A
- [`docs/QA.md`](docs/QA.md) — rehearsal flashcards
- [`CLAUDE.md`](CLAUDE.md) — agent context and rules

The interface is fully bilingual (PT-PT / EN) with a persistent toggle. Documentation
is available in Portuguese ([README.pt.md](README.pt.md)) and English (this file).

## How AI helped

AI was used as a coding agent inside the repository: scaffold, data, engine,
components, tests and documentation. It was **not** used for runtime arithmetic, price
generation or health claims. The process is recorded in
[`docs/ITERATIONS.md`](docs/ITERATIONS.md) and [`docs/PROMPTS.md`](docs/PROMPTS.md),
including a real failure caught by a test.

## Credits

Photography: Wikimedia Commons / Unsplash, with authors and licences in
[`docs/CREDITS.md`](docs/CREDITS.md). Type: Barlow Condensed, IBM Plex Sans and IBM
Plex Mono (SIL Open Font License), self-hosted via Fontsource.

Final project for **Building Digital Products with Generative AI** — EUNICE Network,
2026.
