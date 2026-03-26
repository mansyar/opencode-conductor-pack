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
    it("should initialize discovery and move through product, guidelines, and tech stack to style guides", async () => {
      const context = createMockContext(testDir);
      const client = createMockClient();
      
      // Mock all steps
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Interactive" } }); // productMode
      client.tool.execute.mockResolvedValueOnce({ answers: {} }); // productAnswers
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // guidelinesMode
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // techStackMode
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": ["typescript.md"] } }); // styleGuides
      
      const result = await executeSetupCommand(client as any, context as any);

      expect(result).toContain("Setup paused at step: scaffolding");
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

      // Mock all steps from product onwards
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Yes" } }); // Resume
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Interactive" } }); // productMode
      client.tool.execute.mockResolvedValueOnce({ answers: {} }); // productAnswers
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // guidelines
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // techstack
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": [] } }); // styleguides

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(client.tool.execute).toHaveBeenCalledWith("question", expect.any(Object));
      expect(result).toContain("Setup paused at step: scaffolding");
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

      // Mock all steps after choosing not to resume
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "No" } }); // Resume
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Interactive" } }); // productMode
      client.tool.execute.mockResolvedValueOnce({ answers: {} }); // productAnswers
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // guidelines
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // techstack
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": [] } }); // styleguides

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(client.tool.execute).toHaveBeenCalledWith("question", expect.any(Object));
      expect(result).toContain("Setup paused at step: scaffolding");
      
      const state = JSON.parse(fs.readFileSync(path.join(conductorDir, "setup_state.json"), "utf-8"));
      expect(state.currentStep).toBe("scaffolding");
      expect(state.completedSteps).toEqual(["discovery", "product", "guidelines", "tech_stack", "style_guides"]);
    });

    it("should generate product.md using interactive questions", async () => {
      const context = createMockContext(testDir);
      const client = createMockClient();
      
      // Mock maturity to skip resume check
      fs.mkdirSync(conductorDir, { recursive: true });

      // Mock all steps
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
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // guidelines
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // techstack
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": [] } }); // styleguides

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(result).toContain("Setup paused at step: scaffolding");
      expect(fs.existsSync(path.join(conductorDir, "product.md"))).toBe(true);
      
      const content = fs.readFileSync(path.join(conductorDir, "product.md"), "utf-8");
      expect(content).toContain("# Test Product");
      expect(content).toContain("Test Vision");
    });

    it("should generate product.md using autogenerate mode", async () => {
      const context = createMockContext(testDir);
      const client = createMockClient();
      
      fs.mkdirSync(conductorDir, { recursive: true });

      // Mock all steps
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } });
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // guidelines
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // techstack
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": [] } }); // styleguides

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(result).toContain("Setup paused at step: scaffolding");
      expect(fs.existsSync(path.join(conductorDir, "product.md"))).toBe(true);
      
      const content = fs.readFileSync(path.join(conductorDir, "product.md"), "utf-8");
      expect(content).toContain("# Inferred Product Name");
    });

    it("should generate guidelines, tech-stack and style guides for brownfield project", async () => {
      const context = createMockContext(testDir);
      const client = createMockClient();
      
      if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
      
      // Mock brownfield project
      fs.writeFileSync(path.join(testDir, "package.json"), "{}");
      fs.writeFileSync(path.join(testDir, "pnpm-lock.yaml"), "");

      // State: at GUIDELINES step
      fs.mkdirSync(conductorDir, { recursive: true });
      fs.writeFileSync(path.join(conductorDir, "setup_state.json"), JSON.stringify({
        currentStep: "guidelines",
        maturity: "brownfield",
        completedSteps: ["discovery", "product"],
        data: {}
      }));

      // Mock all steps from GUIDELINES
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Yes" } }); // Resume
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // guidelines
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": "Autogenerate" } }); // techstack
      client.tool.execute.mockResolvedValueOnce({ answers: { "0": ["typescript.md", "general.md"] } }); // styleguides

      const result = await executeSetupCommand(client as any, context as any);
      
      expect(result).toContain("Setup paused at step: scaffolding");
      expect(fs.existsSync(path.join(conductorDir, "product-guidelines.md"))).toBe(true);
      expect(fs.existsSync(path.join(conductorDir, "tech-stack.md"))).toBe(true);
      expect(fs.existsSync(path.join(conductorDir, "code_styleguides", "typescript.md"))).toBe(true);
      expect(fs.existsSync(path.join(conductorDir, "code_styleguides", "general.md"))).toBe(true);
      
      const tsContent = fs.readFileSync(path.join(conductorDir, "tech-stack.md"), "utf-8");
      expect(tsContent).toContain("TypeScript/JavaScript");
      expect(tsContent).toContain("pnpm");
    });
  });
});