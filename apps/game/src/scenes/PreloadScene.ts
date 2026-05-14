import * as Phaser from "phaser";
import "../lib/rex-ui";

const DISTRICT_ID = "chawl-mohalla";
const TIP_CYCLE_MS = 2200;
export const CHAWL_TILESET_KEY = "chawl-tileset";
export const CHAWL_TILESET_NAME = "kenney-tiny-town";
export const CHARACTERS_KEY = "characters";
const CHARACTER_FRAME_SIZE = 16;

const TIPS: ReadonlyArray<string> = [
  "Keep the chai receipt. It tells the story your bank statement hides.",
  "Three envelopes: Fixed, Save, Khushi. Pay them before you pay the world.",
  "Compound interest is how money quietly grows while you sleep.",
  "A SIP of ₹500 is a habit. ₹5000 once is a souvenir.",
  "Aaj se hisaab rakhna seekho — the rest will follow.",
];

export class PreloadScene extends Phaser.Scene {
  private tipText: Phaser.GameObjects.Text | undefined;
  private tipIndex = 0;
  private tipTimer: Phaser.Time.TimerEvent | undefined;
  private bar:
    | (Phaser.GameObjects.GameObject & { setValue: (v: number) => unknown })
    | undefined;

  constructor() {
    super({ key: "Preload" });
  }

  preload(): void {
    this.buildLoadingUI();

    this.load.on("progress", (value: number) => {
      this.bar?.setValue(value);
    });

    this.load.json("district-meta", `/content/maps/${DISTRICT_ID}.meta.json`);
    this.load.tilemapTiledJSON(
      "district-map",
      `/content/maps/${DISTRICT_ID}.json`,
    );
    this.load.json(
      "district-npcs",
      `/content/npcs/${DISTRICT_ID}.index.json`,
    );
    this.load.json(
      "district-quests",
      `/content/quests/${DISTRICT_ID}.index.json`,
    );
    // β-3: Ninja Adventure CC0 substrate replaces Kenney Tiny Town /
    // Tiny Dungeon. The atlases are composites built by
    // `scripts/build-ninja-atlases.mjs` from the pack at
    // /atlases/ninja-adventure/. gid + frame indices preserve the previous
    // greybox layout so Tiled JSON + Player.ts / Npc.ts frame references
    // stay valid.
    this.load.image(CHAWL_TILESET_KEY, "/atlases/chawl-tileset-na.png");
    this.load.spritesheet(CHARACTERS_KEY, "/atlases/characters-na.png", {
      frameWidth: CHARACTER_FRAME_SIZE,
      frameHeight: CHARACTER_FRAME_SIZE,
    });

    this.load.on("complete", () => {
      this.tipTimer?.remove(false);
      this.scene.start("World", { districtId: DISTRICT_ID });
      this.scene.launch("UI", { districtId: DISTRICT_ID });
    });
  }

  create(): void {}

  private buildLoadingUI(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    const trackHeight = 8;
    const trackWidth = 320;
    const track = this.add
      .rectangle(
        width / 2,
        height / 2,
        trackWidth,
        trackHeight,
        0x1a0a26,
        0.9,
      )
      .setStrokeStyle(1, 0xf7b733, 0.7);

    const numberBar = this.rexUI.add.numberBar({
      x: width / 2,
      y: height / 2,
      width: trackWidth,
      height: trackHeight,
      slider: {
        track: this.add.rectangle(0, 0, 1, 1, 0x1a0a26, 0),
        indicator: this.add.rectangle(0, 0, 1, 1, 0xf7b733),
        input: "none",
      },
      space: { left: 1, right: 1, top: 1, bottom: 1 },
    });
    numberBar.setValue(0, 0, 1);
    numberBar.layout();
    this.bar = numberBar as unknown as Phaser.GameObjects.GameObject & {
      setValue: (v: number) => unknown;
    };

    this.tipText = this.add
      .text(width / 2, height / 2 + 40, TIPS[0] ?? "", {
        fontSize: "13px",
        color: "#f5f1ea",
        fontFamily: "monospace",
        align: "center",
        wordWrap: { width: trackWidth + 80 },
      })
      .setOrigin(0.5, 0)
      .setAlpha(0.85);

    this.tipTimer = this.time.addEvent({
      delay: TIP_CYCLE_MS,
      loop: true,
      callback: () => this.advanceTip(),
    });

    void track;
  }

  private advanceTip(): void {
    if (this.tipText === undefined) return;
    this.tipIndex = (this.tipIndex + 1) % TIPS.length;
    const next = TIPS[this.tipIndex] ?? "";
    this.tweens.add({
      targets: this.tipText,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.tipText?.setText(next);
        this.tweens.add({
          targets: this.tipText,
          alpha: 0.85,
          duration: 200,
        });
      },
    });
  }
}
