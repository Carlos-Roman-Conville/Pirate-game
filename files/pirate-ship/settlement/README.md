# Settlement (pointer; the design lives in the Toolchain)

The town as a simulated settlement (parcels, buildings, titles, leases, businesses, workforce, production,
public works, authority) is being designed as a **reusable Toolchain package**, `E:/AI Programs/Toolchain/settlement/`,
beside `realism` and the decided `economy` (ALIGNMENT.md s10). Rex asked for a backend like realism, not an
extension of the slot system (2026-10-29). **Design only; nothing in this repo has changed.**

| Read there | What |
|---|---|
| `README.md` | status, marks, the decisions honoured |
| `DEPENDENCIES.md` | the map of this repo's town, alignment, economy and map code and data as of 2026-10-29 |
| `PACKAGES.md` | settlement / realism / economy / pirate adapter boundaries, records, commands, provider interfaces, the id scheme; `port.*` and `sec.*` stay story ids, joined by `data/pirate-ship/settlement/bindings.json` (planned) |
| `MIGRATION.md` | twelve steps keeping the slot model and `port.align` intact; the map-derivation method |
| `TESTS.md` | test specs; the acceptance test A1 |
| `QUESTIONS.md` | what only Rex can answer |

**2026-10-29, later: Rex approved the architecture and the foundations** (agreeing with ChatGPT's review, then
verbatim via the town keeper). Built the same day:

| Where | What |
|---|---|
| `Toolchain/settlement/src/`, `test/` | the engine (step 1): records, ledger, titles with transfer terms, leases, projects and layouts, businesses, posts, assignments, offices, the seven-step tick; 23 tests |
| `web/src/settlement/` | the adapter (step 2): `load.ts` replays `start.json` into engine commands and derives the `port.*` bindings; `bridge.ts` turns engine events into story hooks keyed on `port.*` and never issues an alignment command; `settlement.test.ts` holds T0 (alignment invariance under a seeded random walk), T1, A1 and A2 |
| `data/pirate-ship/settlement/start.json` | the starting port as seed rows: holders, businesses, fixtures and transfer terms are FACILITIES s7's proposal, **every row proposed** (Q6 answered in part); geometry is an explicit placeholder until the derived map (step 3) |
| `web/package.json`, `web/vite.config.ts` | `@rex/settlement` linked like `@rex/realism` |

Untouched: `../town/`, `web/src/alignment/`, `data/pirate-ship/alignment/`, the economy data. The record types in
`../town/FACILITIES.md` s7 are superseded by `PACKAGES.md` s2 only when Rex says so; the town keeper records what
Rex decides. Questions that block the next phase are listed in `Toolchain/settlement/QUESTIONS.md` (Q1 for the
map, Q6's rows for property sign-off, Q5 and Q10 for facilities and workforce).
