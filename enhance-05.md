# enhance-05.md — Next Iteration Enhancement Pack

**Planned After:** enhance-04 completion  
**Focus:** Integration, Automation, and Extended Coverage  
**Estimated Agents:** 5-6  
**Dependency:** enhance-04 infrastructure must be stable  
**Pre-requisite Check:** Verify `enhance-04/SCAFFOLDS/` integration completed

---

## 📋 Executive Summary

Enhance-05 focuses on **reducing friction** in the student experience and **extending coverage** beyond Week 1. The primary goals are:

1. **Single-command workflows** — Integrate runner + progress tracking
2. **Data safety** — Add backup/restore for progress files
3. **Extended alerts** — Catch inactive students before they drop out
4. **Week 2-4 coverage** — Apply tie-back patterns to remaining weeks
5. **Technical debt cleanup** — Fix hardcoded lab mappings from enhance-04

---

## 🔧 Pre-requisites from enhance-04

Before starting enhance-05, confirm these enhance-04 deliverables are complete:

| Item | Verification Command | Expected |
|------|---------------------|----------|
| Bootcamp runner | `npm run bootcamp:list` | Lists all step IDs |
| Progress system | `npm run progress:init --help` | Shows usage |
| Copilot integration | Manual test "Start the bootcamp" | Copilot responds |
| Scaffold cleanup | `ls bootcamp_scaffolds*` | Folder deleted |

---

## 🎯 Enhancement Objectives

### E12: Runner + Progress Integration

**Problem:** Students must run two commands to start a lab:
```bash
npm run bootcamp -- step week-01-lab-02
npm run progress:update -- --github user --cohort 2026-01 --lab lab-02 --status in-progress
```

**Solution:** Add integration flags to `scripts/bootcamp.mjs`:

```javascript
// New unified command
// npm run bootcamp -- step week-01-lab-02 --mark-started jsmith --cohort 2026-01

if (args.includes('--mark-started')) {
  const username = args[args.indexOf('--mark-started') + 1];
  const cohort = args[args.indexOf('--cohort') + 1];
  execSync(`npm run progress:update -- --github ${username} --cohort ${cohort} --lab ${stepId} --status in-progress`);
}

if (args.includes('--mark-complete')) {
  const username = args[args.indexOf('--mark-complete') + 1];
  const cohort = args[args.indexOf('--cohort') + 1];
  const pr = args.includes('--pr') ? args[args.indexOf('--pr') + 1] : '';
  execSync(`npm run progress:update -- --github ${username} --cohort ${cohort} --lab ${stepId} --status complete --pr ${pr}`);
}
```

**File Ownership:**
- `scripts/bootcamp.mjs` — Add integration logic
- `package.json` — Add convenience scripts

**Acceptance Criteria:**
- [ ] `npm run bootcamp -- step week-01-lab-02 --mark-started jsmith --cohort 2026-01` works
- [ ] `npm run bootcamp -- step week-01-lab-02 --mark-complete jsmith --cohort 2026-01 --pr 42` works
- [ ] Backward compatible (flags are optional)
- [ ] Error handling for missing cohort/username

---

### E13: Progress Backup & Restore

**Problem:** No recovery mechanism if student progress files are corrupted or deleted.

**Solution:** Create backup/restore commands:

```bash
# Backup a cohort's progress
npm run progress:backup -- --cohort 2026-01

# Restore a cohort from backup
npm run progress:restore -- --cohort 2026-01 --date 2026-01-25

# List available backups
npm run progress:backups -- --cohort 2026-01
```

**File Ownership:**
- `progress/scripts/backup-cohort.mjs` (create new)
- `progress/scripts/restore-cohort.mjs` (create new)
- `progress/backups/.gitkeep` (create folder structure)
- `package.json` — Add backup/restore scripts

**Backup Format:**
```
progress/backups/
└── 2026-01/
    ├── 2026-01-25_143000.tar.gz
    ├── 2026-01-24_143000.tar.gz
    └── backup-manifest.json
```

**Acceptance Criteria:**
- [ ] Backup creates timestamped archive
- [ ] Restore restores from specific backup
- [ ] Manifest tracks all backups with metadata
- [ ] Old backups auto-pruned (keep last 10)

---

### E14: Extended Student Alerts

**Problem:** Current alerts only check for 3+ day stuck status. No handling for:
- Students inactive for 7+ days (potential drop-out)
- Labs in IN_PROGRESS for 5+ days (unreported blocker)
- Cohort completion deadlines approaching

**Solution:** Expand `check-alerts.mjs` thresholds:

```javascript
const ALERT_THRESHOLDS = {
  stuckDays: 3,           // Existing
  inactiveDays: 7,        // NEW: Potential drop-out
  longRunningLab: 5,      // NEW: Lab taking too long
  cohortDeadlineWarn: 14, // NEW: Days before cohort end
  cohortDeadlineCrit: 7   // NEW: Critical deadline warning
};

const ALERT_TYPES = {
  STUCK: '🔴 BLOCKED',
  INACTIVE: '😴 INACTIVE',
  LONG_RUNNING: '⏰ OVERTIME',
  DEADLINE_WARN: '📅 DEADLINE',
  DEADLINE_CRIT: '🚨 DEADLINE'
};
```

**File Ownership:**
- `progress/scripts/check-alerts.mjs` — Expand thresholds
- `progress/config/alert-thresholds.json` (create new) — Externalize config

**Acceptance Criteria:**
- [ ] Inactive 7+ days generates alert
- [ ] Long-running lab generates alert
- [ ] Cohort deadline warnings work
- [ ] Thresholds configurable via JSON

---

### E15: Week 2-4 Tie-Backs

**Problem:** E05 only covers Week 1 labs. Weeks 2-4 have no tie-back/tie-forward sections.

**Solution:** Apply same patterns to Weeks 2-4:

**Scope:**
- `docs/content/week-02/` labs
- `docs/content/week-03/` labs  
- `docs/content/week-04/` labs

**Template per lab:**
```markdown
---

## 🔙 Building On

This lab builds on concepts from:
- **Lab X:** {what you learned}
- **Week Y Concept:** {skill applied}

---

## 🔜 Looking Ahead

What you learn here prepares you for:
- **Lab X:** {what comes next}
- **Sprint Y:** {how this applies}
```

**File Ownership:**
- All lab files in `docs/content/week-02/micro-labs/`
- All lab files in `docs/content/week-03/micro-labs/`
- All lab files in `docs/content/week-04/micro-labs/`

**Acceptance Criteria:**
- [ ] All Week 2 labs have tie-back sections
- [ ] All Week 3 labs have tie-back sections
- [ ] All Week 4 labs have tie-back sections
- [ ] All Week 2-4 labs have tie-forward sections
- [ ] Cross-week references are accurate

---

### E16: Signal File Automation

**Problem:** Agents manually create signal files, leading to inconsistency.

**Solution:** Add signal file creation to agent output contracts and provide helper script:

```javascript
// enhance-05/scripts/create-signal.mjs
// Usage: node scripts/create-signal.mjs E12 SUCCESS "Runner integration complete"

import fs from 'node:fs';
import path from 'node:path';

const [, , agentId, status, notes] = process.argv;
const signalDir = 'enhance-05/WORK_PRODUCTS/SIGNALS';

if (!fs.existsSync(signalDir)) {
  fs.mkdirSync(signalDir, { recursive: true });
}

const signal = {
  timestamp: new Date().toISOString(),
  status: status || 'SUCCESS',
  agent: agentId,
  notes: notes || ''
};

fs.writeFileSync(
  path.join(signalDir, `${agentId}_COMPLETE.signal`),
  `# ${agentId}_COMPLETE.signal\ntimestamp: ${signal.timestamp}\nstatus: ${signal.status}\nnotes: |\n  ${signal.notes}\n`
);
```

**Acceptance Criteria:**
- [ ] Signal helper script exists
- [ ] All agents use consistent signal format
- [ ] Coordinator can validate signals programmatically

---

## 📊 Phase Structure

```
PHASE 1 (Runner Integration)
└── E12_RUNNER_PROGRESS ──► Phase 1 Gate

PHASE 2 (Data Safety + Alerts) — CONCURRENT
├── E13_BACKUP_RESTORE ────┐
│                          ├──► Phase 2 Gate
└── E14_EXTENDED_ALERTS ───┘

PHASE 3 (Content Extension)
└── E15_WEEK2-4_TIEBACKS ──► Phase 3 Gate

PHASE 4 (Tooling)
└── E16_SIGNAL_AUTOMATION ─► Phase 4 Gate

PHASE 5 (Validation)
└── E08_QA_VALIDATION_V2 ──► Final Gate
```

---

## 📁 File Ownership Matrix

| Agent | Owned Paths | Must NOT Edit |
|-------|-------------|---------------|
| E12 | `scripts/bootcamp.mjs`, `package.json` scripts | `progress/scripts/*` |
| E13 | `progress/scripts/backup-*.mjs`, `progress/backups/` | `progress/cohorts/**` |
| E14 | `progress/scripts/check-alerts.mjs`, `progress/config/` | `progress/scripts/init-student.mjs` |
| E15 | `docs/content/week-0[2-4]/micro-labs/*.md` | `docs/content/week-01/**` |
| E16 | `enhance-05/scripts/`, agent output contracts | Any production files |

---

## ✅ Success Criteria

- [ ] Single command starts lab + marks progress
- [ ] Progress backups can be created and restored
- [ ] All alert thresholds work
- [ ] Weeks 2-4 have tie-back sections
- [ ] Signal files auto-generated

---

## 🔗 Dependencies

| This Pack | Depends On |
|-----------|------------|
| E12 | E01 (runner exists), E09 (progress system) |
| E13 | E09 (progress folder structure) |
| E14 | E10 (check-alerts base script) |
| E15 | E05 (pattern established in Week 1) |
| E16 | enhance-04 agent patterns |

---

## 📅 Estimated Effort

| Agent | Complexity | Estimate |
|-------|------------|----------|
| E12 | Medium | 2 hours |
| E13 | Medium | 2 hours |
| E14 | Low | 1 hour |
| E15 | High | 4 hours (many files) |
| E16 | Low | 1 hour |
| **Total** | | **~10 hours** |

---

## 🚀 Launch Preparation

Before starting enhance-05:

1. [ ] Confirm enhance-04 E08 validation passed
2. [ ] Verify runner integration points are stable
3. [ ] Verify `bootcamp_scaffolds_weeks1-4_sprints1-4/` folder deleted
4. [ ] Document Week 2-4 lab structure
5. [ ] Create enhance-05 folder from template
6. [ ] Spawn agents per phase order

---

## 🛠️ Technical Debt to Address

### From enhance-04 Insights

| Item | Agent | Description |
|------|-------|-------------|
| Hardcoded lab ID mappings | E12 | Expand mappings to include Week 2-4 and Sprint labs |
| Cohort format assumption | E14 | Allow flexible cohort naming (not just YYYY-MM) |
| No progress file migration | E13 | Add migration script for template changes |

### New Agent: E17_TECH_DEBT_CLEANUP

Consider adding a dedicated tech debt agent to enhance-05:

```markdown
### E17: Technical Debt Cleanup

**Scope:**
- Expand lab ID mappings in update-progress.mjs
- Add cohort format flexibility
- Add progress file migration tool

**File Ownership:**
- `progress/scripts/update-progress.mjs` — Lab ID mappings
- `progress/scripts/migrate-progress.mjs` (new)
- `progress/config/cohort-settings.json` (new)
```

---

*This document defines the scope for enhance-05. Create the enhance-05/ folder structure when ready to execute.*

---

# 🔍 Additional Insights & Analysis — enhance-05

**Review Date:** 2026-01-29  
**Reviewer:** GitHub Copilot Analysis  
**Input Sources:** `enhance-04/` folder, `enhance-04-extra.md` execution insights

---

## 📊 Analysis Summary

After reviewing the enhance-04 multi-agent orchestration pack and its execution insights, the following additional enhancements, improvements, missed opportunities, and error-checking recommendations have been identified for enhance-05.

---

## 🚀 Additional Enhancements Beyond Current enhance-05 Scope

### E18: Cross-Platform Path Normalization

**Discovery:** The enhance-04-extra.md notes "hardcoded paths that may not work cross-platform" as an anti-pattern, but enhance-05 doesn't address this.

**Problem Areas Identified:**
- `scripts/bootcamp.mjs` uses `path.join()` correctly but output messages may show backslashes on Windows
- `progress/scripts/*.mjs` files use forward slashes in error messages
- YAML step files reference paths with forward slashes

**Recommendation:**
```javascript
// Add to all CLI scripts
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

// Use for all user-facing output
console.log(`File: ${normalizePath(filePath)}`);
```

**Agent Assignment:** Create **E18_PATH_NORMALIZATION** to:
- [ ] Audit all `.mjs` scripts for path output consistency
- [ ] Add path normalization utility
- [ ] Ensure YAML paths use POSIX format consistently

---

### E19: Validation Command Consolidation

**Discovery:** The verification commands scattered across phases are not automated into a single validation suite.

**Problem:** Facilitators and E08 must run 15+ individual commands manually.

**Solution:** Create a `npm run validate:all` command:

```javascript
// scripts/validate-all.mjs
const validations = [
  { name: 'Link Check', cmd: 'npm run check:links' },
  { name: 'Runner List', cmd: 'npm run bootcamp:list' },
  { name: 'Runner Step', cmd: 'npm run bootcamp -- step week-01-lab-00' },
  { name: 'Progress Init Test', cmd: 'npm run progress:init -- --name "Test" --github __validate__ --cohort __validate__ --track backend --dry-run' },
  // ... more validations
];
```

**Acceptance Criteria:**
- [ ] Single command runs all validations
- [ ] Clear PASS/FAIL output per check
- [ ] Exit code reflects overall status
- [ ] `--quick` flag for essential-only validation

---

### E20: Agent Error Recovery Playbook

**Discovery:** From enhance-04-extra.md: "Agent instructions didn't always include what to do if a step failed."

**Problem:** When agents encounter errors, there's no standardized recovery procedure.

**Solution:** Create `enhance-05/PLAYBOOKS/ERROR_RECOVERY.md`:

```markdown
## Common Failures & Recovery

### File Already Exists
- Check: `ls <target_file>`
- Decision tree: Update vs. Skip vs. Abort
- Recovery: Document in work log, request Coordinator guidance

### Package.json Merge Conflict
- Check: `git diff package.json`
- Recovery: Use `jq` merge strategy
- Escalation: Coordinator handles multi-agent package.json changes

### Signal File Missing
- Check: `ls enhance-05/WORK_PRODUCTS/SIGNALS/`
- Recovery: Create retroactively with notes explaining delay
```

---

### E21: Lab ID Auto-Discovery

**Discovery:** `update-progress.mjs` has hardcoded lab mappings (lines 166-180) that need manual expansion.

**Problem:** Adding Week 2-4 labs requires code changes.

**Solution:** Derive lab names from YAML step files:

```javascript
// Instead of hardcoded:
const labNames = ['Lab 0: Setup...', 'Lab 1: Plan...'];

// Use dynamic:
function getLabDisplayName(labId) {
  const step = loadStepFromYAML(labId);
  return step?.title || labId;
}
```

**File Impact:**
- `progress/scripts/update-progress.mjs` — Replace hardcoded arrays
- `bootcamp/steps/index.yaml` — Ensure all steps have `title` field

---

## 🔧 Missed Error Checking Opportunities

### 1. Input Validation Gaps

**Location:** `progress/scripts/update-progress.mjs`

**Current State:** Validates lab ID format but doesn't verify the lab actually exists.

**Enhancement:**
```javascript
function validateLabExists(labId) {
  const stepsDir = join(PROGRESS_ROOT, '..', 'bootcamp', 'steps');
  // Parse labId to find expected YAML file
  // week-01-lab-02 → bootcamp/steps/week-01/lab-02.yaml
  const parts = labId.match(/^(week|sprint)-0(\d)-(lab|step)-0(\d)$/);
  if (!parts) return { valid: false, error: 'Invalid lab ID format' };
  
  const yamlPath = join(stepsDir, `${parts[1]}-0${parts[2]}`, `${parts[3]}-0${parts[4]}.yaml`);
  if (!existsSync(yamlPath)) {
    return { valid: false, error: `Lab ${labId} does not exist in bootcamp/steps/` };
  }
  return { valid: true };
}
```

---

### 2. Cohort Format Rigidity

**Location:** `progress/scripts/update-progress.mjs` line 86

**Current State:** Forces `YYYY-MM` format, but enhance-04-extra.md suggests flexibility.

**Enhancement:**
```javascript
function validateCohort(cohort) {
  if (!cohort) {
    return { valid: false, error: 'Cohort is required (--cohort)' };
  }
  
  // Allow flexible formats: YYYY-MM, YYYY-Q1, cohort-name
  if (!/^\d{4}-(\d{2}|Q[1-4])$/.test(cohort) && !/^[a-z0-9-]+$/i.test(cohort)) {
    return { valid: false, error: 'Cohort must be YYYY-MM, YYYY-Q#, or alphanumeric-with-dashes' };
  }
  
  return { valid: true };
}
```

---

### 3. Missing Student File Existence Check Before Update

**Location:** `progress/scripts/update-progress.mjs`

**Problem:** If a student runs `progress:start` before `progress:init`, they get a confusing error.

**Enhancement:**
```javascript
// Before any update operation
function ensureStudentInitialized(cohort, student) {
  const filePath = getStudentFilePath(cohort, student);
  if (!existsSync(filePath)) {
    console.error(`❌ Error: Student '${student}' not found in cohort '${cohort}'.`);
    console.error(`\n💡 Run this first:`);
    console.error(`   npm run progress:init -- --name "Your Name" --github ${student} --cohort ${cohort} --track backend`);
    process.exit(1);
  }
}
```

---

### 4. Alert Threshold Edge Cases

**Location:** `progress/scripts/check-alerts.mjs` lines 29-30

**Problem:** Hardcoded thresholds with no weekend/holiday awareness.

**Enhancement:**
```javascript
// progress/config/alert-thresholds.json
{
  "stuckDays": 3,
  "inactiveDays": 5,
  "excludeWeekends": true,
  "holidays": ["2026-12-25", "2026-01-01"]
}

// Business day calculation
function getBusinessDaysSince(startDate) {
  const config = loadConfig();
  let count = 0;
  const current = new Date(startDate);
  const now = new Date();
  
  while (current < now) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split('T')[0];
    
    if (config.excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
      // Skip weekends
    } else if (config.holidays.includes(dateStr)) {
      // Skip holidays
    } else {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}
```

---

### 5. YAML Step File Validation

**Location:** `scripts/bootcamp.mjs` line 38

**Problem:** Silently skips steps without `id` field but doesn't report malformed files.

**Enhancement:**
```javascript
function loadSteps() {
  const steps = new Map();
  const warnings = [];
  
  for (const f of files) {
    try {
      const raw = fs.readFileSync(f, "utf8");
      const step = YAML.parse(raw);
      
      if (!step?.id) {
        warnings.push(`⚠️ ${f}: Missing 'id' field`);
        continue;
      }
      
      // Validate required fields
      const required = ['id', 'title', 'objective'];
      for (const field of required) {
        if (!step[field]) {
          warnings.push(`⚠️ ${f}: Missing '${field}' field`);
        }
      }
      
      steps.set(step.id, step);
    } catch (err) {
      warnings.push(`❌ ${f}: YAML parse error - ${err.message}`);
    }
  }
  
  if (warnings.length > 0) {
    console.warn('\n--- Step Loading Warnings ---');
    warnings.forEach(w => console.warn(w));
    console.warn('');
  }
  
  return steps;
}
```

---

## 🔄 Process Improvements for enhance-05 Execution

### 1. Mandatory Recon Output Template

**Problem:** Recon gates are defined but output format varies per agent.

**Solution:** Standardize recon output:

```markdown
## RECON_OUTPUT (paste this section)

### Environment Check
- [ ] Node.js: v{version}
- [ ] npm: v{version}
- [ ] Git branch: {branch_name}
- [ ] Working directory clean: {yes/no}

### File State Check
| Target File | Expected State | Actual State | Action |
|-------------|----------------|--------------|--------|
| `path/to/file` | NOT_EXISTS | NOT_EXISTS | CREATE |
| `path/to/file2` | EXISTS | EXISTS | UPDATE |

### Dependency Check
| Dependency Agent | Signal File | Status |
|------------------|-------------|--------|
| E01 | E01_COMPLETE.signal | ✅ FOUND |

### Proceed: YES / NO (with reason if NO)
```

---

### 2. Work Log Auto-Generation Scaffold

**Problem:** Work log creation is manual and inconsistent.

**Solution:** Add to `enhance-05/SCAFFOLDS/`:

```bash
# create-worklog.mjs
# Usage: node enhance-05/SCAFFOLDS/create-worklog.mjs E12 "Runner Progress Integration"

const template = `
# ${agentId} — Work Log

**Agent:** ${agentId}
**Date:** ${new Date().toISOString().split('T')[0]}
**Status:** ⏳ IN_PROGRESS

---

## Mission
${mission}

---

## Recon Output
(paste recon findings here)

---

## Tasks Completed
| Task | Status | Notes |
|------|--------|-------|

---

## Files Modified
| File | Operation | Lines Changed |
|------|-----------|---------------|

---

## Verification Commands Run
\`\`\`bash
# Paste commands and output here
\`\`\`

---

## Issues Encountered
(none / list issues)

---

## Signal File
Created: enhance-05/WORK_PRODUCTS/SIGNALS/${agentId}_COMPLETE.signal
`;
```

---

### 3. Package.json Change Queue Protocol

**Problem:** From enhance-04-extra.md: "E01 and E09 both modify package.json... must be sequenced to avoid merge conflicts."

**Solution:** Implement change queue pattern:

```markdown
## Package.json Change Queue

Agents that need package.json changes:
1. E12 — Adding `--mark-started`, `--mark-complete` flags
2. E13 — Adding `progress:backup`, `progress:restore`

**Protocol:**
1. Agent writes changes to `enhance-05/PACKAGE_CHANGES/{agentId}.json`
2. After phase completion, Coordinator merges all changes
3. Verification: `npm install && npm run bootcamp:list`

**E12 Change Request:**
\`\`\`json
{
  "scripts": {
    "bootcamp:do": "node scripts/bootcamp.mjs do"
  }
}
\`\`\`

**E13 Change Request:**
\`\`\`json
{
  "scripts": {
    "progress:backup": "node progress/scripts/backup-cohort.mjs backup",
    "progress:restore": "node progress/scripts/backup-cohort.mjs restore",
    "progress:backups": "node progress/scripts/backup-cohort.mjs list"
  }
}
\`\`\`
```

---

## 🚫 Additional Anti-Patterns to Avoid

### 1. Silent Failures
Current scripts often use `|| ''` or `?? ''` which swallow errors silently.

**Bad:**
```javascript
const step = YAML.parse(raw);
if (!step?.id) continue; // Silent skip
```

**Better:**
```javascript
const step = YAML.parse(raw);
if (!step?.id) {
  console.warn(`⚠️ Skipping ${f}: missing 'id' field`);
  continue;
}
```

---

### 2. Inconsistent Exit Codes
Some scripts exit with 0 even on failure.

**Enhancement:** Standardize exit codes:
- `0` — Success
- `1` — User error (bad input, missing file)
- `2` — System error (permission, network)
- `3` — Validation failure (tests failed)

---

### 3. Missing Dry-Run Mode
Scripts make changes immediately without preview.

**Enhancement:** Add `--dry-run` to all modification scripts:
```javascript
if (args.includes('--dry-run')) {
  console.log('🔍 DRY RUN - No changes will be made');
  console.log(`Would create: ${filePath}`);
  console.log(`With content:\n${content.slice(0, 500)}...`);
  process.exit(0);
}
```

---

## 📈 Metrics & Observability Gaps

### 1. No Execution Timing

**Problem:** No data on how long labs actually take students.

**Enhancement:** Add timing to progress tracking:
```markdown
| Lab | Status | Started | Completed | **Duration** | PR |
|-----|--------|---------|-----------|--------------|-----|
| Lab 0 | ✅ COMPLETE | 2026-01-20 | 2026-01-20 | **45 min** | #12 |
```

**Script Change:**
```javascript
// On complete, calculate duration
const started = new Date(cells[3].trim());
const completed = new Date();
const durationMs = completed - started;
const durationHours = Math.round(durationMs / (1000 * 60 * 60) * 10) / 10;
cells[5] = ` ${durationHours}h `;
```

---

### 2. No Aggregate Statistics

**Problem:** No way to see cohort-level metrics.

**Enhancement:** Add to dashboard generation:
```markdown
## 📊 Cohort Statistics

| Metric | Value |
|--------|-------|
| Total Students | 15 |
| Completed Lab 0 | 14 (93%) |
| Average Lab 0 Duration | 35 min |
| Currently Blocked | 2 |
| On Track | 12 (80%) |
```

---

## 🔗 Integration Opportunities

### 1. Copilot Chat + Progress System

**Current Gap:** Copilot can help students navigate, but can't update progress.

**Enhancement E17 Expansion:**
```markdown
When student says "I finished lab 2":
1. Confirm: "Great! Should I mark Lab 2 as complete for you?"
2. If yes, run: `npm run progress:complete -- --student {username} --cohort {cohort} week-01-lab-02`
3. Ask: "Did you create a PR? What's the number?"
```

---

### 2. Git Hook Integration

**Problem:** Students forget to update progress after commits.

**Enhancement:** Add optional git hook:
```bash
# .git/hooks/post-commit (optional, student opt-in)
#!/bin/sh
# Auto-prompt for progress update after lab-related commits
COMMIT_MSG=$(git log -1 --pretty=%B)
if echo "$COMMIT_MSG" | grep -qE "lab[- ]?[0-6]|LAB[- ]?[0-6]"; then
  echo "💡 This looks like a lab commit. Run 'npm run progress:complete' when ready."
fi
```

---

## 📋 Revised Agent List for enhance-05

Based on analysis, consider this expanded agent roster:

| Agent | Priority | Description |
|-------|----------|-------------|
| E12 | P0 | Runner + Progress Integration |
| E13 | P0 | Progress Backup & Restore |
| E14 | P1 | Extended Student Alerts |
| E15 | P1 | Week 2-4 Tie-Backs |
| E16 | P1 | Signal File Automation |
| **E17** | P2 | **Tech Debt Cleanup** (from current enhance-05) |
| **E18** | P2 | **Path Normalization** (NEW) |
| **E19** | P2 | **Validation Consolidation** (NEW) |
| **E20** | P2 | **Error Recovery Playbook** (NEW) |
| **E21** | P2 | **Lab ID Auto-Discovery** (NEW) |
| **E22** | P2 | **Dry-Run Mode Addition** (NEW) |
| E08v2 | Final | QA Validation v2 |

---

## ✅ Pre-Flight Checklist for enhance-05 Launch

Before spawning agents:

- [ ] Verify enhance-04 branch is merged to main
- [ ] Confirm all E01-E11 work logs exist
- [ ] Run full validation: `npm install && npm run bootcamp:list && npm run progress:alerts -- --cohort 2026-01`
- [ ] Create `enhance-05/` folder structure
- [ ] Create `enhance-05/PACKAGE_CHANGES/` for merge queue
- [ ] Create `enhance-05/SCAFFOLDS/create-worklog.mjs`
- [ ] Create `enhance-05/PLAYBOOKS/ERROR_RECOVERY.md`
- [ ] Update `03-FILE_OWNERSHIP_MATRIX.md` with new agents
- [ ] Notify facilitators of planned downtime (if any)

---

## 🔮 Looking Ahead to enhance-06

Ideas captured for future iterations:

1. **Visual Progress Charts** — Mermaid diagrams in dashboard
2. **Peer Review Integration** — Auto-assign reviewers based on progress
3. **Multi-Language Support** — Lab variants for Python, C#
4. **Achievement/Badge System** — Gamification hooks
5. **Slack/Teams Notifications** — Alert integration with chat platforms
6. **LLM-Assisted Code Review** — Copilot feedback on submissions

---

*End of enhance-05 insights. Review with Coordinator before launch.*
