# Perf report — Chawl Mohalla district

**Run:** 2026-05-14 · **Reporter:** perf-budgeteer subagent · **Build:** `pnpm --filter @money-verse/game build` + `pnpm --filter @money-verse/web build`

Budgets sourced from `docs/ARCHITECTURE.md` §15. Numbers are post-build, gzip-compressed where the budget is denominated in gzip.

## Summary table

| Budget | Limit | Measured | Status |
|---|---|---|---|
| Initial game bundle (`apps/game/dist`) | 800 KB gzip | **343.3 KB gzip** (Phaser 337.7 KB + scenes 5.6 KB) | PASS |
| Per-district JSON chunk (chawl) | 2 MB gzip | **6.93 KB gzip** (4 files combined tar+gz) | PASS |
| Landing-page critical-path JS (no Phaser) | unchanged baseline | **193 KB gzip / 658 KB raw**; Phaser chunk is `/play`-only | PASS |
| Scene memory (informational) | n/a | ~400 KB (256 KB tileset + 128 KB map + ~20 KB NPCs/zones) | INFO |
| /play first frame, desktop | <2.0 s | est ~0.8–1.2 s | PASS (synthetic) |
| /play first frame, mid-mobile (4G) | <4.0 s | est ~2.0–3.0 s | PASS (synthetic) |
| /play first frame, Moto G4 (1.6 Mbps throttled) | <4.0 s | est ~3.0–3.7 s | TIGHT (synthetic) |
| Steady-state FPS, desktop | 60 fps | est 60 fps (1,406 static AABB bodies) | PASS (synthetic) |
| Steady-state FPS, mid-mobile | ≥30 fps | est 45–60 fps | PASS (synthetic) |
| Steady-state FPS, low-mobile (Moto G4) | ≥24 fps | est 28–40 fps; **at-risk if WebGL contention** | WATCH (synthetic) |
| Colyseus state delta/tick | <2 KB | N/A — no multiplayer in this district | n/a |
| Maya AI tokens/player/day | schema-enforced | 300 tokens × 20 responses (schema cap) | PASS (schema) |

## Measurements (raw)

### 1. Game bundle (`apps/game/dist/assets/`)

```
phaser-cmB6DJhS.js   raw 1,478,496 B   gzip 337,736 B
index-Bt_mrrkX.js    raw    14,668 B   gzip   5,598 B
-------------------------------------------------------
Initial JS total     raw 1,493,164 B   gzip 343,334 B  (~335 KB gzip)
```

Vite split Phaser into its own chunk (per `vite.config.ts` `manualChunks`). The application code (scenes + entry) is 5.6 KB gzip. **Headroom: 800 − 343 = 457 KB gzip.** Comfortable. The dominant cost is Phaser itself (~98% of the bundle); no opportunity for trim without leaving Phaser.

### 2. Per-district content (4 JSON files)

```
maps/chawl-mohalla.json          raw 128,146 B   gzip   2,875 B
maps/chawl-mohalla.meta.json     raw   6,319 B   gzip   1,937 B
quests/chawl-mohalla.index.json  raw     850 B   gzip     306 B
npcs/chawl-mohalla.index.json    raw   2,986 B   gzip   1,613 B
-----------------------------------------------------------------
Combined (tar + gzip)            raw 138,301 B   gzip   7,097 B  (~7 KB)
Disk usage of public/content/                       144 KB
```

**Headroom: ~99.7% of the 2 MB budget unused.** Confirms intent: structured JSON, no base64 art, no embedded sprites. Tileset is procedurally generated at runtime in `BootScene` (verified — `grep -c "base64\|data:image" chawl-mohalla.json` → 0).

Map dimensions: 60 × 40 tiles @ 16 px = 960 × 640 px world. Layers: `ground` (2,207 non-zero), `walls` (471), `props` (67), `collision` (1,406 non-zero), plus 3 object layers (`npc-spawns` × 10, `interact-zones` × 20, `quest-locations` × 6).

### 3. Web bundle delta — landing critical path

Cross-referenced `apps/web/.next/server/app/page_client-reference-manifest.js` (landing) vs `…/play/page_client-reference-manifest.js` (play).

- Landing client chunks: `0of.-6rt2kdz~.js`, `153lxa49g01n6.js`, `0pvckryge-c3~.js` (CSS shared).
- Play client chunks: `0pvckryge-c3~.js` (shared trivially small), `153lxa49g01n6.js` (shared), plus the big phaser chunk loaded dynamically.
- The chunk containing Phaser (`01xz~5ijnz6k..js`, raw 1.19 MB / gzip 316 KB) appears **only** in the `/play` client manifest, not in landing's manifest. `grep -l "phaser" *.js` matched exactly one client chunk — that one.
- Landing total (root main files + landing client refs + polyfill): **~658 KB raw / ~193 KB gzip across 7 chunks**.

Conclusion: `/play` lazily mounts the game via `await import("phaser")` in `GameMount.tsx`. The landing route is verified clean.

### 4. JSON parse cost (estimated)

128 KB map JSON → modern V8 parses at ~600 MB/s on desktop, ~150 MB/s on Moto G4-class hardware. Worst case ~1 ms. Trivial; no concern.

### 5. First-frame estimates (synthetic)

First frame requires: Phaser ESM (337 KB gzip) + 4 JSON fetches (~7 KB gzip combined, parallelizable) + WebGL context init + procedural tileset generation (BootScene draws a 256×256 RGBA canvas — microseconds) + WorldScene construction (1,406 static rectangles + ~30 game objects).

Network-dominated estimates:

| Device / link | Phaser download | JSON fetches (parallel) | Game init | First frame |
|---|---|---|---|---|
| Desktop / WiFi (50 Mbps) | ~55 ms | ~5 ms | ~600 ms | **~0.8–1.2 s** |
| Mid-tier Android / good 4G (10 Mbps) | ~280 ms | ~10 ms | ~1.4 s | **~2.0–2.5 s** |
| Moto G4 / throttled 4G (1.6 Mbps, 150 ms RTT) | ~1.8 s | ~50 ms | ~1.6 s (single-thread WebGL init) | **~3.0–3.7 s** |

**Caveat:** these are calculator-grade estimates, not Playwright/Lighthouse runs. Needs real-device or `playwright-lighthouse --preset=mobile --throttling=4G` measurement against a preview deploy to confirm.

### 6. Steady-state FPS (estimated)

WorldScene state at steady-state:
- 1,406 static Phaser.GameObjects.Rectangle bodies registered with Arcade physics (collision layer).
- 10 NPC containers (each: 1 Container + 1 sprite + 1 label Text + 1 indicator Graphics).
- 20 interact zones + 6 quest markers (lightweight rectangles).
- 1 player Container.
- 1 procedurally-rendered tileset texture (256×256 RGBA, generated once in Boot).

Arcade physics overhead is dominated by static-body broadphase, which Phaser implements as a tree-based RTree — O(log n) per query. 1,406 bodies × ~1 dynamic player query/frame is ~14 lookups/frame. Cost is negligible on desktop and mid-tier mobile. On Moto G4 the limiter is **WebGL fillrate + GC pressure from Phaser's per-frame allocation**, not collision math.

Recommendation: **before low-tier ships**, merge contiguous collision tiles into rectangle strips (AABB-merging across rows). 1,406 individual bodies → an estimated 80–200 merged AABBs. This is low-effort and protects the 24-fps low-mobile budget when the district fills with NPC pathing, particle FX, and HD-2D-lite post-FX in future milestones. Not a launch blocker for this district alone.

### 7. Memory

| Asset | Resident |
|---|---|
| Procedural tileset (256×256 RGBA) | 256 KB |
| Parsed map JSON (JS objects) | ~80 KB |
| 10 NPC containers + 20 zones + 6 quests | ~20 KB |
| Phaser internal scene graph / physics tree | ~40 KB |
| **Total scene memory** | **~400 KB** |

Well under any reasonable mobile budget. Informational.

## Findings

1. **All hard budgets pass with comfortable headroom.** Game bundle uses 43% of the 800 KB gzip limit. District content uses 0.35% of the 2 MB gzip limit.
2. **Phaser is correctly isolated from the landing page.** The dynamic `await import("phaser")` in `apps/web/app/play/GameMount.tsx` results in the phaser chunk appearing in `/play`'s client-reference-manifest *only*, never in landing's. Landing ships ~193 KB gzip across 7 chunks — unchanged by this district.
3. **Moto G4 first-frame budget is tight but synthetic-passing.** Estimated 3.0–3.7 s against a 4.0 s budget. Network dominates (~1.8 s for the Phaser chunk on 1.6 Mbps). Real-device measurement strongly recommended before declaring victory.
4. **1,406 collision rectangles is the biggest at-risk lever for low-tier FPS.** Today it passes because nothing else competes for the frame. As HD-2D-lite post-FX and additional dynamic entities arrive in subsequent districts, the headroom shrinks. Pre-emptive AABB-merging will buy back ~10× collision-rect count.
5. **No base64 / embedded image bloat in the map JSON** — sanity check passed (`grep` returned 0). Procedural tileset is the correct call for a v1 art-budget.
6. **Maya AI cost is schema-bounded** (300 tokens × 20 responses per player/day per the brief). Quantitative enforcement is at the database/middleware layer, not measurable in this build.

## Recommendations

- **Before low-tier launch (not blocking this district):** add an AABB-merge pass in `WorldScene.buildCollisionFromLayer` to coalesce contiguous collision tiles into row/column strips. Target: <300 static bodies.
- **Before /play first-frame claims become user-visible:** run `playwright-lighthouse --preset=mobile --throttling=4G --network-conditions="Moto G4 throttled"` against a Vercel preview deploy and re-record the numbers. These synthetic estimates are calculator-grade only.
- **Cache strategy:** ensure the phaser chunk gets a long-cache `immutable` header from Vercel CDN — first-visit cost amortizes to zero on repeat visits and that's where the Moto G4 budget actually wins.
- **No action required on JSON content size** — there's two orders of magnitude of headroom; future districts can add significantly more detail.

## Block or pass?

**PASS** — every hard budget clears its limit with measurable headroom. The Moto G4 first-frame estimate is the only tight margin and is **synthetic only**; it must be re-verified with a real-device or throttled-Lighthouse run before the broader launch, but is not grounds to block this district's merge.
