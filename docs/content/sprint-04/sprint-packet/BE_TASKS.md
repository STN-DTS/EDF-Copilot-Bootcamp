# Sprint 4 — Backend Tasks

> **Sprint Focus:** Performance optimization, documentation, monitoring, and deployment readiness.

**Total Tasks:** 16  
**Estimated Hours:** ~45 hours  
**Owner:** Backend Team

---

## Task Summary by Day

| Day | Focus | Tasks | Hours |
|-----|-------|-------|-------|
| 2 | Performance Baseline | Analysis | 4 |
| 3 | Query Optimization | BE-401, BE-402, BE-403 | 9 |
| 5 | Caching + Load Testing | BE-404, BE-405 | 7 |
| 6 | Documentation | BE-406, BE-407 | 6 |
| 7 | Runbooks | BE-408, BE-409 | 6 |
| 8 | Monitoring | BE-410, BE-411, BE-412 | 8 |
| 9 | Deployment | BE-413, BE-414, BE-415 | 7 |
| 10 | Gate 5 | BE-416 | 2 |

---

## Week 11: Performance Optimization (Days 2-5)

### Day 2: Performance Baseline Analysis

Before optimization, establish baseline metrics.

**Baseline Metrics to Capture:**

```bash
# Run load test baseline
k6 run scripts/load-test.js --out json=baseline.json

# Query analysis
psql -d orders -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 20;"

# JVM profiling
java -XX:+FlightRecorder -XX:StartFlightRecording=duration=60s,filename=baseline.jfr -jar app.jar
```

**Expected Baseline Documentation:**

| Metric | Current | Target |
|--------|---------|--------|
| GET /orders p95 | | <500ms |
| GET /orders/{id} p95 | | <200ms |
| POST /orders p95 | | <500ms |
| Database query time | | <100ms |
| Connection pool usage | | <80% |

---

### Day 3: Query Optimization

---

#### BE-401: Query Optimization

**Story:** US-012 — Performance Optimization  
**Hours:** 4  
**Priority:** P0

**Description:**
Analyze and optimize slow database queries using EXPLAIN, indexes, and query restructuring.

**Acceptance Criteria:**
- [ ] All queries analyzed with EXPLAIN
- [ ] Slow queries (<100ms) identified and optimized
- [ ] Missing indexes added
- [ ] Query plans documented

**Code Example:**

```java
// src/main/java/com/example/orders/repository/OrderRepository.java

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Optimized query using projection for list view.
     * Only fetches columns needed for summary display.
     * 
     * Before: SELECT * FROM orders o JOIN customers c ...
     * After:  SELECT o.id, o.status, o.created_at, o.total_amount, c.id, c.name ...
     */
    @Query("""
        SELECT new com.example.orders.dto.OrderSummaryDto(
            o.id,
            o.status,
            o.createdAt,
            o.totalAmount,
            c.id,
            c.name
        )
        FROM Order o
        JOIN o.customer c
        WHERE (:status IS NULL OR o.status = :status)
        AND (:customerId IS NULL OR c.id = :customerId)
        AND (:createdBy IS NULL OR o.createdBy = :createdBy)
        ORDER BY o.createdAt DESC
        """)
    Page<OrderSummaryDto> findOrderSummaries(
        @Param("status") OrderStatus status,
        @Param("customerId") Long customerId,
        @Param("createdBy") String createdBy,
        Pageable pageable
    );
    
    /**
     * Count query for pagination - optimized with covering index.
     */
    @Query("""
        SELECT COUNT(o.id)
        FROM Order o
        WHERE (:status IS NULL OR o.status = :status)
        AND (:customerId IS NULL OR o.customer.id = :customerId)
        """)
    long countByFilters(
        @Param("status") OrderStatus status,
        @Param("customerId") Long customerId
    );
}
```

```sql
-- Database indexes for optimized queries
-- migrations/V4_1__performance_indexes.sql

-- Composite index for order list filtering
CREATE INDEX idx_orders_status_created_at 
ON orders(status, created_at DESC);

-- Covering index for order summaries
CREATE INDEX idx_orders_summary 
ON orders(id, status, created_at, total_amount, customer_id, created_by);

-- Index for customer lookup
CREATE INDEX idx_orders_customer_id 
ON orders(customer_id);

-- Index for user's orders
CREATE INDEX idx_orders_created_by 
ON orders(created_by, created_at DESC);

-- Partial index for active orders (common query)
CREATE INDEX idx_orders_active 
ON orders(created_at DESC) 
WHERE status IN ('PENDING', 'CONFIRMED', 'SHIPPED');

-- Analyze table statistics
ANALYZE orders;
```

**Query Analysis Script:**

```sql
-- Identify slow queries
SELECT 
    query,
    calls,
    total_time / 1000 as total_seconds,
    mean_time / 1000 as mean_seconds,
    rows
FROM pg_stat_statements
WHERE query LIKE '%orders%'
ORDER BY mean_time DESC
LIMIT 10;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'orders'
ORDER BY idx_scan DESC;
```

---

#### BE-402: N+1 Query Elimination

**Story:** US-012 — Performance Optimization  
**Hours:** 3  
**Priority:** P0

**Description:**
Eliminate N+1 query patterns using EntityGraph, batch loading, and join fetching.

**Code Example:**

```java
// src/main/java/com/example/orders/repository/OrderRepository.java

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Fetch order with all associations in single query.
     * Avoids N+1 when accessing customer and items.
     */
    @EntityGraph(attributePaths = {
        "customer",
        "items",
        "items.item"
    })
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(@Param("id") Long id);
    
    /**
     * Batch fetch orders with items for list display.
     */
    @EntityGraph(attributePaths = {"customer"})
    @Query("SELECT o FROM Order o WHERE o.id IN :ids")
    List<Order> findByIdsWithCustomer(@Param("ids") List<Long> ids);
}

// src/main/java/com/example/orders/config/JpaConfig.java

@Configuration
public class JpaConfig {
    
    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer() {
        return (properties) -> {
            // Enable batch fetching for collections
            properties.put("hibernate.default_batch_fetch_size", 25);
            
            // Enable statistics for monitoring
            properties.put("hibernate.generate_statistics", true);
            
            // Log slow queries
            properties.put("hibernate.session.events.log.LOG_QUERIES_SLOWER_THAN_MS", 100);
        };
    }
}
```

```java
// src/main/java/com/example/orders/service/OrderService.java

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    
    /**
     * Get order detail with single query.
     */
    @Transactional(readOnly = true)
    public OrderDetailDto getOrderDetail(Long id) {
        // Uses EntityGraph - single query for order + customer + items
        Order order = orderRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new OrderNotFoundException(id));
        
        return orderMapper.toDetailDto(order);
    }
    
    /**
     * Get orders for dashboard - optimized batch loading.
     */
    @Transactional(readOnly = true)
    public List<OrderSummaryDto> getRecentOrders(String username, int limit) {
        // First query: get IDs with pagination
        List<Long> orderIds = orderRepository.findRecentOrderIds(username, limit);
        
        if (orderIds.isEmpty()) {
            return List.of();
        }
        
        // Second query: batch fetch with associations
        List<Order> orders = orderRepository.findByIdsWithCustomer(orderIds);
        
        // Map maintaining original order
        Map<Long, Order> orderMap = orders.stream()
            .collect(Collectors.toMap(Order::getId, Function.identity()));
        
        return orderIds.stream()
            .map(orderMap::get)
            .filter(Objects::nonNull)
            .map(orderMapper::toSummaryDto)
            .toList();
    }
}
```

**N+1 Detection Test:**

```java
// src/test/java/com/example/orders/repository/OrderRepositoryN1Test.java

@DataJpaTest
@Slf4j
class OrderRepositoryN1Test {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private EntityManager entityManager;
    
    @PersistenceContext
    private SessionFactory sessionFactory;
    
    @Test
    void findByIdWithDetails_shouldExecuteSingleQuery() {
        // Given
        Long orderId = createTestOrder();
        entityManager.clear(); // Clear first-level cache
        
        // Enable statistics
        Statistics stats = sessionFactory.getStatistics();
        stats.setStatisticsEnabled(true);
        stats.clear();
        
        // When
        Order order = orderRepository.findByIdWithDetails(orderId).orElseThrow();
        
        // Access all associations (would trigger N+1 if not fetched)
        String customerName = order.getCustomer().getName();
        int itemCount = order.getItems().size();
        order.getItems().forEach(item -> item.getItem().getName());
        
        // Then
        long queryCount = stats.getPrepareStatementCount();
        log.info("Query count: {}", queryCount);
        
        assertThat(queryCount).isEqualTo(1); // Single query only
    }
}
```

---

#### BE-403: Connection Pool Tuning

**Story:** US-012 — Performance Optimization  
**Hours:** 2  
**Priority:** P1

**Description:**
Optimize HikariCP connection pool settings for production load.

**Code Example:**

```yaml
# application-production.yml

spring:
  datasource:
    hikari:
      # Pool sizing
      maximum-pool-size: 20          # Based on: (core_count * 2) + disk_spindles
      minimum-idle: 5                # Keep minimum connections warm
      
      # Timeouts
      connection-timeout: 30000      # 30s - max wait for connection
      idle-timeout: 600000           # 10min - close idle connections
      max-lifetime: 1800000          # 30min - refresh connections
      
      # Validation
      validation-timeout: 5000       # 5s - connection validation
      
      # Leak detection (for development/staging)
      leak-detection-threshold: 60000  # 60s - log potential leaks
      
      # Connection testing
      connection-test-query: SELECT 1
      
      # Pool name for monitoring
      pool-name: OrdersHikariPool
      
      # Metrics
      register-mbeans: true

# Monitoring endpoint for pool stats
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,hikaricp
  metrics:
    tags:
      application: order-management
```

```java
// src/main/java/com/example/orders/config/DataSourceConfig.java

@Configuration
@Slf4j
public class DataSourceConfig {
    
    @Bean
    @ConfigurationProperties("spring.datasource.hikari")
    public HikariConfig hikariConfig() {
        HikariConfig config = new HikariConfig();
        
        // Add metrics listener
        config.setMetricRegistry(new MetricRegistry());
        
        // Log pool events
        config.addHealthCheckProperty("expected99thPercentileMs", "100");
        
        return config;
    }
    
    @Bean
    public DataSource dataSource(HikariConfig hikariConfig) {
        HikariDataSource dataSource = new HikariDataSource(hikariConfig);
        
        log.info("HikariCP pool configured: maxPoolSize={}, minIdle={}", 
            hikariConfig.getMaximumPoolSize(),
            hikariConfig.getMinimumIdle());
        
        return dataSource;
    }
}
```

**Connection Pool Metrics:**

```java
// src/main/java/com/example/orders/actuator/HikariPoolHealthIndicator.java

@Component
@RequiredArgsConstructor
public class HikariPoolHealthIndicator implements HealthIndicator {
    
    private final DataSource dataSource;
    
    @Override
    public Health health() {
        if (dataSource instanceof HikariDataSource hikari) {
            HikariPoolMXBean pool = hikari.getHikariPoolMXBean();
            
            int activeConnections = pool.getActiveConnections();
            int idleConnections = pool.getIdleConnections();
            int totalConnections = pool.getTotalConnections();
            int maxPoolSize = hikari.getMaximumPoolSize();
            
            double utilization = (double) activeConnections / maxPoolSize;
            
            Health.Builder builder = utilization > 0.9 
                ? Health.down() 
                : Health.up();
            
            return builder
                .withDetail("active", activeConnections)
                .withDetail("idle", idleConnections)
                .withDetail("total", totalConnections)
                .withDetail("max", maxPoolSize)
                .withDetail("utilization", String.format("%.1f%%", utilization * 100))
                .withDetail("threadsAwaitingConnection", pool.getThreadsAwaitingConnection())
                .build();
        }
        
        return Health.unknown().build();
    }
}
```

---

### Day 5: Caching + Load Testing

---

#### BE-404: Caching Implementation

**Story:** US-012 — Performance Optimization  
**Hours:** 4  
**Priority:** P0

**Description:**
Implement caching for frequently accessed, rarely changing data.

**Code Example:**

```java
// src/main/java/com/example/orders/config/CacheConfig.java

@Configuration
@EnableCaching
@Slf4j
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        
        // Default cache settings
        manager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(Duration.ofMinutes(10))
            .recordStats()
        );
        
        // Register specific caches
        manager.setCacheNames(List.of(
            "customers",
            "items",
            "customersByName"
        ));
        
        return manager;
    }
    
    /**
     * Custom cache for order counts (short TTL).
     */
    @Bean
    public Cache<String, Long> orderCountCache() {
        return Caffeine.newBuilder()
            .maximumSize(100)
            .expireAfterWrite(Duration.ofMinutes(1))
            .build();
    }
}

// src/main/java/com/example/orders/service/CustomerService.java

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    
    /**
     * Cached customer lookup - customers change infrequently.
     */
    @Cacheable(value = "customers", key = "#id")
    public CustomerDto findById(Long id) {
        log.debug("Cache miss for customer {}", id);
        return customerRepository.findById(id)
            .map(CustomerMapper::toDto)
            .orElseThrow(() -> new CustomerNotFoundException(id));
    }
    
    /**
     * Cached search by name.
     */
    @Cacheable(value = "customersByName", key = "#name.toLowerCase()")
    public List<CustomerDto> findByName(String name) {
        log.debug("Cache miss for customer search: {}", name);
        return customerRepository.findByNameContainingIgnoreCase(name).stream()
            .map(CustomerMapper::toDto)
            .toList();
    }
    
    /**
     * Invalidate cache on update.
     */
    @CacheEvict(value = {"customers", "customersByName"}, allEntries = true)
    @CachePut(value = "customers", key = "#id")
    public CustomerDto update(Long id, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException(id));
        
        customer.setName(request.name());
        customer.setEmail(request.email());
        
        return CustomerMapper.toDto(customerRepository.save(customer));
    }
}
```

```java
// src/main/java/com/example/orders/controller/CacheController.java
// Cache management endpoints (admin only)

@RestController
@RequestMapping("/api/v1/admin/cache")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Cache Management", description = "Admin endpoints for cache control")
public class CacheController {
    
    private final CacheManager cacheManager;
    
    @GetMapping("/stats")
    public Map<String, CacheStats> getCacheStats() {
        Map<String, CacheStats> stats = new HashMap<>();
        
        cacheManager.getCacheNames().forEach(name -> {
            Cache cache = cacheManager.getCache(name);
            if (cache != null && cache.getNativeCache() instanceof CaffeineCache caffeineCache) {
                com.github.benmanes.caffeine.cache.stats.CacheStats s = 
                    caffeineCache.getIfPresent("__stats__") != null ? null : null;
                // Collect stats
            }
        });
        
        return stats;
    }
    
    @DeleteMapping("/{cacheName}")
    public ResponseEntity<Void> clearCache(@PathVariable String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping
    public ResponseEntity<Void> clearAllCaches() {
        cacheManager.getCacheNames()
            .forEach(name -> cacheManager.getCache(name).clear());
        return ResponseEntity.noContent().build();
    }
}
```

**HTTP Cache Headers:**

```java
// src/main/java/com/example/orders/config/WebCacheConfig.java

@Configuration
public class WebCacheConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Static resources - long cache
        registry.addResourceHandler("/static/**")
            .addResourceLocations("classpath:/static/")
            .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS)
                .cachePublic());
        
        // API docs - moderate cache
        registry.addResourceHandler("/docs/**")
            .addResourceLocations("classpath:/docs/")
            .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS)
                .cachePublic());
    }
}

// src/main/java/com/example/orders/controller/ItemController.java

@GetMapping("/{id}")
public ResponseEntity<ItemDto> getItem(@PathVariable Long id) {
    ItemDto item = itemService.findById(id);
    
    return ResponseEntity.ok()
        // ETag for conditional requests
        .eTag(String.valueOf(item.version()))
        // Cache for 5 minutes
        .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES).cachePrivate())
        .body(item);
}
```

---

#### BE-405: Load Testing

**Story:** US-012 — Performance Optimization  
**Hours:** 3  
**Priority:** P0

**Description:**
Implement and run load tests to verify performance targets.

**k6 Load Test:**

```javascript
// scripts/load-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const orderListTrend = new Trend('order_list_duration');
const orderDetailTrend = new Trend('order_detail_duration');

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up
    { duration: '1m', target: 50 },    // Hold at 50 users
    { duration: '2m', target: 100 },   // Ramp to 100 users
    { duration: '1m', target: 100 },   // Hold at 100 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    errors: ['rate<0.01'],              // Error rate under 1%
    order_list_duration: ['p(95)<500'],
    order_detail_duration: ['p(95)<200'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TOKEN = __ENV.AUTH_TOKEN;

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

export default function () {
  // Scenario 1: List orders
  {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/api/v1/orders?page=0&size=20`, { headers });
    orderListTrend.add(Date.now() - start);
    
    const success = check(res, {
      'order list status 200': (r) => r.status === 200,
      'order list has content': (r) => r.json().content.length > 0,
    });
    
    errorRate.add(!success);
  }
  
  sleep(1);
  
  // Scenario 2: Get order detail
  {
    const orderId = Math.floor(Math.random() * 100) + 1;
    const start = Date.now();
    const res = http.get(`${BASE_URL}/api/v1/orders/${orderId}`, { headers });
    orderDetailTrend.add(Date.now() - start);
    
    const success = check(res, {
      'order detail status 200 or 404': (r) => [200, 404].includes(r.status),
    });
    
    errorRate.add(!success);
  }
  
  sleep(2);
  
  // Scenario 3: Create order (less frequent)
  if (Math.random() < 0.1) {
    const payload = JSON.stringify({
      customerId: Math.floor(Math.random() * 10) + 1,
      items: [
        { itemId: 1, quantity: 2 },
        { itemId: 2, quantity: 1 },
      ],
    });
    
    const res = http.post(`${BASE_URL}/api/v1/orders`, payload, { headers });
    
    check(res, {
      'create order status 201': (r) => r.status === 201,
    });
  }
  
  sleep(1);
}
```

**JMeter Test Plan:**

```xml
<!-- scripts/order-load-test.jmx -->
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testname="Order API Load Test">
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments">
        <collectionProp name="Arguments.arguments">
          <elementProp name="BASE_URL" elementType="Argument">
            <stringProp name="Argument.name">BASE_URL</stringProp>
            <stringProp name="Argument.value">http://localhost:8080</stringProp>
          </elementProp>
        </collectionProp>
      </elementProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup guiclass="ThreadGroupGui" testname="Order Users">
        <intProp name="ThreadGroup.num_threads">100</intProp>
        <intProp name="ThreadGroup.ramp_time">30</intProp>
        <longProp name="ThreadGroup.duration">300</longProp>
      </ThreadGroup>
      <!-- Additional samplers... -->
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```

---

## Week 12: Documentation + Deployment (Days 6-10)

### Day 6: Documentation

---

#### BE-406: API Documentation

**Story:** US-014 — Complete Documentation  
**Hours:** 4  
**Priority:** P0

**Description:**
Complete OpenAPI documentation with examples and descriptions.

**Code Example:**

```java
// src/main/java/com/example/orders/controller/OrderController.java

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management operations")
public class OrderController {
    
    @Operation(
        summary = "List orders",
        description = "Returns a paginated list of orders. Supports filtering by status and customer.",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Orders retrieved successfully",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = PagedOrderResponse.class),
                    examples = @ExampleObject(
                        name = "Success",
                        value = """
                            {
                              "content": [
                                {
                                  "id": 1,
                                  "status": "PENDING",
                                  "customerName": "Acme Corp",
                                  "totalAmount": 150.00,
                                  "createdAt": "2026-01-20T10:30:00Z"
                                }
                              ],
                              "page": 0,
                              "size": 20,
                              "totalElements": 1,
                              "totalPages": 1
                            }
                            """
                    )
                )
            ),
            @ApiResponse(
                responseCode = "401",
                description = "Unauthorized",
                content = @Content(schema = @Schema(implementation = ProblemDetail.class))
            )
        }
    )
    @GetMapping
    public ResponseEntity<PagedResponse<OrderSummaryDto>> listOrders(
            @Parameter(description = "Filter by order status")
            @RequestParam(required = false) OrderStatus status,
            
            @Parameter(description = "Filter by customer ID")
            @RequestParam(required = false) Long customerId,
            
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            
            @AuthenticationPrincipal UserDetails user) {
        // Implementation
    }
    
    @Operation(
        summary = "Create order",
        description = "Creates a new order for the specified customer with items.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Order creation request",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = OrderCreateRequest.class),
                examples = @ExampleObject(
                    name = "Create Order",
                    value = """
                        {
                          "customerId": 1,
                          "items": [
                            {"itemId": 1, "quantity": 2},
                            {"itemId": 2, "quantity": 1}
                          ],
                          "notes": "Rush delivery requested"
                        }
                        """
                )
            )
        )
    )
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @Valid @RequestBody OrderCreateRequest request,
            @AuthenticationPrincipal UserDetails user) {
        // Implementation
    }
}
```

```java
// src/main/java/com/example/orders/config/OpenApiConfig.java

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Order Management API")
                .version("1.0.0")
                .description("""
                    REST API for Order Management System.
                    
                    ## Authentication
                    This API uses OAuth 2.0 Bearer tokens. Include the token in the Authorization header:
                    ```
                    Authorization: Bearer <token>
                    ```
                    
                    ## Error Handling
                    Errors are returned using RFC 7807 Problem Details format.
                    
                    ## Rate Limiting
                    API requests are limited to 100 requests per minute per user.
                    """)
                .contact(new Contact()
                    .name("API Support")
                    .email("api-support@example.com"))
                .license(new License()
                    .name("Internal Use Only")))
            .servers(List.of(
                new Server().url("/").description("Current server"),
                new Server().url("https://api.example.com").description("Production")))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")))
            .security(List.of(new SecurityRequirement().addList("bearerAuth")));
    }
}
```

---

#### BE-407: Integration Guide

**Story:** US-014 — Complete Documentation  
**Hours:** 2  
**Priority:** P1

**Description:**
Create developer integration guide with examples.

**Documentation Template:**

```markdown
# Order Management API - Integration Guide

## Quick Start

### 1. Authentication

Obtain a token from the identity provider:

```bash
curl -X POST https://auth.example.com/oauth/token \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

### 2. First API Call

```bash
curl https://api.example.com/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Workflows

### Creating an Order

```bash
curl -X POST https://api.example.com/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "items": [
      {"itemId": 1, "quantity": 2}
    ]
  }'
```

### Handling Errors

All errors use RFC 7807 Problem Details:

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Customer with ID 999 not found"
}
```

## Pagination

List endpoints support pagination:

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| page | 0 | - | Zero-indexed page number |
| size | 20 | 100 | Items per page |

## Rate Limiting

| Limit | Window | Header |
|-------|--------|--------|
| 100 requests | 1 minute | X-RateLimit-Remaining |
```

---

### Day 7: Runbooks

---

#### BE-408: Backend Runbook

**Story:** US-014 — Complete Documentation  
**Hours:** 3  
**Priority:** P0

**Description:**
Create operational runbook for backend services.

**Template:**

```markdown
# Backend Runbook

## Service Overview

| Property | Value |
|----------|-------|
| Service Name | order-management-api |
| Port | 8080 |
| Health Endpoint | /actuator/health |
| Metrics Endpoint | /actuator/prometheus |
| Log Location | /var/log/order-api/app.log |

## Startup / Shutdown

### Start Service
```bash
systemctl start order-management-api
```

### Stop Service
```bash
systemctl stop order-management-api
```

### Restart Service
```bash
systemctl restart order-management-api
```

## Health Checks

### Check Health
```bash
curl http://localhost:8080/actuator/health
```

### Expected Response
```json
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "diskSpace": {"status": "UP"}
  }
}
```

## Common Issues

### Issue: High Memory Usage

**Symptoms:**
- OOM errors in logs
- Slow response times
- Health check failures

**Diagnosis:**
```bash
# Check JVM heap
jcmd $(pgrep -f order-management) GC.heap_info

# Check memory usage
curl http://localhost:8080/actuator/metrics/jvm.memory.used
```

**Resolution:**
1. Check for memory leaks (heap dump)
2. Increase heap size if needed
3. Restart service if critical

### Issue: Database Connection Exhaustion

**Symptoms:**
- "Cannot acquire connection" errors
- All requests timing out

**Diagnosis:**
```bash
curl http://localhost:8080/actuator/metrics/hikaricp.connections.active
```

**Resolution:**
1. Check for long-running queries
2. Check for connection leaks
3. Increase pool size if justified
4. Restart service as last resort

## Rollback Procedure

### Steps
1. Stop current version
2. Deploy previous version
3. Run smoke tests
4. Monitor for errors

### Commands
```bash
oc rollout undo deployment/order-management-api
oc rollout status deployment/order-management-api
```
```

---

#### BE-409: Incident Response Runbook

**Story:** US-014 — Complete Documentation  
**Hours:** 3  
**Priority:** P0

**Description:**
Create incident response procedures for P1/P2 scenarios.

**Template:**

```markdown
# Incident Response Runbook

## Severity Definitions

| Severity | Response Time | Description |
|----------|---------------|-------------|
| P1 Critical | 15 min | Service down, all users affected |
| P2 High | 30 min | Major feature broken, many users affected |
| P3 Medium | 4 hours | Minor feature broken, workaround exists |
| P4 Low | 24 hours | Cosmetic issue, minimal impact |

## P1: Service Completely Down

### Detection
- Alert: "Order API Health Check Failed"
- Dashboard: All requests returning 5xx

### Immediate Actions (0-5 min)
1. Page on-call engineer
2. Check pod status: `oc get pods -l app=order-api`
3. Check recent deployments: `oc rollout history deployment/order-api`

### Investigation (5-15 min)
1. Check logs: `oc logs -l app=order-api --tail=100`
2. Check database connectivity
3. Check dependent services

### Resolution Options
| Issue | Resolution |
|-------|------------|
| Bad deployment | Rollback: `oc rollout undo` |
| DB connection | Check DB status, failover if needed |
| Resource exhaustion | Scale: `oc scale deployment/order-api --replicas=5` |

### Post-Incident
1. Update status page
2. Send stakeholder communication
3. Schedule blameless postmortem

## P2: High Error Rate

### Detection
- Alert: "Order API Error Rate > 5%"
- Dashboard: Elevated 5xx responses

### Investigation
```bash
# Check error distribution
curl http://localhost:8080/actuator/metrics/http.server.requests?tag=status:500

# Check recent logs for errors
oc logs -l app=order-api | grep ERROR | tail -50
```

### Common Causes
- Downstream service degradation
- Database performance issues
- Memory pressure

## Escalation Contacts

| Role | Name | Contact |
|------|------|---------|
| Primary On-Call | Rotates | PagerDuty |
| Backend Lead | TBD | Slack |
| Database Admin | TBD | Slack |
| Security | TBD | Email |
```

---

### Day 8: Monitoring

---

#### BE-410: Prometheus Metrics

**Story:** US-015 — Operational Readiness  
**Hours:** 3  
**Priority:** P0

**Description:**
Configure Prometheus metrics for all key application metrics.

**Code Example:**

```java
// src/main/java/com/example/orders/config/MetricsConfig.java

@Configuration
public class MetricsConfig {
    
    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> registry.config()
            .commonTags(
                "application", "order-management",
                "environment", System.getenv().getOrDefault("ENV", "local")
            );
    }
}

// src/main/java/com/example/orders/metrics/OrderMetrics.java

@Component
@RequiredArgsConstructor
public class OrderMetrics {
    
    private final MeterRegistry registry;
    
    private Counter ordersCreated;
    private Counter ordersCancelled;
    private Timer orderCreationTimer;
    
    @PostConstruct
    public void init() {
        ordersCreated = Counter.builder("orders.created")
            .description("Total orders created")
            .tags("type", "counter")
            .register(registry);
        
        ordersCancelled = Counter.builder("orders.cancelled")
            .description("Total orders cancelled")
            .tags("type", "counter")
            .register(registry);
        
        orderCreationTimer = Timer.builder("orders.creation.time")
            .description("Order creation duration")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(registry);
    }
    
    public void recordOrderCreated() {
        ordersCreated.increment();
    }
    
    public void recordOrderCancelled() {
        ordersCancelled.increment();
    }
    
    public Timer.Sample startOrderCreation() {
        return Timer.start(registry);
    }
    
    public void recordOrderCreationTime(Timer.Sample sample) {
        sample.stop(orderCreationTimer);
    }
}
```

```yaml
# application.yml - Metrics configuration

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
    distribution:
      percentiles-histogram:
        http.server.requests: true
      percentiles:
        http.server.requests: 0.5, 0.95, 0.99
    tags:
      application: ${spring.application.name}
```

---

#### BE-411: Grafana Dashboards

**Story:** US-015 — Operational Readiness  
**Hours:** 3  
**Priority:** P0

**Description:**
Create Grafana dashboards for monitoring.

**Dashboard JSON:**

```json
{
  "title": "Order Management API",
  "panels": [
    {
      "title": "Request Rate",
      "type": "graph",
      "gridPos": {"x": 0, "y": 0, "w": 12, "h": 8},
      "targets": [
        {
          "expr": "rate(http_server_requests_seconds_count{application=\"order-management\"}[5m])",
          "legendFormat": "{{method}} {{uri}}"
        }
      ]
    },
    {
      "title": "Response Time (p95)",
      "type": "graph",
      "gridPos": {"x": 12, "y": 0, "w": 12, "h": 8},
      "targets": [
        {
          "expr": "histogram_quantile(0.95, rate(http_server_requests_seconds_bucket{application=\"order-management\"}[5m]))",
          "legendFormat": "{{uri}}"
        }
      ]
    },
    {
      "title": "Error Rate",
      "type": "graph",
      "gridPos": {"x": 0, "y": 8, "w": 12, "h": 8},
      "targets": [
        {
          "expr": "rate(http_server_requests_seconds_count{application=\"order-management\",status=~\"5..\"}[5m])",
          "legendFormat": "{{status}}"
        }
      ]
    },
    {
      "title": "JVM Memory",
      "type": "graph",
      "gridPos": {"x": 12, "y": 8, "w": 12, "h": 8},
      "targets": [
        {
          "expr": "jvm_memory_used_bytes{application=\"order-management\"}",
          "legendFormat": "{{area}}"
        }
      ]
    },
    {
      "title": "Database Connections",
      "type": "gauge",
      "gridPos": {"x": 0, "y": 16, "w": 6, "h": 6},
      "targets": [
        {
          "expr": "hikaricp_connections_active{application=\"order-management\"} / hikaricp_connections_max{application=\"order-management\"}"
        }
      ]
    },
    {
      "title": "Orders Created",
      "type": "stat",
      "gridPos": {"x": 6, "y": 16, "w": 6, "h": 6},
      "targets": [
        {
          "expr": "increase(orders_created_total{application=\"order-management\"}[24h])"
        }
      ]
    }
  ]
}
```

---

#### BE-412: Alert Rules Configuration

**Story:** US-015 — Operational Readiness  
**Hours:** 2  
**Priority:** P0

**Description:**
Configure Prometheus alert rules for P1/P2 scenarios.

**Alert Rules:**

```yaml
# prometheus/alerts.yml

groups:
  - name: order-management-alerts
    rules:
      # P1: Service Down
      - alert: OrderApiDown
        expr: up{job="order-management-api"} == 0
        for: 1m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "Order API is down"
          description: "Order API has been down for more than 1 minute"
          runbook_url: "https://wiki.example.com/runbooks/order-api-down"
      
      # P1: High Error Rate
      - alert: OrderApiHighErrorRate
        expr: |
          rate(http_server_requests_seconds_count{application="order-management",status=~"5.."}[5m])
          / rate(http_server_requests_seconds_count{application="order-management"}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "High error rate on Order API"
          description: "Error rate is {{ $value | humanizePercentage }}"
      
      # P2: High Latency
      - alert: OrderApiHighLatency
        expr: |
          histogram_quantile(0.95, 
            rate(http_server_requests_seconds_bucket{application="order-management"}[5m])
          ) > 0.5
        for: 10m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "High latency on Order API"
          description: "p95 latency is {{ $value | humanizeDuration }}"
      
      # P2: Database Connection Pool Exhaustion
      - alert: OrderApiDbPoolExhausted
        expr: |
          hikaricp_connections_active{application="order-management"} 
          / hikaricp_connections_max{application="order-management"} > 0.9
        for: 5m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "Database connection pool near capacity"
          description: "Pool utilization is {{ $value | humanizePercentage }}"
      
      # P2: High Memory Usage
      - alert: OrderApiHighMemory
        expr: |
          jvm_memory_used_bytes{application="order-management",area="heap"} 
          / jvm_memory_max_bytes{application="order-management",area="heap"} > 0.85
        for: 10m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "High heap memory usage"
          description: "Heap usage is {{ $value | humanizePercentage }}"
```

---

### Day 9-10: Deployment + Gate 5

The remaining tasks (BE-413 through BE-416) cover:

- **BE-413**: Health endpoint enhancement (detailed health checks)
- **BE-414**: Staging deployment (OpenShift deployment)
- **BE-415**: Smoke tests (post-deployment verification)
- **BE-416**: Gate 5 preparation (evidence gathering)

---

## Verification Commands

```bash
# Performance
./mvnw test -Dtest=*PerformanceTest
k6 run scripts/load-test.js

# Caching
curl http://localhost:8080/actuator/caches
curl http://localhost:8080/actuator/metrics/cache.gets

# Metrics
curl http://localhost:8080/actuator/prometheus

# Health
curl http://localhost:8080/actuator/health

# All tests
./mvnw test
./mvnw verify
```

---

## Key References

| Resource | Location |
|----------|----------|
| Sprint 4 Program | [../SPRINT_4_PROGRAM.md](../SPRINT_4_PROGRAM.md) |
| Sprint Packet | [SPRINT_PACKET.md](SPRINT_PACKET.md) |
| FE Tasks | [FE_TASKS.md](FE_TASKS.md) |
| Ship-Ready Checklist | [SHIP_READY_CHECKLIST.md](SHIP_READY_CHECKLIST.md) |
| Backend Instructions | [../../../.github/instructions/backend.instructions.md](../../../.github/instructions/backend.instructions.md) |
