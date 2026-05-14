/**
 * DialogScene — the speaker panel that shows over the world during
 * dialog. Rewritten in 2026-05 to drop rexUI's Dialog template in
 * favour of a manual Container + Graphics + BitmapText layout, because
 * rexUI's Dialog auto-layout computes child bounds via `.width` /
 * `.height` properties — and Phaser BitmapText returns those lazily.
 * The resulting "empty saffron box with no glyphs" was the visible
 * symptom of that timing mismatch. The manual layout below sidesteps
 * the auto-fit step entirely; we know the panel size at construction.
 */
import * as Phaser from "phaser";
import "../lib/rex-ui";
import { announce } from "../lib/announce";
import { FONT, FONT_SIZE, TINT } from "../ui/tokens";

export interface DialogShowEvent {
  readonly speaker: string;
  readonly lines: ReadonlyArray<string>;
  readonly onClose?: () => void;
}

const PANEL_FILL = 0x1a0a26;
const PANEL_STROKE = 0xf7b733;
const PANEL_RADIUS = 6;
const PANEL_HEIGHT = 110;
const PANEL_BOTTOM_OFFSET = 70; // distance from screen bottom to panel bottom
const PADDING_X = 18;
const PADDING_Y = 14;
const SPEAKER_TAB_HEIGHT = 22;
const SPEAKER_TAB_RADIUS = 4;
const FOOTER_HINT = "Press SPACE";

interface DialogParts {
  readonly container: Phaser.GameObjects.Container;
  readonly speakerBg: Phaser.GameObjects.Graphics;
  readonly speakerText: Phaser.GameObjects.BitmapText;
  readonly bodyText: Phaser.GameObjects.BitmapText;
  readonly footer: Phaser.GameObjects.BitmapText;
}

export class DialogScene extends Phaser.Scene {
  private parts: DialogParts | undefined;
  private lines: ReadonlyArray<string> = [];
  private lineIndex = 0;
  private onClose: (() => void) | undefined;
  private spaceKey: Phaser.Input.Keyboard.Key | undefined;
  private advanceBound: (() => void) | undefined;

  constructor() {
    super({ key: "Dialog" });
  }

  create(): void {
    this.scene.bringToTop();
    this.events.on("dialog:show", (e: DialogShowEvent) => this.show(e));
    this.scale.on("resize", () => this.relayout());
  }

  private show(event: DialogShowEvent): void {
    this.lines = event.lines.length > 0 ? event.lines : [""];
    this.lineIndex = 0;
    this.onClose = event.onClose;
    this.destroyParts();

    const parts = this.buildParts(event.speaker);
    this.parts = parts;
    this.setBodyText(this.lines[0] ?? "");
    parts.container.setAlpha(0);

    this.tweens.add({
      targets: parts.container,
      alpha: 1,
      y: { from: this.scale.height, to: parts.container.y },
      duration: 260,
      ease: "Sine.easeOut",
    });

    announce(`${event.speaker}: ${this.lines[0] ?? ""}`);

    this.spaceKey?.removeAllListeners();
    this.spaceKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    const advance = (): void => this.advance();
    this.advanceBound = advance;
    this.spaceKey?.on("down", advance);
    this.input.on("pointerdown", advance);
  }

  /**
   * Build the parts of a fresh dialog. The panel is a fixed-size
   * Graphics rectangle; the speaker chip is a smaller round-rect on
   * top; body + footer are BitmapText nodes. Everything goes inside
   * one Container so the show/hide tween moves it as a unit.
   */
  private buildParts(speaker: string): DialogParts {
    const width = this.scale.width;
    const height = this.scale.height;
    const panelWidth = Math.min(720, width - 64);
    const panelX = (width - panelWidth) / 2;
    const panelY = height - PANEL_BOTTOM_OFFSET - PANEL_HEIGHT;

    const container = this.add
      .container(panelX, panelY)
      .setDepth(2000)
      .setScrollFactor(0);

    // Panel background.
    const bg = this.add.graphics();
    bg.fillStyle(PANEL_FILL, 0.95);
    bg.fillRoundedRect(0, 0, panelWidth, PANEL_HEIGHT, PANEL_RADIUS);
    bg.lineStyle(2, PANEL_STROKE, 0.9);
    bg.strokeRoundedRect(0, 0, panelWidth, PANEL_HEIGHT, PANEL_RADIUS);
    container.add(bg);

    // Speaker tab — sized to fit the speaker name.
    const speakerText = this.add
      .bitmapText(0, 0, FONT, speaker, FONT_SIZE.heading)
      .setTint(TINT.indigo);
    const speakerBgWidth = Math.max(64, Math.ceil(speakerText.width) + 16);
    const speakerBg = this.add.graphics();
    speakerBg.fillStyle(PANEL_STROKE, 1);
    speakerBg.fillRoundedRect(
      PADDING_X - 4,
      PADDING_Y - 14,
      speakerBgWidth,
      SPEAKER_TAB_HEIGHT,
      SPEAKER_TAB_RADIUS,
    );
    container.add(speakerBg);
    // Position the bitmap text within the chip.
    speakerText.setPosition(
      PADDING_X - 4 + speakerBgWidth / 2 - Math.ceil(speakerText.width) / 2,
      PADDING_Y - 14 + SPEAKER_TAB_HEIGHT / 2 -
        Math.ceil(speakerText.height) / 2,
    );
    container.add(speakerText);

    // Body text — set after construction so wrap fires once.
    const bodyText = this.add
      .bitmapText(PADDING_X, PADDING_Y + 18, FONT, "", FONT_SIZE.body)
      .setTint(TINT.cream)
      .setMaxWidth(panelWidth - PADDING_X * 2);
    container.add(bodyText);

    // Footer hint — bottom-right.
    const footer = this.add
      .bitmapText(0, 0, FONT, FOOTER_HINT, FONT_SIZE.caption)
      .setTint(TINT.saffron);
    footer.setPosition(
      panelWidth - PADDING_X - Math.ceil(footer.width),
      PANEL_HEIGHT - PADDING_Y - Math.ceil(footer.height),
    );
    container.add(footer);

    return { container, speakerBg, speakerText, bodyText, footer };
  }

  private setBodyText(text: string): void {
    this.parts?.bodyText.setText(text);
  }

  private advance(): void {
    if (this.parts === undefined) return;
    this.lineIndex += 1;
    if (this.lineIndex >= this.lines.length) {
      this.close();
      return;
    }
    const next = this.lines[this.lineIndex] ?? "";
    this.setBodyText(next);
    announce(next);
  }

  private close(): void {
    const parts = this.parts;
    if (parts === undefined) return;
    this.tweens.add({
      targets: parts.container,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.destroyParts();
        this.onClose?.();
        this.onClose = undefined;
      },
    });
  }

  private destroyParts(): void {
    if (this.advanceBound !== undefined) {
      this.input.off("pointerdown", this.advanceBound);
      this.advanceBound = undefined;
    }
    this.spaceKey?.removeAllListeners();
    this.parts?.container.destroy();
    this.parts = undefined;
  }

  private relayout(): void {
    if (this.parts === undefined) return;
    const width = this.scale.width;
    const height = this.scale.height;
    const panelWidth = Math.min(720, width - 64);
    this.parts.container.setPosition(
      (width - panelWidth) / 2,
      height - PANEL_BOTTOM_OFFSET - PANEL_HEIGHT,
    );
  }
}
