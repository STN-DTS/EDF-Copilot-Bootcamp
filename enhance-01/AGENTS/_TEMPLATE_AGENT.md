# AXX — Template

## Scope
Describe what this agent is allowed to do.

## Owned paths (hard boundary)
- <paths>

## Inputs / references
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
1. ...
2. ...

## Verification
- ...
