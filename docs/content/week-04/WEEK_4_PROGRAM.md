# Week 4 Program — Contract-First Development

**Objective:** Lock API contracts before implementation to enable parallel FE/BE development.

**Gate:** Gate 4 — Contract-Locked  
**Approvers:** FE Lead, BE Lead, Architect

---

## Week 4 at a Glance

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         WEEK 4: CONTRACT-FIRST                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Day 0          Day 1          Day 2          Day 3          Day 4     │
│   ┌─────┐       ┌─────┐       ┌─────┐       ┌─────┐       ┌─────┐      │
│   │Lead │──────►│Domain│──────►│Open │──────►│Mock │──────►│Lock │      │
│   │Prep │       │Terms │       │ API │       │Setup│       │Gate │      │
│   └─────┘       └─────┘       └─────┘       └─────┘       └─────┘      │
│                    │             │             │             │          │
│                    ▼             ▼             ▼             ▼          │
│                Glossary     OpenAPI v1    Mock Server    Signed        │
│                 Draft        Draft        Working      Contract        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before Day 1:
- [x] Completed Week 3: Spec-First Packaging
- [x] Passed Gate 3: Architecture-Approved
- [x] System Spec available
- [x] Key ADRs documented (auth, error handling, API versioning)
- [x] Both FE and BE leads available

---

## Day 0: Lead Preparation

### Objectives
- [ ] Review Week 4 program and materials
- [ ] Confirm workshop schedule with team
- [ ] Prepare domain context for glossary workshop
- [ ] Set up OpenAPI tooling

### Lead Checklist

| Task | Owner | Status |
|------|-------|--------|
| Review WEEK_4_PROGRAM.md | Lead | ⏳ |
| Confirm room/calendar | Lead | ⏳ |
| Prepare domain entity list | BA/PO | ⏳ |
| Set up Swagger Editor / Stoplight | Tech Lead | ⏳ |
| Prepare mock server tooling | FE Lead | ⏳ |
| Distribute pre-read materials | Lead | ⏳ |

### Pre-Read Materials
1. [Domain Context](../../shared/reference-materials/DOMAIN_CONTEXT.md) — Entity relationships
2. [System Spec](../week-03/templates/SYSTEM_SPEC.md) — Business rules
3. [ADR-002: Error Handling](../week-03/adrs/002-error-handling.md) — RFC 7807
4. [ADR-003: API Versioning](../week-03/adrs/003-api-versioning.md) — URL paths

---

## Day 1: Domain Glossary Workshop

### Session 1: Domain Term Discovery (2 hours)

**Objective:** Create canonical definitions for all domain terms.

**Participants:** FE Lead, BE Lead, BA, PO

#### Agenda

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Context review | Shared understanding |
| 0:15 | Entity identification | Entity list |
| 0:45 | Field definition | Field specifications |
| 1:15 | Enum/allowed values | Value constraints |
| 1:45 | Review & gaps | Draft glossary |

#### Workshop Exercise

For each domain entity (Order, Customer, Item, OrderItem):

```markdown
## Order

### Definition
A request to purchase one or more items, placed by a customer.

### Fields

| Field | Type | Description | Constraints | Example |
|-------|------|-------------|-------------|---------|
| id | Long | Unique identifier | Auto-generated, immutable | 12345 |
| customerId | Long | Reference to customer | Required, valid customer | 67890 |
| status | OrderStatus | Current order state | Required | CREATED |
| totalAmount | BigDecimal | Calculated total | ≥ 0, 2 decimal places | 149.99 |
| createdAt | Instant | Creation timestamp | Auto-set, immutable | 2026-01-20T10:30:00Z |
| updatedAt | Instant | Last update timestamp | Auto-set | 2026-01-20T11:45:00Z |

### Enums

| Enum | Values | Description |
|------|--------|-------------|
| OrderStatus | CREATED, PROCESSING, SHIPPED, DELIVERED, CANCELLED | Order lifecycle states |

### Business Rules
- BR-ORD-001: Order must contain at least 1 item
- BR-ORD-002: Order may contain at most 50 items
- BR-ORD-005: Orders can only be cancelled in CREATED status
```

#### Copilot Assistance

```markdown
No secrets, no production data. Use placeholders.

Based on the domain context in docs/shared/reference-materials/DOMAIN_CONTEXT.md and 
the business rules in docs/content/week-03/templates/SYSTEM_SPEC.md:

Generate a domain glossary for the <Entity> entity including:
1. Definition (one sentence)
2. Fields table (field, type, description, constraints, example)
3. Enums (if applicable)
4. Related business rules

Use the format from docs/content/week-04/templates/DOMAIN_GLOSSARY.md
```

---

### Session 2: Cross-Team Alignment (1 hour)

**Objective:** Ensure FE and BE use identical terms.

#### Discussion Points

1. **Field naming conventions**
   - camelCase for JSON (JavaScript friendly)
   - snake_case for database (SQL friendly)
   - Mapping strategy between layers

2. **Date/time handling**
   - ISO 8601 format: `2026-01-20T10:30:00Z`
   - Always UTC in API
   - Frontend handles local display

3. **Money handling**
   - BigDecimal on backend
   - String with 2 decimals in API: `"149.99"`
   - Frontend formatting per locale

4. **ID handling**
   - Long/number for entity IDs
   - String for external reference IDs
   - UUID for correlation IDs

#### Output
- Draft [DOMAIN_GLOSSARY.md](./templates/DOMAIN_GLOSSARY.md)

---

## Day 2: OpenAPI Contract Design

### Session 1: Schema Definition (2 hours)

**Objective:** Define request/response schemas in OpenAPI.

**Participants:** FE Lead, BE Lead, Tech Leads

#### Agenda

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Review glossary | Confirmed terms |
| 0:15 | Define base schemas | Entity schemas |
| 0:45 | Define DTOs | Request/response schemas |
| 1:15 | Define error schema | Problem Details |
| 1:45 | Review & iterate | Schema draft |

#### Schema Patterns

**Entity Schema (full representation):**
```yaml
components:
  schemas:
    Order:
      type: object
      required:
        - id
        - customerId
        - status
        - items
        - totalAmount
        - createdAt
      properties:
        id:
          type: integer
          format: int64
          description: Unique order identifier
          example: 12345
        customerId:
          type: integer
          format: int64
          description: Customer who placed the order
          example: 67890
        status:
          $ref: '#/components/schemas/OrderStatus'
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
          minItems: 1
          maxItems: 50
        totalAmount:
          type: string
          pattern: '^\d+\.\d{2}$'
          description: Total order amount with 2 decimal places
          example: "149.99"
        createdAt:
          type: string
          format: date-time
          description: Order creation timestamp (UTC)
          example: "2026-01-20T10:30:00Z"
```

**Request Schema (what client sends):**
```yaml
    CreateOrderRequest:
      type: object
      required:
        - customerId
        - items
      properties:
        customerId:
          type: integer
          format: int64
          description: Customer placing the order
          example: 67890
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItemRequest'
          minItems: 1
          maxItems: 50
```

**Error Schema (RFC 7807):**
```yaml
    ProblemDetail:
      type: object
      required:
        - type
        - title
        - status
        - detail
        - instance
      properties:
        type:
          type: string
          format: uri
          description: URI identifying the problem type
          example: "/problems/validation-error"
        title:
          type: string
          description: Short human-readable summary
          example: "Validation Error"
        status:
          type: integer
          description: HTTP status code
          example: 400
        detail:
          type: string
          description: Human-readable explanation
          example: "The request contains invalid data"
        instance:
          type: string
          format: uri
          description: URI of the specific occurrence
          example: "/api/v1/orders"
        timestamp:
          type: string
          format: date-time
          example: "2026-01-20T10:30:00Z"
        traceId:
          type: string
          description: Correlation ID for debugging
          example: "abc123def456"
        errors:
          type: array
          items:
            $ref: '#/components/schemas/FieldError'
```

---

### Session 2: Endpoint Definition (2 hours)

**Objective:** Define all API endpoints with full specifications.

#### Agenda

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | List required endpoints | Endpoint inventory |
| 0:30 | Define CRUD operations | Core endpoints |
| 1:00 | Define query/search | List endpoints |
| 1:30 | Define error responses | Error mapping |

#### Endpoint Pattern

```yaml
paths:
  /api/v1/orders:
    get:
      summary: List orders
      description: Returns a paginated list of orders for the authenticated user
      operationId: listOrders
      tags:
        - Orders
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          description: Page number (0-indexed)
          schema:
            type: integer
            default: 0
            minimum: 0
        - name: size
          in: query
          description: Page size
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
        - name: status
          in: query
          description: Filter by order status
          schema:
            $ref: '#/components/schemas/OrderStatus'
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderPage'
        '401':
          description: Authentication required
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetail'
        '500':
          description: Internal server error
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetail'
    
    post:
      summary: Create order
      description: Creates a new order for the authenticated user
      operationId: createOrder
      tags:
        - Orders
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequest'
      responses:
        '201':
          description: Order created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
          headers:
            Location:
              description: URI of created order
              schema:
                type: string
                example: "/api/v1/orders/12345"
        '400':
          description: Validation error
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetail'
        '401':
          description: Authentication required
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetail'
```

#### P17 — OpenAPI Generation Prompt

```markdown
No secrets, no production data. Use placeholders.

Based on:
- Domain glossary: docs/content/week-04/templates/DOMAIN_GLOSSARY.md
- System spec: docs/content/week-03/templates/SYSTEM_SPEC.md
- Error handling ADR: docs/content/week-03/adrs/002-error-handling.md
- API versioning ADR: docs/content/week-03/adrs/003-api-versioning.md

Generate OpenAPI 3.1 specification for the <Feature> endpoints:

Include:
1. Schemas with examples and validation constraints
2. Endpoints with full request/response specifications
3. Error responses using RFC 7807 Problem Details
4. Pagination using offset pattern (page, size, totalElements)
5. Authentication using Bearer token
6. Operation IDs matching Spring method naming

Output format: YAML suitable for docs/content/week-04/contracts/openapi.yaml
```

#### Output
- Draft OpenAPI contract in `contracts/openapi.yaml`

---

## Day 3: Mock Server and Test Strategy

### Session 1: Mock Server Setup (2 hours)

**Objective:** Enable FE development without waiting for BE.

**Participants:** FE Lead, FE Developers

#### Mock Server Options

| Tool | Pros | Cons | Best For |
|------|------|------|----------|
| **Prism** | Auto-generates from OpenAPI | No custom logic | Quick start |
| **MSW** | In-browser, flexible | More setup | React apps |
| **json-server** | Simple, quick | Manual data | Prototypes |
| **WireMock** | Java-friendly, powerful | Complex | Enterprise |

#### Recommended: MSW (Mock Service Worker)

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import type { Order, CreateOrderRequest } from '~/types';

// Sample data from OpenAPI examples
const orders: Order[] = [
  {
    id: 12345,
    customerId: 67890,
    status: 'CREATED',
    items: [
      { id: 1, itemId: 101, quantity: 2, unitPrice: '29.99', lineTotal: '59.98' }
    ],
    totalAmount: '59.98',
    createdAt: '2026-01-20T10:30:00Z',
    updatedAt: '2026-01-20T10:30:00Z'
  }
];

export const handlers = [
  // GET /api/v1/orders
  http.get('/api/v1/orders', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '0');
    const size = parseInt(url.searchParams.get('size') ?? '20');
    const status = url.searchParams.get('status');
    
    let filtered = orders;
    if (status) {
      filtered = orders.filter(o => o.status === status);
    }
    
    return HttpResponse.json({
      content: filtered.slice(page * size, (page + 1) * size),
      page: { number: page, size, totalElements: filtered.length, totalPages: Math.ceil(filtered.length / size) }
    });
  }),
  
  // POST /api/v1/orders
  http.post('/api/v1/orders', async ({ request }) => {
    const body = await request.json() as CreateOrderRequest;
    
    // Validation
    if (!body.items || body.items.length === 0) {
      return HttpResponse.json({
        type: '/problems/validation-error',
        title: 'Validation Error',
        status: 400,
        detail: 'Order must contain at least one item',
        instance: '/api/v1/orders',
        errors: [{ field: 'items', code: 'SIZE_MIN', message: 'Order must contain at least one item' }]
      }, { status: 400 });
    }
    
    const newOrder: Order = {
      id: Math.floor(Math.random() * 100000),
      customerId: body.customerId,
      status: 'CREATED',
      items: body.items.map((item, idx) => ({
        id: idx + 1,
        itemId: item.itemId,
        quantity: item.quantity,
        unitPrice: '29.99',
        lineTotal: (29.99 * item.quantity).toFixed(2)
      })),
      totalAmount: body.items.reduce((sum, item) => sum + (29.99 * item.quantity), 0).toFixed(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    return HttpResponse.json(newOrder, { 
      status: 201,
      headers: { 'Location': `/api/v1/orders/${newOrder.id}` }
    });
  }),
  
  // Error scenarios
  http.get('/api/v1/orders/:id', ({ params }) => {
    const order = orders.find(o => o.id === parseInt(params.id as string));
    if (!order) {
      return HttpResponse.json({
        type: '/problems/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Order with ID ${params.id} not found`,
        instance: `/api/v1/orders/${params.id}`
      }, { status: 404 });
    }
    return HttpResponse.json(order);
  })
];
```

#### Mock Setup in Vite

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// src/entry.client.tsx
async function prepareApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

prepareApp().then(() => {
  // ... render app
});
```

---

### Session 2: Test Strategy Alignment (2 hours)

**Objective:** Agree on test responsibilities across layers.

**Participants:** FE Lead, BE Lead, QA Lead

#### Test Pyramid

```
                        ┌─────────┐
                        │   E2E   │  ← 10% - Critical paths only
                        ├─────────┤
                  ┌─────┴─────────┴─────┐
                  │     Contract        │  ← 20% - API compliance
                  ├─────────────────────┤
            ┌─────┴─────────────────────┴─────┐
            │          Integration            │  ← 30% - Component interaction
            ├─────────────────────────────────┤
      ┌─────┴─────────────────────────────────┴─────┐
      │                  Unit                        │  ← 40% - Isolated logic
      └─────────────────────────────────────────────┘
```

#### Test Layer Responsibilities

| Layer | FE Responsibility | BE Responsibility | Shared |
|-------|-------------------|-------------------|--------|
| **Unit** | Component logic, hooks, utils | Service logic, validators | Both own |
| **Integration** | Route loader/action behavior | Controller→Service→Repo | Both own |
| **Contract** | Request format compliance | Response format compliance | Contract tests |
| **E2E** | Critical user journeys | API journey validation | Playwright |

#### Contract Testing Strategy

**Option 1: OpenAPI Validation (Recommended)**

```typescript
// backend: OpenAPI response validation
@Test
void getOrder_matchesOpenApiSchema() {
    String response = mockMvc.perform(get("/api/v1/orders/1"))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();
    
    OpenApiValidator.validate("docs/content/week-04/contracts/openapi.yaml")
        .forPath("/api/v1/orders/{id}")
        .forMethod("GET")
        .withResponse(200, response);
}
```

**Option 2: Consumer-Driven Contracts (Pact)**

```typescript
// frontend: Define expected response
const orderPact = new PactV3({
  consumer: 'OrderUI',
  provider: 'OrderAPI'
});

describe('Order API Contract', () => {
  it('returns order by ID', async () => {
    await orderPact
      .given('order 12345 exists')
      .uponReceiving('a request for order 12345')
      .withRequest({ method: 'GET', path: '/api/v1/orders/12345' })
      .willRespondWith({
        status: 200,
        body: like({
          id: 12345,
          customerId: integer(),
          status: regex(/^(CREATED|PROCESSING|SHIPPED|DELIVERED|CANCELLED)$/),
          totalAmount: regex(/^\d+\.\d{2}$/)
        })
      });
    
    await orderPact.executeTest(async (mockServer) => {
      const order = await fetchOrder(12345, mockServer.url);
      expect(order.id).toBe(12345);
    });
  });
});
```

#### Output
- [MOCK_STRATEGY.md](./templates/MOCK_STRATEGY.md)
- [TEST_STRATEGY.md](./templates/TEST_STRATEGY.md)

---

## Day 4: Contract Review and Sprint Packet

### Session 1: Cross-Team Contract Review (2 hours)

**Objective:** Final alignment on API contract before lock.

**Participants:** FE Lead, BE Lead, Architect, QA Lead

#### Review Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Completeness** | All endpoints from user journeys covered | ⬜ |
| **Consistency** | Naming follows glossary | ⬜ |
| **Error Handling** | Problem Details for all error responses | ⬜ |
| **Pagination** | Consistent pattern across list endpoints | ⬜ |
| **Authentication** | Security requirements specified | ⬜ |
| **Examples** | All schemas have examples | ⬜ |
| **Validation** | Constraints specified (min, max, pattern) | ⬜ |

#### Contract Validation

```bash
# Validate OpenAPI syntax
npx @stoplight/spectral-cli lint contracts/openapi.yaml

# Generate documentation
npx @redocly/cli preview-docs contracts/openapi.yaml
```

#### Identified Issues Log

| Issue | Severity | Resolution | Owner | Status |
|-------|----------|------------|-------|--------|
| | | | | |

---

### Session 2: Sprint 1 Packet Preparation (2 hours)

**Objective:** Prepare scope and acceptance criteria for Sprint 1.

**Participants:** PO, FE Lead, BE Lead, QA Lead

#### Sprint Packet Contents

1. **Goal Statement**
   - What we're proving in this sprint
   - Definition of "done" for the sprint

2. **In-Scope Items**
   - Specific endpoints from OpenAPI
   - Specific journeys from System Spec
   - Files/paths affected

3. **Out-of-Scope Items**
   - Explicit exclusions
   - "Not this sprint" items

4. **Acceptance Criteria**
   - Imported from Week 2 deliverables
   - Mapped to specific stories

5. **Technical Requirements**
   - Logging/audit requirements
   - Security requirements
   - Performance expectations

#### Sprint Packet Template

See [SPRINT_PACKET_TEMPLATE.md](./templates/SPRINT_PACKET_TEMPLATE.md)

---

## Day 5: Contract Lock and Gate 4 Review

### Session 1: Contract Lock Ceremony (1 hour)

**Objective:** Formally lock the API contract for Sprint 1.

**Participants:** FE Lead, BE Lead, Architect

#### Lock Process

1. **Final validation**
   ```bash
   npx @stoplight/spectral-cli lint contracts/openapi.yaml
   ```

2. **Version tagging**
   - Tag contract as `v1.0.0-locked`
   - Any changes require formal change request

3. **Distribution**
   - Commit locked contract to repository
   - Generate client SDKs if applicable
   - Update mock server with locked contract

4. **Sign-off**
   - FE Lead confirms mock server works
   - BE Lead confirms implementation clarity
   - Architect confirms compliance with ADRs

#### Contract Change Process (Post-Lock)

| Change Type | Process | Approvers |
|-------------|---------|-----------|
| **Breaking** | ADR + Change request + Both leads | Architect |
| **Additive** | Contract Council review | Both leads |
| **Documentation** | PR review | Single lead |

---

### Session 2: Gate 4 Review (2 hours)

**Objective:** Verify all Gate 4 criteria are met.

**Participants:** All leads, PO, Architect

#### Gate 4 Criteria

| Criterion | Evidence | Status |
|-----------|----------|--------|
| OpenAPI contract complete and validated | Spectral lint passing | ⬜ |
| Domain glossary reviewed by both teams | Signed glossary | ⬜ |
| Mock server operational | FE can develop | ⬜ |
| Contract test approach documented | TEST_STRATEGY.md complete | ⬜ |
| Test strategy aligned | Unit/integration/e2e split agreed | ⬜ |
| Sprint 1 packet prepared | Packet in sprint-01/ folder | ⬜ |

#### Gate 4 Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| FE Lead | | | |
| BE Lead | | | |
| Architect | | | |
| QA Lead | | | |
| Product Owner | | | |

---

## Key Prompts for Week 4

### P17 — OpenAPI Generation

```markdown
No secrets, no production data. Use placeholders.

Based on:
- Domain glossary: docs/content/week-04/templates/DOMAIN_GLOSSARY.md
- System spec: docs/content/week-03/templates/SYSTEM_SPEC.md
- Error handling ADR: docs/content/week-03/adrs/002-error-handling.md

Generate OpenAPI 3.1 specification for: <Feature/Entity>

Include:
1. Schemas with examples and validation constraints
2. Endpoints with full request/response specifications
3. Error responses using RFC 7807 Problem Details
4. Pagination using offset pattern
5. Authentication using Bearer token

Output: YAML format
```

### P21 — Contract Validation

```markdown
No secrets, no production data. Use placeholders.

Review this OpenAPI contract for completeness:

#file docs/content/week-04/contracts/openapi.yaml

Check for:
1. All user journeys have corresponding endpoints
2. All schemas have examples
3. All error responses use Problem Details
4. Pagination is consistent
5. Authentication is properly specified
6. Naming follows domain glossary

List any gaps or inconsistencies found.
```

### P22 — Mock Handler Generation

```markdown
No secrets, no production data. Use placeholders.

Based on this OpenAPI specification:

#file docs/content/week-04/contracts/openapi.yaml

Generate MSW mock handlers for: <Endpoint>

Include:
1. Success response with example data
2. Validation error response
3. Not found error response
4. Authentication error response

Use TypeScript with proper typing from ~/types
```

---

## Week 4 Deliverables Summary

| Deliverable | Location | Owner |
|-------------|----------|-------|
| Domain Glossary v1 | `templates/DOMAIN_GLOSSARY.md` | BA/Tech Leads |
| OpenAPI Contract v1.0 | `contracts/openapi.yaml` | Tech Leads |
| Mock Strategy | `templates/MOCK_STRATEGY.md` | FE Lead |
| Test Strategy | `templates/TEST_STRATEGY.md` | QA Lead |
| Sprint 1 Packet | `../sprint-01/sprint-packet/` | PO/Leads |

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad | What to Do Instead |
|--------------|--------------|---------------------|
| Vague field definitions | Leads to FE/BE mismatch | Use glossary with examples |
| Missing error responses | Frontend can't handle errors | Specify all error codes |
| Undocumented pagination | Inconsistent implementations | Standardize pattern |
| No examples in schemas | Hard to understand intent | Add realistic examples |
| Verbal contract changes | Creates drift | Formal change process |

---

## Next: Sprint 1

After completing Gate 4, proceed to [Sprint 1: Thin Vertical Slice](../sprint-01/README.md)

Teams can now work in parallel:
- **FE:** Build against mock server
- **BE:** Implement to contract specification
