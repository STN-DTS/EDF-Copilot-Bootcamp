# Example Lab 4 Submission — Backend

**Submitter:** Example User  
**Date:** 2026-01-22  
**Lab:** Lab 4 — Guarded Refactor

---

## What I Did

Demonstrated guarded refactoring with strict scope control:
1. ✅ Received refactor target from lead
2. ✅ Used Prompt P4 to generate plan with risks
3. ✅ Verified no behavior change proposed
4. ✅ Implemented refactor within specified paths only
5. ✅ All existing tests pass
6. ✅ Added one clarifying test

---

## Refactor Target

Lead identified: "The `OrderService.getOrderDetails()` method has duplicate null-checking logic and magic strings for error messages."

---

## What Was Refactored

| Before | After |
|--------|-------|
| Duplicate `orElseThrow` patterns | Extracted to helper method |
| Magic string "Order not found: " | Constant `ORDER_NOT_FOUND_MSG` |
| Magic string "Customer not found" | Constant `CUSTOMER_NOT_FOUND_MSG` |
| Inline BigDecimal.ZERO | Constant for clarity |

---

## Risks Identified and Mitigations

| Risk | Mitigation |
|------|------------|
| Changing exception message format | Kept exact same format, only moved to constant |
| Helper method changing behavior | Helper does exactly what inline code did |
| Touching repository layer | Explicitly stayed in service layer only |

---

## Scope Control

✅ Only modified files listed in PLAN.md:
- `OrderService.java` — refactored
- `OrderServiceTest.java` — added one test

❌ Did NOT touch:
- Controllers
- Repositories
- Other services
- Configuration

---

## Copilot vs Human

- **Copilot generated:** Initial refactor suggestions
- **Human rejected:** Copilot wanted to also refactor the repository interface
- **Human refined:** Kept scope strictly to OrderService.java

---

## Verification Commands Run

```bash
# Run existing tests (must all pass)
./mvnw test -Dtest=OrderServiceTest
# Result: Tests run: 5, Failures: 0, Errors: 0

# Run full test suite
./mvnw test
# Result: BUILD SUCCESS - All 12 tests pass

# Check diff is small
git diff --stat
# Result: 2 files changed, 25 insertions(+), 18 deletions(-)
```

---

## Quick Reflection

- **Did the guarded refactor prompt help you avoid scope creep?**
  Yes, explicitly listing paths kept me focused.

- **What risks did you identify, and how did you mitigate them?**
  Risk of changing error message format — kept exact same strings as constants.

- **What would you do differently next time?**
  Would run tests after each small change instead of at the end.
