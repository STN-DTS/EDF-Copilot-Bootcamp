# E16_SIGNAL_AUTOMATION — Signal File Helper Scripts

## Mission
Create helper scripts for consistent signal file creation across all agents.

**Spawned via:** `runSubagent` tool  
**Phase:** 4 (Tooling) — Can run concurrently with E17, E18  
**Dependencies:** enhance-04 signal file patterns

---

## File ownership (absolute)

**Owned paths:**
- `enhance-05/SCAFFOLDS/create-signal.mjs` (create new)
- `enhance-05/SCAFFOLDS/validate-signals.mjs` (create new)
- `enhance-05/SCAFFOLDS/README.md` (create/update)

**Must NOT edit:**
- Any production files
- Agent instruction files

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **SCAFFOLDS folder exists or create it:**
   ```bash
   ls enhance-05/SCAFFOLDS/ || mkdir -p enhance-05/SCAFFOLDS
   ```

2. **Review enhance-04 signal patterns:**
   ```bash
   cat enhance-04/WORK_PRODUCTS/SIGNALS/E01_COMPLETE.signal
   ```

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create enhance-05/SCAFFOLDS/README.md

```markdown
# enhance-05 Scaffolds

Helper scripts and templates for enhance-05 agent execution.

## Scripts

### create-signal.mjs
Creates a standardized signal file for agent completion.

```bash
node enhance-05/SCAFFOLDS/create-signal.mjs <AGENT_ID> <STATUS> "<NOTES>"

# Examples:
node enhance-05/SCAFFOLDS/create-signal.mjs E12 SUCCESS "Runner integration complete"
node enhance-05/SCAFFOLDS/create-signal.mjs E13 PARTIAL "Backup works, restore has issues"
node enhance-05/SCAFFOLDS/create-signal.mjs E14 FAILED "Config parsing error"
```

### validate-signals.mjs
Validates all signal files for a phase.

```bash
node enhance-05/SCAFFOLDS/validate-signals.mjs [--phase <N>]

# Examples:
node enhance-05/SCAFFOLDS/validate-signals.mjs           # Check all signals
node enhance-05/SCAFFOLDS/validate-signals.mjs --phase 2 # Check Phase 2 only
```

## Signal File Format

```yaml
# Exx_COMPLETE.signal
timestamp: 2026-01-29T14:30:00Z
status: SUCCESS | PARTIAL | FAILED
agent: Exx
notes: |
  Description of what was accomplished
```

## Phase Signal Requirements

| Phase | Required Signals |
|-------|------------------|
| 1 | E12 |
| 2 | E13, E14 |
| 3 | E15 |
| 4 | E16, E17, E18 |
| 5 | E19, E20, E21, E22 |
| 6 | E08v2 |
```

### Task 2: Create enhance-05/SCAFFOLDS/create-signal.mjs

```javascript
#!/usr/bin/env node

/**
 * create-signal.mjs
 * 
 * Creates a standardized signal file for agent completion.
 * 
 * Usage:
 *   node enhance-05/SCAFFOLDS/create-signal.mjs <AGENT_ID> <STATUS> "<NOTES>"
 * 
 * Arguments:
 *   AGENT_ID  - Agent identifier (e.g., E12, E13)
 *   STATUS    - SUCCESS | PARTIAL | FAILED
 *   NOTES     - Description of completion (quoted string)
 * 
 * Example:
 *   node enhance-05/SCAFFOLDS/create-signal.mjs E12 SUCCESS "Runner integration complete"
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Signal directory relative to enhance-05 folder
const SIGNALS_DIR = join(__dirname, '..', 'WORK_PRODUCTS', 'SIGNALS');

// Valid status values
const VALID_STATUSES = ['SUCCESS', 'PARTIAL', 'FAILED'];

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Usage: node create-signal.mjs <AGENT_ID> <STATUS> [NOTES]

Arguments:
  AGENT_ID  Agent identifier (e.g., E12, E13, E08v2)
  STATUS    One of: SUCCESS, PARTIAL, FAILED
  NOTES     Optional description (default: "Completed")

Examples:
  node create-signal.mjs E12 SUCCESS "Runner integration complete"
  node create-signal.mjs E13 PARTIAL "Backup works, restore pending"
  node create-signal.mjs E14 FAILED "Config parsing error"
`);
    process.exit(1);
  }
  
  const [agentId, status, ...noteParts] = args;
  const notes = noteParts.join(' ') || 'Completed';
  
  // Validate agent ID
  if (!/^E\d{2}v?\d?$/.test(agentId)) {
    console.error(`❌ Invalid agent ID: ${agentId}`);
    console.error('   Expected format: E12, E13, E08v2, etc.');
    process.exit(1);
  }
  
  // Validate status
  if (!VALID_STATUSES.includes(status.toUpperCase())) {
    console.error(`❌ Invalid status: ${status}`);
    console.error(`   Valid values: ${VALID_STATUSES.join(', ')}`);
    process.exit(1);
  }
  
  // Ensure signals directory exists
  if (!existsSync(SIGNALS_DIR)) {
    mkdirSync(SIGNALS_DIR, { recursive: true });
    console.log(`📁 Created signals directory: ${SIGNALS_DIR}`);
  }
  
  // Generate signal content
  const timestamp = new Date().toISOString();
  const signalContent = `# ${agentId}_COMPLETE.signal
timestamp: ${timestamp}
status: ${status.toUpperCase()}
agent: ${agentId}
notes: |
  ${notes.split('\n').join('\n  ')}
`;
  
  // Write signal file
  const signalPath = join(SIGNALS_DIR, `${agentId}_COMPLETE.signal`);
  
  try {
    writeFileSync(signalPath, signalContent, 'utf-8');
    console.log(`✅ Signal file created: ${signalPath}`);
    console.log('');
    console.log('Contents:');
    console.log('---');
    console.log(signalContent);
  } catch (err) {
    console.error(`❌ Failed to create signal: ${err.message}`);
    process.exit(1);
  }
}

main();
```

### Task 3: Create enhance-05/SCAFFOLDS/validate-signals.mjs

```javascript
#!/usr/bin/env node

/**
 * validate-signals.mjs
 * 
 * Validates signal files for enhance-05 phase gates.
 * 
 * Usage:
 *   node enhance-05/SCAFFOLDS/validate-signals.mjs [--phase <N>]
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SIGNALS_DIR = join(__dirname, '..', 'WORK_PRODUCTS', 'SIGNALS');

// Phase definitions
const PHASES = {
  1: ['E12'],
  2: ['E13', 'E14'],
  3: ['E15'],
  4: ['E16', 'E17', 'E18'],
  5: ['E19', 'E20', 'E21', 'E22'],
  6: ['E08v2']
};

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { phase: null };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--phase' && args[i + 1]) {
      result.phase = parseInt(args[++i], 10);
    }
  }
  
  return result;
}

function validateSignal(agentId) {
  const signalPath = join(SIGNALS_DIR, `${agentId}_COMPLETE.signal`);
  
  if (!existsSync(signalPath)) {
    return { valid: false, error: 'Signal file not found' };
  }
  
  try {
    const content = readFileSync(signalPath, 'utf-8');
    
    // Check required fields
    if (!content.includes('timestamp:')) {
      return { valid: false, error: 'Missing timestamp' };
    }
    if (!content.includes('status:')) {
      return { valid: false, error: 'Missing status' };
    }
    
    // Check status value
    const statusMatch = content.match(/status:\s*(SUCCESS|PARTIAL|FAILED)/i);
    if (!statusMatch) {
      return { valid: false, error: 'Invalid status value' };
    }
    
    const status = statusMatch[1].toUpperCase();
    
    return {
      valid: true,
      status,
      warning: status !== 'SUCCESS' ? `Status is ${status}` : null
    };
  } catch (err) {
    return { valid: false, error: `Parse error: ${err.message}` };
  }
}

function main() {
  const { phase } = parseArgs();
  
  console.log('\n🔍 Signal Validation Report\n');
  
  if (!existsSync(SIGNALS_DIR)) {
    console.error('❌ Signals directory not found:', SIGNALS_DIR);
    process.exit(1);
  }
  
  const phases = phase ? { [phase]: PHASES[phase] } : PHASES;
  
  let totalChecks = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  
  for (const [phaseNum, agents] of Object.entries(phases)) {
    console.log(`Phase ${phaseNum}:`);
    
    for (const agentId of agents) {
      const result = validateSignal(agentId);
      totalChecks++;
      
      if (result.valid) {
        totalPassed++;
        const icon = result.warning ? '⚠️' : '✅';
        console.log(`  ${icon} ${agentId}: ${result.status}${result.warning ? ` (${result.warning})` : ''}`);
        if (result.warning) totalWarnings++;
      } else {
        totalFailed++;
        console.log(`  ❌ ${agentId}: ${result.error}`);
      }
    }
    
    console.log('');
  }
  
  console.log('---');
  console.log(`Total: ${totalChecks} signals checked`);
  console.log(`  ✅ Passed: ${totalPassed}`);
  console.log(`  ⚠️ Warnings: ${totalWarnings}`);
  console.log(`  ❌ Failed: ${totalFailed}`);
  
  if (totalFailed > 0) {
    console.log('\n❌ Validation FAILED - Some signals missing or invalid');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n⚠️ Validation PASSED with warnings');
    process.exit(0);
  } else {
    console.log('\n✅ Validation PASSED');
    process.exit(0);
  }
}

main();
```

### Task 4: Test the scripts

```bash
# Test create-signal
node enhance-05/SCAFFOLDS/create-signal.mjs E16 SUCCESS "Signal automation complete"

# Verify file created
cat enhance-05/WORK_PRODUCTS/SIGNALS/E16_COMPLETE.signal

# Test validate-signals
node enhance-05/SCAFFOLDS/validate-signals.mjs --phase 4

# Clean up test signal
rm enhance-05/WORK_PRODUCTS/SIGNALS/E16_COMPLETE.signal
```

---

## Output contract (mandatory)

Return:
1. **Recon findings**
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (unified diff for each file created)
4. **Verification commands** and their actual output
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E16_SIGNAL_AUTOMATION_WORKLOG.md`
6. **Signal file** via the script you created!

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Ideas for additional signal metadata
- Integration opportunities with CI/CD
- Suggestions for automated phase gating

---

## Success Criteria

- [ ] `create-signal.mjs` script works
- [ ] `validate-signals.mjs` script works
- [ ] README.md documents usage
- [ ] Scripts handle edge cases (invalid input)
- [ ] Phase validation works correctly
- [ ] Work log created
- [ ] Signal file created (using own script!)
