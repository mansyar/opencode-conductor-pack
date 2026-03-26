import type { ToolContext } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";

/**
 * Executes the /conductor:setup command
 * Initializes the conductor/ directory structure with all required artifact files
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

  // Create initial files
  const filesToCreate: { filename: string; content: string }[] = [
    {
      filename: "product.md",
      content: `# Product Name

## Vision & Goals

_Write your vision and goals here._

## Target Users

- **Primary:** _Target primary users_
- **Secondary:** _Target secondary users_

## Core Features

### Phase 1: _Feature name_
- _Feature description_

## Success Metrics

- _Metric 1_
- _Metric 2_

## Technical Foundation

_Write your technical foundation here._
`,
    },
    {
      filename: "product-guidelines.md",
      content: `# Product Guidelines

## Prose Style

_Write prose style guidelines here._

## Status Display

_Write status display guidelines here._

## Naming Conventions

_Write naming conventions here._

## Error Handling

_Write error handling guidelines here._

## Command Syntax

_Write command syntax guidelines here._
`,
    },
    {
      filename: "tech-stack.md",
      content: `# Tech Stack

## Programming Language

_Write your programming language here._

## Core Architecture

_Write your core architecture here._

## Package Management

_Write your package management here._

## File Structure

\`\`\`
\`\`\`
`,
    },
    {
      filename: "workflow.md",
      content: `# Workflow

## Guiding Principles

1. _Principle 1_
2. _Principle 2_

## Task Workflow

_Write your task workflow here._

## Quality Gates

_Write your quality gates here._

## Testing Requirements

_Write your testing requirements here._
`,
    },
    {
      filename: "tracks.md",
      content: `# Project Tracks

This file tracks all major tracks for the project. Each track has its own detailed plan in its respective folder.

---
`,
    },
  ];

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
