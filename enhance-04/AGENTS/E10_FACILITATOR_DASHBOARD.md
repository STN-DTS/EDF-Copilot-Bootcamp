# E10_FACILITATOR_DASHBOARD — Cohort Overview & Alerts

## Mission
Create a facilitator dashboard system that:
- Generates a cohort overview from individual student progress files
- Identifies stuck or blocked students
- Provides at-a-glance visibility for facilitators
- Optionally auto-refreshes via GitHub Action

---

## File ownership (absolute)

**Owned paths (create new):**
- `progress/scripts/generate-dashboard.mjs`
- `progress/DASHBOARD.md` (generated, but we create the generator)
- `.github/workflows/update-dashboard.yml` (optional automation)

**Must NOT edit:**
- Individual student files (E09 owns)
- `progress/scripts/init-student.mjs` (E09 owns)
- `progress/scripts/update-progress.mjs` (E09 owns)
- Any `docs/**` files

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **E09 has completed** (progress system must exist)
2. **`progress/` folder exists** with expected structure
3. **At least one test student file exists** (or create one for testing)

**Output your recon findings before proceeding.**

---

## Agent Health Check (run first)

Before any work, verify agent capabilities:

```bash
# Progress folder exists
ls progress/ && echo "✅ Progress folder OK"

# Scripts folder exists
ls progress/scripts/ && echo "✅ Scripts folder OK"

# Node available
node --version && echo "✅ Node OK"
```

**If any health check fails, report and do not proceed.**

---

## Tasks

### Task 1: Create progress/scripts/generate-dashboard.mjs

```javascript
#!/usr/bin/env node
/**
 * Generate facilitator dashboard from student progress files
 * 
 * Usage:
 *   node progress/scripts/generate-dashboard.mjs --cohort 2026-01
 *   node progress/scripts/generate-dashboard.mjs --all
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRESS_ROOT = path.resolve(__dirname, '..');

function parseArgs(args) {
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      parsed[key] = value;
      if (value !== true) i++;
    }
  }
  return parsed;
}

function analyzeStudentFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const username = path.basename(filePath, '.md');
  
  // Count statuses
  const complete = (content.match(/✅ COMPLETE/g) || []).length;
  const inProgress = (content.match(/🔄 IN_PROGRESS/g) || []).length;
  const blocked = (content.match(/🔴 BLOCKED/g) || []).length;
  const notStarted = (content.match(/⏳ NOT_STARTED/g) || []).length;
  
  // Calculate week progress
  const weeks = {
    W1: { complete: 0, total: 7 },
    W2: { complete: 0, total: 4 },
    W3: { complete: 0, total: 4 },
    W4: { complete: 0, total: 4 },
    S1: { complete: 0, total: 5 },
    S2: { complete: 0, total: 5 },
    S3: { complete: 0, total: 5 },
    S4: { complete: 0, total: 5 },
  };
  
  // Parse Week 1 (7 labs)
  const w1Labs = content.match(/Lab [0-6] — .*?\| (✅|🔄|⏳|🔴)/g) || [];
  weeks.W1.complete = w1Labs.filter(l => l.includes('✅')).length;
  
  // Determine current position
  let current = 'Not started';
  if (inProgress > 0) {
    // Find first in-progress item
    const match = content.match(/\| 🔄 IN_PROGRESS.*?\|/);
    if (match) current = 'In progress';
  } else if (complete > 0) {
    current = `${complete} labs done`;
  }

  // Check for blockers
  const hasBlockers = blocked > 0 || content.includes('## Blockers / Help Needed\n\n-');
  
  // Check last activity (look for most recent date in table)
  const dates = content.match(/\d{4}-\d{2}-\d{2}/g) || [];
  const lastActivity = dates.length > 0 ? dates[dates.length - 1] : 'Unknown';
  
  // Check if stuck (in progress for > 3 days)
  let isStuck = false;
  if (inProgress > 0 && lastActivity !== 'Unknown') {
    const lastDate = new Date(lastActivity);
    const today = new Date();
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    isStuck = daysDiff > 3;
  }

  return {
    username,
    complete,
    inProgress,
    blocked,
    notStarted,
    weeks,
    current,
    hasBlockers,
    lastActivity,
    isStuck,
  };
}

function getStatusIcon(weekData) {
  if (weekData.complete === weekData.total) return '🟢';
  if (weekData.complete > 0) return '🟡';
  return '⚪';
}

function generateDashboard(cohortId, students) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  
  const alerts = [];
  const thisWeek = [];
  
  // Build student rows
  let tableRows = '';
  for (const s of students) {
    const w1 = getStatusIcon(s.weeks.W1);
    const w2 = getStatusIcon(s.weeks.W2);
    const w3 = getStatusIcon(s.weeks.W3);
    const w4 = getStatusIcon(s.weeks.W4);
    const s1 = getStatusIcon(s.weeks.S1);
    const s2 = getStatusIcon(s.weeks.S2);
    const s3 = getStatusIcon(s.weeks.S3);
    const s4 = getStatusIcon(s.weeks.S4);
    
    let blockerStatus = 'None';
    if (s.isStuck) {
      blockerStatus = '⚠️ Stuck';
      alerts.push(`⚠️ @${s.username} appears stuck (no progress in 3+ days)`);
    } else if (s.hasBlockers) {
      blockerStatus = '🔴 Needs help';
      alerts.push(`🔴 @${s.username} has blockers — check their progress file`);
    }
    
    tableRows += `| @${s.username} | ${w1} | ${w2} | ${w3} | ${w4} | ${s1} | ${s2} | ${s3} | ${s4} | ${s.current} | ${blockerStatus} |\n`;
    
    if (s.complete > 0) {
      thisWeek.push(`@${s.username}: ${s.complete} labs completed`);
    }
  }

  // Calculate cohort stats
  const totalComplete = students.reduce((sum, s) => sum + s.complete, 0);
  const totalPossible = students.length * 23; // 23 labs total
  const avgProgress = students.length > 0 ? (totalComplete / students.length).toFixed(1) : 0;
  const activeCount = students.filter(s => s.inProgress > 0 || s.lastActivity === new Date().toISOString().split('T')[0]).length;

  const dashboard = `# 📈 Cohort Dashboard — ${cohortId}

**Last Updated:** ${now}  
**Total Students:** ${students.length}  
**Active This Week:** ${activeCount}  
**Average Progress:** ${avgProgress} labs/student

---

## Progress Overview

| Student | W1 | W2 | W3 | W4 | S1 | S2 | S3 | S4 | Current | Status |
|---------|----|----|----|----|----|----|----|----|---------|--------|
${tableRows}

**Legend:** 🟢 Complete | 🟡 In Progress | ⚪ Not Started

---

## Alerts

${alerts.length > 0 ? alerts.map(a => `- ${a}`).join('\n') : '✅ No alerts — all students progressing normally'}

---

## This Week's Activity

${thisWeek.length > 0 ? thisWeek.map(t => `- ${t}`).join('\n') : '- No completions this week yet'}

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Total Labs Completed | ${totalComplete} / ${totalPossible} |
| Completion Rate | ${totalPossible > 0 ? ((totalComplete / totalPossible) * 100).toFixed(1) : 0}% |
| Students Blocked | ${students.filter(s => s.hasBlockers).length} |
| Students Stuck | ${students.filter(s => s.isStuck).length} |

---

## Facilitator Actions Needed

${students.filter(s => s.isStuck || s.hasBlockers).map(s => 
  `- [ ] Review @${s.username}'s progress file and reach out`
).join('\n') || '✅ No immediate actions needed'}

---

*Dashboard auto-generated. Refresh with: \`npm run progress:dashboard -- --cohort ${cohortId}\`*
`;

  return dashboard;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  
  if (!args.cohort && !args.all) {
    console.log(`
Usage:
  npm run progress:dashboard -- --cohort 2026-01
  npm run progress:dashboard -- --all

Options:
  --cohort    Generate dashboard for specific cohort
  --all       Generate dashboards for all cohorts
`);
    process.exit(0);
  }

  const cohortsDir = path.join(PROGRESS_ROOT, 'cohorts');
  if (!fs.existsSync(cohortsDir)) {
    console.error('❌ No cohorts folder found');
    process.exit(1);
  }

  const cohorts = args.all 
    ? fs.readdirSync(cohortsDir).filter(f => fs.statSync(path.join(cohortsDir, f)).isDirectory())
    : [args.cohort];

  for (const cohortId of cohorts) {
    const cohortDir = path.join(cohortsDir, cohortId);
    if (!fs.existsSync(cohortDir)) {
      console.warn(`⚠️ Cohort not found: ${cohortId}`);
      continue;
    }

    const studentFiles = fs.readdirSync(cohortDir).filter(f => f.endsWith('.md'));
    const students = studentFiles.map(f => analyzeStudentFile(path.join(cohortDir, f)));
    
    const dashboard = generateDashboard(cohortId, students);
    const outputPath = path.join(PROGRESS_ROOT, `DASHBOARD_${cohortId}.md`);
    fs.writeFileSync(outputPath, dashboard);
    
    console.log(`✅ Generated dashboard: ${outputPath}`);
    console.log(`   ${students.length} students, ${students.filter(s => s.isStuck || s.hasBlockers).length} need attention`);
  }
}

main();
```

### Task 2: Create GitHub Action for auto-refresh (optional)

Create `.github/workflows/update-dashboard.yml`:

```yaml
name: Update Progress Dashboard

on:
  push:
    paths:
      - 'progress/cohorts/**/*.md'
  workflow_dispatch:
  schedule:
    # Run daily at 6am UTC
    - cron: '0 6 * * *'

jobs:
  update-dashboard:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate dashboards
        run: npm run progress:dashboard -- --all
      
      - name: Commit updated dashboards
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add progress/DASHBOARD*.md
          git diff --staged --quiet || git commit -m "chore: update progress dashboards [skip ci]"
          git push
```

### Task 3: Add dashboard script to package.json

Ensure `package.json` includes:

```json
{
  "scripts": {
    "progress:dashboard": "node progress/scripts/generate-dashboard.mjs"
  }
}
```

### Task 4: Create alerts script (bonus)

Create `progress/scripts/check-alerts.mjs`:

```javascript
#!/usr/bin/env node
/**
 * Check for students needing attention
 * 
 * Usage:
 *   node progress/scripts/check-alerts.mjs --cohort 2026-01
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRESS_ROOT = path.resolve(__dirname, '..');

function parseArgs(args) {
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      parsed[key] = value;
      if (value !== true) i++;
    }
  }
  return parsed;
}

function checkStudent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const username = path.basename(filePath, '.md');
  const alerts = [];

  // Check for blockers
  if (content.includes('🔴 BLOCKED')) {
    alerts.push({ type: 'BLOCKED', message: 'Has blocked items' });
  }

  // Check for explicit help requests
  if (content.match(/## Blockers \/ Help Needed\n+[^#]/)) {
    alerts.push({ type: 'HELP', message: 'Requested help in blockers section' });
  }

  // Check for stale in-progress items
  const inProgressMatch = content.match(/🔄 IN_PROGRESS \| (\d{4}-\d{2}-\d{2})/);
  if (inProgressMatch) {
    const startDate = new Date(inProgressMatch[1]);
    const today = new Date();
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    if (daysDiff > 3) {
      alerts.push({ type: 'STUCK', message: `In progress for ${daysDiff} days` });
    }
  }

  // Check for no activity
  const dates = content.match(/\d{4}-\d{2}-\d{2}/g) || [];
  if (dates.length > 0) {
    const lastDate = new Date(Math.max(...dates.map(d => new Date(d))));
    const today = new Date();
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    if (daysDiff > 7) {
      alerts.push({ type: 'INACTIVE', message: `No activity for ${daysDiff} days` });
    }
  }

  return { username, alerts };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  
  if (!args.cohort) {
    console.error('Usage: npm run progress:alerts -- --cohort 2026-01');
    process.exit(1);
  }

  const cohortDir = path.join(PROGRESS_ROOT, 'cohorts', args.cohort);
  if (!fs.existsSync(cohortDir)) {
    console.error(`❌ Cohort not found: ${args.cohort}`);
    process.exit(1);
  }

  console.log(`\n🚨 Alert Check for Cohort ${args.cohort}\n${'━'.repeat(50)}`);

  const studentFiles = fs.readdirSync(cohortDir).filter(f => f.endsWith('.md'));
  let totalAlerts = 0;

  for (const file of studentFiles) {
    const result = checkStudent(path.join(cohortDir, file));
    if (result.alerts.length > 0) {
      console.log(`\n⚠️ @${result.username}:`);
      for (const alert of result.alerts) {
        console.log(`   ${alert.type}: ${alert.message}`);
        totalAlerts++;
      }
    }
  }

  if (totalAlerts === 0) {
    console.log('\n✅ No alerts — all students progressing normally\n');
  } else {
    console.log(`\n${'━'.repeat(50)}`);
    console.log(`Total alerts: ${totalAlerts}`);
  }
}

main();
```

---

## Error Recovery Procedures

### If recon gate fails:
1. Verify E09 has completed
2. Check that `progress/` structure exists
3. Report to Coordinator if structure is wrong

### If script fails:
1. Check Node.js version (needs v18+)
2. Check file permissions
3. Verify student files are valid markdown
4. Rollback with: `git checkout -- progress/scripts/generate-dashboard.mjs`

---

## Output contract (mandatory)

Return:
1. **Plan** (brief, 5-10 bullets)
2. **Patch** (unified diff for each file created)
3. **Verification commands:**
   ```bash
   # Create test data
   npm run progress:init -- --name "Test Student" --github teststudent --cohort test --track backend
   
   # Generate dashboard
   npm run progress:dashboard -- --cohort test
   
   # View dashboard
   cat progress/DASHBOARD_test.md
   
   # Run alerts
   npm run progress:alerts -- --cohort test
   
   # Cleanup
   rm -rf progress/cohorts/test
   rm progress/DASHBOARD_test.md
   ```
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E10_FACILITATOR_DASHBOARD_WORKLOG.md`

---

## Success criteria
- [ ] `progress/scripts/generate-dashboard.mjs` exists and runs
- [ ] Dashboard generates for test cohort
- [ ] Dashboard shows student summary table
- [ ] Dashboard shows alerts for stuck/blocked students
- [ ] GitHub Action workflow created (optional)
- [ ] `progress:dashboard` and `progress:alerts` scripts in package.json

---

## Coordination notes

- **Depends on:** E09 (must create progress system first)
- **Runs in:** Phase 3.5 (after content phases, before QA)
- **Testing:** Create mock student data before verifying
