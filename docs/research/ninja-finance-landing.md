# Ninja-Finance Landing Page — Masters Research Brief

> Generated via the **master** skill. Grounds the Ninja-Finance landing rebuild in
> documented practice from 5 proven masters across premium web design, game marketing,
> and Gen-Z financial product UX. Every citation traces to a shipped, public source.
>
> Extends `docs/MASTERS_RESEARCH.md` (game/edu design) — does NOT duplicate it.
> Focus here is exclusively on the **landing page** and **marketing site** layer.

---

## 1. Search Frame

| Dimension | Value |
|---|---|
| Field | Premium interactive landing page design — game marketing + fintech + Gen-Z consumer |
| Goal | A scroll-driven, dark-mode-first landing that converts 12-26 year-olds globally, communicates the RPG + financial-literacy concept in under 60 s, and feels "2036-level" without tricks |
| Stack | Next.js 16 App Router, Tailwind 4, motion (framer-motion successor), GSAP + ScrollTrigger, lenis, three.js + @react-three/fiber + drei + postprocessing |
| Success metric | Dwell on hero > 30 s; scroll depth > 70%; external "open-source" trust signal clicked; zero confetti, dark-pattern, or crypto-scam visual cues |
| Master profile | People who shipped landing pages that are simultaneously visually extraordinary AND legible — not just award bait |

---

## 2. Master Roster

### MASTER 1: Rauno Freiberg — Interaction Detail Doctrine
**Credential.** Staff Design Engineer at Vercel; previously designed Arc browser at The Browser Company. Author of "Devouring Details" (20-chapter interactive reference) and "Invisible Details of Interaction Design" (published in Every.to, 2023, widely cited).
**Why selected.** Freiberg is the practitioner most precisely focused on the gap between an animation that looks right and one that *feels* right — the micro-physics layer that makes Linear, Vercel, and Arc feel premium without being showy. That gap is exactly our problem.

**Philosophy.** "Quality is not a result of scale or resources but a function of patience and focus." UI should respond to human intent with the physics of real objects — momentum preserved, gestures interruptible, animations staggered with Disney Follow-Through, never blocking.

**Signature methods.**
- *Kinetic physics*: preserve momentum and angle of gestures; let things decelerate naturally, not snap.
- *Interruptibility*: every animation must be reversible mid-gesture; users must never feel trapped.
- *Frequency-aware motion*: high-frequency interactions (nav, search) — no animation; low-frequency moments (hero entrance, page transitions) — purposeful choreography.
- *Spatial consistency*: animations communicate where content originates spatially, not just that it moved.
- *Disney Follow-Through*: stagger related elements; "things don't come to a stop all at once." Applied to hero copy reveals, CTA pulses, section transitions.
- *Fitts's Law targets*: never require interaction with invisible elements; enlarge click targets near edges.

**Anti-patterns.** Animations that run at the same cadence every time (novelty fatigue); locking users behind a progress animation; animating purely for demo-reel style.

**Application to Ninja-Finance.** Hero section: staggered copy reveal with follow-through — headline in, then subhead at 80 ms delay, then CTA at 160 ms. CTA button uses magnetic hover (slight translation toward cursor) not confetti. Page transitions: spatial — the game section slides in from the direction of its icon in the nav, preserving cognitive map.

**Key sources.**
- [Invisible Details of Interaction Design — Every.to](https://every.to/p/invisible-details-of-interaction-design)
- [Devouring Details — devouringdetails.com](https://devouringdetails.com/)
- [ui.land interview](https://ui.land/interviews/rauno-freiberg)

---

### MASTER 2: Emil Kowalski — Animation as Emotional Communication
**Credential.** Design engineer at Linear; previously at Vercel. Creator of *Animations on the Web* course (animations.dev), author of "Great Animations" and "7 Practical Animation Tips." Linear's UI is globally cited as the reference for premium dark-mode SaaS design.

**Why selected.** Kowalski makes the argument that animation communicates *emotion*, not just hierarchy — and documents it with 43 actionable rules. His work on Linear.app represents the exact aesthetic register we need: dark, fast, crisp, human.

**Philosophy.** "Nothing in the world around us disappears or appears instantly." Natural motion makes change legible. Animation's job is to communicate state, not impress. Fast animations improve *perceived* performance.

**Signature methods.**
- *Custom easings over defaults*: spring animations for UI elements (feel alive), ease-out for entrances (objects arriving), ease-in for exits (objects leaving), linear only for progress.
- *Clip-path reveals*: content revealed by a moving clip boundary, not a fade — directional, spatial, elegant.
- *Orchestration*: animate a composition, not individual elements — hero copy, image, and CTA are one choreographed phrase.
- *Semantic animation*: the direction of an animation encodes meaning. Pushing right = forward; sliding down = revealing detail.
- *Accessibility-aware*: honor `prefers-reduced-motion` — fade-only fallback for all clip-path and spring animations.

**Anti-patterns.** Using `ease-in-out` for everything (limp, reads as uncertain). Bouncy springs on destructive or serious actions (wrong register). Animating too many elements simultaneously (visual chaos). Keyframe loops on hero backgrounds (attention-draining).

**Application to Ninja-Finance.** Section entrances: clip-path wipe from bottom-left. Mechanic demo: spring-physics card flip revealing the in-game UI screenshot. Open-source badge: semantic entrance — slides in from the "community" direction (left). All springs: `stiffness 200, damping 20` as baseline (Kowalski's recommended "snappy but not bouncy" starting point).

**Key sources.**
- [Great Animations — emilkowal.ski](https://emilkowal.ski/ui/great-animations)
- [animations.dev course](https://animations.dev/)
- [7 Practical Animation Tips — emilkowal.ski](https://emilkowal.ski/)

---

### MASTER 3: Active Theory — Immersive 3D Scroll Storytelling
**Credential.** LA-based creative studio founded 2012. Multiple Webby Awards, Communication Arts Interactive Awards. Built immersive WebGL experiences for Google Creative Lab, PlayStation, and major game launches. Their portfolio V5/V6 site is a canonical reference for scroll-driven 3D environments on the web. Awwwards recognition (SOTD).

**Why selected.** Active Theory is the practitioner proof that a production landing page — not a portfolio stunt — can be fully 3D + scroll-driven AND load fast enough for a general audience. Their game-launch work is directly analogous to our context.

**Philosophy.** "Performance and beauty must coexist." Immersive 3D storytelling where the scroll *is* the narrative — not click-to-advance or autoplay video. The environment teaches the product.

**Signature methods.**
- *Scroll-as-camera*: locking the camera path to scroll position so the user flies through a 3D scene as they scroll — the scroll becomes plot.
- *State-based functional architecture*: scenes are pure-function outputs of scroll state, enabling modular builds and clean handoff between sections.
- *WebGL + custom framework*: they built Hydra (proprietary), but the pattern — decouple render loop from UI framework, sync via requestAnimationFrame — is replicable in r3f.
- *Restrained hero entry*: the 3D moment arrives after a brief 2D text beat, not immediately — ensures copy reads first.
- *Sound as navigation signal*: subtle ambient audio shifts as scroll position changes district.

**Anti-patterns.** Loading a full 3D scene before the hero text is legible (conversion killer). GPU-heavy shaders without LOD or fallback. Auto-rotating hero objects with no user agency (feels like a screensaver, not a product).

**Application to Ninja-Finance.** Hero: 2D text beat (headline + CTA) appears at 0 scroll, fully above-fold. At scroll ~15%, a 3D character model (game character in pixel-art style, rendered as an r3f canvas overlay) rises from the bottom of the hero. Mechanic demo section: scroll-locked camera sweeps through a stylized 3D version of the game's first district. Performance gate: use `Suspense` + compressed DRACO model (<150 KB), fallback to a static PNG on low-end devices.

**Key sources.**
- [Active Theory — activetheory.net](https://activetheory.net/)
- [Communication Arts feature](https://www.commarts.com/features/active-theory)
- [Awwwards profile](https://www.awwwards.com/locomotive/)

---

### MASTER 4: Supergiant Games (Greg Kasavin + Amir Rao) — Game Marketing as World-Entry
**Credential.** Indie studio, ~20 people. Hades: >1 M copies in Early Access before 1.0; Game Awards 2020 Best Independent Game + Best Action Game. Hades II: record Early Access launch 2024. Every Supergiant title ships with a dedicated landing page that functions as a world entry point, not a feature list.

**Why selected.** Supergiant's landing pages are the best-in-class reference for *a game that teaches something* marketing without explaining itself. The Hades page communicates tone, stakes, and character in under 10 seconds of dwell — through art, not copy. This is the game-marketing antidote to the "feature bullet list" trap.

**Philosophy.** "The game is the design document." Marketing is world-building, not product sheet. Being "okay with players being a bit uncomfortable in what they don't know, as long as they're engaged" — designed ambiguity over over-explanation.

**Signature methods.**
- *Full-bleed atmospheric key art* as hero — no UI chrome, no bullet points in the hero. The world IS the pitch.
- *Character-first* framing: a face (or figure) in the hero, not a UI screenshot or abstract shape. Emotional access before conceptual access.
- *Slow-reveal copy*: headline is at most 5 words. No subtitle paragraph above the fold.
- *Iterative launch*: they released the landing page alongside a "pilot episode" Early Access, evolving the page with each major update — the page itself had narrative momentum.
- *Trailers embedded, not auto-playing* — the player chooses to enter the world.

**Anti-patterns.** Feature-list hero ("5 reasons to play"). Review-score logos dominating above the fold (trust signals are earned after emotional investment, not before). Auto-play trailer with sound. Countdown timers.

**Application to Ninja-Finance.** Hero copy: max 8 words headline, no bullet list. Full-bleed character illustration (pixel-art style, dark atmospheric background). A single trailer thumbnail with a play button — no autoplay. The value proposition (financial literacy RPG, free, open-source) surfaces *on scroll*, not at load. Analogy: if the hero is a movie poster, Section 2 is the movie trailer.

**Key sources.**
- [Supergiant Games — supergiantgames.com](https://www.supergiantgames.com/games/hades/)
- [GDC Podcast Ep. 16 — Greg Kasavin on narrative design](https://gdconf.com/article/roguelikes-and-narrative-design-with-hades-creative-director-greg-kasavin-gdc-podcast-ep-16/)
- [From Bastion to Hades: How Supergiant Became Masters of Indiedev — gamedevpills.com](https://www.gamedevpills.com/p/from-bastion-to-hades-how-supergiant)

---

### MASTER 5: Greenlight / Step + Cash App Brand (BUCK Studio) — Gen-Z Fintech Trust Design
**Credential.** Greenlight: 6 M+ family users (2025); pioneer of teen fintech category. Step: partnered with TikTok star Charli D'Amelio at peak Gen-Z influence (2021). Cash App brand redesign executed by BUCK Studio — won Awwwards SOTD; documented as a case study in Gen-Z financial visual identity. BUCK's work on the Cash App Evergreen Design System is publicly documented.

**Why selected.** This cluster defines what Gen-Z financial product trust looks like visually — and, crucially, what distinguishes a trustworthy free product from a casino-skinned dark-pattern product (Robinhood). They are not all identical; Cash App is bolder/weirder, Greenlight is warmer/parental, Step is celebrity-aspirational. The synthesis tells us exactly where Ninja-Finance should sit.

**Philosophy (synthesized).**
- Cash App / BUCK: "exist in the space between the weird and the wonderful" — irreverence signals anti-banker.
- Greenlight: dual-appeal design — parents see control, teens see independence. Neither feature is hidden.
- Step: status through association — the product adopts the aesthetic of aspirational culture (not banking culture).

**Signature methods.**
- *Bold, flat color* on a dark or vivid background — avoids both Wall Street grey and crypto neon.
- *Character / mascot presence*: Cash App's brand portal uses 3D floating icons with "bold confidence + playful levity" motion. Greenlight uses approachable illustration. Neither is cold.
- *Parent + teen dual-language landing*: two clear audiences addressed in sequence, not simultaneously (avoids mixed-signal paralysis).
- *Subscription / free framing is explicit and prominent*: Greenlight's trust depends on users understanding the subscription model (no hidden fees). Our free-forever claim must be equally prominent.
- *Social proof via peer culture*, not institutional logos. Step used Charli D'Amelio, not a bank logo.

**Anti-patterns (Robinhood as formal anti-master).** Documented by deceptive.design and fined $70 M by FINRA: confetti on trades; "biggest movers" push notifications; lottery-style surprise rewards; curated popular-stocks lists engineered for engagement not education. These patterns are the exact visual DNA we must visually distinguish ourselves from. If our landing shares the color palette, motion register, or iconography of Robinhood, we lose the trust signal immediately.

**Application to Ninja-Finance.** Free-forever badge in the navigation — not buried in footer. Open-source badge (GitHub stars + license) in the first fold after the hero. Anti-promise section (explicit "no dark patterns" list) placed *before* the CTA — modeled on Greenlight's transparency about the parent/child permission model. Color palette: dark slate + single warm accent (not green-on-black, not electric blue — both too crypto/Robinhood-adjacent).

**Key sources.**
- [Cash App Evergreen Design System — BUCK](https://buck.co/work/cash-app-visual-identity)
- [Cash App Brand Guidelines — Awwwards SOTD](https://www.awwwards.com/sites/cash-app-brand-guidelines)
- [How Greenlight and Step Are Marketing Financial Apps for Kids — medialogic.com](https://www.medialogic.com/blog/financial-services-marketing/marketing-financial-apps-for-kids/)
- [Deceptive Patterns: Robinhood — deceptive.design](https://www.deceptive.design/brands/robinhood)
- [Greenlight-ing the Future of Family-focused Fintech — onestepahead.so](https://www.onestepahead.so/p/greenlight-ing-the-future-of-family)

---

### ANTI-MASTER: 2018-Era Crypto Landing Pages + Generic Linear Clones
**Why named.** These are the two aesthetic failure modes closest to our stack and context. The crypto aesthetic is already strongly associated with speculative fraud in 2025; the Linear clone aesthetic signals "yet another SaaS" and actively undercuts the game/character brand.

**Crypto landing anti-patterns.**
- Neon on black (specifically electric blue + dark purple).
- Particle systems that serve no narrative purpose — purely decorative GPU tax.
- Countdown timers suggesting artificial scarcity.
- "Whitepaper" or "roadmap" section replacing genuine product demonstration.
- Testimonials from avatars, not real people.

**Linear-clone SaaS anti-patterns.**
- Dark gradient hero with floating UI screenshots of a dashboard.
- "Built for developers" copy when the actual audience is teens.
- Gradient text on every heading.
- Featuritis: five sections each listing eight bullet points.
- No character, no world, no emotion — just functional promise.

**Sources.**
- [The Linear Effect — rectangle.substack.com](https://rectangle.substack.com/p/the-linear-effect)
- [Linear Design: The SaaS Design Trend That's Boring and Bettering UI — logrocket.com](https://blog.logrocket.com/ux-design/linear-design/)
- [Awwwards SOTD: Igloo Inc — abeto's Three.js + GSAP SOTY 2024](https://www.awwwards.com/sites/igloo-inc)

---

## 3. Consensus Patterns

Where 3+ masters converge — non-negotiable for the landing:

1. **Character before concept.** Rauno (human-grounded interaction), Supergiant (face in hero), Cash App (character presence) — all prioritize emotional access via a *person or figure*, not an abstract diagram or UI screenshot.

2. **Dark-mode-first, but warm.** Linear/Emil (dark slate + Inter), Supergiant (atmospheric dark art), Cash App (dark + bold accent) — the premium signal is dark-mode discipline, not darkness for its own sake. Warmth (amber, coral, warm white) prevents the crypto-cold register.

3. **Scroll is the story.** Active Theory (scroll-as-camera), GSAP scroll examples (pinned sections), Lenis+GSAP stack — the page is not a brochure that happens to scroll; the scroll *produces* understanding. Each scroll beat should advance comprehension by one step.

4. **Copy discipline: less is more, above the fold.** Supergiant (5-word headline), Rauno (never force users to read before interacting), Emil (typography is a design element, not an essay) — the hero carries at most headline + subline + one CTA. All explanation goes below.

5. **Free / open-source is a trust *asset*, not a disclaimer.** Greenlight (subscription transparency), Khan Academy pattern (free is the brand), Duolingo (freemium built the funnel) — "free forever, open source" is the most powerful competitive differentiator against Duolingo's premium tier and every fintech with a fee. Treat it as a headline-level claim, not footnote.

6. **Micro-motion signals care; macro-motion signals world.** Rauno + Emil (micro: hover states, follow-through, spatial transitions) vs. Active Theory (macro: scroll-camera, section choreography) — both layers are required. Micro without macro is a polished brochure. Macro without micro is a flashy demo that doesn't convert.

7. **Anti-promise beats pro-promise for this audience.** Gen-Z skepticism (documented in Greenlight and Step research) means "here's what we will NOT do" converts better than feature lists. Explicitly naming the dark patterns we reject (no confetti, no FOMO notifications, no leaderboards on speculative gains) is the single highest-signal trust move.

---

## 4. Divergence Points + Recommendations

| Question | Option A | Option B | Our recommendation |
|---|---|---|---|
| Hero: image or 3D? | Supergiant: static 2D key art — immediate, no GPU risk, cinematic | Active Theory: 3D from frame 0 — immersive, high WOW | **Hybrid.** 2D key art renders at load (zero GPU wait). 3D character emerges on first scroll past hero — user-controlled, not autoplay. |
| Motion register | Emil: spring-first, snappy — modern SaaS feel | Active Theory: cinematic, slower — game-world feel | **Context-dependent.** UI elements (buttons, nav, badges) use Emil spring register. World/narrative sections (mechanic demo, district tour) use Active Theory cinematic timing (1.2-1.8 s eases). |
| Copy length per section | Supergiant: minimal — 5-8 words headline, no body | Greenlight: explains dual audience explicitly | **Supergiant above fold; Greenlight below.** Hero: 8 words max. "Why it's different" section: two short paragraphs, each addressing one audience (teen / parent or student / educator). |
| Trust signals: when? | Conventional SaaS: above fold (review stars, logos) | Supergiant / storytelling: emotional investment first, then proof | **Supergiant sequencing.** Proof arrives in Section 3 (after emotional investment). Exception: "free forever" + open-source badge stays in nav bar — non-intrusive, always visible, answers the most immediate skepticism silently. |
| 3D model complexity | High-polygon game character for realism | Low-poly / stylized to match pixel-art identity | **Low-poly stylized.** Must match the game's HD-2D pixel aesthetic. A high-polygon realistic model would create an identity mismatch. Use drei's `<PixelatedPass>` or a custom post-processing pass to maintain pixel-art feel in the 3D moment. |
| Smooth scroll library | Lenis (lightweight, Darkroom Engineering, native r3f integration) | GSAP ScrollSmoother (requires GSAP Club) | **Lenis + GSAP ScrollTrigger.** Lenis is MIT, 3 KB, and syncs cleanly with GSAP ticker. ScrollTrigger handles the animation triggers. No proprietary dependency. |

---

## 5. Motion + Scroll Patterns Catalogue

### Hero Choreography (Phase 0 — at load)
- Canvas background: a subtle noise-shader dark field, 24 fps capped to save GPU. NOT a particle system.
- Headline: clip-path reveal from bottom, duration 600 ms, easing `cubic-bezier(0.16, 1, 0.3, 1)` (Emil's recommended entrance ease).
- Subline: 80 ms delay, same reveal.
- CTA button: 160 ms delay, scale from 0.96 + opacity. Button has magnetic hover (cursor proximity drives slight translate toward cursor, max 8px).
- All above: `prefers-reduced-motion` fallback = fade only, 300 ms.

### Scroll Phase 1 — 3D Character Emergence (~15% scroll)
- Lenis drives a normalized scroll progress value (0–1).
- Three.js / r3f canvas positioned absolutely, overlapping lower half of hero.
- Character model: translate Y from +200px to 0 as scroll 0%→20%, easing smooth spring.
- Pixel post-processing pass active from frame 0 — never shows as a hi-fi model.
- `Suspense` fallback: static PNG of same character.

### Scroll Phase 2 — Section Entrances (ScrollTrigger, `start: "top 80%"`)
- Pattern: clip-path `inset(100% 0 0 0)` → `inset(0% 0 0 0)`, 700 ms, staggered per element.
- Images: parallax offset `y: ±30px` across section height (subtle depth).
- Section backgrounds: no parallax — only foreground elements move. Prevents nausea.

### Scroll Phase 3 — Mechanic Demo (Pinned Section, ~40-60% total scroll)
- GSAP `pin: true` on the mechanic demo section.
- As user scrolls within the pinned section: a mock game UI slides in from right, simulating a 15-second gameplay moment (CSS animation, no actual Phaser embed).
- Three.js environment: a stylized 3D isometric view of the game's first district, camera panning slowly left. Camera movement driven by scroll progress, not auto-animation.
- Text callouts: enter on specific scroll beats with clip-path reveals.

### Scroll Phase 4 — CTA / Open-Source Section
- Terminal-style animated text that types out: `free. forever. open source.` — capped at 40 chars, no scrolling wall of text.
- GitHub star count fetched server-side (Next.js `cache: 'force-cache'`), displayed with a subtle count-up animation on scroll enter.
- Final CTA: large, centered, magnetic. No countdown. No "limited time." No confetti on click — a smooth page transition (spatial: game section pushes in from bottom).

### Cursor Interactions
- Custom cursor: small 12px circle, transforms to a larger ring (32px) on hoverable elements. No particle trail (too much GPU + reads as crypto-age design).
- Magnetic pull: buttons with `data-magnetic` attribute attract cursor within 60px radius, max 8px displacement. Emil's rule: reserve for primary CTAs only, not navigation.

### Page Transitions
- Spatial transitions: navigating to a sub-page (e.g., /play) — the current page slides up, the next slides in from below. Communicates "going deeper."
- Duration: 400 ms. Must complete before next page renders — no half-loaded states.

---

## 6. Section-by-Section Meta-Framework

The playbook for each landing section, with the master pattern to apply.

### Section 0: Navigation Bar
**Pattern:** Rauno (Vercel nav discipline) + Greenlight (free-forever prominence).
- Logo left, nav links center (sparse: Play / How It Works / Open Source / Blog), CTA button right.
- "Free forever" badge in the nav bar — small, pill-shaped, never dismissible. Answers the #1 Gen-Z skepticism before they even read the hero.
- Nav fades in at scroll > 100px; transparent at top (preserves hero atmosphere).
- No hamburger on desktop. Mobile: a clean bottom sheet, not a full-page overlay.

### Section 1: Hero
**Pattern:** Supergiant (atmosphere-first, character-first) + Rauno (staggered choreography).
- Full-bleed dark atmospheric background (noise shader, not gradient).
- Pixel-art character illustration (or low-poly r3f canvas model) as the visual anchor — not a UI screenshot.
- Headline: ≤8 words. Example register: "The RPG that teaches real money skills."
- Subline: ≤18 words. One sentence. No list.
- Primary CTA: "Play Free" — links to /play or game embed.
- Secondary: "Watch trailer" (thumbnail, not autoplay).
- No review stars. No "as seen in" logos. No countdown.

### Section 2: Proof (Social Proof + Credibility)
**Pattern:** Emil (semantic entrances, spatial reveal) + Greenlight (peer-culture over institutional).
- Arrives after emotional investment from hero — on scroll.
- Player count or waitlist number (if available).
- 3-4 short testimonials from real teen/young-adult players — not experts.
- Open-source GitHub badge: stars + last commit + license. This is the institutional trust signal, but positioned as community proof, not corporate proof.
- Animation: clip-path grid reveal, cards entering one by one with Emil spring stagger.

### Section 3: Mechanic Demo
**Pattern:** Active Theory (scroll-is-camera, pinned cinematic section).
- Headline: "Here's how it actually works." (plain, direct — Gen-Z distrust of marketing speak)
- Pinned scroll section: mock game UI + 3D district environment.
- Three scroll beats inside: (1) open the game world, (2) take a quest, (3) learn + earn.
- No tutorial text overlay. The animation *is* the explanation. One callout per beat, max 6 words.
- On mobile: fallback to a 3-frame animated WebP sequence (no 3D — performance constraint).

### Section 4: Persona / Audience Fit
**Pattern:** Greenlight (dual-audience explicit sequencing) + Supergiant (character-driven).
- Two short columns: "For the student" / "For the curious" (or "For the curious teen / For the educator").
- Each column: a character illustration (from the game) + 3 bullet points, max 8 words each.
- NOT "Perfect for ages 12-26" — never describe your audience to themselves.
- Animation: two columns enter from opposite sides (left/right clip-path), meeting at center on scroll.

### Section 5: Why It's Different (Anti-Promise)
**Pattern:** Robinhood anti-master + Greenlight transparency doctrine.
- Headline: "What we'll never do." (or "No tricks. Just money skills.")
- A clean list of anti-promises with icons: no confetti, no FOMO notifications, no leaderboards on gains, no paywalled lessons, no dark patterns. Each item 5-7 words.
- Below the list: a single sentence restating the positive: "We celebrate consistency, not speculation."
- Animation: list items enter with a sequential clip-path wipe, left-aligned. Deliberate pacing — each item has weight.
- This section is the most important trust signal for financially literate parents reviewing the product.

### Section 6: Open-Source / Community
**Pattern:** Rauno (craft as transparency) + Greenlight (free-forever as brand) + Duolingo (community as social proof).
- Headline: "Free forever. Open to all." (or "Built in public.")
- GitHub repository card: stars, forks, license (MIT or AGPL), contributors.
- Short paragraph: what open-source means for the player (no paywalls, no disappearing, auditable).
- Contribution CTA: "Join the build" — secondary, not competing with the primary CTA.
- Terminal animation: types `git clone ninja-finance` — light, on-brand for dev community.
- Animation: Rauno spatial reveal — the section enters from the "open" direction (left, as if the source is open to view).

### Section 7: Final CTA
**Pattern:** Emil (magnetic CTA, spring physics) + Rauno (interruptible, never trapping).
- Dark-to-slightly-less-dark gradient section (avoids the "white CTA section" generic SaaS pattern).
- Single large button: "Start Playing Free" — full-width on mobile, centered wide on desktop.
- No form field. No email capture at this stage (friction killer for Gen-Z). Email can be requested *inside* the game or on the /play page.
- Beneath button: "No account needed to start. Sign up in-game." (removes the last anxiety)
- Button hover: Emil spring scale (1 → 1.04) + magnetic pull. Click: spatial page transition to /play.

### Section 8: Footer
**Pattern:** Rauno (detail discipline — footers reveal brand care) + Greenlight (trust elements).
- Minimal: Logo, nav links, GitHub link, Privacy, Terms.
- FOSS license statement (one line).
- No social media link wall — pick one (GitHub). Gen-Z reads social link walls as desperation.
- No cookie consent banner if avoidable (EU compliance: use a minimal solution; never a modal that blocks the page).
- Footer animation: none — the footer is where the page rests; motion here reads as chasing.

---

## 7. Anti-Patterns Specific to This Landing

These would make us look like a 2018 crypto project or a generic Linear-clone SaaS — either kills conversion with our audience:

1. Electric blue on black. Full stop. (Crypto-scam color memory is strong in 2025.)
2. Auto-play background video (GPU, bandwidth, accessibility — all bad).
3. Particle systems as decoration (visual noise, 2018 Web3 aesthetic, GPU cost).
4. Floating "Get Started" button that follows the user while scrolling (dark pattern: manufactured urgency).
5. Countdown timer or waitlist scarcity ("Only 500 beta spots!").
6. "As Seen In" logo strip above the fold (trust before investment is backwards for this audience).
7. Feature-grid section listing 8+ bullet points (reads as corporate SaaS, not game).
8. Dark gradient text on dark background (brand logo accessibility failure — seen on dozens of Linear clones).
9. Confetti or emoji rain on any interaction, including the primary CTA click.
10. A talking head video testimonial from an adult in a suit (wrong persona for Gen-Z).
11. Any use of the words "Invest," "Returns," "Gains," or "Portfolio" in the hero or nav — these trigger adult-finance anxiety in the 12-18 bracket. Use "money skills," "real decisions," "your money story."

---

## 8. Technical Constraints Grounded in Research

| Concern | Grounding | Solution |
|---|---|---|
| 3D on low-end devices | Active Theory: always ship a 2D fallback | `useDetectGPU` (drei utility); fallback to `<img>` + CSS parallax |
| LCP on hero | Emil: fast animations improve perceived performance | Hero image/canvas preloaded; 3D scene loads after hero LCP |
| `prefers-reduced-motion` | Emil: 43 rules include accessibility | All spring/clip-path animations have `fade-only` fallback |
| Lenis + SSR | Next.js 16 App Router server components | Lenis initialized only in a `"use client"` wrapper after hydration |
| GSAP ScrollTrigger + Lenis sync | GSAP community docs | `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(lenis.raf)` |
| r3f canvas vs page scroll | drei `<ScrollControls>` or manual scroll sync | Use Lenis normalized scroll value passed as a uniform to r3f; avoids double-scroll conflicts |

---

## Master's Margin Note

**Masters studied:** Rauno Freiberg (interaction detail), Emil Kowalski (animation as communication), Active Theory (3D scroll storytelling), Supergiant Games / Greg Kasavin (game marketing atmosphere), Greenlight + Cash App / BUCK (Gen-Z fintech trust design). Anti-masters: Robinhood (dark-pattern fintech) + 2018 crypto landing / Linear-clone SaaS aesthetics.

**Top 3 consensus patterns applied:**
1. Character-first hero — face/figure over UI screenshot. Emotional access before conceptual access.
2. Scroll-driven narrative — every scroll beat advances comprehension by exactly one step; nothing decorative.
3. Anti-promise section — explicitly naming the dark patterns we reject is the highest-signal trust move for this audience.

**Where we deviate from the masters:**
- We use Lenis + GSAP + r3f in combination — no single master uses this exact stack. The stack is grounded in Active Theory's pattern (WebGL + custom scroll sync) translated to OSS tools.
- Supergiant would not include an "anti-promise" section (they sell via atmosphere alone). We add it because, unlike Hades, we are selling a *financial product* — the trust bar is higher and the skepticism about dark patterns is specific and real.
- Cash App's irreverence level is higher than ours. We borrow their "weird + wonderful" vocabulary without their avant-garde art direction — our brand anchor is the game world, not the brand world.

**Recommended deep-dives before build:**
- [Invisible Details of Interaction Design — Rauno Freiberg, Every.to](https://every.to/p/invisible-details-of-interaction-design) — read in full before writing any animation code.
- [Great Animations — Emil Kowalski](https://emilkowal.ski/ui/great-animations) — the 43-rule checklist; audit every section against it post-build.
- [Igloo Inc case study — Awwwards SOTY 2024](https://www.awwwards.com/igloo-inc-case-study.html) — Three.js + GSAP + Svelte; the technical pattern is directly portable to our r3f stack.
- Active Theory portfolio V6 — [activetheory.net](https://activetheory.net/) — study the scroll-as-camera mechanic in the mechanic demo section reference.

---

## Sources

- [Rauno Freiberg — ui.land interview](https://ui.land/interviews/rauno-freiberg)
- [Invisible Details of Interaction Design — Every.to](https://every.to/p/invisible-details-of-interaction-design)
- [Devouring Details — devouringdetails.com](https://devouringdetails.com/)
- [Rauno Freiberg — Spaces/Lovers Magazine interview](https://spaces.is/loversmagazine/interviews/rauno-freiberg)
- [Emil Kowalski — emilkowal.ski](https://emilkowal.ski/)
- [Great Animations — Emil Kowalski](https://emilkowal.ski/ui/great-animations)
- [Animations on the Web — animations.dev](https://animations.dev/)
- [Active Theory — activetheory.net](https://activetheory.net/)
- [Active Theory — Communication Arts feature](https://www.commarts.com/features/active-theory)
- [Active Theory — Awwwards](https://www.awwwards.com/locomotive/)
- [Supergiant Games — Hades](https://www.supergiantgames.com/games/hades/)
- [Greg Kasavin — GDC Podcast Ep. 16](https://gdconf.com/article/roguelikes-and-narrative-design-with-hades-creative-director-greg-kasavin-gdc-podcast-ep-16/)
- [From Bastion to Hades — gamedevpills.com](https://www.gamedevpills.com/p/from-bastion-to-hades-how-supergiant)
- [Cash App Evergreen Design System — BUCK](https://buck.co/work/cash-app-visual-identity)
- [Cash App Brand Guidelines — Awwwards SOTD](https://www.awwwards.com/sites/cash-app-brand-guidelines)
- [Cash App brand guidelines — Creative Bloq](https://www.creativebloq.com/design/branding/cash-apps-new-brand-guidelines-make-style-guides-fun)
- [How Greenlight and Step Are Marketing Financial Apps for Kids — medialogic.com](https://www.medialogic.com/blog/financial-services-marketing/marketing-financial-apps-for-kids/)
- [Greenlight-ing the Future of Family-focused Fintech — onestepahead.so](https://www.onestepahead.so/p/greenlight-ing-the-future-of-family)
- [Deceptive Patterns: Robinhood — deceptive.design](https://www.deceptive.design/brands/robinhood)
- [The Linear Effect — rectangle.substack.com](https://rectangle.substack.com/p/the-linear-effect)
- [Linear Design: SaaS Trend Analysis — logrocket.com](https://blog.logrocket.com/ux-design/linear-design/)
- [Igloo Inc — Awwwards SOTY 2024](https://www.awwwards.com/annual-awards-2024/site-of-the-year)
- [Igloo Inc case study — Awwwards](https://www.awwwards.com/igloo-inc-case-study.html)
- [GSAP ScrollTrigger docs — gsap.com](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Lenis smooth scroll — lenis.dev](https://www.lenis.dev/)
- [Smooth Scrolling in Next.js with Lenis + GSAP — devdreaming.com](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap)
- [Olivier Larose — blog.olivierlarose.com](https://blog.olivierlarose.com/)
- [Build a Smooth Scroll Landing Page — blog.olivierlarose.com](https://blog.olivierlarose.com/tutorials/smooth-scroll)
- [Tobias van Schneider — vanschneider.com](https://vanschneider.com/)
- [Duolingo design method — designlab.com](https://designlab.com/blog/the-brief-08-08-25)
- [Fintech SaaS Landing Pages: Design Patterns 2026 — designrevision.com](https://designrevision.com/blog/fintech-saas-landing-pages)
