# Week 3 Program — Spec-First Packaging + ADRs

**Stack:** OpenShift + Oracle + React Router v7 + Spring Boot  
**License:** GitHub Copilot Enterprise

---

## Week 3 Outcomes

By end of week, the team has:
- ✅ Project Constitution defining technical standards and boundaries
- ✅ System Spec as single source of truth for scope and rules
- ✅ ADR set documenting cross-team architectural decisions
- ✅ Security architecture model defined
- ✅ Stable foundation for parallel FE/BE implementation

---

## Key Resources

| Resource | Purpose |
|----------|---------|
| [PROMPT_PACK_V1.md](../../shared/reference-materials/PROMPT_PACK_V1.md) | Standard prompts (P0–P23) |
| [DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md) | Order Management business domain |
| [Constraint Register](../week-02/templates/CONSTRAINT_REGISTER.md) | Week 2 constraints (input) |
| [Acceptance Criteria](../week-02/templates/ACCEPTANCE_CRITERIA.md) | Week 2 AC (input) |
| [templates/](templates/) | Week 3 template files |
| [adrs/](adrs/) | Architecture Decision Records |

---

## Week 3 Prompt Focus

| Prompt | Use Case | Description |
|--------|----------|-------------|
| **P0** | All tasks | Plan-first discipline (carry forward) |
| **P12** | Codebase exploration | `@workspace` queries to understand patterns |
| **P13** | Code review | Review existing code for pattern adherence |
| **P16** | ADR generation | Generate Architecture Decision Records |

### P16 — ADR Generation (New This Week)

```markdown
No secrets, no production data. Use placeholders.

Context: We need to decide <decision topic>

Generate an Architecture Decision Record:
1. Title (ADR-XXX: <concise decision name>)
2. Status (proposed/accepted/deprecated/superseded)
3. Context (why this decision is needed)
4. Decision (what we decided)
5. Options Considered (3+ with pros/cons matrix)
6. Consequences (positive, negative, risks)
7. Related Decisions (links to other ADRs)

Follow the template in docs/content/week-03/adrs/000-template.md
```

---

# Day 0 (Lead Prep) — 60 minutes

**Before Day 1, the lead must:**

1. Review Week 2 deliverables (Constraint Register, Objectives Map, User Journeys, AC)
2. Identify key architectural decisions that need to be made
3. Schedule tech lead availability for all 5 days
4. Prepare blank templates from `/docs/content/week-03/templates/`
5. Review existing codebase patterns (if any) for constitution alignment
6. Confirm Gate 2 was passed and all sign-offs collected

---

# Day 1 — Project Constitution: Standards + Boundaries

**Training:** 45 minutes | **Workshop:** 2-3 hours

## Session 1 (25 min): What is a Project Constitution?

**Definition:** A Project Constitution is the technical "bill of rights" that defines:
- What we WILL do (standards, patterns, conventions)
- What we WON'T do (anti-patterns, prohibited approaches)
- How we'll VERIFY compliance (automated checks, reviews)

**Why It Matters:**
- Prevents "architecture by accident"
- Enables parallel work without constant sync
- Creates reviewable criteria for PRs
- Reduces bikeshedding on style decisions

**Constitution vs Other Documents:**

| Document | Focus | Audience |
|----------|-------|----------|
| Constraint Register | What limits us | All stakeholders |
| Project Constitution | How we build | Developers |
| System Spec | What we build | Product + Tech |
| ADRs | Why we chose X | Future maintainers |

## Session 2 (20 min): Constitution Categories

| Category | What to Define | Example |
|----------|----------------|---------|
| **Architecture Boundaries** | Layer responsibilities, allowed dependencies | "Services never call controllers" |
| **Code Standards** | Naming, formatting, documentation | "Use PascalCase for classes" |
| **Testing Standards** | Coverage, test types, responsibilities | "70% unit coverage minimum" |
| **Logging/Telemetry** | What to log, format, levels | "Structured JSON, correlation IDs" |
| **Security Posture** | Auth patterns, data handling | "Never log PII" |
| **Accessibility** | WCAG level, testing | "WCAG 2.1 AA mandatory" |
| **Performance** | Response time targets | "API p95 < 500ms" |
| **Error Handling** | Error model, user messages | "RFC 7807 Problem Details" |

## Workshop: Constitution Drafting (2-3 hours)

**Participants:** FE Lead + BE Lead + Architect (+ Security Lead if available)

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Review constraint register for technical constraints | Context |
| 0:15 | Define architecture boundaries (layers, dependencies) | Boundary rules |
| 0:45 | Define code standards (naming, formatting) | Style rules |
| 1:15 | Break (15 min) | — |
| 1:30 | Define testing standards (coverage, responsibilities) | Test rules |
| 2:00 | Define logging/security/accessibility standards | Cross-cutting rules |
| 2:30 | Define error handling and performance standards | Quality rules |
| 2:45 | Review and prioritize enforcement mechanisms | Enforcement plan |

**Output:** Draft [PROJECT_CONSTITUTION.md](templates/PROJECT_CONSTITUTION.md)

---

# Day 2 — ADR Workshop: Key Architectural Decisions

**Training:** 45 minutes | **Workshop:** 2-3 hours

## Session 1 (25 min): What Makes a Good ADR?

**ADR = Architecture Decision Record**

A good ADR captures:
1. **Context** — Why we needed to decide (not just what)
2. **Options** — What we considered (at least 3)
3. **Decision** — What we chose and WHY
4. **Consequences** — What this means for the project

**When to Write an ADR:**
- Decision affects both FE and BE teams
- Decision is hard/expensive to reverse
- Decision will be questioned in 6 months
- Decision has security or compliance implications

**ADR Status Lifecycle:**
```
proposed → accepted → [deprecated | superseded by ADR-XXX]
```

## Session 2 (20 min): Copilot for ADR Generation

**Demo: Using P16 to draft an ADR**

```markdown
No secrets, no production data. Use placeholders.

Context: We need to decide how to handle authentication in our Order Management system.

Our constraints:
- Must integrate with enterprise SSO (OAuth 2.0)
- Must support role-based access control
- Must work with both FE (React) and BE (Spring Boot)
- Must be stateless for horizontal scaling

Generate an ADR with:
1. Context (why this decision matters)
2. 3+ options with pros/cons
3. Recommended decision with rationale
4. Consequences (positive and negative)

Follow the template format in our ADR docs.
```

## Workshop: ADR Drafting (2-3 hours)

**Participants:** FE Lead + BE Lead + Architect

**Key ADRs to Create:**

| ADR | Decision Topic | Owner |
|-----|----------------|-------|
| ADR-001 | Authentication Approach | Security/BE Lead |
| ADR-002 | Error Handling Model | BE Lead |
| ADR-003 | API Versioning Strategy | BE Lead |
| ADR-004 | UI State Management | FE Lead |
| ADR-005 | Database Access Patterns | BE Lead |
| ADR-006 | Logging and Audit Format | BE Lead |

**Workshop Agenda:**

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | List decisions that need ADRs | Decision list |
| 0:15 | Draft ADR-001: Authentication | Auth ADR |
| 0:45 | Draft ADR-002: Error Handling | Error ADR |
| 1:15 | Break (15 min) | — |
| 1:30 | Draft ADR-003: API Versioning | Versioning ADR |
| 2:00 | Draft ADR-004: UI State Management | State ADR |
| 2:30 | Review all ADRs for consistency | Reviewed set |

**Output:** Draft ADRs in [adrs/](adrs/) folder

---

# Day 3 — System Specification: Scope + Rules

**Training:** 45 minutes | **Workshop:** 2-3 hours

## Session 1 (25 min): System Spec Structure

**A System Spec answers:** "What are we building and how does it behave?"

| Section | Contents | Source |
|---------|----------|--------|
| Scope Statement | What's in/out | Objectives Map (Week 2) |
| Personas | Who uses the system | User research |
| User Journeys | Key flows | User Journeys (Week 2) |
| Business Rules | Domain logic | Stakeholder input |
| Non-Functional Requirements | Quality attributes | Constraint Register (Week 2) |
| Data Model | Entity relationships | Domain Context |
| Integration Points | External systems | Constraint Register (Week 2) |

**Relationship to Other Documents:**

```
Constraint Register (Week 2)
         ↓
┌────────────────────────┐
│    System Spec (Week 3)│ ← Single source of truth
└────────────────────────┘
         ↓
OpenAPI Contract (Week 4)
```

## Session 2 (20 min): Pulling from Week 2

**Mapping Week 2 → System Spec:**

| Week 2 Deliverable | System Spec Section |
|--------------------|---------------------|
| Objectives Map (Must) | Scope: In Scope |
| Objectives Map (Won't) | Scope: Out of Scope |
| User Journeys | User Journeys section |
| Acceptance Criteria | Business Rules + NFRs |
| Constraint Register (NFR) | Non-Functional Requirements |
| Constraint Register (Integration) | Integration Points |

## Workshop: System Spec Drafting (2-3 hours)

**Participants:** Product Owner + Tech Leads + Business Analyst

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Write scope statement (in/out) | Scope section |
| 0:20 | Define personas | Personas section |
| 0:40 | Import user journeys from Week 2 | Journeys section |
| 1:00 | Break (15 min) | — |
| 1:15 | Extract business rules from AC | Rules section |
| 1:45 | Consolidate NFRs from constraints | NFR section |
| 2:15 | Document integration points | Integration section |
| 2:45 | Review for completeness | Complete draft |

**Output:** Draft [SYSTEM_SPEC.md](templates/SYSTEM_SPEC.md)

---

# Day 4 — Security Architecture + API Design Principles

**Training:** 60 minutes | **Workshop:** 2 hours

## Session 1 (30 min): Security Architecture Model

**Security Layers:**

```
┌─────────────────────────────────────────────────────┐
│                    PRESENTATION                      │
│  (React Router v7: CORS, CSP, XSS prevention)       │
├─────────────────────────────────────────────────────┤
│                    API GATEWAY                       │
│  (Rate limiting, JWT validation, request logging)   │
├─────────────────────────────────────────────────────┤
│                    APPLICATION                       │
│  (Spring Security: Auth, AuthZ, input validation)   │
├─────────────────────────────────────────────────────┤
│                    DATA ACCESS                       │
│  (JPA: SQL injection prevention, audit logging)     │
├─────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                    │
│  (OpenShift: Network policies, secrets management)  │
└─────────────────────────────────────────────────────┘
```

**Security Checklist by Layer:**

| Layer | Controls |
|-------|----------|
| Presentation | HTTPS only, CSP headers, no sensitive data in URL |
| API | JWT validation, rate limiting, request correlation |
| Application | Input validation, authorization checks, audit events |
| Data | Encryption at rest, parameterized queries, PII masking |
| Infrastructure | Network isolation, secret rotation, access logging |

## Session 2 (30 min): API Design Principles

**REST API Standards:**

| Principle | Our Standard |
|-----------|--------------|
| URL Structure | `/api/v1/{resource}` (plural nouns) |
| HTTP Methods | GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove) |
| Status Codes | 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error) |
| Error Format | RFC 7807 Problem Details |
| Pagination | `?page=1&size=20` with Link headers |
| Versioning | URL path (`/v1/`) — see ADR-003 |
| Content Type | `application/json` |

**Problem Details Example (RFC 7807):**

```json
{
  "type": "https://api.example.com/problems/order-not-found",
  "title": "Order Not Found",
  "status": 404,
  "detail": "Order with ID 12345 does not exist",
  "instance": "/api/v1/orders/12345",
  "timestamp": "2026-01-20T10:30:00Z",
  "traceId": "abc123"
}
```

## Workshop: Security + API Review (2 hours)

**Participants:** Security Lead + BE Lead + FE Lead

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Review security layers | Security model |
| 0:30 | Map controls to constraints | Control mapping |
| 1:00 | Review API design principles | API standards |
| 1:30 | Identify gaps in ADRs | Additional ADRs needed |

**Output:** Security section in System Spec, API guidelines in Constitution

---

# Day 5 — Gate 3 Review + Architecture Sign-off

**Review:** 2 hours | **Sign-off:** 1 hour

## Morning: Internal Review (2 hours)

**Review Checklist:**

| Document | Reviewer | Criteria |
|----------|----------|----------|
| Project Constitution | FE + BE Leads | All sections complete, enforceable |
| System Spec | Product Owner | Scope clear, rules testable |
| ADRs | Architect | Context clear, consequences documented |
| Security Model | Security Lead | All layers addressed |

**Common Issues to Fix:**
- Constitution rules too vague to enforce
- System Spec missing NFRs from Constraint Register
- ADRs missing consequences section
- Security model missing a layer

## Afternoon: Architecture Sign-off (1 hour)

**Participants:** All Leads + Architect + Security Lead

**Agenda:**

| Time | Activity |
|------|----------|
| 0:00 | Present Project Constitution summary |
| 0:15 | Present System Spec scope and rules |
| 0:25 | Walk through key ADRs |
| 0:40 | Security architecture review |
| 0:50 | Q&A and clarifications |
| 0:55 | Sign-off collection |

**Sign-off Process:**
1. Architect signs overall architecture
2. Security Lead signs security model
3. FE Lead signs FE-related decisions
4. BE Lead signs BE-related decisions
5. All signatures collected in Gate 3 approval record

## Gate 3 Criteria Checklist

**"We have a stable spine; implementation can begin without guessing":**

- [ ] Project Constitution approved by tech leads
- [ ] All sections have enforcement mechanisms defined
- [ ] System Spec reviewed by business and tech leads
- [ ] Scope (in/out) explicitly stated
- [ ] NFRs consolidated from Constraint Register
- [ ] Key ADRs documented and approved:
  - [ ] ADR-001: Authentication Approach
  - [ ] ADR-002: Error Handling Model
  - [ ] ADR-003: API Versioning Strategy
  - [ ] ADR-004: UI State Management
- [ ] Security architecture model defined
- [ ] Both FE and BE leads aligned on patterns
- [ ] No open questions blocking Sprint 1 implementation

---

## Week 3 Copilot Enterprise Features

### Features to Master This Week

| Feature | Use Case | Example |
|---------|----------|---------|
| `@workspace` | Query existing patterns | `@workspace How do we structure services?` |
| `#file` | Reference specific document | `#file docs/content/week-02/templates/CONSTRAINT_REGISTER.md` |
| `P16` | Generate ADRs | Draft decision records from context |
| `P13` | Code review | Verify code matches constitution |

### Enterprise Feature Progression

```
Week 1: Inline Completions + Chat + Safety
         ↓
Week 2: @workspace + #file + P15 Constraint Extraction
         ↓
Week 3: P16 ADR Generation + P13 Code Review  ← YOU ARE HERE
         ↓
Week 4: P17 OpenAPI Generation + PR Summaries
```

---

## Week 3 Artifacts Summary

| Artifact | Template | Status After Week 3 |
|----------|----------|---------------------|
| Project Constitution | [PROJECT_CONSTITUTION.md](templates/PROJECT_CONSTITUTION.md) | Approved, signed |
| System Spec | [SYSTEM_SPEC.md](templates/SYSTEM_SPEC.md) | Approved, signed |
| ADR-001: Authentication | [adrs/001-authentication.md](adrs/001-authentication.md) | Accepted |
| ADR-002: Error Handling | [adrs/002-error-handling.md](adrs/002-error-handling.md) | Accepted |
| ADR-003: API Versioning | [adrs/003-api-versioning.md](adrs/003-api-versioning.md) | Accepted |
| ADR-004: UI State | [adrs/004-ui-state-management.md](adrs/004-ui-state-management.md) | Accepted |

---

## Example Schedule (Flexible)

| Day | Morning (2-3 hrs) | Afternoon (2-3 hrs) |
|-----|-------------------|---------------------|
| **Day 1** | Training: Constitution Structure | Workshop: Constitution Drafting |
| **Day 2** | Training: ADR Best Practices | Workshop: ADR Writing |
| **Day 3** | Training: System Spec Structure | Workshop: System Spec Drafting |
| **Day 4** | Training: Security + API Design | Workshop: Security Review |
| **Day 5** | Internal Review | Architecture Sign-off + Gate 3 |

---

## Next: Week 4

After completing Gate 3, proceed to [Week 4: Contract-First](../week-04/README.md)

Week 4 Focus:
- OpenAPI contract finalization
- Mock server setup
- Domain glossary
- FE/BE contract lock ceremony
