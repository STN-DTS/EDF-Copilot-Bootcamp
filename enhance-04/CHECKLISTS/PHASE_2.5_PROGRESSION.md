# Phase 2.5 Checklist — Student Progression System

**Agents in scope:** E09_PROGRESSION_SYSTEM, E10_FACILITATOR_DASHBOARD

**Gate Type:** Sequential (E09 must complete before E10)

---

## Pre-Flight Verification

Before starting Phase 2.5:
- [ ] Phase 2 gate passed
- [ ] Progress tracker template exists (from E03)
- [ ] Package.json has scripts section accessible
- [ ] Node.js v18+ available

---

## E09_PROGRESSION_SYSTEM Checklist

**Recon gate passed:**
- [ ] Agent confirmed `progress/` folder doesn't exist yet
- [ ] Agent confirmed package.json readable
- [ ] Agent confirmed no conflicting scripts

**Files created:**
- [ ] `progress/README.md`
- [ ] `progress/STUDENT_TEMPLATE.md`
- [ ] `progress/scripts/init-student.mjs`
- [ ] `progress/scripts/update-progress.mjs`

**Scripts functional:**
- [ ] `npm run progress:init` works
- [ ] `npm run progress:update` works
- [ ] Test student file creates correctly

**Work log submitted:**
- [ ] `enhance-04/WORK_PRODUCTS/E09_PROGRESSION_SYSTEM_WORKLOG.md`

**Signal file created:**
- [ ] `enhance-04/WORK_PRODUCTS/SIGNALS/E09_PROGRESS_READY.signal`

---

## E10_FACILITATOR_DASHBOARD Checklist

**Recon gate passed:**
- [ ] Agent confirmed E09 signal file exists
- [ ] Agent confirmed `progress/` structure is correct
- [ ] Agent confirmed test student exists (or created one)

**Files created:**
- [ ] `progress/scripts/generate-dashboard.mjs`
- [ ] `progress/scripts/check-alerts.mjs`
- [ ] `.github/workflows/update-dashboard.yml` (optional)

**Scripts functional:**
- [ ] `npm run progress:dashboard` works
- [ ] `npm run progress:alerts` works
- [ ] Dashboard markdown generates correctly
- [ ] Alert detection works for stuck/blocked students

**Work log submitted:**
- [ ] `enhance-04/WORK_PRODUCTS/E10_FACILITATOR_DASHBOARD_WORKLOG.md`

**Signal file created:**
- [ ] `enhance-04/WORK_PRODUCTS/SIGNALS/E10_COMPLETE.signal`

---

## Phase 2.5 Gate Verification

Run the following commands to verify phase completion:

```bash
# 1. Initialize test student
npm run progress:init -- --name "Phase Test" --github phasetest --cohort test --track backend
echo "✅ Student initialization works"

# 2. Update progress (simulate lab completion)
npm run progress:update -- --github phasetest --cohort test --lab lab-00 --status complete
echo "✅ Progress update works"

# 3. Generate dashboard
npm run progress:dashboard -- --cohort test
echo "✅ Dashboard generation works"

# 4. Check alerts
npm run progress:alerts -- --cohort test
echo "✅ Alerts check works"

# 5. Verify files exist
ls progress/scripts/*.mjs | wc -l
echo "Expected: 4 (init, update, dashboard, alerts)"

# 6. Cleanup
rm -rf progress/cohorts/test
rm progress/DASHBOARD_test.md 2>/dev/null
echo "✅ Cleanup complete"
```

---

## Rollback Procedure

If Phase 2.5 fails:

```bash
# Full rollback
rm -rf progress/
git checkout package.json  # Revert script additions
git checkout .github/workflows/update-dashboard.yml 2>/dev/null

# Partial rollback (keep E09, revert E10)
rm progress/scripts/generate-dashboard.mjs
rm progress/scripts/check-alerts.mjs
rm .github/workflows/update-dashboard.yml 2>/dev/null
```

---

## Coordinator Notes

- E10 MUST wait for E09 to complete
- Check for `E09_PROGRESS_READY.signal` before spawning E10
- If E09 partially fails, do not proceed to E10
- Facilitator dashboard is optional but highly recommended
