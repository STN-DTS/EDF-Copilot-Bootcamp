# Lab 6 Capstone - Backend Example

## Submission Info
- **Name:** Example Submission
- **Date:** 2025-01-20
- **Lab:** Lab 6 - Capstone Mini-Feature

---

## Feature Implemented

**Order Status Transition API** - Complete vertical slice allowing customers to update order status with validation.

### User Story
> As a customer service representative, I want to update an order's status so that customers can track their order progress.

### Acceptance Criteria
- [ ] PUT /api/orders/{id}/status endpoint
- [ ] Validates status transitions (PENDING → CONFIRMED → SHIPPED → DELIVERED)
- [ ] Returns 400 for invalid transitions
- [ ] Returns 404 for non-existent orders
- [ ] Comprehensive test coverage (>80%)

---

## Files Included

```
example_lab6/
├── README.md                    # This file
├── PLAN.md                      # Approved implementation plan
├── src/
│   ├── controllers/
│   │   └── OrderStatusController.java
│   ├── services/
│   │   └── OrderStatusService.java
│   ├── dto/
│   │   └── StatusUpdateRequest.java
│   └── exceptions/
│       └── InvalidStatusTransitionException.java
└── test/
    ├── controllers/
    │   └── OrderStatusControllerTest.java
    └── services/
        └── OrderStatusServiceTest.java
```

---

## Verification Commands Run

```bash
# Build verification
./mvnw clean compile
# ✅ BUILD SUCCESS

# Test execution
./mvnw test -Dtest=OrderStatus*
# ✅ Tests run: 12, Failures: 0, Errors: 0

# Coverage check
./mvnw jacoco:report
# ✅ Line coverage: 94%, Branch coverage: 87%

# Linting
./mvnw checkstyle:check
# ✅ No violations
```

---

## Copilot vs Human Notes

| Component | AI Generated | Human Modified | Reason |
|-----------|--------------|----------------|--------|
| StatusUpdateRequest DTO | ✅ 100% | - | Simple POJO |
| OrderStatusService | ✅ 90% | 10% | Added CANCELLED edge case |
| OrderStatusController | ✅ 85% | 15% | Fixed Problem Details format |
| Controller Tests | ✅ 70% | 30% | Added edge case scenarios |
| Service Tests | ✅ 80% | 20% | Improved assertion messages |
| Exception class | ✅ 100% | - | Standard pattern |

### Key Human Interventions
1. **Status transition matrix** - Copilot suggested linear progression only; added CANCELLED as valid from any state
2. **Problem Details** - Copilot returned generic 400; changed to RFC 7807 format per backend standards
3. **Test naming** - Standardized to `should_ExpectedBehavior_When_Condition` pattern

---

## Reflection Answers

### What AI-assisted patterns worked well?
The iterative refinement pattern (P7) was highly effective. Starting with a basic implementation and asking Copilot to "add validation for status transitions" produced cleaner code than trying to specify everything upfront.

### What required human judgment?
Business rules for the status state machine. Copilot suggested a simple linear progression, but the business allows cancellation from any state - this domain knowledge came from the DOMAIN_CONTEXT.md file.

### What would you do differently next time?
Start with the test file first (TDD). I wrote implementation first, then tests, and had to refactor when tests revealed edge cases. The TDD approach from Lab 3 would have caught these earlier.

---

## Time Tracking

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Planning (P0) | 10 min | 8 min | Plan approved on first iteration |
| Tests First | 20 min | 25 min | Added more edge cases |
| Implementation | 30 min | 35 min | Status matrix took extra time |
| Integration | 15 min | 10 min | Smooth with existing Order entity |
| Documentation | 15 min | 12 min | Copilot helped with README |
| **Total** | **90 min** | **90 min** | On target |

