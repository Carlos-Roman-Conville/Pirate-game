# BODY.md: the hub (body-and-world keeper, 2026-10-29)

Rex's rule (`../combat/COMBAT.md` §4b, 2026-10-29): the body is a family of docs, each its own `.md`, all
feeding `BODY.md`. ChatGPT's principle, which the combat keeper agreed with and this keeper keeps: **BODY.md
coordinates, it does not hold every formula.** Each subsystem computes its own values; this file holds the one
shared body record and turns the subsystems' **states** into the **capabilities** `../STATS.md` and
`../combat/COMBAT.md` read, computed once, so no file invents a penalty of its own. Six separate penalties
for one physical reality is the thing this file exists to prevent.

**The family.**

| Doc | Owns | Produces |
|---|---|---|
| `PHYSIOLOGY.md` | metabolism, cardio fitness, sleep and the watches, heat, cold, hydration, exertion, recovery, ageing, acclimatisation | alertness, core temperature, water deficit, whole-body fatigue, aerobic capacity, the Endurance pool fill, age factors |
| `MUSCULAR.md` | the muscle groups, activation profiles, 3CC fatigue, training and the gym, muscle injuries | per-limb force, fatigue, condition; movement inputs; (computed) per-limb Strength |
| `NUTRITION.md` | calories, macros, micros, water and salt, reserves, body composition, deficiency clocks, boosts | energy balance, glycogen, fat and lean mass, nutrient stages, satiation |
| `MEDICINE.md` | the disease list, wounds, bleeding, pain and shock, period treatments, hygiene, healing, immunity | conditions with multipliers; wounds with dips; blood, fever, pain; permanent caps |
| `PSYCHOLOGY.md` | how body and social states push the existing meters (no meter of its own) | deltas to mood, madness, respect, the sliders |
| `../world/ENVIRONMENT.md` | climate, weather, wind, currents, exposure, sun, terrain | the day's weather; exposure at a place |
| `../world/ECOLOGY.md` | fish, turtle and game stocks, crops, soil, the calendar | food supply; what the water holds |
| `../world/POPULATION.md` | the aggregate settlement: births, deaths, migration, labour (never a named fate) | labour, the recruit pool, epidemics and famines as events |

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; marks **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables rendered from `data/body.json`. The
dashboard (`dashboard.html`, built from the same JSON by `build-body-data.py`) shows all of this with the
chains.

**Clock.** The day loop (`../PIRATE.md` §5): actions apply at once; the overnight tick (§4) integrates, in
the same sleep as the town's transformations (`../balance/ALIGNMENT.md` §5). Active characters run everything;
discovered ones are tracked as named characters with daily summaries; the rest are aggregates
(`POPULATION.md`). **(proposed, outside AI; kept)** Unvisited never means unaffected.

## 0. Rex's decisions this family preserves

| Decision | Where recorded | How this family honours it |
|---|---|---|
| Physical attributes per limb (Strength, Dexterity, Reflexes per arm and leg; legs together set movement); Endurance, Constitution, Agility whole-body (Rex, 2026-10-29) | `COMBAT.md` §4a, `STATS.md` §1 | the body record is per limb; capabilities are computed per limb (§2) |
| Head and torso carry no stats of their own; a hit dips the stats housed there (Rex, 2026-10-29) | `COMBAT.md` §4a | `MEDICINE.md` wounds dip exactly those; no head or torso stat exists here |
| Each counting muscle gets stats, split by head, trained by what you do; the gym simulator (Rex, 2026-10-29) | `COMBAT.md` §4b | `MUSCULAR.md` |
| Nutrition as real calories, macros, micros, water and salt; satiation, fat gain; scurvy emergent; boosts (Rex, 2026-10-29) | `COMBAT.md` §4c | `NUTRITION.md`; the scurvy chain (§5) |
| The eight functions as attributes (Si Eyesight, Se Perception, Ne Pattern Recognition, Fe Hearing, Ni Intuition, Ti Spatial Reasoning, Fi Poise, Te Efficiency) (Rex, 2026-10-29) | `COMBAT.md` §6a, `STATS.md` §1 | read as attributes; the body only scales them by alertness, wounds, fever, light (§2); Efficiency untouched except an open alertness factor |
| Endurance is the pool; Efficiency the spend; every action keeps a floor cost (Rex, 2026-10-29) | `COMBAT.md` §6a | the body sets the pool's ceiling and fill (§2), never the spend or the floor |
| Hidden genetic min–max per attribute; use raises, disuse lowers; injuries cut attributes and may lower the max (Rex, 2026-10-26; the max part proposed in STATS) | `STATS.md` §1 | `PHYSIOLOGY.md` §8 ageing, `MUSCULAR.md` disuse decay, `MEDICINE.md` caps |
| Skills never decrease, only rust (Rex, 2026-10-26) | `STATS.md` §2 | nothing here touches a skill |
| Stats are hidden (Rex, 2026-10-26) | `PIRATE.md` §7b | every mechanic names its visible face; the index in §7 |
| Death and resurrection by faction; states of being by who did it; storyline ends; frozen at death; crew can die in a fight; transformation through character endings (Rex, 2026-10-29) | `COMBAT.md` §4e, `STORY.md` | §6 profiles on the same architecture, all proposed beyond what Rex said |
| Provenance tags on the item screen, never in battle; engines read values, never tags (Rex, 2026-10-29) | `COMBAT.md` §4d | `NUTRITION.md` and `ECOLOGY.md` read values only |
| Personality static until something changes it; madness, hearts, respect, sliders, trust, memories as designed (Rex, 2026-10-26) | `PIRATE.md` §7, `STATS.md` §3–5 | `PSYCHOLOGY.md` pushes only |
| Fates (alive / dead / ghost; departed; freeze; the ghost rule) are the alignment engine's and the town keeper's (Rex, 2026-10-28) | `ALIGNMENT.md`, `UPGRADES.md` | `POPULATION.md` never writes one |
| The ship's condition and daily speed; duties and what skipping them does (Rex, 2026-10-26) | `PIRATE.md` §5a, `DUTIES.md` | no second ship-wear system; `ENVIRONMENT.md` only supplies wind and sea |

## 1. The shared body record

<!-- table:body.record -->
*The shared body record (one per active character; the fields each subsystem owns)* (model; confidence medium; source: ChatGPT's principle, agreed by the combat keeper and the brief: one shared character state, specialised modules; each subsystem computes its own values, BODY.md combines them (proposed, outside AI). Field names are the keeper's.)

| Field group | Owner doc | Fields | Mark |
|---|---|---|---|
| identity | STATS.md | sex, age, height_cm, personality type, genetic min and max per attribute (per limb: open) | rex (min-max), proposed (fields) |
| limbs | MUSCULAR.md, MEDICINE.md | per arm and leg: groups[] (development, fatigue, condition, stimulus), wounds[], caps (permanent), present (false after amputation) | rex (per limb), proposed (fields) |
| whole | PHYSIOLOGY.md | fitness, cardioFatigue, aerobic_today, sleepDebt, alertness, coreTemp, waterDeficit, fatigueDay, heatAcclim, seaLegs | proposed |
| fuel | NUTRITION.md | glycogen, fatMass, leanMass, fullness, hunger, appetite (per meal offered), energyBalance, pools{vit_c, b1, b3, a, iron, folate, b12, sodium, potassium, magnesium, zinc, ...} | rex (that they exist), proposed (fields; the fullness/hunger/appetite split on Rex's go-ahead 2026-10-29) |
| conditions | MEDICINE.md | conditions[] (id, stage, day, severity), bloodLoss, pain, immunity{} | proposed |
| mind (read, never written here) | PIRATE.md 7, STATS.md 3 to 5 | mood, madness, hearts, respect, sliders, trust, memories | **Rex** |
| being | COMBAT.md 4e, BODY.md 6 | stateOfBeing (human default), frozenAt (for resurrected forms) | rex (the forms), proposed (fields) |
| level | this file | simLevel: active \| discovered \| aggregate | proposed (outside AI) |
<!-- /table -->

- **[model] (proposed)** One record; each field group written by one doc and read by the others; the mind
  fields are the crew engine's and only read here. The record is the module boundary the memory rule asks
  for (modular, reusable): High Roller and the other sims can carry the same record with a different duty
  list and food list.

## 2. The capabilities

<!-- table:body.capabilities -->
*The capability outputs: the only numbers STATS.md and COMBAT.md read from the body* (model; confidence medium; source: Rex: physical attributes per limb; Endurance, Constitution, Agility whole-body; the function attributes in the head; hit locations dip what they house; Endurance the pool, Efficiency the spend (COMBAT.md 4a, 6a). STATS.md 4: performance = skill x attribute factor (today) x state. The formulas are the keeper's combination of the subsystem outputs.)

| Output | Formula (each factor 1.0 when healthy) | Inputs from | Mark |
|---|---|---|---|
| Strength_today(limb) | Strength_attr(limb) x forceAvailable(limb) x woundDip(limb) x coldFactor x hydrationFactor(Strength) x capFactor(limb). One pathway per impairment: forceAvailable carries muscle fatigue and muscle condition (MUSCULAR, strains); woundDip carries MEDICINE wounds (cuts, fractures, gunshot) and never also sets a muscle's condition; a wound to a limb counts once. Strength_attr computed from the limb's groups at full rest if Rex picks 'compute' (MUSCULAR 8), else stored | MUSCULAR, MEDICINE, PHYSIOLOGY | proposed |
| Dexterity_today(limb) | Dexterity_attr(limb) x woundDip(limb) x coldFactor(Dex) x painFactor(limb) x drinkFactor x muscleFatigueCap(limb). painFactor is pain's own pathway (coordination); the injury itself reaches Dexterity only through woundDip | MEDICINE, PHYSIOLOGY, STATS state | proposed |
| Reflexes_today(limb) | Reflexes_attr(limb) x alertness x drinkFactor x woundDip(limb) x coldFactor | PHYSIOLOGY, MEDICINE | proposed |
| Movement (tiles) | MUSCULAR 8 movement row: the weaker leg limits; x alertness x heatState x load | MUSCULAR, PHYSIOLOGY | proposed (outside AI shape), proposed (formula) |
| Endurance pool ceiling | Endurance_attr x (aerobic_today / 40) | PHYSIOLOGY 6 | rex (pool), proposed (formula) |
| Endurance pool now | ceiling x (1 - 0.5 fatigueDay) x alertness x hydrationFactor x glycogenFactor x feverFactor x bloodFactor x heatFactor | PHYSIOLOGY, NUTRITION, MEDICINE | rex (pool), proposed (formula) |
| Efficiency | Efficiency_attr (Te): untouched by the body except alertness x (Rex: the spend is Efficiency's; the keeper proposes only that exhaustion makes a character waste motion: x alertness, open) | STATS | rex (attribute), open (the alertness factor) |
| Constitution_today | Constitution_attr x bloodFactor x nutritionFactor x torsoWoundDip | MEDICINE, NUTRITION | proposed |
| Agility_today | Agility_attr x legsFactor (the worse leg's woundDip) x balanceFactor (glute_med, deep_core forceAvailable) x alertness x drinkFactor x seaLegs | MUSCULAR, PHYSIOLOGY | proposed |
| Head attributes today (Eyesight Si, Perception Se, Pattern Recognition Ne, Hearing Fe, Intuition Ni, Spatial Reasoning Ti, Wits, Memory, Taste and smell) | attr x alertness x headWoundDip x feverFactor x (Eyesight: light from the map, COMBAT 6; night blindness from vitamin A). alertness already contains the circadian factor (PHYSIOLOGY 3); it is never applied twice | PHYSIOLOGY, MEDICINE, NUTRITION, the map | rex (the attributes), proposed (factors) |
| Poise (Fi) | Poise_attr x painFactor? (open: Rex's Poise resists flinching from strikes; whether pain feeds it is MEDICINE open 3) | STATS | rex (attribute), open |
| Nerve | Nerve_attr x alertness x drinkFactor(+) (rum raises Nerve read, NUTRITION boosts: fiction, open) | STATS, NUTRITION | proposed |
| Work capacity (duties) | min over the duty's activation groups of (force available / force required) x (1 - 0.5 fatigueDay) x heatState x alertness; fatigueDay is 0 fresh and 1 exhausted, so the factor falls from 1.0 to 0.5 | MUSCULAR 3, PHYSIOLOGY | proposed |
| state (STATS 4) | mood x madness x drink only, each mapped to 0.5 to 1.0; computed here once. Fatigue, sickness and injury are NOT in state: they already reach performance through the attributes-today above (one pathway per impairment), so STATS 4's list of six becomes three here, the other three carried by the attribute factor | the crew engine (mood, madness), this file (drink) | proposed (STATS 4 proposed the shape; the split is the keeper's) |
| Accident chance (a fall, a burn, a cut) | base(place hazard, ENVIRONMENT) x (2 - alertness) x (1 + fatigueDay) x drinkFactor(-) x seaState | ENVIRONMENT, PHYSIOLOGY | proposed |
| Appearance (the visible face for the art keeper) | build (lean mass, fat mass), scars and missing parts, pallor (blood, anaemia), jaundice, sunburn, sweat, bandages | all | proposed |
<!-- /table -->

- **[model]** Every factor is 1.0 for a rested, fed, watered, healthy adult at a comfortable temperature;
  nothing here can exceed the attribute (boosts beyond 1.0 are `NUTRITION.md` §7 fiction, open). The
  factors are: `muscleFactor` (MUSCULAR: force available / force at development), `woundDip` (MEDICINE: the
  severity-scaled multiplier for the housed stat), `coldFactor` and `heatFactor` (PHYSIOLOGY core
  temperature table), `hydrationFactor` (PHYSIOLOGY hydration table), `alertness` (PHYSIOLOGY sleep ×
  circadian), `glycogenFactor` (NUTRITION), `feverFactor` and `bloodFactor` (MEDICINE), `painFactor`
  (MEDICINE pain table), `drinkFactor` (STATS state, drink), `capFactor` (permanent caps), `seaLegs`
  (PHYSIOLOGY §9).
- **STATS.md §4's "state":** computed here once (the row) and handed to `performance = skill × attribute
  factor (today) × state`, so the drunk furious surgeon is one formula in one place.
- **Mark:** Rex's structure; the formulas **(proposed)**.

## 3. The Endurance pool, in one place

      ceiling = Endurance_attr × (aerobic_today / 40)
      now     = ceiling × (1 − 0.5·fatigueDay) × alertness × hydrationFactor × glycogenFactor
                        × feverFactor × bloodFactor × heatFactor
      in a fight: now −= cost(action) × Efficiency's rule (COMBAT 6a); bleeding −= class amount per turn (MEDICINE 3)
      overnight: refills to ceiling × (sleep × hydration × glycogen factors)  (PHYSIOLOGY 7)

**(Rex)** the pool and the spend; **(proposed)** the formula. How the pool recovers *within* a fight is the
combat keeper's open item 6.

## 4. The overnight tick

<!-- table:body.tick -->
*The overnight tick: order of integration* (model; confidence medium; source: The game's day loop (PIRATE.md 5) and the alignment engine's sleep (ALIGNMENT.md 5): the town transforms at the same sleep. Order chosen so each step reads only finished inputs.)

| Step | Doc | What happens | Mark |
|---|---|---|---|
| 1 | world/ENVIRONMENT.md | tomorrow's weather drawn; tonight's exposure (wet, cold, mosquitoes) for where each character sleeps | proposed |
| 2 | world/ECOLOGY.md, world/POPULATION.md | stocks, fields and settlements advance one day (the visited town) or a batch (distant ones) | proposed |
| 3 | PHYSIOLOGY.md | sleep blocks from the roster; sleep debt and alertness; core temperature overnight; Banister decay plus the day's load; whole-body fatigue reset | proposed |
| 4 | NUTRITION.md | the day's meals summed; energy balance settled into fat and glycogen; nutrient pools filled or drained; deficiency clocks advanced; spoilage | proposed |
| 5 | MUSCULAR.md | fatigue recovers by 3CC R overnight; stimulus converts to development where the rest, protein and energy gates allow; disuse decay; DOMS | proposed |
| 6 | MEDICINE.md | exposure rolls (catching); conditions advance (incubation, course, death rolls); wounds heal by their modified clock; infection and sepsis rolls; blood regenerates | proposed |
| 7 | BODY.md | capabilities recomputed from the new states; permanent caps applied | proposed |
| 8 | PSYCHOLOGY.md | pushes on mood, madness, respect and the sliders handed to the crew engine | proposed |
| 9 | the crew engine and the town engine | their own sleep: moods, madness acts, the town's transformations (ALIGNMENT.md 5); the waking screen's events (a sail torn, a crew mate sick: DUTIES.md morning events) | rex (the overnight rule), proposed (order) |
<!-- /table -->

- **(Rex)** The overnight rule itself (the town transforms when the player sleeps; the morning opens with
  events). **(proposed)** the order.

## 5. The chains

<!-- table:body.chains -->
*Interaction chains the dashboard lets Rex inspect* (model; confidence medium; source: The brief's five chains plus the ones the docs make: each step names the doc, the variable and the direction, so a reader can follow a cause to a capability.)

| Chain | Steps (doc: variable -> effect) | Mark |
|---|---|---|
| Food -> muscles | NUTRITION: protein g/kg and energy balance -> MUSCULAR: conversion gate (x1.0 at 1.6 g/kg; x0.5 at 0.8; x0.1 at 0.4) -> development per group -> BODY: Strength_today(limb) -> STATS: every skill reading Strength; COMBAT: effort required per action | proposed |
| Sleep -> recovery | watch roster: hours slept -> PHYSIOLOGY: sleep debt, alertness -> MUSCULAR: sleep gate on conversion (x0.3 under 4 h) and R rest multiplier -> MEDICINE: healing x1.2 over 24 h debt -> BODY: Reflexes, head attributes, accident chance -> PSYCHOLOGY: mood -1/day, Volatile pressure | proposed |
| Temperature -> hydration | ENVIRONMENT: WBGT at the place -> PHYSIOLOGY: sweat rate 0.3 to 2.5 L/h, core drift -> waterDeficit % -> hydration thresholds (2%: Endurance x0.85) -> NUTRITION: sodium pool -1 g per litre -> MUSCULAR: cramp; MEDICINE: heat exhaustion, heat stroke -> BODY: Endurance pool, work capacity | proposed |
| Disease -> physical capacity | MEDICINE: exposure (hygiene x season x place) -> catch roll -> condition stage -> feverFactor, appetite x0.5, hydration drain -> NUTRITION: intake down, pools drain -> PHYSIOLOGY: alertness, aerobic x0.8 (anaemia) -> BODY: Endurance pool, work capacity, head attributes -> PSYCHOLOGY: mood -2/day; the surgeon's report | proposed |
| Injuries -> combat | COMBAT: hit location and damage -> MEDICINE: wound (kind, severity, bleeding class, pain) -> dips on the housed stats (Rex: arm, leg, head, torso) -> bleeding drains the Endurance pool per turn; pain and blood trigger shock (Nerve) -> BODY: Strength/Dexterity/Reflexes_today(limb), movement, head attributes -> COMBAT: accuracy, parry, movement; after: healing clock, infection, permanent caps | proposed |
| Scurvy, start to finish | GOODS: stores with no fresh food -> NUTRITION: vitamin C pool 1,500 mg draining 3%/day -> day 40 to 60: PSYCHOLOGY mood -1/day (lassitude) -> day 60 to 90: MEDICINE scurvy stage 2 (bleeding gums in dialogue; healing x3; old wounds reopen) -> day 90+: stage 3, death rolls -> a port with limes: pool refills, fit in a week | rex (the mechanism), proposed (the clock) |
| Work -> fitness -> the pool | DUTIES: a season on the pumps -> PHYSIOLOGY: MET-hours -> Banister fitness (42-day) and fatigue (7-day) -> aerobic_today -> Endurance pool ceiling; MUSCULAR: the pumping profile -> back, arms, grip development | proposed |
| Weather -> the ship -> the body | ENVIRONMENT: a gale -> PIRATE 5a: all hands, sail wear, leaks -> no sleep (PHYSIOLOGY debt), wet cold nights (core temperature), falls x3 (MEDICINE fractures) -> BODY: next day's work capacity down while the pumps need it most | proposed |
| Age -> everything | PHYSIOLOGY ageing: the maximum of each attribute falls on its curve -> STATS: the current value capped -> MUSCULAR: conversion x0.6 at 60 -> MEDICINE: healing x1.3 over 50 -> but skills never fall (Rex): the old surgeon | rex (skills), proposed (curves) |
| A death far away (the butterfly) | POPULATION: an epidemic in a town the crew visited -> MEDICINE: exposure for whoever was there -> a named character's fate: NOT this family's to write; the event is handed to the fate owners (BALANCE C5 32) | rex (fates are theirs), proposed (the handoff) |
<!-- /table -->

The dashboard's "Chains" view follows each of these step by step with the tables behind each step.

## 6. States of being

<!-- table:body.states_of_being -->
*States of being as physiological profiles on the same architecture* (fiction; confidence low; source: Rex (COMBAT.md 4e, 2026-10-29): resurrection by faction ends the storyline and gives a stronger, frozen form: Atlanteans a mecha AI (memories, thoughts, beliefs frozen; mecha upgrades), the ghost faction a ghost, free pirates a voodoo zombie, Imperials an angel, merfolk undecided; the Cthulhu cult makes a fish person, the devil cult a demon, a chaotic-evil kidnapping leaves them missing; ghosts have their own physiological needs and desires. Each form as a profile on the body architecture is ChatGPT's (proposed, outside AI). The profile contents below are the keeper's placeholders for the story keeper and Rex.)

| State | Who gives it (Rex) | Fuel (NUTRITION) | Sleep (PHYSIOLOGY) | Heat and cold | Disease and wounds (MEDICINE) | Muscle and training (MUSCULAR) | Mind (PSYCHOLOGY) | Stronger how (Rex: a stronger form) | Mark |
|---|---|---|---|---|---|---|---|---|---|
| Human | birth | food, water, salt: all of NUTRITION | 8 h; the watches | the full model | the full list | trains by what you do | the full crew psychology | - | rex (default) |
| Ghost | the Ghost Fleet, or death by the ghost rule | 'ghosts have their own physiological needs and desires' (Rex): proposed a need for attachment (a place, a person, an unfinished thing) that drains like hunger | none; stronger at night (fiction) | none | no disease; no bleeding; 'wounds' are dispersal, recovered by returning to the attachment | fixed at death; no training | frozen at death (Rex); reads only the pushes that touch its attachment | passes walls (COMBAT 6: a detection and movement rule, combat keeper's); cannot carry | rex (exists), open (needs) |
| Mecha AI (Atlantean) | the Atlanteans | power: a charge the Atlanteans sell or a sun-fed cell (fiction, open) | none; a shutdown to recharge | overheats under heavy work (a heatState of its own); cold-proof | no disease; damage is wear, repaired with parts (an economy good, open), not healed | no muscle: fixed strength per limb, upgraded by parts (Rex: mecha upgrades) | memories, thoughts, beliefs frozen (Rex); no mood pushes | strength and senses by upgrade; immune to fatigue | rex (form), open (fuel, parts) |
| Voodoo zombie (free pirates) | the Free Pirates | ritual upkeep (ChatGPT): a rite each week by a houngan, else decay | none | indifferent | no pain, no shock; rots: a decay clock in place of healing; no disease | fixed; cannot train; does not tire | frozen; obeys | never tires; no pain | rex (form), open (upkeep) |
| Angel (Imperials, the orderly) | the Imperials | 'divine energy by alignment' (ChatGPT): drains when acting against the orderly good, refills in a church | little | none | immune; heals fast; harmed by the unholy (fiction) | fixed high | frozen; serene | heals, flies (open), strength | rex (form), open (everything else) |
| Demon (the devil cult) | the Devil Cult kills them | 'infernal sustenance' (ChatGPT): a need the story keeper writes | none | fire-proof; cold-weak | immune; harmed by the holy | fixed high | memories kept, wants otherwise? (ChatGPT's question; Rex's mecha answer settles only the Atlanteans) | strength, fear (Poise damage on others, combat keeper's) | rex (form), open |
| Fish-person (the Cthulhu cult / Abyssal) | the Cthulhu cult transforms them; the INTJ's test subjects | fish; must stay wet (NUTRITION water inverted: dries out of water, a hydration clock in reverse) | normal | heat-weak out of water | heals in water; period diseases of the sea (none modelled); wounds normal | trains; swims at x2 | frozen if it came by death; living if transformed alive (ChatGPT: a transformation need not be a death) | swims, breathes water, sees in the dark (Eyesight at night) | rex (form), open |
| Merfolk's form | the merfolk | open | open | open | open | open | open | open | open (Rex: not decided) |
| Missing (kidnapped by a chaotic-evil actor) | the Criminal Pirates or any chaotic-evil kidnapper | - | - | - | - | - | no ghost; the person is gone; whether they can return is the story keeper's | - | rex (exists), open (return) |
<!-- /table -->

- **(Rex, 2026-10-29)** The forms and who gives them; frozen memories for the mecha; ghosts have their own
  needs. **(proposed, outside AI)** each form as a profile on this architecture, exposing the same
  capabilities to the economy (can they do the task, what do they consume). **(proposed)** the cell
  contents, every one for the story keeper and Rex to replace. **(open)** the merfolk's form; whether a
  transformed living person (the INTJ's subjects) keeps a living mind; what each form does on the grid
  (combat keeper).

## 7. The visible faces

<!-- table:body.visible_faces -->
*How hidden stats surface (the one-line index)* (fiction; confidence medium; source: Rex: stats are secret; the player infers them from conversation, gossip and watching people work (PIRATE.md 7b). Every mechanic in the family names its face; this table is the index.)

| Channel | What it shows | Owner | Mark |
|---|---|---|---|
| The surgeon's morning report | who is sick or hurt, what he calls it, what he did, his guess; honest only to his skill | MEDICINE (text), the surgeon's Surgery skill | proposed |
| The quartermaster's count | days of food and water; the ration; stores spoiling | NUTRITION, the economy | proposed (stores are visible, stats hidden) |
| The navigator's line | the glass, the swell, the wind, days to port | ENVIRONMENT | proposed |
| Dialogue on keywords (Rex's Morrowind style) | bleeding gums, aches, hunger, fear, tiredness, grudges | PSYCHOLOGY, MEDICINE, NUTRITION | rex (the channel), proposed (lines) |
| Gossip | 'Jimmie fixed James's leg'; 'that port has the fever' | PIRATE 7b | **Rex** |
| Watching people work (duty results) | slow on the rigging; the line slipped; the lift did not come up; asleep on watch | MUSCULAR, PHYSIOLOGY | rex (the channel), proposed (results) |
| The portrait and sprite | build, scars, bandages, pallor, jaundice, sweat, a peg leg | the art keeper | open (art) |
| The fight | the Endurance pool as 'wind' (open: a bar or not); hit locations in text; a flinch | COMBAT | **open** |
| The gym | the one place a body number may show: a lift that comes up or not | MUSCULAR 7 | **open** |
<!-- /table -->

## 8. Simulation levels and cost

- **(proposed, outside AI; kept)** Active (full detail: the crew and the scene), discovered (named
  characters tracked with daily summaries), aggregate (unvisited settlements as counts). **(keeper)** The
  day-tick sims are cheap; the cost is data: an activation profile per duty and action, a food profile per
  edible good, a period disease list, a weather table per region. Each is a Composer-scale data task once Rex
  keeps the rules (the combat keeper's note, item 5). The JSON under `data/` is where that data lands.

## 9. What lives elsewhere, on purpose

- Ship wear: `../PIRATE.md` §5a and `../DUTIES.md` (no second system).
- Sanitation: the exposure side in `MEDICINE.md` §6; the place side (wells, latrines, drains) is the town
  keeper's (`../town/UPGRADES.md`).
- Fire and structural damage: an event with the siege and ship events (PLAN unit 29), not a system doc.
- The combat reading of fatigue, injury, hunger, thirst and deficiency as battle penalties, and consumables
  in a fight: the combat keeper's open item 14; this family gives the capability numbers it reads.
- The gym as a town place: the town keeper; the gym minigame: Rex.
- Which remedies are goods and knowledge: `../economy/GOODS.md` §1k, §3f.

## 10. The audit of 2026-10-29 (ChatGPT, outside AI): what was fixed, what is proposed, what is Rex's

Rex pasted a systems audit of the family the day it was filed. It is outside AI; its findings are recorded
here the house way. **Fixed the same day (the keeper agreed they were errors):**

- **Double counting.** One pathway per impairment, written into the capability table (§2): muscle fatigue
  and strains reach a limb through `forceAvailable`; wounds through `woundDip`; pain through `painFactor`
  (coordination) only; the `state` multiplier is now mood × madness × drink, since fatigue, sickness and
  injury already arrive through the attributes-today. Work capacity used `fatigueDay` the wrong way round
  (a fresh body scored zero); it is `(1 − 0.5·fatigueDay)`. Circadian sat inside `alertness` and was applied
  again to the head attributes; once now.
- **Units and time.** MET costs are kcal/kg/h against the character's own resting rate, not RMR × MET
  (`PHYSIOLOGY.md` §1); Banister loads are normalised and the clamp calibrated (§2); the 3CC fatigue
  equations integrate in seconds with the closed form for the night (`MUSCULAR.md` §4); vitamin A's pool
  and need are both in mcg RAE; the scurvy stage days are the formula's output (day 53 from a 1,500 mg
  pool), not a second timer.
- **Biology and history.** Epidemic typhus is louse-borne; the rat flea carries murine typhus, now its own
  row. Syphilis and gonorrhoea are two rows. The seasoning is an immunity state, not a disease. Heat stroke
  may still sweat (exertional). Immersion times carry their variance. A spoiled food keeps its energy and
  loses its vitamins instead of "half its energy". Overtraining no longer zeroes a day's adaptation;
  conversion scales with rest and carries over.
- **Disease onset by cause.** Each category now needs its real source present (a mosquito population, a
  louse, a flea, foul water, a case aboard, a wound, a pool crossing) with its own onset rule, under one
  shared state interface (`MEDICINE.md` §1); blood loss, shock, infection and sepsis are four processes
  (§3), bleeding by rate × time.
- **The build.** Floats render as written (0.00058 no longer rounds to 0.001); the script validates row
  widths, kinds and marks. The cold-water chart no longer draws "indefinite" as 24 hours.

**Proposed by the audit, recorded, not adopted (Rex's call):**

- **A nervous-system layer** (sensory input → neural processing → motor planning → motor execution →
  learning) under `PHYSIOLOGY.md` or a `NEUROLOGY.md`, beneath the eight function attributes, so that
  speed and accuracy come from coordination and practice rather than muscle. The keeper's view: the
  function attributes and the skills already stand for processing and learned technique by Rex's design
  (`COMBAT.md` §5, §6a); a physiological layer under them would be new structure, and the per-limb
  Reflexes attribute is where "motor execution" already lives. Worth a doc if Rex wants the realism; not
  started.
- **Homeostasis** (blood glucose, electrolyte regulation, kidney, endocrine, immune, oxygen transport,
  digestion) as a regulating system instead of independent meters; **tendon capacity, joint range,
  contraction velocity, bone adaptation** in `MUSCULAR.md`; **the remaining vitamins and minerals,
  absorption, protein quality, essential fatty acids, and fullness vs appetite vs hunger** in
  `NUTRITION.md` (added as proposed rows on Rex's go-ahead the same day: §1, §2, §2a there); **organ injuries, respiratory progression, dental and
  reproductive health, a larger disease catalogue** in `MEDICINE.md`; **learning consolidation,
  habituation, addiction, trauma, cognitive fatigue, attention, stress adaptation** as further inputs in
  `PSYCHOLOGY.md`; **adaptive expenditure** in place of the fixed 7,700 kcal/kg; a homeostatic
  sleep-pressure model in place of the debt table.
- **A Simulation Laboratory tab** on the dashboard that runs the equations on a persistent character and
  shows the values evolve. This is engine work, which the brief for this family excluded ("do not implement
  the simulation engine"); it is the natural next belt unit once Rex keeps the rules, and the JSON is
  shaped for it.
- **Three layers** (biological mechanisms → functional capabilities → game systems) named explicitly. The
  family already has that shape (the subsystems → `BODY.md` §2 → `STATS.md` and `COMBAT.md`); the audit
  asks for the mechanisms between the first two layers to be complete. That is the list above, and it is
  Rex's to size.

The audit's scores (architecture 8, physiology 6, musculature 6, nutrition 5, medicine 6, psychology 5,
integration 5, out of 10) are its own qualitative judgement, recorded as such.

## Open for Rex (the family's list, gathered)

1. **Named-character mortality** from disease, accident, weather and far-away butterflies (full, protected,
   conditional with succession, story-only): `MEDICINE.md` open 1, `POPULATION.md` §4, `BALANCE.md` C5 32.
   The sim runs under any of them; the balance keeper needs the answer.
2. **Replace or compute:** does muscle replace per-limb Strength or is Strength computed from it
   (`MUSCULAR.md` §8; the keeper recommends compute).
3. **Genetic min–max per limb**, and whether groups vary inside the limb's range.
4. **The Endurance pool shown as a bar** ("wind") in a fight, or hidden like the rest.
5. **Efficiency and exhaustion:** whether alertness touches the spend at all (§2 row).
6. **Pain and Poise:** apart (as drafted) or linked.
7. **Which diseases, nutrients, species and crops exist** in the game (each doc's list is the period's;
   Rex cuts).
8. **Real months or seasons**; whether characters age in play; whether children exist.
9. **States of being:** each form's needs and what a transformed living person keeps.
10. **Habit** (rum, laudanum, tobacco) as a system or not.
11. Every number in the family is a placeholder for the simulator; the facts are sourced in
    `../SOURCES.md`.
12. **From the audit (§10):** a nervous-system layer; homeostasis; the full nutrient list; the deeper
    muscular, medical and psychological mechanisms; a simulation laboratory on the dashboard (engine
    work). How far the realism goes is Rex's; the structure takes each as rows or a doc without change.
13. `STATS.md` §4's "state" list (mood, madness, drink, fatigue, sickness, injury) is read here as three in
    `state` and three through the attributes (§2), to count each once; `STATS.md` has no keeper, so the
    sentence there still says six. Rex's say, or the keeper's one-line edit.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; the record, the capabilities, the pool, the tick order, ten chains, states of being, visible faces, levels, the gathered open list; `data/body.json` | keeper |
| 2026-10-29 | ChatGPT's audit (outside AI) recorded in §10: double counting, units, biology and build errors fixed across the family; its expansions (nervous system, homeostasis, full nutrients, a simulation lab) recorded as proposed for Rex | keeper |
