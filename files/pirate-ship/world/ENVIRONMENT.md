# Environment: climate, weather, wind, currents, terrain and exposure (body-and-world keeper, 2026-10-29)

One of the world docs Rex asked for (`../combat/COMBAT.md` §4b: "weather and ocean currents" for external
realism). It supplies the voyage loop (`../PIRATE.md` §5, `../balance/ALIGNMENT.md` §10 fifth run-down: the
map, travel, the ocean) with weather and currents, and the body docs with **exposure**: what the air, the
sun, the rain and the sea do to a character where they stand. It feeds `../body/BODY.md` through
`PHYSIOLOGY.md` (heat, cold, hydration) and `MEDICINE.md` (vectors, hygiene). Ship wear from weather is
**not** here: `../PIRATE.md` §5a and `../DUTIES.md` own it (the combat keeper's note, item 3); this file only
hands them today's wind and sea.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; marks **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables are rendered from `../body/data/environment.json`.

**Clock.** Weather is generated per day at the overnight tick (the voyage's days are the economy's days
are the town's sleeps: `BALANCE.md` C5 item 25); the day's state is fixed for the day loop, with a squall or
a gale as a morning event (`../DUTIES.md` "events that start a morning"). Distant regions carry only the
month's climate, not daily weather.

## What Rex has decided that this file must respect

- **(Rex, 2026-10-26)** The ship's speed is worked out every day; a torn sail slows it; wind comes with the
  weather (`../PIRATE.md` §5a: today's wind × sails × fouling × stowage). This file supplies the wind.
- **(Rex, 2026-10-28)** The ocean has shipping lanes, the map is the Atlantic, waiting at a lane burns
  provisions and days (`ALIGNMENT.md` §10 fifth run-down). Currents and winds here are what makes a lane a
  lane.
- **(Rex, 2026-10-29)** Nutrition is real; water is a need. Rain catch and heat are this file's inputs to it.
- **(Rex, 2026-10-29)** Provenance tags: a real Caribbean hurricane is Historical; nothing here is tagged.

## 1. Climate

<!-- table:environment.climate -->
*Caribbean monthly climatology (Kingston-type lowland station; modern normals)* (science; confidence medium; source: FAO regional description (trade winds 24 to 32 km/h from the east, 13 to 17 knots; Montserrat 24.7 C February low to 27.2 C July high); CIMH Caribbean climatology (SST 27 to 30 C, highest September to October); UK Met Office for Kingston (750 mm a year, February about 15 mm, October the wettest at about 130 mm); hurricane season June to November, peak mid-August to late October (NHC). ENV-FAO, ENV-CIMH, ENV-MET)

| Month | Air mean (C) | Air day max (C) | Night min (C) | SST (C) | Rain (mm) | Rain days | Humidity (%) | Wind (knots, E to NE) | Hurricane risk | Season | Mark |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Jan | 25.5 | 30 | 21 | 27 | 25 | 4 | 72 | 15 | none | dry | proposed |
| Feb | 25.5 | 30 | 21 | 26.8 | 15 | 3 | 70 | 16 | none | dry | proposed |
| Mar | 26 | 31 | 21 | 26.8 | 20 | 3 | 69 | 16 | none | dry | proposed |
| Apr | 26.5 | 31 | 22 | 27.2 | 35 | 4 | 70 | 15 | none | dry | proposed |
| May | 27.5 | 32 | 23 | 28 | 100 | 8 | 74 | 13 | very low | wet (early rains) | proposed |
| Jun | 28 | 32 | 24 | 28.5 | 90 | 7 | 75 | 14 | low | wet | proposed |
| Jul | 28.5 | 33 | 24 | 28.8 | 50 | 5 | 73 | 15 | low | wet (mid-summer drought) | proposed |
| Aug | 28.5 | 33 | 24 | 29.2 | 95 | 8 | 76 | 13 | high | wet | proposed |
| Sep | 28 | 32 | 24 | 29.5 | 110 | 9 | 78 | 11 | peak | wet | proposed |
| Oct | 27.5 | 32 | 23 | 29.3 | 130 | 12 | 79 | 11 | high | wet | proposed |
| Nov | 27 | 31 | 23 | 28.5 | 70 | 7 | 76 | 13 | low | wet (ending) | proposed |
| Dec | 26 | 30 | 22 | 27.6 | 35 | 5 | 73 | 15 | none | dry | proposed |
<!-- /table -->

- **[science]** Modern normals for a lowland Caribbean station (ENV-FAO, ENV-CIMH, ENV-MET). Windward
  slopes get far more rain than leeward coasts (Kingston's 750 mm against 2,000+ mm on Jamaica's north
  coast and Blue Mountains); the table is the leeward port.
- **[history]** The period sat in the Little Ice Age: hurricanes about a quarter as frequent in 1645–1715,
  rising after; a fraction of a degree cooler; a lull in storms, epidemics and drought in the islands while
  Europe froze (ENV-LIA, ENV-LIA2).

<!-- table:environment.period_climate -->
*The period's climate: what was different in 1650 to 1730* (history; confidence medium; source: Hurricane frequency fell about 75% between 1645 and 1715 (the Maunder Minimum), from Spanish shipwreck records and Florida tree rings (Trouet et al. 2016, ENV-LIA); Bahamian blue-hole records show regional variation. Kentucky study: the Caribbean saw a lull in storms, epidemic disease and drought while Europe cooled (ENV-LIA2). A measured Caribbean temperature anomaly was not found; cooler by a fraction of a degree is the general Little Ice Age picture.)

| Factor | Modern | 1650 to 1730 | Sim use | Mark |
|---|---|---|---|---|
| Hurricanes a year reaching the islands | about 1 to 3 named systems affect the central Caribbean | about a quarter of that, 1645 to 1715; rising after | hurricane chance per wet-season month x0.25 before 1715, x0.6 after | proposed |
| Air and sea temperature | the table above | a fraction of a degree cooler (unmeasured) | none (within noise) | proposed |
| Trade winds | 13 to 17 knots | assumed the same | none | proposed |
| Storm records | - | Barbados 1675, Jamaica 1712 and 1722 hurricanes are recorded (Johnson mentions the 1722 Jamaica storm) | named events for the story keeper, not a rule | proposed |
<!-- /table -->

- **Mark:** **(proposed)** the table as the game's climate; the Little Ice Age hurricane rule
  **(proposed)** from the sources.

## 2. Weather: the daily generator

**Inputs:** month, region (the open sea, the islands, the Gulf, the Guinea coast, the North Atlantic),
yesterday's state. **Outputs:** today's state (wind, sea, rain, cloud) and its effects.

- **[model] (proposed)** A Markov chain per month: each state has a stay probability and the season's
  weights for what it becomes next; a hurricane is drawn once per wet-season month at the period rate and
  then approaches over three days (a falling glass, a swell, the birds: the lookout's and navigator's
  warning, `../DUTIES.md`).

<!-- table:environment.weather_states -->
*Daily weather states and their effects (the generator)* (model; confidence low; source: A per-day Markov chain by month: each state has a stay probability and transitions; the effects are the keeper's placeholders. Wind and current set the ship's speed with PIRATE.md 5a's daily speed formula.)

| State | Wind (knots) | Sea state | Rain | Cloud/sun | Stay chance | Dry-season weight | Wet-season weight | Effect on the ship | Effect on the body | Mark |
|---|---|---|---|---|---|---|---|---|---|---|
| Calm (the doldrums near the coast) | 0 to 5 | flat | none | full sun | 0.4 | 0.1 | 0.15 | speed x0.2; rowing the boat; water use up | WBGT high: heat strain; sunburn | proposed |
| Trade-wind fair | 12 to 18 | moderate | none or a passing shower | scattered cloud | 0.7 | 0.6 | 0.4 | speed x1.0 | comfortable on deck; seasickness low | proposed |
| Fresh trades | 18 to 25 | rough | showers | cloud | 0.5 | 0.2 | 0.2 | speed x1.1 but sail wear x1.5; hull strain | seasickness x2; falls aloft x1.5 | proposed |
| Squalls | 25 to 35, gusting | rough, confused | heavy, short | dark | 0.3 | 0.05 | 0.15 | a torn sail event; rain catch for water | wet, cold at night; falls x2 | proposed |
| Gale | 35 to 47 | very rough | driving rain | overcast | 0.4 | 0.03 | 0.07 | reef or lose sails; hull leaks; cargo shifts; 'all hands' | no sleep; cold wet; falls x3; a man overboard roll | proposed |
| Hurricane | over 64 | phenomenal | torrential | black | 0.6 | 0 | 0.03 (x0.25 before 1715) | the ship may be lost; a port may be wrecked (town keeper's event) | injuries, drownings, exposure | proposed |
| Norther (winter cold front, Gulf and western Caribbean) | 20 to 30 from the N | rough | rain then clear | clear and cool | 0.5 | 0.1 | 0 | a lee shore on the Mosquito Coast | night air 15 to 18 C: the one cold hazard of the region | proposed |
<!-- /table -->

- **Effects:** the ship's daily speed (Rex's formula, `PIRATE.md` §5a) reads wind; sail and rigging wear
  read sea state (`DUTIES.md` "if skipped" grows faster in fresh weather: the ship keeper's rule to set);
  exposure (§5) reads rain, sun and wind; seasickness and falls read sea state (`PHYSIOLOGY.md` §9, the
  accident rolls); water catch: a squall fills casks (rain mm × sail area, proposed).
- **Visible face:** the sky and sea on screen (art keeper); the glass and the swell in the navigator's
  morning line; "a storm coming" as a morning event (Rex's list).
- **Mark:** **(proposed)**.

## 3. Wind and sailing

- **[science]** The trades blow from the east and north-east at 13–17 knots most of the year, lighter in
  summer (ENV-FAO). A square-rigged ship of the period sailed poorly to windward (no closer than about six
  points off the wind), so eastward passages beat up the island chain and westward ones ran free.
- **[model] (proposed)** Speed over ground = Rex's daily speed × a point-of-sail factor (running 1.0,
  reaching 1.1, close-hauled 0.6, in irons 0) + current along the course (§4). Lanes on the map are the
  routes where wind and current favour a passage; the economy's lanes (`ALIGNMENT.md` fifth run-down) can
  be drawn from this table once the map exists.
- **Visible face:** days to port in the navigator's line; the sails' set on screen.
- **Mark:** **(proposed)**; Rex's speed formula preserved.

## 4. Currents

<!-- table:environment.currents -->
*Ocean currents the voyage loop uses* (science; confidence medium; source: Florida Current 1.8 m/s (about 3.5 knots) at its core, transport 30 Sv; the Caribbean Current reaches 60 to 70 cm/s (1.2 to 1.4 knots) along the Venezuelan, Colombian and Panamanian coasts, with a 1953 Navy survey reporting 'often exceeding one knot'; Antilles Current sluggish at the surface (about 10 cm/s); the Gulf Stream carries the Florida Current north then east. ENV-CUR)

| Current | Where | Direction | Typical surface speed (knots) | Sim use | Mark |
|---|---|---|---|---|---|
| Caribbean Current | the southern Caribbean, strongest along the Venezuelan and Colombian coasts | west, then north-west toward Yucatan | 0.5 to 1.4 | a free knot westbound; a knot against eastbound (why ships beat east along the islands) | proposed |
| Yucatan Current and the Loop Current | the Yucatan Channel into the Gulf | north | 1 to 2 | the way into the Gulf of Mexico | proposed |
| Florida Current | the Straits of Florida | north | 2 to 3.5 | the homeward highway of the Spanish fleets; the Bahamas wreckers' hunting ground | proposed |
| Gulf Stream | off the American coast to the Grand Banks | north-east | 1 to 2.5 | the crossing to Europe | proposed |
| North Equatorial Current | the open Atlantic, 10 to 20 N | west | 0.5 to 1 | the outbound crossing from the Canaries and the Guinea coast | proposed |
| Antilles Current | north of the Greater Antilles | north-west | 0.2 (sluggish, variable) | negligible | proposed |
| Canary and Guinea Currents | off Africa | south then east | 0.5 to 1 | the Africa trade route | proposed |
<!-- /table -->

- **[science]** ENV-CUR: the Florida Current runs about 3.5 knots at its core; the Caribbean Current 0.5 to
  1.4 knots, strongest along the South American coast; the Antilles Current is sluggish at the surface.
- **[history]** The Spanish fleets rode the Florida Current and the Gulf Stream home; the Bahamas wreckers
  and the pirates of New Providence lived off that highway (`../economy/GOODS.md` row 132).
- **Mark:** **(proposed)** as the voyage loop's current table.

## 5. Exposure: what the body reads

<!-- table:environment.exposure -->
*Where a character is: the exposure the body reads* (model; confidence medium; source: WBGT estimated from air temperature, humidity and sun (the Australian Bureau of Meteorology approximation is the usual shortcut; shade and wind lower it); the mosquito and water multipliers are MEDICINE.md hygiene rows placed by terrain; the rest are the keeper's placeholders.)

| Place / terrain | Shade | Wind felt | WBGT vs open deck | Wet | Mosquito exposure | Foul-water exposure | Fall or accident hazard | Mark |
|---|---|---|---|---|---|---|---|---|
| Open deck, day | none | full | +0 | spray | x0.3 (at sea), x1 at anchor | the casks | x1 | proposed |
| Aloft | none | more | -1 C | spray, rain | x0.3 | - | x5 (falls); x10 in a gale | proposed |
| Below decks, under way | full | none | +3 C (crowding, the galley) | damp | x1 at anchor | bilge x2 | x1 (a loose cask) | proposed |
| The galley | full | none | +6 C | dry | x1 | x1 | burns x3 | proposed |
| A swampy anchorage or river mouth (wet season) | some | little | +1 C | rain | x4 | x3 | x1 | proposed |
| A dry coral island, the beach (careening) | palms | trades | +2 C in the sun | dry | x1 | x1 (no fresh water: the casks) | x2 (the ship on its side) | proposed |
| Rainforest hills | full | none | -2 C, humid | wet | x3 | x2 (streams) | x2 | proposed |
| A plantation town | buildings | some | +1 C | dry season dry | x2 wet season | x2 (wells) | x1 | proposed |
| The tavern, the brothel | full | none | +2 C | dry | x1 | x1 | brawls x3; the pox (MEDICINE) | proposed |
| The Guinea coast | some | little | +2 C | wet | x6 (falciparum) | x3 | x1 | proposed |
| North Atlantic winter | none | gale | cold: PHYSIOLOGY cold rules | soaked | 0 | x1 | x4 | proposed |
<!-- /table -->

- **[model]** `PHYSIOLOGY.md` reads a WBGT estimate (from air temperature, humidity, sun and the place's
  shade and wind) and a felt temperature for cold (air, wind, wet); `MEDICINE.md` reads the vector and
  water multipliers by place; the accident hazard multiplies the day loop's fall and burn rolls. The place
  a character spends the day in comes from their post (`../DUTIES.md`) or the scene.
- **Visible face:** sweat and sunburn in the portrait (art keeper, open); "the fever port" in gossip;
  mosquito nets as a good (open: not in `GOODS.md`).
- **Mark:** **(proposed)**.

## 6. Sun and daylight

<!-- table:environment.sun -->
*Sun and daylight* (science; confidence high; source: At 15 to 20 N day length runs from about 11 h (December) to 13 h (June); the sun is overhead twice a year; UV index at noon 11+ in summer (modern). Sunburn in untanned skin in 15 to 30 minutes at noon.)

| Month | Daylight (h) | Noon sun | Sunburn time, untanned (min) | Sim use | Mark |
|---|---|---|---|---|---|
| Dec to Jan | 11 | high | 30 | watches and the day loop's day length; night work longer | proposed |
| Mar and Sep | 12 | overhead | 20 |  | proposed |
| Jun to Jul | 13 | overhead | 15 | sunburn a MEDICINE minor condition (pain 2, sleep x0.9) for the new hand | proposed |
<!-- /table -->

- **Effects:** day length sets the day loop's light hours and the watches' dark hours; light feeds
  detection (`COMBAT.md` §6: light as a map property, proposed, outside AI; this file gives the sun and
  moon, the map gives the shade).
- **Mark:** **(proposed)**.

## 7. Terrain

- **[history]** The islands are volcanic (mountains, rainforest, windward rain: the Lesser Antilles, Jamaica's
  Blue Mountains), coral and limestone (dry, flat, no rivers: Barbados, the Bahamas, the Caymans), and the
  mainland coasts (the Mosquito Coast's lagoons and rivers, the Yucatan's bush, the Spanish Main's hills).
  Each has its water (rivers vs cisterns), its fevers (swamps vs dry cays), its food (`ECOLOGY.md`) and its
  hazards (reefs: the Bahamas Bank, the Serranilla and the Vipers; a lee shore in a norther).
- **[model] (proposed)** Terrain is a tag on a region and on a map tile (for `COMBAT.md` §6's elevation,
  cover and sound: materials × terrain, Rex): beach, reef flat, mangrove, swamp, forest, hill, town, deck.
  The exposure table reads the tag.
- **Mark:** **(proposed)**; the combat-side tile properties are the combat keeper's.

## 8. What this file hands to the others

| To | What | Where it is used |
|---|---|---|
| `../PIRATE.md` §5a, `../DUTIES.md` | today's wind, sea state, rain (water catch), a storm event | daily speed, ship wear, morning events |
| `../body/PHYSIOLOGY.md` | WBGT estimate, felt temperature, wet, immersion water temperature, daylight | heat, cold, hydration, sleep |
| `../body/MEDICINE.md` | vector and water multipliers by place and season; hazard multipliers | exposure |
| `ECOLOGY.md` | rain, season, hurricanes | yields, stocks |
| `POPULATION.md` | the fever season, a hurricane or drought year | deaths, migration |
| the economy and the map (`ALIGNMENT.md` §10) | currents and winds for lanes and passage times; the hurricane season for prices | voyages |
| `../combat/COMBAT.md` §6 | sun, moon, weather light levels | detection (light as a map property) |

## Open for Rex

1. Whether the game's year has real months (the calendar above) or Stardew-like seasons; the voyage
   "season" in `PIRATE.md` §5 is proposed as a run of days.
2. Hurricanes as a loss-of-ship event: how deadly (touches the balance guarantee and the town's fates if a
   port is wrecked).
3. Mosquito nets and awnings as goods (not in `GOODS.md`; the economy's lane).
4. All generator weights are placeholders for the simulator.

## Sources

`../SOURCES.md` keys ENV-*: the FAO regional climate note, the CIMH Caribbean climatology, the UK Met
Office Kingston normals, Trouet et al. 2016 on the Maunder-Minimum hurricane lull, the Kentucky "eternal
spring" study, NOAA/AMS and the Miami RSMAS current pages, the 1953 Navy survey of the Caribbean Current.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; climate table, the period's climate, the weather generator, wind and sailing, currents, exposure by place, sun, terrain; tables in `../body/data/environment.json` | keeper |
