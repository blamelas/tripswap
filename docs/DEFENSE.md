# Defence — full script (English)

**Product:** TripSwap · **Public URL:** https://tripswap-home.vercel.app/
**Repo:** https://github.com/blamelas/tripswap
**Deck:** [`TripSwap-Defense.pptx`](TripSwap-Defense.pptx) · **PDF:** [`TripSwap-Defense.pdf`](TripSwap-Defense.pdf)
**10-minute script:** [`DECK-SCRIPT.md`](DECK-SCRIPT.md) · **Submission:** [`SUBMISSION.md`](SUBMISSION.md)
**Duration:** 10 min presentation + Q&A · **Rehearsals:** 2 timed runs

---

## Opening (30 s, memorise)

> “The problem I chose is simple: people who want to travel already know where they want
> to go, but they do not know whether they can afford it. Finance apps start with budgets
> and lose the person on the first screen. TripSwap starts with desire and answers one
> question: how soon does this become reachable? I’ll show you the moment that happens.”

## Slides (10)

### 1. Title — 0:00
**TripSwap — Small changes. Bigger journeys.**
Name, URL, repo. Visual: the hero photograph, the 8 destinations / 25 swaps / 6 categories / 42 tests strip.
One line: “A travel discovery product that turns everyday swaps into future experiences.”

### 2. Problem and user — 0:40
- User: a traveller in Lisbon, 25–40, with a destination in mind.
- Today: they either do not plan, or open a spreadsheet and give up.
- Cost: the trip stays in “one day”.
- Visual: bank / spreadsheet / inspiration; the missing bridge is a plan with a timeline.

### 3. The idea — 1:20
- The catalogue is the door. The calculation is the product.
- €0\* = a cost covered by savings; never a price.
- Three hidden pillars: spend smarter, live healthier, consume consciously.
- Visual: €0\*, the €650 planning target crossed out, and the three destinations strip.

### 4. Demo — 2:00 (see the demo script below)
**Value moment:** 3 swaps → 6 months, the coral state moves across the photograph and the
horizon buttons update. Visual: the real screen, not a mockup.

### 5. Scope — 3:00
| In | Out |
|---|---|
| 8 destinations, 25 swaps, 6 categories, engine, swaps, unlocks, about | auth, booking, live prices, backend, maps |
- Criterion: “without this, does the user get the core value?”
- Visual: the in/out table from `docs/MVP.md`.
- Four stories: discover, select, understand, save.

### 6. Architecture and design — 3:50
- Direction “The world is the reward”: Barlow Condensed, IBM Plex, ink/canvas/signal; photography as interface.
- Static SPA: React 19 + TS + Vite + Tailwind.
- Typed data → pure engine → UI. No server.
- `/swaps`: independent catalogue, 25 swaps, 6 categories, games with a fixed conservative estimate, non-interactive roadmap.
- Local i18n: typed PT/EN dictionaries, parity tested, engine language-agnostic.
- `localStorage` behind a service layer.
- Visual: the three-box diagram and the token strip.

### 7. The calculation — 4:40
- Recurring: `(original − alternative) × frequency`.
- One-time: difference, once.
- Horizon: first whole month at the target.
- Overlaps: exclusive groups, never summed.
- Games of chance: a fixed €40 → €20 = €20/month estimate; no inputs, no invented average.
- Visual: a real receipt with one line and the formula; examples for Paris, Douro, Iceland.

### 8. The swaps catalogue — 5:40
- 25 changes, 6 categories, independent of any destination.
- Select swaps, see monthly and one-time savings separately, carry them into any plan.
- The selection travels through deep links and the global store.
- Games of chance: fixed conservative estimate (€40 → €20 = €20/month); no inputs.
- Roadmap cards (“Create my own swap”, “Add my dream trip”) are deliberately non-interactive.
- Visual: the swaps page and the games card.

### 9. Process with AI — 6:40
- `CLAUDE.md`, 3 agents, 3 skills, 49 cycles in `ITERATIONS.md`.
- 42 tests; two of them caught real AI errors. 110+ commits, 20+ merged PRs, CI on every PR.
- Failure 1: the engine summed overlapping swaps. A test failed with 2 lines instead of 1. I fixed the engine, not the test.
- Failure 2: a literal i18n return type broke the English dictionary. `tsc` caught it; I widened the type and added a parity test.
- Visual: `git log --oneline`, agent files, a failing test.

### 10. Quality, limits and next — 7:40
- lint + typecheck + test + build green; CI on every PR.
- Automatic deploy from `main`; rollback by redeploying the previous build.
- Limits: illustrative budgets, no real prices; no accounts or sync; no push; reminders are `.ics` files.
- Next: savings tracking, custom swaps/dream trip, accounts/sync, end-to-end tests.
- Close (15 s): “The product is at [URL]. The code is at [repo]. What I left out is on
  slide 5, and why. The next thing I would build is end-to-end tests.”

---

## Demo script (3 min, exact clicks)

Preparation: clean window, zoom 110%, `/unlocks` empty, `/` open.

| Time | Action | Say |
|---|---|---|
| 0:00 | `/` | “Eight destinations. Each with a real planning target — and a €0* that is a metaphor, not a price.” |
| 0:20 | Open **Paris City Break** | “€650 to plan. Two travellers, three nights, from Lisbon.” |
| 0:35 | Click **Balanced** | “Coffee at home, lunch at home, half the Ubers. **€122 a month. Six months.** The card turns coral: *this is now possible*.” |
| 0:55 | Open **How we calculated** | “The maths is here: (10 − 2.50) × 4, (9 − 4) × 12, (2 − 0.40) × 20. None of this is generated by AI.” |
| 1:10 | Click **Walk** | “Replace the Uber — both assume the same trips. The product refuses to sum them.” |
| 1:25 | Back to **Balanced**, horizon **3m** | “With three months, it is not unlocked. The product does not lie.” |
| 1:40 | Horizon **12m**, **Save this plan** | “Saved on this device. No account, no server.” |
| 1:55 | Open **The swaps** | “Twenty-five changes in six categories, independent of any destination. Select them and carry them into a plan.” |
| 2:10 | Open **The swaps**, then **Games of chance & betting** | “Categories start collapsed. I open games: a fixed estimate of €40 current, €20 reduced, €20 a month. No inputs, no invented average.” |
| 2:20 | **My unlocks** | “The plan is here, with the horizon and progress recalculated.” |
| 2:30 | **Open plan** | “The deep link returns exactly the same swaps — the number is reproducible.” |
| 2:38 | **Add to calendar** | “Daily at 08:30, an `.ics` with a 15-minute event and an alarm. No account, no server.” |
| 2:45 | Toggle **PT** | “The same maths in Portuguese: €122 / 6 months. The numbers do not change.” |
| 2:50 | Close | “Not a finance app. A way to see what small decisions pay for.” |

**If something fails:** “This is the real product; I have a backup video.” Continue.

---

## Q&A

Use [`QA.md`](QA.md) (26 questions). If you do not know:

> “I have not validated that. My hypothesis is X. The next test would be Y.”

### Traps to avoid
- Do not call €0\* a discount, a price or a free trip.
- Do not claim real prices, real savings or a medical benefit.
- Do not say the AI calculated the result.
- Do not hide the limitations; slide 10 is part of the argument.

### Numbers to know
- 8 destinations · 25 swaps · 6 categories.
- Paris, Balanced: €122/month · €650 target · 6 months.
- Paris, Essential: €90/month · 8 months.
- Paris, Conscious: €146/month + €65 one-time · 5 months.
- 42 tests · 27 manual cases · 26 Q&A · 49 iterations.
- 110+ commits · 20+ merged PRs · 21 merged at the time of writing.

---

## Runbook (last 30 minutes)

- [ ] URL open in incognito and on the phone.
- [ ] `/unlocks` empty for the demo.
- [ ] Paris deep link tested.
- [ ] Deck open in presentation mode (English).
- [ ] PDF open as fallback (English).
- [ ] Backup video open offline.
- [ ] `docs/DECK-SCRIPT.md` and `docs/QA.md` in another tab.
- [ ] `git log --oneline` and the PRs open.
- [ ] Zoom 110%, notifications off.
- [ ] Water.

## If something breaks

| Situation | What to do |
|---|---|
| URL does not open | `npm run build && npm run preview` locally; otherwise the video |
| Vercel is down | Show the local build; the deploy is automatic from `main` |
| Deep link fails | Open `/unlocks`; explain that the selection is sanitised in the engine |
| Save demo fails | Show an existing saved plan; the calculation is already visible |
| No internet | Video + slides + local Docker |
| Question without an answer | “I have not validated it; my hypothesis is X; the next test is Y.” |
