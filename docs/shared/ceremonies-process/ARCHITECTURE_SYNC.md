# Architecture Sync

**Frequency:** Twice weekly (during Weeks 3-8)  
**Duration:** 20 minutes  
**Participants:** Tech leads (FE + BE)

---

## Purpose

Single topic: **Decisions that affect both teams.**

Any decision made here that has lasting impact must become an ADR.

---

## Agenda

1. **Open decisions** (5 min)
   - What needs to be decided?
   - Who is affected?

2. **Discussion** (10 min)
   - Options considered
   - Trade-offs

3. **Decision** (5 min)
   - Commit to approach
   - Assign ADR owner

---

## Common Topics

| Topic | Example Decisions |
|-------|-------------------|
| **Error handling** | Which status codes? Problem Details format? |
| **Authentication** | Token format? Refresh strategy? |
| **State management** | Client-side caching? Optimistic updates? |
| **Logging** | Structured format? Required fields? |
| **Performance** | Response time targets? Pagination limits? |
| **Testing** | Mock strategy? Test data approach? |

---

## ADR Trigger

If a decision:
- Affects both FE and BE
- Is hard to reverse
- Has long-term implications

**→ It must become an ADR.**

---

## ADR Quick Template

```markdown
# ADR-NNN: [Decision Title]

## Status
Accepted / Superseded / Deprecated

## Context
[Why this decision was needed]

## Decision
[What we decided]

## Consequences
[Positive and negative implications]
```

---

## Attendees Checklist

- [ ] FE tech lead
- [ ] BE tech lead
- [ ] Bootcamp lead (optional)

---

## Output

- Decision recorded
- ADR created (if applicable)
- Teams aligned on approach
