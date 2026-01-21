# Sprint 1 — Thin Vertical Slice (Weeks 5-6)

**Objective:** Prove the end-to-end pipeline (auth → core flow → persistence → UI → logs/tests).

**Status:** ✅ Complete

---

## Sprint 1 Outcomes

By end of sprint, the team has:
- ✅ End-to-end pipeline working
- ✅ Auth flow implemented
- ✅ Core journey functional
- ✅ Persistence layer connected
- ✅ Logging and telemetry in place
- ✅ Automated tests passing
- ✅ Contract compliance verified

---

## Prerequisites

- [x] Completed [Week 4: Contract-First](../week-04/README.md)
- [x] Passed Gate 4
- [x] Sprint Packet approved
- [x] Contract v1 available

---

## Deliverables Checklist

| Deliverable | Status | Location |
|-------------|--------|----------|
| Sprint 1 Program | ✅ Ready | [SPRINT_1_PROGRAM.md](./SPRINT_1_PROGRAM.md) |
| Sprint Packet | ✅ Ready | [sprint-packet/SPRINT_PACKET.md](./sprint-packet/SPRINT_PACKET.md) |
| FE Task Breakdown | ✅ Ready | [sprint-packet/FE_TASKS.md](./sprint-packet/FE_TASKS.md) |
| BE Task Breakdown | ✅ Ready | [sprint-packet/BE_TASKS.md](./sprint-packet/BE_TASKS.md) |

---

## Sprint 1 Schedule

| Week | Days | Focus | Deliverables |
|------|------|-------|--------------|
| Week 5 | 1 | Sprint Planning | Team committed, tasks assigned |
| Week 5 | 2-3 | Foundation | App shells, auth config |
| Week 5 | 4-5 | Core Flow | Primary journey, persistence |
| Week 6 | 6-7 | Integration | Real API, error handling |
| Week 6 | 8-9 | Testing | Unit, integration, E2E |
| Week 6 | 10 | Demo | Sprint demo + retrospective |

---

## Key Prompts

| ID | Name | Purpose |
|----|------|---------|
| P0 | Plan Only | Plan before implementing |
| P1 | Feature Scaffold | Scaffold new components |
| P2 | Tests-First | Write tests before/with code |
| P6 | Repository | Create data access layer |
| P7 | Service Layer | Create business logic |
| P8 | Controller | Create REST endpoints |
| P9 | Route Scaffold | Create React Router routes |
| P21 | Contract Validation | Validate API compliance |
| P22 | Mock Handler | Generate MSW handlers |

---

## Sprint Packet (MANDATORY)

Every sprint must start with an approved Sprint Packet:

| Section | Content |
|---------|---------|
| Goal | What success looks like |
| Definition of Done | Specific completion criteria |
| In-Scope Files/Paths | Exactly what can be touched |
| Contract References | Endpoints/schemas to implement |
| Acceptance Criteria | Testable requirements |
| Logging/Audit | Required events to log |
| Security Checklist | Auth, validation, data handling |
| Test Requirements | Unit, integration, e2e expectations |
| Out of Scope | What is explicitly excluded |

---

## Parallel Work Streams

### Frontend Stream (Weeks 5-6)

| Week | Task | Deliverable |
|------|------|-------------|
| 5 | Project structure + routing | App shell with navigation |
| 5 | Layout components | Header, footer, error boundary |
| 5 | First journey UI | Order List, Order Detail |
| 5 | MSW integration | Journey working against mocks |
| 6 | Real API integration | Switch to backend |
| 6 | Error handling | Problem Details display |
| 6 | Component tests | Vitest + RTL tests |
| 6 | E2E skeleton | Playwright basics |

### Backend Stream (Weeks 5-6)

| Week | Task | Deliverable |
|------|------|-------------|
| 5 | Project structure + config | Spring Boot skeleton |
| 5 | Auth implementation | OAuth/OIDC working |
| 5 | Core endpoints | List + detail controllers |
| 5 | Persistence | JPA entities + repository |
| 6 | Service layer | Business logic |
| 6 | Error handling + logging | Problem Details, structured logs |
| 6 | Unit tests | Service layer tests |
| 6 | Integration + contract tests | API validation |

---

## Folder Structure

```
sprint-01/
├── README.md                    ← You are here
├── SPRINT_1_PROGRAM.md          ← 2-week program guide
└── sprint-packet/
    ├── README.md                ← Packet index
    ├── SPRINT_PACKET.md         ← Main sprint packet
    ├── FE_TASKS.md              ← Frontend task breakdown
    └── BE_TASKS.md              ← Backend task breakdown
```

---

## Copilot Usage Focus

| Use Case | Prompt Reference |
|----------|------------------|
| Scaffold modules/components | P1 (Feature Scaffold) |
| Generate from acceptance criteria | P2 (Tests-First) |
| Create React Router routes | P9 (Route Scaffold) |
| Create Spring Boot layers | P6, P7, P8 |
| Validate contract compliance | P21 (Contract Validation) |
| Generate MSW handlers | P22 (Mock Handler) |

---

## Sprint Gate Criteria

**Thin slice demo + automated checks passing + contract compatibility:**

- [x] End-to-end journey demonstrable
- [x] Auth flow working
- [x] Core endpoint(s) implemented
- [x] Persistence connected
- [x] Logging/audit events firing
- [x] Unit tests passing
- [x] Integration tests passing
- [x] Contract tests passing (no drift)
- [x] E2E skeleton working
- [x] No security scan blockers

---

## Standing Rituals (During Sprint)

| Ritual | Frequency | Duration |
|--------|-----------|----------|
| Contract Council | Weekly | 30 min |
| Architecture Sync | 2x weekly | 20 min |
| Daily Dev Block | Daily | 15 min |

---

## Navigation

| Previous | Next |
|----------|------|
| [Week 4: Contract-First](../week-04/README.md) | [Sprint 2: Expand + NFRs](../sprint-02/README.md) |

---

## Copilot Assistance

```
Sprint 1 focuses on proving the full stack works:

Key deliverables:
- FE: App shell + Order List/Detail + E2E skeleton
- BE: Auth + OrderController + OrderService + Repository
- Both: Tests at every layer, logging, error handling

Remember:
- Plan first (P0) before implementing
- One journey end-to-end before expanding
- Tests required for all code
- Contract compliance is mandatory

"No Sprint Packet, No Build"
```
