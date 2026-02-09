#!/usr/bin/env npx tsx
/**
 * List JIRA tickets assigned to current user
 * Usage: npx tsx list_tickets.ts [status]
 */
import { jiraRequest } from "../../../lib/utils.js";

interface Issue {
    key: string;
    fields: {
        summary: string;
        status: { name: string };
        priority: { name: string } | null;
    };
}

interface SearchResult {
    issues: Issue[];
}

const statusFilter = process.argv[2];

let jql = "assignee = currentUser() ORDER BY updated DESC";
if (statusFilter) {
    jql = `assignee = currentUser() AND status = "${statusFilter}" ORDER BY updated DESC`;
}

const data = await jiraRequest<SearchResult>(
    `/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=20`
);

const issues = data.issues;

console.log(`Your Tickets (${issues.length} found):`);
console.log("=".repeat(60));

if (issues.length === 0) {
    console.log("No tickets found.");
    process.exit(0);
}

const statusEmoji: Record<string, string> = {
    "To Do": "📋",
    "In Progress": "🔧",
    "Code Review": "👀",
    Done: "✅",
};

for (const issue of issues) {
    const { key, fields } = issue;
    const summary = fields.summary.slice(0, 50);
    const status = fields.status.name;
    const priority = fields.priority?.name ?? "None";
    const emoji = statusEmoji[status] ?? "📌";

    console.log(`${emoji} ${key}: ${summary}`);
    console.log(`   Status: ${status} | Priority: ${priority}`);
    console.log();
}
