# Pirate Ship: handoff (2026-10-26, rewritten by task 2459)

Under 4 KB. Four headings, rewritten (not appended) when a unit finishes or something is parked.

## State

- Stamped from the board kit; the placeholder engine (three in a row) stays only so the four checks pass. This is
  not a board game. Design docs: `PIRATE.md`, `DUTIES.md`, `STATS.md`, `crew/ROSTER.md`, `minigames/FISHING.md`.
- PLAN units 1-8 done (tasks 2450-2457): Phaser dock world (`web/src/world/DockScene.ts`, `map.ts`); the fishing
  machine and every stage as pure TS in `web/src/fishing/` (readWater, cast, lure, bite, pullIn, loop), each with
  vitest; numbers in `data/pirate-ship/fishing.json`; result panel and return to walking.
- Machine order (2459): lure and bite stay separate stages. The `lure` action hands `lureDrawn` to the run, and
  `createBiteSchedule` shortens the waiting beat by `bite.lureWaitFactor` (placeholder 0.5, Rex's to set). Test:
  "bites sooner" in `lure.test.ts`. A wrong rhythm no longer ends the run; the bite just waits its full time.
- `glossary.json` filled with the fishing terms. Never browser-checked (the belt has no browser).

## Next

1. Units 9 (2460, fishing screen: cast) and 10 (2461, fishing screen: lure, bite, pull in, result) are queued; the
   scene still drives stages with stub presses.
2. Desktop live check of the dock and fishing loop in the browser; tick `../progress/ui/pirate-ship.json` when a
   screen piece is truly done.

## Blocked

- Pull-in fairness numbers (FISHING.md): Rex's call; they stay placeholders in `fishing.json`.
- The game's real name (repo and folder rename when Rex names it): Rex's.
- `desktop:` browser smoke check of the dock; progress-page edits live outside this repo.

## Gotchas

- The folder is `Games/RPG's/pirate-ship`: the apostrophe breaks unquoted Git Bash paths. Gates run inside the
  repo with relative paths.
- Every game's server is `Archive.Server.exe`: stop yours by path or preview_stop, never by name (ISSUES I-073).
- Phaser 4.2.1 and vitest 5 are in the npm cache: `npm install --offline`.
- `web/src/board/` is unused kit code; leave it.
