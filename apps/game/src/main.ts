import * as Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { WorldScene } from "./scenes/WorldScene";
import { UIScene } from "./scenes/UIScene";
import { DialogScene } from "./scenes/DialogScene";
import { detectPerfTier } from "./pipelines/PostFxStack";

const tier = detectPerfTier();

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  parent: "game-root",
  backgroundColor: "#0a0612",
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
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
  scene: [BootScene, PreloadScene, WorldScene, UIScene, DialogScene],
};

new Phaser.Game(config);
