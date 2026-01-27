#!/usr/bin/env node

/**
 * generate-dashboard.mjs
 * 
 * Generates a facilitator dashboard for cohort progress tracking.
 * 
 * Usage:
 *   npm run progress:dashboard -- --cohort "2026-01"
 *   npm run progress:dashboard -- --all
 * 
 * Options:
 *   --cohort   Specific cohort to generate dashboard for (YYYY-MM format)
 *   --all      Generate dashboards for all cohorts
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

// Get script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROGRESS_ROOT = join(__dirname, '..');

// Status patterns for parsing student files
const STATUS_PATTERNS = {
  COMPLETE: /✅\s*COMPLETE/,
  IN_PROGRESS: /🔄\s*IN_PROGRESS/,
  BLOCKED: /🚫\s*BLOCKED/,
  NOT_STARTED: /⬜\s*NOT_STARTED/
};

// Week and Sprint sections to analyze
const SECTIONS = {
  W1: '## 📅 Week 1:',
  W2: '## 📅 Week 2:',
  W3: '## 📅 Week 3:',
  W4: '## 📅 Week 4:',
  S1: '## 🏃 Sprint 1:',
  S2: '## 🏃 Sprint 2:',
  S3: '## 🏃 Sprint 3:',
  S4: '## 🏃 Sprint 4:'
};

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    cohort: null,
    all: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--cohort':
        result.cohort = args[++i];
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
    github: 'unknown',
    track: 'unknown',
    startDate: null,
    lastUpdated: null
  };

  // Extract name
  const nameMatch = content.match(/\*\*Name\*\*\s*\|\s*([^\|]+)/);
  if (nameMatch) info.name = nameMatch[1].trim();

  // Extract GitHub username
  const githubMatch = content.match(/\*\*GitHub\*\*\s*\|\s*\[@([^\]]+)\]/);
  if (githubMatch) info.github = githubMatch[1];

  // Extract track
  const trackMatch = content.match(/\*\*Track\*\*\s*\|\s*([^\|]+)/);
  if (trackMatch) info.track = trackMatch[1].trim();

  // Extract start date
  const startMatch = content.match(/\*\*Start Date\*\*\s*\|\s*([^\|]+)/);
  if (startMatch) info.startDate = startMatch[1].trim();

  // Extract last updated
  const lastUpdatedMatch = content.match(/\*\*Last Updated:\*\*\s*([^\n]+)/);
  if (lastUpdatedMatch) info.lastUpdated = lastUpdatedMatch[1].trim();

  return info;
}

/**
 * Analyzes a section of the progress file for status counts.
 * @param {string} content - File content
 * @param {string} sectionStart - Section header to find
 * @returns {object} Status counts for the section
 */
function analyzeSection(content, sectionStart) {
  const stats = {
    complete: 0,
    inProgress: 0,
    blocked: 0,
    notStarted: 0,
    total: 0
  };

  const sectionIndex = content.indexOf(sectionStart);
  if (sectionIndex === -1) return stats;

  // Find the next section or end of content
  const nextSectionIndex = content.indexOf('\n## ', sectionIndex + 1);
  const sectionContent = nextSectionIndex !== -1 
    ? content.slice(sectionIndex, nextSectionIndex)
    : content.slice(sectionIndex);

  // Count each status type in table rows
  const lines = sectionContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('|') && !line.includes('---') && !line.includes('Status')) {
      stats.total++;
      if (STATUS_PATTERNS.COMPLETE.test(line)) {
        stats.complete++;
      } else if (STATUS_PATTERNS.IN_PROGRESS.test(line)) {
        stats.inProgress++;
      } else if (STATUS_PATTERNS.BLOCKED.test(line)) {
        stats.blocked++;
      } else if (STATUS_PATTERNS.NOT_STARTED.test(line)) {
        stats.notStarted++;
      }
    }
  }

  return stats;
}

/**
 * Detects blockers from the file content.
 * @param {string} content - File content
 * @returns {string[]} Array of blocker descriptions
 */
function detectBlockers(content) {
  const blockers = [];

  // Find blocked items in any section
  const lines = content.split('\n');
  for (const line of lines) {
    if (STATUS_PATTERNS.BLOCKED.test(line) && line.startsWith('|')) {
      // Extract lab/step name from the line
      const parts = line.split('|').map(p => p.trim());
      if (parts.length > 1 && parts[1]) {
        blockers.push(parts[1]);
      }
    }
  }

  return blockers;
}

/**
 * Determines current position based on first incomplete item.
 * @param {object} sectionStats - Object with section statistics
 * @returns {string} Current position description
 */
function getCurrentPosition(sectionStats) {
  const sections = ['W1', 'W2', 'W3', 'W4', 'S1', 'S2', 'S3', 'S4'];
  
  for (const section of sections) {
    const stats = sectionStats[section];
    if (stats && (stats.inProgress > 0 || stats.blocked > 0)) {
      const type = section.startsWith('W') ? 'Week' : 'Sprint';
      const num = section.charAt(1);
      return `${type} ${num}`;
    }
  }

  // If all in progress are done, find first not started
  for (const section of sections) {
    const stats = sectionStats[section];
    if (stats && stats.notStarted > 0 && stats.total > 0) {
      const type = section.startsWith('W') ? 'Week' : 'Sprint';
      const num = section.charAt(1);
      return `${type} ${num}`;
    }
  }

  return 'Complete ✨';
}

/**
 * Analyzes a student progress file.
 * @param {string} filePath - Path to the student file
 * @returns {object} Analysis result
 */
function analyzeStudentFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const info = extractStudentInfo(content);
  
  // Analyze each section
  const sectionStats = {};
  for (const [key, header] of Object.entries(SECTIONS)) {
    sectionStats[key] = analyzeSection(content, header);
  }

  // Calculate totals
  let totalComplete = 0;
  let totalInProgress = 0;
  let totalBlocked = 0;
  let totalNotStarted = 0;
  let totalItems = 0;

  for (const stats of Object.values(sectionStats)) {
    totalComplete += stats.complete;
    totalInProgress += stats.inProgress;
    totalBlocked += stats.blocked;
    totalNotStarted += stats.notStarted;
    totalItems += stats.total;
  }

  // Get file modification time
  const fileStats = statSync(filePath);
  const lastModified = fileStats.mtime;

  return {
    ...info,
    filePath,
    sectionStats,
    totalComplete,
    totalInProgress,
    totalBlocked,
    totalNotStarted,
    totalItems,
    progress: totalItems > 0 ? Math.round((totalComplete / totalItems) * 100) : 0,
    blockers: detectBlockers(content),
    currentPosition: getCurrentPosition(sectionStats),
    lastModified
  };
}

// ============================================================================
// Dashboard Generation
// ============================================================================

/**
 * Gets section status icon.
 * @param {object} stats - Section statistics
 * @returns {string} Status icon
 */
function getSectionIcon(stats) {
  if (!stats || stats.total === 0) return '⚪';
  if (stats.blocked > 0) return '🔴';
  if (stats.complete === stats.total) return '🟢';
  if (stats.complete > 0 || stats.inProgress > 0) return '🟡';
  return '⚪';
}

/**
 * Generates the dashboard markdown for a cohort.
 * @param {string} cohort - Cohort identifier
 * @param {object[]} students - Array of analyzed student data
 * @returns {string} Dashboard markdown content
 */
function generateDashboardMarkdown(cohort, students) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  
  // Calculate cohort statistics
  const totalStudents = students.length;
  const avgProgress = totalStudents > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / totalStudents)
    : 0;
  const completedStudents = students.filter(s => s.progress === 100).length;
  const blockedStudents = students.filter(s => s.totalBlocked > 0).length;
  const activeStudents = students.filter(s => s.totalInProgress > 0).length;

  let md = `# 📊 Facilitator Dashboard: Cohort ${cohort}

> **Generated:** ${timestamp}  
> **Auto-refresh:** Daily at 6:00 AM UTC

---

## 📈 Cohort Statistics

| Metric | Value |
|--------|-------|
| **Total Students** | ${totalStudents} |
| **Average Progress** | ${avgProgress}% |
| **Completion Rate** | ${totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0}% |
| **Active (In Progress)** | ${activeStudents} |
| **Blocked** | ${blockedStudents} |
| **Completed** | ${completedStudents} |

---

## 👥 Student Progress Overview

| Student | Track | W1 | W2 | W3 | W4 | S1 | S2 | S3 | S4 | Progress | Current Position | Blockers |
|---------|-------|----|----|----|----|----|----|----|----|----------|------------------|----------|
`;

  // Sort students by progress (descending), then by name
  const sortedStudents = [...students].sort((a, b) => {
    if (b.progress !== a.progress) return b.progress - a.progress;
    return a.name.localeCompare(b.name);
  });

  for (const student of sortedStudents) {
    const stats = student.sectionStats;
    const blockerCount = student.blockers.length;
    const blockerText = blockerCount > 0 ? `🔴 ${blockerCount}` : '—';
    
    md += `| [${student.name}](cohorts/${cohort}/${student.github}.md) | ${student.track} `;
    md += `| ${getSectionIcon(stats.W1)} | ${getSectionIcon(stats.W2)} `;
    md += `| ${getSectionIcon(stats.W3)} | ${getSectionIcon(stats.W4)} `;
    md += `| ${getSectionIcon(stats.S1)} | ${getSectionIcon(stats.S2)} `;
    md += `| ${getSectionIcon(stats.S3)} | ${getSectionIcon(stats.S4)} `;
    md += `| ${student.progress}% | ${student.currentPosition} | ${blockerText} |\n`;
  }

  // Add legend
  md += `
### Legend
- 🟢 Complete
- 🟡 In Progress
- ⚪ Not Started
- 🔴 Blocked

---

## 🚨 Alerts

`;

  // Blocked students
  const blocked = students.filter(s => s.totalBlocked > 0);
  if (blocked.length > 0) {
    md += `### 🔴 Blocked Students\n\n`;
    for (const student of blocked) {
      md += `- **${student.name}** (@${student.github}): ${student.blockers.join(', ')}\n`;
    }
    md += '\n';
  } else {
    md += `### 🔴 Blocked Students\n\n_No blocked students._\n\n`;
  }

  // Inactive students (no update in 5+ days)
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  const inactive = students.filter(s => 
    s.lastModified < fiveDaysAgo && s.progress < 100
  );
  
  if (inactive.length > 0) {
    md += `### ⏰ Inactive Students (5+ days without update)\n\n`;
    for (const student of inactive) {
      const daysSince = Math.floor((Date.now() - student.lastModified.getTime()) / (24 * 60 * 60 * 1000));
      md += `- **${student.name}** (@${student.github}): ${daysSince} days since last update\n`;
    }
    md += '\n';
  } else {
    md += `### ⏰ Inactive Students\n\n_All students are active._\n\n`;
  }

  // Add activity section
  md += `---

## 📅 This Week's Activity

`;

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentlyActive = students.filter(s => s.lastModified >= oneWeekAgo);
  
  if (recentlyActive.length > 0) {
    md += `| Student | Last Update | Progress This Week |\n`;
    md += `|---------|-------------|--------------------|\n`;
    
    const sortedByRecent = [...recentlyActive].sort((a, b) => 
      b.lastModified.getTime() - a.lastModified.getTime()
    );
    
    for (const student of sortedByRecent) {
      const lastUpdate = student.lastModified.toISOString().slice(0, 10);
      md += `| ${student.name} | ${lastUpdate} | ${student.progress}% |\n`;
    }
  } else {
    md += `_No activity in the past 7 days._\n`;
  }

  md += `
---

## 📊 Progress Distribution

\`\`\`
Progress Breakdown:
`;

  // Create a simple histogram
  const ranges = [
    { label: '0-25%', min: 0, max: 25 },
    { label: '26-50%', min: 26, max: 50 },
    { label: '51-75%', min: 51, max: 75 },
    { label: '76-99%', min: 76, max: 99 },
    { label: '100%', min: 100, max: 100 }
  ];

  for (const range of ranges) {
    const count = students.filter(s => s.progress >= range.min && s.progress <= range.max).length;
    const bar = '█'.repeat(count);
    md += `${range.label.padEnd(7)} | ${bar} ${count}\n`;
  }

  md += `\`\`\`

---

> **Next Steps:**
> - Review any 🔴 blocked students and provide assistance
> - Check in with inactive students
> - Celebrate 🟢 completions!

---

_Dashboard generated by \`npm run progress:dashboard\`_
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
 * Generates dashboard for a single cohort.
 * @param {string} cohort - Cohort identifier
 */
function generateDashboard(cohort) {
  console.log(`\n📊 Generating dashboard for cohort: ${cohort}`);

  const studentFiles = getStudentFiles(cohort);
  
  if (studentFiles.length === 0) {
    console.log(`   ⚠️  No student files found in cohort ${cohort}`);
    return;
  }

  console.log(`   Found ${studentFiles.length} student(s)`);

  // Analyze each student
  const students = studentFiles.map(file => {
    try {
      return analyzeStudentFile(file);
    } catch (error) {
      console.error(`   ❌ Error analyzing ${basename(file)}: ${error.message}`);
      return null;
    }
  }).filter(s => s !== null);

  // Generate and write dashboard
  const dashboardContent = generateDashboardMarkdown(cohort, students);
  const dashboardPath = join(PROGRESS_ROOT, `DASHBOARD_${cohort}.md`);
  
  writeFileSync(dashboardPath, dashboardContent, 'utf8');
  console.log(`   ✅ Dashboard written to: progress/DASHBOARD_${cohort}.md`);
}

function main() {
  const args = parseArgs();

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║          EDF Copilot Bootcamp - Dashboard Generator            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  if (!args.cohort && !args.all) {
    console.error('\n❌ Error: Please specify --cohort "YYYY-MM" or --all\n');
    console.log('Usage:');
    console.log('  npm run progress:dashboard -- --cohort "2026-01"');
    console.log('  npm run progress:dashboard -- --all');
    process.exit(1);
  }

  if (args.all) {
    const cohorts = getAllCohorts();
    if (cohorts.length === 0) {
      console.log('\n⚠️  No cohorts found in progress/cohorts/');
      console.log('   Create a cohort with: npm run progress:init -- --name "..." --github "..." --cohort "2026-01" --track "..."');
      process.exit(0);
    }

    console.log(`\n🔍 Found ${cohorts.length} cohort(s): ${cohorts.join(', ')}`);
    
    for (const cohort of cohorts) {
      generateDashboard(cohort);
    }
  } else {
    // Validate cohort format
    if (!/^\d{4}-\d{2}$/.test(args.cohort)) {
      console.error('\n❌ Error: Cohort must be in YYYY-MM format (e.g., 2026-01)');
      process.exit(1);
    }

    generateDashboard(args.cohort);
  }

  console.log('\n✨ Dashboard generation complete!\n');
}

main();
