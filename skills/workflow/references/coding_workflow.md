# Coding Workflow

Best practices for the implementation phase.

## Principles

1. **Follow the plan** - Resist scope creep
2. **Work incrementally** - Small, verifiable steps
3. **Commit often** - Atomic, reversible changes
4. **Test as you go** - Don't save testing for the end

## Process

### 1. Set Up Environment

```bash
# Navigate to worktree
cd ~/dev/<workspace>/repo-worktrees/TICKET-branch

# Install dependencies
npm install

# Start dev server if needed
npm run dev
```

### 2. Work Through Plan

For each step in your plan:
1. Write the code
2. Write/update tests
3. Run tests locally
4. Commit

### 3. Commit Practices

#### Commit Message Format
```
<type>(<scope>): <description> [TICKET-KEY]

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes nor adds
- `test`: Adding tests
- `docs`: Documentation
- `chore`: Maintenance

#### Good Commits
```bash
git commit -m "feat(auth): add password reset endpoint [PROJ-123]"
git commit -m "test(auth): add tests for password reset [PROJ-123]"
git commit -m "fix(auth): handle expired tokens gracefully [PROJ-123]"
```

### 4. Handle Blockers

When stuck:
1. Time-box the problem (15-30 min)
2. Document what you've tried
3. Ask for help with context
4. Update plan if approach changes

### 5. Keep Plan Updated

As you work:
- Check off completed steps
- Add discovered steps
- Note any deviations
- Update "Files Changed" section

## Code Quality

### Before Committing
- [ ] Code compiles/runs
- [ ] Tests pass
- [ ] Linter is happy
- [ ] No debug code left
- [ ] No hardcoded secrets

### Code Style
- Follow project conventions
- Match surrounding code style
- Add comments for non-obvious logic
- Use meaningful names
