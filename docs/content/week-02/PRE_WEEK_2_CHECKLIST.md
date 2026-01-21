# Pre-Week 2 Checklist

> Complete these items before Day 1 of Week 2.

**Owner:** Week 2 Lead  
**Due:** Day 0 (Friday before Week 2)

---

## Gate 1 Verification

### Team Readiness

- [ ] All team members passed Gate 1
- [ ] Labs 0-6 completed by each participant
- [ ] PRs reviewed and merged to `/working/` folder
- [ ] Prompt Pack v1 distributed and understood

### Verify Completion

| Team Member | Gate 1 Status | Labs Complete | Notes |
|-------------|---------------|---------------|-------|
| | ☐ Pass / ☐ Fail | ☐ Yes / ☐ No | |
| | ☐ Pass / ☐ Fail | ☐ Yes / ☐ No | |
| | ☐ Pass / ☐ Fail | ☐ Yes / ☐ No | |
| | ☐ Pass / ☐ Fail | ☐ Yes / ☐ No | |

---

## Stakeholder Preparation

### Identify Stakeholders

| Role | Name | Email | Availability | Required Days |
|------|------|-------|--------------|---------------|
| Product Owner | | | | Days 1-2, 5 |
| Business Analyst | | | | Days 1-3 |
| UX Lead | | | | Day 3 |
| Tech Lead (FE) | | | | All days |
| Tech Lead (BE) | | | | All days |
| QA Lead | | | | Days 4-5 |
| Security Lead | | | | Day 2 |

### Schedule Workshops

| Workshop | Day | Duration | Required Attendees | Room/Link |
|----------|-----|----------|-------------------|-----------|
| Constraint Discovery | Day 1 | 3 hours | PO, BA, Tech Leads | |
| MoSCoW Prioritization | Day 2 | 2 hours | PO, Tech Leads | |
| Journey Mapping | Day 3 | 3 hours | UX, PO, Tech Leads | |
| AC Writing | Day 4 | 2 hours | QA, Tech Leads | |
| Gate 2 Review | Day 5 | 2 hours | All Leads | |

**Scheduling Checklist:**
- [ ] Calendar invites sent (with 24-hour advance notice)
- [ ] Room/virtual meeting booked
- [ ] Stakeholder availability confirmed
- [ ] Backup attendees identified for key roles

---

## Documentation Gathering

### Collect Input Documents

- [ ] Business Requirements Document (BRD)
- [ ] Functional Specifications (if any)
- [ ] Existing system documentation
- [ ] Compliance/regulatory requirements
- [ ] SLA documents (performance, availability)
- [ ] Previous project lessons learned
- [ ] User research / personas (if available)

### Prepare Templates

- [ ] CONSTRAINT_REGISTER.md printed/accessible
- [ ] OBJECTIVES_MAP.md printed/accessible
- [ ] USER_JOURNEYS.md printed/accessible
- [ ] ACCEPTANCE_CRITERIA.md printed/accessible

### Pre-Read Distribution

Send these documents to stakeholders:
- [ ] DOMAIN_CONTEXT.md
- [ ] Week 2 Agenda Overview
- [ ] Template previews (what we'll fill out)

---

## Technical Preparation

### Verify Copilot Features

| Feature | Status | Tested By |
|---------|--------|-----------|
| @workspace queries | ☐ Working | |
| #file references | ☐ Working | |
| P15 prompt tested | ☐ Working | |
| Chat history clearing | ☐ Understood | |

### Test P15 with Sample

Run this test before Day 1:

```markdown
No secrets, no production data. Use placeholders.

Extract constraints from this sample requirement:
"Users must be able to search orders by date range and status."

Format as constraint register table.
```

**Expected:** Copilot returns structured constraint table.

### Prepare Lab Materials

- [ ] Sample requirements doc for Lab 2-0 ready
- [ ] Lab instructions accessible to all participants
- [ ] Working folder structure created: `/working/constraints/`
- [ ] Example submissions available for reference

---

## Logistics

### Physical Workshop (if in-person)

- [ ] Whiteboard/flipcharts available
- [ ] Sticky notes (3 colors minimum)
- [ ] Markers (multiple colors)
- [ ] Timer/stopwatch visible
- [ ] Projector/screen working
- [ ] Participant seating arranged

### Virtual Workshop (if remote)

- [ ] Virtual whiteboard tool set up (Miro, FigJam, etc.)
- [ ] Video conferencing tested
- [ ] Breakout rooms configured (if needed)
- [ ] Screen sharing tested
- [ ] Recording permissions obtained (if recording)
- [ ] Backup communication channel (Slack, Teams)

---

## Communication

### Pre-Week Communication

- [ ] Week 2 overview email sent to team
- [ ] Stakeholder briefing sent
- [ ] Pre-read materials distributed
- [ ] FAQ shared for common questions

### Template Email: Stakeholder Briefing

```
Subject: Week 2 Prep: Constraint & Requirements Workshops

Hi [Stakeholder],

Next week we begin Week 2 of our AI-Assisted Development Bootcamp, 
focusing on documenting constraints and requirements.

YOUR ROLE:
- Attend [specific workshop(s)] on [date(s)]
- Come prepared to prioritize features and discuss trade-offs
- Be ready to make decisions (or identify who can)

PRE-READ (optional but helpful):
- DOMAIN_CONTEXT.md (attached) - our business domain
- CONSTRAINT_REGISTER.md template - what we'll fill out together

PREPARATION:
- Review any existing requirements documentation
- Think about "must have" vs "nice to have" features
- Identify any compliance/regulatory requirements

Questions? Reply to this email or find me on Slack.

Thanks,
[Your Name]
Week 2 Lead
```

- [ ] Email sent to all stakeholders
- [ ] Out-of-office replies handled (reschedule if needed)

---

## Risk Mitigation

### Common Week 2 Risks

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Stakeholder no-shows | Medium | High | Identify backup, get async input | Lead |
| Requirements docs missing | Medium | Medium | Use domain context + discovery | Lead |
| Priority deadlocks | High | Medium | Escalation path to sponsor | PO |
| Time overruns | High | Low | Strict time-boxing, parking lot | Facilitator |
| Copilot issues | Low | Medium | Have manual fallback ready | Tech Lead |
| Conflicting stakeholder views | High | Medium | Document both, escalate to PO | Facilitator |

### Contingency Plans

**If stakeholder unavailable:**
1. Get async input via email template
2. Identify delegate with decision authority
3. Mark decisions as "pending validation"

**If requirements docs don't exist:**
1. Use DOMAIN_CONTEXT.md as starting point
2. Run discovery workshop
3. Document assumptions explicitly

**If Copilot is down:**
1. Manual brainstorming with sticky notes
2. Template-guided discussion
3. Document manually, add Copilot analysis later

---

## Day 0 Final Checks

### Morning

- [ ] Templates finalized and accessible
- [ ] Labs tested end-to-end
- [ ] @workspace verified on project repo
- [ ] All materials ready for distribution

### Afternoon

- [ ] Stakeholder confirmation calls/emails sent
- [ ] Materials distributed to participants
- [ ] Backup plans confirmed with co-facilitators
- [ ] Room/virtual setup verified

### End of Day

- [ ] Team standup: "Ready for Week 2?"
- [ ] Any blockers escalated
- [ ] Facilitator checklist reviewed
- [ ] Celebration planned for Gate 2 (Friday)

---

## Ready State Confirmation

**Week 2 is ready to begin when ALL items are checked:**

- [ ] Gate 1 passed (all team members)
- [ ] All workshops scheduled with confirmed attendees
- [ ] Templates accessible to all participants
- [ ] Input documents gathered
- [ ] Copilot features verified
- [ ] Facilitator prepared with backup plans
- [ ] Pre-week communication sent

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Week 2 Lead | | | |
| Tech Lead (FE) | | | |
| Tech Lead (BE) | | | |
| Product Owner | | | |

---

## Quick Reference: Week 2 Schedule

| Day | Focus | Key Deliverable |
|-----|-------|-----------------|
| Day 1 | Constraint Discovery | Constraint Register (draft) |
| Day 2 | MoSCoW Prioritization | Objectives Map |
| Day 3 | Journey Mapping | 3-5 User Journeys |
| Day 4 | AC Writing | Acceptance Criteria per Journey |
| Day 5 | Gate 2 Review | Sign-off + Labs complete |

**Labs Schedule:**
- Lab 2-0: Day 1 (after workshop)
- Lab 2-1: Day 3 (after journey workshop)
- Lab 2-2: Day 4 (after AC workshop)
- Lab 2-3: Day 5 (before Gate 2)
