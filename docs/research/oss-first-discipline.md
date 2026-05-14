# OSS-First Discipline — Anti-NIH Audit for Money-verse

> Output of the `master` skill on the topic of *open-source-first / not-invented-here avoidance*. Applied as a concrete audit of the Money-verse repo, ~2 months into the build.

**Verdict in one line.** We've quietly drifted into NIH on the *art*, the *atmosphere shaders*, the *in-game UI primitives*, and the *capability-detection layer*. Three swaps, done in sequence, delete ~1,400 LoC of code-we-have-to-maintain and visibly raise the production value of the landing page and the first district.

---

## Section 1 — Masters

### 1. Dan McKinley — "Choose Boring Technology" (2015)
- **Philosophy:** Every team has a tiny budget of *innovation tokens*. Spend them on the part of your product that's actually novel; everywhere else, choose the boring tool.
- **Receipts:** Etsy principal engineer; the canonical essay cited in thousands of architecture decisions.
- **Signature moves:** Boring stack as baseline. Force written justification for any non-boring choice. Cap innovation budget per quarter.
- **Anti-patterns:** Replacing a working tool because something newer exists; adding a "Just-In-Case" middle layer; picking a tech because it's on HN.
- **Application:** Our innovation tokens belong on (a) Indian-finance simulation and (b) HD-2D-lite pixel pipelines. Custom diorama SVG, custom god-rays shader, custom store — these spend tokens for zero competitive advantage.
- **Source:** *Choose Boring Technology*, boringtechnology.club.

### 2. Poimandres / pmndrs — Small, composable libraries
- **Philosophy:** A collective whose output is *tiny libraries that compose* — R3F, drei, zustand, react-postprocessing, leva.
- **Receipts:** R3F is the de-facto Three.js binding for React; zustand >5M weekly DLs.
- **Signature moves:** One repo, one job; helpers belong in drei not r3f; vanilla store separated from React binding.
- **Anti-patterns:** Monolithic UI framework; hidden runtime magic; re-implementing math the engine already exposes.
- **Application:** `@react-three/postprocessing` is already installed but we hand-wrote god-rays + halo + flicker shaders in `HeroAtmosphere.tsx`. drei ships `<Stars/>`; postprocessing ships `<GodRays/>` + `<Bloom/>`.
- **Source:** docs.pmnd.rs ; npm `@react-three/postprocessing@3.0.4`.

### 3. DHH / 37signals — Convention over configuration, majestic monolith
- **Philosophy:** A framework should *guess right by default*; override only where you're genuinely different.
- **Receipts:** Rails powers GitHub, Shopify, Basecamp, Airbnb's first decade.
- **Signature moves:** Strong opinions; generators for the common case; adopt the framework's mental model before adding abstraction.
- **Anti-patterns:** Microservicing before PMF; wrapping the framework "for flexibility."
- **Application:** We declared shadcn + Radix in TECH_STACK §2.2. Stop hand-writing toolbars, language switchers, badges, cards when shadcn ships them.
- **Source:** rubyonrails.org/doctrine ; "The Majestic Monolith," m.signalvnoise.com.

### 4. Pieter Levels (@levelsio) — Boring stack, ship fast
- **Philosophy:** Boring tools you've mastered beat exciting tools you're learning. Remote OK was a single `index.php` at $65k+ MRR.
- **Receipts:** 12 profitable indie products solo; $250k+ MRR.
- **Signature moves:** Ruthless deletion; no premature abstractions; embed services (Stripe, Cloudflare); re-skin > rebuild.
- **Anti-patterns:** Refactoring before users; custom auth; custom dashboards.
- **Application:** Use Kenney CC0 tilesets for the first district. We already manifested them via `art-curator`. Don't procedurally generate a greybox nobody wants to see.
- **Source:** levels.io ; Lex Fridman Podcast #440.

### 5. Salvatore Sanfilippo (antirez) — Build only what genuinely doesn't exist
- **Philosophy:** When a generic container hides too much logic or fails your perf profile, write the slim replacement. *Otherwise, don't.* He hand-rolled SDS strings and Rax tree — but didn't rewrite the C stdlib.
- **Receipts:** Redis.
- **Signature moves:** Read the existing code first; rewrite the first draft once before merging; keep functions small.
- **Anti-patterns:** Rewriting "for the sake of clean code"; rewriting before feeling the pain.
- **Application:** `packages/finance-sim` is this pattern — no OSS handles Indian PPF/NPS/EPF/SIP-with-step-up + assist-mode hooks. Keep. The procedural greybox tileset is the **opposite** — a thing nobody needed to write.
- **Source:** antirez.com ; vinitkumar.me/code-like-antirez/.

### 6. Adam Wathan — Compose on top, don't build from scratch
- **Philosophy:** Tailwind isn't a CSS framework — it's a PostCSS plugin that abuses PostCSS to do something it wasn't designed for. Leverage came from composing on top of an existing boring tool.
- **Receipts:** Tailwind is today's most-used styling system in React.
- **Signature moves:** Layer on top of an OSS substrate; provide ergonomics, not infrastructure.
- **Anti-patterns:** Building a parallel CSS engine; reinventing the build pipeline.
- **Application:** Our HD-2D-lite pipelines should layer on top of Phaser's `PostFXPipeline` and rex-plugins' UI — not re-implement dialog boxes, progress bars, minimaps as raw `Phaser.GameObjects`.
- **Source:** adamwathan.me ; JS Party #155.

---

## Section 2 — Consensus Patterns

Across all six masters, six patterns repeat:

1. **Find the existing thing first.** Search npm/GitHub/awesome-lists *before* opening a new file. McKinley, Levels, DHH, Wathan all explicitly do this.
2. **Innovation tokens are scarce.** Spend them where you're genuinely different from everyone else. Everywhere else, adopt.
3. **Compose, don't replace.** Build *on top* of the substrate (Wathan/PostCSS, pmndrs/three.js, DHH/Rack). Don't fork it.
4. **Boring beats clever.** A 10-year-old library with predictable bugs beats a 6-month-old library with novel bugs.
5. **Only rewrite when the generic genuinely doesn't fit.** antirez wrote SDS *because* C strings cost him real µs; he didn't rewrite C strings to feel productive.
6. **Delete more than you add.** Levels and DHH both treat deletion as a positive metric.

---

## Section 3 — The Decision Framework

A single gate to apply *every time* Claude (or a human) is about to write new code:

```
Before writing X:
  1. Does a battle-tested OSS package do X?
     - Search: npm, GitHub topics, awesome-phaser, awesome-nextjs, awesome-react.
     - Verify: licence permissive, last release < 12 months, weekly DLs > ~5k,
       open issues responded to, API surface fits ours.
     → If yes: ADOPT. Stop.

  2. Does a managed external service do X better than we ever will?
     - Auth, email, payments, analytics, CDN, vector search.
     → If yes: USE THE SERVICE. Stop.

  3. Is X the actual stitching that *is* our value-add?
     - Indian-tax math, mastery-gating, NPC schedule, Maya scope-and-safety,
       bilingual content pipeline, HD-2D-lite shader stack.
     → If yes: WRITE IT. (We've earned the innovation token.)

  4. Is X a < 50-line utility we'd never depend on a library for?
     - e.g. `formatINR`, a custom Zod refinement.
     → If yes: WRITE IT inline. Do not publish.

  5. Otherwise: ADOPT-AND-CONFIGURE.
     If no package fits perfectly, pick the closest, wrap thinly, and only
     replace if the wrapper itself grows past ~200 LoC.
```

PR rule: a PR that adds new code *to do a generic thing* must include in its description the search log — what npm package was rejected, and why. No search log = block.

---

## Section 4 — NIH Audit Table

Walked every file under `apps/`, `packages/`, `assets/`. Below is every finding with a credible OSS alternative.

| # | File / Subsystem | LoC | What it does now | OSS alternative | Licence | Last release | Fit evidence | Effort | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `apps/web/app/(landing)/HeroAtmosphere.tsx` | 213 | Hand-written GLSL for god-rays + lamp halo + dust on top of R3F | `@react-three/postprocessing` `<GodRays/>`, `<Bloom/>`, `<Vignette/>`; `@react-three/drei` `<Stars/>`, `<Sparkles/>` | MIT | v3.0.4, active (pmndrs) | `<GodRays/>` takes a `sun` mesh + density/decay/weight — exactly what our shader emulates. Bloom + Vignette already imported. | Small | Negligible — same authors, same render path | **SWAP** |
| 2 | `apps/web/app/(landing)/HeroDiorama.tsx` | 593 | Hand-drawn SVG of stars, hills, two skylines, foreground props, chai stall, lamp halo | Kenney *Pixel City Builder* / *Pixel Platformer City* CC0 tilesets + a single `next/image` PNG; OR a layered Aseprite export | CC0 | Kenney updates monthly | We already commissioned the `art-curator` agent to manifest these. Loads as `<Image>` with 1/10th the DOM nodes; matches PRD pillar #6 ("authored, never procedural") far better than our procedural SVG | Medium | Need one designer pass; identity stays ours | **SWAP** |
| 3 | `apps/web/app/(landing)/PixelGlyph.tsx` | 184 | 10 hand-written pixel SVG glyphs for districts + NPCs | `@iconify/react` + `pixelarticons` (MIT, 800 icons) + `game-icons` (MIT, 3,768 icons) for NPC/district concepts | MIT | Iconify ships monthly | Iconify lazy-loads icons by name, fully tree-shakeable, no font. Pixelarticons has temple/bank/chart/shield/cart — direct matches for our seven districts | Small | Need to map our 10 names to icon IDs (1 hr) | **SWAP** |
| 4 | `apps/game/src/entities/greyboxTileset.ts` | 57 | Procedural pink/purple greybox tiles drawn into a Phaser texture for chawl-mohalla | Kenney `1-Bit Pack` / `Pixel Platformer Pack` / `Tiny Town` (CC0) — already in art-curator manifest | CC0 | Updated 2025 | The greybox is a placeholder for "real art" we said we'd source from Kenney *anyway*. We're shipping a placeholder that's worse than the real thing already on disk. | Small | None — straight asset swap | **SWAP** |
| 5 | `apps/game/src/lib/announce.ts` | 46 | DOM ARIA-live announcer for Phaser canvas | `@react-aria/live-announcer` (`announce(text, "polite"\|"assertive")`) | Apache-2.0 | Adobe-maintained, ships with every react-spectrum release | Identical API surface; their implementation handles iOS VoiceOver re-announce bug we don't yet handle | Small | We're in a Phaser scene (no React) — we'd import the vanilla `announce` function only (it's framework-agnostic) | **SWAP** |
| 6 | `apps/game/src/lib/assist.ts` | 81 | Custom subscribe/getCurrentValue store with localStorage + window CustomEvent | `zustand/vanilla` `createStore` + `subscribeWithSelector` + `persist` middleware (we already depend on zustand in `apps/web`) | MIT | v5, current | Zustand vanilla is exactly this: getState/setState/subscribe with persist. Same dep tree as web app | Small | Game app currently doesn't list zustand; one add. ~3kB gzipped | **SWAP** |
| 7 | `apps/web/lib/capability.ts` | 49 | hasWebGL2 / prefersReducedMotion / isFastNetwork / hasEnoughCores | Inline `navigator.connection.effectiveType` + `window.matchMedia` (these ARE the browser APIs). For React side, `usehooks-ts` `useMediaQuery` (MIT). | n/a (browser API) | — | The code already calls the browser API directly; we just wrap it. *Move to inline browser calls; delete the abstraction*. | Tiny | None | **KEEP-BUT-EXTRACT-PATTERN** (delete the wrapper, call APIs inline where used) |
| 8 | `apps/web/app/play/GameMount.tsx` `detectPerfTier` | 16 | Same as #7 — heuristics for tier high/med/low | Same as #7. Or `react-device-detect` (MIT, 1.6M weekly DLs) for mobile/UA | MIT | Active | Standard package | Tiny | None | **KEEP-BUT-EXTRACT-PATTERN** |
| 9 | `apps/game/src/scenes/PreloadScene.ts` (lines 12-18) | 7 | Custom progress bar drawn as a `rectangle` | `phaser3-rex-plugins` `ProgressBar` UI plugin (MIT, 10k weekly DLs, last release < 1 month) | MIT | v1.80.20, 2026 | Same scene-load `progress` event; rex's bar handles theming, label, animation | Tiny | Adds rex-plugins dep (worth it for #10 + #11 too) | **SWAP** as part of rex-plugins adoption |
| 10 | `apps/game/src/scenes/DialogScene.ts` (currently a stub) | 9 | Will become our dialog box renderer | `phaser3-rex-plugins` `Dialog` + `TextBox` + `TypeWriter` | MIT | 2026 | rex's `Dialog` already supports title/content/buttons/modal — exactly the API our quest engine needs to drive | Medium | We need to wire Yarn Spinner output into rex's `setActions` — straightforward | **SWAP — adopt before we write a single line of custom dialog rendering** |
| 11 | `apps/game/src/scenes/UIScene.ts` minimap + pill + interact-bar | 190 | Hand-drawn Phaser graphics for minimap; container+rectangle+text for the district pill and interact bar | `phaser3-rex-plugins` `MiniMap` (via `Board` plugin) + `Toast` for the district pill + `Label` for interact bar | MIT | 2026 | rex's `Toast` is purpose-built for our auto-dismiss pill; `Label` is the labelled container we're building manually | Medium | Adds ~80kB minified rex bundle (tree-shakeable; we'd import only what we use) | **SWAP** (high payoff because this file grows) |
| 12 | `apps/web/app/(landing)/UtilityBar.tsx` scroll-hide | 79 | Hand-rolled scrollY-direction listener to hide on down-scroll | `react-headroom` (MIT) OR `framer-motion` `useScroll` (already a possibility) OR keep — it's 12 lines | MIT | — | Stays under our 50-line rule; existing OSS packages bring more weight than they remove | Tiny | n/a | **KEEP** — it's the YAGNI/utility case |
| 13 | `apps/web/app/(landing)/PaydayDemo.tsx` | 239 | Three-bucket allocation reducer + presets | `react-hook-form` `useForm` + `Controller` (already a dep) — handles validation, dirty state, reset, accessibility-labels | MIT | v7.75 | Same shape; gives us `errors`, `isDirty` for the demo's "didn't allocate full salary" case | Small | None — already a dep | **SWAP** (modest gain) |
| 14 | `apps/web/app/(landing)/SiteFooter.tsx`, `OpenSourceCard.tsx`, `PersonaTriptych.tsx`, `PillarsRail.tsx`, `InspiredByRail.tsx`, `AntiPromiseBand.tsx`, `FinalCTA.tsx`, `HeroSection.tsx`, `DistrictMap.tsx` | ~590 | Hand-rolled marketing components | shadcn/ui `Card`, `Badge`, `Button`, `Separator`, `ScrollArea` primitives | MIT (copy-into-repo) | Active | We *explicitly chose* shadcn in TECH_STACK §2.2; today none of these files import a single shadcn primitive | Medium | Mostly find-and-replace; preserves our visual styling via Tailwind tokens | **SWAP** progressively, file by file |
| 15 | Pixel-font / bitmap font for Phaser HUD | (not yet) | We *plan* to write a Google-Font → Phaser bitmap pipeline | `phaser3-rex-plugins` `BitmapText` + `msdf-bmfont-xml` (MIT) pipeline | MIT | Active | Standard | n/a (not yet built) | None | **ADOPT BEFORE WRITING** |
| 16 | "Welcome / loading splash" scene we discussed | (not yet) | Discussed as a custom pixel-splash | `phaser3-rex-plugins` `Modal` + `TextEffects` + scene-transition | MIT | Active | rex covers fade/zoom/scanline transitions out-of-box | n/a | None | **ADOPT BEFORE WRITING** |

### What we should KEEP (genuine value-add)

| File / Subsystem | Why KEEP |
|---|---|
| `packages/finance-sim/*` | No OSS covers Indian tax + EPF/PPF/NPS/SIP-with-step-up. antirez's "no generic container fits." |
| `packages/content/*` (quest engine, Maya scope guard) | Yarn does dialog; mastery-gating + reward triggers + safety scope are ours. PRD #3, #10. |
| `apps/game/src/pipelines/PostFxStack.ts` (when populated) | TECH_STACK §1.1: no OSS bundles HD-2D-lite tilt-shift + bloom + depth-fog. |
| Master/per-district NPC schedule engine | PRD #6 "authored, never procedural." No OSS schedule engine integrates dialog/mastery state. |
| `entities/InteractZone.ts`, `Npc.ts`, `Player.ts` | Game-specific entities. Phaser doesn't ship these with our semantics. |

---

## Section 5 — Top 10 Swaps, Ranked

Score = (quality-gain × maintenance-LoC-removed) / effort.

| Rank | Swap | LoC removed | Quality gain | Effort | Score | Notes |
|---|---|---|---|---|---|---|
| 1 | **#2 HeroDiorama → Kenney CC0 + `next/image`** | ~593 | **High** — real pixel art beats hand-coded SVG; loads as image, faster INP | Medium | ★★★★★ | Single largest LoC delete; instant production-grade hero |
| 2 | **#1 HeroAtmosphere → `<GodRays/> + <Bloom/> + <Stars/>`** | ~150 (of 213) | **High** — proven pmndrs effects, better visuals, fewer rAF loops | Small | ★★★★★ | We already pay for the dep |
| 3 | **#10 + #11 Adopt `phaser3-rex-plugins`** for Dialog / Toast / MiniMap / ProgressBar | ~200 + prevents ~600 future LoC | **Very high** — every future dialog/UI scene rides on it | Medium | ★★★★★ | Single most leveraged adoption — touches every future district |
| 4 | **#3 PixelGlyph → `@iconify/react` + pixelarticons/game-icons** | ~184 | Medium | Small | ★★★★☆ | District + NPC glyphs become consistent |
| 5 | **#14 Marketing components → shadcn primitives** | ~300 (of ~590, file-by-file) | Medium — a11y, consistency | Medium | ★★★★☆ | We declared shadcn in TECH_STACK §2.2 but never used it |
| 6 | **#4 greyboxTileset → Kenney `1-Bit Pack` / `Tiny Town`** | ~57 + delivers real art | High | Small | ★★★★☆ | Removes a placeholder that hurts the demo |
| 7 | **#5 announce.ts → `@react-aria/live-announcer`** | ~46 | Medium — fixes iOS VoiceOver re-announce | Small | ★★★☆☆ | Pure win |
| 8 | **#6 assist.ts → `zustand/vanilla` + `persist`** | ~81 | Medium — battle-tested cross-tab sync | Small | ★★★☆☆ | Already a dep on web; add to game |
| 9 | **#13 PaydayDemo → `react-hook-form`** | ~50 (of 239) | Low-medium — better a11y, less reducer code | Small | ★★★☆☆ | Easy wins via existing dep |
| 10 | **#7+#8 capability.ts → inline browser APIs** | ~65 | Low | Tiny | ★★★☆☆ | Just deletes a thin wrapper |

**Total LoC deletable across top 10:** ~1,400 LoC of code we currently have to maintain, plus ~600 LoC of *future* code that we now don't have to write because rex-plugins handles dialog/toast/minimap.

---

## Section 6 — The Single Biggest Swap Tomorrow

> **Adopt `phaser3-rex-plugins` and Kenney CC0 art *together*, in one PR, before writing any more game UI or any more landing-page art.**

Why this one, first:

1. It blocks the next 5 files we were about to write (dialog scene, welcome splash, minimap polish, toast system, bitmap-font pipeline).
2. It deletes the procedural greybox *and* unblocks Bank Bazaar art.
3. It composes both halves of the drift — *art* (procedural greybox + hand-drawn diorama) and *game-UI* (custom dialog/toast/minimap) — into one coherent move.
4. Both deps verified: rex MIT, 10k weekly DLs, last release 2026; Kenney CC0.
5. It buys back innovation tokens for the post-FX pipeline and `finance-sim`.

PR description should cite McKinley (innovation tokens), antirez (rewrite only when generic fails), pmndrs (compose on substrate).

---

## Master's Margin Note

Masters studied: McKinley, pmndrs, DHH, Levels, antirez, Wathan.
Patterns applied: innovation-token budget; compose-don't-replace; boring-stack baseline; rewrite-only-when-truly-different; delete-as-positive-metric.
Where we deviated: We're keeping `finance-sim`, the post-FX pipeline, the quest/Maya/NPC-schedule engines — antirez-justified, not NIH.
Recommended deep-dives: *Choose Boring Technology* (mcfunley.com/choose-boring-technology); *The Rails Doctrine* (rubyonrails.org/doctrine); rex-plugins UI overview (rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/).
