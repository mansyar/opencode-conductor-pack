import type { ToolContext } from "@opencode-ai/plugin";
import { SetupStep, readState, writeState, updateStep } from "../utils/state.js";
import { getProjectMaturity } from "../utils/discovery.js";

/**
 * Executes the /conductor:setup command
 * Refactored into a stateful, interactive wizard.
 */
export async function executeSetupCommand(client: any, context: ToolContext): Promise<string> {
  const directory = context.directory;
  let state = readState(directory);

  if (state && state.currentStep !== SetupStep.COMPLETE) {
    // Ask to resume
    const response = await client.tool.execute("question", {
      questions: [{
        header: "Resume",
        question: `I found an existing setup in progress (Step: ${state.currentStep}). Would you like to resume?`,
        type: "yesno"
      }]
    });
    
    if (response?.answers?.["0"] === "No") {
      state = null;
    }
  }

  if (!state) {
    // Start from discovery
    const maturity = getProjectMaturity(directory);
    state = {
      currentStep: SetupStep.DISCOVERY,
      maturity,
      completedSteps: [],
      data: {}
    };
    writeState(directory, state);
  }

  // Orchestration Loop
  while (state.currentStep !== SetupStep.COMPLETE) {
    switch (state.currentStep) {
      case SetupStep.DISCOVERY:
        state = updateStep(directory, SetupStep.PRODUCT);
        break;
      
      case SetupStep.PRODUCT:
        // Implementation for Phase 2
        return `[CONDUCTOR] Setup paused at step: ${state.currentStep}. Implement Phase 2 to continue.`;

      default:
        return `[ERROR] Unknown setup step: ${state.currentStep}`;
    }
  }

  return "[CONDUCTOR] Setup complete!";
}
