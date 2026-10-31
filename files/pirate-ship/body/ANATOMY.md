# Anatomy: organs, tissues, damage and function, the species profile (body-and-world keeper, 2026-10-29)

Rex's question (2026-10-29): should organs be a reference point in the docs, so scurvy, heart failure and
other organ failures come out of the body rather than out of a rule? ChatGPT (outside AI) answered with
an organ layer under the existing systems and a blood simulator to connect them, and added three
requirements when Rex passed on the go-ahead: organ dependencies and failure cascades, tissue-level
mechanisms, and blood composition (the last in `CIRCULATION.md`). This file is the organ and tissue layer.
**(Rex, 2026-10-29)** Its structure is his decision: the organs with their inputs, outputs, dependencies
and cascades, the tissues, the damage-versus-function rule, the timescales and the species profile. The
biology is established at the level of one function number per organ and one integrity number per tissue;
**every constant is a placeholder** (Rex's words: "numbers still placeholders"). Open rows (pregnancy,
the fish-person's columns) stay open.

**The principle (ChatGPT's, agreed):** anatomy defines the structures → physiology, circulation and
neurology simulate their functions → medicine names the pathological states → `BODY.md` derives
capability. Diseases, injuries, nutrition and chemicals alter organs and tissues; the symptoms and the
limits follow from those changes. The purpose is to **replace** fixed effects elsewhere in the family with
causal organ and tissue interactions, not to add variables.

**Ownership.** This file owns the organ list, each organ's inputs, outputs, dependencies and cascades,
the tissues, the damage-versus-function rule, the timescales and the species profile. `CIRCULATION.md`
owns the blood and what it carries. `PHYSIOLOGY.md` keeps metabolism, thermoregulation, sleep and the
whole-body regulation it already has; `MEDICINE.md` keeps every disease name, course and treatment;
`NEUROLOGY.md` keeps the brain's signalling; `MUSCULAR.md` keeps muscle; `NUTRITION.md` keeps intake and
absorption. No organ applies a penalty of its own: `BODY.md` reads organ function through the deliveries.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `data/anatomy.json`.

## What Rex has decided that this file must respect

- **(Rex, 2026-10-29)** Organs as the reference point; a blood simulator; events like infarction and
  arrhythmia, which ChatGPT corrected to conditional events on the body's state (agreed; `CIRCULATION.md`
  §6).
- **(Rex, 2026-10-29)** Head and torso carry no stats of their own; a hit dips what they house. The organs
  live in the torso and head, so a torso wound reaches them through `CIRCULATION.md` (bleeding) and this
  file's organ injuries, and dips the stats Rex's table names, nothing else.
- **(Rex, 2026-10-26)** A lost eye halves Eyesight; a peg leg takes Agility.
- **(Rex, 2026-10-29)** States of being as profiles on the same architecture; the merfolk's form open.
  The species profile (§5) is that idea made a record.

## 1. The organs

<!-- table:anatomy.organs -->
*The organs: what each does, needs, gives, and what fails when it fails* (science; confidence medium; source: Standard physiology (Guyton and Hall; Boron and Boulpaep) folded to one function capacity per organ (ANA-ORG). Each organ carries function (0 to 1 today) and damage (0 to 1, lasting; sets the maximum function), per the damage-vs-function rule. Period diseases from MEDICINE.md. Dependencies name the organ whose output is this one's input, so a failure propagates by the cascade column (ChatGPT's requirement 1, outside AI).)

| Id | Organ | Function (science) | Inputs (from) | Outputs (to) | Depends on | What low function does (model) | Failure cascade (model) | Period diseases and injuries (MEDICINE) | Visible face | Mark |
|---|---|---|---|---|---|---|---|---|---|---|
| heart | Heart | pumps blood: cardiac output = stroke volume x rate | oxygen and glucose by its own coronary flow (CIRCULATION); potassium, calcium, magnesium in range; noradrenaline tone (NEUROLOGY) | cardiac output -> perfusion of every organ (CIRCULATION) | lungs (oxygen), kidneys (electrolytes), liver (fuel), nervous (rate) | cardiac output falls: aerobic capacity, the Endurance pool, breathlessness, cold hands; under 0.3 collapse | low output -> kidney perfusion down -> fluid retained, potassium up -> arrhythmia -> output lower (the heart-kidney loop); low output -> liver congested -> clotting down | the dropsy of heart failure; arrhythmia from electrolytes, hypoxia, drugs, scarred muscle; infarction in the old (CIRCULATION 6); a thrust to the chest | the man who cannot climb the shrouds without stopping; swollen ankles; the surgeon's hand on the pulse | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| lungs | Lungs | oxygen in, carbon dioxide out; the breathing drive is the brain's (NEUROLOGY) | air (ENVIRONMENT: altitude none; smoke, water); breathing drive; chest wall intact | arterial oxygen saturation -> CIRCULATION oxygen content | nervous (drive), heart (blood through them), chest wall (MEDICINE wounds) | saturation falls: aerobic capacity x, confusion under 0.85, blue lips under 0.75, unconscious under 0.6 | low oxygen -> heart strains and the brain fails -> breathing drive fails -> lower; drowning is this in minutes | consumption, pneumonia after a chill, influenza's chest; a thrust to the chest (collapsed lung); drowning; smoke of the gun deck | breathless; the cough; blue lips | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| liver | Liver | metabolism: clears alcohol (0.015 g/dL/h), drugs and poisons; stores glycogen; makes albumin and the clotting factors; bile for fat absorption | blood from the gut (nutrients, alcohol, drugs); oxygen | clotting factors -> CIRCULATION clotting; glucose from glycogen -> blood glucose; cleared toxins; bile -> gut fat absorption | gut (what arrives), heart (perfusion), nutrition (protein for its proteins) | alcohol clears slower (drunk longer: NEUROLOGY reads it); clotting down (bleeding class +1 on a wound); fat-soluble vitamins absorbed less; fluid in the belly (ascites) under 0.5; jaundice; confusion under 0.3 (toxins to the brain) | low function -> clotting down -> a wound bleeds more; -> glucose unstable -> brain; -> toxins up -> brain (hepatic encephalopathy) ; damage from years of rum (cirrhosis in 10 to 20 years over about 80 g a day) is permanent | the drinker's liver (cirrhosis, the dropsy of the belly), yellow fever's jaundice, malaria's spleen and liver, amoebic abscess, poisons | the yellow eye; the swollen belly; the drunk who stays drunk | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| kidneys | Kidneys | filter blood: water, sodium, potassium, waste; blood pressure's long arm; make the hormone that drives red cells | perfusion (CIRCULATION), water (NUTRITION), pressure | urine (water and salt out); electrolyte balance -> CIRCULATION; red-cell signal -> marrow | heart (perfusion), liver (albumin for pressure) | water and potassium retained: swelling, potassium up (arrhythmia, CIRCULATION); waste up: nausea, confusion; under 0.2 death in days | low perfusion (bleeding, dehydration, heart failure) -> function down -> potassium up -> arrhythmia -> perfusion lower; shock kidney (MEDICINE: dehydration over 6%) | the fluxes' dehydration, heat stroke, crush injury (muscle breakdown clogs them), mercury and lead, the stone | no water passed; swollen face; the surgeon tastes the urine (period practice) | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| stomach | Stomach | holds and starts digestion; the fullness signal (NUTRITION 4) | food and drink; acid; the vagus (NEUROLOGY) | chyme -> intestines; fullness -> NUTRITION | nervous (motility), liver (none) | slow emptying (opium, fear): fullness stays, appetite falls; vomiting with motion, poisons, the fluxes (water and salt lost: CIRCULATION) | vomiting -> dehydration -> kidneys -> electrolytes -> heart | seasickness, food poisoning, the drunkard's gastritis, a belly wound (usually fatal: MEDICINE) | at the lee rail | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| intestines | Intestines | absorb nutrients and water (NUTRITION 2a); the gut wall is the barrier against its own bacteria | chyme; bile (liver); pancreatic enzymes; intact lining (tissue) | absorbed nutrients and water -> CIRCULATION and NUTRITION pools | liver (bile), pancreas (enzymes), heart (perfusion), nervous (motility) | absorption x function (NUTRITION's flux rule is this); diarrhoea: water and potassium lost; a breached wall: sepsis (MEDICINE) | the flux -> absorption down and water out -> dehydration and potassium low -> kidneys and heart; a breached wall -> sepsis -> every organ | dysentery, typhoid, worms, cholera-like fluxes, a belly thrust, strangulated hernia | the bloody flux; the belly that will not take food | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| pancreas | Pancreas | enzymes for digestion; insulin and glucagon: blood glucose regulation | nutrients absorbed; perfusion | enzymes -> intestines; glucose regulation -> CIRCULATION chemistry | intestines, heart | fat and protein pass undigested (weight loss despite food); glucose swings (the sugar sickness: rare in the period diet, the fat merchant) | glucose high for years -> vessels and kidneys and nerves damaged (CIRCULATION atherosclerosis index up) | the sugar disease (diabetes, known to Willis 1674 by the sweet urine), pancreatitis of the heavy drinker | thirst and much water passed; wasting | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| brain | Brain | the nervous system's organ: everything NEUROLOGY.md does, plus consciousness and the head attributes' seat | oxygen and glucose (CIRCULATION: it fails first when either falls), temperature in range (PHYSIOLOGY), toxins cleared (liver, kidneys) | consciousness; the head attributes (BODY); the breathing drive; motor command (MUSCULAR patterns) | heart and lungs (oxygen), liver (glucose, toxins), kidneys (waste) | function falls with hypoxia, low glucose, heat over 40 C, toxins, concussion: confusion, then unconsciousness; damage (stroke, a blow, a fever's scarring) lasting | unconscious -> no breathing drive -> lungs -> heart; a blow -> swelling -> pressure -> death in days (the fractured skull MEDICINE trepans) | concussion, skull fracture, stroke (the old), fever's delirium, lead and mercury, the pox's late madness, heat stroke | the dazed man; fits; the one who does not wake | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| marrow | Bone marrow | makes red cells (120-day life), white cells, platelets | iron, folate, B12, protein (NUTRITION); the kidney's signal; intact bone (tissue) | red cells -> CIRCULATION haemoglobin (anaemia or not); white cells -> immune; platelets -> clotting | kidneys (signal), nutrition, liver (iron stores) | red cells not replaced: anaemia after blood loss recovers over weeks (a donation's worth in under 40 days) or not at all without iron; white cells low: infection; platelets low: bruising | anaemia -> oxygen delivery down -> every organ's function down a little, the heart working harder -> heart | the anaemia of hookworm, malaria, scurvy's bleeding, the fluxes; lead's anaemia | pallor; breathless on the stairs | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| spleen | Spleen | filters old red cells and parasites; holds a blood reserve; immune organ | blood | cleared parasites; a reserve volume released in shock | heart (perfusion) | little alone; enlarged in malaria (fragile: a blow ruptures it, fatal bleeding); removed, infections rise | rupture -> class IV haemorrhage | malaria's spleen, the ague cake; a blow to the left side | the swollen left side the surgeon feels | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| endocrine | Endocrine organs (adrenals, thyroid, gonads) | hormones: the stress response (adrenaline, cortisol), metabolic rate (thyroid), sex hormones | nervous signals (NEUROLOGY fear circuit), iodine (NUTRITION), perfusion | stress response -> CIRCULATION rate and pressure, glucose up; metabolic rate -> PHYSIOLOGY RMR; growth and reproduction (open) | brain, nutrition | a sluggish thyroid (iodine, inland): RMR down, cold, slow; adrenal exhaustion (fiction, not modelled); the stress response as a state that costs sleep and healing when it never ends | chronic stress -> sleep down, healing down, immune down (MEDICINE catch chances x1.3) | goitre (inland towns), the wasting of long fear, none the period could treat | the goitre; the man who cannot stop shaking after the siege | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| skin | Skin | the barrier; sweat (PHYSIOLOGY heat); vitamin D (sun); the first tissue a wound opens | collagen maintenance (vitamin C), perfusion, sun | barrier -> infection exposure (MEDICINE 6); sweat -> hydration; temperature sense | connective tissue, heart | breached: infection chances up; scurvy's fragile skin bruises; burns lose water (MEDICINE) | large burns -> fluid loss -> shock -> kidneys | burns, wounds, yaws, the pox's rash, sunburn, scurvy's bruises | the portrait's scars and sores (art keeper) | rex (the organ, its inputs, outputs, dependencies and cascade, 2026-10-29); proposed (numbers) |
| senses | Sense organs (eyes, ears, nose) | the head attributes' hardware: Eyesight, Hearing, Taste and smell | perfusion, vitamin A (night vision), intact structure | the senses -> BODY head attributes | brain, nutrition | night blindness (vitamin A); deafness from the guns (Hearing cap) and cinchonism; a lost eye halves Eyesight (Rex) | - | a lost eye, the gunner's deafness, trachoma, cataract in the old | the eye patch; 'speak up' | rex (lost eye halves Eyesight), proposed (the rest) |
| reproductive | Reproductive organs | fertility, pregnancy, the sex hormones' source | endocrine, nutrition | pregnancy and birth (POPULATION's births; a crew mate's pregnancy: open) | endocrine | sterility from the clap; pregnancy changes everything above for nine months | - | the pox and the clap; childbirth (a death risk of about 1 to 2% per birth in the period, POPULATION) | - | open (whether pregnancy exists for named characters is Rex's and the story keeper's) |
<!-- /table -->

- **[science]** Each row is textbook physiology folded to one function (ANA-ORG). The dependencies are
  real: the heart needs the lungs' oxygen and the kidneys' potassium; the kidneys need the heart's
  pressure; the liver makes the clotting the wounds need and clears the rum the brain feels; the marrow
  needs the kidney's signal and the gut's iron.
- **[model] Cascades (ChatGPT's requirement 1):** an organ's function today is the minimum of its input
  adequacies times its own health (§3), and its outputs are the next organ's inputs, so a failure
  propagates without a rule for each pair: low cardiac output → kidney perfusion down → potassium up →
  arrhythmia → output lower. The loops are closed by `CIRCULATION.md` §7's regulation, which is why a
  small insult corrects and a large one spirals.
- **[history]** The period saw organs through their failures: the dropsy (heart or liver), the yellow
  eye, the sweet urine Willis tasted in 1674, the ague cake of the spleen, the stone. The surgeon felt the
  pulse and the belly and tasted the urine; that is the visible face.
- **Mark:** **(proposed)** throughout; the lost eye **(Rex)**; pregnancy **(open)**.

## 1a. The respiratory profile (added 2026-10-29, the air layer)

<!-- table:library/anatomy.respiratory -->
*The respiratory profile (the lungs' interface to the air; per species)* (science; confidence medium; source: Gas transfer across the lung follows the partial-pressure gradient and the lung's diffusing capacity (Fick); ventilation, perfusion and diffusion each limit it (standard respiratory physiology, ATM-ALV). The profile fields are ChatGPT's list (outside AI), typed; the transfer formula is the model abstraction the brief names, not the full pulmonary equation.)

| Field | Human default | Unit | Changed by | Mark |
|---|---|---|---|---|
| medium | air | air \| water \| other | the species profile (ANATOMY 5); under water a human has none | rex (the row's structure, 2026-10-29); proposed (numbers) |
| structure | lungs | lungs \| gills \| skin \| other | species | rex (the row's structure, 2026-10-29); proposed (numbers) |
| ventilation capacity (maximal) | 100 to 150 at full effort (trained higher) | L/min | lung function x chest wall intact (MEDICINE chest wounds) x age | rex (the row's structure, 2026-10-29); proposed (numbers) |
| exchange capacity (diffusing capacity) | 25 at rest, 60 at effort | mL O2 per min per mmHg gradient | lung damage (pneumonia, smoke injury, consumption), fluid in the lungs (heart failure), age | rex (the row's structure, 2026-10-29); proposed (numbers) |
| airway resistance | 1.0 | relative | irritant gases (SO2, smoke) raise it: x2 to x5 during exposure; asthma (none modelled) | rex (the row's structure, 2026-10-29); proposed (numbers) |
| dead space | 150 | mL per breath | fixed | rex (the row's structure, 2026-10-29); proposed (numbers) |
| tissue integrity | 1.0 | 0 to 1 (ANATOMY lungs function and damage) | smoke and irritant injury (MEDICINE), infection, drowning | rex (the row's structure, 2026-10-29); proposed (numbers) |
| gas tolerances (species) | hypoxia under 16% O2; CO2 over 3% | thresholds | species profile (a diving mammal tolerates more CO2; open) | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Gas transfer (the model) | transfer = exchange capacity x (inspired-alveolar gradient after the alveolar gas equation); arterial PO2 follows alveolar PO2 less a 5 to 10 mmHg gradient in health, more with damage | mL/min | the whole row above | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Two failures told apart | not enough oxygen in the air (ATMOSPHERE: low fraction or low pressure) vs the lung failing to transfer it (damage, fluid, resistance): same saturation, different cure | - | - | rex (the row's structure, 2026-10-29); proposed (numbers) |
<!-- /table -->

- **[model]** The lungs' interface to `../world/ATMOSPHERE.md`: the air (or water) supplies inspired
  partial pressures; this profile transfers gas by its capacity and the gradient; `CIRCULATION.md` §1a
  carries the result. Two failures are told apart: not enough oxygen in the air, and a lung that cannot
  move it. The profile is a species-profile field (§5): a fish-person's gills are a row here.

## 2. The tissues

<!-- table:anatomy.tissues -->
*Tissues: the structures diseases and deficiencies actually act on (ChatGPT's requirement 2)* (science; confidence medium; source: Histology folded to functional tissue classes; scurvy as impaired collagen (vitamin C is the cofactor for collagen cross-linking), bone as a calcium and vitamin D store, endothelium as the vessel lining whose damage starts atherosclerosis and whose leak is inflammation. ANA-TIS. Each tissue has integrity (0 to 1) read by the organs built from it.)

| Tissue | Where | Maintained by (NUTRITION, PHYSIOLOGY) | Integrity falls with | What low integrity does | Owner of the effect | Mark |
|---|---|---|---|---|---|---|
| Connective tissue (collagen) | vessel walls, skin, gums, tendons, scars, bone matrix | vitamin C (collagen cross-linking), protein, zinc, copper | scurvy (vitamin C pool under 300 mg: integrity -0.02 a day), age, long starvation | vessels leak (bruises, bleeding gums), old scars open, wounds will not close (MEDICINE healing x3), tendons tear easier (MUSCULAR tolerance x0.7) | MEDICINE (scurvy condition reads this, no penalty of its own) | rex (the tissue and what it carries, 2026-10-29); proposed (rates) |
| Vascular endothelium | the lining of every vessel | nitric oxide tone; low lipids and pressure; no smoke | high blood lipids, high pressure, tobacco, the sugar sickness, age, inflammation | plaques form (CIRCULATION atherosclerosis index), clotting on damaged lining (thrombosis), leaking vessels (oedema) | CIRCULATION | rex (the tissue and what it carries, 2026-10-29); proposed (rates) |
| Bone | the skeleton; the marrow's house; the calcium store | calcium, vitamin D (sun), load (MUSCULAR: bones adapt to loading, the audit's bone adaptation) | no sun for months (rickets in children, soft bones), long starvation, age, scurvy (the matrix) | fractures from smaller falls (MEDICINE fracture chance x2 under 0.6); a fracture heals slower | MEDICINE | rex (the tissue and what it carries, 2026-10-29); proposed (rates) |
| Epithelium (skin and gut lining) | the outer skin, the gut wall, the airways | vitamin A, zinc, protein; turnover every few days | burns, the fluxes (gut lining stripped), vitamin A deficiency, scurvy | barrier breached: infection exposure up (MEDICINE 6 multipliers), absorption down (NUTRITION 2a), water lost | MEDICINE, NUTRITION | rex (the tissue and what it carries, 2026-10-29); proposed (rates) |
| Muscle | skeletal (MUSCULAR), the heart, the gut wall | protein, energy, oxygen | starvation (catabolised), disuse, crush, infarction (heart) | MUSCULAR's contractile; the heart's output; the gut's motility | MUSCULAR, ANATOMY heart | rex (the tissue and what it carries, 2026-10-29); proposed (rates) |
| Nervous tissue | brain, spinal cord, nerves | thiamin, B12, oxygen, glucose | thiamin and B12 deficiency (nerves), lead and mercury, hypoxia, a deep cut (a severed nerve: the limb's Dexterity capped) | NEUROLOGY's signalling capacity; a nerve cut is a permanent cap on that limb (MEDICINE wound table) | NEUROLOGY, MEDICINE | rex (the tissue and what it carries, 2026-10-29); proposed (rates) |
| Blood | the circulating tissue | marrow (cells), liver (proteins), water and salt | haemorrhage, anaemia, dehydration, poisons | CIRCULATION.md entirely | CIRCULATION | rex (the tissue and what it carries, 2026-10-29); proposed (rates) |
| Adipose (fat) | under the skin and around the organs | energy surplus (NUTRITION) | deficit | the reserve (NUTRITION fat mass); insulation (PHYSIOLOGY cold); in excess, lipids and pressure up (endothelium) | NUTRITION, PHYSIOLOGY, CIRCULATION | rex (the tissue and what it carries, 2026-10-29); proposed (rates) |
<!-- /table -->

- **[science]** Vitamin C is the cofactor for collagen cross-linking, so scurvy is a connective-tissue
  failure before it is anything else: vessels leak (bruises, the gums), old scars reopen, wounds will not
  close (ANA-TIS). Vitamin K makes the clotting factors the liver builds; vitamin A keeps the epithelium;
  thiamin and B12 keep nerves; calcium, vitamin D and load keep bone.
- **[model] (ChatGPT's requirement 2)** Each tissue has an integrity the organs built from it read. The
  scurvy condition in `MEDICINE.md` now **reads** connective integrity instead of carrying its own
  multipliers: healing ×3 and the reopening are what low collagen does to any wound; the bruises are what
  it does to vessels. The same for bone and fractures, epithelium and infection, nerves and a severed
  limb's control.
- **Mark:** **(proposed)**.

## 3. Damage versus function

<!-- table:library/anatomy.damage_function -->
*Damage versus function (ChatGPT's distinction, kept as the rule)* (model; confidence high; source: An organ can work badly today without lasting harm (a hangover's liver, a dehydrated kidney, a concussed brain), and chronic damage lowers the ceiling for good (cirrhosis, a scarred heart, lost nephrons). Two numbers per organ and tissue: function (today, 0 to 1) and damage (lasting, 0 to 1), with function never above (1 - damage).)

| Rule | Formula or statement | Example | Mark |
|---|---|---|---|
| Two numbers | function_today = min(1 - damage, f(inputs today)); damage only rises, except by slow repair where the tissue regenerates (liver yes, heart muscle no, nerves barely, kidney nephrons no) | the drinker's liver works at 0.6 the morning after and 1.0 by evening until the damage sets the ceiling at 0.5 | rex (the rule, 2026-10-29); proposed (rates) |
| Function from inputs | each organ's function today is the minimum of its input adequacies (perfusion, oxygen, fuel, electrolytes in range, temperature, toxins under threshold) x its own health | a kidney at full health with perfusion at 0.4 works at 0.4 | rex (the rule, 2026-10-29); proposed (rates) |
| Damage from insults | damage += insult x (1 - resistance), where insults are sustained low function (ischaemia: function under 0.3 for over an hour damages the heart, brain and kidneys), toxins over threshold for days (alcohol, lead, mercury), infection, trauma | a shock that lasts hours leaves kidney damage even after the volume is back | rex (the rule, 2026-10-29); proposed (rates) |
| Repair | damage -= repair rate while the insult is absent and NUTRITION's protein and energy allow: liver 0.01 a day, skin and gut lining 0.05, bone 0.005, heart and nerves 0, kidney 0.001 | months without rum give the liver some ceiling back; a scarred heart never | rex (the rule, 2026-10-29); proposed (rates) |
| What MEDICINE names | a condition is a pattern of function and damage (heart failure: heart function under 0.5 for days; cirrhosis: liver damage over 0.5); MEDICINE.md keeps the names, the courses and the treatments; ANATOMY and CIRCULATION keep the numbers | the dropsy is the name for the pattern, not a separate rule | rex (the rule, 2026-10-29); proposed (rates) |
| Capability | BODY.md reads organ function through CIRCULATION's deliveries (oxygen, fuel) and the brain's and senses' function; never an organ penalty of its own | one pathway per impairment, as before | rex (the rule, 2026-10-29); proposed (rates) |
<!-- /table -->

- **(proposed, outside AI; kept as the rule)** Two numbers per organ and tissue: function today, which
  the day's inputs set, and damage, which only rises except by the slow repair of tissues that can repair.
  The drinker's liver works badly the morning after and fully by evening until cirrhosis lowers its
  ceiling for good; a shock that lasts hours leaves kidney damage after the volume is back; a scarred
  heart never recovers.

## 3a. A failure is a crisis, not a death (Rex, 2026-10-29)

- **(Rex, 2026-10-29; ChatGPT's principle, taken)** An organ failure never means death by itself. It opens
  a **physiological crisis** whose outcome depends on severity (how far function fell), duration (the
  ischaemia clock), the organ's remaining capacity (1 − damage) and the treatment available
  (`MEDICINE.md` §5). Four outcomes, told apart: **temporary dysfunction** (function returns, no damage),
  **chronic disability** (damage caps the ceiling for good), **irreversible injury** (the organ is lost or
  near it), **death** (a vital organ under its floor for longer than the body survives). `MEDICINE.md`
  names the crisis; this file and `CIRCULATION.md` run it; the death roll is the last branch, never the
  first.
- **[model] (proposed)** death comes only from: brain function under 0.2 for over 10 minutes (no oxygen,
  no glucose, pressure, heat over 42 °C); heart output under 0.2 for over 5 minutes; both lungs under
  0.2 for over 5 minutes; liver or kidney function under 0.1 for days (toxins); or a bleed past class IV.
  Everything short of those is a crisis with the three other outcomes on the table. Organ crisis function
  floors are rows of the `crisis_floors` library table and are documented in
  `Toolchain/realism/gears/anatomy-crisis-floors.md`.

## 4. Timescales

<!-- table:library/anatomy.timescales -->
*Timescales: what updates when* (model; confidence high; source: Heartbeats and nerve signals are never simulated (ChatGPT's point, kept); acute circulation per combat turn or per minute in an emergency; organ function at events and at the overnight tick; damage and vessel disease daily; species life stages yearly.)

| Layer | Step | When | Mark |
|---|---|---|---|
| Acute circulation (volume, oxygen delivery, pressure, breathing) | per combat turn; per minute during bleeding, drowning, overdose, heat stroke | in a fight or an emergency only | rex (the layer and its step, 2026-10-29) |
| Kinetics (NEUROLOGY), glucose, electrolytes | per 10 minutes within the day | the day loop | rex (the layer and its step, 2026-10-29) |
| Organ function | recomputed on any input change and at the overnight tick | the day and the tick | rex (the layer and its step, 2026-10-29) |
| Damage, repair, atherosclerosis, cirrhosis, anaemia recovery | daily, at the tick | the tick | rex (the layer and its step, 2026-10-29) |
| Tissue integrity (collagen, bone, endothelium) | daily | the tick | rex (the layer and its step, 2026-10-29) |
| Aggregate populations (POPULATION) | none of this: a health index only | the batch | rex (the layer and its step, 2026-10-29) |
<!-- /table -->

## 5. The species profile

<!-- table:anatomy.species -->
*The species profile: what changes for a horse, a dog, a fish-person (the reusable engine)* (model; confidence medium; source: ChatGPT's point (outside AI), kept: the mechanisms (circulation, respiration, metabolism, repair, signalling) are shared; the anatomy and its parameters vary by species. The profile is a data record, not code. Rex's states of being (BODY.md 6) are species profiles of this kind; the merfolk's form and the fish-person's gills are rows here when the story keeper writes them.)

| Profile field | Human default | A horse (example) | A fish-person (Rex's form, open) | Mark |
|---|---|---|---|---|
| organs present | the list above | the same, plus a larger gut (hindgut fermenter); no gall bladder | gills beside or instead of lungs (open) | rex (the profile shape, 2026-10-29); proposed (the example values) |
| blood volume (mL/kg) | 70 | 80 | 70 (open) | rex (the profile shape, 2026-10-29); proposed (the example values) |
| resting cardiac output (L/min per kg) | 0.07 | 0.07 | open | rex (the profile shape, 2026-10-29); proposed (the example values) |
| maximum heart rate | 220 - age | 240 | open | rex (the profile shape, 2026-10-29); proposed (the example values) |
| body temperature set point (C) | 37 | 38 | the water's (open) | rex (the profile shape, 2026-10-29); proposed (the example values) |
| respiration medium | air | air | water (dries out of it: NUTRITION hydration inverted) | rex (the profile shape, 2026-10-29); proposed (the example values) |
| RMR formula | Mifflin-St Jeor (PHYSIOLOGY) | Kleiber's law 70 x kg^0.75 | open | rex (the profile shape, 2026-10-29); proposed (the example values) |
| diet and absorption | NUTRITION 2a | grass: cellulose digested in the hindgut; no vitamin C need (makes its own) | fish; open | rex (the profile shape, 2026-10-29); proposed (the example values) |
| muscle layout (MUSCULAR groups) | 31 groups | the equine set (a data task) | human plus swimming groups (open) | rex (the profile shape, 2026-10-29); proposed (the example values) |
| lifespan and ageing curves | PHYSIOLOGY 8 | 25 to 30 years | open | rex (the profile shape, 2026-10-29); proposed (the example values) |
| haemoglobin (g/dL) | circulation.quantities.haemoglobin | open | open | rex (the profile shape, 2026-10-29); proposed (the example values) |
| maximal ventilation (L/min) | anatomy.respiratory.ventilation-capacity-maximal | open | open | rex (the profile shape, 2026-10-29); proposed (the example values) |
| states of being | human | - | the profile is the state of being (BODY 6) | rex (the forms), proposed (the profile shape) |
<!-- /table -->

- **(proposed, outside AI; kept)** The mechanisms are shared; the anatomy and the parameters vary. A
  horse has the same loops with a bigger gut and no vitamin C need; a fish-person breathes water and dries
  out of it. Rex's states of being (`BODY.md` §6) are profiles of this shape, and the story keeper's rows
  for them land here. Nothing beyond the human default is filled in; the horse column is an example of
  the shape.
- **Mark:** **(proposed)**; the forms **(Rex)**; the merfolk's form **(open)**.

## 6. What this file replaces elsewhere (the point of it)

| Was | Now |
|---|---|
| `MEDICINE.md` healing modifiers for scurvy (×3, reopening) and the bleeding of scurvy as disease rows | connective-tissue integrity read by every wound and vessel (§2) |
| `MEDICINE.md` "Constitution resists sickness" as the only immune number | white cells and the inflammatory signal in `CIRCULATION.md`, immune function per organ (marrow, spleen), Constitution kept as Rex's hidden resistance on top |
| the anaemia note under iron in `NUTRITION.md` | marrow function, red cell mass and haemoglobin in `CIRCULATION.md`; oxygen delivery falls the way it really does |
| alcohol clearance as a fixed rate in `NEUROLOGY.md` | the liver's function × 0.015 g/dL per hour; a damaged liver clears slower |
| the dehydration and sodium thresholds in `PHYSIOLOGY.md` §5a and `NUTRITION.md` §6 | plasma volume, sodium and the kidney loop in `CIRCULATION.md`; the thresholds stay as the faces |
| heat stroke, hypothermia and the fluxes damaging "the body" | the kidneys, brain and gut they damage, with the ischaemia clock |
| "a crew mate dies of heart failure" as a story event | a conditional chain on the heart's damage, the index and the day's triggers (`CIRCULATION.md` §6) |

Each replacement keeps the old number as the **face** or the **placeholder** and moves the cause under
it; the belt's job when the rules stand is to delete the old constants.

## 7. What this file hands to the others

| To | What |
|---|---|
| `CIRCULATION.md` | organ functions it needs (heart, lungs, liver, kidneys, marrow, spleen); the endothelium's integrity |
| `MEDICINE.md` | organ and tissue states to name as conditions; organ injuries from wounds (a thrust to the chest, the belly, the spleen) |
| `NEUROLOGY.md` | liver function for clearance; brain function as its ceiling |
| `NUTRITION.md` | gut and liver function for absorption and bile; pancreas for glucose |
| `PHYSIOLOGY.md` | lungs and heart for aerobic capacity (through `CIRCULATION.md`); endocrine for RMR; skin for sweat |
| `MUSCULAR.md` | bone and tendon integrity as caps; muscle tissue as the heart's and gut's |
| `BODY.md` | brain and sense function for the head attributes; everything else through `CIRCULATION.md`'s deliveries |
| `POPULATION.md`, the story keeper | the species profile shape for any creature; pregnancy and birth (open) |

## Open for Rex

1. ~~The whole file: keep, cut, or stamp~~ stamped (Rex, 2026-10-29): structure canon, numbers placeholders.
2. Pregnancy and birth for named characters (the reproductive row; the story keeper's with you).
3. ~~Which organ failures the game shows at all~~ decided **(Rex, 2026-10-29)**: the sim models every
   organ failure the biology here supports; only a subset gets its own dialogue, art or treatment (the
   story, art and medicine lanes pick which). ChatGPT's recommendation, taken by Rex.
4. Species beyond the human profile: horses, dogs, the fish-person's gills; who writes their rows.
5. Every constant is a placeholder for the simulator.

## Sources

`../SOURCES.md` keys ANA-*: Guyton and Hall and Boron and Boulpaep for the organs (standard references);
histology for the tissues; Willis 1674 on the sweet urine; alcoholic liver disease thresholds (about 80 g
a day over 10 to 20 years; 5 to 40 years range).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | Rex: every organ failure the biology supports is simulated (a subset gets bespoke content); a failure is a crisis with four outcomes, never a death by itself (§3a) | Rex |
| 2026-10-29 | Rex stamped the structure as his; numbers placeholders; marks updated | Rex |
| 2026-10-29 | File opened on Rex's organ question and ChatGPT's two notes (outside AI) with its three requirements; organs (14), tissues (8), damage versus function, timescales, the species profile, the replacement table; all proposed | keeper |
