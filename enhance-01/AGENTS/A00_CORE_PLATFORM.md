# A00 — Core/Platform Wiring (Tasks, Runner, CI link check, shared docs)

## Scope
Implement Phase 3–4 wiring and shared participant docs: VS Code tasks, runner script, step index hygiene, link-check CI, and updates to `.github/copilot-instructions.md`.

## Owned paths (hard boundary)
- `.vscode/**`
- `scripts/**`
- `package.json`
- `.github/**`
- `docs/participants/**`
- `docs/shared/**`
- `docs/maintainers/multi-agent/**`
- Root docs only if not assigned to other agents: `README.md`, `.START_HERE.md`

## Inputs / references
- `docs/maintainers/multi-agent/04-SHARED_PROMPT_BLOCKS.md`
- `docs/maintainers/multi-agent/05-SHARED_NAV_RAIL.md`
- `docs/maintainers/multi-agent/02-COORDINATION_CONTRACT.md`
- `docs/maintainers/multi-agent/03-FILE_OWNERSHIP_MATRIX.md`
- `cleanup-instructions.md` (the cleanup spec)

## Required output format (every response)
**Plan → Patch (unified diff) → Verification commands → Notes/Risks**

## Coordination requirements
- Append to: `docs/maintainers/multi-agent/INTEGRATION_LOG.md`
- If you must touch a non-owned file: do not. Log as a follow-up instead.

## Quality bar
- Preserve technical meaning; reorganize for clarity.
- Add navigation rails at end of docs.
- Embed “just enough prompts” inside labs to reduce cross-file jumping.
- Fix internal links that break within your owned paths.


## Task checklist
1. **Runner + tasks hardening**
   - Ensure `.vscode/tasks.json` calls `node scripts/bootcamp.mjs step <ID>` (as per spec).
   - Ensure `scripts/bootcamp.mjs` supports:
     - `list`
     - `step <id>`
     - `validate <id>` (even if “validate” is informational at first)
   - Ensure `package.json` scripts exist: `bootcamp`, `bootcamp:list`, and (later) `check:links`.

2. **Step ID hygiene**
   - The cleanup spec’s Appendix B shows duplicate IDs for Week 2/3/4 micro-labs (e.g., multiple entries all called `week-02-lab-02`). Normalize IDs so they are **unique** and stable.
   - Preferred convention:
     - Week 02: `week-02-lab-02-0`, `week-02-lab-02-1`, `week-02-lab-02-2`, `week-02-lab-02-3`
     - Week 03: `week-03-lab-03-0..3`
     - Week 04: `week-04-lab-04-0..3`
   - Update runner parsing and `.vscode/tasks.json` accordingly (don’t assume `lab` is always a 2‑digit number).

3. **Index consistency**
   - Ensure `bootcamp/steps/index.yaml` lists all step IDs exactly once.
   - Ensure `npm run bootcamp:list` prints stable ordering (week then sprint).

4. **CI link checking**
   - Add `.github/workflows/docs-link-check.yml` (Lychee recommended in spec).
   - Add local script `npm run check:links` aligned with CI.

5. **Participant docs + nav rail template**
   - Create `docs/participants/_NAV_RAIL_TEMPLATE.md` and keep it as canonical copy/paste block.
   - Ensure guidance exists for “How to consume in VS Code” (root README or participant docs).

6. **Copilot instructions**
   - Update `.github/copilot-instructions.md` to reflect entry point, nav rails, tasks/runner, and link checks.

## Verification
- `npm install`
- `npm run bootcamp:list`
- `npm run bootcamp -- step week-01-lab-00`
- `npm run check:links` (once added)


## Acceptance checks
- You can traverse your owned content using only the navigation rails.
- Every participant-facing lab includes: Objective, Files to touch, Copilot prompts, DoD, Validate, and the rail.
- No broken internal links remain *within your owned paths*.
