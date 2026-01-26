# A09 — Root Entry Point + START_HERE + Progress Tracker (Phase 1)

## Scope
Implement Phase 1 entry point: create/normalize root README, fix `.START_HERE.md` links, and add a participant progress tracker. Only touch Phase 1 artifacts.

## Owned paths (hard boundary)
- `README.md`
- `.START_HERE.md`
- `.MASTER_BOOTCAMP.md` (only if link fixes)
- `docs/participants/**`
- `copilot-remarks.md` (only if link fixes)

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
1. Create/normalize `README.md` as canonical start (short, VS Code oriented).
2. Fix `.START_HERE.md` internal links to match `/docs` layout.
3. Create `docs/participants/PROGRESS_TRACKER.md` (+ optional template).
4. Ensure root README links to `.START_HERE.md`, facilitator guide, master index, and VS Code consumption tips.

## Constraints
- Do not modify week/sprint content; that is owned by other agents.

## Verification
- Open README in VS Code Markdown preview; confirm all internal links resolve.


## Acceptance checks
- You can traverse your owned content using only the navigation rails.
- Every participant-facing lab includes: Objective, Files to touch, Copilot prompts, DoD, Validate, and the rail.
- No broken internal links remain *within your owned paths*.
