import * as Phaser from "phaser";
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext.js";

const STARFIELD_TEXTURE_KEY = "welcome-star-dot";
const STARFIELD_PARTICLE_COUNT = 60;
const TITLE_TEXT =
  "[stroke=#1a0a26][shadow=#f7b73388]Money[/shadow][/stroke] [color=#f7b733][i]·verse[/i][/color]";
const SUBTITLE = "Money, as an adventure.";
const PRESS_PROMPT = "Press any key to begin";

export class WelcomeScene extends Phaser.Scene {
  constructor() {
    super({ key: "Welcome" });
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    this.cameras.main.setBackgroundColor(0x0a0612);

    this.ensureDotTexture();
    this.spawnStarfield(width, height);

    const title = new BBCodeText(this, width / 2, height * 0.38, TITLE_TEXT, {
      fontSize: "72px",
      fontFamily: "serif",
      color: "#f5f1ea",
      align: "center",
    });
    title.setOrigin(0.5);
    this.add.existing(title);

    const subtitle = this.add
      .text(width / 2, height * 0.5, SUBTITLE, {
        fontSize: "20px",
        color: "#f7b733",
        fontFamily: "serif",
        fontStyle: "italic",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const prompt = this.add
      .text(width / 2, height * 0.78, PRESS_PROMPT, {
        fontSize: "14px",
        color: "#f5f1ea",
        fontFamily: "monospace",
      })
      .setOrigin(0.5)
      .setAlpha(0.6);

    this.tweens.add({
      targets: title,
      alpha: { from: 0, to: 1 },
      duration: 900,
      ease: "Sine.easeOut",
    });
    this.tweens.add({
      targets: subtitle,
      alpha: { from: 0, to: 1 },
      duration: 700,
      delay: 600,
      ease: "Sine.easeOut",
    });
    this.tweens.add({
      targets: prompt,
      alpha: { from: 0.3, to: 0.9 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    const advance = () => this.scene.start("Preload");
    this.input.keyboard?.once("keydown", advance);
    this.input.once("pointerdown", advance);
  }

  private ensureDotTexture(): void {
    if (this.textures.exists(STARFIELD_TEXTURE_KEY)) return;
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xfdd99a, 1);
    g.fillRect(0, 0, 2, 2);
    g.generateTexture(STARFIELD_TEXTURE_KEY, 2, 2);
    g.destroy();
  }

  private spawnStarfield(width: number, height: number): void {
    this.add
      .particles(0, 0, STARFIELD_TEXTURE_KEY, {
        x: { min: 0, max: width },
        y: { min: 0, max: height },
        lifespan: 5000,
        quantity: STARFIELD_PARTICLE_COUNT,
        scale: { start: 0.6, end: 1.4 },
        alpha: { start: 0.2, end: 0.9 },
        frequency: 80,
        speedY: { min: -4, max: 4 },
        blendMode: Phaser.BlendModes.ADD,
      })
      .setDepth(-10);
  }
}
