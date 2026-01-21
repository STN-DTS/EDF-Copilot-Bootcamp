# Sprint 2 Backend Tasks — Expand + NFRs

> **Timebox:** 10 working days (Week 7-8)  
> **Estimated Effort:** ~57 hours  
> **Prerequisites:** Sprint 1 BE complete, Sprint 2 Packet approved

---

## Task Overview

| Category | Tasks | Hours |
|----------|-------|-------|
| Create Order Endpoint | BE-101 to BE-105 | 14h |
| Cancel Order Endpoint | BE-106 to BE-109 | 9h |
| Filter/Search | BE-110 to BE-112 | 9h |
| NFR Hardening | BE-113 to BE-114 | 7h |
| Testing | BE-115 to BE-117 | 18h |
| **Total** | 17 tasks | **57h** |

---

## Week 7: Feature Expansion (Days 2-5)

### Day 2: Create Order Endpoint (6h)

#### BE-101: OrderCreateRequest DTO (2h)

**Description:** Create the request DTO with validation annotations.

**Tasks:**
- [ ] Create DTO class with Bean Validation
- [ ] Add custom validators for complex rules
- [ ] Include Jackson annotations for serialization

**Code Example:**

```java
// src/main/java/com/example/ordermgmt/dto/OrderCreateRequest.java
package com.example.ordermgmt.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record OrderCreateRequest(
    @NotNull(message = "Customer ID is required")
    String customerId,
    
    @NotEmpty(message = "At least one item is required")
    @Valid
    List<OrderItemRequest> items,
    
    @NotNull(message = "Shipping address is required")
    @Valid
    AddressRequest shippingAddress,
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    String notes
) {
    public record OrderItemRequest(
        @NotNull(message = "Item ID is required")
        String itemId,
        
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        @Max(value = 100, message = "Quantity cannot exceed 100")
        Integer quantity
    ) {}
    
    public record AddressRequest(
        @NotBlank(message = "Street is required")
        @Size(max = 200, message = "Street cannot exceed 200 characters")
        String street,
        
        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City cannot exceed 100 characters")
        String city,
        
        @NotBlank(message = "State is required")
        @Size(min = 2, max = 2, message = "State must be 2 characters")
        String state,
        
        @NotBlank(message = "Postal code is required")
        @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "Invalid postal code format")
        String postalCode
    ) {}
}
```

#### BE-102: Create Order Validation Rules (3h)

**Description:** Implement business rule validation for order creation.

**Tasks:**
- [ ] Customer exists validation
- [ ] Item availability validation
- [ ] Order total calculation
- [ ] Credit limit check (if applicable)

**Code Example:**

```java
// src/main/java/com/example/ordermgmt/validation/OrderValidator.java
package com.example.ordermgmt.validation;

import com.example.ordermgmt.dto.OrderCreateRequest;
import com.example.ordermgmt.exception.ValidationException;
import com.example.ordermgmt.repository.CustomerRepository;
import com.example.ordermgmt.repository.ItemRepository;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class OrderValidator {
    
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;
    
    public OrderValidator(CustomerRepository customerRepository, ItemRepository itemRepository) {
        this.customerRepository = customerRepository;
        this.itemRepository = itemRepository;
    }
    
    public void validateCreateRequest(OrderCreateRequest request, String userId) {
        Map<String, List<String>> errors = new LinkedHashMap<>();
        
        // Validate customer exists and belongs to user
        if (!customerRepository.existsByIdAndUserId(request.customerId(), userId)) {
            errors.put("customerId", List.of("Customer not found or access denied"));
        }
        
        // Validate items exist and are available
        for (int i = 0; i < request.items().size(); i++) {
            var item = request.items().get(i);
            var catalogItem = itemRepository.findById(item.itemId());
            
            if (catalogItem.isEmpty()) {
                errors.put("items[" + i + "].itemId", List.of("Item not found"));
            } else if (!catalogItem.get().isAvailable()) {
                errors.put("items[" + i + "].itemId", List.of("Item is not available"));
            } else if (catalogItem.get().getStockQuantity() < item.quantity()) {
                errors.put("items[" + i + "].quantity", 
                    List.of("Insufficient stock. Available: " + catalogItem.get().getStockQuantity()));
            }
        }
        
        // Check for duplicate items
        var itemIds = request.items().stream()
            .map(OrderCreateRequest.OrderItemRequest::itemId)
            .toList();
        var uniqueIds = new HashSet<>(itemIds);
        if (uniqueIds.size() != itemIds.size()) {
            errors.put("items", List.of("Duplicate items detected. Combine quantities instead."));
        }
        
        if (!errors.isEmpty()) {
            throw new ValidationException("Order validation failed", errors);
        }
    }
}
```

#### BE-103: OrderService.createOrder() (4h)

**Description:** Implement the service method for order creation.

**Tasks:**
- [ ] Validate business rules
- [ ] Calculate totals
- [ ] Create order entity
- [ ] Save to database
- [ ] Publish domain event (optional)

**Code Example:**

```java
// src/main/java/com/example/ordermgmt/service/impl/OrderServiceImpl.java
package com.example.ordermgmt.service.impl;

import com.example.ordermgmt.dto.OrderCreateRequest;
import com.example.ordermgmt.dto.OrderResponse;
import com.example.ordermgmt.entity.Order;
import com.example.ordermgmt.entity.OrderItem;
import com.example.ordermgmt.entity.OrderStatus;
import com.example.ordermgmt.entity.ShippingAddress;
import com.example.ordermgmt.mapper.OrderMapper;
import com.example.ordermgmt.repository.ItemRepository;
import com.example.ordermgmt.repository.OrderRepository;
import com.example.ordermgmt.service.OrderService;
import com.example.ordermgmt.validation.OrderValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {
    
    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    
    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;
    private final OrderValidator orderValidator;
    private final OrderMapper orderMapper;
    
    // Constructor injection...

    @Override
    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request, String userId) {
        log.info("Creating order for user={}, customerId={}, itemCount={}", 
            userId, request.customerId(), request.items().size());
        
        // Validate business rules
        orderValidator.validateCreateRequest(request, userId);
        
        // Build order entity
        Order order = new Order();
        order.setId(UUID.randomUUID().toString());
        order.setUserId(userId);
        order.setCustomerId(request.customerId());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());
        order.setNotes(request.notes());
        
        // Set shipping address
        ShippingAddress address = new ShippingAddress();
        address.setStreet(request.shippingAddress().street());
        address.setCity(request.shippingAddress().city());
        address.setState(request.shippingAddress().state());
        address.setPostalCode(request.shippingAddress().postalCode());
        order.setShippingAddress(address);
        
        // Build order items and calculate totals
        var orderItems = new ArrayList<OrderItem>();
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (var itemRequest : request.items()) {
            var catalogItem = itemRepository.findById(itemRequest.itemId())
                .orElseThrow(); // Already validated
            
            OrderItem orderItem = new OrderItem();
            orderItem.setId(UUID.randomUUID().toString());
            orderItem.setOrder(order);
            orderItem.setItemId(itemRequest.itemId());
            orderItem.setItemName(catalogItem.getName());
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setUnitPrice(catalogItem.getPrice());
            orderItem.setLineTotal(catalogItem.getPrice()
                .multiply(BigDecimal.valueOf(itemRequest.quantity())));
            
            orderItems.add(orderItem);
            subtotal = subtotal.add(orderItem.getLineTotal());
        }
        
        order.setItems(orderItems);
        order.setSubtotal(subtotal);
        order.setTax(calculateTax(subtotal));
        order.setTotal(subtotal.add(order.getTax()));
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        log.info("Order created successfully: orderId={}, total={}", 
            savedOrder.getId(), savedOrder.getTotal());
        
        // Audit event
        log.info("AUDIT: ORDER_CREATED orderId={} userId={} customerId={} total={} itemCount={}",
            savedOrder.getId(), userId, request.customerId(), 
            savedOrder.getTotal(), orderItems.size());
        
        return orderMapper.toResponse(savedOrder);
    }
    
    private BigDecimal calculateTax(BigDecimal subtotal) {
        // Simplified: 8% tax rate
        return subtotal.multiply(BigDecimal.valueOf(0.08))
            .setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
```

---

### Day 3: Controller + Audit (5h)

#### BE-104: OrderController POST Endpoint (3h)

**Description:** Add the POST endpoint to OrderController.

**Tasks:**
- [ ] Add endpoint method with validation
- [ ] Extract user from security context
- [ ] Return 201 Created with location header
- [ ] Handle validation errors

**Code Example:**

```java
// src/main/java/com/example/ordermgmt/controller/OrderController.java
package com.example.ordermgmt.controller;

import com.example.ordermgmt.dto.OrderCreateRequest;
import com.example.ordermgmt.dto.OrderResponse;
import com.example.ordermgmt.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    // Existing GET endpoints from Sprint 1...
    
    /**
     * Create a new order.
     * 
     * @param request The order creation request
     * @param jwt The authenticated user's JWT
     * @return 201 Created with the new order
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderCreateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userId = jwt.getSubject();
        
        OrderResponse created = orderService.createOrder(request, userId);
        
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.id())
            .toUri();
        
        return ResponseEntity.created(location).body(created);
    }
}
```

#### BE-105: Audit Logging for Order Creation (2h)

**Description:** Implement structured audit logging for order events.

**Tasks:**
- [ ] Define audit event structure
- [ ] Log on successful creation
- [ ] Log on validation failure
- [ ] Include correlation ID

**Code Example:**

```java
// src/main/java/com/example/ordermgmt/audit/AuditLogger.java
package com.example.ordermgmt.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;

@Component
public class AuditLogger {
    
    private static final Logger auditLog = LoggerFactory.getLogger("AUDIT");
    
    public void logOrderCreated(String orderId, String userId, String customerId, 
                                 String total, int itemCount) {
        auditLog.info(formatEvent("ORDER_CREATED", Map.of(
            "orderId", orderId,
            "userId", userId,
            "customerId", customerId,
            "total", total,
            "itemCount", String.valueOf(itemCount),
            "timestamp", Instant.now().toString(),
            "correlationId", MDC.get("correlationId")
        )));
    }
    
    public void logOrderCancelled(String orderId, String userId, String previousStatus) {
        auditLog.info(formatEvent("ORDER_CANCELLED", Map.of(
            "orderId", orderId,
            "userId", userId,
            "previousStatus", previousStatus,
            "timestamp", Instant.now().toString(),
            "correlationId", MDC.get("correlationId")
        )));
    }
    
    public void logValidationFailed(String userId, String operation, String errors) {
        auditLog.warn(formatEvent("VALIDATION_FAILED", Map.of(
            "userId", userId,
            "operation", operation,
            "errors", errors,
            "timestamp", Instant.now().toString(),
            "correlationId", MDC.get("correlationId")
        )));
    }
    
    private String formatEvent(String eventType, Map<String, String> fields) {
        StringBuilder sb = new StringBuilder();
        sb.append("event=").append(eventType);
        fields.forEach((key, value) -> 
            sb.append(" ").append(key).append("=").append(sanitize(value)));
        return sb.toString();
    }
    
    private String sanitize(String value) {
        if (value == null) return "null";
        // Remove newlines and limit length for log safety
        return value.replace("\n", " ").replace("\r", "")
            .substring(0, Math.min(value.length(), 500));
    }
}
```

---

### Day 4: Cancel Order Endpoint (9h)

#### BE-106: Cancellation Validation Rules (2h)

**Description:** Implement business rules for order cancellation.

**Tasks:**
- [ ] Order must exist
- [ ] Order must belong to user
- [ ] Order must be in cancellable status
- [ ] Return appropriate error codes

**Code Example:**

```java
// src/main/java/com/example/ordermgmt/validation/OrderValidator.java
// Add to existing class

public void validateCancelRequest(String orderId, String userId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new OrderNotFoundException(orderId));
    
    if (!order.getUserId().equals(userId)) {
        throw new AccessDeniedException("Order does not belong to user");
    }
    
    if (!isCancellable(order.getStatus())) {
        throw new OrderNotCancellableException(orderId, order.getStatus());
    }
}

private boolean isCancellable(OrderStatus status) {
    return status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED;
}
```

**Exception Classes:**

```java
// src/main/java/com/example/ordermgmt/exception/OrderNotCancellableException.java
package com.example.ordermgmt.exception;

import com.example.ordermgmt.entity.OrderStatus;

public class OrderNotCancellableException extends RuntimeException {
    
    private final String orderId;
    private final OrderStatus currentStatus;
    
    public OrderNotCancellableException(String orderId, OrderStatus currentStatus) {
        super(String.format("Order %s with status %s cannot be cancelled", orderId, currentStatus));
        this.orderId = orderId;
        this.currentStatus = currentStatus;
    }
    
    public String getOrderId() { return orderId; }
    public OrderStatus getCurrentStatus() { return currentStatus; }
}
```

#### BE-107: OrderService.cancelOrder() (3h)

**Description:** Implement the service method for order cancellation.

**Tasks:**
- [ ] Validate cancellation rules
- [ ] Update order status
- [ ] Record cancellation timestamp
- [ ] Audit log the cancellation

**Code Example:**

```java
// Add to OrderServiceImpl.java

@Override
@Transactional
public void cancelOrder(String orderId, String userId) {
    log.info("Cancelling order: orderId={}, userId={}", orderId, userId);
    
    // Validate cancellation is allowed
    orderValidator.validateCancelRequest(orderId, userId);
    
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new OrderNotFoundException(orderId));
    
    OrderStatus previousStatus = order.getStatus();
    
    // Update status
    order.setStatus(OrderStatus.CANCELLED);
    order.setCancelledAt(Instant.now());
    order.setUpdatedAt(Instant.now());
    
    orderRepository.save(order);
    
    log.info("Order cancelled successfully: orderId={}", orderId);
    
    // Audit event
    auditLogger.logOrderCancelled(orderId, userId, previousStatus.name());
}
```

#### BE-108: OrderController DELETE Endpoint (2h)

**Description:** Add the DELETE endpoint to OrderController.

**Tasks:**
- [ ] Add endpoint method
- [ ] Extract user from security context
- [ ] Return 204 No Content on success
- [ ] Handle not found and conflict errors

**Code Example:**

```java
// Add to OrderController.java

/**
 * Cancel an order.
 * 
 * @param id The order ID to cancel
 * @param jwt The authenticated user's JWT
 * @return 204 No Content on success
 */
@DeleteMapping("/{id}")
public ResponseEntity<Void> cancelOrder(
        @PathVariable String id,
        @AuthenticationPrincipal Jwt jwt) {
    
    String userId = jwt.getSubject();
    
    orderService.cancelOrder(id, userId);
    
    return ResponseEntity.noContent().build();
}
```

#### BE-109: Exception Handling for Cancellation (2h)

**Description:** Add exception handlers for cancellation-specific errors.

**Tasks:**
- [ ] Handle OrderNotCancellableException → 409 Conflict
- [ ] Include current status in error response
- [ ] Follow Problem Details format

**Code Example:**

```java
// src/main/java/com/example/ordermgmt/controller/advice/GlobalExceptionHandler.java
// Add to existing class

@ExceptionHandler(OrderNotCancellableException.class)
public ResponseEntity<ProblemDetail> handleOrderNotCancellable(
        OrderNotCancellableException ex, 
        HttpServletRequest request) {
    
    log.warn("Order cancellation rejected: {}", ex.getMessage());
    
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
        HttpStatus.CONFLICT,
        String.format("Order %s with status %s cannot be cancelled. " +
            "Only PENDING and CONFIRMED orders can be cancelled.",
            ex.getOrderId(), ex.getCurrentStatus())
    );
    
    problem.setTitle("Order Cannot Be Cancelled");
    problem.setType(URI.create("https://api.example.com/problems/order-not-cancellable"));
    problem.setProperty("orderId", ex.getOrderId());
    problem.setProperty("currentStatus", ex.getCurrentStatus().name());
    problem.setProperty("cancellableStatuses", List.of("PENDING", "CONFIRMED"));
    
    return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
}
```

---

### Day 5: Filter/Search Endpoint (9h)

#### BE-110: Query Parameter Handling (3h)

**Description:** Add query parameter support to the list endpoint.

**Tasks:**
- [ ] Add filter parameters to controller
- [ ] Validate parameter values
- [ ] Pass to service layer

**Code Example:**

```java
// Add to OrderController.java

/**
 * List orders with optional filters.
 * 
 * @param status Filter by order status(es)
 * @param from Filter by orders created on or after this date
 * @param to Filter by orders created on or before this date
 * @param search Search by order ID (partial match)
 * @param page Page number (0-based)
 * @param size Page size
 * @param jwt The authenticated user's JWT
 * @return Paginated list of orders
 */
@GetMapping
public ResponseEntity<PagedResponse<OrderResponse>> listOrders(
        @RequestParam(required = false) List<OrderStatus> status,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @AuthenticationPrincipal Jwt jwt) {
    
    String userId = jwt.getSubject();
    
    OrderFilterCriteria criteria = new OrderFilterCriteria(
        userId, status, from, to, search
    );
    
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    
    Page<OrderResponse> orders = orderService.findOrders(criteria, pageable);
    
    return ResponseEntity.ok(PagedResponse.from(orders));
}
```

**Filter Criteria DTO:**

```java
// src/main/java/com/example/ordermgmt/dto/OrderFilterCriteria.java
package com.example.ordermgmt.dto;

import com.example.ordermgmt.entity.OrderStatus;
import java.time.LocalDate;
import java.util.List;

public record OrderFilterCriteria(
    String userId,
    List<OrderStatus> statuses,
    LocalDate fromDate,
    LocalDate toDate,
    String search
) {
    public boolean hasStatusFilter() {
        return statuses != null && !statuses.isEmpty();
    }
    
    public boolean hasDateFilter() {
        return fromDate != null || toDate != null;
    }
    
    public boolean hasSearch() {
        return search != null && !search.isBlank();
    }
}
```

#### BE-111: Specification Pattern for Filtering (4h)

**Description:** Implement JPA Specifications for flexible filtering.

**Tasks:**
- [ ] Create OrderSpecification class
- [ ] Implement filter combinations
- [ ] Handle null/empty filters gracefully
- [ ] Optimize query performance

**Code Example:**

```java
// src/main/java/com/example/ordermgmt/repository/spec/OrderSpecification.java
package com.example.ordermgmt.repository.spec;

import com.example.ordermgmt.dto.OrderFilterCriteria;
import com.example.ordermgmt.entity.Order;
import com.example.ordermgmt.entity.OrderStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class OrderSpecification {
    
    public static Specification<Order> fromCriteria(OrderFilterCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Always filter by user
            predicates.add(cb.equal(root.get("userId"), criteria.userId()));
            
            // Status filter
            if (criteria.hasStatusFilter()) {
                predicates.add(root.get("status").in(criteria.statuses()));
            }
            
            // Date range filter
            if (criteria.fromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                    root.get("createdAt"),
                    criteria.fromDate().atStartOfDay().toInstant(ZoneOffset.UTC)
                ));
            }
            
            if (criteria.toDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(
                    root.get("createdAt"),
                    criteria.toDate().atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC)
                ));
            }
            
            // Search by order ID (case-insensitive partial match)
            if (criteria.hasSearch()) {
                predicates.add(cb.like(
                    cb.lower(root.get("id")),
                    "%" + criteria.search().toLowerCase() + "%"
                ));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
```

**Update Repository:**

```java
// src/main/java/com/example/ordermgmt/repository/OrderRepository.java
package com.example.ordermgmt.repository;

import com.example.ordermgmt.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OrderRepository extends 
        JpaRepository<Order, String>, 
        JpaSpecificationExecutor<Order> {
    
    // Existing methods...
}
```

**Update Service:**

```java
// Add to OrderServiceImpl.java

@Override
@Transactional(readOnly = true)
public Page<OrderResponse> findOrders(OrderFilterCriteria criteria, Pageable pageable) {
    log.debug("Finding orders with filters: statuses={}, from={}, to={}, search={}",
        criteria.statuses(), criteria.fromDate(), criteria.toDate(), criteria.search());
    
    long startTime = System.currentTimeMillis();
    
    Specification<Order> spec = OrderSpecification.fromCriteria(criteria);
    Page<Order> orders = orderRepository.findAll(spec, pageable);
    
    long duration = System.currentTimeMillis() - startTime;
    log.debug("Found {} orders in {}ms", orders.getTotalElements(), duration);
    
    return orders.map(orderMapper::toResponse);
}
```

#### BE-112: Database Indexes (2h)

**Description:** Add database indexes for filter query performance.

**Tasks:**
- [ ] Identify query patterns
- [ ] Create appropriate indexes
- [ ] Verify query plans

**Code Example (Flyway Migration):**

```sql
-- V3__add_order_filter_indexes.sql

-- Index for user ID (most common filter)
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Composite index for user + status (common combination)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Index for date range queries
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Composite for user + date (common combination)
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);

-- Index for order ID search (if using LIKE with suffix wildcard only)
CREATE INDEX idx_orders_id_pattern ON orders(id varchar_pattern_ops);
-- Note: For Oracle, use: CREATE INDEX idx_orders_id ON orders(UPPER(id));
```

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Create Oracle-compatible database indexes for order filtering.

Query patterns:
1. Filter by user_id (always present)
2. Filter by user_id + status (common)
3. Filter by user_id + date range (common)
4. Search by order_id (partial match)

Generate a Flyway migration with appropriate indexes.
Consider Oracle-specific syntax.
```

---

## Week 8: NFR Hardening + Testing (Days 6-10)

### Day 6: Performance Baseline (4h)

#### BE-113: Performance Baseline

**Description:** Establish performance metrics and optimize.

**Tasks:**
- [ ] Add timing metrics to endpoints
- [ ] Identify slow queries
- [ ] Implement query optimizations
- [ ] Set up performance logging

**Code Example:**

```java
// src/main/java/com/example/ordermgmt/config/PerformanceAspect.java
package com.example.ordermgmt.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PerformanceAspect {
    
    private static final Logger log = LoggerFactory.getLogger("PERFORMANCE");
    private static final long SLOW_THRESHOLD_MS = 500;
    
    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object measureEndpointTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().toShortString();
        
        try {
            return joinPoint.proceed();
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            
            if (duration > SLOW_THRESHOLD_MS) {
                log.warn("SLOW_REQUEST method={} duration={}ms threshold={}ms", 
                    methodName, duration, SLOW_THRESHOLD_MS);
            } else {
                log.debug("REQUEST method={} duration={}ms", methodName, duration);
            }
        }
    }
    
    @Around("execution(* com.example.ordermgmt.repository.*.*(..))")
    public Object measureRepositoryTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().toShortString();
        
        try {
            return joinPoint.proceed();
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            
            if (duration > 100) { // 100ms threshold for DB queries
                log.warn("SLOW_QUERY method={} duration={}ms", methodName, duration);
            }
        }
    }
}
```

**N+1 Query Prevention:**

```java
// Add to OrderRepository.java

@EntityGraph(attributePaths = {"items", "shippingAddress"})
Page<Order> findAll(Specification<Order> spec, Pageable pageable);

@EntityGraph(attributePaths = {"items", "shippingAddress"})
Optional<Order> findById(String id);
```

---

### Day 7: Rate Limiting (3h)

#### BE-114: Rate Limiting Configuration

**Description:** Implement API rate limiting for mutations.

**Tasks:**
- [ ] Add rate limiting library
- [ ] Configure per-user limits
- [ ] Return 429 with Retry-After
- [ ] Log rate limit violations

**Code Example (using Bucket4j):**

```java
// src/main/java/com/example/ordermgmt/config/RateLimitConfig.java
package com.example.ordermgmt.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitConfig {
    
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    
    /**
     * Get or create a rate limit bucket for a user.
     * Limit: 100 requests per minute for mutations.
     */
    public Bucket resolveBucket(String userId) {
        return buckets.computeIfAbsent(userId, this::createBucket);
    }
    
    private Bucket createBucket(String userId) {
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }
}
```

**Rate Limit Interceptor:**

```java
// src/main/java/com/example/ordermgmt/config/RateLimitInterceptor.java
package com.example.ordermgmt.config;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    
    private static final Logger log = LoggerFactory.getLogger(RateLimitInterceptor.class);
    
    private final RateLimitConfig rateLimitConfig;
    
    public RateLimitInterceptor(RateLimitConfig rateLimitConfig) {
        this.rateLimitConfig = rateLimitConfig;
    }
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, 
                            Object handler) throws Exception {
        
        // Only rate limit mutations
        String method = request.getMethod();
        if (!method.equals("POST") && !method.equals("PUT") && 
            !method.equals("PATCH") && !method.equals("DELETE")) {
            return true;
        }
        
        String userId = extractUserId();
        if (userId == null) {
            return true; // Let authentication handle it
        }
        
        Bucket bucket = rateLimitConfig.resolveBucket(userId);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (probe.isConsumed()) {
            response.setHeader("X-Rate-Limit-Remaining", 
                String.valueOf(probe.getRemainingTokens()));
            return true;
        }
        
        // Rate limit exceeded
        long waitSeconds = probe.getNanosToWaitForRefill() / 1_000_000_000;
        
        log.warn("RATE_LIMIT_EXCEEDED userId={} endpoint={} retryAfter={}s",
            userId, request.getRequestURI(), waitSeconds);
        
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(waitSeconds));
        response.setContentType("application/problem+json");
        response.getWriter().write("""
            {
                "type": "about:blank",
                "title": "Too Many Requests",
                "status": 429,
                "detail": "Rate limit exceeded. Please retry after %d seconds."
            }
            """.formatted(waitSeconds));
        
        return false;
    }
    
    private String extractUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        }
        return null;
    }
}
```

---

### Days 8-10: Testing (18h)

#### BE-115: Unit Tests for New Endpoints (8h)

**Description:** Write comprehensive unit tests for Sprint 2 functionality.

**Code Example:**

```java
// src/test/java/com/example/ordermgmt/service/OrderServiceCreateTest.java
package com.example.ordermgmt.service;

import com.example.ordermgmt.dto.OrderCreateRequest;
import com.example.ordermgmt.dto.OrderResponse;
import com.example.ordermgmt.entity.*;
import com.example.ordermgmt.exception.ValidationException;
import com.example.ordermgmt.mapper.OrderMapper;
import com.example.ordermgmt.repository.*;
import com.example.ordermgmt.service.impl.OrderServiceImpl;
import com.example.ordermgmt.validation.OrderValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceCreateTest {
    
    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private ItemRepository itemRepository;
    
    @Mock
    private OrderValidator orderValidator;
    
    @Mock
    private OrderMapper orderMapper;
    
    @InjectMocks
    private OrderServiceImpl orderService;
    
    @Captor
    private ArgumentCaptor<Order> orderCaptor;
    
    private static final String USER_ID = "user-123";
    private static final String CUSTOMER_ID = "customer-456";
    
    @Nested
    @DisplayName("createOrder")
    class CreateOrder {
        
        private OrderCreateRequest validRequest;
        private Item mockItem;
        
        @BeforeEach
        void setUp() {
            validRequest = new OrderCreateRequest(
                CUSTOMER_ID,
                List.of(new OrderCreateRequest.OrderItemRequest("item-1", 2)),
                new OrderCreateRequest.AddressRequest(
                    "123 Main St", "Springfield", "IL", "62701"
                ),
                "Test notes"
            );
            
            mockItem = new Item();
            mockItem.setId("item-1");
            mockItem.setName("Widget A");
            mockItem.setPrice(BigDecimal.valueOf(25.00));
            mockItem.setAvailable(true);
            mockItem.setStockQuantity(100);
        }
        
        @Test
        @DisplayName("should create order with valid request")
        void shouldCreateOrderWithValidRequest() {
            // Arrange
            when(itemRepository.findById("item-1")).thenReturn(Optional.of(mockItem));
            when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
            when(orderMapper.toResponse(any(Order.class))).thenReturn(
                new OrderResponse("order-id", CUSTOMER_ID, OrderStatus.PENDING, 
                    BigDecimal.valueOf(54.00), null, null, null, null, null)
            );
            
            // Act
            OrderResponse response = orderService.createOrder(validRequest, USER_ID);
            
            // Assert
            assertThat(response).isNotNull();
            
            verify(orderValidator).validateCreateRequest(validRequest, USER_ID);
            verify(orderRepository).save(orderCaptor.capture());
            
            Order savedOrder = orderCaptor.getValue();
            assertThat(savedOrder.getUserId()).isEqualTo(USER_ID);
            assertThat(savedOrder.getCustomerId()).isEqualTo(CUSTOMER_ID);
            assertThat(savedOrder.getStatus()).isEqualTo(OrderStatus.PENDING);
            assertThat(savedOrder.getItems()).hasSize(1);
            assertThat(savedOrder.getNotes()).isEqualTo("Test notes");
        }
        
        @Test
        @DisplayName("should calculate totals correctly")
        void shouldCalculateTotalsCorrectly() {
            // Arrange
            when(itemRepository.findById("item-1")).thenReturn(Optional.of(mockItem));
            when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
            when(orderMapper.toResponse(any())).thenReturn(mock(OrderResponse.class));
            
            // Act
            orderService.createOrder(validRequest, USER_ID);
            
            // Assert
            verify(orderRepository).save(orderCaptor.capture());
            Order savedOrder = orderCaptor.getValue();
            
            // 2 items × $25.00 = $50.00 subtotal
            assertThat(savedOrder.getSubtotal()).isEqualByComparingTo("50.00");
            
            // 8% tax = $4.00
            assertThat(savedOrder.getTax()).isEqualByComparingTo("4.00");
            
            // Total = $54.00
            assertThat(savedOrder.getTotal()).isEqualByComparingTo("54.00");
        }
        
        @Test
        @DisplayName("should throw when validation fails")
        void shouldThrowWhenValidationFails() {
            // Arrange
            doThrow(new ValidationException("Validation failed", null))
                .when(orderValidator).validateCreateRequest(any(), any());
            
            // Act & Assert
            assertThatThrownBy(() -> orderService.createOrder(validRequest, USER_ID))
                .isInstanceOf(ValidationException.class);
            
            verify(orderRepository, never()).save(any());
        }
        
        @Test
        @DisplayName("should set correct initial status")
        void shouldSetCorrectInitialStatus() {
            // Arrange
            when(itemRepository.findById(any())).thenReturn(Optional.of(mockItem));
            when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(orderMapper.toResponse(any())).thenReturn(mock(OrderResponse.class));
            
            // Act
            orderService.createOrder(validRequest, USER_ID);
            
            // Assert
            verify(orderRepository).save(orderCaptor.capture());
            assertThat(orderCaptor.getValue().getStatus()).isEqualTo(OrderStatus.PENDING);
        }
    }
}
```

#### BE-116: Integration Tests (6h)

**Description:** Write MockMvc integration tests for new endpoints.

**Code Example:**

```java
// src/test/java/com/example/ordermgmt/controller/OrderControllerCreateIntegrationTest.java
package com.example.ordermgmt.controller;

import com.example.ordermgmt.dto.OrderCreateRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class OrderControllerCreateIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @DisplayName("POST /api/v1/orders - should create order and return 201")
    @WithMockUser(username = "test-user")
    void shouldCreateOrderAndReturn201() throws Exception {
        OrderCreateRequest request = new OrderCreateRequest(
            "customer-1",
            List.of(new OrderCreateRequest.OrderItemRequest("item-1", 2)),
            new OrderCreateRequest.AddressRequest(
                "123 Main St", "Springfield", "IL", "62701"
            ),
            null
        );
        
        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"))
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.status").value("PENDING"))
            .andExpect(jsonPath("$.customerId").value("customer-1"));
    }
    
    @Test
    @DisplayName("POST /api/v1/orders - should return 400 for missing required fields")
    @WithMockUser(username = "test-user")
    void shouldReturn400ForMissingRequiredFields() throws Exception {
        OrderCreateRequest request = new OrderCreateRequest(
            null, // Missing customer
            List.of(), // Empty items
            null, // Missing address
            null
        );
        
        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.title").value("Bad Request"))
            .andExpect(jsonPath("$.errors.customerId").exists())
            .andExpect(jsonPath("$.errors.items").exists())
            .andExpect(jsonPath("$.errors.shippingAddress").exists());
    }
    
    @Test
    @DisplayName("DELETE /api/v1/orders/{id} - should cancel order and return 204")
    @WithMockUser(username = "test-user")
    void shouldCancelOrderAndReturn204() throws Exception {
        // Create order first
        String orderId = createTestOrder();
        
        mockMvc.perform(delete("/api/v1/orders/" + orderId))
            .andExpect(status().isNoContent());
    }
    
    @Test
    @DisplayName("DELETE /api/v1/orders/{id} - should return 409 for non-cancellable order")
    @WithMockUser(username = "test-user")
    void shouldReturn409ForNonCancellableOrder() throws Exception {
        String shippedOrderId = createShippedTestOrder();
        
        mockMvc.perform(delete("/api/v1/orders/" + shippedOrderId))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.title").value("Order Cannot Be Cancelled"))
            .andExpect(jsonPath("$.currentStatus").value("SHIPPED"));
    }
    
    @Test
    @DisplayName("GET /api/v1/orders?status=PENDING - should filter by status")
    @WithMockUser(username = "test-user")
    void shouldFilterByStatus() throws Exception {
        mockMvc.perform(get("/api/v1/orders")
                .param("status", "PENDING"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[*].status").value(
                org.hamcrest.Matchers.everyItem(org.hamcrest.Matchers.is("PENDING"))
            ));
    }
    
    // Helper methods...
    private String createTestOrder() {
        // Implementation
        return "test-order-id";
    }
    
    private String createShippedTestOrder() {
        // Implementation
        return "shipped-order-id";
    }
}
```

#### BE-117: Contract Validation Tests (4h)

**Description:** Write tests to validate API matches OpenAPI contract.

**Code Example:**

```java
// src/test/java/com/example/ordermgmt/contract/OrderContractTest.java
package com.example.ordermgmt.contract;

import io.restassured.RestAssured;
import io.restassured.module.jsv.JsonSchemaValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class OrderContractTest {
    
    @LocalServerPort
    private int port;
    
    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.basePath = "/api/v1";
    }
    
    @Test
    @DisplayName("POST /orders response should match OrderResponse schema")
    void createOrderResponseShouldMatchSchema() {
        given()
            .auth().oauth2(getTestToken())
            .contentType("application/json")
            .body("""
                {
                    "customerId": "customer-1",
                    "items": [{"itemId": "item-1", "quantity": 2}],
                    "shippingAddress": {
                        "street": "123 Main St",
                        "city": "Springfield",
                        "state": "IL",
                        "postalCode": "62701"
                    }
                }
                """)
        .when()
            .post("/orders")
        .then()
            .statusCode(201)
            .body(JsonSchemaValidator.matchesJsonSchemaInClasspath(
                "schemas/OrderResponse.json"));
    }
    
    @Test
    @DisplayName("Validation error response should match ProblemDetail schema")
    void validationErrorShouldMatchProblemDetailSchema() {
        given()
            .auth().oauth2(getTestToken())
            .contentType("application/json")
            .body("{}")  // Empty body triggers validation errors
        .when()
            .post("/orders")
        .then()
            .statusCode(400)
            .contentType("application/problem+json")
            .body("type", notNullValue())
            .body("title", equalTo("Bad Request"))
            .body("status", equalTo(400))
            .body("errors", notNullValue());
    }
    
    @Test
    @DisplayName("DELETE /orders/{id} conflict should return Problem Details")
    void cancelConflictShouldReturnProblemDetails() {
        String shippedOrderId = createShippedOrder();
        
        given()
            .auth().oauth2(getTestToken())
        .when()
            .delete("/orders/" + shippedOrderId)
        .then()
            .statusCode(409)
            .contentType("application/problem+json")
            .body("title", equalTo("Order Cannot Be Cancelled"))
            .body("status", equalTo(409))
            .body("orderId", equalTo(shippedOrderId))
            .body("currentStatus", equalTo("SHIPPED"));
    }
    
    @Test
    @DisplayName("GET /orders with filters should return PagedResponse schema")
    void listWithFiltersShouldMatchPagedResponseSchema() {
        given()
            .auth().oauth2(getTestToken())
            .queryParam("status", "PENDING")
            .queryParam("from", "2026-01-01")
        .when()
            .get("/orders")
        .then()
            .statusCode(200)
            .body("data", instanceOf(List.class))
            .body("total", greaterThanOrEqualTo(0))
            .body("page", greaterThanOrEqualTo(0))
            .body("pageSize", greaterThan(0));
    }
    
    // Helper methods...
    private String getTestToken() {
        return "test-jwt-token";
    }
    
    private String createShippedOrder() {
        return "shipped-order-id";
    }
}
```

---

## Task Summary

| ID | Task | Day | Hours | Status |
|----|------|-----|-------|--------|
| BE-101 | OrderCreateRequest DTO | 2 | 2h | ⬜ |
| BE-102 | Create validation rules | 2 | 3h | ⬜ |
| BE-103 | OrderService.createOrder() | 2-3 | 4h | ⬜ |
| BE-104 | POST endpoint | 3 | 3h | ⬜ |
| BE-105 | Audit logging (create) | 3 | 2h | ⬜ |
| BE-106 | Cancel validation rules | 4 | 2h | ⬜ |
| BE-107 | OrderService.cancelOrder() | 4 | 3h | ⬜ |
| BE-108 | DELETE endpoint | 4 | 2h | ⬜ |
| BE-109 | Exception handling | 4 | 2h | ⬜ |
| BE-110 | Query parameters | 5 | 3h | ⬜ |
| BE-111 | OrderSpecification | 5 | 4h | ⬜ |
| BE-112 | Database indexes | 5 | 2h | ⬜ |
| BE-113 | Performance baseline | 6 | 4h | ⬜ |
| BE-114 | Rate limiting | 7 | 3h | ⬜ |
| BE-115 | Unit tests | 8 | 8h | ⬜ |
| BE-116 | Integration tests | 9 | 6h | ⬜ |
| BE-117 | Contract tests | 10 | 4h | ⬜ |
| **Total** | | | **57h** | |

---

## Copilot Context

```
Sprint 2 Backend Tasks:
- Focus: Expand endpoints + NFR hardening
- New endpoints: POST /orders, DELETE /orders/{id}, GET /orders (with filters)
- Validation: Bean Validation + custom business rules
- Performance: Indexes, EntityGraph, timing metrics
- Rate limiting: 100 req/min per user for mutations
- Testing: Unit + Integration + Contract validation

Stack: Spring Boot 3, Spring Security, Spring Data JPA, Oracle
Patterns: Follow Sprint 1 patterns, Problem Details for errors
Coverage target: ≥70%
```
