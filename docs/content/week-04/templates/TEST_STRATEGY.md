# Test Strategy Template

**Project:** [Project Name]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [QA Lead]

---

## Purpose

This document defines the testing strategy across all layers of the application. It establishes responsibilities, tools, and coverage expectations for the frontend and backend teams.

**Goal:** Predictable quality through layered testing with clear ownership.

---

## Test Pyramid

```
                            ┌───────────┐
                            │    E2E    │  5-10%
                            │ (Critical │  Slow, high confidence
                            │  Paths)   │  
                            ├───────────┤
                      ┌─────┴───────────┴─────┐
                      │       Contract        │  10-15%
                      │   (API Compliance)    │  Medium speed
                      ├───────────────────────┤
                ┌─────┴───────────────────────┴─────┐
                │          Integration              │  25-35%
                │   (Component Interaction)         │  Moderate speed
                ├───────────────────────────────────┤
          ┌─────┴───────────────────────────────────┴─────┐
          │                    Unit                        │  40-50%
          │            (Isolated Logic)                    │  Fast, many tests
          └───────────────────────────────────────────────┘
```

**Principle:** More tests at the bottom, fewer at the top.

---

## Test Layers

### 1. Unit Tests

**What:** Test isolated units of code (functions, methods, components).

**Frontend:**

| What to Test | Framework | Location |
|--------------|-----------|----------|
| Utility functions | Vitest | `src/lib/*.test.ts` |
| Custom hooks | Vitest + RTL | `src/hooks/*.test.ts` |
| UI components (rendering) | Vitest + RTL | `src/components/*.test.tsx` |
| Form validation logic | Vitest | `src/lib/validation.test.ts` |

**Backend:**

| What to Test | Framework | Location |
|--------------|-----------|----------|
| Service business logic | JUnit 5 + Mockito | `src/test/java/**/service/*Test.java` |
| Validators | JUnit 5 | `src/test/java/**/validator/*Test.java` |
| Mappers/converters | JUnit 5 | `src/test/java/**/mapper/*Test.java` |
| Utility classes | JUnit 5 | `src/test/java/**/util/*Test.java` |

**Coverage Target:** 70% line coverage minimum

**Naming Convention:**
```java
// Backend: methodName_scenario_expectedResult
@Test
void createOrder_withValidItems_returnsCreatedOrder() { }

@Test
void createOrder_withEmptyItems_throwsValidationException() { }
```

```typescript
// Frontend: describe/it pattern
describe('formatCurrency', () => {
  it('formats positive amounts with 2 decimals', () => { });
  it('handles zero amount', () => { });
  it('handles negative amounts', () => { });
});
```

---

### 2. Integration Tests

**What:** Test interaction between components/layers.

**Frontend:**

| What to Test | Framework | Location |
|--------------|-----------|----------|
| Route loaders | Vitest + RTL + MSW | `src/routes/*.test.tsx` |
| Route actions | Vitest + RTL + MSW | `src/routes/*.test.tsx` |
| Component + hook integration | Vitest + RTL | `src/components/*.integration.test.tsx` |
| Form submission flows | Vitest + RTL + MSW | `src/routes/*.test.tsx` |

**Backend:**

| What to Test | Framework | Location |
|--------------|-----------|----------|
| Controller → Service flow | Spring Boot Test | `src/test/java/**/controller/*IT.java` |
| Service → Repository flow | Spring Boot Test | `src/test/java/**/service/*IT.java` |
| Repository queries | @DataJpaTest | `src/test/java/**/repository/*IT.java` |
| REST API responses | MockMvc | `src/test/java/**/controller/*IT.java` |

**Database Strategy:**

| Approach | When to Use | Pros | Cons |
|----------|-------------|------|------|
| H2 In-Memory | Fast CI tests | Fast, no setup | Not identical to Oracle |
| Testcontainers | Accurate Oracle behavior | Real Oracle | Slower startup |
| Embedded Oracle | Full compatibility | Most accurate | Complex setup |

**Recommended:** H2 for unit/fast integration, Testcontainers for critical paths.

```java
// Example: Controller Integration Test
@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerIT {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void getOrder_whenExists_returns200WithOrder() throws Exception {
        mockMvc.perform(get("/api/v1/orders/1")
                .header("Authorization", "Bearer " + testToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.status").value("CREATED"));
    }
    
    @Test
    void getOrder_whenNotFound_returns404ProblemDetail() throws Exception {
        mockMvc.perform(get("/api/v1/orders/99999")
                .header("Authorization", "Bearer " + testToken))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.type").value("/problems/not-found"))
            .andExpect(jsonPath("$.status").value(404));
    }
}
```

```typescript
// Example: Route Integration Test
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '~/routes';
import { server } from '~/mocks/server';
import { http, HttpResponse } from 'msw';

describe('OrdersRoute', () => {
  it('displays orders when loaded', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/orders'] });
    render(<RouterProvider router={router} />);
    
    await waitFor(() => {
      expect(screen.getByText('Order #12345')).toBeInTheDocument();
    });
  });
  
  it('displays error when fetch fails', async () => {
    server.use(
      http.get('/api/v1/orders', () => {
        return HttpResponse.json({
          type: '/problems/internal-error',
          title: 'Internal Error',
          status: 500,
          detail: 'Database unavailable'
        }, { status: 500 });
      })
    );
    
    const router = createMemoryRouter(routes, { initialEntries: ['/orders'] });
    render(<RouterProvider router={router} />);
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
```

---

### 3. Contract Tests

**What:** Verify API producer and consumer agree on contract.

**Approaches:**

| Approach | When to Use | Tools |
|----------|-------------|-------|
| OpenAPI Validation | Primary approach | Spectral, OpenAPI-generator |
| Consumer-Driven (Pact) | Complex integrations | Pact |
| Schema Validation | Response structure | JSON Schema |

**OpenAPI Validation (Recommended):**

```java
// Backend: Validate response matches OpenAPI
@Test
void getOrders_responseMatchesOpenApi() throws Exception {
    String response = mockMvc.perform(get("/api/v1/orders"))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();
    
    OpenApiValidation.assertValid(
        "docs/content/week-04/contracts/openapi.yaml",
        "/api/v1/orders", "GET", 200, response
    );
}
```

```typescript
// Frontend: Validate request matches OpenAPI
import Ajv from 'ajv';
import openApiSchema from '../../../docs/content/week-04/contracts/openapi.json';

describe('API Contract Compliance', () => {
  const ajv = new Ajv();
  
  it('CreateOrderRequest matches schema', () => {
    const schema = openApiSchema.components.schemas.CreateOrderRequest;
    const validate = ajv.compile(schema);
    
    const request = {
      customerId: 67890,
      items: [{ itemId: 101, quantity: 2 }]
    };
    
    expect(validate(request)).toBe(true);
  });
});
```

**Contract Drift Detection:**

```bash
# CI pipeline step
npx @stoplight/spectral-cli lint docs/content/week-04/contracts/openapi.yaml
# Fails if contract has issues

# Compare contract to implementation
npx openapi-diff old-contract.yaml new-contract.yaml
# Flags breaking changes
```

---

### 4. End-to-End Tests

**What:** Test complete user journeys through the real application.

**Framework:** Playwright

**Scope:** Critical paths only (5-10 tests maximum).

**Critical Paths to Cover:**

| Journey | Priority | Reason |
|---------|----------|--------|
| Create order | P1 | Core revenue flow |
| View order history | P1 | Common user action |
| Cancel order | P2 | Important edge case |
| Login flow | P1 | Access prerequisite |

```typescript
// e2e/orders.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Order Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('user can create an order', async ({ page }) => {
    await page.goto('/orders/new');
    
    // Add items
    await page.click('[data-testid="add-item"]');
    await page.selectOption('[data-testid="item-select"]', '101');
    await page.fill('[data-testid="quantity"]', '2');
    
    // Submit
    await page.click('[data-testid="submit-order"]');
    
    // Verify
    await expect(page).toHaveURL(/\/orders\/\d+/);
    await expect(page.locator('[data-testid="order-status"]')).toHaveText('Created');
  });
  
  test('user can view order history', async ({ page }) => {
    await page.goto('/orders');
    
    await expect(page.locator('[data-testid="order-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-card"]')).toHaveCount.greaterThan(0);
  });
  
  test('user can cancel a pending order', async ({ page }) => {
    await page.goto('/orders/12345'); // Known pending order
    
    await page.click('[data-testid="cancel-order"]');
    await page.click('[data-testid="confirm-cancel"]');
    
    await expect(page.locator('[data-testid="order-status"]')).toHaveText('Cancelled');
  });
});
```

**E2E Environment:**
- Run against staging environment (not mocks)
- Seed database with known test data
- Clean up after tests

---

## Coverage Requirements

| Layer | Minimum Coverage | Measured By |
|-------|------------------|-------------|
| Unit (FE) | 70% line | Vitest coverage |
| Unit (BE) | 70% line | JaCoCo |
| Integration | All endpoints | MockMvc coverage |
| Contract | 100% schemas | OpenAPI validation |
| E2E | Critical paths | Manual tracking |

**CI Gates:**

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    steps:
      - name: Run unit tests with coverage
        run: npm run test:coverage
        
      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 70" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 70% threshold"
            exit 1
          fi
```

---

## Test Data Management

### Fixtures

```typescript
// src/test/fixtures/orders.ts
export const orderFixtures = {
  created: {
    id: 12345,
    customerId: 67890,
    status: 'CREATED',
    totalAmount: '109.97',
    items: [...]
  },
  shipped: {
    id: 12346,
    customerId: 67890,
    status: 'SHIPPED',
    totalAmount: '59.97',
    items: [...]
  },
  cancelled: {
    id: 12347,
    customerId: 67890,
    status: 'CANCELLED',
    totalAmount: '29.99',
    items: [...]
  }
};
```

### Factories

```java
// Backend: Test data factories
public class OrderFactory {
    public static Order createOrder() {
        return Order.builder()
            .id(1L)
            .customerId(1L)
            .status(OrderStatus.CREATED)
            .items(List.of(OrderItemFactory.createItem()))
            .totalAmount(new BigDecimal("29.99"))
            .createdAt(Instant.now())
            .build();
    }
    
    public static Order createOrderWithStatus(OrderStatus status) {
        return createOrder().toBuilder().status(status).build();
    }
}
```

---

## Test Naming and Organization

### Frontend

```
src/
├── components/
│   ├── OrderCard.tsx
│   └── OrderCard.test.tsx         # Unit tests
├── routes/
│   ├── orders/
│   │   ├── route.tsx
│   │   └── route.test.tsx         # Integration tests
├── lib/
│   ├── formatters.ts
│   └── formatters.test.ts         # Unit tests
└── test/
    ├── fixtures/                  # Shared test data
    └── utils/                     # Test helpers
```

### Backend

```
src/
├── main/java/com/example/
│   ├── controller/
│   ├── service/
│   └── repository/
└── test/java/com/example/
    ├── controller/
    │   ├── OrderControllerTest.java     # Unit (mocked service)
    │   └── OrderControllerIT.java       # Integration (full stack)
    ├── service/
    │   └── OrderServiceTest.java        # Unit tests
    ├── repository/
    │   └── OrderRepositoryIT.java       # Integration (database)
    └── fixture/
        └── OrderFactory.java            # Test data factories
```

---

## Test Execution

### Local Development

```bash
# Frontend
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage

# Backend
./gradlew test         # Unit tests
./gradlew integrationTest  # Integration tests
./gradlew test --tests "*IT"  # Just integration
```

### CI Pipeline

```yaml
test:
  steps:
    # Unit tests (parallel)
    - run: npm run test:coverage
    - run: ./gradlew test
    
    # Integration tests (sequential)
    - run: ./gradlew integrationTest
    
    # Contract tests
    - run: npm run test:contract
    
    # E2E (on merge to main only)
    - run: npm run test:e2e
      if: github.ref == 'refs/heads/main'
```

---

## Accessibility Testing

### Automated

```typescript
// Using axe-core with Vitest
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('OrderList has no accessibility violations', async () => {
  const { container } = render(<OrderList orders={mockOrders} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Checklist

- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast passes
- [ ] Focus indicators visible

---

## Performance Testing

### Load Testing (Sprint 2+)

| Metric | Target | Tool |
|--------|--------|------|
| API Response (p95) | < 200ms | k6 |
| Concurrent users | 500 | k6 |
| Page load (TTI) | < 2s | Lighthouse CI |

```javascript
// k6 load test
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '5m',
};

export default function () {
  const res = http.get('http://api.example.com/api/v1/orders');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
```

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| FE Lead | | | |
| BE Lead | | | |
| QA Lead | | | |
| Architect | | | |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial strategy |
| | | | |
