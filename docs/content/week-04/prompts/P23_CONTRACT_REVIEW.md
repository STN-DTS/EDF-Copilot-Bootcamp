# P23 — Contract Review Prompt

## Purpose

Use this prompt to review an OpenAPI contract for production readiness before Contract Lock.

---

## The Prompt

```markdown
No secrets, no production data. Use placeholders.

Review this OpenAPI contract for production readiness:

[Paste your OpenAPI contract here]

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

## When to Use

- **Before Contract Lock ceremony (Day 5)**
- When reviewing a peer's contract design
- After major contract changes
- As part of Gate 4 verification
- During code review of OpenAPI changes

---

## Expected Output

Copilot will provide:
1. **Rating for each area** (✅/⚠️/❌)
2. **Specific issues found** with locations
3. **Recommended fixes** with code examples
4. **Overall assessment** of production readiness

### Example Output

```markdown
## Contract Review Results

### 1. Completeness: ⚠️ Needs Work
- Missing DELETE /orders/{id} endpoint
- POST /orders missing request body schema details

### 2. Consistency: ✅ Good
- Naming follows camelCase convention
- Path patterns are consistent

### 3. Error Handling: ❌ Critical Issue
- No error responses defined on any endpoint
- Problem Details schema not present

**Fix:** Add error responses:
```yaml
responses:
  '400':
    description: Bad Request
    content:
      application/problem+json:
        schema:
          $ref: '#/components/schemas/ProblemDetail'
```

[... continues for each area ...]
```

---

## Follow-up Prompts

After getting the initial review, use these to dig deeper:

### For specific issues:
```markdown
Show me how to fix the error response format to use RFC 7807 Problem Details
with validation errors for a 400 response.
```

### For missing operations:
```markdown
Generate the missing DELETE /api/v1/orders/{id} endpoint with:
- operationId
- Path parameter
- 204 success response
- 401, 403, 404 error responses
- Problem Details for errors
```

### For pagination:
```markdown
Show me how to add cursor-based pagination to the GET /api/v1/orders endpoint
with:
- Query parameters (cursor, limit)
- Response with next cursor
- Examples
```

### For security:
```markdown
Add a bearerAuth security scheme to this contract and apply it to all
endpoints except GET /health.
```

### For validation:
```markdown
Add validation constraints to the CreateOrderRequest schema:
- customerId: required, UUID format
- items: required, 1-100 items
- items[].quantity: required, 1-99
```

---

## Limitations

### P23 is Good At Finding:
- Structural issues (missing fields, sections)
- Format inconsistencies
- Missing documentation
- Common OpenAPI mistakes
- Syntax errors

### P23 is NOT Good At:
- Business logic correctness
- Domain-specific requirements
- Performance implications
- Security vulnerabilities beyond surface level
- Whether the API meets user needs

**Always combine with manual review** for domain-specific validation.

---

## Comparison with P21

| Aspect | P21 (Validation) | P23 (Review) |
|--------|------------------|--------------|
| **Focus** | Technical correctness | Production readiness |
| **Output** | List of issues | Rated assessment |
| **Depth** | Surface-level | Comprehensive |
| **Use Case** | Quick validation | Pre-lock review |

**Recommendation:** Use P21 for quick checks during development, P23 for formal reviews before lock.

---

## Integration with Lab 4-3

Lab 4-3 uses both P21 and P23 to review a flawed contract:

1. **P21 first** - Quick validation to find obvious issues
2. **P23 second** - Comprehensive review with ratings
3. **Compare outputs** - Note what each prompt catches
4. **Manual review** - Catch domain-specific issues

---

## Checklist for Using P23

Before running the prompt:
- [ ] Contract is in valid YAML format
- [ ] Contract has at least a few endpoints defined
- [ ] You have time to address the feedback

After running the prompt:
- [ ] Review each rating and issue
- [ ] Prioritize ❌ Critical issues first
- [ ] Create fix tasks for ⚠️ issues
- [ ] Document in review report

---

## Example: Complete Review Session

### Input Contract (Flawed)
```yaml
openapi: 3.1.0
info:
  title: Order API
  version: 1.0.0
paths:
  /orders:
    get:
      summary: Get orders
      responses:
        '200':
          description: OK
```

### P23 Review Output
```markdown
## Contract Review: Order API v1.0.0

### Overall Assessment: 🔴 NOT READY

| Area | Rating | Issues |
|------|--------|--------|
| Completeness | ❌ | 4 |
| Consistency | ⚠️ | 2 |
| Error Handling | ❌ | 5 |
| Documentation | ❌ | 3 |
| Examples | ❌ | All missing |
| Security | ❌ | Not defined |
| Best Practices | ⚠️ | 3 |

### Critical Issues

1. **No operationId** - Required for code generation
2. **No error responses** - FE cannot implement error handling
3. **No security** - API is unprotected
4. **No schemas** - Response shape undefined

[... detailed fixes ...]
```

### Action Items
1. ❌ Add operationId to all operations
2. ❌ Define response schemas
3. ❌ Add error responses (400, 401, 404, 500)
4. ❌ Add security scheme
5. ⚠️ Add pagination
6. ⚠️ Add path versioning
