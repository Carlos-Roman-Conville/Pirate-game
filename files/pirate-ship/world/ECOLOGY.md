# Ecology: fish and game stocks, agriculture, soil, seasons, depletion and regeneration (body-and-world keeper, 2026-10-29)

One of the world docs Rex asked for (`../combat/COMBAT.md` §4b: "agriculture and soil fertility; ecology
and animal populations"). It supplies the fishing minigame and the fisherman duty with **how many fish are
there**, the hunters and the boucaniers with game, the farm and the plantation with yields, and the economy
with the supply side of food (`../economy/GOODS.md`). It feeds the body only through food: what the pool of
goods a port can offer looks like after a season of fishing or a hurricane.

**How to read.** **[science]** / **[history]** / **[model]** / **[fiction]**; marks **(Rex, date)**,
**(proposed)**, **(proposed, outside AI)**, **(open)**. Tables are rendered from `../body/data/ecology.json`.

**Clock.** Stocks and fields update at the overnight tick for the place the player is at, and in a batch
(days elapsed) for distant grounds and farms. The year's calendar (§5) is the season signal everything else
reads.

## What Rex has decided that this file must respect

- **(Rex, 2026-10-26)** Fishing: some fish sit closer to the dock, some farther out; each likes certain
  rhythms; reading the water reveals which fish are there (`../minigames/FISHING.md`). This file supplies
  which fish are there and how many; the minigame is Rex's.
- **(Rex, 2026-10-27)** The farm (`port.farm`) and the butcher shop are the town's food source; they develop
  only if you supply the bodies (`../town/UPGRADES.md`). This file gives a farm's yield as a function of
  soil, rain and labour; what "the bodies" do to it is the story's and the town keeper's (fiction, not
  agronomy).
- **(Rex, 2026-10-29)** Provenance tags: a Triassic or mythical creature is tagged; its ecology (r, K) is
  read like any other stock's. This file lists only historical species; tagged ones are the story keeper's
  to add with their own rows.
- **(Rex, 2026-10-29)** Real goods from the economy sim are the provisions (`COMBAT.md` §7).

## 1. Stocks: fish, turtle, game

**Inputs:** the ground (a reef, a lane, a beach), the season, effort (how many boats or hunters, their
skill), last state. **Outputs:** biomass B relative to K; today's catch per unit effort.

- **[science]** The Schaefer surplus-production model: a stock grows logistically and shrinks by the
  catch; the maximum sustainable yield is rK/4 at half the carrying capacity; catch per effort falls as
  the stock does (ECO-SCHAEFER). It has no age structure and reacts at once to effort, which is fine for a
  game.
- **[history]** The Cayman green turtle fishery fed Port Royal ("every day plentifully stored", `GOODS.md`
  row 60) and was already declining when settlers arrived in the early 1700s; by 1787 the catch was 1,200
  to 1,400 a year sold at Jamaica, and by the early 1800s the turtlers had moved to the Miskito Cays
  (ECO-TURTLE). The boucaniers of Hispaniola hunted its wild cattle down over the second half of the
  seventeenth century. Sailors fished from the rail for dolphin fish, bonito and shark; flying fish landed
  on deck (`../DUTIES.md`).

<!-- table:ecology.stocks -->
*Fish, turtle and game stocks (Schaefer model parameters, per local ground)* (model; confidence low; source: Schaefer 1954 surplus production: B(t+1) = B + r B (1 - B/K) - C; MSY = rK/4 at B = K/2 (FAO; ECO-SCHAEFER). r values are the keeper's reading of life history (fast for small pelagics, slow for turtles and sharks); K is per fishing ground in units of catch-days. Turtle depletion: the Cayman fishery was already in decline when permanent settlers arrived in the early 1700s; 1,200 to 1,400 turtles a year sold at Jamaica in 1787; the fleet moved to the Miskito Cays by the early 1800s (ECO-TURTLE). Fish species named are those period sailors caught from the rail (DUTIES.md: dolphin fish, bonito, shark, flying fish; FISHING.md).)

| Stock | Where | r (per year) | K (catch-days per ground per year) | MSY (calc) | Recovery after half-depletion (years) | Seasonality | Period note | Mark |
|---|---|---|---|---|---|---|---|---|
| Reef fish (snapper, grouper, grunt) | reefs and banks near a port | 0.4 | 2000 | 200 | 3 to 5 | year-round; spawning aggregations in spring | the port's daily fish | proposed |
| Pelagics (dolphin fish, bonito, tuna, flying fish) | open water, the trade-wind lanes | 1 | 5000 | 1250 | 1 to 2 | more in the dry season winds | caught under way; flying fish land on deck | proposed |
| Sharks | everywhere; the harbour | 0.1 | 500 | 12 | 10+ | year-round | eaten by buccaneers; a gaff or harpoon stage (FISHING.md open) | proposed |
| Green turtle | Cayman, the Miskito Cays, the south cays of Cuba; nesting beaches | 0.05 | 1500 | 19 | 20 to 40 (a generation) | nesting May to September; easiest to take on the beach then | the meat of Port Royal; depleted at Cayman within a century | proposed |
| Hawksbill (shell) | reefs | 0.05 | 300 | 4 | 20+ | nesting summer | tortoise shell, GOODS.md row 15 | proposed |
| Manatee | lagoons, river mouths (Mosquito Coast) | 0.03 | 100 | 1 | 30+ | year-round | Dampier: the Miskito strikers' catch | proposed |
| Wild cattle and boar (Hispaniola, Jamaica hills) | savannas and forest | 0.5 | 3000 | 375 | 2 to 3 | year-round; boar fat in the fruit season | the boucaniers' trade (GOODS.md row 61); hunted down on Hispaniola by 1700 | proposed |
| Feral goats and hogs (small islands) | Tortuga, the cays | 0.6 | 400 | 60 | 2 | year-round | ships' provisioning stops | proposed |
| Sea birds and eggs | rookery cays | 0.3 | 800 | 60 | 3 to 5 | nesting spring | boobies and their eggs; easily wiped out on a small cay | proposed |
| Iguana, land crab | dry islands | 0.5 | 500 | 62 | 2 | crabs run in the rains | Sloane and Dampier both ate them | proposed |
| Lobster and conch | reef flats | 0.3 | 1000 | 75 | 3 to 5 | conch year-round; lobster closed season in nature's spring moult | the small-boat catch | proposed |
<!-- /table -->

<!-- table:ecology.depletion_rules -->
*Depletion and regeneration rules* (model; confidence medium; source: Logistic recovery is the Schaefer model's own; the catch-per-effort fall is the standard signal (CPUE proportional to B); the 'tragedy' row is the Cayman history. The fishing minigame's catch (FISHING.md stage 1, reading the water) is the visible face: fewer silhouettes.)

| Rule | Formula or statement | Visible face | Mark |
|---|---|---|---|
| Daily catch per fisher | catch = q x effort x B / K (q from Fishing skill, FISHING.md stages); the minigame shows B/K as how many silhouettes appear | 'the fish are thin here' | proposed |
| Overnight stock update | B += r B (1 - B/K) / 365 - today's catch (all boats on the ground, aggregate for distant ones) | - | proposed |
| A ground is 'fished out' | B under 0.2 K: catch x0.2, the port's fish price up (economy), the fisherman duty yields little | the market; the fisherman's complaint | proposed |
| Recovery | logistic: from 0.2 K back to 0.8 K takes about 2.8/r years (reef fish 7 years, pelagics 3, turtles 56) | the fish return if left | proposed |
| Turtle crawls (GOODS.md row 60) | live turtles kept in pens do not deplete further but do not breed; a crawl of N feeds N x 30 kg | the pens at the harbour | proposed |
| Nesting beaches | taking turtles on the beach in nesting season takes breeding females: r x0.5 for that stock for a decade | the beach empty next year | proposed |
| Hunting pressure | the same model for game; boucaniers on Hispaniola at MSY x3 drove cattle to near zero by 1700 (history) | no hides at the French camps | proposed |
<!-- /table -->

- **Effects:** the fishing minigame's stage 1 (how many silhouettes, which species) and the fisherman's
  daily catch (`DUTIES.md`); the port's fish supply and price (economy); the hunting sector's game
  (`../town/UPGRADES.md` hunting pair: the ESTP vs the ISTP); turtle crawls as a town place.
- **Visible face:** fewer fish seen when reading the water; the market's fish price; "the turtles don't
  come to this beach any more"; a hunter back with nothing.
- **Mark:** **(proposed)**, the parameters placeholders and a belt data task.

## 2. Agriculture

<!-- table:ecology.crops -->
*Crops: yields, seasons and soil* (history; confidence medium; source: Ligon 1657 on Barbados cane (planted in rows, 14 to 16 months to ripen; replanted from cuttings; cassava and potatoes as bread; plantains); modern tropical agronomy for cycle lengths; Barbados deforested and its soil exhausted within decades of 1640, with heavy manuring and cane-holing the response (ECO-SOIL). Yields are modern unimproved-tropical figures, not period measurements.)

| Crop | Planting season | Months to harvest | Yield (t/ha, unimproved) | Soil demand | Labour (person-days/ha) | Keeps | Period note | Mark |
|---|---|---|---|---|---|---|---|---|
| Sugar cane | wet season start (May to June) or the end of the rains | 14 to 16 (ratoons 12) | 30 to 50 cane = 3 to 5 sugar | very high; exhausts in 10 to 20 years without manure | 300 | cane cut and milled within a day; sugar keeps | Ligon; the whole economy of GOODS.md 1a | proposed |
| Cassava | any, best early rains | 9 to 12 | 8 to 12 (root) | low; grows on poor soil | 80 | root 2 days; cassava bread weeks; farinha a year | the islands' bread (GOODS.md row 76) | proposed |
| Maize | early rains | 3 to 4 | 1 to 1.5 | medium | 60 | a year dry | two crops a year; pellagra if the only food | proposed |
| Plantain and banana | any | 9 to 12 first, then continuous | 10 to 20 | medium | 50 | fruit a week | the planters' staple for the enslaved (Ligon) | proposed |
| Yams, sweet potatoes | early rains | 4 to 8 | 6 to 10 | medium | 70 | root 1 to 2 months |  | proposed |
| Pease and beans | dry season end | 3 | 0.6 to 1 | low; fixes nitrogen | 40 | a year dry | pease the ship's food (row 25) | proposed |
| Citrus (limes, oranges) | trees: 3 to 5 years to bear | fruits twice a year | 5 to 10 | low | 30 | fruit 2 to 4 weeks | lime juice (row 18); the scurvy answer | proposed |
| Cacao | trees: 4 to 5 years | two harvests | 0.3 to 0.5 dry beans | high; shade needed | 100 | dried beans a year | Jamaica's crop failed in the 1660s (the blast); row 11 | proposed |
| Tobacco | early rains | 4 to 5 | 0.8 to 1.2 cured | high; exhausts in 3 to 5 years | 200 | cured a year | the small planters' crop before sugar | proposed |
| Indigo | early rains | 3 to 4 (cut 2 to 3 times) | 0.1 to 0.2 dye | high | 150 | dye keeps | row 9 | proposed |
| Ginger | early rains | 8 to 10 | 5 to 10 (fresh) | medium | 120 | scraped and dried: a year | row 6 | proposed |
| Cattle (savanna) | - | 3 years to slaughter | 0.2 head/ha/year | pasture | 10 | hides, tallow, salt beef | Jamaica's pens; Hispaniola's wild herds | proposed |
| Goats, hogs, fowl | - | 1 year | small | scraps | 5 | live | ship stock (DUTIES.md feeding the livestock) | proposed |
<!-- /table -->

- **[history]** Ligon (1657) describes Barbados cane planted in rows and ripening in 14–16 months,
  replanted from cuttings; cassava and potatoes as the island bread; plantains for the enslaved
  (`GOODS.md` source L). Yields in the table are modern unimproved figures, not period measurements
  (confidence medium for the cycle lengths, low for the tonnages).
- **[model] (proposed)** A farm is a set of fields with a crop, a planting day and a fertility; the
  overnight tick advances growth (days to harvest × a rain factor), and the harvest adds goods to the
  farm's stock (the economy's `goods.json` ids). Labour comes from `POPULATION.md`'s labour supply or the
  farm's own people.
- **Effects:** the town's food (`POPULATION.md` food_days); the goods for sale; the farm sector's
  development is the town keeper's and the story's (bodies), not yields.
- **Mark:** **(proposed)**.

## 3. Soil fertility

<!-- table:ecology.soil -->
*Soil fertility model* (model; confidence low; source: A fertility index per field (0 to 1) drained by each crop's demand and restored by manure, fallow and legumes; Barbados exhaustion and the planters' manuring response are the historical anchor (ECO-SOIL). Numbers are placeholders.)

| Rule | Formula | Visible face | Mark |
|---|---|---|---|
| Fertility drain per harvest | f -= demand (cane 0.06, tobacco 0.08, maize 0.03, cassava 0.01, pease -0.02 i.e. restores) | 'the cane comes up thin' | proposed |
| Yield | yield = max yield x (0.3 + 0.7 f) x rain factor x labour factor | the harvest count | proposed |
| Manure | f += 0.03 per 10 t/ha of dung (cattle pens next to cane fields: the Barbados practice) | the dung heap by the field | proposed |
| Fallow | f += 0.02 a year idle; +0.04 under bush | the field left | proposed |
| Deforestation | clearing forest gives f = 0.9 for a new field but removes firewood for the mill and raises erosion: f -= 0.02 a year extra on slopes | the bare hills; firewood bought (Barbados imported timber) | proposed |
| Rain | a dry year (under 60% of normal) halves yields; a hurricane destroys standing cane and plantains for a season | the famine year | proposed |
<!-- /table -->

- **[history]** Barbados was rainforest in 1627 and almost all cane within decades; the soil thinned,
  erosion followed the lost tree roots, planters manured heavily and moved to new land when ground and
  firewood ran out; by the 1840s Britannica called the soil "long exhausted" (ECO-SOIL). Cane-holing
  (digging planting holes to hold soil and dung) was the planters' answer by the end of the century.
- **Mark:** **(proposed)**.

## 4. Depletion and regeneration, in one rule

- **[model]** Everything living in this file is a stock with `r` and `K`; take more than rK/4 a year and it
  falls; leave it and it climbs back on the logistic curve; destroy its habitat (a nesting beach, a forest
  field) and `K` falls for good. A soil is a stock whose `r` is manure and fallow. That one rule is what
  makes the system modular (the memory rule: reusable modules): a new animal, crop or tagged creature is a
  row.
- **Mark:** **(proposed)**.

## 5. The year's calendar

<!-- table:ecology.seasons -->
*The year's calendar for the world tick* (history; confidence medium; source: Dry season December to May, wet June to November; hurricane season June to November peaking August to October; turtle nesting May to September; the Spanish fleets sailed from Havana in spring and summer to avoid the hurricane months (period practice); sugar crop cut January to May in the dry season (Ligon).)

| Months | Weather | Sea | Fishing and hunting | Crops | Disease (MEDICINE) | Trade (economy) | Mark |
|---|---|---|---|---|---|---|---|
| Dec to Feb | dry, cooler, northers in the west | fresh trades | pelagics good; turtles scarce | cane harvest begins; planting pease | lowest fevers | the Jamaica fleet sails home; Europe's goods arrive | proposed |
| Mar to Apr | dry, hottest sun overhead | steady trades | reef fish spawning aggregations | cane harvest and boiling | low | the sugar ships load | proposed |
| May to Jul | early rains, then the mid-summer dry | lighter winds | turtles nesting (easy on the beaches); crabs run | planting cane, maize, yams | fevers rise with the rains | the flota leaves Havana before the storms | proposed |
| Aug to Oct | wet, hurricane peak | squalls, hurricanes | fishing hard in the weather | growing; a hurricane flattens it | yellow fever and malaria peak | ships lie up or risk the passage; prices spike | proposed |
| Nov | rains ending | trades return | good | second maize crop | fevers fall | the season opens | proposed |
<!-- /table -->

- **Mark:** **[history]** the facts; **(proposed)** as the world tick's calendar (`ENVIRONMENT.md` open 1:
  real months or seasons).

## 6. What this file hands to the others

| To | What | Where it is used |
|---|---|---|
| `../minigames/FISHING.md`, `../DUTIES.md` | which fish, how many (B/K), the season | reading the water; the fisherman's catch |
| the economy (`GOODS.md`, the ports file) | food supply per port per season; yields; fish and game prices through scarcity | prices, stores |
| `POPULATION.md` | food_days, famine years | health, deaths, migration |
| `../town/UPGRADES.md` | a farm's yield as a number the farm slot may show (the keeper's reading; the slot's states stay the town keeper's) | the food source |
| `../body/NUTRITION.md` | nothing directly: food reaches the body as goods | - |
| `ENVIRONMENT.md` | nothing back | - |

## Open for Rex

1. Which species the game fishes and hunts (the table lists the period's); tagged creatures are the
   story keeper's rows.
2. Whether depletion is wanted at all in the first build (the dock's fish could be a fixed pool); the
   keeper proposes the stock model from the start since it is one rule.
3. Whether the farm's yield matters to the town's food, or the farm is only a story place with the bodies.
4. All parameters are placeholders for the simulator.

## Sources

`../SOURCES.md` keys ECO-*: FAO on surplus production and MSY; the Cayman turtle history (Cayman Turtle
Centre history, the tDAR turtlers paper, the Cayman Compass); Barbados environmental history (Salem State
thesis, Hollsten, the 1842 Britannica entry, the NYBG note); Ligon 1657 (via `GOODS.md` L).

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | File opened; stocks (11), depletion rules, crops (13), soil, the one rule, the calendar; tables in `../body/data/ecology.json` | keeper |
