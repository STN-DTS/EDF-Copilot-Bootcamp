# Tech Stack Decision Workshop (Week 1)

## Purpose
Identify (or shortlist) the tech stack quickly, using structured questions and a documented decision.
Output is an ADR (architecture decision record).

## Inputs (bring to workshop)
- Business constraints already known (security, hosting, integrations, accessibility)
- Current team skills (languages/frameworks)
- Operational constraints (CI/CD, cloud/on-prem, procurement)

## Agenda (60 minutes)
1) Constraints first (15 min)
2) Candidate stacks (15 min)
3) Scoring (20 min)
4) Decision + next actions (10 min)

---

## 1) Constraints — questions to ask (team + stakeholders)
### Hosting / environment
- Cloud permitted? Which cloud(s)? Any restrictions on region/data residency?
- On-prem required? Hybrid?
- Any container constraints (Kubernetes, OpenShift, “no containers”)?
- Identity provider: Azure AD / other? SSO requirements?

### Security / compliance
- Data classification: Protected A/B/C (or equivalent), PII presence?
- Logging/audit needs (who did what, when, where)?
- Encryption requirements (at rest/in transit, key mgmt)?

### Integration
- What systems must we integrate with (APIs, databases, message queues)?
- Are there existing enterprise standards (API gateways, service mesh)?

### UX / accessibility
- WCAG target level? Any mandated design system?
- Browser/device support requirements?

### Delivery / maintainability
- Expected lifespan and ownership model?
- Expected team size over time?
- Support model: business hours? 24/7?

### Team capability
- What frameworks are strongest today in FE and BE?
- What can we support without external dependency?

---

## 2) Candidate stacks (examples)
You can shortlist 2–3 options such as:
- FE: React / Angular / Vue
- BE: .NET / Java (Spring) / Node (Nest/Express) / Python (FastAPI)
- Data: Postgres / SQL Server / etc.

---

## 3) Scoring rubric (simple 1–5)
Score each candidate on:
- Fit to constraints (security/hosting)
- Team skill readiness
- Maintainability
- Testability
- Integration support
- Hiring/availability (if relevant)
- Tooling maturity (CI/CD, lint, scanning)

---

## 4) Output: ADR template (fill today if possible)
Title: “Tech stack choice for <Project>”
Context:
Decision:
Options considered:
Rationale:
Consequences:
Follow-ups:
