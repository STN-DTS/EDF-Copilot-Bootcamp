# Pre-Week 4 Checklist

> Complete these items before Day 1 of Week 4.

**Owner:** Week 4 Lead  
**Due:** Day 0 (Friday before Week 4)

---

## Gate 3 Verification

### From Week 3

- [ ] Project Constitution complete and signed
- [ ] All sections reviewed by both Tech Leads
- [ ] System Specification complete
- [ ] Personas and NFRs documented
- [ ] Key ADRs accepted:
  - [ ] ADR-001: Authentication Strategy
  - [ ] ADR-002: API Design (REST vs GraphQL)
  - [ ] ADR-003: Error Handling Strategy
  - [ ] ADR-004: UI State Management
  - [ ] ADR-005: Database Strategy
  - [ ] ADR-006: Logging & Telemetry
- [ ] Gate 3 sign-off obtained

### Gate 3 Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead (FE) | | | |
| Tech Lead (BE) | | | |
| Architect | | | |

---

## Stakeholder Preparation

### Identify Participants

| Role | Name | Availability | Required Days |
|------|------|--------------|---------------|
| Tech Lead (FE) | | | Days 1-5 |
| Tech Lead (BE) | | | Days 1-5 |
| FE Developer 1 | | | Days 2-3 |
| FE Developer 2 | | | Days 2-3 |
| BE Developer 1 | | | Days 2-4 |
| BE Developer 2 | | | Days 2-4 |
| QA Lead | | | Day 4-5 |

### Schedule Workshops

| Workshop | Day | Duration | Attendees | Room/Link |
|----------|-----|----------|-----------|-----------|
| Domain Glossary | Day 1 | 3 hours | All | |
| OpenAPI Design | Day 2 | 4 hours | All | |
| Mock Strategy | Day 3 | 3 hours | FE focus | |
| Contract Testing | Day 4 | 3 hours | BE focus | |
| Contract Lock | Day 5 | 2 hours | All | |

- [ ] Calendar invites sent
- [ ] Room/virtual meeting booked
- [ ] Contract Lock ceremony planned

---

## Technical Preparation

### Tooling Setup

- [ ] OpenAPI editor installed:
  - [ ] Option A: [Stoplight Studio](https://stoplight.io/studio)
  - [ ] Option B: [Swagger Editor](https://editor.swagger.io/)
  - [ ] Option C: VS Code with OpenAPI extension
- [ ] OpenAPI linting configured ([Spectral](https://stoplight.io/open-source/spectral))
- [ ] MSW installed in FE project (`npm install msw --save-dev`)
- [ ] Contract testing framework selected:
  - [ ] Option A: Spring Cloud Contract (BE)
  - [ ] Option B: Pact (FE/BE)
  - [ ] Option C: Schema validation only

### MSW Setup Verification

```bash
# Verify MSW installation
cd [frontend-project-root]
npx msw init public/ --save

# Expected output:
# Service Worker successfully created at public/mockServiceWorker.js
```

**Checklist:**
- [ ] MSW Service Worker generated
- [ ] Browser dev mode integration working
- [ ] Node test mode integration working
- [ ] Sample handler tested

### OpenAPI Tooling Verification

```bash
# Install Spectral for linting
npm install -g @stoplight/spectral-cli

# Test with existing contract
spectral lint docs/content/week-04/contracts/openapi.yaml
```

- [ ] Spectral installed and working
- [ ] VS Code OpenAPI preview working
- [ ] Swagger UI rendering correctly

### Repository Structure

Ensure working folder structure exists:

```
/working/contracts/
├── README.md
├── example_lab4/
│   ├── LAB_4_0_example/
│   │   ├── README.md
│   │   └── cancel-order-endpoint.yaml
│   ├── LAB_4_1_example/
│   │   ├── README.md
│   │   └── GLOSSARY_ORDER.md
│   ├── LAB_4_2_example/
│   │   ├── README.md
│   │   ├── handlers.ts
│   │   └── fixtures.ts
│   └── LAB_4_3_example/
│       ├── README.md
│       └── REVIEW_REPORT.md
```

- [ ] Folder structure created
- [ ] Example submissions available
- [ ] README with instructions

---

## Input Documents

### From Previous Weeks

- [ ] [DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md) reviewed
- [ ] Constraint Register (Week 2) available
- [ ] User Journeys (Week 2) available
- [ ] Acceptance Criteria (Week 2) available
- [ ] Project Constitution (Week 3) signed
- [ ] System Specification (Week 3) complete
- [ ] Relevant ADRs (Week 3) accepted

### API Endpoints to Design

Pre-identify endpoints for the Order Management API:

| Entity | Operation | Endpoint | Priority | Owner |
|--------|-----------|----------|----------|-------|
| Orders | List | GET /api/v1/orders | P1 | |
| Orders | Create | POST /api/v1/orders | P1 | |
| Orders | Get | GET /api/v1/orders/{id} | P1 | |
| Orders | Cancel | POST /api/v1/orders/{id}/cancel | P1 | |
| Customers | Get | GET /api/v1/customers/{id} | P2 | |
| Customers | Update | PATCH /api/v1/customers/{id} | P2 | |
| Items | List | GET /api/v1/items | P2 | |
| Items | Get | GET /api/v1/items/{id} | P2 | |
| Health | Status | GET /health | P1 | |
| Health | Ready | GET /ready | P1 | |

- [ ] Endpoint list confirmed with Tech Leads
- [ ] Priority order agreed
- [ ] Owners assigned

---

## Sprint 1 Preparation

### Sprint Packet Draft

- [ ] Sprint 1 user stories drafted
- [ ] Stories map to contract endpoints
- [ ] Acceptance criteria in Gherkin format
- [ ] Story points estimated (rough)
- [ ] Dependencies identified

### Parallel Work Enablement

Contract Lock enables parallel FE/BE work. Verify readiness:

- [ ] FE team understands mock workflow
- [ ] BE team understands contract test workflow
- [ ] Integration points identified
- [ ] Communication plan for questions established
- [ ] Daily sync scheduled for Sprint 1

---

## Pre-Week Communication

### Email to Participants

```
Subject: Week 4 Prep: Contract-First API + Mock Strategy

Hi Team,

Next week we begin Week 4 — the gateway to Sprint execution.

KEY OUTCOMES:
- Locked API contract (no breaking changes after Friday)
- Domain glossary (shared vocabulary)
- FE mock handlers (develop without BE)
- BE contract tests (validate implementation)

YOUR PREPARATION:
1. Install MSW: `npm install msw --save-dev`
2. Install OpenAPI extension in VS Code
3. Review DOMAIN_CONTEXT.md entities
4. Think about API endpoints you'll need for Sprint 1

SCHEDULE:
- Day 1: Domain Glossary Workshop (3 hrs) + Lab 4-1
- Day 2: OpenAPI Design Workshop (4 hrs) + Lab 4-0
- Day 3: Mock Strategy Workshop (3 hrs) + Lab 4-2
- Day 4: Contract Testing Workshop (3 hrs) + Lab 4-3
- Day 5: Contract Lock Ceremony (2 hrs)

CRITICAL: Friday's Contract Lock is a ceremony. After lock,
no breaking changes without formal approval.

Pre-read materials:
- docs/content/week-04/README.md
- docs/content/week-04/contracts/openapi.yaml
- docs/content/week-04/templates/DOMAIN_GLOSSARY.md

Questions? Reply or Slack me.

[Your Name]
```

- [ ] Pre-week email sent
- [ ] Pre-read materials distributed
- [ ] Questions addressed

---

## Risk Mitigation

### Common Week 4 Risks

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| FE/BE disagree on field names | High | Medium | Use glossary as arbiter | Tech Lead |
| Contract not complete by Day 5 | Medium | High | Time-box discussions, defer non-essential | Lead |
| MSW setup issues | Medium | Medium | Have backup mock approach | FE Lead |
| Scope creep in API | High | Medium | Reference constraint register | PO |
| Missing stakeholders | Low | High | Confirm attendance Day 0 | Lead |
| OpenAPI tooling issues | Medium | Low | Prepare fallback editor | DevOps |

### Contingency Plans

**If Contract not complete by Day 5:**
1. Lock what's agreed (P1 endpoints)
2. Mark TBD endpoints clearly
3. Schedule follow-up for Day 1 of Sprint 1
4. FE mocks only locked endpoints

**If FE/BE can't agree:**
1. Time-box to 15 minutes
2. Escalate to Tech Leads
3. Document decision in ADR
4. Move forward

---

## Day 0 Final Checks

### Morning

- [ ] All templates finalized
- [ ] Labs tested end-to-end
- [ ] OpenAPI tooling verified
- [ ] MSW verified on sample project

### Afternoon

- [ ] Participant confirmation received
- [ ] Materials distributed
- [ ] Contract Lock ceremony planned
- [ ] Room/links confirmed

### End of Day

- [ ] Team standup: "Ready for Week 4?"
- [ ] Any blockers escalated
- [ ] Sign-off from Tech Leads

---

## Ready State Confirmation

**Week 4 is ready to begin when:**

- [ ] Gate 3 passed (all team members)
- [ ] All 5 workshops scheduled with attendees confirmed
- [ ] OpenAPI tooling working for all participants
- [ ] MSW installed and verified in FE project
- [ ] Endpoint list prioritized and agreed
- [ ] Sprint 1 stories drafted
- [ ] Pre-week email sent and acknowledged

---

## Sign-off

| Role | Name | Date | Ready? |
|------|------|------|--------|
| Week 4 Lead | | | ☐ |
| Tech Lead (FE) | | | ☐ |
| Tech Lead (BE) | | | ☐ |
| Product Owner | | | ☐ |

---

**Notes:**

_Use this space to capture any issues or blockers identified during preparation._
