# Planning Workflow

Detailed guide for the planning phase of development.

## Purpose

A good plan:
- Reduces wasted effort from misdirection
- Surfaces blockers early
- Creates shared understanding
- Provides a roadmap for implementation

## Process

### 1. Understand the Ticket

Read the ticket completely. Answer:
- What is the user problem being solved?
- What are the acceptance criteria?
- Are there any constraints or requirements?
- Who are the stakeholders?

### 2. Research the Codebase

Before planning changes:
- Find related existing code
- Understand current patterns
- Identify dependencies
- Note any technical debt to address

### 3. Design the Solution

Consider:
- What's the minimal change to solve the problem?
- Are there multiple approaches? Which is best?
- What are the risks of each approach?
- How will this be tested?

### 4. Write the Plan

Create `PLAN.md` in your worktree:

```markdown
# [TICKET-KEY]: [Title]

## Problem Statement
[What problem are we solving?]

## Requirements
- [ ] Requirement from ticket
- [ ] Inferred requirement

## Approach
[High-level description of solution]

### Option A: [Name]
- Pros: ...
- Cons: ...

### Option B: [Name]  
- Pros: ...
- Cons: ...

**Chosen: Option A because...**

## Implementation Steps
1. [ ] Step one
2. [ ] Step two
3. [ ] Step three

## Files to Change
| File | Change |
|------|--------|
| `path/to/file.ts` | Add X |
| `path/to/test.ts` | Add tests for X |

## Testing Strategy
- Unit tests for...
- Integration test for...
- Manual test: ...

## Open Questions
- [ ] Q1: Who to ask?
- [ ] Q2: Research needed?

## Risks
- Risk 1: Mitigation...
```

### 5. Review & Refine

Before coding:
- Does the plan address all requirements?
- Are the steps clear enough to follow?
- Are open questions resolved?
- Get approval if needed
