# Phase 5 Checklist — QA Validation

## Agent in this phase
- E08_QA_VALIDATION

**Execution:** SEQUENTIAL (runs after all others)

**Prerequisite:** Phases 1, 2, 2.5, 3, and 4 all complete and merged

---

## Pre-flight Verification

Before running E08, verify infrastructure:
- [ ] Node.js available (`node --version`)
- [ ] Dependencies installed (`npm list --depth=0`)
- [ ] Git status clean (no uncommitted changes)
- [ ] Signal files present in `WORK_PRODUCTS/SIGNALS/`

---

## Pre-validation verification

Before running E08, confirm:
- [ ] Phase 1 checklist complete
- [ ] Phase 2 checklist complete
- [ ] Phase 2.5 checklist complete
- [ ] Phase 3 checklist complete
- [ ] Phase 4 checklist complete
- [ ] All 11 work logs exist (E01-E11)
- [ ] No pending merge conflicts

---

## E08 Validation Tasks

### Task 1: Link Check
- [ ] `npm run check:links` passes
- [ ] 0 broken internal links
- [ ] External link warnings documented (not blockers)

### Task 2: Runner Validation
- [ ] `npm run bootcamp:list` works
- [ ] `npm run bootcamp -- step week-01-lab-00` works
- [ ] `npm run bootcamp -- step week-01-lab-06` works
- [ ] `npm run bootcamp -- step sprint-01-step-00` works
- [ ] `npm run bootcamp -- step sprint-04-step-00` works

### Task 3: VS Code Integration
- [ ] Extensions recommendations appear
- [ ] Bootcamp tasks appear in task list
- [ ] Tasks execute without error

### Task 4: Navigation Smoke Test
- [ ] `.START_HERE.md` → Week 1 README works
- [ ] Lab 0 → Lab 1 → Lab 2 → Lab 3 → Lab 4 → Lab 5 → Lab 6 nav works
- [ ] Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 nav works

### Task 5: Content Validation
- [ ] Progress tracker exists and linked
- [ ] All 7 labs have tie-back sections
- [ ] All 7 labs have tie-forward sections
- [ ] Assessment framework exists and linked
- [ ] All 5 new FAQs exist and linked

### Task 6: Student Progression System
- [ ] `progress/scripts/init-student.mjs` exists
- [ ] `progress/scripts/update-progress.mjs` exists
- [ ] `progress/scripts/generate-dashboard.mjs` exists
- [ ] `progress/scripts/check-alerts.mjs` exists
- [ ] `npm run progress:init` works
- [ ] `npm run progress:update` works
- [ ] `npm run progress:dashboard` works
- [ ] `npm run progress:alerts` works

### Task 7: File Structure
- [ ] `bootcamp/steps/` structure correct
- [ ] `scripts/bootcamp.mjs` exists
- [ ] `.vscode/extensions.json` exists
- [ ] `docs/participants/PROGRESS_TRACKER.md` exists
- [ ] `docs/shared/ASSESSMENT_FRAMEWORK.md` exists
- [ ] `progress/` structure correct

### Task 8: Copilot Instructions Validation
- [ ] `.github/instructions/student-navigation.instructions.md` exists
- [ ] `COPILOT_COURSE_COMMANDS.md` exists at repo root
- [ ] `.github/copilot-instructions.md` has "Student Course Navigation" section
- [ ] All paths referenced in copilot-instructions.md exist
- [ ] Manual Copilot Chat test: "Start the bootcamp" works
- [ ] Manual Copilot Chat test: "Where did I leave off?" works

### Task 9: Rollback Drill (Optional)
- [ ] Created test file and committed
- [ ] Reverted commit successfully
- [ ] Verified clean git state after rollback

---

## E08 Output

- [ ] Work log exists: `enhance-04/WORK_PRODUCTS/E08_QA_VALIDATION_WORKLOG.md`
- [ ] Validation summary provided
- [ ] Any issues documented with severity
- [ ] Remediation recommendations provided (if needed)

---

## Issue handling

### If Critical issues found:
1. Stop merge process
2. Identify responsible agent
3. Run remediation
4. Re-run E08 validation

### If High issues found:
1. Document issue
2. Decide: fix now or document for follow-up
3. If fixing: run targeted remediation
4. Re-run affected validation tasks

### If Medium/Low issues found:
1. Document in work log
2. Create follow-up issues/tasks
3. Proceed with merge

---

## Final gate

Enhancement Pack 04 is complete when:
- [ ] E08 validation passes (no Critical/High issues)
- [ ] All 11 work logs exist (E01-E11)
- [ ] Coordinator has reviewed all changes
- [ ] Final commit message prepared
- [ ] PR ready for review

---

## Rollback Procedure

If final gate fails:
```bash
# Full rollback
git reset --hard origin/main

# Partial rollback (keep completed phases)
git revert --no-commit HEAD~N..HEAD
# Where N = number of commits to revert
```

---

## Commit message template

```
feat(enhance-04): Complete bootcamp enhancement pack

Phase 1 - Infrastructure:
- Integrated bootcamp runner and YAML step metadata
- Added VS Code extension recommendations

Phase 2 - Entry + Links:
- Created participant progress tracker
- Fixed 35+ broken internal links

Phase 2.5 - Student Progression:
- Created individual student progress tracking system
- Created facilitator dashboard and alerts

Phase 3 - Content:
- Added tie-back/tie-forward sections to Week 1 labs
- Created assessment framework
- Created FAQs for Week 3 and Sprints 1-4

Validation:
- All link checks pass
- Navigation smoke test pass
- Runner commands verified
- Progression system verified

Phase 4 - Copilot Integration:
- Added Copilot course interaction instructions
- Created student navigation patterns

Co-authored-by: E01_RUNNER_INTEGRATE
Co-authored-by: E02_EXTENSIONS_CONFIG
Co-authored-by: E03_PROGRESS_TRACKER
Co-authored-by: E04_BROKEN_LINKS
Co-authored-by: E05_LAB_TIEBACKS
Co-authored-by: E06_ASSESSMENT_FRAMEWORK
Co-authored-by: E07_FAQ_CONSOLIDATION
Co-authored-by: E08_QA_VALIDATION
Co-authored-by: E09_PROGRESSION_SYSTEM
Co-authored-by: E10_FACILITATOR_DASHBOARD
Co-authored-by: E11_COPILOT_COURSE_AGENT
```
