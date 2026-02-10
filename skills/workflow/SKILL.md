---
name: brn:workflow
description: |
  Orchestrate the complete development workflow from ticket to PR.
  Use when: (1) Starting work on a JIRA ticket, (2) Following the planning-coding-review cycle.
---

# Development Workflow Orchestrator

## Description
The Workflow skill orchestrates high-level development tasks that involve multiple other skills (JIRA, Git, GitHub). It is designed to reduce the cognitive load of starting and managing tasks.

## Available Scripts

### `start`
Initiates work on a specific ticket. This script:
1.  Fetches ticket details from JIRA.
2.  Determines the correct repository (based on convention or config).
3.  Creates a new git worktree for the feature branch.
4.  Updates the JIRA ticket status to "In Progress".

*   **Usage**: `brn start <ticket_id>` (Shortcut) or `brn workflow start <ticket_id>`
*   **Arguments**:
    *   `ticket_id`: The JIRA issue key (e.g., `PROJ-123`).
*   **Example**: `brn start PROJ-123`

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                      │
├─────────────────────────────────────────────────────────────┤
│  1. INITIATE                                                │
│     └── brn start <ticket>                                  │
├─────────────────────────────────────────────────────────────┤
│  2. PLAN                                                    │
│     └── Understand requirements → Create implementation plan │
├─────────────────────────────────────────────────────────────┤
│  3. CODE                                                    │
│     └── Implement → Test → Iterate                          │
├─────────────────────────────────────────────────────────────┤
│  4. REVIEW                                                  │
│     └── Self-review → Fix issues → Validate                 │
├─────────────────────────────────────────────────────────────┤
│  5. SHIP                                                    │
│     └── Create PR → Update ticket → Clean up worktree       │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Phases

### Phase 1: Initiate
Start work on a JIRA ticket using the deterministic command:
```bash
brn start PROJ-123
```

### Phase 2: Plan
Create an implementation plan before coding. Read the ticket thoroughly and create a `PLAN.md` in the worktree.

### Phase 3: Code
Implement the solution following the plan. Commit frequently with the ticket ID in the message.

### Phase 4: Review
Self-review before creating PR. Use linter, tests, and type checking.

### Phase 5: Ship

Should always check ~/.brn/config.yaml to confirm automation is enabled.
Should not commit the PLAN.md file.

```bash
# Push branch
git push origin <branch-name>

# Create PR
brn github create_pr <owner/repo> <head> <base> <title>

# Add PR link to ticket
brn jira add_comment <ticket_key> "PR: <url>"

# Update ticket status
brn jira update_ticket <ticket_key> "Code Review"
```

### Phase 6: Clean-up

It should clean-up git worktrees if code change was pushed upstream.

## Detailed Guides
- [Planning Workflow](references/planning_workflow.md)
- [Coding Workflow](references/coding_workflow.md)
- [Review Workflow](references/review_workflow.md)
