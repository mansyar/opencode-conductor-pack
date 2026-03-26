import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { executeSetupCommand } from "../src/commands/setup.js";
import { SetupStep } from "../src/utils/state.js";

// Mock Shell ($)
const createMockShell = () => {
  const shell: any = vi.fn(() => shell);
  shell.cwd = vi.fn().mockReturnThis();
  shell.quiet = vi.fn().mockReturnThis();
  shell.then = (resolve: any) => resolve({ exitCode: 0 });
  return shell;
};

describe("Git Integration", () => {
  const testDir = path.join(process.cwd(), "test-git-temp");
  const conductorDir = path.join(testDir, "conductor");

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(conductorDir, { recursive: true });
    
    // Set up state to be at GIT step
    fs.writeFileSync(path.join(conductorDir, "setup_state.json"), JSON.stringify({
      currentStep: SetupStep.GIT,
      maturity: "greenfield",
      completedSteps: ["discovery", "product", "guidelines", "tech_stack", "style_guides", "scaffolding", "tracks"],
      data: {}
    }));
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    vi.resetAllMocks();
  });

  it("should initialize git and commit if at GIT step", async () => {
    const mockContext = { directory: testDir };
    const mockClient = { tool: { execute: vi.fn() } };
    const shell = createMockShell();
    
    // Mock resume question
    mockClient.tool.execute.mockResolvedValueOnce({ answers: { "0": "Yes" } });

    await executeSetupCommand({ client: mockClient, $: shell, directory: testDir } as any, mockContext as any);

    // Expect git init, git add, git commit via $
    expect(shell).toHaveBeenCalledWith(expect.arrayContaining([expect.stringContaining("git init")]));
    expect(shell).toHaveBeenCalledWith(expect.arrayContaining([expect.stringContaining("git add conductor/")]));
    expect(shell).toHaveBeenCalledWith(expect.arrayContaining([expect.stringContaining("git commit")]));
    
    // Check if state is COMPLETE
    const state = JSON.parse(fs.readFileSync(path.join(conductorDir, "setup_state.json"), "utf-8"));
    expect(state.currentStep).toBe(SetupStep.COMPLETE);
  });
});
