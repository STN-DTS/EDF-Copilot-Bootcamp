# ADR-008: Testing Strategy

## Status
Accepted

## Date
2026-01-20

## Context

Quality goals:
- Prevent regression in critical flows
- Enable confident refactoring
- Catch issues before production
- Support continuous deployment

Constraints:
- CI pipeline must complete in <10 minutes
- All tests must be reproducible
- No external service dependencies in CI

Team structure:
- 2 FE developers
- 2 BE developers
- 1 QA engineer

Deployment cadence:
- Deploy to production multiple times per week
- Feature flags for gradual rollout

Current state:
- Limited test coverage (~30%)
- Manual QA for each release
- Occasional production regressions

## Decision

We will implement the **Testing Pyramid** with:
- **Unit tests (70%):** Fast, isolated, developer-owned
- **Integration tests (20%):** Service boundaries, API contracts
- **E2E tests (10%):** Critical user journeys only

## Options Considered

| Criterion | Testing Pyramid | Ice Cream Cone | Manual Only |
|-----------|----------------|----------------|-------------|
| Speed | ✅ Fast | ❌ Slow | ❌ Slow |
| Confidence | ✅ High | ⚠️ Medium | ❌ Low |
| Maintenance | ✅ Low | ❌ High | ✅ None |
| Coverage | ✅ Comprehensive | ⚠️ E2E focused | ❌ Inconsistent |
| Cost | ✅ Moderate | ❌ High | ⚠️ Variable |

### Option A: Testing Pyramid (Chosen)

**Pros:**
- Fast feedback loop (unit tests in seconds)
- High confidence through layered approach
- Clear ownership per layer
- Supports rapid refactoring
- Industry best practice

**Cons:**
- Requires discipline to maintain pyramid ratio
- Integration tests need Testcontainers setup
- Initial investment to build test infrastructure

### Option B: Ice Cream Cone (E2E Heavy)

**Pros:**
- Tests real user flows
- Catches integration issues

**Cons:**
- Slow CI pipeline (20+ minutes)
- Flaky tests block deploys
- Hard to debug failures
- Expensive to maintain

### Option C: Manual Only

**Pros:**
- No test infrastructure needed
- Human judgment on edge cases

**Cons:**
- Slow release cycle
- Inconsistent coverage
- Cannot support CD
- Regression risk

## Consequences

### Positive
- Fast feedback loop (<10 min CI)
- High confidence in changes
- Clear ownership per layer
- Supports refactoring
- Enables continuous deployment

### Negative
- Requires discipline to maintain pyramid ratio
- Integration tests need Testcontainers setup
- E2E tests require maintenance

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Pyramid inverts over time | Medium | High | Track metrics, enforce in PR |
| E2E flakiness blocks deploys | Medium | Medium | Quarantine flaky tests |
| Coverage drops | Medium | Medium | Coverage gates in CI |

## Implementation Notes

### Test Distribution

| Layer | Type | Framework | Coverage Target | Owner |
|-------|------|-----------|-----------------|-------|
| BE Unit | Unit | JUnit 5 + Mockito | 80% line coverage | BE Devs |
| BE Integration | Integration | Spring Boot Test + Testcontainers | Critical paths | BE Devs |
| FE Unit | Unit | Vitest + Testing Library | 80% line coverage | FE Devs |
| FE Integration | Integration | MSW + Vitest | API layer | FE Devs |
| E2E | Journey | Playwright | 5 critical journeys | QA |
| Contract | Contract | Pact | API boundaries | FE + BE |

### CI Pipeline Stages

```yaml
stages:
  - name: Unit Tests
    parallel: true
    jobs:
      - backend-unit
      - frontend-unit
    timeout: 3m
    
  - name: Integration Tests
    parallel: true
    jobs:
      - backend-integration
      - frontend-integration
    timeout: 5m
    
  - name: E2E Tests
    jobs:
      - e2e-critical-paths
    timeout: 10m
    allow_failure: false
```

### Coverage Gates

| Metric | Threshold | Action |
|--------|-----------|--------|
| Line coverage (new code) | 80% | Block merge |
| Branch coverage (new code) | 70% | Warning |
| Overall coverage drop | >2% | Block merge |
| E2E critical paths | 100% pass | Block deploy |

### Test Naming Convention

**Backend (Java):**
```java
// Pattern: methodName_condition_expectedResult
@Test
void createOrder_withValidItems_returnsOrderWithId() { }

@Test
void createOrder_withEmptyItems_throwsValidationException() { }

@Test
void cancelOrder_whenAlreadyShipped_throwsConflictException() { }
```

**Frontend (TypeScript):**
```typescript
// Pattern: describe block + it statement
describe('OrderList', () => {
  it('displays loading state while fetching orders', () => { });
  it('displays error message when fetch fails', () => { });
  it('renders order items when data is loaded', () => { });
});
```

### Backend Unit Test Example

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private CustomerService customerService;
    
    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrder_withValidItems_returnsOrderWithId() {
        // Given
        var request = new CreateOrderRequest("CUST-001", List.of(
            new OrderItemRequest("ITEM-001", 2)
        ));
        when(customerService.exists("CUST-001")).thenReturn(true);
        when(orderRepository.save(any())).thenAnswer(inv -> {
            Order order = inv.getArgument(0);
            order.setId("ORD-001");
            return order;
        });

        // When
        Order result = orderService.createOrder(request);

        // Then
        assertThat(result.getId()).isEqualTo("ORD-001");
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(orderRepository).save(any(Order.class));
    }
}
```

### Backend Integration Test Example

```java
@SpringBootTest
@Testcontainers
class OrderApiIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void createOrder_whenValidRequest_returns201() {
        // Given
        var request = Map.of(
            "customerId", "CUST-001",
            "items", List.of(Map.of("itemId", "ITEM-001", "quantity", 2))
        );

        // When
        var response = restTemplate.postForEntity(
            "/api/orders", request, OrderResponse.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getId()).isNotNull();
    }
}
```

### Frontend Unit Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { OrderList } from './OrderList';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

describe('OrderList', () => {
  const queryClient = new QueryClient();

  it('displays loading state while fetching orders', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrderList customerId="CUST-001" />
      </QueryClientProvider>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });
});
```

### E2E Critical Journeys

| Journey | Priority | Frequency |
|---------|----------|-----------|
| Create Order | P1 | Every deploy |
| Cancel Order | P1 | Every deploy |
| View Order Details | P1 | Every deploy |
| Search Orders | P2 | Daily |
| Generate Report | P2 | Daily |

## References

- [Testing Pyramid (Martin Fowler)](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Testcontainers](https://www.testcontainers.org/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [MSW Documentation](https://mswjs.io/docs/)
- Internal: Testing Standards (Confluence)
