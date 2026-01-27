# Lab 6 — Capstone (Mini Feature, FE+BE)

## Goal

Demonstrate end-to-end delivery discipline with Copilot. This is the culmination of Week 1—proving you can deliver a complete, tested, deployable feature using AI-assisted development while maintaining quality gates.

---

## 🔙 Building On

Labs 0-5 gave you the complete AI-assisted development workflow: plan → scaffold → test → refactor → deploy. Now you'll apply ALL of those skills to build a complete feature.

**Key connection:** This is where everything comes together. You'll use every skill from the week.

---

## Timebox

60–90 minutes

## Prerequisites

- Completed Labs 0–5
- Review [Prompt Pack V1](../../../shared/reference-materials/PROMPT_PACK_V1.md) — use all prompts as needed
- Review [Domain Context](../../../shared/reference-materials/DOMAIN_CONTEXT.md) — your feature MUST use this domain

## Domain Context

Use the **Order Management** domain from `docs/shared/reference-materials/DOMAIN_CONTEXT.md`. Your mini-feature should implement real business logic related to Orders, Customers, or Items.

### Suggested Mini-Features (pick one or propose your own)

- **Create Order**: POST /api/orders with validation, FE form to submit
- **Order Details**: GET /api/orders/:id with calculated total, FE detail page
- **Order Status Update**: PATCH /api/orders/:id/status, FE status dropdown
- **Order List with Filter**: GET /api/orders?status=pending, FE filtered list

## Task

Deliver a tiny feature end-to-end:

- One BE endpoint (real logic, not only stub)
- One FE workflow consuming it
- Tests on both sides
- PR documentation

## Required Constraints

- Plan first (P0)
- Small diffs (no "big bang" commits)
- Proof (tests/build/lint must pass)
- Contract alignment (if a contract doc exists)

## Success Criteria

- Feature works end-to-end
- Tests exist on both FE and BE
- PR summary includes:
  - What Copilot generated
  - What human verified/fixed
  - Commands run

---

## Submission (MANDATORY)

### Step 1: Create Your Working Folder

```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
```

**Note:** For capstone, you may need TWO folders if you worked on both FE and BE, or coordinate with a pair partner.

Example: `/working/backend/jsmith_20260123_1400/` AND `/working/frontend/jsmith_20260123_1400/`

### Step 2: Include Required Files

- Your approved plan (`PLAN.md`)
- All implementation files (FE and/or BE)
- Test files with passing tests
- A `README.md` containing:
  - Your name and date
  - Lab number: **Lab 6 (Capstone)**
  - Feature description and which domain entity it uses
  - What Copilot generated vs what you fixed
  - Verification commands run and results
  - Screenshots (if applicable for FE)

### Step 3: Open a Pull Request

- Use the PR template at `.github/pull_request_template.md`
- Ensure all checklist items are completed
- Include comprehensive "Copilot vs human" notes

### Example Folder Structure

```
/working/backend/jsmith_20260123_1400/
├── README.md
├── PLAN.md
├── src/
│   ├── controllers/
│   │   └── OrderController.java
│   ├── services/
│   │   └── OrderService.java
│   └── models/
│       └── Order.java
└── test/
    ├── OrderControllerTest.java
    └── OrderServiceTest.java

/working/frontend/jsmith_20260123_1400/
├── README.md
├── src/
│   └── routes/
│       └── orders.$id.tsx
└── test/
    └── OrderDetail.test.tsx
```

> 📁 **Reference:** See `/working/frontend/example_lab6/` or `/working/backend/example_lab6/` for example submissions.

---

## Pair Programming Option

Lab 6 is ideal for pair programming. If working with a partner:

### Recommended Roles

- **Driver** (types): Writes code, interacts with Copilot
- **Navigator** (reviews): Reviews suggestions, catches errors, thinks ahead

### AI-Assisted Pair Programming Tips

| Situation                | Navigator Action            | Driver Action                    |
| ------------------------ | --------------------------- | -------------------------------- |
| Copilot suggests code    | Read and assess correctness | Wait before accepting            |
| Complex logic needed     | Describe intent verbally    | Prompt Copilot with that context |
| Test fails               | Analyze error message       | Fix or re-prompt                 |
| Large suggestion appears | Request breakdown           | Ask Copilot to split into steps  |

### Rotation Schedule

- Switch roles every **20-25 minutes**
- Switch when completing a major step (e.g., finish tests, start controller)
- Both partners should experience prompting Copilot

### Pair PR Submission

- Use **one shared working folder** with both names: `jsmith_ajones_20260123_1400`
- Both names in README.md author section
- Note in PR which partner drove each component
- Both partners must run verification commands

---

## Reflection (Required for Capstone)

After completing Lab 6, include these answers in your README:

### Copilot Effectiveness

1. What did Copilot do well?
2. What did you have to fix or reject?
3. What would you prompt differently next time?

### Process Insights

4. Did the plan-first approach help with the larger feature?
5. How did tests-first (Lab 3 skills) contribute to quality?
6. What repo pattern or instruction should we add based on your experience?

### Quantitative Summary

- Approximate lines of code generated by Copilot: \_\_\_
- Approximate lines of code written/fixed by human: \_\_\_
- Number of Copilot suggestions rejected: \_\_\_
- Time spent prompting vs coding: \_\_\_

---

## Week 1 Completion Checklist

Before marking Week 1 complete, verify:

- [ ] Lab 0: Setup verified, first PR submitted
- [ ] Lab 1: Plan-first discipline demonstrated
- [ ] Lab 2: Vertical slice scaffolded with tests
- [ ] Lab 3: Tests-first workflow completed
- [ ] Lab 4: Guarded refactor completed
- [ ] Lab 5: OpenShift readiness verified
- [ ] Lab 6: Capstone feature delivered end-to-end
- [ ] All PRs follow template and include verification commands
- [ ] Reflection completed for Lab 6

**Congratulations on completing Week 1! 🎉**

---

## 🔜 Looking Ahead

With Week 1 complete, you've mastered the fundamentals of AI-assisted development. In **Week 2**, you'll learn about **Constraint Registers**—documenting the rules and boundaries that shape enterprise development.

**Next skill:** Constraint-aware prompting. Week 2 teaches you to capture and communicate project constraints so Copilot generates code that fits your organization's requirements.

**Sprint 1** will then have you apply all these skills to build a "thin slice" of a real feature with full delivery discipline.

---

## Navigation

| Previous                                | Home                        | Next                                |
| --------------------------------------- | --------------------------- | ----------------------------------- |
| [← Lab 5](LAB_5_OPENSHIFT_READINESS.md) | [Week 1 Home](../README.md) | [Week 2 →](../../week-02/README.md) |
