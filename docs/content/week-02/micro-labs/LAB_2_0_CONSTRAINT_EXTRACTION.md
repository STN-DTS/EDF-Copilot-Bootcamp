# Lab 2-0 — Constraint Extraction with P15

## Goal

Practice using Copilot's P15 prompt to systematically extract constraints from a business requirements document. Learn to categorize constraints and identify validation methods.

## Timebox

30 minutes

## Prerequisites

- Completed Week 1 (Gate 1 passed)
- Reviewed [Constraint Register Template](../templates/CONSTRAINT_REGISTER.md)
- Reviewed [DOMAIN_CONTEXT.md](../../../shared/reference-materials/DOMAIN_CONTEXT.md)

## Domain Context

You are working on the **Order Management System** for a mid-sized retail company. The system handles Orders, Customers, and Items. Review the business requirements excerpt below.

---

## Business Requirements Excerpt

> **ORDER MANAGEMENT REQUIREMENTS v1.0**
>
> **1. Order Processing**
> - Users must be able to create orders with one or more items
> - Orders must be associated with a valid customer
> - Order totals must be calculated automatically
> - Orders can be cancelled within 24 hours if not shipped
>
> **2. Performance**
> - The system must handle 500 concurrent users
> - Order creation must complete within 2 seconds
> - Search results must return within 1 second
>
> **3. Security**
> - All users must authenticate via corporate SSO
> - Order data must be encrypted at rest
> - Access logs must be retained for 7 years
>
> **4. Integration**
> - System must integrate with existing inventory system
> - Payment processing via third-party gateway
> - Email notifications for order status changes
>
> **5. Compliance**
> - PCI-DSS compliance for payment data
> - GDPR compliance for customer data

---

## Task

### Step 1: Use P15 Prompt (10 min)

Open Copilot Chat and use the P15 prompt to extract constraints:

```markdown
No secrets, no production data. Use placeholders.

Based on the business requirements below, extract:
1. Hard constraints (must have)
2. Soft constraints (should have)
3. Assumptions to validate
4. Risks to mitigate

Format as a constraint register table with columns:
ID | Type | Category | Description | Source | Priority | Validation Method

Requirements:
[Paste the Business Requirements Excerpt above]

Categories to use: Functional, Non-Functional, Integration, Regulatory, Technical, Organizational
```

### Step 2: Review and Refine (10 min)

Copilot will generate a constraint register. Review it for:

- **Completeness:** Did it capture all 6 categories?
- **Accuracy:** Are the constraints correctly categorized?
- **Validation Methods:** Are they specific and testable?
- **Missing Items:** What did Copilot miss?

Add at least 2 constraints that Copilot missed.

### Step 3: Document Your Analysis (10 min)

Create your submission with:

1. The Copilot-generated constraint register
2. Your additions/corrections (highlighted)
3. Reflection on what Copilot did well vs. missed

---

## Submission

### Folder Structure

```
/working/constraints/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── CONSTRAINT_REGISTER_DRAFT.md
└── COPILOT_ANALYSIS.md
```

### README.md Must Include

- Your name and date
- Lab number: **Lab 2-0**
- P15 prompt used (exact text)
- What Copilot generated vs. what you added
- Reflection answers

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ P15 Used | Prompt submitted with Copilot response |
| ✅ Categories | At least 4 of 6 categories have constraints |
| ✅ Human Additions | At least 2 constraints you identified that Copilot missed |
| ✅ Validation Methods | Each constraint has a testable validation method |
| ✅ Reflection | Answered reflection questions |

---

## Reflection Questions (2 min)

Answer in your README:

1. What categories did Copilot handle best? Which did it miss?
2. Were the validation methods Copilot suggested actually testable?
3. Would you use P15 differently next time? How?

---

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Copilot generates vague constraints | Ask follow-up: "Make constraint X more specific with measurable criteria" |
| Missing regulatory constraints | Prompt specifically: "What regulatory constraints apply to payment and customer data?" |
| No validation methods | Ask: "For each constraint, suggest a specific test or verification method" |

---

## Reference

- [Constraint Register Template](../templates/CONSTRAINT_REGISTER.md)
- [Week 2 Program](../WEEK_2_PROGRAM.md)
- [P15 Prompt Reference](../../../shared/reference-materials/PROMPT_PACK_V1.md)
