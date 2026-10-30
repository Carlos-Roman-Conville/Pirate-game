# Pirate Ship: handoff (rewritten 2026-10-30 by task 2563)

Under 4 KB. Four headings, rewritten (not appended) when a unit finishes or something is parked.

## State

- Stamped from the board kit; the placeholder engine stays only so the four checks pass. Not a board game.
- Fishing (PLAN 1-10): the dock and every stage (`web/src/world/`, logic in `web/src/fishing/`, numbers in
  `data/pirate-ship/fishing.json`, all placeholders).
- Alignment (PLAN 11-15, spec `balance/ALIGNMENT.md`): `web/src/alignment/` reduces a command log. No UI uses it yet.
  Simulator: `cd web && npx vitest run src/alignment/sim`. ghostRule decided: every-pair-both-improve (Rex, 2481).
  Gates and conditions: `data/pirate-ship/alignment/gates.json`, `conditions.json`.
  INTP, ESTP, ESFP and ISFJ are story-gated; the farm and the butcher shop need `supply bodies`.
- Equipment catalogue (`body/data/equipment.json`, about 313 items) is researched and reconciled; see
  `science/SCIENTIFIC_EQUIPMENT.md`. Build: `python body/build-body-data.py` (0 validation problems). Open: navigation has no
  GOODS 3c skill; `tools_gunsmith` (`EQ-MET-19`) has no 1650-1730 source, `searched:` until a readable Roxburghe Holme or
  Diderot plate is found.
- Realism engine `@rex/realism` at `E:/AI Programs/Toolchain/realism`, outside this repo; the game's data files hold id plus
  game columns, `build-body-data.py` reads its `data/library`.

### Settlement (task 2563 re-ran it on the engine of 2561/2562)

In `web/`: `node --experimental-strip-types src/world/settlement.run.ts` (Aug 1-30, about 22 s; the sim test asserts under 60 s).
Circulation runs every body step (F-MD-9 retired by 2570); the ledger's last line is peak resident memory (~340 MB, bound 1.5 GB).
- Every path that can end a body opens an engine `Crisis`; `healDay` collects them before `releaseDayTrace` renews the trace.
  Day 12 settler-4's unbound chest wound (F-MD-8, host rate) reaches class IV and opens a crisis; nobody is declared dead.
- Hydration: `workRate` multiplies by `work_capacity_hydration`. Everyone drinks hourly (F-CH-9) except the bakery cooks from
  day 20 (F-SE-12): two hydration crises each on day 21, the bakery stops.
- 2562 found no vector source: `exposeAt` reads the engine's `vector` where a row has one, else F-MD-4 (`doseSource`).
- Fixtures: `web/src/world/FIXTURES.md` (F-SE, F-MD-8, F-CH-9; retired rows say `retired by 2563` or `2570`). P12 thirst needs two
  dry days (F-SE-11, Rex).

## Next

1. Phase 2 gate: Rex reads the simulator report and tunes the numbers (ALIGNMENT.md §8).
2. Rex replays the full catch on desktop; tick `../progress/ui/pirate-ship.json` only after a real browser check.

## Blocked

Rex's to decide (not tasks):
- Alignment §8 keys still undecided (`step.*`, `startCoords`, `pendingWhenAboard`, `undevelopedCounts`, `leanFactor`,
  `witnesses`, `institutionLock`, the INTJ "becomes neutral" case); ghost state beyond undeveloped; hybrid ending names;
  two simultaneous winners-only transformations; the no-previous diagonal tie.
- Pull-in fairness numbers (FISHING.md stage 7) and the game's real name.
- Wound bleed rates by kind (F-MD-3/8), a water supply (F-CH-9), fate rules for a crisis (F-MD-7).
- `desktop:` fishing replay checks: HUD at zoom 2+, the snapping line, the bite sound, the phone-size screen.
  Progress-page edits live outside this repo.

## Gotchas

- The alignment engine is TypeScript under `web/src/alignment/`, not `engine/`; `endings.json` sits there, not in `data/`.
- The diagonal tie cannot happen from today's starts.
- The folder is `Games/RPG's/pirate-ship`: the apostrophe breaks unquoted Git Bash paths.
- Every game's server is `Archive.Server.exe`: stop yours by path or preview_stop, never by name (ISSUES I-073).
- Phaser 4.2.1 and vitest 5 are in the npm cache: `npm install --offline`.
- `web/src/board/` is unused kit code; leave it.
