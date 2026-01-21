# Bootcamp FAQ

## Quick Links
- [Lab Rubrics](LAB_RUBRICS.md) — How labs are evaluated
- [Prompt Pack](../../shared/reference-materials/PROMPT_PACK_V1.md) — Standard prompts to use
- [Domain Context](../../shared/reference-materials/DOMAIN_CONTEXT.md) — Order Management entities
- [Example Solutions](../working/) — Reference submissions

---

## General Questions

### Where do I submit my lab work?
All lab work must be submitted in the `/working/` folder with this structure:
```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
├── README.md      (name, date, lab number, verification commands)
├── PLAN.md        (your approved Copilot plan)
├── src/           (your implementation)
└── test/          (your tests)
```

### Where can I see example submissions?
Reference examples are in:
- `/working/frontend/example_lab0/` through `example_lab6/`
- `/working/backend/example_lab0/` through `example_lab6/`

### What should my README include?
- Your name and date
- Lab number
- Brief description of what you did
- Verification commands run (and their output summary)
- "Copilot vs human" notes (what AI generated vs what you fixed)

### How do I know if I passed a lab?
Check the [Lab Rubrics](LAB_RUBRICS.md) for specific criteria. Generally:
- ✅ All checklist items complete
- ✅ Build and tests pass
- ✅ PR follows template
- ✅ README includes required information

---

## Copilot Questions

### What if Copilot suggests something unsafe?
1. **Never accept** code with secrets, credentials, or production data
2. Use placeholders (`<TOKEN>`, `<USER_ID>`, etc.)
3. Follow prompt discipline: start every prompt with "No secrets, no production data"
4. If unsure, ask a human before accepting

### What if Copilot's suggestions don't match our stack?
1. Check the [Prompt Pack](../../shared/reference-materials/PROMPT_PACK_V1.md) for correct prompts
2. Include explicit context: "Use React Router v7" or "Use Spring Boot 3.x"
3. Reference the domain context: "See docs/shared/reference-materials/DOMAIN_CONTEXT.md"
4. If still wrong, ask the team lead or refer to example solutions

### What if Copilot invents a pattern we don't use?
1. **Stop** — don't accept the suggestion
2. Check `.github/copilot-instructions.md` for our patterns
3. Check the relevant instruction file (`frontend.instructions.md`, etc.)
4. Ask Copilot to regenerate using our specific pattern
5. If still wrong, write it manually and note in your PR

### How do I get better suggestions from Copilot?
1. **Use the prompt templates** from [PROMPT_PACK_V1.md](../../shared/reference-materials/PROMPT_PACK_V1.md)
2. **Provide context** — paths, domain, constraints
3. **Be specific** — "Add GET /api/orders endpoint" not "Add an endpoint"
4. **Ask for a plan first** — always start with P0
5. **Break down large tasks** — smaller prompts get better results

### Which model should I use?
See [MODEL_SELECTION.md](MODEL_SELECTION.md) for full details. Quick guide:
- **Default (Tier 0):** GPT-4.1, GPT-4o, GPT-5 mini — use for most work
- **Tier 1:** Claude Haiku 4.5 — use for quick edits
- **Tier 2:** Claude Sonnet 4 — use for complex debugging (justify in PR)
- **Tier 3:** Avoid unless lead approves

---

## Environment & Setup Questions

### How do I reset my environment?
1. Review the [PRE_WEEK_CHECKLIST.md](PRE_WEEK_CHECKLIST.md) for setup steps
2. Delete `node_modules/` and run `npm install` (frontend)
3. Run `./mvnw clean` (backend)
4. Check Docker is running (if using Testcontainers)
5. If issues persist, contact the team lead

### What if my tests fail?
1. Read the error message carefully
2. Check for missing dependencies
3. Ensure Docker is running (for Testcontainers)
4. Verify database configuration
5. Consult the [Lab Rubrics](LAB_RUBRICS.md) for expected behavior
6. Ask for help if blocked for more than 15 minutes

### What versions should I use?
Check [STACK_CONFIRMATION_TEMPLATE.md](STACK_CONFIRMATION_TEMPLATE.md) for confirmed versions:
- **Java:** 17 or 21
- **Node.js:** 20+
- **Spring Boot:** 3.x
- **React Router:** v7

### What if Docker isn't available?
For Oracle/database tests:
- Use H2 for unit tests
- Use a shared dev Oracle for integration tests
- Document which approach you used in your test classes

---

## PR & Submission Questions

### What should my PR include?
Every PR must include:
- [ ] Files in `/working/{frontend|backend}/{name}_{timestamp}/`
- [ ] README.md with name, date, lab number
- [ ] PLAN.md (for Labs 1+)
- [ ] Verification commands run (build, test, lint)
- [ ] "Copilot vs human" notes
- [ ] All tests passing

### What are "Copilot vs human" notes?
Document what the AI generated vs what you had to fix. Example:
```
## Copilot vs Human
- **Copilot generated:** Controller skeleton, test boilerplate, error handling
- **Human fixed:** Incorrect import path, wrong annotation, test assertion
- **Human wrote:** Custom validation logic, edge case tests
```

### How do I reference a lab in my PR?
In the PR template, under "Related Lab/Feature", write:
```
Lab 2 — Vertical Slice Scaffold (RRv7 + Spring Boot)
```

---

## Domain Context Questions

### What is the Order Management domain?
All labs use a simple business domain:
- **Orders:** id, customer, items, status
- **Customers:** id, name, email
- **Items:** id, name, price

See [DOMAIN_CONTEXT.md](../../shared/reference-materials/DOMAIN_CONTEXT.md) for full details and sample data.

### Why do we use a domain context?
- Makes labs realistic instead of abstract
- Provides consistent sample data
- Helps Copilot generate domain-appropriate code
- Mirrors real project work

---

## Getting Help

### Where do I ask questions?
1. Check this FAQ first
2. Review the relevant documentation
3. Use the designated Slack/Teams channel
4. Contact the team lead directly

### How long should I struggle before asking for help?
- **15 minutes** for environment/setup issues
- **20 minutes** for understanding a concept
- **30 minutes** for a technical blocker

Don't waste time being stuck—asking for help is part of the process.

### What if I'm behind on labs?
1. Focus on completing Labs 0–3 first (core skills)
2. Talk to your lead about prioritization
3. Don't skip the plan step (P0) to save time—it often costs more time later
