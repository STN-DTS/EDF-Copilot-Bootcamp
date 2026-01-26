# E05_LAB_TIEBACKS — Add Tie-Backs and Tie-Forwards to Week 1 Labs

## Mission
Add pedagogical tie-back and tie-forward sections to all 7 Week 1 labs to help learners connect concepts across the curriculum.

**Tie-backs** anchor new concepts to prior learning.
**Tie-forwards** create anticipation and show relevance of current learning.

---

## File ownership (absolute)

**Owned paths:**
- `docs/content/week-01/micro-labs/LAB_0_SETUP.md`
- `docs/content/week-01/micro-labs/LAB_1_PLAN_ONLY.md`
- `docs/content/week-01/micro-labs/LAB_2_SCAFFOLD_VERTICAL_SLICE.md`
- `docs/content/week-01/micro-labs/LAB_3_TESTS_FIRST.md`
- `docs/content/week-01/micro-labs/LAB_4_REFACTOR_GUARDED.md`
- `docs/content/week-01/micro-labs/LAB_5_OPENSHIFT_READINESS.md`
- `docs/content/week-01/micro-labs/LAB_6_CAPSTONE_MINI_FEATURE.md`

**Must NOT edit:**
- Links (E04 handles those)
- Sprint docs
- Other week docs
- Navigation rails (already exist)

---

## Recon Gate (mandatory before edits)

Before making any changes:

1. **Read each lab file** to understand current structure
2. **Identify where to insert** tie-back/tie-forward sections (after Goal, before Steps)
3. **Map the learning progression** across labs

**Output your recon findings before proceeding.**

---

## Learning Progression Map

Use this to write appropriate tie-backs and tie-forwards:

| Lab | Core Concept | Builds On | Leads To |
|-----|--------------|-----------|----------|
| Lab 0 | Setup + First PR | (entry point) | Lab 1 plan-first workflow |
| Lab 1 | Plan-Only (P0 mandate) | Lab 0 environment | Lab 2 scaffolding with plan |
| Lab 2 | Vertical Slice Scaffold | Lab 1 planning | Lab 3 testing the scaffold |
| Lab 3 | TDD / Tests First | Lab 2 scaffold | Lab 4 safe refactoring |
| Lab 4 | Refactor Guarded | Lab 3 test coverage | Lab 5 deployment readiness |
| Lab 5 | OpenShift Readiness | Lab 4 clean code | Lab 6 full feature |
| Lab 6 | Capstone Mini-Feature | All prior labs | Week 2 constraints + Sprints |

---

## Section templates to add

### 🔙 Building On (Tie-Back)
Add after the "Goal" section, before "Prerequisites" or "Steps":

```markdown
---

## 🔙 Building On

In **[previous lab]**, you learned **[concept]**. This lab extends that by **[how this lab builds on it]**.

**Key connection:** [One sentence linking prior learning to current task]

---
```

### 🔜 Looking Ahead (Tie-Forward)
Add after "Success Criteria" or "Definition of Done", before "Navigation":

```markdown
---

## 🔜 Looking Ahead

The **[skill/pattern]** you practice here will be essential in:
- **[Lab X]** — where you'll [application]
- **[Week Y / Sprint Z]** — where you'll [larger application]

---
```

---

## Tasks

### Task 1: Add tie-back to each lab

**Lab 0:**
```markdown
## 🔙 Building On

This is your entry point to AI-assisted development. You're bringing your existing development skills and learning to augment them with Copilot.

**Key connection:** Your prior experience with version control, builds, and PRs is the foundation—now we add AI to the workflow.
```

**Lab 1:**
```markdown
## 🔙 Building On

In **Lab 0**, you verified your environment and submitted your first PR. Now you'll learn the most important discipline: **always get a plan before writing code**.

**Key connection:** The PR workflow from Lab 0 stays the same—we're adding a mandatory planning step before any code changes.
```

**Lab 2:**
```markdown
## 🔙 Building On

In **Lab 1**, you practiced getting a plan from Copilot before coding. Now you'll use that plan to scaffold a complete vertical slice—from endpoint to database.

**Key connection:** The plan you create in this lab follows the same P0 pattern, but now you'll execute on it.
```

**Lab 3:**
```markdown
## 🔙 Building On

In **Lab 2**, you scaffolded a vertical slice. Now you'll add tests FIRST, before the implementation—true TDD with AI assistance.

**Key connection:** The scaffold from Lab 2 gives you something to test. Tests verify the AI-generated code actually works.
```

**Lab 4:**
```markdown
## 🔙 Building On

In **Lab 3**, you built a test suite that verifies your code works. Now those tests become your safety net for refactoring.

**Key connection:** Without Lab 3's tests, refactoring would be risky. With them, you can change code confidently.
```

**Lab 5:**
```markdown
## 🔙 Building On

In **Lab 4**, you refactored code safely using your test suite. Now you'll prepare that code for production deployment on OpenShift.

**Key connection:** Clean, tested code from Labs 3-4 is much easier to containerize and deploy.
```

**Lab 6:**
```markdown
## 🔙 Building On

You've completed Labs 0-5: setup, planning, scaffolding, testing, refactoring, and deployment prep. This capstone combines ALL those skills into one mini-feature.

**Key connection:** Every skill from this week will be used in this lab—and throughout the Sprints ahead.
```

### Task 2: Add tie-forward to each lab

**Lab 0:**
```markdown
## 🔜 Looking Ahead

The **PR workflow** you practice here is used in every lab going forward. The **verification habit** (running build/tests before submitting) becomes critical in:
- **Lab 3** — where test failures block your PR
- **Sprints 1-4** — where CI gates enforce this automatically
```

**Lab 1:**
```markdown
## 🔜 Looking Ahead

The **plan-first discipline** (P0 mandate) you practice here is the foundation for everything:
- **Lab 2** — you'll execute on a plan to build a vertical slice
- **Week 2** — you'll extract constraints from plans
- **All Sprints** — every feature starts with a plan
```

**Lab 2:**
```markdown
## 🔜 Looking Ahead

The **vertical slice pattern** you practice here appears throughout:
- **Lab 3** — you'll add tests to this slice
- **Sprint 1** — you'll build full features as vertical slices
- **Week 4** — you'll define contracts before building slices
```

**Lab 3:**
```markdown
## 🔜 Looking Ahead

The **TDD discipline** you practice here is essential for:
- **Lab 4** — tests enable safe refactoring
- **Sprint 2** — NFR checklist requires test coverage
- **Sprint 3** — security tests verify hardening
```

**Lab 4:**
```markdown
## 🔜 Looking Ahead

The **guarded refactoring pattern** you practice here applies to:
- **Lab 6** — capstone requires clean, maintainable code
- **Sprint 2** — performance optimization requires safe refactoring
- **Sprint 4** — production polish involves significant refactoring
```

**Lab 5:**
```markdown
## 🔜 Looking Ahead

The **deployment readiness patterns** you practice here are directly used in:
- **Sprint 1** — you'll deploy your first feature to staging
- **Sprint 3** — security hardening builds on these configs
- **Sprint 4** — production deployment uses these patterns
```

**Lab 6:**
```markdown
## 🔜 Looking Ahead

This capstone prepares you for the real work ahead:
- **Week 2** — you'll learn to capture constraints before building
- **Week 3** — you'll write architectural decisions (ADRs)
- **Week 4** — you'll define contracts before implementation
- **Sprints 1-4** — you'll build production features using all these skills
```

---

## Output contract (mandatory)

Return:
1. **Plan** (brief, confirm lab structure understood)
2. **Patch** (unified diff for each lab file)
3. **Verification** (show each lab has both sections)
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E05_LAB_TIEBACKS_WORKLOG.md`

---

## Success criteria
- [ ] All 7 labs have "🔙 Building On" section
- [ ] All 7 labs have "🔜 Looking Ahead" section  
- [ ] Sections are placed consistently (after Goal, before Navigation)
- [ ] Content accurately reflects the learning progression
- [ ] No other content was changed

---

## Coordination note
E04_BROKEN_LINKS may also edit these files for link fixes.
Wait for Phase 2 to complete before starting your edits, OR coordinate with Coordinator to avoid overlapping lines.
