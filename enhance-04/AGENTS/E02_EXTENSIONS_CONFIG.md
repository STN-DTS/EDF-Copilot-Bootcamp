# E02_EXTENSIONS_CONFIG — VS Code Extensions Recommendations

## Mission
Add VS Code extension recommendations to the main `.vscode/` folder so participants get prompted to install helpful extensions when opening the repo.

---

## File ownership (absolute)

**Owned paths:**
- `.vscode/extensions.json` (create new)

**Must NOT edit:**
- `.vscode/tasks.json`
- `.vscode/settings.json`
- Any other files

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **Source exists:**
   ```
   bootcamp_scaffolds_weeks1-4_sprints1-4/.vscode/extensions.json
   ```

2. **Destination does NOT exist:**
   - `.vscode/extensions.json` at repo root

3. **`.vscode/` folder exists** (should already exist with `tasks.json` and possibly `settings.json`)

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create extensions.json
Create `.vscode/extensions.json` with recommended extensions for bootcamp participants:

```json
{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat",
    "yzhang.markdown-all-in-one",
    "davidanson.vscode-markdownlint",
    "bierner.markdown-preview-github-styles",
    "streetsidesoftware.code-spell-checker"
  ],
  "unwantedRecommendations": []
}
```

### Task 2: Verify VS Code recognizes recommendations
Open VS Code and check Extensions panel shows recommendations.

---

## Output contract (mandatory)

Return:
1. **Plan** (brief, 3-5 bullets)
2. **Patch** (unified diff for file created)
3. **Verification commands** (how to verify in VS Code)
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E02_EXTENSIONS_CONFIG_WORKLOG.md`

---

## Success criteria
- [ ] `.vscode/extensions.json` exists
- [ ] Contains GitHub Copilot and Copilot Chat extensions
- [ ] Contains markdown helper extensions
- [ ] VS Code shows extension recommendations on folder open

---

## Extension descriptions (for reference)

| Extension ID | Purpose |
|-------------|---------|
| `github.copilot` | AI code completion |
| `github.copilot-chat` | AI chat interface |
| `yzhang.markdown-all-in-one` | Markdown shortcuts, TOC, preview |
| `davidanson.vscode-markdownlint` | Markdown linting |
| `bierner.markdown-preview-github-styles` | GitHub-style markdown preview |
| `streetsidesoftware.code-spell-checker` | Spell checking in docs |
