# Phase 3: Content — Checklist

## Prerequisites

- [ ] Phase 1 complete (E12 signal exists)
- [ ] Phase 2 complete (E13, E14 signals exist)
- [ ] No blocking issues from prior phases

---

## Agent Execution

### E15_WEEK2-4_TIEBACKS (Phase 3 - Content)

**Spawn with `runSubagent`:**
```
Spawn agent E15 with instructions from enhance-05/AGENTS/E15_WEEK2-4_TIEBACKS.md
```

**Note:** E15 has large scope (3 weeks). Consider splitting if needed:
- E15a: Week 2 tie-backs
- E15b: Week 3 tie-backs
- E15c: Week 4 tie-backs

---

### E15_WEEK2-4_TIEBACKS

**Pre-flight:**
- [ ] E15 agent instructions reviewed
- [ ] `docs/content/week-02/`, `week-03/`, `week-04/` folders exist
- [ ] `bootcamp/steps/week-02/`, etc. folders understood
- [ ] Week 1 tie-back pattern from enhance-04 reviewed

**Expected outputs:**
- [ ] Recon findings documented
- [ ] Plan reviewed (5-10 bullets)
- [ ] Week 2 lab files have bootcamp runner commands
- [ ] Week 3 lab files have bootcamp runner commands
- [ ] Week 4 lab files have bootcamp runner commands
- [ ] YAML step files created for weeks 2-4
- [ ] Verification commands passed
- [ ] Work log created: `enhance-05/WORK_PRODUCTS/E15_WEEK2-4_TIEBACKS_WORKLOG.md`
- [ ] Signal created: `enhance-05/WORK_PRODUCTS/SIGNALS/E15_COMPLETE.signal`

**Verification:**
```bash
# Test week 2 lab
npm run bootcamp -- step week-02-lab-00

# Test week 3 lab
npm run bootcamp -- step week-03-lab-00

# Test week 4 lab
npm run bootcamp -- step week-04-lab-00

# Check signal
cat enhance-05/WORK_PRODUCTS/SIGNALS/E15_COMPLETE.signal
```

---

## Phase Gate

**Before proceeding to Phase 4:**

- [ ] E15 signal exists
- [ ] Week 2 integration test passes
- [ ] Week 3 integration test passes
- [ ] Week 4 integration test passes
- [ ] All YAML files parse correctly

**Link check:**
```bash
npm run check:links
```

**Insight capture for `enhance-05-extra.md`:**
- [ ] Note any inconsistent lab structures across weeks
- [ ] Note any missing content
- [ ] Note any metadata patterns

---

## Phase 3 Complete

**Sign-off:**
- Date: _____________
- Coordinator: _____________
- Status: PASS / FAIL

**Notes:**
_________________________________________________
_________________________________________________
