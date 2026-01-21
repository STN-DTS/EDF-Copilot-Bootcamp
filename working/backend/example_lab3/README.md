# Example Lab 3 Submission — Backend

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
1. Given an order ID, return the order with customer name and item list
2. Return 404 with Problem Details if order not found
3. Order total should be calculated from item prices

---

## Domain Context

Used Order Management domain from `docs/shared/reference-materials/DOMAIN_CONTEXT.md`:
- Orders: id, customerId, items, status, total
- Customers: id, name, email
- Items: id, name, price

---

## Copilot vs Human

### Tests Copilot Generated
- `shouldReturnOrderWithCustomerAndItems()` ✅ Good
- `shouldReturn404WhenOrderNotFound()` ✅ Good
- `shouldCalculateTotalFromItemPrices()` ⚠️ Needed fix

### Tests Human Fixed
- Fixed assertion for total calculation (Copilot used wrong precision)
- Added missing `@Transactional` annotation for test isolation
- Fixed mock setup for repository

### Tests Human Wrote
- Edge case: order with no items should have total = 0
- Edge case: order with single item

---

## Test Commands Run and Results

```bash
# Run tests
./mvnw test -Dtest=OrderServiceTest
# Result: Tests run: 5, Failures: 0, Errors: 0

# Run full test suite
./mvnw test
# Result: BUILD SUCCESS - All 12 tests pass

# Coverage check
./mvnw jacoco:report
# Result: OrderService: 95% line coverage
```

---

## Quick Reflection

- **Did writing tests first change how you thought about implementation?**
  Yes, I focused on the exact requirements instead of over-engineering.

- **What did Copilot get wrong in the generated tests?**
  Decimal precision for currency (used double instead of BigDecimal).

- **How much time did you spend fixing tests vs writing code?**
  About 40% on tests, 60% on implementation.
