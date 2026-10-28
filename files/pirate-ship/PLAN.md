# Pirate Ship: the build plan (2026-10-26)

The document the belt builds from. One row = one belt task (`_agent/queue/pirate-ship/NNNN-pirate-ship-<slug>.md`),
with its worker in `Model`, what it needs first, and what "done" means (the task's Gate checks it). The lane's
planner reads `BRIEF.md`, `HANDOFF.md`, then this file, and writes the next tasks in order. `Status`: **done**,
**queued (NNNN)**, **pending**, **blocked (why)**. Design lives in `PIRATE.md` and `minigames/FISHING.md`; this file
never redecides it.

Workers: **sonnet** for platform work, **composer** for UI, data and tests, **haiku** for checks. No server work
yet, so no Codex units. One writer per set of files at a time. Every task touching code gates on the four checks
(`dotnet build CcgArchive.sln`, `dotnet test engine.tests`, `npx tsc -b`, `npm run build` in `web/`) plus
`npx vitest run` in `web/` once unit 1 adds it, and `HANDOFF.md` under 4,096 bytes when it may edit it.

**Needs Rex** (the belt stops and asks): any npm package not in the cache; the pull-in's fairness numbers; the
game's name; his art.

## Phase 0: Design (Rex's) — enough for Phase 1

PIRATE.md v0.1, FISHING.md, STATS.md, DUTIES.md, ROSTER.md. Open decisions in PIRATE.md §12 don't block Phase 1.

## Phase 1: The dock and fishing (Rex: "for now it's just pure fishing")

| # | Unit | Model | Needs | Done when | Status |
|---|---|---|---|---|---|
| 1 | Phaser 4 (4.2.1, `npm install --offline`) and vitest in `web/`; the board placeholder screen replaced by a Phaser world: three-quarter top-down, square tiles, a dock map from `data/pirate-ship/maps/dock.json` (water, planks, a small moored boat; script-drawn placeholder tiles), a placeholder player that walks facing down, up and side (mirrored), water blocks movement, integer zoom, camera follows | sonnet | — | four checks; vitest: the dock map loads and water tiles block | done (2450) |
| 2 | The fishing state machine, pure TS in `web/src/fishing/` (no drawing): FISHING.md's stages in order (read the water → aim → direction → power → lure → bite → pull in → result). Inputs are a fisher's stats (names from STATS.md; placeholder player values). Every tuning number in `data/pirate-ship/fishing.json`, with two or three placeholder test fish (distance band, preferred rhythm), marked placeholder | composer | 1 | vitest: each stage's transitions; no number hard-coded outside the data file | done (2451) |
| 3 | Stage 1, reading the water: at the dock's edge, fishing starts and the view widens; the placeholder fish show as silhouettes within a range set by Eyesight and the Fishing skill | composer | 2 | vitest on the visible range; four checks | done (2452) |
| 4 | Stages 2–4, aim, direction and power: place the target; the cone with its moving line (speed and width from the Fishing skill and Dexterity); the up-and-down power meter with its target spot; the cast lands at the target, past it or short of it | composer | 3 | vitest on the landing point for over, under and on target | done (2453) |
| 5 | Stage 5, the lure: pick a rhythm, then the rhythm game; Patience shapes the line's motion; fish are drawn by the rhythm they like | composer | 4 | vitest: a matching rhythm draws the test fish, a wrong one doesn't | done (2454) |
| 6 | Stage 6, the bite (FISHING.md's five beats): the bobber waits on the waves; nibbles twitch it (a strike on a nibble is a miss); the bite submerges it with a splash and a sound; a press inside the reaction window (from Reflexes) sets the hook and hands to stage 7, outside it the fish is gone; nibble timing, bite timing and the window all in `fishing.json` | composer | 5 | vitest: a press on a nibble misses, inside the window hooks, late loses the fish | done (2455) |
| 7 | Stage 7, pulling it in: line tension; pulling too hard weakens the line; Strength, Dexterity, Calm, Patience and Endurance per FISHING.md; every threshold in `fishing.json` so Rex can make it fair | composer | 6 | vitest: the line breaks only past the data threshold | done (2456) |
| 8 | The result and the loop: caught or got away, a short result panel, back to walking the dock (no selling or inventory yet) | composer | 7 | vitest on the loop; four checks | done (2457) |
| 9 | Fishing screen, cast: aim target, direction cone, power meter, landing drawn in DockScene | composer | 8 | four checks | done (2460) |
| 10 | Fishing screen, lure, bite, pull in and result: rhythm pick/play, bobber beats with splash and tone, tension, result panel | composer | 9 | four checks | done (2461 lure and bite on screen; 2462 fixed the build; 2463 pull-in as several pulls) |
| **Gate** | Rex plays the dock and the fishing loop in the browser; a desktop Sonnet session runs the smoke check (the belt can't open a browser) | | | | gate |

## Phase 2: The alignment backend (Rex, 2026-10-28; spec `balance/ALIGNMENT.md`)

The real alignment engine, built once, used by the game and by a simulator that answers "is a perfect X town
reachable" (Rex: "design this as the actual backend so we don't program the system twice"). Pure TS in
`web/src/alignment/`, data in `data/pirate-ship/alignment/`, vitest beside the code. Workers for this phase (Rex,
2026-10-28): **codex** for engine logic, **composer** for data and shape tests, **sonnet** for scaffolding and docs,
**haiku** for checks; opus only for design. Every undecided rule is a config key or an explicit "unresolved"
(ALIGNMENT.md §8); a task never fills one in.

| # | Unit | Model | Needs | Done when | Status |
|---|---|---|---|---|---|
| 11 | `web/src/alignment/square.ts`: positions on the ±100 square, clamp, anchors, classify into the 9 regions (neutral, 4 pure, 4 hybrid) with the transitional rule; `data/pirate-ship/alignment/thresholds.json` holds every number and the §8 config keys | sonnet | — | vitest: each region, the transitional cases, clamp; `tsc -b` | done (2474) |
| 12 | Data: `charts.json` (16 response charts from `balance/maps.json`), `starts.json` (§4 starts), `institutions.json` (8 sectors, pairs, slot ids), `events.json` (placeholder test events only); a shape test | composer | 11 | vitest: every chart has 4 valid cells, every character a start, every institution's pair exists | done (2475) |
| 13 | The engine: `charts.ts`, `events.ts`, `state.ts`, `engine.ts` (`applyEvent`): player moves by category, witnesses by chart, lean steps, minor/major, accumulation, persistence through rotation | codex | 11, 12 | vitest: one test per §2–§4 rule; `tsc -b` | done (2476) |
| 14 | `institutions.ts` (return → eligible, sleep → transform, pending list), `town.ts` (aggregate per config, perfect check), `endings.ts` (9 endings) | codex | 13 | vitest: one test per §5–§6 rule | done (2477) |
| 15 | The simulator `sim/`: scenario runner (recruit, leave, event, return, sleep), strategies, bounded reachability search for perfect towns per ending × config; smoke tests that print each ending's verdict and route | codex | 14 | vitest `src/alignment/sim` prints a verdict for all four perfect towns | done (2478) |
| 16 | Docs: this table's statuses, HANDOFF State/Next, BRIEF state line, glossary terms for the square | sonnet | 15 | HANDOFF under 4 KB with the four headings; glossary has the alignment terms | done (2479) |
| 17 | Check: every ALIGNMENT.md §1–§7 rule has a test named after it; the misses listed in `files/pirate-ship/ALIGNMENT_COVERAGE.md` | haiku | 16 | the coverage file exists and names each rule | done (2480) |
| 18 | Joining gates as data: `gates.json` (ISFJ needs the ESTP aboard; INTP, ESTP, ESFP, ISFJ story-gated), `gates.ts`, `unlock` command, `recruit` refuses a gated character; the sim's strategies unlock and bring the key aboard; rerun | codex | 15 | vitest: one test per gate rule; the four verdicts reprinted with gates on | done (2486) |
| 19 | Develop conditions as data: `conditions.json` (farm and butcher shop need `supply bodies`; others open), `conditions.ts`, `supply` command, `develop` refuses an unmet slot; the sim supplies before developing; rerun | codex | 18 | vitest: one test per condition rule; the four verdicts reprinted | done (2487) |
| **Gate** | Rex reads the simulator's routes and tunes the placeholders in `thresholds.json`; the balance keeper reruns the sims | | | | gate |

## Phase 3: Locales, influence and the three neutrals (scope recorded 2026-10-28; not planned; nothing built)

Rex's new scope (his ChatGPT conversation, 2026-10-28; recorded in `balance/ALIGNMENT.md` §10 and the issues in
`balance/BALANCE.md` C5): ~108 characters, Suikoden-style, 16 novice slots first; locales built one at a time
(the farm first) and interconnected as he goes; characters carry points home; combinations of characters kill,
expel or ghost others; two more neutral endings (ghost, living). Rex: "Don't alter anything just yet." The units
below are the shape of the work, not tasks; each needs Rex's decision on its rule before it's queued, and every
rule stays data.

| # | Unit (outline) | Model | Needs | Done when | Status |
|---|---|---|---|---|---|
| 20 | Data shape: `institutions.json` sectors → locales with N characters; `relationships.json` (locale ↔ locale, on which event, what effect); the ghost rule's new home (per relationship or per sector, Rex) | composer | Rex's locale list (the farm first) | shape test; the 16 current owners still load | scope |
| 21 | Character fate in state (`alive | dead | ghost`), distinct from institutional ghosts; a `die`/`ghost` outcome as a sleep transformation | codex | Rex: when a death happens | one test per rule | scope |
| 22 | Influence carried home: deposit-once or daily-influence model (Rex decides), several characters per locale resolved by a rule, `influence` per character if Rex keeps it separate from alignment | codex | Rex's model | the §5 tests rewritten to the model; routes still replay | scope |
| 23 | Combos: support/relationship links and the outcomes they trigger (expel, kill, ghost), as data per locale | codex | 21, 22, Rex's first combo (the paladin) | one test per outcome | scope |
| 24 | Endings: the neutral region split into ordinary / ghost / living by fates, with a priority order and the `relevantCharacters` rule; `emptyTown` key explicit | codex | 21 | one test per ending | scope |
| 25 | Simulator: searches for ghost neutral and living neutral; sequence rules ("X before Y") as data | codex | 23, 24 | four perfect verdicts plus two neutral verdicts printed | scope |
| 26 | The 16 novice slots: starts and charts only for those who move the town (Rex draws the charts); crew-only novices stay out of the alignment data | composer | Rex's charts | shape test | scope |
| 27 | Twelve locales as the alignment data's places (tavern, docks, fort added; forge and black market as sub-branches); which locales contribute to the town's mean (Rex) | composer | 20, Rex's list | shape test; the current 16 owners still load | scope |
| 28 | The fort: a staged restoration (ruined → … → stronghold) with four alignment forms at the end, as a slot whose states are data; first available at the attack | codex | 27, Rex's stages | one test per stage rule | scope |
| 29 | The siege as an event that reads the developed slots and writes fates (killed, ghosted) and damage; losable | codex | 21, 28, Rex's rule | one test per contribution and outcome | scope |
| 30 | Combat: turn-based RPG, 4 units a side (enemy count open), converting to a turn-based tactical RPG for invasions; **a separate module with its own data and sim, not the alignment engine; no keeper owns it yet** | codex | Rex's combat design | its own smoke test | scope |
| 31 | World map: regions where recruits are found; Rex designs it first | — | Rex's map | — | scope |
| 32 | Factions as data: a faction tag per character and region; faction reputation as a §7b group; faction alliances per stage (Rex's storyline) | composer | 31, Rex's storyline | shape test | scope |
| **Gate** | Rex decides the rules above (BALANCE.md C5), locale by locale, starting with the farm; the balance keeper then writes the tasks | | | | gate |

## Later phases (not planned yet)

Selling fish and money, the gambling NPC, saves, the bigger boat and the first recruit (PIRATE.md §11 step 0).
Written here when Rex says the fishing loop is right.
