# Ninja Money-verse — Architecture

**Status:** Draft · **Audience:** Engineers + Claude Code agents · **Last updated:** 2026-05-14

> Decisions in this doc must be consistent with [PRD.md](./PRD.md) pillars and [TECH_STACK.md](./TECH_STACK.md). Pillar violations require a written ADR.

---

## 1. System overview

```
                      ┌─────────────────────────┐
                      │   Browser (desktop+mob) │
                      │  ┌───────────────────┐  │
                      │  │  Next.js (RSC)    │  │  ← marketing, dashboard, auth shell
                      │  │   /play route ──┐ │  │
                      │  └─────────────────│─┘  │
                      │  ┌─────────────────▼─┐  │
                      │  │  Phaser 3 game    │  │  ← canvas-mounted; runs full session
                      │  │  + WebGL PostFX   │  │
                      │  │  + Colyseus client│  │
                      │  └───────────────────┘  │
                      └───────┬───────────┬─────┘
                              │ HTTPS     │ WSS
                              │           │
              ┌───────────────▼─┐       ┌─▼────────────────────┐
              │  Vercel Edge +  │       │   Colyseus server    │
              │  Fluid Compute  │       │   (Fly.io / Railway) │
              │  ──────────────  │       │   ──────────────     │
              │  Next.js API    │       │   Authoritative      │
              │  Hono routes    │       │   rooms + state sync │
              │  AI Gateway     │       │   Async msg storage  │
              └─┬──────┬────┬───┘       └─┬───────────────────┘
                │      │    │             │
        ┌───────▼─┐ ┌──▼─┐ ┌▼─────┐  ┌────▼──────┐
        │ Postgres│ │Blob│ │Redis │  │ AI Gateway│
        │ (Neon)  │ │    │ │(UR)  │  │ (open-wts)│
        └─────────┘ └────┘ └──────┘  └───────────┘
```

---

## 2. Process / deployment topology

| Service | Runtime | Where | Cold-start tolerance |
|---|---|---|---|
| Web shell (Next.js) | Fluid Compute | Vercel | Cache hits + RSC streaming; <100ms median |
| Game bundle | Static (CDN) | Vercel CDN | Pre-built; instant |
| HTTP API (Hono) | Fluid Compute | Vercel | Reused instances; OK with reasonable cold-start |
| AI Gateway proxy | Fluid Compute | Vercel | Streaming-friendly |
| Colyseus realtime | Long-lived Node | Fly.io / Railway | Long-lived (WSS) — Vercel Functions not suited |
| Postgres | Managed | Neon (Marketplace) | Pooled; serverless branching |
| Redis | Managed | Upstash (Marketplace) | Stateless |
| Blob | Managed | Vercel Blob | n/a |

> **Why Colyseus is not on Fluid Compute:** WebSocket rooms need long-lived processes with in-memory state. Fluid Compute is excellent for HTTP but not the right primitive for stateful multiplayer. Fly.io machines or Railway services match the workload.

---

## 3. Repository layout (recap)

```
apps/game        Phaser game + Vite build
apps/web         Next.js shell (landing, /play wrapper, dashboard, /api)
apps/server      Colyseus rooms + Hono HTTP (deployed to Fly.io)
packages/shared          Shared zod schemas, finance constants, types
packages/finance-sim     Pure-TS finance math (compounding, taxes, SIP, NPS, FD, EMI)
packages/game-protocol   Colyseus state schemas + typed client SDK
packages/content         Quest JSON, NPC schedules, .yarn dialog, curriculum manifests
packages/ui              Cross-app design system (shadcn + tokens + fonts)
```

Boundary rules:
- `apps/*` may depend on `packages/*`. Apps never depend on each other.
- `packages/finance-sim` has **zero runtime dependencies** (pure functions, deterministic, fully tested).
- `packages/content` is data-only; no imports from `apps/`.
- `packages/game-protocol` is shared by `apps/game` (client) and `apps/server` (server) — the only package both consume directly.

---

## 4. Data model (Postgres + Drizzle)

```
users               id, email, handle, locale, created_at, flags(jsonb)
profiles            user_id PK, display_name, district_progress(jsonb), assist_mode_flags(jsonb)
wallets             user_id PK, inr_cash, last_synced_at
holdings            id, user_id, instrument_id, qty, avg_cost, opened_at
instruments         id, kind ('equity'|'mf'|'fd'|'rd'|'ppf'|'nps'|'bond'|'cash'), payload(jsonb)
mastery_nodes       user_id, node_id, level (0-3), last_reviewed_at, next_review_at
quests_state        user_id, quest_id, state ('available'|'active'|'done'), step, payload(jsonb)
streaks             user_id, current_len, longest_len, last_active_date, freezes_remaining
apartments          user_id, layout(jsonb), public (bool), last_published_at
gifts               id, from_user_id, to_user_id, item_id, sent_at, claimed_at
friend_codes        user_id, code (unique, short), created_at
friendships         user_a, user_b, since (PK pair)
events_log          id, user_id, event_type, payload(jsonb), at  -- analytics fan-in
ai_usage            user_id, day, tokens_in, tokens_out, cost_estimate  -- cap enforcement
moderation_queue    id, kind, payload(jsonb), reporter_id, status, at
```

Indexes: `(user_id)` on most; `(user_id, day)` on `ai_usage`; partial index on `quests_state` where `state = 'active'`.

Branching: every PR auto-spawns a Neon branch via the Vercel integration → ephemeral preview DB.

---

## 5. Realtime architecture (Colyseus)

### 5.1 Rooms
| Room | Purpose | Lifetime | Capacity |
|---|---|---|---|
| `LobbyRoom` | Friend list, gift drops | Long-lived per region | 1000+ |
| `ApartmentRoom` | Hosting a friend visit | Per-visit (~5 min) | 1 host + 4 visitors |
| `TradingFloorRoom` | Weekly live market sim | 90 min, scheduled | 100 |
| `TownHallRoom` | Saturday-night NPC event | 60 min, scheduled | 200 |

### 5.2 State schemas (`packages/game-protocol`)
- Use Colyseus' `@colyseus/schema` for delta encoding.
- Player state: `position`, `direction`, `currentEmote`, `displayName`.
- Room state: list of players, room-specific overlays.

### 5.3 Async messaging
- `Gifts` and `WallMessages` are HTTP-only — no need for Colyseus.
- The Colyseus presence service notifies a recipient on next room join (or via a "you have new mail" badge surfaced on next dashboard load).

---

## 6. Game client architecture (Phaser)

### 6.1 Scene graph
- `BootScene` — loads tiny manifest, branding splash.
- `PreloadScene` — loads district-scoped assets on demand; shows progress.
- `MainMenuScene` — outside-the-world UI; React overlay via DOM.
- `WorldScene` — the active district; mounts tilemap, NPCs, player.
- `UIScene` — diegetic HUD always on top.
- `DialogScene` — modal for quest dialog (Yarn runtime).
- `MinigameScene<T>` — slot for each minigame (Growth Sapling, Bonsai Ladder, Negotiate-Rhythm, …).

### 6.2 Entities
- `Player`, `Npc`, `Door`, `Shop`, `BankCounter`, `TerminalKiosk`, `InteractZone`, …
- Composition via component-style data objects on each `GameObject`; behaviour scripts attach in scene `create()`.

### 6.3 Post-processing pipeline
- Custom Phaser `PostFXPipeline`s in `apps/game/src/pipelines/`:
  - `TiltShiftPipeline` — vertical-gradient blur, configurable focal band.
  - `DepthFogPipeline` — depth fog for parallax layers.
  - `PointLightPipeline` — additive light blending, per-tile.
  - `BloomPipeline` — threshold + Gaussian blur + add.
  - `CrtPipeline` — optional, off by default.
- Composed in a `PostFxStack` that respects the user's "reduce motion / quality tier" setting.

### 6.4 Performance tiers
| Tier | Trigger | Effects on |
|---|---|---|
| **High** | desktop + WebGL2 + ≥60fps | All post-FX, parallax, particles |
| **Medium** | most laptops, modern Android | Tilt-shift + bloom; reduced particles |
| **Low** | older mobile, integrated GPUs | Sprites + minimal lighting; no post-FX |

Tier autodetects on first run; user can override.

### 6.5 Quest engine
- `packages/content/quests/<id>.yarn` → compiled to JSON at build → loaded on demand.
- A `QuestRunner` service maps Yarn node commands (e.g., `<<grant_xp budgeting 5>>`, `<<requires_mastery banking 1>>`) to game state mutations.
- All mutations go through `finance-sim` for deterministic, testable behaviour.

---

## 7. Finance simulation (`packages/finance-sim`)

**Pure TypeScript. Zero side effects. 100% unit-tested.** Every function is property-tested with realistic inputs.

Exports include:
- `compoundInterest(principal, rate, years, freq)`
- `sipFinalValue(monthly, rate, months)`
- `fdMaturity(principal, rate, tenureMonths, compFreq)`
- `emi(principal, rate, tenureMonths)`
- `taxOldRegime(income, deductions)`
- `taxNewRegime(income)`
- `nps(monthly, ageNow, retireAge, equityRatio)`
- `ppf(annual, years)` — current PPF rate constants in `packages/shared/constants.ts`
- `marketDayTick(rng, prevPrice, volatility, drift)` — deterministic given seed
- `portfolioValue(holdings, prices)`

Constants live in `packages/shared/constants.ts` and are versioned: every constant has a `since` date and an "as-of" note so tax slabs are explicitly historical.

---

## 8. AI tutor (Maya AI) — control flow

```
Player → Phaser DialogScene → "Ask Maya"
    │
    │  question + quest_id + skill_state + lang
    ▼
Next.js API /api/maya  (Hono on Fluid Compute)
    │
    ├─ Check daily token cap (Redis)
    ├─ Lookup Runtime Cache by (quest_id, skill_lvl, question_hash)
    │     ├─ HIT → stream cached chunks → done
    │     └─ MISS → continue
    │
    ├─ Build prompt:
    │     - system: scoped to quest + finance-only + disclaimer rules
    │     - context: anonymised player skill/holdings (no PII)
    │     - user: question
    │     - hard rules: no real-money advice, citations for any claim, refuse outside-scope
    │
    ├─ AI Gateway: provider chain
    │     1. open-weights primary (Llama 3.3 70B)
    │     2. failover (Qwen 2.5 / Mistral Large)
    │     3. closed (Sonnet/Haiku) only if free quota + flag enabled
    │
    └─ Stream response → write to cache on completion
```

Safety rails:
- Output filter: regex-strict pass that flags real-broker names, real-money links, "guaranteed returns" phrases → re-prompt.
- Disclaimer footer always appended client-side.
- Hard daily cost cap per user (configurable per environment).
- Per-request timeout 12 s; falls back to authored dialog (Yarn).

---

## 9. Save / progression / sync

- **Source of truth:** Postgres (server-authoritative for currency, holdings, mastery, streaks).
- **Local cache:** IndexedDB for offline-tolerant exploration; reconciliation on next online tick.
- **Conflict policy:** Server wins on numeric state (currency, holdings, mastery); client wins on cosmetic state (apartment decoration in-progress).
- **Anti-cheat:** all finance-sim runs server-authoritative for any state that affects mastery / leaderboards; client runs a copy for snappy UX but server reconciles every tick.

---

## 10. Multiplayer trust model

- **Default:** server is authoritative for everything that confers progression.
- **Apartments / cosmetics:** client can author freely; server validates against a whitelist of CC-BY assets.
- **Public profile:** opt-in only; cannot expose absolute net worth (only normalized rank tier).
- **Friend codes** generated server-side, short (8 chars), single-use to add.
- **Voice (optional):** room-scoped, never recorded, never transcribed.

---

## 11. Internationalisation

- All player-facing strings live in `packages/content/i18n/<locale>/*.json`.
- Yarn dialog files are authored in English, machine-translated to Hindi, then human-reviewed (translation pipeline lives in `packages/content/scripts/`).
- Devanagari font: IBM Plex Sans Devanagari + Mukta as fallback.
- Date / number formatting via `Intl`; never hand-format currency or dates.

---

## 12. Accessibility (built into architecture, not bolted on)

- Every quest must compile a "screen-reader summary" string (Yarn metadata).
- Phaser scenes mirror critical state to an off-screen ARIA-live region (in the React overlay) so screen readers can follow.
- All input is keyboard-mappable; gamepad via Phaser's Pad plugin.
- Reduce-motion flag globally short-circuits screen-shake, parallax, particles.
- A "Photo-sensitive safe" flag caps flash frequency.

---

## 13. Observability

- **Frontend:** PostHog autocapture + custom events for quest steps; Sentry for errors.
- **Backend:** OpenTelemetry traces from Next.js / Hono / Colyseus into Vercel Observability + Sentry.
- **Custom dashboards:** Activation funnel, day-7 retention, mastery progression histograms, AI cost per active user.

---

## 14. Security

- Auth via Better-Auth (session cookies, CSRF, rate-limited login).
- All HTTP routes validated with Zod schemas at the boundary.
- Realtime room joins authenticated via short-lived signed tokens.
- No real broker / bank integrations in v1 → reduces blast radius.
- SEBI / NCFE disclaimer screen on first launch and visible on the marketing site.
- Strict CSP, SRI for the game bundle, signed asset manifests.
- Secrets only via Vercel env / Fly.io secrets; never committed; `vercel.ts` reads from env at build only.

---

## 15. Performance budgets

| Surface | Budget |
|---|---|
| Landing TTFB | <200 ms (Vercel Edge) |
| Landing LCP | <2.0 s on Moto G4 4G |
| /play first frame | <4.0 s on Moto G4 4G; <2.0 s on desktop |
| Game bundle (initial) | <800 KB gzip |
| Per-district asset chunk | <2 MB gzip |
| Steady-state FPS | 60 desktop, 30+ mid-mobile, 24+ low-mobile |
| Colyseus state size per tick | <2 KB delta-encoded |

---

## 16. Decision log (ADRs — `docs/adr/` once we have any)

- ADR-0001: Phaser 3 over Godot 4 web export (file pending; rationale: install friction + plugin ecosystem)
- ADR-0002: Colyseus over hand-rolled WS (file pending; rationale: stateful rooms + reconnection out-of-the-box)
- ADR-0003: Drizzle over Prisma (file pending; rationale: edge runtime, lower overhead)
- ADR-0004: Better-Auth over Clerk for v1 (file pending; rationale: OSS, no vendor lock-in)
- ADR-0005: AI Gateway with open-weights primary (file pending; rationale: cost + values alignment + no vendor lock-in in gameplay path)

---

## Master's Margin Note

The architecture is **modest and conservative**: Phaser for the game, Next.js for the shell, Colyseus for rooms, Drizzle on Postgres, AI Gateway for the tutor. Each is the boring-but-correct choice in its layer — *Master Sabotage's "modernise without nostalgia poisoning"* applied to engineering: pick the proven thing, then polish the seams.

The non-boring bits — HD-2D-lite post-FX, the bilingual quest pipeline, the finance-sim package, the AI tutor scope-layer — are the four places we **must** build, because nothing OSS does them well enough for our use-case.
