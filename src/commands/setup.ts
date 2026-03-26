import type { ToolContext } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";
import { SetupStep, readState, writeState, updateStep } from "../utils/state.js";
import { getProjectMaturity, inferTechStack } from "../utils/discovery.js";

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
        const guidelinesMode = await client.tool.execute("question", {
          questions: [{
            header: "Guidelines",
            question: "How would you like to define your product guidelines?",
            type: "choice",
            options: [
              { label: "Interactive", description: "Answer a few questions to generate product-guidelines.md" },
              { label: "Autogenerate", description: "Let AI draft guidelines based on project context" }
            ]
          }]
        });

        let guidelinesContent = "";
        if (guidelinesMode?.answers?.["0"] === "Interactive") {
          const guidelinesAnswers = await client.tool.execute("question", {
            questions: [
              { header: "Prose", question: "What is the desired prose style for documentation?", type: "text" },
              { header: "Status", question: "How should status and progress be displayed?", type: "text" },
              { header: "Naming", question: "What are the naming conventions for the project?", type: "text" },
              { header: "Errors", question: "How should errors be handled and reported?", type: "text" },
              { header: "Commands", question: "What is the preferred command syntax and style?", type: "text" },
            ]
          });

          const a = guidelinesAnswers?.answers || {};
          guidelinesContent = `# Product Guidelines

## Prose Style
${a["0"] || "_Prose Style_"}

## Status Display
${a["1"] || "_Status Display_"}

## Naming Conventions
${a["2"] || "_Naming Conventions_"}

## Error Handling
${a["3"] || "_Error Handling_"}

## Command Syntax
${a["4"] || "_Command Syntax_"}
`;
        } else {
          guidelinesContent = `# Inferred Product Guidelines
_Draft guidelines based on project context..._
`;
        }

        const guidelinesPath = path.join(directory, "conductor", "product-guidelines.md");
        fs.writeFileSync(guidelinesPath, guidelinesContent, "utf-8");
        state = updateStep(directory, SetupStep.TECH_STACK);
        break;

      case SetupStep.TECH_STACK:
        const stackInference = state.maturity === "brownfield" ? inferTechStack(directory) : null;
        const inferenceSummary = stackInference 
          ? `I inferred the following stack: ${stackInference.language} using ${stackInference.packageManager}.`
          : "Since this is a greenfield project, no stack was inferred.";

        const techStackMode = await client.tool.execute("question", {
          questions: [{
            header: "Tech Stack",
            question: `${inferenceSummary} How would you like to define your tech stack?`,
            type: "choice",
            options: [
              { label: "Interactive", description: "Define your tech stack manually" },
              { label: "Autogenerate", description: "Let AI draft the tech stack based on inference and goals" }
            ]
          }]
        });

        let techStackContent = "";
        if (techStackMode?.answers?.["0"] === "Interactive") {
          const techStackAnswers = await client.tool.execute("question", {
            questions: [
              { header: "Language", question: "What is the primary programming language?", type: "text", placeholder: stackInference?.language },
              { header: "Architecture", question: "What is the core architecture?", type: "text", placeholder: stackInference?.architecture },
              { header: "Package", question: "What package management system are you using?", type: "text", placeholder: stackInference?.packageManager },
              { header: "Structure", question: "Describe the intended file structure.", type: "text" },
            ]
          });

          const a = techStackAnswers?.answers || {};
          techStackContent = `# Tech Stack

## Programming Language
${a["0"] || stackInference?.language || "_Language_"}

## Core Architecture
${a["1"] || stackInference?.architecture || "_Architecture_"}

## Package Management
${a["2"] || stackInference?.packageManager || "_Package Management_"}

## File Structure
\`\`\`
${a["3"] || "_File Structure_"}
\`\`\`
`;
        } else {
          techStackContent = `# Inferred Tech Stack
- **Language:** ${stackInference?.language || "Unknown"}
- **Architecture:** ${stackInference?.architecture || "Modular"}
- **Package Management:** ${stackInference?.packageManager || "Unknown"}
`;
        }

        const techStackPath = path.join(directory, "conductor", "tech-stack.md");
        fs.writeFileSync(techStackPath, techStackContent, "utf-8");
        state = updateStep(directory, SetupStep.STYLE_GUIDES);
        break;

      case SetupStep.STYLE_GUIDES:
        return `[CONDUCTOR] Setup paused at step: ${state.currentStep}. Implement Phase 2 Task 3 to continue.`;

      default:
        return `[ERROR] Unknown setup step: ${state.currentStep}`;
    }
  }

  return "[CONDUCTOR] Setup complete!";
}
