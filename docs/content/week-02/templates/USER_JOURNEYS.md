# User Journeys Template

**Project:** [Project Name]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [UX Lead / Product Owner]

---

## How to Use This Template

1. **Identify 3-8 key journeys** that represent core user flows
2. **Document happy path** — the success scenario
3. **Document failure paths** — what can go wrong at each step
4. **Identify edge cases** — unusual but valid scenarios
5. **Map to FE/BE streams** — who implements what

---

## Journey Template

For each journey, complete this structure:

```
┌─────────────────────────────────────────────────────────────┐
│  JOURNEY: [Name]                                            │
│  ID: J-XXX                                                  │
├─────────────────────────────────────────────────────────────┤
│  ACTOR: [Who performs this journey]                         │
│  GOAL: [What they're trying to accomplish]                  │
│  FREQUENCY: [How often this happens]                        │
│  PRIORITY: [Must/Should/Could]                              │
├─────────────────────────────────────────────────────────────┤
│  PRECONDITIONS:                                             │
│  • [What must be true before starting]                      │
├─────────────────────────────────────────────────────────────┤
│  HAPPY PATH:                                                │
│  1. [Step] → [System Response]                              │
│  2. [Step] → [System Response]                              │
│  ...                                                        │
├─────────────────────────────────────────────────────────────┤
│  FAILURE PATHS:                                             │
│  • If [condition] → [system behavior]                       │
├─────────────────────────────────────────────────────────────┤
│  EDGE CASES:                                                │
│  • [Unusual but valid scenario]                             │
├─────────────────────────────────────────────────────────────┤
│  POSTCONDITIONS:                                            │
│  • [What is true after success]                             │
├─────────────────────────────────────────────────────────────┤
│  METRICS:                                                   │
│  • [How we measure success]                                 │
├─────────────────────────────────────────────────────────────┤
│  STREAM MAPPING:                                            │
│  • FE: [What frontend implements]                           │
│  • BE: [What backend implements]                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Journey 1: Create Order

| Attribute | Value |
|-----------|-------|
| **ID** | J-001 |
| **Actor** | Authenticated Customer |
| **Goal** | Create a new order with selected items |
| **Frequency** | High (core business function) |
| **Priority** | Must |

### Preconditions

- [ ] User is authenticated (logged in)
- [ ] User has a valid customer account
- [ ] At least one item exists in the catalog
- [ ] System is available

### Happy Path

| Step | User Action | System Response | UI State |
|------|-------------|-----------------|----------|
| 1 | User navigates to "New Order" | System displays item catalog | Item list visible |
| 2 | User selects item(s) to add | System adds item to cart | Cart updates, total shown |
| 3 | User reviews order summary | System displays total and items | Summary page |
| 4 | User clicks "Submit Order" | System validates and saves order | Loading indicator |
| 5 | — | System returns confirmation | Success message, order ID |
| 6 | User sees confirmation | System displays order details | Confirmation page |

### Failure Paths

| Condition | System Behavior | User Experience |
|-----------|-----------------|-----------------|
| Empty cart (no items selected) | Reject submission | "Please add at least one item" error |
| Session expired during submission | Redirect to login | Login page with return URL |
| Item no longer available | Reject submission | "Item X is no longer available" error |
| Server error during save | Return error | "Unable to create order. Please try again." |
| Network timeout | Return error | "Connection lost. Please check and retry." |
| Validation failure (invalid data) | Reject with details | Field-specific error messages |
| Concurrent modification | Reject with conflict | "Please refresh and try again" |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| User adds maximum allowed items (e.g., 100) | Accept order, no additional items allowed |
| User adds same item multiple times | Increase quantity or allow duplicates (TBD) |
| User navigates away during submission | Order not saved, warn user |
| Very slow network | Show loading state, timeout after X seconds |
| User double-clicks submit | Prevent duplicate submission |

### Postconditions

- [ ] Order exists in database with status "pending"
- [ ] Order has unique ID assigned
- [ ] Order total equals sum of item prices
- [ ] Order timestamp is recorded
- [ ] Audit log entry created

### Metrics

| Metric | Target |
|--------|--------|
| Success rate | ≥ 95% of submissions |
| Time to complete | ≤ 30 seconds |
| Error rate | ≤ 2% |

### Stream Mapping

| Stream | Responsibility |
|--------|----------------|
| **FE** | Item selection UI, cart management, form submission, error display, confirmation page |
| **BE** | Validation logic, order persistence, total calculation, audit logging |

---

## Journey 2: View Order History

| Attribute | Value |
|-----------|-------|
| **ID** | J-002 |
| **Actor** | Authenticated Customer |
| **Goal** | View list of past orders |
| **Frequency** | Medium |
| **Priority** | Must |

### Preconditions

- [ ] User is authenticated
- [ ] User has customer account

### Happy Path

| Step | User Action | System Response | UI State |
|------|-------------|-----------------|----------|
| 1 | User navigates to "Order History" | System fetches orders | Loading state |
| 2 | — | System returns order list | Order list displayed |
| 3 | User views order list | System displays orders | Paginated list |
| 4 | User clicks on an order | System shows order details | Detail view |

### Failure Paths

| Condition | System Behavior | User Experience |
|-----------|-----------------|-----------------|
| No orders exist | Return empty list | "No orders yet" message |
| Session expired | Redirect to login | Login page |
| Server error | Return error | "Unable to load orders" error |
| Network timeout | Return error | Retry option shown |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| User has 1000+ orders | Paginate, load on demand |
| Order was just created | Should appear in list immediately |
| Order status changed since last view | Show current status |

### Postconditions

- [ ] User can see their orders (or empty state)
- [ ] No side effects (read-only operation)

### Metrics

| Metric | Target |
|--------|--------|
| Page load time | ≤ 2 seconds |
| Pagination works | All orders accessible |

### Stream Mapping

| Stream | Responsibility |
|--------|----------------|
| **FE** | Order list UI, pagination, detail view navigation, loading/error states |
| **BE** | Order retrieval, filtering, pagination logic |

---

## Journey 3: Cancel Order

| Attribute | Value |
|-----------|-------|
| **ID** | J-003 |
| **Actor** | Authenticated Customer |
| **Goal** | Cancel a pending order |
| **Frequency** | Low |
| **Priority** | Must |

### Preconditions

- [ ] User is authenticated
- [ ] User owns the order
- [ ] Order status is "pending"

### Happy Path

| Step | User Action | System Response | UI State |
|------|-------------|-----------------|----------|
| 1 | User navigates to order detail | System displays order | Detail view |
| 2 | User clicks "Cancel Order" | System shows confirmation | Confirmation modal |
| 3 | User confirms cancellation | System updates status | Loading state |
| 4 | — | System returns success | Success message |
| 5 | User sees updated status | System shows "cancelled" | Updated detail view |

### Failure Paths

| Condition | System Behavior | User Experience |
|-----------|-----------------|-----------------|
| Order already cancelled | Reject with message | "Order is already cancelled" |
| Order not pending | Reject with message | "Cannot cancel order in [status] state" |
| User doesn't own order | 403 Forbidden | "Access denied" (or 404 for security) |
| Concurrent cancellation | Handle gracefully | "Order was already updated" |
| Server error | Return error | "Unable to cancel. Please try again." |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Order status changes during modal display | Re-validate on submit |
| User refreshes after cancellation | Show cancelled status |
| Cancellation during processing window | Define cutoff rules |

### Postconditions

- [ ] Order status changed to "cancelled"
- [ ] Audit log entry created
- [ ] Order cannot be further modified

### Metrics

| Metric | Target |
|--------|--------|
| Success rate | 100% for eligible orders |
| Time to complete | ≤ 5 seconds |

### Stream Mapping

| Stream | Responsibility |
|--------|----------------|
| **FE** | Cancel button, confirmation modal, status update display |
| **BE** | Status validation, state transition, audit logging |

---

## Journey 4: [Template for Additional Journey]

| Attribute | Value |
|-----------|-------|
| **ID** | J-00X |
| **Actor** | |
| **Goal** | |
| **Frequency** | |
| **Priority** | |

### Preconditions

- [ ] 

### Happy Path

| Step | User Action | System Response | UI State |
|------|-------------|-----------------|----------|
| 1 | | | |

### Failure Paths

| Condition | System Behavior | User Experience |
|-----------|-----------------|-----------------|
| | | |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| | |

### Postconditions

- [ ] 

### Metrics

| Metric | Target |
|--------|--------|
| | |

### Stream Mapping

| Stream | Responsibility |
|--------|----------------|
| **FE** | |
| **BE** | |

---

## Journey Summary

| ID | Journey | Actor | Priority | Sprint Target |
|----|---------|-------|----------|---------------|
| J-001 | Create Order | Customer | Must | Sprint 1 |
| J-002 | View Order History | Customer | Must | Sprint 2 |
| J-003 | Cancel Order | Customer | Must | Sprint 2 |
| J-004 | | | | |
| J-005 | | | | |

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| UX Lead | | | |
| Product Owner | | | |
| Tech Lead (FE) | | | |
| Tech Lead (BE) | | | |
| QA Lead | | | |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial creation |
| | | | |

---

## Copilot Assistance

Use this prompt to help document user journeys:

```markdown
No secrets, no production data. Use placeholders.

Based on the Order Management domain, document the user journey for:
[Journey Name]

Include:
1. Actor and goal
2. Preconditions (what must be true before starting)
3. Happy path (numbered steps with system responses)
4. At least 5 failure paths (what can go wrong)
5. Edge cases (unusual but valid scenarios)
6. Postconditions (what is true after success)
7. FE/BE stream mapping (who implements what)

Format as a structured document.
```
