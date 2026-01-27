#!/usr/bin/env node

/**
 * check-alerts.mjs
 * 
 * Scans cohort student files and identifies students who may need attention.
 * 
 * Usage:
 *   npm run progress:alerts -- --cohort "2026-01"
 *   npm run progress:alerts -- --cohort "2026-01" --output
 * 
 * Options:
 *   --cohort   Cohort to check for alerts (YYYY-MM format)
 *   --output   Also write alerts to progress/ALERTS_{cohort}.md
 *   --all      Check all cohorts
 * 
 * Alert Criteria:
 *   🔴 BLOCKED: Any item with BLOCKED status
 *   ⏳ STUCK: IN_PROGRESS on same item for 3+ days
 *   💤 INACTIVE: No file update in 5+ days
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

// Get script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROGRESS_ROOT = join(__dirname, '..');

// Alert thresholds (in days)
const STUCK_THRESHOLD_DAYS = 3;
const INACTIVE_THRESHOLD_DAYS = 5;

// Status patterns
const STATUS_PATTERNS = {
  BLOCKED: /🚫\s*BLOCKED/,
  IN_PROGRESS: /🔄\s*IN_PROGRESS/
};

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    cohort: null,
    output: false,
    all: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--cohort':
        result.cohort = args[++i];
        break;
      case '--output':
        result.output = true;
        break;
      case '--all':
        result.all = true;
        break;
    }
  }

  return result;
}

// ============================================================================
// Student File Analysis
// ============================================================================

/**
 * Extracts student information from the progress file.
 * @param {string} content - File content
 * @returns {object} Student info object
 */
function extractStudentInfo(content) {
  const info = {
    name: 'Unknown',
    github: 'unknown'
  };

  const nameMatch = content.match(/\*\*Name\*\*\s*\|\s*([^\|]+)/);
  if (nameMatch) info.name = nameMatch[1].trim();

  const githubMatch = content.match(/\*\*GitHub\*\*\s*\|\s*\[@([^\]]+)\]/);
  if (githubMatch) info.github = githubMatch[1];

  return info;
}

/**
 * Finds blocked items in the content.
 * @param {string} content - File content
 * @returns {object[]} Array of blocked items with details
 */
function findBlockedItems(content) {
  const blocked = [];
  const lines = content.split('\n');

  for (const line of lines) {
    if (STATUS_PATTERNS.BLOCKED.test(line) && line.startsWith('|')) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length > 1 && parts[1]) {
        blocked.push({
          item: parts[1],
          type: 'BLOCKED',
          severity: 'high'
        });
      }
    }
  }

  return blocked;
}

/**
 * Finds in-progress items with their start dates.
 * @param {string} content - File content
 * @returns {object[]} Array of in-progress items
 */
function findInProgressItems(content) {
  const inProgress = [];
  const lines = content.split('\n');

  for (const line of lines) {
    if (STATUS_PATTERNS.IN_PROGRESS.test(line) && line.startsWith('|')) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length > 3 && parts[1]) {
        // Table format: | Lab | Status | Started | Completed | ...
        const startedDate = parts[3]; // 'Started' column
        
        if (startedDate && startedDate !== '-') {
          const startDate = new Date(startedDate);
          if (!isNaN(startDate.getTime())) {
            const daysSince = Math.floor((Date.now() - startDate.getTime()) / (24 * 60 * 60 * 1000));
            
            if (daysSince >= STUCK_THRESHOLD_DAYS) {
              inProgress.push({
                item: parts[1],
                startedDate,
                daysSince,
                type: 'STUCK',
                severity: daysSince >= 7 ? 'high' : 'medium'
              });
            }
          }
        }
      }
    }
  }

  return inProgress;
}

/**
 * Analyzes a student file for alerts.
 * @param {string} filePath - Path to student file
 * @returns {object} Analysis with alerts
 */
function analyzeStudentForAlerts(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const info = extractStudentInfo(content);
  const fileStats = statSync(filePath);
  const lastModified = fileStats.mtime;
  
  const alerts = [];

  // Check for blocked items
  const blockedItems = findBlockedItems(content);
  for (const item of blockedItems) {
    alerts.push({
      type: 'BLOCKED',
      severity: 'high',
      message: `Blocked on: ${item.item}`,
      icon: '🔴'
    });
  }

  // Check for stuck items (in progress for 3+ days)
  const stuckItems = findInProgressItems(content);
  for (const item of stuckItems) {
    alerts.push({
      type: 'STUCK',
      severity: item.severity,
      message: `Stuck on "${item.item}" for ${item.daysSince} days (started ${item.startedDate.toISOString().slice(0, 10)})`,
      icon: '⏳'
    });
  }

  // Check for inactivity
  const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (24 * 60 * 60 * 1000));
  if (daysSinceUpdate >= INACTIVE_THRESHOLD_DAYS) {
    // Only alert if student hasn't completed everything
    const hasIncompleteItems = content.includes('⬜ NOT_STARTED') || content.includes('🔄 IN_PROGRESS');
    if (hasIncompleteItems) {
      alerts.push({
        type: 'INACTIVE',
        severity: daysSinceUpdate >= 10 ? 'high' : 'medium',
        message: `No updates for ${daysSinceUpdate} days (last: ${lastModified.toISOString().slice(0, 10)})`,
        icon: '💤'
      });
    }
  }

  return {
    ...info,
    filePath,
    lastModified,
    daysSinceUpdate,
    alerts,
    hasAlerts: alerts.length > 0,
    highPriorityCount: alerts.filter(a => a.severity === 'high').length
  };
}

// ============================================================================
// Report Generation
// ============================================================================

/**
 * Generates console output for alerts.
 * @param {string} cohort - Cohort identifier
 * @param {object[]} students - Array of analyzed students
 */
function printAlertReport(cohort, students) {
  const studentsWithAlerts = students.filter(s => s.hasAlerts);
  
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  ALERT REPORT: Cohort ${cohort}`);
  console.log(`${'═'.repeat(70)}`);
  console.log(`  Generated: ${new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC`);
  console.log(`${'─'.repeat(70)}\n`);

  if (studentsWithAlerts.length === 0) {
    console.log('  ✅ No alerts! All students are progressing normally.\n');
    return;
  }

  // Summary
  const blocked = students.filter(s => s.alerts.some(a => a.type === 'BLOCKED'));
  const stuck = students.filter(s => s.alerts.some(a => a.type === 'STUCK'));
  const inactive = students.filter(s => s.alerts.some(a => a.type === 'INACTIVE'));

  console.log('  📊 SUMMARY');
  console.log(`  ${'─'.repeat(40)}`);
  console.log(`  🔴 Blocked students:  ${blocked.length}`);
  console.log(`  ⏳ Stuck students:    ${stuck.length}`);
  console.log(`  💤 Inactive students: ${inactive.length}`);
  console.log(`  ${'─'.repeat(40)}\n`);

  // Sort by priority (high severity first, then by name)
  const sortedStudents = [...studentsWithAlerts].sort((a, b) => {
    if (b.highPriorityCount !== a.highPriorityCount) {
      return b.highPriorityCount - a.highPriorityCount;
    }
    return a.name.localeCompare(b.name);
  });

  // Group by severity
  const highPriority = sortedStudents.filter(s => s.highPriorityCount > 0);
  const mediumPriority = sortedStudents.filter(s => s.highPriorityCount === 0);

  if (highPriority.length > 0) {
    console.log('  🚨 HIGH PRIORITY (Immediate Attention Needed)');
    console.log(`  ${'─'.repeat(50)}`);
    for (const student of highPriority) {
      console.log(`\n  👤 ${student.name} (@${student.github})`);
      for (const alert of student.alerts.filter(a => a.severity === 'high')) {
        console.log(`     ${alert.icon} ${alert.message}`);
      }
    }
    console.log('');
  }

  if (mediumPriority.length > 0) {
    console.log('  ⚠️  MEDIUM PRIORITY (Follow-up Recommended)');
    console.log(`  ${'─'.repeat(50)}`);
    for (const student of mediumPriority) {
      console.log(`\n  👤 ${student.name} (@${student.github})`);
      for (const alert of student.alerts) {
        console.log(`     ${alert.icon} ${alert.message}`);
      }
    }
    console.log('');
  }

  // Recommendations
  console.log(`\n  📋 RECOMMENDED ACTIONS`);
  console.log(`  ${'─'.repeat(50)}`);
  if (blocked.length > 0) {
    console.log('  • Reach out to blocked students to understand issues');
  }
  if (stuck.length > 0) {
    console.log('  • Schedule check-ins with stuck students');
  }
  if (inactive.length > 0) {
    console.log('  • Send reminder emails to inactive students');
  }
  console.log('');
}

/**
 * Generates markdown report for alerts.
 * @param {string} cohort - Cohort identifier
 * @param {object[]} students - Array of analyzed students
 * @returns {string} Markdown content
 */
function generateAlertMarkdown(cohort, students) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  const studentsWithAlerts = students.filter(s => s.hasAlerts);

  let md = `# 🚨 Alert Report: Cohort ${cohort}

> **Generated:** ${timestamp}

---

## 📊 Summary

| Alert Type | Count |
|------------|-------|
| 🔴 Blocked | ${students.filter(s => s.alerts.some(a => a.type === 'BLOCKED')).length} |
| ⏳ Stuck (3+ days) | ${students.filter(s => s.alerts.some(a => a.type === 'STUCK')).length} |
| 💤 Inactive (5+ days) | ${students.filter(s => s.alerts.some(a => a.type === 'INACTIVE')).length} |

---

`;

  if (studentsWithAlerts.length === 0) {
    md += `## ✅ No Alerts

All students in this cohort are progressing normally. Great job!

`;
    return md;
  }

  // High Priority Alerts
  const highPriority = studentsWithAlerts.filter(s => s.highPriorityCount > 0);
  if (highPriority.length > 0) {
    md += `## 🚨 High Priority Alerts

These students need immediate attention:

`;
    for (const student of highPriority) {
      md += `### ${student.name} (@${student.github})\n\n`;
      for (const alert of student.alerts.filter(a => a.severity === 'high')) {
        md += `- ${alert.icon} **${alert.type}**: ${alert.message}\n`;
      }
      md += '\n';
    }
  }

  // Medium Priority Alerts
  const mediumPriority = studentsWithAlerts.filter(s => s.highPriorityCount === 0);
  if (mediumPriority.length > 0) {
    md += `## ⚠️ Medium Priority Alerts

These students should be followed up with:

`;
    for (const student of mediumPriority) {
      md += `### ${student.name} (@${student.github})\n\n`;
      for (const alert of student.alerts) {
        md += `- ${alert.icon} **${alert.type}**: ${alert.message}\n`;
      }
      md += '\n';
    }
  }

  // Recommended Actions
  md += `---

## 📋 Recommended Actions

`;

  const blocked = students.filter(s => s.alerts.some(a => a.type === 'BLOCKED'));
  const stuck = students.filter(s => s.alerts.some(a => a.type === 'STUCK'));
  const inactive = students.filter(s => s.alerts.some(a => a.type === 'INACTIVE'));

  if (blocked.length > 0) {
    md += `### For Blocked Students (${blocked.length})
- Reach out via Slack/Teams to understand the blocker
- Review their PR or code if available
- Schedule 1:1 if needed
- Document resolution in their progress file

`;
  }

  if (stuck.length > 0) {
    md += `### For Stuck Students (${stuck.length})
- Check if they need clarification on requirements
- Review their current progress and provide guidance
- Consider pairing session or workshop review
- Update status once they're unblocked

`;
  }

  if (inactive.length > 0) {
    md += `### For Inactive Students (${inactive.length})
- Send a friendly check-in message
- Verify they have access to all resources
- Confirm their availability for the bootcamp
- Consider schedule adjustment if needed

`;
  }

  md += `---

_Alert thresholds: Stuck = ${STUCK_THRESHOLD_DAYS}+ days on same item, Inactive = ${INACTIVE_THRESHOLD_DAYS}+ days without file update_
`;

  return md;
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Gets all cohorts in the progress folder.
 * @returns {string[]} Array of cohort identifiers
 */
function getAllCohorts() {
  const cohortsDir = join(PROGRESS_ROOT, 'cohorts');
  if (!existsSync(cohortsDir)) {
    return [];
  }

  return readdirSync(cohortsDir)
    .filter(item => {
      const itemPath = join(cohortsDir, item);
      return statSync(itemPath).isDirectory() && /^\d{4}-\d{2}$/.test(item);
    });
}

/**
 * Gets all student files for a cohort.
 * @param {string} cohort - Cohort identifier
 * @returns {string[]} Array of file paths
 */
function getStudentFiles(cohort) {
  const cohortDir = join(PROGRESS_ROOT, 'cohorts', cohort);
  if (!existsSync(cohortDir)) {
    return [];
  }

  return readdirSync(cohortDir)
    .filter(file => file.endsWith('.md') && !file.startsWith('.'))
    .map(file => join(cohortDir, file));
}

/**
 * Checks alerts for a single cohort.
 * @param {string} cohort - Cohort identifier
 * @param {boolean} writeOutput - Whether to write output file
 */
function checkCohortAlerts(cohort, writeOutput) {
  console.log(`\n🔍 Checking alerts for cohort: ${cohort}`);

  const studentFiles = getStudentFiles(cohort);
  
  if (studentFiles.length === 0) {
    console.log(`   ⚠️  No student files found in cohort ${cohort}`);
    return;
  }

  // Analyze each student
  const students = studentFiles.map(file => {
    try {
      return analyzeStudentForAlerts(file);
    } catch (error) {
      console.error(`   ❌ Error analyzing ${basename(file)}: ${error.message}`);
      return null;
    }
  }).filter(s => s !== null);

  // Print console report
  printAlertReport(cohort, students);

  // Write output file if requested
  if (writeOutput) {
    const alertContent = generateAlertMarkdown(cohort, students);
    const alertPath = join(PROGRESS_ROOT, `ALERTS_${cohort}.md`);
    writeFileSync(alertPath, alertContent, 'utf8');
    console.log(`\n  📄 Alert report written to: progress/ALERTS_${cohort}.md\n`);
  }
}

function main() {
  const args = parseArgs();

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║           EDF Copilot Bootcamp - Alert Checker                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  if (!args.cohort && !args.all) {
    console.error('\n❌ Error: Please specify --cohort "YYYY-MM" or --all\n');
    console.log('Usage:');
    console.log('  npm run progress:alerts -- --cohort "2026-01"');
    console.log('  npm run progress:alerts -- --cohort "2026-01" --output');
    console.log('  npm run progress:alerts -- --all');
    process.exit(1);
  }

  if (args.all) {
    const cohorts = getAllCohorts();
    if (cohorts.length === 0) {
      console.log('\n⚠️  No cohorts found in progress/cohorts/');
      process.exit(0);
    }

    console.log(`\n🔍 Found ${cohorts.length} cohort(s): ${cohorts.join(', ')}`);
    
    for (const cohort of cohorts) {
      checkCohortAlerts(cohort, args.output);
    }
  } else {
    // Validate cohort format
    if (!/^\d{4}-\d{2}$/.test(args.cohort)) {
      console.error('\n❌ Error: Cohort must be in YYYY-MM format (e.g., 2026-01)');
      process.exit(1);
    }

    checkCohortAlerts(args.cohort, args.output);
  }

  console.log('✨ Alert check complete!\n');
}

main();
