/**
 * MSW 2.x Handlers for Order Management API
 * 
 * Complete example handlers compatible with React Router v7
 * Demonstrates mocking success and error scenarios for FE development
 * 
 * @see https://mswjs.io/docs/
 */

import { http, HttpResponse, delay } from 'msw';

// ============================================
// TYPES
// ============================================

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  traceId?: string;
  violations?: Violation[];
}

export interface Violation {
  field: string;
  message: string;
}

export interface CreateOrderRequest {
  customerId: string;
  items: { itemId: string; quantity: number }[];
}

export interface CancelOrderRequest {
  reason: string;
}

export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface OrderPage {
  content: OrderSummary[];
  page: PageInfo;
}

export interface OrderSummary {
  id: string;
  customerId: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// FIXTURES
// ============================================

const items = [
  { id: 'ITEM-001', name: 'Widget Pro', price: 29.99, inStock: true, stockQuantity: 100 },
  { id: 'ITEM-002', name: 'Gadget Basic', price: 49.99, inStock: true, stockQuantity: 50 },
  { id: 'ITEM-003', name: 'Thingamajig', price: 9.99, inStock: false, stockQuantity: 0 },
  { id: 'ITEM-004', name: 'Doohickey', price: 15.00, inStock: true, stockQuantity: 25 },
];

const customers = [
  { id: 'CUST-001', name: 'John Doe', active: true },
  { id: 'CUST-002', name: 'Jane Smith', active: true },
  { id: 'CUST-003', name: 'Bob Wilson', active: false }, // Inactive customer
];

// Mutable orders array for testing state changes
export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'CUST-001',
    items: [
      { itemId: 'ITEM-001', itemName: 'Widget Pro', quantity: 2, unitPrice: 29.99, subtotal: 59.98 },
    ],
    status: 'Pending',
    total: 59.98,
    createdAt: new Date().toISOString(), // Recent - within cancellation window
    updatedAt: new Date().toISOString(),
    cancelledAt: null,
    cancellationReason: null,
  },
  {
    id: 'ORD-002',
    customerId: 'CUST-001',
    items: [
      { itemId: 'ITEM-002', itemName: 'Gadget Basic', quantity: 1, unitPrice: 49.99, subtotal: 49.99 },
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
      { itemId: 'ITEM-001', itemName: 'Widget Pro', quantity: 1, unitPrice: 29.99, subtotal: 29.99 },
    ],
    status: 'Pending',
    total: 29.99,
    createdAt: '2026-01-17T10:00:00Z', // 48+ hours ago - cancellation window expired
    updatedAt: '2026-01-17T10:00:00Z',
    cancelledAt: null,
    cancellationReason: null,
  },
  {
    id: 'ORD-004',
    customerId: 'CUST-002', // Different customer - for testing forbidden
    items: [
      { itemId: 'ITEM-004', itemName: 'Doohickey', quantity: 3, unitPrice: 15.00, subtotal: 45.00 },
    ],
    status: 'Pending',
    total: 45.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancelledAt: null,
    cancellationReason: null,
  },
  {
    id: 'ORD-005',
    customerId: 'CUST-001',
    items: [
      { itemId: 'ITEM-001', itemName: 'Widget Pro', quantity: 1, unitPrice: 29.99, subtotal: 29.99 },
      { itemId: 'ITEM-002', itemName: 'Gadget Basic', quantity: 2, unitPrice: 49.99, subtotal: 99.98 },
    ],
    status: 'Confirmed',
    total: 129.97,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancelledAt: null,
    cancellationReason: null,
  },
];

// ============================================
// SCENARIOS
// ============================================

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

export const getMockScenario = (): MockScenario => currentScenario;

export const resetMockScenario = (): void => {
  currentScenario = 'success';
  console.log('[MSW] Scenario reset to: success');
};

export const availableScenarios: MockScenario[] = [
  'success',
  'unauthorized',
  'serverError',
  'slowNetwork',
  'offline',
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateTraceId = (): string => 
  Math.random().toString(36).substring(2, 15);

const generateOrderId = (): string => 
  `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

const getRealisticDelay = (): number => {
  switch (currentScenario) {
    case 'slowNetwork':
      return 3000 + Math.random() * 2000; // 3-5 seconds
    default:
      return 100 + Math.random() * 200; // 100-300ms
  }
};

const createProblemDetail = (
  type: string,
  title: string,
  status: number,
  detail: string,
  instance?: string,
  violations?: Violation[]
): ProblemDetail => ({
  type: `https://api.example.com/errors/${type}`,
  title,
  status,
  detail,
  instance,
  traceId: generateTraceId(),
  ...(violations && { violations }),
});

const getOrderById = (id: string): Order | undefined => 
  orders.find((order) => order.id === id);

const getItemById = (id: string) => 
  items.find((item) => item.id === id);

const getCustomerById = (id: string) => 
  customers.find((customer) => customer.id === id);

// Current user simulation (for auth checks)
const currentUserId = 'CUST-001';

// ============================================
// HANDLERS
// ============================================

/**
 * GET /api/v1/orders - List Orders with Pagination
 */
const listOrdersHandler = http.get('/api/v1/orders', async ({ request }) => {
  await delay(getRealisticDelay());

  // Check scenario-based errors
  if (currentScenario === 'unauthorized') {
    return HttpResponse.json(
      createProblemDetail('unauthorized', 'Unauthorized', 401, 'Authentication required'),
      { status: 401 }
    );
  }

  if (currentScenario === 'serverError') {
    return HttpResponse.json(
      createProblemDetail('internal-error', 'Internal Server Error', 500, 'An unexpected error occurred'),
      { status: 500 }
    );
  }

  // Parse query parameters
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '0', 10);
  const size = parseInt(url.searchParams.get('size') || '20', 10);
  const status = url.searchParams.get('status') as OrderStatus | null;
  const customerId = url.searchParams.get('customerId');

  // Filter orders
  let filteredOrders = [...orders];
  
  if (status) {
    filteredOrders = filteredOrders.filter((o) => o.status === status);
  }
  
  if (customerId) {
    filteredOrders = filteredOrders.filter((o) => o.customerId === customerId);
  }

  // Sort by createdAt descending
  filteredOrders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Paginate
  const totalElements = filteredOrders.length;
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = page * size;
  const pageContent = filteredOrders.slice(startIndex, startIndex + size);

  // Map to summary view
  const summaries: OrderSummary[] = pageContent.map((order) => ({
    id: order.id,
    customerId: order.customerId,
    status: order.status,
    total: order.total,
    itemCount: order.items.length,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));

  const response: OrderPage = {
    content: summaries,
    page: {
      number: page,
      size,
      totalElements,
      totalPages,
    },
  };

  return HttpResponse.json(response);
});

/**
 * GET /api/v1/orders/:orderId - Get Order Detail
 */
const getOrderHandler = http.get('/api/v1/orders/:orderId', async ({ params }) => {
  await delay(getRealisticDelay());

  if (currentScenario === 'unauthorized') {
    return HttpResponse.json(
      createProblemDetail('unauthorized', 'Unauthorized', 401, 'Authentication required'),
      { status: 401 }
    );
  }

  const { orderId } = params;
  const order = getOrderById(orderId as string);

  if (!order) {
    return HttpResponse.json(
      createProblemDetail(
        'not-found',
        'Not Found',
        404,
        `Order ${orderId} not found`,
        `/api/v1/orders/${orderId}`
      ),
      { status: 404 }
    );
  }

  return HttpResponse.json(order);
});

/**
 * POST /api/v1/orders - Create Order
 */
const createOrderHandler = http.post('/api/v1/orders', async ({ request }) => {
  await delay(getRealisticDelay());

  if (currentScenario === 'unauthorized') {
    return HttpResponse.json(
      createProblemDetail('unauthorized', 'Unauthorized', 401, 'Authentication required'),
      { status: 401 }
    );
  }

  if (currentScenario === 'serverError') {
    return HttpResponse.json(
      createProblemDetail('internal-error', 'Internal Server Error', 500, 'An unexpected error occurred'),
      { status: 500 }
    );
  }

  const body = await request.json() as CreateOrderRequest;

  // Validate request body
  const violations: Violation[] = [];

  if (!body.customerId) {
    violations.push({ field: 'customerId', message: 'must not be null' });
  }

  if (!body.items || body.items.length === 0) {
    violations.push({ field: 'items', message: 'must not be empty' });
  }

  if (body.items && body.items.length > 100) {
    violations.push({ field: 'items', message: 'must have at most 100 items' });
  }

  body.items?.forEach((item, index) => {
    if (!item.itemId) {
      violations.push({ field: `items[${index}].itemId`, message: 'must not be null' });
    }
    if (!item.quantity || item.quantity < 1 || item.quantity > 99) {
      violations.push({ field: `items[${index}].quantity`, message: 'must be between 1 and 99' });
    }
  });

  if (violations.length > 0) {
    return HttpResponse.json(
      createProblemDetail(
        'validation-error',
        'Validation Error',
        400,
        'Request validation failed',
        '/api/v1/orders',
        violations
      ),
      { status: 400 }
    );
  }

  // Check customer exists and is active
  const customer = getCustomerById(body.customerId);
  if (!customer) {
    return HttpResponse.json(
      createProblemDetail(
        'not-found',
        'Not Found',
        404,
        `Customer ${body.customerId} not found`,
        '/api/v1/orders'
      ),
      { status: 404 }
    );
  }

  if (!customer.active) {
    return HttpResponse.json(
      createProblemDetail(
        'customer-inactive',
        'Customer Inactive',
        409,
        'Customer account is not active',
        '/api/v1/orders'
      ),
      { status: 409 }
    );
  }

  // Check items exist and are in stock
  const orderItems: OrderItem[] = [];
  let total = 0;

  for (const reqItem of body.items) {
    const item = getItemById(reqItem.itemId);
    
    if (!item) {
      return HttpResponse.json(
        createProblemDetail(
          'not-found',
          'Not Found',
          404,
          `Item ${reqItem.itemId} not found`,
          '/api/v1/orders'
        ),
        { status: 404 }
      );
    }

    if (!item.inStock) {
      return HttpResponse.json(
        createProblemDetail(
          'out-of-stock',
          'Item Out of Stock',
          409,
          `Item '${item.name}' is currently out of stock`,
          '/api/v1/orders'
        ),
        { status: 409 }
      );
    }

    if (reqItem.quantity > item.stockQuantity) {
      return HttpResponse.json(
        createProblemDetail(
          'insufficient-stock',
          'Insufficient Stock',
          409,
          `Only ${item.stockQuantity} units of '${item.name}' available, requested ${reqItem.quantity}`,
          '/api/v1/orders'
        ),
        { status: 409 }
      );
    }

    const subtotal = item.price * reqItem.quantity;
    orderItems.push({
      itemId: item.id,
      itemName: item.name,
      quantity: reqItem.quantity,
      unitPrice: item.price,
      subtotal,
    });
    total += subtotal;
  }

  // Create the order
  const now = new Date().toISOString();
  const newOrder: Order = {
    id: generateOrderId(),
    customerId: body.customerId,
    items: orderItems,
    status: 'Pending',
    total: Math.round(total * 100) / 100, // Round to 2 decimal places
    createdAt: now,
    updatedAt: now,
    cancelledAt: null,
    cancellationReason: null,
  };

  orders.push(newOrder);

  return HttpResponse.json(newOrder, {
    status: 201,
    headers: {
      Location: `/api/v1/orders/${newOrder.id}`,
    },
  });
});

/**
 * POST /api/v1/orders/:orderId/cancel - Cancel Order
 */
const cancelOrderHandler = http.post(
  '/api/v1/orders/:orderId/cancel',
  async ({ params, request }) => {
    await delay(getRealisticDelay());

    if (currentScenario === 'unauthorized') {
      return HttpResponse.json(
        createProblemDetail('unauthorized', 'Unauthorized', 401, 'Authentication required'),
        { status: 401 }
      );
    }

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
          `/api/v1/orders/${orderId}/cancel`,
          [{ field: 'reason', message: 'must not be empty' }]
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
          `/api/v1/orders/${orderId}/cancel`,
          [{ field: 'reason', message: 'must be at most 500 characters' }]
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

    // Check if order belongs to current user
    if (order.customerId !== currentUserId) {
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
    const now = new Date().toISOString();
    order.status = 'Cancelled';
    order.cancellationReason = body.reason;
    order.cancelledAt = now;
    order.updatedAt = now;

    return HttpResponse.json(order);
  }
);

// ============================================
// EXPORT ALL HANDLERS
// ============================================

export const handlers = [
  listOrdersHandler,
  getOrderHandler,
  createOrderHandler,
  cancelOrderHandler,
];

// ============================================
// SETUP HELPERS
// ============================================

/**
 * Browser setup for development
 * 
 * Usage in main.tsx:
 * ```typescript
 * if (import.meta.env.DEV) {
 *   const { worker } = await import('./mocks/browser');
 *   await worker.start({ onUnhandledRequest: 'bypass' });
 * }
 * ```
 */
// export const worker = setupWorker(...handlers);

/**
 * Node setup for testing
 * 
 * Usage in vitest.setup.ts:
 * ```typescript
 * import { server } from './mocks/server';
 * 
 * beforeAll(() => server.listen());
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 * ```
 */
// export const server = setupServer(...handlers);
