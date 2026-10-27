# Pirate Ship

Pirate Ship (working title · Rex's original), playable in the browser: the rules as an automated engine with a computer opponent at three
levels, two players on one screen, and online matches through the lobby. A traditional game with no owner; the board,
pieces and sounds here are drawn and synthesized for this repo (`files/pirate-ship/ASSETS.md`), and each rule cites its
source (`files/pirate-ship/SOURCES.md`). One of the traditional games planned in `../lobby/TRADITIONAL_GAMES.md`.

Conventions for agents: [AGENTS.md](AGENTS.md) and `../CARD_GAMEDEV.md`. Rules, sources and notes: `files/pirate-ship/`.

## Running it

- `dotnet test engine.tests`
- `dotnet run --project server` → http://localhost:5308 (serves the built client)
- `npm install` then `npm run dev` in `web/` → http://localhost:5320
