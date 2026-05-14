import * as Phaser from "phaser";
import type Dialog from "phaser3-rex-plugins/templates/ui/dialog/Dialog";
import "../lib/rex-ui";
import { announce } from "../lib/announce";

export interface DialogShowEvent {
  readonly speaker: string;
  readonly lines: ReadonlyArray<string>;
  readonly onClose?: () => void;
}

const PANEL_FILL = 0x1a0a26;
const PANEL_STROKE = 0xf7b733;
const PANEL_RADIUS = 6;
const FOOTER_HINT = "Press SPACE";

export class DialogScene extends Phaser.Scene {
  private dialog: Dialog | undefined;
  private lines: ReadonlyArray<string> = [];
  private lineIndex = 0;
  private bodyText: Phaser.GameObjects.Text | undefined;
  private onClose: (() => void) | undefined;
  private spaceKey: Phaser.Input.Keyboard.Key | undefined;

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
    this.dialog?.destroy();

    const width = this.scale.width;
    const height = this.scale.height;
    const panelWidth = Math.min(720, width - 64);

    const speakerLabel = this.rexUI.add.label({
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        PANEL_RADIUS,
        PANEL_STROKE,
      ),
      text: this.add.text(0, 0, ` ${event.speaker} `, {
        fontSize: "14px",
        color: "#1a0a26",
        fontFamily: "monospace",
        fontStyle: "bold",
      }),
      space: { left: 10, right: 10, top: 4, bottom: 4 },
    });

    this.bodyText = this.add.text(0, 0, this.lines[0] ?? "", {
      fontSize: "16px",
      color: "#f5f1ea",
      fontFamily: "monospace",
      wordWrap: { width: panelWidth - 60 },
    });

    const footer = this.add.text(0, 0, FOOTER_HINT, {
      fontSize: "12px",
      color: "#f7b733",
      fontFamily: "monospace",
    });

    const dialog = this.rexUI.add.dialog({
      x: width / 2,
      y: height - 120,
      width: panelWidth,
      background: this.rexUI.add.roundRectangle(
        0,
        0,
        2,
        2,
        PANEL_RADIUS,
        PANEL_FILL,
        0.95,
      ).setStrokeStyle(2, PANEL_STROKE, 0.9),
      title: speakerLabel,
      content: this.bodyText,
      actions: [footer],
      space: {
        title: 8,
        content: 14,
        action: 6,
        left: 18,
        right: 18,
        top: 14,
        bottom: 14,
      },
      align: { actions: "right" },
      expand: { content: false },
    });
    dialog.layout();
    dialog.setDepth(2000);
    dialog.setAlpha(0);
    this.dialog = dialog;

    this.tweens.add({
      targets: dialog,
      alpha: 1,
      y: { from: height, to: height - 120 },
      duration: 260,
      ease: "Sine.easeOut",
    });

    announce(`${event.speaker}: ${this.lines[0] ?? ""}`);

    this.spaceKey?.removeAllListeners();
    this.spaceKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.spaceKey?.on("down", () => this.advance());
    this.input.on("pointerdown", this.advance, this);
  }

  private advance(): void {
    if (this.dialog === undefined || this.bodyText === undefined) return;
    this.lineIndex += 1;
    if (this.lineIndex >= this.lines.length) {
      this.close();
      return;
    }
    const next = this.lines[this.lineIndex] ?? "";
    this.bodyText.setText(next);
    this.dialog.layout();
    announce(next);
  }

  private close(): void {
    const dialog = this.dialog;
    if (dialog === undefined) return;
    const finalize = (): void => {
      dialog.destroy();
      this.dialog = undefined;
      this.bodyText = undefined;
      this.input.off("pointerdown", this.advance, this);
      this.spaceKey?.removeAllListeners();
      this.onClose?.();
      this.onClose = undefined;
    };
    this.tweens.add({
      targets: dialog,
      alpha: 0,
      duration: 200,
      onComplete: finalize,
    });
  }

  private relayout(): void {
    if (this.dialog === undefined) return;
    this.dialog.setPosition(this.scale.width / 2, this.scale.height - 120);
    this.dialog.layout();
  }
}
