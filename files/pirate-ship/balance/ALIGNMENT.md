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
  left/right band; |y| > |x| → an upper/lower band). **(open)** What an exact tie (|x| = |y|) reads as: config
  `tieBreak`, placeholder `neutral`. The Cursor Opus review (2026-10-28) found that with anchors on the diagonal
  (±70, ±70) a character walking from the centre sits on |x| = |y| at every step, so with `neutral` the three
  neutral starters jump from neutral straight to pure and never cross a hybrid band. Rex decides what a tie reads
  as; the step metric and the start coordinates (§8) also move this.
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
- **(open)** Three more cases the review found, each a config key, placeholder in brackets: an owner who leaves for
  good (the INFJ, `ownerDeparted` [freeze]); a pending institution whose owner is aboard again at sleep
  (`pendingWhenAboard` [keep]); a developed place whose owner hasn't slept yet, `pos` null, in the town's mean
  (`undevelopedCounts` [skip]).
- **(open)** What "developed" means, and the ghost rule beyond the food pair (`BALANCE.md` C1): config
  `ghostRule: food-only | every-pair-both-improve | every-pair-duel | every-pair-one-ghosts`.

## 6. The town and its endings

- **(Rex)** The town's alignment is determined by the alignments of its developed institutions. Each contributes its
  own alignment; the town's position emerges from them.
- **(open)** The combining calculation. Must be defined before the simulator means anything. Placeholder config
  `townAggregate: mean` (the mean of the institutions' positions); alternatives the outside AI raised: weighting by
  influence (`../town/ENDINGS.md`, proposed). Rex decides.
- **(Rex)** Nine town endings: the four pure quadrants, the four hybrids, and neutral (the ghost town).
- **(Rex) Perfect town:** every relevant institution has developed into the **same** alignment. Consistency, not
  goodness: a perfect CE town is perfect. Eight developed institutions in four alignments is prosperous, not
  perfect. Perfect endings should be hard but achievable wherever the rules permit.
- **(open)** Which institutions count toward perfection: the losing half of a pair, ghosted buildings. Config
  `perfectCounts: winners-only | all-developed`.
- **(Rex)** Hybrid endings have real width: a town strongly orderly but split good/evil is Twisted Virtue, a mixed
  society, not a transition.

## 7. The crew (unchanged, for the engine's state)

- **(Rex)** 3 crew slots to start; rotation is a progressive storyline. The engine tracks each character's
  `location` (`town | aboard | departed`) and `inParty`, with crew commands `recruit`, `party`, `leave` (leave =
  return to town, §5) and a `crewSlots` number in data. Why someone joins or leaves (gates, storylines) is story,
  outside the engine; the engine only refuses a fourth aboard.

## 8. What stays configurable or unresolved (never invented)

| Key | Default (placeholder) | Status |
|---|---|---|
| `thresholds.neutral`, `thresholds.pure` | 15, 30 | Rex (provisional) |
| `tieBreak` (|x| = |y| in the ring) | neutral | open (see §1: the cliff) |
| `step.minor`, `step.major`, `anchor` | 10, 25, (±70, ±70) | open |
| `step.metric`, `step.overshoot` | fixed distance; stop at anchor | open |
| `startCoords` | (±50, ±50); neutral (0, 0) | open |
| `crewSlots` | 3 | Rex |
| `ownerDeparted`, `pendingWhenAboard`, `undevelopedCounts` | freeze, keep, skip | open |
| `leanFactor` | 0.5 | open |
| `witnesses` | present only; absent learning off | Rex (for now) / open |
| `institutionLock` | re-read each sleep while owner in town | open |
| `ghostRule` | food-only | open (C1) |
| `townAggregate` | mean | open |
| `perfectCounts` | winners-only | open |
| INTJ "becomes neutral" | not built | open |

## 9. Architecture (keeper's, after the Cursor Opus review of 2026-10-28; built by the belt)

Separate pieces, like the card games' `effects` (data) and engine (verbs): a change to content never touches the
engine, and a change to one engine piece doesn't touch the others. **One entry point:** the engine is a reducer,
`reduce(state, command, config) → { state, log }`, over a command union (`event | recruit | party | leave |
develop | sleep`). The game's screens, the server's replay and undo, saves, and the simulator all fold the same
command log through it; nothing re-sequences the verbs by hand.

```
data/pirate-ship/alignment/          content and tunables (Rex's numbers, placeholders marked)
  thresholds.json                    thresholds, steps, anchors, startCoords, leanFactor, crewSlots, §8 keys
  charts.json                        the 16 response charts (from story/characters)
  starts.json                        starting categories (§4)
  institutions.json                  8 sectors, each with two slots: slot id, owner slug, forms per quadrant (open)
  events.json                        EventDefs: placeholder test events only; Rex's real content comes later
web/src/alignment/                   pure TS, no Phaser, no React (as web/src/fishing/)
  square.ts                          positions, clamp, classify → one of 9 regions, anchors, step
  charts.ts                          chart types, respond(), reachable(chart, quadrant)
  events.ts                          EventDef, EventOccurrence, validation
  state.ts                           versioned state: day, player, characters (pos, location, inParty),
                                     slots (pos, region, pending), town; initialState(); JSON-safe for saves
  engine.ts                          reduce(): the ONE function the game and sim call; crew and event commands
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
