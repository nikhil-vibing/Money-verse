#!/usr/bin/env node
/**
 * build-pixel-font.mjs — emit a CC0 pixel BMFont (.fnt + .png) at predev/prebuild.
 *
 * Ninja Money-verse ships its OWN pixel font ("Chawl Pixel 8") so we can guarantee:
 *   1. CC0 provenance — every glyph below is hand-authored by Ninja Money-verse
 *      and dedicated to the public domain. No external licence to track.
 *   2. Pixel-perfect alignment at 3x camera zoom — the audit's root-cause
 *      complaint ("names look pixelated too, not immersive") is bilinear
 *      sampling of vector glyphs at 6px. Bitmap fonts side-step that.
 *   3. Reproducibility — the font is *built* not committed-as-binary, so
 *      every checkout re-derives the .png/.fnt deterministically.
 *
 * Output:
 *   apps/game/public/fonts/chawl-pixel-8.png   — packed glyph atlas
 *   apps/game/public/fonts/chawl-pixel-8.fnt   — AngelCode BMFont XML
 *
 * Loaded in Phaser via:
 *   this.load.bitmapFont('chawl-pixel-8', '/fonts/chawl-pixel-8.png', '/fonts/chawl-pixel-8.fnt');
 *
 * Glyph format: each printable ASCII char (32-126) is a 5x7 pixel grid
 * stored as 7 strings of 5 chars where '#' is on and '.' is off. The
 * packer rasterises them onto a 128x128 transparent PNG with 1px gutter,
 * then writes the AngelCode XML referencing pixel rects.
 *
 * The "8" in the name refers to the grid cell (5px glyph + 1px right
 * advance + 2px line-height pad) — i.e. line-height is 8px when stacked
 * with one descender row. This matches the UI audit's "caption" token.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "./png-encoder.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..", "..");
const OUT_DIRS = [
  resolve(repoRoot, "apps/game/public/fonts"),
  resolve(repoRoot, "apps/web/public/fonts"),
];

const GLYPH_W = 5;
const GLYPH_H = 7;
const LINE_HEIGHT = 9;
const BASELINE = 7;
const ATLAS_W = 128;
const ATLAS_H = 96;
const PAD = 1;

/**
 * Hand-authored 5x7 pixel glyphs. Each entry maps a printable ASCII
 * character (decimal codepoint) to seven 5-char rows. '#' = pixel on.
 *
 * Coverage: 32-126 (95 printable ASCII chars), plus a placeholder
 * (codepoint 0) used as a fallback. The set is intentionally compact —
 * Ninja Money-verse UI text is all ASCII (Hinglish transliterated). For
 * Devanagari we use an HTML aria-live layer (see lib/announce.ts).
 */
const GLYPHS = {
  // Space + punctuation row 1
  32: [".....", ".....", ".....", ".....", ".....", ".....", "....."],          // ' '
  33: ["..#..", "..#..", "..#..", "..#..", ".....", "..#..", "....."],          // '!'
  34: [".#.#.", ".#.#.", ".....", ".....", ".....", ".....", "....."],          // '"'
  35: [".#.#.", ".#.#.", "#####", ".#.#.", "#####", ".#.#.", ".#.#."],          // '#'
  36: ["..#..", ".####", "#.#..", ".###.", "..#.#", "####.", "..#.."],          // '$'
  37: ["##...", "##..#", "...#.", "..#..", ".#..#", "#..##", "...##"],          // '%'
  38: [".##..", "#..#.", "#.#..", ".#...", "#.#.#", "#..#.", ".##.#"],          // '&'
  39: ["..#..", "..#..", ".....", ".....", ".....", ".....", "....."],          // '\''
  40: ["...#.", "..#..", ".#...", ".#...", ".#...", "..#..", "...#."],          // '('
  41: [".#...", "..#..", "...#.", "...#.", "...#.", "..#..", ".#..."],          // ')'
  42: [".....", ".#.#.", "..#..", "#####", "..#..", ".#.#.", "....."],          // '*'
  43: [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],          // '+'
  44: [".....", ".....", ".....", ".....", "..#..", "..#..", ".#..."],          // ','
  45: [".....", ".....", ".....", "#####", ".....", ".....", "....."],          // '-'
  46: [".....", ".....", ".....", ".....", ".....", "..#..", "....."],          // '.'
  47: ["....#", "...#.", "...#.", "..#..", ".#...", ".#...", "#...."],          // '/'

  // Digits
  48: [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],          // '0'
  49: ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],          // '1'
  50: [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],          // '2'
  51: ["#####", "...#.", "..#..", "...#.", "....#", "#...#", ".###."],          // '3'
  52: ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],          // '4'
  53: ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],          // '5'
  54: ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],          // '6'
  55: ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],          // '7'
  56: [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],          // '8'
  57: [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],          // '9'

  58: [".....", "..#..", ".....", ".....", "..#..", ".....", "....."],          // ':'
  59: [".....", "..#..", ".....", ".....", "..#..", "..#..", ".#..."],          // ';'
  60: ["....#", "...#.", "..#..", ".#...", "..#..", "...#.", "....#"],          // '<'
  61: [".....", ".....", "#####", ".....", "#####", ".....", "....."],          // '='
  62: ["#....", ".#...", "..#..", "...#.", "..#..", ".#...", "#...."],          // '>'
  63: [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],          // '?'
  64: [".###.", "#...#", "#.###", "#.#.#", "#.###", "#....", ".###."],          // '@'

  // Uppercase
  65: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],          // 'A'
  66: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],          // 'B'
  67: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],          // 'C'
  68: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],          // 'D'
  69: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],          // 'E'
  70: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],          // 'F'
  71: [".###.", "#...#", "#....", "#..##", "#...#", "#...#", ".###."],          // 'G'
  72: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],          // 'H'
  73: [".###.", "..#..", "..#..", "..#..", "..#..", "..#..", ".###."],          // 'I'
  74: ["....#", "....#", "....#", "....#", "....#", "#...#", ".###."],          // 'J'
  75: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],          // 'K'
  76: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],          // 'L'
  77: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],          // 'M'
  78: ["#...#", "#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#"],          // 'N'
  79: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],          // 'O'
  80: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],          // 'P'
  81: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],          // 'Q'
  82: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],          // 'R'
  83: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],          // 'S'
  84: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],          // 'T'
  85: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],          // 'U'
  86: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],          // 'V'
  87: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],          // 'W'
  88: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],          // 'X'
  89: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],          // 'Y'
  90: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],          // 'Z'

  91: [".###.", ".#...", ".#...", ".#...", ".#...", ".#...", ".###."],          // '['
  92: ["#....", ".#...", ".#...", "..#..", "...#.", "...#.", "....#"],          // '\\'
  93: [".###.", "...#.", "...#.", "...#.", "...#.", "...#.", ".###."],          // ']'
  94: ["..#..", ".#.#.", "#...#", ".....", ".....", ".....", "....."],          // '^'
  95: [".....", ".....", ".....", ".....", ".....", ".....", "#####"],          // '_'
  96: [".#...", "..#..", "...#.", ".....", ".....", ".....", "....."],          // '`'

  // Lowercase
  97:  [".....", ".....", ".###.", "....#", ".####", "#...#", ".####"],         // 'a'
  98:  ["#....", "#....", "####.", "#...#", "#...#", "#...#", "####."],         // 'b'
  99:  [".....", ".....", ".###.", "#....", "#....", "#...#", ".###."],         // 'c'
  100: ["....#", "....#", ".####", "#...#", "#...#", "#...#", ".####"],         // 'd'
  101: [".....", ".....", ".###.", "#...#", "#####", "#....", ".###."],         // 'e'
  102: ["..##.", ".#..#", ".#...", "####.", ".#...", ".#...", ".#..."],         // 'f'
  103: [".....", ".####", "#...#", "#...#", ".####", "....#", ".###."],         // 'g'
  104: ["#....", "#....", "####.", "#...#", "#...#", "#...#", "#...#"],         // 'h'
  105: ["..#..", ".....", "..#..", "..#..", "..#..", "..#..", "..#.."],         // 'i'
  106: ["...#.", ".....", "...#.", "...#.", "...#.", "#..#.", ".##.."],         // 'j'
  107: ["#....", "#....", "#..#.", "#.#..", "##...", "#.#..", "#..#."],         // 'k'
  108: ["..#..", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],         // 'l'
  109: [".....", ".....", "##.#.", "#.#.#", "#.#.#", "#...#", "#...#"],         // 'm'
  110: [".....", ".....", "####.", "#...#", "#...#", "#...#", "#...#"],         // 'n'
  111: [".....", ".....", ".###.", "#...#", "#...#", "#...#", ".###."],         // 'o'
  112: [".....", ".....", "####.", "#...#", "####.", "#....", "#...."],         // 'p'
  113: [".....", ".....", ".####", "#...#", ".####", "....#", "....#"],         // 'q'
  114: [".....", ".....", "#.##.", "##..#", "#....", "#....", "#...."],         // 'r'
  115: [".....", ".....", ".####", "#....", ".###.", "....#", "####."],         // 's'
  116: [".#...", ".#...", "####.", ".#...", ".#...", ".#..#", "..##."],         // 't'
  117: [".....", ".....", "#...#", "#...#", "#...#", "#...#", ".####"],         // 'u'
  118: [".....", ".....", "#...#", "#...#", ".#.#.", ".#.#.", "..#.."],         // 'v'
  119: [".....", ".....", "#...#", "#.#.#", "#.#.#", "#.#.#", ".#.#."],         // 'w'
  120: [".....", ".....", "#...#", ".#.#.", "..#..", ".#.#.", "#...#"],         // 'x'
  121: [".....", ".....", "#...#", "#...#", ".####", "....#", ".###."],         // 'y'
  122: [".....", ".....", "#####", "...#.", "..#..", ".#...", "#####"],         // 'z'

  123: ["..##.", ".#...", ".#...", "##...", ".#...", ".#...", "..##."],         // '{'
  124: ["..#..", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],         // '|'
  125: [".##..", "...#.", "...#.", "...##", "...#.", "...#.", ".##.."],         // '}'
  126: [".....", ".....", ".#..#", "#.#.#", "#..#.", ".....", "....."],         // '~'

  // ₹ — Indian Rupee sign at U+20B9. Outside ASCII; we expose as id 8377.
  // The canonical shape: top bar, middle bar, diagonal stem on lower-right.
  // Authored to read cleanly at 5x7 even at 1:1 native res.
  8377: ["#####", "#...#", "####.", "##...", "#.#..", "#..#.", "#...#"],
};

/* -------------------------------------------------------------------- */
/*  Atlas packing                                                       */
/* -------------------------------------------------------------------- */

function packGlyphs() {
  const cellW = GLYPH_W + PAD * 2;
  const cellH = GLYPH_H + PAD * 2;
  const cols = Math.floor(ATLAS_W / cellW);
  const placements = [];
  let i = 0;
  for (const codepoint of Object.keys(GLYPHS)) {
    const c = Number(codepoint);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellW + PAD;
    const y = row * cellH + PAD;
    if (y + GLYPH_H >= ATLAS_H) {
      throw new Error(`Atlas overflow at codepoint ${c}; bump ATLAS_H`);
    }
    placements.push({ codepoint: c, x, y });
    i += 1;
  }
  return placements;
}

/**
 * Rasterise the glyph grid into a PNG buffer. Each '#' becomes an opaque
 * white pixel (0xFFFFFFFF). Phaser tints the bitmap to whatever colour
 * the caller wants via `.setTint()` — so we render in pure white.
 */
function rasterise(placements) {
  const png = new PNG(ATLAS_W, ATLAS_H);
  for (const { codepoint, x, y } of placements) {
    const grid = GLYPHS[codepoint];
    if (grid === undefined) continue;
    for (let row = 0; row < GLYPH_H; row += 1) {
      const line = grid[row] ?? "";
      for (let col = 0; col < GLYPH_W; col += 1) {
        if (line[col] === "#") {
          png.setPixel(x + col, y + row, 255, 255, 255, 255);
        }
      }
    }
  }
  return png.encode();
}

/**
 * Emit AngelCode BMFont XML. Phaser parses both .fnt-XML and .fnt-text;
 * we use XML because Phaser's parser is well-tested against it.
 */
function buildFntXml(placements) {
  const lines = [];
  lines.push('<?xml version="1.0"?>');
  lines.push("<font>");
  lines.push(
    `<info face="ChawlPixel" size="${GLYPH_H}" bold="0" italic="0" charset="" unicode="1" stretchH="100" smooth="0" aa="1" padding="0,0,0,0" spacing="1,1"/>`,
  );
  lines.push(
    `<common lineHeight="${LINE_HEIGHT}" base="${BASELINE}" scaleW="${ATLAS_W}" scaleH="${ATLAS_H}" pages="1" packed="0"/>`,
  );
  lines.push('<pages>');
  lines.push('  <page id="0" file="chawl-pixel-8.png"/>');
  lines.push('</pages>');
  lines.push(`<chars count="${placements.length}">`);
  for (const { codepoint, x, y } of placements) {
    const xadvance = GLYPH_W + 1; // 1-px right gutter so glyphs don't kiss
    lines.push(
      `  <char id="${codepoint}" x="${x}" y="${y}" width="${GLYPH_W}" height="${GLYPH_H}" xoffset="0" yoffset="0" xadvance="${xadvance}" page="0" chnl="15"/>`,
    );
  }
  lines.push("</chars>");
  lines.push("<kernings count=\"0\"/>");
  lines.push("</font>");
  return lines.join("\n");
}

async function main() {
  const placements = packGlyphs();
  const pngBytes = rasterise(placements);
  const fntXml = buildFntXml(placements);

  for (const dir of OUT_DIRS) {
    await mkdir(dir, { recursive: true });
    await writeFile(resolve(dir, "chawl-pixel-8.png"), pngBytes);
    await writeFile(resolve(dir, "chawl-pixel-8.fnt"), fntXml);
  }
  console.log(
    `[build-pixel-font] wrote chawl-pixel-8.{png,fnt} (${placements.length} glyphs) to ${OUT_DIRS.length} target(s)`,
  );
}

main().catch((err) => {
  console.error("[build-pixel-font] failed:", err);
  process.exit(1);
});
