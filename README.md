# AI-Assisted Development Bootcamp

> **EDF Copilot Enterprise Bootcamp** — 12 weeks from AI curiosity to production-ready delivery.

---

## 🚀 Quick Start

| Step | Action                                                          |
| ---- | --------------------------------------------------------------- |
| 1    | **[Start Here](.START_HERE.md)** — 5-minute onboarding          |
| 2    | Run `npm install` to set up bootcamp CLI tools                  |
| 3    | **[Master Index](.MASTER_BOOTCAMP.md)** — Full 12-week program  |
| 4    | **[Facilitator Guide](,FACILITATOR_GUIDE.md)** — For team leads |

---

## 🛠️ CLI Tools

After running `npm install`, these commands are available:

### Bootcamp Runner
```bash
npm run bootcamp:list           # List all step IDs
npm run bootcamp -- step X      # View step details (e.g., week-01-lab-00)
```

### Progress Tracking
```bash
npm run progress:init           # Initialize your progress file
npm run progress:start          # Mark a lab as started
npm run progress:complete       # Mark a lab as complete
npm run progress:dashboard      # Generate cohort dashboard
npm run progress:alerts         # Check for stuck students
```

💡 **Tip:** You can also interact via Copilot Chat! Say "Start the bootcamp" or "What's next for me?"  
See [COPILOT_COURSE_COMMANDS.md](COPILOT_COURSE_COMMANDS.md) for all voice commands.

---

## Program Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PREPARATION PHASE (Weeks 1-4)                      │
├─────────────────────────────────────────────────────────────────────────┤
│  Week 1         Week 2         Week 3         Week 4                    │
│  ┌───────┐     ┌───────┐     ┌───────┐     ┌───────┐                    │
│  │  AI   │────►│ Spec  │────►│  Arch │────►│  API  │                    │
│  │ Safe  │     │ Intake│     │ Design│     │ Ready │                    │
│  └───┬───┘     └───┬───┘     └───┬───┘     └───┬───┘                    │
│      │ Gate 1      │ Gate 2      │ Gate 3      │ Gate 4                 │
├─────────────────────────────────────────────────────────────────────────┤
│                      EXECUTION PHASE (Weeks 5-12)                       │
├─────────────────────────────────────────────────────────────────────────┤
│  Sprint 1       Sprint 2       Sprint 3       Sprint 4                  │
│  (Wk 5-6)       (Wk 7-8)       (Wk 9-10)      (Wk 11-12)                │
│  ┌───────┐     ┌───────┐     ┌───────┐     ┌───────┐                    │
│  │ Thin  │────►│Expand │────►│Harden │────►│ Ship  │                    │
│  │ Slice │     │ +NFR  │     │ +Sec  │     │ Ready │                    │
│  └───┬───┘     └───┬───┘     └───┬───┘     └───┬───┘                    │
│      │ Demo        │ Demo        │ Demo        │ Gate 5                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Week Entry Points

| Week   | Focus                      | Entry                                           |
| ------ | -------------------------- | ----------------------------------------------- |
| Week 1 | AI Enablement + Guardrails | [Week 1 README](docs/content/week-01/README.md) |
| Week 2 | Constraint Register        | [Week 2 README](docs/content/week-02/README.md) |
| Week 3 | Spec-First Packaging       | [Week 3 README](docs/content/week-03/README.md) |
| Week 4 | Contract-First             | [Week 4 README](docs/content/week-04/README.md) |

## Sprint Entry Points

| Sprint   | Focus               | Entry                                               |
| -------- | ------------------- | --------------------------------------------------- |
| Sprint 1 | Thin Vertical Slice | [Sprint 1 README](docs/content/sprint-01/README.md) |
| Sprint 2 | Expand + Basic NFRs | [Sprint 2 README](docs/content/sprint-02/README.md) |
| Sprint 3 | Harden + Security   | [Sprint 3 README](docs/content/sprint-03/README.md) |
| Sprint 4 | Polish + Ship       | [Sprint 4 README](docs/content/sprint-04/README.md) |

---

## The 3 Non-Negotiable Rules

| Rule               | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| **1. Plan First**  | Copilot produces a plan (files, steps, tests, risks) before code |
| **2. Small Diffs** | Reviewable increments; no broad refactors                        |
| **3. Proof**       | Build + tests must pass. If it isn't verified, it doesn't ship   |

---

## Key Resources

| Resource           | Location                                                                       |
| ------------------ | ------------------------------------------------------------------------------ |
| Domain Context     | [DOMAIN_CONTEXT.md](docs/shared/reference-materials/DOMAIN_CONTEXT.md)         |
| Definition of Done | [DEFINITION_OF_DONE.md](docs/shared/reference-materials/DEFINITION_OF_DONE.md) |
| Prompt Pack        | [PROMPT_PACK_V1.md](docs/shared/reference-materials/PROMPT_PACK_V1.md)         |
| Progress Tracker   | [PROGRESS_TRACKER.md](docs/participants/PROGRESS_TRACKER.md)                   |
| Copilot Commands   | [COPILOT_COURSE_COMMANDS.md](COPILOT_COURSE_COMMANDS.md)                       |
| Rituals            | [Ceremonies](docs/shared/ceremonies-process/README.md)                         |

---

## Navigation

| Previous | Home             | Next                           |
| -------- | ---------------- | ------------------------------ |
| —        | **You are here** | [Start Here →](.START_HERE.md) |
