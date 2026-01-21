# ADR-002: Error Handling Strategy

**Status:** Accepted  
**Date:** [Date]  
**Deciders:** [Tech Lead, Architect]

---

## Context

The Order Management System needs a consistent approach to handling and communicating errors across the backend API and frontend application. We need to decide on a format that provides useful information to developers and appropriate messages to users.

### Forces

- **API Consistency:** All endpoints should return errors in the same format
- **Debugging:** Errors should include enough information for troubleshooting
- **Security:** Errors should not leak sensitive implementation details
- **Frontend Handling:** Frontend needs predictable error structures
- **Standards Compliance:** Prefer industry standards over custom formats
- **Internationalization:** Error messages should be translatable (future)

---

## Decision

**We will use RFC 7807 Problem Details for HTTP APIs as our standard error format.**

### Error Response Format

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "The request contains invalid data",
  "instance": "/api/v1/orders",
  "timestamp": "2026-01-20T10:30:00.000Z",
  "traceId": "abc123def456",
  "errors": [
    {
      "field": "items",
      "code": "SIZE_MIN",
      "message": "Order must contain at least one item"
    }
  ]
}
```

### Standard Fields

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | URI identifying the problem type |
| `title` | Yes | Short human-readable summary |
| `status` | Yes | HTTP status code |
| `detail` | Yes | Human-readable explanation |
| `instance` | Yes | URI of the specific occurrence |
| `timestamp` | Yes* | When the error occurred (extension) |
| `traceId` | Yes* | Correlation ID for debugging (extension) |
| `errors` | No | Array of field-level errors (extension) |

*Extensions to RFC 7807

---

## Options Considered

### Option 1: RFC 7807 Problem Details (Selected)

**Pros:**
- Industry standard (IETF RFC)
- Well-defined structure
- Extensible for additional fields
- Supported by Spring Boot (`ProblemDetail`)
- Machine-readable and human-readable

**Cons:**
- More verbose than minimal formats
- Requires consistent implementation

### Option 2: Custom JSON Error Format

```json
{
  "error": "validation_error",
  "message": "Order must contain at least one item",
  "code": 400
}
```

**Pros:**
- Simple and compact
- Easy to implement

**Cons:**
- No industry standard
- Inconsistent across APIs
- Limited structure for complex errors

### Option 3: GraphQL-style Errors

```json
{
  "errors": [
    {
      "message": "Validation error",
      "extensions": { "code": "VALIDATION_ERROR" }
    }
  ]
}
```

**Pros:**
- Works well with GraphQL

**Cons:**
- Not idiomatic for REST APIs
- Unusual structure for REST clients

---

## Consequences

### Positive

- ✅ Consistent error format across all endpoints
- ✅ Standards-compliant (tooling support)
- ✅ Extensible for field-level validation errors
- ✅ Trace IDs enable debugging across services
- ✅ Spring Boot 3.x has built-in support

### Negative

- ⚠️ More verbose than minimal formats
- ⚠️ Developers must learn Problem Details structure
- ⚠️ Need to maintain problem type URI documentation

---

## Implementation Notes

### Problem Type Registry

| Type URI | Title | Status | Usage |
|----------|-------|--------|-------|
| `/problems/validation-error` | Validation Error | 400 | Invalid request data |
| `/problems/authentication-required` | Authentication Required | 401 | Missing/invalid auth |
| `/problems/access-denied` | Access Denied | 403 | Insufficient permissions |
| `/problems/not-found` | Resource Not Found | 404 | Entity doesn't exist |
| `/problems/conflict` | Conflict | 409 | State conflict |
| `/problems/internal-error` | Internal Error | 500 | Unexpected failure |

### Backend Implementation

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(OrderNotFoundException.class)
    public ProblemDetail handleNotFound(OrderNotFoundException ex, WebRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND,
            ex.getMessage()
        );
        problem.setType(URI.create("/problems/not-found"));
        problem.setTitle("Resource Not Found");
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("traceId", getTraceId());
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            "The request contains invalid data"
        );
        problem.setType(URI.create("/problems/validation-error"));
        problem.setTitle("Validation Error");
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("traceId", getTraceId());
        
        List<FieldError> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> new FieldError(e.getField(), e.getCode(), e.getDefaultMessage()))
            .toList();
        problem.setProperty("errors", errors);
        
        return problem;
    }
}
```

### Frontend Handling

```typescript
// lib/api.ts
interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
  traceId: string;
  errors?: FieldError[];
}

interface FieldError {
  field: string;
  code: string;
  message: string;
}

export async function handleApiError(response: Response): Promise<never> {
  const problem: ProblemDetail = await response.json();
  
  // Log for debugging
  console.error(`API Error [${problem.traceId}]:`, problem);
  
  // Throw for error boundary handling
  throw new ApiError(problem);
}

// In route actions
export async function action({ request }: ActionFunctionArgs) {
  const response = await fetch('/api/v1/orders', { ... });
  
  if (!response.ok) {
    const problem = await response.json();
    return json(problem, { status: problem.status });
  }
  
  return redirect('/orders');
}
```

---

## Related Decisions

- [ADR-001: Authentication](./001-authentication.md) - Auth errors use this format
- [ADR-003: API Versioning](./003-api-versioning.md) - Version-specific error types

---

## References

- [RFC 7807 - Problem Details for HTTP APIs](https://tools.ietf.org/html/rfc7807)
- [Spring Boot Problem Details Support](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/ProblemDetail.html)
