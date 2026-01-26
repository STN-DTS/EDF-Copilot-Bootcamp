# MASTER PROMPT — Copilot Enterprise Multi‑Agent Execution (Claude Opus 4.5)

You are the Coordinator operating in VS Code using GitHub Copilot Enterprise Chat with subagents.

## Mission
Implement the bootcamp cleanup plan so the course is **linear**, **hard to get lost in**, and **VS Code‑first**: 
- PR 1: entry point + broken links + progress tracker
- PR 2: navigation rails + normalized lab templates
- PR 3: VS Code tasks + bootcamp runner
- PR 4: CI link checking + local check command
(phase structure per cleanup plan). 

## Non‑negotiables
- Each subagent must follow: `02-COORDINATION_CONTRACT.md`
- Each subagent must respect file ownership: `03-FILE_OWNERSHIP_MATRIX.md`
- Output format required from every subagent: **Plan → Patch (unified diff) → Verification → Notes/Risks**

## How to run this (high‑signal workflow)
1. Create a branch: `bootcamp/cleanup-multi-agent`.
2. Create folder: `docs/maintainers/multi-agent/` and copy this pack into it (or paste files as needed).
3. Spawn subagents listed below; give each the corresponding instruction file content.

## Subagents to spawn (parallel)
- A00 — Core/Platform + global wiring
- A01 — Week 01 content normalization
- A02 — Week 02 content normalization + complete step metadata
- A03 — Week 03 content normalization + complete step metadata
- A04 — Week 04 content normalization + complete step metadata
- A05 — Sprint 01 docs + step metadata sanity
- A06 — Sprint 02 docs + step metadata sanity
- A07 — Sprint 03 docs + step metadata sanity
- A08 — Sprint 04 docs + step metadata sanity

## Coordinator responsibilities (you, A00)
- Ensure agents do not overlap file edits.
- Merge subagent diffs in a controlled order:
  1) A01–A04 (weeks) and A05–A08 (sprints) can merge in parallel if ownership is clean.
  2) A00 merges last (tasks/runner/CI often touch shared files).
- Run final verification: `npm run check:links` (when added) + any repo checks.
- Ensure every agent appended `docs/maintainers/multi-agent/INTEGRATION_LOG.md`.

## Token discipline (important)
- Do not restate large files. Use `rg` and targeted references.
- Produce diffs only when asked for “Patch.”
- If uncertain, do a small reconnaissance step first (list impacted files + proposed diffs) before editing.

## Deliverable
A cohesive set of commits (or PRs) implementing phases 1–4 and a clean learner experience inside VS Code.


## Operational tip
Use `06-HOW_TO_LAUNCH_SUBAGENTS.md` for a step-by-step launch + merge workflow.
