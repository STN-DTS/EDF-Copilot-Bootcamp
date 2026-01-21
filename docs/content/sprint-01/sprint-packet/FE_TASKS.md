# Sprint 1 — Frontend Task Breakdown

> **Stream:** Frontend (React Router v7)  
> **Sprint:** 1 (Weeks 5-6)  
> **Lead:** FE Tech Lead

---

## Task Overview

| Phase | Days | Focus | Deliverables |
|-------|------|-------|--------------|
| Foundation | Days 2-3 | Project setup, shell | App skeleton, routing |
| Core Journey | Days 4-5 | Primary user flow | Order List, Order Detail |
| Integration | Days 6-7 | Real API, error handling | Working integration |
| Testing | Days 8-9 | Component tests, E2E | Test coverage |
| Polish | Day 10 | Demo prep | Demo-ready UI |

---

## Week 5: Foundation + Core Flow

### Day 2: Project Structure + Routing (6 hours)

#### FE-001: Set up React Router v7 project structure (2h)

**Description:** Initialize or verify React Router v7 project with proper folder structure.

**Acceptance Criteria:**
- [ ] Project builds successfully
- [ ] React Router v7 framework mode configured
- [ ] TypeScript configured
- [ ] ESLint + Prettier configured
- [ ] Folder structure matches conventions

**Folder Structure:**
```
src/
├── routes/              # Route modules
├── components/          # Shared components
│   ├── layout/          # Layout components
│   ├── ui/              # UI primitives
│   └── orders/          # Feature components
├── lib/                 # Utilities
├── types/               # TypeScript types
└── mocks/               # MSW mocks
```

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Review the current React Router v7 project structure and suggest 
improvements to match our conventions:

@workspace Show the current folder structure and compare to 
.github/instructions/frontend.instructions.md patterns.
```

---

#### FE-002: Implement app shell with navigation (4h)

**Description:** Create the main layout with navigation, header, and error boundary.

**Acceptance Criteria:**
- [ ] Layout component wraps all routes
- [ ] Header with app title and navigation
- [ ] Navigation to Orders page
- [ ] Skip link for accessibility
- [ ] Error boundary catches errors
- [ ] Footer with basic info

**Implementation Details:**

```typescript
// src/routes/_layout.tsx
import { Outlet, Link } from 'react-router';
import { Header } from '~/components/layout/Header';
import { Navigation } from '~/components/layout/Navigation';
import { ErrorBoundary } from '~/components/layout/ErrorBoundary';

export default function Layout() {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <Navigation />
      <main id="main-content" role="main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Create a React Router v7 layout component with:
1. Header with app title
2. Navigation with link to Orders
3. Skip link for accessibility
4. Error boundary wrapper
5. Footer with copyright

Follow patterns in .github/instructions/frontend.instructions.md
Include proper ARIA landmarks and semantic HTML.
```

---

### Day 3: Layout Components (7 hours)

#### FE-002 (continued): Header and Navigation (4h)

**Header Component:**
```typescript
// src/components/layout/Header.tsx
export function Header() {
  return (
    <header role="banner" className="app-header">
      <div className="header-content">
        <Link to="/" className="app-logo">
          Order Management
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
```

**Navigation Component:**
```typescript
// src/components/layout/Navigation.tsx
export function Navigation() {
  return (
    <nav role="navigation" aria-label="Main navigation">
      <ul className="nav-list">
        <li>
          <NavLink to="/orders" className={({ isActive }) => 
            isActive ? 'nav-link active' : 'nav-link'
          }>
            Orders
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
```

---

#### FE-006: Implement error boundary and error states (3h)

**Description:** Create reusable error handling components.

**Acceptance Criteria:**
- [ ] ErrorBoundary catches React errors
- [ ] ErrorFallback displays user-friendly message
- [ ] Retry option available
- [ ] Error is logged
- [ ] Accessible error messages

**Implementation:**
```typescript
// src/components/layout/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to monitoring service
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorFallback 
          error={this.state.error} 
          onRetry={this.handleRetry} 
        />
      );
    }
    return this.props.children;
  }
}
```

---

### Day 4: First Journey UI (7 hours)

#### FE-003: Create Order List route with loader (6h)

**Description:** Implement the Order List page with data loading.

**Acceptance Criteria:**
- [ ] Route at /orders
- [ ] Loader fetches from /api/v1/orders
- [ ] Loading state displays
- [ ] Error state displays with retry
- [ ] Empty state displays
- [ ] Orders render in list/table
- [ ] Pagination controls work
- [ ] Accessible table markup

**Route Implementation:**
```typescript
// src/routes/orders._index.tsx
import { useLoaderData, useNavigation } from 'react-router';
import type { Route } from './+types/orders._index';
import { OrderList } from '~/components/orders/OrderList';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { ErrorDisplay } from '~/components/ui/ErrorDisplay';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '0';
  const size = url.searchParams.get('size') || '20';
  
  const response = await fetch(
    `/api/v1/orders?page=${page}&size=${size}`,
    {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Response('Failed to load orders', { status: response.status });
  }
  
  return response.json();
}

export default function OrdersIndex({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  
  if (isLoading) {
    return <LoadingSpinner label="Loading orders..." />;
  }
  
  if (!loaderData.content || loaderData.content.length === 0) {
    return <EmptyState message="No orders yet" />;
  }
  
  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      <OrderList 
        orders={loaderData.content} 
        pagination={loaderData.page} 
      />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <ErrorDisplay 
      title="Failed to load orders"
      message="We couldn't load your orders. Please try again."
      onRetry={() => window.location.reload()}
    />
  );
}
```

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Create an OrderList component for displaying orders in a table.

Requirements:
- Receives orders array and pagination info
- Renders accessible table with proper headers
- Shows order ID, date, status, total for each row
- Rows are clickable (navigate to detail)
- Pagination controls at bottom
- Follow patterns in .github/instructions/frontend.instructions.md

Types from: docs/content/week-04/contracts/openapi.yaml
```

---

#### FE-004: Create Order Detail route with loader (4h, started Day 4, finished Day 5)

**Description:** Implement the Order Detail page.

**Acceptance Criteria:**
- [ ] Route at /orders/:id
- [ ] Loader fetches single order
- [ ] Order details display
- [ ] Order items display
- [ ] Back navigation to list
- [ ] Loading/error states

---

### Day 5: MSW Integration (7 hours)

#### FE-005: Configure MSW handlers for development (3h)

**Description:** Set up Mock Service Worker for frontend development.

**Acceptance Criteria:**
- [ ] MSW configured for browser
- [ ] Handlers match OpenAPI contract
- [ ] Happy path responses working
- [ ] Error responses available
- [ ] Mock data is realistic

**Implementation:**
```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { mockOrders, mockOrderDetail } from './data';

export const handlers = [
  // GET /api/v1/orders
  http.get('/api/v1/orders', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '20');
    
    const start = page * size;
    const end = start + size;
    const content = mockOrders.slice(start, end);
    
    return HttpResponse.json({
      content,
      page: {
        number: page,
        size,
        totalElements: mockOrders.length,
        totalPages: Math.ceil(mockOrders.length / size),
      },
    });
  }),
  
  // GET /api/v1/orders/:id
  http.get('/api/v1/orders/:id', ({ params }) => {
    const order = mockOrders.find(o => o.id === parseInt(params.id as string));
    
    if (!order) {
      return HttpResponse.json(
        {
          type: '/problems/not-found',
          title: 'Not Found',
          status: 404,
          detail: `Order with ID ${params.id} not found`,
          instance: `/api/v1/orders/${params.id}`,
        },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(order);
  }),
];
```

**Mock Data:**
```typescript
// src/mocks/data.ts
import type { Order } from '~/types/api';

export const mockOrders: Order[] = [
  {
    id: 12345,
    customerId: 67890,
    status: 'CREATED',
    items: [
      {
        id: 1,
        itemId: 101,
        quantity: 2,
        unitPrice: '29.99',
        lineTotal: '59.98',
      },
    ],
    totalAmount: '59.98',
    createdAt: '2026-01-20T10:30:00Z',
    updatedAt: '2026-01-20T10:30:00Z',
  },
  // ... more mock orders
];
```

---

#### FE-004 (continued): Complete Order Detail (4h)

Complete the order detail route implementation.

---

## Week 6: Integration + Testing

### Day 6: Real API Integration (7 hours)

#### FE-011: Integrate with real backend API (4h)

**Description:** Switch from MSW to real backend.

**Acceptance Criteria:**
- [ ] API base URL configurable
- [ ] Auth token included in requests
- [ ] CORS handled (if needed)
- [ ] Error responses parsed correctly
- [ ] MSW disabled in production

**Environment Configuration:**
```typescript
// src/lib/config.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
};
```

**API Client:**
```typescript
// src/lib/api.ts
import { config } from './config';
import { getAuthToken } from './auth';

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const problem = await response.json();
    throw new ApiError(problem);
  }
  
  return response.json();
}
```

---

#### FE-006 (continued): Error handling refinement (3h)

**Problem Details Display:**
```typescript
// src/components/ui/ErrorDisplay.tsx
interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: Array<{ field: string; message: string }>;
}

export function ErrorDisplay({ error, onRetry }: Props) {
  const message = getErrorMessage(error);
  
  return (
    <div role="alert" className="error-display">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {error.errors && (
        <ul className="error-list">
          {error.errors.map((e, i) => (
            <li key={i}>{e.field}: {e.message}</li>
          ))}
        </ul>
      )}
      {onRetry && (
        <button onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </div>
  );
}

function getErrorMessage(error: ProblemDetail): string {
  switch (error.type) {
    case '/problems/not-found':
      return 'The requested resource was not found.';
    case '/problems/unauthorized':
      return 'Please sign in to continue.';
    case '/problems/validation-error':
      return 'Please check your input and try again.';
    default:
      return error.detail || 'An unexpected error occurred.';
  }
}
```

---

### Day 7: Error Handling (7 hours)

Continue error handling implementation and edge case testing.

---

### Day 8: Component Tests (7 hours)

#### FE-007: Set up Vitest + RTL tests (2h)

**Description:** Configure testing framework.

**Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['src/mocks/**', 'src/test/**'],
    },
  },
});
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { server } from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

#### FE-008: Write component tests for Order List (4h)

**Description:** Test OrderList component.

**Test Implementation:**
```typescript
// src/components/orders/OrderList.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderList } from './OrderList';
import { mockOrders } from '~/mocks/data';

describe('OrderList', () => {
  const defaultPagination = {
    number: 0,
    size: 20,
    totalElements: 5,
    totalPages: 1,
  };

  it('renders orders in a table', () => {
    render(
      <MemoryRouter>
        <OrderList orders={mockOrders} pagination={defaultPagination} />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(mockOrders.length + 1); // +1 for header
  });

  it('displays order details in each row', () => {
    render(
      <MemoryRouter>
        <OrderList orders={mockOrders} pagination={defaultPagination} />
      </MemoryRouter>
    );
    
    const firstOrder = mockOrders[0];
    expect(screen.getByText(`#${firstOrder.id}`)).toBeInTheDocument();
    expect(screen.getByText(firstOrder.status)).toBeInTheDocument();
    expect(screen.getByText(`$${firstOrder.totalAmount}`)).toBeInTheDocument();
  });

  it('shows pagination when multiple pages exist', () => {
    render(
      <MemoryRouter>
        <OrderList 
          orders={mockOrders} 
          pagination={{ ...defaultPagination, totalPages: 3 }} 
        />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
  });
});
```

---

#### FE-009: Write component tests for Order Detail (3h)

**Description:** Test OrderDetail component.

---

### Day 9: E2E Skeleton (7 hours)

#### FE-010: Set up Playwright E2E skeleton (4h)

**Description:** Configure Playwright and write basic E2E tests.

**Configuration:**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**E2E Tests:**
```typescript
// tests/e2e/orders.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Orders Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth or set up test user
    await page.goto('/');
  });

  test('displays order list', async ({ page }) => {
    await page.goto('/orders');
    
    await expect(page.getByRole('heading', { name: 'Your Orders' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('navigates to order detail', async ({ page }) => {
    await page.goto('/orders');
    
    await page.getByRole('link', { name: /order #/i }).first().click();
    
    await expect(page.getByRole('heading', { name: /order #/i })).toBeVisible();
  });

  test('handles empty state', async ({ page }) => {
    // Set up mock to return empty array
    await page.goto('/orders');
    
    await expect(page.getByText(/no orders/i)).toBeVisible();
  });
});
```

---

#### FE-012: Accessibility baseline verification (3h)

**Description:** Verify accessibility of implemented components.

**Accessibility Checklist:**
- [ ] Semantic HTML used correctly
- [ ] Skip link present and functional
- [ ] ARIA landmarks correct
- [ ] Focus management on navigation
- [ ] Color contrast meets WCAG AA
- [ ] Interactive elements keyboard accessible
- [ ] Loading states announced
- [ ] Error states announced
- [ ] Tables have proper headers

**Automated Testing:**
```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('orders page has no accessibility violations', async ({ page }) => {
    await page.goto('/orders');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

---

### Day 10: Polish + Demo Prep (7 hours)

**Tasks:**
1. Fix any blocking bugs (2h)
2. UI polish for demo (2h)
3. Prepare demo script (1h)
4. Practice demo flow (1h)
5. Participate in demo and retro (1h)

---

## Task Summary

| ID | Task | Days | Hours | Status |
|----|------|------|-------|--------|
| FE-001 | Project structure | 2 | 2 | ⬜ |
| FE-002 | App shell | 2-3 | 4 | ⬜ |
| FE-003 | Order List route | 4 | 6 | ⬜ |
| FE-004 | Order Detail route | 4-5 | 4 | ⬜ |
| FE-005 | MSW handlers | 5 | 3 | ⬜ |
| FE-006 | Error handling | 3, 6-7 | 6 | ⬜ |
| FE-007 | Test setup | 8 | 2 | ⬜ |
| FE-008 | Order List tests | 8 | 4 | ⬜ |
| FE-009 | Order Detail tests | 8 | 3 | ⬜ |
| FE-010 | E2E skeleton | 9 | 4 | ⬜ |
| FE-011 | API integration | 6 | 4 | ⬜ |
| FE-012 | Accessibility | 9 | 3 | ⬜ |

**Total Estimated:** ~45 hours (across 9 dev days)

---

## Copilot Assistance

```
FE Sprint 1 tasks focus on:
- React Router v7 patterns for data loading
- MSW for mock development
- Vitest + RTL for component testing
- Playwright for E2E testing
- Accessibility from day 1

Key prompts:
- P1: Scaffold new components
- P9: Create React Router routes
- P2: Write component tests
- P10: Check accessibility
- P22: Generate MSW handlers

Reference:
- .github/instructions/frontend.instructions.md
- docs/content/week-04/contracts/openapi.yaml
- docs/content/week-04/templates/MOCK_STRATEGY.md
```
