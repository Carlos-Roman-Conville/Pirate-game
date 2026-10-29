# Combat (Rex's design; combat keeper, opened 2026-10-29)

The RPG side of the pirate ship. Marks: **(Rex, date)** his own words or decisions; **(proposed)** a starting
point for him to keep, change or throw out (**outside AI** = ChatGPT, pasted by Rex); **(open)** not decided.
Nothing is canon unless marked Rex. Combat touches other lanes: story `story/`, town `town/`, art `art/`, balance
`balance/`; this file doesn't edit theirs and says where it reaches into one.

**In one line (Rex, 2026-10-29):** "Fights are essentially duels. Whoever has higher kill skill and speed and
position wins the match."

**References (Rex, 2026-10-29):** XCOM 2 for the turn frame, cover, flanking and the prepared shot (Overwatch);
Phoenix Point for body-part damage and free aim at a part; Baldur's Gate 3 for the seamless map, elevation and
the range of options; Dark Souls for progression by skill; Monster Hunter for preparation; Oregon Trail for
travel; Suikoden for the two scales (2026-10-28). Older cousins: Fallout 1/2 (crippled limbs), Jagged Alliance,
Battle Brothers (lasting injuries).

## 1. Shape of the game's combat

- **(Rex, 2026-10-26)** Not an action game.
- **(Rex, 2026-10-28)** Turn-based RPG, **4 units on your side**; the enemy's count open. Converts to a
  **turn-based tactical RPG** for invasions and large battles (Suikoden's two scales): ship warfare at the large
  scale, RPG combat once ships are close. The 108 recruits are for the large scale later.
- **(Rex, 2026-10-29)** Grid-based, Baldur's Gate feel: a wide variety of options, and deadly.
- **(Rex, 2026-10-29)** **One map.** The map you walk on and the combat map are the same; walking into combat is
  seamless, as in BG3. (`PIRATE.md` §8 and §10 had proposed the same square tiles; the tile shape itself: open.)
- **(Rex, 2026-10-26)** Combat is the spice, not the meal; gambling pays the bills (`PIRATE.md` §1).
- **(Rex, 2026-10-28)** Where fights come from: the town attacked at ~15–25% of the story; an attack at sea stops
  the voyage dots and starts a battle; later, the siege and the Act II campaign (`balance/ALIGNMENT.md` §10).
- **(proposed)** Boarding fights on deck, brawls in a tavern, the player and three chosen crew (`PIRATE.md` §8).
- **(proposed, outside AI)** Combat starting does not reveal every enemy; the undetected stay hidden until seen or
  until they move (§6). A fight against two can become a fight against six.

## 2. Turns and reactions

- **(Rex, 2026-10-29)** Likes the reaction: a target that moves into a **prepared shot** gets hit before finishing
  the move. Position then matters on the enemy's turn too, and speed decides whether the mover beats the shot.
- **(proposed, outside AI)** Individual-initiative turns first (speed sets the order), with **reactions, counters,
  interrupts and defensive stances** giving the duel feel; simultaneous planned actions only as a later
  experiment. ChatGPT's reasoning: cheaper to build and judge.
- **(open)** Rex hasn't said the structure is settled. Also open: how many actions a turn (move + act? action
  points?), and whether a prepared shot costs the whole turn as in XCOM.
- **(keeper)** Reactions make the enemy AI read lanes, not just targets; the engine task should know that.

## 3. Resolving an attack

- **(Rex, 2026-10-29)** Each attack has a percentage chance to hit, and within that a chance of hitting any body
  part. What it hits determines the damage and how the target can retaliate.
- **(Rex, 2026-10-29)** Damage varies by weapon type and the attacker's stats: a sword with high Swordsmanship
  hits weak points more often.
- **(Rex, 2026-10-29)** A bullet is a critical wound, not a sliver of HP; a head shot can kill.
- **(Rex, 2026-10-29)** Tactics are the focus: cover, flanking, back attacks, real-world battle strategies.
  Elevation gives an accuracy advantage as well as a visual one.
- **(proposed, outside AI)** The five variables of the contest: weapon skill (accuracy, technique, weak points),
  speed (initiative, reaction, evasion), position (flank, elevation, distance, facing), equipment (reach,
  protection, penetration, damage), condition (injuries, fatigue, bleeding). None alone wins.
- **(proposed, outside AI)** Targeting: normal attacks pick the part by odds; skilled characters unlock
  **called shots** (aim at a part at an accuracy penalty), as Phoenix Point's free aim.
- **(proposed, outside AI)** Elevation's two effects kept apart: seeing further and over cover; better firing
  angles and less enemy cover. Seeing a target never means being able to hit it.
- **(open)** Hit-location odds per part by stance, cover, direction and weapon; what "weak points" are in data.

## 4. The body: regional damage and wounds

- **(Rex, 2026-10-29)** The body has parts; a hit to a part changes what the character can do. Hit the shooting
  arm and accuracy goes way down.
- **(Rex, 2026-10-29)** HP increases, but only moderately.
- **(proposed, outside AI)** Parts and consequences:

| Part | What a wound does |
|---|---|
| Head | potentially fatal; concussion, impaired awareness |
| Torso | organs; bleeding; stamina loss |
| Arms | accuracy, weapon handling, blocking; a two-handed weapon may be dropped |
| Legs | movement, evasion, balance; a charge stalls in the open |

- **(proposed, outside AI)** The wound ladder: **wounded** (fights on with penalties) → **incapacitated** (out;
  survives with treatment) → **dying** (needs urgent intervention) → **dead** (permanent, where the game's rules
  permit). Surgery, Apothecary and Physic act on it directly. Regional damage is the main measure; HP a secondary
  survival measure.
- **(proposed, outside AI)** HP derived from Constitution and Endurance (`STATS.md` attributes), not from a level.
- **(keeper)** `STATS.md` §4 already says a lost eye halves Eyesight and a peg leg takes Agility: lasting wounds
  are already in the stat design; combat would be where they come from.
- **(open)** Whether the player's crew can die in a fight, or only NPCs and enemies. This touches the town's fate
  rule (alive / dead / ghost, `balance/BALANCE.md` item 4): the balance and town keepers' once Rex decides.
- **(open)** Bleeding, fatigue and stamina as turn-by-turn conditions.

## 5. Progression: skill, not levels

- **(Rex, 2026-10-29)** "The Dark Souls of RPGs": levelling does nothing, only skill gets you forward. "Maybe
  combat levels shouldn't even be a thing?" Yet you should still feel stronger the more you progress. Dark Souls'
  own levelling is a clue but "just results in more damage".
- **(Rex, 2026-10-29)** Natural barriers: no grinding and coming back to a side quest that's ready. Region quests
  start with a level range in mind so moving forward is difficult.
- **(proposed, outside AI)** No overall combat level. The combat skills `STATS.md` §4 lists (Swordplay,
  Marksmanship, Brawling, Gunnery) grow through use on Rex's five bands from `economy/GOODS.md` (Novice 0–24,
  Apprentice 25–49, Journeyman 50–74, Expert 75–99, Master 100). Skill decides capability, equipment decides
  protection, decisions decide survival; a master swordsman still dies to a musket ball.
- **(proposed, outside AI)** What skill improves: stamina cost, recovery after an attack, accuracy, parry window,
  techniques available, handling of heavy weapons; damage only modestly.
- **(proposed, outside AI)** Bands unlock options (Novice strikes, blocks, movement; Apprentice riposte, thrust,
  feints; Journeyman disarms, counters; Expert precise targeting, faster recovery, combinations; Master full
  technique selection); a technique can still need a teacher or manual, like the recipes in `economy/GOODS.md`.
- **(proposed, outside AI)** Regions carry a recommended proficiency range and preparation needs, not hard gates:
  starting islands Novice–Apprentice; pirate waters Apprentice–Journeyman; imperial strongholds
  Journeyman–Expert; supernatural territories Expert–Master; faction strongholds Master. Some places gated by
  knowledge, ships, politics or story instead. (The gates themselves are the balance keeper's `gates.json`.)
- **(proposed, outside AI)** Encounters as problems with different primary solutions: a pirate captain
  (execution), a ghost captain immune to plain steel (preparation and knowledge), an imperial fortress (strategy
  and logistics).
- **(open)** Levels: yes or no. If no, what HP grows with (ChatGPT: Constitution and Endurance).

## 6. Seeing: detection on the one map

- **(Rex, 2026-10-29)** Two things are at play: the map and the NPC. The map has **elevation**; being higher gives
  a visual advantage. Each NPC has a **view-point distance** attached to a stat, probably Vision. Vision is
  affected by **light** and by elevation: above a certain point you can't see, the same for light. Rex asked
  whether those two factors should be two different stats.
- **(Rex, 2026-10-29)** **Pattern seeking.** A motionless enemy in a hiding position can be looked at directly and
  not seen, if you're colour-blind or bad at seeing still, camouflaged targets.
- **(proposed, outside AI)** Elevation and light are **map properties**, not stats; they modify the NPC's sight.
  Per tile: elevation, light, cover (obstruction), concealment (hard to notice). Per NPC: sight stat, facing.
  Calculated: visibility, line of sight.
- **(proposed, outside AI)** Three detection stats: **Vision** (how far, how clearly), **Perception** (noticing
  movement, sound, suspicious activity), **Pattern Recognition** (telling a shape from its surroundings). A
  lookout: high Vision, middling Perception; a scout the reverse. Colour-blindness penalises only colour-based
  camouflage.
- **(proposed, outside AI)** Detection range = base Vision × light modifier × environment modifier; detected =
  line of sight ∧ in range ∧ Perception check. For an 8-tile Vision: day 8, elevated 10, dusk 5, night 2, night
  with a torch nearby 5.
- **(proposed, outside AI)** Camouflage computed from clothing, posture, terrain and preparation, not a levelled
  skill; Stealth (moving unnoticed) separate from camouflage (blending while still). Hearing as the next sense.
- **(proposed, outside AI)** One authoritative world state (positions, elevation, light, obstacles, detection) for
  walking and fighting alike; walking continuous with a grid overlaid at combat, or always on cells.
- **(proposed, outside AI)** Keep `STATS.md`'s Eyesight and Hearing as they are (Vision = Eyesight); add Pattern
  Recognition as a new attribute. Perception not placed.
- **(keeper)** The same detection would serve the lookout duty (`DUTIES.md`), the sea (sails on the horizon) and
  fishing's reading-the-water stage, so this is a world system, not a combat-only one.
- **(open)** Is Vision Eyesight? Perception: new attribute, or under Wits? Light and elevation: stats or map
  properties (Rex's question; ChatGPT: map)?

## 7. Preparation and travel

- **(Rex, 2026-10-29)** Emphasis on preparation before a fight, like Monster Hunter. Travel by boat already
  carries it: like Oregon Trail, you travel a distance, need provisions, and things at sea cause events.
- **(proposed, outside AI)** The voyage: pick destination and route; prepare the ship (hull, sails, guns, cargo);
  prepare the crew (skills, health, morale, posts); load supplies (food, water, medicine, ammunition); gather
  intelligence (weather, threats, routes, rumours); days pass; safe passage, encounter or crisis; arrive, retreat,
  divert or suffer. Provisions are real goods from the economy sim.
- **(proposed, outside AI)** Three layers that never replace one another: execution, preparation, knowledge.
- **(keeper)** Travel and provisions are the economy docs' and the balance keeper's; here only as combat's
  preparation layer. What a fight consumes (powder, shot, medicine) is the join.

## 8. Locales as puzzles (Rex, 2026-10-29; not combat's to own)

- **(Rex)** 4–5 recruitable characters per locale make each location a puzzle: you know they're there and must do
  something to earn them. Enough depth per town and that is the core loop; skills and the rest lock characters
  out until certain beats.
- **(proposed, outside AI)** Each recruit a different test (a duel, a blueprint, a crossing, an infiltration, a
  cure); explore → discover → prepare → overcome → recruit → expand → explore.
- **(keeper)** Story and town keepers' (`story/`, `town/`), gating in balance's `gates.json`. Combat is one of the
  tests.

## Open for Rex

1. Combat levels: yes or no; if no, what HP grows with.
2. Turn structure: settle on initiative turns with reactions, or keep simultaneous on the table.
3. Actions per turn; what a prepared shot costs.
4. Targeting: automatic parts, called shots, or both.
5. Death for the player's crew: the wound ladder, or permanent death, or never.
6. Vision = Eyesight? Perception and Pattern Recognition as new attributes?
7. Light and elevation as map properties (ChatGPT) or stats.
8. Grid shape (square proposed) and the enemy's unit count; how 4-a-side converts to the tactical scale.
9. Who owns combat balance (encounter difficulty, unit numbers): `balance/BALANCE.md` item 14 says not balance.
10. Hearing as a detection sense.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; prior combat decisions and proposals gathered from the other docs | keeper |
| 2026-10-29 | Rex's walkthrough (via ChatGPT): fights as duels of skill, speed and position; grid-based, deadly, regional damage; skill not levels; Monster Hunter prep; Vision shaped by light and elevation; pattern seeking; one seamless map; Oregon Trail travel; locales as puzzles | Rex (recorded) |
| 2026-10-29 | ChatGPT's recommendations on the open items added as proposed; reactions as the duel feel under turns | keeper (outside AI) |
| 2026-10-29 | Rex likes the prepared shot; references set (XCOM 2, Phoenix Point, BG3); record confirmed and reshaped into design sections for refining | Rex |
