# Example Step YAML Template

This shows the structure of a step YAML file for the bootcamp runner.

## Week Lab Template

```yaml
id: week-01-lab-00
type: week-lab
week: week-01
lab: 0
title: Lab 0 — Setup Verification + First PR
timebox: 20–30 minutes
objective: Prove your local environment + Copilot are ready, and produce a tiny PR that follows the workflow.

read:
  - docs/content/week-01/LAB_RUBRICS.md
  - docs/content/week-01/PRE_WEEK_CHECKLIST.md
  - docs/content/week-01/micro-labs/LAB_0_SETUP.md

touch:
  - /working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/

definition_of_done:
  - PR opened
  - Build/tests passed
  - PR summary includes verification commands

validate:
  - 'Bootcamp: Validate Links (after Phase 4) => npm run check:links'
  - 'Bootcamp: Validate Lab (manual) => confirm Success Criteria + include verification commands in /working/**/README.md'

nav:
  prev: null
  home: docs/content/week-01/README.md
  next: week-01-lab-01

prompts:
  - id: P0_PLAN_ONLY
    title: Plan only (mandatory first)
    text: |-
      No secrets, no production data. Use placeholders.

      You are assisting with the EDF Copilot Bootcamp.

      Context:
      - Step: <STEP_ID> — <STEP_TITLE>
      - Read first: <PASTE_THE_READ_LIST_FROM_RUNNER_OUTPUT>
      - Output location (mandatory): /working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
      - Constraints: small diff; no unrelated refactor; follow repo instructions.

      Goal:
      - <RESTATED_OBJECTIVE>

      Task:
      Provide a plan only:
      - Files to create/change
      - Steps (numbered)
      - Risks
      - Tests to add/run
      - Verification commands

      Wait for my approval before writing code.
```

## Sprint Step Template

```yaml
id: sprint-01-step-00
type: sprint-step
sprint: sprint-01
step: 0
title: Sprint 1 — Planning & Setup
timebox: 30 minutes
objective: Complete sprint planning and set up your development environment for the sprint.

read:
  - docs/content/sprint-01/README.md
  - docs/content/sprint-01/SPRINT_1_PROGRAM.md
  - docs/content/sprint-01/sprint-packet/README.md

touch:
  - /working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/

definition_of_done:
  - Sprint backlog reviewed
  - Development environment ready
  - First task identified

validate:
  - 'Sprint Ready: All dependencies installed'
  - 'Sprint Ready: Can run local development server'

nav:
  prev: null
  home: docs/content/sprint-01/README.md
  next: sprint-01-step-01
```

## Key Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier (format: `week-XX-lab-YY` or `sprint-XX-step-YY`) |
| `type` | ✅ | Either `week-lab` or `sprint-step` |
| `title` | ✅ | Human-readable title |
| `timebox` | ✅ | Expected duration |
| `objective` | ✅ | What the student should accomplish |
| `read` | ✅ | Files to read before starting |
| `touch` | ⬜ | Files/paths that will be modified |
| `definition_of_done` | ✅ | Completion criteria |
| `validate` | ⬜ | Validation commands/checks |
| `nav` | ⬜ | Navigation links (prev/home/next) |
| `prompts` | ⬜ | Copilot prompts to use |

## Index File

The `index.yaml` lists all step IDs:

```yaml
steps:
  - week-01-lab-00
  - week-01-lab-01
  - week-01-lab-02
  # ... etc
```
