import type { ToolContext } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";
import { getConductorTemplates } from "../artifacts/templates.js";

/**
 * Executes the /conductor:setup command
 * Initializes the conductor/ directory structure with all required artifact files
 * 
 * Note: OpenCode requires Bun runtime, so Bun availability is guaranteed.
 * This function assumes the OpenCode environment is properly set up.
 */
export async function executeSetupCommand(context: ToolContext): Promise<string> {
  const conductorDir = path.join(context.directory, "conductor");

  // Check if conductor/ already exists
  if (fs.existsSync(conductorDir)) {
    return `[ERROR] conductor/ already initialized. Remove it first to re-initialize.`;
  }

  // Create directory structure
  const dirsToCreate = [
    conductorDir,
    path.join(conductorDir, "code_styleguides"),
    path.join(conductorDir, "tracks"),
  ];

  for (const dir of dirsToCreate) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Get templates and create files
  const filesToCreate = getConductorTemplates();

  for (const file of filesToCreate) {
    const filePath = path.join(conductorDir, file.filename);
    fs.writeFileSync(filePath, file.content, "utf-8");
  }

  return `[CONDUCTOR] Initialized conductor/ structure
  ✓ Created conductor/product.md
  ✓ Created conductor/product-guidelines.md
  ✓ Created conductor/tech-stack.md
  ✓ Created conductor/workflow.md
  ✓ Created conductor/code_styleguides/
  ✓ Created conductor/tracks.md
  ✓ Created conductor/tracks/`;
}
