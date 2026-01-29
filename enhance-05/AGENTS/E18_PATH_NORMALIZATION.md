# E18_PATH_NORMALIZATION — Cross-Platform Path Handling

## Mission
Add cross-platform path normalization to all CLI scripts for consistent output.

**Spawned via:** `runSubagent` tool  
**Phase:** 4 (Tooling) — Can run concurrently with E16, E17  
**Dependencies:** enhance-04 scripts

---

## File ownership (absolute)

**Owned paths:**
- `scripts/utils/path-utils.mjs` (create new)
- `scripts/bootcamp.mjs` — Add import and use for output (coordinate with E12)
- `progress/scripts/*.mjs` — Add import and use for output

**Coordination:** 
- E12 modifies `scripts/bootcamp.mjs` for integration flags
- E18 only adds import and changes console output formatting

**Must NOT edit:**
- Core logic in any scripts
- Test files
- Documentation

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Scripts folder exists:**
   ```bash
   ls scripts/
   ```

2. **Current path output in bootcamp.mjs:**
   ```bash
   grep -n "console.log" scripts/bootcamp.mjs | head -20
   ```

3. **Current path output in progress scripts:**
   ```bash
   grep -n "console.log" progress/scripts/update-progress.mjs | head -10
   ```

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create scripts/utils/ folder

```bash
mkdir -p scripts/utils
```

### Task 2: Create scripts/utils/path-utils.mjs

```javascript
/**
 * path-utils.mjs
 * 
 * Cross-platform path utilities for consistent output.
 */

import { sep, posix } from 'node:path';

/**
 * Normalizes a path to POSIX format (forward slashes).
 * Use for all user-facing path output.
 * 
 * @param {string} filePath - Path to normalize
 * @returns {string} Path with forward slashes
 * 
 * @example
 * normalizePath('C:\\Users\\test\\file.md')
 * // Returns: 'C:/Users/test/file.md'
 */
export function normalizePath(filePath) {
  if (!filePath) return filePath;
  return filePath.split(sep).join(posix.sep);
}

/**
 * Normalizes a path relative to workspace root.
 * Removes drive letters and leading slashes for display.
 * 
 * @param {string} filePath - Absolute path
 * @param {string} workspaceRoot - Workspace root path
 * @returns {string} Relative POSIX path
 * 
 * @example
 * normalizeRelative('C:\\project\\src\\file.md', 'C:\\project')
 * // Returns: 'src/file.md'
 */
export function normalizeRelative(filePath, workspaceRoot) {
  if (!filePath || !workspaceRoot) return normalizePath(filePath);
  
  const normalizedFile = normalizePath(filePath);
  const normalizedRoot = normalizePath(workspaceRoot);
  
  if (normalizedFile.startsWith(normalizedRoot)) {
    let relative = normalizedFile.slice(normalizedRoot.length);
    // Remove leading slash
    if (relative.startsWith('/')) {
      relative = relative.slice(1);
    }
    return relative;
  }
  
  return normalizedFile;
}

/**
 * Formats a path for display with optional link markup.
 * 
 * @param {string} filePath - Path to format
 * @param {object} options - Formatting options
 * @param {number} options.lineNumber - Optional line number
 * @param {boolean} options.asLink - Format as markdown link
 * @returns {string} Formatted path string
 */
export function formatPath(filePath, options = {}) {
  const normalized = normalizePath(filePath);
  
  if (options.asLink) {
    if (options.lineNumber) {
      return `[${normalized}](${normalized}#L${options.lineNumber})`;
    }
    return `[${normalized}](${normalized})`;
  }
  
  if (options.lineNumber) {
    return `${normalized}:${options.lineNumber}`;
  }
  
  return normalized;
}

/**
 * Checks if running on Windows.
 * 
 * @returns {boolean}
 */
export function isWindows() {
  return process.platform === 'win32';
}

/**
 * Gets the appropriate path separator for display.
 * Always returns '/' for consistency.
 * 
 * @returns {string}
 */
export function displaySeparator() {
  return '/';
}
```

### Task 3: Update scripts/bootcamp.mjs

Add import at top:
```javascript
import { normalizePath } from './utils/path-utils.mjs';
```

Update path output locations:
```javascript
// Before:
console.log(`  - ${r}`);

// After:
console.log(`  - ${normalizePath(r)}`);
```

Apply to all path outputs in `printStep()` function.

### Task 4: Update progress scripts

Add import to each script that outputs paths:

**progress/scripts/update-progress.mjs:**
```javascript
import { normalizePath } from '../../scripts/utils/path-utils.mjs';

// Update file path outputs
console.log(`File: ${normalizePath(filePath)}`);
```

**progress/scripts/check-alerts.mjs:**
```javascript
import { normalizePath } from '../../scripts/utils/path-utils.mjs';
```

**progress/scripts/init-student.mjs:**
```javascript
import { normalizePath } from '../../scripts/utils/path-utils.mjs';
```

**progress/scripts/generate-dashboard.mjs:**
```javascript
import { normalizePath } from '../../scripts/utils/path-utils.mjs';
```

### Task 5: Test cross-platform output

```bash
# Test on Windows (or simulate)
npm run bootcamp -- step week-01-lab-00
# Should show paths with forward slashes

npm run progress:init -- --name "Path Test" --github pathtest --cohort path-test --track backend
# Should show file path with forward slashes

# Cleanup
rm -rf progress/cohorts/path-test
```

---

## Output contract (mandatory)

Return:
1. **Recon findings**
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (unified diff for each file created/modified)
4. **Verification commands** and their actual output
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E18_PATH_NORMALIZATION_WORKLOG.md`
6. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E18_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Path handling edge cases
- UNC path considerations
- Relative vs absolute path issues

---

## Success Criteria

- [ ] `scripts/utils/path-utils.mjs` created
- [ ] `normalizePath()` function works
- [ ] `bootcamp.mjs` uses normalized paths
- [ ] Progress scripts use normalized paths
- [ ] Output shows forward slashes on Windows
- [ ] No breaking changes to functionality
- [ ] Work log created
- [ ] Signal file created
