# Project Constitution Template

**Project:** [Project Name]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [Tech Lead Name]

---

## Purpose

This Project Constitution defines the technical standards, patterns, and boundaries for the project. All code must conform to these standards. Violations require explicit justification and approval.

**Enforcement:** PRs that violate constitution rules will be rejected until corrected.

---

## 1. Architecture Boundaries

### Layer Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
│  React Router v7: Routes, loaders, actions, components       │
│  Responsibility: User interaction, form handling, display    │
│  ❌ May NOT: Call database, contain business logic           │
├─────────────────────────────────────────────────────────────┤
│                      API LAYER                               │
│  REST Controllers: Request/response mapping, validation      │
│  Responsibility: HTTP handling, input validation, response   │
│  ❌ May NOT: Contain business logic, access DB directly      │
├─────────────────────────────────────────────────────────────┤
│                      SERVICE LAYER                           │
│  Business Services: Domain logic, orchestration              │
│  Responsibility: Business rules, transaction boundaries      │
│  ❌ May NOT: Access HTTP context, return HTTP-specific types │
├─────────────────────────────────────────────────────────────┤
│                      REPOSITORY LAYER                        │
│  Spring Data JPA: Data access, queries                       │
│  Responsibility: CRUD operations, query execution            │
│  ❌ May NOT: Contain business logic, manage transactions     │
└─────────────────────────────────────────────────────────────┘
```

### Allowed Dependencies

| Layer | May Depend On | May NOT Depend On |
|-------|---------------|-------------------|
| Presentation | API contracts only | Service, Repository |
| Controller | Service | Repository |
| Service | Repository, other Services | Controller |
| Repository | Entity | Service, Controller |

### Frontend Component Hierarchy

```
src/
├── routes/           # RRv7 route modules (loader, action, component)
├── components/       # Reusable UI components
│   ├── ui/          # Primitive components (Button, Input, etc.)
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utilities, API client, helpers
└── types/           # TypeScript type definitions
```

**Rules:**
- [ ] Routes define loaders/actions — no data fetching in components
- [ ] Components are pure (no side effects except through actions)
- [ ] UI components are framework-agnostic (no RRv7 imports)
- [ ] Hooks encapsulate stateful logic

---

## 2. Code Standards

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| **Java Classes** | PascalCase | `OrderService`, `CustomerRepository` |
| **Java Methods** | camelCase | `findByCustomerId()`, `createOrder()` |
| **Java Constants** | UPPER_SNAKE | `MAX_ORDER_ITEMS`, `DEFAULT_PAGE_SIZE` |
| **TypeScript Components** | PascalCase | `OrderList`, `CustomerCard` |
| **TypeScript Functions** | camelCase | `fetchOrders()`, `formatCurrency()` |
| **TypeScript Constants** | UPPER_SNAKE | `API_BASE_URL`, `MAX_RETRIES` |
| **Database Tables** | snake_case, plural | `orders`, `order_items`, `customers` |
| **Database Columns** | snake_case | `customer_id`, `created_at` |
| **REST Endpoints** | kebab-case, plural nouns | `/api/v1/orders`, `/api/v1/order-items` |

### File Organization

**Backend (Spring Boot):**
```
src/main/java/com/example/ordermgmt/
├── config/              # Configuration classes
├── controller/          # REST controllers
├── service/             # Business services
├── repository/          # JPA repositories
├── entity/              # JPA entities
├── dto/                 # Data transfer objects
├── exception/           # Custom exceptions
└── util/                # Utility classes
```

**Frontend (React Router v7):**
```
src/
├── routes/
│   ├── orders/
│   │   ├── route.tsx       # Route module
│   │   ├── Orders.tsx      # Page component
│   │   └── orders.test.tsx # Tests
│   └── root.tsx            # Root layout
├── components/
├── hooks/
├── lib/
└── types/
```

### Documentation Standards

**Java:**
```java
/**
 * Creates a new order for the specified customer.
 *
 * @param customerId the customer placing the order
 * @param items list of item IDs to include
 * @return the created order with generated ID
 * @throws CustomerNotFoundException if customer does not exist
 * @throws ItemNotFoundException if any item does not exist
 */
public Order createOrder(Long customerId, List<Long> items) { ... }
```

**TypeScript:**
```typescript
/**
 * Fetches orders for the current user.
 * @param options - Pagination and filter options
 * @returns Paginated list of orders
 * @throws ApiError if the request fails
 */
export async function fetchOrders(options: FetchOptions): Promise<OrderPage> { ... }
```

---

## 3. Testing Standards

### Coverage Requirements

| Test Type | Minimum Coverage | Owner |
|-----------|------------------|-------|
| Unit Tests | 70% line coverage | Developers |
| Integration Tests | All API endpoints | Developers |
| E2E Tests | Critical user journeys | QA |
| Accessibility Tests | All pages | FE Developers |

### Test Pyramid

```
                    ┌─────────┐
                    │   E2E   │  ← Few, slow, high confidence
                    ├─────────┤
              ┌─────┴─────────┴─────┐
              │    Integration      │  ← Some, medium speed
              ├─────────────────────┤
        ┌─────┴─────────────────────┴─────┐
        │            Unit                  │  ← Many, fast, low coupling
        └─────────────────────────────────┘
```

### Test Responsibilities

| Layer | Test Type | Framework | What to Test |
|-------|-----------|-----------|--------------|
| Controller | Integration | Spring Boot Test | Request/response mapping, validation |
| Service | Unit | JUnit + Mockito | Business logic, edge cases |
| Repository | Integration | Testcontainers | Queries, constraints |
| Component | Unit | Vitest + RTL | Rendering, user interaction |
| Route | Integration | Vitest + RTL | Loader/action behavior |
| E2E | E2E | Playwright | User journeys end-to-end |

### Test Naming Convention

```java
// Backend: methodName_scenario_expectedResult
@Test
void createOrder_withValidItems_returnsCreatedOrder() { ... }

@Test
void createOrder_withEmptyItems_throwsValidationException() { ... }
```

```typescript
// Frontend: describe/it pattern
describe('OrderList', () => {
  it('renders loading state while fetching', () => { ... });
  it('displays orders when loaded', () => { ... });
  it('shows error message when fetch fails', () => { ... });
});
```

---

## 4. Logging and Telemetry

### Logging Standards

**Format:** Structured JSON (for machine parsing)

```json
{
  "timestamp": "2026-01-20T10:30:00.123Z",
  "level": "INFO",
  "logger": "com.example.ordermgmt.service.OrderService",
  "message": "Order created successfully",
  "traceId": "abc123def456",
  "spanId": "789ghi",
  "orderId": 12345,
  "customerId": 67890
}
```

**Log Levels:**

| Level | When to Use | Example |
|-------|-------------|---------|
| ERROR | System failure, requires attention | Database connection failed |
| WARN | Potential issue, system continues | Retry attempt, deprecated usage |
| INFO | Significant business events | Order created, user logged in |
| DEBUG | Detailed flow information | Method entry/exit, variable values |
| TRACE | Very detailed debugging | Loop iterations, low-level calls |

**What to Log:**
- [ ] Request received (INFO): endpoint, method, correlation ID
- [ ] Business events (INFO): order created, status changed
- [ ] Errors (ERROR): exception type, message, stack trace
- [ ] External calls (DEBUG): service called, response time

**What NOT to Log:**
- [ ] Passwords, tokens, secrets
- [ ] Full PII (use masking: `email: j***@example.com`)
- [ ] Credit card numbers, SSNs
- [ ] Health check noise (use separate log level)

### Correlation IDs

Every request must include a correlation ID (`X-Correlation-ID` header).
- If present in request, propagate it
- If absent, generate a UUID
- Include in all log entries for that request
- Return in response headers

---

## 5. Security Standards

### Authentication

| Requirement | Standard |
|-------------|----------|
| Protocol | OAuth 2.0 / OpenID Connect |
| Token Format | JWT (JSON Web Token) |
| Token Location | `Authorization: Bearer <token>` header |
| Token Validation | Validate signature, issuer, audience, expiration |
| Session | Stateless (no server-side sessions) |

### Authorization

| Requirement | Standard |
|-------------|----------|
| Model | Role-Based Access Control (RBAC) |
| Enforcement | Spring Security `@PreAuthorize` annotations |
| Claim | Roles extracted from JWT `roles` claim |
| Default | Deny by default, allow explicitly |

### Input Validation

**Backend:**
- [ ] All inputs validated at controller layer
- [ ] Use Bean Validation annotations (`@NotNull`, `@Size`, etc.)
- [ ] Sanitize inputs before use in queries
- [ ] Reject unexpected fields (strict parsing)

**Frontend:**
- [ ] Client-side validation for UX only
- [ ] Never trust client-side validation for security
- [ ] Sanitize user input before display (XSS prevention)

### Data Protection

| Data Type | Protection |
|-----------|------------|
| Passwords | Never store plain text, use bcrypt |
| PII | Encrypt at rest, mask in logs |
| API Keys | Store in secrets manager, never in code |
| Session Tokens | HTTP-only cookies, secure flag |

---

## 6. Accessibility Standards

### Compliance Level

**Target:** WCAG 2.1 Level AA

### Requirements

| Category | Requirement |
|----------|-------------|
| Perceivable | Text alternatives for images, captions for video |
| Operable | Keyboard accessible, no time limits without extension |
| Understandable | Readable text, predictable navigation |
| Robust | Valid HTML, ARIA when needed |

### Implementation Rules

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] Color not used as only means of conveying information
- [ ] Text contrast ratio ≥ 4.5:1 (normal) or ≥ 3:1 (large)
- [ ] Form fields have associated labels
- [ ] Error messages associated with fields
- [ ] Skip links provided for repetitive content
- [ ] Page titles descriptive and unique

### Testing Requirements

- [ ] Lighthouse accessibility score ≥ 90
- [ ] Manual keyboard navigation test
- [ ] Screen reader test (NVDA or VoiceOver)
- [ ] Color contrast check with automated tool

---

## 7. Performance Standards

### Response Time Targets

| Operation | Target (p95) | Measurement |
|-----------|--------------|-------------|
| API Read | < 200ms | Server response time |
| API Write | < 500ms | Server response time |
| Page Load | < 2s | Time to Interactive |
| Search | < 1s | Total round-trip |

### Database Query Guidelines

- [ ] No queries in loops (N+1 problem)
- [ ] Use pagination for list endpoints
- [ ] Index foreign keys and commonly filtered columns
- [ ] Explain plan for queries touching > 1000 rows
- [ ] Connection pooling configured (min 5, max 20)

### Frontend Performance

- [ ] Bundle size < 500KB (gzipped)
- [ ] Lazy load routes and heavy components
- [ ] Images optimized and lazy loaded
- [ ] No blocking resources in critical path
- [ ] Core Web Vitals within "Good" threshold

---

## 8. Error Handling Standards

### Error Format (RFC 7807 Problem Details)

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "The request contains invalid data",
  "instance": "/api/v1/orders",
  "timestamp": "2026-01-20T10:30:00Z",
  "traceId": "abc123",
  "errors": [
    {
      "field": "items",
      "message": "Order must contain at least one item"
    }
  ]
}
```

### Error Categories

| HTTP Status | Type | When to Use |
|-------------|------|-------------|
| 400 | validation-error | Invalid input |
| 401 | authentication-required | Missing or invalid credentials |
| 403 | access-denied | Authenticated but not authorized |
| 404 | not-found | Resource doesn't exist |
| 409 | conflict | State conflict (e.g., already cancelled) |
| 500 | internal-error | Unexpected server error |

### Error Handling Rules

**Backend:**
- [ ] Never expose stack traces to clients
- [ ] Always include correlation ID in errors
- [ ] Log full exception details server-side
- [ ] Use specific exception types, not generic
- [ ] Return Problem Details format for all errors

**Frontend:**
- [ ] Show user-friendly messages, not technical errors
- [ ] Log errors to monitoring service
- [ ] Provide recovery options when possible
- [ ] Handle loading, error, and empty states for all data

---

## Enforcement Mechanisms

| Rule Category | Automated Check | Manual Check |
|---------------|-----------------|--------------|
| Architecture Boundaries | ArchUnit tests | PR review |
| Code Standards | Checkstyle, ESLint | PR review |
| Testing Standards | Coverage gates in CI | PR review |
| Logging Standards | Spotless check | PR review |
| Security Standards | OWASP ZAP, SpotBugs | Security review |
| Accessibility | Lighthouse CI | Manual a11y test |
| Performance | Load tests in CI | Performance review |
| Error Handling | Contract tests | PR review |

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Architect | | | |
| Tech Lead (BE) | | | |
| Tech Lead (FE) | | | |
| Security Lead | | | |
| QA Lead | | | |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial creation |
| | | | |

---

## Copilot Assistance

Use this prompt to check code against the constitution:

```markdown
No secrets, no production data. Use placeholders.

Review this code for adherence to our Project Constitution:

#file <path>

Check for violations of:
1. Layer boundaries (dependencies, responsibilities)
2. Naming conventions
3. Testing requirements
4. Logging standards
5. Security standards
6. Error handling format

For each violation:
- Rule violated
- Location (file:line)
- Suggested fix
```
