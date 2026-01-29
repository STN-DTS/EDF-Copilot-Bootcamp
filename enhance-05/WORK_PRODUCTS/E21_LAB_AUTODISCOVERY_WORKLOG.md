# E21: Lab ID Auto-Discovery Utility - Work Log

**Agent:** E21_LAB_ID_AUTODISCOVERY  
**Date:** 2026-01-29  
**Status:** ✅ COMPLETE

---

## Mission

Create a utility to auto-discover valid lab IDs from the YAML files in `bootcamp/steps/`.

---

## Deliverables

### 1. Created: `scripts/lab-discovery.mjs`

A comprehensive lab ID discovery utility with:

#### CLI Features
- **Default output**: Formatted text with labs grouped by week/sprint
- **`--json`**: JSON output for programmatic consumption
- **`--filter <prefix>`**: Filter by prefix (e.g., `week-01`, `sprint`, `week`)
- **`--ids-only`**: Output only lab IDs (one per line) for shell scripting
- **`--grouped`**: Show labs organized by week/sprint category
- **`--verbose`**: Include full metadata (timebox, objective, nav links)
- **`--help`**: Display usage information

#### Module Exports
```javascript
import { 
  discoverLabs,       // Get all labs with optional filter
  getLabById,         // Get specific lab by ID
  isValidLabId,       // Check if lab ID exists (async)
  isValidLabIdFormat, // Check lab ID pattern (sync)
  getLabIds,          // Get just the ID strings
  getLabsGrouped,     // Get labs organized by week/sprint
  LAB_ID_PATTERN      // Regex pattern for lab IDs
} from './lab-discovery.mjs';
```

---

## Implementation Details

### Lab ID Pattern
```
Pattern: /^(week|sprint)-(\d{2})-(lab|step)-(\d{2})$/

Examples:
- week-01-lab-00
- week-02-lab-03
- sprint-01-step-00
- sprint-04-step-04
```

### Source Data
- **Location**: `bootcamp/steps/{week-XX|sprint-XX}/*.yaml`
- **Index file**: `bootcamp/steps/index.yaml`
- **Total discovered**: 39 labs/steps

### Breakdown
| Category | Count |
|----------|-------|
| Week 1   | 7 labs |
| Week 2   | 4 labs |
| Week 3   | 4 labs |
| Week 4   | 4 labs |
| Sprint 1 | 5 steps |
| Sprint 2 | 5 steps |
| Sprint 3 | 5 steps |
| Sprint 4 | 5 steps |
| **Total** | **39** |

---

## Usage Examples

### CLI Usage
```bash
# List all labs (formatted)
node scripts/lab-discovery.mjs

# Output as JSON
node scripts/lab-discovery.mjs --json

# Filter to week-01 only
node scripts/lab-discovery.mjs --filter week-01

# Get only sprint steps
node scripts/lab-discovery.mjs --filter sprint

# IDs only for scripting
node scripts/lab-discovery.mjs --ids-only

# Grouped view
node scripts/lab-discovery.mjs --grouped

# Help
node scripts/lab-discovery.mjs --help
```

### Module Usage
```javascript
import { discoverLabs, isValidLabId, getLabById } from './lab-discovery.mjs';

// Get all labs
const labs = await discoverLabs();
console.log(labs);
// [{ id: 'sprint-01-step-00', title: 'Sprint 1: Kickoff' }, ...]

// Check if lab ID is valid
const valid = await isValidLabId('week-01-lab-00');
// true

// Get specific lab metadata
const lab = await getLabById('week-01-lab-00');
// { id, title, timebox, objective, filePath, nav }
```

---

## Testing Results

| Test | Result |
|------|--------|
| `--ids-only` output | ✅ 39 IDs listed |
| `--filter week-01` | ✅ 7 labs shown |
| `--filter sprint-01` | ✅ 5 steps shown |
| `--json` output | ✅ Valid JSON array |
| `--grouped` output | ✅ Organized by category |
| Module import `discoverLabs()` | ✅ Returns 39 labs |
| Module import `isValidLabId()` | ✅ True for valid, false for invalid |
| Invalid lab detection | ✅ `invalid-lab` returns false |

---

## Integration Points

This utility can be integrated with:
- **`bootcamp.mjs`**: For validating lab IDs in progress commands
- **`signal-helper.mjs`**: For auto-completing signal IDs
- **Progress tracking**: Validating lab completion markers
- **CI/CD**: Verifying all lab references are valid

---

## Files Created

| File | Purpose |
|------|---------|
| `scripts/lab-discovery.mjs` | Main utility (CLI + module) |
| `enhance-05/WORK_PRODUCTS/E21_LAB_AUTODISCOVERY_WORKLOG.md` | This work log |

---

## Completion Signal

Ready for signal creation:
```bash
node scripts/signal-helper.mjs create E21 --message "Lab ID Auto-Discovery utility complete. Created scripts/lab-discovery.mjs with CLI (--json, --filter, --ids-only, --grouped, --verbose, --help) and module exports (discoverLabs, getLabById, isValidLabId, getLabIds, getLabsGrouped). Discovers 39 labs/steps from YAML files."
```
