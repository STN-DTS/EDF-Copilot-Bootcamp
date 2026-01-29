#!/usr/bin/env node
/**
 * Backup and Restore System for Student Progress Files
 * 
 * Commands:
 *   backup  - Create a timestamped backup of cohort progress
 *   list    - List available backups for a cohort
 *   restore - Restore from a specific backup
 * 
 * Usage:
 *   node backup-cohort.mjs backup --cohort 2026-01
 *   node backup-cohort.mjs list --cohort 2026-01
 *   node backup-cohort.mjs restore --cohort 2026-01 --date 2026-01-29
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync, copyFileSync, statSync } from 'fs';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PROGRESS_ROOT = join(__dirname, '..');
const BACKUPS_DIR = join(PROGRESS_ROOT, 'backups');
const COHORTS_DIR = join(PROGRESS_ROOT, 'cohorts');
const MAX_BACKUPS = 10;

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Print colored message
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print error and exit
 */
function error(message) {
  log(`❌ Error: ${message}`, 'red');
  process.exit(1);
}

/**
 * Print success message
 */
function success(message) {
  log(`✅ ${message}`, 'green');
}

/**
 * Print info message
 */
function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

/**
 * Print warning message
 */
function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const parsed = {
    command: null,
    cohort: null,
    date: null,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--cohort' || arg === '-c') {
      parsed.cohort = args[++i];
    } else if (arg === '--date' || arg === '-d') {
      parsed.date = args[++i];
    } else if (!arg.startsWith('-') && !parsed.command) {
      parsed.command = arg;
    }
  }

  return parsed;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
${colors.bright}Backup and Restore System for Student Progress${colors.reset}

${colors.cyan}USAGE:${colors.reset}
  node backup-cohort.mjs <command> --cohort <id> [options]

${colors.cyan}COMMANDS:${colors.reset}
  backup     Create a timestamped backup of cohort progress files
  list       List all available backups for a cohort
  restore    Restore progress files from a specific backup

${colors.cyan}OPTIONS:${colors.reset}
  --cohort, -c <id>     Required. Cohort identifier (e.g., 2026-01)
  --date, -d <date>     For restore: backup date in YYYY-MM-DD format
  --help, -h            Show this help message

${colors.cyan}EXAMPLES:${colors.reset}
  ${colors.yellow}# Create a backup${colors.reset}
  node backup-cohort.mjs backup --cohort 2026-01

  ${colors.yellow}# List available backups${colors.reset}
  node backup-cohort.mjs list --cohort 2026-01

  ${colors.yellow}# Restore from a specific date${colors.reset}
  node backup-cohort.mjs restore --cohort 2026-01 --date 2026-01-29

${colors.cyan}NOTES:${colors.reset}
  - Backups are stored in progress/backups/<cohort>/
  - Maximum ${MAX_BACKUPS} backups are retained per cohort
  - Older backups are automatically pruned
  - Each backup includes a manifest.json with metadata
`);
}

/**
 * Ensure backup directory exists
 */
function ensureBackupDir(cohort) {
  const cohortBackupDir = join(BACKUPS_DIR, cohort);
  if (!existsSync(cohortBackupDir)) {
    mkdirSync(cohortBackupDir, { recursive: true });
    info(`Created backup directory: ${cohortBackupDir}`);
  }
  return cohortBackupDir;
}

/**
 * Get timestamp string for backup filename
 */
function getTimestamp() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `${date}_${time}`;
}

/**
 * Get list of student files in a cohort
 */
function getStudentFiles(cohort) {
  const cohortDir = join(COHORTS_DIR, cohort);
  
  if (!existsSync(cohortDir)) {
    return [];
  }

  const files = readdirSync(cohortDir)
    .filter(f => f.endsWith('.md'))
    .map(f => ({
      name: f,
      path: join(cohortDir, f),
      size: statSync(join(cohortDir, f)).size
    }));

  return files;
}

/**
 * Create manifest for backup
 */
function createManifest(cohort, files, backupPath) {
  const manifest = {
    version: '1.0.0',
    cohort: cohort,
    createdAt: new Date().toISOString(),
    backupFile: basename(backupPath),
    fileCount: files.length,
    files: files.map(f => ({
      name: f.name,
      size: f.size
    })),
    totalSize: files.reduce((sum, f) => sum + f.size, 0)
  };

  return manifest;
}

/**
 * Prune old backups, keeping only the most recent MAX_BACKUPS
 */
function pruneOldBackups(cohortBackupDir) {
  const backups = readdirSync(cohortBackupDir)
    .filter(f => f.endsWith('.tar.gz'))
    .map(f => ({
      name: f,
      path: join(cohortBackupDir, f),
      time: statSync(join(cohortBackupDir, f)).mtime
    }))
    .sort((a, b) => b.time - a.time);

  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS);
    toDelete.forEach(backup => {
      rmSync(backup.path);
      // Also remove associated manifest
      const manifestPath = backup.path.replace('.tar.gz', '.manifest.json');
      if (existsSync(manifestPath)) {
        rmSync(manifestPath);
      }
      info(`Pruned old backup: ${backup.name}`);
    });
    return toDelete.length;
  }
  return 0;
}

/**
 * Create a backup of cohort progress files
 */
function createBackup(cohort) {
  log(`\n📦 Creating backup for cohort: ${cohort}`, 'bright');
  
  const cohortDir = join(COHORTS_DIR, cohort);
  
  if (!existsSync(cohortDir)) {
    error(`Cohort directory not found: ${cohortDir}`);
  }

  const files = getStudentFiles(cohort);
  
  if (files.length === 0) {
    error(`No progress files found for cohort: ${cohort}`);
  }

  info(`Found ${files.length} student file(s) to backup`);

  const cohortBackupDir = ensureBackupDir(cohort);
  const timestamp = getTimestamp();
  const backupName = `${cohort}_${timestamp}.tar.gz`;
  const backupPath = join(cohortBackupDir, backupName);
  const manifestPath = join(cohortBackupDir, `${cohort}_${timestamp}.manifest.json`);

  // Create tar.gz backup using tar command
  try {
    const tarCommand = process.platform === 'win32'
      ? `tar -czf "${backupPath}" -C "${COHORTS_DIR}" "${cohort}"`
      : `tar -czf "${backupPath}" -C "${COHORTS_DIR}" "${cohort}"`;
    
    execSync(tarCommand, { stdio: 'pipe' });
    
    // Create and save manifest
    const manifest = createManifest(cohort, files, backupPath);
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    // Get backup file size
    const backupSize = statSync(backupPath).size;
    const sizeKB = (backupSize / 1024).toFixed(2);
    
    success(`Backup created: ${backupName} (${sizeKB} KB)`);
    info(`Manifest saved: ${basename(manifestPath)}`);
    
    // Prune old backups
    const pruned = pruneOldBackups(cohortBackupDir);
    if (pruned > 0) {
      info(`Pruned ${pruned} old backup(s)`);
    }
    
    console.log(`\n${colors.green}Backup Summary:${colors.reset}`);
    console.log(`  Cohort:     ${cohort}`);
    console.log(`  Files:      ${files.length}`);
    console.log(`  Size:       ${sizeKB} KB`);
    console.log(`  Location:   ${backupPath}`);
    
  } catch (err) {
    error(`Failed to create backup: ${err.message}`);
  }
}

/**
 * List available backups for a cohort
 */
function listBackups(cohort) {
  log(`\n📋 Backups for cohort: ${cohort}`, 'bright');
  
  const cohortBackupDir = join(BACKUPS_DIR, cohort);
  
  if (!existsSync(cohortBackupDir)) {
    info(`No backups found for cohort: ${cohort}`);
    return;
  }

  const backups = readdirSync(cohortBackupDir)
    .filter(f => f.endsWith('.tar.gz'))
    .map(f => {
      const filePath = join(cohortBackupDir, f);
      const manifestPath = filePath.replace('.tar.gz', '.manifest.json');
      const stats = statSync(filePath);
      
      let manifest = null;
      if (existsSync(manifestPath)) {
        try {
          manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        } catch (e) {
          // Ignore manifest read errors
        }
      }
      
      return {
        name: f,
        path: filePath,
        size: stats.size,
        created: stats.mtime,
        manifest
      };
    })
    .sort((a, b) => b.created - a.created);

  if (backups.length === 0) {
    info('No backups found');
    return;
  }

  console.log(`\n${colors.cyan}Available Backups (${backups.length}):${colors.reset}\n`);
  console.log('  #   Date        Time      Size      Files');
  console.log('  ' + '-'.repeat(50));
  
  backups.forEach((backup, index) => {
    const date = backup.created.toISOString().split('T')[0];
    const time = backup.created.toTimeString().split(' ')[0].substring(0, 5);
    const sizeKB = (backup.size / 1024).toFixed(1).padStart(6);
    const fileCount = backup.manifest ? backup.manifest.fileCount.toString().padStart(3) : '  ?';
    
    const marker = index === 0 ? `${colors.green}►${colors.reset}` : ' ';
    console.log(`  ${marker} ${(index + 1).toString().padStart(2)}  ${date}  ${time}  ${sizeKB} KB  ${fileCount} files`);
  });

  console.log(`\n${colors.yellow}Tip:${colors.reset} Use --date ${backups[0].created.toISOString().split('T')[0]} to restore`);
}

/**
 * Restore from a backup
 */
function restoreBackup(cohort, dateStr) {
  log(`\n🔄 Restoring backup for cohort: ${cohort}`, 'bright');
  
  if (!dateStr) {
    error('Please specify --date YYYY-MM-DD for restore');
  }

  const cohortBackupDir = join(BACKUPS_DIR, cohort);
  
  if (!existsSync(cohortBackupDir)) {
    error(`No backups found for cohort: ${cohort}`);
  }

  // Find backup matching the date
  const backups = readdirSync(cohortBackupDir)
    .filter(f => f.endsWith('.tar.gz') && f.includes(dateStr))
    .map(f => ({
      name: f,
      path: join(cohortBackupDir, f),
      created: statSync(join(cohortBackupDir, f)).mtime
    }))
    .sort((a, b) => b.created - a.created);

  if (backups.length === 0) {
    error(`No backup found for date: ${dateStr}`);
  }

  const backup = backups[0]; // Use the most recent backup for that date
  info(`Found backup: ${backup.name}`);

  const cohortDir = join(COHORTS_DIR, cohort);
  
  // Create backup of current state before restore
  if (existsSync(cohortDir)) {
    const files = getStudentFiles(cohort);
    if (files.length > 0) {
      warn(`Current cohort has ${files.length} file(s). Creating safety backup...`);
      
      const safetyBackupDir = ensureBackupDir(cohort);
      const safetyBackupName = `${cohort}_pre-restore_${getTimestamp()}.tar.gz`;
      const safetyBackupPath = join(safetyBackupDir, safetyBackupName);
      
      try {
        execSync(`tar -czf "${safetyBackupPath}" -C "${COHORTS_DIR}" "${cohort}"`, { stdio: 'pipe' });
        info(`Safety backup created: ${safetyBackupName}`);
      } catch (err) {
        warn(`Could not create safety backup: ${err.message}`);
      }
    }
  }

  // Restore from backup
  try {
    // Ensure cohort directory exists
    if (!existsSync(cohortDir)) {
      mkdirSync(cohortDir, { recursive: true });
    }

    // Extract backup
    const extractCommand = `tar -xzf "${backup.path}" -C "${COHORTS_DIR}"`;
    execSync(extractCommand, { stdio: 'pipe' });

    success(`Restored from: ${backup.name}`);
    
    // Show restored files
    const restoredFiles = getStudentFiles(cohort);
    console.log(`\n${colors.green}Restore Summary:${colors.reset}`);
    console.log(`  Cohort:   ${cohort}`);
    console.log(`  Source:   ${backup.name}`);
    console.log(`  Files:    ${restoredFiles.length} restored`);
    
    if (restoredFiles.length > 0) {
      console.log(`\n  Restored files:`);
      restoredFiles.forEach(f => {
        console.log(`    - ${f.name}`);
      });
    }

  } catch (err) {
    error(`Failed to restore backup: ${err.message}`);
  }
}

/**
 * Main entry point
 */
function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.command) {
    showHelp();
    process.exit(args.help ? 0 : 1);
  }

  if (!args.cohort) {
    error('Please specify --cohort <id>');
  }

  // Validate cohort format (basic check)
  if (!/^\d{4}-\d{2}$/.test(args.cohort)) {
    warn(`Cohort format may be non-standard: ${args.cohort} (expected: YYYY-MM)`);
  }

  switch (args.command) {
    case 'backup':
      createBackup(args.cohort);
      break;
    case 'list':
      listBackups(args.cohort);
      break;
    case 'restore':
      restoreBackup(args.cohort, args.date);
      break;
    default:
      error(`Unknown command: ${args.command}. Use 'backup', 'list', or 'restore'.`);
  }
}

main();
