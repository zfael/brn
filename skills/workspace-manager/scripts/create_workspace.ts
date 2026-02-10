#!/usr/bin/env npx tsx
/**
 * Create a new workspace
 * Usage: npx tsx create_workspace.ts <name> <work_dir>
 */
import { existsSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import YAML from "yaml";
import { saveBrnConfig } from "../../../lib/utils.js";

const workspaceName = process.argv[2];
let workDir = process.argv[3];

if (!workspaceName || !workDir) {
    console.log("Usage: create_workspace.ts <name> <work_dir>");
    console.log("Example: create_workspace.ts personal ~/dev/personal/auto");
    process.exit(1);
}

const configPath = join(homedir(), ".brn", "config.yaml");
const configDir = join(homedir(), ".brn");

// Create config directory if it doesn't exist
if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
}

// Expand work_dir path
if (workDir.startsWith("~")) {
    workDir = join(homedir(), workDir.slice(1));
}

let config: any = {
    version: "1.0",
    active_workspace: workspaceName,
    workspaces: {}
};

if (existsSync(configPath)) {
    const content = readFileSync(configPath, "utf-8");
    config = YAML.parse(content);
}

// Check if workspace already exists
if (config.workspaces && config.workspaces[workspaceName]) {
    console.error(`Error: Workspace '${workspaceName}' already exists`);
    process.exit(1);
}

if (!config.workspaces) {
    config.workspaces = {};
}

config.workspaces[workspaceName] = {
    path: workDir,
    github_token: null,
    jira_token: null,
    jira_url: null
};

// If no active workspace, set this one
if (!config.active_workspace) {
    config.active_workspace = workspaceName;
}

saveBrnConfig(config);

// Create the work directory
if (!existsSync(workDir)) {
    mkdirSync(workDir, { recursive: true });
}

console.log(`✓ Created workspace '${workspaceName}' at ${workDir}`);
