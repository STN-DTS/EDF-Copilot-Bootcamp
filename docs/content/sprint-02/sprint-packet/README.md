# Sprint 2 - Sprint Packet

**Status:** ✅ Complete

This folder contains sprint packet templates and task breakdowns for Sprint 2.

---

## Contents

| File | Purpose | Status |
|------|---------|--------|
| [SPRINT_PACKET.md](./SPRINT_PACKET.md) | Main sprint packet with scope, AC, DoD | ✅ Complete |
| [FE_TASKS.md](./FE_TASKS.md) | Frontend task breakdown with code examples | ✅ Complete |
| [BE_TASKS.md](./BE_TASKS.md) | Backend task breakdown with code examples | ✅ Complete |
| [NFR_CHECKLIST.md](./NFR_CHECKLIST.md) | Non-functional requirements verification | ✅ Complete |

---

## Sprint 2 Focus

In addition to standard packet contents, Sprint 2 emphasizes:

### Feature Expansion
- Create Order journey
- Cancel Order journey
- Filter/Search Orders

### Non-Functional Requirements
- Performance benchmarks (<500ms p95)
- Accessibility compliance (WCAG 2.1 AA)
- Security hardening (input validation, rate limiting)
- Audit completeness (structured logging)

### Quality Hardening
- Test coverage targets (≥70%)
- Error state handling
- Edge case coverage

---

## Task Breakdown Summary

### Frontend Tasks (57 hours estimated)

| Phase | Days | Focus |
|-------|------|-------|
| Create Order | 2-3 | Form, validation, submission |
| Cancel Order | 4 | Dialog, action handler |
| Filter/Search | 5 | Controls, URL state |
| State Patterns | 6 | Empty, error, loading |
| Accessibility | 7 | WCAG audit + fixes |
| Testing | 8-9 | Component + E2E tests |
| Polish | 10 | Demo prep |

### Backend Tasks (57 hours estimated)

| Phase | Days | Focus |
|-------|------|-------|
| Create Order | 2-3 | DTO, validation, endpoint |
| Cancel Order | 4 | Validation, service, endpoint |
| Filter/Search | 5 | Query params, specifications |
| Performance | 6 | Metrics, optimization |
| Rate Limiting | 7 | Throttling configuration |
| Testing | 8-10 | Unit, integration, contract |

---

## Approval

Sprint packet must be approved before work begins.

**Pre-Sprint Approvers:**
- [x] Product Owner
- [x] FE Tech Lead
- [x] BE Tech Lead
- [x] Bootcamp Lead

**Post-Sprint Confirmation:**
- [ ] Demo completed
- [ ] Tests passing (≥70% coverage)
- [ ] NFR baseline met
- [ ] Security scan clean
- [ ] Retro completed

---

## Key References

| Resource | Location |
|----------|----------|
| Sprint 2 Program | [../SPRINT_2_PROGRAM.md](../SPRINT_2_PROGRAM.md) |
| Sprint 1 Patterns | [../../sprint-01/sprint-packet/](../../sprint-01/sprint-packet/) |
| OpenAPI Contract | [../../week-04/contracts/openapi.yaml](../../week-04/contracts/openapi.yaml) |
| Domain Glossary | [../../week-04/templates/DOMAIN_GLOSSARY.md](../../week-04/templates/DOMAIN_GLOSSARY.md) |
| Test Strategy | [../../week-04/templates/TEST_STRATEGY.md](../../week-04/templates/TEST_STRATEGY.md) |

---

## Copilot Assistance

```
Sprint 2 Packet contents:
- SPRINT_PACKET.md: Scope, acceptance criteria, DoD
- FE_TASKS.md: Day-by-day frontend breakdown
- BE_TASKS.md: Day-by-day backend breakdown
- NFR_CHECKLIST.md: Performance, accessibility, security verification

Key rule: "No Sprint Packet, No Build"

Sprint 2 goals:
- 3 new journeys (Create, Cancel, Filter/Search)
- NFR baseline (performance, accessibility, security, audit)
- ≥70% test coverage
- Security scan clean
```
