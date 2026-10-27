# The INTP farmer (unnamed; file is `intp-m.md` until Rex names them, then it becomes `<slug>.md`)

Every field is marked **(Rex)**, **(proposed)** or **(open)**. Only (Rex) is canon. The field keys in backticks
follow `_TEMPLATE.md`.

- **Slot:** `intp-m` (was `intp-f` until 2026-10-27)
- **Status:** idea
- **Last changed:** 2026-10-27

## Identity

| Field | Key | Value | Mark |
|---|---|---|---|
| Name | `name` | | open |
| Type | `type` | INTP | Rex |
| Function stack | `stack` | Ti-Ne-Si-Fe | Rex |
| Gender | `gender` | man (confirmed 2026-10-27; first notes had a woman) | Rex |
| Pirate archetype | `archetype` | | open |
| Ship job (posts held) | `posts` | farmer: runs the farm in town | Rex |
| Where they are found | `found_at` | the starting port: the farm | Rex |
| Resident or visitor | `town_role` | resident | Rex |

## The psycho

| Field | Key | Value | Mark |
|---|---|---|---|
| Psycho core | `psycho_core` | secretly uses dead, decomposing bodies as fertiliser and has been known to kill passers-by for it; the longer the crops go without a body, the more determined the farmer becomes to find one | Rex |
| Madness break | `madness_break` | what they do when the meter crosses the line | open |
| Madness triggers | `madness_triggers` | | open |
| Why piracy allows it | `permission` | how the setting makes it permissible | open |
| Their slight | `slight` | the thing that, repeated, makes them leave | open |
| Clues to the slight | `slight_clues` | obvious, subtle, too late | open |

## The person

| Field | Key | Value | Mark |
|---|---|---|---|
| Bio | `bio` | used to be married to the ESFP cook; found out about the cook eating humans and using them in the food, when the farmer made perfectly good food from the farm's own crops. Their daughter helps run the farm. (Supersedes "the spouse died") | Rex |
| Likes (gifts, acts) | `likes` | | open |
| Dislikes | `dislikes` | | open |
| Schedule | `schedule` | their day: post, meals, the den, sleep | open |
| Claims vs truth | `claims` | what they say they're good at, and whether it's true | open |

### Notes (Rex, 2026-10-27)

- **(Rex)** Based on April Ludgate from Parks and Recreation (Aubrey Plaza), the deadpan one.
- ~~**(open)** What her psychopathy is.~~ Answered 2026-10-27: bodies as fertiliser (see Psycho core).

## Joining

| Field | Key | Value | Mark |
|---|---|---|---|
| How recruited | `recruit` | | open |
| What the town thinks of them | `town_view` | who likes them, who doesn't (kidnapping consequences) | open |

## Relationships

One row per other character Rex has tied them to. Affection, respect, rivalry, distrust, history.

| With | Key | What it is | Mark |
|---|---|---|---|
| the player | `rel.player` | | open |
| the ESFP cook (`esfp-f`) | `rel.esfp-f` | ex-spouse; the farmer found out about the cannibalism | Rex |
| their daughter (`farm-daughter`) | `rel.farm-daughter` | helps run the farm | Rex |
| their son (`farm-son`) | `rel.farm-son` | lives with the cook | Rex |

## Heart events

| Hearts | Key | Scene | Mark |
|---|---|---|---|
| | `heart_events` | | open |

## Voice

| Field | Key | Value | Mark |
|---|---|---|---|
| Speech notes | `voice` | deadpan | Rex |
| Keywords they answer | `keywords` | Morrowind-style topics, and what trust each needs | open |
| Sample lines | `lines` | Rex's lines only | open |

## Art notes (for the art keeper)

| Field | Key | Value | Mark |
|---|---|---|---|
| Look | `art.look` | based on April Ludgate (Aubrey Plaza's deadpan character in Parks and Recreation); open whether this still applies now the farmer is a man | Rex |
| Signature face | `art.signature_face` | the one expression that is theirs | open |
| Heart-event scenes to illustrate | `art.scenes` | | open |

## Questline responses

How they react to what they witness you do on each of the four questlines (model and matrix:
`../QUESTLINES.md`; town system: `../../town/ENDINGS.md`; personality shifts: `../../STATS.md` §3). Rex,
2026-10-27: conduct on each path decides alignment, and crew who witness it move by their own inner rules.
Rex's rule: a character's nature isn't corrupted by the quest they go on.

| Questline | Key | Reaction to what they witness you do there | Mark |
|---|---|---|---|
| Orderly good (church-like) | `quest.order_good` |  | open |
| Chaotic good (the stereotypical pirate town) | `quest.chaos_good` |  | open |
| Orderly evil (Cthulhu corruption) | `quest.order_evil` |  | open |
| Chaotic evil (killers, devil worship) | `quest.chaos_evil` |  | open |

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-27 | Created: runs the farm alone since her spouse died; deadpan, based on April Ludgate | Rex |
| 2026-10-27 | Questline responses section added | keeper |
| 2026-10-27 | Questline cells reread as reactions to what they witness (was: taking them on a questline → effect) | Rex |
| 2026-10-27 | Bodies as fertiliser, kills passers-by for it; ex-spouse of the ESFP cook (supersedes the dead spouse); parent of the daughter and son; gender to confirm | Rex |
| 2026-10-27 | Gender confirmed: man; file moved from `intp-f.md` to `intp-m.md` | Rex |
