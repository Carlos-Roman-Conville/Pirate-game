5250 parked

The adapter wiring needs an approved source for the Banister performance `base`.

Read-only inspection of `E:/AI Programs/Toolchain/realism/` found:
- `src/muscular.ts:279`: `bodyBanisterDay(w, body, loadMetHours, base)` requires all four arguments. Its documentation says the host calls once per training day, including rest days.
- `src/muscular.ts:259`: the delegated `muscularBanisterDay` explicitly documents that `base` is host supplied; neither function provides a default. Performance is `base + k1 * fitness - k2 * fatigue`.
- `data/library/physiology.json`, the `banister` table, defines daily load as MET-hours above 2 MET. `gears/aerobic-training-clamp.md` confirms that one hour at 10 MET supplies 8 MET-hours of load; rest supplies zero.
- That table has no performance-base row. Its training-factor minimum is a separate clamp baseline, not a documented value for the host's performance `base`. The source prose quotes a study's P0 in the study's own units, not an adapter default. `flags/physiology.md` also states that the library does not carry a baseline performance.

Question for Rex: which approved library row or engine default should supply the required performance `base` to `bodyBanisterDay`? Please define that source (or have the engine expose a documented default) before the adapter is wired.

No constant was invented. Per task 5250's parking condition, the adapter, its test, engine, game rules, and HANDOFF.md are unchanged.
