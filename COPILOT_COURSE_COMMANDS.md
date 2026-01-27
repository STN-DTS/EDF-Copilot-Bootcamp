# 🗣️ Copilot Course Commands

> **Quick reference for natural language commands you can use with GitHub Copilot in this bootcamp.**

Just open Copilot Chat and say these phrases naturally. Copilot will understand and help you!

---

## 🚀 Getting Started

| Say This | What Happens |
|----------|--------------|
| "Start the bootcamp" | Begins onboarding flow - sets up your progress tracking |
| "I'm new here" | Same as above - Copilot will guide you through setup |
| "Set me up" | Initializes your progress file and orients you |
| "Show me the master index" | Opens `.MASTER_BOOTCAMP.md` with all bootcamp content |

### First Time Setup

When you say "Start the bootcamp", Copilot will ask for:
- Your **name** (e.g., "Jane Smith")
- Your **GitHub username** (e.g., "jsmith")
- Your **cohort** (e.g., "2026-01")
- Your **track** (frontend or backend)

---

## 📅 Daily Workflow

| Say This | What Happens |
|----------|--------------|
| "Where did I leave off?" | Shows your progress and suggests next steps |
| "What's next?" | Tells you which lab to work on |
| "Show my progress" | Displays your completion status for all labs |
| "Resume my work" | Opens your current lab and shows status |

### Starting a Lab

| Say This | What Happens |
|----------|--------------|
| "Start Lab 0" | Marks Lab 0 as started, opens instructions |
| "Begin Lab 2" | Marks Lab 2 as started, provides setup tips |
| "Work on Lab 3" | Opens Lab 3 with the 3 Non-Negotiable Rules reminder |
| "Open Lab 5 instructions" | Shows you the lab file without starting it |

---

## ✅ Completing Work

| Say This | What Happens |
|----------|--------------|
| "I finished Lab 2" | Prompts for verification, marks lab complete |
| "Lab 3 is done" | Same as above - asks about tests and PR |
| "Mark Lab 1 complete" | Records completion in your progress file |
| "Completed Lab 4 with PR 42" | Marks complete and links your PR |

### What Copilot Checks

Before marking a lab complete, Copilot will ask:
- ✅ Did the build pass?
- ✅ Did all tests pass?
- 📝 Do you have a PR number to link?

---

## 🆘 Getting Help

| Say This | What Happens |
|----------|--------------|
| "I'm stuck" | Starts debugging assistance flow |
| "I need help" | Asks what you're working on and what's wrong |
| "Something's not working" | Offers to run diagnostics |
| "I'm blocked on Lab 2" | Records blocker and offers troubleshooting |
| "Show me an example" | Provides relevant code examples |

### When You're Really Stuck

Say: "Mark me as blocked on Lab 3 - waiting for Docker setup"

This will:
1. Update your progress file with blocked status
2. Record your notes for facilitator review
3. Suggest alternative next steps

---

## 📚 Reference Commands

| Say This | What Happens |
|----------|--------------|
| "Show the prompt pack" | Opens the Prompt Pack V1 reference |
| "What are the 3 rules?" | Explains Plan First, Small Diffs, Proof |
| "Domain context" | Shows the Order Management domain reference |
| "Definition of Done" | Shows the DoD checklist |
| "Lab rubrics" | Opens the grading criteria |

---

## 🔧 Manual CLI Commands (Fallback)

If you prefer terminal commands:

```bash
# Initialize progress
npm run progress:init -- --name "Your Name" --github "username" --cohort "2026-01" --track "backend"

# Start a lab
npm run progress:start -- --student "username" --cohort "2026-01" week-01-lab-02

# Complete a lab
npm run progress:complete -- --student "username" --cohort "2026-01" --pr "42" week-01-lab-02

# Mark as blocked
npm run progress:blocked -- --student "username" --cohort "2026-01" --notes "Issue description" week-01-lab-02

# View progress
npm run progress:view -- --student "username" --cohort "2026-01"
```

---

## 💡 Tips

1. **Be natural** - Copilot understands variations like "I'm done with lab 3" or "finished lab 3" or "lab 3 complete"

2. **Provide context** - If Copilot asks clarifying questions, answer them for better help

3. **Remember your track** - Mention "frontend" or "backend" if you're getting track-specific help

4. **Use the 3 rules** - Before coding, say "Help me plan Lab 2" to get a plan first

5. **Link your PRs** - When completing labs, mention your PR number for proper tracking

---

## 🎯 Quick Start Checklist

- [ ] Say "Start the bootcamp" to initialize
- [ ] Complete Lab 0 (Setup Verification)
- [ ] Say "What's next?" to continue
- [ ] Say "I'm stuck" if you need help
- [ ] Say "I finished Lab X" when done

---

*See also: [.START_HERE.md](.START_HERE.md) | [.MASTER_BOOTCAMP.md](.MASTER_BOOTCAMP.md)*
