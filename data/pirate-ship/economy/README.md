# Economy data (pirate-ship, client of the Toolchain economy engine)

Generated. Do not edit these files by hand: run `python files/pirate-ship/economy/build-economy-data.py`, which
reads the design record (`files/pirate-ship/economy/skill-tree.json` and `GOODS.md`) and rewrites them.

| File | What it holds |
|---|---|
| `goods.json` | `rows`: the 65 cargo rows of GOODS.md with their sourced kind, route, package, spoilage, price text and type. `goods`: the engine's goods, one per recipe output (174), each with its row, type (base / specialty / cultural, marked proposed), off-map flag, mark and the skill that makes it. `basePrice` is null everywhere: the balance lane sets it. |
| `skills.json` | The 40 goods skills (5 gathering, 35 crafting), Rex's five bands, and the recipe rule (materials + equipment + a minimum band; skill never creates a material). |
| `recipes.json` | 183 recipes: output good, skill, band and minimum level, inputs (all needed) and `inputsAny` (one will do), off-map flag, Swimming gate, and 9 services that make no good. |
| `occupations.json` | 41 period labels over the skills (Mariner, Cooper, Chymist…), each with its evidence; labels level nothing and grant nothing. |

Marks on every good: `source` (a period record, GOODS.md Part 4), `proposed` (placement for Rex), `unsourced` (Rex's
design addition with no period source), `estimate` (worked out from sourced inputs, GOODS.md 1j).

Not here yet: ports (the five per-settlement numbers: stock, consumption per day, target reserve, production per
day, base price), companies, ships and routes (ALIGNMENT §10). The engine itself lives in `E:/AI Programs/Toolchain/economy/`
(not built).

Status: Rex reviewed the skills, placements and occupations on 2026-10-29. Goods types and every price are still open
for him (GOODS.md, "Open for Rex").
