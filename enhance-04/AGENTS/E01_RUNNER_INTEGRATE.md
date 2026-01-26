# E01_RUNNER_INTEGRATE — Bootcamp Runner + YAML Steps Integration

## Mission
Integrate the bootcamp runner infrastructure into the main repo root.

This enables participants to run `npm run bootcamp:list` and `npm run bootcamp -- step week-01-lab-00` to get guided instructions.

**Source Reference:** `enhance-04/SCAFFOLDS/` contains the runner script and templates.

---

## File ownership (absolute)

**Owned paths:**
- `bootcamp/` (entire new folder at repo root)
- `bootcamp/steps/` (all YAML files)
- `scripts/bootcamp.mjs`
- `package.json` (create or merge bootcamp scripts)

**Must NOT edit:**
- `.vscode/tasks.json` (Coordinator owns — request updates if needed)
- Any `docs/**` files
- `.START_HERE.md`
- Any other existing files

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Source reference exists:**
   ```
   enhance-04/SCAFFOLDS/
   ├── README.md
   ├── bootcamp.mjs          ← Copy to scripts/bootcamp.mjs
   ├── package-scripts.json  ← Merge into root package.json
   └── step-templates/       ← Reference for YAML format
   ```

2. **Destination does NOT exist:**
   - `bootcamp/` folder at repo root
   - `scripts/bootcamp.mjs` at repo root

3. **Read `enhance-04/SCAFFOLDS/package-scripts.json`** to understand dependencies (expect `yaml` package)

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create bootcamp folder structure
Create `bootcamp/steps/` at repo root with week and sprint subfolders.

### Task 2: Copy runner script
Copy `bootcamp_scaffolds_weeks1-4_sprints1-4/scripts/bootcamp.mjs` to `scripts/bootcamp.mjs` at repo root.

Create `scripts/` folder if it doesn't exist.

### Task 3: Create/update package.json
If `package.json` exists at repo root, merge these scripts and dependencies.
If not, create it.

**Required content:**
```json
{
  "name": "edf-copilot-bootcamp",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "bootcamp:list": "node scripts/bootcamp.mjs list",
    "bootcamp": "node scripts/bootcamp.mjs",
    "check:links": "npx markdown-link-check **/*.md --config .github/markdown-link-check-config.json"
  },
  "devDependencies": {
    "yaml": "^2.3.0",
    "markdown-link-check": "^3.11.0"
  }
}
```

### Task 4: Verify runner works
Run these commands and capture output:
```bash
npm install
npm run bootcamp:list
npm run bootcamp -- step week-01-lab-00
```

---

## Output contract (mandatory)

Return:
1. **Plan** (brief, 5-10 bullets)
2. **Patch** (unified diff for each file created/modified)
3. **Verification commands** and their expected output
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E01_RUNNER_INTEGRATE_WORKLOG.md`

---

## Success criteria
- [ ] `bootcamp/steps/` exists at repo root with all YAML files
- [ ] `scripts/bootcamp.mjs` exists and is executable
- [ ] `package.json` has bootcamp scripts
- [ ] `npm run bootcamp:list` prints step IDs
- [ ] `npm run bootcamp -- step week-01-lab-00` prints step details

---

## Post-Verification Cleanup (IMPORTANT)

After Phase 1 gate passes and all verification succeeds:

1. **Delete the scaffold source folder:**
   ```bash
   rm -rf bootcamp_scaffolds_weeks1-4_sprints1-4/
   ```

2. **Commit the cleanup:**
   ```bash
   git add -A
   git commit -m "chore: remove scaffold folder after integration"
   ```

3. **Add to work log:**
   ```markdown
   ## Cleanup Completed
   - [x] Scaffold folder deleted after successful integration
   - [x] All 38 YAML files now in bootcamp/steps/
   - [x] bootcamp.mjs integrated to scripts/
   ```

**Why:** The scaffold folder was a temporary source. Keeping it causes confusion about which files are authoritative.

---

## Notes/Risks
- If repo already has `package.json`, merge carefully (don't overwrite existing scripts)
- Runner depends on `yaml` npm package
- Cross-platform: script should work on Windows, macOS, Linux
