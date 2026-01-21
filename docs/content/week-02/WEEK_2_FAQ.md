# Week 2 FAQ

> Common questions and answers for Week 2: Constraint Register + Spec Intake

---

## Workshop Facilitation

### How do I handle stakeholders who won't commit to priorities?

**Problem:** Stakeholder says "everything is P1" or "I can't prioritize without more information."

**Solutions:**
1. **Force ranking:** "If you could only have ONE feature at launch, which would it be?"
2. **Trade-off scenarios:** "If we have to cut scope, which category loses first?"
3. **Time constraint:** "Given we have 8 weeks, what's achievable?"
4. **Escalation:** If truly stuck, escalate to project sponsor for decision

**Script:**
> "I understand everything feels important. Let's try this: imagine we only have half the budget. What would you cut first? That helps us understand relative priority."

---

### What if we can't agree on Must vs. Should?

**Problem:** FE thinks feature X is Must, BE thinks it's Should.

**Solutions:**
1. **Define "Must" clearly:** "Must = cannot launch without it, blocks revenue/compliance"
2. **Ask the business:** Let Product Owner make the call
3. **Document the disagreement:** Note it as a risk, decide later
4. **Time-box:** Give 5 minutes to debate, then vote or escalate

**Facilitation Technique:**
> "Let's define our terms. 'Must' means the business cannot operate without this. 'Should' means we'd lose competitive advantage. With those definitions, where does this feature fall?"

---

### How detailed should constraints be?

**Rule of Thumb:** Detailed enough to test, not so detailed it's implementation.

| ❌ Too Vague | ❌ Too Detailed | ✅ Just Right |
|-------------|-----------------|---------------|
| "Fast" | "Uses Redis with 512MB cache" | "Response time <500ms (p95)" |
| "Secure" | "AES-256-GCM encryption" | "Data encrypted at rest" |
| "Accessible" | "Color #2E7D32 for success" | "WCAG 2.1 AA compliant" |

---

### How do I time-box effectively?

**Techniques:**
1. **Visible timer:** Show countdown on screen
2. **Parking lot:** "Great point, let's capture it for later"
3. **Voting:** When discussion stalls, vote and move on
4. **Facilitator authority:** "We need to move on. Let's revisit in break."

**Time Allocation (3-hour workshop):**

| Activity | Time | Notes |
|----------|------|-------|
| Intro + ground rules | 15 min | Set expectations |
| Brainstorm | 60 min | 10 min per category |
| Break | 15 min | Mandatory |
| Prioritization | 45 min | Use dot voting |
| Review + cleanup | 30 min | Consolidate duplicates |
| Wrap-up | 15 min | Next steps |

---

## Copilot Usage

### When should I use @workspace vs. #file?

| Feature | Use When | Example |
|---------|----------|---------|
| **@workspace** | Exploring broad codebase patterns | "How do we handle errors currently?" |
| **#file** | Analyzing specific document | "#file DOMAIN_CONTEXT.md what entities exist?" |
| **Neither** | General questions | "What is MoSCoW prioritization?" |

**Best Practice:** Start with #file for specific documents, then @workspace for cross-cutting questions.

---

### How do I validate P15 constraint extraction?

**Validation Checklist:**
1. **Completeness:** Did Copilot cover all 6 categories?
2. **Accuracy:** Are constraints correctly categorized?
3. **Specificity:** Are constraints measurable?
4. **Sources:** Did it invent sources or use real ones?
5. **Priorities:** Are priorities reasonable?

**Follow-up Prompts:**
- "You missed regulatory constraints. What compliance requirements apply to customer data?"
- "Make constraint NF-001 more specific with measurable criteria."
- "What validation method would prove constraint F-003 is met?"

---

### What if Copilot misses obvious constraints?

**Common Misses:**
1. **Regulatory:** GDPR, PCI-DSS, accessibility laws
2. **Organizational:** Budget, timeline, team skills
3. **Integration:** Existing systems not mentioned in docs
4. **Security:** Authentication, authorization, audit

**Solution:** Use category-specific prompts:

```markdown
No secrets, no production data. Use placeholders.

For this Order Management system, what regulatory and compliance 
constraints would typically apply? Consider:
- Payment processing regulations
- Customer data privacy laws
- Accessibility requirements
- Data retention policies
```

---

### How do I use @workspace to find existing patterns?

**Useful Queries:**

```markdown
# Find error handling patterns
@workspace How do we currently handle errors in this codebase? 
Show me the error response format.

# Find validation patterns
@workspace How do we validate user input? 
Show me examples of validation logic.

# Find constraint-related code
@workspace What constraints are enforced in the Order entity? 
Look for validation annotations and business rules.
```

---

## Template Completion

### How many constraints is "enough"?

**Guidelines by Category:**

| Category | Minimum | Typical | Notes |
|----------|---------|---------|-------|
| Functional | 5 | 10-15 | Core business rules |
| Non-Functional | 3 | 5-8 | Performance, availability, accessibility |
| Integration | 2 | 3-5 | External systems |
| Regulatory | 1 | 2-4 | Depends on industry |
| Technical | 3 | 5-8 | Stack, infrastructure |
| Organizational | 2 | 3-5 | Timeline, team, budget |

**Total:** Aim for 15-40 constraints for a typical project.

---

### What if a constraint spans multiple categories?

**Example:** "Customer data must be encrypted" is both:
- **Non-Functional:** Performance impact of encryption
- **Regulatory:** GDPR/privacy requirement
- **Technical:** Encryption technology choice

**Solutions:**
1. **Primary Category:** Pick the most relevant, note others
2. **Duplicate:** Create entry in each category with cross-reference
3. **Hybrid ID:** Use ID like "NF-R-001" to indicate both

**Recommendation:** Use primary category with notes:

```markdown
| ID | Constraint | Source | Notes |
|----|------------|--------|-------|
| R-001 | Customer data encrypted at rest | GDPR Art. 32 | Also NF (perf), T (tech choice) |
```

---

### How do I handle conflicting constraints?

**Example:** 
- NF-001: "Response time <200ms"
- R-001: "All data encrypted in transit"

Encryption adds latency, potentially conflicting.

**Resolution Process:**
1. **Identify the conflict:** Document both constraints
2. **Quantify the trade-off:** "Encryption adds ~50ms"
3. **Prioritize:** Which constraint has higher priority?
4. **Find middle ground:** "Response time <250ms with encryption"
5. **Document the decision:** Create ADR if significant

---

## Journey Mapping

### How many failure paths should I document?

**Rule of 70/30:** Happy path is ~30% of effort, failures are ~70%.

**Minimum Failure Paths:**
1. **Validation failure:** Invalid input
2. **Authorization failure:** Wrong permissions
3. **Not found:** Resource doesn't exist
4. **State conflict:** Action not allowed in current state
5. **System error:** Database/service unavailable

**For each failure, document:**
- What triggers it
- What user sees
- How user recovers

---

### How do I identify edge cases?

**Edge Case Discovery Questions:**
1. **Boundaries:** What if quantity is 0? 1? Maximum?
2. **Timing:** What if action happens at midnight? During maintenance?
3. **Concurrency:** What if two users do this simultaneously?
4. **Partial States:** What if process fails halfway?
5. **Special Characters:** What if name contains emoji? Unicode?

**Copilot Prompt:**
```markdown
For this user journey [paste journey], what edge cases 
should we consider? Think about:
- Boundary conditions
- Timing issues
- Concurrent access
- Partial failures
- Special data scenarios
```

---

## Acceptance Criteria

### How specific should values be in AC?

**Specificity Levels:**

| Level | Example | When to Use |
|-------|---------|-------------|
| Exact value | "Total is $125.00" | Calculation rules |
| Threshold | "Response <500ms" | Performance |
| Format | "Date in ISO 8601" | Data standards |
| State | "Status is 'Cancelled'" | State transitions |
| Count | "Shows 10 items per page" | Pagination |

**Avoid:**
- "Appropriate error message" → "Error message 'Order not found'"
- "Reasonable time" → "Within 2 seconds"
- "Proper format" → "JSON with Content-Type: application/json"

---

### How do I know if AC is testable?

**Testability Checklist:**
- [ ] Can I write an automated test for this?
- [ ] Will the test pass/fail definitively?
- [ ] Is there only one interpretation?
- [ ] Are all values specified?
- [ ] Is the expected behavior clear?

**Quick Test:** Read the AC aloud. Could two QA engineers write the same test independently?

---

## General Questions

### What's the difference between Week 2 and Week 3?

| Aspect | Week 2 | Week 3 |
|--------|--------|--------|
| Focus | WHAT to build | HOW to build |
| Artifacts | Constraints, Journeys, AC | ADRs, Constitution, Specs |
| Audience | Business + Tech | Technical team |
| Decisions | Requirements | Architecture |
| Copilot | P15 constraint extraction | P16 ADR generation |

---

### Can I skip Week 2 workshops if I have requirements docs?

**No.** Even with existing docs, workshops are essential for:
1. **Validation:** Confirming docs are current and complete
2. **Gaps:** Finding what docs don't say
3. **Alignment:** Getting FE/BE on same page
4. **Buy-in:** Stakeholder commitment to priorities

**Modified Approach:** Use existing docs as starting point, not replacement.

---

### What if stakeholders aren't available?

**Contingency Plan:**
1. **Async Input:** Send templates, request written feedback
2. **Delegate:** Identify a stakeholder proxy with decision authority
3. **Document Assumptions:** Mark decisions as "assumed, pending validation"
4. **Schedule Follow-up:** Book time for validation before Gate 2

**Risk:** Decisions made without stakeholders may need revision. Flag this in the constraint register.

---

## Troubleshooting

### My constraint register is too vague

**Symptoms:**
- Constraints like "System should be fast"
- No validation methods
- Missing priorities

**Fix:**
1. Review each constraint with SMART criteria
2. Add specific metrics: "<500ms response time"
3. Add validation methods: "Load test with 500 users"
4. Standardize priorities: P1/P2/P3

---

### Journey has too many steps

**Symptoms:**
- Happy path has 15+ steps
- Users won't complete this flow

**Fix:**
1. Combine micro-steps: "Enter email" + "Enter password" = "Login"
2. Focus on user intent, not UI clicks
3. Consider if this should be multiple journeys

---

### AC scenarios are redundant

**Symptoms:**
- 10 scenarios testing same logic
- Minor variations don't add value

**Fix:**
1. Use Scenario Outlines with Examples table
2. Group related scenarios
3. Focus on distinct behaviors

```gherkin
# Instead of 5 separate scenarios:
Scenario Outline: Cannot cancel orders in terminal states
  Given I have an order with status "<status>"
  When I try to cancel the order
  Then I should see error "<error>"

  Examples:
    | status    | error                    |
    | Shipped   | Order has been shipped   |
    | Delivered | Order has been delivered |
    | Cancelled | Order is already cancelled |
```
