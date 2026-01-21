# Implementation Plan - Order Status Update UI

> Generated with Copilot using P0 prompt, then refined with human review.

## 1. Scope Definition

### In Scope
- StatusBadge component (display only)
- StatusDropdown component (select next status)
- StatusUpdateModal component (confirmation)
- Route component with loader/action
- API client functions
- Component and integration tests

### Out of Scope
- Bulk status updates
- Status history timeline
- Email notification preferences
- Mobile-specific layouts (responsive handled by existing design system)

---

## 2. Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `StatusBadge.tsx` | CREATE | Display current status with color coding |
| `StatusDropdown.tsx` | CREATE | Show valid next statuses |
| `StatusUpdateModal.tsx` | CREATE | Confirm status change |
| `orders.$orderId.status.tsx` | CREATE | RRv7 route with loader/action |
| `orderStatusApi.ts` | CREATE | API client functions |
| `*.test.tsx` | CREATE | Test files for all components |
| `orders.$orderId.tsx` | MODIFY | Add status section to order detail |

---

## 3. Component Hierarchy

```
OrderDetailRoute
└── OrderStatusSection
    ├── StatusBadge (current status)
    ├── StatusDropdown (next statuses)
    └── StatusUpdateModal (confirmation)
        ├── Current status display
        ├── New status display
        ├── Reason input (if CANCELLED)
        ├── Cancel button
        └── Confirm button
```

---

## 4. Implementation Steps

### Step 1: Create API Client (10 min)
```typescript
// lib/orderStatusApi.ts
export async function updateOrderStatus(
  orderId: string, 
  newStatus: OrderStatus,
  reason?: string
): Promise<Order>

export async function getValidNextStatuses(
  orderId: string
): Promise<OrderStatus[]>
```

### Step 2: Create StatusBadge (10 min)
```typescript
// Simple presentational component
// Props: status: OrderStatus
// Returns colored badge with status text
```

### Step 3: Create StatusDropdown (15 min)
```typescript
// Props: currentStatus, validStatuses, onSelect
// Keyboard accessible with arrow key navigation
// Disabled when no valid transitions
```

### Step 4: Create StatusUpdateModal (20 min)
```typescript
// Props: isOpen, currentStatus, newStatus, onConfirm, onCancel
// Includes reason field when newStatus is CANCELLED
// Focus trap and ESC to close
// ARIA live region for screen readers
```

### Step 5: Create Route Component (20 min)
```typescript
// Loader: fetch order + valid next statuses
// Action: call updateOrderStatus API
// Handle Problem Details errors
// Optimistic UI update
```

### Step 6: Write Tests (30 min)
- StatusBadge: 4 tests (each status color, snapshot)
- StatusDropdown: 5 tests (render, keyboard, disabled, selection)
- StatusUpdateModal: 6 tests (open/close, confirm, cancel, reason validation, a11y)
- Route: 5 tests (loader, action success, action error, loading state)

---

## 5. Status Color Mapping

```typescript
const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
```

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Accessibility gaps | High | High | Include a11y requirements in prompts |
| Stale status (race condition) | Medium | Medium | Use optimistic update + revalidate |
| Modal focus issues | Medium | Low | Test with keyboard-only navigation |
| API error handling gaps | Low | Medium | Use Problem Details parser |

---

## 7. Testing Strategy

### Unit Tests (Components)
```
StatusBadge.test.tsx
✓ renders PENDING with yellow badge
✓ renders CONFIRMED with blue badge
✓ renders SHIPPED with purple badge
✓ renders DELIVERED with green badge
✓ renders CANCELLED with red badge

StatusDropdown.test.tsx
✓ renders all valid next statuses
✓ handles keyboard navigation (arrow keys)
✓ calls onSelect when status clicked
✓ shows disabled state when no valid transitions
✓ has accessible name and role

StatusUpdateModal.test.tsx
✓ renders current and new status
✓ shows reason input for CANCELLED
✓ validates reason is required for CANCELLED
✓ calls onConfirm with correct data
✓ calls onCancel when cancelled
✓ traps focus within modal
✓ closes on ESC key
```

### Integration Tests (Route)
```
orders.$orderId.status.test.tsx
✓ loader returns order and valid statuses
✓ action updates status successfully
✓ action handles 400 error with Problem Details
✓ action handles 404 error
✓ shows loading state during action
```

---

## 8. Accessibility Requirements

- All interactive elements keyboard accessible
- Focus trapped in modal when open
- ESC key closes modal
- ARIA labels on all controls
- Color is not the only indicator (icons + text + color)
- Screen reader announcements for status changes
- Sufficient color contrast (WCAG AA)

---

## 9. Acceptance Checklist

- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Coverage > 80%
- [ ] Keyboard navigation works
- [ ] Screen reader tested (VoiceOver/NVDA)
- [ ] README.md complete with reflection answers

---

## Plan Approval

- **Reviewed by:** [Instructor/Peer Name]
- **Date:** [Date]
- **Status:** ✅ Approved / ⚠️ Approved with changes / ❌ Needs revision

**Notes:** 
