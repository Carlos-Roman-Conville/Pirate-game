# Pirate Ship: handoff (2026-10-26, rewritten by task 2468)

Under 4 KB. Four headings, rewritten (not appended) when a unit finishes or something is parked.

## State

- Stamped from the board kit; the placeholder engine (three in a row) stays only so the four checks pass. Not a
  board game. Design docs: `PIRATE.md`, `DUTIES.md`, `STATS.md`, `crew/ROSTER.md`, `minigames/FISHING.md`.
- PLAN units 1-10 done (tasks 2450-2463). The dock (`web/src/world/DockScene.ts`, `catchView.ts`) plays every
  fishing stage: read water, aim, direction, power, lure rhythm, bite, pull in, result. Logic is pure TS in
  `web/src/fishing/`, numbers in `data/pirate-ship/fishing.json` (all placeholders).
- Playtest fixes (2468) are in: a second zoom-1 camera (`hudCam`) draws all HUD so it shows at any zoom; the lure's
  first beat is one period after the play press (test "first beat"); the fish silhouettes stay through aim,
  direction and power (`silhouettes.ts`); aim's arrow keys move in screen directions; rhythm boxes carry their
  names; the prompt follows the lure phase. Pull-in labels (tension, integrity, landing point) show.
- Pull in: hold Space, intensity grows to `maxPullIntensity`, release pulls; past `weakenTensionThreshold` costs
  line integrity, past `lineBreakTension` it snaps. Strength lands fish in fewer pulls.
- Lure and bite are separate stages; `bite.lureWaitFactor` (placeholder 0.5) shortens the wait on a lure draw.

## Next

1. Rex replays the full catch on desktop and reports what still feels wrong.
2. Tick `../progress/ui/pirate-ship.json` pieces only after a real browser check.

## Blocked

- Pull-in fairness numbers (FISHING.md stage 7): Rex's call; they stay placeholders in `fishing.json`.
- The game's real name (repo and folder rename when Rex names it): Rex's.
- `desktop: open the dock in a browser and play a full catch` (no task has run the game in a browser).
- `desktop:` check a hard pull snapping the line, the bite's sound, and a phone-size screen.
- `desktop:` progress-page edits (`../progress/ui/pirate-ship.json`) live outside this repo.

## Gotchas

- The folder is `Games/RPG's/pirate-ship`: the apostrophe breaks unquoted Git Bash paths.
- Every game's server is `Archive.Server.exe`: stop yours by path or preview_stop, never by name (ISSUES I-073).
- Phaser 4.2.1 and vitest 5 are in the npm cache: `npm install --offline`.
- `web/src/board/` is unused kit code; leave it.
