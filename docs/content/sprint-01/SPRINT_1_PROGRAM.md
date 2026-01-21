# Sprint 1 Program — Thin Vertical Slice (Weeks 5-6)

> **Sprint Goal:** Prove the end-to-end pipeline from authentication through persistence, with observable logging and automated tests.

**Duration:** 2 weeks (10 working days)  
**Gate:** Thin Slice Demo + All Tests Passing  
**Prerequisites:** Gate 4 passed, Sprint Packet approved, Contract v1 locked

---

## Sprint Overview

Sprint 1 is the first execution sprint after the 4-week preparation phase. The goal is to prove that all the technical decisions made in Weeks 1-4 work together in a **thin vertical slice** — a minimal but complete implementation that exercises every layer of the stack.

### What "Thin Vertical Slice" Means

```
┌─────────────────────────────────────────────────────────────────┐
│                        THIN VERTICAL SLICE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   UI Layer          →  One complete user journey                │
│       ↓                                                         │
│   Route/State       →  React Router v7 loader/action           │
│       ↓                                                         │
│   API Call          →  Authenticated request to backend         │
│       ↓                                                         │
│   Controller        →  Spring Boot REST endpoint                │
│       ↓                                                         │
│   Service           →  Business logic layer                     │
│       ↓                                                         │
│   Repository        →  Oracle persistence                       │
│       ↓                                                         │
│   Database          →  Data stored/retrieved                    │
│       ↓                                                         │
│   Response          →  Back up through all layers               │
│       ↓                                                         │
│   UI Update         →  User sees result                         │
│                                                                 │
│   + Logging at each layer                                       │
│   + Tests at each layer                                         │
│   + Error handling at each layer                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why Thin Slice First?

| Benefit | Explanation |
|---------|-------------|
| **Proves integration** | All layers work together before building more |
| **Finds blockers early** | Infrastructure issues surface in Week 5, not Week 11 |
| **Establishes patterns** | First implementation becomes template for rest |
| **Enables demo** | Stakeholders see real progress |
| **Builds confidence** | Team knows the stack works |

---

## Day 0: Sprint Planning Prep (Lead Only)

### Lead Checklist

- [ ] Sprint Packet draft complete
- [ ] Contract endpoints selected for slice
- [ ] Task breakdown prepared (FE and BE)
- [ ] Story point estimates ready
- [ ] Dependencies identified
- [ ] Risks documented
- [ ] Demo date scheduled

### Materials to Prepare

| Material | Source | Purpose |
|----------|--------|---------|
| Sprint Packet draft | Week 4 template | Scope definition |
| Contract endpoints | openapi.yaml | What to implement |
| Mock server | MSW handlers | FE development |
| Test database | Oracle/H2 | BE development |
| CI pipeline | GitHub Actions | Continuous integration |

---

## Day 1: Sprint Planning + Kickoff (2-3 hours)

### Sprint Planning Session (2 hours)

**Attendees:** All team members, Product Owner, Tech Leads

#### Agenda

| Time | Activity | Output |
|------|----------|--------|
| 0:00-0:15 | Sprint goal review | Shared understanding |
| 0:15-0:45 | Sprint Packet walkthrough | Questions answered |
| 0:45-1:15 | Task breakdown refinement | Tasks assigned |
| 1:15-1:45 | Dependency mapping | Blockers identified |
| 1:45-2:00 | Commitment confirmation | Team commits |

#### Sprint Packet Review Checklist

- [ ] Goal is clear and measurable
- [ ] Definition of Done is specific
- [ ] In-scope items are bounded
- [ ] Out-of-scope items are explicit
- [ ] Acceptance criteria are testable
- [ ] Contract references are correct
- [ ] Security requirements are documented
- [ ] Test requirements are clear

### Kickoff Activities

After planning, teams begin parallel work:

| Stream | First Task | Deliverable |
|--------|------------|-------------|
| FE | Project setup + routing shell | Working app skeleton |
| BE | Project setup + auth skeleton | Working API skeleton |

---

## Days 2-5 (Week 5): Foundation + Core Flow

### FE Stream — Week 5

| Day | Focus | Deliverable | Prompts |
|-----|-------|-------------|---------|
| Day 2 | Project structure + routing | App shell with navigation | P1, P9 |
| Day 3 | Layout components | Header, footer, sidebar | P1, P10 |
| Day 4 | First journey UI | Forms, displays, interactions | P1, P9 |
| Day 5 | MSW integration | Journey working against mocks | P22 |

#### FE Day 2: Project Structure

**Tasks:**
1. Initialize React Router v7 project (if not done)
2. Set up folder structure per conventions
3. Configure routing with placeholder routes
4. Add error boundary

**Copilot Prompt (P9 — Route Scaffold):**
```markdown
No secrets, no production data. Use placeholders.

Create a React Router v7 route for the Order List journey.

Requirements:
- Loader fetches orders from /api/v1/orders
- Uses React Router data loading patterns
- Handles loading/error states
- Follows patterns in .github/instructions/frontend.instructions.md

Include:
1. Route file with loader
2. Component with proper TypeScript types
3. Error boundary
4. Loading state

Reference: docs/content/week-04/contracts/openapi.yaml for API shape
```

#### FE Day 3: Layout Components

**Tasks:**
1. Create shared layout component
2. Implement header with navigation
3. Add error boundary wrapper
4. Set up accessibility foundations (landmarks, skip links)

**Accessibility Baseline:**
```typescript
// Minimum accessibility from Day 1
- Semantic HTML (header, main, nav, footer)
- Skip link to main content
- Keyboard navigation support
- Focus management on route change
- ARIA landmarks properly set
```

#### FE Day 4: First Journey UI

**Tasks:**
1. Implement primary journey components
2. Add form handling (if applicable)
3. Connect to mock data shapes
4. Handle all states (loading, error, empty, success)

**State Handling Checklist:**
- [ ] Loading state with accessible indicator
- [ ] Error state with retry option
- [ ] Empty state with helpful message
- [ ] Success state with data display
- [ ] Validation error display

#### FE Day 5: MSW Integration

**Tasks:**
1. Configure MSW for development
2. Verify handlers match contract
3. Test all happy paths
4. Test error scenarios

**MSW Verification:**
```typescript
// Verify mock matches contract
1. Request shape matches OpenAPI
2. Response shape matches OpenAPI  
3. Error responses use Problem Details
4. Pagination works correctly
5. Auth headers handled
```

---

### BE Stream — Week 5

| Day | Focus | Deliverable | Prompts |
|-----|-------|-------------|---------|
| Day 2 | Project structure + config | Spring Boot skeleton | P7, P8 |
| Day 3 | Auth implementation | OAuth/OIDC working | P7 |
| Day 4 | Core endpoint controller | REST endpoint responding | P8 |
| Day 5 | Repository + persistence | Data stored in Oracle | P6 |

#### BE Day 2: Project Structure

**Tasks:**
1. Initialize Spring Boot project (if not done)
2. Configure application properties
3. Set up package structure
4. Configure logging framework

**Copilot Prompt (P8 — Controller Scaffold):**
```markdown
No secrets, no production data. Use placeholders.

Create a Spring Boot REST controller for Order management.

Requirements:
- GET /api/v1/orders (list with pagination)
- GET /api/v1/orders/{id} (single order)
- POST /api/v1/orders (create order)
- Follow patterns in .github/instructions/backend.instructions.md
- Use Problem Details (RFC 7807) for errors
- Include OpenAPI annotations

Reference: docs/content/week-04/contracts/openapi.yaml
```

#### BE Day 3: Authentication

**Tasks:**
1. Configure OAuth 2.0 / OIDC resource server
2. Implement security configuration
3. Add auth to endpoints
4. Test auth flow

**Auth Configuration Checklist:**
```java
// Spring Security OAuth2 Resource Server
- [ ] spring-boot-starter-oauth2-resource-server dependency
- [ ] JWT validation configured
- [ ] Issuer URI set (from environment)
- [ ] Audience validation
- [ ] Role/scope extraction
- [ ] SecurityFilterChain configured
```

#### BE Day 4: Core Endpoint

**Tasks:**
1. Implement controller for primary endpoint
2. Add request validation
3. Implement service layer logic
4. Add structured logging

**Controller Checklist:**
- [ ] Request validation with @Valid
- [ ] Proper HTTP status codes
- [ ] Problem Details for errors
- [ ] OpenAPI annotations
- [ ] Logging at entry/exit

#### BE Day 5: Persistence

**Tasks:**
1. Create JPA entities
2. Implement Spring Data repository
3. Add database configuration
4. Test with H2 (local) / Oracle (integration)

**Copilot Prompt (P6 — Repository):**
```markdown
No secrets, no production data. Use placeholders.

Create a Spring Data JPA repository for Order entity.

Requirements:
- Basic CRUD operations
- Pagination support with Pageable
- Custom query for filtering by status
- Follow patterns in .github/instructions/backend.instructions.md

Include:
1. Entity with JPA annotations
2. Repository interface
3. Custom query methods needed
4. Audit fields (createdAt, updatedAt)

Reference: docs/content/week-04/templates/DOMAIN_GLOSSARY.md for field definitions
```

---

## Days 6-10 (Week 6): Integration + Testing + Demo

### FE Stream — Week 6

| Day | Focus | Deliverable | Prompts |
|-----|-------|-------------|---------|
| Day 6 | Real API integration | Switch from mocks to BE | P12 |
| Day 7 | Error handling | Problem Details display | P3 |
| Day 8 | Component tests | Vitest + RTL tests | P2 |
| Day 9 | E2E skeleton | Playwright basics | P2 |
| Day 10 | Polish + demo prep | Demo-ready UI | — |

#### FE Day 6: Real API Integration

**Tasks:**
1. Configure API client for real backend
2. Switch from MSW to real endpoints
3. Handle CORS if needed
4. Verify auth token flow

**Integration Checklist:**
- [ ] Environment variable for API base URL
- [ ] Auth token included in requests
- [ ] Error responses properly parsed
- [ ] Loading states still work
- [ ] Retry logic for transient failures

#### FE Day 7: Error Handling

**Tasks:**
1. Implement Problem Details parsing
2. Display user-friendly error messages
3. Add error recovery options
4. Log errors for debugging

**Error Display Patterns:**
```typescript
// Problem Details → User Message
type: "/problems/not-found" → "Order not found"
type: "/problems/validation-error" → Show field errors
type: "/problems/unauthorized" → Redirect to login
type: "/problems/internal-error" → "Something went wrong, try again"
```

#### FE Day 8: Component Tests

**Tasks:**
1. Set up Vitest + React Testing Library
2. Write tests for key components
3. Mock API calls with MSW
4. Aim for 70%+ coverage

**Copilot Prompt (P2 — Tests-First):**
```markdown
No secrets, no production data. Use placeholders.

Generate Vitest + RTL tests for the OrderList component.

Test these scenarios:
1. Loading state displays correctly
2. Orders render when loaded
3. Empty state displays when no orders
4. Error state displays on API failure
5. Pagination works correctly
6. Click on order navigates to detail

Follow patterns in .github/instructions/testing.instructions.md
Use MSW for API mocking.
```

#### FE Day 9: E2E Skeleton

**Tasks:**
1. Set up Playwright
2. Write test for primary journey
3. Configure CI integration
4. Verify against real backend (if available)

**E2E Test Structure:**
```typescript
// tests/e2e/order-journey.spec.ts
test.describe('Order Journey', () => {
  test('user can view order list', async ({ page }) => {
    await page.goto('/orders');
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });
  
  test('user can view order details', async ({ page }) => {
    await page.goto('/orders');
    await page.getByRole('link', { name: /order #/ }).first().click();
    await expect(page.getByRole('heading', { name: /Order #/ })).toBeVisible();
  });
});
```

#### FE Day 10: Demo Prep

**Tasks:**
1. Fix any blocking bugs
2. Polish UI for demo
3. Prepare demo script
4. Practice demo flow

---

### BE Stream — Week 6

| Day | Focus | Deliverable | Prompts |
|-----|-------|-------------|---------|
| Day 6 | Service layer completion | Business logic | P7 |
| Day 7 | Error handling + logging | Observability | P3 |
| Day 8 | Unit tests | JUnit 5 tests | P2 |
| Day 9 | Integration tests | API tests | P2 |
| Day 10 | Contract tests + demo prep | Schema validation | P21 |

#### BE Day 6: Service Layer

**Tasks:**
1. Implement business logic
2. Add validation rules
3. Handle edge cases
4. Add transaction management

**Copilot Prompt (P7 — Service Layer):**
```markdown
No secrets, no production data. Use placeholders.

Create a Spring Boot service for Order business logic.

Requirements:
- Create order with validation
- Get order by ID (with authorization check)
- List orders with pagination and filtering
- Cancel order (with status validation)
- Follow patterns in .github/instructions/backend.instructions.md

Include:
1. Service interface
2. Service implementation
3. Business validation (min 1 item, valid customer, etc.)
4. Logging at key points
5. Transaction boundaries

Business rules from: docs/content/week-04/templates/DOMAIN_GLOSSARY.md
```

#### BE Day 7: Error Handling + Logging

**Tasks:**
1. Implement global exception handler
2. Configure Problem Details responses
3. Add structured logging
4. Configure audit events

**Logging Checklist:**
```java
// Structured logging events
- [ ] Request received (INFO): method, path, user
- [ ] Request completed (INFO): status, duration
- [ ] Business event (INFO): order.created, order.cancelled
- [ ] Validation failure (WARN): field, reason
- [ ] Authorization failure (WARN): user, resource
- [ ] System error (ERROR): exception, stack trace
- [ ] All logs include correlationId/traceId
```

#### BE Day 8: Unit Tests

**Tasks:**
1. Write service layer unit tests
2. Mock repository layer
3. Test business rules
4. Aim for 70%+ coverage

**Unit Test Structure:**
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock
    private OrderRepository orderRepository;
    
    @InjectMocks
    private OrderServiceImpl orderService;
    
    @Test
    void createOrder_withValidData_createsOrder() { }
    
    @Test
    void createOrder_withEmptyItems_throwsValidationException() { }
    
    @Test
    void cancelOrder_inCreatedStatus_cancels() { }
    
    @Test
    void cancelOrder_inShippedStatus_throwsConflictException() { }
}
```

#### BE Day 9: Integration Tests

**Tasks:**
1. Write API integration tests
2. Use @SpringBootTest with test database
3. Test full request/response cycle
4. Verify error responses

**Integration Test Structure:**
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class OrderControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void listOrders_authenticated_returnsOrders() throws Exception {
        mockMvc.perform(get("/api/v1/orders")
                .header("Authorization", "Bearer " + validToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.page.totalElements").isNumber());
    }
    
    @Test
    void listOrders_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/orders"))
            .andExpect(status().isUnauthorized());
    }
}
```

#### BE Day 10: Contract Tests + Demo Prep

**Tasks:**
1. Validate responses match OpenAPI contract
2. Run contract tests in CI
3. Fix any contract drift
4. Prepare demo API calls

**Contract Test Approach:**
```java
// Verify response matches OpenAPI schema
@Test
void getOrder_response_matchesContract() {
    // Get actual response
    String response = mockMvc.perform(get("/api/v1/orders/1"))
        .andReturn().getResponse().getContentAsString();
    
    // Validate against OpenAPI schema
    OpenApiValidator validator = OpenApiValidator.loadFrom("docs/content/week-04/contracts/openapi.yaml");
    validator.validateResponse("/orders/{id}", "GET", 200, response);
}
```

---

## Sprint Demo (Day 10, End of Day)

### Demo Agenda (1 hour)

| Time | Activity | Presenter |
|------|----------|-----------|
| 0:00-0:05 | Sprint goal recap | Scrum Master |
| 0:05-0:25 | FE demo: User journey | FE Lead |
| 0:25-0:45 | BE demo: API + logs | BE Lead |
| 0:45-0:55 | Q&A | All |
| 0:55-1:00 | Next sprint preview | Product Owner |

### Demo Script Template

```markdown
## FE Demo Script

1. **Login** (show auth flow)
   - Navigate to app
   - Authenticate via SSO
   - Arrive at dashboard

2. **View Orders** (show list)
   - Click Orders link
   - See paginated list
   - Note loading state

3. **View Order Detail** (show single)
   - Click on an order
   - See order details
   - Show related data

4. **Error Handling** (show resilience)
   - Trigger error scenario
   - Show error message
   - Show recovery option

## BE Demo Script

1. **API Call** (show request/response)
   - Make authenticated request
   - Show response format
   - Show pagination

2. **Logging** (show observability)
   - Show log output
   - Highlight correlation ID
   - Show audit events

3. **Contract Compliance** (show quality)
   - Run contract tests
   - Show passing results
   - Highlight validation
```

---

## Sprint Retrospective (After Demo)

### Retro Agenda (1 hour)

| Time | Activity |
|------|----------|
| 0:00-0:05 | Set the stage |
| 0:05-0:20 | What went well? |
| 0:20-0:35 | What could improve? |
| 0:35-0:50 | Action items |
| 0:50-1:00 | Copilot learnings |

### Copilot-Specific Retro Questions

1. **Which prompts worked best?**
   - Capture successful prompts for team
   
2. **Where did Copilot struggle?**
   - Note areas needing more context
   
3. **What patterns should we add to instructions?**
   - Update .github/copilot-instructions.md
   
4. **Time saved estimates?**
   - Rough estimate for metrics

---

## Sprint 1 Prompts

| ID | Name | When to Use |
|----|------|-------------|
| P0 | Plan Only | Before any implementation |
| P1 | Feature Scaffold | Creating new components/modules |
| P2 | Tests-First | Writing tests before implementation |
| P3 | Bug Fix | Fixing issues |
| P6 | Repository | Creating data access layer |
| P7 | Service Layer | Creating business logic |
| P8 | Controller | Creating REST endpoints |
| P9 | Route Scaffold | Creating React Router routes |
| P10 | Accessibility | Checking accessibility |
| P12 | @workspace | Understanding codebase |
| P21 | Contract Validation | Verifying API compliance |
| P22 | Mock Handler | Generating MSW handlers |

---

## Definition of Done — Sprint 1

### Feature-Level DoD

- [ ] Acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Unit tests passing (≥70% coverage)
- [ ] Integration tests passing
- [ ] Contract tests passing
- [ ] No security scan blockers
- [ ] Logging implemented
- [ ] Error handling complete
- [ ] Accessibility baseline met (FE)
- [ ] Documentation updated

### Sprint-Level DoD

- [ ] All in-scope features complete per feature DoD
- [ ] E2E test skeleton passing
- [ ] Demo completed successfully
- [ ] No critical bugs remaining
- [ ] Contract compatibility verified
- [ ] Sprint retro completed
- [ ] Sprint 2 packet prepared

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Auth integration issues | Medium | High | Day 3 focus, backup mock auth |
| Database connection issues | Medium | High | H2 fallback for development |
| Contract drift | Low | Medium | Daily contract checks |
| FE/BE integration issues | Medium | Medium | Day 6 integration focus |
| Scope creep | Medium | Medium | Strict Sprint Packet adherence |

---

## Copilot Assistance

```
Sprint 1 focuses on proving the full stack works:

Key prompts for Sprint 1:
- P1, P9: Scaffold FE components and routes
- P6, P7, P8: Scaffold BE layers
- P2: Write tests for each layer
- P21: Validate contract compliance

Remember:
- Plan first (P0) before implementing
- Small, reviewable diffs
- Tests at every layer
- Logging at every layer
- Error handling at every layer

Demo goal: Show a user can complete one journey
end-to-end with proper auth, data persistence,
error handling, and logging.
```

---

## Navigation

| Previous | Next |
|----------|------|
| [Week 4: Contract-First](../week-04/README.md) | [Sprint 2: Expand + NFRs](../sprint-02/README.md) |
