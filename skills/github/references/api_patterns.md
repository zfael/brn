# GitHub API Patterns

Common patterns for GitHub API integration.

## Authentication

All requests use Bearer token authentication:
```
Authorization: Bearer <token>
```

## Common Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/repos` | GET | List authenticated user's repos |
| `/orgs/{org}/repos` | GET | List org repos |
| `/repos/{owner}/{repo}` | GET | Get repo info |
| `/repos/{owner}/{repo}/pulls` | GET | List PRs |
| `/repos/{owner}/{repo}/pulls` | POST | Create PR |
| `/repos/{owner}/{repo}/issues` | GET | List issues |

## Error Handling

| Code | Meaning | Action |
|------|---------|--------|
| 401 | Bad credentials | Check token |
| 403 | Forbidden | Check token permissions |
| 404 | Not found | Check repo name/permissions |
| 422 | Validation failed | Check request body |

## Rate Limiting

- Authenticated: 5000 requests/hour
- Check `X-RateLimit-Remaining` header
- If rate limited, wait until `X-RateLimit-Reset` timestamp
