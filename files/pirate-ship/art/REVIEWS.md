# Pirate ship: art reviews (started 2026-10-26)

One dated entry per piece Rex shares for judging, newest at the bottom. Suggestions are marked **(proposed)**;
the call is always Rex's. Yardsticks: `ART_DIRECTION.md` §1–3 and the character's story doc.

Each entry covers:

- **Piece and character:** what it is (sprite, bust, expression, scene), which character, the file path.
- **Reads at game size:** silhouette at 64×112; face at portrait size.
- **Expression:** does it carry this character's personality and psycho side; is it hot rather than goofy.
- **Consistency:** style guide (two tones, outline, AA off), palette, match between sprite and bust.
- **Works / doesn't:** specific and honest.
- **Try (proposed):** one or two concrete things.
- **Story check:** any contradiction with the character doc (noted here and told to Rex; story docs not edited).

## Entries

### 2026-10-27 · `intj-f` (the INTJ apothecary, the previous owner's daughter) · design concepts, 4 images

- **Piece:** four painted concept images of one design, waist up, in her lab. These are character designs, not
  pipeline assets (painterly with soft gradients and glow, not two-tone). Shared in chat; Rex's source path not
  given. Judged against `story/characters/intj-f.md` (2026-10-27) and `ART_DIRECTION.md`.
- **The design (the same in all four):** pale pink bob with bangs; large round wire glasses; amber-brown eyes,
  heavy-lidded; fangs; black choker; ear piercings and dangling earrings; a bat-winged heart tattoo on the chest; an
  open white lab coat over a black latex strapless dress; black nails; flasks of pink and green potion; a green
  ghost-flame; candles; dark shelves of glowing glassware.

**Reads at game size**

- *Sprite (64×112, face about 14×12):* good markers. A pale pink bob, a white coat flaring over a black dress and
  two round lenses survive at that size. Pink over white is a clean silhouette with nothing else in the cast yet.
  The fangs, tattoo, choker and earrings won't read on the sprite; they belong to the bust.
- *Bust:* the face reads, and the glasses are the strongest single feature. But the lenses half-hide the eyes in
  every image, so the expression sheet will have to carry its emotion through the brows and mouth. Light glare on
  the lenses could also be its own expression.
- *Body:* her bust is far beyond the shared rig's `slim` and `broad` shapes. The world sprite needs its own body
  mesh or a chest slot mesh, or she loses that read in the world view. This decides how far the shared rig flexes,
  so it's Rex's call.

**Expression: personality and psycho side**

- **What works:** the flask held out toward the viewer (images 1, 2, 4) *is* her questline: she's offering you a
  drink and you have to work out whether it kills. In image 3 she holds two flasks, one in each hand: which one?
  That's the gamble in a single pose, and the best idea in the set.
- **What doesn't:** all four faces are the same wide fanged grin, three with the tongue out and drool. That reads
  as giggly, gleeful, extraverted chaos. Her canon is the opposite energy: an INTJ (Ni-Te) who *judges*. She
  decides who is evil and tests on them with no qualms. Her danger is calm certainty, the look of someone who has
  already decided. As her **unhinged** face the grin is strong. As her default it fights her type and the doc.
- **Hot or goofy:** the body and the coat over latex are hot. The face is where it slips: tongue out with drool in
  every image tips toward a meme gremlin. Once is a spike of madness; as her standard look it costs her the menace.

**Consistency (style guide, palette, the setting)**

- *Within the set:* very consistent, and the design is clearly locked. Small drifts to settle on one of: the
  earrings (green orbs, black rings, gems), the tattoo colour (maroon, pink, black outline), the eye colour (amber
  to brown).
- *Against the render contract:* the identity leans on things two-tone shading, palette snap and "no bloom"
  remove: neon glow, latex sheen, rim light and the green flame. What will survive is hair colour, glasses, coat,
  choker and tattoo. The pink and teal neon will snap to the nearest of the 48 colours, so check that both exist on
  a ramp (open A3).
- *Against the story doc and the port:*
  - **Herbalist:** her doc says herbalist with potions and tinctures, and there isn't a herb in the frame. It's a
    chemistry lab: Erlenmeyer flasks, a lab coat, glowing reagents.
  - **"Mostly science":** her questline is "based mostly on science and the clues you receive". Ghost-flames and
    glowing potions read as magic, which may mislead the player about how her puzzle works.
  - **The port:** Rex's port is run down, sea-weathered, and "none of the buildings look new". This lab is dark
    and clean, with nothing salt-worn or patched.
- *Not in canon (questions for Rex, not contradictions):* the fangs and the bat-winged heart tattoo code her as a
  vampire or succubus, and nothing in her doc says that. If it's only the "psycho" read, fine. If it's literal, it
  belongs in her story doc. Image 2's shadow figure with a glowing smile in the doorway isn't in canon either.

**Try (proposed)**

1. Give her a **closed-mouth, level, appraising face** as neutral: glasses low, eyes over the rims, a small knowing
   smile, watching you drink. Keep the fanged, tongue-out grin for the **unhinged** slot only. Her signature face
   could be the moment she watches the test work.
2. **Make the lab an herbalist's:** drying bundles hung from the beams, a mortar, stoppered stoneware and amber
   apothecary jars, a patched counter, salt stains. Keep exactly one glowing note, the potion in her hand, so the
   threat is the thing she offers you. Before committing to the design, posterise one image to two tones in the
   palette in Aseprite to see which identity marks survive.

**Story check:** told Rex. The herbalist and science points sit against canon fields in `intj-f.md`; the fangs and
tattoo are open questions for him. No story docs edited.
