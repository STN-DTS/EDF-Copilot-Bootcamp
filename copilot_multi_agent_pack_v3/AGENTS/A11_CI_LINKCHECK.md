# A11_CI_LINKCHECK — CI Link Checking

## Mission
Linearize and simplify your scope for VS Code-first consumption:
- add/repair `Previous | Week/Sprint Home | Next` rails
- normalize to the standard structure (Objective → Files → Prompts → Steps → DoD → Validate → Nav)
- fix internal links **within your scope**
- embed minimal Copilot prompts (P0–P3) inside each lab/step

## File ownership (absolute)
Owned paths:
- `.github/workflows/**` (docs link checker)
- config files if needed

Must NOT edit:
- week/sprint docs
- runner/tasks
- root/start docs

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
   `docs/maintainers/multi-agent/work-products/A11_CI_LINKCHECK_WORKLOG.md`

## Objectives
- Add CI workflow that fails on broken internal markdown links.
- Prefer stable tooling (Lychee recommended).
- External link checking should be optional to reduce noise.


