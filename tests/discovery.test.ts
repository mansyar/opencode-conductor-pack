import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { getProjectMaturity, scanProject } from "../src/utils/discovery";

describe("project discovery", () => {
  const testDir = path.join(process.cwd(), "test-discovery-temp");

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("getProjectMaturity", () => {
    it("should return 'greenfield' for an empty directory", () => {
      expect(getProjectMaturity(testDir)).toBe("greenfield");
    });

    it("should return 'brownfield' if .git exists", () => {
      fs.mkdirSync(path.join(testDir, ".git"));
      expect(getProjectMaturity(testDir)).toBe("brownfield");
    });

    it("should return 'brownfield' if package.json exists", () => {
      fs.writeFileSync(path.join(testDir, "package.json"), "{}");
      expect(getProjectMaturity(testDir)).toBe("brownfield");
    });

    it("should return 'brownfield' if src directory exists", () => {
      fs.mkdirSync(path.join(testDir, "src"));
      expect(getProjectMaturity(testDir)).toBe("brownfield");
    });

    it("should return 'greenfield' for a directory with only ignored files", () => {
      fs.writeFileSync(path.join(testDir, ".DS_Store"), "empty");
      expect(getProjectMaturity(testDir)).toBe("greenfield");
    });
  });

  describe("scanProject", () => {
    it("should return a list of files excluding .gitignore patterns", () => {
      fs.mkdirSync(path.join(testDir, "src"), { recursive: true });
      fs.writeFileSync(path.join(testDir, "src/index.ts"), "content");
      fs.mkdirSync(path.join(testDir, "node_modules"), { recursive: true });
      fs.writeFileSync(path.join(testDir, "node_modules/lib.js"), "content");
      fs.writeFileSync(path.join(testDir, ".gitignore"), "node_modules/");

      const files = scanProject(testDir);
      const relativeFiles = files.map(f => path.relative(testDir, f).replace(/\\/g, '/'));
      
      expect(relativeFiles).toContain("src/index.ts");
      expect(relativeFiles).not.toContain("node_modules/lib.js");
      expect(relativeFiles).not.toContain(".gitignore");
    });

    it("should return empty list if initial directory is a file (fails readdirSync)", () => {
        const filePath = path.join(testDir, "file.txt");
        fs.writeFileSync(filePath, "content");
        const files = scanProject(filePath);
        expect(files).toEqual([]);
    });
  });
});
