# E11_COPILOT_COURSE_AGENT Work Log

> **Agent:** E11_COPILOT_COURSE_AGENT  
> **Mission:** Enable natural language course interaction via GitHub Copilot Chat  
> **Executed:** 2026-01-27

---

## Summary

This agent enables students to interact with the bootcamp using natural language through GitHub Copilot Chat. When students ask "Start the bootcamp" or "Where did I leave off?", Copilot now understands and guides them appropriately.

---

## Files Created

### 1. `.github/instructions/student-navigation.instructions.md`

**Lines:** ~280  
**Purpose:** Comprehensive Copilot instructions for student navigation

**Contents:**
- Header explaining the file's purpose
- Trigger Phrases → Actions mapping table (onboarding, progress, lab start, lab complete, help)
- Onboarding Flow (6 steps: welcome, collect info, track selection, run commands, orient to START_HERE, offer Lab 0)
- Progress Check Flow (4 steps: identify, read file, report summary, provide next step)
- Lab Start Flow (4 steps: parse reference, mark started, open instructions, provide tips)
- Lab Complete Flow (3 steps: confirm, mark complete, celebrate and suggest next)
- Stuck/Help Flow (3 steps: gather info, offer debugging paths, offer to mark blocked)
- Command Reference Table with all progress CLI commands
- Lab ID Reference mapping
- Track-Specific Guidance (backend vs frontend)
- Error Handling (common errors and responses)
- Key Files for Navigation table
- Best Practices for Copilot Responses
- Session Context guidelines

### 2. `COPILOT_COURSE_COMMANDS.md` (repo root)

**Lines:** ~115  
**Purpose:** Student-friendly quick reference for natural language commands

**Contents:**
- Getting Started section (first-time setup phrases)
- Daily Workflow commands (progress, resuming work)
- Starting a Lab commands
- Completing Work commands
- Getting Help commands
- Reference Commands (prompt pack, domain, DoD)
- Manual CLI Commands (fallback section)
- Tips section (5 tips for effective use)
- Quick Start Checklist

---

## Files Modified

### 3. `.github/copilot-instructions.md`

**Change:** Added new "Student Course Navigation" section after Testing Requirements

**Section Contents:**
- Quick Reference Commands table (5 common phrases → actions)
- Key Files for Navigation table (4 files with purposes)
- Onboarding New Students (5 steps)
- Checking Progress (4 steps)
- Reference to detailed flows in student-navigation.instructions.md

**Insertion Point:** After "### Backend: JUnit 5 + Spring Boot Test + Testcontainers/H2" and before "## Documentation"

---

## Files NOT Modified (per constraints)

- ❌ `progress/scripts/*` - Not touched
- ❌ `scripts/bootcamp.mjs` - Not touched
- ❌ `docs/**` files - Not touched

---

## Verification

To verify the changes work:

1. **Check files exist:**
   ```bash
   ls -la .github/instructions/student-navigation.instructions.md
   ls -la COPILOT_COURSE_COMMANDS.md
   ```

2. **Check copilot-instructions.md has new section:**
   ```bash
   grep -n "Student Course Navigation" .github/copilot-instructions.md
   ```

3. **Test in Copilot Chat:**
   - Open Copilot Chat
   - Say "Start the bootcamp" - Should trigger onboarding flow
   - Say "Where did I leave off?" - Should check progress
   - Say "I'm stuck" - Should offer help

---

## Integration Points

The new instructions integrate with:

| System | Integration |
|--------|-------------|
| Progress Tracking | Uses `npm run progress:*` commands |
| .START_HERE.md | Referenced in onboarding flow |
| .MASTER_BOOTCAMP.md | Referenced for navigation |
| Track-specific instructions | References frontend.instructions.md and backend.instructions.md |
| Lab files | Maps natural language to lab file paths |

---

## Natural Language Mappings Added

| Trigger Category | Example Phrases | Action |
|-----------------|-----------------|--------|
| Onboarding | "start the bootcamp", "I'm new", "set me up" | Initialize progress, orient student |
| Progress | "where did I leave off", "what's next", "my status" | Read progress file, report status |
| Lab Start | "start lab 2", "begin week 1 lab 3" | Mark in-progress, open instructions |
| Lab Complete | "finished lab 2", "lab 3 is done" | Verify, mark complete, suggest next |
| Help | "I'm stuck", "something's not working" | Debug assistance, offer blocked status |

---

*Agent E11_COPILOT_COURSE_AGENT execution complete.*
