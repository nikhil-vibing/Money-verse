# CLAUDE.md — Project guide for Claude Code

> **You are working on Money-verse** — a 2D HD-pixel RPG that teaches financial literacy to Indian users. Open-source-only stack. Better-than-v1 in UI, graphics, experience, and learning.
>
> **Before you do anything new, read [docs/PRD.md](./docs/PRD.md), then check the relevant pillar in §4 of that doc.** Pillar violations are blocking.

---

## Quick orientation

| File | Read when |
|---|---|
| `docs/PRD.md` | Anything that changes product behavior |
| `docs/ARCHITECTURE.md` | Anything that changes how the system is wired |
| `docs/TECH_STACK.md` | Adding/changing a dependency |
| `docs/MASTERS_RESEARCH.md` | Justifying a design pattern; you'll cite this in PR descriptions |
| `AGENTS.md` | Which subagent to spawn for which task |
| `.claude/agents/*` | Project-specific subagent definitions |
| `.claude/commands/*` | Slash commands you (and the user) can invoke |
| `.claude/skills/*` | Project-specific skills |
| `.claude/settings.json` | Permissions, hooks, model defaults |

---

## How this codebase is laid out

```
apps/
  game/     Phaser 3 + Vite — the playable game
  web/      Next.js 16 App Router — landing, dashboard, /play wrapper
  server/   Colyseus realtime + Hono HTTP (deploys to Fly.io)
packages/
  shared/        Zod schemas, finance constants, types
  finance-sim/   Pure-TS finance math (no side effects, 100% tested)
  game-protocol/ Colyseus state schemas + typed client SDK
  content/       Quest JSON, NPC schedules, .yarn dialog, curriculum
  ui/            Shared shadcn primitives, tokens, fonts
assets/      Source art, audio, raw maps
docs/        PRD, ARCHITECTURE, MASTERS_RESEARCH, ROADMAP
.claude/     Agents, skills, commands, settings
```

Boundary rules (enforced via package.json + eslint-plugin-boundaries):
- `apps/*` may depend on `packages/*`. Apps never depend on each other.
- `packages/finance-sim` has zero runtime dependencies.
- `packages/content` is data-only.
- `packages/game-protocol` is the only package both `apps/game` and `apps/server` import.

---

## Commands you will reach for

> All commands run from the repo root. We use **pnpm**.

| Command | What it does |
|---|---|
| `pnpm install` | Install all workspace deps |
| `pnpm dev` | Start `apps/web`, `apps/game` (Vite), and `apps/server` (Colyseus) in parallel |
| `pnpm dev:web` | Just the Next.js shell |
| `pnpm dev:game` | Just the Phaser game (Vite HMR) |
| `pnpm dev:server` | Just Colyseus + Hono |
| `pnpm build` | Turborepo build all apps |
| `pnpm test` | Vitest across all packages |
| `pnpm test:coverage` | Run with v8 coverage gate (80%) |
| `pnpm test:e2e` | Playwright E2E |
| `pnpm lint` | Biome + ESLint |
| `pnpm typecheck` | tsc --noEmit across workspace |
| `pnpm db:push` | Drizzle push to current DB |
| `pnpm db:studio` | Drizzle Studio UI |
| `pnpm db:migrate` | Apply migrations |
| `pnpm content:compile` | Compile Yarn dialog + quest JSON |
| `pnpm assets:atlas` | Build sprite atlases |
| `pnpm i18n:check` | Verify all locale keys present |

Before opening a PR you must pass: `pnpm lint && pnpm typecheck && pnpm test && pnpm content:compile && pnpm i18n:check`.

---

## Coding conventions

### TypeScript
- Strict mode everywhere. No `any` without an `// eslint-disable-next-line @typescript-eslint/no-explicit-any` + reason.
- `import type` for type-only imports.
- Path aliases per workspace (configured in each `tsconfig.json` and `vite.config.ts`).
- Public API of each package goes through `index.ts`; deep imports are forbidden.

### Immutability
- **NEVER mutate state.** Always return new objects.
- Game scene transitions emit events; subscribers receive new state snapshots.
- Postgres mutations are explicit transactions; never partial in-place edits.

### Style & file size
- KISS / DRY / YAGNI.
- Files 200–400 lines typical; **800 max**.
- Functions <50 lines.
- Nesting <4 levels — use early returns.
- Naming: `camelCase` (vars/fns), `PascalCase` (types/components), `UPPER_SNAKE_CASE` (constants), `useFoo` (hooks).
- Booleans prefixed with `is`/`has`/`should`/`can`.

### Comments
- Default to no comments. Only add a comment when the *why* is non-obvious (invariant, workaround, hidden constraint).
- Never restate *what* the code does.
- Never reference issue numbers or callers in comments — those belong in the PR description.

### Error handling
- Errors at boundaries: validate user input with Zod, validate external API responses.
- Never silently swallow. Never empty `catch {}`.
- UI-facing messages must be user-friendly; logs get the full context.

---

## Project-specific rules (the pillars)

These come from [docs/PRD.md §4](./docs/PRD.md). They are blocking for PR approval.

1. **Hide the lesson in the verb.** No screen >60 chars of explanatory text before the player can act.
2. **One concept per quest.** A new quest must list exactly one new concept in its frontmatter.
3. **Mastery gates, not time gates.** Never gate content behind "play for N hours" — always behind demonstrated competency.
4. **Forgiveness over punishment.** Never silently fail. Warn first, let the player choose.
5. **Daily ritual stays short.** Daily loop ≤10 min wall-clock.
6. **Authored, never procedural, world.** Every named NPC has a schedule + memory file in `packages/content/npcs/`.
7. **The system responds.** Major financial decisions change ≥3 NPC dialog branches.
8. **Free forever; no dark patterns.** No confetti on speculative wins. No notifications hyping volatility. No surprise-stock rewards. No paywalls on foundational lessons.
9. **Indian context first.** All examples ₹, SIP/PPF/NPS/FD, bilingual EN+HI.
10. **Assist Mode for finance.** Every concept must have a slowed-tick / exposed-math / hint-NPC variant. Never call it "Easy" or "Cheat."

If you write code that violates a pillar, **stop and ask the user** before continuing.

---

## Anti-patterns we actively reject (cite this list in PRs)

- ❌ Confetti / dopamine animation on speculative wins (Robinhood pattern)
- ❌ Push notifications hyping "biggest movers"
- ❌ Lottery / surprise-stock / spin-the-wheel rewards
- ❌ Paywalled foundational lessons
- ❌ "Easy Mode" or "Cheat Mode" framing → call it Assist
- ❌ Long sessions required for progress
- ❌ Random encounters / grinding
- ❌ US-centric financial examples
- ❌ Silent failures
- ❌ PvP combat
- ❌ Leaderboards by speculative gains
- ❌ Ads, dark patterns, attention-mining

---

## Open-source-only rule

We compose battle-tested OSS; we **only build what doesn't exist** in the OSS world.

Before writing new code that solves a generic problem, do this (don't skip):
1. Search npm + GitHub for an existing OSS package.
2. Check it against [docs/TECH_STACK.md §8](./docs/TECH_STACK.md) (the "what we are not using and why" list).
3. If you propose a new dependency, justify it in your PR description with: licence, maintenance signal (last release, stars, issues), and an alternative you rejected.

We *will* hand-build:
- `packages/finance-sim` (no OSS handles Indian tax + EPF/PPF/NPS/SIP with our hooks).
- HD-2D-lite Phaser post-FX pipelines (no OSS bundle exists at our target quality).
- The quest engine on top of Yarn Spinner.
- The AI tutor scope-and-safety layer.
- The NPC schedule engine.
- The bilingual content pipeline.

Everything else: adopt OSS and configure.

---

## When to use subagents

**See [AGENTS.md](./AGENTS.md) for the full guide.** Quick rules:

- **Multi-step, multi-file research** → spawn `Explore` (read-only) or `general-purpose`.
- **Game-dev / Phaser scene work** → spawn `game-dev` subagent (`.claude/agents/game-dev.md`).
- **Finance math / sim** → spawn `finance-sim` subagent.
- **Quest authoring (Yarn dialog)** → spawn `quest-writer` subagent.
- **Pixel-art asset curation (find OSS, license-check)** → spawn `art-curator` subagent.
- **Accessibility audit** → spawn `a11y-reviewer` subagent.
- **Anything Vercel-related (deploy, env, AI Gateway)** → use Vercel skills directly (`vercel:deploy`, `vercel:env`, `vercel:ai-gateway`).

Run agents in parallel when their work is independent (e.g., spawn `art-curator` + `quest-writer` simultaneously for a new district).

---

## When to use skills

This repo benefits from these skills (project + plugin):

- `master` (custom) — `/master` to spawn the research engine for any new feature that needs grounding in proven patterns. **Required** before any major new system.
- `vercel:nextjs`, `vercel:vercel-functions`, `vercel:ai-gateway`, `vercel:ai-sdk`, `vercel:vercel-storage`, `vercel:env-vars` — for the corresponding platform tasks.
- `vercel:react-best-practices` — auto-trigger after editing multiple `.tsx` files.
- `vercel:verification` — auto-trigger when starting the dev server.

---

## Hooks & permissions

See `.claude/settings.json`. We auto-allow read-only tools and common dev commands (`pnpm`, `git status`, `git diff`, `gh pr view`). Anything destructive prompts for permission.

A `PostToolUse` hook on Write/Edit runs Biome format on the modified file. A `PreToolUse` hook on Bash blocks `npm install` (we use pnpm) and warns on `git push --force`.

---

## Git workflow

Conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `perf:`, `ci:`). Attribution disabled globally per user settings.

PR description must include:
- **What** changed (1-2 sentences).
- **Why** — link to the master-pattern in `docs/MASTERS_RESEARCH.md` that justifies the design.
- **Pillar check** — confirm which pillars apply and that the change respects them.
- **Test plan** — checklist of manual + automated tests.

CI blocks merge on: lint, typecheck, test (with 80% coverage), content compile, i18n key audit, Playwright smoke.

---

## What NOT to do

- Don't add features the PRD doesn't list. Update the PRD first, in a separate commit.
- Don't introduce abstractions before they're needed (YAGNI).
- Don't write multi-paragraph docstrings or planning docs unless the user asks.
- Don't create `*.md` files outside `docs/` unless the user requests them.
- Don't push to `main` directly — always via PR.
- Don't `git push --force` to shared branches.
- Don't bypass hooks with `--no-verify`.
- Don't run `npm` — we use `pnpm`.
- Don't add a closed-source dependency without explicit user approval and a written exception.

---

## When you finish a session

A one- or two-sentence summary. What changed. What's next. Nothing else.
