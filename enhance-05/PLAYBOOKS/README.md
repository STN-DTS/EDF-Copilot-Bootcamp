# enhance-05 Playbooks

Reference documentation for handling common scenarios during multi-agent orchestration.

## Available Playbooks

| Playbook | Description |
|----------|-------------|
| [ERROR_RECOVERY.md](ERROR_RECOVERY.md) | How to recover from agent failures |
| [COMMON_FAILURES.md](COMMON_FAILURES.md) | Catalog of common failures and solutions |

## When to Use

- **Before starting a phase:** Review potential issues
- **During agent execution:** Reference if problems occur
- **After phase completion:** Document new patterns learned

## Quick Reference

### Agent Won't Start
→ See [ERROR_RECOVERY.md](ERROR_RECOVERY.md) section "Agent Timeout"

### File Conflict
→ See [ERROR_RECOVERY.md](ERROR_RECOVERY.md) section "File Already Exists"

### Signal Missing
→ See [ERROR_RECOVERY.md](ERROR_RECOVERY.md) section "Signal File Missing"

### Package.json Broken
→ See [ERROR_RECOVERY.md](ERROR_RECOVERY.md) section "Package.json Merge Conflict"

### Unknown Error
→ See [COMMON_FAILURES.md](COMMON_FAILURES.md) for error code lookup
