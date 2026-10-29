# Gas dynamics: units, the box model, sources and sinks, the grid (body-and-world keeper, 2026-10-29)

The transport layer of Rex's gas simulation (2026-10-29): where airborne substances go and how much a
body standing there breathes. Per the compromise Rex passed on (ChatGPT, outside AI), this file
**establishes the interface and the box model now and defers the spatial grid**; the units table is the
contract every other doc writes to. **All proposed.**

**Ownership.** This file: concentrations per region, the mass balance, ventilation, sources and sinks as
rates handed in by other docs, exposure per character, and later the grid. It never decides what a
reaction produces (`CHEMISTRY.md`) nor what a dose does (`../body/`).

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `../body/data/gasdynamics.json`.

## 1. Units and the interface

<!-- table:gasdynamics.units -->
*Units and the concentration interface (every doc that touches a gas uses these)* (model; confidence high; source: Consistent units so that CHEMISTRY's products, GAS_DYNAMICS's concentrations and the body's exposure agree: a species is identified by its CHEMISTRY id; a region holds a concentration per species; the body reads partial pressures and ppm at the mouth.)

| Quantity | Unit | Conversion | Who writes | Who reads | Mark |
|---|---|---|---|---|---|
| Concentration of a gas | volume fraction (ppm or %) | partial pressure (mmHg) = fraction x total pressure | GAS_DYNAMICS | the respiratory profile (ANATOMY), CIRCULATION blood gas, MEDICINE exposure | proposed |
| Concentration of an aerosol or particle | mg per m3 | - | GAS_DYNAMICS | MEDICINE (smoke inhalation), ANATOMY senses (eyes) | proposed |
| Volume of a region | m3 | - | ATMOSPHERE regions table | the box model | proposed |
| Ventilation | air changes per hour (ACH), or m3 per minute | ACH = flow / volume x 60 | ATMOSPHERE modifiers; a door opened, a hatch, a fan (none in the period), the wind | the box model | proposed |
| Source strength | litres per minute of a species, or mg per minute | a fire: from CHEMISTRY's reaction rate; a person: 0.25 L/min O2 in, 0.2 L/min CO2 out at rest, x MET at work (PHYSIOLOGY) | CHEMISTRY, PHYSIOLOGY, ECOLOGY | the box model | proposed |
| Exposure | concentration x minutes (ppm-min), and the peak | dose to the body = ventilation (L/min, PHYSIOLOGY) x concentration x minutes x uptake fraction | GAS_DYNAMICS integrates per character present | ANATOMY lungs, NEUROLOGY (absorbed dose), MEDICINE | proposed |
| Mass conservation | moles of each species | a region's total moles = pressure x volume / (R T); sources add, sinks and ventilation remove, reactions convert | the model | a check the build script could run on scenario data (open) | proposed |
<!-- /table -->

## 2. The box model (built first)

<!-- table:gasdynamics.box_model -->
*The box model (implemented first): one well-mixed volume per active region* (science; confidence high; source: Standard confined-space mass balance: V dC/dt = S - Q (C - C_out) - R, with Q the ventilation flow (ACH x V / 60), S the sources, R removal and reaction; steady state C = C_out + S / Q (NIOSH confined-space CO2 modelling; GAS-BOX). Worked example: two occupants in a 680 m3 space at 0.06 ACH settle near 1,500 ppm CO2.)

| Rule | Formula | Example | Mark |
|---|---|---|---|
| Mass balance per species | V dC/dt = S - Q (C - C_out) - R, Q = ACH x V / 60 per minute | the hold at 250 m3, hatch shut (0.2 ACH), 30 men at rest (CO2 6 L/min): CO2 climbs toward 6 / 0.83 = 7.2% (steady state), passing 3% in about 90 minutes: headache and panting; oxygen falls at 7.5 L/min toward 13% | proposed |
| Oxygen and carbon dioxide move together | O2 consumed = CO2 produced / 0.8 (the respiratory quotient) for breathing; combustion by CHEMISTRY's stoichiometry | a fire in the hold: oxygen falls faster than CO2 rises | proposed |
| Heavier gases pool | CO2 (1.5 x air) and H2S (1.2 x air) sink: in a still box the lower half's concentration is x1.5 the mean, the upper half x0.5 (placeholder); mixing restores it | the man who crouches to the bilge; the well | proposed |
| Lighter gases rise | CO (0.97 x air) mixes; hot smoke rises to the deckhead first (the crawl-low rule of a fire) | a crawling man breathes better air for a while | proposed |
| Ventilation events | ACH jumps when a hatch, port, door or window opens, or a wind-sail is rigged (period ventilators: wind-sails and Hales' ventilators from the 1740s, after the period) | opening the hatch takes the hold from 0.2 to 2 ACH: the 7% falls to 1% in about 90 minutes | proposed |
| Time step | a minute for an occupied box; seconds for a fire or a release (the stability rule: step under volume / flow) | the gun deck: per combat turn | proposed |
| Return to baseline | a region goes inactive when every species is within 10% of the baseline and no source remains | the hold aired out | proposed |
<!-- /table -->

- **[science]** The confined-space mass balance is standard (GAS-BOX): a well-mixed volume with sources,
  removal and a ventilation flow settles at `C = C_out + S / Q`. It is exact for a shut hold and good
  enough for a cabin, a room and a gun deck between broadsides.
- **[model]** Each active region of `ATMOSPHERE.md` §4 is one box; a ship is a handful of boxes joined by
  hatches whose state sets the exchange between them. A character present breathes the box's
  concentration (the lower half's for a heavy gas if crouching or lying) at the ventilation
  `PHYSIOLOGY.md` §1a gives, and the exposure is integrated per minute.
- **Visible face:** the lamp that gutters and goes out (oxygen under 16% and carbon dioxide high: the
  period's own gas detector, which miners used); the headache after an hour in the shut hold; the hatch
  thrown open.

## 3. Sources and sinks

<!-- table:gasdynamics.sources_sinks -->
*Sources and sinks a region can have* (model; confidence medium; source: Each source is one of the other docs' outputs; the rates are placeholders.)

| Source or sink | Species | Rate (placeholder) | From | Mark |
|---|---|---|---|---|
| A person at rest | O2 -0.25 L/min; CO2 +0.2 L/min; water vapour | x MET at work (a man at the pumps x7) | PHYSIOLOGY 1 | proposed |
| Livestock (goats, pigs, hens) | as a person x body-mass ratio | a goat 0.1 L/min O2 | DUTIES livestock | proposed |
| A lamp or candle | O2 -0.03 L/min each; CO2 +0.03; CO a little if it gutters | - | the ship's lights | proposed |
| A galley fire, a brazier | O2 -; CO2 +; CO + (charcoal: up to 10% of the carbon as CO when starved of air) | a brazier: CO 0.5 L/min in a shut cabin | CHEMISTRY combustion | proposed |
| A fire (structure, cargo) | by the fuel and the air available (CHEMISTRY): CO2, CO, water, soot, heat | a cargo fire: 100 L/min CO2, 20 CO, smoke 1 g/min | CHEMISTRY | proposed |
| Black powder fired | 330 cm3 of gas per gram of powder: CO2, N2, CO, H2S trace, H2, CH4; particles | a 6-pounder's 1 kg charge: 330 L of gas per shot | CHEMISTRY black powder; COMBAT guns | proposed |
| A stinkpot | SO2 from burning sulphur, smoke | 100 g sulphur: about 70 L SO2 over a minute | CHEMISTRY; COMBAT | proposed |
| Rot in the bilge and stores | H2S, CH4, CO2 | a foul bilge: H2S 0.01 L/min (enough for 500 ppm in a shut hold over a day) | the cleanliness meter (PIRATE 5a) | proposed |
| A reaction in the laboratory | whatever CHEMISTRY computes | by the reaction | CHEMISTRY | proposed |
| Plants in a closed space | O2 + by day, - by night; small | negligible except a greenhouse (none) | ECOLOGY | proposed |
| Natural vents | CO2, H2S, SO2 | by the place | ENVIRONMENT terrain | proposed |
| Sinks: surfaces, water, rain | SO2 and H2S dissolve and react on wet surfaces; particles settle (half in an hour in still air); rain washes smoke | placeholders | GAS_DYNAMICS | proposed |
<!-- /table -->

## 4. The grid (deferred)

<!-- table:gasdynamics.grid -->
*The grid model (deferred): transport on the combat map* (science; confidence medium; source: Advection-diffusion-reaction: dC/dt = -div(u C) + div(D grad C) + S - R, with u the wind field, D an effective turbulent diffusion; implemented later as a coarse cellular model on the combat grid (COMBAT 6's tiles) for releases that cross cells in seconds; the stability constraint (a cell's air must not cross more than one cell per step) sets the step. Not built; the interface is the units table.)

| Element | Statement | Status | Mark |
|---|---|---|---|
| Cells | the combat map's tiles, each a small box with the units above; elevation and enclosure from the map (COMBAT 6: tile properties) | deferred | proposed |
| Advection | the wind (ENVIRONMENT) moves a cell's air downwind by u x step; indoors, the ventilation flow | deferred | proposed |
| Diffusion and turbulent mixing | each step a cell shares a fraction with its neighbours (D x step / cell size squared) | deferred | proposed |
| Buoyancy | hot and light gases move up a level (a deck) before spreading; heavy ones pool in hollows and the low tiles | deferred | proposed |
| Deposition | particles settle; SO2 and H2S lost to wet surfaces | deferred | proposed |
| Step | seconds during a release; a cell per step at most; the box model takes over once the cloud is uniform | deferred | proposed |
| Exposure | each character sums the concentration of the cell they stand in each step (ppm-min); crouching reads the lower half | deferred | proposed |
<!-- /table -->

- **[science]** The advection–diffusion–reaction equation is the right statement of transport; the game
  needs only a coarse cellular version on the combat grid for releases that cross cells in seconds (a
  stinkpot's cloud, smoke across a deck in a fight), with the step held under one cell per step. The box
  model takes over as soon as a cloud is near uniform.
- **Mark:** deferred; the interface above is what it must honour.

## Open for Rex

1. Keep, cut, or stamp.
2. Whether the lamp-as-gas-detector face is wanted (it is real, and a lantern going out in the hold is a
   scene).
3. Rates and volumes are placeholders.

## Sources

`../SOURCES.md` key GAS-BOX (NIOSH confined-space carbon dioxide modelling; building mass-balance
references); the per-person gas rates (physiology, standard: about 0.25 L/min oxygen and 0.2 L/min carbon
dioxide at rest).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; units and the interface, the box model, sources and sinks, the grid deferred; tables in `../body/data/gasdynamics.json` | keeper |
