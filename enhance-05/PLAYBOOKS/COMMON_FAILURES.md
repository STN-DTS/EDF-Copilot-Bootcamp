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

### F004: File Not Found

**Error:** `ENOENT: no such file or directory`

**Cause:** File doesn't exist at specified path

**Solution:**
```bash
# Check path is correct
ls -la <path>

# Check for typos in filename
# Check working directory
pwd
```

---

### F005: File Already Exists

**Error:** `EEXIST: file already exists`

**Cause:** Attempting to create file that exists

**Solution:**
```bash
# Decision: update or overwrite
# Update: modify agent task
# Overwrite: rm <path> first
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

### F013: Package Lock Conflict

**Error:** `npm ERR! package-lock.json modified`

**Cause:** Lock file out of sync

**Solution:**
```bash
rm package-lock.json
npm install
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

### F022: Detached HEAD

**Error:** `You are in 'detached HEAD' state`

**Cause:** Checked out a commit instead of branch

**Solution:**
```bash
# Return to branch
git checkout main

# Or create branch from current state
git checkout -b new-branch-name
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

### F033: Agent Skipped Recon

**Symptoms:** Agent made changes without understanding context

**Solution:**
- Roll back changes
- Re-run agent with explicit recon step
- Verify recon findings before allowing edits

---

### F034: Agent Forgot Signal

**Symptoms:** Work done but no signal file

**Solution:**
```bash
# Create signal retroactively
node enhance-05/SCAFFOLDS/create-signal.mjs Exx SUCCESS "Retroactive"
```

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

### F042: Timeout During Test

**Error:** `Test timed out`

**Solution:**
```bash
# Increase timeout if test is slow
# Or optimize test
# Or check for infinite loop
```

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

---

## Adding New Failures

When you encounter a new failure pattern:

1. Document the error message
2. Identify the root cause
3. Document the solution
4. Add to this catalog
5. Note in enhance-05-extra.md for future reference
