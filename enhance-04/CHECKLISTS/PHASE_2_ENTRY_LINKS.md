# Phase 2 Checklist — Entry + Links

## Agents in this phase
- E03_PROGRESS_TRACKER
- E04_BROKEN_LINKS

**Execution:** Run CONCURRENTLY (no file overlap)

**Prerequisite:** Phase 1 complete

---

## Pre-merge verification

### E03_PROGRESS_TRACKER
- [ ] Work log exists: `enhance-04/WORK_PRODUCTS/E03_PROGRESS_TRACKER_WORKLOG.md`
- [ ] `docs/participants/` folder exists
- [ ] `docs/participants/README.md` exists
- [ ] `docs/participants/PROGRESS_TRACKER.md` exists
- [ ] Progress tracker has Week 1-4 sections
- [ ] Progress tracker has Sprint 1-4 sections
- [ ] `.START_HERE.md` links to progress tracker
- [ ] Root `README.md` links to progress tracker

### E04_BROKEN_LINKS
- [ ] Work log exists: `enhance-04/WORK_PRODUCTS/E04_BROKEN_LINKS_WORKLOG.md`
- [ ] All 35+ broken links from cleanup-instructions fixed
- [ ] `.START_HERE.md` links corrected
- [ ] Sprint 2/3/4 links corrected
- [ ] Week 1 lab links corrected
- [ ] Week 4 template link corrected

---

## Gate verification commands

```bash
# Run link check
npm run check:links
# Expected: 0 broken internal links (or only external link warnings)

# Verify progress tracker accessible
# Open in VS Code: docs/participants/PROGRESS_TRACKER.md

# Verify links in .START_HERE.md
# Open in VS Code and Ctrl+Click each link
```

---

## Coordination notes

E03 and E04 both touch `.START_HERE.md`:
- E03: adds progress tracker link
- E04: fixes existing broken links

**Resolution:** 
- If editing same lines: Coordinator merges manually
- If different lines: Git auto-merge should work

---

## Merge order
1. E04 first (more surgical changes)
2. E03 second (adds new content)

---

## Phase 2 complete when
- [ ] All checklist items above verified
- [ ] Link check passes
- [ ] Progress tracker linked and accessible
- [ ] Both work logs present
- [ ] No merge conflicts (or resolved)

**Next:** Proceed to Phase 3
