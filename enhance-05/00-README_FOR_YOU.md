# Enhancement Pack 05 — EDF Copilot Bootcamp

This pack focuses on **reducing friction** in the student experience and **extending coverage** beyond Week 1.

**Optimized for:** VS Code + GitHub Copilot Enterprise Chat (Claude Opus 4.5) with concurrent subagents via `runSubagent`.

---

## What you do (you = Coordinator / Lead)

### Step 0 — Prepare your working branch
```bash
git checkout main
git pull origin main
git checkout -b enhance/bootcamp-enhance-05
```

### Step 1 — Paste the kickoff prompt into Copilot
1. Open **`01-KICKOFF_PROMPT.md`** from this pack.
2. Copy the entire content and paste it into **Copilot Chat** (your main chat, not a subagent).
3. Follow the instructions to spawn subagents using `runSubagent`.

✅ **Key file to begin:** `01-KICKOFF_PROMPT.md`

### Step 2 — Spawn subagents using `runSubagent` command
Use the `runSubagent` tool to spawn agents concurrently. Create subagents with these names and feed them their instruction files from `AGENTS/`:

| Agent | File | Phase | Can Run Concurrently With |
|-------|------|-------|---------------------------|
| `E12_RUNNER_PROGRESS` | `AGENTS/E12_RUNNER_PROGRESS.md` | 1 | — (foundation) |
| `E13_BACKUP_RESTORE` | `AGENTS/E13_BACKUP_RESTORE.md` | 2 | E14 |
| `E14_EXTENDED_ALERTS` | `AGENTS/E14_EXTENDED_ALERTS.md` | 2 | E13 |
| `E15_WEEK2-4_TIEBACKS` | `AGENTS/E15_WEEK2-4_TIEBACKS.md` | 3 | — (large scope) |
| `E16_SIGNAL_AUTOMATION` | `AGENTS/E16_SIGNAL_AUTOMATION.md` | 4 | E17, E18 |
| `E17_TECH_DEBT_CLEANUP` | `AGENTS/E17_TECH_DEBT_CLEANUP.md` | 4 | E16, E18 |
| `E18_PATH_NORMALIZATION` | `AGENTS/E18_PATH_NORMALIZATION.md` | 4 | E16, E17 |
| `E19_VALIDATION_CONSOLIDATION` | `AGENTS/E19_VALIDATION_CONSOLIDATION.md` | 5 | E20, E21 |
| `E20_ERROR_RECOVERY_PLAYBOOK` | `AGENTS/E20_ERROR_RECOVERY_PLAYBOOK.md` | 5 | E19, E21 |
| `E21_LAB_ID_AUTODISCOVERY` | `AGENTS/E21_LAB_ID_AUTODISCOVERY.md` | 5 | E19, E20 |
| `E22_DRY_RUN_MODE` | `AGENTS/E22_DRY_RUN_MODE.md` | 5 | E19, E20, E21 |
| `E08v2_QA_VALIDATION` | `AGENTS/E08v2_QA_VALIDATION.md` | 6 | — (final) |

### Step 3 — Integrate output (strict gate)
Every agent must produce:
1. A **unified diff** (or discrete commits) limited to its file-ownership scope.
2. A work log file under: `enhance-05/WORK_PRODUCTS/Exx_<scope>_WORKLOG.md`
3. A signal file under: `enhance-05/WORK_PRODUCTS/SIGNALS/Exx_COMPLETE.signal`

Integrate in **phase order** using `CHECKLISTS/`.

---

## Golden rules (avoid chaos)
1. **File ownership is absolute.** Request Coordinator for out-of-scope changes.
2. **No renames** unless explicitly assigned.
3. **Diffs over prose.** Patches + verification commands.
4. **No "drive-by" fixes.** Focus on assigned scope only.
5. **Every phase ends with a verification gate.**
6. **Use `runSubagent` for concurrent agent execution.**
7. **Capture insights in `enhance-05-extra.md`** at each phase completion.

---

## Concurrency Map (use `runSubagent` for parallel execution)

```
PHASE 1 (Runner Integration) — FOUNDATION
└── E12_RUNNER_PROGRESS ───────────────────► Phase 1 Gate
    🔍 Post-phase: Capture insights → enhance-05-extra.md

PHASE 2 (Data Safety + Alerts) — CONCURRENT via runSubagent
├── E13_BACKUP_RESTORE ────┐
│                          ├──────────────► Phase 2 Gate
└── E14_EXTENDED_ALERTS ───┘
    🔍 Post-phase: Capture insights → enhance-05-extra.md

PHASE 3 (Content Extension)
└── E15_WEEK2-4_TIEBACKS ──────────────────► Phase 3 Gate
    🔍 Post-phase: Capture insights → enhance-05-extra.md

PHASE 4 (Tooling) — CONCURRENT via runSubagent
├── E16_SIGNAL_AUTOMATION ─┐
├── E17_TECH_DEBT_CLEANUP ─┼──────────────► Phase 4 Gate
└── E18_PATH_NORMALIZATION ┘
    🔍 Post-phase: Capture insights → enhance-05-extra.md

PHASE 5 (Extended Tooling) — CONCURRENT via runSubagent
├── E19_VALIDATION_CONSOL ─┐
├── E20_ERROR_RECOVERY ────┼
├── E21_LAB_ID_AUTODISCOV ─┼──────────────► Phase 5 Gate
└── E22_DRY_RUN_MODE ──────┘
    🔍 Post-phase: Capture insights → enhance-05-extra.md

PHASE 6 (Final Validation)
└── E08v2_QA_VALIDATION ───────────────────► Final Gate
    🔍 Final insights → enhance-05-extra.md
```

---

## Files in this pack
- `01-KICKOFF_PROMPT.md` — **paste into Copilot to start**
- `02-COORDINATOR_RUNBOOK.md` — sequencing and merge strategy
- `03-FILE_OWNERSHIP_MATRIX.md` — conflict-avoidance contract
- `AGENTS/*.md` — instructions per subagent
- `CHECKLISTS/*.md` — phase gates and acceptance tests
- `SCAFFOLDS/` — helper scripts and templates
- `PLAYBOOKS/` — error recovery and guidance
- `PACKAGE_CHANGES/` — package.json change queue
- `WORK_PRODUCTS/` — agent output logs and signals

---

## Insight Capture Protocol

**IMPORTANT:** After each phase completion, update `enhance-05-extra.md` with:
1. What worked well
2. What didn't work
3. Missed opportunities discovered
4. Recommendations for enhance-06

This continuous insight capture ensures learnings are not lost.
