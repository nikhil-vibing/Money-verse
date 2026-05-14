import * as Phaser from "phaser";

export type InteractZoneKind = "door" | "shop" | "prop" | "quest-trigger";

const PROMPTS: Readonly<Record<InteractZoneKind, string>> = {
  door: "Press E to enter",
  shop: "Press E to talk",
  prop: "Press E to use",
  "quest-trigger": "Press E to start",
};

/**
 * Minimum physics-body size on touch devices.
 *
 * WCAG 2.2 SC 2.5.8 (Target Size Minimum) requires touch targets ≥24×24 CSS
 * px. We inflate to 32 to give comfortable headroom while keeping the visual
 * authoring rect (typically 16×16 in Tiled) unchanged.
 */
const TOUCH_MIN_HITBOX = 32;

export interface InteractZoneOptions {
  readonly id: string;
  readonly kind: InteractZoneKind;
  readonly target: string;
  readonly locked?: boolean;
  readonly unlockQuest?: string;
}

export class InteractZone extends Phaser.GameObjects.Zone {
  readonly zoneId: string;
  readonly kind: InteractZoneKind;
  readonly target: string;
  readonly prompt: string;
  readonly locked: boolean;
  readonly unlockQuest: string | undefined;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    opts: InteractZoneOptions,
  ) {
    super(scene, x + width / 2, y + height / 2, width, height);
    this.zoneId = opts.id;
    this.kind = opts.kind;
    this.target = opts.target;
    this.prompt = PROMPTS[opts.kind];
    this.locked = opts.locked ?? false;
    this.unlockQuest = opts.unlockQuest;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    if (isTouchDevice()) {
      this.inflateTouchHitbox(width, height);
    }
  }

  private inflateTouchHitbox(width: number, height: number): void {
    const body = this.body as Phaser.Physics.Arcade.StaticBody | null;
    if (body === null) return;
    const padX = Math.max(0, TOUCH_MIN_HITBOX - width);
    const padY = Math.max(0, TOUCH_MIN_HITBOX - height);
    if (padX === 0 && padY === 0) return;
    const newW = width + padX;
    const newH = height + padY;
    body.setSize(newW, newH);
    // Re-center the inflated body around the zone's existing center so the
    // visual rect remains authoritative for layout but the touch target
    // grows symmetrically.
    body.position.set(this.x - newW / 2, this.y - newH / 2);
    body.updateCenter();
  }
}

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)
  );
}
