# 02-COORDINATOR_RUNBOOK.md — Merge Strategy & Conflict Control

## Integration discipline
1. **Phase-gated merges only** — do not jump ahead.
2. **Work-product logs required** before accepting a merge.
3. **Coordinator owns global files**; agents own their scopes.
4. **Test after each phase** — don't accumulate untested changes.

---

## Phase execution order

```
Phase 1: Infrastructure (E01, E02) — CONCURRENT
    ↓
  Gate 1 check
    ↓
Phase 2: Entry + Links (E03, E04) — CONCURRENT  
    ↓
  Gate 2 check
    ↓
Phase 2.5: Student Progression (E09, then E10) — SEQUENTIAL
    ↓
  Gate 2.5 check
    ↓
Phase 3: Content (E05, E06, E07) — ALL 3 CONCURRENT
    ↓
  Gate 3 check
    ↓
Phase 4: Copilot Integration (E11) — SEQUENTIAL
    ↓
  Gate 4 check
    ↓
Phase 5: Validation (E08) — SEQUENTIAL (final)
    ↓
  Final Gate
```

---

## Minimal acceptance tests per phase

### Phase 1: Infrastructure Ready
```bash
npm install
npm run bootcamp:list
# Expect: list of step IDs printed
npm run bootcamp -- step week-01-lab-00
# Expect: step details printed without error
```
Also verify:
- `.vscode/extensions.json` exists
- VS Code shows extension recommendations on folder open

### Phase 2: Entry + Links Fixed
```bash
npm run check:links
# Expect: 0 broken internal links
```
Also verify:
- Progress tracker linked from `.START_HERE.md`
- All links in cleanup-instructions table now resolve

### Phase 2.5: Student Progression Ready
```bash
# Initialize a test student
npm run progress:init -- --name "Test Student" --github teststudent --cohort test --track backend
# Expect: test student file created

# Generate dashboard
npm run progress:dashboard -- --cohort test
# Expect: dashboard generated

# Check alerts
npm run progress:alerts -- --cohort test
# Expect: alert report generated

# Cleanup test data
rm -rf progress/cohorts/test
rm progress/DASHBOARD_test.md 2>/dev/null
```
Also verify:
- `progress/scripts/init-student.mjs` exists
- `progress/scripts/update-progress.mjs` exists
- `progress/scripts/generate-dashboard.mjs` exists

### Phase 3: Content Enhanced
Manual checks:
- [ ] Lab 0-6 each have "🔙 Building On" section
- [ ] Lab 0-6 each have "🔜 Looking Ahead" section
- [ ] `docs/shared/ASSESSMENT_FRAMEWORK.md` exists with skill matrix
- [ ] Week 3 FAQ exists OR consolidated master FAQ covers it

### Phase 4: Final Validation
```bash
npm run check:links
npm run bootcamp:list
```
Plus manual navigation test:
- Start at `.START_HERE.md`
- Click through Week 1 → Lab 0 → Lab 1 → Lab 2 using only nav rails
- Verify all links work in markdown preview

**Plus Copilot instructions validation:**
- Verify `.github/copilot-instructions.md` has "Student Course Navigation" section
- Verify all paths referenced in copilot-instructions exist
- Manual Copilot Chat test: say "Start the bootcamp" and verify response

### Phase 4: Copilot Integration Ready
```bash
# Files exist
ls .github/instructions/student-navigation.instructions.md
ls COPILOT_COURSE_COMMANDS.md

# Copilot instructions updated
grep "Student Course Navigation" .github/copilot-instructions.md

# Quick reference exists
grep "Start the bootcamp" COPILOT_COURSE_COMMANDS.md
```
Plus manual Copilot Chat test:
- Open Copilot Chat and say "Start the bootcamp"
- Verify Copilot responds with onboarding guidance

---

## Cross-Agent Communication Protocol

Agents run in isolation but may need to coordinate:

### Signal File Pattern
Agents can leave signals in `enhance-04/WORK_PRODUCTS/SIGNALS/`:

```
SIGNALS/
├── E01_COMPLETE.signal       # Created when E01 finishes
├── E09_PROGRESS_READY.signal # E10 waits for this before starting
└── E04_LINKS_FIXED.signal    # Signals to E08 that links are resolved
```

### Signal File Format
```markdown
# E01_COMPLETE.signal
timestamp: 2026-01-20T14:30:00Z
status: SUCCESS | PARTIAL | FAILED
files_modified:
  - bootcamp/steps/week-01/lab-00.yaml
  - package.json
notes: |
  All step YAML files created. 
  Minor issue: Week 3 steps deferred to next iteration.
```

### Dependency Chain
```
E01 ──► (no deps)
E02 ──► (no deps)
E03 ──► E01 (needs bootcamp runner for progress)
E04 ──► (no deps)
E09 ──► (no deps, but benefits from E03)
E10 ──► E09 (HARD dep: needs progress folder)
E05 ──► (no deps)
E06 ──► (no deps)
E07 ──► (no deps)
E11 ──► E09 (needs progress system for commands)
E08 ──► ALL (final validation)
```

### Escalation Path
If an agent is blocked waiting for another:
1. Check `SIGNALS/` for completion status
2. If signal missing after gate timeout, escalate to Coordinator
3. Coordinator may run partial validation and proceed

---

## Conflict resolution protocol

| Scenario | Resolution |
|----------|------------|
| Two agents edit same file | Coordinator manually merges; file owner has priority |
| Agent needs out-of-scope edit | Agent requests Coordinator; Coordinator applies |
| Link fix cascades to multiple scopes | E04 owns link fixes; coordinates with affected agents |
| YAML schema disagreement | E01 owns schema; others adapt |

---

## Token optimization tactics
- Prefer diff-only outputs
- Enforce strict ownership (reduces back-and-forth)
- Use checklists; avoid long discussions
- Agents should not repeat file contents they didn't change

---

## Rollback procedure
If a phase fails gate check:
1. Revert the phase merge: `git revert --no-commit HEAD~N..HEAD`
2. Identify failing agent(s)
3. Re-run agent with corrected instructions
4. Re-attempt phase merge
