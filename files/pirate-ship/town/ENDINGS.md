# Endings

Kept by the town keeper; Rex writes the endings. Marks as in `TOWNS.md`: **(Rex)**, **(proposed)**, **(open)**.

## Shape (keeper's format)

- An ending is a small authored item, **not** a script per combination. Each has an id (`end.<name>`), a kind
  (perfect, good, other), whether it's secret, and one or more **routes**.
- A **route** is a set of **conditions** that must all hold at the end: slot states from `UPGRADES.md`
  (`port.entp = improved`) and crew state (`entp-m` on crew or not, hearts, reputation). An ending with several
  routes is reached by any one of them (Rex: several methods to a good or perfect ending).
- When more than one ending's conditions hold, which one plays is open (a priority order is the usual answer; Rex's
  call).

### Rex's frame for the starting port (2026-10-26)

- **(Rex)** The port is dying; your effect is either helping it thrive again or leading it to ruin.
- **(Rex)** Several methods of getting a perfect or good ending; some secret.
- **(open)** What thriving and ruin look like at the end; whether endings are per town or one for the game; what
  "the end" is (a day count, a story event, leaving the port behind for good).

## The town's alignment (Rex, 2026-10-27)

This is how the town changes and ends, as of 2026-10-27. Rex's own words, recorded; proposals from the outside AI
he consulted are marked as such.

### How it works (Rex)

- **(Rex)** No separate game-over-style abandonment ending: it makes players feel they should restart.
- ~~**(Rex)** The town has an **alignment**. Each resident who **stays** in town has their alignment changed by your
  choices, and that is what alters the town.~~ Superseded 2026-10-28: the town's alignment is determined by its
  **developed institutions** (The square and the institutions, below). The mechanism is influence: when morality is high, people start veering
  back toward society; when evil is high, they become openly evil.
- **(Rex)** Two axes, **good/evil** and **order/chaos**, giving four quadrants: orderly good, chaotic good, orderly
  evil, chaotic evil. The first town uses this quad system; later towns could go to three or eight (a true cube).
- **(Rex)** **Neutral is not a quadrant; it means no change.** If the town's position stays within a radius of the
  centre, you get the neutral ending: the town stays as it is, and the epilogue describes it being abandoned.
  Gameplay is fine; the story still carries the abandonment, because playing neutral when the situation needed
  action ends poorly.
- ~~**(Rex)** Four main plotlines, one per quadrant. Who you take on them is how the game plays out.~~
  Superseded 2026-10-27 by the questing model below: all four plotlines are available, and conduct within them
  decides.
- **(Rex)** Each character has a clear influence toward a quadrant, a neutral one, or an opposing one. The port has
  12 people, so the plan is **3 per quadrant**.
- **(Rex)** Your answers to quests taken in town also guide the direction.
- **(Rex)** You can still get, say, an evil ending, but it will be a specific one such as chaotic evil.
- **(Rex)** With a 3-person crew, neutral should be hard to get unless you truly play balanced (bad things after good
  ones). The game rewards going all out in one direction. Try all four and you end up nowhere; play between them or
  combine one with another and you likely still end up in one direction.

### The questing model (Rex, 2026-10-27)

How the town's alignment gets moved. The character side (each character's responses, inner rules) is the story
keeper's: [`../story/QUESTLINES.md`](../story/QUESTLINES.md).

- **(Rex)** You don't pick one of the four paths. **All four questlines are available**, and you can take on each.
- **(Rex)** How you handle each path, its mini quests and everything else determines alignment. Actions, or certain
  sections, carry **alignment points**. On the devil's path you can destroy it (how you do it decides the points)
  or follow it and earn devil points.
- **(Rex)** Crew in your party see what you do, and their alignment moves by the system's inner rules (per
  character; the story keeper's). ~~The town then moves through the residents who stay.~~ Since 2026-10-28 the town
  moves through its developed institutions, each reflecting the character who shapes it (below).
- **(open, A)** Whether per-character inner rules (each character steered by being egged on the way they want, and
  veering elsewhere otherwise) still hold, or whether points plus witnessing replaced them.
- **(open, B)** Who earns points: only the witnessing crew, or the player too.
- **(proposed, outside AI)** The same outcome can be reached by different methods, each carrying different points.
  The devil path example (numbers are placeholders): rescue a sacrifice: +good; destroy the hierarchy: +good +chaos;
  outlaw the cult: +good +order; seize it for yourself: evil +order; help its rituals: evil +chaos.

### The square and the institutions (Rex, 2026-10-28)

Rex adopted an outside AI's full spec ("everything the AI has said I'm in agreement with"); the balance keeper
records it in [`../balance/ALIGNMENT.md`](../balance/ALIGNMENT.md) (§1 the square, §5 institutions, §6 the town and
its endings). The town side, in short:

- **(Rex)** The town's alignment is determined by the alignments of its **developed institutions** (one per sector,
  `UPGRADES.md`), each reflecting the character who ultimately shapes it.
- **(Rex)** A continuous square, each axis −100 to +100 (x: orderly − to chaotic +; y: evil − to good +). Everyone
  (player, characters, institutions, the town) has a position; a quadrant is a reading of a position.
- **(Rex) Nine town endings:** four pure quadrants, four hybrids along the dividing axes, and neutral at the centre
  (the ghost town). Provisional thresholds (the outside AI's, kept until Rex tunes them): neutral |x|, |y| < 15;
  pure |x|, |y| ≥ 30; hybrid bands within 30 of an axis. How the transitional ring between them reads: ALIGNMENT.md §1.
- **(Rex) Hybrid endings have real width:** a town strongly orderly but split good/evil is Twisted Virtue, a mixed
  society, not a transition.
- **(Rex) Perfect town:** every relevant institution developed into the **same** alignment. Consistency, not
  goodness: a perfect chaotic evil town is perfect. Eight developed institutions in four alignments is prosperous,
  not perfect. Perfect endings should be hard but achievable wherever the rules permit.
- **(Rex, 2026-10-28)** "Town position = the mean of the developed institutions' positions." A plain average; the
  outside AI's influence weighting is not used.
- **(open)** Which institutions count toward perfection (the losing half of a pair, ghosted buildings).

### What each quadrant becomes

| Quadrant | Id | The town becomes | Name (proposed, outside AI) | Mark |
|---|---|---|---|---|
| Orderly good | `og` | more church-like | Sanctified Port | Rex (what it becomes) |
| Chaotic good | `cg` | your stereotypical pirate town | Free Haven | Rex (what it becomes) |
| Orderly evil | `oe` | corrupted by Cthulhu | Drowned Covenant | Rex (what it becomes) |
| Chaotic evil | `ce` | residents become more killer-like and start worshipping devil magic | Devil's Anchorage | Rex (what it becomes) |
| Neutral (centre) | `n` | a ghost town: the inhabitants are replaced with ghostly visions or shades (2026-10-27; was "stays as it is, the epilogue tells of it being abandoned") | | Rex |

Ids `og`, `cg`, `oe`, `ce`, `n` are the keeper's, for the game to check.

**(Rex, 2026-10-27) Neutral is a ghost town.** The literal inhabitants might be replaced with ghostly visions or
shades. The people themselves might move on and go somewhere else. Depending on certain actions you took, they may
appear in the DLC as specific characters; they also might not.

- **(open)** Which actions decide whether a resident reappears in the DLC, and which residents can.
- **(open)** Whether every resident becomes a shade, or only some (the rest having moved on).
- **(open)** What the DLC is.

### Proposed by the outside AI (not Rex's until he says so)

- **(proposed)** Three separate numbers per resident: **alignment** (what they promote), **influence** (how much they
  sway the town), **presence** (whether they stay in town). A popular baker could outweigh a priest few people
  listen to. Taking an influential resident aboard removes their pull from the town.
- **(proposed)** Town shift = quest decisions + character contributions + town events, each moving the town on both
  axes.
- **(proposed)** Internally tell apart low influence from high-but-conflicting influence, even though both give
  neutral, so the epilogue can say which happened.
- **(proposed)** Seed traces of all four futures in the starting town: the chapel, a maritime cult under the ruined
  fort, the tavern's criminals, residents who still help each other.
- **(proposed)** The same buildings transform differently per quadrant (`UPGRADES.md`, Quadrant states).

### Open

1. **How this fits what's already recorded.** Rex's 2026-10-26 model has upgrade slots changed by single choices
   (`port.entp = improved` when you let the ENTP go) and `end.perfect` reached by routes; the 2026-10-27 model has
   endings by quadrant. Not resolved here: whether `end.perfect` is a quadrant ending (and which), sits on top of
   one, or is replaced; whether `end.good` and `end.ruin` become quadrants; whether slots now take their states from
   the quadrant, from single choices, or both.
2. ~~Chaotic good's identity.~~ Answered 2026-10-27: your stereotypical pirate town (Rex). His "pirate questline" is
   this quadrant's plotline; the priest has no effect on it (Rex, 2026-10-27; `../story/QUESTLINES.md`).
3. ~~Ghost ending vs plain abandonment for neutral.~~ Answered 2026-10-27: a ghost town (Rex).
4. Which 3 residents sit in each quadrant (`TOWNS.md`, Alignment).
5. The neutral radius, and how far each choice, quest answer and resident moves the town.
6. (Rex's goal, 2026-10-28: "a route toward a perfectly working town by the end but that requires a complicated
   set of choices"; you can't recruit everyone, but who you choose to develop can get you there.) How a "fully developed town" (Rex, 2026-10-27: reachable with a 3-member crew, one success per sector,
   `UPGRADES.md` Sectors) relates to the quadrant endings and `end.perfect`.

## Endings

| Id | Kind | Secret | Routes | Mark |
|---|---|---|---|---|
| `end.perfect` | perfect | at least one route is | R1 below; others open | Rex (it exists, with several methods); id the keeper's |
| `end.good` | good | open | open | Rex (good endings exist) |
| `end.ruin` | other | open | open | Rex ("leading it to ruin"); whether it is an ending, open |
| `end.og` | quadrant | open | town ends in orderly good | Rex |
| `end.cg` | quadrant | open | town ends in chaotic good: a stereotypical pirate town | Rex |
| `end.oe` | quadrant | open | town ends in orderly evil | Rex |
| `end.ce` | quadrant | open | town ends in chaotic evil | Rex |
| `end.n` | neutral | no | town ends within the neutral radius of the centre: a ghost town | Rex |
| `end.og_cg` | hybrid | open | upper band (orderly good + chaotic good); name open | Rex (2026-10-28) |
| `end.oe_ce` | hybrid | open | lower band (orderly evil + chaotic evil); name open | Rex (2026-10-28) |
| `end.og_oe` | hybrid | open | middle-left band (orderly good + orderly evil): **Twisted Virtue** | Rex (2026-10-28) |
| `end.cg_ce` | hybrid | open | middle-right band (chaotic good + chaotic evil); name open | Rex (2026-10-28) |

Nine town endings (Rex, 2026-10-28): `end.og`, `end.cg`, `end.oe`, `end.ce`, the four hybrids and `end.n`. Hybrid
ids are the keeper's. **Perfect** is now defined (Rex, 2026-10-28) as every relevant institution in the same
alignment, so a perfect version can exist for any ending that rules permit. Still open: how the ENTP's secret route
R1 below fits that definition, and whether `end.good` and `end.ruin` survive as kinds or are replaced by the nine.

### `end.perfect`

| Route | Conditions | Secret | How it's reached | Mark |
|---|---|---|---|---|
| R1: the ENTP's | `port.entp = improved` AND (open: the other conditions) | yes | On the departure where the ENTP explains himself first, let him go instead of going back for him. He becomes key to a town improvement that leads to the perfect ending. See [`entp-m.md`](../story/characters/entp-m.md) | Rex |

Open on R1: "key to a certain improvement that leads to the perfect ending" says his improvement is needed on this
route, not that it is enough. What else R1 needs is Rex's.

(proposed, outside AI, via STORY.md) Each route's contribution satisfies one of several conditions for reviving the
port, so keeping a character never silently locks you out of the best ending. Not canon; recorded because it
changes how routes are built.

## The shape so far

- (Alignment model, 2026-10-28) The town ends in one of nine regions (four pure, four hybrid, neutral), each with
  a perfect version where every relevant institution agrees; the counts below are for the slot model.
- Combinations = the product of every slot's state count. Now: `port.entp` (2 states) = **2** combinations.
  `port.warehouse`, `port.farm`, `port.bakery` and `port.esfj_shop` have 3 states each (2026-10-27), so
  2 × 3 × 3 × 3 × 3 = **162** combinations (fewer in practice: `port.esfj_shop` always ends `failed` once funded); the other reserved place slots have only `base` so far, so they add nothing yet.
- Each new two-state slot doubles it; ten slots of two or three states give roughly a thousand to sixty thousand.
  The endings stay a short authored list on top: each route names only the few slots it cares about, and every
  other slot can be anything.

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-26 | Created: format; `end.perfect` with the ENTP's secret route R1; good and ruin recorded as open | keeper; route Rex |
| 2026-10-27 | Rex's alignment model: two axes, four quadrant endings plus neutral; no game-over abandonment; outside AI's ideas as proposed; fit with `end.perfect` left open | Rex; keeper (format) |
| 2026-10-27 | Chaotic good is your stereotypical pirate town (via the story keeper) | Rex |
| 2026-10-27 | The pirate questline is chaotic good's plotline; the priest has no effect on it (via the story keeper) | Rex |
| 2026-10-27 | Questing model: all four questlines available, conduct and actions carry alignment points, witnessing crew move, town moves through residents who stay; "one plotline per quadrant, who you take decides" superseded; open A and B recorded | Rex |
| 2026-10-27 | Neutral is a ghost town: inhabitants replaced by ghostly visions or shades; the people may move on, and depending on your actions may appear in the DLC as specific characters, or not | Rex |
| 2026-10-27 | Open 6 added: how the fully developed town (sectors) relates to the endings | keeper |
| 2026-10-28 | Rex's square: the town's alignment comes from its developed institutions (supersedes residents who stay); nine endings with hybrids (`end.og_oe` Twisted Virtue); perfect = all relevant institutions in one alignment; spec in `../balance/ALIGNMENT.md` (via the balance keeper) | Rex |
| 2026-10-28 | Town position = the mean of the developed institutions' positions; no influence weighting (via the balance keeper) | Rex |
