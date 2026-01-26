# Agent Signal Files

This folder contains signal files that agents use to communicate completion status.

**Format:** `EXX_<SIGNAL_NAME>.signal`

**Example:**
```markdown
# E09_PROGRESS_READY.signal
timestamp: 2026-01-20T14:30:00Z
status: SUCCESS
files_modified:
  - progress/README.md
  - progress/STUDENT_TEMPLATE.md
  - progress/scripts/init-student.mjs
  - progress/scripts/update-progress.mjs
  - package.json
notes: |
  Progress system created. E10 can now proceed.
```

**Status values:**
- `SUCCESS` — Fully complete, downstream can proceed
- `PARTIAL` — Some tasks complete, may need coordinator review
- `FAILED` — Blocked, do not proceed with dependents

---

## Signal Dependency Chain

```
E01 ─────► (none)
E02 ─────► (none)
E09 ─────► (none, or waits for E01 if integrating with runner)
E10 ─────► E09_PROGRESS_READY.signal (HARD requirement)
E03 ─────► (none)
E04 ─────► (none)
E05-E07 ─► (none, concurrent)
E08 ─────► All phases complete
```
