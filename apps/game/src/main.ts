import * as Phaser from "phaser";
import { createPhaserConfig } from "./createPhaserConfig";

new Phaser.Game(createPhaserConfig({ parent: "game-root" }));
