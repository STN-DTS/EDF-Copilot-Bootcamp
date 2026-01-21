# Sprint 2 — Expand Journeys + Harden NFRs (Weeks 7-8)

**Objective:** Add breadth while hardening quality (performance, audit, resilience).

**Status:** ✅ Complete

---

## Sprint 2 Deliverables

| Document | Purpose | Status |
|----------|---------|--------|
| [SPRINT_2_PROGRAM.md](./SPRINT_2_PROGRAM.md) | Two-week execution guide | ✅ Complete |
| [sprint-packet/SPRINT_PACKET.md](./sprint-packet/SPRINT_PACKET.md) | Scope, AC, DoD | ✅ Complete |
| [sprint-packet/FE_TASKS.md](./sprint-packet/FE_TASKS.md) | Frontend task breakdown | ✅ Complete |
| [sprint-packet/BE_TASKS.md](./sprint-packet/BE_TASKS.md) | Backend task breakdown | ✅ Complete |
| [sprint-packet/NFR_CHECKLIST.md](./sprint-packet/NFR_CHECKLIST.md) | NFR verification | ✅ Complete |

---

## Sprint 2 Outcomes

By end of sprint, the team has:
- ✅ 3 additional journeys implemented (Create, Cancel, Filter/Search)
- ✅ Accessibility compliance verified (WCAG 2.1 AA)
- ✅ Performance benchmarks met (<500ms p95)
- ✅ Audit/telemetry complete (structured logging)
- ✅ Security scanning clean (0 high/critical)
- ✅ Ready for production hardening

---

## Prerequisites

- [x] Completed [Sprint 1: Thin Vertical Slice](../sprint-01/README.md)
- [x] Passed Sprint 1 gate
- [x] Sprint Packet approved
- [x] Contract v1 compatibility maintained

---

## Sprint 2 Schedule

### Week 7 (Days 1-5) — Feature Expansion

| Day | Focus | FE Tasks | BE Tasks |
|-----|-------|----------|----------|
| 0 | Lead Prep | Sprint handover | Sprint handover |
| 1 | Planning | Sprint kickoff | Sprint kickoff |
| 2 | Create Order | FE-101 | BE-101, BE-102, BE-103 |
| 3 | Create Order | FE-102, FE-103 | BE-104, BE-105 |
| 4 | Cancel Order | FE-104, FE-105, FE-106 | BE-106, BE-107, BE-108, BE-109 |
| 5 | Filter/Search | FE-107, FE-108, FE-109 | BE-110, BE-111, BE-112 |

### Week 8 (Days 6-10) — NFR Hardening + Testing

| Day | Focus | FE Tasks | BE Tasks |
|-----|-------|----------|----------|
| 6 | State Patterns | FE-110, FE-111, FE-112, FE-113 | BE-113 |
| 7 | NFR Hardening | FE-114 | BE-114 |
| 8 | Testing | FE-115 | BE-115 |
| 9 | Testing | FE-116 | BE-116 |
| 10 | Demo Prep | FE-117 | BE-117 |

---

## Sprint Packet (MANDATORY)

| Section | Content |
|---------|---------|
| Goal | Expand journeys + harden quality |
| Definition of Done | Completion criteria |
| In-Scope Files/Paths | What can be touched |
| Contract References | Additional endpoints |
| Acceptance Criteria | New requirements |
| NFR Requirements | Performance, accessibility, security |
| Test Requirements | Coverage targets |
| Out of Scope | What is excluded |

See [SPRINT_PACKET.md](./sprint-packet/SPRINT_PACKET.md) for full details.

---

## User Stories

| ID | Story | Points |
|----|-------|--------|
| US-004 | Create Order | 8 |
| US-005 | Cancel Order | 5 |
| US-006 | Filter/Search Orders | 5 |
| US-007 | Consistent States | 3 |

---

## NFR Focus Areas

| Category | Sprint 2 Target | Verification |
|----------|-----------------|--------------|
| **Performance** | <500ms API p95 | Load testing |
| **Accessibility** | WCAG 2.1 AA | axe-core audit |
| **Security** | 0 high/critical findings | OWASP scan |
| **Auditability** | All key events logged | Log review |
| **Resilience** | Graceful degradation | Chaos testing |
| **Observability** | Health endpoints ready | Endpoint checks |

See [NFR_CHECKLIST.md](./sprint-packet/NFR_CHECKLIST.md) for verification commands.

---

## Key Prompts

| Prompt | Purpose | See |
|--------|---------|-----|
| P2-CREATE | Create Order form | [FE_TASKS.md](./sprint-packet/FE_TASKS.md#fe-101-create-order-route-and-page-component) |
| P2-CANCEL | Cancel Order dialog | [FE_TASKS.md](./sprint-packet/FE_TASKS.md#fe-104-cancel-order-confirmation-dialog) |
| P2-FILTER | Filter controls | [FE_TASKS.md](./sprint-packet/FE_TASKS.md#fe-107-filter-component-ui) |
| P2-SPEC | Order specifications | [BE_TASKS.md](./sprint-packet/BE_TASKS.md#be-110-orderspecification-for-dynamic-queries) |
| P2-RATE | Rate limiting | [BE_TASKS.md](./sprint-packet/BE_TASKS.md#be-114-rate-limiting-configuration) |

---

## Folder Structure

```
sprint-02/
├── README.md                    ← You are here
├── SPRINT_2_PROGRAM.md          ← Two-week execution guide
└── sprint-packet/
    ├── README.md                ← Packet index
    ├── SPRINT_PACKET.md         ← Mandatory sprint packet
    ├── FE_TASKS.md              ← Frontend task breakdown (17 tasks)
    ├── BE_TASKS.md              ← Backend task breakdown (17 tasks)
    └── NFR_CHECKLIST.md         ← NFR verification checklist
```

---

## Sprint Gate Criteria

**Demo + test coverage + security + no contract drift:**

- [x] 3 additional journeys working (Create, Cancel, Filter/Search)
- [x] Empty/error/loading states standardized
- [x] Accessibility checks passing (WCAG 2.1 AA)
- [x] Performance within targets (<500ms p95)
- [x] Rate limiting configured (100 req/min per user)
- [x] Audit events complete (structured logging)
- [x] Test coverage ≥70%
- [x] Security scan clean (0 high/critical)
- [x] Contract compatibility maintained
- [x] Demo successful

---

## Standing Rituals (During Sprint)

| Ritual | Frequency | Duration |
|--------|-----------|----------|
| Contract Council | Weekly | 30 min |
| Architecture Sync | 2x weekly | 20 min |
| Daily Dev Block | Daily | 15 min |

---

## Sprint 2 to Sprint 3 Transition

After Sprint 2 gate, prepare for Sprint 3 (Production Readiness):

### Handover Checklist

- [ ] Sprint 2 demo completed
- [ ] Sprint 2 retro conducted
- [ ] NFR baseline documented
- [ ] Performance metrics captured
- [ ] Sprint 3 packet drafted
- [ ] Tech debt logged (if any)

### Sprint 3 Focus Preview

- Advanced error handling
- Production configuration
- CI/CD pipeline hardening
- Load testing at scale
- Deployment automation

---

## Related Resources

| Resource | Location |
|----------|----------|
| Sprint 1 | [../sprint-01/README.md](../sprint-01/README.md) |
| Sprint 3 | [../sprint-03/README.md](../sprint-03/README.md) |
| Master Index | [../../.MASTER_BOOTCAMP.md](../../.MASTER_BOOTCAMP.md) |

---

## Return to [Master Index](../../.MASTER_BOOTCAMP.md)
