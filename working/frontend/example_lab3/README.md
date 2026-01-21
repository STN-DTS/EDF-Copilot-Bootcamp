# Example Lab 3 Submission — Frontend

**Submitter:** Example User  
**Date:** 2026-01-21  
**Lab:** Lab 3 — Tests First

---

## What I Did

Demonstrated tests-first (TDD) workflow:
1. ✅ Received acceptance criteria from lead
2. ✅ Used Prompt P2 to convert criteria into tests
3. ✅ Reviewed and fixed generated tests
4. ✅ Wrote minimal implementation to pass tests
5. ✅ Verified all tests pass

---

## Acceptance Criteria Used

From lead:
1. Order list page should display all orders with status badges
2. Clicking an order should navigate to detail page
3. Loading state should show skeleton UI
4. Error state should show user-friendly message with retry button

---

## Domain Context

Used Order Management domain from `docs/shared/reference-materials/DOMAIN_CONTEXT.md`:
- Orders: id, customerId, items, status
- Status values: pending, processing, completed, cancelled

---

## Copilot vs Human

### Tests Copilot Generated
- `renders loading skeleton while fetching` ✅ Good
- `renders order list with status badges` ⚠️ Needed fix
- `handles API error with retry button` ✅ Good
- `navigates to detail on order click` ⚠️ Needed fix

### Tests Human Fixed
- Fixed RRv7 test setup (Copilot used old React Router patterns)
- Fixed status badge assertions (wrong CSS class names)
- Added waitFor for async state updates

### Tests Human Wrote
- Edge case: empty order list
- Accessibility test for keyboard navigation

---

## Test Commands Run and Results

```bash
# Run tests
npm run test -- OrderList.test.tsx
# Result: PASS - 6 tests passed

# Run full test suite
npm run test
# Result: All 15 tests pass

# Check for accessibility issues
npm run test:a11y
# Result: No violations
```

---

## Quick Reflection

- **Did writing tests first change how you thought about implementation?**
  Yes, I designed the component API based on what tests needed.

- **What did Copilot get wrong in the generated tests?**
  Used outdated React Router testing patterns (pre-v7).

- **How much time did you spend fixing tests vs writing code?**
  About 50% on tests, 50% on implementation.
