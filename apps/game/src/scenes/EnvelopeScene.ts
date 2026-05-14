import * as Phaser from "phaser";
import "../lib/rex-ui";
import { announce } from "../lib/announce";
import { FONT, FONT_SIZE, TINT } from "../ui/tokens";

/**
 * EnvelopeScene — a modal overlay that paused over WorldScene while the
 * player allocates ₹15,000 into Rent / Save / Spend. Triggered by
 * StoryDirector via `show-envelope-split`. Emits `envelope:done` on
 * confirmation; the director resumes the next beat on receipt.
 *
 * Design intent — this is the "first verb" in the chawl onboarding.
 * Maya's lecture is one envelope. The MoneyVerse pillar is "hide the
 * lesson in the verb" — so the player physically moves money. We use
 * three step buttons (+/-₹500) over sliders because (a) it is reachable
 * by keyboard (Tab + arrows), (b) ₹500 is a meaningful chunk that
 * doesn't feel like trivial fiddle, and (c) it's easier to thumb-tap
 * on a phone than a slider.
 *
 * UX rules:
 *   - Total is locked to ₹15,000. The "Spend" envelope auto-balances
 *     so the math never lies to the player.
 *   - Confirm is gated on Rent >= ₹4,800 (the chawl rent fact) so the
 *     player cannot be evicted by their own first lesson. This is
 *     pillar #4 (forgiveness) — we warn but don't punish.
 */

const TOTAL_BUDGET = 15_000;
const RENT_MINIMUM = 4_800;
const SAVE_NUDGE_MINIMUM = 2_000;
const STEP = 500;
const PANEL_FILL = 0x1a0a26;
const PANEL_STROKE = 0xf7b733;
const PANEL_BORDER_ALPHA = 0.9;
const PANEL_RADIUS = 8;
const REGISTRY_FIRST_BUDGET_KEY = "firstBudget";

interface Allocation {
  rent: number;
  save: number;
  spend: number;
}

const DEFAULT_ALLOCATION: Allocation = {
  rent: 0,
  save: 0,
  spend: TOTAL_BUDGET,
};

export class EnvelopeScene extends Phaser.Scene {
  private allocation: Allocation = { ...DEFAULT_ALLOCATION };
  private rentValueText: Phaser.GameObjects.BitmapText | undefined;
  private saveValueText: Phaser.GameObjects.BitmapText | undefined;
  private spendValueText: Phaser.GameObjects.BitmapText | undefined;
  private confirmButton: Phaser.GameObjects.BitmapText | undefined;
  private statusLine: Phaser.GameObjects.BitmapText | undefined;
  private rootContainer: Phaser.GameObjects.Container | undefined;
  private backdrop: Phaser.GameObjects.Rectangle | undefined;

  constructor() {
    super({ key: "Envelope" });
  }

  create(): void {
    this.allocation = { ...DEFAULT_ALLOCATION };
    this.scene.bringToTop();
    this.scene.pause("World");

    const { width, height } = this.scale;
    this.backdrop = this.add
      .rectangle(width / 2, height / 2, width, height, 0x0a0612, 0.75)
      .setDepth(0);

    this.buildPanel();
    this.bindKeys();
    this.refreshDisplay();
    announce(
      "Allocate fifteen thousand rupees. Rent first, then save, then spend.",
    );
  }

  private buildPanel(): void {
    const { width, height } = this.scale;
    const panelWidth = Math.min(520, width - 64);
    const panelHeight = 360;
    const cx = width / 2;
    const cy = height / 2;

    const container = this.add.container(cx, cy).setDepth(10);
    this.rootContainer = container;

    const panel = this.add.rectangle(
      0,
      0,
      panelWidth,
      panelHeight,
      PANEL_FILL,
      0.96,
    );
    panel.setStrokeStyle(2, PANEL_STROKE, PANEL_BORDER_ALPHA);
    container.add(panel);

    const title = this.add
      .bitmapText(
        0,
        -panelHeight / 2 + 24,
        FONT,
        "Three Envelopes - Salary ₹15,000",
        FONT_SIZE.display,
      )
      .setTint(TINT.saffron)
      .setOrigin(0.5, 0.5);
    container.add(title);

    const subtitle = this.add
      .bitmapText(
        0,
        -panelHeight / 2 + 50,
        FONT,
        "Rent first. Then pay yourself.\nWhatever is left is yours to spend.",
        FONT_SIZE.body,
      )
      .setTint(TINT.lilac)
      .setMaxWidth(panelWidth - 40)
      .setCenterAlign()
      .setOrigin(0.5, 0.5);
    container.add(subtitle);

    this.rentValueText = this.makeRow(
      container,
      "Rent",
      -60,
      panelWidth,
      (delta) => this.adjust("rent", delta),
    );
    this.saveValueText = this.makeRow(
      container,
      "Save",
      0,
      panelWidth,
      (delta) => this.adjust("save", delta),
    );
    // Spend is the remainder. Make it display-only so the math is honest
    // — every rupee added to Rent or Save *visibly* leaves Spend.
    this.spendValueText = this.makeReadonlyRow(container, "Spend", 60, panelWidth);

    this.statusLine = this.add
      .bitmapText(0, panelHeight / 2 - 70, FONT, "", FONT_SIZE.body)
      .setTint(TINT.lilac)
      .setMaxWidth(panelWidth - 40)
      .setCenterAlign()
      .setOrigin(0.5, 0.5);
    container.add(this.statusLine);

    const confirmBg = this.add
      .rectangle(0, panelHeight / 2 - 32, 200, 36, PANEL_STROKE, 1)
      .setStrokeStyle(2, PANEL_FILL, 1);
    container.add(confirmBg);
    const confirmText = this.add
      .bitmapText(
        0,
        panelHeight / 2 - 32,
        FONT,
        "CONFIRM (Enter)",
        FONT_SIZE.heading,
      )
      .setTint(TINT.indigo)
      .setOrigin(0.5, 0.5);
    container.add(confirmText);
    this.confirmButton = confirmText;

    confirmBg.setInteractive({ useHandCursor: true });
    confirmBg.on("pointerdown", () => this.tryConfirm());
  }

  /**
   * Build one Rent/Save/Spend row: label, value, +500 / -500 buttons.
   * Returns the value text so the caller can hold a reference for
   * later updates.
   */
  private makeRow(
    parent: Phaser.GameObjects.Container,
    label: string,
    offsetY: number,
    panelWidth: number,
    onAdjust: (delta: number) => void,
  ): Phaser.GameObjects.BitmapText {
    const rowWidth = panelWidth - 60;

    const labelText = this.add
      .bitmapText(-rowWidth / 2 + 10, offsetY, FONT, label, FONT_SIZE.heading)
      .setTint(TINT.cream)
      .setOrigin(0, 0.5);
    parent.add(labelText);

    const valueText = this.add
      .bitmapText(rowWidth / 2 - 10, offsetY, FONT, "₹0", FONT_SIZE.heading)
      .setTint(TINT.saffron)
      .setOrigin(1, 0.5);
    parent.add(valueText);

    const minusBg = this.add
      .rectangle(rowWidth / 2 - 140, offsetY, 36, 24, PANEL_STROKE, 0.18)
      .setStrokeStyle(1, PANEL_STROKE, 0.8);
    const minusText = this.add
      .bitmapText(rowWidth / 2 - 140, offsetY, FONT, "-500", FONT_SIZE.body)
      .setTint(TINT.saffron)
      .setOrigin(0.5, 0.5);
    parent.add(minusBg);
    parent.add(minusText);
    minusBg.setInteractive({ useHandCursor: true });
    minusBg.on("pointerdown", () => onAdjust(-STEP));

    const plusBg = this.add
      .rectangle(rowWidth / 2 - 95, offsetY, 36, 24, PANEL_STROKE, 0.18)
      .setStrokeStyle(1, PANEL_STROKE, 0.8);
    const plusText = this.add
      .bitmapText(rowWidth / 2 - 95, offsetY, FONT, "+500", FONT_SIZE.body)
      .setTint(TINT.saffron)
      .setOrigin(0.5, 0.5);
    parent.add(plusBg);
    parent.add(plusText);
    plusBg.setInteractive({ useHandCursor: true });
    plusBg.on("pointerdown", () => onAdjust(STEP));

    return valueText;
  }

  /** Build a row that displays a value but has no +/- controls. */
  private makeReadonlyRow(
    parent: Phaser.GameObjects.Container,
    label: string,
    offsetY: number,
    panelWidth: number,
  ): Phaser.GameObjects.BitmapText {
    const rowWidth = panelWidth - 60;
    const labelText = this.add
      .bitmapText(-rowWidth / 2 + 10, offsetY, FONT, label, FONT_SIZE.heading)
      .setTint(TINT.lilac)
      .setOrigin(0, 0.5);
    parent.add(labelText);

    const valueText = this.add
      .bitmapText(rowWidth / 2 - 10, offsetY, FONT, "₹0", FONT_SIZE.heading)
      .setTint(TINT.lilac)
      .setOrigin(1, 0.5);
    parent.add(valueText);

    const note = this.add
      .bitmapText(
        rowWidth / 2 - 140,
        offsetY,
        FONT,
        "(whatever's left)",
        FONT_SIZE.caption,
      )
      .setTint(TINT.muted)
      .setOrigin(0.5, 0.5);
    parent.add(note);

    return valueText;
  }

  private bindKeys(): void {
    const kb = this.input.keyboard;
    if (kb === null) return;
    // Number-row shortcuts: 1/2/3 select envelope, +/- adjusts the
    // currently focused row. Simpler: arrow up/down on body.
    kb.on("keydown-ENTER", () => this.tryConfirm());
    kb.on("keydown-ESC", () => this.tryConfirm()); // ESC also confirms so
    // the player can't get trapped mid-tutorial.
    // Quick allocate: R/S keys nudge rent/save.
    kb.on("keydown-R", () => this.adjust("rent", STEP));
    kb.on("keydown-T", () => this.adjust("rent", -STEP));
    kb.on("keydown-S", () => this.adjust("save", STEP));
    kb.on("keydown-D", () => this.adjust("save", -STEP));
  }

  private adjust(bucket: "rent" | "save", delta: number): void {
    const next = clamp(this.allocation[bucket] + delta, 0, TOTAL_BUDGET);
    const used = bucket === "rent"
      ? next + this.allocation.save
      : this.allocation.rent + next;
    if (used > TOTAL_BUDGET) return;
    this.allocation = {
      ...this.allocation,
      [bucket]: next,
      spend: TOTAL_BUDGET - (bucket === "rent" ? next : this.allocation.rent)
        - (bucket === "save" ? next : this.allocation.save),
    };
    this.refreshDisplay();
  }

  private refreshDisplay(): void {
    this.rentValueText?.setText(formatInr(this.allocation.rent));
    this.saveValueText?.setText(formatInr(this.allocation.save));
    this.spendValueText?.setText(formatInr(this.allocation.spend));

    const status = this.computeStatus();
    this.statusLine?.setText(status.message);
    this.statusLine?.setTint(status.tint);

    const canConfirm = this.allocation.rent >= RENT_MINIMUM;
    this.confirmButton?.setAlpha(canConfirm ? 1 : 0.4);
  }

  private computeStatus(): { message: string; tint: number } {
    if (this.allocation.rent < RENT_MINIMUM) {
      return {
        message: `Rent must be at least ₹${RENT_MINIMUM.toLocaleString("en-IN")}. (Press R to add ₹500.)`,
        tint: TINT.warning,
      };
    }
    if (this.allocation.save < SAVE_NUDGE_MINIMUM) {
      return {
        message:
          "Save is low. ₹2,000 each month becomes ₹24,000 in a year - one emergency you don't borrow for.",
        tint: TINT.saffron,
      };
    }
    return {
      message: "Balanced. Pay yourself first, every month.",
      tint: TINT.green,
    };
  }

  private tryConfirm(): void {
    if (this.allocation.rent < RENT_MINIMUM) {
      announce(
        `Rent envelope needs at least ₹${RENT_MINIMUM.toLocaleString("en-IN")}.`,
        "assertive",
      );
      return;
    }
    const grade =
      this.allocation.save >= SAVE_NUDGE_MINIMUM ? "balanced" : "shaky";
    const result = { ...this.allocation, grade };
    this.registry.set(REGISTRY_FIRST_BUDGET_KEY, result);
    this.events.emit("envelope:done", result);
    this.scene.resume("World");
  }
}

function clamp(value: number, lo: number, hi: number): number {
  if (value < lo) return lo;
  if (value > hi) return hi;
  return value;
}

function formatInr(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}
