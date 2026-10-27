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

## Later phases (not planned yet)

Selling fish and money, the gambling NPC, saves, the bigger boat and the first recruit (PIRATE.md §11 step 0).
Written here when Rex says the fishing loop is right.
