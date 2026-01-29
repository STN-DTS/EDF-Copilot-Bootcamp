# E17_TECH_DEBT_CLEANUP — Technical Debt Cleanup

## Mission
Fix hardcoded lab ID mappings and add flexible cohort format support.

**Spawned via:** `runSubagent` tool  
**Phase:** 4 (Tooling) — Can run concurrently with E16, E18  
**Dependencies:** enhance-04 progress system

---

## File ownership (absolute)

**Owned paths:**
- `progress/scripts/update-progress.mjs` — Lab ID validation section only
- `progress/scripts/migrate-progress.mjs` (create new)
- `progress/config/cohort-settings.json` (create new)

**Coordination:** 
- E14 creates `progress/config/alert-thresholds.json` (different file)
- E21 modifies lab display name resolution (different section)

**Must NOT edit:**
- `progress/scripts/check-alerts.mjs` (E14 owns)
- `progress/scripts/init-student.mjs`
- `scripts/bootcamp.mjs` (E12 owns)

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Current validation function:**
   ```bash
   grep -A 20 "validateCohort" progress/scripts/update-progress.mjs
   ```

2. **Current lab ID patterns:**
   ```bash
   grep -A 30 "validateLabId" progress/scripts/update-progress.mjs
   ```

3. **Config folder exists (E14 may have created it):**
   ```bash
   ls progress/config/
   ```

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Update cohort validation for flexibility

Modify `validateCohort` in `progress/scripts/update-progress.mjs`:

```javascript
/**
 * Validates cohort format.
 * Supports multiple formats:
 * - YYYY-MM (e.g., 2026-01)
 * - YYYY-Q# (e.g., 2026-Q1)
 * - alphanumeric-with-dashes (e.g., pilot-cohort-a)
 * 
 * @param {string} cohort - Cohort identifier
 * @returns {{ valid: boolean, error?: string, format?: string }}
 */
function validateCohort(cohort) {
  if (!cohort) {
    return { valid: false, error: 'Cohort is required (--cohort)' };
  }
  
  // YYYY-MM format (e.g., 2026-01)
  if (/^\d{4}-\d{2}$/.test(cohort)) {
    return { valid: true, format: 'YYYY-MM' };
  }
  
  // YYYY-Q# format (e.g., 2026-Q1)
  if (/^\d{4}-Q[1-4]$/i.test(cohort)) {
    return { valid: true, format: 'YYYY-Q#' };
  }
  
  // Alphanumeric with dashes (e.g., pilot-cohort-a)
  if (/^[a-z0-9][a-z0-9-]*[a-z0-9]$/i.test(cohort) && cohort.length >= 3) {
    return { valid: true, format: 'custom' };
  }
  
  return { 
    valid: false, 
    error: 'Cohort must be:\n' +
           '  - YYYY-MM format (e.g., 2026-01)\n' +
           '  - YYYY-Q# format (e.g., 2026-Q1)\n' +
           '  - Alphanumeric with dashes (e.g., pilot-cohort-a)'
  };
}
```

### Task 2: Expand lab ID validation patterns

Update `validateLabId` to support more patterns:

```javascript
/**
 * Validates lab ID format.
 * @param {string} labId - Lab ID to validate
 * @returns {{ valid: boolean, error?: string, type?: string, details?: object }}
 */
function validateLabId(labId) {
  if (!labId) {
    return { valid: false, error: 'Lab ID is required' };
  }
  
  // Week lab format: week-XX-lab-XX (e.g., week-01-lab-02)
  // Support weeks 1-4, labs 0-9
  const weekLabMatch = labId.match(/^week-0([1-4])-lab-0([0-9])$/);
  if (weekLabMatch) {
    return { 
      valid: true, 
      type: 'week',
      details: {
        week: parseInt(weekLabMatch[1], 10),
        lab: parseInt(weekLabMatch[2], 10)
      }
    };
  }
  
  // Sprint step format: sprint-XX-step-XX (e.g., sprint-01-step-01)
  // Support sprints 1-4, steps 0-9
  const sprintStepMatch = labId.match(/^sprint-0([1-4])-step-0([0-9])$/);
  if (sprintStepMatch) {
    return { 
      valid: true, 
      type: 'sprint',
      details: {
        sprint: parseInt(sprintStepMatch[1], 10),
        step: parseInt(sprintStepMatch[2], 10)
      }
    };
  }
  
  // Workshop format: workshop-XX (e.g., workshop-01)
  const workshopMatch = labId.match(/^workshop-(\d{2})$/);
  if (workshopMatch) {
    return {
      valid: true,
      type: 'workshop',
      details: {
        workshop: parseInt(workshopMatch[1], 10)
      }
    };
  }
  
  return { 
    valid: false, 
    error: 'Lab ID must be one of:\n' +
           '  - week-XX-lab-XX (e.g., week-01-lab-02)\n' +
           '  - sprint-XX-step-XX (e.g., sprint-01-step-01)\n' +
           '  - workshop-XX (e.g., workshop-01)'
  };
}
```

### Task 3: Create cohort settings config

Create `progress/config/cohort-settings.json`:

```json
{
  "defaultFormat": "YYYY-MM",
  "allowedFormats": ["YYYY-MM", "YYYY-Q#", "custom"],
  "cohortDuration": {
    "YYYY-MM": { "months": 2 },
    "YYYY-Q#": { "months": 3 },
    "custom": { "months": 2 }
  },
  "labTypes": {
    "week": {
      "pattern": "week-XX-lab-XX",
      "weeksSupported": [1, 2, 3, 4],
      "labsPerWeek": 7
    },
    "sprint": {
      "pattern": "sprint-XX-step-XX",
      "sprintsSupported": [1, 2, 3, 4],
      "stepsPerSprint": 5
    },
    "workshop": {
      "pattern": "workshop-XX",
      "maxWorkshops": 10
    }
  }
}
```

### Task 4: Create migration script

Create `progress/scripts/migrate-progress.mjs`:

```javascript
#!/usr/bin/env node

/**
 * migrate-progress.mjs
 * 
 * Migrates student progress files when template format changes.
 * 
 * Usage:
 *   npm run progress:migrate -- --cohort 2026-01 [--dry-run]
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROGRESS_ROOT = join(__dirname, '..');

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    cohort: args.includes('--cohort') ? args[args.indexOf('--cohort') + 1] : null,
    dryRun: args.includes('--dry-run'),
    all: args.includes('--all')
  };
}

function detectVersion(content) {
  // Check for version markers or structural differences
  if (content.includes('## 📊 Progress Summary')) {
    return 'v2';
  }
  if (content.includes('## Progress')) {
    return 'v1';
  }
  return 'unknown';
}

function migrateV1ToV2(content) {
  // Add migration transformations here
  // Example: Add new sections, update table format, etc.
  
  let migrated = content;
  
  // Example migration: Add summary section if missing
  if (!content.includes('## 📊 Progress Summary')) {
    migrated = migrated.replace(
      '## 📅 Week 1',
      '## 📊 Progress Summary\n\n(Auto-generated summary will appear here)\n\n---\n\n## 📅 Week 1'
    );
  }
  
  return migrated;
}

function migrateFile(filePath, dryRun) {
  const content = readFileSync(filePath, 'utf-8');
  const version = detectVersion(content);
  
  console.log(`  ${filePath}: version ${version}`);
  
  if (version === 'v1') {
    const migrated = migrateV1ToV2(content);
    
    if (dryRun) {
      console.log('    Would migrate to v2');
      return { migrated: false, dryRun: true };
    }
    
    writeFileSync(filePath, migrated);
    console.log('    ✅ Migrated to v2');
    return { migrated: true };
  }
  
  return { migrated: false, upToDate: true };
}

function main() {
  const { cohort, dryRun, all } = parseArgs();
  
  if (!cohort && !all) {
    console.log('Usage: npm run progress:migrate -- --cohort <cohort> [--dry-run]');
    console.log('       npm run progress:migrate -- --all [--dry-run]');
    process.exit(1);
  }
  
  if (dryRun) {
    console.log('🔍 DRY RUN - No files will be modified\n');
  }
  
  const cohortsDir = join(PROGRESS_ROOT, 'cohorts');
  const cohorts = all 
    ? readdirSync(cohortsDir).filter(d => !d.startsWith('.'))
    : [cohort];
  
  let totalFiles = 0;
  let migratedFiles = 0;
  
  for (const c of cohorts) {
    const cohortDir = join(cohortsDir, c);
    
    if (!existsSync(cohortDir)) {
      console.log(`⚠️ Cohort not found: ${c}`);
      continue;
    }
    
    console.log(`\nProcessing cohort: ${c}`);
    
    const files = readdirSync(cohortDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      totalFiles++;
      const result = migrateFile(join(cohortDir, file), dryRun);
      if (result.migrated) migratedFiles++;
    }
  }
  
  console.log(`\n--- Summary ---`);
  console.log(`Total files: ${totalFiles}`);
  console.log(`Migrated: ${migratedFiles}`);
}

main();
```

### Task 5: Update package.json change request

Create `enhance-05/PACKAGE_CHANGES/E17.json`:

```json
{
  "scripts": {
    "progress:migrate": "node progress/scripts/migrate-progress.mjs"
  }
}
```

### Task 6: Test the changes

```bash
# Test flexible cohort formats
npm run progress:init -- --name "Test" --github testflex --cohort 2026-Q1 --track backend
npm run progress:init -- --name "Test" --github testflex2 --cohort pilot-cohort-a --track backend

# Test expanded lab ID validation
# (Through update-progress or directly)

# Test migration (dry-run)
npm run progress:migrate -- --cohort 2026-01 --dry-run

# Cleanup
rm -rf progress/cohorts/2026-Q1
rm -rf progress/cohorts/pilot-cohort-a
```

---

## Output contract (mandatory)

Return:
1. **Recon findings**
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (unified diff for each file created/modified)
4. **Verification commands** and their actual output
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E17_TECH_DEBT_CLEANUP_WORKLOG.md`
6. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E17_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Edge cases in format validation
- Migration challenges
- Additional technical debt discovered

---

## Success Criteria

- [ ] Cohort validation accepts YYYY-MM format
- [ ] Cohort validation accepts YYYY-Q# format
- [ ] Cohort validation accepts custom alphanumeric format
- [ ] Lab ID validation expanded for all weeks/sprints
- [ ] Migration script created and works
- [ ] Cohort settings config created
- [ ] Package.json changes in queue
- [ ] Work log created
- [ ] Signal file created
