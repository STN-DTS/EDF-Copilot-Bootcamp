# Week 4 Rubrics

> Evaluation criteria for Week 4: Contract-First API + Mock Strategy

---

## Lab Evaluation Rubrics

### Lab 4-0: OpenAPI Endpoint Design

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **P17 Usage** | Prompt incomplete or not used | P17 used correctly with full context | Refined with follow-ups for improvement |
| **Completeness** | Missing required sections | All sections present (params, body, responses) | Enhanced with extras (headers, security) |
| **Error Responses** | <3 error codes defined | All 5 error codes (400, 401, 403, 404, 409) | Multiple examples per error code |
| **Problem Details** | Not used or incorrect format | RFC 7807 format correctly implemented | With extension fields (traceId, violations) |
| **Examples** | No examples provided | Success example included | Success + all error examples |
| **Schema Refs** | All inline schemas | Uses $ref for components | Reusable, well-organized components |

### Lab 4-1: Glossary Term Definition

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **Field Coverage** | <50% of entity fields | All fields documented | With computed/derived fields |
| **Naming Conventions** | Missing or inconsistent | API/DB/Code names specified | With concrete examples for each |
| **Constraints** | Vague or missing | Specific values (min, max, length) | With validation rules and error codes |
| **Enum Definition** | Incomplete values | All values with descriptions | With valid state transitions |
| **Business Rules** | None documented | 3+ rules documented | 5+ rules with enforcement details |
| **JSON Example** | Invalid or missing | Valid, complete example | Multiple examples (create, update, response) |

### Lab 4-2: MSW Handler Creation

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **P22 Usage** | Prompt incomplete or not used | P22 used correctly | Enhanced output with refinements |
| **MSW Syntax** | Uses rest.* (MSW v1) | Uses http.* (MSW v2) | With typed helpers and utilities |
| **Success Handler** | Missing or broken | Works correctly | With data variations and edge cases |
| **Error Handlers** | <3 error handlers | All 5 error handlers implemented | With scenario switching mechanism |
| **Type Safety** | Any types or untyped | Basic TypeScript types | Full TypeScript with interfaces |
| **Tests** | No tests | 2+ passing tests | Full coverage with edge cases |

### Lab 4-3: Contract Validation

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **Issues Found** | <6 issues identified | 8-10 issues identified | 12+ issues with details |
| **P21/P23 Usage** | Only one prompt used | Both prompts used and documented | Compared outputs, noted differences |
| **Prioritization** | Not prioritized | 3 priority levels used | With effort estimates per issue |
| **Report Quality** | Incomplete sections | All sections filled | Executive summary included |
| **Recommendations** | Vague suggestions | Specific fixes for each issue | With code examples for fixes |
| **Fixed Contract** | Not attempted | Partial fix submitted | Complete working contract |

---

## Document Quality Rubrics

### OpenAPI Contract Quality

| Criterion | ⭐ Insufficient | ⭐⭐ Acceptable | ⭐⭐⭐ Excellent |
|-----------|----------------|----------------|-----------------|
| **Info Section** | Title only | Version + description | Contact + license + servers |
| **Paths** | Missing CRUD operations | All CRUD operations | With search/filter/batch |
| **Parameters** | Inline only, no description | With description | With examples and validation |
| **Request Bodies** | Empty or object-only schema | Schema defined with properties | With validation and examples |
| **Responses** | 200 only | Success + common errors | All status codes with examples |
| **Schemas** | All inline definitions | Uses $ref for components | Reusable + composed schemas |
| **Examples** | None provided | One per schema | Multiple per schema |
| **Security** | Missing entirely | Scheme defined globally | Per-operation security |
| **Tags** | None | Operations grouped | With descriptions |

### Domain Glossary Quality

| Criterion | ⭐ Insufficient | ⭐⭐ Acceptable | ⭐⭐⭐ Excellent |
|-----------|----------------|----------------|-----------------|
| **Entity Coverage** | <50% of entities | All entities documented | With relationships mapped |
| **Field Definitions** | Names only | Types + constraints | With validation rules |
| **Naming Conventions** | Missing | API/DB mapping | All contexts (API/DB/Code) |
| **Enums** | Values only | With descriptions | With state transitions |
| **Business Rules** | None | Listed | With enforcement points |
| **Examples** | None | JSON examples | Multiple examples per entity |

### Mock Strategy Quality

| Criterion | ⭐ Insufficient | ⭐⭐ Acceptable | ⭐⭐⭐ Excellent |
|-----------|----------------|----------------|-----------------|
| **Endpoint Coverage** | <50% endpoints | All endpoints mocked | With all scenarios |
| **Error Handling** | Happy path only | Common errors (404, 500) | All error codes per endpoint |
| **Data Quality** | Static hardcoded strings | Realistic domain data | Generated/randomized data |
| **Scenarios** | No switching | Toggle mechanism exists | UI controls for scenarios |
| **Documentation** | None | Basic setup guide | With examples and troubleshooting |

---

## Gate 4 Readiness Rubric

| Criterion | Required | Evidence | Verified |
|-----------|----------|----------|----------|
| **OpenAPI Contract** | All endpoints, schemas, examples complete | Swagger validation passes | ☐ |
| **Domain Glossary** | All entities documented with fields | Cross-references OpenAPI | ☐ |
| **Mock Handlers** | All endpoints mocked with errors | FE can develop standalone | ☐ |
| **Contract Tests** | Schema validation in CI | Pipeline green | ☐ |
| **Individual Labs** | All 4 labs complete per participant | PR submissions verified | ☐ |
| **FE/BE Alignment** | Both teams reviewed contract | Sign-off meeting held | ☐ |
| **Contract Lock** | No more breaking changes | Ceremony completed | ☐ |

### Gate 4 Checklist

Before proceeding to Sprint 1:

- [ ] OpenAPI contract passes Spectral linting
- [ ] All schemas have examples
- [ ] All error responses use Problem Details
- [ ] MSW handlers match OpenAPI exactly
- [ ] Domain glossary covers all entities
- [ ] Contract Lock ceremony completed
- [ ] Both Tech Leads signed off

---

## Common Deductions

| Issue | Deduction | How to Avoid |
|-------|-----------|--------------|
| No operationId | -1 ⭐ | Always add unique operationId |
| Missing error responses | -1 ⭐ | Add 400, 401, 404, 500 minimum |
| No examples | -1 ⭐ | Add examples to all schemas |
| MSW v1 syntax | -1 ⭐ | Use `http.*` not `rest.*` |
| Incomplete glossary | -1 ⭐ | All fields with types and constraints |
| No tests for handlers | -1 ⭐ | Add at least 2 test cases |
| Hardcoded magic strings | -1 ⭐ | Use fixtures and constants |
| No Problem Details | -1 ⭐ | Use RFC 7807 for all errors |

---

## Scoring Guide

### Individual Lab Score

| Stars | Meaning | Next Steps |
|-------|---------|------------|
| ⭐ | Needs significant improvement | Rework required before proceeding |
| ⭐⭐ | Meets expectations | Ready for next lab |
| ⭐⭐⭐ | Exceeds expectations | Can mentor others |

### Overall Week 4 Assessment

| Score | Meaning | Gate 4 Status |
|-------|---------|---------------|
| All labs ⭐⭐+ | Ready for Sprint 1 | ✅ Pass |
| Any lab ⭐ | Needs remediation | ⚠️ Conditional |
| Multiple labs ⭐ | Significant gaps | ❌ Block |

---

## Feedback Template

```markdown
## Lab Review: [Lab Number]

**Reviewer:** [Name]
**Date:** [Date]

### Rating: ⭐⭐ Meets Expectations

### What Went Well
- [Positive point 1]
- [Positive point 2]

### Areas for Improvement
- [Improvement 1]
- [Improvement 2]

### Specific Recommendations
1. [Specific fix or enhancement]
2. [Specific fix or enhancement]

### Next Steps
- [ ] Address feedback items
- [ ] Proceed to next lab
```
