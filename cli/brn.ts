#!/usr/bin/env npx tsx
/**
 * BRN CLI - Main entry point
 * Usage: brn <command> [options]
 */
import { $ } from "zx";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as readline from "readline";
import YAML from "yaml";

$.verbose = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");

const BRN_DIR = join(homedir(), ".brn");
const CONFIG_FILE = join(BRN_DIR, "config.yaml");

// Simple readline interface for prompts
function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

async function runSkill(skill: string, script: string, args: string[]) {
    const scriptsDir = join(PROJECT_ROOT, "skills", skill, "scripts");
    
    // Try .ts then .sh
    const tsPath = join(scriptsDir, `${script}.ts`);
    const shPath = join(scriptsDir, `${script}.sh`);

    // Enable verbose to show output of the child script
    const previousVerbose = $.verbose;
    $.verbose = true;
    
    try {
        if (existsSync(tsPath)) {
            await $`npx tsx ${tsPath} ${args}`;
        } else if (existsSync(shPath)) {
            await $`bash ${shPath} ${args}`;
        } else {
            // Try without extension
            const exactPath = join(scriptsDir, script);
            if (existsSync(exactPath)) {
                if (script.endsWith(".sh")) await $`bash ${exactPath} ${args}`;
                else await $`npx tsx ${exactPath} ${args}`;
            } else {
                console.error(`Skill script not found: ${skill}/${script}`);
                process.exit(1);
            }
        }
    } finally {
        $.verbose = previousVerbose;
    }
}

async function setup() {
    console.log("");
    console.log("🚀 BRN Setup Wizard");
    console.log("===================");
    console.log("");

    // Create config directory
    if (!existsSync(BRN_DIR)) {
        mkdirSync(BRN_DIR, { recursive: true });
        console.log(`✓ Created ${BRN_DIR}`);
    }

    // Check for existing config
    let config: any = { version: "1.0", active_workspace: "", workspaces: {} };
    if (existsSync(CONFIG_FILE)) {
        config = YAML.parse(readFileSync(CONFIG_FILE, "utf-8"));
        console.log(`✓ Found existing config with ${Object.keys(config.workspaces).length} workspace(s)`);
        console.log("");
    }

    // Workspace name
    const defaultName = Object.keys(config.workspaces).length === 0 ? "personal" : "";
    const name = await prompt(`Workspace name [${defaultName}]: `) || defaultName;

    if (!name) {
        console.log("❌ Workspace name is required");
        process.exit(1);
    }

    // Work directory
    const defaultPath = join(homedir(), "dev", name, "auto");
    const workDir = await prompt(`Work directory [${defaultPath}]: `) || defaultPath;

    // GitHub token (optional)
    console.log("");
    console.log("📦 GitHub Configuration (optional, press Enter to skip)");
    const githubToken = await prompt("GitHub token: ");
    const githubOrg = await prompt("Default GitHub Organization/User: ");

    // JIRA config (optional)
    console.log("");
    console.log("📋 JIRA Configuration (optional, press Enter to skip)");
    const jiraUrl = await prompt("JIRA URL (e.g., https://company.atlassian.net): ");
    let jiraEmail = "";
    let jiraToken = "";
    if (jiraUrl) {
        jiraEmail = await prompt("JIRA email: ");
        jiraToken = await prompt("JIRA API token: ");
    }

    // Automation settings
    console.log("");
    console.log("⚙️  Automation Settings");
    console.log("   By default, all automation is OFF for safety.");
    const enableAuto = await prompt("Enable any automation? (y/N): ");

    let automation: Record<string, boolean> = {
        github_auto_push: false,
        github_auto_pr: false,
        jira_auto_transition: false,
        jira_auto_comment: false,
    };

    if (enableAuto.toLowerCase() === "y") {
        const autoPush = await prompt("  Auto-push commits? (y/N): ");
        const autoPr = await prompt("  Auto-create PRs? (y/N): ");
        const autoTransition = await prompt("  Auto-update JIRA status? (y/N): ");
        const autoComment = await prompt("  Auto-add JIRA comments? (y/N): ");

        automation = {
            github_auto_push: autoPush.toLowerCase() === "y",
            github_auto_pr: autoPr.toLowerCase() === "y",
            jira_auto_transition: autoTransition.toLowerCase() === "y",
            jira_auto_comment: autoComment.toLowerCase() === "y",
        };
    }

    // Build workspace config
    const workspace: any = {
        path: workDir,
        automation,
    };

    if (githubToken) workspace.github_token = githubToken;
    if (githubOrg) workspace.github_org = githubOrg;
    if (jiraUrl) {
        workspace.jira_url = jiraUrl;
        workspace.jira_email = jiraEmail;
        workspace.jira_token = jiraToken;
    }

    // Save config
    config.workspaces[name] = workspace;
    if (!config.active_workspace) {
        config.active_workspace = name;
    }

    writeFileSync(CONFIG_FILE, YAML.stringify(config));

    // Create work directory
    if (!existsSync(workDir)) {
        mkdirSync(workDir, { recursive: true });
    }

    console.log("");
    console.log("✅ Setup complete!");
    console.log("");
    console.log(`   Workspace: ${name}`);
    console.log(`   Work dir:  ${workDir}`);
    console.log(`   Config:    ${CONFIG_FILE}`);
    console.log("");
    console.log("Next steps:");
    console.log("  • Use 'brn workspace list' to see workspaces");
    console.log("  • Use 'brn workspace switch <name>' to change workspace");
    console.log("  • Ask your AI assistant to 'list my JIRA tickets'");
    console.log("");
}

async function workspaceList() {
    if (!existsSync(CONFIG_FILE)) {
        console.log("No workspaces configured. Run: brn setup");
        return;
    }

    const config = YAML.parse(readFileSync(CONFIG_FILE, "utf-8"));
    const active = config.active_workspace;

    console.log("Workspaces:");
    console.log("===========");

    for (const [name, ws] of Object.entries(config.workspaces)) {
        const workspace = ws as any;
        const marker = name === active ? "* " : "  ";
        const activeLabel = name === active ? " [ACTIVE]" : "";
        console.log(`${marker}${name} (${workspace.path})${activeLabel}`);
    }
}

async function workspaceSwitch(name: string) {
    if (!existsSync(CONFIG_FILE)) {
        console.log("No workspaces configured. Run: brn setup");
        return;
    }

    const config = YAML.parse(readFileSync(CONFIG_FILE, "utf-8"));

    if (!config.workspaces[name]) {
        console.log(`Workspace '${name}' not found.`);
        console.log("Available:", Object.keys(config.workspaces).join(", "));
        return;
    }

    config.active_workspace = name;
    writeFileSync(CONFIG_FILE, YAML.stringify(config));
    console.log(`✓ Switched to workspace '${name}'`);
}

function showHelp() {
    console.log(`
BRN - AI Developer Workflow Toolkit

Usage:
  brn <command> [options]
  brn <skill> <script> [args]

Commands:
  start <ticket>        Shortcut for workflow start <ticket>
  setup                 Interactive setup wizard
  workspace list        List all workspaces
  workspace switch <n>  Switch to workspace <n>
  help                  Show this help

Skills:
  github <script>       Run a GitHub skill script (e.g., list_repos)
  jira <script>         Run a JIRA skill script (e.g., list_tickets)
  git-worktree <script> Run a Git Worktree skill script (e.g., clone_repo)

Examples:
  brn start PROJ-123
  brn github list_repos
  brn jira list_tickets
  brn workspace switch work
`);
}

// Main
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case "start":
        await runSkill("workflow", "start", args.slice(1));
        break;
    case "setup":
        await setup();
        break;
    case "workspace":
        if (args[1] === "list") {
            await workspaceList();
        } else if (args[1] === "switch" && args[2]) {
            await workspaceSwitch(args[2]);
        } else {
            console.log("Usage: brn workspace [list|switch <name>]");
        }
        break;
    case "help":
    case "--help":
    case "-h":
    case undefined:
        showHelp();
        break;
    default:
        // Generic skill runner: brn <skill> <script> [...args]
        if (command && args[1]) {
            await runSkill(command, args[1], args.slice(2));
        } else {
            console.log(`Unknown command: ${command}`);
            showHelp();
            process.exit(1);
        }
}