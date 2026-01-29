# 01-KICKOFF_PROMPT.md — Coordinator Kickoff (Paste into Copilot Chat)

You are the **Coordinator agent** for Enhancement Pack 05 of the `EDF-Copilot-Bootcamp` repository.
This pack focuses on **reducing friction** in the student experience and **extending coverage** beyond Week 1.

We will execute work in parallel using **`runSubagent`** for concurrent subagent execution. Optimize for **maximum throughput** and **minimal merge conflicts**.

---

## Non‑negotiables (must follow)
- Output style for all agents: **Plan (brief) → Patch (unified diff) → Verification commands → Notes/Risks (brief)**.
- **Diffs are required** for all changes. Avoid narrative unless it reduces risk.
- **File ownership rules are absolute.** No agent edits files outside its assigned ownership.
- **No renames** unless explicitly assigned.
- Every agent must create a work log file: `enhance-05/WORK_PRODUCTS/Exx_<scope>_WORKLOG.md`.
- Every agent must create a signal file: `enhance-05/WORK_PRODUCTS/SIGNALS/Exx_COMPLETE.signal`.
- **After each phase**, capture insights in `enhance-05-extra.md` at repo root.

---

## Source of truth
- `enhance-05.md` — enhancement objectives and agent specs
- `enhance-04-extra.md` — lessons learned from prior iteration
- `enhance-04/` — patterns and templates to follow
- existing infrastructure under `scripts/`, `progress/`, `bootcamp/`

---

## Objective (what "done" looks like)
1. Single command to start lab + mark progress (`npm run bootcamp -- step X --mark-started`)
2. Progress backup/restore system functional
3. Extended alert thresholds (inactive 7+ days, long-running labs)
4. Week 2-4 labs have tie-back/tie-forward sections
5. Signal file automation helper script
6. Technical debt cleanup (lab ID mappings, cohort format flexibility)
7. Cross-platform path normalization in all scripts
8. Consolidated validation command (`npm run validate:all`)
9. Error recovery playbook for agents
10. Lab ID auto-discovery from YAML
11. Dry-run mode on all modification scripts

---

# Step 1 — Confirm repo reconnaissance (Coordinator)
Before spawning subagents, do a fast scan and report:

1. Confirm enhance-04 deliverables exist:
   - `scripts/bootcamp.mjs` exists
   - `bootcamp/steps/` folder exists with YAML files
   - `progress/scripts/` folder exists with init, update, dashboard, alerts scripts
   - `.vscode/extensions.json` exists

2. Confirm enhance-05 targets do NOT yet exist:
   - `progress/scripts/backup-cohort.mjs` does NOT exist
   - `progress/backups/` folder does NOT exist
   - `scripts/validate-all.mjs` does NOT exist

3. Run health checks:
   ```bash
   npm run bootcamp:list
   npm run progress:alerts -- --cohort 2026-01
   ```

4. Verify Week 2-4 labs exist and need tie-backs

**Your output now:**
- A 20-line "Current State Report"
- Confirmation to proceed with agent spawning
- Initial insights for `enhance-05-extra.md`

---

# Step 2 — Spawn subagents using `runSubagent`

Use the `runSubagent` tool for concurrent execution. Each agent should receive the full content of their instruction file from `AGENTS/`.

## PHASE 1 — Foundation (sequential, required first)
| Agent | File | Scope |
|-------|------|-------|
| E12_RUNNER_PROGRESS | `AGENTS/E12_RUNNER_PROGRESS.md` | Integrate runner + progress flags |

**After Phase 1:** 
- Run Phase 1 checklist
- Capture insights in `enhance-05-extra.md`

## PHASE 2 — Data Safety + Alerts (run concurrently via `runSubagent`)
```
Use runSubagent to spawn E13 and E14 concurrently:
```
| Agent | File | Scope |
|-------|------|-------|
| E13_BACKUP_RESTORE | `AGENTS/E13_BACKUP_RESTORE.md` | Progress backup/restore system |
| E14_EXTENDED_ALERTS | `AGENTS/E14_EXTENDED_ALERTS.md` | Extended alert thresholds |

**After Phase 2:**
- Run Phase 2 checklist
- Capture insights in `enhance-05-extra.md`

## PHASE 3 — Content Extension (large scope, sequential)
| Agent | File | Scope |
|-------|------|-------|
| E15_WEEK2-4_TIEBACKS | `AGENTS/E15_WEEK2-4_TIEBACKS.md` | Add tie-backs to Week 2-4 labs |

**After Phase 3:**
- Run Phase 3 checklist
- Capture insights in `enhance-05-extra.md`

## PHASE 4 — Tooling (run all 3 concurrently via `runSubagent`)
```
Use runSubagent to spawn E16, E17, E18 concurrently:
```
| Agent | File | Scope |
|-------|------|-------|
| E16_SIGNAL_AUTOMATION | `AGENTS/E16_SIGNAL_AUTOMATION.md` | Signal file helper script |
| E17_TECH_DEBT_CLEANUP | `AGENTS/E17_TECH_DEBT_CLEANUP.md` | Fix hardcoded mappings |
| E18_PATH_NORMALIZATION | `AGENTS/E18_PATH_NORMALIZATION.md` | Cross-platform path handling |

**After Phase 4:**
- Run Phase 4 checklist
- Capture insights in `enhance-05-extra.md`

## PHASE 5 — Extended Tooling (run all 4 concurrently via `runSubagent`)
```
Use runSubagent to spawn E19, E20, E21, E22 concurrently:
```
| Agent | File | Scope |
|-------|------|-------|
| E19_VALIDATION_CONSOLIDATION | `AGENTS/E19_VALIDATION_CONSOLIDATION.md` | Unified validation command |
| E20_ERROR_RECOVERY_PLAYBOOK | `AGENTS/E20_ERROR_RECOVERY_PLAYBOOK.md` | Agent error recovery docs |
| E21_LAB_ID_AUTODISCOVERY | `AGENTS/E21_LAB_ID_AUTODISCOVERY.md` | Dynamic lab name resolution |
| E22_DRY_RUN_MODE | `AGENTS/E22_DRY_RUN_MODE.md` | Add --dry-run to all scripts |

**After Phase 5:**
- Run Phase 5 checklist
- Capture insights in `enhance-05-extra.md`

## PHASE 6 — Validation (final, after all others)
| Agent | File | Scope |
|-------|------|-------|
| E08v2_QA_VALIDATION | `AGENTS/E08v2_QA_VALIDATION.md` | Comprehensive QA validation |

**After Phase 6:**
- Run Final checklist
- Complete `enhance-05-extra.md` with final insights
- Prepare enhance-06 recommendations

---

# Step 3 — Insight Capture Protocol

After each phase, update `enhance-05-extra.md` with:

```markdown
## Phase X Insights

### What Worked Well
- (list items)

### What Didn't Work
- (list items)

### Missed Opportunities
- (list items)

### Recommendations for enhance-06
- (list items)
```

This ensures continuous learning and improvement.

---

# Step 4 — Integration (strict gate per phase)

For each completed phase:
1. Verify all agents created work logs in `enhance-05/WORK_PRODUCTS/`
2. Verify all agents created signal files in `enhance-05/WORK_PRODUCTS/SIGNALS/`
3. Run phase-specific checklist from `CHECKLISTS/`
4. If package.json changes needed, check `PACKAGE_CHANGES/` folder
5. Capture insights in `enhance-05-extra.md`
6. Merge phase changes before proceeding to next phase

---

# Step 5 — Package.json Change Queue

Multiple agents may need to modify `package.json`. Use the change queue pattern:

1. Agents write their changes to `enhance-05/PACKAGE_CHANGES/{agentId}.json`
2. Coordinator merges all changes after phase completion
3. Verify with: `npm install && npm run bootcamp:list`

---

# Proceed when ready

Once you have:
- [ ] Confirmed enhance-04 deliverables exist
- [ ] Confirmed enhance-05 targets don't exist
- [ ] Run health checks successfully
- [ ] Created initial insights in `enhance-05-extra.md`

Then spawn Phase 1 agent (E12) and begin the enhancement cycle.

**Use `runSubagent` for all concurrent agent spawning.**
