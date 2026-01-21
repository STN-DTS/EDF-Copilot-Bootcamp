# Implementation Plan - Order Status Transition API

> Generated with Copilot using P0 prompt, then refined with human review.

## 1. Scope Definition

### In Scope
- PUT endpoint for status updates
- Status transition validation logic
- Unit tests for service layer
- Integration tests for controller
- Exception handling with Problem Details

### Out of Scope
- Audit logging (future enhancement)
- Email notifications on status change
- Bulk status updates
- Historical status tracking

---

## 2. Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `OrderStatusController.java` | CREATE | REST endpoint |
| `OrderStatusService.java` | CREATE | Business logic |
| `StatusUpdateRequest.java` | CREATE | Request DTO |
| `InvalidStatusTransitionException.java` | CREATE | Custom exception |
| `OrderStatusControllerTest.java` | CREATE | Controller tests |
| `OrderStatusServiceTest.java` | CREATE | Service tests |
| `GlobalExceptionHandler.java` | MODIFY | Add new exception mapping |

---

## 3. Status Transition Matrix

```
Current State    → Valid Next States
─────────────────────────────────────
PENDING          → CONFIRMED, CANCELLED
CONFIRMED        → SHIPPED, CANCELLED
SHIPPED          → DELIVERED, CANCELLED
DELIVERED        → (terminal state)
CANCELLED        → (terminal state)
```

---

## 4. Implementation Steps

### Step 1: Create DTO (5 min)
```java
public record StatusUpdateRequest(
    @NotNull OrderStatus newStatus,
    String reason  // Optional, required for CANCELLED
) {}
```

### Step 2: Create Exception (5 min)
```java
public class InvalidStatusTransitionException extends RuntimeException {
    private final OrderStatus currentStatus;
    private final OrderStatus requestedStatus;
}
```

### Step 3: Implement Service (20 min)
- Add transition validation method
- Inject OrderRepository
- Update and persist order

### Step 4: Implement Controller (15 min)
- PUT /api/orders/{id}/status
- Validate request body
- Return 200 with updated order

### Step 5: Write Tests (30 min)
- Service: 6 test cases (valid transitions, invalid transitions, not found)
- Controller: 6 test cases (success, 400, 404, validation errors)

### Step 6: Update Exception Handler (5 min)
- Map InvalidStatusTransitionException → 400 Problem Details

---

## 5. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missing transition edge case | Medium | Medium | Use state machine pattern |
| Race condition on status update | Low | High | Add optimistic locking |
| Performance with large orders | Low | Low | Status update is lightweight |

---

## 6. Testing Strategy

### Unit Tests (Service Layer)
```
✓ should transition from PENDING to CONFIRMED
✓ should transition from CONFIRMED to SHIPPED
✓ should transition from SHIPPED to DELIVERED
✓ should allow CANCELLED from any non-terminal state
✓ should reject PENDING to DELIVERED (skip not allowed)
✓ should throw when order not found
```

### Integration Tests (Controller)
```
✓ PUT /api/orders/{id}/status returns 200 with valid transition
✓ PUT /api/orders/{id}/status returns 400 with invalid transition
✓ PUT /api/orders/{id}/status returns 404 when order not found
✓ PUT /api/orders/{id}/status returns 400 when status is null
✓ PUT /api/orders/{id}/status returns 400 when reason missing for CANCELLED
✓ Response body matches Problem Details schema
```

---

## 7. Acceptance Checklist

- [ ] All tests pass (`./mvnw test`)
- [ ] Code compiles without warnings
- [ ] Checkstyle passes
- [ ] Coverage > 80%
- [ ] Problem Details format verified
- [ ] README.md complete with reflection answers

---

## Plan Approval

- **Reviewed by:** [Instructor/Peer Name]
- **Date:** [Date]
- **Status:** ✅ Approved / ⚠️ Approved with changes / ❌ Needs revision

**Notes:** 
