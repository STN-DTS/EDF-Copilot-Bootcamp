#!/usr/bin/env node
/**
 * Minimal Bootcamp Runner (VS Code friendly)
 *
 * Usage:
 *   node scripts/bootcamp.mjs list
 *   node scripts/bootcamp.mjs step <STEP_ID>
 *   node scripts/bootcamp.mjs validate <STEP_ID>
 *
 * Notes:
 * - Expects YAML step files under bootcamp/steps/**.yaml
 * - Requires npm dependency: "yaml"
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import YAML from "yaml";

const REPO_ROOT = process.cwd();
const STEPS_DIR = path.join(REPO_ROOT, "bootcamp", "steps");

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
  const [cmd, arg] = process.argv.slice(2);
  const steps = loadSteps();

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    console.log("Bootcamp Runner\n");
    console.log("Commands:");
    console.log("  list                 List all step IDs");
    console.log("  step <STEP_ID>       Print a step (read/touch/prompts/DoD)");
    console.log("  validate <STEP_ID>   Print validation guidance (same as step, filtered)");
    process.exit(0);
  }

  if (cmd === "list") {
    const ids = Array.from(steps.keys()).sort();
    for (const id of ids) console.log(id);
    process.exit(0);
  }

  if (cmd === "step" || cmd === "validate") {
    if (!arg) throw new Error("Missing STEP_ID");
    const step = steps.get(arg);
    if (!step) throw new Error(`Step not found: ${arg}`);
    if (cmd === "validate") {
      console.log(`\n=== ${step.id} — Validate ===\n`);
      if (Array.isArray(step.validate) && step.validate.length) {
        for (const v of step.validate) console.log(`- ${v}`);
      } else {
        console.log("No validate guidance found in step metadata.");
      }
      process.exit(0);
    }
    printStep(step);
    process.exit(0);
  }

  throw new Error(`Unknown command: ${cmd}`);
}

main();
