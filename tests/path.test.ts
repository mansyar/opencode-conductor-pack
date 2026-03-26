import { describe, it, expect } from "vitest";
import * as path from "path";
import {
  getProjectRoot,
  resolveConductorPath,
  resolveTracksPath,
  resolveTracksRegistryPath,
  resolveTrackPath,
} from "../src/utils/path";

describe("path utilities", () => {
  describe("getProjectRoot", () => {
    it("should return the directory as-is", () => {
      const directory = "/some/project/path";
      expect(getProjectRoot(directory)).toBe(directory);
    });
  });

  describe("resolveConductorPath", () => {
    it("should resolve path to conductor directory", () => {
      const directory = "/some/project/path";
      const result = resolveConductorPath(directory);
      const expected = path.normalize("/some/project/path/conductor");
      expect(path.normalize(result)).toBe(expected);
    });

    it("should resolve relative path within conductor directory", () => {
      const directory = "/some/project/path";
      const result = resolveConductorPath(directory, "tracks");
      const expected = path.normalize("/some/project/path/conductor/tracks");
      expect(path.normalize(result)).toBe(expected);
    });

    it("should handle nested paths", () => {
      const directory = "/some/project/path";
      const result = resolveConductorPath(directory, "tracks/phase1/plan.md");
      const expected = path.normalize("/some/project/path/conductor/tracks/phase1/plan.md");
      expect(path.normalize(result)).toBe(expected);
    });

    it("should handle empty directory gracefully", () => {
      const result = resolveConductorPath("");
      const expected = path.normalize("conductor");
      expect(path.normalize(result)).toBe(expected);
    });
  });

  describe("resolveTracksPath", () => {
    it("should resolve to tracks directory", () => {
      const directory = "/some/project/path";
      const result = resolveTracksPath(directory);
      const expected = path.normalize("/some/project/path/conductor/tracks");
      expect(path.normalize(result)).toBe(expected);
    });
  });

  describe("resolveTracksRegistryPath", () => {
    it("should resolve to tracks.md file", () => {
      const directory = "/some/project/path";
      const result = resolveTracksRegistryPath(directory);
      const expected = path.normalize("/some/project/path/conductor/tracks.md");
      expect(path.normalize(result)).toBe(expected);
    });
  });

  describe("resolveTrackPath", () => {
    it("should resolve to a specific track directory", () => {
      const directory = "/some/project/path";
      const trackId = "phase1Scaffolding20260326";
      const result = resolveTrackPath(directory, trackId);
      const expected = path.normalize("/some/project/path/conductor/tracks/phase1Scaffolding20260326");
      expect(path.normalize(result)).toBe(expected);
    });
  });
});