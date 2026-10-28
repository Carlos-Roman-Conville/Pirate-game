# Balance: every town ending must have a route

Kept by the balance keeper; Rex designs everything. This folder checks one thing: **equal opportunity, not equal
chance.** Each ending (OG, CG, OE, CE, and neutral) must have at least one realistic route a player could take. How
*likely* each ending is (chance) is not balanced here and is not a problem unless Rex says so.

Marks, as in the other keepers' files: **(Rex)** his, canon; **(proposed)** someone else's starting point, not
canon; **(open)** nothing decided. Problems and fixes below are the keeper's findings and options; Rex chooses,
the keeper never decides.

Sources read 2026-10-27: `../town/ENDINGS.md`, `../town/UPGRADES.md`, `../town/TOWNS.md`,
`../story/QUESTLINES.md`, `../story/STORY.md`, `../story/characters/INDEX.md` and every character file,
`../STATS.md` §3.

Files here:

- `BALANCE.md`: this file.
- `maps.json`: a copy of each character's alignment map, start and limits, plus the sector pairs. The story
  keeper's files are the source; update this copy when they change.
- `reach.py`: computes the reachability table from `maps.json` (Python, no installs). Run `python reach.py`; it
  writes `TABLE.md`.
- `TABLE.md`: the generated table. Never edit by hand.

## Are the alignment maps on file?

**Yes.** Rex's maps for 8 characters are recorded by the story keeper as Rex (each character file's "Inner rules"
section and the matrix in `../story/QUESTLINES.md`). The reachable sets the outside AI quoted all agree with them:

| Character | Rex's map (action you do in front of them → where they move) | Can reach | Outside AI quoted |
|---|---|---|---|
| ENTP `entp-m` | OG→CG, CG→OE, OE→OG, CE stays; natural alignment CE | all four | all four ✓ |
| INTJ `intj-f` | every action → OE; starts OE; neutral if shown her belief is wrong | OE (+ neutral) | OE only ✓ |
| INTP `intp-m` | OG→OE, CG→OG, OE no change, CE→OE | OG, OE | OG, OE ✓ |
| ESFP `esfp-f` | OG→CG, CG→CE, OE→CE, CE no change | CG, CE | CG, CE ✓ |
| ESTP `estp-f` | OG→CG, CG stays, OE→CE, CE stays | CG, CE | CG, CE ✓ |
| ENFJ `enfj-m` | OG stays, CG→OG, OE stays, CE→OE | OG, OE | OG, OE ✓ |
| ESFJ `esfj-m` | OG→CE, CG→OE, OE→OG, CE→CG | all four | all four ✓ |
| ESTJ `estj-f` | OG→CE, CG→OG, OE→CG, CE→OE | all four | all four ✓ |

Also on file, and not in the outside AI's list: **the ISTJ priest's partial map (Rex).** CG: no effect. OE: does
nothing to his or anyone's alignment. CE: he can't be corrupted; he fights evil harder and moves the *town* toward
good. OG: open (outside AI proposed "supports"). So the ISTJ can never reach OE or CE.

Not made: **ISFJ, ISTP, INFP** (all four cells open). Starting alignments are open for everyone except the INTJ
(OE) and the ENTP (CE).

## 1. The model

| Item | What | Mark |
|---|---|---|
| Axes and endings | Good/evil × order/chaos: four quadrant endings (OG church-like, CG stereotypical pirate town, OE Cthulhu, CE killers and devil worship) plus neutral at the centre (a ghost town) | Rex |
| Who moves the town | Your conduct on all four questlines earns alignment points; crew who witness it shift by their own inner rules (the maps); the residents who stay move the town | Rex |
| Inner rules | Each character's map; egging them the way they want moves them there, other pushes send them elsewhere | Rex (open A answered: they hold) |
| Who earns points | Only the witnessing crew, or the player too | open (B) |
| 3 residents per quadrant | The plan for the 12 residents; who sits where is open | Rex (plan); assignment open |
| Neutral | Hard to get unless you truly play balanced; the game rewards going all out in one direction | Rex |
| All endings possible | With a 3-member crew, the player's actions can lead to a fully developed town, and every option is achievable | Rex (2026-10-27) |
| Six facilities | Parts of town that are equivalent and compete; each has two options, two characters per facility; only one of each pair needs to succeed; each has two potential outcomes | Rex (2026-10-27) |
| Sector: church vs clinic | the ISTJ priest vs the ISFJ doctor | Rex |
| Sector: farm vs butcher shop | the INTP farmer vs the ESFP cook | Rex |
| Sector: hunting / gathering | the ESTP vs the ISTP | Rex |
| Sector: inventions | the ENTP vs the INTJ | Rex |
| Sector: commerce | the ENFJ warehouse heir vs the ESFJ merchant | proposed (outside AI) |
| Sector: society / power | the ESTJ privateer vs the INFP courtesan; the outside AI flagged it weak (no shared town function) | proposed (outside AI) |
| Both can succeed | Both institutions in a sector can succeed with extra work; pairs compete for time, crew slots and resources, not by excluding each other (consistent with Rex's rule that recruiting the farmer and the cook can trigger a secret duel) | proposed (outside AI) |
| Three tracks | Track sector completion, institution development and town alignment separately | proposed (outside AI) |
| Crew size | 3 slots to start (a 4th can sleep on deck, `../PIRATE.md` §4a) | Rex |
| Crew rotation | A progressive storyline: crew storylines develop or end, and you logically fill the empty spot with someone else; not always forced, but it should feel logical | Rex (2026-10-27) |
| Rex's levers | He is willing to add characters per location, or increase the crew size, if balance needs it | Rex |

### How this file reads "can reach" (the keeper's reading; tell me if it's wrong)

- A character **can reach** a quadrant if some action you do in front of them lands them there, or they start there
  and can be left there.
- A **sector covers** an ending if at least one of its pair can reach it. This is the strict reading of "every
  option is achievable": a fully developed town in quadrant X has every sector's winning institution in X. The loose
  reading (the town's overall alignment is X, whatever each institution became) is far easier: every ending already
  has 5 or 6 characters who can reach it (table below), so the loose reading has no starvation at all.
- A **route** to an ending = one character per sector who can reach it. Counted by multiplying.
- Nothing here weighs how many actions it takes, or how likely a player is to stumble into it. That's chance.

## 2. Reachability table

Generated by `reach.py` on 2026-10-27 (live copy: `TABLE.md`). `yes` = follows from Rex's decided maps.
`map?` = only through a map cell that is still open. `start?` = the map is complete and never lands there; only an
open starting alignment there (and never pushing them) would reach it. `no` = ruled out.

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
| `istj-m` | map? | map? | **no** (Rex: can't be corrupted) | **no** |
| `isfj-f` | map? | map? | map? | map? |
| `istp-f` | map? | map? | map? | map? |
| `infp-m` | map? | map? | map? | map? |

### Per sector

| Sector | Pair | Mark | OG | CG | OE | CE |
|---|---|---|---|---|---|---|
| church vs clinic | ISTJ / ISFJ | Rex | **open only** (ISTJ map?, ISFJ map?) | **open only** (ISTJ map?, ISFJ map?) | **ISFJ alone, map not made** | **ISFJ alone, map not made** |
| farm vs butcher shop | INTP / ESFP | Rex | yes: INTP | yes: ESFP | yes: INTP | yes: ESFP |
| hunting / gathering | ESTP / ISTP | Rex | **open only** (ISTP map?, ESTP start?) | yes: ESTP | **open only** (ISTP map?, ESTP start?) | yes: ESTP |
| inventions | ENTP / INTJ | Rex | yes: ENTP alone | yes: ENTP alone | yes: ENTP, INTJ | yes: ENTP alone |
| commerce | ENFJ / ESFJ | proposed | yes: ENFJ, ESFJ | yes: ESFJ alone | yes: ENFJ, ESFJ | yes: ESFJ alone |
| society / power | ESTJ / INFP | proposed | yes: ESTJ (INFP map?) | yes: ESTJ (INFP map?) | yes: ESTJ (INFP map?) | yes: ESTJ (INFP map?) |

### Per ending

| Ending | Characters who can reach it now | Sectors covered now | Sectors resting only on something open | Starved now | Full-town routes now | Routes if every open item lands well |
|---|---|---|---|---|---|---|
| Orderly good | ENTP, INTP, ESFJ, ENFJ, ESTJ (5) | 4 / 6 | church vs clinic, hunting | none | **0** | 32 |
| Chaotic good | ENTP, ESFP, ESTP, ESFJ, ESTJ (5) | 5 / 6 | church vs clinic | none | **0** | 32 |
| Orderly evil | ENTP, INTJ, INTP, ESFJ, ENFJ, ESTJ (6) | 4 / 6 | church vs clinic, hunting | none | **0** | 32 |
| Chaotic evil | ENTP, ESFP, ESTP, ESFJ, ESTJ (5) | 5 / 6 | church vs clinic | none | **0** | 16 |
| Neutral | not a quadrant: reached by staying near the centre; the INTJ's "shown she's wrong" also lands her there | n/a | | | | |

**No ending has a fully decided full-town route yet**, because no member of the church vs clinic sector can
reach any quadrant through anything Rex has decided. Nothing is starved outright: every gap could still be filled by
a map Rex hasn't made. CE has half the "if all goes well" routes of the others because the ISTJ can't be corrupted,
so the faith sector's evil side has one candidate, not two.

Chance, for the record only (not a problem): OE has the most characters (6) and the INTJ falls into OE from every
action, so OE is the likeliest ending a player drifts into. Rex hasn't asked for chance to be balanced.

## 3. Problems found, ranked

Each problem lists fix options in the five kinds asked for: (a) change a remaining map, (b) re-pair the sectors,
(c) add a character to a location, (d) widen the crew, (e) a non-character route such as a quest action. Rex
chooses.

### P1. Church vs clinic has no evil side except the ISFJ, and the ISFJ's map isn't made

The ISTJ priest can't be corrupted (Rex), so for an orderly evil or chaotic evil town the clinic is the only way to
develop this sector, and the ISFJ's map is blank. The priest also has no decided route to chaotic good (CG and OE
are "no effect"), so unless his starting alignment is CG, the ISFJ is the only CG candidate too. The sector can
reach nothing yet, which is why every ending shows 0 decided routes.

It's made tighter by Rex's joining rule: the ISFJ only joins if the ESTP is in your party. So every evil full-town
route needs the ESTP recruited first and aboard when the ISFJ joins: 2 of the 3 slots. For OE, the ESTP can't reach
OE, so she is in the party only as the ISFJ's key (see P2).

Options:

- (a) The ISFJ's map includes OE and CE (and CG, unless the ISTJ starts CG). That closes it with no new canon
  beyond her map. Her outside-AI "paired developments" (compassionate care vs cruelty as treatment) already point
  at a good side and an evil side, but that's proposed.
- (a) The ISTJ's open OG cell lands on OG (or his start is OG), so the priest carries the good side and the ISFJ
  only has to carry evil.
- (b) Re-pair: give the ISTJ a partner who isn't gated behind another character.
- (c) Add a character to the church or the clinic who can be corrupted (an acolyte, an assistant).
- (e) Let the church turn evil without its priest: the outside AI's proposed quadrant states already have
  `port.church` become an eldritch temple (OE) or a desecrated ruin (CE). If the church's form follows the town
  rather than the priest, the sector reaches evil without corrupting him. This fits "he can't be corrupted" and
  "his nature isn't corrupted by the quest".
- (e) Loosen the ISFJ's gate for evil routes (another way to win her over).

### P2. Hunting has no orderly side except the ISTP, and the ISTP's map isn't made

The ESTP reaches only CG and CE. OG and OE hunting rest wholly on the ISTP. On OE routes this stacks with P1: the
ESTP must be recruited to unlock the ISFJ, yet the hunting sector then needs the ISTP. If recruiting one of a pair
pushes the other's institution toward ghosthood (as Rex's food rule does for the farm and the butcher shop), that
would break OE: the ESTP you needed for the clinic would ghost the ISTP's sector. Whether that food rule applies to
other pairs is open.

Options:

- (a) The ISTP's map includes OG and OE. The food pair already works this way (the INTP covers the order side,
  the ESFP the chaos side); the ISTP covering the order side would mirror the ESTP the same way.
- (a) Set the ESTP's starting alignment on an orderly quadrant (she stays there if never pushed). Weak: it only
  works if you never act in front of her, which the ISFJ's gate makes hard.
- (b) Re-pair the hunters with others.
- (c) Add an orderly hunter or gatherer.
- (e) Say the food rule's "the other drifts toward ghosthood" applies only to the food pair, so recruiting the
  ESTP for the clinic never costs the ISTP's sector.

### P3. If "succeed" means the institution, commerce via the ESFJ can't succeed (proposed pair only)

Rex's rule: the ESFJ's shop always fails, and then he joins you (`port.esfj_shop` ends `failed`). In the proposed
commerce pair he is the only one who reaches CG and CE (the ENFJ reaches OG and OE). If a sector needs one of its
pair's *institutions* to succeed, CG and CE commerce have no route.

Options:

- (b) Pair the ENFJ with someone else whose institution can stand in a chaotic town, or leave commerce unpaired.
- (a) Set the ENFJ's starting alignment chaotic (he reaches CG/CE only by start). Weak, as in P2.
- (e) Let the ESFJ's commerce count without the shop: he keeps selling rare goods from your ship (Rex), or the
  shop's failure itself is a CG/CE outcome for the sector.
- (e) The warehouse journey (Rex: legit trade or stolen goods and drugs) gives `port.warehouse` an illicit state
  that reads as evil. If the warehouse's form follows the ENFJ's good/evil and the town's order/chaos, the ENFJ's
  institution alone could cover all four.

### P4. Inventions via the ENTP depends on one departure

The ENTP alone carries OG, CG and CE for inventions (the INTJ only reaches OE). Rex's rule: keep him at his
explained departure and "his contribution to the town never happens"; let him go and he doesn't come back. If his
contribution is the inventions sector, then every OG, CG or CE town with inventions developed needs you to let him
go at that one event, and his alignment is frozen at whatever it is then. He is also the fickle one who keeps
leaving. That's a route, so opportunity holds; it's fragile. Also open: whether his chaotic-evil guarantee (on
return he makes something that turns the town CE) still fires under the new model; if it does, any route where he
sees CE conduct carries CE pressure.

Options:

- (a) None needed for opportunity. To spread the load, the INTJ's "neutral" exit could become a second map
  (her questline's open question), giving inventions a second carrier.
- (c) Add another inventor at the shipyard (Rex: a few other shipyard characters live there).
- (e) Tie his contribution to his alignment at the moment you let him go, and say so to the player through clues.

### P5. Single carriers in the proposed sectors

Society: the ESTJ carries all four alone; the INFP's map is blank. Commerce CG/CE: the ESFJ alone (and see P3).
Not a break: every cell is covered. It means one recruitment or one storyline ending badly removes the sector's
only route to that ending. The outside AI already flagged the society pair as weak. One thing on file that may bear
on it: both are found at the tavern (the ESTJ's joining games are at the pub, the INFP works at the brothel).

Options: (a) give the INFP's map at least the quadrants Rex wants doubled; (b) re-pair once Rex names the last
two sectors; (c) add a character at the tavern.

### P6. Structural opens that change every count above

Not imbalances yet; each one can make the table wrong, so Rex's answer is needed before the counts mean much.

1. **How a crew member's alignment reaches the town.** Rex: residents who stay move the town; crew aboard
   witness and shift. The characters you steer are aboard, not in town. The food rule suggests their institution
   (run by their child) carries their effect while they're away, and the ENTP acts "when he returns". Which is it
   for each sector: their institution, their return, or only the residents who stayed?
2. **Open B: whether the player earns points too.** Most steering is contrary by design (Rex: confusing yet
   logical). For an OG town, the ENTP needs Cthulhu (OE) acts in front of him, the INTP and ESTJ need pirate (CG)
   acts. If your own acts also move the town, the acts you need for steering push the town away from OG. A route
   would then need the steering done with only that crew watching and the town effect small enough to win back.
3. **Is a character's last witnessed action what counts, or a drift?** The table assumes they can be left where a
   push lands them. Crew in the same party all see the same act and move differently; with 3 slots and rotation
   this can be sequenced, but if moves are slow drifts it costs much more time.
4. **"Each has two potential outcomes".** Four quadrants per sector need four forms. Two options × two outcomes =
   four only if each pair splits the square: the food pair does (farmer OG/OE, cook CG/CE). The warehouse's two
   states (legit, illicit) read as good/evil only; on their own they can't tell OG from CG.
5. **Starting alignments.** Open for 10 of 12. They decide the `start?` cells and Rex's "3 per quadrant".

## 4. Constraints for the unfinished maps

The minimum each must or must not include for every ending to keep at least one full-town route (strict reading).
Not filled-in maps; Rex makes them.

| Map | Must include | Must not | Why |
|---|---|---|---|
| ISFJ `isfj-f` | **OE and CE**; also **CG** unless the ISTJ's start is CG; also **OG** unless the ISTJ's OG cell or start lands on OG | nothing | the ISTJ can't be corrupted (P1) |
| ISTP `istp-f` | **OG and OE** | nothing | the ESTP is chaos-only (P2) |
| ISTJ `istj-m` (OG cell, start) | nothing strictly, if the ISFJ takes all four; to share the load, OG | **OE, CE** (Rex: can't be corrupted) | P1 |
| INFP `infp-m` | nothing, while the ESTJ is their pair (the ESTJ reaches all four) | nothing | P5. If Rex re-pairs society, recompute |
| The two unnamed sectors (if not the proposed ones) | the pair together must reach all four quadrants | | the strict reading |
| Any new character (if Rex adds one) | together with their sector partner, all four | | |

If Rex lifts P1 with option (e) (the church changes with the town, not the priest), the ISFJ's constraint drops to
nothing. If he applies the food pattern everywhere (each pair splits the square), the ISFJ would need the evil row
(OE, CE) and the ISTP the order column (OG, OE).

To recheck after a map changes: edit `maps.json`, run `python reach.py`, read `TABLE.md`.

## 5. What's open

- The ISFJ, ISTP and INFP maps; the ISTJ's OG cell; 10 starting alignments (story keeper's to record).
- Which two sectors complete the six, and whether the proposed commerce and society pairs stand.
- Whether both institutions in a sector can succeed (proposed), and whether the food rule's "the other drifts
  toward ghosthood" applies to every pair.
- What "succeed" means for a sector: the institution developed, the character's storyline done, or both.
- P6.1 to P6.5: how crew alignment reaches the town, open B, last-push vs drift, two outcomes vs four quadrants,
  starting alignments.
- Whether the keeper's strict reading (every sector in X for a full X town) is what Rex means, or the loose one.
- Whether the crew grows past 3 within the first port (Rex is willing; nothing here needs it yet: six sectors fit in
  two rotations of three, apart from the ISFJ needing the ESTP aboard).

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-27 | Created: model, reachability table and script, problems P1–P6, constraints, opens. Rex's six-facility design and crew rotation recorded; the outside AI's commerce and society pairs, "both can succeed" and the three tracks as proposed | keeper; design Rex |
