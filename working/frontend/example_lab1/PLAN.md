# Lab 1 Plan — Add 404 Not Found Page

## Context
- Domain: Order Management (see docs/shared/reference-materials/DOMAIN_CONTEXT.md)
- Relevant paths: `src/routes/`
- Existing pattern: RRv7 with loader/action conventions

## Goal
Add a 404 Not Found page that displays when users navigate to an unknown route.

## Files to Change

| File | Action | Description |
|------|--------|-------------|
| `src/routes/not-found.tsx` | Create | New 404 page component |
| `src/routes.tsx` | Modify | Add catch-all route with errorElement |
| `src/routes/not-found.test.tsx` | Create | Test for 404 page |

## Steps

1. Create `not-found.tsx` with user-friendly message and link to home
2. Update root route configuration to include catch-all `*` path
3. Write test to verify 404 page renders with correct message
4. Run `npm run test` to verify all tests pass
5. Run `npm run build` to verify production build works
6. Verify no unrelated changes with `git diff --stat`

## Risks Identified

| Risk | Mitigation |
|------|------------|
| Wrong routing pattern | Follow RRv7 errorElement pattern from docs |
| Accessibility issues | Include proper heading hierarchy, link focus |
| Scope creep to styling | Keep styling minimal, use existing classes |

## Tests to Add

- `NotFoundPage.test.tsx` — renders 404 message
- Verify link to home page exists
- Verify page is accessible (heading, link)

## Acceptance Criteria

- [ ] Navigating to `/unknown-path` shows 404 page
- [ ] Page has link to return to home
- [ ] One test verifies page renders correctly
- [ ] No other files modified beyond plan

---

**Status:** ✅ Plan approved — proceed with implementation
