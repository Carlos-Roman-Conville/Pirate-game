# The science engine: plan (body-and-world keeper, 2026-10-29)

Rex's objective (2026-10-29): a reusable scientific simulation engine in which the laws of nature stay
consistent, the equipment decides what can be done, and the journal records what the player discovers,
including discoveries that break the world's expected timeline. The pirate game is the first
configuration. This plan sizes ChatGPT's priorities (outside AI) against what exists and what the belt
can do; every row is proposed; nothing here is engine code.

## The three layers (Rex's, via ChatGPT; adopted)

| Layer | Owns | Files |
|---|---|---|
| Universal scientific engine | substances, reactions, equipment capabilities, physical laws, biological interactions; no historical restriction | `CHEMISTRY.md`, `PHYSICS.md`, `SCIENTIFIC_EQUIPMENT.md`, the body docs, `../world/ATMOSPHERE.md`, `GAS_DYNAMICS.md` |
| World and technology | what a setting makes available: resources, equipment, fuel, power, infrastructure, knowledge | `TECHNOLOGY.md`, `../economy/GOODS.md`, `REGIONS.md`, the town keeper's places |
| Discovery and journal | what the player has met, learned, identified, made or invented, against the historical record | `DISCOVERY.md`, `JOURNAL.md` |

## The audit (what already existed, kept)

- Rex's recipe rule: materials + equipment + band + knowledge (`GOODS.md` §3c, §3f), and the facilities
  list (the still, the forge, the furnace, the chymist's laboratory). The technology layer's period data.
- Rex's knowledge rule: nobody learns a skill or recipe from thin air; written knowledge survives its
  holder (`GOODS.md` §3f). The discovery layer's last step.
- Rex's provenance tags (`../combat/COMBAT.md` §4d): mythical, Triassic, sci-fi, on the item screen, never
  in battle; ChatGPT's seven-label set recorded there. The journal's labels.
- The body family's substances (nutrients, drugs, gases) and the air layer's species: the engine's first
  records. The skill tree's science trades (Apothecary, Assaying, Distilling, Smithing, Surgery).
- Nothing duplicated: this folder adds the schemas, the catalogue, the states and the journal shape, and
  points at the rest.

## The phases

<!-- table:science.plan -->
*The development plan for the universal science engine (phases, sizes, who)* (model; confidence high; source: ChatGPT's eight priorities (outside AI) sized by the keeper against the belt's capacities (CARD_GAMEDEV, the belt lanes) and the family's existing docs. Research and data tasks are Composer-scale; design decisions are Rex's; nothing is engine code yet.)

| Phase | Work | Deliverable | Size and who | Depends on | Status | Mark |
|---|---|---|---|---|---|---|
| 1 | Universal chemistry schema and principles | CHEMISTRY.md reframed: domains, the five separations, 'unknown not impossible', kinetics and equilibrium fields on reactions | done this turn (keeper) | - | done | proposed |
| 2 | The equipment catalogue, complete | every apparatus from antiquity to now across chemistry, physics, biology, medicine, metallurgy: the catalogue's columns researched per item with sources (dates, inventors, predecessors, materials, energy, ranges, precision, capacity, needs, skills, enables) | a belt research lane on Composer or Sonnet: about 300 items, 10 to 20 per task; the seed of 60 is here | phase 1 | seed done; the rest a belt lane | proposed |
| 3 | The capability-based apparatus model | the roles and the assembly pipeline (SCIENTIFIC_EQUIPMENT 1 and 3) as data an engine can run; a joints and seals rule; accidents | design done here; engine later | phase 2 | design done | proposed |
| 4 | The technology and availability database | a world profile for the pirate setting: which items are common, rare or none per port; fuel and power per place; manufacture prerequisites tied to GOODS recipes; the facilities list reconciled | the economy lane with the town keeper; Composer tasks | phase 2 | fields done; data open | proposed |
| 5 | The discovery and identification system | the four states and what moves them; identification tests per substance (period tests: flame, precipitate, taste, litmus, density; later instruments); the 'unknown liquid' flow | design done here; the tests per substance a data task | phases 1 and 2 | design done | proposed |
| 6 | The journal | entry shape, classifications, the five historical dates per entry; the first 200 entries (the goods, the diseases, the fish, the period apparatus) as data | the entry shape done; entries a belt data task (Composer), the fiction ones the story keeper's | phases 1, 2, 5 | shape done | proposed |
| 7 | Science and the skill minigames | the chymist's, assayer's, distiller's, surgeon's minigames as control tasks (temperature, timing, measurement, handling) over the apparatus; skill sets difficulty, never the chemistry | Rex designs the minigames (house rule); the keeper lists the control variables per apparatus | phase 3 | open (Rex) | rex (minigames are his) |
| 8 | Anomalous discovery tests | scenarios to prove discoveries emerge from equipment without unlocks: oxygen from mercury calx with a burning lens (1700); hydrogen from iron and spirit of salt in a jar over water; phosphorus from urine (1669, Historical); the voltaic pile from zinc and copper if someone knows; the brewer's CO2 pooling in the vat-house | the simulation lab (engine work; the belt once the rules stand) | phases 3 to 5 | scenarios listed; engine later | proposed |
| 9 | Physics | PHYSICS.md: energy, heat transfer, pressure, mechanics as the shared layer the others already use (thermal balance in PHYSIOLOGY, pressure in ATMOSPHERE, the ship's speed in ENVIRONMENT); no physics agent exists: the keeper's stub, Rex to assign | stub done | - | stub | open (who keeps it) |
| 10 | Dashboard | a Science tab (equipment, assembly, discovery states, classifications, the plan) with the chemistry tab beside it; later an apparatus builder that checks a process's conditions against chosen equipment (a calculator, not the engine) | the tab done this turn; the builder a follow-up | phases 2 and 3 | tab done | proposed |
<!-- /table -->

## What goes on the belt (once Rex keeps the rules)

1. **The equipment catalogue**: about 300 items, every column, with sources; 10 to 20 per task; Sonnet
   for research, Composer for the data. Start with the period's apothecary, assayer, distiller, smith,
   glassblower and surgeon, then the eighteenth and nineteenth centuries' chemistry, then the rest.
2. **The chemistry database**: substances and reactions per domain, the period's preparations first
   (Lemery's *Cours de chymie*, 1675, is the period's own textbook and a source list in itself), then the
   anomaly set, then by demand from the journal's "unknown" log.
3. **Identification tests** per substance (period tests and instruments).
4. **The journal's first entries**: the goods, the diseases, the fish, the period apparatus; the story
   keeper's fiction rows.
5. **The pirate world profile**: availability per catalogue item per port; fuels; makers (with the
   economy lane and the town keeper).
6. **The simulation lab** scenarios (the anomalous discoveries; the air scenarios) once the engine
   exists.

## Open for Rex

1. Keep the three layers and the folder; assign a keeper for `science/` (the body keeper opened it).
2. Start the catalogue lane now, or after the first build.
3. The minigames for the apparatus (yours).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | Plan opened after Rex's correction of the chemistry scope; the audit, the three layers, ten phases, the belt list | keeper |
