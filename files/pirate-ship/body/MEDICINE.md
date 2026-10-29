# Medicine: disease, wounds, bleeding, pain, hygiene and the surgeon (body-and-world keeper, 2026-10-29)

One of the body docs feeding `BODY.md` (Rex, 2026-10-29). This file owns what goes wrong with a body and
what a surgeon of 1650–1730 could do about it: the disease list Rex asked for (`../combat/COMBAT.md` §4b),
infections, parasites, wounds, bleeding, pain, shock, hygiene as exposure, and healing. It produces
**conditions** with their effects; `BODY.md` folds them into capability. Deficiency diseases (scurvy and the
rest) are caught here but caused in `NUTRITION.md`; heat stroke and hypothermia are caused in
`PHYSIOLOGY.md`. Combat decides when a hit becomes a wound (`COMBAT.md` §4); this file decides what the
wound does after.

**How to read.** Four kinds of statement: **[science]** (modern medicine, sourced), **[history]** (what the
period did), **[model]** (the simulation rule), **[fiction]**. Marks: **(Rex, date)**, **(proposed)**,
**(proposed, outside AI)**, **(open)**. Tables are rendered from `data/medicine.json`.

**Clock.** Conditions progress at the overnight tick (incubation, course, healing); in-fight bleeding and
shock run per turn (`COMBAT.md`); treatment is an action in the day (the surgeon's duty, `../DUTIES.md`
"tending the sick"). Active characters carry full conditions; a distant town carries only epidemic state
(`../world/POPULATION.md`).

## What Rex has decided that this file must respect

- **Scurvy is real**: forget vitamin C on a long trip and it comes (Rex, 2026-10-29). Its cause and clock are
  `NUTRITION.md`'s; its face and its effect on wounds are here.
- **Hit locations dip the stats housed there** (Rex, 2026-10-29): an arm its Strength, Dexterity, Reflexes; a
  leg its stats and movement; the head the senses and Spatial Reasoning; the torso the Endurance pool
  (bleeding) and Constitution. The wound table uses exactly those.
- **A lost eye halves Eyesight; a peg leg takes Agility** (`STATS.md` §1, Rex's rows): lasting wounds cap
  attributes.
- **A crew mate can die in a fight** (Rex, 2026-10-29, `COMBAT.md` §4e). Death from disease outside a fight
  is **not decided**: see Open for Rex 1. This file gives death risks as numbers the simulator can run
  under whichever mortality fence Rex chooses; it fences nobody itself.
- **Constitution resists sickness, drink, wounds, seasickness** (`STATS.md`, Rex's row).
- **Surgery and medicine** is a skill (Dexterity, Nerve; Wits, Memory, Strength) and the surgeon's chest a
  good (`../economy/GOODS.md` row 48); period remedies are goods and knowledge (`GOODS.md` §3f).

## 1. The disease list

**Inputs:** exposure sources (hygiene table §6, environment vectors in `../world/ENVIRONMENT.md`, contact
with the sick, nutrient reserves from `NUTRITION.md`), Constitution, immunity record, season. **Outputs:**
per character a list of `conditions` (id, stage, day, severity), each with its multipliers.

- **[science]** Causes, incubations, courses and mortality are modern medicine; the period knew none of the
  causes (lice, mosquitoes, faecal water, bacteria) and named diseases by their look (fluxes, fevers,
  gripes). Confidence per row.
- **[history]** The big killers of the Caribbean were yellow fever and malaria for newcomers (Burnard: white
  Jamaica never grew by births; 50,000 arrived 1700–1750 and the white population rose by 5,000), the bloody
  flux and ship fever aboard, scurvy on long passages, and the pox in port. Trapham (1679) and Sloane
  (1707) describe the island diseases; Woodall (1617) and Moyle (1693) what a sea surgeon did (MED-*).
- **[model] Catching it (proposed; rewritten after the audit of 2026-10-29 so that each disease needs its
  real cause present):** every disease shares one **state interface** (incubating → ill by stage → resolved
  or dead, with immunity) but its **onset** runs by its category, and nothing starts without its source:

  | Category | Needs present | Daily onset chance | Diseases |
  |---|---|---|---|
  | Vector-borne | an infected vector population at the place (ENVIRONMENT: mosquito season × place; a port's epidemic state from POPULATION) and bites (nights ashore or at anchor, no netting) | `bites/day × p_infectedVector(place, season) × p_transmit × (1 − immunity)` | yellow fever, malaria (both) |
  | Louse-borne | lice on the character (the lice state: unwashed days, crowding, prisoners) and an infected case in the group | `p_lousy × contacts × p_caseInGroup × 0.1` | epidemic typhus |
  | Flea-borne | rats in the stores (the rat meter, DUTIES) | `rat level × 0.002` | murine typhus |
  | Faecal-oral | foul water or dirty food eaten that day (the water cask's age, the cleanliness meter, a carrier in the galley) | `dose × hygiene_mult (§6) × (1 − immunity)` | dysentery, typhoid, worms |
  | Droplet and contact | a case aboard or in the scene | `cases × contacts/day × p_transmit (influenza 0.1, smallpox 0.05, consumption 0.001)` | influenza, smallpox, consumption |
  | Sexual contact | the brothel, a partner with the disease | `p_partnerInfected × p_transmit` | syphilis, gonorrhoea |
  | Soil and wound | a deep dirty wound (tetanus, gangrene); bare feet on contaminated soil (hookworm) | per wound (§3); `days barefoot × soil load` | tetanus, gangrene, hookworm, yaws (skin contact) |
  | Deficiency | **no roll**: the condition begins on the day `NUTRITION.md`'s pool crosses its threshold | - | scurvy, beriberi, pellagra, anaemia, night blindness |
  | Poisoning | the dose (rum from lead-worm stills, months) | cumulative lead load over a threshold | the dry gripes |
  | Environmental | `PHYSIOLOGY.md`'s thresholds crossed | - | heat stroke, hypothermia |

  Constitution modifies **severity and death risk**, not whether the mosquito bites (the immunity table);
  a vitamin A or protein deficit raises the droplet and faecal-oral chances ×1.5 and worsens every course.
  Then incubation (no signs), course (signs and multipliers), and a daily death roll at the row's untreated
  risk divided over the course days, scaled by treatment (§5) and nursing (rest, water, food). The daily
  rates are model placeholders, not clinical rates.

<!-- table:medicine.diseases -->
*The disease list (period names in brackets)* (science; confidence medium; source: Causes and courses are modern medicine (textbook; MED-* keys in SOURCES.md). Period presence and names from Trapham 1679, Sloane 1707, Woodall 1617, Moyle 1693, the Burnard mortality study, the Hektoen ship-fever article and the Cardiff sea-surgeons piece. Mortality figures are ranges, untreated, confidence as given per row.)

| Id | Disease [period name] | Cause (modern) | How the sim catches it | Incubation (days) | Course (days) | Untreated death risk | Lasting harm | Symptoms (the visible face) | Period treatment (what the surgeon does) | What helped, really | Conf | Mark |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| scurvy | Scurvy [the scurvy] | vitamin C depletion (NUTRITION.md) | no vitamin C for 6 to 12 weeks | 42 to 84 (from the last fresh food) | progressive until C is eaten; recovery in 1 to 2 weeks on citrus | high over months (the great killer of long voyages) | old wounds reopen; teeth lost | lassitude first, then bleeding gums, bruises, swollen legs, old scars open | Woodall (1617) already prescribed lemon juice; Lind's 1747 trial proved oranges and lemons; the Navy issued lemon juice only from 1795 | citrus, fresh greens, sauerkraut; lime juice boiled or stored in copper lost most of its C | high | **Rex** |
| yellow_fever | Yellow fever [yellow jack, the bleeding fever, Barbados distemper] | flavivirus, Aedes aegypti mosquito | wet-season port or coast (ENVIRONMENT vector table); newcomers; a ship from an infected port | 3 to 6 | 3 to 4 acute; 15% enter the toxic phase (jaundice, black vomit) after a brief remission | 20 to 50% of toxic-phase cases; 5 to 10% of all cases; far higher in unseasoned Europeans | lifelong immunity | sudden fever, headache, back pain; then yellow skin, black vomit, bleeding | bleeding, purging, mercury, bark; nothing worked; quarantine of ships (Boston 1647) | survival alone; immunity after | medium | proposed |
| malaria_vivax | Malaria, tertian [ague, intermittent fever] | Plasmodium vivax, Anopheles mosquito | swampy coasts, river mouths, wet season | 10 to 20 (longer in temperate strains) | fever every 2nd day for 2 to 4 weeks; relapses from the liver for years | low (under 2%) but repeated attacks | relapses; anaemia; enlarged spleen | shaking chills, burning fever, sweats on a two-day cycle | Peruvian bark (cinchona) from the 1650s in London (Talbor 1672); bleeding and purging otherwise | cinchona bark really worked (quinine) | high | proposed |
| malaria_falciparum | Malaria, malignant [the burning fever, quotidian] | Plasmodium falciparum, Anopheles | West African coast, the Guinea trade, swampy Caribbean coasts | 7 to 14 | irregular fever; cerebral malaria within days | 15 to 30% untreated in the unexposed; survivors gain partial immunity | anaemia; after cerebral malaria, lasting weakness | irregular high fever, confusion, coma | bark, bleeding | cinchona bark | medium | proposed |
| dysentery | Dysentery [the bloody flux] | Shigella (bacillary) or Entamoeba (amoebic); faecal contamination of water and food | foul water casks, filth below decks, a crowded ship, a dirty port | 1 to 7 | 7 to 14 bacillary; weeks amoebic | 5 to 15% bacillary without fluids; amoebic 1 to 5% (liver abscess) | weakness for weeks; amoebic liver abscess | bloody stools, cramps, fever, rapid dehydration | opium (laudanum, Sydenham), purging first then astringents, ipecacuanha for the amoebic kind (known from 1680s) | clean water, fluids and salt; ipecacuanha for amoebic | high | proposed |
| typhus | Typhus [ship fever, gaol fever, spotted fever] | Rickettsia prowazekii, the body louse | lice: crowded unwashed crew, prisoners taken aboard, a long cold voyage | 7 to 14 | 14 to 21 | 10 to 40% (up to 60% in epidemics); mortality rises with age | weakness for weeks; Brill-Zinsser recurrence years later | high fever, headache, rash on the trunk, stupor; 'the Armada died of it' | bleeding, blistering, bark; the cause (lice) unknown; cleanliness and airing the ship helped by accident | delousing, washing, fresh clothes | high | proposed |
| typhoid | Typhoid [slow nervous fever, putrid fever] | Salmonella Typhi, faecal contamination of water and food | the same filth as dysentery; a carrier in the galley | 7 to 14 | 21 to 28 | 10 to 20% | intestinal haemorrhage; relapse in 10% | stepladder fever over a week, rose spots, delirium, 'coated tongue' | bleeding, purging, bark | clean water, nursing | high | proposed |
| smallpox | Smallpox [the small pox] | Variola virus, person to person | an infected person aboard or in port; epidemics every few years | 10 to 14 | 21 to 28 | 20 to 30% (variola major); near zero in the immune (survivors, and inoculated after 1721) | pitted scars; blindness in some | fever, then the pustules over face and arms | isolation; inoculation reached England from 1721 (Lady Mary Wortley Montagu), Boston 1721 (Boylston) | survivor immunity; inoculation | high | proposed |
| influenza | Influenza [the epidemical catarrh] | influenza virus, droplet | crowding; port epidemics | 1 to 3 | 5 to 10 | 1 to 2% (higher with chest infection after) | none usually | fever, cough, aches; the whole ship down at once | sweating, bleeding, warm drinks | rest | high | proposed |
| consumption | Tuberculosis [consumption, phthisic] | Mycobacterium tuberculosis, droplet; chronic | long close contact below decks; poor diet | months to years | years | about 50% within 5 years when active | progressive loss of weight and wind | cough with blood, wasting, night sweats, pallor | sea air (the period's own advice), milk diet, bleeding | nothing then; rest and food slowed it | high | proposed |
| beriberi | Beriberi [the dropsy of the legs, in Asian waters] | thiamine (B1) deficiency (NUTRITION.md) | polished rice or pure biscuit-and-rum diet for 3 to 6 weeks | 21 to 42 | progressive; cardiac death possible in 3 weeks of total lack | high if the diet is not changed | nerve damage if long | swollen legs, weak legs, breathlessness, racing heart | unknown to the period; dropsy was purged | thiamine: pease, oatmeal, pork, whole grain | medium | proposed |
| pellagra | Pellagra [not named in the period] | niacin deficiency (NUTRITION.md) | a maize-only diet for months (coast provisions); not alkali-treated | 60 to 180 | months | moderate over years | dermatitis scars; dementia if long | the 4 Ds: dermatitis on sun-exposed skin, diarrhoea, dementia, death | unknown; first described 1735 in Spain | meat, fish, pease, nixtamalised maize | medium | proposed |
| dry_gripes | Lead poisoning [the dry gripes, West India dry belly-ache] | lead from still worms and pewter; rum, cider | heavy rum or cider drinking from lead-worm stills over months | 30 to 90 | weeks; recurs while drinking | low directly; palsy disables | wrist drop (palsy), gut pain, lasting nerve damage | colic without diarrhoea, constipation, wrist drop | Cadwalader 1745 described it; purges; the cause (lead) shown by Franklin later | stop the rum | medium | proposed |
| yaws | Yaws [the yaws] | Treponema pallidum pertenue, skin contact; tropical | skin contact in crowded tropical quarters; children mostly | 9 to 90 | months to years in stages | very low | bone and skin deformity in late stage | the raspberry 'mother yaw', then skin sores, then bone pain | treated like the pox (mercury, sweating); African inoculation practice suppressed by planters (Paugh) | later, one shot of penicillin; then, nothing | medium | proposed |
| syphilis | Syphilis [the pox, the French disease, the great pox] | Treponema pallidum; sexual contact (and mother to child) | the brothel, the port | 10 to 90 (typically 21) | primary 3 to 6 weeks; secondary months; latent years; tertiary decades later | about a third of the untreated progress to late disease over decades; rarely quick | late syphilis: madness (general paresis), heart (aortitis), bone (gummas), blindness | a painless chancre, then rash, fever and sore throat; years later the tertiary signs | mercury (unction, salivation to the point of poisoning), guaiacum wood, sweating tubs | nothing effective; mercury partly suppressed signs at great cost | high | proposed |
| gonorrhoea | Gonorrhoea [the clap, the running of the reins] | Neisseria gonorrhoeae; sexual contact | the brothel, the port | 2 to 7 | 2 to 4 weeks acute; chronic if untreated | very low | sterility (both sexes), chronic pelvic pain, joint infection, stricture | burning, discharge; often silent in women | injections, purges, mercury (confused with the pox: one disease to the period) | nothing effective | high | proposed |
| hookworm | Hookworm [not named; 'the cachexia'] | Necator, Ancylostoma; larvae enter bare feet from contaminated soil | bare feet on plantation or camp soil in the tropics | 40 to 60 to egg-laying | chronic, years | low; anaemia disables | chronic anaemia, weakness | pallor, breathlessness, pica, swollen belly | unknown; iron 'steel wine' for pallor by luck | shoes, latrines; iron | medium | proposed |
| worms | Intestinal worms [the worms] | Ascaris, tapeworm; faecal contamination, undercooked pork | dirty food and water; salt pork badly cured | 14 to 60 | chronic | very low | loss of nutrients | passing worms; belly pain; a child's swollen belly | wormseed, purges; Woodall lists vermifuges | purges did pass them | medium | proposed |
| tetanus | Tetanus [lockjaw] | Clostridium tetani in soil and manure, through a deep wound | a deep dirty wound (a nail, a splinter, a bayonet) | 3 to 21 | 14 to 28 | 50 to 90% before antitoxin | none if survived | jaw stiff, then arching spasms | opium, warm baths; usually fatal | nothing then | high | proposed |
| gangrene | Gas gangrene and wound sepsis [mortification, the gangrene] | Clostridium perfringens and others in a crushed or dirty wound | an untreated gunshot or crush wound, foul dressings | 1 to 4 | days | near certain untreated; amputation above it the only cure | a limb lost | swelling, crackling skin, black tissue, foul smell, then fever and death | amputation (over half died of it in the 18th century: Bell); cautery | early amputation | high | proposed |
| heat_stroke | Heat stroke [a stroke of the sun, calenture] | core temperature over 40 C with brain signs (PHYSIOLOGY.md); not an infection: onset is PHYSIOLOGY's heat model, this row holds only the condition | heavy work in the noon heat without water | 0 | 1 to 3 | 30 to 50% without cooling | lasting weakness in some | collapse, hot skin (dry in the classic form, still sweating in the exertional form), confusion, raving | cooling, bleeding; 'calenture' was thought a madness that made men leap into the sea | shade, water, cooling | high | proposed |
| murine_typhus | Murine typhus [not told from ship fever in the period] | Rickettsia typhi, the rat flea | rats in the stores and their fleas; a separate, milder disease from louse-borne epidemic typhus | 6 to 14 | 7 to 14 | under 2% | none usually | fever, headache, rash; milder than ship fever | as for typhus | rat catching | medium | proposed |
<!-- /table -->

- **Effects (model):** each disease carries multipliers `BODY.md` reads: fevers set `feverFactor` on the
  Endurance pool (0.5 at the peak), work capacity ×0.3–0.6, appetite ×0.5 (NUTRITION), alertness ×0.8
  (PHYSIOLOGY), mood and madness pushes (PSYCHOLOGY); the fluxes drain water (hydration class −1 a day) and
  nutrients; anaemias (malaria, hookworm) cut `aerobic_today` ×0.8 for weeks; beriberi and pellagra are the
  deficiency clocks of `NUTRITION.md` surfacing as conditions here. Contagious diseases roll against every
  crew mate sharing the deck (crowding, §6).
- **Visible face:** the surgeon's report each morning (who is sick, with what he calls it, his guess at the
  outcome); the symptom in dialogue ("my gums bleed when I eat the biscuit"); the crew mate missing from
  his post; the portrait (jaundice, pox marks, a wasted face: art keeper, open); gossip in port about which
  harbour has the fever this season.
- **Mark:** the list **(proposed)**; scurvy **(Rex)**. Open: which of these Rex wants in the game at all
  (the pox and yaws touch the brothel sector; smallpox and the plague-scale killers touch the town's
  population and the balance guarantee).

## 2. Wounds

**Inputs:** from `COMBAT.md` §3–4: hit location, weapon kind, damage; from the day loop: accidents (falls,
burns, crushes, with chance raised by fatigue and sleep debt, `PHYSIOLOGY.md`). **Outputs:** a `wound`
(kind, part, severity 1–4, bleeding class, infected?, pain, healing clock).

- **(proposed, outside AI; recorded in `COMBAT.md` §4)** The wound ladder wounded → incapacitated → dying →
  dead; injury severities so a minor leg wound does not halve movement. This file keeps that ladder and gives
  it its clock: *wounded* heals; *incapacitated* needs treatment within the day or worsens; *dying* needs
  the surgeon within hours (bleeding class IV, or sepsis).
- **[science]** Healing runs through hemostasis (at once), inflammation (1–4 days), proliferation (4–21
  days) and remodelling (21 days to a year); the phases overlap (MED-HEAL). Deep, dirty and gunshot wounds
  infect far more often than clean cuts (modern surgical experience; the specific chances below are the
  keeper's medium-confidence reading).
- **[history]** The sea surgeon extracted balls and splinters, stitched, splinted, cauterised and
  amputated; Paré's ligature (1564) and, from 1718, Petit's screw tourniquet made amputation survivable
  more often, yet Benjamin Bell wrote that even after the tourniquet more than half of amputees died (18th c.;
  MED-AMP). At Fontenoy (1745) only 30–40 of 300 amputations succeeded. A chest or belly thrust was usually
  fatal.

<!-- table:medicine.wounds -->
*Wound kinds, what each does, and how long it heals* (science; confidence medium; source: Healing phases: hemostasis at once, inflammation 1 to 4 days, proliferation 4 to 21 days, remodelling 21 days to a year (MED-HEAL). Period handling from Woodall and Moyle. Infection and mortality ranges are the keeper's reading of the sources, medium confidence.)

| Kind | Typical cause | Bleeding class (see bleeding table) | Infection chance untreated | Heals in (days, clean) | What it dips while open (per COMBAT 4a hit-location rule) | Period treatment | Visible face | Mark |
|---|---|---|---|---|---|---|---|---|
| Cut (incised) | cutlass, knife, broken glass | I to II | 10 to 20% | 7 to 14 | the limb's Dexterity and Strength x0.8 to x0.5 by depth | wash, dry lint, stitch or tape, bandage; a splint if deep | a bandage in the portrait; favours the arm | proposed |
| Thrust (penetrating) | sword, pike, bayonet | II to IV | 25 to 50% (deep, dirty) | 14 to 30 | the limb x0.5; torso: the Endurance pool drains (bleeding), Constitution | probe, extract, tent the wound to drain, bandage; the chest or belly usually fatal | pale, short of breath | proposed |
| Gunshot (musket ball, splinter) | ball, grapeshot, wood splinters from a hit | II to IV | 40 to 70% (cloth and bone carried in) | 30 to 60 | limb x0.3; a shattered bone means amputation or a crippled limb | extract the ball and cloth with forceps, dress; amputate a shattered limb early (Moyle); over half died of amputation | slung arm; the surgeon's saw heard below | proposed |
| Blunt (bruise, fracture) | a fall from the rigging, a loose gun, a belaying pin | I (internal bleeding higher) | 5% (closed); 30% (open fracture) | bruise 7; simple fracture 42; open 60 to 90 | fracture: the limb out of use; Agility x0.5 for a leg | splint and bandage; a lost leg if the bone pierces | limps; arm bound to the chest | proposed |
| Burn and scald | the galley, powder flash, a gun bursting | none, but fluid loss like class II per 15% of body burned | 30 to 60% (large burns) | 7 (superficial) to 60 (deep) | the burned part x0.5; a face burn dips Eyesight | oils, egg white and lime water (Woodall), later linseed oil and lime water | scarred face; wrapped hands | proposed |
| Crush (a gun, a cask, a falling yard) | heavy gear in a seaway | II to IV internal | 20% (open) ; crush syndrome in a trapped limb | 30 to 90 | limb x0.2; often amputation | amputation; splints | a peg leg later (Rex: a peg leg takes Agility) | proposed |
| Head blow (concussion) | a boom, a fall, a club | I | 5% (open scalp 20%) | 3 to 14 (concussion), skull fracture 60 | the head's attributes: Eyesight, Perception, Hearing, Intuition, Spatial Reasoning x0.6; awareness lost on a bad one (Rex 4a) | bleeding, trepanning for a depressed fracture | dazed answers; 'he does not know the day' | proposed |
| Amputation (the surgeon's wound) | the treatment for gangrene, a shattered limb | III (with tourniquet II) | 20 to 50% sepsis | 30 to 60 (stump) | the limb gone: its Strength, Dexterity, Reflexes = 0; a leg: Agility x0.5, movement halved (STATS.md: a peg leg takes Agility) | tourniquet (Petit's screw tourniquet 1718; a stick and cord before), knife and saw, ligatures (Pare's method), the stump dressed; opium and rum for the pain | the hook, the peg leg | proposed |
<!-- /table -->

- **[model] Severity (proposed):** severity 1–4 from the damage roll in `COMBAT.md`; the "dips" column is
  the severity-4 multiplier, scaled linearly toward 1.0 at severity 1. The multiplier applies to the stats
  the hit location houses (Rex's table) and nothing else. Healing: `daysLeft = base × Π healing modifiers`
  (§7); a healed wound leaves a scar, and a severity-4 wound or an amputation leaves a permanent cap on the
  part (`STATS.md`: injuries may lower the maximum for good).
- **Effects:** the per-limb stats (`BODY.md` §2); movement tiles through the legs (`COMBAT.md` §4a); duty
  performance; pain (§4) into sleep and mood; infection (§3).
- **Visible face:** the bandage, sling or splint in the portrait; the surgeon's report; a crew mate who
  cannot haul ("the arm's no good yet"); in combat, the hit location shown as text ("the ball took him in the
  thigh"), never the number.
- **Mark:** ladder **(proposed, outside AI)** as recorded by the combat keeper; severities, clocks, dips
  **(proposed)**.

## 3. Bleeding, infection and sepsis

**Inputs:** wound bleeding class, time since wounding, treatment, cleanliness. **Outputs:** `bloodLoss`
(% of volume), `infected` flag, sepsis state.

- **[science]** Blood volume is about 70 mL/kg; the ATLS classes describe how loss shows (MED-ATLS).
  Before antibiotics, septicaemia "almost always killed"; tetanus killed 50–90%; gas gangrene was fatal
  without amputation above it (MED-SEPSIS, medium confidence on the percentages).
- **[model] (proposed; rewritten after the audit):** four processes, kept apart. **Blood loss:** an open
  wound bleeds at its class's rate (mL/min, the table) for the minutes elapsed (a combat turn's length is
  the combat keeper's), the cumulative loss sets the class the body reads, and binding or ligature stops
  it; blood regenerates about 1% of volume a day with food and iron (NUTRITION), slower in anaemia.
  **Circulatory shock:** the class-III and IV signs (confusion, collapse) and the Nerve check of §4, driven
  by loss alone. **Infection:** one roll at the wound's contamination chance (the kind, the cleanliness,
  treatment within the day, §5); an infected wound runs its own local course (fever, pain, the healing clock
  paused). **Sepsis:** a separate daily roll from an infected wound (5% a day, ×0.3 if opened and drained,
  ×0 after an amputation that succeeds), which is `dying` with a 30%/day death roll. The daily rates are
  game placeholders for the simulator, not clinical rates; the *shape* (loss by rate and time, shock by
  loss, infection by contamination, sepsis from infection) is the clinical one.

<!-- table:medicine.bleeding -->
*Blood loss classes (ATLS teaching values) and what the sim does* (science; confidence high; source: ATLS classes of haemorrhagic shock (teaching values; the current manual gives trends). Blood volume about 70 mL/kg (standard). The class is read from the cumulative loss; the loss grows by the wound's rate x elapsed minutes (a combat turn's length is the combat keeper's), and stops when bound or when the surgeon ligates. The bleeding rates and the death risks are model placeholders, not clinical rates. MED-ATLS)

| Class | Loss (% of blood volume) | Loss for a 70 kg man (mL) | Signs | Sim: Endurance pool and Constitution | Model: bleeding rate of an open wound of this class (mL per minute, until bound) | Death risk per hour at this loss, untreated (model placeholder) | Mark |
|---|---|---|---|---|---|---|---|
| I | up to 15 | up to 750 | pulse under 100; little change | pool x0.95 | 5 (a cut: stops on its own in 10 to 20 min) | 0 | proposed |
| II | 15 to 30 | 750 to 1500 | pulse 100 to 120; anxious; pale | pool x0.8; Constitution x0.9 | 30 (a deep thrust) | 1% | proposed |
| III | 30 to 40 | 1500 to 2000 | pulse 120 to 140; blood pressure falls; confused | pool x0.5; Wits x0.7; collapse risk per turn | 100 (a severed artery or a shattered limb) | 10% | proposed |
| IV | over 40 | over 2000 | pulse over 140; lethargic; unconscious | incapacitated; dying (COMBAT 4 wound ladder) | 300 (a great vessel) | 50% | proposed |
<!-- /table -->

- **Effects:** the torso rule (Rex): bleeding drains the Endurance pool and dips Constitution; class III+
  dips Wits (confusion); the blood factor stays on the pool until regenerated.
- **Visible face:** blood on the deck; pallor; "he's white as the sail"; the surgeon asks for rum and lint.
- **Mark:** **(proposed)**.

## 4. Pain and shock

<!-- table:medicine.pain -->
*Pain (0 to 10) and shock* (model; confidence low; source: The 0 to 10 numeric rating scale is standard clinical practice; the mapping to game effects is the keeper's model. Period analgesia: laudanum (Sydenham's tincture of opium, 1660s), rum, biting a bullet.)

| Pain | Cause examples | Sim effect | Relief | Visible face | Mark |
|---|---|---|---|---|---|
| 0 to 2 | bruise, small cut | none | - | none | proposed |
| 3 to 5 | deep cut, sprain, toothache | sleep quality x0.7; Dexterity x0.9 on that limb; PSYCHOLOGY push to Volatile | rum and laudanum through NEUROLOGY.md's pain-gating circuit (relief by dose and tolerance; the old fixed -2 and -4 are its typical outputs) | winces; short temper | proposed |
| 6 to 8 | fracture, burn, gunshot | sleep x0.4; the limb x0.5; Nerve check to keep working; Calm pressure | laudanum | cannot sleep; asks the surgeon | proposed |
| 9 to 10 | amputation, crushed limb, gangrene | cannot act except by Nerve; shock risk | laudanum, rum, the surgeon's speed | screams below; the crew goes quiet | proposed |
<!-- /table -->

- **[history]** Laudanum (Sydenham's tincture of opium, 1660s) and rum were the analgesics; there was no
  anaesthesia; a surgeon's speed was his mercy (MED-HUM).
- **[model] (proposed):** `pain = max over wounds and conditions`, decaying with healing; shock (a fiction
  of the wound ladder: *incapacitated* from pain and blood together) triggers when pain ≥ 8 and blood class
  ≥ II, unless a Nerve check passes (`STATS.md` Nerve: steadiness under fear or pain, Rex's row).
- **Effects:** sleep quality (PHYSIOLOGY), the limb's Dexterity, Calm↔Volatile and madness pressure
  (PSYCHOLOGY), Nerve checks in a fight (Poise is separate: Rex's Fi attribute resists flinching from
  strikes, not pain; the keeper keeps them apart, open if Rex wants pain to feed Poise).
- **Visible face:** winces, groans at night, a request for rum; the surgeon's dose count.
- **Mark:** **(proposed)**.

## 5. Treatment: the surgeon's chest and what it really did

**Inputs:** the surgeon's Surgery skill and knowledge (`../economy/GOODS.md` §3f: knowing the bark is
apart from the skill), the chest's contents (goods), time since injury, cleanliness. **Outputs:** modified
chances and clocks on §1–§4.

- **[history]** Woodall's *Surgeon's Mate* (1617) is the inventory of the chest and the cures of common sea
  ailments (wounds, fractures, dislocations, amputation, scurvy, the flux); he already prescribed lemon
  juice for scurvy. Moyle's *Chirurgus Marinus* (1693) is the practical manual from a career at sea. The
  physician's side was humoral: bleed, purge, vomit, sweat, blister to rebalance the humours; the chemical
  school pushed mercury and antimony. Cinchona bark reached London in the 1650s and Talbor's fever cure
  (1672–78) made it fashionable. Lind's 1747 trial proved citrus; the Navy ordered lemon juice in 1795
  (MED-WOOD, MED-MOYLE, MED-HUM, MED-LIND).
- **[model] (proposed):** each treatment is an action with a skill gate, a supply cost and an effect; the
  table's "Really worked?" column is what the sim applies, so a period surgeon spends days bleeding a
  fever to no effect while the one who knows the bark cures the ague. The knowledge of what works is itself
  hidden information the player learns (Rex's "you learn about people through the town's ecosystem" applied
  to remedies; proposed).

<!-- table:medicine.treatments -->
*What a surgeon of 1650 to 1730 could do (and whether it worked)* (history; confidence medium; source: Woodall, The Surgeon's Mate (1617); Moyle, Chirurgus Marinus (1693); the humoral tradition (bleeding, purging, emetics, sweating); Sydenham (laudanum, bark); Pare's ligature (1564); Petit's tourniquet (1718); inoculation 1721. MED-WOOD, MED-MOYLE, MED-HUM, MED-LIND)

| Treatment | Used for | Really worked? | Skill needed (STATS Surgery) | Supplies (GOODS.md) | Sim effect | Risk | Mark |
|---|---|---|---|---|---|---|---|
| Bleeding (venesection, cupping, leeches) | fevers, inflammation, almost anything | no; it worsened blood loss and anaemia | 20 | lancet, basin | a class-I loss; fever course unchanged; Constitution x0.95 for a week | infection of the cut; fainting | proposed |
| Purging and emetics (jalap, senna, antimony, ipecacuanha) | fevers, the flux, worms | worms yes; amoebic flux partly (ipecacuanha); fevers no, and it dehydrated | 20 | drugs (row 48, 71, 122) | worms cleared; dysentery hydration -1 class; nothing on fevers | dehydration | proposed |
| Sweating, blistering, cautery | the pox, fevers, bleeding wounds | cautery stopped bleeding (at a cost); the rest no | 30 | fire, cantharides | bleeding class -1 at a burn wound; pain +3 | burns, infection | proposed |
| Mercury (unction, pills, salivation) | the pox, yaws | suppressed signs, poisoned the patient | 40 | mercury (row 108) | pox signs hidden for months; Constitution x0.9; tremor (Dexterity x0.9) after long courses | lead-like palsy, lost teeth | proposed |
| Peruvian bark (cinchona) | intermittent fevers (malaria) | yes: quinine | 30 (and the knowledge, GOODS 3f) | Peruvian bark (row 72) | malaria course halved, relapse chance x0.5 while taken | none to speak of | proposed |
| Opium (laudanum) | pain, the flux, sleeplessness | yes for pain and diarrhoea | 30 | drugs (row 48) | NEUROLOGY.md: opioid tone up by dose: pain relief (the pain-gating circuit), stools halved, arousal down, breathing drive down (an overdose roll with rum); habit after about 30 days of daily dosing is the dependence clock there | habit; overdose | proposed |
| Lemon or lime juice, fresh greens | scurvy | yes (Woodall 1617 already; proved by Lind 1747) | 10 (the knowledge: GOODS 3f) | limes, oranges (row 77), lime juice (row 18) | vitamin C restored: NUTRITION.md | none | **Rex** |
| Washing wounds, dry lint, bandage, stitching | cuts | yes, partly (cleanliness mattered though nobody knew why) | 20 | lint, linen, needle, thread (row 47) | infection chance x0.5; healing clock starts | none | proposed |
| Extracting balls and splinters | gunshot | yes if done early | 40 | forceps, probe | infection chance x0.6 if within a day | more bleeding | proposed |
| Splints and reduction | fractures, dislocations | yes | 35 | wood, bandage | fracture heals in 42 days instead of never | a badly set limb: lasting Agility or Dexterity cap | proposed |
| Tourniquet and ligature | amputation, a severed vessel | yes (Pare's ligature; Petit's screw tourniquet 1718) | 50 | cord, needle | bleeding class -2 during surgery | none | proposed |
| Amputation | gangrene, a shattered limb | the only cure for gangrene; over half died of the operation in the 18th century (Bell) | 60 | saw, knife, rum, opium | removes the limb (wound table); sepsis roll at 20 to 50% by surgeon skill and cleanliness | death on the table (shock, bleeding), sepsis | proposed |
| Trepanning | depressed skull fracture | sometimes | 70 | trepan | head wound death risk x0.6; infection 30% | death | proposed |
| Inoculation (variolation) | smallpox, from 1721 | yes: about 2% died of the inoculation vs 20 to 30% of the disease | 50 (and the knowledge, after 1721) | a lancet, a pustule | immunity after 3 weeks of mild illness | 2% death; spreads smallpox if not isolated | proposed |
| Quarantine and airing the ship | fevers, ship fever | yes for lice-borne and person-to-person disease; useless against the mosquito | none (the captain's call) | - | contagion chance x0.3 for lice and droplet diseases | lost days | proposed |
| Rum and 'drinking the fever away' | everything | no; it dehydrated | none | rum | NEUROLOGY.md: the alcohol row (motor control, fear, encoding, sleep quality); hydration -0.5 L | the dry gripes over months | proposed |
<!-- /table -->

- **Visible face:** the surgeon's report says what he did and what he thinks; the patient's course says
  whether it worked; the chest's inventory (goods); the fake doctor (`../PIRATE.md` §7b) bleeds everyone.
- **Mark:** history **[history]**; effects **(proposed)**.

## 6. Hygiene and exposure

<!-- table:medicine.hygiene -->
*Hygiene as exposure: what filth does to the odds* (model; confidence medium; source: Mechanisms are modern (lice carry typhus; faecal water carries dysentery and typhoid; crowding carries smallpox, influenza, consumption). The ship side (swabbing, rats, the cleanliness meter) is PIRATE.md 5a and DUTIES.md; the place side (latrines, wells) is the town keeper's.)

| Condition (ship or place) | Raises the chance of | Multiplier on daily exposure | What lowers it | Visible face | Mark |
|---|---|---|---|---|---|
| Days unswabbed (PIRATE.md 5a cleanliness) | dysentery, typhoid, worms | x1 at 0 days, x2 at 7, x4 at 14 | swabbing the deck (DUTIES) | the smell; rats seen | proposed |
| Rats in the stores | murine typhus (the rat flea; a separate, milder disease from louse-borne ship fever), food loss, worms | x1.5 | rat catching, the cat | gnawed biscuit | proposed |
| Lice (no washing, no clean clothes, prisoners aboard) | typhus | x1 clean, x5 lousy | washing, boiling clothes, shaving heads (the Navy's cure by accident) | scratching in dialogue | proposed |
| Foul water casks (green water, 'the water stinks') | dysentery, typhoid | x3 | fresh water, rain catch, beer or grog instead of water | the cask smell; the cook refuses it | proposed |
| Crowding (men per ton) | smallpox, influenza, consumption, typhus | x1 at 1 man per 2 tons, x2 at 1 per ton | a bigger ship, fewer prisoners | no room to swing a hammock | proposed |
| Mosquito exposure (wet season, swampy anchorage, no netting) | yellow fever, malaria | x1 dry season at sea, x4 wet season at a swampy port | anchoring offshore, moving on, the dry season (ENVIRONMENT) | bitten at night; the port's fever reputation | proposed |
| Bare feet on plantation soil | hookworm | x3 | shoes | pale and breathless after a season ashore | proposed |
| Salt pork badly cured | tapeworm, food poisoning | x2 | the cooper and the cook's skill | worms passed | proposed |
<!-- /table -->

- **[history]** Nobody knew the mechanisms, but the Navy learned by accident that washing, airing and
  burning the clothes of pressed men cut ship fever; swabbing and holystoning were discipline as much as
  hygiene (`../DUTIES.md`). The place side (a town's wells, latrines, drains) is the town keeper's
  (`../town/UPGRADES.md`); this table reads it as a multiplier the town supplies.
- **Mark:** **(proposed)**. Rex's "filth → sickness, rats" row in `../PIRATE.md` §5a is the hook.

## 7. Healing

<!-- table:medicine.healing -->
*Healing clock modifiers* (model; confidence medium; source: Wound healing needs protein, vitamin C (collagen) and zinc; scurvy reopens old wounds (Lind, and modern collagen biology); age slows healing; infection resets the clock; rest speeds it. MED-HEAL)

| Factor | Multiplier on healing time | Reads | Mark |
|---|---|---|---|
| Vitamin C reserve under 300 mg (scurvy) | x3, and healed wounds reopen | NUTRITION.md | **Rex** |
| Protein under 0.8 g/kg/day | x1.5 | NUTRITION.md | proposed |
| Energy balance under -500 kcal/day | x1.3 | NUTRITION.md | proposed |
| Age over 50 | x1.3 (x1.6 over 65) | PHYSIOLOGY.md ageing | proposed |
| Infected | clock paused; fever; sepsis roll daily | this file | proposed |
| Rest (no duty using the part) | x0.7 | DUTIES roster | proposed |
| Working the wounded part | x1.5; reopen chance 10%/day | DUTIES roster | proposed |
| Surgeon skill 50+ dressing daily | x0.8 | STATS.md Surgery | proposed |
| Sleep debt over 24 h | x1.2 | PHYSIOLOGY.md | proposed |
<!-- /table -->

- **[science]** Collagen needs vitamin C: in scurvy, healed wounds reopen (Lind, and modern biology);
  protein and energy deficits slow healing; age slows it (MED-HEAL).
- **Mark:** scurvy's reopening **(Rex)** by implication of "real scurvy"; the rest **(proposed)**.

## 8. Immunity and the seasoning

<!-- table:medicine.immunity -->
*Immunity and resistance* (science; confidence high; source: Lifelong immunity after yellow fever and smallpox; partial after falciparum malaria; none after dysentery or influenza strains; Constitution as the hidden resistance stat is Rex's (STATS.md).)

| Disease | After surviving | Inoculation | Constitution effect (model) | Mark |
|---|---|---|---|---|
| Yellow fever | lifelong immunity | none in the period | each Constitution point over 10: -5% chance of the toxic phase | proposed |
| Smallpox | lifelong immunity | variolation from 1721 | each point over 10: -3% death risk | proposed |
| Malaria (falciparum) | partial, fades after a year away | none | each point: -2% severe | proposed |
| Malaria (vivax) | none; relapses | none | relapse chance unchanged | proposed |
| Typhus | mostly immune; late recurrence (Brill-Zinsser) | none | each point: -3% death | proposed |
| Dysentery, typhoid, influenza | short or none | none | each point: -5% catch chance | proposed |
| Scurvy, beriberi, pellagra | none: they return when the nutrient does not | - | none (Rex: nutrition is real) | **Rex** |
| The seasoning (a state, not a disease) | a newcomer who has survived his first bouts of the local fevers is 'seasoned': an immunity record, held here, not a row in the disease list. Period estimates put newcomer deaths in Jamaica's first years as high as a third (Burnard; confidence low on the fraction) | - | none; the record is per disease survived | proposed |
<!-- /table -->

- **[history]** "Seasoning" was the period's word for a newcomer's first bouts of the local fevers; those who
  survived were "seasoned". Period estimates of newcomer deaths in the first years are as high as a third
  (Burnard; the exact fraction is low confidence). West Africans were far likelier than Europeans to
  survive yellow fever and falciparum malaria (MED-YF).
- **Mark:** **(proposed)**.

## 9. States of being and medicine

**(proposed, outside AI; recorded in `COMBAT.md` §4e)** Each state of being is a physiological profile on
this architecture. For this file: a **ghost** catches no disease and bleeds nothing (what it needs is
`BODY.md` §6); a **mecha AI** takes damage as wear and is repaired, not healed; a **voodoo zombie** does not
bleed to death but rots (a decay clock in place of healing); an **angel** heals fast and is immune to
disease; a **demon** heals and is immune but burns under holy things; a **fish-person** heals in water and
dries out of it. All **(proposed)** until Rex writes each form; the merfolk's form is open (Rex).

## 10. What this file hands to the others

| To | What | Where it is used |
|---|---|---|
| `BODY.md` | `conditions[]` with multipliers; `wounds[]` with part, severity, dips; `bloodFactor`, `feverFactor`, `pain`, permanent caps | capability |
| `PHYSIOLOGY.md` | fever (alertness), pain (sleep quality), anaemia (aerobic) | its states |
| `NUTRITION.md` | appetite ×, water drain (fluxes), nutrient loss (worms) | balance |
| `PSYCHOLOGY.md` | pain, fever, a crew mate's death from sickness | pushes |
| `../combat/COMBAT.md` | post-fight wound outcomes; the healing clock; the surgeon's reach to the wound ladder | the fight's aftermath |
| `../world/POPULATION.md` | epidemic parameters (catch rate, death risk) for aggregate towns | the town's deaths |
| `../balance/BALANCE.md` | every death risk above is an input to the reachability guarantee | the sim |

## Open for Rex

1. **Named-character mortality from disease and accident.** `BALANCE.md` C5 item 32 and the combat keeper's
   note put it to you: full mortality, protected (story deaths only), conditional with succession, or story
   only. This file runs under any of them; the balance keeper's sim needs the answer before these risks
   touch a town. ChatGPT favoured conditional with succession (outside AI).
2. Which diseases exist in the game at all (the pox and yaws, smallpox, consumption).
3. Whether pain feeds Poise (Fi) or stays apart from it.
4. Does the player learn which remedies work (hidden knowledge), or is it shown?
5. Amputation as a lasting character change (the hook, the peg leg: art and story keepers).
6. All numbers are placeholders for the simulator; the period facts are sourced.

## Sources

`../SOURCES.md` keys MED-*: Woodall 1617, Moyle 1693, Trapham 1679, Sloane 1707, Lind 1753, Burnard on
Jamaican mortality, the ATLS classes, wound-healing reviews, the Hektoen ship-fever article, the Cardiff
sea-surgeons note, the Antigua lead study, Paugh on yaws.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; disease list (20), wounds, bleeding, pain, treatments (16), hygiene, healing, immunity; tables in `data/medicine.json` | keeper |
| 2026-10-29 | After ChatGPT's audit (outside AI): onset by disease category (a mosquito, a louse, a flea, foul water, a case, a wound, a pool crossing); syphilis and gonorrhoea split; murine typhus its own row (fleas), ship fever lice only; the seasoning moved to the immunity table as a state; bleeding by rate × time; blood loss, shock, infection and sepsis as four processes; heat stroke may still sweat | keeper |
