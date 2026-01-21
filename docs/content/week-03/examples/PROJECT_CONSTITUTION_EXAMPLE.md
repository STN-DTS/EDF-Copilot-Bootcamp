# Project Constitution — Order Management System

> Quality benchmark example for Project Constitution documentation.

**Version:** 1.0  
**Effective Date:** 2026-01-20  
**Owner:** Tech Lead

---

## 1. Architecture Overview

### 1.1 System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React 18 + React Router v7 + TanStack Query        │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐             │   │
│  │  │ Routes  │  │ Queries │  │Components│             │   │
│  │  └─────────┘  └─────────┘  └─────────┘             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS/REST
┌─────────────────────────────────────────────────────────────┐
│                        Backend                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Spring Boot 3.2 + Spring Security + JPA            │   │
│  │  ┌──────────┐  ┌─────────┐  ┌──────────┐           │   │
│  │  │Controller│  │ Service │  │Repository│           │   │
│  │  └──────────┘  └─────────┘  └──────────┘           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ JDBC
                    ┌─────────────────┐
                    │  PostgreSQL 15  │
                    └─────────────────┘
```

### 1.2 Layer Responsibilities

| Layer | Responsibility | Does NOT Do |
|-------|----------------|-------------|
| **Route/Page** | URL mapping, data loading | Business logic |
| **Component** | UI rendering, user events | API calls directly |
| **Query/Hook** | Data fetching, caching | Business validation |
| **Controller** | HTTP handling, input validation | Business logic |
| **Service** | Business logic, orchestration | Direct DB access |
| **Repository** | Data access, queries | Business logic |

### 1.3 Cross-Cutting Concerns

| Concern | Implementation | Owner |
|---------|----------------|-------|
| Authentication | Spring Security + OAuth 2.0 | BE Team |
| Authorization | Role-based (@PreAuthorize) | BE Team |
| Logging | OpenTelemetry + ELK | Platform Team |
| Caching | Caffeine L1 + Redis L2 | BE Team |
| Monitoring | Prometheus + Grafana | Platform Team |

---

## 2. Code Standards

### 2.1 Backend (Java)

**Formatting:**
- Google Java Format, enforced by `spotless` plugin
- Max line length: 120 characters
- Imports: no wildcards, sorted alphabetically

**Naming:**
```java
// Classes: PascalCase, nouns
public class OrderService { }
public class OrderNotFoundException extends RuntimeException { }

// Methods: camelCase, verbs
public Order createOrder(CreateOrderRequest request) { }
public List<Order> findByCustomerId(String customerId) { }

// Constants: UPPER_SNAKE_CASE
public static final int MAX_ITEMS_PER_ORDER = 100;
public static final String DEFAULT_CURRENCY = "USD";

// Packages: lowercase, domain-based
com.example.ordermanagement.order.service
com.example.ordermanagement.customer.repository
```

**Documentation:**
```java
/**
 * Creates a new order for the given customer.
 *
 * @param request the order creation request containing customer and items
 * @return the created order with generated ID
 * @throws CustomerNotFoundException if customer does not exist
 * @throws InvalidOrderException if items list is empty or invalid
 */
public Order createOrder(CreateOrderRequest request) { }
```

**Annotations Order:**
```java
@RestController                    // 1. Spring stereotype
@RequestMapping("/api/orders")     // 2. Request mapping
@RequiredArgsConstructor           // 3. Lombok
@Validated                         // 4. Validation
@Slf4j                             // 5. Logging
public class OrderController { }
```

### 2.2 Frontend (TypeScript)

**Formatting:**
- Prettier with project config
- Max line length: 100 characters
- Semicolons: required
- Single quotes for strings

**Naming:**
```typescript
// Components: PascalCase
export function OrderList() { }
export function OrderDetailCard({ order }: OrderDetailCardProps) { }

// Hooks: camelCase with use prefix
export function useOrders() { }
export function useCreateOrder() { }

// Types/Interfaces: PascalCase
interface OrderResponse { }
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// Constants: UPPER_SNAKE_CASE
export const MAX_ITEMS_PER_ORDER = 100;
export const API_BASE_URL = '/api';

// Files: kebab-case
order-list.tsx
use-orders.ts
order-types.ts
```

**Component Structure:**
```typescript
// 1. Imports (external, then internal, then types)
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OrderCard } from './order-card';
import type { Order } from './order-types';

// 2. Types
interface OrderListProps {
  customerId: string;
  onOrderSelect?: (orderId: string) => void;
}

// 3. Component
export function OrderList({ customerId, onOrderSelect }: OrderListProps) {
  // 3a. Hooks
  const { data, isLoading, error } = useOrders(customerId);
  
  // 3b. State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // 3c. Handlers
  const handleSelect = (orderId: string) => {
    setSelectedId(orderId);
    onOrderSelect?.(orderId);
  };
  
  // 3d. Render
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  
  return (
    <ul>
      {data.orders.map(order => (
        <OrderCard key={order.id} order={order} onSelect={handleSelect} />
      ))}
    </ul>
  );
}
```

---

## 3. Testing Standards

### 3.1 Test Pyramid

| Layer | Type | Framework | Coverage Target |
|-------|------|-----------|-----------------|
| BE | Unit | JUnit 5 + Mockito | 80% |
| BE | Integration | Spring Boot Test + Testcontainers | Critical paths |
| FE | Unit | Vitest + RTL | 80% |
| FE | Integration | MSW + Vitest | API layer |
| E2E | Journey | Playwright | 5 critical paths |

### 3.2 Test Naming

**Backend:**
```java
// Pattern: methodName_condition_expectedResult
@Test
void createOrder_withValidItems_returnsOrderWithGeneratedId() { }

@Test
void createOrder_withEmptyItems_throwsInvalidOrderException() { }

@Test
void cancelOrder_whenAlreadyShipped_throwsConflictException() { }
```

**Frontend:**
```typescript
// Pattern: describe block + it statement
describe('OrderList', () => {
  it('displays loading spinner while fetching orders', () => { });
  it('displays error message when fetch fails', () => { });
  it('renders order cards when data is loaded', () => { });
  it('calls onOrderSelect when order is clicked', () => { });
});
```

### 3.3 Test Data

- Use factories/builders for test data
- Never use production data
- Use meaningful placeholder values

```java
// Good
Order order = OrderFixture.builder()
    .id("ORD-TEST-001")
    .customerId("CUST-TEST-001")
    .status(OrderStatus.PENDING)
    .build();

// Bad
Order order = new Order("123", "456", OrderStatus.PENDING);
```

---

## 4. Error Handling

### 4.1 Backend Error Responses

**Standard:** All API errors MUST use RFC 7807 Problem Details format.

**Required Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | URI | Yes | Error type identifier |
| title | string | Yes | Human-readable title |
| status | integer | Yes | HTTP status code |
| detail | string | Yes | Specific error message |
| instance | URI | No | Request identifier |
| traceId | string | Yes | Correlation ID for tracing |

**Example Response:**
```json
{
  "type": "https://api.example.com/errors/order-not-found",
  "title": "Order Not Found",
  "status": 404,
  "detail": "Order ORD-12345 does not exist",
  "instance": "/api/orders/ORD-12345",
  "traceId": "abc123-def456"
}
```

**Validation Error Example:**
```json
{
  "type": "https://api.example.com/errors/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Request validation failed",
  "traceId": "abc123-def456",
  "violations": [
    { "field": "items", "message": "must not be empty" },
    { "field": "customerId", "message": "must not be blank" }
  ]
}
```

**Rules:**
1. Never expose stack traces in production responses
2. Always include traceId for debugging
3. Use specific error types, not generic "error" messages
4. Include field-level details for validation errors

### 4.2 Frontend Error Handling

| Error Type | Handling Pattern | UI Treatment |
|------------|------------------|--------------|
| Validation (400) | Inline field errors | Show next to field |
| Not Found (404) | Error component | Show "Not Found" page |
| Conflict (409) | Toast + retry | Show conflict message |
| Server Error (5xx) | Toast + retry | Show "Something went wrong" |
| Network Error | Toast + retry | Show "Connection lost" |

**Implementation:**
```typescript
// Error boundary for unexpected errors
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>

// Query error handling
const { data, error } = useQuery({
  queryKey: ['order', orderId],
  queryFn: () => fetchOrder(orderId),
});

if (error) {
  if (error.status === 404) {
    return <NotFoundPage />;
  }
  return <ErrorDisplay error={error} retry={refetch} />;
}
```

---

## 5. Security Standards

### 5.1 Authentication

- All endpoints require authentication except `/health`, `/api/public/**`
- JWT tokens with 1-hour expiry
- Refresh tokens with 7-day expiry
- Microsoft Entra ID as identity provider

### 5.2 Authorization

| Endpoint Pattern | Required Role |
|------------------|---------------|
| GET /api/orders | USER, CSR, ADMIN |
| POST /api/orders | USER, ADMIN |
| PUT /api/orders/* | USER (own), CSR, ADMIN |
| DELETE /api/orders/* | ADMIN |
| /api/admin/** | ADMIN |

### 5.3 Data Protection

- PII fields encrypted at rest (AES-256)
- PII never logged (use `[REDACTED]` placeholder)
- API responses exclude sensitive fields by default
- TLS 1.3 for all connections

### 5.4 Input Validation

- Validate all inputs at controller level
- Use allowlists, not blocklists
- Sanitize HTML content before storage
- Reject requests exceeding size limits (10MB)

---

## 6. API Standards

### 6.1 REST Conventions

| Operation | Method | Path | Success | Error |
|-----------|--------|------|---------|-------|
| List | GET | /api/orders | 200 | 400, 500 |
| Create | POST | /api/orders | 201 | 400, 409, 500 |
| Read | GET | /api/orders/{id} | 200 | 404, 500 |
| Update | PUT | /api/orders/{id} | 200 | 400, 404, 409, 500 |
| Delete | DELETE | /api/orders/{id} | 204 | 404, 409, 500 |

### 6.2 Pagination

```json
GET /api/orders?page=0&size=20&sort=createdAt,desc

{
  "content": [...],
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8
  }
}
```

### 6.3 Versioning

- URL path versioning: `/api/v1/orders`
- Major version only in URL
- Breaking changes require new version
- Support N-1 version for 6 months

---

## 7. Branching Strategy

### 7.1 Branch Types

| Branch | Purpose | Naming | Lifetime |
|--------|---------|--------|----------|
| main | Production-ready | `main` | Permanent |
| develop | Integration | `develop` | Permanent |
| feature | New work | `feature/JIRA-123-description` | Until merged |
| bugfix | Bug fixes | `bugfix/JIRA-456-description` | Until merged |
| hotfix | Production fix | `hotfix/JIRA-789-description` | Until merged |
| release | Release prep | `release/v1.2.0` | Until deployed |

### 7.2 Merge Requirements

- [ ] All CI checks passing
- [ ] At least 1 approving review
- [ ] No unresolved comments
- [ ] Branch up to date with target
- [ ] Coverage thresholds met
- [ ] No security vulnerabilities

### 7.3 Commit Messages

Format: `type(scope): description`

```
feat(order): add cancel order endpoint
fix(auth): handle expired refresh tokens
docs(api): update OpenAPI specification
test(order): add integration tests for cancel flow
refactor(service): extract order validation logic
```

---

## 8. Definition of Done

### 8.1 Story Level

- [ ] Code complete and reviewed
- [ ] Unit tests passing (80% coverage on new code)
- [ ] Integration tests for API changes
- [ ] Documentation updated (API, README)
- [ ] Accessibility verified (WCAG 2.1 AA)
- [ ] Security review (if applicable)
- [ ] Performance benchmarks met
- [ ] Feature flag configured (if applicable)

### 8.2 Sprint Level

- [ ] All stories meet story DoD
- [ ] E2E tests for new journeys
- [ ] Performance benchmarks met
- [ ] Release notes updated
- [ ] Demo prepared
- [ ] Technical debt documented

---

## Appendix A: ADR References

| ADR | Decision | Status |
|-----|----------|--------|
| [ADR-001](../adrs/001-authentication.md) | Microsoft Entra ID OAuth 2.0 | Accepted |
| [ADR-002](../adrs/002-error-handling.md) | RFC 7807 Problem Details | Accepted |
| [ADR-003](../adrs/003-api-versioning.md) | URL path versioning | Accepted |
| [ADR-004](../adrs/004-ui-state-management.md) | TanStack Query + React Router | Accepted |
| [ADR-005](../adrs/005-database-strategy.md) | PostgreSQL 15 | Accepted |
| [ADR-006](../adrs/006-logging-telemetry.md) | OpenTelemetry | Accepted |
| [ADR-007](../adrs/007-caching-strategy.md) | Two-tier caching | Accepted |
| [ADR-008](../adrs/008-testing-strategy.md) | Testing Pyramid | Accepted |

---

## Appendix B: Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend Framework | React | 18.2 |
| Frontend Router | React Router | 7.x |
| State Management | TanStack Query | 5.x |
| Build Tool | Vite | 5.x |
| Backend Framework | Spring Boot | 3.2 |
| Database | PostgreSQL | 15 |
| Cache | Caffeine + Redis | 3.x / 7.x |
| Testing (BE) | JUnit | 5 |
| Testing (FE) | Vitest | 1.x |
| E2E Testing | Playwright | 1.40 |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-20 | Tech Lead | Initial version |
