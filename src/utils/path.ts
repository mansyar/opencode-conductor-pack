import * as path from "path";

/**
 * Get the project root directory from the OpenCode directory context
 * This ensures path isolation across multiple simultaneous projects
 */
export function getProjectRoot(directory: string): string {
  return directory;
}

/**
 * Resolve a path relative to the conductor directory
 * @param directory - The OpenCode directory context
 * @param relativePath - Path relative to conductor/ directory
 */
export function resolveConductorPath(directory: string, relativePath: string = ""): string {
  return path.join(directory, "conductor", relativePath);
}

/**
 * Get the path to the tracks directory
 */
export function resolveTracksPath(directory: string): string {
  return resolveConductorPath(directory, "tracks");
}

/**
 * Get the path to the tracks registry file
 */
export function resolveTracksRegistryPath(directory: string): string {
  return resolveConductorPath(directory, "tracks.md");
}

/**
 * Get the path to a specific track's directory
 */
export function resolveTrackPath(directory: string, trackId: string): string {
  return path.join(resolveTracksPath(directory), trackId);
}

/**
 * Check if the conductor directory exists
 */
export function conductorExists(directory: string): boolean {
  const conductorPath = resolveConductorPath(directory);
  // Dynamic import to avoid issues with Vite browser externalization
  // This check is done at runtime in the actual command
  return false; // Placeholder - actual check happens in command
}
