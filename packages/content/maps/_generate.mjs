#!/usr/bin/env node
// One-shot generator for chawl-mohalla.json (Tiled 1.10 orthogonal map).
// Authored by level-designer subagent. Re-run only when topology changes.
// Map: 60 cols x 40 rows, 16x16 px = 960x640 world.
//
// Layer plan (south-to-north, y increases downward):
//   y=0..5   sky / 2nd-floor verandah backdrop (visible, non-walkable)
//   y=6..7   2nd-floor verandah floor + railing (visible, non-walkable)
//   y=8..9   chawl 2nd-floor / 1st-floor separator (terracotta roof)
//   y=10..16 1st-floor interior rooms (walkable, only through doors)
//   y=17     chawl ground exterior wall + door row
//   y=18..23 ALLEY (walkable east-west strip, dirt floor)
//   y=24..30 courtyard + kirana + chai stall + Bhola office (walkable cement)
//   y=31..34 street (walkable) + archway to Bank Bazaar
//   y=35..39 far background (north sky, non-walkable)
//
// Tile GID legend (notional placeholder tileset "chawl-greybox"):
//   1  sky-far
//   2  alley-dirt
//   3  courtyard-cement
//   4  room-floor-wood
//   5  shop-floor
//   6  rooftop-flat
//   7  street-asphalt
//   10 chawl-wall-saffron
//   11 chawl-wall-terracotta
//   12 interior-partition
//   13 verandah-railing
//   14 verandah-floor
//   15 terracotta-roof
//   16 chawl-2nd-floor-wall
//   20 door-closed
//   21 door-open
//   22 ladder
//   23 archway-gate-closed
//   24 archway-gate-open
//   30 charpai
//   31 gas-stove
//   32 clay-pot-shelf
//   33 plant-pot
//   34 hanging-laundry
//   35 ac-unit
//   36 satellite-dish
//   37 hand-pump
//   38 tulsi-plant
//   39 low-wall-bench
//   40 chai-stall-counter
//   41 chai-kettle
//   42 kirana-counter
//   43 kirana-shelf
//   44 postbox
//   45 landline-phone
//   46 ledger-on-stool
//   47 bicycle-stand
//   48 bhola-desk
//   49 wall-calendar
//   50 envelope-on-table
//   51 rent-notice
//   52 chai-receipt-paper
//   53 emergency-jar-shelf
//   54 biscuit-mat

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 60;
const H = 40;
const TS = 16;

// Helpers ---------------------------------------------------------------
const idx = (x, y) => y * W + x;
const fill = (arr, x0, y0, x1, y1, gid) => {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (x >= 0 && x < W && y >= 0 && y < H) arr[idx(x, y)] = gid;
    }
  }
};
const set = (arr, x, y, gid) => {
  if (x >= 0 && x < W && y >= 0 && y < H) arr[idx(x, y)] = gid;
};
const blank = () => Array.from({ length: W * H }, () => 0);

// Build ground layer ----------------------------------------------------
const ground = blank();

// Sky for top strip (non-walkable backdrop)
fill(ground, 0, 0, W - 1, 5, 1);
// 2nd-floor verandah floor strip (visual only)
fill(ground, 4, 6, 55, 7, 14);
// terracotta roof separator
fill(ground, 4, 8, 55, 9, 15);
// 1st-floor interior rooms wooden floor (only inside the kholis)
// Player's kholi: x=18..25, y=10..16
fill(ground, 18, 10, 25, 16, 4);
// Arlo's kholi: x=27..33, y=10..16
fill(ground, 27, 10, 33, 16, 4);
// Tobias's kholi: x=35..41, y=10..16
fill(ground, 35, 10, 41, 16, 4);
// Extra (locked) kholis (visual): x=10..16 and x=43..50
fill(ground, 10, 10, 16, 16, 4);
fill(ground, 43, 10, 50, 16, 4);

// Chawl ground-level exterior wall band at y=17 (just below kholis)
// floor below the door row gets alley-dirt (the threshold) for visual depth
fill(ground, 0, 17, W - 1, 17, 2);

// Alley dirt strip y=18..23
fill(ground, 0, 18, W - 1, 23, 2);

// Courtyard cement y=24..30
fill(ground, 0, 24, W - 1, 30, 3);

// Kirana shop floor (Mara): x=8..16, y=24..29
fill(ground, 8, 24, 16, 29, 5);
// Chai stall floor area: x=20..27, y=24..28
fill(ground, 20, 24, 27, 28, 5);
// Bhola seth's office floor: x=48..54, y=24..29
fill(ground, 48, 24, 54, 29, 5);

// Street asphalt y=31..34
fill(ground, 0, 31, W - 1, 34, 7);

// Far background y=35..39
fill(ground, 0, 35, W - 1, 39, 1);

// Walls layer -----------------------------------------------------------
const walls = blank();

// 2nd-floor exterior wall stripe (background)
fill(walls, 4, 6, 55, 6, 16);
// 2nd-floor railing along verandah edge
fill(walls, 4, 7, 55, 7, 13);
// Terracotta roof (visible above kholi row)
fill(walls, 4, 8, 55, 9, 15);

// Player kholi walls (perimeter)
fill(walls, 18, 10, 25, 10, 10); // top
fill(walls, 18, 16, 25, 16, 10); // bottom
fill(walls, 18, 11, 18, 15, 10); // left
fill(walls, 25, 11, 25, 15, 10); // right

// Arlo kholi walls
fill(walls, 27, 10, 33, 10, 10);
fill(walls, 27, 16, 33, 16, 10);
fill(walls, 27, 11, 27, 15, 10);
fill(walls, 33, 11, 33, 15, 10);

// Tobias kholi walls
fill(walls, 35, 10, 41, 10, 10);
fill(walls, 35, 16, 41, 16, 10);
fill(walls, 35, 11, 35, 15, 10);
fill(walls, 41, 11, 41, 15, 10);

// Locked kholis (decor only, no door cut)
fill(walls, 10, 10, 16, 10, 11);
fill(walls, 10, 16, 16, 16, 11);
fill(walls, 10, 11, 10, 15, 11);
fill(walls, 16, 11, 16, 15, 11);
fill(walls, 43, 10, 50, 10, 11);
fill(walls, 43, 16, 50, 16, 11);
fill(walls, 43, 11, 43, 15, 11);
fill(walls, 50, 11, 50, 15, 11);

// Chawl ground exterior wall band at y=17, with door cuts at the three rooms
fill(walls, 0, 17, W - 1, 17, 10);
// Door cuts (open in walls layer, replaced by doors in props)
set(walls, 21, 17, 0); // player kholi door tile
set(walls, 30, 17, 0); // Arlo kholi door
set(walls, 38, 17, 0); // Tobias kholi door
set(walls, 4, 17, 0); // building-entrance (west)

// Kirana shop walls (Mara) — open on south (alley) side
fill(walls, 8, 23, 16, 23, 11); // north counter face -> open to alley
fill(walls, 8, 24, 8, 29, 11); // west wall
fill(walls, 16, 24, 16, 29, 11); // east wall
fill(walls, 8, 29, 16, 29, 11); // back wall
// Carve counter opening
set(walls, 12, 23, 0); // counter approach

// Chai stall — small open structure
fill(walls, 20, 23, 27, 23, 11);
fill(walls, 20, 28, 27, 28, 11);
fill(walls, 20, 24, 20, 27, 11);
fill(walls, 27, 24, 27, 27, 11);
set(walls, 23, 23, 0); // counter approach

// Bhola seth's office — between chawl and archway
fill(walls, 48, 23, 54, 23, 11);
fill(walls, 48, 29, 54, 29, 11);
fill(walls, 48, 24, 48, 28, 11);
fill(walls, 54, 24, 54, 28, 11);
set(walls, 51, 23, 0); // door

// Archway to Bank Bazaar — east edge of street, y=31..34
// Gated (collision blocks) until graduation quest completes
fill(walls, 58, 30, 59, 34, 11); // archway pillars
set(walls, 58, 32, 23); // archway gate (closed)
set(walls, 59, 32, 23);

// Props layer -----------------------------------------------------------
const props = blank();

// Hanging laundry on 2nd-floor verandah (decorative)
for (let x = 6; x <= 54; x += 4) set(props, x, 7, 34);
// AC units on 2nd floor wall
for (let x = 8; x <= 52; x += 8) set(props, x, 6, 35);
// Satellite dishes
set(props, 14, 6, 36);
set(props, 38, 6, 36);

// Player kholi interior
set(props, 19, 11, 30); // charpai
set(props, 20, 11, 30);
set(props, 23, 11, 31); // gas stove (kitchen corner)
set(props, 24, 12, 32); // clay-pot shelf (four pots)
set(props, 22, 14, 50); // envelope-on-table (quest first-budget anchor)
set(props, 19, 15, 53); // emergency jar shelf (quest emergency-seed)
set(props, 21, 13, 49); // wall calendar
set(props, 25, 15, 33); // plant pot inside

// Arlo kholi: gaming setup vibes
set(props, 28, 11, 30); // bed
set(props, 31, 12, 32);

// Tobias kholi: newspaper bench
set(props, 36, 11, 30);
set(props, 39, 12, 32);

// Door props on alley-facing wall
set(props, 21, 17, 20); // player kholi door (closed)
set(props, 30, 17, 20); // Arlo door
set(props, 38, 17, 20); // Tobias door
// Rent notice pinned to player's door (quest rent-day)
set(props, 21, 16, 51);

// Courtyard centrepieces
set(props, 32, 26, 37); // hand-pump
set(props, 35, 27, 38); // tulsi plant
set(props, 38, 27, 39); // low wall bench
set(props, 30, 28, 54); // Biscuit's sleeping mat

// Kirana counter + shelves
set(props, 12, 23, 42); // counter face
fill(props, 9, 24, 15, 24, 43); // back shelves
fill(props, 9, 28, 15, 28, 43);

// Chai stall counter + kettle
set(props, 23, 23, 40); // counter
set(props, 22, 24, 41); // kettle on stove
set(props, 25, 25, 30); // little stool

// Bhola seth's office props
set(props, 51, 23, 20); // his office door
set(props, 49, 26, 48); // desk
set(props, 50, 26, 46); // ledger on stool
set(props, 53, 26, 32); // cash safe (clay pot shelf placeholder)

// Postbox at building entrance (for the-postman)
set(props, 5, 24, 44);
// Landline phone in player's kholi (for maa-on-phone)
set(props, 25, 11, 45);
// Bicycle stand (Lia parks here)
set(props, 3, 25, 47);

// Ladder up to 2nd-floor verandah (visible but locked: collision blocks it)
set(props, 4, 8, 22);

// Collision layer -------------------------------------------------------
// Convention: 0 = walkable, 1 = blocked
const collision = blank();
// Block entire top strip y=0..9 (verandah backdrop)
fill(collision, 0, 0, W - 1, 9, 1);
// Block all 1st-floor kholi WALLS but leave interiors open
// Start by blocking everything y=10..17, then carve walkable interiors
fill(collision, 0, 10, W - 1, 17, 1);

// Carve walkable interiors of the three accessible kholis
fill(collision, 19, 11, 24, 15, 0); // player kholi interior
fill(collision, 28, 11, 32, 15, 0); // Arlo kholi interior
fill(collision, 36, 11, 40, 15, 0); // Tobias kholi interior

// Carve door tiles so player can step through wall band at y=17
set(collision, 21, 17, 0); // player kholi door
set(collision, 30, 17, 0); // Arlo door
set(collision, 38, 17, 0); // Tobias door
set(collision, 4, 17, 0); // building entrance gap
// Also open the doorway interior tile so transition is 2-tile gap
set(collision, 21, 16, 0);
set(collision, 30, 16, 0);
set(collision, 38, 16, 0);

// Re-block interior props that are obstacles
set(collision, 19, 11, 1); // charpai
set(collision, 20, 11, 1);
set(collision, 23, 11, 1); // stove
set(collision, 24, 12, 1); // shelf
set(collision, 28, 11, 1);
set(collision, 31, 12, 1);
set(collision, 36, 11, 1);
set(collision, 39, 12, 1);

// Alley y=18..23 is open by default (collision already 0)
// Now block kirana/chai/bhola structures except interiors and approaches
// Kirana walls
fill(collision, 8, 23, 16, 23, 1);
fill(collision, 8, 24, 8, 29, 1);
fill(collision, 16, 24, 16, 29, 1);
fill(collision, 8, 29, 16, 29, 1);
set(collision, 12, 23, 0); // counter approach
// Kirana interior shelves block (with one gap at counter to let Mara in)
fill(collision, 9, 24, 15, 24, 1);
fill(collision, 9, 28, 15, 28, 1);
set(collision, 12, 24, 0); // gap behind counter so Mara is reachable
// Mara stands behind counter at (12,25): walkable strip y=25..27
// Block courtyard props
set(collision, 32, 26, 1); // hand-pump
set(collision, 35, 27, 1); // tulsi
set(collision, 38, 27, 1); // bench
// Biscuit mat is walkable (pet sits on it)

// Chai stall walls
fill(collision, 20, 23, 27, 23, 1);
fill(collision, 20, 28, 27, 28, 1);
fill(collision, 20, 24, 20, 27, 1);
fill(collision, 27, 24, 27, 27, 1);
set(collision, 23, 23, 0); // counter approach
// Chai kettle/stove
set(collision, 22, 24, 1);
set(collision, 25, 25, 1);

// Bhola office walls
fill(collision, 48, 23, 54, 23, 1);
fill(collision, 48, 29, 54, 29, 1);
fill(collision, 48, 24, 48, 28, 1);
fill(collision, 54, 24, 54, 28, 1);
set(collision, 51, 23, 0); // door
set(collision, 49, 26, 1); // desk
set(collision, 50, 26, 1); // ledger stool

// Postbox / bicycle stand / landline collision
set(collision, 5, 24, 1);
set(collision, 3, 25, 1);
set(collision, 25, 11, 1); // landline phone inside player kholi

// Block far-north strip y=35..39
fill(collision, 0, 35, W - 1, 39, 1);

// Archway gate to Bank Bazaar — blocked until graduation
// Pillars
fill(collision, 58, 30, 59, 34, 1);
// Gate tiles also blocked (will be toggled to 0 on graduation completion)
set(collision, 58, 32, 1);
set(collision, 59, 32, 1);

// Build CSV data arrays -------------------------------------------------
const layer = (name, data, opts = {}) => ({
  data,
  height: H,
  id: opts.id,
  name,
  opacity: opts.opacity ?? 1,
  type: "tilelayer",
  visible: opts.visible ?? true,
  width: W,
  x: 0,
  y: 0,
});

// Object layer helpers --------------------------------------------------
let nextObjId = 1000;
const newObj = (name, type, x, y, width, height, properties) => ({
  id: nextObjId++,
  name,
  type,
  x,
  y,
  width,
  height,
  rotation: 0,
  visible: true,
  properties: properties ?? [],
});
const prop = (name, value) => {
  const type =
    typeof value === "number"
      ? Number.isInteger(value)
        ? "int"
        : "float"
      : typeof value === "boolean"
        ? "bool"
        : "string";
  return { name, type, value };
};

// NPC spawns at 09:00 game-start time -----------------------------------
// Wren 09:00 -> mayas-room (2nd floor, visible only). She comes down for quests.
// Render her spawn at the courtyard since 1st-floor is the playable space and
// her 12:30 lunch block is courtyard. For 09:00 we place a "narrative anchor"
// at the bottom of her ladder so the engine can route her down when player
// triggers the first quest. Coords: just below ladder tile (4,8) at (4,18).
const npcSpawnsObjects = [
  newObj("maya-didi", "npc", 4 * TS, 18 * TS, TS, TS, [prop("npcId", "maya-didi")]),
  // Bhola seth 09:00 -> alley, watching for marks. Place mid-alley near his office.
  newObj("bhola-seth", "npc", 50 * TS, 20 * TS, TS, TS, [prop("npcId", "bhola-seth")]),
  // Kai 09:00 -> chai-stall (behind counter)
  newObj("ravi-anna", "npc", 23 * TS, 25 * TS, TS, TS, [prop("npcId", "ravi-anna")]),
  // Mara 09:00 -> kirana-shop (behind counter)
  newObj("sushila-aunty", "npc", 12 * TS, 25 * TS, TS, TS, [prop("npcId", "sushila-aunty")]),
  // Arlo 09:00 -> aaravs-room
  newObj("aarav", "npc", 30 * TS, 13 * TS, TS, TS, [prop("npcId", "aarav")]),
  // Lia 09:00 -> dabbawala-route (off-route). Place at building
  // entrance (her 07:30-09:00 location) so she's reachable on map.
  newObj("lakshmi-dabbawala", "npc", 4 * TS, 20 * TS, TS, TS, [prop("npcId", "lakshmi-dabbawala")]),
  // Tobias 09:00 -> dipus-room (reading-newspaper)
  newObj("dipu-kaka", "npc", 38 * TS, 13 * TS, TS, TS, [prop("npcId", "dipu-kaka")]),
  // Mom on phone is non-spatial (phone-line). Spawn at a walkable tile inside
  // the player's kholi adjacent to the landline so the interact-zone resolves.
  newObj("maa-on-phone", "npc", 22 * TS, 12 * TS, TS, TS, [prop("npcId", "maa-on-phone")]),
  // The Postman 09:00 -> off-route (Wed-only schedule starts 10:30). Spawn on
  // courtyard cement next to the postbox so quest refs resolve to a map tile.
  newObj("the-postman", "npc", 5 * TS, 25 * TS, TS, TS, [prop("npcId", "the-postman")]),
  // Biscuit 09:00 -> chai-stall-exterior, begging-near-ravi
  newObj("biscuit", "npc", 24 * TS, 22 * TS, TS, TS, [prop("npcId", "biscuit")]),
];

// Interact zones --------------------------------------------------------
const interactZonesObjects = [
  // Doors
  newObj("player-kholi-door", "door", 21 * TS, 17 * TS, TS, TS, [
    prop("kind", "door"),
    prop("target", "player-kholi"),
  ]),
  newObj("aarav-kholi-door", "door", 30 * TS, 17 * TS, TS, TS, [
    prop("kind", "door"),
    prop("target", "aaravs-room"),
  ]),
  newObj("dipu-kholi-door", "door", 38 * TS, 17 * TS, TS, TS, [
    prop("kind", "door"),
    prop("target", "dipus-room"),
  ]),
  newObj("building-entrance", "door", 4 * TS, 17 * TS, TS, TS, [
    prop("kind", "door"),
    prop("target", "building-entrance"),
  ]),
  newObj("bhola-office-door", "door", 51 * TS, 23 * TS, TS, TS, [
    prop("kind", "door"),
    prop("target", "bhola-office"),
  ]),
  // Wren verandah ladder (visible but locked)
  newObj("maya-ladder", "door", 4 * TS, 8 * TS, TS, TS, [
    prop("kind", "door"),
    prop("target", "mayas-room"),
    prop("locked", true),
  ]),
  // Shop counters
  newObj("kirana-counter", "shop", 12 * TS, 23 * TS, TS, TS, [
    prop("kind", "shop"),
    prop("target", "kirana-shop"),
    prop("vendor", "sushila-aunty"),
  ]),
  newObj("chai-stall-counter", "shop", 23 * TS, 23 * TS, TS, TS, [
    prop("kind", "shop"),
    prop("target", "chai-stall"),
    prop("vendor", "ravi-anna"),
  ]),
  // Props for interactions
  newObj("postbox", "prop", 5 * TS, 24 * TS, TS, TS, [
    prop("kind", "prop"),
    prop("target", "postbox"),
    prop("npcGate", "the-postman"),
  ]),
  newObj("landline-phone", "prop", 25 * TS, 11 * TS, TS, TS, [
    prop("kind", "prop"),
    prop("target", "landline-phone"),
    prop("npcGate", "maa-on-phone"),
  ]),
  newObj("biscuit-mat", "prop", 30 * TS, 28 * TS, TS, TS, [
    prop("kind", "prop"),
    prop("target", "biscuit-mat"),
    prop("action", "pet"),
  ]),
  newObj("courtyard-tulsi", "prop", 35 * TS, 27 * TS, TS, TS, [
    prop("kind", "prop"),
    prop("target", "tulsi-plant"),
    prop("action", "lore"),
  ]),
  newObj("hand-pump", "prop", 32 * TS, 26 * TS, TS, TS, [
    prop("kind", "prop"),
    prop("target", "hand-pump"),
    prop("action", "lore"),
  ]),
  // Archway to Bank Bazaar (gated exit)
  newObj("archway-to-bank-bazaar", "door", 58 * TS, 32 * TS, 2 * TS, TS, [
    prop("kind", "door"),
    prop("target", "bank-bazaar"),
    prop("requiresUnlock", true),
    prop("unlockQuest", "graduation"),
  ]),
  // Quest triggers
  newObj("trigger-first-budget", "quest-trigger", 22 * TS, 14 * TS, TS, TS, [
    prop("kind", "quest-trigger"),
    prop("target", "first-budget"),
    prop("anchor", "kholi-table"),
  ]),
  newObj("trigger-needs-and-wants", "quest-trigger", 30 * TS, 13 * TS, TS, TS, [
    prop("kind", "quest-trigger"),
    prop("target", "needs-and-wants"),
    prop("anchor", "aaravs-room"),
  ]),
  newObj("trigger-rent-day", "quest-trigger", 21 * TS, 16 * TS, TS, TS, [
    prop("kind", "quest-trigger"),
    prop("target", "rent-day"),
    prop("anchor", "rent-notice-on-door"),
  ]),
  newObj("trigger-chai-receipt", "quest-trigger", 23 * TS, 23 * TS, TS, TS, [
    prop("kind", "quest-trigger"),
    prop("target", "chai-receipt"),
    prop("anchor", "chai-stall-counter"),
  ]),
  newObj("trigger-emergency-seed", "quest-trigger", 19 * TS, 15 * TS, TS, TS, [
    prop("kind", "quest-trigger"),
    prop("target", "emergency-seed"),
    prop("anchor", "kholi-shelf"),
  ]),
  newObj("trigger-graduation", "quest-trigger", 58 * TS, 32 * TS, 2 * TS, TS, [
    prop("kind", "quest-trigger"),
    prop("target", "graduation"),
    prop("anchor", "archway-to-bank-bazaar"),
  ]),
];

// Quest-locations (named anchor points) ---------------------------------
const questLocationsObjects = [
  newObj("kholi-table", "anchor", 22 * TS, 14 * TS, TS, TS, [prop("questId", "first-budget")]),
  newObj("kholi-shelf", "anchor", 19 * TS, 15 * TS, TS, TS, [prop("questId", "emergency-seed")]),
  newObj("aaravs-room-anchor", "anchor", 30 * TS, 13 * TS, TS, TS, [prop("questId", "needs-and-wants")]),
  newObj("rent-notice-on-door", "anchor", 21 * TS, 16 * TS, TS, TS, [prop("questId", "rent-day")]),
  newObj("chai-stall-counter-anchor", "anchor", 23 * TS, 23 * TS, TS, TS, [prop("questId", "chai-receipt")]),
  newObj("graduation-archway", "anchor", 58 * TS, 32 * TS, 2 * TS, TS, [prop("questId", "graduation")]),
];

// Compose Tiled map -----------------------------------------------------
const map = {
  compressionlevel: -1,
  height: H,
  infinite: false,
  layers: [
    layer("ground", ground, { id: 1 }),
    layer("walls", walls, { id: 2 }),
    layer("props", props, { id: 3 }),
    {
      id: 4,
      name: "collision",
      type: "tilelayer",
      visible: false,
      opacity: 1,
      width: W,
      height: H,
      x: 0,
      y: 0,
      data: collision,
    },
    {
      id: 5,
      name: "npc-spawns",
      type: "objectgroup",
      draworder: "topdown",
      opacity: 1,
      visible: true,
      x: 0,
      y: 0,
      objects: npcSpawnsObjects,
    },
    {
      id: 6,
      name: "interact-zones",
      type: "objectgroup",
      draworder: "topdown",
      opacity: 1,
      visible: true,
      x: 0,
      y: 0,
      objects: interactZonesObjects,
    },
    {
      id: 7,
      name: "quest-locations",
      type: "objectgroup",
      draworder: "topdown",
      opacity: 1,
      visible: true,
      x: 0,
      y: 0,
      objects: questLocationsObjects,
    },
  ],
  nextlayerid: 8,
  nextobjectid: nextObjId,
  orientation: "orthogonal",
  properties: [
    { name: "districtId", type: "string", value: "chawl-mohalla" },
    { name: "displayNameKey", type: "string", value: "district.chawl-mohalla.displayName" },
  ],
  renderorder: "right-down",
  tiledversion: "1.10.2",
  tileheight: TS,
  tilesets: [
    {
      firstgid: 1,
      name: "chawl-greybox",
      tilewidth: TS,
      tileheight: TS,
      tilecount: 256,
      columns: 16,
      image: "../../../assets/chawl-mohalla/atlas/chawl-greybox.png",
      imagewidth: 256,
      imageheight: 256,
      margin: 0,
      spacing: 0,
    },
  ],
  tilewidth: TS,
  type: "map",
  version: "1.10",
  width: W,
};

// Walkability sanity-check (4-connected BFS) ----------------------------
const spawnX = 30;
const spawnY = 20; // pixel (480,320) -> tile (30,20)
const seen = new Set();
const queue = [[spawnX, spawnY]];
seen.add(`${spawnX},${spawnY}`);
while (queue.length) {
  const [x, y] = queue.shift();
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
    if (collision[idx(nx, ny)] === 1) continue;
    const k = `${nx},${ny}`;
    if (seen.has(k)) continue;
    seen.add(k);
    queue.push([nx, ny]);
  }
}

const npcReachReport = npcSpawnsObjects.map((o) => {
  const tx = Math.floor(o.x / TS);
  const ty = Math.floor(o.y / TS);
  const reachable = seen.has(`${tx},${ty}`);
  return { id: o.name, tx, ty, reachable };
});

const blockedCount = collision.filter((v) => v === 1).length;
const openCount = collision.length - blockedCount;

console.log("Walkability report:");
for (const r of npcReachReport) {
  console.log(`  ${r.id} @ (${r.tx},${r.ty}) reachable=${r.reachable}`);
}
console.log(`Total tiles: ${collision.length}, blocked: ${blockedCount}, open: ${openCount}`);

// Write the map file ----------------------------------------------------
const out = join(__dirname, "chawl-mohalla.json");
writeFileSync(out, JSON.stringify(map, null, 2));
console.log(`Wrote ${out}`);
