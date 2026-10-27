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

## Endings

| Id | Kind | Secret | Routes | Mark |
|---|---|---|---|---|
| `end.perfect` | perfect | at least one route is | R1 below; others open | Rex (it exists, with several methods); id the keeper's |
| `end.good` | good | open | open | Rex (good endings exist) |
| `end.ruin` | other | open | open | Rex ("leading it to ruin"); whether it is an ending, open |

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

- Combinations = the product of every slot's state count. Now: `port.entp` (2 states) = **2** combinations.
  The twelve reserved place slots (2026-10-27) have only `base` so far, so they add nothing yet.
- Each new two-state slot doubles it; ten slots of two or three states give roughly a thousand to sixty thousand.
  The endings stay a short authored list on top: each route names only the few slots it cares about, and every
  other slot can be anything.

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-26 | Created: format; `end.perfect` with the ENTP's secret route R1; good and ruin recorded as open | keeper; route Rex |
