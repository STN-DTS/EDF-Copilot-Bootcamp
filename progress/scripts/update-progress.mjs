#!/usr/bin/env node

/**
 * update-progress.mjs
 * 
 * Updates student progress status for labs and sprints.
 * 
 * Usage:
 *   npm run progress:start -- --student "jsmith" --cohort "2026-01" week-01-lab-02
 *   npm run progress:complete -- --student "jsmith" --cohort "2026-01" --pr "42" week-01-lab-02
 *   npm run progress:blocked -- --student "jsmith" --cohort "2026-01" --notes "Issue description" week-01-lab-01
 *   npm run progress:view -- --student "jsmith" --cohort "2026-01"
 * 
 * Commands:
 *   start     Mark a lab as IN_PROGRESS
 *   complete  Mark a lab as COMPLETE
 *   blocked   Mark a lab as BLOCKED
 *   view      View current progress
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROGRESS_ROOT = join(__dirname, '..');

// Status icons and values
const STATUS = {
  NOT_STARTED: '⬜ NOT_STARTED',
  IN_PROGRESS: '🔄 IN_PROGRESS',
  COMPLETE: '✅ COMPLETE',
  BLOCKED: '🚫 BLOCKED'
};

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates lab ID format.
 * @param {string} labId - Lab ID to validate
 * @returns {{ valid: boolean, error?: string, type?: string, week?: number, lab?: number, sprint?: number, step?: number }}
 */
function validateLabId(labId) {
  if (!labId) {
    return { valid: false, error: 'Lab ID is required' };
  }
  
  // Week lab format: week-XX-lab-XX (e.g., week-01-lab-02)
  const weekLabMatch = labId.match(/^week-0([1-4])-lab-0([0-6])$/);
  if (weekLabMatch) {
    return { 
      valid: true, 
      type: 'week',
      week: parseInt(weekLabMatch[1], 10),
      lab: parseInt(weekLabMatch[2], 10)
    };
  }
  
  // Sprint step format: sprint-XX-step-XX (e.g., sprint-01-step-01)
  const sprintStepMatch = labId.match(/^sprint-0([1-4])-step-0([1-9])$/);
  if (sprintStepMatch) {
    return { 
      valid: true, 
      type: 'sprint',
      sprint: parseInt(sprintStepMatch[1], 10),
      step: parseInt(sprintStepMatch[2], 10)
    };
  }
  
  return { 
    valid: false, 
    error: 'Lab ID must be in format: week-XX-lab-XX (e.g., week-01-lab-02) or sprint-XX-step-XX (e.g., sprint-01-step-01)' 
  };
}

/**
 * Validates cohort format.
 * @param {string} cohort - Cohort identifier
 * @returns {{ valid: boolean, error?: string }}
 */
function validateCohort(cohort) {
  if (!cohort) {
    return { valid: false, error: 'Cohort is required (--cohort)' };
  }
  
  if (!/^\d{4}-\d{2}$/.test(cohort)) {
    return { valid: false, error: 'Cohort must be in YYYY-MM format (e.g., 2026-01)' };
  }
  
  return { valid: true };
}

// ============================================================================
// Argument Parsing
// ============================================================================

/**
 * Parses command line arguments.
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    command: null,
    student: null,
    cohort: null,
    labId: null,
    pr: null,
    notes: null
  };
  
  // First non-flag argument is the command
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--student' && args[i + 1]) {
      parsed.student = args[++i];
    } else if (arg === '--cohort' && args[i + 1]) {
      parsed.cohort = args[++i];
    } else if (arg === '--pr' && args[i + 1]) {
      parsed.pr = args[++i];
    } else if (arg === '--notes' && args[i + 1]) {
      parsed.notes = args[++i];
    } else if (!arg.startsWith('--')) {
      // Positional arguments
      if (!parsed.command) {
        parsed.command = arg;
      } else if (!parsed.labId) {
        parsed.labId = arg;
      }
    }
  }
  
  return parsed;
}

// ============================================================================
// File Operations
// ============================================================================

/**
 * Gets the path to a student's progress file.
 * @param {string} cohort - Cohort identifier
 * @param {string} student - GitHub username
 * @returns {string} Full path to student file
 */
function getStudentFilePath(cohort, student) {
  return join(PROGRESS_ROOT, 'cohorts', cohort, `${student}.md`);
}

/**
 * Reads a student's progress file.
 * @param {string} filePath - Path to the file
 * @returns {string|null} File contents or null if not found
 */
function readStudentFile(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  return readFileSync(filePath, 'utf-8');
}

/**
 * Gets the lab name from lab ID.
 * @param {Object} labInfo - Parsed lab ID info
 * @returns {string} Lab display name
 */
function getLabDisplayName(labInfo) {
  if (labInfo.type === 'week') {
    const labNames = [
      'Lab 0: Setup Verification',
      'Lab 1: Plan Only',
      'Lab 2: Scaffold Vertical Slice',
      'Lab 3: Tests First',
      'Lab 4: Guarded Refactor',
      'Lab 5: OpenShift Readiness',
      'Lab 6: Capstone Mini-Feature'
    ];
    return labNames[labInfo.lab] || `Lab ${labInfo.lab}`;
  } else if (labInfo.type === 'sprint') {
    const stepNames = {
      1: { 1: 'Step 1: Project Setup', 2: 'Step 2: Domain Model', 3: 'Step 3: API Scaffold', 4: 'Step 4: Integration', 5: 'Step 5: Review' },
      2: { 1: 'Step 1: Requirements Analysis', 2: 'Step 2: NFR Implementation', 3: 'Step 3: Performance Testing', 4: 'Step 4: Documentation', 5: 'Step 5: Review' },
      3: { 1: 'Step 1: Security Audit', 2: 'Step 2: Vulnerability Fix', 3: 'Step 3: Auth Implementation', 4: 'Step 4: Hardening', 5: 'Step 5: Review' },
      4: { 1: 'Step 1: UI Polish', 2: 'Step 2: Error Handling', 3: 'Step 3: Final Testing', 4: 'Step 4: Deployment', 5: 'Step 5: Retrospective' }
    };
    return stepNames[labInfo.sprint]?.[labInfo.step] || `Step ${labInfo.step}`;
  }
  return 'Unknown';
}

/**
 * Finds and updates a lab row in the markdown content.
 * @param {string} content - Markdown file content
 * @param {Object} labInfo - Parsed lab ID info
 * @param {string} newStatus - New status value
 * @param {Object} options - Additional options (pr, notes, timestamp)
 * @returns {{ content: string, found: boolean }}
 */
function updateLabRow(content, labInfo, newStatus, options = {}) {
  const lines = content.split('\n');
  const labName = getLabDisplayName(labInfo);
  const timestamp = new Date().toISOString().split('T')[0];
  
  let found = false;
  let sectionFound = false;
  
  // Determine which section to look for
  let targetSection = '';
  if (labInfo.type === 'week') {
    targetSection = `## 📅 Week ${labInfo.week}`;
  } else if (labInfo.type === 'sprint') {
    targetSection = `## 🏃 Sprint ${labInfo.sprint}`;
  }
  
  const updatedLines = lines.map((line, index) => {
    // Track when we enter the target section
    if (line.includes(targetSection)) {
      sectionFound = true;
    }
    
    // If we're in a new section, stop looking
    if (sectionFound && line.startsWith('## ') && !line.includes(targetSection)) {
      sectionFound = false;
    }
    
    // Look for the lab row in the correct section
    if (sectionFound && line.startsWith('|') && !line.includes('Status')) {
      const cells = line.split('|').map(c => c.trim());
      const labCell = cells[1] || '';
      const normalizedLabCell = labCell.replace(/\s+/g, ' ').trim();
      const normalizedTarget = labName.replace(/\s+/g, ' ').trim();

      if (normalizedLabCell === normalizedTarget) {
        found = true;
        
        // Update cells based on command
        // Format: | Lab Name | Status | Started | Completed | Duration | PR | Facilitator |
        if (cells.length >= 7) {
          cells[2] = ` ${newStatus} `; // Status
          
          if (newStatus === STATUS.IN_PROGRESS) {
            cells[3] = ` ${timestamp} `; // Started
          } else if (newStatus === STATUS.COMPLETE) {
            if (cells[3].trim() === '-') {
              cells[3] = ` ${timestamp} `; // Started (if not already set)
            }
            cells[4] = ` ${timestamp} `; // Completed
            
            // Calculate duration if we have both dates
            const startDate = cells[3].trim();
            if (startDate !== '-') {
              const start = new Date(startDate);
              const end = new Date(timestamp);
              const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
              cells[5] = ` ${days}d `; // Duration
            }
            
            if (options.pr) {
              cells[6] = ` [#${options.pr}](../../pulls/${options.pr}) `; // PR
            }
          } else if (newStatus === STATUS.BLOCKED) {
            if (cells[3].trim() === '-') {
              cells[3] = ` ${timestamp} `; // Started
            }
          }
          
          return cells.join('|');
        }
      }
    }
    
    return line;
  });
  
  // Update the "Last Updated" line if found
  const lastUpdatedIndex = updatedLines.findIndex(line => line.includes('> **Last Updated:**'));
  if (lastUpdatedIndex !== -1) {
    updatedLines[lastUpdatedIndex] = `> **Last Updated:** ${timestamp}`;
  }
  
  return {
    content: updatedLines.join('\n'),
    found
  };
}

/**
 * Adds a blocker entry to the blockers log.
 * @param {string} content - Markdown file content
 * @param {Object} labInfo - Parsed lab ID info
 * @param {string} notes - Blocker notes
 * @returns {string} Updated content
 */
function addBlockerEntry(content, labInfo, notes) {
  const timestamp = new Date().toISOString().split('T')[0];
  const labName = getLabDisplayName(labInfo);
  const labId = labInfo.type === 'week' 
    ? `week-0${labInfo.week}-lab-0${labInfo.lab}`
    : `sprint-0${labInfo.sprint}-step-0${labInfo.step}`;
  
  const blockerEntry = `| ${timestamp} | ${labId} | ${notes} | 🚫 OPEN | - |`;
  
  // Find the blockers section and add entry
  const lines = content.split('\n');
  let inBlockersSection = false;
  let insertIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('## 🚫 Blockers Log')) {
      inBlockersSection = true;
    }
    if (inBlockersSection && lines[i].startsWith('| -')) {
      // Replace the placeholder row
      lines[i] = blockerEntry;
      insertIndex = i;
      break;
    }
    if (inBlockersSection && lines[i].startsWith('---') && i > 0) {
      // Insert before the section divider
      lines.splice(i, 0, blockerEntry);
      insertIndex = i;
      break;
    }
  }
  
  return lines.join('\n');
}

/**
 * Calculates and returns progress statistics.
 * @param {string} content - Markdown file content
 * @returns {Object} Progress statistics
 */
function calculateStats(content) {
  const stats = {
    total: 0,
    complete: 0,
    inProgress: 0,
    blocked: 0,
    notStarted: 0,
    weekProgress: [0, 0, 0, 0],
    sprintProgress: [0, 0, 0, 0]
  };
  
  const lines = content.split('\n');
  let currentWeek = 0;
  let currentSprint = 0;
  
  lines.forEach(line => {
    // Track current section
    const weekMatch = line.match(/## 📅 Week (\d)/);
    if (weekMatch) {
      currentWeek = parseInt(weekMatch[1], 10);
      currentSprint = 0;
    }
    
    const sprintMatch = line.match(/## 🏃 Sprint (\d)/);
    if (sprintMatch) {
      currentSprint = parseInt(sprintMatch[1], 10);
      currentWeek = 0;
    }
    
    // Count statuses in table rows
    if (line.startsWith('|') && !line.includes('---') && !line.includes('Status')) {
      if (line.includes('✅ COMPLETE')) {
        stats.complete++;
        stats.total++;
        if (currentWeek) stats.weekProgress[currentWeek - 1]++;
        if (currentSprint) stats.sprintProgress[currentSprint - 1]++;
      } else if (line.includes('🔄 IN_PROGRESS')) {
        stats.inProgress++;
        stats.total++;
      } else if (line.includes('🚫 BLOCKED')) {
        stats.blocked++;
        stats.total++;
      } else if (line.includes('⬜ NOT_STARTED')) {
        stats.notStarted++;
        stats.total++;
      }
    }
  });
  
  return stats;
}

// ============================================================================
// Commands
// ============================================================================

/**
 * Handles the 'start' command.
 */
function handleStart(args) {
  const filePath = getStudentFilePath(args.cohort, args.student);
  const content = readStudentFile(filePath);
  
  if (!content) {
    console.error(`❌ Error: Student file not found at ${filePath}`);
    console.error('   Initialize first: npm run progress:init -- --name "..." --github "..." --cohort "..." --track "..."');
    process.exit(1);
  }
  
  const labValidation = validateLabId(args.labId);
  if (!labValidation.valid) {
    console.error(`❌ Error: ${labValidation.error}`);
    process.exit(1);
  }
  
  const result = updateLabRow(content, labValidation, STATUS.IN_PROGRESS);
  
  if (!result.found) {
    console.error(`❌ Error: Lab "${args.labId}" not found in progress file`);
    process.exit(1);
  }
  
  writeFileSync(filePath, result.content, 'utf-8');
  
  console.log(`✅ Lab started: ${args.labId}`);
  console.log(`   Status: ${STATUS.IN_PROGRESS}`);
  console.log(`   Student: @${args.student}`);
}

/**
 * Handles the 'complete' command.
 */
function handleComplete(args) {
  const filePath = getStudentFilePath(args.cohort, args.student);
  const content = readStudentFile(filePath);
  
  if (!content) {
    console.error(`❌ Error: Student file not found at ${filePath}`);
    process.exit(1);
  }
  
  const labValidation = validateLabId(args.labId);
  if (!labValidation.valid) {
    console.error(`❌ Error: ${labValidation.error}`);
    process.exit(1);
  }
  
  const result = updateLabRow(content, labValidation, STATUS.COMPLETE, { pr: args.pr });
  
  if (!result.found) {
    console.error(`❌ Error: Lab "${args.labId}" not found in progress file`);
    process.exit(1);
  }
  
  writeFileSync(filePath, result.content, 'utf-8');
  
  console.log(`✅ Lab completed: ${args.labId}`);
  console.log(`   Status: ${STATUS.COMPLETE}`);
  console.log(`   Student: @${args.student}`);
  if (args.pr) {
    console.log(`   PR: #${args.pr}`);
  }
}

/**
 * Handles the 'blocked' command.
 */
function handleBlocked(args) {
  if (!args.notes) {
    console.error('❌ Error: --notes is required for blocked status');
    process.exit(1);
  }
  
  const filePath = getStudentFilePath(args.cohort, args.student);
  let content = readStudentFile(filePath);
  
  if (!content) {
    console.error(`❌ Error: Student file not found at ${filePath}`);
    process.exit(1);
  }
  
  const labValidation = validateLabId(args.labId);
  if (!labValidation.valid) {
    console.error(`❌ Error: ${labValidation.error}`);
    process.exit(1);
  }
  
  // Update lab status
  const result = updateLabRow(content, labValidation, STATUS.BLOCKED);
  
  if (!result.found) {
    console.error(`❌ Error: Lab "${args.labId}" not found in progress file`);
    process.exit(1);
  }
  
  // Add blocker entry
  content = addBlockerEntry(result.content, labValidation, args.notes);
  
  writeFileSync(filePath, content, 'utf-8');
  
  console.log(`🚫 Lab blocked: ${args.labId}`);
  console.log(`   Status: ${STATUS.BLOCKED}`);
  console.log(`   Student: @${args.student}`);
  console.log(`   Notes: ${args.notes}`);
}

/**
 * Handles the 'view' command.
 */
function handleView(args) {
  const filePath = getStudentFilePath(args.cohort, args.student);
  const content = readStudentFile(filePath);
  
  if (!content) {
    console.error(`❌ Error: Student file not found at ${filePath}`);
    process.exit(1);
  }
  
  const stats = calculateStats(content);
  const completionPercent = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;
  
  console.log(`
📊 Progress Summary for @${args.student}
${'═'.repeat(50)}

📈 Overall Progress
   Complete:    ${stats.complete} / ${stats.total} (${completionPercent}%)
   In Progress: ${stats.inProgress}
   Blocked:     ${stats.blocked}
   Not Started: ${stats.notStarted}

📅 Week Progress
   Week 1: ${stats.weekProgress[0]} / 7 complete
   Week 2: ${stats.weekProgress[1]} / 7 complete
   Week 3: ${stats.weekProgress[2]} / 7 complete
   Week 4: ${stats.weekProgress[3]} / 7 complete

🏃 Sprint Progress
   Sprint 1: ${stats.sprintProgress[0]} / 5 complete
   Sprint 2: ${stats.sprintProgress[1]} / 5 complete
   Sprint 3: ${stats.sprintProgress[2]} / 5 complete
   Sprint 4: ${stats.sprintProgress[3]} / 5 complete

📄 Full Progress File: ${filePath}
`);
}

// ============================================================================
// Main
// ============================================================================

/**
 * Displays usage information.
 */
function showUsage() {
  console.log(`
📊 Student Progress Update

Usage:
  npm run progress:start -- --student "<username>" --cohort "<YYYY-MM>" <lab-id>
  npm run progress:complete -- --student "<username>" --cohort "<YYYY-MM>" [--pr "<#>"] <lab-id>
  npm run progress:blocked -- --student "<username>" --cohort "<YYYY-MM>" --notes "<description>" <lab-id>
  npm run progress:view -- --student "<username>" --cohort "<YYYY-MM>"

Commands:
  start      Mark a lab as IN_PROGRESS
  complete   Mark a lab as COMPLETE (optionally with PR link)
  blocked    Mark a lab as BLOCKED (requires notes)
  view       View current progress summary

Lab ID Formats:
  week-XX-lab-XX    e.g., week-01-lab-02
  sprint-XX-step-XX e.g., sprint-01-step-01

Examples:
  npm run progress:start -- --student "jsmith" --cohort "2026-01" week-01-lab-02
  npm run progress:complete -- --student "jsmith" --cohort "2026-01" --pr "42" week-01-lab-02
  npm run progress:blocked -- --student "jsmith" --cohort "2026-01" --notes "Docker issue" week-01-lab-00
  npm run progress:view -- --student "jsmith" --cohort "2026-01"
`);
}

/**
 * Main execution function.
 */
function main() {
  const args = parseArgs();
  
  // Check if help is requested
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showUsage();
    process.exit(0);
  }
  
  // Validate command
  const validCommands = ['start', 'complete', 'blocked', 'view'];
  if (!args.command || !validCommands.includes(args.command)) {
    console.error(`❌ Error: Invalid command. Must be one of: ${validCommands.join(', ')}`);
    showUsage();
    process.exit(1);
  }
  
  // Validate required arguments
  if (!args.student) {
    console.error('❌ Error: --student is required');
    process.exit(1);
  }
  
  const cohortValidation = validateCohort(args.cohort);
  if (!cohortValidation.valid) {
    console.error(`❌ Error: ${cohortValidation.error}`);
    process.exit(1);
  }
  
  // Validate labId for non-view commands
  if (args.command !== 'view' && !args.labId) {
    console.error('❌ Error: Lab ID is required');
    process.exit(1);
  }
  
  // Execute command
  switch (args.command) {
    case 'start':
      handleStart(args);
      break;
    case 'complete':
      handleComplete(args);
      break;
    case 'blocked':
      handleBlocked(args);
      break;
    case 'view':
      handleView(args);
      break;
  }
}

// Export validation functions
export { validateLabId, validateCohort };

// Run main function
main();
