#!/usr/bin/env node
/**
 * Lab Discovery Utility
 * 
 * Auto-discovers valid lab IDs from YAML files in bootcamp/steps/
 * 
 * Usage:
 *   node scripts/lab-discovery.mjs                    # List all lab IDs
 *   node scripts/lab-discovery.mjs --json             # Output as JSON
 *   node scripts/lab-discovery.mjs --filter week-01   # Filter by week/sprint
 *   node scripts/lab-discovery.mjs --verbose          # Include metadata
 * 
 * Module Usage:
 *   import { discoverLabs, getLabById, isValidLabId } from './lab-discovery.mjs';
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const STEPS_DIR = join(__dirname, "..", "bootcamp", "steps");

// Lab ID pattern: {week|sprint}-{XX}-{lab|step}-{XX}
const LAB_ID_PATTERN = /^(week|sprint)-(\d{2})-(lab|step)-(\d{2})$/;

/**
 * Parse a YAML file and extract lab metadata
 * @param {string} filePath - Path to YAML file
 * @returns {Promise<object|null>} Lab metadata or null if invalid
 */
async function parseLabYaml(filePath) {
  try {
    const content = await readFile(filePath, "utf-8");
    const data = parseYaml(content);
    
    if (!data || !data.id) {
      return null;
    }
    
    return {
      id: data.id,
      title: data.title || "Untitled",
      timebox: data.timebox || null,
      objective: data.objective || null,
      filePath: filePath,
      nav: data.nav || {}
    };
  } catch (error) {
    // Skip files that can't be parsed
    return null;
  }
}

/**
 * Discover all labs from YAML files
 * @param {object} options - Discovery options
 * @param {string} [options.filter] - Filter by prefix (e.g., 'week-01', 'sprint')
 * @param {boolean} [options.verbose] - Include full metadata
 * @returns {Promise<Array>} Array of lab objects or IDs
 */
export async function discoverLabs(options = {}) {
  const { filter, verbose = false } = options;
  const labs = [];
  
  try {
    // Get all subdirectories (week-XX, sprint-XX)
    const entries = await readdir(STEPS_DIR);
    
    for (const entry of entries) {
      const entryPath = join(STEPS_DIR, entry);
      const entryStat = await stat(entryPath);
      
      // Skip non-directories and index.yaml
      if (!entryStat.isDirectory()) {
        continue;
      }
      
      // Apply filter if specified
      if (filter && !entry.startsWith(filter)) {
        continue;
      }
      
      // Get all YAML files in this directory
      const yamlFiles = await readdir(entryPath);
      
      for (const yamlFile of yamlFiles) {
        if (!yamlFile.endsWith(".yaml")) {
          continue;
        }
        
        const yamlPath = join(entryPath, yamlFile);
        const labData = await parseLabYaml(yamlPath);
        
        if (labData && LAB_ID_PATTERN.test(labData.id)) {
          // Apply filter to specific lab IDs too
          if (filter && !labData.id.startsWith(filter)) {
            continue;
          }
          
          if (verbose) {
            labs.push(labData);
          } else {
            labs.push({
              id: labData.id,
              title: labData.title
            });
          }
        }
      }
    }
    
    // Sort by ID for consistent ordering
    labs.sort((a, b) => {
      const idA = typeof a === "string" ? a : a.id;
      const idB = typeof b === "string" ? b : b.id;
      return idA.localeCompare(idB);
    });
    
    return labs;
  } catch (error) {
    console.error(`Error discovering labs: ${error.message}`);
    return [];
  }
}

/**
 * Get a specific lab by ID
 * @param {string} labId - Lab ID to find
 * @returns {Promise<object|null>} Lab metadata or null if not found
 */
export async function getLabById(labId) {
  if (!isValidLabId(labId)) {
    return null;
  }
  
  const labs = await discoverLabs({ verbose: true });
  return labs.find(lab => lab.id === labId) || null;
}

/**
 * Check if a lab ID is valid (exists in YAML files)
 * @param {string} labId - Lab ID to validate
 * @returns {Promise<boolean>} True if valid
 */
export async function isValidLabId(labId) {
  // First check pattern
  if (!LAB_ID_PATTERN.test(labId)) {
    return false;
  }
  
  // Then check if it exists
  const labs = await discoverLabs();
  return labs.some(lab => lab.id === labId);
}

/**
 * Validate lab ID format (synchronous)
 * @param {string} labId - Lab ID to check
 * @returns {boolean} True if format is valid
 */
export function isValidLabIdFormat(labId) {
  return LAB_ID_PATTERN.test(labId);
}

/**
 * Get all valid lab IDs as a simple array
 * @param {string} [filter] - Optional filter prefix
 * @returns {Promise<string[]>} Array of lab ID strings
 */
export async function getLabIds(filter) {
  const labs = await discoverLabs({ filter });
  return labs.map(lab => lab.id);
}

/**
 * Get labs grouped by week/sprint
 * @returns {Promise<object>} Labs grouped by category
 */
export async function getLabsGrouped() {
  const labs = await discoverLabs({ verbose: true });
  const grouped = {
    weeks: {},
    sprints: {}
  };
  
  for (const lab of labs) {
    const match = lab.id.match(LAB_ID_PATTERN);
    if (match) {
      const [, type, number] = match;
      const key = `${type}-${number}`;
      const category = type === "week" ? "weeks" : "sprints";
      
      if (!grouped[category][key]) {
        grouped[category][key] = [];
      }
      grouped[category][key].push(lab);
    }
  }
  
  return grouped;
}

/**
 * CLI output formatting
 */
function formatOutput(labs, format = "text") {
  if (format === "json") {
    return JSON.stringify(labs, null, 2);
  }
  
  // Text format
  let output = "\n📚 Discovered Lab IDs\n";
  output += "═".repeat(50) + "\n\n";
  
  let currentCategory = "";
  
  for (const lab of labs) {
    const match = lab.id.match(LAB_ID_PATTERN);
    if (match) {
      const [, type, number] = match;
      const category = `${type}-${number}`;
      
      if (category !== currentCategory) {
        currentCategory = category;
        const icon = type === "week" ? "📅" : "🏃";
        output += `\n${icon} ${type.toUpperCase()} ${number}\n`;
        output += "─".repeat(30) + "\n";
      }
    }
    
    output += `  • ${lab.id}`;
    if (lab.title) {
      output += ` — ${lab.title}`;
    }
    output += "\n";
  }
  
  output += "\n" + "═".repeat(50) + "\n";
  output += `Total: ${labs.length} labs discovered\n`;
  
  return output;
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
Lab Discovery Utility
═══════════════════════════════════════════════════

USAGE:
  node scripts/lab-discovery.mjs [options]

OPTIONS:
  --json          Output as JSON
  --filter <str>  Filter by prefix (e.g., 'week-01', 'sprint', 'week')
  --verbose       Include full metadata in output
  --ids-only      Output only lab IDs, one per line
  --grouped       Show labs grouped by week/sprint
  --help, -h      Show this help message

EXAMPLES:
  node scripts/lab-discovery.mjs
    List all labs in formatted text

  node scripts/lab-discovery.mjs --json
    Output all labs as JSON

  node scripts/lab-discovery.mjs --filter week-01
    Show only Week 1 labs

  node scripts/lab-discovery.mjs --filter sprint
    Show only sprint steps

  node scripts/lab-discovery.mjs --ids-only
    Output just the IDs for scripting

MODULE USAGE:
  import { discoverLabs, getLabById, isValidLabId } from './lab-discovery.mjs';
  
  const labs = await discoverLabs();
  const lab = await getLabById('week-01-lab-00');
  const valid = await isValidLabId('week-01-lab-00');
`);
}

/**
 * Main CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse CLI arguments
  const options = {
    json: args.includes("--json"),
    verbose: args.includes("--verbose"),
    idsOnly: args.includes("--ids-only"),
    grouped: args.includes("--grouped"),
    help: args.includes("--help") || args.includes("-h")
  };
  
  // Get filter value if provided
  const filterIndex = args.indexOf("--filter");
  if (filterIndex !== -1 && args[filterIndex + 1]) {
    options.filter = args[filterIndex + 1];
  }
  
  // Show help
  if (options.help) {
    printHelp();
    process.exit(0);
  }
  
  try {
    // Handle grouped output
    if (options.grouped) {
      const grouped = await getLabsGrouped();
      if (options.json) {
        console.log(JSON.stringify(grouped, null, 2));
      } else {
        console.log("\n📚 Labs Grouped by Week/Sprint\n");
        
        console.log("📅 WEEKS");
        console.log("═".repeat(40));
        for (const [week, labs] of Object.entries(grouped.weeks)) {
          console.log(`\n  ${week}:`);
          for (const lab of labs) {
            console.log(`    • ${lab.id} — ${lab.title}`);
          }
        }
        
        console.log("\n\n🏃 SPRINTS");
        console.log("═".repeat(40));
        for (const [sprint, labs] of Object.entries(grouped.sprints)) {
          console.log(`\n  ${sprint}:`);
          for (const lab of labs) {
            console.log(`    • ${lab.id} — ${lab.title}`);
          }
        }
        console.log();
      }
      process.exit(0);
    }
    
    // Standard discovery
    const labs = await discoverLabs({
      filter: options.filter,
      verbose: options.verbose
    });
    
    if (labs.length === 0) {
      console.error("No labs found" + (options.filter ? ` matching filter: ${options.filter}` : ""));
      process.exit(1);
    }
    
    // IDs only output (for scripting)
    if (options.idsOnly) {
      for (const lab of labs) {
        console.log(lab.id);
      }
      process.exit(0);
    }
    
    // JSON or text output
    const output = formatOutput(labs, options.json ? "json" : "text");
    console.log(output);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run CLI if executed directly
const isMainModule = () => {
  try {
    const scriptPath = process.argv[1];
    if (!scriptPath) return false;
    const normalizedScript = scriptPath.replace(/\\/g, "/");
    const normalizedUrl = import.meta.url.replace(/^file:\/\/\//, "").replace(/^file:\/\//, "");
    return normalizedUrl === normalizedScript || 
           import.meta.url === `file:///${normalizedScript}` ||
           import.meta.url === `file://${normalizedScript}`;
  } catch {
    return false;
  }
};

if (isMainModule()) {
  main();
}

// Export for module usage
export default {
  discoverLabs,
  getLabById,
  isValidLabId,
  isValidLabIdFormat,
  getLabIds,
  getLabsGrouped,
  LAB_ID_PATTERN
};
