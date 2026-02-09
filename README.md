# BRN - AI Developer Workflow Toolkit

A modular skills toolkit for automating developer workflows with AI assistants like **Claude Code** and **GitHub Copilot CLI**.

## Installation

### For Claude Code Projects
```bash
npx skills add zfael/brn
```
This installs brn skills into your current project's `.claude/skills/` directory.

### Global Install (use brn CLI anywhere)
```bash
git clone https://github.com/zfael/brn.git ~/.brn
cd ~/.brn && npm install
npm link  # Makes 'brn' command available globally
```

---

## Quick Start

### 1. Run Setup
```bash
brn setup
```

The interactive wizard guides you through:
- Creating a workspace (e.g., "personal" or "work")
- Setting your work directory
- Configuring GitHub/JIRA tokens
- Choosing automation settings (all OFF by default)

### 2. Start Using
Ask your AI assistant:
- *"List my JIRA tickets"*
- *"Create a worktree for ticket PROJ-123"*
- *"Start the workflow for this ticket"*

---

## Skills Included

| Skill | Triggers | Purpose |
|-------|----------|---------|
| `workspace-manager` | "create workspace", "switch workspace" | Manage isolated configs per org |
| `git-worktree` | "clone repo", "create worktree" | Git operations with worktree pattern |
| `github` | "list repos", "create PR" | GitHub API integration |
| `jira` | "list my tickets", "update ticket" | JIRA API integration |
| `workflow` | "start workflow", "begin work on ticket" | Full dev cycle orchestration |

---

## CLI Commands

```bash
brn setup                    # Interactive setup wizard
brn workspace list           # List all workspaces
brn workspace switch <name>  # Switch active workspace
brn help                     # Show help
```

---

## Configuration

Config is stored in `~/.brn/config.yaml`:
```yaml
version: "1.0"
active_workspace: personal
workspaces:
  personal:
    path: ~/dev/personal/auto
    github_token: ghp_xxx
    jira_url: https://company.atlassian.net
    jira_email: you@email.com
    jira_token: your_api_token
    automation:
      github_auto_push: false      # Default: OFF
      github_auto_pr: false        # Default: OFF
      jira_auto_transition: false  # Default: OFF
      jira_auto_comment: false     # Default: OFF
```

### Automation Settings
All mutative actions are **OFF by default** for safety. Configure via:
- `brn setup` (interactive)
- Or manually with workspace scripts

---

## Requirements

- Node.js 18+
- Git
- `yq` for workspace scripts (`brew install yq`)

---

## Links

- [skills.sh Directory](https://skills.sh/)
- [GitHub Repository](https://github.com/zfael/brn)
