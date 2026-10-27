# Upgrade slots (the table the game checks)

Kept by the town keeper; Rex decides every slot, state and unlock. Marks as in `TOWNS.md`: **(Rex)**,
**(proposed)**, **(open)**.

**Rex's model (2026-10-26):** like Digimon World 1, certain choices change certain parts of a town; each part only
gets certain upgrades for certain choices (who you recruit, let go, kidnap, help and so on); you can't max a town
out; the combinations of upgrades produce the endings (`ENDINGS.md`).

## Shape (keeper's format, for the game to read)

- A **slot** is one part of a town that can change. Id: `<town>.<part>` in backticks, e.g. `port.<part>`. Ids are
  stable: once written they never change, even when Rex renames the part; the art keeper keys
  `../art/TOWN_SHEETS.md` on them and endings refer to them.
- Every slot has exactly one **state** at a time. Every slot starts in `base` (as the town is when you arrive).
- Each non-base state has an **unlock**: the choices or conditions that put the slot in that state. Written with
  the choice words below, joined by AND / OR.
- **Rules out:** states of this or other slots that can never be reached once this one is (or once a given choice
  is made). This is how "you can't max a town out" becomes exact.
- A **lock** is a choice that makes a state permanently unreachable, even though no other state was reached
  (e.g. keeping the ENTP below).

### Choice words (proposed vocabulary; the verbs are Rex's)

| Word | Means | Mark |
|---|---|---|
| `recruit(<slug>)` | the character joined your crew (hired, mercenary or kidnapped) | verbs Rex (§7b); word proposed |
| `hire(<slug>)`, `merc(<slug>)`, `kidnap(<slug>)` | joined by that one of the three ways | Rex (§7b); word proposed |
| `let_go(<slug>[@event])` | you let them leave (at a named event, when it matters) | Rex (verb); word proposed |
| `keep(<slug>[@event])` | you went back and convinced them to stay | Rex (the ENTP's choice); word proposed |
| `help(<slug>)` | you helped them (what counts is per character) | Rex (verb); word proposed |
| `return(<slug>, improved)` | you brought a crew mate back to town improved | Rex (2026-10-26, `TOWNS.md`); word proposed |
| `rep(<town>[.<group>]) >= n` | reputation with a town or a group in it | Rex (§7b); word proposed |

Words are added here only as Rex's choices need them.

## `port`: the starting port

### Slots

| Slot | Part of town | States | Mark |
|---|---|---|---|
| `port.entp` | the part the ENTP improves when you let him go (which part is open) | `base`, `improved` | Rex (that an improvement exists); the part and its look open; slot id the keeper's |

The id `port.entp` names the slot by its known cause because the part isn't known yet; it stays `port.entp` after
Rex says which part it is.

### States and unlocks

| Slot | State | Unlock | Rules out | Mark |
|---|---|---|---|---|
| `port.entp` | `base` | start | | keeper (format) |
| `port.entp` | `improved` | `let_go(entp-m@explained_departure)` | `entp-m` on your crew for good: he does not come back from this departure | Rex |
| `port.entp` | (lock) | `keep(entp-m@explained_departure)` locks `port.entp = improved` forever: "he never leaves you again, but his contribution to the town never happens" | | Rex |

Open on this slot:

1. Which part of the port he improves, and what the improved state looks and reads like (`entp-m.md` field
   `rel.town`; outside AI's proposal there: a scheme to draw trade, gambling or investment, not canon).
2. Whether `improved` needs anything else to happen besides letting him go (time passing, money, a resident he
   works with, the town's reputation).
3. Whether `port.entp` has more than two states (for example, a worse state if he is kidnapped, or never
   recruited at all).
4. How many departures come before `explained_departure` (on his character doc; it only matters here if the
   count can be missed).

### Parts not yet slots

None of these is a slot until Rex says so. Listed so he can see the candidates from the docs:

| Candidate part | Source | Mark |
|---|---|---|
| The bar (the bartender's) | §7b | Rex (exists, implied) |
| The blacksmith's | §7b | Rex (exists, implied) |
| The docks / harbour | STORY.md; §4a | Rex (the port has a dock); its state proposed |
| The shipwright's workshop | STORY.md | proposed (outside AI) |
| The merchants | STORY.md | proposed (outside AI) |
| The town's people as a whole (who stays, who leaves) | STORY.md: everyone thinking of abandoning it | Rex (the pressure); a slot for it open |

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-26 | Created: format, choice words (proposed), first slot `port.entp` from the ENTP's secret route | keeper; route Rex |
