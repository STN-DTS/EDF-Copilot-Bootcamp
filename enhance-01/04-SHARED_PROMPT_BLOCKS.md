# Shared Prompt Blocks (copy/paste into labs and into Copilot Chat)

These blocks are designed to:
- reduce cross-file jumping,
- enforce reviewable PR discipline,
- and keep output consistent across labs.

## P0 — Context + rules (paste first in every lab)
No secrets, no production data. Use placeholders.

You are assisting with the **EDF Copilot Bootcamp** repository.

Constraints:
- Keep the diff small and reviewable.
- Do not refactor unrelated code or restructure unrelated docs.
- Update any impacted markdown links.
- Work in `/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/` unless the lab explicitly requires repo-wide changes.

Required output format for every response:
**Plan → Patch (unified diff) → Verification commands → Notes/Risks**

## P1 — Plan only (mandatory before code)
Given the lab objective and the files listed under “You will touch these files”:
- Provide a numbered plan
- List the exact files to create/change
- List tests/checks to run
- Call out risks/assumptions
Do not write code yet. Wait for approval.

## P2 — Patch (after plan approval)
Proceed with the approved plan.

Return:
1) A **unified diff** only (git patch format)  
2) Then list **verification commands** and **expected outputs**.

## P3 — Self-review (pre-commit)
Self-review the diff for:
- correctness and completeness
- security issues
- maintainability
- compliance with lab constraints

Return:
- A short risk list
- Missing tests/docs
- Final “ready to commit” checklist
