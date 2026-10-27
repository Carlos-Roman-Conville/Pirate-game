# Pirate Ship: handoff (2026-10-26, rewritten by the setup session)

Under 4 KB. Four headings, rewritten (not appended) when a unit finishes or something is parked.

## State

- Stamped from the board kit (`_template/new_game.py --kind board`, ports 5308 / 5320). The placeholder engine
  (three in a row) is left in place only so the four checks pass; this is not a board game.
- Design docs moved in: `PIRATE.md`, `DUTIES.md`, `STATS.md`, `crew/ROSTER.md`, `minigames/FISHING.md`.
- PLAN.md unit 1 done (2026-10-26): Phaser 4.2.1 and vitest 5 installed offline. The screen
  (`web/src/games/pirate-ship/index.tsx`) is a Phaser world: `web/src/world/DockScene.ts` draws script-made tiles
  and a placeholder player (arrows/WASD, down/up/side mirrored, integer zoom, camera follows). Map and collision are
  pure TS in `web/src/world/map.ts` (tests beside it), map data in `data/pirate-ship/maps/dock.json` (rows of
  characters, legend says which are solid). The old board kit files in `web/src/board/` are unused now.
- Not browser-checked (the belt has no browser); the Gate's desktop smoke check covers it.

## Next

1. Units 2–8 in order: the fishing state machine (pure TS in `web/src/fishing/`), then each stage (all seven are
   Rex's design; the bite landed 2026-10-26).
2. Tick the UI piece in `../progress/ui/pirate-ship.json` when a screen piece is truly done.

## Blocked

- How pulling in stays fair (FISHING.md): Rex's call; the unit ships tunable numbers in data for him to set.
- The game's real name (the repo and folder rename when Rex names it).

## Gotchas

- The folder is `Games/RPG's/pirate-ship`: the apostrophe breaks unquoted Git Bash paths. Gates run inside the
  repo with relative paths.
- Every game's server is `Archive.Server.exe`: stop yours by path or preview_stop, never by name (ISSUES I-073).
- Phaser 4.2.1 and vitest 5 are in the npm cache (High Roller uses them): `npm install --offline`.
