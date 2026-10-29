# Discovery: states, identification, experimentation (body-and-world keeper, 2026-10-29)

How a character comes to know what a thing is. Rex (2026-10-29): a player with real scientific
knowledge should be able to discover and attempt processes through the simulation, even ones no recipe
predefines; what he can do is limited by the equipment; what he finds is recorded in the journal.
ChatGPT (outside AI) gave the four states (encountered, observed, identified, understood) and the
distinction between making a thing and being able to name it; both kept.

**Ownership.** This file: the states, what moves an entry between them, the attempt's flow, and the
identification tests. `JOURNAL.md` is what the player sees; `SCIENTIFIC_EQUIPMENT.md` the measuring
roles; `CHEMISTRY.md` the records a thing is identified against; `../economy/GOODS.md` §3f the knowledge
rule (Rex) this file extends to things nobody has named yet.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `../body/data/science.json`.

## 1. The five separations

<!-- table:science.separations -->
*The five separations (nothing is decided by the year)* (model; confidence high; source: ChatGPT's list (outside AI), which Rex adopted in his own words: the chemistry is not limited by the period; the equipment is the limiter; a discovery out of its time is a time anomaly in the journal.)

| Question | Layer | Owner | Example (oxygen in 1700) | Mark |
|---|---|---|---|---|
| Scientific existence: does the substance or reaction exist under the simulated conditions? | the universal engine | CHEMISTRY.md, PHYSICS.md | mercury calx heated gives oxygen: yes, always | rex (2026-10-29) |
| Historical availability: could someone in this setting obtain or make it ordinarily? | the world | TECHNOLOGY.md, GOODS.md, REGIONS.md | oxygen was isolated in 1774; nobody in 1700 sells or knows it | **Rex** |
| Technological accessibility: does the character have the equipment, materials and knowledge? | the world and the character | SCIENTIFIC_EQUIPMENT.md, TECHNOLOGY.md, GOODS 3f knowledge | a burning lens, mercury calx (red precipitate: an apothecary's good) and a jar over water: all makeable in 1700 | **Rex** |
| Execution difficulty: can the character control the process? | the character | the skill minigames (Rex), STATS | steady hands and a clear day | rex (skill affects execution) |
| Provenance: what is it, in the world's history? | the journal | JOURNAL.md, COMBAT 4d tags | a real gas, discovered 74 years early: Historical and Time Anomaly | **Rex** |
<!-- /table -->

## 2. The states

<!-- table:science.states -->
*Discovery states: from meeting a thing to understanding it* (model; confidence high; source: ChatGPT's four states (outside AI), kept; the keeper adds what moves an entry between them and what the player sees at each. The microbe is the model case: Leeuwenhoek saw animalcules in 1676 and nobody understood them until the 1860s.)

| State | Meaning | Reached by | What the journal shows | What the engine lets you do | Mark |
|---|---|---|---|---|---|
| Encountered | it exists and you have met it | seeing, catching, buying, making it | a sketch and a provisional name ('an unknown liquid'; 'a red fish with a horn'); observed appearance | use it blindly: eat it, burn it, throw it | rex (the state, 2026-10-29); proposed (what moves it) |
| Observed | you have measured or tested properties | the measure roles present (balance, thermometer, hydrometer, litmus, the taste and smell, a trial by fire); time with the thing | the properties found (boils at the water bath's heat; sinks in water; turns litmus red; the fish bites at dusk) | repeat what worked; predict a little | rex (the state, 2026-10-29); proposed (what moves it) |
| Identified | you know what it is | a match to a known entry: a book, a teacher, a measuring instrument that names it (spectroscope, mass spectrometer), or the period's test (a flame colour, a precipitate) | its name, formula or species, its known uses, the historical entry (JOURNAL 7) | name it in trade and dialogue; look it up; use it in a recipe that calls for it | rex (the state, 2026-10-29); proposed (what moves it) |
| Understood | you know why it does what it does | experiment and theory: the player's own, or a book of a later century (a time anomaly in itself) | the mechanism, the reactions it takes part in, what it does to a body | design new processes with it; teach it (GOODS 3f: knowledge that survives you if written) | rex (the state, 2026-10-29); proposed (what moves it) |
<!-- /table -->

- **[history]** The microbe is the model: seen in 1676, understood in the 1860s. A thing can sit at
  "observed" for two centuries. The period's identification tests were the senses and a few reagents:
  colour in a flame, a precipitate with a known liquor, taste (the sweet urine of diabetes, the
  surgeon's taste of urine), smell, density by the hydrometer, the boiling in a bath, litmus and other
  vegetable dyes (Boyle 1664), the touchstone and parting acid for gold. Each is a measure role in the
  catalogue; later instruments (the spectroscope, the mass spectrometer) are the same role with more
  reach.
- **[model] (proposed)** Each substance and reaction record carries its identification tests (the
  reaction record's identification field): what a period test shows, what an instrument shows. An entry
  moves to Identified when a test present in the apparatus, a book, or a teacher matches the record; to
  Understood by experiment and theory, or a book from a later century, which is itself a Time Anomaly.

## 3. The attempt (what happens when a player tries something)

1. The player chooses materials and assembles equipment (the inventory; the bench).
2. The assembly pipeline runs (`SCIENTIFIC_EQUIPMENT.md` §3): materials, roles and their numbers, fuel,
   joints, the control minigame (Rex's), the conditions reached.
3. `CHEMISTRY.md` answers at the conditions reached: the product, a partial product, nothing, something
   else, an accident, or **unknown** (no record; the attempt is logged for the belt).
4. The product enters the journal as **encountered** (a provisional name), or **observed** if the
   apparatus measured anything in the making (a boiling point from a thermometer, a weight).
5. Identification follows by test, book or teacher; the historical reference unlocks; the anomaly note is
   written if the game date is before the record's date.
6. Knowledge: once identified and repeatable, the process is a recipe the character **knows** (`GOODS.md`
   §3f: written knowledge survives him; unwritten dies with him), teachable, and tradeable to a town's
   books.

- **[model]** No step consults the year. The only period facts are in `TECHNOLOGY.md` (what is
  available) and the journal's reference (what history says).
- **Visible face:** the bench, the flask of "an unknown liquid", the journal page filling in, the
  apothecary who asks what you made.

## Open for Rex

1. ~~Keep, cut, or stamp the states and the attempt flow~~ stamped (Rex, 2026-10-29).
2. The identification tests per substance: a belt data task once the reaction records exist.
3. Whether "understood" needs a theory minigame or only books and experiments.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | Rex stamped the separations, the states and the attempt flow as his | Rex |
| 2026-10-29 | File opened; the five separations, the four states, the attempt flow, period identification tests | keeper |
