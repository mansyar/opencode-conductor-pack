import { tool, type ToolContext } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";

/**
 * ConductorPlugin - OpenCode Context-Driven Development Plugin
 * 
 * This plugin provides the /conductor:setup command and scaffolding
 * functionality for initializing the conductor/ directory structure.
 */
export const ConductorPlugin: Plugin = async (input) => {
  return {
    tool: {
      "conductor:setup": tool({
        description: "Initialize the conductor/ directory structure with all required artifact files",
        args: {},
        async execute(_args, context: ToolContext) {
          // Import here to avoid circular dependency issues
          const { executeSetupCommand } = await import("./commands/setup.js");
          return executeSetupCommand(context);
        },
      }),
    },
  };
};

export { ConductorPlugin as default };
export { ConductorPlugin as plugin };
