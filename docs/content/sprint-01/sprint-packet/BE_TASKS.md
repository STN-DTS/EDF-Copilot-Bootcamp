# Sprint 1 — Backend Task Breakdown

> **Stream:** Backend (Spring Boot)  
> **Sprint:** 1 (Weeks 5-6)  
> **Lead:** BE Tech Lead

---

## Task Overview

| Phase | Days | Focus | Deliverables |
|-------|------|-------|--------------|
| Foundation | Days 2-3 | Project setup, auth | Secured API skeleton |
| Core API | Days 4-5 | Endpoints, persistence | Working REST API |
| Quality | Days 6-7 | Error handling, logging | Observable API |
| Testing | Days 8-10 | Unit, integration, contract | Full test coverage |

---

## Week 5: Foundation + Core API

### Day 2: Project Structure + Config (6 hours)

#### BE-001: Set up Spring Boot project structure (2h)

**Description:** Initialize or verify Spring Boot project with proper package structure.

**Acceptance Criteria:**
- [ ] Project builds successfully with Maven/Gradle
- [ ] Spring Boot 3.x configured
- [ ] Package structure matches conventions
- [ ] Application properties organized
- [ ] Profiles for dev/test/prod

**Package Structure:**
```
src/main/java/com/example/ordermgmt/
├── OrderManagementApplication.java
├── config/                    # Configuration classes
│   ├── SecurityConfig.java
│   ├── WebConfig.java
│   ├── ProblemDetailConfig.java
│   └── OpenApiConfig.java
├── controller/                # REST controllers
│   ├── OrderController.java
│   └── advice/
│       └── GlobalExceptionHandler.java
├── service/                   # Business logic
│   ├── OrderService.java
│   └── impl/
│       └── OrderServiceImpl.java
├── repository/                # Data access
│   └── OrderRepository.java
├── entity/                    # JPA entities
│   ├── Order.java
│   ├── OrderItem.java
│   └── BaseEntity.java
├── dto/                       # Data transfer objects
│   ├── OrderDto.java
│   ├── OrderItemDto.java
│   ├── CreateOrderRequest.java
│   └── PageResponse.java
├── mapper/                    # Entity-DTO mappers
│   └── OrderMapper.java
└── exception/                 # Custom exceptions
    ├── OrderNotFoundException.java
    └── BusinessValidationException.java
```

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Review the Spring Boot project structure and suggest improvements 
to match our conventions.

@workspace Show the current package structure and compare to 
.github/instructions/backend.instructions.md patterns.

Verify:
- Controller/Service/Repository layering
- DTO separation from entities
- Exception handling structure
- Configuration organization
```

---

#### BE-001 (continued): Application Properties (2h)

**Configuration Files:**
```yaml
# application.yml
spring:
  application:
    name: order-management
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}

server:
  port: 8080
  error:
    include-message: always
    include-binding-errors: always

logging:
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%X{traceId:-}] %-5level %logger{36} - %msg%n"
  level:
    root: INFO
    com.example.ordermgmt: DEBUG
```

```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  h2:
    console:
      enabled: true
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
```

```yaml
# application-prod.yml
spring:
  datasource:
    url: jdbc:oracle:thin:@${DB_HOST}:${DB_PORT}:${DB_NAME}
    driver-class-name: oracle.jdbc.OracleDriver
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
```

---

#### BE-010: Configure structured logging (2h)

**Description:** Set up structured logging with correlation IDs.

**Acceptance Criteria:**
- [ ] Logback configured with JSON output
- [ ] Correlation ID (traceId) in all logs
- [ ] Request logging filter
- [ ] Sensitive data masking

**Implementation:**
```java
// src/main/java/com/example/ordermgmt/config/LoggingConfig.java
@Configuration
public class LoggingConfig {
    
    @Bean
    public FilterRegistrationBean<RequestLoggingFilter> loggingFilter() {
        FilterRegistrationBean<RequestLoggingFilter> registrationBean = 
            new FilterRegistrationBean<>();
        registrationBean.setFilter(new RequestLoggingFilter());
        registrationBean.addUrlPatterns("/api/*");
        return registrationBean;
    }
}
```

```java
// src/main/java/com/example/ordermgmt/filter/RequestLoggingFilter.java
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                     HttpServletResponse response, 
                                     FilterChain filterChain) 
            throws ServletException, IOException {
        
        String traceId = Optional.ofNullable(request.getHeader("X-Trace-Id"))
            .orElse(UUID.randomUUID().toString());
        
        MDC.put("traceId", traceId);
        response.setHeader("X-Trace-Id", traceId);
        
        long startTime = System.currentTimeMillis();
        
        try {
            log.info("Request received: {} {} user={}", 
                request.getMethod(), 
                request.getRequestURI(),
                getCurrentUserId());
            
            filterChain.doFilter(request, response);
            
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            log.info("Request completed: {} {} status={} duration={}ms", 
                request.getMethod(), 
                request.getRequestURI(),
                response.getStatus(),
                duration);
            
            MDC.clear();
        }
    }
}
```

---

### Day 3: Authentication (6 hours)

#### BE-002: Configure OAuth 2.0 resource server (6h)

**Description:** Set up Spring Security with OAuth 2.0 / OIDC for JWT validation.

**Acceptance Criteria:**
- [ ] spring-boot-starter-oauth2-resource-server configured
- [ ] JWT validation working
- [ ] Issuer URI from environment
- [ ] User ID extraction from token
- [ ] Public endpoints excluded (health, swagger)
- [ ] 401 responses use Problem Details

**Dependencies:**
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

**Configuration:**
```yaml
# application.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${OAUTH_ISSUER_URI:https://login.microsoftonline.com/<TENANT_ID>/v2.0}
          audiences: ${OAUTH_AUDIENCE:api://<CLIENT_ID>}
```

**Security Config:**
```java
// src/main/java/com/example/ordermgmt/config/SecurityConfig.java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().denyAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(problemDetailAuthenticationEntryPoint())
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .build();
    }
    
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = 
            new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        
        JwtAuthenticationConverter jwtAuthenticationConverter = 
            new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(
            grantedAuthoritiesConverter);
        
        return jwtAuthenticationConverter;
    }
    
    @Bean
    public AuthenticationEntryPoint problemDetailAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/problem+json");
            
            ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
            problem.setType(URI.create("/problems/authentication-required"));
            problem.setTitle("Authentication Required");
            problem.setDetail("Valid authentication credentials are required");
            problem.setInstance(URI.create(request.getRequestURI()));
            
            ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(response.getOutputStream(), problem);
        };
    }
}
```

**User ID Helper:**
```java
// src/main/java/com/example/ordermgmt/security/SecurityUtils.java
@Component
public class SecurityUtils {
    
    public String getCurrentUserId() {
        Authentication authentication = 
            SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getToken().getSubject();
        }
        
        throw new IllegalStateException("No authenticated user");
    }
    
    public boolean isCurrentUser(String userId) {
        return getCurrentUserId().equals(userId);
    }
}
```

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Create a Spring Security configuration for OAuth 2.0 resource server.

Requirements:
- JWT validation with configurable issuer
- Permit /actuator/health and swagger endpoints
- Require authentication for /api/**
- Extract user ID from JWT subject claim
- Problem Details for 401 responses
- Follow patterns in .github/instructions/backend.instructions.md

ADR reference: docs/content/week-03/adrs/001-authentication.md
```

---

### Day 4: Core Endpoint Controller (7 hours)

#### BE-007: Implement OrderController - list (4h)

**Description:** Create REST endpoint for listing orders with pagination.

**Acceptance Criteria:**
- [ ] GET /api/v1/orders endpoint
- [ ] Pagination with page/size parameters
- [ ] Filter by authenticated user's customer ID
- [ ] Response matches OpenAPI schema
- [ ] OpenAPI annotations added

**Implementation:**
```java
// src/main/java/com/example/ordermgmt/controller/OrderController.java
@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders", description = "Order management operations")
public class OrderController {
    
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    
    private final OrderService orderService;
    private final SecurityUtils securityUtils;
    
    public OrderController(OrderService orderService, SecurityUtils securityUtils) {
        this.orderService = orderService;
        this.securityUtils = securityUtils;
    }
    
    @GetMapping
    @Operation(
        summary = "List orders",
        description = "Returns a paginated list of orders for the authenticated user"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successful response"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PageResponse<OrderDto>> listOrders(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            @RequestParam(required = false) String status) {
        
        String userId = securityUtils.getCurrentUserId();
        log.info("Listing orders for user: {}", userId);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderDto> orders = orderService.listOrdersForUser(userId, status, pageable);
        
        PageResponse<OrderDto> response = new PageResponse<>(
            orders.getContent(),
            new PageInfo(
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalElements(),
                orders.getTotalPages()
            )
        );
        
        return ResponseEntity.ok(response);
    }
}
```

**DTOs:**
```java
// src/main/java/com/example/ordermgmt/dto/PageResponse.java
public record PageResponse<T>(
    List<T> content,
    PageInfo page
) {}

// src/main/java/com/example/ordermgmt/dto/PageInfo.java
public record PageInfo(
    int number,
    int size,
    long totalElements,
    int totalPages
) {}

// src/main/java/com/example/ordermgmt/dto/OrderDto.java
public record OrderDto(
    Long id,
    Long customerId,
    String status,
    List<OrderItemDto> items,
    String totalAmount,
    Instant createdAt,
    Instant updatedAt
) {}
```

---

#### BE-008: Implement OrderController - detail (3h)

**Description:** Create REST endpoint for getting order by ID.

**Acceptance Criteria:**
- [ ] GET /api/v1/orders/{id} endpoint
- [ ] Authorization check (order belongs to user)
- [ ] 404 if not found
- [ ] 403 if not authorized
- [ ] Response matches OpenAPI schema

**Implementation:**
```java
// Add to OrderController.java

@GetMapping("/{id}")
@Operation(
    summary = "Get order by ID",
    description = "Returns a single order by its ID"
)
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Successful response"),
    @ApiResponse(responseCode = "401", description = "Authentication required"),
    @ApiResponse(responseCode = "403", description = "Access denied"),
    @ApiResponse(responseCode = "404", description = "Order not found")
})
public ResponseEntity<OrderDto> getOrderById(
        @PathVariable @Min(1) Long id) {
    
    String userId = securityUtils.getCurrentUserId();
    log.info("Getting order {} for user: {}", id, userId);
    
    OrderDto order = orderService.getOrderById(id, userId);
    
    return ResponseEntity.ok(order);
}
```

---

### Day 5: Repository + Persistence (7 hours)

#### BE-003: Create Order entity and JPA mapping (3h)

**Description:** Create JPA entity for Order.

**Acceptance Criteria:**
- [ ] Entity maps to ORDERS table
- [ ] ID generation strategy defined
- [ ] Relationships mapped correctly
- [ ] Audit fields included
- [ ] Constraints match domain glossary

**Implementation:**
```java
// src/main/java/com/example/ordermgmt/entity/BaseEntity.java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    // Getters and setters
}
```

```java
// src/main/java/com/example/ordermgmt/entity/Order.java
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    
    @Column(name = "customer_id", nullable = false)
    private Long customerId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private OrderStatus status = OrderStatus.CREATED;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;
    
    // Getters, setters, and business methods
    
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    
    public void calculateTotal() {
        this.totalAmount = items.stream()
            .map(OrderItem::getLineTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

```java
// src/main/java/com/example/ordermgmt/entity/OrderStatus.java
public enum OrderStatus {
    CREATED,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
```

---

#### BE-004: Create OrderItem entity and JPA mapping (2h)

**Description:** Create JPA entity for OrderItem.

**Implementation:**
```java
// src/main/java/com/example/ordermgmt/entity/OrderItem.java
@Entity
@Table(name = "order_items")
public class OrderItem extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(name = "item_id", nullable = false)
    private Long itemId;
    
    @Column(name = "quantity", nullable = false)
    @Min(1)
    @Max(999)
    private Integer quantity;
    
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(name = "line_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotal;
    
    // Getters and setters
    
    @PrePersist
    @PreUpdate
    public void calculateLineTotal() {
        this.lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
```

---

#### BE-005: Implement OrderRepository (2h)

**Description:** Create Spring Data JPA repository for orders.

**Acceptance Criteria:**
- [ ] Extends JpaRepository
- [ ] Pagination support
- [ ] Custom query for user's orders
- [ ] Query by status filter

**Implementation:**
```java
// src/main/java/com/example/ordermgmt/repository/OrderRepository.java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Find orders for a specific user (by customer ID derived from user ID)
     */
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);
    
    /**
     * Find orders for a user with status filter
     */
    @Query("SELECT o FROM Order o WHERE o.customerId = :customerId " +
           "AND (:status IS NULL OR o.status = :status)")
    Page<Order> findByCustomerIdAndStatus(
        @Param("customerId") Long customerId,
        @Param("status") OrderStatus status,
        Pageable pageable
    );
    
    /**
     * Check if order belongs to customer
     */
    boolean existsByIdAndCustomerId(Long id, Long customerId);
}
```

**Copilot Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Create Spring Data JPA entities for Order and OrderItem.

Requirements:
- Order has many OrderItems
- Use BaseEntity for audit fields
- OrderStatus as enum
- Proper indexes for common queries
- Follow patterns in .github/instructions/backend.instructions.md

Domain model from: docs/content/week-04/templates/DOMAIN_GLOSSARY.md
Schema from: docs/content/week-04/contracts/openapi.yaml
```

---

## Week 6: Quality + Testing

### Day 6: Service Layer (7 hours)

#### BE-006: Implement OrderService (6h)

**Description:** Implement business logic layer for orders.

**Acceptance Criteria:**
- [ ] Interface and implementation
- [ ] List orders with authorization
- [ ] Get order by ID with authorization
- [ ] Proper validation
- [ ] Transaction management
- [ ] Logging at key points

**Implementation:**
```java
// src/main/java/com/example/ordermgmt/service/OrderService.java
public interface OrderService {
    
    Page<OrderDto> listOrdersForUser(String userId, String status, Pageable pageable);
    
    OrderDto getOrderById(Long id, String userId);
}
```

```java
// src/main/java/com/example/ordermgmt/service/impl/OrderServiceImpl.java
@Service
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {
    
    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final CustomerResolver customerResolver;
    
    public OrderServiceImpl(OrderRepository orderRepository,
                           OrderMapper orderMapper,
                           CustomerResolver customerResolver) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.customerResolver = customerResolver;
    }
    
    @Override
    public Page<OrderDto> listOrdersForUser(String userId, String status, Pageable pageable) {
        Long customerId = customerResolver.getCustomerIdForUser(userId);
        
        OrderStatus orderStatus = status != null ? OrderStatus.valueOf(status) : null;
        
        Page<Order> orders = orderRepository.findByCustomerIdAndStatus(
            customerId, orderStatus, pageable);
        
        log.info("Found {} orders for customer {}", orders.getTotalElements(), customerId);
        
        return orders.map(orderMapper::toDto);
    }
    
    @Override
    public OrderDto getOrderById(Long id, String userId) {
        Long customerId = customerResolver.getCustomerIdForUser(userId);
        
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new OrderNotFoundException(id));
        
        if (!order.getCustomerId().equals(customerId)) {
            log.warn("Access denied: user {} tried to access order {} " +
                    "belonging to customer {}", 
                    userId, id, order.getCustomerId());
            throw new AccessDeniedException("Order does not belong to current user");
        }
        
        log.info("Order {} accessed by user {}", id, userId);
        return orderMapper.toDto(order);
    }
}
```

**Mapper:**
```java
// src/main/java/com/example/ordermgmt/mapper/OrderMapper.java
@Component
public class OrderMapper {
    
    public OrderDto toDto(Order order) {
        return new OrderDto(
            order.getId(),
            order.getCustomerId(),
            order.getStatus().name(),
            order.getItems().stream()
                .map(this::toDto)
                .toList(),
            order.getTotalAmount().toPlainString(),
            order.getCreatedAt(),
            order.getUpdatedAt()
        );
    }
    
    public OrderItemDto toDto(OrderItem item) {
        return new OrderItemDto(
            item.getId(),
            item.getItemId(),
            item.getQuantity(),
            item.getUnitPrice().toPlainString(),
            item.getLineTotal().toPlainString()
        );
    }
}
```

---

#### BE-006 (continued): Exception Handling (1h)

**Custom Exceptions:**
```java
// src/main/java/com/example/ordermgmt/exception/OrderNotFoundException.java
public class OrderNotFoundException extends RuntimeException {
    
    private final Long orderId;
    
    public OrderNotFoundException(Long orderId) {
        super("Order not found: " + orderId);
        this.orderId = orderId;
    }
    
    public Long getOrderId() {
        return orderId;
    }
}
```

---

### Day 7: Error Handling + Logging (7 hours)

#### BE-009: Configure Problem Details error handling (4h)

**Description:** Implement global exception handler with Problem Details.

**Acceptance Criteria:**
- [ ] Global exception handler
- [ ] Problem Details for all errors
- [ ] Validation errors include field details
- [ ] Correlation ID in all responses
- [ ] No stack traces in production

**Implementation:**
```java
// src/main/java/com/example/ordermgmt/controller/advice/GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(OrderNotFoundException.class)
    public ProblemDetail handleOrderNotFound(OrderNotFoundException ex, 
                                             HttpServletRequest request) {
        log.warn("Order not found: {}", ex.getOrderId());
        
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problem.setType(URI.create("/problems/not-found"));
        problem.setTitle("Resource Not Found");
        problem.setDetail("Order with ID " + ex.getOrderId() + " not found");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("timestamp", Instant.now().toString());
        problem.setProperty("traceId", MDC.get("traceId"));
        
        return problem;
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex,
                                            HttpServletRequest request) {
        log.warn("Access denied: {}", ex.getMessage());
        
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problem.setType(URI.create("/problems/access-denied"));
        problem.setTitle("Access Denied");
        problem.setDetail("You do not have permission to access this resource");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("timestamp", Instant.now().toString());
        problem.setProperty("traceId", MDC.get("traceId"));
        
        return problem;
    }
    
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        
        List<Map<String, String>> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> Map.of(
                "field", error.getField(),
                "code", error.getCode(),
                "message", error.getDefaultMessage()
            ))
            .toList();
        
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setType(URI.create("/problems/validation-error"));
        problem.setTitle("Validation Error");
        problem.setDetail("The request contains invalid data");
        problem.setProperty("errors", errors);
        problem.setProperty("timestamp", Instant.now().toString());
        problem.setProperty("traceId", MDC.get("traceId"));
        
        return ResponseEntity.badRequest().body(problem);
    }
    
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex,
                                                HttpServletRequest request) {
        log.error("Unexpected error", ex);
        
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problem.setType(URI.create("/problems/internal-error"));
        problem.setTitle("Internal Error");
        problem.setDetail("An unexpected error occurred");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("timestamp", Instant.now().toString());
        problem.setProperty("traceId", MDC.get("traceId"));
        
        return problem;
    }
}
```

---

#### BE-010 (continued): Audit Logging (3h)

**Audit Event Implementation:**
```java
// src/main/java/com/example/ordermgmt/audit/AuditLogger.java
@Component
public class AuditLogger {
    
    private static final Logger auditLog = 
        LoggerFactory.getLogger("AUDIT");
    
    public void logOrderAccessed(Long orderId, String userId) {
        auditLog.info("event=ORDER_ACCESSED orderId={} userId={} traceId={}",
            orderId, userId, MDC.get("traceId"));
    }
    
    public void logOrderCreated(Long orderId, String userId) {
        auditLog.info("event=ORDER_CREATED orderId={} userId={} traceId={}",
            orderId, userId, MDC.get("traceId"));
    }
    
    public void logAuthorizationDenied(String resource, String userId, String reason) {
        auditLog.warn("event=AUTHORIZATION_DENIED resource={} userId={} reason={} traceId={}",
            resource, userId, reason, MDC.get("traceId"));
    }
}
```

---

### Day 8: Unit Tests (7 hours)

#### BE-011: Write service unit tests (6h)

**Description:** Write comprehensive unit tests for service layer.

**Acceptance Criteria:**
- [ ] All service methods tested
- [ ] Happy paths tested
- [ ] Error cases tested
- [ ] Mocks for dependencies
- [ ] Coverage ≥ 70%

**Implementation:**
```java
// src/test/java/com/example/ordermgmt/service/OrderServiceTest.java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    
    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private OrderMapper orderMapper;
    
    @Mock
    private CustomerResolver customerResolver;
    
    @InjectMocks
    private OrderServiceImpl orderService;
    
    private static final String USER_ID = "user-123";
    private static final Long CUSTOMER_ID = 67890L;
    
    @BeforeEach
    void setUp() {
        when(customerResolver.getCustomerIdForUser(USER_ID))
            .thenReturn(CUSTOMER_ID);
    }
    
    @Nested
    class ListOrdersForUser {
        
        @Test
        void returnsOrdersForUser() {
            // Given
            Pageable pageable = PageRequest.of(0, 20);
            Order order = createTestOrder();
            Page<Order> orderPage = new PageImpl<>(List.of(order));
            OrderDto orderDto = createTestOrderDto();
            
            when(orderRepository.findByCustomerIdAndStatus(
                CUSTOMER_ID, null, pageable))
                .thenReturn(orderPage);
            when(orderMapper.toDto(order)).thenReturn(orderDto);
            
            // When
            Page<OrderDto> result = orderService.listOrdersForUser(
                USER_ID, null, pageable);
            
            // Then
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0)).isEqualTo(orderDto);
        }
        
        @Test
        void filtersOrdersByStatus() {
            // Given
            Pageable pageable = PageRequest.of(0, 20);
            when(orderRepository.findByCustomerIdAndStatus(
                CUSTOMER_ID, OrderStatus.CREATED, pageable))
                .thenReturn(Page.empty());
            
            // When
            Page<OrderDto> result = orderService.listOrdersForUser(
                USER_ID, "CREATED", pageable);
            
            // Then
            assertThat(result.getContent()).isEmpty();
            verify(orderRepository).findByCustomerIdAndStatus(
                CUSTOMER_ID, OrderStatus.CREATED, pageable);
        }
    }
    
    @Nested
    class GetOrderById {
        
        @Test
        void returnsOrderWhenAuthorized() {
            // Given
            Long orderId = 12345L;
            Order order = createTestOrder();
            order.setCustomerId(CUSTOMER_ID);
            OrderDto orderDto = createTestOrderDto();
            
            when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
            when(orderMapper.toDto(order)).thenReturn(orderDto);
            
            // When
            OrderDto result = orderService.getOrderById(orderId, USER_ID);
            
            // Then
            assertThat(result).isEqualTo(orderDto);
        }
        
        @Test
        void throwsNotFoundWhenOrderDoesNotExist() {
            // Given
            Long orderId = 99999L;
            when(orderRepository.findById(orderId)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> orderService.getOrderById(orderId, USER_ID))
                .isInstanceOf(OrderNotFoundException.class)
                .hasMessageContaining("99999");
        }
        
        @Test
        void throwsAccessDeniedWhenOrderBelongsToOtherUser() {
            // Given
            Long orderId = 12345L;
            Order order = createTestOrder();
            order.setCustomerId(99999L); // Different customer
            
            when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
            
            // When/Then
            assertThatThrownBy(() -> orderService.getOrderById(orderId, USER_ID))
                .isInstanceOf(AccessDeniedException.class);
        }
    }
    
    // Helper methods
    private Order createTestOrder() {
        Order order = new Order();
        order.setId(12345L);
        order.setCustomerId(CUSTOMER_ID);
        order.setStatus(OrderStatus.CREATED);
        order.setTotalAmount(new BigDecimal("59.98"));
        return order;
    }
    
    private OrderDto createTestOrderDto() {
        return new OrderDto(
            12345L, CUSTOMER_ID, "CREATED", 
            List.of(), "59.98", Instant.now(), Instant.now()
        );
    }
}
```

---

#### BE-011 (continued): Controller Unit Tests (1h)

```java
// src/test/java/com/example/ordermgmt/controller/OrderControllerTest.java
@ExtendWith(MockitoExtension.class)
class OrderControllerTest {
    
    @Mock
    private OrderService orderService;
    
    @Mock
    private SecurityUtils securityUtils;
    
    @InjectMocks
    private OrderController orderController;
    
    @Test
    void listOrders_returnsPageResponse() {
        // Given
        when(securityUtils.getCurrentUserId()).thenReturn("user-123");
        when(orderService.listOrdersForUser(anyString(), any(), any()))
            .thenReturn(Page.empty());
        
        // When
        ResponseEntity<PageResponse<OrderDto>> response = 
            orderController.listOrders(0, 20, null);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }
}
```

---

### Day 9: Integration Tests (7 hours)

#### BE-012: Write controller integration tests (6h)

**Description:** Write integration tests for REST API.

**Acceptance Criteria:**
- [ ] Full request/response cycle tested
- [ ] Authentication tested
- [ ] Error responses tested
- [ ] Database integration tested
- [ ] Test data properly managed

**Implementation:**
```java
// src/test/java/com/example/ordermgmt/controller/OrderControllerIntegrationTest.java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
    }
    
    @Nested
    class ListOrders {
        
        @Test
        @WithMockUser(username = "user-123")
        void returnsOrdersForAuthenticatedUser() throws Exception {
            // Given
            Order order = createAndSaveOrder(67890L); // User's customer
            
            // When/Then
            mockMvc.perform(get("/api/v1/orders")
                    .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].id").value(order.getId()))
                .andExpect(jsonPath("$.page.totalElements").value(1));
        }
        
        @Test
        void returnsUnauthorizedWithoutToken() throws Exception {
            mockMvc.perform(get("/api/v1/orders"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.type").value("/problems/authentication-required"));
        }
        
        @Test
        @WithMockUser(username = "user-123")
        void returnsPaginatedResults() throws Exception {
            // Given - create 25 orders
            for (int i = 0; i < 25; i++) {
                createAndSaveOrder(67890L);
            }
            
            // When/Then - first page
            mockMvc.perform(get("/api/v1/orders?page=0&size=10")
                    .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.page.number").value(0))
                .andExpect(jsonPath("$.page.totalPages").value(3))
                .andExpect(jsonPath("$.page.totalElements").value(25));
        }
    }
    
    @Nested
    class GetOrderById {
        
        @Test
        @WithMockUser(username = "user-123")
        void returnsOrderWhenAuthorized() throws Exception {
            // Given
            Order order = createAndSaveOrder(67890L);
            
            // When/Then
            mockMvc.perform(get("/api/v1/orders/{id}", order.getId())
                    .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(order.getId()))
                .andExpect(jsonPath("$.status").value("CREATED"));
        }
        
        @Test
        @WithMockUser(username = "user-123")
        void returnsNotFoundForNonexistentOrder() throws Exception {
            mockMvc.perform(get("/api/v1/orders/99999")
                    .header("Authorization", "Bearer test-token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.type").value("/problems/not-found"))
                .andExpect(jsonPath("$.detail").value(containsString("99999")));
        }
        
        @Test
        @WithMockUser(username = "other-user")
        void returnsForbiddenForOtherUsersOrder() throws Exception {
            // Given
            Order order = createAndSaveOrder(67890L); // Different user's order
            
            // When/Then
            mockMvc.perform(get("/api/v1/orders/{id}", order.getId())
                    .header("Authorization", "Bearer test-token"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.type").value("/problems/access-denied"));
        }
    }
    
    private Order createAndSaveOrder(Long customerId) {
        Order order = new Order();
        order.setCustomerId(customerId);
        order.setStatus(OrderStatus.CREATED);
        order.setTotalAmount(new BigDecimal("59.98"));
        return orderRepository.save(order);
    }
}
```

---

### Day 10: Contract Tests + Demo Prep (7 hours)

#### BE-013: Write contract validation tests (4h)

**Description:** Validate API responses against OpenAPI contract.

**Acceptance Criteria:**
- [ ] Response schemas validated
- [ ] Required fields verified
- [ ] Error responses validated
- [ ] Contract drift detected

**Implementation:**
```java
// src/test/java/com/example/ordermgmt/contract/OrderContractTest.java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderContractTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    private OpenApiValidator validator;
    
    @BeforeEach
    void setUp() throws Exception {
        // Load OpenAPI spec
        validator = OpenApiValidator.load("docs/content/week-04/contracts/openapi.yaml");
    }
    
    @Test
    @WithMockUser(username = "user-123")
    void listOrders_matchesContract() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/orders")
                .header("Authorization", "Bearer test-token")
                .accept(MediaType.APPLICATION_JSON))
            .andReturn();
        
        // Validate response against contract
        validator.validateResponse(
            "/orders", "GET", 
            result.getResponse().getStatus(),
            result.getResponse().getContentAsString()
        );
    }
    
    @Test
    @WithMockUser(username = "user-123") 
    void getOrder_matchesContract() throws Exception {
        // Given
        Order order = createAndSaveOrder();
        
        MvcResult result = mockMvc.perform(get("/api/v1/orders/{id}", order.getId())
                .header("Authorization", "Bearer test-token")
                .accept(MediaType.APPLICATION_JSON))
            .andReturn();
        
        // Validate response against contract
        validator.validateResponse(
            "/orders/{id}", "GET",
            result.getResponse().getStatus(),
            result.getResponse().getContentAsString()
        );
    }
    
    @Test
    void errorResponse_matchesProblemDetails() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/orders")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized())
            .andReturn();
        
        String response = result.getResponse().getContentAsString();
        
        // Verify Problem Details structure
        JsonNode json = objectMapper.readTree(response);
        assertThat(json.has("type")).isTrue();
        assertThat(json.has("title")).isTrue();
        assertThat(json.has("status")).isTrue();
        assertThat(json.has("detail")).isTrue();
    }
}
```

---

#### Demo Prep (3h)

**Tasks:**
1. Fix any blocking bugs (1h)
2. Prepare demo API calls (1h)
3. Practice demo flow (0.5h)
4. Participate in demo and retro (0.5h)

**Demo Script:**
```markdown
## BE Demo Script

1. **Authentication** (show security working)
   - Make unauthenticated request → 401
   - Make authenticated request → 200

2. **List Orders** (show pagination)
   - GET /api/v1/orders
   - Show paginated response
   - Filter by status

3. **Get Order Detail** (show single order)
   - GET /api/v1/orders/{id}
   - Show full order with items

4. **Logging** (show observability)
   - Show structured log output
   - Highlight traceId correlation

5. **Contract Compliance** (show quality)
   - Run contract tests
   - Show passing results
```

---

## Task Summary

| ID | Task | Days | Hours | Status |
|----|------|------|-------|--------|
| BE-001 | Project structure | 2 | 2 | ⬜ |
| BE-002 | OAuth 2.0 config | 3 | 6 | ⬜ |
| BE-003 | Order entity | 5 | 3 | ⬜ |
| BE-004 | OrderItem entity | 5 | 2 | ⬜ |
| BE-005 | OrderRepository | 5 | 2 | ⬜ |
| BE-006 | OrderService | 6 | 6 | ⬜ |
| BE-007 | Controller - list | 4 | 4 | ⬜ |
| BE-008 | Controller - detail | 4 | 3 | ⬜ |
| BE-009 | Problem Details | 7 | 4 | ⬜ |
| BE-010 | Structured logging | 2, 7 | 5 | ⬜ |
| BE-011 | Unit tests | 8 | 6 | ⬜ |
| BE-012 | Integration tests | 9 | 6 | ⬜ |
| BE-013 | Contract tests | 10 | 4 | ⬜ |

**Total Estimated:** ~53 hours (across 9 dev days)

---

## Copilot Assistance

```
BE Sprint 1 tasks focus on:
- Spring Boot 3 patterns
- OAuth 2.0 resource server
- Spring Data JPA with Oracle
- Problem Details error handling
- JUnit 5 with MockMvc

Key prompts:
- P6: Create repository layer
- P7: Create service layer
- P8: Create controller layer
- P2: Write unit and integration tests
- P21: Validate contract compliance

Reference:
- .github/instructions/backend.instructions.md
- docs/content/week-04/contracts/openapi.yaml
- docs/content/week-03/adrs/001-authentication.md
- docs/content/week-03/adrs/002-error-handling.md
```
