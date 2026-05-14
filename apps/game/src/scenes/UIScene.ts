import * as Phaser from "phaser";
import type Toast from "phaser3-rex-plugins/templates/ui/toast/Toast";
import "../lib/rex-ui";
import { announce } from "../lib/announce";
import { FONT, FONT_SIZE, TINT } from "../ui/tokens";

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
  "chawl-mohalla": "The First Dojo",
  "bank-bazaar": "The Still Pool",
};

/**
 * UIScene was switched from rexUI Label wrappers to manual Container +
 * Graphics + BitmapText in 2026-05. rexUI's auto-layout computes child
 * bounds via `.width` / `.height`, but Phaser BitmapText returns those
 * lazily on first render — which produced empty saffron rectangles
 * with no glyphs inside. The manual layout below sizes the bars off
 * the already-rendered BitmapText each time the prompt changes.
 */
type Bar = Phaser.GameObjects.Container & {
  bg: Phaser.GameObjects.Graphics;
};

export class UIScene extends Phaser.Scene {
  private districtToast: Toast | undefined;
  private interactBar: Bar | undefined;
  private interactText: Phaser.GameObjects.BitmapText | undefined;
  private objectiveBar: Bar | undefined;
  private objectiveText: Phaser.GameObjects.BitmapText | undefined;
  private objectiveTag: Phaser.GameObjects.BitmapText | undefined;
  private objectiveTagBg: Phaser.GameObjects.Graphics | undefined;
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
    // Manual layout: Container + Graphics + BitmapText. See class-level
    // comment for why we bypass rexUI here.
    const container = this.add.container(this.scale.width / 2, 70)
      .setDepth(999)
      .setScrollFactor(0)
      .setVisible(false) as Bar;
    const bg = this.add.graphics();
    container.bg = bg;
    container.add(bg);

    // OBJECTIVE chip — saffron tag with indigo glyphs.
    const tagBg = this.add.graphics();
    const tagText = this.add
      .bitmapText(0, 0, FONT, "OBJECTIVE", FONT_SIZE.caption)
      .setTint(TINT.indigo);
    container.add(tagBg);
    container.add(tagText);

    const text = this.add
      .bitmapText(0, 0, FONT, "", FONT_SIZE.body)
      .setTint(TINT.cream);
    container.add(text);

    this.objectiveBar = container;
    this.objectiveText = text;
    this.objectiveTag = tagText;
    this.objectiveTagBg = tagBg;
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
      text: this.add
        .bitmapText(0, 0, FONT, "", FONT_SIZE.display)
        .setTint(TINT.cream),
      space: { left: 14, right: 14, top: 6, bottom: 6 },
      duration: { in: 220, hold: DISTRICT_PILL_MS, out: 400 },
    });
    toast.setDepth(1000);
    toast.showMessage(label);
    this.districtToast = toast;
  }

  private createInteractBar(): void {
    // Manual layout — see class-level comment. The bar's bg is repainted
    // each time the prompt updates so the panel hugs the text.
    const container = this.add
      .container(this.scale.width / 2, this.scale.height - 40)
      .setDepth(1000)
      .setScrollFactor(0)
      .setVisible(false) as Bar;
    const bg = this.add.graphics();
    container.bg = bg;
    container.add(bg);
    const text = this.add
      .bitmapText(0, 0, FONT, "", FONT_SIZE.heading)
      .setTint(TINT.saffron);
    container.add(text);
    this.interactBar = container;
    this.interactText = text;
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
    this.layoutInteractBar();
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
    this.layoutObjectiveBar();
    this.objectiveBar.setVisible(true);
    announce(`Objective: ${text}`);
  }

  /**
   * Repaint the interact bar's bg + reposition the text so the panel
   * hugs the prompt. Called after every setText to keep the chrome tight.
   */
  private layoutInteractBar(): void {
    const bar = this.interactBar;
    const text = this.interactText;
    if (bar === undefined || text === undefined) return;
    const padX = 18;
    const padY = 8;
    const w = Math.ceil(text.width) + padX * 2;
    const h = Math.ceil(text.height) + padY * 2;
    text.setPosition(-w / 2 + padX, -h / 2 + padY);
    bar.bg.clear();
    bar.bg.fillStyle(PANEL_FILL, 0.9);
    bar.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    bar.bg.lineStyle(1, PANEL_STROKE, 1);
    bar.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
  }

  /**
   * Repaint the objective bar — chip on left, text on right, both inside
   * an indigo round-rect with a saffron stroke.
   */
  private layoutObjectiveBar(): void {
    const bar = this.objectiveBar;
    const text = this.objectiveText;
    const tag = this.objectiveTag;
    const tagBg = this.objectiveTagBg;
    if (
      bar === undefined ||
      text === undefined ||
      tag === undefined ||
      tagBg === undefined
    ) {
      return;
    }
    const padX = 10;
    const padY = 6;
    const tagPadX = 6;
    const tagPadY = 3;
    const tagW = Math.ceil(tag.width) + tagPadX * 2;
    const tagH = Math.ceil(tag.height) + tagPadY * 2;
    const gap = 10;
    const textW = Math.ceil(text.width);
    const textH = Math.ceil(text.height);
    const contentH = Math.max(tagH, textH);
    const totalW = tagW + gap + textW + padX * 2;
    const totalH = contentH + padY * 2;

    // Outer panel.
    bar.bg.clear();
    bar.bg.fillStyle(PANEL_FILL, 0.92);
    bar.bg.fillRoundedRect(-totalW / 2, -totalH / 2, totalW, totalH, 6);
    bar.bg.lineStyle(1, PANEL_STROKE, 0.9);
    bar.bg.strokeRoundedRect(-totalW / 2, -totalH / 2, totalW, totalH, 6);

    // Tag chip.
    const tagX = -totalW / 2 + padX;
    const tagY = -tagH / 2;
    tagBg.clear();
    tagBg.fillStyle(PANEL_STROKE, 1);
    tagBg.fillRoundedRect(tagX, tagY, tagW, tagH, 3);
    tag.setPosition(tagX + tagPadX, tagY + tagPadY);

    // Body text — vertically centred next to the tag.
    text.setPosition(tagX + tagW + gap, -textH / 2);
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
    this.layoutObjectiveBar();
    this.interactBar?.setPosition(
      this.scale.width / 2,
      this.scale.height - 40,
    );
    this.layoutInteractBar();
    this.drawMinimap();
  }
}
