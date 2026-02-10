---
name: brn:github
description: |
  Interact with GitHub API for repository and pull request management.
  Use when: (1) Listing repositories, (2) Getting repository info, (3) Creating PRs.
---

# GitHub Integration

## Description
The GitHub skill provides tools to interact with the GitHub API directly from the CLI. It supports authentication via personal access tokens configured in the workspace.

## Available Scripts

### `list_repos`
Lists repositories for a specified organization or user. Useful for discovery.

*   **Usage**: `brn github list_repos [org_or_user]`
*   **Arguments**:
    *   `org_or_user` (optional): The name of the organization or user to list repositories for. If omitted, lists repositories for the authenticated user.
*   **Example**: `brn github list_repos my-org`

### `get_repo_info`
Retrieves detailed information about a specific repository.

*   **Usage**: `brn github get_repo_info <owner/repo>`
*   **Arguments**:
    *   `owner/repo`: The full repository name (e.g., `facebook/react`).
*   **Example**: `brn github get_repo_info my-org/my-project`

### `create_pr`
Creates a Pull Request on GitHub.

*   **Usage**: `brn github create_pr <owner/repo> <head> <base> <title>`
*   **Arguments**:
    *   `owner/repo`: The full repository name.
    *   `head`: The name of the branch where your changes are implemented.
    *   `base`: The name of the branch you want to merge into (e.g., `main`).
    *   `title`: The title of the Pull Request.
*   **Example**: `brn github create_pr my-org/my-project feature/login main "feat: Add login page"`

### `list_prs`
Lists open Pull Requests for a repository.

*   **Usage**: `brn github list_prs <owner/repo>`
*   **Arguments**:
    *   `owner/repo`: The full repository name.
*   **Example**: `brn github list_prs my-org/my-project`

## API Reference
See [references/api_patterns.md](references/api_patterns.md) for error handling and patterns.
