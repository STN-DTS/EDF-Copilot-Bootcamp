# E06_ASSESSMENT_FRAMEWORK — Create Assessment & Certification Framework

## Mission
Create a comprehensive assessment framework document that defines skill verification, portfolio requirements, and completion criteria for the bootcamp.

---

## File ownership (absolute)

**Owned paths:**
- `docs/shared/ASSESSMENT_FRAMEWORK.md` (create new)

**May update (link insertion only):**
- `docs/shared/README.md` — add link to new framework
- `.MASTER_BOOTCAMP.md` — add to reference materials section

**Must NOT edit:**
- Week/sprint content
- Lab files
- FAQs
- Any other content

---

## Recon Gate (mandatory before edits)

Before making any changes:

1. **Read existing rubrics:**
   - `docs/content/week-01/LAB_RUBRICS.md`
   - Any other rubric files in the repo

2. **Read gate criteria in:**
   - Week README files (gate criteria sections)
   - Sprint README files (gate criteria sections)

3. **Read `copilot-remarks.md`** section 3.3 for gap analysis

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create Assessment Framework
Create `docs/shared/ASSESSMENT_FRAMEWORK.md` with this structure:

```markdown
# 📋 Assessment Framework — EDF Copilot Bootcamp

This document defines the assessment criteria, skill verification methods, and completion requirements for the bootcamp.

---

## Overview

The bootcamp uses a **competency-based assessment model**:
- Skills are verified through practical lab work
- Gates ensure readiness before advancing
- Portfolio evidence demonstrates proficiency
- Peer and facilitator review validates quality

---

## Skill Competency Levels

| Level | Description | Evidence Required |
|-------|-------------|-------------------|
| **Awareness** | Can recognize and describe the concept | Quiz or discussion |
| **Application** | Can apply the concept with guidance | Completed lab with assistance |
| **Proficiency** | Can apply independently with quality output | Completed lab meeting rubric |
| **Mastery** | Can teach others and handle edge cases | Capstone + peer mentoring |

---

## Week 1 — AI Enablement Skills

| Skill | Target Level | Assessment Method |
|-------|--------------|-------------------|
| Copilot setup & configuration | Proficiency | Lab 0 completion |
| Plan-first workflow (P0) | Proficiency | Lab 1 plan quality |
| Vertical slice scaffolding | Proficiency | Lab 2 code review |
| TDD with AI assistance | Proficiency | Lab 3 test coverage |
| Safe refactoring | Proficiency | Lab 4 diff review |
| Deployment readiness | Application | Lab 5 manifest review |
| Full-feature implementation | Proficiency | Lab 6 capstone |

### Week 1 Gate Criteria
- [ ] All 7 labs completed with passing builds/tests
- [ ] At least 5 labs meet "Proficiency" on rubric
- [ ] PR reviews show iterative improvement
- [ ] No secrets or production data in any submission

---

## Week 2 — Constraint Register Skills

| Skill | Target Level | Assessment Method |
|-------|--------------|-------------------|
| Constraint extraction | Proficiency | Lab 2-0 output quality |
| User journey mapping | Application | Lab 2-1 diagram review |
| Acceptance criteria writing | Proficiency | Lab 2-2 AC clarity |
| Constraint review | Application | Lab 2-3 peer feedback |

### Week 2 Gate Criteria
- [ ] Constraint register completed
- [ ] At least 3 constraints meet quality bar
- [ ] Peer review completed

---

## Week 3 — Spec-First Packaging Skills

| Skill | Target Level | Assessment Method |
|-------|--------------|-------------------|
| ADR drafting | Proficiency | Lab 3-0 ADR structure |
| Constitution authoring | Application | Lab 3-1 section quality |
| System spec personas | Application | Lab 3-2 persona clarity |
| ADR review process | Proficiency | Lab 3-3 review comments |

### Week 3 Gate Criteria
- [ ] At least 2 ADRs approved
- [ ] Constitution section contributed
- [ ] Peer review participation

---

## Week 4 — Contract-First Skills

| Skill | Target Level | Assessment Method |
|-------|--------------|-------------------|
| OpenAPI endpoint definition | Proficiency | Lab 4-0 spec validity |
| Domain glossary contribution | Application | Lab 4-1 term clarity |
| MSW handler creation | Proficiency | Lab 4-2 mock accuracy |
| Contract validation | Proficiency | Lab 4-3 test coverage |

### Week 4 Gate Criteria
- [ ] OpenAPI spec valid and reviewed
- [ ] Contract tests passing
- [ ] Ready for sprint work

---

## Sprint Assessment Criteria

### Sprint 1 — Foundation
| Criterion | Weight | Evidence |
|-----------|--------|----------|
| Feature completion | 40% | Working code in staging |
| Code quality | 30% | PR review feedback |
| Process adherence | 20% | Plan → PR → Review flow |
| Team collaboration | 10% | Peer feedback |

### Sprint 2 — Core Features
| Criterion | Weight | Evidence |
|-----------|--------|----------|
| Feature completion | 35% | Working code |
| NFR compliance | 25% | Checklist completion |
| Code quality | 25% | PR review |
| Documentation | 15% | Inline docs + README |

### Sprint 3 — Security Hardening
| Criterion | Weight | Evidence |
|-----------|--------|----------|
| Security implementation | 40% | Auth/authz working |
| Vulnerability remediation | 25% | Security scan results |
| Code quality | 20% | PR review |
| Security documentation | 15% | Threat model updates |

### Sprint 4 — Production Ready
| Criterion | Weight | Evidence |
|-----------|--------|----------|
| Production readiness | 35% | Ship-ready checklist |
| Performance | 25% | Benchmark results |
| Documentation | 25% | User guides, runbooks |
| Demo quality | 15% | Final presentation |

---

## Portfolio Requirements

By bootcamp completion, each participant should have:

### Required Artifacts
- [ ] 7 Week 1 lab submissions with passing PRs
- [ ] Constraint register contribution
- [ ] At least 1 approved ADR
- [ ] OpenAPI contract contribution
- [ ] Sprint feature implementations (1 per sprint minimum)
- [ ] Completed progress tracker

### Quality Standards
- All submissions in correct `/working/` folder structure
- All PRs include verification commands
- No secrets or production data
- Copilot usage notes (what AI generated vs human-fixed)

---

## Completion Criteria

### Bootcamp Completion (Certificate Eligible)
- [ ] All week gates passed
- [ ] All sprint gates passed
- [ ] Portfolio complete
- [ ] Final assessment passed
- [ ] Facilitator sign-off

### Distinction Criteria (Optional Recognition)
- Achieved "Mastery" level in 3+ skills
- Contributed to course improvement (PRs, feedback)
- Mentored other participants
- Exceptional capstone/sprint work

---

## Facilitator Assessment Guide

### Rubric Application
1. Review submission against lab rubric criteria
2. Provide specific, actionable feedback
3. Mark proficiency level achieved
4. Identify growth opportunities

### Common Assessment Patterns

| Pattern | Indicates | Action |
|---------|-----------|--------|
| Passing tests but poor code quality | Application level, not Proficiency | Coach on refactoring |
| Great plans but weak execution | Understanding without practice | More hands-on labs |
| Fast completion with errors | Rushing without verification | Reinforce verification habit |
| Slow but high quality | Careful but needs efficiency | Celebrate quality, suggest timeboxing |

### Escalation
- If participant struggles with 3+ consecutive labs: 1:1 coaching session
- If entire cohort struggles with a lab: Curriculum feedback needed
- If security/safety violations: Immediate remediation required

---

## Assessment Tools

### Automated
- CI build/test gates
- Link check validation
- Linting (code and markdown)

### Manual
- PR review (facilitator or peer)
- Rubric scoring
- Portfolio review
- Demo evaluation

---

## Version History

| Date | Change | Author |
|------|--------|--------|
| 2026-01-26 | Initial framework created | Enhancement Pack 04 |
```

### Task 2: Link from docs/shared/README.md
Add a link to the new framework in the shared docs README.

### Task 3: Link from .MASTER_BOOTCAMP.md
Add to the reference materials section.

---

## Output contract (mandatory)

Return:
1. **Plan** (brief, confirm existing rubrics reviewed)
2. **Patch** (unified diff for each file created/modified)
3. **Verification** (confirm links resolve)
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E06_ASSESSMENT_FRAMEWORK_WORKLOG.md`

---

## Success criteria
- [ ] `docs/shared/ASSESSMENT_FRAMEWORK.md` exists
- [ ] Document covers all 4 weeks and 4 sprints
- [ ] Skill competency levels defined
- [ ] Portfolio requirements specified
- [ ] Completion criteria clear
- [ ] Linked from shared README and master index
