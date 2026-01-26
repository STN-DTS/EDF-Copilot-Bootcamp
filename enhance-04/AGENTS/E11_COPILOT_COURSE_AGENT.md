# E11_COPILOT_COURSE_AGENT — Student-Copilot Interaction

## Mission
Enable natural language course interaction via GitHub Copilot Chat. When students ask questions like "Start the bootcamp" or "Where did I leave off?", Copilot should understand and guide them appropriately.

**This is the highest-impact student-facing enhancement.**

---

## File ownership (absolute)

**Owned paths (create new):**
- `.github/instructions/student-navigation.instructions.md`
- `COPILOT_COURSE_COMMANDS.md` (repo root quick reference)

**Must update:**
- `.github/copilot-instructions.md` — ADD "Student Course Navigation" section

**Must NOT edit:**
- `progress/scripts/*` (E09/E10 own)
- `scripts/bootcamp.mjs` (E01 owns)
- Any `docs/**` files
- Lab content files

---

## Recon Gate (mandatory before edits)

Before making any changes, verify:

1. **`.github/copilot-instructions.md` exists** and read its current structure
2. **`.github/instructions/` folder exists** (may need to create)
3. **E09 has completed** (progress system should exist for integration)
4. **Read `bootcamp_scaffolds_weeks1-4_sprints1-4/scripts/bootcamp.mjs`** to understand runner commands

**Output your recon findings before proceeding.**

---

## Agent Health Check (run first)

```bash
# Copilot instructions exist
cat .github/copilot-instructions.md | head -20 && echo "✅ Copilot instructions OK"

# Instructions folder
ls .github/instructions/ 2>/dev/null && echo "✅ Instructions folder OK" || echo "⚠️ Will create instructions folder"

# Progress system ready (if E09 complete)
ls progress/scripts/*.mjs 2>/dev/null && echo "✅ Progress system OK" || echo "⚠️ E09 not complete yet"
```

---

## Tasks

### Task 1: Create `.github/instructions/student-navigation.instructions.md`

```markdown
# Student Navigation Instructions

These patterns guide Copilot when students ask about course navigation.

---

## Trigger Phrases → Actions

### Onboarding Triggers
- "start the bootcamp"
- "I'm new"
- "how do I begin"
- "first time here"
- "just joined"

**Action:** Run the Onboarding Flow (see below)

### Progress Triggers
- "where did I leave off"
- "what's next"
- "continue"
- "resume"
- "my progress"
- "show progress"

**Action:** Read student progress file and report current status

### Lab Start Triggers
- "start lab X"
- "begin lab X"
- "open lab X"
- "work on lab X"

**Action:** Run bootcamp runner, mark progress as in-progress

### Lab Complete Triggers
- "finished lab X"
- "completed lab X"
- "done with lab X"
- "PR is #X"

**Action:** Mark progress as complete, suggest next lab

### Help Triggers
- "I'm stuck"
- "need help"
- "getting an error"
- "blocked"

**Action:** Offer debugging guidance, check FAQ, offer to mark as blocked

---

## Onboarding Flow

When a student says they're new:

1. **Welcome message:**
   "Welcome to the EDF Copilot Bootcamp! 🎉 This course teaches AI-assisted development with GitHub Copilot."

2. **Track selection:**
   "Are you taking the **frontend track** (React/TypeScript) or **backend track** (Spring Boot/Java)?"

3. **After track response, guide setup:**
   ```
   Great! Let's get you set up:
   
   1. First, make sure dependencies are installed:
      npm install
   
   2. Initialize your progress file:
      npm run progress:init -- --name "Your Name" --github yourusername --cohort 2026-01 --track {their-track}
   
   3. Open the course overview:
      Open `.START_HERE.md` in the editor
   
   When you're ready, just say "Start Lab 0" and I'll guide you through!
   ```

4. **Offer immediate start:**
   "Want me to start Lab 0 for you now?"

---

## Progress Check Flow

When a student asks about their progress:

1. **Ask for identification (if unknown):**
   "What's your GitHub username? And which cohort are you in (e.g., 2026-01)?"

2. **Read progress file:**
   Read `progress/cohorts/{cohort}/{username}.md`

3. **Parse and report:**
   - Count completed labs (✅ COMPLETE)
   - Find current in-progress lab (🔄 IN_PROGRESS)
   - Identify next not-started lab (⏳ NOT_STARTED)

4. **Respond with summary:**
   ```
   📊 Your Progress:
   - Completed: {X} labs
   - Currently working on: {current-lab or "none"}
   - Next up: {next-lab}
   - Overall: {X}% complete
   
   Want me to show you what {next-lab} covers?
   ```

---

## Lab Start Flow

When a student says "Start Lab X":

1. **Confirm the lab:**
   "Starting Week 1 Lab {X}. Let me pull up the details..."

2. **Run bootcamp runner:**
   ```bash
   npm run bootcamp -- step week-01-lab-{X}
   ```

3. **Display key information:**
   - Objective
   - Timebox
   - Files to read
   - Definition of Done

4. **Offer to mark progress:**
   "Should I mark this as in-progress in your progress file?"

5. **If yes, run:**
   ```bash
   npm run progress:update -- --github {username} --cohort {cohort} --lab lab-0{X} --status in-progress
   ```

6. **Offer ongoing help:**
   "I'll be here to help! Just describe any challenges you run into."

---

## Lab Complete Flow

When a student says they finished a lab:

1. **Congratulate:**
   "🎉 Great job completing Lab {X}!"

2. **Ask for PR number (if not provided):**
   "What's your PR number so I can record it?"

3. **Update progress:**
   ```bash
   npm run progress:update -- --github {username} --cohort {cohort} --lab lab-0{X} --status complete --pr {PR#}
   ```

4. **Show next step:**
   "Up next is Lab {X+1}: {title}. It covers {objective}. Want to start it now?"

---

## Stuck/Help Flow

When a student is stuck:

1. **Gather context:**
   "I'm sorry you're stuck! Can you tell me:
   - Which lab are you working on?
   - What error or challenge are you facing?
   - What have you tried so far?"

2. **Check relevant FAQ:**
   Look for FAQ entries related to their lab and error type

3. **Offer debugging steps:**
   Based on the lab type (frontend/backend), suggest appropriate debugging

4. **If still stuck, offer escalation:**
   "If you've been stuck for a while, I can mark you as blocked so your facilitator can check in. Want me to do that?"

5. **If yes:**
   ```bash
   npm run progress:update -- --github {username} --cohort {cohort} --lab lab-0{X} --status blocked
   ```

---

## Command Reference

| Student Says | Copilot Runs |
|--------------|--------------|
| "Start the bootcamp" | Onboarding flow |
| "Where am I?" | `cat progress/cohorts/{cohort}/{username}.md` |
| "Start Lab 3" | `npm run bootcamp -- step week-01-lab-03` |
| "Finished Lab 3, PR #42" | `npm run progress:update -- --github {user} --cohort {cohort} --lab lab-03 --status complete --pr 42` |
| "I'm blocked" | `npm run progress:update -- --github {user} --cohort {cohort} --lab lab-0X --status blocked` |
| "What does Lab 4 cover?" | `npm run bootcamp -- step week-01-lab-04` (show objective only) |

---

## Track-Specific Guidance

### Backend Track (Spring Boot)
- Remind about running `./mvnw test` before PRs
- Reference `backend.instructions.md` for patterns
- Suggest Testcontainers for database tests

### Frontend Track (React)
- Remind about running `npm test` before PRs
- Reference `frontend.instructions.md` for patterns
- Suggest React Testing Library patterns

---

## Error Handling

If a command fails, provide helpful guidance:

| Error | Response |
|-------|----------|
| Progress file not found | "Looks like you haven't initialized your progress yet. Run: `npm run progress:init -- ...`" |
| Lab not found | "I couldn't find that lab. Available labs are Lab 0 through Lab 6 in Week 1." |
| Invalid cohort | "The cohort should be in YYYY-MM format, like 2026-01" |
| Runner not installed | "The bootcamp runner isn't set up. Run `npm install` first." |
```

### Task 2: Update `.github/copilot-instructions.md`

Add the following section **after the "Testing Requirements" section** (around line 100):

```markdown
---

## Student Course Navigation

When students ask about course navigation, Copilot should guide them naturally. See `.github/instructions/student-navigation.instructions.md` for detailed patterns.

### Quick Reference Commands

| Student Says | What Copilot Does |
|--------------|-------------------|
| "Start the bootcamp" | Guides through setup, track choice, progress init |
| "Where did I leave off?" | Reads progress file, reports current status |
| "Start Lab 3" | Runs bootcamp runner, marks as in-progress |
| "I finished Lab 3" | Marks complete, suggests next lab |
| "I'm stuck" | Offers debugging help, can mark as blocked |
| "Show my progress" | Displays progress summary |

### Key Files for Navigation
- **Course overview:** `.START_HERE.md`
- **Progress tracking:** `progress/cohorts/{cohort}/{username}.md`
- **Lab content:** `npm run bootcamp -- step week-01-lab-XX`
- **Quick reference:** `COPILOT_COURSE_COMMANDS.md`

### Onboarding New Students
When a student says they're new, guide them through:
1. Track selection (frontend React or backend Spring Boot)
2. `npm install` to install dependencies
3. `npm run progress:init -- --name "Name" --github username --cohort YYYY-MM --track backend`
4. Open `.START_HERE.md` for orientation
5. Suggest "Start Lab 0" when ready

### Checking Progress
To help a student check their progress:
1. Ask for their GitHub username and cohort
2. Read their file at `progress/cohorts/{cohort}/{username}.md`
3. Report completed labs, current lab, and next step
4. Offer to start their next lab
```

### Task 3: Create `COPILOT_COURSE_COMMANDS.md` at repo root

```markdown
# 🤖 Copilot Course Commands

Quick reference for interacting with the bootcamp via GitHub Copilot Chat.

---

## Getting Started

Just open Copilot Chat (Ctrl+Shift+I or Cmd+Shift+I) and say:

| Say This | Copilot Will |
|----------|--------------|
| **"Start the bootcamp"** | Guide you through setup and track selection |
| **"I'm new here"** | Welcome you and explain the course structure |

---

## Daily Workflow

| Say This | Copilot Will |
|----------|--------------|
| **"Where did I leave off?"** | Check your progress file and show your current status |
| **"What's next for me?"** | Tell you the next lab to work on |
| **"Start Lab 3"** | Show Lab 3 details and mark it as in-progress |

---

## Completing Work

| Say This | Copilot Will |
|----------|--------------|
| **"I finished Lab 3, PR #42"** | Mark Lab 3 complete and suggest the next lab |
| **"Show my progress"** | Display your full progress summary |

---

## Getting Help

| Say This | Copilot Will |
|----------|--------------|
| **"I'm stuck on Lab 3"** | Offer debugging help and check the FAQ |
| **"I'm blocked"** | Mark you as blocked so facilitators can help |
| **"What does Lab 4 cover?"** | Show Lab 4's objectives and skills |

---

## Manual Commands (CLI)

If you prefer command line:

```bash
# Initialize your progress
npm run progress:init -- --name "Your Name" --github yourusername --cohort 2026-01 --track backend

# View a lab
npm run bootcamp -- step week-01-lab-03

# List all labs
npm run bootcamp:list

# Mark progress
npm run progress:update -- --github yourusername --cohort 2026-01 --lab lab-03 --status complete --pr 42
```

---

## Tips

💡 **Track selection matters** — Choose "backend" for Spring Boot/Java or "frontend" for React/TypeScript

💡 **Cohort format** — Use YYYY-MM format like "2026-01"

💡 **PR numbers** — Include your PR number when marking labs complete for tracking

💡 **Stuck? Ask Copilot** — Describe your error and Copilot will help debug

---

*For full course overview, see `.START_HERE.md`*
```

---

## Output contract (mandatory)

Return:
1. **Plan** (brief, 5-10 bullets)
2. **Patch** (unified diff for each file created/modified)
3. **Verification commands:**
   ```bash
   # Verify files exist
   cat .github/instructions/student-navigation.instructions.md | head -30
   cat COPILOT_COURSE_COMMANDS.md | head -30
   
   # Verify copilot-instructions updated
   grep -A 5 "Student Course Navigation" .github/copilot-instructions.md
   
   # Test onboarding prompt (manual)
   # Open Copilot Chat and say "Start the bootcamp"
   ```
4. **Work log file** at: `enhance-04/WORK_PRODUCTS/E11_COPILOT_COURSE_AGENT_WORKLOG.md`

---

## Success criteria
- [ ] `.github/instructions/student-navigation.instructions.md` exists
- [ ] `COPILOT_COURSE_COMMANDS.md` exists at repo root
- [ ] `.github/copilot-instructions.md` has "Student Course Navigation" section
- [ ] All trigger phrases documented
- [ ] Error handling documented
- [ ] Track-specific guidance included

---

## Coordination notes

- **Depends on:** E09 (progress system for commands to work)
- **Runs in:** Phase 4 (after content, before final QA)
- **Testing:** Manual testing with Copilot Chat required
- **Iteration expected:** Refine based on student feedback
