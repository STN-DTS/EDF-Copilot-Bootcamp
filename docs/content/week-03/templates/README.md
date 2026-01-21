# Week 3 Templates

Templates for Spec-First Packaging.

**Status:** ✅ Complete

---

## Available Templates

| Template | Status | Description |
|----------|--------|-------------|
| [PROJECT_CONSTITUTION.md](./PROJECT_CONSTITUTION.md) | ✅ Ready | Technical standards, architecture boundaries, code conventions |
| [SYSTEM_SPEC.md](./SYSTEM_SPEC.md) | ✅ Ready | System specification with personas, journeys, NFRs |

---

## Architecture Decision Records

ADRs are stored in [../adrs/](../adrs/):

| ADR | Status | Decision |
|-----|--------|----------|
| [000-template.md](../adrs/000-template.md) | ✅ Ready | ADR template format |
| [001-authentication.md](../adrs/001-authentication.md) | ✅ Ready | OAuth 2.0 / OIDC with Microsoft Entra ID |
| [002-error-handling.md](../adrs/002-error-handling.md) | ✅ Ready | RFC 7807 Problem Details |
| [003-api-versioning.md](../adrs/003-api-versioning.md) | ✅ Ready | URL path versioning `/api/v{major}` |
| [004-ui-state-management.md](../adrs/004-ui-state-management.md) | ✅ Ready | React Router v7 built-in patterns |

---

## How to Use

1. **PROJECT_CONSTITUTION.md** — Copy template, fill in your project's standards
2. **SYSTEM_SPEC.md** — Copy template, complete each section for your project
3. **ADRs** — Use 000-template.md as base, create numbered ADRs for each key decision

---

## Copilot Assistance

Generate new ADRs using **P16** prompt:

```markdown
No secrets, no production data. Use placeholders.

Generate an Architecture Decision Record (ADR) for:

**Decision:** [Describe the decision to be made]
**Context:** [Environment and constraints]
**Constraints:** [Non-negotiable requirements]

Include: Context, Decision, 3+ Options with pros/cons, Consequences, Implementation notes
```
