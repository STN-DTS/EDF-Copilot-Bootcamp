# Lab 4 Plan — Refactor OrderList (Extract Helpers & Constants)

## Context
- Domain: Order Management (see docs/shared/reference-materials/DOMAIN_CONTEXT.md)
- Target file: `src/routes/OrderList.tsx`
- Scope: OrderList only — NO other route components

## Refactor Objective
Reduce duplication and improve readability by:
1. Extracting status badge logic to helper function
2. Extracting skeleton loading to sub-component
3. Centralizing UI strings to constants

## Files to Change

| File | Action | Description |
|------|--------|-------------|
| `src/routes/OrderList.tsx` | Modify | Extract helpers and constants |
| `test/OrderList.test.tsx` | Modify | Add one clarifying test |

## Scope Control (CRITICAL)

### ✅ Allowed Changes
- Extract `getStatusBadgeClass(status)` helper function
- Extract `SkeletonRow` sub-component (same file)
- Extract UI strings to constants object
- Improve variable naming

### ❌ NOT Allowed
- Create new shared components in other files
- Change CSS class name values
- Change rendered text content
- Touch other route components
- Add new features or props

## Steps

1. **Add constants** object for UI strings at top of file
2. **Replace** inline strings with constant references
3. **Run tests** — verify all pass
4. **Extract** `getStatusBadgeClass()` helper function
5. **Replace** inline template literal with helper call
6. **Run tests** — verify all pass
7. **Extract** `SkeletonRow` as internal component
8. **Run tests** — verify all pass
9. **Add one test** to verify badge class generation
10. **Run full suite** — verify all pass

## Risks Identified

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CSS class name change | Low | High | Helper generates exact same output |
| Breaking loading skeleton | Low | Medium | Snapshot test before/after |
| Scope creep to shared components | Medium | Medium | Stay in single file |
| Changing rendered text | Low | Medium | Use exact same strings |

## Tests to Verify

All existing tests must pass unchanged:
- `renders loading skeleton while fetching`
- `renders order list with status badges`
- `handles API error with retry button`
- `navigates to detail on order click`
- `renders empty state when no orders`
- `supports keyboard navigation`

## New Test to Add
- `getStatusBadgeClass returns correct class for each status`

## Acceptance Criteria

- [ ] No visual or behavioral change
- [ ] Only OrderList.tsx and its test modified
- [ ] All existing tests pass without modification
- [ ] Diff is small (< 40 lines changed)
- [ ] Duplicate logic extracted to helpers

---

**Status:** ✅ Plan approved — proceed with refactor
