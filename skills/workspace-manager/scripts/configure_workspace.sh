#!/bin/bash
# Configure a workspace setting
# Usage: configure_workspace.sh <workspace_name> <key> <value>
# Keys: github_token, jira_token, jira_url, jira_email, path
# Automation keys: automation.github_auto_push, automation.github_auto_pr,
#                  automation.jira_auto_transition, automation.jira_auto_comment

set -e

WORKSPACE_NAME="$1"
KEY="$2"
VALUE="$3"

if [ -z "$WORKSPACE_NAME" ] || [ -z "$KEY" ] || [ -z "$VALUE" ]; then
    echo "Usage: configure_workspace.sh <workspace_name> <key> <value>"
    echo ""
    echo "Standard keys: github_token, jira_token, jira_url, jira_email, path"
    echo ""
    echo "Automation keys (default: false):"
    echo "  automation.github_auto_push      - Auto-push commits"
    echo "  automation.github_auto_pr        - Auto-create PRs"
    echo "  automation.jira_auto_transition  - Auto-update ticket status"
    echo "  automation.jira_auto_comment     - Auto-add comments"
    echo ""
    echo "Examples:"
    echo "  configure_workspace.sh personal github_token ghp_xxxxx"
    echo "  configure_workspace.sh work automation.jira_auto_transition true"
    exit 1
fi

CONFIG_FILE="$HOME/.brn/config.yaml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: No config found. Create a workspace first."
    exit 1
fi

# Validate key
VALID_KEYS="github_token jira_token jira_url jira_email path"
VALID_AUTOMATION_KEYS="automation.github_auto_push automation.github_auto_pr automation.jira_auto_transition automation.jira_auto_comment"

IS_VALID=false
if [[ " $VALID_KEYS " =~ " $KEY " ]]; then
    IS_VALID=true
fi
if [[ " $VALID_AUTOMATION_KEYS " =~ " $KEY " ]]; then
    IS_VALID=true
fi

if [ "$IS_VALID" = false ]; then
    echo "Error: Invalid key '$KEY'"
    echo "Valid keys: $VALID_KEYS"
    echo "Automation keys: $VALID_AUTOMATION_KEYS"
    exit 1
fi

if command -v yq &> /dev/null; then
    # Check if workspace exists
    if ! yq -e ".workspaces.$WORKSPACE_NAME" "$CONFIG_FILE" &> /dev/null; then
        echo "Error: Workspace '$WORKSPACE_NAME' not found"
        exit 1
    fi
    
    # Handle automation keys (nested)
    if [[ "$KEY" == automation.* ]]; then
        AUTOMATION_KEY="${KEY#automation.}"
        
        # Convert string to boolean if needed
        if [ "$VALUE" = "true" ]; then
            yq -i ".workspaces.$WORKSPACE_NAME.automation.$AUTOMATION_KEY = true" "$CONFIG_FILE"
        elif [ "$VALUE" = "false" ]; then
            yq -i ".workspaces.$WORKSPACE_NAME.automation.$AUTOMATION_KEY = false" "$CONFIG_FILE"
        else
            echo "Error: Automation values must be 'true' or 'false'"
            exit 1
        fi
    else
        # Update standard setting
        yq -i ".workspaces.$WORKSPACE_NAME.$KEY = \"$VALUE\"" "$CONFIG_FILE"
    fi
    
    echo "✓ Set $KEY for workspace '$WORKSPACE_NAME'"
else
    echo "Error: yq required for this operation"
    exit 1
fi

