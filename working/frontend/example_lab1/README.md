# Example Lab 1 Submission — Frontend

**Submitter:** Example User  
**Date:** 2026-01-20  
**Lab:** Lab 1 — Plan Only

---

## What I Did

Demonstrated plan-first discipline by:
1. ✅ Used Prompt P0 to generate a plan before writing any code
2. ✅ Reviewed the plan for completeness (files, steps, risks, tests)
3. ✅ Refined the plan based on RRv7 patterns in repo
4. ✅ Implemented only after plan approval
5. ✅ Verified with build and tests

---

## The Task

Lead provided: "Add a 404 Not Found page that displays when users navigate to an unknown route."

---

## Copilot vs Human

- **Copilot generated:** The initial plan with file list and steps
- **Human refined:** Added error boundary consideration, ensured RRv7 pattern used
- **Human verified:** Checked plan against frontend.instructions.md

---

## Verification Commands Run

```bash
# Run all tests
npm run test
# Result: All tests passing

# Build for production
npm run build
# Result: Build successful

# Verify no unrelated files changed
git diff --stat
# Result: Only expected files modified
```

---

## Quick Reflection

- **Did the plan help you stay focused?** Yes, it prevented me from adding extra styling
- **What did Copilot miss in the initial plan?** It initially suggested a generic React component instead of RRv7 route
- **How did you refine the plan?** Changed to use RRv7 errorElement pattern
