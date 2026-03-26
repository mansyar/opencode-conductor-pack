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
