# Phase 5: Extended Tooling — Checklist

## Prerequisites

- [ ] Phase 1-4 complete (E12-E18 signals exist)
- [ ] No blocking issues from prior phases
- [ ] Package.json changes from E13, E14 merged

---

## Agent Execution

### E19, E20, E21, E22 (Phase 5 - Extended Tooling)

**These agents can run concurrently via `runSubagent`:**

```
Spawn agent E19 with instructions from enhance-05/AGENTS/E19_VALIDATION_CONSOLIDATION.md
Spawn agent E20 with instructions from enhance-05/AGENTS/E20_ERROR_RECOVERY_PLAYBOOK.md
Spawn agent E21 with instructions from enhance-05/AGENTS/E21_LAB_ID_AUTODISCOVERY.md
Spawn agent E22 with instructions from enhance-05/AGENTS/E22_DRY_RUN_MODE.md
```

**Maximum 4 concurrent agents - all can run in parallel.**

---

### E19_VALIDATION_CONSOLIDATION

**Pre-flight:**
- [ ] E19 agent instructions reviewed
- [ ] Existing validation commands identified
- [ ] Validation requirements clear

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] `scripts/validate-all.mjs` created
- [ ] Package.json changes queued: `enhance-05/PACKAGE_CHANGES/E19.json`
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E19_VALIDATION_CONSOLIDATION_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E19_COMPLETE.signal`

**Verification:**
```bash
# After merging package.json changes:
npm run validate:all
npm run validate:quick

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E19_COMPLETE.signal
```

---

### E20_ERROR_RECOVERY_PLAYBOOK

**Pre-flight:**
- [ ] E20 agent instructions reviewed
- [ ] Common errors from enhance-04 reviewed
- [ ] Playbook structure understood

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] `enhance-05/PLAYBOOKS/README.md` created
- [ ] `enhance-05/PLAYBOOKS/ERROR_RECOVERY.md` created
- [ ] `enhance-05/PLAYBOOKS/COMMON_FAILURES.md` created
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E20_ERROR_RECOVERY_PLAYBOOK_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E20_COMPLETE.signal`

**Verification:**
```bash
# Verify playbooks exist
ls enhance-05/PLAYBOOKS/

# Check content quality (manual review)
head -50 enhance-05/PLAYBOOKS/ERROR_RECOVERY.md

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E20_COMPLETE.signal
```

---

### E21_LAB_ID_AUTODISCOVERY

**Pre-flight:**
- [ ] E21 agent instructions reviewed
- [ ] `bootcamp/steps/` folder structure understood
- [ ] Step ID format understood

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] `scripts/utils/lab-discovery.mjs` created
- [ ] `scripts/bootcamp.mjs` uses discovery (coordinate with E12, E18)
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E21_LAB_ID_AUTODISCOVERY_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E21_COMPLETE.signal`

**Verification:**
```bash
# Test discovery
node scripts/utils/lab-discovery.mjs --list
node scripts/utils/lab-discovery.mjs --json

# Test typo suggestion
node scripts/utils/lab-discovery.mjs week-01-lab

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E21_COMPLETE.signal
```

---

### E22_DRY_RUN_MODE

**Pre-flight:**
- [ ] E22 agent instructions reviewed
- [ ] File write operations identified in recon
- [ ] Dry-run requirements clear

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] `scripts/utils/dry-run.mjs` created
- [ ] `scripts/bootcamp.mjs` supports `--dry-run` (coordinate with E12, E18, E21)
- [ ] Progress scripts support `--dry-run`
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E22_DRY_RUN_MODE_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E22_COMPLETE.signal`

**Verification:**
```bash
# Test dry-run mode
npm run bootcamp -- step week-01-lab-00 --dry-run
npm run progress:init -- --name "Test" --github test --cohort test --track backend --dry-run

# Verify no files created
ls progress/cohorts/test/  # Should not exist

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E22_COMPLETE.signal
```

---

## Phase Gate

**Before proceeding to Phase 6:**

- [ ] E19 signal exists
- [ ] E20 signal exists
- [ ] E21 signal exists
- [ ] E22 signal exists
- [ ] Validation command works
- [ ] Playbooks are comprehensive
- [ ] Lab discovery works
- [ ] Dry-run mode works

**Merge package.json changes:**
```bash
# Review queued changes
cat enhance-05/PACKAGE_CHANGES/E19.json

# Manually merge into package.json
# Then: npm install
```

**File coordination check:**
```bash
# E12, E18, E21, E22 all modify bootcamp.mjs - final verification
npm run bootcamp -- step week-01-lab-00
npm run bootcamp -- step week-01-lab-00 --dry-run
npm run bootcamp -- step week-01-lab-00 --progress --dry-run
```

**Insight capture for `enhance-05-extra.md`:**
- [ ] Note validation gaps for future
- [ ] Note playbook improvements needed
- [ ] Note lab discovery edge cases
- [ ] Note dry-run limitations

---

## Phase 5 Complete

**Sign-off:**
- Date: _____________
- Coordinator: _____________
- Status: PASS / FAIL

**Notes:**
_________________________________________________
_________________________________________________
