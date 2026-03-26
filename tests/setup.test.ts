import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { executeSetupCommand } from "../src/commands/setup";

// Mock ToolContext
const createMockContext = (directory: string) => ({
  sessionID: "test-session",
  messageID: "test-message",
  agent: "test-agent",
  directory,
  worktree: directory,
  abort: new AbortController().signal,
  metadata: () => {},
  ask: async () => {},
});

describe("setup command", () => {
  const testDir = path.join(process.cwd(), "test-conductor-temp");
  const conductorDir = path.join(testDir, "conductor");

  beforeEach(() => {
    // Clean up before each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("executeSetupCommand", () => {
    it("should create conductor directory structure", async () => {
      const context = createMockContext(testDir);
      await executeSetupCommand(context);

      expect(fs.existsSync(conductorDir)).toBe(true);
      expect(fs.existsSync(path.join(conductorDir, "code_styleguides"))).toBe(true);
      expect(fs.existsSync(path.join(conductorDir, "tracks"))).toBe(true);
    });

    it("should create all required files", async () => {
      const context = createMockContext(testDir);
      await executeSetupCommand(context);

      const expectedFiles = [
        "product.md",
        "product-guidelines.md",
        "tech-stack.md",
        "workflow.md",
        "tracks.md",
      ];

      for (const file of expectedFiles) {
        const filePath = path.join(conductorDir, file);
        expect(fs.existsSync(filePath), `File ${file} should exist`).toBe(true);
      }
    });

    it("should return success message with created files", async () => {
      const context = createMockContext(testDir);
      const result = await executeSetupCommand(context);

      expect(result).toContain("[CONDUCTOR] Initialized conductor/ structure");
      expect(result).toContain("✓ Created conductor/product.md");
      expect(result).toContain("✓ Created conductor/product-guidelines.md");
      expect(result).toContain("✓ Created conductor/tech-stack.md");
      expect(result).toContain("✓ Created conductor/workflow.md");
      expect(result).toContain("✓ Created conductor/code_styleguides/");
      expect(result).toContain("✓ Created conductor/tracks.md");
      expect(result).toContain("✓ Created conductor/tracks/");
    });

    it("should be idempotent - fail if conductor already exists", async () => {
      const context = createMockContext(testDir);

      // First setup
      await executeSetupCommand(context);

      // Second setup should fail
      const result = await executeSetupCommand(context);
      expect(result).toBe(`[ERROR] Setup: Directory already exists

Context: The 'conductor/' directory was found in the project root.
Expected: 'conductor/' should not exist before running setup.
Suggestion: Remove the 'conductor/' directory first if you want to re-initialize.`);
    });

    it("should create workflow.md with full content", async () => {
      const context = createMockContext(testDir);
      await executeSetupCommand(context);

      const workflowPath = path.join(conductorDir, "workflow.md");
      const content = fs.readFileSync(workflowPath, "utf-8");

      // Check for key sections in the full workflow
      expect(content).toContain("# Project Workflow");
      expect(content).toContain("## Guiding Principles");
      expect(content).toContain("## Task Workflow");
      expect(content).toContain("## Quality Gates");
      expect(content).toContain("## Testing Requirements");
      expect(content).toContain("## Commit Guidelines");
      expect(content).toContain("## Definition of Done");
    });

    it("should create product.md with placeholder content", async () => {
      const context = createMockContext(testDir);
      await executeSetupCommand(context);

      const productPath = path.join(conductorDir, "product.md");
      const content = fs.readFileSync(productPath, "utf-8");

      expect(content).toContain("# Product Name");
      expect(content).toContain("## Vision & Goals");
      expect(content).toContain("## Target Users");
      expect(content).toContain("## Core Features");
      expect(content).toContain("## Success Metrics");
      expect(content).toContain("## Technical Foundation");
    });

    it("should create tracks.md with header", async () => {
      const context = createMockContext(testDir);
      await executeSetupCommand(context);

      const tracksPath = path.join(conductorDir, "tracks.md");
      const content = fs.readFileSync(tracksPath, "utf-8");

      expect(content).toContain("# Project Tracks");
      expect(content).toContain("This file tracks all major tracks for the project");
      expect(content).toContain("---");
    });

    it("should create code_styleguides directory", async () => {
      const context = createMockContext(testDir);
      await executeSetupCommand(context);

      const codeStyleguidesDir = path.join(conductorDir, "code_styleguides");
      expect(fs.existsSync(codeStyleguidesDir)).toBe(true);
      expect(fs.statSync(codeStyleguidesDir).isDirectory()).toBe(true);
    });

    it("should create tracks directory", async () => {
      const context = createMockContext(testDir);
      await executeSetupCommand(context);

      const tracksDir = path.join(conductorDir, "tracks");
      expect(fs.existsSync(tracksDir)).toBe(true);
      expect(fs.statSync(tracksDir).isDirectory()).toBe(true);
    });
  });
});