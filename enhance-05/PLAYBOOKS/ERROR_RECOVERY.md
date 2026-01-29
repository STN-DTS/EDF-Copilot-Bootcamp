# Error Recovery Playbook

Comprehensive procedures for recovering from errors in bootcamp scripts and multi-agent orchestration.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Bootcamp Script Errors](#bootcamp-script-errors)
   - [YAML Parse Errors](#1-yaml-parse-errors)
   - [Missing Lab Files](#2-missing-lab-files)
   - [Progress File Corruption](#3-progress-file-corruption)
   - [Backup/Restore Failures](#4-backuprestore-failures)
   - [Invalid Lab IDs](#5-invalid-lab-ids)
3. [Multi-Agent Orchestration Errors](#multi-agent-orchestration-errors)
4. [Phase-Specific Recovery](#phase-specific-recovery)
5. [Escalation Procedures](#escalation-procedures)

---

## Quick Reference

### Bootcamp Script Errors

| Error Type | First Action | Recovery Time | Severity |
|------------|--------------|---------------|----------|
| YAML parse error | Validate YAML syntax | 5-10 min | HIGH |
| Missing lab file | Check steps directory | 5 min | MEDIUM |
| Progress file corrupt | Restore from backup | 10-15 min | HIGH |
| Backup failure | Check disk space/permissions | 10 min | MEDIUM |
| Invalid lab ID | Verify format | 2 min | LOW |
| Cohort not found | Create cohort directory | 5 min | MEDIUM |
| Student file missing | Re-initialize student | 5 min | MEDIUM |

### Orchestration Errors

| Error Type | First Action | Recovery Time | Severity |
|------------|--------------|---------------|----------|
| File conflict | Check ownership matrix | 5 min | MEDIUM |
| Signal missing | Create retroactively | 2 min | LOW |
| Package.json conflict | Use merge queue | 10 min | HIGH |
| Test failure | Review and fix | Varies | MEDIUM |
| Agent timeout | Check progress, restart | 15 min | HIGH |

---

## Bootcamp Script Errors

### 1. YAML Parse Errors

**Symptoms:**
- `YAMLParseError: ...` in console output
- `bootcamp.mjs list` fails silently or shows empty list
- Step data is missing or malformed
- `YAML.parse()` throws exception

**Error Messages:**
```
YAMLParseError: Implicit map keys need to be on a single line
YAMLParseError: Unexpected end of flow sequence
YAMLParseError: All mapping items must start at the same column
YAMLParseError: Block scalars must not be more indented than their parent
```

**Root Causes:**
1. **Indentation errors** - Mixed tabs/spaces or inconsistent indentation
2. **Missing colons** - Key without colon separator
3. **Unquoted special characters** - Values containing `:`, `#`, `[`, `{`, etc.
4. **Improper multiline strings** - Block scalar indicators (`|` or `>`) misused
5. **Invalid characters** - Non-printable or special Unicode characters

**Diagnosis:**
```powershell
# Identify the problematic file
Get-ChildItem -Path "bootcamp\steps" -Recurse -Filter "*.yaml" | ForEach-Object {
    try {
        $content = Get-Content $_.FullName -Raw
        # Basic syntax check
        if ($content -match "`t") {
            Write-Host "TAB found in: $($_.FullName)"
        }
    } catch {
        Write-Host "Error reading: $($_.FullName)"
    }
}

# Validate specific file with yaml package
node -e "const YAML = require('yaml'); const fs = require('fs'); console.log(YAML.parse(fs.readFileSync('bootcamp/steps/week-01/lab-01.yaml', 'utf-8')));"
```

**Recovery Steps:**
```powershell
# Step 1: Identify the file
node scripts/bootcamp.mjs list 2>&1 | Select-String -Pattern "Error|YAML"

# Step 2: Use online YAML validator
# Copy content to: https://www.yamllint.com/

# Step 3: Common fixes:

# Fix indentation (convert tabs to spaces)
(Get-Content "bootcamp/steps/week-01/lab-01.yaml" -Raw) -replace "`t", "    " | Set-Content "bootcamp/steps/week-01/lab-01.yaml"

# Fix unquoted special characters - wrap in quotes
# WRONG:  title: Lab: Setup
# RIGHT:  title: "Lab: Setup"

# Step 4: Verify fix
node scripts/bootcamp.mjs list
```

**Prevention Tips:**
- Use VS Code YAML extension (redhat.vscode-yaml)
- Enable "Editor: Detect Indentation" in VS Code
- Always use 2-space indentation
- Quote strings containing special characters
- Use multiline block scalars for long text

---

### 2. Missing Lab Files

**Symptoms:**
- `Step not found: <stepId>` error
- `bootcamp.mjs list` shows fewer steps than expected
- Lab content displays as empty

**Error Messages:**
```
Error: Step not found: week-01-lab-02
Error: Missing STEP_ID
Steps dir not found: /path/to/bootcamp/steps
```

**Root Causes:**
1. **File not created** - Lab YAML file doesn't exist
2. **Wrong directory** - File in incorrect location
3. **File extension** - Using `.yml` vs `.yaml` inconsistently
4. **Missing `id` field** - YAML file exists but lacks required `id` property

**Diagnosis:**
```powershell
# Check if steps directory exists
Test-Path "bootcamp\steps"

# List all step files
Get-ChildItem -Path "bootcamp\steps" -Recurse -Include "*.yaml","*.yml"

# Search for specific lab ID in files
Get-ChildItem -Path "bootcamp\steps" -Recurse -Include "*.yaml" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "id:\s*week-01-lab-02") {
        Write-Host "Found in: $($_.FullName)"
    }
}

# Check if file has id field
node -e "const YAML = require('yaml'); const fs = require('fs'); const step = YAML.parse(fs.readFileSync('bootcamp/steps/week-01/lab-02.yaml', 'utf-8')); console.log('ID:', step.id);"
```

**Recovery Steps:**
```powershell
# Step 1: Verify expected file location
# Lab files should be in: bootcamp/steps/<week|sprint>-XX/

# Step 2: Create missing file from template
node -e "
const fs = require('fs');
const template = \`id: week-01-lab-02
title: 'Lab 2: Scaffold Vertical Slice'
timebox: 45 min
objective: Build a minimal vertical slice

read:
  - docs/content/week-01/micro-labs/LAB_2_SCAFFOLD_VERTICAL_SLICE.md

definition_of_done:
  - Feature compiles
  - Basic happy path works

validate:
  - Build passes
  - Tests pass
\`;
fs.writeFileSync('bootcamp/steps/week-01/lab-02.yaml', template);
"

# Step 3: Verify fix
node scripts/bootcamp.mjs step week-01-lab-02
```

**Prevention Tips:**
- Always include `id` field matching expected format
- Use consistent file naming: `lab-XX.yaml`
- Check file exists before referencing in documentation

---

### 3. Progress File Corruption

**Symptoms:**
- Progress update commands fail silently or with cryptic errors
- Lab status not updating correctly
- Metadata fields showing "Unknown" or empty
- Markdown tables malformed

**Error Messages:**
```
Progress file not found for user: jsmith in cohort: 2026-01
Cannot read progress file: <error>
Progress file missing required fields: name, github, track
Failed to update progress: <error>
```

**Root Causes:**
1. **Manual editing damage** - User edited file incorrectly
2. **Partial write** - Script interrupted during file write
3. **Missing template fields** - Initialized without required metadata
4. **Table structure broken** - Missing pipe characters or wrong column count

**Diagnosis:**
```powershell
# Check file exists
Test-Path "progress\cohorts\2026-01\jsmith.md"

# Check file content structure
Get-Content "progress\cohorts\2026-01\jsmith.md" | Select-Object -First 30

# Validate with progress script
node progress/scripts/update-progress.mjs view --student "jsmith" --cohort "2026-01"

# Check for common issues
$content = Get-Content "progress\cohorts\2026-01\jsmith.md" -Raw
if ($content -match '\| - \|') { Write-Host "Placeholder dashes found - OK" }
if ($content -match 'Unknown') { Write-Host "WARNING: Unknown values detected" }
if ($content -notmatch '\*\*Name\*\*') { Write-Host "ERROR: Missing Name field" }
```

**Recovery Steps:**
```powershell
# Option A: Restore from backup (PREFERRED)
# Step 1: List available backups
node progress/scripts/backup-cohort.mjs list --cohort 2026-01

# Step 2: Restore from specific date
node progress/scripts/backup-cohort.mjs restore --cohort 2026-01 --date 2026-01-28

# Option B: Re-initialize student file
# Step 1: Backup current (corrupted) file
Copy-Item "progress\cohorts\2026-01\jsmith.md" "progress\cohorts\2026-01\jsmith.md.bak"

# Step 2: Re-initialize
npm run progress:init -- --name "Jane Smith" --github "jsmith" --cohort "2026-01" --track "backend" --force

# Step 3: Manually transfer completed labs from backup if needed

# Option C: Manual repair (for minor issues)
# Fix table structure - ensure 7 columns per row
# | Lab Name | Status | Started | Completed | Duration | PR | Facilitator |
```

**Prevention Tips:**
- Run `npm run progress:backup -- --cohort <id>` before bulk operations
- Avoid manual edits to progress files
- Use provided scripts for all status updates
- Enable backup automation (daily/weekly)

---

### 4. Backup/Restore Failures

**Symptoms:**
- `backup-cohort.mjs` commands fail
- Backup files not created or incomplete
- Restore operation doesn't complete
- `tar` command errors

**Error Messages:**
```
❌ Error: Cohort directory not found: <path>
❌ Error: No progress files found for cohort: <cohort>
❌ Error: Failed to create backup: <error>
❌ Error: No backup found for date: <date>
❌ Error: Failed to restore backup: <error>
```

**Root Causes:**
1. **Disk space** - Insufficient disk space for backup
2. **Permissions** - Cannot write to backup directory
3. **Missing tar** - `tar` command not available (rare on modern systems)
4. **Path issues** - Spaces or special characters in paths
5. **No files to backup** - Cohort directory empty

**Diagnosis:**
```powershell
# Check disk space
Get-PSDrive -PSProvider FileSystem

# Check cohort directory exists and has files
Get-ChildItem "progress\cohorts\2026-01"

# Check backup directory permissions
Test-Path "progress\backups" -PathType Container

# Test tar command
tar --version

# Check for existing backups
Get-ChildItem "progress\backups\2026-01" -ErrorAction SilentlyContinue
```

**Recovery Steps:**
```powershell
# For: "Cohort directory not found"
# Create the cohort directory first
New-Item -Path "progress\cohorts\2026-01" -ItemType Directory -Force

# For: "No progress files found"
# Initialize at least one student
npm run progress:init -- --name "Test User" --github "testuser" --cohort "2026-01" --track "backend"

# For: "Failed to create backup" (disk space)
# Clear old backups
Get-ChildItem "progress\backups\2026-01" -Filter "*.tar.gz" | Sort-Object CreationTime | Select-Object -SkipLast 3 | Remove-Item

# For: "No backup found for date"
# List available backups
node progress/scripts/backup-cohort.mjs list --cohort 2026-01
# Use an available date

# For: tar failures on Windows
# Ensure tar is in PATH or use full path
# Alternative: Use PowerShell Compress-Archive
Compress-Archive -Path "progress\cohorts\2026-01\*" -DestinationPath "progress\backups\2026-01\manual_backup.zip"
```

**Prevention Tips:**
- Schedule regular backups with task scheduler
- Monitor disk space usage
- Keep MAX_BACKUPS setting reasonable (default: 10)
- Test restore procedure periodically

---

### 5. Invalid Lab IDs

**Symptoms:**
- `Lab ID is required` error
- `Lab ID must be in format...` error
- Progress not updating for specific lab
- Steps not found despite YAML file existing

**Error Messages:**
```
Lab ID is required
Lab ID must be in format: week-XX-lab-XX (e.g., week-01-lab-02) or sprint-XX-step-XX (e.g., sprint-01-step-01)
Step not found: <invalid-id>
```

**Valid Formats:**
```
Week labs:    week-01-lab-00 through week-04-lab-06
Sprint steps: sprint-01-step-01 through sprint-04-step-09
```

**Root Causes:**
1. **Typos** - Common mistakes like `week-1-lab-2` instead of `week-01-lab-02`
2. **Wrong separator** - Using underscores or spaces instead of hyphens
3. **Out of range** - Week 5 or Lab 7 (don't exist)
4. **Case sensitivity** - Using `Week-01` instead of `week-01`
5. **Extra characters** - Trailing spaces or newlines

**Diagnosis:**
```powershell
# Test lab ID validation
node -e "
const { validateLabId } = require('./scripts/lib/validators.mjs');
const result = validateLabId('week-01-lab-02');
console.log(result);
"

# List all valid lab IDs
node scripts/bootcamp.mjs list
```

**Recovery Steps:**
```powershell
# Step 1: Check the exact format required
# Week labs: week-0[1-4]-lab-0[0-6]
# Sprint steps: sprint-0[1-4]-step-0[1-9]

# Step 2: Fix common typos
# WRONG: week-1-lab-2     → RIGHT: week-01-lab-02
# WRONG: week_01_lab_02   → RIGHT: week-01-lab-02
# WRONG: Week-01-Lab-02   → RIGHT: week-01-lab-02
# WRONG: week-01-lab-7    → RIGHT: week-01-lab-06 (max is 6)
# WRONG: week-05-lab-01   → RIGHT: week-04-lab-01 (max week is 4)

# Step 3: Verify with validation script
node -e "
const { validateLabId, getLabDisplayName } = require('./scripts/lib/validators.mjs');
const labId = 'week-01-lab-02';
const result = validateLabId(labId);
if (result.valid) {
    console.log('✅ Valid:', labId);
    console.log('   Display name:', getLabDisplayName(labId));
    console.log('   Type:', result.type);
} else {
    console.log('❌ Invalid:', result.error);
}
"

# Step 4: Use correct ID in commands
npm run progress:start -- --student "jsmith" --cohort "2026-01" week-01-lab-02
```

**Quick Reference - All Valid Lab IDs:**
```
Week 1: week-01-lab-00, week-01-lab-01, week-01-lab-02, week-01-lab-03, week-01-lab-04, week-01-lab-05, week-01-lab-06
Week 2: week-02-lab-00, week-02-lab-01, week-02-lab-02, week-02-lab-03, week-02-lab-04, week-02-lab-05, week-02-lab-06
Week 3: week-03-lab-00, week-03-lab-01, week-03-lab-02, week-03-lab-03, week-03-lab-04, week-03-lab-05, week-03-lab-06
Week 4: week-04-lab-00, week-04-lab-01, week-04-lab-02, week-04-lab-03, week-04-lab-04, week-04-lab-05, week-04-lab-06

Sprint 1: sprint-01-step-01 through sprint-01-step-09
Sprint 2: sprint-02-step-01 through sprint-02-step-09
Sprint 3: sprint-03-step-01 through sprint-03-step-09
Sprint 4: sprint-04-step-01 through sprint-04-step-09
```

**Prevention Tips:**
- Copy/paste lab IDs from documentation
- Use tab completion if available
- Validate inputs before processing
- Refer to `bootcamp.mjs list` for valid IDs

---

### 6. Cohort/Student Not Found

**Symptoms:**
- Progress commands fail with "not found" errors
- `validateCohortExists` returns invalid
- Student operations fail

**Error Messages:**
```
Cohort is required (--cohort)
Cohort must be in YYYY-MM format (e.g., 2026-01)
Cohort directory not found: 2026-01
Progress file not found for user: jsmith in cohort: 2026-01
```

**Root Causes:**
1. **Cohort format** - Not using YYYY-MM format
2. **Cohort not created** - Directory doesn't exist
3. **Student not initialized** - Progress file not created
4. **Typo in cohort/username** - Slight misspelling

**Diagnosis:**
```powershell
# List existing cohorts
Get-ChildItem "progress\cohorts"

# List students in cohort
Get-ChildItem "progress\cohorts\2026-01"

# Check exact filename
Get-ChildItem "progress\cohorts\2026-01" -Filter "*smith*"
```

**Recovery Steps:**
```powershell
# For: Cohort not found
# Create cohort directory
New-Item -Path "progress\cohorts\2026-01" -ItemType Directory -Force

# For: Student not initialized
npm run progress:init -- --name "Jane Smith" --github "jsmith" --cohort "2026-01" --track "backend"

# For: Wrong cohort format
# Use correct format: YYYY-MM
# WRONG: 2026-1    → RIGHT: 2026-01
# WRONG: 202601    → RIGHT: 2026-01
# WRONG: Jan-2026  → RIGHT: 2026-01
```

**Prevention Tips:**
- Initialize cohorts at program start
- Use consistent naming conventions
- Verify cohort exists before adding students

---

## Multi-Agent Orchestration Errors

---

## Multi-Agent Orchestration Errors

### 7. File Already Exists (When Agent Expects to Create)

**Symptoms:**
- Agent reports "file already exists"
- Agent refuses to proceed

**Diagnosis:**
```bash
# Check if file exists
ls <target_file>

# Check file content/version
head -20 <target_file>

# Check git history
git log --oneline -5 <target_file>
```

**Decision Tree:**
1. **File is from previous enhance cycle:** Update instead of create
2. **File is from concurrent agent:** Check ownership matrix
3. **File is expected prior work:** Verify content, then update

**Recovery:**
```bash
# Option A: Agent updates existing file
# Modify agent task from "create" to "update"

# Option B: Remove and recreate
rm <target_file>
# Re-run agent

# Option C: Manual merge
# Copy agent output, manually integrate
```

---

### 8. Signal File Missing

**Symptoms:**
- Phase gate check fails
- `validate-signals.mjs` reports missing signal

**Diagnosis:**
```bash
# List existing signals
ls enhance-05/WORK_PRODUCTS/SIGNALS/

# Check work log exists (agent may have completed)
ls enhance-05/WORK_PRODUCTS/*_WORKLOG.md
```

**Recovery:**
```bash
# If agent completed but forgot signal:
node enhance-05/SCAFFOLDS/create-signal.mjs Exx SUCCESS "Retroactive - agent completed but missed signal"

# If agent didn't complete:
# Re-run agent or complete manually
```

---

### 9. Package.json Merge Conflict

**Symptoms:**
- Multiple agents modified package.json
- npm install fails
- Git shows merge conflict

**Diagnosis:**
```bash
# Check for conflicts
git diff package.json

# Check change queue
ls enhance-05/PACKAGE_CHANGES/
```

**Recovery:**
```bash
# Reset package.json to clean state
git checkout HEAD -- package.json

# Manually merge all change requests
cat enhance-05/PACKAGE_CHANGES/*.json

# Apply changes carefully, then:
npm install
npm run bootcamp:list  # Verify
```

---

### 10. Test Failures

**Symptoms:**
- Verification commands fail
- Phase gate check fails

**Diagnosis:**
```bash
# Run specific failing test
<failing_command>

# Check error output carefully
```

**Decision Tree:**
1. **Test environment issue:** Fix environment, retry
2. **Code bug:** Fix code, update work log
3. **Test assumption wrong:** Update test expectation
4. **Dependent system failure:** Wait/retry later

**Recovery:**
```bash
# Option A: Fix and re-verify
# Make fix, run verification again

# Option B: Document as known issue
# Add to work log, create follow-up task

# Option C: Skip non-blocking failure
# Document why it's acceptable to proceed
```

---

### 11. Agent Timeout / No Response

**Symptoms:**
- Agent stops responding
- No output for extended period
- Session disconnects

**Diagnosis:**
```bash
# Check last output
# Review chat history

# Check for partial work
ls enhance-05/WORK_PRODUCTS/
git status
```

**Recovery:**
```bash
# Option A: Resume from checkpoint
# Feed agent its work log and ask to continue

# Option B: Start fresh
# Clear partial changes, restart agent

# Option C: Manual completion
# Complete remaining tasks manually
```

---

## Phase-Specific Recovery

### Phase 1 (Foundation) Failures

- E12 failure blocks all subsequent phases
- Recovery priority: HIGH
- Fallback: Manual integration of runner flags

### Phase 2 (Data Safety) Failures

- E13/E14 can fail independently
- Recovery: Fix one, continue with other
- Fallback: Skip backup feature, fix alerts only

### Phase 3 (Content) Failures

- E15 is large scope, may need splitting
- Recovery: Complete per-week, save progress
- Fallback: Do Week 2 only, defer 3-4

### Phase 4 (Tooling) Failures

- E16/E17/E18 independent
- Recovery: Fix individually
- Fallback: Any can be deferred

### Phase 5 (Extended) Failures

- All agents independent
- Recovery: Fix individually
- Fallback: Any can be deferred to enhance-06

### Phase 6 (Validation) Failures

- E08v2 is read-only, low risk
- Recovery: Fix reported issues
- Fallback: Manual verification

---

## Escalation Procedures

### When to Escalate to Coordinator

1. File ownership conflict between agents
2. Package.json needs manual merge
3. Blocked by prior phase failure
4. Uncertain about recovery approach

### Information to Provide

```markdown
**Agent:** Exx
**Phase:** #
**Issue:** Brief description
**Diagnosis Done:** What you checked
**Proposed Recovery:** Your recommendation
**Blockers:** What's preventing recovery
```

---

## Post-Recovery Checklist

After any recovery:

- [ ] Update agent work log with recovery notes
- [ ] Create signal file (if missing)
- [ ] Run phase verification
- [ ] Document lessons learned in enhance-05-extra.md
- [ ] Notify coordinator of resolution
