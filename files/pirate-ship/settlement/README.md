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

**Behaviour change coming (2026-10-30, documented ahead under Rex's "no silent change" rule).** Belt unit 2646
(`Toolchain/settlement`, after the kernel's golden compare 2615) replaces the engine's unsourced building decay
(about 850 days from new to ruined) with decay by material class (`Toolchain/settlement/VALIDATION.md` §4b,
registry review R-2). This data gives no building a class yet, so **from 2646 on, no building in the port decays**:
condition stays where `start.json` sets it until a repair, a renovation or a host command changes it. The thirty-day
adapter results and the I2 golden change knowingly; the kernel keeper lists it as an intentional difference.
Classed port buildings will not decay either until the `salt-wind` exposure factor has a source or Rex sets it
(flagged by the registry keeper). Next: material classes for the starting buildings, from the town keeper's TWN
research; classes the sources leave empty go to Rex.

**2026-10-30, unit 2651:** `start.json` now carries `decayClass` and `exposure` per building from `STARTING_TOWN.md` Q1b; only the farmhouse and the ESTP's hut (palm-thatch, sheltered) decay, test V-D2.

