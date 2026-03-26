# Tech Stack: OpenCode Conductor Plugin

## 1. Programming Language

**TypeScript** — Strong typing throughout, excellent integration with OpenCode's APIs, catches errors at compile time rather than runtime.

## 2. Core Architecture

**Vanilla Node.js** — No heavy framework dependencies. Direct usage of:
- Node.js built-in `events` module for the hook system
- Native `fs`/`path` for file operations
- OpenCode's plugin API for command registration and tool interception

## 3. Testing

**Vitest** — Fast unit tests with native ESM support, TypeScript-native, excellent watch mode for TDD.

## 4. Build & Packaging

**Vite** — Extremely fast builds, native TypeScript support, easy configuration for OpenCode plugin distribution.

## 5. File Structure

```
conductor-plugin/
├── src/
│   ├── index.ts           # Plugin entry point
│   ├── commands/          # /conductor:* command implementations
│   ├── hooks/             # Tool interception hooks
│   ├── artifacts/         # Artifact generation (product.md, plan.md, etc.)
│   └── utils/             # Shared utilities
├── tests/
│   └── *.test.ts          # Vitest unit tests
├── dist/                  # Built output
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 6. Dependencies

### Production
- `typescript` — Language
- `vite` — Build tool
- `@opencode/core` — OpenCode plugin API (to be confirmed)

### Development
- `vitest` — Testing
- `@types/node` — Node.js type definitions