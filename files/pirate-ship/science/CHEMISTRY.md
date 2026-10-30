# Chemistry: the universal engine (body-and-world keeper, 2026-10-29; reframed the same day)

**The game takes place in 1700. This engine does not.** Rex's correction (2026-10-29, after ChatGPT's,
outside AI): chemistry is a foundational engine, not an atmospheric subsystem and not a list of what a
pirate could buy. The pirate game is the first application of a universal simulation engine, not its
boundary. Historical availability belongs to the world, the economy, the technology and the crafting
layers (`TECHNOLOGY.md`, `../economy/GOODS.md`); what limits a character is the equipment in his hands
(`SCIENTIFIC_EQUIPMENT.md`), never the year; and what he makes before its time is a Time Anomaly in his
journal (`JOURNAL.md`), real all the same. This file moved from `world/` to `science/` with that
correction; `../world/ATMOSPHERE.md` is now a consumer of it.

**(Rex, 2026-10-29)** The universal scope, the equipment-as-limiter rule, the time-anomaly journal and the
plug-in rule for anomalous equipment are his, as are the schema, the database and the scope statement
stamped earlier the same day; the domains table, the reaction record and the honesty rule were
stamped as his the same day (the science folder's structure, Rex, 2026-10-29); every constant and catalogue entry stays a placeholder; recipes-as-reactions stays open (Rex). **Rex, the
same day: the architecture is canon, but each specific reaction and each historical claim remains
proposed until verified against a source** (the belt's database tasks carry that verification). **Rex, the same day: the
architecture is canon, but each specific reaction and each historical claim remains proposed until
verified against a source** (the belt's database tasks carry that verification).

**Ownership.** This file: substances, reactions, the chemical principles (composition, properties,
thermodynamics, kinetics, equilibrium, phases) and the domains. `PHYSICS.md` the shared physical layer.
`SCIENTIFIC_EQUIPMENT.md` what an apparatus can do. `TECHNOLOGY.md` what a setting makes available.
`DISCOVERY.md` what a character can tell about what he has. `JOURNAL.md` what the player has recorded and
how history labels it. `../world/GAS_DYNAMICS.md` moves what is airborne; the body docs decide what a dose
does; `../economy/GOODS.md` keeps the goods and recipes as they are until Rex decides otherwise.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `../body/data/chemistry.json`.

## 1. The five separations

The questions the old framing ran together, now kept apart (the table is in `DISCOVERY.md` §1):
**scientific existence** (this file), **historical availability** (`TECHNOLOGY.md`, `GOODS.md`),
**technological accessibility** (`SCIENTIFIC_EQUIPMENT.md`), **execution difficulty** (the skill
minigames, Rex's), **provenance** (`JOURNAL.md`). Nothing in the engine is decided by the year.

## 2. The substance schema

<!-- table:library/chemistry.schema -->
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

## 3. The domains

<!-- table:chemistry.domains -->
*The domains the engine must eventually cover (architecture now, records later)* (science; confidence high; source: ChatGPT's list (outside AI), adopted by Rex (2026-10-29): chemistry itself, regardless of whether the civilisation in the game understands it. The record types each domain needs are the keeper's; coverage grows by adding records, never by changing the schema.)

| Domain | What it covers | Record types it needs | First records in the database | Period example (1650 to 1730) | Anomaly example (reachable with period equipment) | Status | Mark |
|---|---|---|---|---|---|---|---|
| Composition and structure | elements, molecules, ions, formula and molar mass, isomers later | substance | 16 substances | sulphur, mercury, saltpetre | oxygen as an element (Lavoisier 1777) named in 1700 | schema done | rex (scope) |
| Physical properties and phases | density, melting and boiling points, vapour pressure, solubility, phase diagrams | substance fields; phase-change rules | the schema's fields | distilling spirit at 78 C; mercury's vapour | liquefying a gas with a freezing mixture | schema done | rex (scope) |
| Thermodynamics | heat of reaction, energy balance, spontaneity (free energy) as the possibility test | reaction fields: heat, free energy sign | heat of combustion on fuels | the smith's charcoal | the ice calorimeter (1782) built from a tin and ice | fields done | rex (scope) |
| Kinetics | rate as a function of temperature (Arrhenius), concentration, catalyst, contact time: the feasibility test apart from possibility | reaction fields: rate law, activation, catalyst | placeholders on 7 reactions | a slow digestion in the athanor | - | fields done | rex (scope) |
| Equilibrium and acid-base | reversible reactions, pH, buffers, solubility products | reaction fields: equilibrium constant; substance fields: acid strength | litmus as the period's pH | aqua fortis, oil of vitriol, spirit of salt (the three mineral acids, all period) | a pH as a number (1934) from a glass electrode | fields done | rex (scope) |
| Inorganic | metals, salts, acids, bases, the mineral acids, pigments | substances, reactions | saltpetre, sulphur, mercury, lead | calomel and the red precipitate (the apothecary's mercury compounds) | chlorine from salt, manganese ore and oil of vitriol (Scheele 1774): all three obtainable in 1700 | records open | rex (scope) |
| Organic | carbon compounds: alcohols, acids, esters, sugars, fats, dyes, drugs | substances, reactions | ethanol; fermentation | ether from spirit of wine and oil of vitriol (Cordus 1540: Historical); indigo vats; soap from fat and lye | aspirin from willow bark's salicin (1897) by a period apothecary who knows the steps | records open | rex (scope) |
| Biochemistry | the body's chemistry: NUTRITION's nutrients, NEUROLOGY's substances, enzymes, fermentation | substances shared with the body docs | the nutrients and the drugs (by reference) | fermentation, bread, cheese | - | shared | rex (scope) |
| Electrochemistry | cells, electrolysis, plating, corrosion | reactions with a power role; substance electrode potentials | none | verdigris on copper; the ship's rust | the voltaic pile (1800) from zinc and copper; electrolysis of water | records open | rex (scope) |
| Metallurgy and materials | smelting, alloys, steel, glass, ceramics, cement | reactions with heat roles; material records | none (GOODS has the trades) | casting bronze guns; crucible glass; the forge | crucible steel (1740) in a charcoal furnace with a good crucible | records open; GOODS's smelting and smithing recipes are the first list | rex (scope) |
| Photochemistry, radiochemistry, nuclear | light-driven and nuclear reactions | reactions with light roles | none | silver salts darkening (known 1727, Schulze) | - | later | rex (the domain is supported, 2026-10-29); proposed (records) |
| Interactions with other systems | what a substance does to a body (the body docs), the air (ATMOSPHERE), the sea and soil (ECOLOGY), a material (corrosion, GOODS) | the mechanism class and route fields | done | - | - | schema done | rex (scope) |
<!-- /table -->

- **[science]** Each domain is standard chemistry; the engine supports it by having the record types,
  not by holding every record. Coverage grows by adding substances and reactions; the schema does not
  change. The anomaly column is the point of the design: Scheele's chlorine, Priestley's oxygen, Volta's
  pile, Huntsman's steel and Cordus's ether are all reachable with reagents and apparatus a 1700
  apothecary or smith could hold, so a player who knows them can make them, and the journal will say
  what they did.

## 4. The reaction record

<!-- table:library/chemistry.reaction_fields -->
*The reaction record (every reaction, period or not, is one record of this shape)* (model; confidence high; source: Thermodynamic possibility and kinetics kept apart (ChatGPT, kept); conditions as the roles an apparatus must supply (SCIENTIFIC_EQUIPMENT); 'unknown' as the engine's honest answer for a reaction it has no record of.)

| Field | Type and unit | Used by | Mark |
|---|---|---|---|
| id, name | text | every doc | rex (the field, 2026-10-29) |
| reactants and products with stoichiometry | substance ids and moles | mass conservation; GAS_DYNAMICS sources; inventories | rex (the field, 2026-10-29) |
| possibility: free-energy sign at conditions, or 'spontaneous above T' | sign or a temperature | whether it can happen at all | rex (the field, 2026-10-29) |
| conditions: temperature range, pressure, atmosphere, catalyst, solvent, contact time | numbers and ids | the assembly pipeline (SCIENTIFIC_EQUIPMENT 3): the roles an apparatus must supply | rex (the field, 2026-10-29) |
| rate: a rate law and an activation energy, or a half-time at a reference temperature | placeholder constants | how long; whether the fuel lasts | rex (the field, 2026-10-29) |
| equilibrium constant (if reversible) | number at a reference temperature | yield | rex (the field, 2026-10-29) |
| heat | kJ/mol or MJ/kg | the box's temperature; fires | rex (the field, 2026-10-29) |
| side reactions and failure modes | reaction ids; what happens off-conditions (too hot: charring; too little air: CO) | the engine's answer when conditions are missed | rex (the field, 2026-10-29) |
| hazards | explosion limits, toxic products, pressure | accidents (ATMOSPHERE laboratory scenario; MEDICINE) | rex (the field, 2026-10-29) |
| identification: what a period test shows, what an instrument shows | tests and instrument ids | DISCOVERY: observed vs identified | rex (the field, 2026-10-29) |
| history: first performed, by whom, where; disputes | dates and names | JOURNAL: the anomaly note | rex (when and by whom) |
| coverage: supported \| unknown | the engine's honesty flag: a reaction not in the database is unknown, never impossible | DISCOVERY's answer to an attempt the database does not hold | rex (the field, 2026-10-29) |
<!-- /table -->

- **[science]** Possibility (thermodynamics) and feasibility (kinetics) are two questions; a reaction that
  can happen may be too slow at the temperature the apparatus reaches, and one that needs a catalyst does
  not run without it. The engine asks both.
- **The honesty rule (proposed; ChatGPT's, agreed):** a finite database cannot predict every synthesis.
  A reaction the database does not hold is **unknown**, never impossible: the attempt is recorded in the
  journal, the engine does what it can with the records it has (side reactions, nothing, an accident),
  and the belt adds the record if the chemistry is real. The database is meant to grow with the players'
  attempts.

## 5. The initial database

<!-- table:chemistry.substances -->
*The initial database (small; the schema is general)* (science; confidence medium; source: Standard chemical data; toxicity thresholds from occupational and clinical references: CO (COHb 10 to 20% headache, 20 to 30% drowsiness and ataxia, 30 to 50% seizures and unconsciousness, over 50% death; 200 ppm slight headache in 2 to 3 h, 800 ppm dizziness and convulsions in 45 min, 1,600 ppm death within 30 min; elimination half-life 4 to 6 h in air; CHM-CO), CO2 (1% drowsy, 3% headache and panting, 5% confusion, 8 to 10% unconsciousness; standard), H2S (10 ppm irritation, 100 ppm IDLH and olfactory fatigue, 500 ppm lethal in 30 to 60 min; CHM-H2S), SO2 (irritant: 5 ppm airway, 100 ppm IDLH), oxygen (hypoxia under 16%, unconsciousness under 10%).)

| Id | Substance | Formula | Molar mass | Phase | Density vs air | Mechanism class | Effect thresholds (inhalation) | Period source in the game | Provenance | Mark |
|---|---|---|---|---|---|---|---|---|---|---|
| o2 | Oxygen | O2 | 32 | gas | 1.1 | nutrient (the one the body burns) | under 19.5% work falls; 16% judgement and coordination; 12% unconscious; 6% death in minutes | the air | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| n2 | Nitrogen | N2 | 28 | gas | 0.97 | inert | none (simple asphyxiant only by displacement) | the air | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| co2 | Carbon dioxide | CO2 | 44 | gas | 1.5 | simple asphyxiant and respiratory driver | 1% drowsy; 3% headache, panting; 5% confusion; 8 to 10% unconscious; pools low | breathing, fires, fermentation (the brewer's vat), wells, volcanoes | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| co | Carbon monoxide | CO | 28 | gas | 0.97 | chemical asphyxiant (binds haemoglobin 200 x oxygen: carboxyhaemoglobin) | 200 ppm headache in 2 to 3 h; 800 ppm nausea and convulsions in 45 min; 1,600 ppm death in 30 min; COHb 10 to 20% headache, 20 to 30% drowsy and ataxic, 30 to 50% seizures, over 50% death; half-life 4 to 6 h in air | braziers, galley fires, the gun deck, any fire starved of air | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| h2o_v | Water vapour | H2O | 18 | gas | 0.6 | inert (displaces oxygen in the alveoli: the 47 mmHg) | none | humidity, breath, fires | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| h2s | Hydrogen sulphide | H2S | 34.08 | gas | 1.2 | chemical asphyxiant (cellular) and irritant; the nose fails at 100 ppm | 0.01 ppm rotten eggs; 10 ppm eye and airway irritation; 100 ppm olfactory fatigue, IDLH; 500 ppm collapse, death in 30 to 60 min; pools low | the bilge, rot, sulphur springs, powder smoke (trace) | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| so2 | Sulphur dioxide | SO2 | 64.07 | gas | 2.2 | irritant (airways, eyes) | 1 ppm smell; 5 ppm airway irritation; 20 ppm eyes stream, cough; 100 ppm IDLH; pools low | burning sulphur (stinkpots, the match), volcanoes, the brimstone cure | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| smoke | Smoke particles (soot, tars) | C and tars | - | aerosol | - | irritant; heat; carries CO | eyes stream and sight falls (Eyesight x0.6 at 100 mg/m3); cough; inhalation injury at high density with heat | every fire; the gun deck | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| hg_v | Mercury vapour | Hg | 201 | gas from the liquid (vapour pressure 0.002 mmHg at 25 C) | 7 | systemic toxin (nerves, kidneys; NEUROLOGY burden) | chronic: a shut room with spilt mercury reaches 0.1 mg/m3; months to erethism and tremor | the pox cure, the apothecary, hatters later | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| ch4 | Methane (marsh gas) | CH4 | 16.04 | gas | 0.55 | simple asphyxiant; flammable 5 to 15% | none until oxygen is displaced; an explosion with a lamp | the bilge, swamps, mines | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| s | Sulphur (brimstone) | S8 | 256.52 | solid | - | fuel: burns to SO2 | - | the stinkpot, the match, the powder mill, the brimstone cure | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| c | Charcoal (carbon) | C | 12 | solid | - | fuel: burns to CO2, or CO when starved | - | the brazier, the galley, the powder mill, the smith | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| kno3 | Saltpetre (potassium nitrate) | KNO3 | 101.1 | solid | - | oxidiser (GOODS row 39) | - | the powder | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| ethanol | Alcohol (spirit of wine) | C2H5OH | 46 | liquid (vapour pressure 59 mmHg) | 1.6 | neuroactive (NEUROLOGY row); flammable | the drink; its vapour in a still-house is a fire risk | rum, brandy, arrack | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| pb | Lead | Pb | 207.2 | solid (dissolves into rum and cider from still worms and pewter) | - | systemic toxin (the dry gripes; NEUROLOGY burden) | by ingestion (MEDICINE) | stills, pewter, shot | Historical | rex (the substance and its mechanism class, 2026-10-29); proposed (thresholds as placeholders) |
| tagged | A tagged substance (template) | as written | as written | as written | as written | as written | its own thresholds | the story keeper's | Fantasy \| Science Fiction \| Mythological | **open** |
<!-- /table -->

<!-- table:chemistry.reactions -->
*The first reactions (combustion, fermentation, rot; and a set that shows the engine does not care what year it is)* (science; confidence medium; source: Stoichiometry is exact; rates and conditions are placeholders. Black powder: 75% KNO3, 15% charcoal, 10% sulphur by mass; about 43% of products are gas (CO2, N2, CO, H2S, H2, CH4), 56% solids (potassium salts), about 330 cm3 of gas per gram; the products do not follow one simple equation (CHM-BP). Thermodynamic possibility is not kinetics: a reaction needs its conditions (ChatGPT's point, kept).)

| Id | Reaction | Reactants | Products | Conditions | Rate (placeholder) | Heat | Where | Mark |
|---|---|---|---|---|---|---|---|---|
| comb_c_full | Charcoal burning in plenty of air | C + O2 | CO2 | minimum temperature 400 C; oxygen over 15% | by fuel surface and draught (the game's rule; proposed) | -393.51 kJ/mol; about 32.8 MJ/kg | the galley, the smith | rex (the reaction, 2026-10-29); proposed (rates) |
| comb_c_starved | Charcoal burning starved of air | 2 C + O2 | 2 CO + heat | oxygen under 15% or a shut space | open | 10 MJ/kg | the brazier, a smouldering hold | rex (the reaction, 2026-10-29); proposed (rates) |
| comb_wood | Wood and tar burning | wood + O2 | CO2, H2O, CO (10% if smoky), soot, tars, heat | ignition; spreads by heat | open | 15 MJ/kg | a ship on fire | rex (the reaction, 2026-10-29); proposed (rates) |
| comb_s | Sulphur burning | S + O2 | SO2 + heat | ignition over 250 C | open | 9 MJ/kg | stinkpots, the match | rex (the reaction, 2026-10-29); proposed (rates) |
| black_powder | Black powder deflagration | KNO3 + C + S (75:15:10) | gases 43% (CO2, N2, CO, H2S trace, H2, CH4) 330 cm3/g; solids 56% (K2CO3, K2SO4, K2S); water 1% | a spark, a match; confinement makes the bang | open | 3 MJ/kg | the guns, the magazine, a grenade | rex (the reaction, 2026-10-29); proposed (rates) |
| ferment | Fermentation (the brewer's and the still-house's first step) | sugars | ethanol + CO2 | yeast, 20 to 30 C, days | open | small | GOODS brewing and distilling; a CO2 source for GAS_DYNAMICS | rex (the reaction, 2026-10-29); proposed (rates) |
| rot | Anaerobic rot (the bilge) | organic matter | CH4, H2S, CO2 | wet, no air, warm | open | - | the bilge, the stores | rex (the reaction, 2026-10-29); proposed (rates) |
| oxygen_calx | Oxygen from the red calx of mercury | HgO (red precipitate, an apothecary's good) | Hg + O2 | heat over 500 C: a burning lens in sun, or a strong fire on a retort; collect over water or mercury | open | absorbs heat | Priestley 1774 (Scheele 1771 to 72 unpublished); Lavoisier named it 1777. Every piece is within 1700's reach: a Time Anomaly if done | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| hydrogen_acid | Hydrogen from iron and spirit of salt (or oil of vitriol) | Fe + 2 HCl | FeCl2 + H2 | room temperature; collect over water (Hales 1727 trough, or any jar in a tub) | open | small | Cavendish 1766 ('inflammable air'); Boyle made it in 1671 without knowing it: Historical as a phenomenon, anomaly as an identified element | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| phosphorus_urine | Phosphorus from urine | urine evaporated, charcoal, strong heat in a retort | P4 (white phosphorus) + ... | red heat (over 1,000 C) in a retort with a receiver under water; days of evaporation; about 60 buckets of urine per ounce | open | endothermic | Brand 1669 (Hamburg): Historical for the period; the first element discovered by a known person | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| chlorine_scheele | Chlorine from salt, manganese ore and oil of vitriol | NaCl + MnO2 + H2SO4 | Cl2 + MnSO4 + Na2SO4 + H2O | gentle heat in a retort; the gas is heavy, green, deadly (an ATMOSPHERE scenario) | open | small | Scheele 1774; bleaching (Berthollet 1785). All three reagents period goods: an anomaly within reach, and a laboratory accident waiting | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| ether_cordus | Sweet oil of vitriol (ether) from spirit of wine and oil of vitriol | C2H5OH + H2SO4 | (C2H5)2O + H2O | distil at 130 to 140 C; flammable vapour | open | small | Valerius Cordus 1540; the anaesthetic use 1846 (Morton): the substance Historical, its use an anomaly if a 1700 surgeon learns it (MEDICINE: surgery without pain) | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| voltaic_pile | A voltaic pile from zinc and copper discs in brine | Zn + Cu + brine | a current; ZnCl2 at the zinc | stack 20 to 60 pairs; brine-soaked cloth or leather | open | - | Volta 1800. Both metals are GOODS goods (voyage iron is iron; zinc arrives as spelter and in brass: open whether pure zinc is obtainable in 1700); an anomaly if someone knows the stack | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| water_electrolysis | Water split by a current | H2O + a current | H2 + O2 | a pile (voltaic_pile); electrodes of gold, platinum or charcoal | open | absorbs energy | Nicholson and Carlisle 1800 | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| soap | Soap from fat and lye | fat + lye (potash from wood ash) | soap + glycerol | boiling for hours | open | small | antiquity: Historical; the Castile soap of GOODS row 98 | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| calomel | Calomel (mercurous chloride) by sublimation | Hg + HgCl2 (corrosive sublimate), or Hg + salt + vitriol | Hg2Cl2 | sublimation in aludels, 400 C | open | - | the apothecary's purge, period; the pox cure's cousin | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| aqua_fortis | Aqua fortis (nitric acid) from saltpetre and vitriol | KNO3 + H2SO4 (or green vitriol heated) | HNO3 + KHSO4 | distil from a retort at 100 to 200 C; the fumes are deadly (NO2: an ATMOSPHERE species to add) | open | - | medieval; the assayer's parting acid (gold from silver): Historical | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| unknown | A reaction the database does not hold | whatever the player combines | unknown | whatever the apparatus reaches | open | - | the engine answers 'unknown', records the attempt in the journal, and the belt adds the record if the chemistry is real | rex (the reaction belongs in the database, 2026-10-29); proposed (rates, conditions as placeholders) |
| (general) | Any reaction the engine will later hold: metallurgy (smelting, the forge), cooking (Maillard, caramel), corrosion (rust, verdigris), tanning, dyeing (indigo vats), the apothecary's preparations (calomel, lunar caustic, spirit of salt) | by record | by record | temperature, pressure, catalyst, contact time | open | by record | GOODS recipes as the first list of what the engine must eventually express | open (scope: whether recipes become reactions) |
<!-- /table -->

- **[history]** The reactions include the period's own (aqua fortis, calomel, soap, fermentation, black
  powder, Brand's phosphorus of 1669) and the set that shows the engine ignores the year: oxygen from the
  red calx with a burning lens (1774, reachable in 1700), hydrogen from iron and acid over water (1766;
  Boyle made it in 1671 without a name), chlorine from salt, manganese and vitriol (1774; deadly), ether
  from spirit and vitriol (1540, its anaesthetic use 1846), the voltaic pile (1800) and water split by it.
  Each is a Time Anomaly if performed and identified in 1700.

## 6. Scope

<!-- table:chemistry.scope -->
*Scope: universal engine, small first database (Rex, 2026-10-29)* (model; confidence high; source: ChatGPT's position (outside AI): the engine's capability is not the game's need at any moment; the pirate period must not size the architecture. The keeper's caution: replacing GOODS.md's 183 recipes with reactions is a redesign of the economy's crafting and a decision of its own. Both recorded.)

| Statement | Status | Mark |
|---|---|---|
| The engine is universal: the game is 1700, the chemistry is not (Rex's own words via ChatGPT, 2026-10-29). Historical availability belongs to the world, economy, technology and crafting layers, never to the chemistry | decided | rex (2026-10-29) |
| The substance and reaction schemas are general: solids, liquids and gases; any route; any provenance; every domain in the domains table is a supported kind of record | established | rex (2026-10-29) |
| The database starts small (16 substances, 18 reactions) and grows by records; an unsupported reaction is 'unknown', never impossible | established | rex (scope), proposed (the honesty rule) |
| Equipment is the limiter: the assembly pipeline (SCIENTIFIC_EQUIPMENT 3) decides whether an attempt runs; a tagged anomalous piece makes its processes possible at once with no change here | decided | rex (2026-10-29) |
| Crafting skill affects the minigame's control (temperature, timing, handling), never the chemistry; a player who knows a procedure may attempt it without a recipe; poor character skill makes it hard to execute | decided (GOODS 3c and 3f already) | **Rex** |
| A discovery made before its historical date is a Time Anomaly in the journal, real all the same | decided | rex (2026-10-29) |
| Whether GOODS.md's 183 recipes become reactions of this engine (they can stay as the economy's shorthand over it) | not decided; the economy's lane and Rex's | open (Rex, 2026-10-29: stays open) |
| Who keeps CHEMISTRY.md and the science folder after this | not decided | **open** |
<!-- /table -->

## Open for Rex

1. Whether `GOODS.md`'s recipes become reactions of this engine, or stay as the economy's shorthand over
   it (Rex: stays open).
2. Who keeps the science folder.
3. Whether pure zinc (for a pile) is obtainable in 1700 (spelter arrived from the East; brass holds it):
   a GOODS question.
4. Every rate, constant and threshold is a placeholder; the database's growth is the belt's.

## Sources

`../SOURCES.md` keys CHM-* and EQ-*: the element-discovery timeline; carbon monoxide and hydrogen sulphide
thresholds; black powder's products; Lemery's *Cours de chymie* (1675) as the period's own textbook;
standard chemistry for the rest (Atkins; the CRC Handbook), not opened this session.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened under `world/`: the schema, 16 substances, 7 reactions, scope held to the period | keeper |
| 2026-10-29 | Rex stamped the schema, database and scope as his; recipes-as-reactions left open | Rex |
| 2026-10-29 | Rex stamped the science folder's structure as his (domains, the reaction record, the honesty rule); numbers placeholders | Rex |
| 2026-10-29 | Rex's correction: the engine is universal; moved to `science/`; the five separations, the domains table, the reaction record with kinetics and equilibrium, the honesty rule, eleven more reactions showing the engine ignores the year; ATMOSPHERE made a consumer | Rex / keeper |
