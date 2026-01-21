# Contract Council

**Frequency:** Weekly (during Weeks 4-8)  
**Duration:** 30 minutes  
**Participants:** Tech leads (FE + BE), API owners

---

## Purpose

Single topic: **API and domain model changes and compatibility rules.**

This ritual prevents contract drift between FE and BE teams during parallel development.

---

## Agenda

1. **Review proposed changes** (10 min)
   - New endpoints
   - Schema modifications
   - Breaking changes

2. **Compatibility assessment** (10 min)
   - Impact on existing FE code
   - Impact on existing BE code
   - Migration path if breaking

3. **Decisions** (10 min)
   - Approve/reject changes
   - Document as ADR if significant
   - Update contract version

---

## Change Categories

| Category | Process |
|----------|---------|
| **Additive** (new fields, endpoints) | Quick approval, minor version bump |
| **Non-breaking modification** | Review impact, minor version bump |
| **Breaking change** | Full discussion, major version bump, migration plan |

---

## Decision Record

All contract decisions should be recorded:

```markdown
## Contract Decision: [Date]

**Proposed Change:** [Description]
**Type:** Additive / Non-breaking / Breaking
**Impact:** [FE impact] / [BE impact]
**Decision:** Approved / Rejected / Deferred
**Version:** [Old] → [New]
**Migration:** [Plan if breaking]
```

---

## Attendees Checklist

- [ ] FE tech lead
- [ ] BE tech lead
- [ ] API owner (if separate)
- [ ] Bootcamp lead (optional)

---

## Output

- Updated contract (if changes approved)
- ADR (if significant decision)
- Action items for impacted teams
