import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { executeSetupCommand } from "../src/commands/setup.js";
import { SetupStep } from "../src/utils/state.js";
import * as child_process from "node:child_process";

vi.mock("node:child_process", () => ({
  execSync: vi.fn(),
}));

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
    
    // Mock resume question
    mockClient.tool.execute.mockResolvedValueOnce({ answers: { "0": "Yes" } });

    await executeSetupCommand(mockClient as any, mockContext as any);

    // Expect git init, git add, git commit
    expect(child_process.execSync).toHaveBeenCalledWith("git init", expect.any(Object));
    expect(child_process.execSync).toHaveBeenCalledWith("git add conductor/", expect.any(Object));
    expect(child_process.execSync).toHaveBeenCalledWith("git commit -m 'conductor(setup): Add conductor setup files'", expect.any(Object));
    
    // Check if state is COMPLETE
    const state = JSON.parse(fs.readFileSync(path.join(conductorDir, "setup_state.json"), "utf-8"));
    expect(state.currentStep).toBe(SetupStep.COMPLETE);
  });
});
