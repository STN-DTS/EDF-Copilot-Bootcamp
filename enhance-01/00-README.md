# Copilot Multi‑Agent Prompt Pack — EDF Copilot Bootcamp Cleanup

This pack provides:
- A **Coordinator master prompt** to run multi‑agent work in Copilot Enterprise
- A **shared coordination contract**
- A **file ownership matrix** to prevent conflicts
- **Per‑agent instruction files** (Weeks 1–4, Sprints 1–4, and Core wiring)

## Where this fits
It operationalizes the cleanup plan’s phases (PR1–PR4), including:
- entry point + broken links + progress tracker
- navigation rails + normalized lab template
- VS Code tasks + bootcamp runner
- CI link checking + local check command

## Recommended usage in VS Code
1. Copy this pack into the repo under: `docs/maintainers/multi-agent/`
2. Open `01-MASTER_MULTI_AGENT_PROMPT.md` and paste into Copilot Chat.
3. Spawn subagents and paste the content of each `AGENTS/Axx_*.md` into the corresponding subagent.

## Important
- If Copilot “subagents” cannot directly read repo files, paste the relevant agent instruction markdown into each subagent chat.
- Keep each agent strictly within the owned paths to reduce merge conflicts.


## Shared assets
- `04-SHARED_PROMPT_BLOCKS.md`
- `05-SHARED_NAV_RAIL.md`
- `06-HOW_TO_LAUNCH_SUBAGENTS.md`
