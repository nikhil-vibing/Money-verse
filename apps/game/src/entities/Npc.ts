import * as Phaser from "phaser";
import { addDropShadow } from "../lib/dropShadow";

const NPC_LABEL_OFFSET_Y = 18;
const NPC_SPRITE_DEPTH = 40;
const NPC_SHADOW_DEPTH = 35;
const CHARACTERS_KEY = "characters";
const SHADOW_FILL = 0x000000;
const SHADOW_ALPHA = 0.28;
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
  private readonly label: Phaser.GameObjects.Text;
  private readonly bodyGo: Phaser.GameObjects.GameObject;
  private readonly shadow: Phaser.GameObjects.Ellipse | undefined;
  private idleTween: Phaser.Tweens.Tween | undefined;
  private questIndicator: Phaser.GameObjects.Text | undefined;
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
      this.idleTween = scene.tweens.add({
        targets: sprite,
        y: { from: 0, to: -1 },
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

    this.label = scene.add
      .text(0, -NPC_LABEL_OFFSET_Y, getDisplayLabel(npcId), {
        fontSize: "6px",
        color: "#f5f1ea",
        fontFamily: "monospace",
        backgroundColor: "#1a0a26e0",
        padding: { left: 3, right: 3, top: 1, bottom: 1 },
      })
      .setOrigin(0.5, 1)
      .setVisible(false);
    children.push(this.label);

    this.add(children);
    this.setSize(16, 20);
    this.setDepth(NPC_SPRITE_DEPTH);
    scene.add.existing(this);
  }

  setLabelVisible(visible: boolean): void {
    this.label.setVisible(visible);
  }

  setQuestIndicator(active: boolean): void {
    if (active) {
      if (this.questIndicator !== undefined) return;
      const exc = this.scene.add
        .text(0, -28, "!", {
          fontSize: "11px",
          color: "#f7b733",
          fontFamily: "monospace",
          fontStyle: "bold",
          stroke: "#1a0a26",
          strokeThickness: 3,
        })
        .setOrigin(0.5, 1);
      this.add(exc);
      this.questIndicator = exc;
      this.questIndicatorTween = this.scene.tweens.add({
        targets: exc,
        y: { from: -28, to: -32 },
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
