# Neurology: baseline signalling, substances, receptors, circuits (body-and-world keeper, 2026-10-29)

Rex's idea (2026-10-29): instead of rum giving an arbitrary penalty, simulate the receptors a substance
activates and attach them to a brain that functions like one. ChatGPT (outside AI) framed it as
neuropharmacology on a functional brain model and, in a second note, asked for a baseline of endogenous
signalling and for substances to interact through shared systems; Rex passed on the go-ahead with those
two additions. **(Rex, 2026-10-29)** The structure is his decision: the signalling systems, the
baseline drivers, the kinetics, the four clocks, the circuits and the fence. The biology is established
at the level of a functional model (systems, circuits, kinetics), never a neuron; **every number, weight,
EC50 and time constant is a placeholder** (Rex's words: "numbers still placeholders"). Rows marked open
(hemp, the cannabinoid and wake systems' substances, the tagged rows, the genetic range) stay open.

**The fence.** Receptor activity is not behaviour. This file emits circuit outputs (arousal, coordination,
attention, memory encoding, pain relief, breathing drive, mood bias, fear reading, appetite, sleep
quality, craving) and hands each to a meter or attribute that already exists. It never writes a personality
slider, a memory's content or a decision. The eight function attributes stay the attribute layer
(`STATS.md` §1, Rex); this sits under them as muscle sits under Strength.

**Ownership (agreed before writing, kept exactly):** neurology owns signalling, receptors, kinetics,
circuits and long-term neural adaptation; `PHYSIOLOGY.md` keeps sleep debt (adenosine is the mechanism
here, the debt table the output there); `MEDICINE.md` keeps pain, injuries and the conditions (overdose,
delirium, erethism, the dry gripes); `MUSCULAR.md` keeps the movement patterns and their recruitment
values (this file supplies only the rule that changes them); `PSYCHOLOGY.md` keeps behaviour and the
pushes; `BODY.md` integrates.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `data/neurology.json`.

**Clock.** Kinetics run in minutes within the day (a dose at the den, a pipe on watch); tolerance,
dependence and withdrawal advance at the overnight tick; the baseline drivers are read from the other
docs at the tick and on events.

## What Rex has decided that this file must respect

- **(Rex, 2026-10-29)** The idea itself: receptors and a brain-like system under the chemicals; and,
  stamped the same day, this file's structure (§1–§7), numbers placeholders.
- **(Rex, 2026-10-29)** Provenance tags: crack and methamphetamine do not exist in 1650–1730; any such
  substance is a tagged item whose row the engine reads like any other, never its tag.
- **(Rex, 2026-10-26)** Rum and grog move mood; too much rum, accidents (`../PIRATE.md` §5a); drink is a
  `STATS.md` §4 state. Those are now outputs of this file rather than fixed numbers.
- **(Rex, 2026-10-26)** Personality moves only by how people treat each other; sliders are never written
  here. Madness, hearts, respect, memories are the crew engine's.
- **(Rex, 2026-10-29)** The four-level adaptation model: recruitment values live in `MUSCULAR.md`.

## 1. The signalling systems

<!-- table:neurology.systems -->
*The signalling systems the model tracks (a functional brain, not a cellular one)* (science; confidence high; source: Standard neuropharmacology (Rang and Dale; Kandel): each system's main roles, and the caution that none is a single feeling. NEU-SYS. Each carries a tone (0 to 2, 1 = normal), a receptor sensitivity (0 to 2, 1 = normal; tolerance lowers it) and a time constant for sensitivity to return.)

| Id | System | Main roles (science) | Circuits it drives | Sensitivity recovery (days, model) | What a tone over 1 reads as | What a tone under 1 reads as | Mark |
|---|---|---|---|---|---|---|---|
| gaba | GABA (inhibitory) | the brain's brake: sedation, anxiety damping, motor smoothing | arousal (down), motor control, fear | 5 | sedation, slurred coordination, calm | anxiety, tremor, fits (the alcohol withdrawal state) | rex (the system, 2026-10-29); proposed (constants) |
| glutamate | Glutamate (excitatory, NMDA) | the accelerator: learning, memory, excitation | memory, attention, arousal (up) | 5 | excitation, fits, excitotoxic damage | dulled learning and memory | rex (the system, 2026-10-29); proposed (constants) |
| dopamine | Dopamine | reward prediction, motivation, movement initiation; not pleasure as such | reward and habit, motor control, attention | 14 | drive, wanting, stereotyped behaviour, paranoia at the extreme | apathy, slowed movement, anhedonia | rex (the system, 2026-10-29); proposed (constants) |
| serotonin | Serotonin | mood regulation, impulse control, appetite, sleep, sensory gating | mood regulation, appetite, sleep | 14 | sedation, nausea, in excess a syndrome | low mood, impulsivity, poor sleep | rex (the system, 2026-10-29); proposed (constants) |
| noradrenaline | Noradrenaline | arousal, vigilance, the stress response, heart rate | arousal, attention, fear, pain gating | 7 | alertness, anxiety, fast pulse, sweating | fatigue, inattention | rex (the system, 2026-10-29); proposed (constants) |
| acetylcholine | Acetylcholine | attention, memory encoding, the neuromuscular junction, parasympathetic tone | attention, memory, motor control | 7 | focus; at the junction, muscle twitching | poor memory, inattention; at the junction, weakness | rex (the system, 2026-10-29); proposed (constants) |
| opioid | Endogenous opioids (mu, kappa, delta) | pain modulation, reward, respiratory drive | pain gating, reward, arousal (down), breathing | 10 | analgesia, euphoria, slowed breathing, constipation | pain amplified, dysphoria, gut cramps, gooseflesh (withdrawal) | rex (the system, 2026-10-29); proposed (constants) |
| adenosine | Adenosine | sleep pressure: builds with hours awake, cleared by sleep | arousal (down), sleep | 3 | sleepiness (the pressure PHYSIOLOGY 3 counts as debt) | wakefulness (caffeine blocks the receptor; the pressure itself still accumulates) | rex (the system, 2026-10-29); proposed (constants) |
| cannabinoid | Endocannabinoids | appetite, pain, memory modulation, stress buffering | appetite, pain gating, memory | 7 | hunger, altered time sense, calm | anxiety, poor sleep | rex (the system, 2026-10-29); proposed (constants) |
| histamine_orexin | Histamine and orexin (wake-promoting) | wakefulness and appetite | arousal, appetite | 3 | wakeful | sleepy (the antihistamine state; no period substance) | rex (the system, 2026-10-29); proposed (constants) |
<!-- /table -->

- **[science]** The ten families are the standard ones; each is many receptor subtypes in truth, folded
  to one tone and one sensitivity per system because that is what the circuits read (NEU-SYS). None is a
  feeling: dopamine is wanting and movement, not pleasure; serotonin is regulation, not happiness.
- **[model]** Each system carries `tone` (1 = normal), `sensitivity` (1 = normal; tolerance lowers it)
  and a recovery time constant. Rex's hidden genetic min–max applies: each character's baseline tones and
  sensitivities sit within a range, which is why one man drinks himself calm and another wild (open:
  whether that range is tied to the type or to the Assertive↔Turbulent slider).

## 2. Baseline: the nervous system with nothing taken

<!-- table:library/neurology.baseline -->
*Baseline, endogenous signalling: what the body and the day do to the systems with no substance taken* (science; confidence medium; source: ChatGPT's addition (outside AI), kept: the nervous system runs continuously; exercise, sleep loss, pain, fear, hunger and social experience all shift it. Mechanisms are textbook (exercise raises noradrenaline and endorphins; sleep loss raises adenosine and lowers prefrontal control; pain raises noradrenaline and engages the opioid system; fear is the noradrenaline and cortisol response; hunger raises orexin and ghrelin-driven drive). Sizes are placeholders. NEU-BASE)

| Driver (from) | Systems moved (tone) | Circuit effect | Decays | Mark |
|---|---|---|---|---|
| Hours awake (PHYSIOLOGY 3) | adenosine +0.05 per hour awake, reset by sleep (deep sleep clears it) | arousal down; the mechanism under PHYSIOLOGY's sleep-debt table, which stays the output | with sleep | rex (the driver, 2026-10-29); proposed (sizes) |
| Hard exercise (MET over 6, MUSCULAR work) | noradrenaline +0.3 during; opioid +0.2 for 2 h after (the runner's calm); dopamine +0.1 | arousal up during; pain gating up after; mood push +1 (PSYCHOLOGY) | hours | rex (the driver, 2026-10-29); proposed (sizes) |
| Pain over 5 (MEDICINE 4) | noradrenaline +0.3; opioid +0.2 (the body's own analgesia, limited) | arousal up, sleep down, attention narrowed | with the pain | rex (the driver, 2026-10-29); proposed (sizes) |
| Fear: a fight, a storm, outnumbered (COMBAT, the day loop) | noradrenaline +0.5 for the event, +0.1 for the day; the stress hormones (PHYSIOLOGY, open) | arousal and vigilance up; fine motor control down (the shaking hand); memory of the event stamped (the memories system) | hours; days if repeated | rex (the driver, 2026-10-29); proposed (sizes) |
| Hunger over 0.6 (NUTRITION 4) | histamine_orexin +0.2; dopamine seeking +0.1 | food-seeking drive; irritability | with a meal | rex (the driver, 2026-10-29); proposed (sizes) |
| Starvation stage 2+ (NUTRITION) | serotonin -0.2 (tryptophan short); dopamine -0.1 | low mood, apathy; the mood push PSYCHOLOGY already gives | with refeeding, weeks | rex (the driver, 2026-10-29); proposed (sizes) |
| Sleep debt over 24 h (PHYSIOLOGY) | glutamate control down (prefrontal); noradrenaline erratic | emotional reactivity up (the irritability push), lapses | with sleep | rex (the driver, 2026-10-29); proposed (sizes) |
| Social: praise, a win, a prize, a gift (the crew engine) | dopamine +0.2 for the day; opioid +0.1 | reward: the habit circuit learns what got it (the memories system), mood push | a day | rex (the driver, 2026-10-29); proposed (sizes) |
| Social: isolation, grief, humiliation | serotonin -0.1 a day while it lasts; noradrenaline +0.1 | low mood, poor sleep; PSYCHOLOGY's pushes | weeks | rex (the driver, 2026-10-29); proposed (sizes) |
| Fever (MEDICINE) | all systems noisy: attention -0.3, delirium over 39.5 C | the raving in the hammock | with the fever | rex (the driver, 2026-10-29); proposed (sizes) |
| Heat strain (PHYSIOLOGY 4) | noradrenaline +0.2; serotonin disturbed | irritability, poor judgement | with cooling | rex (the driver, 2026-10-29); proposed (sizes) |
| Deficiency: thiamin, niacin, B12, iron (NUTRITION 5) | slow loss of acetylcholine and glutamate function (thiamin, B12); serotonin (niacin); oxygen delivery (iron) | memory, confusion, the dementia of pellagra, the numb feet of B12 | months on repletion | rex (the driver, 2026-10-29); proposed (sizes) |
| Age (PHYSIOLOGY 8) | dopamine -5% per decade after 40; acetylcholine -3% | slower movement initiation; memory | never | rex (the driver, 2026-10-29); proposed (sizes) |
| Genetics (the hidden min-max, STATS) | each system's baseline tone and sensitivity vary per character within a range (the nervous type: the Assertive <-> Turbulent slider's biological side, proposed) | why one man drinks himself calm and another wild | never | rex (the driver, 2026-10-29); proposed (sizes) |
<!-- /table -->

- **(proposed, outside AI; kept)** The system runs continuously; a substance acts on a baseline already
  shifted by the day. The drivers are the other docs' states, read at the tick and on events, so nothing
  here is a second sleep or hunger model: adenosine is the mechanism under `PHYSIOLOGY.md`'s debt table,
  orexin under `NUTRITION.md`'s hunger, and the outputs flow back through the circuits.

## 3. Pharmacokinetics: dose to concentration

<!-- table:neurology.pk -->
*Pharmacokinetics: how a dose becomes a concentration over time (one-compartment model)* (science; confidence medium; source: Standard one-compartment kinetics: C(t) rises with absorption (first-order, half-time ta) and falls by elimination (first-order with half-life t1/2, or zero-order for alcohol at about 0.015 g/dL per hour, Widmark). Alcohol: Widmark factor 0.68 men, 0.55 women; peak 30 to 90 minutes, slower with food (availability 66 to 71% after a meal). Caffeine half-life 3 to 6 hours; nicotine about 2 hours; theobromine 7 to 12 hours; morphine (laudanum) 2 to 4 hours; quinine (bark) 8 to 14 hours; mercury and lead accumulate over weeks to years. NEU-PK, NEU-ALC, NEU-CAF)

| Substance (good) | Period status | Route | Absorption half-time (min) | Elimination | Volume of distribution (L/kg) | Systems hit (direction, potency per standard dose) | Standard dose | Mark |
|---|---|---|---|---|---|---|---|---|
| Alcohol (rum row 5, beer 78, wine 40, brandy 41, cider, punch) | historical: the sailor's daily ration | drink | 30 | zero order, 0.015 g/dL per hour (7 to 10 g per hour) | 0.68 (men) 0.55 (women), Widmark | gaba +0.3 (agonist); glutamate -0.3 (NMDA block); dopamine +0.15; opioid +0.1; adenosine +0.1 later (the rebound insomnia) | 14 g (half a gill of rum, a pint of strong beer) | rex (the substance and its systems, 2026-10-29); proposed (constants) |
| Opium as laudanum (drugs row 48; the surgeon's chest) | historical: Sydenham's tincture, 1660s; the surgeon's analgesic | drink (tincture) | 45 | half-life 3 h (morphine) | 3.5 | opioid +0.6 (mu agonist); dopamine +0.2; adenosine +0.1; gut motility down | 25 drops (about 15 mg morphine) | rex (the substance and its systems, 2026-10-29); proposed (constants) |
| Tobacco, smoked or chewed (rows 19, 111, 121) | historical: universal among sailors; pipes and quids | smoke (pipe, minutes) or chew (slow) | 5 | half-life 2 h (nicotine) | 2.6 | acetylcholine +0.3 (nicotinic agonist); dopamine +0.2; noradrenaline +0.2 | one pipe (1 to 2 mg absorbed) | rex (the substance and its systems, 2026-10-29); proposed (constants) |
| Coffee (row 74), tea (75), chocolate (11), kola (88) | historical: coffee houses London 1652; chocolate 1650s; tea Roberts' drink; kola on the Guinea coast | drink; kola chewed | 30 | half-life 5 h (caffeine); 9 h (theobromine, weak) | 0.6 | adenosine -0.3 (antagonist: blocks, does not clear the pressure); noradrenaline +0.1; dopamine +0.05 | a dish of coffee (80 mg caffeine); tea 40; chocolate 20 caffeine plus theobromine; kola 50 | rex (the substance and its systems, 2026-10-29); proposed (constants) |
| Peruvian bark, quinine (row 72) | historical: the fever cure; also toxic (cinchonism) | drink (bark in wine) | 60 | half-life 11 h | 1.5 | none at a dose; over 2 g a day: hearing (tinnitus, Hearing x0.8), vision blur, nausea (cinchonism) | 1 g bark | rex (the substance and its systems, 2026-10-29); proposed (constants) |
| Mercury (row 108; the pox cure) | historical: unction and pills for syphilis | skin, mouth; accumulates | 1440 | half-life about 60 days | accumulates in brain and kidney | slow: acetylcholine and glutamate function down with the body burden; erethism (irritability, shyness, tremor) over months | a course of unction (grams over weeks) | rex (the substance and its systems, 2026-10-29); proposed (constants) |
| Lead (from still worms and pewter: the dry gripes, MEDICINE) | historical | drink (rum, cider) | 1440 | half-life about 30 days in blood, years in bone | accumulates | slow: gaba and glutamate disturbed; peripheral nerve (wrist drop); encephalopathy at high burden | with each rum ration from a lead-worm still | rex (the substance and its systems, 2026-10-29); proposed (constants) |
| Hemp, cannabis (not a GOODS row) | historical in the period (hemp was cordage; smoking it is attested elsewhere); open whether in the game | smoke | 5 | half-life 1 to 2 days (fat-stored) | 10 | cannabinoid +0.4; dopamine +0.1 | a pipe | **open** |
| A tagged substance (sci-fi, mythical: provenance tag, COMBAT 4d) | fiction, tagged on the item screen | as its row says | as its row | as its row | as its row | its own row of system hits: the engine reads them like any other, never the tag (Rex) | as its row | open (the story keeper's rows) |
<!-- /table -->

- **[science]** One-compartment kinetics: a dose is absorbed first-order with the substance's absorption
  half-time and eliminated first-order by its half-life, except alcohol, which the liver clears at a
  near-constant 0.015 g/dL per hour (7–10 g an hour) and which distributes by the Widmark factor
  (0.68 men, 0.55 women), peaking 30–90 minutes after drinking and slower with food (NEU-PK, NEU-ALC).
  Caffeine's half-life is 3–6 hours; nicotine's about 2; morphine's 2–4; quinine's about 11; mercury and
  lead accumulate (NEU-CAF). **Since 2026-10-29 every clearance is the liver's** (`ANATOMY.md`): the rate
  above × liver function, so a damaged liver keeps a man drunk longer and makes the surgeon's draught last.
- **[history]** Rum, beer and wine were the ration; laudanum was in the chest from the 1660s; tobacco was
  universal; coffee houses opened in London in 1652 and chocolate was sold there by 1657 (NEU-HIST);
  Peruvian bark cured agues and deafened at high dose; mercury was the pox cure and poisoned its
  patients. All are `../economy/GOODS.md` rows.
- **[model]**

      C(t) += dose / Vd × (1 − e^(−ln2·t/ta))   on absorption;   C(t) −= C × ln2/t½ per step   (alcohol: −0.015 g/dL per hour)
      occupancy_s = C / (C + EC50_s)             per system the substance hits

  EC50 per substance and system is the placeholder the simulator tunes; "standard dose" in the table is
  what a potency of 1.0 means.

### 3a. Inhaled substances (added 2026-10-29, the air layer)

- **[model]** A gas or vapour enters by the same kinetics as a drink: inhaled dose = ventilation
  (`PHYSIOLOGY.md` §1a) × concentration (`../world/GAS_DYNAMICS.md`) × minutes × uptake fraction
  (`../science/CHEMISTRY.md`), then absorbed into the one-compartment model with the substance's own
  half-life. Only neuroactive substances take the receptor path (ethanol vapour in a still-house,
  anaesthetic vapours none in the period, a tagged gas); carbon monoxide, carbon dioxide and hydrogen
  sulphide act through `CIRCULATION.md` §1a (oxygen transport and the cells' use of it) and reach this
  file only as hypoxia of the brain, which lowers every circuit's output together. Mercury vapour is a
  body burden here as before.

## 4. Receptor dynamics: the four clocks

<!-- table:library/neurology.receptor -->
*Receptor dynamics: occupancy, tolerance, dependence, withdrawal (the four clocks)* (science; confidence medium; source: Occupancy by a saturating function of concentration (Hill, n = 1); fast desensitisation in minutes and slow downregulation over days to weeks (tolerance), with recovery days to weeks after the drug stops (NEU-TOL: CB1 binding back to normal at 7 to 14 days; beta-receptor numbers 16 days; opioid desensitisation reverses in an hour, tolerance slowly). Withdrawal is the rebound of an adapted system without the drug: alcohol 6 to 24 h onset, seizures 24 to 48 h, delirium tremens 48 to 72 h in 3 to 5% with high untreated mortality (NEU-AW); opioids onset 6 to 12 h, peak 1 to 3 days, 5 to 10 days (NEU-OW); caffeine headache 12 to 24 h; nicotine hours.)

| Clock | What it is | Formula (model) | Timescale | Mark |
|---|---|---|---|---|
| 1. Acute effect | how much the substance moves each system now | effect_s = potency_s x occupancy, occupancy = C / (C + EC50) ; tone_s = baseline_s + sum over substances of effect_s x sensitivity_s | minutes to hours (the PK curve) | rex (the clock, 2026-10-29); proposed (formula constants) |
| 2. Tolerance | the system's sensitivity falling under repeated exposure, so the same dose does less | sensitivity_s -= k_tol x mean occupancy over the day, floor 0.3; recovers toward 1.0 at the system's recovery time constant when exposure stops | days to weeks to build (alcohol 2 to 3 weeks of daily drinking for marked tolerance; opioids 1 to 2 weeks; caffeine days), days to weeks to lose | rex (the clock, 2026-10-29); proposed (formula constants) |
| 3. Dependence | the adapted system now needs the substance to sit at its normal tone (the baseline has shifted the other way) | dependence_s = clamp(1 - sensitivity_s, 0, 1) x exposure days / 14; counts as a need the character acts on (craving: the reward circuit's habit learning and the PSYCHOLOGY push) | weeks | rex (the clock, 2026-10-29); proposed (formula constants) |
| 4. Withdrawal | the rebound when the substance leaves an adapted system: tone swings opposite to the drug | withdrawal_s = dependence_s x (1 - occupancy) x rebound_s(t), rebound rising from the drug's last elimination to a peak then fading on the recovery constant; alcohol: gaba under, glutamate over (tremor, sweats, fits at 24 to 48 h, delirium at 48 to 72 h if dependence over 0.7, death roll 10% per day of delirium untreated); opioid: opioid under (pain, cramps, gooseflesh, vomiting, no sleep; rarely fatal); caffeine: adenosine over (headache, sleepiness for 1 to 2 days); nicotine: acetylcholine and dopamine under (irritability, craving, days) | hours to days; craving for weeks to months | rex (the clock, 2026-10-29); proposed (formula constants) |
<!-- /table -->

- **[science]** Fast desensitisation in minutes, slow downregulation over days to weeks, recovery days to
  weeks after exposure ends (NEU-TOL). Alcohol withdrawal begins 6–24 hours after the last drink, seizures
  at 24–48 hours, delirium tremens at 48–72 hours in 3–5% of withdrawals with high mortality untreated
  (NEU-AW); opioid withdrawal begins 6–12 hours after a short-acting dose, peaks at 1–3 days and lasts
  5–10 days, with craving for weeks (NEU-OW).
- **[model]** Acute effect, tolerance, dependence and withdrawal are four clocks on different scales,
  kept apart (ChatGPT's point, agreed). Tolerance is per **system**, so cross-tolerance follows the
  shared system (§6). Dependence is a need the crew engine may act on through the craving push; whether
  the character drinks is the engine's decision, read through `PSYCHOLOGY.md`, never this file's.
- **Visible face:** the sot who holds his rum; the shakes of the man kept from it on a dry passage; the
  surgeon's note that the dose "does nothing for him now"; the morning dram.

## 5. Functional circuits

<!-- table:neurology.circuits -->
*Functional circuits: from system tones to outputs the rest of the family reads* (model; confidence medium; source: A functional network, not neurons: each circuit reads the tones that drive it and emits one output on a 0 to 2 scale (1 = normal). The assignment of systems to circuits is textbook neuroscience simplified; the weights are the keeper's placeholders. Receptor activity is not behaviour (ChatGPT's caution, kept): every output is handed to an existing meter or attribute, never to a personality. NEU-CIRC)

| Circuit | Reads (systems, weight) | Output | Goes to | Visible face | Mark |
|---|---|---|---|---|---|
| Arousal | noradrenaline +0.4, histamine_orexin +0.2, acetylcholine +0.1, gaba -0.3, adenosine -0.3, opioid -0.2 | arousal 0 to 2: 1 normal, under 0.5 stupor, over 1.5 agitation | BODY: the alertness factor is min(PHYSIOLOGY alertness, arousal) on the head attributes and Reflexes; over 1.5 dips Dexterity (tremor) and sleep quality | nodding over the cards; the wide-awake lookout on coffee; the man who cannot sleep | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Motor control | gaba (smoothing, inverted U: both under 0.7 and over 1.3 impair), acetylcholine +0.2, dopamine +0.2 | coordination 0 to 1 | BODY: Dexterity and Agility x coordination; MUSCULAR: the pattern recruitment available today x coordination; the accident roll | the drunk's stagger; the delirious man's tremor; mercury's shaking hand | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Reward and habit | dopamine +0.6, opioid +0.3 | reward signal per event; habit strength per substance or act (learns what delivered the signal) | PSYCHOLOGY: mood push on the event; craving as a daily push toward the habit (the den, the bottle: Rex's gambling loop is a reward circuit already); dependence feeds it | the man who goes to the den every night; the one who needs his pipe | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Attention | acetylcholine +0.4, noradrenaline +0.3 (inverted U), dopamine +0.2, glutamate +0.2 | attention 0 to 2 | BODY: Perception, Pattern Recognition, Wits read x attention; skill learning rate (STATS 4) x attention | the drunk navigator's sight; the pipe that steadies the gunner (nicotine, small, real) | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Pain gating | opioid +0.6, noradrenaline +0.2, cannabinoid +0.2, serotonin +0.1 | pain relief 0 to 1 subtracted from MEDICINE's pain (laudanum -4 was this) | MEDICINE 4: effective pain = pain x (1 - relief); withdrawal makes relief negative (pain amplified) | the wounded man quiet after his dose; screaming without it | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Memory and learning | glutamate +0.5, acetylcholine +0.3, (alcohol over 0.08 g/dL blocks encoding: the blackout) | encoding 0 to 1 | the memories system (PIRATE 7: what the dialogue cards check) records an event only if encoding over 0.4; skill practice counts x encoding | 'I don't remember last night'; the lesson that did not take | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Breathing drive | opioid -0.6, gaba -0.3, alcohol (via gaba) -0.2, combined worse than either | respiratory drive 0 to 1 | MEDICINE: under 0.4 the overdose condition (stupor, slow breathing, death roll per hour; alcohol with laudanum is the classic: the 2017 study found the combination synergistic) | the man who cannot be woken | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Mood regulation | serotonin +0.4, noradrenaline +0.2, dopamine +0.2, gaba +0.1 | mood bias -1 to +1 per day | PSYCHOLOGY: a daily push on mood only; never on a slider directly (Rex: sliders move by how people treat them) | the sulk after the rum runs out | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Fear and stress | noradrenaline +0.5, gaba -0.3, serotonin -0.2 | fear reading for the day 0 to 2 | PSYCHOLOGY: the 'read as Fearful' state; COMBAT: Nerve checks x (2 - fear); the madness line lowered for the Turbulent (proposed) | the shakes before boarding; the rum that steadies them (gaba up: the real Dutch courage) | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Appetite | cannabinoid +0.3, histamine_orexin +0.3, serotonin -0.2, opioid (gut) -0.1, nicotine (acetylcholine) -0.2 | appetite modifier x0.5 to x1.5 | NUTRITION 4: the appetite state's 'state' factor | the smoker who skips his dinner; the drinker who eats nothing | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
| Sleep | adenosine +0.5, gaba +0.3, serotonin +0.2, noradrenaline -0.3, orexin -0.3 | sleep propensity and sleep quality | PHYSIOLOGY 3: a block's quality x sleep quality (rum: falls asleep fast, wakes at 3, quality x0.7; coffee at dusk x0.6; laudanum deep but not restful x0.8); PHYSIOLOGY keeps the debt | the snoring drunk who is worse in the morning | rex (the circuit and where its output goes, 2026-10-29); proposed (weights) |
<!-- /table -->

- **[model]** Eleven circuits read the summed tones and each emits one output on a plain scale, handed to
  one owner. Alcohol's old fixed effects (`NUTRITION.md` §7, `MEDICINE.md` §5) become circuit outputs:
  the stagger is motor control under gaba, the blackout is encoding under alcohol, Dutch courage is fear
  under gaba and reward, the morning after is sleep quality and the adenosine rebound. The rum ration
  that steadies a man before boarding is real and so is the accident on the yard after it.
- **Memory and learning** touches Rex's memories system only as a gate: an event is recorded if encoding
  is over the threshold; what is recorded stays the dialogue cards' business.

## 6. Interactions

<!-- table:library/neurology.interactions -->
*Several substances at once, and substances on a shifted baseline* (science; confidence medium; source: Shared systems add at the tone level, not as separate penalties (ChatGPT's requirement, kept); where two depressants hit breathing the human data show a synergistic fall (oxycodone -28% ventilation, +19% more with 1 g/L ethanol, Anesthesiology 2017; NEU-INT). The combination rule is the keeper's.)

| Rule | Formula or statement | Example | Mark |
|---|---|---|---|
| Tones add | tone_s = baseline_s + sum over substances (potency x occupancy x sensitivity_s); each circuit then reads the summed tones once. No substance carries a penalty of its own | rum and laudanum both raise gaba and opioid; the arousal circuit falls once, by the sum | rex (the rule, 2026-10-29); proposed (constants) |
| Depressant synergy on breathing | respiratory drive = product form: (1 - 0.6 opioidEffect) x (1 - 0.3 gabaEffect) x (1 - 0.2 alcoholEffect), then x0.8 if two or more depressants are over 0.3 occupancy | a dosed wounded man given rum for the pain: the overdose roll | rex (the rule, 2026-10-29); proposed (constants) |
| Stimulant masks depressant | arousal reads the sum, so coffee on rum raises arousal while motor control (gaba) stays impaired: the wide-awake drunk | the navigator who sobers up his head with coffee and not his hands | rex (the rule, 2026-10-29); proposed (constants) |
| Tolerance is per system, so cross-tolerance follows the system | a drinker's gaba sensitivity is low, so laudanum's gaba side does less for him, its opioid side the same | the sot who needs a double dose of the surgeon's draught to sleep | rex (the rule, 2026-10-29); proposed (constants) |
| A shifted baseline changes what a dose does | the same rum on a sleep-deprived, afraid man (noradrenaline high) reads as calm; on a rested man as stupor | Dutch courage on the eve of boarding | rex (the rule, 2026-10-29); proposed (constants) |
| Withdrawal plus a new substance | a dose during withdrawal fills the occupancy and the rebound falls at once (the relief that teaches the habit: reward circuit +) | the morning dram | rex (the rule, 2026-10-29); proposed (constants) |
| Poisons do not clear | mercury and lead are body burdens: tone shifts grow with burden and fade over months after exposure ends | the hatter's tremor; the dry gripes' palsy | rex (the rule, 2026-10-29); proposed (constants) |
<!-- /table -->

- **[science]** Opioid and alcohol together depress breathing more than either (ventilation −28% on
  oxycodone, a further −19% with 1 g/L ethanol; NEU-INT): the wounded man given rum for the pain after
  his laudanum is the period's overdose.
- **(proposed, outside AI; kept)** Substances add at the system level, never as separate penalties, and
  act on the shifted baseline of §2.

## 7. Outputs and what this file never writes

<!-- table:neurology.outputs -->
*What NEUROLOGY.md hands out (and what it never writes)* (model; confidence high; source: The ownership boundaries agreed before the file was written: neurology supplies signalling and functional outputs; PHYSIOLOGY keeps sleep debt; MEDICINE keeps pain and injuries; MUSCULAR keeps the movement patterns and their recruitment values; PSYCHOLOGY keeps behaviour and personality; BODY integrates.)

| Output | To | Replaces | Never | Mark |
|---|---|---|---|---|
| arousal, coordination, attention, encoding, fear reading, mood bias, appetite modifier, sleep quality, pain relief, respiratory drive | BODY 2 (the factors), PSYCHOLOGY 1 (pushes), NUTRITION 4, PHYSIOLOGY 3, MEDICINE 4 | the old drinkFactor and the fixed rum and laudanum effects in NUTRITION 7 and MEDICINE 5 (those rows now cite this file) | a personality slider, a memory's content, a decision | rex (the fence, 2026-10-29) |
| habit strength per substance; dependence; withdrawal state | PSYCHOLOGY (craving push, the slight if denied), MEDICINE (delirium, overdose as conditions), the story (a crew mate's habit as a trait) | the open 'habit as a system' in NUTRITION and PSYCHOLOGY | whether the character chooses to drink: that is the crew engine's, reading the push | rex (the fence, 2026-10-29) |
| the rule that moves MUSCULAR's recruitment values (practice x encoding x acetylcholine tone) | MUSCULAR 5a | nothing: MUSCULAR keeps the values | a second motor-control system | rex (the fence, 2026-10-29) |
| poison body burdens (mercury, lead) | MEDICINE (the dry gripes, erethism as conditions) | - | - | rex (the fence, 2026-10-29) |
<!-- /table -->

## 8. Where it reaches the rest of the family

| To | What | Replaces |
|---|---|---|
| `BODY.md` §2 | `arousal` into the alertness factor; `coordination` into Dexterity and Agility and the accident roll; `attention` into Perception, Pattern Recognition, Wits; `encoding` into skill practice | `drinkFactor` |
| `PHYSIOLOGY.md` §3 | sleep quality per block; adenosine as the mechanism under the debt | nothing (the debt table stays) |
| `MEDICINE.md` §4, §5 | pain relief subtracted from pain; respiratory drive and the overdose condition; delirium tremens; erethism; the dry gripes' nerve side | the fixed "laudanum −4 for 6 h" and "rum −2" (those rows now read this file) |
| `MUSCULAR.md` §5a | the rule that moves recruitment: practice × encoding × acetylcholine tone | nothing (values stay there) |
| `NUTRITION.md` §4, §7 | the appetite state factor; the boosts table's rum and coffee rows become outputs | the fixed rum and coffee rows |
| `PSYCHOLOGY.md` §1 | mood bias, fear reading, craving as pushes; the 'drunk' read-as state | the fixed drink rows |
| the story keeper | a crew mate's habit as a trait with a dependence number behind it; tagged substances' rows | - |

## Open for Rex

1. ~~The whole file: keep, cut, or stamp~~ stamped (Rex, 2026-10-29): the structure is canon, the
   numbers are placeholders for the simulator.
2. Whether a character's nervous baseline range is tied to the type or to the Assertive↔Turbulent slider.
3. Which substances exist in the game: the period list is the table's; hemp is open; tagged ones are the
   story keeper's rows.
4. How far dependence shows in play: a trait on the character sheet (hidden, like the rest), a slight if
   denied, a madness trigger for some.
5. Whether a drunk or dosed player character shows it on screen (the fiction side of hidden stats).
6. Every weight, EC50, time constant and threshold is a placeholder for the simulator.

## Sources

`../SOURCES.md` keys NEU-*: Rang and Dale and Kandel for the systems (standard references); Widmark
kinetics and alcohol variability; alcohol withdrawal and delirium tremens; opioid withdrawal timelines;
caffeine and adenosine; receptor desensitisation and downregulation recovery; the oxycodone–ethanol
ventilation study; erethism; London coffee houses and chocolate.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | Rex stamped the structure (systems, baseline, kinetics, the four clocks, circuits, the fence) as his; numbers placeholders; marks updated | Rex |
| 2026-10-29 | File opened on Rex's idea and ChatGPT's two notes (outside AI); systems (10), baseline drivers (14), kinetics for the period substances, the four clocks, circuits (11), interactions, outputs; tables in `data/neurology.json`; all proposed | keeper |
