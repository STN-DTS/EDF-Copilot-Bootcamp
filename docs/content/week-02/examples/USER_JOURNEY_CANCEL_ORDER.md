# User Journey: Cancel Order

## Metadata

| Attribute | Value |
|-----------|-------|
| **Journey ID** | J-003 |
| **Actor** | Customer (authenticated) |
| **Goal** | Cancel an existing order and receive refund |
| **Priority** | Must Have |
| **Complexity** | Medium |
| **Related Stories** | US-005, US-012 |

---

## Preconditions

- Customer is authenticated (logged in)
- Customer has at least one order in their account
- Order is in a cancellable state (Pending or Confirmed)
- Order was created within the last 24 hours

---

## Happy Path

| Step | User Action | System Response | UI Element |
|------|-------------|-----------------|------------|
| 1 | Navigate to "My Orders" | Display list of orders with status | Orders list page |
| 2 | Click on order to cancel | Display order detail with items, total, status | Order detail page |
| 3 | Click "Cancel Order" button | Display cancellation confirmation dialog | Modal dialog |
| 4 | Select cancellation reason from dropdown | Reason selected | Dropdown menu |
| 5 | Click "Confirm Cancellation" | Process cancellation request | Button |
| 6 | — | Display success message: "Order cancelled successfully" | Toast notification |
| 7 | — | Update order status to "Cancelled" | Status badge |
| 8 | — | Send cancellation confirmation email | (Background) |
| 9 | — | Initiate refund process | (Background) |

---

## Failure Paths

### F1: Order Already Shipped

| Attribute | Value |
|-----------|-------|
| **Trigger** | Order status is "Shipped" or "Delivered" |
| **System Response** | Error message: "This order has already been shipped and cannot be cancelled." |
| **HTTP Status** | 409 Conflict |
| **User Recovery** | Contact customer support link provided |
| **UI State** | "Cancel Order" button disabled with tooltip explaining why |

### F2: Cancellation Window Expired

| Attribute | Value |
|-----------|-------|
| **Trigger** | Order created more than 24 hours ago |
| **System Response** | Error message: "Cancellation window has expired. Orders can only be cancelled within 24 hours of placement." |
| **HTTP Status** | 422 Unprocessable Entity |
| **User Recovery** | Contact customer support link provided |
| **UI State** | Show time elapsed since order creation |

### F3: Order Not Found

| Attribute | Value |
|-----------|-------|
| **Trigger** | Order ID doesn't exist or was deleted |
| **System Response** | Error message: "Order not found." |
| **HTTP Status** | 404 Not Found |
| **User Recovery** | Return to orders list button |
| **UI State** | Redirect to orders list with error toast |

### F4: Not Order Owner

| Attribute | Value |
|-----------|-------|
| **Trigger** | Customer attempts to cancel another customer's order |
| **System Response** | Error message: "You don't have permission to cancel this order." |
| **HTTP Status** | 403 Forbidden |
| **User Recovery** | None (security event logged) |
| **UI State** | Redirect to orders list, security team notified |

### F5: System Unavailable

| Attribute | Value |
|-----------|-------|
| **Trigger** | Database or order service unavailable |
| **System Response** | Error message: "We're experiencing technical difficulties. Please try again later." |
| **HTTP Status** | 503 Service Unavailable |
| **User Recovery** | Retry button, try again later |
| **UI State** | Show error state with retry option and estimated wait time |

### F6: Concurrent Modification

| Attribute | Value |
|-----------|-------|
| **Trigger** | Order status changed while user was viewing (e.g., shipped during cancellation attempt) |
| **System Response** | Error message: "Order status has changed. Please refresh and try again." |
| **HTTP Status** | 409 Conflict |
| **User Recovery** | Refresh page to see current status |
| **UI State** | Refresh button, show updated order status |

---

## Edge Cases

### E1: Partial Shipment

| Attribute | Value |
|-----------|-------|
| **Scenario** | Some items in order shipped, some still pending |
| **Expected Behavior** | Show which items can be cancelled, allow partial cancellation |
| **Business Rule** | Only unshipped items can be cancelled |
| **Refund** | Partial refund for cancelled items only |
| **UI** | Checkbox for each unshipped item, subtotal updates dynamically |

### E2: Order with Promotional Discount

| Attribute | Value |
|-----------|-------|
| **Scenario** | Order had a "20% off" or "free shipping" discount applied |
| **Expected Behavior** | Refund original payment amount (after discount was applied) |
| **Business Rule** | Discount codes become single-use after refund (cannot be reused) |
| **Note** | Inform customer about discount code status in cancellation confirmation |

### E3: Order at Exactly 24-Hour Mark

| Attribute | Value |
|-----------|-------|
| **Scenario** | Customer clicks cancel at 23:59:59 |
| **Expected Behavior** | Allow if request received before cutoff |
| **Business Rule** | Use server timestamp, not client time |
| **Race Condition** | Accept if request initiated before cutoff, even if processed after |

### E4: Multiple Cancellation Requests

| Attribute | Value |
|-----------|-------|
| **Scenario** | Customer double-clicks cancel button or submits multiple times |
| **Expected Behavior** | Process only once, subsequent requests return same success |
| **Business Rule** | Idempotent operation based on order ID |
| **Implementation** | Use idempotency key or status check before processing |

---

## Postconditions

**On Success:**
- Order status = "Cancelled"
- Order.cancelledAt = current timestamp
- Order.cancellationReason = selected reason
- Refund initiated (payment service notified)
- Inventory restored (items returned to available stock)
- Audit log entry created with user, timestamp, reason
- Confirmation email sent to customer email address

**On Failure:**
- Order status unchanged
- Error logged with context (order ID, user ID, error type)
- User informed with appropriate error message
- Recovery option provided where applicable

---

## Data Changes

| Entity | Field | Before | After |
|--------|-------|--------|-------|
| Order | status | Pending/Confirmed | Cancelled |
| Order | cancelledAt | null | 2026-01-20T15:30:00Z |
| Order | cancellationReason | null | "Changed my mind" |
| Order | updatedAt | (previous) | 2026-01-20T15:30:00Z |
| Refund | (new record) | — | Created with order reference |
| AuditLog | (new record) | — | Created with action details |

---

## API Endpoints

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | /api/v1/orders/{id}/cancel | `{ "reason": "..." }` | `{ order: {...}, refund: {...} }` |
| GET | /api/v1/orders/{id} | — | Order with status |
| GET | /api/v1/orders | — | List of orders |

---

## Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cancellation success rate | >95% | Success / (Success + Failure) |
| Time to complete | <30 seconds | P95 journey duration |
| User satisfaction | >4.0/5.0 | Post-cancellation survey |
| Error rate | <2% | Failed cancellations / attempts |
| Refund initiation time | <1 minute | Order cancelled → Refund created |

---

## Accessibility Notes

- Cancel button must be keyboard accessible (Tab + Enter)
- Confirmation dialog traps focus until dismissed
- Status changes announced to screen readers via aria-live
- Color is not the only indicator of order status (use icons + text)
- Error messages are associated with form fields via aria-describedby
- Modal can be closed with Escape key

---

## Security Notes

- Verify order ownership before allowing cancellation (server-side)
- Log all cancellation attempts (success and failure) with user context
- Rate limit cancellation attempts per user (max 10/hour)
- Validate cancellation reason (no XSS, max 500 chars)
- Use CSRF token for state-changing operations
- Audit trail must be immutable

---

## Related Journeys

| Journey | Relationship |
|---------|--------------|
| J-001: Create Order | Precursor - order must exist |
| J-002: View Order | User views before cancelling |
| J-004: Track Refund | Follow-up - after cancellation |
| J-005: Contact Support | Alternative when cancellation fails |
