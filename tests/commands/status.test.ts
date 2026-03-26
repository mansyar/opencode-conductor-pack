import { describe, it, expect, vi, beforeEach } from "vitest";
import { executeStatusCommand } from "../../src/commands/status";
import * as parser from "../../src/utils/parser";
import * as fs from "node:fs/promises";

vi.mock("../../src/utils/parser");
vi.mock("node:fs/promises");

describe("status command", () => {
  let mockClient: any;
  let mockContext: any;

  beforeEach(() => {
    mockClient = {
      tui: {
        showToast: vi.fn(),
        appendPrompt: vi.fn()
      }
    };
    mockContext = {
      directory: "/project"
    };
    vi.clearAllMocks();
  });

  it("should calculate overall progress and display toast/summary", async () => {
    const mockTracks: parser.Track[] = [
      { description: "Track 1", status: "completed", link: "./tracks/1/" },
      { description: "Track 2", status: "in-progress", link: "./tracks/2/" }
    ];

    const mockProgress1: parser.PlanProgress = {
      totalPhases: 2,
      totalTasks: 4,
      completedTasks: 4,
      inProgressTasks: 0,
      pendingTasks: 0,
      blockers: [],
      currentTask: null,
      currentPhase: null,
      nextAction: null
    };

    const mockProgress2: parser.PlanProgress = {
      totalPhases: 3,
      totalTasks: 6,
      completedTasks: 2,
      inProgressTasks: 1,
      pendingTasks: 3,
      blockers: ["API down"],
      currentTask: "Task 3",
      currentPhase: "Phase 2",
      nextAction: "Task 4"
    };

    vi.mocked(fs.readFile).mockResolvedValue("registry content");
    vi.mocked(parser.extractTracksFromRegistry).mockReturnValue(mockTracks);
    vi.mocked(parser.readTrackPlan).mockResolvedValueOnce("# Plan 1").mockResolvedValueOnce("# Plan 2");
    vi.mocked(parser.parsePlanProgress).mockReturnValueOnce(mockProgress1).mockReturnValueOnce(mockProgress2);

    const input = { client: mockClient, directory: "/project" };
    await executeStatusCommand(input, mockContext);

    // Overall: 6/10 tasks = 60%
    expect(mockClient.tui.showToast).toHaveBeenCalledWith(expect.objectContaining({
      variant: "success",
      message: expect.stringMatching(/60%/)
    }));

    expect(mockClient.tui.appendPrompt).toHaveBeenCalledWith(expect.stringMatching(/Track 1/));
    expect(mockClient.tui.appendPrompt).toHaveBeenCalledWith(expect.stringMatching(/100%/));
    expect(mockClient.tui.appendPrompt).toHaveBeenCalledWith(expect.stringMatching(/Track 2/));
    expect(mockClient.tui.appendPrompt).toHaveBeenCalledWith(expect.stringMatching(/33%/));
    expect(mockClient.tui.appendPrompt).toHaveBeenCalledWith(expect.stringMatching(/Blockers.*API down/));
  });

  it("should handle missing plan files gracefully", async () => {
    vi.mocked(fs.readFile).mockResolvedValue("registry content");
    vi.mocked(parser.extractTracksFromRegistry).mockReturnValue([{ description: "Lost Track", status: "pending", link: "./lost/" }]);
    vi.mocked(parser.readTrackPlan).mockResolvedValue(null);

    const input = { client: mockClient, directory: "/project" };
    await executeStatusCommand(input, mockContext);

    expect(mockClient.tui.showToast).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/0%/)
    }));
  });
});
