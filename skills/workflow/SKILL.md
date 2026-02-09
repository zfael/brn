---
name: workflow
description: |
  Orchestrate the complete development workflow from ticket to PR.
  Use when: (1) Starting work on a JIRA ticket, (2) Following the planning-coding-review cycle,
  (3) Creating a PR after completing work, (4) Running code review before finalizing.
  This skill ties together workspace-manager, git-worktree, github, and jira skills into a cohesive workflow.
---

# Development Workflow Orchestrator

Guides the complete development cycle: Ticket → Planning → Coding → Review → PR.

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                      │
├─────────────────────────────────────────────────────────────┤
│  1. INITIATE                                                │
│     └── Select ticket → Clone repo → Create worktree        │
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

## Phase 1: Initiate

Start work on a JIRA ticket:

```bash
# 1. List your tickets
npx tsx skills/jira/scripts/list_tickets.ts

# 2. Get ticket details
npx tsx skills/jira/scripts/get_ticket.ts PROJ-123

# 3. Clone repo if needed
./skills/git-worktree/scripts/clone_repo.sh https://github.com/org/repo.git

# 4. Create worktree for the ticket
./skills/git-worktree/scripts/create_worktree.sh repo PROJ-123-feature-name

# 5. Update ticket status
npx tsx skills/jira/scripts/update_ticket.ts PROJ-123 "In Progress"

# 6. Navigate to worktree
cd ~/dev/<workspace>/repo-worktrees/PROJ-123-feature-name
```

## Phase 2: Plan

Create an implementation plan before coding:

1. **Read the ticket thoroughly** - Understand requirements, acceptance criteria
2. **Research the codebase** - Find related code, understand patterns
3. **Create plan document** - Write to `PLAN.md` in the worktree:

```markdown
# PROJ-123: Feature Name

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Approach
1. Step one
2. Step two

## Files to Modify
- `src/module/file.ts` - Add X
- `src/tests/file.test.ts` - Add tests

## Open Questions
- Q1?
```

4. **Get plan approval** - Review with stakeholder if needed

## Phase 3: Code

Implement the solution:

1. **Follow the plan** - Work through requirements systematically
2. **Commit frequently** - Small, atomic commits with clear messages
3. **Write tests** - Unit tests for new code
4. **Run tests** - Ensure nothing is broken

```bash
# Commit format
git commit -m "feat(module): description [PROJ-123]"
```

## Phase 4: Review

Self-review before creating PR:

### Code Review Checklist

- [ ] **Functionality** - Does it work as expected?
- [ ] **Tests** - Are there adequate tests?
- [ ] **Edge cases** - Are edge cases handled?
- [ ] **Error handling** - Are errors handled gracefully?
- [ ] **Performance** - Any obvious performance issues?
- [ ] **Security** - Any security concerns?
- [ ] **Documentation** - Are complex parts documented?
- [ ] **Style** - Does it follow project conventions?

### Run Reviews

```bash
# Run linter
npm run lint

# Run tests
npm test

# Run type check
npm run typecheck
```

## Phase 5: Ship

Create PR and close the loop:

```bash
# 1. Push branch
git push origin PROJ-123-feature-name

# 2. Create PR
npx tsx skills/github/scripts/create_pr.ts org/repo PROJ-123-feature-name main "feat: Add feature [PROJ-123]"

# 3. Add PR link to ticket
npx tsx skills/jira/scripts/add_comment.ts PROJ-123 "PR created: https://github.com/org/repo/pull/XXX"

# 4. Update ticket status
npx tsx skills/jira/scripts/update_ticket.ts PROJ-123 "Code Review"

# 5. After merge, clean up
./skills/git-worktree/scripts/remove_worktree.sh repo PROJ-123-feature-name
```

## Detailed Guides

- [Planning Workflow](references/planning_workflow.md) - Detailed planning process
- [Coding Workflow](references/coding_workflow.md) - Coding best practices
- [Review Workflow](references/review_workflow.md) - Review checklist and process
