# Domain Glossary Template

**Project:** [Project Name]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [BA / Tech Lead]

---

## Purpose

This Domain Glossary provides **canonical definitions** for all domain terms, entities, fields, and enumerations. Both frontend and backend teams MUST use these definitions to ensure consistency.

**Enforcement:** PRs that use non-standard naming will be rejected.

---

## Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| JSON fields | camelCase | `customerId`, `totalAmount` |
| Database columns | snake_case | `customer_id`, `total_amount` |
| TypeScript types | PascalCase | `Order`, `OrderStatus` |
| Java classes | PascalCase | `Order`, `OrderStatus` |
| URL paths | kebab-case | `/api/v1/order-items` |

---

## Entities

### Order

**Definition:** A request to purchase one or more items, placed by a customer.

**API Path:** `/api/v1/orders`

#### Fields

| Field | Type | JSON | DB Column | Description | Constraints | Example |
|-------|------|------|-----------|-------------|-------------|---------|
| id | Long | `id` | `id` | Unique order identifier | Auto-generated, immutable | `12345` |
| customerId | Long | `customerId` | `customer_id` | Customer who placed order | Required, valid customer | `67890` |
| status | OrderStatus | `status` | `status` | Current order state | Required, valid enum | `"CREATED"` |
| totalAmount | BigDecimal | `totalAmount` | `total_amount` | Calculated total | ≥ 0, 2 decimals | `"149.99"` |
| createdAt | Instant | `createdAt` | `created_at` | Creation timestamp | Auto-set, immutable, UTC | `"2026-01-20T10:30:00Z"` |
| updatedAt | Instant | `updatedAt` | `updated_at` | Last update timestamp | Auto-set, UTC | `"2026-01-20T11:45:00Z"` |
| items | List&lt;OrderItem&gt; | `items` | - | Line items in order | 1-50 items | (array) |

#### Business Rules
- **BR-ORD-001:** Order must contain at least 1 item
- **BR-ORD-002:** Order may contain at most 50 items
- **BR-ORD-004:** Status progresses: CREATED → PROCESSING → SHIPPED → DELIVERED
- **BR-ORD-005:** Orders can only be cancelled in CREATED status

---

### OrderItem

**Definition:** A single line item within an order, referencing an item and quantity.

**API Path:** Nested under Order (`/api/v1/orders/{orderId}/items`)

#### Fields

| Field | Type | JSON | DB Column | Description | Constraints | Example |
|-------|------|------|-----------|-------------|-------------|---------|
| id | Long | `id` | `id` | Unique line item identifier | Auto-generated | `1` |
| orderId | Long | `orderId` | `order_id` | Parent order reference | Required | `12345` |
| itemId | Long | `itemId` | `item_id` | Catalog item reference | Required, valid item | `101` |
| quantity | Integer | `quantity` | `quantity` | Number of items ordered | 1-999 | `2` |
| unitPrice | BigDecimal | `unitPrice` | `unit_price` | Price per unit at order time | ≥ 0, snapshot | `"29.99"` |
| lineTotal | BigDecimal | `lineTotal` | `line_total` | Calculated line total | = quantity × unitPrice | `"59.98"` |

#### Business Rules
- **BR-ITEM-003:** Price is snapshot at time of order creation
- **BR-CALC-001:** `lineTotal = unitPrice × quantity`

---

### Customer

**Definition:** A person or entity that places orders.

**API Path:** `/api/v1/customers`

#### Fields

| Field | Type | JSON | DB Column | Description | Constraints | Example |
|-------|------|------|-----------|-------------|-------------|---------|
| id | Long | `id` | `id` | Unique customer identifier | Auto-generated | `67890` |
| name | String | `name` | `name` | Customer display name | Required, 1-100 chars | `"Jane Smith"` |
| email | String | `email` | `email` | Contact email | Required, valid email | `"jane@example.com"` |
| status | CustomerStatus | `status` | `status` | Account status | Required, valid enum | `"ACTIVE"` |
| createdAt | Instant | `createdAt` | `created_at` | Account creation date | Auto-set, UTC | `"2025-06-15T09:00:00Z"` |

#### Business Rules
- **BR-CUST-001:** Every order must be associated with a valid customer
- **BR-CUST-002:** Only ACTIVE customers may place orders

---

### Item

**Definition:** A product or service available for ordering.

**API Path:** `/api/v1/items`

#### Fields

| Field | Type | JSON | DB Column | Description | Constraints | Example |
|-------|------|------|-----------|-------------|-------------|---------|
| id | Long | `id` | `id` | Unique item identifier | Auto-generated | `101` |
| sku | String | `sku` | `sku` | Stock keeping unit | Required, unique | `"WIDGET-001"` |
| name | String | `name` | `name` | Item display name | Required, 1-200 chars | `"Premium Widget"` |
| description | String | `description` | `description` | Item description | Optional, max 2000 | `"A high-quality widget"` |
| price | BigDecimal | `price` | `price` | Current price | ≥ 0, 2 decimals | `"29.99"` |
| status | ItemStatus | `status` | `status` | Availability status | Required, valid enum | `"AVAILABLE"` |

#### Business Rules
- **BR-ITEM-001:** Every order item must reference a valid item
- **BR-ITEM-002:** Only AVAILABLE items may be added to orders

---

## Enumerations

### OrderStatus

| Value | Description | Allowed Transitions |
|-------|-------------|---------------------|
| `CREATED` | Order placed, awaiting processing | → PROCESSING, → CANCELLED |
| `PROCESSING` | Order being prepared | → SHIPPED |
| `SHIPPED` | Order dispatched for delivery | → DELIVERED |
| `DELIVERED` | Order received by customer | (terminal) |
| `CANCELLED` | Order cancelled | (terminal) |

**OpenAPI:**
```yaml
OrderStatus:
  type: string
  enum: [CREATED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
  description: Order lifecycle status
```

**TypeScript:**
```typescript
type OrderStatus = 'CREATED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
```

**Java:**
```java
public enum OrderStatus {
    CREATED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}
```

---

### CustomerStatus

| Value | Description |
|-------|-------------|
| `ACTIVE` | Customer can place orders |
| `INACTIVE` | Customer account disabled |
| `SUSPENDED` | Customer temporarily blocked |

---

### ItemStatus

| Value | Description |
|-------|-------------|
| `AVAILABLE` | Item can be ordered |
| `OUT_OF_STOCK` | Temporarily unavailable |
| `DISCONTINUED` | Permanently unavailable |

---

## Data Types

### Money

**Representation:** String with exactly 2 decimal places.

| Context | Type | Example |
|---------|------|---------|
| API (JSON) | String | `"149.99"` |
| Backend (Java) | BigDecimal | `new BigDecimal("149.99")` |
| Frontend (TS) | string | `"149.99"` |
| Database | DECIMAL(10,2) | `149.99` |

**Validation Pattern:** `^\d+\.\d{2}$`

**Why String in API:** Avoids floating-point precision issues in JSON.

---

### Date/Time

**Format:** ISO 8601 with UTC timezone.

| Context | Type | Example |
|---------|------|---------|
| API (JSON) | String (ISO 8601) | `"2026-01-20T10:30:00Z"` |
| Backend (Java) | Instant | `Instant.parse("...")` |
| Frontend (TS) | string | `"2026-01-20T10:30:00Z"` |
| Database | TIMESTAMP WITH TIME ZONE | `2026-01-20 10:30:00+00` |

**Rules:**
- Always store and transmit in UTC
- Frontend handles local display conversion
- Use Instant for timestamps, LocalDate for dates without time

---

### Identifiers

| Type | Format | Example |
|------|--------|---------|
| Entity ID | Long/number | `12345` |
| External Ref | String | `"ORD-2026-00012345"` |
| Correlation ID | UUID string | `"550e8400-e29b-41d4-a716-446655440000"` |
| SKU | String | `"WIDGET-001"` |

---

## Pagination

**Standard Response Structure:**

```json
{
  "content": [...],
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 142,
    "totalPages": 8
  }
}
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 0 | Page number (0-indexed) |
| `size` | integer | 20 | Items per page (1-100) |
| `sort` | string | varies | Sort field and direction |

**Sort Format:** `field,direction` (e.g., `createdAt,desc`)

---

## Error Codes

| Code | HTTP Status | Usage |
|------|-------------|-------|
| `validation-error` | 400 | Invalid request data |
| `authentication-required` | 401 | Missing/invalid token |
| `access-denied` | 403 | Insufficient permissions |
| `not-found` | 404 | Resource doesn't exist |
| `conflict` | 409 | State conflict (e.g., already cancelled) |
| `internal-error` | 500 | Unexpected server error |

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| FE Lead | | | |
| BE Lead | | | |
| BA | | | |
| Architect | | | |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial glossary |
| | | | |

---

## Copilot Assistance

Use this prompt to generate glossary entries:

```markdown
No secrets, no production data. Use placeholders.

Based on the domain context in docs/shared/reference-materials/DOMAIN_CONTEXT.md:

Generate a domain glossary entry for the <Entity> entity including:
1. Definition (one sentence)
2. API path
3. Fields table (Field, Type, JSON, DB Column, Description, Constraints, Example)
4. Related business rules
5. Enums (if applicable)

Use the format from docs/content/week-04/templates/DOMAIN_GLOSSARY.md
```
