import * as Phaser from "phaser";

interface WorldSceneData {
  districtId: string;
}

export class WorldScene extends Phaser.Scene {
  private districtId = "chawl-mohalla";

  constructor() {
    super({ key: "World" });
  }

  init(data: WorldSceneData): void {
    this.districtId = data.districtId ?? "chawl-mohalla";
  }

  create(): void {
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        `Dhaniverse 2.0\n— ${this.districtId} —`,
        {
          fontSize: "20px",
          color: "#f5f1ea",
          align: "center",
          fontFamily: "monospace",
        },
      )
      .setOrigin(0.5);
  }
}
