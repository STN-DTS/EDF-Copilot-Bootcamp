# E19_VALIDATION_CONSOLIDATION — Unified Validation Command

## Mission
Create a single `npm run validate:all` command that runs all validation checks.

**Spawned via:** `runSubagent` tool  
**Phase:** 5 (Extended Tooling) — Can run concurrently with E20, E21, E22  
**Dependencies:** enhance-04 validation patterns

---

## File ownership (absolute)

**Owned paths:**
- `scripts/validate-all.mjs` (create new)

**Creates (in queue):**
- `enhance-05/PACKAGE_CHANGES/E19.json` — validate:all script

**Must NOT edit:**
- Individual validation scripts
- Production code

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Existing validation commands:**
   ```bash
   grep -E "check:|validate:" package.json
   ```

2. **Scripts folder exists:**
   ```bash
   ls scripts/
   ```

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create scripts/validate-all.mjs

```javascript
#!/usr/bin/env node

/**
 * validate-all.mjs
 * 
 * Runs all validation checks for the bootcamp repository.
 * 
 * Usage:
 *   npm run validate:all [options]
 * 
 * Options:
 *   --quick     Run essential checks only
 *   --verbose   Show detailed output
 *   --json      Output results as JSON
 */

import { execSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

// Validation definitions
const VALIDATIONS = {
  essential: [
    {
      name: 'NPM Install Check',
      command: 'npm list --depth=0',
      description: 'Verify dependencies are installed'
    },
    {
      name: 'Bootcamp Runner',
      command: 'npm run bootcamp:list',
      description: 'Verify bootcamp runner works'
    },
    {
      name: 'Link Check',
      command: 'npm run check:links',
      description: 'Check for broken internal links',
      timeout: 120000 // 2 minutes
    }
  ],
  extended: [
    {
      name: 'Step Sample Test',
      command: 'npm run bootcamp -- step week-01-lab-00',
      description: 'Test loading a specific step'
    },
    {
      name: 'Progress System',
      command: 'npm run progress:alerts -- --cohort 2026-01',
      description: 'Verify progress system works',
      allowFailure: true // May fail if no students
    },
    {
      name: 'YAML Syntax',
      command: 'node -e "require(\'yaml\'); console.log(\'YAML module OK\')"',
      description: 'Verify YAML module loads'
    }
  ],
  structure: [
    {
      name: 'Scripts Folder',
      check: () => existsSync('scripts/bootcamp.mjs'),
      description: 'Verify scripts/bootcamp.mjs exists'
    },
    {
      name: 'Bootcamp Steps',
      check: () => existsSync('bootcamp/steps/index.yaml'),
      description: 'Verify bootcamp/steps/index.yaml exists'
    },
    {
      name: 'Progress System',
      check: () => existsSync('progress/scripts/init-student.mjs'),
      description: 'Verify progress/scripts/init-student.mjs exists'
    },
    {
      name: 'VS Code Extensions',
      check: () => existsSync('.vscode/extensions.json'),
      description: 'Verify .vscode/extensions.json exists'
    }
  ]
};

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    quick: args.includes('--quick'),
    verbose: args.includes('--verbose'),
    json: args.includes('--json')
  };
}

// Run a command and return result
function runCommand(validation, verbose) {
  const start = Date.now();
  
  try {
    const output = execSync(validation.command, {
      encoding: 'utf-8',
      stdio: verbose ? 'inherit' : 'pipe',
      timeout: validation.timeout || 60000
    });
    
    return {
      name: validation.name,
      status: 'PASS',
      duration: Date.now() - start,
      output: verbose ? '' : output.slice(0, 500)
    };
  } catch (err) {
    if (validation.allowFailure) {
      return {
        name: validation.name,
        status: 'WARN',
        duration: Date.now() - start,
        output: err.message
      };
    }
    
    return {
      name: validation.name,
      status: 'FAIL',
      duration: Date.now() - start,
      output: err.message
    };
  }
}

// Run a file existence check
function runCheck(validation) {
  const start = Date.now();
  
  try {
    const result = validation.check();
    
    return {
      name: validation.name,
      status: result ? 'PASS' : 'FAIL',
      duration: Date.now() - start,
      output: result ? 'Exists' : 'Not found'
    };
  } catch (err) {
    return {
      name: validation.name,
      status: 'FAIL',
      duration: Date.now() - start,
      output: err.message
    };
  }
}

// Format duration
function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// Print result line
function printResult(result) {
  const icon = result.status === 'PASS' ? '✅' : 
               result.status === 'WARN' ? '⚠️' : '❌';
  const duration = formatDuration(result.duration);
  
  console.log(`  ${icon} ${result.name} (${duration})`);
}

// Main
async function main() {
  const { quick, verbose, json } = parseArgs();
  const results = [];
  
  console.log('\n🔍 Running Validation Suite\n');
  console.log(`Mode: ${quick ? 'Quick' : 'Full'}`);
  console.log('');
  
  // Structure checks (always run, fast)
  console.log('📁 Structure Checks:');
  for (const validation of VALIDATIONS.structure) {
    const result = runCheck(validation);
    results.push(result);
    if (!json) printResult(result);
  }
  console.log('');
  
  // Essential checks
  console.log('🔧 Essential Checks:');
  for (const validation of VALIDATIONS.essential) {
    const result = runCommand(validation, verbose);
    results.push(result);
    if (!json) printResult(result);
  }
  console.log('');
  
  // Extended checks (skip if quick mode)
  if (!quick) {
    console.log('📋 Extended Checks:');
    for (const validation of VALIDATIONS.extended) {
      const result = runCommand(validation, verbose);
      results.push(result);
      if (!json) printResult(result);
    }
    console.log('');
  }
  
  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;
  
  if (json) {
    console.log(JSON.stringify({
      summary: { total, passed, warned, failed },
      results
    }, null, 2));
  } else {
    console.log('---');
    console.log(`📊 Summary: ${total} checks`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ⚠️ Warnings: ${warned}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log('');
    
    if (failed > 0) {
      console.log('❌ VALIDATION FAILED');
      console.log('\nFailed checks:');
      results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`  - ${r.name}: ${r.output.slice(0, 100)}`);
      });
      process.exit(1);
    } else if (warned > 0) {
      console.log('⚠️ VALIDATION PASSED WITH WARNINGS');
      process.exit(0);
    } else {
      console.log('✅ ALL VALIDATIONS PASSED');
      process.exit(0);
    }
  }
}

main().catch(err => {
  console.error('❌ Validation error:', err.message);
  process.exit(1);
});
```

### Task 2: Create package.json change request

Create `enhance-05/PACKAGE_CHANGES/E19.json`:

```json
{
  "scripts": {
    "validate:all": "node scripts/validate-all.mjs",
    "validate:quick": "node scripts/validate-all.mjs --quick"
  }
}
```

### Task 3: Test the validation command

```bash
# Full validation
npm run validate:all

# Quick validation
npm run validate:quick

# Verbose output
npm run validate:all -- --verbose

# JSON output
npm run validate:all -- --json
```

---

## Output contract (mandatory)

Return:
1. **Recon findings**
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (unified diff for each file created)
4. **Verification commands** and their actual output
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E19_VALIDATION_CONSOLIDATION_WORKLOG.md`
6. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E19_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Additional validation checks needed
- Performance optimization ideas
- CI/CD integration opportunities

---

## Success Criteria

- [ ] `validate-all.mjs` script created
- [ ] Full validation runs all checks
- [ ] Quick mode skips extended checks
- [ ] JSON output works
- [ ] Exit code reflects status
- [ ] Package.json changes in queue
- [ ] Work log created
- [ ] Signal file created
