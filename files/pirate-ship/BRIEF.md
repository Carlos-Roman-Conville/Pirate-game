# Pirate Ship (working title): brief

Under 3 KB, injected at session start. Details in named files.

**What it is.** Rex's original game, a spin-off of High Roller: a Stardew-style life sim as a pirate, starting alone
on a small boat at one port, growing a crew of psycho pirates you can romance, with gambling as the economy.
Three-quarter top-down (the Stardew view), High Roller's art style. Play money only, never real. The first build
is only **the dock and the fishing minigame**; everything else is later.

**State (dated).** 2026-10-26: stamped (board kit, placeholder engine only); design docs in this folder;
PLAN.md units 1-8 done (dock world, fishing machine and stages, result loop); units 9-10 (fishing screens, tasks 2460-2463) done: cast, lure, bite and pull-in play on the dock, never browser-checked. 2026-10-28: the alignment backend (PLAN Phase 2, tasks 2474-2478) is built and simulated in `web/src/alignment/`; numbers are placeholders; joining gates and develop conditions in as data (tasks 2486-2487). Scope change recorded the same day (108 characters, locales, nine factions on the square, world, two acts, combat, map, economy): `balance/ALIGNMENT.md` §10, PLAN Phase 3; nothing built until Rex decides the rules.

## Where things are

- `PLAN.md`: the build plan; the planner works from it, one row per belt task.
- Design (Rex's, never redecided by a task): `PIRATE.md` (spec), `minigames/FISHING.md` (the fishing stages),
  `STATS.md` (hidden stats), `DUTIES.md` (ship duties), `crew/ROSTER.md` (the 32 crew).
- `HANDOFF.md`: State / Next / Blocked / Gotchas. `codex/RULES.md`, `cursor/RULES.md`: workers' fences.
- `web/src/`: the client (Phaser 4 world once PLAN unit 1 lands). `data/pirate-ship/`: data, `glossary.json`.

## Run and check

- Server `dotnet run --project server` → http://localhost:5308; web `npm run dev` in `web/` → http://localhost:5320
  (`strictPort`).
- Before every commit: `dotnet build CcgArchive.sln`, `dotnet test engine.tests`, `npx tsc -b && npm run build`
  in `web/` (and `npx vitest run` once unit 1 adds it).

## Rules every task follows

- **Not a board game:** `_template/check_game.py`, template-drift and the board-kit gates don't apply. The
  placeholder engine stays only so the four checks pass; no task works on it, no D-row tasks, no Ludii.
- **Minigames are Rex's design.** Build only what `minigames/FISHING.md` says; a task never designs a stage or
  mechanic of its own. Tunable numbers go in data, not code.
- Never invent a game rule or mechanic; a gap is a question for Rex in HANDOFF Blocked.
- Placeholder art is script-drawn until Rex's renders land.
- Ask Rex before downloading anything (npm packages outside the cache too). Never push. Commit only your own
  paths with the co-author line.
- The repo lives in `Games/RPG's/pirate-ship/`: quote paths, the folder name has an apostrophe.
