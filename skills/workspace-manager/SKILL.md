---
name: brn:workspace-manager
description: |
  Manage isolated configurations (tokens, paths) for different contexts.
---

# Workspace Manager

## Description
The Workspace Manager skill handles the configuration for the BRN toolkit. It allows you to maintain separate environments (e.g., "personal" vs "work") with their own API tokens, directories, and preferences.

## Available Scripts

### `create_workspace`
Creates a new workspace configuration.

*   **Usage**: `brn workspace-manager create_workspace <name> <dir>`
*   **Arguments**:
    *   `name`: The unique name for the workspace (e.g., "work", "personal").
    *   `dir`: The root directory where repositories and worktrees will be stored.
*   **Example**: `brn workspace-manager create_workspace personal ~/dev/personal/auto`

### `configure_workspace`
Updates a specific configuration key for a workspace.

*   **Usage**: `brn workspace-manager configure_workspace <workspace_name> <key> <value>`
*   **Arguments**:
    *   `workspace_name`: The name of the workspace to configure.
    *   `key`: The configuration key (e.g., `github_token`, `jira_url`).
    *   `value`: The value to set.
*   **Example**: `brn workspace-manager configure_workspace personal github_token ghp_123456789`

### `list_workspaces`
Lists all configured workspaces.

*   **Usage**: `brn workspace-manager list_workspaces`
*   **Alternative**: `brn workspace list` (CLI shortcut)

### `switch_workspace`
Switches the active workspace.

*   **Usage**: `brn workspace-manager switch_workspace <name>`
*   **Alternative**: `brn workspace switch <name>` (CLI shortcut)
*   **Arguments**:
    *   `name`: The name of the workspace to activate.
*   **Example**: `brn workspace switch work`

## Workspace Config
Configuration is stored in `~/.brn/config.yaml`. It is recommended to use `brn setup` for an interactive wizard when initializing the tool for the first time.
