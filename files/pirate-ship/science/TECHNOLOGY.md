# Technology: the availability layer (body-and-world keeper, 2026-10-29)

The layer between the universal engine and the pirate world: what a setting makes available, in
equipment, fuel, power, materials, infrastructure and knowledge. The engine never checks a year; this layer
is where the year lives, as a **world profile**. Rex (2026-10-29): the world is ours in a space-time
anomaly version, so the profile is the period's defaults plus whatever anomalous pieces the story adds,
and adding one never rebuilds the engine.

**Ownership.** This file: the fields of a world profile and the pirate profile's defaults. The data
itself is the economy's and the town keeper's (`../economy/GOODS.md` goods, recipes and facilities;
`../town/` places) and stays there; this file says what the engine reads from them. `SCIENTIFIC_EQUIPMENT.md`
holds the catalogue the profile selects from.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `../body/data/science.json`.

## 1. The world profile

<!-- table:science.technology -->
*The availability layer: how equipment, fuel, power and knowledge reach a place* (model; confidence medium; source: GOODS.md's recipe rule (materials + equipment + band + knowledge, Rex 2026-10-28/29) and its facilities list are the period's technology layer already; this table adds the general fields a world profile needs so another setting is a different profile, not a rewrite.)

| Field | What it holds | Pirate-world default (1650 to 1730, Atlantic) | Where it already lives | Mark |
|---|---|---|---|---|
| equipment available | which catalogue items a place can hold: common (bought), rare (one maker, a city), none (only as a time anomaly) | the catalogue's availability column | GOODS facilities list (the still, the forge, the furnace, the chymist's laboratory) | proposed |
| manufacture prerequisites | what it takes to make a piece: materials, a trade, a facility (a glassblower for a retort; a founder for a brass pump) | glass from Europe; copper work in the islands; brass instruments from London and Amsterdam makers | GOODS recipes (equipment is a good) | proposed |
| fuel and power | charcoal, wood, bagasse, spirit, oil; the sun; wind, water and animal power; later gas, steam, electricity | charcoal and wood everywhere; a water wheel at a mill; no steam (Newcomen 1712 is in the period but not in the islands), no gas, no electricity | GOODS (charcoal, firewood as goods: open) | proposed |
| knowledge | who knows the process: common, learned, foreign (GOODS 3f), or nobody yet (the discovery is the player's) | the apothecary and the chymist know the period's preparations; everything after is nobody's | GOODS 3f (Rex) | rex (knowledge rule) |
| infrastructure | what a place can supply continuously: running water, ice, a gasworks, mains power | water by bucket; ice none (the freezing mixture needs it); the rest none | the town keeper's places | proposed |
| the anomaly plug | a tagged piece of equipment, fuel or power source introduced by the story; its catalogue numbers make its processes possible at once, with no change to CHEMISTRY.md | none unless the story adds one | COMBAT 4d provenance (Rex); the story keeper's rows | rex (2026-10-29) |
| world profile | the whole table as one record per setting (pirate 1700; a modern city; a prehistoric camp; a science-fiction ship) | this column | - | proposed |
<!-- /table -->

- **[history]** The period's technology is well recorded in `GOODS.md`: Rex's recipe rule (materials +
  equipment + band + knowledge, 2026-10-28/29), the facilities list, the knowledge rule (`common`,
  `learned`, `foreign`) and the regions. This file adds nothing to them; it names them as the pirate
  world's profile and adds the two fields the engine needs beyond them: fuel and power, and the anomaly
  plug.
- **[model]** Another setting (a modern city, a prehistoric camp, a science-fiction ship) is a different
  profile over the same engine: different availability per catalogue item, different fuels and power,
  different knowledge. That is the reuse Rex wants.
- **The anomaly plug (Rex):** a tagged piece of equipment, fuel or power source the story introduces
  carries its catalogue numbers; the assembly pipeline reads them like any other; its processes become
  possible at once; `CHEMISTRY.md` is untouched. The journal labels the piece.

## 2. What the profile answers for an attempt

| Question (the assembly pipeline's step) | The profile's answer |
|---|---|
| Is this piece here? | common (buy it; GOODS), rare (one maker or city; a voyage), none (only by anomaly) |
| Is there fuel or power for it, for the time? | charcoal, wood, bagasse, spirit, the sun; water or animal power at a mill; nothing electric |
| Can it be made here? | the manufacture prerequisites: a glassblower, a founder, a smith, the materials (GOODS recipes) |
| Does anyone know the process? | GOODS 3f: common, learned, foreign, or nobody (the player's discovery) |
| Can the place supply it continuously? | infrastructure: water by bucket, ice none, gas none, power none |

## Open for Rex

1. Charcoal and firewood as goods with prices and consumption (GOODS: open).
2. Which ports hold a rare instrument maker (the capital cities; a visiting ship's instruments).
3. Whether the Hauksbee electrical machine (1705) and Papin's digester (1679) exist in the game as rare
   curiosities a collector might own (both period).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; the world profile's fields, the pirate defaults, the anomaly plug | keeper |
