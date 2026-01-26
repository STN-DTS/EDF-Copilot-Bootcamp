# Week 2 — Constraint Register + Spec Intake

**Objective:** Document all constraints, objectives, and acceptance criteria before implementation.

**Status:** ✅ Content Ready

---

## Week 2 Outcomes

By end of week, the team can:

- ✅ Document functional, non-functional, and integration constraints
- ✅ Define clear objective hierarchy (Must/Should/Could/Won't)
- ✅ Decompose user journeys with failure paths
- ✅ Write engineering-readable acceptance criteria (Given/When/Then)
- ✅ Use Copilot Enterprise features (@workspace, #file, P15)

---

## Prerequisites

- [ ] Completed [Week 1: AI Enablement](../week-01/README.md)
- [ ] Passed Gate 1 (all team members using Copilot safely)
- [ ] Business stakeholders available for workshops
- [ ] All requirements documents gathered

---

## Quick Start

👉 **[Week 2 Program](WEEK_2_PROGRAM.md)** — Full daily schedule and workshop guides

---

## Micro-Labs

Hands-on exercises for practicing Week 2 skills:

| Lab                                                    | Focus      | Timebox | Description                             |
| ------------------------------------------------------ | ---------- | ------- | --------------------------------------- |
| [Lab 2-0](micro-labs/LAB_2_0_CONSTRAINT_EXTRACTION.md) | P15 Prompt | 30 min  | Extract constraints from requirements   |
| [Lab 2-1](micro-labs/LAB_2_1_JOURNEY_MAPPING.md)       | Journeys   | 45 min  | Map Cancel Order with failure paths     |
| [Lab 2-2](micro-labs/LAB_2_2_AC_WRITING.md)            | Gherkin    | 30 min  | Convert journeys to acceptance criteria |
| [Lab 2-3](micro-labs/LAB_2_3_CONSTRAINT_REVIEW.md)     | Review     | 30 min  | Peer review with @workspace             |

---

## Examples

Quality benchmarks for Week 2 deliverables:

| Example                                                             | Description                        |
| ------------------------------------------------------------------- | ---------------------------------- |
| [Constraint Register](examples/CONSTRAINT_REGISTER_EXAMPLE.md)      | 36 constraints across 6 categories |
| [User Journey](examples/USER_JOURNEY_CANCEL_ORDER.md)               | Cancel Order with 6 failure paths  |
| [Acceptance Criteria](examples/ACCEPTANCE_CRITERIA_CANCEL_ORDER.md) | 19 Gherkin scenarios               |

---

## Deliverables Checklist

| Deliverable            | Status   | Location                                                   | Day   |
| ---------------------- | -------- | ---------------------------------------------------------- | ----- |
| Constraint Register    | ✅ Ready | [CONSTRAINT_REGISTER.md](templates/CONSTRAINT_REGISTER.md) | Day 1 |
| Objectives Map         | ✅ Ready | [OBJECTIVES_MAP.md](templates/OBJECTIVES_MAP.md)           | Day 2 |
| User Journeys v1       | ✅ Ready | [USER_JOURNEYS.md](templates/USER_JOURNEYS.md)             | Day 3 |
| Acceptance Criteria v1 | ✅ Ready | [ACCEPTANCE_CRITERIA.md](templates/ACCEPTANCE_CRITERIA.md) | Day 4 |

---

## Week 2 Schedule Overview

| Day   | Focus       | Key Activity                           | Output          |
| ----- | ----------- | -------------------------------------- | --------------- |
| Day 1 | Constraints | Constraint Discovery Workshop          | Draft Register  |
| Day 2 | Objectives  | MoSCoW Prioritization Workshop         | Objectives Map  |
| Day 3 | Journeys    | User Journey Mapping Workshop          | 3-8 Journeys    |
| Day 4 | Criteria    | Acceptance Criteria Workshop           | Testable AC     |
| Day 5 | Gate        | Internal Review + Stakeholder Sign-off | Gate 2 Approval |

📋 See [WEEK_2_PROGRAM.md](WEEK_2_PROGRAM.md) for detailed session guides.

---

## Constraint Categories

| Category           | Examples                                 | Questions to Ask          |
| ------------------ | ---------------------------------------- | ------------------------- |
| **Functional**     | Business rules, validation, workflows    | What must the system DO?  |
| **Non-Functional** | Performance, availability, accessibility | How must it BEHAVE?       |
| **Integration**    | Systems, APIs, authentication            | What must it CONNECT to?  |
| **Regulatory**     | Compliance, privacy, security            | What RULES apply?         |
| **Technical**      | Stack, infrastructure, platform          | What are we BUILDING ON?  |
| **Organizational** | Timeline, team, budget                   | What LIMITS our approach? |

---

## MoSCoW Prioritization

| Level      | Meaning                    | Gate Impact          |
| ---------- | -------------------------- | -------------------- |
| **Must**   | Non-negotiable for go-live | Blocks Gate 5        |
| **Should** | Highly desired             | Impacts quality      |
| **Could**  | Nice to have               | Optional             |
| **Won't**  | Explicitly out of scope    | Prevents scope creep |

> **Key Insight:** "Won't" is as important as "Must" — it creates documented boundaries.

---

## Week 2 Prompts

| Prompt  | Use Case               | When to Use                      |
| ------- | ---------------------- | -------------------------------- |
| **P0**  | Plan-first             | Before any task                  |
| **P12** | @workspace exploration | Understand existing patterns     |
| **P15** | Constraint extraction  | Convert requirements to register |

### P15 — Constraint Extraction (New This Week)

```markdown
No secrets, no production data. Use placeholders.

Based on the business requirements in <document>, extract:

1. Hard constraints (must have)
2. Soft constraints (should have)
3. Assumptions to validate
4. Risks to mitigate

Format as a constraint register table with columns:
ID | Type | Description | Source | Priority | Validation
```

---

## Gate 2 Criteria

**Requirements are "engineering-readable," not just "business-readable":**

- [ ] Constraint Register complete (all 6 categories reviewed)
- [ ] Objectives prioritized (Must/Should/Could/Won't)
- [ ] Anti-scope documented with rationale
- [ ] 3-8 user journeys documented with failure paths
- [ ] Acceptance criteria in Given/When/Then format
- [ ] All AC are testable (can write a test for each)
- [ ] Reviewed by both business and tech leads
- [ ] Sign-off signatures collected

---

## Templates

```
week-02/
├── README.md                    ← You are here
├── WEEK_2_PROGRAM.md            ← Daily schedule + workshop guides
└── templates/
    ├── README.md                ← Template index
    ├── CONSTRAINT_REGISTER.md   ← 6-category constraint template
    ├── OBJECTIVES_MAP.md        ← MoSCoW prioritization template
    ├── USER_JOURNEYS.md         ← Journey documentation template
    └── ACCEPTANCE_CRITERIA.md   ← Given/When/Then AC template
```

---

## Week 2 Copilot Features

| Feature      | Use Case            | Example                                                   |
| ------------ | ------------------- | --------------------------------------------------------- |
| `@workspace` | Query codebase      | `@workspace How do we handle errors?`                     |
| `#file`      | Reference document  | `#file docs/shared/reference-materials/DOMAIN_CONTEXT.md` |
| `P15`        | Extract constraints | Convert requirements to table                             |

---

## Week 2 Resources

| Resource                                                                | Purpose                      |
| ----------------------------------------------------------------------- | ---------------------------- |
| [WEEK_2_PROGRAM.md](WEEK_2_PROGRAM.md)                                  | Daily schedule and workshops |
| [templates/](templates/)                                                | All Week 2 templates         |
| [DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md) | Order Management domain      |
| [PROMPT_PACK_V1.md](../../shared/reference-materials/PROMPT_PACK_V1.md) | Standard prompts             |

---

## Support Documents

| Document                                                         | Purpose                              |
| ---------------------------------------------------------------- | ------------------------------------ |
| [WEEK_2_RUBRICS.md](WEEK_2_RUBRICS.md)                           | Grading criteria for labs and Gate 2 |
| [WEEK_2_FAQ.md](WEEK_2_FAQ.md)                                   | Common questions and troubleshooting |
| [PRE_WEEK_2_CHECKLIST.md](PRE_WEEK_2_CHECKLIST.md)               | Preparation before Week 2 starts     |
| [WORKSHOP_FACILITATION_GUIDE.md](WORKSHOP_FACILITATION_GUIDE.md) | Running effective workshops          |
| [COPILOT_ENTERPRISE_FEATURES.md](COPILOT_ENTERPRISE_FEATURES.md) | @workspace, #file, P15 usage         |

---

## Next: Week 3

After completing Gate 2, proceed to [Week 3: Spec-First Packaging](../week-03/README.md)

Week 3 Focus:

- Architecture Decision Records (ADRs)
- System Specification
- Project Constitution
- Security Architecture
  | Integration | Systems, authentication, data sources |

### Objective Hierarchy Exercise

| Level                  | Description                 |
| ---------------------- | --------------------------- |
| **Primary (Must Win)** | Non-negotiable for go-live  |
| **Secondary**          | Important but can be phased |
| **Anti-Scope**         | Explicitly out of scope     |

### User Journey Decomposition

- 3-8 key journeys identified
- Success paths documented
- Failure paths documented
- Edge cases identified

### Acceptance Criteria Normalization

Format: Given/When/Then or structured bullets

```gherkin
Given [precondition]
When [action]
Then [expected outcome]
```

---

## Templates (To Be Completed)

```
week-02/
├── README.md                    ← You are here
└── templates/
    ├── CONSTRAINT_REGISTER.md   ← Template for constraints
    ├── OBJECTIVES_MAP.md        ← Template for objectives
    ├── USER_JOURNEYS.md         ← Template for journeys
    └── ACCEPTANCE_CRITERIA.md   ← Template for AC format
```

---

## Gate 2 Criteria

**Requirements are "engineering-readable," not just "business-readable":**

- [ ] Constraint Register complete (all categories)
- [ ] Objectives prioritized (primary/secondary/anti-scope)
- [ ] 3-8 user journeys documented with failure paths
- [ ] Acceptance criteria in consistent format
- [ ] Reviewed by both business and tech leads

---

## Next: Week 3

After completing Gate 2, proceed to [Week 3: Spec-First Packaging](../week-03/README.md)

---

## Navigation

| Previous                         | Home                                         | Next                             |
| -------------------------------- | -------------------------------------------- | -------------------------------- |
| [← Week 1](../week-01/README.md) | [Master Index](../../../.MASTER_BOOTCAMP.md) | [Week 3 →](../week-03/README.md) |
