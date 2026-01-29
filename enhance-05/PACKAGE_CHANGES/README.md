# Package.json Change Queue

This folder holds package.json change requests from individual agents.

## Purpose

To prevent merge conflicts when multiple agents need to modify package.json,
each agent writes their changes to a JSON file in this folder instead of
directly editing package.json.

## How It Works

1. **Agent creates change file:** `enhance-05/PACKAGE_CHANGES/E13.json`
2. **Coordinator reviews:** At phase gate, review all change files
3. **Coordinator merges:** Manually merge changes into package.json
4. **Verify:** Run `npm install` and test scripts

## File Format

```json
{
  "scripts": {
    "script-name": "command to run"
  },
  "dependencies": {
    "package-name": "^version"
  },
  "devDependencies": {
    "package-name": "^version"
  }
}
```

Only include the keys you need to add/modify.

## Example Change Files

### E13.json (Backup/Restore)
```json
{
  "scripts": {
    "progress:backup": "node progress/scripts/backup-progress.mjs",
    "progress:restore": "node progress/scripts/restore-progress.mjs"
  }
}
```

### E14.json (Extended Alerts)
```json
{
  "scripts": {
    "progress:alerts:extended": "node progress/scripts/check-alerts.mjs --extended"
  }
}
```

### E19.json (Validation)
```json
{
  "scripts": {
    "validate:all": "node scripts/validate-all.mjs",
    "validate:quick": "node scripts/validate-all.mjs --quick"
  }
}
```

## Merge Procedure

```bash
# 1. View all pending changes
cat enhance-05/PACKAGE_CHANGES/*.json

# 2. Manually add each to package.json

# 3. Verify
npm install
npm run --list

# 4. Test new scripts
npm run <new-script>
```

## Cleanup

After merging, keep the change files for reference. They document which
agent added which scripts.
