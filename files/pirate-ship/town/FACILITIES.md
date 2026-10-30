# Facilities, property and workforce: a proposed layer for the town (town keeper, 2026-10-29)

**Status: proposed (outside AI, pasted by Rex 2026-10-29). Nothing here is adopted.** Rex pasted ChatGPT's
redesign of the town as "a living production economy, not simply a collection of buildings that unlock services"
and its instructions to audit before changing anything. This file is that audit and the proposal laid against what
exists, so Rex can adopt, cut or reshape it. `TOWNS.md`, `UPGRADES.md` and `ENDINGS.md` are unchanged.

**How to read.** **(Rex)** his decision; **(proposed)** ChatGPT's, via Rex's paste; **(audit)** what the repo
holds today; **(open)** Rex's call.

## 1. The proposal in one page (proposed)

Three states a place can be in, which the game should tell apart: a **building exists**, a **business is staffed**,
and a **business is producing**. Five systems with shared ids:

| System | Owns |
|---|---|
| Town map | parcels, roads, structures, entrances, footprints |
| Property and authority | who owns, leases or publicly runs each parcel; what each may customise |
| Facilities | what a building supports: rooms, equipment, capacity, maintenance |
| Workforce | roles needed, staffing, schedules, skills, wages, productivity |
| Town economy | inputs, outputs, inventory, trade, demand, profit |

- **Production is a constraint, not an unlock:** `Q_actual = min(Q_equipment, Q_labor, Q_materials, Q_utilities)`
  as a first approximation; cycles, skill, fatigue, breakdowns and scheduling refine it.
- **Staffing scales with the facility**, from a one-person brewery to twenty workers on several vessels; no fixed
  "a brewery needs five". Historical role lists are to be researched, numbers marked proposed.
- **Four property classes:** privately owned (the NPC runs it; you can trade, negotiate or buy), player owned (you
  control renovations, furnishings, equipment, staffing, operations), public works (the town runs it; a mayor directs
  it under town rules), vacant (developable with land rights, resources, knowledge and permission). Ownership and
  political authority are two separate ways to control the town: being mayor doesn't make you own the clinic.
- **A parcel map** reserves space without forcing development: a stable footprint, with vacant parcels that
  playthroughs fill differently (commerce, shipbuilding and defence, or housing, medicine and farming). A building
  can hold several businesses; a facility can span several buildings.
- **Recruitment still matters** (Rex's rule kept): a building can exist without qualified staff, and one recruit can
  make a facility viable; but ordinary hired workers, apprentices and NPC-run businesses exist too, so not every
  employee is a story character.
- **NPC autonomy:** owners hire, buy supplies, produce, maintain and decide on their own; the town runs whether or
  not the player manages it.
- **The chain to build:** Skill → Character → Job → Facility → Building → Parcel → Town economy. The two ends exist
  (skills, recipes); the middle doesn't.
- **First milestone:** one operational town slice (a brewery, the butcher shop, the clinic and a public-works
  building) showing staffing, production, consumption, ownership, construction, customisation and NPC autonomy.

Preserved from Rex's earlier design, by the proposal's own words: the starting port is a **struggling settlement**
that begins with essential institutions, and expansion depends on the player's decisions, recruits, resources and
political authority.

## 2. What exists today (audit, 2026-10-29)

| Piece | State | Where |
|---|---|---|
| Goods, skills, recipes, occupations | exists as data | `data/pirate-ship/economy/` (`goods.json` 65 rows / 174 engine goods, `skills.json` ~40, `recipes.json` 248, `occupations.json` 43), built by `files/pirate-ship/economy/build-economy-data.py` |
| Facilities | partial: 25 equipment ids (brewhouse, oven, forge, shipyard, laboratory…) as a **per-settlement boolean**, "a settlement has or lacks each"; no location, owner, capacity or staff | `recipes.json` `facilities.list`; the rule at `../economy/GOODS.md` §3 ("knowledge + band + materials + facility") |
| Occupations | labels only: id, period, skills; no wage, schedule or workplace | `occupations.json` |
| Ports | 86 Atlantic trade nodes with production/consumption fields (all null); not town interiors | `ports.json`; `GOODS.md` L824 still says ports aren't data (stale) |
| Jobs and duties | ship only: crew jobs, the watch rotation; "in port only" is a one-line list | `../DUTIES.md`, `../STATS.md` "Doing the job" |
| Town map | one placeholder tilemap (the dock) and a loader | `data/pirate-ship/maps/dock.json`, `web/src/world/map.ts`, `DockScene.ts` |
| Town model in code | the slot model: `InstitutionSlot {owner, developed, pos, pending}`; develop requires the owner recruited; the slot freezes when the owner departs; town position = mean of developed slots | `web/src/alignment/institutions.ts`, `town.ts`, `data/pirate-ship/alignment/institutions.json` (8 sectors × 2) |
| Town design | `UPGRADES.md` slots, sectors, keys; `TOWNS.md` 16 `port.*` places; the twelve locales pending | this folder |
| Ownership, lease, rent, mayor, public works, wages | absent; ownership exists only as one owner per place, with succession on death for the farm and butcher shop | `../balance/ALIGNMENT.md` §5, `UPGRADES.md` |
| Companies, ships as actors, routes | proposed only | `../balance/ALIGNMENT.md` §10 |
| Port size | two pictures: "one small screen" (`../PIRATE.md` §4) vs 16 places and twelve locales (`TOWNS.md`) | needs reconciling either way |

## 3. Collisions with what is written (audit)

1. **One owner per place.** The slot model, `institutions.json` and the freeze-on-departure rule all key on a single
   owner. Tenants, co-owners, a sold or leased parcel, or a hired manager break develop, freeze and succession.
2. **Place = slot = art key.** Ids never change and the art keeper keys on them (`port.bakery` is the butcher shop).
   Parcels that split or merge can't rename; they'd need parcel ids under the place ids.
3. **One state per slot.** Staffing level and production level are a second and third dimension the slot model
   doesn't have; `UPGRADES.md` would need either sub-keys (`<slot>.staffed`, `<slot>.output`) or a separate facility
   record per place.
4. **Two rivals on one parcel.** `sec.church` puts the ISTJ and the ENTJ on `port.church`; the proposal's "a building
   can hold several businesses" could absorb that, or the contest needs its own rule.
5. **Mayor vs `sec.townhall`.** The town hall is a control contest between the ESTJ and an ENFP. A player mayor either
   is a third contestant, the prize of that contest, or something that duplicates it. **(open, Rex's)**
6. **The struggling port.** `port.cash` is nearly out and the town is dying (Rex). A property market and investment
   loop must not let money alone fix it, bypass "you can't max a town out" (`TOWNS.md`), or sidestep the ghost rule.
7. **Recruit vs employ.** Today, recruiting a resident takes them aboard and their place freezes or drifts to ghosts.
   Employing a resident in place, or a recruit staying to run their business, is a third state the model lacks and
   the proposal needs.
8. **Facility granularity.** Equipment is a settlement-level boolean in `recipes.json`; attaching it to parcels
   changes the engine check and the economy keeper's data.
9. **Scale.** "One small screen" vs twelve locales plus housing and vacant parcels: the parcel size and screen count
   come first.
10. **One source for production.** `ports.json` carries per-settlement production fields; per-facility production
    would overlap. One of them should derive from the other.
11. **Alignment.** The developed-institution mean (Rex) reads one `developed` flag per slot. If "developed" becomes
    "staffed and producing", the formula's inputs change; if not, a producing-but-undeveloped place is possible and
    needs a reading.

## 4. What it would add to this folder, if adopted (proposed)

- `UPGRADES.md`: per-place keys `<slot>.parcel`, `<slot>.owner_class` (private / player / public / vacant),
  `<slot>.staff`, `<slot>.output`; a parcel table with sizes and vacant parcels; a `port.mayor` key or a rule tying
  the mayor to `sec.townhall`.
- `TOWNS.md`: the parcel map (harbour, square, housing, vacant), reconciling §4's one-screen port with the twelve
  locales; which places start built, staffed and producing (essential institutions: church, clinic, inn, basic
  businesses, per the proposal).
- A facility file per trade is the economy keeper's (roles, equipment, capacity, hours, consumption, researched and
  marked proposed); the town keeper links to it, as with `../economy/GOODS.md`.
- `ENDINGS.md`: unchanged unless Rex ties an ending to ownership or production.

## 5. Open, Rex's

1. Adopt the facility / property / workforce layer at all, and if so which of the five systems first.
2. Is "developed" (the alignment input) the same as "staffed and producing", or a separate thing?
3. Does a recruited resident leave their place (today's rule) or can they stay and run it for you?
4. The mayor: a third contestant for the town hall, the prize of `sec.townhall`, or not in the game.
5. Parcel scale: how many screens the port is, and whether the twelve locales each get a parcel.
6. Who owns which starting place (private / public / vacant), and whether the player can buy any of them.
7. The first milestone's brewery: there is no brewery in the town yet (the tavern is); add one, or make the slice
   from the butcher shop, the clinic, the farm and the town hall instead.

## 6. Proposed resolutions of the collisions (outside AI, pasted by Rex 2026-10-29)

Rex's words on the paste: "ChatGPT got the right idea about ownership; the game is evolving past what it was before
so it'll need extensive updates." So the **ownership direction is Rex's**; the other five rows stay proposed until he
says. Implementation is not authorised until the map scale and the ownership rules are approved (the paste's own
condition, kept).

| Collision | Resolution | Mark |
|---|---|---|
| One owner per place | Separate **property ownership**, **business operation** and **management**. A property has one legal owner but may hold several tenants or businesses. Ownership is not control: you can buy the butcher shop's building and leave the butcher operating as a tenant, or buy building and business and hire the butcher as manager, controlling renovations and production | **Rex** (direction, 2026-10-29); the exact arrangements proposed |
| What counts as developed | Track **physical development** and **economic activity** separately: an impressive but abandoned brewery is developed physically, not economically | proposed |
| Recruiting NPCs | Three arrangements: **resident**, **crew member**, **resident employee or manager**. Recruiting someone doesn't require removing them from town | proposed |
| Mayor and town hall | Keep `port.townhall` and `sec.townhall`; the **mayor is a position of authority within the town hall**, not a competing locale | proposed |
| Map scale | Replace the one-small-screen port with a **single continuous, expandable town map** divided into parcels and districts; the original locales become landmarks and activity centres, other businesses, homes, warehouses, workshops and public facilities fill parcels around them; seamless exploration and combat kept; starts small and run down, with room to grow | proposed |
| Brewery missing | An **optional constructible facility**, not a mandatory starting locale | proposed |

- **(proposed)** Staffing connects to the population simulation (`../world/POPULATION.md`): named NPCs are owners,
  managers, specialists or key workers; ordinary residents fill the supporting positions, so a facility can employ
  fifteen people without fifteen storylines. This ties population, employment, wages, food demand and growth.
- **(proposed)** The next decision is the map scale; it determines buildings, parcels, roads, interiors and expansion.

### 6a. Approved (Rex, 2026-10-29: "the architectural decisions recorded in FACILITIES.md §6a are approved as my direction")

| Decision | Approved form | Mark |
|---|---|---|
| Physical vs economic development | tracked independently | Rex (via paste) |
| Resident, crew, employee, manager | **roles and assignments, not mutually exclusive states**: one character can be resident, employee and crew at once | Rex (via paste) |
| Mayor | a position of authority inside `port.townhall`; the `sec.townhall` contest kept | Rex (via paste) |
| Map | one continuous, expandable town map with districts and subdividable parcels, as the direction; **no fixed parcel or district count yet**: dimensions come from laying out the existing locales, housing, roads, harbour and undeveloped land | Rex (via paste) |
| Brewery | an optional constructible facility | Rex (via paste) |
| Institution alignment | developed institutions still determine the town's alignment (`port.align`), but **a change of owner or manager does not change an institution's alignment**; the story-driven transformation (the INTJ's apothecary stays hers in kind when she hires a manager) is preserved. This supersedes §7's "reads the business's operator" line | Rex (via paste) |
| Ids | `port.*` and `sec.*` stay story and institution references; parcels, buildings, businesses and titles get their own ids | Rex (via paste) |
| Ghosts | property and economy stay independent of the ghost / death-and-transformation question (`UPGRADES.md`, still unresolved): a business can close, change hands, be abandoned or transformed without deciding its occupants' supernatural fate; the story system resolves that | Rex (via paste) |
| The shift | the town is **a simulated settlement that also contains upgradeable story institutions**, not a set of upgradeable story locations; built as a reusable settlement backend like `Toolchain/realism`, the pirate game supplying its rules through adapters | Rex (via paste) |

The backend design set lives in `E:/AI Programs/Toolchain/settlement/` (own repo: `SCOPE.md`, `DEPENDENCIES.md`,
`PACKAGES.md`, `MIGRATION.md` (12 steps), `TESTS.md` (acceptance test A1), `QUESTIONS.md` (14 for Rex)); the
pirate repo's pointer is [`../settlement/README.md`](../settlement/README.md). **Rex approved implementation on 2026-10-29:** the foundation per `PACKAGES.md` and `MIGRATION.md` with the existing
test specs; no invented answers to the fourteen questions (configurable rules or explicit placeholders instead); the
current town and alignment systems preserved, the backend introduced through adapters; the engine independent of
pirate-ship with stable interfaces for the economy and realism engines; after the foundation passes, a report of
which questions block the next phase. The settlement session is building it. §7 below is the first sketch it started from and is superseded where the two differ.

## 7. The parcel and property system, first design (proposed; keeper's shape on the resolutions above)

Records, each with a stable id, in the `UPGRADES.md` style:

| Record | Key | Fields | Note |
|---|---|---|---|
| Parcel | `parcel.<id>` | district, size (footprint), access (road, harbour), zoning (any / housing / industry / public), `buildings[]`, `vacant` | the land; never renamed; a place id (`port.*`) may point at one or more parcels |
| Building | `bldg.<id>` | parcel, footprint, storeys, condition (ruined / poor / sound / fine), rooms[], `owner` | the structure; condition is the **physical** development axis |
| Property title | `title.<bldg or parcel>` | `owner` (a character slug, `player`, `town`, or `none` = vacant), class (private / player / public / vacant), `tenants[]` with lease terms, transfer rules (sale, inheritance on death, seizure) | the legal layer; one owner, many tenants |
| Business | `biz.<id>` | building(s), rooms used, `operator` (who runs it), `manager` (who directs it day to day), facility (an equipment id from `recipes.json`), staff[], hours, inventory, ledger | the **economic** development axis; `developed` for `port.align` is read from here or from the building, per Rex's answer to Open 2 |
| Arrangement | `<slug>.arrangement` | resident / crew / resident employee / resident manager, plus the business | per named character; replaces "recruited takes them aboard" where Rex allows |
| Authority | `port.mayor`, `port.council` | who holds the office; what it may direct (public titles, construction permits, taxes) | sits inside `port.townhall`; how the office is won: the `sec.townhall` contest or an election, open |

- **(proposed)** Starting state: every current `port.*` place gets one parcel and one building; their titles are
  private (the named owner) except the church, clinic, docks, fort and town hall, which are public; the rest of the
  map is vacant parcels in districts (harbour, square, housing, farmland, the edge). Which starting businesses are
  operating, and which exist unstaffed, is the audit's "essential institutions" question (§5, 6).
- **(proposed)** The slot model keeps working: `<slot>.align`, `<slot>.pending` and the sector contests read the
  **business's** operator (the character who shapes the institution), so a sold building whose operator stays
  doesn't move the town's alignment; a change of operator does.
- **(proposed)** The population simulation supplies unnamed workers as a pool per district; a business draws from it
  by role and skill band; wages flow into `port.cash` and household demand.

## 8. Open after the resolutions, Rex's

1. Map scale: one continuous town; how many districts, and roughly how many parcels (a number to balance against
   the twelve locales and the ~108 characters).
2. The ownership rules in full: who may buy what, how inheritance works (the farm to the daughter is the precedent),
   whether the town may seize, and whether a title can be lost in the siege.
3. Which of the three arrangements each named character starts in, and whether recruiting to crew still freezes
   their business (today's rule) or hands it to a manager.
4. Whether `developed`, the alignment input, is the building's condition, the business's activity, or both.

## Change log

| Date | Change | Mark |
|---|---|---|
| 2026-10-29 | File created: ChatGPT's facility / property / workforce proposal (pasted by Rex) laid against an audit of the economy data, the duties, the dock tilemap and the slot model; eleven collisions; seven questions for Rex. Nothing adopted | proposed |
| 2026-10-29 | §6 six resolutions (ownership ≠ control is Rex's direction; the rest proposed); §7 parcel / building / title / business / arrangement / authority records (proposed); §8 open. Implementation not authorised until map scale and ownership rules are approved | Rex (ownership); proposed |
| 2026-10-29 | §6a: the five resolutions, the alignment refinement (owner/manager change never moves an institution's alignment), separate ids, ghosts kept apart, and the settlement-backend shift approved by Rex via paste; design set in Toolchain/settlement (pointer ../settlement/README.md) | Rex (via paste) |
| 2026-10-29 | Rex approved §6a as his direction and the implementation of the settlement engine foundation in Toolchain/settlement (adapters, placeholders for the 14 open questions, acceptance test A1); forwarded to the settlement session | Rex |
