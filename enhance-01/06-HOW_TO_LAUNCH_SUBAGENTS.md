# How to Launch Subagents in VS Code (Coordinator quick steps)

1. Create branch: `bootcamp/cleanup-multi-agent`
2. Copy this folder into repo: `docs/maintainers/multi-agent/`
3. Open `01-MASTER_MULTI_AGENT_PROMPT.md` and paste into Copilot Chat.
4. Spawn subagents A00–A09.
   - If Copilot subagents cannot read repo files: paste the entire content of the relevant `AGENTS/*.md` file into that subagent chat.

## Recommended merge discipline
- Each agent works in its own branch: `bootcamp/cleanup/A01-week01`, etc.
- Open PRs into `bootcamp/cleanup-multi-agent` (integration branch).
- A00 merges last, after content PRs, to reduce conflicts on shared wiring files.

## Minimal check after each merge
- open the modified docs in Markdown Preview and follow rails end-to-end
- run any available local checks (or at least `rg` for broken relative link patterns like `content/` vs `docs/content/`)
