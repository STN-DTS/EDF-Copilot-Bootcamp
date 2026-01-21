# Lab 3-0 — ADR Drafting with P16

## Goal

Practice using Copilot's P16 prompt to draft an Architecture Decision Record (ADR) for a real architectural decision. Learn the ADR format and how to document trade-offs effectively.

## Timebox

45 minutes

## Prerequisites

- Completed Week 2 (Gate 2 passed)
- Reviewed [ADR Template](../adrs/000-template.md)
- Reviewed existing ADRs (001-004)
- Attended Day 1 Constitution Workshop

## Domain Context

You are architecting the **Order Management System**. The team must decide on a **pagination strategy** for the Order List API. This decision affects both frontend and backend.

---

## The Decision

**Question:** How should we implement pagination for the Order List endpoint?

**Context:**
- Customers may have 10-10,000 orders
- Orders are sorted by date (newest first)
- Mobile and web clients consume the API
- Search/filter must work with pagination
- Eventual consistency is acceptable

**Candidates:**
1. **Offset pagination** — `?page=2&size=20`
2. **Cursor-based pagination** — `?cursor=abc123&size=20`
3. **Keyset pagination** — `?after_id=12345&size=20`

---

## Task

### Step 1: Use P16 Prompt (15 min)

Open Copilot Chat and use the P16 prompt:

```markdown
No secrets, no production data. Use placeholders.

Generate an Architecture Decision Record (ADR) for the following decision:

**Decision:** Pagination strategy for Order List API
**Context:** 
- Order Management System
- Customers have 10-10,000 orders
- Mobile and web clients
- Must support filtering and sorting
- Eventual consistency acceptable

**Options to evaluate:**
1. Offset pagination (?page=2&size=20)
2. Cursor-based pagination (?cursor=abc123&size=20)
3. Keyset pagination (?after_id=12345&size=20)

Use this ADR structure:
- Title
- Status (Proposed)
- Context (problem and forces)
- Decision
- Options Considered (with pros/cons table)
- Consequences (positive, negative, risks)
- Implementation Notes
- References
```

### Step 2: Review and Enhance (15 min)

Copilot will generate an ADR. Review it for:

| Criterion | Question | ✓ |
|-----------|----------|---|
| **Context** | Does it explain WHY we need to decide? | |
| **Forces** | Are the trade-off forces identified? | |
| **Options** | Are all 3 options analyzed fairly? | |
| **Decision** | Is the recommendation clear and justified? | |
| **Consequences** | Are positive AND negative outcomes listed? | |
| **Implementation** | Are there concrete next steps? | |

**Enhance the ADR:**
1. Add at least one consideration Copilot missed
2. Strengthen the justification for the decision
3. Add a "Risks" section if missing
4. Add references to relevant documentation

### Step 3: Document Your Analysis (15 min)

Create your submission with:

1. The Copilot-generated ADR (original)
2. Your enhanced version (with changes highlighted)
3. Reflection on Copilot's ADR quality

---

## Submission

### Folder Structure

```
/working/architecture/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── ADR_PAGINATION_ORIGINAL.md
├── ADR_PAGINATION_ENHANCED.md
└── COPILOT_ANALYSIS.md
```

### README.md Must Include

- Your name and date
- Lab number: **Lab 3-0**
- P16 prompt used (exact text)
- Summary of enhancements made
- Reflection answers

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ P16 Used | Prompt submitted with Copilot response |
| ✅ All Sections | ADR has all required sections |
| ✅ Options Analysis | At least 3 options with pros/cons |
| ✅ Clear Decision | Decision stated with justification |
| ✅ Human Enhancements | At least 2 improvements to Copilot output |
| ✅ Reflection | Answered reflection questions |

---

## Reflection Questions

1. Did Copilot recommend the same option you would have chosen? Why/why not?
2. What context did Copilot miss that you had to add?
3. How would you improve the P16 prompt for better results?

---

## Scoring Guide

| Score | Criteria |
|-------|----------|
| ⭐⭐⭐ | Complete ADR, 3+ options analyzed, clear decision, 3+ enhancements |
| ⭐⭐ | Complete ADR, 3 options, decision stated, 1-2 enhancements |
| ⭐ | Incomplete ADR or missing sections |

---

## Reference ADR Structure

```markdown
# ADR-XXX: [Decision Title]

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-YYY

## Context
[Describe the problem, the forces at play, and why a decision is needed]

## Decision
[State the decision clearly: "We will use..."]

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Option 1 | ... | ... |
| Option 2 | ... | ... |
| Option 3 | ... | ... |

## Consequences

### Positive
- ...

### Negative
- ...

### Risks
- ...

## Implementation Notes
- ...

## References
- ...
```

---

## P16 Prompt Reference

The P16 prompt is designed for ADR generation. Key elements:

1. **Safety prefix:** "No secrets, no production data. Use placeholders."
2. **Decision context:** Problem statement and constraints
3. **Options list:** Specific alternatives to evaluate
4. **Structure request:** Expected ADR sections

### Enhancing P16 Output

After initial generation, use follow-up prompts:

```markdown
What are the downsides of this approach?
```

```markdown
What would happen at 10x our expected load?
```

```markdown
What expertise do we need to implement this?
```
