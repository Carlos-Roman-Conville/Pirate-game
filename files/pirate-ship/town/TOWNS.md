# Towns (kept by the town keeper; Rex designs the towns)

Rex designs the towns, their parts and the endings. This file **records** what he decides. Every item is marked:

- **(Rex)**: his, canon.
- **(proposed)**: someone else's starting point; not canon until Rex says yes.
- **(open)**: nothing decided yet.

What lives where:

- This folder (`town/`): towns (this file), the upgrade slots the game checks (`UPGRADES.md`), the endings
  (`ENDINGS.md`) and judgements when Rex asks for them (`JUDGING.md`).
- Characters and story: `../story/STORY.md` and `../story/characters/` (the story keeper's). Linked here, never
  copied; a town decision that changes a character goes to the story keeper.
- Looks: `../art/ART_DIRECTION.md` (the art keeper's); per-state art status for town parts goes in
  `../art/TOWN_SHEETS.md`, keyed by the slot ids in `UPGRADES.md`.
- The rules the towns sit on: `../PIRATE.md` §4a (progression, the starting port) and §7b (hiring, kidnapping,
  reputation, residents vs visitors); reputation as a hidden number: `../STATS.md`.

**Ids.** Each town has an id in backticks used by `UPGRADES.md` and `ENDINGS.md`. Ids are stable: when Rex names a
town, its name changes here but its id does not.

## How towns work (Rex, 2026-10-26)

- **(Rex)** Like Digimon World 1: certain choices change certain parts of a town. Each part only gets certain
  upgrades for certain choices (who you recruit, let go, kidnap, help and so on).
- **(Rex)** You can't max a town out.
- **(Rex)** The **combinations** of those upgrades produce the endings. It's all text- and town-change based.
- **(Rex)** Several routes to a good or perfect ending; some are secret.
- **(Rex)** A town is an ecosystem, not a hiring board: residents with no reason to leave, plus visitors and people
  looking for work; the recruit pool is drawn from both (§7b).
- **(Rex)** Each town keeps a reputation with you, and each group inside it does too. Kidnapping someone a town
  likes upsets it, someone it dislikes pleases it; kidnapping a man a small group liked locks you out of dialogue
  with that group (§7b).
- **(Rex)** Ports have a hierarchy: the starting port at the bottom, where low-life pirates go; the last level a
  true pirate port, rich from the calibre of pirates coming through (STORY.md, The world).

## Towns

| Id | Town | Tier | Mark |
|---|---|---|---|
| `port` | The starting port (unnamed) | bottom | Rex (the port); id is the keeper's |
| | Ports between | | open |
| | The true pirate port | top | Rex (that it exists); everything else open |

## `port`: the starting port

**Name:** (open). **Always the same port** in every game, the game's Pelican Town (Rex, §4a).

### What it is

- **(Rex)** Run down and in shambles, weakly kept together by the trade coming through, just barely. Houses old and
  weathered from the sea; none of the buildings look new. Look: `../art/ART_DIRECTION.md` §3a.
- **(Rex)** A small pirate haven for criminals, ne'er-do-wells and schemers. Only low-life pirates come; a
  high-calibre pirate is extremely rare because the women and the drink are absurdly weak.
- **(Rex)** What keeps it together: a community that keeps living there, and the occasional ship that comes to
  trade and spend its coin.
- **(Rex) Central plotline:** it is already dying when you arrive. Fewer and fewer pirates come through; everyone is
  thinking of abandoning it; some stay. Your effect is either helping it thrive again or leading it to ruin.
- **(Rex)** Who you take changes the town: some of the crew you take are key toxic people causing the town issues;
  some you bring back improved.
- **(open)** Why it is dying (STORY.md open thread 8), who runs it, its history.
- **(proposed, outside AI)** Why it is dying: a richer pirate port nearby is drawing away the few ships that still
  visit.
- **(proposed, outside AI)** Crew vs town: taking a dangerous criminal might make the town safer; taking its only
  carpenter might speed its decline; a rich merchant might revive trade but bring exploitation.

### Places (Rex, 2026-10-27)

Each place has an id in backticks (`port.<place>`). The same id is reserved as the place's upgrade slot in
`UPGRADES.md`, so the art keeper can key on it now; whether and how each place changes is still open.

| Id | Place | Who is there | Note | Mark |
|---|---|---|---|---|
| `port.docks` | The docks | the shipyard, the repairmen and the market | where you start, on your small boat; Phase 1 builds the dock (`data/pirate-ship/maps/dock.json`, placeholder) | Rex |
| `port.shipyard` | The shipyard (on the docks) | the ENTP mechanic lives here, with a few other shipyard characters; he is the local weapon smith | | Rex |
| `port.market` | The market | vendors | starts at the port and leads into town | Rex |
| `port.tavern` | The tavern / brothel | the bartender (§7b) | | Rex |
| `port.bakery` | The bakery | the ESFP baker | | Rex |
| `port.farm` | The farm | the INTP farmer | | Rex |
| `port.clinic` | A small clinic | the ISFJ doctor | | Rex |
| `port.church` | The church | the ISTJ head priest | | Rex |
| `port.warehouse` | A warehouse | a big wig who owns it and a few vendors; his troublesome son | Rex was unsure ("that requires a big wig to still be in town") | Rex (tentative) |
| `port.apothecary` | The apothecary (herbalist's) | the INTJ herbalist, its owner | the place Rex had forgotten in his first list | Rex |
| `port.fort` | The old coastal fort | the old soldier goes there one day a week | "a great locale, love that idea" | Rex |
| `port.soldier_house` | The old soldier's locked house | the old soldier | you can't get in; you can see him leave once a week toward the fort | Rex |
| | Docks barely maintained; a harbour of fishing boats, damaged sloops and vessels that shouldn't still sail | | look detail | proposed (outside AI, via STORY.md) |
| | A notice board | | each port one small screen: dock, tavern with tables, shop, notice board (§4) | proposed |

### People

About 12 recruitable for the 3–4-berth boat (Rex, §7b), drawn from residents and visitors. Slugs are the story
keeper's (`../story/characters/INDEX.md`); the character itself lives in their doc, this table only says where
they are in town.

| Who | Slug | Where | Resident / visitor | Recruitable | Note | Mark |
|---|---|---|---|---|---|---|
| The ENTP device builder, the local weapon smith | [`entp-m`](../story/characters/entp-m.md) | `port.shipyard` (lives there) | resident (lives at the shipyard) | yes, again and again: he keeps leaving and you find him back in town | key to a town improvement if let go (`UPGRADES.md` `port.entp`) | Rex |
| The ISFJ doctor | [`isfj-f`](../story/characters/isfj-f.md) | `port.clinic` | resident: born in town; her father was the town doctor | yes | does her best to keep the townspeople going; probably a sadistic side: she gets pleasure from healing and from the pain it causes, and secretly enjoys your suffering (how she justifies it: open) | Rex |
| The ISTJ head priest | [`istj-m`](../story/characters/istj-m.md) | `port.church` (lives there) | resident | open | despises where he lives; especially cruel when following the rules, to a robotic degree | Rex |
| The INTP farmer | [`intp-f`](../story/characters/intp-f.md) | `port.farm` (runs it) | resident | open | runs the farm alone since a spouse died (Rex first said "his wife"; whose spouse, open); psychopathic in some capacity; based on April Ludgate (Aubrey Plaza's deadpan secretary to Ron Swanson in Parks and Recreation) | Rex; gender settled as woman by Rex's "she runs the farm" |
| The ESFP baker | [`esfp-m`](../story/characters/esfp-m.md) | `port.bakery` (runs it) | resident | open | jolly, with a dark side: secretly a cannibal | Rex |
| The old soldier | [`estp-m`](../story/characters/estp-m.md) | `port.soldier_house`; goes to `port.fort` one day a week | resident | open | a secret character; an old ESTP, very strong, a killer | Rex |
| The warehouse big wig | `bigwig` (placeholder, outside the 32) | `port.warehouse` (owns it) | resident | open | | Rex (tentative) |
| The big wig's child | `bigwig-child` (placeholder; type open) | `port.warehouse` | resident | yes | extremely troublesome, a real drain on the town; one of the recruitables who needs fixing to help the town; son or daughter open | Rex (tentative) |
| The INTJ herbalist and apothecary owner | [`intj-f`](../story/characters/intj-f.md) | `port.apothecary` (owns it) | open | open | concocts potions, tinctures and such; a bit unconventional; the daughter of the apothecary's previous owner (Rex, 2026-10-27). Her psychotic trait: she has no qualms testing her concoctions on bad people, or people she perceives as evil. Part of her questline is a gamble: you work out, mostly from science and the clues you get, whether what she made will kill the person and whether they deserve it, and navigate her psychopathy to help her recover. Those who don't deserve it can't die; she has to discover naturally whether they are innocent or evil | Rex |
| The bartender | | `port.tavern` | resident | little reason to leave | | Rex (§7b) |
| The blacksmith | | open | resident, has lived there his whole life | no reason to leave; could be kidnapped later | whether he is the ENTP weapon smith or someone else: open | Rex (§7b) |
| The secret cook (an ESTP who looks like your first mate) | [`estp-m`](../story/characters/estp-m.md): the old soldier (Rex, 2026-10-27) | open | open | yes | doesn't seem to know how to cook; the best cook there | Rex |
| First mate candidates (3) | | | open | yes | | Rex (three); who, open |
| Cannoneer candidates (4) | | | open | yes | one sniper-cannoneer is best for cannons alone | Rex (four); who, open |
| Cook candidates (a few, plus the secret one) | | | open | yes | overlapping, clear-cut choices | Rex |
| Navigator, medic, sewer/clothcrafter, fisherman | | | open | yes | numbers not set; the ISFJ doctor may be the medic | Rex |
| Shipyard characters (a few) | | `port.shipyard` | open | open | | Rex |
| Market and warehouse vendors | | `port.market`, `port.warehouse` | open | open | | Rex |
| Low-life pirates passing through | | | visitors | open | | Rex |
| Residents with a reason they haven't moved on (sample reasons in STORY.md) | | | residents | open | | proposed (outside AI) |

### Alignment (Rex, 2026-10-27)

- **(Rex)** Each resident who stays has an alignment that your choices change; that is what alters the town
  (`ENDINGS.md`, The town's alignment). Each character has a clear influence toward a quadrant, a neutral one, or
  an opposing one.
- **(Rex)** 12 people, **3 per quadrant**. Who sits where is open.
- **(Rex)** Four questlines, one per quadrant, all available to take on (2026-10-27: conduct within them
  decides, `ENDINGS.md`, questing model). Each character's responses to them are in their own file and in
  [`../story/QUESTLINES.md`](../story/QUESTLINES.md) (the story keeper's; so far [`istj-m`](../story/characters/istj-m.md) and [`entp-m`](../story/characters/entp-m.md)).

| Quadrant | Residents (3) | Mark |
|---|---|---|
| Orderly good (`og`) | | open |
| Chaotic good (`cg`) | | open |
| Orderly evil (`oe`) | | open |
| Chaotic evil (`ce`) | | open |

### Groups (for reputation)

- **(Rex)** The town keeps a reputation with you, and so does each group inside it (§7b).
- **(Rex)** A town isn't one mind: most can hate a man while a small group liked him (§7b).
- **(open)** Which groups the starting port has, and who belongs to each.
- **(proposed, outside AI, via STORY.md)** Ways residents might split when the port fails: attract wealthier
  pirates, go legitimate, raid ships themselves, or back one ambitious character who seizes the town.

## Decisions log

| Date | Decision | By |
|---|---|---|
| 2026-10-26 | Town keeper set up: this folder; starting port seeded from PIRATE.md §4a/§7b, STORY.md and ART_DIRECTION.md §3a; id `port` | keeper |
| 2026-10-26 | Towns work like Digimon World 1: choices (recruit, let go, kidnap, help…) change certain parts, each part only certain upgrades; you can't max a town; combinations make the endings; text- and town-change based; several routes to good/perfect endings, some secret | Rex |
| 2026-10-26 | First known secret route: letting the ENTP go on his explained departure makes him key to a town improvement that leads to the perfect ending | Rex |
| 2026-10-26 | Story keeper handed over the endings and town-change canon (STORY.md now points here, a031580); outside AI's rival-port cause and crew-vs-town examples recorded as proposed | keeper |
| 2026-10-27 | The starting port's places: docks (shipyard, repairmen, market), market leading into town, tavern/brothel, bakery, farm, clinic, church, warehouse (tentative), old coastal fort, the old soldier's locked house; their residents (ISFJ doctor, ISTJ priest, INTP farmer, ESFP baker, old ESTP soldier, ENTP at the shipyard as weapon smith, the warehouse big wig and his troublesome child) | Rex |
| 2026-10-27 | Linked residents to the story keeper's files (1d35e8c): old soldier = `estp-m`; warehouse placeholders `bigwig`, `bigwig-child` | keeper |
| 2026-10-27 | Added the apothecary (`port.apothecary`) and its owner, the INTJ herbalist who tests potions on people she sees as evil; her questline is a gamble on whether a potion kills and whether they deserve it | Rex |
| 2026-10-27 | The old ESTP soldier is the secret cook; the herbalist is the daughter of the apothecary's previous owner (via the story keeper) | Rex |
| 2026-10-27 | Town alignment replaces game-over abandonment: residents' alignments move the town on good/evil × order/chaos; four quadrant endings plus neutral; 3 residents per quadrant (`ENDINGS.md`) | Rex |
| 2026-10-27 | Questing model: all four questlines open to the player; actions carry alignment points; witnessing crew and staying residents move the town (`ENDINGS.md`) | Rex |
| 2026-10-27 | Neutral ending is a ghost town; residents may move on and, depending on your actions, reappear in the DLC (`ENDINGS.md`) | Rex |
