# Week 2 Workshop Facilitation Guide

> Tips and techniques for running effective constraint and requirements workshops.

---

## General Facilitation Principles

### The Facilitator's Role

1. **Guide, don't decide:** You manage the process, not the content
2. **Stay neutral:** Don't advocate for specific solutions
3. **Time-keep:** Respect everyone's time
4. **Document:** Capture everything, attribute nothing (during workshop)
5. **Synthesize:** Help group find common ground

### Ground Rules (Read at Start)

> 1. **Constraints only** — We're not designing solutions today
> 2. **No idea is bad** — Capture everything, filter later
> 3. **Source matters** — "Who said this?" is always valid
> 4. **Disagree openly** — Silence = agreement
> 5. **Parking lot** — Off-topic items go to the parking lot
> 6. **Timeboxes are sacred** — We move on when the timer rings

---

## Room Setup

### In-Person

- U-shape or circle seating (everyone sees each other)
- Whiteboard visible to all
- Sticky notes on every table (3 colors: priorities)
- Markers (multiple colors)
- Timer visible on screen or wall
- Snacks and water available

### Virtual

- Cameras on (if possible)
- Virtual whiteboard shared (Miro, FigJam, Mural)
- Chat for side conversations and questions
- Mute when not speaking
- Facilitator controls screen share

---

## Constraint Discovery Workshop (Day 1)

### Agenda (3 hours)

| Time | Activity | Facilitator Notes |
|------|----------|-------------------|
| 0:00 | Welcome + ground rules | Set expectations early |
| 0:10 | Context setting | Share domain overview, goals |
| 0:20 | Functional constraints | Brainstorm business rules |
| 0:50 | NFR constraints | Performance, availability, accessibility |
| 1:20 | **Break** | Keep to 15 min exactly |
| 1:35 | Integration constraints | External systems |
| 1:55 | Regulatory constraints | Compliance, security |
| 2:15 | Technical constraints | Stack, infrastructure |
| 2:35 | Organizational constraints | Timeline, team, budget |
| 2:50 | Wrap-up + next steps | Assign homework |

### Facilitation Techniques

#### Silent Brainstorming (5 min per category)

1. Everyone writes constraints on sticky notes silently
2. One constraint per sticky note
3. Post on wall/board when done
4. Group similar items together
5. No discussion until everyone has contributed

**Why it works:** Prevents dominant voices from taking over. Everyone contributes.

#### Round Robin

1. Go around the room, one constraint per person
2. No discussion until everyone has contributed
3. Skip if no new ideas
4. Repeat until ideas exhausted

**Use when:** Silent brainstorming yields too few ideas.

#### Affinity Mapping

1. Group similar constraints together
2. Name each group (theme)
3. Identify gaps (empty groups)
4. Vote on importance

**Use when:** Too many constraints, need organization.

---

## MoSCoW Prioritization Workshop (Day 2)

### Agenda (2 hours)

| Time | Activity | Notes |
|------|----------|-------|
| 0:00 | Review constraint list | Ensure completeness |
| 0:10 | Explain MoSCoW | Must/Should/Could/Won't |
| 0:20 | Dot voting round 1 | Individual prioritization |
| 0:40 | Discuss disagreements | Focus on Musts only |
| 1:00 | **Break** | 10 min |
| 1:10 | Finalize Musts | Consensus or escalate |
| 1:30 | Quick pass on Should/Could | Time-boxed |
| 1:50 | Document Won'ts | Equally important |

### Dot Voting Technique

1. List all constraints on wall
2. Each participant gets 5 dots
3. Place dots on most important items
4. Can stack dots (max 2 per item)
5. Count and rank

**Variation - Colored Dots:**
- 🔴 Red = Must Have
- 🟡 Yellow = Should Have
- 🟢 Green = Could Have

### Handling Priority Deadlock

**Technique: Trade-off Questions**

> "If we have to cut 30% of scope, what goes first?"
> "If this takes 3x longer than expected, do we still do it?"
> "If we skip this, what's the business impact in dollars?"

**Technique: Priority Poker**

1. Each stakeholder assigns priority privately (1-5)
2. Reveal simultaneously
3. Discuss only where there's disagreement (>2 point spread)
4. Converge or escalate to PO

**Technique: Buy-a-Feature**

1. Assign "costs" to features (based on effort)
2. Give stakeholders budget (play money)
3. They "buy" features until budget exhausted
4. What they buy first = highest priority

---

## Journey Mapping Workshop (Day 3)

### Agenda (3 hours)

| Time | Activity | Notes |
|------|----------|-------|
| 0:00 | Select journeys | 3-5 priority journeys |
| 0:15 | Demo journey mapping | Facilitator shows example |
| 0:30 | Team breakout | Small groups map assigned journeys |
| 1:30 | **Break** | 15 min |
| 1:45 | Present journeys | Each group presents |
| 2:15 | Cross-review | Groups critique each other |
| 2:45 | Consolidate | Merge feedback, identify gaps |

### Journey Mapping Steps

1. **Identify the actor** — Who is doing this?
2. **Define the goal** — What are they trying to accomplish?
3. **List preconditions** — What must be true before starting?
4. **Map happy path** — Ideal flow, 3-7 steps
5. **Add failure paths** — What can go wrong? (aim for 5+)
6. **Identify edge cases** — Unusual scenarios
7. **Define postconditions** — What's true after completion?

### Failure Path Generation

**Prompt questions:**
- What if the input is invalid?
- What if the user isn't authorized?
- What if the resource doesn't exist?
- What if someone else changed it first?
- What if the system is down?
- What if the user abandons halfway?

### Journey Template (Whiteboard)

```
┌─────────────────────────────────────────────────────────────┐
│ JOURNEY: ________________________________                   │
│ ACTOR: _____________  GOAL: _______________                 │
├─────────────────────────────────────────────────────────────┤
│ PRECONDITIONS:                                              │
│ • ___________________                                       │
│ • ___________________                                       │
├─────────────────────────────────────────────────────────────┤
│ HAPPY PATH:                                                 │
│ ┌───┐    ┌───┐    ┌───┐    ┌───┐    ┌───┐                  │
│ │ 1 │───►│ 2 │───►│ 3 │───►│ 4 │───►│ 5 │                  │
│ └───┘    └───┘    └───┘    └───┘    └───┘                  │
├─────────────────────────────────────────────────────────────┤
│ FAILURE PATHS:                                              │
│ • F1: ___________________  → Recovery: ________________     │
│ • F2: ___________________  → Recovery: ________________     │
│ • F3: ___________________  → Recovery: ________________     │
├─────────────────────────────────────────────────────────────┤
│ POSTCONDITIONS:                                             │
│ • ___________________                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## AC Writing Workshop (Day 4)

### Agenda (2 hours)

| Time | Activity | Notes |
|------|----------|-------|
| 0:00 | Gherkin refresher | Given/When/Then basics |
| 0:15 | Demo AC writing | Convert sample journey to AC |
| 0:30 | Team practice | Convert assigned journeys |
| 1:15 | **Break** | 10 min |
| 1:25 | Peer review | Trade and critique |
| 1:45 | Testability check | QA reviews for testability |

### Gherkin Quick Reference

```gherkin
Feature: [Feature Name]
  As a [actor]
  I want to [action]
  So that [benefit]

  Background:
    Given [common precondition]

  @tag1 @tag2
  Scenario: [Scenario Name]
    Given [precondition]
    And [another precondition]
    When [action]
    And [another action]
    Then [expected result]
    And [another expected result]
```

### Common AC Mistakes

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| "System is fast" | "Response time <500ms" |
| "Error shows" | "Error message 'Order not found'" |
| "User can manage" | "User can view, edit, delete" |
| Multiple actions in When | One action per When |
| No failure scenarios | Add 3-5 failure scenarios |

---

## Handling Difficult Situations

### "Everything is P1"

**Script:**
> "If we could only deliver ONE thing, what would it be? Start there. Now, if we had time for just TWO things, what's next?"

### Silent Participants

**Script:**
> "Let's hear from someone who hasn't spoken yet. [Name], what constraints do you see?"

**Technique:** Call on people directly, but kindly.

### Tangents

**Script:**
> "Great point. Let me add it to the parking lot so we don't lose it. Now, back to [topic]..."

### Conflict

**Script:**
> "I'm hearing two perspectives. Let's capture both as constraints and let the data inform our decision. We can revisit if needed."

### Running Over Time

**Script:**
> "We're at time. I'm going to capture what we have and move on. We can schedule follow-up if needed."

### One Person Dominating

**Script:**
> "Thanks [Name], great input. Let's hear from others now."

**Technique:** Use round-robin or silent brainstorming to equalize participation.

---

## Remote Workshop Tips

### Engagement Techniques

1. **Check-ins:** Start each session with quick round-robin ("One word for how you're feeling")
2. **Chat reactions:** Use emoji reactions for quick votes (👍👎)
3. **Breakout rooms:** Small groups for parallel brainstorming
4. **Timeboxed silence:** "Mute and type for 3 minutes"
5. **Physical movement:** "Stand up and stretch" between sessions

### Virtual Whiteboard Best Practices

| Tool | Best For | Setup |
|------|----------|-------|
| Miro | Complex workshops | Pre-create frames |
| FigJam | Quick collaboration | Minimal setup |
| Mural | Structured templates | Use built-in templates |

**Tips:**
- Pre-create sticky note areas
- Color-code by category
- Lock background elements
- Share editing link in advance

### Camera Fatigue Mitigation

- Cameras optional during silent work
- Take breaks every 45-60 min
- Use audio-only for some discussions
- End 5 min early

---

## Post-Workshop Checklist

### Immediately After

- [ ] Thank participants
- [ ] Share photos of whiteboard/sticky notes
- [ ] Send parking lot items to relevant owners
- [ ] Schedule follow-ups for unresolved items

### Within 24 Hours

- [ ] Type up constraint register
- [ ] Distribute to all participants for review
- [ ] Note open questions and owners
- [ ] Update project documentation

### Within 48 Hours

- [ ] Get stakeholder confirmation on priorities
- [ ] Resolve conflicting constraints
- [ ] Finalize documents for Gate 2

---

## Facilitator Self-Assessment

After each workshop, rate yourself:

| Criterion | 1-5 | Notes |
|-----------|-----|-------|
| Time management | | |
| Equal participation | | |
| Captured all input | | |
| Managed conflict | | |
| Kept focus | | |
| Achieved outcomes | | |

**Improvement for next time:** _______________________
