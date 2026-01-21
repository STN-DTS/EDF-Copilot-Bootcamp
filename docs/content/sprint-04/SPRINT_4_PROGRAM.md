# Sprint 4 Program — Polish + Ship (Weeks 11-12)

> **Sprint Goal:** Production readiness, performance excellence, and successful deployment with full documentation and operational capability.

**Duration:** 2 weeks (10 working days)  
**Gate:** Gate 5 — Ship-Ready Approval  
**Prerequisites:** Sprint 3 complete, security hardening verified, Sprint 4 Packet approved

---

## Sprint Overview

Sprint 4 is the culmination of the 12-week bootcamp. With features complete and security hardened, this sprint focuses on production polish: performance optimization, accessibility compliance, comprehensive documentation, and operational readiness. The goal is a system that's not just functional, but *shippable*.

### What "Polish + Ship" Means

```
┌─────────────────────────────────────────────────────────────────┐
│                        POLISH + SHIP                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Sprint 3 Hardened        Sprint 4 Ship-Ready                  │
│   ┌───────────────┐        ┌────────────────────────────────┐   │
│   │ Secure        │        │ + Performance optimized        │   │
│   │ Validated     │  ────► │ + Accessible (WCAG 2.1 AA)     │   │
│   │ Audited       │        │ + Documented                   │   │
│   │ Edge-handled  │        │ + Monitored + Deployable       │   │
│   └───────────────┘        └────────────────────────────────┘   │
│                                                                 │
│   Week 11: Performance + Accessibility                          │
│   ├── Performance benchmarks          │  <500ms p95            │
│   ├── Bundle optimization             │  <200KB initial        │
│   ├── Database query tuning           │  No N+1 queries        │
│   ├── Caching strategy                │  Redis/HTTP caching    │
│   ├── Accessibility audit             │  WCAG 2.1 AA           │
│   └── Keyboard navigation             │  Full tab support      │
│                                                                 │
│   Week 12: Documentation + Deployment                           │
│   ├── User documentation              │  End-user guides       │
│   ├── API documentation               │  OpenAPI + examples    │
│   ├── Runbooks                        │  Incident response     │
│   ├── Monitoring dashboards           │  Metrics + alerting    │
│   ├── Staging deployment              │  Full stack verified   │
│   └── Gate 5 Review                   │  Ship approval         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why a Dedicated Ship Sprint?

| Benefit | Explanation |
|---------|-------------|
| **Quality focus** | No feature pressure allows polish and refinement |
| **Documentation time** | Real time allocated for proper documentation |
| **Performance tuning** | Optimization requires measurement and iteration |
| **Operational readiness** | Monitoring, alerting, runbooks need focused attention |
| **Stakeholder confidence** | Comprehensive Gate 5 review ensures readiness |

---

## Success Metrics

| Category | Metric | Target | Verification |
|----------|--------|--------|--------------|
| **Performance** | API p95 latency | <500ms | Load testing |
| **Performance** | Initial bundle size | <200KB | Bundle analysis |
| **Performance** | Lighthouse score | >90 | Lighthouse CI |
| **Accessibility** | WCAG 2.1 AA | 0 violations | axe-core audit |
| **Documentation** | API coverage | 100% | OpenAPI validation |
| **Documentation** | Runbook coverage | All P1 scenarios | Checklist |
| **Operations** | Monitoring | All key metrics | Dashboard review |
| **Operations** | Alerting | All P1/P2 scenarios | Alert test |
| **Deployment** | Staging success | 100% | Deploy verification |

---

## Day-by-Day Schedule

### Day 0: Lead Preparation (Before Sprint Start)

**AI Lead Tasks:**
- [ ] Review Sprint 3 demo outcomes and open items
- [ ] Prepare performance benchmarking tools (JMeter, k6, Lighthouse)
- [ ] Set up accessibility audit environment (axe-core, screen reader)
- [ ] Prepare documentation templates
- [ ] Configure monitoring dashboards (Prometheus, Grafana)
- [ ] Create Ship-Ready Checklist from template
- [ ] Confirm Gate 5 review panel and schedule

**Materials to Prepare:**
```
docs/content/sprint-04/
├── SPRINT_4_PROGRAM.md          ✓ This file
├── sprint-packet/
│   ├── SPRINT_PACKET.md         ✓ Scope and AC
│   ├── FE_TASKS.md              ✓ Frontend breakdown
│   ├── BE_TASKS.md              ✓ Backend breakdown
│   └── SHIP_READY_CHECKLIST.md  ✓ Gate 5 verification
```

**Tooling Verification:**
```bash
# Performance testing tools
jmeter --version
k6 version
npx lighthouse --version

# Accessibility tools
npm list @axe-core/cli

# Monitoring stack
docker-compose -f monitoring/docker-compose.yml config

# Documentation tools
npx redoc-cli --version
```

---

### Day 1: Sprint Planning + Ship Kickoff

**Morning: Sprint Planning (2 hours)**

| Time | Activity | Output |
|------|----------|--------|
| 0:00-0:30 | Sprint 3 review: Security status | Security sign-off confirmed |
| 0:30-1:00 | Sprint 4 scope review | Sprint Packet confirmed |
| 1:00-1:30 | Performance baseline review | Current metrics documented |
| 1:30-2:00 | Task assignment + commitment | Sprint board populated |

**Afternoon: Ship Kickoff Workshop (1 hour)**

**Agenda:**
1. Gate 5 requirements overview (15 min)
2. Ship-Ready Checklist walkthrough (15 min)
3. Performance and accessibility targets (15 min)
4. Documentation requirements (15 min)

**Workshop Output:**
- Team understands Gate 5 criteria
- Ship-Ready Checklist assigned owners
- Performance baseline documented
- Documentation plan agreed

**Copilot Prompt for Planning:**

```markdown
## P4-SHIP-PLAN

No secrets, no production data. Use placeholders.

Help me create a ship-readiness plan for Sprint 4:
1. Review current performance baseline from Sprint 3
2. Identify key performance bottlenecks
3. List accessibility issues from audit
4. Create documentation outline
5. Define monitoring dashboard requirements

Current metrics:
- API p95: [current value]
- Bundle size: [current value]
- Lighthouse score: [current value]

Target: Production-ready with Gate 5 approval
```

---

## Week 11: Performance + Accessibility (Days 2-5)

### Day 2: Performance Baseline + Analysis

**FE Focus:**
- Run Lighthouse audit and document baseline
- Analyze bundle with webpack-bundle-analyzer
- Identify lazy loading opportunities
- Profile React components with DevTools

**BE Focus:**
- Run JMeter/k6 load tests for baseline
- Analyze slow queries with EXPLAIN
- Identify N+1 query problems
- Profile JVM with VisualVM or JFR

**Copilot Prompt for Performance Analysis:**

```markdown
## P4-PERF-ANALYZE

No secrets, no production data. Use placeholders.

Analyze performance for Order Management API:

Current baseline:
- GET /orders p95: [X]ms (target: <500ms)
- POST /orders p95: [X]ms (target: <500ms)
- Database query count per request: [X]

Find:
1. Slow queries (EXPLAIN ANALYZE)
2. N+1 query patterns
3. Missing indexes
4. Caching opportunities

Follow patterns in @workspace
```

**Key Outputs:**
- Performance baseline document
- Bottleneck analysis report
- Optimization backlog prioritized

---

### Day 3: Performance Optimization (FE)

**Tasks:**
- FE-401: Bundle optimization (code splitting, lazy loading)
- FE-402: Image optimization (WebP, lazy loading)
- FE-403: React performance (memo, useMemo, useCallback)

**Code Example - Lazy Loading:**

```typescript
// src/routes/__root.tsx - Code splitting
import { lazy, Suspense } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';

// Lazy load routes
const OrderList = lazy(() => import('./orders/index'));
const OrderDetail = lazy(() => import('./orders/$orderId'));
const CreateOrder = lazy(() => import('./orders/create'));

export const Route = createRootRoute({
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <Outlet />
    </Suspense>
  ),
});

// src/components/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div 
      role="status" 
      aria-live="polite"
      className="flex items-center justify-center p-8"
    >
      <span className="sr-only">Loading...</span>
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}
```

**Copilot Prompt for Bundle Optimization:**

```markdown
## P4-BUNDLE

No secrets, no production data. Use placeholders.

Optimize React Router v7 bundle for production:
1. Implement route-based code splitting
2. Lazy load non-critical components
3. Tree-shake unused exports
4. Configure chunk splitting

Current bundle: [X]KB (target: <200KB initial)
Follow patterns in @workspace
```

---

### Day 3: Performance Optimization (BE)

**Tasks:**
- BE-401: Query optimization (indexes, EXPLAIN analysis)
- BE-402: N+1 query elimination (@EntityGraph, batch loading)
- BE-403: Connection pool tuning (HikariCP)

**Code Example - Query Optimization:**

```java
// src/main/java/com/example/orders/repository/OrderRepository.java

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Optimized query with EntityGraph to avoid N+1.
     * Fetches order with customer and items in single query.
     */
    @EntityGraph(attributePaths = {"customer", "items", "items.item"})
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(@Param("id") Long id);
    
    /**
     * Paginated query with projection for list view.
     * Only fetches fields needed for list display.
     */
    @Query("""
        SELECT new com.example.orders.dto.OrderSummaryDto(
            o.id, o.status, o.createdAt, o.totalAmount,
            c.id, c.name
        )
        FROM Order o
        JOIN o.customer c
        WHERE (:status IS NULL OR o.status = :status)
        AND (:customerId IS NULL OR c.id = :customerId)
        ORDER BY o.createdAt DESC
        """)
    Page<OrderSummaryDto> findOrderSummaries(
        @Param("status") OrderStatus status,
        @Param("customerId") Long customerId,
        Pageable pageable
    );
}

// application.yml - Connection pool tuning
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
```

---

### Day 4: Accessibility Audit + Fixes

**FE Focus:**
- Run axe-core automated audit
- Manual keyboard navigation testing
- Screen reader testing (NVDA/VoiceOver)
- Color contrast verification
- Focus indicator review

**Accessibility Checklist (WCAG 2.1 AA):**

| Criterion | ID | Requirement | Status |
|-----------|-----|-------------|--------|
| Keyboard | 2.1.1 | All functionality keyboard accessible | ⬜ |
| Focus Visible | 2.4.7 | Focus indicator visible | ⬜ |
| Color Contrast | 1.4.3 | 4.5:1 text, 3:1 UI | ⬜ |
| Labels | 1.3.1 | Form inputs labeled | ⬜ |
| Alt Text | 1.1.1 | Images have alt text | ⬜ |
| Headings | 1.3.1 | Proper heading hierarchy | ⬜ |
| Error Identification | 3.3.1 | Errors identified | ⬜ |
| Error Suggestion | 3.3.3 | Error corrections suggested | ⬜ |
| Skip Links | 2.4.1 | Skip to main content | ⬜ |
| Page Titles | 2.4.2 | Descriptive page titles | ⬜ |
| Link Purpose | 2.4.4 | Link text meaningful | ⬜ |
| Language | 3.1.1 | Page language identified | ⬜ |

**Code Example - Accessible Form:**

```typescript
// src/components/forms/OrderForm.tsx

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  
  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit}
      aria-labelledby="form-title"
      noValidate
    >
      <h2 id="form-title">Create New Order</h2>
      
      {/* Error summary for screen readers */}
      {Object.keys(errors).length > 0 && (
        <div 
          role="alert" 
          aria-live="assertive"
          className="error-summary"
        >
          <h3>Please fix the following errors:</h3>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="customerId">
          Customer <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <select
          id="customerId"
          name="customerId"
          required
          aria-required="true"
          aria-invalid={!!errors.customerId}
          aria-describedby={errors.customerId ? 'customerId-error' : undefined}
        >
          <option value="">Select a customer</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.customerId && (
          <p id="customerId-error" className="error" role="alert">
            {errors.customerId}
          </p>
        )}
      </div>
      
      <button type="submit">
        Create Order
      </button>
    </form>
  );
}
```

**Copilot Prompt for Accessibility:**

```markdown
## P4-A11Y

No secrets, no production data. Use placeholders.

Review and fix accessibility for OrderForm component:
1. Ensure proper ARIA labels
2. Add keyboard navigation support
3. Implement error announcements for screen readers
4. Verify color contrast meets WCAG 2.1 AA
5. Add skip links for main navigation

Current violations from axe-core:
[list violations here]

Follow patterns in @workspace
```

---

### Day 5: Performance Verification + Caching

**FE Focus:**
- Verify bundle size targets met
- Implement service worker caching (if applicable)
- Test Core Web Vitals (LCP, FID, CLS)

**BE Focus:**
- Implement caching strategy (Redis/Caffeine)
- Configure HTTP cache headers
- Test under load with optimizations

**Code Example - Caching:**

```java
// src/main/java/com/example/orders/config/CacheConfig.java

@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(Duration.ofMinutes(10))
            .recordStats()
        );
        return cacheManager;
    }
}

// src/main/java/com/example/orders/service/CustomerService.java

@Service
@RequiredArgsConstructor
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    
    /**
     * Cached customer lookup - customers rarely change.
     */
    @Cacheable(value = "customers", key = "#id")
    public CustomerDto findById(Long id) {
        return customerRepository.findById(id)
            .map(customerMapper::toDto)
            .orElseThrow(() -> new CustomerNotFoundException(id));
    }
    
    /**
     * Invalidate cache on customer update.
     */
    @CacheEvict(value = "customers", key = "#id")
    public CustomerDto update(Long id, CustomerUpdateRequest request) {
        // Update logic
    }
}

// HTTP Cache headers for static resources
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
            .addResourceLocations("classpath:/static/")
            .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS)
                .cachePublic());
    }
}
```

---

## Week 12: Documentation + Deployment (Days 6-10)

### Day 6: Documentation - User Guides

**FE Focus:**
- Create user documentation (Markdown or wiki)
- Document key workflows with screenshots
- Create quick start guide

**BE Focus:**
- Document API with examples
- Update OpenAPI with descriptions
- Create integration guide

**Documentation Structure:**

```
docs/
├── user-guide/
│   ├── README.md                 # Overview + quick start
│   ├── getting-started.md        # First-time setup
│   ├── orders/
│   │   ├── viewing-orders.md     # View order list/detail
│   │   ├── creating-orders.md    # Create new orders
│   │   └── cancelling-orders.md  # Cancel orders
│   ├── troubleshooting.md        # Common issues
│   └── faq.md                    # Frequently asked questions
│
├── api-guide/
│   ├── README.md                 # API overview
│   ├── authentication.md         # Auth flow
│   ├── orders-api.md             # Orders endpoints
│   ├── error-handling.md         # Error responses
│   └── examples/                 # cURL examples
│
└── operations/
    ├── runbook.md                # Incident response
    ├── monitoring.md             # Dashboard guide
    └── deployment.md             # Deployment process
```

---

### Day 7: Documentation - Runbooks + Operations

**Tasks:**
- FE-410: Create frontend deployment runbook
- BE-410: Create backend deployment runbook
- BOTH: Create incident response runbook

**Runbook Template:**

```markdown
# Runbook: [Incident Type]

## Overview
- **Severity:** P1/P2/P3
- **Impact:** [Description of impact]
- **On-Call:** @backend-oncall, @frontend-oncall

## Detection
- **Alert:** [Alert name]
- **Dashboard:** [Dashboard link]
- **Symptoms:** [What you'll see]

## Diagnosis
1. Check [service/component] logs
2. Verify [dependency] is healthy
3. Check recent deployments

## Resolution

### Scenario A: [Problem type]
```bash
# Commands to fix
```

### Scenario B: [Different problem]
```bash
# Commands to fix
```

## Rollback
```bash
# Rollback commands if needed
```

## Post-Incident
- [ ] Update status page
- [ ] Document in incident log
- [ ] Schedule blameless postmortem
```

---

### Day 8: Monitoring + Alerting

**Tasks:**
- Configure Prometheus/Grafana dashboards
- Set up alerting rules
- Test alert delivery

**Key Metrics to Monitor:**

| Category | Metric | Target | Alert Threshold |
|----------|--------|--------|-----------------|
| **Latency** | API p95 | <500ms | >750ms for 5min |
| **Latency** | API p99 | <1000ms | >1500ms for 5min |
| **Errors** | 5xx rate | <0.1% | >1% for 5min |
| **Errors** | 4xx rate | <5% | >10% for 5min |
| **Saturation** | CPU usage | <70% | >85% for 10min |
| **Saturation** | Memory usage | <80% | >90% for 5min |
| **Saturation** | DB connections | <80% | >90% for 5min |
| **Traffic** | Requests/sec | baseline | >2x baseline |

**Grafana Dashboard Panels:**

```yaml
# dashboard.yaml
panels:
  - title: "Request Rate"
    type: graph
    datasource: prometheus
    targets:
      - expr: rate(http_server_requests_seconds_count[5m])
        legendFormat: "{{method}} {{uri}}"
  
  - title: "Response Time (p95)"
    type: graph
    targets:
      - expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))
        legendFormat: "{{method}} {{uri}}"
  
  - title: "Error Rate"
    type: graph
    targets:
      - expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m])
        legendFormat: "{{status}}"
  
  - title: "Database Connection Pool"
    type: gauge
    targets:
      - expr: hikaricp_connections_active / hikaricp_connections_max
```

**Alert Rules:**

```yaml
# alerts.yaml
groups:
  - name: order-management
    rules:
      - alert: HighErrorRate
        expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"
      
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m])) > 0.75
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "p95 latency is {{ $value | humanizeDuration }}"
      
      - alert: DatabaseConnectionExhausted
        expr: hikaricp_connections_active / hikaricp_connections_max > 0.9
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool near capacity"
```

---

### Day 9: Staging Deployment + Verification

**Tasks:**
- Deploy to staging environment
- Run smoke tests
- Verify all integrations
- Run performance tests against staging

**Deployment Checklist:**

```markdown
## Pre-Deployment
- [ ] All tests passing
- [ ] Security scan clean
- [ ] Dependencies up to date
- [ ] Configuration verified
- [ ] Database migrations ready

## Deployment
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database migrations applied
- [ ] Environment variables verified

## Post-Deployment
- [ ] Smoke tests passing
- [ ] Health endpoints responding
- [ ] Monitoring dashboards showing data
- [ ] Log aggregation working
- [ ] No elevated error rate

## Verification
- [ ] Login flow works
- [ ] Order list loads
- [ ] Order creation works
- [ ] Order cancellation works
- [ ] Search/filter works
```

**OpenShift Deployment Example:**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-management-api
  labels:
    app: order-management
    component: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-management
      component: api
  template:
    metadata:
      labels:
        app: order-management
        component: api
    spec:
      containers:
        - name: api
          image: order-management-api:${VERSION}
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "1000m"
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 5
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "staging"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: url
```

---

### Day 10: Gate 5 Review + Sprint Demo

**Morning: Final Preparations (2 hours)**
- Complete Ship-Ready Checklist
- Gather all evidence and documentation
- Prepare demo script

**Midday: Sprint Demo (1 hour)**

**Demo Agenda:**
1. **Sprint 4 Objectives Recap** (5 min)
   - Performance, accessibility, documentation, deployment

2. **Performance Improvements** (10 min)
   - Before/after metrics
   - Key optimizations made
   - Load test results

3. **Accessibility Compliance** (10 min)
   - Audit results (before/after)
   - Key fixes implemented
   - Keyboard navigation demo

4. **Documentation Walkthrough** (10 min)
   - User guide overview
   - API documentation
   - Runbooks

5. **Operational Readiness** (10 min)
   - Monitoring dashboards
   - Alerting configuration
   - Staging deployment verification

6. **Gate 5 Review Preview** (10 min)
   - Ship-Ready Checklist status
   - Outstanding items (if any)
   - Go/No-Go discussion

**Afternoon: Gate 5 Review (2 hours)**

**Gate 5 Panel:**
- Product Owner
- Tech Lead (FE)
- Tech Lead (BE)
- Security Lead
- QA Lead
- DevOps Lead

**Gate 5 Criteria:**

| Category | Criterion | Required | Status |
|----------|-----------|----------|--------|
| **Functional** | All AC met | ✓ | |
| **Functional** | All P1/P2 bugs resolved | ✓ | |
| **Performance** | Benchmarks passed | ✓ | |
| **Accessibility** | WCAG 2.1 AA | ✓ | |
| **Security** | No critical/high vulns | ✓ | |
| **Documentation** | User docs complete | ✓ | |
| **Documentation** | API docs complete | ✓ | |
| **Documentation** | Runbooks complete | ✓ | |
| **Operations** | Monitoring configured | ✓ | |
| **Operations** | Alerting configured | ✓ | |
| **Deployment** | Staging verified | ✓ | |
| **Sign-off** | All stakeholders | ✓ | |

**Gate 5 Outcomes:**
- **APPROVED**: Ship to production
- **CONDITIONAL**: Ship with documented exceptions
- **NOT APPROVED**: Fix issues and re-review

---

## Sprint Retrospective

**Format:** Start/Stop/Continue + Program Retrospective

### Sprint 4 Specific Questions

1. **Performance**
   - What was our biggest performance win?
   - What performance issues were hardest to diagnose?
   - What would we do differently for performance tuning?

2. **Accessibility**
   - How early should we have started accessibility testing?
   - What tools worked best for accessibility audits?
   - What accessibility issues surprised us?

3. **Documentation**
   - Did we allocate enough time for documentation?
   - What documentation was most valuable to create?
   - What would we template for next time?

4. **Deployment**
   - How smooth was the staging deployment?
   - What operational gaps did we discover?
   - What would improve our deployment confidence?

### Program Retrospective Questions

1. **Overall Bootcamp**
   - What worked well across the 12 weeks?
   - What would we change for the next cohort?
   - What practices will we carry forward?

2. **AI-Assisted Development**
   - How did Copilot improve our productivity?
   - What did Copilot struggle with?
   - What prompts were most valuable?

3. **Waterfall-Agile Hybrid**
   - Did the gating process add value?
   - Were the sprint boundaries appropriate?
   - How did contract-first work in practice?

---

## Key Prompts for Sprint 4

| ID | Prompt | Use Case |
|----|--------|----------|
| P0 | Plan-first | All work starts with a plan |
| P18 | Security Review | Final security verification |
| P19 | Performance Analysis | Identify bottlenecks |
| P20 | Gate Readiness | Ship-ready verification |
| P4-PERF | Performance | Optimization recommendations |
| P4-A11Y | Accessibility | WCAG compliance |
| P4-DOCS | Documentation | Doc generation |
| P4-MONITOR | Monitoring | Dashboard/alert setup |

---

## Copilot Usage Summary

### Most Valuable for Sprint 4

1. **Performance Analysis**
   - Analyzing slow queries
   - Identifying bundle bloat
   - Suggesting optimizations

2. **Documentation Generation**
   - API documentation from code
   - Runbook templates
   - User guide drafts

3. **Accessibility Fixes**
   - ARIA attribute suggestions
   - Keyboard navigation patterns
   - Screen reader compatibility

4. **Monitoring Setup**
   - Prometheus query suggestions
   - Grafana dashboard configuration
   - Alert rule generation

### Human Review Critical For

- Performance benchmark decisions
- Accessibility audit interpretation
- Documentation accuracy
- Deployment approvals
- Gate 5 sign-off

---

## Appendix: Ship-Ready Evidence Checklist

Each criterion requires documented evidence for Gate 5 approval.

### Functional Completeness Evidence
- [ ] User story acceptance screenshots
- [ ] E2E test results
- [ ] Bug tracker showing P1/P2 closed

### Performance Evidence
- [ ] Load test report (JMeter/k6)
- [ ] Lighthouse scores (before/after)
- [ ] Bundle analysis output
- [ ] Database query analysis

### Accessibility Evidence
- [ ] axe-core audit report
- [ ] Manual keyboard test log
- [ ] Screen reader test log
- [ ] Color contrast verification

### Security Evidence
- [ ] OWASP Dependency-Check report
- [ ] Security checklist (Sprint 3)
- [ ] Penetration test summary (if applicable)

### Documentation Evidence
- [ ] User guide URL/location
- [ ] API documentation URL
- [ ] Runbook locations
- [ ] Architecture diagrams

### Operations Evidence
- [ ] Monitoring dashboard screenshots
- [ ] Alert rule configuration
- [ ] Staging deployment logs
- [ ] Health check verification
