# AGENTS.md

This repository is configured for Claude Code. The full project context, stack,
conventions, architecture and rules live in [CLAUDE.md](CLAUDE.md); read it first.

## Agents

| Agent | Use it when |
|---|---|
| `.claude/agents/calc-reviewer.md` | Any change touching `src/lib/calc.ts`, `conflicts.ts`, `data/habits.ts` or money formatting. |
| `.claude/agents/ux-copy-guardian.md` | Any change to user-facing copy, disclaimers or benefit tags. |
| `.claude/agents/tester.md` | Adding a feature that changes projections, overlaps or persisted plans. |

## Skills

| Skill | What it does |
|---|---|
| `/verify-calc` | Runs tests, checks every documented saving against its formula, and prints the assumptions table. |
| `/claims-check` | Scans copy for banned claims and verifies the €0* disclaimer is present. |
| `/ship` | Lint + typecheck + test + build, then a short release checklist. |

## Non-negotiables

1. No arithmetic outside `src/lib/calc.ts`.
2. No two swaps from the same `exclusiveGroup`.
3. No one-time saving counted as recurring.
4. No verified-price language for planning targets.
5. No health, weight-loss or emissions claims.
6. No user-facing copy outside `src/i18n`; PT and EN must stay in parity.
7. Never change a number when changing a language.
