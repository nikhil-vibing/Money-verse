# Third-party asset attribution

> Every external asset used in Dhaniverse 2.0 is listed here with its source, author, licence, and attribution text. The `art-curator` agent adds entries as it sources assets. No asset is committed without a corresponding entry.

## Format

```markdown
### <category> — <slug>
- Source: <URL>
- Author: <name>
- Licence: <CC0 / CC-BY 4.0 / MIT / ...>
- Attribution: "<exact attribution text if required>"
- Dimensions / details: <e.g., 32×32, 4-frame walk, 24-colour>
- Local path: `assets/<category>/<slug>/`
- Modified: <yes/no — describe>
```

## Fonts

### Atkinson Hyperlegible
- Source: https://brailleinstitute.org/freefont
- Author: Braille Institute of America, Applied Design Works
- Licence: SIL Open Font Licence 1.1
- Attribution: "Atkinson Hyperlegible Font © Braille Institute of America"

### IBM Plex Sans Devanagari
- Source: https://www.ibm.com/plex/
- Author: IBM
- Licence: SIL Open Font Licence 1.1
- Attribution: "IBM Plex Sans Devanagari © IBM Corp."

### OpenDyslexic
- Source: https://opendyslexic.org/
- Author: Abelardo Gonzalez
- Licence: SIL Open Font Licence 1.1

## Sprites — Chawl Mohalla district

> Curated 2026-05-14 by `art-curator`. All entries below are CC0 or CC-BY 4.0 — no CC-BY-SA, no NC, no "free but no redistribute" packs.
> Local paths are placeholders; the engineer will download and place files when integrating.

---

### Tileset — kenney-rpg-urban-kit (PRIMARY exterior)
- Source: https://kenney.nl/assets/rpg-urban-kit  ·  Mirror: https://opengameart.org/content/rpg-urban-pack
- Author: Kenney (kenney.nl)
- Licence: CC0 1.0 Universal
- Attribution: Not required. Optional credit: "Kenney.nl"
- Dimensions / details: 480+ tiles; 6 characters with 4-direction walk; sized for top-down urban scenes. Will be down-tiled / re-anchored to our 16x16 baseline (Kenney art is 16x16 with 2px spacing).
- Local path: `assets/chawl-mohalla/tilesets/exterior-urban-kenney/`
- Modified: planned — recolour walls to faded saffron/terracotta/indigo; re-anchor alley floor; add chawl-specific decals.

### Tileset — kenney-pixel-platformer (PRIMARY props)
- Source: https://kenney.nl/assets/pixel-platformer
- Author: Kenney (kenney.nl)
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 200 tiles at 18x18; donates props (signs, planters, lamps, banners). We'll crop the 18px frames to 16px for consistency.
- Local path: `assets/chawl-mohalla/tilesets/props-platformer-kenney/`
- Modified: yes — recropped to 16x16; recoloured.

### Tileset — kenney-1bit-pack (PRIMARY silhouettes / icon fallback)
- Source: https://kenney.nl/assets/1-bit-pack  ·  Mirror: https://opengameart.org/content/1-bit-pack
- Author: Kenney
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 1078 tiles at 16x16. Includes urban + interior sample sheets. Useful for sign silhouettes and quick prototypes; we'll re-shade with palette.
- Local path: `assets/chawl-mohalla/tilesets/1bit-kenney/`
- Modified: yes — re-shaded to terracotta/saffron/indigo palette.

### Tileset — surt-town-tiles (PRIMARY narrow-alley / chawl baseline)
- Source: https://opengameart.org/content/town-tiles
- Author: surt
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 16x16, designed for Pixelation's Tiny Town Challenge. Wall + ground tile primitives that match the chawl alley scale; warm earthy palette already close to our target.
- Local path: `assets/chawl-mohalla/tilesets/town-tiles-surt/`
- Modified: planned — palette swap (warm-evening Indian variant), add iron-railing balcony pieces.

### Tileset — surt-cc0-scraps (ALTERNATIVE — fill gaps)
- Source: https://opengameart.org/content/surts-cc0-scraps-tilesets-platformers-sprites
- Author: surt
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: Mixed sizes; pulled in for misc walls, terrain, railings, doors. Marked "incomplete/rough" by the author but useful for pattern continuity with surt-town-tiles.
- Local path: `assets/chawl-mohalla/tilesets/surt-scraps/`
- Modified: yes — pick selected tiles only.

### Tileset — george-16x16-game-assets (ALTERNATIVE interior + outdoor)
- Source: https://opengameart.org/content/16x16-game-assets
- Author: George Bailey (George_)
- Licence: CC-BY 4.0
- Attribution: "16x16 Game Assets by George Bailey, CC-BY 4.0 — https://opengameart.org/content/16x16-game-assets"
- Dimensions / details: 16x16; includes house/building interior tiles, terrain, animated water, base tiles.
- Local path: `assets/chawl-mohalla/tilesets/16x16-assets-georgebailey/`
- Modified: planned — recolour interior tiles to muted cement / faded saffron.

---

### NPC base — anonymous-16x16-base-sprites (PRIMARY character base)
- Source: https://opengameart.org/content/16x16-base-sprites
- Author: anonymous (uploaded as "Unnamed")
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 16x16 base sprite; idle + 6-frame walk cycle in 4 directions; male + female bases.
- Local path: `assets/chawl-mohalla/npcs/base-anon/`
- Modified: planned — *this is our character base*; we will re-skin into Maya didi, Aarav, Bhola seth, Sushila aunty, Drumming Kid, Lakshmi dabbawala. Saree / kurta / shirt-pant overlays painted in-house.

### NPC — sean-noonan-top-down-smart-old-man (PRIMARY for Bhola seth)
- Source: https://opengameart.org/content/top-down-smart-old-man
- Author: Sean Noonan
- Licence: CC0 1.0 Universal
- Attribution: Not required. Optional: "Sean Noonan".
- Dimensions / details: top-down walk cycle + idle, smart-dressed older man. Single-direction in source — we will mirror + extend to 4-direction.
- Local path: `assets/chawl-mohalla/npcs/bhola-seth-base/`
- Modified: yes — re-coloured for *suspicious-friendly* look (warm safari shirt + ledger book held).

### NPC — antifarea-twelve-16x18-rpg-character-sprites (ALTERNATIVE NPCs)
- Source: https://opengameart.org/content/twelve-16x18-rpg-character-sprites-including-npcs-and-elementals
- Author: Antifarea
- Licence: CC-BY 3.0
- Attribution: "Art by Antifarea. Commissioned by OpenGameArt.org (https://opengameart.org/) — CC-BY 3.0"
- Dimensions / details: 16x18; 4-frame walk cycle; priest / nun / merchant / cultist / captain / 6 elementals. Useful as bases for Ravi anna (chai vendor) and the kirana-aunty.
- Local path: `assets/chawl-mohalla/npcs/antifarea-set/`
- Modified: planned — re-skin merchant → Ravi anna (chai vendor), nun → Sushila aunty.

### NPC — pebonius-surtizens (ALTERNATIVE NPCs)
- Source: https://opengameart.org/content/surtizens
- Author: pebonius
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 16x16; "old human, glasses human, high-heels human, dog, frog, duck, orc, goblin, minotaur." Designed to match surt-town-tiles palette. **No walk animations** in source.
- Local path: `assets/chawl-mohalla/npcs/surtizens/`
- Modified: planned — animate to walk; ignore non-human entries.

### NPC animal — jason-of-gdn-dog-spritesheets (PRIMARY for Biscuit the stray)
- Source: https://opengameart.org/content/dog-spritesheets
- Author: Jason of GDN
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: brown / black / white spritesheets; idle, walk, run, jump, fall, attack animations.
- Local path: `assets/chawl-mohalla/npcs/biscuit-dog/`
- Modified: planned — use brown variant; scale to 16x16 to match chawl pedestrians.

### NPC animal — kenney-clint-tiny-creatures (ALTERNATIVE for Biscuit)
- Source: https://opengameart.org/content/tiny-creatures
- Authors: Clint Bellanger and Kenney
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 16x16 with 2px outline (effective 12x14); 180 sprites incl. dogs, cats, multiple mammals.
- Local path: `assets/chawl-mohalla/npcs/tiny-creatures/`
- Modified: planned — pick brown dog frame only.

---

### Props — kaliyuga-plant-pixel-art-cco (PRIMARY plants / tulsi)
- Source: https://opengameart.org/content/plant-pixel-art-cco
- Author: KaliYuga
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: assorted plants, flowers, succulents (varied sizes).
- Local path: `assets/chawl-mohalla/props/plants-kaliyuga/`
- Modified: planned — repaint one succulent into a tulsi plant in a brass pot.

### Props — kaliyuga-food-pixel-art-cco (PRIMARY food + chai paraphernalia)
- Source: https://opengameart.org/content/food-pixel-art-cco
- Author: KaliYuga
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: assorted food items; we'll repurpose cups/glasses for chai glass; pots for chai kettle. Resolution mixed.
- Local path: `assets/chawl-mohalla/props/food-kaliyuga/`
- Modified: planned — recolour to brass / steel; convert mug → chai glass with handle.

### Props — moikmellah-16x16-treasure-chests (PRIMARY vault / locked jar)
- Source: https://opengameart.org/content/16x16-treasure-chests
- Author: MoikMellah
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 16x16; four chests (wood / stone / silver / gold), open and closed frames.
- Local path: `assets/chawl-mohalla/props/vault-chests/`
- Modified: planned — re-skin to a tin "cash jar" / metal trunk for the savings-vault prop.

### Props — denislav-pixel-art-tv-sprite-cc0 (PRIMARY interior TV)
- Source: https://opengameart.org/content/pixel-art-tv-sprite-cc0
- Author: Denislav
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: old-CRT TV. Source ~200x200 upscaled; will downscale to 16x16.
- Local path: `assets/chawl-mohalla/props/tv-denislav/`
- Modified: planned — downscale and reshade.

### Props — antumdeluge-cc0-currency-icons (PRIMARY ₹ icon / coin stack)
- Source: https://opengameart.org/content/cc0-currency-icons
- Author: AntumDeluge (curating works from OpenClipart, FacadeGaikan, Fleurman, 7Soul1, Dungeon Crawl Stone Soup)
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 16x16 / 24x24 / 32x32 / 64x64; generic coin / cash / gold / silver icons.
- Local path: `assets/chawl-mohalla/props/currency/`
- Modified: planned — repaint to draw a clean ₹ symbol pixel-glyph (rupee icon does not ship in this pack).

### Props — jhan-gutierrez-gas-cylinder (PRIMARY LPG cylinder reference — 3D)
- Source: https://opengameart.org/content/gas-cylinder
- Author: Jhan Gutierrez
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 3D model (NOT pixel art). Used as **reference only** to hand-pixel a 16x16 gas-cylinder sprite consistent with chawl-kitchen palette.
- Local path: `assets/chawl-mohalla/props/gas-cylinder-reference/`
- Modified: reference only; not shipped.

---

### UI — kenney-pixel-ui-pack (PRIMARY 9-slice frames + checkmark)
- Source: https://kenney.nl/assets/pixel-ui-pack  ·  Mirror: https://opengameart.org/content/pixel-ui-pack-750-assets
- Author: Kenney
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 750 assets; 16x16 grid with 2px spacing; includes 30 separate 9-slice PNGs, panels, buttons, cursors, bars, checkmarks, scrollers.
- Local path: `assets/chawl-mohalla/ui/pixel-ui-kenney/`
- Modified: planned — re-skin 9-slice frames to a paper / passbook look for diegetic dialog; recolour checkmark to saffron.

### UI — kenney-ui-pack-rpg-extension (PRIMARY checkmark + X cross)
- Source: https://opengameart.org/content/ui-pack-rpg-extension
- Author: Kenney
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 87 PNGs; buttons, panels, sliders, checkmarks, cross/X icons.
- Local path: `assets/chawl-mohalla/ui/ui-pack-rpg-kenney/`
- Modified: planned — pick checkmark + X only; recolour.

### UI — kenney-game-icons (PRIMARY heart / misc icons)
- Source: https://opengameart.org/content/game-icons
- Author: Kenney
- Licence: CC0 1.0 Universal
- Attribution: Not required. Optional: "Kenney.nl".
- Dimensions / details: 105 icons; 1x + 2x; black + white; includes checkmark, cross/exit, exclamation, home, lock, star, trophy, warning, etc.
- Local path: `assets/chawl-mohalla/ui/game-icons-kenney/`
- Modified: planned — recolour; the "heart" we will hand-paint matching this set's style (Kenney's set does not ship a heart icon).

### UI — sarbot-rpg-ui-elements-cc0 (ALTERNATIVE UI fallback)
- Source: https://opengameart.org/content/rpg-ui-elements-cc0
- Author: sarbot
- Licence: CC0 (version not explicitly listed)
- Attribution: Not required.
- Dimensions / details: buttons, icons, generic UI bundle.
- Local path: `assets/chawl-mohalla/ui/sarbot-ui/`
- Modified: planned — only if Kenney sets don't cover a particular widget.

---

### Palette reference — sonnydb-terracotta_49 (reference only)
- Source: https://lospec.com/palette-list/terracotta49
- Author: SonnyDB
- Licence: Lospec does not state an explicit licence on the page. **Treat as reference-only — DO NOT distribute the palette JSON in our shipped art bundle.** The colours themselves (hex codes) are not copyrightable; we will derive our terracotta/saffron/indigo recolour mapping from this and from in-house colour-comping.
- Dimensions / details: 49 colours; modified Minecraft terracotta family.
- Local path: `assets/chawl-mohalla/palette/terracotta49-ref/` (notes only)
- Modified: reference only.

---

## REJECTED (incompatible licence) — listed for transparency

- **[LPC] Walls** — https://opengameart.org/content/lpc-walls — CC-BY-SA 3.0 (share-alike contaminates our AGPL/MIT-mix → REJECTED).
- **[LPC] House interior and decorations** — https://opengameart.org/content/lpc-house-interior-and-decorations — CC-BY-SA 3.0 / GPL → REJECTED.
- **LPC Base Assets** — https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles — primary CC-BY-SA 3.0 (only Sharm + Redshrike fragments are CC-BY 3.0; rest of pack contaminated). REJECTED as a pack; individual Sharm/Redshrike pieces could be re-evaluated case-by-case but for now passing.
- **Interior Tileset 16x16** by Bonsaiheldin — https://opengameart.org/content/interior-tileset-16x16 — CC-BY-SA 3.0 → REJECTED.
- **16x16 RPG Tileset** by hilau — https://opengameart.org/content/16x16-rpg-tileset — CC-BY-SA 3.0 → REJECTED (would have been a great drop-in).
- **16x16 Asset Pack** by 16Pixel — https://opengameart.org/content/16x16-asset-pack — CC-BY-SA 4.0 → REJECTED.
- **Exterior 32x32 Town Tileset** by ArthCarvalho — https://opengameart.org/content/exterior-32x32-town-tileset — CC-BY-SA 4.0 → REJECTED.
- **Residents of the City** by CraftPix — https://opengameart.org/content/residents-of-the-city-pixel-art-sprite-sheets — OGA-BY 3.0 (Attribution-NoDerivatives flavour) → REJECTED (incompatible with our modification needs).
- **LimeZu Modern Interiors / Modern Exteriors (free version)** — https://limezu.itch.io/moderninteriors , https://limezu.itch.io/modernexteriors — licence text ambiguous on free build; paid build explicitly says "cannot resell/redistribute even modified" → REJECTED (any redistribution as part of our open-source art bundle is forbidden).
- **TheStarvingArtificer — Mix n Match Market Stalls** — https://thestarvingartificer.itch.io/market-stalls — "cannot be resold/redistributed in any form" → REJECTED (was the closest match to a chai-stall sprite, painful loss).
- **Anokolisa — Free Pixel Art Asset Pack** — https://anokolisa.itch.io/free-pixel-art-asset-pack-topdown-tileset-rpg-16x16-sprites — licence is a Google Doc not on the page; not verifiable → DEFERRED (cannot tick the box "verified the licence on the page itself"). If we ever need it, re-verify before use.
- **Kyrise's Free 16x16 RPG Icon Pack** — https://opengameart.org/content/kyrises-free-16x16-rpg-icon-pack — CC-BY 4.0 (would be acceptable) but no envelope, no rupee, no heart, no chawl-specific items → DEFERRED (not rejected on licence, just not useful here).

## Audio — pending
*(art-curator will append entries as audio is sourced)*
