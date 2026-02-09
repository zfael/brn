#!/bin/bash
# List all configured workspaces
# Usage: list_workspaces.sh

CONFIG_FILE="$HOME/.brn/config.yaml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "No workspaces configured. Run create_workspace.sh first."
    exit 0
fi

# Get active workspace
if command -v yq &> /dev/null; then
    ACTIVE=$(yq '.active_workspace' "$CONFIG_FILE")
    
    echo "Workspaces:"
    echo "==========="
    
    # List all workspaces
    yq -r '.workspaces | keys | .[]' "$CONFIG_FILE" | while read -r ws; do
        path=$(yq -r ".workspaces.$ws.path" "$CONFIG_FILE")
        if [ "$ws" = "$ACTIVE" ]; then
            echo "* $ws ($path) [ACTIVE]"
        else
            echo "  $ws ($path)"
        fi
    done
else
    echo "Warning: yq not found. Showing raw config:"
    cat "$CONFIG_FILE"
fi
