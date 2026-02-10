#!/usr/bin/env npx tsx
/**
 * Initiate a new development workflow for a JIRA ticket
 * Usage: npx tsx start.ts <ticket_id>
 */
import { $ } from "zx";
import { getActiveWorkspace, jiraRequest } from "../../../lib/utils.js";
import { join } from "path";
import { existsSync } from "fs";
import { homedir } from "os";

$.verbose = false;

const ticketId = process.argv[2];

if (!ticketId) {
    console.log("Usage: npx tsx start.ts <ticket_id>");
    console.log("Example: npx tsx start.ts PROJ-123");
    process.exit(1);
}

async function run() {
    console.log(`🚀 Initiating workflow for ${ticketId}...`);

    // 1. Fetch ticket details
    console.log(`📋 Fetching ticket ${ticketId}...`);
    const ticket: any = await jiraRequest(`/rest/api/3/issue/${ticketId}`);
    const summary = ticket.fields.summary;
    const projectKey = ticket.fields.project.key;
    
    console.log(`✅ Ticket found: ${summary}`);

    // 2. Identify repo (simple heuristic or prompt)
    // For now, let's look for repos in the workspace
    const workspace = getActiveWorkspace();
    let workDir = workspace.path;
    if (workDir.startsWith("~")) {
        workDir = join(homedir(), workDir.slice(1));
    }

    // In a real scenario, we might have a mapping or ask the user
    // For this automation, we'll try to find a repo that matches the project key or ask
    console.log(`📂 Searching for repositories in ${workDir}...`);
    
    // List directories in workDir
    const repos = (await $`ls -d ${workDir}/*/ 2>/dev/null`.quiet()).stdout
        .split("
")
        .map(p => p.trim())
        .filter(p => p && !p.endsWith("-worktrees/"))
        .map(p => p.split("/").filter(Boolean).pop());

    if (repos.length === 0) {
        console.error("❌ No repositories found in workspace. Please clone a repo first using git-worktree:clone.");
        process.exit(1);
    }

    let selectedRepo = repos[0];
    if (repos.length > 1) {
        console.log("Multiple repositories found:");
        repos.forEach((r, i) => console.log(`  ${i + 1}. ${r}`));
        console.log(`Using ${selectedRepo} (default). To use another, clone it or configure mapping.`);
    }

    // 3. Create branch name
    const branchName = `${ticketId}-${summary.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30)}`;
    
    // 4. Create worktree
    console.log(`🌿 Creating worktree for branch ${branchName}...`);
    const createWorktreeScript = join(process.cwd(), "skills/git-worktree/scripts/create_worktree.sh");
    await $`${createWorktreeScript} ${selectedRepo} ${branchName}`;

    // 5. Update ticket status
    console.log(`🔄 Updating ticket status to 'In Progress'...`);
    const updateTicketScript = join(process.cwd(), "skills/jira/scripts/update_ticket.ts");
    await $`npx tsx ${updateTicketScript} ${ticketId} "In Progress"`.quiet();

    const worktreePath = join(workDir, `${selectedRepo}-worktrees`, branchName);
    
    console.log("
" + "=".repeat(50));
    console.log(`✅ Workflow initiated successfully!`);
    console.log(`📍 Worktree: ${worktreePath}`);
    console.log(`🔗 Ticket: ${workspace.jira_url}/browse/${ticketId}`);
    console.log("=".repeat(50));
    console.log(`
Next steps:
  cd ${worktreePath}
  # Start planning and coding!`);
}

run().catch(err => {
    console.error("❌ Error initiating workflow:", err.message);
    process.exit(1);
});
