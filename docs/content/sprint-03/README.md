# Sprint 3 — Harden + Security (Weeks 9-10)

> **Status:** ✅ Complete

> **Objective:** Security hardening, edge case handling, and robustness improvements.

**Duration:** 2 weeks (Weeks 9-10 of bootcamp)  
**Gate:** Security review passed, edge cases handled  
**Focus:** OWASP Top 10, Authorization, Input Validation, Audit Logging

---

## Quick Links

| Document                                                     | Purpose                       |
| ------------------------------------------------------------ | ----------------------------- |
| [SPRINT_3_PROGRAM.md](SPRINT_3_PROGRAM.md)                   | Complete 2-week program guide |
| [SPRINT_PACKET.md](sprint-packet/SPRINT_PACKET.md)           | User stories, tasks, AC       |
| [FE_TASKS.md](sprint-packet/FE_TASKS.md)                     | Frontend task breakdown       |
| [BE_TASKS.md](sprint-packet/BE_TASKS.md)                     | Backend task breakdown        |
| [SECURITY_CHECKLIST.md](sprint-packet/SECURITY_CHECKLIST.md) | OWASP verification            |
| [FAQ.md](FAQ.md)                                             | Common questions              |

---

## Sprint Goals

1. **Authentication Hardening** — Token validation, refresh, secure logout
2. **Authorization Verification** — @PreAuthorize, resource ownership, permission gates
3. **Input Validation** — Sanitization, custom validators, injection prevention
4. **Audit Logging** — Comprehensive logging for compliance (every mutation)

---

## User Stories

| ID     | Story                       | Points |
| ------ | --------------------------- | ------ |
| US-008 | Secure Authentication Flow  | 5      |
| US-009 | Authorization Verification  | 8      |
| US-010 | Input Validation Complete   | 5      |
| US-011 | Comprehensive Audit Logging | 5      |

**Total:** 23 Story Points

---

## Sprint Ceremonies

| Ceremony         | When   | Duration | Purpose                       |
| ---------------- | ------ | -------- | ----------------------------- |
| Sprint Planning  | Day 1  | 2 hours  | Scope and commitment          |
| Security Kickoff | Day 1  | 1 hour   | OWASP overview + threat model |
| Daily Standup    | Daily  | 15 min   | Blockers and progress         |
| Sprint Review    | Day 10 | 1 hour   | Security demo                 |
| Sprint Retro     | Day 10 | 1 hour   | Process improvement           |

---

## Week-by-Week Schedule

### Week 9: Security Implementation (Days 1-5)

| Day | Focus            | FE Tasks   | BE Tasks   |
| --- | ---------------- | ---------- | ---------- |
| 1   | Planning         | FE-301     | BE-301     |
| 2   | Auth Hardening   | FE-301–303 | BE-301–303 |
| 3   | Authorization    | FE-304–306 | BE-304–306 |
| 4   | Input Validation | FE-307–309 | BE-307–309 |
| 5   | CSRF + Headers   | FE-310–312 | BE-310–312 |

### Week 10: Edge Cases + Testing (Days 6-10)

| Day | Focus          | FE Tasks   | BE Tasks   |
| --- | -------------- | ---------- | ---------- |
| 6   | Audit Logging  | FE-313–315 | BE-313–315 |
| 7   | Edge Cases     | FE-316–318 | BE-316–318 |
| 8   | Security Tests | FE-319–321 | BE-319–321 |
| 9   | Integration    | FE-322–324 | BE-322–324 |
| 10  | Demo + Retro   | —          | —          |

---

## Deliverables Checklist

### Week 9: Security Implementation

- [x] Token validation and refresh mechanism
- [x] @PreAuthorize on all endpoints
- [x] Resource ownership validation
- [x] Input sanitization utilities
- [x] Custom validators (SafeHtml, etc.)
- [x] CSRF token handling
- [x] Security headers configuration

### Week 10: Edge Cases + Hardening

- [x] Audit logging for all mutations
- [x] PII masking in logs
- [x] Optimistic locking (conflict handling)
- [x] Security unit tests
- [x] E2E security tests
- [x] OWASP checklist complete

---

## Security Checklist (OWASP Top 10 2021)

| ID  | Vulnerability             | Owner | Status |
| --- | ------------------------- | ----- | ------ |
| A01 | Broken Access Control     | BE/FE | ✅     |
| A02 | Cryptographic Failures    | BE    | ✅     |
| A03 | Injection                 | BE    | ✅     |
| A04 | Insecure Design           | Lead  | ✅     |
| A05 | Security Misconfiguration | BE    | ✅     |
| A06 | Vulnerable Components     | Both  | ✅     |
| A07 | Auth Failures             | BE/FE | ✅     |
| A08 | Data Integrity Failures   | BE/FE | ✅     |
| A09 | Logging Failures          | BE    | ✅     |
| A10 | SSRF                      | BE    | ✅     |

See [SECURITY_CHECKLIST.md](sprint-packet/SECURITY_CHECKLIST.md) for detailed verification.

---

## Key Prompts

| ID       | Prompt          | Use Case                  |
| -------- | --------------- | ------------------------- |
| P18      | Security Review | OWASP Top 10 verification |
| P3-AUTH  | Auth Hardening  | Token validation          |
| P3-AUTHZ | Authorization   | @PreAuthorize patterns    |
| P3-VALID | Validation      | Input sanitization        |
| P3-AUDIT | Audit Logging   | Event logging             |

---

## Success Metrics

| Metric              | Target         | How Measured           |
| ------------------- | -------------- | ---------------------- |
| Critical/High Vulns | 0              | OWASP Dependency-Check |
| OWASP Items         | 10/10          | Security Checklist     |
| Audit Coverage      | 100% mutations | Mutation testing       |
| Security Tests      | ≥80% coverage  | JaCoCo                 |

---

## Definition of Done

### Feature Level

- [ ] Code implements security requirement
- [ ] Unit tests for security paths
- [ ] Code review by security-aware peer
- [ ] OWASP checklist item verified

### Sprint Level

- [ ] All security checklist items addressed
- [ ] No critical/high vulnerabilities
- [ ] Audit logging verified
- [ ] Security review documented
- [ ] Sprint demo completed
- [ ] Retrospective documented

---

## Folder Structure

```
docs/content/sprint-03/
├── README.md                    # This file
├── SPRINT_3_PROGRAM.md          # Day-by-day program guide
└── sprint-packet/
    ├── README.md                # Packet index
    ├── SPRINT_PACKET.md         # User stories + AC
    ├── FE_TASKS.md              # Frontend tasks (24)
    ├── BE_TASKS.md              # Backend tasks (24)
    └── SECURITY_CHECKLIST.md    # OWASP verification
```

---

## Related Documents

- [Sprint Packet](sprint-packet/README.md) — Approved scope
- [SPRINT_3_PROGRAM.md](SPRINT_3_PROGRAM.md) — Complete program
- [Security Checklist](sprint-packet/SECURITY_CHECKLIST.md) — OWASP verification
- [Prompt Pack](../../shared/reference-materials/PROMPT_PACK_V1.md) — P18 Security Review
- [Testing Instructions](../../../.github/instructions/testing.instructions.md) — Testing standards

---

## Navigation

| Previous                             | Home                                         | Next                                 |
| ------------------------------------ | -------------------------------------------- | ------------------------------------ |
| [← Sprint 2](../sprint-02/README.md) | [Master Index](../../../.MASTER_BOOTCAMP.md) | [Sprint 4 →](../sprint-04/README.md) |
