# Lab 3-3 — ADR Review with P13

## Goal

Practice peer reviewing an Architecture Decision Record using Copilot's P13 code review patterns. Learn to provide constructive feedback on architectural decisions.

## Timebox

30 minutes

## Prerequisites

- Completed Lab 3-0 (ADR Drafting)
- Reviewed P13 prompt patterns
- Attended ADR Workshop (Day 2)

## Domain Context

You will review a sample ADR for **Caching Strategy** that intentionally contains issues for you to identify.

---

## ADR for Review

```markdown
# ADR-007: Caching Strategy

## Status
Accepted

## Context
We need caching because the database is slow.

## Decision
We will use Redis for caching.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Redis | Fast, popular | Need to manage |
| Memcached | Simple | Less features |

## Consequences
- Things will be faster
- Need Redis server

## Implementation
Add Redis to docker-compose.
```

---

## Task

### Step 1: Manual Review (10 min)

Review the ADR above and identify issues:

**Review Checklist:**

| Section | Issue Found | Severity |
|---------|-------------|----------|
| Status | Is it correct? Should it be "Accepted"? | |
| Context | Is the problem clearly stated? | |
| Forces | Are trade-offs identified? | |
| Options | Are there enough options? Fair analysis? | |
| Decision | Is justification clear? | |
| Consequences | Are negatives listed? Risks? | |
| Implementation | Are next steps concrete? | |

Document each issue:

| Issue | Section | Problem | Recommendation |
|-------|---------|---------|----------------|
| 1 | Context | Too vague | Explain WHY database is slow, what queries |
| 2 | | | |
| 3 | | | |

### Step 2: Use P13 Pattern for Review (10 min)

Use Copilot to assist with the review:

```markdown
No secrets, no production data. Use placeholders.

Review this Architecture Decision Record for quality:

# ADR-007: Caching Strategy

## Status
Accepted

## Context
We need caching because the database is slow.

## Decision
We will use Redis for caching.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Redis | Fast, popular | Need to manage |
| Memcached | Simple | Less features |

## Consequences
- Things will be faster
- Need Redis server

## Implementation
Add Redis to docker-compose.

---

Analyze:
1. Is the context sufficient to understand the problem?
2. Are all reasonable options considered?
3. Is the decision justified with evidence?
4. Are consequences complete (positive, negative, risks)?
5. Are implementation steps actionable?

For each issue found, provide:
- The problem
- Why it matters
- A specific recommendation
```

Compare Copilot's findings with your manual review.

### Step 3: Write Review Feedback (10 min)

Create a constructive review report:

```markdown
# ADR Review: ADR-007 Caching Strategy

**Reviewer:** [Your Name]
**Date:** [Date]
**Verdict:** 🔴 Needs Revision / 🟡 Minor Changes / 🟢 Ready to Accept

## Summary
[1-2 sentence overall assessment]

## Critical Issues (Must Fix)

### Issue 1: [Title]
**Section:** [Context/Decision/etc.]
**Problem:** [What's wrong]
**Impact:** [Why it matters]
**Recommendation:** [Specific fix]

### Issue 2: ...

## Minor Issues (Should Fix)

### Issue 3: ...

## Questions for Author
1. [Question that needs clarification]
2. [Question about assumptions]

## What's Done Well
- [Positive feedback]
- [Positive feedback]
```

---

## Submission

### Folder Structure

```
/working/architecture/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── REVIEW_ADR_007.md
├── ISSUES_FOUND.md
└── COPILOT_ANALYSIS.md
```

### README.md Must Include

- Your name and date
- Lab number: **Lab 3-3**
- Total issues found (manual vs Copilot)
- Comparison of human vs AI review
- Reflection answers

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ Issues Found | At least 6 issues identified |
| ✅ Severity Rated | Issues marked Critical/Minor |
| ✅ Actionable | Each issue has specific recommendation |
| ✅ P13 Used | Copilot analysis documented |
| ✅ Constructive | Positive feedback included |

---

## Expected Issues in Sample ADR

| Issue | Section | Problem |
|-------|---------|---------|
| 1 | Status | Should be "Proposed" until reviewed |
| 2 | Context | "Database is slow" is too vague |
| 3 | Context | No data on current performance |
| 4 | Options | Only 2 options (need 3+) |
| 5 | Options | Missing local cache option (no infrastructure) |
| 6 | Options | Pros/cons too superficial |
| 7 | Decision | No justification for Redis over Memcached |
| 8 | Consequences | No negative consequences listed |
| 9 | Consequences | No risks identified |
| 10 | Implementation | No cache invalidation strategy |
| 11 | Implementation | No TTL configuration |
| 12 | References | No links to documentation |

---

## Reflection Questions

1. What issues did you find that Copilot missed?
2. What issues did Copilot find that you missed?
3. How would you phrase feedback to not discourage the author?

---

## Scoring Guide

| Score | Criteria |
|-------|----------|
| ⭐⭐⭐ | 8+ issues found, severity rated, constructive feedback, P13 comparison |
| ⭐⭐ | 6-7 issues found, recommendations present |
| ⭐ | <6 issues or no recommendations |

---

## Review Best Practices

### Be Specific

| ❌ Vague | ✅ Specific |
|----------|-------------|
| "Needs more detail" | "Add cache invalidation strategy" |
| "Context is unclear" | "Explain which queries are slow (include current latency)" |
| "Options analysis is weak" | "Add pros/cons for each option: complexity, cost, team expertise" |

### Be Constructive

| ❌ Critical | ✅ Constructive |
|-------------|----------------|
| "This is wrong" | "Consider adding..." |
| "You missed..." | "It would help to include..." |
| "Not enough options" | "What about local caching as a third option?" |

### Ask Questions

When unsure, ask for clarification:
- "What's the expected cache hit ratio?"
- "How will we handle cache invalidation on order updates?"
- "What's the fallback if Redis is unavailable?"

### Acknowledge Effort

Start with positives:
- "Good identification of the need for caching"
- "Clear decision statement"
- "Options table is easy to read"
