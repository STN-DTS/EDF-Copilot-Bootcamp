# Sprint 2 FAQ

> Common questions for Sprint 2: Expand + Basic NFRs (Weeks 7-8)

---

## Feature Expansion Questions

### How do I know which features to build next?

**Feature Selection Criteria:**

| Priority | Criteria | Example |
|----------|----------|---------|
| 1st | Extends thin slice | Add Create Order to existing Orders |
| 2nd | Reuses patterns | Cancel uses same modal pattern |
| 3rd | High value | Filter/Search improves usability |
| 4th | Independent | Doesn't block other work |

**Sprint 2 Typical Scope:**
- Create Order (primary expansion)
- Cancel Order (state management)
- Filter/Search Orders (query patterns)
- Consistent state handling (empty, loading, error)

---

### How do I reuse patterns from Sprint 1?

**Pattern Reuse Strategy:**

1. **Copy structure** — Use Sprint 1 code as template
2. **Extract abstractions** — Create shared utilities
3. **Document decisions** — Why this pattern works
4. **Refactor carefully** — Don't break working code

**Example: Adding Create Order**
```typescript
// Sprint 1: OrderList route
// Sprint 2: Copy pattern for CreateOrder route

// routes/orders.new.tsx (follows same pattern)
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const response = await fetch('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    return json({ error: 'Failed to create order' }, { status: response.status });
  }
  
  return redirect('/orders');
}
```

---

### What if Sprint 1 patterns don't scale?

**Assessment Questions:**
1. Does the pattern work for 2-3 more features?
2. Is the code getting hard to maintain?
3. Are we duplicating too much?

**Options:**

| Situation | Action |
|-----------|--------|
| Works for now | Keep pattern, note for later |
| Minor pain | Extract shared utilities |
| Major pain | Discuss refactor with Tech Lead |
| Blocking | Time-box refactor (max 1 day) |

**Sprint 2 Principle:** Favor working code over perfect patterns. Refactors come in Sprint 4.

---

## Non-Functional Requirements (NFR) Questions

### What NFRs should I focus on in Sprint 2?

**Sprint 2 NFR Priorities:**

| Category | Target | Verification |
|----------|--------|--------------|
| **Performance** | API <500ms (p95) | Load testing |
| **Accessibility** | WCAG 2.1 AA basics | axe-core scan |
| **Audit/Telemetry** | Structured logging | Log review |
| **Resilience** | Graceful error states | Manual testing |
| **Security** | Basic input validation | Code review |

**What's NOT Sprint 2:**
- Production security hardening (Sprint 3)
- Performance optimization (Sprint 4)
- Full accessibility remediation (Sprint 4)

---

### How do I measure API performance?

**Backend Performance Testing:**

```bash
# Using k6 (recommended)
k6 run tests/load/orders-list.js

# Simple baseline with curl
time curl -s http://localhost:8080/api/v1/orders > /dev/null
```

**k6 Script Example:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:8080/api/v1/orders');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

**Interpreting Results:**

| Metric | Target | Action if Failed |
|--------|--------|------------------|
| p95 latency | <500ms | Investigate slow queries |
| p99 latency | <1000ms | Check for outliers |
| Error rate | <1% | Fix reliability issues |
| Throughput | >100 req/s | Scale or optimize |

---

### How do I add structured logging?

**Backend (Spring Boot):**
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.logstash.logback.argument.StructuredArguments;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    public Order createOrder(CreateOrderRequest request) {
        log.info("Creating order", 
            StructuredArguments.kv("customerId", request.getCustomerId()),
            StructuredArguments.kv("itemCount", request.getItems().size()));
        
        Order order = orderRepository.save(toEntity(request));
        
        log.info("Order created", 
            StructuredArguments.kv("orderId", order.getId()),
            StructuredArguments.kv("status", order.getStatus()));
        
        return order;
    }
}
```

**What to Log:**

| Event | Required Fields | Example |
|-------|-----------------|---------|
| Request received | requestId, path, method | Entering GET /orders |
| Business event | entity, action, id | Order ORD-123 created |
| Error | error type, message, context | Validation failed: missing customerId |
| Response sent | requestId, status, duration | Completed 200 in 45ms |

---

### How do I implement basic accessibility?

**Sprint 2 Accessibility Checklist:**

- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Color is not the only indicator
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Error messages are associated with fields

**Quick axe-core Check:**
```bash
# Install
npm install -g @axe-core/cli

# Run on page
axe http://localhost:3000/orders --dir ./accessibility-results
```

**Common Fixes:**

| Issue | Fix |
|-------|-----|
| Missing label | Add `<label htmlFor="...">` |
| Low contrast | Increase text/background contrast |
| Missing alt | Add `alt` to all `<img>` |
| Missing focus | Add `:focus-visible` styles |

---

## Code Review Questions

### What should I look for in code reviews?

**Sprint 2 Review Checklist:**

| Category | Check | Why |
|----------|-------|-----|
| **Contract** | Does it match OpenAPI? | Interoperability |
| **Patterns** | Does it follow Sprint 1 patterns? | Consistency |
| **Tests** | Are new features tested? | Quality |
| **Errors** | Are errors handled gracefully? | Resilience |
| **Security** | Is input validated? | Safety |
| **Performance** | Any obvious N+1 queries? | Speed |

**Review Comments Template:**
```
[Category] Observation

Example:
[Pattern] This deviates from how we handle errors in OrderController.
Consider using the ErrorResponse pattern from line 45.
```

---

### How do I handle review feedback?

**Feedback Triage:**

| Type | Response | Timing |
|------|----------|--------|
| **Bug** | Fix immediately | Same day |
| **Pattern deviation** | Discuss, then fix | Same day |
| **Suggestion** | Consider, decide | Next iteration |
| **Nitpick** | Optional fix | If time permits |

**Disagreement Protocol:**
1. Clarify the concern
2. Explain your reasoning
3. If still disagree, ask for third opinion
4. If critical path, escalate to Tech Lead
5. Once decided, implement without grudge

---

## Integration Testing Questions

### When should I write integration tests?

**Integration Test Triggers:**

| Scenario | Write Integration Test? |
|----------|------------------------|
| API endpoint | ✅ Yes |
| Service with external call | ✅ Yes |
| Repository query | ✅ Yes (with Testcontainers) |
| UI form submission | ✅ Yes (end-to-end) |
| Pure utility function | ❌ No (unit test) |
| Private helper method | ❌ No (tested via caller) |

**Sprint 2 Integration Test Goals:**
- All new endpoints have integration tests
- Happy path and primary error cases
- Authentication is verified
- Database state is validated

---

### How do I test with Testcontainers?

**Setup Pattern:**
```java
@SpringBootTest
@Testcontainers
class OrderServiceIntegrationTest {

    @Container
    static OracleContainer oracle = new OracleContainer("gvenzl/oracle-xe:21-slim-faststart")
        .withDatabaseName("testdb")
        .withUsername("testuser")
        .withPassword("testpass");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", oracle::getJdbcUrl);
        registry.add("spring.datasource.username", oracle::getUsername);
        registry.add("spring.datasource.password", oracle::getPassword);
    }

    @Test
    void shouldCreateOrder() {
        // Test with real database
    }
}
```

**Best Practices:**
- Use singleton containers (share across tests)
- Initialize test data in `@BeforeEach`
- Clean up in `@AfterEach` or use transactions
- Use `@Sql` annotation for complex setup

---

### How do I test React Router actions?

**Testing Pattern:**
```typescript
import { createRoutesStub } from 'react-router';
import { render, screen, fireEvent } from '@testing-library/react';
import { action as createOrderAction } from './orders.new';

describe('CreateOrder', () => {
  it('should submit form and redirect', async () => {
    const Stub = createRoutesStub([
      {
        path: '/orders/new',
        Component: CreateOrderRoute,
        action: createOrderAction,
      },
      {
        path: '/orders',
        Component: () => <div>Orders List</div>,
      },
    ]);

    render(<Stub initialEntries={['/orders/new']} />);

    fireEvent.change(screen.getByLabelText('Customer ID'), {
      target: { value: 'CUST-001' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Order' }));

    await waitFor(() => {
      expect(screen.getByText('Orders List')).toBeInTheDocument();
    });
  });
});
```

---

## Common Sprint 2 Issues

### "My new feature broke Sprint 1 functionality"

**Prevention:**
- Run full test suite before PR
- Use feature branches
- Review changes carefully
- Add regression tests

**Recovery:**
1. Identify breaking change
2. Revert if quick fix isn't obvious
3. Fix in separate branch
4. Add regression test
5. Re-merge with fix

---

### "Performance degraded after adding features"

**Investigation Steps:**
1. **Compare baselines** — Sprint 1 vs Sprint 2 metrics
2. **Profile queries** — Check for N+1 patterns
3. **Check bundle** — FE bundle size increase?
4. **Review changes** — What's different?

**Quick Wins:**

| Problem | Solution |
|---------|----------|
| N+1 queries | Add `@EntityGraph` or fetch joins |
| Large responses | Paginate, add projections |
| Bundle bloat | Code split, lazy load |
| Slow renders | Memoize, virtualize lists |

---

### "My accessibility audit found many issues"

**Triage Strategy:**

| Severity | Action | Timeline |
|----------|--------|----------|
| Critical (blocks users) | Fix now | Sprint 2 |
| Major (hard to use) | Plan fix | Sprint 2 |
| Minor (inconvenient) | Backlog | Sprint 4 |

**Quick Fixes (Do These First):**
- Missing alt text on images
- Missing form labels
- Missing button text
- Color-only indicators
- Missing heading structure

---

## Related Resources

| Resource | Location |
|----------|----------|
| Sprint 2 Program | [SPRINT_2_PROGRAM.md](SPRINT_2_PROGRAM.md) |
| Sprint Packet | [sprint-packet/SPRINT_PACKET.md](sprint-packet/SPRINT_PACKET.md) |
| NFR Checklist | [sprint-packet/NFR_CHECKLIST.md](sprint-packet/NFR_CHECKLIST.md) |
| Sprint 1 FAQ | [../sprint-01/FAQ.md](../sprint-01/FAQ.md) |
| Week 1 FAQ | [../week-01/FAQ.md](../week-01/FAQ.md) |
| Domain Context | [../../shared/reference-materials/DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md) |
| Testing Instructions | [../../../.github/instructions/testing.instructions.md](../../../.github/instructions/testing.instructions.md) |

---

## Need More Help?

- **Performance issues:** Ask your Tech Lead for profiling help
- **Accessibility questions:** Reference WCAG 2.1 guidelines
- **Integration problems:** Check with your FE/BE partner
- **Process questions:** Ask the Facilitator
