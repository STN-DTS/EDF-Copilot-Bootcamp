# Example Lab 0 Submission — Frontend

**Submitter:** Example User  
**Date:** 2026-01-20  
**Lab:** Lab 0 — Setup Verification + First PR

---

## What I Did

1. ✅ Confirmed Copilot works in IDE (VS Code with Copilot extension)
2. ✅ Pulled the training branch
3. ✅ Ran build + tests successfully
4. ✅ Made a tiny change (fixed a lint warning in a utility function)
5. ✅ Used Prompt P0 to get a plan before changing code
6. ✅ Committed and opened a PR

---

## Verification Commands Run

```bash
# Install dependencies
npm install
# Result: Added 847 packages in 32s

# Run tests
npm run test
# Result: 8 passed, 0 failed

# Lint check
npm run lint
# Result: No warnings or errors

# Dev server starts
npm run dev
# Result: Server running at http://localhost:5173
```

---

## Copilot vs Human

| Category | Details |
|----------|---------|
| **Copilot generated** | Suggested the lint fix |
| **Human verified** | Confirmed the fix was correct |
| **Human fixed** | N/A — Copilot's suggestion was correct |

---

## Quick Reflection

- **What worked well?** npm install and test ran without issues; Copilot quickly identified the lint fix.
- **What was confusing?** Took a moment to find where lint warnings were in the codebase.
- **One thing I learned about Copilot?** It's good at quick, mechanical fixes like lint issues.

---

## Files Changed

- `src/utils/formatDate.ts` — Fixed unused variable warning

---

## PR Link

[PR #2 — Lab 0 Setup Verification (Frontend)](https://github.com/example/repo/pull/2)
