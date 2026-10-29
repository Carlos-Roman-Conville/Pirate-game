# Atmosphere: the air, pressure, local modifiers, active regions, the period's gases (body-and-world keeper, 2026-10-29)

Rex's layer (2026-10-29): simulate the air itself, so that a fire, a stinkpot, a shut hold or an
apothecary's accident release real substances that move by physical rules and reach a body by a real
route, instead of a scripted debuff. ChatGPT (outside AI) drafted the architecture; the keeper argued it
down to what pays in 1650–1730 and ChatGPT answered that the engine's capability must not be sized by the
game's present need; Rex passed on the compromise: **build the atmosphere and the respiratory exchange
now, establish the interfaces for gas dynamics and chemistry, keep the chemistry schema general and the
database small.** This file is the atmosphere. **(Rex, 2026-10-29)** The structure of this file, `GAS_DYNAMICS.md`,
`CHEMISTRY.md` and the respiratory tables is his decision; **every number is a placeholder** (Rex's
words: "numbers still placeholders"); recipes-as-reactions stays open.

**Ownership (the boundaries from the brief, kept exactly).** This file: the baseline composition, pressure
with altitude, the local modifiers, which regions are active, and the period scenario list.
`GAS_DYNAMICS.md`: transport and concentrations. `CHEMISTRY.md`: substances and reactions.
`ENVIRONMENT.md`: weather and terrain as inputs, never a second gas model. `ECOLOGY.md`: biological
production and consumption as aggregate fluxes. `../body/ANATOMY.md`: the respiratory structures.
`../body/PHYSIOLOGY.md`: breathing demand. `../body/CIRCULATION.md`: blood gases. `../body/NEUROLOGY.md`:
neural effects of absorbed chemicals. `../body/MEDICINE.md`: the conditions. `../body/BODY.md`:
capability. One physical effect, one pathway.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `../body/data/atmosphere.json`.

**Clock.** Inactive regions never tick; an occupied box ticks per minute; a fire or a release per second
or per combat turn (`GAS_DYNAMICS.md`); exposure is integrated per character present.

## What Rex has decided that this file must respect

- **(Rex, 2026-10-29)** The layer itself: causal simulation, not scripted effects; a gas bomb releases
  substances.
- **(Rex, 2026-10-29)** Provenance tags on the item screen; the engine reads a substance's properties,
  never its tag.
- **(Rex, 2026-10-26)** Weather and the ship's condition as designed (`ENVIRONMENT.md` supplies wind and
  weather; `../PIRATE.md` §5a and `../DUTIES.md` keep the ship).
- **(Rex, 2026-10-29)** The species profile (`ANATOMY.md` §5): the breathing medium and structure are the
  profile's; a fish-person reads water, not this air.

## 1. The baseline

<!-- table:atmosphere.baseline -->
*The baseline atmosphere (one world profile; every place inherits it)* (science; confidence high; source: Standard dry-air composition; sea-level pressure 101,325 Pa (760 mmHg); water vapour tracked apart because it follows temperature and humidity (ENVIRONMENT). ATM-STD)

| Species | Dry-air fraction | Partial pressure at sea level (mmHg) | Tracked in play? | Why | Mark |
|---|---|---|---|---|---|
| Nitrogen N2 | 78.08% | 593 | as the inert remainder | fills the balance; matters only for diving (not in the game) | rex (the species tracked, 2026-10-29); science (values) |
| Oxygen O2 | 20.95% | 159 | yes | the one that keeps a body alive; inspired partial pressure is what the lungs see | rex (the species tracked, 2026-10-29); science (values) |
| Argon and the traces | 0.93% and less | 7 | no | nothing for play; folded into the remainder | rex (the species tracked, 2026-10-29); science (values) |
| Carbon dioxide CO2 | 0.04% (about 400 ppm; about 280 ppm in 1700) | 0.3 | yes | accumulates in closed spaces; drives breathing | rex (the species tracked, 2026-10-29); science (values) |
| Water vapour H2O | 0 to 4% by humidity and temperature | up to 47 at body temperature (the airways saturate inspired air) | yes (from ENVIRONMENT) | takes room from oxygen in the alveoli; the 47 mmHg in the alveolar gas equation | rex (the species tracked, 2026-10-29); science (values) |
<!-- /table -->

- **[science]** The air is well mixed: a forest has no meaningfully higher oxygen than the field beside
  it, and the ecosystem's photosynthesis and respiration are global budgets, not local tiles (ChatGPT's
  caution, kept). Only enclosure or a source makes a place differ.
- **[history]** Carbon dioxide stood near 280 ppm in 1700; the difference from today changes nothing a
  body feels.

## 2. Pressure and altitude

<!-- table:atmosphere.altitude -->
*Pressure with altitude (the standard atmosphere) and what the lungs see* (science; confidence high; source: Barometric formula P(h) = 101325 x (1 - 0.0065 h / 288.15)^5.256 for the lower atmosphere under standard conditions; oxygen stays 20.95% while total pressure falls; inspired PO2 = 0.2095 x (P - 47 mmHg). Alveolar gas equation PAO2 = FiO2 (Patm - 47) - PaCO2 / 0.8 (standard respiratory physiology; ATM-ALV). Caribbean use is small (the Blue Mountains 2,256 m); the table exists for the reusable engine.)

| Altitude (m) | Pressure (mmHg) | Inspired PO2 (mmHg) | Alveolar PO2 at PaCO2 40 (mmHg) | Typical resting saturation | Where in the game | Mark |
|---|---|---|---|---|---|---|
| 0 | 760 | 149 | 99 | 0.97 | the sea, every port | rex (the model, 2026-10-29); science (values) |
| 500 | 716 | 140 | 90 | 0.96 | the hill towns, Jamaica's uplands | rex (the model, 2026-10-29); science (values) |
| 1000 | 674 | 131 | 81 | 0.95 | coffee country | rex (the model, 2026-10-29); science (values) |
| 2256 | 577 | 111 | 61 | 0.90 | the Blue Mountain peak (a day's climb; mild breathlessness) | rex (the model, 2026-10-29); science (values) |
| 3000 | 526 | 100 | 50 | 0.88 | none in the Caribbean; the engine's other worlds | rex (the model, 2026-10-29); science (values) |
| 5000 | 405 | 75 | 25 | 0.75 | none here; altitude sickness, impaired attention (BODY) | rex (the model, 2026-10-29); science (values) |
<!-- /table -->

- **[science]** The lungs see inspired PO₂ = 0.2095 × (P − 47 mmHg) once the airways saturate the air
  with water, and the alveolar gas equation takes carbon dioxide's share: PAO₂ = FiO₂ (P − 47) −
  PaCO₂ / 0.8 (ATM-ALV). The barometric formula is the standard lower atmosphere, not weather.
- **[model]** In this game altitude barely moves (the Blue Mountains at 2,256 m give a day's mild
  breathlessness); the table is for the engine's other worlds and for the reusable species profile.

## 3. Local modifiers

<!-- table:atmosphere.modifiers -->
*Local modifiers a place applies to the baseline (ENVIRONMENT supplies the inputs)* (model; confidence medium; source: ChatGPT's layer B (outside AI), kept; the ventilation numbers are placeholders from building-ventilation practice (air changes per hour).)

| Modifier | From | Changes | Placeholder values | Mark |
|---|---|---|---|---|
| Altitude | the map's elevation | total pressure (the table above) | - | rex (the modifier, 2026-10-29); proposed (placeholder values) |
| Temperature and humidity | ENVIRONMENT climate and weather | water vapour partial pressure; gas density (buoyancy) | humidity 60 to 85% in the Caribbean | rex (the modifier, 2026-10-29); proposed (placeholder values) |
| Wind | ENVIRONMENT weather state | ventilation of open and semi-open places; dispersal of a release (GAS_DYNAMICS) | trades 13 to 17 knots | rex (the modifier, 2026-10-29); proposed (placeholder values) |
| Enclosure and ventilation | the place's kind (ANATOMY of a ship: hold, orlop, cabin, gun deck; a room, a cave, a mine) | air changes per hour (ACH): how fast the volume is replaced by outside air | open deck infinite; gun deck with ports open 20; cabin with a window 5; hold with the hatch open 2; hold battened down 0.2; a cave 0.05; a room with a fire and a chimney 3 | rex (the modifier, 2026-10-29); proposed (placeholder values) |
| Water depth | under water | pressure +1 atm per 10 m; no air at all: the breathing medium changes (ANATOMY respiratory profile) | drowning is the lungs' medium, not a gas | rex (the modifier, 2026-10-29); proposed (placeholder values) |
| Stability and inversion | ENVIRONMENT (calm nights, fog) | a release lingers near the ground; smoke hangs on the water | dispersion x0.3 on a calm night | rex (the modifier, 2026-10-29); proposed (placeholder values) |
<!-- /table -->

## 4. Active and inactive regions

<!-- table:atmosphere.regions -->
*Active and inactive regions: when a place gets its own air* (model; confidence medium; source: ChatGPT's active-region rule (outside AI), kept: open outdoor places inherit the baseline; a place becomes active when enclosed and occupied, or when a source changes its composition; it returns to baseline when within a tolerance of it.)

| Place | State | Model | Volume (m3, placeholder) | ACH (placeholder) | Mark |
|---|---|---|---|---|---|
| Open deck, beach, a street | inactive | baseline plus ENVIRONMENT; a release makes it active for its cells (GAS_DYNAMICS grid) | - | infinite | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| Forest, swamp | inactive | baseline; ECOLOGY's fluxes are aggregate, never a local oxygen bonus | - | infinite | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| The hold | active when occupied or the hatches are closed | one well-mixed box (GAS_DYNAMICS box model) | a sloop 60; a brig 250; a ship 800 | 2 open, 0.2 battened | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| The gun deck in action | active during a fight | one box per deck section; powder smoke as the source (CHEMISTRY black powder) | 300 per deck | 20 with ports open, 5 closed | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| A cabin, the great cabin | active when occupied with a brazier, a lamp or the window shut | box | 20 to 60 | 5 window open, 0.5 shut | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| The orlop and the surgeon's cockpit | active in a fight | box; wounded men and lamps | 150 | 1 | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| A tavern, a room ashore | active when crowded or heated | box | 80 | 3 | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| The apothecary's laboratory (the INTJ) | active during an experiment | box; CHEMISTRY reactions as sources | 40 | 2, 8 with the window | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| A cave, a mine, a well | active when entered | box; natural sources (CO2, H2S) | by the place | 0.05 | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| A burning building or ship | active | box per compartment with combustion sources; grid if on the combat map | by the place | fire-driven | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
| Under water | the medium itself | no gas model: the respiratory profile's medium | - | - | rex (the region and its model, 2026-10-29); proposed (volumes, ACH) |
<!-- /table -->

- **[model]** A ship is a set of boxes (the hold, each gun deck, the orlop, the cabins) with volumes and
  air changes per hour; a hatch or a port opened changes the rate. The open deck is the baseline. A place
  ashore is a box when enclosed. The period had no ventilators (wind-sails were the answer, Hales's
  machines came in the 1740s), so ventilation is hatches, ports and the wind.

## 5. The period's gases (the payoff list)

<!-- table:atmosphere.scenarios -->
*The period's gases: what a 1650 to 1730 crew actually breathed (the payoff list)* (history; confidence medium; source: Gun decks produced clouds of hazardous smoke (naval artillery overviews); black powder's gases are CO2, N2, CO, H2S, H2 and CH4 (about 43% of the products by mass; ATM-BP); stinkpots of sulphur and powder are attested from 1669 (Sturmy's Mariner's Magazine) and used by pirates and in boarding (ATM-STINK); charcoal in enclosed spaces kills by carbon monoxide (modern series: 83 US deaths in seven years from charcoal indoors; ATM-CO); below-decks air in 1741 was foul enough to be a navy complaint (ATM-VENT); volcanic islands (Montserrat, Guadeloupe, Martinique, St Vincent) have fumaroles. The hold's foul air is documented in the 19th century; the period's own deaths from it are open.)

| Scenario | Source species | Place and model | What the body sees | Period provenance | Mark |
|---|---|---|---|---|---|
| Fire below decks | CO2, CO, smoke particles, heat; oxygen consumed | a box per compartment, fire-driven | hypoxia, CO poisoning, smoke inhalation, heat (PHYSIOLOGY) | the great fear of every wooden ship | rex (the scenario, 2026-10-29); proposed (numbers) |
| The gun deck in a long action | black powder smoke: CO2, CO, H2S (trace), SO2, particles | box per deck, ports open (ACH 20) or shut | eyes streaming (Eyesight x0.6), cough, headache after an hour (COHb 5 to 10%), the deafness is the guns' (ANATOMY senses) | universal; 'clouds of hazardous smoke' | rex (the scenario, 2026-10-29); proposed (numbers) |
| A stinkpot thrown on deck or into a boarding boat | sulphur burning: SO2; smoke; pitch | a few grid cells for minutes (GAS_DYNAMICS), or a boat as a box | choking, eyes shut, Nerve check to stay (COMBAT: a flinch source, combat keeper's), SO2 airway irritation (MEDICINE) | attested 1669; a pirate and boarding weapon | rex (the scenario, 2026-10-29); proposed (numbers) |
| A charcoal brazier in a shut cabin on a cold night | CO (incomplete combustion), CO2 | the cabin box at 0.5 ACH | COHb rising over hours: headache, then sleep that does not end | charcoal indoors kills; the north Atlantic leg is cold enough to want a brazier | rex (the scenario, 2026-10-29); proposed (numbers) |
| The hold battened down with men in it (prisoners, a storm) | CO2 up, O2 down, from breathing; bilge gases (H2S, CH4) from rot | the hold box at 0.2 ACH with N occupants | headache and panting at 3% CO2, confusion at 5%, unconscious near 10%; H2S if the bilge is foul | the slave deck's horror is this scenario; the 1741 navy complaint | rex (the scenario, 2026-10-29); proposed (numbers) |
| Opening a long-sealed hold or well | CO2 or H2S pooled low (heavier than air) | a box at 0.05 ACH; the first man down | collapse in a breath at H2S over 500 ppm; the rescuer dies too (the classic) | documented later; plausible for the period | rex (the scenario, 2026-10-29); proposed (numbers) |
| The apothecary's experiment gone wrong | whatever CHEMISTRY says the reaction makes (mercury vapour, SO2, H2S, chlorine-like fumes from salts and acids) | the laboratory box | by the species' toxicity rows | the INTJ's lane | rex (the scenario, 2026-10-29); proposed (numbers) |
| A volcanic fumarole or a sulphur mine | SO2, H2S, CO2 | a cave box or a grid patch on the slope | irritation, collapse in a hollow | the Soufrieres of the Lesser Antilles | rex (the scenario, 2026-10-29); proposed (numbers) |
| Lime kiln, tar kettle, smithy | CO2, CO, SO2, smoke | a semi-open box, ACH 3 to 10 | chronic low-grade exposure for the worker (a daily COHb of 5%: headaches) | all period trades | rex (the scenario, 2026-10-29); proposed (numbers) |
| A tagged gas weapon or substance | its row's species (provenance-tagged: Rex) | as its release | by its rows | fiction | open (the story keeper's rows) |
<!-- /table -->

- **[history]** This is the keeper's answer to "what does a 1650–1730 crew actually breathe", with the
  sources per row. The gun deck in action and the fire below decks are the two that touch every voyage;
  the brazier, the shut hold and the stinkpot are the period's gas deaths and gas weapon; the apothecary's
  laboratory is the INTJ's lane and the place where the general chemistry will first matter.
- **Visible face:** streaming eyes and coughing on the gun deck; the man who does not wake in the cabin;
  the first man down the hold; the stinkpot's choking cloud at the rail; the surgeon's "he breathed the
  smoke".

## 6. Interfaces to the body (the respiratory exchange, built now)

The air reaches a body through four tables added today to the body docs:

| Where | What |
|---|---|
| `../body/ANATOMY.md` §1a | the respiratory profile: medium, structure, ventilation capacity, exchange efficiency, airway resistance, damage; gas transfer = exchange capacity × the partial-pressure gradient |
| `../body/PHYSIOLOGY.md` §1a | ventilation demand: litres per minute by MET, the carbon dioxide drive, the work of breathing |
| `../body/CIRCULATION.md` §1a | blood gases: PaO₂, PaCO₂, saturation by the Severinghaus curve, carboxyhaemoglobin, acid–base |
| `../body/MEDICINE.md` §1a | the exposure conditions: hypoxia, hypercapnia, carbon monoxide poisoning, smoke inhalation, irritant injury, hydrogen sulphide, altitude illness |

`../body/NEUROLOGY.md` accepts an inhaled dose through the same kinetics as a drink (its §3), and the
respiratory calculator on the dashboard's Atmosphere tab runs the chain: pressure, mixture and exposure
time to saturation, carboxyhaemoglobin and the symptom tier.

## Open for Rex

1. ~~The whole layer: keep, cut, or stamp~~ stamped (Rex, 2026-10-29): structure canon, numbers placeholders.
2. Which scenarios the first build needs (the keeper's order: the gun deck and fire below decks, then the
   hold and the brazier, then the stinkpot and the laboratory).
3. Whether a wind-sail (a period ventilator) is a ship part and a duty (`DUTIES.md`, the ship keeper).
4. Volumes and air changes per hour are placeholders; a ship's compartments should come from the ship
   tiers in `../story/STORY.md`.

## Sources

`../SOURCES.md` keys ATM-*: the standard atmosphere and the alveolar gas equation (standard references);
black powder's products (the 1868 analysis as reproduced; the 1879 Proceedings article); stinkpots
(Sturmy 1669 via the dictionary record; pirate-weapon overviews); charcoal and carbon monoxide (CPSC
1986; the California series); ship ventilation in 1741 (Proceedings 1925); confined-space carbon dioxide
modelling (NIOSH).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | Rex stamped the air layer's structure as his; numbers placeholders; recipes-as-reactions open | Rex |
| 2026-10-29 | File opened on Rex's gas layer and ChatGPT's architecture (outside AI), sized by the compromise; baseline, altitude, modifiers, regions, the period's scenarios, the body interfaces; tables in `../body/data/atmosphere.json` | keeper |
