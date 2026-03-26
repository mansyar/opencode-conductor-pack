import type { ToolContext } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";
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
        const productMode = await client.tool.execute("question", {
          questions: [{
            header: "Product",
            question: "How would you like to define your product?",
            type: "choice",
            options: [
              { label: "Interactive", description: "Answer a few questions to generate product.md" },
              { label: "Autogenerate", description: "Let AI draft a product definition based on project context" }
            ]
          }]
        });

        let productContent = "";
        if (productMode?.answers?.["0"] === "Interactive") {
          const productAnswers = await client.tool.execute("question", {
            questions: [
              { header: "Name", question: "What is the name of your product?", type: "text" },
              { header: "Vision", question: "What is the vision and goals for this product?", type: "text" },
              { header: "Users", question: "Who are the target users (Primary and Secondary)?", type: "text" },
              { header: "Features", question: "What are the core features (starting with Phase 1)?", type: "text" },
              { header: "Metrics", question: "What are the success metrics?", type: "text" },
              { header: "Foundation", question: "What is the technical foundation?", type: "text" },
            ]
          });

          const a = productAnswers?.answers || {};
          productContent = `# ${a["0"] || "Product Name"}

## Vision & Goals

${a["1"] || "_Vision & Goals_"}

## Target Users

${a["2"] || "_Target Users_"}

## Core Features

${a["3"] || "_Core Features_"}

## Success Metrics

${a["4"] || "_Success Metrics_"}

## Technical Foundation

${a["5"] || "_Technical Foundation_"}
`;
        } else {
          // Autogenerate mode
          productContent = `# Inferred Product Name

## Vision & Goals
_Draft vision based on project analysis..._

... (Rest of AI-generated content would go here)
`;
        }

        const productPath = path.join(directory, "conductor", "product.md");
        fs.mkdirSync(path.dirname(productPath), { recursive: true });
        fs.writeFileSync(productPath, productContent, "utf-8");
        
        state = updateStep(directory, SetupStep.GUIDELINES);
        break;

      case SetupStep.GUIDELINES:
        return `[CONDUCTOR] Setup paused at step: ${state.currentStep}. Implement Phase 2 Task 2 to continue.`;

      default:
        return `[ERROR] Unknown setup step: ${state.currentStep}`;
    }
  }

  return "[CONDUCTOR] Setup complete!";
}
