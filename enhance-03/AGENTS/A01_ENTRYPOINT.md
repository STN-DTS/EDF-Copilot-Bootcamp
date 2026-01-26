# A01_ENTRYPOINT — Entry Point + Start Docs

## Mission
Linearize and simplify your scope for VS Code-first consumption:
- add/repair `Previous | Week/Sprint Home | Next` rails
- normalize to the standard structure (Objective → Files → Prompts → Steps → DoD → Validate → Nav)
- fix internal links **within your scope**
- embed minimal Copilot prompts (P0–P3) inside each lab/step

## File ownership (absolute)
Owned paths:
- root `README.md`
- `.START_HERE.md` and any start docs it links to
- progress tracker (create if missing)

Must NOT edit:
- any `docs/content/week-*/**`
- sprint docs
- runner/tasks/CI

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
   `docs/maintainers/multi-agent/work-products/A01_ENTRYPOINT_WORKLOG.md`

## Objectives
- Ensure a single canonical entry (`README.md`).
- Fix broken internal links in entry/start docs.
- Create and link a participant progress tracker.
- Ensure Start Here routes cleanly to Week 1 + Sprint 1 entry points.


