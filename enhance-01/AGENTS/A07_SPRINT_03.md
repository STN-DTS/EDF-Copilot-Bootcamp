# A07 — Sprint 03 — Docs + Packet Navigation + Step Metadata Sanity

## Scope
Make Sprint docs navigable and consistent: add rails, fix internal links, and ensure step YAML metadata maps cleanly to sprint docs.

## Owned paths (hard boundary)
- `docs/content/sprint-03/**`
- `bootcamp/steps/sprint-03/**`

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
1. Add navigation rails to:
   - `docs/content/sprint-03/README.md`
   - sprint program docs (e.g., `SPRINT_3_PROGRAM.md` if present)
   - sprint packet README(s) and task lists.

2. Ensure internal links resolve within your sprint folder after edits.

3. Validate `bootcamp/steps/sprint-03/*.yaml`:
   - `read:` list should be minimal and relevant; avoid unrelated sprint docs unless explicitly required.
   - `nav.prev/home/next` must be coherent (no self-references, no dangling next if steps exist).

4. If you identify step ID or nav issues that require shared changes (runner/index), log them for A00 rather than editing outside owned paths.

## Verification
- Open sprint README and traverse packet docs using rails.
- Run any available local checks (or at least confirm links visually in Markdown preview).


## Acceptance checks
- You can traverse your owned content using only the navigation rails.
- Every participant-facing lab includes: Objective, Files to touch, Copilot prompts, DoD, Validate, and the rail.
- No broken internal links remain *within your owned paths*.
