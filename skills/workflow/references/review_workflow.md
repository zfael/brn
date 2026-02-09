# Review Workflow

Self-review process before creating a PR.

## Purpose

Self-review catches:
- Obvious bugs before reviewers see them
- Style issues that slow down review
- Missing tests or documentation
- Opportunities for improvement

## Pre-Review Checks

### 1. Automated Checks

```bash
# Run all checks
npm run lint
npm run typecheck
npm test
npm run build
```

All must pass before proceeding.

### 2. Diff Review

Review your own diff as if reviewing someone else's code:

```bash
# See what you're about to submit
git diff main...HEAD
```

For each file, ask:
- Does this change make sense?
- Is there unnecessary code?
- Are there any obvious bugs?
- Does the logic flow clearly?

### 3. Code Quality Checklist

#### Functionality
- [ ] Meets all acceptance criteria
- [ ] Handles edge cases
- [ ] Error states handled gracefully
- [ ] No regressions in existing behavior

#### Testing
- [ ] New code has tests
- [ ] Tests are meaningful (not just coverage)
- [ ] Edge cases tested
- [ ] Error paths tested

#### Security
- [ ] No secrets in code
- [ ] Input validation present
- [ ] No SQL injection / XSS vectors
- [ ] Auth/authz properly enforced

#### Performance
- [ ] No N+1 queries
- [ ] No unnecessary loops
- [ ] Large data handled appropriately
- [ ] No memory leaks

#### Maintainability
- [ ] Code is readable
- [ ] Complex logic documented
- [ ] No magic numbers
- [ ] DRY principles followed

### 4. Documentation

- [ ] README updated if needed
- [ ] API docs updated
- [ ] Inline comments for complex code
- [ ] CHANGELOG updated if needed

### 5. Final Verification

- [ ] Feature works end-to-end manually
- [ ] Works in all required environments
- [ ] No console errors/warnings
- [ ] Performance is acceptable

## Common Issues to Check

| Issue | How to Check |
|-------|--------------|
| Unused imports | Linter should catch |
| Console.log left in | `grep -r "console.log" src/` |
| TODO comments | `grep -r "TODO" src/` |
| Debugging code | Search for `debugger`, test data |
| Hardcoded values | Search for magic strings/numbers |

## After Review

Once checks pass:
1. Push to remote
2. Create PR with good description
3. Link to ticket
4. Request reviewers
