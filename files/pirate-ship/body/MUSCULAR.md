# The muscular system and the gym (body-and-world keeper, 2026-10-29)

Rex's system (`../combat/COMBAT.md` §4b, 2026-10-29): under the per-limb stats, **each major muscle gets its
own set of stats**, split the way real muscles split, trained by what you do, interacting in tandem; and a
**gym simulator** where a character designs and conducts a regimen. ChatGPT drafted a version for him; this
file is the keeper's, written from the sources, with ChatGPT's proposals marked **(proposed, outside AI)**
where they are kept. It feeds `BODY.md`.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; marks **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables are rendered from `data/muscular.json`.

**Clock.** Work during the day loads fatigue and stimulus per action; the overnight tick recovers fatigue,
converts stimulus to development when rest and food allow, and applies disuse decay. In a fight, fatigue
moves per turn by the action's activation profile (the Endurance pool is the whole-body side, Rex's; the
local side is here).

## What Rex has decided that this file must respect

- **(Rex, 2026-10-29)** Each major muscle that counts gets stats; groups split by head (deltoid front,
  middle, rear; chest upper, middle, lower; and so on for any group with parts). Training is based on what
  you do: walking trains certain muscles by a certain percentage, lifting others. A weak rear deltoid lowers
  the chance of pulling something apart.
- **(Rex, 2026-10-29)** The gym simulator: go to the gym, design a regimen, conduct it. Pirates probably had
  no gyms; disbelief suspended.
- **(Rex, 2026-10-29)** Physical attributes are per limb (Strength, Dexterity, Reflexes per arm and leg);
  the legs together set movement; Endurance, Constitution, Agility are whole-body.
- **(Rex, 2026-10-26)** Use raises an attribute toward its hidden genetic max; disuse lowers it toward the
  min; age lowers the max (the last proposed in `STATS.md`).
- **(open, Rex's)** Whether muscle **replaces** per-limb Strength or Strength is **computed** from it.
  ChatGPT says replaces. §8 offers the computed reading; the choice is Rex's.
- **(open, Rex's)** Whether the genetic min–max is per limb.

## 1. The groups

**Inputs:** none (the model's structure). **Outputs:** the list of tracked groups, each with sides.

- **[science]** The anatomy is standard (MUS-ANAT). The deltoid has three heads; pectoralis major has a
  clavicular and a sternocostal portion (upper/middle/lower chest are training regions of one muscle, as
  ChatGPT noted); the trapezius has upper, middle and lower fibres with different actions; the quadriceps
  has four heads and the triceps three.
- **[model] (proposed)** 31 groups, 27 of them paired left and right (58 tracked entries); the selection
  follows ChatGPT's 25–40 functional model, extended with the rotator cuff (the shoulder's injury site),
  the intrinsic hand (fine control), the neck (taking a blow) and the breathing muscles (the wind). Smaller
  muscles are folded into the group that does their job. Rex said "only the ones that count"; this is the
  keeper's count, for him to cut or grow.

<!-- table:muscular.groups -->
*The muscle groups the sim tracks (left/right where the body has two)* (science; confidence high; source: Anatomy is textbook (Gray's). The split by head (deltoid front/middle/rear; chest clavicular/sternocostal; and so on) is Rex's rule that groups split the way real muscles split (COMBAT.md 4b). Which groups count is proposed (ChatGPT's 25 to 40 functional model, extended). MUS-ANAT)

| Id | Group | Region | Sides | Main action | Feeds limb stat | Mark |
|---|---|---|---|---|---|---|
| delt_front | Deltoid, anterior head | shoulder | L/R | raising the arm forward, pushing | arm Strength | rex (split), proposed (set) |
| delt_mid | Deltoid, middle head | shoulder | L/R | raising the arm sideways; holding a sword out | arm Strength | rex (split), proposed (set) |
| delt_rear | Deltoid, posterior head | shoulder | L/R | pulling the arm back; pulling apart (Rex's example) | arm Strength | rex (split), proposed (set) |
| rotator_cuff | Rotator cuff (supraspinatus, infraspinatus, teres minor, subscapularis) | shoulder | L/R | stabilising and rotating the shoulder; a thrown cast; overhead work | arm Dexterity (stability), injury site | proposed |
| pec_clav | Pectoralis major, clavicular portion (upper chest) | chest | L/R | pushing up and forward | arm Strength | rex (split), proposed (set) |
| pec_stern | Pectoralis major, sternocostal portion (middle and lower chest) | chest | L/R | pushing forward and down; hugging a cask | arm Strength | rex (split), proposed (set) |
| trap_upper | Trapezius, upper | back | L/R | shrugging; carrying on the shoulder | arm Strength (carry) | proposed |
| trap_mid | Trapezius, middle | back | L/R | pulling the shoulder blades together: rowing, hauling | arm Strength (pull) | proposed |
| trap_lower | Trapezius, lower | back | L/R | pulling the blades down: climbing, overhead pulls | arm Strength (pull) | proposed |
| lats | Latissimus dorsi | back | L/R | pulling down and back: hauling, climbing, rowing | arm Strength (pull) | proposed |
| rhomboids | Rhomboids | back | L/R | retracting the blades | arm Strength (pull) | proposed |
| erectors | Erector spinae | back (core) | L/R | holding the back straight under load; lifting from the deck | whole-body (lift), Agility (balance) | proposed |
| abs | Rectus abdominis | core | one | bending forward; bracing | whole-body (brace) | proposed |
| obliques | Obliques (external and internal) | core | L/R | twisting: a sword cut, a cast, swinging a hammer | arm Strength (twist), Agility | proposed |
| deep_core | Deep stabilisers (transversus, multifidus) | core | one | bracing the spine | Agility (balance), injury guard | proposed |
| biceps | Biceps brachii | upper arm | L/R | bending the elbow, turning the palm up: hauling hand over hand | arm Strength | proposed |
| brachialis | Brachialis | upper arm | L/R | bending the elbow (the strongest flexor) | arm Strength | proposed |
| triceps | Triceps brachii (three heads) | upper arm | L/R | straightening the elbow: pushing, a thrust, a hammer | arm Strength | rex (split allowed), proposed |
| forearm_flex | Forearm flexors and grip | forearm | L/R | gripping: rope, a cutlass, a fish on the line | arm Strength (grip), Dexterity | proposed |
| forearm_ext | Forearm extensors | forearm | L/R | opening the hand, steadying the wrist: aiming, writing | arm Dexterity | proposed |
| hand | Intrinsic hand muscles | hand | L/R | fine control: a needle, cards, a knot | arm Dexterity | proposed |
| glute_max | Gluteus maximus | hip | L/R | driving the hip: climbing, a jump, lifting | leg Strength | proposed |
| glute_med | Gluteus medius and minimus | hip | L/R | holding the pelvis level: balance on one leg, a rolling deck | Agility (balance) | proposed |
| hip_flex | Hip flexors (iliopsoas) | hip | L/R | lifting the knee: climbing, stepping over a rail | leg Strength, movement | proposed |
| adductors | Adductors | hip | L/R | squeezing the legs in: gripping a yard with the thighs | leg Strength | proposed |
| quads | Quadriceps (four heads) | thigh | L/R | straightening the knee: standing from a crouch, climbing, pushing a gun | leg Strength, movement | rex (split allowed), proposed |
| hamstrings | Hamstrings | thigh | L/R | bending the knee, driving the hip: running, hauling with the legs | leg Strength, movement, Reflexes (sprint) | proposed |
| calves | Gastrocnemius and soleus | lower leg | L/R | pushing off the toes: running, jumping, standing on a footrope | movement, Agility | proposed |
| tibialis | Tibialis anterior | lower leg | L/R | lifting the foot; balance | Agility | proposed |
| neck | Neck (sternocleidomastoid, neck extensors) | neck | L/R | holding the head; looking aloft; taking a blow | head wound resistance (proposed) | proposed |
| diaphragm | Diaphragm and intercostals | chest | one | breathing hard; the wind | Endurance (aerobic) | proposed |
<!-- /table -->

- **Visible face:** the portrait's build (art keeper: a rigger's back and forearms, a smith's shoulders, a
  cook's belly), and what people say ("arms like a capstan bar"); never a number.
- **Mark:** split rule **(Rex)**; the set **(proposed)**.

## 2. What each group carries

<!-- table:muscular.values -->
*What each group carries (three values plus the stimulus store)* (model; confidence medium; source: ChatGPT's development / fatigue / condition triple with accumulated training stimulus (COMBAT.md 4b, proposed, outside AI), kept; units and ranges the keeper's.)

| Value | Range | Unit | Changes by | Reads | Mark |
|---|---|---|---|---|---|
| development | 0 to 100 (genetic max per group, inherited from the limb's hidden max) | index: 50 is an ordinary sailor | training stimulus after rest and food; disuse decay | limb Strength (computed), endurance time | proposed (outside AI) |
| fatigue | 0 to 1 | fraction of fibres in the fatigued compartment (3CC) | work by the activation profile; recovers by R | today's force = development x (1 - fatigue) | proposed (outside AI) |
| condition | 0 to 1 | 1 = sound; strain grades 1 to 3 at 0.8, 0.5, 0.2 | injury; healing (MEDICINE clock) | force cap; pain | proposed (outside AI) |
| stimulus | 0 to 100 | index of unconverted training load | added by work; converted to development at the overnight tick if rest and protein allow; decays if not | development | proposed (outside AI) |
| mass | kg (derived) | kg | development x the body's lean mass share (NUTRITION) | body composition | proposed |
<!-- /table -->

- **[model]** Today's force from a group = `development × (1 − fatigue) × condition`. The hidden genetic
  max of the limb (Rex) caps development; if the min–max is per limb (open), each group inherits its limb's
  range scaled by a small group-level variation (a born-strong grip; proposed).
- **Mark:** the triple and the stimulus store **(proposed, outside AI)**, kept.

## 3. Activation profiles: what an action asks of which muscles

**Inputs:** the action (a duty, a fishing stage, a combat action, a gym exercise), its duration, its load.
**Outputs:** per group: work done this action (→ fatigue), stimulus added, injury chance.

- **(Rex)** Training is based on what you do: each action trains certain muscles by a certain percentage.
- **[science]** Surface EMG studies give %MVC by muscle for rows, pull-ups and climbing postures (lats,
  middle trapezius, biceps and rear deltoid at 50–60% MVIC in rowing variants; middle and lower trapezius
  35–60% in climbing postures; MUS-EMG). No study measures hauling a ship's line, so those rows are
  estimates shaped by the nearest studied movement.
- **[model] (proposed, outside AI; kept)** One shared muscle model that every action references by a
  profile; each profile drives effort required, fatigue, training stimulus and how injuries bite, so a new
  activity never rewrites the system. Occupations then build different bodies: rigging → back, grip, arms,
  core; swordplay → shoulders, forearms, core, legs; hauling → back, legs, grip; smithing → shoulders,
  forearms, triceps, grip; fishing → forearms, shoulders, back.
- **[model] Effort required (proposed):** an action at load L on group g needs `L_g = profile_g × load /
  (development_g × (1 − fatigue_g) × condition_g)`; if any required group's `L_g` > 1, the action fails or
  degrades (the line slips; the lift does not come up; the pull-apart does not part). Rex's rear-deltoid
  example is the `delt_rear` 90% in the pulling-apart row.
- **Every duty in `../DUTIES.md`, every stage of `../minigames/FISHING.md` and every combat action needs a
  row.** The 26 below are the shape; filling them is a data task on the belt (Composer-scale), not design.

<!-- table:muscular.activations -->
*Action activation profiles (% of the group's maximum; illustrative)* (model; confidence low; source: Shape from EMG literature where it exists (inverted row and suspension rows: lats, mid trapezius, biceps, rear deltoid at 50 to 60% MVIC; climbing postures: middle and lower trapezius 35 to 60%; MUS-EMG). Hauling rope is ChatGPT's illustrative profile (COMBAT.md 4b). Every other profile is the keeper's estimate and a data task to refine. The columns are the groups by id; a blank is 0.)

| Action | Source doc | Intensity (MET) | lats | trap_mid | trap_lower | trap_upper | rhomboids | delt_front | delt_mid | delt_rear | rotator_cuff | pec_clav | pec_stern | biceps | brachialis | triceps | forearm_flex | forearm_ext | hand | erectors | abs | obliques | deep_core | glute_max | glute_med | hip_flex | adductors | quads | hamstrings | calves | tibialis | neck | Mark |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hauling a line hand over hand | DUTIES | 7 | 90 | 70 | 50 | 30 | 60 | 10 | 20 | 45 | 30 | 10 | 10 | 70 | 60 | 10 | 85 | 30 | 40 | 55 | 30 | 30 | 40 | 35 | 20 | 10 | 10 | 35 | 30 | 25 | 10 | 20 | proposed (outside AI) |
| The capstan (pushing a bar, walking) | DUTIES | 7 | 20 | 30 | 20 | 40 | 20 | 40 | 30 | 10 | 20 | 50 | 60 | 20 | 20 | 50 | 40 | 10 | 10 | 70 | 40 | 30 | 50 | 70 | 40 | 30 | 30 | 80 | 60 | 60 | 20 | 20 | proposed |
| Pumping the bilge (a brake pump, up and down) | DUTIES | 7 | 50 | 40 | 30 | 30 | 30 | 40 | 30 | 30 | 20 | 30 | 40 | 50 | 40 | 50 | 60 | 20 | 20 | 60 | 40 | 20 | 40 | 40 | 20 | 20 | 10 | 50 | 30 | 30 | 10 | 10 | proposed |
| Climbing the shrouds and working aloft | DUTIES | 8 | 70 | 50 | 60 | 30 | 40 | 30 | 30 | 40 | 50 | 20 | 20 | 60 | 60 | 20 | 80 | 30 | 40 | 40 | 40 | 30 | 60 | 60 | 60 | 50 | 60 | 60 | 40 | 60 | 30 | 30 | proposed |
| Rowing the boat | DUTIES | 10 | 80 | 70 | 50 | 30 | 60 | 10 | 20 | 50 | 30 | 10 | 10 | 60 | 50 | 20 | 70 | 20 | 30 | 70 | 40 | 30 | 50 | 60 | 20 | 30 | 10 | 80 | 60 | 40 | 20 | 10 | proposed |
| Mending sail (seated, palm and needle) | DUTIES | 2.5 | 5 | 10 | 5 | 20 | 10 | 15 | 10 | 5 | 10 | 5 | 5 | 10 | 10 | 10 | 35 | 40 | 70 | 20 | 10 | 5 | 10 | 0 | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 20 | proposed |
| Swabbing and holystoning the deck | DUTIES | 3 | 30 | 30 | 20 | 20 | 30 | 40 | 20 | 20 | 20 | 30 | 40 | 30 | 30 | 40 | 40 | 20 | 20 | 50 | 30 | 40 | 30 | 40 | 30 | 30 | 20 | 50 | 30 | 30 | 10 | 10 | proposed |
| Carpentry: sawing and hammering | DUTIES | 4.5 | 30 | 30 | 20 | 30 | 30 | 40 | 30 | 30 | 40 | 30 | 40 | 40 | 30 | 60 | 60 | 40 | 40 | 40 | 20 | 40 | 30 | 20 | 20 | 10 | 10 | 30 | 20 | 20 | 10 | 10 | proposed |
| Smithing: the hammer at the anvil | DUTIES / town | 6 | 40 | 30 | 20 | 40 | 30 | 50 | 40 | 30 | 40 | 30 | 40 | 40 | 30 | 70 | 80 | 50 | 40 | 50 | 30 | 50 | 40 | 30 | 20 | 10 | 10 | 40 | 20 | 30 | 10 | 20 | proposed |
| Fishing: the cast (FISHING.md stage 4) | FISHING | 3.5 | 20 | 20 | 10 | 20 | 20 | 40 | 30 | 30 | 50 | 20 | 30 | 20 | 20 | 50 | 50 | 40 | 40 | 30 | 20 | 60 | 30 | 20 | 20 | 10 | 10 | 30 | 20 | 20 | 10 | 10 | proposed |
| Fishing: pulling in a big one (stage 7) | FISHING | 5 | 60 | 50 | 30 | 20 | 40 | 10 | 20 | 40 | 30 | 10 | 10 | 60 | 50 | 10 | 90 | 30 | 40 | 50 | 30 | 30 | 40 | 30 | 20 | 10 | 10 | 40 | 30 | 30 | 10 | 10 | proposed |
| Cooking at the galley | DUTIES | 3.3 | 10 | 15 | 10 | 20 | 10 | 20 | 20 | 10 | 15 | 10 | 20 | 20 | 20 | 20 | 40 | 30 | 40 | 20 | 10 | 15 | 10 | 10 | 10 | 5 | 5 | 20 | 10 | 20 | 5 | 10 | proposed |
| Walking the deck, a seaway | day loop | 2.5 | 5 | 10 | 5 | 10 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 10 | 5 | 5 | 20 | 10 | 15 | 30 | 30 | 50 | 30 | 20 | 40 | 30 | 40 | 30 | 10 | proposed |
| Running (a charge, a chase) | COMBAT | 10 | 10 | 10 | 10 | 10 | 10 | 20 | 10 | 10 | 10 | 10 | 10 | 20 | 10 | 20 | 10 | 10 | 10 | 30 | 30 | 30 | 40 | 70 | 50 | 70 | 30 | 70 | 80 | 80 | 40 | 20 | proposed |
| Cutlass cut (one arm) | COMBAT | 10 | 30 | 30 | 20 | 30 | 20 | 60 | 50 | 30 | 50 | 40 | 50 | 30 | 20 | 60 | 80 | 40 | 40 | 40 | 30 | 70 | 50 | 40 | 30 | 20 | 20 | 50 | 30 | 40 | 20 | 20 | proposed |
| Sword thrust (one arm) | COMBAT | 10 | 10 | 20 | 10 | 20 | 10 | 60 | 40 | 10 | 40 | 50 | 50 | 10 | 10 | 80 | 70 | 40 | 40 | 30 | 30 | 40 | 40 | 50 | 30 | 40 | 20 | 60 | 40 | 50 | 20 | 10 | proposed |
| Parry and block | COMBAT | 8 | 20 | 30 | 20 | 30 | 30 | 40 | 50 | 40 | 60 | 20 | 20 | 50 | 40 | 40 | 80 | 50 | 40 | 30 | 30 | 30 | 40 | 20 | 30 | 10 | 10 | 40 | 20 | 30 | 20 | 20 | proposed |
| Aiming and firing a musket | COMBAT | 3 | 10 | 20 | 10 | 30 | 20 | 40 | 30 | 20 | 40 | 20 | 20 | 30 | 30 | 20 | 40 | 50 | 40 | 20 | 10 | 10 | 30 | 10 | 10 | 5 | 5 | 20 | 10 | 20 | 10 | 30 | proposed |
| Pulling something apart (two hands, Rex's example) | COMBAT / world | 8 | 50 | 70 | 40 | 30 | 70 | 10 | 30 | 90 | 40 | 10 | 10 | 60 | 50 | 10 | 90 | 30 | 40 | 40 | 30 | 30 | 40 | 20 | 20 | 10 | 10 | 30 | 20 | 20 | 10 | 20 | rex (example), proposed (numbers) |
| Grapple and wrestle | COMBAT | 10 | 50 | 50 | 40 | 40 | 50 | 40 | 40 | 40 | 50 | 50 | 60 | 60 | 50 | 50 | 90 | 40 | 50 | 60 | 50 | 60 | 60 | 60 | 50 | 50 | 60 | 70 | 60 | 50 | 30 | 50 | proposed |
| Swimming | STATS | 8 | 70 | 30 | 40 | 20 | 30 | 40 | 30 | 30 | 50 | 40 | 50 | 20 | 20 | 50 | 30 | 20 | 20 | 30 | 30 | 30 | 40 | 40 | 30 | 50 | 40 | 40 | 50 | 60 | 30 | 20 | proposed |
| Gym: lifting a stone from the deck (deadlift) | gym | 6 | 40 | 40 | 30 | 60 | 40 | 10 | 10 | 10 | 10 | 5 | 5 | 20 | 20 | 10 | 90 | 20 | 20 | 90 | 40 | 30 | 70 | 90 | 40 | 20 | 40 | 70 | 90 | 40 | 10 | 20 | proposed |
| Gym: pressing a cask overhead | gym | 6 | 10 | 20 | 30 | 50 | 20 | 90 | 70 | 20 | 60 | 50 | 20 | 10 | 10 | 80 | 50 | 30 | 20 | 40 | 40 | 20 | 50 | 20 | 20 | 5 | 5 | 20 | 10 | 20 | 10 | 20 | proposed |
| Gym: pull-ups on a yard | gym | 6 | 90 | 60 | 70 | 20 | 60 | 5 | 10 | 50 | 40 | 10 | 20 | 80 | 70 | 5 | 90 | 20 | 30 | 20 | 40 | 20 | 40 | 5 | 5 | 20 | 5 | 5 | 5 | 5 | 5 | 20 | proposed |
| Gym: squatting with a cask | gym | 6 | 10 | 20 | 10 | 40 | 10 | 10 | 10 | 5 | 10 | 5 | 5 | 20 | 20 | 10 | 50 | 10 | 10 | 70 | 40 | 20 | 60 | 90 | 40 | 30 | 50 | 95 | 60 | 50 | 20 | 20 | proposed |
| Gym: rope rows (seated, pulling a weighted line) | gym | 5 | 70 | 80 | 50 | 20 | 80 | 5 | 10 | 60 | 30 | 5 | 5 | 60 | 50 | 5 | 70 | 20 | 30 | 40 | 20 | 20 | 30 | 10 | 5 | 5 | 5 | 20 | 20 | 10 | 5 | 10 | proposed |
<!-- /table -->

- **Visible face:** the duty's result text ("the line slipped through his hands"; "she couldn't get the
  cask up"); the day-after soreness in dialogue; which crew mate the quartermaster posts where.
- **Mark:** the principle **(Rex)**; the profile system **(proposed, outside AI)**; the numbers
  **(proposed)**, all placeholders.

## 4. Fatigue and muscular endurance

**Inputs:** the action's profile and duration; the group's state; whole-body factors from `PHYSIOLOGY.md`
(aerobic capacity, hydration, heat, sleep) and `NUTRITION.md` (glycogen). **Outputs:** `fatigue_g` per
group; endurance time for a hold.

- **[science]** The three-compartment model (3CC): fibres sit in resting, active and fatigued
  compartments; active fibres fatigue at rate F and fatigued ones recover at rate R, both joint-specific
  (shoulder slow, ankle fast; MUS-3CC). Endurance time at a given %MVC follows a steep curve: holds under
  about 15% MVC last indefinitely; a maximal effort lasts seconds (Rohmert-type; MUS-ROH).
- **[model] 3CC (proposed):** per group, per minute of an action at effort e (0–1):

      dMA/dt = e·MR_available − F·MA ;   dMF/dt = F·MA − R·MF ;   MR = 1 − MA − MF
      fatigue_g = MF ;  force available = (MR + MA) × development × condition

  with F and R from the table, R multiplied by `restMult` (1.0 resting, 0.5 light work, 0.3 at sea in a
  storm) and by whole-body factors (aerobic_today/40, hydration, glycogen: each a multiplier 0.5–1.0).
  A rest day returns a group to near zero fatigue; a hard day leaves 0.2–0.4 by morning.

<!-- table:muscular.fatigue_rates -->
*Three-compartment fatigue model (3CC): rates by joint* (science; confidence medium; source: Xia and Frey Law 2008 (J Biomech): muscle in resting, active, fatigued compartments; F = fatigue rate active to fatigued, R = recovery rate fatigued to resting, per second. Fitted values from Frey Law, Looft and Heitsman 2012: ankle F 0.00589 R 0.0182; shoulder F 0.00058 R 0.00168; a 2018 extension adds a rest multiplier. MUS-3CC)

| Joint (groups) | F (per s) | R (per s) | Note | Mark |
|---|---|---|---|---|
| Shoulder (deltoids, rotator cuff) | 0.001 | 0.002 | fitted 2012 | proposed |
| Elbow (biceps, brachialis, triceps) | 0.001 | 0.004 | interpolated by the keeper between shoulder and ankle | proposed |
| Grip (forearm, hand) | 0.003 | 0.007 | interpolated; grip tires fast and recovers fast | proposed |
| Trunk (erectors, abs, obliques) | 0.001 | 0.003 | interpolated | proposed |
| Hip and knee (glutes, quads, hamstrings) | 0.003 | 0.009 | interpolated | proposed |
| Ankle (calves, tibialis) | 0.006 | 0.018 | fitted 2012 | proposed |
<!-- /table -->

<!-- table:muscular.endurance_time -->
*How long a hold lasts at a given effort (Rohmert-type endurance curve)* (science; confidence medium; source: Rohmert 1960 and later fits: endurance time falls steeply with %MVC; below about 15% MVC a hold is sustainable for a long time (the ergonomic design limit). Numbers here are the keeper's reading of general curves, not one study. MUS-ROH)

| Effort (% of the group's max) | Endurance time (fresh) | Example | Mark |
|---|---|---|---|
| 15 | over 60 min | holding the helm in a light breeze | proposed |
| 25 | about 15 min | holding a line under moderate strain | proposed |
| 50 | about 2 min | hanging from a yard by the hands | proposed |
| 75 | about 40 s | the capstan in a heavy heave | proposed |
| 100 | about 10 s | a maximal lift | proposed |
<!-- /table -->

- **Effects:** today's limb Strength (§8) and the effort-required check (§3); in a fight, a group over 0.6
  fatigue makes that limb's actions cost more of the Endurance pool (proposed: ×1.25; the spend is
  Efficiency's, Rex, so this is a multiplier on the cost, open for the combat keeper); Dexterity dips at
  high fatigue (a tired hand shakes).
- **Visible face:** "my arms are gone" after the pumps; a crew mate who switches hands on the line; the
  pull-in stage of fishing getting harder on a long fight (`FISHING.md` stage 7 already names Endurance).
- **Mark:** **(proposed)**.

## 5. Training and adaptation

<!-- table:muscular.training -->
*Training, adaptation and disuse constants* (science; confidence medium; source: Protein 1.6 g/kg/day is the plateau for resistance-training gains (Morton et al. 2018 meta-analysis, BJSM; MUS-PROT). DOMS peaks 24 to 72 h and clears by 7 days (MUS-DOMS). Muscle protein synthesis stays raised 24 to 48 h after lifting (textbook). Supercompensation (gain after recovery) is the Banister logic applied per group. Detraining: strength holds for about 2 to 3 weeks then falls; muscle mass loss is faster than strength loss (textbook, medium). Novice gains are fast (10 to 30% strength in 8 to 12 weeks), trained gains slow.)

| Constant | Value | Unit | Note | Mark |
|---|---|---|---|---|
| Stimulus per hour of work | sum over groups of activation% x minutes / 60 x intensity factor | index | the activation profile times time; heavy loads count more (intensity = MET/6) | proposed |
| Overload threshold | 40 | % of the group's max | below it, work maintains but does not grow the group (endurance only) | proposed |
| Conversion window | 24 to 72 | h | stimulus converts to development only after this rest for the group; converts 0 if the group works hard again inside 24 h (overtraining) | proposed |
| Conversion rate (novice, development under 40) | 0.5 | development per 10 stimulus | fast beginner gains | proposed |
| Conversion rate (trained, development 40 to 70) | 0.2 | development per 10 stimulus |  | proposed |
| Conversion rate (advanced, over 70) | 0.07 | development per 10 stimulus | the hidden genetic max caps it (STATS.md) | proposed |
| Protein gate | 1.6 g/kg/day = x1.0; 0.8 = x0.5; 0.4 = x0.1 | multiplier on conversion | NUTRITION.md | proposed |
| Energy gate | balance >= 0: x1.0; -500 kcal: x0.6; -1000: x0.2 (and development decays 0.1/day) | multiplier | NUTRITION.md | proposed |
| Sleep gate | slept >= 7 h: x1.0; 5 h: x0.6; under 4: x0.3 | multiplier | PHYSIOLOGY.md | proposed |
| Disuse decay | none for 14 days; then -0.3 development/day toward the limb's genetic min | development | Rex: disuse lowers attributes toward the minimum | rex (rule), proposed (rate) |
| DOMS | pain 2 to 4 for 24 to 72 h after a load over 70% on an untrained group | MEDICINE pain | clears by day 7; smaller on trained groups | proposed |
| Age factor on conversion | x1.0 to 30, x0.8 at 45, x0.6 at 60 | multiplier | PHYSIOLOGY ageing | proposed |
<!-- /table -->

- **[science]** Resistance-training gains plateau at about 1.6 g protein/kg/day (MUS-PROT); muscle protein
  synthesis stays raised 24–48 h after a session; soreness peaks at 24–72 h (MUS-DOMS); novices gain fast,
  the trained slowly; strength holds for 2–3 weeks of detraining before falling.
- **[model] Supercompensation (proposed, outside AI; kept):** a day of heavy lifting makes you weaker that
  evening (fatigue) and stronger days later (conversion), which ties rest, nutrition and the food economy
  together. The conversion gates (protein, energy, sleep) are how `NUTRITION.md` and `PHYSIOLOGY.md` reach
  the muscles without keeping food rules of their own. Rex's "eat enough of something that pumps up muscles
  and you get a boost" is the protein gate at ×1.0 plus `NUTRITION.md` §7 boosts (proposed).
- **Effects:** development → limb Strength (§8) → every skill that reads Strength in `STATS.md` §2.
- **Visible face:** a crew mate who "filled out" after a season on the pumps; the gym's progress in the
  player's own regimen (fiction: the one place a body number may be shown as a lift that comes up or not).
- **Mark:** **(proposed)**; constants placeholders.

## 6. Injuries and recovery

<!-- table:muscular.injuries -->
*Muscle and tendon injuries* (science; confidence medium; source: Strain grading I to III is clinical standard; recovery times are typical ranges (textbook). Risk factors: fatigue, cold, no warm-up, a load far above the group's development, prior injury.)

| Injury | Trigger (model) | Condition set to | Pain | Recovery (days) | Visible face | Mark |
|---|---|---|---|---|---|---|
| Grade I strain (pulled muscle) | effort over 90% on a group at fatigue over 0.6: 5% per event; cold x2 | 0.8 | 3 | 7 to 14 | 'pulled something' hauling; favours the side | proposed |
| Grade II strain (partial tear) | effort over 100% (a slip, a sudden load): 2% per event; x3 if fatigued | 0.5 | 6 | 21 to 42 | cannot use the limb for heavy work; swelling | proposed |
| Grade III (rupture, e.g. a torn hamstring) | a fall arrested by one limb, a maximal effort on a cold group: 0.5% | 0.2 | 8 | 90 to 180; may never return fully (permanent cap) | the crew mate who limps for a season | proposed |
| Tendinopathy (overuse) | the same group over 60% for 10+ days without a rest day | 0.7 | 4 | 14 to 60 with rest | the rigger whose elbow aches; the oarsman's wrists | proposed |
| Cramp | hydration deficit over 2% and salt low, group fatigue over 0.7 | 1 | 5 | minutes | doubles up at the capstan | proposed |
| Back injury (lifting with a bent back) | a lift over 80% with erectors fatigued: 3% | 0.5 | 7 | 14 to 60 | cannot straighten; out of the heavy duties | proposed |
<!-- /table -->

- **[model]** A strain sets `condition` and a pain level (`MEDICINE.md` §4), heals on the `MEDICINE.md`
  clock with its modifiers (rest, protein, vitamin C, age), and leaves a permanent cap after a grade III.
  Risk multipliers: fatigue over 0.6 ×2, cold (core under 36 °C) ×2, no warm-up ×1.5, a prior injury on
  the group ×2.
- **Visible face:** the surgeon's report; the crew mate who sits out the heavy work; the limp.
- **Mark:** **(proposed)**.

## 7. The gym

<!-- table:muscular.gym -->
*The gym regimen (Rex's gym simulator): what a week looks like* (fiction; confidence medium; source: Rex: the character goes to the gym, designs a regimen and conducts it; pirates probably had no gyms, disbelief suspended (COMBAT.md 4b). The push/pull/legs/cardio/combat/rest week and the early equipment (stones, ropes, rowing, barrels, weapon drill) are ChatGPT's (proposed, outside AI). The minigame itself is Rex's to design (house rule).)

| Day | Session | Actions (activation table) | Groups loaded | Mark |
|---|---|---|---|---|
| 1 | Push | pressing a cask overhead; pushing a gun carriage | deltoids, chest, triceps | proposed (outside AI) |
| 2 | Pull | pull-ups on a yard; rope rows; hauling a weighted line | lats, trapezius, rhomboids, biceps, grip | proposed (outside AI) |
| 3 | Legs | squatting with a cask; lifting a stone; the capstan | glutes, quads, hamstrings, calves, erectors | proposed (outside AI) |
| 4 | Cardio | rowing the boat; running the beach; swimming | whole body, the heart (PHYSIOLOGY Banister) | proposed (outside AI) |
| 5 | Combat drill | cuts, thrusts, parries with a weighted cutlass; grapple | shoulders, forearms, core, legs; the Swordplay skill | proposed (outside AI) |
| 6 | Rest or light | walking, fishing | recovery (conversion window) | proposed (outside AI) |
| 7 | Rest | - | recovery | proposed (outside AI) |
<!-- /table -->

- **(Rex)** Design a regimen and conduct it. **(proposed, outside AI)** A weekly plan of push, pull, legs,
  cardio, combat, rest; early equipment is stones, ropes, rowing, barrels and weapon drill, later facilities
  as town progression (a town place: the town keeper's; the minigame: Rex's to design).
- **[model] (proposed)** The regimen is a list of (exercise, sets, load) per day; each exercise is an
  activation row; the sim runs it through §3–§5 like any duty. The gym's only special rule is choice of
  load: the player picks the stone, so overload is deliberate. Rest days matter because of the conversion
  window.
- **[history]** Period strength culture was work itself; organised exercise with weights existed in
  Europe (fencing schools, wrestling, the "gymnastic" tradition revived in the 16th century: Mercurialis,
  *De arte gymnastica*, 1569) but not on ships. Disbelief suspended, per Rex.
- **Mark:** **(Rex)** the simulator; **(proposed, outside AI)** the week; the minigame **(open, Rex's)**.

## 8. From muscles to the limb's Strength (and movement)

<!-- table:muscular.limb_strength -->
*How a limb's Strength is computed from its groups (proposed answer to the replace-or-compute question)* (model; confidence low; source: Rex left open whether muscle replaces per-limb Strength or Strength is computed from it (COMBAT.md 4b; ChatGPT: replaces). This table is the 'computed' reading, offered because it keeps STATS.md's Strength number alive for every system that already reads it while the muscles underneath make it per limb and trainable by what you do. Weights are the keeper's.)

| Limb stat | Formula (development x (1 - fatigue) x condition, per group) | Weights | Mark |
|---|---|---|---|
| Right arm Strength | weighted mean of the right arm's groups, scaled to the STATS 1 to 20 range | grip 0.2, lats 0.15, biceps+brachialis 0.15, triceps 0.15, deltoids 0.15, pecs 0.1, trap_mid+rhomboids 0.1 | proposed |
| Left arm Strength | the same with the left groups | the same | proposed |
| Right leg Strength | weighted mean of the right leg's groups | quads 0.3, glute_max 0.25, hamstrings 0.2, calves 0.15, hip_flex+adductors 0.1 | proposed |
| Left leg Strength | the same | the same | proposed |
| Movement (tiles) | f(min(leg L, leg R) x 0.7 + mean x 0.3, balance (glute_med, deep_core, Agility), fatigue, injuries, load) | COMBAT 4a: the weaker leg limits; not a plain sum | proposed (outside AI), formula proposed |
| Arm Dexterity (per limb) | NOT muscle: Dexterity is control; the hand and forearm extensors set a cap only (condition x fatigue over 0.8 dips it x0.9) | - | proposed (outside AI: muscle is force only) |
| Whole-body lift and carry | erectors + glutes + quads + grip, the weakest of them limiting | - | proposed |
<!-- /table -->

- **(open, Rex's)** Replace or compute. The computed reading above keeps `STATS.md`'s Strength number alive
  (every skill row reads it) while muscles underneath make it per limb and trainable by what you do; the
  replace reading would mean every skill row names groups instead. The keeper recommends **compute**, for
  the smaller blast radius; ChatGPT's "muscle is force only; Reflexes and coordination decide speed and
  accuracy; skill decides technique" (proposed, outside AI) is kept either way.
- **Effects:** `BODY.md` §2 reads the limb values; `COMBAT.md` §4a's movement rule (the weaker leg limits)
  is honoured in the movement row.

## 9. What this file hands to the others

| To | What | Where it is used |
|---|---|---|
| `BODY.md` | per limb: Strength (computed), fatigue, condition, caps; whole-body lift; movement inputs | capability |
| `PHYSIOLOGY.md` | the day's muscular work (part of MET-hours); DOMS pain | fatigue, sleep quality |
| `NUTRITION.md` | protein and energy demand for conversion; lean mass | body composition |
| `MEDICINE.md` | strains, tendinopathy, back injuries as wounds | healing clock, pain |
| `../combat/COMBAT.md` | per-action effort required; fatigue cost multiplier (open) | the fight |
| `../DUTIES.md`, `../minigames/FISHING.md` | effort-required checks per stage | duty and minigame results |

## Open for Rex

1. Replace or compute (§8). The keeper recommends compute.
2. Genetic min–max per limb, and whether groups vary inside the limb's range.
3. The group list: cut or grow (31 groups, 58 entries).
4. Whether a fatigued limb raises an action's point cost in a fight (touches Efficiency, Rex's).
5. The gym minigame and the gym as a town place (town keeper).
6. All numbers are placeholders; the activation profiles are a belt data task once the rules stand.

## Sources

`../SOURCES.md` keys MUS-*: anatomy (textbook), Xia and Frey Law 2008 and Frey Law et al. 2012 (3CC),
Rohmert endurance curves, Morton et al. 2018 (protein), DOMS reviews, the climbing and rowing EMG studies,
grip-strength norms (Tomkinson 2025), Mercurialis 1569.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened from Rex's §4b decisions; groups, values, activation profiles (26 actions), 3CC fatigue, training constants, injuries, the gym week, the computed-Strength reading; tables in `data/muscular.json` | keeper |
