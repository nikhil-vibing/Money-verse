import * as Phaser from "phaser";
import { Player } from "../entities/Player";
import { Npc } from "../entities/Npc";
import { JarOfAchaar } from "../entities/JarOfAchaar";
import {
  InteractZone,
  type InteractZoneKind,
} from "../entities/InteractZone";
import {
  CHAWL_TILESET_KEY,
  CHAWL_TILESET_NAME,
} from "./PreloadScene";
import {
  ensureGreyboxTileset,
  GREYBOX_TILESET_KEY,
} from "../entities/greyboxTileset";
import { announce } from "../lib/announce";
import { getAssistMode, subscribeAssistMode } from "../lib/assist";
import { detectPerfTier } from "../pipelines/PostFxStack";
import { attachAmbientParticles } from "../lib/ambientParticles";
import { attachDuskPass } from "../lib/duskPass";
import { StoryDirector } from "../lib/storyDirector";
import { CHAWL_ONBOARDING_SEQUENCE } from "../content/chawlOnboarding";
import { FONT, FONT_SIZE, TINT } from "../ui/tokens";

interface WorldSceneData {
  readonly districtId: string;
}

interface DistrictMeta {
  readonly id: string;
  readonly tileSize: number;
  readonly widthTiles: number;
  readonly heightTiles: number;
  readonly spawnPoint: { readonly x: number; readonly y: number };
  readonly exits: ReadonlyArray<{
    readonly id: string;
    readonly x: number;
    readonly y: number;
    readonly target: string;
    readonly requires_unlock?: boolean;
  }>;
}

const RENDER_LAYERS: ReadonlyArray<string> = ["ground", "walls", "props"];
const COLLISION_LAYER = "collision";
const NPC_LAYER = "npc-spawns";
const INTERACT_LAYER = "interact-zones";
const QUEST_LAYER = "quest-locations";
const CAMERA_EASE = 0.1;
const PROMPT_COOLDOWN_MS = 250;
const ASSIST_PROMPT_COOLDOWN_MS = 800;
const BANK_BAZAAR_TARGET = "bank-bazaar";
const NPC_INTERACT_RADIUS_PX = 36;
const QUEST_GIVER_NPC_ID = "maya-didi";
/** Whimsy #2 — Biscuit trails the player for 3s after a pet. */
const BISCUIT_FOLLOW_MS = 3000;
/** Whimsy #3 — Mom's landline rings after 5min of inactivity. */
const MAA_STALL_MS = 5 * 60 * 1000;
/** Whimsy share-move — Mom's achaar jar appears after 10 real minutes. */
const ACHAAR_JAR_DELAY_MS = 10 * 60 * 1000;

export class WorldScene extends Phaser.Scene {
  private districtId = "chawl-mohalla";
  private activeNpc: Npc | undefined;
  private lastActiveNpcId: string | undefined;
  private inDialog = false;
  private player: Player | undefined;
  private npcs: ReadonlyArray<Npc> = [];
  private interactZones: ReadonlyArray<InteractZone> = [];
  private activeZone: InteractZone | undefined;
  private lastPromptEmitAt = 0;
  private prefersReducedMotion = false;
  private assistMode = false;
  private unsubscribeAssist: (() => void) | undefined;
  private detachAmbient: (() => void) | undefined;
  private detachDusk: (() => void) | undefined;
  private storyDirector: StoryDirector | undefined;
  private storyActive = false;
  /** Named handlers — referenced by both `on` and SHUTDOWN `off`. B2 fix. */
  private onStoryDialogOpen: (() => void) | undefined;
  private onStoryDialogClose: (() => void) | undefined;
  /** Last time the player interacted with anything. Stall timer baseline. */
  private lastInteractAt = 0;
  /** Whether Mom's stall interrupt has already fired this session. */
  private maaInterruptFired = false;
  /** The jar of achaar — undefined until ACHAAR_JAR_DELAY_MS has elapsed. */
  private achaarJar: JarOfAchaar | undefined;
  /** Spawn-on-timer handle; cancelled on shutdown. */
  private achaarJarTimer: Phaser.Time.TimerEvent | undefined;

  constructor() {
    super({ key: "World" });
  }

  init(data: WorldSceneData): void {
    this.districtId = data.districtId ?? "chawl-mohalla";
    this.prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  create(): void {
    this.assistMode = getAssistMode();
    this.unsubscribeAssist = subscribeAssistMode((enabled) => {
      this.assistMode = enabled;
      this.applyCameraFollow();
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.unsubscribeAssist?.();
      this.unsubscribeAssist = undefined;
      this.detachAmbient?.();
      this.detachAmbient = undefined;
      this.detachDusk?.();
      this.detachDusk = undefined;
      // Knuth B2: detach story dialog handlers so they can't fire on a
      // dead scene reference after a `scene.restart`. Pre-2026-05 these
      // listeners were anonymous arrows and never unbound — the captured
      // `this` pinned the prior WorldScene in memory.
      if (this.onStoryDialogOpen !== undefined) {
        this.events.off("story:dialog-open", this.onStoryDialogOpen);
        this.onStoryDialogOpen = undefined;
      }
      if (this.onStoryDialogClose !== undefined) {
        this.events.off("story:dialog-close", this.onStoryDialogClose);
        this.onStoryDialogClose = undefined;
      }
      this.achaarJarTimer?.remove(false);
      this.achaarJarTimer = undefined;
    });
    const meta = this.cache.json.get("district-meta") as
      | DistrictMeta
      | undefined;
    if (meta === undefined) {
      this.showLoadError("Missing district meta");
      return;
    }

    const realTilesetReady = this.textures.exists(CHAWL_TILESET_KEY);
    const tilesetKey = realTilesetReady
      ? CHAWL_TILESET_KEY
      : GREYBOX_TILESET_KEY;
    if (!realTilesetReady) {
      // Fallback: keep the procedural greybox alive only if the real atlas
      // failed to load. This preserves a renderable map for debugging.
      ensureGreyboxTileset(this);
    }

    const map = this.make.tilemap({ key: "district-map" });
    const tileset = map.addTilesetImage(
      CHAWL_TILESET_NAME,
      tilesetKey,
      meta.tileSize,
      meta.tileSize,
      0,
      0,
    );
    if (tileset === null) {
      this.showLoadError("Failed to bind tileset");
      return;
    }

    const renderedLayers = this.createRenderLayers(map, tileset);
    const collisionShapes = this.buildCollisionFromLayer(map);
    const archwayBlock = this.maybeBuildArchwayLock(meta);

    const spawn = meta.spawnPoint;
    const player = new Player(this, spawn.x, spawn.y);
    this.player = player;

    const npcs = this.spawnNpcs(map);
    this.npcs = npcs;

    const zones = this.spawnInteractZones(map);
    this.interactZones = zones;

    this.spawnQuestAnchors(map);

    this.configurePhysics(player, npcs, zones, collisionShapes, archwayBlock);

    this.configureCamera(map);
    // α-2: ambient dust-mote layer per district. Low tier is auto-skipped.
    if (!this.prefersReducedMotion) {
      this.detachAmbient = attachAmbientParticles(
        this,
        map.widthInPixels,
        map.heightInPixels,
      );
    }
    this.bindInteractKey();
    this.bindWindowEvents();
    this.game.events.emit("world:ready", {
      districtId: this.districtId,
      mapWidthPx: map.widthInPixels,
      mapHeightPx: map.heightInPixels,
    });
    this.startOnboardingStory();
    this.scheduleAchaarJar();
    this.lastInteractAt = this.time.now;
    void renderedLayers;
  }

  override update(): void {
    this.player?.update();
    this.refreshActiveNpc();
    this.refreshMaaInterrupt();
    this.refreshAchaarJarRange();
    this.refreshActiveZone();
    this.emitMinimapTick();
  }

  /**
   * Start the data-driven onboarding sequence. The director owns the
   * objective banner, quest indicator, dialog flow, currency grant and
   * EnvelopeScene hand-off — WorldScene only contributes the NPC
   * registry lookup so beats can target NPCs by id.
   */
  private startOnboardingStory(): void {
    // β-bootstrap guard — don't replay onboarding for returning players.
    const alreadyOnboarded = this.registry.get("chawlOnboardingDone") === true;
    if (alreadyOnboarded) return;

    this.storyActive = true;
    // Pause player + NPC tracking while director dialog is open so the
    // player can't wander out of the conversation. Director emits these
    // events around every `say`/`narrate` beat. Named arrow handlers
    // bound to fields so the SHUTDOWN once-handler can `off` them — see
    // Knuth audit B2. The arrow form still captures `this`, but only
    // *until* SHUTDOWN explicitly drops the references; the prior
    // anonymous form never dropped them.
    this.onStoryDialogOpen = () => {
      this.inDialog = true;
    };
    this.onStoryDialogClose = () => {
      this.inDialog = false;
    };
    this.events.on("story:dialog-open", this.onStoryDialogOpen);
    this.events.on("story:dialog-close", this.onStoryDialogClose);
    const director = new StoryDirector({
      scene: this,
      lookupNpc: (npcId) => this.npcs.find((n) => n.npcId === npcId),
    });
    this.storyDirector = director;
    director
      .run(CHAWL_ONBOARDING_SEQUENCE)
      .then(() => {
        this.storyActive = false;
        this.registry.set("chawlOnboardingDone", true);
      })
      .catch(() => {
        this.storyActive = false;
      });
  }

  private refreshActiveNpc(): void {
    const player = this.player;
    if (player === undefined || this.inDialog) {
      this.setActiveNpc(undefined);
      return;
    }
    let nearest: Npc | undefined;
    let nearestDistSq = NPC_INTERACT_RADIUS_PX * NPC_INTERACT_RADIUS_PX;
    for (const npc of this.npcs) {
      const dx = npc.x - player.x;
      const dy = npc.y - player.y;
      const d = dx * dx + dy * dy;
      if (d < nearestDistSq) {
        nearestDistSq = d;
        nearest = npc;
      }
    }
    this.setActiveNpc(nearest);
  }

  private setActiveNpc(next: Npc | undefined): void {
    if (next === this.activeNpc) return;
    this.activeNpc?.setLabelVisible(false);
    this.activeNpc = next;
    if (next === undefined) {
      if (this.lastActiveNpcId !== undefined) {
        this.scene.get("UI").events.emit("interact:hide");
        this.lastActiveNpcId = undefined;
      }
      return;
    }
    next.setLabelVisible(true);
    this.lastActiveNpcId = next.npcId;
    this.scene.get("UI").events.emit("interact:show", {
      prompt: next.getInteractPrompt(),
      target: next.npcId,
      kind: "talk",
    });
  }

  private createRenderLayers(
    map: Phaser.Tilemaps.Tilemap,
    tileset: Phaser.Tilemaps.Tileset,
  ): ReadonlyArray<Phaser.Tilemaps.TilemapLayer> {
    const layers: Array<Phaser.Tilemaps.TilemapLayer> = [];
    for (let i = 0; i < RENDER_LAYERS.length; i += 1) {
      const name = RENDER_LAYERS[i];
      if (name === undefined) continue;
      const layer = map.createLayer(name, tileset, 0, 0);
      if (layer === null) continue;
      layer.setDepth(i * 10);
      layers.push(layer);
    }
    return layers;
  }

  private buildCollisionFromLayer(
    map: Phaser.Tilemaps.Tilemap,
  ): ReadonlyArray<Phaser.GameObjects.Rectangle> {
    const collisionLayer = map.getLayer(COLLISION_LAYER);
    if (collisionLayer === null) return [];
    const tileSize = map.tileWidth;
    const shapes: Array<Phaser.GameObjects.Rectangle> = [];

    for (let row = 0; row < collisionLayer.data.length; row += 1) {
      const rowData = collisionLayer.data[row];
      if (rowData === undefined) continue;
      for (let col = 0; col < rowData.length; col += 1) {
        const tile = rowData[col];
        if (tile === undefined) continue;
        if (tile.index <= 0) continue;
        const cx = col * tileSize + tileSize / 2;
        const cy = row * tileSize + tileSize / 2;
        const rect = this.add
          .rectangle(cx, cy, tileSize, tileSize, 0xff0000, 0)
          .setVisible(false);
        this.physics.add.existing(rect, true);
        shapes.push(rect);
      }
    }
    return shapes;
  }

  private maybeBuildArchwayLock(
    meta: DistrictMeta,
  ): Phaser.GameObjects.Rectangle | undefined {
    const unlocked = this.readUnlockedDistricts();
    if (unlocked.includes(BANK_BAZAAR_TARGET)) return undefined;
    const archExit = meta.exits.find((e) => e.target === BANK_BAZAAR_TARGET);
    if (archExit === undefined) return undefined;
    const tileSize = meta.tileSize;
    const block = this.add
      .rectangle(
        archExit.x + tileSize,
        archExit.y + tileSize / 2,
        tileSize * 2,
        tileSize,
        0x1a0a26,
        0.6,
      )
      .setStrokeStyle(1, 0xf7b733, 0.8);
    this.physics.add.existing(block, true);
    return block;
  }

  private readUnlockedDistricts(): ReadonlyArray<string> {
    const raw = this.registry.get("unlocked") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter((entry): entry is string => typeof entry === "string");
  }

  private spawnNpcs(map: Phaser.Tilemaps.Tilemap): ReadonlyArray<Npc> {
    const layer = map.getObjectLayer(NPC_LAYER);
    if (layer === null) return [];
    const out: Array<Npc> = [];
    for (const obj of layer.objects) {
      const npcId = readStringProperty(obj.properties, "npcId");
      if (npcId === undefined) continue;
      const x = (obj.x ?? 0) + (obj.width ?? 16) / 2;
      const y = (obj.y ?? 0) + (obj.height ?? 16) / 2;
      out.push(new Npc(this, x, y, npcId));
    }
    return out;
  }

  private spawnInteractZones(
    map: Phaser.Tilemaps.Tilemap,
  ): ReadonlyArray<InteractZone> {
    const layer = map.getObjectLayer(INTERACT_LAYER);
    if (layer === null) return [];
    const out: Array<InteractZone> = [];
    for (const obj of layer.objects) {
      const kindRaw = readStringProperty(obj.properties, "kind");
      const target = readStringProperty(obj.properties, "target") ?? "";
      const locked = readBoolProperty(obj.properties, "locked") ?? false;
      const unlockQuest = readStringProperty(obj.properties, "unlockQuest");
      if (kindRaw === undefined) continue;
      if (!isInteractKind(kindRaw)) continue;
      const id = obj.name ?? `zone-${obj.id ?? "unknown"}`;
      const zone = new InteractZone(
        this,
        obj.x ?? 0,
        obj.y ?? 0,
        obj.width ?? 16,
        obj.height ?? 16,
        { id, kind: kindRaw, target, locked, unlockQuest },
      );
      out.push(zone);
    }
    return out;
  }

  private spawnQuestAnchors(map: Phaser.Tilemaps.Tilemap): void {
    const layer = map.getObjectLayer(QUEST_LAYER);
    if (layer === null) return;
    const anchors: Array<{
      readonly questId: string;
      readonly x: number;
      readonly y: number;
    }> = [];
    for (const obj of layer.objects) {
      const questId = readStringProperty(obj.properties, "questId");
      if (questId === undefined) continue;
      anchors.push({
        questId,
        x: (obj.x ?? 0) + (obj.width ?? 16) / 2,
        y: (obj.y ?? 0) + (obj.height ?? 16) / 2,
      });
    }
    this.game.events.emit("quests:anchors", anchors);
  }

  private configurePhysics(
    player: Player,
    npcs: ReadonlyArray<Npc>,
    zones: ReadonlyArray<InteractZone>,
    collisionShapes: ReadonlyArray<Phaser.GameObjects.Rectangle>,
    archwayBlock: Phaser.GameObjects.Rectangle | undefined,
  ): void {
    if (collisionShapes.length > 0) {
      this.physics.add.collider(player, [...collisionShapes]);
    }
    if (archwayBlock !== undefined) {
      this.physics.add.collider(player, archwayBlock);
    }
    if (zones.length > 0) {
      this.physics.add.overlap(
        player,
        [...zones],
        (_p, z) => this.onZoneOverlap(z as InteractZone),
        undefined,
        this,
      );
    }
    void npcs;
  }

  private onZoneOverlap(zone: InteractZone): void {
    this.activeZone = zone;
  }

  private refreshActiveZone(): void {
    const now = this.time.now;
    const cooldown = this.assistMode
      ? ASSIST_PROMPT_COOLDOWN_MS
      : PROMPT_COOLDOWN_MS;
    if (now - this.lastPromptEmitAt < cooldown) return;
    this.lastPromptEmitAt = now;
    const zone = this.activeZone;
    const player = this.player;
    if (zone === undefined || player === undefined) {
      this.scene.get("UI").events.emit("interact:hide");
      return;
    }
    if (!isPlayerOnZone(player, zone)) {
      this.activeZone = undefined;
      this.scene.get("UI").events.emit("interact:hide");
      return;
    }
    this.scene.get("UI").events.emit("interact:show", {
      prompt: zone.prompt,
      target: zone.target,
      kind: zone.kind,
    });
  }

  private emitMinimapTick(): void {
    const player = this.player;
    if (player === undefined) return;
    this.scene.get("UI").events.emit("minimap:tick", {
      x: player.x,
      y: player.y,
    });
  }

  /**
   * Whimsy #3 — Mom's landline rings after ≥5 real-time minutes of
   * inactivity *during onboarding only*. Once per session. No popup
   * machinery; just routes through the existing DialogScene so it
   * reads exactly like every other line in the game.
   */
  private refreshMaaInterrupt(): void {
    if (this.maaInterruptFired) return;
    if (this.inDialog) return;
    if (!this.storyActive) return; // only during onboarding
    if (this.time.now - this.lastInteractAt < MAA_STALL_MS) return;
    this.maaInterruptFired = true;
    const dialog = this.scene.get("Dialog");
    dialog.events.emit("dialog:show", {
      speaker: "Ma",
      lines: ["Are you busy? Tell me.", "Did you eat?"],
      onClose: () => {
        this.lastInteractAt = this.time.now;
      },
    });
  }

  /**
   * Whimsy share-move — schedule the achaar jar to appear after
   * ACHAAR_JAR_DELAY_MS. The promise was made during the onboarding
   * (implicitly — Wren mentions Mom) and the jar is the game keeping
   * that promise without dialog. Pillar #8: no popup, no XP.
   */
  private scheduleAchaarJar(): void {
    const registry = this.registry;
    const promisedAtRaw = registry.get("maaAchaarPromisedAt") as unknown;
    const promisedAt =
      typeof promisedAtRaw === "number" ? promisedAtRaw : Date.now();
    registry.set("maaAchaarPromisedAt", promisedAt);
    const elapsed = Date.now() - promisedAt;
    const remaining = Math.max(0, ACHAAR_JAR_DELAY_MS - elapsed);
    this.achaarJarTimer = this.time.delayedCall(remaining, () =>
      this.spawnAchaarJar(),
    );
  }

  private spawnAchaarJar(): void {
    if (this.achaarJar !== undefined) return;
    // Place it on the player's kholi table — a couple tiles away from
    // the spawn point. The current map's spawn is (480, 320); a 16-px
    // tile shift puts it just east on the same row, which lands on the
    // table per the Tiled props layout. We don't read the table tile
    // explicitly because the map doesn't tag it — this is a
    // best-effort placement that lands inside the kholi for v1.
    const spawn = (this.cache.json.get("district-meta") as DistrictMeta)
      ?.spawnPoint ?? { x: 480, y: 320 };
    const jarX = spawn.x + 24;
    const jarY = spawn.y - 4;
    this.achaarJar = new JarOfAchaar(this, jarX, jarY);
  }

  private refreshAchaarJarRange(): void {
    const jar = this.achaarJar;
    const player = this.player;
    if (jar === undefined || player === undefined) return;
    if (!jar.isInReadRange(player.x, player.y)) return;
    // Only show the read prompt when nothing else is competing for the
    // interact bar (active NPC, active zone). The label flickers on its
    // own when the player presses E, so we just route the prompt here.
    if (this.activeNpc !== undefined) return;
    if (this.activeZone !== undefined) return;
    this.scene.get("UI").events.emit("interact:show", {
      prompt: "Press E to read",
      target: "achaar-jar",
      kind: "prop",
    });
  }

  private configureCamera(map: Phaser.Tilemaps.Tilemap): void {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cam.setRoundPixels(true);
    cam.setZoom(3);
    cam.setBackgroundColor(0x14092a);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.applyCameraFollow();
    this.applyCameraPostFx(map);
  }

  /**
   * 2026-era lift via Phaser built-in postFX. Stack order matters — bloom
   * first to seize highlights, then vignette, then ColorMatrix for warm
   * saturation. The gradient pass is tuned softer than the brief's 0.22
   * because the Ninja Adventure substrate is much brighter than the prior
   * Kenney palette and a strong dusk tint murders the green grass.
   * Gated on perf tier — Moto G4 / low tier gets none.
   */
  private applyCameraPostFx(map: Phaser.Tilemaps.Tilemap): void {
    const tier = detectPerfTier();
    if (tier === "low") return;
    if (this.prefersReducedMotion) return;
    const cam = this.cameras.main;
    // Order matters: bloom first to seize highlights, then dusk grade
    // bakes the warm-saffron palette, then the player-tracked light
    // mask multiplies the ambient dim back in (replacing the old
    // static vignette — see docs/audit/technical-artist.md).
    cam.postFX.addBloom(0xffe9a3, 0.6, 0.6, 1.0, 0.35, 4);
    cam.postFX.addColorMatrix().saturate(0.1, true);
    // MOVE 2 from the bundled PR — the dusk pass. Player-tracked
    // radial light mask + warm-saffron grade + emissive shop windows.
    // The detach handle is wired into the existing SHUTDOWN cleanup
    // so the RenderTextures + per-frame update hook can't leak.
    const player = this.player;
    if (player === undefined) return;
    this.detachDusk = attachDuskPass(this, {
      mapWidthPx: map.widthInPixels,
      mapHeightPx: map.heightInPixels,
      target: player,
      map,
    }).detach;
  }

  private applyCameraFollow(): void {
    const cam = this.cameras.main;
    const player = this.player;
    if (cam === undefined || player === undefined) return;
    // Assist mode and reduced-motion both pin the camera (no ease) so users
    // sensitive to motion or with low motor control aren't fighting the lag.
    const pinned = this.prefersReducedMotion || this.assistMode;
    if (pinned) {
      cam.startFollow(player, true, 1, 1);
    } else {
      cam.startFollow(player, true, CAMERA_EASE, CAMERA_EASE);
    }
  }

  private bindInteractKey(): void {
    const keyboard = this.input.keyboard;
    if (keyboard === null) return;
    keyboard.on("keydown-E", () => this.handleInteract());
    keyboard.on("keydown-SPACE", () => {
      if (this.inDialog) return;
      this.handleInteract();
    });
  }

  private handleInteract(): void {
    this.lastInteractAt = this.time.now;
    const npc = this.activeNpc;
    if (npc !== undefined && !this.inDialog) {
      this.openDialogFor(npc);
      return;
    }
    const zone = this.activeZone;
    if (zone !== undefined) {
      this.game.events.emit("interact:invoke", {
        zoneId: zone.zoneId,
        kind: zone.kind,
        target: zone.target,
        locked: zone.locked,
      });
      return;
    }
    // Whimsy share-move — pressing E near the achaar jar flickers its
    // hand-written marker for ~2s. Pillar #8: no popup, no XP, no toast.
    const jar = this.achaarJar;
    const player = this.player;
    if (jar !== undefined && player !== undefined) {
      if (jar.isInReadRange(player.x, player.y)) {
        jar.revealLabel();
      }
    }
  }

  private openDialogFor(npc: Npc): void {
    // When the director is active, redirect the talk into the story
    // pipeline so the next `wait-for-interact` beat resolves. The
    // director itself controls what dialog appears next.
    if (this.storyActive) {
      this.game.events.emit("story:npc-interacted", npc.npcId);
      return;
    }

    // Whimsy #2 — Biscuit trails the player for 3s after a pet. No XP,
    // no reward, no popup. Triggered before the dialog so the trail
    // starts while the player reads "*wags tail*".
    if (npc.npcId === "biscuit" && this.player !== undefined) {
      npc.followFor(this.player, BISCUIT_FOLLOW_MS);
    }

    this.inDialog = true;
    this.scene.get("UI").events.emit("interact:hide");
    const dialog = this.scene.get("Dialog");
    dialog.events.emit("dialog:show", {
      speaker: npc.getDisplayName(),
      lines: [...npc.getGreeting()],
      onClose: () => {
        this.inDialog = false;
        if (npc.npcId === QUEST_GIVER_NPC_ID) {
          npc.setQuestIndicator(false);
        }
      },
    });
  }

  private bindWindowEvents(): void {
    this.scale.on("resize", () => {
      this.cameras.main.setSize(this.scale.width, this.scale.height);
    });
  }

  private showLoadError(msg: string): void {
    this.add
      .bitmapText(
        this.scale.width / 2,
        this.scale.height / 2,
        FONT,
        msg,
        FONT_SIZE.display,
      )
      .setTint(TINT.saffron)
      .setOrigin(0.5);
    announce(msg, "assertive");
  }
}

function isInteractKind(value: string): value is InteractZoneKind {
  return (
    value === "door" ||
    value === "shop" ||
    value === "prop" ||
    value === "quest-trigger"
  );
}

function readStringProperty(props: unknown, name: string): string | undefined {
  const value = readRawProperty(props, name);
  return typeof value === "string" ? value : undefined;
}

function readBoolProperty(props: unknown, name: string): boolean | undefined {
  const value = readRawProperty(props, name);
  return typeof value === "boolean" ? value : undefined;
}

function readRawProperty(props: unknown, name: string): unknown {
  if (!Array.isArray(props)) return undefined;
  for (const entry of props) {
    if (entry === null || typeof entry !== "object") continue;
    const record = entry as { name?: unknown; value?: unknown };
    if (record.name === name) return record.value;
  }
  return undefined;
}

function isPlayerOnZone(
  player: Phaser.GameObjects.GameObject & {
    readonly x: number;
    readonly y: number;
  },
  zone: InteractZone,
): boolean {
  const half = { w: zone.width / 2, h: zone.height / 2 };
  const dx = Math.abs(player.x - zone.x);
  const dy = Math.abs(player.y - zone.y);
  return dx <= half.w + 6 && dy <= half.h + 6;
}
