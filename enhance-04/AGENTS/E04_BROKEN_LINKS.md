# E04_BROKEN_LINKS — Fix All Broken Internal Links

## Mission
Fix all 35+ broken internal links identified in `cleanup-instructions.md` Phase 4.4.

This is a surgical task: fix links ONLY, do not restructure content.

---

## File ownership (absolute)

**Owned paths (link fixes only):**
- `.START_HERE.md`
- `docs/content/sprint-02/README.md`
- `docs/content/sprint-02/SPRINT_2_PROGRAM.md`
- `docs/content/sprint-03/README.md`
- `docs/content/sprint-03/sprint-packet/BE_TASKS.md`
- `docs/content/sprint-03/sprint-packet/FE_TASKS.md`
- `docs/content/sprint-03/sprint-packet/README.md`
- `docs/content/sprint-04/sprint-packet/BE_TASKS.md`
- `docs/content/sprint-04/sprint-packet/FE_TASKS.md`
- `docs/content/sprint-04/sprint-packet/README.md`
- `docs/content/week-01/FAQ.md`
- `docs/content/week-01/WEEK_1_PROGRAM.md`
- `docs/content/week-01/micro-labs/LAB_2_SCAFFOLD_VERTICAL_SLICE.md`
- `docs/content/week-01/micro-labs/LAB_3_TESTS_FIRST.md`
- `docs/content/week-01/micro-labs/LAB_4_REFACTOR_GUARDED.md`
- `docs/content/week-01/micro-labs/LAB_5_OPENSHIFT_READINESS.md`
- `docs/content/week-01/micro-labs/LAB_6_CAPSTONE_MINI_FEATURE.md`
- `docs/content/week-04/templates/SPRINT_PACKET_TEMPLATE.md`

**Must NOT edit:**
- Content restructuring
- Navigation rails
- Any file not in the broken links table

---

## Recon Gate (mandatory before edits)

Before making any changes:

1. **Read `cleanup-instructions.md` Phase 4.4** — extract the complete broken links table
2. **Verify each broken link still exists** — some may have been fixed already
3. **Count actual broken links remaining**

**Output your recon findings before proceeding.**

---

## Broken Links Table (from cleanup-instructions.md)

Apply these replacements:

| Source file | Broken link | Replace with |
|---|---|---|
| `.START_HERE.md` | `../.MASTER_BOOTCAMP.md` | `.MASTER_BOOTCAMP.md` |
| `.START_HERE.md` | `../copilot-remarks.md` | `copilot-remarks.md` |
| `.START_HERE.md` | `content/sprint-01/README.md` | `docs/content/sprint-01/README.md` |
| `.START_HERE.md` | `content/sprint-02/README.md` | `docs/content/sprint-02/README.md` |
| `.START_HERE.md` | `content/sprint-03/README.md` | `docs/content/sprint-03/README.md` |
| `.START_HERE.md` | `content/sprint-04/README.md` | `docs/content/sprint-04/README.md` |
| `.START_HERE.md` | `content/week-01/FAQ.md` | `docs/content/week-01/FAQ.md` |
| `.START_HERE.md` | `content/week-01/README.md` | `docs/content/week-01/README.md` |
| `.START_HERE.md` | `content/week-02/README.md` | `docs/content/week-02/README.md` |
| `.START_HERE.md` | `content/week-03/README.md` | `docs/content/week-03/README.md` |
| `.START_HERE.md` | `content/week-04/README.md` | `docs/content/week-04/README.md` |
| `.START_HERE.md` | `shared/ceremonies-process/README.md` | `docs/shared/ceremonies-process/README.md` |
| `.START_HERE.md` | `shared/reference-materials/DEFINITION_OF_DONE.md` | `docs/shared/reference-materials/DEFINITION_OF_DONE.md` |
| `.START_HERE.md` | `shared/reference-materials/DOMAIN_CONTEXT.md` | `docs/shared/reference-materials/DOMAIN_CONTEXT.md` |
| `.START_HERE.md` | `shared/reference-materials/PROMPT_PACK_V1.md` | `docs/shared/reference-materials/PROMPT_PACK_V1.md` |
| `docs/content/sprint-02/README.md` | `../../.MASTER_BOOTCAMP.md` | `../../../.MASTER_BOOTCAMP.md` |
| `docs/content/sprint-02/SPRINT_2_PROGRAM.md` | `../../.github/instructions/backend.instructions.md` | `../../../.github/instructions/backend.instructions.md` |
| `docs/content/sprint-02/SPRINT_2_PROGRAM.md` | `../../.github/instructions/frontend.instructions.md` | `../../../.github/instructions/frontend.instructions.md` |
| `docs/content/sprint-02/SPRINT_2_PROGRAM.md` | `../../.github/instructions/testing.instructions.md` | `../../../.github/instructions/testing.instructions.md` |
| `docs/content/sprint-03/README.md` | `../../.github/instructions/testing.instructions.md` | `../../../.github/instructions/testing.instructions.md` |
| `docs/content/sprint-03/sprint-packet/BE_TASKS.md` | `../../../.github/instructions/backend.instructions.md` | `../../../../.github/instructions/backend.instructions.md` |
| `docs/content/sprint-03/sprint-packet/BE_TASKS.md` | `../../../.github/instructions/testing.instructions.md` | `../../../../.github/instructions/testing.instructions.md` |
| `docs/content/sprint-03/sprint-packet/FE_TASKS.md` | `../../../.github/instructions/testing.instructions.md` | `../../../../.github/instructions/testing.instructions.md` |
| `docs/content/sprint-03/sprint-packet/README.md` | `../../../.github/instructions/backend.instructions.md` | `../../../../.github/instructions/backend.instructions.md` |
| `docs/content/sprint-03/sprint-packet/README.md` | `../../../.github/instructions/frontend.instructions.md` | `../../../../.github/instructions/frontend.instructions.md` |
| `docs/content/sprint-03/sprint-packet/README.md` | `../../../.github/instructions/testing.instructions.md` | `../../../../.github/instructions/testing.instructions.md` |
| `docs/content/sprint-04/sprint-packet/BE_TASKS.md` | `../../../.github/instructions/backend.instructions.md` | `../../../../.github/instructions/backend.instructions.md` |
| `docs/content/sprint-04/sprint-packet/FE_TASKS.md` | `../../../.github/instructions/frontend.instructions.md` | `../../../../.github/instructions/frontend.instructions.md` |
| `docs/content/sprint-04/sprint-packet/README.md` | `../../../.github/instructions/backend.instructions.md` | `../../../../.github/instructions/backend.instructions.md` |
| `docs/content/sprint-04/sprint-packet/README.md` | `../../../.github/instructions/frontend.instructions.md` | `../../../../.github/instructions/frontend.instructions.md` |
| `docs/content/week-01/FAQ.md` | `../working/` | `../../../working/` |
| `docs/content/week-01/WEEK_1_PROGRAM.md` | `../../.START_HERE.md` | `../../../.START_HERE.md` |
| `docs/content/week-01/micro-labs/LAB_2_SCAFFOLD_VERTICAL_SLICE.md` | `../DOMAIN_CONTEXT.md` | `../../../shared/reference-materials/DOMAIN_CONTEXT.md` |
| `docs/content/week-01/micro-labs/LAB_3_TESTS_FIRST.md` | `../DOMAIN_CONTEXT.md` | `../../../shared/reference-materials/DOMAIN_CONTEXT.md` |
| `docs/content/week-01/micro-labs/LAB_4_REFACTOR_GUARDED.md` | `../DOMAIN_CONTEXT.md` | `../../../shared/reference-materials/DOMAIN_CONTEXT.md` |
| `docs/content/week-01/micro-labs/LAB_5_OPENSHIFT_READINESS.md` | `../DOMAIN_CONTEXT.md` | `../../../shared/reference-materials/DOMAIN_CONTEXT.md` |
| `docs/content/week-01/micro-labs/LAB_6_CAPSTONE_MINI_FEATURE.md` | `../DOMAIN_CONTEXT.md` | `../../../shared/reference-materials/DOMAIN_CONTEXT.md` |
| `docs/content/week-04/templates/SPRINT_PACKET_TEMPLATE.md` | `../week-03/adrs/002-error-handling.md` | `../../week-03/adrs/002-error-handling.md` |

---

## Tasks

### Task 1: Verify each broken link
For each link in the table, check if it's still broken.

### Task 2: Apply fixes
Apply each replacement from the table above.

### Task 3: Run link check
```bash
npm run check:links
```
Or manually verify links resolve.

### Task 4: Report any additional broken links found
If you discover broken links not in the table, report them but do not fix (request Coordinator).

---

## Output contract (mandatory)

Return:
1. **Plan** (list of files to fix and link count per file)
2. **Patch** (unified diff for each file)
3. **Verification commands** (link check results)
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E04_BROKEN_LINKS_WORKLOG.md`

---

## Success criteria
- [ ] All 35+ broken links from the table are fixed
- [ ] Link check passes with 0 internal broken links
- [ ] No content was changed (only link paths)
- [ ] Any additional discovered broken links are reported

---

## Coordination note
E05_LAB_TIEBACKS will also edit Week 1 lab files AFTER you complete.
Your changes should be merged first (Phase 2) before E05 starts (Phase 3).
