---
description: Spawn a11y-reviewer to audit the current branch's UI surfaces against WCAG 2.2 AA.
argument-hint: [surface-url-or-path]
allowed-tools: [Read, Bash, Agent]
---

# /a11y-check — WCAG 2.2 AA audit

Spawn `a11y-reviewer` with the surface to audit (`$1` or "all changed files in this PR"). Report findings ranked CRITICAL → LOW. Block merge on CRITICAL.
