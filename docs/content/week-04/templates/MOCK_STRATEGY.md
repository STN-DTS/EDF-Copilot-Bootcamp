# Mock Strategy Template

**Project:** [Project Name]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [FE Lead]

---

## Purpose

This document defines the mocking strategy for frontend development. Mocks enable the frontend team to develop and test against API contracts before the backend is complete.

**Goal:** FE can develop full features without waiting for BE.

---

## Mocking Approach

### Selected Tool: MSW (Mock Service Worker)

**Rationale:**
- Runs in browser (no external server needed)
- Intercepts at network level (realistic)
- TypeScript support
- Works with React Router v7 loaders/actions
- Easy to toggle on/off

**Alternatives Considered:**

| Tool | Pros | Cons | Decision |
|------|------|------|----------|
| MSW | Browser-native, flexible, typed | Setup required | ✅ Selected |
| Prism | Auto-generates from OpenAPI | No custom logic, external server | Use for validation |
| json-server | Quick setup | Manual data, limited flexibility | Too simple |
| WireMock | Powerful, Java-friendly | Complex, external server | For BE contract tests |

---

## Setup

### Installation

```bash
npm install msw --save-dev
npx msw init public/ --save
```

### File Structure

```
src/
├── mocks/
│   ├── browser.ts       # MSW browser worker setup
│   ├── handlers.ts      # Combined handlers
│   ├── handlers/
│   │   ├── orders.ts    # Order endpoint handlers
│   │   ├── customers.ts # Customer endpoint handlers
│   │   └── items.ts     # Item endpoint handlers
│   ├── data/
│   │   ├── orders.ts    # Mock order data
│   │   ├── customers.ts # Mock customer data
│   │   └── items.ts     # Mock item data
│   └── utils/
│       ├── pagination.ts # Pagination helper
│       └── errors.ts     # Error response helper
```

### Browser Setup

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

### Application Integration

```typescript
// src/entry.client.tsx
async function prepareApp() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't intercept unknown requests
      quiet: false, // Show mock activity in console
    });
    console.log('[MSW] Mock Service Worker started');
  }
}

prepareApp().then(() => {
  startTransition(() => {
    hydrateRoot(document, <StrictMode><App /></StrictMode>);
  });
});
```

### Environment Configuration

```bash
# .env.development
VITE_ENABLE_MOCKS=true

# .env.test
VITE_ENABLE_MOCKS=true

# .env.production
# (not set - mocks disabled in production)
```

---

## Handler Patterns

### Basic CRUD Handler

```typescript
// src/mocks/handlers/orders.ts
import { http, HttpResponse } from 'msw';
import type { Order, CreateOrderRequest, OrderPage } from '~/types';
import { orders } from '../data/orders';
import { paginate } from '../utils/pagination';
import { problemDetail, validationError } from '../utils/errors';

export const orderHandlers = [
  // GET /api/v1/orders - List orders
  http.get('/api/v1/orders', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '0');
    const size = parseInt(url.searchParams.get('size') ?? '20');
    const status = url.searchParams.get('status');
    
    let filtered = [...orders];
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    
    const result = paginate(filtered, page, size);
    return HttpResponse.json(result);
  }),
  
  // GET /api/v1/orders/:id - Get single order
  http.get('/api/v1/orders/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return problemDetail(404, 'not-found', 'Resource Not Found', 
        `Order with ID ${id} not found`, `/api/v1/orders/${id}`);
    }
    
    return HttpResponse.json(order);
  }),
  
  // POST /api/v1/orders - Create order
  http.post('/api/v1/orders', async ({ request }) => {
    const body = await request.json() as CreateOrderRequest;
    
    // Validation
    const errors = [];
    if (!body.customerId) {
      errors.push({ field: 'customerId', code: 'REQUIRED', message: 'Customer ID is required' });
    }
    if (!body.items || body.items.length === 0) {
      errors.push({ field: 'items', code: 'SIZE_MIN', message: 'Order must contain at least one item' });
    }
    if (body.items && body.items.length > 50) {
      errors.push({ field: 'items', code: 'SIZE_MAX', message: 'Order may contain at most 50 items' });
    }
    
    if (errors.length > 0) {
      return validationError(errors, '/api/v1/orders');
    }
    
    // Create order
    const newOrder: Order = {
      id: Math.floor(Math.random() * 100000),
      customerId: body.customerId,
      status: 'CREATED',
      items: body.items.map((item, idx) => ({
        id: idx + 1,
        itemId: item.itemId,
        quantity: item.quantity,
        unitPrice: '29.99', // Simulated price lookup
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
  
  // PUT /api/v1/orders/:id/cancel - Cancel order
  http.put('/api/v1/orders/:id/cancel', ({ params }) => {
    const id = parseInt(params.id as string);
    const orderIndex = orders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
      return problemDetail(404, 'not-found', 'Resource Not Found',
        `Order with ID ${id} not found`, `/api/v1/orders/${id}/cancel`);
    }
    
    const order = orders[orderIndex];
    if (order.status !== 'CREATED') {
      return problemDetail(409, 'conflict', 'Conflict',
        `Order cannot be cancelled - current status is ${order.status}`,
        `/api/v1/orders/${id}/cancel`);
    }
    
    orders[orderIndex] = {
      ...order,
      status: 'CANCELLED',
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json(orders[orderIndex]);
  })
];
```

### Utility Functions

```typescript
// src/mocks/utils/pagination.ts
export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Page<T> {
  content: T[];
  page: PageInfo;
}

export function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const totalElements = items.length;
  const totalPages = Math.ceil(totalElements / size);
  const start = page * size;
  const content = items.slice(start, start + size);
  
  return {
    content,
    page: {
      number: page,
      size,
      totalElements,
      totalPages
    }
  };
}
```

```typescript
// src/mocks/utils/errors.ts
import { HttpResponse } from 'msw';

interface FieldError {
  field: string;
  code: string;
  message: string;
}

export function problemDetail(
  status: number,
  type: string,
  title: string,
  detail: string,
  instance: string,
  errors?: FieldError[]
) {
  const body: Record<string, unknown> = {
    type: `/problems/${type}`,
    title,
    status,
    detail,
    instance,
    timestamp: new Date().toISOString(),
    traceId: crypto.randomUUID()
  };
  
  if (errors) {
    body.errors = errors;
  }
  
  return HttpResponse.json(body, {
    status,
    headers: { 'Content-Type': 'application/problem+json' }
  });
}

export function validationError(errors: FieldError[], instance: string) {
  return problemDetail(
    400,
    'validation-error',
    'Validation Error',
    'The request contains invalid data',
    instance,
    errors
  );
}

export function notFound(resource: string, id: string | number, instance: string) {
  return problemDetail(
    404,
    'not-found',
    'Resource Not Found',
    `${resource} with ID ${id} not found`,
    instance
  );
}

export function unauthorized(instance: string) {
  return problemDetail(
    401,
    'authentication-required',
    'Authentication Required',
    'Valid authentication credentials are required',
    instance
  );
}
```

---

## Mock Data Management

### Sample Data Files

```typescript
// src/mocks/data/orders.ts
import type { Order } from '~/types';

export const orders: Order[] = [
  {
    id: 12345,
    customerId: 67890,
    status: 'CREATED',
    items: [
      { id: 1, itemId: 101, quantity: 2, unitPrice: '29.99', lineTotal: '59.98' },
      { id: 2, itemId: 102, quantity: 1, unitPrice: '49.99', lineTotal: '49.99' }
    ],
    totalAmount: '109.97',
    createdAt: '2026-01-20T10:30:00Z',
    updatedAt: '2026-01-20T10:30:00Z'
  },
  {
    id: 12346,
    customerId: 67890,
    status: 'SHIPPED',
    items: [
      { id: 1, itemId: 103, quantity: 3, unitPrice: '19.99', lineTotal: '59.97' }
    ],
    totalAmount: '59.97',
    createdAt: '2026-01-18T14:00:00Z',
    updatedAt: '2026-01-19T09:00:00Z'
  }
];
```

### Data Sync with OpenAPI Examples

Mock data should match OpenAPI schema examples exactly. Use a script to validate:

```bash
# Validate mock data against OpenAPI schemas
npx ts-node scripts/validate-mock-data.ts
```

---

## Error Scenario Testing

### Simulating Errors

```typescript
// src/mocks/handlers/errors.ts
import { http, HttpResponse, delay } from 'msw';

export const errorHandlers = [
  // Simulate network error
  http.get('/api/v1/simulate/network-error', () => {
    return HttpResponse.error();
  }),
  
  // Simulate timeout
  http.get('/api/v1/simulate/timeout', async () => {
    await delay(30000); // 30 second delay
    return HttpResponse.json({ message: 'Too late' });
  }),
  
  // Simulate 500 error
  http.get('/api/v1/simulate/server-error', () => {
    return HttpResponse.json({
      type: '/problems/internal-error',
      title: 'Internal Error',
      status: 500,
      detail: 'An unexpected error occurred',
      instance: '/api/v1/simulate/server-error',
      timestamp: new Date().toISOString(),
      traceId: crypto.randomUUID()
    }, { status: 500 });
  })
];
```

### Per-Test Error Injection

```typescript
// In test file
import { http, HttpResponse } from 'msw';
import { server } from '~/mocks/server';

test('shows error message when order fetch fails', async () => {
  // Override handler for this test only
  server.use(
    http.get('/api/v1/orders/:id', () => {
      return HttpResponse.json({
        type: '/problems/internal-error',
        title: 'Internal Error',
        status: 500,
        detail: 'Database connection failed',
        instance: '/api/v1/orders/12345'
      }, { status: 500 });
    })
  );
  
  // ... test that error is displayed
});
```

---

## Test Integration

### Vitest Setup

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// vitest.setup.ts
import { server } from './src/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Toggling Mocks

### Runtime Toggle (Development)

```typescript
// In browser console
window.__MSW_ENABLED__ = false; // Disable mocks
window.__MSW_ENABLED__ = true;  // Enable mocks
```

### Feature Flag Approach

```typescript
// src/mocks/browser.ts
export async function enableMocking() {
  if (import.meta.env.PROD) {
    return; // Never enable in production
  }
  
  if (localStorage.getItem('msw:disabled') === 'true') {
    console.log('[MSW] Mocking disabled by user');
    return;
  }
  
  const { worker } = await import('./browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}
```

---

## Verification Checklist

Before Sprint 1:
- [ ] All endpoints from OpenAPI have mock handlers
- [ ] Error responses match Problem Details format
- [ ] Pagination works correctly
- [ ] Authentication scenarios covered (401)
- [ ] Mock data matches OpenAPI examples
- [ ] Mocks can be toggled on/off
- [ ] Tests use mock server

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| FE Lead | | | |
| BE Lead | | | |
| QA Lead | | | |

---

## Copilot Assistance

Generate mock handlers from OpenAPI:

```markdown
No secrets, no production data. Use placeholders.

Based on this OpenAPI specification:

#file docs/content/week-04/contracts/openapi.yaml

Generate MSW mock handlers for the Orders endpoints including:
1. List orders with pagination and filtering
2. Get single order (success and not found)
3. Create order (success and validation errors)
4. Cancel order (success, not found, conflict)

Use TypeScript with proper typing and follow patterns from:
docs/content/week-04/templates/MOCK_STRATEGY.md
```
