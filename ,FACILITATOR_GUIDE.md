# Facilitator Guide — AI-Assisted Development Bootcamp

**For:** Dev Team Leads facilitating the bootcamp for their teams  
**Version:** 1.1  
**Last Updated:** January 20, 2026

---

## Document Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-01-20 | Expanded Week 1 with detailed lab-by-lab facilitation instructions |
| 1.0 | 2026-01-20 | Initial comprehensive facilitator guide |

---

## About This Guide

You are about to facilitate your team through a 12-week journey into AI-assisted development. **You are not expected to be an AI expert.** You will learn alongside your team by observing their execution, guiding discussions, and capturing insights.

This guide provides:
- Pre and post instructions for every activity
- What to expect as a team lead new to AI
- Signs of healthy vs concerning adoption patterns
- Templates to capture team insights
- Tie-backs and tie-forwards to connect learning

> 💡 **Your Role:** Guide the discovery, don't provide the answers. Your value is in facilitation, observation, and coaching—not AI expertise.

---

## Table of Contents

1. [Before You Begin](#1-before-you-begin)
2. [What to Expect as a Team Lead (New to AI)](#2-what-to-expect-as-a-team-lead-new-to-ai)
3. [Week-by-Week Facilitation](#3-week-by-week-facilitation)
4. [Lab Facilitation Template](#4-lab-facilitation-template)
5. [Workshop Facilitation Template](#5-workshop-facilitation-template)
6. [Sprint Facilitation](#6-sprint-facilitation)
7. [Signs to Watch For](#7-signs-to-watch-for)
8. [Insight Capture Templates](#8-insight-capture-templates)
9. [Common Struggles & Interventions](#9-common-struggles--interventions)
10. [Your Learning Journey](#10-your-learning-journey)

---

## 1. Before You Begin

### 1.1 Pre-Bootcamp Checklist (1 Week Before)

| Task | Owner | Status |
|------|-------|--------|
| Confirm all team members have GitHub Copilot Enterprise access | You | ☐ |
| Verify team has completed [.REQUIREMENTS.md](.REQUIREMENTS.md) prerequisites | Team | ☐ |
| Review [.MASTER_BOOTCAMP.md](.MASTER_BOOTCAMP.md) for program overview | You | ☐ |
| Skim Week 1 content (don't study—you'll learn by observing) | You | ☐ |
| Schedule recurring team sessions for labs and workshops | You | ☐ |
| Set up a shared channel for async questions | You | ☐ |
| Prepare your Insight Capture document (Section 8) | You | ☐ |
| Read Section 2 of this guide thoroughly | You | ☐ |

### 1.2 Mindset Preparation

**Old mindset (drop this):**
- "I need to know all the answers before the team asks"
- "I should be the AI expert since I'm leading"
- "If I don't understand something, I've failed"

**New mindset (embrace this):**
- "I guide the discovery process, not the content"
- "I learn by watching my team's experiments"
- "My observations about team dynamics are invaluable"
- "Questions I can't answer become team investigations"

---

## 2. What to Expect as a Team Lead (New to AI)

### 2.1 The Emotional Journey

| Phase | What You'll Feel | What's Actually Happening |
|-------|------------------|---------------------------|
| **Week 1** | Overwhelmed, imposter syndrome | Normal—everyone is learning |
| **Week 2** | Cautious optimism | Patterns start emerging |
| **Week 3-4** | Growing confidence | You see the system working |
| **Sprints** | Pride in team growth | Your facilitation made this possible |

### 2.2 Velocity Changes to Expect

```
Week 1-2:  ████░░░░░░  Slower (learning curve)
Week 3-4:  ██████░░░░  Recovering (habits forming)
Sprint 1:  ████████░░  Accelerating (confidence)
Sprint 4:  ██████████  Full velocity (AI-augmented)
```

**What causes the initial slowdown:**
- Learning to write effective prompts
- Building trust (and healthy skepticism) in AI output
- Establishing new review patterns
- Forming team conventions

**Your job:** Protect the team from pressure during the slowdown. This investment pays off.

### 2.3 Quality Patterns Evolution

| Stage | Behavior | Your Response |
|-------|----------|---------------|
| **Over-reliance** | Team accepts AI output without question | Probe: "How did you verify this?" |
| **Rejection** | Team dismisses AI as useless | Explore: "What specifically didn't work?" |
| **Skepticism** | Team questions everything (healthy!) | Encourage: "Good instinct—document what you caught" |
| **Balance** | Team uses AI as a tool, not oracle | Celebrate: "This is the target state" |

### 2.4 Team Dynamics to Anticipate

| Persona | Behavior | How to Help |
|---------|----------|-------------|
| **The Enthusiast** | Adopts immediately, may over-rely | Channel energy into verification practices |
| **The Skeptic** | Resists, finds flaws | Make them the quality champion |
| **The Silent One** | Doesn't engage visibly | Check in privately, they may be processing |
| **The Perfectionist** | Spends too long on prompts | Set timeboxes, "good enough" is fine |
| **The Rusher** | Uses AI to skip thinking | Slow down with "explain your approach" |

### 2.5 Your Own Learning Curve

As you facilitate, you will learn:
- Which prompts work for your domain
- Your team's specific strengths and gaps
- Patterns that emerge across developers
- What the rubrics really mean in practice

**Capture these learnings.** They're valuable for your organization's AI journey.

---

## 3. Week-by-Week Facilitation

---

### Week 1: AI Enablement Foundations (DETAILED)

**🔙 Tie-Back:** None (this is the beginning of the AI journey)

**🔜 Tie-Forward:** "The habits you build this week—plan first, small diffs, verify everything—are the foundation for everything that follows. In Week 4, you'll use these same patterns to generate contracts. In the sprints, these habits become second nature."

**Week 1 Objective:** Move the team from "AI curiosity" to "safe, consistent team practice"

---

#### Day 0: Lead Preparation (60-90 minutes before Week 1)

**This is YOUR prep day. Complete before the team starts.**

| Task | Time | Details |
|------|------|---------|
| Create training branch | 15 min | Isolate Week 1 work from main codebase |
| Add repo rails | 20 min | `.github/copilot-instructions.md`, path instructions, PR template |
| Verify example folders | 10 min | Check `/working/frontend/example_lab*/` and `/working/backend/example_lab*/` exist |
| Create lab issues | 20 min | Create GitHub issues for Labs 0-6, assign to team members |
| Confirm prerequisites | 15 min | Verify team completed [PRE_WEEK_CHECKLIST.md](docs/content/week-01/PRE_WEEK_CHECKLIST.md) |
| Prepare Lab 1 tasks | 10 min | Have 3-5 simple improvement requests ready for Lab 1 |

**Your Mindset Going In:**
- You don't need to know all the answers
- Your job is to guide the process, not be the AI expert
- You'll learn the most by watching your team experiment
- Take notes on what surprises you

---

#### Day 1: Kickoff + Safety + Workflow Discipline

**Training:** 75-90 minutes | **Labs:** 30-60 minutes

---

##### Session 1: Copilot Reality (30 minutes)

**Pre-Session Checklist:**
- [ ] Screen sharing ready for demo
- [ ] Simple code change prepared for live demo
- [ ] IDE with Copilot enabled and tested

**Key Messages to Deliver:**
1. "Copilot drafts; humans approve"
2. "Plan → Implement → Verify is mandatory"
3. "We ship small diffs"

**Live Demo Script (10 minutes):**
```
1. Open a simple file
2. Open Copilot Chat
3. Use P0 prompt: "Plan only. Do not generate code. 
   Suggest a small improvement to this file."
4. Review the plan WITH the team
5. Ask: "Is this plan complete? What's missing?"
6. Only then implement ONE step
7. Run tests
8. Show the small diff
```

**Discussion Questions:**
- "What did you notice about how I interacted with Copilot?"
- "Why did I ask for a plan before coding?"
- "What would have happened if I just said 'make it better'?"

**Signs of Understanding:**
- ✅ Team asks clarifying questions
- ✅ Someone mentions "what if the plan is wrong?"
- ⚠️ Team seems ready to skip planning
- ⚠️ "Can't we just let it code?"

---

##### Session 2: Safe Prompting (20 minutes)

**Pre-Session Checklist:**
- [ ] 5 "unsafe prompt" examples ready (see below)
- [ ] Whiteboard/shared doc for rewriting exercise

**Unsafe Prompt Examples to Rewrite:**

| Unsafe Prompt | Why It's Unsafe |
|---------------|-----------------|
| "Here's our prod database connection string: jdbc:oracle:thin:@prod-db:1521/PRODDB, make it work" | Contains production connection details |
| "The API key is sk-abc123xyz, add it to the config" | Exposes real API key |
| "Use John Smith's SSN 123-45-6789 as test data" | Contains PII |
| "Here's the customer list from production (paste)" | Production data exposure |
| "The admin password is Admin123!, add it to the login" | Credentials in prompt |

**Exercise (10 minutes):**
1. Show each unsafe prompt
2. Team rewrites to safe version using placeholders
3. Discuss: "What placeholder would you use?"

**Safe Versions:**
- `"Use <DATABASE_URL> placeholder for the connection string"`
- `"Use <API_KEY> placeholder for the secret"`
- `"Use a sample SSN like 000-00-0000 for test data"`
- `"Create sample customer data, do not use real data"`
- `"Use <ADMIN_PASSWORD> placeholder for credentials"`

**The Mantra (repeat this often):**
> "No secrets, no production data. Use placeholders."

---

##### Session 3: Proof Culture (20 minutes)

**Key Standards to Establish:**

| Standard | What It Means | How to Verify |
|----------|---------------|---------------|
| Every PR lists commands run | No "I think I ran tests" | PR template requires commands |
| Tests are not optional | If it's not tested, it's not done | Rubric requires tests |
| Build passing is minimum bar | Red builds block merges | CI/CD enforces this |

**Discussion:**
- "Who has merged code that later broke something?"
- "How would 'proof culture' have prevented that?"
- "What's the cost of NOT having tests?"

**Introduce the PR Checklist:**
Show the template at `.github/pull_request_template.md` and walk through each item.

---

##### Lab 0: Setup Verification + First PR

**Timebox:** 20-30 minutes

###### Pre-Lab Briefing (5 minutes)

**Materials Ready:**
- [ ] [LAB_0_SETUP.md](docs/content/week-01/micro-labs/LAB_0_SETUP.md) visible
- [ ] [LAB_RUBRICS.md](docs/content/week-01/LAB_RUBRICS.md) open for reference
- [ ] Example folder `/working/backend/example_lab0/` ready to show

**What to Say:**
> "This lab proves your environment works and you can submit a PR. It's intentionally simple—the goal is to establish the workflow, not impress anyone with the code."

**🔙 Tie-Back:** "This is our starting point—no prior AI skills assumed."

**Watch For:**
- [ ] Team members who can't get Copilot to respond
- [ ] Anyone skipping the PR template
- [ ] Confusion about working folder structure

###### During Lab (20-30 minutes)

| Time | Your Action |
|------|-------------|
| 0:00 | "Start your timer. You have 25 minutes." |
| 0:10 | Walk around (or check chat). "Any environment issues?" |
| 0:15 | "10 minutes remaining. If stuck, ask a neighbor." |
| 0:20 | "5 minutes. Wrap up and open your PR." |
| 0:25 | "Time. Let's debrief." |

**Common Blockers (have solutions ready):**

| Blocker | Solution |
|---------|----------|
| Copilot not responding | Check license, restart IDE, verify network |
| Can't find training branch | Provide exact git commands |
| Build fails | Pair with someone whose build works |
| Unsure what tiny change to make | Suggest: "Update README with your name" |

###### Post-Lab Debrief (10 minutes)

**Discussion Questions:**
1. "How many got a PR open?" (Show of hands—should be everyone)
2. "What was the hardest part of setup?"
3. "Did anyone's Copilot suggest something unexpected?"

**🔜 Tie-Forward:**
> "You just proved you can use Copilot and submit a PR. In Lab 1, we'll add discipline: you won't be allowed to code until your plan is approved."

**Note for Your Insight Capture:**
- Who finished early? (Potential helpers for struggling team members)
- Who struggled? (Watch them closely in Lab 1)
- Any environment issues that need escalation?

---

##### Lab 1: Plan Only

**Timebox:** 20-30 minutes

###### Pre-Lab Briefing (5 minutes)

**Materials Ready:**
- [ ] [LAB_1_PLAN_ONLY.md](docs/content/week-01/micro-labs/LAB_1_PLAN_ONLY.md) visible
- [ ] Simple improvement requests prepared (see below)
- [ ] [PROMPT_PACK_V1.md](docs/shared/reference-materials/PROMPT_PACK_V1.md) open to P0

**Improvement Request Examples (assign one per person):**

| # | Task | Complexity |
|---|------|------------|
| 1 | Add a utility method to format currency | Easy |
| 2 | Add input validation to an existing method | Easy |
| 3 | Create a helper for date formatting | Easy |
| 4 | Add a constant for a magic number in code | Easy |
| 5 | Improve error message in an existing handler | Easy |

**What to Say:**
> "The ONLY output of this lab is a plan. You are NOT allowed to write any code until the plan is reviewed and approved. This feels slow, but it's the habit that will save you from bad AI suggestions."

**🔙 Tie-Back:**
> "In Lab 0, you proved your setup works. Now we add discipline—plan before code."

**Watch For:**
- [ ] Anyone who starts coding immediately (STOP THEM)
- [ ] Plans that don't include file paths
- [ ] Plans missing test steps

###### During Lab (20-30 minutes)

| Time | Your Action |
|------|-------------|
| 0:00 | Assign improvement requests. "Start with P0 prompt only." |
| 0:05 | Walk around. If anyone is coding: "Show me your approved plan first." |
| 0:10 | Review 2-3 plans publicly. "What's missing from this plan?" |
| 0:15 | "If your plan is approved, you may implement. Small diff only." |
| 0:25 | "Time. Let's debrief." |

**Plan Quality Checklist (use for reviews):**

| Element | Present? |
|---------|----------|
| Files to be changed | ☐ |
| Steps (numbered) | ☐ |
| Risks identified | ☐ |
| Tests to add/run | ☐ |
| References repo patterns | ☐ |

**Red Flags in Plans:**
- ❌ "Refactor entire module" (too big)
- ❌ No mention of tests (missing proof)
- ❌ Invented patterns not in repo (drift risk)
- ❌ "Step 1: Implement feature" (not a plan)

###### Post-Lab Debrief (10 minutes)

**Discussion Questions:**
1. "Did the plan help you stay focused?"
2. "What did Copilot miss in the initial plan?"
3. "How did you refine the plan?"

**Share a Good Plan vs Bad Plan:**
Show the team an example of a good plan (specific, testable, small scope) versus a bad plan (vague, no tests, scope creep).

**🔜 Tie-Forward:**
> "You've learned to get a plan first. Tomorrow in Lab 2, you'll use this skill to scaffold a complete vertical slice—but you'll break it into 2-3 small steps, each planned."

---

#### Day 2: Stack Confirmation + Scaffolding Patterns

**Training:** 45-60 minutes | **Labs:** 60-90 minutes

---

##### Session 1: Prompt Frame (25 minutes)

**Pre-Session Checklist:**
- [ ] [PROMPT_PACK_V1.md](docs/shared/reference-materials/PROMPT_PACK_V1.md) visible
- [ ] Example of good prompt vs bad prompt ready

**The Prompt Frame (write on whiteboard):**
```
Every prompt should include:
1. Context (paths, domain)
2. Goal (what you want)
3. Constraints (rules, limits)
4. Acceptance criteria (how you'll know it's done)
5. Verification (how to test)
6. Output location (where it goes)
```

**Exercise: Bad Prompt → Good Prompt**

Bad Prompt:
> "Add an orders endpoint"

Good Prompt:
> "Context: Spring Boot service in src/main/java/com/example/orders
> Goal: Add GET /api/orders endpoint returning list of orders
> Constraints: Follow existing controller patterns, use OrderService
> AC: Returns JSON array of orders, handles empty list, returns 500 on error
> Verification: Add unit test, run ./mvnw test
> Output: OrderController.java in controllers package"

**Discussion:** "Why is the second prompt better? What would Copilot do with the first one?"

---

##### Session 2: Team Patterns (20 minutes)

**Pre-Session Checklist:**
- [ ] [DOMAIN_CONTEXT.md](docs/shared/reference-materials/DOMAIN_CONTEXT.md) visible
- [ ] Team's actual repo patterns identified

**Patterns to Establish:**

| Area | Pattern | Why It Matters |
|------|---------|----------------|
| **FE Routes** | `src/routes/` folder | Copilot needs consistent paths |
| **FE State** | loader/action pattern | Avoid mixing data fetching patterns |
| **FE Errors** | Problem Details format | Consistent error handling |
| **BE Layers** | controller → service → repository | Separation of concerns |
| **BE Errors** | Problem Details (RFC 7807) | Industry standard |
| **Domain** | Order Management entities | Shared language |

**Team Exercise (10 minutes):**
Using [STACK_CONFIRMATION_TEMPLATE.md](docs/content/week-01/STACK_CONFIRMATION_TEMPLATE.md), have team answer:
- Java version? Spring Boot version?
- Node version? Package manager?
- Test frameworks (FE and BE)?
- Oracle strategy for local tests?

---

##### Lab 2: Vertical Slice Scaffold

**Timebox:** 60-90 minutes

###### Pre-Lab Briefing (10 minutes)

**Materials Ready:**
- [ ] [LAB_2_SCAFFOLD_VERTICAL_SLICE.md](docs/content/week-01/micro-labs/LAB_2_SCAFFOLD_VERTICAL_SLICE.md) visible
- [ ] [DOMAIN_CONTEXT.md](docs/shared/reference-materials/DOMAIN_CONTEXT.md) open
- [ ] Example folder `/working/backend/example_lab2/` ready

**What to Say:**
> "This is the first 'real' lab. You'll build a working endpoint with tests. BUT—you must break it into 2-3 steps and get a plan for each step. No big bang commits."

**🔙 Tie-Back:**
> "You learned to plan in Lab 1. Now you'll apply that skill repeatedly—plan step 1, implement step 1, verify. Then plan step 2."

**Deliverables Reminder:**

| Backend | Frontend |
|---------|----------|
| GET /api/ping → { "status": "ok" } | Route /ping with loading/success/error |
| Global exception handler (Problem Details) | Consumes /api/ping |
| One unit test | One component test |
| (Stretch) GET /api/orders | (Stretch) /orders route |

**Watch For:**
- [ ] Big bang commits (all code at once)
- [ ] Skipping the plan step
- [ ] No tests included
- [ ] Hardcoded values instead of patterns

###### During Lab (60-90 minutes)

| Time | Your Action |
|------|-------------|
| 0:00 | "Break this into steps. Plan step 1 before coding." |
| 0:15 | Check progress. "Show me your step 1 plan." |
| 0:30 | "Who has step 1 done and tested? Share what worked." |
| 0:45 | "If you're on step 2, keep going. If stuck, pair up." |
| 0:60 | "15 minutes for cleanup and PR." |
| 0:75 | "Time. Open your PR now." |

**Intervention Triggers:**

| Symptom | Intervention |
|---------|--------------|
| 30+ minutes with no commit | "Show me what you have. Let's break it smaller." |
| Tests not written yet | "Before your next commit, write one test." |
| Copied large code block | "Walk me through what each line does." |
| Not using Problem Details | "Check the example_lab2 folder for the pattern." |

###### Post-Lab Debrief (15 minutes)

**Discussion Questions:**
1. "How did breaking into steps help?"
2. "What did Copilot scaffold well?"
3. "What did you have to fix?"
4. "Show us your 'Copilot vs human' notes."

**Share One Good Example:**
Pick a team member who followed the process well. Have them walk through their commits.

**🔜 Tie-Forward:**
> "You can now scaffold code. Tomorrow, we flip it—you'll write tests FIRST, then make them pass. This is where quality really gets baked in."

---

#### Day 3: Tests-First Development

**Training:** 30 minutes | **Labs:** 60-120 minutes

---

##### Session: Tests from Acceptance Criteria (30 minutes)

**Pre-Session Checklist:**
- [ ] Sample acceptance criteria ready
- [ ] [PROMPT_PACK_V1.md](docs/shared/reference-materials/PROMPT_PACK_V1.md) open to P2

**Key Message:**
> "Copilot writes decent tests ONLY if you give it crisp acceptance criteria. Vague criteria = useless tests."

**Acceptance Criteria Format:**
```
Given [context]
When [action]
Then [expected result]
```

**Example Transformation:**

Vague Requirement:
> "Orders should work properly"

Crisp Acceptance Criteria:
> - Given an order ID exists, when I call GET /api/orders/{id}, then return the order with customer name and item list
> - Given an order ID does not exist, when I call GET /api/orders/{id}, then return 404 with Problem Details
> - Given an order with items, when I retrieve it, then the total equals sum of item prices

**Exercise: Write AC for "Order Status Update"**
Team practice: Convert "users should be able to update order status" into 3-5 acceptance criteria.

---

##### Lab 3: Tests First

**Timebox:** 60-90 minutes

###### Pre-Lab Briefing (10 minutes)

**Materials Ready:**
- [ ] [LAB_3_TESTS_FIRST.md](docs/content/week-01/micro-labs/LAB_3_TESTS_FIRST.md) visible
- [ ] 3-6 acceptance criteria bullets (provide these OR use samples from lab)
- [ ] Example folder `/working/backend/example_lab3/` ready

**Acceptance Criteria to Provide (if team lead doesn't have custom ones):**
1. Given an order ID, return the order with customer name and item list
2. Return 404 with Problem Details if order not found
3. Order total should be calculated from item prices
4. Orders can be filtered by status (pending, completed, cancelled)

**What to Say:**
> "You will write tests FIRST. The tests will fail. Then you write the minimum code to make them pass. This is TDD with AI assistance—Copilot helps you write tests, but YOU verify they're correct."

**🔙 Tie-Back:**
> "In Lab 2, you scaffolded code and added tests after. This time, tests come FIRST. The plan-first discipline applies here too—plan your tests before writing them."

**Critical Rule:**
> "If a test passes before you write any implementation, something is wrong. Either the test is bad, or there's leftover code."

###### During Lab (60-90 minutes)

| Time | Your Action |
|------|-------------|
| 0:00 | Distribute acceptance criteria. "Use P2 prompt for tests." |
| 0:15 | "Who has tests written? Do they fail? (They should!)" |
| 0:30 | "Now implement just enough to make ONE test pass." |
| 0:45 | "Check: Are you writing more code than needed?" |
| 0:60 | "Final push. All tests should pass now." |
| 0:75 | "PR time. Include test count and what Copilot got wrong." |

**Common Test Problems:**

| Problem | What to Say |
|---------|-------------|
| Tests pass before implementation | "That test doesn't actually test anything. What's the assertion?" |
| Too many tests at once | "Just write tests for ONE acceptance criterion first." |
| Tests don't match AC | "Read the AC again. Does your test verify exactly that?" |
| Copilot generates implementation | "Delete that. We're in tests-only mode right now." |

###### Post-Lab Debrief (15 minutes)

**Discussion Questions:**
1. "Did writing tests first change how you thought about the code?"
2. "What did Copilot get wrong in the tests?"
3. "How much time fixing tests vs writing implementation?"

**Key Insight to Reinforce:**
> "The time you spend writing good tests now saves 10x debugging time later. Tests are not overhead—they're proof."

**🔜 Tie-Forward:**
> "You now have code WITH tests. Tomorrow, we refactor that code—but safely, with guardrails. The tests you wrote today will catch any regression."

---

#### Day 4: OpenShift Readiness + Guarded Refactor

**Training:** 20 minutes | **Labs:** 90-120 minutes

---

##### Session: Guarded Refactoring (20 minutes)

**Key Concepts:**

| Concept | Meaning |
|---------|---------|
| No behavior change | Same inputs → same outputs |
| Scope control | Only touch specified files |
| Tests verify | All existing tests must pass |
| Small diffs | One refactor at a time |

**What's Allowed vs Not Allowed:**

| ✅ Allowed | ❌ Not Allowed |
|------------|----------------|
| Rename variables | Change API signatures |
| Extract methods | Add new features |
| Remove duplication | Modify return types |
| Improve error messages | Change business logic |
| Add constants | Touch unrelated files |

**Warning:**
> "The most dangerous phrase in refactoring is 'while I'm in here...' If you see something else to fix, note it and create a separate PR."

---

##### Lab 4: Guarded Refactor

**Timebox:** 45-60 minutes

###### Pre-Lab Briefing (5 minutes)

**Materials Ready:**
- [ ] [LAB_4_REFACTOR_GUARDED.md](docs/content/week-01/micro-labs/LAB_4_REFACTOR_GUARDED.md) visible
- [ ] Identify refactor targets from team's Lab 2/3 code
- [ ] [PROMPT_PACK_V1.md](docs/shared/reference-materials/PROMPT_PACK_V1.md) open to P4

**Refactor Target Examples:**
- Magic numbers → constants
- Duplicated code → extracted method
- Long method → split into smaller methods
- Poor variable names → meaningful names

**What to Say:**
> "Pick ONE small thing to refactor. Get a plan with RISKS identified. If Copilot suggests anything outside your target files, reject it."

**🔙 Tie-Back:**
> "The tests you wrote yesterday are your safety net. If you break something, the tests will catch it."

###### During Lab (45-60 minutes)

| Time | Your Action |
|------|-------------|
| 0:00 | Each person identifies their refactor target. |
| 0:10 | Review 2-3 refactor plans. "What are the risks?" |
| 0:25 | "Run tests. They should all pass. If not, you changed behavior." |
| 0:40 | "PR time. Show the before/after diff." |

**Scope Creep Check:**
At 0:25, ask: "Did you touch any file that wasn't in your original plan?" If yes, discuss whether that was appropriate.

###### Post-Lab Debrief (10 minutes)

**🔜 Tie-Forward:**
> "You just proved you can change code safely. In Lab 5, we prepare for production—health probes, config, deployment manifests."

---

##### Lab 5: OpenShift Readiness

**Timebox:** 45-60 minutes

###### Pre-Lab Briefing (5 minutes)

**Materials Ready:**
- [ ] [LAB_5_OPENSHIFT_READINESS.md](docs/content/week-01/micro-labs/LAB_5_OPENSHIFT_READINESS.md) visible
- [ ] Example K8s manifests or Helm charts from your org
- [ ] Example folder `/working/backend/example_lab5/` ready

**What to Say:**
> "This lab makes your service deployable. Health probes, externalized config, deployment manifests. This is what separates 'it works on my machine' from 'it runs in production.'"

**🔙 Tie-Back:**
> "You've built the feature (Labs 2-3) and refactored it safely (Lab 4). Now we package it for deployment."

**Deliverables:**

| Backend | Frontend |
|---------|----------|
| Spring Actuator health endpoints | Environment-based API URL |
| Liveness/readiness probes | Production build verification |
| External config (env vars) | Static file serving config |
| K8s manifests (deployment, service, configmap) | (Optional) nginx config |

###### During Lab (45-60 minutes)

| Time | Your Action |
|------|-------------|
| 0:00 | "Start with health endpoints. Verify with curl." |
| 0:20 | "Now externalize config. No hardcoded values." |
| 0:35 | "Create manifests. Validate with kubectl --dry-run." |
| 0:50 | "PR time. Include deployment instructions in README." |

###### Post-Lab Debrief (10 minutes)

**🔜 Tie-Forward:**
> "Tomorrow is the capstone—you'll build a complete feature end-to-end using everything you've learned this week."

---

#### Day 5: Capstone + Standardization

**Labs:** 60-90 minutes | **Retrospective:** 30 minutes

---

##### Lab 6: Capstone Mini-Feature

**Timebox:** 60-90 minutes

###### Pre-Lab Briefing (10 minutes)

**Materials Ready:**
- [ ] [LAB_6_CAPSTONE_MINI_FEATURE.md](docs/content/week-01/micro-labs/LAB_6_CAPSTONE_MINI_FEATURE.md) visible
- [ ] [DOMAIN_CONTEXT.md](docs/shared/reference-materials/DOMAIN_CONTEXT.md) open
- [ ] Feature options ready (or let team choose)

**Feature Options:**
| Feature | BE | FE |
|---------|----|----|
| Create Order | POST /api/orders with validation | Form to submit order |
| Order Details | GET /api/orders/:id with calculated total | Detail page |
| Order Status Update | PATCH /api/orders/:id/status | Status dropdown |
| Order List Filter | GET /api/orders?status=pending | Filtered list view |

**What to Say:**
> "This is the culmination of Week 1. You'll deliver a complete feature—backend endpoint with real logic, frontend that consumes it, tests on both sides. Use EVERYTHING you've learned: plan first, small diffs, tests, proof."

**🔙 Tie-Back:**
> "Lab 0 proved your setup. Lab 1 taught planning. Lab 2 scaffolding. Lab 3 tests-first. Lab 4 safe refactoring. Lab 5 deployment readiness. Now you combine ALL of it."

**Pair Programming Option:**
If team wants to pair:
- Driver (types, prompts Copilot)
- Navigator (reviews, thinks ahead)
- Switch every 20-25 minutes
- Both names in README

###### During Lab (60-90 minutes)

| Time | Your Action |
|------|-------------|
| 0:00 | Teams/individuals choose feature. "Plan first!" |
| 0:15 | Check plans. "Is it scoped small enough?" |
| 0:30 | "BE folks: endpoint working? FE folks: route rendering?" |
| 0:45 | "Integration point. Can FE call BE?" |
| 0:60 | "Tests on both sides. Run full suite." |
| 0:75 | "PR with reflection questions answered." |

**Integration Checkpoint (0:45):**
This is the moment where FE and BE connect. Watch for:
- CORS issues
- Contract mismatches
- Different assumptions about data format

If pairs are stuck on integration, help them debug together—this is a valuable teaching moment.

###### Post-Lab Debrief (15 minutes)

**Reflection Questions (require answers in README):**

**Effectiveness:**
1. What did Copilot do well?
2. What did you have to fix or reject?
3. What would you prompt differently next time?

**Process:**
4. Did plan-first help with the larger feature?
5. How did tests-first contribute to quality?
6. What repo pattern should we add?

**Quantitative:**
- Lines generated by Copilot: ___
- Lines written/fixed by human: ___
- Suggestions rejected: ___
- Time prompting vs coding: ___

**🔜 Tie-Forward:**
> "In Week 2, you'll learn to feed Copilot even better context—constraints and requirements. The habits you built this week will accelerate everything that follows."

---

##### Week 1 Standardization Retrospective (30 minutes)

**Agenda:**

| Time | Activity |
|------|----------|
| 0:00 | Celebrate completions! Who finished all 7 labs? |
| 0:05 | Collect best prompts from the week (add to team library) |
| 0:15 | Discuss: What patterns should we add to repo instructions? |
| 0:25 | Discuss: What failure modes did we observe? How to prevent? |
| 0:30 | Close: Preview Week 2 |

**Prompt Collection Template:**
```markdown
## Prompt: [Name]
**When to use:** [Situation]
**Template:**
[The actual prompt]
**Why it works:** [Explanation]
**Submitted by:** [Name]
```

---

#### Week 1 Gate Criteria

Before moving to Week 2, each team member must have:

- [ ] Lab 0: Setup verified, first PR submitted
- [ ] Lab 1: Plan-first discipline demonstrated
- [ ] Lab 2: Vertical slice scaffolded with tests
- [ ] Lab 3: Tests-first workflow completed
- [ ] Lab 4: Guarded refactor completed
- [ ] Lab 5: OpenShift readiness verified
- [ ] Lab 6: Capstone feature delivered end-to-end
- [ ] All PRs in `/working/` folders with proper structure
- [ ] All PRs include verification commands
- [ ] Lab 6 reflection completed

**If Someone Doesn't Pass:**
- Identify specific gaps
- Provide targeted support
- Allow one more attempt on failed labs
- Do not move forward until gate is passed

---

#### Week 1 Facilitator Checklist

End of each day, check:

| Day | Checklist |
|-----|-----------|
| Day 1 | ☐ All environments working ☐ Everyone opened first PR ☐ Plan-first understood |
| Day 2 | ☐ Stack confirmed ☐ Vertical slices submitted ☐ Patterns established |
| Day 3 | ☐ Tests-first discipline shown ☐ Everyone wrote tests before code |
| Day 4 | ☐ Safe refactoring demonstrated ☐ Deployment readiness verified |
| Day 5 | ☐ Capstones delivered ☐ Retrospective completed ☐ Prompts collected |

End of week, complete:
- [ ] Week 1 Insight Capture (Section 8)
- [ ] Note team members who struggled and plan support
- [ ] Identify patterns to reinforce in Week 2
- [ ] Update team prompt library with discoveries
- [ ] Celebrate the team's progress!

---

### Week 2: Constraints & Requirements

**🔙 Tie-Back:** "Last week you learned to get plans from AI before coding. This week, you'll learn to feed AI better context—constraints and requirements—so those plans are more accurate."

**🔜 Tie-Forward:** "The constraints you extract this week become inputs to the architecture decisions in Week 3."

#### Pre-Week Setup
- [ ] Review [WEEK_2_PROGRAM.md](docs/content/week-02/WEEK_2_PROGRAM.md)
- [ ] Prepare stakeholder scenarios for constraint extraction
- [ ] Have sample user journeys ready if team gets stuck

#### Key Facilitation Moments
| Lab | Watch For | Intervention If Needed |
|-----|-----------|------------------------|
| Lab 2-0: Constraint Extraction | Over-constraining or under-constraining | "What would happen if we removed this constraint?" |
| Lab 2-1: Journey Mapping | Too technical, not user-focused | "Tell me this from the user's perspective" |
| Lab 2-2: AC Writing | Vague criteria | "How would you test this acceptance criterion?" |
| Lab 2-3: Constraint Review | Rubber-stamping | "Play devil's advocate on this constraint" |

#### Post-Week Reflection
- [ ] Complete Week 2 Insight Capture
- [ ] How well did team translate business needs to technical constraints?
- [ ] Who emerged as strong at requirements elicitation?

---

### Week 3: Architecture with AI

**🔙 Tie-Back:** "You've extracted constraints and requirements. Now you'll use AI to help make architecture decisions that honor those constraints."

**🔜 Tie-Forward:** "The ADRs you create this week are referenced in Week 4 contracts and throughout the sprints."

#### Pre-Week Setup
- [ ] Review [WEEK_3_PROGRAM.md](docs/content/week-03/WEEK_3_PROGRAM.md)
- [ ] Prepare architecture decision scenarios
- [ ] Have ADR template ready

#### Key Facilitation Moments
| Lab | Watch For | Intervention If Needed |
|-----|-----------|------------------------|
| Lab 3-0: ADR Drafting | AI generating options without team evaluation | "Which option would you choose and why?" |
| Lab 3-1: Constitution Section | Copying AI output verbatim | "Does this reflect your team's actual values?" |
| Lab 3-2: System Spec Persona | Generic descriptions | "What makes YOUR system unique?" |
| Lab 3-3: ADR Review | Not challenging decisions | "What's the strongest argument against this?" |

#### Post-Week Reflection
- [ ] Complete Week 3 Insight Capture
- [ ] How well does team justify decisions vs. accept AI suggestions?
- [ ] Are ADRs actually useful or just checkbox exercises?

---

### Week 4: Contracts & Integration

**🔙 Tie-Back:** "You have constraints (Week 2) and architecture decisions (Week 3). Now you'll define the contracts that make FE/BE integration work."

**🔜 Tie-Forward:** "These contracts are the foundation for Sprint 1. Every feature implementation will reference them."

#### Pre-Week Setup
- [ ] Review [WEEK_4_PROGRAM.md](docs/content/week-04/WEEK_4_PROGRAM.md)
- [ ] Prepare domain glossary inputs
- [ ] Have OpenAPI examples ready for reference

#### Key Facilitation Moments
| Lab | Watch For | Intervention If Needed |
|-----|-----------|------------------------|
| Lab 4-0: OpenAPI Endpoint | Inconsistent naming | "Does this match our domain glossary?" |
| Lab 4-1: Glossary Term | Ambiguous definitions | "Give me an example of this term in use" |
| Lab 4-2: MSW Handler | Hardcoded happy paths only | "What about error cases?" |
| Lab 4-3: Contract Validation | Missing error responses | "What happens when things go wrong?" |

#### Contract Lock Ceremony
- [ ] Schedule 2-hour session for end of week
- [ ] All team members review final contracts
- [ ] Document any "we'll figure it out later" items
- [ ] Celebrate the milestone!

#### Post-Week Reflection
- [ ] Complete Week 4 Insight Capture
- [ ] Is contract quality good enough for sprints?
- [ ] What misunderstandings surfaced during contract review?

---

### Sprints 1-4: Execution

**🔙 Tie-Back:** "For four weeks, you've been building skills and artifacts. Now you apply everything to build real features."

**🔜 Tie-Forward:** (Sprint-specific, see below)

#### Sprint Facilitation Pattern

**Before Each Sprint:**
- [ ] Review sprint packet in `docs/content/sprint-XX/`
- [ ] Understand the feature scope and NFRs
- [ ] Prepare for standup facilitation

**During Sprint:**
- [ ] Daily standups (15 min max)
- [ ] Monitor for AI over-reliance or rejection
- [ ] Enforce PR review standards
- [ ] Track progress toward gate criteria

**End of Sprint:**
- [ ] Demo facilitation
- [ ] Retrospective (use template in Section 8)
- [ ] Gate assessment
- [ ] Insight capture

#### Sprint-Specific Focus

| Sprint | Theme | Key Watch Points |
|--------|-------|------------------|
| **Sprint 1** | Core Features | First real integration—expect friction |
| **Sprint 2** | Feature Expansion | Performance NFRs introduced |
| **Sprint 3** | Security Hardening | OWASP compliance, may slow team down |
| **Sprint 4** | Production Readiness | Documentation, polish, deployment |

---

## 4. Lab Facilitation Template

Use this template for every lab:

### Pre-Lab (5-10 minutes before)

```markdown
## Lab X Pre-Brief

**Lab:** [Name]
**Timebox:** [XX minutes]
**Prompt(s) used:** [P0, P1, etc.]

### 🔙 Tie-Back
"In [previous activity], you learned [skill]. Today we build on that by..."

### Today's Goal
[One sentence: what must be true when done]

### Watch For
- [ ] [Specific behavior to observe]
- [ ] [Common mistake to catch]

### Materials Ready
- [ ] [Reference doc]
- [ ] [Example if stuck]
```

### During Lab

| Time | Action |
|------|--------|
| Start | Brief the team, set timer |
| 25% | Quick pulse check: "Any blockers?" |
| 50% | Observe silently, take notes |
| 75% | "10 minutes remaining" |
| End | Gather for debrief |

### Post-Lab Debrief (10-15 minutes)

```markdown
## Lab X Debrief

### 🔜 Tie-Forward
"What you just practiced will be critical in [future activity] because..."

### Discussion Questions
1. "What did Copilot get right? What did it miss?"
2. "How did you verify the AI output?"
3. "What would you do differently next time?"

### Observations (for your notes)
- Who struggled:
- Who excelled:
- Patterns noticed:
- Follow-up needed:
```

---

## 5. Workshop Facilitation Template

### Pre-Workshop (Day before)

```markdown
## Workshop Pre-Brief

**Workshop:** [Name]
**Duration:** [XX minutes]
**Materials:** [List]

### Preparation
- [ ] Room/virtual space booked
- [ ] Materials distributed
- [ ] Breakout groups assigned (if applicable)
- [ ] Timer ready

### 🔙 Tie-Back
"This workshop connects to [previous content] by..."

### Learning Objectives
1. [Objective 1]
2. [Objective 2]
3. [Objective 3]
```

### Workshop Agenda Template

| Time | Activity | Facilitator Notes |
|------|----------|-------------------|
| 0:00 | Opening + Tie-Back | Set context, energy |
| 0:10 | Concept Introduction | Keep brief, they learn by doing |
| 0:20 | Hands-On Activity | Observe, don't help too quickly |
| 0:45 | Share-Out | Each group presents |
| 0:55 | Synthesis + Tie-Forward | Connect to next steps |
| 1:00 | Close | Capture remaining questions |

### Post-Workshop

```markdown
## Workshop Debrief (Your Notes)

### What Worked
-

### What to Adjust Next Time
-

### Team Insights Captured
-

### Follow-Up Items
- [ ]
```

---

## 6. Sprint Facilitation

### Daily Standup (15 minutes max)

**Format:**
1. **Yesterday:** What did you complete?
2. **Today:** What will you work on?
3. **Blockers:** What's in your way?
4. **AI Insight (optional):** "One thing AI helped with or struggled with"

**Your Role:**
- Keep it moving (2 min per person max)
- Note blockers for follow-up
- Don't solve problems in standup—schedule follow-ups

### Sprint Demo Facilitation

**Before Demo:**
- [ ] Confirm working environment
- [ ] Prepare demo script with team
- [ ] Invite stakeholders

**During Demo:**
- Let developers present their own work
- Capture stakeholder feedback
- Note questions for backlog

**After Demo:**
- Thank the team publicly
- Document feedback
- Feed into retrospective

### Sprint Retrospective Template

**Duration:** 60 minutes

**Agenda:**

| Time | Activity |
|------|----------|
| 0:00 | Set the stage: "What happens here stays here" |
| 0:05 | What went well? (sticky notes, 5 min silent) |
| 0:10 | Group and discuss (10 min) |
| 0:20 | What didn't go well? (sticky notes, 5 min silent) |
| 0:25 | Group and discuss (10 min) |
| 0:35 | AI-Specific Questions (see below) |
| 0:45 | Action items (what will we change?) |
| 0:55 | Appreciations |
| 1:00 | Close |

**AI-Specific Retro Questions:**
1. "Where did AI save us the most time?"
2. "Where did AI lead us astray?"
3. "What prompts should we add to our team's library?"
4. "Are we verifying AI output enough? Too much?"
5. "How has our trust in AI changed this sprint?"

---

## 7. Signs to Watch For

### Healthy Patterns ✅

| Pattern | What It Looks Like |
|---------|-------------------|
| **Questioning AI output** | "That looks right, but let me verify..." |
| **Iterative prompting** | "Let me refine this prompt to get better results" |
| **Test-driven verification** | Writing tests to validate AI-generated code |
| **Balanced contribution** | AI helps, human decides |
| **Discussing limitations** | "AI doesn't understand our specific context here" |
| **Knowledge sharing** | "I found a prompt that works great for X" |
| **Plan-first discipline** | Always asking for a plan before implementation |

### Concerning Patterns ⚠️

| Pattern | What It Looks Like | Intervention |
|---------|-------------------|--------------|
| **Blind acceptance** | Copy-paste without reading | "Walk me through what this code does" |
| **One-and-done prompting** | Never refines prompts | "What if you gave it more context?" |
| **No verification** | Merging AI code without tests | "How do we know this works?" |
| **AI as oracle** | "Copilot said so" as justification | "Copilot doesn't know our business rules" |
| **Complete rejection** | "AI is useless, I'll do it myself" | "Show me what you tried—let's debug the prompt" |
| **Shortcut seeking** | Using AI to skip thinking | "Explain your approach before asking AI" |
| **Isolation** | Not sharing what works | "Let's share prompts that worked this week" |

### When to Escalate

Escalate to your manager or program lead if:
- Team consistently fails gates despite coaching
- Safety rules are being violated (secrets in prompts)
- Individual is actively sabotaging adoption
- Technical blockers you can't resolve

---

## 8. Insight Capture Templates

### Weekly Insight Capture

Complete this every Friday:

```markdown
# Week [X] Insight Capture

**Date:** [YYYY-MM-DD]
**Facilitator:** [Your Name]

## Team Pulse (1-5 scale)
- Confidence with AI: [ ]
- Code quality: [ ]
- Velocity: [ ]
- Collaboration: [ ]

## Observations

### What Surprised Me
-

### Strongest Team Member This Week
- Who:
- Why:

### Struggling Team Member This Week
- Who:
- Why:
- My plan to help:

### Prompts That Worked Well
1.
2.

### Prompts That Failed
1.
2.

### Questions I Couldn't Answer
1.
2.

### Patterns I'm Noticing
-

## Action Items for Next Week
- [ ]
- [ ]
```

### Sprint Insight Capture

Complete this at the end of each sprint:

```markdown
# Sprint [X] Insight Capture

**Date:** [YYYY-MM-DD]
**Facilitator:** [Your Name]

## Delivery
- Stories completed: [ ] / [ ]
- Gate passed: [Yes/No]
- Quality concerns:

## AI Adoption Maturity

### Current State (check one)
- [ ] Over-reliance (accepting too much)
- [ ] Rejection (using too little)
- [ ] Healthy skepticism (questioning appropriately)
- [ ] Balanced augmentation (target state)

### Evidence for Assessment
-

## Team Dynamics

### Collaboration Quality
-

### Who Emerged as Leaders
-

### Who Needs More Support
-

## Recommendations

### For This Team
1.
2.

### For the Program (share with other facilitators)
1.
2.

### For My Own Development
1.
2.
```

### End-of-Program Summary

Complete after Sprint 4:

```markdown
# Program Summary — [Team Name]

**Facilitator:** [Your Name]
**Date:** [YYYY-MM-DD]

## Overall Journey

### Starting Point (Week 1)
-

### Ending Point (Sprint 4)
-

### Biggest Transformation
-

## Team Assessment

| Member | Starting Skill | Ending Skill | Growth |
|--------|---------------|--------------|--------|
| | | | |

## What Worked Best
1.
2.
3.

## What We'd Do Differently
1.
2.
3.

## Recommendations for Future Cohorts
1.
2.
3.

## Artifacts Worth Sharing
- Prompts:
- Patterns:
- Anti-patterns:
```

---

## 9. Common Struggles & Interventions

### Technical Struggles

| Struggle | Signs | Intervention |
|----------|-------|--------------|
| **Copilot not responding** | Blank suggestions, errors | Check license, restart IDE, verify network |
| **Poor suggestions** | Irrelevant or wrong code | Review prompt quality, add context |
| **Can't run tests** | Build failures | Pair with team member, check environment |
| **Merge conflicts** | Git errors | Small commits, frequent pulls |

### Skill Struggles

| Struggle | Signs | Intervention |
|----------|-------|--------------|
| **Vague prompts** | "Make it work" style requests | Teach specificity: context, goal, constraints |
| **No verification** | Code goes straight to PR | Require test evidence in PRs |
| **Skipping plans** | Jump to implementation | Enforce P0 (plan only) strictly |
| **Scope creep** | "While I'm here..." changes | Redirect: "That's a separate PR" |

### Mindset Struggles

| Struggle | Signs | Intervention |
|----------|-------|--------------|
| **Fear of AI** | Avoidance, excuses | Private 1:1, explore concerns, small wins |
| **Over-confidence** | "AI does it all" | Introduce failure case, discuss limits |
| **Perfectionism** | Endless prompt refinement | Set timeboxes, "good enough" threshold |
| **Imposter syndrome** | "Everyone gets it but me" | Normalize the learning curve, share your own struggles |

### Team Struggles

| Struggle | Signs | Intervention |
|----------|-------|--------------|
| **Uneven adoption** | Some all-in, some resisting | Pair enthusiasts with skeptics |
| **Siloed learning** | No knowledge sharing | Weekly "prompt wins" share-out |
| **Blame AI** | "It's Copilot's fault" | Refocus on verification responsibility |
| **Skip collaboration** | Everyone works alone | Introduce pair programming sessions |

---

## 10. Your Learning Journey

### What You'll Learn by Facilitating

By the end of this bootcamp, you will have learned:

1. **How AI changes team dynamics** — What to expect, how to coach
2. **Effective prompting patterns** — By observing what works for your team
3. **Quality verification practices** — How to ensure AI output is safe
4. **Facilitation skills** — Running labs, workshops, retrospectives
5. **Your team's strengths and gaps** — Invaluable for ongoing coaching

### Reflection Prompts for Yourself

Weekly, ask yourself:
- "What surprised me about how the team used AI this week?"
- "Where did I want to jump in and 'fix' things? Did I resist?"
- "What did I learn by observing rather than doing?"
- "How has my own view of AI-assisted development changed?"

### Connecting with Other Facilitators

If multiple teams are going through the bootcamp:
- Schedule weekly facilitator syncs
- Share prompts that worked
- Discuss common struggles
- Build a facilitator community of practice

### After the Bootcamp

Your role doesn't end at Sprint 4:
- Continue weekly check-ins on AI adoption
- Maintain the prompt library
- Onboard new team members to AI practices
- Share learnings with other teams

---

## Quick Reference Card

### The 3 Non-Negotiables (Enforce Always)
1. **Plan first** — No code until plan approved (P0)
2. **Small diffs** — Keep changes reviewable
3. **Proof** — Tests must pass, verification required

### Key Prompts to Know
| Prompt | When | Purpose |
|--------|------|---------|
| P0 | Every task | Plan only, wait for approval |
| P2 | Lab 3+ | Tests from acceptance criteria |
| P4 | Lab 4+ | Guarded refactor with risks |
| P20 | Gates | Gate readiness assessment |

### Gate Criteria Summary
- **Week Gates:** Skills demonstrated, rubric passed
- **Sprint Gates:** Features complete, NFRs met, quality verified

### Emergency Contacts
- Technical issues: [Your IT/DevOps contact]
- Program questions: [Program lead]
- HR/People issues: [HR contact]

---

## Appendix: Resources

| Resource | Location |
|----------|----------|
| Master Index | [.MASTER_BOOTCAMP.md](.MASTER_BOOTCAMP.md) |
| Quick Start | [.START_HERE.md](.START_HERE.md) |
| Requirements | [.REQUIREMENTS.md](.REQUIREMENTS.md) |
| Domain Context | [docs/shared/reference-materials/DOMAIN_CONTEXT.md](docs/shared/reference-materials/DOMAIN_CONTEXT.md) |
| Prompt Pack | [docs/shared/reference-materials/PROMPT_PACK_V1.md](docs/shared/reference-materials/PROMPT_PACK_V1.md) |
| Definition of Done | [docs/shared/reference-materials/DEFINITION_OF_DONE.md](docs/shared/reference-materials/DEFINITION_OF_DONE.md) |
| Week 1 Program | [docs/content/week-01/WEEK_1_PROGRAM.md](docs/content/week-01/WEEK_1_PROGRAM.md) |
| Lab Rubrics | [docs/content/week-01/LAB_RUBRICS.md](docs/content/week-01/LAB_RUBRICS.md) |

---

*You've got this. Your team is lucky to have a lead willing to learn alongside them.*
