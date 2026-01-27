#!/usr/bin/env node

/**
 * init-student.mjs
 * 
 * Initializes a new student progress file from the template.
 * 
 * Usage:
 *   npm run progress:init -- --name "Jane Smith" --github "jsmith" --cohort "2026-01" --track "backend"
 * 
 * Options:
 *   --name        Student's full name (required)
 *   --github      GitHub username (required)
 *   --cohort      Cohort identifier in YYYY-MM format (required)
 *   --track       Learning track: frontend or backend (required)
 *   --facilitator Assigned facilitator name (optional)
 *   --force       Overwrite existing file (optional flag)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROGRESS_ROOT = join(__dirname, '..');

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates GitHub username format.
 * Rules: 1-39 characters, alphanumeric + hyphens, no leading/trailing hyphens
 * @param {string} username - GitHub username to validate
 * @returns {{ valid: boolean, error?: string }}
 */
function validateUsername(username) {
  if (!username) {
    return { valid: false, error: 'GitHub username is required' };
  }
  
  if (username.length < 1 || username.length > 39) {
    return { valid: false, error: 'GitHub username must be 1-39 characters' };
  }
  
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username) && username.length > 1) {
    return { valid: false, error: 'GitHub username can only contain alphanumeric characters and hyphens, no leading/trailing hyphens' };
  }
  
  if (username.length === 1 && !/^[a-zA-Z0-9]$/.test(username)) {
    return { valid: false, error: 'Single character GitHub username must be alphanumeric' };
  }
  
  if (username.includes('--')) {
    return { valid: false, error: 'GitHub username cannot contain consecutive hyphens' };
  }
  
  return { valid: true };
}

/**
 * Validates cohort format.
 * @param {string} cohort - Cohort identifier to validate (YYYY-MM)
 * @returns {{ valid: boolean, error?: string }}
 */
function validateCohort(cohort) {
  if (!cohort) {
    return { valid: false, error: 'Cohort is required' };
  }
  
  if (!/^\d{4}-\d{2}$/.test(cohort)) {
    return { valid: false, error: 'Cohort must be in YYYY-MM format (e.g., 2026-01)' };
  }
  
  const [year, month] = cohort.split('-').map(Number);
  
  if (year < 2020 || year > 2100) {
    return { valid: false, error: 'Cohort year must be between 2020 and 2100' };
  }
  
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Cohort month must be between 01 and 12' };
  }
  
  return { valid: true };
}

/**
 * Validates track selection.
 * @param {string} track - Track to validate
 * @returns {{ valid: boolean, error?: string }}
 */
function validateTrack(track) {
  if (!track) {
    return { valid: false, error: 'Track is required' };
  }
  
  const validTracks = ['frontend', 'backend'];
  if (!validTracks.includes(track.toLowerCase())) {
    return { valid: false, error: `Track must be one of: ${validTracks.join(', ')}` };
  }
  
  return { valid: true };
}

/**
 * Validates lab ID format.
 * @param {string} labId - Lab ID to validate
 * @returns {{ valid: boolean, error?: string }}
 */
function validateLabId(labId) {
  if (!labId) {
    return { valid: false, error: 'Lab ID is required' };
  }
  
  // Week lab format: week-XX-lab-XX (e.g., week-01-lab-02)
  const weekLabPattern = /^week-0[1-4]-lab-0[0-6]$/;
  
  // Sprint step format: sprint-XX-step-XX (e.g., sprint-01-step-01)
  const sprintStepPattern = /^sprint-0[1-4]-step-0[1-9]$/;
  
  if (!weekLabPattern.test(labId) && !sprintStepPattern.test(labId)) {
    return { 
      valid: false, 
      error: 'Lab ID must be in format: week-XX-lab-XX (e.g., week-01-lab-02) or sprint-XX-step-XX (e.g., sprint-01-step-01)' 
    };
  }
  
  return { valid: true };
}

/**
 * Checks if a student file already exists.
 * @param {string} cohort - Cohort identifier
 * @param {string} github - GitHub username
 * @returns {{ exists: boolean, path: string }}
 */
function checkExistingStudent(cohort, github) {
  const studentPath = join(PROGRESS_ROOT, 'cohorts', cohort, `${github}.md`);
  return {
    exists: existsSync(studentPath),
    path: studentPath
  };
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
    name: null,
    github: null,
    cohort: null,
    track: null,
    facilitator: null,
    force: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--force') {
      parsed.force = true;
    } else if (arg === '--name' && args[i + 1]) {
      parsed.name = args[++i];
    } else if (arg === '--github' && args[i + 1]) {
      parsed.github = args[++i];
    } else if (arg === '--cohort' && args[i + 1]) {
      parsed.cohort = args[++i];
    } else if (arg === '--track' && args[i + 1]) {
      parsed.track = args[++i];
    } else if (arg === '--facilitator' && args[i + 1]) {
      parsed.facilitator = args[++i];
    }
  }
  
  return parsed;
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Displays usage information.
 */
function showUsage() {
  console.log(`
📊 Student Progress Initialization

Usage:
  npm run progress:init -- --name "<name>" --github "<username>" --cohort "<YYYY-MM>" --track "<track>" [options]

Required Arguments:
  --name        Student's full name (e.g., "Jane Smith")
  --github      GitHub username (e.g., "jsmith")
  --cohort      Cohort identifier in YYYY-MM format (e.g., "2026-01")
  --track       Learning track: "frontend" or "backend"

Optional Arguments:
  --facilitator Assigned facilitator name
  --force       Overwrite existing student file

Examples:
  npm run progress:init -- --name "Jane Smith" --github "jsmith" --cohort "2026-01" --track "backend"
  npm run progress:init -- --name "Jane Smith" --github "jsmith" --cohort "2026-01" --track "frontend" --facilitator "John Doe"
  npm run progress:init -- --name "Jane Smith" --github "jsmith" --cohort "2026-01" --track "backend" --force
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
  
  console.log('📊 Initializing Student Progress File...\n');
  
  // Validate required arguments
  if (!args.name) {
    console.error('❌ Error: --name is required');
    showUsage();
    process.exit(1);
  }
  
  // Validate GitHub username
  const usernameValidation = validateUsername(args.github);
  if (!usernameValidation.valid) {
    console.error(`❌ Error: ${usernameValidation.error}`);
    process.exit(1);
  }
  
  // Validate cohort
  const cohortValidation = validateCohort(args.cohort);
  if (!cohortValidation.valid) {
    console.error(`❌ Error: ${cohortValidation.error}`);
    process.exit(1);
  }
  
  // Validate track
  const trackValidation = validateTrack(args.track);
  if (!trackValidation.valid) {
    console.error(`❌ Error: ${trackValidation.error}`);
    process.exit(1);
  }
  
  // Check for existing student
  const existingCheck = checkExistingStudent(args.cohort, args.github);
  if (existingCheck.exists && !args.force) {
    console.error(`❌ Error: Student file already exists at ${existingCheck.path}`);
    console.error('   Use --force to overwrite');
    process.exit(1);
  }
  
  // Read template
  const templatePath = join(PROGRESS_ROOT, '.template', 'STUDENT_PROGRESS.md');
  if (!existsSync(templatePath)) {
    console.error(`❌ Error: Template not found at ${templatePath}`);
    process.exit(1);
  }
  
  let template = readFileSync(templatePath, 'utf-8');
  
  // Get current date
  const today = new Date().toISOString().split('T')[0];
  
  // Replace placeholders
  template = template.replace(/\{\{STUDENT_NAME\}\}/g, args.name);
  template = template.replace(/\{\{GITHUB_USERNAME\}\}/g, args.github);
  template = template.replace(/\{\{COHORT\}\}/g, args.cohort);
  template = template.replace(/\{\{TRACK\}\}/g, args.track.charAt(0).toUpperCase() + args.track.slice(1));
  template = template.replace(/\{\{START_DATE\}\}/g, today);
  template = template.replace(/\{\{FACILITATOR\}\}/g, args.facilitator || 'TBD');
  
  // Create cohort directory if needed
  const cohortDir = join(PROGRESS_ROOT, 'cohorts', args.cohort);
  if (!existsSync(cohortDir)) {
    mkdirSync(cohortDir, { recursive: true });
    console.log(`📁 Created cohort directory: ${cohortDir}`);
  }
  
  // Write student file
  const studentPath = join(cohortDir, `${args.github}.md`);
  writeFileSync(studentPath, template, 'utf-8');
  
  console.log(`✅ Student progress file created successfully!`);
  console.log(`\n📄 File: ${studentPath}`);
  console.log(`\n📋 Summary:`);
  console.log(`   Name:        ${args.name}`);
  console.log(`   GitHub:      @${args.github}`);
  console.log(`   Cohort:      ${args.cohort}`);
  console.log(`   Track:       ${args.track}`);
  console.log(`   Facilitator: ${args.facilitator || 'TBD'}`);
  console.log(`   Start Date:  ${today}`);
  console.log(`\n🚀 Next steps:`);
  console.log(`   1. Start Lab 0: npm run progress:start -- --student "${args.github}" --cohort "${args.cohort}" week-01-lab-00`);
  console.log(`   2. Complete Lab 0: npm run progress:complete -- --student "${args.github}" --cohort "${args.cohort}" week-01-lab-00`);
}

// Export validation functions for use by update-progress.mjs
export { validateUsername, validateCohort, validateTrack, validateLabId, checkExistingStudent };

// Run main function
main();
