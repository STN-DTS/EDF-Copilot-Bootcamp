# Ship-Ready Checklist

> **Gate 5 — Production Readiness Verification**  
> All items must be verified and signed off before production deployment.

**Sprint:** 4 — Polish + Ship  
**Target Date:** Week 12, Day 10  
**Status:** 🔴 Pending

---

## Approval Summary

| Role | Approver | Date | Signature |
|------|----------|------|-----------|
| Product Owner | | | ☐ |
| Frontend Lead | | | ☐ |
| Backend Lead | | | ☐ |
| Security Lead | | | ☐ |
| QA Lead | | | ☐ |
| DevOps Lead | | | ☐ |

---

## 1. Functional Completeness

> All user stories completed with acceptance criteria met.

### User Stories

| ID | Story | Status | Evidence |
|----|-------|--------|----------|
| US-001 | View Orders | ☐ | |
| US-002 | Create Order | ☐ | |
| US-003 | Search Orders | ☐ | |
| US-004 | Pagination | ☐ | |
| US-005 | Order Filtering | ☐ | |
| US-006 | Customer Association | ☐ | |
| US-007 | Multi-Item Orders | ☐ | |
| US-008 | Error Handling | ☐ | |
| US-009 | Input Validation | ☐ | |
| US-010 | Authentication | ☐ | |
| US-011 | Authorization | ☐ | |
| US-012 | Performance Optimization | ☐ | |
| US-013 | Accessibility Compliance | ☐ | |
| US-014 | Complete Documentation | ☐ | |
| US-015 | Operational Readiness | ☐ | |

### Acceptance Criteria Verification

```gherkin
# Run acceptance tests
./mvnw test -Dtest=*AcceptanceTest
npm run test:acceptance
```

**All Stories Verified:** ☐ Yes / ☐ No

---

## 2. Non-Functional Requirements

### 2.1 Performance

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| GET /orders p95 | <500ms | | ☐ |
| GET /orders/{id} p95 | <200ms | | ☐ |
| POST /orders p95 | <500ms | | ☐ |
| Frontend bundle size | <200KB | | ☐ |
| Time to Interactive | <3s | | ☐ |
| Lighthouse Performance | >90 | | ☐ |

**Evidence Required:**
- [ ] Load test results (k6/JMeter report)
- [ ] Lighthouse report screenshot
- [ ] Bundle analyzer screenshot
- [ ] Core Web Vitals report

**Verification Commands:**

```bash
# Backend performance
k6 run scripts/load-test.js --out json=load-test-results.json

# Frontend performance
npm run build -- --analyze
npx lighthouse https://staging.example.com --output=json

# Lighthouse CI
npm run lhci:collect
```

**Performance Verified:** ☐ Yes / ☐ No

---

### 2.2 Accessibility

| Requirement | Target | Actual | Status |
|-------------|--------|--------|--------|
| WCAG Level | 2.1 AA | | ☐ |
| axe-core violations | 0 critical | | ☐ |
| Keyboard navigation | 100% | | ☐ |
| Screen reader tested | Yes | | ☐ |
| Color contrast (AAA) | >4.5:1 | | ☐ |
| Focus indicators | Visible | | ☐ |

**Evidence Required:**
- [ ] axe-core scan results (all pages)
- [ ] Keyboard navigation test report
- [ ] Screen reader test notes (NVDA/VoiceOver)
- [ ] Color contrast checker results

**Verification Commands:**

```bash
# Run accessibility tests
npm run test:a11y

# Lighthouse accessibility
npx lighthouse https://staging.example.com --only-categories=accessibility

# axe-core CI
npm run test:axe
```

**Accessibility Verified:** ☐ Yes / ☐ No

---

### 2.3 Security

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Authentication enforced | ☐ | |
| Authorization working | ☐ | |
| OWASP Top 10 addressed | ☐ | |
| No critical CVEs | ☐ | |
| Secrets not in code | ☐ | |
| Input validation complete | ☐ | |
| SQL injection prevented | ☐ | |
| XSS prevented | ☐ | |
| HTTPS enforced | ☐ | |
| Security headers set | ☐ | |

**Evidence Required:**
- [ ] OWASP ZAP scan results
- [ ] Dependency vulnerability scan (Snyk/OWASP Dependency-Check)
- [ ] Penetration test report (if applicable)
- [ ] Security review sign-off

**Verification Commands:**

```bash
# Backend security scan
./mvnw dependency-check:check

# Frontend security scan
npm audit --audit-level=high

# OWASP ZAP
zap-cli quick-scan https://staging.example.com
```

**Security Verified:** ☐ Yes / ☐ No

---

## 3. Quality Assurance

### 3.1 Test Coverage

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Backend unit test coverage | >80% | | ☐ |
| Frontend unit test coverage | >80% | | ☐ |
| Integration test coverage | >70% | | ☐ |
| E2E test pass rate | 100% | | ☐ |

**Evidence Required:**
- [ ] JaCoCo coverage report
- [ ] Vitest coverage report
- [ ] E2E test results (Playwright)

**Verification Commands:**

```bash
# Backend coverage
./mvnw test jacoco:report

# Frontend coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

### 3.2 Known Issues

| Issue ID | Severity | Description | Mitigation | Accepted By |
|----------|----------|-------------|------------|-------------|
| | | | | |

**No Critical/High Issues:** ☐ Yes / ☐ No  
**Known Issues Documented:** ☐ Yes / ☐ N/A

---

## 4. Operational Readiness

### 4.1 Monitoring & Alerting

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Prometheus metrics configured | ☐ | |
| Grafana dashboards created | ☐ | |
| P1 alerts configured | ☐ | |
| P2 alerts configured | ☐ | |
| Alert routing verified | ☐ | |
| On-call rotation set | ☐ | |

**Evidence Required:**
- [ ] Grafana dashboard screenshots
- [ ] Alert rules configuration
- [ ] PagerDuty/OpsGenie routing proof
- [ ] Test alert received confirmation

---

### 4.2 Logging

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Structured logging (JSON) | ☐ | |
| Log levels appropriate | ☐ | |
| Sensitive data redacted | ☐ | |
| Logs aggregated (ELK/Splunk) | ☐ | |
| Log retention configured | ☐ | |

---

### 4.3 Health & Readiness

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Health endpoint (/health) | ☐ | |
| Readiness endpoint (/ready) | ☐ | |
| Liveness probe configured | ☐ | |
| Readiness probe configured | ☐ | |
| Database health check | ☐ | |

**Verification:**

```bash
# Health check
curl https://staging.example.com/actuator/health

# Readiness check
curl https://staging.example.com/actuator/health/readiness
```

---

### 4.4 Scalability & Resilience

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Horizontal scaling tested | ☐ | |
| Auto-scaling configured | ☐ | |
| Circuit breakers in place | ☐ | |
| Rate limiting configured | ☐ | |
| Graceful shutdown | ☐ | |

---

## 5. Documentation

### 5.1 User Documentation

| Document | Status | Location |
|----------|--------|----------|
| User Guide | ☐ | |
| Quick Start Guide | ☐ | |
| FAQ | ☐ | |
| Release Notes | ☐ | |

---

### 5.2 Technical Documentation

| Document | Status | Location |
|----------|--------|----------|
| API Documentation (OpenAPI) | ☐ | |
| Integration Guide | ☐ | |
| Architecture Diagram | ☐ | |
| Data Flow Diagram | ☐ | |
| Entity Relationship Diagram | ☐ | |

---

### 5.3 Operations Documentation

| Document | Status | Location |
|----------|--------|----------|
| Backend Runbook | ☐ | |
| Frontend Runbook | ☐ | |
| Incident Response Runbook | ☐ | |
| Deployment Guide | ☐ | |
| Rollback Procedure | ☐ | |
| Disaster Recovery Plan | ☐ | |

---

## 6. Deployment Readiness

### 6.1 Infrastructure

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Production namespace created | ☐ | |
| Resource quotas configured | ☐ | |
| Network policies applied | ☐ | |
| Secrets management (Vault/K8s) | ☐ | |
| TLS certificates valid | ☐ | |
| DNS entries configured | ☐ | |

---

### 6.2 CI/CD Pipeline

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Build pipeline working | ☐ | |
| Test automation integrated | ☐ | |
| Security scanning integrated | ☐ | |
| Staging deployment tested | ☐ | |
| Production deployment configured | ☐ | |
| Rollback tested | ☐ | |

---

### 6.3 Staging Verification

| Verification | Status | Date |
|--------------|--------|------|
| Staging deployed | ☐ | |
| Smoke tests passed | ☐ | |
| Integration tests passed | ☐ | |
| UAT completed | ☐ | |
| Performance test passed | ☐ | |
| Security scan passed | ☐ | |

---

## 7. Communication & Rollout

### 7.1 Stakeholder Communication

| Activity | Status | Date |
|----------|--------|------|
| Go-live date announced | ☐ | |
| Release notes published | ☐ | |
| Training completed | ☐ | |
| Support team briefed | ☐ | |

---

### 7.2 Rollout Plan

| Phase | Users | Percentage | Criteria |
|-------|-------|------------|----------|
| Phase 1 | Internal | 5% | Error rate <1% |
| Phase 2 | Beta | 25% | Error rate <1% |
| Phase 3 | General | 100% | Error rate <1% |

---

### 7.3 Rollback Criteria

The following conditions trigger automatic rollback:

- [ ] Error rate > 5% for 5 minutes
- [ ] p95 latency > 2x baseline for 10 minutes
- [ ] Health check failures for 2 minutes
- [ ] Critical security vulnerability discovered

---

## 8. Final Sign-Off

### Gate 5 Approval Criteria

All of the following must be true:

| Criterion | Status |
|-----------|--------|
| All P0 stories complete | ☐ |
| No critical bugs | ☐ |
| Performance targets met | ☐ |
| Accessibility verified | ☐ |
| Security approved | ☐ |
| Documentation complete | ☐ |
| Monitoring active | ☐ |
| Runbooks available | ☐ |
| Stakeholder demo completed | ☐ |

---

### Approvals

**By signing below, I confirm the application is ready for production deployment.**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Frontend Lead | | | |
| Backend Lead | | | |
| Security Lead | | | |
| QA Lead | | | |
| DevOps Lead | | | |
| Project Manager | | | |

---

## Appendix: Evidence Artifacts

List all evidence artifacts with locations:

| Artifact | Type | Location |
|----------|------|----------|
| Load Test Report | PDF | |
| Lighthouse Report | HTML | |
| axe-core Scan | JSON | |
| Security Scan | PDF | |
| Coverage Report | HTML | |
| API Documentation | URL | |
| Grafana Dashboard | URL | |
| Runbook | Confluence | |

---

**Gate 5 Status:** 🔴 Not Approved

**Notes:**

---

*Last Updated: YYYY-MM-DD*
