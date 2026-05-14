# Ninja Money-verse — Tech Stack

**Principle:** *Only open-source dependencies.* We compose battle-tested libraries; we only build what doesn't exist in the open-source world.

Every dependency below is verified to be free-to-use under a permissive licence (MIT / Apache-2.0 / BSD / CC0 / CC-BY) or copyleft compatible with our distribution. No proprietary middleware in the gameplay path.

---

## TL;DR

| Layer | Choice | Licence | Why |
|---|---|---|---|
| 2D game engine | **Phaser 3** | MIT | Most-used OSS 2D HTML5 engine; WebGL + Canvas; huge plugin ecosystem |
| Game state language | **TypeScript 5.6+** | Apache-2.0 | Type-safe everywhere |
| Map editor | **Tiled** | GPL (editor) / MIT (loader) | De-facto standard for 2D tilemaps; `phaser-tiled` loader |
| Animation | **Aseprite** export → Phaser atlases | MIT-licensed CLI option (libresprite) | Hand-painted sprite animation |
| Path-finding | **EasyStar.js** | MIT | Lightweight A* for grids |
| Particles & FX | **Phaser 3 built-in** + custom GLSL | MIT | No third-party tax |
| Post-processing | **Phaser 3 pipelines** (custom shaders) | MIT | Tilt-shift, bloom, fog, CRT |
| UI framework (out-of-game) | **Next.js 16 (App Router)** | MIT | SSR, edge, RSC; landing + dashboard + auth shell |
| UI primitives | **shadcn/ui** + **Radix UI** | MIT | Composable, accessible, themeable |
| Styling | **Tailwind CSS v4** | MIT | Utility-first; tokens drive game-UI parity |
| Fonts | **Atkinson Hyperlegible**, **OpenDyslexic**, **IBM Plex Mono / Sans Devanagari** | OFL / Apache | Free, accessibility-first, Devanagari support |
| State (out-of-game) | **Zustand** | MIT | Small, no boilerplate |
| Data fetching | **TanStack Query v5** | MIT | Cache + retry + invalidation |
| Forms | **react-hook-form** + **Zod** | MIT | Type-safe forms with schema validation |
| Multiplayer server | **Colyseus** | MIT | Authoritative rooms, state sync, scaling |
| Realtime transport | **WebSocket** via Colyseus | — | Falls back gracefully |
| Voice (optional) | **mediasoup** / **LiveKit Open Source** | ISC / Apache-2.0 | SFU for room voice; opt-in |
| Backend HTTP | **Hono** | MIT | Fast, runs on Fluid Compute / Bun / Node |
| Database | **Postgres** (Neon via Vercel Marketplace) | PostgreSQL Licence | Standard relational; serverless branching |
| ORM | **Drizzle ORM** | Apache-2.0 | Type-safe, SQL-first, edge-friendly |
| Migrations | **drizzle-kit** | Apache-2.0 | Schema diffing |
| Cache (server) | **Upstash Redis** (Marketplace) | OSS Redis 7 fork (BSD) | Counters, rate-limit, sessions |
| Cache (function-local) | **Vercel Runtime Cache** | — | Per-region ephemeral KV |
| Auth | **Better-Auth** | MIT | Self-hosted, OSS, full-featured. Fallback: Clerk Marketplace |
| Email | **Resend** (Marketplace) | API; templates OSS | Magic links + tx emails |
| Object storage | **Vercel Blob** | — | Avatars + UGC apartment screenshots |
| Asset pipeline | **Vite 5** for game build | MIT | Fast HMR; ESM-first |
| Monorepo | **Turborepo** + **pnpm workspaces** | MIT | Caching, incremental |
| Linting | **ESLint** + **typescript-eslint** + **Biome** | MIT | Biome for fast format/lint; ESLint for game-specific rules |
| Testing (unit) | **Vitest** | MIT | Vite-native, fast |
| Testing (integration) | **Vitest** + **@vitest/coverage-v8** | MIT | 80% coverage gate |
| Testing (e2e) | **Playwright** | Apache-2.0 | Real browser; can drive Phaser via window globals |
| Testing (game logic) | **Vitest** with mock Phaser scene | MIT | Pure-logic tests for finance math |
| Audio | **Howler.js** | MIT | Cross-browser; spatial audio |
| Audio assets | OpenGameArt CC0 + commissioned | CC0 / CC-BY | Free reuse |
| Soundtrack composition | **LMMS** or **MilkyTracker** (editor) | GPL | OSS DAW for chiptune; renders to OGG/MP3 |
| AI tutor | **Vercel AI Gateway** + AI SDK v6 | MIT (SDK) | Provider-agnostic; open-weights default |
| AI default model | Llama 3.3 70B / Qwen 2.5 / Mistral Large | Open weights via Gateway | No proprietary lock-in in gameplay path |
| Dialog scripting | **Yarn Spinner** (compiled) OR **Inkjs** | MIT | Branching dialog DSL; both OSS |
| Localization | **i18next** + **react-i18next** | MIT | EN + HI + Devanagari ready |
| Analytics | **PostHog** (self-hostable) | MIT | Product analytics + feature flags; OSS |
| Error tracking | **Sentry** (self-hostable) | BSL → free for self-host | Crash + perf |
| Observability | **OpenTelemetry** + **Vercel Observability** | Apache-2.0 | Traces across web/server/game |
| Feature flags | **PostHog Flags** | MIT | Already in analytics stack |
| Deploy: web + server | **Vercel** (Next.js + Fluid Compute) | — | Hosting platform |
| Deploy: Colyseus | **Fly.io** / **Railway** / self-host | — | Long-lived WebSocket processes |
| CI | **GitHub Actions** | — | Free for OSS |
| Container | **Docker** + **Bun** runtime image | Apache-2.0 / MIT | For self-hosters |

---

## 1. Game runtime — what powers the 2D world

### 1.1 Phaser 3
- **Repo:** https://github.com/phaserjs/phaser · **Licence:** MIT
- Why: 2D HTML5 WebGL/Canvas engine. The single most production-proven OSS 2D engine in the browser. Has tilemap support, particles, tween system, plugin ecosystem, and works on every browser.
- **Custom pipelines** (our work): tilt-shift, bloom, depth-fog, dynamic point-lights, CRT scanline option. These are GLSL fragment shaders we will author — Phaser exposes `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline` as the extension point.

### 1.2 Tiled + phaser-tiled-loader
- **Tiled:** https://www.mapeditor.org/ · GPL editor; map files are TMX/JSON (no licence on the data).
- **Loader:** Phaser ships first-class Tiled support.
- Why: Industry-standard editor; lets level designers work without code.

### 1.3 EasyStar.js
- **Repo:** https://github.com/prettymuchbryce/easystarjs · MIT
- Why: A* pathfinding for grid worlds, used by NPC schedules and the smart minimap.

### 1.4 Dialog DSL — Yarn Spinner / Inkjs
- **Yarn Spinner:** https://github.com/YarnSpinnerTool/YarnSpinner · MIT
- **Inkjs:** https://github.com/y-lohse/inkjs · MIT
- We'll evaluate both; **default Yarn Spinner** (cleaner authoring; better for non-coders writing quest dialog).
- Both compile to JSON at build time; runtime cost is negligible.

### 1.5 Asset pipeline
- **Aseprite** (paid; not required) — players can use **LibreSprite** (GPL, free fork) to author sprites.
- Sprite atlases exported via TexturePacker (paid) or **free-tex-packer** (MIT).
- Audio sourced from **OpenGameArt** (CC0) and **Freesound** (CC0/CC-BY filter) until we commission originals.

---

## 2. Web shell — landing, auth, dashboard, education hub

### 2.1 Next.js 16 (App Router)
- MIT · https://nextjs.org
- RSC + Cache Components for the marketing site and player dashboard.
- Game itself runs in a single client-component route (`/play`) that mounts Phaser into a canvas; the rest of the site is RSC.

### 2.2 shadcn/ui + Radix
- shadcn primitives are **copy-paste** into our codebase — no runtime dependency, fully owned, MIT.
- Radix primitives behind them are MIT.
- Why: accessibility comes free; theming via Tailwind tokens.

### 2.3 Tailwind v4
- MIT · Utility-first; design tokens shared between game HUD overlays and Next.js UI.

---

## 3. Multiplayer — async-first, optional sync

### 3.1 Colyseus
- **Repo:** https://github.com/colyseus/colyseus · MIT
- Authoritative server framework: rooms, lobbies, state sync (delta-encoded), reconnection.
- Built-in **Phaser** examples.
- Deploys on Node, can run on Fluid Compute for short-lived rooms; long-lived rooms run on Fly.io / Railway.

### 3.2 mediasoup (voice — opt-in only)
- **Repo:** https://github.com/versatica/mediasoup · ISC
- SFU for room-based voice. Disabled by default; opt-in per room.

---

## 4. Backend & data

### 4.1 Hono
- MIT · https://hono.dev
- Lightweight HTTP framework that runs on Bun, Node, Fluid Compute, Workers.
- API routes for: auth handoff, quest CRUD (admin), profile read/write, leaderboard (consistency only), AI tutor proxy.

### 4.2 Postgres (Neon)
- PostgreSQL Licence (BSD-style) · https://www.postgresql.org/
- Provisioned via Vercel Marketplace → Neon (auto-provisioned env vars).
- Serverless branching for preview environments.

### 4.3 Drizzle ORM
- Apache-2.0 · https://orm.drizzle.team/
- Schema in TypeScript, SQL-first queries, edge-runtime compatible.
- Migrations via drizzle-kit.

### 4.4 Better-Auth
- MIT · https://www.better-auth.com/
- OSS auth: email + password, magic link, OAuth, sessions, RBAC. Self-hosted, no vendor lock-in.
- **Fallback:** Clerk via Vercel Marketplace if Better-Auth doesn't meet a launch requirement.

### 4.5 Redis (Upstash via Marketplace)
- OSS Redis 7-compatible fork (BSD) · provisioned via Marketplace.
- Use cases: rate limiting, daily-streak counters, AI cost caps, room presence.

### 4.6 Vercel Blob
- For player avatars and apartment screenshots; supports private + public modes.

---

## 5. AI — Maya AI tutor

### 5.1 Vercel AI Gateway + AI SDK v6
- AI SDK v6: MIT · https://sdk.vercel.ai/
- Gateway gives provider failover; we default to **open-weights** providers (Llama, Mistral, Qwen) for cost + values alignment; closed providers reserved for premium quality where free credits exist.
- Streaming responses + tool-calling.
- **Cost cap per player per day** enforced server-side; falls back to authored dialog when exceeded.

### 5.2 Dialog cache
- Vercel Runtime Cache keyed by `(quest_id, player_skill_level, question_hash)` → identical questions don't re-bill.

---

## 6. Developer experience

### 6.1 Turborepo + pnpm workspaces
- MIT · https://turbo.build/
- Caching for builds across apps and packages.

### 6.2 Biome + ESLint + Prettier (Biome subsumes)
- MIT · https://biomejs.dev/
- Biome handles format + most lints (fast). ESLint runs in CI only for type-aware rules and `@typescript-eslint/no-floating-promises` family.

### 6.3 Vitest
- MIT · Unit + integration tests across all packages; coverage gate 80%.

### 6.4 Playwright
- Apache-2.0 · End-to-end tests; can drive Phaser via window-exposed test hooks.

### 6.5 GitHub Actions
- CI: lint → type-check → test → build → deploy preview.

---

## 7. Repository layout (monorepo)

```
Dhaniverse.2.0/
├── apps/
│   ├── game/             # Phaser 3 + Vite — the playable game
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── scenes/
│   │   │   ├── entities/
│   │   │   ├── pipelines/    # WebGL post-fx shaders
│   │   │   ├── ui/           # in-game diegetic UI
│   │   │   └── main.ts
│   │   └── vite.config.ts
│   ├── web/              # Next.js 16 App Router — landing, dashboard, auth, /play wrapper
│   │   ├── app/
│   │   ├── components/
│   │   └── next.config.ts
│   └── server/           # Colyseus realtime + Hono HTTP (Fly.io target)
│       ├── src/
│       │   ├── rooms/
│       │   ├── http/
│       │   └── index.ts
│       └── package.json
├── packages/
│   ├── shared/           # Shared types, zod schemas, finance constants
│   ├── finance-sim/      # Pure-TS finance math (compounding, taxes, SIP, NPV, etc.)
│   ├── game-protocol/    # Colyseus state schemas + client SDK
│   ├── content/          # Quest JSON, NPC schedules, dialog .yarn files, curriculum manifests
│   └── ui/               # Cross-app design system (shadcn primitives, tokens, fonts)
├── assets/               # Source art (PSD/Aseprite), audio, raw maps
├── docs/                 # PRD, ARCHITECTURE, MASTERS_RESEARCH, ROADMAP
├── .claude/              # Project-scoped agents, skills, commands, settings
├── AGENTS.md
├── CLAUDE.md
├── vercel.ts             # Vercel config (TS, replaces vercel.json)
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## 8. What we are **not** using (and why)

| Rejected | Why |
|---|---|
| Unity / Unreal / Godot 4 native | Web-first delivery; Phaser keeps install-friction zero; Godot HTML5 export is heavier |
| Babylon.js / PlayCanvas | 3D-first; overkill for 2D HD-2D-lite |
| Cocos2d-x | Smaller ecosystem; weaker TS support |
| MelonJS / Kaboom.js | Smaller community than Phaser |
| Socket.io | Colyseus is purpose-built for stateful game rooms |
| Firebase / Supabase | Both fine, but Neon + Drizzle gives us cleaner SQL and Vercel-native env wiring |
| Prisma | Drizzle is more edge-runtime-friendly and lower-runtime-overhead |
| Vercel KV / Vercel Postgres | Discontinued in favour of Marketplace |
| Edge Functions | Deprecated pattern; Fluid Compute is the recommended path |
| Redux | Zustand is simpler for the bounded state we have |
| MUI / Chakra | shadcn + Radix is more flexible and owned |
| OpenAI/Anthropic SDK directly | We route everything via AI Gateway for failover + observability |

---

## 9. Build-vs-buy decisions (only build what's not open-source)

We will **only write code** for things that have no good OSS equivalent for our use-case:

| We will build | Why |
|---|---|
| **Finance simulation engine** (`packages/finance-sim`) | No OSS package handles Indian tax regimes, EPF, PPF, NPS, SIP, FD/RD math with our specific quest hooks |
| **Quest engine** built on top of Yarn Spinner | Yarn handles dialog; we layer mastery-gating, state mutation, and reward triggers |
| **HD-2D-lite Phaser post-FX pipelines** | No OSS bundle of tilt-shift + bloom + depth-fog tuned for our look |
| **Mastery tracking + skill tree** | Generic skill-tree libs don't do mastery-with-spaced-repetition |
| **AI tutor scope-and-safety layer** | Off-the-shelf chat UI doesn't enforce per-quest scope or finance-safety disclaimers |
| **NPC schedule engine** | Custom — drives day/night routines, dialog state, mood |
| **Bilingual content pipeline** | i18next is the runtime; the *authoring* pipeline (Yarn → translated JSON → asset bundling) is ours |

Everything else: **adopt an OSS package and configure**.

---

## 10. Licensing of our own output

- **Code:** AGPL-3.0 for the game; MIT for packages others might want to embed (`finance-sim`, `game-protocol`, `ui`). Final call before public release.
- **Art:** All commissioned art under work-for-hire; original sprites we author are **CC-BY 4.0** for community modding.
- **Music:** Same as art.
- **Dialog / lore:** CC-BY 4.0; encourages translations.

---

## Master's Margin Note

The stack chooses **proven OSS over novelty** in every layer. Phaser is the boring-but-bulletproof choice (Master Sabotage rule: ship reliably, don't reinvent). Colyseus is the only serious OSS choice for stateful Phaser multiplayer. Drizzle + Neon + Vercel is the modern Indie-ready posture. Better-Auth keeps us un-locked.

We deviate from the "default Next.js + Postgres + Clerk" path only where lock-in or licence is a problem (AI Gateway > direct provider SDKs; Better-Auth > Clerk for self-hostability).

**Next deep-dives before scaffolding:** Phaser 3 PostFX pipeline docs; Colyseus + Phaser official example; Drizzle migrations on Neon branches; AI Gateway provider-routing config.
