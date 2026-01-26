# A01 — Week 01 — Normalize Labs + Rails + Embedded Prompts

## Scope
Make Week 01 fully linear and VS Code friendly (labs 0–6). Embed prompts per lab to reduce jumping.

## Owned paths (hard boundary)
- `docs/content/week-01/**`
- `bootcamp/steps/week-01/**`

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
1. **Navigation rails**
   - Add `Previous | Home | Next` rail at the end of every:
     - `docs/content/week-01/README.md`
     - `docs/content/week-01/micro-labs/*.md`
2. **Lab template normalization**
   - Reorder each lab to the standard template:
     1) Header, 2) Objective, 3) Files you will touch, 4) Copilot prompts (P0–P3), 5) Steps, 6) DoD, 7) Validate, 8) Nav rail.
   - Preserve technical meaning; do not invent new requirements.

3. **Step metadata completion**
   - Ensure `bootcamp/steps/week-01/` contains a YAML file per micro-lab in this week.
   - Use the YAML schema from the cleanup spec (id, read, touch, prompts, validate, nav).
   - If the week uses sub-labs (e.g., LAB_1_0 …), use unique IDs (e.g., `week-01-lab-01-0`, etc.).
   - Update `bootcamp/steps/index.yaml` (if owned) or log required additions for A00.

4. **Local link fixes**
   - Fix internal links that break within `docs/content/week-01/**` after your edits.

## Verification
- Open week README and walk through every micro-lab using only Next/Home/Previous links (no file explorer).
- Capture any remaining broken-link candidates in `INTEGRATION_LOG.md`.


## Acceptance checks
- You can traverse your owned content using only the navigation rails.
- Every participant-facing lab includes: Objective, Files to touch, Copilot prompts, DoD, Validate, and the rail.
- No broken internal links remain *within your owned paths*.
