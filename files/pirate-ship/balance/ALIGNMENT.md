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
