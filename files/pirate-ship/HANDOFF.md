# Pirate Ship: handoff (2026-10-28, rewritten by task 2482)

Under 4 KB. Four headings, rewritten (not appended) when a unit finishes or something is parked.

## State

- Stamped from the board kit; the placeholder engine stays only so the four checks pass. Not a board game.
- PLAN units 1-10 done: the dock and every fishing stage (`web/src/world/`, pure logic in `web/src/fishing/`,
  numbers in `data/pirate-ship/fishing.json`, all placeholders).
- PLAN Phase 2 alignment units 11-15 built (tasks 2474-2478): `web/src/alignment/` (spec `balance/ALIGNMENT.md`).
  `square.ts` classifies the ±100 square into 9 regions; `charts.ts`, `events.ts`, `state.ts`, `engine.ts` reduce a
  command log; `institutions.ts`, `town.ts`, `endings.ts` do sleep transforms, the town mean and the 9 endings.
  No UI uses it yet.
- ghostRule is decided: every-pair-both-improve (Rex, task 2481; ALIGNMENT.md §8).
- Numbers: `data/pirate-ship/alignment/` (`thresholds.json` holds every §8 key; `charts.json`, `starts.json`,
  `institutions.json`, `events.json` placeholder events only). All placeholders.
- Simulator: `cd web && npx vitest run src/alignment/sim`. Joining gates are in the sim (`gates.json`,
  `unlock`; ISFJ needs the ESTP aboard; INTP, ESTP, ESFP and ISFJ are story-gated) and all four perfect towns are
  still reachable with gates on (og 61, cg 68, oe 49, ce 57 steps).
- Develop conditions are in the sim (`data/pirate-ship/alignment/conditions.json`, `conditions.ts`; the farm and the
  butcher shop need `supply bodies`; placeholder: once is enough).

## Next

1. Phase 2 gate: Rex reads the simulator report and tunes the numbers (ALIGNMENT.md §8).
2. Rex replays the full catch on desktop; tick `../progress/ui/pirate-ship.json` only after a real browser check.

## Blocked

Rex's to decide (not tasks):
- No-previous diagonal tie inside the ring: e.g. (20,20) reads the plain quadrant though under `pure` 30. Can't
  happen from today's starts.
- Ghost state beyond undeveloped; hybrid ending names.
- Two simultaneous winners-only transformations (no tie rule).
- Any §8 key still undecided: `step.minor/major/anchor`, `step.metric/overshoot`, `startCoords`,
  `pendingWhenAboard`, `undevelopedCounts`, `leanFactor`, `witnesses` (absent learning), `institutionLock`, the
  INTJ "becomes neutral" case.
- Pull-in fairness numbers (FISHING.md stage 7) and the game's real name.
- `desktop:` fishing replay checks (HUD at zoom 2+, snapping line, bite sound, phone-size screen) and
  progress-page edits live outside this repo.

## Gotchas

- The alignment engine is TypeScript under `web/src/alignment/`, not `engine/`; `endings.json` sits there too, not
  under `data/`.
- The folder is `Games/RPG's/pirate-ship`: the apostrophe breaks unquoted Git Bash paths.
- Every game's server is `Archive.Server.exe`: stop yours by path or preview_stop, never by name (ISSUES I-073).
- Phaser 4.2.1 and vitest 5 are in the npm cache: `npm install --offline`.
- `web/src/board/` is unused kit code; leave it.
