# Acceptance Criteria Template

**Project:** [Project Name]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [QA Lead / Product Owner]

---

## How to Use This Template

1. **Write AC for every objective** in the Must/Should categories
2. **Use Given/When/Then format** for consistency and testability
3. **Include failure scenarios** — not just happy paths
4. **Map to test types** — how will each AC be verified?
5. **Get QA sign-off** — AC must be testable before implementation

---

## Given/When/Then Format

```gherkin
Scenario: [Brief description]
  Given [precondition — the starting state]
  And [additional precondition if needed]
  When [action — what the user/system does]
  And [additional action if needed]
  Then [expected outcome — what should happen]
  And [additional outcome if needed]
```

**Rules:**
- Each scenario tests ONE thing
- "Given" sets up state (not actions)
- "When" is the trigger (user action or system event)
- "Then" is the observable outcome (can be verified)
- Keep scenarios independent (can run in any order)

---

## Acceptance Criteria by Objective

### Objective M-001: User Can Create Order

**Journey Reference:** [J-001 Create Order](USER_JOURNEYS.md#journey-1-create-order)

#### AC-001: Happy Path — Create Order with Items

```gherkin
Scenario: Customer creates order with multiple items
  Given a customer with id "CUST-001" is authenticated
  And items with ids "ITEM-001", "ITEM-002" exist in catalog
  And "ITEM-001" has price 9.99
  And "ITEM-002" has price 14.99
  When the customer creates an order with items "ITEM-001", "ITEM-002"
  Then the order is created with status "pending"
  And the order has a unique id assigned
  And the order total equals 24.98
  And the order createdAt timestamp is recorded
  And an audit log entry is created for "ORDER_CREATED"
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| E2E Test | QA | Playwright/Cypress |
| Integration Test | BE Dev | Spring Boot Test |
| Unit Test (total calc) | BE Dev | JUnit |

#### AC-002: Validation — Empty Cart Rejected

```gherkin
Scenario: System rejects order with no items
  Given a customer with id "CUST-001" is authenticated
  When the customer attempts to create an order with no items
  Then the order is not created
  And an error is returned with code "VALIDATION_ERROR"
  And the error message indicates "Order must contain at least one item"
  And HTTP status 400 is returned
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Unit Test | BE Dev | JUnit |
| E2E Test | QA | Playwright |

#### AC-003: Validation — Invalid Item Rejected

```gherkin
Scenario: System rejects order with non-existent item
  Given a customer with id "CUST-001" is authenticated
  And item with id "ITEM-999" does not exist
  When the customer attempts to create an order with item "ITEM-999"
  Then the order is not created
  And an error is returned with code "ITEM_NOT_FOUND"
  And HTTP status 400 is returned
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Unit Test | BE Dev | JUnit |
| Integration Test | BE Dev | Spring Boot Test |

#### AC-004: Authentication — Unauthenticated Request Rejected

```gherkin
Scenario: System rejects order from unauthenticated user
  Given no user is authenticated
  When a request to create an order is received
  Then the order is not created
  And HTTP status 401 is returned
  And the response includes authentication challenge
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Integration Test | BE Dev | Spring Security Test |

#### AC-005: Error Handling — Server Error

```gherkin
Scenario: System handles internal error gracefully
  Given a customer with id "CUST-001" is authenticated
  And the database is unavailable
  When the customer attempts to create an order
  Then an error is returned with code "INTERNAL_ERROR"
  And HTTP status 500 is returned
  And the error follows Problem Details format (RFC 7807)
  And no partial order is created
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Integration Test | BE Dev | Testcontainers |

---

### Objective M-002: User Can View Order History

**Journey Reference:** [J-002 View Order History](USER_JOURNEYS.md#journey-2-view-order-history)

#### AC-006: Happy Path — View Orders

```gherkin
Scenario: Customer views their order history
  Given a customer with id "CUST-001" is authenticated
  And customer "CUST-001" has orders with ids "ORD-001", "ORD-002"
  When the customer requests their order history
  Then orders "ORD-001" and "ORD-002" are returned
  And each order includes id, status, total, and createdAt
  And orders are sorted by createdAt descending
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| E2E Test | QA | Playwright |
| Integration Test | BE Dev | Spring Boot Test |

#### AC-007: Empty State — No Orders

```gherkin
Scenario: Customer with no orders sees empty state
  Given a customer with id "CUST-002" is authenticated
  And customer "CUST-002" has no orders
  When the customer requests their order history
  Then an empty list is returned
  And HTTP status 200 is returned
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| E2E Test | QA | Playwright |
| Unit Test | FE Dev | Vitest |

#### AC-008: Pagination — Large Order Set

```gherkin
Scenario: Customer with many orders sees paginated results
  Given a customer with id "CUST-003" is authenticated
  And customer "CUST-003" has 150 orders
  When the customer requests their order history with page 1, size 20
  Then 20 orders are returned
  And pagination metadata indicates 150 total, 8 pages
  And next page link is provided
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Integration Test | BE Dev | Spring Boot Test |
| E2E Test | QA | Playwright |

#### AC-009: Security — Cannot View Other Customer's Orders

```gherkin
Scenario: Customer cannot access another customer's orders
  Given a customer with id "CUST-001" is authenticated
  And customer "CUST-002" has orders
  When customer "CUST-001" attempts to view "CUST-002" orders
  Then HTTP status 403 is returned
  Or HTTP status 404 is returned (for security, don't reveal existence)
  And no orders are returned
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Security Test | BE Dev | Spring Security Test |

---

### Objective M-003: User Can Cancel Order

**Journey Reference:** [J-003 Cancel Order](USER_JOURNEYS.md#journey-3-cancel-order)

#### AC-010: Happy Path — Cancel Pending Order

```gherkin
Scenario: Customer cancels a pending order
  Given a customer with id "CUST-001" is authenticated
  And order "ORD-001" exists with status "pending"
  And order "ORD-001" belongs to customer "CUST-001"
  When the customer cancels order "ORD-001"
  Then order "ORD-001" status changes to "cancelled"
  And HTTP status 200 is returned
  And an audit log entry is created for "ORDER_CANCELLED"
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| E2E Test | QA | Playwright |
| Integration Test | BE Dev | Spring Boot Test |

#### AC-011: Validation — Cannot Cancel Non-Pending Order

```gherkin
Scenario: Customer cannot cancel order that is not pending
  Given a customer with id "CUST-001" is authenticated
  And order "ORD-002" exists with status "processing"
  When the customer attempts to cancel order "ORD-002"
  Then the order status remains "processing"
  And an error is returned with code "INVALID_STATE_TRANSITION"
  And HTTP status 409 is returned
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Unit Test | BE Dev | JUnit |
| Integration Test | BE Dev | Spring Boot Test |

#### AC-012: Security — Cannot Cancel Another Customer's Order

```gherkin
Scenario: Customer cannot cancel order they don't own
  Given a customer with id "CUST-001" is authenticated
  And order "ORD-003" belongs to customer "CUST-002"
  When customer "CUST-001" attempts to cancel order "ORD-003"
  Then HTTP status 403 is returned
  Or HTTP status 404 is returned
  And order "ORD-003" is not modified
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Security Test | BE Dev | Spring Security Test |

---

### Objective M-005: All Data Changes Are Auditable

#### AC-013: Audit Log — Order Created

```gherkin
Scenario: Order creation is logged
  Given a customer creates an order
  When the order is successfully created
  Then an audit log entry is created with:
    | field | value |
    | eventType | ORDER_CREATED |
    | entityId | <order_id> |
    | userId | <customer_id> |
    | timestamp | <creation_time> |
  And the audit log is persisted to the audit table
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Integration Test | BE Dev | Spring Boot Test |

#### AC-014: Audit Log — Order Cancelled

```gherkin
Scenario: Order cancellation is logged
  Given a customer cancels a pending order
  When the order is successfully cancelled
  Then an audit log entry is created with:
    | field | value |
    | eventType | ORDER_CANCELLED |
    | entityId | <order_id> |
    | userId | <customer_id> |
    | previousStatus | pending |
    | newStatus | cancelled |
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Integration Test | BE Dev | Spring Boot Test |

---

### Objective M-006: Accessibility (WCAG 2.1 AA)

#### AC-015: Keyboard Navigation

```gherkin
Scenario: All interactive elements are keyboard accessible
  Given the order management UI is loaded
  When a user navigates using only keyboard (Tab, Enter, Escape)
  Then all buttons, links, and form fields can be reached
  And focus indicators are visible on each element
  And actions can be triggered without a mouse
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Accessibility Test | FE Dev | axe-core + manual |
| E2E Test | QA | Playwright accessibility |

#### AC-016: Screen Reader Compatibility

```gherkin
Scenario: Screen readers can announce content correctly
  Given a user is using a screen reader
  When navigating the order list
  Then each order is announced with its status and total
  And error messages are announced immediately
  And loading states are announced
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Accessibility Test | FE Dev | Manual with NVDA/VoiceOver |

#### AC-017: Color Contrast

```gherkin
Scenario: Text meets contrast requirements
  Given the application UI
  When measuring text color contrast against background
  Then normal text has contrast ratio ≥ 4.5:1
  And large text has contrast ratio ≥ 3:1
  And UI components have contrast ratio ≥ 3:1
```

| Test Type | Owner | Automation |
|-----------|-------|------------|
| Accessibility Test | FE Dev | Lighthouse audit |

---

## Acceptance Criteria Summary

| ID | Objective | Scenario | Priority | Sprint Target |
|----|-----------|----------|----------|---------------|
| AC-001 | M-001 | Create order with items | Must | Sprint 1 |
| AC-002 | M-001 | Empty cart rejected | Must | Sprint 1 |
| AC-003 | M-001 | Invalid item rejected | Must | Sprint 1 |
| AC-004 | M-001 | Unauthenticated rejected | Must | Sprint 1 |
| AC-005 | M-001 | Server error handling | Must | Sprint 1 |
| AC-006 | M-002 | View orders | Must | Sprint 2 |
| AC-007 | M-002 | Empty state | Must | Sprint 2 |
| AC-008 | M-002 | Pagination | Should | Sprint 2 |
| AC-009 | M-002 | Security - no cross-access | Must | Sprint 2 |
| AC-010 | M-003 | Cancel pending order | Must | Sprint 2 |
| AC-011 | M-003 | Cannot cancel non-pending | Must | Sprint 2 |
| AC-012 | M-003 | Security - own orders only | Must | Sprint 2 |
| AC-013 | M-005 | Audit - order created | Must | Sprint 1 |
| AC-014 | M-005 | Audit - order cancelled | Must | Sprint 2 |
| AC-015 | M-006 | Keyboard navigation | Must | Sprint 3 |
| AC-016 | M-006 | Screen reader | Must | Sprint 3 |
| AC-017 | M-006 | Color contrast | Must | Sprint 3 |

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Product Owner | | | |
| Tech Lead (FE) | | | |
| Tech Lead (BE) | | | |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial creation |
| | | | |

---

## Copilot Assistance

Use this prompt to help write acceptance criteria:

```markdown
No secrets, no production data. Use placeholders.

Convert this user journey into acceptance criteria using Given/When/Then format:

Journey: [Journey Name]
Steps:
1. [Step 1]
2. [Step 2]
...

Include criteria for:
- Happy path success (AC-XXX)
- Validation failures (AC-XXX)
- Authentication/authorization (AC-XXX)
- Error handling (AC-XXX)
- Edge cases (AC-XXX)

For each AC, specify:
- Test type (Unit/Integration/E2E/Security)
- Owner (FE Dev/BE Dev/QA)
- Automation approach
```
