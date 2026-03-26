import * as fs from 'node:fs/promises';
import path from 'node:path';

export interface Track {
  description: string;
  link: string;
  status: 'pending' | 'completed' | 'in-progress';
}

export interface PlanProgress {
  totalPhases: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  blockers: string[];
  currentTask: string | null;
  currentPhase: string | null;
  nextAction: string | null;
}

/**
 * Extracts tracks from the registry markdown content.
 * Supports both standard: - [ ] **Track: ...
 * and legacy: ## [ ] Track: ...
 */
export function extractTracksFromRegistry(content: string): Track[] {
  const tracks: Track[] = [];
  const lines = content.split('\n');

  // Regex Patterns
  // 1. Standard: - [ ] **Track: ...
  const standardPattern = /^[-*]\s\[( |x|~)\]\s\*\*Track:\s(.*?)\*\*/i;
  // 2. Legacy: ## [ ] Track: ...
  const legacyPattern = /^##\s\[( |x|~)\]\sTrack:\s(.*)/i;
  // 3. Link: Link: [./path/](...)
  const linkPattern = /^\s*Link:\s\[(.*?)\]/i;

  let currentTrack: Partial<Track> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    const standardMatch = line.match(standardPattern);
    const legacyMatch = line.match(legacyPattern);

    if (standardMatch || legacyMatch) {
      if (currentTrack?.description && currentTrack.link) {
        tracks.push(currentTrack as Track);
      }

      const match = standardMatch || legacyMatch;
      const statusChar = match![1];
      const description = match![2];
      
      currentTrack = {
        description,
        status: statusChar === 'x' ? 'completed' : statusChar === '~' ? 'in-progress' : 'pending'
      };
      continue;
    }

    const linkMatch = line.match(linkPattern);
    if (linkMatch && currentTrack) {
      currentTrack.link = linkMatch[1];
    }
  }

  if (currentTrack?.description && currentTrack.link) {
    tracks.push(currentTrack as Track);
  }

  return tracks;
}

/**
 * Reads the plan.md file for a track relative to the registry directory.
 */
export async function readTrackPlan(registryDir: string, trackLink: string): Promise<string | null> {
  try {
    const planPath = path.resolve(registryDir, trackLink, 'plan.md');
    return await fs.readFile(planPath, 'utf-8');
  } catch (error) {
    return null;
  }
}

/**
 * Parses the implementation plan markdown to tally progress.
 */
export function parsePlanProgress(content: string): PlanProgress {
  const lines = content.split('\n');
  let totalPhases = 0;
  let totalTasks = 0;
  let completedTasks = 0;
  let inProgressTasks = 0;
  let pendingTasks = 0;
  const blockers: string[] = [];
  let currentTask: string | null = null;
  let currentPhase: string | null = null;
  let lastPhase: string | null = null;
  let nextAction: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Parse Phases
    if (trimmed.startsWith('## Phase')) {
      totalPhases++;
      lastPhase = trimmed.replace(/^##\s+/, '');
      continue;
    }

    // Parse Tasks
    const taskMatch = trimmed.match(/^[-*]\s\[( |x|~)\]\sTask:\s(.*)/i);
    if (taskMatch) {
      totalTasks++;
      const status = taskMatch[1];
      const taskName = taskMatch[2].split(' [checkpoint:')[0].trim(); // Remove checkpoint info

      if (status === 'x') {
        completedTasks++;
      } else if (status === '~') {
        inProgressTasks++;
        currentTask = taskName;
        currentPhase = lastPhase;
      } else {
        pendingTasks++;
        if (!nextAction) {
          nextAction = taskName;
        }
      }
    }

    // Parse Blockers
    if (trimmed.toLowerCase().includes('blocker:')) {
      blockers.push(trimmed.replace(/blocker:\s*/i, ''));
    }
  }

  return {
    totalPhases,
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    blockers,
    currentTask,
    currentPhase,
    nextAction
  };
}
