# PR Review Policy

**Applies:** All weeks (from first PR)  
**Enforced by:** Bootcamp lead + code owners

---

## Core Principle

**Copilot-generated code must pass human review.**

AI accelerates; humans approve.

---

## Required Checks (All PRs)

### Automated
- [ ] Build passes
- [ ] Tests pass
- [ ] Linting passes
- [ ] Security scan (if configured)

### Human Review
- [ ] Checklist complete (from PR template)
- [ ] Tests included
- [ ] Copilot attribution noted
- [ ] Code owner approval

---

## PR Template Checklist

Every PR must complete the template at `.github/pull_request_template.md`:

```markdown
## Summary
[What this PR does]

## Verification Commands Run
- [ ] `./mvnw clean test` or `npm run test`
- [ ] `npm run lint` or equivalent
- [ ] [Other commands]

## Copilot vs Human
- **AI generated:** [What Copilot produced]
- **Human verified:** [What you checked]
- **Human fixed:** [What you changed]

## Checklist
- [ ] Files in `/working/{frontend|backend}/{name}_{timestamp}/`
- [ ] README.md with required info
- [ ] PLAN.md (for Labs 1+)
- [ ] Tests included
- [ ] Build passes
- [ ] No secrets in code
```

---

## Review Responsibilities

### Author Responsibilities
- Self-review before requesting review
- Run all verification commands
- Complete PR template fully
- Respond to feedback promptly

### Reviewer Responsibilities
- Verify checklist completion
- Test locally if substantial change
- Check for security issues
- Check for pattern compliance
- Provide constructive feedback

---

## Approval Requirements

| Week | Approvals Needed |
|------|------------------|
| Week 1 | 1 reviewer (any teammate) |
| Week 2-4 | 1 tech lead or senior |
| Sprints | 1 code owner + 1 peer |

---

## Rejection Criteria

PRs should be rejected if:
- Missing tests
- Missing README.md
- Secrets in code
- Large diff without plan
- Contract drift (during sprints)
- Security scan failures

---

## Merge Policy

- **Squash merge preferred** — Clean history
- **Delete branch after merge** — Clean workspace
- **Update working folder index** — If maintaining one
