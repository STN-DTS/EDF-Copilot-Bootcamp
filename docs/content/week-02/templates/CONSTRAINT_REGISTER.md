# Constraint Register Template

**Project:** [Project Name]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [Tech Lead Name]

---

## How to Use This Template

1. **Review each category** with relevant stakeholders
2. **Document every constraint** — if it's not written, it doesn't exist
3. **Assign priority** using P1 (critical) / P2 (high) / P3 (medium)
4. **Define validation** — how will we prove this constraint is met?
5. **Track source** — who said this? What document?

---

## Constraint Categories

### 1. Functional Constraints

> Business rules, validation logic, workflows, data processing requirements

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| F-001 | Orders must contain at least 1 item | Business Rules v1 | P1 | Unit test: reject empty orders | ⏳ |
| F-002 | Order total must equal sum of item prices | Business Rules v1 | P1 | Unit test: total calculation | ⏳ |
| F-003 | Cancelled orders cannot be modified | Business Rules v1 | P1 | Integration test: update blocked | ⏳ |
| F-004 | Customer email must be unique | Business Rules v1 | P2 | DB constraint + validation | ⏳ |
| F-005 | | | | | |

### 2. Non-Functional Constraints

> Performance, availability, accessibility, auditability, retention

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| NF-001 | API response time ≤ 500ms (p95) | Performance SLA | P1 | Load test: measure p95 | ⏳ |
| NF-002 | System available 99.5% (excl. maintenance) | SLA Agreement | P1 | Monitoring + reporting | ⏳ |
| NF-003 | WCAG 2.1 AA accessibility compliance | Accessibility Policy | P2 | Lighthouse audit + manual | ⏳ |
| NF-004 | All data changes must be auditable | Audit Policy | P1 | Audit log verification | ⏳ |
| NF-005 | Data retained for 7 years | Retention Policy | P2 | DB retention check | ⏳ |
| NF-006 | | | | | |

### 3. Integration Constraints

> External systems, APIs, authentication, data sources

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| I-001 | Authenticate via enterprise SSO (OAuth 2.0) | Security Policy | P1 | SSO integration test | ⏳ |
| I-002 | Connect to Oracle DB (version X.X) | Infrastructure | P1 | Connection test | ⏳ |
| I-003 | Deploy to OpenShift cluster | Platform Policy | P1 | Deployment verification | ⏳ |
| I-004 | Use existing logging infrastructure (ELK) | Ops Policy | P2 | Log shipping test | ⏳ |
| I-005 | | | | | |

### 4. Regulatory/Compliance Constraints

> Legal requirements, privacy, security mandates

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| R-001 | PII must be encrypted at rest | Privacy Policy | P1 | Security audit | ⏳ |
| R-002 | User consent required before data collection | Privacy Policy | P1 | Consent flow test | ⏳ |
| R-003 | Access logs retained for audit | Compliance Req | P1 | Log retention check | ⏳ |
| R-004 | Data breach notification within 72 hours | Regulatory Req | P1 | Incident procedure | ⏳ |
| R-005 | | | | | |

### 5. Technical Constraints

> Stack decisions, existing infrastructure, platform limitations

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| T-001 | Java 17 or 21 (LTS only) | Stack Decision | P1 | Build verification | ⏳ |
| T-002 | Spring Boot 3.x | Stack Decision | P1 | Dependency check | ⏳ |
| T-003 | React 18+ with React Router v7 | Stack Decision | P1 | Package.json verification | ⏳ |
| T-004 | PostgreSQL for local dev, Oracle for prod | Dev Standards | P2 | Config verification | ⏳ |
| T-005 | Container size ≤ 500MB | Platform Limit | P2 | Image size check | ⏳ |
| T-006 | | | | | |

### 6. Organizational Constraints

> Timeline, budget, team skills, process requirements

| ID | Constraint | Source | Priority | Validation Method | Status |
|----|------------|--------|----------|-------------------|--------|
| O-001 | MVP delivery by [Date] | Project Charter | P1 | Sprint tracking | ⏳ |
| O-002 | Team of N developers (FE: X, BE: Y) | Resource Plan | P1 | Team roster | ⏳ |
| O-003 | PRs require at least 1 reviewer | Dev Process | P2 | GitHub settings | ⏳ |
| O-004 | All code must have tests | Quality Policy | P1 | Coverage gates | ⏳ |
| O-005 | | | | | |

---

## Assumptions (To Be Validated)

> Items believed to be true but not yet confirmed

| ID | Assumption | Risk if Wrong | Validation Owner | Validate By |
|----|------------|---------------|------------------|-------------|
| A-001 | Existing SSO supports our use case | Major rework needed | Security Lead | Week 3 |
| A-002 | Oracle schema can be extended | Schema redesign | DBA | Week 3 |
| A-003 | Team has React Router v7 experience | Training delay | FE Lead | Week 1 |
| A-004 | | | | |

---

## Risks Identified

> Potential issues that could impact constraints

| ID | Risk | Impact | Probability | Mitigation | Owner |
|----|------|--------|-------------|------------|-------|
| R-001 | SSO integration delays | Timeline slip | Medium | Early spike in Week 3 | BE Lead |
| R-002 | Oracle perf not meeting SLA | Rearchitecture | Low | Early load testing | DBA |
| R-003 | Accessibility remediation scope | Timeline slip | Medium | Early audit in Sprint 1 | FE Lead |
| R-004 | | | | | |

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Tech Lead (BE) | | | |
| Tech Lead (FE) | | | |
| Security Lead | | | |
| QA Lead | | | |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial creation |
| | | | |

---

## Copilot Assistance

Use P15 to help extract constraints:

```markdown
No secrets, no production data. Use placeholders.

Based on the business requirements in <document>, extract constraints for:
1. Functional (business rules, validation, workflows)
2. Non-Functional (performance, availability, accessibility)
3. Integration (systems, APIs, auth)
4. Regulatory (compliance, privacy, security)
5. Technical (stack, infrastructure, platform)
6. Organizational (timeline, team, process)

Format as a constraint register table with columns:
ID | Constraint | Source | Priority | Validation Method | Status
```
