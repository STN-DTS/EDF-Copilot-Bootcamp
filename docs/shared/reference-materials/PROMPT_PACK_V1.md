# Prompt Pack v1 (Team Standard Prompts)

## How to Use This Pack

Each prompt template includes:
- **Safety prefix** (mandatory)
- **Context** (paths, domain, constraints)
- **Goal** (what must be true when done)
- **Output location** (where files should go)
- **Verification** (how to prove it works)

**Always customize the placeholders** (marked with `<angle brackets>`).

---

## Output Location (MANDATORY for Labs)

All generated code must be placed in your working folder:
```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
```

Include this in every prompt to ensure Copilot knows where to place files.

---

## P0 — Plan Only (Mandatory First Step)

```
No secrets, no production data. Use placeholders.

Context:
- Relevant paths: <paths>
- Domain: Order Management (see docs/ai/DOMAIN_CONTEXT.md)

Goal:
- <what must be true when done>

Constraints:
- Small diff; no unrelated refactor; follow repo instructions.
- Output location: /working/{frontend|backend}/<name>_<timestamp>/

Verification:
- Identify build/test/lint commands to run.

Step 1: Provide a plan only:
- Files to create/change
- Steps (numbered)
- Risks
- Tests to add/run

Wait for my approval before writing code.
```

---

## P1 — Scaffold a Feature (Small, Guided)

```
No secrets, no production data. Use placeholders.

Context:
- Paths: <paths and patterns>
- Domain: Order Management (Orders, Customers, Items)

Goal: <feature description>

Acceptance criteria:
- <bullet 1>
- <bullet 2>
- <bullet 3>

Constraints:
- Modify only <paths>
- Small diff
- Output location: /working/{frontend|backend}/<name>_<timestamp>/

Verification: <tests/commands>

Start with a plan, then implement in 2–3 small steps, stopping for review after each step.
```

---

## P2 — Tests from Acceptance Criteria (Tests-First)

```
No secrets, no production data. Use placeholders.

Context:
- Domain: Order Management (see docs/ai/DOMAIN_CONTEXT.md)
- Test framework: <Vitest/JUnit 5>

Convert these acceptance criteria into:
1) Test cases list (describe what each test verifies)
2) Actual tests in our framework

Acceptance criteria:
- <bullet 1>
- <bullet 2>
- <bullet 3>

Output location: /working/{frontend|backend}/<name>_<timestamp>/test/

Then implement the minimal code to make the tests pass.
Place implementation in: /working/{frontend|backend}/<name>_<timestamp>/src/
```

---

## P3 — Bug Fix (Repro-Driven)

```
No secrets, no production data. Use placeholders.

Bug:
- Observed: <what happens>
- Expected: <what should happen>
- Repro steps: <steps>
- Suspected area: <paths>

Provide:
1) Root cause hypothesis
2) Small fix plan
3) Tests to prevent regression

Output location: /working/{frontend|backend}/<name>_<timestamp>/

Then implement.
```

---

## P4 — Guarded Refactor (No Behavior Change)

```
No secrets, no production data. Use placeholders.

Refactor request:
- Target file/module: <path>
- Objective: <reduce duplication / improve readability / isolate logic>

Constraints:
- Do NOT change external behavior
- Do NOT rename public APIs
- Touch only <paths>
- Output location: /working/{frontend|backend}/<name>_<timestamp>/

Verification:
- Ensure all existing tests pass
- Add one new test if behavior was ambiguous

Start with smallest safe plan + risks.
```

---

## P5 — Explain Code + Cite Source Files

```
No secrets, no production data. Use placeholders.

Explain how <module/feature> works and cite the exact files where each behavior is implemented.

Focus on:
- Entry points
- Data flow
- Error handling
- Key dependencies

If anything is uncertain, say so and propose how to confirm.
```

---

## P6 — Oracle Repository (Spring Data JPA)

```
No secrets, no production data. Use placeholders.

Context: Spring Boot + Oracle + Spring Data JPA
Domain: Order Management (see docs/ai/DOMAIN_CONTEXT.md)

Goal: Create repository for <entity> (e.g., Order, Customer, Item)

Constraints:
- Use Spring Data JPA repositories
- Include Oracle-specific query hints if pagination >1000 rows
- Use @Transactional appropriately
- Follow naming: <Entity>Repository interface

Acceptance criteria:
- CRUD methods work
- Custom queries use @Query with named parameters (prevent SQL injection)
- Tests use <Testcontainers/H2/dev DB — per repo decision>

Output location: /working/backend/<name>_<timestamp>/src/
Test location: /working/backend/<name>_<timestamp>/test/
```

---

## P7 — Service Layer (Spring Boot)

```
No secrets, no production data. Use placeholders.

Context: Spring Boot + Oracle
Domain: Order Management (see docs/ai/DOMAIN_CONTEXT.md)

Goal: Implement service for <entity>

Constraints:
- Service must be stateless
- Use constructor injection
- Handle exceptions with Problem Details (RFC 7807)

Acceptance criteria:
- All business logic in service (not in controller)
- Unit tests for all public methods

Output location: /working/backend/<name>_<timestamp>/src/services/
Test location: /working/backend/<name>_<timestamp>/test/
```

---

## P8 — Controller Layer (Spring Boot)

```
No secrets, no production data. Use placeholders.

Context: Spring Boot + Oracle
Domain: Order Management (see docs/ai/DOMAIN_CONTEXT.md)

Goal: Implement REST controller for <entity>

Constraints:
- Use @RestController
- Map endpoints to service methods
- Return Problem Details for errors (RFC 7807)

Acceptance criteria:
- Endpoints match OpenAPI spec (if exists)
- Integration tests for all endpoints

Output location: /working/backend/<name>_<timestamp>/src/controllers/
Test location: /working/backend/<name>_<timestamp>/test/
```

---

## P9 — React Router v7 Route (Frontend)

```
No secrets, no production data. Use placeholders.

Context: React 18 + React Router v7
Domain: Order Management (see docs/ai/DOMAIN_CONTEXT.md)

Goal: Create route for <feature> (e.g., /orders, /orders/:id)

Constraints:
- Use RRv7 loader/action conventions
- Implement loading/success/error states
- Use Problem Details error shape for API errors
- Follow existing patterns in src/routes/

Acceptance criteria:
- Route handles loading state
- Route handles success state with data display
- Route handles error state with user-friendly message
- Test covers all three states

Output location: /working/frontend/<name>_<timestamp>/src/routes/
Test location: /working/frontend/<name>_<timestamp>/test/
```

---

## P10 — Accessibility Check (WCAG 2.1 AA)

```
No secrets, no production data. Use placeholders.

Review this component/page for WCAG 2.1 AA compliance:

Component: <path or code>

Check for:
- Keyboard navigation (can all interactive elements be reached?)
- Screen reader labels (aria-label, aria-labelledby, aria-describedby)
- Color contrast (4.5:1 for normal text, 3:1 for large text)
- Focus indicators (visible focus ring on all interactive elements)
- Semantic HTML (button for actions, links for navigation)
- Form labels (every input has an associated label)

Provide:
1) List of issues found
2) Suggested fixes with code snippets
3) Priority (critical/major/minor)
```

---

## Copilot Anti-Patterns (What NOT to Do)

| Anti-Pattern | Why It's Bad |
|--------------|--------------|
| Accepting code without reading it | May introduce bugs, security issues, or wrong patterns |
| Not verifying imports/dependencies | Copilot may import non-existent or wrong packages |
| Ignoring test failures | "It works on my machine" doesn't count as proof |
| Letting Copilot refactor more than asked | Scope creep leads to large, unreviewable diffs |
| Not checking for secrets in suggestions | Copilot may echo patterns with hardcoded values |
| Skipping the plan step | Leads to unfocused implementation |
| Not citing the domain context | Generic code instead of domain-appropriate patterns |

---

## Reflection Template (Lab 5)

After completing Lab 5, answer these questions in your README:

### Effectiveness
- What did Copilot do well?
- What did you have to fix or reject?
- What would you prompt differently next time?

### Process
- Did the plan-first approach help?
- How did tests-first contribute to quality?
- What repo pattern should we add to instructions?

### Quantitative
- Approximate lines of code generated by Copilot: ___
- Approximate lines of code written/fixed by human: ___
- Number of Copilot suggestions rejected: ___
- Time spent prompting vs coding: ___

---

## P11 — Post-Implementation Reflection

```
No secrets, no production data. Use placeholders.

Context:
- Feature just implemented: <feature name>
- Files created/modified: <list files>
- Lab: <lab number>

Help me reflect on this implementation:

1. Code Quality Check:
   - Any obvious improvements to the code I accepted?
   - Did I follow repo patterns correctly?
   - Are there any edge cases I missed?

2. Copilot Usage Review:
   - Which prompts were most effective?
   - What took multiple attempts to get right?
   - What should I have asked differently?

3. Documentation Check:
   - Is the README complete?
   - Are test descriptions clear?
   - Would another developer understand my code?

4. Suggestions for Future:
   - What prompt patterns should I reuse?
   - What should I add to my personal prompt library?
   - What instructions should the repo add?

Provide specific, actionable feedback.
```

---

---

## P12 — @workspace Exploration

```
@workspace How does <feature/module> work in this project?

Focus on:
- Entry points and data flow
- Key files involved
- Patterns used
- Dependencies between components

Cite the specific files for each part of your explanation.
If anything is uncertain, say so and propose how to confirm.
```

---

## P13 — Code Review Assistant

```
No secrets, no production data. Use placeholders.

Review this code for:
- Potential bugs or edge cases
- Security concerns
- Performance issues
- Adherence to our patterns (see .github/copilot-instructions.md)

#file <path-to-file>

For each issue found:
- Severity (critical/major/minor)
- Location (file and line)
- Suggested fix with code snippet

Also note any positive patterns worth replicating.
```

---

## P14 — Onboarding Query

```
@workspace I'm new to this codebase.

Explain:
1. The overall architecture (layers, components)
2. How to run the project locally
3. Where the main business logic lives
4. Key patterns I should follow
5. Important files to read first

Cite files for each answer.
Keep explanations concise but complete.
```

---

## P15 — Constraint Extraction

```
No secrets, no production data. Use placeholders.

Based on the business requirements in <document or paste requirements>:

Extract and categorize:
1. Hard constraints (must have, non-negotiable)
2. Soft constraints (should have, negotiable)
3. Assumptions to validate with stakeholders
4. Risks to mitigate

Format as a constraint register with columns:
| ID | Type | Description | Source | Priority | Validation Status |

Group related constraints together.
Flag any conflicts between constraints.
```

---

## P16 — ADR Generation

```
No secrets, no production data. Use placeholders.

Context: We need to decide <decision topic>

Generate an Architecture Decision Record:

## ADR-XXX: <Concise Decision Title>

### Status
Proposed | Accepted | Deprecated | Superseded

### Context
<Why this decision is needed — business and technical drivers>

### Decision
<What we decided and the key reasons>

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Option A | | |
| Option B | | |
| Option C | | |

### Consequences
**Positive:**
- <benefit 1>
- <benefit 2>

**Negative:**
- <tradeoff 1>
- <tradeoff 2>

**Risks:**
- <risk and mitigation>

### Related Decisions
- ADR-XXX: <related decision>

Follow template in docs/week-03/adrs/000-template.md if available.
```

---

## P17 — OpenAPI Generation

```
No secrets, no production data. Use placeholders.

Based on:
- Domain context: docs/shared/DOMAIN_CONTEXT.md
- Acceptance criteria: <paste or reference criteria>

Generate OpenAPI 3.1 specification:

Requirements:
- Schemas with examples and validation rules
- Endpoints with full request/response specifications
- Error responses using RFC 7807 Problem Details
- Pagination using cursor or offset pattern
- Authentication requirements noted

Include:
- operationId for each endpoint
- tags for grouping
- descriptions for all fields
- example values for all schemas

Output format: YAML
Output location: docs/week-04/contracts/openapi.yaml
```

---

## P18 — Security Review (OWASP Top 10)

```
No secrets, no production data. Use placeholders.

Review this code for OWASP Top 10 vulnerabilities:

#file <path-to-file>

Check for:
1. Injection (SQL, Command, LDAP, XPath)
2. Broken Authentication
3. Sensitive Data Exposure
4. XML External Entities (XXE)
5. Broken Access Control
6. Security Misconfiguration
7. Cross-Site Scripting (XSS)
8. Insecure Deserialization
9. Using Components with Known Vulnerabilities
10. Insufficient Logging & Monitoring

For each finding:
- Severity: Critical / High / Medium / Low
- Location: file:line
- Evidence: relevant code snippet
- Remediation: specific fix with code example
- References: CWE or OWASP link if applicable

If no issues found, confirm the code appears secure for each category checked.
```

---

## P19 — Sprint Packet Review

```
No secrets, no production data. Use placeholders.

Review this sprint packet for completeness:

#file <sprint-packet-path>

Verify presence and quality of:
1. Goal statement (clear, measurable success definition)
2. In-scope items (explicit boundaries)
3. Out-of-scope items (explicit exclusions)
4. User stories with acceptance criteria (testable per story)
5. Dependencies (external blockers identified)
6. Risks (identified with likelihood, impact, mitigation)
7. Definition of Done (matches team standard)

For each section:
- ✅ Complete and clear
- ⚠️ Present but needs improvement (explain)
- ❌ Missing or inadequate (explain)

Provide specific suggestions for any gaps found.
```

---

## P20 — Gate Readiness Check

```
No secrets, no production data. Use placeholders.

We are approaching <Gate Name> at end of <Week/Sprint>.

Based on:
- Gate criteria in docs/shared/DEFINITION_OF_DONE.md
- Current codebase state (@workspace)
- Sprint packet requirements

Assess readiness:

## Criteria Met ✅
| Criterion | Evidence |
|-----------|----------|
| | |

## Criteria At Risk ⚠️
| Criterion | Gap | Recommended Action |
|-----------|-----|-------------------|
| | | |

## Criteria Blocked ❌
| Criterion | Blocker | Owner |
|-----------|---------|-------|
| | | |

## Recommended Actions Before Gate
1. <action with owner and deadline>
2. <action with owner and deadline>

## Overall Assessment
[ ] Ready to proceed
[ ] Conditionally ready (list conditions)
[ ] Not ready (list blockers)

Be specific and cite files/PRs where relevant.
```

---

## P21 — Contract Validation

```
No secrets, no production data. Use placeholders.

Review this OpenAPI contract for completeness:

#file <path/to/openapi.yaml>

Check for:
1. All user journeys have corresponding endpoints
2. All schemas have examples
3. All error responses use Problem Details
4. Pagination is consistent
5. Authentication is properly specified
6. Naming follows domain glossary

List any gaps or inconsistencies found.
```

---

## P22 — Mock Handler Generation

```
No secrets, no production data. Use placeholders.

Based on this OpenAPI specification:

#file <path/to/openapi.yaml>

Generate MSW mock handlers for: <Endpoint>

Include:
1. Success response with example data
2. Validation error response
3. Not found error response
4. Authentication error response

Use TypeScript with proper typing from ~/types
```

---

## P23 — Contract Review (Production Readiness)

```
No secrets, no production data. Use placeholders.

Review this OpenAPI contract for production readiness:

[Paste your OpenAPI contract here or use #file]

Analyze the following areas and rate each:
✅ Good | ⚠️ Needs Work | ❌ Critical Issue

## 1. Completeness
- All CRUD operations present
- All expected endpoints defined
- Request and response schemas complete
- All parameters documented

## 2. Consistency
- Naming conventions (camelCase for fields, kebab-case for paths)
- Response formats (consistent pagination, error structure)
- Path patterns (/api/v1/resource/{id})
- HTTP method usage

## 3. Error Handling
- 400 Bad Request defined for validation
- 401 Unauthorized defined
- 403 Forbidden defined where needed
- 404 Not Found for resource endpoints
- 409 Conflict for business rule violations
- 500 Internal Server Error defined
- RFC 7807 Problem Details format used

## 4. Documentation
- All endpoints have descriptions
- All parameters have descriptions
- All schemas have descriptions
- operationId present on all operations
- Tags for grouping related operations

## 5. Examples
- Request body examples provided
- Response examples for success cases
- Response examples for error cases
- Multiple examples where helpful

## 6. Security
- Security scheme defined (bearerAuth, apiKey, etc.)
- Per-operation security requirements
- No sensitive data in examples

## 7. Best Practices
- RESTful conventions followed
- Appropriate HTTP methods used
- Appropriate status codes used
- Pagination on list endpoints
- Versioning in path (/v1/)
- Content-Type headers specified

For each area rated ⚠️ or ❌, provide:
1. Specific issue found
2. Location in the contract
3. Recommended fix
4. Example of correct implementation
```

---

## Slash Command Quick Reference

| Command | When to Use | Example |
|---------|-------------|---------|
| `/explain` | Understanding unfamiliar code | Select code → `/explain` |
| `/fix` | Quick error resolution | Select error → `/fix` |
| `/tests` | Generate test stubs | Select function → `/tests` |
| `/doc` | Add JSDoc/JavaDoc | Select function → `/doc` |
| `/new` | Create new file/project | `/new React component for Orders` |

---

## Context Reference Syntax

| Syntax | Purpose | Example |
|--------|---------|---------|
| `@workspace` | Query entire codebase | `@workspace Where is Order defined?` |
| `#file` | Reference specific file | `#file src/Order.ts explain this` |
| `#selection` | Reference selected code | `#selection what does this do?` |
| `@terminal` | Reference terminal output | `@terminal explain this error` |
| `@vscode` | VS Code settings/commands | `@vscode how to configure linting` |

---

## Quick Reference Card

| Prompt | Use When | Phase |
|--------|----------|-------|
| P0 | Starting any task | All |
| P1 | Building a new feature | Week 1+ |
| P2 | Writing tests first | Week 1+ (Lab 3) |
| P3 | Fixing a bug | All |
| P4 | Refactoring safely | Week 1+ (Lab 4) |
| P5 | Understanding code | All |
| P6 | Creating JPA repository | Week 1+ |
| P7 | Creating service layer | Week 1+ |
| P8 | Creating REST controller | Week 1+ |
| P9 | Creating React Router route | Week 1+ |
| P10 | Checking accessibility | Sprint 3+ |
| P11 | Post-implementation reflection | Week 1+ (Lab 5) |
| **P12** | **Codebase exploration** | **Week 1+** |
| **P13** | **Code review** | **Week 2+** |
| **P14** | **Onboarding to codebase** | **All** |
| **P15** | **Constraint extraction** | **Week 2** |
| **P16** | **ADR generation** | **Week 3** |
| **P17** | **OpenAPI generation** | **Week 4** |
| **P18** | **Security review** | **Sprint 3** |
| **P19** | **Sprint packet review** | **Sprints** |
| **P20** | **Gate readiness check** | **Gates** |
| **P21** | **Contract validation** | **Week 4** |
| **P22** | **Mock handler generation** | **Week 4+** |
| **P23** | **Contract review (prod readiness)** | **Week 4** |
