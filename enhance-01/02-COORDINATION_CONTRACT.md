# Multi‑Agent Coordination Contract (Copilot Enterprise Subagents)

This folder is designed for **concurrent** work by multiple Copilot Enterprise subagents with minimal merge conflicts.

## Non‑negotiables (apply to every subagent)
1. **Respect file ownership**: only modify the paths assigned to you in `03-FILE_OWNERSHIP_MATRIX.md`.
2. **No “drive‑by refactors”**: do not reformat or restructure unrelated content.
3. **Keep diffs small and reviewable** (aim for < ~300 lines changed per commit unless your task explicitly requires more).  
4. **Do not paste large file contents into chat**. Reference files by path and line numbers.
5. **Output format** for every response: **Plan → Patch (unified diff) → Verification commands → Notes/Risks**.  
   (This mirrors the bootcamp maintainer protocol.) 

## Shared repo objectives (from cleanup plan)
- One canonical entry point (`README.md`), consistent navigation rails, and a VS Code-first “runner + tasks” experience.  
- Automated internal link checking in CI, plus a local check command.

## Coordination primitives
### A) “Integration Log” (required)
Each subagent must append to: `docs/maintainers/multi-agent/INTEGRATION_LOG.md`:

- Agent ID
- Files changed (paths only)
- Summary of decisions (1–5 bullets)
- Verification commands run + result

### B) “Ownership handshake”
Before you start, run `git status` and confirm **no overlapping edits** in your owned paths (avoid conflicts).

### C) Safety rails for markdown work
- Prefer **relative links** and keep them repo-resolving.
- When adding nav rails, use a consistent block and place it at **end of file**.

## Validation expectations
- After your patch: run the **best available** local checks (even if link-check CI is not wired yet).
- Include exact commands and expected outputs in your response.

## Escalation
If you discover:
- a structural ambiguity, or
- a conflicting requirement
log it under a new heading in `INTEGRATION_LOG.md` as **BLOCKER** and stop after producing a minimal diagnostic patch.


## Shared assets in this pack
- `04-SHARED_PROMPT_BLOCKS.md` — canonical P0–P3 prompt blocks
- `05-SHARED_NAV_RAIL.md` — canonical navigation rail snippet
