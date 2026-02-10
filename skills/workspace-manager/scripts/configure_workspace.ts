#!/usr/bin/env npx tsx
/**
 * Configure a workspace setting
 * Usage: npx tsx configure_workspace.ts <workspace_name> <key> <value>
 */
import { getBrnConfig, saveBrnConfig } from "../../../lib/utils.js";

const workspaceName = process.argv[2];
const key = process.argv[3];
const value = process.argv[4];

if (!workspaceName || !key || !value) {
    console.log("Usage: configure_workspace.ts <workspace_name> <key> <value>");
    console.log("");
    console.log("Standard keys: github_token, jira_token, jira_url, jira_email, path");
    console.log("");
    console.log("Automation keys (default: false):");
    console.log("  automation.github_auto_push      - Auto-push commits");
    console.log("  automation.github_auto_pr        - Auto-create PRs");
    console.log("  automation.jira_auto_transition  - Auto-update ticket status");
    console.log("  automation.jira_auto_comment     - Auto-add comments");
    process.exit(1);
}

const config = getBrnConfig();

if (!config.workspaces[workspaceName]) {
    console.error(`Error: Workspace '${workspaceName}' not found`);
    process.exit(1);
}

// Validate key
const validKeys = ["github_token", "github_org", "jira_token", "jira_url", "jira_email", "path"];
const validAutomationKeys = [
    "automation.github_auto_push",
    "automation.github_auto_pr",
    "automation.jira_auto_transition",
    "automation.jira_auto_comment"
];

let isValid = validKeys.includes(key) || validAutomationKeys.includes(key);

if (!isValid) {
    console.error(`Error: Invalid key '${key}'`);
    console.log(`Valid keys: ${validKeys.join(", ")}`);
    console.log(`Automation keys: ${validAutomationKeys.join(", ")}`);
    process.exit(1);
}

// Handle automation keys (nested)
if (key.startsWith("automation.")) {
    const automationKey = key.replace("automation.", "");
    const boolValue = value === "true";
    
    if (value !== "true" && value !== "false") {
        console.error("Error: Automation values must be 'true' or 'false'");
        process.exit(1);
    }

    if (!config.workspaces[workspaceName].automation) {
        config.workspaces[workspaceName].automation = {};
    }

    (config.workspaces[workspaceName].automation as any)[automationKey] = boolValue;
} else {
    (config.workspaces[workspaceName] as any)[key] = value;
}

saveBrnConfig(config);
console.log(`✓ Set ${key} for workspace '${workspaceName}'`);
