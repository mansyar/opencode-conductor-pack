#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Point source to the module's bundled .opencode folder
const sourceDir = path.join(__dirname, '..', '.opencode');
// Target the user's current working directory
const targetDir = path.join(process.cwd(), '.opencode');

console.log('Initializing Conductor Workflows in current project...\n');

if (!fs.existsSync(sourceDir)) {
    console.error(`Error: Source directory not found at ${sourceDir}`);
    console.error('Make sure the package was installed correctly.');
    process.exit(1);
}

try {
    // cpSync is available in Node >16.7
    fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
    
    console.log(`✅ Successfully scaffolded CDD workflows at: ${targetDir}`);
    console.log('\n----------------------------------------');
    console.log('You are ready to go! Open this project in OpenCode.');
    console.log('Try typing the following in the chat:');
    console.log('\n  @conductor /conductor-setup');
    console.log('----------------------------------------\n');
} catch (err) {
    console.error('Failed to copy Conductor templates. Ensure you have write permissions.', err);
    process.exit(1);
}
