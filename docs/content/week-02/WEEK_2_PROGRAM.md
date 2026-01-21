# Week 2 Program — Constraint Register + Spec Intake

**Stack:** OpenShift + Oracle + React Router v7 + Spring Boot  
**License:** GitHub Copilot Enterprise

---

## Week 2 Outcomes

By end of week, the team can:
- ✅ Document functional, non-functional, and integration constraints
- ✅ Define clear objective hierarchy (must/should/could/won't)
- ✅ Decompose user journeys with failure paths
- ✅ Write engineering-readable acceptance criteria
- ✅ Use Copilot Enterprise features (@workspace, #file) for spec analysis

---

## Key Resources

| Resource | Purpose |
|----------|---------|
| [PROMPT_PACK_V1.md](../../shared/reference-materials/PROMPT_PACK_V1.md) | Standard prompts (P0–P23) |
| [DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md) | Order Management business domain |
| [DEFINITION_OF_DONE.md](../../shared/reference-materials/DEFINITION_OF_DONE.md) | Completion criteria |
| [templates/](templates/) | Week 2 template files |

---

## Week 2 Prompt Focus

| Prompt | Use Case | Description |
|--------|----------|-------------|
| **P0** | All tasks | Plan-first discipline (carry forward from Week 1) |
| **P12** | Codebase exploration | `@workspace` queries to understand existing patterns |
| **P15** | Constraint extraction | Convert requirements into constraint register |

### P15 — Constraint Extraction (New This Week)

```markdown
No secrets, no production data. Use placeholders.

Based on the business requirements in <document>, extract:
1. Hard constraints (must have)
2. Soft constraints (should have)
3. Assumptions to validate
4. Risks to mitigate

Format as a constraint register table with columns:
ID | Type | Description | Source | Priority | Validation
```

---

# Day 0 (Lead Prep) — 60 minutes

**Before Day 1, the lead must:**

1. Gather all available business requirements documents
2. Identify stakeholders for constraint workshop
3. Schedule stakeholder availability for Days 1, 3, and 5
4. Review Gate 1 results and confirm all team members passed
5. Prepare blank templates from `/docs/content/week-02/templates/`
6. Set up collaborative document space (if not using repo directly)

---

# Day 1 — Kickoff + Constraint Categories

**Training:** 60 minutes | **Workshop:** 2-3 hours

## Session 1 (30 min): Week 2 Context Setting

**Key Messages:**
- Week 1 taught us HOW to use Copilot safely
- Week 2 teaches us WHAT to build (before writing code)
- "If it's not in the constraint register, it doesn't exist"

**The Problem We Solve:**
- Vague requirements → scope creep → rework
- Missing constraints discovered late → expensive changes
- Business and tech speaking different languages → misunderstandings

**The Week 2 Solution:**
- Constraint Register = single source of truth for limitations
- Objectives Map = prioritized feature list
- User Journeys = flow documentation with failure paths
- Acceptance Criteria = testable success definition

## Session 2 (30 min): Constraint Categories Deep Dive

| Category | Examples | Questions to Ask |
|----------|----------|------------------|
| **Functional** | Business rules, validation logic, workflows | What must the system DO? |
| **Non-Functional** | Performance, availability, accessibility, auditability | How must the system BEHAVE? |
| **Integration** | Systems, APIs, authentication, data sources | What must the system CONNECT to? |
| **Regulatory** | Compliance, retention, privacy, security | What RULES must we follow? |
| **Technical** | Stack constraints, existing infrastructure | What are we BUILDING ON? |
| **Organizational** | Timeline, budget, team skills | What LIMITS our approach? |

**Copilot Usage Demo:**
```markdown
@workspace Based on our domain context in docs/shared/reference-materials/DOMAIN_CONTEXT.md,
what constraints would typically apply to an Order Management system?

Consider: functional, non-functional, integration, regulatory categories.
```

## Workshop: Constraint Discovery (2-3 hours)

**Participants:** Business Stakeholders + Tech Leads + Full Team  
**Facilitator:** AI Lead (you)

**Agenda:**

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Introduction + ground rules | Aligned expectations |
| 0:15 | Functional constraints brainstorm | Draft functional list |
| 0:45 | Non-functional constraints brainstorm | Draft NFR list |
| 1:15 | Break (15 min) | — |
| 1:30 | Integration constraints brainstorm | Draft integration list |
| 2:00 | Regulatory/compliance review | Draft regulatory list |
| 2:30 | Constraint prioritization | Initial priorities |
| 2:45 | Wrap-up + next steps | Action items |

**Ground Rules:**
1. No solution talk — constraints only
2. Every constraint needs a source (who said it?)
3. If it's assumed, mark it as assumption
4. Capture disagreements as risks

**Output:** Draft [CONSTRAINT_REGISTER.md](templates/CONSTRAINT_REGISTER.md)

---

# Day 2 — Objectives Mapping + MoSCoW Prioritization

**Training:** 45 minutes | **Activity:** 2-3 hours

## Session 1 (25 min): Objective Hierarchy

**MoSCoW Method:**

| Level | Meaning | Gate Impact |
|-------|---------|-------------|
| **Must (M)** | Non-negotiable for go-live | Blocks Gate 5 if missing |
| **Should (S)** | Important, highly desired | Impacts quality gates |
| **Could (C)** | Nice to have if time permits | Optional enhancement |
| **Won't (W)** | Explicitly out of scope | Prevents scope creep |

**Why Anti-Scope Matters:**
- "Won't" is as important as "Must"
- Prevents scope creep during sprints
- Creates documented boundary for stakeholder expectations
- Gives clear answer when asked "can you also add..."

## Session 2 (20 min): Copilot for Objective Analysis

**Demo: Using P15 for objective extraction**

```markdown
No secrets, no production data. Use placeholders.

Based on the business requirements below, categorize into:
- MUST (non-negotiable for go-live)
- SHOULD (highly desired)
- COULD (nice to have)
- WON'T (explicitly out of scope for this phase)

Requirements:
<paste requirements>

For each item, explain WHY it belongs in that category.
```

## Activity: Objectives Workshop (2-3 hours)

**Participants:** Product Owner + Tech Leads + Business Stakeholders

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Review constraint register | Context setting |
| 0:15 | List all potential objectives | Raw objective list |
| 0:45 | Categorize into MoSCoW | Draft categorization |
| 1:15 | Break (15 min) | — |
| 1:30 | Challenge and validate | Refined categorization |
| 2:00 | Document anti-scope with rationale | Won't list with reasons |
| 2:30 | Final review and sign-off | Signed objectives map |

**Output:** Draft [OBJECTIVES_MAP.md](templates/OBJECTIVES_MAP.md)

---

# Day 3 — User Journey Decomposition

**Training:** 45 minutes | **Activity:** 2-3 hours

## Session 1 (25 min): Journey Anatomy

**A Complete User Journey Includes:**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY STRUCTURE                   │
├─────────────────────────────────────────────────────────────┤
│  ACTOR: Who is performing this journey?                     │
│  GOAL: What are they trying to accomplish?                  │
│  PRECONDITIONS: What must be true before starting?          │
├─────────────────────────────────────────────────────────────┤
│  HAPPY PATH (Success Steps):                                │
│    1. User does X                                           │
│    2. System responds with Y                                │
│    3. User sees Z                                           │
├─────────────────────────────────────────────────────────────┤
│  FAILURE PATHS (What Can Go Wrong):                         │
│    - If invalid input → show validation error               │
│    - If system unavailable → show graceful error            │
│    - If unauthorized → redirect to login                    │
├─────────────────────────────────────────────────────────────┤
│  POSTCONDITIONS: What is true after success?                │
│  METRICS: How do we measure success?                        │
└─────────────────────────────────────────────────────────────┘
```

**Why Failure Paths Matter:**
- Happy path is ~30% of implementation effort
- Failure handling is ~70% of implementation effort
- Undocumented failures = production bugs

## Session 2 (20 min): Copilot for Journey Analysis

**Demo: Using @workspace to understand existing patterns**

```markdown
@workspace Based on our Order Management domain, what are the 
typical user journeys for:
1. Creating an order
2. Viewing order history
3. Cancelling an order

For each journey, include:
- Actor and goal
- Success path steps
- At least 3 failure scenarios
- Edge cases to consider
```

## Activity: Journey Mapping Workshop (2-3 hours)

**Participants:** UX Lead + Product Owner + Tech Leads

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Identify 3-8 key journeys | Journey list |
| 0:30 | Map happy paths | Success flows |
| 1:00 | Break (15 min) | — |
| 1:15 | Map failure paths | Error flows |
| 1:45 | Identify edge cases | Edge case list |
| 2:15 | Review and validate | Validated journeys |
| 2:45 | Assign to FE/BE streams | Stream mapping |

**Output:** Draft [USER_JOURNEYS.md](templates/USER_JOURNEYS.md)

---

# Day 4 — Acceptance Criteria Workshop

**Training:** 45 minutes | **Activity:** 2-3 hours

## Session 1 (25 min): Engineering-Readable AC

**The Problem with Vague AC:**
- ❌ "System should be fast" → untestable
- ❌ "User can manage orders" → too broad
- ❌ "Error handling should be good" → subjective

**The Solution: Given/When/Then Format:**

```gherkin
Given [precondition — the starting state]
When [action — what the user does]
Then [outcome — what should happen]
And [additional outcomes]
```

**Example:**
```gherkin
Given a customer with a valid account
And at least one item in the catalog
When the customer creates an order with 2 items
Then the order is saved with status "pending"
And the order total equals sum of item prices
And the order creation timestamp is recorded
```

**Testable Criteria Checklist:**
- [ ] Specific (no ambiguous terms)
- [ ] Measurable (can verify pass/fail)
- [ ] Achievable (technically possible)
- [ ] Relevant (traces to objective)
- [ ] Time-bound (if applicable)

## Session 2 (20 min): Copilot for AC Generation

**Demo: Converting journey to AC**

```markdown
No secrets, no production data. Use placeholders.

Convert this user journey into acceptance criteria using Given/When/Then format:

Journey: Create Order
1. Customer selects items
2. Customer submits order
3. System calculates total
4. System saves order
5. Customer sees confirmation

Include criteria for:
- Happy path success
- Invalid input handling
- System error handling
- Edge cases (empty cart, max items, etc.)
```

## Activity: AC Writing Workshop (2-3 hours)

**Participants:** QA Lead + Product Owner + Tech Leads

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Select 3-5 journeys to detail | Focus list |
| 0:15 | Write happy path AC | Success criteria |
| 0:45 | Write failure path AC | Error criteria |
| 1:15 | Break (15 min) | — |
| 1:30 | Review for testability | Refined criteria |
| 2:00 | Map AC to test types | Test mapping |
| 2:30 | Final review | Complete AC set |

**Test Type Mapping:**

| AC Type | Test Type | Owner |
|---------|-----------|-------|
| Happy path | E2E test | QA |
| Validation | Unit test | Dev |
| Integration | Integration test | Dev |
| Error handling | Unit + E2E test | Dev + QA |

**Output:** Draft [ACCEPTANCE_CRITERIA.md](templates/ACCEPTANCE_CRITERIA.md)

---

# Day 5 — Gate 2 Review + Stakeholder Sign-off

**Review:** 2-3 hours | **Sign-off:** 1 hour

## Morning: Internal Review (2 hours)

**Review Checklist:**

| Document | Reviewer | Criteria |
|----------|----------|----------|
| Constraint Register | Tech Leads | All categories covered, no gaps |
| Objectives Map | Product Owner | MoSCoW complete, anti-scope clear |
| User Journeys | UX + QA | 3-8 journeys with failure paths |
| Acceptance Criteria | QA Lead | All testable, consistent format |

**Common Issues to Fix:**
- Missing "Won't" items (anti-scope)
- Vague constraints without validation method
- Journeys without failure paths
- AC that can't be tested

## Afternoon: Stakeholder Sign-off (1 hour)

**Participants:** All Leads + Key Stakeholders

**Agenda:**

| Time | Activity |
|------|----------|
| 0:00 | Present Constraint Register summary |
| 0:15 | Present Objectives Map (MoSCoW) |
| 0:30 | Present key User Journeys |
| 0:40 | Present AC format and examples |
| 0:50 | Q&A and clarifications |
| 0:55 | Sign-off collection |

**Sign-off Process:**
1. Each lead signs their area of responsibility
2. Product Owner signs objectives map
3. Tech Leads sign constraint register
4. All signatures collected in Gate 2 approval record

## Gate 2 Criteria Checklist

**Requirements are "engineering-readable," not just "business-readable":**

- [ ] Constraint Register complete (all 6 categories reviewed)
- [ ] Objectives prioritized (Must/Should/Could/Won't)
- [ ] Anti-scope documented with rationale
- [ ] 3-8 user journeys documented with failure paths
- [ ] Acceptance criteria in Given/When/Then format
- [ ] All AC are testable (can write a test for each)
- [ ] Reviewed by both business and tech leads
- [ ] Sign-off signatures collected

---

## Week 2 Copilot Enterprise Features

### Features to Master This Week

| Feature | Use Case | Example |
|---------|----------|---------|
| `@workspace` | Query codebase for patterns | `@workspace How do we handle errors currently?` |
| `#file` | Reference specific document | `#file docs/shared/reference-materials/DOMAIN_CONTEXT.md explain the Order entity` |
| `P15` | Extract constraints | Convert requirements doc to register format |

### Enterprise Feature Progression

```
Week 1: Inline Completions + Chat + Safety
         ↓
Week 2: @workspace + #file + P15 Constraint Extraction  ← YOU ARE HERE
         ↓
Week 3: P16 ADR Generation + P17 OpenAPI
         ↓
Week 4: PR Summaries + Code Review + Contract Lock
```

---

## Week 2 Artifacts Summary

| Artifact | Template | Status After Week 2 |
|----------|----------|---------------------|
| Constraint Register | [CONSTRAINT_REGISTER.md](templates/CONSTRAINT_REGISTER.md) | Complete, signed |
| Objectives Map | [OBJECTIVES_MAP.md](templates/OBJECTIVES_MAP.md) | Complete, signed |
| User Journeys | [USER_JOURNEYS.md](templates/USER_JOURNEYS.md) | 3-8 journeys documented |
| Acceptance Criteria | [ACCEPTANCE_CRITERIA.md](templates/ACCEPTANCE_CRITERIA.md) | Complete, testable |

---

## Example Schedule (Flexible)

| Day | Morning (2-3 hrs) | Afternoon (2-3 hrs) |
|-----|-------------------|---------------------|
| **Day 1** | Training: Constraint Categories | Workshop: Constraint Discovery |
| **Day 2** | Training: Objectives + MoSCoW | Workshop: Objectives Mapping |
| **Day 3** | Training: Journey Anatomy | Workshop: Journey Mapping |
| **Day 4** | Training: AC Format | Workshop: AC Writing |
| **Day 5** | Internal Review | Stakeholder Sign-off + Gate 2 |

---

## Next: Week 3

After completing Gate 2, proceed to [Week 3: Spec-First Packaging](../week-03/README.md)

Week 3 Focus:
- Architecture Decision Records (ADRs)
- System Specification
- Project Constitution
- Security Architecture
