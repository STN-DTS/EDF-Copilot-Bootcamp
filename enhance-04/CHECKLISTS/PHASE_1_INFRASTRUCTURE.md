# Phase 1 Checklist — Infrastructure

## Agents in this phase
- E01_RUNNER_INTEGRATE
- E02_EXTENSIONS_CONFIG

**Execution:** Run CONCURRENTLY

---

## Pre-merge verification

### E01_RUNNER_INTEGRATE
- [ ] Work log exists: `enhance-04/WORK_PRODUCTS/E01_RUNNER_INTEGRATE_WORKLOG.md`
- [ ] `bootcamp/` folder exists at repo root
- [ ] `bootcamp/steps/index.yaml` exists
- [ ] `bootcamp/steps/week-01/` has 7 YAML files (lab-00 through lab-06)
- [ ] `bootcamp/steps/week-02/`, `week-03/`, `week-04/` exist with content
- [ ] `bootcamp/steps/sprint-01/` through `sprint-04/` exist with content
- [ ] `scripts/bootcamp.mjs` exists
- [ ] `package.json` has bootcamp scripts

### E02_EXTENSIONS_CONFIG
- [ ] Work log exists: `enhance-04/WORK_PRODUCTS/E02_EXTENSIONS_CONFIG_WORKLOG.md`
- [ ] `.vscode/extensions.json` exists
- [ ] Contains `github.copilot` recommendation
- [ ] Contains `github.copilot-chat` recommendation

---

## Gate verification commands

```bash
# Install dependencies
npm install

# Verify runner works
npm run bootcamp:list
# Expected: List of step IDs printed

npm run bootcamp -- step week-01-lab-00
# Expected: Step details printed

npm run bootcamp -- step sprint-01-step-00
# Expected: Step details printed
```

---

## Merge order
1. E01 first (creates `package.json` base)
2. E02 second (no conflicts expected)

---

## Phase 1 complete when
- [ ] All checklist items above verified
- [ ] All verification commands pass
- [ ] Both work logs present
- [ ] No merge conflicts

**Next:** Proceed to Phase 2
