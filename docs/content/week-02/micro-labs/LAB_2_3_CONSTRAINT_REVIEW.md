# Lab 2-3 — Constraint Review with @workspace

## Goal

Practice peer reviewing constraint artifacts using Copilot's @workspace feature. Learn to identify gaps, inconsistencies, and quality issues in constraint documentation.

## Timebox

30 minutes

## Prerequisites

- Completed Labs 2-0, 2-1, 2-2
- Access to a peer's constraint register (provided or exchanged)
- Familiarity with @workspace queries

## Domain Context

You will review a sample constraint register for quality, completeness, and consistency.

---

## Sample Constraint Register for Review

> This register intentionally contains issues for you to identify.

```markdown
# Constraint Register - Order Management (DRAFT)

## Functional Constraints

| ID | Constraint | Source | Priority | Validation |
|----|------------|--------|----------|------------|
| F-001 | Orders need items | Meeting notes | High | Test it |
| F-002 | Calculate totals | Requirements doc | P1 | Unit test |
| F-003 | Users can cancel orders | PM request | Medium | E2E test |

## Non-Functional Constraints

| ID | Constraint | Source | Priority | Validation |
|----|------------|--------|----------|------------|
| NF-001 | System should be fast | SLA | P1 | Load test |
| NF-002 | 99.9% uptime | Contract | Critical | Monitoring |

## Integration Constraints

| ID | Constraint | Source | Priority | Validation |
|----|------------|--------|----------|------------|
| I-001 | Connect to payment system | Architecture | P1 | Integration test |

## Regulatory Constraints

(None identified)

## Technical Constraints

| ID | Constraint | Source | Priority | Validation |
|----|------------|--------|----------|------------|
| T-001 | Use Java | Team decision | P2 | N/A |

## Organizational Constraints

(To be determined)
```

---

## Task

### Step 1: Manual Review (10 min)

Review the constraint register above and identify issues:

**Issue Categories:**
- **Vagueness:** Constraint is not specific enough
- **Missing Validation:** No testable validation method
- **Priority Inconsistency:** Mixed priority formats (High/P1/Critical)
- **Missing Source:** Source is unclear or missing
- **Category Gaps:** Entire categories empty
- **Orphan Constraints:** Doesn't trace to an objective

Document each issue:

| # | ID | Issue Type | Problem | Recommendation |
|---|-----|------------|---------|----------------|
| 1 | F-001 | Vagueness | "Orders need items" - how many? | "Orders must contain 1-100 items" |
| 2 | F-001 | Missing Validation | "Test it" is not specific | "Unit test: reject orders with 0 items" |
| 3 | NF-001 | Vagueness | "System should be fast" - how fast? | "API response time ≤500ms (p95)" |
| 4 | All | Priority Inconsistency | High/P1/Medium/Critical mixed | Standardize to P1/P2/P3 |
| 5 | R-* | Category Gap | No regulatory constraints | Add GDPR, PCI-DSS requirements |
| 6 | O-* | Category Gap | Organizational "TBD" | Add timeline, team, budget |
| 7 | T-001 | Missing Validation | "N/A" is not acceptable | "Build verification: Java 17+ check" |
| 8 | F-002 | Vagueness | "Calculate totals" - what formula? | "Total = sum(item.price × item.quantity)" |

### Step 2: Use @workspace for Analysis (10 min)

Use Copilot to analyze the constraint register:

```markdown
@workspace Analyze this constraint register for quality issues:

[Paste the constraint register]

Check for:
1. Vague or ambiguous constraints
2. Missing validation methods
3. Inconsistent priority schemes
4. Missing constraint categories
5. Constraints that can't be tested
6. Missing regulatory considerations

Provide specific recommendations for each issue found.
```

Compare Copilot's findings with your manual review:

| Issue | You Found | Copilot Found | Notes |
|-------|-----------|---------------|-------|
| Vague constraints | ✓ | ✓ | Both identified |
| Priority inconsistency | ✓ | ? | Check if Copilot caught this |
| Missing regulatory | ✓ | ? | Compare recommendations |

### Step 3: Write Improvement Recommendations (10 min)

Create a review report with:

1. **Summary:** Overall quality assessment (Red/Yellow/Green)
2. **Critical Issues:** Must fix before Gate 2
3. **Recommendations:** Specific improvements
4. **Good Practices:** What the register does well

---

## Submission

### Folder Structure

```
/working/constraints/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── REVIEW_REPORT.md
├── ISSUES_FOUND.md
└── COPILOT_ANALYSIS.md
```

### REVIEW_REPORT.md Template

```markdown
# Constraint Register Review Report

**Reviewed By:** [Your Name]
**Date:** [Date]
**Register Version:** Draft v1

## Overall Assessment

🟡 **YELLOW** - Needs significant improvement before Gate 2

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Constraints | 7 |
| Vague Constraints | 4 |
| Missing Validations | 3 |
| Empty Categories | 2 |
| Priority Inconsistencies | 4 |

## Critical Issues (Must Fix)

### Issue 1: Vague Performance Constraint
- **ID:** NF-001
- **Current:** "System should be fast"
- **Problem:** Not measurable, no target value
- **Recommendation:** "API response time ≤500ms (p95)"
- **Severity:** 🔴 Critical

### Issue 2: Missing Regulatory Category
- **Current:** "(None identified)"
- **Problem:** Payment and customer data require compliance
- **Recommendation:** Add GDPR, PCI-DSS constraints
- **Severity:** 🔴 Critical

### Issue 3: Inconsistent Priority Format
- **Current:** Mixed (High, P1, Medium, Critical)
- **Problem:** Cannot compare priorities
- **Recommendation:** Standardize to P1/P2/P3
- **Severity:** 🟡 Medium

## Recommendations

1. **Standardize Priorities:** Use P1/P2/P3 format consistently
2. **Add Measurable Criteria:** Replace "fast" with "≤500ms"
3. **Complete All Categories:** Regulatory and Organizational are empty
4. **Improve Validation Methods:** "Test it" is not actionable
5. **Verify Sources:** "Meeting notes" needs date and attendees

## What's Done Well

- ✅ Constraint IDs follow consistent format (F-001, NF-001, etc.)
- ✅ Integration constraints have clear sources
- ✅ Categories are organized in standard structure
- ✅ Basic coverage of functional requirements

## Human vs. Copilot Findings

| Finding | Human | Copilot | Notes |
|---------|-------|---------|-------|
| Vague constraints | ✓ | ✓ | Both identified F-001, NF-001 |
| Priority inconsistency | ✓ | ✓ | Copilot caught mixed formats |
| Missing regulatory | ✓ | ✓ | Copilot suggested GDPR specifically |
| Missing org constraints | ✓ | ✗ | Human caught, Copilot missed |
```

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ Issues Identified | At least 8 issues found |
| ✅ Categories Covered | Issues from at least 4 types |
| ✅ Specific Recommendations | Each issue has actionable fix |
| ✅ @workspace Used | Copilot analysis documented |
| ✅ Report Complete | Summary, issues, recommendations included |

---

## Expected Issues to Find

You should identify at least these issues:

| # | Issue | Type | Severity |
|---|-------|------|----------|
| 1 | "Orders need items" is vague | Vagueness | Medium |
| 2 | "Test it" is not a validation method | Missing Validation | High |
| 3 | "System should be fast" has no metric | Vagueness | Critical |
| 4 | Mixed priority formats | Inconsistency | Medium |
| 5 | No regulatory constraints | Category Gap | Critical |
| 6 | Organizational "TBD" | Category Gap | High |
| 7 | "N/A" validation for T-001 | Missing Validation | Medium |
| 8 | "Calculate totals" lacks formula | Vagueness | Medium |
| 9 | "Meeting notes" needs specifics | Missing Source | Low |
| 10 | F-003 "Users can cancel orders" lacks conditions | Vagueness | Medium |

---

## Reflection Questions

1. What issues did you find that Copilot missed?
2. What issues did Copilot find that you missed?
3. How would you prioritize fixing these issues?
4. What's the most critical issue and why?

---

## Peer Review Protocol (If Doing Live)

If reviewing a real peer's work:

1. **Be Constructive:** Focus on improving, not criticizing
2. **Be Specific:** "Change X to Y" not "This is wrong"
3. **Acknowledge Good:** Highlight what's done well
4. **Prioritize:** Mark issues as Critical/Important/Minor
5. **Discuss:** Talk through disagreements respectfully

---

## Reference

- [Constraint Register Template](../templates/CONSTRAINT_REGISTER.md)
- [Example: Constraint Register](../examples/CONSTRAINT_REGISTER_EXAMPLE.md)
- [Week 2 Rubrics](../WEEK_2_RUBRICS.md)
