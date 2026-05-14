# Ninja Money-verse

**A 2D HD-pixel RPG that teaches anyone to manage money — train your money like a ninja trains the body. One stance, one breath, one chamber at a time.**

Open-source. Free forever. No dark patterns.

> A ninja-school-for-finance re-imagining of [dhaniverse.in](https://www.dhaniverse.in) — superior UI, graphics, learning, and gameplay. Every design decision is grounded in proven patterns from documented masters; see [docs/MASTERS_RESEARCH.md](./docs/MASTERS_RESEARCH.md) and [docs/research/ninja-finance.md](./docs/research/ninja-finance.md).

---

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in DB + AI Gateway + Colyseus URLs
pnpm dev
```

Visit:
- **Web shell** — http://localhost:3000
- **Game (Vite)** — http://localhost:5173
- **Realtime server** — ws://localhost:2567

---

## What's in this repo

```
apps/
  game/      Phaser 3 + Vite — the playable game
  web/       Next.js 16 — landing, dashboard, /play wrapper, API routes
  server/    Colyseus realtime + Hono HTTP (deploys to Fly.io)
packages/
  shared/         Zod schemas, finance constants, Drizzle DB schema
  finance-sim/    Pure-TS personal-finance math (compounding, Term Vault,
                  Drip Investing, repayments, two tax paths, market sim).
                  Zero deps. 100% tested.
  game-protocol/  Colyseus state schemas + typed client SDK
  content/        Quest JSON, NPC schedules, Yarn dialog, i18n bundles
  ui/             Shared shadcn primitives + design tokens
docs/             PRD, ARCHITECTURE, MASTERS_RESEARCH, TECH_STACK
.claude/          Project-scoped Claude Code subagents, skills, commands
AGENTS.md         Multi-agent orchestration spec
CLAUDE.md         Project guide for Claude Code
```

---

## Tech stack (open-source only)

| Layer | Choice |
|---|---|
| Game | **Phaser 3** + Tiled + EasyStar.js + Yarn Spinner |
| Web | **Next.js 16** App Router + shadcn/ui + Tailwind v4 |
| Realtime | **Colyseus** + WebSocket transport |
| Backend | **Hono** + Drizzle ORM + Better-Auth |
| Database | **Postgres** (Neon via Vercel Marketplace) |
| AI | **Vercel AI Gateway** (open-weights default: Llama / Qwen / Mistral) |
| Build | **Turborepo** + **pnpm** + **Vite** + **Biome** |
| Test | **Vitest** + **Playwright** + fast-check |

Full details + rejected alternatives: [docs/TECH_STACK.md](./docs/TECH_STACK.md).

---

## The pillars (read before contributing)

1. Hide the lesson in the verb
2. One concept per quest
3. Mastery gates, not time gates
4. Forgiveness over punishment
5. Daily ritual stays short
6. Authored, never procedural, world
7. The system responds
8. Free forever; no dark patterns
9. Universal context, distinctive voice
10. Assist Mode for finance

Full justification: [docs/PRD.md §4](./docs/PRD.md).

---

## Anti-patterns we reject

❌ Confetti on speculative wins · ❌ "biggest mover" notifications · ❌ lottery/spin rewards · ❌ paywalled lessons · ❌ "Easy Mode"/"Cheat Mode" framing · ❌ random encounters / grinding · ❌ silent failures · ❌ PvP combat · ❌ speculative-gain leaderboards · ❌ ads / dark patterns

---

## Contributing

- Read [CLAUDE.md](./CLAUDE.md) and [AGENTS.md](./AGENTS.md) first.
- Use [.claude/commands/](./.claude/commands/) — `/new-quest`, `/new-district`, `/master`, `/perf-check`, `/a11y-check`, `/pillar-check`.
- Every PR must cite the master pattern from `docs/MASTERS_RESEARCH.md` (or a new research brief in `docs/research/`) that justifies the design.
- 80% test coverage minimum. CI gates on lint + typecheck + test + content + i18n + perf.

---

## Licence

- **Code:** AGPL-3.0 for the game; MIT for packages designed to be embedded (`finance-sim`, `game-protocol`, `ui`).
- **Art & music:** CC-BY 4.0.
- **Dialog & lore:** CC-BY 4.0.

Attribution for third-party OSS assets: [assets/ATTRIBUTION.md](./assets/ATTRIBUTION.md).
