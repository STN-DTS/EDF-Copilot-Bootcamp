# E20_ERROR_RECOVERY_PLAYBOOK — Agent Error Recovery Documentation

## Mission
Create comprehensive error recovery documentation for multi-agent orchestration.

**Spawned via:** `runSubagent` tool  
**Phase:** 5 (Extended Tooling) — Can run concurrently with E19, E21, E22  
**Dependencies:** enhance-04 patterns and lessons learned

---

## File ownership (absolute)

**Owned paths:**
- `enhance-05/PLAYBOOKS/ERROR_RECOVERY.md` (create new)
- `enhance-05/PLAYBOOKS/COMMON_FAILURES.md` (create new)
- `enhance-05/PLAYBOOKS/README.md` (create new)

**Must NOT edit:**
- Any production files
- Agent instruction files

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **PLAYBOOKS folder exists or create it:**
   ```bash
   ls enhance-05/PLAYBOOKS/ || mkdir -p enhance-05/PLAYBOOKS
   ```

2. **Review enhance-04-extra.md for lessons learned:**
   ```bash
   grep -A 10 "Anti-Patterns" enhance-04-extra.md
   ```

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create enhance-05/PLAYBOOKS/README.md

```markdown
# enhance-05 Playbooks

Reference documentation for handling common scenarios during multi-agent orchestration.

## Available Playbooks

| Playbook | Description |
|----------|-------------|
| [ERROR_RECOVERY.md](ERROR_RECOVERY.md) | How to recover from agent failures |
| [COMMON_FAILURES.md](COMMON_FAILURES.md) | Catalog of common failures and solutions |

## When to Use

- **Before starting a phase:** Review potential issues
- **During agent execution:** Reference if problems occur
- **After phase completion:** Document new patterns learned
```

### Task 2: Create enhance-05/PLAYBOOKS/ERROR_RECOVERY.md

```markdown
# Error Recovery Playbook

Standard procedures for recovering from errors during multi-agent orchestration.

---

## Quick Reference

| Error Type | First Action | Recovery Time |
|------------|--------------|---------------|
| File conflict | Check ownership matrix | 5 min |
| Signal missing | Create retroactively | 2 min |
| Package.json conflict | Use merge queue | 10 min |
| Test failure | Review and fix | Varies |
| Agent timeout | Check progress, restart | 15 min |

---

## Standard Recovery Procedures

### 1. File Already Exists (When Agent Expects to Create)

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

### 2. Signal File Missing

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

### 3. Package.json Merge Conflict

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

### 4. Test Failures

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

### 5. Agent Timeout / No Response

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
```

### Task 3: Create enhance-05/PLAYBOOKS/COMMON_FAILURES.md

```markdown
# Common Failures Catalog

Reference of frequently encountered failures and their solutions.

---

## File System Failures

### F001: Permission Denied

**Error:** `EACCES: permission denied`

**Cause:** File or folder lacks write permissions

**Solution:**
```bash
# Check permissions
ls -la <path>

# On Unix/Mac:
chmod +w <path>

# On Windows: Check file is not read-only
attrib -R <path>
```

---

### F002: Path Too Long (Windows)

**Error:** `ENAMETOOLONG` or file not found with valid path

**Cause:** Windows has 260 character path limit by default

**Solution:**
```bash
# Use shorter paths
# Or enable long paths in Windows settings
```

---

### F003: File Locked

**Error:** `EBUSY: resource busy or locked`

**Cause:** Another process has file open

**Solution:**
```bash
# Close VS Code or other editors
# Check for running processes
# Wait and retry
```

---

## npm Failures

### F010: Module Not Found

**Error:** `Cannot find module 'xxx'`

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
```

---

### F011: Version Conflict

**Error:** `ERESOLVE unable to resolve dependency tree`

**Cause:** Incompatible package versions

**Solution:**
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or update package.json versions
```

---

### F012: Script Not Found

**Error:** `npm ERR! missing script: xxx`

**Cause:** Script not defined in package.json

**Solution:**
```bash
# Check package.json scripts section
cat package.json | grep -A 20 '"scripts"'

# Add missing script
```

---

## Git Failures

### F020: Merge Conflict

**Error:** `CONFLICT (content): Merge conflict in xxx`

**Cause:** Multiple agents edited same file

**Solution:**
```bash
# View conflict
git diff <file>

# Resolve manually, then:
git add <file>
git commit -m "Resolve merge conflict in <file>"
```

---

### F021: Uncommitted Changes

**Error:** `error: Your local changes would be overwritten`

**Cause:** Trying to switch branches with uncommitted work

**Solution:**
```bash
# Option A: Commit changes
git add . && git commit -m "WIP"

# Option B: Stash changes
git stash

# Option C: Discard changes
git checkout -- .
```

---

## Agent Failures

### F030: Agent Didn't Understand Task

**Symptoms:** Agent did wrong thing or nothing

**Solution:**
- Re-read agent instructions
- Provide clarification
- Break task into smaller steps

---

### F031: Agent Edited Wrong File

**Symptoms:** File outside ownership scope was modified

**Solution:**
```bash
# Revert the file
git checkout HEAD -- <wrong_file>

# Re-run agent with clearer instructions
```

---

### F032: Agent Created Malformed Output

**Symptoms:** Syntax errors, incomplete code

**Solution:**
- Review output manually
- Fix syntax errors
- Ask agent to regenerate specific section

---

## Validation Failures

### F040: Link Check Fails

**Error:** `Found X broken links`

**Solution:**
```bash
# Review specific broken links
npm run check:links 2>&1 | grep -A 2 "FILE:"

# Fix links or update .linkcheck-ignore
```

---

### F041: Test Assertions Fail

**Error:** Test output shows failures

**Solution:**
- Read assertion error carefully
- Check if expectation is correct
- Fix code or update test

---

## Quick Lookup Table

| Error Code | Category | Quick Fix |
|------------|----------|-----------|
| EACCES | Permission | chmod / attrib |
| ENOENT | Missing | Create file/folder |
| EEXIST | Exists | Delete or update |
| EBUSY | Locked | Close other apps |
| ERESOLVE | npm | --legacy-peer-deps |
| CONFLICT | Git | Manual merge |
```

---

## Output contract (mandatory)

Return:
1. **Recon findings**
2. **Plan** (brief, 5-10 bullets)
3. **Patch** (file contents for each file created)
4. **Work log file** at: `enhance-05/WORK_PRODUCTS/E20_ERROR_RECOVERY_PLAYBOOK_WORKLOG.md`
5. **Signal file** at: `enhance-05/WORK_PRODUCTS/SIGNALS/E20_COMPLETE.signal`

---

## Insight Capture

Note any discoveries for `enhance-05-extra.md`:
- Additional failure patterns to document
- Recovery procedures that could be automated
- Missing documentation needs

---

## Success Criteria

- [ ] README.md created
- [ ] ERROR_RECOVERY.md is comprehensive
- [ ] COMMON_FAILURES.md covers key scenarios
- [ ] Decision trees are clear
- [ ] Recovery steps are actionable
- [ ] Work log created
- [ ] Signal file created
