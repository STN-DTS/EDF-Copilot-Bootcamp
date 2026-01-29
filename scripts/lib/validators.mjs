#!/usr/bin/env node
/**
 * validators.mjs - Shared Validation Module
 * 
 * Consolidated validation utilities for bootcamp scripts.
 * This module provides reusable validators for:
 *   - YAML structure validation
 *   - Cohort existence and format validation  
 *   - User progress file validation
 *   - Lab ID format validation
 * 
 * @module scripts/lib/validators
 * @see https://github.com/EDF-Copilot-Bootcamp - Project Repository
 * 
 * Usage:
 *   import { validateLabId, validateCohort, validateCohortExists } from './lib/validators.mjs';
 * 
 *   const result = validateLabId('week-01-lab-02');
 *   if (!result.valid) {
 *     console.error(result.error);
 *   }
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ============================================================================
// Module Configuration
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default paths (can be overridden via options)
const DEFAULT_PROGRESS_ROOT = join(__dirname, '..', '..', 'progress');
const DEFAULT_STEPS_ROOT = join(__dirname, '..', '..', 'bootcamp', 'steps');

// ============================================================================
// Type Definitions (JSDoc)
// ============================================================================

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string} [error] - Error message if validation failed
 */

/**
 * @typedef {Object} LabIdValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string} [error] - Error message if validation failed
 * @property {'week'|'sprint'} [type] - Type of lab (week or sprint)
 * @property {number} [week] - Week number (1-4) for week labs
 * @property {number} [lab] - Lab number (0-6) for week labs
 * @property {number} [sprint] - Sprint number (1-4) for sprint steps
 * @property {number} [step] - Step number (1-9) for sprint steps
 */

/**
 * @typedef {Object} CohortExistsResult
 * @property {boolean} valid - Whether cohort directory exists
 * @property {string} [error] - Error message if validation failed
 * @property {string} [path] - Path to cohort directory
 * @property {number} [studentCount] - Number of student files in cohort
 * @property {string[]} [students] - List of student usernames
 */

/**
 * @typedef {Object} UserProgressResult
 * @property {boolean} valid - Whether user progress file is valid
 * @property {string} [error] - Error message if validation failed
 * @property {string} [path] - Path to user progress file
 * @property {Object} [metadata] - Extracted metadata from file
 * @property {string} [metadata.name] - Student name
 * @property {string} [metadata.github] - GitHub username
 * @property {string} [metadata.track] - Learning track
 * @property {string} [metadata.cohort] - Cohort identifier
 */

/**
 * @typedef {Object} YamlValidationResult
 * @property {boolean} valid - Whether YAML structure is valid
 * @property {string} [error] - Error message if validation failed
 * @property {string[]} [errors] - Array of all validation errors
 * @property {string[]} [warnings] - Array of validation warnings
 * @property {Object} [parsed] - Parsed YAML object if valid
 */

/**
 * @typedef {Object} ValidatorOptions
 * @property {string} [progressRoot] - Custom path to progress directory
 * @property {string} [stepsRoot] - Custom path to bootcamp steps directory
 */

// ============================================================================
// Lab ID Validation
// ============================================================================

/**
 * Validates lab ID format.
 * 
 * Accepts two formats:
 * - Week labs: week-XX-lab-XX (e.g., week-01-lab-02)
 *   - Week: 01-04
 *   - Lab: 00-06
 * - Sprint steps: sprint-XX-step-XX (e.g., sprint-01-step-01)
 *   - Sprint: 01-04
 *   - Step: 01-09
 * 
 * @param {string} labId - Lab ID to validate
 * @returns {LabIdValidationResult} Validation result with parsed components
 * 
 * @example
 * const result = validateLabId('week-01-lab-02');
 * // { valid: true, type: 'week', week: 1, lab: 2 }
 * 
 * @example
 * const result = validateLabId('sprint-02-step-03');
 * // { valid: true, type: 'sprint', sprint: 2, step: 3 }
 * 
 * @example
 * const result = validateLabId('invalid');
 * // { valid: false, error: 'Lab ID must be in format...' }
 */
export function validateLabId(labId) {
  if (!labId) {
    return { valid: false, error: 'Lab ID is required' };
  }

  if (typeof labId !== 'string') {
    return { valid: false, error: 'Lab ID must be a string' };
  }

  const trimmedLabId = labId.trim();

  // Week lab format: week-XX-lab-XX (e.g., week-01-lab-02)
  const weekLabMatch = trimmedLabId.match(/^week-0([1-4])-lab-0([0-6])$/);
  if (weekLabMatch) {
    return {
      valid: true,
      type: 'week',
      week: parseInt(weekLabMatch[1], 10),
      lab: parseInt(weekLabMatch[2], 10)
    };
  }

  // Sprint step format: sprint-XX-step-XX (e.g., sprint-01-step-01)
  const sprintStepMatch = trimmedLabId.match(/^sprint-0([1-4])-step-0([1-9])$/);
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
 * Gets display name for a lab ID.
 * 
 * @param {string} labId - Lab ID to get display name for
 * @returns {string} Human-readable lab name or 'Unknown' if invalid
 * 
 * @example
 * getLabDisplayName('week-01-lab-02');
 * // 'Lab 2: Scaffold Vertical Slice'
 */
export function getLabDisplayName(labId) {
  const result = validateLabId(labId);
  if (!result.valid) {
    return 'Unknown';
  }

  if (result.type === 'week') {
    const labNames = [
      'Lab 0: Setup Verification',
      'Lab 1: Plan Only',
      'Lab 2: Scaffold Vertical Slice',
      'Lab 3: Tests First',
      'Lab 4: Guarded Refactor',
      'Lab 5: OpenShift Readiness',
      'Lab 6: Capstone Mini-Feature'
    ];
    return labNames[result.lab] || `Lab ${result.lab}`;
  }

  if (result.type === 'sprint') {
    const stepNames = {
      1: { 1: 'Step 1: Project Setup', 2: 'Step 2: Domain Model', 3: 'Step 3: API Scaffold', 4: 'Step 4: Integration', 5: 'Step 5: Review' },
      2: { 1: 'Step 1: Requirements Analysis', 2: 'Step 2: NFR Implementation', 3: 'Step 3: Performance Testing', 4: 'Step 4: Documentation', 5: 'Step 5: Review' },
      3: { 1: 'Step 1: Security Audit', 2: 'Step 2: Vulnerability Fix', 3: 'Step 3: Auth Implementation', 4: 'Step 4: Hardening', 5: 'Step 5: Review' },
      4: { 1: 'Step 1: UI Polish', 2: 'Step 2: Error Handling', 3: 'Step 3: Final Testing', 4: 'Step 4: Deployment', 5: 'Step 5: Retrospective' }
    };
    return stepNames[result.sprint]?.[result.step] || `Step ${result.step}`;
  }

  return 'Unknown';
}

// ============================================================================
// Cohort Validation
// ============================================================================

/**
 * Validates cohort format (YYYY-MM).
 * 
 * @param {string} cohort - Cohort identifier to validate
 * @returns {ValidationResult} Validation result
 * 
 * @example
 * validateCohort('2026-01');
 * // { valid: true }
 * 
 * @example
 * validateCohort('2026-13');
 * // { valid: false, error: 'Cohort month must be between 01 and 12' }
 */
export function validateCohort(cohort) {
  if (!cohort) {
    return { valid: false, error: 'Cohort is required' };
  }

  if (typeof cohort !== 'string') {
    return { valid: false, error: 'Cohort must be a string' };
  }

  const trimmedCohort = cohort.trim();

  if (!/^\d{4}-\d{2}$/.test(trimmedCohort)) {
    return { valid: false, error: 'Cohort must be in YYYY-MM format (e.g., 2026-01)' };
  }

  const [year, month] = trimmedCohort.split('-').map(Number);

  if (year < 2020 || year > 2100) {
    return { valid: false, error: 'Cohort year must be between 2020 and 2100' };
  }

  if (month < 1 || month > 12) {
    return { valid: false, error: 'Cohort month must be between 01 and 12' };
  }

  return { valid: true };
}

/**
 * Validates that a cohort directory exists and contains student files.
 * 
 * @param {string} cohort - Cohort identifier
 * @param {ValidatorOptions} [options] - Configuration options
 * @returns {CohortExistsResult} Validation result with cohort details
 * 
 * @example
 * const result = validateCohortExists('2026-01');
 * // { valid: true, path: '/path/to/cohort', studentCount: 5, students: ['jsmith', ...] }
 */
export function validateCohortExists(cohort, options = {}) {
  // First validate the format
  const formatResult = validateCohort(cohort);
  if (!formatResult.valid) {
    return formatResult;
  }

  const progressRoot = options.progressRoot || DEFAULT_PROGRESS_ROOT;
  const cohortPath = join(progressRoot, 'cohorts', cohort);

  if (!existsSync(cohortPath)) {
    return {
      valid: false,
      error: `Cohort directory not found: ${cohort}`,
      path: cohortPath
    };
  }

  // Check if it's actually a directory
  const stats = statSync(cohortPath);
  if (!stats.isDirectory()) {
    return {
      valid: false,
      error: `Cohort path is not a directory: ${cohort}`,
      path: cohortPath
    };
  }

  // Get student files
  const files = readdirSync(cohortPath)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'));
  
  const students = files.map(f => f.replace('.md', ''));

  return {
    valid: true,
    path: cohortPath,
    studentCount: students.length,
    students
  };
}

/**
 * Lists all available cohorts.
 * 
 * @param {ValidatorOptions} [options] - Configuration options
 * @returns {{ cohorts: string[], path: string }} List of cohort identifiers
 * 
 * @example
 * const { cohorts } = listCohorts();
 * // ['2026-01', '2026-02']
 */
export function listCohorts(options = {}) {
  const progressRoot = options.progressRoot || DEFAULT_PROGRESS_ROOT;
  const cohortsPath = join(progressRoot, 'cohorts');

  if (!existsSync(cohortsPath)) {
    return { cohorts: [], path: cohortsPath };
  }

  const cohorts = readdirSync(cohortsPath)
    .filter(f => {
      const fullPath = join(cohortsPath, f);
      return statSync(fullPath).isDirectory() && validateCohort(f).valid;
    })
    .sort();

  return { cohorts, path: cohortsPath };
}

// ============================================================================
// User Progress Validation
// ============================================================================

/**
 * Validates a user's progress file exists and has valid structure.
 * 
 * @param {string} cohort - Cohort identifier
 * @param {string} username - GitHub username
 * @param {ValidatorOptions} [options] - Configuration options
 * @returns {UserProgressResult} Validation result with file metadata
 * 
 * @example
 * const result = validateUserProgress('2026-01', 'jsmith');
 * // { valid: true, path: '...', metadata: { name: 'Jane Smith', ... } }
 */
export function validateUserProgress(cohort, username, options = {}) {
  // Validate cohort format first
  const cohortResult = validateCohort(cohort);
  if (!cohortResult.valid) {
    return cohortResult;
  }

  // Validate username
  const usernameResult = validateUsername(username);
  if (!usernameResult.valid) {
    return usernameResult;
  }

  const progressRoot = options.progressRoot || DEFAULT_PROGRESS_ROOT;
  const filePath = join(progressRoot, 'cohorts', cohort, `${username}.md`);

  if (!existsSync(filePath)) {
    return {
      valid: false,
      error: `Progress file not found for user: ${username} in cohort: ${cohort}`,
      path: filePath
    };
  }

  // Read and parse file content
  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (err) {
    return {
      valid: false,
      error: `Cannot read progress file: ${err.message}`,
      path: filePath
    };
  }

  // Extract metadata
  const metadata = extractProgressMetadata(content);

  // Validate required fields
  const requiredFields = ['name', 'github', 'track', 'cohort'];
  const missingFields = requiredFields.filter(field => !metadata[field] || metadata[field] === 'Unknown');

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Progress file missing required fields: ${missingFields.join(', ')}`,
      path: filePath,
      metadata
    };
  }

  return {
    valid: true,
    path: filePath,
    metadata
  };
}

/**
 * Extracts metadata from a progress file content.
 * 
 * @param {string} content - Progress file content
 * @returns {Object} Extracted metadata
 */
function extractProgressMetadata(content) {
  const metadata = {
    name: null,
    github: null,
    track: null,
    cohort: null,
    facilitator: null,
    lastUpdated: null
  };

  // Extract name
  const nameMatch = content.match(/\*\*Name\*\*\s*\|\s*([^\|\n]+)/);
  if (nameMatch) metadata.name = nameMatch[1].trim();

  // Extract GitHub username
  const githubMatch = content.match(/\*\*GitHub\*\*\s*\|\s*\[@([^\]]+)\]/);
  if (githubMatch) metadata.github = githubMatch[1];

  // Extract track
  const trackMatch = content.match(/\*\*Track\*\*\s*\|\s*([^\|\n]+)/);
  if (trackMatch) metadata.track = trackMatch[1].trim();

  // Extract cohort
  const cohortMatch = content.match(/\*\*Cohort\*\*\s*\|\s*([^\|\n]+)/);
  if (cohortMatch) metadata.cohort = cohortMatch[1].trim();

  // Extract facilitator
  const facilitatorMatch = content.match(/\*\*Facilitator\*\*\s*\|\s*([^\|\n]+)/);
  if (facilitatorMatch) metadata.facilitator = facilitatorMatch[1].trim();

  // Extract last updated
  const lastUpdatedMatch = content.match(/\*\*Last Updated\*\*:\s*(\d{4}-\d{2}-\d{2})/);
  if (lastUpdatedMatch) metadata.lastUpdated = lastUpdatedMatch[1];

  return metadata;
}

// ============================================================================
// Username Validation
// ============================================================================

/**
 * Validates GitHub username format.
 * 
 * GitHub username rules:
 * - 1-39 characters
 * - Alphanumeric characters and hyphens only
 * - Cannot start or end with hyphen
 * - Cannot contain consecutive hyphens
 * 
 * @param {string} username - GitHub username to validate
 * @returns {ValidationResult} Validation result
 * 
 * @example
 * validateUsername('jsmith');
 * // { valid: true }
 * 
 * @example
 * validateUsername('-invalid');
 * // { valid: false, error: '...' }
 */
export function validateUsername(username) {
  if (!username) {
    return { valid: false, error: 'GitHub username is required' };
  }

  if (typeof username !== 'string') {
    return { valid: false, error: 'GitHub username must be a string' };
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 1 || trimmedUsername.length > 39) {
    return { valid: false, error: 'GitHub username must be 1-39 characters' };
  }

  // Single character must be alphanumeric
  if (trimmedUsername.length === 1) {
    if (!/^[a-zA-Z0-9]$/.test(trimmedUsername)) {
      return { valid: false, error: 'Single character GitHub username must be alphanumeric' };
    }
    return { valid: true };
  }

  // Multi-character: alphanumeric + hyphens, no leading/trailing hyphens
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(trimmedUsername)) {
    return { 
      valid: false, 
      error: 'GitHub username can only contain alphanumeric characters and hyphens, no leading/trailing hyphens' 
    };
  }

  if (trimmedUsername.includes('--')) {
    return { valid: false, error: 'GitHub username cannot contain consecutive hyphens' };
  }

  return { valid: true };
}

// ============================================================================
// Track Validation
// ============================================================================

/**
 * Valid track options.
 * @type {string[]}
 */
export const VALID_TRACKS = ['frontend', 'backend'];

/**
 * Validates learning track selection.
 * 
 * @param {string} track - Track to validate
 * @returns {ValidationResult} Validation result
 * 
 * @example
 * validateTrack('frontend');
 * // { valid: true }
 */
export function validateTrack(track) {
  if (!track) {
    return { valid: false, error: 'Track is required' };
  }

  if (typeof track !== 'string') {
    return { valid: false, error: 'Track must be a string' };
  }

  const normalizedTrack = track.trim().toLowerCase();
  
  if (!VALID_TRACKS.includes(normalizedTrack)) {
    return { valid: false, error: `Track must be one of: ${VALID_TRACKS.join(', ')}` };
  }

  return { valid: true };
}

// ============================================================================
// YAML Structure Validation
// ============================================================================

/**
 * Required fields for bootcamp step YAML files.
 * @type {string[]}
 */
export const REQUIRED_STEP_FIELDS = ['id', 'title'];

/**
 * Optional but recommended fields for step YAML files.
 * @type {string[]}
 */
export const RECOMMENDED_STEP_FIELDS = ['timebox', 'objective', 'definition_of_done'];

/**
 * Validates YAML structure for bootcamp step files.
 * 
 * @param {Object} parsed - Parsed YAML object
 * @param {Object} [options] - Validation options
 * @param {boolean} [options.strict=false] - Whether to fail on warnings
 * @returns {YamlValidationResult} Validation result
 * 
 * @example
 * import YAML from 'yaml';
 * const parsed = YAML.parse(yamlContent);
 * const result = validateYamlStructure(parsed);
 */
export function validateYamlStructure(parsed, options = {}) {
  const errors = [];
  const warnings = [];
  const strict = options.strict || false;

  if (!parsed) {
    return {
      valid: false,
      error: 'YAML content is empty or invalid',
      errors: ['YAML content is empty or invalid'],
      warnings: []
    };
  }

  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      valid: false,
      error: 'YAML must be an object (not an array or primitive)',
      errors: ['YAML must be an object (not an array or primitive)'],
      warnings: []
    };
  }

  // Check required fields
  for (const field of REQUIRED_STEP_FIELDS) {
    if (!parsed[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check recommended fields (warnings only)
  for (const field of RECOMMENDED_STEP_FIELDS) {
    if (!parsed[field]) {
      warnings.push(`Missing recommended field: ${field}`);
    }
  }

  // Validate ID format if present
  if (parsed.id) {
    const idResult = validateLabId(parsed.id);
    if (!idResult.valid) {
      // ID might be valid for other step types, so just warn
      warnings.push(`Step ID does not match standard format: ${parsed.id}`);
    }
  }

  // Validate arrays if present
  const arrayFields = ['read', 'touch', 'definition_of_done', 'prompts', 'validate'];
  for (const field of arrayFields) {
    if (parsed[field] !== undefined && !Array.isArray(parsed[field])) {
      errors.push(`Field '${field}' must be an array`);
    }
  }

  // Validate prompts structure if present
  if (Array.isArray(parsed.prompts)) {
    parsed.prompts.forEach((prompt, index) => {
      if (!prompt.id) {
        warnings.push(`Prompt at index ${index} missing 'id' field`);
      }
      if (!prompt.text) {
        warnings.push(`Prompt at index ${index} missing 'text' field`);
      }
    });
  }

  // Validate nav structure if present
  if (parsed.nav && typeof parsed.nav !== 'object') {
    errors.push("Field 'nav' must be an object");
  }

  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const valid = !hasErrors && (!strict || !hasWarnings);

  return {
    valid,
    error: hasErrors ? errors[0] : (strict && hasWarnings ? warnings[0] : undefined),
    errors,
    warnings,
    parsed: valid ? parsed : undefined
  };
}

/**
 * Validates a YAML file from disk.
 * 
 * @param {string} filePath - Path to YAML file
 * @param {Object} [options] - Validation options
 * @returns {YamlValidationResult} Validation result
 * 
 * @example
 * const result = validateYamlFile('/path/to/step.yaml');
 */
export function validateYamlFile(filePath, options = {}) {
  if (!existsSync(filePath)) {
    return {
      valid: false,
      error: `YAML file not found: ${filePath}`,
      errors: [`YAML file not found: ${filePath}`],
      warnings: []
    };
  }

  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (err) {
    return {
      valid: false,
      error: `Cannot read YAML file: ${err.message}`,
      errors: [`Cannot read YAML file: ${err.message}`],
      warnings: []
    };
  }

  // Dynamically import YAML parser
  // Note: Caller should handle this or provide pre-parsed content
  return {
    valid: false,
    error: 'Use validateYamlStructure() with pre-parsed YAML content',
    errors: ['YAML parsing requires the yaml package - use validateYamlStructure() with YAML.parse() result'],
    warnings: []
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Status values used in progress tracking.
 * @type {Object}
 */
export const STATUS = {
  NOT_STARTED: '⬜ NOT_STARTED',
  IN_PROGRESS: '🔄 IN_PROGRESS',
  COMPLETE: '✅ COMPLETE',
  BLOCKED: '🚫 BLOCKED'
};

/**
 * Status patterns for regex matching.
 * @type {Object}
 */
export const STATUS_PATTERNS = {
  NOT_STARTED: /⬜\s*NOT_STARTED/,
  IN_PROGRESS: /🔄\s*IN_PROGRESS/,
  COMPLETE: /✅\s*COMPLETE/,
  BLOCKED: /🚫\s*BLOCKED/
};

/**
 * Checks if a value matches any status pattern.
 * 
 * @param {string} value - Value to check
 * @returns {string|null} Matched status key or null
 * 
 * @example
 * matchStatus('✅ COMPLETE');
 * // 'COMPLETE'
 */
export function matchStatus(value) {
  if (!value || typeof value !== 'string') return null;
  
  for (const [key, pattern] of Object.entries(STATUS_PATTERNS)) {
    if (pattern.test(value)) {
      return key;
    }
  }
  return null;
}

/**
 * Creates a composite validator that runs multiple validators.
 * 
 * @param {...Function} validators - Validator functions to compose
 * @returns {Function} Composite validator function
 * 
 * @example
 * const validateStudent = composeValidators(
 *   (data) => validateUsername(data.username),
 *   (data) => validateCohort(data.cohort)
 * );
 */
export function composeValidators(...validators) {
  return (data, options = {}) => {
    const errors = [];
    
    for (const validator of validators) {
      const result = validator(data, options);
      if (!result.valid) {
        errors.push(result.error);
        if (!options.collectAll) {
          return { valid: false, error: result.error, errors };
        }
      }
    }
    
    return errors.length > 0 
      ? { valid: false, error: errors[0], errors }
      : { valid: true };
  };
}

// ============================================================================
// Export Summary
// ============================================================================

/**
 * All exported validators and utilities:
 * 
 * Validators:
 * - validateLabId(labId) - Validates lab ID format
 * - validateCohort(cohort) - Validates cohort format (YYYY-MM)
 * - validateCohortExists(cohort, options) - Validates cohort directory exists
 * - validateUserProgress(cohort, username, options) - Validates user progress file
 * - validateUsername(username) - Validates GitHub username format
 * - validateTrack(track) - Validates learning track selection
 * - validateYamlStructure(parsed, options) - Validates YAML step structure
 * - validateYamlFile(filePath, options) - Validates YAML file from disk
 * 
 * Utilities:
 * - getLabDisplayName(labId) - Gets human-readable lab name
 * - listCohorts(options) - Lists all available cohorts
 * - matchStatus(value) - Matches status pattern
 * - composeValidators(...validators) - Creates composite validator
 * 
 * Constants:
 * - VALID_TRACKS - Valid track options
 * - REQUIRED_STEP_FIELDS - Required YAML fields
 * - RECOMMENDED_STEP_FIELDS - Recommended YAML fields
 * - STATUS - Status values
 * - STATUS_PATTERNS - Status regex patterns
 */
