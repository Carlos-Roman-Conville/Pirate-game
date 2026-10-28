# Alignment rule coverage (2026-10-28)

Each **(Rex)** rule in `balance/ALIGNMENT.md` §1–§7, one row each, with the vitest test that covers it (file and test
name, from a grep of `web/src/alignment/**/*.test.ts`) or `MISSING`. Checked by reading the test names and the
assertions they make; no code or test was changed. A test that only checks a slug list or a shape, not the value the
rule states, counts as MISSING.

## §1 The square

| # | Rule | Test | Status |
|---|---|---|---|
| 1.1 | Two axes, each −100 to +100; quadrants OG/CG/OE/CE | `square.test.ts` "clamp and step: clamps at the bound"; `engine.test.ts` "§1 positions clamp to the configured ±100 bound" | covered |
| 1.2 | Everyone has a position (player, character, institution, town) | `institutions.test.ts` "per-slot state represents both data owners in every sector" | covered |
| 1.3 | Nine regions read from a position | `square.test.ts` "classify: the nine regions" | covered |
| 1.4 | Hybrid bands; middle left is Twisted Virtue | `institutions.test.ts` "four OG and four OE average into hybrid_order named Twisted Virtue from data" | covered |
| 1.5 | Every position classifies; transitional ring handled | `square.test.ts` "classify: the transitional ring" | covered |
| 1.6 | Exact tie keeps the previous region (`tieBreak: keep-previous`) | `square.test.ts` "a tie keeps the previous region"; `engine.test.ts` "§1 a diagonal step keeps the previous band in the transitional ring" | covered |
| 1.7 | Tie with no previous region reads the position alone | `square.test.ts` "a tie with no previous reads the position alone" | covered |
| 1.8 | Thresholds are data, not code | `square.test.ts` "no threshold hard-coded"; "the tie rule is read from data" | covered |

## §2 What moves alignment: events

| # | Rule | Test | Status |
|---|---|---|---|
| 2.1 | Three sources: dialogue, quest, independent action | `engine.test.ts` "loads all three event sources and rejects duplicate IDs" | covered |
| 2.2 | Each source's items are minor or major | `data.test.ts` "placeholder EventDefs cover source × weight × category" | covered |
| 2.3 | Every event has a category OG, CG, OE or CE | `data.test.ts` "placeholder EventDefs cover source × weight × category" | covered |
| 2.4 | All three go through one shared engine as events | `engine.test.ts` "loads all three event sources and rejects duplicate IDs" | covered |
| 2.5 | Alignment accumulates; repeated events carry someone across | `engine.test.ts` "§2 movement accumulates: two minor events move farther than one" | covered |

## §3 The player

| # | Rule | Test | Status |
|---|---|---|---|
| 3.1 | The player moves by the event's category | `engine.test.ts` "§2–3 $id moves the acting player by its weight toward its category anchor" | covered |
| 3.2 | The player's position is read like any other (moral development) | `engine.test.ts` "§1 region is re-read after each move" (applies to `state.player`) | covered |

## §4 Characters

| # | Rule | Test | Status |
|---|---|---|---|
| 4.1 | Response chart: the category picks the arrow; the arrow's destination is where the character moves | `charts.test.ts` "respond follows the destination, independently of the event quadrant"; `engine.test.ts` "§4 each witness moves toward its chart destination" | covered |
| 4.2 | Dashed ring leans toward Q; kept up it carries them in | `charts.test.ts` "a dashed ring leans toward its own category"; `engine.test.ts` "§4 repeated lean from the centre eventually arrives at the quadrant and anchor" | covered |
| 4.3 | A lean is `leanFactor` times a normal step | `engine.test.ts` "§4 lean is leanFactor times a fixed step" | covered |
| 4.4 | Only witnesses receive an event's influence | `engine.test.ts` "§4 non-witnesses never move, including aboard party members" | covered |
| 4.5 | Presence comes from the occurrence (aboard and in the party) | `engine.test.ts` "§4 presence comes only from the occurrence, including a witness in town" | covered |
| 4.6 | Alignment persists through crew rotation | `engine.test.ts` "§4 persistence: leave and recruit again keep position and region" | covered |
| 4.7 | A character's nature isn't corrupted by the quest; only the chart moves them | MISSING (no test asserts a quest leaves nature or chart unchanged) | MISSING |
| 4.8 | Starting positions table (16 slugs, "for now") | `data.test.ts` "§4 each slug matches the starting positions table" | covered |
| 4.9 | INTJ special case: shown her belief is wrong, she becomes neutral | MISSING (parked as an unresolved verb, not built; `engine.test.ts` "§8 exports named unresolved rules" only lists the key) | MISSING |
| 4.10 | Starting category and chart are independent | `engine.test.ts` "§4 starting category uses startCoords independently of chart and movement anchor" | covered |

## §5 Institutions

| # | Rule | Test | Status |
|---|---|---|---|
| 5.1 | One institution per competing sector (eight sectors, two slots each) | `data.test.ts` "eight sectors with two slots whose owners exist in charts" | covered |
| 5.2 | Each institution develops into alignment-specific forms | MISSING (`data.test.ts` "eight sectors…" checks `forms` is null per slot; no test that forms differ by alignment) | MISSING |
| 5.3 | Transformation rule: eligible on return, transforms in the overnight update | `institutions.test.ts` "leave only marks a developed institution eligible; character, slot and pending are separate"; "sleep advances the day, copies town owners, clears pending and logs slot/from/to" | covered |
| 5.4 | Character, institution and pending tracked separately | `institutions.test.ts` "leave only marks a developed institution eligible; character, slot and pending are separate" | covered |
| 5.5 | Ghost rule applies to every pair (`every-pair-both-improve`) | `institutions.test.ts` "every-pair-both-improve allows both $id slots to develop independently" | covered |
| 5.6 | Recruiting alone never develops; `develop` is its own command | `institutions.test.ts` "recruiting alone never develops an institution"; "develop refuses a never-recruited owner" | covered |
| 5.7 | Owner departed for good freezes the place (`ownerDeparted: freeze`) | `institutions.test.ts` "ownerDeparted freeze preserves an established institution and its pending flag" | covered |
| 5.8 | Recruit neither of a pair → both places go to ghosts | MISSING (`smoke.test.ts` "exercises development and overnight routes with the explicitly supported ghost policy" runs the route but asserts no ghost state) | MISSING |

## §6 The town and its endings

| # | Rule | Test | Status |
|---|---|---|---|
| 6.1 | Town alignment comes from its developed institutions | `institutions.test.ts` "eight developed OG institutions, one per sector, produce a perfect OG town" | covered |
| 6.2 | Town position is the mean of developed institutions (`townAggregate: mean`) | `institutions.test.ts` "four OG and four OE average into hybrid_order named Twisted Virtue from data" (asserts x = −startCoords.x, y = 0) | covered |
| 6.3 | Nine endings: four pure, four hybrids, neutral | `institutions.test.ts` "four OG and four OE average into hybrid_order…"; "four OG and four CG average into hybrid_good…"; "four OE and four CE average into hybrid_evil…"; "four CG and four CE average into hybrid_chaos…"; pure quadrants and neutral in the same describe | covered |
| 6.4 | Perfect town means every developed institution in the same alignment (CE is perfect too) | `institutions.test.ts` "perfect means consistency, including %s" (og, oe, cg, ce) | covered |
| 6.5 | Which institutions count: every developed place, including a pair's loser (`perfectCounts: all-developed`) | `institutions.test.ts` "all-developed counts the rival too: an OG/OE pair prevents an otherwise OG perfect town" | covered |
| 6.6 | Hybrid endings have real width (mixed, not transition) | `institutions.test.ts` "four OG and four OE average into hybrid_order named Twisted Virtue from data" | covered |
| 6.7 | Perfect endings should be hard but achievable where the rules permit | MISSING (no test asserts a perfect town is reachable; `smoke.test.ts` prints routes for all quadrants without that assertion) | MISSING |

## §7 The crew

| # | Rule | Test | Status |
|---|---|---|---|
| 7.1 | Three crew slots to start; the engine refuses a fourth aboard; `crewSlots` from data | `engine.test.ts` "§7 a fourth recruit with three aboard is refused"; "§8 crewSlots is read from config" | covered |
| 7.2 | Engine tracks `location` and `inParty`, with `recruit`, `party`, `leave`; departed cannot be recruited | `engine.test.ts` "§7 departed characters cannot be recruited"; "§7 party replaces membership and only accepts aboard characters"; "rejects invalid crew transitions without changing the input" | covered |

## Count

Covered: 37. Missing: 5 (rows 4.7, 4.9, 5.2, 5.8, 6.7). Total: 42 rules.
