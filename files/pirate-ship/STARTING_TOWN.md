# The starting town's configuration: one review for Rex (2026-10-30)

Town, Settlement and Economy all wait on the same decisions, and each has been asking separately. This file
collects every open question about the starting port in one place, grouped the way Rex chose (via ChatGPT,
2026-10-30). Rex answers here, once; the town keeper then carries the answers into `town/`, the settlement keeper
into `Toolchain/settlement/QUESTIONS.md` and `rules.json`, the economy keeper into `Toolchain/economy/CONTRACTS.md`
§12. Until a row is answered, the engines run on the **default** shown, marked proposed.

Groups 1–3 can be answered without group 4. The milestone they unlock: the thirty-day settlement simulation run
on approved starting-town data instead of proposed fixtures.

Marks: **(Rex)** decided; **(Rex, partial)** he has answered part of it; **(proposed)** a starting point; the
**Answer** column is his to fill. Question ids are the keepers' own (Settlement Q-numbers, Economy contract §12
numbers, GOODS.md Open numbers, Balance C5 items) so an answer can be traced back.

## Group 1. The physical town

| Id | Question | Default today (proposed) | Blocks | Answer |
|---|---|---|---|---|
| Q1 | **Footprint class** for each of the 16 places: small / medium / large / field / open. **(Rex, partial, 2026-10-29):** dimensions derive from the real building, road, housing and expansion needs, never from the 90×60 example. Still open: the class per place, the **household size** to assume, and the **reserve share** (how much of the map starts undeveloped) | **researched/estimate (town keeper, 2026-10-30; derivations in Town keeper research below):** classes: small = ESTP hut, INFP house, ESFJ stall, soldier's house, apothecary (one-room timber house ~15×20 ft); medium = butcher shop, tavern, clinic, market stalls' house (shop-house ~20×40 ft, trade below, household above); large = church, warehouse, shipyard, town hall, fort (40×60 ft and more; the fort by its walls); field = farm (10 acres, a small settler's provision ground); open = docks, market square. **Household size 6** (Port Royal 1692: 6,500–10,000 people in ~1,200 houses → 5–8 a house; a tradesman's household = family + apprentice or servant). **Reserve share: half the plotted lots vacant or ruined** at the start (Nassau after the 1703/1706 Spanish-French burnings was huts and a ruined fort when Rogers landed in 1718: estimate, weak) | Settlement step 3 (the derived map); T2 | |
| Q5 | **Starting fixtures:** which places start with which of the 25 facility ids (`recipes.json` `facilities.list`: forge, oven, smokehouse, salting-house, still, brewhouse, mill, loom, ropewalk, tan-pits, saw-pit, shipyard, kiln, dairy, surgeon-s-chest, laboratory, …) | a proposed table in `rules.json` | Settlement step 5; T6 | |
| Q9 (econ 7) | Does an **idle fixture count** as "the settlement has it" (the recipe rule checks equipment before the band)? | yes (`activeOnly: false`; the reader's `hasFixture` default) | Settlement T6; Economy's reader | |
| Q6 | **Starting title rows:** for each place, the holder (a named character, `town`, or `none` = vacant) and whether a business starts **operating**. **(Rex, partial, 2026-10-29):** established owners of the named places are preserved; the player acquires property through purchase, inheritance, agreements or other permitted transfers; not every property is automatically purchasable. Still open: the exact rows (who is public, who is vacant), and **faction-specific restrictions** on who may hold what | **researched (pattern) / estimate (rows):** English Caribbean towns held lots privately by patent or purchase; the parish church was the vestry's, the fort the Crown's, wharves mixed (a public wharf beside merchants' own), the market regulated by the vestry or magistrates; taverns private but licensed. Rows: church → `town` (the parish); fort → `town` (the Crown's, held for the game by the town); docks → `town` (one public wharf) with private wharves possible; market → `town`; town hall → `town`; clinic → private (a physician's own house; no public hospital in a town this size); every other place → its named holder, operating at the start (shop-houses run by their households). Faction restrictions: **fiction**, Rex's | Settlement steps 4 and 6; T3, T5, A1 | |

The 16 places (`town/TOWNS.md`): docks, shipyard, market, tavern/brothel, butcher shop (`port.bakery`), farm,
clinic, church, warehouse, apothecary, the ESTP's hut, the INFP's house, the ESFJ's shop or stall, town hall, fort,
the old soldier's locked house (existence open).

## Group 2. Economic operation

| Id | Question | Default today (proposed) | Blocks | Answer |
|---|---|---|---|---|
| Q10 | **Posts, production lines, wages and rents** per starting business: how many posts each has, which recipe lines it runs, the wage per trade, the rent on town-held titles | sourced period figures where research found them, else placeholders in `rules.json` | Settlement steps 6 and 7; T9; Economy's labour quotes | |
| Q15 | **Labour sharing across lines.** When one business runs several production lines with the same workers, how is the day's labour split? Today: in order, the first line takes what it can, the next gets the rest; the thirty-day benchmark (test I2) shows one butcher making no smoked meat until the salt-meat line runs out of cattle. **Proposed answer (Rex's ChatGPT paste, 2026-10-30):** workers have a **finite day of working time**, not permanently consumed by whichever line runs first: a worker with eight hours can spend five brewing and three in storage where tasks and schedules permit. **Settlement owns the worker's availability and assignments; Economy owns the labour hours each process requires.** This stops processing order deciding which business succeeds. Alternatives: proportional split; a priority the manager sets per line; demand-led through the economy | in order, as written; the benchmark encodes it | Settlement step 7; T9; ECON-4 | |
| econ 6 | **Wage levels** per trade (with Q10), and whether a **market wage quote** may move a business's wage (`setWage` exists; whether quotes reach it is Rex's) | wages fixed by `rules.json`; quotes don't move them | Economy labour quotes; Settlement `setWage` | |
| econ 5 | **The price formula** and its constants (supply and demand → price) | a config key; placeholder constants | Economy prices; the benchmark's price lines | |
| econ 1 / GOODS Open 2 | **Money or goods?** Silver, gold, gold dust, coin, pearls: a good with stock and a price, or the currency itself | goods; the ledger counts coin apart | Economy accounting; `goods.json` | |
| GOODS Open 3 | **Grain of goods:** three sugar grades or one; beef and pork or one salt meat; separate dyewoods or one | as in `GOODS.md` (fine) | `goods.json`; every recipe | |
| GOODS Open 4 | **Raw / manufactured pairs** (iron / tools, muscovado / loaf sugar, molasses / rum, cotton / cloth): does the game turn one into the other? | kept apart; recipes exist for the turn | recipes | |
| GOODS Open 5 | **Live cargo** (horses, turtle): goods that die rather than spoil, or not goods? | goods with a death clock | `goods.json` spoilage | |
| GOODS Open 7 | **Names:** period words (kill-devil, boucan, otta) or plain names, one per good | plain, with the period word in the blurb | the glossary | |
| GOODS Open 8 | **Cask size:** one 63-gallon hogshead for sugar, molasses and rum; the large tobacco cask; or casks that grow over the timeline | one 63-gallon cask | units in every recipe and price | |
| GOODS Open 1 | **The trade in enslaved people:** in the game, out, or referred to some other way. Recorded in `GOODS.md` Part 1e as fact; no type proposed | out of the data until Rex rules | `goods.json`; the Atlantic map's routes | |
| GOODS Open 6 | **The cultural column** of goods types: each entry needs a yes or no (the sources show where goods went, not that others valued them less) | unconfirmed; the three types (base, specialty, cultural) stand as Rex's | `goods.json` types | |
| ECON-5 | **Recipe quantities:** yields, labour per unit and by-product units are not in `recipes.json` (inputs are named, not measured); `ports.json`'s five per-settlement numbers are null. Who supplies them: the balance lane's data, research, or placeholders Rex approves? | the loader takes them from the host; tests use fixtures | every production line | |

## Group 3. Financial authority

| Id | Question | Default today (proposed) | Blocks | Answer |
|---|---|---|---|---|
| Q7 (econ 2) | **Is `port.cash` the settlement treasury?** If yes: public-works wages, rents on town-held titles and permit fees move it, and "the town is nearly out of cash" (Rex, 2026-10-28, why the INFJ leaves) becomes the treasury's balance. If no: the treasury is its own account and `port.cash` stays a story key | its own account | Settlement step 4; Economy accounting | |
| econ 3 | **Who values property** for an unpriced sale (a title, building or parcel)? The economy prices goods only; no land market was proposed. Options: a fixed valuation table per class; a rule from rents; the story sets each price | `valueOf` throws for property; no command calls it | any sale without a stated price; ECON-7 | |
| econ 4 | **Is named characters' spending simulated**, or only the population pools'? (Household consumption's source: the market's five numbers, headcount × per-capita, or named characters' ledgers) | pools only; named characters' spending not simulated | Economy consumption; ECON-8 | |
| Q8 | May the player **set a layout freely** in a building they own (Stardew furnishing), or only through a renovation project with materials and labour? | projects only (`freeLayout` off) | Settlement step 8; U8, T11 | |

## Group 4. Narrative consequences (answer whenever; nothing in groups 1–3 waits on these)

| Id | Question | Default today (proposed) | Blocks | Answer |
|---|---|---|---|---|
| C5 item 28 | **The two ghost rules.** The pair rule (2026-10-28: neither of a pair recruited → both ghosted; one → the rival ghosts) versus the death rule (2026-10-29: a character becomes a ghost, zombie, mecha, angel, demon or fish-person only on actual death or transformation, by who did it). Does the death rule replace the pair rule, or do both apply? | **fiction** (no historical data; Rex's): both recorded; the sim runs the pair rule | Balance (paused on this); Town `UPGRADES.md`; Story; Combat §4e | |
| Q3 (FACILITIES §8.4) | **"Developed"**, the alignment input: the building's condition, the business's activity, both, or neither? If either, which settlement event may issue `develop`? | **fiction** (an engine reading, not a historical question): `develop` stays a story command; the two readings are queries only | Settlement step 10; T14; the alignment engine | |
| Q9 (settlement) | **Inheritance:** the farm to the daughter and the butcher shop to the son are precedents. A general custom (eldest child, spouse, the town) applied when a holder dies, or story-issued one by one? | **researched:** English law applied in the colonies: real property of an intestate to the eldest son (primogeniture), the widow's dower a life third; personal goods and any land by **will**, and Jamaican wills often favoured widows and daughters because so few sons survived (Burnard 1991); no heir → escheat to the Crown; buccaneer matelotage: the surviving partner takes the dead one's share. Proposed custom: a story-written will first (the farm to the daughter, the butcher shop to the son are wills); else eldest child, else spouse, else `town` (escheat) | Settlement step 4; T4; the death rule | |
| Q11 | **The mayor's office:** how it is won (the `sec.townhall` contest's prize, an election, an appointment), and what it may do (permits, public titles, taxes, seizure). This is the first Government-engine question; Settlement records the holder, Government will define the powers | **researched:** no town in the period had a mayor: a Crown or proprietary **governor** with a council, and locally **justices and a parish vestry**; pirate Nassau chose its own (Jennings "governor" by acclamation, Blackbeard a magistrate), until the Crown appointed Rogers in 1718. Proposed: the office is a governor-magistrate held by whoever wins the `sec.townhall` contest (acclamation) until an outside power appoints one (Imperial faction); powers `[permit, public-title]`, taxes and seizure **fiction** for Rex | Settlement step 9; T13; the Government lane | |
| Q12 | **Which engine events the story hears** (a title changing hands, a business going dormant, a public work completing) as town events or choice words | **fiction** (engine): none | Settlement step 10 | |
| FACILITIES §8.3 | **Starting arrangements** per named character (resident / crew / resident employee / resident manager). **(Rex, 2026-10-29, Q2):** recruiting never ends an assignment; a person aboard is unavailable for their posts that day; the business runs on who is left | **researched (the norm):** a tradesman lived at his shop (shop-house), and the household (family, apprentice, servant, the enslaved) ran it with him; a pirate signed **articles per cruise** and his share was his own. So: each named owner is **resident operator** of their place; recruiting = signing articles for a cruise, the household runs the business meanwhile (Rex, Q2) | the start rows | |
| FACILITIES §8.2 | **Ownership rules in full:** who may buy what; whether the town may seize; whether a title can be lost in the siege | **researched:** freehold by patent or deed, any free subject may buy; sale by deed; **forfeiture** of lands and goods on conviction for piracy (1700 Act); **escheat** to the Crown with no heir; a town taken by an enemy was sacked and burned (Nassau 1703, 1706), its titles kept only if the owner returned and the Crown's rule did. Proposed: `transferable` per title; no seizure by the town itself, only by a governor or an occupying faction; the siege can burn a building, not void a title; faction-specific limits **fiction** | Settlement rules; the siege event | |
| Q14 | **A second consumer** to prove the settlement engine's reuse: a High Roller casino floor, the ship's own deck as a settlement of rooms, or a plain hamlet | **fiction** (engine): a plain hamlet | Settlement step 11 | |

## How the answers get filled (Rex, 2026-10-30: historical first)

The game is based on realism, so **historical or real-world data fills an answer wherever it exists**; Rex rules
only where no data exists or sources conflict. So the keepers fill their own rows first:

1. Each keeper researches its rows (a Caribbean pirate haven, c. 1690–1720, the game's period) and writes the
   value into the Default column with one of three labels: **researched** (source named), **estimate** (derived
   from research, the derivation shown), **fiction** (no data; a proposal for Rex).
2. Rows labelled researched or estimate go to Rex as "approve or change", not as open questions. Rows labelled
   fiction are the only ones he has to decide from scratch.
3. Rex writes in the Answer column, or replies with the id and the answer; an approved researched value becomes
   **(Rex)** with its source kept. Anything unanswered keeps its default with its label.

Each keeper takes its rows from here and nowhere else.

## Town keeper research (2026-10-30; group 1 and group 4 rows)

The referents: **Port Royal, Jamaica** before and after 1692 (the rich version of a haven) and **Nassau, New
Providence, 1703–1718** (the run-down version: burned by a Spanish-French force in 1703 and again 1706, then huts,
a ruined fort and a pirate "republic" until Rogers's arrival in 1718). The starting port is the run-down one.
Sources: `SOURCES.md`, keys `TWN-*`.

| Row | Value | Label | Derivation |
|---|---|---|---|
| Q1 classes | small / medium / large / field / open as in the row | estimate | Port Royal 1688: ~600 brick and ~600 timber houses on 53 acres (TWN-PR) → ~0.04 acre (≈1,700 sq ft) a lot, so a one-room house ~15×20 ft, a shop-house ~20×40 ft with a yard; brick of 2–3 storeys at Port Royal, timber and thatch at Nassau (TWN-NAS); the church, warehouse, shipyard and fort are larger by their own needs |
| Q1 household | 6 | estimate | 6,500–10,000 people in ~1,200 houses (TWN-PR) → 5–8 a house; a shop-house holds the family and an apprentice or servant; the enslaved counted in Barbados's 1679 census households (TWN-BAR) |
| Q1 reserve | half the plotted lots vacant or ruined | estimate (weak) | Nassau 1718: huts, a fort "in ruins", a bastion that fell after Rogers landed (TWN-ROG); no count of lots survives |
| Q1 farm | 10 acres | estimate | small-settler provision grounds in Jamaica ran to tens of acres (TWN-DUNN, standard reference); Rex's farm feeds a town, not a sugar estate |
| Q6 pattern | private lots; church (vestry), fort (Crown), public wharf and market (town) | researched | Port Royal's lots were patented and sold; St Paul's was the parish's; the forts the Crown's (TWN-PR); Nassau's land under the Lords Proprietors (TWN-NAS) |
| Q9 | will → eldest child → spouse → escheat | researched | English intestacy and dower (TWN-LAW, standard reference); Jamaican wills favouring widows and daughters (TWN-BURN); matelotage (TWN-MAT) |
| Q11 | governor-magistrate, by acclamation or appointment; no mayor | researched | Jennings and Blackbeard's offices at Nassau; Rogers 1718 (TWN-NAS, TWN-ROG) |
| §8.3 | resident operator; articles per cruise | researched | the shop-house (TWN-PR, standard reference); pirate articles (TWN-CODE) |
| §8.2 | freehold, sale by deed, forfeiture on piracy conviction, escheat, towns sacked not retitled | researched | 1700 piracy Act and forfeiture (TWN-LAW); Nassau burned 1703 and 1706 (TWN-NAS) |
| C5 item 28, Q3, Q12, Q14 | unchanged | fiction | no historical data: Rex's or the engines' |

## Log

| Date | What |
|---|---|
| 2026-10-30 | Written by the coordinating session from `Toolchain/settlement/QUESTIONS.md`, `Toolchain/economy/CONTRACTS.md` §12, `town/FACILITIES.md` §7–8, `economy/GOODS.md` Open for Rex, `HQ/handoffs/economy/ISSUES.md`; the Q15 proposed answer from Rex's ChatGPT paste of the same day |
| 2026-10-30 | Town keeper filled the group 1 and group 4 Default cells (researched / estimate / fiction) with the derivations in Town keeper research; Q5, Q10 and the rest are the settlement and economy keepers' | town keeper |
