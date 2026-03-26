import * as fs from "fs";
import * as path from "path";
import { resolveConductorPath } from "./path";

export enum SetupStep {
  DISCOVERY = "discovery",
  PRODUCT = "product",
  GUIDELINES = "guidelines",
  TECH_STACK = "tech_stack",
  STYLE_GUIDES = "style_guides",
  SCAFFOLDING = "scaffolding",
  TRACKS = "tracks",
  GIT = "git",
  COMPLETE = "complete",
}

export interface SetupState {
  currentStep: SetupStep;
  maturity: "greenfield" | "brownfield" | "unknown";
  completedSteps: SetupStep[];
  data: Record<string, any>;
}

/**
 * Get the path to the setup state file
 */
export function resolveSetupStatePath(directory: string): string {
  return resolveConductorPath(directory, "setup_state.json");
}

/**
 * Read the setup state from disk
 */
export function readState(directory: string): SetupState | null {
  const statePath = resolveSetupStatePath(directory);
  if (!fs.existsSync(statePath)) {
    return null;
  }
  try {
    const content = fs.readFileSync(statePath, "utf-8");
    return JSON.parse(content) as SetupState;
  } catch (error) {
    console.error(`Error reading setup state: ${error}`);
    return null;
  }
}

/**
 * Write the setup state to disk
 */
export function writeState(directory: string, state: SetupState): void {
  const statePath = resolveSetupStatePath(directory);
  const conductorDir = path.dirname(statePath);
  
  if (!fs.existsSync(conductorDir)) {
    fs.mkdirSync(conductorDir, { recursive: true });
  }
  
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
}

/**
 * Update the current step and move the previous step to completed
 */
export function updateStep(directory: string, nextStep: SetupStep): SetupState {
  const currentState = readState(directory);
  if (!currentState) {
    throw new Error("Cannot update step: No existing setup state found.");
  }

  const prevStep = currentState.currentStep;
  if (!currentState.completedSteps.includes(prevStep)) {
    currentState.completedSteps.push(prevStep);
  }

  currentState.currentStep = nextStep;
  writeState(directory, currentState);
  return currentState;
}
