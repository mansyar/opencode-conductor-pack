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
      
      // Mock productMode question
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Interactive" } });
      
      const result = await executeSetupCommand(client as any, context as any);

      // It should have completed discovery and be waiting at product questions
      expect(result).toContain("Setup paused at step: guidelines"); // Actually it will proceed if we mock the next call too
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
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Yes" } });
      // Mock product questions
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Interactive" } });
      client.tool.execute.mockResolvedValueOnce({ answers: {} });

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(client.tool.execute).toHaveBeenCalledWith("question", expect.any(Object));
      expect(result).toContain("Setup paused at step: guidelines");
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
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "No" } });
      // Mock product questions after restart
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Interactive" } });
      client.tool.execute.mockResolvedValueOnce({ answers: {} });

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(client.tool.execute).toHaveBeenCalledWith("question", expect.any(Object));
      // Should have restarted and moved back to product from discovery and then to guidelines
      expect(result).toContain("Setup paused at step: guidelines");
      
      const state = JSON.parse(fs.readFileSync(path.join(conductorDir, "setup_state.json"), "utf-8"));
      expect(state.currentStep).toBe("guidelines");
      // Completed steps should be discovery and product
      expect(state.completedSteps).toEqual(["discovery", "product"]);
    });

    it("should generate product.md using interactive questions", async () => {
      const context = createMockContext(testDir);
      const client = createMockClient();
      
      // Mock maturity to skip resume check
      fs.mkdirSync(conductorDir, { recursive: true });

      // Mock questions for product.md
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Interactive" } }); // Mode
      client.tool.execute.mockResolvedValueOnce({ 
        answers: { 
          "0": "Test Product",
          "1": "Test Vision",
          "2": "Users",
          "3": "Features",
          "4": "Metrics",
          "5": "Stack"
        } 
      });

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(result).toContain("Setup paused at step: guidelines");
      expect(fs.existsSync(path.join(conductorDir, "product.md"))).toBe(true);
      
      const content = fs.readFileSync(path.join(conductorDir, "product.md"), "utf-8");
      expect(content).toContain("# Test Product");
      expect(content).toContain("Test Vision");
    });

    it("should generate product.md using autogenerate mode", async () => {
      const context = createMockContext(testDir);
      const client = createMockClient();
      
      fs.mkdirSync(conductorDir, { recursive: true });

      // Mock "Autogenerate"
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } });

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(result).toContain("Setup paused at step: guidelines");
      expect(fs.existsSync(path.join(conductorDir, "product.md"))).toBe(true);
      
      const content = fs.readFileSync(path.join(conductorDir, "product.md"), "utf-8");
      expect(content).toContain("# Inferred Product Name");
    });
  });
});