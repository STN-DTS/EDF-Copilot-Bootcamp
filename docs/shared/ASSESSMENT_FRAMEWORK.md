# Assessment Framework

> **This document defines the competency-based assessment model, skill verification criteria, portfolio requirements, and certification standards for the AI-Assisted Development Bootcamp.**

**Last Updated:** January 27, 2026  
**Maintainer:** Bootcamp Lead  

---

## Table of Contents

1. [Overview](#overview)
2. [Skill Competency Levels](#skill-competency-levels)
3. [Week 1 — AI Enablement Skills](#week-1--ai-enablement-skills)
4. [Week 2 — Constraint Register Skills](#week-2--constraint-register-skills)
5. [Week 3 — Spec-First Packaging Skills](#week-3--spec-first-packaging-skills)
6. [Week 4 — Contract-First Skills](#week-4--contract-first-skills)
7. [Sprint Assessment Criteria](#sprint-assessment-criteria)
8. [Portfolio Requirements](#portfolio-requirements)
9. [Facilitator Assessment Guide](#facilitator-assessment-guide)
10. [Certification Criteria](#certification-criteria)
11. [Self-Assessment Checklist](#self-assessment-checklist)
12. [Rubric Quick Reference](#rubric-quick-reference)

---

## Overview

This bootcamp uses a **competency-based assessment model** where participants demonstrate skills through practical application rather than traditional testing. Assessment focuses on:

- **Observable behaviors** — What participants do, not just what they know
- **Cumulative evidence** — Building a portfolio of work products
- **Progressive mastery** — Skills deepen across weeks and sprints
- **Team contribution** — Individual work that supports team success

### Assessment Philosophy

| Principle | Description |
|-----------|-------------|
| **Evidence-based** | Assessment based on artifacts, not opinions |
| **Transparent** | Criteria shared upfront, no surprises |
| **Formative** | Feedback given throughout, not just at end |
| **Practical** | Skills demonstrated in realistic contexts |

---

## Skill Competency Levels

All skills are measured on a four-level competency scale:

| Level | Name | Description | Evidence Required |
|-------|------|-------------|-------------------|
| **L1** | Awareness | Understands concepts, can explain purpose | Can discuss the skill, recognizes when to use it |
| **L2** | Application | Can apply skill with guidance | Successfully uses skill in labs with support |
| **L3** | Proficiency | Applies skill independently and consistently | Independently applies skill in sprint work |
| **L4** | Mastery | Teaches others, improves team practice | Mentors peers, identifies improvements |

### Level Indicators

**L1 — Awareness:**
- Answers "what" and "why" questions correctly
- Recognizes appropriate use cases
- Can follow documented procedures

**L2 — Application:**
- Completes supervised exercises successfully
- Asks clarifying questions appropriately
- Produces work that meets basic criteria

**L3 — Proficiency:**
- Works independently without guidance
- Produces high-quality deliverables consistently
- Adapts approach to new situations

**L4 — Mastery:**
- Helps peers troubleshoot issues
- Suggests process improvements
- Creates reusable patterns/examples

---

## Week 1 — AI Enablement Skills

**Gate 1 Objective:** Move from "AI curiosity" to "safe, consistent team practice."

### Skills Matrix

| Skill ID | Skill | L1 Target | L2 Target | L3 Target | L4 Target |
|----------|-------|-----------|-----------|-----------|-----------|
| W1-S1 | Plan-First Discipline | Day 1 | Day 3 | Day 5 | Sprint 1 |
| W1-S2 | Copilot Chat Usage | Day 1 | Day 2 | Day 4 | Sprint 1 |
| W1-S3 | Prompt Engineering | Day 2 | Day 3 | Day 5 | Sprint 2 |
| W1-S4 | Security/Safety Awareness | Day 1 | Day 2 | Day 3 | Week 3 |
| W1-S5 | Code Review with AI | Day 3 | Day 4 | Day 5 | Sprint 1 |
| W1-S6 | TDD with Copilot | Day 3 | Day 4 | Day 5 | Sprint 2 |

### Week 1 Gate Criteria

**Minimum for Gate 1 Pass:**
- [ ] Labs 0-6 completed with passing submissions
- [ ] All skills at minimum L2
- [ ] W1-S4 (Security/Safety) at L3
- [ ] PR submissions follow template
- [ ] Build and tests pass on all submissions

**Evidence Required:**
- 7 lab submissions in `/working/` folder
- README.md with reflection in each submission
- PLAN.md files (Labs 1+)
- "Copilot vs Human" notes in PR

---

## Week 2 — Constraint Register Skills

**Gate 2 Objective:** Document engineering-readable requirements before implementation.

### Skills Matrix

| Skill ID | Skill | L1 Target | L2 Target | L3 Target | L4 Target |
|----------|-------|-----------|-----------|-----------|-----------|
| W2-S1 | Constraint Extraction (P15) | Day 1 | Day 2 | Day 4 | Sprint 1 |
| W2-S2 | MoSCoW Prioritization | Day 2 | Day 3 | Day 4 | Sprint 2 |
| W2-S3 | User Journey Mapping | Day 3 | Day 4 | Day 5 | Sprint 1 |
| W2-S4 | Acceptance Criteria Writing | Day 4 | Day 5 | Sprint 1 | Sprint 2 |
| W2-S5 | @workspace Exploration (P12) | Day 1 | Day 2 | Day 4 | Sprint 1 |
| W2-S6 | Stakeholder Communication | Day 2 | Day 3 | Day 5 | Sprint 3 |

### Week 2 Gate Criteria

**Minimum for Gate 2 Pass:**
- [ ] Constraint Register complete (all 6 categories)
- [ ] Objectives Map with Must/Should/Could/Won't
- [ ] 3-8 User Journeys with failure paths
- [ ] Acceptance Criteria in Given/When/Then format
- [ ] All skills at minimum L2
- [ ] Micro-labs 2-0 through 2-3 completed

**Evidence Required:**
- Signed Constraint Register
- Objectives Map document
- User Journey documentation
- Acceptance Criteria document
- Stakeholder sign-off

---

## Week 3 — Spec-First Packaging Skills

**Gate 3 Objective:** Produce the "spec spine" that both FE and BE teams reference.

### Skills Matrix

| Skill ID | Skill | L1 Target | L2 Target | L3 Target | L4 Target |
|----------|-------|-----------|-----------|-----------|-----------|
| W3-S1 | ADR Writing (P16) | Day 2 | Day 3 | Day 4 | Sprint 2 |
| W3-S2 | Constitution Drafting | Day 1 | Day 2 | Day 4 | Sprint 2 |
| W3-S3 | System Specification | Day 3 | Day 4 | Day 5 | Sprint 1 |
| W3-S4 | Code Review vs Constitution (P13) | Day 3 | Day 4 | Day 5 | Sprint 1 |
| W3-S5 | Architecture Decision-Making | Day 2 | Day 4 | Sprint 1 | Sprint 3 |
| W3-S6 | Cross-Team Alignment | Day 3 | Day 4 | Sprint 1 | Sprint 2 |

### Week 3 Gate Criteria

**Minimum for Gate 3 Pass:**
- [ ] Project Constitution v1 approved
- [ ] System Spec v1 complete
- [ ] ADR set (minimum 4 key decisions)
- [ ] All skills at minimum L2
- [ ] Architecture sign-off obtained
- [ ] Micro-labs 3-0 through 3-3 completed

**Evidence Required:**
- PROJECT_CONSTITUTION.md
- SYSTEM_SPEC.md
- ADR files (001-004 minimum)
- Architecture review notes
- Sign-off documentation

---

## Week 4 — Contract-First Skills

**Gate 4 Objective:** Define API contracts before implementation, enable parallel work.

### Skills Matrix

| Skill ID | Skill | L1 Target | L2 Target | L3 Target | L4 Target |
|----------|-------|-----------|-----------|-----------|-----------|
| W4-S1 | OpenAPI Generation (P17) | Day 2 | Day 3 | Day 4 | Sprint 1 |
| W4-S2 | Domain Glossary Creation | Day 1 | Day 2 | Day 3 | Sprint 1 |
| W4-S3 | Mock Handler Generation (P22) | Day 3 | Day 4 | Sprint 1 | Sprint 2 |
| W4-S4 | Contract Validation (P21) | Day 4 | Day 5 | Sprint 1 | Sprint 2 |
| W4-S5 | Test Strategy Definition | Day 3 | Day 4 | Sprint 1 | Sprint 2 |
| W4-S6 | Sprint Packet Preparation | Day 4 | Day 5 | Sprint 1 | Sprint 2 |

### Week 4 Gate Criteria

**Minimum for Gate 4 Pass:**
- [ ] OpenAPI Contract v1 locked and signed
- [ ] Domain Glossary v1 complete
- [ ] Mock server operational
- [ ] Test strategy documented
- [ ] Sprint 1 Packet approved
- [ ] All skills at minimum L2
- [ ] Micro-labs 4-0 through 4-3 completed

**Evidence Required:**
- openapi.yaml (locked)
- DOMAIN_GLOSSARY.md
- MOCK_STRATEGY.md
- TEST_STRATEGY.md
- Sprint Packet with sign-off

---

## Sprint Assessment Criteria

### Sprint 1 — Thin Vertical Slice (Weeks 5-6)

**Objective:** Prove end-to-end pipeline works.

| Criteria | FE Evidence | BE Evidence | Weight |
|----------|-------------|-------------|--------|
| **Pipeline Works** | UI renders, API calls succeed | Auth + endpoint + persistence | 30% |
| **Code Quality** | Components follow patterns | Layered architecture | 20% |
| **Testing** | Unit + integration tests | Unit + contract tests | 20% |
| **Documentation** | PR notes, README | API docs, PR notes | 15% |
| **Collaboration** | MSW → real API transition | Contract compliance | 15% |

**Sprint 1 Gate Criteria:**
- [ ] Demo completed successfully
- [ ] All acceptance criteria met
- [ ] Tests pass (≥70% coverage)
- [ ] Contract validation passes
- [ ] No critical bugs

---

### Sprint 2 — Expand + Basic NFRs (Weeks 7-8)

**Objective:** Add breadth while hardening quality.

| Criteria | FE Evidence | BE Evidence | Weight |
|----------|-------------|-------------|--------|
| **Feature Expansion** | 3 additional journeys | Expanded endpoints | 25% |
| **Accessibility** | WCAG 2.1 AA audit passes | N/A | 15% |
| **Performance** | <500ms perceived load | <500ms API p95 | 20% |
| **State Handling** | Empty/error/loading states | Rate limiting | 15% |
| **Testing** | Component + E2E tests | Integration + contract tests | 25% |

**Sprint 2 Gate Criteria:**
- [ ] Demo completed with expanded features
- [ ] Accessibility audit passes
- [ ] Performance benchmarks met
- [ ] Security scan clean
- [ ] NFR checklist verified

---

### Sprint 3 — Harden + Security (Weeks 9-10)

**Objective:** Security hardening and edge case handling.

| Criteria | FE Evidence | BE Evidence | Weight |
|----------|-------------|-------------|--------|
| **Authentication** | Token refresh, secure storage | Token validation, session mgmt | 25% |
| **Authorization** | Permission gates | @PreAuthorize, ownership | 25% |
| **Input Validation** | XSS prevention | Sanitization, validators | 20% |
| **Audit Logging** | Key events logged | All mutations logged | 15% |
| **Security Testing** | XSS/CSRF tests | OWASP verification | 15% |

**Sprint 3 Gate Criteria:**
- [ ] OWASP Top 10 checklist complete (10/10)
- [ ] Security demo completed
- [ ] No high/critical vulnerabilities
- [ ] 100% mutation audit coverage
- [ ] Security tests pass (≥80% coverage)

---

### Sprint 4 — Polish + Ship (Weeks 11-12)

**Objective:** Production readiness and deployment.

| Criteria | FE Evidence | BE Evidence | Weight |
|----------|-------------|-------------|--------|
| **Performance** | Bundle <200KB, Lighthouse >90 | Query optimized, caching | 25% |
| **Accessibility** | WCAG 2.1 AA verified | API accessibility | 15% |
| **Documentation** | User guide, component docs | API docs, runbooks | 20% |
| **Monitoring** | FE observability | Prometheus + Grafana | 20% |
| **Deployment** | Staging verified | Staging + smoke tests | 20% |

**Sprint 4 Gate Criteria (Gate 5 — Ship-Ready):**
- [ ] Performance benchmarks met
- [ ] WCAG 2.1 AA compliance verified
- [ ] Documentation complete (100%)
- [ ] Monitoring active
- [ ] Staging deployment successful
- [ ] Stakeholder sign-off obtained

---

## Portfolio Requirements

Participants must collect evidence throughout the bootcamp to demonstrate competency.

### Required Portfolio Artifacts

| Phase | Artifact | Source | Purpose |
|-------|----------|--------|---------|
| **Week 1** | Lab submissions (0-6) | `/working/` folder | AI enablement skills |
| **Week 1** | PLAN.md files | Lab submissions | Plan-first discipline |
| **Week 2** | Constraint Register | Team deliverable | Requirements skills |
| **Week 2** | User Journey contribution | Team deliverable | Analysis skills |
| **Week 3** | ADR contribution | ADR files | Decision-making skills |
| **Week 3** | Constitution section | Team deliverable | Standards skills |
| **Week 4** | OpenAPI contribution | Contract files | Contract-first skills |
| **Week 4** | Mock handler | MSW handlers | Development skills |
| **Sprints** | PR contributions | GitHub PRs | Implementation skills |
| **Sprints** | Code reviews | GitHub reviews | Review skills |

### Portfolio Quality Criteria

**Each artifact should demonstrate:**

1. **Plan-First Approach** — Evidence of planning before implementation
2. **AI-Assisted Workflow** — Appropriate use of Copilot
3. **Quality Focus** — Tests, documentation, standards compliance
4. **Collaboration** — Team contribution, review participation
5. **Continuous Improvement** — Reflection, learning notes

### Portfolio Presentation

At bootcamp completion, participants should be able to:

- Navigate their portfolio with clear organization
- Explain decisions and trade-offs made
- Demonstrate progression from Week 1 to Sprint 4
- Identify key learnings and growth areas

---

## Facilitator Assessment Guide

### Daily Observation

| Behavior | What to Look For | Recording |
|----------|------------------|-----------|
| **Prompt Usage** | P0 before coding? Appropriate prompt selection? | Daily notes |
| **Safety Practices** | No secrets, placeholders used? | Immediate feedback |
| **Collaboration** | Helping peers? Asking questions? | Weekly summary |
| **Quality** | Tests included? PR template followed? | PR review |

### Weekly Assessment Touchpoints

**Monday:** Review prior week's submissions, note skill gaps  
**Wednesday:** Mid-week check-in, provide formative feedback  
**Friday:** Gate readiness assessment, skill level updates

### Assessment Documentation

For each participant, maintain:

```markdown
## Participant: [Name]

### Week 1 Skills
| Skill | Mon | Wed | Fri | Notes |
|-------|-----|-----|-----|-------|
| W1-S1 | L1 | L2 | L2 | Strong plan-first |
| W1-S2 | L1 | L1 | L2 | Needs more practice |
...

### Labs Completed
- [ ] Lab 0: 
- [ ] Lab 1: 
...

### Observations
- [Date]: [Observation]
```

### Feedback Guidelines

**Effective Feedback Is:**
- **Specific** — Reference exact artifacts or behaviors
- **Timely** — Given within 24 hours when possible
- **Actionable** — Clear next steps for improvement
- **Balanced** — Acknowledge strengths, identify gaps

**Example Feedback:**
> "Your Lab 2 submission shows strong plan-first discipline (PLAN.md was comprehensive). The tests covered the happy path well. To reach L3 on W1-S6 (TDD), consider adding edge case tests before implementation in Lab 3."

---

## Certification Criteria

### Bootcamp Completion Certificate

**Requirements:**

| Category | Minimum Requirement |
|----------|---------------------|
| **Week Gates** | All 4 gates passed (Gates 1-4) |
| **Sprint Gates** | Sprint demos completed, Gate 5 passed |
| **Skill Levels** | 80% of skills at L2+, 50% at L3+ |
| **Portfolio** | All required artifacts collected |
| **Attendance** | ≥90% session attendance |
| **Contribution** | Active participation in team deliverables |

### Certificate Levels

| Level | Criteria | Recognition |
|-------|----------|-------------|
| **Participant** | Attended ≥90%, attempted all labs | Certificate of Participation |
| **Practitioner** | All gates passed, 80% L2+ skills | Certificate of Completion |
| **Proficient** | All gates passed, 80% L3+ skills | Certificate with Distinction |
| **Master** | 50% L4 skills, mentored others | Master Practitioner Recognition |

### Certification Evidence

To receive certification, the following must be verified:

1. **Gate Documentation** — Sign-off records for all gates
2. **Lab Submissions** — All labs in `/working/` with passing builds
3. **Portfolio Review** — Artifacts demonstrate claimed skill levels
4. **Peer Feedback** — At least 2 peer endorsements (for L4 claims)
5. **Facilitator Assessment** — Final skill level ratings confirmed

---

## Self-Assessment Checklist

Use this checklist to track your own progress throughout the bootcamp.

### Week 1 Self-Check

- [ ] I can explain why plan-first discipline matters
- [ ] I use P0 prompt before starting any implementation
- [ ] I never put secrets or production data in prompts
- [ ] I can write prompts that get useful Copilot responses
- [ ] I verify and test AI-generated code before committing
- [ ] I include "Copilot vs Human" notes in my PRs
- [ ] Labs 0-6 completed with passing builds

### Week 2 Self-Check

- [ ] I can extract constraints from requirements documents
- [ ] I understand MoSCoW prioritization and can apply it
- [ ] I can map user journeys with failure paths
- [ ] I write acceptance criteria in Given/When/Then format
- [ ] I use @workspace effectively to explore codebases
- [ ] I communicate technical constraints to stakeholders clearly

### Week 3 Self-Check

- [ ] I can draft an ADR with proper structure
- [ ] I understand architecture boundaries and why they matter
- [ ] I can contribute to system specifications
- [ ] I review code against constitution standards
- [ ] I participate in cross-team architecture discussions
- [ ] I document decisions, not just outcomes

### Week 4 Self-Check

- [ ] I can design OpenAPI endpoints with proper schemas
- [ ] I understand domain glossary and canonical definitions
- [ ] I can create MSW handlers from contracts
- [ ] I validate contracts for completeness and consistency
- [ ] I understand test strategy layers and responsibilities
- [ ] I can prepare sprint packet content

### Sprint Self-Check

- [ ] I implement features following contract-first approach
- [ ] My code includes appropriate tests
- [ ] I participate in daily standups meaningfully
- [ ] I complete code reviews within SLA
- [ ] I address feedback constructively
- [ ] I contribute to team demos

---

## Rubric Quick Reference

### Lab Rubric Summary

| Lab | Key Criteria | Pass Threshold |
|-----|--------------|----------------|
| Lab 0 | Environment works, tiny PR submitted | All items checked |
| Lab 1 | Plan submitted BEFORE code | PLAN.md present, no premature code |
| Lab 2 | FE route + BE endpoint, tests included | Both layers work, ≥1 test each |
| Lab 3 | Tests written BEFORE implementation | Commit history shows tests first |
| Lab 4 | No behavior change, all tests pass | Refactor only, tests green |
| Lab 5 | Probes + config + manifests defined | Deployment-ready artifacts |
| Lab 6 | End-to-end feature, reflection complete | FE→BE works, all questions answered |

### Sprint Rubric Summary

| Sprint | Key Criteria | Pass Threshold |
|--------|--------------|----------------|
| Sprint 1 | Pipeline works E2E | Auth→Core→Persist→UI functional |
| Sprint 2 | Features + NFRs | 3 journeys, accessibility, performance |
| Sprint 3 | Security hardened | OWASP 10/10, no critical vulns |
| Sprint 4 | Ship-ready | Benchmarks met, docs complete, deployed |

### Skill Level Quick Reference

| Level | Quick Indicator |
|-------|-----------------|
| L1 | "I can explain it" |
| L2 | "I can do it with help" |
| L3 | "I can do it independently" |
| L4 | "I can teach others and improve the process" |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Lab Rubrics](../content/week-01/LAB_RUBRICS.md) | Detailed lab evaluation criteria |
| [Definition of Done](reference-materials/DEFINITION_OF_DONE.md) | Standard completion criteria |
| [Progress Tracker](../participants/PROGRESS_TRACKER.md) | Individual progress tracking |
| [.MASTER_BOOTCAMP.md](../../.MASTER_BOOTCAMP.md) | Master index for all content |

---

## Version History

| Date | Change | Author |
|------|--------|--------|
| 2026-01-27 | Initial creation | Agent E06 |
