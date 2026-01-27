# Sprint 4 FAQ

> Common questions for Sprint 4: Polish + Ship (Weeks 11-12)

---

## Production Readiness Questions

### What does "production ready" mean?

**Production Readiness Definition:**

| Category | Criteria | Evidence |
|----------|----------|----------|
| **Functionality** | All features working | Test suite passing |
| **Performance** | Meets benchmarks | Load test results |
| **Security** | OWASP addressed | Security scan clean |
| **Accessibility** | WCAG 2.1 AA | Accessibility audit |
| **Documentation** | Complete and accurate | Review completed |
| **Operations** | Monitoring + runbooks | Dashboards configured |
| **Deployment** | Staging verified | Successful deploy |

**Gate 5 Checklist:**
- [ ] All user stories complete
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] Accessibility audit passed
- [ ] Documentation complete
- [ ] Monitoring configured
- [ ] Staging deployment successful
- [ ] Stakeholder demo accepted

---

### What's the difference between "done" and "ship-ready"?

| Aspect | "Done" | "Ship-Ready" |
|--------|--------|--------------|
| **Features** | Implemented | Polished, edge cases handled |
| **Tests** | Written | Comprehensive, documented |
| **Performance** | Works | Optimized, benchmarked |
| **Security** | Addressed | Hardened, audited |
| **Docs** | Some | Complete, reviewed |
| **Operations** | Basic | Monitoring, runbooks, alerts |

**Sprint 4 Focus:** Bridge the gap from "done" to "ship-ready."

---

### How do I know if we're ready to ship?

**Ship-Ready Confidence Checklist:**

```markdown
## Can We Ship? Score each 1-5

### Functionality (Target: 25)
- [ ] All user stories accepted by PO (1-5)
- [ ] All tests passing, >80% coverage (1-5)
- [ ] Edge cases handled gracefully (1-5)
- [ ] Error states provide good UX (1-5)
- [ ] Data integrity verified (1-5)

### Performance (Target: 15)
- [ ] API p95 <500ms verified (1-5)
- [ ] Frontend Lighthouse >90 (1-5)
- [ ] No N+1 or obvious bottlenecks (1-5)

### Security (Target: 15)
- [ ] OWASP Top 10 addressed (1-5)
- [ ] Dependency scan clean (1-5)
- [ ] Security review passed (1-5)

### Operations (Target: 15)
- [ ] Monitoring dashboards working (1-5)
- [ ] Alerting configured (1-5)
- [ ] Runbooks complete (1-5)

### Documentation (Target: 10)
- [ ] User documentation complete (1-5)
- [ ] API documentation complete (1-5)

Total: ___ / 80 (Threshold: 65 to ship)
```

---

## Performance Optimization Questions

### Where should I start with performance optimization?

**Optimization Priority:**

| Priority | Focus | Impact | Effort |
|----------|-------|--------|--------|
| 1st | Database queries | High | Medium |
| 2nd | N+1 query fixes | High | Low |
| 3rd | Caching strategy | High | Medium |
| 4th | Bundle size | Medium | Low |
| 5th | API response size | Medium | Low |
| 6th | Image optimization | Medium | Low |
| 7th | Code splitting | Medium | Medium |

**Start with Measurement:**
```bash
# Backend: Enable query logging
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Frontend: Analyze bundle
npm run build -- --analyze
```

---

### How do I fix N+1 query problems?

**Detection:**
```sql
-- Enable query logging and look for patterns like:
SELECT * FROM orders WHERE id = ?  -- executed 100 times
```

**Solutions:**

| Pattern | Solution | Example |
|---------|----------|---------|
| Collection fetch | `@EntityGraph` | `@EntityGraph(attributePaths = {"items"})` |
| Join fetch | JPQL JOIN FETCH | `SELECT o FROM Order o JOIN FETCH o.items` |
| Batch fetching | `@BatchSize` | `@BatchSize(size = 25)` |
| DTO projection | Constructor expression | `SELECT new OrderSummary(o.id, o.status)` |

**Example Fix:**
```java
// BEFORE: N+1 problem
@Query("SELECT o FROM Order o WHERE o.status = :status")
List<Order> findByStatus(OrderStatus status);
// Triggers N additional queries to fetch items

// AFTER: JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.status = :status")
List<Order> findByStatusWithItems(OrderStatus status);
// Single query with JOIN
```

---

### How do I reduce frontend bundle size?

**Analysis:**
```bash
# Build with size analysis
npm run build
npx source-map-explorer dist/assets/*.js
```

**Common Wins:**

| Technique | Savings | How |
|-----------|---------|-----|
| Tree shaking | 20-40% | Import only what you need |
| Code splitting | 30-50% | Lazy load routes |
| Dependency audit | 10-30% | Remove unused deps |
| Image optimization | 50-80% | WebP, proper sizing |
| Minification | 30-50% | Already done by Vite |

**Code Splitting Example:**
```typescript
// routes/index.tsx
import { lazy } from 'react';

const OrderList = lazy(() => import('./orders'));
const OrderDetail = lazy(() => import('./orders.$orderId'));
const CreateOrder = lazy(() => import('./orders.new'));
```

---

### What performance benchmarks should I meet?

**Sprint 4 Targets:**

| Metric | Target | Tool |
|--------|--------|------|
| API p95 latency | <500ms | k6, JMeter |
| API p99 latency | <1000ms | k6, JMeter |
| Initial bundle | <200KB | Vite build |
| First Contentful Paint | <1.5s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| Time to Interactive | <3.5s | Lighthouse |
| Cumulative Layout Shift | <0.1 | Lighthouse |
| Lighthouse Performance | >90 | Lighthouse |

---

## Accessibility Compliance Questions

### What does WCAG 2.1 AA compliance require?

**Key WCAG 2.1 AA Requirements:**

| Principle | Requirement | Check |
|-----------|-------------|-------|
| **Perceivable** | Alt text for images | All `<img>` have `alt` |
| | Color contrast | 4.5:1 for text |
| | Resize support | Works at 200% zoom |
| **Operable** | Keyboard navigation | All interactive elements focusable |
| | No keyboard traps | Can always tab out |
| | Focus visible | Clear focus indicators |
| **Understandable** | Language declared | `<html lang="en">` |
| | Form labels | All inputs have labels |
| | Error identification | Clear error messages |
| **Robust** | Valid HTML | No parsing errors |
| | ARIA usage | Correct ARIA patterns |

---

### How do I run an accessibility audit?

**Automated Testing:**
```bash
# axe-core CLI
npx @axe-core/cli http://localhost:3000/orders

# Lighthouse accessibility audit
npx lighthouse http://localhost:3000/orders --only-categories=accessibility

# In browser console
axe.run().then(results => console.log(results));
```

**Manual Testing Checklist:**
- [ ] Navigate entire app with keyboard only
- [ ] Use screen reader (VoiceOver, NVDA)
- [ ] Test at 200% zoom
- [ ] Check color contrast with browser tools
- [ ] Verify focus indicators visible

---

### How do I fix common accessibility issues?

| Issue | Fix | Example |
|-------|-----|---------|
| Missing alt text | Add descriptive alt | `<img alt="Order confirmation">` |
| No form labels | Add label element | `<label htmlFor="email">Email</label>` |
| Low contrast | Increase contrast ratio | Adjust colors to 4.5:1 |
| No focus style | Add focus CSS | `:focus-visible { outline: 2px solid blue }` |
| Non-semantic buttons | Use button element | `<button>` not `<div onClick>` |
| Missing headings | Add heading structure | Proper h1 → h2 → h3 order |

---

## Documentation Requirements Questions

### What documentation do I need to complete?

**Sprint 4 Documentation Checklist:**

| Document | Audience | Content |
|----------|----------|---------|
| **User Guide** | End users | How to use features |
| **API Documentation** | Consumers | Endpoints, examples |
| **Architecture Docs** | Developers | System design decisions |
| **Runbooks** | Operations | Incident response |
| **README** | Developers | Getting started |
| **Change Log** | All | What changed |

---

### What makes good API documentation?

**API Documentation Essentials:**

```yaml
# For each endpoint, document:
paths:
  /api/v1/orders:
    get:
      summary: List all orders
      description: |
        Returns a paginated list of orders for the authenticated user.
        Supports filtering by status and date range.
      parameters:
        - name: status
          in: query
          description: Filter by order status
          schema:
            type: string
            enum: [Pending, Confirmed, Shipped, Delivered, Cancelled]
        - name: page
          in: query
          description: Page number (0-indexed)
          schema:
            type: integer
            default: 0
      responses:
        200:
          description: Orders retrieved successfully
          content:
            application/json:
              example:
                content: [{ id: "ORD-001", status: "Pending" }]
                page: 0
                size: 20
                totalElements: 42
        401:
          description: Authentication required
```

---

### What should runbooks contain?

**Runbook Template:**

```markdown
# Runbook: [Scenario Name]

## Overview
Brief description of the scenario.

## Severity
P1 / P2 / P3 / P4

## Symptoms
- How to recognize this issue
- Alerts that might fire
- User reports to expect

## Investigation Steps
1. Step one with command
2. Step two with command
3. ...

## Resolution Steps
1. Fix step one
2. Fix step two
3. Verify fix

## Rollback Procedure
If fix fails, how to rollback.

## Post-Incident
- Update documentation
- Create follow-up tickets
- Schedule post-mortem if P1/P2
```

---

## Ship-Ready Checklist Questions

### What's on the Gate 5 checklist?

**Gate 5: Ship-Ready Approval Checklist:**

```markdown
## Functionality
- [ ] All user stories accepted
- [ ] All AC verified
- [ ] Edge cases tested
- [ ] Error handling verified
- [ ] Data migration tested (if applicable)

## Quality
- [ ] All tests passing
- [ ] Test coverage >80%
- [ ] No high/critical bugs open
- [ ] Code review complete
- [ ] Static analysis clean

## Performance
- [ ] Load testing complete
- [ ] API p95 <500ms
- [ ] Frontend Lighthouse >90
- [ ] No blocking performance issues

## Security
- [ ] Security review passed
- [ ] Dependency scan clean
- [ ] Penetration test complete (if required)
- [ ] Security headers verified

## Accessibility
- [ ] WCAG 2.1 AA audit passed
- [ ] Screen reader tested
- [ ] Keyboard navigation verified

## Documentation
- [ ] User documentation complete
- [ ] API documentation complete
- [ ] Runbooks created
- [ ] README updated

## Operations
- [ ] Monitoring dashboards configured
- [ ] Alerting set up
- [ ] Log aggregation working
- [ ] Health checks verified

## Deployment
- [ ] Staging deployment successful
- [ ] Smoke tests passing
- [ ] Rollback procedure documented
- [ ] Release notes prepared
```

---

### What if we fail Gate 5?

**Failure Response Protocol:**

| Severity | Response | Timeline |
|----------|----------|----------|
| Minor issues (1-3) | Fix and re-review | 1-2 days |
| Moderate issues (4-10) | Prioritize and fix | 3-5 days |
| Major blockers | Delay ship date | As needed |

**Common Gate 5 Failures:**

| Issue | Quick Fix |
|-------|-----------|
| Missing documentation | Write it now |
| Performance regression | Profile and fix hotspot |
| Accessibility violations | Fix critical, defer minor |
| Flaky tests | Fix or quarantine |
| Missing monitoring | Add essential metrics |

---

## Final Demo Preparation

### How do I prepare for the final demo?

**Final Demo Checklist:**

| Before Demo | During Demo | After Demo |
|-------------|-------------|------------|
| Test full flow | Start with context | Answer questions |
| Clear browser | Show working features | Take feedback |
| Check connectivity | Acknowledge limitations | Document next steps |
| Prepare backup | Keep to time | Celebrate! |

**Demo Structure (20-30 minutes):**

| Segment | Time | Content |
|---------|------|---------|
| Context | 2 min | Project overview, sprint goals |
| Feature Tour | 10 min | Key user journeys |
| Technical Highlights | 5 min | Architecture, performance |
| Security/Ops | 3 min | Security posture, monitoring |
| Documentation | 2 min | What's available |
| Q&A | 5-10 min | Stakeholder questions |

---

### What metrics should I show?

**Demo-Ready Metrics:**

| Category | Metric | Target | Show |
|----------|--------|--------|------|
| Quality | Test coverage | >80% | Coverage report |
| Performance | API latency p95 | <500ms | Load test results |
| Performance | Lighthouse score | >90 | Lighthouse report |
| Security | Dependency scan | 0 critical | Scan report |
| Accessibility | WCAG violations | 0 | axe audit |
| Operations | Uptime (staging) | 100% | Monitoring dashboard |

---

## Common Sprint 4 Issues

### "We have too many bugs to fix"

**Triage Strategy:**

| Priority | Definition | Action |
|----------|------------|--------|
| P1-Blocker | Can't ship without fix | Fix immediately |
| P2-Critical | Major functionality broken | Fix before ship |
| P3-Major | Significant but workaround exists | Fix if time |
| P4-Minor | Cosmetic or edge case | Backlog |

**Time-Boxing Fixes:**
- P1: As long as it takes
- P2: Max 1 day each
- P3: Max 2 hours each
- P4: Don't fix now

---

### "Documentation is taking too long"

**Documentation Time-Saving Tips:**

| Technique | How |
|-----------|-----|
| Generate from code | OpenAPI → Redoc |
| Use templates | Don't start from scratch |
| Pair write | Two people, faster completion |
| Prioritize | Critical paths first |
| Copilot assist | Generate drafts with AI |

**Minimum Viable Documentation:**
- README: How to run locally
- API: Auto-generated from OpenAPI
- Runbook: Top 3 incident scenarios

---

### "Performance is worse than expected"

**Emergency Optimization:**

1. **Profile first** — Don't guess where the problem is
2. **Fix the biggest issue** — 80/20 rule
3. **Quick wins** — Caching, query optimization
4. **Accept tradeoffs** — Can we defer some optimization?

**Quick Performance Wins:**

| Problem | Quick Fix |
|---------|-----------|
| Slow queries | Add indexes, use pagination |
| N+1 queries | JOIN FETCH |
| Large responses | Add projections |
| Big bundle | Remove unused imports |
| Slow images | Compress, use WebP |

---

## Related Resources

| Resource | Location |
|----------|----------|
| Sprint 4 Program | [SPRINT_4_PROGRAM.md](SPRINT_4_PROGRAM.md) |
| Ship-Ready Checklist | [sprint-packet/SHIP_READY_CHECKLIST.md](sprint-packet/SHIP_READY_CHECKLIST.md) |
| Sprint 3 FAQ | [../sprint-03/FAQ.md](../sprint-03/FAQ.md) |
| Week 1 FAQ | [../week-01/FAQ.md](../week-01/FAQ.md) |
| Assessment Framework | [../../shared/ASSESSMENT_FRAMEWORK.md](../../shared/ASSESSMENT_FRAMEWORK.md) |
| Definition of Done | [../../shared/reference-materials/DEFINITION_OF_DONE.md](../../shared/reference-materials/DEFINITION_OF_DONE.md) |

---

## Need More Help?

- **Gate 5 questions:** Ask the Facilitator
- **Technical blockers:** Ask your Tech Lead
- **Stakeholder concerns:** Escalate to Product Owner
- **Scope negotiations:** Talk to project sponsor
