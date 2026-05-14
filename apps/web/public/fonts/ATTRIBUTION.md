# Runtime pixel fonts — attribution

Phaser loads `.fnt` + `.png` BMFont pairs from this directory at boot. Every
font here is CC0 (public domain) — the game's UI typography has zero
external licence obligations.

## chawl-pixel-8

- Source: hand-authored in `apps/game/scripts/build-pixel-font.mjs`
- Author: Money-verse
- Licence: CC0 1.0 Universal — see `LICENCE.txt`
- Attribution: not required
- Build: `pnpm --filter @money-verse/game predev` (or `prebuild`) emits the
  atlas + descriptor deterministically. Re-running the script overwrites
  the existing files.
- Coverage: 95 printable ASCII glyphs (codepoints 32–126) plus the Indian
  Rupee sign `₹`. 5px wide, 7px tall, 9px line-height.
- Why we ship our own: per the UI audit (`docs/audit/ui-designer.md`)
  the root cause of the "names look pixelated, not immersive" complaint
  was bilinear sampling of vector fonts at 6px through a 3x camera zoom.
  Bitmap fonts side-step that pipeline. Authoring a font we own removes
  every external-licence risk and lets the atlas re-derive at build time.
