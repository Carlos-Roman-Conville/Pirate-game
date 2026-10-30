# Bestiary (kept by the bestiary keeper; Rex decides the creatures)

Rex designs the creatures, monsters, enemies and bosses. This folder **records** what he decides, as data the
engine and the journal can read, and holds the enemy-class design for him to approve. Opened 2026-10-29 when Rex
said enemy creation "should be the job of another sub agent".

Every item is marked:

- **(Rex, date)**: his, canon.
- **(proposed)**: the keeper's starting point; not canon until Rex says yes. Research of a real legend is still
  only **proposed** as a game creature: the legend is real, its place in the game is Rex's call.
- **(open)**: nothing decided yet.

**Files.** This file: how entries work, the enemy classes, the boss list, what is Rex / proposed / open.
[`ENTRIES.md`](ENTRIES.md): one row per creature (the data). [`bestiary.json`](bestiary.json): the same rows as
data, built by `build-bestiary.py` from `ENTRIES.md` (edit the table, run the script).

**What lives elsewhere (linked, never copied).** The journal that shows an entry to the player and the provenance
labels: [`../science/JOURNAL.md`](../science/JOURNAL.md). How a fight works, hit locations, detection, death and
transformation: [`../combat/COMBAT.md`](../combat/COMBAT.md). Period fish and game stocks (the real animals of the
economy): [`../world/ECOLOGY.md`](../world/ECOLOGY.md); this file lists an animal only when it fights. The nine
factions: [`../balance/ALIGNMENT.md`](../balance/ALIGNMENT.md) §10. Locales, dungeons and underwater places:
[`../town/TOWNS.md`](../town/TOWNS.md) (the town keeper's; a creature's home is told to the town keeper, not
written there by this keeper). Story use of any creature: [`../story/STORY.md`](../story/STORY.md).

## What Rex has decided (Rex, 2026-10-29)

- **(Rex)** Underwater locations, a few dungeons ("a pirate's cove or some other hiding place of a great boss")
  and minor locales are coming.
- **(Rex)** "Def thinking about adding in a **kraken boss** and other."
- **(Rex)** "We want to incorporate **all of the Caribbean legends and myths** so it'll feel like an authentic
  pirate game. It's not meant to be hyper realistic."
- **(Rex)** A **journal** details every item and creature and tags each as from the era or not: a T. rex says
  which period it is from; the same for mythical, original, sci-fi and fantasy creations. The journal and its
  labels are the body-and-world keeper's (`../science/JOURNAL.md`); this folder supplies the creature rows.
- **(Rex)** Enemy class and creature creation are this keeper's job.
- **(Rex)** Some procedural generation fills gaps; **most is authored**.
- **(Rex, per COMBAT.md)** Turn-based tactical, grid, one map, deadly, Monster Hunter-style preparation (ammo and
  powder kinds matter); provenance tags never change a rule; a dead crew mate can return as a mecha, ghost,
  zombie, angel, demon or fish person depending on faction and killer.

## 1. How an entry works

An entry is one row of `ENTRIES.md` (and one object in `bestiary.json`). Its fields:

| Field | Holds | Mark |
|---|---|---|
| id | stable kebab-case id (`kraken`, `soucouyant`); never renamed once referenced | proposed |
| name | display name; a legend keeps its own name and spelling | proposed |
| class | a body plan and a role from §2 (`plan/role`); the class carries the combat shape | proposed |
| provenance | one or more of the journal's eight labels, exactly as JOURNAL.md §1 spells them | Rex (the labels) |
| period / tradition | the specific thing the label points at: *Late Cretaceous*, *Taíno*, *Haitian Vodou*, *Greek*, *Norse*, *Barrie 1904*, *this world's own* | Rex (asked for it: "Triassic or Jurassic or wherever it's from") |
| home | region or locale kind where it lives (sea lane, reef, blue hole, mangrove, forest, a town at night, a dungeon); a town locale is told to the town keeper | proposed |
| faction | one of the nine faction ids, or `-` | proposed |
| role | fodder / elite / boss / met (a journal creature you meet, bargain with or flee, but need not fight) | proposed |
| status | **Rex** / **proposed** / **open** | - |
| source | the tradition and where it is recorded (a period author where one exists); the folklore counter that becomes a preparation hook | proposed |

**Labels follow the journal (Rex).** The eight labels are Historical, Time Anomaly, Prehistoric, Mythological,
Fantasy, Science Fiction, Original Fiction, Unknown. This keeper adds none. Rules of thumb used in the rows, all
**(proposed)** until Rex says otherwise:

- A real animal of the period and place is **Historical** (a crocodile, a bull shark). It only gets a row here if
  it fights; its stock is ECOLOGY's.
- A real animal from another age is **Prehistoric** with its period named, and **Time Anomaly** stacked because it
  is a real thing out of its time (the journal's own stacking rule). Periods are the geological ones: a
  *Tyrannosaurus* is **Late Cretaceous**, not Jurassic; the row says so, because the journal is the educational
  side.
- A creature from a real people's folklore or religion is **Mythological** with the tradition named (Taíno,
  Kalinago, Haitian Vodou, Afro-Cuban Santería, Jamaican, Trinidadian, Guyanese, Bahamian, Spanish, English sailor
  lore, Greek, Norse, Hebrew). Vodou and Santería are living religions: their lwa and orisha are listed as
  **beings the player may meet**, never as fodder, and the row says so. (open) Rex to confirm that line.
- Folklore first recorded after the period (the chupacabra, 1995) keeps **Mythological** and states the date in
  its reason; whether it also stacks **Time Anomaly** is **(open)**, since the journal reserves that label for
  real things.
- A character from a dated work of fiction (Peter Pan, Barrie 1904; the Deep Ones, Lovecraft 1931) is
  **Fantasy** with author and year named, so the journal can say "no record; a story from 1904".
- The factions' own creations (the Machina, the Ghost Fleet's green spectres) are **Science Fiction** or
  **Original Fiction** as the journal already says.

**Journal shape.** The journal's own fields (discovery state, observed vs reference properties, the five dates)
belong to `JOURNAL.md`; this folder supplies `kind = creature`, the classification with its reason, natural
occurrence (home) and the reference blurb per row. The player's sketch at *encountered* and the full page at
*identified* are the journal's rules, not this file's.

## 2. Enemy classes (proposed; Rex approves before anything is built)

A class is what the combat engine needs to run a creature; the entry is what the journal needs to show it. The
class carries the **body plan** (which hit locations exist and what each dips, because COMBAT.md §4 makes every
fight regional), the **movement**, the **detection profile** (§6: who sees whom), and the **preparation hooks**
(Monster Hunter: what you should have brought). Provenance is never read by a class (Rex: tags never change a
rule). The split lets a kraken and a Taíno sea spirit share one class if they fight the same way.

### 2a. Body plans (the hit-location set)

| Plan | Hit locations | What a wound there does | Examples |
|---|---|---|---|
| humanoid | head, torso, L/R arm, L/R leg (COMBAT.md §4a, unchanged) | as the crew's own | pirates, marines, cultists, zombies, fish people, Lost Boys |
| quadruped | head, body, four legs | a leg: speed; head: senses; body: endurance drain | crocodile, Rolling Calf, Three-foot Horse (three legs by nature), boar |
| serpent | head, three body segments | head: bite; a segment: constriction grip | Madre de Aguas, Titanoboa, sea serpent |
| cephalopod | mantle (head), beak, 8 arms (each arm a location, severable) | an arm severed: one fewer grab a turn; the beak: its bite; the mantle: the kill | kraken, Lusca |
| flyer | head, body, two wings | a wing: grounded (falls to quadruped or humanoid plan) | Chickcharney, the Cuban giant owl, a vampire bat elite |
| swarm | the swarm itself, by count | no regions: each hit kills members; disperses under area attacks | bats, land crabs, douens as a crowd |
| spectral | a focus and a form; immune to regions | only the focus counts; found by Intuition and Hearing (§6a), not Eyesight | duppy, jumbee, Ghost Fleet spectres, the Soucouyant as a fireball |
| construct | core, frame, limbs; parts replace, never heal | a limb: as humanoid; the core: the kill; no bleeding, no fatigue | Atlantean Machina, a mecha crew mate |
| colossal | an arena of locations (a tentacle is a map tile; a head is a zone) | each location a sub-fight; the boss acts from several at once | the kraken boss, Leviathan, a hurricane's heralds |
| aquatic (a modifier on any plan) | as its plan, plus a depth rule: fights from under the water-surface tiles, surfaces to strike | can only be hit when surfaced or by a diver; harpoon and net are the tools | sharks, Lusca, merfolk under water, Mama Dlo |

### 2b. Behaviour roles (what the AI does with the plan)

| Role | Behaviour | Counter the player prepares |
|---|---|---|
| bruiser | closes and hits the nearest; high Strength per limb, low Reflexes | leg shots to stall the charge; pikes |
| skirmisher | hit and move; never ends a turn adjacent | caltrops, a net, called shots to legs |
| shooter | holds range; muskets, thrown spears, spit, ink | smoke, cover, closing fast |
| ambusher | starts hidden (§6: a fight against two becomes six); strikes from stealth | Perception and Intuition in the party; a lantern, a dog |
| controller | grabs, drags, constricts, pulls under water, charms | a blade for the grip; wax in the ears for a siren; a buddy rule |
| ritualist | buffs and summons; a cult's priest, a bokor raising zombies | kill it first; silence; holy water for some, salt for others |
| support | heals or shields others; carries the group's morale | the same |
| hunter | tracks the party over days (the world map, not the fight): a kanaima, a hungry shark | leaving no trail; an offering; a decoy |
| siege | breaks terrain and ships; a kraken's arm crushes the deck | the ship's guns before it reaches the rail |
| boss | several roles across phases; a lair; a preparation list on the notice board | the whole Monster Hunter loop |

### 2c. Preparation hooks (the Monster Hunter layer; the goods are the economy's)

Each class row lists what the entry is **weak to**, **immune to** and **lured or repelled by**, as references to
goods in `../economy/GOODS.md` (powder kinds and ammunition are COMBAT.md's open item 10). Folklore gives most of
the hooks for free and they are the authentic part Rex asked for: salt, and a pile of rice she must count grain by
grain before dawn, against a soucouyant or ol' higue; a shoe turned sole-up, or a bitten tongue, against a douen;
iron and a Bible against a duppy; whistling at night draws a rolling calf; cold iron and a crossroads for the
jumbee; a rum offering to Papa Bois before hunting; a comb left at the river for River Mumma. These are written in
each row's **source** note and move into class data when Rex approves the entry.

### 2d. What is data and what is code

- A class is a JSON object (body plan, role, movement, detection profile, hooks). An entry references a class.
- The engine runs classes; the journal shows entries. A new creature is one row, not code (the memory rule:
  cards and creatures are data).
- Procedural generation (Rex: fills gaps) is **(proposed)** as: a minor locale's encounter table picks entries by
  home and role; a dungeon's layout may be generated; **no creature is generated**, every one is an authored row.

## 3. Bosses

| Id | Boss | Where | Phases (proposed) | Mark |
|---|---|---|---|---|
| `kraken` | The Kraken | its lair is a dungeon (TOWNS.md locale inventory: underwater or a sea lane) | 1: arms over the rail (siege, colossal); 2: the ship held, the fight on the deck and in the water (aquatic); 3: the mantle surfaces (the kill) | **Rex** (a kraken boss, "def thinking about", 2026-10-29); phases proposed |
| `lusca` | The Lusca | a Bahamian blue hole | the guardian of a flooded cave: half shark, half octopus; the blue hole breathes with the tide and the fight changes with it | proposed |
| `madre-de-aguas` | Madre de Aguas | a Cuban river mouth | a serpent that guards the water a settlement drinks; killing it dries the river (a balance question for the balance keeper) | proposed |
| `mama-dlo` | Mama D'Leau | a Trinidadian river pool | a controller boss who can be appeased: a boss you need not kill | proposed |
| `guabancex` | Guabancex, the hurricane | the open sea in hurricane season | a world event wearing a boss's face: her heralds Guataubá (thunder) and Coatrisquie (flood) are the fightable units; she herself is never killed | proposed |
| `leviathan` | Leviathan | the deep | a late sea titan of Hebrew tradition, if Rex wants a second | proposed |
| `flying-dutchman` | The Flying Dutchman | a storm lane | the Ghost Fleet's flagship or its rival; a ship-scale fight | proposed |
| `deep-one-priest` | The Abyssal Cult's high priest | the cult's drowned temple | humanoid ritualist boss with fish-people summons; the cult's Act II antagonist form | proposed |
| `hook-captain` | A hook-handed captain | Neverland's cove | the Lost Boys' antagonist if Rex wants Barrie's cast; the crocodile fights beside him | proposed |
| `blackbeard-ghost` | Blackbeard's ghost | Ocracoke, or wherever his light is seen | a named pirate's ghost (Johnson 1724: the headless body swam round the ship) | proposed |

(open, Rex's) Which of these exist; which great boss hides in each dungeon; the kraken's lair.

## 4. Faction rosters (proposed): who you fight for each of the nine

| Faction (`id`) | Fodder | Elite | Boss-tier | Provenance |
|---|---|---|---|---|
| Atlantean Machina (`atlantean`) | sentinel drones | Machina knights | a mecha warden | Science Fiction (the Machina); Mythological, Greek (Atlantis, Plato) |
| Merfolk (`merfolk`) | tritons | sirens (controller) | La Sirène's champion | Mythological, Greek (Triton, Siren); Haitian Vodou (La Sirène); Trinidadian (Mama Dlo) |
| Lost Boys (`lost-boys`) | lost boys (skirmishers) | the crocodile | a hook-handed captain | Fantasy (Barrie 1904); the novel's "redskins" are not used as written (open) |
| Imperial Crown + Church (`imperial`) | marines, militia | inquisitors, grenadiers | an admiral; an archbishop | Historical |
| Ghost Fleet (`ghost-fleet`) | drowned sailors (spectral) | duppies, jumbees | the Flying Dutchman | Original Fiction (the fleet); Mythological, Jamaican and Eastern Caribbean (duppy, jumbee); Dutch and English sailor lore |
| Free Pirates (`free-pirates`) | boarders | gunners; a bokor's zombies when allied | a pirate captain | Historical; Mythological, Haitian Vodou (the zombi) |
| Abyssal Cult (`abyssal-cult`) | cultists | fish people; a shapeless servitor | the high priest; the sleeping thing under the sea | Fantasy (Lovecraft 1928–31); Original Fiction (the cult) |
| Devil Cult (`devil-cult`) | cultists | demons; a soucouyant or lagahoo in its service | a devil's lieutenant | Fantasy (the demon forms, per JOURNAL.md); Mythological, Trinidadian (soucouyant, lagahoo) |
| Criminal Pirates (`criminal-pirates`) | thugs, cutthroats | the Heartman; a baccoo-keeper | a gang boss | Historical; Mythological, Barbadian (Heartman), Guyanese (baccoo) |

(open, Rex's) Whether factions field creatures at all or only people; which legends each faction owns.

## 5. Open for Rex

1. The kraken: its lair (underwater dungeon or sea lane), its phases, what it drops.
2. Which legends in `ENTRIES.md` are in; which are out. Everything there is a candidate.
3. Whether lwa and orisha (Vodou, Santería) appear at all, and if so only as beings met, never fought (the
   keeper's line).
4. Whether folklore dated after the period (chupacabra 1995) stacks Time Anomaly.
5. The enemy classes (§2): keep, change or throw out; especially the colossal plan for bosses and the spectral
   plan's "only the focus counts" rule.
6. Whether factions field creatures or only people (§4).
7. The game's year, so the journal's "found here in <game year>" can be filled for every anomaly row.

## 6. Sources used for the candidate list

The legends are common knowledge of their traditions; where a period author recorded one it is named in the row.
Keys the rows cite (research notes from the keeper's own knowledge; nothing downloaded; a belt task can verify
each against the named text before any row is stamped):

| Key | What | Gives |
|---|---|---|
| PANE | Fray Ramón Pané, *Relación acerca de las antigüedades de los indios* (c. 1498) | Taíno beliefs: Yúcahu, Atabey, the opía (spirits of the dead), Coaybay, Maquetaurie Guayaba, the twins |
| COLUMBUS | Columbus's journal, 9 January 1493 | three "mermaids" seen off Hispaniola, "not as beautiful as painted" (manatees) |
| ROCHEFORT | Charles de Rochefort, *Histoire naturelle et morale des îles Antilles* (1658); Raymond Breton's Carib dictionary (1665) | Kalinago (Carib) beliefs: Maboya, the chemeen spirits |
| LABAT | Jean-Baptiste Labat, *Nouveau voyage aux isles de l'Amérique* (1722) | French Antilles life, sharks and the fer-de-lance |
| SLOANE | Hans Sloane, *A Voyage to Jamaica* (1707); Edward Long, *History of Jamaica* (1774) | Jamaican duppy belief, obeah |
| MOREAU | Moreau de Saint-Méry, *Description de la partie française de Saint-Domingue* (1797) | the first written account of Vodou dance and the loup-garou in Saint-Domingue |
| DEFOE | Daniel Defoe, *The Four Years Voyages of Capt. George Roberts* (1726); Smollett (1751) | first print of Davy Jones |
| MAGNUS | Olaus Magnus, *Carta Marina* (1539) and *Historia* (1555); Pontoppidan (1752) | the sea serpent, the sea monk; the kraken's first full description |
| GOS | Captain Charles Johnson, *A General History of the Pyrates* (1724) | Blackbeard's death (the headless body said to have swum round the ship) |
| BARRIE | J. M. Barrie, *Peter Pan* (1904 play; 1911 novel) | the Lost Boys, the crocodile, the mermaids' lagoon |
| HPL | H. P. Lovecraft, "The Call of Cthulhu" (1928), "The Shadow over Innsmouth" (1931) | the Deep Ones and the sleeping god the Abyssal Cult echoes |
| FOLK | Modern collections of Caribbean folklore (Trinidad and Tobago National Library folklore pages; Jamaican, Guyanese, Bahamian, Dominican and Cuban folklore collections) | soucouyant, La Diablesse, douen, lagahoo, Papa Bois, Mama Dlo, rolling calf, ol' higue, River Mumma, three-foot horse, heartman, steel donkey, baccoo, massacooramaan, chickcharney, lusca, ciguapa, güije |

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | Folder opened on Rex's say; entry fields; enemy classes (10 body plans, 10 roles, hooks) proposed; boss list with the kraken as Rex's; faction rosters proposed; the candidate rows in ENTRIES.md, all proposed | keeper |
