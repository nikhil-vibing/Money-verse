/**
 * JarOfAchaar — Ma's pickle jar.
 *
 * Whimsy share-move from docs/audit/whimsy-injector.md §5:
 *
 *   Ma never appears on screen — her pickle jar does. Tuesday's call
 *   mentions pickle via Lakshmi. Thursday, a glass jar with a hand-
 *   written marker — "For Mira — less chilli" — sits on the player's
 *   table. No XP, no quest. Stays the rest of the run. A mother's
 *   promise the game remembered.
 *
 * Pillar #8 binding: there is NO popup, NO toast, NO reward. The jar
 * just appears. If the player walks up and presses E, a single faded
 * hand-written label flickers above it for 2 seconds, then dismisses.
 * That's the whole interaction. The jar persists once spawned.
 *
 * Implementation: a tiny Phaser Container with a procedurally-drawn
 * jar (Graphics) so we don't need a new tilesheet entry. The "hand-
 * written" label uses the same bitmap font tinted slightly faded so
 * it reads as ink-on-paper rather than UI chrome.
 */
import * as Phaser from "phaser";
import { FONT, FONT_SIZE, TINT } from "../ui/tokens";

const JAR_W = 12;
const JAR_H = 14;
const LID_H = 3;
const READ_RADIUS_PX = 28;
const LABEL_FADE_MS = 200;
const LABEL_HOLD_MS = 1800;
/** What the marker says — narrative-canonical. The player's in-fiction
 * name is "Mira" because the audit's prescribed label reads "For Mira —
 * less chilli". The data-layer player display name (from
 * packages/shared/db/schema.ts:displayName) is free-form, but Ma's
 * handwriting always says "Mira". */
const MARKER_TEXT = "For Mira - less chilli";

export class JarOfAchaar extends Phaser.GameObjects.Container {
  private readonly label: Phaser.GameObjects.BitmapText;
  private readonly labelBg: Phaser.GameObjects.Graphics;
  private hideLabelTimer: Phaser.Time.TimerEvent | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Body. A faded-glass oval-ish shape rendered as a thin saffron rect
    // with a slightly darker lid. Pixel-art on purpose; the First Dojo
    // reskin can replace this with a hand-painted sprite later.
    const g = scene.add.graphics();
    g.fillStyle(0x6c4326, 1);
    g.fillRect(-JAR_W / 2, -JAR_H / 2 + LID_H, JAR_W, JAR_H - LID_H);
    g.lineStyle(1, 0x1a0a26, 1);
    g.strokeRect(-JAR_W / 2, -JAR_H / 2 + LID_H, JAR_W, JAR_H - LID_H);
    g.fillStyle(0x9b5e34, 1);
    g.fillRect(-JAR_W / 2 - 1, -JAR_H / 2, JAR_W + 2, LID_H);
    g.lineStyle(1, 0x1a0a26, 1);
    g.strokeRect(-JAR_W / 2 - 1, -JAR_H / 2, JAR_W + 2, LID_H);

    // A pale paper marker on the jar body — just a 1-pixel rectangle
    // so the player can register "the jar has a label" even before
    // they walk up to read it.
    g.fillStyle(0xf5f1ea, 0.9);
    g.fillRect(-JAR_W / 2 + 2, -1, JAR_W - 4, 5);

    this.add(g);

    // The reveal label. Hidden by default; shown when `revealLabel()`
    // is called. The bitmap font tinted toward cream-on-indigo reads
    // as "handwritten on paper" at the First Dojo's palette.
    this.label = scene.add
      .bitmapText(0, -JAR_H, FONT, MARKER_TEXT, FONT_SIZE.caption)
      .setTint(TINT.cream)
      .setOrigin(0.5, 1)
      .setAlpha(0);
    this.labelBg = scene.add.graphics();
    paintLabelBg(this.labelBg, this.label);
    this.labelBg.setAlpha(0);
    this.add(this.labelBg);
    this.add(this.label);

    this.setSize(JAR_W + 4, JAR_H + 4);
    this.setDepth(45);
    scene.add.existing(this);
  }

  /**
   * Returns true if the player is within reading range of the jar. The
   * caller (WorldScene) polls this each frame; the jar itself doesn't
   * subscribe to anything so it can't leak.
   */
  isInReadRange(playerX: number, playerY: number): boolean {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    return dx * dx + dy * dy <= READ_RADIUS_PX * READ_RADIUS_PX;
  }

  /**
   * Flash the marker label for ~2 seconds, then fade out. Idempotent
   * during the visible window (a second call resets the timer).
   *
   * The pillar #8 binding makes this deliberately understated — no
   * sound, no scale-pulse, no "+1 mom!" toast. Just the label.
   */
  revealLabel(): void {
    this.hideLabelTimer?.remove(false);
    this.scene.tweens.add({
      targets: [this.label, this.labelBg],
      alpha: 1,
      duration: LABEL_FADE_MS,
      ease: "Sine.easeOut",
    });
    this.hideLabelTimer = this.scene.time.delayedCall(LABEL_HOLD_MS, () => {
      this.scene.tweens.add({
        targets: [this.label, this.labelBg],
        alpha: 0,
        duration: LABEL_FADE_MS,
        ease: "Sine.easeIn",
      });
    });
  }
}

function paintLabelBg(
  g: Phaser.GameObjects.Graphics,
  label: Phaser.GameObjects.BitmapText,
): void {
  const padX = 5;
  const padY = 2;
  const r = 2;
  const w = Math.ceil(label.width) + padX * 2;
  const h = Math.ceil(label.height) + padY * 2;
  const x = -w / 2;
  const y = label.y - h;
  g.clear();
  g.fillStyle(0x1a0a26, 0.9);
  g.fillRoundedRect(x, y, w, h, r);
  g.lineStyle(1, 0xf7b733, 0.7);
  g.strokeRoundedRect(x, y, w, h, r);
}
