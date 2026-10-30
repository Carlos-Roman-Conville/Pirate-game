# Fixtures: stand-ins the engine adapters use where the game has no system yet

Phase 5 rule 6 (`Toolchain/realism/PHASES-4-5.md`): where the simulation needs something the game does not have, the
adapter uses a named fixture declared here: what it stands in for, the value used, and the decision Rex must make. A
fixture never silently decides a rule. Values live in data files, never in code. Each adapter adds its rows below.

## Characters (`web/src/world/adapters/characters.ts`, task 2533)

Values are in `data/pirate-ship/world/characters.json`. They are the checkpoint-1 host fixtures
(`Toolchain/realism/examples/human-week.ts`), not measurements of any pirate.

| Fixture | Stands in for | Value used | Rex's decision |
|---|---|---|---|
| F-CH-1 body size | A character's mass, height and starting fat and water. `alignment/state.ts` holds a slug, a position, a location and flags; `STATS.md` §1 holds attributes, none of them a mass. | 70 kg, 175 cm, 15 kg fat, 40 kg body water, for everyone | Does a character's mass and height come from Strength, Endurance and Constitution, from the roster, or from a rolled build? Until decided, everyone is the same body. |
| F-CH-2 age | A character's age (the roster has none; `STATS.md` §1 says the attribute maximum falls with age but gives no age). | 30 years, for everyone | Give each roster entry an age. |
| F-CH-3 sex | The roster has "a man and a woman" per type (`ROSTER.md`, he / she lines) but no field in code. | male (`male: 1`), for everyone | Add sex to the character record; the engine reads it for resting rate, nutrient needs and the menstrual path. |
| F-CH-4 the room | Where the body is: a ship's deck, hold or cabin. There is no place system (task 2535). | 40 m3 of air at 24 C, 2 air changes an hour, sea-level pressure | The place adapter (2535) replaces this with the game's decks and the climate tables. |
| F-CH-5 the day | The game's day boundary. The engine closes sleep, fatigue and nutrition books at `dayStartH`. | 12 (the nautical day, noon to noon, the engine's default), 60 s steps | Confirm that the game's "day" for bodies is the nautical day, not the dawn-to-dawn day of the alignment sim's `sleep` command. |
| F-CH-6 broken sleep | Which nights count as "a 4-on-4-off night" in the recovery table (it counts 0.85 of its hours). The game has no rule for what breaks a night. | A day plan holding any watch duty (`Standing watch`, `Lookout aloft`) weighs all its sleep blocks at the engine's split quality; otherwise 1 | Decide whether a watch breaks sleep only when it falls between two sleep blocks, or whenever the character stands one. |
| F-CH-7 day plans | Who does which duty at which hour. `DUTIES.md` lists duties and the crew job, but no timetable or watch bill. | The caller passes the plan (a list of `{ fromH, toH, duty }`); the adapter holds none. The test uses watches 08 to 12 and 20 to 24, sleep 12 to 16 and 00 to 04. | Design the watch bill (`DUTIES.md` says four on, four off; the task brief says four on, eight off). |

### Duties with no engine activity (the adapter throws on them)

The met table (`files/pirate-ship/body/data/physiology.json`) has 15 rows. A duty is mapped only where a row names its
activity. These duties have none, so the adapter refuses them instead of guessing a MET (rule 1: unsupported models
are flagged, never patched):

Feeding the livestock · Rat catching · The noon sight · Heaving the log · Rationing water · Mixing grog · Cleaning the
guns · Keeping the powder dry · Tending the sick · Talking to the crew · The den · Lights out.

Decision for Rex (or a new met row from the engine): which row each of these takes, or a new row with its source.
"Lookout aloft" is mapped to *Standing watch, still* because the watch row is the nearest listed activity; confirm.

### What the engine does not return yet

`simulateDay` returns the engine's trace notes for the day (deficiency stage changes and the like) and its failed
conservation checks, untouched. The engine has no crisis record type yet (PHASES-4-5.md mentions "a death opens a crisis
record" for 2539), so the report carries none; the adapter will pass them through when the engine exports them. The
engine's `index.ts` also does not export `environment.ts`, so the place carries a constant air temperature; the
diurnal curve and the WBGT process wait for that export.
