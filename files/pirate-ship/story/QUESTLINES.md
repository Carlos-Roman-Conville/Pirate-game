# Questline responses: who you take, and what it does to the town

The system belongs to the town keeper: two axes (good/evil, order/chaos), four quadrants, one main plotline each,
the port's 12 residents meant as 3 per quadrant. See `../town/ENDINGS.md`; it isn't repeated here. This file is
the character side: how each character responds when you take them on each questline. Each character file has the
same four cells under "Questline responses" (keys `quest.order_good`, `quest.chaos_good`, `quest.order_evil`,
`quest.chaos_evil`); this matrix mirrors them.

## Rex's rules (2026-10-27)

- **(Rex)** Who you take on each questline is how the game plays out.
- **(Rex)** A character's nature isn't corrupted by the quest they go on.
- **(Rex)** Each character has a clear influence toward a questline, a neutral one, or an opposing one.

## The matrix

Cells: **Rex** = his decision; *proposed* = the outside AI's suggestion (not canon); blank = open.

| Character | Orderly good (church-like) | Chaotic good (the stereotypical pirate town) | Orderly evil (Cthulhu) | Chaotic evil (killers, devil worship) |
|---|---|---|---|---|
| ISTJ priest (`istj-m`) | *supports* | **Rex: no effect** (*neutral*) | **Rex: does nothing to his or anyone's alignment** (*opposes*) | **Rex: can't be corrupted; fights evil harder, moves the town toward good** (*strongly opposes*) |
| ENTP mechanic (`entp-m`) | *neutral* | *possible support* | *neutral* | **Rex: guaranteed; on return he makes something that helps turn the town chaotic evil** (*supports*) |
| ISTP hunter (`istp-m`) | | *possible support* | | *possible support* |
| INTJ apothecary (`intj-f`) | *possible support* | | *possible support* | *opposes* |
| ISFJ doctor (`isfj-f`) | | | | |
| ESFP baker (`esfp-m`) | | | | |
| INTP farmer (`intp-f`) | | | | |
| ESTP soldier and cook (`estp-m`) | | | | |

- **(Rex, 2026-10-27)** Chaotic good can be your stereotypical pirate town.
- **(Rex, 2026-10-27)** The pirate questline is chaotic good. The priest has no effect on it.

## Proposed (outside AI, 2026-10-27; not canon)

- Each cell as supports / neutral / opposes, with a strength (the italic cells above).
- Paired developments, one per direction: INTJ ethical research vs prisoner experiments; ISFJ compassionate care
  vs cruelty as treatment; ESFP beloved provider vs hospitality as cover.
- A character can push the town toward good while becoming a less pleasant person (a zealous priest).
