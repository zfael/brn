#!/bin/bash
# Remove a worktree
# Usage: remove_worktree.sh <repo_name> <branch_name>

set -e

REPO_NAME="$1"
BRANCH_NAME="$2"

if [ -z "$REPO_NAME" ] || [ -z "$BRANCH_NAME" ]; then
    echo "Usage: remove_worktree.sh <repo_name> <branch_name>"
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
WORKTREE_PATH="$WORK_DIR/${REPO_NAME}-worktrees/$BRANCH_NAME"

if [ ! -d "$REPO_PATH" ]; then
    echo "Error: Repository not found at $REPO_PATH"
    exit 1
fi

if [ ! -d "$WORKTREE_PATH" ]; then
    echo "Error: Worktree not found at $WORKTREE_PATH"
    exit 1
fi

cd "$REPO_PATH"

echo "Removing worktree for '$BRANCH_NAME'..."
git worktree remove "$WORKTREE_PATH"

echo "✓ Removed worktree at $WORKTREE_PATH"
