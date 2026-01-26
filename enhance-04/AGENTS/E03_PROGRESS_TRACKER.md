# E03_PROGRESS_TRACKER — Participant Progress Tracker

## Mission
Create a progress tracker document that participants can copy and use to track their completion of bootcamp weeks, labs, and sprints.

---

## File ownership (absolute)

**Owned paths:**
- `docs/participants/PROGRESS_TRACKER.md` (create new)
- `docs/participants/README.md` (create if needed)

**May update (link insertion only):**
- `.START_HERE.md` — add link to progress tracker
- Root `README.md` — add link to progress tracker

**Must NOT edit:**
- Week/sprint docs
- Lab files
- Any other content

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **`docs/participants/` folder does NOT exist** (or is empty)
2. **Progress tracker does NOT exist anywhere**
3. **Read `.START_HERE.md`** to find the best place to add a progress tracker link
4. **Read root `README.md`** to find the best place to add a progress tracker link

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create participants folder README
Create `docs/participants/README.md`:

```markdown
# Participant Resources

This folder contains resources for bootcamp participants.

## Contents

- [Progress Tracker](PROGRESS_TRACKER.md) — Track your completion of labs and sprints

## How to use

1. Copy `PROGRESS_TRACKER.md` to your working folder
2. Check off items as you complete them
3. Include in your PR submissions as proof of progress
```

### Task 2: Create Progress Tracker
Create `docs/participants/PROGRESS_TRACKER.md` with this structure:

```markdown
# 📊 Bootcamp Progress Tracker

**Participant Name:** ____________________  
**Start Date:** ____________________  
**Cohort:** ____________________

---

## How to use this tracker

1. **Copy this file** to your working folder: `/working/{frontend|backend}/{your_name}_{date}/`
2. **Check off items** as you complete each lab or sprint task
3. **Include in your PRs** to show progress
4. **Screenshot for facilitators** if requested

---

## Week 1 — AI Enablement (Foundation)

| Lab | Status | Date Completed | PR Link | Notes |
|-----|--------|----------------|---------|-------|
| Lab 0 — Setup Verification | ☐ | | | |
| Lab 1 — Plan Only | ☐ | | | |
| Lab 2 — Scaffold Vertical Slice | ☐ | | | |
| Lab 3 — Tests First | ☐ | | | |
| Lab 4 — Refactor Guarded | ☐ | | | |
| Lab 5 — OpenShift Readiness | ☐ | | | |
| Lab 6 — Capstone Mini-Feature | ☐ | | | |

**Week 1 Gate:** ☐ All labs completed | ☐ PR approved | ☐ Ready for Week 2

---

## Week 2 — Constraint Register

| Lab | Status | Date Completed | Notes |
|-----|--------|----------------|-------|
| Lab 2-0 — Constraint Extraction | ☐ | | |
| Lab 2-1 — Journey Mapping | ☐ | | |
| Lab 2-2 — AC Writing | ☐ | | |
| Lab 2-3 — Constraint Review | ☐ | | |

**Week 2 Gate:** ☐ All labs completed | ☐ Constraint register approved

---

## Week 3 — Spec-First Packaging

| Lab | Status | Date Completed | Notes |
|-----|--------|----------------|-------|
| Lab 3-0 — ADR Drafting | ☐ | | |
| Lab 3-1 — Constitution Section | ☐ | | |
| Lab 3-2 — System Spec Persona | ☐ | | |
| Lab 3-3 — ADR Review | ☐ | | |

**Week 3 Gate:** ☐ All labs completed | ☐ ADRs approved

---

## Week 4 — Contract-First Development

| Lab | Status | Date Completed | Notes |
|-----|--------|----------------|-------|
| Lab 4-0 — OpenAPI Endpoint | ☐ | | |
| Lab 4-1 — Glossary Term | ☐ | | |
| Lab 4-2 — MSW Handler | ☐ | | |
| Lab 4-3 — Contract Validation | ☐ | | |

**Week 4 Gate:** ☐ All labs completed | ☐ Contracts approved | ☐ Ready for Sprints

---

## Sprint 1 — Foundation Sprint

| Task | Status | Date Completed | Notes |
|------|--------|----------------|-------|
| Sprint Planning | ☐ | | |
| Backend Tasks | ☐ | | |
| Frontend Tasks | ☐ | | |
| Sprint Review | ☐ | | |
| Sprint Retro | ☐ | | |

**Sprint 1 Gate:** ☐ Sprint complete | ☐ Demo delivered

---

## Sprint 2 — Core Features

| Task | Status | Date Completed | Notes |
|------|--------|----------------|-------|
| Sprint Planning | ☐ | | |
| Backend Tasks | ☐ | | |
| Frontend Tasks | ☐ | | |
| NFR Checklist | ☐ | | |
| Sprint Review | ☐ | | |

**Sprint 2 Gate:** ☐ Sprint complete | ☐ NFRs met

---

## Sprint 3 — Security Hardening

| Task | Status | Date Completed | Notes |
|------|--------|----------------|-------|
| Sprint Planning | ☐ | | |
| Security Tasks | ☐ | | |
| Auth Implementation | ☐ | | |
| Security Checklist | ☐ | | |
| Sprint Review | ☐ | | |

**Sprint 3 Gate:** ☐ Sprint complete | ☐ Security review passed

---

## Sprint 4 — Production Ready

| Task | Status | Date Completed | Notes |
|------|--------|----------------|-------|
| Sprint Planning | ☐ | | |
| Performance Optimization | ☐ | | |
| Documentation | ☐ | | |
| Ship-Ready Checklist | ☐ | | |
| Final Demo | ☐ | | |

**Sprint 4 Gate:** ☐ Sprint complete | ☐ Ship-ready approved

---

## Bootcamp Completion

| Milestone | Status | Date |
|-----------|--------|------|
| All Weeks Completed | ☐ | |
| All Sprints Completed | ☐ | |
| Final Assessment | ☐ | |
| Certificate Issued | ☐ | |

---

## Personal Notes / Reflections

### What I learned:


### What was challenging:


### What I would do differently:

```

### Task 3: Add link to .START_HERE.md
Add a link to the progress tracker in the appropriate section of `.START_HERE.md`.

### Task 4: Add link to root README.md
Add a link to the progress tracker in root `README.md`.

---

## Output contract (mandatory)

Return:
1. **Plan** (brief, 5-10 bullets)
2. **Patch** (unified diff for each file created/modified)
3. **Verification commands**
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E03_PROGRESS_TRACKER_WORKLOG.md`

---

## Success criteria
- [ ] `docs/participants/` folder exists
- [ ] `docs/participants/README.md` exists
- [ ] `docs/participants/PROGRESS_TRACKER.md` exists with all weeks/sprints
- [ ] `.START_HERE.md` links to progress tracker
- [ ] Root `README.md` links to progress tracker
- [ ] Tracker has checkboxes for all labs and sprint tasks
