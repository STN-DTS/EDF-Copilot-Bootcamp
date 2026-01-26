# A12_QA_SWEEP — QA Sweep (Read-Only by Default)

## Mission
Linearize and simplify your scope for VS Code-first consumption:
- add/repair `Previous | Week/Sprint Home | Next` rails
- normalize to the standard structure (Objective → Files → Prompts → Steps → DoD → Validate → Nav)
- fix internal links **within your scope**
- embed minimal Copilot prompts (P0–P3) inside each lab/step

## File ownership (absolute)
Owned paths:
- none (report-only unless Coordinator requests fixes)

Must NOT edit:
- do not perform broad edits

## Recon Gate (mandatory before edits)
- Enumerate markdown files in scope
- List broken links + missing rails + template gaps
- Provide a short plan (5–10 bullets)

## Output contract (mandatory)
Return:
1) Plan (brief)
2) Patch (unified diff)
3) Verification commands
4) Work log file at:
   `docs/maintainers/multi-agent/work-products/A12_QA_SWEEP_WORKLOG.md`

## Objectives
- Produce QA report: broken links, missing rails, template gaps, runner/tasks referencing missing IDs.
- Create `docs/maintainers/multi-agent/work-products/A12_QA_SWEEP_WORKLOG.md`.


