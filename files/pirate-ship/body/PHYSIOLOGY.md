# Physiology: metabolism, fitness, sleep, heat and cold, exertion, ageing (body-and-world keeper, 2026-10-29)

One of the body docs that feed `BODY.md` (Rex, 2026-10-29, `../combat/COMBAT.md` §4b). This file owns the
whole-body engine: how much energy a day costs, how fit the heart and lungs are, how sleep and the watches
wear a character down, what heat, cold and water do, and how the body ages. It produces **states**; `BODY.md`
turns states into the capabilities `STATS.md` and `COMBAT.md` read. It never writes a penalty of its own into
those files.

**How to read.** Every statement is one of four kinds, tagged in square brackets:

- **[science]** established physiology, with a source and a confidence level;
- **[history]** what the period (1650–1730) did or recorded;
- **[model]** the simplified simulation rule this doc proposes (a formula, a table, a threshold);
- **[fiction]** a game mechanic with no claim to realism.

Design marks are the house ones: **(Rex, date)** decided; **(proposed)** this keeper's suggestion, **(proposed,
outside AI)** ChatGPT's; **(open)** undecided. Nothing proposed is canon until Rex says so. Tables between
`<!-- table -->` markers are rendered from `data/physiology.json` by `build-body-data.py`; edit the JSON.

**Clock.** The game's day loop (`../PIRATE.md` §5): actions during the day apply their costs at once; the
**overnight tick** at sleep (the same tick as the town's, `../balance/ALIGNMENT.md` §5) integrates the day and
restores what sleep restores. Active characters (the crew, the people in the scene) run the full model; distant
populations get the aggregate daily update in `../world/POPULATION.md`. (proposed, outside AI: the levels;
keeper agrees.)

## What Rex has decided that this file must respect

- The body is per limb; Endurance, Constitution and Agility are whole-body; head and torso carry no stats of
  their own **(Rex, 2026-10-29)**. This file's whole-body states (fatigue, heat, sleep, hydration) therefore
  feed the whole-body stats and the Endurance pool, and reach the limbs only through `MUSCULAR.md`.
- **Endurance is the pool of points in a fight; Efficiency is the spend (Rex, 2026-10-29).** This file sets
  the pool's **ceiling and today's fill** (§6); it never touches the spend.
- Nutrition is real calories, macros, micros, water and salt **(Rex, 2026-10-29)**: the energy side of this
  file reads `NUTRITION.md`; it keeps no food rule of its own.
- Stats are hidden **(Rex, 2026-10-26)**: every mechanic below names its visible face.
- Skills never fall, only rust **(Rex, 2026-10-26)**; ageing here touches attribute maxima, never skills.

## 1. Metabolism: what a day costs

**Inputs:** sex, age (years), height (cm), body mass (kg, from `NUTRITION.md` body composition), the day's
activities with durations (the duty roster, `../DUTIES.md`; fights; the gym), air temperature and wet state
(`../world/ENVIRONMENT.md`). **Outputs:** energy expenditure (kcal/day), water need (L/day), the whole-body
fatigue load (MET-hours).

- **[science] Resting metabolic rate**, Mifflin–St Jeor (1990), within about 10% for most healthy adults
  (confidence high; PHY-MSJ):

      RMR_kcal = 10·mass_kg + 6.25·height_cm − 5·age_years + 5   (men)
      RMR_kcal = 10·mass_kg + 6.25·height_cm − 5·age_years − 161 (women)

- **[science] Total expenditure** = RMR × PAL for a day described only by its type (PHY-FAO). When the
  day's activities are known, each is costed in its own unit: one MET is defined as 1 kcal per kg per hour
  (3.5 mL O₂/kg/min), so

      kcal_activity = MET_i × h_i × mass_kg × (RMR / (mass_kg × 24))

  where the last factor (about 0.9–1.1) corrects the standard MET reference to this character's measured
  resting rate, since the compendium's 1 kcal/kg/h overestimates resting cost for heavy or old bodies
  (PHY-MET; the correction is the compendium's own advice). The day's total is the sum over its hours,
  sleep included at 0.95 MET. The period diet made this large: the Navy's 1677 ration gave something
  near 5,000 kcal a day when fully issued, beer the largest part of it ([history], PHY-RATION).
- **[model] Which one the sim uses (proposed):** the activity sum for active characters (their day is known
  from the duty roster), the PAL band for everyone else.

<!-- table:physiology.met -->
*Energy cost of ship work (MET, multiples of resting metabolism)* (science; confidence medium; source: Compendium of Physical Activities (Ainsworth et al.), standard reference; values are the nearest listed activity, not measured on sailors. PHY-MET)

| Activity (duty or action) | MET | Nearest compendium activity | Mark |
|---|---|---|---|
| Sleeping | 0.95 | sleeping | proposed |
| Standing watch, still | 1.5 | standing quietly | proposed |
| Walking the deck, light chores | 2.5 | walking 2.5 mph, light housework | proposed |
| Swabbing, picking oakum, mending sail (seated) | 2.5 | scrubbing floors / sewing | proposed |
| Helm in a seaway | 3 | boat handling, general | proposed |
| Cooking at the galley fire | 3.3 | cooking, moderate effort, standing | proposed |
| Fishing from the rail (handline) | 3.5 | fishing from boat, standing | proposed |
| Carpentry, caulking, coopering | 4.5 | carpentry, general | proposed |
| Climbing aloft, working the rigging | 8 | rock or rope climbing | proposed |
| Hauling lines, the capstan, pumping the bilge | 7 | heavy manual labour, shovelling / rowing vigorous | proposed |
| Rowing the boat, hard | 12 | rowing, competitive | proposed |
| Smithing | 6 | blacksmithing / forging | proposed |
| Swordplay, boarding fight | 10 | fencing / boxing, sparring | proposed |
| Gym regimen (lifting stones, barrels) | 6 | weight lifting, vigorous | proposed |
| Swimming | 8 | swimming, moderate | proposed |
<!-- /table -->

<!-- table:physiology.pal -->
*Physical activity level (PAL) bands used for the day's total* (science; confidence high; source: FAO/WHO/UNU 2004 energy requirements; PAL bands 1.2 to 2.4. PHY-FAO)

| Day type | PAL | What it looks like | Mark |
|---|---|---|---|
| Sick in a hammock | 1.2 | bed rest | proposed |
| In port, idle | 1.4 | sedentary or light | proposed |
| Ordinary sea day | 1.75 | active: watches, chores, some hauling | proposed |
| Hard sea day | 2.1 | storm, pumping, careening | proposed |
| Battle day | 2.4 | the top of the FAO band | proposed |
<!-- /table -->

- **[model] Thermal cost (proposed):** shivering adds up to +2 MET while core temperature is under 36 °C;
  working in heat adds +10% to the day's expenditure above WBGT 26 °C (the heart pumping for the skin).
  Confidence low: the shape is right, the numbers are placeholders.
- **Effects:** the kcal figure is the demand `NUTRITION.md` balances against intake; the MET-hours feed §6
  fatigue and the Banister load (§2); water need feeds §5.
- **Visible face:** the cook complains the crew eats more at sea; a thin crew mate after a hard voyage; "I
  could eat a horse" in dialogue after a pumping day.
- **Mark:** formulas **science**; their use here **proposed**.

## 1a. Ventilation demand (added 2026-10-29, the air layer)

<!-- table:physiology.ventilation -->
*Ventilation demand: how much air a body moves, and the drive* (science; confidence high; source: Minute ventilation about 6 L/min at rest rising near-linearly with oxygen demand to 100+ at maximal work; oxygen consumption 3.5 mL/kg/min per MET; the carbon dioxide drive doubles ventilation for each 5 mmHg rise in PaCO2 while the hypoxic drive wakes under about 60 mmHg PaO2 (standard respiratory physiology; PHY-VENT). The breathing drive itself is NEUROLOGY's (opioids and deep drink depress it).)

| Quantity | Formula or value | Unit | Reads | Mark |
|---|---|---|---|---|
| Oxygen demand | VO2 = 3.5 x MET x mass_kg | mL/min | PHYSIOLOGY 1 MET table | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Minute ventilation | VE = 6 + 0.025 x (VO2 - 250), capped by the profile's maximal capacity (ANATOMY 1a) | L/min | oxygen demand | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Inhaled dose of a gas | VE x concentration x minutes x uptake fraction (CHEMISTRY) | L or mg | GAS_DYNAMICS exposure | rex (the row's structure, 2026-10-29); proposed (numbers) |
| The carbon dioxide drive | VE x 2 per 5 mmHg of PaCO2 over 40 (the panting in a shut hold); over 70 mmHg the drive fails and sleepiness wins | - | CIRCULATION blood gas | rex (the row's structure, 2026-10-29); proposed (numbers) |
| The hypoxic drive | VE up when PaO2 falls under 60 mmHg (altitude, a low-oxygen hold); carbon monoxide gives no drive at all: the body does not notice (the silent killer) | - | CIRCULATION | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Work of breathing | at VE over 60 L/min, or airway resistance over 2, breathing itself costs: the Endurance pool x0.9; at resistance over 4 (smoke, SO2) x0.6 and the character stops working | - | ANATOMY 1a | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Breath-holding and drowning | a trained diver 1 to 2 minutes; a panicked man 30 seconds; water in the lungs ends transfer: CIRCULATION saturation falls to unconsciousness in 1 to 3 minutes, death in 4 to 6 (PHYSIOLOGY 5 immersion covers the cold side) | min | Swimming skill, Nerve | rex (the row's structure, 2026-10-29); proposed (numbers) |
<!-- /table -->

- **[model]** How much air a body moves is set here from the MET table; what the air contains is
  `../world/GAS_DYNAMICS.md`'s; what the lungs do with it is `ANATOMY.md` §1a's; the drive itself (and
  its depression by laudanum and drink) is `NEUROLOGY.md`'s breathing circuit. Carbon monoxide gives no
  drive at all, which is why the brazier kills in sleep.

## 2. Cardiovascular and respiratory fitness

**Inputs:** daily training load (MET-hours above 2 MET), age, sex, days of history. **Outputs:** `fitness`
(an index standing in for VO₂max, 20–65 mL/kg/min scale), `cardioFatigue`, today's aerobic capacity.

- **[science]** Aerobic capacity falls about 10% a decade from the late 20s in the untrained, 5–7% in the
  trained (confidence medium; PHY-AGE). Fitness responds to training with a fast fatigue and a slow gain
  (Banister impulse-response model, 1975/1990; confidence medium for the shape, low for any fixed constants;
  PHY-BAN).
- **[model] Banister fitness–fatigue (proposed):**

      fitness(t) = Σ_i load_i · e^(−(t−i)/τ_fit)        τ_fit = 42 days
      fatigue(t) = Σ_i load_i · e^(−(t−i)/τ_fat)        τ_fat = 7 days
      aerobic_today = ceiling(age, sex, genetics) × clamp(0.6 + k1·fitness − k2·fatigue, 0.6, 1.0)

  `ceiling` is the hidden genetic max of `STATS.md` Endurance for this character, scaled by the ageing curve
  (§8). **Since 2026-10-29 `aerobic_today` is oxygen delivery at maximal cardiac output
  (`CIRCULATION.md` §1): Banister fitness sets the maximal output, the heart's function and damage cap it
  (`ANATOMY.md`), haemoglobin and lung saturation scale it. So anaemia, heart failure and lung disease
  lower endurance through this one number.** **Calibration (proposed):** `load_i` is the day's MET-hours above 2 MET divided by 8, so an ordinary
  sea day scores about 1.0, a hard day 2.0, a sick day 0; with τ 42 and 7 the steady-state sums are then
  about 42 and 7 for a daily load of 1, so the multiplier is normalised as `k1 = 0.4/42` and `k2 = 0.4/7`
  (a long run of ordinary days settles the clamp at about 0.6 + 0.4 − 0.4 = 0.6 of ceiling, a run of hard
  days nearer 1.0 once fatigue decays, a month idle back to 0.6). The clamp's floor 0.6 is the untrained
  body, its ceiling 1.0 the genetic max; the simulator tunes the three numbers. The 42/7 constants are the
  TrainingPeaks convention, not a universal truth.

<!-- table:physiology.banister -->
*Cardiovascular fitness: the fitness-fatigue model constants* (model; confidence medium; source: Banister impulse-response model (Morton, Fitz-Clarke, Banister 1990): performance = base + k1*fitness - k2*fatigue, each an exponentially decaying sum of daily training loads. The 42-day / 7-day constants are the TrainingPeaks CTL/ATL convention, not a universal fit. PHY-BAN)

| Parameter | Value | Unit | Mark |
|---|---|---|---|
| tau_fitness | 42 | days | proposed |
| tau_fatigue | 7 | days | proposed |
| k1 (fitness gain) | 1 | ratio | proposed |
| k2 (fatigue weight) | 1.3 | ratio | proposed |
| Daily load | sum of MET-hours above 2 MET | MET-h | proposed |
| Age decline of the ceiling | 10 | % per decade from the late 20s (sedentary); 5 to 7 trained | proposed |
<!-- /table -->

- **Effects:** `aerobic_today` is the main input to the Endurance pool ceiling (§6, then `BODY.md`); long
  duties (pumping, a chase) draw on it; `MUSCULAR.md` reads it as the whole-body side of muscular endurance;
  `MEDICINE.md` lowers it during fevers and anaemia.
- **Visible face:** who is first to the masthead and still breathing easily; "He used to run up the shrouds;
  now he stops at the top to blow" after a month in port; a crew mate winded in a fight.
- **Mark:** **(proposed)**. Open for Rex: whether Endurance's genetic range is the ceiling here (it is the
  simplest reading of `STATS.md` §1).

## 3. Sleep and the watches

**Inputs:** hours slept (per night, from the watch roster and events), sleep quality (hammock vs deck, a
storm, pain, drink), time of day. **Outputs:** `sleepDebt` (hours), `alertness` (0–1), `circadian` factor
(0.78–1.0).

- **[science]** Adults need 7–9 h (National Sleep Foundation; PHY-SLEEP). Restricting sleep to 4 h a night
  for 14 nights produced lapses equal to three nights without sleep at all, and subjects did not feel as
  impaired as they were (Van Dongen et al. 2003; confidence high; PHY-VD). Short sleep raises injury odds:
  about 1.5× at 4 h or less vs 7 h (observational; PHY-SLEEP). Sleepiness on ships peaks on the night and
  early-morning watches, and the split sleep of a watch system adapts only partly (Akerstedt 2013; Colquhoun
  1988; confidence medium; PHY-WATCH).
- **[history]** Crews stood four hours on, four off, the bell every half hour ([history], `../DUTIES.md`);
  Roberts' articles put lights out at eight. So a sea night is two blocks of under four hours each, never a
  whole night. A sailor who was not on watch could still be turned up for all hands.
- **[model] Sleep debt (proposed):**

      debt += max(0, 8 − slept_effective);   debt −= max(0, slept_effective − 8);   debt ∈ [0, 60]
      slept_effective = Σ blocks × quality,   quality: hammock 1.0, split (watch) 0.85, deck in rain 0.6,
                                               in pain (MEDICINE pain ≥ 5) 0.7, drunk 0.8, storm 0.7
      alertness = table(debt) × circadian(hour)

<!-- table:physiology.sleep_debt -->
*Sleep debt and what it does (model derived from Van Dongen et al. 2003)* (model; confidence medium; source: Van Dongen, Maislin, Mullington, Dinges, Sleep 26(2) 2003: 14 nights at 4 h matched 3 nights of total deprivation; cumulative wakefulness beyond about 15.84 h a day predicted lapses. PHY-VD)

| Cumulative debt (hours below 8 h) | Alertness multiplier | Visible face | Mark |
|---|---|---|---|
| 0 to 4 | 1 | none | proposed |
| 4 to 12 | 0.92 | yawning in dialogue; slower on the rigging | proposed |
| 12 to 24 | 0.82 | misses a line in the duty minigame; short with crew mates | proposed |
| 24 to 40 | 0.7 | nods off on watch (event); a crew mate says they look dead on their feet | proposed |
| over 40 | 0.55 | equal to three nights without sleep: falls asleep standing; accident risk doubled | proposed |
<!-- /table -->

<!-- table:physiology.circadian -->
*Time-of-day alertness (the circadian factor)* (science; confidence high; source: Two-process model (Borbely 1982); maritime watch studies find sleepiness peaks on the night and early-morning watches (Akerstedt et al. 2013; Colquhoun 1988). PHY-WATCH)

| Ship's time | Factor | Note | Mark |
|---|---|---|---|
| 06:00 to 10:00 | 0.95 | morning rise | proposed |
| 10:00 to 14:00 | 1 | peak | proposed |
| 14:00 to 16:00 | 0.93 | post-meal dip (the afternoon watch, where the Navy study found the worst vigilance) | proposed |
| 16:00 to 22:00 | 1 | second peak | proposed |
| 22:00 to 02:00 | 0.88 | first watch | proposed |
| 02:00 to 06:00 | 0.78 | the trough: the middle watch | proposed |
<!-- /table -->

- **Effects:** `alertness` multiplies the head attributes (Eyesight, Perception, Hearing, Intuition, Wits,
  Memory) and Reflexes in `BODY.md`; it raises accident chance in duties (falls from the rigging, a cut in the
  galley); it feeds `PSYCHOLOGY.md` (irritability, mood); the lookout's detection range in
  `../combat/COMBAT.md` §6 reads it. The overnight tick (§7) repays it.
- **Visible face:** the duty report ("the lookout was asleep at the masthead"); yawns and short answers in
  dialogue; the surgeon: "Let him sleep a day"; the player's own screen slightly dimmer at high debt
  (fiction, open: whether the player's character shows it on screen).
- **Mark:** science **[science]**; the debt table **(proposed)**. Open for Rex: whether the watch roster is a
  player choice (who stands which watch) or set by the quartermaster's skill.

## 4. Thermoregulation: heat

**Inputs:** air temperature, humidity, sun, wind (`../world/ENVIRONMENT.md`); work class (MET); clothing;
acclimatisation days; hydration. **Outputs:** `coreTemp` (°C), `sweatRate` (L/h), `heatState`.

- **[science]** Heat balance S = M − W − (R + C + E + K) (metabolic heat minus work minus radiation,
  convection, evaporation, conduction; confidence high, textbook). The practical index is WBGT; NIOSH keeps
  core under 38.0 °C, with 39.2 °C the strain line; heat stroke is about 40 °C with central nervous signs
  (PHY-WBGT). Sweat runs 0.5 to over 2.5 L/h in heat; losing over 2% of body mass impairs aerobic work in
  warm conditions, about 1% more per °C of skin temperature above 27 °C (PHY-HYD). Acclimatisation takes 10–14
  days (plasma volume +9% after 6 days of humid-heat work) and fades about 25 days after (PHY-HEATACC).
- **[history]** The Caribbean sits at 24–31 °C air and 26–30 °C sea all year, trade winds 13–17 knots
  (`../world/ENVIRONMENT.md`). Below decks in a sealed ship, with the galley fire and a hundred bodies, was
  hotter than the deck. Europeans arriving were unacclimatised to both the heat and the fevers (the
  "seasoning", `MEDICINE.md`).
- **[model] Core drift (proposed):** each hour, for work class c at the current WBGT,

      over = max(0, WBGT − ceiling_c − acclim_bonus − shade_bonus)
      coreTemp += over × drift_c − cooling(wind, shade, rest, drinking)
      sweatRate = clamp(0.3 + 0.25·MET + 0.1·over, 0.3, 2.5) L/h   →   hydration (§5), salt (NUTRITION)

  WBGT itself is estimated in `../world/ENVIRONMENT.md` from temperature, humidity and sun. **Why a
  drift rule and not the full heat balance (keeper's note):** the balance S = M − W − (R + C + E + K) is the
  truth, and the drift rule is its one-line shadow: `over` stands for the gap between heat produced
  (M, from the MET) and heat the air can take (R + C + E at this WBGT and wind), with `cooling` the
  evaporative and convective terms the rule can still buy (shade, wind, rest, drinking). Heat and cold (§5)
  share one `coreTemp` and one sign convention (gain above the ceiling, loss below 20 °C felt), so the two
  never fight; a full balance with clothing insulation (clo) and skin wettedness is the upgrade if the
  simulator finds the shadow too coarse (proposed, after the audit of 2026-10-29).

<!-- table:physiology.wbgt_limits -->
*Heat stress: WBGT ceilings for continuous work (acclimatised), and the model's core-temperature drift* (science; confidence medium; source: NIOSH criteria (2016) and ACGIH TLVs as summarised by the US Navy heat-flag tables: light about 30 C, moderate about 28 C, heavy about 25 C WBGT for continuous acclimatised work; unacclimatised 1 to 2 C lower. PHY-WBGT)

| Work class (MET) | WBGT ceiling, acclimatised (C) | Unacclimatised (C) | Model: core drift above ceiling (C per hour per C over) | Mark |
|---|---|---|---|---|
| Light (under 3) | 30 | 28.5 | 0.15 | proposed |
| Moderate (3 to 6) | 28 | 26 | 0.25 | proposed |
| Heavy (over 6) | 25 | 23 | 0.4 | proposed |
<!-- /table -->

<!-- table:physiology.core_temp -->
*Core temperature thresholds* (science; confidence high; source: NIOSH: keep core under 38.0 C (95% of workers then under 39.2 C); heat stroke at about 40 C with CNS signs; hypothermia mild under 35 C, severe under 28 C (standard clinical thresholds). PHY-WBGT, PHY-COLD)

| Core (C) | State | What the sim does | Visible face | Mark |
|---|---|---|---|---|
| >= 40.0 | heat stroke | collapse; a MEDICINE.md condition; death risk per hour untreated | falls on deck, hot skin (dry in classic heat stroke; a man who collapses at the capstan may still be sweating: exertional heat stroke), confusion or raving | proposed |
| 38.5 to 40.0 | heat exhaustion | work capacity x0.6; sweat rate at max; hydration drains fast | pale, soaked, dizzy; asks to sit down | proposed |
| 38.0 to 38.5 | heat strain | work capacity x0.85 | red-faced, drinking more | proposed |
| 36.5 to 38.0 | normal | none | none | proposed |
| 35.0 to 36.5 | cold stress | Dexterity x0.8 (numb hands), shivering costs energy | shivering, clumsy with knots | proposed |
| 32.0 to 35.0 | mild hypothermia | Dexterity x0.5, Wits x0.8; must be warmed | confused, stumbling, stops shivering below 32 | proposed |
| < 32.0 | severe hypothermia | unconscious; death risk per hour | unresponsive | proposed |
<!-- /table -->

- **Effects:** `heatState` scales work capacity and the Endurance pool in `BODY.md`; sweat drives §5 and the
  salt line in `NUTRITION.md`; heat stroke is a `MEDICINE.md` condition with a death risk; heat raises the
  Calm↔Volatile pressure in `PSYCHOLOGY.md`.
- **Visible face:** men stripped to the waist in the rigging; "Give him water and shade" from the surgeon;
  a crew mate who faints at the capstan at noon; the quartermaster's water count going up.
- **Mark:** thresholds **[science]**; the drift rule **(proposed)** with placeholder rates.

## 5. Thermoregulation: cold, wet and the water

**Inputs:** air and water temperature, wind, rain, immersion, clothing, body fat (`NUTRITION.md`), work.
**Outputs:** `coreTemp` falling, `coldState`, immersion survival clock.

- **[science]** Cold shock (gasping, loss of breathing control) is worst at 10–15 °C water and drowning in
  the first minutes is the main killer; survival charts are indicative only (PHY-COLD). Wet clothing and wind
  multiply heat loss; shivering raises metabolism several-fold but costs energy and dexterity. Mild
  hypothermia under 35 °C, severe under 28 °C (clinical thresholds).
- **[history]** Most sailors could not swim (`STATS.md` Swimming row). A tropical night in wet clothes on an
  open deck is cold enough to matter (air 22–24 °C, wind 15 knots), and the North Atlantic leg of any voyage
  to Europe is cold water.
- **[model] (proposed):** out of the water, `coreTemp −= k_cold × (37 − T_air_felt) × wet × (1 − clothing)`
  per hour when T_air_felt < 20 °C, where T_air_felt includes wind; in the water, the immersion table sets a
  clock to exhaustion, scaled by body fat (+20% per 5 kg fat over 10) and Swimming skill (treading water
  costs less).

<!-- table:physiology.cold_water -->
*Survival in the water (immersion), by water temperature* (science; confidence medium; source: Computational immersion study (PMC11234009): still fresh water 136/113/100 min at 5/2/0 C; static salt water 111/88/80/66 min at 5/2/0/-2 C. Boating-safety charts: under 15 min to exhaustion at 0 C, 1 to 2 h at 10 to 15 C, 2 to 12 h at 15 to 21 C, indefinite above about 26 C. Cold shock (gasp, loss of breathing control) worst at 10 to 15 C; drowning in the first minutes is the main killer. The times are central estimates with wide variance: body fat, clothing, flotation, swimming ability, exhaustion, sea state and whether the man can keep his head up move them by hours either way; the model rolls around them, never reads them as fixed. PHY-COLD)

| Water (C) | Time to exhaustion or unconsciousness | Expected survival | Caribbean relevance | Mark |
|---|---|---|---|---|
| 0 to 5 | 15 to 30 min | 45 to 90 min | never in the tropics; the Newfoundland fishery | proposed |
| 5 to 10 | 30 to 60 min | 1 to 3 h | North Atlantic winter crossings | proposed |
| 10 to 15 | 1 to 2 h | 1 to 6 h | cold shock worst here | proposed |
| 15 to 21 | 2 to 7 h | 2 to 40 h | Gulf Stream in winter | proposed |
| 21 to 27 | 3 to 12 h | 3 h to indefinite | the Caribbean year-round (SST 26 to 30 C) | proposed |
| over 27 | indefinite (fatigue, thirst, sharks decide) | indefinite | tropical summer | proposed |
<!-- /table -->

- **Effects:** cold dips Dexterity and Reflexes in `BODY.md` (numb hands); immersion is how "fell overboard"
  resolves (an event in the day loop); a wet night raises `MEDICINE.md` exposure to chest infections
  (period: "a chill").
- **Visible face:** chattering teeth; a crew mate fumbling a knot; "Get him below and out of those clothes."
- **Mark:** **(proposed)**.

## 5a. Hydration

<!-- table:physiology.hydration -->
*Water balance thresholds (loss as % of body mass)* (science; confidence high; source: Sports Medicine 2015 supplement: hypohydration over 2% impairs aerobic work in warm-hot conditions, about 1% more per 1 C skin temperature above 27 C; sweat rates 0.5 to over 2.5 L/h in heat; total fluid need 3.7 L/day men, 2.7 women (US National Academies), 2 L drinking water (WHO). PHY-HYD)

| Deficit (% body mass) | Effect in the model | Visible face | Mark |
|---|---|---|---|
| 0 to 1 | none | none | proposed |
| 1 to 2 | thirst; Endurance pool x0.95 | asks for the water cask | proposed |
| 2 to 4 | Endurance x0.85 (x0.75 in heat); Wits x0.9; heat strain faster | dark urine, headache, cracked lips | proposed |
| 4 to 6 | Endurance x0.65; Strength x0.9; collapse risk in heat | dizzy, stops sweating, sunken eyes | proposed |
| 6 to 10 | incapacitated; kidney injury (MEDICINE) | delirium | proposed |
| over 10 | death risk per hour | unresponsive | proposed |
<!-- /table -->

- **[model] (proposed):** `waterDeficit_kg += sweat + urine(1.5 L) + breath(0.4 L) − drunk − food water`,
  as % of body mass; seawater counts negative (3.5% salt vs 0.9% in blood: it costs more water than it gives;
  PHY-SEAWATER). The thresholds are the table's. The ration side (casks, rain catch, grog) is
  `NUTRITION.md` §Water and `../DUTIES.md` rationing water.
- **Visible face:** the water cask count; cracked lips in the portrait (art keeper, open); "We're down to a
  pint a man."

## 6. Exertion, whole-body fatigue and the Endurance pool

**Inputs:** the day's MET-hours, `aerobic_today` (§2), sleep `alertness` (§3), hydration (§5a), glycogen and
energy balance (`NUTRITION.md`), fever and blood loss (`MEDICINE.md`), muscular fatigue (`MUSCULAR.md`).
**Outputs:** `fatigueDay` (0–1), `endurancePoolCeiling`, `endurancePoolNow` (the fight's point pool).

- **(Rex, 2026-10-29)** Endurance is the pool of points in a fight; Efficiency the spend. This section only
  sets how big the pool is today.
- **[science]** Whole-body endurance is limited by aerobic capacity, fuel (glycogen), hydration, heat and
  sleep (textbook; each has its section above). Local muscular fatigue is a separate thing (`MUSCULAR.md`).
- **[model] (proposed):**

      fatigueDay = clamp(METh_today / (8 × aerobic_today/40), 0, 1)        (a 40-index body tires at 8 MET-h)
      endurancePoolCeiling = Endurance_attr × (aerobic_today / 40)           (STATS Endurance, 1–20 scale)
      endurancePoolNow = ceiling × (1 − 0.5·fatigueDay) × alertness × hydrationFactor × glycogenFactor
                                   × feverFactor × bloodFactor

  The factors are each subsystem's output multiplier (1.0 when healthy). `BODY.md` §3 holds the single
  formula so no other file recomputes it.
- **Effects:** the pool `COMBAT.md` §6a draws down; duty performance (`STATS.md` §4 "state"); accident
  chance in duties rises with `fatigueDay`.
- **Visible face:** a crew mate asks to be relieved; slow on the rigging; in a fight the player sees the
  pool bar (open: whether the pool is shown as a bar, since stats are hidden; the keeper suggests the bar is
  the one number a fight may show, as "wind").
- **Mark:** Rex's rule preserved; the formula **(proposed)**.

## 7. Recovery: the overnight tick

<!-- table:physiology.recovery -->
*What a night's sleep restores (the overnight tick)* (model; confidence medium; source: Simplified from the subsystems: sleep repays debt hour for hour above need; muscle fatigue recovers by the 3CC R rate (MUSCULAR.md); glycogen refills from the day's carbohydrate (NUTRITION.md); wounds heal by phase (MEDICINE.md).)

| Quantity | Overnight rule | Reads | Mark |
|---|---|---|---|
| Sleep debt | debt -= max(0, hours slept - 8) ; debt += max(0, 8 - hours slept); a 4-on-4-off night counts 0.85 of its hours | watch roster | proposed |
| Whole-body fatigue (the day's MET-hours) | resets to 0 after 7+ hours; otherwise carries (8 - slept)/8 of it | sleep | proposed |
| Endurance pool (fight) | refills to its ceiling if slept, fed and watered; else to ceiling x (sleep x hydration x glycogen factors) | NUTRITION, sleep | proposed |
| Core temperature | returns to 37.0 if sheltered; a wet cold night on deck lowers it (ENVIRONMENT) | weather, shelter | proposed |
| Banister fitness and fatigue | both decay by their time constants; the day's load added | duties | proposed |
<!-- /table -->

- **Order of the tick (proposed; `BODY.md` §4 holds the full order across all docs):** weather for the night
  (ENVIRONMENT) → sleep blocks from the roster → sleep debt and alertness → core temperature → Banister decay
  and the day's load → hand the fatigue and sleep states to MUSCULAR (muscle recovery), NUTRITION (overnight
  energy balance), MEDICINE (healing and disease progression), PSYCHOLOGY (mood pushes).
- **Mark:** **(proposed)**.

## 8. Ageing and development

**Inputs:** age, the training history (§2, `MUSCULAR.md`), injuries (`MEDICINE.md`). **Outputs:** the age
factor on each attribute's **maximum** (the hidden genetic max of `STATS.md` §1, which Rex says disuse and age
lower).

- **(Rex, 2026-10-26)** Every attribute has a hidden genetic min–max; use raises the value toward the max,
  disuse lowers it; `STATS.md` proposes the max itself falls with age after the 20s–30s. This section gives
  that curve.
- **[science]** Grip strength peaks at 30–39 and declines faster from middle age (2.4 million adults;
  PHY-AGE); VO₂max −10%/decade; muscle mass −3 to −8%/decade after 30, faster after 60 (sources disagree on
  the exact rate; confidence medium). Near vision loses accommodation from the 40s (presbyopia; textbook).
- **[history]** Pirate crews were young: most of Roberts' men tried in 1722 were in their twenties
  (`../economy/GOODS.md` source J; the age list is in Johnson's trial record). An old sailor was forty.

<!-- table:physiology.ageing -->
*Ageing curves the body uses (the maximum, not the current value)* (science; confidence medium; source: Grip strength pooled norms (Tomkinson et al. 2025, 2.4 million adults): peak at 30 to 39, faster decline from middle age; VO2max about -10% per decade from the late 20s; muscle mass -3 to -8% per decade after 30 with faster loss after 60 (sources disagree on the exact rate). PHY-AGE)

| Attribute family | Rises until | Plateau | Falls after | Rate | Mark |
|---|---|---|---|---|---|
| Strength (per limb, via MUSCULAR) | 25 | 25 to 39 | 40 | -1% a year to 60, -1.5% after, -3% after 75 | proposed |
| Endurance (cardio ceiling) | 22 | 22 to 30 | 30 | -10% a decade untrained, -6% trained | proposed |
| Agility, Reflexes | 22 | 22 to 30 | 30 | -5% a decade; -10% after 60 | proposed |
| Dexterity | 25 | 25 to 45 | 45 | -4% a decade; tremor risk after 65 | proposed |
| Constitution (immune, healing) | 20 | 20 to 35 | 35 | -5% a decade; healing time +30% by 60 | proposed |
| Eyesight (near) | 15 | 15 to 40 | 40 | presbyopia: fine detail -20% by 50 (period: no spectacles at sea) | proposed |
| Hearing | 15 | 15 to 30 | 30 | high tones first; -10% a decade after 50; gunners faster | proposed |
| Skills (STATS.md) | never fall | - | - | Rex: skills never decrease, only rust | **Rex** |
<!-- /table -->

- **[model] (proposed):** `max_today(attr) = genetic_max × ageCurve(attr, age) × injuryCap(attr)`; the
  current value still moves by use and disuse inside [genetic_min, max_today]. Children and growth (below
  16) are out of scope until Rex says characters age in play (open).
- **Effects:** every attribute in `STATS.md`; the old surgeon with the best skill and shakiest hands is this
  table plus the Surgery row.
- **Visible face:** grey in the portrait; "I'm not the man I was on the Dolphin"; the old hand who still
  knows every knot but sends the boy aloft.
- **Mark:** the curves **(proposed)**; the age-lowers-the-max idea is `STATS.md`'s proposal, Rex's min–max.

## 9. Acclimatisation and seasickness

<!-- table:physiology.acclimatisation -->
*Acclimatisation clocks* (science; confidence medium; source: Heat: plasma volume +9% after 6 days of exercise in humid heat, back to baseline about 25 days after stopping; full adaptation 10 to 14 days (PHY-HEATACC). Seasickness: 40% of 1,293 sailors affected, most mildly; 72% of cases in rough sea; incidence fell to 10% of its first-day value over 10 days at sea in cadets (PHY-SEA). Disease 'seasoning' is in MEDICINE.md.)

| Adaptation | Time to gain | Time to lose | Effect | Mark |
|---|---|---|---|---|
| Heat acclimatisation | 10 to 14 days of work in heat | about 25 days away from it | WBGT ceiling +2 C; sweat starts sooner; less salt lost per litre | proposed |
| Sea legs (seasickness habituation) | 3 to 10 days at sea | about a month ashore | nausea chance in a seaway x0.1 when habituated | proposed |
| Cold acclimatisation | weeks | weeks | small: shivering threshold lowered; not modelled beyond clothing | proposed |
| Altitude | - | - | not relevant at sea; left out | proposed |
<!-- /table -->

- **[science]** 40% of 1,293 sailors reported seasickness, most mild; 72% of cases were in rough sea; in
  cadets the incidence fell to a tenth over the first ten days at sea (PHY-SEA).
- **[model] (proposed):** `seasickChance_day = base(Constitution) × seaState × (1 − habituation)`,
  habituation rising 0.25/day at sea to 1.0, falling 0.03/day ashore. A sick day: appetite ×0.3, work
  capacity ×0.6, mood push (PSYCHOLOGY).
- **Visible face:** a crew mate at the lee rail; the cook's meal uneaten; "He'll find his legs in a day or
  two."
- **Mark:** **(proposed)**. `STATS.md` already lists seasickness under Constitution (Rex's row).

## 10. What this file hands to the others

| To | What | Where it is used |
|---|---|---|
| `BODY.md` | `alertness`, `circadian`, `heatState`, `coldState`, `waterDeficit`, `fatigueDay`, `aerobic_today`, `endurancePoolNow`, `ageFactor(attr)` | the capability computation |
| `MUSCULAR.md` | `fatigueDay`, `aerobic_today`, sleep quality | muscle recovery rate, endurance |
| `NUTRITION.md` | kcal demand, water need, sweat salt | energy and water balance |
| `MEDICINE.md` | heat stroke, hypothermia, exposure (wet nights), `alertness` (accidents) | conditions and injury chance |
| `PSYCHOLOGY.md` | sleep debt, heat, seasickness | pushes on mood and the sliders |
| `../combat/COMBAT.md` | the Endurance pool fill; alertness for detection (§6) | the fight |
| `../DUTIES.md` (via `STATS.md` §4 state) | work capacity multiplier | how well a duty goes |

## Open for Rex

1. Is the Endurance attribute's genetic max the cardio ceiling (§2), or are they two numbers?
2. The watch roster: a player choice, or set by the quartermaster?
3. Whether the Endurance pool shows as a bar in a fight ("wind"), given hidden stats.
4. Whether characters age during play (the curves in §8 assume years pass), and whether children exist.
5. The placeholder rates (drift per hour, the 42/7 constants, the debt table) are for the simulator to tune;
   none is a rule until Rex keeps it.

## Sources

Keys are in `../SOURCES.md` (PHY-*). Period sources (Pepys' 1677 contract, the watch system, Roberts'
articles) are cited where used; the scientific ones are listed there with URLs and the date opened.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; metabolism, fitness, sleep, heat, cold, hydration, exertion, recovery, ageing, acclimatisation; tables in `data/physiology.json` | keeper |
