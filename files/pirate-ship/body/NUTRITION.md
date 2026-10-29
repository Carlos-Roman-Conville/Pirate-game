# Nutrition: calories, macros, micros, water, salt, reserves and deficiency (body-and-world keeper, 2026-10-29)

Rex's system (`../combat/COMBAT.md` §4c, 2026-10-29): simulate satiation, fat gain "and all that"; every
food gets **calories, macro- and micronutrients** and those affect things; **real scurvy** if they forget
vitamin C on a long trip; the need for water, salt, potassium and the rest of what a body needs; eat enough of
something that pumps up muscles and you get a boost. ChatGPT drafted a version; this file is the keeper's,
sourced, with ChatGPT's proposals marked. It feeds `BODY.md`; the foods are `../economy/GOODS.md`'s.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; marks **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables are rendered from `data/nutrition.json`.

**Clock.** Meals are day-loop events (the cook's duty, `../DUTIES.md`); the overnight tick settles the
day's energy balance, fills or drains each nutrient pool and advances the deficiency clocks. Distant towns
carry only a food-sufficiency index (`../world/POPULATION.md`).

## What Rex has decided that this file must respect

- **(Rex, 2026-10-29)** Every food has calories, macros and micros; satiation and fat gain are simulated;
  scurvy emerges from the diet; water, salt, potassium and the rest are needs.
- **(Rex, 2026-10-29)** Provenance tags: the nutrition engine reads a food's values, never its tag.
- **(Rex, 2026-10-26, `../PIRATE.md` §5a)** Stores spoil; hunger hits mood; rum and grog move mood and cause
  accidents. **(keeper)** Grog is 1740, after the period (`GOODS.md` §1k); punch and rum-and-water are the
  period's drinks.
- **(proposed, outside AI; kept)** Four layers: energy balance, macros, micros, hydration; the muscles read
  these rather than keeping food rules; immediate (a meal restores energy) and long-term (weeks build muscle)
  kept apart; one low day loses nothing.

## 1. The nutrients

**Inputs:** the day's meals (goods and quantities). **Outputs:** per nutrient a pool level and a day's
intake; the deficiency clocks.

<!-- table:nutrition.nutrients -->
*The nutrients the body tracks, with needs, reserves and what runs out first* (science; confidence high; source: DRIs: vitamin C 90 mg (men) 75 (women); thiamin 1.2/1.1 mg; niacin 16/14 mg NE; vitamin A 900/700 mcg RAE; iron 8 mg men, 18 women; sodium AI 1500 mg; potassium AI 3400/2600 mg; water 3.7/2.7 L total (US National Academies; NUT-DRI). Body pool and depletion: vitamin C pool about 1500 mg, signs under 300 mg, 4 to 12 weeks (NUT-SCURVY); thiamin stores small, deficiency detectable at about 6 weeks, fatal in as little as 3 (NUT-B1); niacin months (NUT-PELL); vitamin A liver stores 1 to 2 years; iron months; sodium and water days; glycogen about a day.)

| Id | Nutrient | Unit | Daily need (man) | Daily need (woman) | Body reserve (full) | Days to deficiency signs with zero intake | Deficiency disease (MEDICINE.md) | Excess | Mark |
|---|---|---|---|---|---|---|---|---|---|
| energy | Energy | kcal | PHYSIOLOGY.md (2,500 to 4,500 at sea) | about 80% of a man's | fat mass x 7,700 kcal/kg; glycogen about 400 g = 1,600 kcal | 1 (glycogen); weeks to starvation by fat mass | starvation | fat gain | **Rex** |
| protein | Protein | g | 0.8 g/kg to live; 1.6 g/kg to build muscle | the same per kg | muscle itself (catabolised in a deficit) | 14 to 30 (muscle loss) | wasting; slow healing | none in the period diet | **Rex** |
| carb | Carbohydrate | g | no fixed need; the glycogen fuel | - | glycogen 400 g | 1 (the pool); fat and protein then burn | low Endurance pool | fat gain | **Rex** |
| fat | Fat | g | no fixed need; 20 to 35% of energy | - | fat mass | - | none (essential fatty acids in months) | fat gain | **Rex** |
| water | Water | L | 3.7 total (2 to 3 drunk); more in heat | 2.7 | none to speak of | 1 to 3 (PHYSIOLOGY hydration) | dehydration | none | **Rex** |
| sodium | Sodium (salt) | mg | 1,500 (up to 5,000 sweating hard) | 1,500 | a few days | 3 to 7 sweating; cramps | hyponatraemia: cramps, confusion | thirst; the salt-meat diet gave 10 to 20 g salt a day | **Rex** |
| potassium | Potassium | mg | 3,400 | 2,600 | days | 7 to 14 | weakness, cramps, arrhythmia | none from food | **Rex** |
| vit_c | Vitamin C | mg | 90 (10 prevents scurvy) | 75 | about 1,500 mg | 42 to 84 (signs under 300 mg pool) | scurvy | none | **Rex** |
| vit_b1 | Thiamin (B1) | mg | 1.2 | 1.1 | about 30 mg (small) | 21 to 42 | beriberi | none | proposed |
| vit_b3 | Niacin (B3) | mg NE | 16 | 14 | months (tryptophan converts) | 60 to 180 | pellagra | none | proposed |
| vit_a | Vitamin A | mcg RAE | 900 | 700 | liver: 1 to 2 years | 180 to 365 (night blindness first) | night blindness, infections | liver poisoning (polar bear, shark liver) | proposed |
| vit_d | Vitamin D | mcg | 15 (sun makes it) | 15 | months | 180+ without sun (not at sea in the tropics) | rickets, soft bones (children, the shut-in) | none | proposed |
| iron | Iron | mg | 8 | 18 | months (ferritin) | 90 to 180; faster with blood loss or hookworm | anaemia: low aerobic capacity | none from food | proposed |
| calcium | Calcium | mg | 1,000 | 1,000 | the skeleton | years | bone loss, fractures | none | proposed |
| iodine | Iodine | mcg | 150 | 150 | months | 180+ (not at sea: fish and sea air) | goitre (inland towns) | none | proposed |
| zinc | Zinc | mg | 11 | 8 | weeks | 30 to 60 | slow healing, poor appetite, taste lost | none | proposed |
| fibre | Fibre | g | 30 | 25 | - | - | constipation (the biscuit diet) | - | proposed |
| alcohol | Alcohol | g | 0 (a gallon of ship's beer is about 60 g) | 0 | - | - | drunkenness, the dry gripes (lead), liver | drink: STATS state | proposed |
<!-- /table -->

- **[science]** The needs are the US Dietary Reference Intakes (NUT-DRI); the reserves and depletion
  times are from the deficiency literature: vitamin C signs when the body pool falls under about 300 mg,
  reached in 4–12 weeks on a C-free diet (Hodges' experimental scurvy; NUT-SCURVY); thiamin detectable
  deficiency at about 6 weeks, fatal in as little as 3 on nothing (NUT-B1); pellagra after months on maize
  (NUT-PELL).
- **[model] (proposed)** The sim tracks the 18 rows above and no more; trace elements are folded into the
  food's general quality. Only the first eight (energy, protein, carb, fat, water, sodium, potassium,
  vitamin C) are Rex's by name; the rest are the keeper's reading of "the rest of what a body needs".
- **Mark:** as the Mark column.

## 2. Food profiles

<!-- table:nutrition.foods -->
*Food profiles for the goods in economy/GOODS.md (per 100 g edible; illustrative)* (model; confidence medium; source: Nearest modern food in USDA-type composition tables (NUT-USDA); period preparation applied where known (biscuit is twice-baked wheat flour and water; salt beef and pork brined months; pease dried; lime juice loses most of its C when boiled or kept in copper). Each row is marked by confidence; all are to be verified against FoodData Central by a belt task before tuning. Vitamin C in preserved meat, biscuit and dried pease is effectively zero: that is the scurvy mechanism (Rex).)

| Good (GOODS.md row) | kcal | Protein g | Carb g | Fat g | Water g | Sodium mg | Potassium mg | Vit C mg | Thiamin mg | Niacin mg | Vit A mcg | Iron mg | Keeps (days at sea) | Conf | Mark |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Ship's biscuit (21) | 380 | 10 | 76 | 2 | 8 | 400 | 150 | 0 | 0.1 | 1.5 | 0 | 2 | 365+ (weevils after 60) | medium | proposed |
| Bread, fresh (21) | 265 | 9 | 49 | 3 | 36 | 490 | 115 | 0 | 0.4 | 4 | 0 | 3.6 | 5 | high | proposed |
| Flour, bolted (20) | 364 | 10 | 76 | 1 | 12 | 2 | 107 | 0 | 0.1 | 1.2 | 0 | 1.2 | 180 (weevils) | high | proposed |
| Oatmeal, dry (26) | 380 | 13 | 68 | 7 | 9 | 5 | 360 | 0 | 0.5 | 1 | 0 | 4 | 180 | high | proposed |
| Pease, dried (25) | 340 | 24 | 60 | 1 | 11 | 15 | 980 | 2 | 0.7 | 3 | 7 | 4.4 | 365 | high | proposed |
| Rice, husked (30) | 360 | 7 | 80 | 1 | 12 | 5 | 115 | 0 | 0.07 | 1.6 | 0 | 0.8 | 365 | high | proposed |
| Salt beef, as issued (22) | 200 | 28 | 0 | 9 | 55 | 2800 | 250 | 0 | 0.05 | 4 | 0 | 2.5 | 365 (sweet if well packed) | medium | proposed |
| Salt pork, as issued (23) | 320 | 20 | 0 | 26 | 45 | 2600 | 250 | 0 | 0.5 | 4 | 0 | 1 | 365 | medium | proposed |
| Salt fish, dried cod (24, 128) | 290 | 63 | 0 | 2 | 16 | 7000 | 1460 | 0 | 0.3 | 7 | 15 | 2.5 | 365 (rots if damp) | high | proposed |
| Herring, salted (103) | 260 | 20 | 0 | 18 | 55 | 870 | 420 | 0 | 0.1 | 3 | 25 | 1.2 | 180 | high | proposed |
| Fresh fish (60: dolphin fish, bonito, snapper) | 110 | 22 | 0 | 2 | 75 | 90 | 420 | 1 | 0.08 | 6 | 20 | 1 | 1 (2 salted lightly) | high | proposed |
| Green turtle, meat (60) | 90 | 20 | 0 | 0.5 | 78 | 70 | 230 | 0 | 0.1 | 3 | 30 | 1.4 | live until killed; 1 after | medium | proposed |
| Boucan, smoked meat (61) | 300 | 45 | 0 | 12 | 35 | 1500 | 500 | 0 | 0.1 | 6 | 0 | 4 | 90 | low | proposed |
| Tasajo, jerked beef (123) | 410 | 33 | 11 | 25 | 23 | 2000 | 600 | 0 | 0.1 | 5 | 0 | 5 | 180 | medium | proposed |
| Cheese, Suffolk or Cheddar (43) | 400 | 25 | 1 | 33 | 37 | 620 | 76 | 0 | 0.03 | 0.1 | 265 | 0.1 | 60 in the tropics (spoils, Ligon) | high | proposed |
| Butter (43) | 717 | 1 | 0 | 81 | 16 | 11 | 24 | 0 | 0 | 0 | 684 | 0 | 30 (turns rancid) | high | proposed |
| Milk, goat (43) | 69 | 4 | 4 | 4 | 87 | 50 | 200 | 1 | 0.05 | 0.3 | 57 | 0.05 | 1 | high | proposed |
| Eggs (ship's hens) | 143 | 13 | 1 | 10 | 76 | 142 | 138 | 0 | 0.04 | 0.1 | 160 | 1.8 | 21 | high | proposed |
| Cassava, boiled (76) | 160 | 1.4 | 38 | 0.3 | 60 | 14 | 270 | 20 | 0.09 | 0.9 | 1 | 0.3 | 2 (root); flour 180 | high | proposed |
| Manioc flour, farinha (116) | 360 | 1.5 | 88 | 0.5 | 8 | 20 | 300 | 0 | 0.1 | 1.5 | 0 | 1.5 | 365 | medium | proposed |
| Maize, whole grain (76, 92) | 365 | 9 | 74 | 5 | 10 | 35 | 287 | 0 | 0.4 | 3.6 | 11 | 2.7 | 365 (pellagra if the only food) | high | proposed |
| Yams, boiled (76, 92) | 118 | 1.5 | 28 | 0.2 | 70 | 8 | 670 | 12 | 0.1 | 0.5 | 6 | 0.5 | 30 (root) | high | proposed |
| Potatoes, boiled (76) | 87 | 2 | 20 | 0.1 | 77 | 4 | 379 | 13 | 0.1 | 1.4 | 0 | 0.3 | 60 | high | proposed |
| Plantain, boiled (77) | 116 | 0.8 | 31 | 0.2 | 67 | 5 | 465 | 11 | 0.05 | 0.7 | 45 | 0.6 | 7 | high | proposed |
| Pineapple (77) | 50 | 0.5 | 13 | 0.1 | 86 | 1 | 109 | 48 | 0.08 | 0.5 | 3 | 0.3 | 5 | high | proposed |
| Oranges (77) | 47 | 0.9 | 12 | 0.1 | 87 | 0 | 181 | 53 | 0.09 | 0.3 | 11 | 0.1 | 14 to 21 | high | proposed |
| Lemons (77) | 29 | 1.1 | 9 | 0.3 | 89 | 2 | 138 | 53 | 0.04 | 0.1 | 1 | 0.6 | 21 to 30 | high | proposed |
| Limes (77) | 30 | 0.7 | 11 | 0.2 | 88 | 2 | 102 | 29 | 0.03 | 0.2 | 2 | 0.6 | 21 to 30 | high | proposed |
| Lime juice, fresh (18) | 25 | 0.4 | 8 | 0.1 | 90 | 2 | 117 | 30 | 0.02 | 0.1 | 2 | 0.1 | 7; boiled or in copper: C falls to about 5 within weeks | medium | proposed |
| Sauerkraut (not a GOODS row; Cook's cure) | 19 | 0.9 | 4 | 0.1 | 92 | 660 | 170 | 15 | 0.02 | 0.1 | 1 | 1.5 | 180 in the cask | high | proposed |
| Onions (132) | 40 | 1.1 | 9 | 0.1 | 89 | 4 | 146 | 7 | 0.05 | 0.1 | 0 | 0.2 | 60 | high | proposed |
| Muscovado sugar (1) | 380 | 0 | 98 | 0 | 1 | 20 | 350 | 0 | 0 | 0.1 | 0 | 1.3 | 365 | high | proposed |
| Molasses (4) | 290 | 0 | 75 | 0 | 22 | 37 | 1464 | 0 | 0.04 | 0.9 | 0 | 4.7 | 365 | high | proposed |
| Cacao, as chocolate drink (11, 120) | 230 | 5 | 25 | 13 | 50 | 20 | 500 | 0 | 0.05 | 1 | 5 | 4 | 365 (nibs) | medium | proposed |
| Coffee, brewed (74) | 1 | 0.1 | 0 | 0 | 99 | 2 | 49 | 0 | 0 | 0.2 | 0 | 0 | - | high | proposed |
| Tea, brewed (75) | 1 | 0 | 0 | 0 | 99 | 3 | 37 | 0 | 0 | 0 | 0 | 0 | - | high | proposed |
| Rum, 40% (5) | 231 | 0 | 0 | 0 | 67 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 365 | high | proposed |
| Brandy (41), arrack (81), cachaca (115) | 231 | 0 | 0 | 0 | 67 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 365 | high | proposed |
| Ship's beer, small (78) | 35 | 0.3 | 3 | 0 | 94 | 4 | 27 | 0 | 0.01 | 0.4 | 0 | 0.02 | 30 (sours in the tropics) | medium | proposed |
| Strong beer, ale (42, 78) | 50 | 0.5 | 4 | 0 | 90 | 4 | 27 | 0 | 0.01 | 0.5 | 0 | 0.02 | 90 | medium | proposed |
| Wine, Madeira or claret (40) | 85 | 0.1 | 3 | 0 | 86 | 4 | 100 | 0 | 0 | 0.1 | 0 | 0.5 | 180 (loses its spirit in heat, Ligon) | high | proposed |
| Cider (78) | 50 | 0 | 5 | 0 | 88 | 4 | 100 | 1 | 0 | 0 | 0 | 0.1 | 60 | high | proposed |
| Punch (80): rum, water, lime, sugar, nutmeg | 90 | 0.1 | 10 | 0 | 80 | 2 | 40 | 8 | 0 | 0 | 0 | 0.1 | made to drink | low | proposed |
| Island drinks: mobbie, beveridge, wine of pines (79) | 45 | 0.3 | 6 | 0 | 88 | 3 | 100 | 10 | 0.02 | 0.2 | 2 | 0.2 | 3 to 7 | low | proposed |
| Palm oil (87) | 884 | 0 | 0 | 100 | 0 | 0 | 0 | 0 | 0 | 0 | 2000 | 0 | 180 (rancid) | high | proposed |
| Olive oil (107) | 884 | 0 | 0 | 100 | 0 | 2 | 1 | 0 | 0 | 0 | 0 | 0.6 | 365 | high | proposed |
| Kola nuts (88) | 150 | 2 | 35 | 1 | 60 | 10 | 300 | 10 | 0.1 | 1 | 0 | 1 | 60 | low | proposed |
| Coast provisions: goat and fowl, fresh (92) | 150 | 20 | 0 | 7 | 70 | 80 | 300 | 0 | 0.1 | 5 | 20 | 2 | 1 live-killed | medium | proposed |
| Pepper, cloves, nutmeg, cinnamon (66, 67); malaguetta (84) | 300 | 10 | 60 | 5 | 10 | 20 | 1000 | 0 | 0.1 | 1 | 0 | 10 | 365 | high | proposed (spice: grams a day; flavour, not food) |
| Salmagundi (the hot meal: salt meat, fish, onions, pease, spice, oil, vinegar) | 180 | 15 | 8 | 10 | 62 | 900 | 350 | 4 | 0.2 | 3 | 10 | 2 | 1 | low | proposed (derived) |
| Burgoo (oatmeal porridge with molasses) | 110 | 3 | 20 | 1.5 | 74 | 30 | 200 | 0 | 0.1 | 0.4 | 0 | 1.5 | 1 | low | proposed (derived) |
<!-- /table -->

- **[history]** Preserved food lacks vitamin C; fresh produce spoils (`GOODS.md` §1i); lime juice loses its
  vitamin C when boiled for keeping or stored in copper, which is why the Navy's later lime juice sometimes
  failed where lemons had worked (NUT-LIME, medium confidence); limes carry about half the C of lemons
  per weight (29 vs 53 mg/100 g). Woodall prescribed lemon juice in 1617 and ships carried "lime juice" as
  cargo (`GOODS.md` row 18); knowing to use it is the knowledge rule of `GOODS.md` §3f.
- **[model] (proposed)** A meal is a list of (good, grams); the engine sums the profile. Cooking changes
  it: boiling leaches half the vitamin C and some potassium into the water (kept if the broth is drunk);
  salt meat soaked a day loses a third of its sodium; biscuit does not change. Spoilage: each good's
  "keeps" clock from `GOODS.md`; a spoiled good gives half its energy and a food-poisoning roll
  (`MEDICINE.md` §6).
- **Visible face:** the galley menu the cook names; the hold's stores count; "biscuit and salt horse again";
  a crew mate who hoards oranges.
- **Mark:** **(proposed)**, every number a belt data task to verify; the scurvy mechanism **(Rex)**.

## 3. The period ration

<!-- table:nutrition.ration -->
*The Royal Navy ration of 1677 (Pepys' victualling contract), per man per week, with the nutrition it gave* (history; confidence medium; source: Pepys 1677 contract as summarised (NUT-RATION): 1 lb biscuit and 1 gallon beer a day; 8 lb beef a week, or 4 lb beef and 2 lb pork; 2 pints pease; fish days with 2 oz butter and 4 oz Suffolk cheese; a 1697 list adds 3 pints oatmeal. Sources differ on the exact schedule. About 5,000 kcal a day when fully issued (1770s figure, History Hit). Pirate ships ate what they took (Johnson: salmagundi, fresh turtle, wine).)

| Item | Per week | kcal a day (calc) | Protein g a day (calc) | Vit C mg a day | Note | Mark |
|---|---|---|---|---|---|---|
| Biscuit | 7 lb | 1720 | 45 | 0 | the bread | history |
| Beer | 7 gal | 1100 | 10 | 0 | small beer; the biggest calorie source; sours in the tropics so rum and water replaced it | history |
| Beef (salt) | 4 lb | 520 | 73 | 0 | or 8 lb with no pork | history |
| Pork (salt) | 2 lb | 415 | 26 | 0 |  | history |
| Pease | 2 pt (about 2.5 lb dry) | 550 | 39 | 3 |  | history |
| Oatmeal | 3 pt (about 2 lb) | 490 | 17 | 0 | 1697 list | history |
| Butter | 6 oz | 170 | 0 | 0 | fish days | history |
| Cheese | 12 oz | 195 | 12 | 0 | fish days | history |
| Total (calc) | - | 5160 | 222 | 3 | energy and protein ample; vitamin C, A and fibre near zero: scurvy in 6 to 12 weeks without fresh food | model |
<!-- /table -->

- **[history]** This is the Navy's contract; pirate ships ate what they took and what they fished, turtle
  above all in the Caribbean (`GOODS.md` row 60; Johnson's salmagundi). The ration's energy and protein
  are ample; its vitamin C is near zero, so the clock in §5 runs from the last fresh meal, and a Caribbean
  crew that fishes and turtles rarely sees scurvy while an Atlantic crossing or a long cruise does.
- **Mark:** **[history]** the ration; the calc column **(calc)**.

## 4. Energy balance and body composition

<!-- table:nutrition.body_composition -->
*Body composition: how fat and lean mass move* (science; confidence high; source: 7,700 kcal per kg of fat (standard); energy density fat 9, carbohydrate and protein 4, alcohol 7 kcal/g; glycogen about 400 g in muscle and liver, lasts about a day of hard work; in starvation, death near 50 to 60% of starting body mass or when fat is exhausted and protein is the only fuel (NUT-STARVE). Lean mass follows MUSCULAR development.)

| Quantity | Rule | Unit | Mark |
|---|---|---|---|
| Energy balance | intake kcal - PHYSIOLOGY expenditure | kcal/day | rex (that it is simulated) |
| Fat mass | += balance / 7700 when positive; -= balance / 7700 when negative (after glycogen is gone); floor 3 kg | kg/day | proposed |
| Glycogen | += carb intake x 0.8 up to 400 g; -= work (about 60 g per MET-hour over 4 MET); the Endurance pool's glycogenFactor = 0.5 + 0.5 x glycogen/400 | g | proposed |
| Lean mass | the MUSCULAR development sum x a body-size constant; in a deficit over 1,000 kcal/day, development decays (MUSCULAR energy gate) | kg | proposed |
| Body mass | fat + lean + the rest (bone, organs, water) | kg | proposed |
| Satiation | fullness 0 to 1: a meal adds its mass/600 g; falls 0.15 per hour; hunger (mood push, PSYCHOLOGY) under 0.2; 'could eat a horse' under 0.1 | index | rex (satiation), proposed (numbers) |
| Starvation stages | day 1 glycogen gone; days 2 to 7 ketosis, work capacity x0.8; weeks 2 to 6 wasting, x0.5, immune weak; death when fat is gone or mass under 60% of start | - | proposed |
<!-- /table -->

- **[science]** 7,700 kcal per kg of fat; glycogen about a day's hard work; starvation: glycogen the first
  day, then fat, then protein, with death when fat is gone or body mass falls near 50–60% of normal
  (NUT-STARVE).
- **[model]** Expenditure comes from `PHYSIOLOGY.md` §1; lean mass from `MUSCULAR.md`; the glycogen factor
  goes to the Endurance pool (`BODY.md` §3).
- **Effects:** fat mass changes the portrait (art keeper) and cold tolerance (`PHYSIOLOGY.md` §5), and the
  weight a limb carries (movement); a deficit decays muscle (`MUSCULAR.md` energy gate) and slows healing
  (`MEDICINE.md` §7); satiation pushes mood (`PSYCHOLOGY.md`).
- **Visible face:** "he's gone thin"; the cook's rations shortening; the quartermaster's count of days of
  food left (the one number the player sees: stores, not stats).
- **Mark:** **(Rex)** that energy and fat are simulated; **(proposed)** the rules.

## 5. Deficiency clocks

<!-- table:nutrition.depletion -->
*Deficiency clocks (the reserve model)* (model; confidence medium; source: Each nutrient is a pool filled by intake and drained by a daily use; signs begin when the pool crosses its threshold. Vitamin C: pool 1500 mg, use about 3% of the pool a day (so about 40 mg at full, falling), signs under 300 mg: about 42 to 84 days from the last fresh food, matching the historical 6 to 12 weeks (NUT-SCURVY). The other clocks are set to match the medical ranges in the nutrients table.)

| Nutrient | Pool full | Daily use | Signs below | Stage 1 face | Stage 2 face | Stage 3 face | Recovery on full intake | Mark |
|---|---|---|---|---|---|---|---|---|
| Vitamin C | 1,500 mg | 3% of pool (min 10 mg) | 300 mg | lassitude, low mood (day 40 to 60) | bleeding gums, bruises, aching legs (day 60 to 90) | old wounds open, teeth loose, swollen legs, death (day 90+) | days to feel better; 2 to 4 weeks to heal | rex (scurvy real), proposed (clock) |
| Thiamin | 30 mg | 1.2 mg | 8 mg | irritable, tired (week 3) | weak legs, swollen ankles (week 5) | heart failure (week 6+) | 1 week | proposed |
| Niacin | a tryptophan buffer worth 90 days | 16 mg NE | 20 days left | rash on the hands and neck in sun (month 2) | diarrhoea (month 3) | confusion (month 4+) | 2 weeks | proposed |
| Vitamin A | 500 mg (liver) | 0.9 mg | 50 mg | night blindness (month 6) | dry eyes, infections (month 9) | blindness (month 12+) | weeks | proposed |
| Iron | 1,000 mg (men), 300 (women) | 1 mg; +1 per menstrual day; +250 per litre of blood lost | 150 mg | tired, pale (month 3) | breathless on the rigging (month 5) | heart strain (month 8+) | months | proposed |
| Sodium | a 3-day buffer | 1.5 g + 1 g per litre of sweat | 1 g | cramps in heat | confusion | collapse | hours | proposed |
| Water | - | PHYSIOLOGY | 2% of body mass | thirst | dizziness | delirium | hours | **Rex** |
<!-- /table -->

- **[science]** Scurvy's first sign is lassitude, before the gums (Hodges; NUT-SCURVY); recovery on citrus
  is fast (days to feel better; Lind's sailors fit for duty in six days).
- **[model]** `pool += intake − use` daily; stages by pool; recovery by intake. The disease itself (its
  effects, its face, its death risk) is `MEDICINE.md`'s row; this file only runs the clock.
- **Effects:** stage multipliers go to `MEDICINE.md` as conditions (scurvy, beriberi, pellagra, anaemia,
  night blindness); vitamin C under 300 mg triples healing time and reopens wounds (`MEDICINE.md` §7).
- **Visible face:** stage 1 is invisible except to a surgeon who knows it; stage 2 is bleeding gums in
  dialogue and the surgeon's report; stage 3 is men unable to stand. The player who reads the signs early
  turns for a port with fruit.
- **Mark:** scurvy **(Rex)**; the clocks **(proposed)**.

## 6. Water and salt

- **[science]** Needs and thresholds are `PHYSIOLOGY.md` §5a (3.7 L total a day for a man, more in heat;
  2% loss impairs; seawater costs more water than it gives). Sweat carries about 1 g of salt a litre in the
  unacclimatised, less when acclimatised. The salt-meat diet gave far more sodium than needed (10–20 g a
  day), so at sea the problem was water and potassium, not salt; ashore, a hunter sweating on fresh meat
  could run short of salt (NUT-DRI, PHY-HYD).
- **[history]** Water was rationed by the cask; rain caught in sails; beer and wine drunk instead of water
  because the water went foul (`../DUTIES.md` rationing water; `GOODS.md` §1k on beer souring in the
  tropics). Rum and water was the period's mix; grog (1740) is later.
- **[model] (proposed)** `waterStore` in casks (litres), drained by the crew's need (PHYSIOLOGY) and
  leakage (the cooper's duty); the daily ration is a quartermaster choice (full, three-quarters, half) with
  the deficit going to each crew mate's hydration; foul water (days in the cask, `GOODS.md` spoilage) raises
  the dysentery exposure (`MEDICINE.md` §6). Potassium comes from pease, fish, fruit, molasses; a
  biscuit-and-beef diet runs it low in weeks (cramps, weakness: `MEDICINE.md`).
- **Visible face:** the cask count; "a pint a man"; cramps at the capstan.
- **Mark:** **(Rex)** water and salt are needs; **(proposed)** the rules.

## 7. Eating for a boost, and drink

<!-- table:nutrition.boosts -->
*Eating for a boost (Rex: eat enough of something that pumps up muscles and you get a boost)* (fiction; confidence low; source: The real effects are the gates in MUSCULAR.md (protein, energy) and the glycogen factor on the Endurance pool; anything beyond that is game fiction, marked so. Provenance tags (COMBAT.md 4d, Rex) keep a sci-fi food's values apart from its tag.)

| Food or dose | Real effect (science) | Game boost (fiction) | Mark |
|---|---|---|---|
| A meal of fresh meat or fish after training (protein over 1.6 g/kg that day) | conversion gate x1.0 | none beyond the real one | proposed |
| A hot meal before a fight (carbs, glycogen full) | Endurance pool glycogenFactor 1.0 | none beyond | proposed |
| Rum before boarding (Rex's PIRATE.md: too much rum, accidents) | pain -2, alertness x0.8, Nerve +1 (fiction), Dexterity x0.9 | 'Dutch courage': the Brave slider read +10 for the fight (fiction, open) | proposed |
| Coffee, tea, chocolate (74, 75, 11) | alertness x1.1 for 4 h (caffeine; science) | none beyond | proposed |
| Kola nut (88) | caffeine: as coffee | none beyond | proposed |
| A sci-fi or mythical food (provenance-tagged) | whatever values its row gives | a tagged boost the item screen shows; the engine reads values, never the tag (Rex) | **open** |
<!-- /table -->

- **(Rex, 2026-10-29)** Eat enough of something that pumps up muscles and you get a boost. **[science]**
  The real boost is the protein and energy gates on muscle growth (`MUSCULAR.md` §5) and full glycogen on
  the Endurance pool; nothing a period food contains does more. **[fiction] (proposed)** Anything beyond is
  a tagged fiction (a mythical fruit, a sci-fi ration), shown on the item screen with its provenance tag
  (Rex, `COMBAT.md` §4d), its values read like any food's.
- **Drink:** alcohol is a nutrient row (energy 7 kcal/g, no nutrition); drunkenness is the `STATS.md` §4
  "drink" state (Rex's row), with Dexterity and Reflexes dips and the accident rule (`PIRATE.md` §5a); the
  dry gripes from lead-worm stills is `MEDICINE.md`'s; habit (a daily ration for months) is `PSYCHOLOGY.md`'s
  push (open).
- **Mark:** as the table.

## 8. What this file hands to the others

| To | What | Where it is used |
|---|---|---|
| `BODY.md` | `glycogenFactor`, `energyBalance`, fat and lean mass, nutrient stage multipliers, satiation | capability, the Endurance pool |
| `MUSCULAR.md` | protein and energy gates | conversion of stimulus |
| `MEDICINE.md` | deficiency conditions by stage; healing modifiers (C, protein, energy); food-poisoning rolls | conditions |
| `PHYSIOLOGY.md` | intake kcal, water drunk | balance |
| `PSYCHOLOGY.md` | hunger, drink, a favourite food | mood pushes |
| `../economy/GOODS.md` and the stores | consumption per day per good; spoilage; the provisioning list | the voyage |

## Open for Rex

1. Which nutrients the game tracks: the first eight are yours by name; the other ten are the keeper's
   reading of "the rest".
2. Whether the hold shows days-of-food and water (the keeper assumes stores are visible, stats hidden).
3. Boosts beyond the real ones (the table's fiction rows), and whether rum gives Dutch courage.
4. Habit (rum, laudanum, tobacco) as a system: here, `PSYCHOLOGY.md`, or not at all.
5. Every food number is a belt verification task against FoodData Central before tuning.

## Sources

`../SOURCES.md` keys NUT-*: the DRIs (National Academies), Hodges' experimental scurvy and the BMJ staging,
thiamin and pellagra reviews, USDA composition data, Pepys' 1677 contract as summarised, starvation
physiology, lime-vs-lemon composition.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened from Rex's §4c decisions; nutrients (18), food profiles (50 goods), the 1677 ration, body composition, deficiency clocks, water and salt, boosts; tables in `data/nutrition.json` | keeper |
