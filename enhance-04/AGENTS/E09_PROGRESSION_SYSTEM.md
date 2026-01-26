# E09_PROGRESSION_SYSTEM — Individual Student Progress Tracking

## Mission
Create a centralized progression tracking system that enables:
- Individual student progress files (not just copied templates)
- CLI commands to update progression flags
- Facilitator visibility into student status
- Persistent tracking across sessions

---

## File ownership (absolute)

**Owned paths (create new):**
- `progress/` (entire new folder)
- `progress/README.md`
- `progress/.template/STUDENT_PROGRESS.md`
- `progress/cohorts/.gitkeep`
- `progress/scripts/init-student.mjs`
- `progress/scripts/update-progress.mjs`

**Must update:**
- `package.json` — add progress-related scripts

**Must NOT edit:**
- `scripts/bootcamp.mjs` (E01 owns — coordinate for integration)
- Any `docs/**` files
- Any existing content files

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **`progress/` folder does NOT exist** at repo root
2. **E01 has completed** (runner must exist for integration)
3. **Read `package.json`** to understand existing scripts

**Output your recon findings before proceeding.**

---

## Agent Health Check (run first)

Before any work, verify agent capabilities:

```bash
# Can write to repo root
echo "test" > .test-write && rm .test-write && echo "✅ Write OK"

# Node available
node --version && echo "✅ Node OK"

# npm available
npm --version && echo "✅ npm OK"
```

**If any health check fails, report and do not proceed.**

---

## Tasks

### Task 1: Create progress folder structure

```
progress/
├── README.md
├── .template/
│   └── STUDENT_PROGRESS.md
├── cohorts/
│   └── .gitkeep
└── scripts/
    ├── init-student.mjs
    └── update-progress.mjs
```

### Task 2: Create progress/README.md

```markdown
# 📊 Student Progress Tracking System

This folder contains individual progress tracking for bootcamp participants.

---

## How It Works

### For Students

1. **Initialize your progress file:**
   ```bash
   npm run progress:init -- --name "Your Name" --github yourusername --cohort 2026-01 --track backend
   ```

2. **Mark a lab as started:**
   ```bash
   npm run progress:start -- week-01-lab-02 --student yourusername
   ```

3. **Mark a lab as complete:**
   ```bash
   npm run progress:complete -- week-01-lab-02 --student yourusername --pr 15
   ```

4. **View your progress:**
   ```bash
   npm run progress:view -- --student yourusername
   ```

### For Facilitators

1. **View cohort overview:**
   ```bash
   npm run progress:cohort -- 2026-01
   ```

2. **Refresh dashboard:**
   ```bash
   npm run progress:dashboard
   ```

3. **Check for stuck students:**
   ```bash
   npm run progress:alerts -- --cohort 2026-01
   ```

---

## Folder Structure

```
progress/
├── README.md              # This file
├── .template/
│   └── STUDENT_PROGRESS.md  # Template for new students
├── cohorts/
│   └── 2026-01/           # Cohort folder
│       ├── jsmith.md      # Individual student file
│       ├── alee.md
│       └── ...
├── scripts/
│   ├── init-student.mjs   # Create new student file
│   └── update-progress.mjs # Update progress flags
└── DASHBOARD.md           # Auto-generated cohort overview
```

---

## Status Icons

| Icon | Meaning |
|------|---------|
| ✅ COMPLETE | Lab finished, PR merged |
| 🔄 IN_PROGRESS | Currently working on |
| ⏳ NOT_STARTED | Not yet begun |
| 🔴 BLOCKED | Stuck, needs help |
| ⏸️ PAUSED | Temporarily on hold |

---

## Integration with Bootcamp Runner

Progress commands are integrated with the main bootcamp runner:

```bash
# When starting a lab, also mark progress
npm run bootcamp -- step week-01-lab-02
npm run progress:start -- week-01-lab-02 --student yourusername

# When completing, mark and record PR
npm run progress:complete -- week-01-lab-02 --student yourusername --pr 15
```

---

## Facilitator Sign-off

Facilitators can approve gate completions:

```bash
npm run progress:signoff -- --student jsmith --gate week-01 --facilitator lead-dev
```
```

### Task 3: Create progress/.template/STUDENT_PROGRESS.md

```markdown
# Student Progress — {{STUDENT_NAME}}

**GitHub Username:** @{{GITHUB_USERNAME}}  
**Cohort:** {{COHORT}}  
**Start Date:** {{START_DATE}}  
**Track:** {{TRACK}}  
**Facilitator:** @{{FACILITATOR}}

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Current Position | Week 1, Lab 0 |
| Labs Completed | 0 / 23 |
| Sprints Completed | 0 / 4 |
| Total Time Logged | 0h |
| Last Activity | {{START_DATE}} |

---

## Progression Flags

### Week 1 — AI Enablement (Foundation)

| Lab | Status | Started | Completed | Duration | PR | Facilitator |
|-----|--------|---------|-----------|----------|----|----|
| Lab 0 — Setup Verification | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 1 — Plan Only | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 2 — Scaffold Vertical Slice | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 3 — Tests First | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 4 — Refactor Guarded | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 5 — OpenShift Readiness | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 6 — Capstone Mini-Feature | ⏳ NOT_STARTED | — | — | — | — | — |

**Week 1 Gate:**
- [ ] All 7 labs completed
- [ ] Facilitator approval: ________
- [ ] Ready for Week 2

---

### Week 2 — Constraint Register

| Lab | Status | Started | Completed | Duration | PR | Facilitator |
|-----|--------|---------|-----------|----------|----|----|
| Lab 2-0 — Constraint Extraction | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 2-1 — Journey Mapping | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 2-2 — AC Writing | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 2-3 — Constraint Review | ⏳ NOT_STARTED | — | — | — | — | — |

**Week 2 Gate:**
- [ ] All labs completed
- [ ] Constraint register approved
- [ ] Facilitator approval: ________

---

### Week 3 — Spec-First Packaging

| Lab | Status | Started | Completed | Duration | PR | Facilitator |
|-----|--------|---------|-----------|----------|----|----|
| Lab 3-0 — ADR Drafting | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 3-1 — Constitution Section | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 3-2 — System Spec Persona | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 3-3 — ADR Review | ⏳ NOT_STARTED | — | — | — | — | — |

**Week 3 Gate:**
- [ ] All labs completed
- [ ] ADRs approved
- [ ] Facilitator approval: ________

---

### Week 4 — Contract-First Development

| Lab | Status | Started | Completed | Duration | PR | Facilitator |
|-----|--------|---------|-----------|----------|----|----|
| Lab 4-0 — OpenAPI Endpoint | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 4-1 — Glossary Term | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 4-2 — MSW Handler | ⏳ NOT_STARTED | — | — | — | — | — |
| Lab 4-3 — Contract Validation | ⏳ NOT_STARTED | — | — | — | — | — |

**Week 4 Gate:**
- [ ] All labs completed
- [ ] Contracts approved
- [ ] Facilitator approval: ________
- [ ] Ready for Sprints

---

### Sprint 1 — Foundation Sprint

| Task | Status | Started | Completed | Notes |
|------|--------|---------|-----------|-------|
| Sprint Planning | ⏳ NOT_STARTED | — | — | |
| Backend Tasks | ⏳ NOT_STARTED | — | — | |
| Frontend Tasks | ⏳ NOT_STARTED | — | — | |
| Sprint Review | ⏳ NOT_STARTED | — | — | |
| Sprint Retro | ⏳ NOT_STARTED | — | — | |

**Sprint 1 Gate:** ☐ Complete | ☐ Demo delivered | ☐ Facilitator: ________

---

### Sprint 2 — Core Features

| Task | Status | Started | Completed | Notes |
|------|--------|---------|-----------|-------|
| Sprint Planning | ⏳ NOT_STARTED | — | — | |
| Backend Tasks | ⏳ NOT_STARTED | — | — | |
| Frontend Tasks | ⏳ NOT_STARTED | — | — | |
| NFR Checklist | ⏳ NOT_STARTED | — | — | |
| Sprint Review | ⏳ NOT_STARTED | — | — | |

**Sprint 2 Gate:** ☐ Complete | ☐ NFRs met | ☐ Facilitator: ________

---

### Sprint 3 — Security Hardening

| Task | Status | Started | Completed | Notes |
|------|--------|---------|-----------|-------|
| Sprint Planning | ⏳ NOT_STARTED | — | — | |
| Security Tasks | ⏳ NOT_STARTED | — | — | |
| Auth Implementation | ⏳ NOT_STARTED | — | — | |
| Security Checklist | ⏳ NOT_STARTED | — | — | |
| Sprint Review | ⏳ NOT_STARTED | — | — | |

**Sprint 3 Gate:** ☐ Complete | ☐ Security passed | ☐ Facilitator: ________

---

### Sprint 4 — Production Ready

| Task | Status | Started | Completed | Notes |
|------|--------|---------|-----------|-------|
| Sprint Planning | ⏳ NOT_STARTED | — | — | |
| Performance Optimization | ⏳ NOT_STARTED | — | — | |
| Documentation | ⏳ NOT_STARTED | — | — | |
| Ship-Ready Checklist | ⏳ NOT_STARTED | — | — | |
| Final Demo | ⏳ NOT_STARTED | — | — | |

**Sprint 4 Gate:** ☐ Complete | ☐ Ship-ready | ☐ Facilitator: ________

---

## Bootcamp Completion

| Milestone | Status | Date | Verified By |
|-----------|--------|------|-------------|
| All Weeks Completed | ⏳ | — | — |
| All Sprints Completed | ⏳ | — | — |
| Final Assessment | ⏳ | — | — |
| Certificate Issued | ⏳ | — | — |

---

## Time Log

| Date | Duration | Activity | Notes |
|------|----------|----------|-------|
| {{START_DATE}} | — | Bootcamp started | |

**Total Time:** 0h

---

## Achievements 🏆

<!-- Achievements are automatically added when criteria are met -->

---

## Facilitator Notes

<!-- Facilitators add notes here during reviews -->

---

## Blockers / Help Needed

<!-- Student adds blockers here; facilitator responds -->

---

## Personal Reflections

### What I'm learning:


### What's challenging:


### Questions for next session:

```

### Task 4: Create progress/scripts/init-student.mjs

```javascript
#!/usr/bin/env node
/**
 * Initialize a new student progress file
 * 
 * Usage:
 *   node progress/scripts/init-student.mjs --name "John Smith" --github jsmith --cohort 2026-01 --track backend
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRESS_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_PATH = path.join(PROGRESS_ROOT, '.template', 'STUDENT_PROGRESS.md');

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

// === INPUT VALIDATION (Error Prevention) ===

function validateUsername(username) {
  // GitHub username rules: alphanumeric, hyphens, 1-39 chars, no leading hyphen
  const valid = /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i.test(username);
  if (!valid) {
    console.error(`❌ Invalid GitHub username: "${username}"`);
    console.error('   Must be alphanumeric with hyphens, 1-39 characters, cannot start/end with hyphen');
    process.exit(1);
  }
  return true;
}

function validateCohort(cohort) {
  // Expected format: YYYY-MM
  const valid = /^\d{4}-\d{2}$/.test(cohort);
  if (!valid) {
    console.error(`❌ Invalid cohort format: "${cohort}"`);
    console.error('   Expected format: YYYY-MM (e.g., 2026-01)');
    process.exit(1);
  }
  return true;
}

function validateTrack(track) {
  const validTracks = ['frontend', 'backend'];
  if (!validTracks.includes(track.toLowerCase())) {
    console.error(`❌ Invalid track: "${track}"`);
    console.error(`   Must be one of: ${validTracks.join(', ')}`);
    process.exit(1);
  }
  return true;
}

function checkExistingStudent(cohortDir, username, force = false) {
  const filePath = path.join(cohortDir, `${username}.md`);
  if (fs.existsSync(filePath)) {
    if (force) {
      console.warn(`⚠️ Overwriting existing student file: ${filePath}`);
      return true;
    }
    console.error(`❌ Student file already exists: ${filePath}`);
    console.error('   Use --force to overwrite, or choose a different username');
    process.exit(1);
  }
  return false;
}

function validateLabId(labId) {
  // Valid patterns for lab IDs
  const VALID_LAB_PATTERNS = [
    /^week-0[1-4]-lab-0[0-6]$/,           // Week 1-4 labs (0-6)
    /^sprint-0[1-4]-step-\d{2}$/,         // Sprint steps
    /^sprint-0[1-4]-task-[a-z0-9-]+$/     // Sprint tasks (flexible naming)
  ];
  
  const isValid = VALID_LAB_PATTERNS.some(pattern => pattern.test(labId));
  if (!isValid) {
    console.error(`❌ Invalid lab ID: "${labId}"`);
    console.error('   Expected formats:');
    console.error('     - week-01-lab-00 through week-04-lab-06');
    console.error('     - sprint-01-step-00 through sprint-04-step-XX');
    console.error('     - sprint-01-task-{name}');
    console.error('   Examples: week-01-lab-03, sprint-02-step-01, sprint-03-task-backend');
    process.exit(1);
  }
  return true;
}

// === END VALIDATION ===

function main() {
  const args = parseArgs(process.argv.slice(2));
  
  // Validate required args
  const required = ['name', 'github', 'cohort', 'track'];
  const missing = required.filter(r => !args[r]);
  if (missing.length > 0) {
    console.error(`❌ Missing required arguments: ${missing.join(', ')}`);
    console.log(`
Usage:
  node progress/scripts/init-student.mjs --name "John Smith" --github jsmith --cohort 2026-01 --track backend

Options:
  --name       Full name of the student (required)
  --github     GitHub username (required)
  --cohort     Cohort identifier, e.g., 2026-01 (required)
  --track      frontend or backend (required)
  --facilitator GitHub username of facilitator (optional)
  --force      Overwrite existing student file (optional)
`);
    process.exit(1);
  }

  // === VALIDATE INPUTS ===
  validateUsername(args.github);
  validateCohort(args.cohort);
  validateTrack(args.track);
  // === END VALIDATION ===

  // Create cohort folder if needed
  const cohortDir = path.join(PROGRESS_ROOT, 'cohorts', args.cohort);
  if (!fs.existsSync(cohortDir)) {
    fs.mkdirSync(cohortDir, { recursive: true });
    console.log(`📁 Created cohort folder: ${args.cohort}`);
  }

  // Check if student file already exists (with force option)
  checkExistingStudent(cohortDir, args.github, args.force);

  const studentFile = path.join(cohortDir, `${args.github}.md`);

  // Read template
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`❌ Template not found: ${TEMPLATE_PATH}`);
    process.exit(1);
  }
  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Replace placeholders
  const today = new Date().toISOString().split('T')[0];
  const replacements = {
    '{{STUDENT_NAME}}': args.name,
    '{{GITHUB_USERNAME}}': args.github,
    '{{COHORT}}': args.cohort,
    '{{START_DATE}}': today,
    '{{TRACK}}': args.track.toLowerCase(),
    '{{FACILITATOR}}': args.facilitator || 'TBD',
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    template = template.replaceAll(placeholder, value);
  }

  // Write student file
  fs.writeFileSync(studentFile, template);
  console.log(`✅ Created student progress file: ${studentFile}`);
  console.log(`
🤖 Tip: You can also interact with the bootcamp via Copilot Chat!
   Try saying "Start the bootcamp" or "What's next for me?"
   See COPILOT_COURSE_COMMANDS.md for all available commands.
`);
  console.log(`
Next steps:
1. Student should review their progress file
2. Start Lab 0 and run: npm run progress:start -- week-01-lab-00 --student ${args.github}
`);
}

main();
```

### Task 5: Create progress/scripts/update-progress.mjs

```javascript
#!/usr/bin/env node
/**
 * Update student progress flags
 * 
 * Usage:
 *   node progress/scripts/update-progress.mjs start week-01-lab-02 --student jsmith
 *   node progress/scripts/update-progress.mjs complete week-01-lab-02 --student jsmith --pr 15
 *   node progress/scripts/update-progress.mjs view --student jsmith
 *   node progress/scripts/update-progress.mjs cohort 2026-01
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRESS_ROOT = path.resolve(__dirname, '..');

function parseArgs(args) {
  const parsed = { _: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      parsed[key] = value;
      if (value !== true) i++;
    } else {
      parsed._.push(args[i]);
    }
  }
  return parsed;
}

function findStudentFile(student) {
  const cohortsDir = path.join(PROGRESS_ROOT, 'cohorts');
  if (!fs.existsSync(cohortsDir)) return null;
  
  for (const cohort of fs.readdirSync(cohortsDir)) {
    const cohortPath = path.join(cohortsDir, cohort);
    if (!fs.statSync(cohortPath).isDirectory()) continue;
    
    const studentFile = path.join(cohortPath, `${student}.md`);
    if (fs.existsSync(studentFile)) {
      return { path: studentFile, cohort };
    }
  }
  return null;
}

function updateLabStatus(content, labId, status, extras = {}) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
  
  // Map lab ID to display name pattern
  const labPatterns = {
    'week-01-lab-00': 'Lab 0 — Setup Verification',
    'week-01-lab-01': 'Lab 1 — Plan Only',
    'week-01-lab-02': 'Lab 2 — Scaffold Vertical Slice',
    'week-01-lab-03': 'Lab 3 — Tests First',
    'week-01-lab-04': 'Lab 4 — Refactor Guarded',
    'week-01-lab-05': 'Lab 5 — OpenShift Readiness',
    'week-01-lab-06': 'Lab 6 — Capstone Mini-Feature',
    // Add more mappings as needed
  };

  const labName = labPatterns[labId];
  if (!labName) {
    console.warn(`⚠️ Unknown lab ID: ${labId}`);
    return content;
  }

  // Find and update the line
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(labName)) {
      const parts = lines[i].split('|').map(p => p.trim());
      if (parts.length >= 7) {
        if (status === 'start') {
          parts[2] = '🔄 IN_PROGRESS';
          parts[3] = now;
        } else if (status === 'complete') {
          parts[2] = '✅ COMPLETE';
          parts[4] = now;
          if (extras.pr) parts[6] = `#${extras.pr}`;
        }
        lines[i] = '| ' + parts.slice(1).join(' | ') + ' |';
      }
      break;
    }
  }
  
  return lines.join('\n');
}

function viewProgress(studentFile) {
  const content = fs.readFileSync(studentFile, 'utf8');
  
  // Extract quick stats
  const completed = (content.match(/✅ COMPLETE/g) || []).length;
  const inProgress = (content.match(/🔄 IN_PROGRESS/g) || []).length;
  const blocked = (content.match(/🔴 BLOCKED/g) || []).length;
  
  console.log(`
📊 Student Progress Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Completed:    ${completed}
🔄 In Progress:  ${inProgress}
🔴 Blocked:      ${blocked}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

function viewCohort(cohortId) {
  const cohortDir = path.join(PROGRESS_ROOT, 'cohorts', cohortId);
  if (!fs.existsSync(cohortDir)) {
    console.error(`❌ Cohort not found: ${cohortId}`);
    process.exit(1);
  }

  console.log(`\n📈 Cohort ${cohortId} Overview\n${'━'.repeat(50)}`);
  
  const students = fs.readdirSync(cohortDir).filter(f => f.endsWith('.md'));
  for (const student of students) {
    const content = fs.readFileSync(path.join(cohortDir, student), 'utf8');
    const completed = (content.match(/✅ COMPLETE/g) || []).length;
    const inProgress = (content.match(/🔄 IN_PROGRESS/g) || []).length;
    const username = student.replace('.md', '');
    
    let status = '⚪';
    if (completed >= 23) status = '🟢';
    else if (inProgress > 0) status = '🟡';
    else if (completed > 0) status = '🔵';
    
    console.log(`${status} @${username}: ${completed}/23 labs, ${inProgress} in progress`);
  }
  console.log('━'.repeat(50));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!command) {
    console.log(`
Usage:
  npm run progress:start -- <lab-id> --student <username>
  npm run progress:complete -- <lab-id> --student <username> --pr <number>
  npm run progress:view -- --student <username>
  npm run progress:cohort -- <cohort-id>
`);
    process.exit(0);
  }

  if (command === 'view') {
    if (!args.student) {
      console.error('❌ --student required');
      process.exit(1);
    }
    const result = findStudentFile(args.student);
    if (!result) {
      console.error(`❌ Student not found: ${args.student}`);
      process.exit(1);
    }
    viewProgress(result.path);
    return;
  }

  if (command === 'cohort') {
    const cohortId = args._[1];
    if (!cohortId) {
      console.error('❌ Cohort ID required');
      process.exit(1);
    }
    viewCohort(cohortId);
    return;
  }

  if (command === 'start' || command === 'complete') {
    const labId = args._[1];
    if (!labId || !args.student) {
      console.error('❌ Lab ID and --student required');
      process.exit(1);
    }

    const result = findStudentFile(args.student);
    if (!result) {
      console.error(`❌ Student not found: ${args.student}`);
      process.exit(1);
    }

    let content = fs.readFileSync(result.path, 'utf8');
    content = updateLabStatus(content, labId, command, { pr: args.pr });
    fs.writeFileSync(result.path, content);

    const emoji = command === 'start' ? '🚀' : '✅';
    console.log(`${emoji} ${command === 'start' ? 'Started' : 'Completed'} ${labId} for @${args.student}`);
    return;
  }

  console.error(`❌ Unknown command: ${command}`);
  process.exit(1);
}

main();
```

### Task 6: Create cohorts placeholder

Create `progress/cohorts/.gitkeep` (empty file).

### Task 7: Update package.json

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "progress:init": "node progress/scripts/init-student.mjs",
    "progress:start": "node progress/scripts/update-progress.mjs start",
    "progress:complete": "node progress/scripts/update-progress.mjs complete",
    "progress:view": "node progress/scripts/update-progress.mjs view",
    "progress:cohort": "node progress/scripts/update-progress.mjs cohort",
    "progress:dashboard": "node progress/scripts/update-progress.mjs dashboard"
  }
}
```

---

## Error Recovery Procedures

### If recon gate fails:
1. Document the unexpected state
2. DO NOT proceed with edits
3. Report to Coordinator with:
   - What was expected
   - What was found
   - Recommended remediation

### If edit fails:
1. Capture error message
2. Attempt single retry with verbose output
3. If retry fails, rollback changes:
   ```bash
   git checkout -- progress/
   ```
4. Report failure to Coordinator

### If verification fails:
1. Document which verification step failed
2. Check for common causes:
   - Missing npm install
   - Wrong working directory
   - File permissions
3. Attempt remediation
4. If unresolvable, mark phase as blocked

---

## Output contract (mandatory)

Return:
1. **Plan** (brief, 5-10 bullets)
2. **Patch** (unified diff for each file created/modified)
3. **Verification commands:**
   ```bash
   # Verify structure
   ls -la progress/
   ls -la progress/.template/
   ls -la progress/scripts/
   
   # Verify scripts run
   node progress/scripts/init-student.mjs --help
   
   # Test init (with test student)
   node progress/scripts/init-student.mjs --name "Test Student" --github teststudent --cohort test --track backend
   cat progress/cohorts/test/teststudent.md
   
   # Cleanup test
   rm -rf progress/cohorts/test
   ```
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E09_PROGRESSION_SYSTEM_WORKLOG.md`

---

## Success criteria
- [ ] `progress/` folder structure created
- [ ] `progress/README.md` explains the system
- [ ] `.template/STUDENT_PROGRESS.md` has all weeks and sprints
- [ ] `init-student.mjs` creates student files from template
- [ ] `update-progress.mjs` can start/complete labs
- [ ] `package.json` has progress scripts
- [ ] Test student creation works

---

## Coordination notes

- **Depends on:** E01 (package.json must exist)
- **Runs in:** Phase 2.5 (after E01+E02, before content phases)
- **Integrates with:** E10 (dashboard reads from progress files)
