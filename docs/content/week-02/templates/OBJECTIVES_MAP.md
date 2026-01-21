# Objectives Map Template

**Project:** [Project Name]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [Product Owner Name]

---

## How to Use This Template

1. **List all potential objectives** from stakeholder input
2. **Categorize using MoSCoW** — be ruthless about "Won't"
3. **Document rationale** — why is this in this category?
4. **Get stakeholder sign-off** — prevents scope creep later
5. **Reference in sprint planning** — only "Must" items block delivery

---

## MoSCoW Legend

| Category | Meaning | Gate Impact | Sprint Impact |
|----------|---------|-------------|---------------|
| **Must** | Non-negotiable for go-live | Blocks Gate 5 | Must complete in Sprints 1-4 |
| **Should** | Highly desired, significant value | Impacts quality score | Target for Sprints 2-4 |
| **Could** | Nice to have if time permits | No gate impact | Only if sprint has capacity |
| **Won't** | Explicitly out of scope this phase | Prevents scope creep | Do not plan, do not build |

---

## Objectives by Category

### MUST (Non-Negotiable for Go-Live)

> These objectives MUST be complete for Gate 5 approval. If any are missing, we do not ship.

| ID | Objective | Rationale | Success Criteria | Owner |
|----|-----------|-----------|------------------|-------|
| M-001 | User can create an order | Core business function | E2E test passes: order creation flow | BE Lead |
| M-002 | User can view order history | Core business function | E2E test passes: order list displays | FE Lead |
| M-003 | User can cancel a pending order | Core business function | E2E test passes: cancellation flow | BE Lead |
| M-004 | User can authenticate via SSO | Security requirement | SSO login works | Security Lead |
| M-005 | All data changes are auditable | Compliance requirement | Audit logs capture changes | BE Lead |
| M-006 | System meets accessibility (WCAG 2.1 AA) | Legal/policy requirement | Lighthouse score ≥90 | FE Lead |
| M-007 | | | | |

### SHOULD (Highly Desired)

> These objectives SHOULD be complete for optimal value. Plan for Sprints 2-4.

| ID | Objective | Rationale | Success Criteria | Owner |
|----|-----------|-----------|------------------|-------|
| S-001 | User receives email confirmation | Improves user experience | Email sent on order creation | BE Lead |
| S-002 | Admin can view all orders | Operations efficiency | Admin dashboard displays orders | FE Lead |
| S-003 | System supports pagination | Performance at scale | API + UI pagination works | Full Team |
| S-004 | User can filter order history | Usability improvement | Filter UI + API works | FE Lead |
| S-005 | | | | |

### COULD (Nice to Have)

> These objectives COULD be delivered if sprints have capacity. Do not plan as committed work.

| ID | Objective | Rationale | Success Criteria | Owner |
|----|-----------|-----------|------------------|-------|
| C-001 | User can export orders to CSV | Convenience feature | Export button downloads file | FE Lead |
| C-002 | Dark mode support | User preference | Theme toggle works | FE Lead |
| C-003 | Order analytics dashboard | Future roadmap alignment | Charts display correctly | FE Lead |
| C-004 | | | | |

### WON'T (Explicitly Out of Scope)

> These objectives WON'T be delivered in this phase. This is a boundary, not a backlog.

| ID | Objective | Rationale for Exclusion | Future Consideration |
|----|-----------|-------------------------|----------------------|
| W-001 | Mobile native app | Web-first approach for MVP | Phase 2 if adoption |
| W-002 | Multi-language support (i18n) | English-only for initial release | Phase 2 planned |
| W-003 | Payment processing | Separate system handles payments | Integration point only |
| W-004 | Inventory management | Out of scope for Order Management | Separate project |
| W-005 | Real-time notifications | Polling acceptable for MVP | Sprint 4 stretch goal |
| W-006 | | | |

---

## Objective Dependencies

> Map dependencies between objectives to inform sprint sequencing

```
M-004 (Auth)
    └──► M-001 (Create Order) ──► M-002 (View History)
                              └──► M-003 (Cancel Order)
                              └──► M-005 (Audit)

M-006 (Accessibility) ──► applies to all UI objectives
```

| Objective | Depends On | Blocks |
|-----------|------------|--------|
| M-001 (Create Order) | M-004 (Auth) | M-002, M-003, S-001 |
| M-002 (View History) | M-001 | S-004, C-001 |
| M-003 (Cancel Order) | M-001 | — |
| M-005 (Audit) | M-001 | — |
| S-001 (Email) | M-001 | — |
| S-003 (Pagination) | M-002 | — |

---

## Sprint Mapping (Preliminary)

> Initial assignment of objectives to sprints — refined after Gate 2

| Sprint | Must Objectives | Should Objectives | Could Objectives |
|--------|-----------------|-------------------|------------------|
| Sprint 1 (Thin Slice) | M-001, M-004, M-005 | — | — |
| Sprint 2 (Expand) | M-002, M-003 | S-002, S-003 | — |
| Sprint 3 (Harden) | M-006 (full audit) | S-001, S-004 | — |
| Sprint 4 (Polish) | — | Remaining Should | C-001 if capacity |

---

## Scope Change Process

> How to handle requests that conflict with this map

**When a stakeholder requests something in "Won't":**

1. Point to this signed document
2. Explain rationale for exclusion
3. If still desired, require:
   - Formal change request
   - Trade-off analysis (what gets dropped?)
   - Updated sign-off from all leads
4. Document decision in ADR

**Scope creep response template:**

> "That objective is documented as out-of-scope for this phase. Here's why: [rationale]. 
> If priorities have changed, we can discuss a formal scope change, but that requires 
> [trade-off analysis / updated sign-off / timeline impact assessment]."

---

## Sign-off

> By signing, stakeholders agree this represents the prioritized scope for the project.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Tech Lead (BE) | | | |
| Tech Lead (FE) | | | |
| Business Stakeholder | | | |
| Project Manager | | | |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial creation |
| | | | |

---

## Copilot Assistance

Use this prompt to help prioritize objectives:

```markdown
No secrets, no production data. Use placeholders.

Based on the following list of potential features, categorize into:
- MUST (non-negotiable for go-live)
- SHOULD (highly desired, significant value)
- COULD (nice to have if time permits)
- WON'T (explicitly out of scope this phase)

Features:
<paste feature list>

For each item, provide:
1. Category assignment
2. Rationale (why this category?)
3. Suggested success criteria
4. Dependencies on other features
```
