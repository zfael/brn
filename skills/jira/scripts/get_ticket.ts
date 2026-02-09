#!/usr/bin/env npx tsx
/**
 * Get JIRA ticket details
 * Usage: npx tsx get_ticket.ts <ticket_key>
 */
import { jiraRequest, getJiraConfig } from "../../../lib/utils.js";

interface Issue {
    key: string;
    fields: {
        summary: string;
        status: { name: string };
        issuetype: { name: string };
        priority: { name: string } | null;
        assignee: { displayName: string } | null;
        reporter: { displayName: string } | null;
        created: string;
        updated: string;
        description: unknown;
    };
}

function extractText(node: unknown): string {
    if (typeof node !== "object" || node === null) return "";

    const obj = node as Record<string, unknown>;

    if (obj.type === "text" && typeof obj.text === "string") {
        return obj.text;
    }

    if (Array.isArray(obj.content)) {
        return obj.content.map(extractText).join(" ");
    }

    return "";
}

const ticketKey = process.argv[2];

if (!ticketKey) {
    console.log("Usage: npx tsx get_ticket.ts <ticket_key>");
    console.log("Example: npx tsx get_ticket.ts PROJ-123");
    process.exit(1);
}

const { url } = getJiraConfig();
const issue = await jiraRequest<Issue>(`/rest/api/3/issue/${ticketKey}`);

const { fields } = issue;

console.log(`Ticket: ${issue.key}`);
console.log("=".repeat(60));
console.log(`Summary:     ${fields.summary}`);
console.log(`Status:      ${fields.status.name}`);
console.log(`Type:        ${fields.issuetype.name}`);
console.log(`Priority:    ${fields.priority?.name ?? "None"}`);
console.log(`Assignee:    ${fields.assignee?.displayName ?? "Unassigned"}`);
console.log(`Reporter:    ${fields.reporter?.displayName ?? "Unknown"}`);
console.log(`Created:     ${fields.created.slice(0, 10)}`);
console.log(`Updated:     ${fields.updated.slice(0, 10)}`);
console.log();

if (fields.description) {
    console.log("Description:");
    console.log("-".repeat(40));
    console.log(extractText(fields.description));
}

console.log();
console.log(`URL: ${url}/browse/${issue.key}`);
