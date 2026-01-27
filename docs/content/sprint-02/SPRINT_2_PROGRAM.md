# Sprint 2 Program — Expand + Basic NFRs (Weeks 7-8)

> **Sprint Goal:** Expand feature coverage with 2-3 additional journeys while hardening quality through NFR implementation.

**Duration:** 2 weeks (10 working days)  
**Gate:** Expanded Demo + NFR Baseline + All Tests Passing  
**Prerequisites:** Sprint 1 complete, Sprint 2 Packet approved, Contract v1 compatibility maintained

---

## Sprint Overview

Sprint 2 builds on the thin vertical slice from Sprint 1. Now that the end-to-end pipeline is proven, we expand horizontally (more features) while hardening vertically (NFRs). This sprint introduces the core non-functional requirements that production systems need.

### What "Expand + NFRs" Means

```
┌─────────────────────────────────────────────────────────────────┐
│                      EXPAND + HARDEN NFRs                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Sprint 1 Slice        Sprint 2 Expansion                      │
│   ┌───────────┐         ┌───────────────────────────────────┐   │
│   │ Orders    │         │ + Create Order                    │   │
│   │ List/View │  ───►   │ + Cancel Order                    │   │
│   └───────────┘         │ + Filter/Search Orders            │   │
│                         └───────────────────────────────────┘   │
│                                                                 │
│   + Empty States      │  "No orders found" messaging            │
│   + Error States      │  Graceful error displays                │
│   + Loading States    │  Skeleton/spinner UX                    │
│   + Accessibility     │  WCAG 2.1 AA compliance                 │
│   + Performance       │  Response time benchmarks               │
│   + Audit/Telemetry   │  Metrics and tracing                    │
│   + Rate Limiting     │  API throttling (if applicable)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why Expand + NFRs Together?

| Benefit | Explanation |
|---------|-------------|
| **Pattern validation** | Sprint 1 patterns scale to more features |
| **NFR integration** | Quality baked in during expansion, not bolted on later |
| **Complete demo** | Stakeholders see substantial product increment |
| **Risk reduction** | Performance/security issues caught early |
| **Team confidence** | More features + quality = ready for hardening |

---

## Day 0: Sprint Planning Prep (Lead Only)

### Lead Checklist

- [ ] Sprint 1 retro actions reviewed
- [ ] Sprint 2 Packet draft complete
- [ ] New user stories defined
- [ ] NFR targets established
- [ ] Task breakdown prepared (FE and BE)
- [ ] Story point estimates ready
- [ ] Dependencies identified
- [ ] Risks documented
- [ ] Demo date scheduled

### Materials to Prepare

| Material | Source | Purpose |
|----------|--------|---------|
| Sprint 1 retro outcomes | Sprint 1 | Improvement actions |
| Sprint 2 Packet draft | Template | Scope definition |
| NFR checklist | NFR_CHECKLIST.md | Quality targets |
| Additional contract endpoints | openapi.yaml | What to implement |
| Updated mock handlers | MSW handlers | FE development |
| Performance baseline | Sprint 1 metrics | Comparison |

### Sprint 1 → Sprint 2 Handover

| Sprint 1 Artifact | Sprint 2 Usage |
|-------------------|----------------|
| Order List route | Extend with filtering |
| Order Detail route | Add action buttons |
| OrderController | Add create/cancel endpoints |
| OrderService | Expand business logic |
| Test patterns | Replicate for new features |
| Error handling | Extend to new scenarios |

---

## Day 1: Sprint Planning + Kickoff (2-3 hours)

### Sprint Planning Session (2 hours)

**Attendees:** All team members, Product Owner, Tech Leads

#### Agenda

| Time | Activity | Output |
|------|----------|--------|
| 0:00-0:15 | Sprint 1 highlights + learnings | Context set |
| 0:15-0:30 | Sprint 2 goal review | Shared understanding |
| 0:30-1:00 | Sprint Packet walkthrough | Questions answered |
| 1:00-1:30 | Task breakdown refinement | Tasks assigned |
| 1:30-1:45 | NFR target review | Quality expectations clear |
| 1:45-2:00 | Commitment confirmation | Team commits |

#### Sprint 2 Packet Review Checklist

- [ ] Sprint 1 patterns maintained
- [ ] Goal is clear and measurable
- [ ] Definition of Done includes NFR criteria
- [ ] In-scope items are bounded
- [ ] Out-of-scope items are explicit
- [ ] Acceptance criteria are testable
- [ ] NFR targets are specific and measurable
- [ ] Contract compatibility verified
- [ ] Security requirements extended
- [ ] Test requirements include NFR verification

### Kickoff Activities

After planning, teams begin parallel work:

| Stream | First Task | Deliverable |
|--------|------------|-------------|
| FE | New journey scaffolding | Route stubs ready |
| BE | New endpoint scaffolding | Controller stubs ready |

---

## Days 2-5 (Week 7): Feature Expansion

### FE Stream — Week 7

| Day | Focus | Deliverable | Prompts |
|-----|-------|-------------|---------|
| Day 2 | Create Order journey UI | Form components | P1, P9 |
| Day 3 | Create Order validation + submission | Working form | P1, P7 |
| Day 4 | Cancel Order journey | Confirmation flow | P1, P9 |
| Day 5 | Filter/Search Orders | Filter UI + API integration | P1, P12 |

#### FE Day 2: Create Order Journey

**Tasks:**
1. Create route for new order form
2. Build form components with validation
3. Handle form state with React Router actions
4. Integrate with MSW for development

**Copilot Prompt (P9 — Route Scaffold for Create):**
```markdown
No secrets, no production data. Use placeholders.

Create a React Router v7 route for the Create Order journey.

Requirements:
- Action handler for form submission to POST /api/v1/orders
- Form validation (required fields, format checks)
- Optimistic UI updates where appropriate
- Error handling for submission failures
- Follows patterns in .github/instructions/frontend.instructions.md
- Uses existing component patterns from Sprint 1

Show me a plan first.
```

#### FE Day 3: Form Validation

**Tasks:**
1. Client-side validation rules
2. Server-side error display
3. Accessibility for form errors
4. Loading state during submission

**Copilot Prompt (P1 — Form Validation):**
```markdown
No secrets, no production data. Use placeholders.

Add comprehensive form validation to the Create Order form.

Requirements:
- Required field validation
- Format validation (dates, numbers)
- Error messages accessible to screen readers
- Inline error display per field
- Form-level error summary
- Prevents submission until valid

Follow WCAG 2.1 AA guidelines.
```

#### FE Day 4: Cancel Order Journey

**Tasks:**
1. Add cancel button to Order Detail
2. Create confirmation dialog
3. Handle cancel action submission
4. Update UI after cancellation

**Copilot Prompt (P9 — Cancel Action):**
```markdown
No secrets, no production data. Use placeholders.

Add order cancellation to the Order Detail route.

Requirements:
- Confirmation dialog before cancel
- Action handler for DELETE /api/v1/orders/{id}
- Optimistic UI update with rollback on failure
- Success/error feedback
- Navigate back to Order List on success

Use existing patterns from Order Detail route.
```

#### FE Day 5: Filter/Search

**Tasks:**
1. Add filter controls to Order List
2. Implement search by status, date range
3. Update loader with query parameters
4. Persist filter state in URL

**Copilot Prompt (P12 — @workspace for Patterns):**
```markdown
@workspace Show me how filtering is currently implemented 
in this project, then help me add order filtering.

I need:
- Status filter (pending, confirmed, shipped, delivered)
- Date range filter
- Search by order ID
- URL-based filter state (shareable links)
```

### BE Stream — Week 7

| Day | Focus | Deliverable | Prompts |
|-----|-------|-------------|---------|
| Day 2 | Create Order endpoint | POST /api/v1/orders | P7, P8 |
| Day 3 | Create Order validation | Request validation | P7, P18 |
| Day 4 | Cancel Order endpoint | DELETE /api/v1/orders/{id} | P7, P8 |
| Day 5 | Filter/Search endpoint | Query parameters | P7, P8 |

#### BE Day 2: Create Order Endpoint

**Tasks:**
1. Add POST endpoint to OrderController
2. Create OrderCreateRequest DTO
3. Add service method for order creation
4. Validate business rules

**Copilot Prompt (P8 — Controller for Create):**
```markdown
No secrets, no production data. Use placeholders.

Add a POST endpoint to OrderController for creating orders.

Requirements:
- Endpoint: POST /api/v1/orders
- Request body: OrderCreateRequest DTO
- Response: 201 Created with OrderResponse
- Validate user authorization
- Log audit event for order creation
- Return Problem Details on validation failure

Follow patterns from existing GET endpoints.
```

#### BE Day 3: Request Validation

**Tasks:**
1. Add Bean Validation annotations
2. Custom validators for business rules
3. Validation error responses
4. Security input sanitization

**Copilot Prompt (P18 — Security Review):**
```markdown
No secrets, no production data. Use placeholders.

Review the Create Order endpoint for security vulnerabilities.

#file src/main/java/com/example/ordermgmt/controller/OrderController.java

Check for:
- Input validation completeness
- SQL injection risks
- Mass assignment vulnerabilities
- Authorization checks
- Rate limiting needs

Suggest specific fixes for each issue found.
```

#### BE Day 4: Cancel Order Endpoint

**Tasks:**
1. Add DELETE endpoint to OrderController
2. Add service method for cancellation
3. Validate cancellation rules (can't cancel shipped orders)
4. Audit logging for cancellation

**Copilot Prompt (P7 — Service Logic):**
```markdown
No secrets, no production data. Use placeholders.

Add order cancellation logic to OrderService.

Requirements:
- Validate order exists and belongs to user
- Check order is in cancellable status (pending, confirmed only)
- Update status to CANCELLED
- Log audit event with reason
- Return success/failure result

Handle edge cases:
- Order not found → 404
- Order not owned by user → 403
- Order not cancellable → 409 Conflict

Follow Problem Details pattern for errors.
```

#### BE Day 5: Query Parameters

**Tasks:**
1. Add filter parameters to list endpoint
2. Implement specification/criteria pattern
3. Pagination with filters
4. Performance optimization (indexes)

**Copilot Prompt (P6 — Repository with Specs):**
```markdown
No secrets, no production data. Use placeholders.

Add filtering support to OrderRepository using Spring Data JPA Specifications.

Filter parameters:
- status: OrderStatus enum (multiple values)
- fromDate: LocalDate
- toDate: LocalDate  
- search: String (matches orderId)

Requirements:
- Combine filters with AND logic
- Maintain pagination
- Ensure query efficiency
- Add database indexes if needed

Show me the specification pattern approach.
```

---

## Days 6-10 (Week 8): NFR Hardening + Testing

### FE Stream — Week 8

| Day | Focus | Deliverable | Prompts |
|-----|-------|-------------|---------|
| Day 6 | Empty/Error/Loading states | Consistent UX patterns | P1, P10 |
| Day 7 | Accessibility audit + fixes | WCAG 2.1 AA compliance | P10 |
| Day 8 | Component tests for new journeys | Vitest + RTL coverage | P2 |
| Day 9 | E2E tests expansion | Playwright coverage | P2 |
| Day 10 | Demo prep + polish | Demo-ready UI | — |

#### FE Day 6: State Patterns

**Tasks:**
1. Create EmptyState component
2. Create ErrorState component
3. Create LoadingState (skeleton) component
4. Apply consistently across all routes

**Copilot Prompt (P1 — Empty State Component):**
```markdown
No secrets, no production data. Use placeholders.

Create a reusable EmptyState component.

Requirements:
- Accepts icon, title, description, action button props
- Accessible (announces to screen readers)
- Consistent styling with design system
- Usage examples for Order List, Search Results

Also create ErrorState and LoadingState following same pattern.
```

#### FE Day 7: Accessibility Audit

**Tasks:**
1. Run automated accessibility checks (axe)
2. Fix identified issues
3. Keyboard navigation verification
4. Screen reader testing

**Copilot Prompt (P10 — Accessibility Verification):**
```markdown
No secrets, no production data. Use placeholders.

Audit these components for WCAG 2.1 AA compliance:

#file src/components/orders/CreateOrderForm.tsx
#file src/components/orders/OrderFilters.tsx

Check:
- Form labels and error announcements
- Focus management
- Color contrast
- Keyboard navigation
- ARIA attributes

Provide specific fixes for each violation.
```

#### FE Day 8: Component Tests

**Tasks:**
1. Tests for CreateOrderForm
2. Tests for OrderFilters
3. Tests for EmptyState, ErrorState, LoadingState
4. Test coverage verification

**Copilot Prompt (P2 — Tests First):**
```markdown
No secrets, no production data. Use placeholders.

Write comprehensive tests for the CreateOrderForm component.

Test scenarios:
- Renders form fields correctly
- Validates required fields
- Shows inline errors for invalid input
- Submits successfully with valid data
- Shows error state on submission failure
- Accessible error announcements

Use Vitest + React Testing Library.
Follow patterns in .github/instructions/testing.instructions.md
```

#### FE Day 9: E2E Tests

**Tasks:**
1. Create Order journey E2E test
2. Cancel Order journey E2E test
3. Filter/Search E2E test
4. Cross-browser verification

**Copilot Prompt (P2 — E2E Tests):**
```markdown
No secrets, no production data. Use placeholders.

Write Playwright E2E tests for the Create Order journey.

Test flow:
1. User logs in
2. Navigate to Create Order
3. Fill form with valid data
4. Submit form
5. Verify redirect to Order List
6. Verify new order appears in list

Include:
- Happy path
- Validation error path
- Server error path

Follow Playwright best practices (locators, assertions).
```

### BE Stream — Week 8

| Day | Focus | Deliverable | Prompts |
|-----|-------|-------------|---------|
| Day 6 | Performance baseline | Response time metrics | P11 |
| Day 7 | Rate limiting + resilience | Throttling configuration | P7 |
| Day 8 | Unit tests for new endpoints | JUnit 5 coverage | P2 |
| Day 9 | Integration tests + contract | MockMvc + contract tests | P2, P21 |
| Day 10 | Demo prep + polish | Demo-ready API | — |

#### BE Day 6: Performance Baseline

**Tasks:**
1. Add performance metrics endpoint
2. Establish response time baseline
3. Identify slow queries
4. Add database indexes

**Copilot Prompt (P11 — Post-Implementation Review):**
```markdown
No secrets, no production data. Use placeholders.

Review the OrderService for performance concerns.

@workspace #file src/main/java/com/example/ordermgmt/service/impl/OrderServiceImpl.java

Check for:
- N+1 query problems
- Unnecessary data loading
- Missing eager/lazy fetch optimization
- Index opportunities
- Caching candidates

Suggest specific optimizations with code examples.
```

#### BE Day 7: Rate Limiting

**Tasks:**
1. Configure rate limiting (if applicable)
2. Add circuit breaker patterns
3. Graceful degradation handling
4. Timeout configuration

**Copilot Prompt (P7 — Resilience Patterns):**
```markdown
No secrets, no production data. Use placeholders.

Add rate limiting to the Order API endpoints.

Requirements:
- Limit: 100 requests per minute per user
- Return 429 Too Many Requests when exceeded
- Include Retry-After header
- Log rate limit violations

Also add:
- Request timeout: 30 seconds
- Database connection timeout: 5 seconds

Use Spring Boot configuration approach.
```

#### BE Day 8: Unit Tests

**Tasks:**
1. Tests for order creation service
2. Tests for order cancellation service
3. Tests for filtering logic
4. Coverage verification (≥70%)

**Copilot Prompt (P2 — Service Tests):**
```markdown
No secrets, no production data. Use placeholders.

Write comprehensive unit tests for OrderService.createOrder().

Test scenarios:
- Successfully creates order with valid data
- Rejects order with missing required fields
- Rejects order with invalid item quantities
- Calculates totals correctly
- Assigns correct initial status
- Logs audit event on creation
- Returns created order with ID

Use JUnit 5 + Mockito.
Follow patterns in .github/instructions/testing.instructions.md
```

#### BE Day 9: Integration Tests

**Tasks:**
1. MockMvc tests for new endpoints
2. Contract validation tests
3. Security integration tests
4. Full stack smoke test

**Copilot Prompt (P21 — Contract Validation):**
```markdown
No secrets, no production data. Use placeholders.

Write contract validation tests for the Order endpoints.

Verify against: docs/content/week-04/contracts/openapi.yaml

Tests:
1. POST /api/v1/orders matches request/response schema
2. DELETE /api/v1/orders/{id} returns correct status codes
3. GET /api/v1/orders with filters matches response schema
4. Error responses follow Problem Details spec

Use RestAssured or Spring MockMvc.
```

---

## Day 10: Sprint Demo + Retrospective

### Sprint Demo (1 hour)

**Attendees:** Team, Product Owner, Stakeholders

#### Demo Agenda

| Time | Segment | Presenter |
|------|---------|-----------|
| 0:00-0:05 | Sprint goal recap | Scrum Master |
| 0:05-0:20 | Create Order journey | FE Developer |
| 0:20-0:30 | Cancel Order journey | FE Developer |
| 0:30-0:40 | Filter/Search functionality | FE/BE Developer |
| 0:40-0:50 | NFR achievements | Tech Leads |
| 0:50-1:00 | Q&A + feedback | All |

#### Demo Preparation Checklist

- [ ] Demo environment stable
- [ ] Test data prepared
- [ ] Happy paths verified
- [ ] Error scenarios ready to show
- [ ] NFR metrics collected
- [ ] Backup plan if live demo fails

#### NFR Metrics to Present

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| API response time (p95) | <500ms | | |
| Test coverage | ≥70% | | |
| Accessibility score | 100% | | |
| Security scan findings | 0 critical/high | | |
| Error rate | <1% | | |

### Sprint Retrospective (1 hour)

**Attendees:** Team only (no stakeholders)

#### Retro Format: Start/Stop/Continue

| Category | Prompt |
|----------|--------|
| **Start** | What should we start doing? |
| **Stop** | What should we stop doing? |
| **Continue** | What's working well? |

#### Sprint 2 Retro Questions

1. **Feature expansion:**
   - Did Sprint 1 patterns scale well?
   - What needed adjustment?

2. **NFR implementation:**
   - Were NFR targets realistic?
   - What blocked NFR progress?

3. **Quality:**
   - How did test-first work for new features?
   - Any quality shortcuts we regret?

4. **Copilot effectiveness:**
   - Which prompts worked best for expansion?
   - Where did Copilot struggle?

5. **Team dynamics:**
   - Did parallel streams stay aligned?
   - Were daily syncs effective?

#### Action Items Template

| Action | Owner | Due | Status |
|--------|-------|-----|--------|
| | | | |
| | | | |
| | | | |

---

## Definition of Done

### Feature-Level DoD

- [ ] Acceptance criteria verified
- [ ] Code reviewed by peer
- [ ] Unit tests written and passing (≥70% coverage)
- [ ] Integration tests passing
- [ ] No critical/high security findings
- [ ] Logging implemented for key events
- [ ] Error handling complete (Problem Details)
- [ ] Accessibility verified (FE: WCAG 2.1 AA)
- [ ] Performance within targets
- [ ] Documentation updated

### Sprint-Level DoD

- [ ] All in-scope items complete per feature DoD
- [ ] Demo successfully delivered
- [ ] NFR baseline established
- [ ] Test coverage ≥70% across all layers
- [ ] Security scan clean (0 critical/high)
- [ ] No blocking bugs remaining
- [ ] Contract compatibility maintained
- [ ] Retrospective completed
- [ ] Sprint 3 packet drafted

---

## Copilot Usage Summary

### Recommended Prompts for Sprint 2

| Phase | Prompts | Purpose |
|-------|---------|---------|
| Feature expansion | P1, P7, P8, P9 | New components/endpoints |
| Validation | P18 | Security review |
| NFR hardening | P10, P11 | Accessibility, performance |
| Testing | P2, P21 | Test-first, contract validation |
| Exploration | P12, P14 | Codebase understanding |

### Sprint 2 Prompt Tips

1. **Reference Sprint 1 patterns:**
   ```markdown
   Use existing patterns from #file src/components/orders/OrderList.tsx
   ```

2. **Ask for NFR verification:**
   ```markdown
   Also verify this meets our performance target of <500ms response time
   ```

3. **Include accessibility requirements:**
   ```markdown
   Ensure WCAG 2.1 AA compliance for all form interactions
   ```

4. **Request security considerations:**
   ```markdown
   Include input validation and sanitization for all user inputs
   ```

---

## Key References

| Resource | Location | Purpose |
|----------|----------|---------|
| Sprint 1 Program | [../sprint-01/SPRINT_1_PROGRAM.md](../sprint-01/SPRINT_1_PROGRAM.md) | Pattern reference |
| Sprint 2 Packet | [./sprint-packet/SPRINT_PACKET.md](./sprint-packet/SPRINT_PACKET.md) | Scope definition |
| FE Tasks | [./sprint-packet/FE_TASKS.md](./sprint-packet/FE_TASKS.md) | Frontend breakdown |
| BE Tasks | [./sprint-packet/BE_TASKS.md](./sprint-packet/BE_TASKS.md) | Backend breakdown |
| NFR Checklist | [./sprint-packet/NFR_CHECKLIST.md](./sprint-packet/NFR_CHECKLIST.md) | Quality targets |
| OpenAPI Contract | [../week-04/contracts/openapi.yaml](../week-04/contracts/openapi.yaml) | API reference |
| FE Instructions | [../../../.github/instructions/frontend.instructions.md](../../../.github/instructions/frontend.instructions.md) | Frontend patterns |
| BE Instructions | [../../../.github/instructions/backend.instructions.md](../../../.github/instructions/backend.instructions.md) | Backend patterns |
| Testing Instructions | [../../../.github/instructions/testing.instructions.md](../../../.github/instructions/testing.instructions.md) | Test patterns |

---

## Navigation

| Previous | Current | Next |
|----------|---------|------|
| [Sprint 1 Program](../sprint-01/SPRINT_1_PROGRAM.md) | Sprint 2 Program | [Sprint 3 Program](../sprint-03/SPRINT_3_PROGRAM.md) |

---

## Copilot Context

```
This is Sprint 2 (Weeks 7-8) of the AI-Assisted Development Bootcamp.

Focus: Expand feature coverage + establish NFR baseline
- 2-3 additional user journeys (Create, Cancel, Filter Orders)
- Non-functional requirements (performance, accessibility, security)
- Consistent state handling (empty, error, loading)
- Test coverage ≥70%

Stack:
- FE: React Router v7, Vitest + RTL, Playwright, MSW
- BE: Spring Boot 3, Spring Security, Spring Data JPA, Oracle

Key patterns:
- Contract-first (OpenAPI compliance)
- Problem Details for errors
- Structured logging
- Plan-first with Copilot (P0)

Gate criteria:
- Demo successful
- NFR baseline met
- Tests passing
- Security scan clean
```
