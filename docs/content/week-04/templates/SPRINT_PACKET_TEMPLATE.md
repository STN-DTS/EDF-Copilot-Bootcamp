# Sprint Packet Template

**Sprint:** Sprint [X]  
**Dates:** [Start Date] — [End Date]  
**Version:** 1.0  
**Owner:** [Product Owner]

---

## Sprint Goal

### Goal Statement

> [One sentence describing what this sprint proves or delivers]

**Example:**
> Prove the end-to-end pipeline: a user can create an order, persist it, and view it — with auth, logging, and tests.

### Definition of Done

This sprint is **Done** when:
- [ ] All acceptance criteria verified
- [ ] All tests passing (unit, integration, contract)
- [ ] No critical/high security findings
- [ ] Code reviewed and merged
- [ ] Demo completed to stakeholders

---

## In-Scope Items

### User Stories / Features

| ID | Story | Priority | Owner | AC Count |
|----|-------|----------|-------|----------|
| US-001 | As a customer, I can create an order | P1 | [Name] | 5 |
| US-002 | As a customer, I can view my orders | P1 | [Name] | 4 |
| US-003 | As a customer, I can cancel a pending order | P2 | [Name] | 3 |

### Technical Tasks

| ID | Task | Owner | Dependency |
|----|------|-------|------------|
| TT-001 | Implement Order entity and repository | [BE Dev] | - |
| TT-002 | Implement OrderService with business rules | [BE Dev] | TT-001 |
| TT-003 | Implement OrderController | [BE Dev] | TT-002 |
| TT-004 | Create Orders route with loader | [FE Dev] | Mock server |
| TT-005 | Create Order form with action | [FE Dev] | TT-004 |

### Files/Paths Affected

**Backend:**
```
src/main/java/com/example/ordermgmt/
├── entity/Order.java
├── entity/OrderItem.java
├── repository/OrderRepository.java
├── service/OrderService.java
├── controller/v1/OrderController.java
├── dto/v1/CreateOrderRequest.java
├── dto/v1/OrderResponse.java
└── exception/OrderNotFoundException.java
```

**Frontend:**
```
src/
├── routes/orders/
│   ├── route.tsx       # Orders list
│   └── $id/
│       └── route.tsx   # Order detail
├── routes/orders.new/
│   └── route.tsx       # Create order
├── components/orders/
│   ├── OrderCard.tsx
│   ├── OrderForm.tsx
│   └── OrderList.tsx
└── types/order.ts
```

### API Endpoints (from OpenAPI)

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/v1/orders` | GET | In Scope |
| `/api/v1/orders` | POST | In Scope |
| `/api/v1/orders/{id}` | GET | In Scope |
| `/api/v1/orders/{id}/cancel` | PUT | In Scope |

---

## Out-of-Scope Items

**Explicit exclusions for this sprint:**

| Feature | Reason | Target Sprint |
|---------|--------|---------------|
| Order editing | Not in MVP | Sprint 2 |
| Bulk order creation | Nice to have | Sprint 3 |
| Order export to PDF | Nice to have | Sprint 4 |
| Admin order management | Different persona | Sprint 3 |

---

## Acceptance Criteria

### US-001: Create Order

**AC-001-01: Successful order creation**
- **Given:** Customer is authenticated
- **When:** Customer submits order with valid items (1-50)
- **Then:** Order is created with status CREATED
- **And:** Customer sees confirmation with order ID
- **Test:** Integration test with mock items

**AC-001-02: Empty order rejected**
- **Given:** Customer is authenticated
- **When:** Customer submits order with no items
- **Then:** Validation error is returned (400)
- **And:** Error message indicates "Order must contain at least one item"
- **Test:** Unit test for validation

**AC-001-03: Exceeds item limit rejected**
- **Given:** Customer is authenticated
- **When:** Customer submits order with >50 items
- **Then:** Validation error is returned (400)
- **And:** Error message indicates item limit exceeded
- **Test:** Unit test for validation

**AC-001-04: Unauthenticated request rejected**
- **Given:** No authentication token provided
- **When:** Request to create order is made
- **Then:** 401 Unauthorized returned
- **Test:** Integration test

**AC-001-05: Order total calculated correctly**
- **Given:** Customer submits order with multiple items
- **When:** Order is created
- **Then:** `totalAmount = SUM(quantity × unitPrice)` for all items
- **Test:** Unit test for calculation

---

### US-002: View Orders

**AC-002-01: List orders for customer**
- **Given:** Customer is authenticated
- **When:** Customer navigates to My Orders
- **Then:** List of customer's orders displayed
- **And:** Orders sorted by createdAt descending
- **Test:** Integration test

**AC-002-02: Pagination works**
- **Given:** Customer has >20 orders
- **When:** Customer views order list
- **Then:** First 20 orders shown with pagination controls
- **Test:** Integration test

**AC-002-03: Filter by status**
- **Given:** Customer has orders in multiple statuses
- **When:** Customer filters by status SHIPPED
- **Then:** Only SHIPPED orders displayed
- **Test:** Integration test

**AC-002-04: View order details**
- **Given:** Customer is authenticated
- **When:** Customer clicks on an order
- **Then:** Order detail page shows all fields and items
- **Test:** Integration test

---

### US-003: Cancel Order

**AC-003-01: Cancel pending order**
- **Given:** Order exists with status CREATED
- **When:** Customer cancels the order
- **Then:** Order status changes to CANCELLED
- **And:** Customer sees cancellation confirmation
- **Test:** Integration test

**AC-003-02: Cannot cancel shipped order**
- **Given:** Order exists with status SHIPPED
- **When:** Customer attempts to cancel
- **Then:** 409 Conflict returned
- **And:** Error message explains order cannot be cancelled
- **Test:** Integration test

**AC-003-03: Cancel nonexistent order**
- **Given:** Order ID does not exist
- **When:** Cancel request is made
- **Then:** 404 Not Found returned
- **Test:** Integration test

---

## Technical Requirements

### Security

| Requirement | Implementation | Owner |
|-------------|----------------|-------|
| Authentication required | Bearer token validation | BE |
| Authorization | Customer can only see own orders | BE |
| Input validation | Bean Validation on DTOs | BE |
| XSS prevention | React escaping | FE |

### Logging

| Event | Log Level | Required Fields |
|-------|-----------|-----------------|
| Order created | INFO | orderId, customerId, itemCount, total |
| Order cancelled | INFO | orderId, customerId, previousStatus |
| Validation error | WARN | endpoint, errors, correlationId |
| Unexpected error | ERROR | exception, stackTrace, correlationId |

### Error Handling

All error responses must use RFC 7807 Problem Details format:
- See [ADR-002: Error Handling](../../week-03/adrs/002-error-handling.md)

### Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| GET /orders response | < 200ms (p95) | APM |
| POST /orders response | < 500ms (p95) | APM |
| Page load | < 2s TTI | Lighthouse |

---

## Dependencies

### External Dependencies

| Dependency | Owner | Status | Blocker? |
|------------|-------|--------|----------|
| Customer API | Customer Team | Available | No |
| Item Catalog API | Catalog Team | Available | No |
| Auth Service | Identity Team | Available | No |

### Internal Dependencies

| Dependency | Owner | Status | Blocker? |
|------------|-------|--------|----------|
| OpenAPI contract locked | Tech Leads | ✅ Done | No |
| Mock server operational | FE Lead | ✅ Done | No |
| Database schema | BE Lead | ⏳ In Progress | No |

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Customer API latency | Medium | Medium | Implement timeout and fallback |
| Oracle schema changes | Low | High | Lock schema early, use migrations |
| Scope creep | Medium | Medium | Strict PR review against packet |

---

## Sprint Ceremonies

| Ceremony | When | Duration | Participants |
|----------|------|----------|--------------|
| Sprint Planning | Day 1, 9:00 AM | 2 hours | All |
| Daily Standup | Daily, 9:30 AM | 15 min | All |
| Contract Council | Day 3, 2:00 PM | 30 min | Leads |
| Sprint Review | Day 10, 2:00 PM | 1 hour | All + Stakeholders |
| Sprint Retro | Day 10, 3:30 PM | 1 hour | All |

---

## Sign-off

### Packet Approval (Pre-Sprint)

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| FE Lead | | | |
| BE Lead | | | |
| QA Lead | | | |

### Sprint Completion (Post-Sprint)

| Criterion | Met | Evidence |
|-----------|-----|----------|
| All AC verified | ⬜ | Test results |
| No critical bugs | ⬜ | Bug tracker |
| Demo completed | ⬜ | Demo recording |
| Tests passing | ⬜ | CI pipeline |
| Coverage ≥70% | ⬜ | Coverage report |

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Tech Lead | | | |
| QA Lead | | | |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial packet |
| | | | |

---

## Copilot Assistance

Use this prompt to review sprint packet completeness:

```markdown
No secrets, no production data. Use placeholders.

Review this sprint packet for completeness:

#file docs/content/sprint-01/sprint-packet/SPRINT_PACKET.md

Check for:
1. Clear goal statement
2. All stories have acceptance criteria
3. All AC are testable (Given/When/Then)
4. Dependencies identified
5. Risks documented with mitigation
6. Technical requirements specified
7. Out-of-scope items explicit
8. Sign-off sections present

Flag any gaps or ambiguities.
```
