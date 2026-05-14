#!/usr/bin/env node
/**
 * One-shot patcher: shop + chawl-block NPCs were spawning inside their
 * walled rooms with no door cut in the collision layer, so the player
 * couldn't reach them. Move them to the doorway/counter side facing
 * the alley/courtyard. Indian-shop topology — the vendor stands at the
 * counter; the customer approaches from outside.
 *
 * Mirrors the patch into all three chawl-mohalla.json copies so the
 * map stays consistent across the content source + the two app public
 * trees.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILES = [
  "packages/content/maps/chawl-mohalla.json",
  "apps/web/public/content/maps/chawl-mohalla.json",
  "apps/game/public/content/maps/chawl-mohalla.json",
];

// New positions in world pixels (16-px tiles). Kept in one table so the
// reasoning lives next to the data.
const NEW_POSITIONS = {
  // shops along the southern row — moved north (lower y) to the
  // counter line so they face the courtyard.
  "sushila-aunty": { x: 192, y: 376 },
  "ravi-anna": { x: 368, y: 376 },
  "the-postman": { x: 80, y: 376 },
  // chawl-block residents — moved south (higher y) to the doorway
  // line of the chawl strip so they face the alley.
  aarav: { x: 480, y: 240 },
  "dipu-kaka": { x: 608, y: 240 },
  // these are already reachable from the player spawn (480, 320);
  // listed here so the script is the single source of truth.
  "maya-didi": { x: 96, y: 304 },
  "bhola-seth": { x: 800, y: 320 },
  "lakshmi-dabbawala": { x: 96, y: 320 },
  biscuit: { x: 384, y: 352 },
  "maa-on-phone": { x: 352, y: 192 }, // never rendered in-world
};

let totalPatches = 0;

for (const file of FILES) {
  const map = JSON.parse(readFileSync(file, "utf8"));
  const spawns = map.layers.find((l) => l.name === "npc-spawns");
  if (!spawns) {
    console.warn(`[fix-npc-spawns] no npc-spawns layer in ${file}`);
    continue;
  }
  let patches = 0;
  for (const obj of spawns.objects) {
    const next = NEW_POSITIONS[obj.name];
    if (!next) continue;
    if (obj.x !== next.x || obj.y !== next.y) {
      obj.x = next.x;
      obj.y = next.y;
      patches += 1;
    }
  }
  if (patches > 0) {
    writeFileSync(file, `${JSON.stringify(map, null, 2)}\n`);
    console.log(`[fix-npc-spawns] ${file}: ${patches} positions updated`);
    totalPatches += patches;
  } else {
    console.log(`[fix-npc-spawns] ${file}: no changes`);
  }
}

console.log(`[fix-npc-spawns] total: ${totalPatches} patches across ${FILES.length} files`);
