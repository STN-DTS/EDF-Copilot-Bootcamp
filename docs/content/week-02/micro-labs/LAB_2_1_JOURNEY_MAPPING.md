# Lab 2-1 — Journey Mapping Solo

## Goal

Practice mapping a complete user journey with happy path, failure paths, and edge cases. Learn to identify the ~70% of implementation effort that goes into error handling.

## Timebox

45 minutes

## Prerequisites

- Completed Lab 2-0
- Reviewed [User Journeys Template](../templates/USER_JOURNEYS.md)
- Attended Day 3 Training: Journey Anatomy

## Domain Context

You are mapping the **"Cancel Order"** journey for the Order Management System.

**Business Rules:**
- Orders can only be cancelled if status is "Pending" or "Confirmed"
- Orders with status "Shipped" or "Delivered" cannot be cancelled
- Cancellation must be requested within 24 hours of order creation
- Customer must provide a cancellation reason
- Refunds are processed within 5 business days

---

## Task

### Step 1: Map the Happy Path (10 min)

Document the successful cancellation flow:

**Journey Template:**
```markdown
## Journey: Cancel Order

**Actor:** Customer (authenticated)
**Goal:** Cancel an existing order and receive refund

### Preconditions
- Customer is logged in
- Customer has at least one order in cancellable state

### Happy Path
| Step | User Action | System Response |
|------|-------------|-----------------|
| 1 | Navigate to "My Orders" | Display list of orders with status |
| 2 | Click on order to cancel | Display order detail with Cancel button |
| 3 | Click "Cancel Order" button | Show confirmation dialog |
| 4 | Select cancellation reason | Reason captured |
| 5 | Click "Confirm Cancellation" | Process cancellation |
| 6 | — | Display success message |
| 7 | — | Send confirmation email |

### Postconditions
- Order status changed to "Cancelled"
- Refund initiated
- Confirmation email sent
```

### Step 2: Map Failure Paths (20 min)

Identify at least 5 failure scenarios:

| Failure | Trigger | System Response | User Recovery |
|---------|---------|-----------------|---------------|
| F1: Order not found | Invalid order ID | 404 error with message | Return to orders list |
| F2: Already shipped | Order status = "Shipped" | 409 error, explain why | Contact support |
| F3: Time window expired | >24 hours since creation | 422 error with explanation | Contact support |
| F4: Not owner | Order belongs to different customer | 403 forbidden | None (logged) |
| F5: System error | Database unavailable | 503 with retry option | Retry later |

For each failure, document:
- Error message shown to user
- HTTP status code (if API)
- Whether user can retry

### Step 3: Identify Edge Cases (10 min)

Consider scenarios that aren't clearly happy or failure:

| Edge Case | Scenario | Expected Behavior |
|-----------|----------|-------------------|
| E1 | Partial shipment (some items shipped) | Allow cancellation of unshipped items only |
| E2 | Order with promotional discount | Refund discounted amount, note code status |
| E3 | Concurrent cancellation attempts | Process first, reject second idempotently |
| E4 | Cancellation during payment processing | Wait for payment completion, then process |

### Step 4: Use Copilot for Assistance (5 min)

Ask Copilot to review your journey:

```markdown
@workspace Review this user journey for the Cancel Order feature.

[Paste your journey document]

Identify:
1. Missing failure paths
2. Edge cases I haven't considered
3. Security concerns
4. Accessibility considerations
```

---

## Submission

### Folder Structure

```
/working/constraints/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── JOURNEY_CANCEL_ORDER.md
└── COPILOT_REVIEW.md
```

### JOURNEY_CANCEL_ORDER.md Structure

```markdown
# User Journey: Cancel Order

## Metadata
| Attribute | Value |
|-----------|-------|
| Actor | Customer |
| Goal | Cancel order and receive refund |
| Priority | Must Have |
| Complexity | Medium |

## Preconditions
- Customer is authenticated
- Order exists and is owned by customer

## Happy Path
| Step | User Action | System Response |
|------|-------------|-----------------|
| 1 | ... | ... |

## Failure Paths
### F1: Order Not Found
- Trigger: ...
- Response: ...
- Recovery: ...

### F2: Already Shipped
...

## Edge Cases
### E1: Partial Shipment
...

## Postconditions
- Order status = "Cancelled"
- Refund initiated
- Audit log created

## Metrics
| Metric | Target |
|--------|--------|
| Success rate | >95% |
| Time to complete | <30 seconds |
```

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ Happy Path | 3-7 steps documented with system responses |
| ✅ Failure Paths | At least 5 failure scenarios documented |
| ✅ Edge Cases | At least 3 edge cases identified |
| ✅ Recovery Actions | Each failure has user recovery path |
| ✅ Copilot Review | Copilot feedback incorporated |

---

## Reflection Questions

1. What percentage of your journey document covers failures vs. happy path?
2. Which failure path would be hardest to implement? Why?
3. Did Copilot identify scenarios you hadn't considered?

---

## Scoring Guide

| Score | Criteria |
|-------|----------|
| ⭐⭐⭐ | 5+ failures, 3+ edge cases, complete recovery paths |
| ⭐⭐ | 3-4 failures, 1-2 edge cases, most recovery paths |
| ⭐ | <3 failures, no edge cases, incomplete recovery |

---

## Reference

- [User Journeys Template](../templates/USER_JOURNEYS.md)
- [Example: Cancel Order Journey](../examples/USER_JOURNEY_CANCEL_ORDER.md)
- [Week 2 Program](../WEEK_2_PROGRAM.md)
