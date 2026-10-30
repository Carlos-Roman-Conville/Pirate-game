# Pirate Ship: handoff (rewritten 2026-10-29 by task 2517)

Under 4 KB. Four headings, rewritten (not appended) when a unit finishes or something is parked.

## State

- Stamped from the board kit; the placeholder engine stays only so the four checks pass. Not a board game.
- Fishing (PLAN 1-10): the dock and every stage (`web/src/world/`, logic in `web/src/fishing/`, numbers in
  `data/pirate-ship/fishing.json`, all placeholders).
- Alignment (PLAN 11-15, spec `balance/ALIGNMENT.md`): `web/src/alignment/` reduces a command log (square, charts,
  events, institutions, town, endings). No UI uses it yet. Numbers in `data/pirate-ship/alignment/`, placeholders.
  Simulator: `cd web && npx vitest run src/alignment/sim`; all four perfect towns reachable with gates on.
  ghostRule decided: every-pair-both-improve (Rex, task 2481).
- Joining gates and develop conditions: `data/pirate-ship/alignment/gates.json` and `conditions.json`. INTP, ESTP,
  ESFP and ISFJ are story-gated; the farm and the butcher shop need `supply bodies`.
- Equipment catalogue (`body/data/equipment.json`, about 313 items): all researched and reconciled, with
  `conf_history` and `conf_capability` columns on every row; the state section is in `science/SCIENTIFIC_EQUIPMENT.md`.
  Build: `python body/build-body-data.py` (must print 0 validation problems). Open: navigation has no GOODS 3c
  skill (cells say `open`); `tools_gunsmith` has no 1650-1730 source (row `EQ-MET-19`, kind `searched`: Moxon, Colonial Williamsburg, Royal Armouries, probate inventories). Read in task 2517: Holme (1688) book III ch. 7 has no gunsmith (the printing ends at ch. 13); Diderot 'Arquebusier' seen only in catalogue records. The mark begins `searched:`; a hit on the plates or a probate list makes `EQ-MET-19` a `history` row.
- Realism engine (`@rex/realism`) at `E:/AI Programs/Toolchain/realism`, outside this repo: phase 2 done. The game's data
  files hold id plus game columns; `build-body-data.py` reads `E:/AI Programs/Toolchain/realism/data/library` and counts
  a missing library as a validation problem.

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
