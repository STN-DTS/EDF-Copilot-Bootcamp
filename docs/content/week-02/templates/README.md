# Week 2 Templates

This folder contains templates for Week 2 deliverables. Each template is pre-populated with examples from the Order Management domain to guide completion.

---

## Templates

| Template | Purpose | Status | Day |
|----------|---------|--------|-----|
| [CONSTRAINT_REGISTER.md](CONSTRAINT_REGISTER.md) | Document all project constraints | ✅ Ready | Day 1 |
| [OBJECTIVES_MAP.md](OBJECTIVES_MAP.md) | Prioritize objectives using MoSCoW | ✅ Ready | Day 2 |
| [USER_JOURNEYS.md](USER_JOURNEYS.md) | Document user flows with failure paths | ✅ Ready | Day 3 |
| [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) | Write testable AC in Given/When/Then | ✅ Ready | Day 4 |

---

## Template Overview

### Constraint Register
- **6 constraint categories:** Functional, Non-Functional, Integration, Regulatory, Technical, Organizational
- **Includes:** Assumptions to validate, risks identified
- **Output:** Signed register with validation methods

### Objectives Map
- **MoSCoW prioritization:** Must / Should / Could / Won't
- **Anti-scope documentation:** Explicit exclusions with rationale
- **Output:** Signed objectives with sprint mapping

### User Journeys
- **3-8 key journeys** with full documentation
- **Happy path + failure paths** for each journey
- **Stream mapping:** FE/BE responsibility assignment
- **Output:** Validated journeys with edge cases

### Acceptance Criteria
- **Given/When/Then format** for all criteria
- **Test type mapping:** Unit, Integration, E2E, Security
- **Coverage:** Happy path, validation, auth, errors
- **Output:** Testable criteria with owner assignment

---

## Usage

1. **Copy template** to your working folder or project space
2. **Replace examples** with project-specific content
3. **Conduct workshops** as outlined in [WEEK_2_PROGRAM.md](../WEEK_2_PROGRAM.md)
4. **Review with stakeholders** — business and technical
5. **Collect signatures** for Gate 2 approval
6. **Store in repository** for traceability

---

## Copilot Integration

Each template includes a Copilot prompt to assist with completion. Key prompts:

| Prompt | Template | Use Case |
|--------|----------|----------|
| P15 | Constraint Register | Extract constraints from requirements |
| P15 (variant) | Objectives Map | Categorize features into MoSCoW |
| Custom | User Journeys | Document flows with failure paths |
| Custom | Acceptance Criteria | Convert journeys to Given/When/Then |

---

## Gate 2 Deliverables Checklist

Before proceeding to Week 3, verify:

- [ ] Constraint Register complete (all 6 categories)
- [ ] Objectives Map signed (Must/Should/Could/Won't)
- [ ] 3-8 User Journeys documented with failure paths
- [ ] Acceptance Criteria testable (Given/When/Then)
- [ ] All documents reviewed by business AND tech leads
- [ ] Sign-offs collected on all templates

---

## Related Resources

| Resource | Location |
|----------|----------|
| Week 2 Program | [WEEK_2_PROGRAM.md](../WEEK_2_PROGRAM.md) |
| Week 2 README | [README.md](../README.md) |
| Domain Context | [DOMAIN_CONTEXT.md](../../../shared/reference-materials/DOMAIN_CONTEXT.md) |
| Prompt Pack | [PROMPT_PACK_V1.md](../../../shared/reference-materials/PROMPT_PACK_V1.md) |
