# Week 3 — Spec-First Packaging

**Objective:** Produce the "spec spine" that both FE and BE teams reference.

**Status:** ✅ Complete

---

## Week 3 Outcomes

By end of week, the team has:

- ✅ Project Constitution defining technical standards
- ✅ System Spec as single source of truth
- ✅ ADR set for cross-team decisions
- ✅ Stable foundation for parallel implementation

---

## Prerequisites

- [x] Completed [Week 2: Constraint Register](../week-02/README.md)
- [x] Passed Gate 2
- [x] Tech leads available for workshops

---

## Micro-Labs

Hands-on exercises for practicing Week 3 skills:

| Lab                                                   | Focus        | Timebox | Description                            |
| ----------------------------------------------------- | ------------ | ------- | -------------------------------------- |
| [Lab 3-0](micro-labs/LAB_3_0_ADR_DRAFTING.md)         | P16 Prompt   | 45 min  | Draft ADR with Copilot assistance      |
| [Lab 3-1](micro-labs/LAB_3_1_CONSTITUTION_SECTION.md) | Constitution | 30 min  | Write error handling standards section |
| [Lab 3-2](micro-labs/LAB_3_2_SYSTEM_SPEC_PERSONA.md)  | Personas     | 30 min  | Define CSR persona with journeys       |
| [Lab 3-3](micro-labs/LAB_3_3_ADR_REVIEW.md)           | P13 Review   | 30 min  | Peer review ADR with Copilot           |

---

## Deliverables Checklist

| Deliverable              | Status   | Location                                                                 |
| ------------------------ | -------- | ------------------------------------------------------------------------ |
| Week 3 Program           | ✅ Ready | [WEEK_3_PROGRAM.md](./WEEK_3_PROGRAM.md)                                 |
| Project Constitution v1  | ✅ Ready | [templates/PROJECT_CONSTITUTION.md](./templates/PROJECT_CONSTITUTION.md) |
| System Spec v1           | ✅ Ready | [templates/SYSTEM_SPEC.md](./templates/SYSTEM_SPEC.md)                   |
| ADR Template             | ✅ Ready | [adrs/000-template.md](./adrs/000-template.md)                           |
| ADR: Authentication      | ✅ Ready | [adrs/001-authentication.md](./adrs/001-authentication.md)               |
| ADR: Error Handling      | ✅ Ready | [adrs/002-error-handling.md](./adrs/002-error-handling.md)               |
| ADR: API Versioning      | ✅ Ready | [adrs/003-api-versioning.md](./adrs/003-api-versioning.md)               |
| ADR: UI State Management | ✅ Ready | [adrs/004-ui-state-management.md](./adrs/004-ui-state-management.md)     |
| ADR: Database Strategy   | ✅ Ready | [adrs/005-database-strategy.md](./adrs/005-database-strategy.md)         |
| ADR: Logging & Telemetry | ✅ Ready | [adrs/006-logging-telemetry.md](./adrs/006-logging-telemetry.md)         |
| ADR: Caching Strategy    | ✅ Ready | [adrs/007-caching-strategy.md](./adrs/007-caching-strategy.md)           |
| ADR: Testing Strategy    | ✅ Ready | [adrs/008-testing-strategy.md](./adrs/008-testing-strategy.md)           |

---

## Examples

Quality benchmarks for Week 3 deliverables:

| Example                                                          | Description                                   |
| ---------------------------------------------------------------- | --------------------------------------------- |
| [Project Constitution](examples/PROJECT_CONSTITUTION_EXAMPLE.md) | Complete constitution with all sections       |
| [System Specification](examples/SYSTEM_SPEC_EXAMPLE.md)          | Full spec with personas, NFRs, business rules |

---

## Week 3 Schedule

| Day   | Focus                 | Output                                          |
| ----- | --------------------- | ----------------------------------------------- |
| Day 0 | Lead Prep             | Materials ready, schedule confirmed             |
| Day 1 | Project Constitution  | Architecture boundaries, code standards         |
| Day 2 | ADR Workshop          | Key ADRs drafted (auth, errors, versioning, UI) |
| Day 3 | System Specification  | Scope, personas, business rules, NFRs           |
| Day 4 | Security & API Design | Security architecture model, API guidelines     |
| Day 5 | Gate 3 Review         | Architecture sign-off                           |

---

## Key Prompts for Week 3

| Prompt                   | Use Case                               |
| ------------------------ | -------------------------------------- |
| **P16 — ADR Generation** | Generate Architecture Decision Records |
| **P13 — Code Review**    | Review code against constitution       |
| **P0 — Plan First**      | Continue plan-first discipline         |

### P16 — ADR Generation

```markdown
No secrets, no production data. Use placeholders.

Generate an Architecture Decision Record (ADR) for:

**Decision:** [Authentication approach for Order Management API]
**Context:** [Enterprise environment, existing SSO, stateless containers]
**Constraints:** [Must integrate with existing identity provider]

Format:

- Context (problem and forces)
- Decision (what we chose)
- Options Considered (at least 3 options with pros/cons)
- Consequences (positive, negative, risks)
- Implementation notes (code snippets if relevant)
```

---

## Week 3 Activities

### Project Constitution Workshop

**Participants:** Tech Leads  
**Duration:** 2-3 hours

**Constitution Sections:**

| Section                 | Covers                                       |
| ----------------------- | -------------------------------------------- |
| Architecture Boundaries | Layer responsibilities, allowed dependencies |
| Code Standards          | Naming, formatting, documentation            |
| Testing Standards       | Unit/integration/e2e responsibilities        |
| Logging/Telemetry       | What to log, structured logging format       |
| Security Posture        | Auth patterns, data handling                 |
| Accessibility           | WCAG level, testing requirements             |
| Performance             | Response time targets, load expectations     |
| Error Handling          | Error model, user-facing messages            |

### System Spec Drafting

**Contents:**

- Scope statement
- Personas
- User journeys (from Week 2)
- Business rules
- Acceptance criteria (from Week 2)
- Non-functional requirements
- Data classification assumptions

### Decision Log (ADRs)

**Key Decisions to Capture:**

- Authentication approach → [ADR-001](./adrs/001-authentication.md)
- Error model → [ADR-002](./adrs/002-error-handling.md)
- API versioning strategy → [ADR-003](./adrs/003-api-versioning.md)
- UI state management → [ADR-004](./adrs/004-ui-state-management.md)

---

## Folder Structure

```
week-03/
├── README.md                      ← You are here
├── WEEK_3_PROGRAM.md              ← 5-day program schedule
├── WEEK_3_RUBRICS.md              ← Evaluation criteria
├── WEEK_3_FAQ.md                  ← Common questions
├── PRE_WEEK_3_CHECKLIST.md        ← Preparation checklist
├── ARCHITECTURE_WORKSHOP_GUIDE.md ← Workshop facilitation
├── micro-labs/
│   ├── LAB_3_0_ADR_DRAFTING.md    ← ADR with P16
│   ├── LAB_3_1_CONSTITUTION_SECTION.md ← Error handling section
│   ├── LAB_3_2_SYSTEM_SPEC_PERSONA.md  ← CSR persona
│   └── LAB_3_3_ADR_REVIEW.md      ← ADR review with P13
├── examples/
│   ├── PROJECT_CONSTITUTION_EXAMPLE.md ← Full constitution
│   └── SYSTEM_SPEC_EXAMPLE.md     ← Full system spec
├── templates/
│   ├── README.md                  ← Template index
│   ├── PROJECT_CONSTITUTION.md    ← Technical standards
│   └── SYSTEM_SPEC.md             ← System specification
└── adrs/
    ├── 000-template.md            ← ADR template
    ├── 001-authentication.md      ← OAuth 2.0 / OIDC decision
    ├── 002-error-handling.md      ← RFC 7807 Problem Details
    ├── 003-api-versioning.md      ← URL path versioning
    ├── 004-ui-state-management.md ← React Router v7 patterns
    ├── 005-database-strategy.md   ← PostgreSQL 15
    ├── 006-logging-telemetry.md   ← OpenTelemetry
    ├── 007-caching-strategy.md    ← Two-tier caching
    └── 008-testing-strategy.md    ← Testing pyramid
```

---

## Support Documents

| Document                                                         | Purpose                                  |
| ---------------------------------------------------------------- | ---------------------------------------- |
| [WEEK_3_RUBRICS.md](WEEK_3_RUBRICS.md)                           | Grading criteria for labs and Gate 3     |
| [WEEK_3_FAQ.md](WEEK_3_FAQ.md)                                   | Common questions and troubleshooting     |
| [PRE_WEEK_3_CHECKLIST.md](PRE_WEEK_3_CHECKLIST.md)               | Preparation before Week 3 starts         |
| [ARCHITECTURE_WORKSHOP_GUIDE.md](ARCHITECTURE_WORKSHOP_GUIDE.md) | Running effective architecture workshops |

---

## Gate 3 Criteria

**"We have a stable spine; implementation can begin without guessing":**

- [x] Project Constitution approved by tech leads
- [x] System Spec reviewed by business and tech
- [x] Key ADRs documented (auth, errors, API versioning, UI state)
- [x] Both FE and BE leads aligned on patterns
- [x] No open questions blocking implementation

**Gate 3 Sign-off Required From:**

- [ ] Architect
- [ ] Tech Lead (Backend)
- [ ] Tech Lead (Frontend)
- [ ] Security Lead
- [ ] Product Owner

---

## Next: Week 4

After completing Gate 3, proceed to [Week 4: Contract-First](../week-04/README.md)

---

## Navigation

| Previous                         | Home                                         | Next                             |
| -------------------------------- | -------------------------------------------- | -------------------------------- |
| [← Week 2](../week-02/README.md) | [Master Index](../../../.MASTER_BOOTCAMP.md) | [Week 4 →](../week-04/README.md) |
