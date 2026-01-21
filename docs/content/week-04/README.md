# Week 4 — Contract-First: API + Domain Model + Mock Strategy

**Objective:** Enable parallel FE/BE sprints without blocking.

**Status:** ✅ Complete

---

## Week 4 Outcomes

By end of week, the team has:
- ✅ OpenAPI contract defining all endpoints
- ✅ Domain glossary with canonical field definitions
- ✅ Mock server strategy for FE development
- ✅ Contract test strategy for BE validation
- ✅ Sprint 1 packet prepared
- ✅ FE and BE can work in parallel

---

## Prerequisites

- [x] Completed [Week 3: Spec-First Packaging](../week-03/README.md)
- [x] Passed Gate 3
- [x] System Spec and ADRs available
- [ ] Complete [Pre-Week 4 Checklist](./PRE_WEEK_4_CHECKLIST.md)

---

## Micro-Labs

| Lab | Focus | Timebox | Day | Copilot Prompt |
|-----|-------|---------|-----|----------------|
| [Lab 4-0](micro-labs/LAB_4_0_OPENAPI_ENDPOINT.md) | OpenAPI endpoint design | 45 min | Day 2 | P17 |
| [Lab 4-1](micro-labs/LAB_4_1_GLOSSARY_TERM.md) | Domain glossary term definition | 30 min | Day 1 | - |
| [Lab 4-2](micro-labs/LAB_4_2_MSW_HANDLER.md) | MSW handler creation | 45 min | Day 3 | P22 |
| [Lab 4-3](micro-labs/LAB_4_3_CONTRACT_VALIDATION.md) | Contract validation & review | 30 min | Day 4 | P21 + P23 |

---

## Deliverables Checklist

| Deliverable | Status | Location |
|-------------|--------|----------|
| Week 4 Program | ✅ Ready | [WEEK_4_PROGRAM.md](./WEEK_4_PROGRAM.md) |
| OpenAPI Contract v1 | ✅ Ready | [contracts/openapi.yaml](./contracts/openapi.yaml) |
| Domain Glossary v1 | ✅ Ready | [templates/DOMAIN_GLOSSARY.md](./templates/DOMAIN_GLOSSARY.md) |
| Mock Strategy | ✅ Ready | [templates/MOCK_STRATEGY.md](./templates/MOCK_STRATEGY.md) |
| Test Strategy | ✅ Ready | [templates/TEST_STRATEGY.md](./templates/TEST_STRATEGY.md) |
| Sprint Packet Template | ✅ Ready | [templates/SPRINT_PACKET_TEMPLATE.md](./templates/SPRINT_PACKET_TEMPLATE.md) |

---

## Week 4 Schedule

| Day | Focus | Deliverable |
|-----|-------|-------------|
| Day 0 | Lead Prep | Tooling setup, pre-read materials |
| Day 1 | Domain Glossary Workshop | DOMAIN_GLOSSARY.md v1 |
| Day 2 | OpenAPI Contract Design | openapi.yaml v1 draft |
| Day 3 | Mock Server & Test Strategy | MOCK_STRATEGY.md, TEST_STRATEGY.md |
| Day 4 | Contract Review & Sprint Packet | Cross-team alignment, Sprint 1 scope |
| Day 5 | Contract Lock Ceremony | Gate 4 review and sign-off |

---

## Key Prompts

| ID | Name | Purpose |
|----|------|---------|
| P17 | OpenAPI Generation | Generate OpenAPI schemas from domain model |
| P21 | Contract Validation | Validate contract completeness and consistency |
| P22 | Mock Handler Generation | Generate MSW handlers from OpenAPI |
| [P23](prompts/P23_CONTRACT_REVIEW.md) | Contract Review | Review contract for production readiness |

---

## Examples

| Example | Description | Use For |
|---------|-------------|---------|
| [Orders List Endpoint](examples/endpoint-orders-list.yaml) | Complete GET /api/v1/orders with pagination | Lab 4-0 reference |
| [Orders Create Endpoint](examples/endpoint-orders-create.yaml) | Complete POST /api/v1/orders with validation | Lab 4-0 reference |
| [MSW Handlers](examples/msw-handlers-example.ts) | Full TypeScript handlers with scenarios | Lab 4-2 reference |

---

## Support Documents

| Document | Purpose |
|----------|---------|
| [WEEK_4_RUBRICS.md](WEEK_4_RUBRICS.md) | Evaluation criteria for labs and deliverables |
| [WEEK_4_FAQ.md](WEEK_4_FAQ.md) | Common questions and troubleshooting |
| [PRE_WEEK_4_CHECKLIST.md](PRE_WEEK_4_CHECKLIST.md) | Preparation checklist before Week 4 |
| [CONTRACT_NEGOTIATION_GUIDE.md](CONTRACT_NEGOTIATION_GUIDE.md) | FE/BE alignment techniques |

---

## Week 4 Activities

### Domain Glossary Workshop (Day 1)

**Create canonical definitions for:**
- Entity names (Order, Customer, Item, etc.)
- Field names and types
- Allowed values / enums
- Business term mappings
- Naming conventions (camelCase for JSON, snake_case for DB)

### API Contract Definition (Day 2)

**OpenAPI Specification includes:**

| Component | Details |
|-----------|---------|
| Endpoints | Paths, methods, parameters |
| Schemas | Request/response bodies |
| Status Codes | Success and error codes |
| Error Model | Problem Details (RFC 7807) |
| Auth | Headers, flows, scopes |
| Examples | Sample requests/responses |

### Mock Server Setup (Day 3)

**Frontend Mock Approach with MSW:**
- Mock Service Worker for browser/Node mocking
- Handlers generated from OpenAPI contract
- Consistent test data fixtures
- Error scenario simulation
- Development toggle mechanisms

**Backend Contract Tests:**
- Schema validation tests
- Response format verification
- Contract drift detection

### Test Strategy Alignment (Day 3)

| Layer | Responsibility | Framework | Target |
|-------|----------------|-----------|--------|
| Unit | Single function/method | JUnit 5 / Vitest | 40% |
| Integration | Component interaction | Spring Boot Test / RTL | 30% |
| Contract | API schema compliance | OpenAPI validation | 20% |
| E2E | Critical user journeys | Playwright | 10% |

### Sprint Packet Preparation (Day 4)

**Sprint 1 Scope Definition:**
- In-scope stories and endpoints
- Out-of-scope items with rationale
- Technical requirements (security, logging, performance)
- Dependencies and risks
- Acceptance criteria in Given/When/Then format

### Contract Lock Ceremony (Day 5)

**Gate 4 formal sign-off:**
- OpenAPI contract reviewed by FE and BE leads
- Domain glossary approved
- Mock server demonstrated working
- Test strategy confirmed
- Sprint 1 packet signed

---

## Folder Structure

```
week-04/
├── README.md                           ← You are here
├── WEEK_4_PROGRAM.md                   ← 5-day program guide
├── WEEK_4_RUBRICS.md                   ← Evaluation criteria
├── WEEK_4_FAQ.md                       ← Common questions
├── PRE_WEEK_4_CHECKLIST.md             ← Preparation checklist
├── CONTRACT_NEGOTIATION_GUIDE.md       ← FE/BE alignment guide
├── micro-labs/
│   ├── LAB_4_0_OPENAPI_ENDPOINT.md     ← OpenAPI design lab
│   ├── LAB_4_1_GLOSSARY_TERM.md        ← Glossary definition lab
│   ├── LAB_4_2_MSW_HANDLER.md          ← MSW handler lab
│   └── LAB_4_3_CONTRACT_VALIDATION.md  ← Contract review lab
├── examples/
│   ├── endpoint-orders-list.yaml       ← GET /orders example
│   ├── endpoint-orders-create.yaml     ← POST /orders example
│   └── msw-handlers-example.ts         ← Complete MSW handlers
├── prompts/
│   └── P23_CONTRACT_REVIEW.md          ← Contract review prompt
├── contracts/
│   ├── README.md                       ← Contract documentation
│   └── openapi.yaml                    ← API contract v1
└── templates/
    ├── README.md                       ← Template index
    ├── DOMAIN_GLOSSARY.md              ← Term definitions
    ├── MOCK_STRATEGY.md                ← FE mocking approach
    ├── TEST_STRATEGY.md                ← Test layer responsibilities
    └── SPRINT_PACKET_TEMPLATE.md       ← Sprint scope template
```

---

## Gate 4 Criteria

**"FE can build in parallel; BE can implement without rewriting":**

- [x] OpenAPI contract complete and validated
- [x] Domain glossary reviewed by both teams
- [x] Mock server approach documented and working
- [x] Contract test approach documented
- [x] Test strategy aligned (unit/integration/e2e split)
- [x] Sprint 1 packet prepared
- [x] Both teams ready to start Sprint 1

---

## Navigation

| Previous | Next |
|----------|------|
| [Week 3: Spec-First Packaging](../week-03/README.md) | [Sprint 1: Thin Vertical Slice](../sprint-01/README.md) |

---

## Copilot Assistance

```
Week 4 focuses on Contract-First Development:
- Use P17 to generate OpenAPI schemas from domain model
- Use P21 to validate contract completeness
- Use P22 to generate MSW mock handlers

Key artifacts:
- OpenAPI 3.1 contract with RFC 7807 errors
- MSW mock server for frontend development
- Test strategy with coverage requirements
- Sprint 1 packet with acceptance criteria
```
