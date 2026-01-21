# Week 4 FAQ

> Common questions for Week 4: Contract-First API + Mock Strategy

---

## Contract Design

### How do I handle breaking changes to the API?

**Before Contract Lock (Week 4):**
- Freely modify the contract
- Communicate changes in daily standups
- Update mocks immediately

**After Contract Lock (Sprints):**
1. **Avoid if possible:** Can you make it additive instead?
2. **Propose formally:** Create a contract change request
3. **Assess impact:** What FE/BE work is affected?
4. **Get approval:** Both Tech Leads must agree
5. **Version if major:** Consider /v2/ for breaking changes

**Non-Breaking Changes (OK after lock):**
- Adding new optional fields
- Adding new endpoints
- Adding new enum values (if client ignores unknown)
- Improving descriptions

**Breaking Changes (Require approval):**
- Removing fields
- Changing field types
- Renaming fields
- Changing required/optional
- Removing endpoints

---

### What if FE and BE disagree on field names?

**Resolution Process:**

1. **Check the glossary:** Is there an existing convention?
2. **Apply naming rules:** 
   - API: camelCase
   - DB: snake_case
3. **Consider consumers:** FE typically uses the field more
4. **Document the decision:** Add to glossary

**Common Conflicts:**

| BE Preference | FE Preference | Resolution |
|---------------|---------------|------------|
| order_id | orderId | Use orderId in API, map in BE |
| created_timestamp | createdAt | Use createdAt (shorter) |
| is_active | active | Use active (no is_ prefix) |

**Rule of Thumb:** API field names should be FE-friendly since FE code uses them directly.

---

### Should I use query params or request body for filters?

**Use Query Parameters When:**
- Filtering a GET request
- Values are simple strings/numbers
- URL should be shareable/bookmarkable
- Caching is important

```
GET /api/v1/orders?status=Pending&customerId=CUST-123
```

**Use Request Body When:**
- Complex filter objects
- Large number of values (IN queries)
- POST for "search" operations
- Sensitive data that shouldn't be in URL

```
POST /api/v1/orders/search
{
  "statuses": ["Pending", "Confirmed"],
  "dateRange": { "from": "2026-01-01", "to": "2026-01-31" }
}
```

**Pagination:** Always query params: `?page=0&size=20&sort=createdAt,desc`

---

### How detailed should error responses be?

**Minimum (Required):**
```json
{
  "type": "https://api.example.com/errors/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "Order ORD-12345 not found"
}
```

**Better (With context):**
```json
{
  "type": "https://api.example.com/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "Request validation failed",
  "instance": "/api/v1/orders",
  "traceId": "abc123",
  "violations": [
    { "field": "items", "message": "must not be empty" },
    { "field": "customerId", "message": "customer not found" }
  ]
}
```

**Rules:**
- Never expose stack traces in production
- Include traceId for debugging
- Field-level errors for 400 validation failures
- Generic messages for 500 (log details server-side)

---

### What's the difference between 400, 404, and 409?

| Code | When to Use | Example |
|------|-------------|---------|
| **400 Bad Request** | Request is malformed or invalid | Missing required field, invalid format |
| **404 Not Found** | Resource doesn't exist | Order ID not in database |
| **409 Conflict** | Valid request but can't complete due to state | Cancel already-shipped order |

**Decision Tree:**
1. Is the request syntactically valid? No → 400
2. Does the resource exist? No → 404
3. Is the operation valid for current state? No → 409
4. Otherwise → process the request

---

## Mock Strategy

### How do I simulate slow responses?

**MSW 2.x Delay:**
```typescript
import { http, HttpResponse, delay } from 'msw';

export const slowHandler = http.get('/api/orders', async () => {
  await delay(2000); // 2 second delay
  return HttpResponse.json({ orders: [] });
});
```

**Variable Delay (Realistic):**
```typescript
await delay(100 + Math.random() * 400); // 100-500ms
```

**Scenario-Based Delay:**
```typescript
const SCENARIOS = {
  fast: 50,
  normal: 200,
  slow: 2000,
  timeout: 30000,
};

await delay(SCENARIOS[currentScenario]);
```

---

### How do I test error handling with mocks?

**Scenario Switching:**
```typescript
// scenarios.ts
export type Scenario = 'success' | 'notFound' | 'serverError' | 'unauthorized';
export let currentScenario: Scenario = 'success';
export const setScenario = (s: Scenario) => { currentScenario = s; };

// handlers.ts
import { currentScenario } from './scenarios';

export const handler = http.get('/api/orders/:id', async ({ params }) => {
  if (currentScenario === 'notFound') {
    return HttpResponse.json(
      { type: 'not-found', title: 'Not Found', status: 404 },
      { status: 404 }
    );
  }
  // ... success case
});

// test
import { setScenario } from './scenarios';

it('shows error when order not found', async () => {
  setScenario('notFound');
  render(<OrderDetail orderId="ORD-999" />);
  expect(await screen.findByText(/not found/i)).toBeInTheDocument();
});
```

---

### Should mocks be in-browser or server-side?

| Type | Use When | Setup |
|------|----------|-------|
| **Browser (Service Worker)** | Development, E2E tests | `setupWorker` in browser |
| **Server (Node)** | Unit tests, CI | `setupServer` in Node |

**Development Setup:**
```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// main.tsx
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser');
  await worker.start();
}
```

**Test Setup:**
```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// vitest.setup.ts
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

### How do I keep mocks in sync with OpenAPI?

**Options (Least to Most Automated):**

1. **Manual:** Update handlers when contract changes (error-prone)

2. **Schema Validation:** Validate mock responses against OpenAPI at test time
   ```typescript
   import { validateResponse } from './openapi-validator';
   
   it('mock matches schema', async () => {
     const response = await fetch('/api/orders/ORD-001');
     const data = await response.json();
     expect(validateResponse('getOrder', 200, data)).toBe(true);
   });
   ```

3. **Generated Mocks:** Generate handlers from OpenAPI
   - Use [MSW Data](https://github.com/mswjs/data) for entity mocking
   - Custom code generator from OpenAPI

4. **Contract Testing:** Fail CI if mocks diverge from contract

---

### Why MSW 2.x instead of MSW 1.x?

**MSW 2.x Improvements:**
- Better TypeScript support
- Cleaner API (`http.*` instead of `rest.*`)
- Improved browser devtools integration
- Better ESM support

**Migration:**
```typescript
// MSW 1.x (OLD - don't use)
import { rest } from 'msw';
rest.get('/api/orders', (req, res, ctx) => {
  return res(ctx.json({ orders: [] }));
});

// MSW 2.x (NEW - use this)
import { http, HttpResponse } from 'msw';
http.get('/api/orders', () => {
  return HttpResponse.json({ orders: [] });
});
```

---

## Contract Testing

### What's the difference between contract tests and integration tests?

| Aspect | Contract Tests | Integration Tests |
|--------|---------------|-------------------|
| **Focus** | API shape (schema) | API behavior (logic) |
| **Speed** | Fast (no real calls) | Slower (real services) |
| **Scope** | Request/response format | End-to-end flow |
| **Failures** | Schema mismatch | Logic bugs |

**Contract Test Example:**
```java
@Test
void getOrder_responseMatchesSchema() {
    // Verify response structure matches OpenAPI
    given()
        .get("/api/orders/ORD-001")
    .then()
        .statusCode(200)
        .body(matchesJsonSchemaInClasspath("order-schema.json"));
}
```

**Integration Test Example:**
```java
@Test
void cancelOrder_updatesStatusAndSendsEmail() {
    // Verify business logic works
    given()
        .body("""{"reason": "Changed mind"}""")
        .post("/api/orders/ORD-001/cancel")
    .then()
        .statusCode(200);
    
    assertThat(orderRepository.findById("ORD-001").getStatus())
        .isEqualTo("Cancelled");
    assertThat(emailService.wasSent("cancellation-email")).isTrue();
}
```

---

### How do I handle auth in contract tests?

**Option 1: Test Token**
```java
@Test
void getOrders_requiresAuth() {
    given()
        .header("Authorization", "Bearer test-jwt-token")
        .get("/api/orders")
    .then()
        .statusCode(200);
}
```

**Option 2: Disable Auth in Tests**
```java
@TestConfiguration
public class TestSecurityConfig {
    @Bean
    public SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()).build();
    }
}
```

**Option 3: Mock Auth Service**
```java
@MockBean
private JwtDecoder jwtDecoder;

@BeforeEach
void setup() {
    when(jwtDecoder.decode(any()))
        .thenReturn(Jwt.withTokenValue("token")
            .header("alg", "none")
            .claim("sub", "test-user")
            .build());
}
```

---

## Copilot Usage

### How to use P17 for complex nested schemas?

**Break It Down:**

Instead of one massive prompt, use iterative refinement:

**Step 1: Core Endpoint**
```markdown
Generate OpenAPI for POST /api/orders with:
- customerId (required string)
- items array with itemId, quantity
```

**Step 2: Enhance Request**
```markdown
Add validation to this schema:
- customerId must be UUID format
- items: 1-100 items, quantity 1-99
- Add example
```

**Step 3: Add Response**
```markdown
Add response schemas:
- 201 with full Order object including computed total
- 400 with validation errors (Problem Details)
```

**Step 4: Add Error Cases**
```markdown
Add error responses:
- 401 Unauthorized
- 404 Customer not found
- 409 Item out of stock
```

---

### When does P21 validation catch real issues?

**Good At:**
- Missing required fields
- Inconsistent naming (orderId vs order_id)
- Missing error responses
- Empty schemas
- Missing examples

**Not Good At:**
- Business logic correctness
- Performance implications
- Security requirements
- Domain-specific rules

**Combine With:**
- Manual review for business logic
- OpenAPI linting tools (Spectral)
- Schema validation in CI

---

### How to customize P22 mock handlers?

**Start with P22, then enhance:**

```markdown
Generate MSW handler for GET /api/orders/{id}
```

**Then customize:**
1. Add scenario switching
2. Add realistic delay
3. Add data variations
4. Add error probabilities

```typescript
// P22 output
export const getOrderHandler = http.get('/api/orders/:id', () => {
  return HttpResponse.json(mockOrder);
});

// Your enhancement
export const getOrderHandler = http.get('/api/orders/:id', async ({ params }) => {
  await delay(100 + Math.random() * 200);
  
  const order = getOrderById(params.id as string);
  if (!order) {
    return HttpResponse.json(
      { type: 'not-found', status: 404 },
      { status: 404 }
    );
  }
  
  return HttpResponse.json(order);
});
```

---

## Workshops

### What happens in the Contract Lock ceremony?

**Purpose:** Mark the moment when the contract is finalized and parallel work begins.

**Agenda (30 min):**
1. **Recap** (5 min): Summarize contract contents
2. **Final Review** (10 min): Last chance for changes
3. **Sign-off** (5 min): Both Tech Leads approve
4. **Lock** (2 min): Tag/version the contract
5. **Celebrate** (8 min): Acknowledge milestone

**Post-Lock Rules:**
- Breaking changes require formal change request
- Additive changes can be made without ceremony
- Bug fixes can be done in place

---

### What if we can't agree on an API design?

**Escalation Path:**
1. **Time-box discussion:** 15 minutes max
2. **List pros/cons:** Document both positions
3. **Tech Lead decides:** If no consensus in 15 min
4. **Document rationale:** In ADR or contract comments
5. **Move on:** Don't let one endpoint block everything

**Common Stalemates:**
- Pagination style → Use offset for this project
- Field naming → Default to FE preference
- Error format → Always use Problem Details
- Versioning → Use path versioning (/v1/)

---

## Troubleshooting

### MSW handlers not intercepting requests

**Check:**
1. Worker started before app renders
2. URL matches exactly (including /api prefix)
3. HTTP method matches (GET vs POST)
4. No typos in path parameters

```typescript
// Debug mode
worker.start({
  onUnhandledRequest: 'warn', // or 'error'
});
```

---

### OpenAPI validation fails

**Common Causes:**
1. **YAML syntax error:** Use a YAML linter
2. **Invalid $ref:** Check path is correct
3. **Missing required field:** Check OpenAPI spec requirements
4. **Wrong type:** Ensure types are valid OpenAPI types

**Tools:**
- [Swagger Editor](https://editor.swagger.io/)
- [Spectral](https://stoplight.io/open-source/spectral)
- VS Code OpenAPI extension

---

### Contract tests pass but integration fails

**Likely Causes:**
1. **Mock data doesn't match real data:** Update mocks
2. **Schema is too loose:** Tighten validation
3. **Auth differs:** Check test auth configuration
4. **Database state:** Ensure clean state for tests
