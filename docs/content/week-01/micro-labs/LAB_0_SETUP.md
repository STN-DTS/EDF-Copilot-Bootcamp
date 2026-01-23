# Lab 0 — Setup Verification + First PR

## Goal
Prove your local environment + Copilot are ready, and produce a tiny PR that follows the workflow.

## Timebox
20–30 minutes

## Prerequisites
- Complete the [Pre-Week Checklist](../PRE_WEEK_CHECKLIST.md)
- Review the [Lab Rubrics](../LAB_RUBRICS.md) for evaluation criteria

## Steps
1) Confirm Copilot works in your IDE (completion + chat).
2) Pull the training branch/repo.
<!-- Discrepancy: Step 3 says to make a tiny change but Step 2 of Submission section says to create a new README file. Maybe add "Create a new README file" as Step 3 and shift the others down. I am not sure what helpers would be made as there is no code at this point in the bootcamp to make a helper for. -->
3) Make a tiny change (e.g., update a README line, add a small helper, fix a lint warning).
<!--  Why would they need to use a Plan prompt to make a tiny change? Can't they just use agent mode directly? This language ("Use Prompt P0") likely won't make sense to new AI users. Also, there is no code to change yet, which creates confusion. Additionally, should this step not be before or combined with the "Make a tiny change" step? -->
4) Use Prompt P0 (Plan only) to get a plan before changing code.
5) Commit and open a PR using the PR template checklist.

## Success Criteria
- PR opened
- Your newly created README in your working directory includes:
  - Your name and date
  - Lab number: **Lab 0**
  - Verification commands and outputs
  - Brief description of your actions in this lab

---

## Submission (MANDATORY)

### Step 1: Create Your Working Folder
```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
```
Example: `/working/frontend/jsmith_20260120_1430/`

### Step 2: Include Required Files
- A `README.md` in your new working folder containing:
  - Your name and date
  - Lab number: **Lab 0**
  - Verification commands from the [Pre-Week Checklist](../PRE_WEEK_CHECKLIST.md) and their output summary
  - Brief description of what you did in this lab

### Step 3: Open a Pull Request
- Use the PR template at `.github/pull_request_template.md`
- Ensure all checklist items are completed
- Reference this lab in the "Related Lab/Feature" section

### Example Folder Structure
```
/working/frontend/jsmith_20260120_1430/
├── README.md
```

> 📁 **Reference:** See `/working/frontend/example_lab0/` or `/working/backend/example_lab0/` for example submissions.

---

<!-- I don't think this section is necessary in this lab since this is just setup and little insight will be gleaned from it with how basic this lab is -->
## Quick Reflection (2 min)
Before submitting, answer in your README:
- What worked well during setup?
- What was confusing or took longer than expected?
- One thing you learned about Copilot today?

