# ADR-003: API Versioning Strategy

**Status:** Accepted  
**Date:** [Date]  
**Deciders:** [Tech Lead, Architect]

---

## Context

The Order Management System exposes REST APIs consumed by the frontend and potentially other systems. We need a versioning strategy to manage API evolution while maintaining backward compatibility for existing clients.

### Forces

- **Backward Compatibility:** Existing clients should continue working after API updates
- **Evolution:** API needs to change over time for new features
- **Simplicity:** Versioning should be easy to implement and understand
- **Discoverability:** Clients should easily understand which version they're using
- **OpenShift Deployment:** Multiple versions may run simultaneously during rollout
- **Frontend Integration:** React Router v7 frontend consumes the API

---

## Decision

**We will use URL path versioning with a `/api/v{major}` prefix.**

### URL Format

```
/api/v1/orders
/api/v1/orders/{id}
/api/v1/customers/{customerId}/orders
```

### Versioning Rules

1. **Major Version Only:** Only major versions are expressed in the URL
2. **Breaking Changes:** Increment major version for breaking changes
3. **Non-Breaking Changes:** Add new fields/endpoints without version bump
4. **Deprecation:** Old versions supported for minimum 6 months after new version
5. **Maximum Versions:** At most 2 major versions active simultaneously

### What Constitutes a Breaking Change

| Change Type | Breaking? | Action |
|-------------|-----------|--------|
| Add optional field to response | No | No version bump |
| Add optional field to request | No | No version bump |
| Add new endpoint | No | No version bump |
| Remove field from response | **Yes** | New major version |
| Remove field from request | **Yes** | New major version |
| Rename field | **Yes** | New major version |
| Change field type | **Yes** | New major version |
| Change validation rules (stricter) | **Yes** | New major version |

---

## Options Considered

### Option 1: URL Path Versioning (Selected)

```
/api/v1/orders
/api/v2/orders
```

**Pros:**
- Highly visible and explicit
- Easy to understand and implement
- Simple to route in API gateway/ingress
- Clear cache separation
- Works well with OpenAPI/Swagger

**Cons:**
- URL changes for major versions
- Potential URL proliferation

### Option 2: Header Versioning

```
GET /api/orders
Accept: application/vnd.ordermgmt.v1+json
```

**Pros:**
- Clean URLs
- Follows REST purist approach

**Cons:**
- Less visible to developers
- Harder to test in browser
- More complex routing
- Cache keys must include headers

### Option 3: Query Parameter Versioning

```
/api/orders?version=1
/api/orders?v=1
```

**Pros:**
- URLs remain clean
- Easy to test in browser

**Cons:**
- Not recommended by REST guidelines
- Mixes versioning with query parameters
- Caching complications

---

## Consequences

### Positive

- ✅ Version is immediately visible in URL
- ✅ Simple to implement in Spring Boot
- ✅ Easy to configure in OpenShift ingress
- ✅ Clear separation between versions
- ✅ Frontend can easily switch versions

### Negative

- ⚠️ URLs change on major version bump
- ⚠️ Must maintain multiple controller versions during transition
- ⚠️ Code duplication if not structured carefully

---

## Implementation Notes

### Backend Structure

```
src/main/java/com/example/ordermgmt/
├── controller/
│   ├── v1/
│   │   └── OrderControllerV1.java
│   └── v2/
│       └── OrderControllerV2.java
├── service/           # Shared service layer
├── repository/        # Shared repository layer
└── dto/
    ├── v1/
    │   └── OrderDtoV1.java
    └── v2/
        └── OrderDtoV2.java
```

### Controller Example

```java
@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders V1", description = "Order operations (v1)")
public class OrderControllerV1 {

    @GetMapping("/{id}")
    public ResponseEntity<OrderDtoV1> getOrder(@PathVariable Long id) {
        Order order = orderService.findById(id);
        return ResponseEntity.ok(OrderDtoV1.from(order));
    }
}

@RestController
@RequestMapping("/api/v2/orders")
@Tag(name = "Orders V2", description = "Order operations (v2)")
public class OrderControllerV2 {

    @GetMapping("/{id}")
    public ResponseEntity<OrderDtoV2> getOrder(@PathVariable Long id) {
        Order order = orderService.findById(id);
        return ResponseEntity.ok(OrderDtoV2.from(order)); // New DTO structure
    }
}
```

### OpenAPI Configuration

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public GroupedOpenApi v1Api() {
        return GroupedOpenApi.builder()
            .group("v1")
            .pathsToMatch("/api/v1/**")
            .build();
    }

    @Bean
    public GroupedOpenApi v2Api() {
        return GroupedOpenApi.builder()
            .group("v2")
            .pathsToMatch("/api/v2/**")
            .build();
    }
}
```

### Frontend Usage

```typescript
// lib/api.ts
const API_VERSION = 'v1';
const API_BASE = `/api/${API_VERSION}`;

export async function fetchOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE}/orders`, {
    headers: {
      'Authorization': `Bearer ${await getAccessToken()}`,
    },
  });
  
  if (!response.ok) {
    await handleApiError(response);
  }
  
  return response.json();
}
```

### Deprecation Notice Headers

```java
@GetMapping("/{id}")
public ResponseEntity<OrderDtoV1> getOrder(@PathVariable Long id) {
    Order order = orderService.findById(id);
    return ResponseEntity.ok()
        .header("Deprecation", "Sun, 01 Jul 2026 00:00:00 GMT")
        .header("Sunset", "Sun, 01 Jan 2027 00:00:00 GMT")
        .header("Link", "</api/v2/orders>; rel=\"successor-version\"")
        .body(OrderDtoV1.from(order));
}
```

---

## Version Lifecycle

```
v1 Released ──────────────────────────────────────────────────▶
              │
              │ v2 Released (v1 deprecated)
              ▼──────────────────────────────────▶
                          │
                          │ v1 Sunset (6 months)
                          ▼
                          X (v1 removed)
```

| Phase | Duration | Actions |
|-------|----------|---------|
| Current | Ongoing | Active development, bug fixes |
| Deprecated | 6 months | Bug fixes only, sunset date announced |
| Sunset | End | Version removed, 410 Gone returned |

---

## Related Decisions

- [ADR-001: Authentication](./001-authentication.md) - Auth applies to all versions
- [ADR-002: Error Handling](./002-error-handling.md) - Error format consistent across versions

---

## References

- [REST API Versioning Best Practices](https://www.baeldung.com/rest-versioning)
- [API Deprecation Headers (RFC 8594)](https://tools.ietf.org/html/rfc8594)
