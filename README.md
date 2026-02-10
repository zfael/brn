# BRN - AI Developer Workflow Toolkit

**BRN** is a modular skills toolkit designed to supercharge AI assistants and developers by automating complex workflows. It bridges the gap between high-level intent (e.g., "Start working on ticket PROJ-123") and low-level system operations (Git, GitHub API, JIRA API).

## Core Concepts

*   **Workspaces**: Isolated environments for different contexts (e.g., "personal", "work"). Each workspace has its own configuration (API tokens, root directory).
*   **Skills**: Modular units of functionality. Each skill (e.g., `github`, `jira`, `git-worktree`) provides a set of specific commands.
*   **Git Worktrees**: The toolkit manages repositories using the Git worktree pattern, allowing you to work on multiple branches simultaneously in sibling directories without re-cloning.
*   **CLI First**: All functionality is exposed through a unified `brn` CLI.

## Installation

### Prerequisites
*   **Node.js** (v18 or later)
*   **Git**

### Setup
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/zfael/brn.git ~/.brn-toolkit
    cd ~/.brn-toolkit
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Link globally**:
    ```bash
    npm link
    ```
    This makes the `brn` command available globally in your terminal.

---

## Quick Start

### 1. Configure BRN
Run the interactive setup wizard to create your first workspace and configure API tokens.
```bash
brn setup
```
This will create `~/.brn/config.yaml` and prompt you for:
- Workspace name (e.g., "personal")
- Work directory (where code will be stored)
- GitHub & JIRA tokens (optional but recommended)

### 2. Start a Task
To start working on a JIRA ticket:
```bash
brn start PROJ-123
```
This single command:
1.  Fetches ticket details from JIRA.
2.  Finds or clones the correct repository.
3.  Creates a new Git worktree for the feature.
4.  Updates the JIRA ticket status to "In Progress".

---

## Usage Guide

The CLI follows the pattern: `brn <skill> <command> [arguments]`

### 🛠 Workflow
High-level orchestration of development tasks.
- `brn start <ticket_id>`: Start working on a ticket (shortcut for `brn workflow start`).

### 🐙 GitHub (`brn github ...`)
- `list_repos [org]`: List repositories.
- `get_repo_info <owner/repo>`: Get details about a repo.
- `create_pr <owner/repo> <head> <base> <title>`: Create a Pull Request.
- `list_prs <owner/repo>`: List open PRs.

### 📋 JIRA (`brn jira ...`)
- `list_tickets [status]`: List tickets assigned to you.
- `get_ticket <key>`: Get ticket details.
- `update_ticket <key> <status>`: Update ticket status.
- `add_comment <key> <comment>`: Add a comment to a ticket.

### 🌳 Git Worktree (`brn git-worktree ...`)
- `clone_repo <url> [name]`: Clone a repo for worktree usage.
- `create_worktree <repo> <branch>`: Create a new worktree.
- `list_worktrees <repo>`: List active worktrees.
- `remove_worktree <repo> <branch>`: Remove a worktree.

### ⚙️ Workspace (`brn workspace ...`)
- `list`: List all configured workspaces.
- `switch <name>`: Switch the active workspace.

---

## Configuration

Configuration is stored in `~/.brn/config.yaml`.

```yaml
version: "1.0"
active_workspace: personal
workspaces:
  personal:
    path: /Users/me/dev/personal
    github_token: ghp_...
    jira_url: https://myorg.atlassian.net
    jira_email: me@myorg.com
    jira_token: ATATT...
    automation:
      github_auto_push: false
      jira_auto_transition: false
```

### Automation Flags
For safety, automated actions (like pushing code or updating JIRA) are **disabled by default**. You can enable them in `config.yaml` or during `brn setup`.

---

## Architecture

```text
/
├── cli/                # Core CLI logic (brn.ts)
├── skills/             # Modular skills
│   ├── github/         # GitHub integration
│   ├── jira/           # JIRA integration
│   ├── git-worktree/   # Git worktree management
│   ├── workflow/       # Orchestration
│   └── workspace-manager/
├── lib/                # Shared utilities
└── package.json
```

## Development

### Tech Stack
*   **Runtime**: Node.js
*   **Language**: TypeScript
*   **Execution**: `tsx` (TypeScript Execute)
*   **Shell Integration**: `zx` (Google's tool for writing shell scripts in JS)

### Conventions
1.  **TypeScript First**: All new scripts should be written in TypeScript using `zx`.
2.  **Modularity**: Skills should be self-contained in `skills/<skill_name>`.
3.  **Safety**: Destructive actions must be gated by automation flags or confirmation prompts.
