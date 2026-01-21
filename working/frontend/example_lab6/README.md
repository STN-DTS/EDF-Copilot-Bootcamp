# Lab 6 Capstone - Frontend Example

## Submission Info
- **Name:** Example Submission
- **Date:** 2025-01-20
- **Lab:** Lab 6 - Capstone Mini-Feature

---

## Feature Implemented

**Order Status Update UI** - Complete vertical slice allowing CSRs to view and update order status from the UI.

### User Story
> As a customer service representative, I want to update an order's status from the order detail page so that I can process orders efficiently.

### Acceptance Criteria
- [ ] Status badge component showing current status
- [ ] Status update dropdown with valid next statuses only
- [ ] Confirmation modal before status change
- [ ] Success toast notification on update
- [ ] Error handling with user-friendly messages
- [ ] Loading states during API calls

---

## Files Included

```
example_lab6/
├── README.md                           # This file
├── PLAN.md                             # Approved implementation plan
├── src/
│   ├── routes/
│   │   └── orders.$orderId.status.tsx  # RRv7 route component
│   ├── components/
│   │   ├── StatusBadge.tsx             # Status display component
│   │   ├── StatusUpdateModal.tsx       # Confirmation modal
│   │   └── StatusDropdown.tsx          # Available statuses dropdown
│   └── lib/
│       └── orderStatusApi.ts           # API client functions
└── test/
    ├── routes/
    │   └── orders.$orderId.status.test.tsx
    └── components/
        ├── StatusBadge.test.tsx
        ├── StatusUpdateModal.test.tsx
        └── StatusDropdown.test.tsx
```

---

## Verification Commands Run

```bash
# Type check
npx tsc --noEmit
# ✅ No errors

# Test execution
npm test -- --run
# ✅ Tests: 18 passed, 18 total

# Coverage
npm test -- --coverage
# ✅ Statements: 92%, Branches: 88%, Lines: 91%

# Lint
npm run lint
# ✅ No warnings
```

---

## Copilot vs Human Notes

| Component | AI Generated | Human Modified | Reason |
|-----------|--------------|----------------|--------|
| StatusBadge.tsx | ✅ 100% | - | Simple presentational component |
| StatusDropdown.tsx | ✅ 85% | 15% | Added keyboard navigation |
| StatusUpdateModal.tsx | ✅ 75% | 25% | Improved accessibility (aria) |
| Route component | ✅ 70% | 30% | Fixed loader error handling |
| API client | ✅ 90% | 10% | Added retry logic |
| StatusBadge tests | ✅ 100% | - | Straightforward snapshot tests |
| Modal tests | ✅ 60% | 40% | Added focus trap testing |

### Key Human Interventions
1. **Accessibility** - Added ARIA labels, focus management, keyboard navigation that Copilot initially missed
2. **Error boundary** - Wrapped route in error boundary for graceful degradation
3. **Optimistic updates** - Changed from refetch to optimistic update pattern for better UX
4. **Problem Details parsing** - Copilot used generic error handling; changed to parse Problem Details

---

## Reflection Answers

### What AI-assisted patterns worked well?
Component scaffolding was excellent. Using P2 to generate the initial component structure saved significant time. Copilot correctly inferred the RRv7 patterns from the existing codebase.

### What required human judgment?
Accessibility (a11y) was consistently under-addressed by AI. Modal focus trapping, keyboard navigation, screen reader announcements all required manual enhancement based on WCAG guidelines.

### What would you do differently next time?
Include accessibility requirements explicitly in the initial prompt. Instead of "create a modal", say "create an accessible modal with focus trap, ESC to close, and ARIA live region for status announcements."

---

## Time Tracking

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Planning (P0) | 10 min | 12 min | Extra iteration on a11y requirements |
| Tests First | 25 min | 30 min | Modal tests complex |
| Implementation | 35 min | 40 min | Accessibility took extra time |
| API Integration | 15 min | 12 min | Backend already done |
| Documentation | 15 min | 15 min | On target |
| **Total** | **100 min** | **109 min** | 9% over due to a11y |

