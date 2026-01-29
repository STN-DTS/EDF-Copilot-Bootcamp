# Phase 6: Validation — Checklist

## Prerequisites

- [ ] All Phase 1-5 agents complete (11 signals: E12-E22)
- [ ] All package.json changes merged
- [ ] No blocking issues from prior phases

**Signal check:**
```bash
ls enhance-05/WORK_PRODUCTS/SIGNALS/
# Should show:
# E12_COMPLETE.signal
# E13_COMPLETE.signal
# E14_COMPLETE.signal
# E15_COMPLETE.signal
# E16_COMPLETE.signal
# E17_COMPLETE.signal
# E18_COMPLETE.signal
# E19_COMPLETE.signal
# E20_COMPLETE.signal
# E21_COMPLETE.signal
# E22_COMPLETE.signal
```

If any signals are missing, DO NOT proceed. Go back and complete the missing agent.

---

## Agent Execution

### E08v2_QA_VALIDATION (Phase 6 - Validation)

**Spawn with `runSubagent`:**
```
Spawn agent E08v2 with instructions from enhance-05/AGENTS/E08v2_QA_VALIDATION.md
```

**This is the final agent. It runs alone after all others complete.**

---

### E08v2_QA_VALIDATION

**Pre-flight:**
- [ ] E08v2 agent instructions reviewed
- [ ] All 11 prior signals verified
- [ ] Validation checks understood

**Expected outputs:**
- [ ] Recon findings documented (signal status)
- [ ] 7 validation checks completed:
  - [ ] Check 1: Broken links
  - [ ] Check 2: Package.json consistency
  - [ ] Check 3: Documentation sync
  - [ ] Check 4: Test verification
  - [ ] Check 5: File structure
  - [ ] Check 6: Work log completeness
  - [ ] Check 7: Signal file validation
- [ ] QA Report created: `enhance-05/WORK_PRODUCTS/QA_REPORT.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E08v2_COMPLETE.signal`

**Verification:**
```bash
# Check QA report
cat enhance-05/WORK_PRODUCTS/QA_REPORT.md

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E08v2_COMPLETE.signal
```

---

## Final Validation

### All Signals Present

```bash
# Validate all signals
node enhance-05/SCAFFOLDS/validate-signals.mjs E12 E13 E14 E15 E16 E17 E18 E19 E20 E21 E22 E08v2
```

### Full Validation Suite

```bash
npm run validate:all
```

### Link Check

```bash
npm run check:links
```

### Integration Tests

```bash
# Full workflow test
npm run bootcamp -- step week-01-lab-00 --progress --dry-run
npm run progress:init -- --name "Final Test" --github finaltest --cohort test --track backend --dry-run
npm run progress:backup -- --cohort test --dry-run
npm run progress:alerts -- --cohort test
```

---

## QA Report Review

Review the QA_REPORT.md for:

- [ ] Overall status (PASS / PASS WITH WARNINGS / FAIL)
- [ ] Critical issues (must fix before release)
- [ ] Warnings (document and defer if acceptable)
- [ ] Recommendations for enhance-06

**If FAIL:**
1. Review detailed findings
2. Identify blocking issues
3. Assign fix tasks
4. Re-run affected agents
5. Re-run E08v2

**If PASS WITH WARNINGS:**
1. Document warnings in enhance-05-extra.md
2. Create follow-up tasks for enhance-06
3. Proceed with release

---

## Final Insight Capture

Update `enhance-05-extra.md` with:

- [ ] QA findings summary
- [ ] Process improvements observed
- [ ] Deferred items for enhance-06
- [ ] Lessons learned from this cycle
- [ ] Multi-agent orchestration notes

---

## Phase 6 Complete

**Sign-off:**
- Date: _____________
- Coordinator: _____________
- QA Status: PASS / PASS WITH WARNINGS / FAIL

**Final Notes:**
_________________________________________________
_________________________________________________

---

## enhance-05 Cycle Complete

### Checklist Summary

| Phase | Agents | Status |
|-------|--------|--------|
| 1 Foundation | E12 | ☐ |
| 2 Data Safety | E13, E14 | ☐ |
| 3 Content | E15 | ☐ |
| 4 Tooling | E16, E17, E18 | ☐ |
| 5 Extended | E19, E20, E21, E22 | ☐ |
| 6 Validation | E08v2 | ☐ |

### Deliverables

- [ ] All 12 signals present
- [ ] QA_REPORT.md created
- [ ] All work logs created
- [ ] enhance-05-extra.md updated
- [ ] Package.json updated
- [ ] Documentation updated

### Release Readiness

- [ ] All tests pass
- [ ] No critical QA findings
- [ ] Warnings documented
- [ ] Ready for merge to main

**Release approval:**
- Date: _____________
- Approved by: _____________
