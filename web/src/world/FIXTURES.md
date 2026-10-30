# Fixtures: stand-ins the engine adapters use where the game has no system yet

## Work and production (`web/src/world/adapters/work.ts`, task 2537)

Rows: `data/pirate-ship/world/work.json`. Sources: GOODS.md sections 3c, 3d and 3f;
FACILITIES.md section 2 (existing equipment and institution slots, not the section 1 proposal).
The current recipe rows contain **no input/output quantities or times**. None of these
fixtures is a measured production rate or a scientific physiology model.

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-WK-1 recipe size and time | Missing recipe quantities, durations and partial completion | One of every required input and one output per 8 working hours at the reference rate; the first stocked `inputsAny` alternative in recipe order is used, without mixing alternatives. Fractional batches consume and produce proportionately, capped at available inputs; no stored work in progress. | Quantities, units and duration for each recipe; discrete casks vs continuous progress, input substitution and interrupted work. |
| F-WK-2 production rate | GOODS.md 3f says skill changes speed but gives no equation. BODY.md's proposed work capacity needs limb force and fatigueDay, neither supplied by characters.ts. | `max(0, 1 + (level - 50) * 0.01) * max(0, 1 - fatigue_met_hours * 0.01) * min(1, alertness)`. Both body outputs come from the engine by id; missing/invalid outputs throw. This is an expressly linear game placeholder, not the BODY.md formula or a conversion to fatigueDay. The full scheduled day runs in characters.ts and the end-of-day outputs set the whole day's rate. | Real recipe speed curve and how within-shift fatigue/recovery affects work; which engine outputs to use. |
| F-WK-3 stock and conservation | No quantities or mass for non-food goods | `WorkInventory` wraps the existing food `Inventory` (kg, spoilage and rations unchanged); non-food goods use abstract units without spoilage. Callers use `.food` for rations. Every conversion records consumed and produced quantities separately. In minus issued minus spoiled minus remaining closes per good; unlike goods are never summed as mass. Spoilage runs before production. No automatic stock, fuel or waste is invented. | Native units, masses, yields, fuel, waste and non-food spoilage; physical mass conservation cannot be asserted until these exist. |
| F-WK-4 staffing, facility, ownership, wages, construction | Missing assignment/capacity and property rules in the current institution model | Caller assigns one worker and recipe to an existing slot plus an explicit list of settlement-wide equipment. Everyone works their assignment; slot owner is copied unchanged. No wages, ownership transfers, construction, capacity limit or development prerequisite. `workDay` runs once per character/day; working hours are only the assigned occupation duty in that character's plan. | Starting recipe/equipment assignments, staff counts, capacity, relation to developed status, wages and property/construction rules. |
| F-WK-5 occupation activity | Occupations contain skills but no MET or schedule | Cooper -> Coopering; Carpenter -> Patching and caulking; Blacksmith -> Smithing; Victualler/Cook -> Cooking. The characters adapter supplies these activities' engine MET ids. Other occupations throw as unsupported. No occupation grants knowledge or skill; callers supply known recipes and skill levels independently. | MET mappings for the other occupations, starting knowledge/levels and schedules; skill progression, quality and failure rules (none applied here). |
| F-WK-6 unsupported recipes | Missing resource pools, service effects, access and byproduct yields | Gathering/inputless, service, off-map, non-Caribbean, access-gated and byproduct recipes (including their parent runs) throw before advancing a body or converting stock. Only material conversions with mapped occupation activity run. | Resource availability, service effects, expansion/access gates and linked byproduct yields before enabling these paths. |

Integration: issue rations through `inventory.food`, then call `workDay` instead of a
separate `simulateDay` for an assigned worker. The returned report contains that day's
body outputs/checks, duty/activity, rate, consumed/produced goods and spoilage. Institution
alignment and the separate settlement backend are not modified.

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

`simulateDay` returns the engine's trace notes and failed conservation checks. Environment and medicine are now
exported: settlement acceptance (2539) supplies climate air/WBGT through `Place.conditions`, and calls `healDay`
after the body day to collect crisis records. Existing callers without conditions retain F-CH-4 constant air.
The engine still supplies no thrust bleed rate or automatic dehydration death; see F-MD-3/7 and F-SE below.

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

## Places and weather (`web/src/world/adapters/places.ts`, task 2535)

Place-to-row maps are in `data/pirate-ship/world/places.json`; volumes and air changes are the game's
`files/pirate-ship/body/data/atmosphere.json` (`regions`, `scenarios`), the climate, weather states, sun and exposure rows
its `environment.json`. The engine's `environment.ts` is now exported, so the constant air of F-CH-4 can be replaced by
`roomFor` and `conditionsAt`; wiring the character adapter to them is the settlement task (2539).

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-PL-1 which ship | The hold's row gives "a sloop 60; a brig 250; a ship 800" m3; the game has no ship size in code. | `vessel: "brig"` in the data file; `roomFor(place, { vessel })` overrides. | Which ship the player sails, so the hold takes its own volume. |
| F-PL-2 ranges and states | A row that gives a range ("20 to 60" for the cabin) or several air-change states ("2 open, 0.2 battened"). | The middle of a range (cabin 40 m3). The state is a word of the label in the data file: hold, gun deck and cabin `open`; the rest their unlabelled or first state. A scenario takes the air changes its own row states. | Which state a place is in when occupied (hatches, ports, window), and the cabin's size. |
| F-PL-3 places with no box | The table has no row for the galley, and gives open places ("Open deck, beach, a street", "Forest, swamp") no volume (`-`, ACH infinite). Cave, mine, well (`by the place`), fire (`fire-driven`), the laboratory and under water have no exposure row or no number. | `roomFor` returns null for these; the place still has its exposure terrain. Cave, laboratory, fire and under water are not mapped as places. | A volume and air changes for the galley; places for the cave, laboratory and fire when the map exists. |
| F-PL-4 the day's curve | The climate table gives a day maximum and a night minimum, not the hours they fall at. | The engine's half-cosine; the minimum at sunrise (from the sun row's day length), the maximum at 15:00 (`diurnal.maxAtHour`). | The hours of the day's coldest and hottest moments. |
| F-PL-5 months between the sun rows | The sun table names only Dec to Jan, Mar and Sep, Jun to Jul. | The other months interpolate linearly between the nearest named months, round the year (February 11.5 h, 25 min). | Rows for every month. |
| F-PL-6 the weather draw | `weather_states` stay chances and weights (marked low confidence, placeholders). | A seeded chain from day 1 of the year: stay with the row's chance, else another state in proportion to the season's weights (the climate row's Season word, wet or dry). Wind is the middle of the state's knots; it rains where the Rain cell does not begin "none". The hurricane's `x0.25 before 1715` applies when `year` is passed. Humidity, air and sea temperature are the month's row, whatever the state; the state does not yet change them. | Whether a state changes the day's air and humidity (rain cools), the shower of "none or a passing shower", and the year to play. |

## Stats and faces (`web/src/world/adapters/stats.ts`, task 2536)

Rows are in `data/pirate-ship/world/stats.json`: the factors of each `body.json` `capabilities` formula (in the table's own
words, checked against its text by the test), the face sources, and the `psychology.json` `pushes` rows the engine's outputs
can drive. A factor with no engine output counts as 1 and the result names it in `missing`; nothing is guessed. A push or
face the engine cannot drive is listed here, not played.

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-ST-1 the aerobic index | `Endurance_attr x aerobic_today / 40` reads `aerobic_today` as an index (PHYSIOLOGY 6: about 40 mL/kg/min). Since 2026-10-29 the engine's `aerobic_today` is oxygen delivery at maximal cardiac output (circulation.ts: mL of O2 a minute, no body mass in it). The two do not share a unit. | The adapter divides the engine's value by the body's mass in kg, then by the formula's 40 (read from the table). With no mass or no `aerobic_today` the ceiling is not computed (`missing: aerobicIndex`). `characters.ts` does not run the circulation process yet, so no day report carries `aerobic_today`; the settlement task (2539) wires it. | Is the index per kg of body mass, or per kg of lean mass, or does PHYSIOLOGY 6 want the engine to return the index itself? |
| F-ST-2 factors with no engine output | The factors of the capability table the engine gives no number for (table below). | Counted as 1; named in `missing`. A body that is wounded, in pain, cold, feverish or bled is therefore not yet reduced by the adapter. | Which engine output (or which game table) supplies each. The wound dip is a range by depth (x0.8 to x0.5) and needs a wound's limb; the engine counts wounds by kind only. |
| F-ST-3 the combined factors | `alertness` and `drinkFactor` in the formulas. `neurology.circuits.arousal` says the alertness factor is min(PHYSIOLOGY alertness, arousal); the motor-control circuit says Dexterity and Agility take coordination. | `alertness` is the smaller of the engine's `alertness` and `arousal`; `drinkFactor` is `motor-control` alone (arousal enters once, through `alertness`); `drinkFactor(+)` for Nerve (rum raises it: fiction, open) has no output. The row's `(1 - 0.5 fatigueDay)` term is not applied while `fatigueDay` is missing. | Confirm the min, and whether arousal over 1.5 dips Dexterity (the table's cell says so, with no size). |
| F-ST-4 faces | Which channel a face reaches, and how it reads. | Physiology faces go to "Watching people work (duty results)" and "Dialogue on keywords"; nutrition's to the dialogue; medicine's and the haemorrhage face to "The surgeon's morning report" (and the dialogue). `shown` is the table's string without its parenthetical notes (the clocks in `depletion`); `text` keeps it whole. Class II to IV bleeding stands for the haemorrhage failure's face. A deficiency stage with a face of `-` or `none...` shows nothing. A disease shows its symptoms once ill (stage 2), not while it incubates. | Confirm the channels, the haemorrhage reading, and that incubating shows nothing. |
| F-ST-5 pushes | `psychology.json` `pushes`: 27 rows, 8 pushes the engine can drive (P01, P02 slider, P03, P04, P12, P15 mood, P17, P27 mood). | Each push is `meter`, `delta`, `per` (a day) from the row, fired while its condition on outputs holds. `dayPushes` returns them; the caller applies them to its own meters (mood, the sliders), as the alignment code is not touched. P04 fires from the seventh day the condition held (the caller keeps the streaks the function returns). "Heat strain" is read as core temperature over 38 C (the row's own figure); "Scurvy stage 1" is stage 1 exactly (`deficiency_vit_c` is 1), as the row names no later stage; P27's size is the engine's `mood-regulation` output. | Confirm the readings of heat strain and scurvy; the meters' names and ranges. |

Rows of the capability table the adapter does not compute: Movement (tiles), Work capacity (duties), state (STATS 4),
Accident chance, Appearance. Each has a reason in `stats.json` `notComputed`.

### Factors with no engine output (F-ST-2)

| Factor | Impairment | Why there is no output |
|---|---|---|
| forceAvailable(limb) | muscle | no per-limb muscle force or fatigue output; the engine's muscular module holds indices, not a limb's force today |
| woundDip(limb) | wound | the engine counts open wounds by kind but gives no limb and no depth; the dip is a range by depth (x0.8 to x0.5) |
| headWoundDip | wound | as woundDip, for the head |
| torsoWoundDip | wound | as woundDip, for the torso |
| legsFactor | wound | the worse leg's woundDip: needs a wound's limb |
| balanceFactor | muscle | forceAvailable of glute_med and deep_core: no per-group force output |
| muscleFatigueCap(limb) | muscle | no per-limb muscle fatigue output |
| capFactor(limb) | cap | permanent caps (a stroke, a lost limb) have no engine output |
| coldFactor | cold | the engine's core-temperature table gives a state, not a capability factor |
| coldFactor(Dex) | cold | as coldFactor, for the hands |
| hydrationFactor(Strength) | hydration | the hydration table gives an Endurance multiplier only |
| painFactor(limb) | pain | the engine gives pain (medicine.pain) and its gating, but no factor from pain to coordination |
| drinkFactor(+) | drink | Nerve: rum raises the read (fiction, open in body.json); the coordination output falls with drink, so it cannot stand in |
| feverFactor | fever | the engine's disease stages carry no fever flag or factor |
| bloodFactor | blood | the bleeding class table names x0.8 for class II only; classes III and IV give no multiplier |
| nutritionFactor | nutrition | deficiency stages are outputs (deficiency_<id>) but no table turns a stage into a Constitution factor |
| fatigueDay | fatigue | fatigueDay needs the day's MET-hours against aerobic_today; the engine's fatigue_met_hours is a different accumulator |
| seaLegs | sea-legs | no engine output; a ship's motion is not modelled |
| light | light | light comes from the map (COMBAT 6), not the engine |
| nightBlindness | vitamin-a | deficiency_vit_a is a stage; no table gives its Eyesight factor |

### Pushes the engine's outputs cannot drive (F-ST-5)

The row number is the row of `psychology.json` `pushes`. A part is the half of a row the engine cannot drive (the other half is a push above).

| Push | State | Needs |
|---|---|---|
| P02 (madness +1 a day) | Sleep debt over 24 h | whether the character's madness trigger is being pushed (the story keeper's); not an engine output |
| P05 | Hunger over 0.6 (NUTRITION 4: the drive, from hours and deficit) | hunger (the drive from hours and deficit): neurology reads it as an input; no engine output carries it. Meals missed are the host's |
| P06 | Hunger over 0.8 for 3+ days | hunger over 0.8 for 3+ days: as row 5 |
| P07 | Prolonged deprivation: starvation stage 2+ for 14+ days, and what happened in it (who hoarded, who shared, who was cheated) | starvation stage 2+ for 14+ days and the memories of who hoarded or shared: no starvation stage output, and the memories are the story keeper's |
| P08 | Appetite: a meal eaten with appetite over 0.8 (a hot meal, fresh meat, a favourite) | a meal's appetite, per meal: a meal event is the food adapter's, appetite is a circuit output but the row asks for a meal eaten |
| P09 | Appetite low while hunger is high (off his food: fever, seasickness, grief, 30 days of biscuit) | appetite low while hunger is high, per refused meal: hunger and a refused meal are host facts |
| P10 | Appetite and the person (the story keeper's per character) | favourite and hated foods per character: open, the story keeper's |
| P11 | Starvation stage 2+ (NUTRITION) | starvation stage: the engine's starvation_limit is a flag (0 or 1), not a stage; the row asks for stage 2+ |
| P13 | Drink: a ration of rum (STATS 4 drink state) | a ration of rum drunk that evening: an event the host raises |
| P14 | Drink: drunk | 'drunk' has no engine threshold on conc_alcohol; the row gives about +20 for the night, not a limit |
| P15 (Volatile pressure while over 38 C) | Heat strain (PHYSIOLOGY) | the row gives no size for the slider pressure |
| P16 | Fever (MEDICINE) | fever: the engine's disease stages carry no fever flag; the row also pushes alertness, which is the engine's already |
| P18 | Seasickness day (PHYSIOLOGY) | seasickness: no engine output; a ship's motion is not modelled |
| P19 | A crew mate's death (MEDICINE / COMBAT) | a crew mate's death: an event, with hearts from the relationship web |
| P20 | A crew mate's resurrection in a new form (COMBAT 4e) | a resurrection: open, the story keeper's |
| P21 | Isolation: no one talked to for 3+ days (the keyword dialogue) | no one talked to for 3+ days: the dialogue system's |
| P22 | Being posted to the duty they are best at (STATS) | a post matching the character's best duty: the crew engine's |
| P23 | Being posted where they are weak and failing | a post where they fail: the crew engine's |
| P24 | Fear: outnumbered, a storm, a fever aboard | fear events (outnumbered, a storm): events, and the contagion between crew mates; fear-and-stress is an output but the row asks for the event |
| P25 | Winning a fight, a prize, fresh food after a long passage | a win, a prize, fresh food: events the host raises |
| P26 | A romance partner wounded or sick | a romance partner wounded or sick: the relationship web |
| P27 (Volatile pressure; the craving push toward the habit; a slight if denied) | Withdrawal (NEUROLOGY.md clock 4: a habit broken) | the row gives no size for these (the last is open) |

### Faces the engine's outputs cannot choose (F-ST-4)

| Face | Why |
|---|---|
| anaemia-iron-folate-b12-hookworm-malaria | no output says which delivery failure is active; haemoglobin is an output but the table gives no threshold for the face |
| dehydration-sweat-the-fluxes | dehydration surfaces through physiology.hydration (hydration_row) |
| lung-failure-drowning-pneumonia-opioid-breathing | saturation is an output; the table gives no saturation threshold for the face (medicine.exposure covers hypoxia) |
| heart-failure | heart failure is an event with no output by id |
| circulation.events | the eight events (angina, infarction, stroke, ...) have no engine output by id |

## Medicine and combat (`web/src/world/adapters/medicine.ts`, task 2538)

Rows: `data/pirate-ship/world/medicine.json`. The numbers a wound dips are read from the `What it dips` column of
`body/data/medicine.json` `wounds` (COMBAT.md 4a/4e stay as written, read only); the skill from `treatments`; the exposure
multipliers from `environment.json` `exposure`; the courses, risks, healing times and efficacy are the engine's
(`@rex/realism` `medicine.ts`). Stats.ts takes the wound factors through its new `Context.supplied` (a factor with no engine
output is the caller's, by name: `woundDip(limb)`, `headWoundDip`, `torsoWoundDip`, `legsFactor`); wounds never multiply, the
worst counts (BODY.md section 3: one wound pathway per formula). `places.ts` gained `isWetSeason(day)`.

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-MD-1 hit vocabulary | COMBAT.md has hit locations (arm, leg, head, torso) but no list of damage kinds or body parts. | Kinds cut, thrust, shot, blunt, burn, crush (and amputation, the surgeon's) name the `wounds` rows; a blunt blow to the head is the head-blow row; thigh, shin, forearm, face, chest and the like stand for their location. A limb needs a side. Depth (0 to 1) comes from combat, else from the character's own medicine stream; it picks both the dip between the column's two factors and the engine's bleeding class. | The real damage kinds of weapons, the body parts combat targets, and whether a head shot or a torso cut has its own row. |
| F-MD-2 what the column does not size | `What it dips` names stats without a size (torso: the Endurance pool drains, Constitution; a face burn dips Eyesight; "movement halved"; "awareness lost on a bad one"; "a shattered bone means amputation"). | The dip is returned with `factor: null` and counts as 1 in a formula; a drain is left to the engine's circulation. "Out of use" is read as x0. A hit location a row has no clause for (a gunshot to the torso) dips nothing. | Sizes for these clauses; whether a torso hit dips Constitution by a factor or only through blood loss. |
| F-MD-3 bleeding and openness | The library has no wound blood-loss rate (circulation owns the blood), and combat does not say which hits are open. | No host rate is passed, so the engine's wound bleeds nothing; `Hit.open` is the caller's (the engine's default is closed, which picks its infection figure). | Wound blood-loss rates per class, and which damage kinds are open wounds. |
| F-MD-4 dose | The library has no dose-response; `expose` takes a chance in [0, 1], and the engine's `vector_exposure` is null (FLAGS.md). | Dose = 0.02 (`baseDose`) times the exposure column's multiplier for the place (Mosquito for yellow fever and both malarias, Foul-water for dysentery and typhoid, as their `How the sim catches it` says), and 0 outside the wet season for a disease whose text says wet season. A cell with no multiplier ("the casks", "x2 wet season" in the dry) is reported unsupported and not sent. Other diseases need a scripted dose. | A base chance per exposure-day, a multiplier for each place the table leaves blank, the vector of the other 17 diseases, and how hygiene, quarantine and a ship from an infected port enter. |
| F-MD-5 the medicine clock and seed | `characters.ts`'s scheduler runs no medicine process, and a character has no seed. | The caller runs `healDay` after `simulateDay`: one engine day of healing and course, with the healing factors the world holds, the medicine outputs put on the body. The state is made on first use with the caller's `seed` (the engine's default 1 gives every character the same draws). | Where the medicine clock runs in the day loop (settlement acceptance 2539) and who owns each character's seed. |
| F-MD-6 treatment supplies | `treatments` `Supplies` lists goods in words ("lancet, basin", "drugs (row 48, 71, 122)"), and the economy has no instruments, quantities or doses. | Each supply is mapped to goods in `medicine.json` `supplies`; instruments (lancet, forceps, saw, needle) are the surgeon's chest and must be in the stock but are kept; a drug or dressing costs one unit (`unitsPerUse`, kg for a food good) of the first good the stock has. Fire, wood and pustule have no good: named in the report, never paid. A treatment the library says did not work is performed and paid. The skill is the row's number; a row naming "the knowledge" needs the treatment id in `Surgeon.knows` (GOODS.md 3f). | Doses and quantities, instruments as separate goods, goods for fire, wood and pustule, which drug goods serve "drugs", and where the knowledge of a treatment is learned. |
| F-MD-7 crises | The fate systems (`balance/` items 28 to 30) do not exist in code. | A crisis the engine opens (a due disease death risk, an inoculation death) comes back as a `CrisisEvent` (slug, cause, day, risk, source, and the engine's own record). The adapter exports no way to resolve one and the case stays on the sick list; the fate side calls the engine's `resolveCrisis(medicineOf(c), event.record, ...)`. The engine opens no crisis for a fatal wound yet (head, chest: "usually fatal"): only diseases, inoculation and the air conditions. | The fate systems: what a crisis offers (rescue, the surgeon, resurrection by faction) and who decides. Whether wound deaths should open crises too (needs the engine). |

## Settlement acceptance (`settlement.ts`, task 2539)

The runnable fixture is `data/pirate-ship/world/settlement.json`. Run from `web/`:
`node --experimental-strip-types src/world/settlement.run.ts`. It prints thirty JSON
ledger lines, Aug 1 through Aug 30 (noon to noon, ending Aug 31 noon). The shell
entry supplies JSON import attributes for the existing bundler adapters. No server.
`npx vitest run src/world/settlement.sim.test.ts` checks the whole run.
For the full suite on this shared machine, set `VITEST_MAX_WORKERS=1` (PowerShell:
`$env:VITEST_MAX_WORKERS = '1'`) before `npx vitest run`. Unrestricted parallelism
can push the existing twelve-person food-week test over its unchanged five-second
limit when it competes with this acceptance run; one worker preserves every test
and timeout. The standalone thirty-day program takes about 20-22 seconds.

These are integration circumstances, not adopted town or economy rules. Existing
F-CH, F-FD, F-PL, F-WK, F-ST and F-MD rows above still apply. This index completes
the missing-system decisions for this experiment, grouped by system.

### Staffing

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-SE-1 assignments | Crew staffing, facility capacity and role records | Twelve synthetic ids `settler-1` through `settler-12`; four coopers at `port.shipyard` making slack casks, four carpenters at `port.warehouse` making planks and boards, four cooks at `port.bakery` making preserves and sugar candy. Each has skill 50 in the recipe's skill and knows only that recipe. Occupation METs and conversion gates are the existing work adapter. | Actual roster, staffing/capacity, suitable workplaces, initial knowledge and skills. |
| F-SE-2 timetable | Duty scheduling, sick leave and recovery | Work 12:00-20:00, sleep 22:00-06:00, remaining hours `Walking the deck` (light chores). Settler-3 sleeps 02:00-06:00 on days 15-21 and does light chores for the lost four hours; there is no watch/split-night penalty. Everyone continues assigned work even with sickness or a pending crisis. Wound working-part/rest modifiers keep medicine's defaults (false); there is no limb-to-task mapping. | Shifts, leisure activity, sick leave, stopping work at a crisis, wound use/rest policy. Eight-hour nights reset fatigue but do not repay accumulated sleep debt; extra sleep would be needed. |

### Ownership

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-SE-3 property and common stock | Ownership, access, household provisioning | The existing slots' owners/developed flags are copied unchanged by `facilityAt`. One shared stock supplies every worker; production enters it. No alignment commands, ownership transfer or development prerequisite. | Property/access, who owns inputs/output, ration priorities and whether staff need recruitment/development. |

### Wages

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-SE-4 payment | Money, contracts and prices | No wage transfers, purchases, sales, taxes or price conversion. Initial goods are an explicit endowment, not an unrecorded purchase. Non-food inventory retains F-WK abstract units. | Pay, prices, accounting currency, trade and payroll. |

### Construction

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-SE-5 facilities | Building, equipment acquisition and capacity | Existing shipyard, warehouse and bakery slots; the warehouse is explicitly furnished with a saw-pit. Other selected recipes require no equipment. No building time/material cost, parcel simulation, fuel or wear beyond recipe inputs. F-WK-1/2 supply batch quantities/time/rate. | Construction, equipment location/cost, capacity, durability and recipe quantities/yields. |

### Records, provisioning and environment

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-SE-6 bodies | Missing character body records | All twelve use F-CH-1/2/3: male, age 30, height 175 cm, mass 70 kg, fat 15 kg, water 40 kg; library nutrient pools start full. No substitutions from alignment attributes. | Per-character records and starting reserves. |
| F-SE-7 stores and meals | Supply chain, appetite, meal timing and replenishment | At day 1 stock exactly thirty days of all twelve people's ration rows (weekly kg / the data's seven-day week); 120 units of each selected recipe input; additionally 1 kg bread to exercise spoilage. Issue the ration at noon in stable character order, consuming only unspoiled stock. No restocking, substitutions, purchases, drinks beyond ration food-water, or force-feeding beyond F-FD's prescribed ration. Perishable stores can expire and shortages are printed. Recipe outputs remain in the common stock; these recipes do not replenish the historical ration. | Initial inventory, resupply, food allocation, drinking water, meal times, appetite and shortage response. |
| F-SE-8 location and climate | Port identity, housing, weather clocks and travel | Port Royal is the scenario label, with `town-street` climate/exposure and a separate `tavern` room per person from `roomFor` (the atmosphere table's volume/ACH). One-hour weather samples held over each hour, from Aug 1 noon through Aug 31 noon; seed 2539, no historical year. Samples after midnight use the next calendar day. The game climate's WBGT drives physiology and air temperature drives ventilation. Humidity contributes to WBGT; room vapour retains the engine's outside-air mixing-ratio default, and no room air-speed override is supplied. No shared-room crowding or walking between boxes. | Geographic port records, accommodation, workplace microclimate, occupancy, weather sampling and year. |
| F-SE-9 hazards and fate | Combat, outbreak events, treatment and fate decisions | Day 5: settler-1 gets an open left-forearm thrust, with seeded engine depth/infection/healing. Day 9: settler-2 receives a scripted yellow-fever dose of 1 through `exposeAt` (not a claimed natural exposure probability). Medicine seeds start at 2 plus character index; seed 3 deliberately exercises a pending fatal-risk crisis. Engine healing advances once after each body's day. No treatment or crisis resolution; no person is removed. Changing the run seed offsets each medicine seed equally. | Actual hazards, exposure dose, surgeon response, clock ownership, fate/rescue decisions. |
| F-SE-10 audit windows | Persistence and raw trace retention | Every minute runs the engine's conservation checks and records extrema. Each day's trace is summarized (body energy/water transfers, checks, goods, outputs, medicine snapshots) before replacing only the audit World with one using the same registry/components, clock, graph and environment. Conservation baselines restart at the measured contents; nutrition's cumulative state persists in body properties. No process using historical transfers is enabled in this character loop. | Save/replay format and raw audit retention. A future circulation integration must retain its cumulative blood-transfer ledger before using this rotation. |
| F-SE-11 adapter regression setup | A known thirsty state in the existing stats integration test, independent of the library's changed sweat rate | Start the test sailor at the P12 `water_deficit_pct` trigger (2%, read from `world/stats.json`), remove that fraction of body water with a matching transfer trace, then run the unchanged day without drinks. Existing thirst, face, push and conservation assertions are unchanged. The food week test archives each daily trace only after its existing checks, using F-SE-10; its five-second timeout is unchanged. | No game decision: these are test preconditions and storage lifetime, not starting settlement conditions. |

### What this acceptance can and cannot prove

The tests check per-good daily production minus consumption minus spoilage against
stock change, independent body energy and water balances, minute extrema plus daily
library recovery/composition bounds, fixed hazards, a nonempty pending-crisis path,
and completion in under sixty seconds. Library body mass has a fat floor and an
energy-limited gain, not a universal healthy upper mass; whole-body MET-hour fatigue
has recovery rules, not a fixed maximum. Tests use those rules and the library's
sleep/circadian alertness bands instead of inventing ranges. This is whole-body
fatigue, not limb muscular fatigue. New daily ledgers retain all twelve people and
all pending crises; tests check that every sick case marked as a crisis has a
record, and none is resolved to death or survival.

In the checked run all twelve bodies eventually exhaust water and continue working; the ledger flags this explicitly. Day 14 opens settler-2's yellow-fever crisis, still unresolved on day 30. The extra bread spoils on day 6. Day-30 ration shortfalls can include floating-point dust (reported at full precision, not silently rounded away).

A green bookkeeping gate is not a survival or economic validation. Missing wound
blood-loss rates, limb-force/fatigue coupling, fever-to-physiology factors and fate
rules stay unsupported. Circulation is not run by the character adapter, so
`aerobic_today` remains unavailable (F-ST-1); no index is fabricated. The prescribed
ration, ingredient yields, work rates, rooms and exposures remain fixtures. The
library checkpoints' limitations still apply; depleted body water, if reached,
is printed explicitly rather than silently called survival.
