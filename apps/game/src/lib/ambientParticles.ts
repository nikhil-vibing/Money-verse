import * as Phaser from "phaser";
import { detectPerfTier } from "../pipelines/PostFxStack";

const PARTICLE_TEXTURE_KEY = "ambient-dust-mote";
const PARTICLE_SIZE_PX = 2;
const PARTICLE_DEPTH = 80;
const MAX_PARTICLE_BUDGET = 40;
const PARTICLE_MEDIUM_BUDGET = 30;
const PARTICLE_LIFESPAN_MIN_MS = 4000;
const PARTICLE_LIFESPAN_MAX_MS = 8000;
const PARTICLE_SPEED_MIN = 4;
const PARTICLE_SPEED_MAX = 12;
const PARTICLE_GRAVITY_Y = -2;
const PARTICLE_ALPHA = 0.4;
const PARTICLE_DUST_COLOR = 0xf6e6c5;

/**
 * Generate a tiny 2×2 dust-mote texture with soft alpha falloff if it does
 * not exist yet. Reused across districts; pixelArt-safe.
 */
function ensureParticleTexture(scene: Phaser.Scene): void {
  if (scene.textures.exists(PARTICLE_TEXTURE_KEY)) return;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(PARTICLE_DUST_COLOR, 1);
  g.fillRect(0, 0, PARTICLE_SIZE_PX, PARTICLE_SIZE_PX);
  g.generateTexture(PARTICLE_TEXTURE_KEY, PARTICLE_SIZE_PX, PARTICLE_SIZE_PX);
  g.destroy();
}

/**
 * Attach a low-budget ambient dust-mote layer that drifts upward across the
 * world. Total alive cap = MAX_PARTICLE_BUDGET. Low-tier devices get nothing
 * (returns the no-op cleanup function) so we never blow the frame budget.
 */
export function attachAmbientParticles(
  scene: Phaser.Scene,
  worldWidthPx: number,
  worldHeightPx: number,
): () => void {
  const tier = detectPerfTier();
  if (tier === "low") return () => {};

  ensureParticleTexture(scene);

  const quantity = tier === "high"
    ? MAX_PARTICLE_BUDGET
    : PARTICLE_MEDIUM_BUDGET;

  // Spawn rate: spread emission across particle lifespan so we converge near
  // the budget cap without bursting. ~lifespan / quantity ms apart.
  const frequency = Math.max(
    100,
    Math.floor(PARTICLE_LIFESPAN_MAX_MS / quantity),
  );

  const emitter = scene.add.particles(0, 0, PARTICLE_TEXTURE_KEY, {
    x: { min: 0, max: worldWidthPx },
    y: { min: 0, max: worldHeightPx },
    lifespan: { min: PARTICLE_LIFESPAN_MIN_MS, max: PARTICLE_LIFESPAN_MAX_MS },
    speed: { min: PARTICLE_SPEED_MIN, max: PARTICLE_SPEED_MAX },
    gravityY: PARTICLE_GRAVITY_Y,
    alpha: { start: 0, end: PARTICLE_ALPHA, ease: "Sine.InOut" },
    scale: { min: 1, max: 1.5 },
    quantity: 1,
    frequency,
    maxAliveParticles: quantity,
    blendMode: Phaser.BlendModes.NORMAL,
  });
  emitter.setDepth(PARTICLE_DEPTH);
  emitter.setScrollFactor(1);

  return () => {
    emitter.destroy();
  };
}
