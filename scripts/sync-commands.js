const fs = require('fs');
const path = require('path');

// Target the explicit user directory containing the old Extension TOMLs
const ORIGINAL_EXTENSION_DIR = path.join(
    process.env.USERPROFILE || '$HOME', 
    '.gemini', 'extensions', 'conductor', 'commands', 'conductor'
);

// We save them into our new native .opencode format
const TARGET_COMMANDS_DIR = path.join(__dirname, '..', '.opencode', 'commands');

console.log('Starting Conductor Command Sync Utility...\n');

if (!fs.existsSync(ORIGINAL_EXTENSION_DIR)) {
    console.error(`[ERROR] Original Gemini Extension directory not found at: ${ORIGINAL_EXTENSION_DIR}`);
    process.exit(1);
}

if (!fs.existsSync(TARGET_COMMANDS_DIR)) {
    fs.mkdirSync(TARGET_COMMANDS_DIR, { recursive: true });
}

// Auto-discover all original TOML commands
const tomlFiles = fs.readdirSync(ORIGINAL_EXTENSION_DIR).filter(file => file.endsWith('.toml'));

console.log(`Found ${tomlFiles.length} TOML commands to parse and migrate...`);

let successCount = 0;

for (const file of tomlFiles) {
    const filePath = path.join(ORIGINAL_EXTENSION_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Regex parsing to dynamically extract the TOML fields
    const descMatch = content.match(/description\s*=\s*"([^"]*)"/);
    // Grab everything inside the multiline prompt block
    const promptMatch = content.match(/prompt\s*=\s*"""([\s\S]*?)"""/);
    
    if (!descMatch || !promptMatch) {
         console.warn(`[WARN] Could not parse 'description' or 'prompt' block in ${file}. Skipping.`);
         continue;
    }
    
    const description = descMatch[1];
    let prompt = promptMatch[1].trim();
    
    // --- OPENCODE TOOL REMAPPER ---
    // Translate Gemini CLI specific tools/concepts into OpenCode native equivalents
    const remappings = {
        'ask_user': 'question',
        'enter_plan_mode': 'transition into planning mode by updating plan.md',
        'read_file': 'read',
        'view_file': 'read',
        'write_file': 'write',
        'edit_file': 'edit',
        'replace_file_content': 'edit',
        'find_by_name': 'glob',
        'search_dir': 'glob',
        'grep_search': 'grep',
        'list_dir': 'list',
        'run_command': 'bash'
    };
    
    for (const [oldTool, newTool] of Object.entries(remappings)) {
        prompt = prompt.replace(new RegExp(`\\b${oldTool}\\b`, 'g'), newTool);
    }
    
    // To match your naming scheme (/conductor-setup, /conductor-newtrack)
    const commandName = path.basename(file, '.toml');
    const targetFilename = `conductor-${commandName}.md`;
    
    // Construct the native markdown format for OpenCode Commands
    const markdownOutput = `---
description: ${description}
agent: conductor
---
${prompt}
`;

    const targetPath = path.join(TARGET_COMMANDS_DIR, targetFilename);
    fs.writeFileSync(targetPath, markdownOutput, 'utf-8');
    
    console.log(` [SYNCED] ${file} -> .opencode/commands/${targetFilename}`);
    successCount++;
}

console.log(`\nSuccessfully converted ${successCount}/${tomlFiles.length} commands!`);
