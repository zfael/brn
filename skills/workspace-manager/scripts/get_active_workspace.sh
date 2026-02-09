#!/bin/bash
# Get the active workspace name and config
# Usage: get_active_workspace.sh [--json]

CONFIG_FILE="$HOME/.brn/config.yaml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: No config found at $CONFIG_FILE"
    exit 1
fi

if command -v yq &> /dev/null; then
    ACTIVE=$(yq '.active_workspace' "$CONFIG_FILE")
    
    if [ "$1" = "--json" ]; then
        # Output full workspace config as JSON
        yq -o=json ".workspaces.$ACTIVE" "$CONFIG_FILE"
    else
        echo "$ACTIVE"
    fi
else
    echo "Error: yq required for this operation"
    exit 1
fi
