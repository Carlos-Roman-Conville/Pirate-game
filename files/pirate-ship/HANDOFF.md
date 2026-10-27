# Pirate Ship: handoff (2026-10-26, rewritten by the setup session)

Under 4 KB. Four headings, rewritten (not appended) when a unit finishes or something is parked.

## State

- Stamped from the board kit (`_template/new_game.py --kind board`, ports 5308 / 5320). The placeholder engine
  (three in a row) is left in place only so the four checks pass; this is not a board game.
- Design docs moved in: `PIRATE.md`, `DUTIES.md`, `STATS.md`, `crew/ROSTER.md`, `minigames/FISHING.md`.
- Lane `pirate-ship` exists; nothing queued yet. PLAN.md Phase 1 (the dock and fishing) is next.

## Next

1. PLAN.md unit 1: Phaser 4 and the dock scene (three-quarter top-down, square tiles, walking).
2. Units 2–7 in order: the fishing state machine, then each stage Rex designed.

## Blocked

- The bite stage (FISHING.md stage 6): Rex is designing it. Until then the lure stage hands straight to pulling
  in, and the code says so.
- How pulling in stays fair (FISHING.md): Rex's call; the unit ships tunable numbers in data for him to set.
- The game's real name (the repo and folder rename when Rex names it).

## Gotchas

- The folder is `Games/RPG's/pirate-ship`: the apostrophe breaks unquoted Git Bash paths. Gates run inside the
  repo with relative paths.
- Every game's server is `Archive.Server.exe`: stop yours by path or preview_stop, never by name (ISSUES I-073).
- Phaser 4.2.1 and vitest 5 are in the npm cache (High Roller uses them): `npm install --offline`.
