# Sprint 1 FAQ

> Common questions for Sprint 1: Thin Vertical Slice (Weeks 5-6)

---

## Sprint Planning Questions

### How do I scope a "thin vertical slice"?

**Definition:** A thin vertical slice is a minimal feature that exercises every layer of the stack — from UI to database and back.

**Good Slice Characteristics:**
- Touches all layers (UI → Route → API → Service → Repository → DB)
- Minimal scope (one journey, one entity)
- Proves integration works end-to-end
- Includes basic error handling and logging

**Example Slice:**
```
Order List Journey:
├── UI: Table showing orders
├── Route: /orders with loader
├── API: GET /api/v1/orders
├── Service: OrderService.findAll()
├── Repository: OrderRepository
└── DB: Orders table query
```

**Not a Thin Slice:**
- All CRUD operations for all entities
- Multiple user journeys
- Complex filtering/pagination
- Fancy UI components

---

### How detailed should Sprint Packet tasks be?

**Granularity Guide:**

| Task Size | Description | Example |
|-----------|-------------|---------|
| ❌ Too big | Multi-day, unclear scope | "Implement orders" |
| ⚠️ Borderline | Could be split | "Order list with pagination" |
| ✅ Just right | 0.5-1 day, clear AC | "Create OrderController GET endpoint" |
| ❌ Too small | Micro-level | "Add import statement" |

**Each task should have:**
- Clear acceptance criteria
- Estimated points (1-5)
- Single owner
- Known dependencies

---

### What if the backend API isn't ready?

**Frontend Options:**
1. **Use MSW (Mock Service Worker)** — Primary approach
2. **Create mock handlers** — Generate from OpenAPI contract
3. **Develop against contract** — Use `.yaml` as source of truth
4. **Integrate later** — Switch to real API in Week 6

**Copilot Prompt for MSW Handler:**
```markdown
No secrets, no production data. Use placeholders.

Generate an MSW handler for GET /api/v1/orders based on the contract.
Use the entities from docs/shared/reference-materials/DOMAIN_CONTEXT.md.
Follow patterns in .github/instructions/frontend.instructions.md.
```

---

### What if frontend and backend have different estimates?

**Resolution Process:**
1. **Review dependencies** — Does FE depend on BE or vice versa?
2. **Identify parallelism** — What can happen simultaneously?
3. **Use mocks** — FE can proceed with MSW while BE builds
4. **Adjust scope** — If estimates exceed capacity, reduce scope
5. **Escalate** — If deadlock, Tech Leads resolve

**Sprint 1 Principle:** Prove integration over feature breadth.

---

## Working with Teammates

### How do I coordinate with my pair?

**Daily Practices:**
1. **Standup sync** — Share blockers, agree on priorities
2. **Contract as truth** — Reference OpenAPI, not ad-hoc agreements
3. **PR reviews** — Review partner's code same-day
4. **Integration points** — Agree on integration timing

**Communication Channels:**
| Type | Channel | Response Time |
|------|---------|---------------|
| Blocker | Slack/Teams DM | < 1 hour |
| Question | Team channel | < 4 hours |
| FYI | PR comment | Next business day |

---

### When should I escalate a blocker?

**Escalation Trigger:**
- Blocked for more than 2 hours
- Missing dependency from another team
- Technical issue outside your control
- Scope disagreement with partner

**Escalation Path:**
1. **Pair** — Ask your FE/BE partner first
2. **Team Lead** — Technical blockers, tooling issues
3. **Product Owner** — Scope questions, requirement clarity
4. **Facilitator** — Process issues, interpersonal conflicts

---

## Backend-Specific Questions

### How do I structure my Spring Boot project?

**Required Layers:**
```
src/main/java/com/example/orders/
├── config/           # Configuration classes
├── controller/       # REST endpoints
├── service/          # Business logic
├── repository/       # Data access
├── model/            # Domain entities
├── dto/              # Request/Response objects
└── exception/        # Custom exceptions
```

**Layer Responsibilities:**

| Layer | Responsibility | Calls |
|-------|----------------|-------|
| Controller | HTTP handling, validation | Service |
| Service | Business logic, transactions | Repository |
| Repository | Data access | Database |
| DTO | API shape | — |
| Model | Domain entities | — |

---

### What tests do I need for Sprint 1?

**Minimum Test Coverage:**

| Layer | Test Type | Coverage Target |
|-------|-----------|-----------------|
| Controller | @WebMvcTest | All endpoints |
| Service | Unit tests with mocks | All methods |
| Repository | @DataJpaTest | CRUD operations |
| Integration | @SpringBootTest | Happy path |

**Sprint 1 Focus:** Prove all layers work together. Comprehensive coverage comes in Sprint 2.

---

### How do I handle database in tests?

**Options:**

| Approach | When to Use | Pros | Cons |
|----------|-------------|------|------|
| H2 (in-memory) | Fast unit tests | Fast, no setup | May differ from Oracle |
| Testcontainers | Integration tests | Real Oracle | Slower, Docker required |
| @MockBean | Service tests | Isolated | Less realistic |

**Recommended Strategy:**
- Unit tests: H2 or mocks
- Integration tests: Testcontainers with Oracle image
- CI: Testcontainers

---

## Frontend-Specific Questions

### How do I set up React Router v7 loaders?

**Loader Pattern:**
```typescript
// routes/orders.tsx
export async function loader() {
  const response = await fetch('/api/v1/orders');
  if (!response.ok) {
    throw new Response('Failed to load orders', { status: response.status });
  }
  return response.json();
}

export default function OrdersRoute() {
  const orders = useLoaderData<Order[]>();
  return <OrderList orders={orders} />;
}
```

**Key Points:**
- Loader runs before component renders
- Use `useLoaderData()` to access data
- Throw `Response` objects for error handling
- Follow patterns in `frontend.instructions.md`

---

### How do I handle loading states?

**React Router v7 Approach:**
```typescript
// Using navigation state
import { useNavigation } from 'react-router-dom';

function OrderList() {
  const navigation = useNavigation();
  
  if (navigation.state === 'loading') {
    return <LoadingSpinner />;
  }
  
  return <OrderTable />;
}
```

**Skeleton Pattern:**
```typescript
// OrderListSkeleton.tsx
export function OrderListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading orders">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </div>
  );
}
```

---

### What if MSW handlers don't match the contract?

**Verification Steps:**
1. **Compare to OpenAPI** — Run `npx @redocly/cli lint openapi.yaml`
2. **Check types** — Ensure TypeScript interfaces match
3. **Test with contract tests** — Verify request/response shapes
4. **Ask backend** — When in doubt, confirm with BE partner

**Common Mismatches:**
| Issue | Solution |
|-------|----------|
| Missing field | Add to both handler and type |
| Wrong type | Update to match OpenAPI |
| Extra field | Remove or update contract |
| Different casing | Use camelCase in API |

---

## Demo Preparation

### What should I demo in Sprint 1?

**Demo Structure (10-15 minutes):**

| Segment | Duration | Content |
|---------|----------|---------|
| Context | 2 min | Sprint goal reminder |
| FE Journey | 4 min | UI walkthrough |
| BE API | 3 min | Postman/Swagger demo |
| Integration | 3 min | End-to-end flow |
| Tests | 2 min | Test run and coverage |
| Q&A | 2 min | Stakeholder questions |

**Sprint 1 Specific Demos:**
- ✅ Auth flow (login → protected route)
- ✅ Core journey (Order List → Order Detail)
- ✅ Real API call (not mocks)
- ✅ Logging in action
- ✅ Test suite passing

---

### What if something breaks during demo?

**Recovery Strategies:**
1. **Have fallback** — Recorded video backup
2. **Use mocks** — Switch to MSW if API fails
3. **Acknowledge** — Don't hide issues, explain them
4. **Show tests** — Prove it works even if demo fails
5. **Move on** — Don't debug live

**Pre-Demo Checklist:**
- [ ] Test full flow 1 hour before
- [ ] Clear browser cache
- [ ] Use demo account, not personal
- [ ] Check network connectivity
- [ ] Have backup slides ready

---

## Common Sprint 1 Issues

### "My tests pass locally but fail in CI"

**Common Causes:**

| Cause | Solution |
|-------|----------|
| Docker not running | Ensure Testcontainers can access Docker |
| Port conflicts | Use random ports in tests |
| Environment variables | Check CI environment config |
| Timing issues | Add waits or use test utilities |
| Missing dependencies | Check `pom.xml` / `package.json` |

**Debug Steps:**
```bash
# Reproduce locally with CI-like environment
docker-compose down -v
./mvnw clean test

# Check specific test
./mvnw test -Dtest=OrderControllerTest
```

---

### "The contract changed mid-sprint"

**Response Protocol:**
1. **Assess impact** — What code is affected?
2. **Time-box fix** — Is it doable this sprint?
3. **Communicate** — Inform team and stakeholders
4. **Document** — Note in retro items
5. **Prevent** — Lock contract before sprint starts

**Sprint 1 Rule:** Contract should be locked before Day 1. Changes after lock require Tech Lead approval.

---

## Related Resources

| Resource | Location |
|----------|----------|
| Sprint 1 Program | [SPRINT_1_PROGRAM.md](SPRINT_1_PROGRAM.md) |
| Sprint Packet | [sprint-packet/SPRINT_PACKET.md](sprint-packet/SPRINT_PACKET.md) |
| Domain Context | [../../shared/reference-materials/DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md) |
| Prompt Pack | [../../shared/reference-materials/PROMPT_PACK_V1.md](../../shared/reference-materials/PROMPT_PACK_V1.md) |
| Frontend Instructions | [../../../.github/instructions/frontend.instructions.md](../../../.github/instructions/frontend.instructions.md) |
| Backend Instructions | [../../../.github/instructions/backend.instructions.md](../../../.github/instructions/backend.instructions.md) |
| Testing Instructions | [../../../.github/instructions/testing.instructions.md](../../../.github/instructions/testing.instructions.md) |

---

## Need More Help?

- **Technical blocker:** Ask your Tech Lead
- **Process question:** Ask the Facilitator
- **Scope question:** Ask the Product Owner
- **Copilot issue:** Check the [Week 1 FAQ](../week-01/FAQ.md)
