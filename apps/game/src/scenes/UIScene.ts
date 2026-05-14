import * as Phaser from "phaser";
import type Toast from "phaser3-rex-plugins/templates/ui/toast/Toast";
import type Label from "phaser3-rex-plugins/templates/ui/label/Label";
import "../lib/rex-ui";
import { announce } from "../lib/announce";

interface UISceneData {
  readonly districtId: string;
}

interface MinimapTick {
  readonly x: number;
  readonly y: number;
}

interface WorldReadyEvent {
  readonly districtId: string;
  readonly mapWidthPx: number;
  readonly mapHeightPx: number;
}

interface InteractShowEvent {
  readonly prompt: string;
  readonly target: string;
  readonly kind: string;
}

interface ObjectiveSetEvent {
  readonly text: string;
}

const DISTRICT_PILL_MS = 3000;
const MINIMAP_W = 120;
const MINIMAP_H = 80;
const MINIMAP_PADDING = 12;
const MINIMAP_SCALE = 1 / 16;
const PANEL_FILL = 0x1a0a26;
const PANEL_STROKE = 0xf7b733;
const DISTRICT_LABELS: Readonly<Record<string, string>> = {
  "chawl-mohalla": "Chawl Mohalla",
  "bank-bazaar": "Bank Bazaar",
};

export class UIScene extends Phaser.Scene {
  private districtToast: Toast | undefined;
  private interactBar: Label | undefined;
  private interactText: Phaser.GameObjects.Text | undefined;
  private objectiveBar: Label | undefined;
  private objectiveText: Phaser.GameObjects.Text | undefined;
  private minimap: Phaser.GameObjects.Graphics | undefined;
  private mapWidthPx = 960;
  private mapHeightPx = 640;
  private playerWorldPos: MinimapTick = { x: 0, y: 0 };
  private districtId = "chawl-mohalla";

  constructor() {
    super({ key: "UI" });
  }

  init(data: UISceneData): void {
    this.districtId = data.districtId ?? "chawl-mohalla";
  }

  create(): void {
    this.scene.bringToTop();
    this.showDistrictPill();
    this.createObjectiveBar();
    this.createInteractBar();
    this.createMinimap();
    this.bindWorldEvents();
    this.scale.on("resize", () => this.relayout());
  }

  private createObjectiveBar(): void {
    const text = this.add.text(0, 0, "", {
      fontSize: "12px",
      color: "#f5f1ea",
      fontFamily: "monospace",
    });
    this.objectiveText = text;

    const labelTag = this.add.text(0, 0, "OBJECTIVE", {
      fontSize: "10px",
      color: "#1a0a26",
      fontFamily: "monospace",
      fontStyle: "bold",
      backgroundColor: "#f7b733",
      padding: { left: 6, right: 6, top: 2, bottom: 2 },
    });

    const bar = this.rexUI.add.label({
      x: this.scale.width / 2,
      y: 70,
      background: this.rexUI.add
        .roundRectangle(0, 0, 2, 2, 6, PANEL_FILL, 0.92)
        .setStrokeStyle(1, PANEL_STROKE, 0.9),
      icon: labelTag,
      text,
      space: { left: 8, right: 14, top: 6, bottom: 6, icon: 10 },
    });
    bar.layout();
    bar.setDepth(999);
    bar.setVisible(false);
    this.objectiveBar = bar;
  }

  private showDistrictPill(): void {
    const label = DISTRICT_LABELS[this.districtId] ?? this.districtId;
    announce(`Entered ${label}`);

    const toast = this.rexUI.add.toast({
      x: this.scale.width / 2,
      y: 28,
      background: this.rexUI.add
        .roundRectangle(0, 0, 2, 2, 14, PANEL_FILL, 0.85)
        .setStrokeStyle(1, PANEL_STROKE, 0.9),
      text: this.add.text(0, 0, "", {
        fontSize: "13px",
        color: "#f5f1ea",
        fontFamily: "monospace",
      }),
      space: { left: 14, right: 14, top: 6, bottom: 6 },
      duration: { in: 220, hold: DISTRICT_PILL_MS, out: 400 },
    });
    toast.setDepth(1000);
    toast.showMessage(label);
    this.districtToast = toast;
  }

  private createInteractBar(): void {
    const text = this.add.text(0, 0, "", {
      fontSize: "13px",
      color: "#f7b733",
      fontFamily: "monospace",
    });
    this.interactText = text;

    const bar = this.rexUI.add.label({
      x: this.scale.width / 2,
      y: this.scale.height - 40,
      background: this.rexUI.add
        .roundRectangle(0, 0, 2, 2, 8, PANEL_FILL, 0.9)
        .setStrokeStyle(1, PANEL_STROKE, 1),
      text,
      space: { left: 18, right: 18, top: 8, bottom: 8 },
    });
    bar.layout();
    bar.setDepth(1000);
    bar.setVisible(false);
    this.interactBar = bar;
  }

  private createMinimap(): void {
    const g = this.add.graphics({ x: 0, y: 0 });
    g.setDepth(1000);
    g.setScrollFactor(0);
    this.minimap = g;
    this.relayout();
  }

  private bindWorldEvents(): void {
    const worldScene = this.scene.get("World");
    worldScene.events.on("interact:show", (e: InteractShowEvent) => {
      this.showInteract(e.prompt);
    });
    worldScene.events.on("interact:hide", () => this.hideInteract());
    worldScene.events.on("objective:set", (e: ObjectiveSetEvent) => {
      this.setObjective(e.text);
    });
    worldScene.events.on("minimap:tick", (tick: MinimapTick) => {
      this.playerWorldPos = tick;
      this.drawMinimap();
    });
    this.game.events.on("world:ready", (e: WorldReadyEvent) => {
      this.mapWidthPx = e.mapWidthPx;
      this.mapHeightPx = e.mapHeightPx;
      this.drawMinimap();
    });
  }

  private showInteract(prompt: string): void {
    if (this.interactBar === undefined || this.interactText === undefined) {
      return;
    }
    const alreadyVisible =
      this.interactBar.visible && this.interactText.text === prompt;
    this.interactText.setText(prompt);
    this.interactBar.layout();
    this.interactBar.setVisible(true);
    if (!alreadyVisible) announce(prompt);
  }

  private hideInteract(): void {
    this.interactBar?.setVisible(false);
  }

  private setObjective(text: string): void {
    if (this.objectiveBar === undefined || this.objectiveText === undefined) {
      return;
    }
    this.objectiveText.setText(text);
    this.objectiveBar.layout();
    this.objectiveBar.setVisible(true);
    announce(`Objective: ${text}`);
  }

  private drawMinimap(): void {
    const g = this.minimap;
    if (g === undefined) return;
    const x = this.scale.width - MINIMAP_W - MINIMAP_PADDING;
    const y = MINIMAP_PADDING;
    g.clear();
    g.fillStyle(PANEL_FILL, 0.85);
    g.fillRect(x, y, MINIMAP_W, MINIMAP_H);
    g.lineStyle(1, PANEL_STROKE, 0.9);
    g.strokeRect(x, y, MINIMAP_W, MINIMAP_H);

    const innerW = this.mapWidthPx * MINIMAP_SCALE;
    const innerH = this.mapHeightPx * MINIMAP_SCALE;
    const offX = x + (MINIMAP_W - innerW) / 2;
    const offY = y + (MINIMAP_H - innerH) / 2;
    // WCAG SC 1.4.11 (>=3:1 for non-text UI). #8a6aa8 ~= 4.7:1 against #1a0a26.
    g.fillStyle(0x8a6aa8, 0.95);
    g.fillRect(offX, offY, innerW, innerH);
    g.lineStyle(1, 0xf5f1ea, 0.6);
    g.strokeRect(offX, offY, innerW, innerH);

    const px = offX + this.playerWorldPos.x * MINIMAP_SCALE;
    const py = offY + this.playerWorldPos.y * MINIMAP_SCALE;
    g.fillStyle(PANEL_STROKE, 1);
    g.fillCircle(px, py, 2);
  }

  private relayout(): void {
    this.districtToast?.setPosition(this.scale.width / 2, 28);
    this.objectiveBar?.setPosition(this.scale.width / 2, 70);
    this.objectiveBar?.layout();
    this.interactBar?.setPosition(
      this.scale.width / 2,
      this.scale.height - 40,
    );
    this.interactBar?.layout();
    this.drawMinimap();
  }
}
