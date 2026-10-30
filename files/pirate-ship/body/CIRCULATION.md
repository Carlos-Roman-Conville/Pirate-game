# Circulation: the blood, oxygen delivery, pressure, clotting, chemistry, cardiac events (body-and-world keeper, 2026-10-29)

Rex's blood simulator (2026-10-29), written on ChatGPT's shape (outside AI) with its third requirement:
blood composition and transport distinguished (plasma, red cells, haemoglobin, platelets, clotting
factors) alongside oxygen delivery, perfusion and fluid balance, so that anaemia, dehydration, haemorrhage
and clotting disorders are different problems with different cures. **(Rex, 2026-10-29)** The structure is his decision: the quantities, the bleeding classes' reading, the
three delivery failures, the events and their preconditions, the regulation loops. The values are
textbook; **every chance, threshold and time constant is a placeholder** (Rex's words: "numbers still
placeholders").

**Why blood is the connector.** Every organ in `ANATOMY.md` needs what the blood brings (oxygen, fuel,
water, salts, hormones, the immune cells) and gives what it carries away. One set of quantities, read by
every organ's function, replaces the separate fixed hooks the family carried: the blood volume and ATLS
classes from `MEDICINE.md` (moved here), the aerobic capacity of `PHYSIOLOGY.md` (now oxygen delivery at
maximal output), the hydration and sodium thresholds (now plasma volume and the kidney loop), the fixed
alcohol clearance (now the liver's), and the anaemia note (now red cell mass).

**Ownership.** This file owns the quantities, oxygen delivery, pressure and perfusion, clotting, the
electrolytes and chemistry, the bleeding classes, the three delivery failures, the conditional cardiac
events and the regulation loops. `ANATOMY.md` owns the organs whose function it reads and feeds.
`MEDICINE.md` names the conditions (shock, heart failure, anaemia, the dropsy) and keeps wounds, pain
and treatment. `PHYSIOLOGY.md` keeps the Banister fitness that sets maximal cardiac output and the heat
and cold models that drive sweat and skin perfusion. `NEUROLOGY.md` sets heart rate tone and breathing
drive. `BODY.md` reads the deliveries.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `data/circulation.json`.

**Clock.** Acute circulation per combat turn or per minute in an emergency (bleeding, drowning,
overdose, heat stroke); the chemistry every ten minutes; the slow quantities (red cell mass, the
atherosclerosis index, damage) daily at the tick (`ANATOMY.md` §4).

## What Rex has decided that this file must respect

- **(Rex, 2026-10-29)** A blood simulator; infarction and arrhythmia as events (conditional, per
  ChatGPT's correction, which Rex passed on).
- **(Rex, 2026-10-29)** A torso hit drains the Endurance pool (bleeding) and dips Constitution; nothing
  else of the torso carries a stat. Bleeding here is that drain's mechanism.
- **(Rex, 2026-10-29)** Endurance is the pool; Efficiency the spend. Oxygen delivery at maximal output is
  what sets the pool's ceiling through `PHYSIOLOGY.md` §6 and `BODY.md` §3; the spend is untouched.
- **(Rex, 2026-10-29)** Nutrition is real: iron, folate, B12, vitamin K, salt, potassium, water reach
  the blood through `NUTRITION.md`'s pools, never as a separate rule here.

## 1. The quantities

<!-- table:library/circulation.quantities -->
*The blood: composition and transport quantities (ChatGPT's requirement 3)* (science; confidence high; source: Standard values: blood volume about 70 mL/kg (men) 65 (women); haematocrit about 45% red cells, 55% plasma; haemoglobin 13.5 to 17.5 g/dL men, 12 to 15.5 women; each gram carries 1.34 mL oxygen; arterial content about 20 mL/dL; resting cardiac output about 5 L/min (stroke volume 70 mL x 70 beats), maximum 20 to 25 in the trained; oxygen delivery DO2 = CO x CaO2 x 10, about 1,000 mL/min at rest; platelets 150 to 400 x10^9/L; sodium 135 to 145 mmol/L, potassium 3.5 to 5.0, calcium 2.2 to 2.6; glucose 4 to 6 mmol/L fasting; pH 7.35 to 7.45. CIR-DO2, CIR-ELEC)

| Quantity | Normal (70 kg man) | Unit | Made or set by | Lost or moved by | What it drives | Mark |
|---|---|---|---|---|---|---|
| Blood volume | 4,900 (70 mL/kg) | mL | water intake (NUTRITION), kidneys (retention), albumin (liver) | haemorrhage (MEDICINE wounds), sweat and the fluxes (dehydration), burns | pressure, perfusion, the shock classes | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Plasma volume | 2,700 (55%) | mL | water and salt balance | dehydration first; haemorrhage with the cells | the part dehydration takes | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Red cell mass | 2,200 (45%, haematocrit) | mL | marrow (iron, folate, B12, protein; the kidney's signal); 120-day life | haemorrhage; malaria (cells burst); hookworm (slow loss); lead | haemoglobin | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Haemoglobin | 15 (men), 13.5 (women) | g/dL | red cell mass / blood volume | as red cells; dilution by fluids | oxygen content: CaO2 = 1.34 x Hb x SaO2 (+ a little dissolved) | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Arterial oxygen saturation | 0.97 | fraction | lungs (ANATOMY) | lung failure, drowning, smoke, opioid breathing depression (NEUROLOGY) | oxygen content | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Cardiac output | 5 at rest; up to 20 to 25 at maximal work (trained), 15 (untrained) | L/min | heart function (ANATOMY) x stroke volume x rate; rate by NEUROLOGY tone and demand | heart failure, low volume (less return), arrhythmia | perfusion and oxygen delivery | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Oxygen delivery (DO2) | about 1,000 at rest; 4,000+ at maximal work | mL/min | CO x CaO2 x 10 | any of the above | every organ's oxygen adequacy; PHYSIOLOGY's aerobic_today is this at maximal CO | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Mean arterial pressure | 90 | mmHg | CO x vascular resistance; the kidneys long-term | haemorrhage, dehydration, sepsis (vessels open), heart failure | perfusion: organs fail under about 60; the brain faints under 50 | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Perfusion (per organ) | 1.0 | fraction of normal flow | pressure and the organ's own vessels (plaques narrow them) | pressure down, plaque, clot, cold (skin shuts down to save heat) | each organ's function (ANATOMY) | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Platelets | 250 | x10^9/L | marrow | bleeding (consumed), sepsis, some poisons | clotting speed with the factors | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Clotting factors | 1.0 | fraction of normal | liver (needs vitamin K: NUTRITION) | liver failure, vitamin K deficiency, massive bleeding (consumed), dilution | a wound's bleeding rate x (2 - clotting); under 0.3 class +1 on every wound | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Sodium | 140 | mmol/L | intake and kidneys | sweat and the fluxes (lost), water excess (diluted) | under 125: confusion, fits; over 150: thirst, confusion (the seawater drinker) | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Potassium | 4.0 | mmol/L | intake (NUTRITION) and kidneys | the fluxes and vomiting (lost: under 3.0 weakness and arrhythmia); kidney failure and crush (retained: over 6.0 arrhythmia, over 7 arrest) | the heart's rhythm; muscle weakness | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Calcium, magnesium | 2.4; 0.8 | mmol/L | diet, bone, kidneys | deficiency (NUTRITION), the fluxes | cramps, tetany, arrhythmia at the extremes | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Glucose | 5 | mmol/L | liver (glycogen), gut (meals), pancreas (insulin, glucagon) | starvation, hard work with glycogen gone, drink on an empty stomach (the liver busy with alcohol) | the brain fails first: under 3 confusion, under 2 unconscious (the drunk who collapses after a day without food) | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| pH and lactate | 7.40; under 2 | -; mmol/L | lungs (CO2) and kidneys | maximal work (lactate up: the burn, part of the Endurance pool's floor), shock, kidney failure | under 7.2 the heart weakens | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| White cells and inflammatory signals | 7; 0 | x10^9/L; index | marrow; infection and injury raise the signal | sepsis (exhausted), starvation, lead | MEDICINE's catch chances x (2 - immuneFunction); fever is the signal's face; chronic inflammation feeds the endothelium's damage | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
| Blood lipids (cholesterol, fats) | normal | index | diet (NUTRITION fat and energy surplus), liver, age | - | the atherosclerosis index (events table) | rex (the quantity and what it drives, 2026-10-29); proposed (values as placeholders) |
<!-- /table -->

- **[science]** CIR-DO2, CIR-ELEC. The two formulas the file runs on:

      CaO2 = 1.34 × Hb × SaO2 (+ 0.003 × PaO2)       mL O₂ per dL
      DO2  = CO × CaO2 × 10                             mL O₂ per minute   (about 1,000 at rest)

  and `MAP = CO × resistance`, with each organ's perfusion a share of the flow at that pressure, narrowed
  by its own vessels' plaque.
- **[model]** `PHYSIOLOGY.md`'s `aerobic_today` is DO2 at this character's maximal cardiac output
  (Banister fitness sets the maximum; the heart's function and damage cap it; haemoglobin scales it), so
  anaemia, heart failure and lung disease all lower endurance through one number instead of three
  penalties.

## 1a. Blood gases (added 2026-10-29, the air layer)

<!-- table:library/circulation.blood_gas -->
*Blood gases: oxygen binding, carbon dioxide, carbon monoxide, acid-base* (science; confidence high; source: Severinghaus 1979: SaO2 = 1 / (1 + 23400 / (PaO2^3 + 150 PaO2)) (P50 about 26.8 mmHg at pH 7.4, 37 C; the curve shifts right with acidosis, fever and CO2, left with alkalosis, cold and carbon monoxide); carboxyhaemoglobin by the Coburn-Forster-Kane model, simplified here to a first-order approach to equilibrium with a 4 to 6 h half-life in air (CIR-SEV, CHM-CO); CO2 carried as bicarbonate, pH by Henderson-Hasselbalch (standard).)

| Quantity | Formula or rule | Normal | Fails when | Mark |
|---|---|---|---|---|
| Arterial PO2 | alveolar PO2 (ANATOMY 1a) minus the gradient | 95 mmHg at sea level | low inspired oxygen; lung transfer failing | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Saturation SaO2 | Severinghaus: 1 / (1 + 23400 / (PaO2^3 + 150 PaO2)); shifted by pH, temperature and CO2 | 0.97 | under 0.90 breathless and dull; 0.80 confused, blue; 0.70 unconscious; under 0.60 death in minutes | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Carboxyhaemoglobin COHb | dCOHb/dt = (COHb_eq - COHb) x ln2 / t_half, COHb_eq about 0.16 x ppm / 100 (an approximation valid to a few thousand ppm), t_half 5 h in air (uptake faster at work: x VE/6) | under 3% (smokers 3 to 10%) | 10 to 20% headache and nausea; 20 to 30% drowsy, ataxic, impaired; 30 to 50% seizures, unconscious, the heart starves; over 50% death. Oxygen content falls by the COHb share and the curve shifts left (the rest is held tighter): worse than the same loss of haemoglobin | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Oxygen content with CO | CaO2 = 1.34 x Hb x (1 - COHb) x SaO2 + dissolved | 20 mL/dL | the pulse and the colour look normal (cherry pink): the surgeon cannot tell | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Arterial PCO2 | set by ventilation against production: PaCO2 = 0.863 x VCO2 / alveolar ventilation | 40 mmHg | over 50 drowsy, over 70 narcosis; under 30 (panic, hyperventilation) tingling and faintness | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Acid-base | pH from bicarbonate and PaCO2 (Henderson-Hasselbalch); respiratory acidosis with CO2 retention, alkalosis with over-breathing; metabolic acidosis from shock and lactate (CIRCULATION 1) | 7.40 | under 7.2 the heart weakens; over 7.6 tetany | rex (the row's structure, 2026-10-29); proposed (numbers) |
| Hydrogen sulphide | not a blood-gas problem: it poisons the cells' use of oxygen (cytochrome oxidase) like cyanide; blood looks oxygenated while the tissues starve | 0 | over 500 ppm collapse in a breath | rex (the row's structure, 2026-10-29); proposed (numbers) |
<!-- /table -->

- **[science]** Saturation follows the Severinghaus curve from arterial PO₂; carbon monoxide takes
  haemoglobin out of service and holds the rest tighter, so the same number of red cells carry less and
  release less, with a normal pulse and a pink colour the surgeon cannot read (CIR-SEV, CHM-CO). Hydrogen
  sulphide is not a blood problem at all: it stops the cells using the oxygen that arrives.
- **[model]** The dashboard's respiratory calculator runs this table: pressure, mixture and exposure
  time to saturation, carboxyhaemoglobin and the symptom tier.

## 2. Bleeding (moved from `MEDICINE.md` §3)

<!-- table:library/circulation.bleeding -->
*Blood loss classes (moved here from MEDICINE.md; ATLS teaching values) and the sim's reading* (science; confidence high; source: ATLS classes of haemorrhagic shock (teaching values; the current manual gives trends). The class is read from cumulative loss as a fraction of blood volume; loss grows by the wound's rate x elapsed minutes x (2 - clotting), stops when bound or ligated. MED-ATLS)

| Class | Loss (% of blood volume) | Loss for a 70 kg man (mL) | Signs | Pressure and perfusion (model) | Organ consequences (ANATOMY) | Death risk per hour at this loss, untreated (placeholder) | Mark |
|---|---|---|---|---|---|---|---|
| I | up to 15 | up to 750 | pulse under 100; little change | pressure held by vessel tightening; perfusion 1.0 | none | 0 | rex (the class and its reading, 2026-10-29); proposed (the death risks) |
| II | 15 to 30 | 750 to 1500 | pulse 100 to 120; anxious; pale; cold hands | pressure held, skin and gut perfusion 0.6 | kidneys 0.8; the Endurance pool x0.8 (BODY) | 1% | rex (the class and its reading, 2026-10-29); proposed (the death risks) |
| III | 30 to 40 | 1500 to 2000 | pulse 120 to 140; pressure falls; confused | MAP 65; brain 0.8, kidneys 0.5, gut 0.3 | confusion (Wits x0.7); kidney damage begins after an hour; collapse risk per turn | 10% | rex (the class and its reading, 2026-10-29); proposed (the death risks) |
| IV | over 40 | over 2000 | pulse over 140; unconscious | MAP under 50; brain 0.5 | unconscious; the heart fails as volume falls; dying (COMBAT 4 wound ladder) | 50% | rex (the class and its reading, 2026-10-29); proposed (the death risks) |
<!-- /table -->

- **[model]** Loss accrues by the wound's rate (the `MEDICINE.md` wound table) × elapsed minutes ×
  (2 − clotting); binding or ligature stops it. The class is read from cumulative loss over blood volume.
  Volume refills from drinking within a day; red cells return over weeks as the marrow works
  (`ANATOMY.md` marrow, with iron), so a man who bled a class III is pale and breathless for a month even
  with the wound closed.
- **(Rex)** The torso rule: the Endurance pool drains with class; Constitution dips. `MEDICINE.md` §3
  keeps infection, shock as a named state and sepsis; this file keeps the blood.

## 3. Three ways delivery fails

<!-- table:circulation.delivery_failures -->
*Three ways oxygen delivery fails, told apart (anaemia, haemorrhage, dehydration) and what fixes each* (science; confidence high; source: DO2 = CO x 1.34 x Hb x SaO2 x 10: each failure takes a different term. Treatment differs: iron and food for anaemia (weeks), stopping the bleeding and fluids for haemorrhage (the period had no transfusion: fluids by mouth, rest, and the marrow's weeks), water and salt for dehydration (hours). CIR-DO2)

| Failure | Volume | Haemoglobin | Cardiac output | DO2 (rest) | Face | What helps | Recovery | Mark |
|---|---|---|---|---|---|---|---|---|
| Anaemia (iron, folate, B12, hookworm, malaria) | normal | 8 (half) | up to 7 (the heart compensates) | about 700: fine at rest, breathless at work; aerobic x0.6 | pallor, breathless on the rigging, a racing heart | iron (haem iron absorbs best: NUTRITION 2a), food, treating the cause | weeks to months as the marrow rebuilds (a donation's worth in under 40 days with iron) | rex (the distinction, 2026-10-29); proposed (numbers) |
| Haemorrhage (a wound) | down (class II to IV) | normal at first, then falls as fluid refills the volume | down (less return); then up (compensating) | falls with volume: shock | pale, cold, fast pulse, confusion | bind the wound; fluids by mouth; rest; the marrow | volume in days (water), cells in weeks (iron) | rex (the distinction, 2026-10-29); proposed (numbers) |
| Dehydration (sweat, the fluxes) | plasma down | rises (concentrated) | down (thick blood, less return) | falls with volume | thirst, dark urine, dizziness, cramps (salt), collapse in heat | water and salt (hours) | hours | rex (the distinction, 2026-10-29); proposed (numbers) |
| Lung failure (drowning, pneumonia, opioid breathing) | normal | normal | normal then down | saturation down: delivery falls regardless of blood | blue lips, gasping, confusion | air; the cause | minutes (drowning) to weeks (pneumonia) | rex (the distinction, 2026-10-29); proposed (numbers) |
| Heart failure | normal or up (retained) | normal | down | falls | breathless lying down, swollen ankles, the dropsy | rest; the period could do little | chronic; damage permanent | rex (the distinction, 2026-10-29); proposed (numbers) |
<!-- /table -->

- **[science]** Each failure takes a different term of DO2, which is why the cures differ: iron and weeks
  for anaemia, binding and water and weeks for a haemorrhage, water and salt and hours for dehydration,
  air for the lungs. The period could not transfuse; what it could do (fluids by mouth, rest, iron as
  "steel wine" by luck, limes against the bleeding of scurvy) is in `MEDICINE.md` §5.
- **Visible face:** the surgeon's three words for pallor (bloodless, thin-blooded, dried out) now mean
  three different things in the sim.

## 4. Clotting

- **[science]** Clotting needs platelets (marrow) and the factors the liver makes with vitamin K
  (`NUTRITION.md`); massive bleeding consumes both; sepsis and some poisons destroy platelets.
- **[model]** `clotting` (0–1) multiplies every wound's bleeding time: a wound bleeds at its rate ×
  (2 − clotting); under 0.3 every wound reads one class worse; under 0.1 a bruise is a haematoma and the
  gums bleed on their own (scurvy's vessels do the same from the other side: `ANATOMY.md` §2 collagen).
  Vitamin K deficiency (no greens, a purged gut, weeks) and liver failure are the period's routes to it.
- **Visible face:** the wound that will not stop; bruises that come from nothing.

## 5. Electrolytes and chemistry

- **[science]** Sodium under 125 and over 150, potassium under 3.0 and over 6.0, glucose under 3, pH
  under 7.2 are where the brain and heart fail (CIR-ELEC; thresholds vary by source and are placeholders
  here). The fluxes, vomiting and sweat lose water and salts; kidney failure and crush injuries retain
  potassium; a day without food after drink drops glucose because the liver is busy with the alcohol.
- **[model]** Each is a pool with intake (`NUTRITION.md`), loss (sweat, the fluxes, urine) and the
  kidney's regulation (§7); the organ that fails names the face: confusion (brain), arrhythmia (heart),
  cramps and weakness (muscle).
- **Visible face:** cramps at the capstan, the confused man after three days of the flux, the drunk who
  faints at noon having eaten nothing.

## 6. Conditional cardiovascular events

<!-- table:circulation.events -->
*Conditional cardiovascular events (never a random roll on a healthy body)* (science; confidence medium; source: Atherosclerosis develops over years (lipids, pressure, tobacco, the sugar sickness, age, inflammation damaging the endothelium); infarction follows plaque rupture or erosion with a clot blocking coronary flow (CIR-MI); arrhythmias follow electrolyte disturbance (potassium under 3.0 or over 6.0), hypoxia, drugs (NEUROLOGY: alcohol withdrawal, stimulants, quinine at high dose), scarred heart muscle; sudden death in a young crew is rare and usually structural (the one with the hidden heart). The chance formulas are placeholders; the shape is the clinical one. Rex, 2026-10-29: named characters are vulnerable to these events; all the events the biology supports are in; a failure is a crisis, never a death by itself (ANATOMY 3a).)

| Event | Precondition (the state it needs) | Daily or per-event chance (placeholder) | What happens | Damage | Visible face | Mark |
|---|---|---|---|---|---|---|
| Atherosclerosis (the index) | none: it accrues | index += 0.0001 x (lipids + pressure + tobacco x2 + sugar sickness x2 + inflammation) x ageFactor (x0.2 under 30, x1 at 50, x2 at 70) a day | coronary and other vessels narrow: perfusion of the heart, brain, legs falls with the index; the brain's small vessels | the index is damage: it only rises | the old captain's angina on the stairs; the merchant's short breath | rex (the event and its precondition, 2026-10-29); proposed (the chances) |
| Angina | index over 0.5 and demand over supply (hard work, cold, fear) | per hard-work event: index x 0.2 | chest pain, work stopped; no damage if it stops | none | the hand to the chest; sits down | rex (the event and its precondition, 2026-10-29); proposed (the chances) |
| Myocardial infarction | index over 0.4 (a plaque to rupture); triggers: a maximal effort, cold, fear, a clot-prone state (dehydration, tobacco, inflammation) | per day: index^2 x 0.001, x5 on a trigger day; near zero under 35 with no index | a clot blocks coronary flow: heart function falls at once (0.3 to 0.6 by size); pain 8; a death roll in the first hours (arrhythmia): 30% untreated in the period (no treatment existed) | heart damage += 0.2 to 0.5 (permanent: scarred muscle); heart failure follows at damage over 0.5 | collapse clutching the chest; the surgeon bleeds him (useless); 'a fit of the heart' | rex (the event and its precondition, 2026-10-29); proposed (the chances) |
| Arrhythmia | potassium under 3.0 or over 6.0; magnesium low; hypoxia (saturation under 0.8); drugs (withdrawal, high-dose bark, stimulants); heart damage over 0.3; fever over 40 | per hour while the precondition holds: 2% (electrolytes), 5% (potassium over 7), 1% (drugs), 3% (damage) | cardiac output falls to 0.3 to 0.7 for minutes to hours (palpitations, faintness); the fatal kind (fibrillation) at potassium over 7, infarction, or damage over 0.6: a death roll 20% | none unless prolonged | palpitations; fainting at the pump | rex (the event and its precondition, 2026-10-29); proposed (the chances) |
| Heart failure | heart damage over 0.5, or function under 0.5 for days (beriberi's wet heart, the drinker's heart, a scarred heart) | a state, not a roll | output down for good: aerobic x0.5, fluid retained (the dropsy), breathless lying down | progressive | swollen legs and belly; sleeps sitting up | rex (the event and its precondition, 2026-10-29); proposed (the chances) |
| Stroke | atherosclerosis index over 0.5 or a clot from an arrhythmia or pressure very high; age | per day: index^2 x 0.0005 | a brain region loses perfusion: the head attributes or one side's limbs capped (MEDICINE: a permanent cap), speech | brain damage permanent | the dropped face; the useless arm | rex (the event and its precondition, 2026-10-29); proposed (the chances) |
| Thrombosis and embolism | clot-prone states: immobility (a splinted leg for weeks), dehydration, injury, sepsis, the pox's late vessels | per day immobile: 0.5% | a clot in the leg (swelling, pain) that may travel to the lungs (sudden breathlessness, a death roll 10%) | lung damage if survived | the swollen leg after the fracture; the sudden collapse | rex (the event and its precondition, 2026-10-29); proposed (the chances) |
| Shock (circulatory) | volume loss class III+, sepsis (vessels open), heart failure acute, a bad burn, anaphylaxis (fiction, rare) | a state | pressure under 60: every organ's perfusion falls; the ischaemia clock damages kidneys, brain, heart after an hour | by duration | cold, grey, confused, no urine | rex (the event and its precondition, 2026-10-29); proposed (the chances) |
<!-- /table -->

- **[science]** Rex's picture of fat clogging an artery is corrected to the real course: lipids,
  pressure, tobacco, the sugar sickness, age and inflammation damage the vessel lining over years; a
  plaque ruptures or erodes; a clot forms and blocks the flow; heart muscle dies downstream (CIR-MI).
  Arrhythmias come from electrolytes, hypoxia, drugs and scarred muscle, never from nothing. Sudden death
  in a young crew is rare and structural.
- **[model]** Every event has a **precondition** on the body's state and a chance that is near zero
  without it. A healthy twenty-five-year-old topman does not have a heart attack; the sixty-year-old
  captain with forty years of pipe and pork and an index over 0.5 may, on a cold morning hauling with the
  crew. The young crew's cardiac deaths are the arrhythmias of potassium (the flux, the crush), of
  withdrawal, of high-dose bark and of drowning, which the family already produces.
- **[history]** The period called it a fit, an apoplexy (stroke), a palsy; it bled the patient, which
  helped nothing; the dropsy was the end of heart failure and of the drinker's liver alike.
- **Visible face:** the captain's hand on his chest on the stairs; the fall at the pump; the dropped face;
  the surgeon's useless lancet.

## 7. Regulation loops

<!-- table:library/circulation.homeostasis -->
*Regulation loops the circulation runs (the feedback the audit asked for)* (science; confidence high; source: Baroreflex (pressure down: rate and resistance up within seconds), the kidney's long-term pressure and volume control (hours to days), the kidney's red-cell signal (days to weeks), glucose by insulin and glucagon (minutes), temperature by skin perfusion and sweat (PHYSIOLOGY), acid-base by breathing and kidneys. Each loop is a target, a sensor and a correction with a time constant; the organs that run them must have function for the loop to work.)

| Loop | Target | Corrects by | Time constant | Fails when | Mark |
|---|---|---|---|---|---|
| Baroreflex | MAP 90 | heart rate and vessel tone (NEUROLOGY noradrenaline) | seconds | volume too low to compensate (class III+), nervous depression (deep drink, opioids) | rex (the loop, 2026-10-29); proposed (time constants) |
| Volume and salt (kidney) | blood volume and sodium | urine output, thirst (NUTRITION water need), salt appetite | hours to days | kidney function low; no water to drink | rex (the loop, 2026-10-29); proposed (time constants) |
| Red cell mass (kidney to marrow) | haemoglobin 15 | the kidney's signal to the marrow | days to weeks | no iron, folate or B12; marrow or kidney failure | rex (the loop, 2026-10-29); proposed (time constants) |
| Glucose | 5 mmol/L | insulin and glucagon (pancreas), liver glycogen, appetite | minutes to hours | glycogen gone and no food; the sugar sickness; the liver busy with alcohol | rex (the loop, 2026-10-29); proposed (time constants) |
| Oxygen (demand to delivery) | tissue oxygen adequate | cardiac output up with demand (to the maximum), breathing up, extraction up (to about 70%) | seconds | the maximum reached (the Endurance pool's wall), lungs or heart failing, anaemia | rex (the loop, 2026-10-29); proposed (time constants) |
| Potassium | 4.0 | kidneys; cells take it up with insulin and adrenaline | hours | kidney failure; crush and burns releasing it; the fluxes losing it | rex (the loop, 2026-10-29); proposed (time constants) |
| Acid-base | pH 7.40 | breathing (fast), kidneys (slow) | minutes; days | shock, kidney failure, breathing depression | rex (the loop, 2026-10-29); proposed (time constants) |
<!-- /table -->

- **[science]** The baroreflex holds pressure in seconds; the kidney holds volume and salt over days and
  signals the marrow over weeks; insulin and glucagon hold glucose in minutes; breathing and the kidneys
  hold pH. Each loop needs its organs' function, so a failing organ breaks the loop that protects the
  others: the cascade of `ANATOMY.md` §1.
- **Mark:** **(proposed)**; the audit asked for homeostasis as regulation rather than drifting meters,
  and this table with `NEUROLOGY.md`'s baseline is that.

## 8. What this file hands to the others

| To | What | Replaces |
|---|---|---|
| `ANATOMY.md` | per-organ perfusion, oxygen, fuel, electrolyte adequacy | - |
| `PHYSIOLOGY.md` §2, §6 | `aerobic_today` as DO2 at maximal output; the Endurance pool's ceiling | the fitness index standing alone |
| `BODY.md` §2–§3 | `bloodFactor` (from class), the oxygen and fuel factors on every capability, consciousness | the old bloodFactor and hydrationFactor as separate numbers |
| `MEDICINE.md` §3 | the bleeding classes (moved here); shock as a state it names; the anaemias it names | its own blood table |
| `NUTRITION.md` | demand for iron, folate, B12, vitamin K, water, salt, potassium; glucose from meals and glycogen | the anaemia note |
| `NEUROLOGY.md` | liver function for clearance; glucose and oxygen for the brain's function | the fixed clearance |
| `MUSCULAR.md` | oxygen delivery as the ceiling on oxidative capacity's use; lactate as the burn | - |
| the story keeper | the old captain's heart; the dropsy as a character's end | a scripted death |

## Open for Rex

1. ~~The whole file: keep, cut, or stamp~~ stamped (Rex, 2026-10-29): structure canon, numbers placeholders.
2. ~~Which cardiac events, and whether named characters are fenced from them~~ decided **(Rex,
   2026-10-29)**: all the events the biology supports (§6), and **named characters are vulnerable to
   them**: their identities grant no biological immunity; a cardiac event opens a crisis like any organ
   failure (`ANATOMY.md` §3a), and what follows a death is the story and fate systems' (the alignment
   engine's fates, `COMBAT.md` §4e resurrection, the town's succession). This answers the body side of
   `BALANCE.md` C5 32 for cardiac events; the balance keeper's reachability guarantee now reads these odds
   as inputs, with the events' preconditions (an index built over years, a trigger) keeping a young crew's
   risk near zero. The general fence for disease and accident deaths is still Rex's to state the same way,
   or not.
3. Whether the player ever sees a pulse or a colour (the surgeon's report is the proposed face).
4. Every threshold, rate and chance is a placeholder for the simulator.

## Sources

`../SOURCES.md` keys CIR-*: oxygen delivery and content (respiratory therapy references; the EMS and EPFL
summaries); electrolyte thresholds (hypokalaemia review PMC6234658; clinical cut-offs vary); the
atherosclerosis-to-infarction mechanism (standard); alcoholic liver disease thresholds (via ANA-*); red
cell recovery after bleeding (under 40 days for a donation's worth).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | Rex: named characters are vulnerable to cardiac events (no biological immunity; the fate systems decide what follows); all events the biology supports are in | Rex |
| 2026-10-29 | Rex stamped the structure as his; numbers placeholders; marks updated | Rex |
| 2026-10-29 | File opened on Rex's blood-simulator idea and ChatGPT's notes (outside AI); quantities (18), bleeding classes moved in, the three delivery failures, clotting, chemistry, conditional cardiac events (8), regulation loops (7); all proposed | keeper |
