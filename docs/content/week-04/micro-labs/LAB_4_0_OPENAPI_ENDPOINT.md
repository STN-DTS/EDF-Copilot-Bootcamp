# Lab 4-0 — OpenAPI Endpoint Design with P17

## Goal

Practice using Copilot's P17 prompt to design a complete OpenAPI endpoint specification including request schema, response schema, error responses, and examples.

## Timebox

45 minutes

## Prerequisites

- Reviewed [OpenAPI contract](../contracts/openapi.yaml)
- Reviewed [Domain Glossary template](../templates/DOMAIN_GLOSSARY.md)
- Attended Day 1 Glossary Workshop
- Familiar with OpenAPI 3.1 basics

## Domain Context

You are designing the **Cancel Order** endpoint for the Order Management System.

**Business Rules:**
- Only orders with status "Pending" or "Confirmed" can be cancelled
- Cancellation window: 24 hours from order creation
- Customer must provide a cancellation reason
- Returns 409 Conflict if order cannot be cancelled

---

## Task

### Step 1: Use P17 Prompt (15 min)

Open Copilot Chat and use the P17 prompt:

```markdown
No secrets, no production data. Use placeholders.

Generate an OpenAPI 3.1 specification for:

**Endpoint:** POST /api/v1/orders/{orderId}/cancel
**Purpose:** Cancel an existing order

**Business Rules:**
- Only Pending or Confirmed orders can be cancelled
- Cancellation must be within 24 hours of creation
- Requires cancellation reason

**Request Body:**
- reason (required, string, max 500 chars)

**Success Response (200):**
- Full order object with status "Cancelled"
- cancellationReason field populated
- cancelledAt timestamp

**Error Responses:**
- 400 Bad Request (missing/invalid reason)
- 401 Unauthorized (not logged in)
- 403 Forbidden (not order owner)
- 404 Not Found (order doesn't exist)
- 409 Conflict (order not cancellable - wrong status or window expired)

Use RFC 7807 Problem Details for errors.
Include request/response examples.
Use $ref for reusable schemas.
```

### Step 2: Review and Enhance (15 min)

Review the generated OpenAPI for:

| Criterion | Question | ✓ |
|-----------|----------|---|
| **operationId** | Does it have a unique operationId? | |
| **Parameters** | Is orderId properly defined? | |
| **Request Schema** | Is reason required with max length? | |
| **Response Schema** | Does it include all order fields? | |
| **Error Responses** | Are all 5 error codes defined? | |
| **Problem Details** | Do errors use RFC 7807 format? | |
| **Examples** | Are there examples for success AND error? | |
| **Security** | Is authentication required? | |

**Enhance the specification:**
1. Add any missing error responses
2. Ensure examples are realistic
3. Add description for business logic
4. Verify $ref usage for schemas

### Step 3: Document Your Analysis (15 min)

Create your submission:

```yaml
# My enhanced specification
paths:
  /api/v1/orders/{orderId}/cancel:
    post:
      operationId: cancelOrder
      summary: Cancel an existing order
      description: |
        Cancels an order if it is in Pending or Confirmed status
        and within the 24-hour cancellation window.
      tags:
        - Orders
      security:
        - bearerAuth: []
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
            format: uuid
          description: The unique identifier of the order to cancel
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CancelOrderRequest'
            example:
              reason: "Changed my mind about the purchase"
      responses:
        '200':
          description: Order successfully cancelled
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '409':
          $ref: '#/components/responses/Conflict'
```

Include a CHANGELOG noting what you added/changed from Copilot's output.

---

## Submission

### Folder Structure

```
/working/contracts/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── cancel-order-endpoint.yaml
├── COPILOT_ORIGINAL.yaml
└── CHANGELOG.md
```

### README.md Must Include

- Your name and date
- Lab number: **Lab 4-0**
- P17 prompt used (exact text)
- Summary of enhancements made
- Reflection answers

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ P17 Used | Prompt submitted with Copilot response |
| ✅ Complete Spec | All required elements present |
| ✅ Error Responses | All 5 error codes with Problem Details |
| ✅ Examples | Both success and error examples |
| ✅ Human Enhancements | At least 2 improvements documented |
| ✅ Valid YAML | Passes OpenAPI validator |

---

## Reflection Questions

1. What did Copilot generate well? What did it miss?
2. How would a FE developer use this specification?
3. What tests would you write based on this contract?

---

## Expected Output (Partial)

```yaml
components:
  schemas:
    CancelOrderRequest:
      type: object
      required:
        - reason
      properties:
        reason:
          type: string
          maxLength: 500
          description: The reason for cancelling the order
          example: "Changed my mind about the purchase"

    Order:
      type: object
      properties:
        id:
          type: string
          format: uuid
        customerId:
          type: string
          format: uuid
        status:
          $ref: '#/components/schemas/OrderStatus'
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
        total:
          type: number
          format: decimal
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        cancelledAt:
          type: string
          format: date-time
          nullable: true
        cancellationReason:
          type: string
          nullable: true

  responses:
    Conflict:
      description: Order cannot be cancelled (wrong status or window expired)
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetail'
          example:
            type: "https://api.example.com/errors/order-not-cancellable"
            title: "Order Not Cancellable"
            status: 409
            detail: "Order ORD-12345 has status 'Shipped' and cannot be cancelled"
            instance: "/api/v1/orders/ORD-12345/cancel"
```

---

## Tips

- Use Copilot's `/explain` to understand generated schemas
- Validate your YAML with an online OpenAPI validator
- Compare your output with [examples/endpoint-orders-list.yaml](../examples/endpoint-orders-list.yaml)
