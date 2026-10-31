# Population: demographics, births, deaths, migration, labour, the aggregate settlement (body-and-world keeper, 2026-10-29)

One of the world docs Rex asked for (`../combat/COMBAT.md` §4b: "population and demographics"). The combat
keeper's note (item 2) and ChatGPT's answer agree on this file's fence, and the keeper keeps it: **this file
describes the pool a town draws from and never writes a named character's fate.** Births, deaths and
migration here are counts of unnamed people; who among the named lives, dies, ghosts, leaves or is
transformed belongs to Rex and the town, balance and story keepers (`../town/UPGRADES.md`,
`../balance/ALIGNMENT.md`, `../balance/BALANCE.md`, `../story/STORY.md`).

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; marks **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables are rendered from `../body/data/population.json`.

**Clock.** The overnight tick for the town the player sleeps in; a batch of elapsed days for every other
settlement when it is next needed (ChatGPT's "unvisited never means unaffected", `COMBAT.md` §4e, proposed,
kept). This is the same pattern as the alignment engine's sleep (`ALIGNMENT.md` §5): state as data, a
reducer over the day, evaluation at the tick, kept in its own module and talking to the town engine only by
commands (`BALANCE.md` C5 item 23).

## What Rex has decided that this file must respect

- **(Rex, 2026-10-26)** A town is an ecosystem, not a hiring board: residents with no reason to leave,
  visitors, people looking for work; the recruit pool is drawn from both (`../PIRATE.md` §7b). This file is
  the ecosystem's census.
- **(Rex, 2026-10-26)** The starting port is already dying (`STORY.md` open thread 7, answered); its people
  are thinking of abandoning it (`UPGRADES.md` "not yet a slot"). This file's migration-out pressure is that
  fact as a number, never a decision about a named resident.
- **(Rex, 2026-10-28)** Fates (alive / dead / ghost; departed; freeze on departure; the ghost rule for every
  pair) are the alignment engine's and the town keeper's. Untouched here.
- **(Rex, 2026-10-29)** Death and resurrection by faction; states of being; transformation through
  character endings; the butterfly effect that kills someone far away; the game completable with everyone
  dead. This file can carry an **epidemic** or a **famine** as an event the owners of fates may use for a
  butterfly; it never resolves one.
- **(Rex, 2026-10-28)** Succession: the farm passes to the daughter, the bakery to the son
  (`UPGRADES.md`). This file only supplies the labour a successor is drawn from.
- **(Rex, 2026-10-29)** The slave trade is recorded as fact in `GOODS.md` §1e; whether it appears in the
  game is Rex's (Open for Rex 1 there). The enslaved cohort below is open for the same reason.

## 1. Historical rates

<!-- table:population.rates -->
*Historical vital rates (per 1,000 per year)* (history; confidence medium; source: England 1690s to 1720s: births about 28 to 33, deaths about 26 to 28, life expectancy at birth 35 to 38, a crisis year (1726) with deaths near 37 (Wrigley and Schofield via the Toronto tables; POP-WS). Jamaica: white deaths far above births; 50,000 Europeans arrived 1700 to 1750 and the white population grew by about 5,000; median settler marriage about six years (Burnard; POP-BURN). Port Royal 1692: about 6,500 people, about 2,000 killed in the earthquake and 3,000 more of injury and disease after (POP-PR). Enslaved populations in the sugar islands also fell without imports (Burnard, general).)

| Population | Births | Deaths (normal year) | Deaths (epidemic year) | Natural change | Life expectancy at birth | Note | Mark |
|---|---|---|---|---|---|---|---|
| England, rural parish | 30 | 27 | 40 | +3 | 36 | the baseline the sim scales from | history |
| A Caribbean port, white settlers | 25 | 50 | 100 | -25 | 25 | newcomers die in the seasoning; growth only by immigration | history (medium) |
| A Caribbean port, seasoned residents | 30 | 35 | 70 | -5 | 32 | survivors of yellow fever are immune | proposed (derived) |
| A plantation's enslaved people | 25 | 45 | 90 | -20 | 23 | Burnard: no natural increase in the sugar islands | history (medium) |
| A pirate crew (at sea, no women) | 0 | 60 | 300 | -60 | - | recruited, never born: wholly a migration population | proposed (derived) |
| A Miskito or Arawak village | 35 | 35 | 150 | 0 | 30 | smallpox and measles the epidemic killers of the unexposed | proposed (derived) |
<!-- /table -->

- **[history]** England's rates are the Wrigley–Schofield reconstruction (births 28–33, deaths 26–28 per
  thousand in the 1690s–1720s, life expectancy 35–38; POP-WS). Jamaica's white population could not
  reproduce itself: yellow fever and the seasoning killed newcomers faster than births replaced them;
  50,000 migrants in 1700–1750 raised the white population by about 5,000 (Burnard; POP-BURN). Port Royal
  held about 6,500 people in 1692; the earthquake killed about 2,000 and disease and injury 3,000 more
  (POP-PR). The derived rows are the keeper's scaling of those facts (medium to low confidence).
- **Mark:** history; the derived rows **(proposed)**.

## 2. The settlement record

<!-- table:library/population.cohorts -->
*The settlement record: cohorts the aggregate model keeps* (model; confidence medium; source: A compact age-sex-role structure, updated daily for a visited town (the overnight tick) and in a batch for a distant one (the days elapsed). ChatGPT's three simulation levels (unvisited aggregate; discovered named characters tracked; active full detail) recorded in COMBAT.md 4e, proposed; kept.)

| Field | Type | What it holds | Mark |
|---|---|---|---|
| children | count | under 15 | proposed |
| adults_m, adults_f | count | 15 to 50, by sex | proposed |
| elders | count | over 50 | proposed |
| seasoned_share | 0 to 1 | fraction of adults immune to the local fevers | proposed |
| enslaved | count | a plantation town's enslaved people; whether this appears in the game at all is Rex's (GOODS.md Open for Rex 1) | **open** |
| transient | count | sailors, soldiers, visitors in port this week (the recruit pool's visitors, PIRATE.md 7b) | proposed |
| health | 0 to 1 | mean body condition of the pool (food sufficiency, epidemic state) | proposed |
| food_days | number | stores against need (ECOLOGY and the economy) | proposed |
| epidemic | disease id or none, with day | the current outbreak (MEDICINE parameters) | proposed |
| labour | person*h | = sum of adult categories: cohort x health x (1 - living symptomatic cohort share) x host hoursPerDay | proposed (Reality, 2026-10-30, group 10) |
| occupations | map | how many farmers, fishers, smiths, sailors (GOODS.md 3d labels) the pool supplies | proposed |
<!-- /table -->

- **[model] (proposed)** One record per settlement, plus the ship as a settlement of its own (a crew is a
  population recruited, never born). The record is deliberately small: counts, not people. The 108 named
  characters (`ALIGNMENT.md` §10) live in the alignment engine's state, not here.

## 3. The aggregate daily update

<!-- table:library/population.tick -->
*The aggregate daily update* (model; confidence medium; source: Standard cohort-component demography reduced to daily rates; epidemic as a simple SIR-type pulse using MEDICINE.md catch and death rates; migration from the economy's prosperity and the town's reputation. Numbers placeholders.)

| Step | Rule | Reads | Mark |
|---|---|---|---|
| Births | children += adults_f x birth_rate/365 x health | rates table | proposed |
| Deaths, background | each cohort -= n x death_rate/365 x (2 - health) ; elders x2 | rates, health | proposed |
| Epidemic | on outbreak: new cases daily = remaining members of the initial resident pool not yet caught and not initially seasoned x the host's catch rate, through the row's maximum course day; each exposure batch follows MEDICINE's uniform integer incubation and course days, with fatal crises uniform over each drawn course; deaths and recoveries are their expectations, and living ill cases determine sick share; survivors join seasoned_share for lifelong immunity (yellow fever, smallpox) | MEDICINE.md diseases | proposed (Reality, 2026-10-30, group 14: the expected value of MEDICINE's individual course) |
| Ageing | children -> adults at 15 (1/5475 a day), adults -> elders at 50 | - | proposed |
| Food | food_days -= 1; if under 0: health -= 0.02 a day; births x0.5; deaths x1.5 (famine) | ECOLOGY, economy | proposed |
| Migration in | transient += arrivals (ships in port x crew share ashore); adults += settlers (prosperity x reputation x 0.001 a day) | economy, town reputation | proposed |
| Migration out | adults -= leavers (fear of fever x epidemic; the dying port's pressure: Rex, everyone thinking of abandoning the port) | town state | proposed |
| Labour supply | personHours = cohort x health x (1 - living symptomatic cohort share) x host hoursPerDay; pools sum their categories in person*h and grants cannot exceed daily pool capacity | cohorts | proposed (Reality, 2026-10-30, group 10) |
| Recruit pool refresh | the unnamed candidates (merc, hire) a port offers are drawn from transient and adults by occupation; named characters are never drawn or removed here | PIRATE.md 7b | proposed |
<!-- /table -->

- **[science]** Cohort-component demography reduced to daily rates; an epidemic as a simple pulse using
  `MEDICINE.md`'s catch and death rates with the seasoned share as immunity; famine raising deaths and
  lowering births (textbook demography; medium confidence for the shape).
- **Effects:** labour supply to the economy and the town's places (a place with no workers stalls: an
  economic state, not a fate); the recruit pool's unnamed candidates (`PIRATE.md` §7b mercenaries and
  hires beyond the named); food demand against `ECOLOGY.md` and the economy; the fever reputation of a
  port (`MEDICINE.md`, `ENVIRONMENT.md`); events the fate owners may use (an epidemic in town; a famine
  year; the port emptying).
- **Visible face:** the town's streets fuller or emptier (art keeper: crowd density as a slot of the
  town's look, open); the tavern's talk ("half the fort died of the yellow jack this summer"); the notice
  board's hiring; the market's prices; a graveyard growing (town keeper, open).
- **Mark:** **(proposed)**.

## 4. The fates fence

<!-- table:population.fences -->
*What this model may not do (the fates fence)* (fiction; confidence high; source: town/UPGRADES.md (slots, the ghost rule, succession: the farm passes to the daughter), balance/ALIGNMENT.md (fates alive/dead/ghost; departed; ownerDeparted freeze), balance/BALANCE.md C5 items 4, 13, 28 to 32 (death, succession and the reachability guarantee are Rex's open decisions), COMBAT.md 4e (states of being).)

| Named-character thing | Owner | This model | Mark |
|---|---|---|---|
| Whether a named character dies, of what, when | Rex; the story, town and balance keepers; the combat keeper in a fight | never rolls it; at most reports 'an epidemic is in town' as an event the owners may use | rex (fates are theirs) |
| Succession (who runs the farm when the farmer goes) | town keeper (UPGRADES.md) | supplies the labour pool a successor is drawn from, nothing more | **Rex** |
| Ghosting a place | the ghost rule (Rex, ALIGNMENT.md 5) | untouched | **Rex** |
| Migration of a named character (leaving, departed) | the alignment engine's location (town/aboard/departed) | untouched | **Rex** |
| States of being (ghost, mecha, zombie, angel, demon, fish-person, missing) | Rex (COMBAT.md 4e); story keeper for the fiction | a cohort count of unnamed transformed people at most (open: whether a town's pool has them) | **open** |
| The 108 characters and their alignments | balance keeper | untouched | **Rex** |
<!-- /table -->

- **(Rex, 2026-10-29)** Named characters have no biological immunity: an epidemic this model reports can
  reach them through `MEDICINE.md`'s exposure like anyone. This model still rolls nothing for a named
  character; the exposure is theirs through the body docs, the fate the fate owners'.
- **(keeper, to Rex and the keepers)** If a named character is ever to die of an epidemic this model
  reports, that is a rule in the fate owners' files (`BALANCE.md` C5 items 4, 13, 28–32: Rex's open
  decisions on mortality, succession and the reachability guarantee). This file will supply the event and
  its odds; it will not roll the die.

## 5. Settlement sizes for the game's places

- **[history]** For scale: Port Royal 6,500 (1692); Bridgetown and Barbados's 50,000 (1680s, mostly
  enslaved); a buccaneer camp a few dozen; a pirate crew 80–300 at the height (Roberts, Blackbeard,
  England's *Fancy*; POP-CREW); a Miskito village a few hundred.
- **[model] (proposed)** The starting port, "a run-down port full of dark characters" with about 12
  recruitable and residents beyond them (Rex, `PIRATE.md` §7b): a pool of 150–300 people, declining; the true
  pirate port at the top: 2,000–5,000 with a large transient share. Numbers are the keeper's placeholders
  for the town keeper to size.
- **Mark:** **(proposed)**.

## 6. What this file hands to the others

| To | What | Where it is used |
|---|---|---|
| the economy and the town's places | labour supply; food demand; the transient share (customers, recruits) | production, prices, the recruit pool |
| the fate owners (town, balance, story keepers) | events with odds: an epidemic, a famine, the port emptying | their rules, if Rex gives any |
| `../body/MEDICINE.md` | epidemic state per town (which disease, how far along) | a visiting crew's exposure |
| `ECOLOGY.md` | food demand; labour for fields | yields |
| `../PIRATE.md` §7b | the unnamed candidates by occupation | hiring, mercenaries |

## Open for Rex

1. Whether unnamed people exist in the game at all beyond the recruit pool (the town's "extras"), and
   whether they are shown.
2. The enslaved cohort (with `GOODS.md` Open for Rex 1).
3. Whether a town's population can hold transformed people (ghosts, fish-people) as a count.
4. Settlement sizes (§5) for the town keeper.
5. Everything is placeholder until the fate rules exist; the model can run beside the alignment sim without
   touching it.

## Sources

`../SOURCES.md` keys POP-*: Wrigley and Schofield (via the Toronto tables and the EHS paper), Burnard on
white mortality in Jamaica, the Port Royal earthquake accounts, Johnson for crew sizes (via `GOODS.md` J).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; historical rates, the settlement record, the daily update, the fates fence, settlement sizes; tables in `../body/data/population.json` | keeper |
