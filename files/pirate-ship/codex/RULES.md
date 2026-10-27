# Standing rules for Codex in <repo> (Pirate Ship)

Codex builds parts of this game's **engine** when a task names them (a variant, a faster search, a rule the engine
lacks). Read `files/pirate-ship/BRIEF.md`, then your task file; they win over anything below if they disagree.

- You work in this folder only: `<repo or engine worktree path>` (branch `<branch>`). Never touch the main folder if
  another worker is in it, never merge into or check out its branch.
- **You may edit:** `engine/Games/PirateShip/`, `engine/Core/` (the board kit copy: it is this game's own), `engine.tests/`,
  and `files/pirate-ship/RULES.md` rulings (next free number in `files/pirate-ship/HANDOFF.md`). Not: other games' folders, `web/`,
  `server/` unless the task names it, config, dependencies.
- Follow RULES.md exactly; a point the sources don't settle gets a D-row marked UNVERIFIED and a test named after it.
- Keep the engine deterministic: chance only from named `Rng` streams, searches stopped by node counts, never clocks.
- **Gate before you finish:** `dotnet test engine.tests` passes, including the conformance suite (`PirateShipSimTests`).
- No servers. No new dependencies. Commit your own paths only (`git add <paths>`, never `git add -A`), each message
  ending with `Co-Authored-By: OpenAI Codex <codex@openai.com>`. Never push. Leave nothing uncommitted.
- End with a report: what you built, rulings added, commits, test results.
