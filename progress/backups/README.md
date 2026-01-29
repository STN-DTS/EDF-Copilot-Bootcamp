# Progress Backups

This directory contains timestamped backups of student progress files organized by cohort.

## Directory Structure

```
backups/
├── README.md           # This file
├── .gitkeep            # Keeps directory in git
├── 2026-01/            # Cohort-specific backup folder
│   ├── 2026-01_2026-01-29_10-30-00.tar.gz
│   ├── 2026-01_2026-01-29_10-30-00.manifest.json
│   └── ...
└── 2026-02/            # Another cohort
    └── ...
```

## Backup Naming Convention

Backups follow this naming pattern:

```
{cohort}_{date}_{time}.tar.gz
```

Example: `2026-01_2026-01-29_14-30-45.tar.gz`

## Manifest Files

Each backup includes a `.manifest.json` file containing:

```json
{
  "version": "1.0.0",
  "cohort": "2026-01",
  "createdAt": "2026-01-29T14:30:45.000Z",
  "backupFile": "2026-01_2026-01-29_14-30-45.tar.gz",
  "fileCount": 5,
  "files": [
    { "name": "jsmith.md", "size": 2048 },
    { "name": "jdoe.md", "size": 1536 }
  ],
  "totalSize": 3584
}
```

## Usage

### Create a Backup

```bash
npm run backup:cohort -- backup --cohort 2026-01
```

### List Available Backups

```bash
npm run backup:cohort -- list --cohort 2026-01
```

### Restore from Backup

```bash
npm run backup:cohort -- restore --cohort 2026-01 --date 2026-01-29
```

## Retention Policy

- **Maximum backups per cohort:** 10
- Older backups are automatically pruned when creating new ones
- Safety backups are created before restore operations (prefixed with `pre-restore`)

## Git Behavior

- This folder is typically `.gitignore`d to avoid committing large backup files
- The `.gitkeep` ensures the directory structure exists
- Cohort subfolders and backups are created dynamically

## Manual Operations

### Extract a Backup Manually

```bash
# View contents
tar -tzf backups/2026-01/2026-01_2026-01-29_14-30-45.tar.gz

# Extract to specific location
tar -xzf backups/2026-01/2026-01_2026-01-29_14-30-45.tar.gz -C /path/to/destination
```

### Create Manual Backup

```bash
cd progress
tar -czf backups/2026-01/manual_backup.tar.gz cohorts/2026-01/
```

## Troubleshooting

### "No backups found"

The cohort may not have any backups yet. Create one with:

```bash
npm run backup:cohort -- backup --cohort <cohort-id>
```

### "Cohort directory not found"

The cohort doesn't exist in `progress/cohorts/`. Initialize students first:

```bash
npm run progress:init -- --name "Student Name" --github username --cohort 2026-01 --track backend
```

### "Failed to create backup"

Ensure `tar` is available on your system:
- **Windows:** Usually available in Git Bash or WSL
- **macOS/Linux:** Pre-installed

## Best Practices

1. **Backup before major operations** - Always create a backup before bulk updates
2. **Verify backups** - Use `list` command to confirm backups were created
3. **Test restores periodically** - Ensure backups are valid by testing restore
4. **Document restore reasons** - Keep notes on why restores were performed
