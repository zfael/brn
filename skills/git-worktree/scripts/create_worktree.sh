#!/bin/bash
# Create a new worktree for a branch
# Usage: create_worktree.sh <repo_name> <branch_name> [base_branch]

set -e

REPO_NAME="$1"
BRANCH_NAME="$2"
BASE_BRANCH="${3:-main}"

if [ -z "$REPO_NAME" ] || [ -z "$BRANCH_NAME" ]; then
    echo "Usage: create_worktree.sh <repo_name> <branch_name> [base_branch]"
    echo "Example: create_worktree.sh my-app PROJ-123-feature main"
    exit 1
fi

# Get the script directory to find workspace-manager
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE_SCRIPT="$SCRIPT_DIR/../../workspace-manager/scripts/get_active_workspace.sh"

if [ ! -f "$WORKSPACE_SCRIPT" ]; then
    echo "Error: workspace-manager skill not found"
    exit 1
fi

# Get workspace config
WORKSPACE_JSON=$("$WORKSPACE_SCRIPT" --json)
WORK_DIR=$(echo "$WORKSPACE_JSON" | yq -r '.path')
WORK_DIR="${WORK_DIR/#\~/$HOME}"

REPO_PATH="$WORK_DIR/$REPO_NAME"
WORKTREES_DIR="$WORK_DIR/${REPO_NAME}-worktrees"
WORKTREE_PATH="$WORKTREES_DIR/$BRANCH_NAME"

if [ ! -d "$REPO_PATH" ]; then
    echo "Error: Repository not found at $REPO_PATH"
    echo "Run clone_repo.sh first"
    exit 1
fi

if [ -d "$WORKTREE_PATH" ]; then
    echo "Worktree already exists at $WORKTREE_PATH"
    exit 0
fi

# Ensure worktrees directory exists
mkdir -p "$WORKTREES_DIR"

# Go to the main repo
cd "$REPO_PATH"

# Fetch latest
echo "Fetching latest from origin..."
git fetch origin

# Try to checkout existing remote branch, or create new one from base
if git show-ref --verify --quiet "refs/remotes/origin/$BRANCH_NAME"; then
    echo "Creating worktree from existing remote branch..."
    git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
else
    echo "Creating new branch '$BRANCH_NAME' from '$BASE_BRANCH'..."
    git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" "origin/$BASE_BRANCH"
fi

echo "✓ Created worktree at $WORKTREE_PATH"
echo "  cd $WORKTREE_PATH"
