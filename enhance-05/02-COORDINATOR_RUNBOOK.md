# 02-COORDINATOR_RUNBOOK.md — Merge Strategy & Conflict Control

## Integration discipline
1. **Phase-gated merges only** — do not jump ahead.
2. **Work-product logs required** before accepting a merge.
3. **Signal files required** before phase gate can pass.
4. **Coordinator owns global files**; agents own their scopes.
5. **Test after each phase** — don't accumulate untested changes.
6. **Capture insights** — update `enhance-05-extra.md` after every phase.
7. **Use `runSubagent`** — for all concurrent agent execution.

---

## Phase execution order

```
Phase 1: Foundation (E12) — SEQUENTIAL
    ↓
  Gate 1 check + Insight capture
    ↓
Phase 2: Data Safety + Alerts (E13, E14) — CONCURRENT via runSubagent
    ↓
  Gate 2 check + Insight capture
    ↓
Phase 3: Content Extension (E15) — SEQUENTIAL (large scope)
    ↓
  Gate 3 check + Insight capture
    ↓
Phase 4: Tooling (E16, E17, E18) — CONCURRENT via runSubagent
    ↓
  Gate 4 check + Insight capture
    ↓
Phase 5: Extended Tooling (E19, E20, E21, E22) — CONCURRENT via runSubagent
    ↓
  Gate 5 check + Insight capture
    ↓
Phase 6: Validation (E08v2) — SEQUENTIAL (final)
    ↓
  Final Gate + Complete insights
```

---

## Minimal acceptance tests per phase

### Phase 1: Runner + Progress Integration Ready
```bash
# Test unified command
npm run bootcamp -- step week-01-lab-02 --mark-started testuser --cohort test
# Expect: Step displayed AND progress marked

npm run bootcamp -- step week-01-lab-02 --mark-complete testuser --cohort test --pr 42
# Expect: Step displayed AND progress marked complete

# Backward compatibility
npm run bootcamp -- step week-01-lab-00
# Expect: Works without flags
```

**Insight Capture:** Update `enhance-05-extra.md` Phase 1 section

### Phase 2: Data Safety + Alerts Ready
```bash
# Test backup
npm run progress:backup -- --cohort 2026-01
# Expect: Backup created in progress/backups/

# Test restore (use dry-run if available)
npm run progress:backups -- --cohort 2026-01
# Expect: List of available backups

# Test extended alerts
npm run progress:alerts -- --cohort 2026-01
# Expect: Shows inactive/long-running alerts
```

**Insight Capture:** Update `enhance-05-extra.md` Phase 2 section

### Phase 3: Content Extension Ready
Manual checks:
- [ ] Week 2 labs have "🔙 Building On" section
- [ ] Week 2 labs have "🔜 Looking Ahead" section
- [ ] Week 3 labs have tie-back/forward sections
- [ ] Week 4 labs have tie-back/forward sections
- [ ] Cross-references are accurate

**Insight Capture:** Update `enhance-05-extra.md` Phase 3 section

### Phase 4: Tooling Ready
```bash
# Test signal automation
node enhance-05/SCAFFOLDS/create-signal.mjs E99 SUCCESS "Test signal"
# Expect: Signal file created

# Test path normalization
node scripts/bootcamp.mjs list
# Expect: Paths use forward slashes on all platforms

# Verify tech debt fixes
grep -r "labNames\s*=" progress/scripts/
# Expect: Dynamic loading, not hardcoded arrays
```

**Insight Capture:** Update `enhance-05-extra.md` Phase 4 section

### Phase 5: Extended Tooling Ready
```bash
# Test consolidated validation
npm run validate:all
# Expect: All validations run with PASS/FAIL summary

# Test dry-run mode
npm run progress:init -- --name "Test" --github dryruntest --cohort test --track backend --dry-run
# Expect: Shows what would happen, no files created

# Verify error recovery playbook exists
cat enhance-05/PLAYBOOKS/ERROR_RECOVERY.md
# Expect: Content with recovery procedures
```

**Insight Capture:** Update `enhance-05-extra.md` Phase 5 section

### Phase 6: Final Validation
```bash
npm run validate:all
npm run check:links
npm run bootcamp:list
```

Plus manual validation tests from E08v2 checklist.

**Insight Capture:** Complete `enhance-05-extra.md` with final insights

---

## Using `runSubagent` for Concurrent Execution

### How to spawn concurrent agents

When Phase calls for concurrent execution, use `runSubagent` tool:

```
Example for Phase 2 (E13 + E14 concurrent):

1. Invoke runSubagent with E13 agent instructions
2. Invoke runSubagent with E14 agent instructions (don't wait for E13)
3. Wait for both to complete
4. Verify both signal files exist
5. Run Phase 2 checklist
```

### Waiting for completion

After spawning concurrent agents:
1. Check `enhance-05/WORK_PRODUCTS/SIGNALS/` for completion signals
2. Read work logs for any issues
3. Resolve conflicts if any before proceeding

---

## Cross-Agent Communication Protocol

Agents run in isolation but may need to coordinate:

### Signal File Pattern
Agents create signals in `enhance-05/WORK_PRODUCTS/SIGNALS/`:

```
SIGNALS/
├── E12_COMPLETE.signal       # Phase 1 done
├── E13_COMPLETE.signal       # Phase 2 (concurrent)
├── E14_COMPLETE.signal       # Phase 2 (concurrent)
├── E15_COMPLETE.signal       # Phase 3 done
├── E16_COMPLETE.signal       # Phase 4 (concurrent)
├── E17_COMPLETE.signal       # Phase 4 (concurrent)
├── E18_COMPLETE.signal       # Phase 4 (concurrent)
├── E19_COMPLETE.signal       # Phase 5 (concurrent)
├── E20_COMPLETE.signal       # Phase 5 (concurrent)
├── E21_COMPLETE.signal       # Phase 5 (concurrent)
├── E22_COMPLETE.signal       # Phase 5 (concurrent)
└── E08v2_COMPLETE.signal     # Final validation done
```

### Signal File Format (use helper script)
```bash
node enhance-05/SCAFFOLDS/create-signal.mjs E12 SUCCESS "Runner integration complete"
```

Creates:
```yaml
# E12_COMPLETE.signal
timestamp: 2026-01-29T14:30:00Z
status: SUCCESS
agent: E12
notes: |
  Runner integration complete
```

---

## Package.json Change Queue

Multiple agents may need package.json changes. Use the queue pattern:

### Queue Location
`enhance-05/PACKAGE_CHANGES/`

### Queue Format
Each agent creates `{agentId}.json`:
```json
{
  "scripts": {
    "new:script": "node scripts/new-script.mjs"
  },
  "devDependencies": {
    "new-package": "^1.0.0"
  }
}
```

### Merge Protocol
After phase completion:
1. Coordinator reads all `.json` files in `PACKAGE_CHANGES/`
2. Merge into root `package.json`
3. Run `npm install`
4. Verify with `npm run bootcamp:list`
5. Delete processed `.json` files

---

## Insight Capture Protocol

**After EVERY phase**, update `enhance-05-extra.md`:

```markdown
## Phase X — [Phase Name]

**Completed:** YYYY-MM-DD HH:MM
**Agents:** E##, E##

### What Worked Well
- Item 1
- Item 2

### What Didn't Work
- Item 1
- Item 2

### Missed Opportunities Discovered
- Item 1
- Item 2

### Unexpected Issues
- Item 1
- Item 2

### Recommendations for enhance-06
- Item 1
- Item 2
```

---

## Issue handling

### If Critical issues found:
1. Stop merge process
2. Identify responsible agent
3. Run remediation
4. Re-run phase validation
5. Document in `enhance-05-extra.md`

### If High issues found:
1. Document issue
2. Decide: fix now or document for follow-up
3. If fixing: run targeted remediation
4. Re-run affected validation tasks
5. Document in `enhance-05-extra.md`

### If Medium/Low issues found:
1. Document in work log
2. Create follow-up issues/tasks
3. Proceed with merge
4. Document in `enhance-05-extra.md`

---

## Rollback Procedure

If phase gate fails:
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
feat(enhance-05): Complete bootcamp enhancement pack 05

Phase 1 - Runner + Progress Integration:
- Unified command with --mark-started and --mark-complete flags

Phase 2 - Data Safety + Alerts:
- Progress backup/restore system
- Extended alert thresholds (inactive, long-running)

Phase 3 - Content Extension:
- Tie-back/tie-forward sections for Week 2-4 labs

Phase 4 - Tooling:
- Signal file automation helper
- Tech debt cleanup (lab ID mappings, cohort format)
- Cross-platform path normalization

Phase 5 - Extended Tooling:
- Consolidated validation command
- Error recovery playbook
- Lab ID auto-discovery
- Dry-run mode for all scripts

Phase 6 - Validation:
- All QA checks passed

Insights captured in enhance-05-extra.md

Co-authored-by: E12_RUNNER_PROGRESS
Co-authored-by: E13_BACKUP_RESTORE
Co-authored-by: E14_EXTENDED_ALERTS
Co-authored-by: E15_WEEK2-4_TIEBACKS
Co-authored-by: E16_SIGNAL_AUTOMATION
Co-authored-by: E17_TECH_DEBT_CLEANUP
Co-authored-by: E18_PATH_NORMALIZATION
Co-authored-by: E19_VALIDATION_CONSOLIDATION
Co-authored-by: E20_ERROR_RECOVERY_PLAYBOOK
Co-authored-by: E21_LAB_ID_AUTODISCOVERY
Co-authored-by: E22_DRY_RUN_MODE
Co-authored-by: E08v2_QA_VALIDATION
```
