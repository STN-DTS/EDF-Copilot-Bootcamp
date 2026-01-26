# Enhancement Pack 04 — EDF Copilot Bootcamp

This pack orchestrates **parallel subagent execution** to complete the remaining bootcamp enhancements identified in `cleanup-instructions.md` and `copilot-remarks.md`.

**Optimized for:** VS Code + GitHub Copilot Enterprise Chat (Claude Opus 4.5) with concurrent subagents.

---

## What you do (you = Coordinator / Lead)

### Step 0 — Prepare your working branch
```bash
git checkout main
git pull origin main
git checkout -b enhance/bootcamp-enhance-04
```

### Step 1 — Paste the kickoff prompt into Copilot
1. Open **`01-KICKOFF_PROMPT.md`** from this pack.
2. Copy the entire content and paste it into **Copilot Chat** (your main chat, not a subagent).
3. Follow the instructions to spawn subagents.

✅ **Key file to begin:** `01-KICKOFF_PROMPT.md`

### Step 2 — Spawn subagents and feed them their instruction files
Create subagents with these names and paste corresponding files from `AGENTS/`:

| Agent | File | Phase | Can Run Concurrently With |
|-------|------|-------|---------------------------|
| `E01_RUNNER_INTEGRATE` | `AGENTS/E01_RUNNER_INTEGRATE.md` | 1 | E02 |
| `E02_EXTENSIONS_CONFIG` | `AGENTS/E02_EXTENSIONS_CONFIG.md` | 1 | E01 |
| `E03_PROGRESS_TRACKER` | `AGENTS/E03_PROGRESS_TRACKER.md` | 2 | E04 |
| `E04_BROKEN_LINKS` | `AGENTS/E04_BROKEN_LINKS.md` | 2 | E03 |
| `E05_LAB_TIEBACKS` | `AGENTS/E05_LAB_TIEBACKS.md` | 3 | E06, E07 |
| `E06_ASSESSMENT_FRAMEWORK` | `AGENTS/E06_ASSESSMENT_FRAMEWORK.md` | 3 | E05, E07 |
| `E07_FAQ_CONSOLIDATION` | `AGENTS/E07_FAQ_CONSOLIDATION.md` | 3 | E05, E06 |
| `E08_QA_VALIDATION` | `AGENTS/E08_QA_VALIDATION.md` | 5 | — (final) |
| `E09_PROGRESSION_SYSTEM` | `AGENTS/E09_PROGRESSION_SYSTEM.md` | 2.5 | E10 |
| `E10_FACILITATOR_DASHBOARD` | `AGENTS/E10_FACILITATOR_DASHBOARD.md` | 3.5 | — (depends on E09) |
| `E11_COPILOT_COURSE_AGENT` | `AGENTS/E11_COPILOT_COURSE_AGENT.md` | 4 | — (after content) |

### Step 3 — Integrate output (strict gate)
Every agent must produce:
1. A **unified diff** (or discrete commits) limited to its file-ownership scope.
2. A work log file under: `enhance-04/WORK_PRODUCTS/Exx_<scope>_WORKLOG.md`

Integrate in **phase order** using `CHECKLISTS/`.

---

## Golden rules (avoid chaos)
1. **File ownership is absolute.** Request Coordinator for out-of-scope changes.
2. **No renames** unless explicitly assigned.
3. **Diffs over prose.** Patches + verification commands.
4. **No "drive-by" fixes.** Focus on assigned scope only.
5. **Every phase ends with a verification gate.**

---

## Concurrency Map

```
PHASE 1 (Infrastructure)
├── E01_RUNNER_INTEGRATE ──┐
│                          ├──► Phase 1 Gate
└── E02_EXTENSIONS_CONFIG ─┘

PHASE 2 (Entry + Links)
├── E03_PROGRESS_TRACKER ──┐
│                          ├──► Phase 2 Gate
└── E04_BROKEN_LINKS ──────┘

PHASE 2.5 (Student Progression)
├── E09_PROGRESSION_SYSTEM ─┐
│                           ├──► Phase 2.5 Gate
└── E10_FACILITATOR_DASHBOARD ┘ (E10 depends on E09)

PHASE 3 (Content Enhancement) — All 3 run concurrently
├── E05_LAB_TIEBACKS ──────┐
├── E06_ASSESSMENT_FRAMEWORK│──► Phase 3 Gate
└── E07_FAQ_CONSOLIDATION ─┘

PHASE 4 (Copilot Integration)
└── E11_COPILOT_COURSE_AGENT ──► Phase 4 Gate

PHASE 5 (Validation)
└── E08_QA_VALIDATION ─────────► Final Gate
```

---

## Files in this pack
- `01-KICKOFF_PROMPT.md` — **paste into Copilot to start**
- `02-COORDINATOR_RUNBOOK.md` — sequencing and merge strategy
- `03-FILE_OWNERSHIP_MATRIX.md` — conflict-avoidance contract
- `AGENTS/*.md` — instructions per subagent
- `CHECKLISTS/*.md` — phase gates and acceptance tests
- `WORK_PRODUCTS/` — agent output logs
