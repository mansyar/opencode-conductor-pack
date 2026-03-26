import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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

// Mock Client
const createMockClient = () => ({
  tool: {
    execute: vi.fn(),
  },
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
    it("should initialize discovery and move to product step", async () => {
      const context = createMockContext(testDir);
      const client = createMockClient();
      const result = await executeSetupCommand(client as any, context as any);

      expect(result).toContain("Setup paused at step: product");
      expect(fs.existsSync(path.join(conductorDir, "setup_state.json"))).toBe(true);
      
      const state = JSON.parse(fs.readFileSync(path.join(conductorDir, "setup_state.json"), "utf-8"));
      expect(state.currentStep).toBe("product");
      expect(state.completedSteps).toContain("discovery");
    });

    it("should ask to resume if state exists", async () => {
      const context = createMockContext(testDir);
      const client = createMockClient();
      
      // Pre-create state
      fs.mkdirSync(conductorDir, { recursive: true });
      fs.writeFileSync(path.join(conductorDir, "setup_state.json"), JSON.stringify({
        currentStep: "product",
        maturity: "greenfield",
        completedSteps: ["discovery"],
        data: {}
      }));

      // Mock "Yes" to resume
      client.tool.execute.mockResolvedValue({ answers: { "0": "Yes" } });

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(client.tool.execute).toHaveBeenCalledWith("question", expect.any(Object));
      expect(result).toContain("Setup paused at step: product");
    });

    it("should restart from discovery if user chooses not to resume", async () => {
      const context = createMockContext(testDir);
      const client = createMockClient();
      
      // Pre-create state at product step
      fs.mkdirSync(conductorDir, { recursive: true });
      fs.writeFileSync(path.join(conductorDir, "setup_state.json"), JSON.stringify({
        currentStep: "product",
        maturity: "greenfield",
        completedSteps: ["discovery"],
        data: {}
      }));

      // Mock "No" to resume
      client.tool.execute.mockResolvedValue({ answers: { "0": "No" } });

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(client.tool.execute).toHaveBeenCalledWith("question", expect.any(Object));
      // Should have restarted and moved back to product from discovery
      expect(result).toContain("Setup paused at step: product");
      
      const state = JSON.parse(fs.readFileSync(path.join(conductorDir, "setup_state.json"), "utf-8"));
      expect(state.currentStep).toBe("product");
      // Completed steps should just be discovery (re-run)
      expect(state.completedSteps).toEqual(["discovery"]);
    });
  });
});