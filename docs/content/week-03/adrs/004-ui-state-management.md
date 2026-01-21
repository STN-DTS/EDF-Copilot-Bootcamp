# ADR-004: UI State Management Strategy

**Status:** Accepted  
**Date:** [Date]  
**Deciders:** [Tech Lead, Frontend Lead]

---

## Context

The Order Management System frontend is built with React Router v7 (framework mode). We need to decide how to manage application state including server data, form state, and UI state.

### Forces

- **React Router v7:** Uses loaders for data fetching and actions for mutations
- **Server State:** Most data comes from the backend API
- **Form State:** Forms need validation, error handling, pending states
- **UI State:** Some state is purely client-side (modals, filters, selections)
- **Performance:** Avoid unnecessary re-fetches and re-renders
- **Developer Experience:** State management should be intuitive
- **Bundle Size:** Minimize additional dependencies

---

## Decision

**We will use React Router v7's built-in state management as the primary approach, with minimal additional libraries.**

### State Categories and Solutions

| State Type | Solution | When to Use |
|------------|----------|-------------|
| Server State | RRv7 Loaders + Actions | Data from API |
| URL State | URL Search Params | Filters, pagination, tabs |
| Form State | RRv7 Actions + useActionData | Form submissions |
| Pending State | useNavigation | Loading indicators |
| Optimistic UI | useFetcher | Immediate feedback |
| Local UI State | useState/useReducer | Component-specific |
| Shared UI State | Context (minimal) | Toasts, modals |

---

## Options Considered

### Option 1: React Router v7 Built-in (Selected)

**Pros:**
- Already included with RRv7
- Designed for the framework's patterns
- Minimal bundle size impact
- Server state automatically cached and revalidated
- Progressive enhancement friendly

**Cons:**
- Less flexible than dedicated state libraries
- May need additional patterns for complex UI state

### Option 2: TanStack Query + RRv7

**Pros:**
- Powerful caching and revalidation
- Great DevTools
- Well-documented

**Cons:**
- Overlaps with RRv7 loader functionality
- Additional bundle size (~12KB)
- Two mental models for data fetching

### Option 3: Redux Toolkit

**Pros:**
- Mature ecosystem
- Good DevTools
- Handles complex state well

**Cons:**
- Significant boilerplate
- Large bundle size (~40KB)
- Overkill for this application
- Conflicts with RRv7 patterns

### Option 4: Zustand

**Pros:**
- Lightweight (~2KB)
- Simple API
- Good for UI state

**Cons:**
- Still another state solution to learn
- Not needed for server state with RRv7

---

## Consequences

### Positive

- ✅ Zero additional bundle size for state management
- ✅ Consistent patterns throughout codebase
- ✅ Automatic revalidation on mutations
- ✅ Progressive enhancement works out of the box
- ✅ Simpler mental model

### Negative

- ⚠️ Must embrace RRv7 patterns fully
- ⚠️ Complex shared state may need Context
- ⚠️ Less caching control than TanStack Query

---

## Implementation Patterns

### Pattern 1: Server State with Loaders

```typescript
// routes/orders/route.tsx
import { json, type LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') ?? '1';
  const status = url.searchParams.get('status');
  
  const response = await fetch(
    `/api/v1/orders?page=${page}${status ? `&status=${status}` : ''}`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  
  if (!response.ok) {
    throw new Response('Failed to load orders', { status: response.status });
  }
  
  return json(await response.json());
}

export default function OrdersRoute() {
  const { orders, pagination } = useLoaderData<typeof loader>();
  
  return (
    <OrderList orders={orders} pagination={pagination} />
  );
}
```

### Pattern 2: URL State for Filters

```typescript
// components/OrderFilters.tsx
import { useSearchParams } from 'react-router';

export function OrderFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? 'all';
  
  const handleStatusChange = (newStatus: string) => {
    setSearchParams(prev => {
      if (newStatus === 'all') {
        prev.delete('status');
      } else {
        prev.set('status', newStatus);
      }
      prev.set('page', '1'); // Reset to first page
      return prev;
    });
  };
  
  return (
    <select value={status} onChange={e => handleStatusChange(e.target.value)}>
      <option value="all">All Statuses</option>
      <option value="CREATED">Created</option>
      <option value="PROCESSING">Processing</option>
      <option value="SHIPPED">Shipped</option>
    </select>
  );
}
```

### Pattern 3: Form Submission with Actions

```typescript
// routes/orders/new/route.tsx
import { json, redirect, type ActionFunctionArgs } from 'react-router';
import { useActionData, useNavigation, Form } from 'react-router';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const customerId = formData.get('customerId');
  const items = formData.getAll('items');
  
  const response = await fetch('/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ customerId, items }),
  });
  
  if (!response.ok) {
    const problem = await response.json();
    return json(problem, { status: problem.status });
  }
  
  const order = await response.json();
  return redirect(`/orders/${order.id}`);
}

export default function NewOrderRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  return (
    <Form method="post">
      {actionData?.errors && (
        <ValidationErrors errors={actionData.errors} />
      )}
      
      {/* Form fields */}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Order'}
      </button>
    </Form>
  );
}
```

### Pattern 4: Optimistic UI with useFetcher

```typescript
// components/OrderStatusToggle.tsx
import { useFetcher } from 'react-router';

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';
  
  // Optimistic UI - show cancelled immediately
  const optimisticStatus = isSubmitting ? 'CANCELLED' : undefined;
  
  return (
    <fetcher.Form method="post" action={`/orders/${orderId}/cancel`}>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className={optimisticStatus === 'CANCELLED' ? 'text-gray-400' : ''}
      >
        {isSubmitting ? 'Cancelling...' : 'Cancel Order'}
      </button>
    </fetcher.Form>
  );
}
```

### Pattern 5: Local UI State

```typescript
// components/OrderCard.tsx
import { useState } from 'react';

export function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border rounded p-4">
      <div className="flex justify-between">
        <h3>Order #{order.id}</h3>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <OrderDetails order={order} />
      )}
    </div>
  );
}
```

### Pattern 6: Shared UI State with Context

```typescript
// contexts/ToastContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const addToast = (message: string, type: Toast['type']) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
```

---

## Decision Matrix

| Scenario | Approach |
|----------|----------|
| Fetch list data | Loader |
| Fetch detail data | Loader |
| Apply filters | URL search params |
| Sort table | URL search params |
| Paginate | URL search params |
| Submit form | Action + Form |
| Delete item | Action + fetcher |
| Toggle expansion | useState |
| Show modal | useState |
| Show toast | Context |
| Theme preference | Context + localStorage |

---

## Related Decisions

- [ADR-001: Authentication](./001-authentication.md) - Token storage in context
- [ADR-002: Error Handling](./002-error-handling.md) - Error display patterns

---

## References

- [React Router v7 Data Loading](https://reactrouter.com/dev/guides/data-loading)
- [React Router v7 Data Mutations](https://reactrouter.com/dev/guides/data-mutation)
- [React Router v7 Pending UI](https://reactrouter.com/dev/guides/pending-ui)
