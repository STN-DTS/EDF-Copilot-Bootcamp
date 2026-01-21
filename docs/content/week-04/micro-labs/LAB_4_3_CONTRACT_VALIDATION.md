# Lab 4-3 — Contract Validation with P21 + P23

## Goal

Practice validating an OpenAPI contract for completeness, consistency, and quality using Copilot prompts. Learn to identify issues before the Contract Lock ceremony.

## Timebox

30 minutes

## Prerequisites

- Completed Labs 4-0, 4-1, 4-2
- Reviewed [OpenAPI contract](../contracts/openapi.yaml)
- Attended Day 4 Contract Review Workshop

## Domain Context

You will review a draft OpenAPI contract that intentionally contains issues for you to identify before Contract Lock.

---

## Contract for Review

```yaml
openapi: 3.1.0
info:
  title: Order API
  version: 1.0.0

paths:
  /orders:
    get:
      summary: Get all orders
      responses:
        '200':
          description: List of orders
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
    post:
      summary: Create order
      requestBody:
        content:
          application/json:
            schema:
              type: object
      responses:
        '200':
          description: Order created

  /orders/{id}:
    get:
      summary: Get order by ID
      parameters:
        - name: id
          in: path
          schema:
            type: string
      responses:
        '200':
          description: Order details
          content:
            application/json:
              schema:
                type: object
    delete:
      summary: Delete order
      parameters:
        - name: id
          in: path
          schema:
            type: string
      responses:
        '200':
          description: Order deleted

components:
  schemas:
    Order:
      type: object
      properties:
        id:
          type: string
        customerId:
        items:
          type: array
        status:
          type: string
        total:
```

---

## Task

### Step 1: Manual Review (10 min)

Review the contract above and identify issues:

**Review Checklist:**

| Area | Check | Issue Found? | Notes |
|------|-------|--------------|-------|
| **Paths** | All CRUD operations present? | | |
| **Parameters** | Required flag set? | | |
| **Request Bodies** | Schemas fully defined? | | |
| **Responses** | Correct status codes? | | |
| **Error Responses** | 400, 401, 404, 500 defined? | | |
| **Schemas** | All properties have types? | | |
| **Examples** | Provided for all schemas? | | |
| **Security** | Auth requirements defined? | | |
| **operationId** | Unique IDs on all operations? | | |
| **Descriptions** | Meaningful descriptions? | | |

Document each issue you find:

| # | Location | Issue | Severity | Recommendation |
|---|----------|-------|----------|----------------|
| 1 | POST /orders | Response should be 201, not 200 | Medium | Change to 201 Created |
| 2 | | | | |
| 3 | | | | |

### Step 2: Use P21 + P23 Prompts (10 min)

Use Copilot to validate the contract:

**P21 - Validation Prompt:**

```markdown
No secrets, no production data. Use placeholders.

Validate this OpenAPI contract for completeness:

[Paste the contract above]

Check for:
1. Missing required fields (operationId, descriptions)
2. Incomplete schemas (missing required, types)
3. Incorrect response codes
4. Missing error responses
5. Security definition gaps
6. Parameter validation issues
7. Schema reference issues

For each issue found, provide:
- Location in the contract
- What's wrong
- How to fix it
```

**P23 - Contract Review Prompt:**

```markdown
No secrets, no production data. Use placeholders.

Review this OpenAPI contract for production readiness:

[Paste the contract above]

Analyze and rate each area: ✅ Good / ⚠️ Needs Work / ❌ Critical Issue

## 1. Completeness
- All CRUD operations present
- All expected endpoints defined
- Request and response schemas complete

## 2. Consistency
- Naming conventions (camelCase vs snake_case)
- Response formats (pagination, errors)
- Path patterns (/api/v1/resource/{id})

## 3. Error Handling
- 400 Bad Request defined for validation
- 401 Unauthorized defined
- 403 Forbidden defined where needed
- 404 Not Found for resource endpoints
- 500 Internal Server Error defined
- RFC 7807 Problem Details format used

## 4. Documentation
- All endpoints have descriptions
- All parameters have descriptions
- All schemas have descriptions
- operationId present on all operations

## 5. Examples
- Request body examples provided
- Response examples for success cases
- Response examples for error cases

## 6. Security
- Security scheme defined
- Per-operation security requirements

## 7. Best Practices
- RESTful conventions followed
- Appropriate HTTP methods used
- Appropriate status codes used
- Pagination on list endpoints
- Versioning in path

For each area rated ⚠️ or ❌, provide specific recommendations.
```

### Step 3: Compile Review Report (10 min)

Create a comprehensive review report:

```markdown
# Contract Review Report

**Contract:** Order API v1.0.0
**Reviewer:** [Your Name]
**Date:** [Date]
**Verdict:** 🔴 Not Ready for Lock

## Summary Statistics

| Area | Status | Issues |
|------|--------|--------|
| Completeness | ❌ | 3 critical |
| Consistency | ⚠️ | 2 medium |
| Error Handling | ❌ | 5 critical |
| Documentation | ❌ | 4 critical |
| Examples | ❌ | All missing |
| Security | ❌ | Not defined |
| Best Practices | ⚠️ | 3 medium |

## Critical Issues (Must Fix Before Lock)

### Issue 1: Missing Error Responses
**Location:** All endpoints
**Problem:** No 400, 401, 403, 404, 500 responses defined
**Impact:** FE cannot implement error handling
**Fix:**
```yaml
responses:
  '400':
    description: Bad Request
    content:
      application/problem+json:
        schema:
          $ref: '#/components/schemas/ProblemDetail'
  '401':
    description: Unauthorized
  '404':
    description: Not Found
  '500':
    description: Internal Server Error
```

### Issue 2: POST Returns Wrong Status Code
**Location:** POST /orders
**Problem:** Returns 200 instead of 201
**Fix:** Change to `'201': description: Order created`

### Issue 3: Missing operationId
**Location:** All endpoints
**Problem:** No operationId defined on any operation
**Impact:** Code generators will fail
**Fix:** Add unique operationId to each operation

### Issue 4: Parameter Not Required
**Location:** GET /orders/{id}, DELETE /orders/{id}
**Problem:** `id` path parameter missing `required: true`
**Fix:** Add `required: true` to path parameters

### Issue 5: Incomplete Schema
**Location:** components/schemas/Order
**Problem:** `customerId` and `total` have no type
**Fix:** Add type definitions

### Issue 6: Empty Request Body Schema
**Location:** POST /orders requestBody
**Problem:** Schema is just `type: object` with no properties
**Fix:** Define complete Order creation schema

## Medium Issues (Should Fix)

### Issue 7: DELETE Returns Wrong Status
**Location:** DELETE /orders/{id}
**Problem:** Returns 200 instead of 204
**Fix:** Change to `'204': description: Order deleted`

### Issue 8: No API Versioning
**Location:** All paths
**Problem:** Paths use /orders instead of /api/v1/orders
**Fix:** Add version prefix to all paths

### Issue 9: Missing Pagination
**Location:** GET /orders
**Problem:** List endpoint has no pagination
**Fix:** Add page, size, sort query parameters

## Low Issues (Nice to Have)

### Issue 10: No Examples
**Location:** All schemas
**Problem:** No example values provided
**Recommendation:** Add examples to all schemas

### Issue 11: No Tags
**Location:** All operations
**Problem:** Operations not grouped by tags
**Recommendation:** Add tags for API grouping

### Issue 12: items Array Missing Item Type
**Location:** components/schemas/Order.items
**Problem:** Array defined but no item schema
**Fix:** Add `items: { $ref: '#/components/schemas/OrderItem' }`

## Recommendations Summary

1. ❌ Add all error responses with Problem Details schema
2. ❌ Add operationId to all operations
3. ❌ Fix status codes (POST→201, DELETE→204)
4. ❌ Complete all schema definitions
5. ⚠️ Add API versioning
6. ⚠️ Add pagination to list endpoint
7. 💡 Add examples to all schemas
8. 💡 Add security scheme

## Estimated Effort

| Priority | Issues | Effort |
|----------|--------|--------|
| Critical | 6 | 4 hours |
| Medium | 3 | 2 hours |
| Low | 3 | 1 hour |
| **Total** | **12** | **7 hours** |

## Verdict

🔴 **NOT READY FOR CONTRACT LOCK**

Contract requires significant work before FE/BE can develop in parallel.
Schedule follow-up review after critical issues are resolved.
```

---

## Submission

### Folder Structure

```
/working/contracts/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── REVIEW_REPORT.md
├── ISSUES_FOUND.md
├── COPILOT_P21_OUTPUT.md
├── COPILOT_P23_OUTPUT.md
└── FIXED_CONTRACT.yaml (bonus)
```

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ Manual Review | At least 8 issues identified manually |
| ✅ P21 Used | Validation prompt output documented |
| ✅ P23 Used | Review prompt output documented |
| ✅ Report Complete | All sections filled with findings |
| ✅ Actionable | Each issue has specific fix recommendation |
| ✅ Prioritized | Issues marked Critical/Medium/Low |

---

## Expected Issues (Reference)

You should find at least these issues:

| # | Issue | Severity |
|---|-------|----------|
| 1 | POST /orders returns 200 instead of 201 | Medium |
| 2 | No operationId on any endpoint | Critical |
| 3 | No descriptions on endpoints | Medium |
| 4 | id parameter not marked required | Medium |
| 5 | DELETE returns 200 instead of 204 | Low |
| 6 | No error responses (400, 401, 404, 500) | Critical |
| 7 | POST request body schema is empty object | Critical |
| 8 | Order schema missing required property types | Critical |
| 9 | items array has no item type definition | Medium |
| 10 | No examples provided anywhere | Medium |
| 11 | No security scheme defined | Critical |
| 12 | No tags for grouping operations | Low |
| 13 | No pagination on list endpoint | Medium |
| 14 | No Problem Details schema for errors | Critical |

---

## Reflection Questions

1. Which issues would cause the most problems in Sprint 1?
2. How would you prioritize fixing these issues before Contract Lock?
3. What automated tools could catch these issues earlier?
4. How did Copilot's analysis compare to your manual review?

---

## Bonus Challenge

Create `FIXED_CONTRACT.yaml` with all issues resolved:

```yaml
openapi: 3.1.0
info:
  title: Order Management API
  version: 1.0.0
  description: API for managing orders in the Order Management System
  contact:
    name: API Support
    email: api-support@example.com

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://api.staging.example.com/v1
    description: Staging

security:
  - bearerAuth: []

tags:
  - name: Orders
    description: Order management operations

paths:
  /api/v1/orders:
    get:
      operationId: listOrders
      summary: List all orders
      description: Retrieve a paginated list of orders for the authenticated user
      tags:
        - Orders
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 0
        - name: size
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: status
          in: query
          schema:
            $ref: '#/components/schemas/OrderStatus'
      responses:
        '200':
          description: Paginated list of orders
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderPage'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalError'

# ... continue with all fixes
```

---

## Tips

- Compare P21 and P23 outputs to see different perspectives
- Use Spectral or other linting tools alongside Copilot
- Keep a checklist of common issues for future reviews
