# E15_WEEK2-4_TIEBACKS — Week 2-4 Lab Tie-Backs

## Mission
Add tie-back and tie-forward sections to all Week 2, Week 3, and Week 4 lab files.

**Spawned via:** `runSubagent` tool  
**Phase:** 3 (Content Extension) — Large scope, sequential execution  
**Dependencies:** enhance-04 E05 (pattern established in Week 1)

---

## File ownership (absolute)

**Owned paths:**
- `docs/content/week-02/micro-labs/*.md` (all lab files)
- `docs/content/week-03/micro-labs/*.md` (all lab files)
- `docs/content/week-04/micro-labs/*.md` (all lab files)

**Scope:** Add tie-back/tie-forward sections ONLY

**Must NOT edit:**
- `docs/content/week-01/**` (already done in enhance-04)
- Sprint docs
- Any scripts

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Week 2-4 lab folders exist:**
   ```bash
   ls docs/content/week-02/micro-labs/
   ls docs/content/week-03/micro-labs/
   ls docs/content/week-04/micro-labs/
   ```

2. **Week 1 labs have tie-backs (pattern reference):**
   ```bash
   grep "Building On" docs/content/week-01/micro-labs/LAB_1_PLAN_ONLY.md
   ```

3. **List all Week 2-4 lab files** to understand scope

**Output your recon findings before proceeding.**

---

## Agent Health Check (run first)

```bash
# Can write to docs folder
echo "test" > docs/.test-write && rm docs/.test-write && echo "✅ Write OK"

# Lab files exist
ls docs/content/week-02/micro-labs/*.md | wc -l
ls docs/content/week-03/micro-labs/*.md | wc -l
ls docs/content/week-04/micro-labs/*.md | wc -l
```

**If any health check fails, report and do not proceed.**

---

## Template

Use this template for tie-back/tie-forward sections:

```markdown
---

## 🔙 Building On

This lab builds on concepts from:
- **[Previous Lab/Week]:** [What you learned that applies here]
- **[Related Concept]:** [Skill or pattern being applied]

---

## 🔜 Looking Ahead

What you learn here prepares you for:
- **[Next Lab/Sprint]:** [How this connects forward]
- **[Application]:** [Where you'll use this skill]
```

---

## Tasks

### Task 1: Analyze Week 2-4 content structure

Read each lab file to understand:
- What the lab teaches
- Prerequisites from earlier labs
- What builds on this lab

### Task 2: Add tie-backs to Week 2 labs

For each lab in `docs/content/week-02/micro-labs/`:

**Lab 0 (Week 2):**
```markdown
## 🔙 Building On

This lab builds on concepts from:
- **Week 1 Labs:** Copilot interaction patterns and prompt engineering
- **Lab 6 (Week 1):** Full feature development workflow

---

## 🔜 Looking Ahead

What you learn here prepares you for:
- **Week 2 Labs 1-3:** Advanced constraint identification
- **Sprint 1:** Applying constraints to real project work
```

### Task 3: Add tie-backs to Week 3 labs

For each lab in `docs/content/week-03/micro-labs/`:

**Pattern:**
```markdown
## 🔙 Building On

This lab builds on concepts from:
- **Week 2:** Constraint register and specification patterns
- **Week 1:** Foundation skills in plan-first development

---

## 🔜 Looking Ahead

What you learn here prepares you for:
- **Week 4:** Contract-first development
- **Sprint 2-3:** Advanced implementation patterns
```

### Task 4: Add tie-backs to Week 4 labs

For each lab in `docs/content/week-04/micro-labs/`:

**Pattern:**
```markdown
## 🔙 Building On

This lab builds on concepts from:
- **Week 3:** Spec-first packaging concepts
- **Weeks 1-2:** All prior Copilot collaboration patterns

---

## 🔜 Looking Ahead

What you learn here prepares you for:
- **Sprints 3-4:** Production-ready development
- **Capstone:** Complete feature delivery
```

### Task 5: Verify placement consistency

Ensure tie-back sections are placed:
- After the main lab content
- Before any "Resources" or "Additional Notes" sections
- Consistent with Week 1 lab formatting

### Task 6: Cross-reference accuracy check

Verify all references point to actual labs/weeks that exist:
- No references to non-existent labs
- No circular references
- Logical progression maintained

---

## Output contract (mandatory)

Return:
1. **Recon findings** (list of all files to be modified)
2. **Plan** (brief, which labs get which tie-backs)
3. **Patch** (unified diff for each file modified)
4. **Verification commands** showing grep for tie-back sections
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E15_WEEK2-4_TIEBACKS_WORKLOG.md`
6. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E15_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Inconsistencies in lab structure across weeks
- Missing labs or unexpected file organization
- Content gaps that need addressing
- Suggestions for content improvements

---

## Success Criteria

- [ ] All Week 2 labs have "🔙 Building On" section
- [ ] All Week 2 labs have "🔜 Looking Ahead" section
- [ ] All Week 3 labs have tie-back sections
- [ ] All Week 3 labs have tie-forward sections
- [ ] All Week 4 labs have tie-back sections
- [ ] All Week 4 labs have tie-forward sections
- [ ] Cross-references are accurate (no broken links)
- [ ] Consistent formatting with Week 1 labs
- [ ] Work log created
- [ ] Signal file created
