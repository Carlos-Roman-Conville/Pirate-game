# Fixtures: stand-ins the engine adapters use where the game has no system yet

Phase 5 rule 6 (`Toolchain/realism/PHASES-4-5.md`): where the simulation needs something the game does not have, the
adapter uses a named fixture declared here: what it stands in for, the value used, and the decision Rex must make. A
fixture never silently decides a rule. Values live in data files, never in code. Each adapter adds its rows below.

## Characters (`web/src/world/adapters/characters.ts`, task 2533)

Values are in `data/pirate-ship/world/characters.json`. They are the checkpoint-1 host fixtures
(`Toolchain/realism/examples/human-week.ts`), not measurements of any pirate.

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-CH-1 body size | A character's mass, height and starting fat and water. `alignment/state.ts` holds a slug, a position, a location and flags; `STATS.md` §1 holds attributes, none of them a mass. | 70 kg, 175 cm, 15 kg fat, 40 kg body water, for everyone | Does a character's mass and height come from Strength, Endurance and Constitution, from the roster, or from a rolled build? Until decided, everyone is the same body. |
| F-CH-2 age | A character's age (the roster has none; `STATS.md` §1 says the attribute maximum falls with age but gives no age). | 30 years, for everyone | Give each roster entry an age. |
| F-CH-3 sex | The roster has "a man and a woman" per type (`ROSTER.md`, he / she lines) but no field in code. | male (`male: 1`), for everyone | Add sex to the character record; the engine reads it for resting rate, nutrient needs and the menstrual path. |
| F-CH-4 the room | Where the body is: a ship's deck, hold or cabin. There is no place system (task 2535). | 40 m3 of air at 24 C, 2 air changes an hour, sea-level pressure | The place adapter (2535) replaces this with the game's decks and the climate tables. |
| F-CH-5 the day | The game's day boundary. The engine closes sleep, fatigue and nutrition books at `dayStartH`. | 12 (the nautical day, noon to noon, the engine's default), 60 s steps | Confirm that the game's "day" for bodies is the nautical day, not the dawn-to-dawn day of the alignment sim's `sleep` command. |
| F-CH-6 broken sleep | Which nights count as "a 4-on-4-off night" in the recovery table (it counts 0.85 of its hours). The game has no rule for what breaks a night. | A day plan holding any watch duty (`Standing watch`, `Lookout aloft`) weighs all its sleep blocks at the engine's split quality; otherwise 1 | Decide whether a watch breaks sleep only when it falls between two sleep blocks, or whenever the character stands one. |
| F-CH-7 day plans | Who does which duty at which hour. `DUTIES.md` lists duties and the crew job, but no timetable or watch bill. | The caller passes the plan (a list of `{ fromH, toH, duty }`); the adapter holds none. The test uses watches 08 to 12 and 20 to 24, sleep 12 to 16 and 00 to 04. | Design the watch bill (`DUTIES.md` says four on, four off; the task brief says four on, eight off). |

### Duties with no engine activity (the adapter throws on them)

The met table (`files/pirate-ship/body/data/physiology.json`) has 15 rows. A duty is mapped only where a row names its
activity. These duties have none, so the adapter refuses them instead of guessing a MET (rule 1: unsupported models
are flagged, never patched):

Feeding the livestock · Rat catching · The noon sight · Heaving the log · Rationing water · Mixing grog · Cleaning the
guns · Keeping the powder dry · Tending the sick · Talking to the crew · The den · Lights out.

Decision for Rex (or a new met row from the engine): which row each of these takes, or a new row with its source.
"Lookout aloft" is mapped to *Standing watch, still* because the watch row is the nearest listed activity; confirm.

### What the engine does not return yet

`simulateDay` returns the engine's trace notes for the day (deficiency stage changes and the like) and its failed
conservation checks, untouched. The engine has no crisis record type yet (PHASES-4-5.md mentions "a death opens a crisis
record" for 2539), so the report carries none; the adapter will pass them through when the engine exports them. The
engine's `index.ts` also does not export `environment.ts`, so the place carries a constant air temperature; the
diurnal curve and the WBGT process wait for that export.

## Food and the inventory (`web/src/world/adapters/food.ts`, task 2534)

Mappings and units are in `data/pirate-ship/world/food.json`; the food rows, `Keeps (days at sea)` and the ration are the
game's `files/pirate-ship/body/data/nutrition.json`. The game has no inventory type in code (the settlement's
`inv.<place>` is a name only), so `Inventory` is a fixture: kilograms of each food good, in lots by the day they came in.

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-FD-1 inventory | Who owns the stores and where they are. There is no ownership or location in code. | One inventory for everyone who is fed from it; a map of good id to kg in lots by arrival day; only food goods can be stocked (a good with no food row, or a food with no Keeps days, is refused). | Ownership (ship, company, person, settlement store) and location (hold, galley, warehouse); the settlement's `inv.<place>` ids will replace the single inventory. |
| F-FD-2 goods and foods | The economy has 256 goods, the table 51 food rows, and no id links them. | A food row takes the good whose name holds the row's name (the words before the first comma or bracket) and whose GOODS row the name cites; one good and no more, or none. One proposed override: salt pork (row 23 has no good) takes `salt-beef-and-pork`. Ten foods are left with no good: none fits (green turtle, eggs, sauerkraut, burgoo), or several do (cassava: `cassava-and-potato-bread` or `cassava-maize-yams-potatoes`; yams: that or `coast-provisions`; cacao: `cacao-grown` or `cacao-sweated-and-dried`; brewed coffee: `coffee` or `coffee-tea-and-chocolate`; rum: `rum` or `tight-casks`, which is the cask; pepper: `pepper` or `malaguetta-pepper`). Such a food cannot be stocked or issued. | Choose a good for each of the ten (or add goods), and confirm the salt pork override. |
| F-FD-3 one stock per good | Goods that stand for several foods (salt beef and salt pork; maize and potatoes; the island drinks) in one pool of kg. | The pool is one number; it keeps for the shortest `Keeps` of its foods. The ration names the food row eaten; the pool does not say which it holds. | Split such goods into one stock per food, or keep the pool. |
| F-FD-4 how stock goes bad | The spoilage rule. The table gives days; the game has no rule for what rots, how much, or how it is fought. | `Keeps` is the first number of the text (`14 to 21` is 14, `365+ (weevils after 60)` is 365, `live until killed; 1 after` is 1; `-` and `made to drink` give none). A lot spoils whole on the day it is `Keeps` days old, and the oldest lot is issued first. Spoiled kilograms are counted, never eaten. | Whether a lot spoils whole or by degrees, whether weevils and sour beer lose food or only quality, and whether the cook or the quartermaster can save part of it. |
| F-FD-5 the ration | Who is issued what. The table is the Navy's of 1677 per man per week. | Each person is issued a seventh of the table's weekly amounts every day, all eaten at the start of the engine's day (noon), by the engine's `eat`, one food at a time. Where the stores run short, people are served in the order given and the short kilograms are reported. The table's "or 8 lb with no pork" and the fish days are not played: the 4 lb row and the weekly average are. | The quartermaster's choice (full, three-quarters, half: NUTRITION.md), who is served first when stores are short, and the meal times. |
| F-FD-6 the beer | The table gives beer as `7 gal`, a volume; neither the data nor the engine holds a gallon or a beer's density. | The weekly mass of beer is the table's own `1100 kcal a day` over the engine's kcal per kg for small beer: 22.0 kg a week. For this line the engine and the table agree by construction, so it is not an independent check. 7 wine gallons of 3.785 L (GOODS.md, WC) at 1 kg/L would be 26.5 kg and 1,330 kcal a day. | A density for small beer, and the gallon the 1677 contract meant (ale or wine). |
| F-FD-7 units | The engine has no units. | The avoirdupois pound (0.45359237 kg) and ounce (a sixteenth), in the data file; pease and oatmeal use the table's `about 2.5 lb dry` and `about 2 lb`, not the pints. | Confirm. |

The table's calc columns against the engine's food rows (per man a day): biscuit 1724 kcal against 1720, beef 518 against
520, pork 415 against 415, pease 551 against 550, oatmeal 492 against 490, butter 174 against 170, cheese 194 against 195;
the day 5,169 against 5,160; protein 221.4 g against 222; the pease's vitamin C 3.24 mg against 3. All inside the table's
rounding; none patched. The body keeps 2.59 mg of that vitamin C a day (the engine's absorption table, 80%).
