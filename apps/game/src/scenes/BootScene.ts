import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload(): void {
    this.load.json("manifest", "/manifest.json");
  }

  create(): void {
    this.scene.start("Preload");
  }
}
