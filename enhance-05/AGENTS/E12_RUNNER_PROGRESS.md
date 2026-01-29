# E12_RUNNER_PROGRESS — Runner + Progress Integration

## Mission
Integrate the bootcamp runner with the progress tracking system so students can start/complete labs with a single command.

**Spawned via:** `runSubagent` tool  
**Phase:** 1 (Foundation)  
**Dependencies:** enhance-04 E01 (runner), E09 (progress system)

---

## File ownership (absolute)

**Owned paths:**
- `scripts/bootcamp.mjs` — Add integration flags

**Creates (in queue):**
- `enhance-05/PACKAGE_CHANGES/E12.json` — Any new convenience scripts

**Must NOT edit:**
- `progress/scripts/*` (E17 and E21 own those)
- `package.json` directly (use change queue)
- Any `docs/**` files

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Runner exists:**
   ```bash
   ls scripts/bootcamp.mjs
   npm run bootcamp:list
   ```

2. **Progress system exists:**
   ```bash
   ls progress/scripts/update-progress.mjs
   npm run progress:init --help
   ```

3. **Read current bootcamp.mjs** to understand CLI parsing structure

**Output your recon findings before proceeding.**

---

## Agent Health Check (run first)

```bash
# Can write to scripts folder
echo "test" > scripts/.test-write && rm scripts/.test-write && echo "✅ Write OK"

# Node available
node --version && echo "✅ Node OK"

# Runner works
npm run bootcamp -- step week-01-lab-00 && echo "✅ Runner OK"
```

**If any health check fails, report and do not proceed.**

---

## Tasks

### Task 1: Add integration flags to bootcamp.mjs

Add support for these flags in the `step` command:
- `--mark-started <username>` — Mark lab as in-progress
- `--mark-complete <username>` — Mark lab as complete
- `--cohort <cohort-id>` — Required with mark flags
- `--pr <pr-number>` — Optional with mark-complete

**Implementation:**

```javascript
import { execSync } from 'node:child_process';

// In the step command handler, after displaying step info:

function handleProgressFlags(stepId, args) {
  const markStartedIdx = args.indexOf('--mark-started');
  const markCompleteIdx = args.indexOf('--mark-complete');
  const cohortIdx = args.indexOf('--cohort');
  
  if (markStartedIdx === -1 && markCompleteIdx === -1) {
    return; // No progress flags, nothing to do
  }
  
  // Validate cohort is provided
  if (cohortIdx === -1) {
    console.error('❌ Error: --cohort is required with --mark-started or --mark-complete');
    process.exit(1);
  }
  
  const cohort = args[cohortIdx + 1];
  
  if (markStartedIdx !== -1) {
    const username = args[markStartedIdx + 1];
    if (!username || username.startsWith('--')) {
      console.error('❌ Error: --mark-started requires a username');
      process.exit(1);
    }
    
    console.log(`\n📝 Marking ${stepId} as started for ${username}...`);
    try {
      execSync(`npm run progress:update -- start --student "${username}" --cohort "${cohort}" ${stepId}`, {
        stdio: 'inherit'
      });
    } catch (err) {
      console.error('⚠️ Failed to update progress:', err.message);
    }
  }
  
  if (markCompleteIdx !== -1) {
    const username = args[markCompleteIdx + 1];
    if (!username || username.startsWith('--')) {
      console.error('❌ Error: --mark-complete requires a username');
      process.exit(1);
    }
    
    const prIdx = args.indexOf('--pr');
    const pr = prIdx !== -1 ? args[prIdx + 1] : '';
    
    console.log(`\n✅ Marking ${stepId} as complete for ${username}...`);
    try {
      const prFlag = pr ? `--pr "${pr}"` : '';
      execSync(`npm run progress:update -- complete --student "${username}" --cohort "${cohort}" ${prFlag} ${stepId}`, {
        stdio: 'inherit'
      });
    } catch (err) {
      console.error('⚠️ Failed to update progress:', err.message);
    }
  }
}
```

### Task 2: Update help text

Add the new flags to the help output:

```javascript
// In help section
console.log(`
Usage:
  npm run bootcamp -- list
  npm run bootcamp -- step <STEP_ID> [options]
  
Options for 'step' command:
  --mark-started <username>  Mark lab as in-progress for student
  --mark-complete <username> Mark lab as complete for student
  --cohort <cohort-id>       Cohort identifier (required with mark flags)
  --pr <pr-number>           PR number (optional with --mark-complete)

Examples:
  npm run bootcamp -- step week-01-lab-02
  npm run bootcamp -- step week-01-lab-02 --mark-started jsmith --cohort 2026-01
  npm run bootcamp -- step week-01-lab-02 --mark-complete jsmith --cohort 2026-01 --pr 42
`);
```

### Task 3: Test integration

```bash
# Test with mark-started
npm run bootcamp -- step week-01-lab-00 --mark-started testuser --cohort test

# Test with mark-complete
npm run bootcamp -- step week-01-lab-00 --mark-complete testuser --cohort test --pr 99

# Test backward compatibility (no flags)
npm run bootcamp -- step week-01-lab-00

# Test error handling
npm run bootcamp -- step week-01-lab-00 --mark-started
# Should error: username required

npm run bootcamp -- step week-01-lab-00 --mark-started testuser
# Should error: cohort required
```

### Task 4: Create package.json change request (if needed)

If any new convenience scripts are needed, create:
`enhance-05/PACKAGE_CHANGES/E12.json`

---

## Output contract (mandatory)

Return:
1. **Recon findings** (environment state)
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (unified diff for each file modified)
4. **Verification commands** and their actual output
5. **Work log file** at: `enhance-05/WORK_PRODUCTS/E12_RUNNER_PROGRESS_WORKLOG.md`
6. **Signal file** via: `node enhance-05/SCAFFOLDS/create-signal.mjs E12 SUCCESS "notes"`
   Or create manually at: `enhance-05/WORK_PRODUCTS/SIGNALS/E12_COMPLETE.signal`

---

## Insight Capture

After completing your tasks, note any:
- Unexpected issues encountered
- Improvements that could be made
- Missed opportunities
- Recommendations for future enhancements

These will be added to `enhance-05-extra.md` by the Coordinator.

---

## Success Criteria

- [ ] `--mark-started` flag works
- [ ] `--mark-complete` flag works
- [ ] `--cohort` validation works
- [ ] `--pr` optional flag works
- [ ] Backward compatible (no flags = original behavior)
- [ ] Error messages are helpful
- [ ] Work log created
- [ ] Signal file created
