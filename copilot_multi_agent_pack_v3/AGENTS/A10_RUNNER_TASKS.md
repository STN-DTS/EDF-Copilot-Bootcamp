# A10_RUNNER_TASKS — Runner + Tasks Wiring

## Mission
Linearize and simplify your scope for VS Code-first consumption:
- add/repair `Previous | Week/Sprint Home | Next` rails
- normalize to the standard structure (Objective → Files → Prompts → Steps → DoD → Validate → Nav)
- fix internal links **within your scope**
- embed minimal Copilot prompts (P0–P3) inside each lab/step

## File ownership (absolute)
Owned paths:
- `scripts/bootcamp.*`
- `package.json` scripts
- `.vscode/extensions.json`
- step YAML schema docs (if added)

Must NOT edit:
- `.vscode/tasks.json` final canonical (Coordinator owns)
- week/sprint docs
- CI

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
   `docs/maintainers/multi-agent/work-products/A10_RUNNER_TASKS_WORKLOG.md`

## Objectives
- Ensure runner supports: list steps, print step by ID, print validate.
- Keep cross-platform (no hard dependency on `code` CLI).
- Provide a way to generate tasks or stable naming for Coordinator to author tasks.
- Provide verification commands (`npm run bootcamp:list`, `npm run bootcamp -- step <id>`).


