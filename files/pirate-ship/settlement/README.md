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

What this folder will hold once Rex approves the plan: the adapter's design record (`rules.json` sources, the
starting titles and businesses per `port.*` place, each row marked Rex / proposed / open). The town keeper keeps
`../town/`; the slot model there is unchanged by any of this. The record types in `../town/FACILITIES.md` s7 are
superseded by `PACKAGES.md` s2 only when Rex says so.
