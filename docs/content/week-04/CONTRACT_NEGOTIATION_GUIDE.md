# Contract Negotiation Guide

> Techniques for FE/BE alignment during API contract design.

---

## Overview

This guide provides strategies for resolving disagreements and achieving consensus on API contract design between Frontend and Backend teams.

---

## Negotiation Principles

### 1. Contract is the Source of Truth

Once locked, the OpenAPI contract is authoritative:
- FE implements against the contract
- BE implements to satisfy the contract
- Disagreements resolved by consulting the contract
- Changes require formal approval

### 2. Consumer-Driven Design

API design should favor the consumer (usually FE):
- Field names should be FE-friendly (they appear directly in code)
- Response shapes should match UI needs
- Pagination should support the UI pattern (infinite scroll OR pages)
- Error responses should be actionable in the UI

### 3. Explicit Over Implicit

Everything must be documented in the contract:
- Required vs optional fields
- Null vs absent vs empty
- All error codes and when they occur
- Examples for all schemas

### 4. Time-Boxed Decisions

Don't let API debates block progress:
- 15 minutes max per topic
- Document pros/cons quickly
- Tech Lead decides if no consensus
- Record decision and move on

---

## Common Negotiation Topics

### Field Naming

| Topic | FE Preference | BE Preference | Resolution |
|-------|---------------|---------------|------------|
| Case | camelCase | snake_case | API uses camelCase, BE maps internally |
| Booleans | `active` | `isActive`, `is_active` | Drop `is` prefix in API |
| IDs | `orderId` | `order_id` | Use `orderId` in API |
| Timestamps | `createdAt` | `created_timestamp` | Use `createdAt` (shorter, cleaner) |
| Collections | `items` | `item_list` | Use `items` (plural noun) |

**Rule of Thumb:** API field names should be FE-friendly since FE code uses them directly.

---

### Response Shapes

**FE wants nested object (easy to use):**
```json
{
  "order": {
    "id": "ORD-001",
    "customer": {
      "id": "CUST-001",
      "name": "John Doe"
    }
  }
}
```

**BE wants flat with IDs (simpler to implement):**
```json
{
  "orderId": "ORD-001",
  "customerId": "CUST-001"
}
```

**Resolution Options:**

1. **Query Parameter Expansion:**
   ```
   GET /orders/ORD-001?expand=customer
   ```
   - Default: IDs only (BE friendly)
   - Optional: Nested objects (FE friendly when needed)

2. **Separate Endpoints:**
   - `/orders/{id}` returns order with customer ID
   - `/orders/{id}/customer` returns customer details
   - More RESTful but more requests

3. **Always Expand (FE wins):**
   - Include nested objects by default
   - Simple for FE, more work for BE
   - Consider performance implications

---

### Pagination Styles

| Style | FE Use Case | BE Complexity | When to Use |
|-------|-------------|---------------|-------------|
| **Offset** (`?page=2&size=20`) | Page numbers, jump to page | Simple, but slow at scale | Small datasets, page navigation UI |
| **Cursor** (`?cursor=xyz`) | Infinite scroll | More complex, scales well | Large datasets, mobile apps |
| **Keyset** (`?after_id=123`) | Infinite scroll | Medium, good performance | Real-time feeds, sorted lists |

**Decision Criteria:**
- UI shows page numbers → Offset pagination
- UI uses infinite scroll → Cursor pagination
- Dataset < 10,000 items → Either works
- Dataset > 10,000 items → Cursor recommended

---

### Null vs Absent vs Empty

**Define explicitly in the contract:**

| Situation | JSON | Meaning | When to Use |
|-----------|------|---------|-------------|
| Field not applicable | Absent | Don't include in response | Optional fields when null |
| Field applicable but no value | `null` | Explicitly null | Nullable required fields |
| Empty collection | `[]` | Empty but present | Always include collections |
| Empty string | `""` | Empty but present | Avoid - use null instead |

**Document in OpenAPI:**
```yaml
properties:
  cancellationReason:
    type: string
    nullable: true
    description: |
      Reason provided when order was cancelled.
      Null if order has not been cancelled.
```

**Consistency Rule:** Pick one convention and apply it everywhere.

---

### Error Response Format

**Always use RFC 7807 Problem Details:**

```json
{
  "type": "https://api.example.com/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "Request validation failed",
  "instance": "/api/v1/orders",
  "traceId": "abc123",
  "violations": [
    { "field": "customerId", "message": "must not be null" }
  ]
}
```

**Non-Negotiable Elements:**
- `type`: URI identifying the error type
- `title`: Human-readable summary
- `status`: HTTP status code
- `detail`: Specific explanation

**Optional Extensions:**
- `traceId`: For debugging
- `violations`: For validation errors (400)
- Custom fields as needed

---

## Negotiation Process

### Step 1: Draft Independently (30 min)

Each team prepares their view:
- **FE drafts** endpoints needed for UI
- **BE drafts** endpoints based on domain model
- Both document assumptions

### Step 2: Compare and Discuss (45 min)

Use a comparison table:

| Endpoint | FE Draft | BE Draft | Gap | Resolution |
|----------|----------|----------|-----|------------|
| List orders | GET /orders | GET /orders | ✅ Match | Agreed |
| Filter by status | ?status=Pending | ?filter[status]=Pending | Format differs | Use FE format |
| Include customer | ?expand=customer | Separate endpoint | Approach differs | Add expand param |
| Create order | POST /orders → 201 | POST /orders → 200 | Status code | Use 201 |

### Step 3: Resolve Conflicts (30 min)

For each conflict:
1. State both positions clearly
2. List pros/cons of each
3. Consider user experience impact
4. Tech Lead decides if no consensus in 5 min
5. Document decision with rationale

### Step 4: Document Final Contract (15 min)

- Write OpenAPI specification
- Add examples for all schemas
- Add descriptions explaining decisions
- Generate mocks immediately

---

## Red Flags in Negotiation

| Red Flag | Problem | Solution |
|----------|---------|----------|
| "We'll figure it out later" | Deferred decisions become blocking issues | Decide now, document why |
| "Just return everything" | Over-fetching, performance issues | Define exactly what's needed |
| "Use the DB column names" | API leaks implementation details | Map to clean API names |
| "It depends" | Ambiguity leads to bugs | Make it explicit in contract |
| "That's a BE/FE problem" | Blame game, no ownership | Solve together at contract level |
| "This is how we've always done it" | Legacy constraints imposed | Question if still valid |

---

## Contract Lock Ceremony

### Purpose

Mark the moment when the contract is finalized and parallel work begins.

### Ceremony Agenda (30 min)

1. **Recap** (5 min)
   - Summarize contract contents
   - List all endpoints and schemas
   - Highlight any known limitations

2. **Final Review** (10 min)
   - Last chance for changes
   - Review any open questions
   - Address concerns

3. **Sign-off** (5 min)
   - Both Tech Leads approve
   - Record in meeting notes
   - Celebrate the milestone

4. **Lock** (2 min)
   - Tag/version the contract
   - Create git tag: `contract-v1.0.0`
   - Update README with lock date

5. **Next Steps** (8 min)
   - Distribute to all developers
   - Confirm MSW handlers ready
   - Confirm contract tests ready
   - Set up integration sync schedule

### Post-Lock Rules

| Change Type | Process | Approval Needed |
|-------------|---------|-----------------|
| **Additive** | Add to contract, notify team | FE Lead only |
| **Bug Fix** | Fix in place, update version | Both Leads |
| **Breaking** | Change Request + Impact Analysis | Both Leads + PO |

---

## Change Request Process

After Contract Lock, breaking changes require formal approval.

### Change Request Template

```markdown
# Contract Change Request

**Requester:** [Name]
**Date:** [Date]
**Severity:** Breaking / Additive / Bug Fix

## Current State
[What the contract says now]

## Proposed Change
[What you want to change]

## Reason
[Why this change is needed]

## Impact Analysis
- **FE Impact:** [What FE work is affected]
- **BE Impact:** [What BE work is affected]
- **Timeline Impact:** [Estimated delay]

## Alternatives Considered
1. [Alternative 1 and why rejected]
2. [Alternative 2 and why rejected]

## Approval

| Role | Name | Date | Approved |
|------|------|------|----------|
| FE Tech Lead | | | ☐ |
| BE Tech Lead | | | ☐ |
| Product Owner | | | ☐ (if timeline affected) |
```

### Approval Criteria

- **Additive changes:** FE Lead only (BE can add without disruption)
- **Breaking changes affecting FE:** Both Tech Leads
- **Breaking changes affecting timeline:** Both Tech Leads + PO

---

## Facilitation Tips

### For the Moderator

1. **Set ground rules** at the start
   - "We're here to agree, not to win"
   - "15 minutes max per topic"
   - "Tech Lead breaks ties"

2. **Keep discussion focused**
   - Redirect tangents: "Let's capture that for later"
   - Time-box: "We have 5 more minutes on this"
   - Summarize: "So we're saying..."

3. **Capture decisions immediately**
   - Document in real-time
   - Read back the decision
   - Get verbal confirmation

4. **Escalate when stuck**
   - "We've spent 15 minutes. Tech Leads, please decide."
   - Record the decision and move on

### For Participants

1. **Come prepared**
   - Draft your endpoints before the meeting
   - Know what your team needs
   - Have examples ready

2. **Focus on outcomes**
   - "What does the user need?"
   - "What's simplest for both teams?"
   - "What's industry standard?"

3. **Be willing to compromise**
   - Pick your battles
   - Accept decisions and move on
   - Don't relitigate

---

## Quick Reference: Common Resolutions

| Topic | Default Resolution |
|-------|-------------------|
| Field naming case | camelCase in API |
| Boolean prefix | No `is_` prefix |
| List pagination | Offset for pages, cursor for infinite scroll |
| Expansion | Query param `?expand=related` |
| Error format | RFC 7807 Problem Details |
| Status codes | POST→201, DELETE→204, success→200 |
| Null handling | Absent if optional and null |
| Timestamps | ISO 8601 with timezone (Z suffix) |
| IDs | UUID format, string type |
| API versioning | Path-based: `/v1/` |
