# The ISTJ head priest (unnamed; file is `istj-m.md` until Rex names them, then it becomes `<slug>.md`)

Every field is marked **(Rex)**, **(proposed)** or **(open)**. Only (Rex) is canon. The field keys in backticks
follow `_TEMPLATE.md`.

- **Slot:** `istj-m`
- **Status:** idea
- **Last changed:** 2026-10-27

## Identity

| Field | Key | Value | Mark |
|---|---|---|---|
| Name | `name` | | open |
| Type | `type` | ISTJ | Rex |
| Function stack | `stack` | Si-Te-Fi-Ne | Rex |
| Gender | `gender` | man | Rex |
| Pirate archetype | `archetype` | | open |
| Ship job (posts held) | `posts` | head priest of the church (in town) | Rex |
| Where they are found | `found_at` | the starting port: the church | Rex |
| Resident or visitor | `town_role` | resident: lives at the church | Rex |

## The psycho

| Field | Key | Value | Mark |
|---|---|---|---|
| Psycho core | `psycho_core` | especially cruel when following the rules, to the point of "robtoness" (Rex's word; read as robotic, to confirm) | Rex |
| Madness break | `madness_break` | what they do when the meter crosses the line | open |
| Madness triggers | `madness_triggers` | | open |
| Why piracy allows it | `permission` | how the setting makes it permissible | open |
| Their slight | `slight` | the thing that, repeated, makes them leave | open |
| Clues to the slight | `slight_clues` | obvious, subtle, too late | open |

## The person

| Field | Key | Value | Mark |
|---|---|---|---|
| Bio | `bio` | he despises where he lives | Rex |
| Likes (gifts, acts) | `likes` | | open |
| Dislikes | `dislikes` | | open |
| Schedule | `schedule` | their day: post, meals, the den, sleep | open |
| Claims vs truth | `claims` | what they say they're good at, and whether it's true | open |

### Notes (Rex, 2026-10-27)

- **(Rex, earlier)** The roster's confirmed ISTJ follows the rules to the letter.

## Joining

| Field | Key | Value | Mark |
|---|---|---|---|
| How recruited | `recruit` | whether he is recruitable | open |
| What the town thinks of them | `town_view` | who likes them, who doesn't (kidnapping consequences) | open |

## Relationships

One row per other character Rex has tied them to. Affection, respect, rivalry, distrust, history.

| With | Key | What it is | Mark |
|---|---|---|---|
| the player | `rel.player` | | open |

## Heart events

| Hearts | Key | Scene | Mark |
|---|---|---|---|
| | `heart_events` | | open |

## Voice

| Field | Key | Value | Mark |
|---|---|---|---|
| Speech notes | `voice` | rhythm, vocabulary, what they never say | open |
| Keywords they answer | `keywords` | Morrowind-style topics, and what trust each needs | open |
| Sample lines | `lines` | Rex's lines only | open |

## Art notes (for the art keeper)

| Field | Key | Value | Mark |
|---|---|---|---|
| Look | `art.look` | build, face, hair, scars, outfit, colours | open |
| Signature face | `art.signature_face` | the one expression that is theirs | open |
| Heart-event scenes to illustrate | `art.scenes` | | open |

## Questline responses

How taking them on each of the town's four questlines moves the town (system: `../../town/ENDINGS.md`;
matrix: `../QUESTLINES.md`). Rex's rule: a character's nature isn't corrupted by the quest they go on.

| Questline | Key | Response (supports / neutral / opposes, and what happens) | Mark |
|---|---|---|---|
| Orderly good (church-like) | `quest.order_good` |  | open (proposed: supports) |
| Chaotic good (the stereotypical pirate town) | `quest.chaos_good` | no effect: does nothing to his alignment or anyone else's; outside AI proposed: neutral | Rex |
| Orderly evil (Cthulhu corruption) | `quest.order_evil` | does nothing to his alignment or anyone else's; outside AI proposed: opposes | Rex |
| Chaotic evil (killers, devil worship) | `quest.chaos_evil` | he cannot be corrupted: he becomes more fervently against evil and pushes back, moving the town toward good; outside AI proposed: strongly opposes | Rex |

- **(Rex, 2026-10-27)** The pirate questline is chaotic good; taking him on it does nothing to his alignment or anyone else's.

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-27 | Created: head priest of the church; despises the town; cruel by the letter of the rules | Rex |
| 2026-10-27 | Questline responses section added (Rex's rules recorded) | keeper |
| 2026-10-27 | Chaotic good (the pirate questline): no effect | Rex |
