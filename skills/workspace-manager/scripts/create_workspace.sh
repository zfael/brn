#!/bin/bash
# Create a new workspace in ~/.brn/config.yaml
# Usage: create_workspace.sh <name> <work_dir>

set -e

WORKSPACE_NAME="$1"
WORK_DIR="$2"

if [ -z "$WORKSPACE_NAME" ] || [ -z "$WORK_DIR" ]; then
    echo "Usage: create_workspace.sh <name> <work_dir>"
    echo "Example: create_workspace.sh personal ~/dev/personal/auto"
    exit 1
fi

CONFIG_DIR="$HOME/.brn"
CONFIG_FILE="$CONFIG_DIR/config.yaml"

# Create config directory if it doesn't exist
mkdir -p "$CONFIG_DIR"

# Expand work_dir path
WORK_DIR="${WORK_DIR/#\~/$HOME}"

# Create initial config if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
    cat > "$CONFIG_FILE" << EOF
version: "1.0"
active_workspace: $WORKSPACE_NAME
workspaces: {}
EOF
fi

# Check if yq is available, if not use a simple approach
if command -v yq &> /dev/null; then
    # Check if workspace already exists
    if yq -e ".workspaces.$WORKSPACE_NAME" "$CONFIG_FILE" &> /dev/null; then
        echo "Error: Workspace '$WORKSPACE_NAME' already exists"
        exit 1
    fi
    
    # Add the workspace
    yq -i ".workspaces.$WORKSPACE_NAME = {
        \"path\": \"$WORK_DIR\",
        \"github_token\": null,
        \"jira_token\": null,
        \"jira_url\": null
    }" "$CONFIG_FILE"
else
    echo "Warning: yq not found. Please install yq for YAML manipulation."
    echo "Attempting basic file append..."
    
    # Basic approach: append to file (user may need to clean up formatting)
    cat >> "$CONFIG_FILE" << EOF
  $WORKSPACE_NAME:
    path: $WORK_DIR
    github_token: null
    jira_token: null
    jira_url: null
EOF
fi

# Create the work directory
mkdir -p "$WORK_DIR"

echo "✓ Created workspace '$WORKSPACE_NAME' at $WORK_DIR"
