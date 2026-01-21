# Week 1 Program — Copilot Enablement

**Stack:** OpenShift + Oracle + React Router v7 + Spring Boot

---

## Week 1 Outcomes

By end of week, the team can:
- ✅ Use Copilot safely and consistently
- ✅ Scaffold RRv7 + Spring Boot code in small diffs
- ✅ Produce verifiable PRs with tests
- ✅ Produce OpenShift-ready app characteristics (probes/config)
- ✅ Execute parallel FE/BE work without drift

---

## Key Resources

| Resource | Purpose |
|----------|---------|
| [.START_HERE.md](../../.START_HERE.md) | Entry point for all participants |
| [DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md) | Order Management business domain |
| [PROMPT_PACK_V1.md](../../shared/reference-materials/PROMPT_PACK_V1.md) | Standard prompts (P0–P23) |
| [LAB_RUBRICS.md](LAB_RUBRICS.md) | Evaluation criteria |
| [FAQ.md](FAQ.md) | Common questions |

## Working Folder Structure

All lab submissions use this structure:
```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── PLAN.md
├── src/
└── test/
```

📁 Reference examples: `/working/frontend/example_lab*/` and `/working/backend/example_lab*/`

---

# Day 0 (Lead Prep) — 60–90 minutes

**Before Day 1, the lead must:**

1. Create training branch or training area in repo
2. Add repo rails:
   - `.github/copilot-instructions.md`
   - Path instructions (frontend/backend/testing)
   - PR template + checklist
3. Verify example folders exist in `/working/`
4. Create issues for the 7 Week-1 labs (Labs 0–6) and assign
5. Confirm all team members completed [PRE_WEEK_CHECKLIST.md](PRE_WEEK_CHECKLIST.md)

---

# Day 1 — Kickoff + Safety + Workflow Discipline

**Training:** 75–90 minutes | **Labs:** 30–60 minutes

## Session 1 (30 min): Copilot Reality (Simple Rules)

Core concepts:
- Copilot drafts; humans approve
- Plan → Implement → Verify is mandatory
- We ship small diffs

**Mini-demo:**
1. Ask for plan only (P0)
2. Implement one change
3. Run tests
4. Open PR

## Session 2 (20 min): Safe Prompting

Key rules:
- No secrets / no prod data / placeholders only
- If uncertain, do not paste it
- Always start with: "No secrets, no production data. Use placeholders."

**Exercise:** Rewrite 5 unsafe prompts into safe prompts.

## Session 3 (20 min): "Proof Culture"

Standards:
- Every PR must list commands run
- Tests are not optional
- Build passing is the minimum bar

## Labs

| Lab | Focus | Timebox |
|-----|-------|---------|
| [Lab 0](micro-labs/LAB_0_SETUP.md) | Setup + tiny PR | 20–30 min |
| [Lab 1](micro-labs/LAB_1_PLAN_ONLY.md) | Plan-only discipline | 20–30 min |

**Submission:** `/working/{frontend|backend}/{name}_{timestamp}/`

---

# Day 2 — Stack Confirmation + Scaffolding Patterns

**Training:** 45–60 minutes | **Labs:** 60–90 minutes

## Session 1 (25 min): Prompt Frame (The One We Use)

Every prompt should include:
1. Context (paths, domain)
2. Goal
3. Constraints
4. Acceptance criteria
5. Verification
6. Output location

See [PROMPT_PACK_V1.md](../../shared/reference-materials/PROMPT_PACK_V1.md) for templates.

## Session 2 (20 min): Team Patterns We Enforce

**Front End (RRv7):**
- Route structure in `src/routes/`
- loader/action usage conventions
- Error normalization (Problem Details)

**Back End (Spring Boot):**
- controller → service → repository layering
- Problem Details standard (RFC 7807)
- Oracle access conventions (transactions, naming)

**Domain Context:**
- Use Order Management domain from [DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md)

## Activity: Confirm Versions + Repo Commands (30 min)

**Questions to answer as a team:**
- Java version (17 or 21)? Spring Boot version?
- Build tool: Maven wrapper or Gradle wrapper?
- Node version (e.g., 20)? Package manager (npm/pnpm/yarn)?
- Test frameworks (FE and BE)?
- Spring Actuator endpoints exposure policy?
- Oracle strategy for local/dev tests (Testcontainers vs shared dev DB)?
- OpenShift deployment pattern (Helm vs Kustomize vs raw YAML)?

**Output:** Update [STACK_CONFIRMATION_TEMPLATE.md](STACK_CONFIRMATION_TEMPLATE.md) with exact answers.

## Lab

| Lab | Focus | Timebox |
|-----|-------|---------|
| [Lab 2](micro-labs/LAB_2_SCAFFOLD_VERTICAL_SLICE.md) | Vertical slice scaffold | 60–90 min |

**Deliverables:**
- FE: RRv7 routes + page skeleton with loading/error
- BE: endpoint stub + unit test + Problem Details stub

**Submission:** `/working/{frontend|backend}/{name}_{timestamp}/`

---

# Day 3 — Tests-First and Oracle-Aware Development

**Training:** 30 minutes | **Labs:** 60–120 minutes

## Session (30 min): Tests from Acceptance Criteria

Key insights:
- Copilot writes decent tests only with crisp criteria
- Humans correct tests; Copilot accelerates
- Use P2 prompt template for tests-first

**Domain focus:** Write tests for Order Management entities (see [DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md))

## Lab

| Lab | Focus | Timebox |
|-----|-------|---------|
| [Lab 3](micro-labs/LAB_3_TESTS_FIRST.md) | Tests-first | 60–90 min |

**Deliverables:**
- BE: repository/service tests (Oracle strategy decided)
- FE: component/route tests for states

**Submission:** `/working/{frontend|backend}/{name}_{timestamp}/`

---

# Day 4 — OpenShift Readiness + Guarded Refactor

**Training:** 20 minutes | **Labs:** 60–90 minutes

## Session (20 min): Guarded Refactoring

Key concepts:
- No behavior change during refactor
- Scope control is critical
- Tests verify no regression
- Small diffs only

## Lab

| Lab | Focus | Timebox |
|-----|-------|---------|
| [Lab 4](micro-labs/LAB_4_REFACTOR_GUARDED.md) | Guarded refactor | 45–60 min |
| [Lab 5](micro-labs/LAB_5_OPENSHIFT_READINESS.md) | OpenShift readiness | 45–60 min |

**Lab 4 Deliverables:**
- Refactored code with no behavior change
- Plan with risks documented
- All existing tests passing

**Lab 5 Deliverables:**
- BE: actuator probes + config + manifests (or Helm/Kustomize)
- FE: env-based API base URL + production build confirmation

**Submission:** `/working/{frontend|backend}/{name}_{timestamp}/`

---

# Day 5 — Capstone + Standardization

**Total:** 60–90 minutes

## Capstone Lab

| Lab | Focus | Timebox |
|-----|-------|---------|
| [Lab 6](micro-labs/LAB_6_CAPSTONE_MINI_FEATURE.md) | Mini-feature end-to-end | 60–90 min |

**Deliverables:**
- One BE endpoint (real logic, using Order Management domain)
- One FE page flow consuming it
- Tests on both sides
- PR includes verification commands and "Copilot vs human" notes
- Reflection answers in README

**Submission:** `/working/{frontend|backend}/{name}_{timestamp}/`

## Standardization (Final 20–30 min)

Team retrospective:
1. Collect best prompts from the week
2. Update Prompt Pack with new patterns
3. Tighten repo instructions based on observed failure modes
4. Celebrate completions! 🎉

---

## Week 1 Completion Checklist

Each developer must complete:
- [ ] Lab 0: Setup verified, first PR submitted
- [ ] Lab 1: Plan-first discipline demonstrated
- [ ] Lab 2: Vertical slice scaffolded with tests
- [ ] Lab 3: Tests-first workflow completed
- [ ] Lab 4: Guarded refactor completed
- [ ] Lab 5: OpenShift readiness verified
- [ ] Lab 6: Capstone feature delivered end-to-end
- [ ] All PRs in `/working/` folders with proper structure
- [ ] All PRs include verification commands
- [ ] Lab 6 reflection completed

---

## Metrics to Track

| Metric | Target |
|--------|--------|
| Labs completed per developer | 7/7 |
| PRs with passing builds | 100% |
| PRs with tests included | 100% |
| PRs following working folder structure | 100% |
| Average time per lab | Within timebox |
| Copilot suggestions rejected | Track and learn |
