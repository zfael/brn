---
name: git-worktree
description: |
  Manage git repositories using the worktree pattern for efficient multi-branch development.
  Use when: (1) Cloning a repository for the first time, (2) Creating a new worktree for a feature branch,
  (3) Listing existing worktrees, (4) Removing worktrees after work is complete.
  The worktree pattern clones once and creates lightweight working directories for each branch,
  avoiding the overhead of multiple full clones.
---

# Git Worktree Manager

Manage repositories using git worktrees. This allows working on multiple branches simultaneously without switching or stashing.

## Concept

```
~/dev/personal/auto/
├── my-project/              # Main clone (bare or with default branch)
│   └── .git/
└── my-project-worktrees/    # Worktrees directory
    ├── feature-123/         # Worktree for feature branch
    ├── feature-456/         # Another feature branch
    └── hotfix-789/          # Hotfix branch
```

## Quick Reference

| Action | Script |
|--------|--------|
| Clone repo | `scripts/clone_repo.sh <repo_url> [name]` |
| Create worktree | `scripts/create_worktree.sh <repo_name> <branch_name>` |
| List worktrees | `scripts/list_worktrees.sh <repo_name>` |
| Remove worktree | `scripts/remove_worktree.sh <repo_name> <branch_name>` |

## Workflow Examples

### Start working on a JIRA ticket
```bash
# Clone if not already done
./scripts/clone_repo.sh https://github.com/org/my-app.git

# Create worktree for ticket
./scripts/create_worktree.sh my-app PROJ-123-new-feature

# Work in the worktree directory
cd ~/dev/personal/auto/my-app-worktrees/PROJ-123-new-feature
```

### Clean up after PR merged
```bash
./scripts/remove_worktree.sh my-app PROJ-123-new-feature
```

## Integration

Uses `workspace-manager` to determine the work directory. Repositories are cloned to `<workspace_path>/<repo_name>/` and worktrees are created in `<workspace_path>/<repo_name>-worktrees/`.
