# Sprint 1 Packet — Thin Vertical Slice

> **"No Sprint Packet, No Build"** — This packet must be approved before Sprint 1 work begins.

**Sprint:** 1 (Weeks 5-6)  
**Sprint Goal:** Prove the end-to-end pipeline with one complete user journey  
**Status:** ⏳ Draft (Pending Approval)

---

## 1. Sprint Goal Statement

### Goal
Deliver a working thin vertical slice that demonstrates:
- User authentication via OAuth/OIDC
- One complete user journey (e.g., "View My Orders")
- Data persistence to Oracle database
- Structured logging and audit events
- Automated tests at all layers

### Success Criteria

| Criterion | Measure | Target |
|-----------|---------|--------|
| Journey completable | User can complete flow end-to-end | 100% |
| Auth working | OAuth/OIDC flow functional | Pass |
| Data persisted | Order data saved/retrieved from DB | Pass |
| Tests passing | All automated tests green | 100% |
| Coverage | Code coverage across layers | ≥70% |
| Contract compliance | API matches OpenAPI spec | 100% |

---

## 2. Definition of Done

### Feature-Level

- [ ] Acceptance criteria verified
- [ ] Code reviewed by peer
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] No critical/high security findings
- [ ] Logging implemented
- [ ] Error handling complete
- [ ] Accessibility baseline met (FE only)
- [ ] Documentation updated

### Sprint-Level

- [ ] All in-scope items complete per feature DoD
- [ ] Demo successfully delivered
- [ ] E2E test skeleton working
- [ ] No blocking bugs remaining
- [ ] Contract tests passing
- [ ] Retrospective completed
- [ ] Sprint 2 packet drafted

---

## 3. In-Scope

### 3.1 User Stories

| ID | Story | Acceptance Criteria | Points |
|----|-------|---------------------|--------|
| US-001 | As a user, I want to log in so that I can access my orders | AC-001 | 3 |
| US-002 | As a user, I want to see my order list so that I can track my purchases | AC-002 | 5 |
| US-003 | As a user, I want to see order details so that I know what I ordered | AC-003 | 3 |

### 3.2 Technical Tasks

#### Frontend Tasks

| ID | Task | Story | Estimate |
|----|------|-------|----------|
| FE-001 | Set up React Router v7 project structure | — | 2h |
| FE-002 | Implement app shell with navigation | — | 4h |
| FE-003 | Create Order List route with loader | US-002 | 6h |
| FE-004 | Create Order Detail route with loader | US-003 | 4h |
| FE-005 | Configure MSW handlers for development | — | 3h |
| FE-006 | Implement error boundary and error states | — | 3h |
| FE-007 | Set up Vitest + RTL tests | — | 2h |
| FE-008 | Write component tests for Order List | US-002 | 4h |
| FE-009 | Write component tests for Order Detail | US-003 | 3h |
| FE-010 | Set up Playwright E2E skeleton | — | 4h |
| FE-011 | Integrate with real backend API | — | 4h |
| FE-012 | Accessibility baseline verification | — | 2h |

#### Backend Tasks

| ID | Task | Story | Estimate |
|----|------|-------|----------|
| BE-001 | Set up Spring Boot project structure | — | 2h |
| BE-002 | Configure OAuth 2.0 resource server | US-001 | 6h |
| BE-003 | Create Order entity and JPA mapping | US-002 | 3h |
| BE-004 | Create OrderItem entity and JPA mapping | US-002 | 2h |
| BE-005 | Implement OrderRepository | US-002 | 2h |
| BE-006 | Implement OrderService | US-002, US-003 | 6h |
| BE-007 | Implement OrderController - list | US-002 | 4h |
| BE-008 | Implement OrderController - detail | US-003 | 3h |
| BE-009 | Configure Problem Details error handling | — | 3h |
| BE-010 | Configure structured logging | — | 3h |
| BE-011 | Write service unit tests | — | 6h |
| BE-012 | Write controller integration tests | — | 6h |
| BE-013 | Write contract validation tests | — | 4h |

### 3.3 Files/Paths In-Scope

#### Frontend (React Router v7)

```
src/
├── routes/
│   ├── _layout.tsx           ← App shell layout
│   ├── orders._index.tsx     ← Order list route
│   └── orders.$id.tsx        ← Order detail route
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── ErrorBoundary.tsx
│   └── orders/
│       ├── OrderList.tsx
│       ├── OrderCard.tsx
│       └── OrderDetail.tsx
├── lib/
│   ├── api.ts                ← API client
│   └── auth.ts               ← Auth helpers
├── types/
│   └── api.ts                ← Generated from OpenAPI
└── mocks/
    ├── handlers.ts           ← MSW handlers
    └── data.ts               ← Mock data
```

#### Backend (Spring Boot)

```
src/main/java/com/example/ordermgmt/
├── config/
│   ├── SecurityConfig.java
│   ├── ProblemDetailConfig.java
│   └── LoggingConfig.java
├── controller/
│   ├── OrderController.java
│   └── advice/
│       └── GlobalExceptionHandler.java
├── service/
│   ├── OrderService.java
│   └── impl/
│       └── OrderServiceImpl.java
├── repository/
│   └── OrderRepository.java
├── entity/
│   ├── Order.java
│   └── OrderItem.java
└── dto/
    ├── OrderDto.java
    ├── OrderItemDto.java
    └── CreateOrderRequest.java
```

### 3.4 Endpoints In-Scope

| Method | Path | Description | Reference |
|--------|------|-------------|-----------|
| GET | /api/v1/orders | List orders (paginated) | openapi.yaml#/paths/~1orders |
| GET | /api/v1/orders/{id} | Get order by ID | openapi.yaml#/paths/~1orders~1{id} |

---

## 4. Out of Scope

| Item | Reason | Target Sprint |
|------|--------|---------------|
| Create order functionality | Focus on read operations first | Sprint 2 |
| Cancel order functionality | Focus on read operations first | Sprint 2 |
| Customer management | Separate bounded context | Sprint 2-3 |
| Item catalog | Separate bounded context | Sprint 2-3 |
| Advanced search/filtering | Core journey first | Sprint 2 |
| Export/reporting | Core journey first | Sprint 3 |
| Admin functionality | End-user focus first | Sprint 3-4 |
| Performance optimization | Functionality first | Sprint 4 |

---

## 5. Acceptance Criteria

### AC-001: User Login

```gherkin
Feature: User Authentication

  Scenario: Successful login
    Given I am on the login page
    When I click the "Sign In" button
    And I authenticate with my SSO credentials
    Then I am redirected to the Orders page
    And I see a welcome message with my name

  Scenario: Unauthenticated access
    Given I am not logged in
    When I try to access the Orders page directly
    Then I am redirected to the login page
    And I see a message asking me to sign in

  Scenario: Session expiry
    Given I am logged in
    And my session has expired
    When I try to load the Orders page
    Then I am redirected to the login page
    And I see a message that my session has expired
```

### AC-002: View Order List

```gherkin
Feature: Order List

  Scenario: View orders with data
    Given I am logged in
    And I have orders in the system
    When I navigate to the Orders page
    Then I see a list of my orders
    And each order shows: order ID, date, status, total
    And the list is sorted by date (newest first)

  Scenario: View orders - empty state
    Given I am logged in
    And I have no orders in the system
    When I navigate to the Orders page
    Then I see an empty state message
    And I see a call-to-action to create an order

  Scenario: View orders - pagination
    Given I am logged in
    And I have more than 20 orders
    When I navigate to the Orders page
    Then I see the first 20 orders
    And I see pagination controls
    When I click "Next"
    Then I see the next page of orders

  Scenario: View orders - loading state
    Given I am logged in
    When I navigate to the Orders page
    And the data is loading
    Then I see a loading indicator
    And the loading indicator is accessible (announced to screen readers)

  Scenario: View orders - error state
    Given I am logged in
    When I navigate to the Orders page
    And the API returns an error
    Then I see an error message
    And I see a "Retry" button
    When I click "Retry"
    Then the page attempts to load again
```

### AC-003: View Order Details

```gherkin
Feature: Order Details

  Scenario: View order details
    Given I am logged in
    And I am on the Orders page
    When I click on an order
    Then I navigate to the Order Details page
    And I see the order ID in the heading
    And I see the order date
    And I see the order status
    And I see the list of items with: name, quantity, price
    And I see the order total

  Scenario: View order details - not found
    Given I am logged in
    When I navigate directly to an order that doesn't exist
    Then I see a "Not Found" error
    And I see a link to return to the Orders page

  Scenario: View order details - unauthorized
    Given I am logged in
    When I navigate to an order that belongs to another user
    Then I see an "Access Denied" error
    And I see a link to return to the Orders page
```

---

## 6. Technical Requirements

### 6.1 Security Requirements

| Requirement | Implementation | Priority |
|-------------|----------------|----------|
| Authentication | OAuth 2.0 / OIDC with Microsoft Entra ID | Must |
| Authorization | Orders filtered by authenticated user | Must |
| Token validation | JWT signature and expiry validation | Must |
| HTTPS only | All API calls over TLS | Must |
| Input validation | Validate all path parameters | Must |
| Rate limiting | Basic rate limiting (100 req/min) | Should |

### 6.2 Logging Requirements

| Event | Level | Required Fields |
|-------|-------|-----------------|
| Request received | INFO | method, path, userId, traceId |
| Request completed | INFO | method, path, status, durationMs, traceId |
| Order accessed | INFO | orderId, userId, traceId |
| Authorization denied | WARN | userId, orderId, reason, traceId |
| Validation error | WARN | field, value (masked), reason, traceId |
| System error | ERROR | exception, stackTrace, traceId |

### 6.3 Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| API response time (p95) | < 500ms | Logging/APM |
| Page load time (FCP) | < 2s | Lighthouse |
| Time to interactive | < 3s | Lighthouse |

---

## 7. Dependencies

| Dependency | Owner | Status | Risk if Delayed |
|------------|-------|--------|-----------------|
| OAuth/OIDC endpoint | Platform team | ✅ Available | High - auth blocked |
| Oracle database access | DBA team | ✅ Available | High - persistence blocked |
| CI/CD pipeline | DevOps team | ✅ Available | Medium - no automation |
| Contract v1 locked | Week 4 | ✅ Complete | High - API changes |

---

## 8. Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Auth integration issues | Medium | High | Day 3 focus, mock auth fallback |
| Database schema issues | Low | Medium | H2 for dev, schema migration |
| Contract interpretation | Medium | Medium | Daily FE/BE sync |
| Scope creep | Medium | Medium | Strict packet adherence |
| Team availability | Low | Medium | Cross-training on tasks |

---

## 9. Sprint Ceremonies

| Ceremony | Day | Time | Duration | Attendees |
|----------|-----|------|----------|-----------|
| Sprint Planning | Day 1 | 09:00 | 2 hours | All |
| Daily Standup | Daily | 09:30 | 15 min | All |
| Contract Council | Day 5 | 14:00 | 30 min | Tech Leads |
| Architecture Sync | Days 3, 7 | 14:00 | 20 min | Tech Leads |
| Sprint Demo | Day 10 | 14:00 | 1 hour | All + stakeholders |
| Sprint Retro | Day 10 | 15:30 | 1 hour | All |

---

## 10. Approval Sign-Off

### Pre-Sprint Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| FE Tech Lead | | | |
| BE Tech Lead | | | |
| Bootcamp Lead | | | |

### Approval Criteria

By signing, approvers confirm:
- [ ] Sprint goal is clear and achievable
- [ ] Scope is appropriately sized for 2 weeks
- [ ] Acceptance criteria are testable
- [ ] Dependencies are resolved or managed
- [ ] Risks are identified with mitigations
- [ ] Team has capacity for the work

---

### Post-Sprint Confirmation

| Criterion | Met? | Evidence |
|-----------|------|----------|
| All in-scope items complete | | |
| Demo delivered | | |
| Tests passing | | |
| Contract compliance verified | | |
| Retro completed | | |

| Role | Name | Signature | Date |
|------|------|-----------|------|
| FE Tech Lead | | | |
| BE Tech Lead | | | |
| Bootcamp Lead | | | |

---

## Copilot Assistance

```
This sprint packet defines Sprint 1 scope.

Key rules:
- Only in-scope items can be worked on
- Out-of-scope items are explicitly deferred
- All work must meet Definition of Done
- Daily standups surface blockers early

Useful prompts:
- P0: Plan before implementing any task
- P2: Write tests for each user story
- P12: Use @workspace to understand codebase
- P21: Validate contract compliance

Remember: "No Sprint Packet, No Build"
```
