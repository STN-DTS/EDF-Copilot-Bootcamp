# E21_LAB_ID_AUTODISCOVERY — Auto-Discover Lab IDs from bootcamp/steps/

## Mission
Create logic to auto-discover valid lab IDs from the bootcamp/steps folder structure.

**Spawned via:** `runSubagent` tool  
**Phase:** 5 (Extended Tooling) — Can run concurrently with E19, E20, E22  
**Dependencies:** E12 runner integration

---

## File ownership (absolute)

**Owned paths:**
- `scripts/utils/lab-discovery.mjs` (create new)
- `scripts/bootcamp.mjs` — Add import for dynamic lab list (coordinate with E12, E18)

**Coordination:**
- E12 adds `--progress` flag
- E18 adds path normalization
- E21 adds lab ID discovery

**Must NOT edit:**
- `bootcamp/steps/index.yaml` content
- Test files
- Documentation

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Bootcamp steps folder structure:**
   ```bash
   ls bootcamp/steps/
   ```

2. **Index.yaml format:**
   ```bash
   head -50 bootcamp/steps/index.yaml
   ```

3. **Week folder contents:**
   ```bash
   ls bootcamp/steps/week-01/
   ```

4. **Sample lab file:**
   ```bash
   head -30 bootcamp/steps/week-01/lab-00.yaml
   ```

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create scripts/utils/lab-discovery.mjs

```javascript
#!/usr/bin/env node

/**
 * lab-discovery.mjs
 * 
 * Auto-discovers valid lab IDs from the bootcamp/steps folder structure.
 * 
 * Discovery Strategy:
 * 1. Read index.yaml for top-level structure
 * 2. Scan week-XX folders for lab-XX.yaml files
 * 3. Scan sprint-XX folders for sprint files
 * 4. Build canonical ID map
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { parse as parseYaml } from 'yaml';

const STEPS_ROOT = 'bootcamp/steps';

/**
 * Discovers all available step IDs from the bootcamp/steps folder.
 * 
 * @returns {Object} Discovery result with:
 *   - labs: Array of lab IDs (e.g., ['week-01-lab-00', ...])
 *   - weeks: Array of week IDs
 *   - sprints: Array of sprint IDs
 *   - all: Combined array of all IDs
 *   - byCategory: { weeks: {...}, sprints: {...} }
 * 
 * @example
 * const { labs, weeks, sprints, all } = discoverSteps();
 * console.log(labs); // ['week-01-lab-00', 'week-01-lab-01', ...]
 */
export function discoverSteps() {
  const result = {
    labs: [],
    weeks: [],
    sprints: [],
    all: [],
    byCategory: {
      weeks: {},
      sprints: {}
    }
  };
  
  // Ensure steps root exists
  if (!existsSync(STEPS_ROOT)) {
    console.warn(`Warning: ${STEPS_ROOT} not found`);
    return result;
  }
  
  // Scan for week folders
  const weekFolders = readdirSync(STEPS_ROOT)
    .filter(f => f.startsWith('week-'))
    .sort();
  
  for (const weekFolder of weekFolders) {
    const weekPath = join(STEPS_ROOT, weekFolder);
    
    if (!statSync(weekPath).isDirectory()) continue;
    
    result.weeks.push(weekFolder);
    result.byCategory.weeks[weekFolder] = [];
    
    // Scan for lab files in week folder
    const labFiles = readdirSync(weekPath)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
      .sort();
    
    for (const labFile of labFiles) {
      const labName = basename(labFile, extname(labFile));
      const labId = `${weekFolder}-${labName}`;
      
      result.labs.push(labId);
      result.byCategory.weeks[weekFolder].push(labId);
    }
  }
  
  // Scan for sprint folders
  const sprintFolders = readdirSync(STEPS_ROOT)
    .filter(f => f.startsWith('sprint-'))
    .sort();
  
  for (const sprintFolder of sprintFolders) {
    const sprintPath = join(STEPS_ROOT, sprintFolder);
    
    if (!statSync(sprintPath).isDirectory()) continue;
    
    result.sprints.push(sprintFolder);
    result.byCategory.sprints[sprintFolder] = [];
    
    // Scan for sprint step files
    const stepFiles = readdirSync(sprintPath)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
      .sort();
    
    for (const stepFile of stepFiles) {
      const stepName = basename(stepFile, extname(stepFile));
      const stepId = `${sprintFolder}-${stepName}`;
      
      result.sprints.push(stepId);
      result.byCategory.sprints[sprintFolder].push(stepId);
    }
  }
  
  // Build combined list
  result.all = [...result.labs, ...result.sprints];
  
  return result;
}

/**
 * Validates if a step ID exists.
 * 
 * @param {string} stepId - Step ID to validate (e.g., 'week-01-lab-00')
 * @returns {boolean} True if step exists
 */
export function isValidStepId(stepId) {
  const { all } = discoverSteps();
  return all.includes(stepId);
}

/**
 * Finds the file path for a step ID.
 * 
 * @param {string} stepId - Step ID (e.g., 'week-01-lab-00')
 * @returns {string|null} Path to YAML file or null if not found
 * 
 * @example
 * getStepPath('week-01-lab-00')
 * // Returns: 'bootcamp/steps/week-01/lab-00.yaml'
 */
export function getStepPath(stepId) {
  // Parse step ID
  const parts = stepId.split('-');
  
  if (parts.length < 4) return null;
  
  const category = parts[0]; // 'week' or 'sprint'
  const categoryNum = parts[1]; // '01', '02', etc.
  const folder = `${category}-${categoryNum}`;
  const fileName = parts.slice(2).join('-') + '.yaml';
  
  const filePath = join(STEPS_ROOT, folder, fileName);
  
  if (existsSync(filePath)) {
    return filePath;
  }
  
  // Try .yml extension
  const ymlPath = filePath.replace('.yaml', '.yml');
  if (existsSync(ymlPath)) {
    return ymlPath;
  }
  
  return null;
}

/**
 * Gets step metadata from YAML file.
 * 
 * @param {string} stepId - Step ID
 * @returns {Object|null} Parsed YAML content or null
 */
export function getStepMetadata(stepId) {
  const path = getStepPath(stepId);
  
  if (!path) return null;
  
  try {
    const content = readFileSync(path, 'utf-8');
    return parseYaml(content);
  } catch (err) {
    console.warn(`Warning: Failed to parse ${path}: ${err.message}`);
    return null;
  }
}

/**
 * Lists steps in a specific week.
 * 
 * @param {string} week - Week ID (e.g., 'week-01')
 * @returns {string[]} Array of step IDs
 */
export function getStepsInWeek(week) {
  const { byCategory } = discoverSteps();
  return byCategory.weeks[week] || [];
}

/**
 * Lists steps in a specific sprint.
 * 
 * @param {string} sprint - Sprint ID (e.g., 'sprint-01')
 * @returns {string[]} Array of step IDs
 */
export function getStepsInSprint(sprint) {
  const { byCategory } = discoverSteps();
  return byCategory.sprints[sprint] || [];
}

/**
 * Suggests closest match for an invalid step ID.
 * 
 * @param {string} input - User input
 * @returns {string[]} Array of suggestions (max 5)
 */
export function suggestStepId(input) {
  const { all } = discoverSteps();
  const inputLower = input.toLowerCase();
  
  // Exact match
  if (all.includes(input)) return [input];
  
  // Partial matches
  const matches = all.filter(id => 
    id.toLowerCase().includes(inputLower) ||
    inputLower.includes(id.toLowerCase())
  );
  
  return matches.slice(0, 5);
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--list') || args.includes('-l')) {
    const { all } = discoverSteps();
    console.log('Available step IDs:');
    all.forEach(id => console.log(`  ${id}`));
  } else if (args.includes('--json')) {
    const result = discoverSteps();
    console.log(JSON.stringify(result, null, 2));
  } else if (args.length > 0) {
    const stepId = args[0];
    if (isValidStepId(stepId)) {
      const path = getStepPath(stepId);
      const meta = getStepMetadata(stepId);
      console.log(`Step: ${stepId}`);
      console.log(`Path: ${path}`);
      console.log(`Title: ${meta?.title || 'N/A'}`);
    } else {
      console.log(`Invalid step ID: ${stepId}`);
      const suggestions = suggestStepId(stepId);
      if (suggestions.length > 0) {
        console.log('Did you mean:');
        suggestions.forEach(s => console.log(`  ${s}`));
      }
    }
  } else {
    console.log('Usage:');
    console.log('  node lab-discovery.mjs --list       # List all step IDs');
    console.log('  node lab-discovery.mjs --json       # Output as JSON');
    console.log('  node lab-discovery.mjs <step-id>    # Validate and show step info');
  }
}
```

### Task 2: Update scripts/bootcamp.mjs to use discovery

Add import:
```javascript
import { discoverSteps, isValidStepId, suggestStepId } from './utils/lab-discovery.mjs';
```

Enhance step validation:
```javascript
// Before executing step:
if (!isValidStepId(stepId)) {
  console.log(`❌ Invalid step ID: ${stepId}`);
  const suggestions = suggestStepId(stepId);
  if (suggestions.length > 0) {
    console.log('\nDid you mean:');
    suggestions.forEach(s => console.log(`  npm run bootcamp -- step ${s}`));
  }
  process.exit(1);
}
```

Enhance list command:
```javascript
// For 'npm run bootcamp:list':
const { labs, weeks, sprints } = discoverSteps();

console.log('\n📚 Available Steps:\n');

for (const week of weeks) {
  console.log(`${week}:`);
  const weekLabs = getStepsInWeek(week);
  weekLabs.forEach(lab => {
    const meta = getStepMetadata(lab);
    console.log(`  ${lab} — ${meta?.title || 'Untitled'}`);
  });
  console.log('');
}
```

### Task 3: Test discovery

```bash
# List all discovered IDs
node scripts/utils/lab-discovery.mjs --list

# Get JSON output
node scripts/utils/lab-discovery.mjs --json

# Validate specific ID
node scripts/utils/lab-discovery.mjs week-01-lab-00

# Test suggestion for typo
node scripts/utils/lab-discovery.mjs week-01-lab
```

---

## Output contract (mandatory)

Return:
1. **Recon findings** (folder structure, file formats)
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (unified diff for each file created/modified)
4. **Verification commands** and their actual output
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E21_LAB_ID_AUTODISCOVERY_WORKLOG.md`
6. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E21_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Step ID naming conventions
- Missing or inconsistent steps
- Metadata patterns across labs

---

## Success Criteria

- [ ] `lab-discovery.mjs` created
- [ ] `discoverSteps()` returns all valid IDs
- [ ] `isValidStepId()` validates IDs
- [ ] `suggestStepId()` suggests alternatives
- [ ] `bootcamp.mjs` uses discovery
- [ ] List command shows dynamic content
- [ ] Typos get suggestions
- [ ] Work log created
- [ ] Signal file created
