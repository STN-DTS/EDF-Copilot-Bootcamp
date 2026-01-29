# Progress Alert Configuration

This directory contains configuration files for the progress tracking alert system.

## Files

| File | Purpose |
|------|---------|
| [alert-thresholds.json](alert-thresholds.json) | Alert threshold values and type definitions |

---

## Alert Thresholds Configuration

The `alert-thresholds.json` file controls when alerts are triggered for students.

### Time-Based Thresholds

| Threshold | Default | Description |
|-----------|---------|-------------|
| `stuckDays` | 3 | Days a student can be IN_PROGRESS on a single item before STUCK alert |
| `inactiveDays` | 7 | Days without file update before INACTIVE alert |
| `longRunningLabDays` | 5 | Days a lab can run before LONG_RUNNING alert |
| `cohortDeadlineWarnDays` | 14 | Days before deadline to trigger WARNING alert |
| `cohortDeadlineCritDays` | 7 | Days before deadline to trigger CRITICAL alert |

### Behavior Options

| Option | Default | Description |
|--------|---------|-------------|
| `excludeWeekends` | `true` | Exclude weekends from day calculations |
| `holidays` | `[]` | Array of dates (YYYY-MM-DD) to exclude from calculations |

---

## Alert Types

The system supports the following alert types:

| Type | Icon | Default Severity | Trigger |
|------|------|------------------|---------|
| `BLOCKED` | 🔴 | high | Student has 🚫 BLOCKED status on any item |
| `STUCK` | ⏳ | medium | Student IN_PROGRESS on same item for `stuckDays`+ |
| `INACTIVE` | 💤 | medium | No progress file update for `inactiveDays`+ |
| `LONG_RUNNING` | 🐌 | low | Lab active for `longRunningLabDays`+ (extended check) |
| `DEADLINE_WARNING` | ⚠️ | medium | Cohort deadline within `cohortDeadlineWarnDays` |
| `DEADLINE_CRITICAL` | 🔥 | high | Cohort deadline within `cohortDeadlineCritDays` |

---

## Cohort Deadlines

To enable deadline alerts, add cohort deadlines to the `cohortDeadlines` object:

```json
{
  "cohortDeadlines": {
    "2026-01": "2026-03-31",
    "2026-04": "2026-06-30"
  }
}
```

Format: `"YYYY-MM": "YYYY-MM-DD"` (cohort identifier: deadline date)

---

## CLI Overrides

The alert checker supports runtime overrides:

```bash
# Override stuck threshold to 5 days
npm run progress:alerts -- --cohort "2026-01" --threshold 5

# Enable extended checks (LONG_RUNNING, DEADLINE_*)
npm run progress:alerts -- --cohort "2026-01" --extended

# Combine options
npm run progress:alerts -- --cohort "2026-01" --threshold 5 --extended --output
```

### Available CLI Options

| Flag | Description |
|------|-------------|
| `--cohort "YYYY-MM"` | Specify cohort to check |
| `--all` | Check all cohorts |
| `--output` | Write report to `progress/ALERTS_{cohort}.md` |
| `--threshold <days>` | Override `stuckDays` threshold |
| `--extended` | Enable additional alert types (LONG_RUNNING, DEADLINE_*) |

---

## Customizing Thresholds

### Example: Stricter Monitoring

For cohorts that need closer attention:

```json
{
  "stuckDays": 2,
  "inactiveDays": 3,
  "longRunningLabDays": 3
}
```

### Example: Relaxed Schedule

For part-time or self-paced cohorts:

```json
{
  "stuckDays": 7,
  "inactiveDays": 14,
  "longRunningLabDays": 10,
  "excludeWeekends": true
}
```

### Example: Adding Holidays

```json
{
  "holidays": [
    "2026-01-01",
    "2026-02-17",
    "2026-04-03",
    "2026-05-18"
  ]
}
```

---

## Integration with Scripts

The configuration is loaded by:

- `progress/scripts/check-alerts.mjs` - Main alert checker
- `progress/scripts/generate-dashboard.mjs` - Dashboard generation (future)

### Loading Priority

1. CLI arguments (highest priority)
2. `alert-thresholds.json` values
3. Script defaults (lowest priority)

---

## Severity Levels

Alerts are categorized by severity for prioritization:

| Level | Action Required |
|-------|-----------------|
| **high** | Immediate attention needed |
| **medium** | Follow-up recommended within 1-2 days |
| **low** | Monitor, address when convenient |

---

## Best Practices

1. **Review weekly**: Run alerts at least weekly to catch issues early
2. **Adjust thresholds**: Tune values based on cohort pace and expectations
3. **Document holidays**: Add all observed holidays to avoid false positives
4. **Set deadlines**: Configure cohort deadlines to enable proactive warnings
5. **Use extended mode**: Run `--extended` periodically for comprehensive checks

---

## Troubleshooting

### No alerts but students seem stuck

- Check if `excludeWeekends` is affecting calculations
- Verify holidays are correctly formatted
- Lower thresholds temporarily to test

### Too many alerts

- Increase threshold values
- Add relevant holidays
- Check if cohort pace expectations are realistic

### Deadline alerts not appearing

- Ensure cohort is added to `cohortDeadlines`
- Run with `--extended` flag
- Verify date format is `YYYY-MM-DD`

---

_Last updated: 2026-01-29_
