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

*This document defines the scope for enhance-05. Create the enhance-05/ folder structure when ready to execute.*---

*This document defines the scope for enhance-05. Create the enhance-05/ folder structure when ready to execute.*
