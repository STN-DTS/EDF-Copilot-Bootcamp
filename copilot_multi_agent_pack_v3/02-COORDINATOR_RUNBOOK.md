# 02-COORDINATOR_RUNBOOK.md — Merge Strategy & Conflict Control

## Integration discipline
1. Phase-gated merges only (do not jump ahead).
2. Work-product logs required before accepting a merge.
3. Coordinator owns global files; agents own their scopes.

## Minimal acceptance tests per phase
Phase 1: README + Start Here + Progress Tracker links.
Phase 2/3: Nav rails everywhere; lab template conformity.
Phase 4: Runner lists/prints steps; tasks run.
Phase 5: CI fails on broken internal links.
Phase 6: End-to-end navigation passes.

## Token optimization tactics
- Prefer diff-only outputs.
- Enforce strict ownership.
- Use checklists; avoid long discussions.
