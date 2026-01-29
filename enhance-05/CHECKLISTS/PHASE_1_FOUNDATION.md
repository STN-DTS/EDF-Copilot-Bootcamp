# Phase 1: Foundation — Checklist

## Prerequisites

- [ ] Coordinator has read `00-README_FOR_YOU.md`
- [ ] Coordinator has read `02-COORDINATOR_RUNBOOK.md`
- [ ] `enhance-05/WORK_PRODUCTS/` folder exists
- [ ] `enhance-05/WORK_PRODUCTS/SIGNALS/` folder exists

---

## Agent Execution

### E12_RUNNER_PROGRESS (Phase 1 - Foundation)

**Spawn with `runSubagent`:**
```
Spawn agent E12 with instructions from enhance-05/AGENTS/E12_RUNNER_PROGRESS.md
```

**Pre-flight:**
- [ ] E12 agent instructions reviewed
- [ ] `scripts/bootcamp.mjs` exists
- [ ] `progress/scripts/update-progress.mjs` exists

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] `scripts/bootcamp.mjs` updated with `--progress` flag
- [ ] `progress/scripts/update-progress.mjs` updated to accept step ID
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E12_RUNNER_PROGRESS_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E12_COMPLETE.signal`

**Verification:**
```bash
# Test integration
npm run bootcamp -- step week-01-lab-00 --progress

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E12_COMPLETE.signal
```

---

## Phase Gate

**Before proceeding to Phase 2:**

- [ ] E12 signal exists
- [ ] Integration test passes
- [ ] No errors in work log

**Insight capture for `enhance-05-extra.md`:**
- [ ] Note any unexpected findings
- [ ] Note any technical debt discovered
- [ ] Note any improvement ideas

---

## Phase 1 Complete

**Sign-off:**
- Date: _____________
- Coordinator: _____________
- Status: PASS / FAIL

**Notes:**
_________________________________________________
_________________________________________________
