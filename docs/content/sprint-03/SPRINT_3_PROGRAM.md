# Sprint 3 Program — Harden + Security (Weeks 9-10)

> **Sprint Goal:** Security hardening, edge case robustness, and audit compliance across all surfaces.

**Duration:** 2 weeks (10 working days)  
**Gate:** Security Review Passed + Edge Cases Handled + Audit Logging Complete  
**Prerequisites:** Sprint 2 complete, Sprint 3 Packet approved, NFR baseline established

---

## Sprint Overview

Sprint 3 transitions from feature development to security hardening. With the feature set substantially complete from Sprints 1-2, this sprint focuses on making the system production-ready from a security perspective. Every input is validated, every action is audited, and every vulnerability is addressed.

### What "Harden + Security" Means

```
┌─────────────────────────────────────────────────────────────────┐
│                      HARDEN + SECURITY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Sprint 2 Features      Sprint 3 Hardening                     │
│   ┌───────────────┐      ┌───────────────────────────────────┐  │
│   │ List/View     │      │ + Input sanitization              │  │
│   │ Create        │ ───► │ + Authorization verification      │  │
│   │ Cancel        │      │ + CSRF protection                 │  │
│   │ Filter/Search │      │ + Security headers                │  │
│   └───────────────┘      └───────────────────────────────────┘  │
│                                                                 │
│   OWASP Top 10 Coverage                                         │
│   ├── Injection Prevention     │  SQL, Command, LDAP           │
│   ├── Authentication           │  Token validation, session    │
│   ├── Sensitive Data           │  Encryption, masking          │
│   ├── Access Control           │  Role-based, resource-level   │
│   ├── Security Config          │  Headers, CORS, TLS           │
│   ├── XSS Prevention           │  Output encoding              │
│   ├── CSRF Protection          │  Token validation             │
│   └── Audit Logging            │  Who did what when            │
│                                                                 │
│   Edge Case Hardening                                           │
│   ├── Concurrent modifications │  Optimistic locking           │
│   ├── Boundary conditions      │  Max lengths, ranges          │
│   ├── Race conditions          │  Transaction isolation        │
│   └── Failure scenarios        │  Graceful degradation         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why Security Sprint?

| Benefit | Explanation |
|---------|-------------|
| **Focused attention** | Security requires concentrated effort, not afterthought |
| **Expert review** | Security lead engaged for entire sprint |
| **Compliance ready** | Government systems require documented security |
| **Audit trail** | All actions logged for compliance |
| **Confidence** | Team knows system is secure before ship |

---

## Security Focus Areas

### OWASP Top 10 Coverage

| # | Vulnerability | Sprint 3 Action | Owner |
|---|---------------|-----------------|-------|
| A01 | Broken Access Control | Role-based authorization, resource ownership | BE |
| A02 | Cryptographic Failures | TLS, password hashing, data encryption | BE |
| A03 | Injection | Parameterized queries, input validation | BE |
| A04 | Insecure Design | Threat modeling, abuse case review | Both |
| A05 | Security Misconfiguration | Headers, CORS, error messages | Both |
| A06 | Vulnerable Components | Dependency scan, updates | Both |
| A07 | Auth Failures | Session management, token validation | BE |
| A08 | Data Integrity Failures | Signature verification, integrity checks | BE |
| A09 | Logging Failures | Comprehensive audit logging | Both |
| A10 | SSRF | URL validation, allowlisting | BE |

### Frontend Security

| Area | Implementation | Verification |
|------|----------------|--------------|
| XSS Prevention | React auto-escaping, CSP headers | Security scan |
| CSRF Protection | Token validation on mutations | Penetration test |
| Sensitive Data | No secrets in client, secure storage | Code review |
| Auth Token Handling | HttpOnly cookies, secure transmission | Security audit |
| Input Validation | Client-side + server-side validation | Test coverage |
| Error Messages | No sensitive info in errors | Manual review |

### Backend Security

| Area | Implementation | Verification |
|------|----------------|--------------|
| SQL Injection | JPA parameterized queries | SQLMap scan |
| Command Injection | No shell execution, input validation | Code review |
| Authentication | OAuth 2.0 / OIDC validation | Penetration test |
| Authorization | @PreAuthorize, method security | Integration tests |
| Rate Limiting | Bucket4j throttling | Load test |
| Audit Logging | AuditAware, event logging | Log review |

---

## Day 0: Sprint Planning Prep (Lead Only)

### Lead Checklist

- [ ] Sprint 2 retro actions reviewed
- [ ] Sprint 3 Packet draft complete
- [ ] Security checklist prepared
- [ ] Threat model reviewed
- [ ] Penetration test scope defined
- [ ] Audit requirements documented
- [ ] Security tooling configured
- [ ] Edge case inventory created

### Materials to Prepare

| Material | Source | Purpose |
|----------|--------|---------|
| Sprint 2 retro outcomes | Sprint 2 | Improvement actions |
| Sprint 3 Packet draft | Template | Scope definition |
| Security Checklist | SECURITY_CHECKLIST.md | OWASP verification |
| Threat Model | Security Lead | Attack surface analysis |
| Dependency Report | OWASP Dependency-Check | Vulnerable components |
| Current Test Coverage | Coverage reports | Gap identification |

### Sprint 2 → Sprint 3 Handover

| Sprint 2 Artifact | Sprint 3 Usage |
|-------------------|----------------|
| Create Order endpoint | Add authorization, validation hardening |
| Cancel Order endpoint | Add ownership verification |
| Filter/Search | Add input sanitization |
| Rate limiting | Verify configuration |
| Audit events | Expand coverage |
| Test suite | Add security test cases |

---

## Day 1: Sprint Planning + Security Kickoff (3 hours)

### Sprint Planning Session (2 hours)

**Attendees:** All team members, Product Owner, Tech Leads, Security Lead

#### Agenda

| Time | Activity | Output |
|------|----------|--------|
| 0:00-0:15 | Sprint 2 highlights + learnings | Context set |
| 0:15-0:30 | Security assessment overview | Threat awareness |
| 0:30-1:00 | User story walkthrough (US-008 to US-011) | Stories understood |
| 1:00-1:30 | Task breakdown + estimates | Sprint backlog |
| 1:30-1:45 | Dependency/risk review | Blockers identified |
| 1:45-2:00 | Commitment + working agreements | Sprint committed |

### Security Kickoff (1 hour)

**Attendees:** All developers, Security Lead

#### Agenda

| Time | Activity | Output |
|------|----------|--------|
| 0:00-0:15 | OWASP Top 10 overview | Common vulnerabilities |
| 0:15-0:30 | Threat model walkthrough | Attack vectors |
| 0:30-0:45 | Security tooling demo | How to scan |
| 0:45-1:00 | Q&A + pairing assignments | Teams formed |

### Key Messages

1. **Security is everyone's job** — Not just the security lead
2. **Defense in depth** — Multiple layers of protection
3. **Assume breach** — Design for when (not if) attacks occur
4. **Audit everything** — If it's not logged, it didn't happen
5. **Fail secure** — Errors should deny access, not grant it

---

## Week 9 Schedule: Security Implementation

### Day 2: Authentication Hardening

#### Focus
- Token validation complete
- Session management secure
- Logout/revocation implemented
- Remember me (if applicable)

#### FE Tasks (Day 2)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| FE-301 | Auth token refresh mechanism | 3 | FE Dev |
| FE-302 | Secure token storage | 2 | FE Dev |
| FE-303 | Logout + session clear | 2 | FE Dev |

#### BE Tasks (Day 2)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| BE-301 | Token validation interceptor | 3 | BE Dev |
| BE-302 | Session management | 2 | BE Dev |
| BE-303 | Token revocation endpoint | 2 | BE Dev |

#### Copilot Prompts

```markdown
## P3-AUTH — Authentication Hardening

No secrets, no production data. Use placeholders.

Review and harden the authentication implementation:

1. Token validation
   - Signature verification
   - Expiration checking
   - Issuer validation
   - Audience validation

2. Session security
   - Secure cookie settings
   - Session timeout
   - Concurrent session limits

3. Edge cases
   - Expired token handling
   - Invalid token handling
   - Missing token handling

Follow the security patterns in @workspace
```

---

### Day 3: Authorization Hardening

#### Focus
- Role-based access control complete
- Resource ownership verification
- Method-level security
- API endpoint protection

#### FE Tasks (Day 3)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| FE-304 | Role-based UI rendering | 3 | FE Dev |
| FE-305 | Protected route guards | 2 | FE Dev |
| FE-306 | Permission error handling | 2 | FE Dev |

#### BE Tasks (Day 3)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| BE-304 | @PreAuthorize on all endpoints | 4 | BE Dev |
| BE-305 | Resource ownership validation | 3 | BE Dev |
| BE-306 | 403 Forbidden handling | 1 | BE Dev |

#### Code Example: Resource Ownership

```java
@Service
@RequiredArgsConstructor
public class OrderSecurityService {
    
    private final OrderRepository orderRepository;
    
    /**
     * Verify current user owns the order or has admin role.
     */
    public boolean canAccessOrder(Long orderId, Authentication auth) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        String username = auth.getName();
        boolean isOwner = order.getCreatedBy().equals(username);
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        return isOwner || isAdmin;
    }
    
    /**
     * Verify user can cancel order (owner + order is cancellable).
     */
    public boolean canCancelOrder(Long orderId, Authentication auth) {
        if (!canAccessOrder(orderId, auth)) {
            return false;
        }
        
        Order order = orderRepository.findById(orderId).orElseThrow();
        return order.getStatus().isCancellable();
    }
}
```

```java
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderSecurityService securityService;
    
    @DeleteMapping("/{id}")
    @PreAuthorize("@orderSecurityService.canCancelOrder(#id, authentication)")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

### Day 4: Input Validation + Injection Prevention

#### Focus
- All inputs validated
- SQL injection prevented
- Command injection prevented
- XSS prevention verified

#### FE Tasks (Day 4)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| FE-307 | Input sanitization utilities | 3 | FE Dev |
| FE-308 | Form validation hardening | 3 | FE Dev |
| FE-309 | CSP header configuration | 1 | FE Dev |

#### BE Tasks (Day 4)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| BE-307 | Input validation annotations | 3 | BE Dev |
| BE-308 | Custom validators for complex rules | 3 | BE Dev |
| BE-309 | SQL injection verification | 1 | BE Dev |

#### Code Example: Comprehensive Validation

```java
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
    
    @Pattern(regexp = "^[A-Z0-9-]{0,20}$", message = "Invalid reference format")
    String externalReference
) {}

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
    BigDecimal unitPrice
) {}
```

```java
@Component
public class SafeHtmlValidator implements ConstraintValidator<SafeHtml, String> {
    
    private static final Pattern DANGEROUS_PATTERN = Pattern.compile(
        "<script|javascript:|on\\w+=|<iframe|<object|<embed",
        Pattern.CASE_INSENSITIVE
    );
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }
        return !DANGEROUS_PATTERN.matcher(value).find();
    }
}
```

---

### Day 5: CSRF + Security Headers

#### Focus
- CSRF protection complete
- Security headers configured
- CORS properly restricted
- Cookie security

#### FE Tasks (Day 5)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| FE-310 | CSRF token handling | 3 | FE Dev |
| FE-311 | Secure cookie settings | 2 | FE Dev |
| FE-312 | Security header verification | 2 | FE Dev |

#### BE Tasks (Day 5)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| BE-310 | CSRF configuration | 2 | BE Dev |
| BE-311 | Security headers filter | 3 | BE Dev |
| BE-312 | CORS configuration hardening | 2 | BE Dev |

#### Code Example: Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            // CSRF protection
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
            )
            
            // Session management
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/health", "/api/v1/ready").permitAll()
                .requestMatchers("/api/v1/**").authenticated()
                .anyRequest().denyAll()
            )
            
            // OAuth 2.0 Resource Server
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            )
            
            // Security headers
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'")
                )
                .frameOptions(frame -> frame.deny())
                .xssProtection(xss -> xss.disable()) // Use CSP instead
                .contentTypeOptions(Customizer.withDefaults())
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                )
                .permissionsPolicy(permissions -> permissions
                    .policy("geolocation=(), microphone=(), camera=()")
                )
            )
            
            .build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://app.example.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-CSRF-TOKEN"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
```

---

## Week 10 Schedule: Edge Cases + Hardening

### Day 6: Audit Logging Complete

#### Focus
- All security events logged
- Structured logging format
- Log levels appropriate
- Sensitive data masked

#### FE Tasks (Day 6)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| FE-313 | Client-side error logging | 3 | FE Dev |
| FE-314 | User action tracking | 2 | FE Dev |
| FE-315 | PII masking in logs | 2 | FE Dev |

#### BE Tasks (Day 6)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| BE-313 | Audit event expansion | 3 | BE Dev |
| BE-314 | Sensitive data masking | 2 | BE Dev |
| BE-315 | Security event logging | 2 | BE Dev |

#### Code Example: Comprehensive Audit Logging

```java
@Aspect
@Component
@Slf4j
public class SecurityAuditAspect {
    
    @Around("@annotation(auditable)")
    public Object auditSecurityAction(ProceedingJoinPoint pjp, Auditable auditable) 
            throws Throwable {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "anonymous";
        String action = auditable.action();
        String resource = extractResource(pjp);
        
        AuditEvent event = AuditEvent.builder()
            .timestamp(Instant.now())
            .username(username)
            .action(action)
            .resource(resource)
            .ipAddress(getClientIp())
            .userAgent(getUserAgent())
            .build();
        
        try {
            Object result = pjp.proceed();
            event.setOutcome("SUCCESS");
            event.setDetails(auditable.includeResult() ? summarize(result) : null);
            logAuditEvent(event);
            return result;
            
        } catch (AccessDeniedException e) {
            event.setOutcome("ACCESS_DENIED");
            event.setDetails("Unauthorized access attempt");
            logSecurityEvent(event);
            throw e;
            
        } catch (Exception e) {
            event.setOutcome("FAILURE");
            event.setDetails(e.getMessage());
            logAuditEvent(event);
            throw e;
        }
    }
    
    private void logSecurityEvent(AuditEvent event) {
        log.warn("SECURITY_EVENT: action={}, user={}, resource={}, outcome={}, ip={}",
            event.getAction(),
            event.getUsername(),
            event.getResource(),
            event.getOutcome(),
            event.getIpAddress()
        );
    }
    
    private void logAuditEvent(AuditEvent event) {
        log.info("AUDIT_EVENT: action={}, user={}, resource={}, outcome={}",
            event.getAction(),
            event.getUsername(),
            event.getResource(),
            event.getOutcome()
        );
    }
}
```

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String action();
    boolean includeResult() default false;
}

// Usage
@DeleteMapping("/{id}")
@Auditable(action = "CANCEL_ORDER")
@PreAuthorize("@orderSecurityService.canCancelOrder(#id, authentication)")
public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
    orderService.cancelOrder(id);
    return ResponseEntity.noContent().build();
}
```

---

### Day 7: Edge Case Handling

#### Focus
- Concurrent modification handling
- Boundary condition tests
- Race condition prevention
- Timeout handling

#### FE Tasks (Day 7)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| FE-316 | Optimistic locking UI | 3 | FE Dev |
| FE-317 | Conflict resolution dialog | 2 | FE Dev |
| FE-318 | Timeout handling | 2 | FE Dev |

#### BE Tasks (Day 7)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| BE-316 | @Version optimistic locking | 2 | BE Dev |
| BE-317 | Conflict detection service | 3 | BE Dev |
| BE-318 | Transaction isolation review | 2 | BE Dev |

#### Code Example: Optimistic Locking

```java
@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Version
    private Long version;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    // ... other fields
}

@Service
@Transactional
public class OrderService {
    
    public OrderDto cancelOrder(Long orderId, Long expectedVersion) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        // Version mismatch detection
        if (!order.getVersion().equals(expectedVersion)) {
            throw new OptimisticLockingConflictException(
                "Order has been modified. Please refresh and try again.",
                order.getVersion()
            );
        }
        
        // Business rule validation
        if (!order.getStatus().isCancellable()) {
            throw new OrderNotCancellableException(orderId, order.getStatus());
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(Instant.now());
        order.setCancelledBy(getCurrentUsername());
        
        return orderMapper.toDto(orderRepository.save(order));
    }
}
```

```typescript
// Frontend conflict handling
async function cancelOrder(orderId: string, version: number): Promise<Order> {
  try {
    const response = await fetch(`/api/v1/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'If-Match': `"${version}"`,
      },
    });
    
    if (response.status === 409) {
      const conflict = await response.json();
      throw new ConflictError(
        'Order was modified by another user. Please refresh.',
        conflict.currentVersion
      );
    }
    
    if (!response.ok) {
      throw new ApiError(response);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof ConflictError) {
      // Show conflict resolution dialog
      showConflictDialog(error);
    }
    throw error;
  }
}
```

---

### Day 8: Security Testing

#### Focus
- Security unit tests
- Penetration test preparation
- Vulnerability scanning
- Security code review

#### FE Tasks (Day 8)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| FE-319 | Security test suite | 4 | FE Dev |
| FE-320 | XSS test cases | 2 | FE Dev |
| FE-321 | Auth flow tests | 2 | FE Dev |

#### BE Tasks (Day 8)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| BE-319 | Security test suite | 4 | BE Dev |
| BE-320 | Authorization tests | 2 | BE Dev |
| BE-321 | Injection test cases | 2 | BE Dev |

#### Code Example: Security Tests

```java
@SpringBootTest
@AutoConfigureMockMvc
class OrderSecurityTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser(username = "user1")
    void cancelOrder_ownOrder_succeeds() throws Exception {
        mockMvc.perform(delete("/api/v1/orders/1")
                .with(csrf()))
            .andExpect(status().isNoContent());
    }
    
    @Test
    @WithMockUser(username = "user2")
    void cancelOrder_otherUsersOrder_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/orders/1")
                .with(csrf()))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.type").value("about:blank"))
            .andExpect(jsonPath("$.title").value("Forbidden"));
    }
    
    @Test
    void cancelOrder_noAuth_returns401() throws Exception {
        mockMvc.perform(delete("/api/v1/orders/1"))
            .andExpect(status().isUnauthorized());
    }
    
    @Test
    @WithMockUser(username = "user1")
    void cancelOrder_noCsrfToken_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/orders/1"))
            .andExpect(status().isForbidden());
    }
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void cancelOrder_adminRole_canCancelAnyOrder() throws Exception {
        mockMvc.perform(delete("/api/v1/orders/1")
                .with(csrf()))
            .andExpect(status().isNoContent());
    }
    
    // Injection tests
    @Test
    @WithMockUser
    void createOrder_sqlInjectionInNotes_rejected() throws Exception {
        String maliciousPayload = """
            {
                "customerId": 1,
                "items": [{"itemId": 1, "quantity": 1}],
                "notes": "'; DROP TABLE orders; --"
            }
            """;
        
        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(maliciousPayload)
                .with(csrf()))
            .andExpect(status().isBadRequest());
    }
    
    @Test
    @WithMockUser
    void createOrder_xssInNotes_rejected() throws Exception {
        String maliciousPayload = """
            {
                "customerId": 1,
                "items": [{"itemId": 1, "quantity": 1}],
                "notes": "<script>alert('xss')</script>"
            }
            """;
        
        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(maliciousPayload)
                .with(csrf()))
            .andExpect(status().isBadRequest());
    }
}
```

---

### Day 9: Integration + Contract Tests

#### Focus
- Security integration tests
- Contract compliance
- End-to-end security flows
- Performance verification

#### FE Tasks (Day 9)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| FE-322 | E2E security tests | 4 | FE Dev |
| FE-323 | Auth flow E2E | 2 | FE Dev |
| FE-324 | Error boundary tests | 2 | FE Dev |

#### BE Tasks (Day 9)

| ID | Task | Hours | Owner |
|----|------|-------|-------|
| BE-322 | Integration security tests | 4 | BE Dev |
| BE-323 | Contract security validation | 2 | BE Dev |
| BE-324 | Audit log verification | 2 | BE Dev |

#### Playwright Security Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  
  test('unauthenticated user cannot access orders', async ({ page }) => {
    // Clear any existing auth
    await page.context().clearCookies();
    
    // Try to access protected route
    await page.goto('/orders');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
  
  test('authenticated user can only see own orders', async ({ page }) => {
    await loginAs(page, 'user1');
    
    await page.goto('/orders');
    
    // Verify no other user's orders visible
    const orders = await page.locator('[data-testid="order-row"]').all();
    for (const order of orders) {
      const owner = await order.getAttribute('data-owner');
      expect(owner).toBe('user1');
    }
  });
  
  test('CSRF token required for mutations', async ({ page, request }) => {
    await loginAs(page, 'user1');
    
    // Attempt POST without CSRF token
    const response = await request.post('/api/v1/orders', {
      data: { customerId: 1, items: [] },
      headers: {
        // Deliberately omit CSRF token
        'Content-Type': 'application/json',
      },
    });
    
    expect(response.status()).toBe(403);
  });
  
  test('XSS content is escaped in display', async ({ page }) => {
    await loginAs(page, 'admin');
    
    // Create order with XSS attempt in notes (via API that might have bypassed validation)
    const maliciousNote = '<img src=x onerror=alert("xss")>';
    
    // Navigate to order with malicious content
    await page.goto('/orders/test-xss-order');
    
    // Verify content is escaped, not executed
    const notesElement = page.locator('[data-testid="order-notes"]');
    await expect(notesElement).toContainText(maliciousNote);
    
    // Verify no alert was triggered
    let alertTriggered = false;
    page.on('dialog', () => { alertTriggered = true; });
    await page.waitForTimeout(1000);
    expect(alertTriggered).toBe(false);
  });
});

async function loginAs(page, username: string) {
  await page.goto('/login');
  await page.fill('[data-testid="username"]', username);
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/orders');
}
```

---

### Day 10: Security Review + Demo

#### Focus
- Security review presentation
- Vulnerability summary
- Demo to stakeholders
- Sprint retrospective

#### Morning: Security Review (2 hours)

**Attendees:** All developers, Security Lead, Tech Leads

| Time | Activity | Output |
|------|----------|--------|
| 0:00-0:30 | OWASP Top 10 status review | Checklist verified |
| 0:30-1:00 | Vulnerability scan results | Issues documented |
| 1:00-1:30 | Audit log review | Compliance verified |
| 1:30-2:00 | Remediation planning | Actions assigned |

#### Afternoon: Sprint Demo (1.5 hours)

**Attendees:** All stakeholders, Security Lead

#### Demo Agenda

| Time | Topic | Presenter |
|------|-------|-----------|
| 0:00-0:10 | Sprint overview + goals | Lead |
| 0:10-0:25 | Authentication flow | BE Dev |
| 0:25-0:40 | Authorization demo | BE Dev |
| 0:40-0:55 | Input validation demo | Both |
| 0:55-1:10 | Audit logging demo | BE Dev |
| 1:10-1:20 | Security metrics | Security Lead |
| 1:20-1:30 | Q&A | All |

#### Security Metrics to Present

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Critical vulnerabilities | 0 | | |
| High vulnerabilities | 0 | | |
| Medium vulnerabilities | ≤5 | | |
| Test coverage (security) | ≥80% | | |
| OWASP Top 10 addressed | 10/10 | | |
| Audit events logged | 100% | | |

---

## Sprint Retrospective (1 hour)

### Retro Agenda

| Time | Activity |
|------|----------|
| 0:00-0:10 | Data gathering |
| 0:10-0:30 | Security-specific discussion |
| 0:30-0:50 | Process improvement |
| 0:50-1:00 | Action items |

### Security-Specific Retro Questions

1. **What security vulnerabilities did we catch early?**
2. **What vulnerabilities almost slipped through?**
3. **How effective was Copilot for security tasks?**
4. **What security patterns should we standardize?**
5. **What security tooling gaps do we have?**
6. **Did audit logging cover all required events?**
7. **Were edge cases adequately tested?**
8. **What would help us be more secure in Sprint 4?**

### Sprint 3 → Sprint 4 Handover

| Sprint 3 Deliverable | Sprint 4 Usage |
|---------------------|----------------|
| Security configuration | Performance testing baseline |
| Audit logging | Monitoring integration |
| Input validation | Production hardening |
| Edge case handling | Resilience testing |
| Security tests | Regression suite |

---

## Definition of Done

### Feature-Level DoD

For each user story to be "done":

- [ ] Code complete and passing lint
- [ ] Security review completed
- [ ] Unit tests passing (≥80% coverage)
- [ ] Authorization tests added
- [ ] Input validation comprehensive
- [ ] Audit events logged
- [ ] PR reviewed by security-aware developer
- [ ] No critical/high vulnerabilities
- [ ] Documentation updated

### Sprint-Level DoD

For the sprint to be "done":

- [ ] All user stories meet feature DoD
- [ ] OWASP Top 10 addressed
- [ ] Security scan clean (0 critical/high)
- [ ] Penetration test baseline complete
- [ ] Audit logging verified
- [ ] Edge cases tested
- [ ] Integration tests passing
- [ ] E2E security tests passing
- [ ] Sprint demo completed
- [ ] Sprint retro documented

---

## Copilot Usage Summary for Sprint 3

### Recommended Prompts

| Prompt | Use Case | Frequency |
|--------|----------|-----------|
| P18 | Security Review | Daily |
| P3-AUTH | Authentication hardening | Day 2 |
| P3-AUTHZ | Authorization patterns | Day 3 |
| P3-VALID | Input validation | Day 4 |
| P3-AUDIT | Audit logging | Day 6 |
| P4 | Guarded refactor for security fixes | As needed |
| P20 | Gate readiness check | Day 10 |

### Security-Specific Prompts

```markdown
## P3-AUTHZ — Authorization Verification

No secrets, no production data. Use placeholders.

Review authorization for this endpoint:

#file <controller-path>

Verify:
1. @PreAuthorize annotation present
2. Role requirements appropriate
3. Resource ownership checked
4. Edge cases handled (null user, missing roles)

Generate tests for:
- Authorized user (owner)
- Unauthorized user (not owner)
- Admin override
- Missing authentication
- Invalid token

Follow security patterns in @workspace
```

```markdown
## P3-AUDIT — Audit Event Coverage

No secrets, no production data. Use placeholders.

Review audit logging for compliance:

@workspace Find all mutation endpoints (POST, PUT, DELETE)

For each endpoint, verify:
1. @Auditable annotation present
2. Action name is descriptive
3. User identity captured
4. Resource identifier logged
5. Outcome recorded (success/failure)
6. Timestamp included
7. IP address captured

Generate report of:
- Endpoints with audit logging ✅
- Endpoints missing audit logging ❌
- Recommended actions
```

### Agents Mode Usage

| Task | Agents Suitability | Notes |
|------|-------------------|-------|
| Add @PreAuthorize to all endpoints | ✅ Excellent | Multi-file pattern application |
| Add @Auditable to mutations | ✅ Excellent | Consistent annotation |
| Add validation annotations | ✅ Good | Follow existing patterns |
| Security test generation | ✅ Good | Pattern-based |
| Custom security logic | ⚠️ Careful | Requires human review |

---

## Key References

| Resource | Location | Purpose |
|----------|----------|---------|
| Sprint 3 Packet | [sprint-packet/SPRINT_PACKET.md](sprint-packet/SPRINT_PACKET.md) | Approved scope |
| Security Checklist | [sprint-packet/SECURITY_CHECKLIST.md](sprint-packet/SECURITY_CHECKLIST.md) | OWASP verification |
| FE Tasks | [sprint-packet/FE_TASKS.md](sprint-packet/FE_TASKS.md) | Frontend breakdown |
| BE Tasks | [sprint-packet/BE_TASKS.md](sprint-packet/BE_TASKS.md) | Backend breakdown |
| Sprint 2 Patterns | [../sprint-02/](../sprint-02/) | Previous sprint reference |
| Security ADR | [../week-03/adrs/001-authentication.md](../week-03/adrs/001-authentication.md) | Auth decisions |
| Prompt Pack | [../../shared/reference-materials/PROMPT_PACK_V1.md](../../shared/reference-materials/PROMPT_PACK_V1.md) | P18 Security Review |

---

## Return to [Sprint 3 README](README.md)
