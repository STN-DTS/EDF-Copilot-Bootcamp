# 📊 Progress Tracking System

> **Centralized student progression tracking for the EDF Copilot Bootcamp**

This system enables individual student progress tracking with simple CLI commands. Each student has their own markdown file that tracks their journey through the bootcamp.

---

## 🚀 Quick Start

### 1. Initialize Your Progress File

```bash
npm run progress:init -- --name "Your Name" --github "your-github-username" --cohort "2026-01" --track "backend"
```

**Required arguments:**
| Argument | Description | Example |
|----------|-------------|---------|
| `--name` | Your full name | `"Jane Smith"` |
| `--github` | Your GitHub username | `"jsmith"` |
| `--cohort` | Cohort identifier (YYYY-MM) | `"2026-01"` |
| `--track` | Learning track | `"frontend"` or `"backend"` |

**Optional arguments:**
| Argument | Description | Example |
|----------|-------------|---------|
| `--facilitator` | Assigned facilitator name | `"John Doe"` |
| `--force` | Overwrite existing file | (flag, no value) |

### 2. Mark a Lab as Started

```bash
npm run progress:start -- --student "jsmith" --cohort "2026-01" week-01-lab-02
```

### 3. Mark a Lab as Complete

```bash
npm run progress:complete -- --student "jsmith" --cohort "2026-01" --pr "123" week-01-lab-02
```

### 4. Mark as Blocked

```bash
npm run progress:blocked -- --student "jsmith" --cohort "2026-01" --notes "Waiting for environment setup" week-01-lab-01
```

### 5. View Progress

```bash
npm run progress:view -- --student "jsmith" --cohort "2026-01"
```

---

## 📋 Status Icons

| Status | Icon | Description |
|--------|------|-------------|
| `NOT_STARTED` | ⬜ | Lab has not been started yet |
| `IN_PROGRESS` | 🔄 | Currently working on this lab |
| `COMPLETE` | ✅ | Lab completed and verified |
| `BLOCKED` | 🚫 | Blocked by an issue or dependency |

---

## 📁 Folder Structure

```
progress/
├── README.md                    # This file
├── .template/
│   └── STUDENT_PROGRESS.md      # Template for new students
├── cohorts/
│   ├── .gitkeep
│   ├── 2026-01/                 # Cohort folders (created automatically)
│   │   ├── jsmith.md            # Individual student files
│   │   └── adoe.md
│   └── 2026-02/
│       └── bwilson.md
└── scripts/
    ├── init-student.mjs         # Initialize student progress file
    └── update-progress.mjs      # Update progress status
```

---

## 🔧 CLI Commands Reference

### `progress:init`

Initializes a new student progress file from the template.

```bash
npm run progress:init -- --name "<name>" --github "<username>" --cohort "<YYYY-MM>" --track "<track>" [--facilitator "<name>"] [--force]
```

**Validations:**
- GitHub username: 1-39 characters, alphanumeric + hyphens, no leading/trailing hyphens
- Cohort: Must match `YYYY-MM` format (e.g., `2026-01`)
- Track: Must be `frontend` or `backend`

**Examples:**
```bash
# Initialize new student
npm run progress:init -- --name "Jane Smith" --github "jsmith" --cohort "2026-01" --track "backend"

# Initialize with facilitator
npm run progress:init -- --name "Jane Smith" --github "jsmith" --cohort "2026-01" --track "frontend" --facilitator "John Doe"

# Force overwrite existing file
npm run progress:init -- --name "Jane Smith" --github "jsmith" --cohort "2026-01" --track "backend" --force
```

---

### `progress:start`

Marks a lab as `IN_PROGRESS` and records the start timestamp.

```bash
npm run progress:start -- --student "<username>" --cohort "<YYYY-MM>" <lab-id>
```

**Lab ID formats:**
- Week labs: `week-01-lab-00` through `week-04-lab-06`
- Sprint steps: `sprint-01-step-01` through `sprint-04-step-XX`

**Examples:**
```bash
npm run progress:start -- --student "jsmith" --cohort "2026-01" week-01-lab-02
npm run progress:start -- --student "jsmith" --cohort "2026-01" sprint-01-step-01
```

---

### `progress:complete`

Marks a lab as `COMPLETE`, records the completion timestamp, and optionally links a PR.

```bash
npm run progress:complete -- --student "<username>" --cohort "<YYYY-MM>" [--pr "<pr-number>"] <lab-id>
```

**Examples:**
```bash
# Complete without PR
npm run progress:complete -- --student "jsmith" --cohort "2026-01" week-01-lab-00

# Complete with PR link
npm run progress:complete -- --student "jsmith" --cohort "2026-01" --pr "42" week-01-lab-02
```

---

### `progress:blocked`

Marks a lab as `BLOCKED` and records blocker notes.

```bash
npm run progress:blocked -- --student "<username>" --cohort "<YYYY-MM>" --notes "<description>" <lab-id>
```

**Examples:**
```bash
npm run progress:blocked -- --student "jsmith" --cohort "2026-01" --notes "Docker not starting" week-01-lab-00
```

---

### `progress:view`

Displays the current progress summary for a student.

```bash
npm run progress:view -- --student "<username>" --cohort "<YYYY-MM>"
```

**Examples:**
```bash
npm run progress:view -- --student "jsmith" --cohort "2026-01"
```

---

## 📊 Progress File Structure

Each student's progress file contains:

1. **Header** - Name, GitHub, cohort, track, start date
2. **Quick Stats** - Summary of completion status
3. **Week 1-4 Progress** - Detailed tables for each week's labs
4. **Sprint 1-4 Progress** - Detailed tables for each sprint's steps
5. **Gate Checkpoints** - Key milestones and gates
6. **Time Log** - Daily/weekly time tracking
7. **Blockers Log** - Issues encountered and resolutions
8. **Personal Reflections** - Learning notes and insights

---

## 🔐 Best Practices

1. **Update regularly** - Mark labs as started/complete as you go
2. **Link your PRs** - Use the `--pr` flag when completing labs
3. **Log blockers** - Use the blocked command to track issues
4. **Add notes** - Keep your time log and reflections updated

---

## 🤝 For Facilitators

Facilitators can view any student's progress by reading their markdown file:

```bash
cat progress/cohorts/2026-01/jsmith.md
```

Or use the view command:

```bash
npm run progress:view -- --student "jsmith" --cohort "2026-01"
```

---

## 🔗 Related Resources

- [Master Bootcamp Index](/.MASTER_BOOTCAMP.md)
- [Week 1 Labs](/docs/content/week-01/micro-labs/)
- [Definition of Done](/docs/shared/reference-materials/DEFINITION_OF_DONE.md)
