# Dhaniverse 2.0 — Roadmap

> Phased plan. Each phase ends with a public preview build. Pillar compliance (PRD §4) is checked at every phase gate.

---

## Phase 0 — Foundations (week 0–2)
- [x] Monorepo scaffold (apps/web, apps/game, apps/server, packages/*)
- [x] PRD + Architecture + Tech-stack + Masters research locked
- [x] Claude Code agents + commands wired
- [ ] CI green on lint + typecheck + test
- [ ] Preview deploys on every PR (Vercel for web/game; Fly for Colyseus)
- [ ] Better-Auth wired with magic-link login

## Phase 1 — Vertical slice: Chawl Mohalla (week 3–6)
- [ ] District 1 (Chawl Mohalla) hand-authored map
- [ ] 4 NPCs with schedules + memory
- [ ] 3 starter quests (Budget I, First Bank Account, EMI 101)
- [ ] `finance-sim`: compound, SIP, FD/RD, EMI (done above)
- [ ] HD-2D-lite pipeline: tilt-shift + bloom + point-light shaders
- [ ] Assist Mode toggle (slow ticks, hint NPCs)
- [ ] Skill tree shell + 1 branch (Budgeting)
- [ ] Daily streak + freeze mechanic
- [ ] Mobile responsive + touch controls

## Phase 2 — Banking & Income (week 7–10)
- [ ] District 2 (Bank Bazaar) + 5 quests
- [ ] District 3 (Karyalaya Park) + 5 quests
- [ ] Tax old vs new regime quest with branching outcomes
- [ ] EPF, gratuity, payslip puzzle
- [ ] Skill tree branches: Banking, Income
- [ ] Async multiplayer: visit friends' apartments, gifts

## Phase 3 — Investing (week 11–14)
- [ ] District 4 (Niveshak Chowk) + 8 quests
- [ ] Market simulator (historical playback + simulated future)
- [ ] SIP, ELSS, PPF, NPS quests
- [ ] Maya AI tutor live with cost cap + safety rails
- [ ] Sync room: Trading Floor weekly event

## Phase 4 — Protection & Hustle (week 15–18)
- [ ] District 5 (Rakshak Lane) — Insurance, emergency fund
- [ ] District 6 (Vyapaar Mandi) — Side-hustle + business sim
- [ ] Skill tree branches: Insurance, Entrepreneurship
- [ ] Chai-stall sim + scaling decision tree

## Phase 5 — Retirement & Long Arc (week 19–22)
- [ ] District 7 (Bhavishya Ghat) — NPS, estate planning
- [ ] Skill tree branch: Retirement
- [ ] Seasonal events (Diwali, FY-end, monsoon)
- [ ] Cooperative weekly challenges

## Phase 6 — Polish & Launch (week 23–26)
- [ ] Full a11y audit (WCAG 2.2 AA)
- [ ] Perf gate on every district (Moto G4 4G target)
- [ ] HI translation human-review pass
- [ ] Public beta → 1.0 launch
- [ ] Newsletter integration (weekly real-Indian-market summary tied to an in-game NPC)

## Post-launch (90-day plan)
- Player-authored quest editor (sandbox)
- Stock-market historical-backtest mode
- Achievement codex with art unlocks
- Additional locales: Tamil, Bengali, Marathi, Telugu
