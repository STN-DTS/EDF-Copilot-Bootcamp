# Lab 2 — Vertical Slice Scaffold (RRv7 + Spring Boot)

## Goal
Practice safe, plan-first Copilot scaffolding and produce deployable-grade code structure.

## Timebox
60–90 minutes

## Prerequisites
- Completed Labs 0 and 1
- Review [Prompt Pack V1](../../../shared/reference-materials/PROMPT_PACK_V1.md) — focus on P0 and P1
- Review [Domain Context](../DOMAIN_CONTEXT.md) for business context

## Domain Context
Use the **Order Management** domain from `docs/shared/reference-materials/DOMAIN_CONTEXT.md`. For this lab, you may use the `/ping` endpoint as a warm-up, but consider extending to an Order-related endpoint if time permits.

## Back End Deliverable (Spring Boot)
- Add endpoint stub: GET /api/ping -> { "status": "ok" }
- Add global exception handler stub that returns Problem Details
- Add one unit/integration test for the endpoint
- *(Optional stretch)*: Add GET /api/orders stub returning sample Order data

## Front End Deliverable (RRv7)
- Add route `/ping` with a page that calls /api/ping
- Implement loading/success/error UI states
- Add one test for the page states (framework per repo choice)
- *(Optional stretch)*: Add `/orders` route displaying sample data

## Required Workflow
- Use Prompt P0 first (plan only).
- Implement in 2–3 steps (stop between steps).
- Run tests and record commands in PR.

## Success Criteria
- Small diff
- Tests included
- PR summary includes verification commands and "Copilot vs human" notes

---

## Submission (MANDATORY)

### Step 1: Create Your Working Folder
```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
```
Example: `/working/frontend/jsmith_20260121_0900/`

### Step 2: Include Required Files
- Your approved plan (`PLAN.md`)
- All scaffold code (controllers, routes, tests, etc.)
- A `README.md` containing:
  - Your name and date
  - Lab number: **Lab 2**
  - What Copilot generated vs what you modified
  - Verification commands run and results
  - Any deviations from the plan

### Step 3: Open a Pull Request
- Use the PR template at `.github/pull_request_template.md`
- Ensure all checklist items are completed
- Include "Copilot vs human" notes in PR summary

### Example Folder Structure
```
/working/backend/jsmith_20260121_0900/
├── README.md
├── PLAN.md
├── src/
│   ├── controllers/
│   │   └── PingController.java
│   └── exceptions/
│       └── GlobalExceptionHandler.java
└── test/
    └── PingControllerTest.java
```

> 📁 **Reference:** See `/working/frontend/example_lab2/` or `/working/backend/example_lab2/` for example submissions.

---

## Quick Reflection (2 min)
Before submitting, answer in your README:
- How did breaking into 2–3 steps help (or not)?
- What did Copilot scaffold well? What needed fixing?
- Would you structure the prompts differently next time?
