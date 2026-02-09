#!/usr/bin/env npx tsx
/**
 * List pull requests for a repository
 * Usage: npx tsx list_prs.ts <owner/repo> [state]
 */
import { githubRequest } from "../../../lib/utils.js";

interface PR {
    number: number;
    title: string;
    draft: boolean;
    html_url: string;
    head: { ref: string };
    base: { ref: string };
    user: { login: string };
}

const repoPath = process.argv[2];
const state = process.argv[3] ?? "open";

if (!repoPath) {
    console.log("Usage: npx tsx list_prs.ts <owner/repo> [state]");
    console.log("States: open, closed, all (default: open)");
    process.exit(1);
}

const prs = await githubRequest<PR[]>(
    `/repos/${repoPath}/pulls?state=${state}&per_page=30`
);

console.log(`Pull Requests for ${repoPath} (${state}):`);
console.log("=".repeat(50));

if (prs.length === 0) {
    console.log("No pull requests found.");
    process.exit(0);
}

for (const pr of prs) {
    const draft = pr.draft ? "📝" : "";
    console.log(`#${pr.number} ${draft} ${pr.title}`);
    console.log(`   ${pr.head.ref} → ${pr.base.ref} by @${pr.user.login}`);
    console.log(`   ${pr.html_url}`);
    console.log();
}
