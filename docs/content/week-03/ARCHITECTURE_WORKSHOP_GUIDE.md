# Architecture Workshop Guide

> Tips and techniques for running effective architecture workshops during Week 3.

---

## Workshop Overview

Week 3 includes five key workshops:

| Day | Workshop | Duration | Purpose |
|-----|----------|----------|---------|
| Day 1 | Constitution Kickoff | 3 hours | Establish technical standards |
| Day 2 | ADR Workshop | 4 hours | Draft key architecture decisions |
| Day 3 | System Spec Workshop | 3 hours | Define system specification |
| Day 4 | Security Architecture | 3 hours | Document security model |
| Day 5 | Gate 3 Review | 2 hours | Review and sign-off |

---

## General Facilitation Principles

### The Facilitator's Role

1. **Guide, don't decide:** Facilitate the process, let the team decide
2. **Stay neutral:** Don't advocate for specific technical solutions
3. **Time-keep:** Respect everyone's time, enforce timeboxes
4. **Document:** Capture decisions as they're made
5. **Unblock:** Identify blockers and escalate when needed

### Ground Rules (Read at Start of Each Workshop)

> 1. **Decisions, not debates:** We're here to decide, not just discuss
> 2. **Options first:** Present alternatives before advocating
> 3. **Data over opinions:** Support positions with evidence
> 4. **Time-box disagreements:** 15 minutes max, then escalate
> 5. **Document everything:** If it's not written, it didn't happen
> 6. **Parking lot:** Off-topic items captured for later

---

## Day 1: Constitution Kickoff (3 hours)

### Objectives

- Align on architecture vision
- Establish code standards
- Define layer responsibilities
- Assign section owners

### Agenda

| Time | Activity | Facilitator Notes |
|------|----------|-------------------|
| 0:00 | Welcome + ground rules | Set expectations |
| 0:10 | Architecture vision | Tech Lead presents high-level approach |
| 0:30 | Layer responsibilities | Draw system diagram together |
| 1:00 | **Break** | 10 minutes |
| 1:10 | Code standards discussion | FE and BE in parallel breakouts |
| 1:50 | Testing strategy | Agree on pyramid and ownership |
| 2:20 | Section assignments | Assign owners for constitution sections |
| 2:45 | Wrap-up + homework | Define deliverables for Day 2 |

### Key Activities

#### Architecture Vision (20 min)

**Input:** Constraints from Week 2, existing patterns

**Output:** High-level architecture diagram

**Technique:** Collaborative whiteboarding

1. Tech Lead draws initial boxes (FE, BE, DB)
2. Team adds connections and protocols
3. Identify cross-cutting concerns (auth, logging, caching)
4. Take photo/screenshot for documentation

#### Layer Responsibilities (30 min)

**Template:**

| Layer | Responsibility | Does NOT Do |
|-------|----------------|-------------|
| Route/Page | | |
| Component | | |
| Service | | |
| Repository | | |

**Technique:** Fill in together, discuss conflicts

**Common Conflicts:**
- "Where does validation happen?" → Document once
- "Who owns error handling?" → Assign to layer
- "Where does business logic live?" → Service layer

#### Section Assignments

| Section | Owner | Due |
|---------|-------|-----|
| Architecture Overview | Tech Lead | Day 3 |
| Code Standards (BE) | BE Lead | Day 3 |
| Code Standards (FE) | FE Lead | Day 3 |
| Testing Standards | QA Lead | Day 3 |
| Error Handling | BE Lead | Day 3 |
| Security Standards | Security Lead | Day 4 |
| API Standards | Tech Lead | Day 3 |
| Branching Strategy | Tech Lead | Day 3 |

---

## Day 2: ADR Workshop (4 hours)

### Objectives

- Draft ADRs for key decisions
- Review and refine ADRs
- Establish ADR process

### Agenda

| Time | Activity | Notes |
|------|----------|-------|
| 0:00 | ADR format review | Walk through template |
| 0:15 | Decision topic assignments | Assign 1-2 ADRs per person |
| 0:30 | **Parallel ADR drafting** | Individual work with Copilot |
| 1:30 | **Break** | 15 minutes |
| 1:45 | ADR review round 1 | Pairs review each other's ADRs |
| 2:30 | Group review | Present 3-4 critical ADRs to group |
| 3:30 | ADR process discussion | Agree on ongoing ADR workflow |
| 3:50 | Wrap-up | Next steps |

### ADR Drafting Session (1 hour)

**Setup:**
- Each person has 1-2 assigned decision topics
- ADR template available
- P16 prompt ready

**Individual Work Flow:**
1. Review the decision context (5 min)
2. List 3+ options (5 min)
3. Use P16 to generate initial ADR (10 min)
4. Enhance with your knowledge (20 min)
5. Self-review against checklist (10 min)

**Facilitator Role:**
- Circulate to unblock
- Encourage options thinking
- Remind of time

### ADR Review Pairs (45 min)

**Pairing:**
- Pair FE with BE for cross-perspective
- Each person reviews partner's ADR

**Review Checklist:**
- [ ] Context explains the problem clearly
- [ ] At least 3 options analyzed
- [ ] Decision is justified
- [ ] Consequences include negatives
- [ ] Implementation steps are concrete

**Feedback Format:**
```
I like: [Something specific]
I wonder: [Question or suggestion]
I wish: [Specific improvement]
```

### Group Review (1 hour)

**Select 3-4 ADRs for group review:**
- Highest impact decisions
- Most controversial topics
- Cross-cutting decisions

**Format:**
- Author presents (5 min)
- Questions (5 min)
- Suggestions (5 min)
- Decision: Accept / Revise / Defer

---

## Day 3: System Spec Workshop (3 hours)

### Objectives

- Define personas and journeys
- Document business rules
- Set NFR targets
- Create glossary

### Agenda

| Time | Activity | Notes |
|------|----------|-------|
| 0:00 | Review Week 2 inputs | Constraints, journeys |
| 0:15 | Persona refinement | 3-5 key personas |
| 0:45 | Business rules extraction | Numbered list |
| 1:15 | **Break** | 10 minutes |
| 1:25 | NFR targets | Performance, availability, security |
| 2:00 | Glossary creation | 15+ terms |
| 2:30 | Integration mapping | External systems |
| 2:50 | Wrap-up | Assignments for completion |

### Persona Refinement (30 min)

**Input:** Week 2 user journeys

**Output:** 3-5 documented personas

**Technique:** Persona cards

```
┌─────────────────────────────────────┐
│ PERSONA: [Name]                     │
├─────────────────────────────────────┤
│ Role: [Job title]                   │
│ Goals: [What they want]             │
│ Pain Points: [What frustrates them] │
│ Journeys: [3 key tasks]             │
│ Tech Comfort: [Low/Medium/High]     │
└─────────────────────────────────────┘
```

**Activity:**
1. List all user types from Week 2 journeys
2. Group similar users
3. Create card for each distinct persona
4. Validate: "Does each persona have unique needs?"

### Business Rules Extraction (30 min)

**Input:** Constraints, journeys, acceptance criteria

**Output:** Numbered business rules list

**Technique:** Round-robin extraction

1. Each person reviews assigned journey/constraints
2. Write rules on sticky notes (one per note)
3. Group similar rules
4. Number and assign owners

**Business Rule Template:**

| ID | Rule | Source | Enforcement |
|----|------|--------|-------------|
| BR-001 | Order must have at least 1 item | AC-01 | API validation |
| BR-002 | Only PENDING orders can be cancelled | Journey-03 | Service logic |

### NFR Targets (35 min)

**Categories:**

| Category | Questions to Answer |
|----------|---------------------|
| Performance | Response times? Throughput? |
| Availability | Uptime target? RTO? RPO? |
| Scalability | Users? Data volume? Growth? |
| Security | Authentication? Authorization? Encryption? |
| Accessibility | WCAG level? Keyboard? Screen reader? |

**Technique:** Target setting with evidence

For each NFR:
1. State the metric
2. Define the target
3. Explain measurement method
4. Identify test approach

**Example:**
> Order List API must respond in <500ms at p95, measured by APM, tested via load test with 1000 users.

---

## Day 4: Security Architecture (3 hours)

### Objectives

- Document security model
- Review threat landscape
- Define security controls
- Get Security Lead sign-off

### Agenda

| Time | Activity | Notes |
|------|----------|-------|
| 0:00 | Security context review | Regulatory, data sensitivity |
| 0:20 | Authentication model | OAuth, tokens, sessions |
| 0:50 | Authorization model | Roles, permissions |
| 1:20 | **Break** | 10 minutes |
| 1:30 | Data protection | Encryption, PII handling |
| 2:00 | Threat modeling (STRIDE) | Key threats for this system |
| 2:40 | Security controls summary | Document in Constitution |
| 2:55 | Security Lead sign-off | Or identify gaps |

### Threat Modeling (STRIDE) (40 min)

**STRIDE Categories:**

| Threat | Question | Example |
|--------|----------|---------|
| **S**poofing | Can attacker pretend to be user? | Stolen JWT token |
| **T**ampering | Can attacker modify data? | Request parameter manipulation |
| **R**epudiation | Can attacker deny action? | Order placed without audit |
| **I**nformation Disclosure | Can attacker see private data? | PII in logs |
| **D**enial of Service | Can attacker overwhelm system? | API flood attack |
| **E**levation of Privilege | Can attacker gain admin access? | JWT role manipulation |

**Activity:**
1. Draw data flow diagram
2. For each component, ask STRIDE questions
3. Document threats and mitigations
4. Prioritize by risk (probability × impact)

### Security Controls Summary

| Control | Implementation | Verification |
|---------|----------------|--------------|
| Authentication | OAuth 2.0 + JWT | Integration test |
| Authorization | @PreAuthorize annotations | Architecture test |
| Encryption (transit) | TLS 1.3 | Security scan |
| Encryption (rest) | AES-256 | Audit |
| Input validation | Bean Validation | Unit test |
| Audit logging | All mutations logged | Log review |
| PII protection | Masked in logs | Security scan |

---

## Day 5: Gate 3 Review (2 hours)

### Objectives

- Review all Week 3 deliverables
- Identify gaps
- Get stakeholder sign-off
- Plan for sprints

### Agenda

| Time | Activity | Notes |
|------|----------|-------|
| 0:00 | Constitution walkthrough | Section by section |
| 0:30 | System Spec review | Focus on NFRs, personas |
| 0:50 | ADR status review | Accept/Revise/Defer each |
| 1:10 | **Break** | 10 minutes |
| 1:20 | Gap identification | What's missing? |
| 1:35 | Action items | Assign owners, deadlines |
| 1:50 | Sign-off | Collect signatures |

### Gate 3 Checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| Project Constitution complete | ✅/🔶/❌ | |
| System Specification complete | ✅/🔶/❌ | |
| At least 5 ADRs accepted | ✅/🔶/❌ | |
| Security model documented | ✅/🔶/❌ | |
| All labs complete | ✅/🔶/❌ | |
| Cross-team review done | ✅/🔶/❌ | |

### Sign-off Collection

| Document | Signer | Date | Signature |
|----------|--------|------|-----------|
| Project Constitution | Tech Lead | | |
| System Specification | Product Owner | | |
| Security Model | Security Lead | | |
| ADRs (batch) | Architect | | |

---

## Handling Difficult Situations

### "We Can't Decide Between Options"

**Script:**
> "We've discussed for 15 minutes. Let's capture both options with pros/cons, and [Tech Lead] will make the call by EOD. We can revisit if new information emerges."

### "This Decision Affects Another Team"

**Script:**
> "Let's document this as a proposed decision and schedule a sync with [team]. We'll mark the ADR as 'Proposed' until they review."

### "We Don't Have Enough Information"

**Script:**
> "What's the minimum we need to know to proceed? Let's timebox research to 2 hours and reconvene. If still unclear, we make the best decision with what we have and document assumptions."

### "The Tech Lead and Architect Disagree"

**Script:**
> "Let's document both perspectives in the ADR. [Architect] will make the final call as decision owner, and we'll add [Tech Lead]'s concerns to the 'Risks' section."

### "Someone is Dominating the Discussion"

**Script:**
> "Thanks [Name], great points. Let's hear from others who haven't spoken yet. [Person], what's your view?"

**Technique:** Round-robin for decisions, time-boxed speaking slots.

---

## Remote Workshop Tips

### Engagement Techniques

1. **Camera on:** Encourage cameras for engagement
2. **Chat reactions:** Use 👍👎 for quick polls
3. **Breakout rooms:** Pairs for ADR review
4. **Shared whiteboard:** Miro, FigJam, or Excalidraw
5. **Physical breaks:** Every 45-60 minutes

### Virtual Whiteboard Setup

| Workshop | Recommended Tool | Setup |
|----------|------------------|-------|
| Constitution | Miro | Pre-create section templates |
| ADR | Google Docs/Notion | Shared ADR docs |
| System Spec | FigJam | Persona cards, journey maps |
| Security | Miro | Data flow diagrams |

### Screen Sharing Etiquette

- Share specific window, not full screen
- Use annotation tools for pointing
- Pause for questions every 10 minutes
- Record sessions for absent members

---

## Post-Workshop Checklist

### Immediately After Each Workshop

- [ ] Thank participants
- [ ] Share photos/screenshots of whiteboards
- [ ] Send parking lot items to owners
- [ ] Schedule follow-ups for open items

### Within 24 Hours

- [ ] Type up decisions into documents
- [ ] Distribute to all participants for review
- [ ] Note open questions and owners
- [ ] Update project documentation

### Before Next Workshop

- [ ] Review action items from previous day
- [ ] Confirm attendance for next workshop
- [ ] Prepare materials and templates
- [ ] Address any blockers

---

## Facilitator Self-Assessment

After each workshop, rate yourself:

| Criterion | 1-5 | Notes |
|-----------|-----|-------|
| Time management | | |
| Equal participation | | |
| Decisions captured | | |
| Conflict managed | | |
| Kept focus on objectives | | |
| Achieved workshop outcomes | | |

**Improvement for next workshop:** _______________________
