/**
 * Shared utilities for brn scripts
 */
import { $ } from "zx";
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import YAML from "yaml";

$.verbose = false;

export interface AutomationConfig {
    github_auto_push?: boolean;
    github_auto_pr?: boolean;
    jira_auto_transition?: boolean;
    jira_auto_comment?: boolean;
}

export interface WorkspaceConfig {
    path: string;
    github_token?: string | null;
    jira_token?: string | null;
    jira_url?: string | null;
    jira_email?: string | null;
    automation?: AutomationConfig;
}

export interface BrnConfig {
    version: string;
    active_workspace: string;
    workspaces: Record<string, WorkspaceConfig>;
}

/**
 * Get the brn config from ~/.brn/config.yaml
 */
export function getBrnConfig(): BrnConfig {
    const configPath = join(homedir(), ".brn", "config.yaml");

    if (!existsSync(configPath)) {
        console.error("Error: No config found at ~/.brn/config.yaml");
        console.error("Run: create_workspace.sh <name> <path>");
        process.exit(1);
    }

    const content = readFileSync(configPath, "utf-8");
    return YAML.parse(content) as BrnConfig;
}

/**
 * Get the active workspace config
 */
export function getActiveWorkspace(): WorkspaceConfig & { name: string } {
    const config = getBrnConfig();
    const name = config.active_workspace;
    const workspace = config.workspaces[name];

    if (!workspace) {
        console.error(`Error: Workspace '${name}' not found in config`);
        process.exit(1);
    }

    return { name, ...workspace };
}

/**
 * Check if an automation action is enabled for the active workspace.
 * All automation is OFF by default for safety.
 */
export function isAutomationEnabled(
    action: keyof AutomationConfig
): boolean {
    const workspace = getActiveWorkspace();
    return workspace.automation?.[action] ?? false;
}

/**
 * Require automation to be enabled, or prompt user to confirm.
 * Returns true if action should proceed, false if user declined.
 */
export function checkAutomation(
    action: keyof AutomationConfig,
    description: string
): boolean {
    if (isAutomationEnabled(action)) {
        return true;
    }

    console.log(`⚠️  Automation disabled: ${description}`);
    console.log(`   To enable, run: configure_workspace.sh <workspace> automation.${action} true`);
    console.log(`   Skipping automatic execution.`);
    return false;
}

/**
 * Get GitHub token from active workspace
 */
export function getGitHubToken(): string {
    const workspace = getActiveWorkspace();

    if (!workspace.github_token) {
        console.error("Error: github_token not configured for this workspace");
        console.error(
            `Run: configure_workspace.sh ${workspace.name} github_token <token>`
        );
        process.exit(1);
    }

    return workspace.github_token;
}

/**
 * Get JIRA config from active workspace
 */
export function getJiraConfig(): {
    url: string;
    email: string;
    token: string;
} {
    const workspace = getActiveWorkspace();

    if (!workspace.jira_url) {
        console.error("Error: jira_url not configured");
        process.exit(1);
    }
    if (!workspace.jira_email) {
        console.error("Error: jira_email not configured");
        process.exit(1);
    }
    if (!workspace.jira_token) {
        console.error("Error: jira_token not configured");
        process.exit(1);
    }

    return {
        url: workspace.jira_url.replace(/\/$/, ""),
        email: workspace.jira_email,
        token: workspace.jira_token,
    };
}

/**
 * Make a GitHub API request
 */
export async function githubRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getGitHubToken();

    const response = await fetch(`https://api.github.com${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`Error: ${response.status} - ${response.statusText}`);
        if (error.message) console.error(`  ${error.message}`);
        process.exit(1);
    }

    return response.json() as Promise<T>;
}

/**
 * Make a JIRA API request
 */
export async function jiraRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const { url, email, token } = getJiraConfig();
    const auth = Buffer.from(`${email}:${token}`).toString("base64");

    const response = await fetch(`${url}${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Basic ${auth}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`Error: ${response.status} - ${response.statusText}`);
        if (error.errorMessages) console.error(`  ${error.errorMessages}`);
        process.exit(1);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json() as Promise<T>;
}
