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

## The platform engines

`web/` depends on three packages of the [Reality-simulator](https://github.com/Carlos-Roman-Conville/Reality-simulator)
platform: `@rex/realism`, `@rex/settlement`, `@rex/economy`. `web/package.json` points at them with `file:` paths to
the local working copies (`Toolchain/<name>` on the development machine). On a fresh clone, install them from a
checkout of the platform instead:

    git clone https://github.com/Carlos-Roman-Conville/Reality-simulator ../Reality-simulator
    cd web
    npm install ../../Reality-simulator/packages/realism ../../Reality-simulator/packages/settlement ../../Reality-simulator/packages/economy
    npm install

`npm install <path>` rewrites the three `file:` entries to the checkout you gave it. The engines are independent of
this game; the game reaches them only through its adapters in `web/src/settlement/`, `web/src/economy/` and
`web/src/world/adapters/`. A pinned-dependency install that needs no sibling checkout is still open
(`Reality-simulator/docs/MIGRATION.md`).
