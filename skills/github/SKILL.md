---
name: github
description: |
  Interact with GitHub API for repository and pull request management.
  Use when: (1) Listing repositories in an organization/user, (2) Getting repository info,
  (3) Creating pull requests, (4) Viewing PR status and reviews.
  Uses the github_token from the active workspace configuration.
---

# GitHub Integration

Interact with GitHub API using workspace-configured tokens.

## Quick Reference

| Action | Script |
|--------|--------|
| List repos | `npx tsx scripts/list_repos.ts [org_or_user]` |
| Get repo info | `npx tsx scripts/get_repo_info.ts <owner/repo>` |
| Create PR | `npx tsx scripts/create_pr.ts <owner/repo> <head> <base> <title>` |
| List PRs | `npx tsx scripts/list_prs.ts <owner/repo>` |

## Prerequisites

Configure GitHub token in your workspace:
```bash
# Using workspace-manager
./skills/workspace-manager/scripts/configure_workspace.sh personal github_token ghp_xxxxx
```

## Workflow Examples

### After finishing a feature
```bash
# Create PR from feature branch to main
npx tsx scripts/create_pr.ts myorg/my-app PROJ-123-feature main "feat: Add new feature"

# Check PR status
npx tsx scripts/list_prs.ts myorg/my-app
```

### Find repos to work on
```bash
# List all repos in your org
npx tsx scripts/list_repos.ts myorg
```

## API Reference

See [references/api_patterns.md](references/api_patterns.md) for common GitHub API patterns and error handling.
