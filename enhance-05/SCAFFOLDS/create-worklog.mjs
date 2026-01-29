#!/usr/bin/env node

/**
 * create-worklog.mjs
 * 
 * Creates a work log template for an agent.
 * 
 * Usage:
 *   node create-worklog.mjs <agentId> [options]
 * 
 * Arguments:
 *   agentId   - Agent identifier (e.g., E12, E12_RUNNER_PROGRESS)
 * 
 * Options:
 *   --name <name>  - Human-readable name for the agent
 * 
 * Examples:
 *   node create-worklog.mjs E12_RUNNER_PROGRESS
 *   node create-worklog.mjs E12 --name "Runner Progress Integration"
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORK_PRODUCTS_DIR = join(__dirname, '..', 'WORK_PRODUCTS');

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node create-worklog.mjs <agentId> [options]

Arguments:
  agentId   - Agent identifier (e.g., E12, E12_RUNNER_PROGRESS)

Options:
  --name <name>  - Human-readable name for the agent

Examples:
  node create-worklog.mjs E12_RUNNER_PROGRESS
  node create-worklog.mjs E12 --name "Runner Progress Integration"
`);
    process.exit(0);
  }
  
  // Parse arguments
  let agentId = args[0].toUpperCase();
  let name = agentId;
  
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--name' && args[i + 1]) {
      name = args[i + 1];
      i++;
    }
  }
  
  // Normalize agent ID for filename
  if (!agentId.includes('_')) {
    agentId = `${agentId}_AGENT`;
  }
  
  // Ensure work products directory exists
  if (!existsSync(WORK_PRODUCTS_DIR)) {
    mkdirSync(WORK_PRODUCTS_DIR, { recursive: true });
    console.log(`📁 Created work products directory: ${WORK_PRODUCTS_DIR}`);
  }
  
  // Generate work log content
  const timestamp = new Date().toISOString();
  const worklogContent = `# ${agentId} Work Log

**Agent:** ${name}
**Started:** ${timestamp}
**Status:** In Progress

---

## Recon Findings

<!-- Document your recon findings here -->

### Files Examined

- [ ] File 1
- [ ] File 2

### Key Observations

1. Observation 1
2. Observation 2

---

## Plan

<!-- Document your plan here (5-10 bullets) -->

1. Step 1
2. Step 2
3. Step 3
4. Step 4
5. Step 5

---

## Changes Made

<!-- Document each change as a patch or description -->

### Change 1: [Description]

**File:** \`path/to/file\`

\`\`\`diff
- old code
+ new code
\`\`\`

### Change 2: [Description]

**File:** \`path/to/file\`

\`\`\`diff
- old code
+ new code
\`\`\`

---

## Verification

### Commands Run

\`\`\`bash
# Command 1
command output

# Command 2
command output
\`\`\`

### Test Results

| Test | Result | Notes |
|------|--------|-------|
| Test 1 | ✅/❌ | |
| Test 2 | ✅/❌ | |

---

## Issues Encountered

<!-- Document any issues and how they were resolved -->

1. Issue 1: [Description]
   - Resolution: [How it was fixed]

---

## Insights for enhance-05-extra.md

<!-- Note discoveries for future reference -->

- Insight 1
- Insight 2

---

## Completion

**Completed:** [timestamp]
**Status:** [SUCCESS/FAILURE]

**Signal created:** enhance-05/WORK_PRODUCTS/SIGNALS/${agentId.split('_')[0]}_COMPLETE.signal
`;
  
  // Write work log file
  const worklogPath = join(WORK_PRODUCTS_DIR, `${agentId}_WORKLOG.md`);
  
  // Check if already exists
  if (existsSync(worklogPath)) {
    console.log(`⚠️  Work log already exists: ${worklogPath}`);
    console.log('   Use --force to overwrite (not implemented)');
    process.exit(1);
  }
  
  try {
    writeFileSync(worklogPath, worklogContent, 'utf-8');
    
    console.log(`✅ Work log created: ${worklogPath}`);
    console.log(`   Agent: ${agentId}`);
    console.log(`   Time: ${timestamp}`);
    
    process.exit(0);
  } catch (err) {
    console.error(`❌ Failed to create work log: ${err.message}`);
    process.exit(1);
  }
}

main();
