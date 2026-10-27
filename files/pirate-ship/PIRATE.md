# The pirate ship: spec v0.1 (Rex's idea, 2026-10-25; working title until Rex names it)

A spin-off of High Roller: same principles, same graphics, same systems underneath, but the scope narrowed to one
ship. Not an MMO. A Stardew Valley-style life sim where you romance psychotic pirates; gambling is the main way to
earn money, with an RPG side for combat; and, like Animal Crossing, the crew grows over time and you build a
relationship with each crew mate. They are all hot psychos.

**Where things are (2026-10-26):** the game's repo is `Games/RPG's/pirate-ship/`; the design lives in its
`files/pirate-ship/`: this spec, `DUTIES.md` (daily duties), `STATS.md` (every hidden number), `crew/ROSTER.md`
(the 32), `minigames/FISHING.md`, and the build plan `PLAN.md`. High Roller's docs
that this one names (ART.md, SUITE.md and the rest) stay in `Games/Card Games/high-roller/files/high-roller/`.

Everything below marked **(Rex)** is his. Everything marked **(proposed)** is a starting point for him to keep,
change or throw out.

## 1. Pillars

1. **The ship is the world.** One small, dense, hand-made map you come to know tile by tile. It grows by refits,
   not by more ocean.
2. **The crew is the content.** Every crew mate is a romanceable character with a madness of their own. Talking,
   gifts, gambling with them and fighting beside them are all ways to get closer, or to set them off.
3. **Gambling pays the bills (Rex).** The tables are the economy: dice and cards with the crew below deck and with
   strangers in port. Coins buy refits, gifts, gear and new crew.
4. **Combat is the spice, not the meal (Rex: "there can be an RPG aspect").** Boarding actions and port brawls,
   fought with your crew, where the bonds you built change how they fight.

## 2. What it takes from High Roller

| From High Roller | Used here as |
|---|---|
| The casino lanes (each game its own repo on the lobby contract, signed settlement) | the ship's tables; liar's dice, cee-lo, chuck-a-luck, three-card monte, poker, blackjack already exist |
| The Phaser 4 client: the paper-doll renderer and the HUD (not the isometric world: this game is three-quarter top-down, §3) | the crew and their outfits |
| The art pipeline (ART.md: Blender rig, slot meshes, `tools/render/`, palette, two tones and outline) | every in-world sprite: same style, rendered from the three-quarter camera |
| The living-NPC engine (`living/`: World, Economy, Npc, skills) | crew mates' schedules, moods, skills and wants; a few dozen NPCs, not thousands |
| The server's player record (wallet, items, outfits, reputation) | the save: wallet, inventory, outfits, crew, relationships |
| Suite money rules (SUITE.md) | still hold: never real money; one wallet per game, so this game's coins stay here |

New: the relationship system, dialogue and portraits, the day-and-voyage loop, the ship refits, and the combat.

## 3. Art direction: the combo (Rex asked; recommended)

**Yes, keep High Roller's art style for the world, and add detailed portraits for conversation.** This is the
Stardew and Fire Emblem arrangement: small readable sprites on the map, a large expressive portrait when you talk.
It fits the pipeline because both come from Rex's Blender work.

**Perspective: three-quarter top-down, the Stardew view (Rex, 2026-10-26).** Not High Roller's isometric diamond
grid and not pure top-down. Isometric suits building rooms; this game is boats, and the Stardew angle shows a
boat's inside and outside at once: walking the dock you still see your boat's hull, mast and shape, not just its
deck from above. It also makes fishing's aim and distance read straight out from the dock. The style (palette,
two tones, outline, proportions) stays High Roller's; only the camera and tile grid change (square tiles; walk
cycles facing down, up and side). A pure top-down view may still suit the sailing chart later.

| Layer | What | How it is made | Size |
|---|---|---|---|
| **World sprites** | crew, the player and NPCs walking the decks; outfits as paper-doll slots | exactly ART.md: the shared rig, three-and-a-half-head cartoon proportions, two tones and a 1-px outline, palette-snapped | 64×112 per frame |
| **Conversation portraits** | the crew mate up close, chest up, beside the dialogue box | a **separate bust model per character**, more polygons and adult proportions (the world body's big cartoon head is for legibility at 25 mm; up close it would look childish next to "hot"). Same palette ramps, same two-tone shading and outline, rendered at a larger size, so it reads as the same family | about 512×640 per pose (proposed) |
| **Expressions** | neutral, smile, smirk, flustered, angry, unhinged, hurt, plus one signature face per character | shape keys on the portrait head, rendered as one sheet per character; the client swaps the face per line of dialogue | one sheet per character |
| **Heart-event scenes** | the big relationship moments (a confession, a duel, a betrayal) | a full illustration. Rendered from the portrait models in a posed scene, then overpainted in Aseprite or Krita | screen-sized, a few per character |

Why separate bust models rather than zooming the world sprite: at 64 px the face is 14×12 pixels. That is
right for walking around, but it can't carry "hot" or "psycho" up close. A bust model built to the same
character sheet (same hair, same scars, same outfit colours) keeps them recognisable between the two views.

Proposed render settings for portraits: the same Workbench two-tone setup as ART.md §6, a closer orthographic
camera framed on the chest, anti-aliasing off, palette snap on, a 2-px outline at this size. One `.blend` per
character under `art/portraits/<id>.blend` with shape keys named for the expressions.

## 4. The ship (the map)

**(proposed)** One ship, three decks, about 40×16 tiles in all, every space with a job:

| Deck | Spaces | What happens there |
|---|---|---|
| Top deck | helm, mast and crow's nest, cannons, the plank | sailing choices, lookout events, combat, punishments |
| Middle deck | galley, mess table, captain's cabin (yours), surgeon's corner | cooking and eating (buffs, as in High Roller), conversations, the bed (day ends) |
| Below deck | **the gambling den**, crew hammocks, the brig, cargo hold | the tables; crew private moments; locking up a crew mate who went too far |

**Refits (the Animal Crossing growth):** coins buy upgrades that open new spaces (a bigger den with more tables,
private cabins for romanced crew, a better brig, more cannons). Each refit is a visible change to the map.

**Ports:** the ship docks at ports between voyages. A port is one small screen (a dock, a tavern with tables, a
shop, a notice board for jobs and bounties), not an open world. New crew are found in ports.

## 4a. Progression: from a dinghy to a ship (Rex, 2026-10-26)

Start as small as possible, like Luffy on his tiny boat: **just you on a small boat** at the starting port. Do
minigames, find ways to make money, and buy a bigger vessel. **Tiers (Rex, slowed down 2026-10-26):** you alone →
a slightly larger boat that houses 3 (a 4th can sleep on deck) → a ship of 12–16 crew → 32–40 → and so on. Each new crew mate's relationships layer on top of the ones you already have,
so the web grows with the crew instead of being devised all at once. (This replaces the "one ship from the start,
crew of 10–12" assumption in §4 and §7.)

- **The starting port is always the same** (the game's Pelican Town). It has some recruits, but not the full
  picture. A bigger boat lets you reach other ports nearby and trade.
- **Hiring is in §7b.**

## 5. The day and the voyage (the Stardew loop)

**The morning (Rex, 2026-10-26).** You wake up and choose what to do, the way Stardew's morning is a choice:
water the crops (or not, if it rained, or if a sprinkler does it), then the mines, town, foraging or fishing. Here
the central plot of the early game is **tending the ship**: morning maintenance, each duty its own minigame, or
talking to crew mates instead. What you choose to do raises your skill in that area and can unlock more things.
Some days open with an event: you wake up and the sail has a rip. The ship's speed is worked out every day (§5a),
so a torn sail slows it a little; leave it and the next day it may be worse. Fixing it takes cloth, which you may
or may not have. Every daily duty has a minigame (Rex designs them later); the duties are logged in `DUTIES.md`,
checked so it really feels like a pirate ship.

**Scope (Rex):** the first builds are the ship and the crew only, since they are the core; sailing on a map,
ports and time at sea come later, piece by piece. Combat is not decided (RPG or RuneScape-like, never action).

**(proposed)**

- **A day** runs from dawn to night: chores (the crew asks for help), talks, gambling sessions in the den, a sailing
  choice at the helm, maybe an event (a storm, a sail on the horizon, a fight between crew mates). Sleep ends it
  and saves.
- **A voyage** is a run of days at sea between two ports (about 5–7 days). The voyage is the "season": weather,
  events and which crew moods come up change with it.
- **In port**: the tavern tables pay better and risk more (strangers cheat), shops and the notice board open, and
  a new crew mate may be waiting.

## 5a. The ship's condition (Rex's sail example, 2026-10-26; the rest proposed)

The ship is a set of meters that the morning duties keep up, and that decay when nobody does. Each part below is
something a real ship of the period had to tend daily; `DUTIES.md` lists the duty, the supply and the minigame
slot for each.

| Part | What wears it down | What it does to the day | Fixed with |
|---|---|---|---|
| Sails and rigging | wind, storms, shot | **speed** (Rex): a tear slows the ship and grows if left | cloth (sail canvas), rope, twine |
| Hull | rot, shot, worm, a slow leak | water in the hold; past a line, the pumps take the whole crew | oakum, pitch, planks |
| Hull bottom (fouling) | barnacles and weed, week by week | speed again, slowly | careening on a beach (a port-era job) |
| Stores | spoilage, rats, the crew eating | food and water for the voyage; hunger hits mood | fish, rations, port supplies |
| Rum and grog | the crew drinking | mood; too much, accidents | port supplies, brewing |
| Powder and guns | damp, rust | combat readiness | dry storage, cleaning |
| Health | injury, scurvy, fever, filth | crew able to work; the surgeon's job | the surgeon, food, cleaning |
| Cleanliness | days unswabbed, rats | sickness, rats in the stores | swabbing, rat catching |

**Daily speed (proposed shape):** today's wind × sails and rigging × hull fouling × how the cargo is stowed. Wind
comes with the weather; the rest is the crew's work. Speed matters once the sailing map exists (days to port);
before that it is still shown each morning.

**Leaving it is a choice:** a fault grows a step each day it's ignored (a small tear becomes a split sail), so
the morning is a real trade between fixing, earning (fishing, the den) and the crew.

## 6. Money: gambling (Rex)

- **The den** below deck: play the crew. Stakes are small and every hand also moves the relationship with whoever
  you played (winning big off a proud one stings; letting a broke one win earns gratitude).
- **Port taverns:** play strangers for bigger pots. This is where the real money is.
- **Cheating** (proposed): some games allow a cheat minigame (a loaded die, a palmed card); getting caught by a
  stranger starts a brawl, getting caught by a crew mate hurts the relationship or sets off their madness.
- Games come from the casino lanes. Pirate fits already built: **liar's dice**, cee-lo, chuck-a-luck, hazard,
  three-card monte, poker, blackjack. A sourced sailors' game worth adding as a new lane: **crown and anchor**.
- Side income is small: bounties from the notice board, plunder from combat, selling cargo.

## 7. The crew (Animal Crossing meets Stardew)

**Recruiting (proposed):** start with a small crew of three or four. A new crew mate can join at each port, earned
by an event (win them at dice, spring them from jail, survive a duel with them). Over a full game the crew grows to
about 10–12. Each takes a berth and a role.

**Relationships (proposed, Stardew-shaped):**

- A heart meter per crew mate (0–10), raised by talking once a day, gifts they like, gambling with them, fighting
  beside them and choosing their side in arguments; lowered by the opposite.
- **Heart events** at set levels: scenes with a portrait, choices and often a heart-event illustration.
- **Romance:** past a set level, a crew mate can be courted; at the top, they move into a private cabin (a refit)
  as your partner.
- **The psycho twist:** every crew mate has a **madness** with its own meter. Things they hate push it up; past a
  line they act on it (a jealous one sabotages a rival, a violent one starts a fight, a paranoid one hides your
  coins). Keeping them close means managing both meters. Jealousy between romanced crew is part of the design.
- **Loyalty and mutiny:** the crew's average mood is the ship's loyalty. Low loyalty means mutiny events.

**The living-NPC engine** runs each crew mate as a row: position, mood, madness, hearts per character, wants, skill
bytes, today's schedule. A crew mate goes about their day (their post, meals, the den, sleep) whether or not you
are watching, as High Roller's NPCs do.

**The roster (Rex, 2026-10-26):** 32 crew mates, a man and a woman for each of the 16 types, each the killer
version of their type fused with a pirate archetype. Draft in `crew/ROSTER.md`; it replaces the placeholder table
below once Rex signs off.

**Roster slots (proposed placeholders; Rex writes the characters):** one per ship role, so the crew is also the
combat party.

| Role | Ship job | Combat role |
|---|---|---|
| Quartermaster | keeps the books, splits the plunder | leader, buffs |
| Gunner | the cannons | ranged, area damage |
| Navigator | the helm, the charts | speed, avoiding fights |
| Surgeon | heals | healer |
| Cook | the galley | food buffs |
| Bosun | discipline, the brig | tank |
| Boarder | first over the rail | melee damage |
| Lookout | the crow's nest | scouting, first strike |
| Card sharp | runs the den | cheats, steals |
| Powder monkey | errands, the magazine | explosives |

## 7a. The crew as a society (from a brainstorm with an outside AI; Rex: "I like the concept and gameplay loops", 2026-10-26)

A Baldur's Gate-style game in the sense Rex means: who you give things to, who you spend time with and what you
say to whom changes how the game plays out. Beyond Baldur's Gate, the crew make choices about each other without
you.

- **A relationship web, not one meter per crew mate:** every crew mate has a relationship with every other one
  (affection, rivalry, distrust), not only with you.
- **Affection and respect are separate:** a pirate can love you and think you weak, or hate you and respect you,
  or fear you and obey you while plotting.
- **Each crew mate reads the same act differently**, by personality (the matrix): you gamble all evening with
  one, and another sees harmless fun, another a romance, another leverage, another a threat to their place.
- **Gambling is political:** debts. A crew mate who loses to you owes you; collect (respect, resentment),
  forgive (affection, less respect) or take a favour for later. Debts chain between crew mates.
- **Gifts move the balance of the ship**, not just one heart: the same necklace given to three people gives three
  different ships.
- **Things happen without you:** two crew mates start a romance, an alliance or a mutiny plot; you find out from
  overheard talk, gossip, behaviour, or not at all. A romance may turn out to be manipulation.
- **Story by conditions:** big storylines (a mutiny, say) open when the state allows them (enough resentment, a
  replacement, a chance of winning), not as scripted branches.
- **Dating doesn't fix them:** getting closer to a possessive crew mate can cause trouble with everyone else.
- **Built from data, not live AI:** the matrix gives each crew mate a profile (speech patterns, decisions),
  wants, relationships, memory of key moments, and tendencies (how they gamble, work, argue, flirt, take orders).
  Three layers in the engine: character state, how each one interprets an event, and the consequences.

## 7b. Hiring (Rex, 2026-10-26)

- Each port has a pool of potential crew (the starting port about 12, as an example). You can come back for them.
- Each has a speciality they're good at, **or claim** to be. Stats exist but are **secret** (the Digimon World 1
  feel): the player isn't given numbers to pick from and infers them from conversation, with the character or
  with others ("oh yeah, Jimmie fixed up James's broken leg last year, real swell of him"). The secret list:
  `STATS.md` (attributes, skills and personality sliders; attributes and personality multiply skill growth).
- Realism: you can't get a trained doctor with no training, but people did lie about expertise. Hiring someone
  for a job and watching them fail is a mechanic.
- A crew mate can hold more than one post, like Usopp as sniper and the Merry's carpenter until Franky joins.
- **The first level (what gets designed first):** the starting port, a small town with about 12 people to hire
  for the 3–4-berth boat. One of each core job, some doubles of the common ones, and some cool-seeming jobs that
  don't fit the boat unless paired with something else (they sacrifice something).
  - **First mate:** a choice between three.
  - **Cannoneer (the sniper/mechanic slot):** four options. Mainly the cannons, with each one's secondary job
    deciding their cannon skill; one sniper-cannoneer is the best pick for cannons alone, the others bring more
    elsewhere.
  - **Cook:** a few overlapping options with clear-cut choices, plus one secret: someone who doesn't seem to know
    how to cook but is the best cook there. Rex's idea: an ESTP who very clearly looks like your first mate.
  - **Others:** navigator, medic, sewer/clothcrafter, fisherman (numbers not set).

**Dialogue is Morrowind-style keywords (Rex, 2026-10-26).** You say a keyword; that person may have something to
say on it, or not, or may not trust you enough to say anything. You learn about people through the town's
ecosystem: what others say about them. (This settles the ask-or-offer question: you ask by keyword, a post's name
among them.)

**Three ways to recruit (Rex):**

1. **Hire them for a job:** "I have a place to stay and potential money if you help out." The person has to trust
   you enough to take it, so with low reputation you can only hire people who'd believe a low-rep captain. The
   first town is a run-down port full of dark characters, so low rep is common there.
2. **Mercenaries:** pay someone to join your boat. A mercenary can later be converted to hired crew, harder for
   some than others, and some are fickle and leave without a word.
3. **Kidnapping:** each town keeps a reputation with you. Kidnap someone they like and they're upset; someone
   they dislike and they're happy. A town isn't one mind: if most hate a man but a small group liked him,
   kidnapping him locks you out of dialogue with that group.

**The requirement (applies to hiring and mercenaries):** some people don't trust or believe you, so they won't
join until you reach a certain level, show something, give them something or finish a questline.

**Any crew mate can leave (Rex).** Each has a specific thing (feeling disrespected, left out, and so on) that, if
it happens often enough, makes them tired of it and they walk. There are clues: some obvious, some subtle, some
only visible when it's too late.

**A town is an ecosystem, not a hiring board (Rex).** The town has more people than the recruit pool. Residents
like the blacksmith who has lived there his whole life have no reason to leave (though he could be kidnapped
later); the bartender has little reason; others do. So a town is built as a real place, residents plus visitors
and people looking for work, and the pool is drawn from both groups. First town: a run-down port with about 12
recruitable. Rex designs its members next, then fills in the extras.

## 8. Combat: the RPG side (Rex)

**(proposed)** Turn-based tactics on the same square tiles: boarding fights on a ship's deck, brawls in a
tavern. The player and three or four chosen crew mates against the enemy crew. Crew skill (from the NPC engine)
sets their numbers. **Bonds matter**: two crew mates with high hearts toward each other, or toward you, get combo
moves; a crew mate whose madness is high may go berserk (strong, uncontrollable). Plunder and bounties are the
reward. Fights are opt-in where possible: a good navigator can outrun one, a good card sharp can talk one down.

## 9. Platform and business

**(proposed)** Browser and iOS like High Roller, single player, saves on the server so a save follows the
account. One-time purchase or free with an early chapter, never ads during play; never real money inside the game
(suite rule). Age: 17+ like High Roller (simulated gambling, violence, romance).

## 10. Tech

- A new repo stamped from `_template` like High Roller, on the lobby contract. The client reuses High
  Roller's `doll` and `hud`; the world (three-quarter top-down, square tiles) is new, not a fork of the
  isometric `web/src/world`; the server is a fork of High Roller's player record.
- New modules: dialogue (Morrowind-style keywords, §7b; lines as data: speaker, keyword, expression, text,
  choices, conditions such as trust and town reputation, effects on hearts and madness; topics learned from one
  person can be asked of another), reputation (per town, per group within a town), relationships (hearts, madness, flags per crew mate), events (heart events and ship events as data),
  combat (rules and abilities as data, an engine like the casino games'), refits (ship map variants as data).
- Everything a writer touches is data: a crew mate is one JSON file (bio, likes, dislikes, madness triggers,
  schedule, portrait sheet, heart events), so adding a character never needs code.
- The tables are embedded from the existing lanes exactly as High Roller does (frame, per-game token, signed
  settlement into this game's own wallet).

## 11. Build order (proposed)

0. **The lone pirate (Rex, 2026-10-26: start as small as possible):** one small boat, the dock, one NPC; fish,
   sell fish, one gambling game against the NPC; money, time and one relationship value; save and load. Then buy
   a bigger boat and recruit the first crew mate.
1. **The ship and one crew mate:** the map, walking, one crew mate with a portrait, dialogue, hearts, one heart
   event. Proves the art combo and the dialogue system.
2. **The den:** liar's dice with the crew, settlement into the wallet, relationship effects from a hand.
3. **Days and a voyage:** the loop, sleep and save, schedules from the NPC engine, a port screen.
4. **Recruiting and refits:** a second and third crew mate, the first refit.
5. **Madness:** the second meter, triggers, jealousy.
6. **Combat:** one boarding fight.
7. Then content: more crew, ports, events, tables.

## 12. Decisions that shape the build

These need Rex before the belt starts; everything else in this doc can be built as proposed and changed later.

1. The game's name.
2. Art: keep the combo in §3 (world sprites + separate bust portraits), or a different split.
3. Combat: RPG (turn-based, §8) or RuneScape-like. Not an action game (Rex, 2026-10-26).
4. Business: one-time purchase, a free first chapter, or ads like Tables.
5. The player: the captain (as this doc assumes, "captain's cabin (yours)"), or a crew mate who rises.

## Appendix A. Gambling games for the ship (2026-10-25)

Period games sailors and pirates actually played (17th–18th century, the Golden Age of Piracy), then the rest of
the casino lanes that fit. Lore hook, from history: many pirate articles banned gambling for money on board
(Bartholomew Roberts' articles: no gaming at cards or dice for money), so the den is contraband.

| Game | Why it fits | Repo |
|---|---|---|
| Liar's dice | the pirate dice game in the popular imagination | built |
| Hazard | the dice game of the 1600s–1700s, ancestor of craps | built |
| Crown and anchor | the sailors' dice game of the Royal Navy and merchant ships | **new lane** |
| Backgammon ("tables") | carried aboard by sailors and officers | built |
| Cribbage | the classic sailors' card game | built |
| Brag | 18th-century English bluffing game, ancestor of poker | built |
| Basset, faro | the high-stakes card banks of the period, for port taverns | built |
| All fours | 17th-century English sailors' and soldiers' card game | **new lane** |
| Lansquenet | soldiers' and mercenaries' card bank of the 1600s | **new lane** |
| Mora | finger-guessing, played by Mediterranean sailors | **new lane** |
| Knucklebones | bones thrown for luck, the oldest dice | **new lane** |
| Dominoes | sailors spread it through ports in the 1700s | built (fives) |
| Nine men's morris | boards were carved into ship timbers and benches | built |
| Chuck-a-luck, under-over-7, three-card monte, cee-lo | later, but they fit a lawless den | built |
| Poker, blackjack, whist, acey-deucey | port tavern staples (later era; fine for a fantasy ship) | built |
| Ship, Captain and Crew | a 20th-century bar game, but the name is a gift | built |
| Pitching pennies (coins against the mast) | the cheapest bet below deck | built |

Wagers on contests (the crew bets, you compete): arm wrestling, knife throwing, drinking contests, races up the
rigging. Each is one of the task minigames in Appendix B with a betting layer on top.

## Appendix B. What a pirate does on a ship, and a minigame for each (2026-10-25)

Every task a crew member did, from sailing to sinning, each paired with a minigame and an older game it could be
scaffolded on. For Rex's minigame design (minigames are his, 2026-10-24); nothing here is queued. Prior art to
know about: *Puzzle Pirates* (Three Rings, 2003) built a whole game on duty puzzles (sailing, bilging, carpentry,
gunnery, navigation, rigging, swordfighting); our minigames must be our own designs, not copies of its puzzles.

**Sailing the ship**

| Task | Minigame | Scaffold |
|---|---|---|
| Hauling lines, setting sail | pull in rhythm with the call; too early or late slips | rhythm game |
| Weighing anchor at the capstan | crew pushes in time to a shanty; the player keeps the beat | rhythm game, Simon |
| Steering at the helm | hold the course against wind and waves | balance game, endless runner |
| Climbing the rigging, reefing sail | climb and grab, avoid falling in a storm | platform climber |
| Navigation (charts, dead reckoning, backstaff) | plot the course from speed, heading and time; land on the island | route puzzle, nonogram |
| Heaving the log (measuring speed) | count knots on the line as the sandglass runs | timing game |
| Sounding (lead line for depth) | read the depth and the sea bed, avoid running aground | Battleship, Minesweeper |
| Standing watch, keeping the bells | stay awake: catch the bell times and spot what moves | memory, timing |
| Lookout in the crow's nest | spot sails, reefs and whales on the horizon | spot the difference, hidden object |
| Signal flags | read and send flag messages | memory, Simon |

**Keeping the ship alive**

| Task | Minigame | Scaffold |
|---|---|---|
| Pumping the bilge | keep the water down as it pours in | match-three, Tetris-style falling block (our own) |
| Patching the hull (carpentry) | fit planks into the breach before it floods | tangram, jigsaw |
| Caulking (oakum and pitch in the seams) | trace and fill every seam | line tracing |
| Mending sails | sew the tear along the line | line tracing, stitching |
| Rope work, splicing, knots | tie the right knot, untangle the lines | untangle (Planarity), knot puzzle |
| Swabbing and holystoning the deck | scrub every plank clean in time | cleaning, whack-a-mole |
| Careening (scraping the hull on a beach) | scrape barnacles off without gouging | scratch-off |
| Rat catching in the hold | catch rats before they reach the stores | whack-a-mole |
| Stowing cargo | pack the hold so nothing shifts | box packing |

**Feeding and keeping the crew**

| Task | Minigame | Scaffold |
|---|---|---|
| Cooking in the galley | prepare dishes in order before they burn; buffs | Cooking Mama, Overcooked |
| Fishing | land the fish on the line | Stardew-style fishing bar |
| Rationing water and grog | stretch the stores to the next port | resource puzzle |
| Surgery (the ship's surgeon) | stitch, splint and pull shot without slips | Operation |
| Tattooing a crew mate | trace the design steadily | line tracing |
| Playing the fiddle, singing shanties | keep the crew's spirits up | rhythm game |

**Fighting**

| Task | Minigame | Scaffold |
|---|---|---|
| Gunnery (load, aim, fire the cannons) | load in order, then aim for the arc and the roll of the ship | artillery (Scorched Earth) |
| Powder monkey (running powder to the guns) | run the decks without spilling or exploding | Frogger, delivery dash |
| Musket fire | aim between the ship's rolls | shooting gallery |
| Throwing grappling hooks, swinging over | time the throw and the swing | timing |
| Swordfighting | read the attack, parry and riposte | rhythm parry, rock-paper-scissors |
| Keeping the brig, keelhauling (punishment) | hold the line on a restless prisoner | tug of war, balance |

**Business and loot**

| Task | Minigame | Scaffold |
|---|---|---|
| Dividing the plunder (quartermaster's shares) | split the loot by the articles so nobody mutinies | fair-division puzzle |
| Keeping the books and the log | balance the ledger | sums puzzle |
| Haggling in port | buy low, sell high against a trader | higher-or-lower, negotiation |
| Reading a treasure map | match the map's landmarks to the island | pattern matching |
| Digging up treasure | find the chest by the clues | Minesweeper, hot and cold |
| Burying treasure | hide it so rivals can't find it | reverse of the above |
| Recruiting in a tavern | win them over: dice, a dare, a drinking contest | any table game |

**Contests the crew bets on** (Appendix A)

| Contest | Minigame | Scaffold |
|---|---|---|
| Arm wrestling | button mash with a stamina bar | tug of war |
| Knife throwing | aim and release on the target | timing |
| Drinking contest | keep your balance as the room spins | balance game |
| Race up the rigging | first to the top | platform climber |
