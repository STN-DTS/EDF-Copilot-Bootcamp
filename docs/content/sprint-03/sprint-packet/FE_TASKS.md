# Sprint 3 — Frontend Tasks

> **Sprint Focus:** Security hardening, authorization, and audit logging on the frontend.

**Total Tasks:** 24  
**Estimated Hours:** ~56 hours  
**Owner:** Frontend Team

---

## Task Summary by Day

| Day | Focus | Tasks | Hours |
|-----|-------|-------|-------|
| 2 | Authentication Hardening | FE-301, FE-302, FE-303 | 7 |
| 3 | Authorization | FE-304, FE-305, FE-306 | 7 |
| 4 | Input Validation | FE-307, FE-308, FE-309 | 7 |
| 5 | CSRF + Security Headers | FE-310, FE-311, FE-312 | 7 |
| 6 | Audit Logging | FE-313, FE-314, FE-315 | 7 |
| 7 | Edge Case Handling | FE-316, FE-317, FE-318 | 7 |
| 8 | Security Unit Tests | FE-319, FE-320, FE-321 | 8 |
| 9 | E2E Security Tests | FE-322, FE-323, FE-324 | 8 |

---

## Week 9: Security Implementation

### Day 2: Authentication Hardening

---

#### FE-301: Auth Token Refresh Mechanism

**Story:** US-008 — Secure Authentication Flow  
**Hours:** 3  
**Priority:** P0

**Description:**
Implement automatic token refresh to prevent session expiration during active use.

**Acceptance Criteria:**
- [ ] Refresh token 5 minutes before expiration
- [ ] Queue requests during refresh
- [ ] Retry failed requests after refresh
- [ ] Handle refresh failure (redirect to login)
- [ ] No token exposure in logs or errors

**Code Example:**

```typescript
// src/lib/auth/tokenManager.ts

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class TokenManager {
  private tokenPair: TokenPair | null = null;
  private refreshPromise: Promise<TokenPair> | null = null;
  private readonly REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

  async getAccessToken(): Promise<string> {
    if (!this.tokenPair) {
      throw new AuthenticationRequiredError();
    }

    // Check if token needs refresh
    if (this.shouldRefresh()) {
      await this.refreshTokens();
    }

    return this.tokenPair.accessToken;
  }

  private shouldRefresh(): boolean {
    if (!this.tokenPair) return false;
    const now = Date.now();
    return this.tokenPair.expiresAt - now < this.REFRESH_BUFFER_MS;
  }

  async refreshTokens(): Promise<TokenPair> {
    // Prevent concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    
    try {
      const newTokens = await this.refreshPromise;
      this.tokenPair = newTokens;
      return newTokens;
    } catch (error) {
      this.clearTokens();
      throw new SessionExpiredError();
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<TokenPair> {
    if (!this.tokenPair?.refreshToken) {
      throw new AuthenticationRequiredError();
    }

    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: this.tokenPair.refreshToken,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new TokenRefreshError(response.status);
    }

    const data = await response.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + (data.expiresIn * 1000),
    };
  }

  setTokens(tokens: TokenPair): void {
    this.tokenPair = tokens;
  }

  clearTokens(): void {
    this.tokenPair = null;
  }

  isAuthenticated(): boolean {
    return this.tokenPair !== null && !this.isExpired();
  }

  private isExpired(): boolean {
    if (!this.tokenPair) return true;
    return Date.now() >= this.tokenPair.expiresAt;
  }
}

export const tokenManager = new TokenManager();
```

**Copilot Prompt:**

```markdown
## P3-TOKEN-REFRESH

No secrets, no production data. Use placeholders.

Create a token refresh mechanism for React that:
1. Automatically refreshes before expiration
2. Prevents concurrent refresh requests
3. Queues pending requests during refresh
4. Handles refresh failures gracefully
5. Clears tokens on failure

Follow the auth patterns in @workspace
Include error handling for network failures
```

**Verification:**
```bash
npm test -- --grep "token refresh"
```

---

#### FE-302: Secure Token Storage

**Story:** US-008 — Secure Authentication Flow  
**Hours:** 2  
**Priority:** P0

**Description:**
Store tokens securely using appropriate browser storage mechanisms.

**Acceptance Criteria:**
- [ ] Access token in memory only (not localStorage)
- [ ] Refresh token in HttpOnly cookie (set by server)
- [ ] No tokens in URL or query params
- [ ] Clear all token traces on logout
- [ ] Handle private browsing mode

**Code Example:**

```typescript
// src/lib/auth/secureStorage.ts

/**
 * Secure storage for authentication tokens.
 * 
 * Security rules:
 * - Access tokens stored in memory only
 * - Refresh tokens handled via HttpOnly cookies (server-side)
 * - Never use localStorage for tokens
 * - Never expose tokens in URLs
 */
class SecureStorage {
  private memoryStore: Map<string, string> = new Map();

  /**
   * Store a value in memory (survives page navigation, cleared on tab close).
   */
  setSecure(key: string, value: string): void {
    this.memoryStore.set(key, value);
  }

  /**
   * Retrieve a value from memory.
   */
  getSecure(key: string): string | null {
    return this.memoryStore.get(key) ?? null;
  }

  /**
   * Remove a value from memory.
   */
  removeSecure(key: string): void {
    this.memoryStore.delete(key);
  }

  /**
   * Clear all stored values.
   */
  clearAll(): void {
    this.memoryStore.clear();
  }

  /**
   * Check if storage is available (handles private browsing).
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

export const secureStorage = new SecureStorage();

// Usage in token manager
export function storeAccessToken(token: string): void {
  // NEVER use localStorage for tokens
  // secureStorage.setSecure('accessToken', token);
  
  // Better: keep in memory only
  tokenManager.setAccessToken(token);
}

// Anti-pattern warning
function NEVER_DO_THIS(): void {
  // ❌ NEVER store tokens in localStorage
  // localStorage.setItem('accessToken', token);
  
  // ❌ NEVER put tokens in URLs
  // window.location.href = `/api?token=${token}`;
  
  // ❌ NEVER log tokens
  // console.log('Token:', token);
}
```

**Verification:**
```bash
# Check for token leakage
grep -r "localStorage.*token" src/
grep -r "token.*=" src/ | grep -v "test\|spec"
```

---

#### FE-303: Logout + Session Clear

**Story:** US-008 — Secure Authentication Flow  
**Hours:** 2  
**Priority:** P0

**Description:**
Implement comprehensive logout that clears all session data.

**Acceptance Criteria:**
- [ ] Clear all memory tokens
- [ ] Call server logout endpoint
- [ ] Clear any cached data
- [ ] Redirect to login page
- [ ] Handle logout failures gracefully
- [ ] Log logout event

**Code Example:**

```typescript
// src/lib/auth/logout.ts

import { tokenManager } from './tokenManager';
import { secureStorage } from './secureStorage';
import { auditLogger } from '../logging/auditLogger';
import { queryClient } from '../queryClient';

interface LogoutOptions {
  reason?: 'user_initiated' | 'session_expired' | 'security_event';
  redirectTo?: string;
}

export async function logout(options: LogoutOptions = {}): Promise<void> {
  const { reason = 'user_initiated', redirectTo = '/login' } = options;

  try {
    // Log the logout attempt
    auditLogger.log({
      action: 'LOGOUT',
      reason,
    });

    // Call server to invalidate refresh token
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {
      // Server logout failed, but continue with client cleanup
      console.warn('Server logout failed, clearing local state');
    });

  } finally {
    // Always clear client state, even if server call fails
    clearAllSessionData();
    
    // Redirect to login
    window.location.href = redirectTo;
  }
}

function clearAllSessionData(): void {
  // Clear token manager
  tokenManager.clearTokens();
  
  // Clear secure storage
  secureStorage.clearAll();
  
  // Clear React Query cache
  queryClient.clear();
  
  // Clear any other cached data
  sessionStorage.clear();
  
  // Note: We don't clear localStorage as it shouldn't contain sensitive data
}

// Hook for components
export function useLogout() {
  const navigate = useNavigate();

  return async (options?: LogoutOptions) => {
    await logout(options);
  };
}

// Logout button component
export function LogoutButton() {
  const handleLogout = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onClick = async () => {
    setIsLoggingOut(true);
    try {
      await handleLogout({ reason: 'user_initiated' });
    } catch (error) {
      // Logout should always succeed on client side
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoggingOut}
      aria-label="Log out of your account"
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

---

### Day 3: Authorization

---

#### FE-304: Role-Based UI Rendering

**Story:** US-009 — Authorization Verification  
**Hours:** 3  
**Priority:** P0

**Description:**
Render UI elements based on user roles and permissions.

**Acceptance Criteria:**
- [ ] Hide actions user cannot perform
- [ ] Disable buttons for unauthorized actions
- [ ] Show appropriate messaging for restricted features
- [ ] Admin sees all controls
- [ ] Regular user sees limited controls

**Code Example:**

```typescript
// src/lib/auth/permissions.ts

export type Permission = 
  | 'order:read'
  | 'order:create'
  | 'order:cancel'
  | 'order:cancel_any'  // Admin only
  | 'order:view_all'    // Admin only
  | 'admin:access';

export type Role = 'user' | 'admin' | 'viewer';

const rolePermissions: Record<Role, Permission[]> = {
  viewer: ['order:read'],
  user: ['order:read', 'order:create', 'order:cancel'],
  admin: [
    'order:read',
    'order:create',
    'order:cancel',
    'order:cancel_any',
    'order:view_all',
    'admin:access',
  ],
};

export function hasPermission(
  userRoles: Role[],
  requiredPermission: Permission
): boolean {
  return userRoles.some(role => 
    rolePermissions[role]?.includes(requiredPermission)
  );
}

export function hasAnyPermission(
  userRoles: Role[],
  permissions: Permission[]
): boolean {
  return permissions.some(p => hasPermission(userRoles, p));
}
```

```tsx
// src/components/auth/PermissionGate.tsx

import { useAuth } from '../../lib/auth/authContext';
import { hasPermission, Permission } from '../../lib/auth/permissions';

interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { user } = useAuth();
  
  if (!user) {
    return <>{fallback}</>;
  }
  
  const allowed = hasPermission(user.roles, permission);
  
  return <>{allowed ? children : fallback}</>;
}

// Usage example
function OrderActions({ order }: { order: Order }) {
  const { user } = useAuth();
  const isOwner = order.createdBy === user?.username;
  
  return (
    <div className="order-actions">
      {/* Anyone with read permission can view */}
      <PermissionGate permission="order:read">
        <ViewOrderButton orderId={order.id} />
      </PermissionGate>
      
      {/* Owner or admin can cancel */}
      <PermissionGate 
        permission={isOwner ? 'order:cancel' : 'order:cancel_any'}
        fallback={
          <span className="text-muted">
            You cannot cancel this order
          </span>
        }
      >
        <CancelOrderButton 
          orderId={order.id} 
          disabled={!order.status.isCancellable}
        />
      </PermissionGate>
    </div>
  );
}
```

---

#### FE-305: Protected Route Guards

**Story:** US-009 — Authorization Verification  
**Hours:** 2  
**Priority:** P0

**Description:**
Protect routes from unauthorized access with role-based guards.

**Acceptance Criteria:**
- [ ] Unauthenticated users redirected to login
- [ ] Unauthorized users see 403 page
- [ ] Return URL preserved for post-login redirect
- [ ] Admin routes protected
- [ ] Guard checks on every navigation

**Code Example:**

```tsx
// src/components/auth/ProtectedRoute.tsx

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth/authContext';
import { hasPermission, Permission } from '../../lib/auth/permissions';
import { PermissionDenied } from '../errors/PermissionDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return <div aria-busy="true">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (requireAuth && !user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  // Check permission if required
  if (requiredPermission && user) {
    if (!hasPermission(user.roles, requiredPermission)) {
      return <PermissionDenied 
        message="You don't have permission to access this page."
        requiredPermission={requiredPermission}
      />;
    }
  }

  return <>{children}</>;
}

// Route configuration
// src/routes/index.tsx

import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute requiredPermission="order:read">
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/new',
    element: (
      <ProtectedRoute requiredPermission="order:create">
        <CreateOrderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredPermission="admin:access">
        <AdminPage />
      </ProtectedRoute>
    ),
  },
];
```

---

#### FE-306: Permission Error Handling

**Story:** US-009 — Authorization Verification  
**Hours:** 2  
**Priority:** P0

**Description:**
Handle 403 Forbidden errors gracefully throughout the application.

**Code Example:**

```tsx
// src/components/errors/PermissionDenied.tsx

interface PermissionDeniedProps {
  message?: string;
  requiredPermission?: string;
  onBack?: () => void;
}

export function PermissionDenied({
  message = "You don't have permission to perform this action.",
  requiredPermission,
  onBack,
}: PermissionDeniedProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div 
      className="permission-denied"
      role="alert"
      aria-live="polite"
    >
      <div className="permission-denied__icon">
        <ShieldExclamationIcon aria-hidden="true" />
      </div>
      
      <h1 className="permission-denied__title">
        Access Denied
      </h1>
      
      <p className="permission-denied__message">
        {message}
      </p>
      
      {requiredPermission && (
        <p className="permission-denied__detail">
          Required permission: <code>{requiredPermission}</code>
        </p>
      )}
      
      <div className="permission-denied__actions">
        <button onClick={handleBack}>
          Go Back
        </button>
        <Link to="/orders">
          Go to Orders
        </Link>
      </div>
    </div>
  );
}

// API error handling for 403
// src/lib/api/errorHandler.ts

export function handleApiError(error: ApiError): never {
  if (error.status === 401) {
    // Redirect to login
    logout({ reason: 'session_expired' });
    throw new AuthenticationRequiredError();
  }
  
  if (error.status === 403) {
    // Log the forbidden access attempt
    auditLogger.log({
      action: 'ACCESS_DENIED',
      resource: error.url,
      reason: error.message,
    });
    
    throw new PermissionDeniedError(error.message);
  }
  
  throw error;
}
```

---

### Day 4: Input Validation

---

#### FE-307: Input Sanitization Utilities

**Story:** US-010 — Input Validation Complete  
**Hours:** 3  
**Priority:** P0

**Description:**
Create utilities to sanitize user input before submission.

**Code Example:**

```typescript
// src/lib/security/sanitize.ts

import DOMPurify from 'dompurify';

/**
 * Sanitize string input to prevent XSS.
 * Use for any user-provided text that might be rendered.
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  // Remove any HTML tags and encode entities
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML allowed
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize HTML content (for rich text fields).
 * Only allows safe subset of HTML.
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize URL to prevent javascript: protocol attacks.
 */
export function sanitizeUrl(input: string): string {
  if (!input) return '';
  
  try {
    const url = new URL(input);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      console.warn('Blocked unsafe URL protocol:', url.protocol);
      return '';
    }
    
    return url.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize object by applying sanitization to all string values.
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T
): T {
  const result = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key as keyof T] = sanitizeString(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      result[key as keyof T] = sanitizeObject(value as Record<string, unknown>) as T[keyof T];
    } else {
      result[key as keyof T] = value as T[keyof T];
    }
  }
  
  return result;
}

// Validation patterns
export const patterns = {
  // No script tags or event handlers
  noScript: /^(?!.*<script)(?!.*javascript:)(?!.*on\w+=).*/i,
  
  // Alphanumeric with limited special chars
  safeText: /^[a-zA-Z0-9\s.,!?'-]*$/,
  
  // External reference format
  externalRef: /^[A-Z0-9-]{0,20}$/,
  
  // Order ID format
  orderId: /^[0-9]+$/,
};
```

---

#### FE-308: Form Validation Hardening

**Story:** US-010 — Input Validation Complete  
**Hours:** 3  
**Priority:** P0

**Description:**
Harden all form validations with security-focused rules.

**Code Example:**

```typescript
// src/lib/validation/orderValidation.ts

import { z } from 'zod';
import { sanitizeString, patterns } from '../security/sanitize';

// Maximum lengths to prevent abuse
const MAX_NOTES_LENGTH = 500;
const MAX_ITEMS_PER_ORDER = 50;
const MAX_QUANTITY_PER_ITEM = 9999;

export const orderItemSchema = z.object({
  itemId: z.number()
    .int('Item ID must be a whole number')
    .positive('Item ID must be positive'),
  
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(MAX_QUANTITY_PER_ITEM, `Quantity cannot exceed ${MAX_QUANTITY_PER_ITEM}`),
  
  unitPrice: z.number()
    .min(0, 'Price cannot be negative')
    .max(999999.99, 'Price exceeds maximum'),
});

export const createOrderSchema = z.object({
  customerId: z.number()
    .int('Customer ID must be a whole number')
    .positive('Customer ID must be positive'),
  
  items: z.array(orderItemSchema)
    .min(1, 'At least one item is required')
    .max(MAX_ITEMS_PER_ORDER, `Maximum ${MAX_ITEMS_PER_ORDER} items per order`),
  
  notes: z.string()
    .max(MAX_NOTES_LENGTH, `Notes cannot exceed ${MAX_NOTES_LENGTH} characters`)
    .refine(
      (val) => patterns.noScript.test(val),
      'Notes contain invalid characters'
    )
    .transform(sanitizeString)
    .optional(),
  
  externalReference: z.string()
    .regex(
      patterns.externalRef,
      'External reference must be alphanumeric with dashes, max 20 chars'
    )
    .optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Form component with validation
export function CreateOrderForm() {
  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      items: [{ itemId: 0, quantity: 1, unitPrice: 0 }],
      notes: '',
    },
  });

  const onSubmit = async (data: CreateOrderInput) => {
    // Data is already validated and sanitized by zod
    await createOrder(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {/* Form fields */}
      
      <div className="form-field">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          {...form.register('notes')}
          maxLength={MAX_NOTES_LENGTH}
          aria-describedby="notes-error notes-hint"
        />
        <span id="notes-hint" className="hint">
          {form.watch('notes')?.length ?? 0}/{MAX_NOTES_LENGTH}
        </span>
        {form.formState.errors.notes && (
          <span id="notes-error" className="error" role="alert">
            {form.formState.errors.notes.message}
          </span>
        )}
      </div>
      
      <button type="submit" disabled={form.formState.isSubmitting}>
        Create Order
      </button>
    </form>
  );
}
```

---

#### FE-309: CSP Header Configuration

**Story:** US-010 — Input Validation Complete  
**Hours:** 1  
**Priority:** P1

**Description:**
Verify and configure Content Security Policy headers.

**Code Example:**

```typescript
// src/lib/security/cspVerifier.ts

/**
 * Verify CSP headers are properly configured.
 * This runs on app initialization to catch misconfigurations.
 */
export function verifyCspHeaders(): void {
  // Only verify in development/staging
  if (import.meta.env.PROD && !import.meta.env.VITE_VERIFY_CSP) {
    return;
  }

  // Check if CSP header is present
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  
  if (!cspMeta) {
    console.warn(
      '[Security] No CSP meta tag found. ' +
      'Ensure CSP is set via HTTP headers in production.'
    );
    return;
  }

  const policy = cspMeta.getAttribute('content');
  
  if (!policy) {
    console.error('[Security] CSP meta tag has no content');
    return;
  }

  // Verify required directives
  const requiredDirectives = [
    'default-src',
    'script-src',
    'style-src',
    'img-src',
    'connect-src',
  ];

  const missingDirectives = requiredDirectives.filter(
    dir => !policy.includes(dir)
  );

  if (missingDirectives.length > 0) {
    console.warn(
      '[Security] Missing CSP directives:',
      missingDirectives.join(', ')
    );
  }

  // Check for unsafe patterns
  const unsafePatterns = [
    "'unsafe-eval'",
    "'unsafe-inline'" // for scripts, okay for styles
  ];

  const foundUnsafe = unsafePatterns.filter(
    pattern => policy.includes(`script-src ${pattern}`) ||
               policy.includes(`default-src ${pattern}`)
  );

  if (foundUnsafe.length > 0) {
    console.error(
      '[Security] Unsafe CSP patterns detected:',
      foundUnsafe.join(', ')
    );
  }
}

// Vite config for CSP (development)
// vite.config.ts
export default defineConfig({
  plugins: [
    // ... other plugins
  ],
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'", // Needed for styled-components
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.example.com",
        "font-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
      ].join('; '),
    },
  },
});
```

---

### Day 5: CSRF + Security Headers

---

#### FE-310: CSRF Token Handling

**Story:** Security Infrastructure  
**Hours:** 3  
**Priority:** P0

**Description:**
Implement CSRF token handling for all mutation requests.

**Code Example:**

```typescript
// src/lib/security/csrfToken.ts

const CSRF_HEADER_NAME = 'X-CSRF-TOKEN';
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';

/**
 * Get CSRF token from cookie.
 * The server sets this as a non-HttpOnly cookie so JS can read it.
 */
export function getCsrfToken(): string | null {
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}

/**
 * Add CSRF token to fetch request headers.
 */
export function addCsrfToken(headers: Headers): Headers {
  const token = getCsrfToken();
  
  if (token) {
    headers.set(CSRF_HEADER_NAME, token);
  } else {
    console.warn('[Security] CSRF token not found in cookies');
  }
  
  return headers;
}

/**
 * Enhanced fetch that automatically adds CSRF token for mutations.
 */
export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = options.method?.toUpperCase() ?? 'GET';
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
  
  const headers = new Headers(options.headers);
  
  // Always include credentials for cookie-based auth
  const credentials = options.credentials ?? 'include';
  
  // Add CSRF token for mutations
  if (isMutation) {
    addCsrfToken(headers);
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials,
  });
}

// React Query mutation wrapper
export function useSecureMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  return useMutation({
    ...options,
    mutationFn: async (variables) => {
      // Verify CSRF token exists before mutation
      const token = getCsrfToken();
      if (!token) {
        throw new SecurityError('CSRF token missing. Please refresh the page.');
      }
      return mutationFn(variables);
    },
  });
}
```

---

#### FE-311: Secure Cookie Settings

**Story:** Security Infrastructure  
**Hours:** 2  
**Priority:** P0

**Description:**
Verify and configure secure cookie settings.

**Code Example:**

```typescript
// src/lib/security/cookieConfig.ts

/**
 * Verify cookie security settings.
 * Run on app initialization.
 */
export function verifyCookieSecurity(): void {
  if (import.meta.env.DEV) {
    console.info('[Security] Skipping cookie security check in development');
    return;
  }

  // Check if we're on HTTPS
  if (location.protocol !== 'https:') {
    console.error(
      '[Security] Application not served over HTTPS. ' +
      'Secure cookies will not work.'
    );
  }

  // Verify SameSite behavior
  testCookieSettings();
}

function testCookieSettings(): void {
  // Set a test cookie
  const testName = '__cookie_test__';
  const testValue = 'test';
  
  document.cookie = `${testName}=${testValue}; SameSite=Strict; Secure`;
  
  // Try to read it back
  const cookies = document.cookie.split(';');
  const found = cookies.some(c => c.trim().startsWith(`${testName}=`));
  
  if (!found && location.protocol === 'https:') {
    console.warn(
      '[Security] Unable to set secure cookies. ' +
      'Check browser settings.'
    );
  }
  
  // Clean up
  document.cookie = `${testName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Cookie security requirements checklist.
 * Document for server-side implementation.
 */
export const cookieSecurityRequirements = {
  accessToken: {
    name: 'access_token',
    storage: 'memory', // NOT cookie
    note: 'Stored in memory only, never in cookie or localStorage',
  },
  
  refreshToken: {
    name: 'refresh_token',
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    note: 'Set by server only, not accessible to JS',
  },
  
  csrfToken: {
    name: 'XSRF-TOKEN',
    httpOnly: false, // Must be readable by JS
    secure: true,
    sameSite: 'Strict',
    path: '/',
    note: 'Readable by JS to send in header',
  },
};
```

---

#### FE-312: Security Header Verification

**Story:** Security Infrastructure  
**Hours:** 2  
**Priority:** P1

**Description:**
Verify all required security headers are present.

**Code Example:**

```typescript
// src/lib/security/headerVerifier.ts

interface SecurityHeader {
  name: string;
  required: boolean;
  expectedValue?: string | RegExp;
  description: string;
}

const securityHeaders: SecurityHeader[] = [
  {
    name: 'Content-Security-Policy',
    required: true,
    description: 'Prevents XSS and injection attacks',
  },
  {
    name: 'X-Content-Type-Options',
    required: true,
    expectedValue: 'nosniff',
    description: 'Prevents MIME type sniffing',
  },
  {
    name: 'X-Frame-Options',
    required: true,
    expectedValue: /^(DENY|SAMEORIGIN)$/,
    description: 'Prevents clickjacking',
  },
  {
    name: 'Strict-Transport-Security',
    required: true,
    description: 'Enforces HTTPS',
  },
  {
    name: 'Referrer-Policy',
    required: false,
    description: 'Controls referrer header',
  },
  {
    name: 'Permissions-Policy',
    required: false,
    description: 'Controls browser features',
  },
];

export async function verifySecurityHeaders(): Promise<void> {
  if (import.meta.env.DEV) {
    console.info('[Security] Skipping header verification in development');
    return;
  }

  try {
    // Make a HEAD request to check headers
    const response = await fetch(window.location.href, {
      method: 'HEAD',
    });

    const issues: string[] = [];

    for (const header of securityHeaders) {
      const value = response.headers.get(header.name);

      if (!value && header.required) {
        issues.push(`Missing required header: ${header.name}`);
        continue;
      }

      if (value && header.expectedValue) {
        const matches = 
          typeof header.expectedValue === 'string'
            ? value === header.expectedValue
            : header.expectedValue.test(value);

        if (!matches) {
          issues.push(
            `Invalid value for ${header.name}: ${value}`
          );
        }
      }
    }

    if (issues.length > 0) {
      console.error('[Security] Header verification failed:', issues);
      
      // Report to monitoring
      reportSecurityIssue({
        type: 'missing_security_headers',
        issues,
        url: window.location.href,
      });
    } else {
      console.info('[Security] All security headers verified');
    }
  } catch (error) {
    console.warn('[Security] Unable to verify headers:', error);
  }
}
```

---

### Day 6: Audit Logging

---

#### FE-313: Client-Side Error Logging

**Story:** US-011 — Comprehensive Audit Logging  
**Hours:** 3  
**Priority:** P0

**Description:**
Implement structured client-side error logging.

**Code Example:**

```typescript
// src/lib/logging/auditLogger.ts

type AuditAction = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE_ORDER'
  | 'CANCEL_ORDER'
  | 'VIEW_ORDER'
  | 'SEARCH_ORDERS'
  | 'ACCESS_DENIED'
  | 'ERROR';

interface AuditEvent {
  action: AuditAction;
  resource?: string;
  outcome?: 'success' | 'failure' | 'denied';
  reason?: string;
  details?: Record<string, unknown>;
}

interface StructuredLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  action: AuditAction;
  user?: string;
  sessionId?: string;
  resource?: string;
  outcome?: string;
  reason?: string;
  details?: Record<string, unknown>;
  userAgent: string;
  url: string;
}

class AuditLogger {
  private readonly endpoint = '/api/v1/audit/client-events';
  private queue: StructuredLog[] = [];
  private flushTimeout: number | null = null;

  log(event: AuditEvent): void {
    const structuredLog = this.createStructuredLog(event);
    
    // Always log to console in development
    if (import.meta.env.DEV) {
      console.log('[Audit]', structuredLog);
    }
    
    // Queue for server submission
    this.queue.push(structuredLog);
    this.scheduleFlush();
  }

  private createStructuredLog(event: AuditEvent): StructuredLog {
    return {
      timestamp: new Date().toISOString(),
      level: event.outcome === 'failure' ? 'error' : 'info',
      action: event.action,
      user: this.getCurrentUser(),
      sessionId: this.getSessionId(),
      resource: event.resource,
      outcome: event.outcome,
      reason: event.reason,
      details: this.sanitizeDetails(event.details),
      userAgent: navigator.userAgent,
      url: window.location.pathname,
    };
  }

  private sanitizeDetails(
    details?: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    if (!details) return undefined;
    
    // Remove any potentially sensitive fields
    const sanitized = { ...details };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
    
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '***REDACTED***';
      }
    }
    
    return sanitized;
  }

  private getCurrentUser(): string | undefined {
    // Get from auth context or storage
    return secureStorage.getSecure('username') ?? undefined;
  }

  private getSessionId(): string | undefined {
    return secureStorage.getSecure('sessionId') ?? undefined;
  }

  private scheduleFlush(): void {
    if (this.flushTimeout) return;
    
    this.flushTimeout = window.setTimeout(() => {
      this.flush();
    }, 5000); // Flush every 5 seconds
  }

  private async flush(): Promise<void> {
    this.flushTimeout = null;
    
    if (this.queue.length === 0) return;
    
    const events = [...this.queue];
    this.queue = [];
    
    try {
      await secureFetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      // Put events back in queue for retry
      this.queue.unshift(...events);
      console.error('[Audit] Failed to send events:', error);
    }
  }
}

export const auditLogger = new AuditLogger();

// Usage in components
function OrderDetail({ orderId }: { orderId: string }) {
  useEffect(() => {
    auditLogger.log({
      action: 'VIEW_ORDER',
      resource: `order:${orderId}`,
      outcome: 'success',
    });
  }, [orderId]);
  
  // ...
}
```

---

#### FE-314: User Action Tracking

**Story:** US-011 — Comprehensive Audit Logging  
**Hours:** 2  
**Priority:** P1

**Description:**
Track user actions for audit trail.

**Code Example:**

```typescript
// src/lib/logging/actionTracker.ts

import { auditLogger } from './auditLogger';

type TrackableAction = 
  | 'click'
  | 'submit'
  | 'navigate'
  | 'search'
  | 'filter';

interface ActionContext {
  component: string;
  action: TrackableAction;
  target?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Hook to track user actions.
 */
export function useActionTracker(component: string) {
  const track = useCallback((
    action: TrackableAction,
    target?: string,
    metadata?: Record<string, unknown>
  ) => {
    auditLogger.log({
      action: 'USER_ACTION' as any,
      details: {
        component,
        action,
        target,
        ...metadata,
      },
    });
  }, [component]);

  return { track };
}

/**
 * HOC to automatically track button clicks.
 */
export function withClickTracking<P extends { onClick?: () => void }>(
  WrappedComponent: React.ComponentType<P>,
  trackingId: string
) {
  return function TrackedComponent(props: P) {
    const { track } = useActionTracker(trackingId);
    
    const handleClick = () => {
      track('click', trackingId);
      props.onClick?.();
    };
    
    return <WrappedComponent {...props} onClick={handleClick} />;
  };
}

// Usage
function OrderActions({ order }: { order: Order }) {
  const { track } = useActionTracker('OrderActions');
  
  const handleCancel = async () => {
    track('click', 'cancel-order', { orderId: order.id });
    
    try {
      await cancelOrder(order.id);
      auditLogger.log({
        action: 'CANCEL_ORDER',
        resource: `order:${order.id}`,
        outcome: 'success',
      });
    } catch (error) {
      auditLogger.log({
        action: 'CANCEL_ORDER',
        resource: `order:${order.id}`,
        outcome: 'failure',
        reason: error.message,
      });
      throw error;
    }
  };
  
  return (
    <button onClick={handleCancel}>
      Cancel Order
    </button>
  );
}
```

---

#### FE-315: PII Masking in Logs

**Story:** US-011 — Comprehensive Audit Logging  
**Hours:** 2  
**Priority:** P0

**Description:**
Mask personally identifiable information in all logs.

**Code Example:**

```typescript
// src/lib/logging/piiMasker.ts

type MaskingRule = {
  pattern: RegExp;
  replacement: (match: string) => string;
};

const maskingRules: MaskingRule[] = [
  // Email: j***@e***.com
  {
    pattern: /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})/g,
    replacement: (match) => {
      const [local, domain, tld] = match.split(/[@.]/);
      return `${local[0]}***@${domain[0]}***.${tld}`;
    },
  },
  
  // Phone: ***-***-1234
  {
    pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    replacement: (match) => `***-***-${match.slice(-4)}`,
  },
  
  // Credit card: ****-****-****-1234
  {
    pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    replacement: (match) => `****-****-****-${match.slice(-4)}`,
  },
  
  // SSN: ***-**-1234
  {
    pattern: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
    replacement: (match) => `***-**-${match.slice(-4)}`,
  },
  
  // IP Address: ***.***.***.123
  {
    pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    replacement: (match) => {
      const parts = match.split('.');
      return `***.***.***.${parts[3]}`;
    },
  },
];

/**
 * Mask PII in a string value.
 */
export function maskPii(value: string): string {
  let masked = value;
  
  for (const rule of maskingRules) {
    masked = masked.replace(rule.pattern, rule.replacement);
  }
  
  return masked;
}

/**
 * Mask PII in an object recursively.
 */
export function maskPiiInObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return maskPii(obj) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => maskPiiInObject(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const masked: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Completely mask known sensitive fields
      if (isSensitiveField(key)) {
        masked[key] = '***MASKED***';
      } else {
        masked[key] = maskPiiInObject(value);
      }
    }
    
    return masked as T;
  }
  
  return obj;
}

function isSensitiveField(fieldName: string): boolean {
  const sensitivePatterns = [
    'password',
    'secret',
    'token',
    'apiKey',
    'creditCard',
    'ssn',
    'socialSecurity',
  ];
  
  const lower = fieldName.toLowerCase();
  return sensitivePatterns.some(p => lower.includes(p.toLowerCase()));
}

// Integration with audit logger
class SecureAuditLogger extends AuditLogger {
  log(event: AuditEvent): void {
    // Mask PII before logging
    const maskedEvent = {
      ...event,
      details: event.details ? maskPiiInObject(event.details) : undefined,
    };
    
    super.log(maskedEvent);
  }
}
```

---

### Day 7: Edge Case Handling

---

#### FE-316: Optimistic Locking UI

**Story:** Edge Case Handling  
**Hours:** 3  
**Priority:** P1

**Description:**
Handle version conflicts in the UI gracefully.

**Code Example:**

```tsx
// src/components/errors/ConflictDialog.tsx

interface ConflictDialogProps {
  isOpen: boolean;
  onRefresh: () => void;
  onCancel: () => void;
  resourceType: string;
  currentVersion: number;
}

export function ConflictDialog({
  isOpen,
  onRefresh,
  onCancel,
  resourceType,
  currentVersion,
}: ConflictDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCancel}
      aria-labelledby="conflict-title"
      aria-describedby="conflict-description"
    >
      <Dialog.Title id="conflict-title">
        <WarningIcon aria-hidden="true" />
        {resourceType} Has Been Modified
      </Dialog.Title>
      
      <Dialog.Description id="conflict-description">
        This {resourceType.toLowerCase()} was updated by another user while 
        you were editing. Your changes could not be saved.
      </Dialog.Description>
      
      <Dialog.Content>
        <p>You have two options:</p>
        <ul>
          <li>
            <strong>Refresh</strong> — Load the latest version and 
            re-apply your changes
          </li>
          <li>
            <strong>Cancel</strong> — Discard your changes and continue 
            with the current version
          </li>
        </ul>
        <p className="text-muted">
          Current version: {currentVersion}
        </p>
      </Dialog.Content>
      
      <Dialog.Actions>
        <button 
          onClick={onCancel} 
          className="button-secondary"
        >
          Cancel
        </button>
        <button 
          onClick={onRefresh} 
          className="button-primary"
          autoFocus
        >
          Refresh & Retry
        </button>
      </Dialog.Actions>
    </Dialog>
  );
}

// Hook for handling conflicts
export function useOptimisticLocking<T extends { version: number }>(
  fetchFn: () => Promise<T>,
  updateFn: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [conflict, setConflict] = useState<{
    currentVersion: number;
    pendingData: T;
  } | null>(null);

  const update = async (updates: Partial<T>) => {
    if (!data) throw new Error('No data to update');
    
    const updatedData = { ...data, ...updates };
    
    try {
      const result = await updateFn(updatedData);
      setData(result);
      return result;
    } catch (error) {
      if (error instanceof ConflictError) {
        setConflict({
          currentVersion: error.currentVersion,
          pendingData: updatedData,
        });
        throw error;
      }
      throw error;
    }
  };

  const handleRefresh = async () => {
    const fresh = await fetchFn();
    setData(fresh);
    setConflict(null);
  };

  const handleCancel = () => {
    setConflict(null);
  };

  return {
    data,
    update,
    conflict,
    handleRefresh,
    handleCancel,
  };
}
```

---

#### FE-317: Conflict Resolution Dialog

**Story:** Edge Case Handling  
**Hours:** 2  
**Priority:** P1

See code example above in FE-316.

---

#### FE-318: Timeout Handling

**Story:** Edge Case Handling  
**Hours:** 2  
**Priority:** P1

**Code Example:**

```typescript
// src/lib/api/timeoutHandler.ts

const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff

interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT_MS, retries = 3, ...fetchOptions } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
      
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        // Timeout - potentially retry
        if (attempt < retries - 1) {
          const delay = RETRY_DELAYS[attempt] ?? RETRY_DELAYS[RETRY_DELAYS.length - 1];
          await sleep(delay);
          continue;
        }
        throw new TimeoutError(
          `Request timed out after ${timeout}ms`,
          url
        );
      }
      
      // Non-timeout error - don't retry
      throw error;
    }
  }
  
  throw lastError ?? new Error('Request failed');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Timeout error component
export function TimeoutErrorDisplay({ 
  error, 
  onRetry 
}: { 
  error: TimeoutError;
  onRetry: () => void;
}) {
  return (
    <div 
      className="timeout-error"
      role="alert"
      aria-live="polite"
    >
      <ClockIcon aria-hidden="true" />
      <h3>Request Timed Out</h3>
      <p>
        The server is taking too long to respond. 
        This might be due to high traffic or network issues.
      </p>
      <button onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}
```

---

### Day 8: Security Unit Tests

---

#### FE-319: Security Test Suite

**Story:** Testing  
**Hours:** 4  
**Priority:** P0

**Code Example:**

```typescript
// src/tests/security/auth.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tokenManager } from '../../lib/auth/tokenManager';
import { logout } from '../../lib/auth/logout';

describe('Token Manager Security', () => {
  beforeEach(() => {
    tokenManager.clearTokens();
    vi.clearAllMocks();
  });

  it('should not expose token in toString', () => {
    tokenManager.setTokens({
      accessToken: 'secret-token-123',
      refreshToken: 'refresh-token-456',
      expiresAt: Date.now() + 3600000,
    });

    const stringified = String(tokenManager);
    expect(stringified).not.toContain('secret-token-123');
  });

  it('should refresh token before expiration', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
        expiresIn: 3600,
      }),
    });
    global.fetch = mockFetch;

    // Set token that expires in 4 minutes (less than 5 min buffer)
    tokenManager.setTokens({
      accessToken: 'old-token',
      refreshToken: 'old-refresh',
      expiresAt: Date.now() + (4 * 60 * 1000),
    });

    const token = await tokenManager.getAccessToken();
    
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/auth/refresh',
      expect.any(Object)
    );
    expect(token).toBe('new-token');
  });

  it('should handle concurrent refresh requests', async () => {
    const mockFetch = vi.fn().mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({
            accessToken: 'concurrent-token',
            refreshToken: 'concurrent-refresh',
            expiresIn: 3600,
          }),
        }), 100)
      )
    );
    global.fetch = mockFetch;

    tokenManager.setTokens({
      accessToken: 'expiring',
      refreshToken: 'refresh',
      expiresAt: Date.now() + 1000, // Almost expired
    });

    // Make concurrent requests
    const results = await Promise.all([
      tokenManager.getAccessToken(),
      tokenManager.getAccessToken(),
      tokenManager.getAccessToken(),
    ]);

    // Should only call refresh once
    expect(mockFetch).toHaveBeenCalledTimes(1);
    
    // All should get same token
    expect(results).toEqual([
      'concurrent-token',
      'concurrent-token',
      'concurrent-token',
    ]);
  });

  it('should clear all data on logout', async () => {
    tokenManager.setTokens({
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresAt: Date.now() + 3600000,
    });

    await logout();

    expect(tokenManager.isAuthenticated()).toBe(false);
  });
});

describe('CSRF Protection', () => {
  it('should add CSRF token to mutation requests', async () => {
    // Set CSRF cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'XSRF-TOKEN=test-csrf-token',
    });

    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    await secureFetch('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/orders',
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.get('X-CSRF-TOKEN')).toBe('test-csrf-token');
  });

  it('should not add CSRF token to GET requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    await secureFetch('/api/v1/orders', { method: 'GET' });

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.get('X-CSRF-TOKEN')).toBeNull();
  });
});
```

---

#### FE-320: XSS Test Cases

**Story:** Testing  
**Hours:** 2  
**Priority:** P0

**Code Example:**

```typescript
// src/tests/security/xss.test.ts

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { sanitizeString, sanitizeHtml, sanitizeUrl } from '../../lib/security/sanitize';
import { OrderNotes } from '../../components/OrderNotes';

describe('XSS Prevention', () => {
  describe('sanitizeString', () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert("xss")>',
      '<svg onload=alert("xss")>',
      'javascript:alert("xss")',
      '<iframe src="javascript:alert(1)">',
      '<body onload=alert("xss")>',
      '"><script>alert("xss")</script>',
      "'-alert(1)-'",
      '<math><maction xlink:href="javascript:alert(1)">click</maction></math>',
    ];

    it.each(xssPayloads)('should sanitize: %s', (payload) => {
      const result = sanitizeString(payload);
      
      expect(result).not.toContain('<script');
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('onload');
      expect(result).not.toContain('javascript:');
    });

    it('should preserve safe content', () => {
      const safe = 'Hello, this is a normal note with numbers 123';
      expect(sanitizeString(safe)).toBe(safe);
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
    });

    it('should allow http URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    });

    it('should block javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    });

    it('should block data: URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });
  });

  describe('Component XSS Safety', () => {
    it('should escape HTML in order notes', () => {
      const maliciousNote = '<script>alert("xss")</script>';
      
      render(<OrderNotes notes={maliciousNote} />);
      
      // The script tag should be visible as text, not executed
      expect(screen.getByText(/script/)).toBeInTheDocument();
      
      // No actual script element should exist
      expect(document.querySelector('script')).toBeNull();
    });

    it('should escape HTML entities', () => {
      const htmlContent = '<b>Bold</b> & "quoted"';
      
      render(<OrderNotes notes={htmlContent} />);
      
      // Should show escaped content
      const element = screen.getByTestId('order-notes');
      expect(element.innerHTML).not.toContain('<b>');
    });
  });
});
```

---

#### FE-321: Auth Flow Tests

**Story:** Testing  
**Hours:** 2  
**Priority:** P0

**Code Example:**

```typescript
// src/tests/security/authFlow.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { AuthProvider } from '../../lib/auth/authContext';

describe('Authentication Flow', () => {
  it('should redirect unauthenticated users to login', async () => {
    render(
      <MemoryRouter initialEntries={['/orders']}>
        <AuthProvider initialUser={null}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <div>Orders Page</div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('should preserve return URL in redirect', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/orders?filter=pending']}>
        <AuthProvider initialUser={null}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <div>Orders Page</div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check URL contains return path
      expect(window.location.search).toContain('returnUrl');
    });
  });

  it('should show 403 for unauthorized access', async () => {
    const userWithoutPermission = {
      username: 'viewer',
      roles: ['viewer'],
    };

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider initialUser={userWithoutPermission}>
          <Routes>
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredPermission="admin:access">
                  <div>Admin Page</div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });
  });

  it('should allow authorized users', async () => {
    const adminUser = {
      username: 'admin',
      roles: ['admin'],
    };

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider initialUser={adminUser}>
          <Routes>
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredPermission="admin:access">
                  <div>Admin Page</div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Page')).toBeInTheDocument();
    });
  });
});
```

---

### Day 9: E2E Security Tests

---

#### FE-322: E2E Security Tests

**Story:** Testing  
**Hours:** 4  
**Priority:** P0

See code examples in SPRINT_3_PROGRAM.md Day 9 section.

---

#### FE-323: Auth Flow E2E

**Story:** Testing  
**Hours:** 2  
**Priority:** P0

**Code Example:**

```typescript
// e2e/auth.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication E2E', () => {
  test('complete login flow', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'TestPass123!');
    await page.click('[data-testid="login-button"]');
    
    // Should redirect to orders
    await expect(page).toHaveURL('/orders');
    
    // Should see user info
    await expect(page.locator('[data-testid="user-name"]')).toContainText('testuser');
  });

  test('logout clears session', async ({ page }) => {
    // Login first
    await loginAs(page, 'testuser', 'TestPass123!');
    
    // Click logout
    await page.click('[data-testid="logout-button"]');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    
    // Try to access protected route
    await page.goto('/orders');
    
    // Should redirect back to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('session expires after timeout', async ({ page }) => {
    await loginAs(page, 'testuser', 'TestPass123!');
    
    // Wait for session to expire (mock short timeout)
    await page.evaluate(() => {
      // Force token expiration
      window.localStorage.setItem('__force_expire__', 'true');
    });
    
    // Make a request
    await page.click('[data-testid="refresh-orders"]');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('[data-testid="session-expired-message"]'))
      .toBeVisible();
  });
});

async function loginAs(page, username: string, password: string) {
  await page.goto('/login');
  await page.fill('[data-testid="username"]', username);
  await page.fill('[data-testid="password"]', password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/orders');
}
```

---

#### FE-324: Error Boundary Tests

**Story:** Testing  
**Hours:** 2  
**Priority:** P1

**Code Example:**

```typescript
// src/tests/security/errorBoundary.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../components/errors/ErrorBoundary';

describe('Error Boundary Security', () => {
  // Suppress console.error for expected errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should not expose stack traces in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const ErrorComponent = () => {
      throw new Error('Secret internal error with path /internal/api/secret');
    };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const errorDisplay = screen.getByRole('alert');
    expect(errorDisplay.textContent).not.toContain('/internal/api/secret');
    expect(errorDisplay.textContent).not.toContain('at ErrorComponent');

    process.env.NODE_ENV = originalEnv;
  });

  it('should log errors securely', () => {
    const mockLogger = vi.fn();
    
    const ErrorComponent = () => {
      const error = new Error('Test error');
      error.stack = 'Error at secret/path/component.tsx:42';
      throw error;
    };

    render(
      <ErrorBoundary onError={mockLogger}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(mockLogger).toHaveBeenCalled();
    const loggedError = mockLogger.mock.calls[0][0];
    
    // Error should be sanitized
    expect(loggedError.sanitizedMessage).toBeDefined();
  });

  it('should show generic message for unknown errors', () => {
    const ErrorComponent = () => {
      throw new Error('Unexpected error type xyz');
    };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.queryByText('xyz')).not.toBeInTheDocument();
  });
});
```

---

## Verification Commands

```bash
# Run all security tests
npm test -- --grep "security"

# Run XSS tests
npm test -- src/tests/security/xss.test.ts

# Run auth tests
npm test -- src/tests/security/auth.test.ts

# Run E2E security tests
npx playwright test e2e/security/

# Check for common security issues
npx eslint src/ --rule 'no-eval: error' --rule 'no-implied-eval: error'

# Audit dependencies
npm audit

# Check for secrets in code
grep -r "password\|secret\|api.key\|token" src/ --include="*.ts" --include="*.tsx" | grep -v "test\|spec\|\.d\.ts"
```

---

## Key References

| Resource | Location |
|----------|----------|
| Sprint 3 Program | [../SPRINT_3_PROGRAM.md](../SPRINT_3_PROGRAM.md) |
| Security Checklist | [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) |
| BE Tasks | [BE_TASKS.md](BE_TASKS.md) |
| Testing Instructions | [../../../../.github/instructions/testing.instructions.md](../../../../.github/instructions/testing.instructions.md) |
| Sprint 2 FE Tasks | [../../sprint-02/sprint-packet/FE_TASKS.md](../../sprint-02/sprint-packet/FE_TASKS.md) |
