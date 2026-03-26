import { tool, type ToolContext } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";

/**
 * ConductorPlugin - OpenCode Context-Driven Development Plugin
 * 
 * This plugin provides the /conductor:setup command and scaffolding
 * functionality for initializing the conductor/ directory structure.
 */
export const ConductorPlugin: Plugin = async ({ client, $, directory, worktree }) => {
  return {
    tool: {
      "conductor:setup": tool({
        description: "Initialize the conductor/ directory structure with all required artifact files",
        args: {},
        async execute(_args, context: ToolContext) {
          const { executeSetupCommand } = await import("./commands/setup.js");
          return executeSetupCommand({ client, $, directory, worktree }, context);
        },
      }),
      "conductor:status": tool({
        description: "Display an overall progress status for all tracks and tasks",
        args: {},
        async execute(_args, context: ToolContext) {
          const { executeStatusCommand } = await import("./commands/status.js");
          return executeStatusCommand({ client, directory }, context);
        },
      }),
    },
  };
};
