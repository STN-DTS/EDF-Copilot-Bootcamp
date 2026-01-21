# Lab 3-2 — System Spec Persona

## Goal

Practice defining a user persona for the System Specification, including goals, pain points, and representative user journeys. Learn to create personas that drive architectural decisions.

## Timebox

30 minutes

## Prerequisites

- Reviewed [System Specification Template](../templates/SYSTEM_SPEC.md)
- Reviewed User Journeys from Week 2
- Attended Day 3 System Spec Workshop

## Domain Context

You are defining personas for the **Order Management System**. Create a persona for the **Customer Service Representative (CSR)** role.

---

## Persona Brief

**Role:** Customer Service Representative (CSR)  
**Department:** Customer Support  
**System Access:** Internal web application  
**Primary Function:** Assist customers with order issues

---

## Task

### Step 1: Define Core Persona (10 min)

Complete the persona profile:

```markdown
## Persona: Customer Service Representative

### Demographics
| Attribute | Value |
|-----------|-------|
| Name | [Give a representative name] |
| Role | Customer Service Representative |
| Experience | [Years in role, tech comfort] |
| Tools Used | [Current systems they use] |
| Work Environment | [Office, remote, hybrid] |

### Goals
1. [Primary goal]
2. [Secondary goal]
3. [Efficiency goal]

### Pain Points
1. [Current frustration 1]
2. [Current frustration 2]
3. [Current frustration 3]

### Success Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Average call time | | |
| Resolution rate | | |
| Customer satisfaction | | |
```

### Step 2: Map Representative Journeys (15 min)

Identify 3 journeys this persona performs frequently:

```markdown
### Representative Journeys

#### Journey 1: [Title]
| Step | Action | System Need |
|------|--------|-------------|
| 1 | | |
| 2 | | |
| 3 | | |

**Architectural Implications:**
- [What does the system need to support this?]

#### Journey 2: [Title]
...

#### Journey 3: [Title]
...
```

### Step 3: Identify Architectural Needs (5 min)

Based on the persona and journeys, identify:

```markdown
### Architectural Requirements from Persona

| Need | Requirement | Priority |
|------|-------------|----------|
| Performance | [e.g., Search <500ms] | |
| Data Access | [e.g., Full order history] | |
| Integration | [e.g., Phone system] | |
| Security | [e.g., PII access controls] | |
```

---

## Submission

### Folder Structure

```
/working/architecture/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── PERSONA_CSR.md
└── ARCHITECTURAL_NEEDS.md
```

### README.md Must Include

- Your name and date
- Lab number: **Lab 3-2**
- Summary of persona created
- Key architectural implications
- Any Copilot assistance used

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ Complete Profile | All demographic fields filled |
| ✅ Goals | 3 specific, measurable goals |
| ✅ Pain Points | 3 current frustrations identified |
| ✅ Journeys | 3 representative journeys mapped |
| ✅ Architecture Link | Needs traced to requirements |

---

## Example Persona (Partial)

```markdown
## Persona: Customer Service Representative

### Demographics
| Attribute | Value |
|-----------|-------|
| Name | Sarah Chen |
| Role | Customer Service Representative |
| Experience | 3 years in customer support, comfortable with web apps |
| Tools Used | Salesforce, Zendesk, current order system |
| Work Environment | Hybrid (3 days office, 2 days remote) |

### Goals
1. **Resolve issues quickly:** Find order information within 10 seconds of receiving customer call
2. **Minimize escalations:** Handle 90% of order issues without manager involvement
3. **Reduce call backs:** Ensure customers don't need to call again for same issue

### Pain Points
1. **Slow search:** Current system takes 30+ seconds to find orders
2. **Missing context:** Can't see customer's full history during call
3. **Manual processes:** Cancellations require multiple system updates

### Success Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Average call time | 8 min | 5 min |
| First-call resolution | 65% | 85% |
| Customer satisfaction | 3.8/5 | 4.5/5 |

### Representative Journeys

#### Journey 1: Look Up Order Status
| Step | Action | System Need |
|------|--------|-------------|
| 1 | Receive call, get order number | Search by multiple fields |
| 2 | Pull up order details | Fast retrieval (<2 sec) |
| 3 | Explain status to customer | Clear status display |
| 4 | Check expected delivery | Tracking integration |

**Architectural Implications:**
- Need: Fast order search API (<500ms)
- Need: Order detail API includes tracking info
- Need: Search by order ID, customer email, phone
```

---

## Reflection Questions

1. How does this persona influence API design?
2. What non-functional requirements emerge from this persona?
3. How might this persona's needs conflict with other personas?

---

## Scoring Guide

| Score | Criteria |
|-------|----------|
| ⭐⭐⭐ | Complete profile, measurable goals, 3+ journeys with architecture links |
| ⭐⭐ | Profile complete, goals present, 2-3 journeys |
| ⭐ | Incomplete profile or missing journeys |

---

## Persona Best Practices

### Make Personas Actionable

| ❌ Vague | ✅ Actionable |
|----------|---------------|
| "Wants a fast system" | "Needs order lookup <2 seconds" |
| "Uses the system daily" | "Handles 50+ calls per day" |
| "Tech-savvy" | "Comfortable with web apps, uses keyboard shortcuts" |

### Link to Architecture

Every persona pain point should map to a system requirement:

| Pain Point | System Requirement |
|------------|-------------------|
| "Slow search" | Search API <500ms p95 |
| "Can't see history" | Customer history API |
| "Manual updates" | Automated status sync |

### Consider Conflicts

Different personas may have conflicting needs:

| Conflict | Resolution |
|----------|------------|
| CSR needs full history, Privacy requires minimal data | Role-based access controls |
| Admin needs detailed logs, Performance requires minimal logging | Async logging |
