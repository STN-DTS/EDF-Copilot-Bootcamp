# Phase 4: Tooling — Checklist

## Prerequisites

- [ ] Phase 1 complete (E12 signal exists)
- [ ] Phase 2 complete (E13, E14 signals exist)
- [ ] Phase 3 complete (E15 signal exists)
- [ ] No blocking issues from prior phases

---

## Agent Execution

### E16, E17, E18 (Phase 4 - Tooling)

**These agents can run concurrently via `runSubagent`:**

```
Spawn agent E16 with instructions from enhance-05/AGENTS/E16_SIGNAL_AUTOMATION.md
Spawn agent E17 with instructions from enhance-05/AGENTS/E17_TECH_DEBT_CLEANUP.md
Spawn agent E18 with instructions from enhance-05/AGENTS/E18_PATH_NORMALIZATION.md
```

**Maximum 3 concurrent agents recommended.**

---

### E16_SIGNAL_AUTOMATION

**Pre-flight:**
- [ ] E16 agent instructions reviewed
- [ ] `enhance-05/SCAFFOLDS/` folder exists
- [ ] Signal file pattern understood

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] `enhance-05/SCAFFOLDS/create-signal.mjs` created
- [ ] `enhance-05/SCAFFOLDS/validate-signals.mjs` created
- [ ] `enhance-05/SCAFFOLDS/create-worklog.mjs` created
- [ ] `enhance-05/SCAFFOLDS/README.md` created
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E16_SIGNAL_AUTOMATION_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E16_COMPLETE.signal`

**Verification:**
```bash
# Test signal creation
node enhance-05/SCAFFOLDS/create-signal.mjs TEST SUCCESS "Test signal"

# Verify signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/TEST_COMPLETE.signal

# Clean up test
rm enhance-05/WORK_PRODUCTS/SIGNALS/TEST_COMPLETE.signal

# Check E16 signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E16_COMPLETE.signal
```

---

### E17_TECH_DEBT_CLEANUP

**Pre-flight:**
- [ ] E17 agent instructions reviewed
- [ ] Hardcoded paths identified in recon
- [ ] Lab ID mappings understood

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] Hardcoded paths replaced with config
- [ ] Lab ID mappings centralized
- [ ] Cohort flexibility improved
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E17_TECH_DEBT_CLEANUP_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E17_COMPLETE.signal`

**Verification:**
```bash
# Search for remaining hardcoded paths
grep -r "2026-01" progress/

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E17_COMPLETE.signal
```

---

### E18_PATH_NORMALIZATION

**Pre-flight:**
- [ ] E18 agent instructions reviewed
- [ ] Path output in scripts understood
- [ ] Cross-platform requirements clear

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] `scripts/utils/path-utils.mjs` created
- [ ] `scripts/bootcamp.mjs` uses normalized paths (coordinate with E12)
- [ ] Progress scripts use normalized paths
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E18_PATH_NORMALIZATION_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E18_COMPLETE.signal`

**Verification:**
```bash
# Test path normalization (on Windows)
npm run bootcamp -- step week-01-lab-00
# Should show forward slashes

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E18_COMPLETE.signal
```

---

## Phase Gate

**Before proceeding to Phase 5:**

- [ ] E16 signal exists
- [ ] E17 signal exists
- [ ] E18 signal exists
- [ ] Signal helper scripts work
- [ ] No hardcoded paths remain
- [ ] Path normalization works

**File coordination check:**
```bash
# E12, E18 both modify bootcamp.mjs - verify no conflicts
git diff scripts/bootcamp.mjs
```

**Insight capture for `enhance-05-extra.md`:**
- [ ] Note signal automation patterns for future cycles
- [ ] Note remaining tech debt items
- [ ] Note path edge cases discovered

---

## Phase 4 Complete

**Sign-off:**
- Date: _____________
- Coordinator: _____________
- Status: PASS / FAIL

**Notes:**
_________________________________________________
_________________________________________________
