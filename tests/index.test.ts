import { describe, it, expect } from "vitest";

describe("plugin entry point", () => {
  it("should export ConductorPlugin", async () => {
    const { ConductorPlugin } = await import("../src/index");
    expect(ConductorPlugin).toBeDefined();
    expect(typeof ConductorPlugin).toBe("function");
  });

  it("should export plugin as default export", async () => {
    const plugin = await import("../src/index");
    expect(plugin.default).toBeDefined();
    expect(typeof plugin.default).toBe("function");
  });

  it("should have correct plugin structure", async () => {
    const { ConductorPlugin } = await import("../src/index");
    
    // The plugin should be an async function
    expect(ConductorPlugin.constructor.name).toBe("AsyncFunction");
    
    // Calling the plugin should return an object with tools
    const input = {
      client: {},
      project: { name: "test", root: "/test" },
      directory: "/test",
      worktree: "/test",
      serverUrl: new URL("http://localhost:3000"),
      $: {},
    };
    
    const result = await ConductorPlugin(input);
    expect(result).toHaveProperty("tool");
    expect(result.tool).toHaveProperty("conductor:setup");
  });
});