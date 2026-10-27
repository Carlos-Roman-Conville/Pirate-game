# Pirate Ship: conventions

This repo is one game: Pirate Ship (working title · Rex's original), a traditional board or dice game rebuilt as an automated rules engine
with a computer opponent, played in the browser. No other game lives here, and nothing here is shared with another
repo at run time: change anything you need to. The standard is `games/CARD_GAMEDEV.md` (engine, server, screen) and
`games/lobby/TRADITIONAL_GAMES.md` §5 (the board kit and its gates); this game's specifics are in
`files/pirate-ship/BRIEF.md`. Start from `files/pirate-ship/` (rules, sources, handoff notes).

<!-- template:start -->
## Template

Stamped from `games/_template` with `--kind board` (kit folder `_template/board-kit/`): traditional board and dice games: boards (grid, point graph, track, pits), dice with odds tables, negamax and expectiminimax search, Ludii referee tests, the conformance gates. `TEMPLATE.json` at the repo root says so in data; `games/_template/kits.json` is the kit directory. Kit docs: `_template/README.md#Board games`, `_template/KITS.md`, `lobby/TRADITIONAL_GAMES.md#5`. Kit files this game owns a copy of: `engine/Core/Boards/`, `engine/Core/Dice.cs`, `engine/Core/Search.cs`, `engine.tests/Conformance/`, `engine.tests/Kit/`, `server/Lobby.cs`, `web/src/board/`. A fix every board game needs goes back into the kit in the same session (`_template/KITS.md`, rule 2); `python _template/check_game.py <id>` says what the game is behind on.
<!-- template:end -->

## Layout

| Where | What |
|---|---|
| `engine/Games/PirateShip/` | The rules engine, namespace `Archive.Engine.Games.PirateShip`, types carry the two-letter prefix (`PsGame`, `IPsDecider`). `State.cs` (options, the position as a small value, events), `Rules.cs` (pure functions on the position, the search's `IRules`), `Game.cs` (turns, `Ask`, the view), `Decisions.cs` (every choice is a decision; `PsRecorded` replays answers), `Ai.cs` (levels on the kit's search). Random streams: `Rng.Stream("<name>")`, names as constants. |
| `engine/Core/` | `Rng`, `Events` (template scaffold) and the board kit: `Boards/PointGraph.cs` (points and lines, ≤ 64), `Boards/Grid.cs` (square cells), `Boards/Track.cs` (race routes), `Boards/Pits.cs` (mancala), `Dice.cs` (throws with odds tables), `Search.cs` (negamax, expectiminimax). Copied in when the repo was stamped; yours now. Delete the parts the game doesn't use, with their tests in `engine.tests/Kit/`. |
| `engine.tests/` | `Kit/` (the kit's own tests), `Conformance/BoardConformance.cs` (the §5.3 gates), `Games/PirateShip/`: `PirateShipSimTests.cs` points the gates at this game, `PirateShipRuleTests.cs` one test per rule and per D-row (named `D<n>_…`, which the progress page counts), `PirateShipMatchTests.cs` the lobby contract with the real server in-process, `PirateShipLudiiTests.cs` Ludii as a referee (`Conformance/Ludii.cs`: trace reader, topology, skip when the traces are missing; utilities/ludii/README.md). |
| `server/` | `ServerApp.cs` builds the app (WebSockets, lobby token, manifest), `Lobby.cs` (contract v2: tokens, signed events), `Games/PirateShip/PirateShipModule.cs` (solo and same-screen sessions: seed + options + answers, replayed; undo; saves in `server/saves/`), `Games/PirateShip/PirateShipMatches.cs` (contract v3 online matches over one WebSocket). |
| `web/src/games/pirate-ship/` | The game's screen (`index.tsx`), `Rules.tsx`, styles in `pirate-ship.css` prefixed `pirate-ship-`. `web/src/board/` is the kit's screen half: `PointBoard.tsx` + `board.css`, `playback.ts` (events in order), `motion.ts` (reduced motion), `sound.ts` (Web Audio, mute), `online.ts` (the match socket). |
| `data/pirate-ship/` | `glossary.json`, `about.json` (the lobby's history page). `reference/` is gitignored. |
| `files/pirate-ship/` | `BRIEF.md`, `HANDOFF.md`, `RULES.md` (rules as implemented, each sourced, D-rows), `SOURCES.md`, `ASSETS.md`, `FORMATS.md` (modes and variants), `cursor/RULES.md`, `codex/RULES.md`. |

## Before every commit

Run all four; master must always build:

```
dotnet build CcgArchive.sln
dotnet test engine.tests
cd web && npx tsc -b && npm run build
```

`npx tsc -b` is the strict check the build uses; `tsc --noEmit` is looser and misses errors.

## Commits

Commit on `master` in this folder. Don't push: Rex pushes. Own paths only, never `git add -A`. End the message with
the session's co-author line.

## Run

- `dotnet run --project server` → http://localhost:5308 (also serves the built client). Every game's server
  is `Archive.Server.exe`: stop yours by its path or with preview_stop, never by name (ISSUES I-073).
- `npm run dev` in `web/` → http://localhost:5320 (proxies `/api` to the server).
- Online play by hand: start the server with `LOBBY_SECRET` set (and `LOBBY_URL=http://127.0.0.1:9` with no lobby
  running), sign match tokens with it, open `/?match=<32 hex>&token=<token>` in two tabs (ISSUES I-078).

## Progress page

`../progress/index.html` counts the RULES.md D-rows a test names (adapter `board`). When you finish a UI piece, set
`"done": true` for it in `../progress/ui/pirate-ship.json` in the same commit.
