# Pirate ship: art direction (kept by the art keeper; started 2026-10-26)

Rex makes all the art: Blender models, Meshy, and Aseprite for sprites and overpaint. This file records the
direction he sets. It never picks art for him. Every item is marked **(Rex)** when he set it, or **(proposed)**
when it is a suggestion he hasn't stamped yet.

Sources: `../PIRATE.md` §3 (the art combo and the three-quarter switch) and High Roller's art contract,
`Games/Card Games/high-roller/files/high-roller/ART.md` (§1 canvas, §2 proportions, §6 shading). Characters come
from `../story/characters/` (the story keeper's) and `../crew/ROSTER.md`. Per-character asset status is in
`CHARACTER_SHEETS.md`; judgements of Rex's pieces are in `REVIEWS.md`. Town parts change look with the player's
choices (upgrade slots in `../town/UPGRADES.md`, the town keeper's); once that file exists, per-state art status
goes in `TOWN_SHEETS.md`, keyed by slot id.

## 1. The style (what holds)

| Item | Direction | Source | Mark |
|---|---|---|---|
| Overall look | High Roller's style: same graphics, same pipeline; this game is its spin-off | PIRATE.md intro, §2 | Rex |
| Tools | Blender models, Meshy, Aseprite for sprites and overpaint | Rex | Rex |
| Camera | **Three-quarter top-down (the Stardew angle)**, not High Roller's isometric diamond and not pure top-down. Square tiles. Walk cycles facing down, up and side (side mirrored). Pure top-down may still suit the sailing chart later | PIRATE.md §3 (2026-10-26) | Rex |
| Why that camera | Walking the dock you still see your boat's hull, mast and shape; fishing aim and distance read straight out from the dock | PIRATE.md §3 | Rex |
| Palette | High Roller's 48-colour palette, four ramp steps per hue (`data/high-roller/palette.gpl`); every pixel snapped to it | ART.md §6 | Rex (High Roller) |
| Shading | Two tones (one lit side, one shadow side), Workbench, light from screen upper-left, no gradients, no dithering, no bloom. Next step up if wanted is three tones via a fill light, never gradients | ART.md §6 | Rex (High Roller) |
| Outline | 1-px outline in the palette's darkest colour around the finished silhouette (world sprites) | ART.md §6 | Rex (High Roller) |
| Anti-aliasing | Off everywhere (blended edges snap to wrong colours) | ART.md §6 | Rex (High Roller) |
| Surfaces | Hybrid: big areas flat palette colours; detail that is a picture (face, pattern, print) painted in Aseprite on a 128×128 atlas, nearest sampling. "If it is a shape, model it; if it is a picture, paint it" | ART.md §6 | Rex (High Roller) |
| World body | Shared rig, three-and-a-half-head cartoon proportions, rounded low-poly (tapered limbs, egg torso, not blocks); `slim` and `broad` body shapes; skin tones as palette swaps | ART.md §2 | Rex (High Roller) |
| Outfits | Paper-doll slots on the shared rig, as High Roller | PIRATE.md §2–3 | Rex |

## 2. The combo: four layers (PIRATE.md §3)

Stardew / Fire Emblem arrangement: small readable sprites on the map, a large expressive portrait when you talk.
The combo was recommended in the spec at Rex's request; the brief for this file treats it as the plan.

| Layer | What | How it's made | Size | Mark |
|---|---|---|---|---|
| World sprites | crew, the player and NPCs on the decks; outfits as slots | ART.md exactly, rendered from the three-quarter camera | 64×112 per frame | proposed (spec), camera Rex |
| Conversation portraits | chest-up bust beside the dialogue box | a **separate bust model per character**: more polygons, **adult proportions** (the world body's big head would look childish next to "hot"); same palette ramps, two tones and outline, so it reads as the same family | about 512×640 per pose | proposed |
| Expression sheet | neutral, smile, smirk, flustered, angry, unhinged, hurt, **plus one signature face** per character | shape keys on the portrait head, one sheet per character; the client swaps the face per line | one sheet per character | proposed |
| Heart-event scenes | the big relationship moments (a confession, a duel, a betrayal) | portrait models posed in a scene, rendered, then **overpainted** in Aseprite or Krita | screen-sized, a few per character | proposed |

Consistency rule between layers (proposed, PIRATE.md §3): the bust is built to the same character sheet as the
world sprite: same hair, same scars, same outfit colours, so a crew mate is recognisable in both views.

Portrait render settings (proposed, PIRATE.md §3): the same Workbench two-tone setup, a closer orthographic camera
framed on the chest, AA off, palette snap on, **2-px outline** at bust size. One `.blend` per character at
`art/portraits/<id>.blend`, shape keys named for the expressions.

## 3. What the cast has to look like (the brief for judging)

From PIRATE.md and the roster; these are the yardsticks `REVIEWS.md` judges against.

- **Hot psychos** (Rex): attractive and dangerous, each in a different way. Never goofy; never a horror-movie
  monster that stops being attractive.
- **The look fits who they are:** their type, their pirate archetype and ship job, and their psycho side
  (ROSTER.md: psycho core, madness break, triggers). The madness reads as a pirate doing the job too well.
- **A man and a woman per type** (Rex), 32 in all: the pair shares a type and archetype but should not read as
  the same design in two genders.
- The roster's **forms** (golem, ghost, dragonfly…) are loose reference, not a script (Rex, 2026-10-26).
- Readability: the world sprite must read by **silhouette** at 64×112 (face patch only about 14×12 px); the
  bust must carry the face, and "unhinged" must still be hot.

## 3a. Places: the starting port (from `../story/STORY.md`, commit f7ccbf5)

| Item | Direction | Mark |
|---|---|---|
| Starting port | Run down and in shambles, barely held together by passing trade | Rex |
| Buildings | Houses old and weathered by the sea; **none of the buildings look new** | Rex |
| Character of the place | A small pirate haven for lowlifes (criminals, ne'er-do-wells, schemers); not a bustling pirate port | Rex |
| Contrast | The last level is the opposite: a rich, true pirate port. The art should show the climb from one to the other | Rex (the contrast); proposed (showing it as a climb) |
| Details | Docks barely maintained; buildings repaired so often that nothing matches; salt eating every surface; a harbour of fishing boats and damaged sloops | proposed (outside AI, via the story keeper) |

## 4. Open (not decided; Rex's call)

| # | Question | Notes |
|---|---|---|
| A1 | Portrait size | 512×640 per pose is proposed only; depends on the dialogue box and target screens |
| A2 | Outline width at bust size | 2 px proposed; 1 px would match the sprites but may vanish at 512 px |
| A3 | Palette ramps per character | which ramps are each crew mate's signature (hair, coat, skin); whether any hue is reserved for one character; whether the 48-colour palette needs pirate hues (sea, tar, brass, blood) |
| A4 | The three-quarter camera's numbers | ART.md §3's camera (2:1 dimetric, 45.25 px per BU, 64×32 tile) was for isometric. The new camera pitch, square tile size in px, and whether the 64×112 canvas and 96-px figure still hold all need setting. The Phase 1 dock uses placeholder 16-px tiles (`data/pirate-ship/maps/dock.json`) |
| A5 | Facings | down, up and side are set; whether side is one mirrored facing (asymmetric items flip) or two |
| A6 | Expression list | the seven shared faces are proposed; each character's signature face is open until the character exists |
| A7 | Heart-event overpaint tool | Aseprite or Krita; how far overpaint may depart from the render |
| A8 | Where Rex keeps the source files | `.blend`, Meshy exports, renders: record the paths in `CHARACTER_SHEETS.md`; they are not committed unless Rex asks |

## 5. Decisions log

| Date | Decision | Mark |
|---|---|---|
| 2026-10-25 | The pirate ship uses High Roller's graphics and pipeline (spin-off spec) | Rex |
| 2026-10-25 | The combo: world sprites + per-character bust portraits + expression sheets + overpainted heart-event scenes (PIRATE.md §3) | proposed (recommended at Rex's request) |
| 2026-10-26 | Three-quarter top-down view (the Stardew angle), square tiles, walk facing down, up and side | Rex |
| 2026-10-26 | Art keeper set up: this file, `CHARACTER_SHEETS.md`, `REVIEWS.md` | — |
| 2026-10-26 | Starting port look: run down, sea-weathered, nothing new, a lowlife haven; the last level a rich true pirate port (§3a). Outside AI's details recorded as proposed | Rex |
