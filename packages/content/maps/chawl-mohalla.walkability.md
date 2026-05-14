# Chawl Mohalla — Walkability & Budget Report

> Generated alongside `chawl-mohalla.json` by the `level-designer` subagent.
> Authoring date: 2026-05-14. Greybox pass — topology only.

---

## 1. Walkability check (4-connected BFS from player spawn)

Player spawn: pixel `(480, 320)` = tile `(30, 20)` — middle of the alley.

| NPC | Schedule loc @ 09:00 | Spawned tile | Reachable? |
|---|---|---|---|
| maya-didi | mayas-room (2F) | (4, 18) — ladder base | reachable |
| bhola-seth | alley | (50, 20) — outside office | reachable |
| ravi-anna | chai-stall | (23, 25) — behind counter | reachable |
| sushila-aunty | kirana-shop | (12, 25) — behind counter | reachable |
| aarav | aaravs-room | (30, 13) — interior | reachable |
| lakshmi-dabbawala | dabbawala-route | (4, 20) — alley near entrance | reachable |
| dipu-kaka | dipus-room | (38, 13) — interior | reachable |
| maa-on-phone | phone-line | (22, 12) — beside landline | reachable |
| the-postman | off-route Wed-only | (5, 25) — beside postbox | reachable |
| biscuit | chai-stall-exterior | (24, 22) — alley | reachable |

**Result: 10 / 10 named NPCs reachable from player spawn.** No isolated pockets.

The BFS expanded **994 open tiles** out of **2,400 total tiles**. This is the full walkable territory; everything else is either decor (2F verandah, rooftop), a wall, a prop obstacle, or the gated archway-to-Bank-Bazaar.

---

## 2. Tile budget

- Map dimensions: **60 cols × 40 rows** at **16×16** = **960 × 640 px** world.
- Total tiles per layer: **2,400**.
- Tile layers: `ground`, `walls`, `props`, `collision` (= 4 × 2,400 = **9,600 tile slots**).
- Filled-tile counts (non-zero):
  - `ground`: ~2,400 (the layer covers the full map; sky / bg / floor everywhere).
  - `walls`: ~620 (perimeter walls of 3 accessible kholis, 2 locked kholis, kirana, chai stall, Bhola office, archway, 2F facade).
  - `props`: ~80 (charpais, stoves, shelves, counters, postbox, tulsi, hand-pump, laundry, ACs, landline, biscuit mat, doors, ladder, rent notice).
  - `collision`: **1,406 blocked / 994 open** (~58% blocked — typical for an interior-heavy district where most of the chawl is non-walkable building mass).
- Object layers: 3 layers totalling **32 objects** (10 NPC spawns + 16 interact-zones + 6 quest-locations).

**File size:** `chawl-mohalla.json` is **~128 KB** unminified, well under the 200 KB budget for map JSON. Gzipped it will be ~15–25 KB. The full district-asset bundle (atlas PNG + tileset JSON) is targeted at ~250–400 KB per the curator's plan, leaving us **≪ 2 MB gzip** for the entire district.

**Asset budget at 16×16 tiles:** a notional 256-tile placeholder tileset (`chawl-greybox`, 16×16 atlas = 256 × 256 px) is referenced. Real tileset will be assembled from the CC0 packs in `assets/chawl-mohalla/ASSET_PLAN.md` + in-house pixel work for chai-stall, dabbawala bike, AC compressor, hanging laundry, ₹ glyph, NPC saree/kurta overlays.

---

## 3. Performance budget statement

- **Per-district target:** < 2 MB gzip (map JSON + tileset PNG + tileset JSON, combined).
- **This map JSON alone:** ~128 KB raw, ~20 KB gzip estimate. Trivially within budget.
- **Layers:** 4 tile layers + 3 object layers. No parallax layers yet (PRD §15 caps parallax at 3); 2F verandah is rendered as backdrop tile rows on the same layer.
- **Tile-count ceiling:** the level-designer rule pins each parallax-tileset PNG under 256 KB gzip — a single 256×256 atlas at 16-colour palette easily fits.
- **Mobile / "low" tier:** 2,400 tiles per layer × 4 layers = 9,600 quad draws max per frame in the worst case. With culling against a ~480 px-tall viewport (30 tiles tall), this drops to ~1,800 draws per frame — fine for integrated-GPU mobile. *Pending* the perf-budgeteer's actual playtest on a low-tier device.
- **Object count:** 32 objects, all axis-aligned rectangles — negligible cost.

---

## 4. Topology compromises and authoring decisions

1. **2-story rendering as a flat tile layer, not a true second floor.**
   The chawl is *narratively* 2 stories — Wren lives upstairs, the verandah is visible from below — but the playable space is only the 1st-floor. The 2nd floor occupies tile rows `y=6..9` as a *visual backdrop band* (verandah floor, railing, terracotta roof separator, AC units, hanging laundry, satellite dishes). Collision is set to **blocked** across all of `y=0..9` so the player cannot wander there. Wren descends to the courtyard for quests; the ladder at `(4, 8)` is rendered but kept `locked: true` on its interact-zone. This avoids building two complete tilemaps and matches Stardew-style "house upstairs = cutscene, not zone" conventions.

2. **Three accessible kholis, two locked.**
   The player's kholi (x=18..25), Arlo's (x=27..33), and Tobias's (x=35..41) are walkable interiors. Two additional kholis (x=10..16 and x=43..50) are *visual-only* — wooden floor and walls are painted in but the wall row at `y=17` has no door cut, and collision blocks the whole interior. This keeps the chawl feeling occupied without bloating the NPC count.

3. **Archway-as-gate, not as edge-teleport.**
   The exit to Bank Bazaar is a 2-tile-wide archway at `(58, 32)` — `(59, 32)` (pixel `944, 512`). Both tiles are explicitly collision-1 and listed under `collisionToggles[]` in the meta file, so the engine flips them to walkable when `quest.graduation.completed` fires. This makes the gate *diegetic* (the player can see the bank district through the archway from the start) and *mechanically clean* (one collision flip, no zone-swap).

4. **Bhola seth's office between chawl and archway.**
   The research brief places Bhola "between the chawl and the bank, which is exactly his predatory role." His office at tiles `(48..54, 23..29)` is the last thing the player walks past before the gate — a deliberate spatial metaphor. He stands in the alley by default (his 09:00 schedule block), conducting business in the open.

5. **Non-spatial NPCs anchored to props.**
   `maa-on-phone` has no map location in her schedule (it's `phone-line`), and `the-postman` is Wednesday-only (off-route at 09:00). Both still need a renderable spawn for the engine to do hit-testing. I anchor them to their *trigger props* (the landline-phone inside player's kholi for Mom, the postbox at the building entrance for the postman) with `renderedAt` notes in the meta — the game logic can hide the sprite when the schedule says "off-route" while keeping the interact-zone live.

6. **Lia fallback spawn.**
   At 09:00 she's on the dabbawala-route (off-map abstract anchor at the southwest corner). Her spawn is rendered at the building entrance (`4, 20`) since that's where she stages tiffin tower 07:30–09:00 and 15:30–16:30. Her ambient waypoint `lakshmi-route-out` exits west and returns, so the engine can do a fake despawn/respawn at the route boundary.

7. **One gap in the kirana shelf row.**
   Mara stands at `(12, 25)` behind her counter. The shelves at `y=24` initially blocked the entire row, making her unreachable. I carved a single walkable gap at `(12, 24)` directly behind the counter approach so she's path-reachable. Tiny topology fudge that costs nothing visually.

8. **Player kholi interior props placement is opinionated.**
   The four quest anchors inside the player's kholi (kholi-table at `(22, 14)` for first-budget, kholi-shelf at `(19, 15)` for emergency-seed, rent-notice at `(21, 16)` on the door from the inside, landline at `(25, 11)` for maa-on-phone) cluster around the room without colliding with the charpai / stove / shelf props. Each quest trigger has its own tile so the engine can disambiguate without proximity heuristics.

9. **Quest 2 (`needs-and-wants`) anchor at Arlo's room, not the chai stall.**
   The brief offered either Arlo's room or the chai stall as the trigger. I chose Arlo's room because the dialog beats (per the chawl-mohalla.index.json `roleConvention`: "Arlo is the same-age peer foil — impulsive") work best when the player is *inside his space* watching him scroll Instagram about his latest purchase. The chai stall is reserved for `chai-receipt` (Quest 4), keeping each location to a single primary quest.

10. **Placeholder tileset, not real art.**
    The map references a single tileset `chawl-greybox` at notional `assets/chawl-mohalla/atlas/chawl-greybox.png`. This PNG does not yet exist — the asset bundle will be assembled from the CC0 packs listed in `ASSET_PLAN.md`. Tile GIDs 1–54 are documented in the generator script (`_generate.mjs` header comment). The next iteration of this file will swap to a real tileset firstgid mapping once the atlas is packed.

---

## 5. Open questions for next pass

- **2nd-floor as a separate "scene" for Wren's quests?** Currently the 2F is non-walkable backdrop; Quest 1 (`first-budget`) assumes Wren descends to the courtyard. If we want a cutscene actually *inside* Wren's room (per the research brief's optional Quest-1-starts-in-Wren's-room framing), a small 8×6 inset sub-map could be added as a separate file `mayas-room.interior.json`. Deferred for now.
- **Festival overlay layer.** The PRD §6.2 talks about Ganpati / Diwali / Holi mini-events firing seasonally in the chawl. These will likely be an additional decorative tile layer that swaps in by date — out of scope for the greybox pass.
- **Async multiplayer "friends visit your kholi"** (PRD §9) will need a way to spawn ghost-player avatars on the verandah strip in front of the player's kholi. Just a note — no map changes required, just a spawn-anchor at the door.
