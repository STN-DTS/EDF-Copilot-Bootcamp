# Sprint 2 Packet — Expand + Basic NFRs

> **"No Sprint Packet, No Build"** — This packet must be approved before Sprint 2 work begins.

**Sprint:** 2 (Weeks 7-8)  
**Sprint Goal:** Expand feature coverage with 2-3 additional journeys while establishing NFR baseline  
**Status:** ⏳ Draft (Pending Approval)

---

## 1. Sprint Goal Statement

### Goal
Expand the thin vertical slice from Sprint 1 by adding:
- Additional user journeys (Create Order, Cancel Order, Filter/Search)
- Non-functional requirements baseline (performance, accessibility, security)
- Consistent state handling patterns (empty, error, loading)
- Comprehensive test coverage (≥70%)

### Success Criteria

| Criterion | Measure | Target |
|-----------|---------|--------|
| New journeys working | Complete end-to-end flows | 3 journeys |
| Test coverage | Code coverage across layers | ≥70% |
| API response time | 95th percentile latency | <500ms |
| Accessibility | WCAG 2.1 AA compliance | 100% |
| Security scan | Critical/high findings | 0 |
| Contract compliance | API matches OpenAPI spec | 100% |

---

## 2. Definition of Done

### Feature-Level

- [ ] Acceptance criteria verified
- [ ] Code reviewed by peer
- [ ] Unit tests written and passing (≥70% coverage)
- [ ] Integration tests passing
- [ ] No critical/high security findings
- [ ] Logging implemented for key events
- [ ] Error handling complete (Problem Details)
- [ ] Accessibility verified (FE: WCAG 2.1 AA)
- [ ] Performance verified (<500ms response)
- [ ] Documentation updated

### Sprint-Level

- [ ] All in-scope items complete per feature DoD
- [ ] Demo successfully delivered
- [ ] NFR baseline established and documented
- [ ] Test coverage ≥70% across all layers
- [ ] Security scan clean (0 critical/high)
- [ ] No blocking bugs remaining
- [ ] Contract compatibility maintained (no breaking changes)
- [ ] Retrospective completed
- [ ] Sprint 3 packet drafted

---

## 3. In-Scope

### 3.1 User Stories

| ID | Story | Acceptance Criteria | Points |
|----|-------|---------------------|--------|
| US-004 | As a user, I want to create an order so that I can purchase items | AC-004 | 8 |
| US-005 | As a user, I want to cancel a pending order so that I can change my mind | AC-005 | 5 |
| US-006 | As a user, I want to filter and search orders so that I can find specific orders | AC-006 | 5 |
| US-007 | As a user, I want consistent empty/error/loading states so that I understand system status | AC-007 | 3 |

### 3.2 Technical Tasks

#### Frontend Tasks

| ID | Task | Story | Estimate |
|----|------|-------|----------|
| FE-101 | Create Order route with form | US-004 | 6h |
| FE-102 | Create Order form validation | US-004 | 4h |
| FE-103 | Create Order submission + feedback | US-004 | 3h |
| FE-104 | Cancel Order button on Order Detail | US-005 | 2h |
| FE-105 | Cancel Order confirmation dialog | US-005 | 3h |
| FE-106 | Cancel Order action handler | US-005 | 2h |
| FE-107 | Order List filter controls | US-006 | 4h |
| FE-108 | Filter state in URL (shareable) | US-006 | 2h |
| FE-109 | Search by order ID | US-006 | 2h |
| FE-110 | EmptyState component | US-007 | 2h |
| FE-111 | ErrorState component | US-007 | 2h |
| FE-112 | LoadingState (skeleton) component | US-007 | 2h |
| FE-113 | Apply state patterns to all routes | US-007 | 3h |
| FE-114 | Accessibility audit + fixes | — | 6h |
| FE-115 | Component tests for new journeys | — | 8h |
| FE-116 | E2E tests for new journeys | — | 6h |
| FE-117 | Update MSW handlers for new endpoints | — | 2h |

#### Backend Tasks

| ID | Task | Story | Estimate |
|----|------|-------|----------|
| BE-101 | OrderCreateRequest DTO | US-004 | 2h |
| BE-102 | Create Order validation rules | US-004 | 3h |
| BE-103 | OrderService.createOrder() | US-004 | 4h |
| BE-104 | OrderController POST endpoint | US-004 | 3h |
| BE-105 | Audit logging for order creation | US-004 | 2h |
| BE-106 | Order cancellation validation rules | US-005 | 2h |
| BE-107 | OrderService.cancelOrder() | US-005 | 3h |
| BE-108 | OrderController DELETE endpoint | US-005 | 2h |
| BE-109 | Audit logging for cancellation | US-005 | 2h |
| BE-110 | Query parameter handling for filters | US-006 | 3h |
| BE-111 | OrderSpecification for filtering | US-006 | 4h |
| BE-112 | Database indexes for filter queries | US-006 | 2h |
| BE-113 | Performance baseline establishment | — | 4h |
| BE-114 | Rate limiting configuration | — | 3h |
| BE-115 | Unit tests for new endpoints | — | 8h |
| BE-116 | Integration tests for new endpoints | — | 6h |
| BE-117 | Contract validation tests | — | 4h |

### 3.3 Files/Paths In-Scope

#### Frontend (React Router v7)

```
src/
├── routes/
│   ├── orders._index.tsx         ← Extend with filters
│   ├── orders.$id.tsx            ← Add cancel action
│   └── orders.new.tsx            ← NEW: Create Order route
├── components/
│   ├── orders/
│   │   ├── CreateOrderForm.tsx   ← NEW
│   │   ├── OrderFilters.tsx      ← NEW
│   │   ├── CancelOrderDialog.tsx ← NEW
│   │   ├── OrderList.tsx         ← Update for filters
│   │   └── OrderDetail.tsx       ← Update for cancel
│   └── ui/
│       ├── EmptyState.tsx        ← NEW
│       ├── ErrorState.tsx        ← NEW
│       └── LoadingState.tsx      ← NEW
├── lib/
│   └── api.ts                    ← Add create/cancel methods
└── mocks/
    └── handlers.ts               ← Add POST/DELETE handlers
```

#### Backend (Spring Boot)

```
src/main/java/com/example/ordermgmt/
├── controller/
│   └── OrderController.java      ← Add POST, DELETE, query params
├── dto/
│   ├── OrderCreateRequest.java   ← NEW
│   └── OrderCancelRequest.java   ← NEW (optional reason)
├── service/
│   ├── OrderService.java         ← Add create, cancel methods
│   └── impl/
│       └── OrderServiceImpl.java ← Implementations
├── repository/
│   ├── OrderRepository.java      ← Add specification support
│   └── spec/
│       └── OrderSpecification.java ← NEW: Filter specifications
├── validation/
│   └── OrderValidation.java      ← NEW: Custom validators
└── config/
    └── RateLimitConfig.java      ← NEW: Rate limiting
```

### 3.4 Endpoints In-Scope

| Method | Path | Description | Request | Response |
|--------|------|-------------|---------|----------|
| POST | /api/v1/orders | Create order | OrderCreateRequest | 201 + OrderResponse |
| DELETE | /api/v1/orders/{id} | Cancel order | — | 204 No Content |
| GET | /api/v1/orders?status=X&from=Y&to=Z&search=Q | Filter orders | Query params | OrderListResponse |

### 3.5 Contract References

From `docs/content/week-04/contracts/openapi.yaml`:

```yaml
# POST /api/v1/orders
paths:
  /api/v1/orders:
    post:
      operationId: createOrder
      summary: Create a new order
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderCreateRequest'
      responses:
        '201':
          description: Order created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/UnprocessableEntity'

# DELETE /api/v1/orders/{id}
  /api/v1/orders/{id}:
    delete:
      operationId: cancelOrder
      summary: Cancel an order
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Order cancelled
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '409':
          description: Order cannot be cancelled
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetail'
```

---

## 4. Out of Scope

### Deferred to Sprint 3

| Item | Reason | Target Sprint |
|------|--------|---------------|
| Order editing | Security hardening first | Sprint 3 |
| Batch operations | Complexity | Sprint 3 |
| Payment integration | External dependency | Sprint 3 |
| Email notifications | Infrastructure needed | Sprint 3 |
| Advanced search (full-text) | Performance tuning needed | Sprint 4 |

### Explicitly Excluded

| Item | Reason |
|------|--------|
| Customer CRUD | Not in Sprint 2 scope |
| Item catalog management | Not in Sprint 2 scope |
| Reporting/analytics | Future phase |
| Bulk import/export | Future phase |
| Multi-tenancy | Out of scope for bootcamp |

---

## 5. Acceptance Criteria

### AC-004: Create Order

```gherkin
Feature: Create Order

  Background:
    Given the user is logged in
    And the user is on the Create Order page

  Scenario: Successfully create order
    When the user enters valid order details:
      | customerId    | <CUSTOMER_ID>      |
      | items         | [item1, item2]     |
      | shippingAddr  | <SHIPPING_ADDRESS> |
    And the user submits the form
    Then the order is created with status "PENDING"
    And the user is redirected to the Order List
    And a success message is displayed
    And the new order appears in the list

  Scenario: Validation errors displayed
    When the user leaves required fields empty
    And the user submits the form
    Then validation errors are displayed for each field
    And the form is not submitted
    And errors are announced to screen readers

  Scenario: Server error handled
    Given the server returns an error
    When the user submits a valid form
    Then an error message is displayed
    And the form remains editable
    And the user can retry
```

### AC-005: Cancel Order

```gherkin
Feature: Cancel Order

  Background:
    Given the user is logged in
    And the user is viewing an order with status "PENDING"

  Scenario: Successfully cancel order
    When the user clicks the Cancel button
    Then a confirmation dialog appears
    When the user confirms cancellation
    Then the order status changes to "CANCELLED"
    And a success message is displayed
    And the Cancel button is no longer available

  Scenario: Cancel confirmation declined
    When the user clicks the Cancel button
    And the confirmation dialog appears
    And the user clicks "No" / closes dialog
    Then the order status remains unchanged
    And the Cancel button is still available

  Scenario: Cannot cancel shipped order
    Given the user is viewing an order with status "SHIPPED"
    Then the Cancel button is disabled or not shown
    And a message explains the order cannot be cancelled

  Scenario: Cancel fails due to concurrent update
    When the user clicks Cancel
    And another user has already cancelled the order
    Then an error message is displayed
    And the order detail refreshes to show current state
```

### AC-006: Filter/Search Orders

```gherkin
Feature: Filter and Search Orders

  Background:
    Given the user is logged in
    And the user is on the Order List page
    And there are orders with various statuses and dates

  Scenario: Filter by status
    When the user selects status filter "PENDING"
    Then only orders with status "PENDING" are displayed
    And the filter state is reflected in the URL

  Scenario: Filter by date range
    When the user selects a date range
    Then only orders within that range are displayed
    And the filter state is reflected in the URL

  Scenario: Search by order ID
    When the user enters an order ID in the search box
    Then orders matching the ID are displayed
    And partial matches are supported

  Scenario: Combine multiple filters
    When the user selects status "PENDING"
    And the user selects a date range
    Then orders matching ALL criteria are displayed

  Scenario: Clear filters
    Given filters are applied
    When the user clicks "Clear filters"
    Then all orders are displayed
    And the URL returns to default state

  Scenario: Shareable filter URL
    Given the user has applied filters
    When the user copies the URL
    And opens it in a new browser
    Then the same filters are applied
```

### AC-007: Consistent State Handling

```gherkin
Feature: Consistent State Handling

  Scenario: Empty state on Order List
    Given the user has no orders
    When the user views the Order List
    Then an empty state is displayed with:
      | icon | illustration or icon |
      | title | "No orders yet" |
      | description | "Create your first order" |
      | action | Link to Create Order |

  Scenario: Empty state on filtered results
    Given filters return no matching orders
    Then an empty state is displayed with:
      | title | "No matching orders" |
      | action | Clear filters button |

  Scenario: Loading state on data fetch
    When data is being fetched
    Then a skeleton loading state is displayed
    And the skeleton matches the shape of the content

  Scenario: Error state on fetch failure
    Given the server returns an error
    Then an error state is displayed with:
      | title | "Something went wrong" |
      | description | User-friendly error message |
      | action | Retry button |
    And the error is announced to screen readers
```

---

## 6. Technical Requirements

### 6.1 Security

| Requirement | Implementation |
|-------------|----------------|
| Authorization | User can only create/cancel their own orders |
| Input validation | All inputs validated on client and server |
| Rate limiting | 100 requests/min per user for mutations |
| Audit logging | All create/cancel actions logged with user ID |
| CSRF protection | Tokens on all mutation requests |

### 6.2 Logging

| Event | Log Level | Fields |
|-------|-----------|--------|
| Order created | INFO | orderId, userId, timestamp, itemCount, total |
| Order cancelled | INFO | orderId, userId, timestamp, previousStatus |
| Validation failed | WARN | userId, fieldErrors, timestamp |
| Rate limit exceeded | WARN | userId, endpoint, timestamp |
| Filter query | DEBUG | userId, filters, resultCount, duration |

### 6.3 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Create order latency (p95) | <500ms | Server-side timer |
| Cancel order latency (p95) | <300ms | Server-side timer |
| Filter query latency (p95) | <500ms | Server-side timer |
| UI time-to-interactive | <3s | Lighthouse |
| First contentful paint | <1.5s | Lighthouse |

### 6.4 Accessibility (WCAG 2.1 AA)

| Requirement | Verification |
|-------------|--------------|
| Form labels | All inputs have associated labels |
| Error announcements | Errors announced via ARIA live regions |
| Keyboard navigation | All actions accessible via keyboard |
| Focus management | Focus moved appropriately after actions |
| Color contrast | Minimum 4.5:1 ratio |
| Screen reader support | Tested with NVDA/VoiceOver |

---

## 7. Dependencies

### External Dependencies

| Dependency | Owner | Status | Risk Level |
|------------|-------|--------|------------|
| OAuth provider | Infrastructure | ✅ Resolved | Low |
| Oracle database | DBA Team | ✅ Resolved | Low |
| CI/CD pipeline | DevOps | ✅ Resolved | Low |

### Internal Dependencies

| Dependency | Description | Resolved By |
|------------|-------------|-------------|
| Sprint 1 complete | Base patterns established | Day 1 |
| Contract v1 | OpenAPI spec locked | Day 1 |
| MSW handlers | Mock endpoints ready | Day 2 |

---

## 8. Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| NFR targets too aggressive | Medium | High | Adjust targets based on baseline |
| Filter query performance | Medium | Medium | Add indexes proactively |
| Accessibility remediation scope | Medium | Medium | Prioritize critical paths |
| Rate limiting complexity | Low | Medium | Use proven patterns |
| Contract drift | Low | High | Validate continuously |

---

## 9. Sprint Ceremonies

| Ceremony | When | Duration | Attendees |
|----------|------|----------|-----------|
| Sprint Planning | Day 1 | 2 hours | All |
| Daily Standup | Daily | 15 min | Developers |
| Contract Council | Day 5 | 30 min | Tech Leads |
| Architecture Sync | Day 3, 7 | 20 min | Tech Leads |
| Sprint Demo | Day 10 | 1 hour | All + Stakeholders |
| Sprint Retro | Day 10 | 1 hour | Team only |

---

## 10. Approval Sign-Off

### Pre-Sprint (Required before work begins)

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| FE Tech Lead | | | |
| BE Tech Lead | | | |
| Bootcamp Lead | | | |

### Pre-Sprint Verification

- [ ] Sprint 1 DoD complete
- [ ] Sprint 1 retro actions addressed
- [ ] Sprint 2 scope agreed
- [ ] Contract compatibility verified
- [ ] NFR targets reviewed and accepted
- [ ] Dependencies resolved
- [ ] Risks acknowledged

### Post-Sprint Confirmation

| Criterion | Verified | Notes |
|-----------|----------|-------|
| Demo completed | [ ] | |
| Tests passing | [ ] | |
| Coverage ≥70% | [ ] | |
| NFR baseline met | [ ] | |
| Security scan clean | [ ] | |
| Contract compliance | [ ] | |
| Retro completed | [ ] | |

**Sprint 2 Sign-Off:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| FE Tech Lead | | | |
| BE Tech Lead | | | |
| Bootcamp Lead | | | |

---

## Copilot Context

```
Sprint 2 Packet summary:
- Goal: Expand + NFRs (3 new journeys, quality baseline)
- In-scope: Create Order, Cancel Order, Filter/Search, State Patterns
- Out-of-scope: Editing, payments, notifications
- NFR targets: <500ms p95, ≥70% coverage, WCAG 2.1 AA, 0 critical findings
- Gate: Demo + tests + NFR baseline + security scan clean

Key rule: "No Sprint Packet, No Build"
This packet must be signed before Sprint 2 work begins.
```
