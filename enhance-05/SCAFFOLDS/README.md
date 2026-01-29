# enhance-05 Scaffold Scripts

Helper scripts for automating common agent tasks.

## Available Scripts

| Script | Description |
|--------|-------------|
| `create-signal.mjs` | Create a completion signal file |
| `validate-signals.mjs` | Validate all required signals exist |
| `create-worklog.mjs` | Create a work log file template |

## Usage

### Create Signal

```bash
# Success signal
node enhance-05/SCAFFOLDS/create-signal.mjs E12 SUCCESS "Runner-progress integration complete"

# Failure signal
node enhance-05/SCAFFOLDS/create-signal.mjs E12 FAILURE "Blocked by missing dependency"

# With agent as executor
node enhance-05/SCAFFOLDS/create-signal.mjs E12 SUCCESS "Task complete" --executor "E12_RUNNER_PROGRESS"
```

### Validate Signals

```bash
# Validate specific signals exist
node enhance-05/SCAFFOLDS/validate-signals.mjs E12 E13 E14

# Validate all Phase 1-5 signals
node enhance-05/SCAFFOLDS/validate-signals.mjs E12 E13 E14 E15 E16 E17 E18 E19 E20 E21 E22
```

### Create Work Log

```bash
# Create work log template
node enhance-05/SCAFFOLDS/create-worklog.mjs E12_RUNNER_PROGRESS

# With agent name
node enhance-05/SCAFFOLDS/create-worklog.mjs E12 --name "Runner Progress Integration"
```

## Notes

- Signals are created in `enhance-05/WORK_PRODUCTS/SIGNALS/`
- Work logs are created in `enhance-05/WORK_PRODUCTS/`
- All scripts are ES modules (.mjs)
- Run from repository root
