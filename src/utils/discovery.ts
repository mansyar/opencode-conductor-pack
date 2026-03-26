import * as fs from "fs";
import * as path from "path";

/**
 * Identify "Brownfield" (existing) vs. "Greenfield" (new) projects
 */
export function getProjectMaturity(directory: string): "brownfield" | "greenfield" {
  const indicators = [
    ".git",
    "package.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "package-lock.json",
    "src",
    "lib",
    "requirements.txt",
    "go.mod",
    "Cargo.toml",
  ];

  for (const indicator of indicators) {
    if (fs.existsSync(path.join(directory, indicator))) {
      return "brownfield";
    }
  }

  // Check if there are any non-conductor files/folders
  try {
    const entries = fs.readdirSync(directory);
    const nonConductorEntries = entries.filter(e => e !== "conductor" && e !== ".DS_Store");
    return nonConductorEntries.length > 0 ? "brownfield" : "greenfield";
  } catch (error) {
    return "greenfield";
  }
}

/**
 * A safe, .gitignore-aware file scanner for context extraction
 */
export function scanProject(directory: string): string[] {
  const ignorePatterns = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".DS_Store",
    "conductor",
    "setup_state.json",
  ];

  const gitignorePath = path.join(directory, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    const customPatterns = gitignoreContent
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("#"));
    ignorePatterns.push(...customPatterns);
    ignorePatterns.push(".gitignore");
  }

  const results: string[] = [];

  function walk(currentDir: string) {
    let entries;
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (e) {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(directory, fullPath);
      const normalizedRelativePath = relativePath.replace(/\\/g, '/');

      // Simple match for ignore patterns
      const isIgnored = ignorePatterns.some(pattern => {
        const p = pattern.replace(/\/$/, "");
        return normalizedRelativePath === p || 
               normalizedRelativePath.startsWith(p + '/') || 
               entry.name === p;
      });

      if (isIgnored) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        results.push(fullPath);
      }
    }
  }

  walk(directory);
  return results;
}

/**
 * Infer technology stack from project files
 */
export function inferTechStack(directory: string): Record<string, string> {
  const stack: Record<string, string> = {
    language: "Unknown",
    architecture: "Modular",
    packageManager: "Unknown",
  };

  if (fs.existsSync(path.join(directory, "package.json"))) {
    stack.language = "TypeScript/JavaScript";
    if (fs.existsSync(path.join(directory, "pnpm-lock.yaml"))) stack.packageManager = "pnpm";
    else if (fs.existsSync(path.join(directory, "yarn.lock"))) stack.packageManager = "yarn";
    else stack.packageManager = "npm";
  } else if (fs.existsSync(path.join(directory, "requirements.txt")) || fs.existsSync(path.join(directory, "pyproject.toml"))) {
    stack.language = "Python";
    stack.packageManager = "pip/poetry";
  } else if (fs.existsSync(path.join(directory, "go.mod"))) {
    stack.language = "Go";
    stack.packageManager = "go mod";
  }

  return stack;
}
/**
 * Propose an initial track name based on product definition
 */
export function proposeInitialTrack(directory: string): string {
  const defaultTrack = "Build core functionality";
  const productPath = path.join(directory, "conductor", "product.md");

  if (!fs.existsSync(productPath)) {
    return defaultTrack;
  }

  try {
    const content = fs.readFileSync(productPath, "utf-8");
    // Look for Phase 1 feature name: ### Phase 1: Feature Name
    const phase1Match = content.match(/### Phase 1:\s*(.*)/i);
    if (phase1Match && phase1Match[1]) {
      const name = phase1Match[1].trim();
      // Remove any trailing markdown markers if present
      return name.replace(/_$/, "").replace(/^_/, "").trim() || defaultTrack;
    }
  } catch (e) {
    // Fallback if file read fails
  }

  return defaultTrack;
}
