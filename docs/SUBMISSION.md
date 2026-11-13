# TripSwap — submission pack (English)

**Course:** Building Digital Products with Generative AI · EUNICE Network, 2026
**Student:** Bruno Lamelas · **Project:** TripSwap
**One-liner:** small changes, bigger journeys — a travel plan funded by everyday swaps.
**URL:** https://tripswap-home.vercel.app · **Repo:** https://github.com/blamelas/tripswap
**Tag:** `v1.5.4` · **Deck:** [`TripSwap-Defense.pptx`](TripSwap-Defense.pptx) · **PDF:** [`TripSwap-Defense.pdf`](TripSwap-Defense.pdf)

> All presentation materials are in English: the PPTX, the PDF, the 10-minute script
> (`DECK-SCRIPT.md`), the demo script (`DEFENSE.md`), the Q&A (`QA.md`) and the backup
> video script (`VIDEO.md`).

---

## 1. Submission status

| Item | Status |
|---|---|
| Public URL | ✅ 200 |
| Public repository | ✅ `blamelas/tripswap` |
| GitHub description and homepage | ✅ |
| 3+ merged PRs | ✅ 21+ |
| CI on every PR | ✅ `lint → typecheck → test → build` |
| 3+ branches | ✅ 29 remote branches |
| 15+ conventional commits | ✅ 114+ |
| Tag `v1.0.0` | ✅ and tags up to `v1.5.4` |
| 3+ unit tests | ✅ 42 |
| Deck, 8–10 slides | ✅ 10, English |
| Demo script | ✅ `docs/DECK-SCRIPT.md` (English) |
| Q&A | ✅ `docs/QA.md` (26, English) |
| 3-minute backup video | ❌ record |
| 2 timed rehearsals | ❌ do |

> This is the submitted project. There are no formal blockers.

## 2. What to submit

| Field | Value |
|---|---|
| Project name | TripSwap |
| One-liner | Small changes. Bigger journeys. |
| Public URL | https://tripswap-home.vercel.app |
| Repository | https://github.com/blamelas/tripswap |
| Stack | React 19 · TypeScript · Vite 8 · Tailwind 3.4 · Vitest |
| Run locally | `npm ci && npm run dev` → http://localhost:5173 |
| Docker | `docker compose up` |
| Tests | 42 in 5 files |
| Deck | `docs/TripSwap-Defense.pptx` (English) |
| PDF | `docs/TripSwap-Defense.pdf` (English) |
| 10-minute script | `docs/DECK-SCRIPT.md` |
| Demo runbook | `docs/DEFENSE.md` |
| Q&A | `docs/QA.md` |
| Video script | `docs/VIDEO.md` |

## 3. Course requirements → evidence

| Requirement | Where it is | Status |
|---|---|---|
| Public HTTPS URL | https://tripswap-home.vercel.app | ✅ 200 |
| 3+ end-to-end user stories | `docs/MVP.md` | ✅ 4 |
| Value moment <60 s | Choose 3 swaps → €122/month → 6 months | ✅ |
| Calculated insight, not only CRUD | `src/lib/calc.ts` | ✅ |
| Empty / loading / error states | `/unlocks`, 404, image fallback | ✅ |
| Automatic demo data | `src/data/` | ✅ |
| README with one-liner, URL, stack, 1 command | `README.md` / `README.pt.md` | ✅ |
| `CLAUDE.md` with stack, conventions, rules | `CLAUDE.md` | ✅ |
| `docs/MVP.md` with in/out and criteria | `docs/MVP.md` | ✅ |
| `docs/ITERATIONS.md` with 4+ cycles | `docs/ITERATIONS.md` | ✅ 49 |
| `.gitignore` from the start | `.gitignore` | ✅ |
| Versioned `.env.example` | `.env.example` | ✅ |
| Zero secrets in history | see §6 | ✅ |
| 15+ conventional commits | 114+ | ✅ |
| 3+ branches and 3+ merged PRs | 29 branches, 21+ PRs | ✅ |
| Tag `v1.0.0` | tags up to `v1.5.4` | ✅ |
| `.devcontainer/devcontainer.json` | `.devcontainer/` | ✅ |
| `Dockerfile` + `docker-compose.yml` | root | ✅ |
| `docker compose up` from a clean clone | documented and used | ✅ |
| Node pinned | `.nvmrc`, `engines` | ✅ |
| Lockfile committed | `package-lock.json` | ✅ |
| 3+ unit tests | 42 | ✅ |
| lint / test / build green | CI + local log | ✅ |
| Manual checklist, 8–10 cases | `docs/TESTING.md` | ✅ 27 |
| Zero console errors | manual | ⚠️ confirm |
| 2+ agents | `.claude/agents/` (3) | ✅ |
| 2+ skills | `.claude/skills/` (3) | ✅ |
| `docs/PROMPTS.md` with real prompts | `docs/PROMPTS.md` | ✅ |
| One documented AI failure | engine summed overlaps | ✅ |
| 8–10 slides | `docs/TripSwap-Defense.pptx` | ✅ 10 |
| Demo script with clicks | `docs/DEFENSE.md` | ✅ |
| 3-minute backup video | `docs/VIDEO.md` | ❌ record |
| 2 timed rehearsals | — | ❌ do |
| 10 Q&A questions | `docs/QA.md` (26) | ✅ |

## 4. Defence run sheet (10 min)

| Time | Block | Note |
|---|---|---|
| 0:00 | Opening | Desire vs. money; the product question |
| 0:40 | Problem | Bank/spreadsheet lose the person |
| 1:20 | The idea | €0* is a metaphor; the real cost stays visible |
| 2:00 | Demo | Paris → Balanced → €122/6 months |
| 4:00 | Scope | 8 destinations, 25 swaps; out: auth/booking/live prices |
| 4:50 | Architecture and design | Data → pure engine → UI; “the world is the reward” |
| 5:40 | The calculation | Formula, overlaps, one-time savings, games |
| 6:30 | The swaps catalogue | 25/6, carry-over, games, roadmap |
| 7:20 | Process with AI | 114+ commits, 21+ PRs, 3 agents, the engine failure |
| 8:20 | Quality and deploy | CI, 42 tests, Vercel, rollback |
| 9:20 | Limits and close | Illustrative budgets; next step |

## 5. Demo (3 min, exact clicks)

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

## 6. Security

- No backend, no accounts, no personal data and no API keys.
- `.env.example` exists by convention; the product needs no variables.
- `localStorage` only stores fictional plans (`tripswap:unlocks:v1`).
- Quick check:

```bash
git log -p | grep -iE "api[_-]?key|secret|password|token" | head
```

## 7. Commands to verify

```bash
npm ci
npm run lint
npm run typecheck
npm test          # 42 tests
npm run build
npm run preview   # http://localhost:4173
docker compose up
```

Recorded result:

```text
Test Files  5 passed (5)
Tests       42 passed (42)
```

## 8. Room plan B

| Situation | What to do |
|---|---|
| URL does not open | `npm run build && npm run preview` locally; otherwise the video |
| Vercel is down | Show the local build; deploy is automatic from `main` |
| Deep link fails | Open `/unlocks`; explain that the selection is sanitised in the engine |
| Save demo fails | Show an existing saved plan; the calculation is already visible |
| No internet | Video + slides + local Docker |
| Question without an answer | “I have not validated it; my hypothesis is X; the next test is Y.” |

## 9. Last 30 minutes

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
