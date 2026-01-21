# Example Lab 1 Submission — Backend

**Submitter:** Example User  
**Date:** 2026-01-20  
**Lab:** Lab 1 — Plan Only

---

## What I Did

Demonstrated plan-first discipline by:
1. ✅ Used Prompt P0 to generate a plan before writing any code
2. ✅ Reviewed the plan for completeness (files, steps, risks, tests)
3. ✅ Refined the plan based on repo patterns
4. ✅ Implemented only after plan approval
5. ✅ Verified with build and tests

---

## The Task

Lead provided: "Add a health check endpoint that returns the application version."

---

## Copilot vs Human

- **Copilot generated:** The initial plan with file list and steps
- **Human refined:** Added risk about version number source, added test step
- **Human verified:** Checked that plan referenced existing patterns in repo

---

## Verification Commands Run

```bash
# Build and run all tests
./mvnw clean test
# Result: BUILD SUCCESS

# Verify no unrelated files changed
git diff --stat
# Result: Only expected files modified
```

---

## Quick Reflection

- **Did the plan help you stay focused?** Yes, having the file list upfront prevented scope creep
- **What did Copilot miss in the initial plan?** It didn't identify the risk of hardcoding version
- **How did you refine the plan?** Added step to externalize version to application.properties
