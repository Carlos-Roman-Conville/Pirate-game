# The journal: the player's encyclopaedia and the provenance labels (body-and-world keeper, 2026-10-29)

Rex's design (2026-10-29): **whenever a chemical is discovered it goes in your journal, which holds
plants, creatures, fish, essentially anything you can encounter; this is where labels are given to
everything.** A chemical made with the parts available to a chemist in a time when it should not have
been discovered yet is labelled a **time anomaly**. Each entry's description carries a blurb of what it
does, what it is used for, and when it was discovered and by whom, so the game is part history and part
time anomaly: the world is ours, in a space-time-anomaly version, with real locales not literally where
they were and real people not always present. The provenance tags are Rex's from `../combat/COMBAT.md`
§4d (mythical, Triassic, sci-fi; on the item screen, never in battle); this file is the journal they live
in. ChatGPT (outside AI) supplied the entry fields and the five historical dates; kept.

**Ownership.** This file: the entry shape, the classifications and their reasons, what shows at each
discovery state, and the split between the player's own findings and the historical reference. The
entries themselves are data: the goods and substances (`CHEMISTRY.md`, `GOODS.md`), the fish and creatures
(`../world/ECOLOGY.md`, the story keeper's tagged rows, `../minigames/FISHING.md`), the diseases
(`../body/MEDICINE.md`), the equipment (`SCIENTIFIC_EQUIPMENT.md`), places (the town keeper). The UI is the
game's; this is its content rule.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables from `../body/data/science.json`.

## 1. Classifications

<!-- table:science.classifications -->
*Provenance classifications (Rex's time-anomaly labels, extended; not mutually exclusive)* (fiction; confidence high; source: Rex (COMBAT 4d): a time-anomaly tag on things that do not belong to the period, shown on the item screen, never in battle; the world is ours in a space-time-anomaly version with real places and people not literally where or when they were. ChatGPT's set (outside AI) merged with the one already recorded in COMBAT 4d. Labels never change behaviour (Rex).)

| Label | Meaning | Examples | Stacks with | Why the journal says so | Mark |
|---|---|---|---|---|---|
| Historical | consistent with the setting's period and place | rum, scurvy, the retort, Brand's phosphorus (1669) | any | 'known in this time' | **Rex** |
| Time Anomaly | real, but discovered, introduced or met outside its historical timeline (earlier or later) | oxygen isolated in 1700 (historically 1774); a Bunsen burner in a 1700 laboratory; a creature from another century | Historical (a real thing), Prehistoric | 'first recorded in <year> by <who>; you have it in <game year>' | rex (the tag), proposed (the stacking) |
| Prehistoric | from an earlier geological period, named | a Triassic reptile; a Devonian fish | Time Anomaly | 'extinct since the <period>' | rex (COMBAT 4d: Triassic) |
| Mythological | from a real tradition's myth or folklore | a kraken, a mermaid, a voodoo loa's gift | - | 'from the <tradition>' | rex (mythical) |
| Fantasy | fictional supernatural | the angel's energy, a demon's form | - | 'no record' | proposed (outside AI) |
| Science Fiction | fictional technology or material on speculative science | the Atlantean mecha's power cell; a sci-fi fish (Rex's example) | - | 'no record' | rex (sci-fi), proposed (the label) |
| Original Fiction | made for this universe | the Ghost Fleet's needs | - | 'this world's own' | proposed (outside AI) |
| Unknown | the engine has no record of the reaction or thing: not impossible, not yet supported | a synthesis the database does not hold | - | 'nothing known; try, and the world will answer what it can' | proposed (ChatGPT's 'unknown, not physically impossible', agreed) |
<!-- /table -->

- **(Rex)** Labels are informational. They never change a thing's behaviour; the engine reads the
  properties. **(proposed)** Labels stack where both are true (a real modern chemical made in 1700 is
  Historical by nature and a Time Anomaly by date; a Devonian fish is Prehistoric and a Time Anomaly),
  and every label carries its reason in a sentence.

## 2. The entry

<!-- table:science.entry -->
*A journal entry's fields (one shape for a chemical, a plant, a fish, a creature, a disease, a tool, a place)* (model; confidence high; source: ChatGPT's field list (outside AI) merged with Rex's: a blurb of what it does and what it is used for, when it was discovered and by whom. The entry separates what the player found from the historical reference that unlocks on identification; the five historical dates are kept apart because they differ and credit is often disputed.)

| Field | Holds | Shown when | Mark |
|---|---|---|---|
| kind | chemical \| element \| mineral \| plant \| fungus \| animal \| fish \| creature \| disease \| equipment \| material \| object \| place \| phenomenon | always | rex (everything you can encounter) |
| state | encountered \| observed \| identified \| understood | always | proposed |
| classification | one or more labels (classifications table) with the reason | on identification (before that: 'unclassified') | rex (labels) |
| name, formula or species; provisional name before identification | - | by state | proposed |
| observed properties | what the player's own tests found, dated and with the instrument used | as found | proposed |
| reference properties | the engine's record (CHEMISTRY, ECOLOGY, MEDICINE rows) | on identification | proposed |
| natural occurrence | where it is found in the world | on identification | proposed |
| uses and effects | what it does and what it is used for: on a body (the body docs), in a recipe (GOODS), in a fight (COMBAT) | on identification, growing with understanding | rex (the blurb) |
| history: existence | when it existed (a mineral: always; a species: its era; a compound: made by nature or first made by people) | on identification | proposed |
| history: first observation | first documented noticing (Leeuwenhoek's animalcules 1676) | on identification | proposed |
| history: isolation | first obtained pure (oxygen 1774, Scheele and Priestley) | on identification | rex (when and by whom) |
| history: identification | first recognised for what it is (oxygen as an element: Lavoisier 1777) | on identification | proposed |
| history: synthesis | first made from other things (urea 1828, Wohler) | on identification | proposed |
| credited to, and the dispute | names; where credit is contested, say so | on identification | rex (by whom) |
| historical production | how it was made then | on identification | proposed |
| significance | why it mattered | on identification | proposed |
| your discovery | the in-game date, place, process and apparatus by which the player found or made it; the character who did it | always | **Rex** |
| anomaly note | if the game date is before the historical date: 'first recorded <year> by <who>; found here in <game year>: a Time Anomaly' | on identification | **Rex** |
| personal vs reference | two columns kept apart: what you found, what the books say | always | proposed (outside AI: educational as well) |
<!-- /table -->

- **[history]** The five dates are kept apart because they differ: oxygen existed always, was made by
  Scheele in 1771–72 and Priestley in 1774, was identified as an element by Lavoisier in 1777, and was
  never "synthesised"; urea was isolated from urine in 1773 and synthesised in 1828, the first organic
  compound made from inorganic ones. Credit is often disputed, and the entry says so rather than picking.
- **[model]** Two columns, kept apart: **what you found** (your tests, your dates, your apparatus, who in
  your crew did it) and **what the books say** (the reference, unlocked on identification). That is the
  educational side: the player learns the real history by meeting the thing.
- **The anomaly note (Rex):** when the game date is before the historical date, the entry says "first
  recorded <year> by <who>; found here in <game year>: a Time Anomaly", and the classification gains the
  label. The same when a creature or a tool arrives out of its time.

## 3. What the player sees at each state

| State | The page shows |
|---|---|
| Encountered | a sketch, a provisional name, where and when met, how it looked and behaved |
| Observed | the tests run and their results, with the instrument; a growing list |
| Identified | the name and formula or species; the classification and its reason; the reference blurb (uses, effects, occurrence); the five dates and the credit; the anomaly note if due |
| Understood | the mechanism; the reactions it takes part in; what it does to a body; the processes you can now design with it; "teach" and "write down" become possible |

## 4. What goes in (the kinds)

Chemicals and compounds; elements and minerals; plants, fungi and biological materials; fish and marine
life; animals and mythical creatures; diseases and biological phenomena; scientific equipment and
inventions; materials and manufactured objects; geographic discoveries; people met (open: the roster is
the crew's own system, `../crew/ROSTER.md`, so a person's page may be a pointer rather than a journal
entry). **(Rex)** essentially anything you can encounter.

## Open for Rex

1. Keep, cut, or stamp the entry shape and the labels.
2. Whether people have journal pages or only the crew system's cards.
3. The first entries: a belt data task (the goods, the diseases, the fish, the period apparatus); the
   fiction entries the story keeper's.
4. The journal's UI (the game's; the art keeper's look).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened on Rex's journal; classifications (8, with Unknown), the entry's fields with the five dates, the view per state, the kinds | keeper |
