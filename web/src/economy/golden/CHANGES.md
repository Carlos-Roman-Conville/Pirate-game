# Golden changes

## 2026-10-30 2651-pirate-ship-settlement-material-classes

Keys changed: `settlement` (every building record: `decayClass` and `exposure` added, and conditions held or decayed per class). `economy`, `events`, `ledger`, `log` and the per-day `rows` are unchanged.

Reason: building conditions under decay by material class (Toolchain/settlement VALIDATION.md §4b, unit 2646); the starting port's classes and exposure come from STARTING_TOWN.md Q1b.
