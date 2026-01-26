# 03-FILE_OWNERSHIP_MATRIX.md — Strict Boundaries (Minimize Merge Conflicts)

## Coordinator-only (global)
- `.vscode/tasks.json` (final canonical — may need updates after E01)
- Root-level navigation/index docs unless assigned
- Cross-scope conflict resolution
- Final merge commits
- `enhance-04/SCAFFOLDS/` (read-only reference for E01)

---

## Agent scopes

### E01_RUNNER_INTEGRATE
**Owns:**
- `bootcamp/` folder (entire new folder at repo root)
- `scripts/bootcamp.mjs`
- `package.json` (merge with existing if present)

**Reads (reference only):**
- `enhance-04/SCAFFOLDS/bootcamp.mjs` — Source runner script
- `enhance-04/SCAFFOLDS/package-scripts.json` — Scripts to merge
- `enhance-04/SCAFFOLDS/step-templates/` — YAML format reference

**Must NOT edit:**
- `.vscode/tasks.json` (request Coordinator if updates needed)
- Any `docs/**` files
- `.START_HERE.md`
- `enhance-04/SCAFFOLDS/*` (read-only reference)

---

### E02_EXTENSIONS_CONFIG
**Owns:**
- `.vscode/extensions.json` (create new)

**Must NOT edit:**
- `.vscode/tasks.json`
- `.vscode/settings.json`
- Any other files

---

### E03_PROGRESS_TRACKER
**Owns:**
- `docs/participants/PROGRESS_TRACKER.md` (create new)
- `docs/participants/README.md` (create if needed)

**May update (link insertion only):**
- `.START_HERE.md` (add link to progress tracker)
- Root `README.md` (add link to progress tracker)

**Must NOT edit:**
- Week/sprint docs
- Lab files

---

### E04_BROKEN_LINKS
**Owns:**
- All files listed in `cleanup-instructions.md` Phase 4.4 broken links table

**Scope:** Fix broken internal links ONLY — do not restructure content

**Files to fix (from cleanup-instructions):**
- `.START_HERE.md`
- `docs/content/sprint-02/README.md`
- `docs/content/sprint-02/SPRINT_2_PROGRAM.md`
- `docs/content/sprint-03/README.md`
- `docs/content/sprint-03/sprint-packet/BE_TASKS.md`
- `docs/content/sprint-03/sprint-packet/FE_TASKS.md`
- `docs/content/sprint-03/sprint-packet/README.md`
- `docs/content/sprint-04/sprint-packet/BE_TASKS.md`
- `docs/content/sprint-04/sprint-packet/FE_TASKS.md`
- `docs/content/sprint-04/sprint-packet/README.md`
- `docs/content/week-01/FAQ.md`
- `docs/content/week-01/WEEK_1_PROGRAM.md`
- `docs/content/week-01/micro-labs/LAB_2_SCAFFOLD_VERTICAL_SLICE.md`
- `docs/content/week-01/micro-labs/LAB_3_TESTS_FIRST.md`
- `docs/content/week-01/micro-labs/LAB_4_REFACTOR_GUARDED.md`
- `docs/content/week-01/micro-labs/LAB_5_OPENSHIFT_READINESS.md`
- `docs/content/week-01/micro-labs/LAB_6_CAPSTONE_MINI_FEATURE.md`
- `docs/content/week-04/templates/SPRINT_PACKET_TEMPLATE.md`

**Must NOT edit:**
- Content restructuring
- Navigation rails (E05 handles)
- Assessment framework (E06 handles)

---

### E05_LAB_TIEBACKS
**Owns:**
- `docs/content/week-01/micro-labs/LAB_0_SETUP.md`
- `docs/content/week-01/micro-labs/LAB_1_PLAN_ONLY.md`
- `docs/content/week-01/micro-labs/LAB_2_SCAFFOLD_VERTICAL_SLICE.md`
- `docs/content/week-01/micro-labs/LAB_3_TESTS_FIRST.md`
- `docs/content/week-01/micro-labs/LAB_4_REFACTOR_GUARDED.md`
- `docs/content/week-01/micro-labs/LAB_5_OPENSHIFT_READINESS.md`
- `docs/content/week-01/micro-labs/LAB_6_CAPSTONE_MINI_FEATURE.md`

**Scope:** Add tie-back/tie-forward sections ONLY

**Must NOT edit:**
- Links (E04 handles)
- Sprint docs
- Other week docs

**Coordination:** E04 may also touch these files for link fixes. E05 edits AFTER E04 completes, OR coordinate to avoid overlapping lines.

---

### E06_ASSESSMENT_FRAMEWORK
**Owns:**
- `docs/shared/ASSESSMENT_FRAMEWORK.md` (create new)

**May update (link insertion only):**
- `docs/shared/README.md` (add link to new framework)
- `.MASTER_BOOTCAMP.md` (add to reference materials section)

**Must NOT edit:**
- Week/sprint content
- Lab files
- FAQs

---

### E07_FAQ_CONSOLIDATION
**Owns:**
- `docs/content/week-03/WEEK_3_FAQ.md` (create new if missing)
- `docs/content/sprint-01/FAQ.md` (create new if missing)
- `docs/content/sprint-02/FAQ.md` (create new if missing)
- `docs/content/sprint-03/FAQ.md` (create new if missing)
- `docs/content/sprint-04/FAQ.md` (create new if missing)

**May update:**
- Existing FAQs (add cross-references)
- Week/sprint README files (add FAQ links)

**Must NOT edit:**
- Lab content
- Assessment framework
- Core program documents

---

### E08_QA_VALIDATION
**Owns:**
- `enhance-04/WORK_PRODUCTS/E08_QA_VALIDATION_WORKLOG.md`

**Read-only access to all files** — validation only, no edits

**Reports:** Link check results, navigation test results, runner test results

---

### E09_PROGRESSION_SYSTEM
**Owns:**
- `progress/` folder (entire new folder at repo root)
- `progress/README.md`
- `progress/STUDENT_TEMPLATE.md`
- `progress/scripts/init-student.mjs`
- `progress/scripts/update-progress.mjs`
- `progress/cohorts/` (student data structure)

**May update:**
- `package.json` (add progress:init, progress:update scripts)

**Must NOT edit:**
- `.START_HERE.md`
- Any `docs/**` files
- Bootcamp runner files (E01 owns)
- Dashboard scripts (E10 owns)

---

### E10_FACILITATOR_DASHBOARD
**Owns:**
- `progress/scripts/generate-dashboard.mjs`
- `progress/scripts/check-alerts.mjs`
- `progress/DASHBOARD*.md` (generated files)
- `.github/workflows/update-dashboard.yml`

**May update:**
- `package.json` (add progress:dashboard, progress:alerts scripts)

**Must NOT edit:**
- `progress/scripts/init-student.mjs` (E09 owns)
- `progress/scripts/update-progress.mjs` (E09 owns)
- Student progress files (cohort data)
- Any `docs/**` files

**Hard dependency:** E09 must complete first

---

### E11_COPILOT_COURSE_AGENT
**Owns:**
- `.github/instructions/student-navigation.instructions.md` (create new)
- `COPILOT_COURSE_COMMANDS.md` (create new at repo root)

**Must update:**
- `.github/copilot-instructions.md` (add Student Course Navigation section)

**Must NOT edit:**
- `progress/scripts/*` (E09/E10 own)
- `scripts/bootcamp.mjs` (E01 owns)
- Any `docs/**` files
- Lab content files

**Soft dependency:** E09 (progress system for commands to work)

---

## Conflict avoidance summary

| File/Path | Primary Owner | May Also Touch |
|-----------|---------------|----------------|
| `bootcamp/**` | E01 | — |
| `scripts/bootcamp.mjs` | E01 | — |
| `package.json` | E01 | E09, E10 (scripts only) |
| `.vscode/extensions.json` | E02 | — |
| `.vscode/tasks.json` | Coordinator | — |
| `.START_HERE.md` | E03 (link only) | E04 (link fix) |
| `docs/participants/**` | E03 | — |
| `docs/shared/ASSESSMENT_FRAMEWORK.md` | E06 | — |
| Week 1 labs | E05 (tie-backs) | E04 (link fix) |
| Sprint packet files | E04 (link fix) | E07 (FAQ link) |
| FAQ files | E07 | — |
| `progress/scripts/init-student.mjs` | E09 | — |
| `progress/scripts/update-progress.mjs` | E09 | — |
| `progress/scripts/generate-dashboard.mjs` | E10 | — |
| `progress/scripts/check-alerts.mjs` | E10 | — |
| `progress/DASHBOARD*.md` | E10 | — |
| `.github/workflows/update-dashboard.yml` | E10 | — |
| `.github/instructions/student-navigation.instructions.md` | E11 | — |
| `COPILOT_COURSE_COMMANDS.md` | E11 | — |
| `.github/copilot-instructions.md` | E11 (section add) | Coordinator (other sections) |
