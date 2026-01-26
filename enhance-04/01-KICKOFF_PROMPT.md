# 01-KICKOFF_PROMPT.md — Coordinator Kickoff (Paste into Copilot Chat)

You are the **Coordinator agent** for Enhancement Pack 04 of the `EDF-Copilot-Bootcamp` repository.
This pack completes remaining enhancements identified in `cleanup-instructions.md` and `copilot-remarks.md`.

We will execute work in parallel using Copilot Enterprise **subagents**. Optimize for **maximum throughput** and **minimal merge conflicts**.

---

## Non‑negotiables (must follow)
- Output style for all agents: **Plan (brief) → Patch (unified diff) → Verification commands → Notes/Risks (brief)**.
- **Diffs are required** for all changes. Avoid narrative unless it reduces risk.
- **File ownership rules are absolute.** No agent edits files outside its assigned ownership.
- **No renames** unless explicitly assigned.
- Every agent must create a work log file: `enhance-04/WORK_PRODUCTS/Exx_<scope>_WORKLOG.md`.

---

## Source of truth
- `cleanup-instructions.md` — phase plan, remaining tasks
- `copilot-remarks.md` — content gap analysis
- `bootcamp_scaffolds_weeks1-4_sprints1-4/` — scaffolds to integrate
- existing docs under `docs/content/**`, `docs/shared/**`

---

## Objective (what "done" looks like)
1. Bootcamp runner + YAML steps integrated into main repo (not just scaffold folder)
2. `.vscode/extensions.json` in main `.vscode/` folder
3. Progress Tracker created and linked
4. All 35+ broken links from cleanup-instructions fixed
5. Tie-backs/tie-forwards added to Week 1 labs
6. Assessment framework created
7. FAQs consolidated or created for missing weeks/sprints
8. Individual student progression tracking system with CLI
9. Facilitator dashboard for cohort overview

---

# Step 1 — Confirm repo reconnaissance (Coordinator)
Before spawning subagents, do a fast scan and report:

1. Confirm `bootcamp_scaffolds_weeks1-4_sprints1-4/` contains:
   - `bootcamp/steps/**` YAML files
   - `scripts/bootcamp.mjs`
   - `package.json`
   - `.vscode/extensions.json`

2. Confirm main repo does NOT yet have:
   - `bootcamp/` folder at root
   - `scripts/bootcamp.mjs` at root
   - `.vscode/extensions.json`

3. Confirm `docs/participants/PROGRESS_TRACKER.md` does NOT exist

4. Sample 5 broken links from `cleanup-instructions.md` and verify they are still broken

**Your output now:**
- A 15-line "Current State Report"
- Confirmation to proceed with agent spawning

---

# Step 2 — Spawn subagents (parallel execution by phase)

## PHASE 1 — Infrastructure (run concurrently)
| Agent | File | Scope |
|-------|------|-------|
| E01_RUNNER_INTEGRATE | `AGENTS/E01_RUNNER_INTEGRATE.md` | Copy runner/steps from scaffold to main |
| E02_EXTENSIONS_CONFIG | `AGENTS/E02_EXTENSIONS_CONFIG.md` | Copy extensions.json to main .vscode/ |

## PHASE 2 — Entry + Links (run concurrently after Phase 1)
| Agent | File | Scope |
|-------|------|-------|
| E03_PROGRESS_TRACKER | `AGENTS/E03_PROGRESS_TRACKER.md` | Create progress tracker + link it |
| E04_BROKEN_LINKS | `AGENTS/E04_BROKEN_LINKS.md` | Fix all 35+ broken links |

## PHASE 2.5 — Student Progression (E09 first, then E10)
| Agent | File | Scope |
|-------|------|-------|
| E09_PROGRESSION_SYSTEM | `AGENTS/E09_PROGRESSION_SYSTEM.md` | Create individual student progress tracking with CLI |
| E10_FACILITATOR_DASHBOARD | `AGENTS/E10_FACILITATOR_DASHBOARD.md` | Create cohort dashboard and alerts (depends on E09) |

## PHASE 3 — Content Enhancement (run all 3 concurrently after Phase 2.5)
| Agent | File | Scope |
|-------|------|-------|
| E05_LAB_TIEBACKS | `AGENTS/E05_LAB_TIEBACKS.md` | Add tie-backs/tie-forwards to Week 1 labs |
| E06_ASSESSMENT_FRAMEWORK | `AGENTS/E06_ASSESSMENT_FRAMEWORK.md` | Create assessment framework doc |
| E07_FAQ_CONSOLIDATION | `AGENTS/E07_FAQ_CONSOLIDATION.md` | Consolidate/create FAQs |

## PHASE 4 — Copilot Integration (after content)
| Agent | File | Scope |
|-------|------|-------|
| E11_COPILOT_COURSE_AGENT | `AGENTS/E11_COPILOT_COURSE_AGENT.md` | Enable student course interaction via Copilot Chat |

## PHASE 5 — Validation (after all others)
| Agent | File | Scope |
|-------|------|-------|
| E08_QA_VALIDATION | `AGENTS/E08_QA_VALIDATION.md` | Run link check + navigation test + progression test + Copilot instructions validation |

**Do not let agents start editing until they complete their "Recon Gate"** (defined in their files).

---

# Step 3 — Integration order (phase gates)

## Phase 1 Gate: Infrastructure Ready
- [ ] `bootcamp/steps/` exists at repo root with YAML files
- [ ] `scripts/bootcamp.mjs` exists and runs
- [ ] `package.json` has bootcamp scripts
- [ ] `.vscode/extensions.json` exists
- [ ] `npm run bootcamp:list` works

Merge outputs from: **E01_RUNNER_INTEGRATE**, **E02_EXTENSIONS_CONFIG**

## Phase 2 Gate: Entry + Links Fixed
- [ ] Progress tracker exists and linked from `.START_HERE.md`
- [ ] All 35+ broken links from cleanup-instructions are fixed
- [ ] Link check passes (0 broken internal links)

Merge outputs from: **E03_PROGRESS_TRACKER**, **E04_BROKEN_LINKS**

## Phase 2.5 Gate: Student Progression Ready
- [ ] `progress/` folder exists with correct structure
- [ ] All 4 progress scripts exist (init, update, dashboard, alerts)
- [ ] `npm run progress:init` works
- [ ] `npm run progress:dashboard` works
- [ ] E09_PROGRESS_READY.signal file exists

Merge outputs from: **E09_PROGRESSION_SYSTEM** (first), then **E10_FACILITATOR_DASHBOARD**

## Phase 3 Gate: Content Enhanced
- [ ] All 7 Week 1 labs have tie-back and tie-forward sections
- [ ] `docs/shared/ASSESSMENT_FRAMEWORK.md` exists
- [ ] FAQs exist or consolidated for Weeks 2-4 and Sprints

Merge outputs from: **E05_LAB_TIEBACKS**, **E06_ASSESSMENT_FRAMEWORK**, **E07_FAQ_CONSOLIDATION**

## Phase 4 Gate: Copilot Integration Ready
- [ ] `.github/instructions/student-navigation.instructions.md` exists
- [ ] `COPILOT_COURSE_COMMANDS.md` exists at repo root
- [ ] `.github/copilot-instructions.md` has "Student Course Navigation" section
- [ ] Manual Copilot Chat test: "Start the bootcamp" works

Merge output from: **E11_COPILOT_COURSE_AGENT**

## Phase 5 Gate: Final Validation
- [ ] Full link check passes
- [ ] Navigation smoke test (5 consecutive steps via rails)
- [ ] Runner prints steps correctly
- [ ] VS Code tasks load
- [ ] Progression system works end-to-end
- [ ] Copilot instructions validated

Run: **E08_QA_VALIDATION**

---

# Step 4 — Coordinator gate checks (after each phase)
After each phase merge, run:
1. `npm run bootcamp:list` (if Phase 1+ complete)
2. `npm run check:links` or manual link verification
3. Open `.START_HERE.md` in VS Code markdown preview
4. Navigate via rails across 3+ consecutive steps

Report:
- What phase completed
- What failed (if anything)
- The next phase to integrate

---

# Output required from you (Coordinator) after agents finish
When agents finish their tasks, you will:
1. List the produced work-product logs
2. List which files changed per agent
3. Identify any conflicts and how you resolved them
4. Run final verification commands and show results
5. Create summary commit message for the enhancement PR
