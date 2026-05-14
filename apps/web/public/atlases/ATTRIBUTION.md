# Game runtime atlases — attribution

These atlases are loaded by the Phaser game at runtime from `/atlases/*`.

## Active atlases (loaded by `PreloadScene`)

- `chawl-tileset-na.png` and `characters-na.png` — composite atlases built
  from the **Ninja Adventure** pack (Pixel-Boy & AAA, CC0). Full provenance
  in `ninja-adventure/ATTRIBUTION.md`.

The Kenney atlases below are kept on the bench in case the NA composite
ever needs to be retired, but `PreloadScene` no longer loads them.

## chawl-tileset.png

- **Source pack:** Kenney "Tiny Town" v1.1 (2023-01-11)
- **Source URL:** https://kenney.nl/assets/tiny-town
- **Download URL:** https://kenney.nl/media/pages/assets/tiny-town/5e46f9e551-1735736916/kenney_tiny-town.zip
- **File of origin:** `Tilemap/tilemap_packed.png` (192×176, 12×11 grid, 16×16 tiles, 0-px spacing)
- **Author:** Kenney (kenney.nl)
- **Licence:** CC0 1.0 Universal — see `LICENCE.txt`.
- **Attribution:** Not required. Optional courtesy: "Kenney.nl".
- **Date pulled:** 2026-05-14
- **Modifications:** Renamed from `tilemap_packed.png` to `chawl-tileset.png`. Otherwise unmodified — palette swap to terracotta/saffron/indigo is **deferred to a follow-up PR**.

Tile catalogue (selected indices used by the tilemap):
- 00–05  grass + grass corners
- 12–13  dirt/path tiles
- 24–28  fences / hedges
- 36–48  building roofs + walls
- 60–72  doors, windows, shop fronts
- 96–104 props (signs, lanterns, barrels)

## characters.png

- **Source pack:** Kenney "Tiny Dungeon" (2022-07-05)
- **Source URL:** https://kenney.nl/assets/tiny-dungeon
- **Download URL:** https://kenney.nl/media/pages/assets/tiny-dungeon/b56d7a13e3-1674742415/kenney_tiny-dungeon.zip
- **File of origin:** `Tilemap/tilemap_packed.png` (192×176, 12×11 grid, 16×16 tiles, 0-px spacing)
- **Author:** Kenney (kenney.nl)
- **Licence:** CC0 1.0 Universal — see `LICENCE.txt`.
- **Attribution:** Not required.
- **Date pulled:** 2026-05-14
- **Modifications:** Used as character spritesheet. Indices ~84–120 are humanoid silhouettes used for NPC rendering. This is a placeholder character set — Indian-context reskin is deferred.

## Honest gap

These are Kenney's *generic European* village & dungeon palettes — not Indian-chawl-flavoured. They are the proven CC0 substitute that ship today. The cultural-authenticity gap that the curator round-2 flagged is unchanged; the chawl-specific reskin is a separate body of work (see `assets/chawl-mohalla/ASSET_PLAN.md` §B.5 and §B.7).
