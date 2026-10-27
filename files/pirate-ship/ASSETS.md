# Pirate Ship: assets

A traditional game has no official art to fetch: everything the screen shows is made for this repo. The board is
SVG drawn from the engine's geometry, pieces are SVG shapes, sounds are synthesized with the Web Audio API
(`web/src/board/sound.ts`), and the menu picture is an original SVG in `web/public/`. Nothing is copied from a
book, a museum photo or another site; a photo used as a reference for drawing is listed in SOURCES.md and stays
in `data/pirate-ship/reference/` (gitignored).

| Asset | Made how | File | Used by | Notes |
|---|---|---|---|---|
| Board | SVG from the engine's geometry | `web/src/board/PointBoard.tsx` (or the game's own) | table | after <reference, SOURCES key> |
| Pieces | SVG shapes, CSS colours | `web/src/games/pirate-ship/pirate-ship.css` | table | |
| Dice / sticks / cowries | SVG | | throw animation | which throw the game uses |
| Menu picture | original SVG | `web/public/<name>.svg` | lobby manifest (`Image` in the module) | |
| Sounds | synthesized | `web/src/board/sound.ts` | playback | mute kept in localStorage |
| Fonts | system fonts | | | |
