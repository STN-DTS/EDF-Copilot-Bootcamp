#!/usr/bin/env node

/**
 * create-signal.mjs
 * 
 * Creates a completion signal file for an agent.
 * 
 * Usage:
 *   node create-signal.mjs <agentId> <status> [message] [options]
 * 
 * Arguments:
 *   agentId   - Agent identifier (e.g., E12, E13)
 *   status    - SUCCESS or FAILURE
 *   message   - Optional completion message
 * 
 * Options:
 *   --executor <name>  - Name of the executing agent
 * 
 * Examples:
 *   node create-signal.mjs E12 SUCCESS "Runner integration complete"
 *   node create-signal.mjs E13 FAILURE "Blocked by dependency"
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIGNALS_DIR = join(__dirname, '..', 'WORK_PRODUCTS', 'SIGNALS');

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node create-signal.mjs <agentId> <status> [message] [options]

Arguments:
  agentId   - Agent identifier (e.g., E12, E13)
  status    - SUCCESS or FAILURE
  message   - Optional completion message

Options:
  --executor <name>  - Name of the executing agent

Examples:
  node create-signal.mjs E12 SUCCESS "Runner integration complete"
  node create-signal.mjs E13 FAILURE "Blocked by dependency"
`);
    process.exit(0);
  }
  
  // Parse arguments
  const agentId = args[0].toUpperCase();
  const status = args[1].toUpperCase();
  
  if (status !== 'SUCCESS' && status !== 'FAILURE') {
    console.error('❌ Status must be SUCCESS or FAILURE');
    process.exit(1);
  }
  
  // Find message (first arg that isn't a flag)
  let message = '';
  let executor = agentId;
  
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--executor' && args[i + 1]) {
      executor = args[i + 1];
      i++;
    } else if (!args[i].startsWith('--')) {
      message = args[i];
    }
  }
  
  // Ensure signals directory exists
  if (!existsSync(SIGNALS_DIR)) {
    mkdirSync(SIGNALS_DIR, { recursive: true });
    console.log(`📁 Created signals directory: ${SIGNALS_DIR}`);
  }
  
  // Generate signal file content
  const timestamp = new Date().toISOString();
  const signalContent = `---
agent: ${agentId}
status: ${status}
timestamp: ${timestamp}
executor: ${executor}
message: ${message || 'No message provided'}
---

Signal file for ${agentId} agent completion.
Status: ${status}
Created: ${timestamp}
`;
  
  // Write signal file
  const signalPath = join(SIGNALS_DIR, `${agentId}_COMPLETE.signal`);
  
  try {
    writeFileSync(signalPath, signalContent, 'utf-8');
    
    const icon = status === 'SUCCESS' ? '✅' : '❌';
    console.log(`${icon} Signal created: ${signalPath}`);
    console.log(`   Agent: ${agentId}`);
    console.log(`   Status: ${status}`);
    console.log(`   Time: ${timestamp}`);
    
    if (message) {
      console.log(`   Message: ${message}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(`❌ Failed to create signal: ${err.message}`);
    process.exit(1);
  }
}

main();
