# Lab 4-1 — Glossary Term Definition

## Goal

Practice defining a domain entity in the Domain Glossary with complete field specifications, type information, constraints, and naming conventions for both API (JSON) and database contexts.

## Timebox

30 minutes

## Prerequisites

- Reviewed [Domain Glossary template](../templates/DOMAIN_GLOSSARY.md)
- Reviewed [DOMAIN_CONTEXT.md](../../../shared/reference-materials/DOMAIN_CONTEXT.md)
- Attended Day 1 Glossary Workshop

## Domain Context

You will define the **Order** entity for the Domain Glossary.

**From DOMAIN_CONTEXT.md:**
- Order has: id, customerId, items, status, total, createdAt, updatedAt
- Order status: Pending → Confirmed → Shipped → Delivered (or Cancelled)
- Order must have at least 1 item, maximum 100 items
- Order total is calculated from item prices × quantities

---

## Task

### Step 1: Define Core Entity (10 min)

Complete the Order entity definition:

```markdown
## Order

### Description

An Order represents a customer's purchase request containing one or more items.
Orders progress through a defined lifecycle from creation to fulfillment or cancellation.

### Naming Conventions

| Context | Format | Example |
|---------|--------|---------|
| API (JSON) | camelCase | `orderId`, `createdAt` |
| Database | snake_case | `order_id`, `created_at` |
| Code (Java) | camelCase | `orderId`, `createdAt` |
| Code (TypeScript) | camelCase | `orderId`, `createdAt` |

### Fields

| Field | API Name | DB Column | Type | Format | Required | Constraints | Description |
|-------|----------|-----------|------|--------|----------|-------------|-------------|
| ID | id | order_id | string | UUID | Yes | Primary key | Unique order identifier |
| Customer | customerId | customer_id | string | UUID | Yes | FK to customers | Customer who placed the order |
| Items | items | - | array | OrderItem[] | Yes | 1-100 items | Line items in the order |
| Status | status | status | string | enum | Yes | See enum below | Current order status |
| Total | total | total | number | decimal(10,2) | Yes | >= 0 | Calculated order total |
| Created | createdAt | created_at | string | date-time | Yes | Immutable | When order was created |
| Updated | updatedAt | updated_at | string | date-time | Yes | Auto-updated | Last modification time |
| Cancelled | cancelledAt | cancelled_at | string | date-time | No | Set on cancel | When order was cancelled |
| Cancel Reason | cancellationReason | cancellation_reason | string | - | No | Max 500 chars | Why order was cancelled |
```

### Step 2: Define Related Types (10 min)

Define the OrderStatus enum and OrderItem type:

```markdown
### OrderStatus (Enum)

| Value | API Value | DB Value | Description | Valid Transitions |
|-------|-----------|----------|-------------|-------------------|
| Pending | "Pending" | "PENDING" | Order created, awaiting confirmation | → Confirmed, → Cancelled |
| Confirmed | "Confirmed" | "CONFIRMED" | Payment confirmed | → Shipped, → Cancelled |
| Shipped | "Shipped" | "SHIPPED" | Order dispatched | → Delivered |
| Delivered | "Delivered" | "DELIVERED" | Order received | (terminal) |
| Cancelled | "Cancelled" | "CANCELLED" | Order cancelled | (terminal) |

### OrderItem (Embedded Object)

| Field | API Name | Type | Required | Constraints | Description |
|-------|----------|------|----------|-------------|-------------|
| Item ID | itemId | string (UUID) | Yes | FK to items | Reference to catalog item |
| Quantity | quantity | integer | Yes | 1-99 | Number of units ordered |
| Unit Price | unitPrice | number | Yes | >= 0 | Price at time of order |
| Subtotal | subtotal | number | Yes | Calculated | quantity × unitPrice |
```

### Step 3: Add Business Rules (10 min)

Document the business rules related to this entity:

```markdown
### Business Rules

| ID | Rule | Enforcement | Error Code |
|----|------|-------------|------------|
| BR-ORDER-001 | Order must have 1-100 items | API validation | 400 |
| BR-ORDER-002 | Total must equal sum of item subtotals | Calculated field | - |
| BR-ORDER-003 | Only Pending/Confirmed orders can be cancelled | Status validation | 409 |
| BR-ORDER-004 | Cancellation within 24 hours only | Time validation | 409 |
| BR-ORDER-005 | Status transitions must follow state machine | Transition validation | 409 |
| BR-ORDER-006 | Customer must exist before order creation | FK validation | 400 |
| BR-ORDER-007 | All items must be in stock at confirmation | Stock check | 409 |

### API Example (JSON)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customerId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "items": [
    {
      "itemId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "quantity": 2,
      "unitPrice": 29.99,
      "subtotal": 59.98
    },
    {
      "itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "quantity": 1,
      "unitPrice": 15.00,
      "subtotal": 15.00
    }
  ],
  "status": "Pending",
  "total": 74.98,
  "createdAt": "2026-01-20T10:30:00Z",
  "updatedAt": "2026-01-20T10:30:00Z",
  "cancelledAt": null,
  "cancellationReason": null
}
```

### Database Schema (SQL)

```sql
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason VARCHAR(500),
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    CONSTRAINT chk_total_positive CHECK (total >= 0)
);

CREATE TABLE order_items (
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(item_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, item_id),
    CONSTRAINT chk_quantity CHECK (quantity BETWEEN 1 AND 99),
    CONSTRAINT chk_prices_positive CHECK (unit_price >= 0 AND subtotal >= 0)
);
```
```

---

## Submission

### Folder Structure

```
/working/contracts/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── GLOSSARY_ORDER.md
└── OPENAPI_SCHEMAS.yaml
```

### Bonus: Generate OpenAPI Schema

Convert your glossary definition to OpenAPI schema:

```yaml
components:
  schemas:
    Order:
      type: object
      required:
        - id
        - customerId
        - items
        - status
        - total
        - createdAt
        - updatedAt
      properties:
        id:
          type: string
          format: uuid
          description: Unique order identifier
          example: "550e8400-e29b-41d4-a716-446655440000"
        customerId:
          type: string
          format: uuid
          description: Customer who placed the order
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
          minItems: 1
          maxItems: 100
        status:
          $ref: '#/components/schemas/OrderStatus'
        total:
          type: number
          format: decimal
          minimum: 0
          description: Calculated order total
        createdAt:
          type: string
          format: date-time
          readOnly: true
        updatedAt:
          type: string
          format: date-time
          readOnly: true
        cancelledAt:
          type: string
          format: date-time
          nullable: true
        cancellationReason:
          type: string
          maxLength: 500
          nullable: true

    OrderItem:
      type: object
      required:
        - itemId
        - quantity
        - unitPrice
        - subtotal
      properties:
        itemId:
          type: string
          format: uuid
        quantity:
          type: integer
          minimum: 1
          maximum: 99
        unitPrice:
          type: number
          format: decimal
          minimum: 0
        subtotal:
          type: number
          format: decimal
          minimum: 0
          readOnly: true

    OrderStatus:
      type: string
      enum:
        - Pending
        - Confirmed
        - Shipped
        - Delivered
        - Cancelled
      description: Current order lifecycle status
```

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ All Fields | All Order fields documented |
| ✅ Naming Conventions | API/DB/Code names specified |
| ✅ Constraints | All constraints documented |
| ✅ Enum Values | Status enum fully defined with transitions |
| ✅ Business Rules | At least 5 rules documented |
| ✅ JSON Example | Complete, valid example |
| ✅ SQL Schema | Database schema matches glossary |

---

## Reflection Questions

1. How does this glossary entry help FE and BE developers stay aligned?
2. What happens if naming conventions differ between API and DB?
3. How would you document a field that's API-only (not stored in DB)?
4. Why is documenting valid status transitions important?

---

## Tips

- Cross-reference with existing [DOMAIN_CONTEXT.md](../../../shared/reference-materials/DOMAIN_CONTEXT.md)
- Use consistent formatting across all glossary entries
- Consider edge cases when defining constraints
