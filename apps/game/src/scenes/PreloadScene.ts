import * as Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "Preload" });
  }

  preload(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const bar = this.add.rectangle(width / 2, height / 2, 320, 6, 0xf7b733);
    bar.scaleX = 0;

    this.load.on("progress", (value: number) => {
      bar.scaleX = value;
    });

    this.load.on("complete", () => {
      this.scene.start("World", { districtId: "chawl-mohalla" });
      this.scene.launch("UI");
    });
  }

  create(): void {}
}
