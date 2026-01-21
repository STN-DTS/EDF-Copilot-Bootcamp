# Week 2 Rubrics

> Evaluation criteria for Week 2 deliverables and labs.

---

## Lab Evaluation Rubrics

### Lab 2-0: Constraint Extraction

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **P15 Usage** | Prompt not used correctly | P15 used, response documented | P15 refined with follow-ups |
| **Category Coverage** | 1-2 categories | 4-5 categories | All 6 categories |
| **Human Additions** | 0-1 additions | 2-3 additions | 4+ additions with rationale |
| **Validation Methods** | Vague ("test it") | Specific test types | Detailed test scenarios |
| **Reflection** | Missing or superficial | Answered all questions | Insightful analysis |

### Lab 2-1: Journey Mapping

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **Happy Path** | Missing steps | 3-5 complete steps | 5-7 steps with system responses |
| **Failure Paths** | 0-2 failures | 3-5 failures | 6+ with recovery paths |
| **Edge Cases** | None identified | 1-2 edge cases | 3+ with expected behavior |
| **Copilot Review** | Not used | Used, findings noted | Findings incorporated |
| **Format** | Inconsistent | Follows template | Enhanced template |

### Lab 2-2: AC Writing

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **Gherkin Format** | Incorrect syntax | Correct Given/When/Then | Background, tags, scenarios |
| **Happy Path** | Incomplete | 1 complete scenario | Multiple variations |
| **Failure Paths** | 0-2 scenarios | 3-4 scenarios | 5+ with recovery |
| **Testability** | Vague criteria | All criteria testable | Test mapping included |
| **Specificity** | Ambiguous terms | Specific values | Measurable thresholds |

### Lab 2-3: Constraint Review

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **Issues Found** | 1-4 issues | 5-8 issues | 9+ with severity |
| **Issue Categories** | 1-2 types | 3-4 types | All issue types |
| **Recommendations** | Vague suggestions | Specific fixes | Before/after examples |
| **@workspace Usage** | Not used | Used, documented | Compared with manual |
| **Report Quality** | Incomplete | All sections | Executive summary |

---

## Template Quality Rubrics

### Constraint Register

| Criterion | ⭐ Insufficient | ⭐⭐ Acceptable | ⭐⭐⭐ Excellent |
|-----------|----------------|----------------|-----------------|
| **Category Coverage** | 1-3 categories | 4-5 categories | All 6 complete |
| **Constraint Count** | <10 constraints | 10-20 constraints | 20+ constraints |
| **ID Format** | Inconsistent | Consistent (F-001) | Prefix by category |
| **Descriptions** | Vague, incomplete | Clear statements | SMART criteria |
| **Sources** | Missing/unclear | Named sources | Doc + page references |
| **Priorities** | Missing/mixed | Consistent P1/P2/P3 | Justified prioritization |
| **Validation** | "TBD" or missing | Test type specified | Full test scenario |
| **Traceability** | No links | Links to objectives | Full trace matrix |

### User Journey

| Criterion | ⭐ Insufficient | ⭐⭐ Acceptable | ⭐⭐⭐ Excellent |
|-----------|----------------|----------------|-----------------|
| **Actor/Goal** | Missing | Defined | Persona-linked |
| **Preconditions** | Missing | Listed | Verified in tests |
| **Happy Path Steps** | <3 steps | 3-5 steps | 5-7 detailed steps |
| **Failure Paths** | 0-1 paths | 3+ paths | 5+ with recovery |
| **Edge Cases** | None | 1-2 identified | 3+ with behavior |
| **Postconditions** | Missing | Listed | Verified in tests |
| **System Responses** | Missing | Basic | Detailed with data |

### Acceptance Criteria

| Criterion | ⭐ Insufficient | ⭐⭐ Acceptable | ⭐⭐⭐ Excellent |
|-----------|----------------|----------------|-----------------|
| **Gherkin Syntax** | Incorrect | Correct | With tags/backgrounds |
| **Scenario Count** | <3 scenarios | 5-8 scenarios | 10+ comprehensive |
| **Happy Path** | Missing/incomplete | Complete | Variations covered |
| **Failure Scenarios** | <2 | 3-5 | Full error coverage |
| **Specificity** | Vague terms | Specific values | Parameterized |
| **Testability** | Untestable | Mostly testable | All directly testable |
| **Test Mapping** | None | Test types noted | Full test matrix |

---

## Gate 2 Readiness Rubric

| Criterion | Required | Evidence |
|-----------|----------|----------|
| **Constraint Register** | All 6 categories, 15+ constraints | Signed document |
| **Objectives Map** | MoSCoW complete, Won't documented | PO signature |
| **User Journeys** | 3-8 journeys with failure paths | Tech lead review |
| **Acceptance Criteria** | All journeys have AC | QA sign-off |
| **Individual Labs** | All 4 labs complete per participant | PR submissions |
| **Stakeholder Sign-off** | Business + Tech approval | Meeting minutes |

---

## Common Deductions

| Issue | Deduction | How to Avoid |
|-------|-----------|--------------|
| Missing README | -1 ⭐ | Always include README with name, date, lab # |
| No Copilot usage documented | -1 ⭐ | Document prompts and responses |
| Vague constraints | -1 ⭐ | Use measurable criteria |
| No failure paths in journey | -1 ⭐ | Always include 3+ failures |
| AC not in Gherkin format | -1 ⭐ | Use Given/When/Then |
| Missing validation methods | -1 ⭐ | Specify test type for each constraint |
| No human additions | -1 ⭐ | Add 2+ constraints Copilot missed |
| Incomplete reflection | -1 ⭐ | Answer all reflection questions |

---

## Scoring Summary

### Lab Scoring

| Total Stars | Grade | Meaning |
|-------------|-------|---------|
| 12-15 | ⭐⭐⭐ | Exceeds Expectations |
| 8-11 | ⭐⭐ | Meets Expectations |
| 5-7 | ⭐ | Needs Improvement |
| <5 | ❌ | Does Not Meet - Redo Required |

### Gate 2 Pass Criteria

- [ ] All 4 labs at ⭐⭐ or higher
- [ ] Constraint Register at ⭐⭐ or higher
- [ ] At least 3 User Journeys documented
- [ ] All journeys have Acceptance Criteria
- [ ] Stakeholder sign-off obtained

---

## Rubric Application Example

**Scenario:** Participant submits Lab 2-1 with:
- Happy path: 4 steps ✓
- Failure paths: 3 scenarios ✓
- Edge cases: 0 identified ✗
- Copilot used but not documented ✗
- Format follows template ✓

**Score:**
| Criterion | Score |
|-----------|-------|
| Happy Path | ⭐⭐ |
| Failure Paths | ⭐⭐ |
| Edge Cases | ⭐ |
| Copilot Review | ⭐ |
| Format | ⭐⭐ |
| **Total** | **8/15 = ⭐⭐** |

**Feedback:** "Good journey structure. Add edge cases (what about concurrent users? Partial data?). Document Copilot analysis even if brief."
