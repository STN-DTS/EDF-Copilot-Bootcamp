# Example Lab 4 Submission — Frontend

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

Lead identified: "The `OrderList` component has duplicate badge styling logic and inline strings."

---

## What Was Refactored

| Before | After |
|--------|-------|
| Inline `badge-${status}` classes | Extracted to `getStatusBadgeClass()` helper |
| Duplicate loading skeleton divs | Extracted to `SkeletonRow` component |
| Inline "Loading orders..." string | Extracted to constants |
| Inline "No orders found" string | Extracted to constants |

---

## Risks Identified and Mitigations

| Risk | Mitigation |
|------|------------|
| Changing CSS class names | Helper generates exact same class names |
| Breaking loading state UI | Skeleton component renders identical DOM |
| Changing text content | Kept exact same strings, just centralized |

---

## Scope Control

✅ Only modified files listed in PLAN.md:
- `OrderList.tsx` — refactored
- `OrderList.test.tsx` — added one test

❌ Did NOT touch:
- Other route components
- API layer
- Types
- Configuration

---

## Copilot vs Human

- **Copilot generated:** Initial refactor suggestions
- **Human rejected:** Copilot wanted to also create a shared Badge component for all pages
- **Human refined:** Kept scope strictly to OrderList.tsx

---

## Verification Commands Run

```bash
# Run existing tests (must all pass)
npm run test -- OrderList.test.tsx
# Result: PASS - 6 tests passed

# Run full test suite
npm run test
# Result: All 15 tests pass

# Check diff is small
git diff --stat
# Result: 2 files changed, 32 insertions(+), 20 deletions(-)
```

---

## Quick Reflection

- **Did the guarded refactor prompt help you avoid scope creep?**
  Yes, Copilot initially suggested a bigger refactor that I rejected.

- **What risks did you identify, and how did you mitigate them?**
  Risk of breaking CSS classes — tested that visual output is identical.

- **What would you do differently next time?**
  Would add a visual regression test before starting.
