# E08_QA_VALIDATION — Final Quality Assurance

## Mission
Validate all enhancement work from Phases 1-3.5. Run comprehensive checks and report any issues for remediation.

**This is a read-only validation agent.** Report issues but do not make edits.

---

## File ownership (absolute)

**Owned paths:**
- `enhance-04/WORK_PRODUCTS/E08_QA_VALIDATION_WORKLOG.md` (create new)

**Read-only access to all files** — validation only, no edits

---

## Pre-Flight Verification (Task 0)

Before starting any validation tasks, verify infrastructure health:

```bash
# 1. Node.js available
node --version && echo "✅ Node OK"

# 2. Dependencies installed
npm list --depth=0 && echo "✅ Dependencies OK"

# 3. Git status clean (no uncommitted changes from prior agents)
git status --short && echo "✅ Git status checked"

# 4. All signal files present
ls enhance-04/WORK_PRODUCTS/SIGNALS/*.signal 2>/dev/null | wc -l
echo "Expected: at least 4 signals (E01, E02, E09, E10)"
```

**If pre-flight fails, STOP and report to Coordinator.**

---

## Recon Gate (mandatory before validation)

Before running validation:

1. **Confirm all prior phases completed:**
   - Phase 1: E01 + E02 work products exist
   - Phase 2: E03 + E04 work products exist
   - Phase 2.5: E09 + E10 work products exist
   - Phase 3: E05 + E06 + E07 work products exist

2. **List all work product logs** in `enhance-04/WORK_PRODUCTS/`

3. **Check signal files** in `enhance-04/WORK_PRODUCTS/SIGNALS/`

**Output your recon findings before proceeding.**

---

## Validation Tasks

### Task 1: Link Check
Run comprehensive link validation:

```bash
npm run check:links
```

**Expected:** 0 broken internal links

**Report:**
- Total links checked
- Broken links found (list each with file and line)
- External links status (if checked)

---

### Task 2: Runner Validation
Test the bootcamp runner:

```bash
# List all steps
npm run bootcamp:list

# Test specific steps
npm run bootcamp -- step week-01-lab-00
npm run bootcamp -- step week-01-lab-06
npm run bootcamp -- step sprint-01-step-00
npm run bootcamp -- step sprint-04-step-00
```

**Expected:** All commands complete without error, output is readable

**Report:**
- Number of steps listed
- Sample output from each test command
- Any errors or warnings

---

### Task 3: VS Code Integration
Verify VS Code configuration:

1. **Extensions recommended:**
   - Open VS Code in repo
   - Check Extensions panel for recommendations
   
2. **Tasks available:**
   - Open Command Palette → Tasks: Run Task
   - Verify bootcamp tasks appear

**Report:**
- Extensions recommendations showing (yes/no)
- List of available tasks
- Any missing or broken tasks

---

### Task 4: Navigation Smoke Test
Manual navigation test through content:

**Path 1: Week 1 Full Journey**
1. Start at `.START_HERE.md`
2. Navigate to Week 1 README
3. Navigate through Lab 0 → Lab 1 → Lab 2 → Lab 3 → Lab 4 → Lab 5 → Lab 6
4. Use only "Next" links in nav rails

**Path 2: Sprint Journey**
1. Start at `.START_HERE.md`
2. Navigate to Sprint 1 README
3. Navigate to Sprint 2 → Sprint 3 → Sprint 4

**Report:**
- All nav rails present (yes/no per lab)
- All nav links work (yes/no per link)
- Any missing or broken navigation

---

### Task 5: Content Validation
Verify enhancement content:

1. **Progress Tracker:**
   - Exists at `docs/participants/PROGRESS_TRACKER.md`
   - Linked from `.START_HERE.md`
   - Linked from root `README.md`
   - Contains all weeks and sprints

2. **Tie-backs/Tie-forwards:**
   - Lab 0-6 each have "🔙 Building On" section
   - Lab 0-6 each have "🔜 Looking Ahead" section

3. **Assessment Framework:**
   - Exists at `docs/shared/ASSESSMENT_FRAMEWORK.md`
   - Linked from shared README
   - Covers all weeks and sprints

4. **FAQs:**
   - Week 3 FAQ exists
   - Sprint 1-4 FAQs exist
   - FAQs linked from READMEs

**Report:**
- Checklist status for each item
- Missing or incomplete items

---

### Task 6: Student Progression System Validation
Verify E09 + E10 progression system:

```bash
# 1. Progress folder exists
ls progress/ && echo "✅ Progress folder OK"

# 2. Scripts exist
ls progress/scripts/*.mjs && echo "✅ Scripts exist"

# 3. Template exists
cat progress/STUDENT_TEMPLATE.md | head -20 && echo "✅ Template OK"

# 4. Test initialization
npm run progress:init -- --name "QA Test" --github qatest --cohort qa-test --track backend

# 5. Test update
npm run progress:update -- --github qatest --cohort qa-test --lab lab-00 --status complete

# 6. Test dashboard generation
npm run progress:dashboard -- --cohort qa-test

# 7. Test alerts
npm run progress:alerts -- --cohort qa-test

# 8. Cleanup test data
rm -rf progress/cohorts/qa-test
rm progress/DASHBOARD_qa-test.md 2>/dev/null

echo "✅ Progression system validation complete"
```

**Report:**
- All scripts exist (yes/no)
- Init command works (yes/no)
- Update command works (yes/no)
- Dashboard generation works (yes/no)
- Alert system works (yes/no)
- Any errors or issues

---

### Task 7: File Structure Validation
Verify expected file structure:

```
bootcamp/
├── steps/
│   ├── index.yaml
│   ├── week-01/ (7 YAML files)
│   ├── week-02/
│   ├── week-03/
│   ├── week-04/
│   ├── sprint-01/
│   ├── sprint-02/
│   ├── sprint-03/
│   └── sprint-04/
progress/
├── README.md
├── STUDENT_TEMPLATE.md
├── scripts/
│   ├── init-student.mjs
│   ├── update-progress.mjs
│   ├── generate-dashboard.mjs
│   └── check-alerts.mjs
└── cohorts/ (folder structure ready)
scripts/
└── bootcamp.mjs
.vscode/
├── extensions.json
├── settings.json
└── tasks.json
.github/
└── workflows/
    └── update-dashboard.yml (optional)
docs/
├── participants/
│   ├── README.md
│   └── PROGRESS_TRACKER.md
└── shared/
    └── ASSESSMENT_FRAMEWORK.md
```

**Report:**
- All expected files present (yes/no per file)
- Any unexpected files or structure issues

---

### Task 8: Copilot Instructions Validation
Verify E11 Copilot course agent setup:

```bash
# 1. Student navigation instructions exist
ls .github/instructions/student-navigation.instructions.md && echo "✅ Student navigation OK"

# 2. Course commands quick reference exists
ls COPILOT_COURSE_COMMANDS.md && echo "✅ Course commands OK"

# 3. Copilot instructions has Student Course Navigation section
grep -q "Student Course Navigation" .github/copilot-instructions.md && echo "✅ Section added OK"

# 4. Verify referenced paths in copilot-instructions exist
# Check key paths mentioned in copilot-instructions.md
ls .START_HERE.md && echo "✅ START_HERE exists"
ls docs/shared/reference-materials/DOMAIN_CONTEXT.md && echo "✅ DOMAIN_CONTEXT exists"
ls .github/instructions/backend.instructions.md 2>/dev/null && echo "✅ Backend instructions OK"
ls .github/instructions/frontend.instructions.md 2>/dev/null && echo "✅ Frontend instructions OK"
```

**Manual Copilot Chat Test (REQUIRED):**

Open Copilot Chat and test these scenarios:

| Test | Say This | Expected Response |
|------|----------|-------------------|
| Onboarding | "Start the bootcamp" | Welcome message, track selection question |
| Progress check | "Where did I leave off?" | Request for username/cohort |
| Lab start | "Start Lab 0" | Lab details or request to show |
| Help | "I'm stuck" | Request for context about the issue |

**Report:**
- All E11 files exist (yes/no)
- Copilot instructions updated (yes/no)
- Manual test results for each scenario
- Any issues with Copilot responses

---

### Task 9: Rollback Drill (Optional but Recommended)
Test that rollback procedures work:

1. **Create a test file:**
   ```bash
   echo "ROLLBACK TEST" > .rollback-test.md
   git add .rollback-test.md
   git commit -m "test: rollback drill"
   ```

2. **Revert the commit:**
   ```bash
   git revert --no-commit HEAD
   git checkout -- .
   ```

3. **Verify clean state:**
   ```bash
   ls .rollback-test.md 2>/dev/null && echo "❌ Rollback failed" || echo "✅ Rollback OK"
   git status --short
   ```

**Report:**
- Rollback procedure works (yes/no)
- Any issues encountered

---

## Output contract (mandatory)

Return:
1. **Validation Summary** (pass/fail per task)
2. **Detailed Findings** (issues found with severity)
3. **Remediation Recommendations** (for any failures)
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E08_QA_VALIDATION_WORKLOG.md`

---

## Severity Levels

| Severity | Description | Action Required |
|----------|-------------|-----------------|
| **Critical** | Blocks user progress | Must fix before merge |
| **High** | Significant UX issue | Should fix before merge |
| **Medium** | Minor issue, workaround exists | Can fix in follow-up |
| **Low** | Cosmetic or enhancement | Log for future |

---

## Success criteria for Enhancement Pack 04

All of the following must pass:

- [ ] Pre-flight: Infrastructure healthy
- [ ] Link check: 0 broken internal links
- [ ] Runner: all commands work
- [ ] VS Code: extensions + tasks configured
- [ ] Navigation: all rails work
- [ ] Progress Tracker: exists and linked
- [ ] Tie-backs: all 7 labs have both sections
- [ ] Assessment Framework: exists and linked
- [ ] FAQs: all 5 new FAQs exist
- [ ] Progression System: all 4 scripts work (E09+E10)
- [ ] Copilot Integration: E11 files exist and manual test passes
- [ ] File structure: matches expected

---

## Error Recovery Procedures

If validation fails:

1. **Link check fails:**
   - Re-run E04 with updated broken link list
   - Verify links are relative, not absolute

2. **Runner fails:**
   - Check E01 work log for issues
   - Verify `bootcamp/steps/` YAML files exist

3. **Progression system fails:**
   - Check E09 signal file for status
   - Verify `progress/scripts/` has all 4 mjs files
   - Check package.json has all 4 progress scripts

4. **Navigation fails:**
   - Re-run E05 for missing tie-back sections
   - Check E04 for broken nav rail links

5. **Copilot integration fails:**
   - Check E11 work log for issues
   - Verify `.github/copilot-instructions.md` has new section
   - Verify `.github/instructions/` folder exists
   - Re-run manual Copilot Chat test

6. **Copilot triggers not working:**
   - Verify `.github/instructions/student-navigation.instructions.md` trigger phrases match exactly
   - Check that copilot-instructions.md correctly references the instructions file
   - Restart VS Code to reload Copilot instructions cache
   - Test with exact trigger phrase wording (e.g., "Start the bootcamp" not "begin bootcamp")
   - Verify no syntax errors in instruction files (YAML-like format must be valid)
   - Check VS Code Output panel → "GitHub Copilot" for errors

7. **Student progress file not found:**
   - Verify student ran `npm run progress:init` first
   - Check cohort folder exists at `progress/cohorts/{cohort}/`
   - Verify username matches exactly (case-sensitive)
   - Check for typos in cohort ID (format: YYYY-MM)

---

## Escalation

If critical issues found:
1. Report immediately to Coordinator
2. Identify responsible agent (E01-E07)
3. Request remediation before final merge

Do NOT attempt to fix issues yourself—you are read-only.
