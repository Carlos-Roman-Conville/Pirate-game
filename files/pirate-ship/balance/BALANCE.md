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
- `ALIGNMENT.md`: the alignment system spec the engine is built from (Rex's rules, marked).
- (retired 2026-10-28: `maps.json`, `reach.py`, `TABLE.md`; the engine's `data/pirate-ship/alignment/charts.json`
  and `web/src/alignment/sim` answer the same questions from one source.)

## The simulator's first answer (2026-10-28, after the belt built the engine)

`cd web && npx vitest run src/alignment/sim` (the real engine, `web/src/alignment/`, Rex's rules of 2026-10-28,
placeholder numbers): **every perfect town is reachable.** Perfect OG in 55 steps, CG 62, OE 43, CE 51 (a step =
one engine command: recruit, party, event, leave, develop, sleep). Each route is printed by the smoke test. Two
limits of this first answer: the simulator doesn't yet know the story's joining gates (the ISFJ needing the ESTP
aboard, the reputation gates), so its OG route recruits the doctor directly; and the develop conditions (what each
character needs beyond recruiting) aren't data yet, so `develop` is sent freely. Both come in as data from Rex; the
engine won't change. `reach.py`, `maps.json` and `TABLE.md` are retired: `charts.json` and `charts.ts` are the one
source now (ALIGNMENT.md's build rule).

## The second answer: with the joining gates (2026-10-28, later)

Rex chose to put the known joining gates into the simulator as data (`gates.json`, `unlock` command; ALIGNMENT.md
§7; built by the belt, 2486). The facts (Rex, 2026-10-27): the INTP, ESTP, ESFP and ISFJ are story-gated
(reputation plus sub quests, represented as an `unlock` the game issues; one step each in the sim), and the ISFJ
also needs the ESTP aboard. Rerun: **every perfect town is still reachable.** OG 60 steps (was 55), CG 67 (62),
OE 48 (43), CE 56 (51); the difference is the unlocks. The OG route now earns the doctor the intended way: unlock the
ESTP, recruit her, then recruit the ISFJ with her aboard; the clinic develops OG, hunting develops through the ISTP,
and the ESTP goes home undeveloped (her hunting slot is the ghost, C1 b). What the sim still doesn't know: the
develop conditions (sub quests, the farm's bodies), which reputation and what level the gates need (open, town
keeper), and whether "in your party" means the crew or the event party (placeholder: the crew).

## The third answer: with the develop conditions (2026-10-28, later still)

Rex chose to put the develop conditions the story gives into the simulator as data (`conditions.json`, `supply`
command; ALIGNMENT.md §5; built by the belt, 2487). The only conditions the story gives so far: the farm and the
butcher shop need the bodies supplied (Rex, 2026-10-28; how many and whether it must continue: open; placeholder
once). Every other character's `develops_place` is open, so those slots still develop on the command alone; that's
the open state, not a rule. Rerun: **every perfect town is still reachable.** OG 61 steps, CG 68, OE 49, CE 57; one
more step each, the supply of bodies to whichever food place the route develops. The simulator now carries every
rule Rex has given; what remains before the counts mean anything is Rex's tuning of the placeholder numbers
(ALIGNMENT.md §8) and the open conditions as he writes them.

## Where it stands (2026-10-28)

**Every ending has a route.** All 8 sectors reach all four quadrants, and every character's chart is made. Full-town
routes (one character per sector who can reach the ending):

| Ending | Full-town routes | Example route (church, healing, food, hunting, inventions, commerce, brothel, town hall) |
|---|---|---|
| Orderly good | 8 | ISTJ, ISFJ, INTP, ISTP, ENTP or INFJ, ENFJ or ESFJ, ISFP, ESTJ or ENFP |
| Chaotic good | 4 | ISTJ, ISFJ, ESFP, ESTP or ISTP, ENTP, ESFJ, INFP, ESTJ or ENFP |
| Orderly evil | 8 | ENTJ priest, ISFJ or INTJ, INTP, ISTP, ENTP, ENFJ or ESFJ, INFP, ESTJ or ENFP |
| Chaotic evil | 4 | ENTJ priest, ISFJ, ESFP, ESTP or ISTP, ENTP, ESFJ, ISFP, ESTJ or ENFP |

No gaps remain under the keeper's strict reading.

**Rex's goal for the whole town (2026-10-28):** a route to a perfectly working town by the end, through a
complicated set of choices: you can't recruit everyone, but who you choose to develop can get you there. He is
open to adding a third or fourth person to any competition where one side is forced to drift.

## Choices for Rex (2026-10-28)

The keeper lays these out; Rex picks. Nothing here is decided.

### C1. What happens to a rival when you recruit one of a pair (the ghost rule)

Rex's food rule (farm vs butcher shop, tentative): recruit neither → both places go to ghosts; recruit one → it
improves, the rival's drifts toward ghosts; recruit both → both improve, plus a secret duel. **Decided
(Rex, 2026-10-28, after the options below): option b, every pair, and recruiting both lets both improve.** With
"every developed place counts toward a perfect town" (also Rex, 2026-10-28), recruiting both is allowed but costs:
both places must end in the same quadrant.

| Option | What it means | Effect on balance |
|---|---|---|
| a. Food pair only | Other rivals aren't harmed by recruiting their competitor | No ending loses a route. The other pairs compete only for time and slots |
| **b. Every pair, with "recruit both, both improve"** (chosen) | The full food rule everywhere | All four endings keep their routes; a perfect OG town needs both hunters recruited, and the ESTP's place must then also reach OG, which her chart can't (C2) |
| c. Every pair, recruiting both still costs one (for example the duel's loser ghosts) | Recruiting both is a gamble | Orderly good survives only if the player can steer the hunters' duel to the ISTP |
| d. Every pair, no "both" case | Recruit one, the other ghosts, full stop | **Orderly good has no route** (C2) |

### C2. The orderly good hospital is an earned route (Rex, 2026-10-28)

**(Rex)** The hidden way to an orderly good hospital is supposed to be earned. Giving it away through another
option defeats the purpose. So the knot is the design, not a problem:

- healing in OG can only be the ISFJ (the INTJ never reaches OG), and she only joins with the ESTP in your party;
- hunting in OG must be the ISTP (the ESTP never reaches OG);
- so a perfect OG town means bringing the ESTP aboard as the doctor's key while still developing the ISTP's side.

The keeper's only job here is to keep that route **possible**, not easy. Under Rex's 2026-10-28 rules it is:
ghost rule b (every pair; both recruited, both can develop) and "every developed place counts" would have closed
it, since the ESTP must be recruited for the doctor and her place can never be OG; but Rex also ruled that
**recruiting alone doesn't develop a place** (it takes a sub quest or supplying what they need), so the ESTP can
be recruited as the doctor's key while her hunting place stays undeveloped, and the ISTP's is the one developed.
The earned route stands: recruit the ESTP (don't do her sub quest), win the doctor, develop the clinic in OG,
develop the ISTP's hunting in OG. The simulator will confirm it once the develop conditions are data. No third healer, third hunter or
other bypass is proposed: those would give the route away.

### C3. Lopsided pairs: where one side never has to win

A pair is lopsided when one character can win the sector for every ending they share, so the other is never
*needed*. Opportunity holds either way; this is about whether each rival matters. Who must win each sector in a
perfect town of each ending ("either" = both can):

| Sector | OG | CG | OE | CE | The side that never has to win |
|---|---|---|---|---|---|
| church | ISTJ | ISTJ | ENTJ priest | ENTJ priest | none: an even split |
| healing | ISFJ | ISFJ | either | ISFJ | **INTJ** (only ever shares OE) |
| food | INTP | ESFP | INTP | ESFP | none: an even split |
| hunting | ISTP | either | ISTP | either | **ESTP** (only ever shares CG, CE) |
| inventions | either | ENTP | ENTP | ENTP | **INFJ mechanic** (only ever shares OG) |
| commerce | either | ESFJ | either | ESFJ | **ENFJ** (only ever shares OG, OE) |
| brothel | ISFP | INFP | INFP | ISFP | none: an even split |
| town hall | either | either | either | either | **both overlap fully**: either always works |

Church, food and brothel are clean splits (each rival owns two endings). The other five lean to one side. Some of
that may be deliberate, as with C2; listed only so Rex can see it. If Rex wants a rival to matter more, the fixes are a third person who takes the dominant one's place in some endings, or
the dominant one's chart giving some quadrants up (charts are Rex's; the keeper doesn't touch them). Not a gap: no
ending loses a route.

### C4. "You can't recruit everyone"

A perfect town recruits each sector's winner at least once (if recruiting is what develops a place, as in the food
rule): 8 recruits, plus the ESTP as the ISFJ's key on doctor routes, through 3 slots and rotation. Open: is there a
limit on total recruits (time, storylines ending, a cap), and does it leave room for 8 or 9?

### C5. The scope change (Rex, 2026-10-28): what has to be decided before any of it is coded

Rex's new scope is recorded in `ALIGNMENT.md` §10 and PLAN Phase 3. These are the places where it collides with
rules already decided, or where the engine can't move without a rule. Each is Rex's call; none is urgent while
nothing is built. The current simulator verdicts (OG 61, CG 68, OE 49, CE 57) stand until these change the model.

1. **Pairs vs locales (collides with C1 b).** The ghost rule, "one recruited → the rival's place ghosts", assumes
   pairs. If the farm and the butcher shop become two locales with history that develop independently **(Rex,
   considering)**, that sector no longer has a rival to ghost; and the question follows for the other seven. If
   rivals stop ghosting each other, the scarcity that makes routes earned ("you can't recruit everyone") has to come
   from somewhere else: crew slots, departures, deaths. Options: (a) keep C1 b for every sector except food; (b)
   the ghost rule becomes a per-relationship rule, written locale by locale; (c) drop rival-ghosting; ghosts come
   only from neglect and from deaths.
2. **Points carried home vs the slot adopting its owner's position.** Today a developed place simply takes its
   owner's alignment at sleep. "Characters carry points" could mean the same thing, or a deposit that accumulates
   (several carriers add up), or a daily influence while they live there. ChatGPT's "decide this first" is right:
   the engine's §5 is rewritten differently for each. Options: (a) adopt (today); (b) deposit once on return, summed
   over everyone returning to that locale; (c) daily influence from residents while they stay.
3. **Influence as its own number.** "A strongly OG nobody vs a respected priest" needs a per-character influence
   with a source (STATS.md proposed `<slug>.influence`; Rex chose a plain mean for the town on 2026-10-28). If it
   returns, it's a new quantity every one of 108 characters carries. Options: (a) none, alignment only; (b) a fixed
   number per character in data; (c) derived from reputation/hearts (the story and stats keepers' systems).
4. **Death doesn't exist in the engine.** `location` is town, aboard or departed. Character ghosts need a fate,
   a trigger (which combinations, at which sleep), and an answer to "do ghosts still influence the town". The
   paladin combo needs support data (who backs whom, how many is enough). All story data; the engine only needs the
   verbs (`die`, `ghost`) and the resolution rule.
5. **The three neutrals need two things the square can't give:** who counts ("every relevant character": the
   recruited ones, or all 108, or the town's residents), and the fates. Living neutral also needs the town's mean
   inside the neutral band with everyone alive: developed places in pure quadrants have to cancel (OG against CE,
   CG against OE); the simulator can test it once the fate rules exist. ChatGPT's "not reachable by keeping values
   low" is a rule only if Rex states it.
6. **An empty town reads (0, 0) today, implicitly** (`town.ts`). If ghost neutral depends on it, it should be an
   explicit key so no one later "fixes" it.
7. **Perfect towns scale with locales.** Under "every developed place counts", a 108-character town is perfect only
   if every developed locale shares one quadrant; the more locales, the harder. That matches earned routes, but the
   count is a tuning lever Rex should set knowingly (perhaps a minimum number developed, perhaps only locales).
8. **The 16 novice slots.** Only characters who move the town need a start and a chart, and charts are Rex's
   drawing. If novices carry points home too, that's 16 more charts before the sim can include them; if they're
   crew only, they stay out of the alignment data and nothing changes.
9. **Sequence rules are data, and they're the living-neutral puzzle.** The command log already preserves order, so
   "X before Y" costs nothing in the engine; but each such rule is story the keepers haven't written, and the sim
   can only test living neutral against the rules that exist.
10. **Other keepers' files are touched by this and I haven't told them** (Rex: alter nothing yet): `town/TOWNS.md`
    and `UPGRADES.md` (pairs, slots), `crew/ROSTER.md` (32 → 108), `town/ENDINGS.md` (three neutrals), `STATS.md`
    (influence). Say when to send it.

## Are the alignment maps on file?

**Yes.** Rex's maps are recorded by the story keeper as Rex (each character file's "Inner rules" section and the
matrix in `../story/QUESTLINES.md`). The charts Rex gave here on 2026-10-28 (ISFJ, ISTJ, ENTJ priest, ENFP, ISFP,
INFP, INFJ, ISTP) have been sent to the story keeper. The reachable sets the outside AI quoted for 8 characters all agree with Rex's maps.

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
| Evil ENTJ priest (new, Rex, 2026-10-28; slug not assigned yet) | OG→CE, CG→OE, OE no change (leans OE), CE no change (leans CE) | OE, CE | n/a |
| ENFP (tentative; Rex's chart, 2026-10-28) | OG→CG, CG→OG, OE→CE, CE→OE (two double-headed arrows: good acts swap them across the good row, evil acts across the evil row; keeper's reading) | all four | n/a |
| INFJ mechanic (Rex, 2026-10-28) | OG no change (leans OG), CG→OG, OE→OG, CE→OG: every action leads to orderly good (the INTJ's map mirrored onto OG) | OG | n/a |
| INFP `infp-m` (Rex, 2026-10-28) | OG→CG, CG→OE, OE no change (leans OE), CE→OE | CG, OE | n/a |
| ISFP (tentative; Rex's chart, 2026-10-28) | OG→CE, CG→OG, OE→CE, CE no change (leans CE) | OG, CE | n/a |
| ISTP `istp-f` (Rex, 2026-10-28) | OG→CG, CG→OE, OE→CE, CE→OG (a full cycle, no loops) | all four | n/a |
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

Every chart is made (2026-10-28). Starting alignments are open for everyone except the INTJ (OE) and the ENTP (CE).

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
| Church | Kept separate from the clinic. The ISTJ priest vs a new character, the evil ENTJ priest | Rex (2026-10-28) |
| Healing | The ISFJ's clinic vs the INTJ's apothecary compete for the town's healing | Rex (2026-10-28) |
| Food | The INTP farmer's farm vs the ESFP cook's butcher shop | Rex |
| Hunting / gathering | The ESTP vs the ISTP | Rex |
| Inventions | The ENTP vs the INFJ mechanic (a newcomer, below). The INTJ is no longer his competitor: their stores don't compete economically. They still don't respect each other, a rivalry that isn't direct | Rex (2026-10-28) |
| Commerce | The ENFJ warehouse heir vs the ESFJ merchant | Rex (2026-10-28; first proposed by the outside AI) |
| ~~Society / power~~ | ~~The ESTJ privateer vs the INFP courtesan~~ (outside AI's proposal). Replaced 2026-10-28 by the two rows below | superseded |
| Brothel | Control of the brothel: the INFP vs an ISFP ("thinking": tentative) | Rex (2026-10-28) |
| Town hall | Control of the town hall: the ESTJ vs an ENFP ("thinking": tentative). The town hall is a new place | Rex (2026-10-28) |
| Both can succeed | Both institutions in a sector can succeed with extra work; pairs compete for time, crew slots and resources, not by excluding each other (consistent with Rex's rule that recruiting the farmer and the cook can trigger a secret duel) | proposed (outside AI) |
| Three tracks | Track sector completion, institution development and town alignment separately | proposed (outside AI) |
| Crew size | 3 slots to start (a 4th can sleep on deck, `../PIRATE.md` §4a) | Rex |
| Crew rotation | A progressive storyline: crew storylines develop or end, and you logically fill the empty spot with someone else; not always forced, but it should feel logical | Rex (2026-10-27) |
| Rex's levers | He is willing to add characters per location, or increase the crew size, if balance needs it | Rex |

### The INFJ mechanic (Rex, 2026-10-28)

- **(Rex)** A newcomer to town. His inventions blow the ENTP's out of the water: he clearly dominates without trying
  hard. He's really trying to get in so he can be lazy, milk everyone for their money, and leave when they can't
  pay him any more.
- **(Rex)** He's getting ready to leave soon: the town is nearly out of cash. He has only stayed so long out of
  nostalgia, and someone has invited him to the next town over to be part of their big project.
- **(Rex)** The competition: he has done this his whole life; the ENTP started 2 years ago. The INFJ makes more
  consistently effective machinery; the ENTP's weapons have more devastating potential, if he can work out the bugs.
- **(open)** Whether he can be kept in town or recruited before he leaves, and what happens to
  the inventions sector if he leaves; whether he's one of the recruitables (the cast was 12, 6 men and 6 women).
- Balance note (keeper): no gap either way, because the ENTP reaches all four. His leaving soon only matters if his
  chart is meant to give inventions a second route to an ending; then the player needs a realistic window to reach
  him before he goes.

That makes **eight** sectors as of 2026-10-28 (all Rex's): the church left the clinic's pair, and
the proposed society pair became the brothel and the town hall.

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
| evil ENTJ priest | start? | start? | yes (lean) | yes (lean) |
| `istp-f` | yes | yes | yes | yes |
| `infp-m` | start? | yes | yes (lean) | start? |
| `infj-m` | yes | no | no | no |

### Per sector

| Sector | Characters | Mark | OG | CG | OE | CE |
|---|---|---|---|---|---|---|
| church | ISTJ / evil ENTJ priest | Rex | yes: ISTJ | yes: ISTJ | yes: ENTJ priest | yes: ENTJ priest |
| healing | ISFJ / INTJ | Rex | yes: ISFJ (lean) | yes: ISFJ | yes: ISFJ, INTJ | yes: ISFJ |
| food | INTP / ESFP | Rex | yes: INTP | yes: ESFP | yes: INTP | yes: ESFP |
| hunting / gathering | ESTP / ISTP | Rex | yes: ISTP | yes: ESTP, ISTP | yes: ISTP | yes: ESTP, ISTP |
| inventions | ENTP / INFJ mechanic | Rex | yes: ENTP, INFJ | yes: ENTP | yes: ENTP | yes: ENTP |
| commerce | ENFJ / ESFJ | Rex | yes: ENFJ, ESFJ | yes: ESFJ alone | yes: ENFJ, ESFJ | yes: ESFJ alone |
| brothel | INFP / ISFP (tentative) | Rex | yes: ISFP | yes: INFP | yes: INFP | yes: ISFP |
| town hall | ESTJ / ENFP (tentative) | Rex | yes: ESTJ, ENFP | yes: ESTJ, ENFP | yes: ESTJ, ENFP | yes: ESTJ, ENFP |

### Per ending

| Ending | Characters who can reach it now | Sectors covered now | Resting only on something open | Starved | Full-town routes now | If every open item lands well |
|---|---|---|---|---|---|---|
| Orderly good | ENTP, INTP, ESFJ, ENFJ, ESTJ, ISTJ, ISFJ, ENFP, ISFP, INFJ, ISTP (11) | **8 / 8** | none | none | **8** | 8 |
| Chaotic good | ENTP, ESFP, ESTP, ESFJ, ESTJ, ISTJ, ISFJ, INFP, ENFP, ISTP (10) | **8 / 8** | none | none | **4** | 4 |
| Orderly evil | ENTP, INTJ, INTP, ESFJ, ENFJ, ESTJ, ISFJ, INFP, ENTJ priest, ENFP, ISTP (11) | **8 / 8** | none | none | **8** | 8 |
| Chaotic evil | ENTP, ESFP, ESTP, ESFJ, ESTJ, ISFJ, ENTJ priest, ENFP, ISFP, ISTP (10) | **8 / 8** | none | none | **4** | 4 |
| Neutral | not a quadrant: reached by staying near the centre; the INTJ's "shown she's wrong" also lands her there | n/a | | | | |

**All four endings are complete** (2026-10-28, with the ISTP's chart). Orderly good and orderly evil have 8
full-town routes each, chaotic good and chaotic evil 4 each. ("If every open item lands well" now equals "now":
only starting alignments remain open, and the table doesn't count them as routes.)

Chance, for the record only (not a problem): OG and OE have the most characters (11 each) and twice the routes of CG and CE; and the INTJ falls into OE from every
action, so OE is the likeliest ending a player drifts into. Rex hasn't asked for chance to be balanced.

## 3. Problems found, ranked

Each problem lists fix options in five kinds: (a) change a remaining map, (b) re-pair the sectors, (c) add a
character to a location, (d) widen the crew, (e) a non-character route such as a quest action. Rex chooses.

### P1. ~~The church can't be evil~~ Closed 2026-10-28 by the evil ENTJ priest

Rex made a church competitor, the evil ENTJ priest, who reaches OE and CE. Kept below for the record.

#### As it stood

The priest is the church's only character and can't be corrupted (Rex). With the church now its own sector, no one
can take it to OE or CE. His chart (2026-10-28) covers OG and CG.

Options:

- (c) **A church competitor** (Rex has said he may make one) whose diagram lands on OE and CE.
- (e) Let the church change with the town rather than with the priest: the outside AI's proposed quadrant states
  already have `port.church` become an eldritch temple (OE) or a desecrated ruin (CE). This fits "he can't be
  corrupted" and "his nature isn't corrupted by the quest".
- (e) A church that stands empty or falls in an evil town counts as the church's evil outcome (Rex's call whether
  "fully developed" allows that).

### P2. ~~Hunting has no orderly side except the ISTP~~ Closed 2026-10-28

The ISTP's chart reaches all four, so hunting has OG and OE. One part stays open (below, the food rule's reach).

#### As it stood

The ESTP reaches only CG and CE. On top of that, the ISFJ only joins if the ESTP is in your party, so routes using
the clinic need the ESTP recruited. If recruiting one of a pair pushes the other's institution toward ghosthood (as
Rex's food rule does for the farm and the butcher shop), recruiting the ESTP for the clinic would hurt the ISTP's
side. That would break OE and OG hunting on clinic routes. Whether that food rule applies to other pairs is open.

Options:

- (a) The ISTP's map lands on OG and OE. The food pair already works this way (the INTP covers the order side, the
  ESFP the chaos side).
- (a) Set the ESTP's starting alignment on an orderly quadrant. Weak: it only holds if you never act in front of her.
- (c) Add an orderly hunter or gatherer.
- (e) Say the food rule's "the other drifts toward ghosthood" applies only to the food pair. (Open again: C1.)

### P3. ~~Healing reaches OG only by the ISFJ's lean~~ Closed 2026-10-28

Rex: if you keep doing those actions, the lean eventually carries her all the way into that quadrant. Healing now
covers all four. (It costs more time than an arrow: chance, not opportunity.)

### P4. ~~If "succeed" means the institution, commerce via the ESFJ can't succeed~~ Closed 2026-10-28

Rex: the merchant still counts for commerce after his shop fails, since he keeps selling rare goods from the ship.
Commerce covers all four. Kept below for the record.

#### As it stood

Rex's rule: the ESFJ's shop always fails, and then he joins you. In the proposed commerce pair he is the only one
who reaches CG and CE. If a sector needs an *institution* to succeed, CG and CE commerce have no route.

Options: (b) pair the ENFJ with someone whose institution can stand in a chaotic town; (e) let the ESFJ's commerce
count without the shop (he keeps selling rare goods from your ship, Rex); (e) the warehouse's illicit state could
carry the chaotic or evil side if its form follows the town.

### P5. Fragile single carriers

Not gaps; each is one character carrying a sector's whole route to an ending, so losing them loses the ending.

- Inventions CG/OE/CE: the ENTP alone (the INFJ reaches OG only). The INFJ is about to leave town (below), so
  even with a chart his window may be short. Rex's rule: keep him at his explained departure and
  "his contribution to the town never happens". If that contribution is the inventions sector, every inventions
  route needs you to let him go at that one event, with his alignment frozen there. The new mechanic removes this.
- Commerce CG/CE: the ESFJ alone.
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

## 4. Constraints for the maps (all made as of 2026-10-28)

The minimum each must or must not include for every ending to keep at least one full-town route (strict reading).
Not filled-in maps; Rex makes them.

| Map | Must include | Must not | Why |
|---|---|---|---|
| Evil ENTJ priest | made (Rex, 2026-10-28): OE, CE | | P1 closed |
| ISTJ `istj-m` | made (Rex, 2026-10-28): OG, CG | OE, CE (Rex: can't be corrupted) | P1 |
| ISTP `istp-f` | made (Rex, 2026-10-28): all four | | P2 closed |
| INFJ mechanic `infj-m` (slug placeholder) | made (Rex, 2026-10-28): OG | | |
| INFP `infp-m` | made (Rex, 2026-10-28): CG, OE | | brothel complete |
| ENFP (tentative, the ESTJ's rival) | made (Rex, 2026-10-28): all four | nothing | the ESTJ reaches all four |
| ISFJ `isfj-f` | made (Rex, 2026-10-28); covers all four | | P3 closed |
| Any new character | together with their sector partner, all four | | the strict reading |

To recheck after a map changes: edit `maps.json`, run `python reach.py`, read `TABLE.md`.

## 5. What's open

- The evil ENTJ priest's slug, gender, starting alignment, and whether they're recruitable (the cast was 12 recruitables, 6 men and 6 women); 10 starting
  alignments (whether the ISFJ's and ISTJ's highlighted CE squares are their starts).
- Whether the priest's chart replaces his earlier OE and CE words (OE "does nothing"; CE "moves the town toward good").
- Eight sectors now (church, healing, food, hunting, inventions, commerce, brothel, town hall).
- The ENFP and ISFP: confirmed or not, gender, slug; whether the ENFP's highlighted CE square is a start; what the town hall is and who else is there.
- Whether both institutions in a sector can succeed (proposed); whether the ghost rule reaches beyond the food pair (C1).
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
| 2026-10-28 | New character, the evil ENTJ priest (OG→CE, CG→OE, OE and CE rings), competes with the ISTJ for the church; church covers all four (P1 closed); chaotic evil has its first decided route; only gap: hunting OG/OE (the ISTP) | Rex |
| 2026-10-28 | The INFJ mechanic: a newcomer who outclasses the ENTP without trying, milking the town before leaving for the next town's big project; the ENTP's competitor for inventions; chart not made | Rex |
| 2026-10-28 | The proposed society pair is replaced by two of Rex's sectors: the brothel (INFP vs a competitor) and the town hall (ESTJ vs a competitor); the brothel is now the main gap | Rex |
| 2026-10-28 | Commerce kept: the ENFJ warehouse heir vs the ESFJ merchant (now Rex's); P4 still open | Rex |
| 2026-10-28 | The merchant still counts for commerce after his shop fails (he keeps selling rare goods from the ship); P4 closed | Rex |
| 2026-10-28 | Rivals, tentative ("thinking"): the ESTJ vs an ENFP for the town hall, the INFP vs an ISFP for the brothel | Rex |
| 2026-10-28 | The ENFP's chart (OG↔CG, OE↔CE): reaches all four; the town hall has two carriers | Rex |
| 2026-10-28 | The ISFP's chart (OG→CE, CG→OG, OE→CE, CE lean): reaches OG and CE; the INFP must reach CG and OE | Rex |
| 2026-10-28 | The INFP's chart (OG→CG, CG→OE, OE lean, CE→OE): brothel complete; chaotic good and chaotic evil complete; only hunting OG/OE (the ISTP) left | Rex |
| 2026-10-28 | The INFJ mechanic's chart: every action leads to orderly good; inventions gains a second OG carrier; only the ISTP left | Rex |
| 2026-10-28 | The ISTP's chart (OG→CG, CG→OE, OE→CE, CE→OG): hunting complete; every sector reaches every ending; routes OG 8, CG 4, OE 8, CE 4 | Rex |
| 2026-10-28 | ~~The ghost rule applies to every pair~~ withdrawn the same day: Rex's "yes" was a gut feeling, not a decision; ghost rule beyond the food pair is open (C1) | Rex |
| 2026-10-28 | Rex's goal: a route to a perfectly working town through a complicated set of choices; open to a third or fourth person per competition. Choices C1–C4 laid out (ghost rule options, the ISFJ–ESTP knot, lopsided pairs, recruit limit) | Rex; keeper (options) |
| 2026-10-28 | The OG hospital (ISFJ via the ESTP, alongside the ISTP) is an earned hidden route by design; bypass options withdrawn; the keeper guards only that it stays possible | Rex |
| 2026-10-28 | Ghost rule b chosen (every pair, both improve); with all-developed counting, the OG hospital route closes and orderly good has no perfect route unless "developed" needs more than recruiting; flagged for Rex | Rex; keeper (finding) |
| 2026-10-28 | Recruiting alone doesn't develop a place (Rex): the OG hospital route is open again; flagged closure withdrawn | Rex; keeper |
| 2026-10-28 | The engine and simulator are built (belt tasks 2474–2485); all four perfect towns reachable under Rex's rules with placeholder numbers; reach.py, maps.json and TABLE.md retired | keeper |
| 2026-10-28 | Second simulator answer with the joining gates as data: all four perfect towns still reachable (OG 60, CG 67, OE 48, CE 56); OG earns the doctor through the ESTP | keeper; Rex (gates in) |
| 2026-10-28 | Third simulator answer with the develop conditions as data: all four perfect towns still reachable (OG 61, CG 68, OE 49, CE 57); only the food pair's bodies are known conditions | keeper; Rex (conditions in) |
| 2026-10-28 | C5: the scope change's collisions and open rules (pairs vs locales, points vs adopt, influence, death, three neutrals, empty town, scale, novices, sequence, other keepers) | keeper |
