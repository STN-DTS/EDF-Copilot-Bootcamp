# Week 3 FAQ

> Common questions for Week 3: Spec-First Packaging

---

## ADR Questions

### When should I create an ADR vs. just make a decision?

**Create an ADR when:**
- Decision is hard to reverse (architecture, database, framework)
- Decision affects multiple teams or components
- Decision will be questioned later ("why did we...")
- You spent more than 30 minutes debating options
- The decision has significant cost or risk implications

**Skip the ADR when:**
- Decision is easily reversible (formatting, variable naming)
- Decision is local to one component and doesn't affect others
- Industry standard practice with no real alternatives
- Decision is already documented elsewhere (e.g., organization standards)

**Rule of Thumb:** If you'd need to explain the decision in a PR review, write an ADR.

---

### How do I handle disagreements in ADR reviews?

**Healthy Disagreement Process:**

1. **Document the disagreement:** Add the dissenting view as an option in the ADR
2. **Quantify trade-offs:** Use data, benchmarks, or concrete examples—not opinions
3. **Time-box discussion:** 30 minutes max, then decide or escalate
4. **Decision authority:** Tech Lead or Architect makes final call
5. **Disagree and commit:** Once decided, everyone supports it

**Script for escalation:**
> "We've spent [X] minutes and haven't reached consensus. Let's document both positions and escalate to [Tech Lead] for a decision by [date]."

---

### What if we need to change an ADR later?

**ADR Lifecycle:**

| Situation | Action |
|-----------|--------|
| Small clarification | Edit in place, update date |
| Significant change | Create new ADR that supersedes |
| Decision no longer applies | Mark as Deprecated |
| Better option discovered | Create superseding ADR |

**Superseding ADR Template:**
```markdown
# ADR-XXX: New Caching Strategy

## Status
Accepted (Supersedes ADR-007)

## Context
Since ADR-007, we've learned that [new information].
This ADR updates our caching strategy based on [evidence].
```

---

### How detailed should options analysis be?

**Minimum Viable Options:**
- 3 options (including "do nothing" if applicable)
- 2-3 pros and 2-3 cons per option
- Clear comparison criteria

**Good Analysis Table:**

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Performance | ✅ Fast (<100ms) | ⚠️ Medium (200ms) | ❌ Slow (500ms) |
| Complexity | ⚠️ Medium | ✅ Low | ❌ High |
| Cost | ❌ $$$ | ✅ $ | ⚠️ $$ |
| Team expertise | ⚠️ Some | ✅ High | ❌ None |

---

### What makes a good ADR title?

**Good titles are:**
- Action-oriented: "Use PostgreSQL for Order Data"
- Specific: Not just "Database" but "Order Database Strategy"
- Searchable: Include key technology names

| ❌ Bad | ✅ Good |
|--------|---------|
| Database | Use PostgreSQL 15 for Order Data |
| Caching | Implement Two-Tier Caching with Caffeine and Redis |
| Auth | Use Microsoft Entra ID for Authentication |

---

## Constitution Questions

### How strict should code standards be?

**Balance Prescriptive vs. Flexible:**

| Too Strict | Just Right | Too Loose |
|------------|------------|-----------|
| "All methods <10 lines" | "Methods should do one thing" | "Keep methods reasonable" |
| "No exceptions ever" | "Exceptions documented and justified" | "Use good judgment" |

**Guideline:** If it can be automated (linting, formatting), be strict. If it requires judgment, be flexible with examples.

---

### What if teams disagree on architecture boundaries?

**Resolution Process:**

1. **Draw it:** Create a diagram showing both interpretations
2. **Trace a request:** Walk through a user journey with both models
3. **Identify the conflict:** Where exactly do they differ?
4. **Apply principles:** Use SOLID, separation of concerns
5. **Document decision:** Create ADR for the boundary decision

**Common Boundary Conflicts:**

| Conflict | Resolution Pattern |
|----------|-------------------|
| "Should FE call this service directly?" | Add to Constitution's integration rules |
| "Who owns this component?" | Draw responsibility matrix |
| "Where does validation happen?" | Define once, document in Constitution |

---

### How do we enforce the constitution?

**Enforcement Mechanisms:**

| Mechanism | What It Enforces | Automation |
|-----------|------------------|------------|
| Linting (ESLint, Checkstyle) | Code style | CI/CD |
| PR template | Process, documentation | GitHub |
| Architecture tests (ArchUnit) | Layer boundaries | CI/CD |
| Peer review | Standards, best practices | Manual |
| Coverage gates | Testing requirements | CI/CD |

**Architecture Test Example:**
```java
@ArchTest
ArchRule controllersShouldNotAccessRepositories = 
    noClasses()
        .that().resideInAPackage("..controller..")
        .should().dependOnClassesThat()
        .resideInAPackage("..repository..");
```

---

## System Spec Questions

### How many personas are "enough"?

**Guidelines:**

| System Type | Typical Personas |
|-------------|------------------|
| Internal tool | 2-4 |
| Customer-facing | 3-6 |
| Platform/API | 4-8 |

**For Order Management System:**
1. **Customer** — Places and manages orders
2. **CSR** — Handles customer issues
3. **Admin** — Manages system configuration
4. **Analyst** — Views reports and metrics

**Tip:** Start with 3-4, add more only if they have distinct journeys and needs.

---

### What's the difference between System Spec and Constitution?

| Aspect | System Spec | Constitution |
|--------|-------------|--------------|
| **Audience** | Business + Tech | Technical team |
| **Focus** | WHAT we're building | HOW we build it |
| **Content** | Requirements, personas, business rules | Standards, patterns, tooling |
| **Changes** | Per project | Per organization/team |
| **Owner** | Product Owner | Tech Lead |
| **Used by** | Stakeholders, developers | Developers, reviewers |

---

### How specific should NFRs be?

**NFRs need measurable targets:**

| ❌ Vague | ✅ Specific |
|----------|-------------|
| "System should be fast" | "Order List API <500ms p95" |
| "High availability" | "99.9% uptime (8.76 hrs/year downtime)" |
| "Scalable" | "Support 10,000 concurrent users" |
| "Secure" | "OWASP Top 10 compliance, annual pen test" |

**Template:**
```
[Metric] must be [value] measured by [method] under [conditions]
```

Example:
> Order creation API must complete in <1000ms p95 measured by APM under normal load (100 req/sec)

---

## Copilot Usage

### How to use P16 effectively for ADR generation?

**P16 Best Practices:**

1. **Provide context:** Include the problem statement and constraints
2. **Specify options:** List the alternatives you're considering
3. **Include criteria:** Tell Copilot what matters (performance, cost, simplicity)
4. **Request structure:** Ask for specific ADR sections

**Enhanced P16 Prompt:**
```markdown
No secrets, no production data. Use placeholders.

Generate an ADR for: [Decision Title]

Context:
- Problem: [What problem are we solving?]
- Constraints: [What limits our choices?]
- Current state: [What exists today?]

Options to evaluate:
1. [Option A] - [Brief description]
2. [Option B] - [Brief description]
3. [Option C] - [Brief description]

Evaluation criteria (prioritized):
1. Performance - [specific targets]
2. Team expertise - [current skills]
3. Operational cost - [budget constraints]

Include:
- Pros/cons table for each option
- Clear recommendation with justification
- Implementation steps
- Risks and mitigations
```

---

### When does P13 code review add value for ADRs?

**P13 is useful for:**
- Checking for missing sections
- Identifying vague language
- Suggesting additional options to consider
- Finding inconsistencies in the document

**P13 is NOT useful for:**
- Domain-specific context (you know more than Copilot)
- Political considerations (team dynamics, org politics)
- Quantifying specific performance claims
- Making the final decision

---

### How to validate Copilot's architecture suggestions?

**Validation Checklist:**

| Check | Question |
|-------|----------|
| **Relevance** | Does it fit our tech stack? |
| **Accuracy** | Are the claims verifiable? |
| **Completeness** | Did it miss obvious options? |
| **Bias** | Is it favoring popular over appropriate? |
| **Context** | Does it understand our constraints? |

**Follow-up prompts:**
- "What are the downsides of this approach?"
- "What would happen at 10x our expected load?"
- "What expertise do we need to implement this?"
- "What's an alternative if [constraint] changes?"

---

## Workshop Questions

### What if stakeholders can't attend all workshops?

**Mitigation strategies:**

1. **Pre-work:** Send materials for async review before workshop
2. **Recording:** Record sessions for later review
3. **Async feedback:** Share outputs and request feedback by deadline
4. **Delegate:** Identify proxy who can make decisions
5. **Escalate:** If key stakeholder unavailable, reschedule that session

**Key stakeholder mapping:**

| Workshop | Critical Attendees |
|----------|-------------------|
| Constitution Kickoff | Tech Leads (FE, BE) |
| ADR Workshop | Tech Leads, Architect |
| System Spec Workshop | Product Owner, Tech Leads |
| Security Architecture | Security Lead (MANDATORY) |
| Gate 3 Review | All Leads |

---

### How do we timebox architecture discussions?

**Techniques:**

1. **Parking lot:** Off-topic items go to parking lot for later
2. **Decision timer:** 30 minutes max per decision
3. **Options limit:** If >4 options, narrow to top 3 before discussion
4. **Escalation path:** "If no consensus in 30 min, Tech Lead decides"
5. **Async continuation:** "Let's take this offline and decide by [date]"

---

### What if we discover new constraints during Week 3?

**Process:**

1. **Document immediately:** Add to Constraint Register from Week 2
2. **Assess impact:** Does it affect existing ADRs or specs?
3. **Update documents:** Revise affected ADRs with new context
4. **Communicate:** Inform stakeholders of the new constraint
5. **Re-prioritize:** Adjust MoSCoW if needed

---

## Troubleshooting

### ADR review reveals fundamental disagreement

**Resolution path:**

1. Schedule dedicated 30-min session with disagreeing parties
2. Draw both approaches on whiteboard
3. Walk through one use case with each approach
4. Identify specific trade-offs (not opinions)
5. Tech Lead makes final call
6. Document dissent in ADR "Considered but rejected" section

---

### Constitution feels too generic

**Fixes:**

1. Add specific examples from your codebase
2. Include counter-examples ("Don't do this")
3. Link to actual PRs that demonstrate standards
4. Add verification method for each rule
5. Cross-reference with ADRs for justification

---

### System Spec scope keeps expanding

**Prevention:**

1. Reference Week 2 constraints for boundaries
2. Every "add" requires a "remove" or move to Phase 2
3. Product Owner must sign off on any scope change
4. Track scope changes in document history
5. Time-box scope discussions in workshops
