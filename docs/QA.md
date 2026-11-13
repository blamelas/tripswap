# Q&A — training cards (English)

Short answers, to rehearse out loud. Each row names the artefact that proves it.

## 30-second pitch

> Anyone who wants to travel already knows where they want to go. What is missing is a
> bridge between desire and money. TripSwap shows the real planning cost, proposes small
> swaps and calculates how soon the trip becomes reachable. It starts with desire, not
> with a budget.

## 26 questions

| # | Question | Short answer | Artefact |
|---|---|---|---|
| 1 | What is the product? | A travel catalogue whose output is a deterministic savings plan. | `/`, `src/lib/calc.ts` |
| 2 | Who is it for? | A traveller in Lisbon, 25–40, with a destination in mind and no patience for spreadsheets. | `docs/MVP.md` |
| 3 | Is this just CRUD? | CRUD is the means; the value is the calculated number and the horizon that changes live. | `docs/TESTING.md` |
| 4 | Are the prices real? | No. They are illustrative targets with departure, travellers, nights and scope declared. | `docs/ASSUMPTIONS.md` |
| 5 | What about €0*? | A metaphor: a cost covered by savings. Never a discount, an old price or a free trip. | `Discover`, detail, `About` |
| 6 | How do you prevent double counting? | Six exclusive groups; choosing a swap replaces the previous one; the engine deduplicates. | `conflicts.ts`, tests |
| 7 | How are one-time savings handled? | They enter once, at the start of the projection. Never as monthly income. | `calc.test.ts` |
| 8 | Why not ask for salary? | The value does not depend on personal data. It reduces friction, risk and privacy surface. | `types.ts` |
| 9 | What did the AI get wrong? | The engine summed overlapping swaps. A test failed with 2 lines where 1 was expected. I fixed the engine. | `docs/PROMPTS.md` |
| 10 | How do I reproduce it? | `docker compose up` or `npm ci && npm run dev`. Node 20. | `README.md` |
| 11 | How do you know it works? | 42 tests on the logic, a 27-case manual checklist, CI on every PR. | `docs/TESTING.md` |
| 12 | Where is it deployed? | Vercel, automatic deploy on every push to `main`. | `vercel.json`, `docs/PUBLISH.md` |
| 13 | How would you scale it? | Pre-rendering, accounts and sync, calculated recommendations, end-to-end tests. | `docs/DECISIONS.md` |
| 14 | What was the hardest decision? | Excluding overlapping swaps instead of penalising them. I lost combinations, gained a defensible number. | `docs/DECISIONS.md` |
| 15 | What is out of scope? | Auth, booking, live prices, backend, maps. Without them the core value remains. | `docs/MVP.md` |
| 16 | Is the app bilingual? | Yes: English by default, Portuguese in one click. Same numbers; copy and data translated. | `src/i18n`, `tests/i18n.test.ts` |
| 17 | What is the visual idea? | “The world is the reward”: full-bleed photography, Barlow Condensed, ink/canvas/signal. The photo is the progress surface. | `README.md`, `src/index.css`, `RewardPanel` |
| 18 | How do I know the goal was reached? | The card itself turns signal: check, “This is now possible.”, months/swaps/target; on mobile the bar turns signal. | `RewardPanel` |
| 19 | Does the card change height? | No. The transformation is colour, label and typography; it adds no sections. | case 19, `RewardPanel` |
| 20 | How do I see the details? | A chevron on each activity opens the description, assumption and benefits. | `HabitCard` |
| 21 | Do categories have identity? | Six colours, a 44px icon, a 21px title and a live summary. | `HabitSelector` |
| 22 | Can I collapse them? | Yes, from the header; selections and counts remain. | `HabitSelector` |
| 23 | How do I create a reminder? | In a saved plan, “Add reminder”, choose daily/monthly, time and day; download the `.ics`. | `ReminderForm`, `lib/reminders` |
| 24 | Does the event enter my calendar? | The `.ics` creates an event + alarm in the user’s calendar; no push notifications. | `buildReminderIcs` |
| 25 | Where is the swaps catalogue? | At `/swaps`, with 25 swaps, 6 categories and a selection that carries into a destination. | `Swaps.tsx` |
| 26 | How do games of chance work? | A fixed conservative estimate: €20 current, €15 reduced, €5/month. No inputs, no invented average. | `data/habits.ts`, `SwapCard` |

## Phrases to avoid

- “It’s free.” → “The cost is covered by the swaps.”
- “You will save X.” → “The projection is X, if the swaps hold.”
- “It’s healthy.” → “It reduces sugary drinks” (a fact, not a promise).
- “The AI calculated it.” → “The engine calculates; the AI wrote the code.”
- “Price.” → “Illustrative planning target.”

## If you do not know

> “I have not validated that. My hypothesis is X. The next test would be Y.”

## Numbers to know by heart

| Scenario | Result |
|---|---|
| Paris, Essential (Uber + lunch) | €90/month · 8 months |
| Paris, Balanced (Uber + lunch + coffee) | €122/month · 6 months |
| Paris, Conscious (+ water + shoes) | €146/month + €65 one-time · 5 months |
| Coffee at home | €32/month |
| Lunch at home | €60/month |
| Repair shoes | €65 once |
| Stop buying tobacco | €120/month |
