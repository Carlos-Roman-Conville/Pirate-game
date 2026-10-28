# Pirate Ship: handoff (2026-10-26, rewritten by task 2468)

Under 4 KB. Four headings, rewritten (not appended) when a unit finishes or something is parked.

## State

- Stamped from the board kit; the placeholder engine stays only so the four checks pass. Not a board game.
- PLAN units 1-10 done: the dock and every fishing stage (`web/src/world/`, pure logic in `web/src/fishing/`,
  numbers in `data/pirate-ship/fishing.json`, all placeholders).
- PLAN Phase 2 units 11-15 done (tasks 2474-2478): the alignment backend, `web/src/alignment/` (spec
  `balance/ALIGNMENT.md`). `square.ts` classifies the ±100 square into 9 regions; `charts.ts`, `events.ts`,
  `state.ts`, `engine.ts` reduce a command log (moves, witnesses, lean); `institutions.ts`, `town.ts`,
  `endings.ts` do sleep transforms, the town mean and the 9 endings. No UI uses it yet.
- Numbers: `data/pirate-ship/alignment/` (`thresholds.json` holds every §8 config key; `charts.json`,
  `starts.json`, `institutions.json`, `events.json` placeholder events only). All placeholders.
- Simulator: `cd web && npx vitest run src/alignment/sim` prints a verdict and replayable route for each of the four
  perfect towns (bounded search; "unreachable" means none found within limits).

## Next

1. Phase 2 gate: Rex reads the simulator report and tunes the numbers (ALIGNMENT.md §8).
2. Rex replays the full catch on desktop; tick `../progress/ui/pirate-ship.json` only after a real browser check.

## Blocked

- ALIGNMENT.md §8 open keys, all Rex's: `step.minor/major/anchor`, `step.metric/overshoot`, `startCoords`,
  `pendingWhenAboard`, `undevelopedCounts`, `leanFactor`, `witnesses` (absent learning), `institutionLock`, the
  INTJ "becomes neutral" case.
- Pull-in fairness numbers (FISHING.md stage 7) and the game's real name: Rex's.
- `desktop:` fishing replay checks (HUD at zoom 2+, snapping line, bite sound, phone-size screen) and progress-page
  edits live outside this repo.

## Gotchas

- The folder is `Games/RPG's/pirate-ship`: the apostrophe breaks unquoted Git Bash paths.
- Every game's server is `Archive.Server.exe`: stop yours by path or preview_stop, never by name (ISSUES I-073).
- Phaser 4.2.1 and vitest 5 are in the npm cache: `npm install --offline`.
- `web/src/board/` is unused kit code; leave it.
