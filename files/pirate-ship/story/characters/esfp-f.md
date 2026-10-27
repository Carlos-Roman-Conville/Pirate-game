# The ESFP cook (unnamed; file is `esfp-f.md` until Rex names them, then it becomes `<slug>.md`)

Every field is marked **(Rex)**, **(proposed)** or **(open)**. Only (Rex) is canon. The field keys in backticks
follow `_TEMPLATE.md`.

- **Slot:** `esfp-f` (was `esfp-m` until 2026-10-27)
- **Status:** idea
- **Last changed:** 2026-10-27

## Identity

| Field | Key | Value | Mark |
|---|---|---|---|
| Name | `name` | | open |
| Type | `type` | ESFP | Rex |
| Function stack | `stack` | Se-Fi-Te-Ni | Rex |
| Gender | `gender` | woman (confirmed 2026-10-27; first notes had a man) | Rex |
| Pirate archetype | `archetype` | | open |
| Ship job (posts held) | `posts` | not really a baker, more of a general cook; has a butcher shop | Rex |
| Where they are found | `found_at` | the starting port: the bakery | Rex |
| Resident or visitor | `town_role` | resident | Rex |

## The psycho

| Field | Key | Value | Mark |
|---|---|---|---|
| Psycho core | `psycho_core` | jolly, with a dark side: secretly a cannibal, eating humans and using them in the food | Rex |
| Madness break | `madness_break` | what they do when the meter crosses the line | open |
| Madness triggers | `madness_triggers` | | open |
| Why piracy allows it | `permission` | how the setting makes it permissible | open |
| Their slight | `slight` | the thing that, repeated, makes them leave | open |
| Clues to the slight | `slight_clues` | obvious, subtle, too late | open |

## The person

| Field | Key | Value | Mark |
|---|---|---|---|
| Bio | `bio` | used to be married to the INTP farmer, who found out about the humans in the food when the farmer made perfectly good food from the farm's own crops; their son lives with the cook | Rex |
| Likes (gifts, acts) | `likes` | | open |
| Dislikes | `dislikes` | | open |
| Schedule | `schedule` | their day: post, meals, the den, sleep | open |
| Claims vs truth | `claims` | what they say they're good at, and whether it's true | open |

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
| the INTP farmer (`intp-m`) | `rel.intp-m` | ex-spouse; the farmer found out about the cannibalism | Rex |
| their son (`farm-son`) | `rel.farm-son` | lives with the cook, collects his victims' skins and enjoys bringing them to the butcher shop; the cook finds it a bit abhorrent: you shouldn't play with your food like that | Rex |
| their daughter (`farm-daughter`) | `rel.farm-daughter` | lives with the farmer | Rex |

## Heart events

| Hearts | Key | Scene | Mark |
|---|---|---|---|
| | `heart_events` | | open |

## Voice

| Field | Key | Value | Mark |
|---|---|---|---|
| Speech notes | `voice` | jolly | Rex |
| Keywords they answer | `keywords` | Morrowind-style topics, and what trust each needs | open |
| Sample lines | `lines` | Rex's lines only | open |

## Art notes (for the art keeper)

| Field | Key | Value | Mark |
|---|---|---|---|
| Look | `art.look` | build, face, hair, scars, outfit, colours | open |
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

- **(proposed, outside AI)** Paired developments: beloved provider vs hospitality as cover.

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-27 | Created: the jolly baker who is secretly a cannibal | Rex |
| 2026-10-27 | Questline responses section added | keeper |
| 2026-10-27 | Questline cells reread as reactions to what they witness (was: taking them on a questline → effect) | Rex |
| 2026-10-27 | Not a baker but a general cook with a butcher shop; ex-spouse of the INTP farmer; parent of the son who collects skins; gender to confirm | Rex |
| 2026-10-27 | Gender confirmed: woman; file moved from `esfp-m.md` to `esfp-f.md` | Rex |
