# Phase 3 Checklist — Content Enhancement

## Agents in this phase
- E05_LAB_TIEBACKS
- E06_ASSESSMENT_FRAMEWORK
- E07_FAQ_CONSOLIDATION

**Execution:** Run ALL 3 CONCURRENTLY (no file overlap)

**Prerequisite:** Phase 2 complete

---

## Pre-merge verification

### E05_LAB_TIEBACKS
- [ ] Work log exists: `enhance-04/WORK_PRODUCTS/E05_LAB_TIEBACKS_WORKLOG.md`
- [ ] Lab 0 has "🔙 Building On" section
- [ ] Lab 0 has "🔜 Looking Ahead" section
- [ ] Lab 1 has both tie-back and tie-forward
- [ ] Lab 2 has both tie-back and tie-forward
- [ ] Lab 3 has both tie-back and tie-forward
- [ ] Lab 4 has both tie-back and tie-forward
- [ ] Lab 5 has both tie-back and tie-forward
- [ ] Lab 6 has both tie-back and tie-forward
- [ ] Sections placed consistently (after Goal, before Navigation)

### E06_ASSESSMENT_FRAMEWORK
- [ ] Work log exists: `enhance-04/WORK_PRODUCTS/E06_ASSESSMENT_FRAMEWORK_WORKLOG.md`
- [ ] `docs/shared/ASSESSMENT_FRAMEWORK.md` exists
- [ ] Document has competency levels defined
- [ ] Document covers Week 1-4 skills
- [ ] Document covers Sprint 1-4 criteria
- [ ] Document has portfolio requirements
- [ ] Document has completion criteria
- [ ] Linked from `docs/shared/README.md`
- [ ] Linked from `.MASTER_BOOTCAMP.md`

### E07_FAQ_CONSOLIDATION
- [ ] Work log exists: `enhance-04/WORK_PRODUCTS/E07_FAQ_CONSOLIDATION_WORKLOG.md`
- [ ] `docs/content/week-03/WEEK_3_FAQ.md` exists
- [ ] `docs/content/sprint-01/FAQ.md` exists
- [ ] `docs/content/sprint-02/FAQ.md` exists
- [ ] `docs/content/sprint-03/FAQ.md` exists
- [ ] `docs/content/sprint-04/FAQ.md` exists
- [ ] FAQs follow consistent format
- [ ] FAQs linked from respective README files

---

## Gate verification commands

```bash
# Run link check (verify new files don't break anything)
npm run check:links

# Verify assessment framework accessible
# Open: docs/shared/ASSESSMENT_FRAMEWORK.md

# Verify FAQs accessible
# Open each: docs/content/week-03/WEEK_3_FAQ.md, etc.

# Verify tie-backs in labs
# Open: docs/content/week-01/micro-labs/LAB_0_SETUP.md
# Search for "Building On" and "Looking Ahead"
```

---

## No file overlap expected

These agents work on completely separate files:
- E05: Week 1 lab files only
- E06: Assessment framework (new file)
- E07: FAQ files only

Git should auto-merge without conflicts.

---

## Merge order
Any order (no dependencies between these three)

Suggested: E06 → E07 → E05 (smallest to largest change sets)

---

## Phase 3 complete when
- [ ] All checklist items above verified
- [ ] Link check still passes
- [ ] All 7 labs have tie-back sections
- [ ] Assessment framework complete
- [ ] All 5 new FAQs exist
- [ ] All three work logs present
- [ ] No merge conflicts

**Next:** Proceed to Phase 4 (QA Validation)
