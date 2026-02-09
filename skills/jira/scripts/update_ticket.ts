#!/usr/bin/env npx tsx
/**
 * Update JIRA ticket status via transition
 * Usage: npx tsx update_ticket.ts <ticket_key> <target_status>
 */
import { jiraRequest } from "../../../lib/utils.js";

interface Transition {
    id: string;
    name: string;
}

interface TransitionsResponse {
    transitions: Transition[];
}

const [ticketKey, targetStatus] = process.argv.slice(2);

if (!ticketKey || !targetStatus) {
    console.log("Usage: npx tsx update_ticket.ts <ticket_key> <target_status>");
    console.log("Example: npx tsx update_ticket.ts PROJ-123 'In Progress'");
    process.exit(1);
}

// Get available transitions
const { transitions } = await jiraRequest<TransitionsResponse>(
    `/rest/api/3/issue/${ticketKey}/transitions`
);

// Find matching transition (case-insensitive)
const transition = transitions.find(
    (t) => t.name.toLowerCase() === targetStatus.toLowerCase()
);

if (!transition) {
    console.error(`Error: Transition '${targetStatus}' not available`);
    console.error("Available transitions:");
    for (const t of transitions) {
        console.error(`  - ${t.name}`);
    }
    process.exit(1);
}

// Perform transition
await jiraRequest(`/rest/api/3/issue/${ticketKey}/transitions`, {
    method: "POST",
    body: JSON.stringify({ transition: { id: transition.id } }),
});

console.log(`✓ Transitioned ${ticketKey} to '${targetStatus}'`);
