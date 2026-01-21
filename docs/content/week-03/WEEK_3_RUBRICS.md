# Week 3 Rubrics

> Evaluation criteria for Week 3 deliverables: Constitution, System Spec, and ADRs.

---

## Lab Evaluation Rubrics

### Lab 3-0: ADR Drafting

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **P16 Usage** | Prompt not used correctly | P16 used, response documented | P16 refined with follow-ups |
| **ADR Structure** | Missing sections | All sections present | Enhanced structure with extras |
| **Options Analysis** | <3 options or superficial | 3 options with pros/cons | 4+ options, quantified trade-offs |
| **Decision Justification** | Decision stated only | Decision with rationale | Evidence-based justification |
| **Human Enhancements** | 0-1 enhancements | 2-3 enhancements | 4+ with clear rationale |

**Scoring:**
- ⭐⭐⭐ (3 stars): All criteria at "Exceeds" or "Meets" with 2+ at "Exceeds"
- ⭐⭐ (2 stars): All criteria at "Meets" or better
- ⭐ (1 star): One or more criteria at "Needs Work"

---

### Lab 3-1: Constitution Section

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **Specificity** | Vague standards ("appropriate") | Specific, measurable rules | Enforceable via CI/linting |
| **Coverage** | FE or BE only | FE and BE addressed | Cross-cutting concerns included |
| **Examples** | No examples | 1-2 code examples | Examples + counter-examples |
| **Enforceability** | Cannot verify compliance | Can verify in code review | Automated verification possible |
| **Exceptions** | Not addressed | Exceptions documented | Exceptions with justification |

---

### Lab 3-2: System Spec Persona

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **Demographics** | Incomplete profile | All fields filled | Rich context and background |
| **Goals** | <3 or vague goals | 3 specific goals | Measurable goals with metrics |
| **Pain Points** | Not realistic or <3 | 3 relevant pain points | Linked to system requirements |
| **Journeys** | <3 journeys | 3 complete journeys | Journeys with edge cases |
| **Architecture Link** | No connection to architecture | Requirements listed | Traced to specific components |

---

### Lab 3-3: ADR Review

| Criterion | ⭐ Needs Work | ⭐⭐ Meets Expectations | ⭐⭐⭐ Exceeds |
|-----------|--------------|----------------------|---------------|
| **Issues Found** | <4 issues | 6-8 issues identified | 10+ with severity ratings |
| **Actionability** | Vague suggestions | Specific recommendations | Before/after examples |
| **P13 Usage** | Not used or not documented | Used and documented | Compared human vs AI findings |
| **Constructive Tone** | Critical only | Balanced feedback | Encouraging + actionable |
| **Completeness** | Missing sections | Full review report | Executive summary included |

---

## Document Quality Rubrics

### ADR Quality Criteria

| Criterion | ⭐ Insufficient | ⭐⭐ Acceptable | ⭐⭐⭐ Excellent |
|-----------|----------------|----------------|-----------------|
| **Status** | Missing/incorrect | Correct status | With date and author |
| **Context** | <50 words, vague | 50-150 words, clear | Forces identified, data included |
| **Options** | <3 options | 3+ options with table | Quantified comparison |
| **Decision** | Statement only | With rationale | Evidence-based with data |
| **Consequences** | Positive only | Positive + negative | Risks + mitigations included |
| **Implementation** | "TBD" or empty | High-level steps | Detailed tasks with owners |
| **References** | None | Links present | Linked to code/docs/ADRs |

### Minimum Acceptable ADR

An ADR is acceptable when:
- [ ] Status is correct (Proposed, Accepted, etc.)
- [ ] Context explains the problem in 50+ words
- [ ] At least 3 options are analyzed
- [ ] Decision is clearly stated with justification
- [ ] Both positive and negative consequences listed
- [ ] At least high-level implementation steps

---

### Constitution Quality Criteria

| Criterion | ⭐ Insufficient | ⭐⭐ Acceptable | ⭐⭐⭐ Excellent |
|-----------|----------------|----------------|-----------------|
| **Architecture Diagram** | Missing | Present | Component responsibilities included |
| **Code Standards** | Vague ("use best practices") | Specific rules | With examples + automated checks |
| **Testing Strategy** | Not assigned | Layers defined | Coverage targets per layer |
| **Error Handling** | Not documented | Pattern defined | FE + BE with examples |
| **Security Posture** | Missing | Basics covered | Threat model referenced |
| **Branching Strategy** | Missing | Defined | CI/CD integration documented |
| **Definition of Done** | Missing | Checklist exists | Role-specific checklists |

---

### System Spec Quality Criteria

| Criterion | ⭐ Insufficient | ⭐⭐ Acceptable | ⭐⭐⭐ Excellent |
|-----------|----------------|----------------|-----------------|
| **Scope** | Unbounded | In/Out defined | With rationale for exclusions |
| **Personas** | <2 personas | 3-5 personas | With journeys and implications |
| **Business Rules** | Prose only | Numbered list | With examples and enforcement |
| **NFRs** | Missing targets | Targets defined | Measurable + testable |
| **Glossary** | Missing | 10+ terms | With examples |
| **Risks** | Not addressed | Listed | With mitigations and owners |

---

## Gate 3 Readiness Rubric

| Criterion | Required | Evidence |
|-----------|----------|----------|
| **Project Constitution** | Complete with all sections | Tech Lead sign-off |
| **System Specification** | Complete with personas + NFRs | PO sign-off |
| **ADRs** | At least 5 Accepted ADRs | Architecture review |
| **Security Model** | Documented in spec | Security Lead sign-off |
| **Individual Labs** | All 4 labs complete per participant | PR submissions |
| **Cross-Team Review** | FE reviewed BE docs, BE reviewed FE docs | Review comments |

### Gate 3 Checklist

- [ ] Constitution covers all 8 sections
- [ ] System Spec includes 3+ personas with journeys
- [ ] All NFRs have measurable targets
- [ ] Business rules are numbered and traceable
- [ ] ADRs follow template format
- [ ] All ADRs have "Accepted" status with sign-off
- [ ] Security architecture reviewed
- [ ] All labs submitted with passing criteria

---

## Common Deductions

| Issue | Deduction | How to Avoid |
|-------|-----------|--------------|
| ADR missing options analysis | -1 ⭐ | Always include 3+ options with pros/cons |
| Constitution section not enforceable | -1 ⭐ | Add verification method for each rule |
| Persona without journeys | -1 ⭐ | Include 3 representative journeys |
| Review without recommendations | -1 ⭐ | Each issue needs specific action |
| Missing README | -1 ⭐ | Always include README with submission |
| Vague NFR ("system should be fast") | -1 ⭐ | Include specific metrics (p95 <500ms) |
| No sign-off section | -1 ⭐ | Add approval table to documents |

---

## Submission Checklist

### For Labs

```
/working/architecture/{your_name}_{YYYYMMDD_HHMM}/
├── README.md              ✓ Required
├── [Lab deliverables]     ✓ Required
└── COPILOT_ANALYSIS.md    ✓ Required (if Copilot used)
```

### README.md Must Include

- [ ] Your name and date
- [ ] Lab number
- [ ] Copilot prompts used (if any)
- [ ] Summary of work completed
- [ ] Reflection answers

---

## Scoring Summary

| Lab | Max Score | Passing | Criteria |
|-----|-----------|---------|----------|
| Lab 3-0 | ⭐⭐⭐ | ⭐⭐ | ADR complete, 3 options, enhancements |
| Lab 3-1 | ⭐⭐⭐ | ⭐⭐ | Section complete, specific, enforceable |
| Lab 3-2 | ⭐⭐⭐ | ⭐⭐ | Persona complete, 3 journeys, architecture link |
| Lab 3-3 | ⭐⭐⭐ | ⭐⭐ | 6+ issues, actionable, P13 used |
