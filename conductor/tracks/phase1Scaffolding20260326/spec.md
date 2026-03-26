# Specification: Phase 1 Scaffolding - Setup Command and Template System

## 1. Concept & Vision

The **Conductor Plugin Scaffolding** is the foundation of the OpenCode Conductor Plugin. It provides the essential `/conductor:setup` command that initializes a standardized `conductor/` directory structure in any project, along with a robust template system that creates all required artifact files.

This phase establishes the **Project Isolation** principle: all paths resolve relative to OpenCode's `directory` context, ensuring safe usage across multiple simultaneous projects.

## 2. What & Why

### What
- A `/conductor:setup` command that creates:
  - `conductor/` directory with proper structure
  - `product.md` template
  - `product-guidelines.md` template
  - `tech-stack.md` template
  - `workflow.md` template
  - `code_styleguides/` directory
  - `tracks.md` registry file
  - `tracks/` directory

### Why
- Without scaffolding, users must manually create the conductor structure
- Ensures consistent starting point across all projects
- Establishes path isolation patterns used throughout the plugin
- Provides templates that guide users through proper artifact creation

## 3. Design Principles

| Principle | Implementation |
| :--- | :--- |
| **Project Isolation** | All paths computed from OpenCode's `directory` context |
| **Artifact-First** | Markdown files are the source of truth |
| **Guardrails** | Setup validates environment before creating files |
| **Error Prevention** | Fails gracefully if `conductor/` already exists |

## 4. Command Specification

### `/conductor:setup`
**Input:** None (no arguments required)

**Implementation:** Custom tool registered via OpenCode's plugin `tool` API.

**Behavior:**
1. Check if `conductor/` already exists
   - If exists: Error with message "conductor/ already initialized. Remove it first to re-initialize."
   - If not: Continue
2. Validate environment (Bun availability, working directory)
3. Create directory structure
4. Generate all template files with sensible defaults
5. Initialize `tracks.md` with header
6. Create empty `tracks/` directory
7. Output success message with created paths

**Output:**
```
[CONDUCTOR] Initialized conductor/ structure
  ✓ Created conductor/product.md
  ✓ Created conductor/product-guidelines.md
  ✓ Created conductor/tech-stack.md
  ✓ Created conductor/workflow.md
  ✓ Created conductor/code_styleguides/
  ✓ Created conductor/tracks.md
  ✓ Created conductor/tracks/
```

## 5. Template Files

### product.md
Contains structured sections:
- # Product Name
- ## Vision & Goals
- ## Target Users
- ## Core Features
- ## Success Metrics
- ## Technical Foundation

### product-guidelines.md
Contains structured sections:
- ## Prose Style
- ## Status Display
- ## Naming Conventions
- ## Error Handling
- ## Command Syntax

### tech-stack.md
Contains structured sections:
- ## Programming Language
- ## Core Architecture (Plugin API, Events)
- ## Package Management
- ## File Structure

### workflow.md
Contains structured sections:
- ## Guiding Principles
- ## Task Workflow
- ## Quality Gates
- ## Testing Requirements

## 6. File Structure

```
conductor/
├── product.md
├── product-guidelines.md
├── tech-stack.md
├── workflow.md
├── code_styleguides/
│   └── (empty, to be populated)
├── tracks.md
└── tracks/
    └── (empty, to contain track directories)
```

## 7. Technical Approach

- **Language:** TypeScript
- **Plugin API:** `@opencode-ai/plugin` with `Plugin` type
- **Tool Definition:** Using `tool()` helper from plugin package
- **Path Handling:** Using OpenCode's `directory` context
- **Template Generation:** Template literals with placeholder replacement
- **Validation:** Environment checks before any file system operations

## 8. Out of Scope (Future Phases)

- Context injection via session hooks (Phase 2)
- Tool interception hooks (Phase 3)
- TUI status bar (Phase 4)
- Git integration commands (Phase 4)