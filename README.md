# OpenCode Conductor Plugin

Context-Driven Development (CDD) plugin for OpenCode AI coding agent.

## Overview

The Conductor Plugin brings structure and discipline to AI-assisted coding workflows by treating the codebase as a self-documenting entity. A standardized `conductor/` directory acts as the project's "brain" — carrying vision, plans, and enforcement rules that the AI agent reads and follows.

## Features

### Phase 1: Scaffolding (Foundation)
- **`/conductor:setup` Command:** Creates the standardized `conductor/` directory structure with all required files
- **Template System:** Hardcoded boilerplates for `product.md`, `tech-stack.md`, `product-guidelines.md`, `workflow.md`
- **Path Isolation:** All file operations resolve relative to OpenCode's `directory` context ensuring safe multi-project usage

## Requirements

- **Runtime:** Bun (required by OpenCode)
- **Package Manager:** pnpm (for development)

## Installation

### As a Global Plugin

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the plugin:
   ```bash
   pnpm build
   ```
4. The plugin can be loaded by OpenCode from the built `dist/` directory

### As a Project Plugin

Place the plugin in your project's `.opencode/plugins/` directory.

## Usage

### Initialize a New Project

To initialize the conductor structure in a new project:

1. Ensure you're in an OpenCode session with this plugin loaded
2. Run:
   ```
   /conductor:setup
   ```

This will create:
```
conductor/
├── product.md              # Product vision and goals
├── product-guidelines.md    # Communication and prose style guidelines
├── tech-stack.md           # Technology choices and architecture
├── workflow.md             # Development workflow and task lifecycle
├── code_styleguides/       # Code style guides (empty, to be populated)
├── tracks.md               # Project tracks registry
└── tracks/                 # Track directories (empty, to be populated)
```

### Configuration

After running `/conductor:setup`, edit the generated files to customize them for your project:

1. **product.md** - Define your product's vision, goals, and target users
2. **product-guidelines.md** - Set communication style and conventions
3. **tech-stack.md** - Document your technology choices
4. **workflow.md** - Customize the development workflow

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build for production
pnpm build

# Run all checks (lint, test, build)
pnpm check
```

### Project Structure

```
conductor-plugin/
├── src/
│   ├── index.ts              # Plugin entry point (exports ConductorPlugin)
│   ├── commands/
│   │   └── setup.ts         # /conductor:setup command implementation
│   ├── artifacts/
│   │   └── templates.ts      # Template definitions for conductor files
│   └── utils/
│       └── path.ts           # Path utilities for project isolation
├── tests/
│   ├── path.test.ts          # Tests for path utilities
│   └── setup.test.ts         # Integration tests for setup command
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### Testing

The project uses Vitest for testing. Tests are located in the `tests/` directory.

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Building

```bash
# Build for production
pnpm build

# The output is in dist/ directory
```

## Architecture

### Path Isolation

All paths in the plugin resolve relative to OpenCode's `directory` context. This ensures safe usage across multiple simultaneous projects without path conflicts.

Key utilities in `src/utils/path.ts`:
- `getProjectRoot()` - Returns the project root from OpenCode context
- `resolveConductorPath()` - Resolves paths within the conductor directory
- `resolveTracksPath()` - Resolves paths to the tracks directory

### Plugin API

The plugin uses OpenCode's Plugin API:
- **Tool Registration:** Custom `conductor:setup` tool registered via `tool()` helper
- **Context:** Uses OpenCode's `directory` context for path resolution
- **Events:** Designed to support hooks (Phase 2+) for context injection

## Roadmap

- [x] Phase 1: Scaffolding - Setup Command and Template System
- [ ] Phase 2: Context Injection - Session hooks for context injection
- [ ] Phase 3: Build Engine - Tool interception for plan enforcement
- [ ] Phase 4: Integration - TUI status bar, Git integration

## License

MIT
