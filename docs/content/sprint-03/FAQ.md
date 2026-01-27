# Sprint 3 FAQ

> Common questions for Sprint 3: Harden + Security (Weeks 9-10)

---

## Security Hardening Questions

### What does "security hardening" mean?

**Definition:** Security hardening is the process of reducing attack surface and strengthening defenses. It's about making the system resistant to common attacks and compliant with security standards.

**Sprint 3 Hardening Areas:**

| Area | What It Means | Example |
|------|---------------|---------|
| Authentication | Verify users are who they claim | Token validation, session management |
| Authorization | Verify users can do what they're trying | Role checks, resource ownership |
| Input Validation | Reject malicious input | Sanitization, length limits |
| Output Encoding | Prevent injection in responses | XSS prevention, proper escaping |
| Audit Logging | Record who did what when | Mutation logging, access logs |

---

### How do I know if my app is secure enough?

**Security Verification Checklist:**

| Check | Tool/Method | Pass Criteria |
|-------|-------------|---------------|
| OWASP Top 10 | Manual review + SAST | No high/critical issues |
| Dependency scan | OWASP Dependency-Check | No known vulnerabilities |
| SQL injection | SQLMap or manual | No injection possible |
| XSS | Manual + CSP | No script execution |
| Authentication | Penetration testing | Tokens validated, sessions secure |
| Authorization | Integration tests | Access denied for unauthorized |

**Minimum Security Bar:**
- [ ] All OWASP Top 10 addressed
- [ ] Dependency scan clean
- [ ] Security headers configured
- [ ] Audit logging complete
- [ ] Security tests passing

---

### What's the difference between authentication and authorization?

| Aspect | Authentication | Authorization |
|--------|----------------|---------------|
| Question | Who are you? | What can you do? |
| When | Login, token validation | Every protected action |
| How | OAuth/OIDC, JWT | Roles, permissions, ownership |
| Failure | 401 Unauthorized | 403 Forbidden |

**Example Flow:**
```
1. User logs in (authentication) → Gets JWT token
2. User requests GET /orders (authorization) → Can they list orders?
3. User requests DELETE /orders/123 (authorization) → Can they delete THIS order?
```

---

## Authentication Questions

### How do I validate JWT tokens properly?

**Backend Validation Steps:**

```java
@Component
public class JwtTokenValidator {
    
    public void validateToken(String token) {
        // 1. Check signature
        Jwt jwt = jwtDecoder.decode(token);
        
        // 2. Check expiration
        if (jwt.getExpiresAt().isBefore(Instant.now())) {
            throw new JwtException("Token expired");
        }
        
        // 3. Check issuer
        if (!EXPECTED_ISSUER.equals(jwt.getIssuer())) {
            throw new JwtException("Invalid issuer");
        }
        
        // 4. Check audience
        if (!jwt.getAudience().contains(EXPECTED_AUDIENCE)) {
            throw new JwtException("Invalid audience");
        }
    }
}
```

**Common Mistakes:**

| Mistake | Risk | Fix |
|---------|------|-----|
| Not checking expiration | Replay attacks | Validate `exp` claim |
| Not checking issuer | Token substitution | Validate `iss` claim |
| Trusting client-side claims | Privilege escalation | Validate all claims server-side |
| Storing token in localStorage | XSS token theft | Use HttpOnly cookies |

---

### How do I implement token refresh?

**Refresh Flow:**

```
1. Access token expires (short-lived, 15-60 min)
2. Client detects 401 response
3. Client sends refresh token to /auth/refresh
4. Server validates refresh token
5. Server issues new access token
6. Client retries original request
```

**Frontend Implementation:**
```typescript
// Axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        await refreshToken();
        return axios(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

---

### How do I handle logout securely?

**Secure Logout Checklist:**

- [ ] Clear client-side token/session
- [ ] Revoke refresh token server-side
- [ ] Invalidate session in session store
- [ ] Clear cookies (if used)
- [ ] Redirect to login page

**Backend Logout:**
```java
@PostMapping("/logout")
public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
    String tokenValue = token.replace("Bearer ", "");
    
    // Add to token blacklist or revocation list
    tokenRevocationService.revoke(tokenValue);
    
    // Clear any server-side session
    sessionService.invalidate(tokenValue);
    
    return ResponseEntity.noContent().build();
}
```

---

## Authorization Questions

### How do I implement @PreAuthorize?

**Spring Security Method Security:**

```java
@EnableMethodSecurity
@Configuration
public class SecurityConfig { }

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    // Role-based access
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) { ... }

    // Resource ownership
    @PreAuthorize("@orderSecurity.isOwner(#id, authentication)")
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable String id, @RequestBody OrderRequest request) { ... }
    
    // Permission-based
    @PreAuthorize("hasAuthority('orders:write')")
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) { ... }
}
```

**Custom Security Evaluator:**
```java
@Component("orderSecurity")
public class OrderSecurityEvaluator {
    
    @Autowired
    private OrderRepository orderRepository;
    
    public boolean isOwner(String orderId, Authentication auth) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return false;
        
        String userId = auth.getName();
        return order.getCreatedBy().equals(userId);
    }
}
```

---

### How do I prevent unauthorized access to resources?

**Resource-Level Authorization:**

| Check | Implementation | When |
|-------|----------------|------|
| Role check | `@PreAuthorize("hasRole('X')")` | Method entry |
| Ownership check | Custom evaluator | Before data access |
| Data filtering | Query modification | At repository level |
| Response filtering | DTO projection | Before response |

**Example: Ownership Check:**
```java
@Service
public class OrderService {
    
    public Order getOrder(String orderId, String requestingUserId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found"));
        
        // Ownership check
        if (!order.getCustomerId().equals(requestingUserId) && 
            !hasRole("ADMIN")) {
            throw new ForbiddenException("Not authorized to view this order");
        }
        
        return order;
    }
}
```

---

### What HTTP status codes for auth failures?

| Scenario | Status | Message |
|----------|--------|---------|
| No token provided | 401 | Authentication required |
| Invalid/expired token | 401 | Invalid authentication |
| Valid user, no permission | 403 | Forbidden |
| Resource not found (owned by other) | 404 | Not found (don't leak existence) |

**Best Practice:** Return 404 instead of 403 when exposing "forbidden" would reveal resource existence.

---

## Input Validation Questions

### What inputs should I validate?

**Validate EVERYTHING from external sources:**

| Input Source | Examples | Validation |
|--------------|----------|------------|
| Path parameters | `/orders/{id}` | Format, length |
| Query parameters | `?status=pending` | Enum, type, range |
| Request body | JSON payload | Schema, required fields |
| Headers | `Authorization`, custom | Format, presence |
| Cookies | Session cookies | Signature, expiry |
| File uploads | Documents, images | Type, size, content |

---

### How do I implement input validation in Spring Boot?

**Bean Validation (JSR-380):**

```java
public class CreateOrderRequest {
    
    @NotNull(message = "Customer ID is required")
    @Pattern(regexp = "^CUST-[0-9]{3}$", message = "Invalid customer ID format")
    private String customerId;
    
    @NotEmpty(message = "At least one item is required")
    @Size(max = 50, message = "Maximum 50 items per order")
    private List<@Valid OrderItemRequest> items;
    
    @SafeHtml(message = "Notes contain unsafe content")
    @Size(max = 500, message = "Notes too long")
    private String notes;
}

public class OrderItemRequest {
    
    @NotNull
    @Pattern(regexp = "^ITEM-[0-9]{4}$")
    private String itemId;
    
    @NotNull
    @Min(1)
    @Max(1000)
    private Integer quantity;
}
```

**Controller Validation:**
```java
@PostMapping
public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
    // If validation fails, Spring returns 400 automatically
    return ResponseEntity.ok(orderService.create(request));
}
```

**Custom Validator:**
```java
@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = SafeHtmlValidator.class)
public @interface SafeHtml {
    String message() default "Unsafe HTML content";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class SafeHtmlValidator implements ConstraintValidator<SafeHtml, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return true;
        return Jsoup.isValid(value, Safelist.none());
    }
}
```

---

### How do I prevent SQL injection?

**Prevention Strategies:**

| Approach | Protection Level | Example |
|----------|------------------|---------|
| JPA/Hibernate | ✅ High | Parameterized by default |
| Named parameters | ✅ High | `:param` in JPQL |
| Spring Data | ✅ High | Method query derivation |
| Native query + params | ✅ High | `@Query(nativeQuery=true)` with params |
| String concatenation | ❌ NONE | Never do this |

**Safe Examples:**
```java
// SAFE: JPA parameterized query
@Query("SELECT o FROM Order o WHERE o.customerId = :customerId")
List<Order> findByCustomerId(@Param("customerId") String customerId);

// SAFE: Spring Data derived query
List<Order> findByStatusAndCreatedAtAfter(OrderStatus status, LocalDateTime after);

// DANGEROUS: String concatenation - NEVER DO THIS
@Query("SELECT o FROM Order o WHERE o.customerId = '" + customerId + "'") // ❌ BAD
```

---

## Security Review Process

### What should a security review cover?

**Security Review Checklist:**

| Area | Review Focus | Evidence Required |
|------|--------------|-------------------|
| **Authentication** | Token handling, session management | Test results, code review |
| **Authorization** | Permission checks, ownership | Integration tests |
| **Input Validation** | All inputs validated | Unit tests, code review |
| **Output Encoding** | XSS prevention | Security scan results |
| **Dependencies** | No known vulnerabilities | OWASP Dependency-Check |
| **Configuration** | Headers, CORS, TLS | Security headers scan |
| **Logging** | Audit events, no secrets | Log sample review |
| **Error Handling** | No info leakage | Manual testing |

---

### How do I conduct a security code review?

**Security Code Review Checklist:**

```markdown
## Authentication
- [ ] Tokens validated on every request
- [ ] Token expiry enforced
- [ ] Refresh tokens handled securely
- [ ] Logout invalidates tokens

## Authorization
- [ ] @PreAuthorize on all protected endpoints
- [ ] Resource ownership verified
- [ ] No horizontal privilege escalation
- [ ] No vertical privilege escalation

## Input Validation
- [ ] All user input validated
- [ ] Validation at API boundary
- [ ] Custom validators for complex rules
- [ ] File upload validation (if applicable)

## Injection Prevention
- [ ] No string concatenation in queries
- [ ] Parameterized queries everywhere
- [ ] Command injection prevented
- [ ] XSS output encoding

## Sensitive Data
- [ ] No secrets in code
- [ ] PII masked in logs
- [ ] Sensitive data encrypted at rest
- [ ] Secure transmission (TLS)

## Error Handling
- [ ] No stack traces in responses
- [ ] Generic error messages to client
- [ ] Detailed logging server-side
```

---

## OWASP Top 10 Questions

### How do I address each OWASP Top 10?

| # | Vulnerability | Sprint 3 Action |
|---|---------------|-----------------|
| A01 | Broken Access Control | @PreAuthorize, ownership checks |
| A02 | Cryptographic Failures | TLS required, passwords hashed |
| A03 | Injection | Parameterized queries, input validation |
| A04 | Insecure Design | Threat modeling, abuse cases |
| A05 | Security Misconfiguration | Security headers, CORS config |
| A06 | Vulnerable Components | Dependency scan, updates |
| A07 | Auth Failures | Token validation, session security |
| A08 | Data Integrity Failures | Signature verification |
| A09 | Logging Failures | Comprehensive audit logging |
| A10 | SSRF | URL validation, allowlisting |

---

## Security Testing Questions

### What security tests should I write?

**Security Test Categories:**

| Test Type | Example | Tool |
|-----------|---------|------|
| Authentication | Invalid token rejected | JUnit + MockMvc |
| Authorization | Non-owner denied access | Integration test |
| Input validation | Malformed input rejected | Unit test |
| Injection | SQL injection prevented | SQLMap or manual |
| XSS | Script tags escaped | Security scan |

**Example Security Test:**
```java
@Test
void shouldRejectExpiredToken() throws Exception {
    String expiredToken = createExpiredToken("testuser");
    
    mockMvc.perform(get("/api/v1/orders")
            .header("Authorization", "Bearer " + expiredToken))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.type").value("authentication-error"))
        .andExpect(jsonPath("$.title").value("Authentication Failed"));
}

@Test
void shouldDenyAccessToOtherUsersOrder() throws Exception {
    String otherUserOrderId = "ORD-OTHER-001";
    String myToken = createToken("testuser");
    
    mockMvc.perform(get("/api/v1/orders/" + otherUserOrderId)
            .header("Authorization", "Bearer " + myToken))
        .andExpect(status().isNotFound()); // 404, not 403, to avoid leaking info
}
```

---

## Common Sprint 3 Issues

### "My security tests are flaky"

**Common Causes:**

| Cause | Solution |
|-------|----------|
| Token timing | Use fixed clocks in tests |
| Race conditions | Synchronize test setup |
| External dependencies | Mock external auth services |
| State pollution | Clean up between tests |

---

### "I'm getting 401s unexpectedly"

**Debug Checklist:**
1. Is the token present in the header?
2. Is the token format correct (`Bearer <token>`)?
3. Is the token expired?
4. Is the issuer/audience correct?
5. Is the signing key correct?
6. Is Spring Security configured correctly?

---

### "Authorization rules are getting complex"

**Simplification Strategies:**
1. Use role hierarchy (`ADMIN` > `MANAGER` > `USER`)
2. Create custom SpEL expressions
3. Document permission matrix
4. Consider permission-based over role-based

---

## Related Resources

| Resource | Location |
|----------|----------|
| Sprint 3 Program | [SPRINT_3_PROGRAM.md](SPRINT_3_PROGRAM.md) |
| Security Checklist | [sprint-packet/SECURITY_CHECKLIST.md](sprint-packet/SECURITY_CHECKLIST.md) |
| Sprint 2 FAQ | [../sprint-02/FAQ.md](../sprint-02/FAQ.md) |
| Week 1 FAQ | [../week-01/FAQ.md](../week-01/FAQ.md) |
| Backend Instructions | [../../../.github/instructions/backend.instructions.md](../../../.github/instructions/backend.instructions.md) |
| OWASP Top 10 | https://owasp.org/Top10/ |

---

## Need More Help?

- **Security architecture:** Ask your Tech Lead or Security Lead
- **Specific vulnerabilities:** Reference OWASP documentation
- **Tool configuration:** Check tool-specific documentation
- **Compliance questions:** Escalate to project sponsor
