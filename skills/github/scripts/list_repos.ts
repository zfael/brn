#!/usr/bin/env npx tsx
/**
 * List repositories for an organization or user
 * Usage: npx tsx list_repos.ts [org_or_user]
 */
import { githubRequest, getActiveWorkspace } from "../../../lib/utils.js";

interface Repo {
    full_name: string;
    private: boolean;
    description: string | null;
}

let orgOrUser = process.argv[2];

if (!orgOrUser) {
    const ws = getActiveWorkspace();
    if (ws.github_org) {
        orgOrUser = ws.github_org;
    }
}

let endpoint = "/user/repos?per_page=100";
if (orgOrUser) {
    endpoint = `/orgs/${orgOrUser}/repos?per_page=100`;
}

console.log(`Fetching repositories from: ${endpoint}`);

try {
    let repos = await githubRequest<Repo[]>(endpoint);

    // If org fails, try as user
    if (repos.length === 0 && orgOrUser) {
        repos = await githubRequest<Repo[]>(
            `/users/${orgOrUser}/repos?per_page=100`
        );
    }

    console.log(`Repositories${orgOrUser ? ` for ${orgOrUser}` : ""}:`);
    console.log("=".repeat(50));

    for (const repo of repos) {
        const icon = repo.private ? "🔒" : "🌐";
        console.log(`${icon} ${repo.full_name}`);
        if (repo.description) {
            console.log(`   ${repo.description.slice(0, 60)}...`);
        }
        console.log();
    }
} catch (error) {
    console.error("Failed to list repositories:", error);
    process.exit(1);
}
