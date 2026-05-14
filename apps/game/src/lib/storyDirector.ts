/**
 * StoryDirector — a tiny data-driven sequencer that drives a beat-list
 * through Phaser's existing event surfaces (DialogScene, UIScene, the
 * Npc quest indicator, and a transient EnvelopeScene).
 *
 * Each beat resolves a Promise; the next runs. Nothing is per-frame —
 * beats are reactive (event listeners, key presses, timers).
 *
 * Beats are pure data, authored in `content/chawlOnboarding.ts`. The
 * director merely interprets them; new beats are added by extending
 * the StoryBeat union and the `runBeat` switch.
 */
import * as Phaser from "phaser";
import { announce } from "./announce";

/**
 * Resolver invoked when a `say-branch` beat fires. Receives the scene so
 * it can read the registry (e.g. `firstBudget`) and chooses which line
 * set to deliver. Returns undefined to skip the beat entirely (the
 * director treats this as a no-op).
 */
export type SayBranchResolver = (
  scene: Phaser.Scene,
) => ReadonlyArray<string> | undefined;

/** Discriminated union of every beat the director can run. */
export type StoryBeat =
  | {
      readonly kind: "say";
      readonly speaker: string;
      readonly lines: ReadonlyArray<string>;
    }
  | {
      // `say-branch` is identical to `say` except the lines are resolved
      // lazily from a function — used to branch dialog on the player's
      // recent choices (e.g. Maya's reaction after the envelope split).
      // The resolver runs once when the beat is reached, never per-line.
      readonly kind: "say-branch";
      readonly speaker: string;
      readonly resolveLines: SayBranchResolver;
    }
  | { readonly kind: "narrate"; readonly lines: ReadonlyArray<string> }
  | { readonly kind: "objective"; readonly text: string }
  | { readonly kind: "wait-for-interact"; readonly npcId: string }
  | {
      readonly kind: "move-to";
      readonly targetNpcId?: string;
      readonly targetTag?: string;
      readonly hintText: string;
    }
  | { readonly kind: "indicator"; readonly npcId: string; readonly show: boolean }
  | {
      readonly kind: "grant-inr";
      readonly amount: number;
      readonly reason: string;
    }
  | { readonly kind: "show-envelope-split" }
  | { readonly kind: "wait-ms"; readonly ms: number };

export interface StorySequence {
  readonly id: string;
  readonly beats: ReadonlyArray<StoryBeat>;
}

/** Anything implementing `setQuestIndicator` is good enough. */
interface QuestIndicatorTarget {
  readonly npcId: string;
  setQuestIndicator(show: boolean): void;
}

interface DirectorHostScene extends Phaser.Scene {
  // Optional — WorldScene exposes the npc list as a public-ish field.
  // We access it via a lookup function the host wires in. See `attach`.
}

/** Resolver for the npc registry — supplied by the host scene. */
export type NpcLookup = (npcId: string) => QuestIndicatorTarget | undefined;

export interface DirectorBindings {
  readonly scene: DirectorHostScene;
  readonly lookupNpc: NpcLookup;
}

interface CurrencyChangedEvent {
  readonly amount: number;
  readonly total: number;
  readonly reason: string;
}

const REGISTRY_INR_KEY = "inrCash";
const REGISTRY_FIRST_BUDGET_KEY = "firstBudget";

/**
 * Run a sequence to completion. Returns when the final beat resolves.
 *
 * Cancellation: if the scene shuts down mid-sequence the in-flight
 * Promise will dangle. That's acceptable — Phaser is tearing down the
 * world too.
 */
export class StoryDirector {
  private readonly bindings: DirectorBindings;

  constructor(bindings: DirectorBindings) {
    this.bindings = bindings;
  }

  async run(sequence: StorySequence): Promise<void> {
    for (const beat of sequence.beats) {
      await this.runBeat(beat);
    }
  }

  private runBeat(beat: StoryBeat): Promise<void> {
    switch (beat.kind) {
      case "say":
        return this.beatSay(beat.speaker, beat.lines);
      case "say-branch": {
        const lines = beat.resolveLines(this.bindings.scene);
        if (lines === undefined || lines.length === 0) {
          // Resolver opted out — treat as a no-op so the sequence
          // doesn't stall. This mirrors how Yarn handles a missing
          // jump-target.
          return Promise.resolve();
        }
        return this.beatSay(beat.speaker, lines);
      }
      case "narrate":
        return this.beatNarrate(beat.lines);
      case "objective":
        return this.beatObjective(beat.text);
      case "wait-for-interact":
        return this.beatWaitForInteract(beat.npcId);
      case "move-to":
        return this.beatMoveTo(beat);
      case "indicator":
        return this.beatIndicator(beat.npcId, beat.show);
      case "grant-inr":
        return this.beatGrantInr(beat.amount, beat.reason);
      case "show-envelope-split":
        return this.beatShowEnvelopeSplit();
      case "wait-ms":
        return this.beatWaitMs(beat.ms);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Beat implementations                                             */
  /* ---------------------------------------------------------------- */

  private beatSay(
    speaker: string,
    lines: ReadonlyArray<string>,
  ): Promise<void> {
    return new Promise((resolve) => {
      const scene = this.bindings.scene;
      const dialog = scene.scene.get("Dialog");
      // Signal the host scene to pause player input + npc tracking
      // while the dialog is open. WorldScene listens to this on its
      // own events bus.
      scene.events.emit("story:dialog-open");
      dialog.events.emit("dialog:show", {
        speaker,
        lines,
        onClose: () => {
          scene.events.emit("story:dialog-close");
          resolve();
        },
      });
    });
  }

  private beatNarrate(lines: ReadonlyArray<string>): Promise<void> {
    // Narration uses the same DialogScene with a synthetic speaker label.
    // The DialogScene treats anything in `speaker` as a chip header —
    // for narration we use a neutral label so it reads like a chapter
    // card instead of an NPC line.
    return this.beatSay("— story —", lines);
  }

  private beatObjective(text: string): Promise<void> {
    // UIScene listens to objective:set on the WORLD scene's events bus
    // (see UIScene.bindWorldEvents). Emitting on the UI scene directly
    // is a silent no-op.
    this.bindings.scene.events.emit("objective:set", { text });
    announce(`Objective: ${text}`);
    return Promise.resolve();
  }

  private beatWaitForInteract(npcId: string): Promise<void> {
    return new Promise((resolve) => {
      const game = this.bindings.scene.game;
      // WorldScene emits `story:npc-interacted` from openDialogFor when
      // the director is active (it short-circuits the normal NPC dialog
      // path so the director controls what dialog appears next).
      const npcHandler = (id: string): void => {
        if (id !== npcId) return;
        game.events.off("story:npc-interacted", npcHandler);
        resolve();
      };
      game.events.on("story:npc-interacted", npcHandler);
    });
  }

  private beatMoveTo(beat: {
    readonly targetNpcId?: string;
    readonly targetTag?: string;
    readonly hintText: string;
  }): Promise<void> {
    // See beatObjective — objective:set must be emitted on the world
    // scene's events bus, not the UI scene's.
    this.bindings.scene.events.emit("objective:set", { text: beat.hintText });
    if (beat.targetNpcId !== undefined) {
      const target = this.bindings.lookupNpc(beat.targetNpcId);
      target?.setQuestIndicator(true);
    }
    announce(beat.hintText);
    return Promise.resolve();
  }

  private beatIndicator(npcId: string, show: boolean): Promise<void> {
    const target = this.bindings.lookupNpc(npcId);
    target?.setQuestIndicator(show);
    return Promise.resolve();
  }

  private beatGrantInr(amount: number, reason: string): Promise<void> {
    const registry = this.bindings.scene.registry;
    const currentRaw = registry.get(REGISTRY_INR_KEY) as unknown;
    const current = typeof currentRaw === "number" ? currentRaw : 0;
    const next = current + amount;
    registry.set(REGISTRY_INR_KEY, next);
    const evt: CurrencyChangedEvent = { amount, total: next, reason };
    this.bindings.scene.game.events.emit("currency:changed", evt);
    announce(`You received ₹${amount.toLocaleString("en-IN")}. ${reason}.`);
    return Promise.resolve();
  }

  private beatShowEnvelopeSplit(): Promise<void> {
    return new Promise((resolve) => {
      const manager = this.bindings.scene.scene;
      const envelope = manager.get("Envelope");
      const onDone = (): void => {
        envelope.events.off("envelope:done", onDone);
        manager.stop("Envelope");
        resolve();
      };
      envelope.events.once("envelope:done", onDone);
      manager.launch("Envelope");
    });
  }

  private beatWaitMs(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.bindings.scene.time.delayedCall(ms, () => resolve());
    });
  }
}

/* -------------------------------------------------------------------- */
/*  Convenience: a helper for reading the first-budget result            */
/* -------------------------------------------------------------------- */

export interface FirstBudgetResult {
  readonly rent: number;
  readonly save: number;
  readonly spend: number;
  /** "balanced" if save >= 2000 and rent >= 4800; otherwise "shaky". */
  readonly grade: "balanced" | "shaky";
}

export function readFirstBudget(
  scene: Phaser.Scene,
): FirstBudgetResult | undefined {
  const raw = scene.registry.get(REGISTRY_FIRST_BUDGET_KEY) as unknown;
  if (raw === null || typeof raw !== "object") return undefined;
  const candidate = raw as Partial<FirstBudgetResult>;
  if (
    typeof candidate.rent !== "number" ||
    typeof candidate.save !== "number" ||
    typeof candidate.spend !== "number"
  ) {
    return undefined;
  }
  return {
    rent: candidate.rent,
    save: candidate.save,
    spend: candidate.spend,
    grade: candidate.grade === "balanced" ? "balanced" : "shaky",
  };
}
