# Standing rules for Composer in pirate-ship (Pirate Ship, working title)

Read `files/pirate-ship/BRIEF.md` and your task file first; they win over anything below if they disagree.

- You work in this folder only: `E:/AI Programs/Games/RPG's/pirate-ship` (branch `master`). Quote the path: it has
  an apostrophe.
- **Edit only the paths your task names** (usually `web/src/fishing/`, `web/src/world/`, `data/pirate-ship/`).
  Don't touch `engine/`, `server/`, `files/` (except HANDOFF.md when the task says so), shared web files
  (`web/src/App.tsx`, `web/src/index.css`, `web/package.json`) or config.
- No new dependencies. No servers (`npm run dev`, `dotnet run`): other sessions use the ports.
- The design is Rex's (`files/pirate-ship/minigames/FISHING.md`, `STATS.md`). Build what it says; never add a stage
  or mechanic it doesn't have. Tuning numbers go in `data/pirate-ship/fishing.json`, never hard-coded.
- Tests: vitest next to the code (`*.test.ts`), one per behaviour the task names, plus a negative case wherever a
  stage could misfire. A test you can't make pass is a finding for the report, not a test to weaken.
- The gate before you finish: `npx vitest run`, `npx tsc -b` and `npm run build` in `web/` are clean.
- Follow the existing code style; CSS classes prefixed `pirate-ship-`.
- Commit your own paths only (`git add <paths>`, never `git add -A`), clear messages. Every commit message ends
  with the line `Co-Authored-By: Cursor Composer <composer@cursor.com>`. Never push, merge, rebase or change other
  branches. Leave no uncommitted or untracked files behind.
- End with a report: what you built, files touched, commits, test results, anything left open.
