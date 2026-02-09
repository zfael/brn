#!/usr/bin/env npx tsx
/**
 * Get repository information
 * Usage: npx tsx get_repo_info.ts <owner/repo>
 */
import { githubRequest } from "../../../lib/utils.js";

interface Repo {
    full_name: string;
    description: string | null;
    private: boolean;
    default_branch: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    clone_url: string;
    ssh_url: string;
}

const repoPath = process.argv[2];

if (!repoPath) {
    console.log("Usage: npx tsx get_repo_info.ts <owner/repo>");
    console.log("Example: npx tsx get_repo_info.ts octocat/Hello-World");
    process.exit(1);
}

const repo = await githubRequest<Repo>(`/repos/${repoPath}`);

console.log(`Repository: ${repo.full_name}`);
console.log("=".repeat(50));
console.log(`Description: ${repo.description ?? "N/A"}`);
console.log(`Visibility:  ${repo.private ? "Private" : "Public"}`);
console.log(`Default:     ${repo.default_branch}`);
console.log(`Language:    ${repo.language ?? "N/A"}`);
console.log(`Stars:       ${repo.stargazers_count}`);
console.log(`Forks:       ${repo.forks_count}`);
console.log(`Clone URL:   ${repo.clone_url}`);
console.log(`SSH URL:     ${repo.ssh_url}`);
