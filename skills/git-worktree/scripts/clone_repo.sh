#!/bin/bash
# Clone a repository to the active workspace
# Usage: clone_repo.sh <repo_url> [name]

set -e

REPO_URL="$1"
REPO_NAME="$2"

if [ -z "$REPO_URL" ]; then
    echo "Usage: clone_repo.sh <repo_url> [name]"
    echo "Example: clone_repo.sh https://github.com/org/my-app.git"
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

# Derive repo name from URL if not provided
if [ -z "$REPO_NAME" ]; then
    REPO_NAME=$(basename "$REPO_URL" .git)
fi

REPO_PATH="$WORK_DIR/$REPO_NAME"

if [ -d "$REPO_PATH" ]; then
    echo "Repository already exists at $REPO_PATH"
    exit 0
fi

# Create work directory if needed
mkdir -p "$WORK_DIR"

# Clone the repository
echo "Cloning $REPO_URL to $REPO_PATH..."
git clone "$REPO_URL" "$REPO_PATH"

# Create worktrees directory
mkdir -p "$WORK_DIR/${REPO_NAME}-worktrees"

echo "✓ Cloned '$REPO_NAME' to $REPO_PATH"
echo "  Worktrees will be created in: $WORK_DIR/${REPO_NAME}-worktrees/"
