# Pixel-2026 — Modernising Money-verse's Pixel Aesthetic

> **Author:** master-researcher subagent. **Date:** 2026-05-14. **Scope:** the user's complaint — *"everything is so small and tiny and 2 much 80s like, I want 2026 style pixelated art master it and implement it."*
>
> **Companion docs:** [visual-parity.md](./visual-parity.md), [district-chawl-mohalla.md](./district-chawl-mohalla.md), [ASSET_PLAN.md](../../assets/chawl-mohalla/ASSET_PLAN.md).
>
> **Honest framing.** Kenney Tiny Town + Tiny Dungeon are *deliberately* 8-bit nostalgia art. No camera shader can rewrite that intent. To reach 2026-painterly (Sea of Stars / Eastward / Coral Island / Hyper Light Drifter) we need (a) a different asset substrate AND (b) a small post-FX stack. Either alone falls short. Phase α below = ~25% lift in a week; Phase β = ~60% more; Phase γ (Indian commission) = the last ~15%, deferred.

---

## 1. What "2026 pixel art" technically means

Not taste — measurable technical decisions. Wherever we sit left, the gap is the move right.

| Axis | 80s / 16-bit (us today) | 2024-2026 painterly (target) |
|---|---|---|
| **Palette** | 8-16 colours/scene, flat ramps | 64-256 colours, multi-stop ramps + dithering |
| **Tile size** | 8×8 or 16×16 flat | 16×16 painterly, 24×24, 32×32, 48×48 |
| **Shading** | Flat fill + 1px highlight | 3-5 tones, rim light, fake AO under overhangs |
| **Lighting** | Fully baked | 1 baked + 1-3 dynamic point lights (lamps, windows at dusk) |
| **Outline** | Hard 1px black or none | Soft self-shadow outline matching local palette |
| **Walk anim** | 2-frame | 4-8 frame, plus 2-frame idle bob + blink |
| **Env anim** | None | Water shimmer, foliage sway, fire, ambient particles |
| **Post-FX** | None | Selective bloom, vignette, tilt-shift, colour LUT |
| **Camera** | Hard 2× nearest-neighbour | 3-4× + sub-pixel snap + easing + optional letterbox |
| **HUD** | Boxy in-world panels | Diegetic 9-slice + soft drop-shadow + typewriter |
| **Drop shadow** | None / hard 1px | Soft 35-50% alpha ellipse under every prop |

Money-verse sits hard-left on every axis except postFX (`WorldScene.applyCameraPostFx()` already wires bloom + vignette + tilt-shift + gradient) — but the lift is muted because the substrate has nothing to bloom from. Fix priority: **shading depth → environmental animation → postFX**.

---

## 2. Seven masters

### M1. Eric Barone — *Stardew Valley* (2016)
- 16×16, ~24 colours, single NW light direction, 4-frame walks.
- Distinctive: seasonal palette swap on the same tileset; 3-frame animated water; window-glow additive layer at night; NPC schedules; dialog portraits with mood variants.
- **Borrow now:** *seasonal palette swap via camera tint* — `cam.setTint(0xffd5a0)` for dusk-saffron is 1 line, big atmosphere lift.

### M2. Sabotage Studio — *Sea of Stars* (2023)
- 24×24 sprites on 3D normal-mapped meshes; ~32 sprite colours, expanded by real-time light.
- Distinctive: normal-mapped sprites; parallax; selective bloom on emissives; ambient sparkle; rotating light for day-night.
- **Borrow now:** *additive-blend glow sprites over lamps* — 24×24 radial gradient, `BlendModes.ADD`, camera-pinned. ~70% of the felt effect, ~0% perf.

### M3. Pixpil — *Eastward* (2021)
- 16×16 sprites, hand-painted high-res backgrounds pixel-snapped on render. ~40 colour scenes, warm-cool contrast (sodium-orange vs indigo).
- Distinctive: cinematic dialog box with animated portrait + lip flap; god-rays; lens dirt; subtle <1px chromatic aberration.
- **Borrow now:** *dialog box presentation* — bordered panel, portrait, typewriter, "▼" indicator. Already on Phase A scaffolding list; pull forward as α-9.

### M4. Stairway Games — *Coral Island* (2022)
- 32×32 (the single biggest reason it reads "modern" vs Stardew). ~50 colours, ultra-warm bias.
- Distinctive: drop shadow under *everything*; ambient particle layer (fireflies/dust/leaves); bloom on water + windows; chunky outlined characters with rim-light.
- **Borrow now:** *drop-shadow-everywhere + ambient particles*. Both cheap Phaser. Coral Island's two highest-impact moves; ship this week.

### M5. Pixel Sprout Studios — *Sun Haven* (2023)
- 16×16 base; modernity earned by light density + animation, not tile size.
- Distinctive: parallax (0.3× mid, 0.15× far); coloured point lights at night; every NPC has 2-frame breath idle + blink; chimneys smoke.
- **Borrow now:** *parallax background layer* — 1 PNG of distant Mumbai silhouette at 0.3× scroll. ~1h to author, ~50 LoC to wire.

### M6. Heart Machine — *Hyper Light Drifter* (2016)
- 16×16, ~16 colours, but postFX carries the look.
- Distinctive: heavy selective bloom on neon highlights; ~0.5px chromatic aberration; film grain; per-region palette LUTs; very subtle CRT.
- **Borrow now:** *proof that postFX can carry low-res IF the underlying palette has high-contrast highlights*. Our bloom feels mild because Kenney's grey/green/orange palette has nothing high-luminance for it to seize. **Fix:** recolour player to saffron `#f4b454` — bloom self-selects to it. 1 PNG edit, zero code.

### M7. Pixel-Boy & PixelFrog — the CC0 painterly creators
- **Pixel-Boy Ninja Adventure:** 16×16 tiles, 16×24 characters, ~24-32 colours/scene, 4-dir 4-frame walks, soft shading + rim light, animated FX (fire, water, dust, splash, sparkle), HUD, 2 pixel fonts. CC0 confirmed. **GitHub mirror solved:** [pixel-boy/NinjaAdventure](https://github.com/pixel-boy/NinjaAdventure) (official) + [sparklinlabs mirror](https://github.com/sparklinlabs/superpowers-asset-packs/tree/master/ninja-adventure) (organised PNG tree).
- **PixelFrog Pixel Adventure:** CC0, but platformer geometry. Use `/fx/` subset only.
- **PixelFrog Tiny Swords:** *no longer CC0* — current license forbids redistribution. Reject.

**Borrow now:** *adopt Ninja Adventure as the new substrate.* This is Phase β.

---

## 3. Phaser 3.90 postFX — what actually works, what costs what

All confirmed against [Phaser 3.90 FX docs](https://docs.phaser.io/phaser/concepts/fx). Cost class is for Moto G4-tier (4-core mobile, Mali-T720).

| Effect | API | Mobile cost | Modernity lift | Moto G4? |
|---|---|---|---|---|
| **Bloom** | `cam.postFX.addBloom(color, offsetX, offsetY, blurStrength, strength, steps)` | High (3-5ms @ steps:4) | High — sells highlights | **No** on low; yes medium+ |
| **Vignette** | `cam.postFX.addVignette(x, y, radius, strength)` | Very low (~0.2ms) | Medium | Yes |
| **TiltShift** | `cam.postFX.addTiltShift(radius, amount, contrast, blurX, blurY, strength)` | High (3-4ms, multi-pass) | High — DoF illusion | **No** low; yes medium+ |
| **Gradient** | `cam.postFX.addGradient(c1, c2, alpha, fromX, fromY, toX, toY, size)` | Very low | Medium — colour grade | Yes |
| **ColorMatrix** | `cam.postFX.addColorMatrix().saturate(0.12).brightness(1.04)` | Very low | Medium-high — per-district palette shift | Yes |
| **Glow** | `obj.postFX.addGlow(color, outerStrength, innerStrength, knockout)` | Low *per object* | High *targeted* — quest "!" pulse | Yes (1-3 objects) |
| **Shine** | `obj.postFX.addShine(speed, lineWidth, gradient, reveal)` | Low | Medium — coin/chest sweep | Yes (1-2 objects) |
| **Shadow (preFX)** | `obj.preFX.addShadow(x, y, decay, power, color, samples, intensity)` | Medium per-obj (samples drive cost) | **Very high** | Yes — samples:3 low, samples:6 med+ |
| **Pixelate** | `cam.postFX.addPixelate(amount)` | Low | **Negative** — undoes Phase β | **Never** |
| **Barrel** | `cam.postFX.addBarrel(amount)` | Low | Low — "old TV" feel | **Never** |
| **Bokeh** | `cam.postFX.addBokeh(radius, amount, contrast)` | Medium (2-3ms) | Medium | Skip on low |

**Mobile postFX warning:** the Phaser forum reports the PostFXPipeline can cost 30-80% fps on weak GPUs even when the shader does nothing ([forum thread](https://phaser.discourse.group/t/bad-performance-of-postfxpipeline-on-tilemap-layers/12058)). Our existing `tier === "low"` skip-everything gate in `PostFxStack.ts` is correct. Don't loosen it.

### Ranked Phase α moves (impact ÷ effort)

1. **`preFX.addShadow` on every sprite** — Coral Island's signature drop-shadow-everywhere. Centralise in a `applyDropShadow(sprite, opts)` helper. Single biggest perceptual lift.
2. **`ParticleEmitter` ambient layer per district** — dust motes mid-day, fireflies at dusk, monsoon drizzle in season. Capped 30-50 particles, near-zero cost.
3. **Boost existing `applyCameraPostFx`** — keep current bloom+vignette+tilt-shift, **add** `addColorMatrix().saturate(0.12).brightness(1.04)`, raise `addGradient` alpha 0.16 → 0.22, sweep tint warmer at dusk.
4. **Per-NPC `addGlow` pulse** on quest indicators (replace static `setQuestIndicator` graphic).
5. **`shine` on coin pickups + bordered interact prompts.**
6. **Parallax background** — 1 PNG of distant Mumbai silhouette at 0.3× scroll.
7. **Sub-pixel snap camera** — `setDeadzone(60, 40)` to kill near-stationary jitter.
8. **Day/night camera tint sweep** — 60s cycle, even at 0.85 alpha mix.
9. **Faux-rim-light on player** — composite a 50%-alpha lighter copy offset (-1,-1).
10. **`addColorMatrix().saturate(...)` per-district LUTs** when Phase β lands.

**Moto G4 budget:** Phase α moves 1-7 are each <1ms. Total Phase α frame-time impact: **~3-5ms** of the 16ms budget. Safe.

---

## 4. Asset hunt — the credible 2026-painterly CC0 path

The Round-2 hunt correctly identified Ninja Adventure as the leading candidate but flagged itch.io-only as a blocker. **Blocker solved.**

- **Primary mirror:** [github.com/pixel-boy/NinjaAdventure](https://github.com/pixel-boy/NinjaAdventure) — author's Godot 4 project (5.7MB, 48 stars, pushed 2024-04-19). PNG atlases under `/content/{character,environment,map,particle,ui,weapon}/`. Clone + cherry-pick.
- **Organised mirror:** [sparklinlabs/superpowers-asset-packs/ninja-adventure](https://github.com/sparklinlabs/superpowers-asset-packs/tree/master/ninja-adventure) — flatter tree `{characters, background-elements, fx, hud, items, monsters, weapons}` + fonts + 2 preview PNGs. Easier `wget`.
- **License (verbatim from [itch.io](https://pixel-boy.itch.io/ninja-adventure-asset-pack)):** *"They are released under the Creative Commons Zero (CC0) license. You can use any and all of the assets found in this package in your own games, even commercial ones. Attribution is not required but appreciated."* Zero share-alike, zero redistribute-block.

The Part-1 preview shows ~200 sprites: 50+ human/monster characters with rim-lit shading, urban + village tiles with shadow casts, animated FX, full HUD. Unambiguously a step into 2026-painterly territory.

**Other 2026-tier candidates — honest verdicts:**

| Pack | License | Verdict |
|---|---|---|
| LimeZu Modern Interiors/Exteriors | Paid + no-redistribute | **Reject.** Best-in-class but legally inadmissible. |
| CupNooble Sprout Lands | Free = non-commercial only; paid = no-redistribute | **Reject.** |
| PixelFrog Tiny Swords | Current = no-redistribute (older CC0 unverifiable) | **Reject** (licence-archaeology risk). |
| PixelFrog Pixel Adventure | CC0, multiple GH mirrors | **Use `/fx/` subset only** (platformer characters don't port). |
| Ansimuz Tiny RPG Town | CC0 base (expansions encumbered, ignore) | **Adopt as supplement** — fills tree/river/road gaps. |
| 0x72 DungeonTileset II | CC0 | Already in Round-2; defer to bank-vault district. |
| Sharm LPC Adobe | CC-BY 4.0 + CC-BY-SA 3.0 dual | **Restricted.** SA contaminates; per-asset re-verify. |
| GrafxKid City Mega | CC0 | Already in Round-2; citizens crowd-extras. |
| Mounir Tohami GUI | CC0 | Adopt — fills HUD gaps (buttons, sliders, gauges). |

**Recommended Phase β substrate:**
- Tileset: Ninja Adventure urban/village subset (CC0)
- Characters: Ninja Adventure + reskin overlays (CC0)
- Env tiles: Ansimuz Tiny RPG Town (CC0)
- Citizens: GrafxKid City Mega (CC0)
- FX: Ninja Adventure `/fx` + PixelFrog Pixel-Adv `/fx` (CC0)
- HUD: Ninja Adventure `/hud` + Mounir GUI (CC0)
- Pixel font: Ninja Adventure font8x8 + Monogram (CC0)

Zero attribution debt. Zero share-alike risk. ~200 KB delta over current atlas after culling.

**AI-generated pixel art:** still rejected as shipped asset (palette drift, broken seams). Acceptable only as mood-board input a human re-pixels.

---

## 5. Three-phase rollout

### Phase α — code-only (this week, 1-2 sessions, no new art)

| # | Move | File | LoC |
|---|---|---|---|
| α-1 | `preFX.addShadow` on player/NPCs/props via `lib/dropShadow.ts` helper | `entities/Player.ts`, `Npc.ts`, new `lib/dropShadow.ts` | ~80 |
| α-2 | `AmbientParticleLayer` per district (dust/fireflies/drizzle) | new `entities/AmbientParticles.ts` + district-meta | ~150 |
| α-3 | Boost `applyCameraPostFx` — add `ColorMatrix.saturate(0.12).brightness(1.04)`, raise gradient α to 0.22 | `WorldScene.ts` | ~30 |
| α-4 | Saffron `addGlow` pulse on quest "!" NPCs | `entities/Npc.ts:setQuestIndicator` | ~25 |
| α-5 | Recolour player body fill to saffron `#f4b454` (1 PNG edit) | atlas | 0 |
| α-6 | Parallax background — 1 Mumbai silhouette PNG at 0.3× scroll | new `entities/ParallaxBackground.ts` + 1 PNG | ~80 |
| α-7 | Camera `setDeadzone(60, 40)` to kill near-stationary jitter | `WorldScene.ts:configureCamera` | ~10 |
| α-8 | Day/night camera-tint sweep on 60s cycle | new `entities/DayCycle.ts` | ~60 |
| α-9 | Bordered pixel-pill interact prompt with shadow + typewriter | `components/game/InteractPrompt.tsx` | ~80 |
| α-10 | Monogram CC0 pixel font for in-world `add.text` | `PreloadScene.ts` + `lib/fonts.ts` | ~40 |

**Subtotal:** ~555 LoC across ~10 files + 1 PNG + 1 font. Achievable in 1-2 sessions. Expected lift: ~25-35% closer to 2026-painterly while still on Kenney tiles.

**Measurement:** show 3 users before/after side-by-side, ask "rate release year 1995-2025". Before median expected ~2002. After α expected ~2014.

### Phase β — substrate swap to Ninja Adventure (next week, 2-3 sessions)

| # | Move | Effort |
|---|---|---|
| β-1 | `git clone --depth=1` Ninja Adventure → `assets/_raw/ninja-adventure/` + CC0 LICENCE | 0.5h |
| β-2 | Cull to urban/village subset (~300 KB of 5.7MB); palette-shift to warm-Indian-evening (terracotta/saffron/indigo per ASSET_PLAN §3) | 6-8h |
| β-3 | Replace `CHAWL_TILESET_KEY` reference; re-author Tiled map to new tile IDs | 4-6h |
| β-4 | Swap player sprite to Ninja Adventure base; recolour to South-Asian skin + saffron kurta + indigo dhoti (saree/kurta overlays defer to γ) | 3h |
| β-5 | Animated water/fire/foliage via Tiled tile-animations (Phaser supports natively) | 2h |
| β-6 | Re-tune α-3 bloom strength against new palette to avoid over-saturation | 1h |

**Subtotal:** ~17-20h. Expected lift: another ~30-40%, putting us at Stardew-quality + postFX. Remaining ~30% = Phase γ Indian-specific re-skin.

### Phase γ — Indian re-skin commission (deferred, ~₹36-80k or 60-80h in-house)

Identical scope to [visual-parity.md §4 Phase D](./visual-parity.md): chai stall, dabbawala, saree/kurta overlays, hanging laundry, tulsi/diya, kirana shopfront, ₹ glyph. β makes γ *cheaper* because the new base sprites already have painterly shading.

---

## 6. Anti-patterns — what NOT to do to fake "modern"

Each below is a tempting shortcut that worsens *our* game specifically.

1. **CRT scanlines.** Hyper Light Drifter barely uses it; lazy implementations break text legibility. We have lots of UI text — reject.
2. **Aggressive chromatic aberration.** ≥1px CA → motion sickness on phones. If used, cap 0.3px on emissives only.
3. **Pixelate postFX on pixel art.** Down-resolves real detail; undoes Phase β. **Never enable `cam.postFX.addPixelate`.**
4. **Low-contrast "muted indie" palettes that fail WCAG.** Painterly ≠ greyscale. Keep dialog text ≥4.5:1 contrast.
5. **Universal bloom.** Bloom on everything = bloom on nothing. Bloom only highlights (sun-lit windows, lamps, coins, player saffron). Keep emissives scarce in palette so bloom self-selects.
6. **Heavy tilt-shift on action gameplay.** Looks great in screenshots, claustrophobic in play. Cap `tiltShift.radius ≥0.7, amount ≤1.0` (we're there — stay).
7. **Camera-skew-faking-3D (Octopath style).** Octopath earns it with 3D meshes; we don't. Breaks `setRoundPixels(true)`.
8. **Animating *everything*.** Sun Haven gets away with it via 2-frame anims; we will hit CPU walls on Moto G4 first. Cap ambient particles 50, simultaneously-blinking NPCs 4.
9. **Cold blue-grey "Western dungeon" palette drift.** Default of most CC0 packs. PRD §8 mandates warm Indian-evening; every recolour pass biases warm (saffron + terracotta), never cool.
10. **Permanent letterbox.** Eastward uses 2.35:1 for cinematics *only*. Permanent letterbox compresses mobile vertical space; reserve for dialog cutscenes.

---

## 7. Honest summary

**This week (Phase α, 1-2 sessions, no new art):** drop-shadows everywhere + ambient particles + saturation/warm colour grade + saffron quest-NPC glow + parallax Mumbai silhouette + sub-pixel camera + saffron player recolour + pixel-font swap. **Expected lift:** ~10-year perceived release-year jump on the same Kenney tiles. Moto G4 safe (~3-5ms extra/frame under 16ms target).

**Next week (Phase β, 2-3 sessions):** swap Kenney Tiny Town → Ninja Adventure (CC0, github-mirrored, ~200 painterly sprites). Re-tile chawl map. **Expected lift:** another ~10-15 years, reaching Stardew quality + stronger postFX.

**Later (Phase γ, deferred ₹36-80k):** chai stall, dabbawala, saree/kurta overlays. Indian-specific work not in the OSS commons.

**Anti-pattern guard:** no CRT scanlines, no CA ≥1px, no pixelate postFX, no aggressive DoF on gameplay, no Western palette drift, no over-animation on Moto G4.

---

## Sources

- [Phaser 3.90 FX docs](https://docs.phaser.io/phaser/concepts/fx) — API signatures verified.
- [Phaser postFX mobile perf thread](https://phaser.discourse.group/t/bad-performance-of-postfxpipeline-on-tilemap-layers/12058) — empirical 30-80% fps drop on weak GPUs.
- [Pixel-Boy itch.io Ninja Adventure](https://pixel-boy.itch.io/ninja-adventure-asset-pack) — CC0 statement verbatim.
- [github.com/pixel-boy/NinjaAdventure](https://github.com/pixel-boy/NinjaAdventure) — official Godot 4 source, 48 stars.
- [Superpowers ninja-adventure mirror](https://github.com/sparklinlabs/superpowers-asset-packs/tree/master/ninja-adventure) — organised PNG tree.
- [PixelFrog Tiny Swords](https://pixelfrog-assets.itch.io/tiny-swords) — current license restricts redistribution; rejected.
- [LimeZu Modern Interiors](https://limezu.itch.io/moderninteriors) — paid + no-redistribute; rejected.
- [CupNooble Sprout Lands](https://cupnooble.itch.io/sprout-lands-asset-pack) — non-commercial free tier; rejected.
- [Ansimuz Tiny RPG Town](https://ansimuz.itch.io/tiny-rpg-town) — CC0 base pack confirmed.
- [Creative Bloq — CrossCode 2D-looks-3D technique](https://www.creativebloq.com/3d/video-game-design/this-technique-for-making-2d-pixel-art-look-3d-is-blowing-peoples-minds).
- [80.lv — Eastward profile](https://80.lv/articles/eastward-charming-chinese-pixel-art-adventure).
- [NPR — Stardew Valley legacy](https://www.npr.org/2025/01/24/g-s1-44510/the-legacy-and-future-of-the-farming-game-stardew-valley).
