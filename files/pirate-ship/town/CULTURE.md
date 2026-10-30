# `port`: the starting port's culture at the start (town keeper, opened 2026-10-30)

**What this is (Rex, 2026-10-30):** the town's **starting conditions only, never the engine.** Culture later emerges
from the individuals and institutions (the future Society and Cognition engines, `Toolchain/ENGINES.md`); this file
is the seed they start from. One `CULTURE.md` per town; this is the starting port's. Religion, economic system,
political system and culture are **separate dimensions that interact** (Rex): a town can be Anglican, under a
governor, with private merchant ownership and strong mutual aid at once.

**Labels:** **researched** (source in `SOURCES.md`, keys `TWN-*`), **estimate** (derived; derivation shown),
**fiction** (no data; Rex's or proposed). **(Rex, date)** where Rex decided. The referents are Port Royal, Jamaica
(1670s–1692, the rich haven) and Nassau, New Providence (1703–1718, the run-down one); the starting port is the
run-down one, in the game's space-time-anomaly version of the Caribbean (`../science/JOURNAL.md`), so the Crown is
the Imperial faction and the dates are flavour, never canon.

## 1. Starting beliefs and religious preference

| Item | Starting value | Label | Note |
|---|---|---|---|
| Established church | Anglican-type (the Imperial Crown + Church faction's rite); one parish church, `port.church`, with a resident priest (`istj-m`, Rex) | researched (pattern), fiction (the priest) | English Caribbean towns were nominally Anglican with a parish church and vestry (TWN-PR); Nassau had no resident clergy in its pirate years (estimate, TWN-NAS) |
| Observance | low: Sunday service kept by the respectable few; sailors and the poor rarely attend | estimate | Port Royal's reputation as "the wickedest city" and its tavern count (TWN-PR); the run-down port is poorer still |
| Minorities present | a Jewish merchant community with its own burial ground; Catholics (Spanish, Irish, French) tolerated but barred from office; dissenters | researched | Port Royal and Kingston's Jews, buried apart, carried by boat to Hunt's Bay; the 1711 bar on Jews holding office (TWN-JEW) |
| Folk belief | strong: African-Caribbean and sailors' beliefs side by side (duppies, jumbees, the Rolling Calf; omens, the sea's dead) | researched (that it existed), the creatures the bestiary's | `../bestiary/BESTIARY.md`; obeah and bokor at the town's edge (bestiary, proposed) |
| Changeable by | an outside cult gaining influence (the Abyssal or Devil Cult, the Holy Order within the Imperial faction) | Rex (2026-10-30) | the engines move it; this file only seeds it |

## 2. Customs, including burial and death

| Custom | Starting value | Label | Note |
|---|---|---|---|
| Burial place | the churchyard for the Anglican dead; a separate ground for Jews; the unclaimed and the enslaved outside the wall | researched (pattern), estimate (the port's layout) | Port Royal's cemetery sank in 1692 and burials moved along the Palisadoes (TWN-PR, standard reference); Jewish ground apart (TWN-JEW); the place is `port.cemetery` (Rex, 2026-10-30; `TOWNS.md`) |
| Rite | Anglican burial service by the priest; a coffin where the family can pay, a shroud where not; the bell | researched (pattern) | standard reference (TWN-LAW); the economy prices coffins and labour (`Toolchain/economy`) |
| Sailors | burial at sea, sewn in a hammock with a shot at the feet, when a death is at sea; ashore, the parish ground | researched (standard reference) | TWN-CODE's period; the rite is the ship's |
| Epidemic | mass graves outside the town in fever years; the dead unburied in the harbour after the 1692 earthquake | researched | TWN-PR |
| African-Caribbean | night burials, grave goods, singing, the wake kept for days (the later "Nine Night") | researched (standard reference; the period form uncertain) | TWN-AFR |
| Pirate | a dead partner's share to his matelot; a crew's dead compensated from the common stock | researched | TWN-MAT, TWN-CODE |
| Alternatives the factions add | consecrated ground (Holy Order), burial at sea (Free Pirates), bodies preserved or transformed (the cults, the Atlanteans, the Ghost Fleet) | Rex (2026-10-30: factions and time anomalies add alternatives); forms the story keeper's | `../combat/COMBAT.md` §4e |
| Mourning and inheritance | a will read; else eldest child, then widow's dower, then escheat (`STARTING_TOWN.md` Q9) | researched | TWN-LAW, TWN-BURN |
| Hospitality and drink | the tavern is the town's parlour: deals, news, hiring, the watch's off hours | researched | Port Royal's taverns, one for every few houses (TWN-PR) |

## 3. The economic and political arrangement (an institutional structure, not the culture)

| Dimension | Starting value | Label | Note |
|---|---|---|---|
| Property | private freehold by patent or deed; the church's, the Crown's and the town's holdings apart | researched | `STARTING_TOWN.md` Q6, §8.2 |
| Economic system | capitalist, mercantile: merchants, shop-houses, wages and shares; a pirate crew is a share partnership at sea | researched | TWN-PR, TWN-CODE |
| Political system | nominally the Crown's (a governor far away, the Imperial faction); in practice the parish vestry, the justices and whoever holds the town hall (`sec.townhall`); the pirates' acclamation when they are many enough | researched (pattern), fiction (the contest) | TWN-NAS, TWN-ROG; `STARTING_TOWN.md` Q11 |
| Labour | free tradesmen and sailors, indentured servants, and the enslaved | researched | TWN-BAR, TWN-DUNN. **(open, Rex: GOODS Open 1)** whether the trade in enslaved people is in the game; this row records the period's fact only |
| Mutual aid | strong among crews (compensation for wounds), weak in the town | researched (crews), estimate (the town) | TWN-CODE |

## 4. The economic situation at the start

| Item | Starting value | Label | Note |
|---|---|---|---|
| State | run down and dying; the town's cash nearly out (`port.cash`); the best mechanic about to leave | Rex (2026-10-27/28) | `TOWNS.md`, `UPGRADES.md` |
| Livelihoods | fencing pirate plunder, the tavern, provisioning ships, salt and turtle, wrecking, a little farming | researched (Nassau's) | TWN-NAS |
| Money | coin scarce; pieces of eight the common unit; barter common | researched (standard reference) | `STARTING_TOWN.md` econ 1 (Rex's) |
| Prices | high for imports, low for the town's own produce | estimate | the entrepôt pattern (TWN-PR) |

## 5. Historical context

| Item | Value | Label |
|---|---|---|
| Model | a Caribbean haven c. 1690–1720: the end of the buccaneers, the War of the Spanish Succession's privateers turned pirates, the Crown's pardon and return | researched (TWN-NAS, TWN-ROG) |
| The port's own past | **(open, Rex)**: why it is dying, who ran it, what burned (`TOWNS.md` open; STORY open thread 8) | fiction |
| Time anomalies | real places and people not literally where or when they were; labelled in the journal, never changing behaviour | Rex (`../science/JOURNAL.md`) |

## 6. Local practices

| Practice | Starting value | Label |
|---|---|---|
| The day | work from first light, the midday heat idle, the tavern after dark; Sunday the market's quiet day | estimate (TWN-PR pattern) |
| Hiring | at the tavern and the docks: a job, a mercenary's fee, or a kidnapping (Rex, `PIRATE.md` §7) | Rex |
| The watch | the fort's one old soldier (`estp-f`) and whoever the town hall pays | Rex (the soldier); fiction (the rest) |
| Food | salt meat, fish, turtle, cassava and plantain; the butcher's trade and the farm's bodies (Rex) | researched (the diet, TWN-DIET standard reference); Rex (the bodies) |
| Justice | the justices and the vestry for small matters; a captured pirate to the governor; a pirate crew's own articles at sea | researched (TWN-LAW, TWN-CODE) |

## Change log

| Date | Change | Mark |
|---|---|---|
| 2026-10-30 | File opened: the six fields Rex named, researched where sources exist, labelled researched / estimate / fiction; `port.cemetery` as the burial place | town keeper; Rex (the file, the cemetery) |
