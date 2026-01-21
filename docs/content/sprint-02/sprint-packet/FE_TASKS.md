# Sprint 2 Frontend Tasks — Expand + NFRs

> **Timebox:** 10 working days (Week 7-8)  
> **Estimated Effort:** ~57 hours  
> **Prerequisites:** Sprint 1 FE complete, Sprint 2 Packet approved

---

## Task Overview

| Category | Tasks | Hours |
|----------|-------|-------|
| Create Order Journey | FE-101 to FE-103 | 13h |
| Cancel Order Journey | FE-104 to FE-106 | 7h |
| Filter/Search | FE-107 to FE-109 | 8h |
| State Components | FE-110 to FE-113 | 9h |
| Accessibility | FE-114 | 6h |
| Testing | FE-115 to FE-116 | 14h |
| **Total** | 17 tasks | **57h** |

---

## Week 7: Feature Expansion (Days 2-5)

### Day 2: Create Order Route (6h)

#### FE-101: Create Order Route with Form

**Description:** Create the new order form route with React Router v7 patterns.

**Tasks:**
- [ ] Create `routes/orders.new.tsx`
- [ ] Add route to router configuration
- [ ] Build CreateOrderForm component
- [ ] Handle form state with controlled components
- [ ] Configure action handler for submission

**Code Example:**

```tsx
// src/routes/orders.new.tsx
import { Form, redirect, useNavigation, useActionData } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';
import { CreateOrderForm } from '~/components/orders/CreateOrderForm';
import { ordersApi } from '~/lib/api';
import type { OrderCreateRequest, ProblemDetail } from '~/types/api';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const orderData: OrderCreateRequest = {
    customerId: formData.get('customerId') as string,
    items: JSON.parse(formData.get('items') as string),
    shippingAddress: {
      street: formData.get('street') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postalCode: formData.get('postalCode') as string,
    },
    notes: formData.get('notes') as string | undefined,
  };

  try {
    const response = await ordersApi.create(orderData);
    
    // Redirect to order list on success
    return redirect('/orders?created=true');
  } catch (error) {
    // Return validation errors to form
    return error as ProblemDetail;
  }
}

export default function CreateOrderRoute() {
  const navigation = useNavigation();
  const actionData = useActionData<ProblemDetail | undefined>();
  
  const isSubmitting = navigation.state === 'submitting';
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Order</h1>
      
      {actionData?.title && (
        <div 
          role="alert" 
          className="bg-red-50 border border-red-200 p-4 rounded mb-6"
          aria-live="assertive"
        >
          <p className="font-medium text-red-800">{actionData.title}</p>
          {actionData.detail && (
            <p className="text-red-600 mt-1">{actionData.detail}</p>
          )}
        </div>
      )}
      
      <CreateOrderForm isSubmitting={isSubmitting} errors={actionData} />
    </div>
  );
}
```

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Create a React Router v7 route for the Create Order journey.

Requirements:
- Route file at src/routes/orders.new.tsx
- Action handler for POST /api/v1/orders
- Uses React Router Form component
- Handles submission loading state
- Shows server errors via useActionData
- Follows patterns in .github/instructions/frontend.instructions.md

Show me a plan first.
```

---

### Day 3: Form Validation (7h)

#### FE-102: Client-Side Validation (4h)

**Description:** Add comprehensive form validation with accessible error handling.

**Tasks:**
- [ ] Required field validation
- [ ] Format validation (dates, numbers)
- [ ] Inline error display per field
- [ ] Error summary at form level
- [ ] ARIA attributes for accessibility

**Code Example:**

```tsx
// src/components/orders/CreateOrderForm.tsx
import { Form, useNavigation } from 'react-router';
import { useState, useCallback } from 'react';
import type { ProblemDetail } from '~/types/api';

interface CreateOrderFormProps {
  isSubmitting: boolean;
  errors?: ProblemDetail;
}

interface FormErrors {
  customerId?: string;
  items?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export function CreateOrderForm({ isSubmitting, errors }: CreateOrderFormProps) {
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [items, setItems] = useState<OrderItem[]>([]);

  const validateForm = useCallback((formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    
    // Required field validation
    if (!formData.get('customerId')) {
      newErrors.customerId = 'Customer is required';
    }
    
    if (items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    
    if (!formData.get('street')) {
      newErrors.street = 'Street address is required';
    }
    
    if (!formData.get('city')) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.get('state')) {
      newErrors.state = 'State is required';
    }
    
    const postalCode = formData.get('postalCode') as string;
    if (!postalCode) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(postalCode)) {
      newErrors.postalCode = 'Invalid postal code format';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [items]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    
    // Add items as JSON
    formData.set('items', JSON.stringify(items));
    
    if (!validateForm(formData)) {
      event.preventDefault();
      // Focus first error field
      const firstError = Object.keys(formErrors)[0];
      document.getElementById(firstError)?.focus();
    }
  };

  // Map server errors to field errors
  const serverErrors = errors?.errors as Record<string, string[]> | undefined;

  return (
    <Form method="post" onSubmit={handleSubmit} noValidate>
      {/* Error summary for screen readers */}
      {Object.keys(formErrors).length > 0 && (
        <div 
          role="alert" 
          aria-live="assertive"
          className="sr-only"
        >
          Please fix {Object.keys(formErrors).length} errors in the form.
        </div>
      )}

      <fieldset disabled={isSubmitting}>
        {/* Customer Selection */}
        <div className="mb-4">
          <label 
            htmlFor="customerId" 
            className="block font-medium mb-1"
          >
            Customer <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <select
            id="customerId"
            name="customerId"
            aria-required="true"
            aria-invalid={!!formErrors.customerId || !!serverErrors?.customerId}
            aria-describedby={formErrors.customerId ? 'customerId-error' : undefined}
            className={`w-full border rounded p-2 ${
              formErrors.customerId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a customer</option>
            {/* Customer options would be loaded */}
          </select>
          {(formErrors.customerId || serverErrors?.customerId) && (
            <p 
              id="customerId-error" 
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {formErrors.customerId || serverErrors?.customerId?.[0]}
            </p>
          )}
        </div>

        {/* Item Selection Component */}
        <div className="mb-4">
          <ItemSelector 
            items={items} 
            onChange={setItems}
            error={formErrors.items}
          />
        </div>

        {/* Shipping Address */}
        <fieldset className="mb-4">
          <legend className="font-medium mb-2">Shipping Address</legend>
          
          <div className="space-y-4">
            <FormField
              id="street"
              name="street"
              label="Street Address"
              required
              error={formErrors.street || serverErrors?.street?.[0]}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="city"
                name="city"
                label="City"
                required
                error={formErrors.city || serverErrors?.city?.[0]}
              />
              
              <FormField
                id="state"
                name="state"
                label="State"
                required
                error={formErrors.state || serverErrors?.state?.[0]}
              />
            </div>
            
            <FormField
              id="postalCode"
              name="postalCode"
              label="Postal Code"
              required
              placeholder="12345 or 12345-6789"
              error={formErrors.postalCode || serverErrors?.postalCode?.[0]}
            />
          </div>
        </fieldset>

        {/* Notes (optional) */}
        <div className="mb-6">
          <label htmlFor="notes" className="block font-medium mb-1">
            Order Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Order'}
          </button>
          
          <a
            href="/orders"
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </a>
        </div>
      </fieldset>
    </Form>
  );
}
```

#### FE-103: Submission Feedback (3h)

**Description:** Handle submission states with optimistic updates and error recovery.

**Tasks:**
- [ ] Loading spinner during submission
- [ ] Success notification after creation
- [ ] Error recovery (keep form data on failure)
- [ ] Disable form during submission

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Add submission feedback to the CreateOrderForm.

Requirements:
- Show loading spinner on submit button while submitting
- Disable all form fields during submission
- On success, show toast notification before redirect
- On error, preserve form data and show error message
- Error messages accessible to screen readers

Follow WCAG 2.1 AA guidelines.
```

---

### Day 4: Cancel Order Journey (7h)

#### FE-104: Cancel Button on Order Detail (2h)

**Description:** Add cancel button to Order Detail with visibility rules.

**Tasks:**
- [ ] Add Cancel button component
- [ ] Show only for cancellable orders (PENDING, CONFIRMED)
- [ ] Disabled state with explanation for non-cancellable

**Code Example:**

```tsx
// src/components/orders/OrderActions.tsx
import { OrderStatus } from '~/types/api';

interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
  onCancel: () => void;
}

const CANCELLABLE_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED'];

export function OrderActions({ orderId, status, onCancel }: OrderActionsProps) {
  const canCancel = CANCELLABLE_STATUSES.includes(status);
  
  return (
    <div className="flex gap-4 mt-6">
      {canCancel ? (
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          aria-label={`Cancel order ${orderId}`}
        >
          Cancel Order
        </button>
      ) : (
        <p className="text-gray-500 text-sm">
          This order cannot be cancelled (status: {status})
        </p>
      )}
    </div>
  );
}
```

#### FE-105: Confirmation Dialog (3h)

**Description:** Create accessible confirmation dialog for cancel action.

**Tasks:**
- [ ] Modal dialog component
- [ ] Focus trap within dialog
- [ ] Keyboard support (Escape to close)
- [ ] Screen reader announcements

**Code Example:**

```tsx
// src/components/orders/CancelOrderDialog.tsx
import { useRef, useEffect } from 'react';
import { useFetcher } from 'react-router';

interface CancelOrderDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CancelOrderDialog({ orderId, isOpen, onClose }: CancelOrderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const fetcher = useFetcher();
  
  const isSubmitting = fetcher.state === 'submitting';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      cancelButtonRef.current?.focus();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close on successful cancellation
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="p-0 rounded-lg shadow-xl backdrop:bg-black/50"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div className="p-6 max-w-md">
        <h2 id="dialog-title" className="text-xl font-bold mb-2">
          Cancel Order?
        </h2>
        
        <p id="dialog-description" className="text-gray-600 mb-6">
          Are you sure you want to cancel order {orderId}? This action cannot be undone.
        </p>

        {fetcher.data?.error && (
          <div 
            role="alert" 
            className="bg-red-50 border border-red-200 p-3 rounded mb-4"
          >
            {fetcher.data.error}
          </div>
        )}

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Keep Order
          </button>
          
          <fetcher.Form 
            method="delete" 
            action={`/orders/${orderId}/cancel`}
          >
            <button
              ref={cancelButtonRef}
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Cancelling...' : 'Yes, Cancel Order'}
            </button>
          </fetcher.Form>
        </div>
      </div>
    </dialog>
  );
}
```

#### FE-106: Cancel Action Handler (2h)

**Description:** Implement the cancel action in the route.

**Tasks:**
- [ ] Create action route for cancellation
- [ ] Handle success redirect
- [ ] Handle error display
- [ ] Optimistic UI update

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Create a cancel order action handler in React Router v7.

Requirements:
- Route action at /orders/:id/cancel
- DELETE request to /api/v1/orders/{id}
- On success, redirect to Order List with message
- On 409 Conflict, show error in dialog
- On other errors, show generic error

Use fetcher for in-page updates.
```

---

### Day 5: Filter/Search (8h)

#### FE-107: Filter Controls (4h)

**Description:** Add filter controls to Order List.

**Tasks:**
- [ ] Status filter (multi-select)
- [ ] Date range picker
- [ ] Search input for order ID
- [ ] Mobile-responsive layout

**Code Example:**

```tsx
// src/components/orders/OrderFilters.tsx
import { Form, useSearchParams, useSubmit } from 'react-router';
import { OrderStatus } from '~/types/api';

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function OrderFilters() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const currentStatus = searchParams.getAll('status');
  const fromDate = searchParams.get('from') ?? '';
  const toDate = searchParams.get('to') ?? '';
  const search = searchParams.get('search') ?? '';

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    submit(formData, { replace: true });
  };

  const clearFilters = () => {
    submit(new FormData(), { replace: true });
  };

  const hasFilters = currentStatus.length > 0 || fromDate || toDate || search;

  return (
    <Form 
      method="get" 
      onChange={handleChange}
      className="bg-gray-50 p-4 rounded-lg mb-6"
      role="search"
      aria-label="Filter orders"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            multiple
            defaultValue={currentStatus}
            className="w-full border border-gray-300 rounded p-2"
            aria-label="Filter by order status"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl/Cmd to select multiple
          </p>
        </div>

        {/* Date Range */}
        <div>
          <label htmlFor="from" className="block text-sm font-medium mb-1">
            From Date
          </label>
          <input
            type="date"
            id="from"
            name="from"
            defaultValue={fromDate}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="to" className="block text-sm font-medium mb-1">
            To Date
          </label>
          <input
            type="date"
            id="to"
            name="to"
            defaultValue={toDate}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-1">
            Search Order ID
          </label>
          <input
            type="search"
            id="search"
            name="search"
            defaultValue={search}
            placeholder="Enter order ID..."
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>

      {hasFilters && (
        <div className="mt-4">
          <button
            type="button"
            onClick={clearFilters}
            className="text-blue-600 hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </Form>
  );
}
```

#### FE-108: URL-Based Filter State (2h)

**Description:** Persist filter state in URL for shareable links.

**Tasks:**
- [ ] Update loader to read URL params
- [ ] Submit filters as GET params
- [ ] Handle browser back/forward

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Update the Order List loader to support URL-based filtering.

Requirements:
- Read filter params from URL (status, from, to, search)
- Pass params to API call
- Support multiple status values
- Handle empty/missing params
- Browser back/forward should restore filters

Update the loader in src/routes/orders._index.tsx
```

#### FE-109: Search Implementation (2h)

**Description:** Implement order ID search with debouncing.

**Tasks:**
- [ ] Debounced search input
- [ ] Partial match support
- [ ] Clear search button
- [ ] Loading indicator during search

---

## Week 8: NFR Hardening + Testing (Days 6-10)

### Day 6: State Components (9h)

#### FE-110: EmptyState Component (2h)

**Description:** Create reusable empty state component.

**Code Example:**

```tsx
// src/components/ui/EmptyState.tsx
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div 
      className="text-center py-12"
      role="status"
      aria-label={title}
    >
      {icon && (
        <div className="mx-auto w-16 h-16 text-gray-400 mb-4" aria-hidden="true">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-500 mb-4 max-w-sm mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <a
          href={action.href}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}

// Usage examples:
// <EmptyState 
//   title="No orders yet"
//   description="Create your first order to get started"
//   action={{ label: 'Create Order', href: '/orders/new' }}
// />
```

#### FE-111: ErrorState Component (2h)

**Description:** Create reusable error state component.

**Code Example:**

```tsx
// src/components/ui/ErrorState.tsx
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  details?: string;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message, 
  onRetry,
  details 
}: ErrorStateProps) {
  return (
    <div 
      className="text-center py-12"
      role="alert"
      aria-live="assertive"
    >
      <div className="mx-auto w-16 h-16 text-red-500 mb-4" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-4 max-w-sm mx-auto">
        {message}
      </p>
      
      {details && (
        <details className="text-left max-w-md mx-auto mb-4">
          <summary className="text-sm text-gray-500 cursor-pointer">
            Technical details
          </summary>
          <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-auto">
            {details}
          </pre>
        </details>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
```

#### FE-112: LoadingState Component (2h)

**Description:** Create skeleton loading component.

**Code Example:**

```tsx
// src/components/ui/LoadingState.tsx
interface LoadingStateProps {
  variant: 'list' | 'detail' | 'form';
  count?: number;
}

export function LoadingState({ variant, count = 3 }: LoadingStateProps) {
  return (
    <div 
      role="status" 
      aria-label="Loading content"
      className="animate-pulse"
    >
      <span className="sr-only">Loading...</span>
      
      {variant === 'list' && (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}
      
      {variant === 'detail' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      )}
      
      {variant === 'form' && (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### FE-113: Apply State Patterns (3h)

**Description:** Apply consistent state patterns to all routes.

**Tasks:**
- [ ] Order List: empty, loading, error states
- [ ] Order Detail: loading, error states
- [ ] Create Order: loading state during submission
- [ ] Verify all states accessible

---

### Day 7: Accessibility Audit (6h)

#### FE-114: Accessibility Audit + Fixes

**Description:** Comprehensive accessibility audit and remediation.

**Tasks:**
- [ ] Run axe-core automated checks
- [ ] Fix identified issues
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA/VoiceOver)
- [ ] Focus management verification
- [ ] Color contrast verification

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Audit these new Sprint 2 components for WCAG 2.1 AA compliance:

@workspace src/components/orders/

Check:
- Form labels and error announcements
- Focus management in dialogs
- Color contrast (4.5:1 minimum)
- Keyboard navigation
- ARIA attributes
- Screen reader support

Provide specific fixes for each violation with code examples.
```

**Accessibility Checklist:**

| Component | Labels | Focus | Keyboard | Contrast | ARIA |
|-----------|--------|-------|----------|----------|------|
| CreateOrderForm | [ ] | [ ] | [ ] | [ ] | [ ] |
| CancelOrderDialog | [ ] | [ ] | [ ] | [ ] | [ ] |
| OrderFilters | [ ] | [ ] | [ ] | [ ] | [ ] |
| EmptyState | [ ] | [ ] | [ ] | [ ] | [ ] |
| ErrorState | [ ] | [ ] | [ ] | [ ] | [ ] |
| LoadingState | [ ] | [ ] | [ ] | [ ] | [ ] |

---

### Day 8: Component Tests (8h)

#### FE-115: Component Tests for New Journeys

**Description:** Write comprehensive component tests.

**Code Example:**

```tsx
// src/components/orders/CreateOrderForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { CreateOrderForm } from './CreateOrderForm';

describe('CreateOrderForm', () => {
  const renderForm = (props = {}) => {
    const defaultProps = {
      isSubmitting: false,
      errors: undefined,
      ...props,
    };

    return render(<CreateOrderForm {...defaultProps} />);
  };

  describe('rendering', () => {
    it('renders all required form fields', () => {
      renderForm();
      
      expect(screen.getByLabelText(/customer/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    });

    it('marks required fields with required indicator', () => {
      renderForm();
      
      const customerLabel = screen.getByText(/customer/i).closest('label');
      expect(customerLabel).toHaveTextContent('*');
    });
  });

  describe('validation', () => {
    it('shows error for empty required fields on submit', async () => {
      const user = userEvent.setup();
      renderForm();
      
      await user.click(screen.getByRole('button', { name: /create order/i }));
      
      expect(screen.getByText(/customer is required/i)).toBeInTheDocument();
      expect(screen.getByText(/street address is required/i)).toBeInTheDocument();
    });

    it('shows error for invalid postal code format', async () => {
      const user = userEvent.setup();
      renderForm();
      
      await user.type(screen.getByLabelText(/postal code/i), 'invalid');
      await user.click(screen.getByRole('button', { name: /create order/i }));
      
      expect(screen.getByText(/invalid postal code format/i)).toBeInTheDocument();
    });

    it('accepts valid postal code format', async () => {
      const user = userEvent.setup();
      renderForm();
      
      await user.type(screen.getByLabelText(/postal code/i), '12345');
      await user.click(screen.getByRole('button', { name: /create order/i }));
      
      expect(screen.queryByText(/invalid postal code format/i)).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('announces errors to screen readers', async () => {
      const user = userEvent.setup();
      renderForm();
      
      await user.click(screen.getByRole('button', { name: /create order/i }));
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('focuses first error field on validation failure', async () => {
      const user = userEvent.setup();
      renderForm();
      
      await user.click(screen.getByRole('button', { name: /create order/i }));
      
      expect(screen.getByLabelText(/customer/i)).toHaveFocus();
    });

    it('sets aria-invalid on fields with errors', async () => {
      const user = userEvent.setup();
      renderForm();
      
      await user.click(screen.getByRole('button', { name: /create order/i }));
      
      expect(screen.getByLabelText(/customer/i)).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('submission', () => {
    it('shows loading state when submitting', () => {
      renderForm({ isSubmitting: true });
      
      expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
    });

    it('disables form fields when submitting', () => {
      renderForm({ isSubmitting: true });
      
      expect(screen.getByLabelText(/customer/i)).toBeDisabled();
    });

    it('shows server errors from actionData', () => {
      const errors = {
        title: 'Validation Error',
        detail: 'Customer not found',
      };
      
      renderForm({ errors });
      
      expect(screen.getByText(/validation error/i)).toBeInTheDocument();
      expect(screen.getByText(/customer not found/i)).toBeInTheDocument();
    });
  });
});
```

**Test Coverage Targets:**

| Component | Target |
|-----------|--------|
| CreateOrderForm | ≥80% |
| CancelOrderDialog | ≥80% |
| OrderFilters | ≥80% |
| EmptyState | 100% |
| ErrorState | 100% |
| LoadingState | 100% |

---

### Day 9: E2E Tests (6h)

#### FE-116: E2E Tests for New Journeys

**Description:** Write Playwright E2E tests for Sprint 2 journeys.

**Code Example:**

```typescript
// e2e/orders/create-order.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Create Order Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="username"]', 'testuser');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/orders');
  });

  test('successfully creates an order', async ({ page }) => {
    // Navigate to create order
    await page.click('a[href="/orders/new"]');
    await expect(page).toHaveURL('/orders/new');
    
    // Fill form
    await page.selectOption('[name="customerId"]', { label: 'Sample Customer' });
    
    // Add items (assuming item selector component)
    await page.click('[data-testid="add-item"]');
    await page.selectOption('[data-testid="item-select-0"]', { label: 'Widget A' });
    await page.fill('[data-testid="item-quantity-0"]', '2');
    
    // Fill shipping address
    await page.fill('[name="street"]', '123 Main St');
    await page.fill('[name="city"]', 'Springfield');
    await page.fill('[name="state"]', 'IL');
    await page.fill('[name="postalCode"]', '62701');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify redirect and success
    await expect(page).toHaveURL('/orders?created=true');
    await expect(page.locator('[role="status"]')).toContainText('Order created');
  });

  test('shows validation errors for empty form', async ({ page }) => {
    await page.goto('/orders/new');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Verify errors shown
    await expect(page.locator('#customerId-error')).toBeVisible();
    await expect(page.locator('#street-error')).toBeVisible();
    
    // Verify still on create page
    await expect(page).toHaveURL('/orders/new');
  });

  test('handles server errors gracefully', async ({ page }) => {
    // Mock server error
    await page.route('**/api/v1/orders', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/problem+json',
        body: JSON.stringify({
          title: 'Internal Server Error',
          status: 500,
        }),
      });
    });

    await page.goto('/orders/new');
    
    // Fill valid form
    await page.selectOption('[name="customerId"]', { index: 1 });
    await page.fill('[name="street"]', '123 Main St');
    await page.fill('[name="city"]', 'Springfield');
    await page.fill('[name="state"]', 'IL');
    await page.fill('[name="postalCode"]', '62701');
    
    await page.click('button[type="submit"]');
    
    // Verify error shown
    await expect(page.locator('[role="alert"]')).toContainText('Internal Server Error');
    
    // Form data preserved
    expect(await page.inputValue('[name="street"]')).toBe('123 Main St');
  });
});

test.describe('Cancel Order Journey', () => {
  test('successfully cancels a pending order', async ({ page }) => {
    // Navigate to a pending order
    await page.goto('/orders/pending-order-123');
    
    // Click cancel
    await page.click('button:has-text("Cancel Order")');
    
    // Confirm in dialog
    await expect(page.locator('dialog')).toBeVisible();
    await page.click('button:has-text("Yes, Cancel Order")');
    
    // Verify cancellation
    await expect(page.locator('[role="status"]')).toContainText('cancelled');
  });

  test('cannot cancel shipped order', async ({ page }) => {
    await page.goto('/orders/shipped-order-456');
    
    // Cancel button should not be visible
    await expect(page.locator('button:has-text("Cancel Order")')).not.toBeVisible();
    
    // Explanation should be shown
    await expect(page.locator('text=cannot be cancelled')).toBeVisible();
  });
});

test.describe('Filter Orders Journey', () => {
  test('filters by status', async ({ page }) => {
    await page.goto('/orders');
    
    // Select status filter
    await page.selectOption('[name="status"]', 'PENDING');
    
    // Verify URL updated
    await expect(page).toHaveURL(/status=PENDING/);
    
    // Verify only pending orders shown
    const orders = page.locator('[data-testid="order-card"]');
    for (const order of await orders.all()) {
      await expect(order.locator('[data-testid="order-status"]')).toContainText('Pending');
    }
  });

  test('filters by date range', async ({ page }) => {
    await page.goto('/orders');
    
    await page.fill('[name="from"]', '2026-01-01');
    await page.fill('[name="to"]', '2026-01-31');
    
    await expect(page).toHaveURL(/from=2026-01-01.*to=2026-01-31/);
  });

  test('clears all filters', async ({ page }) => {
    await page.goto('/orders?status=PENDING&from=2026-01-01');
    
    await page.click('button:has-text("Clear all filters")');
    
    await expect(page).toHaveURL('/orders');
  });

  test('preserves filters on page refresh', async ({ page }) => {
    await page.goto('/orders?status=PENDING&search=ORD-001');
    await page.reload();
    
    await expect(page.locator('[name="status"]')).toHaveValue('PENDING');
    await expect(page.locator('[name="search"]')).toHaveValue('ORD-001');
  });
});
```

---

### Day 10: Demo Prep (FE-117 + Polish)

#### FE-117: Update MSW Handlers

**Description:** Add MSW handlers for new Sprint 2 endpoints.

**Code Example:**

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw';
import { orders, createOrder, cancelOrder, filterOrders } from './data';

export const handlers = [
  // Existing handlers from Sprint 1...
  
  // POST /api/v1/orders - Create Order
  http.post('/api/v1/orders', async ({ request }) => {
    await delay(500);
    
    const body = await request.json() as OrderCreateRequest;
    
    // Validation
    if (!body.customerId) {
      return HttpResponse.json(
        {
          type: 'about:blank',
          title: 'Validation Error',
          status: 400,
          errors: { customerId: ['Customer is required'] },
        },
        { status: 400 }
      );
    }
    
    const newOrder = createOrder(body);
    
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  // DELETE /api/v1/orders/:id - Cancel Order
  http.delete('/api/v1/orders/:id', async ({ params }) => {
    await delay(300);
    
    const { id } = params;
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return HttpResponse.json(
        { type: 'about:blank', title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return HttpResponse.json(
        {
          type: 'about:blank',
          title: 'Conflict',
          status: 409,
          detail: `Order with status ${order.status} cannot be cancelled`,
        },
        { status: 409 }
      );
    }
    
    cancelOrder(id);
    
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/v1/orders with filters
  http.get('/api/v1/orders', async ({ request }) => {
    await delay(400);
    
    const url = new URL(request.url);
    const status = url.searchParams.getAll('status');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const search = url.searchParams.get('search');
    
    const filtered = filterOrders({ status, from, to, search });
    
    return HttpResponse.json({
      data: filtered,
      total: filtered.length,
      page: 1,
      pageSize: 20,
    });
  }),
];
```

---

## Task Summary

| ID | Task | Day | Hours | Status |
|----|------|-----|-------|--------|
| FE-101 | Create Order route | 2 | 6h | ⬜ |
| FE-102 | Form validation | 3 | 4h | ⬜ |
| FE-103 | Submission feedback | 3 | 3h | ⬜ |
| FE-104 | Cancel button | 4 | 2h | ⬜ |
| FE-105 | Cancel dialog | 4 | 3h | ⬜ |
| FE-106 | Cancel action | 4 | 2h | ⬜ |
| FE-107 | Filter controls | 5 | 4h | ⬜ |
| FE-108 | URL filter state | 5 | 2h | ⬜ |
| FE-109 | Search implementation | 5 | 2h | ⬜ |
| FE-110 | EmptyState | 6 | 2h | ⬜ |
| FE-111 | ErrorState | 6 | 2h | ⬜ |
| FE-112 | LoadingState | 6 | 2h | ⬜ |
| FE-113 | Apply state patterns | 6 | 3h | ⬜ |
| FE-114 | Accessibility audit | 7 | 6h | ⬜ |
| FE-115 | Component tests | 8 | 8h | ⬜ |
| FE-116 | E2E tests | 9 | 6h | ⬜ |
| FE-117 | MSW handlers | 10 | 2h | ⬜ |
| **Total** | | | **57h** | |

---

## Copilot Context

```
Sprint 2 Frontend Tasks:
- Focus: Expand features + NFR hardening
- New journeys: Create Order, Cancel Order, Filter/Search
- State patterns: Empty, Error, Loading components
- Accessibility: WCAG 2.1 AA compliance
- Testing: Component tests + E2E tests

Stack: React Router v7, Vitest + RTL, Playwright, MSW
Patterns: Follow Sprint 1 patterns, extend consistently
Coverage target: ≥70%
```
