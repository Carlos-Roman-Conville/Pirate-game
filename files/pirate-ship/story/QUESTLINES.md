# Questlines: how your conduct moves the crew

The system belongs to the town keeper: two axes (good/evil, order/chaos), four quadrants, one main plotline each,
the port's 12 residents meant as 3 per quadrant. See `../town/ENDINGS.md`; it isn't repeated here. This file is
the character side: how each character reacts to what they see you do on each questline. Each character file has
the same four cells under "Questline responses" (keys `quest.order_good`, `quest.chaos_good`, `quest.order_evil`,
`quest.chaos_evil`); the matrix below mirrors them.

The quadrants: orderly good (church-like), chaotic good (the stereotypical pirate town, also called the pirate
questline; Rex, 2026-10-27), orderly evil (Cthulhu corruption), chaotic evil (killers, devil worship).

## The questing model (Rex, 2026-10-27)

1. **(Rex)** You don't pick one of the four paths. All four questlines are available, and you can take on each.
2. **(Rex)** How you handle each path (its mini quests and everything else) determines a character's alignment.
   Actions, or certain sections, have points attached. On the devil's (chaotic evil) path you can choose to
   destroy it, and how you do it decides the points you get; or you can go down the devil's path and earn devil
   points. It is based entirely on how you handle each path.
3. **(Rex)** A crew member in your party sees what you do, and their alignment moves by the system's inner rules.
4. **(Rex, earlier the same day) Per-character inner rules, for consistency:** egging someone toward the alignment
   they want moves them that way. Pushing them by any of the other three moves them toward a different alignment,
   sometimes the opposite one, sometimes the one next to it. No two characters have the same directions and
   mismatches. Confusing to the player, yet logical: humans don't just follow a path unless they're egged on into
   the one they want.
- **(Rex)** A character's nature isn't corrupted by the quest they go on (stated earlier the same day).

Fit with the stats: personality moves only through what someone sees and how they're treated
(`../STATS.md` §3).

### Open (Rex's)

- ~~**A.** Whether point 4 still holds, or whether points plus witnessing (2–3) replaced it.~~ Answered
  2026-10-27: it holds alongside them; the ENTP's alignment map is the first (`characters/entp-m.md`).
- **B.** Who earns points: only the crew who witness an action, or the player too.

### Superseded

- ~~"Who you take on each questline is how the game plays out."~~ (Rex, 2026-10-27) Superseded 2026-10-27 by
  point 2: conduct on each path decides.

## The matrix: reactions to what they witness

Read each cell as how the character reacts to what they see you do on that path (before 2026-10-27 the cells
read as "taking them on this questline → effect"). Cells: **Rex** = his decision; *proposed* = the outside AI's
suggestion (not canon); blank = open.

| Character | Orderly good | Chaotic good (pirate) | Orderly evil (Cthulhu) | Chaotic evil (devil) |
|---|---|---|---|---|
| ISTJ priest (`istj-m`) | *supports* | **Rex: no effect** (*neutral*) | **Rex: does nothing to his or anyone's alignment** (*opposes*) | **Rex: can't be corrupted; fights evil harder, moves the town toward good** (*strongly opposes*) |
| ENTP mechanic (`entp-m`) | **Rex: moves him to chaotic good** (*neutral*) | **Rex: moves him to orderly evil** (*possible support*) | **Rex: moves him to orderly good** (*neutral*) | **Rex: his natural alignment; chaotic evil acts only reinforce him (the loop)**; **Rex: guaranteed; on return he makes something that helps turn the town chaotic evil** (*supports*). **Open:** whether it stays guaranteed or now depends on what he witnesses you do there |
| ISTP hunter (`istp-f`) | | *possible support* | | *possible support* |
| INTJ apothecary (`intj-f`) | **Rex: moves her to orderly evil** (*possible support*) | **Rex: moves her to orderly evil** | **Rex: stays orderly evil (loop)** (*possible support*) | **Rex: moves her to orderly evil** (*opposes*). **Rex:** all paths lead here unless you show her that her belief is wrong; then she becomes neutral |
| ISFJ doctor (`isfj-f`) | **Rex: no change: leans her toward orderly good** | **Rex: moves her to chaotic evil** | **Rex: moves her to chaotic good** | **Rex: moves her to orderly evil** |
| ESFP cook (`esfp-f`) | **Rex: moves her to chaotic good** | **Rex: moves her to chaotic evil** | **Rex: moves her to chaotic evil** | **Rex: no change: leans her toward chaotic evil** |
| INTP farmer (`intp-m`) | **Rex: moves him to orderly evil** | **Rex: moves him to orderly good** | **Rex: no change: leans him toward orderly evil** | **Rex: moves him to orderly evil** |
| ESTP veteran outdoorswoman (`estp-f`) | **Rex: moves her to chaotic good** | **Rex: stays chaotic good (loop)** | **Rex: moves her to chaotic evil** | **Rex: stays chaotic evil (loop)** |
| ESFJ failed merchant (`esfj-m`) | **Rex: moves him to chaotic evil** | **Rex: moves him to orderly evil** | **Rex: moves him to orderly good** | **Rex: moves him to chaotic good** |
| ENFJ pretty boy (`enfj-m`) | **Rex: stays orderly good (loop)** | **Rex: moves them to orderly good** | **Rex: stays orderly evil (loop)** | **Rex: moves them to orderly evil** |
| ESTJ privateer pirate (`estj-f`) | **Rex: moves them to chaotic evil** | **Rex: moves them to orderly good** | **Rex: moves them to chaotic good** | **Rex: moves them to orderly evil** |

## Proposed (outside AI, 2026-10-27; not canon)

- A character responds to methods, not outcomes: the same result can be reached by arrest, freeing captives,
  enslaving or killing, and each method carries different points.
- Keep an action's objective points separate from each character's interpretation of them.
- Keep direction separate from intensity, so a character drifts across the square and can resist before a
  reversal.
- Paired developments, one per direction: INTJ ethical research vs prisoner experiments; ISFJ compassionate care
  vs cruelty as treatment; ESFP beloved provider vs hospitality as cover.
- A character can push the town toward good while becoming a less pleasant person (a zealous priest).
- Likely superseded by the 2026-10-27 model: each cell as supports / neutral / opposes with a strength (the
  italic cells above), and a 4×4 per-character response matrix, possibly a permutation so every character can
  reach every alignment.

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-27 | Created: questline responses as "who you take on each questline is how the game plays out"; matrix of take-them-on effects | Rex |
| 2026-10-27 | Chaotic good is the stereotypical pirate town; the pirate questline is chaotic good, the priest has no effect on it | Rex |
| 2026-10-27 | The INTJ's alignment map: every path leads to orderly evil | Rex |
| 2026-10-27 | The INTJ's one way out: shown her belief is wrong, she becomes neutral | Rex |
| 2026-10-27 | The ENFJ's alignment map (character not yet described) | Rex |
| 2026-10-27 | The ESTJ's alignment map (character not yet described) | Rex |
| 2026-10-27 | The ENTP's alignment map (inner rules); open A answered: per-character rules hold | Rex |
| 2026-10-27 | New questing model: all four paths open, conduct earns points, witnessing crew shift by inner rules; "who you take" superseded; cells reread as witnessed reactions; open A, B and the ENTP's guarantee | Rex |
| 2026-10-27 | The ISTP and ESTP are now women (`istp-f`, `estp-f`); the ENFJ is a man (`enfj-m`) | Rex |
| 2026-10-27 | The ESTJ is an old privateer, a man (`estj-m`) | Rex |
| 2026-10-27 | The ESTJ is a woman, a pirate lady in her 40s (`estj-f`) | Rex |
| 2026-10-27 | The ESTP's alignment map (OG→CG, CG stays, OE→CE, CE stays) | Rex |
| 2026-10-27 | The ESFP's map (OG→CG, CG stays, OE→CE, CE stays) and the INTP's map (OG→OE, CG→OG, OE stays, CE→CG) | Rex |
| 2026-10-27 | On Rex's diagrams a dashed ring means no change: committing that action just leans the character that way | Rex |
| 2026-10-27 | The ESFP's and INTP's maps replaced with Rex's corrected charts: ESFP (OG→CG, CG→CE, OE→CE, CE no change); INTP (OG→OE, CG→OG, OE no change, CE→OE) | Rex |
| 2026-10-27 | The ESFJ's alignment map (OG→CE, CG→OE, OE→OG, CE→CG) | Rex |
| 2026-10-28 | The ISFJ's alignment map (OG no change, CG→CE, OE→CG, CE→OE) | Rex |
