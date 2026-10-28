# Balance: every town ending must have a route

Kept by the balance keeper; Rex designs everything. This folder checks one thing: **equal opportunity, not equal
chance.** Each ending (OG, CG, OE, CE, and neutral) must have at least one realistic route a player could take. How
*likely* each ending is (chance) is not balanced here and is not a problem unless Rex says so.

Marks, as in the other keepers' files: **(Rex)** his, canon; **(proposed)** someone else's starting point, not
canon; **(open)** nothing decided. Problems and fixes below are the keeper's findings and options; Rex chooses,
the keeper never decides.

Sources read 2026-10-27: `../town/ENDINGS.md`, `../town/UPGRADES.md`, `../town/TOWNS.md`,
`../story/QUESTLINES.md`, `../story/STORY.md`, `../story/characters/INDEX.md` and every character file,
`../STATS.md` §3. Plus Rex's messages here (2026-10-27, 2026-10-28).

Files here:

- `BALANCE.md`: this file.
- `maps.json`: a copy of each character's alignment map, start and limits, plus the sectors. The story keeper's
  files are the source; update this copy when they change.
- `reach.py`: computes the reachability table from `maps.json` (Python, no installs). Run `python reach.py`; it
  writes `TABLE.md`.
- `TABLE.md`: the generated table. Never edit by hand.

## The gaps, in short (2026-10-28)

What no character can reach yet, sector by sector, and what would close it. Rex will either draw new diagrams or
make new characters.

| Sector | Missing | What closes it |
|---|---|---|
| Church (the priest alone) | **OE and CE: impossible** (the priest can't be corrupted). OG and CG: covered by his chart (2026-10-28) | a church competitor whose diagram lands on OE and CE; or the church changing with the town rather than the priest (P1) |
| Healing (clinic vs apothecary) | nothing (OG by the doctor's lean, which Rex ruled arrives, 2026-10-28) | |
| Food (farm vs butcher shop) | nothing | |
| Hunting (outdoorswoman vs hunter) | **OG and OE** | the hunter's (ISTP) diagram lands on OG and OE |
| Inventions (ENTP vs a new mechanic) | nothing; the ENTP alone reaches all four | the new mechanic has no constraint |
| Commerce (proposed pair) | nothing on paper; CG and CE vanish if the merchant's always-failing shop means he can't "succeed" | Rex confirms the pair, and whether the merchant counts without his shop |
| Society (proposed pair) | nothing; the privateer reaches all four | Rex confirms the pair |

## Are the alignment maps on file?

**Yes.** Rex's maps are recorded by the story keeper as Rex (each character file's "Inner rules" section and the
matrix in `../story/QUESTLINES.md`), except the ISFJ's, which Rex gave here on 2026-10-28 and which has been sent to
the story keeper. The reachable sets the outside AI quoted for 8 characters all agree with Rex's maps.

| Character | Rex's map (action you do in front of them → where they move) | Can reach | Outside AI quoted |
|---|---|---|---|
| ENTP `entp-m` | OG→CG, CG→OE, OE→OG, CE stays; natural alignment CE | all four | all four ✓ |
| INTJ `intj-f` | every action → OE; starts OE; neutral if shown her belief is wrong | OE (+ neutral) | OE only ✓ |
| INTP `intp-m` | OG→OE, CG→OG, OE no change (leans OE), CE→OE | OG, OE | OG, OE ✓ |
| ESFP `esfp-f` | OG→CG, CG→CE, OE→CE, CE no change (leans CE) | CG, CE | CG, CE ✓ |
| ESTP `estp-f` | OG→CG, CG stays, OE→CE, CE stays | CG, CE | CG, CE ✓ |
| ENFJ `enfj-m` | OG stays, CG→OG, OE stays, CE→OE | OG, OE | OG, OE ✓ |
| ESFJ `esfj-m` | OG→CE, CG→OE, OE→OG, CE→CG | all four | all four ✓ |
| ESTJ `estj-f` | OG→CE, CG→OG, OE→CG, CE→OE | all four | all four ✓ |
| ISTJ `istj-m` (Rex, 2026-10-28) | OG no change (leans OG), CG no change (leans CG), OE→CG, CE→OG | OG, CG | n/a |
| ISFJ `isfj-f` (Rex, 2026-10-28) | OG no change (dashed ring: leans OG), CG→CE, OE→CG, CE→OE | all four (OG by leaning, which arrives) | n/a |

**The ISTJ priest's chart (Rex, 2026-10-28):** OG dashed ring (leans OG), CG dashed ring (leans CG), OE→CG,
CE→OG. He reaches OG and CG, never OE or CE, which fits Rex's "he can't be corrupted". The chaotic evil square is
highlighted; whether that's his start is open, as with the others.

**(open) The chart differs from Rex's earlier words for the priest** (in `../story/QUESTLINES.md` and his file):
OE "does nothing to his or anyone's alignment" (the chart: OE→CG), and CE "moves the *town* toward good" (the
chart: CE moves *him* to OG; both could hold). The chart is newer; which stands is Rex's, recorded by the story
keeper. Either way he never reaches OE or CE, so the balance result is the same.

On the ISFJ's chart the chaotic evil square is highlighted. On the ESTP's and ESFP's charts Rex said the highlight
isn't the starting alignment, so it isn't read as hers either: **(open)**.

Not made: **ISTP, INFP**, the new mechanic, a possible church competitor. Starting alignments are open for
everyone except the INTJ (OE) and the ENTP (CE).

## 1. The model

| Item | What | Mark |
|---|---|---|
| Axes and endings | Good/evil × order/chaos: four quadrant endings (OG church-like, CG stereotypical pirate town, OE Cthulhu, CE killers and devil worship) plus neutral at the centre (a ghost town) | Rex |
| Who moves the town | Your conduct on all four questlines earns alignment points; crew who witness it shift by their own inner rules (the maps); the residents who stay move the town | Rex |
| Inner rules | Each character's map; egging them the way they want moves them there, other pushes send them elsewhere | Rex (open A answered: they hold) |
| Dashed ring | No change: committing that action just leans the character that way. Kept up, the lean eventually carries them all the way into that quadrant (2026-10-28) | Rex |
| Who earns points | Only the witnessing crew, or the player too | open (B) |
| 3 residents per quadrant | The plan for the 12 residents; who sits where is open | Rex (plan); assignment open |
| Neutral | Hard to get unless you truly play balanced; the game rewards going all out in one direction | Rex |
| All endings possible | With a 3-member crew, the player's actions can lead to a fully developed town, and every option is achievable | Rex (2026-10-27) |
| Facilities that compete | Parts of town that are equivalent and compete; two characters per facility; only one of each pair needs to succeed; each has two potential outcomes | Rex (2026-10-27) |
| Church | Kept separate from the clinic. The ISTJ priest; Rex may make a new church competitor | Rex (2026-10-28) |
| Healing | The ISFJ's clinic vs the INTJ's apothecary compete for the town's healing | Rex (2026-10-28) |
| Food | The INTP farmer's farm vs the ESFP cook's butcher shop | Rex |
| Hunting / gathering | The ESTP vs the ISTP | Rex |
| Inventions | The ENTP vs a new mechanical character Rex will make. The INTJ is no longer his competitor: their stores don't compete economically. They still don't respect each other, a rivalry that isn't direct | Rex (2026-10-28) |
| Commerce | The ENFJ warehouse heir vs the ESFJ merchant | proposed (outside AI) |
| Society / power | The ESTJ privateer vs the INFP courtesan; the outside AI flagged it weak (no shared town function) | proposed (outside AI) |
| Both can succeed | Both institutions in a sector can succeed with extra work; pairs compete for time, crew slots and resources, not by excluding each other (consistent with Rex's rule that recruiting the farmer and the cook can trigger a secret duel) | proposed (outside AI) |
| Three tracks | Track sector completion, institution development and town alignment separately | proposed (outside AI) |
| Crew size | 3 slots to start (a 4th can sleep on deck, `../PIRATE.md` §4a) | Rex |
| Crew rotation | A progressive storyline: crew storylines develop or end, and you logically fill the empty spot with someone else; not always forced, but it should feel logical | Rex (2026-10-27) |
| Rex's levers | He is willing to add characters per location, or increase the crew size, if balance needs it | Rex |

That makes **seven** sectors as of 2026-10-28 (five Rex's, two proposed), not the six of 2026-10-27, because the
church left the clinic's pair. Whether Rex still wants six: open.

### How this file reads "can reach" (the keeper's reading; tell me if it's wrong)

- A character **can reach** a quadrant if some action you do in front of them lands them there, or they start there
  and can be left there. A dashed ring (a lean) counts: Rex, 2026-10-28, kept up, it arrives.
- A **sector covers** an ending if at least one of its characters can reach it. This is the strict reading of
  "every option is achievable": a fully developed town in quadrant X has every sector's winning institution in X. The
  loose reading (the town's overall alignment is X, whatever each institution became) is far easier: every ending
  already has 5 to 7 characters who can push toward it, so the loose reading has no gaps at all.
- A **route** to an ending = one character per sector who can reach it. Counted by multiplying.
- Nothing here weighs how many actions it takes, or how likely a player is to stumble into it. That's chance.

## 2. Reachability table

Generated by `reach.py` on 2026-10-28 (live copy: `TABLE.md`). `yes` = follows from Rex's decided maps.
A dashed ring counts as `yes` (Rex: the lean arrives). `map?` = only through a map cell that is still open. `start?` = the map is complete
and never lands there; only an open starting alignment there (and never pushing them) would reach it. `no` = ruled
out.

### Per character

| Character | OG | CG | OE | CE |
|---|---|---|---|---|
| `entp-m` | yes | yes | yes | yes |
| `intj-f` | no | no | yes | no |
| `intp-m` | yes | start? | yes | start? |
| `esfp-f` | start? | yes | start? | yes |
| `estp-f` | start? | yes | start? | yes |
| `esfj-m` | yes | yes | yes | yes |
| `enfj-m` | yes | start? | yes | start? |
| `estj-f` | yes | yes | yes | yes |
| `istj-m` | yes (lean) | yes (lean) | **no** (Rex: can't be corrupted) | **no** |
| `isfj-f` | yes (lean) | yes | yes | yes |
| `istp-f` | map? | map? | map? | map? |
| `infp-m` | map? | map? | map? | map? |

### Per sector

| Sector | Characters | Mark | OG | CG | OE | CE |
|---|---|---|---|---|---|---|
| church | ISTJ (competitor maybe) | Rex | yes: ISTJ | yes: ISTJ | **STARVED** | **STARVED** |
| healing | ISFJ / INTJ | Rex | yes: ISFJ (lean) | yes: ISFJ | yes: ISFJ, INTJ | yes: ISFJ |
| food | INTP / ESFP | Rex | yes: INTP | yes: ESFP | yes: INTP | yes: ESFP |
| hunting / gathering | ESTP / ISTP | Rex | **open only** (ISTP map?, ESTP start?) | yes: ESTP | **open only** (ISTP map?, ESTP start?) | yes: ESTP |
| inventions | ENTP (new mechanic to come) | Rex | yes: ENTP | yes: ENTP | yes: ENTP | yes: ENTP |
| commerce | ENFJ / ESFJ | proposed | yes: ENFJ, ESFJ | yes: ESFJ alone | yes: ENFJ, ESFJ | yes: ESFJ alone |
| society / power | ESTJ / INFP | proposed | yes: ESTJ (INFP map?) | yes: ESTJ (INFP map?) | yes: ESTJ (INFP map?) | yes: ESTJ (INFP map?) |

### Per ending

| Ending | Characters who can reach it now | Sectors covered now | Resting only on something open | Starved | Full-town routes now | If every open item lands well |
|---|---|---|---|---|---|---|
| Orderly good | ENTP, INTP, ESFJ, ENFJ, ESTJ, ISTJ, ISFJ (7) | 6 / 7 | hunting | none | **0** | 16 |
| Chaotic good | ENTP, ESFP, ESTP, ESFJ, ESTJ, ISTJ, ISFJ (7) | **7 / 7** | none | none | **1** | 16 |
| Orderly evil | ENTP, INTJ, INTP, ESFJ, ENFJ, ESTJ, ISFJ (7) | 5 / 7 | hunting | **church** | **0** | **0** |
| Chaotic evil | ENTP, ESFP, ESTP, ESFJ, ESTJ, ISFJ (6) | 6 / 7 | none | **church** | **0** | **0** |
| Neutral | not a quadrant: reached by staying near the centre; the INTJ's "shown she's wrong" also lands her there | n/a | | | | |

**Chaotic good is the first ending with a fully decided route** (2026-10-28): priest, doctor, cook, outdoorswoman,
ENTP, merchant, privateer. It counts the two proposed pairs, and the merchant's shop always failing (P4). It fits
the doctor's joining rule: the outdoorswoman she needs aboard is already on this route. Orderly good waits only on
the hunter.

**Since the church left the clinic's pair, the evil endings are starved:** under the strict reading, no fully
developed orderly evil or chaotic evil town exists, because the church's only character can't be corrupted. Chaotic
evil is otherwise complete; orderly evil also waits on the hunter.

Chance, for the record only (not a problem): OE has the most characters (7) and the INTJ falls into OE from every
action, so OE is the likeliest ending a player drifts into. Rex hasn't asked for chance to be balanced.

## 3. Problems found, ranked

Each problem lists fix options in five kinds: (a) change a remaining map, (b) re-pair the sectors, (c) add a
character to a location, (d) widen the crew, (e) a non-character route such as a quest action. Rex chooses.

### P1. The church can't be evil (starved: OE, CE)

The priest is the church's only character and can't be corrupted (Rex). With the church now its own sector, no one
can take it to OE or CE. His chart (2026-10-28) covers OG and CG.

Options:

- (c) **A church competitor** (Rex has said he may make one) whose diagram lands on OE and CE.
- (e) Let the church change with the town rather than with the priest: the outside AI's proposed quadrant states
  already have `port.church` become an eldritch temple (OE) or a desecrated ruin (CE). This fits "he can't be
  corrupted" and "his nature isn't corrupted by the quest".
- (e) A church that stands empty or falls in an evil town counts as the church's evil outcome (Rex's call whether
  "fully developed" allows that).

### P2. Hunting has no orderly side except the ISTP, whose map isn't made (OG, OE)

The ESTP reaches only CG and CE. On top of that, the ISFJ only joins if the ESTP is in your party, so routes using
the clinic need the ESTP recruited. If recruiting one of a pair pushes the other's institution toward ghosthood (as
Rex's food rule does for the farm and the butcher shop), recruiting the ESTP for the clinic would hurt the ISTP's
side. That would break OE and OG hunting on clinic routes. Whether that food rule applies to other pairs is open.

Options:

- (a) The ISTP's map lands on OG and OE. The food pair already works this way (the INTP covers the order side, the
  ESFP the chaos side).
- (a) Set the ESTP's starting alignment on an orderly quadrant. Weak: it only holds if you never act in front of her.
- (c) Add an orderly hunter or gatherer.
- (e) Say the food rule's "the other drifts toward ghosthood" applies only to the food pair.

### P3. ~~Healing reaches OG only by the ISFJ's lean~~ Closed 2026-10-28

Rex: if you keep doing those actions, the lean eventually carries her all the way into that quadrant. Healing now
covers all four. (It costs more time than an arrow: chance, not opportunity.)

### P4. If "succeed" means the institution, commerce via the ESFJ can't succeed (proposed pair only)

Rex's rule: the ESFJ's shop always fails, and then he joins you. In the proposed commerce pair he is the only one
who reaches CG and CE. If a sector needs an *institution* to succeed, CG and CE commerce have no route.

Options: (b) pair the ENFJ with someone whose institution can stand in a chaotic town; (e) let the ESFJ's commerce
count without the shop (he keeps selling rare goods from your ship, Rex); (e) the warehouse's illicit state could
carry the chaotic or evil side if its form follows the town.

### P5. Fragile single carriers

Not gaps; each is one character carrying a sector's whole route to an ending, so losing them loses the ending.

- Inventions: the ENTP alone, until the new mechanic exists. Rex's rule: keep him at his explained departure and
  "his contribution to the town never happens". If that contribution is the inventions sector, every inventions
  route needs you to let him go at that one event, with his alignment frozen there. The new mechanic removes this.
- Society: the ESTJ alone (the INFP's map is blank).
- Commerce CG/CE: the ESFJ alone (and P4).
- Healing OG, CG, CE: the ISFJ alone (the INTJ is OE only).

### P6. Structural opens that change every count above

1. **How a crew member's alignment reaches the town.** Residents who stay move the town; crew aboard witness and
   shift. The characters you steer are aboard, not in town. The food rule suggests their institution carries their
   effect while they're away, and the ENTP acts "when he returns". Which is it, per sector?
2. **Open B: whether the player earns points too.** Most steering is contrary by design (Rex: confusing yet
   logical). If your own acts also move the town, the acts you need for steering push the town elsewhere.
3. **Last push or slow drift?** The table assumes they can be left where a push lands them. Crew in one party all
   see the same act and move differently; with 3 slots and rotation this can be sequenced, but slow drifts cost
   more time.
4. **"Each has two potential outcomes."** Four quadrants per sector need four forms. Two options × two outcomes =
   four only if each pair splits the square, as the food pair does. The warehouse's two states (legit, illicit) read
   as good/evil only.
5. **Starting alignments.** Open for 10 of 12. They decide the `start?` cells and Rex's "3 per quadrant".

## 4. Constraints for the unfinished maps and characters

The minimum each must or must not include for every ending to keep at least one full-town route (strict reading).
Not filled-in maps; Rex makes them.

| Map | Must include | Must not | Why |
|---|---|---|---|
| Church competitor (if made) | **OE and CE** | nothing | P1 |
| ISTJ `istj-m` | made (Rex, 2026-10-28): OG, CG | OE, CE (Rex: can't be corrupted) | P1 |
| ISTP `istp-f` | **OG and OE** | nothing | P2 |
| New mechanic (ENTP's competitor) | nothing | nothing | the ENTP reaches all four; any map helps P5 |
| INFP `infp-m` | nothing, while the ESTJ is their pair | nothing | P5; recompute if Rex re-pairs society |
| ISFJ `isfj-f` | made (Rex, 2026-10-28); covers all four | | P3 closed |
| Any new character | together with their sector partner, all four | | the strict reading |

To recheck after a map changes: edit `maps.json`, run `python reach.py`, read `TABLE.md`.

## 5. What's open

- The ISTP and INFP maps; the new mechanic; whether there's a church competitor; 10 starting
  alignments (whether the ISFJ's and ISTJ's highlighted CE squares are their starts).
- Whether the priest's chart replaces his earlier OE and CE words (OE "does nothing"; CE "moves the town toward good").
- Seven sectors now, or does Rex want six; whether the proposed commerce and society pairs stand.
- Whether both institutions in a sector can succeed (proposed), and whether the food rule's "the other drifts
  toward ghosthood" applies to every pair.
- What "succeed" means for a sector: the institution developed, the character's storyline done, or both.
- P6.1 to P6.5.
- Whether the keeper's strict reading (every sector in X for a full X town) is what Rex means, or the loose one.
- Whether the crew grows past 3 in the first port (Rex is willing; nothing here needs it yet).

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-27 | Created: model, reachability table and script, problems P1–P6, constraints, opens. Rex's six-facility design and crew rotation recorded; the outside AI's commerce and society pairs, "both can succeed" and the three tracks as proposed | keeper; design Rex |
| 2026-10-28 | The church is kept separate from the clinic (a competitor may come); healing = the ISFJ's clinic vs the INTJ's apothecary; the ENTP and INTJ no longer compete (indirect rivalry stays); the ENTP's competitor will be a new mechanic; the ISFJ's map. Gaps summary added; problems re-ranked: church evil starved (P1), hunting (P2), healing OG by lean only (P3) | Rex; keeper (table) |
| 2026-10-28 | A dashed ring's lean, kept up, carries the character all the way into that quadrant; healing now covers all four (P3 closed) | Rex |
| 2026-10-28 | The ISTJ priest's chart: OG and CG rings, OE→CG, CE→OG; the church covers OG and CG; chaotic good has its first decided route; conflict with his earlier OE/CE words left open | Rex |
