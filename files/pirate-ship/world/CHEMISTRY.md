# Chemistry: substances, reactions, scope (body-and-world keeper, 2026-10-29)

The substance layer of Rex's gas simulation (2026-10-29), written to ChatGPT's compromise (outside AI)
that Rex passed on: **the architecture is general (solids, liquids and gases; any route; any provenance),
the initial database is small (the period's gases and fuels), and whether the economy's recipes become
reactions of this engine is a separate, open decision.** **All proposed.**

**Ownership.** This file: the substance schema and records, the reaction schema and records, the
conditions under which a reaction runs. `GAS_DYNAMICS.md` moves what is airborne; the body docs decide
what a dose does; `../economy/GOODS.md` keeps the goods and recipes as they are until Rex says otherwise.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `../body/data/chemistry.json`.

## What Rex has decided that this file must respect

- **(Rex, 2026-10-29)** Provenance tags: a tagged substance's record is read like any other; the tag shows
  on the item screen and nowhere else.
- **(Rex, 2026-10-29)** Knowledge apart from skill (`GOODS.md` §3f): knowing a procedure is not the skill
  to run it. ChatGPT's reading, kept: the crafting skill moves the minigame's control (temperature,
  timing, handling), never the laws; a player who knows a procedure may attempt it without a recipe, and
  a poor character makes it hard to execute.

## 1. The substance schema

<!-- table:chemistry.schema -->
*The substance schema (every substance, real or tagged, is one record of this shape)* (model; confidence high; source: ChatGPT's field list (outside AI), kept and typed; provenance tags per Rex (COMBAT 4d): the engine reads properties, never the tag.)

| Field | Type and unit | Used by | Mark |
|---|---|---|---|
| id | string (chemistry id, e.g. co2) | every doc | rex (the field, 2026-10-29) |
| name, formula | text | the item screen, the docs | rex (the field, 2026-10-29) |
| provenance | Historical \| Anachronistic \| Prehistoric \| Mythological \| Fantasy \| Science Fiction \| Original Fiction | the item screen only (Rex) | rex (the tags), proposed (the field) |
| molar mass | g/mol | stoichiometry, density | rex (the field, 2026-10-29) |
| phase at 25 C and 1 atm; melting and boiling points | solid \| liquid \| gas; C | which engine handles it (GAS_DYNAMICS for gases and vapours) | rex (the field, 2026-10-29) |
| density (gas: relative to air; liquid, solid: kg/m3) | number | pooling and rising; cargo weight | rex (the field, 2026-10-29) |
| vapour pressure at 25 C | mmHg | how much a liquid puts into the air (mercury: 0.002 mmHg, enough to poison a shut room over months) | rex (the field, 2026-10-29) |
| solubility in water | g/L | washing out by rain; dissolving in the body's fluids (uptake) | rex (the field, 2026-10-29) |
| flammability: flash point, limits in air | C; % by volume | fires, explosions (the magazine) | rex (the field, 2026-10-29) |
| reactivity notes | text and reaction ids | CHEMISTRY reactions | rex (the field, 2026-10-29) |
| thermal: heat of combustion | MJ/kg | the fire's heat (PHYSIOLOGY, the box's temperature) | rex (the field, 2026-10-29) |
| persistence in the environment | half-life in air, water, soil (hours to years) | GAS_DYNAMICS sinks; ECOLOGY | rex (the field, 2026-10-29) |
| exposure routes | inhalation \| skin \| ingestion \| wound | the body's uptake | rex (the field, 2026-10-29) |
| uptake fraction by route | 0 to 1 | dose = exposure x uptake | rex (the field, 2026-10-29) |
| toxicity references | thresholds table rows (ppm and effect; mg/kg oral) | MEDICINE, NEUROLOGY | rex (the field, 2026-10-29) |
| mechanism class | asphyxiant (simple) \| chemical asphyxiant (CO, H2S) \| irritant \| systemic toxin \| neuroactive (NEUROLOGY row) \| nutrient \| inert | which body pathway it takes | rex (the field, 2026-10-29) |
<!-- /table -->

## 2. The initial database

<!-- table:chemistry.substances -->
*The initial database (small; the schema is general)* (science; confidence medium; source: Standard chemical data; toxicity thresholds from occupational and clinical references: CO (COHb 10 to 20% headache, 20 to 30% drowsiness and ataxia, 30 to 50% seizures and unconsciousness, over 50% death; 200 ppm slight headache in 2 to 3 h, 800 ppm dizziness and convulsions in 45 min, 1,600 ppm death within 30 min; elimination half-life 4 to 6 h in air; CHM-CO), CO2 (1% drowsy, 3% headache and panting, 5% confusion, 8 to 10% unconsciousness; standard), H2S (10 ppm irritation, 100 ppm IDLH and olfactory fatigue, 500 ppm lethal in 30 to 60 min; CHM-H2S), SO2 (irritant: 5 ppm airway, 100 ppm IDLH), oxygen (hypoxia under 16%, unconsciousness under 10%).)

| Id | Substance | Formula | Molar mass | Phase | Density vs air | Mechanism class | Effect thresholds (inhalation) | Period source in the game | Provenance | Mark |
|---|---|---|---|---|---|---|---|---|---|---|
| o2 | Oxygen | O2 | 32 | gas | 1.1 | nutrient (the one the body burns) | under 19.5% work falls; 16% judgement and coordination; 12% unconscious; 6% death in minutes | the air | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| n2 | Nitrogen | N2 | 28 | gas | 0.97 | inert | none (simple asphyxiant only by displacement) | the air | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| co2 | Carbon dioxide | CO2 | 44 | gas | 1.5 | simple asphyxiant and respiratory driver | 1% drowsy; 3% headache, panting; 5% confusion; 8 to 10% unconscious; pools low | breathing, fires, fermentation (the brewer's vat), wells, volcanoes | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| co | Carbon monoxide | CO | 28 | gas | 0.97 | chemical asphyxiant (binds haemoglobin 200 x oxygen: carboxyhaemoglobin) | 200 ppm headache in 2 to 3 h; 800 ppm nausea and convulsions in 45 min; 1,600 ppm death in 30 min; COHb 10 to 20% headache, 20 to 30% drowsy and ataxic, 30 to 50% seizures, over 50% death; half-life 4 to 6 h in air | braziers, galley fires, the gun deck, any fire starved of air | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| h2o_v | Water vapour | H2O | 18 | gas | 0.6 | inert (displaces oxygen in the alveoli: the 47 mmHg) | none | humidity, breath, fires | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| h2s | Hydrogen sulphide | H2S | 34 | gas | 1.2 | chemical asphyxiant (cellular) and irritant; the nose fails at 100 ppm | 0.01 ppm rotten eggs; 10 ppm eye and airway irritation; 100 ppm olfactory fatigue, IDLH; 500 ppm collapse, death in 30 to 60 min; pools low | the bilge, rot, sulphur springs, powder smoke (trace) | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| so2 | Sulphur dioxide | SO2 | 64 | gas | 2.2 | irritant (airways, eyes) | 1 ppm smell; 5 ppm airway irritation; 20 ppm eyes stream, cough; 100 ppm IDLH; pools low | burning sulphur (stinkpots, the match), volcanoes, the brimstone cure | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| smoke | Smoke particles (soot, tars) | C and tars | - | aerosol | - | irritant; heat; carries CO | eyes stream and sight falls (Eyesight x0.6 at 100 mg/m3); cough; inhalation injury at high density with heat | every fire; the gun deck | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| hg_v | Mercury vapour | Hg | 201 | gas from the liquid (vapour pressure 0.002 mmHg at 25 C) | 7 | systemic toxin (nerves, kidneys; NEUROLOGY burden) | chronic: a shut room with spilt mercury reaches 0.1 mg/m3; months to erethism and tremor | the pox cure, the apothecary, hatters later | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| ch4 | Methane (marsh gas) | CH4 | 16 | gas | 0.55 | simple asphyxiant; flammable 5 to 15% | none until oxygen is displaced; an explosion with a lamp | the bilge, swamps, mines | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| s | Sulphur (brimstone) | S8 | 256 | solid | - | fuel: burns to SO2 | - | the stinkpot, the match, the powder mill, the brimstone cure | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| c | Charcoal (carbon) | C | 12 | solid | - | fuel: burns to CO2, or CO when starved | - | the brazier, the galley, the powder mill, the smith | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| kno3 | Saltpetre (potassium nitrate) | KNO3 | 101 | solid | - | oxidiser (GOODS row 39) | - | the powder | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| ethanol | Alcohol (spirit of wine) | C2H5OH | 46 | liquid (vapour pressure 59 mmHg) | 1.6 | neuroactive (NEUROLOGY row); flammable | the drink; its vapour in a still-house is a fire risk | rum, brandy, arrack | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| pb | Lead | Pb | 207 | solid (dissolves into rum and cider from still worms and pewter) | - | systemic toxin (the dry gripes; NEUROLOGY burden) | by ingestion (MEDICINE) | stills, pewter, shot | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| tagged | A tagged substance (template) | as written | as written | as written | as written | as written | its own thresholds | the story keeper's | Fantasy \| Science Fiction \| Mythological | **open** |
<!-- /table -->

- **[science]** Thresholds from occupational and clinical references (CHM-CO, CHM-H2S); carbon monoxide
  binds haemoglobin two hundred times as strongly as oxygen, which is why it is `CIRCULATION.md`'s problem
  and not the lungs' (its §1a carboxyhaemoglobin row); hydrogen sulphide kills the nose at 100 ppm, so
  the warning smell stops before the lethal level, the classic trap of the sealed hold.
- **[history]** Every row is a period substance with its period source in the game; the tagged template
  is the story keeper's.

## 3. Reactions

<!-- table:chemistry.reactions -->
*The reaction schema and the first reactions (combustion)* (science; confidence medium; source: Stoichiometry is exact; rates and conditions are placeholders. Black powder: 75% KNO3, 15% charcoal, 10% sulphur by mass; about 43% of products are gas (CO2, N2, CO, H2S, H2, CH4), 56% solids (potassium salts), about 330 cm3 of gas per gram; the products do not follow one simple equation (CHM-BP). Thermodynamic possibility is not kinetics: a reaction needs its conditions (ChatGPT's point, kept).)

| Id | Reaction | Reactants | Products | Conditions | Rate (placeholder) | Heat | Where | Mark |
|---|---|---|---|---|---|---|---|---|
| comb_c_full | Charcoal burning in plenty of air | C + O2 | CO2 + heat | ignition over 400 C; oxygen over 15% | by fuel surface and draught | 33 MJ/kg | the galley, the smith | rex (the reaction, 2026-10-29); proposed (rates) |
| comb_c_starved | Charcoal burning starved of air | 2 C + O2 | 2 CO + heat | oxygen under 15% or a shut space | the brazier in the cabin: 10 to 30% of carbon to CO | 10 MJ/kg | the brazier, a smouldering hold | rex (the reaction, 2026-10-29); proposed (rates) |
| comb_wood | Wood and tar burning | wood + O2 | CO2, H2O, CO (10% if smoky), soot, tars, heat | ignition; spreads by heat | by surface | 15 MJ/kg | a ship on fire | rex (the reaction, 2026-10-29); proposed (rates) |
| comb_s | Sulphur burning | S + O2 | SO2 + heat | ignition over 250 C | a stinkpot: 100 g in a minute | 9 MJ/kg | stinkpots, the match | rex (the reaction, 2026-10-29); proposed (rates) |
| black_powder | Black powder deflagration | KNO3 + C + S (75:15:10) | gases 43% (CO2, N2, CO, H2S trace, H2, CH4) 330 cm3/g; solids 56% (K2CO3, K2SO4, K2S); water 1% | a spark, a match; confinement makes the bang | instant | 3 MJ/kg | the guns, the magazine, a grenade | rex (the reaction, 2026-10-29); proposed (rates) |
| ferment | Fermentation (the brewer's and the still-house's first step) | sugars | ethanol + CO2 | yeast, 20 to 30 C, days | a vat: 1 L CO2 per litre of wort over days (a shut brew-house pools CO2) | small | GOODS brewing and distilling; a CO2 source for GAS_DYNAMICS | rex (the reaction, 2026-10-29); proposed (rates) |
| rot | Anaerobic rot (the bilge) | organic matter | CH4, H2S, CO2 | wet, no air, warm | slow; by the cleanliness meter | - | the bilge, the stores | rex (the reaction, 2026-10-29); proposed (rates) |
| (general) | Any reaction the engine will later hold: metallurgy (smelting, the forge), cooking (Maillard, caramel), corrosion (rust, verdigris), tanning, dyeing (indigo vats), the apothecary's preparations (calomel, lunar caustic, spirit of salt) | by record | by record | temperature, pressure, catalyst, contact time | by record | by record | GOODS recipes as the first list of what the engine must eventually express | open (scope: whether recipes become reactions) |
<!-- /table -->

- **[science]** Stoichiometry is exact and the rates are placeholders. Black powder's products do not
  follow one equation (CHM-BP); the table gives the measured shares. Thermodynamic possibility is not
  kinetics: a reaction needs its conditions (ignition, oxygen, temperature, a catalyst, contact time).
- **[model]** A reaction consumes reactants from a region or an inventory and hands its products to
  `GAS_DYNAMICS.md` (gases, aerosols) or the inventory (solids, liquids), with its heat to the box's
  temperature. Fermentation is the first non-combustion reaction because the brewer's vat is a period
  carbon dioxide source and the still-house a fire risk; both are `GOODS.md` trades already.

## 4. Scope

<!-- table:chemistry.scope -->
*Scope: general architecture, small start (the compromise)* (model; confidence high; source: ChatGPT's position (outside AI): the engine's capability is not the game's need at any moment; the pirate period must not size the architecture. The keeper's caution: replacing GOODS.md's 183 recipes with reactions is a redesign of the economy's crafting and a decision of its own. Both recorded.)

| Statement | Status | Mark |
|---|---|---|
| The substance schema and reaction schema are general: solids, liquids and gases; any route; any provenance | established here | rex (the statement, 2026-10-29) |
| The initial database is the period's gases and fuels (16 substances, 7 reactions) | established here | rex (the statement, 2026-10-29) |
| Crafting skill affects the minigame's control (temperature, timing, handling), never the chemistry (ChatGPT's rule, agreed) | recorded | rex (the statement, 2026-10-29) |
| A player who knows a procedure may attempt it without a recipe; poor character skill makes it hard to execute | recorded; touches GOODS 3f (knowledge apart from skill, Rex) | rex (the statement, 2026-10-29) |
| Whether GOODS.md's recipes become reactions of this engine | not decided; the economy's lane and Rex's | open (Rex, 2026-10-29: stays open) |
| Who keeps CHEMISTRY.md after this (the body keeper, the economy, a new keeper) | not decided | **open** |
<!-- /table -->

- **(keeper)** The general engine is where "a player with real scientific knowledge can interact with the
  world's mechanisms and discover outcomes nobody scripted" lives, which is Rex's original idea. The
  keeper's one caution stands and is recorded in the table: turning `GOODS.md`'s 183 recipes into
  reactions is a redesign of crafting and a decision of its own; nothing here touches the recipes.

## Open for Rex

1. ~~Keep, cut, or stamp the schema and the database~~ stamped (Rex, 2026-10-29); numbers placeholders.
2. Whether `GOODS.md`'s recipes become reactions (the economy's lane with you).
3. Who keeps this file after today.
4. Every rate and threshold is a placeholder.

## Sources

`../SOURCES.md` keys CHM-*: carbon monoxide thresholds (EMS protocol tiers; the sensor-review table;
the hazard database's half-life); hydrogen sulphide (NAP and EPA evaluation values); black powder's
products (the 1868 analysis via Ecton Hill and the encyclopaedia; Proceedings 1879); standard chemical
data for the rest.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | Rex stamped the schema, database and scope as his; recipes-as-reactions explicitly left open | Rex |
| 2026-10-29 | File opened; the schema, 16 substances, 7 reactions, the scope statement; tables in `../body/data/chemistry.json` | keeper |
