# Technical Artist Audit — Money-verse

**Stack:** Phaser 3.90 / WebGL, pixelArt on, antialias off, roundPixels on, zoom 3x.
**Current postFX (`WorldScene.ts:463-478`):** `addBloom(0xffe9a3, 0.6, 0.6, 1.0, 0.35, 4)` + `addVignette(0.5, 0.5, 0.75, 0.3)` + `addColorMatrix().saturate(0.1, true)`.
**Verdict:** "1/10, 80s." Fair. The frame is technically clean but visually inert.

---

## 1. Why it still reads 80s

1. **Zero dynamic light.** Every tile and sprite gets identical ambient. No falloff, rim, or contact darkening. The vignette is a static screen mask, not a world light — does not track the player or react to time. Largest gap vs Stardew/Eastward.
2. **No normal-map fake.** NA tiles are flat colour. Without a directional shade pass multiplied into the world layer, every surface has identical luminance — reads as paper.
3. **Flat colour ramp, no LUT.** `saturate(0.1)` only nudges chroma. No global grade (warm shadows / cool highlights). Stardew's signature is its Resolve-graded LUT; we ship factory white-point.
4. **No time-of-day.** Lamp posts and shop windows are spec'd but lighting is constant noon — the lamps have nothing to be lamps *against*.
5. **No emissive / specular hints.** Windows, lanterns, hand-pump, puddles — none tinted, none additive. Eastward sells mood on warm window glow vs cold dusk; we render windows as opaque brown rectangles.

---

## 2. Phaser-feasible lifts (ranked, code-only)

| # | Lift | Cost | Delta |
|---|------|------|---|
| 1 | **Player-tracked radial light mask.** Replace `addVignette` with a `RenderTexture` redrawn each frame: soft radial gradient at `player.x/y`, multiply-blended below sprites. | 0.4ms | Massive. |
| 2 | **Day/night grade via `ColorMatrix` modulation.** Tween over 6 min: noon (neutral) → dusk (warm shadows, 0.85x) → night (cool, 0.6x). | 0.1ms | High. |
| 3 | **Emissive pass for windows / lamps / hand-pump.** Second tilemap layer of pure-emissive pixels, `setBlendMode(ADD)` with pulse tween. | 0.2ms | High. |
| 4 | **Puddle reflections.** Flipped player sprite, alpha 0.25, `ADD`, masked to puddle. Rain beat only. | 0.1ms | Memorable. |
| 5 | **Animated water/foliage** via tilemap `animation` (4-frame, 6fps). | 0.05ms | Kills still-photo feel. |
| 6 | **`addShadow` postFX on sprite layer**, 1px offset = free AO / contact shadow. | 0.2ms | Medium. |

**Shader picks** porting `@react-three/postprocessing` style into a custom `PostFXPipeline` (<60 lines GLSL each): **GodRays** (sun shafts through alleys), **ChromaticAberration** at 0.0015 (film feel), **NoiseEffect** at 0.04 (grain).

---

## 3. Light-rig spec — the chawl

**Day (noon → 16:00):**
- Ambient `#fff4d6` @ 1.0, flat.
- Courtyard skylight cone `#e8f0ff` @ 0.15, r=64px.
- Lamps / windows: off.

**Evening (18:00 → 21:00):**
- Ambient `#3a2855` @ 0.55 (cool dusk shadow).
- Lamp posts (x4, chawl spine): `#ffb347` @ 0.85, r=48px, 1.5Hz sine flicker ±5%.
- Shop windows (x6): `#ffd27a` @ 0.7, r=32px, additive, static.
- Hand-pump bulb: `#ffefb8` @ 0.6, r=40px.
- Optional player torch (story beat): `#ffd27a` @ 0.7, r=56px.

**Night (21:00 → 05:00):**
- Ambient `#1a1230` @ 0.4.
- All sources on, flicker amplitude 2x.
- Add stars: additive white noise @ 0.08 over sky tiles.

**Implementation:** one `RenderTexture` light buffer per palette state, blitted with radial gradients at each source's world position. Drawn `MULTIPLY` below sprites, `ADD` above. Total ~0.6ms on mid-tier.

---

## 4. Single biggest move

**Ship the player-tracked radial light mask + evening `ColorMatrix` palette as one "dusk pass" PR.** Replace the static vignette with a world-space `RenderTexture` light buffer, tween the global `ColorMatrix` toward warm-shadow dusk, additively blit shop windows + lamps. One file, ~150 lines, no asset re-authoring, no perf regression — moves us from "flat tilemap" to "lit world at golden hour" in one PR. That is the Stardew/Eastward delta; §2 is polish on top.

---

**Ranked summary:** Ship (1) a player-tracked radial light mask replacing the static vignette, (2) a day/night `ColorMatrix` tween anchoring the world to a clock, and (3) an additive emissive layer for shop windows and lamp posts — bundled as one "dusk pass" PR, the single biggest move lifting Money-verse from flat 80s tilemap to lit Stardew/Eastward-grade world in one change.
