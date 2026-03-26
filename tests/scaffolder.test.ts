import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { proposeInitialTrack } from "../src/utils/discovery.js";

describe("Initial Track Scaffolder", () => {
  const testDir = path.join(process.cwd(), "test-scaffolder-temp");
  const conductorDir = path.join(testDir, "conductor");

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(conductorDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("should propose a track name from product.md Phase 1", () => {
    const productContent = `# Test Product

## Core Features
### Phase 1: Foundation Layer
- Set up project structure
- Add database models
`;
    fs.writeFileSync(path.join(conductorDir, "product.md"), productContent);

    const proposedTitle = proposeInitialTrack(testDir);
    expect(proposedTitle).toBe("Foundation Layer");
  });

  it("should return a default if no product.md exists", () => {
    const proposedTitle = proposeInitialTrack(testDir);
    expect(proposedTitle).toBe("Build core functionality");
  });

  it("should return a default if product.md has no Phase 1", () => {
    const productContent = `# Test Product
## Vision
...`;
    fs.writeFileSync(path.join(conductorDir, "product.md"), productContent);
    const proposedTitle = proposeInitialTrack(testDir);
    expect(proposedTitle).toBe("Build core functionality");
  });
});
