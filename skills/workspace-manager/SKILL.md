---
name: workspace-manager
description: |
  Manage logical workspaces for organizing development across multiple organizations/contexts.
  Use when: (1) Creating a new workspace for a project/org, (2) Listing available workspaces,
  (3) Switching active workspace, (4) Configuring workspace-specific settings (GitHub/JIRA tokens, work directory).
  Workspaces isolate configuration so you can work on personal projects vs work projects without conflicts.
---

# Workspace Manager

Manage workspaces stored in `~/.brn/config.yaml`. Each workspace represents a logical development context (e.g., "personal", "work", "client-acme").

## Quick Reference

| Action | Script |
|--------|--------|
| Create workspace | `scripts/create_workspace.sh <name> <work_dir>` |
| List workspaces | `scripts/list_workspaces.sh` |
| Show active | `scripts/get_active_workspace.sh` |
| Switch workspace | `scripts/switch_workspace.sh <name>` |
| Configure workspace | `scripts/configure_workspace.sh <name> <key> <value>` |

## Config Structure

### Global: `~/.brn/config.yaml`
```yaml
version: "1.0"
active_workspace: personal
workspaces:
  personal:
    path: ~/dev/personal/auto
    github_token: ghp_xxxx
    jira_token: null
    jira_url: null
    jira_email: null
    # Automation settings (all default to false for safety)
    automation:
      github_auto_push: false      # Auto-push commits
      github_auto_pr: false        # Auto-create PRs
      jira_auto_transition: false  # Auto-update ticket status
      jira_auto_comment: false     # Auto-add comments
  work:
    path: ~/dev/work/auto
    github_token: ghp_yyyy
    jira_token: jira_xxxx
    jira_url: https://company.atlassian.net
    jira_email: you@company.com
    automation:
      github_auto_push: true       # Work flow might be more automated
      github_auto_pr: false
      jira_auto_transition: true
      jira_auto_comment: true
```

## Workflow Examples

### Create a new workspace
```bash
# Create workspace with work directory
./scripts/create_workspace.sh personal ~/dev/personal/auto

# Configure GitHub token
./scripts/configure_workspace.sh personal github_token ghp_xxxxx
```

### Switch context
```bash
# See what's available
./scripts/list_workspaces.sh

# Switch to work context
./scripts/switch_workspace.sh work
```

## Integration

Other brn skills should call `get_active_workspace.sh` to determine which config context to use for API tokens and work directories.
