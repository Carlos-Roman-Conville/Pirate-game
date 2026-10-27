# Fishing (Rex's minigame design, 2026-10-26)

The first skill the player meets. Played from the dock (and later the boat). A crew fisherman does it for you
when posted; fishing beside him plays this minigame and adds to his catch (`../DUTIES.md`). The design is Rex's;
the stat hooks marked **(proposed)** are for him to keep or change.

## The stages

1. **Reading the water (Rex).** The view zooms out, widening your field of view so you see further out. Fish
   show as silhouettes: this reveals which fish are there. You don't have to see a fish to catch it, but aiming at
   one makes the rest easier.
2. **Aim (Rex).** A target appears; place it where you mean to throw.
3. **Direction (Rex).** A cone appears with a moving line inside it; where you press sets the direction. Higher
   skill means a slower line or a narrower cone.
4. **Power (Rex).** A meter fills up and down, with a target strength spot for the distance you aimed at. Over it
   and the cast lands past the target; under and it falls short.
5. **The lure (Rex).** Once the line is in the water, pick a rhythm, then play a rhythm game to lure the fish to
   bite. Different fish like different rhythms. Patience shapes the line's rhythm (a patient fisher's line moves
   less, or with more purpose).
6. **The bite (Rex, designed 2026-10-26).** A bobber showdown, in five beats:
   - **Waiting:** the bobber floats on the water, moving slightly with the waves.
   - **Nibbling:** the bobber occasionally twitches or dips slightly. These are warning cues, not necessarily the
     bite itself (pressing on a nibble is a false strike).
   - **Bite:** the bobber suddenly submerges, with a splash and a distinct sound.
   - **Hook setting:** the player presses the button within the reaction window.
   - **Reeling:** a successful hook goes straight into stage 7, pulling it in.
   The lure (stage 5) runs while the bobber waits: the right rhythm brings the bite sooner. Reflexes set the
   reaction window (proposed).
7. **Pulling it in (Rex).** Like Digimon World 1: pull too hard and the line weakens. Digimon's version could be
   needlessly hard; this one needs to be fairer (how, still open).

## Where the stats come in (proposed, from the discussion)

| Stage | What helps | Why, realistically |
|---|---|---|
| Reading the water | Eyesight; the Fishing skill (knowing which silhouette is which fish and where they gather) | spotting fish, birds diving, baitfish; knowledge is most of real fishing |
| Direction | Dexterity; Fishing skill (slower line, narrower cone) | accuracy is a hand skill |
| Power | Strength (how far you can throw at all) | distance is strength |
| The lure | Patience (slider); Fishing skill | real anglers work a lure at different cadences for different fish |
| The bite | Reflexes (the reaction window); Patience (not striking on a nibble) | striking too early pulls the bait away, too late and the fish spits the hook |
| Pulling it in | Strength; Dexterity (feeling the tension); Calm and Patience (not yanking); Endurance (long fights) | playing a fish: give line when it runs, take it back when it tires |

**Fish (Rex):** some sit closer to the dock or boat, some farther out; each likes certain rhythms.

## Open for Rex

- How pulling in stays fair (not Digimon-hard).
- Landing the big ones (a gaff or harpoon at the side, for sharks): a stage of its own, or part of pulling in.
- Period detail, if wanted: ships of the era fished with handlines hauled by hand, not reels.
