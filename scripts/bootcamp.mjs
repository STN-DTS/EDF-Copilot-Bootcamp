#!/usr/bin/env node
/**
 * Minimal Bootcamp Runner (VS Code friendly)
 *
 * Usage:
 *   node scripts/bootcamp.mjs list
 *   node scripts/bootcamp.mjs step <STEP_ID>
 *   node scripts/bootcamp.mjs step <STEP_ID> --mark-started <username> --cohort <cohort-id>
 *   node scripts/bootcamp.mjs step <STEP_ID> --mark-complete <username> --cohort <cohort-id> [--pr <pr-number>]
 *   node scripts/bootcamp.mjs validate <STEP_ID>
 *
 * Notes:
 * - Expects YAML step files under bootcamp/steps/**.yaml
 * - Requires npm dependency: "yaml"
 * - Integration with progress tracking via --mark-started/--mark-complete flags
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execSync } from "node:child_process";
import YAML from "yaml";

const REPO_ROOT = process.cwd();
const STEPS_DIR = path.join(REPO_ROOT, "bootcamp", "steps");
const PROGRESS_SCRIPT = path.join(REPO_ROOT, "progress", "scripts", "update-progress.mjs");

// ============================================================================
// Argument Parsing
// ============================================================================

/**
 * Parse command line arguments for flags.
 * @param {string[]} args - Command line arguments
 * @returns {{ stepId: string|null, markStarted: string|null, markComplete: string|null, cohort: string|null, pr: string|null, dryRun: boolean }}
 */
function parseArgs(args) {
  const result = {
    stepId: null,
    markStarted: null,
    markComplete: null,
    cohort: null,
    pr: null,
    dryRun: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === "--mark-started" && args[i + 1]) {
      result.markStarted = args[++i];
    } else if (arg === "--mark-complete" && args[i + 1]) {
      result.markComplete = args[++i];
    } else if (arg === "--cohort" && args[i + 1]) {
      result.cohort = args[++i];
    } else if (arg === "--pr" && args[i + 1]) {
      result.pr = args[++i];
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (!arg.startsWith("--") && !result.stepId) {
      result.stepId = arg;
    }
  }

  return result;
}

/**
 * Convert step ID to progress lab ID format.
 * Step IDs like "week-01-lab-02" map directly; others need transformation.
 * @param {string} stepId - Bootcamp step ID
 * @returns {string} - Progress-compatible lab ID
 */
function stepIdToLabId(stepId) {
  // Direct match for week-XX-lab-XX format
  if (/^week-0[1-4]-lab-0[0-6]$/.test(stepId)) {
    return stepId;
  }
  
  // Direct match for sprint-XX-step-XX format
  if (/^sprint-0[1-4]-step-0[1-9]$/.test(stepId)) {
    return stepId;
  }
  
  // Return as-is for other formats (progress script will validate)
  return stepId;
}

/**
 * Call the progress tracking script.
 * @param {"start"|"complete"} action - Action to perform
 * @param {string} labId - Lab ID
 * @param {string} username - Student username
 * @param {string} cohort - Cohort identifier
 * @param {string|null} pr - Optional PR number
 * @param {boolean} dryRun - If true, only show what would happen without making changes
 */
function updateProgress(action, labId, username, cohort, pr = null, dryRun = false) {
  const progressLabId = stepIdToLabId(labId);
  
  let cmd = `node "${PROGRESS_SCRIPT}" ${action} --student "${username}" --cohort "${cohort}" "${progressLabId}"`;
  
  if (action === "complete" && pr) {
    cmd = `node "${PROGRESS_SCRIPT}" ${action} --student "${username}" --cohort "${cohort}" --pr "${pr}" "${progressLabId}"`;
  }

  if (dryRun) {
    console.log(`\n[DRY-RUN] 📊 Would update progress: ${action} for ${username}`);
    console.log(`[DRY-RUN] Command that would run: ${cmd}`);
    console.log(`[DRY-RUN] ✅ ${progressLabId} would be marked as ${action === "start" ? "IN_PROGRESS" : "COMPLETE"}`);
    return;
  }

  console.log(`\n📊 Updating progress: ${action} for ${username}...`);
  
  try {
    const output = execSync(cmd, { 
      encoding: "utf8", 
      cwd: REPO_ROOT,
      stdio: ["pipe", "pipe", "pipe"]
    });
    console.log(output);
    console.log(`✅ Progress updated: ${progressLabId} marked as ${action === "start" ? "IN_PROGRESS" : "COMPLETE"}`);
  } catch (err) {
    console.error(`\n❌ Failed to update progress:`);
    if (err.stderr) console.error(err.stderr);
    if (err.stdout) console.error(err.stdout);
    throw new Error(`Progress update failed: ${err.message}`);
  }
}

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile() && (p.endsWith(".yaml") || p.endsWith(".yml"))) out.push(p);
  }
  return out;
}

function loadSteps() {
  if (!fs.existsSync(STEPS_DIR)) {
    throw new Error(`Steps dir not found: ${STEPS_DIR}`);
  }
  const files = walk(STEPS_DIR);
  const steps = new Map();
  for (const f of files) {
    const raw = fs.readFileSync(f, "utf8");
    const step = YAML.parse(raw);
    if (!step?.id) continue;
    steps.set(step.id, step);
  }
  return steps;
}

function printStep(step) {
  console.log(`\n=== ${step.id} ===`);
  console.log(step.title ? `Title: ${step.title}` : "");
  console.log(step.timebox ? `Timebox: ${step.timebox}` : "");
  console.log(step.objective ? `Objective: ${step.objective}` : "");
  console.log("");

  if (Array.isArray(step.read) && step.read.length) {
    console.log("Read (open these first):");
    for (const r of step.read) console.log(`  - ${r}`);
    console.log("");
  }

  if (Array.isArray(step.touch) && step.touch.length) {
    console.log("Files/paths you will touch:");
    for (const t of step.touch) console.log(`  - ${t}`);
    console.log("");
  }

  if (Array.isArray(step.definition_of_done) && step.definition_of_done.length) {
    console.log("Definition of Done:");
    for (const d of step.definition_of_done) console.log(`  - ${d}`);
    console.log("");
  }

  if (Array.isArray(step.prompts) && step.prompts.length) {
    console.log("Copilot prompts (copy/paste):");
    for (const p of step.prompts) {
      console.log(`\n--- ${p.id}${p.title ? ` — ${p.title}` : ""} ---\n`);
      console.log(p.text?.trim() ?? "");
      console.log("");
    }
  }

  if (Array.isArray(step.validate) && step.validate.length) {
    console.log("Validate:");
    for (const v of step.validate) console.log(`  - ${v}`);
    console.log("");
  }

  if (step.nav) {
    console.log("Navigation:");
    if (step.nav.prev) console.log(`  Previous: ${step.nav.prev}`);
    if (step.nav.home) console.log(`  Home: ${step.nav.home}`);
    if (step.nav.next) console.log(`  Next: ${step.nav.next}`);
    console.log("");
  }
}

function main() {
  const args = process.argv.slice(2);
  const [cmd] = args;
  const steps = loadSteps();

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    console.log("Bootcamp Runner\n");
    console.log("Commands:");
    console.log("  list                 List all step IDs");
    console.log("  step <STEP_ID>       Print a step (read/touch/prompts/DoD)");
    console.log("  validate <STEP_ID>   Print validation guidance (same as step, filtered)");
    console.log("");
    console.log("Progress Integration Flags (use with 'step' command):");
    console.log("  --mark-started <username>   Mark lab as IN_PROGRESS for the student");
    console.log("  --mark-complete <username>  Mark lab as COMPLETE for the student");
    console.log("  --cohort <cohort-id>        Cohort identifier (required with mark flags)");
    console.log("  --pr <pr-number>            PR number (optional with --mark-complete)");
    console.log("  --dry-run                   Show what would happen without making changes");
    console.log("");
    console.log("Examples:");
    console.log("  node scripts/bootcamp.mjs step week-01-lab-02");
    console.log("  node scripts/bootcamp.mjs step week-01-lab-02 --mark-started jsmith --cohort 2026-01");
    console.log("  node scripts/bootcamp.mjs step week-01-lab-02 --mark-complete jsmith --cohort 2026-01 --pr 42");
    console.log("  node scripts/bootcamp.mjs step week-01-lab-02 --mark-started jsmith --cohort 2026-01 --dry-run");
    process.exit(0);
  }

  if (cmd === "list") {
    const ids = Array.from(steps.keys()).sort();
    for (const id of ids) console.log(id);
    process.exit(0);
  }

  if (cmd === "step" || cmd === "validate") {
    // Parse remaining arguments (skip the command itself)
    const parsed = parseArgs(args.slice(1));
    const stepId = parsed.stepId;
    
    if (!stepId) throw new Error("Missing STEP_ID");
    const step = steps.get(stepId);
    if (!step) throw new Error(`Step not found: ${stepId}`);
    
    // Handle validate command
    if (cmd === "validate") {
      console.log(`\n=== ${step.id} — Validate ===\n`);
      if (Array.isArray(step.validate) && step.validate.length) {
        for (const v of step.validate) console.log(`- ${v}`);
      } else {
        console.log("No validate guidance found in step metadata.");
      }
      process.exit(0);
    }
    
    // Print step info
    printStep(step);
    
    // Handle progress integration flags
    const hasMarkFlag = parsed.markStarted || parsed.markComplete;
    
    if (hasMarkFlag) {
      // Validate cohort is provided
      if (!parsed.cohort) {
        throw new Error("--cohort is required when using --mark-started or --mark-complete");
      }
      
      if (parsed.markStarted && parsed.markComplete) {
        throw new Error("Cannot use both --mark-started and --mark-complete at the same time");
      }
      
      const username = parsed.markStarted || parsed.markComplete;
      const action = parsed.markStarted ? "start" : "complete";
      
      updateProgress(action, stepId, username, parsed.cohort, parsed.pr, parsed.dryRun);
    }
    
    process.exit(0);
  }

  throw new Error(`Unknown command: ${cmd}`);
}

main();
