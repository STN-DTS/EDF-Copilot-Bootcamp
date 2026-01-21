# Copilot Enterprise Features for Week 2

> Guide to using GitHub Copilot Enterprise features for constraint documentation and requirements capture.

---

## Overview

Week 2 focuses on capturing constraints, user journeys, and acceptance criteria. Copilot Enterprise provides several features that accelerate this work:

| Feature | Use Case | Week 2 Application |
|---------|----------|-------------------|
| **@workspace** | Codebase-wide queries | Find existing patterns, constraints in code |
| **#file** | Single file analysis | Analyze specific docs, templates |
| **P15 Prompt** | Constraint extraction | Systematic extraction from requirements |
| **Chat** | General assistance | Drafting, refining, reviewing |

---

## @workspace — Codebase Analysis

### What It Does

`@workspace` allows Copilot to search and analyze your entire codebase to answer questions about patterns, conventions, and existing implementations.

### When to Use in Week 2

| Scenario | Query Example |
|----------|---------------|
| Finding existing constraints | "@workspace What business rules are enforced in Order entity?" |
| Understanding patterns | "@workspace How do we currently handle errors?" |
| Checking consistency | "@workspace What validation patterns do we use?" |
| Finding examples | "@workspace Show me examples of user journey documentation" |

### Example Queries

#### Finding Existing Constraints

```markdown
@workspace What constraints are currently enforced on Order creation?
Look for:
- Validation annotations (@NotNull, @Size, etc.)
- Business rule methods
- Database constraints
- API validation
```

#### Understanding Error Handling

```markdown
@workspace How do we handle errors in this codebase?
Show me:
- Error response format
- Exception handling patterns
- HTTP status codes used
```

#### Checking NFR Implementation

```markdown
@workspace What performance-related code exists?
Look for:
- Caching implementations
- Pagination patterns
- Query optimization
```

### Best Practices

1. **Be specific:** "How do we validate Orders?" not "How does validation work?"
2. **Ask for examples:** "Show me examples of..." gets concrete code
3. **Scope when possible:** "In the order-service module..."
4. **Follow up:** "What about error cases?" after initial answer

---

## #file — Single File Analysis

### What It Does

`#file` focuses Copilot on a specific file for deep analysis, rather than searching the entire codebase.

### When to Use in Week 2

| Scenario | Query Example |
|----------|---------------|
| Analyzing requirements doc | "#file requirements.md Extract all constraints" |
| Reviewing templates | "#file CONSTRAINT_REGISTER.md Is this complete?" |
| Understanding domain | "#file DOMAIN_CONTEXT.md What entities exist?" |
| Checking journey | "#file journey.md What failure paths are missing?" |

### Example Queries

#### Analyzing Domain Context

```markdown
#file DOMAIN_CONTEXT.md

What entities exist in this domain?
For each entity, list:
- Key attributes
- Relationships to other entities
- Business rules that apply
```

#### Reviewing Constraint Register

```markdown
#file CONSTRAINT_REGISTER.md

Review this constraint register for:
1. Completeness (all categories covered?)
2. Specificity (measurable criteria?)
3. Validation methods (testable?)
4. Priority consistency (P1/P2/P3?)

Suggest improvements for any issues found.
```

#### Extracting from Requirements

```markdown
#file requirements-v1.pdf

Extract all constraints from this document.
Categorize as:
- Functional
- Non-Functional
- Integration
- Regulatory
- Technical
- Organizational

Format as a constraint register table.
```

### Best Practices

1. **Use for deep dives:** When you need thorough analysis of one document
2. **Combine with @workspace:** Use #file first, then @workspace for broader context
3. **Reference line numbers:** "On line 45, this constraint seems vague..."

---

## P15 Prompt — Constraint Extraction

### The Prompt

```markdown
No secrets, no production data. Use placeholders.

Based on the business requirements below, extract:
1. Hard constraints (must have)
2. Soft constraints (should have)
3. Assumptions to validate
4. Risks to mitigate

Format as a constraint register table with columns:
ID | Type | Category | Description | Source | Priority | Validation Method

Requirements:
[Paste requirements here]

Categories to use: Functional, Non-Functional, Integration, Regulatory, Technical, Organizational
```

### When to Use

- Day 1: Initial constraint extraction from requirements docs
- Lab 2-0: Individual practice exercise
- Anytime: When new requirements are discovered

### Enhancing P15 Output

After initial extraction, use follow-up prompts:

#### Add Missing Categories

```markdown
You missed regulatory constraints. What compliance requirements 
would typically apply to an Order Management system handling:
- Customer personal data
- Payment information
- Order history
```

#### Make Constraints Specific

```markdown
Make constraint NF-001 "System should be fast" more specific.
Include:
- Measurable criteria (response time in ms)
- Measurement method (p95, p99)
- Test approach
```

#### Add Validation Methods

```markdown
For each constraint in this table, suggest a specific 
validation method. Include:
- Test type (unit, integration, E2E, load)
- Tool or framework to use
- Pass/fail criteria
```

---

## Chat — General Assistance

### Drafting Assistance

#### Draft a User Journey

```markdown
Help me draft a user journey for "Customer cancels an order."

Include:
- Actor and goal
- Preconditions
- Happy path (5-7 steps)
- 5 failure paths with recovery actions
- Edge cases
- Postconditions
```

#### Convert Journey to AC

```markdown
Convert this user journey to Gherkin acceptance criteria:

[Paste journey]

Include:
- Feature description with As a/I want/So that
- Background for common preconditions
- Scenarios for happy path
- Scenarios for each failure path
- Tags for organization (@happy-path, @failure, @edge-case)
```

### Review Assistance

#### Review Constraint Register

```markdown
Review this constraint register for quality issues:

[Paste register]

Check for:
- Vague or unmeasurable constraints
- Missing validation methods
- Inconsistent priorities
- Missing categories
- Duplicate or conflicting constraints
```

#### Review Acceptance Criteria

```markdown
Review these acceptance criteria for testability:

[Paste AC]

For each scenario, assess:
- Is it unambiguous?
- Can it be automated?
- Are all values specified?
- Is the expected behavior clear?

Suggest improvements for any issues.
```

---

## Combining Features

### Workflow: Constraint Discovery

1. **Start with #file** on requirements doc
2. **Use P15** to extract initial constraints
3. **Use @workspace** to find existing constraints in code
4. **Use Chat** to review and refine

### Example Combined Session

```markdown
# Step 1: Analyze requirements
#file requirements-v2.md What constraints are stated or implied here?

# Step 2: Extract systematically with P15
[Use P15 prompt with requirements text]

# Step 3: Check for existing implementation
@workspace What constraints are already enforced in Order validation?

# Step 4: Find gaps
Compare the requirements constraints with what's in code. 
What's missing from implementation?
```

---

## Feature Comparison

| Feature | Scope | Speed | Best For |
|---------|-------|-------|----------|
| @workspace | Entire codebase | Slower | Finding patterns, existing code |
| #file | Single file | Faster | Deep analysis, specific docs |
| P15 | Requirements text | Medium | Systematic extraction |
| Chat | Any | Fast | Drafting, reviewing, refining |

---

## Troubleshooting

### @workspace Returns "No results"

**Causes:**
- Query too specific
- Code not indexed yet
- Wrong terminology

**Fixes:**
- Broaden search terms
- Wait for indexing (new repos)
- Use alternative terms ("validation" vs "constraint")

### #file Doesn't Find the File

**Causes:**
- Wrong file path
- File not in workspace
- File is binary/unsupported

**Fixes:**
- Use relative path from workspace root
- Ensure file is in open folder
- Use supported text formats

### P15 Output is Vague

**Causes:**
- Input requirements are vague
- Prompt needs refinement

**Fixes:**
- Ask for specific criteria: "Include measurable values"
- Request examples: "Provide a good and bad example"
- Follow up: "Make this more specific"

### Chat Gives Generic Answers

**Causes:**
- Question too broad
- Missing context

**Fixes:**
- Add domain context: "For an Order Management system..."
- Be specific: "In the context of order cancellation..."
- Provide examples: "Like this: [example]"

---

## Security Reminders

Every prompt must begin with:
> "No secrets, no production data. Use placeholders."

**Never include in prompts:**
- API keys or tokens
- Real customer data
- Production URLs or IPs
- Internal system names (use placeholders)
- Credentials of any kind

**Use placeholders:**
- `<API_KEY>` not actual key
- `CUST-001` not real customer ID
- `example.com` not production domain
- `<PASSWORD>` not actual password

---

## Quick Reference Card

| Task | Feature | Example |
|------|---------|---------|
| Find existing patterns | @workspace | "@workspace How do we validate?" |
| Analyze one document | #file | "#file requirements.md Extract constraints" |
| Extract constraints | P15 | [Use full P15 prompt] |
| Draft journey | Chat | "Help me draft a user journey for..." |
| Review document | Chat | "Review this for quality issues..." |
| Convert to Gherkin | Chat | "Convert this journey to AC..." |
| Find domain entities | #file | "#file DOMAIN_CONTEXT.md What entities?" |
| Check consistency | @workspace | "@workspace What naming conventions?" |
