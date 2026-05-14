# Third-party asset attribution

> Every external asset used in Money-verse is listed here with its source, author, licence, and attribution text. The `art-curator` agent adds entries as it sources assets. No asset is committed without a corresponding entry.

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

### Chawl Pixel 8 (in-game BMFont)
- Source: built at predev/prebuild from `apps/game/scripts/build-pixel-font.mjs`
- Author: Money-verse (hand-authored 5x7 glyph grids)
- Licence: CC0 1.0 Universal — see `apps/game/public/fonts/LICENCE.txt`
- Attribution: not required
- Dimensions / details: 5x7 glyphs on 128x96 atlas, 9-px line height, 95 printable ASCII glyphs + ₹ (U+20B9)
- Local path: `apps/game/public/fonts/chawl-pixel-8.{png,fnt}` (mirrored to `apps/web/public/fonts/` by `apps/web/scripts/copy-content.mjs`)
- Modified: build script is the canonical source; PNG + FNT regenerate deterministically on every checkout
- Why we ship our own: the UI audit (`docs/audit/ui-designer.md`) identified bilinear sampling of vector fonts at 6px / 3x camera zoom as the root cause of the "names look pixelated, not immersive" complaint. Bitmap fonts side-step that pipeline. Authoring our own font removes every external-licence risk.

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

---

# Round 2 — ship-grade candidates (2026-05-14)

> Round-1 pass landed mostly placeholder-grade CC0 from Kenney + Pixel Frog (platformer-tilted). Round 2 is a deeper hunt for **top-down RPG** ship-grade tilesets, animated character packs, pixel fonts (with Devanagari), dialog UI 9-slice frames, and HUD icons. Every licence below was verified by fetching the source page in May 2026 — not trusting summaries.
>
> Ranking tags: **PRIMARY** = the one we'd ship; **ALTERNATIVE** = backup if PRIMARY licence/quality concerns surface; **REJECTED-R2** = found but rejected with a one-line reason.

## Round 2 — TILESETS (top-down RPG, ship-grade)

### Tileset — pixel-boy-ninja-adventure (PRIMARY ship-grade top-down)
- Source: https://pixel-boy.itch.io/ninja-adventure-asset-pack
- Author: Pixel-Boy & AAA
- Licence: CC0 1.0 Universal (verified on page: "Creative Commons Zero (CC0) license… Attribution is not required but appreciated")
- Attribution: Not required. Optional courtesy: "Pixel-Boy & AAA — Ninja Adventure Asset Pack (CC0)".
- Dimensions / details: 16×16 baseline. **50+ characters** with full 4-direction walk + facesets, **30+ monsters** animated, **9 bosses**, full autotiling tileset (floor + exterior + interior), **60+ items**, 30+ visual effects, UI elements, **2 fonts**, plus 100+ SFX and 37 music tracks (audio reserved for audio-curator review). Download ~89 MB total (we will pull only the visual subset, ~20 MB pre-cull).
- Local path: `assets/chawl-mohalla/tilesets/ninja-adventure-pixelboy/`
- Modified: planned — heavy palette swap to terracotta/saffron/indigo; cull all temple/forest tiles, keep urban-adjacent (walls, floors, paths, fences, signs, props, interior furniture); restyle one NPC body type as the chawl-pedestrian base; clip the 2 bundled fonts (CC0).
- **Why PRIMARY:** the only single-pack we found that simultaneously provides (a) ship-grade pixel quality, (b) full 4-direction NPC animation in volume, (c) UI + effects + fonts, (d) clean CC0, (e) consistent palette across all assets. Best ship-grade-with-zero-attribution win of the entire hunt.

### Tileset — sharm-16x16-town-remix (PRIMARY street + ground continuity)
- Source: https://opengameart.org/content/16x16-town-remix
- Author: Lanea "Sharm" Zimmerman with Stephen "Redshrike" Challener + Carl "Surt" Olsson
- Licence: CC-BY 4.0 (also offered as CC-BY 3.0 / OGA-BY 3.0; we take CC-BY 4.0).
- Attribution: "16x16 Town Remix by Lanea Zimmerman, Stephen Challener, Carl Olsson — CC-BY 4.0 — https://opengameart.org/content/16x16-town-remix"
- Dimensions / details: 16×16. Town + castle hybrid tileset (Surt's Town Tiles + Redshrike's RPG Indoor Tileset Expansion + Sharm originals). 4.1 KB sheet — small but dense, designed as a "best-of-three" remix.
- Local path: `assets/chawl-mohalla/tilesets/town-remix-sharm/`
- Modified: planned — palette swap; pick alley + ground + building exterior subset; pair with the Ninja Adventure tileset for street continuity.
- **Why PRIMARY:** clean small ground/wall set that anchors the chawl alley scale; CC-BY 4.0 is acceptable and Sharm is one of the most respected pixel artists in the OSS commons.

### Tileset — sharm-lpc-adobe-building-set (PRIMARY chawl-style facades)
- Source: https://opengameart.org/content/lpc-adobe-building-set
- Author: Lanea "Sharm" Zimmerman
- Licence: CC-BY 4.0 (multi-licensed: CC-BY 4.0 / CC-BY 3.0 / GPL 3.0 / OGA-BY 3.0; we take CC-BY 4.0)
- Attribution: "Adobe Building Set by Lanea Zimmerman (Sharm) — CC-BY 4.0 — https://opengameart.org/content/lpc-adobe-building-set"
- Dimensions / details: LPC-scale (32×32 base, downscale-friendly to 16×16); adobe/clay walls, doors, windows. **Adobe = closest non-Indian analogue to chawl plaster-and-clay facades** — the texture lineage of mud-and-lime walls reads similar.
- Local path: `assets/chawl-mohalla/tilesets/adobe-building-sharm/`
- Modified: planned — heavy recolour to faded saffron + terracotta; add iron-railing balcony overlay (hand-pixel); add chawl-specific window grilles.
- **Why PRIMARY:** the only OSS facade asset whose underlying wall material *resembles* chawl construction (warm clay-plaster) rather than European stone or Japanese wood.

### Tileset — buch-top-down-dungeon (ALTERNATIVE interior layer)
- Source: https://opengameart.org/content/top-down-dungeon-tileset
- Author: Michele "Buch" Bucelli
- Licence: CC-BY 3.0
- Attribution: "Top Down Dungeon Tileset by Michele 'Buch' Bucelli — CC-BY 3.0 — link back to https://opengameart.org/users/buch"
- Dimensions / details: 16×16, zelda-like top-down perspective. Walls, doors, chests, barrels, boxes, boulders. 10,000+ downloads — battle-tested.
- Local path: `assets/chawl-mohalla/tilesets/buch-top-down-dungeon/`
- Modified: planned — use only the interior wall + floor + container pieces for room interior fallback; recolour to cement-grey + faded saffron.

### Tileset — buch-outdoor-tiles-again (ALTERNATIVE outdoor + tree variety)
- Source: https://opengameart.org/content/outdoor-tiles-again
- Author: Michele "Buch" Bucelli
- Licence: CC-BY 3.0
- Attribution: "Outdoor Tiles Again by Michele 'Buch' Bucelli — CC-BY 3.0 — link back to https://opengameart.org/users/buch"
- Dimensions / details: 16×16. Trees, grass, water, paths, signs, chests. Best-when-2x.
- Local path: `assets/chawl-mohalla/tilesets/buch-outdoor/`
- Modified: planned — pick trees + path + sign subset; recolour foliage to dustier monsoon green; combine with KaliYuga plants for the tulsi-pot scene.

### Tileset — 0x72-dungeon-tileset-ii (ALTERNATIVE character + props layer)
- Source: https://0x72.itch.io/dungeontileset-ii
- Author: 0x72
- Licence: CC0 1.0 Universal (verified: "You can use this tileset for whatever you like (CC-0).")
- Attribution: Not required.
- Dimensions / details: 16×16; knight/wizard/goblin/orc/lizard/etc. characters with walk + idle anims; weapons, traps, items, autotile-ready, Godot 1.7 atlas. ~406 KB total.
- Local path: `assets/chawl-mohalla/tilesets/0x72-dungeon-ii/`
- Modified: planned — extract floor/wall fragments that double as interior chawl-room tiling; extract some prop sprites (boxes, barrels, lamps) and recolour.

### Tileset — 0x72-16x16-dungeon-tileset (ALTERNATIVE — small + clean)
- Source: https://0x72.itch.io/16x16-dungeon-tileset
- Author: 0x72
- Licence: CC0 1.0 Universal (verified verbatim: "you can use this tileset in both private and commercial projects… you can distribute both modified and original work… you are not required to credit me")
- Attribution: Not required.
- Dimensions / details: 16×16; 150 KB; walls, floors, doors, corridors, crates, torches, chests, weapons, characters.
- Local path: `assets/chawl-mohalla/tilesets/0x72-dungeon-i/`
- Modified: planned — older/smaller sibling of dungeon-tileset-ii; useful for prototype rooms.

### Tileset — 0x72-industrial (ALTERNATIVE — AC unit / pipe / industrial detail mining)
- Source: https://0x72.itch.io/16x16-industrial-tileset
- Author: 0x72
- Licence: CC0 1.0 Universal (verified: "You can use this tileset for whatever you like (CC-0). Credit is not necessary")
- Attribution: Not required.
- Dimensions / details: 16×16 industrial/sci-fi; pipes, vents, machinery silhouettes.
- Local path: `assets/chawl-mohalla/tilesets/0x72-industrial/`
- Modified: planned — **directly addresses our AC-compressor and pipe-on-wall gap** from Round 1; cull to vents/pipes/compressor-cube primitives; recolour grey/rust.

### Tileset — grafxkid-city-mega-pack (PRIMARY for citizens + city interiors)
- Source: https://opengameart.org/content/city-mega-pack
- Author: GrafxKid
- Licence: CC0 1.0 Universal (verified: "public domain"; author requests credit as "GrafxKid" but not legally required under CC0)
- Attribution: Not required. Courtesy credit: "GrafxKid".
- Dimensions / details: pixel-art city pack — **citizens (people + robots), furniture, foods, city buildings + their interiors, shipping dock**. Console-NES inspired palette.
- Local path: `assets/chawl-mohalla/tilesets/grafxkid-city-mega/`
- Modified: planned — extract the "citizens" subset as additional NPC variants; extract building-interior furniture (table, chairs, fridge, cabinets) for the chawl-room interior. Restyle palette.
- **Why PRIMARY:** the *citizens* subset specifically fills our "more NPC body types" Round-1 gap.

### Tileset — grafxkid-super-seasonal-platformer-tiles (ALTERNATIVE foliage)
- Source: https://opengameart.org/content/super-seasonal-platformer-tiles
- Author: GrafxKid
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 16×16 workspace; 4 seasonal environments (grassland, autumn forest, seaside, winter mountain), water, lava, bubbling oil, assorted blocks.
- Local path: `assets/chawl-mohalla/tilesets/grafxkid-seasonal/`
- Modified: planned — pick grassland tiles for the courtyard patch; cull rest.

### Tileset — grafxkid-roaming-world-sprites (ALTERNATIVE character variety)
- Source: https://opengameart.org/content/roaming-world-sprites
- Author: GrafxKid
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 7 distinct pixel-art characters (astronaut, pirate, robot, dinosaur, alien, sprout, etc.) with directional animations.
- Local path: `assets/chawl-mohalla/npcs/grafxkid-roaming/`
- Modified: planned — none of these read as Indian, but two of the human-silhouettes (pirate, astronaut after costume strip) work as **animation rig donors** for our reskins.

### Tileset — vexed-bountiful-bits (ALTERNATIVE — 1-bit overlay / minimap art)
- Source: https://v3x3d.itch.io/bountiful-bits
- Author: VEXED (v3x3d)
- Licence: CC0 1.0 Universal (verified: "Feel free to use these in commercial projects, and to modify the tiles as you wish.")
- Attribution: Not required.
- Dimensions / details: 10×10 1-bit RPG tiles; pathways, crops, chests, doors, stone walls, barrels, trees, buildings, graves, interiors; v3 added vehicles + modern interiors. 120 KB.
- Local path: `assets/chawl-mohalla/tilesets/bountiful-bits-vexed/`
- Modified: planned — use ONLY for the in-game **minimap rendering** (1-bit lends itself to small overview rendering at 10×10 → easily readable at 20x scale).

### Tileset — vexed-paper-pixels (ALTERNATIVE — UI accent silhouettes)
- Source: https://v3x3d.itch.io/paper-pixels
- Author: VEXED (v3x3d)
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: 8×8 platformer asset pack; CC0; "Simple Platformer — Paper Pixels".
- Local path: `assets/chawl-mohalla/ui/paper-pixels-vexed/`
- Modified: planned — extract small icon-style silhouettes for HUD overlays.

### Tileset — majadroid-tiny-islands (ALTERNATIVE — building expansion tiles)
- Source: https://majadroid.itch.io/tiny-islands-16x16-tilemap
- Author: Majadroid
- Licence: CC0 1.0 Universal (verified verbatim: "The asset pack is free to use, also for commercial projects. Attribution is not required but appreciated." + "No generative AI was used")
- Attribution: Not required.
- Dimensions / details: 16×16 tilemap; island terrain, water with wave animation, expandable buildings (residences, lumberjack, stonecutter, farms, harbor, castle), 8-directional ship, resource icons (wood, stone, wool, tools, coins), UI buttons. 55 KB.
- Local path: `assets/chawl-mohalla/tilesets/tiny-islands-majadroid/`
- Modified: planned — use the **animated water tiles** for our puddle prop; reuse the resource-icon "coins" as a base for the ₹ glyph; use the residence building footprint as a chawl-house base.

### Tileset — 0x72-microfantasy (ALTERNATIVE — small character library)
- Source: https://0x72.itch.io/microfantasy
- Author: 0x72
- Licence: CC0 1.0 Universal (verified: "CC0 license")
- Attribution: Not required.
- Dimensions / details: 8×8 tiles + 12 characters (barbarian, basic, dwarf, guard, knight×4, lizard, monk, oldman, wizard) + 30+ items. JSON frame-duration files included, Tiled example included.
- Local path: `assets/chawl-mohalla/tilesets/microfantasy-0x72/`
- Modified: planned — character silhouettes are too small for our 16×16 baseline but the "oldman" + "guard" pose set is useful as **gesture reference** for Bhola seth + the local constable.

## Round 2 — CHARACTERS (animated)

### NPC — pixelfrog-pixel-adventure (ALTERNATIVE — player movement + UI elements)
- Source: https://pixelfrog-assets.itch.io/pixel-adventure-1
- Author: Pixel Frog
- Licence: CC0 1.0 Universal (verified: "You can distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes. Attribution is not required.")
- Attribution: Not required.
- Dimensions / details: platformer-style characters and tilesets; 20 FPS animations. Already covered in Round-1 plan but re-verified.
- Local path: `assets/chawl-mohalla/npcs/pixel-adventure-pixelfrog/`
- Modified: planned — strip platformer-specific frames (jump, fall) and keep idle/run; reskin as kid-protagonist for the *Drumming Kid* if anon-base reskin proves insufficient.

### NPC — pixelfrog-kings-and-pigs (ALTERNATIVE — dialog box + door UI)
- Source: https://pixelfrog-assets.itch.io/kings-and-pigs
- Author: Pixel Frog
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: **King Human (10 anims), King Pig (8 anims), Pig (24 anims)**, 108-piece tileset, **dialogue boxes**, doors, hearts, life bars, Aseprite source files included. 278 KB.
- Local path: `assets/chawl-mohalla/ui/kings-pigs-pixelfrog/`
- Modified: planned — extract the dialog-box assets (Pixel Frog's are crisp + already designed for in-game text rendering); strip game-specific character art.

### NPC — pixelfrog-treasure-hunters (ALTERNATIVE — wood/paper UI)
- Source: https://pixelfrog-assets.itch.io/treasure-hunters
- Author: Pixel Frog
- Licence: CC0 1.0 Universal (verified verbatim)
- Attribution: Not required.
- Dimensions / details: pirate-themed; **wood and paper-themed UI elements** + characters + tilesets. 1.3 MB.
- Local path: `assets/chawl-mohalla/ui/treasure-hunters-pixelfrog/`
- Modified: planned — extract only the wood/paper UI; great match for the diegetic "torn passbook paper" dialog frame we planned in Round 1.

### NPC — pixelfrog-pirate-bomb (ALTERNATIVE — fallback)
- Source: https://pixelfrog-assets.itch.io/pirate-bomb
- Author: Pixel Frog
- Licence: CC0 1.0 Universal (verified)
- Attribution: Not required.
- Dimensions / details: 1 character + 5 enemies that react to bombs.
- Local path: `assets/chawl-mohalla/npcs/pirate-bomb-pixelfrog/`
- Modified: deprioritised — keep on the bench, not currently integrated.

### NPC — technopeasant-cc0-portraits-collection (REFERENCE pool)
- Source: https://opengameart.org/content/cc0-portraits
- Curator: Technopeasant (collection of multiple CC0 artists)
- Licence: CC0 1.0 Universal (each entry verified at source; see CREDITS.TXT bundled with the collection)
- Attribution: Not required (CC0). The bundled CREDITS.TXT auto-attributes the contributors — keep it alongside.
- Dimensions / details: 200+ portraits, various scales (32×32, 24×32, half-body), includes RPG/fantasy/sci-fi/anime/cartoon/NPC face sets.
- Local path: `assets/chawl-mohalla/npcs/portraits-cc0-pool/`
- Modified: planned — pull the 32×32 pixel-portrait subset for **dialog-bubble character faces**; reskin for our seven named NPCs.

## Round 2 — UI / DIALOG / SPEECH BUBBLES

### UI — parriah-2d-speech-bubbles (PRIMARY speech bubble)
- Source: https://opengameart.org/content/2d-speech-bubbles
- Author: Cagil Ozdemirag (Parriah)
- Licence: CC0 1.0 Universal (verified)
- Attribution: Not required. Optional: "Parriah".
- Dimensions / details: 32×32 large + 24×24 small; 1 set with 3-dot variant; GIMP source + PNG sheets.
- Local path: `assets/chawl-mohalla/ui/speech-bubbles-parriah/`
- Modified: planned — recolour to passbook-paper cream; adjust drop-shadow indigo.

### UI — tokyogeisha-pixel-speech-bubbles (PRIMARY 9-slice tiles)
- Source: https://opengameart.org/content/pixel-speech-bubbles
- Author: TokyoGeisha
- Licence: CC0 1.0 Universal (verified: "Feel free to use it anyway you want. No credit necessary.")
- Attribution: Not required.
- Dimensions / details: 32×32 tile-based; V2 has expanded tile variety for composing speech bubbles modularly. 5.9 KB + 2.5 KB.
- Local path: `assets/chawl-mohalla/ui/speech-bubbles-tokyogeisha/`
- Modified: planned — direct 9-slice candidate; recolour to chai-glass brass border or passbook paper.

### UI — phani29-pixel-art-dialogue-boxes (ALTERNATIVE)
- Source: https://opengameart.org/content/pixel-artdialogue-boxes
- Author: Phani29
- Licence: CC0 1.0 Universal
- Attribution: Not required.
- Dimensions / details: simple Aseprite-made pixel dialog box variants; 1.3 KB.
- Local path: `assets/chawl-mohalla/ui/dialogue-boxes-phani29/`
- Modified: planned — keep as fallback if Parriah + TokyoGeisha don't compose well at our text scale.

### UI — charlesgabriel-10-basic-message-boxes (ALTERNATIVE message-box variety)
- Source: https://opengameart.org/content/10-basic-message-boxes
- Author: CharlesGabriel (with Antifaria credit)
- Licence: CC-BY 3.0 (verified — initially submitted as CC-BY-NC, updated to allow commercial)
- Attribution: "10 Basic Message Boxes by CharlesGabriel — CC-BY 3.0 — https://opengameart.org/content/10-basic-message-boxes"
- Dimensions / details: 10 base message boxes + 12 simple variations as building blocks.
- Local path: `assets/chawl-mohalla/ui/message-boxes-charlesgabriel/`
- Modified: planned — only used if our hand-restyled passbook frame doesn't ship in time.

## Round 2 — FONTS (pixel)

### Font — datagoblin-monogram (PRIMARY pixel UI font, Latin/Cyrillic/Greek)
- Source: https://datagoblin.itch.io/monogram
- Author: datagoblin
- Licence: CC0 1.0 Universal (verified)
- Attribution: Not required.
- Dimensions / details: monospace bitmap pixel font. **TTF + bitmap PNG/JSON + PICO-8 .p8 formats.** Latin (incl. Spanish/Portuguese), Cyrillic (Russian), Greek. Sizes: 10 KB (standard) / 57 KB (extended) / 59 KB (extended italic). Rated 4.9/5 from 249 ratings.
- Local path: `assets/chawl-mohalla/fonts/monogram-datagoblin/`
- Modified: not modified (CC0 + already polished).
- **Why PRIMARY:** the cleanest, smallest, ship-grade pixel UI font on the open commons. CC0 → no attribution debt.

### Font — eishiya-lanapixel (PRIMARY localisation-friendly pixel font)
- Source: https://opengameart.org/content/lanapixel-localization-friendly-pixel-font
- Author: eishiya
- Licence: CC-BY 4.0 / OFL (dual-licensed; OFL preferred for fonts)
- Attribution: "LanaPixel by eishiya — CC-BY 4.0 / OFL 1.1 — https://opengameart.org/content/lanapixel-localization-friendly-pixel-font"
- Dimensions / details: bitmap pixel font designed for localising pixel-art games. **~19,400 glyphs**: Latin, Greek, Cyrillic, Turkish, Korean Hangul, Japanese, Simplified Chinese, partial Traditional Chinese. 3 TTF builds (Everything / BitmapOnly / NoKorean).
- Local path: `assets/chawl-mohalla/fonts/lanapixel-eishiya/`
- Modified: not modified.
- **Critical note:** LanaPixel **does NOT cover Devanagari**. We'd use it for Latin/Cyrillic and pair it with a non-pixel Devanagari OFL fallback (Noto Devanagari / Shobhika / Lohit Devanagari, all from Round-1-or-prior font work + Google Fonts OFL collection). Pixel-perfect Devanagari at our text scale is essentially unsolved in the OSS commons — see gap section.

### Font — pixel-operator (ALTERNATIVE — OFL Latin pixel font)
- Source: https://www.dafont.com/pixel-operator.font (creator distributes via dafont and standalone)
- Author: Jayvee Enaguas (HarvettFox96)
- Licence: SIL Open Font License 1.1
- Attribution: "Pixel Operator © Jayvee Enaguas (HarvettFox96), SIL OFL 1.1"
- Dimensions / details: libre/free raster proportional + monospace sans serif. Latin-only (no Devanagari).
- Local path: `assets/chawl-mohalla/fonts/pixel-operator/`
- Modified: not modified.

### Font — teryror-px-garamond-mono-sans (ALTERNATIVE)
- Source: https://github.com/teryror/pixel-fonts
- Author: teryror (pixel derivatives of Open Sans / EB Garamond / Special Elite)
- Licence: Mixed (derivatives inherit Apache-2.0 for PX Sans; SIL OFL 1.1 for PX Garamond and PX Mono Special)
- Attribution: per-font, see source LICENSE files in repo.
- Dimensions / details: 3 pixel fonts; bitmap derivatives of well-known typefaces. No Devanagari.
- Local path: `assets/chawl-mohalla/fonts/teryror-px/`
- Modified: not modified.

## Round 2 — VEHICLES

### Vehicles — minzinn-pixel-vehicles (ALTERNATIVE — car/bus/taxi layer for street ambience)
- Source: https://minzinn.itch.io/pixelvehicles
- Author: MinZinn
- Licence: CC-BY 4.0 (verified: "Creative Commons Attribution v4.0 International")
- Attribution: "Pixel Vehicles by MinZinn — CC-BY 4.0 — https://minzinn.itch.io/pixelvehicles"
- Dimensions / details: 23 car types × 8 colour variants; 8-directional top-down; 16×16 or 32×32 tile-grid-friendly; animated door-opening on many; 12 fps. Includes pickup truck, cargo van, jeep, bus, taxi, police car — *no bicycles or motorcycles*.
- Local path: `assets/chawl-mohalla/vehicles/minzinn/`
- Modified: planned — pick taxi (yellow→black/yellow Mumbai-style), bus, and a cargo van for the chawl alley head; recolour to dustier palette. Hand-pixel the dabbawala bicycle separately.

## Round 2 — EFFECTS / HUD

### Effects — codemanu-pixelart-effect-pack (PRIMARY VFX)
- Source: https://codemanu.itch.io/pixelart-effect-pack
- Author: Davit Masia (CodeManu)
- Licence: Verified-on-page as Creative Commons Attribution v4.0 International (the page says "public domain… no credit required" but the itch.io metadata + tag is CC-BY 4.0 — treat as CC-BY 4.0 to be safe).
- Attribution: "Pixel Art Effects Pack by Davit Masia (CodeManu) — CC-BY 4.0 — https://codemanu.itch.io/pixelart-effect-pack"
- Dimensions / details: 20 pixel-art effects, 100×100 per frame; explosions, energy bursts, elemental effects. 1.4 MB.
- Local path: `assets/chawl-mohalla/vfx/effects-codemanu/`
- Modified: planned — pick 4 effects (sparkle, dust-puff, coin-collect, light-on); downscale to 32×32 for our scale.

## Round 2 — REJECTED (incompatible licence or quality)

- **LimeZu Modern Interiors / Exteriors (re-verified)** — https://limezu.itch.io/moderninteriors — paid/free both ban redistribution → REJECTED (re-confirmed Round 2; was the ship-grade asset we'd most have wanted).
- **Cainos — Pixel Art Top Down Basic** — https://cainos.itch.io/pixel-art-top-down-basic — "You may not redistribute it or resell it" → REJECTED. (Same wording reappears across other Cainos packs.)
- **Pixel Frog — Tiny Swords** — https://pixelfrog-assets.itch.io/tiny-swords — *unlike Pixel Frog's earlier packs which are CC0*, Tiny Swords reads: "You may not redistribute, resell, or repackage the assets, even if the files are modified." → REJECTED. (Note: this is a Pixel Frog *exception* — their older CC0 packs remain usable.) **Round-3 re-verification (2026-05-14):** the itch.io page still carries the no-redistribution clause. **Tiny Swords is NOT CC0 and must not be bundled with this repo.**
- **Claryu — [16x16] Top-Down City Tileset (GTA-Inspired)** — https://claryu.itch.io/16x16-top-down-city-tileset — "Redistribution of the assets as standalone files is prohibited." → REJECTED. (Excellent quality for chawl-adjacent urban scenes; painful loss.)
- **0x72 — pixeldudesmaker** — https://0x72.itch.io/pixeldudesmaker — custom licence ("…AS LONG AS THE ASSETS ARE NOT USED AS SO CALLED NFTs"). The NFT clause is a content restriction that does not appear in standard CC family; treating as a non-standard licence with redistribution-as-standalone unclear → DEFERRED. *Outputs* of the tool are likely usable but require explicit confirmation from 0x72 if we distribute the tool itself.
- **route1rodent — 16x16 RPG character sprite sheet** — https://route1rodent.itch.io/16x16-rpg-character-sprite-sheet — CC-BY-SA 4.0 → REJECTED (share-alike contaminates).
- **DustDFG — Pixel Art Top Down Tileset** — https://opengameart.org/content/pixel-art-top-down-tileset — CC-BY-SA 4.0 → REJECTED.
- **[LPC] Overworld (BenCreating)** — https://opengameart.org/content/lpc-overworld-0 — CC-BY-SA 3.0 + GPL → REJECTED.
- **NYKNCK — City Pack Top-Down Pixel Art** — https://nyknck.itch.io/citypackpixelart — no formal licence document; creator comments require credit "@nyk_nck" but the page itself carries no canonical licence string → DEFERRED. If we want this we have to email the author and get a written CC-BY confirmation. The quality is excellent (animated buildings, lights, bank, signboards) so worth pursuing if commissioning falls through.
- **Eder Munizz packs (edermunizz)** — https://edermunizz.itch.io/ — itch profile shows mostly paid packs with no visible CC licence indicator; the brief specifically listed this artist as a candidate but the licence is not surfaced on the index page → DEFERRED. Need to re-check each pack page individually if we ever revisit.
- **Anokolisa (re-verified Round 2)** — https://anokolisa.itch.io/free-pixel-art-asset-pack-topdown-tileset-rpg-16x16-sprites — licence is still a Google Doc, not on the itch page → DEFERRED. (Anokolisa is a heavy industry citation though, so if we ever directly contact the artist this might convert.)
- **Sproutsprites / Sprout Lands (ScissorMarks)** — pages 404 at this date; ScissorMarks's storefront URL has shifted. Cannot verify licence on the current canonical page. → DEFERRED.
- **DevanagariPixel (shankarsivarajan)** — https://github.com/shankarsivarajan/DevanagariPixel — GitHub repo has **no LICENSE file** (API returns `"license":null`) and README contains no licence statement → REJECTED for production use. (The font would have been our perfect Devanagari pixel match — the gap remains.)
- **Pixeland / Iorde** — searched but no canonical itch profile surfaced that matched the brief; nothing to verify. Not pursued.
- **Pita (RPG Monster Pack and family)** — https://pita.itch.io/rpg-monster-pack — paid pack, no visible CC; deferred. The "Pita's NPC sprites" in the brief most likely refers to LPC-family contributions which were already rejected in Round 1 (CC-BY-SA).
- **Sara Allen / saralleyne** — no canonical itch profile surfaced; not pursued.

## Round 2 — AI-generated pixel art (assessment)

Investigated as the brief asked. Conclusions:

- **Legal status (USCO 2024 guidance):** raw AI outputs are not protected by copyright. They are also not subject to model-licence claims under current US law. *However*: training-data lineage is contested for some models (SD 1.x notably).
- **Model preference if we go this route:**
  - **Flux Dev** (Apache-2.0 weights) — trained on a curated dataset; safest provenance story among large generative models in 2026.
  - **Stable Diffusion XL Base 1.0** (OpenRAIL-M) — outputs not subject to model licence per text, but training-data provenance is the weakest of the three.
  - **Stable Diffusion 3.5 Medium / Large** (Stability community licence) — readable terms; safer than 1.x.
- **Our recommendation:** *do NOT ship raw AI output.* Use generation only as a **moodboarding / palette-comp** step, then re-pixel by hand. This avoids both the training-data legal grey zone and the "AI smell" that breaks the HD-2D-lite aesthetic. The flex of "every pixel hand-placed" is part of the ship-grade thesis.
- **No AI-generated assets are entered into this manifest.** If at any later point a hand-cleaned derivative is shipped, the entry will explicitly disclose the AI tool used + the hand-clean labour.

## Round 2 — gap statement (post-deep-hunt)

Even after this much deeper hunt, the following remain *unfilled* by the OSS commons under acceptable licences:

1. **Indian chai stall / dabbawala bicycle / tiffin tower** — *still* no CC0/CC-BY asset exists. The closest match (TheStarvingArtificer's market-stalls) remains licence-locked. **Confirmed commission item.**
2. **Saree / kurta / lungi NPC overlays** — *still* not in the OSS commons. Reskin in-house remains the only path. **Confirmed in-house item.**
3. **Pixel-perfect Devanagari font at 8–12 px** — *still* unsolved in OSS. DevanagariPixel is the only known attempt and has no licence. LanaPixel covers 7+ scripts but not Devanagari. Pragmatic fallback: pair LanaPixel (Latin/Cyrillic, OFL) with **non-pixel** Noto Devanagari at a small px-snapped size for Hindi text — accept the visual seam. **Confirmed gap; commission a 12 px Devanagari pixel font if the Hindi-text MVP needs full pixel cohesion.**
4. **Religious-icon corner (interfaith-respectful)** — unchanged; in-house deliberate.
5. **Bicycle pixel asset** — MinZinn's CC-BY 4.0 vehicle pack has 23 car types but **no bicycles**. The dabbawala-bike gap is real. **Confirmed commission/in-house.**

## Audio — pending
*(art-curator will append entries as audio is sourced)*

---

# Round 3 — Ninja Adventure substrate swap (2026-05-14)

> Round-3 acts on the `pixel-2026` brief by adopting Pixel-Boy & AAA's *Ninja Adventure* pack as the shipped substrate. This Round 3 differs from Round 2's *planning* entry by recording the *shipped* download mirror, the exact files placed under `apps/game/public/atlases/ninja-adventure/`, and the composite atlases generated by `scripts/build-ninja-atlases.mjs`.

### Tileset + Characters + HUD + FX — pixel-boy-ninja-adventure (SHIPPED)
- Source URL (the one we actually pulled from): https://github.com/sparklinlabs/superpowers-asset-packs (master branch, `ninja-adventure/` subtree)
- Author: Pixel-Boy & AAA (https://twitter.com/2pblog1)
- Licence: CC0 1.0 Universal
- Mirror provenance: verified CC0 in `superpowers-asset-packs/LICENSE.txt` at the repo root; the original itch.io page (https://pixel-boy.itch.io/ninja-adventure-asset-pack) also states "Creative Commons Zero (CC0)… Attribution is not required but appreciated." Both sources agree.
- Attribution: Not required. Courtesy credit (used in the runtime atlas sidecar): "Pixel-Boy & AAA — Ninja Adventure (CC0)".
- Files placed (subset, ~800 KB after culling music + sounds + monsters):
  - `apps/game/public/atlases/ninja-adventure/characters/*.png` — 25 character spritesheets (64×112 each, 4-direction 4-frame walk) + `dog.png` + `faceset/`.
  - `apps/game/public/atlases/ninja-adventure/background-elements/tileset.png` — 448×640 main outdoor tileset.
  - `apps/game/public/atlases/ninja-adventure/background-elements/{plant,flower,flag,waterfall-*}.gif` — animated foliage / water tiles (held for tile-animation future work).
  - `apps/game/public/atlases/ninja-adventure/background-elements/snow.png` — snow tileset (kept for later seasons).
  - `apps/game/public/atlases/ninja-adventure/hud/{dialogue-bubble,faceset-box,heart,arrow,*-button,kunai,shuriken}.png` — HUD 9-slice + indicators.
  - `apps/game/public/atlases/ninja-adventure/items/*.png` — item icons (coins, treasure chest, food, etc.).
  - `apps/game/public/atlases/ninja-adventure/fx/*.png` + `.gif` — VFX (fire, smoke, sparkle, etc.).
  - `apps/game/public/atlases/ninja-adventure/LICENCE.txt` — verbatim CC0 1.0 from the mirror repo.
  - `apps/game/public/atlases/ninja-adventure/README.md` — verbatim README from the mirror folder.
- Composite atlases (generated by `apps/game/scripts/build-ninja-atlases.mjs`):
  - `apps/game/public/atlases/chawl-tileset-na.png` (256×256, 16×16 grid) — 54 gid slots mapped from the NA outdoor tileset, preserving the existing chawl-greybox gid layout (ground 1-9, walls 10-19, props 20-49, interactives 50-54). No Tiled JSON re-authoring required (β-6 path "b").
  - `apps/game/public/atlases/characters-na.png` (256×256, 16×16 grid) — frame 97 = player (NA char 1, green knight); frames 84-95 = 12 distinct NPC archetypes. Each frame is the row-0 col-0 idle-down crop of an NA character sheet.
- Modifications: only frame extraction + composition into a 256×256 atlas to match our pre-existing greybox layout. No pixel-level edits, no palette swap (warm-Indian palette swap is deferred to a follow-up content pass).
- **Why SHIPPED:** the only single-pack offering ship-grade pixel quality + 4-direction NPC animation in volume + clean CC0 + GitHub mirror provenance. Replaces Kenney Tiny Town (ground) and Tiny Dungeon (characters) as the chawl-mohalla substrate.

### Tileset — kenney-tiny-town / kenney-tiny-dungeon (RETIRED but kept on bench)
- Source: https://kenney.nl/assets/tiny-town , https://kenney.nl/assets/tiny-dungeon
- Status: still CC0, still committed under `apps/game/public/atlases/chawl-tileset.png` and `characters.png` as a fallback if the NA composite ever needs to be swapped out. PreloadScene now points at the `-na.png` variants by default.

### Note on Tiny Swords licence (Round-3 re-verification)
The Pixel Frog "Tiny Swords" pack remains under a no-redistribution licence as of 2026-05-14. *Other* Pixel Frog packs (Pixel Adventure, Kings & Pigs, Treasure Hunters, Pirate Bomb) remain CC0. The blanket assumption "Pixel Frog = CC0" is wrong — verify each pack individually.

