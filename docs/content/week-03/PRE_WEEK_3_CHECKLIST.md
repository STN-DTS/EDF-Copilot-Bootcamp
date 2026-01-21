# Pre-Week 3 Checklist

> Complete these items before Day 1 of Week 3.

**Owner:** Week 3 Lead  
**Due:** Day 0 (Friday before Week 3)

---

## Gate 2 Verification

### Week 2 Deliverables

- [ ] Constraint Register complete and signed
- [ ] All 6 categories documented (Functional, NFR, Integration, Regulatory, Technical, Organizational)
- [ ] Objectives Map with MoSCoW priorities complete
- [ ] User Journeys documented (3-8 journeys with failure paths)
- [ ] Acceptance Criteria in Gherkin format
- [ ] Stakeholder sign-off obtained

### Gate 2 Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead (FE) | | | |
| Tech Lead (BE) | | | |

---

## Stakeholder Preparation

### Identify Participants

| Role | Name | Availability | Workshop Attendance |
|------|------|--------------|---------------------|
| Tech Lead (FE) | | | Days 1-5 (Required) |
| Tech Lead (BE) | | | Days 1-5 (Required) |
| Security Lead | | | Day 4 (MANDATORY) |
| Architect (if different) | | | Days 2-3 |
| QA Lead | | | Day 3, 5 |
| Product Owner | | | Day 3, 5 |

### Schedule Workshops

| Workshop | Day | Duration | Required Attendees |
|----------|-----|----------|-------------------|
| Constitution Kickoff | Day 1 | 3 hours | Tech Leads, Architect |
| ADR Workshop | Day 2 | 4 hours | All technical team |
| System Spec Workshop | Day 3 | 3 hours | Tech Leads, PO, QA |
| Security Architecture | Day 4 | 3 hours | All + Security Lead |
| Gate 3 Review | Day 5 | 2 hours | All Leads |

**Action Items:**
- [ ] Calendar invites sent for all workshops
- [ ] Room/virtual meeting booked
- [ ] Security Lead confirmed for Day 4
- [ ] Backup dates identified for key workshops

---

## Technical Preparation

### Architecture Decision Candidates

Identify 5-8 decisions to create ADRs for during Week 3:

| # | Decision Topic | Owner | Priority | Background Done |
|---|----------------|-------|----------|-----------------|
| 1 | Authentication mechanism | | P1 | [ ] |
| 2 | Database strategy | | P1 | [ ] |
| 3 | API versioning | | P1 | [ ] |
| 4 | Error handling | | P1 | [ ] |
| 5 | Caching strategy | | P2 | [ ] |
| 6 | Logging/telemetry | | P2 | [ ] |
| 7 | Testing strategy | | P2 | [ ] |
| 8 | UI state management | | P2 | [ ] |

**Action Items:**
- [ ] Decision topics identified
- [ ] Owners assigned to each topic
- [ ] Background research started (options identified)

### Templates Ready

- [ ] [ADR template](adrs/000-template.md) reviewed by all participants
- [ ] [Project Constitution template](templates/PROJECT_CONSTITUTION.md) reviewed
- [ ] [System Specification template](templates/SYSTEM_SPEC.md) reviewed
- [ ] Templates distributed to participants

### Tools Ready

- [ ] Diagramming tool available (draw.io, Miro, Lucidchart)
- [ ] Documentation space set up (wiki, markdown repo)
- [ ] ADR folder structure created (`docs/content/week-03/adrs/`)
- [ ] Collaborative editing enabled for all documents

---

## Documentation Gathering

### Input Documents from Week 2

- [ ] Constraint Register (latest version)
- [ ] Objectives Map with MoSCoW priorities
- [ ] User Journeys (all journeys with failure paths)
- [ ] Acceptance Criteria (Gherkin format)

### Reference Materials

- [ ] Existing architecture docs (if any)
- [ ] Organization security policies and standards
- [ ] Organization coding standards
- [ ] Previous ADRs from similar projects
- [ ] Compliance requirements (GDPR, PCI-DSS, etc.)

### External References

- [ ] [ADR examples](adrs/) (001-004) reviewed by participants
- [ ] RFC 7807 Problem Details spec available
- [ ] OWASP guidelines available
- [ ] Relevant framework documentation (Spring Boot, React Router)

---

## Working Folder Structure

### Create Submission Structure

```
/working/architecture/
├── README.md
└── example_lab3/
    ├── LAB_3_0_example/
    │   ├── README.md
    │   ├── ADR_PAGINATION_ORIGINAL.md
    │   └── ADR_PAGINATION_ENHANCED.md
    ├── LAB_3_1_example/
    ├── LAB_3_2_example/
    └── LAB_3_3_example/
```

**Action Items:**
- [ ] Folder structure created
- [ ] Example submissions available (if any)
- [ ] Submission instructions documented in README

---

## Lab Preparation

### Lab 3-0: ADR Drafting

- [ ] P16 prompt documented and tested
- [ ] Pagination decision context prepared
- [ ] Example ADR output reviewed

### Lab 3-1: Constitution Section

- [ ] Error handling patterns documented (current state)
- [ ] FE and BE examples prepared
- [ ] Template section structure ready

### Lab 3-2: System Spec Persona

- [ ] CSR persona brief prepared
- [ ] User journey examples from Week 2 available
- [ ] Architecture implications template ready

### Lab 3-3: ADR Review

- [ ] Flawed ADR-007 sample ready for review
- [ ] P13 review prompt documented
- [ ] Expected issues list prepared (for facilitator)

---

## Pre-Week Communication

### Email to Participants

```
Subject: Week 3 Prep: Architecture + Spec-First Packaging

Hi Team,

Next week we begin Week 3 focused on architecture documentation:
- Project Constitution (technical standards)
- System Specification (single source of truth)
- Architecture Decision Records (ADRs)

YOUR PREPARATION (before Monday):
1. Review ADR template and examples (docs/content/week-03/adrs/)
2. Think about 1-2 architecture decisions you'd like to propose
3. Review the Constitution and System Spec templates
4. Bring Week 2 deliverables (Constraints, Journeys, AC)

SCHEDULE:
- Day 1: Constitution Kickoff (3 hrs) + Lab 3-1
- Day 2: ADR Workshop (4 hrs) + Lab 3-0
- Day 3: System Spec Workshop (3 hrs) + Lab 3-2
- Day 4: Security Architecture (3 hrs)
- Day 5: Gate 3 Review (2 hrs) + Lab 3-3

REQUIRED ATTENDEES:
- Security Lead: Day 4 (MANDATORY)
- Tech Leads: All days
- Product Owner: Day 3, 5

Questions? Reply or Slack me.

[Your Name]
```

**Action Items:**
- [ ] Pre-week email sent
- [ ] Pre-read materials distributed
- [ ] Questions addressed

---

## Risk Mitigation

### Common Week 3 Risks

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Security Lead unavailable Day 4 | Medium | High | Schedule backup day, or async review | Lead |
| No architecture decisions ready | Low | Medium | Use Order Management domain defaults | Lead |
| ADR disagreements stall progress | Medium | Medium | Time-box debates, escalation path defined | Tech Lead |
| Constitution too generic | Medium | Low | Review against instruction files, add examples | Tech Lead |
| System Spec scope creep | High | Medium | Reference Week 2 constraints, PO sign-off | PO |
| Participants not prepared | Medium | Medium | Send reminder, provide pre-read | Lead |

### Escalation Path

| Issue | First Escalation | Final Decision |
|-------|------------------|----------------|
| ADR disagreement | Tech Lead | Architect |
| Scope change request | Product Owner | Sponsor |
| Resource conflict | Week Lead | Program Manager |
| Security concern | Security Lead | CISO |

---

## Day 0 Final Checks

### Morning

- [ ] Templates finalized and accessible
- [ ] Labs tested end-to-end
- [ ] ADR examples reviewed
- [ ] Diagramming tools tested

### Afternoon

- [ ] Participant confirmation received
- [ ] Materials distributed
- [ ] Decision topics assigned to owners
- [ ] Background research complete

### End of Day

- [ ] Team standup: "Ready for Week 3?"
- [ ] Any blockers escalated
- [ ] Final reminder email sent

---

## Ready State Confirmation

**Week 3 is ready to begin when:**

- [ ] Gate 2 passed (all deliverables complete with sign-off)
- [ ] All workshops scheduled with confirmed attendees
- [ ] Security Lead confirmed for Day 4
- [ ] Templates accessible to all participants
- [ ] ADR decision topics identified (5-8 topics)
- [ ] Input documents gathered from Week 2
- [ ] Working folder structure created
- [ ] Pre-week communication sent

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Week 3 Lead | | | |
| Tech Lead (FE) | | | |
| Tech Lead (BE) | | | |
| Product Owner | | | |
