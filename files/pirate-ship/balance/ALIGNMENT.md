# The alignment system: the game's backend spec (Rex, 2026-10-28)

The rules the alignment engine is built from, and the one place they're written. Rex gave them on 2026-10-28, partly
in his own words and partly by adopting an outside AI's write-up ("everything the AI has said I'm in agreement
with"). Marks: **(Rex)** his, including what he adopted; **(proposed)** the keeper's engineering choice or the
outside AI's idea, not canon until Rex says; **(open)** undecided: stays a configurable value or an explicit
"unresolved" in code, never a guess. Balance findings stay in `BALANCE.md`; this file is the system.

**The principle (Rex):** player decisions influence characters; characters influence institutions; institutions
determine the town's alignment; a perfect town is one whose institutions have all developed into one consistent
alignment.

**The build rule (Rex):** this is the actual game backend, not a throwaway. The simulator calls the same engine the
game will call; nothing is implemented twice. Undecided rules are configuration or marked unresolved, never
invented.

## 1. The square

- **(Rex)** Two continuous axes, each -100 to +100. X: orderly (negative) to chaotic (positive). Y: evil (negative)
  to good (positive). (0, 0) is the centre. Quadrants: OG (−, +), CG (+, +), OE (−, −), CE (+, −).
- **(Rex)** Everyone (the player, each character, each institution, the town) has a position in the square, so
  alignment changes gradually and mixed outcomes exist. A quadrant name is a reading of a position, not the state.
- **(Rex)** Nine regions, read from a position with two provisional thresholds (values are balancing parameters,
  in data, not code):
  - **Neutral**: |x| < 15 and |y| < 15 (the centre square).
  - **Pure** quadrant: |x| ≥ 30 and |y| ≥ 30.
  - **Hybrid** bands, outside the neutral centre, within 30 of a dividing axis: upper centre = OG+CG; lower centre
    = OE+CE; middle left = OG+OE (ending name **Twisted Virtue**, Rex); middle right = CG+CE (names open).
- **(Rex)** Every position must classify; the thresholds leave a transitional ring (for example (20, 20): neither
  pure nor clearly one band), and it must be handled explicitly.
- **(proposed, keeper)** Transitional rule: the axis with the larger |value| decides the band (|x| > |y| → a
  left/right band; |y| > |x| → an upper/lower band). **(Rex, 2026-10-28)** An exact tie (|x| = |y|) **keeps
  whatever region the character was in before this step**: no snap (`tieBreak: keep-previous`). So every position
  carries its previous region with it, and `classify` takes it. (The Cursor Opus review found that with anchors on
  the diagonal a character walking from the centre ties at every step; with "neutral" the three neutral starters
  would jump from neutral straight to pure. Rex's rule removes that.) A classification with no previous region
  (the first one at a start) uses the position alone; the only tie there is the centre, which is neutral.
  Rex's own sketch (2026-10-28) shows a small neutral square at the centre and "at least a quarter past the
  middle is choosing something"; the 15 and 30 are the outside AI's provisional numbers, kept until Rex tunes them.

## 2. What moves alignment: events

- **(Rex)** Three sources: **dialogue** (choices in conversation with crew), **quest decisions** (choices inside a
  questline), **independent actions** (things you do outside quests: kidnap, heal, steal, help…).
- **(Rex)** Each source's items are **minor** or **major**; the designation sets how much influence they carry.
- **(Rex)** Every event has an alignment category: OG, CG, OE or CE.
- **(Rex)** All three go through **one shared engine** as events. Two records (keeper's shape, proposed, after the
  Cursor Opus review): the **definition** is data, `EventDef { id, source: dialogue|quest|action, category:
  og|cg|oe|ce, weight: minor|major }` (Rex's writing, in `events.json`); the **occurrence** is runtime,
  `EventOccurrence { defId, witnesses: [slugs], playerActs: bool, day }`, filled by the game (who was present) or
  the simulator. The engine only knows the records.
- **(Rex)** Alignment **accumulates**: a minor event moves a little, a major one more; repeated events carry someone
  across the square. Nothing changes instantly.
- **(open)** The step sizes and the step itself. Placeholders in data: minor 10, major 25 on the ±100 square,
  movement as a step toward the destination quadrant's anchor point (anchor (±70, ±70), also a placeholder);
  `step.metric` = a fixed Euclidean distance toward the anchor (not a fraction of the remaining distance, so a lean
  can arrive); `step.overshoot` = stop at the anchor. Rex tunes; the engine never hard-codes any of it.

## 3. The player

- **(Rex)** The player's own alignment moves by the event's category: OG acts move them toward OG, and so on. (This
  answers the earlier open B, `../story/QUESTLINES.md`: the player earns alignment too, alongside the witnesses.)
- **(Rex)** The player's position is their moral development over the game; the game reads it like any other.

## 4. Characters

- **(Rex)** Each character has a four-direction **response chart** (the inner rules; `../story/characters/*.md`,
  copied in `maps.json` and, once built, `data/pirate-ship/alignment/charts.json`). The event's category picks the
  arrow; the arrow's destination is where the character moves. Charts say how a character responds, never where
  they start.
- **(Rex)** A **dashed ring** on quadrant Q (a loop) means a Q event doesn't move them to a new quadrant; it leans
  them toward Q, and kept up, it carries them all the way in (2026-10-28). Engine reading: a smaller step toward
  Q's anchor (`leanFactor`, placeholder 0.5 of a normal step).
- **(Rex)** Only characters who **witness** an event receive its influence. For now: characters present during the
  event (aboard and in the party). **(open)** Whether absent characters can learn of events later.
- **(Rex)** Alignment **persists through crew rotation**: a character who leaves keeps their position; recruiting
  them again doesn't reset it. Required by the progressive storyline.
- **(Rex)** A character's nature isn't corrupted by the quest they go on; the chart is the only thing that moves them.
- **(proposed, keeper)** `reachable(chart, quadrant)` lives in the engine's `charts.ts` (the question `reach.py`
  answers); once it exists `reach.py` and `maps.json` are retired, so the rule isn't written twice.
- **(Rex, special case)** The INTJ: shown her belief is wrong, she becomes neutral (`intj-f.md`). **(open)** what
  "neutral" does in the engine (a jump to the centre? a new chart?). Parked as an unresolved verb, not built.

### Starting positions (Rex, 2026-10-28, "for now")

| Slug | Character | Start |
|---|---|---|
| `entp-m` | ENTP mechanic | CE |
| `intp-m` | INTP farmer | OE |
| `entj-priest` (slug placeholder) | ENTJ evil priest | OE |
| `intj-f` | INTJ apothecary | OE |
| `enfj-m` | ENFJ warehouse heir | Neutral |
| `infj-m` | INFJ veteran engineer (the mechanic) | OG |
| `enfp` (slug placeholder) | ENFP town-hall rival | CG |
| `infp-m` | INFP courtesan | OE |
| `estj-f` | ESTJ privateer | OE |
| `istj-m` | ISTJ priest | OG |
| `esfj-m` | ESFJ failed merchant | CG |
| `isfj-f` | ISFJ doctor | OG |
| `estp-f` | ESTP outdoorswoman | Neutral |
| `istp-f` | ISTP hunter | Neutral |
| `esfp-f` | ESFP cook | CE |
| `isfp` (slug placeholder) | ISFP brothel rival | CE |

- **(open)** The coordinates a category maps to: config `startCoords`, its own key, not the movement anchor
  (placeholder (±50, ±50) for a pure quadrant, (0, 0) for neutral; starting on the anchor would make a lean a
  no-op from turn one). Starting category and chart are independent (Rex).

## 5. Institutions

- **(Rex)** The town's institutions, one per competing sector (`BALANCE.md`, The model): church (ISTJ vs ENTJ
  priest), healing (ISFJ clinic vs INTJ apothecary), food (INTP farm vs ESFP butcher shop), hunting (ESTP vs ISTP),
  inventions (ENTP vs INFJ), commerce (ENFJ warehouse vs ESFJ merchant), brothel (INFP vs ISFP, tentative), town
  hall (ESTJ vs ENFP, tentative). Slot ids are the town keeper's (`../town/UPGRADES.md`).
- **(Rex)** Each institution develops into alignment-specific forms (an OG church looks, works and behaves
  differently from a CE church). An institution reflects the character who ultimately shapes it.
- **(Rex) Transformation rule.** A character's alignment doesn't change their institution at once. When the
  character **returns to town and resumes responsibility** for it, the institution becomes **eligible**. The
  transformation happens in the **overnight update when the player sleeps**; on waking the player sees the new
  form. Example: the ISTJ drifts toward CG aboard; the church is unchanged until he returns; after the next sleep
  it becomes its CG version.
- **(Rex)** The game tracks separately: character alignment, the institution's current alignment, and pending
  transformations. One mechanism, reused by every institution.
- **(open)** The precise rule for when an institution adopts or locks its alignment (every sleep after a return?
  once? only on a developed institution?). Config `institutionLock`, default unresolved-but-runnable: re-read the
  owner's region at every sleep while they're in town.
- **(proposed, keeper)** State is kept **per slot** (two places per sector, `institutions.json` `slots`), and the
  sector's winner is derived, so "both of a pair developed" (C1 b) and `perfectCounts` are expressible. Each
  slot's forms per quadrant are data (`forms`, names open: the town keeper's). `sleep` returns the list of
  transformations, so the waking screen can show them; the day counter lives in state.
- **(Rex, 2026-10-28)** A place whose owner leaves for good **freezes at whatever alignment it had**
  (`ownerDeparted: freeze`; the INFJ is the case).
- **(open)** Two cases the review found, each a config key, placeholder in brackets: a pending institution whose
  owner is aboard again at sleep (`pendingWhenAboard` [keep]); a developed place whose owner hasn't slept yet, `pos`
  null, in the town's mean (`undevelopedCounts` [skip]).
- **(Rex, 2026-10-28) The ghost rule applies to every pair**, as the food rule does: recruit neither → both
  places go to ghosts; recruit one → it develops, the rival's drifts toward ghosts; recruit both → both develop
  (`ghostRule: every-pair-both-improve`). The food pair's secret duel on "both" stays the food pair's (not designed).
  **(Rex, 2026-10-28)** Recruiting alone doesn't develop a place: it takes more, a sub quest or supplying what
  they need (the farm's bodies), so a recruited character's place can stay undeveloped. In the engine `develop`
  is therefore its own command the game sends when that condition is met (the condition itself is story data, per
  character, Rex's); `recruit` never develops. **(open)** when a place turns ghosted; whether ghosted is its own
  slot state.

- **(Rex, 2026-10-28; `town/UPGRADES.md` food source, `story/characters/*.md` `develops_place`)** The develop
  conditions the story gives so far: the farm (`port.farm`, INTP) and the butcher shop (`port.bakery`, ESFP) develop
  only if you **supply the bodies** (how many, whether you must keep supplying, what happens if you stop: open).
  Every other character's condition is **open** (their `develops_place` field).
- **(proposed, keeper, 2026-10-28; Rex: "put the develop conditions into the simulator as data next, the ones the
  story already gives")** `conditions.json`: per slot, the list of things that must be supplied before `develop`
  is accepted, e.g. `"port.farm": { "supply": ["bodies"] }`. A `supply { slot, what }` command marks one as
  supplied (the game issues it from whatever system hands over the goods; the engine doesn't know what bodies are);
  `develop` refuses a slot with an unmet supply. Placeholder reading: supplying once is enough. A slot absent from
  the file has no known condition and develops on the command alone, which is the open state, not a rule; when
  Rex writes a character's condition it goes in here as data and the engine doesn't change.

## 6. The town and its endings

- **(Rex)** The town's alignment is determined by the alignments of its developed institutions. Each contributes its
  own alignment; the town's position emerges from them.
- **(Rex, 2026-10-28)** The combining calculation: the town's position is the **mean of the developed
  institutions' positions** (`townAggregate: mean`). Weighting by influence (`../town/ENDINGS.md`, proposed by the
  outside AI) is not used.
- **(Rex)** Nine town endings: the four pure quadrants, the four hybrids, and neutral (the ghost town).
- **(Rex) Perfect town:** every relevant institution has developed into the **same** alignment. Consistency, not
  goodness: a perfect CE town is perfect. Eight developed institutions in four alignments is prosperous, not
  perfect. Perfect endings should be hard but achievable wherever the rules permit.
- **(Rex, 2026-10-28)** Which institutions count toward perfection: **every developed place**, including the
  loser of a pair if it was developed (`perfectCounts: all-developed`). So a sector where both were developed
  needs both in the same quadrant for a perfect town. **(open)** whether a ghosted building counts (it isn't
  developed, so for now it doesn't).
- **(Rex)** Hybrid endings have real width: a town strongly orderly but split good/evil is Twisted Virtue, a mixed
  society, not a transition.

## 7. The crew (unchanged, for the engine's state)

- **(Rex)** 3 crew slots to start; rotation is a progressive storyline. The engine tracks each character's
  `location` (`town | aboard | departed`) and `inParty`, with crew commands `recruit`, `party`, `leave` (leave =
  return to town, §5) and a `crewSlots` number in data. Why someone joins or leaves (gates, storylines) is story,
  outside the engine; the engine only refuses a fourth aboard.
- **(Rex, 2026-10-27; `town/TOWNS.md`, `story/characters/INDEX.md`)** Joining gates: the INTP farmer, the old ESTP
  soldier, the ESFP cook and the ISFJ doctor need **higher reputation plus their completed sub quests** before
  they'll consider joining (which reputation and what level: open; a fifth gated recruit: open). The ISFJ joins
  **only if you have the ESTP in your party** (`isfj-f.md`).
- **(proposed, keeper, 2026-10-28; Rex: "put the known joining gates into the simulator as data")** The gates are
  data, `gates.json`, one entry per gated slug with two kinds of condition. `aboard: [slugs]` the engine checks
  itself: `recruit` refuses unless every listed character is aboard (placeholder reading of "in your party" as
  aboard, i.e. in the crew; **(open)** whether Rex means the event party instead). `story: true` stands for the
  reputation and sub quests, which live outside the engine (`STATS.md`, `TOWNS.md`): the game sends an
  `unlock { slug }` command when the story grants them, `recruit` refuses a story-gated character who hasn't been
  unlocked, and `unlocked` is kept per character in state. In the simulator an unlock is one step, so every route
  shows and counts the earning instead of skipping it. Nothing in the engine knows what reputation or a sub quest
  is; when those are built, their systems issue the unlock.

## 8. What stays configurable or unresolved (never invented)

**(Rex, 2026-10-28)** Build with the placeholder numbers (minor 10, major 25, anchors at 70, starts at 50, lean half a
step); Rex tunes after the simulator runs.

| Key | Default (placeholder) | Status |
|---|---|---|
| `thresholds.neutral`, `thresholds.pure` | 15, 30 | Rex (provisional) |
| `tieBreak` (|x| = |y| in the ring) | keep-previous | Rex (2026-10-28) |
| `step.minor`, `step.major`, `anchor` | 10, 25, (±70, ±70) | open |
| `step.metric`, `step.overshoot` | fixed distance; stop at anchor | open |
| `startCoords` | (±50, ±50); neutral (0, 0) | open |
| `crewSlots` | 3 | Rex |
| `ownerDeparted` | freeze | Rex (2026-10-28) |
| `pendingWhenAboard`, `undevelopedCounts` | keep, skip | open |
| `leanFactor` | 0.5 | open |
| `witnesses` | present only; absent learning off | Rex (for now) / open |
| `institutionLock` | re-read each sleep while owner in town | open |
| `ghostRule` | every-pair-both-improve | Rex (2026-10-28) |
| `townAggregate` | mean | Rex (2026-10-28) |
| `perfectCounts` | all-developed | Rex (2026-10-28) |
| INTJ "becomes neutral" | not built | open |
| `conditions.json` (develop conditions) | farm and butcher shop need `supply bodies`; all other slots open | Rex (facts, 2026-10-28); representation proposed |
| `gates.json` (joining gates) | ISFJ needs ESTP aboard; INTP, ESTP, ESFP, ISFJ story-gated (`unlock`) | Rex (facts, 2026-10-27); representation proposed |

## 9. Architecture (keeper's, after the Cursor Opus review of 2026-10-28; built by the belt)

Separate pieces, like the card games' `effects` (data) and engine (verbs): a change to content never touches the
engine, and a change to one engine piece doesn't touch the others. **One entry point:** the engine is a reducer,
`reduce(state, command, config) → { state, log }`, over a command union (`event | recruit | party | leave |
develop | sleep | unlock | supply`). The game's screens, the server's replay and undo, saves, and the simulator all fold the same
command log through it; nothing re-sequences the verbs by hand.

```
data/pirate-ship/alignment/          content and tunables (Rex's numbers, placeholders marked)
  thresholds.json                    thresholds, steps, anchors, startCoords, leanFactor, crewSlots, §8 keys
  charts.json                        the 16 response charts (from story/characters)
  starts.json                        starting categories (§4)
  institutions.json                  8 sectors, each with two slots: slot id, owner slug, forms per quadrant (open)
  events.json                        EventDefs: placeholder test events only; Rex's real content comes later
  gates.json                         joining gates (§7): aboard conditions and story-gated slugs
  conditions.json                    develop conditions (§5): what a slot needs supplied before develop
web/src/alignment/                   pure TS, no Phaser, no React (as web/src/fishing/)
  square.ts                          positions, clamp, classify → one of 9 regions, anchors, step
  charts.ts                          chart types, respond(), reachable(chart, quadrant)
  events.ts                          EventDef, EventOccurrence, validation
  state.ts                           versioned state: day, player, characters (pos, location, inParty),
                                     slots (pos, region, pending), town; initialState(); JSON-safe for saves
  engine.ts                          reduce(): the ONE function the game and sim call; crew and event commands
  gates.ts                           joining gates: canRecruit(state, slug, gates), unlock
  conditions.ts                      develop conditions: canDevelop(state, slot, conditions), supply
  institutions.ts                    develop, leave → eligible, sleep → transforms (returned), the §5 config keys
  town.ts                            aggregate slots → town position; perfect check
  endings.ts                         town position → ending id (9), with perfect flag
  index.ts                           the only surface scenes and the sim import
  sim/                               scenario runner, strategies, reachability search, smoke tests
```

- Every rule in §1–§7 gets one vitest test named after it; every number comes from data.
- The simulator: `npx vitest run src/alignment/sim` answers "is a perfect X town reachable under config Y", prints
  the route it found, and can play N random games for frequency (chance) when asked.
- `balance/reach.py` keeps answering the quick opportunity question from `maps.json` only until `charts.ts`
  exists; then both are retired (the build rule: nothing twice).

## 10. Scope change (Rex, 2026-10-28, from his ChatGPT conversation; recorded, nothing built)

Rex: "Don't alter anything just yet; change the plan and scope docs so you can later reference this." So this
section records the new scope and what it will change in the engine when Rex says go. Marks: **(Rex)** his own
words; **(proposed, outside AI)** ChatGPT's suggestions he pasted, adopted only when he says so.

### What Rex wants (Rex)

- An RPG with Stardew minigame elements and no Stardew combat. One dock as the base you upgrade; journeys to other
  regions, where you find recruits (Digimon World style); other docks are a later DLC.
- **Suikoden-style recruiting:** ~108 characters (like the 108 Stars), divided unevenly among the sectors; the
  sectors can be expanded when it's logical. 16 new character slots first, for novice-level recruits.
- **Morality-driven base:** recruit a bunch of holy people while upgrading the church chthonic and some leave, some
  get sacrificed; Dark Souls-style, you can't save everyone, and trying has effects.
- **Point flow:** actions, dialogue and quest choices change the crew's points; when you return home those affect
  their locales; the allies and recruits you bring back carry points too; "characters carry these points" and the
  next day the upgrades show (the overnight rule of §5 stands). Certain combinations of characters produce specific
  outcomes: a paladin with enough supporters kills an evil character; a monstrosity pretending to be good makes the
  good doctors disappear.
- **Character ghosts:** each person who dies this way becomes a ghost, preserving who they are and their placement
  and giving the town dread. A full-ghost ending could be a goal.
- **Two more neutral endings:** ordinary neutral (you didn't pick well: some dead, some alive); ghost neutral
  (everyone died); living neutral (a specific set of choices let every character exist in the town alive);
  "certain outcomes will happen unless you do X first or Y, Z first" (sequence matters).
- **Build by zooming in:** one locale at a time, built up fully, then interconnected as he goes, not a grand web at
  once. Maybe the farmer and the butcher aren't in competition but two locales with history whose choices affect
  each other (that would make 9 locales). Start with the farm.

### What ChatGPT proposed (proposed, outside AI; not adopted until Rex says)

- Locale (a place that develops) vs sector (a function) vs relationship (how two places influence each other);
  locales develop independently, with explicit relationships added only when a quest, resource or history
  justifies one.
- Characters carry **influence** home, distinct from their alignment (a strongly OG nobody vs a respected priest);
  competing influences on one locale resolve by strength, relationships and support; outcomes include compromise,
  expulsion, death, ghosthood. **The one rule to decide first:** deposit once on return, or keep influencing every
  day in residence.
- Two ghost kinds kept distinct: institutional (neglect) and character (killed in town conflicts).
- Instability derived from relationships and unresolved conflicts, no separate stat; the perfect-town rule kept.
- Ending priority once the town is neutral: everyone dead → ghost neutral; everyone alive and present → living
  neutral; else ordinary neutral. An empty town reads as neutral explicitly. Living neutral should not be reachable
  by keeping everyone's values low.
- Three kinds of contribution per character: crew (skills), resident (services, upgrades), influence
  (institutions and relationships); a deep core cast, a middle tier with short arcs, utility recruits.
- Per-locale design sheet: purpose, characters, recruitment, skills, alignment forms, development, failure, secrets.

### What it changes in the engine (keeper's reading; none of it built; each item is a Rex decision first)

| Area | Today | Needed for the new scope |
|---|---|---|
| `institutions.json` | 8 sectors × 2 slots; the pair is implicit; the ghost rule is per pair | locales with any number of characters; `relationships` as data (which locale affects which, on what event); the ghost rule becomes a relationship rule or stays per sector: open |
| Character state | `location: town | aboard | departed`, `pos`, `unlocked` | a fate (`alive | dead | ghost`), optional `influence`, support/relationship links |
| Transformation (§5) | a slot adopts its owner's position at sleep | a deposit or daily-influence model (open); several characters per locale resolved by a rule (open); conflict outcomes at sleep: depart, die, ghost |
| `town.ts` | mean of developed slots; empty town → (0, 0), implicit | make the empty-town reading an explicit key (`emptyTown: neutral`) if ghost neutral depends on it |
| `endings.ts` | 9 regions, perfect flag | neutral splits three ways by character fates, with a priority order and a `relevantCharacters` rule (recruited only? everyone?) |
| Data per character | 16 charts, 16 starts | every character who moves the town needs a chart and a start (Rex's creative work); novices who only crew need none |
| Sequence rules | the command log already carries order | "X before Y" outcomes as data (per locale), so the sim can test living neutral |
| Simulator | perfect-town search per quadrant | searches for ghost neutral and living neutral; relationship and fate rules as data |

The square, the charts, the player's movement, the overnight rule, the mean and the perfect check all stay.

### Second run-down, the same day: twelve locales, combat, the siege (Rex; recorded, nothing built)

- **(Rex)** The **twelve locales are the places you upgrade:** church, clinic, farm, butcher shop, wilderness,
  shipyard, commerce, brothel, town hall, plus **tavern, docks and the coastal fort** (ChatGPT's recommendation,
  which Rex took: "that actually makes a lot of sense"). The forge sits under the shipyard and the black market
  under commerce as sub-branches that can be promoted later; tavern and brothel are separate development trees.
- **(Rex)** The **fort** is run down but usable, especially with repairs, sub-par at first; it fills in after a
  certain point like Stardew's community centre. It first becomes available near the point where the town is about
  to be attacked.
- **(Rex)** **The attack:** at roughly the 15% or 25% point of the story, the town is prosperous and has money
  again, and as a result it gets attacked (Digimon World's attack on the house).
- **(Rex)** **Combat:** an RPG, **turn-based, 4 units on your side**; how many the enemy can have is undetermined.
  It converts into a **turn-based tactical RPG for invasions and large-scale battles**, like Suikoden's two scales;
  large ship warfare with smaller RPG combat once ships are near each other. This is what the 108 are for later.
- **(Rex)** A **world map** is coming; Rex designs it soon. Other docks are a later DLC.
- **(proposed, outside AI)** Three location types: primary locales (own trees), sub-locales (forge, black market,
  gambling room), unlockable institutions (restored fort, smugglers' den); a dying town starts without some. The
  siege is shaped by what the player built (shipyard → durability and cannons, farm/butcher → endurance, clinic →
  casualties, commerce → supplies, church → morale, town hall → coordination, wilderness → scouts, tavern →
  intelligence, fort → artillery); the fort restores in stages (ruined → emergency defences → garrison → fortified
  harbour → naval stronghold) with four alignment forms at the end; the first siege can be lost without a game over
  (docks damaged, NPCs killed or ghosted, influence shifts); three acts (the dying port, the first siege, a growing
  pirate power, the fate of the port). Naval tactics the primary large-scale system, boarding the smaller one.
- **(keeper)** What this adds to the engine's reading above: the sector list becomes the twelve locales (which of
  them contribute to the town's mean is open; ChatGPT: decide after the locale structure exists); the siege's
  outcomes (killed, ghosted) are character fates, so they depend on the fate rule; a developed-town state feeding
  the siege is a read of the same slots. **Combat itself is outside the alignment engine** and outside this
  keeper's lane: a separate module (`web/src/combat/`?) with its own data and sim, owned by no keeper yet.

### Third run-down, the same day: the six factions (Rex; recorded, nothing built)

- **(Rex)** "The six factions for the game", for the map and the storyline. Rex's own list: **pirates** who love
  freedom and cooperation and just want to be free; **evil criminal pirates**, gangs, thieves and ne'er-do-wells
  (Rex: this can be more closely associated with a demonic, Cthulhu-like force); the **church or holy forces**;
  the **ghost forces** (darkness, or a spooky green force); and a sixth, **oppression**: a Spanish-crown-like
  kingdom coming to crush and take over.
- **(proposed, outside AI; Rex called the result "the six factions")** ChatGPT's six, which split Rex's criminals
  from the demonic force: Free Pirates (freedom, cooperation; conflict: resisting domination), Criminal Pirates
  (wealth, exploitation; the pirate economy), Abyssal Cult (awakening an ancient oceanic force, possibly behind the
  town's decline; infiltrates church, wilderness, docks), Holy Order (faith, purification; some protect, some demand
  conformity), Ghost Fleet (unfinished business; bound to the island by a betrayal; green spectres to oppressive
  darkness), Imperial Crown (sovereignty, imposed order; stability with occupation). None identical to one
  alignment. Map: the port central and contested, each faction strongest in a surrounding territory, no fixed
  order. The Crown as the first siege's antagonist (15–25%). Shifting alliances (Holy Order with Crown against
  piracy; both pirate factions against an invasion; the Ghost Fleet an ally if its cause is resolved; the Cult
  infiltrating the rest). Next structural choice: which faction is the antagonist at each stage.
- **(keeper)** Factions are not alignment: a faction is who a character or region belongs to, alignment is where
  they stand on the square, and the two can disagree (ChatGPT's "support the Free Pirates while building an
  Orderly Evil town"). For the engine that means a faction tag per character and region (data), faction reputation
  for the player (`STATS.md` §7b already has per-group reputation; a faction is a group), and nothing in the
  square. Whether faction outcomes become endings beside the nine is open.

### Fourth run-down, the same day: the world answers, and two acts (Rex; recorded, nothing built)

- **(Rex)** Your actions affect not only the town but **the greater world**: complete a quest and take certain
  actions, leave a power vacuum somewhere with obvious signs of a Cthulhu cult rising, and next time you return
  everyone has been turned and it's a cult. This is how the game **engineers who the last fight is**: the big bad
  you end up fighting.
- **(Rex)** **Two acts.** Act I is whatever first story takes place within the town. Act II is whatever faction
  has taken over; your job is to liberate the remaining islands and lands from its control.
- **(proposed, outside AI)** Each region holds a few state variables (controlling faction, each faction's
  influence, authority, unrest, governor alive, quest status) and evaluates transition conditions when time passes,
  the same event-driven pattern as the overnight town update; the player creates openings and factions exploit them
  by their own behaviour (a combination, not autonomous simulation, not player-only). Each faction has a regional
  influence separate from the player's and the town's alignment, raised by named kinds of action (liberating ports,
  enabling smuggling, leaving occult threats unchecked, purging, mass deaths and curses, restoring garrisons). The
  final antagonist is the strongest *hostile* faction, with story exceptions (your ally can be the strongest). The
  early siege (15–25%) stays as the warfare tutorial; the Act I finale is a world-state evaluation at a fixed
  milestone choosing the dominant faction (ChatGPT favours fixed milestone, dynamic antagonist, over a threshold
  trigger). Act II per faction: Crown → free occupied colonies; Holy Order → break a fanatical crusade; Criminals →
  dismantle gangs; Cult → reclaim corrupted islands and stop the awakening; Ghost Fleet → break curses; Free
  Pirates → a confederation turned coercive. Liberated regions keep Act I's consequences (dead, turned, fled,
  willing converts); what replaces the defeated rulers is the player's choice, which ties back to the square
  (oppression defeated abroad, reproduced at home). Factions differ in how expansionist they are; the Ghost Fleet
  rises only on curses and mass death, the Free Pirates rarely conquer.
- **(keeper)** This is a second instance of the engine's own pattern, one level up: regions are to the world what
  slots are to the town (state as data, a reducer over commands, evaluation at a tick). It belongs in its own module
  (`web/src/world/`?) built the same way, sharing nothing with the alignment engine but the pattern, so the town and
  the world can be simulated apart and together. The balance question it adds is the one this keeper exists for:
  **each of the six Act II antagonists must have a realistic route**, equal opportunity not equal chance, which the
  world sim must prove the way the town sim proves the four perfect towns.

### Fifth run-down, the same day: the map, travel, the ocean, and the economy (Rex; recorded, nothing built)

- **(Rex)** **The Caribbean as the base.** One land mass you can't see past (Florida); lower land masses where
  you can travel only to the port towns; the islands are most of the game, with artistic licence to add chains and
  regions so it isn't empty; the full density of islands is too vast for a whole game.
- **(Rex)** **Travel like the Elder Scrolls, not Wind Waker:** a map, fast travel to a region, days pass, the
  voyage shown as dots moving on a screen (FF10's cutscenes); an attack on the way stops the dots and starts a
  battle. This prevents discovering regions too early and forces progression to what's allowed to be seen; an open
  world is beyond scope; it also allows nearly limitless places, some you just can't reach or don't have access to.
- **(Rex)** **Ocean locales:** learn from a town or someone that ships travel to a certain place in the ocean, and
  that place becomes a locale you can travel to and **wait** at for any number of days depending on your
  provisions; plunderable if ships go by. Attack enough companies, or a specific one, and they begin bringing in
  their own defences.
- **(Rex)** **Map design and the economy are next.** The system gathers the normal resources one would need, costs,
  weights, how much ships can take and where they get it, and makes a simulation; **the simulation is the basis for
  Rex's other games too**, a useful first step there and life for this game.
- **(Rex)** **Start small; the scope is set by economic need.** First a goods list. Every town needs certain goods,
  in three types: **base/general goods** (lumber, stone: every civilisation needs them, doesn't always have them,
  demand steady); **specialty goods** (only a specific region can make them from knowledge it has; desired by some
  towns, not needed by others); **cultural goods** (valued only by the civilisation in question; others may make
  them but value them less or not at all). A region has an **input and an output** factor; inputs (demand) carry a
  **consumption unit** that depends on community size and on who in the community consumes it.
- **(Rex)** **Two metrics per good per settlement:** a **cache** (how much the region already possesses) and a
  **consumption** metric (how much it eats), giving the cost. Raw iron vs iron tools: the garrison town with a
  blacksmith has steady demand for iron; the fishing village pays a high price for iron tools when low but little
  for iron itself.
- **(proposed, outside AI)** Node-based travel: destination → voyage with days → interrupting events → encounter →
  compact level; discovery states (unknown, rumoured, discovered, accessible, blocked, occupied), revealed by
  recruits (a navigator's routes, a smuggler's ports); three map layers (world, region, playable destination); the
  same level reused with a different faction's NPCs; voyage time and crew skills (navigation, seamanship, lookout)
  mattering; interruptions rare on ordinary routes. Ocean locales (shipping lane, strait, cove, fishing grounds,
  wreck, patrol zone, treasure waters) with encounter tables; companies escalate (unprotected → caution → convoys →
  retaliation → strategic response), differently per organisation and tied to the six factions; **local heat** vs
  **company hostility** as two values; scheduled major convoys plus probabilistic ordinary traffic. Economy: a
  reusable engine (resources, recipes, supply and demand, transport network, organisations, decisions, events) with
  the pirate content as data; ~12–16 resources with weight, base price, production, consumption, spoilage,
  legality; ports as economic nodes; ships as actors with capacity, speed, crew, provisions, cost, defence, owner,
  route; cargo conserved (captured cargo never arrives); strategic vs detailed simulation; start with three ports,
  three goods, two companies. Rex's two metrics extended to five per settlement-good: stock, consumption per day,
  target reserve, production per day, base price; price from shortage (illustrative formula base × (0.7 + 2.3 ×
  shortage)); need vs willingness vs ability to pay, later.
- **(Rex, 2026-10-28)** **The economy engine lives in the Toolchain as a shared package** (`E:/AI Programs/Toolchain/economy/`,
  name proposed, beside ask-cursor and ludii; its own README and SCOPE row); pirate-ship imports it and keeps its
  goods, ports and companies as data under `data/pirate-ship/economy/`. The pirate game is its first client, not
  its owner. Its balance (no runaway
  prices, every region viable, piracy's escalation fair) is a lane of its own; this keeper's question is only how
  the economy feeds the town and the world (a shortage as an event; a company's retaliation as a faction's
  influence), which are commands between modules, not shared state.

### Sixth run-down, the same day: the final faction grouping on the square (Rex; recorded, nothing built)

- **(Rex)** "The final faction grouping and where they land on the alignment scale": **nine factions**, one per
  region of the square, from Rex's chart (axes labelled Orderly/Chaotic × Good/Evil, as the engine's):

  | Region (engine) | Faction (Rex) | Rex's sub-label |
  |---|---|---|
  | Orderly Good (pure) | Atlantean | Machina |
  | upper hybrid (OG+CG) | Merfolk | Tritons / Sirens |
  | Chaotic Good (pure) | Lost Boys | Peter Pan Pirates |
  | left hybrid (OG+OE) | Imperial | Crown + Church |
  | neutral centre | Ghost | Fleet |
  | right hybrid (CG+CE) | Free | Pirates |
  | Orderly Evil (pure) | Abyssal | Cult |
  | lower hybrid (OE+CE) | Devil | Cult |
  | Chaotic Evil (pure) | Criminal | Pirates |

  Against the third run-down's six: the Holy Order is folded into the Imperial faction (Crown + Church); the
  demonic force Rex first tied to the criminals is now its own **Devil Cult**, separate from the **Abyssal Cult**;
  three factions are new (Atlantean Machina, Merfolk, Lost Boys). The chart places Merfolk, Imperial, Free and
  Devil astride the axes and the Ghost Fleet on the crossing; this keeper reads those as the four hybrid bands and
  the neutral centre, which is what the engine already has (§1), so the nine factions and the nine town endings
  line up one to one. **(open)** whether that lining-up is intended, i.e. whether a town's ending *is* the faction
  it has come to resemble, or the two merely share a map.
- **(keeper)** This reverses the third run-down's reading that factions are kept apart from alignment: a faction
  now has a fixed position on the square, so it can carry alignment into the engine without a new rule (a
  faction's regional influence, if it ever becomes a town event, is just an event with that faction's coordinates
  as its vector; data in `events.json`, no engine change). What it does not do is make factions and alignment the
  same thing: a character's own position still comes from their chart, and a region's controlling faction is a
  world-module tag; the lining-up gives the epilogue a reading ("the town became Atlantean") rather than a
  mechanic. Recorded here; the ids below are proposed for the data, nothing more.
- **(proposed)** Faction ids for `factions.json` when unit 32 is queued: `atlantean`, `merfolk`, `lost-boys`,
  `imperial`, `ghost-fleet`, `free-pirates`, `abyssal-cult`, `devil-cult`, `criminal-pirates`, each with its region
  key (`og`, `og-cg`, `cg`, `og-oe`, `neutral`, `cg-ce`, `oe`, `oe-ce`, `ce`) and Rex's sub-label as display text.

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-28 | Created from Rex's run-down and the outside AI's spec he adopted: square, events, player, characters, starts, institutions, town, open keys, architecture | Rex; keeper (marks, architecture) |
| 2026-10-28 | Cursor Opus design review folded in: reduce() over a command log, EventDef vs EventOccurrence, per-slot institutions, crew commands, reachable() in the engine; four forced inventions became open keys (tieBreak cliff, step metric/overshoot, startCoords, ownerDeparted/pendingWhenAboard/undevelopedCounts) | keeper; review Cursor Opus |
| 2026-10-28 | Town position = the mean of the developed institutions' positions | Rex |
| 2026-10-28 | An exact diagonal tie keeps the previous region (no snap) | Rex |
| 2026-10-28 | Every developed place counts toward a perfect town, the loser of a pair included | Rex |
| 2026-10-28 | The ghost rule applies to every pair; recruiting both lets both develop | Rex |
| 2026-10-28 | Recruiting alone doesn't develop a place; it takes a sub quest or supplying what they need; develop is its own command | Rex |
| 2026-10-28 | A place whose owner leaves for good freezes at the alignment it had | Rex |
| 2026-10-28 | Build with the placeholder numbers; Rex tunes after the simulator runs | Rex |
| 2026-10-28 | Joining gates into the simulator as data (`gates.json`, `unlock` command): Rex's facts from the story and town keepers; the representation proposed | Rex (decision); keeper |
| 2026-10-28 | Develop conditions into the simulator as data (`conditions.json`, `supply` command): the food pair's bodies from the story; the rest open | Rex (decision); keeper |
| 2026-10-28 | §10: the scope change (108 characters, locales and relationships, influence carried home, character ghosts, three neutral endings, build locale by locale) recorded with the engine changes it implies; nothing built | Rex (scope); keeper (reading) |
| 2026-10-28 | §10 second run-down: twelve locales (tavern, docks, fort added), the fort as a Stardew-style fill-in, the attack at 15–25%, turn-based combat of 4 units converting to tactical battles, a world map coming | Rex (scope); keeper |
| 2026-10-28 | §10 third run-down: the six factions (free pirates, criminal pirates, abyssal cult, holy order, ghost fleet, imperial crown); factions kept apart from alignment | Rex (scope); keeper |
| 2026-10-28 | §10 fourth run-down: the world answers to the player's actions (power vacuums, regional takeovers), the last fight engineered from it; two acts (the town, then liberating the lands from the faction that took over) | Rex (scope); keeper |
| 2026-10-28 | §10 fifth run-down: the Caribbean map, fast travel with days and dots, ocean locales and waiting, companies that respond, and the economy as a reusable simulation (three goods types, cache and consumption per settlement) | Rex (scope); keeper |
| 2026-10-28 | The economy engine lives in the Toolchain as a shared package; pirate-ship imports it and keeps goods, ports and companies as data | Rex |
| 2026-10-28 | §10 sixth run-down: the final nine factions placed on the square (Atlantean, Merfolk, Lost Boys, Imperial, Ghost Fleet, Free Pirates, Abyssal Cult, Devil Cult, Criminal Pirates), one per engine region; Holy Order folded into Imperial; factions now carry a fixed alignment | Rex (scope); keeper |
