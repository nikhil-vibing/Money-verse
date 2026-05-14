import * as Phaser from "phaser";
import { addDropShadow } from "../lib/dropShadow";

const FALLBACK_TEXTURE_KEY = "player-fallback";
const CHARACTERS_KEY = "characters";
const PLAYER_FRAME = 97;
const PLAYER_WIDTH = 16;
const PLAYER_HEIGHT = 16;
const SPRITE_SCALE = 1.6;
const WALK_VELOCITY = 120;
const SPRINT_VELOCITY = 160;
const PLAYER_FILL_COLOR = 0xf7b733;
const PLAYER_OUTLINE_COLOR = 0x1a0a26;
const JOYSTICK_DEADZONE_PX = 12;
const JOYSTICK_MAX_PX = 60;
const SHADOW_FILL = 0x000000;
const SHADOW_ALPHA = 0.28;

export type PlayerDirection = "up" | "down" | "left" | "right";

interface JoystickState {
  readonly active: boolean;
  readonly originX: number;
  readonly originY: number;
  readonly dx: number;
  readonly dy: number;
}

const IDLE_JOYSTICK: JoystickState = {
  active: false,
  originX: 0,
  originY: 0,
  dx: 0,
  dy: 0,
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private wasd:
    | {
        readonly up: Phaser.Input.Keyboard.Key;
        readonly down: Phaser.Input.Keyboard.Key;
        readonly left: Phaser.Input.Keyboard.Key;
        readonly right: Phaser.Input.Keyboard.Key;
        readonly sprint: Phaser.Input.Keyboard.Key;
      }
    | undefined;
  private joystick: JoystickState = IDLE_JOYSTICK;
  private facing: PlayerDirection = "down";
  private shadow: Phaser.GameObjects.Ellipse | undefined;
  private idleTween: Phaser.Tweens.Tween | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const useSheet = scene.textures.exists(CHARACTERS_KEY);
    if (useSheet) {
      super(scene, x, y, CHARACTERS_KEY, PLAYER_FRAME);
    } else {
      Player.ensureFallbackTexture(scene);
      super(scene, x, y, FALLBACK_TEXTURE_KEY);
    }

    this.setScale(useSheet ? SPRITE_SCALE : 1);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // α-1: prefer Phaser preFX drop-shadow. Keep ellipse fallback for older
    // builds / low tier so the player still has visual weight on the ground.
    const preFxShadowAdded = addDropShadow(this);
    if (!preFxShadowAdded) {
      this.shadow = scene.add
        .ellipse(x, y + 6, 14, 5, SHADOW_FILL, SHADOW_ALPHA)
        .setDepth(45);
    }

    // α-4 carry-over: a saffron tint was applied over Kenney's grey/brown
    // knight in Phase α to give the bloom pass a high-luminance target. The
    // Ninja Adventure player sprite (green knight, frame 97) already has
    // its own rim-light + saturated palette so the explicit tint was
    // removed in Phase β. Leaving the sprite untinted lets the NA palette
    // carry the look.

    this.setOrigin(0.5, 0.85);
    this.setDepth(50);

    const body = this.body as Phaser.Physics.Arcade.Body | null;
    if (body !== null) {
      body.setSize(PLAYER_WIDTH - 4, 6);
      body.setOffset(2, PLAYER_HEIGHT - 6);
      body.setCollideWorldBounds(true);
    }

    this.startIdle(scene);
    this.bindInputs(scene);
  }

  private static ensureFallbackTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists(FALLBACK_TEXTURE_KEY)) return;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(PLAYER_OUTLINE_COLOR, 1);
    g.fillRect(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
    g.fillStyle(PLAYER_FILL_COLOR, 1);
    g.fillRect(1, 1, PLAYER_WIDTH - 2, PLAYER_HEIGHT - 2);
    g.generateTexture(FALLBACK_TEXTURE_KEY, PLAYER_WIDTH, PLAYER_HEIGHT);
    g.destroy();
  }

  private startIdle(scene: Phaser.Scene): void {
    // scaleY pulse instead of y-position tween: an absolute-y tween captures
    // the spawn y and snaps the player back to it on resume after movement.
    // A scale pulse reads as "breathing" without ever touching the physics
    // body's coordinates.
    this.idleTween = scene.tweens.add({
      targets: this,
      scaleY: { from: SPRITE_SCALE, to: SPRITE_SCALE * 0.97 },
      yoyo: true,
      duration: 1100,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  private bindInputs(scene: Phaser.Scene): void {
    const keyboard = scene.input.keyboard;
    if (keyboard !== null) {
      this.cursors = keyboard.createCursorKeys();
      this.wasd = {
        up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        sprint: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      };
    }

    scene.input.on("pointerdown", this.onPointerDown, this);
    scene.input.on("pointermove", this.onPointerMove, this);
    scene.input.on("pointerup", this.onPointerUp, this);

    // B1 (Knuth audit): symmetric teardown of the three pointer handlers so
    // they don't accumulate across scene restarts (phantom-joystick bug).
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.off("pointerdown", this.onPointerDown, this);
      scene.input.off("pointermove", this.onPointerMove, this);
      scene.input.off("pointerup", this.onPointerUp, this);
    });
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.x > this.scene.scale.width / 2) return;
    this.joystick = {
      active: true,
      originX: pointer.x,
      originY: pointer.y,
      dx: 0,
      dy: 0,
    };
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.joystick.active) return;
    this.joystick = {
      ...this.joystick,
      dx: pointer.x - this.joystick.originX,
      dy: pointer.y - this.joystick.originY,
    };
  }

  private onPointerUp(): void {
    this.joystick = IDLE_JOYSTICK;
  }

  getFacing(): PlayerDirection {
    return this.facing;
  }

  override update(): void {
    const move = this.readMoveVector();
    const isSprinting = this.wasd?.sprint.isDown ?? false;
    const speed = isSprinting ? SPRINT_VELOCITY : WALK_VELOCITY;

    const body = this.body as Phaser.Physics.Arcade.Body | null;
    if (body === null) return;

    const moving = move.x !== 0 || move.y !== 0;

    if (!moving) {
      body.setVelocity(0, 0);
      this.syncShadow();
      return;
    }

    const length = Math.hypot(move.x, move.y);
    const nx = move.x / length;
    const ny = move.y / length;
    body.setVelocity(nx * speed, ny * speed);

    this.facing = pickFacing(nx, ny, this.facing);
    if (nx !== 0) this.setFlipX(nx < 0);
    this.syncShadow();
  }

  private syncShadow(): void {
    const s = this.shadow;
    if (s === undefined) return;
    s.setPosition(this.x, this.y + 4);
  }

  private readMoveVector(): { readonly x: number; readonly y: number } {
    const keyboardVec = this.readKeyboardVector();
    if (keyboardVec.x !== 0 || keyboardVec.y !== 0) return keyboardVec;
    return this.readJoystickVector();
  }

  private readKeyboardVector(): { readonly x: number; readonly y: number } {
    let x = 0;
    let y = 0;
    const cursors = this.cursors;
    const wasd = this.wasd;
    if (cursors?.left.isDown || wasd?.left.isDown) x -= 1;
    if (cursors?.right.isDown || wasd?.right.isDown) x += 1;
    if (cursors?.up.isDown || wasd?.up.isDown) y -= 1;
    if (cursors?.down.isDown || wasd?.down.isDown) y += 1;
    return { x, y };
  }

  private readJoystickVector(): { readonly x: number; readonly y: number } {
    if (!this.joystick.active) return { x: 0, y: 0 };
    const { dx, dy } = this.joystick;
    const mag = Math.hypot(dx, dy);
    if (mag < JOYSTICK_DEADZONE_PX) return { x: 0, y: 0 };
    const clamped = Math.min(mag, JOYSTICK_MAX_PX) / JOYSTICK_MAX_PX;
    return { x: (dx / mag) * clamped, y: (dy / mag) * clamped };
  }
}

function pickFacing(
  nx: number,
  ny: number,
  current: PlayerDirection,
): PlayerDirection {
  if (Math.abs(nx) > Math.abs(ny)) {
    if (nx > 0) return "right";
    if (nx < 0) return "left";
    return current;
  }
  if (ny > 0) return "down";
  if (ny < 0) return "up";
  return current;
}
