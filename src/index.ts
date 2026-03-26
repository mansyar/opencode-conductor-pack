/// <reference types="vitest/globals" />
/// <reference types="node" />

declare module "@opencode-ai/plugin" {
  export interface PluginContext {
    project: {
      name: string;
      root: string;
    };
    directory: string;
    worktree: string;
    client: unknown;
  }

  export type Plugin = (context: PluginContext) => Promise<PluginReturn>;

  export interface PluginReturn {
    name?: string;
    tools?: Record<string, unknown>;
    hooks?: Record<string, unknown>;
  }
}