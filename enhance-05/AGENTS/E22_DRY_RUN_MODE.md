# E22_DRY_RUN_MODE — Dry-Run Mode for All CLI Commands

## Mission
Add `--dry-run` flag to all CLI commands to show what would happen without making changes.

**Spawned via:** `runSubagent` tool  
**Phase:** 5 (Extended Tooling) — Can run concurrently with E19, E20, E21  
**Dependencies:** E12, E18, E21 changes to runner/progress scripts

---

## File ownership (absolute)

**Owned paths:**
- `scripts/utils/dry-run.mjs` (create new)
- `scripts/bootcamp.mjs` — Add `--dry-run` support (coordinate with E12, E18, E21)
- `progress/scripts/*.mjs` — Add `--dry-run` support to each

**Coordination:**
- E12 adds `--progress` flag
- E18 adds path normalization
- E21 adds lab discovery
- E22 adds dry-run mode

**Must NOT edit:**
- YAML step files
- Documentation
- Test files

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Current CLI flags in bootcamp.mjs:**
   ```bash
   grep -n "args\|argv\|flag" scripts/bootcamp.mjs | head -20
   ```

2. **Current CLI flags in progress scripts:**
   ```bash
   grep -n "args\|argv\|flag" progress/scripts/update-progress.mjs | head -20
   ```

3. **File write operations to wrap:**
   ```bash
   grep -n "writeFile\|writeSync\|mkdir" scripts/bootcamp.mjs
   grep -n "writeFile\|writeSync\|mkdir" progress/scripts/update-progress.mjs
   ```

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create scripts/utils/dry-run.mjs

```javascript
/**
 * dry-run.mjs
 * 
 * Utilities for implementing dry-run mode across CLI commands.
 */

import { writeFileSync as fsWriteFileSync, mkdirSync as fsMkdirSync, rmSync as fsRmSync } from 'node:fs';
import { normalizePath } from './path-utils.mjs';

let DRY_RUN = false;
let VERBOSE = false;
const pendingOperations = [];

/**
 * Enable dry-run mode globally.
 */
export function enableDryRun(verbose = false) {
  DRY_RUN = true;
  VERBOSE = verbose;
  console.log('🔍 DRY-RUN MODE: No files will be modified\n');
}

/**
 * Check if dry-run mode is enabled.
 */
export function isDryRun() {
  return DRY_RUN;
}

/**
 * Get list of pending operations (for summary).
 */
export function getPendingOperations() {
  return [...pendingOperations];
}

/**
 * Clear pending operations list.
 */
export function clearPendingOperations() {
  pendingOperations.length = 0;
}

/**
 * Log an operation that would be performed.
 * 
 * @param {string} operation - Operation type
 * @param {string} target - Target path or description
 * @param {object} details - Additional details
 */
function logOperation(operation, target, details = {}) {
  const op = { operation, target, details, timestamp: new Date().toISOString() };
  pendingOperations.push(op);
  
  const icon = {
    'WRITE': '📝',
    'CREATE': '📁',
    'DELETE': '🗑️',
    'MKDIR': '📂',
    'UPDATE': '✏️'
  }[operation] || '❓';
  
  console.log(`  ${icon} [DRY-RUN] Would ${operation.toLowerCase()}: ${normalizePath(target)}`);
  
  if (VERBOSE && details.preview) {
    const preview = details.preview.slice(0, 200);
    console.log(`     Preview: ${preview}${details.preview.length > 200 ? '...' : ''}`);
  }
}

/**
 * Wrapped writeFileSync that respects dry-run mode.
 * 
 * @param {string} filePath - Path to write
 * @param {string} content - Content to write
 * @param {object} options - Write options
 */
export function writeFileSync(filePath, content, options) {
  if (DRY_RUN) {
    logOperation('WRITE', filePath, { 
      preview: content,
      size: content.length,
      options 
    });
    return;
  }
  
  fsWriteFileSync(filePath, content, options);
}

/**
 * Wrapped mkdirSync that respects dry-run mode.
 * 
 * @param {string} dirPath - Directory to create
 * @param {object} options - Mkdir options
 */
export function mkdirSync(dirPath, options) {
  if (DRY_RUN) {
    logOperation('MKDIR', dirPath, { options });
    return;
  }
  
  fsMkdirSync(dirPath, options);
}

/**
 * Wrapped rmSync that respects dry-run mode.
 * 
 * @param {string} targetPath - Path to delete
 * @param {object} options - Rm options
 */
export function rmSync(targetPath, options) {
  if (DRY_RUN) {
    logOperation('DELETE', targetPath, { options });
    return;
  }
  
  fsRmSync(targetPath, options);
}

/**
 * Print summary of what would happen in dry-run mode.
 */
export function printDryRunSummary() {
  if (!DRY_RUN) return;
  
  console.log('\n---');
  console.log('📋 DRY-RUN SUMMARY');
  console.log(`   Total operations: ${pendingOperations.length}`);
  
  const byType = {};
  for (const op of pendingOperations) {
    byType[op.operation] = (byType[op.operation] || 0) + 1;
  }
  
  for (const [type, count] of Object.entries(byType)) {
    console.log(`   ${type}: ${count}`);
  }
  
  console.log('\n   To execute for real, remove the --dry-run flag.');
}

/**
 * Parse common CLI flags.
 * 
 * @param {string[]} args - Command line arguments
 * @returns {object} Parsed flags
 */
export function parseCommonFlags(args) {
  const flags = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    help: args.includes('--help') || args.includes('-h'),
    quiet: args.includes('--quiet') || args.includes('-q')
  };
  
  if (flags.dryRun) {
    enableDryRun(flags.verbose);
  }
  
  return flags;
}

/**
 * Remove known flags from args array.
 * 
 * @param {string[]} args - Command line arguments
 * @returns {string[]} Positional arguments only
 */
export function stripFlags(args) {
  const flagSet = new Set([
    '--dry-run', '--verbose', '-v', '--help', '-h', '--quiet', '-q'
  ]);
  
  return args.filter(arg => !flagSet.has(arg) && !arg.startsWith('--'));
}
```

### Task 2: Update scripts/bootcamp.mjs

Add import:
```javascript
import { parseCommonFlags, printDryRunSummary, writeFileSync, mkdirSync } from './utils/dry-run.mjs';
```

Add flag parsing at top:
```javascript
const flags = parseCommonFlags(process.argv.slice(2));
```

Update help text:
```javascript
// Add to help output:
console.log('  --dry-run    Show what would happen without making changes');
console.log('  --verbose    Show detailed output');
```

Replace direct `fs.writeFileSync` calls with wrapped version.

Add summary at end:
```javascript
// At end of main():
printDryRunSummary();
```

### Task 3: Update progress scripts

**progress/scripts/init-student.mjs:**
```javascript
import { parseCommonFlags, printDryRunSummary, writeFileSync, mkdirSync } from '../../scripts/utils/dry-run.mjs';

// At start:
const flags = parseCommonFlags(process.argv.slice(2));

// Replace fs.writeFileSync with writeFileSync
// Replace fs.mkdirSync with mkdirSync

// At end:
printDryRunSummary();
```

**progress/scripts/update-progress.mjs:**
```javascript
import { parseCommonFlags, printDryRunSummary, writeFileSync } from '../../scripts/utils/dry-run.mjs';

// At start:
const flags = parseCommonFlags(process.argv.slice(2));

// Replace fs.writeFileSync with writeFileSync

// At end:
printDryRunSummary();
```

### Task 4: Test dry-run mode

```bash
# Test bootcamp runner
npm run bootcamp -- step week-01-lab-00 --dry-run

# Test progress init
npm run progress:init -- --name "Dry Test" --github drytest --cohort test --track backend --dry-run

# Test progress update
npm run progress:update -- --github drytest --cohort test --lab lab-00 --status complete --dry-run

# Verify no files were created
ls progress/cohorts/test/  # Should not exist
```

---

## Output contract (mandatory)

Return:
1. **Recon findings**
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (unified diff for each file created/modified)
4. **Verification commands** and their actual output
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E22_DRY_RUN_MODE_WORKLOG.md`
6. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E22_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Additional CLI commands that need dry-run
- Edge cases in file operations
- Potential for undo/rollback feature

---

## Success Criteria

- [ ] `dry-run.mjs` utility created
- [ ] `bootcamp.mjs` supports `--dry-run`
- [ ] `init-student.mjs` supports `--dry-run`
- [ ] `update-progress.mjs` supports `--dry-run`
- [ ] Summary shows what would happen
- [ ] No files created in dry-run mode
- [ ] Work log created
- [ ] Signal file created
