#!/usr/bin/env npx tsx
/**
 * Create a pull request
 * Usage: npx tsx create_pr.ts <owner/repo> <head> <base> <title> [body]
 */
import { githubRequest } from "../../../lib/utils.js";

interface PR {
    number: number;
    title: string;
    html_url: string;
}

const [repoPath, head, base, title, body] = process.argv.slice(2);

if (!repoPath || !head || !base || !title) {
    console.log(
        "Usage: npx tsx create_pr.ts <owner/repo> <head_branch> <base_branch> <title> [body]"
    );
    console.log(
        "Example: npx tsx create_pr.ts myorg/app feature-123 main 'feat: Add feature'"
    );
    process.exit(1);
}

const pr = await githubRequest<PR>(`/repos/${repoPath}/pulls`, {
    method: "POST",
    body: JSON.stringify({
        title,
        head,
        base,
        body: body ?? "",
    }),
});

console.log(`✓ Created PR #${pr.number}: ${pr.title}`);
console.log(`  URL: ${pr.html_url}`);
console.log(`  ${head} → ${base}`);
