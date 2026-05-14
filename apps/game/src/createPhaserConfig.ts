import * as Phaser from "phaser";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { BootScene } from "./scenes/BootScene";
import { WelcomeScene } from "./scenes/WelcomeScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { WorldScene } from "./scenes/WorldScene";
import { UIScene } from "./scenes/UIScene";
import { DialogScene } from "./scenes/DialogScene";
import { EnvelopeScene } from "./scenes/EnvelopeScene";
import { detectPerfTier } from "./pipelines/PostFxStack";

export interface CreatePhaserConfigOptions {
  readonly parent: HTMLElement | string | undefined;
}

/**
 * Build the canonical Phaser.Game config used by every entry point.
 *
 * Both the standalone game (`apps/game/src/main.ts`) and the Next.js mount
 * (`apps/web/app/play/GameMount.tsx`) call this helper so the engine config
 * (physics, scenes, render settings) cannot drift between embeddings.
 */
export function createPhaserConfig(
  options: CreatePhaserConfigOptions,
): Phaser.Types.Core.GameConfig {
  const tier = detectPerfTier();
  const width = typeof window === "undefined" ? 1280 : window.innerWidth;
  const height = typeof window === "undefined" ? 720 : window.innerHeight;

  return {
    type: Phaser.WEBGL,
    parent: options.parent,
    backgroundColor: "#0a0612",
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width,
      height,
    },
    physics: {
      default: "arcade",
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    fps: {
      target: tier === "low" ? 30 : 60,
      forceSetTimeOut: false,
    },
    render: {
      pixelArt: true,
      antialias: false,
      powerPreference: tier === "low" ? "low-power" : "high-performance",
    },
    plugins: {
      scene: [{ key: "rexUI", plugin: UIPlugin, mapping: "rexUI" }],
    },
    scene: [
      BootScene,
      WelcomeScene,
      PreloadScene,
      WorldScene,
      UIScene,
      DialogScene,
      EnvelopeScene,
    ],
  };
}
