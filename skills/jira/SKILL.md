---
name: brn:jira
description: |
  Interact with JIRA API for ticket management and tracking.
  Use when: (1) Listing assigned tickets, (2) Getting details, (3) Updating status.
---

# JIRA Integration

## Description
The JIRA skill allows you to manage your tasks without leaving the terminal. It connects to your JIRA instance using the credentials configured in your workspace.

## Available Scripts

### `list_tickets`
Lists JIRA tickets assigned to the current user. Can be filtered by status.

*   **Usage**: `brn jira list_tickets [status]`
*   **Arguments**:
    *   `status` (optional): Filter tickets by status (e.g., "In Progress", "To Do").
*   **Example**: `brn jira list_tickets "In Progress"`

### `get_ticket`
Retrieves detailed information about a specific JIRA ticket.

*   **Usage**: `brn jira get_ticket <ticket_key>`
*   **Arguments**:
    *   `ticket_key`: The JIRA issue key (e.g., `PROJ-123`).
*   **Example**: `brn jira get_ticket PROJ-123`

### `update_ticket`
Updates the status (transition) of a JIRA ticket.

*   **Usage**: `brn jira update_ticket <ticket_key> <transition>`
*   **Arguments**:
    *   `ticket_key`: The JIRA issue key.
    *   `transition`: The name of the transition/status to move to (e.g., "In Progress", "Done").
*   **Example**: `brn jira update_ticket PROJ-123 "In Progress"`

### `add_comment`
Adds a comment to a JIRA ticket.

*   **Usage**: `brn jira add_comment <ticket_key> <comment>`
*   **Arguments**:
    *   `ticket_key`: The JIRA issue key.
    *   `comment`: The text content of the comment.
*   **Example**: `brn jira add_comment PROJ-123 "Released in version 1.2.0"`

## API Reference
See [references/api_patterns.md](references/api_patterns.md) for patterns.
