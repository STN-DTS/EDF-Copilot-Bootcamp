# Example Lab 2 Submission — Frontend

**Submitter:** Example User  
**Date:** 2026-01-21  
**Lab:** Lab 2 — Vertical Slice Scaffold (React Router v7)

---

## What I Did

Scaffolded a vertical slice for the Order Management domain:
1. ✅ Created /ping route with loading/success/error states
2. ✅ Created /orders route displaying sample Order data
3. ✅ Implemented proper RRv7 loader pattern
4. ✅ Added Error Boundary for error handling
5. ✅ Added tests for all three states

---

## Domain Context

Used the Order Management domain from `docs/shared/reference-materials/DOMAIN_CONTEXT.md`:
- Orders (id, customer, items, status)
- Sample data displayed in a table format

---

## Verification Commands Run

```bash
# Install dependencies
npm install
# Result: up to date in 2s

# Run tests
npm run test
# Result: 
#  ✓ src/routes/__tests__/ping.test.tsx (3 tests)
#  ✓ src/routes/__tests__/orders.test.tsx (4 tests)
# Test Files  2 passed (2)
# Tests       7 passed (7)

# Lint check
npm run lint
# Result: No warnings or errors

# Type check
npm run typecheck
# Result: No errors

# Build for production
npm run build
# Result: dist/index.html and assets created

# Dev server
npm run dev
# Result: Server running at http://localhost:5173
```

---

## Copilot vs Human

| Category | Details |
|----------|---------|
| **Copilot generated** | Route file structure, loader function, component skeleton, test setup with vitest |
| **Human verified** | Correct RRv7 patterns, proper TypeScript types, accessible table markup |
| **Human fixed** | Added missing aria-labels, fixed async/await in loader, corrected error boundary import |
| **Human wrote** | Loading spinner component, custom error message formatting, accessibility improvements |

---

## Plan Followed

See [PLAN.md](PLAN.md) for the approved plan.

**Deviations from plan:**
- Added /orders route (optional stretch goal)
- Created reusable LoadingSpinner component
- Added accessibility attributes to table

---

## Quick Reflection

- **How did breaking into 2–3 steps help?** I built /ping first, verified it worked, then reused patterns for /orders. Much faster than doing everything at once.
- **What did Copilot scaffold well?** RRv7 loader/action patterns, test structure with vitest and testing-library.
- **What needed fixing?** Copilot forgot aria-labels and the loading state wasn't visually obvious.
- **Would you structure prompts differently?** Will add "include accessibility attributes" to my prompts.

---

## Files Created

```
src/
├── routes/
│   ├── ping.tsx
│   └── orders.tsx
├── components/
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── services/
│   └── api.ts
└── types/
    └── order.ts

src/routes/__tests__/
├── ping.test.tsx
└── orders.test.tsx
```

---

## Screenshots

### Orders Page (Success State)
```
┌─────────────────────────────────────────┐
│ Orders                                   │
├─────┬──────────┬─────────┬──────────────┤
│ ID  │ Customer │ Items   │ Status       │
├─────┼──────────┼─────────┼──────────────┤
│ 1   │ Alice    │ 2 items │ pending      │
│ 2   │ Bob      │ 1 item  │ completed    │
└─────┴──────────┴─────────┴──────────────┘
```

### Loading State
```
┌─────────────────────────────────────────┐
│         ⏳ Loading orders...            │
└─────────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────────┐
│ ❌ Error loading orders                 │
│                                         │
│ Failed to fetch from /api/orders        │
│ [Retry]                                 │
└─────────────────────────────────────────┘
```

---

## PR Link

[PR #6 — Lab 2 Frontend Vertical Slice](https://github.com/example/repo/pull/6)
