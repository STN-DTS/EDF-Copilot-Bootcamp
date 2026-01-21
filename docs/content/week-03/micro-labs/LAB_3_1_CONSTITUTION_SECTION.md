# Lab 3-1 — Constitution Section

## Goal

Practice writing one section of a Project Constitution with enforceable, specific standards. Learn to balance prescriptive rules with team flexibility.

## Timebox

30 minutes

## Prerequisites

- Reviewed [Project Constitution Template](../templates/PROJECT_CONSTITUTION.md)
- Attended Day 1 Constitution Workshop
- Familiar with team's technology stack

## Domain Context

You are contributing to the **Order Management System** Project Constitution. Your task is to write the **Error Handling Standards** section.

---

## Task

### Step 1: Review Existing Patterns (5 min)

Review these existing error handling approaches in the codebase:

**Backend (Spring Boot):**
```java
// Pattern A: Custom exceptions
throw new OrderNotFoundException("Order " + orderId + " not found");

// Pattern B: RFC 7807 Problem Details
return ResponseEntity.status(404)
    .body(ProblemDetail.forStatusAndDetail(
        HttpStatus.NOT_FOUND,
        "Order " + orderId + " does not exist"
    ));
```

**Frontend (React):**
```typescript
// Pattern A: Try-catch with toast
try {
  await cancelOrder(orderId);
} catch (error) {
  toast.error("Failed to cancel order");
}

// Pattern B: Error boundary + state
if (error) {
  return <ErrorDisplay error={error} retry={refetch} />;
}
```

### Step 2: Write Constitution Section (20 min)

Write the "Error Handling Standards" section using this template:

```markdown
## 5. Error Handling Standards

### 5.1 Backend Error Responses

**Standard:** [State the required approach]

**Format:** [Specify the response format]

**Required Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| | | | |

**Example:**
```json
{
  // Example response
}
```

**Rules:**
1. [Rule 1]
2. [Rule 2]
3. [Rule 3]

### 5.2 Frontend Error Handling

**Standard:** [State the required approach]

**Patterns:**
| Scenario | Pattern | Example |
|----------|---------|---------|
| | | |

**Rules:**
1. [Rule 1]
2. [Rule 2]
3. [Rule 3]

### 5.3 Error Codes

| Code Range | Category | Owner |
|------------|----------|-------|
| | | |

### 5.4 Logging Requirements

**Standard:** [What must be logged for errors]

**Fields:**
| Field | Required | Example |
|-------|----------|---------|
| | | |

### 5.5 Exceptions to Standards

[Document any known exceptions and their justification]
```

### Step 3: Self-Review (5 min)

Evaluate your section against these criteria:

| Criterion | Question | ✓ |
|-----------|----------|---|
| **Specific** | Could two developers implement this the same way? | |
| **Enforceable** | Can this be checked in code review or CI? | |
| **Justified** | Is the "why" clear? | |
| **Complete** | Does it cover FE and BE? | |
| **Flexible** | Are exceptions documented? | |

---

## Submission

### Folder Structure

```
/working/architecture/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── CONSTITUTION_ERROR_HANDLING.md
└── SELF_REVIEW.md
```

### README.md Must Include

- Your name and date
- Lab number: **Lab 3-1**
- Summary of standards defined
- Any Copilot assistance used
- Self-review results

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ All Subsections | 5.1-5.5 all completed |
| ✅ Specific Standards | No vague terms ("appropriate", "good") |
| ✅ Examples | At least 2 code examples |
| ✅ FE + BE Coverage | Both perspectives addressed |
| ✅ Enforceable | Rules can be verified |

---

## Example Output (Partial)

```markdown
### 5.1 Backend Error Responses

**Standard:** All API errors MUST use RFC 7807 Problem Details format.

**Required Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | URI | Yes | Error type identifier |
| title | string | Yes | Human-readable title |
| status | integer | Yes | HTTP status code |
| detail | string | Yes | Specific error message |
| instance | URI | No | Request identifier |
| traceId | string | Yes | Correlation ID for tracing |

**Example:**
```json
{
  "type": "https://api.example.com/errors/order-not-found",
  "title": "Order Not Found",
  "status": 404,
  "detail": "Order ORD-12345 does not exist",
  "instance": "/api/orders/ORD-12345",
  "traceId": "abc123-def456"
}
```

**Rules:**
1. Never expose stack traces in production responses
2. Always include traceId for debugging
3. Use specific error types, not generic "error" messages
```

---

## Reflection Questions

1. What was hardest to make "enforceable"?
2. How would you verify compliance with your standards?
3. What exceptions might teams request?

---

## Scoring Guide

| Score | Criteria |
|-------|----------|
| ⭐⭐⭐ | All subsections complete, specific + enforceable, examples for FE+BE |
| ⭐⭐ | Most subsections, some vague terms, examples present |
| ⭐ | Incomplete or not enforceable |

---

## Tips for Enforceable Standards

### Good vs. Bad Standards

| ❌ Vague | ✅ Specific |
|----------|-------------|
| "Handle errors appropriately" | "Use RFC 7807 Problem Details format" |
| "Log important information" | "Log error level, message, traceId, userId" |
| "Show user-friendly messages" | "Display error.title from API response" |
| "Use proper error codes" | "4xx for client errors, 5xx for server errors" |

### Verification Methods

| Standard | Verification |
|----------|--------------|
| RFC 7807 format | API integration tests |
| Required fields | JSON schema validation |
| No stack traces | Security scan in CI |
| TraceId present | Log aggregation check |
