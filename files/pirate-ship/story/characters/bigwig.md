# The warehouse owner (unnamed; file is `bigwig.md` until Rex names him)

Every field is marked **(Rex)**, **(proposed)** or **(open)**. Only (Rex) is canon. The field keys in backticks
follow `_TEMPLATE.md`.

- **Slot:** `extra` (type open)
- **Status:** idea
- **Last changed:** 2026-10-27

## Identity

| Field | Key | Value | Mark |
|---|---|---|---|
| Name | `name` | | open |
| Type | `type` | | open |
| Function stack | `stack` | dominant-auxiliary-tertiary-inferior | open |
| Gender | `gender` | man | Rex |
| Pirate archetype | `archetype` | | open |
| Ship job (posts held) | `posts` | owns the warehouse and a few vendors | Rex |
| Where they are found | `found_at` | the starting port: the warehouse | Rex |
| Resident or visitor | `town_role` | resident | Rex |

## The psycho

| Field | Key | Value | Mark |
|---|---|---|---|
| Psycho core | `psycho_core` | simply bad: disorganised and chaotic; leaves the warehouse in disrepair and doesn't maintain alliances very well | Rex |
| Madness break | `madness_break` | what they do when the meter crosses the line | open |
| Madness triggers | `madness_triggers` | | open |
| Why piracy allows it | `permission` | how the setting makes it permissible | open |
| Their slight | `slight` | the thing that, repeated, makes them leave | open |
| Clues to the slight | `slight_clues` | obvious, subtle, too late | open |

## The person

| Field | Key | Value | Mark |
|---|---|---|---|
| Bio | `bio` | his ENFJ son isn't being taught well | Rex |
| Likes (gifts, acts) | `likes` | | open |
| Dislikes | `dislikes` | | open |
| Schedule | `schedule` | their day: post, meals, the den, sleep | open |
| Claims vs truth | `claims` | what they say they're good at, and whether it's true | open |

### Notes (Rex, 2026-10-27)

- **(Rex)** Rex wrote "dscirdnated", read as disorganised (discoordinated); to confirm.
- **(Rex)** The warehouse's fate (legitimate trade, or stolen goods and drugs) rides on his son's journey (see `enfj-m.md`).
- **(open)** His type.
- **(Rex, 2026-10-27)** Not recruitable.

## Joining

| Field | Key | Value | Mark |
|---|---|---|---|
| How recruited | `recruit` | not recruitable; kept separate from the recruitable list (a kidnapping mechanic for non-recruitables is an idea for later, not decided) | Rex |
| What the town thinks of them | `town_view` | who likes them, who doesn't (kidnapping consequences) | open |

## Relationships

One row per other character Rex has tied them to. Affection, respect, rivalry, distrust, history.

| With | Key | What it is | Mark |
|---|---|---|---|
| the player | `rel.player` | | open |
| his son, the ENFJ (`enfj-m`) | `rel.enfj-m` | isn't teaching him well | Rex |

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
| 2026-10-27 | Created: the warehouse owner, disorganised and chaotic, warehouse in disrepair, poor alliances; father of the ENFJ | Rex |
| 2026-10-27 | Not recruitable; kept separate from the recruitables | Rex |
