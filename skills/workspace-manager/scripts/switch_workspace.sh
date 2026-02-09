#!/bin/bash
# Switch to a different workspace
# Usage: switch_workspace.sh <name>

set -e

WORKSPACE_NAME="$1"

if [ -z "$WORKSPACE_NAME" ]; then
    echo "Usage: switch_workspace.sh <name>"
    exit 1
fi

CONFIG_FILE="$HOME/.brn/config.yaml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: No config found. Create a workspace first."
    exit 1
fi

if command -v yq &> /dev/null; then
    # Check if workspace exists
    if ! yq -e ".workspaces.$WORKSPACE_NAME" "$CONFIG_FILE" &> /dev/null; then
        echo "Error: Workspace '$WORKSPACE_NAME' not found"
        echo "Available workspaces:"
        yq -r '.workspaces | keys | .[]' "$CONFIG_FILE"
        exit 1
    fi
    
    # Update active workspace
    yq -i ".active_workspace = \"$WORKSPACE_NAME\"" "$CONFIG_FILE"
    
    path=$(yq -r ".workspaces.$WORKSPACE_NAME.path" "$CONFIG_FILE")
    echo "✓ Switched to workspace '$WORKSPACE_NAME' ($path)"
else
    echo "Error: yq required for this operation"
    exit 1
fi
