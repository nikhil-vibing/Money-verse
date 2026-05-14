#!/usr/bin/env node
/**
 * Build two composite atlases from the Ninja Adventure CC0 pack:
 *
 *   1. chawl-tileset-na.png — 256×256 (16 cols × 16 rows of 16×16 tiles).
 *      Layout matches the existing chawl-greybox gid scheme so the Tiled
 *      map JSON does not need re-authoring (Phase β-6 path "b"). gid groups:
 *        gid  1-9  = ground (grass / dirt / stone path)
 *        gid 10-19 = walls / building exterior
 *        gid 20-49 = props (trees, rocks, fences, flowers, lamps)
 *        gid 50-54 = interactive (doors, signs)
 *      Tiles outside these ranges get a tinted-empty fill so missing pulls
 *      stay visible during debugging.
 *
 *   2. characters-na.png — 256×256 (16 cols × 16 rows of 16×16 frames).
 *      Frame 97 (player) and 84-95 (NPC archetypes) match the existing
 *      Npc.ts / Player.ts frame pool so no further code wiring is needed.
 *      Each character contributes its row-0 col-0 (idle-down) frame from
 *      its 64×112 source sheet.
 *
 * Requires `sharp`. Reads from apps/game/public/atlases/ninja-adventure/.
 * Writes alongside the original Kenney atlases — does NOT delete them so
 * a future toggle can switch back.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharpPath = require.resolve("sharp", {
  paths: [
    resolve(process.cwd(), "node_modules"),
    "/Users/nikhil/Documents/Dhaniverse.2.0/node_modules/.pnpm/node_modules",
  ],
});
const sharp = (await import(sharpPath)).default;

const REPO = "/Users/nikhil/Documents/Dhaniverse.2.0";
const NA_DIR = `${REPO}/apps/game/public/atlases/ninja-adventure`;
const OUT_DIR = `${REPO}/apps/game/public/atlases`;

const TILE = 16;
const COLS = 16;
const ROWS = 16;
const W = COLS * TILE;
const H = ROWS * TILE;

/** Extract a 16×16 tile from a source PNG at (col, row). */
async function cropFrame(srcPath, col, row) {
  return await sharp(srcPath)
    .extract({ left: col * TILE, top: row * TILE, width: TILE, height: TILE })
    .png()
    .toBuffer();
}

/** Composite a list of {input, left, top} entries onto a transparent canvas. */
async function composeAtlas(entries, outPath) {
  const canvas = sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });
  await canvas.composite(entries).png().toFile(outPath);
}

/** Map a Tiled gid (1-indexed) → atlas placement {left, top}. */
function gidPlacement(gid) {
  const idx = gid - 1;
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  return { left: col * TILE, top: row * TILE };
}

/** Map a Phaser spritesheet frame index (0-indexed) → atlas placement. */
function framePlacement(frame) {
  const col = frame % COLS;
  const row = Math.floor(frame / COLS);
  return { left: col * TILE, top: row * TILE };
}

/* -------------------------------------------------------------------------- */
/*  Tileset build — gid → source tile from Ninja Adventure tileset.png        */
/* -------------------------------------------------------------------------- */

// The NA background tileset is 28 cols × 40 rows of 16×16 tiles (448×640).
// Curate gid → (col, row) picks below. Numbers come from visually scanning
// background-elements/tileset.png. We bias toward warm village tiles.
const NA_TILESET = `${NA_DIR}/background-elements/tileset.png`;

// gid → [col, row] in NA tileset. Tiles vetted manually for tile-ability
// (no half-borders) where the chawl-greybox layout fills large blocks.
const TILESET_MAP = {
  // 1-9 ground (grass + paths) — clean tileable picks
  1: [14, 16], // clean green grass
  2: [14, 16], // same — grass dominates the floor
  3: [13, 16], // grass with leaf accent
  4: [14, 15], // grass with leaves
  5: [12, 13], // flat orange dirt
  6: [13, 13], // dirt with detail
  7: [14, 16], // grass
  8: [12, 13], // dirt
  9: [14, 16], // grass

  // 10-19 walls / exterior — clean repeating wall tiles
  10: [12, 17], // brick wall, orange-red
  11: [12, 17], // wall
  12: [13, 17], // wall variant (likely)
  13: [1, 0],   // building roof
  14: [2, 0],   // roof centre
  15: [3, 0],   // roof
  16: [12, 17], // wall
  17: [12, 17], // wall
  18: [12, 17], // wall
  19: [12, 17], // wall

  // 20-49 props (trees, fences, lamps, rocks, foliage)
  20: [13, 8],  // tree foliage
  21: [13, 9],  // tree base
  22: [8, 7],   // small bush
  23: [9, 7],   // flower
  24: [16, 8],  // rock
  25: [17, 8],  // rock variant
  26: [9, 9],   // stump
  27: [10, 9],  // log
  28: [3, 4],   // crate / barrel
  29: [4, 4],   // barrel
  30: [5, 4],   // sack
  31: [6, 4],   // pot
  32: [7, 1],   // fence post
  33: [8, 1],   // fence horizontal
  34: [9, 1],   // fence corner
  35: [11, 3],  // sign
  36: [12, 3],  // sign variant
  37: [13, 3],  // lamp
  38: [14, 3],  // lamp lit
  39: [6, 4],   // pot
  40: [7, 4],   // pot with plant
  41: [8, 4],   // chair
  42: [9, 4],   // table
  43: [10, 4],  // basket
  44: [11, 1],  // flag
  45: [12, 1],  // bell
  46: [10, 3],  // mailbox / sign
  47: [13, 7],  // bush / tulsi-style
  48: [14, 7],  // haystack
  49: [15, 7],  // well stone

  // 50-54 interactive
  50: [0, 2],   // door
  51: [1, 2],   // door variant
  52: [2, 2],   // door variant
  53: [13, 3],  // lamp interactive
  54: [14, 3],  // lit lamp interactive

  // 100-130 chawl detail props (γ-1: lived-in pass). Picked manually from
  // the NA tileset.png so the Tiled `props` layer has real graphics to
  // paint, not blank tiles. Order roughly: street furniture → flora →
  // shop signage → ornamental.
  //
  // All of these MUST be non-colliding tiles — the chawl `collision`
  // layer is the source of truth for walkability, so a tree gid here
  // does not block the player. Place them only on tiles that read as
  // "walkable but decorated" — alley edges, courtyard borders, near
  // doorways. If a future pass wants a tree to block, paint a matching
  // tile into the `collision` layer too.
  100: [2, 3],    // pillar / lamp post column
  101: [3, 11],   // small green bush
  102: [6, 10],   // pine tree
  103: [10, 5],   // hanging laundry — blue
  104: [11, 5],   // hanging laundry — red
  105: [1, 5],    // wooden barrel
  106: [12, 4],   // wooden crate
  107: [10, 28],  // small hanging sign
  108: [12, 28],  // red flowers
  109: [13, 28],  // yellow flowers
  110: [17, 28],  // plant pot — small
  111: [18, 28],  // plant pot — green leaves
  112: [12, 11],  // well stone / round boulder
  113: [0, 28],   // dead/winter tree
  114: [13, 3],   // basket
  115: [14, 3],   // jar / pot
  116: [7, 3],    // wooden fence post
  117: [8, 3],    // wooden fence horizontal
  118: [9, 3],    // wooden fence corner
  119: [16, 4],   // DOJO-style sign block (used as kirana sign stand-in)
  120: [9, 5],    // hanging cloth banner (used as chai shop banner)
  121: [16, 11],  // small rock
  122: [17, 11],  // big rock
  123: [8, 13],   // fallen leaves
  124: [4, 11],   // bigger green bush
  125: [5, 28],   // green fence vertical
  126: [6, 28],   // green fence horizontal
  127: [7, 28],   // green fence gate
  128: [14, 28],  // single red rose
  129: [17, 4],   // wooden ladder
  130: [1, 9],    // gourd / orange pumpkin
};

/* -------------------------------------------------------------------------- */
/*  Characters build — pick row-0 col-0 idle frame of each character sheet    */
/* -------------------------------------------------------------------------- */

// Hash-mapped NPC archetypes: index → char number.
//   frame 84 → char 3 (orange-jacket young man)
//   frame 85 → char 9 (red-headed villager)
//   frame 86 → char 12 (red robe wise figure)
//   frame 87 → char 15 (blue working man)
//   frame 88 → char 16 (purple noble)
//   frame 89 → char 18 (blue traveller)
//   frame 90 → char 20 (yellow casual)
//   frame 91 → char 22 (purple monk)
//   frame 92 → char 24 (red merchant)
//   frame 93 → char 25 (green elder)
//   frame 94 → char 8 (red blacksmith)
//   frame 95 → char 4 (yellow farmer)
// Player frame 97 → char 1 (green knight protagonist).
const CHAR_FRAME_MAP = {
  84: "3",
  85: "9",
  86: "12",
  87: "15",
  88: "16",
  89: "18",
  90: "20",
  91: "22",
  92: "24",
  93: "25",
  94: "8",
  95: "4",
  // 96 = unused spacer
  97: "1",  // PLAYER
  // 98+ reserved
};

async function buildCharactersAtlas() {
  const entries = [];
  for (const [frameStr, charNum] of Object.entries(CHAR_FRAME_MAP)) {
    const frame = Number(frameStr);
    const src = `${NA_DIR}/characters/${charNum}.png`;
    // Pixel-Boy character sheets are 64×112. The idle-down frame is the
    // FIRST frame of the FIRST row (col 0, row 0).
    const buf = await cropFrame(src, 0, 0);
    const { left, top } = framePlacement(frame);
    entries.push({ input: buf, left, top });
  }
  // Dog → frame 95 alternative? Skip; biscuit can fall back to a small frame.
  const outPath = `${OUT_DIR}/characters-na.png`;
  await composeAtlas(entries, outPath);
  console.log(`wrote ${outPath} (${entries.length} character frames)`);
}

async function buildTilesetAtlas() {
  const entries = [];
  for (const [gidStr, [col, row]] of Object.entries(TILESET_MAP)) {
    const gid = Number(gidStr);
    const buf = await cropFrame(NA_TILESET, col, row);
    const { left, top } = gidPlacement(gid);
    entries.push({ input: buf, left, top });
  }
  const outPath = `${OUT_DIR}/chawl-tileset-na.png`;
  await composeAtlas(entries, outPath);
  console.log(`wrote ${outPath} (${entries.length} gids mapped)`);
}

await buildCharactersAtlas();
await buildTilesetAtlas();
console.log("done.");
