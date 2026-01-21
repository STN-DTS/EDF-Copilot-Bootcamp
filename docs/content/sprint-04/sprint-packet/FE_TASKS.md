# Sprint 4 — Frontend Tasks

> **Sprint Focus:** Performance optimization, accessibility compliance, documentation, and deployment readiness.

**Total Tasks:** 16  
**Estimated Hours:** ~41 hours  
**Owner:** Frontend Team

---

## Task Summary by Day

| Day | Focus | Tasks | Hours |
|-----|-------|-------|-------|
| 2 | Performance Baseline | Analysis | 4 |
| 3 | Performance Optimization | FE-401, FE-402, FE-403 | 9 |
| 4 | Accessibility | FE-405, FE-406, FE-407, FE-408 | 10 |
| 5 | Performance Verification | FE-404, FE-414 | 5 |
| 6 | Documentation | FE-409, FE-410 | 6 |
| 7 | Runbooks | FE-411 | 2 |
| 8 | Testing | FE-412, FE-415 | 5 |
| 9 | Deployment | FE-413 | 2 |
| 10 | Gate 5 | FE-416 | 2 |

---

## Week 11: Performance + Accessibility (Days 2-5)

### Day 2: Performance Baseline Analysis

Before optimization, establish baseline metrics.

**Baseline Metrics to Capture:**

```bash
# Lighthouse audit
npx lighthouse http://localhost:5173 --output=json --output-path=./perf-baseline.json

# Bundle analysis
npm run build -- --stats
npx webpack-bundle-analyzer dist/stats.json

# Core Web Vitals
# Capture from Chrome DevTools or web-vitals library
```

**Expected Baseline Documentation:**

| Metric | Current | Target |
|--------|---------|--------|
| Lighthouse Performance | | >90 |
| First Contentful Paint | | <1.8s |
| Largest Contentful Paint | | <2.5s |
| Total Blocking Time | | <200ms |
| Cumulative Layout Shift | | <0.1 |
| Initial Bundle Size | | <200KB |

---

### Day 3: Performance Optimization

---

#### FE-401: Bundle Optimization (Code Splitting)

**Story:** US-012 — Performance Optimization  
**Hours:** 4  
**Priority:** P0

**Description:**
Implement route-based code splitting to reduce initial bundle size.

**Acceptance Criteria:**
- [ ] Routes lazy loaded
- [ ] Initial bundle <200KB
- [ ] Loading states shown during chunk load
- [ ] No visible delay for cached chunks

**Code Example:**

```typescript
// src/routes/__root.tsx

import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';
import { PageLoadingSpinner } from '@/components/ui/PageLoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="container mx-auto py-6">
          <Suspense fallback={<PageLoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
```

```typescript
// src/routes/orders/index.lazy.tsx
// Route files with .lazy.tsx are automatically code-split

import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/orders/')({
  component: OrderListPage,
});

function OrderListPage() {
  // Component implementation
}
```

```typescript
// vite.config.ts - Manual chunk splitting

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['@tanstack/react-router'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          
          // Feature chunks (if needed)
          'feature-orders': [
            './src/routes/orders/index.lazy.tsx',
            './src/routes/orders/$orderId.lazy.tsx',
          ],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 250,
  },
});
```

**Verification:**
```bash
# Build and analyze
npm run build
npx vite-bundle-visualizer

# Check chunk sizes
ls -la dist/assets/*.js | awk '{print $5, $9}' | sort -n
```

---

#### FE-402: Image Optimization

**Story:** US-012 — Performance Optimization  
**Hours:** 2  
**Priority:** P1

**Description:**
Optimize images with modern formats, lazy loading, and proper sizing.

**Code Example:**

```typescript
// src/components/ui/OptimizedImage.tsx

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <picture>
      {/* WebP for modern browsers */}
      <source
        srcSet={`${src}?format=webp&w=${width} 1x, ${src}?format=webp&w=${width * 2} 2x`}
        type="image/webp"
      />
      {/* Fallback */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={className}
        // Prevent layout shift
        style={{ aspectRatio: `${width}/${height}` }}
      />
    </picture>
  );
}
```

```typescript
// src/components/ui/LazyImage.tsx
// For images below the fold

import { useEffect, useRef, useState } from 'react';

export function LazyImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      data-src={src}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      {...props}
    />
  );
}
```

---

#### FE-403: React Performance Optimization

**Story:** US-012 — Performance Optimization  
**Hours:** 3  
**Priority:** P1

**Description:**
Optimize React components with memoization and proper state management.

**Code Example:**

```typescript
// src/components/orders/OrderList.tsx
// Optimized list rendering

import { memo, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface OrderListProps {
  orders: Order[];
  onSelectOrder: (id: string) => void;
}

export const OrderList = memo(function OrderList({
  orders,
  onSelectOrder,
}: OrderListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualize large lists
  const virtualizer = useVirtualizer({
    count: orders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Row height
    overscan: 5,
  });

  // Memoize expensive computations
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders]);

  // Memoize callbacks passed to children
  const handleSelect = useCallback((id: string) => {
    onSelectOrder(id);
  }, [onSelectOrder]);

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
      role="list"
      aria-label="Order list"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <OrderRow
            key={sortedOrders[virtualRow.index].id}
            order={sortedOrders[virtualRow.index]}
            onSelect={handleSelect}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

// Memoized row component
const OrderRow = memo(function OrderRow({
  order,
  onSelect,
  style,
}: {
  order: Order;
  onSelect: (id: string) => void;
  style: React.CSSProperties;
}) {
  return (
    <div
      role="listitem"
      style={style}
      className="border-b p-4 hover:bg-muted cursor-pointer"
      onClick={() => onSelect(order.id)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(order.id)}
      tabIndex={0}
    >
      <div className="flex justify-between">
        <span className="font-medium">{order.id}</span>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="text-sm text-muted-foreground">
        {order.customerName} • {formatDate(order.createdAt)}
      </div>
    </div>
  );
});
```

```typescript
// src/hooks/useDebounce.ts
// Debounce for search/filter inputs

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage in search component
function OrderSearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  // Only query when debounced value changes
  const { data } = useQuery({
    queryKey: ['orders', { search: debouncedSearch }],
    queryFn: () => fetchOrders({ search: debouncedSearch }),
    enabled: debouncedSearch.length >= 2,
  });
}
```

---

### Day 4: Accessibility Compliance

---

#### FE-405: Keyboard Navigation

**Story:** US-013 — Accessibility Compliance  
**Hours:** 3  
**Priority:** P0

**Description:**
Ensure all interactive elements are keyboard accessible with proper focus management.

**Acceptance Criteria:**
- [ ] All interactive elements reachable via Tab
- [ ] Logical tab order maintained
- [ ] Custom components have proper keyboard handlers
- [ ] Skip links provided for navigation

**Code Example:**

```typescript
// src/components/ui/SkipLink.tsx

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        focus:absolute focus:top-4 focus:left-4
        focus:z-50 focus:px-4 focus:py-2
        focus:bg-primary focus:text-primary-foreground
        focus:rounded focus:outline-none focus:ring-2
      "
    >
      Skip to main content
    </a>
  );
}

// Usage in root layout
function RootLayout() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}
```

```typescript
// src/components/ui/FocusTrap.tsx
// For modals and dialogs

import { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export function FocusTrap({ children, active = true }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return <div ref={containerRef}>{children}</div>;
}
```

```typescript
// src/hooks/useArrowNavigation.ts
// For list navigation with arrow keys

import { useCallback, useState } from 'react';

export function useArrowNavigation<T>(items: T[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(items.length - 1);
          break;
      }
    },
    [items.length]
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    activeItem: items[activeIndex],
  };
}
```

---

#### FE-406: ARIA Labels and Roles

**Story:** US-013 — Accessibility Compliance  
**Hours:** 3  
**Priority:** P0

**Description:**
Add proper ARIA attributes to all custom components.

**Code Example:**

```typescript
// src/components/ui/Combobox.tsx
// Accessible combobox with ARIA

interface ComboboxProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { activeIndex, handleKeyDown } = useArrowNavigation(options);
  const listboxId = `${id}-listbox`;

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <label id={`${id}-label`} htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
        aria-autocomplete="list"
        aria-labelledby={`${id}-label`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary"
      />

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-muted-foreground">No results found</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={value === option.value}
                className={`px-3 py-2 cursor-pointer ${
                  index === activeIndex ? 'bg-primary/10' : ''
                } ${value === option.value ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setSearch(option.label);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
```

```typescript
// src/components/ui/DataTable.tsx
// Accessible data table

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  caption: string;
  onSort?: (column: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export function DataTable<T>({
  data,
  columns,
  caption,
  onSort,
  sortColumn,
  sortDirection,
}: DataTableProps<T>) {
  return (
    <div role="region" aria-labelledby="table-caption" tabIndex={0}>
      <table className="w-full border-collapse">
        <caption id="table-caption" className="sr-only">
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                aria-sort={
                  sortColumn === column.id
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
                className="px-4 py-2 text-left border-b"
              >
                {column.sortable ? (
                  <button
                    onClick={() => onSort?.(column.id)}
                    className="flex items-center gap-1 hover:text-primary"
                    aria-label={`Sort by ${column.header}`}
                  >
                    {column.header}
                    <SortIcon
                      active={sortColumn === column.id}
                      direction={sortDirection}
                    />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.id} className="px-4 py-2 border-b">
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

#### FE-407: Focus Management

**Story:** US-013 — Accessibility Compliance  
**Hours:** 2  
**Priority:** P0

**Description:**
Manage focus properly for dynamic content and route changes.

**Code Example:**

```typescript
// src/hooks/useFocusOnMount.ts

import { useEffect, useRef } from 'react';

export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      ref.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return ref;
}

// Usage
function OrderDetailPage() {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div>
      <h1 ref={headingRef} tabIndex={-1}>
        Order Details
      </h1>
      {/* Content */}
    </div>
  );
}
```

```typescript
// src/components/ui/LiveRegion.tsx
// Announce dynamic content to screen readers

import { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      // Clear first to ensure re-announcement
      setAnnouncement('');
      requestAnimationFrame(() => {
        setAnnouncement(message);
      });
    }
  }, [message]);

  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

// Usage with loading states
function OrderList() {
  const { data, isLoading } = useOrders();
  
  return (
    <>
      <LiveRegion 
        message={isLoading ? 'Loading orders...' : `${data?.length ?? 0} orders loaded`}
      />
      {/* List content */}
    </>
  );
}
```

---

#### FE-408: Color Contrast Fixes

**Story:** US-013 — Accessibility Compliance  
**Hours:** 2  
**Priority:** P0

**Description:**
Ensure all text and UI components meet WCAG 2.1 AA contrast requirements.

**Code Example:**

```css
/* src/styles/accessibility.css */

:root {
  /* 
   * Color contrast compliant palette
   * Text on background: 4.5:1 minimum
   * Large text/UI: 3:1 minimum
   */
  
  /* Primary - passes 4.5:1 on white */
  --color-primary: #1d4ed8; /* 7.2:1 on white */
  --color-primary-foreground: #ffffff;
  
  /* Destructive - passes 4.5:1 on white */
  --color-destructive: #b91c1c; /* 5.9:1 on white */
  --color-destructive-foreground: #ffffff;
  
  /* Muted text - passes 4.5:1 on white */
  --color-muted-foreground: #525252; /* 7.0:1 on white */
  
  /* Links - passes 4.5:1 and distinguishable */
  --color-link: #1d4ed8;
  --color-link-visited: #6b21a8;
  
  /* Focus ring - high contrast */
  --color-focus-ring: #1d4ed8;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-primary: #0000ee;
    --color-destructive: #cc0000;
    --color-muted-foreground: #333333;
  }
}

/* Focus indicators - always visible */
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Error states - don't rely on color alone */
.error-message {
  color: var(--color-destructive);
}

.error-message::before {
  content: "⚠ ";
}

/* Status badges - include patterns */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.status-badge--success::before {
  content: "✓ ";
}

.status-badge--error::before {
  content: "✕ ";
}

.status-badge--pending::before {
  content: "◷ ";
}
```

```typescript
// src/components/ui/StatusBadge.tsx
// Accessible status indicators

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: '◷',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  confirmed: {
    label: 'Confirmed',
    icon: '✓',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  shipped: {
    label: 'Shipped',
    icon: '→',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  cancelled: {
    label: 'Cancelled',
    icon: '✕',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
} as const;

export function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status];
  
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-sm font-medium ${config.className}`}
      // Don't rely on color alone - include icon
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
```

---

### Day 5: Performance Verification

---

#### FE-404: Core Web Vitals Optimization

**Story:** US-012 — Performance Optimization  
**Hours:** 3  
**Priority:** P0

**Description:**
Optimize for Core Web Vitals (LCP, FID, CLS).

**Code Example:**

```typescript
// src/lib/web-vitals.ts

import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

function sendToAnalytics(metric: { name: string; value: number; id: string }) {
  // Send to your analytics endpoint
  console.log(`[Web Vital] ${metric.name}: ${metric.value.toFixed(2)}`);
  
  // Example: Send to monitoring
  if (import.meta.env.PROD) {
    fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        id: metric.id,
      }),
    });
  }
}
```

```typescript
// src/components/layout/Header.tsx
// Prevent CLS with fixed height

export function Header() {
  return (
    <header 
      className="h-16 border-b bg-background"
      // Fixed height prevents layout shift
    >
      <nav className="container h-full flex items-center justify-between">
        <Logo />
        <Navigation />
        <UserMenu />
      </nav>
    </header>
  );
}
```

---

#### FE-414: Performance Test Automation

**Story:** US-012 — Performance Optimization  
**Hours:** 2  
**Priority:** P1

**Description:**
Automate performance testing in CI/CD pipeline.

**Code Example:**

```typescript
// lighthouse.config.ts

export default {
  ci: {
    collect: {
      url: ['http://localhost:5173/', 'http://localhost:5173/orders'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

```yaml
# .github/workflows/lighthouse.yml

name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm run preview &
      - name: Wait for server
        run: npx wait-on http://localhost:5173
      - name: Run Lighthouse
        run: npx lhci autorun
```

---

## Week 12: Documentation + Deployment (Days 6-10)

### Day 6: Documentation

---

#### FE-409: User Guide Creation

**Story:** US-014 — Complete Documentation  
**Hours:** 4  
**Priority:** P0

**Description:**
Create comprehensive user documentation for all features.

**Documentation Template:**

```markdown
# Order Management - User Guide

## Getting Started

### First Login
1. Navigate to the application URL
2. Click "Sign In" 
3. Enter your credentials
4. You'll be directed to the Orders list

### Navigation
- **Orders**: View and manage orders
- **Create Order**: Create a new order
- **Profile**: View your profile settings

## Working with Orders

### Viewing Orders
1. Navigate to Orders from the main menu
2. Use the search bar to find specific orders
3. Click column headers to sort
4. Use filters to narrow results

### Creating an Order
1. Click "Create Order" button
2. Select a customer from the dropdown
3. Add items to the order
4. Review the total
5. Click "Submit Order"

### Cancelling an Order
1. Open the order you want to cancel
2. Click "Cancel Order"
3. Confirm the cancellation
4. Note: Only pending orders can be cancelled

## Troubleshooting

### Common Issues

**Q: I can't find my order**
A: Try using the search feature or check your date filters.

**Q: The page is loading slowly**
A: Check your internet connection. If the issue persists, contact support.

**Q: I get an error when creating an order**
A: Ensure all required fields are filled. Check that items are in stock.
```

---

#### FE-410: Component Documentation

**Story:** US-014 — Complete Documentation  
**Hours:** 2  
**Priority:** P1

**Description:**
Document component usage for developers.

**Storybook Example:**

```typescript
// src/components/ui/Button.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Primary action button with multiple variants.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Saving...',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <PlusIcon className="w-4 h-4 mr-2" />
        Add Item
      </>
    ),
  },
};
```

---

### Day 7-10: Remaining Tasks

The remaining tasks (FE-411 through FE-416) follow similar patterns:

- **FE-411**: Frontend deployment runbook (Markdown documentation)
- **FE-412**: E2E test coverage (Playwright tests)
- **FE-413**: Staging deployment verification (deployment checklist)
- **FE-415**: Accessibility test automation (axe-core in CI)
- **FE-416**: Gate 5 preparation (evidence gathering)

---

## Verification Commands

```bash
# Performance
npm run build
npx vite-bundle-visualizer
npx lighthouse http://localhost:5173 --view

# Accessibility
npx axe-core http://localhost:5173
npm run test:a11y

# All tests
npm run test
npm run test:e2e

# Documentation
npm run storybook
```

---

## Key References

| Resource | Location |
|----------|----------|
| Sprint 4 Program | [../SPRINT_4_PROGRAM.md](../SPRINT_4_PROGRAM.md) |
| Sprint Packet | [SPRINT_PACKET.md](SPRINT_PACKET.md) |
| BE Tasks | [BE_TASKS.md](BE_TASKS.md) |
| Ship-Ready Checklist | [SHIP_READY_CHECKLIST.md](SHIP_READY_CHECKLIST.md) |
| Frontend Instructions | [../../../.github/instructions/frontend.instructions.md](../../../.github/instructions/frontend.instructions.md) |
