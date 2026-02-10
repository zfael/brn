---
name: brn:git-worktree
description: |
  Manage git repositories using the worktree pattern.
  This allows multiple branches to be checked out simultaneously in sibling directories.
---

# Git Worktree Manager

## Description
The git-worktree skill manages repositories using a specific directory structure optimized for multi-tasking. Instead of a single `.git` folder with one working directory, it uses a "bare" clone (or similar) and creates a separate directory for each branch/feature.

## Available Scripts

### `clone_repo`
Clones a repository into the current workspace, setting it up for worktree usage. This creates a directory structure where the main repo is stored, and worktrees can be added alongside it.

*   **Usage**: `brn git-worktree clone_repo <repo_url> [name]`
*   **Arguments**:
    *   `repo_url`: The URL of the git repository to clone.
    *   `name` (optional): The name of the directory to create. Defaults to the repo name from the URL.
*   **Example**: `brn git-worktree clone_repo https://github.com/myorg/api.git`

### `create_worktree`
Creates a new worktree for a specific branch. If the branch doesn't exist, it can be created from a base branch.

*   **Usage**: `brn git-worktree create_worktree <repo_name> <branch_name> [base_branch]`
*   **Arguments**:
    *   `repo_name`: The name of the repository (must be already cloned via `clone_repo`).
    *   `branch_name`: The name of the new branch and worktree directory.
    *   `base_branch` (optional): The branch to split from. Defaults to `main` or `master`.
*   **Example**: `brn git-worktree create_worktree api feature/login`

### `list_worktrees`
Lists all active worktrees for a repository.

*   **Usage**: `brn git-worktree list_worktrees <repo_name>`
*   **Arguments**:
    *   `repo_name`: The name of the repository to list worktrees for.
*   **Example**: `brn git-worktree list_worktrees api`

### `remove_worktree`
Removes a worktree and its directory. This cleans up the working directory and the git worktree entry.

*   **Usage**: `brn git-worktree remove_worktree <repo_name> <branch_name>`
*   **Arguments**:
    *   `repo_name`: The name of the repository.
    *   `branch_name`: The name of the worktree/branch to remove.
*   **Example**: `brn git-worktree remove_worktree api feature/login`
