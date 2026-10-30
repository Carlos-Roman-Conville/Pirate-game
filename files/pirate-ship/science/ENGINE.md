# The realism engine: first operational build (body-and-world keeper, 2026-10-29)

Rex (2026-10-29): build it, so we know it works; fill in whatever the components need to work efficiently
and as realistically as possible; **no made-up rules to make things work: the formulas are real-world
formulas with real-world numbers.** ChatGPT's shape (outside AI) for the build, adopted: five
foundational services and one operational test that exercises the whole chain. The engine is a shared
package, `Toolchain/realism/`, independent of the pirate game (the economy was decided the same way:
`balance/BALANCE.md` C5 24), TypeScript with vitest like the game's own code. The pirate game imports it
later as its first configuration.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Everything about the architecture here is
**(Rex, 2026-10-29)** by his "build it"; the constants are **[science]** with their sources; the
simplifications are **[model]** and named as such.

## 1. The five services

| Service | What it is | In the package |
|---|---|---|
| **Registry** | stable ids for substances (with real physical constants), materials (what a component is made of), components (equipment, organs, structures with ports), assemblies | `src/registry.ts`; data in `data/substances.json`, `data/materials.json`; equipment from the catalogue (`body/data/equipment.json`) later |
| **Connection graph** | typed ports and edges: fluid, gas, heat, power, mechanical, material; a port carries what can cross it (a phase, a direction, a resistance) | `src/graph.ts` |
| **Conservation and process engine** | mass, energy (and later charge) accounting per step; heat transfer, phase change, combustion, mixing and transport as processes that move quantities along edges; every process must balance | `src/process.ts` |
| **Scheduler** | fast steps for active processes (seconds), slow steps for bodies, ecology and settlements (minutes to days); a fixed order within a step | `src/scheduler.ts` |
| **Validation and observability** | a trace of every transfer: source, sink, quantity, the process that did it, and a conservation check per step; an experiment can be read back to see why it failed | `src/trace.ts` |

**(proposed, outside AI; agreed)** The material registry holds properties, never behaviour: water's
constants live once; the plumbing decides how it flows; the biology decides what a kidney does with it.
A separate component registry holds equipment, organs and structures with their ports, so that a blood
vessel, a copper pipe and a plant's xylem share fluid transport with different parameters.

## 2. The physics the first build runs on (real formulas, real numbers)

| Mechanism | Formula | Constants (SI) | Source |
|---|---|---|---|
| Sensible heat | Q = m · c_p · ΔT | water c_p 4186 J/(kg·K); air 1005; copper 385; glass 840; iron 450 | ENG-CP |
| Latent heat of vaporisation (water) | Q = m · L ; L(T) ≈ 2501 − 2.37·T kJ/kg (T in °C), 2257 at 100 °C | L(100 °C) = 2.257 MJ/kg | ENG-LAT |
| Vapour pressure (water), Antoine | log₁₀ p(mmHg) = A − B / (C + T), T in °C | A 8.07131, B 1730.63, C 233.426 (1 to 100 °C) | ENG-ANT |
| Boiling | a liquid boils when its vapour pressure reaches the pressure over it; below that it evaporates from the surface at a rate ∝ (p_sat − p_partial) | at 760 mmHg water boils at 100.0 °C; at 577 (2,256 m) at 92.5 °C | ENG-ANT |
| Combustion heat | Q = m_fuel · HHV | charcoal 30 MJ/kg; dry wood 16; ethanol 26.8; the usable share set by the heat source's efficiency | ENG-HHV |
| Combustion stoichiometry (charcoal as carbon) | C + O₂ → CO₂ : 1 kg C needs 2.67 kg O₂ (about 9.3 m³ of air at STP) and makes 3.67 kg CO₂; starved of air, 2 C + O₂ → 2 CO | molar masses C 12, O₂ 32, CO₂ 44, CO 28 g/mol | ENG-STOICH |
| Heat transfer across a wall and to the air | Q̇ = U · A · ΔT (overall coefficient), or h · A · ΔT for convection | free convection in air h ≈ 5 to 25 W/(m²·K); boiling water to a copper wall h ≈ 1,000 to 10,000; the first build uses U = 500 for a flame to a copper vessel and h = 10 for losses to still air | ENG-HT |
| Ideal gas | p V = n R T | R 8.314 J/(mol·K) | ENG-GAS |
| Box model of a room | V dC/dt = S − Q (C − C_out), Q = ACH · V / 3600 | from `GAS_DYNAMICS.md` | GAS-BOX |
| Humidity from leaks | vapour that escapes the apparatus raises the room's partial pressure of water; relative humidity = p_v / p_sat(T) | Antoine again | ENG-ANT |
| A body's heat (first build) | metabolic heat M = MET · 3.5 mL O₂/kg/min · 20.1 kJ/L; sweat evaporation removes up to 2.43 MJ per kg of sweat; sweat rate from `PHYSIOLOGY.md` §4 | the body docs' constants | PHY-* |
| Measurement error | reading = true + offset + N(0, σ); offset drifts with days since calibration | a Fahrenheit thermometer: σ 0.5 K, drift 0.05 K/day placeholder | `SCIENTIFIC_EQUIPMENT.md` §4 |
| Control noise | the operator's fuel feed oscillates around the target with amplitude ∝ (1 − skill/100) | skill from `STATS.md` (0 to 100) | the skill principle (Rex) |

**[model]** The first build is lumped (one temperature per component, no spatial gradients), explicit
Euler with a small step, and treats vapour transport along a pipe as instantaneous at the vapour's rate.
Those are simplifications the trace names; none is a made-up rule, and each can be replaced by the fuller
physics without changing the services.

## 3. The operational test: a still in a room

ChatGPT's scenario (outside AI), adopted: a character in a room with a charcoal heat source, a copper
vessel of water, a worm condenser in a water tub, connecting pipes and a collection vessel. The engine
must, from the formulas above and nothing else:

1. burn charcoal at the fed rate, consuming the room's oxygen and producing CO₂ (and CO if starved);
2. heat the vessel and its water (sensible heat), lose heat to the room (convection), and start boiling
   when the water's vapour pressure reaches the room's pressure (100 °C at sea level, 92.5 °C at 2,256 m);
3. vaporise water at the net heat rate over the latent heat, send the vapour down the pipe to the
   condenser, condense what the tub's water can cool (the tub warms by the latent heat it takes),
   collect the distillate, and lose to the room what the condenser cannot handle (humidity rises);
4. conserve water mass (liquid + vapour + distillate + lost to room = initial) and energy (fuel burned =
   sensible + latent + losses + unburnt) within tolerance, every step, in the trace;
5. let the character's skill set the fuel-feed noise, so a poor distiller boils over and wastes fuel;
6. wear the vessel by the run (condition falls with time at heat), and let a drifted thermometer
   misreport the temperature while the physics proceeds on the true one;
7. heat the character: the room's air warms from the fire and the losses, the character's sweat and
   water deficit follow `PHYSIOLOGY.md`, and the CO₂ in the room follows the box model;
8. write journal observations: the thermometer's readings (wrong if drifted), the distillate's mass, the
   boiling point observed.

The test passes when the numbers match the physics: boiling at the right temperature for the pressure,
the distillate rate equal to net heat over latent heat, conservation holding, and the altitude case
boiling lower. It fails loudly through the trace if any process does not balance.

## 4. What comes after the first build (the belt)

- Wire the catalogue (`body/data/equipment.json`) into the component registry so every researched piece
  is a component with ports and capability numbers.
- Wire the substance database (`body/data/chemistry.json`) into the registry and add the reaction solver
  over the reaction records (possibility by free energy, feasibility by rate at the reached temperature).
- The grid transport for the combat map (`GAS_DYNAMICS.md` §4).
- The body as an assembly of organ components on the same graph (`ANATOMY.md`, `CIRCULATION.md`): the
  blood as a fluid edge system, the lungs as a gas port, the gut as a material port.
- A Simulation Laboratory view in the dashboard driving the package in the browser (the package is
  plain TypeScript with no DOM dependency, so it runs there too).
- The pirate game imports the package (how: a local npm package or a path alias, the open question of
  `BALANCE.md` C5 24).

## Open for Rex

1. The package's home (`Toolchain/realism/`, its own git repo) and name.
2. How the game imports it (local package, path alias, submodule).
3. Which worker builds the rest (Codex for the solver and the grid; Composer for data wiring and tests).

## 5. Built (2026-10-29): the first operational build

The package lives at `E:/AI Programs/Toolchain/realism/` (its own git repository, `@rex/realism`, plain
TypeScript, vitest). It holds the five services of §1 and the still-in-a-room scenario of §3
(`src/lab/still.ts`), with every formula in `src/physics.ts` citing its ENG- source key. `npm test` runs
12 checks and all pass: boiling at 100.0 °C at sea level and 92.5 °C at 2,256 m; distillate bounded by the
net heat over the latent heat; the vessel's energy balance (sensible, latent, losses, the heat the vapour
carries out) within 2 %; water and charcoal conserved on every one of the 14,400 steps with the trace
naming every transfer; the room's oxygen falling and CO₂ rising from the fire, carbon monoxide when
starved; the distiller sweating by PHYSIOLOGY.md §4's rate; a thermometer 60 days from calibration
misreading while the physics runs on the true temperature; a novice's unsteady feed burning more charcoal
per kilogram than a master's; wear on the hot vessel. A two-hour sea-level run at skill 60 (read with
`npm run lab -- 0 60`): first boil at 30 min, 2.12 kg of distillate from 0.79 kg of charcoal, the room at
60 °C and 10,900 ppm CO₂ with the door open, the distiller 3.2 % down on water. **[model]** Named
simplifications of this build, each replaceable without touching the services: lumped temperatures,
explicit one-second steps, no evaporation below the boiling point, instantaneous vapour transport, a room
with no walls to soak up heat (so it runs hot), U and h placeholders inside the real ranges (ENG-HT), and
the body as one lumped mass. Nothing in it is a game rule. **(proposed)**

### 5a. One engine, many games **(Rex, 2026-10-29)**

Rex's decision (relayed from ChatGPT, 2026-10-29): `Toolchain/realism` is the authoritative shared engine.
The pirate game integrates it as a local package dependency (`web/package.json`: `"@rex/realism":
"file:../../../../Toolchain/realism"`), never a Vite alias to its source and never a copied tree, and imports
only its public API (`src/index.ts`, the package's `exports`). All formulas, material definitions and
simulation logic stay owned by the package; the game owns only the situation it hands in. The dashboard and
the game consume the same scientific data, and other games use the package without depending on
pirate-ship. First integration: `web/src/world/galleyStill.ts` wraps the still for a galley situation
(altitude, air temperature, the tender's skill, minutes, days since the glass was checked) and returns what
the game shows and journals; `galleyStill.test.ts` proves it inside the game (boiling 100 °C on deck and
92.5 °C in the hills, distillate, conservation, a neglected glass caught against the expected boil). The
dashboard's Simulation Laboratory will consume a browser bundle of the same package (belt task to follow
once 2507 to 2509 land). **[model]**

### 5b. Three layers, one home for every number **(Rex, 2026-10-29)**

Rex (relayed from ChatGPT, 2026-10-29): the engine must be completely independent of pirate-ship, not
merely imported; universal mechanisms and reference data separate from pirate content. The audit and the
migration plan are `Toolchain/realism/MIGRATION.md`: three layers (universal engine, scientific data
library, the game), a table-by-table dependency map of the 18 data files (the split is by column, keyed by
id, never a file move), what stays game-specific by name, and seven phases, of which only one touches the
game's data and does so once by a reviewed script. Nothing has moved yet; all tests pass. **[model]**

## Sources

`../SOURCES.md` keys ENG-*: standard thermodynamic constants (NIST Chemistry WebBook for Antoine
constants and heats of combustion; Engineering ToolBox summaries for specific heats, latent heats and
convection coefficients; standard chemistry for stoichiometry), listed with URLs there.

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened on Rex's "build it": the five services, the physics table with constants, the still-in-a-room test, what comes after | keeper |
