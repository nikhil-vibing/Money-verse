/**
 * Money-verse design tokens — colours and typography.
 *
 * Single source of truth so future scenes never inline a `fontFamily`
 * string again. Adopted from the four-step typography spec in
 * `docs/audit/ui-designer.md` §3.
 *
 * Every UI text node must use one of the four scale steps below. Phaser's
 * `add.bitmapText(x, y, FONT_PIXEL, str, sizePx)` is the canonical call —
 * never `add.text(...)` with a `fontFamily` (that path bilinear-samples
 * vector glyphs and is the root cause of the audit's complaint).
 */
import { FONT_PIXEL } from "../scenes/PreloadScene";

/** Pixel font key, re-exported for ergonomics. */
export const FONT = FONT_PIXEL;

/** Sizes are in pixels — the bitmap font is hand-authored at 7px native. */
export const FONT_SIZE = {
  /** District pill, scene titles. */
  display: 16,
  /** Dialog speaker tag, OBJECTIVE chip, interact-bar verb. */
  heading: 12,
  /** Dialog body lines, objective text, minimap legend. */
  body: 10,
  /** NPC over-head names, footer hints. */
  caption: 8,
} as const;

/** Hex tints (numbers, not strings — Phaser BitmapText uses `.setTint`). */
export const TINT = {
  cream: 0xf5f1ea,
  saffron: 0xf7b733,
  indigo: 0x1a0a26,
  lilac: 0xcdb7d8,
  green: 0x7bd07a,
  warning: 0xf06363,
  muted: 0x8a6aa8,
} as const;

/** Panel palette — these are still raw numbers because round-rects don't tint. */
export const PANEL = {
  fill: 0x1a0a26,
  stroke: 0xf7b733,
} as const;

/**
 * Convenience: build a Phaser BitmapText with a sensible default tint.
 * Most call-sites can just `addPixelText(scene, x, y, "Foo", "body").setTint(TINT.cream)`
 * but the helper saves the boilerplate at scale.
 */
import type * as Phaser from "phaser";

export function addPixelText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  size: keyof typeof FONT_SIZE,
  tint: number = TINT.cream,
): Phaser.GameObjects.BitmapText {
  const node = scene.add.bitmapText(x, y, FONT, text, FONT_SIZE[size]);
  node.setTint(tint);
  return node;
}
