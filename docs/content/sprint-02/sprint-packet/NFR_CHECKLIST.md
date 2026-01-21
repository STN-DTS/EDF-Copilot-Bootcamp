# Sprint 2 NFR Checklist — Non-Functional Requirements

> **Purpose:** Track NFR implementation and verification for Sprint 2  
> **Target:** Establish baseline for all key NFR categories

---

## NFR Categories

| Category | Sprint 2 Target | Status |
|----------|-----------------|--------|
| Performance | Response times within SLA | ⬜ |
| Accessibility | WCAG 2.1 AA compliance | ⬜ |
| Security | Input validation, rate limiting | ⬜ |
| Auditability | All key events logged | ⬜ |
| Resilience | Graceful degradation | ⬜ |
| Observability | Metrics and tracing baseline | ⬜ |

---

## 1. Performance

### 1.1 API Response Times

| Endpoint | Target (p95) | Actual | Status |
|----------|--------------|--------|--------|
| GET /api/v1/orders | <500ms | | ⬜ |
| GET /api/v1/orders/{id} | <300ms | | ⬜ |
| POST /api/v1/orders | <500ms | | ⬜ |
| DELETE /api/v1/orders/{id} | <300ms | | ⬜ |
| GET /api/v1/orders (filtered) | <500ms | | ⬜ |

### 1.2 Frontend Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Largest Contentful Paint (LCP) | <2.5s | | ⬜ |
| First Input Delay (FID) | <100ms | | ⬜ |
| Cumulative Layout Shift (CLS) | <0.1 | | ⬜ |
| Time to Interactive (TTI) | <3s | | ⬜ |
| First Contentful Paint (FCP) | <1.5s | | ⬜ |

### 1.3 Database Performance

| Check | Target | Actual | Status |
|-------|--------|--------|--------|
| Slow query threshold | <100ms | | ⬜ |
| Index coverage for filters | All filter columns indexed | | ⬜ |
| N+1 query prevention | EntityGraph/fetch joins used | | ⬜ |
| Connection pool sizing | Appropriate for load | | ⬜ |

### Verification Commands

```bash
# Backend performance test (with JMeter or similar)
jmeter -n -t performance-test.jmx -l results.jtl

# Lighthouse audit for frontend
npx lighthouse http://localhost:3000/orders --output=json --output-path=./lighthouse-report.json

# Database query analysis (Oracle)
EXPLAIN PLAN FOR SELECT * FROM orders WHERE user_id = :userId AND status = :status;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

---

## 2. Accessibility (WCAG 2.1 AA)

### 2.1 Perceivable

| Criterion | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| 1.1.1 Non-text Content | All images have alt text | ⬜ | |
| 1.3.1 Info and Relationships | Semantic HTML used | ⬜ | |
| 1.3.2 Meaningful Sequence | DOM order matches visual | ⬜ | |
| 1.4.1 Use of Color | Color not sole indicator | ⬜ | |
| 1.4.3 Contrast (Minimum) | 4.5:1 for text | ⬜ | |
| 1.4.4 Resize Text | Works at 200% zoom | ⬜ | |

### 2.2 Operable

| Criterion | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| 2.1.1 Keyboard | All functions keyboard accessible | ⬜ | |
| 2.1.2 No Keyboard Trap | Focus can always escape | ⬜ | |
| 2.4.1 Bypass Blocks | Skip links provided | ⬜ | |
| 2.4.3 Focus Order | Logical focus sequence | ⬜ | |
| 2.4.4 Link Purpose | Links have clear purpose | ⬜ | |
| 2.4.6 Headings and Labels | Descriptive headings | ⬜ | |
| 2.4.7 Focus Visible | Clear focus indicator | ⬜ | |

### 2.3 Understandable

| Criterion | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| 3.1.1 Language of Page | html lang attribute set | ⬜ | |
| 3.2.1 On Focus | No context change on focus | ⬜ | |
| 3.2.2 On Input | No unexpected changes | ⬜ | |
| 3.3.1 Error Identification | Errors clearly identified | ⬜ | |
| 3.3.2 Labels or Instructions | Form fields have labels | ⬜ | |
| 3.3.3 Error Suggestion | Helpful error messages | ⬜ | |

### 2.4 Robust

| Criterion | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| 4.1.1 Parsing | Valid HTML | ⬜ | |
| 4.1.2 Name, Role, Value | ARIA used correctly | ⬜ | |

### 2.5 Component Checklist

| Component | Labels | Focus | Keyboard | Contrast | ARIA | Status |
|-----------|--------|-------|----------|----------|------|--------|
| CreateOrderForm | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| CancelOrderDialog | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| OrderFilters | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| EmptyState | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ErrorState | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| LoadingState | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

### Verification Commands

```bash
# Automated accessibility testing
npx axe-core http://localhost:3000/orders
npx axe-core http://localhost:3000/orders/new

# Pa11y testing
npx pa11y http://localhost:3000/orders --standard WCAG2AA

# Lighthouse accessibility audit
npx lighthouse http://localhost:3000/orders --only-categories=accessibility
```

---

## 3. Security

### 3.1 Input Validation

| Check | Backend | Frontend | Status |
|-------|---------|----------|--------|
| Required fields validated | ⬜ | ⬜ | ⬜ |
| String length limits | ⬜ | ⬜ | ⬜ |
| Format validation (email, phone, postal) | ⬜ | ⬜ | ⬜ |
| Numeric range validation | ⬜ | ⬜ | ⬜ |
| Date validation | ⬜ | ⬜ | ⬜ |
| No SQL injection | ⬜ | N/A | ⬜ |
| No XSS in outputs | ⬜ | ⬜ | ⬜ |

### 3.2 Authorization

| Check | Requirement | Status |
|-------|-------------|--------|
| Users can only access own orders | Verified | ⬜ |
| Users can only create orders for own customers | Verified | ⬜ |
| Users can only cancel own orders | Verified | ⬜ |
| Invalid token returns 401 | Verified | ⬜ |
| Access denied returns 403 | Verified | ⬜ |

### 3.3 Rate Limiting

| Check | Requirement | Status |
|-------|-------------|--------|
| Mutation endpoints rate limited | 100/min per user | ⬜ |
| 429 response includes Retry-After | Header present | ⬜ |
| Rate limit violations logged | WARN level | ⬜ |

### 3.4 Security Headers

| Header | Expected Value | Status |
|--------|----------------|--------|
| Content-Security-Policy | Appropriate for app | ⬜ |
| X-Content-Type-Options | nosniff | ⬜ |
| X-Frame-Options | DENY or SAMEORIGIN | ⬜ |
| Strict-Transport-Security | max-age=31536000 | ⬜ |

### Verification Commands

```bash
# OWASP ZAP scan
zap-cli quick-scan --spider -r http://localhost:8080/api/v1/orders

# Security headers check
curl -I http://localhost:8080/api/v1/orders | grep -E "(Content-Security|X-Content-Type|X-Frame|Strict-Transport)"

# Dependency vulnerability scan
mvn org.owasp:dependency-check-maven:check
npm audit
```

---

## 4. Auditability

### 4.1 Audit Events

| Event | Fields | Log Level | Status |
|-------|--------|-----------|--------|
| ORDER_CREATED | orderId, userId, customerId, total, itemCount, timestamp | INFO | ⬜ |
| ORDER_CANCELLED | orderId, userId, previousStatus, timestamp | INFO | ⬜ |
| VALIDATION_FAILED | userId, operation, errors, timestamp | WARN | ⬜ |
| RATE_LIMIT_EXCEEDED | userId, endpoint, timestamp | WARN | ⬜ |
| AUTH_FAILED | userId, reason, timestamp | WARN | ⬜ |

### 4.2 Structured Logging

| Check | Requirement | Status |
|-------|-------------|--------|
| JSON log format | Configured | ⬜ |
| Correlation ID in all logs | MDC configured | ⬜ |
| No PII in logs | Verified | ⬜ |
| Log levels appropriate | DEBUG/INFO/WARN/ERROR | ⬜ |

### 4.3 Log Sample Verification

```json
// Expected log format
{
  "timestamp": "2026-01-20T10:30:00.000Z",
  "level": "INFO",
  "logger": "AUDIT",
  "message": "ORDER_CREATED",
  "correlationId": "abc-123",
  "orderId": "order-456",
  "userId": "user-789",
  "customerId": "cust-012",
  "total": "54.00",
  "itemCount": 2
}
```

### Verification Commands

```bash
# Check log output format
tail -f /var/log/app/application.log | jq '.'

# Verify correlation ID propagation
grep "correlationId" /var/log/app/application.log | head -20

# Check for PII leakage
grep -E "(password|ssn|credit)" /var/log/app/application.log
# Should return empty
```

---

## 5. Resilience

### 5.1 Error Handling

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| Database unavailable | 503 + graceful message | ⬜ |
| External service timeout | Timeout + fallback | ⬜ |
| Invalid JSON request | 400 + Problem Details | ⬜ |
| Validation errors | 400/422 + field errors | ⬜ |
| Not found | 404 + Problem Details | ⬜ |
| Conflict | 409 + Problem Details | ⬜ |
| Server error | 500 + Problem Details | ⬜ |

### 5.2 Frontend Resilience

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| API unavailable | Error state with retry | ⬜ |
| Slow response | Loading state shown | ⬜ |
| Empty data | Empty state shown | ⬜ |
| Partial failure | Graceful degradation | ⬜ |
| Network error | User-friendly message | ⬜ |

### 5.3 Timeout Configuration

| Component | Timeout | Status |
|-----------|---------|--------|
| HTTP client (FE) | 30 seconds | ⬜ |
| Database connection | 5 seconds | ⬜ |
| Database query | 30 seconds | ⬜ |
| External API calls | 10 seconds | ⬜ |

### Verification Commands

```bash
# Simulate database failure
docker stop oracle-db
# Verify 503 response
curl http://localhost:8080/api/v1/orders
# Restart
docker start oracle-db

# Simulate slow response
# (Use network throttling or mock delay)
```

---

## 6. Observability

### 6.1 Health Endpoints

| Endpoint | Purpose | Status |
|----------|---------|--------|
| GET /actuator/health | Overall health | ⬜ |
| GET /actuator/health/liveness | Kubernetes liveness | ⬜ |
| GET /actuator/health/readiness | Kubernetes readiness | ⬜ |

### 6.2 Metrics

| Metric | Type | Status |
|--------|------|--------|
| http_server_requests_seconds | Timer | ⬜ |
| orders_created_total | Counter | ⬜ |
| orders_cancelled_total | Counter | ⬜ |
| db_connection_pool_size | Gauge | ⬜ |
| rate_limit_exceeded_total | Counter | ⬜ |

### Verification Commands

```bash
# Health check
curl http://localhost:8080/actuator/health

# Metrics endpoint
curl http://localhost:8080/actuator/prometheus | grep orders_

# Check liveness/readiness
curl http://localhost:8080/actuator/health/liveness
curl http://localhost:8080/actuator/health/readiness
```

---

## Summary Checklist

### Pre-Demo Verification

- [ ] All API endpoints respond within target latency
- [ ] Lighthouse accessibility score ≥90
- [ ] No critical/high security findings
- [ ] All audit events logging correctly
- [ ] Error states handled gracefully
- [ ] Health endpoints responding

### Sign-Off

| Category | Verified By | Date | Status |
|----------|-------------|------|--------|
| Performance | | | ⬜ |
| Accessibility | | | ⬜ |
| Security | | | ⬜ |
| Auditability | | | ⬜ |
| Resilience | | | ⬜ |
| Observability | | | ⬜ |

---

## Copilot Context

```
NFR Checklist for Sprint 2:
- Performance: API <500ms p95, LCP <2.5s
- Accessibility: WCAG 2.1 AA compliance
- Security: Input validation, rate limiting, authorization
- Auditability: Structured logging, correlation IDs
- Resilience: Graceful error handling, timeouts
- Observability: Health endpoints, metrics

Use this checklist during Sprint 2 to track NFR implementation.
All categories must be verified before Sprint 2 demo.
```
