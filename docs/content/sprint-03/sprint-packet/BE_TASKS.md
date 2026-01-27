# Sprint 3 — Backend Tasks

> **Sprint Focus:** Security hardening, authorization, input validation, and audit logging.

**Total Tasks:** 24  
**Estimated Hours:** ~56 hours  
**Owner:** Backend Team

---

## Task Summary by Day

| Day | Focus | Tasks | Hours |
|-----|-------|-------|-------|
| 2 | Authentication Hardening | BE-301, BE-302, BE-303 | 7 |
| 3 | Authorization | BE-304, BE-305, BE-306 | 8 |
| 4 | Input Validation | BE-307, BE-308, BE-309 | 7 |
| 5 | CSRF + Security Headers | BE-310, BE-311, BE-312 | 7 |
| 6 | Audit Logging | BE-313, BE-314, BE-315 | 7 |
| 7 | Edge Case Handling | BE-316, BE-317, BE-318 | 7 |
| 8 | Security Unit Tests | BE-319, BE-320, BE-321 | 8 |
| 9 | Integration Tests | BE-322, BE-323, BE-324 | 8 |

---

## Week 9: Security Implementation

### Day 2: Authentication Hardening

---

#### BE-301: Token Validation Interceptor

**Story:** US-008 — Secure Authentication Flow  
**Hours:** 3  
**Priority:** P0

**Description:**
Implement comprehensive JWT token validation for all protected endpoints.

**Acceptance Criteria:**
- [ ] Validate token signature
- [ ] Validate token expiration
- [ ] Validate issuer claim
- [ ] Validate audience claim
- [ ] Log all validation failures
- [ ] Return proper 401 responses

**Code Example:**

```java
// src/main/java/com/example/orders/security/JwtTokenValidator.java

@Component
@Slf4j
public class JwtTokenValidator {
    
    private final JwtDecoder jwtDecoder;
    private final String expectedIssuer;
    private final String expectedAudience;
    
    public JwtTokenValidator(
            JwtDecoder jwtDecoder,
            @Value("${security.jwt.issuer}") String expectedIssuer,
            @Value("${security.jwt.audience}") String expectedAudience) {
        this.jwtDecoder = jwtDecoder;
        this.expectedIssuer = expectedIssuer;
        this.expectedAudience = expectedAudience;
    }
    
    /**
     * Validate JWT token with comprehensive checks.
     * 
     * @param token The JWT token string
     * @return Validated Jwt object
     * @throws JwtValidationException if validation fails
     */
    public Jwt validateToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            
            validateIssuer(jwt);
            validateAudience(jwt);
            validateExpiration(jwt);
            validateRequiredClaims(jwt);
            
            return jwt;
            
        } catch (JwtException e) {
            log.warn("SECURITY_EVENT: JWT validation failed: {}", e.getMessage());
            throw new JwtValidationException("Invalid token", e);
        }
    }
    
    private void validateIssuer(Jwt jwt) {
        String issuer = jwt.getIssuer().toString();
        if (!expectedIssuer.equals(issuer)) {
            log.warn("SECURITY_EVENT: Invalid issuer. Expected: {}, Got: {}", 
                expectedIssuer, issuer);
            throw new JwtValidationException("Invalid token issuer");
        }
    }
    
    private void validateAudience(Jwt jwt) {
        List<String> audiences = jwt.getAudience();
        if (audiences == null || !audiences.contains(expectedAudience)) {
            log.warn("SECURITY_EVENT: Invalid audience. Expected: {}, Got: {}", 
                expectedAudience, audiences);
            throw new JwtValidationException("Invalid token audience");
        }
    }
    
    private void validateExpiration(Jwt jwt) {
        Instant expiration = jwt.getExpiresAt();
        if (expiration == null || Instant.now().isAfter(expiration)) {
            log.info("SECURITY_EVENT: Token expired at {}", expiration);
            throw new JwtValidationException("Token expired");
        }
    }
    
    private void validateRequiredClaims(Jwt jwt) {
        List<String> requiredClaims = List.of("sub", "email", "roles");
        
        for (String claim : requiredClaims) {
            if (jwt.getClaim(claim) == null) {
                log.warn("SECURITY_EVENT: Missing required claim: {}", claim);
                throw new JwtValidationException("Missing required claim: " + claim);
            }
        }
    }
}
```

```java
// src/main/java/com/example/orders/security/JwtAuthenticationFilter.java

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenValidator tokenValidator;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String token = authHeader.substring(7);
        
        try {
            Jwt jwt = tokenValidator.validateToken(token);
            String username = jwt.getSubject();
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );
            
            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
        } catch (JwtValidationException e) {
            // Clear any existing authentication
            SecurityContextHolder.clearContext();
            
            // Return 401 with Problem Details
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/problem+json");
            response.getWriter().write("""
                {
                    "type": "about:blank",
                    "title": "Unauthorized",
                    "status": 401,
                    "detail": "Invalid or expired token"
                }
                """);
            return;
        }
        
        filterChain.doFilter(request, response);
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/v1/health") ||
               path.startsWith("/api/v1/auth/login") ||
               path.startsWith("/api/v1/auth/refresh");
    }
}
```

**Copilot Prompt:**

```markdown
## P3-JWT-VALIDATION

No secrets, no production data. Use placeholders.

Create a comprehensive JWT token validator that:
1. Validates signature using JwtDecoder
2. Validates issuer matches expected value
3. Validates audience contains expected value
4. Validates token is not expired
5. Validates required claims are present
6. Logs all security events

Follow Spring Security patterns in @workspace
Include unit tests for each validation case
```

---

#### BE-302: Session Management

**Story:** US-008 — Secure Authentication Flow  
**Hours:** 2  
**Priority:** P0

**Description:**
Implement secure session management with proper timeout and concurrent session handling.

**Code Example:**

```java
// src/main/java/com/example/orders/security/SessionConfig.java

@Configuration
@EnableWebSecurity
public class SessionConfig {
    
    @Bean
    public SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        // Limit concurrent sessions
        ConcurrentSessionControlAuthenticationStrategy strategy =
            new ConcurrentSessionControlAuthenticationStrategy(sessionRegistry());
        strategy.setMaximumSessions(3); // Max 3 concurrent sessions per user
        strategy.setExceptionIfMaximumExceeded(false); // Expire oldest session
        return strategy;
    }
    
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }
    
    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }
}

// src/main/java/com/example/orders/security/SessionService.java

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {
    
    private final SessionRegistry sessionRegistry;
    private final RefreshTokenRepository refreshTokenRepository;
    
    /**
     * Invalidate all sessions for a user (used for password change, account lock, etc.)
     */
    public void invalidateAllSessions(String username) {
        log.info("AUDIT_EVENT: Invalidating all sessions for user: {}", username);
        
        // Invalidate Spring sessions
        List<Object> principals = sessionRegistry.getAllPrincipals();
        for (Object principal : principals) {
            if (principal instanceof UserDetails userDetails) {
                if (userDetails.getUsername().equals(username)) {
                    sessionRegistry.getAllSessions(principal, false)
                        .forEach(session -> session.expireNow());
                }
            }
        }
        
        // Invalidate refresh tokens
        refreshTokenRepository.deleteAllByUsername(username);
    }
    
    /**
     * Get active session count for a user.
     */
    public int getActiveSessionCount(String username) {
        return (int) sessionRegistry.getAllPrincipals().stream()
            .filter(p -> p instanceof UserDetails)
            .map(p -> (UserDetails) p)
            .filter(u -> u.getUsername().equals(username))
            .flatMap(u -> sessionRegistry.getAllSessions(u, false).stream())
            .count();
    }
    
    /**
     * Check if session limit is reached.
     */
    public boolean isSessionLimitReached(String username, int limit) {
        return getActiveSessionCount(username) >= limit;
    }
}
```

---

#### BE-303: Token Revocation Endpoint

**Story:** US-008 — Secure Authentication Flow  
**Hours:** 2  
**Priority:** P0

**Description:**
Implement endpoint to revoke refresh tokens on logout.

**Code Example:**

```java
// src/main/java/com/example/orders/controller/AuthController.java

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final RefreshTokenService refreshTokenService;
    private final SessionService sessionService;
    
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpRequest) {
        
        String clientIp = getClientIp(httpRequest);
        
        try {
            TokenResponse response = refreshTokenService.refresh(
                request.refreshToken(),
                clientIp
            );
            
            log.info("AUDIT_EVENT: Token refreshed for user from IP: {}", clientIp);
            return ResponseEntity.ok(response);
            
        } catch (InvalidRefreshTokenException e) {
            log.warn("SECURITY_EVENT: Invalid refresh token attempt from IP: {}", clientIp);
            throw e;
        }
    }
    
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal UserDetails user,
            HttpServletRequest request,
            HttpServletResponse response) {
        
        String username = user.getUsername();
        String clientIp = getClientIp(request);
        
        log.info("AUDIT_EVENT: Logout initiated for user: {} from IP: {}", 
            username, clientIp);
        
        // Revoke all refresh tokens for this user
        refreshTokenService.revokeAllForUser(username);
        
        // Clear HTTP session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        
        // Clear security context
        SecurityContextHolder.clearContext();
        
        // Clear cookies
        Cookie refreshCookie = new Cookie("refresh_token", null);
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/api/v1/auth");
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        response.addCookie(refreshCookie);
        
        log.info("AUDIT_EVENT: Logout completed for user: {}", username);
        
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/logout-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> logoutAllSessions(
            @AuthenticationPrincipal UserDetails user,
            HttpServletRequest request) {
        
        String username = user.getUsername();
        
        log.info("AUDIT_EVENT: Logout all sessions for user: {}", username);
        
        // Invalidate all sessions
        sessionService.invalidateAllSessions(username);
        
        // Revoke all refresh tokens
        refreshTokenService.revokeAllForUser(username);
        
        return ResponseEntity.noContent().build();
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
```

---

### Day 3: Authorization

---

#### BE-304: @PreAuthorize on All Endpoints

**Story:** US-009 — Authorization Verification  
**Hours:** 4  
**Priority:** P0

**Description:**
Add @PreAuthorize annotations to all controller endpoints with appropriate authorization rules.

**Code Example:**

```java
// src/main/java/com/example/orders/controller/OrderController.java

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderController {
    
    private final OrderService orderService;
    private final OrderSecurityService orderSecurityService;
    
    /**
     * List orders. Regular users see only their orders.
     * Admins can see all orders.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<PagedResponse<OrderSummaryDto>> listOrders(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        // Admins see all, users see only their own
        boolean isAdmin = user.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        String ownerFilter = isAdmin ? null : user.getUsername();
        
        Page<OrderSummaryDto> orders = orderService.findOrders(
            status, customerId, ownerFilter, PageRequest.of(page, size)
        );
        
        return ResponseEntity.ok(PagedResponse.from(orders));
    }
    
    /**
     * Get order by ID. Users can only access their own orders.
     */
    @GetMapping("/{id}")
    @PreAuthorize("@orderSecurityService.canAccessOrder(#id, authentication)")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long id) {
        OrderDto order = orderService.findById(id);
        return ResponseEntity.ok(order);
    }
    
    /**
     * Create a new order.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Auditable(action = "CREATE_ORDER")
    public ResponseEntity<OrderDto> createOrder(
            @Valid @RequestBody OrderCreateRequest request,
            @AuthenticationPrincipal UserDetails user) {
        
        OrderDto order = orderService.createOrder(request, user.getUsername());
        
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(order.id())
            .toUri();
        
        return ResponseEntity.created(location).body(order);
    }
    
    /**
     * Cancel an order. Users can only cancel their own orders.
     * Order must be in cancellable status.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("@orderSecurityService.canCancelOrder(#id, authentication)")
    @Auditable(action = "CANCEL_ORDER")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable Long id,
            @RequestHeader(value = "If-Match", required = false) String ifMatch) {
        
        Long expectedVersion = parseVersion(ifMatch);
        orderService.cancelOrder(id, expectedVersion);
        
        return ResponseEntity.noContent().build();
    }
    
    private Long parseVersion(String ifMatch) {
        if (ifMatch == null || ifMatch.isEmpty()) {
            return null;
        }
        // Remove quotes: "123" -> 123
        String version = ifMatch.replaceAll("\"", "");
        try {
            return Long.parseLong(version);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
```

---

#### BE-305: Resource Ownership Validation

**Story:** US-009 — Authorization Verification  
**Hours:** 3  
**Priority:** P0

**Description:**
Implement service to validate resource ownership for authorization decisions.

**Code Example:**

```java
// src/main/java/com/example/orders/security/OrderSecurityService.java

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderSecurityService {
    
    private final OrderRepository orderRepository;
    
    /**
     * Check if the authenticated user can access the specified order.
     * Access is granted if:
     * - User is the owner of the order
     * - User has ADMIN role
     * 
     * @param orderId The order ID to check
     * @param authentication The current authentication
     * @return true if access is allowed
     */
    public boolean canAccessOrder(Long orderId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.debug("Access denied: no authentication");
            return false;
        }
        
        // Admins can access any order
        if (hasRole(authentication, "ROLE_ADMIN")) {
            log.debug("Access granted: admin role for order {}", orderId);
            return true;
        }
        
        // Check ownership
        String username = authentication.getName();
        Optional<Order> order = orderRepository.findById(orderId);
        
        if (order.isEmpty()) {
            log.debug("Access check for non-existent order {}", orderId);
            // Let the service layer throw 404
            return true;
        }
        
        boolean isOwner = username.equals(order.get().getCreatedBy());
        
        if (!isOwner) {
            log.warn("SECURITY_EVENT: Access denied for user {} to order {} (owner: {})",
                username, orderId, order.get().getCreatedBy());
        }
        
        return isOwner;
    }
    
    /**
     * Check if the authenticated user can cancel the specified order.
     * Cancellation requires:
     * - Access permission (ownership or admin)
     * - Order is in cancellable status
     * 
     * @param orderId The order ID to check
     * @param authentication The current authentication
     * @return true if cancellation is allowed
     */
    public boolean canCancelOrder(Long orderId, Authentication authentication) {
        if (!canAccessOrder(orderId, authentication)) {
            return false;
        }
        
        Optional<Order> order = orderRepository.findById(orderId);
        
        if (order.isEmpty()) {
            return true; // Let service layer throw 404
        }
        
        boolean isCancellable = order.get().getStatus().isCancellable();
        
        if (!isCancellable) {
            log.info("Cancel denied for order {}: status {} is not cancellable",
                orderId, order.get().getStatus());
        }
        
        return isCancellable;
    }
    
    /**
     * Check if user can view all orders (admin only).
     */
    public boolean canViewAllOrders(Authentication authentication) {
        return hasRole(authentication, "ROLE_ADMIN");
    }
    
    private boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals(role));
    }
}
```

---

#### BE-306: 403 Forbidden Handling

**Story:** US-009 — Authorization Verification  
**Hours:** 1  
**Priority:** P0

**Description:**
Handle AccessDeniedException with proper Problem Details response.

**Code Example:**

```java
// src/main/java/com/example/orders/exception/GlobalExceptionHandler.java

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {
        
        log.warn("SECURITY_EVENT: Access denied - path: {}, user: {}, reason: {}",
            request.getRequestURI(),
            getCurrentUsername(),
            ex.getMessage());
        
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.FORBIDDEN,
            "You do not have permission to perform this action"
        );
        
        problem.setTitle("Forbidden");
        problem.setType(URI.create("about:blank"));
        problem.setProperty("path", request.getRequestURI());
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(problem);
    }
    
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetail> handleAuthenticationException(
            AuthenticationException ex,
            HttpServletRequest request) {
        
        log.warn("SECURITY_EVENT: Authentication failed - path: {}, reason: {}",
            request.getRequestURI(),
            ex.getMessage());
        
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.UNAUTHORIZED,
            "Authentication required"
        );
        
        problem.setTitle("Unauthorized");
        problem.setType(URI.create("about:blank"));
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }
    
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "anonymous";
    }
}
```

---

### Day 4: Input Validation

---

#### BE-307: Input Validation Annotations

**Story:** US-010 — Input Validation Complete  
**Hours:** 3  
**Priority:** P0

**Description:**
Add comprehensive validation annotations to all DTOs.

**Code Example:**

```java
// src/main/java/com/example/orders/dto/OrderCreateRequest.java

public record OrderCreateRequest(
    
    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be positive")
    Long customerId,
    
    @NotEmpty(message = "At least one item is required")
    @Size(max = 50, message = "Maximum 50 items per order")
    @Valid
    List<OrderItemRequest> items,
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    @SafeHtml(message = "Notes contain invalid characters")
    String notes,
    
    @Size(max = 20, message = "External reference cannot exceed 20 characters")
    @Pattern(
        regexp = "^[A-Z0-9-]*$",
        message = "External reference must contain only uppercase letters, numbers, and dashes"
    )
    String externalReference,
    
    @Size(max = 50, message = "Priority cannot exceed 50 characters")
    @Pattern(
        regexp = "^(LOW|NORMAL|HIGH|URGENT)?$",
        message = "Priority must be LOW, NORMAL, HIGH, or URGENT"
    )
    String priority
    
) {
    // Compact constructor for additional validation
    public OrderCreateRequest {
        // Ensure items is never null
        if (items == null) {
            items = List.of();
        }
        
        // Default priority
        if (priority == null || priority.isEmpty()) {
            priority = "NORMAL";
        }
        
        // Trim strings
        notes = notes != null ? notes.trim() : null;
        externalReference = externalReference != null ? externalReference.trim().toUpperCase() : null;
    }
}

// src/main/java/com/example/orders/dto/OrderItemRequest.java

public record OrderItemRequest(
    
    @NotNull(message = "Item ID is required")
    @Positive(message = "Item ID must be positive")
    Long itemId,
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 9999, message = "Quantity cannot exceed 9999")
    Integer quantity,
    
    @DecimalMin(value = "0.00", message = "Unit price cannot be negative")
    @DecimalMax(value = "999999.99", message = "Unit price exceeds maximum")
    @Digits(integer = 6, fraction = 2, message = "Invalid price format")
    BigDecimal unitPrice,
    
    @Size(max = 200, message = "Item notes cannot exceed 200 characters")
    @SafeHtml(message = "Item notes contain invalid characters")
    String notes
    
) {}
```

---

#### BE-308: Custom Validators for Complex Rules

**Story:** US-010 — Input Validation Complete  
**Hours:** 3  
**Priority:** P0

**Description:**
Create custom validators for complex validation rules.

**Code Example:**

```java
// src/main/java/com/example/orders/validation/SafeHtml.java

@Documented
@Constraint(validatedBy = SafeHtmlValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface SafeHtml {
    String message() default "Contains potentially unsafe content";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// src/main/java/com/example/orders/validation/SafeHtmlValidator.java

@Component
@Slf4j
public class SafeHtmlValidator implements ConstraintValidator<SafeHtml, String> {
    
    // Patterns that indicate potential XSS or injection attacks
    private static final List<Pattern> DANGEROUS_PATTERNS = List.of(
        // Script tags
        Pattern.compile("<script", Pattern.CASE_INSENSITIVE),
        // Event handlers
        Pattern.compile("on\\w+\\s*=", Pattern.CASE_INSENSITIVE),
        // JavaScript protocol
        Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE),
        // Data protocol
        Pattern.compile("data:", Pattern.CASE_INSENSITIVE),
        // VBScript
        Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE),
        // Expression
        Pattern.compile("expression\\s*\\(", Pattern.CASE_INSENSITIVE),
        // Embedded objects
        Pattern.compile("<(iframe|object|embed|form|input)", Pattern.CASE_INSENSITIVE),
        // SQL injection patterns
        Pattern.compile("('|\")?\\s*(;|--|#|/\\*)", Pattern.CASE_INSENSITIVE),
        // Command injection patterns
        Pattern.compile("[|;&`$]"),
        // NULL bytes
        Pattern.compile("\0")
    );
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true;
        }
        
        for (Pattern pattern : DANGEROUS_PATTERNS) {
            if (pattern.matcher(value).find()) {
                log.warn("SECURITY_EVENT: Dangerous pattern detected: {} in value: {}",
                    pattern.pattern(), truncate(value));
                return false;
            }
        }
        
        return true;
    }
    
    private String truncate(String value) {
        return value.length() > 50 ? value.substring(0, 50) + "..." : value;
    }
}

// src/main/java/com/example/orders/validation/ValidOrderStatus.java

@Documented
@Constraint(validatedBy = ValidOrderStatusValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidOrderStatus {
    String message() default "Invalid order status";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    
    OrderStatus[] allowed() default {};
}

// src/main/java/com/example/orders/validation/ValidOrderStatusValidator.java

public class ValidOrderStatusValidator 
        implements ConstraintValidator<ValidOrderStatus, OrderStatus> {
    
    private Set<OrderStatus> allowedStatuses;
    
    @Override
    public void initialize(ValidOrderStatus annotation) {
        if (annotation.allowed().length > 0) {
            allowedStatuses = Set.of(annotation.allowed());
        } else {
            allowedStatuses = Set.of(OrderStatus.values());
        }
    }
    
    @Override
    public boolean isValid(OrderStatus value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // Let @NotNull handle null check
        }
        return allowedStatuses.contains(value);
    }
}
```

---

#### BE-309: SQL Injection Verification

**Story:** US-010 — Input Validation Complete  
**Hours:** 1  
**Priority:** P0

**Description:**
Verify all database queries are parameterized and not vulnerable to SQL injection.

**Code Example:**

```java
// src/main/java/com/example/orders/repository/OrderRepository.java

/**
 * Order repository with parameterized queries.
 * 
 * SECURITY: All queries use JPA Criteria API or JPQL parameters.
 * Never concatenate user input into queries.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, 
                                         JpaSpecificationExecutor<Order> {
    
    // ✅ SAFE: Uses JPQL parameters
    @Query("SELECT o FROM Order o WHERE o.createdBy = :username AND o.status = :status")
    List<Order> findByCreatedByAndStatus(
        @Param("username") String username, 
        @Param("status") OrderStatus status
    );
    
    // ✅ SAFE: Spring Data method naming
    List<Order> findByCustomerIdAndCreatedByOrderByCreatedAtDesc(
        Long customerId, 
        String createdBy
    );
    
    // ✅ SAFE: Uses Specification (criteria API)
    // Defined in JpaSpecificationExecutor
    
    // ❌ NEVER DO THIS - vulnerable to SQL injection
    // @Query("SELECT * FROM orders WHERE created_by = '" + username + "'")
}

// src/main/java/com/example/orders/repository/OrderSpecification.java

/**
 * Type-safe specifications using Criteria API.
 * All predicates use parameterized values.
 */
public class OrderSpecification {
    
    public static Specification<Order> hasStatus(OrderStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return cb.conjunction();
            }
            // ✅ SAFE: Criteria API uses parameters
            return cb.equal(root.get("status"), status);
        };
    }
    
    public static Specification<Order> hasCreatedBy(String username) {
        return (root, query, cb) -> {
            if (username == null || username.isEmpty()) {
                return cb.conjunction();
            }
            // ✅ SAFE: Criteria API uses parameters
            return cb.equal(root.get("createdBy"), username);
        };
    }
    
    public static Specification<Order> searchNotes(String searchTerm) {
        return (root, query, cb) -> {
            if (searchTerm == null || searchTerm.isEmpty()) {
                return cb.conjunction();
            }
            // ✅ SAFE: Uses LIKE with parameter, not string concat
            String pattern = "%" + escapeWildcards(searchTerm) + "%";
            return cb.like(cb.lower(root.get("notes")), pattern.toLowerCase());
        };
    }
    
    /**
     * Escape SQL LIKE wildcards in search terms.
     */
    private static String escapeWildcards(String input) {
        return input
            .replace("\\", "\\\\")
            .replace("%", "\\%")
            .replace("_", "\\_");
    }
}
```

---

### Day 5: CSRF + Security Headers

---

#### BE-310: CSRF Configuration

**Story:** Security Infrastructure  
**Hours:** 2  
**Priority:** P0

**Description:**
Configure CSRF protection for the application.

**Code Example:**

```java
// src/main/java/com/example/orders/config/CsrfConfig.java

@Configuration
public class CsrfConfig {
    
    @Bean
    public CookieCsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        repository.setCookieName("XSRF-TOKEN");
        repository.setHeaderName("X-CSRF-TOKEN");
        repository.setCookiePath("/");
        repository.setSecure(true); // HTTPS only
        return repository;
    }
}

// In SecurityConfig.java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        // CSRF protection
        .csrf(csrf -> csrf
            .csrfTokenRepository(csrfTokenRepository)
            .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
            // Exempt API endpoints that use token auth (optional)
            // .ignoringRequestMatchers("/api/v1/auth/**")
        )
        // ... rest of config
        .build();
}

// src/main/java/com/example/orders/security/SpaCsrfTokenRequestHandler.java

/**
 * CSRF token handler for Single Page Applications.
 * Reads token from either cookie or header.
 */
public class SpaCsrfTokenRequestHandler extends CsrfTokenRequestAttributeHandler {
    
    private final CsrfTokenRequestHandler delegate = new XorCsrfTokenRequestAttributeHandler();
    
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                      Supplier<CsrfToken> csrfToken) {
        // Always use XorCsrfTokenRequestAttributeHandler to handle token
        delegate.handle(request, response, csrfToken);
    }
    
    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
        // First check header
        String headerToken = request.getHeader(csrfToken.getHeaderName());
        if (StringUtils.hasText(headerToken)) {
            return super.resolveCsrfTokenValue(request, csrfToken);
        }
        
        // Fallback to delegate (handles BREACH protection)
        return delegate.resolveCsrfTokenValue(request, csrfToken);
    }
}
```

---

#### BE-311: Security Headers Filter

**Story:** Security Infrastructure  
**Hours:** 3  
**Priority:** P0

**Description:**
Configure comprehensive security headers.

**Code Example:**

```java
// src/main/java/com/example/orders/config/SecurityHeadersConfig.java

@Configuration
public class SecurityHeadersConfig {
    
    @Bean
    public SecurityFilterChain securityHeaders(HttpSecurity http) throws Exception {
        return http
            .headers(headers -> headers
                // Content Security Policy
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives(buildCspPolicy())
                )
                
                // Prevent MIME sniffing
                .contentTypeOptions(Customizer.withDefaults())
                
                // Prevent clickjacking
                .frameOptions(frame -> frame.deny())
                
                // Referrer policy
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                )
                
                // Permissions policy (formerly Feature-Policy)
                .permissionsPolicy(permissions -> permissions
                    .policy(buildPermissionsPolicy())
                )
                
                // HSTS (HTTP Strict Transport Security)
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000) // 1 year
                    .preload(true)
                )
                
                // Cache control for sensitive endpoints
                .cacheControl(Customizer.withDefaults())
            )
            .build();
    }
    
    private String buildCspPolicy() {
        return String.join("; ",
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'", // For CSS-in-JS
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self' " + getAllowedApiOrigins(),
            "frame-ancestors 'none'",
            "form-action 'self'",
            "base-uri 'self'",
            "object-src 'none'"
        );
    }
    
    private String buildPermissionsPolicy() {
        return String.join(", ",
            "geolocation=()",
            "microphone=()",
            "camera=()",
            "payment=()",
            "usb=()"
        );
    }
    
    private String getAllowedApiOrigins() {
        // In production, this should be from configuration
        return "https://api.example.com";
    }
}

// src/main/java/com/example/orders/filter/SecurityHeadersFilter.java

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class SecurityHeadersFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        // Add custom security headers not covered by Spring Security
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-XSS-Protection", "0"); // Deprecated, use CSP
        response.setHeader("X-Permitted-Cross-Domain-Policies", "none");
        
        // Prevent caching of sensitive endpoints
        if (isSensitiveEndpoint(request.getRequestURI())) {
            response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            response.setHeader("Pragma", "no-cache");
            response.setHeader("Expires", "0");
        }
        
        filterChain.doFilter(request, response);
    }
    
    private boolean isSensitiveEndpoint(String uri) {
        return uri.contains("/auth/") ||
               uri.contains("/user/") ||
               uri.contains("/admin/");
    }
}
```

---

#### BE-312: CORS Configuration Hardening

**Story:** Security Infrastructure  
**Hours:** 2  
**Priority:** P0

**Description:**
Harden CORS configuration to prevent unauthorized cross-origin requests.

**Code Example:**

```java
// src/main/java/com/example/orders/config/CorsConfig.java

@Configuration
@Slf4j
public class CorsConfig {
    
    @Value("${security.cors.allowed-origins}")
    private List<String> allowedOrigins;
    
    @Value("${security.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private List<String> allowedMethods;
    
    @Value("${security.cors.max-age:3600}")
    private Long maxAge;
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Only allow specific origins - never use "*" with credentials
        config.setAllowedOrigins(allowedOrigins);
        log.info("CORS allowed origins: {}", allowedOrigins);
        
        // Allowed HTTP methods
        config.setAllowedMethods(allowedMethods);
        
        // Allowed headers
        config.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "X-CSRF-TOKEN",
            "X-Requested-With",
            "Accept",
            "Origin",
            "If-Match" // For optimistic locking
        ));
        
        // Headers exposed to browser
        config.setExposedHeaders(List.of(
            "X-Request-Id",
            "ETag", // For optimistic locking
            "Location" // For created resources
        ));
        
        // Allow credentials (cookies, auth headers)
        config.setAllowCredentials(true);
        
        // Preflight cache duration
        config.setMaxAge(maxAge);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        
        return source;
    }
    
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }
}

// application.yml
security:
  cors:
    allowed-origins:
      - https://app.example.com
      - https://staging.example.com
    allowed-methods: GET,POST,PUT,DELETE,OPTIONS
    max-age: 3600
```

---

### Day 6: Audit Logging

---

#### BE-313: Audit Event Expansion

**Story:** US-011 — Comprehensive Audit Logging  
**Hours:** 3  
**Priority:** P0

**Description:**
Expand audit logging to cover all security-relevant events.

**Code Example:**

```java
// src/main/java/com/example/orders/audit/AuditEvent.java

@Builder
@Data
public class AuditEvent {
    private Instant timestamp;
    private String action;
    private String username;
    private String resource;
    private String outcome;
    private String ipAddress;
    private String userAgent;
    private String requestId;
    private Map<String, Object> details;
}

// src/main/java/com/example/orders/audit/AuditLogger.java

@Component
@Slf4j
public class AuditLogger {
    
    private final ObjectMapper objectMapper;
    
    public AuditLogger(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper.copy()
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }
    
    public void logSuccess(String action, String resource, Map<String, Object> details) {
        log("INFO", action, resource, "SUCCESS", details);
    }
    
    public void logFailure(String action, String resource, String reason) {
        log("WARN", action, resource, "FAILURE", Map.of("reason", reason));
    }
    
    public void logSecurityEvent(String action, String resource, String reason) {
        log("WARN", action, resource, "SECURITY_VIOLATION", Map.of("reason", reason));
    }
    
    public void logAccessDenied(String action, String resource) {
        log("WARN", action, resource, "ACCESS_DENIED", null);
    }
    
    private void log(String level, String action, String resource, 
                     String outcome, Map<String, Object> details) {
        
        HttpServletRequest request = getCurrentRequest();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        AuditEvent event = AuditEvent.builder()
            .timestamp(Instant.now())
            .action(action)
            .username(auth != null ? auth.getName() : "anonymous")
            .resource(resource)
            .outcome(outcome)
            .ipAddress(getClientIp(request))
            .userAgent(request != null ? request.getHeader("User-Agent") : null)
            .requestId(MDC.get("requestId"))
            .details(maskSensitiveData(details))
            .build();
        
        try {
            String json = objectMapper.writeValueAsString(event);
            
            switch (level) {
                case "WARN" -> log.warn("AUDIT: {}", json);
                case "ERROR" -> log.error("AUDIT: {}", json);
                default -> log.info("AUDIT: {}", json);
            }
            
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize audit event", e);
        }
    }
    
    private Map<String, Object> maskSensitiveData(Map<String, Object> details) {
        if (details == null) return null;
        
        Map<String, Object> masked = new HashMap<>(details);
        List<String> sensitiveKeys = List.of(
            "password", "secret", "token", "key", "authorization",
            "creditCard", "ssn", "email"
        );
        
        for (String key : masked.keySet()) {
            String lowerKey = key.toLowerCase();
            if (sensitiveKeys.stream().anyMatch(lowerKey::contains)) {
                masked.put(key, "***MASKED***");
            }
        }
        
        return masked;
    }
    
    private HttpServletRequest getCurrentRequest() {
        RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
        if (attrs instanceof ServletRequestAttributes servletAttrs) {
            return servletAttrs.getRequest();
        }
        return null;
    }
    
    private String getClientIp(HttpServletRequest request) {
        if (request == null) return "unknown";
        
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
```

---

#### BE-314: Sensitive Data Masking

**Story:** US-011 — Comprehensive Audit Logging  
**Hours:** 2  
**Priority:** P0

**Description:**
Mask sensitive data in all log output.

**Code Example:**

```java
// src/main/java/com/example/orders/logging/SensitiveDataMasker.java

@Component
public class SensitiveDataMasker {
    
    private static final List<MaskingRule> MASKING_RULES = List.of(
        // Email: j***@e***.com
        new MaskingRule(
            Pattern.compile("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})"),
            match -> {
                String[] parts = match.split("[@.]");
                return parts[0].charAt(0) + "***@" + parts[1].charAt(0) + "***." + parts[parts.length - 1];
            }
        ),
        
        // Credit card: ****-****-****-1234
        new MaskingRule(
            Pattern.compile("\\b\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}\\b"),
            match -> "****-****-****-" + match.replaceAll("[^0-9]", "").substring(12)
        ),
        
        // SSN: ***-**-1234
        new MaskingRule(
            Pattern.compile("\\b\\d{3}[-]?\\d{2}[-]?\\d{4}\\b"),
            match -> "***-**-" + match.replaceAll("[^0-9]", "").substring(5)
        ),
        
        // Phone: ***-***-1234
        new MaskingRule(
            Pattern.compile("\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b"),
            match -> "***-***-" + match.replaceAll("[^0-9]", "").substring(6)
        )
    );
    
    public String mask(String input) {
        if (input == null) return null;
        
        String masked = input;
        for (MaskingRule rule : MASKING_RULES) {
            masked = rule.apply(masked);
        }
        return masked;
    }
    
    public <T> T maskObject(T object) {
        if (object == null) return null;
        
        // Use reflection or a dedicated serializer to mask fields
        // This is a simplified version
        if (object instanceof String str) {
            return (T) mask(str);
        }
        
        return object;
    }
    
    @Value
    private static class MaskingRule {
        Pattern pattern;
        Function<String, String> replacement;
        
        String apply(String input) {
            Matcher matcher = pattern.matcher(input);
            StringBuilder result = new StringBuilder();
            
            while (matcher.find()) {
                matcher.appendReplacement(result, replacement.apply(matcher.group()));
            }
            matcher.appendTail(result);
            
            return result.toString();
        }
    }
}

// Logback configuration for masking
// src/main/resources/logback-spring.xml

<configuration>
    <conversionRule conversionWord="maskedMsg" 
                    converterClass="com.example.orders.logging.MaskingConverter" />
    
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <provider class="com.example.orders.logging.MaskedMessageProvider"/>
        </encoder>
    </appender>
</configuration>
```

---

#### BE-315: Security Event Logging

**Story:** US-011 — Comprehensive Audit Logging  
**Hours:** 2  
**Priority:** P0

**Description:**
Log all security events for monitoring and alerting.

**Code Example:**

```java
// src/main/java/com/example/orders/security/SecurityEventListener.java

@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityEventListener {
    
    private final AuditLogger auditLogger;
    
    @EventListener
    public void onAuthenticationSuccess(AuthenticationSuccessEvent event) {
        String username = event.getAuthentication().getName();
        
        auditLogger.logSuccess(
            "AUTHENTICATION",
            "user:" + username,
            Map.of("method", "password")
        );
    }
    
    @EventListener
    public void onAuthenticationFailure(AbstractAuthenticationFailureEvent event) {
        String username = event.getAuthentication().getName();
        String reason = event.getException().getMessage();
        
        auditLogger.logSecurityEvent(
            "AUTHENTICATION_FAILURE",
            "user:" + username,
            reason
        );
    }
    
    @EventListener
    public void onAuthorizationDenied(AuthorizationDeniedEvent event) {
        Authentication auth = event.getAuthentication();
        String username = auth != null ? auth.getName() : "anonymous";
        
        auditLogger.logAccessDenied(
            "AUTHORIZATION_DENIED",
            event.getSource().toString()
        );
    }
    
    @EventListener
    public void onSessionCreated(SessionCreatedEvent event) {
        log.debug("Session created: {}", event.getSessionId());
    }
    
    @EventListener
    public void onSessionDestroyed(SessionDestroyedEvent event) {
        log.debug("Session destroyed: {}", event.getId());
        
        for (SecurityContext context : event.getSecurityContexts()) {
            if (context.getAuthentication() != null) {
                auditLogger.logSuccess(
                    "LOGOUT",
                    "user:" + context.getAuthentication().getName(),
                    Map.of("sessionId", event.getId())
                );
            }
        }
    }
}

// src/main/java/com/example/orders/security/Auditable.java

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Auditable {
    String action();
    boolean includeArgs() default false;
    boolean includeResult() default false;
}

// src/main/java/com/example/orders/security/AuditableAspect.java

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
@Order(Ordered.LOWEST_PRECEDENCE - 1) // After security checks
public class AuditableAspect {
    
    private final AuditLogger auditLogger;
    
    @Around("@annotation(auditable)")
    public Object audit(ProceedingJoinPoint pjp, Auditable auditable) throws Throwable {
        String action = auditable.action();
        String resource = extractResource(pjp);
        
        Map<String, Object> details = new HashMap<>();
        if (auditable.includeArgs()) {
            details.put("args", summarizeArgs(pjp.getArgs()));
        }
        
        try {
            Object result = pjp.proceed();
            
            if (auditable.includeResult() && result != null) {
                details.put("result", summarizeResult(result));
            }
            
            auditLogger.logSuccess(action, resource, details);
            return result;
            
        } catch (AccessDeniedException e) {
            auditLogger.logAccessDenied(action, resource);
            throw e;
            
        } catch (Exception e) {
            auditLogger.logFailure(action, resource, e.getMessage());
            throw e;
        }
    }
    
    private String extractResource(ProceedingJoinPoint pjp) {
        // Try to find @PathVariable id
        MethodSignature sig = (MethodSignature) pjp.getSignature();
        Parameter[] params = sig.getMethod().getParameters();
        Object[] args = pjp.getArgs();
        
        for (int i = 0; i < params.length; i++) {
            if (params[i].isAnnotationPresent(PathVariable.class)) {
                PathVariable pv = params[i].getAnnotation(PathVariable.class);
                String name = pv.value().isEmpty() ? params[i].getName() : pv.value();
                if (name.equals("id") || name.endsWith("Id")) {
                    return sig.getDeclaringType().getSimpleName()
                        .replace("Controller", "")
                        .toLowerCase() + ":" + args[i];
                }
            }
        }
        
        return sig.getDeclaringType().getSimpleName().replace("Controller", "").toLowerCase();
    }
    
    private Map<String, Object> summarizeArgs(Object[] args) {
        // Create a summary of arguments, excluding sensitive data
        Map<String, Object> summary = new HashMap<>();
        for (int i = 0; i < args.length; i++) {
            if (args[i] != null) {
                summary.put("arg" + i, args[i].getClass().getSimpleName());
            }
        }
        return summary;
    }
    
    private Object summarizeResult(Object result) {
        if (result instanceof ResponseEntity<?> re) {
            return "status:" + re.getStatusCode().value();
        }
        return result.getClass().getSimpleName();
    }
}
```

---

### Day 7: Edge Case Handling

---

#### BE-316: @Version Optimistic Locking

**Story:** Edge Case Handling  
**Hours:** 2  
**Priority:** P1

**Description:**
Implement optimistic locking using JPA @Version.

**Code Example:**

```java
// src/main/java/com/example/orders/entity/Order.java

@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Optimistic locking version.
     * Automatically incremented on each update.
     * Used to detect concurrent modifications.
     */
    @Version
    private Long version;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    
    @CreatedBy
    @Column(nullable = false, updatable = false)
    private String createdBy;
    
    @LastModifiedDate
    private Instant updatedAt;
    
    @LastModifiedBy
    private String updatedBy;
    
    private Instant cancelledAt;
    private String cancelledBy;
    
    @Size(max = 500)
    private String notes;
}
```

---

#### BE-317: Conflict Detection Service

**Story:** Edge Case Handling  
**Hours:** 3  
**Priority:** P1

**Description:**
Implement service layer conflict detection for concurrent modifications.

**Code Example:**

```java
// src/main/java/com/example/orders/service/OrderService.java

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final AuditLogger auditLogger;
    
    /**
     * Cancel an order with optimistic locking.
     * 
     * @param orderId The order ID
     * @param expectedVersion The expected version (from If-Match header)
     * @throws OrderNotFoundException if order doesn't exist
     * @throws OptimisticLockingConflictException if version mismatch
     * @throws OrderNotCancellableException if order status doesn't allow cancellation
     */
    public void cancelOrder(Long orderId, Long expectedVersion) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        // Check version if provided
        if (expectedVersion != null && !order.getVersion().equals(expectedVersion)) {
            log.warn("Version conflict for order {}: expected {}, actual {}",
                orderId, expectedVersion, order.getVersion());
            
            throw new OptimisticLockingConflictException(
                "Order has been modified by another user",
                order.getVersion()
            );
        }
        
        // Validate business rule
        if (!order.getStatus().isCancellable()) {
            throw new OrderNotCancellableException(orderId, order.getStatus());
        }
        
        // Perform cancellation
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(Instant.now());
        order.setCancelledBy(SecurityUtils.getCurrentUsername());
        
        try {
            orderRepository.save(order);
            
        } catch (ObjectOptimisticLockingFailureException e) {
            // Concurrent modification detected at save time
            log.warn("Optimistic locking failure for order {}", orderId);
            
            Order currentOrder = orderRepository.findById(orderId).orElseThrow();
            throw new OptimisticLockingConflictException(
                "Order was modified by another user",
                currentOrder.getVersion()
            );
        }
    }
    
    /**
     * Update order with version check.
     */
    public OrderDto updateOrder(Long orderId, OrderUpdateRequest request, Long expectedVersion) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        // Version check
        if (expectedVersion != null && !order.getVersion().equals(expectedVersion)) {
            throw new OptimisticLockingConflictException(
                "Order has been modified",
                order.getVersion()
            );
        }
        
        // Apply updates
        if (request.notes() != null) {
            order.setNotes(request.notes());
        }
        
        if (request.priority() != null) {
            order.setPriority(request.priority());
        }
        
        try {
            Order saved = orderRepository.save(order);
            return orderMapper.toDto(saved);
            
        } catch (ObjectOptimisticLockingFailureException e) {
            Order currentOrder = orderRepository.findById(orderId).orElseThrow();
            throw new OptimisticLockingConflictException(
                "Concurrent modification detected",
                currentOrder.getVersion()
            );
        }
    }
}

// src/main/java/com/example/orders/exception/OptimisticLockingConflictException.java

public class OptimisticLockingConflictException extends RuntimeException {
    
    private final Long currentVersion;
    
    public OptimisticLockingConflictException(String message, Long currentVersion) {
        super(message);
        this.currentVersion = currentVersion;
    }
    
    public Long getCurrentVersion() {
        return currentVersion;
    }
}

// Exception handler
@ExceptionHandler(OptimisticLockingConflictException.class)
public ResponseEntity<ProblemDetail> handleConflict(
        OptimisticLockingConflictException ex) {
    
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
        HttpStatus.CONFLICT,
        ex.getMessage()
    );
    
    problem.setTitle("Conflict");
    problem.setProperty("currentVersion", ex.getCurrentVersion());
    
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .header("ETag", "\"" + ex.getCurrentVersion() + "\"")
        .body(problem);
}
```

---

#### BE-318: Transaction Isolation Review

**Story:** Edge Case Handling  
**Hours:** 2  
**Priority:** P1

**Description:**
Review and configure appropriate transaction isolation levels.

**Code Example:**

```java
// src/main/java/com/example/orders/service/OrderService.java

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    /**
     * Create order with SERIALIZABLE isolation to prevent phantom reads
     * when checking for duplicate external references.
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public OrderDto createOrderWithUniqueReference(OrderCreateRequest request, String username) {
        // Check for duplicate external reference
        if (request.externalReference() != null) {
            orderRepository.findByExternalReference(request.externalReference())
                .ifPresent(existing -> {
                    throw new DuplicateExternalReferenceException(request.externalReference());
                });
        }
        
        // Create order
        Order order = orderMapper.toEntity(request);
        order.setCreatedBy(username);
        order.setStatus(OrderStatus.PENDING);
        
        return orderMapper.toDto(orderRepository.save(order));
    }
    
    /**
     * Standard operations use READ_COMMITTED (default).
     * Combined with @Version for optimistic locking.
     */
    @Transactional // Default: READ_COMMITTED
    public OrderDto getOrder(Long orderId) {
        return orderRepository.findById(orderId)
            .map(orderMapper::toDto)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
    }
    
    /**
     * Bulk operations use REPEATABLE_READ to ensure consistency
     * across multiple reads within the transaction.
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public BatchResult processBulkUpdate(List<Long> orderIds, OrderStatus newStatus) {
        int success = 0;
        int failed = 0;
        List<String> errors = new ArrayList<>();
        
        for (Long orderId : orderIds) {
            try {
                Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new OrderNotFoundException(orderId));
                
                if (order.getStatus().canTransitionTo(newStatus)) {
                    order.setStatus(newStatus);
                    orderRepository.save(order);
                    success++;
                } else {
                    failed++;
                    errors.add("Order " + orderId + ": invalid status transition");
                }
            } catch (Exception e) {
                failed++;
                errors.add("Order " + orderId + ": " + e.getMessage());
            }
        }
        
        return new BatchResult(success, failed, errors);
    }
}
```

---

### Day 8-9: Security Testing

The testing tasks (BE-319 through BE-324) follow similar patterns as shown in the SPRINT_3_PROGRAM.md file. Key test areas include:

- Authorization tests
- Input validation tests  
- SQL injection prevention tests
- CSRF protection tests
- Rate limiting tests
- Audit logging verification

---

## Verification Commands

```bash
# Run all security tests
./mvnw test -Dgroups=security

# Run authorization tests
./mvnw test -Dtest=*SecurityTest

# Run validation tests
./mvnw test -Dtest=*ValidationTest

# Security scan with OWASP Dependency-Check
./mvnw dependency-check:check

# Run SpotBugs security analysis
./mvnw spotbugs:check

# Check for SQL injection vulnerabilities
grep -rn "createQuery\|createNativeQuery" src/main/java --include="*.java" | grep -v "@Param\|:param"

# Verify all endpoints have authorization
grep -rn "@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping" src/main/java --include="*.java" -A 1 | grep -v "@PreAuthorize"
```

---

## Key References

| Resource | Location |
|----------|----------|
| Sprint 3 Program | [../SPRINT_3_PROGRAM.md](../SPRINT_3_PROGRAM.md) |
| Security Checklist | [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) |
| FE Tasks | [FE_TASKS.md](FE_TASKS.md) |
| Testing Instructions | [../../../../.github/instructions/testing.instructions.md](../../../../.github/instructions/testing.instructions.md) |
| Backend Instructions | [../../../../.github/instructions/backend.instructions.md](../../../../.github/instructions/backend.instructions.md) |
| Authentication ADR | [../../week-03/adrs/001-authentication.md](../../week-03/adrs/001-authentication.md) |
