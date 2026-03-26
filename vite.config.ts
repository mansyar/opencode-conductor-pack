import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/*.test.ts", "tests/"]
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ConductorPlugin",
      formats: ["es"],
      fileName: "index"
    },
    rollupOptions: {
      external: ["@opencode-ai/plugin", "@opencode-ai/sdk"],
      output: {
        globals: {
          "@opencode-ai/plugin": "Plugin",
          "@opencode-ai/sdk": "SDK"
        }
      }
    }
  }
});