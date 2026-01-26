# Phase 4 Checklist — Copilot Course Agent

## Agent in this phase
- E11_COPILOT_COURSE_AGENT

**Execution:** SEQUENTIAL (after content phases, before final QA)

**Prerequisite:** E09 complete (progress system needed for commands)

---

## Pre-Flight Verification

Before starting Phase 4:
- [ ] Phase 3 gate passed
- [ ] `.github/copilot-instructions.md` exists
- [ ] Progress system functional (E09/E10 complete)
- [ ] Bootcamp runner functional (E01 complete)

---

## E11 Recon Gate

- [ ] Agent read current `.github/copilot-instructions.md`
- [ ] Agent verified `.github/instructions/` folder status
- [ ] Agent confirmed progress system works

---

## E11 Files Created

- [ ] `.github/instructions/student-navigation.instructions.md` exists
- [ ] `COPILOT_COURSE_COMMANDS.md` exists at repo root

---

## E11 Files Updated

- [ ] `.github/copilot-instructions.md` has "Student Course Navigation" section
- [ ] Section includes quick reference table
- [ ] Section includes onboarding guidance
- [ ] Section includes progress check guidance

---

## Content Validation

### Trigger Phrases Documented
- [ ] Onboarding triggers (start, new, begin)
- [ ] Progress triggers (where, next, continue)
- [ ] Lab start triggers (start lab X)
- [ ] Lab complete triggers (finished, PR)
- [ ] Help triggers (stuck, blocked, error)

### Flows Documented
- [ ] Onboarding flow complete
- [ ] Progress check flow complete
- [ ] Lab start flow complete
- [ ] Lab complete flow complete
- [ ] Stuck/help flow complete

### Track-Specific Guidance
- [ ] Backend (Spring Boot) guidance present
- [ ] Frontend (React) guidance present

### Error Handling
- [ ] Progress file not found → helpful message
- [ ] Lab not found → helpful message
- [ ] Invalid cohort → helpful message
- [ ] Runner not installed → helpful message

---

## Manual Testing

Test each scenario in Copilot Chat:

### Onboarding Test
- [ ] Say "Start the bootcamp" → get welcome and track choice
- [ ] Answer with track → get setup instructions
- [ ] Get offered to start Lab 0

### Progress Test
- [ ] Say "Where did I leave off?" → get asked for username/cohort
- [ ] Provide username → get progress summary
- [ ] Get offered next lab

### Lab Start Test
- [ ] Say "Start Lab 0" → get lab details displayed
- [ ] Get offered to mark as in-progress

### Lab Complete Test
- [ ] Say "I finished Lab 0, PR #1" → get congratulated
- [ ] Get next lab suggested

### Help Test
- [ ] Say "I'm stuck" → get asked for context
- [ ] Describe error → get debugging help

---

## E11 Output

- [ ] Work log exists: `enhance-04/WORK_PRODUCTS/E11_COPILOT_COURSE_AGENT_WORKLOG.md`
- [ ] All three files created/updated
- [ ] Manual testing completed

---

## Phase 4 Gate Verification

```bash
# 1. Verify files exist
ls .github/instructions/student-navigation.instructions.md
ls COPILOT_COURSE_COMMANDS.md

# 2. Check copilot-instructions has new section
grep "Student Course Navigation" .github/copilot-instructions.md

# 3. Check quick reference exists
grep "Start the bootcamp" COPILOT_COURSE_COMMANDS.md

# 4. Signal file (if using signals)
cat enhance-04/WORK_PRODUCTS/SIGNALS/E11_COMPLETE.signal 2>/dev/null || echo "Create signal manually"
```

---

## Rollback Procedure

If Phase 4 fails:

```bash
# Remove new files
rm .github/instructions/student-navigation.instructions.md
rm COPILOT_COURSE_COMMANDS.md

# Revert copilot-instructions changes
git checkout .github/copilot-instructions.md
```

---

## Coordinator Notes

- E11 is student-facing — quality matters more than speed
- Manual Copilot Chat testing is required
- Expect iteration based on real student feedback
- Can proceed to Phase 5 (QA) even with partial E11 completion
