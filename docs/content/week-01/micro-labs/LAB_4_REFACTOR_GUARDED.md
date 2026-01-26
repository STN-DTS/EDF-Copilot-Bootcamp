# Lab 4 — Guarded Refactor

## Goal

Practice safe refactoring with strict scope control. This lab enforces discipline around making code improvements without introducing behavioral changes—a critical skill for maintaining production systems.

## Timebox

45–60 minutes

## Prerequisites

- Completed Labs 0–3
- Review [Prompt Pack V1](../../../shared/reference-materials/PROMPT_PACK_V1.md) — focus on P4 (Guarded refactor)
- Review [Domain Context](../DOMAIN_CONTEXT.md) for business context

## Domain Context

Use the **Order Management** domain from `docs/shared/reference-materials/DOMAIN_CONTEXT.md`. Your refactor should target code from Labs 2 or 3.

---

## Task

Lead selects a small refactor target in a single module from your previous lab work. Common candidates:

- Code duplication
- Unclear function names
- Messy error handling
- Long methods that should be split
- Magic numbers/strings that should be constants

---

## Steps

1. **Get the target** — Lead identifies specific file(s) and function(s) to refactor
2. **Use Prompt P4** — Ask Copilot for a refactor plan with risks
3. **Review the plan** — Verify scope is limited, no behavior change proposed
4. **Implement** — Apply refactor only within specified paths
5. **Test** — Run all existing tests to verify no regression
6. **Add test** — If behavior was unclear, add a test to document it

---

## Refactor Scope Rules

| ✅ Allowed                 | ❌ Not Allowed                   |
| -------------------------- | -------------------------------- |
| Rename variables/functions | Change API signatures            |
| Extract methods            | Add new features                 |
| Remove duplication         | Modify return types              |
| Improve error messages     | Change business logic            |
| Add constants              | Touch unrelated files            |
| Improve comments           | Refactor "while you're in there" |

---

## Success Criteria

- [ ] No API behavior change (same inputs → same outputs)
- [ ] No scope creep (changes only in specified paths)
- [ ] All existing tests pass
- [ ] Diff is small and reviewable
- [ ] Plan documented with risks identified
- [ ] New test added if behavior was unclear

---

## Submission (MANDATORY)

### Step 1: Create Your Working Folder

```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
```

Example: `/working/backend/jsmith_20260122_1000/`

### Step 2: Include Required Files

- Refactor plan with risks (`PLAN.md`)
- Refactored code files
- Any new tests added
- A `README.md` containing:
  - Your name and date
  - Lab number: **Lab 4**
  - What was refactored
  - Risks identified and how you mitigated them
  - How scope was controlled
  - Verification commands run and results

### Step 3: Open a Pull Request

- Use the PR template at `.github/pull_request_template.md`
- Ensure all checklist items are completed

### Example Folder Structure

```
/working/backend/jsmith_20260122_1000/
├── README.md
├── PLAN.md
├── src/
│   └── (refactored files)
└── test/
    └── (any new tests)
```

> 📁 **Reference:** See `/working/backend/example_lab4/` for example submission.

---

## Quick Reflection (2 min)

Before submitting, answer in your README:

- Did the guarded refactor prompt help you avoid scope creep?
- What risks did you identify, and how did you mitigate them?
- What would you do differently next time?

---

## Navigation

| Previous                        | Home                        | Next                                    |
| ------------------------------- | --------------------------- | --------------------------------------- |
| [← Lab 3](LAB_3_TESTS_FIRST.md) | [Week 1 Home](../README.md) | [Lab 5 →](LAB_5_OPENSHIFT_READINESS.md) |
