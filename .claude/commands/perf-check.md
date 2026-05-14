---
description: Spawn perf-budgeteer to measure current performance against the budgets in ARCHITECTURE.md §15.
argument-hint: [surface]
allowed-tools: [Read, Bash, Agent]
---

# /perf-check — gate against perf budgets

Spawn the `perf-budgeteer` subagent. Pass:
- The surface to measure (`$1` or "all").
- Current budgets from `docs/ARCHITECTURE.md` §15.
- Whether this is a pre-merge gate (block on failure) or an exploratory audit.

Wait for the report. If any budget is breached, do not approve the PR.
