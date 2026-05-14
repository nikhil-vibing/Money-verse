import * as Phaser from "phaser";

export abstract class MinigameScene extends Phaser.Scene {
  abstract readonly concept: string;
  abstract readonly maxDurationSec: number;

  protected emitMastery(domain: string, levelDelta: number): void {
    this.game.events.emit("mastery:grant", { domain, levelDelta });
  }
}
