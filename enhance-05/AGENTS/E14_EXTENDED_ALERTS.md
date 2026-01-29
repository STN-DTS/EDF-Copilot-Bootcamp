# E14_EXTENDED_ALERTS — Extended Student Alert System

## Mission
Expand the alert system to catch inactive students, long-running labs, and cohort deadline warnings.

**Spawned via:** `runSubagent` tool  
**Phase:** 2 (Data Safety) — Can run concurrently with E13  
**Dependencies:** enhance-04 E10 (check-alerts base script)

---

## File ownership (absolute)

**Owned paths:**
- `progress/scripts/check-alerts.mjs` — Expand thresholds
- `progress/config/alert-thresholds.json` (create new)
- `progress/config/README.md` (create new)

**Must NOT edit:**
- `progress/scripts/init-student.mjs`
- `progress/scripts/update-progress.mjs`
- `progress/cohorts/**`

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Alerts script exists:**
   ```bash
   ls progress/scripts/check-alerts.mjs
   npm run progress:alerts -- --help
   ```

2. **Config folder may or may not exist:**
   ```bash
   ls progress/config/
   ```

3. **Read current check-alerts.mjs** to understand existing thresholds

**Output your recon findings before proceeding.**

---

## Agent Health Check (run first)

```bash
# Can write to progress folder
echo "test" > progress/.test-write && rm progress/.test-write && echo "✅ Write OK"

# Alerts command works
npm run progress:alerts -- --cohort 2026-01 && echo "✅ Alerts OK"
```

**If any health check fails, report and do not proceed.**

---

## Tasks

### Task 1: Create progress/config/ folder structure

```
progress/config/
├── README.md
└── alert-thresholds.json
```

### Task 2: Create progress/config/README.md

```markdown
# Progress Configuration

This folder contains configuration files for the progress tracking system.

## Files

### alert-thresholds.json
Configures alert thresholds for student progress monitoring.

```json
{
  "stuckDays": 3,
  "inactiveDays": 7,
  "longRunningLabDays": 5,
  "cohortDeadlineWarnDays": 14,
  "cohortDeadlineCritDays": 7,
  "excludeWeekends": true,
  "holidays": []
}
```

### Threshold Descriptions

| Threshold | Default | Description |
|-----------|---------|-------------|
| `stuckDays` | 3 | Days before BLOCKED status triggers alert |
| `inactiveDays` | 7 | Days of no activity before inactive alert |
| `longRunningLabDays` | 5 | Days a lab can be IN_PROGRESS before alert |
| `cohortDeadlineWarnDays` | 14 | Days before cohort end to show warning |
| `cohortDeadlineCritDays` | 7 | Days before cohort end for critical alert |
| `excludeWeekends` | true | Skip weekends in day calculations |
| `holidays` | [] | Array of dates to skip (YYYY-MM-DD format) |
```

### Task 3: Create progress/config/alert-thresholds.json

```json
{
  "stuckDays": 3,
  "inactiveDays": 7,
  "longRunningLabDays": 5,
  "cohortDeadlineWarnDays": 14,
  "cohortDeadlineCritDays": 7,
  "excludeWeekends": true,
  "holidays": []
}
```

### Task 4: Update progress/scripts/check-alerts.mjs

Add new alert types and configurable thresholds:

```javascript
// Add at top of file
import { join, dirname } from 'node:path';

// Load config
function loadConfig() {
  const configPath = join(PROGRESS_ROOT, 'config', 'alert-thresholds.json');
  
  const defaults = {
    stuckDays: 3,
    inactiveDays: 7,
    longRunningLabDays: 5,
    cohortDeadlineWarnDays: 14,
    cohortDeadlineCritDays: 7,
    excludeWeekends: true,
    holidays: []
  };
  
  try {
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      return { ...defaults, ...config };
    }
  } catch (err) {
    console.warn(`⚠️ Could not load config, using defaults: ${err.message}`);
  }
  
  return defaults;
}

// Replace hardcoded thresholds
const config = loadConfig();
const STUCK_THRESHOLD_DAYS = config.stuckDays;
const INACTIVE_THRESHOLD_DAYS = config.inactiveDays;
const LONG_RUNNING_THRESHOLD_DAYS = config.longRunningLabDays;

// New alert types
const ALERT_TYPES = {
  BLOCKED: { icon: '🔴', label: 'BLOCKED', severity: 'critical' },
  STUCK: { icon: '⏳', label: 'STUCK', severity: 'high' },
  INACTIVE: { icon: '😴', label: 'INACTIVE', severity: 'high' },
  LONG_RUNNING: { icon: '⏰', label: 'OVERTIME', severity: 'medium' },
  DEADLINE_WARN: { icon: '📅', label: 'DEADLINE', severity: 'medium' },
  DEADLINE_CRIT: { icon: '🚨', label: 'DEADLINE', severity: 'critical' }
};

// Business day calculation
function getBusinessDaysSince(startDate) {
  const config = loadConfig();
  let count = 0;
  const current = new Date(startDate);
  const now = new Date();
  
  while (current < now) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split('T')[0];
    
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = config.holidays.includes(dateStr);
    
    if (config.excludeWeekends && isWeekend) {
      // Skip weekends
    } else if (isHoliday) {
      // Skip holidays
    } else {
      count++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

// Find inactive students
function findInactiveStudents(content, fileModifiedDate) {
  const config = loadConfig();
  const alerts = [];
  
  const daysSinceModified = getBusinessDaysSince(fileModifiedDate);
  
  if (daysSinceModified >= config.inactiveDays) {
    alerts.push({
      type: 'INACTIVE',
      daysSince: daysSinceModified,
      severity: daysSinceModified >= 14 ? 'critical' : 'high'
    });
  }
  
  return alerts;
}

// Find long-running labs
function findLongRunningLabs(content) {
  const config = loadConfig();
  const alerts = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (STATUS_PATTERNS.IN_PROGRESS.test(line) && line.startsWith('|')) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length > 3 && parts[1]) {
        const startedDate = parts[3];
        
        if (startedDate && startedDate !== '-') {
          const startDate = new Date(startedDate);
          if (!isNaN(startDate.getTime())) {
            const daysSince = getBusinessDaysSince(startDate);
            
            if (daysSince >= config.longRunningLabDays && daysSince < config.stuckDays) {
              alerts.push({
                item: parts[1],
                type: 'LONG_RUNNING',
                daysSince,
                severity: 'medium'
              });
            }
          }
        }
      }
    }
  }
  
  return alerts;
}
```

### Task 5: Add cohort deadline checking

```javascript
// Cohort deadline checking
function checkCohortDeadline(cohort) {
  const config = loadConfig();
  const alerts = [];
  
  // Parse cohort date (assumes YYYY-MM format)
  const cohortMatch = cohort.match(/^(\d{4})-(\d{2})$/);
  if (!cohortMatch) {
    return alerts; // Can't determine deadline
  }
  
  // Assume cohort runs for 2 months from start
  const startYear = parseInt(cohortMatch[1]);
  const startMonth = parseInt(cohortMatch[2]) - 1;
  const endDate = new Date(startYear, startMonth + 2, 0); // Last day of 2nd month
  
  const now = new Date();
  const daysUntilEnd = Math.floor((endDate - now) / (24 * 60 * 60 * 1000));
  
  if (daysUntilEnd <= config.cohortDeadlineCritDays && daysUntilEnd > 0) {
    alerts.push({
      type: 'DEADLINE_CRIT',
      daysUntil: daysUntilEnd,
      severity: 'critical'
    });
  } else if (daysUntilEnd <= config.cohortDeadlineWarnDays && daysUntilEnd > 0) {
    alerts.push({
      type: 'DEADLINE_WARN',
      daysUntil: daysUntilEnd,
      severity: 'medium'
    });
  }
  
  return alerts;
}
```

### Task 6: Update alert output formatting

```javascript
// Enhanced alert output
function formatAlerts(studentAlerts) {
  console.log('\n📊 Alert Summary\n');
  
  const bySeverity = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };
  
  for (const alert of studentAlerts) {
    const type = ALERT_TYPES[alert.type];
    bySeverity[alert.severity || type.severity].push({
      ...alert,
      icon: type.icon,
      label: type.label
    });
  }
  
  if (bySeverity.critical.length > 0) {
    console.log('🚨 CRITICAL ALERTS:');
    bySeverity.critical.forEach(a => {
      console.log(`  ${a.icon} ${a.student}: ${a.label} - ${a.item || a.reason}`);
    });
    console.log('');
  }
  
  if (bySeverity.high.length > 0) {
    console.log('⚠️ HIGH PRIORITY:');
    bySeverity.high.forEach(a => {
      console.log(`  ${a.icon} ${a.student}: ${a.label} - ${a.item || a.reason}`);
    });
    console.log('');
  }
  
  if (bySeverity.medium.length > 0) {
    console.log('📋 MEDIUM PRIORITY:');
    bySeverity.medium.forEach(a => {
      console.log(`  ${a.icon} ${a.student}: ${a.label} - ${a.item || a.reason}`);
    });
    console.log('');
  }
  
  const total = studentAlerts.length;
  console.log(`Total alerts: ${total}`);
  console.log(`  Critical: ${bySeverity.critical.length}`);
  console.log(`  High: ${bySeverity.high.length}`);
  console.log(`  Medium: ${bySeverity.medium.length}`);
}
```

### Task 7: Test the extended alerts

```bash
# Test with existing cohort
npm run progress:alerts -- --cohort 2026-01

# Test config loading
cat progress/config/alert-thresholds.json

# Test with modified thresholds
# (temporarily change inactiveDays to 1 in config)
npm run progress:alerts -- --cohort 2026-01
```

---

## Output contract (mandatory)

Return:
1. **Recon findings**
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (unified diff for each file created/modified)
4. **Verification commands** and their actual output
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E14_EXTENDED_ALERTS_WORKLOG.md`
6. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E14_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Edge cases in date calculations
- Business day calculation issues
- Timezone considerations
- Suggestions for future alert types

---

## Success Criteria

- [ ] `progress/config/` folder created
- [ ] `alert-thresholds.json` config file works
- [ ] Inactive student detection works (7+ days)
- [ ] Long-running lab detection works (5+ days)
- [ ] Cohort deadline warnings work
- [ ] Business day calculation excludes weekends
- [ ] Holiday exclusion works
- [ ] Alert severity levels working
- [ ] Work log created
- [ ] Signal file created
