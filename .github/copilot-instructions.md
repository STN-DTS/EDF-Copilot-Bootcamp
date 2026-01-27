# GitHub Copilot Instructions

## Master Index

**📋 The authoritative table of contents for all bootcamp content is [.MASTER_BOOTCAMP.md](/.MASTER_BOOTCAMP.md).**

When making changes to the syllabus (adding/removing labs, moving documents, creating new weeks), you MUST update `.MASTER_BOOTCAMP.md` to reflect the change.

---

## Project Context

This is an EDF Bootcamp focused on AI-assisted development practices (GitHub Copilot Enterprise specific).

**Business Domain:** Order Management (Orders, Customers, Items)  
See `/docs/shared/reference-materials/DOMAIN_CONTEXT.md` for entities, relationships, and sample data.

---

## The 3 Non-Negotiable Rules

1. **Plan first**: Before writing code, get a plan (files, steps, tests, risks).
2. **Small diffs**: Keep changes reviewable; avoid broad refactors.
3. **Proof**: Build + tests must pass. If it isn't verified, it doesn't ship.

---

## Safety Rules (MANDATORY)

Never put any of the following into prompts or Copilot chats:
- Credentials, tokens, secrets, keys
- Production data
- Personal information beyond what is strictly needed
- Internal sensitive details restricted by policy

**Always use placeholders:** `<TOKEN>`, `<USER_ID>`, `<EMAIL>`, `<ACCOUNT_NUMBER>`, `"SampleCustomerA"`

**Every prompt must begin with:**
> "No secrets, no production data. Use placeholders."

---

## Working Folder Structure (MANDATORY for Lab Submissions)

All lab work must be submitted in the `/working/` folder with proper structure:

```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
```

### Required Contents
- All new/changed files for the lab
- `README.md` with: your name, date, lab number, verification commands run
- `PLAN.md` (for Labs 1+) with your approved Copilot plan

### Example
```
/working/backend/jsmith_20260120_1430/
├── README.md
├── PLAN.md
├── src/
│   └── (your implementation)
└── test/
    └── (your tests)
```

> 📁 See `/working/frontend/example_lab*/` and `/working/backend/example_lab*/` for reference submissions.

---

## Code Style and Conventions

- Follow language-specific best practices
- Write clear, self-documenting code
- Use meaningful variable and function names
- Include appropriate comments for complex logic

### Frontend (React Router v7)
- Use RRv7 loader/action conventions
- Place routes in `src/routes/`
- Use Problem Details for error handling
- See `.github/instructions/frontend.instructions.md`

### Backend (Spring Boot)
- Use controller/service/repository layering
- Use Problem Details for error responses
- See `.github/instructions/backend.instructions.md`

---

## Testing Requirements

- Write tests before implementation when using TDD approach (Lab 3+)
- Ensure adequate test coverage for new features
- Follow testing patterns established in the project
- See `.github/instructions/testing.instructions.md`

### Frontend: Vitest + React Testing Library
### Backend: JUnit 5 + Spring Boot Test + Testcontainers/H2

---

## Student Course Navigation

Copilot can help students navigate the bootcamp using natural language commands.

### Quick Reference Commands

| Student Says | Action |
|--------------|--------|
| "Start the bootcamp" | Run onboarding flow |
| "Where did I leave off?" | Check and report progress |
| "Start lab 2" | Begin lab, mark as in-progress |
| "Finished lab 3" | Mark lab complete |
| "I'm stuck" | Offer debugging help |

### Key Files for Navigation

| File | Purpose |
|------|---------|
| `.START_HERE.md` | Entry point for new students |
| `.MASTER_BOOTCAMP.md` | Complete table of contents |
| `COPILOT_COURSE_COMMANDS.md` | Quick reference for voice commands |
| `progress/cohorts/<cohort>/<user>.md` | Individual progress tracking |

### Onboarding New Students

When a student says "Start the bootcamp" or similar:
1. Welcome them to the EDF Copilot Bootcamp
2. Ask for: name, GitHub username, cohort, track (frontend/backend)
3. Run `npm install` and `npm run progress:init -- ...`
4. Direct them to `.START_HERE.md`
5. Offer to start Lab 0

### Checking Progress

When a student asks "Where did I leave off?" or similar:
1. Identify their GitHub username and cohort
2. Read `progress/cohorts/<cohort>/<username>.md`
3. Report their completion status
4. Suggest the next lab to work on

See `.github/instructions/student-navigation.instructions.md` for detailed flows.

---

## Documentation

- Update relevant documentation when adding features
- Keep README files current in your working folder
- Document API changes and breaking changes
- Include verification commands in all PRs

---

## AI Collaboration Guidelines

- Break down complex tasks into smaller steps
- Request explanations when code isn't clear
- Validate AI suggestions before accepting
- Use iterative refinement for better results
- **Always request a plan before implementation (Prompt P0)**

---

## Project-Specific Guidelines

- Refer to `/docs/` for bootcamp-specific instructions
- Follow the micro-labs progression (Lab 0 → Lab 6)
- Apply patterns learned in workshops
- Use prompts from `/docs/shared/reference-materials/PROMPT_PACK_V1.md`

---

## Key Resources

| Resource | Location |
|----------|----------|
| **Master Index** | `/.MASTER_BOOTCAMP.md` |
| Domain Context | `/docs/shared/reference-materials/DOMAIN_CONTEXT.md` |
| Definition of Done | `/docs/shared/reference-materials/DEFINITION_OF_DONE.md` |
| Prompt Pack | `/docs/shared/reference-materials/PROMPT_PACK_V1.md` |
| Lab Rubrics | `/docs/content/week-01/LAB_RUBRICS.md` |
| FAQ | `/docs/content/week-01/FAQ.md` |
| Week 1 Program | `/docs/content/week-01/WEEK_1_PROGRAM.md` |
| Model Policy | `/docs/content/week-01/WEEK_1_MODEL_POLICY.md` |
| Rituals | `/docs/shared/ceremonies-process/README.md` |
| PR Template | `.github/pull_request_template.md` |

---

## Syllabus Change Protocol

**IMPORTANT:** When making changes to bootcamp content, you MUST update the master index.

### What Triggers an Update to .MASTER_BOOTCAMP.md

- Adding, removing, or renaming a lab
- Adding, removing, or renaming a week or sprint
- Moving or renaming any document
- Creating new resources or workshops
- Changing lab descriptions or timeboxes

### Update Checklist

After modifying syllabus content:
- [ ] Update the relevant section in `.MASTER_BOOTCAMP.md`
- [ ] Verify all links are correct
- [ ] Update the "Last Updated" date
- [ ] Add entry to Version History table

---

## PR Submission Checklist

Every PR must include:
- [ ] Files placed in `/working/{frontend|backend}/{name}_{timestamp}/`
- [ ] README.md with name, date, lab number
- [ ] Verification commands run (build, test, lint)
- [ ] "Copilot vs human" notes (what AI generated vs what you fixed)
- [ ] All tests passing
