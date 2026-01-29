# E13_BACKUP_RESTORE — Progress Backup & Restore System

## Mission
Create a backup and restore system for student progress files to enable data recovery.

**Spawned via:** `runSubagent` tool  
**Phase:** 2 (Data Safety) — Can run concurrently with E14  
**Dependencies:** enhance-04 E09 (progress folder structure)

---

## File ownership (absolute)

**Owned paths:**
- `progress/scripts/backup-cohort.mjs` (create new)
- `progress/backups/.gitkeep` (create folder)
- `progress/backups/README.md` (create new)

**Creates (in queue):**
- `enhance-05/PACKAGE_CHANGES/E13.json` — Backup/restore scripts

**Must NOT edit:**
- `progress/cohorts/**` (student data)
- `progress/scripts/init-student.mjs`
- `progress/scripts/update-progress.mjs`

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Progress folder structure exists:**
   ```bash
   ls progress/scripts/
   ls progress/cohorts/
   ```

2. **Backup folder does NOT exist:**
   ```bash
   ls progress/backups/
   # Should fail or be empty
   ```

3. **Read existing progress scripts** to understand patterns

**Output your recon findings before proceeding.**

---

## Agent Health Check (run first)

```bash
# Can write to progress folder
echo "test" > progress/.test-write && rm progress/.test-write && echo "✅ Write OK"

# Node available
node --version && echo "✅ Node OK"

# Archive tool available (tar or zip)
tar --version || zip --version && echo "✅ Archive tool OK"
```

**If any health check fails, report and do not proceed.**

---

## Tasks

### Task 1: Create backup folder structure

```
progress/backups/
├── .gitkeep
└── README.md
```

### Task 2: Create progress/backups/README.md

```markdown
# Progress Backups

This folder contains automated backups of student progress files.

## Structure

```
backups/
└── {cohort}/
    ├── {YYYY-MM-DD_HHMMSS}.tar.gz  # Timestamped backup
    └── manifest.json                # Backup metadata
```

## Usage

### Create a backup
```bash
npm run progress:backup -- --cohort 2026-01
```

### List available backups
```bash
npm run progress:backups -- --cohort 2026-01
```

### Restore from backup
```bash
npm run progress:restore -- --cohort 2026-01 --date 2026-01-25
```

## Retention Policy
- Keeps last 10 backups per cohort
- Older backups are automatically pruned
```

### Task 3: Create progress/scripts/backup-cohort.mjs

```javascript
#!/usr/bin/env node

/**
 * backup-cohort.mjs
 * 
 * Backup and restore student progress files.
 * 
 * Usage:
 *   npm run progress:backup -- --cohort 2026-01
 *   npm run progress:backups -- --cohort 2026-01
 *   npm run progress:restore -- --cohort 2026-01 --date 2026-01-25
 * 
 * Commands:
 *   backup   Create a new backup of cohort progress files
 *   list     List available backups for a cohort
 *   restore  Restore cohort progress from a backup
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROGRESS_ROOT = join(__dirname, '..');
const BACKUPS_DIR = join(PROGRESS_ROOT, 'backups');
const COHORTS_DIR = join(PROGRESS_ROOT, 'cohorts');

const MAX_BACKUPS = 10;

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    command: args[0] || 'backup',
    cohort: null,
    date: null,
    dryRun: args.includes('--dry-run')
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cohort' && args[i + 1]) {
      result.cohort = args[++i];
    } else if (args[i] === '--date' && args[i + 1]) {
      result.date = args[++i];
    }
  }

  return result;
}

// ============================================================================
// Backup Functions
// ============================================================================

function createBackup(cohort, dryRun) {
  const cohortDir = join(COHORTS_DIR, cohort);
  
  if (!existsSync(cohortDir)) {
    console.error(`❌ Error: Cohort '${cohort}' not found at ${cohortDir}`);
    process.exit(1);
  }

  const backupDir = join(BACKUPS_DIR, cohort);
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupName = `${timestamp}.tar.gz`;
  const backupPath = join(backupDir, backupName);

  if (dryRun) {
    console.log('🔍 DRY RUN - No changes will be made');
    console.log(`Would create backup: ${backupPath}`);
    console.log(`Source: ${cohortDir}`);
    return;
  }

  console.log(`📦 Creating backup for cohort '${cohort}'...`);
  
  try {
    // Create tar.gz archive
    execSync(`tar -czf "${backupPath}" -C "${COHORTS_DIR}" "${cohort}"`, {
      stdio: 'pipe'
    });
    
    // Update manifest
    updateManifest(cohort, backupName);
    
    // Prune old backups
    pruneOldBackups(cohort);
    
    console.log(`✅ Backup created: ${backupPath}`);
  } catch (err) {
    console.error(`❌ Backup failed: ${err.message}`);
    process.exit(1);
  }
}

function updateManifest(cohort, backupName) {
  const manifestPath = join(BACKUPS_DIR, cohort, 'manifest.json');
  let manifest = { backups: [] };
  
  if (existsSync(manifestPath)) {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  }
  
  manifest.backups.push({
    filename: backupName,
    created: new Date().toISOString(),
    cohort: cohort
  });
  
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function pruneOldBackups(cohort) {
  const backupDir = join(BACKUPS_DIR, cohort);
  const manifestPath = join(backupDir, 'manifest.json');
  
  if (!existsSync(manifestPath)) return;
  
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  
  while (manifest.backups.length > MAX_BACKUPS) {
    const oldest = manifest.backups.shift();
    const oldPath = join(backupDir, oldest.filename);
    
    if (existsSync(oldPath)) {
      rmSync(oldPath);
      console.log(`🗑️ Pruned old backup: ${oldest.filename}`);
    }
  }
  
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function listBackups(cohort) {
  const backupDir = join(BACKUPS_DIR, cohort);
  const manifestPath = join(backupDir, 'manifest.json');
  
  if (!existsSync(manifestPath)) {
    console.log(`📭 No backups found for cohort '${cohort}'`);
    return;
  }
  
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  
  console.log(`\n📋 Backups for cohort '${cohort}':\n`);
  console.log('| # | Date | Filename |');
  console.log('|---|------|----------|');
  
  manifest.backups.forEach((backup, idx) => {
    const date = new Date(backup.created).toLocaleDateString();
    console.log(`| ${idx + 1} | ${date} | ${backup.filename} |`);
  });
  
  console.log(`\nTotal: ${manifest.backups.length} backups (max ${MAX_BACKUPS})`);
}

function restoreBackup(cohort, date, dryRun) {
  const backupDir = join(BACKUPS_DIR, cohort);
  const manifestPath = join(backupDir, 'manifest.json');
  
  if (!existsSync(manifestPath)) {
    console.error(`❌ Error: No backups found for cohort '${cohort}'`);
    process.exit(1);
  }
  
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  
  // Find backup matching date
  const backup = manifest.backups.find(b => b.filename.startsWith(date) || b.created.startsWith(date));
  
  if (!backup) {
    console.error(`❌ Error: No backup found for date '${date}'`);
    console.log('Available backups:');
    listBackups(cohort);
    process.exit(1);
  }
  
  const backupPath = join(backupDir, backup.filename);
  
  if (!existsSync(backupPath)) {
    console.error(`❌ Error: Backup file not found: ${backupPath}`);
    process.exit(1);
  }
  
  if (dryRun) {
    console.log('🔍 DRY RUN - No changes will be made');
    console.log(`Would restore from: ${backupPath}`);
    console.log(`To: ${join(COHORTS_DIR, cohort)}`);
    return;
  }
  
  console.log(`⚠️ This will overwrite current progress for cohort '${cohort}'`);
  console.log(`Restoring from: ${backup.filename}`);
  
  try {
    // Extract backup
    execSync(`tar -xzf "${backupPath}" -C "${COHORTS_DIR}"`, {
      stdio: 'pipe'
    });
    
    console.log(`✅ Restore complete for cohort '${cohort}'`);
  } catch (err) {
    console.error(`❌ Restore failed: ${err.message}`);
    process.exit(1);
  }
}

// ============================================================================
// Main
// ============================================================================

function main() {
  const { command, cohort, date, dryRun } = parseArgs();
  
  if (!cohort && command !== 'help') {
    console.error('❌ Error: --cohort is required');
    console.log('\nUsage:');
    console.log('  npm run progress:backup -- --cohort 2026-01');
    console.log('  npm run progress:backups -- --cohort 2026-01');
    console.log('  npm run progress:restore -- --cohort 2026-01 --date 2026-01-25');
    process.exit(1);
  }
  
  switch (command) {
    case 'backup':
      createBackup(cohort, dryRun);
      break;
    case 'list':
    case 'backups':
      listBackups(cohort);
      break;
    case 'restore':
      if (!date) {
        console.error('❌ Error: --date is required for restore');
        process.exit(1);
      }
      restoreBackup(cohort, date, dryRun);
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
}

main();
```

### Task 4: Create package.json change request

Create `enhance-05/PACKAGE_CHANGES/E13.json`:

```json
{
  "scripts": {
    "progress:backup": "node progress/scripts/backup-cohort.mjs backup",
    "progress:restore": "node progress/scripts/backup-cohort.mjs restore",
    "progress:backups": "node progress/scripts/backup-cohort.mjs list"
  }
}
```

### Task 5: Test the system

```bash
# Create test cohort if needed
npm run progress:init -- --name "Backup Test" --github backuptest --cohort backup-test --track backend

# Test backup
npm run progress:backup -- --cohort backup-test

# Test list
npm run progress:backups -- --cohort backup-test

# Test dry-run restore
npm run progress:restore -- --cohort backup-test --date 2026-01-29 --dry-run

# Cleanup
rm -rf progress/cohorts/backup-test
rm -rf progress/backups/backup-test
```

---

## Output contract (mandatory)

Return:
1. **Recon findings**
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (unified diff for each file created/modified)
4. **Verification commands** and their actual output
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E13_BACKUP_RESTORE_WORKLOG.md`
6. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E13_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Cross-platform issues with tar command
- Edge cases in backup/restore
- Suggestions for enhancement

---

## Success Criteria

- [ ] `progress/backups/` folder structure created
- [ ] `backup-cohort.mjs` script works
- [ ] Backup creates timestamped archive
- [ ] List shows available backups
- [ ] Restore works from backup
- [ ] Auto-prune keeps only last 10 backups
- [ ] Dry-run mode works
- [ ] Package.json changes in queue
- [ ] Work log created
- [ ] Signal file created
