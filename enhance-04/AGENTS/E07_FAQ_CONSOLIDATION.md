# E07_FAQ_CONSOLIDATION — Create Missing FAQs

## Mission
Create FAQ documents for weeks and sprints that are missing them, ensuring every major section has troubleshooting guidance.

---

## File ownership (absolute)

**Owned paths (create new):**
- `docs/content/week-03/WEEK_3_FAQ.md`
- `docs/content/sprint-01/FAQ.md`
- `docs/content/sprint-02/FAQ.md`
- `docs/content/sprint-03/FAQ.md`
- `docs/content/sprint-04/FAQ.md`

**May update:**
- Existing FAQs (add cross-references)
- Week/sprint README files (add FAQ links)

**Must NOT edit:**
- Lab content
- Assessment framework
- Core program documents

---

## Recon Gate (mandatory before edits)

Before making any changes:

1. **Confirm existing FAQs:**
   - `docs/content/week-01/FAQ.md` — exists
   - `docs/content/week-02/WEEK_2_FAQ.md` — exists
   - `docs/content/week-04/WEEK_4_FAQ.md` — exists

2. **Confirm missing FAQs:**
   - `docs/content/week-03/WEEK_3_FAQ.md` — MISSING
   - Sprint FAQs — all MISSING

3. **Read existing FAQs** to understand format and common patterns

**Output your recon findings before proceeding.**

---

## Tasks

### Task 1: Create Week 3 FAQ
Create `docs/content/week-03/WEEK_3_FAQ.md`:

```markdown
# Week 3 FAQ — Spec-First Packaging

Common questions and troubleshooting for Week 3 labs.

---

## ADR Drafting (Lab 3-0)

### Q: What's the right level of detail for an ADR?
**A:** An ADR should be concise but complete. Include:
- Context (why this decision matters)
- Decision (what you chose)
- Consequences (trade-offs accepted)

Aim for 1-2 pages. If it's longer, you may be combining multiple decisions.

### Q: How do I know if my ADR is "approved"?
**A:** An ADR is approved when:
- At least one peer has reviewed it
- Facilitator has signed off
- Status is changed from "Proposed" to "Accepted"

### Q: Can I change an ADR after it's approved?
**A:** Yes, but create a new ADR that supersedes the old one. Never silently modify an accepted ADR—the history matters.

---

## Constitution Section (Lab 3-1)

### Q: What's a "constitution" in this context?
**A:** The constitution is the project's core principles document. It captures non-negotiable rules and patterns that all code must follow.

### Q: How detailed should my constitution section be?
**A:** Be specific enough that Copilot can follow the rule. Vague principles like "write good code" don't help. Instead: "All public methods must have JSDoc comments with @param and @returns."

---

## System Spec Persona (Lab 3-2)

### Q: What's a system spec persona?
**A:** It's a character that embodies how the system should behave. Instead of dry requirements, you describe what "the system" would do in various situations.

### Q: How do I use the persona with Copilot?
**A:** Include the persona in your P0 context prompt. Copilot will generate code that matches the persona's behavior patterns.

---

## ADR Review (Lab 3-3)

### Q: What should I look for when reviewing an ADR?
**A:** Check for:
- Clear problem statement
- Alternatives considered
- Explicit trade-offs
- Reversibility assessment
- Implementation guidance

### Q: How do I give constructive feedback?
**A:** Be specific: "The consequences section doesn't mention performance impact" is better than "needs more detail."

---

## Common Issues

### Copilot generates inconsistent architecture
**Solution:** Add your ADRs to the Copilot context. Reference specific decisions in your prompts.

### ADR gets too long
**Solution:** Split into multiple ADRs. Each decision should be atomic.

### Team disagrees on architecture
**Solution:** That's what ADRs are for! Document the disagreement, the options, and the final decision with rationale.

---

## Related Resources

- [Week 3 Program](WEEK_3_PROGRAM.md)
- [ADR Template](templates/ADR_TEMPLATE.md)
- [Week 2 FAQ](../week-02/WEEK_2_FAQ.md) | [Week 4 FAQ](../week-04/WEEK_4_FAQ.md)
```

### Task 2: Create Sprint 1 FAQ
Create `docs/content/sprint-01/FAQ.md`:

```markdown
# Sprint 1 FAQ — Foundation Sprint

Common questions and troubleshooting for Sprint 1.

---

## Sprint Planning

### Q: How do I estimate tasks with AI assistance?
**A:** Estimate as if you're doing it yourself, then expect ~20-30% time savings from Copilot. Don't assume AI will do everything—you still review and fix.

### Q: What if I can't finish all my tasks?
**A:** Prioritize ruthlessly. Deliver fewer complete features over many incomplete ones. Communicate early if you're at risk.

---

## Backend Tasks

### Q: Copilot generates code that doesn't match our patterns
**A:** Add the relevant `.github/instructions/*.md` files to your Copilot context. Reference specific patterns in your prompts.

### Q: My tests pass locally but fail in CI
**A:** Check for:
- Environment differences (database, ports)
- Timing issues (async tests)
- Missing test data setup

---

## Frontend Tasks

### Q: React Router v7 patterns are confusing
**A:** Review the [frontend instructions](../../../.github/instructions/frontend.instructions.md). RRv7 uses loaders and actions differently than older versions.

### Q: Copilot suggests old React patterns
**A:** Be explicit: "Use React 18 patterns with hooks, not class components. Use React Router v7 loader/action conventions."

---

## Integration Issues

### Q: Frontend and backend don't connect
**A:** Verify:
- CORS configuration
- API base URL
- Contract alignment (OpenAPI spec)
- Environment variables

### Q: Mocks work but real API doesn't
**A:** Your mock may be hiding a contract mismatch. Compare mock responses to actual API responses.

---

## Sprint Ceremonies

### Q: What happens in sprint review?
**A:** Demo working software. Show what you built, not slides. Be prepared for questions.

### Q: What should we discuss in retro?
**A:** Focus on:
- What helped us go faster?
- What slowed us down?
- What should we try differently?
- How is AI adoption going?

---

## Related Resources

- [Sprint 1 Program](SPRINT_1_PROGRAM.md)
- [Sprint Packet](sprint-packet/README.md)
- [Week 1 FAQ](../week-01/FAQ.md)
```

### Task 3: Create Sprint 2 FAQ
Create `docs/content/sprint-02/FAQ.md`:

```markdown
# Sprint 2 FAQ — Core Features

Common questions and troubleshooting for Sprint 2.

---

## NFR Checklist

### Q: What are NFRs?
**A:** Non-Functional Requirements: performance, accessibility, security baseline, logging, etc. Things that aren't features but are required for production.

### Q: How strict is the NFR checklist?
**A:** All items should be addressed. "N/A" is acceptable with justification, but "not done" blocks sprint completion.

---

## Performance

### Q: How do I know if performance is "good enough"?
**A:** Check the NFR checklist targets. Generally:
- API response time < 200ms (p95)
- Page load < 3s
- No memory leaks

### Q: Copilot generates slow code
**A:** AI optimizes for correctness first. After it works, ask: "Optimize this for performance. Current complexity is O(n²), target O(n)."

---

## Accessibility

### Q: What accessibility level do we target?
**A:** WCAG 2.1 AA minimum. This means:
- Keyboard navigable
- Screen reader compatible
- Sufficient color contrast
- Focus indicators visible

### Q: How do I test accessibility?
**A:** Use browser dev tools (Lighthouse), screen reader testing, keyboard-only navigation.

---

## Code Quality

### Q: How much test coverage is required?
**A:** Target 80%+ for business logic. UI components can be lower but should have key interaction tests.

### Q: Copilot generates tests but they're shallow
**A:** Guide it: "Add edge case tests for: null input, empty array, maximum size, concurrent access."

---

## Related Resources

- [Sprint 2 Program](SPRINT_2_PROGRAM.md)
- [NFR Checklist](sprint-packet/NFR_CHECKLIST.md)
- [Sprint 1 FAQ](../sprint-01/FAQ.md)
```

### Task 4: Create Sprint 3 FAQ
Create `docs/content/sprint-03/FAQ.md`:

```markdown
# Sprint 3 FAQ — Security Hardening

Common questions and troubleshooting for Sprint 3.

---

## Authentication

### Q: What auth pattern should we use?
**A:** Follow the ADRs. Typically JWT tokens with refresh flow, or OAuth2/OIDC if integrating with enterprise IdP.

### Q: Copilot generates insecure auth code
**A:** Be very careful with AI-generated security code. Always:
- Review against OWASP guidelines
- Test for common vulnerabilities
- Have security-focused peer review

---

## Authorization

### Q: How granular should permissions be?
**A:** Start coarse (role-based), add granularity as needed. Over-engineering permissions early creates maintenance burden.

### Q: How do I test authorization?
**A:** Test matrix: each role × each action × each resource. Automate these tests.

---

## Security Scanning

### Q: What vulnerabilities are blockers?
**A:** Critical and High severity vulnerabilities block deployment. Medium should be tracked, Low can be deferred.

### Q: Copilot suggests vulnerable dependencies
**A:** Always check `npm audit` or equivalent. AI training data may include outdated vulnerable versions.

---

## Input Validation

### Q: How strict should validation be?
**A:** Validate everything from external sources:
- User input
- API responses
- File uploads
- Query parameters

Reject invalid input; don't try to "fix" it.

### Q: Where should validation happen?
**A:** Defense in depth:
- Frontend (UX feedback)
- API layer (contract enforcement)
- Service layer (business rules)
- Database (constraints)

---

## Security Review

### Q: What does security review cover?
**A:** See the security checklist. Key areas:
- Auth/authz implementation
- Input validation
- Output encoding
- Secret management
- Logging (no sensitive data)
- Error handling (no stack traces)

---

## Related Resources

- [Sprint 3 Program](SPRINT_3_PROGRAM.md)
- [Security Checklist](sprint-packet/SECURITY_CHECKLIST.md)
- [Sprint 2 FAQ](../sprint-02/FAQ.md)
```

### Task 5: Create Sprint 4 FAQ
Create `docs/content/sprint-04/FAQ.md`:

```markdown
# Sprint 4 FAQ — Production Ready

Common questions and troubleshooting for Sprint 4.

---

## Production Readiness

### Q: What does "production ready" mean?
**A:** The ship-ready checklist defines it. Key areas:
- All features complete and tested
- Performance benchmarks met
- Security hardened
- Documentation complete
- Monitoring/alerting configured
- Runbooks written

### Q: What if we're not ready?
**A:** Identify blockers early. Cut scope if needed—it's better to ship less that works than more that doesn't.

---

## Performance Optimization

### Q: How do I find performance bottlenecks?
**A:** Profile first, optimize second:
- Backend: APM tools, database query analysis
- Frontend: Lighthouse, React DevTools profiler
- Target the slowest 20% that causes 80% of delays

### Q: Copilot suggests micro-optimizations
**A:** Ignore micro-optimizations until you've fixed architectural issues. "Make it work, make it right, make it fast."

---

## Documentation

### Q: What documentation is required?
**A:** Minimum:
- API documentation (OpenAPI + examples)
- User guide (key workflows)
- Runbook (operations procedures)
- README (setup + development)

### Q: How do I write good runbooks?
**A:** A runbook should be executable by someone at 3am who's never seen the system:
- Step-by-step commands
- Expected output at each step
- Troubleshooting for common failures
- Escalation contacts

---

## Deployment

### Q: What's the deployment process?
**A:** Follow the sprint packet. Typically:
1. Merge to main (CI runs)
2. Deploy to staging (automated)
3. Smoke test staging
4. Deploy to production (manual gate)
5. Verify production
6. Monitor for issues

### Q: What if production deployment fails?
**A:** Rollback immediately. Diagnose in staging. Never debug in production.

---

## Final Demo

### Q: What should the demo cover?
**A:** Show the user journey:
- Key features working end-to-end
- Performance under load (briefly)
- Security features (auth flow)
- Monitoring dashboard

### Q: How long should the demo be?
**A:** 15-20 minutes max. Practice to fit the time. Have backup slides for deep-dive questions.

---

## Related Resources

- [Sprint 4 Program](SPRINT_4_PROGRAM.md)
- [Ship-Ready Checklist](sprint-packet/SHIP_READY_CHECKLIST.md)
- [Sprint 3 FAQ](../sprint-03/FAQ.md)
```

### Task 6: Add FAQ links to README files
Add links to the new FAQs in each week/sprint README.

---

## Output contract (mandatory)

Return:
1. **Plan** (brief, confirm existing FAQ format reviewed)
2. **Patch** (unified diff for each file created)
3. **Verification** (confirm files exist and links work)
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E07_FAQ_CONSOLIDATION_WORKLOG.md`

---

## Success criteria
- [ ] `docs/content/week-03/WEEK_3_FAQ.md` exists
- [ ] `docs/content/sprint-01/FAQ.md` exists
- [ ] `docs/content/sprint-02/FAQ.md` exists
- [ ] `docs/content/sprint-03/FAQ.md` exists
- [ ] `docs/content/sprint-04/FAQ.md` exists
- [ ] FAQs follow consistent format
- [ ] FAQs linked from respective README files
- [ ] Cross-references between FAQs work
