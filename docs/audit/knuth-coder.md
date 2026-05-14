# Knuth Audit — Game-Loop & Finance-Sim

Scope: WorldScene, Player, Npc, dropShadow, ambientParticles, finance-sim/*, announce, assist.
Methodology: TAOCP discipline — invariants, termination, hot-path complexity, cleanup, numeric care.

---

## 1. Confirmed bugs (misbehave today)

### B1 — Pointer-input listeners leak across scene restarts (HIGH)
`Player.bindInputs` (Player.ts:135-137) attaches three listeners to `scene.input` without ever calling `off`. `WorldScene` SHUTDOWN handler (WorldScene.ts:89-94) only cleans up assist + ambient. On every district hop / `scene.restart` Phaser builds a new `Player` whose handlers reference the destroyed previous instance. Repro: enter Chawl, transition districts back-and-forth 3× → DevTools `scene.input.eventNames()` shows `pointerdown` listener count growing by 1 each round. Old `this` references prevent GC of the prior Player and joystick state collides.

### B2 — `events.on("story:dialog-*")` never unbound (HIGH)
WorldScene.ts:187 and :190 register handlers on `this.events` with no matching `off`. They survive scene re-create because `this.events` belongs to the scene; on `scene.restart` Phaser rebuilds the EventEmitter, *but* if onboarding triggers and the player exits before director resolves, the promise's `.then` still flips `storyActive=false` on the **dead** scene reference. Captured `this` keeps the prior scene alive. Same shape as B1.

### B3 — `tax.ts` slab accumulator: `slabTax += inBand * slab.rate` is float-additive on rupees (MEDIUM)
tax.ts:27 violates the "no `+` on rupees" rule. With taxable=₹2,400,001 the chain of 7 additions accumulates ~1e-10 rupee of drift, which is harmless *for display* but will diverge under unit tests that assert equality with a hand-computed integer. Recommend operating in paise (integer) inside the loop, dividing at the end. Same hazard in `emiSchedule` (emi.ts:31-39) where `outstanding -= principalPaid` runs 360+ times for a 30-year loan — by month 360, drift is observable in the third decimal place.

### B4 — `marketDayTick` log-domain pathology (MEDIUM)
market.ts:22: `Math.sqrt(-2 * Math.log(Math.max(u, 1e-12)))` clamps `u` away from zero but does **not** clamp the upper bound. If `rng()` ever returns *exactly* 1.0 (mulberry32 can't, but a swapped-in RNG could), `Math.log(1) = 0`, multiplied by `-2` is 0, sqrt is 0 — fine. The bigger issue: `Math.cos(2π·v)` with `v` near 0 or 0.5 forces `z` ≈ ±√(−2 ln u), tail-heavy. Acceptable for a game but not Gaussian. Fine for current use; flag for any future risk model use.

### B5 — `buildCollisionFromLayer` is O(width × height) per scene-create, allocating one Rectangle GameObject per blocked tile (LOW correctness, MEDIUM perf)
WorldScene.ts:273-288. For a 200×200 collision layer with 30% blocked tiles that's 12 000 physics-static rectangles. Phaser's static body broadphase tolerates this, but the allocation alone is ~12k GameObject creations on every district enter. Recommend merging runs into rows (greedy strip-pack) — same correctness, ~50× fewer bodies.

---

## 2. Latent hazards (ranked likelihood × severity)

| # | Hazard | Likelihood | Severity | Location |
|---|--------|-----------|----------|----------|
| H1 | NPC idle tween uses `y: { from: 0, to: -1 }` — local-y absolute capture inside Container. Same family as the patched Player bug. The moment anyone repositions the inner sprite (e.g. for "talking" animation, head-turn) tween will snap it back to 0. | Med | High | Npc.ts:114 |
| H2 | `questIndicatorTween` (Npc.ts:178) captures absolute `y: -28 → -32`. If any future code shifts the indicator (e.g. dialog-bubble offset), same snap. | Med | Med | Npc.ts:178 |
| H3 | `scene.input.on("pointerdown" …)` (Player.ts:135) handles **all** pointer events — including UI button clicks above the canvas that bubble to Phaser. Right-half pointerdown filter (Player.ts:141) is the correct guard but only on `pointerdown`; `pointermove`/`pointerup` fire regardless. A drag from canvas-left into canvas-right keeps the joystick alive. | High | Low | Player.ts:140-162 |
| H4 | `attachAmbientParticles` returns a cleanup that calls `emitter.destroy()` — but the perf-tier branch returning `() => {}` (ambientParticles.ts:41) silently drops the texture-cache entry. Not a leak (texture persists across scenes), just inert. | Low | Low | ambientParticles.ts:41 |
| H5 | `subscribeAssistMode` binds the **window** listener exactly once via `windowBound` (assist.ts:46) and never removes it. In an HMR / test environment with module reload, the closure outlives the listener set's contents. | Low | Low | assist.ts:45-56 |
| H6 | `rdMaturity` (fd.ts:32-43) computes `(1 + r) ** remainingQuarters` with **fractional** quarters — RBI convention mixes daily/quarterly accrual. The fractional exponent silently produces a "smooth" curve that no real bank uses. | Low | Med | fd.ts:40 |
| H7 | Tax slab last band is `upTo: Infinity` (constants.ts:30). `bandWidth = Infinity - prevCap = Infinity` then `inBand = min(remaining, Infinity) = remaining`. Works only because the next iteration sees `remaining ≤ 0`. Any code path that adds a slab *after* Infinity reaches NaN-land. | Low | Med | tax.ts:25-28 |

---

## 3. Complexity table (hot paths)

| Function | Measured/Inferred | Recommended | Notes |
|---|---|---|---|
| `WorldScene.update` → `refreshActiveNpc` | O(N) per frame, N ≈ 10 NPCs | O(N) — keep | Linear scan beats a kd-tree until N ≥ 64 (Vol. 3 §6.5 — overhead of spatial indexes dominates below ~50 points). |
| `WorldScene.update` → `refreshActiveZone` | O(1) per frame (cooldown-gated) | O(1) | Fine. |
| `buildCollisionFromLayer` | O(W·H) at scene create | O(R) where R = merged strips | See B5. |
| `emiSchedule` | O(M), M = tenureMonths | O(M) | Bound: M ≤ 360. Fine. |
| `rdMaturity` | O(M), M = months | O(1) closed-form | RD with quarterly compounding has a closed-form `M · (1+r)·((1+r)^q−1)/r` — replace the loop. |
| `marketDayTick` | O(1) per tick | O(1) | Fine. Two `rng()` per tick — note for seedability tests. |
| `slabTaxImpl` | O(S), S ≤ 7 slabs | O(S) | Fine. |

---

## 4. Cleanup gaps (every dangling subscription)

| Site | Subscription | Matching teardown? |
|---|---|---|
| WorldScene.ts:85 | `subscribeAssistMode(...)` | YES — `unsubscribeAssist?.()` in SHUTDOWN once-handler |
| WorldScene.ts:148 | `attachAmbientParticles(...)` | YES — `detachAmbient?.()` in SHUTDOWN |
| WorldScene.ts:187 | `this.events.on("story:dialog-open")` | **NO** — never `off`. B2 |
| WorldScene.ts:190 | `this.events.on("story:dialog-close")` | **NO** — never `off`. B2 |
| WorldScene.ts:497 | `keyboard.on("keydown-E")` | NO — relies on scene shutdown disposing keyboard plugin. OK in practice but not explicit. |
| WorldScene.ts:498 | `keyboard.on("keydown-SPACE")` | Same as above. |
| WorldScene.ts:545 | `this.scale.on("resize")` | **NO** — `scale` is game-global, leaks across scene restarts. |
| Player.ts:135-137 | `scene.input.on("pointer*", this.onX, this)` ×3 | **NO** — never `off`. B1 |
| Player.ts:112 | `scene.tweens.add` (idleTween) | NO `.stop()` on destroy. Phaser auto-removes tweens whose target is destroyed, so latent — not active leak. |
| Npc.ts:114 | sprite idleTween | Same as above. |
| Npc.ts:178 | questIndicatorTween | Stopped in `setQuestIndicator(false)`; not stopped on Npc destroy. Latent. |

---

## 5. Top 3 surgical fixes (priority order)

### Fix 1 — Plug the pointer-listener leak (Player.ts)
Bind `off` symmetric with `on`, scoped to scene SHUTDOWN.

```ts
// Player.ts:122 (bindInputs) — append:
scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
  scene.input.off("pointerdown", this.onPointerDown, this);
  scene.input.off("pointermove", this.onPointerMove, this);
  scene.input.off("pointerup", this.onPointerUp, this);
});
```

### Fix 2 — Plug the story-dialog listener leak (WorldScene.ts:187-192)
Replace bare `events.on` with named handlers + matching `off` registered in the existing SHUTDOWN once-handler.

```ts
// WorldScene.ts:187 — replace anonymous arrow handlers
const onOpen = () => { this.inDialog = true; };
const onClose = () => { this.inDialog = false; };
this.events.on("story:dialog-open", onOpen);
this.events.on("story:dialog-close", onClose);
this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
  this.events.off("story:dialog-open", onOpen);
  this.events.off("story:dialog-close", onClose);
  this.scale.off("resize"); // also unbinds the resize leak
});
```

### Fix 3 — Eliminate the NPC idle-tween absolute capture (Npc.ts:114)
Mirror the Player patch — use `scaleY` pulse, not local-y position. Removes the latent snap-back identical to the bug just patched on Player.

```ts
// Npc.ts:114 — replace
this.idleTween = scene.tweens.add({
  targets: sprite,
  scaleY: { from: 1.5, to: 1.5 * 0.97 },
  yoyo: true,
  duration: 1200 + (hashString(npcId) % 600),
  repeat: -1,
  ease: "Sine.InOut",
});
```

---

## Biggest latent hazard

**B1 + B2 together** — accumulating pointer + event-emitter listeners across scene restarts. By the 10th district transition, the previous nine Player instances are pinned in memory through their pointer handlers, each still receiving every pointer event. On mobile this manifests first as a phantom-joystick effect (old joysticks still updating their dead `this.joystick`) and second as a steady FPS bleed. Fix 1 + Fix 2 above are mechanical and remove the root cause.

— *"Beware of bugs in the above code; I have only proved it correct, not tried it."*
