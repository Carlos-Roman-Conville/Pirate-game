# Bestiary entries (the data; one row per creature)

Rules and field meanings: [`BESTIARY.md`](BESTIARY.md) §1. Labels are the journal's eight
([`../science/JOURNAL.md`](../science/JOURNAL.md) §1). **class** is `plan/role` from BESTIARY.md §2 (aquatic is a
modifier: `plan+aquatic/role`). **role** is fodder / elite / boss / met. **status** is Rex / proposed / open.
Every row below is **proposed** except where the status column says **Rex**: these are candidates for Rex to keep,
change or throw out. Nothing here is canon. `bestiary.json` is built from this table by `build-bestiary.py`.

Period animals that only feed the economy are in [`../world/ECOLOGY.md`](../world/ECOLOGY.md) and are not
repeated; an animal appears here only when it can fight.

## A. Rex's named items

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| kraken | The Kraken | colossal, cephalopod+aquatic/boss | Mythological | Norse and Scandinavian sailor lore; first full description Pontoppidan 1752, older tales behind it; the real animal behind it is the giant squid (*Architeuthis*) | its lair: an underwater dungeon or a sea lane (open) | - | boss | **Rex** (the boss, 2026-10-29); everything else proposed | MAGNUS. Hooks (proposed): harpoons and the ship's guns for the arms; a severed arm regrows between phases; whale oil or a bait cask lures it to one side of the ship |

## B. Taíno (Greater Antilles: Hispaniola, Cuba, Puerto Rico, Jamaica, Bahamas)

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| opia | Opía (hupia), spirit of the dead | spectral/ambusher | Mythological | Taíno (Pané c. 1498): the dead leave Coaybay at night to eat guava and lie with the living; told from the living by having no navel | guava groves and old cemetery grounds at night; bats are their form | ghost-fleet (if any) | fodder | proposed | PANE. Hook: check the navel (a Perception test) before trusting a stranger at night; bats in the trees are the tell |
| maquetaurie-guayaba | Maquetaurie Guayaba, lord of Coaybay | spectral/boss | Mythological | Taíno (Pané): lord of the house of the dead | Coaybay, a dungeon under an island (a cave) | ghost-fleet (if any) | boss or met | proposed | PANE. A ruler of the dead who may be bargained with, like Baron Samedi |
| guabancex | Guabancex, lady of the hurricane | colossal/boss (never killed) | Mythological | Taíno: the goddess of the storm; the word *huracán* comes from this tradition | the open sea in hurricane season (ECOLOGY §5: August to October) | - | boss (event) | proposed | PANE; Taíno zemí studies. Fought through her heralds; appeased with offerings (open) |
| guataba | Guataubá, herald of thunder | flyer/shooter | Mythological | Taíno: Guabancex's herald who announces the storm | the storm front | - | elite | proposed | PANE |
| coatrisquie | Coatrisquie, herald of the flood | serpent+aquatic/controller | Mythological | Taíno: Guabancex's herald who releases the waters | flooded river mouths after a storm | - | elite | proposed | PANE |
| yucahu | Yúcahu, lord of cassava and the sea | - | Mythological | Taíno: the supreme zemí, son of Atabey | a zemí stone in a cave shrine | - | met | proposed | PANE. Not an enemy: a shrine that grants or withholds |
| atabey | Atabey, mother of waters | - | Mythological | Taíno: goddess of fresh water, fertility and the moon | springs and rivers | - | met | proposed | PANE |
| boinayel-marohu | Boinayel and Márohu, the rain twins | spectral/support | Mythological | Taíno: the twins who bring and withhold rain | cave shrines | - | met | proposed | PANE |
| zemi-guardian | A zemí guardian | construct/bruiser | Mythological; Original Fiction (that it animates) | Taíno zemí figures (real objects); their waking is this world's own | Taíno cave dungeons | - | elite | proposed | PANE (the objects). Our invention that they move: marked as two labels |
| ciguapa | Ciguapa | humanoid/ambusher | Mythological | Dominican folklore (Hispaniola), first written 1866; a wild woman with backward feet and hair to the ground who lures men | mountain forest; river banks at night | - | elite | proposed | FOLK. Her tracks lead the wrong way (a tracking puzzle); caught only on a full-moon night with a black-and-white dog (folk rule) |
| biembien | Biembienes | humanoid/skirmisher (swarm when many) | Mythological | Dominican folklore: small wild forest people of the Bahoruco, descendants of maroons in the tale | mountain caves | - | fodder | proposed | FOLK. Open: whether this one is used at all, since the legend is tied to maroon history |
| galipote | Galipote | humanoid/ambusher (shapeshifts to quadruped) | Mythological | Dominican folklore: a sorcerer who turns into an animal; immune to blades, hurt by prayer or a blessed weapon | roads at night | devil-cult (if any) | elite | proposed | FOLK |
| baca | Bacá | quadruped/hunter | Mythological | Dominican and Haitian folklore: a familiar demon bought from a sorcerer to guard property, paid in the owner's kin | a rich man's land | criminal-pirates or devil-cult | elite | proposed | FOLK. A story hook: the bigwig's warehouse (town keeper's; not placed here) |
| guije | Güije (jigüe) | humanoid+aquatic/ambusher | Mythological | Cuban folklore: a small black river imp with long hair that drags bathers under | Cuban river pools | - | fodder | proposed | FOLK |
| madre-de-aguas | Madre de Aguas | serpent+aquatic/boss | Mythological | Cuban folklore: a giant water serpent, thick as a palm, that guards a river or spring | a Cuban river mouth; a settlement's water | - | boss | proposed | FOLK. Killing it dries the water (balance question) |
| chupacabra | Chupacabra | quadruped/hunter | Mythological (open: Time Anomaly) | Puerto Rican folklore first reported 1995; a goat-sucker | goat pens on dry islands at night | - | elite | proposed | FOLK. Out-of-period folklore: BESTIARY.md open item 4 |
| garadiablo | Garadiablo | humanoid+aquatic/bruiser | Mythological | Puerto Rican folklore: a swamp monster of Punta Santiago | mangrove swamps | - | elite | proposed | FOLK |

## C. Kalinago (Carib) and the mainland Caribs (Lesser Antilles, Guianas)

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| maboya | Maboya (Mabouya) | spectral/controller | Mythological | Kalinago belief (Rochefort 1658, Breton 1665): the evil spirit who sends sickness, storms and eclipses; appeased, not worshipped | the windward islands; sickrooms | - | elite | proposed | ROCHEFORT. Hook: the bohique (shaman) or an offering; the sick crew mate's fever is its face |
| kanaima | Kanaima | humanoid/hunter | Mythological | Carib and Pemon peoples of the Guianas: a ritual killer who stalks a victim for days and must taste the corpse | the Guiana coast and rivers; follows the party over the world map | criminal-pirates (if any) | elite | proposed | FOLK (ethnographies of the Guianas). The hunter role's exemplar |
| water-mama | Water Mama (Watramama) | humanoid+aquatic/controller | Mythological | Guyanese and Surinamese folklore (Arawak and African roots): a river mermaid with a golden comb who drowns the greedy | Guiana rivers | merfolk (if any) | elite | proposed | FOLK. Shares the comb motif with River Mumma and Mama Dlo |
| massacooramaan | Massacooramaan | humanoid+aquatic/bruiser | Mythological | Guyanese folklore: a huge hairy man-beast that upsets boats on the rivers and eats the crew | Guiana interior rivers | - | elite | proposed | FOLK |
| baccoo | Baccoo | spectral/ritualist (bottled) | Mythological | Guyanese folklore: a short imp kept in a bottle, fed bananas and milk, that throws stones and grants wealth | a merchant's house | criminal-pirates | elite | proposed | FOLK. A thing you steal or free rather than kill |

## D. Afro-Caribbean: Haitian Vodou, Afro-Cuban Santería and Palo, Jamaican obeah

Lwa and orisha are the beings of living religions. Listed as **met** (never fodder) by the keeper's line;
BESTIARY.md open item 3 asks Rex to confirm.

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| zombi | Zombi | humanoid/bruiser | Mythological | Haitian Vodou folk belief: the dead raised and bound to work by a bokor; salt frees them. Written accounts from Moreau de Saint-Méry 1797 onward | a bokor's plantation; raised in a fight | free-pirates (Rex: the free pirates give voodoo zombies, COMBAT §4e) | fodder | proposed (the enemy); **Rex** (the zombie as a crew mate's resurrection form) | MOREAU. Hook: salt on the tongue ends the binding (a non-lethal win) |
| bokor | Bokor | humanoid/ritualist | Mythological | Haitian Vodou: a sorcerer who serves the lwa "with both hands" | a hounfour at the edge of a town | free-pirates or criminal-pirates | elite | proposed | MOREAU |
| loup-garou-haitian | Lougawou | humanoid/ambusher (flyer by night) | Mythological | Haitian folklore: a shapeshifting witch who flies as a fireball and drinks children's blood (Moreau 1797 records loup-garou belief in Saint-Domingue) | villages at night | devil-cult (if any) | elite | proposed | MOREAU. Cousin of the soucouyant |
| baron-samedi | Baron Samedi | - | Mythological | Haitian Vodou: lwa of the dead and the cemetery; top hat, rum, obscenity | the crossroads of the dead; the cemetery gate | ghost-fleet (if any; open) | met | proposed | Vodou tradition. A bargain, never a fight; a plausible gate for the ghost resurrection (story keeper's) |
| maman-brigitte | Maman Brigitte | - | Mythological | Haitian Vodou: Baron Samedi's consort, guardian of the first grave | the first grave of any cemetery | ghost-fleet (if any) | met | proposed | Vodou tradition |
| papa-legba | Papa Legba | - | Mythological | Haitian Vodou: the gatekeeper lwa; opens the way | every crossroads | - | met | proposed | Vodou tradition. The journal's "ask before you pass" being |
| agwe | Agwé | - | Mythological | Haitian Vodou: lwa of the sea and of sailors; offerings floated on a raft | the open sea | merfolk (if any) | met | proposed | Vodou tradition |
| la-sirene | La Sirène | humanoid+aquatic/controller (as a champion) | Mythological | Haitian Vodou: the mermaid lwa, Agwé's consort, a trumpet and a mirror | the sea; a siren's rock | merfolk | met (boss-tier champion open) | proposed | Vodou tradition. The Merfolk faction's natural figurehead |
| simbi | Simbi | serpent+aquatic/support | Mythological | Haitian Vodou: water-serpent lwa of springs and rain | springs | - | met | proposed | Vodou tradition |
| damballa | Damballa | - | Mythological | Haitian Vodou: the great serpent lwa, the sky father | temples | - | met | proposed | Vodou tradition |
| marinette | Marinette | spectral/ritualist | Mythological | Haitian Vodou: a fierce Petwo lwa; folk tie her to the loup-garou | the night fire | devil-cult (open) | met | proposed | Vodou tradition. Open: whether any Petwo lwa may be an antagonist |
| yemaya | Yemayá | - | Mythological | Afro-Cuban Santería (Yoruba root: Yemoja): mother of the sea | the shoreline | merfolk (if any) | met | proposed | Santería tradition |
| olokun | Olokun | - | Mythological | Yoruba and Afro-Cuban tradition: ruler of the deep ocean, chained at the bottom | the deep | abyssal-cult (open: a sleeping deep power the cult misreads) | met | proposed | Yoruba tradition. Open: whether to let the Abyssal Cult's "ancient oceanic force" echo a real deity at all; the keeper advises against conflating them |
| nganga-spirit | A nganga's spirit | spectral/ritualist | Mythological | Afro-Cuban Palo Monte: the spirit bound in a palero's cauldron | a palero's house | criminal-pirates (if any) | elite | proposed | Palo tradition |
| duppy | Duppy | spectral/ambusher | Mythological | Jamaican folklore (Sloane 1707 and Long 1774 record the belief): the shadow of the dead that rises nine nights after death | cottonwood trees, graveyards, the town at night | ghost-fleet | fodder | proposed | SLOANE. Hooks: a Bible, iron, salt; it counts things; call its name backwards |
| rolling-calf | Rolling Calf | quadruped/bruiser | Mythological | Jamaican folklore: a bull-calf duppy with fire eyes dragging a clanking chain; the ghost of a butcher or a wicked man | country roads at night | ghost-fleet | elite | proposed | FOLK. Hooks: whistling draws it; a tarred whip or a left-handed knife; a crossroads stops it. (Town note: a butcher's ghost fits the butcher-shop locale; told to the town keeper, not placed here) |
| ol-higue | Ol' Higue | spectral/ambusher (humanoid by day) | Mythological | Jamaican and Guyanese folklore: an old woman who sheds her skin, flies as a fireball and sucks blood | a hut at the edge of town | devil-cult (if any) | elite | proposed | FOLK. Hooks: salt the shed skin; spill rice she must count |
| river-mumma | River Mumma | humanoid+aquatic/controller | Mythological | Jamaican folklore: the river mother with a golden comb; the fish are her children; never fish her pool | river sources | merfolk (if any) | met or boss | proposed | FOLK. Hook: taking the comb curses; returning it blesses |
| three-foot-horse | Three-foot Horse | quadruped (three legs)/hunter | Mythological | Jamaican folklore: a three-legged duppy horse that runs down travellers but cannot enter shade | moonlit roads | ghost-fleet | elite | proposed | FOLK. Hook: stand in a tree's shadow |
| whooping-boy | Whooping Boy | spectral/skirmisher | Mythological | Jamaican folklore: a whooping ghost boy who rides the three-foot horse | moonlit roads | ghost-fleet | fodder | proposed | FOLK |
| obeah-man | Obeah practitioner | humanoid/ritualist | Historical; Mythological (the powers) | Jamaican obeah, recorded by Sloane 1707 and prosecuted from 1760; a real practice, its spells folklore | a town's edge | - | elite | proposed | SLOANE. The person is historical, the effects folklore: two labels |

## E. Eastern Caribbean folklore (Trinidad and Tobago, Barbados, the Windwards, the Bahamas)

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| soucouyant | Soucouyant | spectral/ambusher (fireball; humanoid by day) | Mythological | Trinidadian and Eastern Caribbean folklore (French Antillean roots: *soukougnan*): an old woman who sheds her skin at night and flies as a ball of fire to drink blood | a hut; the night sky over a town | devil-cult (open) | elite | proposed | FOLK. Hooks: salt or hot pepper in the skin; rice at the crossroads she must count till dawn; she is killed by the sun if kept from her skin |
| la-diablesse | La Diablesse | humanoid/controller | Mythological | Trinidadian and St Lucian folklore: a beautiful woman in a wide hat with one cow's hoof who leads men off cliffs | forest paths and fêtes at night | devil-cult (open) | elite | proposed | FOLK. Hooks: turn your clothes inside out; look for the hoof (Perception) |
| douen | Douen | swarm/ambusher (humanoid singly) | Mythological | Trinidadian folklore: the spirits of unbaptised children, faceless under straw hats, feet turned backwards; they call children into the forest by name | forest edges | - | fodder | proposed | FOLK. Hooks: never answer your name called from the forest; a shoe sole-up |
| lagahoo | Lagahoo (Ligahoo) | humanoid/bruiser (shapeshifts) | Mythological | Trinidadian folklore (French *loup-garou*): a shapeshifter dragging a coffin and chains at midnight | crossroads at midnight | devil-cult (open) | elite | proposed | FOLK. Hook: beaten with a blessed stick nine days running (a questline, not a fight) |
| papa-bois | Papa Bois | humanoid (cloven feet)/support | Mythological | Trinidadian folklore: the father of the forest, protector of its animals; punishes the greedy hunter | deep forest | - | met | proposed | FOLK. Hook: a rum offering; he may turn a hunter into a beast (a transformation hook for COMBAT §4e, story keeper's) |
| mama-dlo | Mama D'Leau (Mama Dlo) | serpent+aquatic/boss (humanoid above the waist) | Mythological | Trinidadian folklore: mother of the water, a woman with an anaconda's body; Papa Bois's companion; punishes polluters | river pools and mangrove | merfolk (if any) | boss | proposed | FOLK. Hook: take off a shoe, turn it over and walk away backwards |
| moko-jumbie | Moko Jumbie | humanoid (tall)/support | Mythological | Trinidadian and West African tradition: the stilt-walking spirit guardian who sees evil coming | carnival streets; a town's gate | - | met | proposed | FOLK. A protector, not an enemy; could guard a town against duppies |
| jumbee | Jumbee | spectral/ambusher | Mythological | Eastern Caribbean umbrella word for a malevolent spirit of the dead (Barbados, Guyana, the Virgin Islands, Antigua) | silk-cotton trees, the beach at night | ghost-fleet | fodder | proposed | FOLK. Hooks: a pile of sand or rice to count; cross a stream; shoes at the door |
| heartman | Heartman | humanoid/hunter | Mythological | Barbadian folklore: a man who cuts out children's hearts for the devil | Bridgetown's back streets at night | criminal-pirates or devil-cult | elite | proposed | FOLK |
| steel-donkey | Steel Donkey | quadruped/bruiser | Mythological | Barbadian folklore: a clanking iron-shod spectral donkey that rides the roads at night | Barbados cane roads | ghost-fleet | elite | proposed | FOLK |
| chickcharney | Chickcharney | flyer/skirmisher | Mythological | Bahamian folklore (Andros): a three-toed owl-like creature with red eyes that nests by tying pine tops together; curses those who mock it, blesses the kind. Its real root may be the extinct giant barn owl *Tyto pollens* | Andros pine forest | - | elite or met | proposed | FOLK. Pairs with the Prehistoric owl below for the journal's educational side |
| lusca | Lusca | cephalopod+aquatic/boss (shark's head) | Mythological | Bahamian folklore: the half-shark half-octopus of the blue holes whose breathing is the tide | Andros blue holes | abyssal-cult (open) | boss | proposed | FOLK. The blue hole breathes: the fight's water level changes on a timer |
| bermuda-devils | The devils of Bermuda | swarm/ambusher | Historical; Mythological | Spanish sailors called Bermuda the Isle of Devils for the night shrieks: the cahow (Bermuda petrel) and feral hogs, recorded by the Sea Venture survivors 1609 | Bermuda's reefs at night | - | fodder (and a journal reveal) | proposed | Strachey 1610. A journal reveal: the "devils" identify as birds (Historical) |

## F. European sailor lore and classical myth

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| davy-jones | Davy Jones | spectral/boss or met | Mythological | English sailor lore; first in print Defoe 1726 (Smollett 1751 gives the saucer eyes and three rows of teeth); Davy Jones's Locker is the sea bottom | the sea floor; appears in a storm | ghost-fleet | met or boss | proposed | DEFOE |
| flying-dutchman | The Flying Dutchman | colossal (ship)/boss | Mythological | Dutch and English sailor lore, written from 1790 (Barrington) with older tellings; a ghost ship that can never make port | storm lanes off the capes | ghost-fleet | boss | proposed | sailor lore. The Ghost Fleet's flagship or rival (open) |
| drowned-sailor | Drowned sailor | spectral/fodder (bruiser) | Original Fiction; Mythological (the drowned who walk) | sailor lore of the drowned who return; the Ghost Fleet's green spectres are this world's own (ALIGNMENT §10) | the Ghost Fleet's ships; wrecks | ghost-fleet | fodder | proposed | sailor lore; the fleet is Rex's faction, its soldiers proposed |
| mother-careys-chickens | Mother Carey's chickens | swarm (flyer)/support | Historical; Mythological (the omen) | storm petrels, which sailors held to be the souls of drowned sailors and heralds of storms; "Mother Carey" is *Mater Cara* | the open sea before a storm | - | met | proposed | sailor lore. A journal entry that is a real bird with a folk meaning |
| st-elmos-fire | St Elmo's fire | - | Historical | the corona discharge on masts in a storm, taken by sailors as a saint's protection | the masthead in a storm | - | met | proposed | sailor lore. A phenomenon entry (JOURNAL kind: phenomenon), not a creature; listed so the journal has it |
| sea-serpent | Sea serpent | serpent+aquatic/controller | Mythological | Scandinavian sailor lore and natural history: Olaus Magnus 1555; Hans Egede's 1734 sighting off Greenland | cold lanes; the Sargasso edge | - | elite | proposed | MAGNUS |
| sea-monk | Sea monk | humanoid+aquatic/ambusher | Mythological | Renaissance natural history: a fish shaped like a monk caught off Denmark 1546 (Rondelet, Belon); likely a squid or angelshark | deep banks | abyssal-cult (open) | fodder | proposed | MAGNUS. Candidate "fish person" with a period pedigree |
| mermaid-columbus | Columbus's mermaids | humanoid+aquatic/met | Historical; Mythological | Columbus's journal, 9 January 1493: three mermaids off Hispaniola, "not as beautiful as painted"; they were manatees | the Mosquito Coast lagoons | merfolk | met | proposed | COLUMBUS. The journal's model entry: encountered as a mermaid, identified as a manatee |
| siren | Siren | humanoid+aquatic/controller | Mythological | Greek: the singers whose song wrecks ships (Homer, *Odyssey* XII); bird-women in the old telling, fish-tailed later | a siren's rock in a strait | merfolk | elite | proposed | Greek tradition. Hook: wax in the ears (Hearing Fe drops to zero, so does the charm); a crew mate lashed to the mast |
| triton | Triton | humanoid+aquatic/bruiser | Mythological | Greek: Poseidon's son, the conch-blowing merman; the "tritons" are his kind | merfolk shoals | merfolk | fodder | proposed | Greek tradition. Rex's sub-label for the faction: "Tritons / Sirens" |
| scylla | Scylla | colossal/boss | Mythological | Greek: the six-headed monster of the strait (*Odyssey* XII) | a strait dungeon | - | boss | proposed | Greek tradition |
| charybdis | Charybdis | - | Mythological | Greek: the whirlpool that swallows the sea thrice a day | the same strait | - | met (a hazard) | proposed | Greek tradition. An environment hazard, not a unit |
| hippocampus | Hippocampus | quadruped+aquatic/skirmisher | Mythological | Greek: the fish-tailed horse of Poseidon's chariot | merfolk waters | merfolk | fodder (a mount) | proposed | Greek tradition |
| atlantean-ruin-guardian | Atlantean warden | construct/boss | Science Fiction; Mythological | Atlantis is Plato's (*Timaeus*, *Critias*, c. 360 BC); the Machina are Rex's faction's sci-fi | a sunken Atlantean site (an underwater dungeon) | atlantean | boss | proposed | Plato; the faction is Rex's (ALIGNMENT §10) |
| leviathan | Leviathan | colossal+aquatic/boss | Mythological | Hebrew Bible (Job 41, Psalm 74, Isaiah 27): the sea monster of the deep | the deep | - | boss | proposed | Hebrew tradition |
| jonahs-fish | The great fish | colossal+aquatic/met | Mythological | Hebrew Bible (Jonah 1–2): the fish that swallows a man for three days | the open sea | - | met | proposed | Hebrew tradition. A swallowed-whole set piece inside a boss (kraken or leviathan) is an alternative use |
| hy-brasil | Hy-Brasil | - | Mythological | Irish legend; on charts from 1325 to 1865, an island seen one day in seven | west of Ireland; here, an Atlantic minor locale | - | met (a place) | proposed | charts. A place entry for the journal (kind: place); the town keeper's if it becomes a locale |
| antillia | Antillia, Isle of Seven Cities | - | Mythological | Iberian legend of seven bishops who fled the Moors in 714; on the 1424 Pizzigano chart; gave the Antilles their name | an Atlantic minor locale | imperial (if any) | met (a place) | proposed | charts. As Hy-Brasil |
| fountain-of-youth | The Fountain of Youth | - | Mythological | the Bimini legend attached to Ponce de León (Oviedo 1535; Ponce's 1513 contract never names it) | Bimini; a minor locale | - | met (a place) | proposed | Oviedo. A place and an item, not a creature; listed for the journal |
| el-dorado | El Dorado | - | Mythological | the gilded man of the Muisca, pursued by Raleigh in Guiana (1595) | the Guiana interior; a minor locale | imperial (if any) | met (a place) | proposed | Raleigh 1596 |

## G. Fiction the factions draw on (Fantasy, with author and year)

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| lost-boy | Lost Boy | humanoid/skirmisher | Fantasy | J. M. Barrie, *Peter Pan* (1904 play, 1911 novel) | Neverland's cove | lost-boys | fodder | proposed | BARRIE. Rex's faction name is "Lost Boys / Peter Pan Pirates" |
| tick-tock-crocodile | The crocodile that swallowed a clock | quadruped+aquatic/hunter | Fantasy; Historical (the animal) | Barrie 1904: the crocodile that ate Hook's hand and the clock; the animal is the American crocodile (Historical) | Neverland's lagoon | lost-boys | elite | proposed | BARRIE. Hook: you hear it coming (Hearing Fe) |
| neverland-mermaid | Neverland mermaid | humanoid+aquatic/controller | Fantasy | Barrie 1904: the mermaids' lagoon; they drown anyone who is not Peter | the mermaids' lagoon | lost-boys or merfolk (open) | elite | proposed | BARRIE |
| hook-captain | A hook-handed captain | humanoid/boss | Fantasy | Barrie 1904: Captain Hook | the Jolly Roger at Neverland | lost-boys (antagonist) or criminal-pirates (open) | boss | proposed | BARRIE. Named use of Hook is Rex's call; the row is for the archetype |
| deep-one | Fish person (Deep One) | humanoid+aquatic/bruiser | Fantasy | H. P. Lovecraft, "The Shadow over Innsmouth" (1931): the fish-frog people of the sea who breed with men | the drowned temple; reefs off a cursed town | abyssal-cult | elite | proposed (the enemy); **Rex** (the fish person as a transformation state, COMBAT §4e) | HPL. Rex: a Cthulhu cult turns a dead crew mate into a fish person |
| abyssal-cultist | Abyssal cultist | humanoid/ritualist | Original Fiction | Rex's Abyssal Cult (ALIGNMENT §10): awakening an ancient oceanic force | a drowned temple; a cursed town's church | abyssal-cult | fodder | proposed | the faction is Rex's; the unit proposed |
| shapeless-servitor | Shapeless servitor | swarm (amorphous)/bruiser | Fantasy | Lovecraft's shoggoth (*At the Mountains of Madness*, 1936) as the type | the temple's lowest level | abyssal-cult | elite | proposed | HPL |
| the-sleeper | The sleeping thing under the sea | colossal+aquatic/boss (never fully fought) | Fantasy; Original Fiction | Lovecraft's sleeping god ("The Call of Cthulhu", 1928) echoed, not copied: the cult's goal | the deep; the campaign's end | abyssal-cult | boss (event) | proposed | HPL. The keeper proposes it is stopped from waking, never killed |
| devil-cultist | Devil cultist | humanoid/ritualist | Original Fiction | Rex's Devil Cult (ALIGNMENT §10) | a hidden chapel | devil-cult | fodder | proposed | the faction is Rex's |
| demon | Demon | humanoid (horned)/bruiser | Fantasy | JOURNAL.md §1 lists "a demon's form" under Fantasy; the Christian demonology behind the cult is the tradition | the cult's chapel; a summoning circle | devil-cult | elite | proposed (the enemy); **Rex** (the demon as a transformation state) | COMBAT §4e |
| angel | Angel | flyer (humanoid)/support | Fantasy | JOURNAL.md §1 lists "the angel's energy" under Fantasy | the Imperial church | imperial | met (an ally form) | proposed (as a unit); **Rex** (the angel as the Imperial resurrection form) | COMBAT §4e |
| machina-sentinel | Machina sentinel | construct/shooter | Science Fiction | Rex's Atlantean Machina | Atlantean sites | atlantean | fodder | proposed | the faction is Rex's |
| machina-knight | Machina knight | construct/bruiser | Science Fiction | Rex's Atlantean Machina | Atlantean sites | atlantean | elite | proposed | the faction is Rex's |
| mecha-crew | Mecha crew mate | construct/(as the person was) | Science Fiction | Rex: the Atlanteans rebuild a dead crew mate as a mecha AI | the player's ship | atlantean | met (an ally form) | **Rex** (the form, COMBAT §4e); proposed (as a bestiary row) | COMBAT §4e |
| green-spectre | Green spectre | spectral/skirmisher | Original Fiction | Rex's Ghost Fleet: green spectres bound by a betrayal (ALIGNMENT §10, ChatGPT's wording Rex kept) | the Ghost Fleet | ghost-fleet | fodder | proposed | the faction is Rex's |

## H. Prehistoric (real animals out of their time; Prehistoric + Time Anomaly, period named)

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| tyrannosaurus | Tyrannosaurus rex | quadruped (biped: head, body, two legs, two small arms)/bruiser | Prehistoric; Time Anomaly | Late Cretaceous, about 68 to 66 million years ago, western North America (Rex's example; "Jurassic" in his words, the journal would say Late Cretaceous) | an anomaly island's interior | - | boss | proposed | palaeontology (standard reference). Rex named the T. rex as the example of a tagged creature |
| megalodon | Megalodon | quadruped+aquatic (shark plan: head, body, tail)/hunter | Prehistoric; Time Anomaly | Miocene to Pliocene, about 23 to 3.6 million years ago; its teeth are found in Caribbean deposits | deep lanes; follows the ship | - | boss | proposed | palaeontology. A Caribbean fossil, so an apt anomaly |
| mosasaur | Mosasaur | serpent+aquatic/controller | Prehistoric; Time Anomaly | Late Cretaceous marine reptile, about 82 to 66 million years ago | shallow seas and lagoons | - | elite | proposed | palaeontology |
| plesiosaur | Plesiosaur | quadruped+aquatic/skirmisher | Prehistoric; Time Anomaly | Jurassic to Cretaceous marine reptile, about 200 to 66 million years ago | open water | - | elite | proposed | palaeontology. The sea-serpent sightings' favourite explanation; a journal cross-reference |
| liopleurodon | Liopleurodon | quadruped+aquatic/bruiser | Prehistoric; Time Anomaly | Middle to Late Jurassic pliosaur, about 166 to 155 million years ago | deep lanes | - | boss | proposed | palaeontology. Rex's "Jurassic" sea monster if he wants one |
| deinosuchus | Deinosuchus | quadruped+aquatic/ambusher | Prehistoric; Time Anomaly | Late Cretaceous giant alligatoroid, about 82 to 73 million years ago | mangrove and river mouths | - | boss | proposed | palaeontology |
| titanoboa | Titanoboa | serpent/controller | Prehistoric; Time Anomaly | Paleocene, about 60 to 58 million years ago, Colombia (Cerrejón) | Guiana and Darién rivers | - | boss | proposed | palaeontology. A Caribbean-basin fossil |
| dunkleosteus | Dunkleosteus | quadruped+aquatic (fish plan)/bruiser | Prehistoric; Time Anomaly | Late Devonian, about 382 to 358 million years ago (the journal's own "Devonian fish" example) | deep banks | - | elite | proposed | palaeontology; JOURNAL §1 example |
| archelon | Archelon | quadruped+aquatic/support (a mount) | Prehistoric; Time Anomaly | Late Cretaceous giant sea turtle, about 80 to 74 million years ago | turtle grounds | - | met | proposed | palaeontology. A gentle anomaly beside the real green turtle (ECOLOGY) |
| dimetrodon | Dimetrodon | quadruped/bruiser | Prehistoric; Time Anomaly | Early Permian synapsid, about 295 to 272 million years ago; not a dinosaur (the journal says so) | dry scrub islands | - | elite | proposed | palaeontology |
| cuban-giant-owl | Cuban giant owl (Ornimegalonyx) | flyer (mostly ground)/hunter | Prehistoric; Time Anomaly | Pleistocene Cuba, extinct about 10,000 years ago; a metre tall, mostly flightless | Cuban caves | - | elite | proposed | palaeontology. A true Caribbean prehistoric animal |
| megalocnus | Cuban giant ground sloth (Megalocnus) | quadruped/bruiser | Prehistoric; Time Anomaly | Pleistocene to early Holocene Cuba, extinct about 4,000 years ago | Cuban forest | - | elite | proposed | palaeontology |
| caribbean-monk-seal | Caribbean monk seal | quadruped+aquatic/met | Historical | present in the period (Columbus's men killed eight in 1494); hunted to extinction, last seen 1952 | the cays | - | met | proposed | zoology. Historical here, a lesson in the journal: alive in the game's time, gone in ours |

## I. Period animals that fight (Historical; stocks are ECOLOGY's)

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| american-crocodile | American crocodile | quadruped+aquatic/ambusher | Historical | Caribbean coasts and estuaries; Sloane 1707 and Dampier describe them | mangrove, river mouths | - | elite | proposed | SLOANE; Dampier |
| cuban-crocodile | Cuban crocodile | quadruped+aquatic/bruiser | Historical | Cuba's Zapata swamp; the most aggressive crocodile, known to leap | Cuban swamps | - | elite | proposed | zoology |
| bull-shark | Bull shark | quadruped+aquatic (shark plan)/hunter | Historical | Caribbean coasts and rivers; the shark that follows ships and enters estuaries | harbours, river mouths | - | elite | proposed | ECOLOGY sharks row; Labat on sharks |
| tiger-shark | Tiger shark | quadruped+aquatic (shark plan)/hunter | Historical | reef and lagoon | reefs | - | elite | proposed | ECOLOGY |
| giant-squid | Giant squid (Architeuthis) | cephalopod+aquatic/controller | Historical | a real deep-sea animal, the kraken's root; adults to about 13 m | the deep | - | elite | proposed | zoology. The journal's cross-reference under the kraken |
| moray-eel | Green moray | serpent+aquatic/ambusher | Historical | reef crevices | reefs | - | fodder | proposed | zoology |
| portuguese-man-o-war | Portuguese man o' war | swarm+aquatic/controller | Historical | a drifting colony with stinging tentacles; named for its sail | surface waters | - | fodder (a hazard) | proposed | zoology |
| sawfish | Sawfish | quadruped+aquatic/bruiser | Historical | Caribbean estuaries, common in the period | estuaries | - | elite | proposed | zoology |
| goliath-grouper | Goliath grouper | quadruped+aquatic/bruiser | Historical | reef and wreck | wrecks | - | elite | proposed | ECOLOGY reef fish |
| wild-boar | Wild boar | quadruped/bruiser | Historical | the boucaniers' game on Hispaniola (ECOLOGY) | forest | - | fodder | proposed | ECOLOGY; Exquemelin 1678 |
| fer-de-lance | Fer-de-lance | serpent/ambusher | Historical | Martinique and St Lucia's pit viper; Labat 1722 writes of it | cane fields and forest | - | fodder | proposed | LABAT |
| boa-constrictor | Boa | serpent/controller | Historical | the Lesser Antilles and the mainland | forest | - | elite | proposed | zoology |
| vampire-bat | Vampire bats | swarm (flyer)/ambusher | Historical | Trinidad and the mainland; bite sleeping men and cattle; Oviedo describes the bites | caves, camps at night | - | fodder | proposed | Oviedo 1535. The opía's form in Taíno belief: a journal cross-reference |
| land-crab-swarm | Land crabs | swarm/skirmisher | Historical | the crab runs in the rains (ECOLOGY) | beaches in the wet season | - | fodder (and food) | proposed | ECOLOGY |
| feral-dog-pack | Feral dogs | quadruped (pack)/hunter | Historical | the Spanish dogs gone wild on Hispaniola, hunted with by the boucaniers | savannas | - | fodder | proposed | Exquemelin 1678 |

## J. People (Historical; the human enemies, by faction; the crew's own classes are COMBAT.md's)

| id | name | class | provenance | period / tradition | home | faction | role | status | source |
|---|---|---|---|---|---|---|---|---|---|
| pirate-boarder | Boarder | humanoid/bruiser | Historical | Golden Age crews, 1650 to 1730 | any ship | free-pirates or criminal-pirates | fodder | proposed | GOS |
| pirate-gunner | Gunner | humanoid/shooter | Historical | as above | any ship | free-pirates or criminal-pirates | elite | proposed | GOS |
| pirate-captain | Pirate captain | humanoid/boss | Historical | as above; a named captain is the story keeper's | a flagship | free-pirates or criminal-pirates | boss | proposed | GOS |
| cutthroat | Cutthroat | humanoid/ambusher | Historical | the port's low life (TOWNS.md: the starting port) | alleys at night | criminal-pirates | fodder | proposed | TOWNS.md (the port's character) |
| gang-boss | Gang boss | humanoid/boss | Historical | a port gang's head | a hideout dungeon (a pirate's cove) | criminal-pirates | boss | proposed | Rex: a dungeon "could count as a pirate's cove" |
| marine | Marine | humanoid/shooter | Historical | Spanish, English and French marines of the period | forts, men-of-war | imperial | fodder | proposed | period military history |
| grenadier | Grenadier | humanoid/siege | Historical | grenadier companies from the 1670s | forts | imperial | elite | proposed | period military history |
| inquisitor | Inquisitor | humanoid/ritualist | Historical | the Spanish Inquisition's Cartagena tribunal (1610) is real; its powers here are the Church's rites | Cartagena; the Imperial church | imperial | elite | proposed | history. The person historical; any miracle Fantasy per the journal |
| admiral | Admiral | humanoid/boss | Historical | a flag officer of the Crown | a flagship | imperial | boss | proposed | history |
| militia | Militia | humanoid/skirmisher | Historical | island militias | towns | imperial | fodder | proposed | history |
| boucanier | Boucanier | humanoid/shooter | Historical | the hunters of Hispaniola with their long guns and dogs (Exquemelin 1678) | the savannas; Tortuga | free-pirates | elite | proposed | Exquemelin |
| maroon | Maroon | humanoid/ambusher | Historical | the free communities of the mountains (Jamaica's Maroons fought the English 1655 to 1739) | mountain forest | - (their own) | elite or met | proposed | history. Open: whether they are ever enemies; the keeper advises allies or neutral |
| blackbeard-ghost | Blackbeard's ghost | spectral/boss | Mythological; Historical (the man) | Edward Teach, killed 1718 (Johnson 1724); folklore says the headless body swam round the ship and his light walks Ocracoke | Ocracoke; a storm lane | ghost-fleet | boss | proposed | GOS; North Carolina folklore |

## Counts

| Section | Rows |
|---|---|
| A. Rex's named items | 1 |
| B. Taíno | 17 |
| C. Kalinago and mainland Caribs | 5 |
| D. Afro-Caribbean | 21 |
| E. Eastern Caribbean | 13 |
| F. European sailor lore and classical myth | 20 |
| G. Fiction the factions draw on | 15 |
| H. Prehistoric | 13 |
| I. Period animals that fight | 15 |
| J. People | 13 |
| **Total** | **133** (printed by `build-bestiary.py`) |

## Log

| Date | What | Who |
|---|---|---|
| 2026-10-29 | First candidate list: Rex's kraken; Taíno, Kalinago, Afro-Caribbean, Eastern Caribbean, European and classical, faction fiction, prehistoric, period animals, people; all proposed | keeper |
