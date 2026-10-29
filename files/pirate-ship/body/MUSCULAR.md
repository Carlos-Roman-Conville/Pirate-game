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
| contractile (was 'development') | 0 to 100 (genetic max per group, inherited from the limb's hidden max) | index: 50 is an ordinary sailor | the tension stimulus after rest and food (hypertrophy: more contractile protein); disuse decay | force potential, muscle mass, limb Strength (computed) | proposed (outside AI; split 2026-10-29) |
| oxidative | 0 to 100 | index: mitochondria, capillaries and fuel enzymes as one number | the aerobic stimulus (long work at a share of capacity); disuse decay faster than contractile (weeks) | the group's endurance time and its recovery rate R between efforts; local muscular endurance | proposed (outside AI; split 2026-10-29) |
| fatigue | 0 to 1 | fraction of fibres in the fatigued compartment (3CC) | work by the activation profile; recovers by R | today's force = development x (1 - fatigue) | proposed (outside AI) |
| condition | 0 to 1 | 1 = sound; strain grades 1 to 3 at 0.8, 0.5, 0.2 | injury; healing (MEDICINE clock) | force cap; pain | proposed (outside AI) |
| stimulus_tension, stimulus_aerobic | 0 to 100 each | two indices of unconverted training signal | added by work by the stimuli table; each converts to its own state at the overnight tick if rest and food allow; decays if not. Fatigue is not stimulus: a man can be exhausted with no useful signal, and a good session needs no exhaustion | contractile, oxidative | proposed (outside AI; split 2026-10-29) |
| mass | kg (derived) | kg | contractile x the body's lean mass share (NUTRITION) | body composition | proposed |
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

  with F and R from the table **per second**, R multiplied by `restMult` (1.0 resting, 0.5 light work,
  0.3 at sea in a storm) and by whole-body factors (aerobic_today/40, hydration, glycogen: each a
  multiplier 0.5–1.0). **Time step (fixed after the audit):** the equations integrate in seconds; an
  action of m minutes steps 60·m times (or uses the closed form, since F and R are constants), a combat
  turn steps its length in seconds (the combat keeper's number), and the overnight recovery uses the
  closed form `MF(t) = MF₀·e^(−R·restMult·t)` over the night's seconds. Nothing in the family quotes F or
  R per minute. A rest day returns a group to near zero fatigue; a hard day leaves 0.2–0.4 by morning.

<!-- table:muscular.fatigue_rates -->
*Three-compartment fatigue model (3CC): rates by joint* (science; confidence medium; source: Xia and Frey Law 2008 (J Biomech): muscle in resting, active, fatigued compartments; F = fatigue rate active to fatigued, R = recovery rate fatigued to resting, per second. Fitted values from Frey Law, Looft and Heitsman 2012: ankle F 0.00589 R 0.0182; shoulder F 0.00058 R 0.00168; a 2018 extension adds a rest multiplier. MUS-3CC)

| Joint (groups) | F (per s) | R (per s) | Note | Mark |
|---|---|---|---|---|
| Shoulder (deltoids, rotator cuff) | 0.00058 | 0.00168 | fitted 2012 | proposed |
| Elbow (biceps, brachialis, triceps) | 0.0012 | 0.0036 | interpolated by the keeper between shoulder and ankle | proposed |
| Grip (forearm, hand) | 0.0025 | 0.0075 | interpolated; grip tires fast and recovers fast | proposed |
| Trunk (erectors, abs, obliques) | 0.001 | 0.003 | interpolated | proposed |
| Hip and knee (glutes, quads, hamstrings) | 0.003 | 0.009 | interpolated | proposed |
| Ankle (calves, tibialis) | 0.00589 | 0.0182 | fitted 2012 | proposed |
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
| Tension stimulus (per action) | sum over groups of activation% x reps x loadFactor, loadFactor = 0 under 40% of the group's max, rising to 1.0 at 80%+ | index | mechanical tension, not energy: a MET says how much a body burns, not how hard a muscle pulls (fixed 2026-10-29 after ChatGPT's point) | proposed |
| Aerobic stimulus (per action) | sum over groups of activation% x minutes / 60 x min(1, effort / oxidativeShare), counted only while the action lasts over 10 minutes at 20 to 70% of the group's max | index | long work at a sustainable share of capacity: rowing, pumping, the capstan, a climb that goes on | proposed |
| Technical practice (per action) | minutes x the movement pattern's share of the action | index | feeds the pattern's neural recruitment (patterns table) and the skill (STATS 2), not the muscle | proposed |
| Overload threshold (tension) | 40 | % of the group's max | below it, work builds oxidative capacity and technique but not contractile size | proposed |
| Conversion window | 24 to 72 | h | stimulus converts to development across this window after a hard session; a second hard session inside it does not cancel the first: conversion that night is scaled by min(1, hoursSinceLastHardSession / 48) and unconverted stimulus carries over, so adaptation is continuous and only sustained overload with no rest days (fatigue over 0.6 at the tick) stalls it | proposed |
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

## 5a. The adaptation model: why a muscle changes (2026-10-29, after ChatGPT's two notes, outside AI)

Rex asked whether there is a logical system for muscles to grow, the way fat has one. There is, and §5's
single development score hid it: one stimulus pool fed one number, so a rower and a smith would have
grown the same way. The split below is ChatGPT's structure, which the keeper agrees with after arguing it
down from six states per muscle: **two long-term states per muscle** (contractile, oxidative), **the
tendons per joint**, **neural recruitment per movement pattern**, and **three stimuli per activity**.
All **(proposed)**; the biology is established, the numbers are placeholders.

<!-- table:muscular.adaptation -->
*The adaptation model: what lives at which level (after ChatGPT's two notes of 2026-10-29)* (science; confidence medium; source: Exercise physiology: hypertrophy from mechanical tension and protein accretion; mitochondrial biogenesis, capillarisation and enzyme changes from sustained aerobic demand; early strength gains largely neural (motor-unit recruitment, 4 to 8 weeks) and movement-specific; tendons remodel slowly (months) and tolerate repeated load by that remodelling (standard references: ACSM, McArdle Katch and Katch). The structure is ChatGPT's (outside AI), the keeper agreeing: two long-term states per muscle, tendons per joint, recruitment per movement pattern, three stimuli per activity. MUS-ADAPT)

| Level | States | Changed by | Timescale | Feeds | Mark |
|---|---|---|---|---|---|
| Per muscle group | contractile, oxidative, fatigue (3CC), condition | tension stimulus; aerobic stimulus; work; injury | contractile weeks to months; oxidative days to weeks (and lost in weeks); fatigue minutes to a night | force potential and mass; endurance and recovery; today's force | proposed (outside AI) |
| Per tendon and joint | load tolerance, injury state, recovery | repeated loading below the tolerance raises it slowly; a load over it strains it; rest heals it (MEDICINE clock) | months to gain; days to weeks to heal a strain; a rupture months | the cap on how hard the muscles across it may pull without injury (the injuries table); joint range of motion as a cap on reach (open) | proposed (outside AI) |
| Per movement pattern | neural recruitment efficiency, coordination | technical practice of actions that use the pattern | fast: weeks for the first gains, then slow | force actually produced in that pattern (recruitment x contractile), and the skill's technique side (STATS 2) which stays the skill's | proposed (outside AI) |
| Per activity (the activation row) | tension stimulus, aerobic stimulus, technical practice | the action's nature: load, reps, duration, effort, which patterns it uses | - | the three levels above | proposed (outside AI) |
| Whole body (PHYSIOLOGY) | cardio fitness (Banister), systemic fatigue, oxygen delivery | the day's MET-hours | weeks | aerobic_today and the Endurance pool; the oxidative states read it as a ceiling | proposed |
<!-- /table -->

- **[science]** Muscle grows (hypertrophy) by laying down contractile protein under mechanical tension;
  mitochondria, capillaries and fuel enzymes grow under sustained aerobic demand and make a muscle last
  and recover, not get bigger (Rex's premise corrected by ChatGPT, rightly); the first weeks of any new
  lift make a man stronger by recruiting more of the muscle he has, before it grows; tendons remodel over
  months, so a fast-growing muscle can outrun its tendon (MUS-ADAPT).
- **[model]** Each state keeps the logistic-toward-max shape of §5 with its own stimulus, gates and
  timescale:

      Δcontractile_g = k_c · S_tension_g · restGate · proteinGate · energyGate · sleepGate · (1 − contractile_g / max_g)
      Δoxidative_g   = k_o · S_aerobic_g · restGate · energyGate · (1 − oxidative_g / max_g)      (lost at 3× the rate in disuse)
      Δrecruitment_p = k_n · practice_p · (1 − recruitment_p / 100)                               (fast at first, then slow)
      Δtolerance_t   = k_t · loadUnderTolerance_t · (1 − tolerance_t / max_t)                     (months); strain if load > tolerance

  Today's force in an action = Σ over required groups of `contractile × recruitment(pattern) × (1 −
  fatigue) × condition`, the weakest limiting; endurance in it reads `oxidative`, the group's R and the
  whole body's `aerobic_today`. Fatigue (3CC, §4) stays the short-term state and is **not** a stimulus.
- **What it buys:** the rower and the smith after three months (endurance versus force and grip); the
  jobs swapped; the one-armed smith; a leg that loses muscle in a splint while the heart keeps its
  fitness; a gym that can aim at size, endurance, tendon or technique.

<!-- table:muscular.patterns -->
*Movement patterns (neural recruitment lives here, not per muscle and not in the skill)* (model; confidence medium; source: ChatGPT's point (outside AI), kept: a man gets stronger at a movement by recruiting more of the muscle he has, without more muscle and without more skill; Swordplay is technique and timing, Reflexes is response speed, neither is maximal recruitment. The pattern set is the keeper's; each activation row names its patterns.)

| Pattern | What it is | Main groups | Example actions | Recruitment index (0 to 100; 50 ordinary) | Mark |
|---|---|---|---|---|---|
| Horizontal pull | pulling toward the body | lats, trap_mid, rhomboids, delt_rear, biceps, forearm_flex | hauling a line, rope rows, pulling apart | per character | proposed |
| Vertical pull | pulling down from overhead | lats, trap_lower, biceps, forearm_flex | climbing the shrouds, pull-ups on a yard | per character | proposed |
| Horizontal push | pushing away | pec_stern, pec_clav, delt_front, triceps | a thrust, pushing a gun carriage, a shove in a grapple | per character | proposed |
| Vertical push | pushing overhead | delt_front, delt_mid, triceps, trap_upper | pressing a cask, working a yard overhead | per character | proposed |
| Squat and hinge | driving with the legs and hips from a bend | quads, glute_max, hamstrings, erectors | lifting a stone, the capstan, standing from a crouch under a load | per character | proposed |
| Grip | holding on | forearm_flex, hand | everything with a rope, a cutlass, a fish on the line | per character | proposed |
| Rotation | twisting the trunk | obliques, abs, erectors | a cutlass cut, a cast, the hammer at the anvil | per character | proposed |
| Carry and brace | holding a load against the body | trap_upper, erectors, deep_core, forearm_flex | carrying a cask, bracing on a rolling deck | per character | proposed |
| Locomotion | running and jumping | glute_max, hamstrings, quads, calves, hip_flex | a charge, a jump between rails, the beach run | per character | proposed |
| Fine manipulation | the hand's control (overlaps Dexterity; here only the recruitment side) | hand, forearm_ext | needle, cards, a knot | per character | proposed (open: whether this pattern exists apart from Dexterity) |
<!-- /table -->

<!-- table:muscular.tendons -->
*Tendons and joints: load tolerance* (model; confidence medium; source: Tendons adapt slower than muscle (months) so a fast-growing muscle can outrun its tendon: the overuse injuries of the injuries table. Rupture needs a load far over tolerance on a cold or fatigued tendon. The set and numbers are the keeper's placeholders.)

| Tendon or joint | Spans | Tolerance index (0 to 100) | Common strain here | Raised by | Mark |
|---|---|---|---|---|---|
| Rotator cuff and shoulder joint | shoulder | per character | the rigger's shoulder; a dislocation in a fall | repeated overhead and pulling work under tolerance | proposed |
| Elbow (biceps and common flexor and extensor tendons) | elbow | per character | the oarsman's and smith's elbow | repeated pulling and hammering | proposed |
| Wrist and finger flexor tendons | wrist and hand | per character | the climber's finger; the line that strips a tendon | grip work | proposed |
| Lower back (lumbar discs and ligaments) | trunk | per character | the lift with a bent back | hinge work under tolerance; bracing | proposed |
| Hip and groin (adductor and flexor tendons) | hip | per character | the groin strain gripping a yard | squat and hinge work | proposed |
| Knee (patellar and hamstring tendons) | knee | per character | the jump that lands wrong | locomotion and squat work | proposed |
| Achilles and ankle | ankle | per character | the rupture in a sprint on a cold morning | locomotion | proposed |
<!-- /table -->

- **Where the lines fall (ChatGPT's correction of the keeper, agreed):** recruitment is not the skill
  (technique and timing, `STATS.md` §2) and not Reflexes (response speed); it is how much of the muscle
  the nerves can call on in that pattern, and it sits with the pattern. Tendon tolerance is not the
  muscle's condition; it sits with the joint.
- **Mark:** structure **(proposed, outside AI)**; the pattern and tendon sets and every number
  **(proposed)**; whether fine manipulation is a pattern apart from Dexterity **(open)**.

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
| Right arm Strength | weighted mean of the right arm's groups' contractile x mean recruitment of the arm's patterns, scaled to the STATS 1 to 20 range (the character-sheet number); the force in a given action is the action's own: contractile x the pattern's recruitment x (1 - fatigue) x condition per required group, the weakest limiting | grip 0.2, lats 0.15, biceps+brachialis 0.15, triceps 0.15, deltoids 0.15, pecs 0.1, trap_mid+rhomboids 0.1 | proposed |
| Left arm Strength | the same with the left groups | the same | proposed |
| Right leg Strength | weighted mean of the right leg's groups | quads 0.3, glute_max 0.25, hamstrings 0.2, calves 0.15, hip_flex+adductors 0.1 | proposed |
| Left leg Strength | the same | the same | proposed |
| Movement (tiles) | f(min(leg L, leg R) x 0.7 + mean x 0.3, balance (glute_med, deep_core, Agility), fatigue, injuries, load) | COMBAT 4a: the weaker leg limits; not a plain sum | proposed (outside AI), formula proposed |
| Arm Dexterity (per limb) | NOT muscle: Dexterity is control; the hand and forearm extensors set a cap only (condition x fatigue over 0.8 dips it x0.9) | - | proposed (outside AI: muscle is force only) |
| Whole-body lift and carry | erectors + glutes + quads + grip, the weakest of them limiting | - | proposed |
<!-- /table -->

- **(proposed, after the audit of 2026-10-29)** The weighted mean is the **character-sheet** reading:
  what Strength *is* when nothing is loading it. What a character can *do* is the action's own question,
  answered by §3's effort-required rule: each action's activation profile asks each group for its share of
  the load, and the weakest required group limits the action. So two sailors with the same sheet Strength
  can differ at pulling and pushing without a class bonus; the sheet number is for display and broad skill
  checks, the profile for the act. Joint range and tendon capacity are not modelled (open 7).
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
7. ~~Tendon capacity, neural recruitment~~ now in §5a (proposed). Still not modelled from the audit's
   list: joint range of motion, contraction velocity, bilateral coordination, flexibility, bone
   adaptation. Whether the sim goes that deep is Rex's.
8. §5a itself: keep the four-level structure, or cut back to the two muscle states.

## Sources

`../SOURCES.md` keys MUS-*: anatomy (textbook), Xia and Frey Law 2008 and Frey Law et al. 2012 (3CC),
Rohmert endurance curves, Morton et al. 2018 (protein), DOMS reviews, the climbing and rowing EMG studies,
grip-strength norms (Tomkinson 2025), Mercurialis 1569.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened from Rex's §4b decisions; groups, values, activation profiles (26 actions), 3CC fatigue, training constants, injuries, the gym week, the computed-Strength reading; tables in `data/muscular.json` | keeper |
| 2026-10-29 | Rex asked whether muscles have a logical growth system; ChatGPT's two notes (outside AI) and the keeper's reply: §5a, the adaptation model (contractile and oxidative per muscle, tendons per joint, recruitment per movement pattern, tension / aerobic / practice stimuli per activity); development split into contractile and oxidative; the tension stimulus no longer uses MET | keeper / outside AI |
