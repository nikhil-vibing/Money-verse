---
description: Build out a new district end-to-end — research → art → level → NPCs → starter quests → perf gate.
argument-hint: <district-id>
allowed-tools: [Read, Edit, Write, Bash, Agent]
---

# /new-district — orchestrated district build

`$1` = district-id (e.g., `niveshak-chowk`).

You are the orchestrator. This is a Pattern A workflow from AGENTS.md §2.

## Steps

1. **Confirm** district exists in PRD §5; if not, stop and ask.

2. **Spawn `master-researcher`** (medium depth): grounded patterns for this district's themes — landing on a structured brief at `docs/research/district-$1.md`.

3. **In parallel, spawn:**
   - `art-curator` — OSS pixel-art asset hunt for tilesets + NPCs.
   - `npc-author` — NPC roster (8-12) with schedules + memory hooks.
   - `quest-writer` — preliminary quest list (5-8 quests, each one-concept).

4. After 3 lands, **spawn `level-designer`** — Tiled `.tmx` map for the district.

5. **Spawn `game-dev`** — wire the new `WorldScene` for the district; lazy-load assets.

6. **Spawn `finance-sim`** for any new math required by the planned quests (read the quest list).

7. **Spawn `ai-tutor-engineer`** — Maya scope manifest for the new district at `packages/content/maya/$1.json`.

8. **In parallel, spawn:**
   - `a11y-reviewer` — audit the new scene + dialog.
   - `i18n-curator` — HI translation keys queued.

9. **Spawn `perf-budgeteer`** — gate the merge against ARCHITECTURE.md §15.

10. **Summarise**: changed packages, opened files, pillars satisfied, perf report.
