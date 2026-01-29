#!/usr/bin/env node

/**
 * validate-signals.mjs
 * 
 * Validates that all required agent signals exist.
 * 
 * Usage:
 *   node validate-signals.mjs <agentId1> [agentId2] [...]
 * 
 * Examples:
 *   node validate-signals.mjs E12 E13 E14
 *   node validate-signals.mjs E12 E13 E14 E15 E16 E17 E18 E19 E20 E21 E22
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIGNALS_DIR = join(__dirname, '..', 'WORK_PRODUCTS', 'SIGNALS');

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node validate-signals.mjs <agentId1> [agentId2] [...]

Examples:
  node validate-signals.mjs E12 E13 E14
  node validate-signals.mjs E12 E13 E14 E15 E16 E17 E18 E19 E20 E21 E22 E08v2

Options:
  --list    List all existing signals
  --verbose Show signal details
`);
    process.exit(0);
  }
  
  // List mode
  if (args.includes('--list')) {
    listSignals();
    process.exit(0);
  }
  
  const verbose = args.includes('--verbose') || args.includes('-v');
  const requiredAgents = args
    .filter(a => !a.startsWith('--'))
    .map(a => a.toUpperCase());
  
  console.log('\n🔍 Validating Signals\n');
  console.log(`Required: ${requiredAgents.length} signals`);
  console.log(`Directory: ${SIGNALS_DIR}`);
  console.log('');
  
  // Check directory exists
  if (!existsSync(SIGNALS_DIR)) {
    console.log('❌ Signals directory does not exist');
    console.log(`   Expected: ${SIGNALS_DIR}`);
    process.exit(1);
  }
  
  // Validate each required signal
  const results = [];
  
  for (const agentId of requiredAgents) {
    const signalPath = join(SIGNALS_DIR, `${agentId}_COMPLETE.signal`);
    const exists = existsSync(signalPath);
    
    let status = 'UNKNOWN';
    let timestamp = 'N/A';
    
    if (exists && verbose) {
      try {
        const content = readFileSync(signalPath, 'utf-8');
        const statusMatch = content.match(/status:\s*(\w+)/);
        const timeMatch = content.match(/timestamp:\s*([^\n]+)/);
        
        if (statusMatch) status = statusMatch[1];
        if (timeMatch) timestamp = timeMatch[1];
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    results.push({
      agentId,
      exists,
      status,
      timestamp,
      path: signalPath
    });
    
    const icon = exists ? '✅' : '❌';
    console.log(`  ${icon} ${agentId}`);
    
    if (verbose && exists) {
      console.log(`     Status: ${status}`);
      console.log(`     Time: ${timestamp}`);
    }
  }
  
  console.log('');
  
  // Summary
  const found = results.filter(r => r.exists).length;
  const missing = results.filter(r => !r.exists);
  
  console.log('---');
  console.log(`📊 Summary: ${found}/${requiredAgents.length} signals found`);
  
  if (missing.length > 0) {
    console.log('\n❌ Missing signals:');
    missing.forEach(m => {
      console.log(`   - ${m.agentId}`);
    });
    console.log('\n⚠️  Phase gate BLOCKED');
    process.exit(1);
  } else {
    console.log('\n✅ All signals present - Phase gate PASSED');
    process.exit(0);
  }
}

function listSignals() {
  console.log('\n📋 Existing Signals\n');
  
  if (!existsSync(SIGNALS_DIR)) {
    console.log('No signals directory found.');
    return;
  }
  
  const files = readdirSync(SIGNALS_DIR).filter(f => f.endsWith('.signal'));
  
  if (files.length === 0) {
    console.log('No signal files found.');
    return;
  }
  
  files.forEach(file => {
    const signalPath = join(SIGNALS_DIR, file);
    let status = 'UNKNOWN';
    let timestamp = 'N/A';
    
    try {
      const content = readFileSync(signalPath, 'utf-8');
      const statusMatch = content.match(/status:\s*(\w+)/);
      const timeMatch = content.match(/timestamp:\s*([^\n]+)/);
      
      if (statusMatch) status = statusMatch[1];
      if (timeMatch) timestamp = timeMatch[1].trim();
    } catch (e) {
      // Ignore
    }
    
    const icon = status === 'SUCCESS' ? '✅' : status === 'FAILURE' ? '❌' : '❓';
    console.log(`  ${icon} ${file}`);
    console.log(`     Status: ${status}`);
    console.log(`     Time: ${timestamp}`);
    console.log('');
  });
  
  console.log(`Total: ${files.length} signals`);
}

main();
