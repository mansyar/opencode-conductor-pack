import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  extractTracksFromRegistry, 
  readTrackPlan, 
  parsePlanProgress 
} from "../src/utils/parser";
import * as fs from "node:fs/promises";
import path from "node:path";

vi.mock("node:fs/promises");

describe("parser utilities", () => {
  describe("extractTracksFromRegistry", () => {
    it("should extract tracks using the - [ ] format", () => {
      const content = `
# Project Tracks
---
- [ ] **Track: First Track**
      Link: [./tracks/first/](./tracks/first/)
- [x] **Track: Completed Track**
      Link: [./tracks/done/](./tracks/done/)
- [~] **Track: In Progress Track**
      Link: [./tracks/current/](./tracks/current/)
`;
      const tracks = extractTracksFromRegistry(content);
      expect(tracks).toHaveLength(3);
      expect(tracks[0]).toEqual({
        description: "First Track",
        link: "./tracks/first/",
        status: "pending"
      });
      expect(tracks[1].status).toBe("completed");
      expect(tracks[2].status).toBe("in-progress");
    });

    it("should extract tracks using the legacy ## [ ] format", () => {
      const content = `
# Project Tracks
---
## [ ] Track: Legacy Track
Link: [./tracks/legacy/](./tracks/legacy/)
`;
      const tracks = extractTracksFromRegistry(content);
      expect(tracks).toHaveLength(1);
      expect(tracks[0]).toEqual({
        description: "Legacy Track",
        link: "./tracks/legacy/",
        status: "pending"
      });
    });
  });

  describe("readTrackPlan", () => {
    it("should resolve and read plan.md relative to track link", async () => {
      const registryDir = "/project/conductor";
      const trackLink = "./tracks/test-track/";
      const planPath = path.resolve(registryDir, trackLink, "plan.md");
      const mockPlanContent = "# Plan Content";

      vi.mocked(fs.readFile).mockResolvedValue(mockPlanContent);

      const content = await readTrackPlan(registryDir, trackLink);
      expect(content).toBe(mockPlanContent);
      expect(fs.readFile).toHaveBeenCalledWith(planPath, "utf-8");
    });

    it("should return null if plan.md is missing", async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));
      const content = await readTrackPlan("/dir", "./link");
      expect(content).toBeNull();
    });
  });

  describe("parsePlanProgress", () => {
    it("should correctly tally phases and tasks", () => {
      const content = `
# Implementation Plan
## Phase 1: Setup
- [x] Task: Task 1
- [~] Task: Task 2
## Phase 2: Work
- [ ] Task: Task 3
- [ ] Task: Task 4
Blocker: API is down
`;
      const progress = parsePlanProgress(content);
      expect(progress.totalPhases).toBe(2);
      expect(progress.totalTasks).toBe(4);
      expect(progress.completedTasks).toBe(1);
      expect(progress.inProgressTasks).toBe(1);
      expect(progress.pendingTasks).toBe(2);
      expect(progress.blockers).toContain("API is down");
      expect(progress.currentTask).toBe("Task 2");
      expect(progress.currentPhase).toBe("Phase 1: Setup");
      expect(progress.nextAction).toBe("Task 3");
    });
  });
});
