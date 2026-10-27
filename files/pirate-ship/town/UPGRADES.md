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
| `act(<id>) -> (g, c)` | an action, quest section or method of finishing a quest, and the alignment points it carries on good/evil (`g`) and order/chaos (`c`) | Rex (actions carry alignment points, 2026-10-27); word proposed |

Words are added here only as Rex's choices need them.

## Town alignment (Rex, 2026-10-27)

Rex's model of 2026-10-27 (`ENDINGS.md`, The town's alignment): each resident who stays has an alignment your
choices change, and the town moves on two axes, good/evil and order/chaos. What the game checks:

| Key | What | Values | Mark |
|---|---|---|---|
| `port.align` | the town's position | a point on good/evil × order/chaos; read as `og`, `cg`, `oe`, `ce`, or `n` within the neutral radius | Rex (axes, quadrants, neutral); ids and the point the keeper's; radius open |
| `<slug>.align` | a resident's alignment | the same two axes; changed by your choices | Rex |
| `<slug>.influence` | how much they sway the town | number | proposed (outside AI) |
| `<slug>.presence` | whether they stay in town (taking them aboard removes their pull) | in town / aboard / gone | proposed (outside AI); Rex said only residents who stay count |

What moves `port.align` (Rex, 2026-10-27): actions and quest sections carry alignment points (`act(<id>)`); crew
in your party who witness them move by their own inner rules (`../story/QUESTLINES.md`); the town moves through
the residents who stay. Also Rex's: your answers to town quests. Town events: proposed. By how much: open. Whether
the player also earns points, or only witnessing crew: open (`ENDINGS.md`, questing model, B).

### Quadrant states (proposed, outside AI)

The same building transforms differently per quadrant. If Rex keeps this, a slot's states become its quadrant forms
(`og`, `cg`, `oe`, `ce`, and `base` for neutral):

| Slot | `og` | `cg` | `oe` | `ce` | Mark |
|---|---|---|---|---|---|
| `port.church` | cathedral | meeting hall | eldritch temple | desecrated ruin | proposed (outside AI said "the chapel") |
| `port.docks` | merchant harbour | free pirate port | cult harbour | raiding base | proposed |
| `port.fort` | shared by all four paths | | | | proposed |

Open: whether slot states now follow the quadrant, single choices (`port.entp`), or both (`ENDINGS.md`, Open 1).

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

### Reserved slots (Rex's places, 2026-10-27)

Rex named the port's places; each place's id is reserved here as its slot so ids stay stable. A reserved slot has
only `base` until Rex says what it can become and which choices do it. "Who's tied to it" is who lives or works
there (`TOWNS.md`), so the choices that touch it are likely about them, but no unlock is recorded until Rex gives
one.

| Slot | Part of town | Who's tied to it | States | Mark |
|---|---|---|---|---|
| `port.docks` | the docks (shipyard, repairmen, market) | repairmen | `base`; others open | Rex (the place) |
| `port.shipyard` | the shipyard | `entp-m` (weapon smith), a few shipyard characters | `base`; others open | Rex (the place) |
| `port.market` | the market, from the port into town | vendors | `base`; others open | Rex (the place) |
| `port.tavern` | the tavern / brothel | the bartender | `base`; others open | Rex (the place) |
| `port.bakery` | the butcher shop (id from when it was the bakery; ids never change) | `esfp-f`, `farm-son` | `base`; others open | Rex (the place) |
| `port.farm` | the farm | `intp-m`, `farm-daughter` | `base`; others open | Rex (the place) |
| `port.clinic` | the clinic | `isfj-f` | `base`; others open | Rex (the place) |
| `port.church` | the church | `istj-m` | `base`; others open | Rex (the place) |
| `port.warehouse` | the warehouse | `bigwig`, vendors, `enfj-m` | `base`, `legit`, `illicit` (below) | Rex (2026-10-27) |
| `port.apothecary` | the apothecary | the INTJ herbalist (her potion-testing questline) | `base`; others open | Rex (the place) |
| `port.estp_hut` | the hut away from town | `estp-f` | `base`; others open | Rex (the place; she lives here). Whether `port.soldier_house` still exists: open (if not, that id is retired, never reused) |
| `port.infp_house` | the INFP's house and basement | `infp-m` | `base`; others open | Rex (the place) |
| `port.fort` | the old coastal fort | the old soldier (weekly) | `base`; others open | Rex (the place) |
| `port.soldier_house` | the old soldier's locked house | the old soldier | `base` (locked); others open | Rex (the place) |

#### `port.warehouse` (Rex, 2026-10-27)

| State | What it is | Unlock | Rules out | Mark |
|---|---|---|---|---|
| `base` | in disrepair; the owner is disorganised and chaotic, his alliances poorly kept | start | | Rex |
| `legit` | a place for goods and legitimate trade | through the son's journey into making structure (`enfj-m`); which choices lead here: open | `illicit` | Rex (state); unlock open |
| `illicit` | storage for illegally stolen goods, drugs and such | through the same journey; which choices lead here: open | `legit` | Rex (state); unlock open |

State ids are the keeper's. "Either… or" is Rex's, so the two rule each other out. Open: whose journey it is (the
son's, as the story keeper reads it, or the father's); which choices or quadrant send it each way; whether it can
stay `base` if the journey never happens (for example, if you take the son aboard).

`port.entp` (above) may turn out to be a state of one of these (the shipyard is his home); if so it stays its own
id and the two are linked here, never renamed.

Not yet a slot: the town's people as a whole (who stays, who leaves): the pressure is Rex's (everyone thinking of
abandoning it); whether it's a slot is open.

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-26 | Created: format, choice words (proposed), first slot `port.entp` from the ENTP's secret route | keeper; route Rex |
| 2026-10-27 | Reserved slots for Rex's eleven places (`port.docks` … `port.soldier_house`), each `base` only until Rex gives states and unlocks | keeper; places Rex |
| 2026-10-27 | Reserved `port.apothecary` (twelfth place) | keeper; place Rex |
| 2026-10-27 | Town alignment keys (`port.align`, per-resident alignment; influence and presence proposed); outside AI's quadrant states as proposed | keeper; model Rex |
| 2026-10-27 | Choice word `act(<id>) -> (g, c)` (proposed) for alignment points; what moves `port.align` updated to Rex's questing model | keeper; model Rex |
| 2026-10-27 | `port.bakery` is now the butcher shop (id unchanged); farm and butcher shop gain the farmer's children | keeper; Rex |
| 2026-10-27 | Slugs updated: `intp-m`, `esfp-f`, `farm-daughter`, `farm-son` | keeper |
| 2026-10-27 | Reserved `port.infp_house` (thirteenth place) | keeper; place Rex |
| 2026-10-27 | Reserved `port.estp_hut` (fourteenth place; may replace `port.soldier_house`) | keeper; place Rex |
| 2026-10-27 | `port.warehouse` states `legit` / `illicit` (Rex), exclusive; unlocks open | keeper; states Rex |
