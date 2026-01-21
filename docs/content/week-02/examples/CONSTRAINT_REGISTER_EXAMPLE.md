# Constraint Register — Order Management System

**Project:** Order Management MVP  
**Version:** 1.0  
**Last Updated:** 2026-01-20  
**Owner:** Tech Lead

---

## 1. Functional Constraints

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| F-001 | Orders must contain 1-100 items | Business Rules v1.2 | P1 | Unit test: reject orders with 0 or >100 items | ⏳ |
| F-002 | Order total = sum of (item price × quantity) | Business Rules v1.2 | P1 | Unit test: calculation accuracy to 2 decimals | ⏳ |
| F-003 | Orders can be cancelled only if status is Pending or Confirmed | Business Rules v1.2 | P1 | Integration test: status transition rules | ⏳ |
| F-004 | Cancellation window: 24 hours from order creation | PM Decision 2026-01-15 | P1 | Unit test: time-based validation | ⏳ |
| F-005 | Customer email must be unique per account | Business Rules v1.2 | P2 | DB unique constraint + validation test | ⏳ |
| F-006 | Order search supports: status, date range, customer | User Research v1 | P2 | E2E test: search functionality | ⏳ |
| F-007 | Pagination: 20 items per page, max 100 | UX Guidelines | P3 | E2E test: pagination behavior | ⏳ |

## 2. Non-Functional Constraints

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| NF-001 | API response time ≤500ms (p95) | Performance SLA v1 | P1 | Load test: 500 concurrent users | ⏳ |
| NF-002 | System availability ≥99.5% (excluding maintenance) | SLA Agreement | P1 | Monitoring: monthly uptime report | ⏳ |
| NF-003 | Page load time ≤3 seconds (3G connection) | UX Guidelines | P2 | Lighthouse audit: performance >70 | ⏳ |
| NF-004 | WCAG 2.1 AA accessibility compliance | Accessibility Policy | P2 | Lighthouse audit + axe-core scan | ⏳ |
| NF-005 | All mutations logged with user, timestamp, changes | Audit Policy v2 | P1 | Audit log verification test | ⏳ |
| NF-006 | Support 500 concurrent users | Capacity Planning | P2 | Load test: 500 users, <5% error rate | ⏳ |
| NF-007 | Bundle size ≤500KB (gzipped) | FE Standards | P2 | Build analysis: bundle size check | ⏳ |

## 3. Integration Constraints

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| I-001 | Authenticate via Microsoft Entra ID (OAuth 2.0) | Security Policy v3 | P1 | SSO integration test | ⏳ |
| I-002 | Connect to Oracle Database 19c | Infrastructure Doc | P1 | Connection test + query execution | ⏳ |
| I-003 | Deploy to OpenShift 4.x cluster | Platform Policy | P1 | Deployment verification | ⏳ |
| I-004 | Send logs to ELK stack (Elasticsearch) | Ops Policy v2 | P2 | Log shipping verification | ⏳ |
| I-005 | Email notifications via SendGrid API | Integration Architecture | P2 | Email delivery test | ⏳ |

## 4. Regulatory Constraints

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| R-001 | Customer PII encrypted at rest (AES-256) | Privacy Policy v4 | P1 | Security audit: encryption verification | ⏳ |
| R-002 | Order data retained for 7 years | Data Retention Policy | P1 | DB retention policy check | ⏳ |
| R-003 | GDPR: Right to access personal data | GDPR Art. 15 | P1 | Data export functionality test | ⏳ |
| R-004 | GDPR: Right to deletion (where permitted) | GDPR Art. 17 | P2 | Data deletion workflow test | ⏳ |
| R-005 | Access logs retained for audit (2 years) | Compliance Req v1 | P1 | Log retention verification | ⏳ |

## 5. Technical Constraints

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| T-001 | Backend: Java 17 LTS | Stack Decision ADR-001 | P1 | Build verification: Java version | ⏳ |
| T-002 | Backend: Spring Boot 3.2+ | Stack Decision ADR-001 | P1 | Dependency check | ⏳ |
| T-003 | Frontend: React 18+ with React Router v7 | Stack Decision ADR-002 | P1 | Package.json verification | ⏳ |
| T-004 | API: REST with OpenAPI 3.1 specification | API Standards v2 | P1 | Contract validation | ⏳ |
| T-005 | Error responses: RFC 7807 Problem Details | API Standards v2 | P1 | Response format test | ⏳ |
| T-006 | Container image size ≤500MB | Platform Limits | P2 | Image size check | ⏳ |
| T-007 | Build time ≤5 minutes | CI/CD Standards | P3 | Pipeline timing check | ⏳ |

## 6. Organizational Constraints

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| O-001 | MVP delivery by 2026-03-31 | Project Charter | P1 | Sprint tracking | ⏳ |
| O-002 | Team: 2 FE + 2 BE + 1 QA | Resource Plan | P1 | Team roster | ⏳ |
| O-003 | All PRs require 1 reviewer approval | Dev Process v1 | P1 | GitHub branch protection | ⏳ |
| O-004 | Code coverage ≥80% for new code | Quality Gate v2 | P2 | Coverage report | ⏳ |
| O-005 | Documentation in English | Communication Standards | P3 | Review | ⏳ |

---

## Assumptions (To Validate)

| ID | Assumption | Risk if Wrong | Validation Plan |
|----|------------|---------------|-----------------|
| A-001 | Existing customer data can be migrated | High - delays if not | POC migration by Week 4 |
| A-002 | SSO tokens work with mobile browsers | Medium - alternative needed | Mobile testing in Sprint 1 |
| A-003 | SendGrid API limits sufficient | Low - can upgrade | Estimate email volume |
| A-004 | Oracle performance under load is acceptable | High - need optimization | Load test in Week 4 |

---

## Risks

| ID | Risk | Probability | Impact | Mitigation |
|----|------|-------------|--------|------------|
| RK-001 | Oracle performance under load | Medium | High | Early load testing, index optimization |
| RK-002 | SSO integration delays | Medium | High | Start integration in Week 1, have fallback |
| RK-003 | Team member unavailability | Low | Medium | Cross-training, documentation |
| RK-004 | Scope creep from stakeholders | High | Medium | Change control process, reference constraint register |

---

## Constraint Statistics

| Category | Count | P1 | P2 | P3 |
|----------|-------|----|----|-----|
| Functional | 7 | 4 | 2 | 1 |
| Non-Functional | 7 | 3 | 4 | 0 |
| Integration | 5 | 3 | 2 | 0 |
| Regulatory | 5 | 4 | 1 | 0 |
| Technical | 7 | 5 | 1 | 1 |
| Organizational | 5 | 3 | 1 | 1 |
| **Total** | **36** | **22** | **11** | **3** |

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead (FE) | | | |
| Tech Lead (BE) | | | |
| Security Lead | | | |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-20 | Tech Lead | Initial version |
