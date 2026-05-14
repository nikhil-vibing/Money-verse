import * as Phaser from "phaser";
import { detectPerfTier, type PerfTier } from "../pipelines/PostFxStack";

const SHADOW_OFFSET_X = 0;
const SHADOW_OFFSET_Y = 2;
const SHADOW_DECAY = 0.1;
const SHADOW_POWER = 1;
const SHADOW_COLOR = 0x000000;
const SHADOW_INTENSITY = 0.5;
const SAMPLES_MEDIUM = 6;
const SAMPLES_LOW = 3;

type ShadowCapable = Phaser.GameObjects.GameObject & {
  readonly preFX?: {
    readonly addShadow: (
      x: number,
      y: number,
      decay: number,
      power: number,
      color: number,
      samples: number,
      intensity: number,
    ) => unknown;
  } | null;
};

/**
 * Add a soft Coral-Island-style preFX drop shadow to a sprite. Caller may
 * pass an explicit `tier`; otherwise we detect it. Returns true on success,
 * false when the renderer does not expose preFX (older Phaser builds) or
 * the perf tier is "low".
 */
export function addDropShadow(
  sprite: ShadowCapable,
  tier: PerfTier = detectPerfTier(),
): boolean {
  if (tier === "low") return false;
  const preFx = sprite.preFX;
  if (preFx === null || preFx === undefined) return false;
  const samples = tier === "high" ? SAMPLES_MEDIUM : SAMPLES_LOW;
  preFx.addShadow(
    SHADOW_OFFSET_X,
    SHADOW_OFFSET_Y,
    SHADOW_DECAY,
    SHADOW_POWER,
    SHADOW_COLOR,
    samples,
    SHADOW_INTENSITY,
  );
  return true;
}
