#!/usr/bin/env npx tsx
/**
 * Add a comment to a JIRA ticket
 * Usage: npx tsx add_comment.ts <ticket_key> <comment>
 */
import { jiraRequest } from "../../../lib/utils.js";

const ticketKey = process.argv[2];
const commentText = process.argv.slice(3).join(" ");

if (!ticketKey || !commentText) {
    console.log("Usage: npx tsx add_comment.ts <ticket_key> <comment>");
    console.log("Example: npx tsx add_comment.ts PROJ-123 'PR created: https://...'");
    process.exit(1);
}

// JIRA API v3 uses ADF format for comments
const body = {
    body: {
        type: "doc",
        version: 1,
        content: [
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: commentText,
                    },
                ],
            },
        ],
    },
};

await jiraRequest(`/rest/api/3/issue/${ticketKey}/comment`, {
    method: "POST",
    body: JSON.stringify(body),
});

console.log(`✓ Added comment to ${ticketKey}`);
