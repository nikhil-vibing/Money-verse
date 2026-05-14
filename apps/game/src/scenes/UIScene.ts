import * as Phaser from "phaser";

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UI" });
  }

  create(): void {
    this.scene.bringToTop();
  }
}
