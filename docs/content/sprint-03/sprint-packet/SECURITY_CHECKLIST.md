# Sprint 3 — Security Checklist

> **OWASP Top 10 Verification Checklist**

This checklist must be completed before Sprint 3 Demo. All items require evidence and sign-off.

---

## Approval Status

| Role | Name | Date | Status |
|------|------|------|--------|
| Security Lead | | | ⬜ Pending |
| Tech Lead | | | ⬜ Pending |
| Product Owner | | | ⬜ Pending |

---

## OWASP Top 10 Coverage

### A01:2021 — Broken Access Control

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A01-01 | All endpoints have @PreAuthorize | BE | ⬜ | grep output |
| A01-02 | Resource ownership validated | BE | ⬜ | Unit tests |
| A01-03 | CORS properly configured | BE | ⬜ | Config review |
| A01-04 | Directory traversal prevented | BE | ⬜ | Integration test |
| A01-05 | Protected routes guard FE | FE | ⬜ | E2E tests |
| A01-06 | UI respects role permissions | FE | ⬜ | E2E tests |

**Verification Commands:**
```bash
# Find endpoints without authorization
grep -rn "@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping" \
  src/main/java --include="*.java" -B 3 | grep -v "@PreAuthorize"

# Test authorization rules
./mvnw test -Dtest=*AuthorizationTest
```

---

### A02:2021 — Cryptographic Failures

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A02-01 | TLS enforced (HTTPS only) | Ops | ⬜ | Config |
| A02-02 | Strong TLS version (1.2+) | Ops | ⬜ | SSL scan |
| A02-03 | No sensitive data in logs | BE | ⬜ | Log review |
| A02-04 | PII masked in audit logs | BE | ⬜ | Unit tests |
| A02-05 | Tokens stored securely | FE | ⬜ | Code review |
| A02-06 | Secure cookie flags set | BE | ⬜ | Config |

**Verification Commands:**
```bash
# Check for logged sensitive data patterns
grep -rn "password\|secret\|token\|key" src/main/java --include="*.java" | \
  grep "log\."

# Verify cookie security
curl -I https://localhost:8080/api/v1/auth/login -c - | grep Set-Cookie
```

---

### A03:2021 — Injection

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A03-01 | All queries parameterized | BE | ⬜ | Code review |
| A03-02 | No string concat in SQL | BE | ⬜ | grep output |
| A03-03 | Input validated on entry | BE | ⬜ | Unit tests |
| A03-04 | SafeHtml validator on text | BE | ⬜ | Unit tests |
| A03-05 | XSS prevention in FE | FE | ⬜ | XSS tests |
| A03-06 | Output encoding applied | FE | ⬜ | Code review |

**Verification Commands:**
```bash
# Find potential SQL injection
grep -rn "createQuery\|createNativeQuery" src/main/java --include="*.java" | \
  grep -v "@Param"

# Check for string concatenation in queries
grep -rn "\" +" src/main/java --include="*Repository.java"

# Run injection tests
./mvnw test -Dtest=*InjectionTest
```

---

### A04:2021 — Insecure Design

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A04-01 | Threat model documented | Lead | ⬜ | Document |
| A04-02 | Business logic abuse cases | Lead | ⬜ | Test cases |
| A04-03 | Rate limiting configured | BE | ⬜ | Integration test |
| A04-04 | Circuit breakers in place | BE | ⬜ | Config |
| A04-05 | Timeout handling | FE/BE | ⬜ | Unit tests |
| A04-06 | Graceful degradation | FE | ⬜ | E2E tests |

**Verification Commands:**
```bash
# Test rate limiting
for i in {1..20}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/v1/orders
done | grep 429

# Verify timeout configuration
grep -rn "timeout\|connectTimeout\|readTimeout" src/main/resources
```

---

### A05:2021 — Security Misconfiguration

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A05-01 | Security headers set | BE | ⬜ | Header scan |
| A05-02 | Error messages sanitized | BE | ⬜ | Manual test |
| A05-03 | Debug mode disabled | BE | ⬜ | Config review |
| A05-04 | Default accounts removed | BE | ⬜ | Auth test |
| A05-05 | Unnecessary features disabled | BE | ⬜ | Config review |
| A05-06 | Framework security defaults | BE | ⬜ | Code review |

**Security Headers Checklist:**
| Header | Expected Value | Status |
|--------|---------------|--------|
| X-Content-Type-Options | nosniff | ⬜ |
| X-Frame-Options | DENY | ⬜ |
| X-XSS-Protection | 0 | ⬜ |
| Strict-Transport-Security | max-age=31536000 | ⬜ |
| Content-Security-Policy | (configured) | ⬜ |
| Referrer-Policy | strict-origin-when-cross-origin | ⬜ |

**Verification Commands:**
```bash
# Check security headers
curl -I https://localhost:8080/api/v1/health

# Verify no stack traces in error responses
curl -s http://localhost:8080/api/v1/orders/999999 | grep -i "exception\|stacktrace"

# Check Spring Security defaults
grep -rn "spring.security" src/main/resources/application*.yml
```

---

### A06:2021 — Vulnerable and Outdated Components

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A06-01 | OWASP Dependency Check run | BE | ⬜ | Report |
| A06-02 | No critical vulnerabilities | BE | ⬜ | Report |
| A06-03 | NPM audit clean | FE | ⬜ | npm output |
| A06-04 | Dependencies up to date | Both | ⬜ | Versions |
| A06-05 | Snyk scan completed | Both | ⬜ | Report |
| A06-06 | License compliance check | Lead | ⬜ | Report |

**Verification Commands:**
```bash
# Backend dependency check
./mvnw dependency-check:check
cat target/dependency-check-report.html

# Frontend dependency check
cd frontend
npm audit
npm audit --json > audit-report.json

# Check for outdated dependencies
./mvnw versions:display-dependency-updates
npm outdated
```

---

### A07:2021 — Identification and Authentication Failures

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A07-01 | Token validation complete | BE | ⬜ | Unit tests |
| A07-02 | Token expiration enforced | BE | ⬜ | Integration test |
| A07-03 | Refresh token rotation | BE | ⬜ | Unit tests |
| A07-04 | Session timeout configured | BE | ⬜ | Config |
| A07-05 | Logout invalidates tokens | BE | ⬜ | Integration test |
| A07-06 | Failed login handling | BE | ⬜ | Unit tests |

**Verification Commands:**
```bash
# Test token expiration
./mvnw test -Dtest=JwtTokenValidatorTest

# Test session timeout
./mvnw test -Dtest=SessionServiceTest

# Test logout flow
curl -X POST http://localhost:8080/api/v1/auth/logout \
  -H "Authorization: Bearer <token>"
```

---

### A08:2021 — Software and Data Integrity Failures

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A08-01 | CSRF protection enabled | BE | ⬜ | Integration test |
| A08-02 | CSRF tokens in SPA | FE | ⬜ | E2E test |
| A08-03 | Signed cookies used | BE | ⬜ | Config |
| A08-04 | CI/CD pipeline secured | Ops | ⬜ | Pipeline review |
| A08-05 | Artifact integrity verified | Ops | ⬜ | Build config |
| A08-06 | Deserialization secured | BE | ⬜ | Code review |

**Verification Commands:**
```bash
# Test CSRF protection
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":1}' \
  --cookie "XSRF-TOKEN=invalid"
# Should return 403

# Verify CSRF cookie is set
curl -c - http://localhost:8080/api/v1/health | grep XSRF
```

---

### A09:2021 — Security Logging and Monitoring Failures

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A09-01 | Auth events logged | BE | ⬜ | Log samples |
| A09-02 | Access denied logged | BE | ⬜ | Log samples |
| A09-03 | Input validation failures | BE | ⬜ | Log samples |
| A09-04 | Audit trail complete | BE | ⬜ | Audit query |
| A09-05 | Logs centralized | Ops | ⬜ | Log query |
| A09-06 | Alerting configured | Ops | ⬜ | Alert rules |

**Required Audit Events:**
| Event Type | Logged | Format | Retention |
|------------|--------|--------|-----------|
| Login success | ⬜ | JSON | 90 days |
| Login failure | ⬜ | JSON | 90 days |
| Logout | ⬜ | JSON | 90 days |
| Order create | ⬜ | JSON | 1 year |
| Order update | ⬜ | JSON | 1 year |
| Order cancel | ⬜ | JSON | 1 year |
| Access denied | ⬜ | JSON | 90 days |
| Permission change | ⬜ | JSON | 1 year |

**Verification Commands:**
```bash
# Check audit log format
grep "AUDIT:" logs/application.log | head -5 | jq .

# Verify authentication events logged
grep "SECURITY_EVENT: Authentication" logs/application.log

# Query audit trail
curl "http://localhost:8080/api/v1/admin/audit?action=CREATE_ORDER&from=2025-01-01"
```

---

### A10:2021 — Server-Side Request Forgery (SSRF)

| ID | Check | Owner | Status | Evidence |
|----|-------|-------|--------|----------|
| A10-01 | URL validation in place | BE | ⬜ | Unit tests |
| A10-02 | Allowlist for external calls | BE | ⬜ | Config |
| A10-03 | Private IPs blocked | BE | ⬜ | Unit tests |
| A10-04 | Cloud metadata blocked | BE | ⬜ | Unit tests |
| A10-05 | Network segmentation | Ops | ⬜ | Diagram |
| A10-06 | Webhook URLs validated | BE | ⬜ | Unit tests |

**Verification Commands:**
```bash
# Test SSRF protection (should fail)
curl -X POST http://localhost:8080/api/v1/webhooks \
  -d '{"url":"http://169.254.169.254/latest/meta-data/"}'
# Should return 400

# Verify URL allowlist
grep -rn "allowedHosts\|allowedUrls" src/main/java
```

---

## Pre-Demo Security Checklist

Complete these checks before the Sprint 3 Demo:

### Code Quality
- [ ] All security tests passing
- [ ] No TODO/FIXME for security issues
- [ ] Security code review completed
- [ ] Static analysis clean (SpotBugs)

### Configuration
- [ ] Production config secured
- [ ] Secrets not in source control
- [ ] Environment variables documented
- [ ] Feature flags reviewed

### Documentation
- [ ] Threat model up to date
- [ ] Security runbook updated
- [ ] Incident response plan ready
- [ ] API security documented

### Testing
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] E2E security tests passing
- [ ] Manual penetration testing done

---

## Security Scan Summary

| Scanner | Version | Last Run | Findings |
|---------|---------|----------|----------|
| OWASP Dependency-Check | | | |
| npm audit | | | |
| SpotBugs | | | |
| SonarQube | | | |
| Snyk | | | |

---

## Findings Tracker

| ID | Severity | Description | Status | Assigned | Due |
|----|----------|-------------|--------|----------|-----|
| | | | | | |
| | | | | | |
| | | | | | |

**Severity Levels:**
- 🔴 Critical — Must fix before demo
- 🟠 High — Must fix before sprint end
- 🟡 Medium — Fix in next sprint
- 🟢 Low — Track in backlog

---

## Sign-off

### Security Lead Sign-off

I confirm that all security checks have been completed and the application meets the security requirements for Sprint 3.

- [ ] OWASP Top 10 addressed
- [ ] No critical/high vulnerabilities
- [ ] Audit logging complete
- [ ] Security documentation updated

**Name:** ___________________  
**Date:** ___________________  
**Signature:** ___________________

---

## References

| Resource | Location |
|----------|----------|
| OWASP Top 10 2021 | https://owasp.org/Top10/ |
| Sprint 3 Program | [../SPRINT_3_PROGRAM.md](../SPRINT_3_PROGRAM.md) |
| BE Tasks | [BE_TASKS.md](BE_TASKS.md) |
| FE Tasks | [FE_TASKS.md](FE_TASKS.md) |
| Threat Model | (to be created) |
