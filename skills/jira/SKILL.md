---
name: jira
description: |
  Interact with JIRA API for ticket management and tracking.
  Use when: (1) Listing tickets assigned to current user, (2) Getting ticket details,
  (3) Updating ticket status/transitions, (4) Adding comments to tickets.
  Uses jira_token and jira_url from the active workspace configuration.
---

# JIRA Integration

Interact with JIRA API using workspace-configured tokens.

## Quick Reference

| Action | Script |
|--------|--------|
| List my tickets | `npx tsx scripts/list_tickets.ts` |
| Get ticket details | `npx tsx scripts/get_ticket.ts <ticket_key>` |
| Update ticket status | `npx tsx scripts/update_ticket.ts <ticket_key> <transition>` |
| Add comment | `npx tsx scripts/add_comment.ts <ticket_key> <comment>` |

## Prerequisites

Configure JIRA access in your workspace:
```bash
# Set JIRA Cloud URL
./skills/workspace-manager/scripts/configure_workspace.sh work jira_url https://company.atlassian.net

# Set API token (create at https://id.atlassian.com/manage-profile/security/api-tokens)
./skills/workspace-manager/scripts/configure_workspace.sh work jira_token your_api_token

# Set your JIRA email (required for auth)
./skills/workspace-manager/scripts/configure_workspace.sh work jira_email your@email.com
```

## Workflow Examples

### Start working on a ticket
```bash
# See what's assigned to you
npx tsx scripts/list_tickets.ts

# Get details for a specific ticket
npx tsx scripts/get_ticket.ts PROJ-123

# Move to "In Progress"
npx tsx scripts/update_ticket.ts PROJ-123 "In Progress"
```

### After completing work
```bash
# Add a comment
npx tsx scripts/add_comment.ts PROJ-123 "PR created: https://github.com/..."

# Move to "Code Review"
npx tsx scripts/update_ticket.ts PROJ-123 "Code Review"
```

## API Reference

See [references/api_patterns.md](references/api_patterns.md) for JIRA API patterns.
