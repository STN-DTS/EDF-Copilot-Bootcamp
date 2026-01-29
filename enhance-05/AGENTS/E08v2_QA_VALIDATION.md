# E08v2_QA_VALIDATION — Enhanced QA Sweep Agent

## Mission
Final QA pass with link checking, doc consistency, and test verification.

**Spawned via:** `runSubagent` tool  
**Phase:** 6 (Validation) — Runs after all other agents complete  
**Dependencies:** All E12-E22 agents must have signals

---

## File ownership (absolute)

**Owned paths:**
- Read-only access to entire repository
- Creates report: `enhance-05/WORK_PRODUCTS/QA_REPORT.md`
- Creates signal: `enhance-05/WORK_PRODUCTS/SIGNALS/E08v2_COMPLETE.signal`

**Must NOT edit:**
- Any production files
- Any agent files
- Any work logs (except creating QA report)

---

## Recon Gate (mandatory before running)

Before running validation, verify all phase 1-5 agents are complete:

```bash
# Check all signals exist
ls enhance-05/WORK_PRODUCTS/SIGNALS/

# Expected signals:
# E12_COMPLETE.signal
# E13_COMPLETE.signal
# E14_COMPLETE.signal
# E15_COMPLETE.signal
# E16_COMPLETE.signal
# E17_COMPLETE.signal
# E18_COMPLETE.signal
# E19_COMPLETE.signal
# E20_COMPLETE.signal
# E21_COMPLETE.signal
# E22_COMPLETE.signal
```

If any signals are missing, STOP and report to coordinator.

**Output your recon findings before proceeding.**

---

## Validation Checks

### Check 1: Broken Links

Run link checker and document any failures:

```bash
npm run check:links
```

**Record:**
- Number of links checked
- Number of broken links
- List of broken links with file locations

### Check 2: Package.json Consistency

```bash
# Verify all scripts exist
npm run --list

# Test each new script
npm run bootcamp:list
npm run validate:all -- --quick
npm run progress:alerts -- --cohort 2026-01
```

**Record:**
- Which scripts work
- Which scripts fail
- Error messages

### Check 3: Documentation Sync

Verify key files are updated:

```bash
# Check README references bootcamp runner
grep -l "bootcamp" *.md

# Check MASTER index is current
head -100 .MASTER_BOOTCAMP.md

# Check START_HERE is current
head -50 .START_HERE.md
```

**Record:**
- Outdated references
- Missing documentation
- Inconsistent naming

### Check 4: Test Verification

Run sample commands to verify functionality:

```bash
# Test bootcamp runner
npm run bootcamp -- step week-01-lab-00

# Test dry-run mode
npm run bootcamp -- step week-01-lab-00 --dry-run

# Test progress system
npm run progress:init -- --name "QA Test" --github qatest --cohort qa-verify --track backend --dry-run
```

**Record:**
- Pass/fail for each test
- Error output if failed
- Performance notes

### Check 5: File Structure

Verify expected files exist:

```bash
# New utility files
ls scripts/utils/

# Expected:
# path-utils.mjs
# lab-discovery.mjs
# dry-run.mjs

# Scaffolds
ls enhance-05/SCAFFOLDS/

# Expected:
# create-signal.mjs
# validate-signals.mjs
# create-worklog.mjs

# Playbooks
ls enhance-05/PLAYBOOKS/

# Expected:
# README.md
# ERROR_RECOVERY.md
# COMMON_FAILURES.md
```

**Record:**
- Missing files
- Extra unexpected files
- File location issues

### Check 6: Work Log Completeness

Verify all agents created work logs:

```bash
ls enhance-05/WORK_PRODUCTS/*_WORKLOG.md
```

**Record:**
- Missing work logs
- Incomplete work logs
- Quality issues

### Check 7: Signal File Validation

```bash
# Run signal validator
node enhance-05/SCAFFOLDS/validate-signals.mjs E12 E13 E14 E15 E16 E17 E18 E19 E20 E21 E22

# Or check manually
ls -la enhance-05/WORK_PRODUCTS/SIGNALS/
```

**Record:**
- Missing signals
- Invalid signal format
- Signal content

---

## Output: QA Report

Create `enhance-05/WORK_PRODUCTS/QA_REPORT.md`:

```markdown
# enhance-05 QA Validation Report

**Date:** [Date]
**Validator:** E08v2_QA_VALIDATION agent

---

## Executive Summary

| Check | Status | Notes |
|-------|--------|-------|
| Broken Links | ✅/⚠️/❌ | X issues found |
| Package.json | ✅/⚠️/❌ | X issues found |
| Documentation | ✅/⚠️/❌ | X issues found |
| Tests | ✅/⚠️/❌ | X issues found |
| File Structure | ✅/⚠️/❌ | X issues found |
| Work Logs | ✅/⚠️/❌ | X issues found |
| Signals | ✅/⚠️/❌ | X issues found |

**Overall Status:** [PASS / PASS WITH WARNINGS / FAIL]

---

## Detailed Findings

### 1. Broken Links

[List of broken links or "No broken links found"]

### 2. Package.json Issues

[List of issues or "All scripts verified"]

### 3. Documentation Issues

[List of issues or "Documentation is consistent"]

### 4. Test Results

| Test | Result | Notes |
|------|--------|-------|
| Bootcamp runner | ✅/❌ | |
| Dry-run mode | ✅/❌ | |
| Progress init | ✅/❌ | |

### 5. File Structure Issues

[List of missing/extra files or "Structure is correct"]

### 6. Work Log Issues

[List of issues or "All work logs complete"]

### 7. Signal Issues

[List of issues or "All signals present"]

---

## Recommendations

1. [Priority 1 fix]
2. [Priority 2 fix]
3. [Future improvement for enhance-06]

---

## Verification Commands Run

```bash
[List all commands run during validation]
```

---

## Sign-Off

- [ ] All critical issues addressed
- [ ] Warnings documented
- [ ] Ready for merge/release
```

---

## Output contract (mandatory)

Return:
1. **Recon findings** (signal status)
2. **QA Report** at: `enhance-05/WORK_PRODUCTS/QA_REPORT.md`
3. **Summary** of findings (for coordinator)
4. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E08v2_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- QA automation opportunities
- Missing validation checks
- Process improvements for enhance-06

---

## Success Criteria

- [ ] All 7 validation checks run
- [ ] QA_REPORT.md created
- [ ] Critical issues documented
- [ ] Recommendations provided
- [ ] Signal file created
- [ ] Findings reported to coordinator
