# AGENTS.md — Multi-agent orchestration for Dhaniverse 2.0

> **Audience:** Claude Code + any agentic coding tool that respects the `AGENTS.md` convention. Each named subagent below has a corresponding markdown definition in `.claude/agents/<name>.md`. Spawn via the Agent tool with `subagent_type: <name>`.

This file describes:
1. The **agent roster** — what each subagent is responsible for.
2. The **orchestration patterns** — when to run which agents, when to parallelise.
3. The **handoff contracts** — what each agent expects in / outputs.

The goal is a tight, role-based team where the main Claude Code thread acts as **orchestrator** and delegates specialised work to **focused subagents** that protect the main context window and produce higher-quality outputs in their lane.

---

## 1. Agent roster

| Subagent | Lane | When to spawn |
|---|---|---|
| `game-dev` | Phaser scenes, entities, pipelines, game-loop code | New scene, new entity, post-FX work, Phaser-specific bugs |
| `finance-sim` | `packages/finance-sim` math; property-based tests | New financial formula, tax-slab update, sim correctness bug |
| `quest-writer` | `.yarn` dialog + quest JSON + curriculum mapping | New quest, new district content, dialogue revision |
| `art-curator` | Find OSS art assets (CC0/CC-BY), licence-check, atlas planning | New visual feature, sprite need, district art pass |
| `npc-author` | NPC schedules, memory files, dialog continuity | New named NPC, schedule conflict resolution |
| `level-designer` | Tiled maps, district layout, walkability, performance | New district, level-perf issue, traversal bug |
| `multiplayer-engineer` | Colyseus rooms, state schemas, presence | Realtime work, sync bugs, room scaling |
| `ai-tutor-engineer` | Maya AI scope, prompt, safety rails, cost cap | Tutor changes, new safety rule, prompt regression |
| `db-engineer` | Drizzle schemas, migrations, Neon branching | Schema change, migration design, index tuning |
| `a11y-reviewer` | WCAG 2.2 AA, screen-reader, keyboard, reduce-motion | Accessibility audit, new UI surface |
| `i18n-curator` | EN/HI translation pipeline, Devanagari, Intl format | New player-facing string, locale audit |
| `perf-budgeteer` | LCP / bundle / FPS / tick-size budgets | Bundle bloat, FPS drop, network spike |
| `security-reviewer` | Auth, RBAC, CSP, secrets, abuse vectors | Pre-commit on auth/payment/admin paths |
| `master-researcher` | The `master` skill — research masters for any new pattern | Any new feature whose design isn't grounded in [docs/MASTERS_RESEARCH.md](./docs/MASTERS_RESEARCH.md) |
| `Explore` *(built-in)* | Read-only code search | Pointer questions, "where is X defined" |
| `Plan` *(built-in)* | Architect implementation plans | New major feature, refactor scoping |
| `general-purpose` *(built-in)* | Anything that doesn't fit a specialised lane | Open-ended investigation, multi-domain spike |

---

## 2. Orchestration patterns

### Pattern A — Greenfield feature (e.g., "build the Niveshak Chowk stock-market district")

```
Main thread (orchestrator)
  │
  ├── master-researcher       (1)  ground design in masters
  │
  ├── PARALLEL ────────────────────
  │     ├── art-curator       (2a) source OSS pixel-art + licence-check
  │     ├── npc-author        (2b) define district NPCs + schedules
  │     └── quest-writer      (2c) draft quest list + curriculum mapping
  │
  ├── level-designer          (3)  Tiled map + walkability
  ├── game-dev                (4)  Phaser scene wire-up
  ├── finance-sim             (5)  any new math needed (limit-orders, SIP rebalancing)
  ├── ai-tutor-engineer       (6)  Maya scope changes for this district
  │
  ├── PARALLEL ────────────────────
  │     ├── a11y-reviewer     (7a) audit before merge
  │     └── i18n-curator      (7b) ensure HI strings exist
  │
  └── perf-budgeteer          (8)  verify budgets hold; gate the PR
```

Steps 2a/2b/2c run **in parallel** (one Agent call with multiple Agent tool uses). Same for 7a/7b. The orchestrator owns step transitions and never delegates synthesis ("based on findings, do X") — the orchestrator reads each subagent's output and gives the next agent explicit instructions.

### Pattern B — Bug fix in finance math

```
Main thread
  ├── finance-sim    Reproduce + fix + property test
  └── perf-budgeteer Spot-check (only if behavior changed in hot path)
```

No parallelism needed.

### Pattern C — Multiplayer regression

```
Main thread
  ├── Explore             find regression seed (when did sync break)
  ├── multiplayer-engineer fix Colyseus state / message ordering
  └── perf-budgeteer       verify tick-size budget unchanged
```

### Pattern D — Adding a new NPC

```
Main thread
  ├── PARALLEL
  │     ├── art-curator    sprite + idle/walk anim references
  │     └── npc-author     schedule, memory, dialog continuity rules
  └── quest-writer         author the NPC's first quest
```

---

## 3. Handoff contracts

### 3.1 `master-researcher`
- **Inputs:** Goal, context, depth (quick / medium / deep).
- **Output:** A research brief written to `docs/research/<feature>.md` with master roster, patterns, anti-patterns, and meta-framework.
- **Cite in PR.** Every design decision must be traceable to a brief like this.

### 3.2 `game-dev`
- **Inputs:** Scene name, entities, gameplay spec, performance tier targets.
- **Output:** Phaser scene + entity files + tests; no Phaser-DOM hybrid hacks.
- **Constraints:** All scene transitions must be event-driven; no shared mutable globals; pipeline composition through `PostFxStack`.

### 3.3 `finance-sim`
- **Inputs:** Function signature, semantic spec (with realistic Indian inputs and edge cases), constants source.
- **Output:** Pure function + property-based Vitest test (100% branch coverage).
- **Constraints:** Zero dependencies (besides node:assert / Vitest). Deterministic given inputs. Constants in `packages/shared/constants.ts` with `since` dates.

### 3.4 `quest-writer`
- **Inputs:** Quest ID, district, concept (exactly one), pre-conditions, NPCs involved, expected reward.
- **Output:** `packages/content/quests/<id>.yarn` + `.json` frontmatter, plus EN/HI string entries.
- **Constraints:** One new concept per quest. ≤10 min wall-clock to complete. Verb-first onboarding. No lecture pre-action.

### 3.5 `art-curator`
- **Inputs:** Visual need ("retro Bangalore bank-counter NPC, 32×32, idle + 4-dir walk").
- **Output:** Found-asset manifest (URL, licence, attribution requirement) **or** brief for commissioned art.
- **Constraints:** Only CC0 / CC-BY / matching MIT-equivalent. Records attribution in `assets/ATTRIBUTION.md`.

### 3.6 `npc-author`
- **Inputs:** Name, role, district, voice, daily schedule slots, memory hooks.
- **Output:** `packages/content/npcs/<id>.json` + `.yarn` dialog stubs + entries in NPC index.
- **Constraints:** Schedule must be conflict-free with other NPCs of the district. Memory hooks must reference state keys defined in `packages/game-protocol`.

### 3.7 `level-designer`
- **Inputs:** District spec, key landmark NPCs, mood references.
- **Output:** Tiled `.tmx`/`.json` file + asset references + walkability sanity report.
- **Constraints:** Stays under per-district asset budget (`<2 MB gzip`).

### 3.8 `multiplayer-engineer`
- **Inputs:** Room spec, state shape, capacity, lifetime.
- **Output:** Colyseus room class + state schema in `packages/game-protocol` + client SDK updates.
- **Constraints:** State delta <2 KB/tick. Server-authoritative for anything affecting progression.

### 3.9 `ai-tutor-engineer`
- **Inputs:** Quest context, allowed concepts, refusal rules.
- **Output:** System-prompt fragment + Zod schema for tool-calls + tests for in-/out-of-scope behaviour.
- **Constraints:** Per-player daily cost cap. Output filter rules. No real-broker names. Citations on factual claims.

### 3.10 `db-engineer`
- **Inputs:** New/changed entities, query patterns, expected scale.
- **Output:** Drizzle schema diff + migration + index plan + Neon-branch test.
- **Constraints:** Migrations are forward-compatible; never delete a column without a deprecation step.

### 3.11 `a11y-reviewer`
- **Inputs:** Surface to audit (URL / scene / route).
- **Output:** Findings in WCAG 2.2 AA terms with severity; PR-ready remediations.

### 3.12 `i18n-curator`
- **Inputs:** Surface to audit + any new strings introduced.
- **Output:** Updated `packages/content/i18n/<locale>/*.json` keys + Hindi translations queued for human review (or auto-translated then flagged).

### 3.13 `perf-budgeteer`
- **Inputs:** Surface to audit.
- **Output:** Measurement report (LCP, bundle, FPS, tick size) + recommendations.

### 3.14 `security-reviewer`
- **Inputs:** Changed files.
- **Output:** Findings keyed to OWASP categories + remediations + a CSP review when relevant.

---

## 4. Orchestrator rules (for the main Claude Code thread)

1. **Don't delegate understanding.** Never write "based on your findings, do X." Always read the agent's output and write an explicit follow-up brief.
2. **Brief agents like cold colleagues.** Every Agent prompt is self-contained: goal, context, what's been ruled out, what's expected back.
3. **Parallelise independent work.** Multiple Agent tool uses in one message run in parallel.
4. **Use the right tool.** Don't spawn `general-purpose` when `Explore` (read-only, faster) will do.
5. **Verify before declaring done.** Trust-but-verify: read the actual diff after every code-writing agent finishes.
6. **Background long-running work.** If an agent will take >2 min and we have other work to do, run it in the background.
7. **Stop the orchestrator from coding** when a subagent's lane covers it. The orchestrator's job is to plan, brief, verify, and synthesise — not to do the typing.

---

## 5. Adding a new agent

1. Decide its lane. If an existing agent already covers it, extend that agent's definition rather than spawning a new one.
2. Write `.claude/agents/<name>.md` with: name, description, tools, model (typically `sonnet`; use `haiku` for high-frequency lightweight work, `opus` only for deep reasoning), and a clear system prompt.
3. Register it in this file's roster table (section 1).
4. Add an orchestration pattern (section 2) if it changes existing workflows.
5. Define the handoff contract (section 3).

---

## 6. Model strategy

| Lane | Default model | Why |
|---|---|---|
| Orchestrator (this thread) | Opus 4.7 | Multi-step planning + cross-domain synthesis |
| `master-researcher` | Sonnet 4.6 | Long research with cheap web fetching |
| `game-dev`, `finance-sim`, `multiplayer-engineer`, `db-engineer`, `ai-tutor-engineer` | Sonnet 4.6 | Code-heavy |
| `quest-writer`, `npc-author`, `i18n-curator` | Sonnet 4.6 | Creative + structured |
| `art-curator` | Haiku 4.5 | Lightweight web searches + manifest writing |
| `a11y-reviewer`, `perf-budgeteer`, `security-reviewer` | Sonnet 4.6 | Audit work; opt to Opus for deep dives |
| `Explore` | Haiku 4.5 | Fast read-only |
| `Plan` | Opus 4.7 | Architecture |

---

## 7. Master's Margin Note

This roster is intentionally small (14 specialised + 3 built-in). Each agent has one clear lane. The orchestrator owns synthesis and shipping — no agent ever decides on its own what to merge.

We deviate from a more typical engineering-only roster by adding `quest-writer`, `npc-author`, `art-curator`, `level-designer`, `i18n-curator`, and `master-researcher` — because this project is half game design, half engineering, and the design lanes need first-class agent representation.
