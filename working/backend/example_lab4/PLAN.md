# Lab 4 Plan — Refactor OrderService (Extract Constants & Helper)

## Context
- Domain: Order Management (see docs/shared/reference-materials/DOMAIN_CONTEXT.md)
- Target file: `src/main/java/.../services/OrderService.java`
- Scope: OrderService only — NO other files except tests

## Refactor Objective
Reduce duplication and improve readability by:
1. Extracting magic strings to constants
2. Extracting duplicate null-check pattern to helper method

## Files to Change

| File | Action | Description |
|------|--------|-------------|
| `src/.../services/OrderService.java` | Modify | Extract constants and helper |
| `src/test/.../services/OrderServiceTest.java` | Modify | Add one clarifying test |

## Scope Control (CRITICAL)

### ✅ Allowed Changes
- Extract string literals to `private static final` constants
- Extract `findByIdOrThrow` helper method
- Rename local variables for clarity

### ❌ NOT Allowed
- Change public API signatures
- Change exception types thrown
- Touch repositories, controllers, or models
- Add new features or endpoints
- "While you're in there" refactors

## Steps

1. **Add constants** for error messages at top of class
2. **Replace** inline strings with constant references
3. **Run tests** — verify all pass
4. **Extract helper** `findByIdOrThrow(Optional, String)` method
5. **Replace** duplicate orElseThrow patterns with helper
6. **Run tests** — verify all pass
7. **Add one test** to clarify edge case behavior
8. **Run full suite** — verify BUILD SUCCESS

## Risks Identified

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Error message format change | Low | Medium | Use exact same string, just move to constant |
| Helper method changes behavior | Low | High | Helper does exactly what inline code did |
| Scope creep to repository | Medium | Medium | Explicitly stay in service layer |
| Breaking existing tests | Low | High | Run tests after each step |

## Tests to Verify

All existing tests must pass unchanged:
- `shouldReturnOrderWithCustomerAndItems()`
- `shouldReturn404WhenOrderNotFound()`
- `shouldCalculateTotalFromItemPrices()`
- `shouldReturnZeroTotalForOrderWithNoItems()`
- `shouldCalculateTotalForSingleItem()`

## New Test to Add
- `shouldThrowWithExactMessageFormat()` — verifies error message format is unchanged

## Acceptance Criteria

- [ ] No API behavior change (same inputs → same outputs)
- [ ] Only OrderService.java and its test modified
- [ ] All existing tests pass without modification
- [ ] Diff is small (< 30 lines changed)
- [ ] Magic strings replaced with constants

---

**Status:** ✅ Plan approved — proceed with refactor
