# Economy data (pirate-ship, client of the Toolchain economy engine)

Generated. Do not edit these files by hand: run `python files/pirate-ship/economy/build-economy-data.py`, which
reads the design record (`files/pirate-ship/economy/skill-tree.json` and `GOODS.md`) and rewrites them. The counts
below are those of the last build; the build prints the current ones.

| File | What it holds |
|---|---|
| `goods.json` | `rows`: the cargo rows of GOODS.md (133) with their sourced kind, route, package, spoilage, price text and type. `goods`: the engine's goods, one per recipe output plus the imported-only goods that have no recipe here (about 260), each with its row, type (base / specialty / cultural / money / open, marked proposed), `offMap`, `origin` (where in the Atlantic or Asia it comes from), `region` (base game or an expansion), mark, and the skill that makes it. `basePrice` is null everywhere: the balance lane sets it. |
| `skills.json` | The goods skills (42: 7 gathering, 35 crafting), Rex's five bands, the recipe rule, the regions with their escalation tier, and `learnedBy` per skill (open until Rex fills it). |
| `recipes.json` | About 250 recipes: output good, skill, band and minimum level, `inputs` (all needed), `inputsAny` (one will do), `equipment` (had, not consumed; the `facilities` list names each), `byproductOf` (yielded alongside another recipe's run), off-map flag, Swimming gate, `knowledge` (common / learned / foreign), `region`, and services that make no good (`service: true`, `output: null`). |
| `ports.json` | The base game's locales from `files/pirate-ship/economy/atlantic-map.json` (ATLANTIC-MAP.md): 85 nodes in six regions with tier (major / minor / candidate), period verdict, role, and `produces` / `consumes` goods ids from the verification notes. The five per-settlement numbers (stock, consumption per day, target reserve, production per day, base prices) are null until the balance lane sets them. |
| `occupations.json` | 43 period labels over the skills (Mariner, Cooper, Chymist…), each with its evidence; labels level nothing and grant nothing. |

Marks on every good: `source` (a period record, GOODS.md Part 4), `proposed` (placement for Rex), `unsourced` (Rex's
design addition with no period source), `estimate` (worked out from sourced inputs, GOODS.md 1j).

Not here yet: the five per-settlement numbers on each port, companies, ships and routes (ALIGNMENT §10); recipe quantities, yields, durations and labour;
spoilage and packaging as rules rather than prose. The engine itself lives in `E:/AI Programs/Toolchain/economy/`
(not built).

Status: Rex reviewed the skills, placements and occupations on 2026-10-29 and confirmed the Atlantic list as the
base game's goods. A data review the same day (GOODS.md 3h) led to the material dependencies, the equipment field,
the service flags and the by-products. Goods types and every price are still open for him (GOODS.md, "Open for Rex").
