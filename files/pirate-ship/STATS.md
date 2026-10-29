# Crew stats: the secret list (scaffold v0.1, Rex, 2026-10-26)

Part of the pirate-ship spec (`PIRATE.md`, §7b). Every number here is **hidden from the player**; they infer it
from conversation, gossip and watching people work.

**Rex's structure:** three kinds of stat.

1. **Attributes** ("stat stats"): the body and the senses. Strength, dexterity and so on.
2. **Skills:** things learned. Carpentry, swordplay, cooking.
3. **Personality:** sliding scales between two poles, separate from both.

Attributes and personality **multiply** how fast a character levels a skill: high strength and dexterity make
you inherently better at swordplay. Rex wants it realistic, so each skill below lists the attributes that really
matter for it. Everything beyond Rex's structure is proposed.

## At a glance: every hidden number on a character

This doc is the one place for how a character's numbers work. Relationship numbers are also described where the
systems live in `PIRATE.md`; this table is the summary.

| Number | Range | Set at birth? | How it changes | Section |
|---|---|---|---|---|
| Personality type | one of 16 | yes | never | §0 |
| Attributes | current value inside a genetic min–max | the range, yes | training raises, disuse lowers, age lowers the max | §1 |
| Skills | 0–100 | starting level | practice raises; never falls; rust debuff after disuse | §2 |
| Talent | ×0.5 to ×2.0 per skill | yes | never | §2 |
| Claims | what they say each skill is | yes | lies can be exposed | §2 |
| Personality sliders | 0–100 between two poles | starting value | how you and the other crew treat them, slowly | §3 |
| State | mood, fatigue, drink, sickness, injury | — | day to day | §4 |
| Hearts | 0–10, toward you | — | talk, gifts, gambling, fighting together (PIRATE.md §7) | §5 |
| Respect | separate from hearts | — | how you act: debts collected, fights won (PIRATE.md §7a) | §5 |
| Madness | its own meter | — | their triggers push it up; past a line they act (PIRATE.md §7) | §5 |
| Toward each crew mate | affection, rivalry, distrust | — | events they see, read through personality (PIRATE.md §7a) | §5 |
| Trust | whether they'll talk or join | — | rep, proof, gifts, questlines (PIRATE.md §7b) | §5 |
| Their slight | the one thing that makes them leave | yes | repeats add up (PIRATE.md §7b) | §5 |
| Memories | key moments with you and others | — | events (the dialogue cards) | §5 |

And on the player, per town: **reputation**, with the town and with each group inside it (PIRATE.md §7b).

## 0. Personality type (Rex, 2026-10-26)

Every character has a personality type: one of the 16, with its cognitive-function stack from Rex's personality
matrix. The type is fixed. It has further effects on other systems that Rex hasn't decided yet (dialogue voice,
how they read events, madness, gambling style are the obvious candidates). Each type has a man and a woman in the
roster (`crew/ROSTER.md`).

**Assertive ↔ Turbulent (Rex):** each character can carry neuroticism, which sets Turbulent vs Assertive. Here it
is one of the personality sliders (§3), so it can shift slowly like the others; whether it should instead be fixed
like the type is Rex's call.

## 1. Attributes (proposed: 1–20, 10 is an ordinary sailor)

| Attribute | What it is | Realism notes |
|---|---|---|
| Strength | lifting, hauling, hitting | hauling lines, working the capstan, running out a two-ton gun |
| Endurance | how long before tiring; long watches, pumping | builds slowly with hard work |
| Agility | balance and whole-body movement | moving aloft in a rolling sea; dodging |
| Dexterity | fine hand control | needle, knife, knots, cards, a steady saw |
| Reflexes | reaction speed | parries, catching a falling line, a fish striking |
| Constitution | resisting sickness, drink, wounds, seasickness | scurvy and fever killed more than battle |
| Eyesight | seeing far and fine detail | lookouts; reading the sea; threading canvas |
| Hearing | small sounds, rhythm | a creaking mast, footsteps on deck, music |
| Taste and smell | the nose and palate | cooking; spotting spoiled stores or gunpowder gone damp |
| Wits | reasoning and numbers | navigation is arithmetic; counting cards; range-finding |
| Memory | holding facts, faces, routes, recipes | charts, signals, who said what |
| Nerve | steadiness under fear or pain | surgery without anaesthetic, boarding, holding a bluff |
| Perception (Rex, 2026-10-29) | immediate awareness of movement, threats and activity | the hand who notices the sail move before the lookout calls it |
| Pattern Recognition (Rex, 2026-10-29) | telling a shape from its surroundings: unusual configurations, likely hiding places, indirect clues | a still man in cover; a reef by the colour of the water |
| Intuition (Rex, 2026-10-29) | unconscious anticipation of threats and where an enemy is; "sees around corners" | the old pirate who knows the alley is wrong before anything shows; what sets it high or low is open |
| Spatial Reasoning (Rex, 2026-10-29) | angles, distances, trajectories, mechanical interactions | aiming a musket or a gun; judging a jump between rails |
| Poise (Rex, 2026-10-29) | staying steady when struck; resists flinching | the boarder who takes a cut and keeps coming |
| Efficiency (Rex, 2026-10-29) | executing actions with minimal wasted time and effort | the gunner's crew that reloads in half the time; no motion spare |

**The functions as attributes (Rex, 2026-10-29).** Eight attributes are the personality functions in combat:
Eyesight Si, Perception Se, Pattern Recognition Ne, Hearing Fe, Intuition Ni, Spatial Reasoning Ti, Poise Fi,
Efficiency Te. In a fight, **Endurance is the pool of points and Efficiency is how many each action spends** (Rex,
2026-10-29). How each works in a fight (detection, aiming, poise damage and flinch levels) is in
`combat/COMBAT.md` §6 and §6a; here they are character properties, used beyond combat (lookout, the sea, port).
They gain experience like the rest.

**Genetic potential (Rex, 2026-10-26).** Every attribute has a hidden **minimum and maximum** the character was
born with, so not everyone can reach the top of every stat. A crew mate can be born with great potential strength
and not realise it until he keeps training strength. The current value moves inside that range:

- **Use raises it** toward the maximum, if the character is put in the right spot to train it (a year on the pumps
  builds strength and endurance).
- **Disuse lowers it** toward the minimum: a smart crew mate who is never challenged intellectually starts losing
  mind stats.

This holds for all three groups: body, senses and mind.

**Age (proposed):** the maximum itself falls with age after the 20s–30s, while skill keeps rising with practice.
An old surgeon has the best skill and the shakiest hands. **Injuries** cut attributes, and may lower the maximum
for good (a lost eye halves eyesight; a peg leg takes agility).

## 2. Skills (proposed: 0–100)

Primary attributes count double; personality is how the sliders (§3) push learning speed.

| Skill | Primary | Secondary | Personality pull | Duty / post |
|---|---|---|---|---|
| Seamanship (sail handling, rigging, knots) | Agility, Strength | Endurance, Memory | Disciplined | everyone |
| Climbing aloft | Agility | Strength, Nerve | Brave | topmen |
| Helmsmanship | Reflexes, Endurance | Eyesight | Patient | navigator, anyone |
| Navigation | Wits, Memory | Eyesight | Patient, Careful | navigator |
| Lookout | Eyesight | Hearing, Endurance | Patient | lookout |
| Carpentry | Dexterity, Strength | Wits | Careful, Patient | carpenter |
| Sailmaking (sewing) | Dexterity, Eyesight | Endurance | Patient | sailmaker |
| Cooperage | Strength, Dexterity | Wits | Careful | cooper |
| Cooking | Taste and smell | Dexterity, Memory | Curious | cook |
| Fishing | Reflexes, Dexterity | Eyesight | Patient | fisherman |
| Surgery and medicine | Dexterity, Nerve | Wits, Memory, Strength | Careful, Calm | medic |
| Gunnery (the cannons) | Wits, Strength | Eyesight, Nerve | Disciplined | cannoneer |
| Marksmanship (musket, pistol) | Eyesight, Nerve | Dexterity | Patient, Calm | sniper |
| Swordplay | Reflexes, Agility | Strength, Dexterity | Brave | boarders |
| Brawling | Strength, Endurance | Reflexes | Volatile | anyone |
| Swimming | Endurance, Strength | Agility | Brave | (many real sailors couldn't swim) |
| Gambling (odds, reading tells) | Wits, Memory | Nerve | Calm | den |
| Sleight of hand (cheating, pickpocketing) | Dexterity | Nerve, Eyesight | Deceitful | card sharp, thief |
| Haggling | Wits | Memory | Proud? Deceitful | trade, ports |
| Persuasion | Wits | Memory | Social | recruiting |
| Deception (lying) | Wits, Nerve | Memory | Deceitful | the fake doctor |
| Intimidation | Strength | Nerve | Cruel, Volatile | bosun, first mate |
| Music | Hearing, Dexterity | Memory | Social | musician |
| Tattooing | Dexterity, Eyesight | Nerve | Patient | tattooist |
| Reading and writing | Memory, Wits | — | Curious | navigator, quartermaster |
| Smithing | Strength, Endurance | Dexterity | Patient | the port's blacksmith |

**Skills never decrease; they go rusty (Rex, 2026-10-26).** After a period of not using a skill, a "been a while"
debuff applies, and it grows with time: about 10 points after a year without it, 20 after two years. The real
level stays; after one or two uses the debuff clears quickly and the old level is back. (Someone who hasn't done
woodwork in a year works at 10 points under their level for their first job or two.)

**Talent (proposed):** one hidden multiplier per skill, from 0.5 (no feel for it) to 2.0 (a natural). This is how
Rex's ESTP who looks like a first mate is the best cook in town: average nose, huge cooking talent.

**Claims (proposed):** what a character *says* their skill is, stored apart from the real one. The liar's claim
is high and the real skill low; the modest one claims low. Dialogue reads the claim; the work reads the truth.

## 3. Personality sliders (proposed: 0–100 between two poles, 50 the middle)

Assertive ↔ Turbulent (neuroticism; Rex) · Patient ↔ Impulsive · Careful ↔ Reckless · Disciplined ↔ Unruly · Curious ↔ Incurious · Calm ↔ Volatile ·
Brave ↔ Fearful · Honest ↔ Deceitful · Proud ↔ Humble · Social ↔ Solitary · Loyal ↔ Fickle ·
Generous ↔ Greedy · Kind ↔ Cruel

**Personality is static until something changes it (Rex, 2026-10-26).** It moves slowly, and only when someone
treats them a certain way: your dialogue and actions, **and how the other crew mates treat them** (Rex). Doing
nothing leaves it where it is:

- Seek out a fickle person to join you again and again and they slowly lose fickleness: more loyal.
- Stay calm in front of someone volatile and they slowly grow calmer; behave volatile in front of them and they
  grow more volatile.
- The same holds between crew mates: a crew mate who is mocked by the others, or trusted by them, shifts the same
  slow way. Your crew shapes each other, not only you.

Sliders also drive things beyond skills: Fickle and Proud feed whether someone leaves (§7b), Honest ↔ Deceitful
sets how far their claims stray, Calm ↔ Volatile feeds madness. How each matrix type sets a character's sliders
is Rex's call.

## 4. How it multiplies

**Method (Rex, 2026-10-26): no single general rule.** Each skill is really different, so a broad rule that
targets every scenario isn't how the world works. Instead, go skill by skill: work out what affects that skill,
and after doing a few, see whether a pattern emerges. The general formula below is the earlier draft, kept for
reference only; each skill's own breakdown replaces it as it's written.

**Per-skill breakdown (template, to fill skill by skill):**

| Skill | What learning it takes | What doing it takes | Functions that absorb it (and which part) | Attributes that matter | Talent | What raises or lowers it day to day |
|---|---|---|---|---|---|---|
| Fishing (Rex, first) | reading water: which fish are where, which rhythm each likes | aim, cast, lure rhythm, bite timing, pulling in | (open) | Eyesight, Dexterity, Strength, Reflexes, Endurance | (open) | Patience, Calm; full stage map in `minigames/FISHING.md` |

Ideas raised in discussion, for Rex to use or drop per skill: an experience splits into facets that different
functions absorb (in a fight, Se takes the timing, Ne the options); a talent can sit on a function, separate from
its stack position; type works as attention (what someone notices), which is also why it predicts how their stats
were distributed; personality sliders change how much someone practises rather than how much each rep teaches;
learning beside someone more skilled teaches faster.

**Earlier draft (reference only).** Learning: each time a character practises a skill,

    gain = base × attribute factor × personality factor × talent × age factor

- **Attribute factor:** each governing attribute as (value ÷ 10), raised to its weight (primary weight 2,
  secondary 1, weights normalised to sum to 1), all multiplied. Ordinary attributes give 1.0; twice ordinary
  gives 2.0; half gives 0.5. So high strength *and* dexterity compound, and one weak primary drags it down.
- **Personality factor:** each listed slider gives up to ±25%, by how far it sits toward the helpful pole.
- **Age factor:** young learn faster; old learn slower.

**Doing the job (proposed, the same idea):** how well the job goes today is

    performance = skill × attribute factor (today) × state

where **state** is mood, madness, drink, fatigue, sickness and injury. The skilled surgeon who is drunk and
furious with you is a worse surgeon tonight.

## 5. Relationship numbers (summary; the systems are in PIRATE.md)

- **Hearts** (0–10, toward you): raised by talking once a day, liked gifts, gambling together, fighting beside
  them, taking their side; lowered by the opposite. Heart events at set levels; romance past a set level (§7).
- **Respect:** separate from hearts. A pirate can love you and think you weak, or hate you and respect you (§7a).
- **Madness:** its own meter; their triggers push it up, and past a line they act on it, the way their type's
  inferior function erupts (§7, `crew/ROSTER.md`).
- **Toward each other crew mate:** affection, rivalry, distrust; the same event is read differently by each
  personality (§7a).
- **Trust:** gates whether they'll say anything on a keyword and whether they'll join (§7b).
- **Their slight:** the specific thing that, repeated often enough, makes them leave (§7b).
- **Memories:** the key moments the dialogue cards check for (the "things said earlier pay off later" system).

## Open for Rex

- Keep, cut or add attributes, skills and sliders.
- The top of the attribute scale (Rex mentioned 30; the draft says 1–20), and how wide a typical min–max range is.
- How fast attributes rise with training and fall with disuse.
- The scales (1–20, 0–100, 0–100).
- Whether talent and claims stay as separate hidden numbers.
- How the matrix types set the sliders.
- What the personality type affects beyond the sliders.
- Assertive ↔ Turbulent: a slider that shifts (as drafted) or fixed like the type.
- What sets Intuition high or low; the point costs per action (`combat/COMBAT.md` §6a).
