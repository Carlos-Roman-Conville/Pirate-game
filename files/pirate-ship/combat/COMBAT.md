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
- **(Rex, 2026-10-28)** Turn-based RPG. Converts to a **turn-based tactical RPG** for invasions and large battles
  (Suikoden's two scales): ship warfare at the large scale, RPG combat once ships are close. The 108 recruits are
  for the large scale later.
- **(Rex, 2026-10-29)** The **4-unit limit is dropped for now**; a team limit comes later. It could be something
  you unlock: more units as you raise something (what, arbitrary for now: open). The enemy's count stays open.
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

### 4a. The body's own stats: per limb (Rex, 2026-10-29)

- **(Rex, 2026-10-29)** **Physical attributes are per limb.** The limbs are responsible for the actions they
  perform: a right arm and a left arm each with their own Strength, Dexterity and Reflexes; each leg its own, and
  the legs together decide how many tiles a character moves in a turn. A character can have a strong right arm
  and a weak left; a wounded leg changes how they move. This is what makes regional damage (§4) bite: a hit to a
  part lowers that part's stats.
- **(Rex, 2026-10-29)** Agrees with ChatGPT's structure of **three stat sets** that stay distinct:
  1. the **physical body** (per-limb Strength, Dexterity, Reflexes, speed, local fatigue, injury; global
     Constitution, Endurance pool, Agility);
  2. the **eight function attributes** (§6a: Eyesight Si, Perception Se, Pattern Recognition Ne, Hearing Fe,
     Intuition Ni, Spatial Reasoning Ti, Poise Fi, Efficiency Te), their own progression category, never
     substitutes for physical stats;
  3. the **learned skills** (Swordplay, Marksmanship, Gunnery, Brawling).
  Combat performance comes from all three: a musket shot = the shooting arm's steadiness + Eyesight + Spatial
  Reasoning + Marksmanship + the weapon's condition + the target's position.
- **(proposed, outside AI)** Which attributes are global and which local: Strength per limb; Dexterity mainly
  arms and hands; speed mainly legs; Reflexes global reaction with local execution; Endurance global stamina with
  local muscular fatigue; Constitution global; Agility whole-body coordination and balance. Movement per turn
  derived from both legs with the weaker one limiting, less fatigue; not a plain sum (coordination and balance
  count).
- **(proposed, outside AI)** Two swordsmen at Swordplay 80 fight differently by their arms: one precise and fast
  (high right-arm Dexterity and Reflexes), the other hard-hitting and slow, possibly better left-handed. A wounded
  sword arm forces the off hand, with its weaker control.
- **(proposed, outside AI)** Injury severities, so a minor leg wound doesn't halve movement outright.
- **(proposed, outside AI)** Head and torso in the limb table: head = the sensory and cognitive attributes;
  torso = Constitution, Endurance, "Stability". **(keeper)** See the note on head and torso below.
- **(proposed, outside AI)** **Te balance:** extra actions are the strongest thing in a turn-based game, so
  Efficiency should lower specific action costs (reload, preparation, equipment handling), never grant turns.
  Each function pair valuable in a different situation, not numerically equal: Si+Ti long-range accuracy, Se+Fi
  detection and resisting interruption, Ne+Ni concealed enemies and ambushes, Fe+Te hearing and acting.
- **(Rex, 2026-10-29)** **Head and torso carry no stats of their own.** The eight function attributes live in the
  head; the global body stats (Constitution, the Endurance pool, Agility) in the torso. Every hit location maps
  to the stats it dips:

| Hit location | What it dips |
|---|---|
| an arm | that arm's Strength, Dexterity, Reflexes (weapon handling, parry, off hand) |
| a leg | that leg's stats, and movement |
| head | the senses (Eyesight, Perception, Hearing, Intuition) and Spatial Reasoning; a bad one takes awareness |
| torso | the Endurance pool drains (bleeding) and Constitution |

  ChatGPT's "Stability" is Poise (Fi) under another name; not added.
- **(Rex, 2026-10-29)** **Te floor cost.** Efficiency lowers what an action costs and never enlarges the pool or
  adds to initiative; every action keeps a floor cost (no action below N points however efficient). N: open.
- **(keeper)** Written into `STATS.md` §1 the same day on Rex's say: the body attributes per limb.

### 4b. Under the limbs: the muscular system and the gym (Rex, 2026-10-29)

- **(Rex, 2026-10-29)** Go further than per limb: a system based on the real body, where **each major muscle
  gets its own set of stats**. The stats interact in tandem and are set by overall movement: **training them is
  based on what you do**. Walking trains certain muscles by a certain percentage; lifting something trains
  others. Not every muscle, only the ones that count, split the way real muscles split: the deltoid into front,
  middle and rear heads; the chest into upper, middle and lower; the same for any group with several parts.
  Someone with a weak rear deltoid has a lower chance of pulling something apart. "With AI it's totally possible
  to program."
- **(Rex, 2026-10-29)** This opens the **gym simulator** Rex wanted: the character goes to the gym, designs a
  regimen and conducts it. Pirates probably didn't have gyms; disbelief suspended for now.
- **(proposed, outside AI)** Per-limb Strength becomes an output of muscular development rather than a stored
  number. A starting functional model of 25–40 groups, left/right where it matters: deltoids (front, middle,
  rear); chest (clavicular and sternocostal portions, since upper/middle/lower are training regions, not three
  muscles); back (trapezius, latissimus, rhomboids, erectors); arms (biceps, brachialis, triceps, forearms); core
  (abdominals, obliques, deep stabilisers); hips (glutes, flexors, abductors, adductors); thighs (quadriceps,
  hamstrings); lower legs (calves, tibialis). Pulling apart recruits several muscles by direction and grip, not
  the rear delt alone, which supports the idea: an action recruits several groups at different intensities.
- **(proposed, outside AI)** Every action has an **activation profile** (hauling rope: lats 90%, grip 85%, biceps
  70%, rear delts 45%, core 55%, legs 35%; illustrative). Occupations then build different bodies: rigging →
  back, grip, arms, core; swordplay → shoulders, forearms, core, legs; hauling → back, legs, grip; smithing →
  shoulders, forearms, triceps, grip; fishing → forearms, shoulders, back. One shared muscle model that actions
  reference; each profile drives effort required, fatigue, training stimulus and how injuries bite, so new
  activities never rewrite the system.
- **(proposed, outside AI)** Three values per group: **development** (long-term capacity), **fatigue**
  (temporary), **condition** (injury and recovery); plus accumulated **training stimulus** that turns into
  development after rest. A day of heavy lifting makes you weaker that evening and stronger days later, which
  ties in rest, nutrition and the food economy. Movement tiles = f(leg development, balance, fatigue, injuries,
  load): six tiles fresh, three with cargo and a torn hamstring.
- **(proposed, outside AI)** The gym as a weekly regimen (push, pull, legs, cardio, combat, rest days); early
  training by stones, ropes, rowing, barrels and weapon drill, later facilities as town progression.
- **(proposed, outside AI)** Muscle is force only: Reflexes and coordination decide how fast and accurately a
  movement executes, skill decides technique, fatigue and injury modify the day. A weaker master swordsman still
  beats the blacksmith, unless the blacksmith gets him in a grapple.
- **(Rex, 2026-10-29)** The muscular system gets its own doc, **`MUSCULAR.md`**, which Rex is having ChatGPT
  write; and a **`NUTRITION.md`** beside it. **(Rex, 2026-10-29)** Both go under `files/pirate-ship/body/`,
  with `STATS.md` pointing at them once they arrive; the combat keeper files them. Whose lane after that: open. Whether muscle **replaces** per-limb Strength
  (§4a) or is what Strength is computed from: open, ChatGPT says replaces.
- **(keeper)** The system touches lanes beyond combat: every duty in `DUTIES.md` would carry an activation
  profile; the gym is a town place (town keeper) and a regimen a minigame (Rex's to design); food and rest are
  the economy's and the balance keeper's. What combat owns of it: how fatigue, injury, hunger, thirst and
  deficiency read as battle penalties, and what consumables do in a fight.

### 4c. Nutrition (Rex, 2026-10-29; `NUTRITION.md`, not combat's to own)

- **(Rex, 2026-10-29)** Simulate satiation, fat gain "and all that": every food gets **calories, macro- and
  micronutrients**, and those affect things. So **real scurvy** if they forget vitamin C on a long trip; the need
  for water, salt, potassium and the rest of what a body needs. Eat enough of something that pumps up muscles and
  you get a boost.
- **(proposed, outside AI)** Per food a profile (salt beef, biscuit, orange, beans, fresh fish, rum, with
  illustrative numbers); the body tracks four layers: energy balance (calories in/out, fat reserve), macros
  (protein, carbs, fat → recovery, training adaptation), micros (deficiency diseases, performance), hydration
  (water, electrolytes). The muscular system reads these rather than keeping its own food rules. Immediate vs
  long-term kept apart: a meal restores energy, weeks of eating build muscle; one low day loses nothing.
  Scurvy emerges from a hold of beef, biscuit, beans and rum with no vitamin C, reserves falling over ~60–75
  days to fatigue, slow wound healing, bleeding gums; fresh produce spoils, preserved food lacks C.
- **(keeper)** Lanes: the foods are `economy/GOODS.md` (goods already have nutrition-adjacent rows); the
  day-loop and voyage provisioning are the balance keeper's and `PIRATE.md` §5; combat owns only what a deficit
  does in a fight. `PIRATE.md` §5 and `DUTIES.md` already list scurvy, limes and grog as the real thing.

### 4d. Provenance tags (Rex, 2026-10-29; not combat's to own)

- **(Rex, 2026-10-29)** A **time-anomaly tag** on things that don't belong to the period: a creature that isn't
  real is tagged *mythical*; a Triassic creature *Triassic*; an unreal ingredient *sci-fi*. Several concepts can
  then exist in one universe without confusing the player about what they are. The tags don't show in battle;
  they show on the item screen: a sci-fi fish, a mythical fish, a prehistoric fish. Things can be added and the
  game keeps its historical relevance.
- **(proposed, outside AI)** A tag set: Historical, Anachronistic (real, other period), Prehistoric (with an
  era), Mythological (with a tradition), Fantasy, Science Fiction, Original Fiction; shown in inventory,
  bestiary, crafting encyclopaedia and descriptions. **Provenance and gameplay properties kept separate**: the
  nutrition and crafting engines read values, never the tag. A real animal outside its period keeps its real
  classification (a Triassic reptile is still a real extinct species; its appearance is what's fictional). A
  `PROVENANCE.md`.
- **(keeper)** Lanes: items are `economy/GOODS.md`, creatures and fish the story keeper's and `minigames/
  FISHING.md`; combat reads nothing from the tag (an enemy's tag never changes a rule). `SOURCES.md` and the
  economy's period verification are where "historical" is already being proven.

## 5. Progression: skill, not levels

- **(Rex, 2026-10-29)** Combat stats can be raised, but it's mainly the **skill** that rises, and skill makes
  **what you intend to do happen more often**: a strike lands, a critical hit comes off. Mental stats affect other
  things (§6a) and do gain experience.
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
- **(Rex, 2026-10-29)** **Intuition.** Besides the visual and detection stats, a stat that sees around corners and
  through walls: a miraculous knowledge of where an enemy is. Some characters have it high, some low; what sets
  it, Rex hasn't decided.
- **(Rex, 2026-10-29)** **Sound.** Materials make different sounds on different terrain; sound works the way sight
  does (a source, a medium, a listener) and is read with the **Hearing** stat.
- **(proposed, outside AI)** Camouflage computed from clothing, posture, terrain and preparation, not a levelled
  skill; Stealth (moving unnoticed) separate from camouflage (blending while still).
- **(proposed, outside AI)** One authoritative world state (positions, elevation, light, obstacles, detection) for
  walking and fighting alike; walking continuous with a grid overlaid at combat, or always on cells.
- **(proposed, outside AI)** Keep `STATS.md`'s Eyesight and Hearing as they are (Vision = Eyesight); add Pattern
  Recognition as a new attribute. Perception not placed.
- **(keeper)** The same detection would serve the lookout duty (`DUTIES.md`), the sea (sails on the horizon) and
  fishing's reading-the-water stage, so this is a world system, not a combat-only one.
- **(open)** Light and elevation: stats or map properties (Rex's question; ChatGPT: map)? (Vision is Eyesight, and
  Perception and Pattern Recognition are attributes of their own, by §6a.)

## 6a. The combat attributes and the personality functions (Rex, 2026-10-29)

Rex's way of bringing the personality functions into combat, worked out with ChatGPT: each perceiving and judging
function is one combat attribute. The mental stats affect these and gain experience; the skills (§5) decide
whether what you intend happens.

| Attribute | Function | What it does in a fight |
|---|---|---|
| Eyesight | Si | retaining visual detail; recognising familiar appearances and changes in the environment |
| Perception | Se | immediate awareness of movement, threats and activity |
| Pattern Recognition | Ne | unusual configurations, likely hiding places, indirect clues |
| Hearing | Fe | sounds, voices, emotional cues, social activity |
| Intuition | Ni | unconscious anticipation of threats and enemy positions (the around-corners stat) |
| Spatial Reasoning | Ti | angles, distances, trajectories, mechanical interactions: **aiming** |
| Poise | Fi | staying steady: certain strikes do **poise damage** and the target **flinches**; high Poise doesn't flinch easily |
| Efficiency | Te | executing actions with minimal wasted time and effort (Rex, 2026-10-29) |

- **(Rex)** The five sense rows are his concept as pasted; Ti → Spatial Reasoning and Fi → Poise are his own
  additions in the same message.
- **(Rex, 2026-10-29)** **Where they live:** the attributes go in `STATS.md`, because they are character
  properties used beyond combat; this file describes how they function during battles. (Not yet written into
  `STATS.md`: Eyesight and Hearing are there; Perception, Pattern Recognition, Intuition, Spatial Reasoning and
  Poise are new. `STATS.md` has no keeper; the combat keeper only owns `combat/`.)
- **(Rex, 2026-10-29)** **Levels of flinch.** A flinch isn't one thing. The light end is a straight stat decrease,
  or a slight shift of when the unit's next turn comes: it waits one, two or three more units' turns before it
  goes. The heavy end is losing the whole turn, up to a full round where every unit on the board goes before it
  does. "In general, not as a rule": the ladder is the shape, not fixed steps.
- **(Rex, 2026-10-29)** **Te → Efficiency** completes the eight.
- **(Rex, 2026-10-29)** **Endurance is the pool of points you have; Efficiency is how many points each action
  spends per turn.** So a fight runs on a stamina pool (Endurance) drawn down by actions whose cost Efficiency
  sets. **(keeper)** This makes Efficiency, beside Reflexes, the stat half of the duel's "speed".
- **(open)** What Intuition is set by. Which strikes do poise damage, and how much Poise resists which flinch
  level. The point costs themselves (move, strike, reload, prepared shot) and how the pool recovers.

## 7. Preparation and travel

- **(Rex, 2026-10-29)** Emphasis on preparation before a fight, like Monster Hunter. Travel by boat already
  carries it: like Oregon Trail, you travel a distance, need provisions, and things at sea cause events.
- **(Rex, 2026-10-29)** **Items are integral to preparedness**, above all **what ammunition you bring**. Rex
  plans different kinds of powder and different weapons to help in combat. (The goods and recipes are the
  economy docs'; which ammo does what in a fight is this file's.)
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
6. What sets Intuition; which strikes do poise damage and how Poise maps to flinch levels; the point costs per
   action and how the Endurance pool recovers (Te → Efficiency, and pool vs spend, decided 2026-10-29).
7. Light and elevation as map properties (ChatGPT) or stats.
8. Grid shape (square proposed); the team limit and what unlocks more units; the enemy's unit count; how the
   small scale converts to the tactical scale.
9. Who owns combat balance (encounter difficulty, unit numbers): `balance/BALANCE.md` item 14 says not balance.
10. Ammunition and powder kinds: which exist and what each does in a fight.
12. Per-limb stats (§4a): the global/local split as ChatGPT drew it, or changed; the Te floor value N; whether
    genetic min–max is per limb (head/torso and the floor decided 2026-10-29).
13. The muscular system (§4b): `MUSCULAR.md` and `NUTRITION.md` coming from ChatGPT, to be filed under `body/`
    (decided 2026-10-29); whose lane after filing; replaces per-limb Strength or computes it; the gym as a town
    place and a minigame.
14. What combat reads from the body docs: fatigue, injury, hunger, thirst and deficiency as battle penalties;
    consumables in a fight (food boosts, rum, medicine).
11. ~~Where the attribute table lives~~ decided: `STATS.md` (Rex, 2026-10-29); the five new attributes written
    there the same day on Rex's say.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; prior combat decisions and proposals gathered from the other docs | keeper |
| 2026-10-29 | Rex's walkthrough (via ChatGPT): fights as duels of skill, speed and position; grid-based, deadly, regional damage; skill not levels; Monster Hunter prep; Vision shaped by light and elevation; pattern seeking; one seamless map; Oregon Trail travel; locales as puzzles | Rex (recorded) |
| 2026-10-29 | ChatGPT's recommendations on the open items added as proposed; reactions as the duel feel under turns | keeper (outside AI) |
| 2026-10-29 | Rex likes the prepared shot; references set (XCOM 2, Phoenix Point, BG3); record confirmed and reshaped into design sections for refining | Rex |
| 2026-10-29 | 4-unit limit dropped for now; ammo and powder kinds integral to prep; Intuition (around corners) and sound (materials × terrain, Hearing); skill = intent happens more often; the functions as combat attributes (Si Eyesight, Se Perception, Ne Pattern Recognition, Fe Hearing, Ni Intuition, Ti Spatial Reasoning/aiming, Fi Poise/flinch) | Rex |
| 2026-10-29 | Attributes live in `STATS.md`, their battle function here; flinch has levels, from a stat dip or a delayed turn up to a full round lost | Rex |
| 2026-10-29 | Te → Efficiency: actions with minimal wasted time and effort; the eight functions now all have an attribute | Rex |
| 2026-10-29 | Endurance = the pool of points; Efficiency = points spent per action each turn | Rex |
| 2026-10-29 | Physical attributes per limb (Rex's idea); three distinct stat sets agreed (body, eight functions, skills); ChatGPT's global/local split, head/torso rows and Te fence recorded as proposed; keeper's readings on head/torso and a Te floor | Rex / outside AI / keeper |
| 2026-10-29 | Decided: head and torso carry no stats of their own (hit location → stats dipped); Te floor cost stands; STATS.md body attributes rewritten per limb | Rex |
| 2026-10-29 | The muscular system: each counting muscle (split by head, as real) gets stats trained by what you do; the gym simulator (design and run a regimen); ChatGPT's functional model, activation profiles, development/fatigue/condition recorded as proposed | Rex / outside AI |
| 2026-10-29 | `MUSCULAR.md` and `NUTRITION.md` to be written (via ChatGPT); nutrition as calories, macros, micros, water and salt with scurvy emergent; provenance tags (mythical, Triassic, sci-fi) on the item screen, never in battle | Rex |
