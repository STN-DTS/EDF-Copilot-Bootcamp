# enhance-06.md — Future Enhancement Pack

**Planned After:** enhance-05 completion  
**Focus:** Advanced Features, Gamification, and Automation  
**Estimated Agents:** 5-6  
**Dependency:** enhance-05 infrastructure must be stable

---

## 📋 Executive Summary

Enhance-06 focuses on **advanced student engagement** and **automation at scale**. These are larger, more complex enhancements that build on the foundation from enhance-04 and enhance-05.

Primary goals:
1. **@bootcamp Copilot participant** — Dedicated VS Code extension for course interaction
2. **Auto-update dashboard** — GitHub Actions for automated progress updates
3. **Badge/achievement system** — Gamification to increase engagement
4. **Cross-agent conflict detection** — Prevent merge conflicts in multi-agent work
5. **Learning path visualization** — Visual progress representation

---

## 🔧 Pre-requisites from enhance-05

Before starting enhance-06, confirm:

| Item | Verification | Expected |
|------|--------------|----------|
| Runner + progress integrated | `npm run bootcamp -- step week-01-lab-02 --mark-started test --cohort test` | Works |
| Backup/restore | `npm run progress:backup -- --cohort test` | Creates backup |
| Week 2-4 tie-backs | Check `docs/content/week-02/micro-labs/*.md` | Has 🔙 sections |
| Extended alerts | `npm run progress:alerts -- --cohort test` | Shows all alert types |

---

## 🎯 Enhancement Objectives

### E18: @bootcamp Copilot Participant (VS Code Extension)

**Note:** Agent number shifted from E17 to E18 (E17 reserved for tech debt in enhance-05)

**Problem:** E11's copilot-instructions.md approach is passive. Students must phrase questions a specific way.

**Solution:** Create a dedicated `@bootcamp` participant that students explicitly activate:

```
@bootcamp where did I leave off?
@bootcamp start lab 3
@bootcamp I'm stuck on the tests
```

**Implementation:**

1. **Create VS Code extension scaffold:**
   ```
   bootcamp-participant/
   ├── package.json
   ├── src/
   │   ├── extension.ts
   │   └── bootcampParticipant.ts
   ├── tsconfig.json
   └── README.md
   ```

2. **Implement ChatParticipant API:**
   ```typescript
   import * as vscode from 'vscode';

   export function activate(context: vscode.ExtensionContext) {
     const participant = vscode.chat.createChatParticipant('bootcamp', handleRequest);
     participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'icon.png');
     context.subscriptions.push(participant);
   }

   async function handleRequest(
     request: vscode.ChatRequest,
     context: vscode.ChatContext,
     stream: vscode.ChatResponseStream,
     token: vscode.CancellationToken
   ): Promise<vscode.ChatResult> {
     const prompt = request.prompt.toLowerCase();
     
     if (prompt.includes('where') && prompt.includes('leave off')) {
       return handleProgressCheck(request, stream);
     }
     if (prompt.includes('start lab')) {
       return handleLabStart(request, stream);
     }
     if (prompt.includes('stuck') || prompt.includes('help')) {
       return handleHelp(request, stream);
     }
     
     // Default: show available commands
     stream.markdown('Available commands:\n- `where did I leave off?`\n- `start lab X`\n- `I'm stuck`');
     return { metadata: { command: 'help' } };
   }
   ```

3. **Register in .vscode/extensions.json:**
   ```json
   {
     "recommendations": [
       "edf-bootcamp.bootcamp-participant"
     ]
   }
   ```

**File Ownership:**
- `bootcamp-participant/` (entire new folder)
- `.vscode/extensions.json` (add recommendation)

**Acceptance Criteria:**
- [ ] Extension activates on workspace open
- [ ] `@bootcamp` appears in Copilot Chat
- [ ] Core commands work (progress, start lab, help)
- [ ] Extension publishes to marketplace (or sideloads)

---

### E18: Auto-Update Dashboard (GitHub Actions)

**Problem:** Dashboard requires manual refresh. Facilitators forget to run `npm run progress:dashboard`.

**Solution:** Create GitHub Action to auto-update on progress file changes:

```yaml
# .github/workflows/update-dashboard.yml
name: Update Progress Dashboard

on:
  push:
    branches: [main]
    paths:
      - 'progress/cohorts/**/*.md'
  workflow_dispatch:
    inputs:
      cohort:
        description: 'Specific cohort to update (leave empty for all)'
        required: false

jobs:
  update-dashboard:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
      
      - name: Generate dashboards
        run: |
          if [ -n "${{ github.event.inputs.cohort }}" ]; then
            npm run progress:dashboard -- --cohort ${{ github.event.inputs.cohort }}
          else
            npm run progress:dashboard -- --all
          fi
      
      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: auto-update progress dashboard"
          file_pattern: 'progress/DASHBOARD*.md'
```

**Additional: Slack/Teams Notification**
```yaml
      - name: Notify on blocked students
        if: always()
        run: |
          npm run progress:alerts -- --format json > alerts.json
          if [ -s alerts.json ]; then
            curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
              -H 'Content-Type: application/json' \
              -d @alerts.json
          fi
```

**File Ownership:**
- `.github/workflows/update-dashboard.yml` (create new)
- `.github/workflows/notify-alerts.yml` (optional, create new)

**Acceptance Criteria:**
- [ ] Dashboard updates on push to progress files
- [ ] Manual trigger works with cohort input
- [ ] No commit if no changes
- [ ] Optional: Slack/Teams notification on blocked students

---

### E19: Badge & Achievement System

**Problem:** No gamification or achievement recognition for students.

**Solution:** Implement badge system in progress tracking:

**Badge Definitions:**
```javascript
// progress/config/badges.json
{
  "badges": [
    {
      "id": "first-lab",
      "name": "🏆 First Lab",
      "description": "Completed Lab 0",
      "criteria": { "labs_completed": 1 }
    },
    {
      "id": "speed-demon",
      "name": "⚡ Speed Demon",
      "description": "Completed a lab in under 30 minutes",
      "criteria": { "lab_duration_minutes": { "max": 30 } }
    },
    {
      "id": "perfect-week",
      "name": "🎯 Perfect Week",
      "description": "All 7 Week 1 labs completed",
      "criteria": { "week_complete": "week-01" }
    },
    {
      "id": "on-fire",
      "name": "🔥 On Fire",
      "description": "3+ labs in one day",
      "criteria": { "labs_same_day": 3 }
    },
    {
      "id": "helper",
      "name": "🤝 Helper",
      "description": "Assisted another student",
      "criteria": { "facilitator_awarded": true }
    },
    {
      "id": "sprint-master",
      "name": "🏅 Sprint Master",
      "description": "Completed all 4 sprints",
      "criteria": { "sprints_complete": 4 }
    },
    {
      "id": "bootcamp-graduate",
      "name": "🎓 Bootcamp Graduate",
      "description": "Completed entire bootcamp",
      "criteria": { "all_complete": true }
    }
  ]
}
```

**Badge Checker Script:**
```javascript
// progress/scripts/check-badges.mjs
// Automatically awards badges when criteria met
// Called after each progress:update

function checkBadges(student, progressData) {
  const earnedBadges = [];
  
  for (const badge of badges) {
    if (student.badges.includes(badge.id)) continue; // Already earned
    if (checkCriteria(badge.criteria, progressData)) {
      earnedBadges.push(badge);
    }
  }
  
  return earnedBadges;
}
```

**Badge Display in Progress File:**
```markdown
## Achievements 🏆

| Badge | Name | Earned |
|-------|------|--------|
| 🏆 | First Lab | 2026-01-15 |
| ⚡ | Speed Demon | 2026-01-16 |
| 🎯 | Perfect Week | 2026-01-20 |
```

**File Ownership:**
- `progress/config/badges.json` (create new)
- `progress/scripts/check-badges.mjs` (create new)
- `progress/scripts/award-badge.mjs` (create new for facilitator manual awards)
- Update `progress/scripts/update-progress.mjs` (call badge checker)

**Acceptance Criteria:**
- [ ] Badge definitions in config file
- [ ] Badges auto-awarded on criteria met
- [ ] Facilitator can manually award badges
- [ ] Badges display in student progress file
- [ ] Badge earned notification in CLI output

---

### E20: Cross-Agent Conflict Detection

**Problem:** No automated detection when two agents modify the same file.

**Solution:** Create pre-merge conflict detector:

```javascript
// enhance-tools/scripts/detect-conflicts.mjs
// Usage: node detect-conflicts.mjs enhance-06

import fs from 'node:fs';
import path from 'node:path';

function extractModifiedFiles(worklogPath) {
  const content = fs.readFileSync(worklogPath, 'utf8');
  const filesSection = content.match(/files_modified:\s*([\s\S]*?)(?=\n[a-z]|\n---|\n$)/i);
  if (!filesSection) return [];
  
  return filesSection[1]
    .split('\n')
    .map(line => line.trim().replace(/^-\s*/, ''))
    .filter(line => line.length > 0);
}

function detectConflicts(packDir) {
  const workProducts = path.join(packDir, 'WORK_PRODUCTS');
  const worklogs = fs.readdirSync(workProducts).filter(f => f.endsWith('_WORKLOG.md'));
  
  const fileToAgents = new Map();
  
  for (const worklog of worklogs) {
    const agentId = worklog.split('_')[0];
    const files = extractModifiedFiles(path.join(workProducts, worklog));
    
    for (const file of files) {
      if (!fileToAgents.has(file)) {
        fileToAgents.set(file, []);
      }
      fileToAgents.get(file).push(agentId);
    }
  }
  
  const conflicts = [];
  for (const [file, agents] of fileToAgents) {
    if (agents.length > 1) {
      conflicts.push({ file, agents });
    }
  }
  
  return conflicts;
}

// Main
const packDir = process.argv[2] || 'enhance-06';
const conflicts = detectConflicts(packDir);

if (conflicts.length > 0) {
  console.error('⚠️ CONFLICTS DETECTED:');
  for (const { file, agents } of conflicts) {
    console.error(`  ${file}: edited by ${agents.join(', ')}`);
  }
  process.exit(1);
} else {
  console.log('✅ No conflicts detected');
}
```

**Integration with CI:**
```yaml
# .github/workflows/check-conflicts.yml
name: Check Agent Conflicts

on:
  pull_request:
    paths:
      - 'enhance-*/WORK_PRODUCTS/*_WORKLOG.md'

jobs:
  detect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node enhance-tools/scripts/detect-conflicts.mjs enhance-06
```

**File Ownership:**
- `enhance-tools/scripts/detect-conflicts.mjs` (create new)
- `.github/workflows/check-conflicts.yml` (create new)

**Acceptance Criteria:**
- [ ] Detector parses work logs correctly
- [ ] Conflicts reported with file and agent names
- [ ] CI fails on conflict detection
- [ ] Clear guidance on resolution

---

### E21: Learning Path Visualization

**Problem:** Progress is text-based in markdown files. No visual representation.

**Solution:** Generate visual learning path diagram:

**Option A: Mermaid in Dashboard**
```javascript
// progress/scripts/generate-visualization.mjs
function generateMermaid(progressData) {
  let mermaid = 'graph LR\n';
  
  for (const lab of progressData.labs) {
    const style = lab.status === 'COMPLETE' ? 'fill:#4CAF50' :
                  lab.status === 'IN_PROGRESS' ? 'fill:#FFC107' :
                  'fill:#9E9E9E';
    
    mermaid += `  ${lab.id}[${lab.name}]\n`;
    mermaid += `  style ${lab.id} ${style}\n`;
    
    if (lab.next) {
      mermaid += `  ${lab.id} --> ${lab.next}\n`;
    }
  }
  
  return mermaid;
}
```

**Option B: HTML Dashboard (GitHub Pages)**
```html
<!-- progress/docs/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Bootcamp Progress</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>Cohort Progress Dashboard</h1>
  <canvas id="progressChart"></canvas>
  <script>
    fetch('data.json').then(r => r.json()).then(data => {
      new Chart(document.getElementById('progressChart'), {
        type: 'bar',
        data: {
          labels: data.students.map(s => s.name),
          datasets: [{
            label: 'Labs Completed',
            data: data.students.map(s => s.completed)
          }]
        }
      });
    });
  </script>
</body>
</html>
```

**File Ownership:**
- `progress/scripts/generate-visualization.mjs` (create new)
- `progress/docs/` (create folder for HTML dashboard)
- `.github/workflows/publish-dashboard.yml` (optional: deploy to GitHub Pages)

**Acceptance Criteria:**
- [ ] Mermaid diagram generates correctly
- [ ] Status colors reflect progress
- [ ] Optional: HTML dashboard with charts
- [ ] Optional: GitHub Pages deployment

---

## 📊 Phase Structure

```
PHASE 1 (Extension Development)
└── E17_COPILOT_PARTICIPANT ──► Phase 1 Gate

PHASE 2 (Automation) — CONCURRENT
├── E18_AUTO_DASHBOARD ────┐
│                          ├──► Phase 2 Gate
└── E20_CONFLICT_DETECTION ┘

PHASE 3 (Gamification)
└── E19_BADGE_SYSTEM ──────► Phase 3 Gate

PHASE 4 (Visualization)
└── E21_LEARNING_PATH ─────► Phase 4 Gate

PHASE 5 (Validation)
└── E08_QA_VALIDATION_V3 ──► Final Gate
```

---

## 📁 File Ownership Matrix

| Agent | Owned Paths | Must NOT Edit |
|-------|-------------|---------------|
| E17 | `bootcamp-participant/`, `.vscode/extensions.json` | Copilot instructions |
| E18 | `.github/workflows/update-dashboard.yml` | `progress/scripts/*` |
| E19 | `progress/config/badges.json`, `progress/scripts/check-badges.mjs` | Existing progress scripts |
| E20 | `enhance-tools/scripts/`, `.github/workflows/check-conflicts.yml` | Any production files |
| E21 | `progress/scripts/generate-visualization.mjs`, `progress/docs/` | Dashboard scripts |

---

## ✅ Success Criteria

- [ ] @bootcamp participant works in VS Code
- [ ] Dashboard auto-updates on push
- [ ] Badges awarded automatically
- [ ] Conflict detection runs in CI
- [ ] Visual progress available

---

## 🔗 Dependencies

| This Pack | Depends On |
|-----------|------------|
| E17 | E11 (command patterns established) |
| E18 | E10 (dashboard generation script) |
| E19 | E09 (progress file structure) |
| E20 | enhance-04/05 work log patterns |
| E21 | E10 (dashboard data structure) |

---

## 📅 Estimated Effort

| Agent | Complexity | Estimate |
|-------|------------|----------|
| E17 | High | 8 hours (VS Code extension) |
| E18 | Medium | 3 hours |
| E19 | Medium | 4 hours |
| E20 | Low | 2 hours |
| E21 | Medium | 4 hours |
| **Total** | | **~21 hours** |

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| VS Code extension API changes | E17 breaks | Pin VS Code version, follow stable API |
| GitHub Actions rate limits | E18 delayed | Add workflow dispatch, batch updates |
| Badge criteria too easy/hard | Poor engagement | Make criteria configurable |
| Mermaid render issues | Poor visuals | Fallback to HTML charts |

---

## 🚀 Launch Preparation

Before starting enhance-06:

1. [ ] Confirm enhance-05 validation passed
2. [ ] Review VS Code Chat Participants API docs
3. [ ] Set up test marketplace for extension
4. [ ] Configure GitHub Actions secrets (if Slack integration)
5. [ ] Design badge icons/visuals
6. [ ] Create enhance-06 folder from template

---

*This document defines the scope for enhance-06. These are advanced features requiring more development time and testing.*
