# Lab 4-2 — MSW Handler Creation with P22

## Goal

Practice using Copilot's P22 prompt to generate Mock Service Worker (MSW) handlers from OpenAPI specifications. Learn to mock both success and error scenarios for frontend development.

## Timebox

45 minutes

## Prerequisites

- Reviewed [Mock Strategy template](../templates/MOCK_STRATEGY.md)
- Reviewed [OpenAPI contract](../contracts/openapi.yaml)
- Familiar with MSW basics
- Attended Day 3 Mock Workshop

## Domain Context

You will create MSW handlers for the **Cancel Order** endpoint to enable frontend development without a backend.

---

## OpenAPI Specification

Use this specification as input:

```yaml
paths:
  /api/v1/orders/{orderId}/cancel:
    post:
      operationId: cancelOrder
      summary: Cancel an existing order
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - reason
              properties:
                reason:
                  type: string
                  maxLength: 500
      responses:
        '200':
          description: Order cancelled successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Invalid request
        '401':
          description: Unauthorized
        '403':
          description: Forbidden - not order owner
        '404':
          description: Order not found
        '409':
          description: Order cannot be cancelled
```

---

## Task

### Step 1: Use P22 Prompt (15 min)

Open Copilot Chat and use the P22 prompt:

```markdown
No secrets, no production data. Use placeholders.

Generate MSW 2.x handlers for the Cancel Order endpoint:

**OpenAPI Spec:**
[Paste the specification above]

**Requirements:**
1. Success handler (200) with realistic order data
2. Error handlers for: 400, 401, 403, 404, 409
3. Use RFC 7807 Problem Details for errors
4. TypeScript with proper types
5. Realistic delay simulation (100-300ms)
6. Test data fixtures

**Mock Scenarios Needed:**
- Happy path: Order ORD-001 cancellable
- Already shipped: Order ORD-002 has status "Shipped"
- Window expired: Order ORD-003 created 48 hours ago
- Not found: Order ORD-999 doesn't exist
- Not owner: Order ORD-004 belongs to different customer

Generate:
1. handlers.ts with all handlers
2. fixtures.ts with test data
3. scenarios.ts with scenario-switching logic
```

### Step 2: Review and Enhance (15 min)

Review the generated handlers for:

| Criterion | Question | ✓ |
|-----------|----------|---|
| **MSW 2.x Syntax** | Uses http.post() not rest.post()? | |
| **Type Safety** | TypeScript types for request/response? | |
| **Error Format** | RFC 7807 Problem Details? | |
| **Realistic Data** | Examples match domain model? | |
| **Delay Simulation** | Uses delay() for realism? | |
| **Scenario Coverage** | All 5 error scenarios? | |

**Enhance the handlers:**
1. Add missing error scenarios
2. Improve type definitions
3. Add scenario toggle mechanism
4. Add delay variance for realism

### Step 3: Test Your Handlers (15 min)

Create a simple test to verify handlers work:

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

const server = setupServer(...handlers);

describe('Cancel Order MSW Handlers', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('returns cancelled order for valid request', async () => {
    const response = await fetch('/api/v1/orders/ORD-001/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Changed my mind' }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('Cancelled');
    expect(data.cancellationReason).toBe('Changed my mind');
  });

  it('returns 409 for shipped order', async () => {
    const response = await fetch('/api/v1/orders/ORD-002/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Changed my mind' }),
    });

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.type).toContain('order-not-cancellable');
  });

  it('returns 404 for non-existent order', async () => {
    const response = await fetch('/api/v1/orders/ORD-999/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Changed my mind' }),
    });

    expect(response.status).toBe(404);
  });

  it('returns 400 for missing reason', async () => {
    const response = await fetch('/api/v1/orders/ORD-001/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
  });
});
```

---

## Submission

### Folder Structure

```
/working/contracts/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── handlers.ts
├── fixtures.ts
├── scenarios.ts
├── handlers.test.ts
└── COPILOT_ANALYSIS.md
```

### COPILOT_ANALYSIS.md Must Include

- P22 prompt used
- What Copilot generated correctly
- What you had to fix/enhance
- Any patterns you discovered

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ P22 Used | Prompt submitted with Copilot response |
| ✅ MSW 2.x Syntax | Uses http.* not rest.* |
| ✅ Success Handler | Returns valid cancelled order |
| ✅ Error Handlers | All 5 error codes covered |
| ✅ Problem Details | Errors use RFC 7807 format |
| ✅ Tests | At least 4 test cases pass |

---

## Expected Output

### handlers.ts

```typescript
import { http, HttpResponse, delay } from 'msw';
import { orders, getOrderById, updateOrder } from './fixtures';
import { currentScenario } from './scenarios';

// Types
interface CancelOrderRequest {
  reason: string;
}

interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  traceId?: string;
}

// Helper to generate trace ID
const generateTraceId = () => Math.random().toString(36).substring(2, 15);

// Helper for realistic delay
const getRealisticDelay = () => 100 + Math.random() * 200;

// Problem Detail factory
const createProblemDetail = (
  type: string,
  title: string,
  status: number,
  detail: string,
  instance?: string
): ProblemDetail => ({
  type: `https://api.example.com/errors/${type}`,
  title,
  status,
  detail,
  instance,
  traceId: generateTraceId(),
});

export const cancelOrderHandler = http.post(
  '/api/v1/orders/:orderId/cancel',
  async ({ params, request }) => {
    await delay(getRealisticDelay());

    const { orderId } = params;
    const body = await request.json() as CancelOrderRequest;

    // Validate request body
    if (!body.reason || body.reason.trim() === '') {
      return HttpResponse.json(
        createProblemDetail(
          'validation-error',
          'Validation Error',
          400,
          'Cancellation reason is required',
          `/api/v1/orders/${orderId}/cancel`
        ),
        { status: 400 }
      );
    }

    if (body.reason.length > 500) {
      return HttpResponse.json(
        createProblemDetail(
          'validation-error',
          'Validation Error',
          400,
          'Cancellation reason must be 500 characters or less',
          `/api/v1/orders/${orderId}/cancel`
        ),
        { status: 400 }
      );
    }

    // Check if order exists
    const order = getOrderById(orderId as string);
    if (!order) {
      return HttpResponse.json(
        createProblemDetail(
          'not-found',
          'Not Found',
          404,
          `Order ${orderId} not found`,
          `/api/v1/orders/${orderId}/cancel`
        ),
        { status: 404 }
      );
    }

    // Check if order is owned by current user (simulate auth check)
    if (orderId === 'ORD-004') {
      return HttpResponse.json(
        createProblemDetail(
          'forbidden',
          'Forbidden',
          403,
          'You do not have permission to cancel this order',
          `/api/v1/orders/${orderId}/cancel`
        ),
        { status: 403 }
      );
    }

    // Check if order can be cancelled (status check)
    if (!['Pending', 'Confirmed'].includes(order.status)) {
      return HttpResponse.json(
        createProblemDetail(
          'order-not-cancellable',
          'Order Not Cancellable',
          409,
          `Order ${orderId} has status '${order.status}' and cannot be cancelled`,
          `/api/v1/orders/${orderId}/cancel`
        ),
        { status: 409 }
      );
    }

    // Check cancellation window (24 hours)
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (orderAge > twentyFourHours) {
      return HttpResponse.json(
        createProblemDetail(
          'cancellation-window-expired',
          'Cancellation Window Expired',
          409,
          'Orders can only be cancelled within 24 hours of creation',
          `/api/v1/orders/${orderId}/cancel`
        ),
        { status: 409 }
      );
    }

    // Success: Cancel the order
    const cancelledOrder = updateOrder(orderId as string, {
      status: 'Cancelled',
      cancellationReason: body.reason,
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return HttpResponse.json(cancelledOrder);
  }
);

export const handlers = [cancelOrderHandler];
```

### fixtures.ts

```typescript
export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

export interface OrderItem {
  itemId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Mock orders for different scenarios
export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'CUST-001',
    items: [
      { itemId: 'ITEM-001', quantity: 2, unitPrice: 29.99, subtotal: 59.98 },
    ],
    status: 'Pending',
    total: 59.98,
    createdAt: new Date().toISOString(), // Recent - within window
    updatedAt: new Date().toISOString(),
    cancelledAt: null,
    cancellationReason: null,
  },
  {
    id: 'ORD-002',
    customerId: 'CUST-001',
    items: [
      { itemId: 'ITEM-002', quantity: 1, unitPrice: 49.99, subtotal: 49.99 },
    ],
    status: 'Shipped', // Cannot cancel - already shipped
    total: 49.99,
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-19T14:00:00Z',
    cancelledAt: null,
    cancellationReason: null,
  },
  {
    id: 'ORD-003',
    customerId: 'CUST-001',
    items: [
      { itemId: 'ITEM-001', quantity: 1, unitPrice: 29.99, subtotal: 29.99 },
    ],
    status: 'Pending',
    total: 29.99,
    createdAt: '2026-01-17T10:00:00Z', // 48+ hours ago - window expired
    updatedAt: '2026-01-17T10:00:00Z',
    cancelledAt: null,
    cancellationReason: null,
  },
  {
    id: 'ORD-004',
    customerId: 'CUST-002', // Different customer - forbidden
    items: [
      { itemId: 'ITEM-003', quantity: 3, unitPrice: 9.99, subtotal: 29.97 },
    ],
    status: 'Pending',
    total: 29.97,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancelledAt: null,
    cancellationReason: null,
  },
];

export const getOrderById = (id: string): Order | undefined => {
  return orders.find((order) => order.id === id);
};

export const updateOrder = (id: string, updates: Partial<Order>): Order => {
  const index = orders.findIndex((order) => order.id === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates };
    return orders[index];
  }
  throw new Error(`Order ${id} not found`);
};
```

### scenarios.ts

```typescript
export type MockScenario =
  | 'success'
  | 'unauthorized'
  | 'serverError'
  | 'slowNetwork'
  | 'offline';

let currentScenario: MockScenario = 'success';

export const setMockScenario = (scenario: MockScenario): void => {
  currentScenario = scenario;
  console.log(`[MSW] Scenario set to: ${scenario}`);
};

export const getMockScenario = (): MockScenario => {
  return currentScenario;
};

export const resetMockScenario = (): void => {
  currentScenario = 'success';
  console.log('[MSW] Scenario reset to: success');
};

// For UI toggle during development
export const availableScenarios: MockScenario[] = [
  'success',
  'unauthorized',
  'serverError',
  'slowNetwork',
  'offline',
];

export { currentScenario };
```

---

## Reflection Questions

1. How do MSW handlers enable FE development before BE is ready?
2. What's the tradeoff between realistic mocks and simple mocks?
3. How would you keep mocks in sync with OpenAPI changes?
4. What scenarios are most important to test early?

---

## Tips

- Always use MSW 2.x syntax (`http.*` not `rest.*`)
- Include realistic delays to catch race conditions
- Test error scenarios as thoroughly as success cases
- Use fixtures to avoid duplicating test data
