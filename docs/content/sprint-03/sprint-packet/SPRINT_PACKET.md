# Sprint 3 — Sprint Packet

> **This is a MANDATORY document. No Sprint Packet = No Build.**

**Sprint:** 3 — Harden + Security  
**Duration:** Weeks 9-10  
**Status:** ✅ Approved

---

## Approval Sign-Off

### Pre-Sprint Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | _________________ | ____/____/____ | ☐ Approved |
| Tech Lead (FE) | _________________ | ____/____/____ | ☐ Approved |
| Tech Lead (BE) | _________________ | ____/____/____ | ☐ Approved |
| Security Lead | _________________ | ____/____/____ | ☐ Approved |
| Bootcamp Lead | _________________ | ____/____/____ | ☐ Approved |

**All signatures required before sprint work begins.**

---

## Sprint Goal Statement

> **Harden the application against security threats, handle all edge cases robustly, and establish comprehensive audit logging for compliance.**

### Success Metrics

| Metric | Target | Verification |
|--------|--------|--------------|
| Critical/High vulnerabilities | 0 | OWASP scan |
| OWASP Top 10 addressed | 10/10 | Security checklist |
| Security test coverage | ≥80% | Coverage report |
| Audit event coverage | 100% of mutations | Log review |
| Edge case test coverage | All identified | Test suite |

---

## Definition of Done

### Feature-Level

- [ ] Code complete and lint-free
- [ ] Security review completed (peer or lead)
- [ ] Unit tests passing with ≥80% coverage
- [ ] Authorization tests added for protected resources
- [ ] Input validation comprehensive (server + client)
- [ ] Audit events logged for all mutations
- [ ] No critical/high vulnerabilities in scan
- [ ] Documentation updated
- [ ] PR approved by security-aware reviewer

### Sprint-Level

- [ ] All user stories meet feature DoD
- [ ] OWASP Top 10 checklist complete
- [ ] Security scan clean (0 critical/high)
- [ ] Penetration test baseline passed
- [ ] Audit logging verified for compliance
- [ ] Edge cases tested and passing
- [ ] Integration tests passing
- [ ] E2E security tests passing
- [ ] Sprint demo completed
- [ ] Sprint retrospective documented

---

## In-Scope User Stories

### US-008: Secure Authentication Flow

**As a** system administrator  
**I want** all authentication to be secure and audited  
**So that** unauthorized access is prevented and tracked

**Story Points:** 5

**Acceptance Criteria:**
- Token validation on every request
- Expired tokens rejected with 401
- Invalid tokens rejected with 401
- Token refresh working correctly
- Logout clears all session data
- All auth events logged

---

### US-009: Authorization Verification

**As a** security auditor  
**I want** all resources protected by authorization rules  
**So that** users can only access their own data

**Story Points:** 8

**Acceptance Criteria:**
- All endpoints have authorization rules
- Users can only access own orders
- Users can only cancel own orders (cancellable status)
- Admin can access all orders
- 403 returned for unauthorized access
- All authorization failures logged

---

### US-010: Input Validation Complete

**As a** security engineer  
**I want** all inputs validated and sanitized  
**So that** injection attacks are prevented

**Story Points:** 5

**Acceptance Criteria:**
- All DTOs have validation annotations
- SQL injection attempts rejected
- XSS attempts rejected
- Command injection prevented
- Error messages don't expose internals
- Validation failures logged

---

### US-011: Comprehensive Audit Logging

**As a** compliance officer  
**I want** all security-relevant actions logged  
**So that** we have an audit trail for investigations

**Story Points:** 5

**Acceptance Criteria:**
- All mutations logged (create, update, delete)
- User identity captured in every log
- Timestamp with timezone in every log
- IP address captured for security events
- Sensitive data masked in logs
- Log format structured (JSON)
- Failed authorization attempts logged

---

## Technical Tasks

### Frontend Tasks (FE-301 to FE-324)

| ID | Task | Story | Hours | Day |
|----|------|-------|-------|-----|
| FE-301 | Auth token refresh mechanism | US-008 | 3 | 2 |
| FE-302 | Secure token storage | US-008 | 2 | 2 |
| FE-303 | Logout + session clear | US-008 | 2 | 2 |
| FE-304 | Role-based UI rendering | US-009 | 3 | 3 |
| FE-305 | Protected route guards | US-009 | 2 | 3 |
| FE-306 | Permission error handling | US-009 | 2 | 3 |
| FE-307 | Input sanitization utilities | US-010 | 3 | 4 |
| FE-308 | Form validation hardening | US-010 | 3 | 4 |
| FE-309 | CSP header configuration | US-010 | 1 | 4 |
| FE-310 | CSRF token handling | Security | 3 | 5 |
| FE-311 | Secure cookie settings | Security | 2 | 5 |
| FE-312 | Security header verification | Security | 2 | 5 |
| FE-313 | Client-side error logging | US-011 | 3 | 6 |
| FE-314 | User action tracking | US-011 | 2 | 6 |
| FE-315 | PII masking in logs | US-011 | 2 | 6 |
| FE-316 | Optimistic locking UI | Edge Cases | 3 | 7 |
| FE-317 | Conflict resolution dialog | Edge Cases | 2 | 7 |
| FE-318 | Timeout handling | Edge Cases | 2 | 7 |
| FE-319 | Security test suite | Testing | 4 | 8 |
| FE-320 | XSS test cases | Testing | 2 | 8 |
| FE-321 | Auth flow tests | Testing | 2 | 8 |
| FE-322 | E2E security tests | Testing | 4 | 9 |
| FE-323 | Auth flow E2E | Testing | 2 | 9 |
| FE-324 | Error boundary tests | Testing | 2 | 9 |

**Total FE Hours:** ~56 hours

### Backend Tasks (BE-301 to BE-324)

| ID | Task | Story | Hours | Day |
|----|------|-------|-------|-----|
| BE-301 | Token validation interceptor | US-008 | 3 | 2 |
| BE-302 | Session management | US-008 | 2 | 2 |
| BE-303 | Token revocation endpoint | US-008 | 2 | 2 |
| BE-304 | @PreAuthorize on all endpoints | US-009 | 4 | 3 |
| BE-305 | Resource ownership validation | US-009 | 3 | 3 |
| BE-306 | 403 Forbidden handling | US-009 | 1 | 3 |
| BE-307 | Input validation annotations | US-010 | 3 | 4 |
| BE-308 | Custom validators for complex rules | US-010 | 3 | 4 |
| BE-309 | SQL injection verification | US-010 | 1 | 4 |
| BE-310 | CSRF configuration | Security | 2 | 5 |
| BE-311 | Security headers filter | Security | 3 | 5 |
| BE-312 | CORS configuration hardening | Security | 2 | 5 |
| BE-313 | Audit event expansion | US-011 | 3 | 6 |
| BE-314 | Sensitive data masking | US-011 | 2 | 6 |
| BE-315 | Security event logging | US-011 | 2 | 6 |
| BE-316 | @Version optimistic locking | Edge Cases | 2 | 7 |
| BE-317 | Conflict detection service | Edge Cases | 3 | 7 |
| BE-318 | Transaction isolation review | Edge Cases | 2 | 7 |
| BE-319 | Security test suite | Testing | 4 | 8 |
| BE-320 | Authorization tests | Testing | 2 | 8 |
| BE-321 | Injection test cases | Testing | 2 | 8 |
| BE-322 | Integration security tests | Testing | 4 | 9 |
| BE-323 | Contract security validation | Testing | 2 | 9 |
| BE-324 | Audit log verification | Testing | 2 | 9 |

**Total BE Hours:** ~56 hours

---

## Files/Paths In-Scope

### Frontend

```
src/
├── lib/
│   ├── auth/
│   │   ├── tokenManager.ts          # NEW: Token refresh, storage
│   │   ├── authContext.tsx          # MODIFY: Add secure storage
│   │   └── authGuard.tsx            # NEW: Route protection
│   ├── security/
│   │   ├── csrfToken.ts             # NEW: CSRF handling
│   │   ├── sanitize.ts              # NEW: Input sanitization
│   │   └── securityHeaders.ts       # NEW: Header verification
│   └── logging/
│       ├── auditLogger.ts           # NEW: Client-side audit
│       └── piiMasker.ts             # NEW: Sensitive data masking
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx       # NEW: Auth guard component
│   │   └── PermissionGate.tsx       # NEW: Role-based rendering
│   └── errors/
│       ├── PermissionError.tsx      # NEW: 403 handling
│       └── ConflictDialog.tsx       # NEW: Version conflict UI
├── routes/
│   └── (existing routes)            # MODIFY: Add auth guards
└── tests/
    └── security/
        ├── auth.test.ts             # NEW: Auth tests
        ├── authorization.test.ts     # NEW: Permission tests
        └── xss.test.ts              # NEW: XSS tests
```

### Backend

```
src/main/java/com/example/orders/
├── config/
│   ├── SecurityConfig.java          # MODIFY: Harden configuration
│   └── CorsConfig.java              # MODIFY: Restrict origins
├── security/
│   ├── JwtTokenValidator.java       # NEW: Token validation
│   ├── OrderSecurityService.java    # NEW: Resource ownership
│   ├── SecurityAuditAspect.java     # NEW: Audit logging aspect
│   └── Auditable.java               # NEW: Audit annotation
├── validation/
│   ├── SafeHtml.java                # NEW: XSS prevention
│   ├── SafeHtmlValidator.java       # NEW: Validator impl
│   └── ValidationConfig.java        # NEW: Custom validators
├── controller/
│   └── OrderController.java         # MODIFY: Add @PreAuthorize
├── service/
│   └── OrderService.java            # MODIFY: Add ownership checks
└── exception/
    ├── AccessDeniedException.java   # NEW: 403 exception
    └── ConflictException.java       # NEW: 409 exception
```

---

## Endpoints In-Scope

### Existing Endpoints (Security Hardening)

| Method | Path | Security Changes |
|--------|------|------------------|
| GET | `/api/v1/orders` | Add ownership filter |
| GET | `/api/v1/orders/{id}` | Add ownership check |
| POST | `/api/v1/orders` | Add validation, audit |
| DELETE | `/api/v1/orders/{id}` | Add ownership + status check |

### New Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/auth/refresh` | Token refresh |
| POST | `/api/v1/auth/logout` | Session invalidation |

---

## Out of Scope

The following are explicitly **NOT** in Sprint 3:

| Item | Reason | Deferred To |
|------|--------|-------------|
| Performance optimization | Sprint 4 focus | Sprint 4 |
| Accessibility improvements | Sprint 4 focus | Sprint 4 |
| New features | Security-only sprint | Future |
| Database schema changes | Stability | Future |
| UI redesign | Not security-related | Future |
| Third-party integrations | Risk | Future |
| Mobile support | Out of bootcamp scope | Post-bootcamp |

---

## Acceptance Criteria (Gherkin Format)

### AC-008: Secure Authentication

```gherkin
Feature: Secure Authentication Flow
  
  Scenario: Valid token grants access
    Given I have a valid JWT token
    When I make a request to a protected endpoint
    Then I receive a 200 OK response
    And my request is logged with my user ID

  Scenario: Expired token is rejected
    Given I have an expired JWT token
    When I make a request to a protected endpoint
    Then I receive a 401 Unauthorized response
    And the response includes error details
    And the failed auth attempt is logged

  Scenario: Invalid token is rejected
    Given I have a malformed JWT token
    When I make a request to a protected endpoint
    Then I receive a 401 Unauthorized response
    And the security event is logged

  Scenario: Token refresh works
    Given I have a valid refresh token
    When I request a new access token
    Then I receive a new valid access token
    And the refresh is logged

  Scenario: Logout clears session
    Given I am authenticated
    When I logout
    Then my tokens are invalidated
    And subsequent requests with old tokens fail
    And the logout is logged
```

### AC-009: Authorization Verification

```gherkin
Feature: Authorization Rules
  
  Scenario: User can view own orders
    Given I am authenticated as "user1"
    When I request my order list
    Then I only see orders created by "user1"

  Scenario: User cannot view other's order
    Given I am authenticated as "user1"
    And order "123" belongs to "user2"
    When I request order "123"
    Then I receive a 403 Forbidden response
    And the access attempt is logged

  Scenario: User can cancel own order
    Given I am authenticated as "user1"
    And order "456" belongs to "user1"
    And order "456" status is "pending"
    When I cancel order "456"
    Then the order is cancelled
    And the action is logged

  Scenario: User cannot cancel other's order
    Given I am authenticated as "user1"
    And order "789" belongs to "user2"
    When I try to cancel order "789"
    Then I receive a 403 Forbidden response
    And the failed cancellation attempt is logged

  Scenario: Admin can access any order
    Given I am authenticated as "admin"
    And order "123" belongs to "user1"
    When I request order "123"
    Then I receive the order details
    And the admin access is logged
```

### AC-010: Input Validation

```gherkin
Feature: Input Validation
  
  Scenario: Valid input is accepted
    Given I am creating an order
    When I submit valid order data
    Then the order is created
    And the creation is logged

  Scenario: SQL injection is prevented
    Given I am creating an order
    When I submit notes containing "'; DROP TABLE orders; --"
    Then I receive a 400 Bad Request response
    And the SQL injection attempt is logged as security event

  Scenario: XSS is prevented
    Given I am creating an order
    When I submit notes containing "<script>alert('xss')</script>"
    Then I receive a 400 Bad Request response
    And the XSS attempt is logged as security event

  Scenario: Validation errors are descriptive
    Given I am creating an order
    When I submit invalid data
    Then I receive a 400 Bad Request response
    And the response contains field-level errors
    And no internal system details are exposed
```

### AC-011: Audit Logging

```gherkin
Feature: Comprehensive Audit Logging
  
  Scenario: Successful mutation is logged
    Given I am authenticated as "user1"
    When I create an order
    Then an audit log entry is created with:
      | field      | value                |
      | action     | CREATE_ORDER         |
      | user       | user1                |
      | outcome    | SUCCESS              |
      | timestamp  | <current_time>       |
      | ip_address | <client_ip>          |

  Scenario: Failed authorization is logged
    Given I am authenticated as "user1"
    When I try to access "user2"'s order
    Then a security log entry is created with:
      | field      | value                |
      | action     | ACCESS_ORDER         |
      | user       | user1                |
      | outcome    | ACCESS_DENIED        |
      | resource   | order:123            |

  Scenario: Sensitive data is masked
    Given audit logging is enabled
    When a log entry contains email "john@example.com"
    Then the logged value is "j***@e***"

  Scenario: Log format is structured
    Given audit logging is enabled
    When any loggable event occurs
    Then the log is in JSON format
    And contains all required fields
```

---

## Technical Requirements

### Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | `default-src 'self'` | XSS prevention |
| X-Content-Type-Options | `nosniff` | MIME sniffing prevention |
| X-Frame-Options | `DENY` | Clickjacking prevention |
| Referrer-Policy | `strict-origin-when-cross-origin` | Referrer control |
| Permissions-Policy | `geolocation=(), microphone=()` | Feature control |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | HTTPS enforcement |

### CORS Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Allowed Origins | `https://app.example.com` | Production only |
| Allowed Methods | `GET, POST, PUT, DELETE, OPTIONS` | REST methods |
| Allowed Headers | `Authorization, Content-Type, X-CSRF-TOKEN` | Required headers |
| Allow Credentials | `true` | Cookie auth |
| Max Age | `3600` | Preflight cache |

### Audit Log Format

```json
{
  "timestamp": "2026-01-20T10:30:00.000Z",
  "level": "INFO",
  "logger": "AUDIT",
  "action": "CREATE_ORDER",
  "user": "jsmith",
  "resource": "order:12345",
  "outcome": "SUCCESS",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "requestId": "req-abc-123",
  "details": {
    "customerId": 42,
    "itemCount": 3,
    "totalAmount": "***MASKED***"
  }
}
```

---

## Dependencies

| Dependency | Type | Owner | Risk | Mitigation |
|------------|------|-------|------|------------|
| Security Lead availability | People | Management | Medium | Schedule in advance |
| OAuth provider (Entra ID) | External | Platform | Low | Sandbox environment |
| OWASP Dependency-Check | Tool | DevOps | Low | Pre-configured |
| Penetration test tools | Tool | Security | Medium | Use standard tools |

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Undiscovered vulnerabilities | Medium | High | Defense in depth, multiple scans |
| Performance impact from security | Low | Medium | Profile critical paths |
| Complex authorization rules | Medium | Medium | Start simple, iterate |
| Audit logging volume | Low | Low | Log aggregation, rotation |
| Token expiration edge cases | Medium | Low | Comprehensive testing |

---

## Post-Sprint Approval

### Sprint Completion Verification

| Criterion | Evidence | Verified |
|-----------|----------|----------|
| All stories complete | Board status | ☐ |
| OWASP Top 10 addressed | Security checklist | ☐ |
| Security scan clean | Scan report | ☐ |
| Audit logging verified | Log review | ☐ |
| Tests passing | CI pipeline | ☐ |
| Demo completed | Recording | ☐ |
| Retro documented | Notes | ☐ |

### Post-Sprint Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tech Lead (FE) | _________________ | ____/____/____ | ☐ Verified |
| Tech Lead (BE) | _________________ | ____/____/____ | ☐ Verified |
| Security Lead | _________________ | ____/____/____ | ☐ Verified |
| QA Lead | _________________ | ____/____/____ | ☐ Verified |

---

## Key References

| Resource | Location |
|----------|----------|
| Sprint 3 Program | [../SPRINT_3_PROGRAM.md](../SPRINT_3_PROGRAM.md) |
| Security Checklist | [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) |
| FE Tasks | [FE_TASKS.md](FE_TASKS.md) |
| BE Tasks | [BE_TASKS.md](BE_TASKS.md) |
| OpenAPI Contract | [../../week-04/contracts/openapi.yaml](../../week-04/contracts/openapi.yaml) |
| Authentication ADR | [../../week-03/adrs/001-authentication.md](../../week-03/adrs/001-authentication.md) |
| Sprint 2 Packet | [../../sprint-02/sprint-packet/SPRINT_PACKET.md](../../sprint-02/sprint-packet/SPRINT_PACKET.md) |

---

## Copilot Assistance

```
Sprint 3 focuses on security hardening:
- US-008: Authentication (tokens, sessions, logout)
- US-009: Authorization (ownership, roles, @PreAuthorize)
- US-010: Input Validation (injection prevention)
- US-011: Audit Logging (comprehensive trail)

Key prompts:
- P18: Security Review (OWASP Top 10)
- P3-AUTH: Authentication hardening
- P3-AUTHZ: Authorization verification
- P3-AUDIT: Audit logging coverage

Security targets:
- 0 critical/high vulnerabilities
- 10/10 OWASP Top 10 addressed
- 100% mutation audit coverage
- ≥80% security test coverage
```
