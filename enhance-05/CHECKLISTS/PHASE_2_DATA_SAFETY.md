# Phase 2: Data Safety — Checklist

## Prerequisites

- [ ] Phase 1 complete (E12 signal exists)
- [ ] No blocking issues from Phase 1

---

## Agent Execution

### E13_BACKUP_RESTORE and E14_EXTENDED_ALERTS

**These agents can run concurrently via `runSubagent`:**

```
Spawn agent E13 with instructions from enhance-05/AGENTS/E13_BACKUP_RESTORE.md
Spawn agent E14 with instructions from enhance-05/AGENTS/E14_EXTENDED_ALERTS.md
```

---

### E13_BACKUP_RESTORE

**Pre-flight:**
- [ ] E13 agent instructions reviewed
- [ ] `progress/` folder structure understood
- [ ] Backup requirements clear

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] `progress/scripts/backup-progress.mjs` created
- [ ] `progress/scripts/restore-progress.mjs` created
- [ ] Package.json changes queued: `enhance-05/PACKAGE_CHANGES/E13.json`
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E13_BACKUP_RESTORE_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E13_COMPLETE.signal`

**Verification:**
```bash
# Test backup (dry-run)
npm run progress:backup -- --cohort 2026-01 --dry-run

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E13_COMPLETE.signal
```

---

### E14_EXTENDED_ALERTS

**Pre-flight:**
- [ ] E14 agent instructions reviewed
- [ ] `progress/scripts/check-alerts.mjs` exists
- [ ] Current alert thresholds understood

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] `progress/scripts/check-alerts.mjs` updated with new thresholds
- [ ] Configuration options added (cohort-specific thresholds)
- [ ] Package.json changes queued: `enhance-05/PACKAGE_CHANGES/E14.json`
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E14_EXTENDED_ALERTS_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E14_COMPLETE.signal`

**Verification:**
```bash
# Test extended alerts
npm run progress:alerts -- --cohort 2026-01 --threshold 3

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E14_COMPLETE.signal
```

---

## Phase Gate

**Before proceeding to Phase 3:**

- [ ] E13 signal exists
- [ ] E14 signal exists
- [ ] Backup test passes (or dry-run)
- [ ] Alert test passes
- [ ] No merge conflicts in package.json queue

**Merge package.json changes:**
```bash
# Review queued changes
cat enhance-05/PACKAGE_CHANGES/E13.json
cat enhance-05/PACKAGE_CHANGES/E14.json

# Manually merge into package.json
# Then: npm install
```

**Insight capture for `enhance-05-extra.md`:**
- [ ] Note any unexpected findings
- [ ] Note any edge cases in backup/restore
- [ ] Note any additional alert thresholds needed

---

## Phase 2 Complete

**Sign-off:**
- Date: _____________
- Coordinator: _____________
- Status: PASS / FAIL

**Notes:**
_________________________________________________
_________________________________________________
