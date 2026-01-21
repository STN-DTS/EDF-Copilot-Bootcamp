# Lab 1 — Plan Only (No code until plan approved)

## Goal
Train "plan-first" prompting discipline. This is the foundation of safe AI-assisted development.

## Timebox
20–30 minutes

## Prerequisites
- Completed Lab 0
- Review [Prompt Pack V1](../../../shared/reference-materials/PROMPT_PACK_V1.md) — focus on P0 (Plan only)

## Task
Pick a small improvement request (provided by lead) and do:
- Copilot plan only
- Human review of plan
- Only then implement

## Steps
1) Use Prompt P0.
2) Ensure the plan includes: files, steps, risks, tests.
3) If plan is missing anything, ask Copilot to revise the plan.
4) Implement only after plan is approved.

## Success Criteria
- A plan that references repo patterns (not invented patterns)
- Small diff
- Tests/build verified

---

## Submission (MANDATORY)

### Step 1: Create Your Working Folder
```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
```
Example: `/working/backend/jsmith_20260120_1530/`

### Step 2: Include Required Files
- Your Copilot-generated plan (save as `PLAN.md`)
- All implementation files
- A `README.md` containing:
  - Your name and date
  - Lab number: **Lab 1**
  - The plan you approved (or link to `PLAN.md`)
  - What you changed from the original plan (if anything)
  - Verification commands run and results

### Step 3: Open a Pull Request
- Use the PR template at `.github/pull_request_template.md`
- Ensure all checklist items are completed
- Include your approved plan in the PR description

### Example Folder Structure
```
/working/backend/jsmith_20260120_1530/
├── README.md
├── PLAN.md
└── (your implementation files)
```

> 📁 **Reference:** See `/working/frontend/example_lab1/` or `/working/backend/example_lab1/` for example submissions.

---

## Quick Reflection (2 min)
Before submitting, answer in your README:
- Did the plan help you stay focused?
- What did Copilot miss in the initial plan?
- How did you refine the plan before implementing?
