# Business Domain Context: Order Management

## Overview

All Week 1 labs use the **Order Management** domain for realistic exercises. This domain is simple enough to understand quickly but rich enough to demonstrate real patterns.

---

## Entities

### Order
| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | Unique identifier |
| `customerId` | Long | Reference to Customer |
| `items` | List<Long> | List of Item IDs |
| `status` | String | Order status (see below) |
| `createdAt` | DateTime | When order was created |
| `total` | Decimal | Calculated from item prices |

**Order Statuses:**
- `pending` — Order created, not yet processed
- `processing` — Order is being fulfilled
- `completed` — Order delivered
- `cancelled` — Order was cancelled

### Customer
| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | Unique identifier |
| `name` | String | Customer full name |
| `email` | String | Customer email address |

### Item
| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | Unique identifier |
| `name` | String | Item name |
| `price` | Decimal | Item price in dollars |

---

## Entity Relationships

```
┌──────────────┐       ┌──────────────┐
│   Customer   │       │     Item     │
│──────────────│       │──────────────│
│ id           │       │ id           │
│ name         │       │ name         │
│ email        │       │ price        │
└──────┬───────┘       └──────┬───────┘
       │                      │
       │ 1                    │ *
       ▼                      ▼
┌──────────────────────────────────────┐
│               Order                  │
│──────────────────────────────────────│
│ id                                   │
│ customerId (FK → Customer)           │
│ items (FK[] → Item)                  │
│ status                               │
│ createdAt                            │
│ total (calculated)                   │
└──────────────────────────────────────┘
```

**Relationships:**
- One Customer can have many Orders (1:N)
- One Order can have many Items (N:M via order_items)
- Total is calculated as sum of item prices

---

## Sample Data

### Customers
```json
[
  { "id": 1, "name": "Alice Johnson", "email": "alice@example.com" },
  { "id": 2, "name": "Bob Smith", "email": "bob@example.com" },
  { "id": 3, "name": "Carol White", "email": "carol@example.com" }
]
```

### Items
```json
[
  { "id": 1, "name": "Widget", "price": 9.99 },
  { "id": 2, "name": "Gadget", "price": 14.99 },
  { "id": 3, "name": "Gizmo", "price": 24.99 },
  { "id": 4, "name": "Thingamajig", "price": 4.99 }
]
```

### Orders
```json
[
  {
    "id": 1,
    "customerId": 1,
    "items": [1, 2],
    "status": "pending",
    "createdAt": "2026-01-20T10:30:00Z",
    "total": 24.98
  },
  {
    "id": 2,
    "customerId": 2,
    "items": [3],
    "status": "completed",
    "createdAt": "2026-01-19T14:15:00Z",
    "total": 24.99
  },
  {
    "id": 3,
    "customerId": 1,
    "items": [1, 3, 4],
    "status": "processing",
    "createdAt": "2026-01-20T09:00:00Z",
    "total": 39.97
  }
]
```

---

## Use Cases by Lab

### Lab 2: Vertical Slice Scaffold
- **BE:** GET /api/orders → return all orders
- **FE:** /orders route → display order list

### Lab 3: Tests First
Sample acceptance criteria:
- Given an order ID, return the order with calculated total
- Return 404 with Problem Details if order not found
- Order total equals sum of item prices
- Orders can be filtered by status

### Lab 4: Refactor + OpenShift
- Refactor: Extract order total calculation to service
- OpenShift: Expose /api/orders via health-checked deployment

### Lab 5: Capstone
Choose one:
- Create new order with validation
- Update order status
- Order details with customer name and item list
- Filter orders by status

---

## API Endpoints (Reference)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | List all orders |
| GET | /api/orders/:id | Get order by ID |
| POST | /api/orders | Create new order |
| PATCH | /api/orders/:id | Update order (status) |
| DELETE | /api/orders/:id | Cancel order |
| GET | /api/orders?status=pending | Filter by status |
| GET | /api/customers | List all customers |
| GET | /api/customers/:id | Get customer by ID |
| GET | /api/items | List all items |

---

## TypeScript Types (Frontend)

```typescript
// src/types/order.ts

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  customerId: number;
  items: number[];
  status: OrderStatus;
  createdAt: string;
  total: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface Item {
  id: number;
  name: string;
  price: number;
}

// Expanded order with related data
export interface OrderWithDetails extends Order {
  customer: Customer;
  itemDetails: Item[];
}
```

---

## Java Classes (Backend)

```java
// src/main/java/com/example/models/Order.java

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "customer_id", nullable = false)
    private Long customerId;
    
    @ElementCollection
    @CollectionTable(name = "order_items")
    private List<Long> items;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private LocalDateTime createdAt;
    
    @Transient
    private BigDecimal total;
    
    // Getters, setters, constructors
}

public enum OrderStatus {
    PENDING, PROCESSING, COMPLETED, CANCELLED
}
```

---

## Problem Details Examples

### 404 Not Found
```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Order not found: 999",
  "instance": "/api/orders/999"
}
```

### 400 Bad Request
```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Invalid order status: 'unknown'",
  "instance": "/api/orders/1"
}
```

---

## Test Data Factories

### Backend (Java)
```java
public class TestDataFactory {
    public static Order createSampleOrder() {
        Order order = new Order();
        order.setId(1L);
        order.setCustomerId(1L);
        order.setItems(List.of(1L, 2L));
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        return order;
    }
}
```

### Frontend (TypeScript)
```typescript
export const testData = {
  orders: [
    { id: 1, customerId: 1, items: [1, 2], status: 'pending', createdAt: '2026-01-20T10:30:00Z', total: 24.98 }
  ],
  customers: [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' }
  ],
  items: [
    { id: 1, name: 'Widget', price: 9.99 },
    { id: 2, name: 'Gadget', price: 14.99 }
  ]
};
```
