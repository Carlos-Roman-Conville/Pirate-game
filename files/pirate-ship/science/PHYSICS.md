# Physics: the shared physical layer (stub; body-and-world keeper, 2026-10-29)

ChatGPT's architecture (outside AI) names a `PHYSICS.md` for energy, pressure, heat, mechanics and the
like, "coordinated with the physics agent". **There is no physics agent**, and the family already carries
its physics where it is used. This stub says where, so a future keeper does not write a second copy, and
lists what a dedicated file would own if Rex assigns one. **All proposed.**

## Where the physics already lives

| Mechanism | Where | What it does there |
|---|---|---|
| Heat balance of a body | `../body/PHYSIOLOGY.md` §4–§5 | core temperature from metabolic heat and the air |
| Heat of reaction and of fuels | `CHEMISTRY.md` (reaction heat; heat of combustion) | the box's temperature in a fire |
| Pressure with altitude; partial pressures; gas laws | `../world/ATMOSPHERE.md` §2 | what the lungs see |
| Transport of gases (advection, diffusion, buoyancy) | `../world/GAS_DYNAMICS.md` | where a release goes |
| Immersion, cooling in water | `../body/PHYSIOLOGY.md` §5 | survival in the sea |
| Mechanics of the body (force, fatigue) | `../body/MUSCULAR.md` | what a limb can do |
| The ship's speed; wind and current | `../world/ENVIRONMENT.md` §3–§4, `../PIRATE.md` §5a (Rex) | days to port |
| Light, elevation, sound on the map | `../combat/COMBAT.md` §6 (the combat keeper's) | detection |
| Equipment capabilities (temperature, pressure, vacuum, power) | `SCIENTIFIC_EQUIPMENT.md` | what an apparatus can reach |

## What a dedicated file would own

Energy as one ledger (fuel to heat to work to loss), heat transfer coefficients the box model and the
body share, pressure vessels and explosions (the magazine, a bursting still), simple mechanics for
machines (a water wheel's power, a capstan's leverage), optics (the burning lens's temperature from its
diameter and the sun), electricity once the pile exists, and the units table all of it shares. None is
needed until the engine is built; each is a short research task when it is.

## Open for Rex

1. Who keeps physics (the body keeper has written what exists; the economy's machines and the ship's
   mechanics are other lanes).
2. Whether a units table shared across the whole project is wanted now (the gas units are in
   `GAS_DYNAMICS.md` §1).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | Stub opened; where the physics lives; what a file would own | keeper |
