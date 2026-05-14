# Money-verse — Immersive 3D Landing Page Research Brief

> Sequel to `landing-page.md`. The 2D-SVG-diorama blueprint stands; this brief asks: *where would 3D / WebGL deepen the promise without breaking our Moto-G4 + reduce-motion floor?* Open-source only.

The product: a free, hand-painted 2D HD-pixel RPG teaching Indian financial literacy. Re-branded **Money-verse**. The landing page must feel like *a place*, not a pitch. The first four seconds are the entire fight.

---

## Section 1 — The Masters (immersive web)

### A — Sabotage Studio · https://www.sabotagestudio.com
Pixel-art diorama with cursor-driven parallax — the studio's visual thesis rendered as a website. Layered PNGs with `transform: translate3d`, not a WebGL canvas; bloom is faked with blend-mode overlays. No autoplay audio. IA: diorama → manifesto → game cards → press → contact. **Steal:** *the hero proves the game's visual promise on the web itself.* ([Sea of Stars render pipeline](https://en.wikipedia.org/wiki/Sea_of_Stars))

### B — Inscryption · https://www.inscryption.com
2D **Windows-XP desktop metaphor** — application icons as nav, "Notepad" link to lore. No 3D. Audio off. Dual CTAs (trailer + demo). **Trick:** the *form of the website IS the form of the game.* **Steal:** form-follows-fiction. Our equivalent could be *a hand-drawn passbook* — chapters as ledger pages.

### C — Kojima Productions · https://www.kojimaproductions.jp/en
A single massive keyart, minimal copy, age-gate, then scroll into chaptered announcements. No WebGL; gravitas through typography + image scale. **Steal:** *image-as-cathedral* — let one image carry minutes of attention before any feature copy.

### D — Active Theory · https://activetheory.net
Returns 403 to scrapers; their public case studies (Mira, Neon, Neve, Porter Robinson Secret Sky, Diablo Immortal) all use the in-house **Hydra** WebGL framework. Pattern: *scene-as-spatial-IA* — sections are rooms the camera navigates between, with HTML overlays for content. ([Active Theory: Story of Hydra](https://medium.com/active-theory/the-story-of-technology-built-at-active-theory-5d17ae0e3fb4)) **Steal:** *camera-as-narrator*, executed with R3F instead of a proprietary engine.

### E — Lusion · https://lusion.co
Scroll-driven 3D gallery with "PLAY / MUTE" affordances and a synced timer overlay implying a master timeline. Hero is a coordinated WebGL canvas + video composite; one scroll = one shared timeline. **Steal:** the *one-timeline* discipline — every scroll event drives a single GSAP timeline that moves camera, lights, and overlay text in lockstep. ([Codrops: Cinematic 3D Scroll with GSAP](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/))

### F — Mobius Digital · https://www.mobiusdigitalgames.com
No 3D. One cosmic image, one tagline, one platform-buy CTA. Atmosphere through *restraint*. **Steal:** confidence to under-design chapter pages. The hero may be 3D; the rest is a single image and a sentence.

### G — Cult of the Lamb · https://www.cultofthelamb.com
Looping 2D pastoral-horror illustration with subtle idle frames. Pastel palette over horror substance; strong typographic personality. ([Game Developer interview](https://www.gamedeveloper.com/design/interview-corralling-the-inherent-cuteness-of-cult-of-the-lamb)) **Steal:** *tonal opposites well-paired* — golden-hour warmth carrying serious lessons about debt, scams, and SIPs.

### H — Awwwards "Games" patterns
Across recent Site-of-the-Day wins (Deliciously Dark Escape, The Crumbskees, Max Mara Treasures of Japan, Wayfinder): **pixel-art WebGL hybrid** (PNG sprites through a fragment shader for bloom/displacement), one playable beat in the hero, no scroll-jacking, generous whitespace. ([Awwwards Games](https://www.awwwards.com/awwwards/collections/games/), [Best Three.js sites](https://www.awwwards.com/websites/three-js/))

---

## Section 2 — Consensus patterns (3+ masters)

1. **One coordinated visual carries minutes of attention.** 3D or 2D — never a hero that competes with itself.
2. **One timeline drives the whole experience.** Scroll = playhead. No section animates in isolation.
3. **WebGL is for *atmosphere*, not content.** Text stays HTML, buttons stay buttons. Canvas does light, depth, particles, parallax.
4. **Restraint scales with depth.** The richer the hero, the simpler the chapter pages (Mobius / Kojima).
5. **Audio is always opt-in.** Muted by default; one ambient toggle near the logo. ([howler.js + autoplay policy](https://github.com/goldfire/howler.js/issues/939))

## Section 3 — Divergences / choices for Money-verse

| Choice | Why |
|---|---|
| **Hybrid 2.5D hero (pixel art textured on R3F planes), NOT pure 3D** | Our game *is* 2D pixel art. A polygonal hero would lie about the product. But layered pixel planes inside a WebGL canvas unlock *real* bloom, light shafts, depth-of-field, and shader-driven flicker that CSS cannot fake. |
| **Three.js + @react-three/fiber over Pixi.js** | We want a 3D *camera* (orbit on cursor, dolly on scroll), not just 2D parallax. R3F gives us camera, lights, post-processing, and a path to small 3D set-pieces (e.g., a rupee coin rotating in space) without two render loops. Pixi would be lighter (~80 KB) but caps us at 2D. ([Three.js ~155 KB gzip + R3F](https://gracious-keller-98ef35.netlify.app/docs/recipes/reducing-bundle-size/)) |
| **GSAP ScrollTrigger + Lenis for scroll choreography, NOT drei `ScrollControls`** | `ScrollControls` hijacks native scroll into a virtual scrubber; GSAP + Lenis preserves native scroll, plays nicely with reduce-motion, and lets us pin one section while the canvas animates without removing the URL bar / page-up affordances. ([Lenis + GSAP integration](https://gsap.com/community/forums/topic/34814-scrolltrigger-with-lenis-smooth-scroll-problem-with-the-scrollerproxy-setup/), [Codrops cinematic 3D scroll](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/)) |
| **No `ScrollControls` *except* on hero set-piece** | If we use it, we wrap only the hero canvas in `<ScrollControls pages={2} damping={0.2}>`, and the rest of the page uses real scroll. |
| **GSAP is in.** | As of April 2025, every GSAP plugin (ScrollTrigger, ScrollSmoother, SplitText, MorphSVG) is free for commercial use under their standard license. ([Webflow makes GSAP 100% free](https://webflow.com/blog/gsap-becomes-free)) Lenis is MIT. Howler is MIT. Three / R3F / drei / maath are MIT. |
| **Capability-gated WebGL.** | We render an `<img>` static composite as the base layer. R3F mounts only when WebGL2 is supported, `prefers-reduced-motion: no-preference`, and `navigator.connection?.effectiveType !== 'slow-2g' | '2g'`. |

## Section 4 — Open-source dep choices

| Dep | Licence | Role | Gzip |
|---|---|---|---|
| `three` | MIT | Renderer | ~155 KB |
| `@react-three/fiber` | MIT | React reconciler | ~10 KB on top of three |
| `@react-three/drei` | MIT | Helpers — `Plane`, `useScroll`, `Html`, `PerspectiveCamera`, `useTexture` | tree-shaken, ~6 KB on average |
| `@react-three/postprocessing` | MIT | `<EffectComposer>`, `<Bloom>`, `<Vignette>`, `<DepthOfField>` | ~18 KB |
| `gsap` (core + ScrollTrigger) | Free for commercial use | Master timeline + scroll scrubber | ~28 KB |
| `lenis` | MIT | Inertial scroll synced to GSAP ticker | ~3 KB |
| `howler.js` | MIT | Ambient audio (opt-in) | ~10 KB |
| `maath` | MIT | Math helpers (easing, lerp, noise) | ~3 KB |

**Critical-path JS budget:** ~233 KB gzip for the *full* WebGL path, well inside our 800 KB ceiling. Pixel-art-textured plane heroes don't need GLTFs — total asset weight stays under 600 KB.

**Reject:** Theatre.js (powerful but adds 40 KB and a second timeline source-of-truth; GSAP suffices), Pixi.js (2D-only; we want camera), Babylon.js (overkill).

---

## Section 5 — The Blueprint

### 5.1 Section list (11 sections)

1. **Sticky utility bar** — EN/HI · GitHub stars · *Free forever, open-source* pill · ambient-audio toggle (off by default).
2. **Hero — Chawl Mohalla diorama** (R3F, 2.5D pixel-on-plane). Three-line headline, one primary CTA *Step into Money-verse →*, secondary text link *Watch the 60s trailer*.
3. **Scroll set-piece — "First payday"** — camera dollies from rooftop into Maya's room; the envelope of cash zooms forward; ₹15,000 splits into Rent / Save / Spend as drag-targets.
4. **Bridge across to Bank Bazaar** — camera pans; static 2D resumes; CA Lakshmi aunty introduces herself in a card.
5. **Seven districts** — illustrated map (SVG, not WebGL); each district hover-lifts a portrait card.
6. **Pillars as promises** — 4 cards with citation pills (Khan / Celeste / Duolingo / Varsity).
7. **For whom** — Ananya / Rohit / Saanvi portraits with need + outcome.
8. **Inspired by** — Stardew · Celeste · Duolingo · Khan · Varsity.
9. **Anti-promise band** — black, serif white: *No confetti. No leaderboards by P&L. No notifications hyping volatility. No paywalled lessons. Ever.*
10. **Open source / contribute** — repo card, license, good-first-issues, Discord.
11. **Final CTA — night diorama** — camera return to chawl at night, one lamp, repeat CTA, footer.

### 5.2 The hero — recommendation

**Hybrid 2.5D: pixel-art PNGs as textures on R3F `<Plane>` meshes, single `<Canvas>`, ortho camera, post-processing.** Not a polygonal scene — our existing diorama *promoted into WebGL* so we can do what CSS cannot:

- **Selective bloom** on the lamp — `<Bloom luminanceThreshold={0.9} />`. ([UnrealBloomPass docs](https://threejs.org/docs/pages/UnrealBloomPass.html))
- **God-rays** from the saffron sky — one radial-falloff fragment shader on a quad behind silhouettes.
- **Depth-of-field** focusing on Maya's window, softening foreground laundry lines.
- **True cursor parallax** via `maath.easing.damp3` — each plane has its own z-depth, so camera tilt produces real depth, not stacked translates.
- **Lamp flicker** as a `uTime` uniform driving bloom strength — richer than a CSS keyframe.
- **Particle dust** via `<Points>` with ~80 instanced sprites.

Crucially: **textures stay at 480×270 with `magFilter = NearestFilter`** — pixel-perfect. We light the art, we don't blur it.

### 5.3 Scroll choreography — concrete

```
Lenis.raf → GSAP.ticker
GSAP master timeline → ScrollTrigger.scrub: 1.5
  ├─ tl.to(camera.position, { z: 4 → 1.2 })         // dolly into Maya's room
  ├─ tl.to(uniforms.uVignette, { value: 0 → 0.6 })  // tighten focus
  ├─ tl.to(envelopeRef.position, { y: -0.5 → 0 })   // envelope rises
  ├─ tl.to('.payday-ui', { opacity: 0 → 1 })        // HTML overlay fades in
  └─ tl.to(camera.position, { x: 0 → 3 })           // pan to Bank Bazaar
```

One timeline, scrubbed by scroll, drives camera + uniforms + HTML overlays. After the bridge transition (~150 vh), the WebGL canvas un-pins and the rest of the page is native scroll. ([Codrops: cinematic 3D scroll with GSAP](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/))

### 5.4 Five set-pieces in the scroll

1. **0–20vh** — Rooftop ortho view of Chawl Mohalla, lamp flicker, ambient dust. Headline + CTAs.
2. **20–45vh** — Camera dollies down the alley; god-rays widen; depth-of-field tightens on Maya's window.
3. **45–80vh** — Window blooms; we're *inside* Maya's room; an envelope rests on the table. *"It's your first payday. ₹15,000."* Three drag-targets fade in as HTML over the canvas: Rent (₹4,800) · Save (?) · Spend (?). Saanvi's aunt cameo in the corner reacts to choices.
4. **80–120vh** — Camera pans right; the WebGL hero un-pins; a static painted bridge image takes over; CA Lakshmi aunty waves from across the road. *"Bank Bazaar — when you're ready."*
5. **End-of-page (final CTA)** — Camera returns to the chawl at night palette; lamp is the only light; CTA repeats.

### 5.5 Audio strategy

- **Default muted.** No autoplay with sound, ever. ([howler.js + Chrome policy](https://github.com/goldfire/howler.js/issues/939))
- **One opt-in pill** *"Hear the chawl"* in the utility bar. On click, Howler fades in one mono 64-kbps Opus loop (~80 KB) plus 3 random one-shots (chai cup, lamp flicker, distant honk) every 4–8s via sprites.
- **Captions:** when on, a small caption pill describes the soundscape (*"distant Hindi film song · monsoon · chai vendor"*) for SR and HoH users.

### 5.6 Performance budget (Moto G4 / 4G slow profile)

| Metric | Target | Strategy |
|---|---|---|
| **LCP** | ≤ 2.5s on slow 4G | LCP element is the *static composite PNG* of the hero, served by `next/image` priority. The R3F canvas mounts after LCP. |
| **TTI** | ≤ 4.5s on Moto G4 | R3F + textures lazy-import via dynamic `import()` after `requestIdleCallback`. |
| **Critical JS** | ≤ 250 KB gzip | three + R3F + drei + GSAP + Lenis = ~210 KB. Postprocessing only loads if device passes capability gate. |
| **CLS** | < 0.05 | Canvas reserves 100vh via aspect-ratio box pre-mount. |
| **GPU on Moto G4** | DPR capped at 1.5 | `<Canvas dpr={[1, 1.5]} />` per [R3F scaling-performance guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance). Postprocessing chain disabled if `navigator.hardwareConcurrency < 4`. |

**Capability gate (TypeScript pseudocode):**

```ts
const canRender3D =
  hasWebGL2() &&
  !mediaQuery('(prefers-reduced-motion: reduce)').matches &&
  (connection?.effectiveType ?? '4g') !== '2g' &&
  (connection?.effectiveType ?? '4g') !== 'slow-2g' &&
  (navigator.hardwareConcurrency ?? 4) >= 4
```

If false: render the static composite PNG. Hero is still beautiful. We lose bloom and parallax; we keep the page.

### 5.7 Accessibility plan

- **`prefers-reduced-motion: reduce` → static composite PNG.** No canvas, no scroll-jacking, no parallax. Stardew-mode.
- **Screen readers:** canvas is `aria-hidden="true"`; all narrative content is real HTML (Server-Component headings + paragraphs). SR users get the *story* without the *scene*.
- **Keyboard:** Lenis preserves native scroll, so arrow keys + PageDown still work. Payday drag-targets accept Enter/Space + arrows via `react-three-a11y`'s focus model. ([react-three-a11y](https://github.com/pmndrs/react-three-a11y))
- **Contrast:** AA on body, AAA on the anti-promise band. Hero headline renders in DOM above the canvas so bloom never degrades contrast.
- **`Esc`** pauses ambient audio and freezes camera tween. Focus rings preserved across the canvas.

### 5.8 Components & file structure (Next.js 16 App Router)

```
app/(landing)/
├─ page.tsx                  # Server shell
├─ layout.tsx                # Lenis provider, GSAP context
├─ _components/
│  ├─ UtilityBar.tsx         # client: lang + GH + audio toggle
│  ├─ HeroStatic.tsx         # server: LCP composite PNG (always)
│  ├─ HeroCanvas.tsx         # client: dynamic-imported; mounts iff canRender3D
│  ├─ canvas/{ChawlScene,PixelPlane,LampLight,GodRays,DustParticles,PostFX}.tsx
│  ├─ PaydaySetPiece.tsx     # HTML overlay synced to scroll
│  ├─ BankBazaarBridge.tsx   # static painted bridge image
│  ├─ DistrictMap.tsx + DistrictCard.tsx   # 2D SVG, unchanged from v1
│  ├─ PillarsRail.tsx, PersonaTriptych.tsx, InspiredByRail.tsx
│  ├─ AntiPromiseBand.tsx, OpenSourceCard.tsx, FinalCTA.tsx, SiteFooter.tsx
├─ _lib/{capability,motion,scroll,audio}.ts
└─ _assets/hero/{composite,sky,silhouette,mid,foreground}.webp
                + audio/chawl-ambient.opus
```

**Contract:** `HeroStatic` always SSRs (LCP). `HeroCanvas` mounts client-side, cross-fades over the static image, and tears down on route-change to free GPU.

### 5.9 Migration path from v1 (2D SVG) → 2.5D R3F

| Keep | Replace | Add |
|---|---|---|
| All section IA from v1; copy and tone; persona/district/OSS cards (stay 2D); 480×270 source PNGs | CSS-parallax `<HeroDiorama />` → `HeroStatic` + `HeroCanvas`; `mousemove` rAF → R3F camera + `maath.damp3`; standalone `PaydayDemo` → fused into scroll set-piece; v1's Pixi puddle → displacement shader on a plane | Capability gate; dynamic R3F import; GSAP ScrollTrigger pin (~150 vh); Howler ambient + caption rail |

**Phased rollout** (each phase shippable, each rolls back via a `heroMode: 'static' | 'r3f' | 'scrubbed'` flag):

1. **Phase 0** — ship v1 (static SVG + drag demo). Done in `landing-page.md`.
2. **Phase 1** — add capability gate + `HeroCanvas` that re-textures the v1 diorama in R3F with bloom + cursor parallax. No scroll choreography. Test LCP on Moto G4.
3. **Phase 2** — pin hero, add GSAP + Lenis, fuse payday demo into scroll set-piece. Verify reduce-motion returns to Phase 0 byte-for-byte.
4. **Phase 3** — Bank Bazaar pan, ambient audio toggle, captions, night final CTA.

---

## Section 6 — The single biggest steal (revised)

If we steal only one thing from this round: **Lusion's "one timeline" discipline** — every scrubbed scroll event drives a single GSAP master timeline that updates the camera, the shader uniforms, *and* the HTML overlays in lockstep. Without that discipline, a 2.5D hero turns into three uncoordinated animations fighting each other. With it, Money-verse's first 150 vh of scroll feels like a *cutscene the player is performing* — which is exactly the metaphor of the game itself.

---

## Sources

- [Awwwards — Three.js collection](https://www.awwwards.com/websites/three-js/)
- [Awwwards — Games collection](https://www.awwwards.com/awwwards/collections/games/)
- [drei ScrollControls docs](http://drei.docs.pmnd.rs/controls/scroll-controls)
- [Codrops — Cinematic 3D Scroll with GSAP](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/)
- [Codrops — Layered Zoom Scroll with ScrollSmoother](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/)
- [Lenis smooth scroll](https://github.com/darkroomengineering/lenis)
- [Webflow makes GSAP 100% free](https://webflow.com/blog/gsap-becomes-free)
- [Three.js UnrealBloomPass docs](https://threejs.org/docs/pages/UnrealBloomPass.html)
- [R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [react-three-a11y](https://github.com/pmndrs/react-three-a11y)
- [howler.js + Chrome autoplay policy](https://github.com/goldfire/howler.js/issues/939)
- [Active Theory — Story of Hydra](https://medium.com/active-theory/the-story-of-technology-built-at-active-theory-5d17ae0e3fb4)
- [Pixi.js vs three.js (Slant)](https://www.slant.co/versus/1965/11348/~pixi-js_vs_three-js)
- [Sea of Stars dynamic-lighting pipeline](https://en.wikipedia.org/wiki/Sea_of_Stars)
- [Game Developer — Cult of the Lamb aesthetic](https://www.gamedeveloper.com/design/interview-corralling-the-inherent-cuteness-of-cult-of-the-lamb)
- [pmndrs/drei (GitHub)](https://github.com/pmndrs/drei)
- [R3F bundle-size reduction recipe](https://gracious-keller-98ef35.netlify.app/docs/recipes/reducing-bundle-size/)
- [Pope.tech — Accessible animation & reduced motion](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
