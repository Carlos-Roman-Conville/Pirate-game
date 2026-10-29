# Psychology: how body and social states push the meters that already exist (body-and-world keeper, 2026-10-29)

Rex asked for a psychology and mental-health doc in the body family (`../combat/COMBAT.md` §4b). The combat
keeper's note and ChatGPT's answer agree on the fence this file keeps: **it defines no meter of its own.**
The crew's psychology is Rex's most developed system: mood, madness, hearts, respect, trust, the
relationship web, memories (`../PIRATE.md` §7, §7a, §7b), the personality type and sliders and the day-to-day
state (`../STATS.md` §0, §3, §4, §5), and the story keeper's characters. This file only says how physiological
and social states **push** those meters, and by how much. It feeds `BODY.md` only in the sense that
`BODY.md` hands it the states; the meters stay where they live.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; marks **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `data/psychology.json`.

**Clock.** Pushes apply at the overnight tick unless marked per event; a slider moves slowly (Rex: personality
is static until something changes it, and moves slowly), so slider pushes here are small daily pressures,
while a "read as" state (drunk, afraid) is a temporary reading for the day that leaves the slider itself
alone.

## What Rex has decided that this file must respect

- **(Rex, 2026-10-26)** Personality is static until something changes it; it moves slowly, only when someone
  treats them a certain way (the player, or the other crew). This file adds body states as a third slow
  pressure **(proposed)**; it never jumps a slider.
- **(Rex, 2026-10-26)** Each crew mate has a madness meter; their triggers push it; past a line they act.
  Triggers are per character (the story keeper's, `../crew/ROSTER.md`); this file lists which body states
  could be triggers, for the story keeper to keep or drop.
- **(Rex, 2026-10-26)** Hunger hits mood; rum and grog move mood; too much rum, accidents (`../PIRATE.md`
  §5a).
- **(Rex, 2026-10-26)** The crew's average mood is the ship's loyalty; low loyalty means mutiny events.
- **(Rex, 2026-10-26)** Hearts and respect are separate; each crew mate reads the same act differently by
  personality.
- **(Rex, 2026-10-29)** A resurrected character's personality, relationships and story stop (frozen at
  death): no push below applies to a frozen character except as the others react to them.

## 1. Pushes on the existing meters

**Inputs:** the body states from `PHYSIOLOGY.md` (sleep debt, heat, thirst, seasickness), `MEDICINE.md`
(pain, fever, a death), `NUTRITION.md` (hunger, starvation, drink, scurvy stage 1), and social events from
the day loop (who talked to whom, who was posted where, a fight, a prize). **Outputs:** deltas to mood,
madness, respect, the sliders (slow) and "read as" states for the day.

- **[science]** Sleep restriction raises irritability and emotional reactivity and lowers the threshold for
  conflict; pain and hunger lower mood and patience; alcohol disinhibits and raises aggression in the
  disposed; isolation and bereavement lower mood; fear spreads in groups (PSY-SLEEP, PSY-FEAR; textbook
  social psychology, medium confidence on sizes). Scurvy's first sign is lassitude and low mood (Hodges;
  `NUTRITION.md`), which makes mood the earliest warning the player can read.
- **[model] (proposed)** Each row is a daily delta or a day's reading; the sizes are placeholders against
  Rex's meter scales (mood: not scaled yet in `PIRATE.md`; hearts 0–10; sliders 0–100; madness its own).

<!-- table:psychology.pushes -->
*Body and social states and the existing meters they push* (model; confidence medium; source: Mechanisms are established psychology (sleep loss raises irritability and emotional reactivity; pain and hunger lower mood and patience; alcohol disinhibits; isolation and bereavement lower mood; fear is contagious in groups), PSY-*; the sizes are placeholders. The meters are Rex's (PIRATE.md 7, STATS.md 3 to 5).)

| State (from) | Meter pushed (owner) | Direction and size | Condition | Visible face | Mark |
|---|---|---|---|---|---|
| Sleep debt over 12 h (PHYSIOLOGY) | mood (PIRATE 7: crew average mood = loyalty) | -1 a day | while the debt stands | snaps at a crew mate; short answers on keywords | proposed |
| Sleep debt over 24 h | Calm <-> Volatile slider (STATS 3) | toward Volatile, +0.5 a day (slow, as Rex's sliders move) | and madness +1 a day for a character whose trigger is being pushed | a fight in the night (the day-loop event) | proposed |
| Pain over 5 (MEDICINE) | mood | -2 a day |  | groans; refuses the den | proposed |
| Pain over 5 for 7+ days | Patient <-> Impulsive slider | toward Impulsive, +0.5 a day |  |  | proposed |
| Hunger over 0.6 (NUTRITION 4: the drive, from hours and deficit) | mood | -1 per meal missed; -2 a day while over 0.8 |  | 'could eat a horse'; steals from the stores (madness trigger for some) | rex (hunger hits mood), proposed (size; the split, Rex's go-ahead 2026-10-29) |
| Hunger over 0.8 for 3+ days | mood only (temporary irritability): -2 a day; the sliders untouched | the whole crew: loyalty (mean mood) falls with it |  | fights over rations | proposed (Rex's go-ahead 2026-10-29; ChatGPT's adjustment: hunger alone never moves a slider) |
| Prolonged deprivation: starvation stage 2+ for 14+ days, and what happened in it (who hoarded, who shared, who was cheated) | Patient <-> Impulsive; Generous <-> Greedy (slow), read through the memories (PIRATE 7: key moments) | toward Impulsive and Greedy +0.3 a day for the cheated and the hoarders; toward Generous for one who shared and was thanked | a lasting change needs the experience, not the hunger: it is the memory of the short voyage that moves the man (Rex: sliders move by how people treat them) | 'remember the Spanish Main, when he kept the last biscuit' | proposed (ChatGPT's reading, outside AI, 2026-10-29); whether body states may move sliders at all is open 1 |
| Appetite: a meal eaten with appetite over 0.8 (a hot meal, fresh meat, a favourite) | mood; hearts toward the cook (PIRATE 7, the gift rule by analogy) | +1; + (slow) | per meal | praise for the cook; the feast after a prize | proposed (Rex's go-ahead 2026-10-29) |
| Appetite low while hunger is high (off his food: fever, seasickness, grief, 30 days of biscuit) | mood | -1 per refused meal | the refused meal is the early warning of illness or low spirits | 'he won't eat'; the cook complains | proposed (Rex's go-ahead 2026-10-29) |
| Appetite and the person (the story keeper's per character) | appetite's palatability factor read through the character's history and personality, not the type alone (ChatGPT's point, agreed) | a favourite food per character (+0.2); a hated one (-0.3); a food tied to a memory either way | open: which foods per character, from their histories | the ESTP cook's secret; a crew mate who hoards oranges; the one who cannot face salt pork since the wreck | **open** |
| Starvation stage 2+ (NUTRITION) | madness (PIRATE 7) | +1 a day for everyone | the crew's loyalty (mean mood) also falls | the mutiny event opens sooner | proposed |
| Thirst over 2% (PHYSIOLOGY) | mood | -2 a day |  | fights over the cask | proposed |
| Drink: a ration of rum (STATS 4 drink state) | mood | +1 that evening | PIRATE 5a: too much rum, accidents | singing in the den | rex (rum moves mood), proposed (size) |
| Drink: drunk | Calm <-> Volatile (that evening only, not the slow slider) | state read as Volatile +20 for the night | the day-loop fight event | the brawl | proposed |
| Heat strain (PHYSIOLOGY) | mood; Calm <-> Volatile | -1 a day; Volatile pressure while over 38 C |  | tempers at noon | proposed |
| Fever (MEDICINE) | mood; alertness | -2 a day; delirium: dialogue goes strange (the keyword answers from the madness pool) |  | raving in the hammock | proposed |
| Scurvy stage 1 (NUTRITION: lassitude and low mood are the first signs) | mood | -1 a day | before any physical sign | a crew mate 'down' for no reason: the early warning | rex (scurvy real), proposed (push) |
| Seasickness day (PHYSIOLOGY) | mood | -2 |  | misery at the rail | proposed |
| A crew mate's death (MEDICINE / COMBAT) | mood of everyone with hearts toward them (relationship web, PIRATE 7a); madness for the one whose trigger it is | -3 to -6 by hearts; madness +2 | per event | the wake; the next voyage's silence | proposed |
| A crew mate's resurrection in a new form (COMBAT 4e) | relationship web: the others read it by personality (PIRATE 7a) | per type: fear, awe, disgust, relief (story keeper's) | per event |  | **open** |
| Isolation: no one talked to for 3+ days (the keyword dialogue) | mood; Social <-> Solitary | -1 a day; Solitary pressure |  | the loner at the bow | proposed |
| Being posted to the duty they are best at (STATS) | respect toward the captain (PIRATE 7a) | + (slow) | per week | 'the captain knows his business' | proposed |
| Being posted where they are weak and failing | respect; mood | - ; -1 per failure | per event | grumbling | proposed |
| Fear: outnumbered, a storm, a fever aboard | Brave <-> Fearful read for the day; mood | state read as Fearful +10; -1 | contagious: each fearful crew mate adds +2 to the others (PSY-FEAR) | panic in the rigging | proposed |
| Winning a fight, a prize, fresh food after a long passage | mood; respect | +2; + | per event | the feast | proposed |
| A romance partner wounded or sick | hearts (PIRATE 7) unchanged; mood -2; madness +1 for the jealous or possessive type | per day |  | at the bedside | proposed |
| Long habit of rum or laudanum broken (NUTRITION open 4) | mood; Calm <-> Volatile | -2 a day for 5 days; Volatile pressure | if habit is a system (open) | the shakes | **open** |
<!-- /table -->

- **Effects:** mood → loyalty → mutiny events (Rex); madness → the character's act (Rex); respect and hearts
  → the relationship web; sliders → skill learning speed (`STATS.md` §4) and leaving (`PIRATE.md` §7b).
- **Visible face:** everything here is already visible by Rex's design: dialogue tone, the den, fights in
  the night, gossip, the mutiny. This file adds the body as a cause the player can read backwards ("he's
  been foul since the water went bad").
- **Mark:** the hooks **(Rex)**; the rows **(proposed)**.

## 2. Body states as madness triggers

<!-- table:psychology.madness_links -->
*Body states as madness triggers (per type; the story keeper owns the triggers themselves)* (fiction; confidence low; source: Rex: each crew mate has a madness with its own meter; things they hate push it up; past a line they act, the way the type's inferior function erupts (PIRATE.md 7; crew/ROSTER.md). This table only says which body states are plausibly a trigger, for the story keeper to keep or drop per character.)

| Body state | Plausible trigger for | Why (the matrix reading) | Mark |
|---|---|---|---|
| Hunger, short rations | types whose slight is 'left out' or 'cheated' | scarcity reads as unfairness | proposed |
| Sleep loss | the Turbulent (neuroticism high) characters | reactivity rises with debt | proposed |
| Pain, a wound | the proud fighter types | weakness exposed | proposed |
| Disease aboard | the careful, clean types (the ISTJ bosun) | filth and contagion | proposed |
| Heat | the Volatile | temper | proposed |
| A death | the loyal, the jealous, the possessive | loss; or the rival gone | proposed |
| Drink | everyone with a trigger: drink lowers the line by 10 for the night | disinhibition | proposed |
<!-- /table -->

- **Mark:** **(proposed)**, for the story keeper per character; nothing here is a trigger until a
  character file says so.

## 3. Performance: the "state" multiplier

- **(proposed in `STATS.md` §4, kept)** `performance = skill × attribute factor (today) × state`, where state
  is mood, madness, drink, fatigue, sickness, injury. **This file does not compute state**; `BODY.md` §3
  does, reading mood and madness from the crew engine and the physical factors from the body docs, so the
  drunk furious surgeon is one formula in one place.

## 4. Mental health beyond the meters (open)

Rex's list names "psychology and mental health". The period had its own words (melancholy, calenture,
the "horrors" of drink) and the game has madness. Whether there is anything more (a breakdown after long
starvation; the post-battle shakes; addiction as a system) is **(open)**: the keeper proposes nothing new,
per the fence; if Rex wants it, it should be a madness trigger or a slider pressure, not a new meter.

## 5. What this file hands to the others

| To | What | Where it is used |
|---|---|---|
| the crew engine (`PIRATE.md` §7) | daily deltas to mood, madness, respect; "read as" states | the living-NPC rows |
| `STATS.md` §3 | slow slider pressures | the sliders |
| the story keeper | the plausible-trigger list | per-character triggers |
| `BODY.md` | nothing back; it reads states from BODY | - |

## Open for Rex

1. The sizes (all placeholders) and whether body states may move sliders at all (a third slow pressure
   beside you and the crew).
2. Mental health beyond madness (§4): anything, or nothing.
3. Habit and withdrawal (rum, laudanum, tobacco): a system or not (`NUTRITION.md` open 4).
4. How the crew reads a resurrected crew mate (story keeper's, per type).

## Sources

`../SOURCES.md` keys PSY-*: sleep and emotion reviews; fear contagion in groups; the Hodges scurvy
observation (via NUT-SCURVY). The meters themselves: `../PIRATE.md`, `../STATS.md` (Rex).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; 22 pushes on existing meters, 7 plausible madness triggers, the state multiplier placed in BODY.md; no new meter | keeper |
| 2026-10-29 | Hunger and appetite as pushes (Rex's go-ahead on the satiation split, `NUTRITION.md` §4): hunger to mood and the Patient and Generous sliders; appetite to mood and hearts toward the cook; a refused meal as the early warning; favourite foods per character open (story keeper) | keeper (Rex's go-ahead) |
