import * as Phaser from "phaser";
import { addDropShadow } from "../lib/dropShadow";
import { FONT, FONT_SIZE, PANEL, TINT } from "../ui/tokens";

const NPC_LABEL_OFFSET_Y = 18;
const NPC_SPRITE_DEPTH = 40;
const NPC_SHADOW_DEPTH = 35;
const CHARACTERS_KEY = "characters";
const SHADOW_FILL = 0x000000;
const SHADOW_ALPHA = 0.28;
// Named NPCs we always show the label above. Per UI audit Fix #2 the
// label flips from hover-only to always-visible for these — so the
// chawl reads as a place where the people have names, not a debug
// scene of unlabelled silhouettes. Biscuit is excluded (it's a dog,
// it has no "name tag" hovering over it).
const ALWAYS_LABELLED_NPCS: ReadonlyArray<string> = [
  "maya-didi",
  "bhola-seth",
  "ravi-anna",
  "sushila-aunty",
  "aarav",
  "lakshmi-dabbawala",
  "dipu-kaka",
  "the-postman",
];
// Ninja Adventure (CC0) character atlas — composite built by
// scripts/build-ninja-atlases.mjs. Frames 84-95 hold 12 distinct NPC
// archetypes (the 13th — frame 97 — is the player). Each frame is the
// idle-down (row 0 col 0) crop of an NA character sheet.
const CHARACTER_FRAME_POOL: ReadonlyArray<number> = [
  84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
];

// β-5: deliberately map each NPC id to a specific frame so a chawl resident
// always looks like the same person across reloads, and so archetype
// (young/old/woman/man/boy) matches the dialog persona.
const NPC_FRAME_OVERRIDE: Readonly<Record<string, number>> = {
  "maya-didi": 84, // char 3 — young mentor in warm jacket
  "bhola-seth": 86, // char 12 — red-robed older merchant
  "ravi-anna": 95, // char 4  — bright young vendor (yellow)
  "sushila-aunty": 93, // char 25 — older woman archetype
  aarav: 90, // char 20 — yellow casual youth
  "lakshmi-dabbawala": 89, // char 18 — blue working figure
  "dipu-kaka": 91, // char 22 — purple-robed wise elder
  "maa-on-phone": 85, // char 9 — never rendered in-world (phone-only)
  "the-postman": 87, // char 15 — blue working traveller
  biscuit: 94, // char 8 — fallback for animal NPC (true dog sprite TBD)
};

const NPC_COLOR_PALETTE: ReadonlyArray<number> = [
  0xd05a8d, 0x7ad07a, 0x5aa6d0, 0xd0a85a, 0xa07ad0, 0xd07a5a, 0x5ad0c2,
  0xd0c25a, 0x9bd05a, 0xd05a5a,
];

const NPC_LABELS: Readonly<Record<string, string>> = {
  "maya-didi": "Maya didi",
  "bhola-seth": "Bhola seth",
  "ravi-anna": "Ravi anna",
  "sushila-aunty": "Sushila aunty",
  aarav: "Aarav",
  "lakshmi-dabbawala": "Lakshmi",
  "dipu-kaka": "Dipu kaka",
  "maa-on-phone": "Maa",
  "the-postman": "Postman",
  biscuit: "Biscuit",
};

const NPC_GREETINGS: Readonly<Record<string, ReadonlyArray<string>>> = {
  "maya-didi": [
    "Arre, you came. Tea first, lecture later.",
    "Three envelopes: rent, save, spend. Pick one to start.",
  ],
  "bhola-seth": [
    "Need cash now? I have cash now. We can talk about later, later.",
    "Just sign here. The numbers are small. Trust me.",
  ],
  "ravi-anna": [
    "One cutting chai, na?",
    "Seventy rupees a day. Times three sixty-five. You do the math.",
  ],
  "sushila-aunty": [
    "Tab is open. Pay on the first. Not the second.",
    "Onion is fifty. Tomato is forty. Inflation is real.",
  ],
  aarav: [
    "Bhai. New AirPods. Three thousand only. Original copy.",
    "Listen — life is short, EMIs are long.",
  ],
  "lakshmi-dabbawala": [
    "Tiffin by twelve. Always.",
    "System. That is everything. The post office RD also same.",
  ],
  "dipu-kaka": [
    "When I was your age, EPF was the whole plan.",
    "Compound interest is patience, dressed up as math.",
  ],
  "maa-on-phone": [
    "Beta, khaana khaaya?",
    "Save first. Then spend. Not the other way.",
  ],
  "the-postman": [
    "Letter for you. Sign here.",
  ],
  biscuit: ["*wags tail*"],
};

export class Npc extends Phaser.GameObjects.Container {
  readonly npcId: string;
  /** Saffron-stroked round-rect tag — see UI audit Fix #2. */
  private readonly labelBg: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.BitmapText;
  private readonly bodyGo: Phaser.GameObjects.GameObject;
  private readonly shadow: Phaser.GameObjects.Ellipse | undefined;
  private idleTween: Phaser.Tweens.Tween | undefined;
  private questIndicator: Phaser.GameObjects.BitmapText | undefined;
  private questIndicatorTween: Phaser.Tweens.Tween | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, npcId: string) {
    super(scene, x, y);
    this.npcId = npcId;

    const useSheet = scene.textures.exists(CHARACTERS_KEY);
    let preFxShadowAdded = false;
    if (useSheet) {
      const frame = pickFrame(npcId);
      const sprite = scene.add.sprite(0, 0, CHARACTERS_KEY, frame);
      sprite.setOrigin(0.5, 0.85);
      sprite.setScale(1.5);
      // α-1: preFX drop-shadow on each NPC sprite.
      preFxShadowAdded = addDropShadow(sprite);
      this.bodyGo = sprite;
      // scaleY pulse instead of y-position tween: an absolute-y capture would
      // snap-back if anything ever repositions the sprite (the same family of
      // bug recently fixed on Player). Scale is repositioning-safe.
      this.idleTween = scene.tweens.add({
        targets: sprite,
        scaleY: { from: 1.5, to: 1.5 * 0.97 },
        yoyo: true,
        duration: 1200 + (hashString(npcId) % 600),
        repeat: -1,
        ease: "Sine.InOut",
      });
    } else {
      const color = pickColor(npcId);
      this.bodyGo = scene.add
        .rectangle(0, 0, 14, 20, color, 1)
        .setStrokeStyle(1, 0x1a0a26, 1)
        .setOrigin(0.5, 0.85);
    }

    // Fallback ellipse only when preFX shadow not available (older Phaser /
    // low tier). Otherwise we'd double-shadow.
    const children: Array<Phaser.GameObjects.GameObject> = [];
    if (!preFxShadowAdded) {
      const ellipse = scene.add.ellipse(0, 6, 14, 5, SHADOW_FILL, SHADOW_ALPHA);
      ellipse.setDepth(NPC_SHADOW_DEPTH);
      this.shadow = ellipse;
      children.push(ellipse);
    }
    children.push(this.bodyGo);

    // UI audit Fix #2: the NPC label is now an 8-px bitmap-font glyph
    // string on a saffron-stroked indigo round-rect — the "tag" shape
    // the audit prescribes. The Graphics background is sized on demand
    // because BitmapText doesn't have a `getBounds()` until it's been
    // measured; we re-measure right after construction.
    const displayLabel = getDisplayLabel(npcId);
    this.label = scene.add
      .bitmapText(0, -NPC_LABEL_OFFSET_Y, FONT, displayLabel, FONT_SIZE.caption)
      .setTint(TINT.cream)
      .setOrigin(0.5, 1);
    this.labelBg = scene.add.graphics();
    redrawLabelBg(this.labelBg, this.label);
    // Named NPCs show the tag always; unnamed crowd NPCs only on
    // hover (the existing setLabelVisible(true) path). Default state
    // matches the role.
    const alwaysVisible = ALWAYS_LABELLED_NPCS.includes(npcId);
    this.labelBg.setVisible(alwaysVisible);
    this.label.setVisible(alwaysVisible);
    children.push(this.labelBg);
    children.push(this.label);

    this.add(children);
    this.setSize(16, 20);
    this.setDepth(NPC_SPRITE_DEPTH);
    scene.add.existing(this);
  }

  setLabelVisible(visible: boolean): void {
    // Named NPCs override hover-driven hide — once shown, stay shown.
    if (!visible && ALWAYS_LABELLED_NPCS.includes(this.npcId)) return;
    this.label.setVisible(visible);
    this.labelBg.setVisible(visible);
  }

  setQuestIndicator(active: boolean): void {
    if (active) {
      if (this.questIndicator !== undefined) return;
      // Quest "!" — bitmap font at heading size, saffron tint. The vector
      // path used a 3-px stroke for legibility but bitmap glyphs don't
      // need a stroke (they're already saturated at native res).
      const exc = this.scene.add
        .bitmapText(0, -28, FONT, "!", FONT_SIZE.heading)
        .setTint(TINT.saffron)
        .setOrigin(0.5, 1);
      this.add(exc);
      this.questIndicator = exc;
      // alpha + tiny scale pulse rather than absolute-y; symmetric with the
      // anti-snap-back posture across the codebase.
      this.questIndicatorTween = this.scene.tweens.add({
        targets: exc,
        alpha: { from: 1, to: 0.55 },
        scale: { from: 1, to: 1.08 },
        yoyo: true,
        repeat: -1,
        duration: 700,
        ease: "Sine.InOut",
      });
    } else {
      this.questIndicatorTween?.stop();
      this.questIndicatorTween = undefined;
      this.questIndicator?.destroy();
      this.questIndicator = undefined;
    }
  }

  getDisplayName(): string {
    return getDisplayLabel(this.npcId);
  }

  getGreeting(): ReadonlyArray<string> {
    return NPC_GREETINGS[this.npcId] ?? ["..."];
  }

  /**
   * Trail a moving target for `durationMs` then return to the spawn pose.
   *
   * Whimsy #2 from docs/audit/whimsy-injector.md — "Biscuit trails the
   * player 3s after a pet, then sits and watches you walk off." No
   * reward, no XP, no popup; just a moment of warmth (pillar #8).
   *
   * Implementation: an exponential-damp tween that recomputes the target
   * each frame using a per-frame UPDATE handler. We attach a single
   * timer that fires `detach` at the end of the window, so a second pet
   * within the window simply refreshes the deadline.
   */
  followFor(
    target: Phaser.GameObjects.GameObject & {
      readonly x: number;
      readonly y: number;
    },
    durationMs: number,
  ): void {
    const scene = this.scene;
    if (this.followState !== undefined) {
      // Already following — just extend the deadline.
      this.followState.expiresAt = scene.time.now + durationMs;
      return;
    }
    const onUpdate = (_time: number, _delta: number): void => {
      const state = this.followState;
      if (state === undefined) return;
      if (scene.time.now >= state.expiresAt) {
        scene.events.off(Phaser.Scenes.Events.UPDATE, onUpdate);
        this.followState = undefined;
        return;
      }
      // Exponential damp toward a follow point one tile behind/right of
      // the target. 0.06 = ~60Hz lerp factor; feels like a dog trotting
      // a step behind rather than overlapping the player.
      const lerp = 0.06;
      const desiredX = target.x + 8;
      const desiredY = target.y + 4;
      this.x += (desiredX - this.x) * lerp;
      this.y += (desiredY - this.y) * lerp;
    };
    this.followState = {
      expiresAt: scene.time.now + durationMs,
      onUpdate,
    };
    scene.events.on(Phaser.Scenes.Events.UPDATE, onUpdate);
  }

  /** Active follow handle. Undefined when idle. */
  private followState:
    | {
        expiresAt: number;
        readonly onUpdate: (time: number, delta: number) => void;
      }
    | undefined;

  getInteractPrompt(): string {
    return `Press E to talk to ${getDisplayLabel(this.npcId)}`;
  }
}

function pickFrame(npcId: string): number {
  const override = NPC_FRAME_OVERRIDE[npcId];
  if (override !== undefined) return override;
  const idx = hashString(npcId) % CHARACTER_FRAME_POOL.length;
  return CHARACTER_FRAME_POOL[idx] ?? 84;
}

function pickColor(npcId: string): number {
  const idx = hashString(npcId) % NPC_COLOR_PALETTE.length;
  return NPC_COLOR_PALETTE[idx] ?? 0xffffff;
}

function getDisplayLabel(npcId: string): string {
  return NPC_LABELS[npcId] ?? npcId;
}

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Paint a saffron-stroked indigo round-rect sized to the label's bounds.
 *
 * Phaser BitmapText doesn't carry a built-in background — we draw one
 * with Graphics behind the glyphs. Padding values come straight from the
 * UI audit §3 ({l:6, r:6, t:3, b:3}) — the previous {3,3,1,1} read as a
 * debug AABB.
 */
function redrawLabelBg(
  g: Phaser.GameObjects.Graphics,
  label: Phaser.GameObjects.BitmapText,
): void {
  const padX = 6;
  const padY = 3;
  const r = 3;
  const w = Math.ceil(label.width) + padX * 2;
  const h = Math.ceil(label.height) + padY * 2;
  // Label origin is (0.5, 1) — i.e. centred horizontally, anchored to
  // baseline. We mirror that so the bg hugs the label.
  const x = -w / 2;
  const y = -(h + (label.y - (-NPC_LABEL_OFFSET_Y)));
  g.clear();
  g.fillStyle(PANEL.fill, 0.93);
  g.fillRoundedRect(x, label.y - h, w, h, r);
  g.lineStyle(1, PANEL.stroke, 0.9);
  g.strokeRoundedRect(x, label.y - h, w, h, r);
  void y; // y reserved for future arrow-foot variant; not used today
}
