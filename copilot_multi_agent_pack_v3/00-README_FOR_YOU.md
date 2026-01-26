# Multi‑Agent Revamp Pack (v3) — EDF Copilot Bootcamp

This pack is designed for **VS Code + GitHub Copilot Enterprise Chat** (Claude Opus 4.5) using **multiple concurrent subagents**.
It is optimized for **high parallelism**, **low merge conflict**, and **repeatable integration**.

---

## What you do (you = Coordinator / Lead)

### Step 0 — Prepare your working branch
1. Open the bootcamp repo in VS Code.
2. Create a clean working branch:
   - `git checkout -b revamp/bootcamp-linear-v1`
3. Ensure you can run node (recommended) or at least git + markdown preview.

### Step 1 — Paste the kickoff prompt into Copilot
1. Open **`01-KICKOFF_PROMPT.md`** from this pack.
2. Copy the entire content and paste it into **Copilot Chat** (your main chat, not a subagent).
3. Follow the instructions it returns: it will ask you to spawn subagents and paste each agent’s instruction file.

**This file is the single “key md file” to begin the process:**  
✅ `01-KICKOFF_PROMPT.md`

### Step 2 — Spawn subagents and feed them their instruction files
In Copilot Enterprise, create subagents with the names:
- `A01_ENTRYPOINT`
- `A02_WEEK1`
- `A03_WEEK2`
- `A04_WEEK3`
- `A05_WEEK4`
- `A06_SPRINT1`
- `A07_SPRINT2`
- `A08_SPRINT3`
- `A09_SPRINT4`
- `A10_RUNNER_TASKS`
- `A11_CI_LINKCHECK`
- `A12_QA_SWEEP` (optional but recommended)

Then paste the content of the corresponding files in `AGENTS/` into each subagent.

### Step 3 — Integrate output (strict gate)
Every agent must produce:
1. A **unified diff** (or discrete commits) limited to its file-ownership scope.
2. A work log file under:
   - `docs/maintainers/multi-agent/work-products/Axx_<scope>_WORKLOG.md`

You (Coordinator) integrate in **phase order**, using the checklists in `CHECKLISTS/`.

---

## Golden rules (to avoid chaos)
1. **File ownership is absolute.** If an agent needs to change a file outside its scope, it must request the Coordinator to do it.
2. **No renames** unless explicitly assigned (renames cause cascading link breakage).
3. **Diffs over prose.** Agents must default to patches + verification commands.
4. **No “drive-by” fixes.** Each agent focuses on its target scope only.
5. **Every phase ends with a verification gate** (link check / navigation smoke test).

---

## The exact “Begin Operation” prompt (short form)
If you prefer a one-liner:

> Execute `01-KICKOFF_PROMPT.md` as the Coordinator. Spawn subagents A01–A12 and follow the ownership matrix and phase gates. Output patches + verification + work logs.

However, the recommended approach remains to paste `01-KICKOFF_PROMPT.md` verbatim.

---

## Files in this pack
- `01-KICKOFF_PROMPT.md` — **paste into Copilot to start**
- `02-COORDINATOR_RUNBOOK.md` — how to sequence and merge
- `03-FILE_OWNERSHIP_MATRIX.md` — conflict-avoidance contract
- `AGENTS/*.md` — instructions per subagent
- `TEMPLATES/*.md` — copy/paste templates for consistent output
- `CHECKLISTS/*.md` — phase gates and acceptance tests
