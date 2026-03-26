# Tech Stack: OpenCode Conductor Plugin

## 1. Programming Language

**TypeScript** — Strong typing throughout, excellent integration with OpenCode's plugin API, catches errors at compile time rather than runtime.

## 2. Core Architecture

**OpenCode Plugin API** — Direct usage of OpenCode's plugin system:

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const ConductorPlugin: Plugin = async ({ project, directory, worktree, client, $ }) => {
  return {
    // Hooks go here
  }
}
```

### Plugin Context
| Parameter | Description |
| :--- | :--- |
| `project` | Current project information |
| `directory` | Current working directory (project root) |
| `worktree` | Git worktree path |
| `client` | OpenCode SDK client for AI interaction |
| `$` | Bun's shell API for executing commands (via `bun shell`) |

### Events Available
- **Tool Events:** `tool.execute.before`, `tool.execute.after`
- **Session Events:** `session.idle`, `session.compacted`, `session.created`, `session.updated`
- **Shell Events:** `shell.env`
- **File Events:** `file.edited`, `file.watcher.updated`
- **TUI Events:** `tui.prompt.append`, `tui.command.execute`, `tui.toast.show`

## 3. Package Management

**pnpm** — Fast, disk space efficient package manager. While OpenCode uses Bun internally, this plugin project uses pnpm for development and dependency management.

```bash
# Install dependencies
pnpm install

# Add a dependency
pnpm add @opencode-ai/plugin
```

**Note:** OpenCode plugins are loaded via `.opencode/package.json` which OpenCode processes with Bun at startup. For local development, use pnpm; ensure the `.opencode/package.json` reflects the correct dependencies for runtime.

## 4. Dependencies

### Production
| Package | Purpose |
| :--- | :--- |
| `@opencode-ai/plugin` | Plugin API types and helpers |
| `@opencode-ai/sdk` | SDK for server interaction |

### Development
| Package | Purpose |
| :--- | :--- |
| `typescript` | Language |
| `vitest` | Unit testing |
| `@types/node` | Node.js type definitions |

## 5. File Structure

```
conductor-plugin/
├── src/
│   ├── index.ts              # Plugin entry point (exports ConductorPlugin)
│   ├── commands/
│   │   ├── setup.ts          # /conductor:setup command
│   │   ├── newTrack.ts       # /conductor:newTrack command
│   │   └── status.ts         # /conductor:status command
│   ├── hooks/
│   │   ├── toolInterceptor.ts    # tool.execute.before/after hooks
│   │   ├── sessionHooks.ts        # session.idle, session.compacted
│   │   └── tuiHooks.ts            # tui.toast.show, etc.
│   ├── artifacts/
│   │   ├── templates.ts      # Template definitions
│   │   └── generator.ts      # File generation logic
│   └── utils/
│       ├── path.ts           # Path utilities using directory context
│       └── validator.ts      # Validation helpers
├── tests/
│   └── *.test.ts             # Vitest unit tests
├── .opencode/
│   └── package.json          # Plugin dependencies
├── package.json               # Project manifest
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 6. Plugin Installation Locations

| Type | Path |
| :--- | :--- |
| Global Plugins | `~/.config/opencode/plugins/` |
| Project Plugins | `.opencode/plugins/` |
| Plugin Dependencies | `~/.config/opencode/package.json` |

## 7. Key Integration Points

### Tool Interception
```typescript
"tool.execute.before": async (input, output) => {
  // Validate tool call against plan.md
  // Block or modify as needed
}
```

### Custom Tools
```typescript
import { type Plugin, tool } from "@opencode-ai/plugin"

tool: {
  myTool: tool({
    description: "Custom conductor tool",
    args: { /* Zod schema */ },
    async execute(args, context) { /* ... */ }
  })
}
```

### Session Compaction
```typescript
"experimental.session.compacting": async (input, output) => {
  // Inject conductor context into compaction prompt
  output.context.push(`## Current Track Status...`)
}
```