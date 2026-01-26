# File Ownership Matrix (to avoid merge conflicts)

**Rule:** Each subagent may edit **only** its owned paths unless explicitly granted an exception by the Coordinator.

## Core / platform (Agent A00)
- `.vscode/**`
- `scripts/**`
- `bootcamp/steps/**` *(only when not owned by a week/sprint agent; otherwise coordinate)*
- `package.json`
- `.github/**` *(workflows + copilot instructions)*
- Root docs: `README.md`, `.START_HERE.md`, `.MASTER_BOOTCAMP.md`, `,FACILITATOR_GUIDE.md` *(only where assigned)*

## Weeks (content normalization + rails + local prompts)
- **A01 — Week 01**: `docs/content/week-01/**`, `bootcamp/steps/week-01/**`
- **A02 — Week 02**: `docs/content/week-02/**`, `bootcamp/steps/week-02/**`
- **A03 — Week 03**: `docs/content/week-03/**`, `bootcamp/steps/week-03/**`
- **A04 — Week 04**: `docs/content/week-04/**`, `bootcamp/steps/week-04/**`

## Sprints (navigation rails + link fixes + step metadata coherence)
- **A05 — Sprint 01**: `docs/content/sprint-01/**`, `bootcamp/steps/sprint-01/**`
- **A06 — Sprint 02**: `docs/content/sprint-02/**`, `bootcamp/steps/sprint-02/**`
- **A07 — Sprint 03**: `docs/content/sprint-03/**`, `bootcamp/steps/sprint-03/**`
- **A08 — Sprint 04**: `docs/content/sprint-04/**`, `bootcamp/steps/sprint-04/**`

## Shared participant docs (Agent A00)
- `docs/participants/**`
- `docs/shared/**`

## Exceptions
- If a fix is needed outside your paths, do **not** patch it “because you can.”  
  Log it as a suggested follow-up in `INTEGRATION_LOG.md` for the relevant owner.
