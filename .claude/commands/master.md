---
description: Run the master skill to find proven patterns from documented masters of any domain and produce a research brief.
argument-hint: <goal-or-question>
allowed-tools: [Read, Write, Bash, WebSearch, WebFetch, Agent]
---

# /master — research-first execution

Invokes the **master skill** (`.claude/skills/master/SKILL.md`).

`$ARGUMENTS` = the goal or question (e.g., "build a daily-streak system that doesn't burn out users", "design Diwali seasonal events", "make Maya AI feel like a real teacher").

## How to run

1. Read `.claude/skills/master/SKILL.md` if you haven't this session.
2. Phase 1 — DECODE: extract context + goal from `$ARGUMENTS` and existing project docs (`docs/PRD.md` is the canonical context).
3. Phase 2 — DISCOVER: pick the right depth (quick/medium/deep based on scope).
4. Phase 3-4 — STUDY + EXTRACT: web research + synthesis.
5. **PAUSE** at the required pause point — present the master roster + meta-framework to the user, ask whether to execute.
6. Phase 5 — EXECUTE (only on user confirmation) — produce the deliverable.

The output research brief lives at `docs/research/<slug>.md` and gets cited in any PR that implements the resulting design.
