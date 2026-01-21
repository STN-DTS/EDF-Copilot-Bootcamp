# Example Lab 2 Submission — Backend

**Submitter:** Example User  
**Date:** 2026-01-21  
**Lab:** Lab 2 — Vertical Slice Scaffold (Spring Boot)

---

## What I Did

Scaffolded a vertical slice for the Order Management domain:
1. ✅ Created GET /api/ping endpoint with health response
2. ✅ Added global exception handler returning Problem Details (RFC 7807)
3. ✅ Created GET /api/orders stub returning sample Order data
4. ✅ Added unit and integration tests for both endpoints

---

## Domain Context

Used the Order Management domain from `docs/shared/reference-materials/DOMAIN_CONTEXT.md`:
- Orders (id, customer, items, status)
- Sample data: Order #1, Customer "Alice", Items: Widget + Gadget

---

## Verification Commands Run

```bash
# Build and run all tests
./mvnw clean test
# Result: BUILD SUCCESS
# Tests run: 6, Failures: 0, Errors: 0, Skipped: 0

# Start application
./mvnw spring-boot:run
# Result: Started on port 8080

# Test ping endpoint
curl http://localhost:8080/api/ping
# Result: {"status":"ok"}

# Test orders endpoint
curl http://localhost:8080/api/orders
# Result: [{"id":1,"customerId":1,"items":[1,2],"status":"pending"}]

# Test error handling (404)
curl http://localhost:8080/api/orders/999
# Result: {"type":"about:blank","title":"Not Found","status":404,"detail":"Order not found: 999"}
```

---

## Copilot vs Human

| Category | Details |
|----------|---------|
| **Copilot generated** | Controller skeleton, service interface, test boilerplate, Problem Details configuration |
| **Human verified** | Correct use of @RestController, proper HTTP status codes, test assertions |
| **Human fixed** | Changed @Autowired to constructor injection, fixed import paths, added missing @ResponseStatus |
| **Human wrote** | Custom validation for order ID, edge case tests for empty list |

---

## Plan Followed

See [PLAN.md](PLAN.md) for the approved plan.

**Deviations from plan:**
- Added /api/orders endpoint (optional stretch goal)
- Split tests into unit and integration test classes

---

## Quick Reflection

- **How did breaking into 2–3 steps help?** Allowed me to verify each piece worked before moving on. Caught the import issue early.
- **What did Copilot scaffold well?** Controller structure, test setup, basic CRUD patterns.
- **What needed fixing?** Copilot used field injection; had to change to constructor injection per our standards.
- **Would you structure prompts differently?** Next time, I'll explicitly mention "use constructor injection" in the prompt.

---

## Files Created

```
src/
├── controllers/
│   ├── PingController.java
│   └── OrderController.java
├── services/
│   └── OrderService.java
├── models/
│   └── Order.java
├── exceptions/
│   └── GlobalExceptionHandler.java
└── config/
    └── ProblemDetailsConfig.java

test/
├── controllers/
│   ├── PingControllerTest.java
│   └── OrderControllerIntegrationTest.java
└── services/
    └── OrderServiceTest.java
```

---

## PR Link

[PR #5 — Lab 2 Backend Vertical Slice](https://github.com/example/repo/pull/5)
