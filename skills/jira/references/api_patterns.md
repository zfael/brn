# JIRA API Patterns

Common patterns for JIRA Cloud API integration.

## Authentication

JIRA Cloud uses Basic Auth with email and API token:
```
Authorization: Basic base64(email:api_token)
```

Create API token at: https://id.atlassian.com/manage-profile/security/api-tokens

## Common Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/rest/api/3/search` | GET | Search issues with JQL |
| `/rest/api/3/issue/{key}` | GET | Get issue details |
| `/rest/api/3/issue/{key}/transitions` | GET | Get available transitions |
| `/rest/api/3/issue/{key}/transitions` | POST | Transition issue |
| `/rest/api/3/issue/{key}/comment` | POST | Add comment |

## JQL Examples

```
# My open tickets
assignee = currentUser() AND status != Done

# In progress in a project
project = PROJ AND status = "In Progress"

# Recently updated
assignee = currentUser() ORDER BY updated DESC
```

## Error Handling

| Code | Meaning | Action |
|------|---------|--------|
| 401 | Unauthorized | Check email/token |
| 403 | Forbidden | Check permissions |
| 404 | Not found | Check issue key |

## ADF Format

JIRA API v3 uses Atlassian Document Format for rich text:
```json
{
  "type": "doc",
  "version": 1,
  "content": [
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Hello"}]
    }
  ]
}
```
