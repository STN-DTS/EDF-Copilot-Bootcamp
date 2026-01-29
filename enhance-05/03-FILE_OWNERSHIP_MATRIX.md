# 03-FILE_OWNERSHIP_MATRIX.md — Strict Boundaries (Minimize Merge Conflicts)

## Coordinator-only (global)
- `.vscode/tasks.json` (final canonical — may need updates)
- Root-level navigation/index docs unless assigned
- Cross-scope conflict resolution
- Final merge commits
- `enhance-05/SCAFFOLDS/` (reference for agents)
- `enhance-05/PLAYBOOKS/` (reference for agents)
- `enhance-05/PACKAGE_CHANGES/` (merge queue)
- `enhance-05-extra.md` (insight capture)

---

## Agent scopes

### E12_RUNNER_PROGRESS
**Owns:**
- `scripts/bootcamp.mjs` — Add integration flags

**Creates (in queue):**
- `enhance-05/PACKAGE_CHANGES/E12.json` — Any new scripts

**Must NOT edit:**
- `progress/scripts/*` (E17 and E21 own those)
- `package.json` directly (use change queue)
- Any `docs/**` files

---

### E13_BACKUP_RESTORE
**Owns:**
- `progress/scripts/backup-cohort.mjs` (create new)
- `progress/backups/.gitkeep` (create folder)
- `progress/backups/README.md` (create new)

**Creates (in queue):**
- `enhance-05/PACKAGE_CHANGES/E13.json` — Backup/restore scripts

**Must NOT edit:**
- `progress/cohorts/**` (student data)
- `progress/scripts/init-student.mjs`
- `progress/scripts/update-progress.mjs`

---

### E14_EXTENDED_ALERTS
**Owns:**
- `progress/scripts/check-alerts.mjs` — Expand thresholds
- `progress/config/alert-thresholds.json` (create new)
- `progress/config/README.md` (create new)

**Must NOT edit:**
- `progress/scripts/init-student.mjs`
- `progress/scripts/update-progress.mjs`
- `progress/cohorts/**`

---

### E15_WEEK2-4_TIEBACKS
**Owns:**
- `docs/content/week-02/micro-labs/*.md` (all lab files)
- `docs/content/week-03/micro-labs/*.md` (all lab files)
- `docs/content/week-04/micro-labs/*.md` (all lab files)

**Scope:** Add tie-back/tie-forward sections ONLY

**Must NOT edit:**
- `docs/content/week-01/**` (already done in enhance-04)
- Sprint docs
- Any scripts

---

### E16_SIGNAL_AUTOMATION
**Owns:**
- `enhance-05/SCAFFOLDS/create-signal.mjs` (create new)
- `enhance-05/SCAFFOLDS/validate-signals.mjs` (create new)
- `enhance-05/SCAFFOLDS/README.md` (update)

**Must NOT edit:**
- Any production files
- Agent instruction files

---

### E17_TECH_DEBT_CLEANUP
**Owns:**
- `progress/scripts/update-progress.mjs` — Lab ID mappings section only
- `progress/scripts/migrate-progress.mjs` (create new)
- `progress/config/cohort-settings.json` (create new)

**Coordination:** E14 also touches `progress/config/`. E17 creates different files.

**Must NOT edit:**
- `progress/scripts/check-alerts.mjs` (E14 owns)
- `progress/scripts/init-student.mjs`
- `scripts/bootcamp.mjs` (E12 owns)

---

### E18_PATH_NORMALIZATION
**Owns:**
- `scripts/utils/path-utils.mjs` (create new)
- `scripts/bootcamp.mjs` — Add import for path utils (coordinate with E12)
- `progress/scripts/*.mjs` — Add import for path utils where needed

**Coordination:** E12 also modifies `scripts/bootcamp.mjs`. E18 only adds import and changes output formatting.

**Must NOT edit:**
- Core logic in any scripts
- Test files
- Documentation

---

### E19_VALIDATION_CONSOLIDATION
**Owns:**
- `scripts/validate-all.mjs` (create new)

**Creates (in queue):**
- `enhance-05/PACKAGE_CHANGES/E19.json` — validate:all script

**Must NOT edit:**
- Individual validation scripts
- Production code

---

### E20_ERROR_RECOVERY_PLAYBOOK
**Owns:**
- `enhance-05/PLAYBOOKS/ERROR_RECOVERY.md` (create new)
- `enhance-05/PLAYBOOKS/COMMON_FAILURES.md` (create new)
- `enhance-05/PLAYBOOKS/README.md` (create new)

**Must NOT edit:**
- Any production files
- Agent instruction files

---

### E21_LAB_ID_AUTODISCOVERY
**Owns:**
- `progress/scripts/lab-utils.mjs` (create new)
- `progress/scripts/update-progress.mjs` — Replace hardcoded labNames

**Coordination:** E17 also modifies `update-progress.mjs`. Coordinate edits:
- E17: Lab ID validation and cohort format sections
- E21: Lab display name resolution section

**Must NOT edit:**
- `scripts/bootcamp.mjs`
- `bootcamp/steps/*.yaml` (only reads)

---

### E22_DRY_RUN_MODE
**Owns:**
- All `progress/scripts/*.mjs` — Add --dry-run flag handling
- `scripts/bootcamp.mjs` — Add --dry-run flag handling (coordinate with E12, E18)

**Coordination:** Multiple agents touch these files. E22 only adds dry-run logic at top of main functions.

**Pattern:**
```javascript
// Add at top of modification functions
if (args.includes('--dry-run')) {
  console.log('🔍 DRY RUN - No changes will be made');
  // ... preview changes
  process.exit(0);
}
```

**Must NOT edit:**
- Core logic
- Validation logic
- Output formatting (E18 handles)

---

### E08v2_QA_VALIDATION
**Owns:**
- `enhance-05/WORK_PRODUCTS/E08v2_QA_VALIDATION_WORKLOG.md` (create new)

**Read-only access to all files** — validation only, no edits

---

## Conflict Resolution Matrix

When multiple agents need same file:

| File | Primary Owner | Secondary Owners | Resolution |
|------|---------------|------------------|------------|
| `scripts/bootcamp.mjs` | E12 | E18, E22 | E12 first, then E18 imports, then E22 dry-run |
| `progress/scripts/update-progress.mjs` | E21 | E17, E22 | E17 first (validation), E21 second (lab names), E22 last (dry-run) |
| `progress/scripts/check-alerts.mjs` | E14 | E22 | E14 first, E22 adds dry-run |
| `progress/config/` | E14 | E17 | Different files, no conflict |

---

## Phase-Ordered Edits

To minimize conflicts, agents edit in phase order:

```
Phase 1: E12 → scripts/bootcamp.mjs (integration flags)
Phase 2: E13, E14 → progress/ (backup, alerts)
Phase 3: E15 → docs/content/week-02-04/ (content only)
Phase 4: E16 → enhance-05/SCAFFOLDS/ (new files)
         E17 → progress/scripts/ (validation fixes)
         E18 → scripts/utils/ (new file) + imports
Phase 5: E19 → scripts/validate-all.mjs (new file)
         E20 → enhance-05/PLAYBOOKS/ (new files)
         E21 → progress/scripts/update-progress.mjs (lab names)
         E22 → all scripts (dry-run flag - LAST)
Phase 6: E08v2 → read-only validation
```

---

## Signal Files

Each agent MUST create a signal file upon completion:

```
enhance-05/WORK_PRODUCTS/SIGNALS/
├── E12_COMPLETE.signal
├── E13_COMPLETE.signal
├── E14_COMPLETE.signal
├── E15_COMPLETE.signal
├── E16_COMPLETE.signal
├── E17_COMPLETE.signal
├── E18_COMPLETE.signal
├── E19_COMPLETE.signal
├── E20_COMPLETE.signal
├── E21_COMPLETE.signal
├── E22_COMPLETE.signal
└── E08v2_COMPLETE.signal
```

Use helper: `node enhance-05/SCAFFOLDS/create-signal.mjs Exx STATUS "notes"`
