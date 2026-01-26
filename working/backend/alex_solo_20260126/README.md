# Example Lab 0 Submission — Backend

**Submitter:** Example User  
**Date:** 2026-01-20  
**Lab:** Lab 0 — Setup Verification + First PR

---

## What I Did

1. ✅ Confirmed Copilot works in IDE (VS Code with Copilot extension)
2. ✅ Pulled the training branch
3. ✅ Ran build + tests successfully
4. ✅ Made a tiny change (added a comment to clarify a method)
5. ✅ Used Prompt P0 to get a plan before changing code
6. ✅ Committed and opened a PR

---

## Verification Commands Run

```bash
# Backend build and test
./mvnw clean test
# Result: BUILD SUCCESS, 12 tests passed

# Application starts successfully
./mvnw spring-boot:run
# Result: Started application on port 8080, health endpoint responds
```

---

## Copilot vs Human

| Category | Details |
|----------|---------|
| **Copilot generated** | Suggested the comment text |
| **Human verified** | Ensured comment was accurate and helpful |
| **Human fixed** | Adjusted wording for clarity |

---

## Quick Reflection

- **What worked well?** Copilot setup was straightforward; build tools worked as expected.
- **What was confusing?** Initially wasn't sure which branch to pull.
- **One thing I learned about Copilot?** The plan-first approach (P0) helps focus the task.

---

## Files Changed

- `src/main/java/com/example/service/OrderService.java` — Added clarifying comment

---

## PR Link

[PR #1 — Lab 0 Setup Verification](https://github.com/example/repo/pull/1)
