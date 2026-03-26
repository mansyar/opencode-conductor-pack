# Product Guide: OpenCode Conductor Plugin

## 1. Vision & Goals

The **OpenCode Conductor Plugin** brings Context-Driven Development (CDD) to AI-assisted coding workflows. It treats the codebase as a self-documenting entity, where a standardized `conductor/` directory acts as the project's "brain"—carrying vision, plans, and enforcement rules that the AI agent reads and follows.

The plugin serves **AI-Assisted Developers** who want structured, reproducible, and artifact-driven development without sacrificing the flexibility of natural language interaction.

## 2. Target Users

- **Primary:** Developers who actively use AI coding agents (Claude, GPT, Gemini, etc.) and want enforced structure
- **Secondary:** Teams integrating multiple AI agents that need shared project context
- **Tertiary:** Solo developers who want discipline without bureaucracy

## 3. Core Features

### Phase 1: Scaffolding (Foundation)
- **`/conductor:setup` Command:** Creates the standardized `conductor/` directory structure with all required files
- **Template System:** Hardcoded boilerplates for `product.md`, `tech-stack.md`, `product-guidelines.md`, `workflow.md`
- **Path Isolation:** All file operations resolve relative to `process.cwd()` ensuring safe multi-project usage

### Phase 2: Context Injection (The Brain)
- **System Prompt Hook:** Injects `product.md` and `tech-stack.md` into the AI's global context
- **Dynamic Track Loading:** Auto-detects active `<track_id>` and injects corresponding `spec.md`
- **Token Optimization:** Summarizer for large artifact files exceeding context windows

### Phase 3: Build Engine (The Muscle)
- **Tool Interception:** Blocks edits if `plan.md` is missing or out of sync
- **Auto-Progress:** Post-edit hook updates checkboxes in `plan.md` based on completed work
- **TDD Enforcement:** Requires test coverage before allowing implementation in specific directories

### Phase 4: Integration & Polish
- **TUI Status Bar:** "Current Task" visual indicator in terminal
- **Git Integration:** `/conductor:commit` auto-generates messages from completed `plan.md` tasks
- **Multi-Model Support:** Toggle between reasoning models (Planning) and fast models (Building)

## 4. Design Philosophy

| Principle | Description |
| :--- | :--- |
| **Project Isolation** | All paths resolve relative to `process.cwd()` — safe for multiple simultaneous projects |
| **Artifact-First** | The agent reads from Markdown files, not just volatile chat history |
| **Guardrails** | Tool calls are intercepted to ensure code strictly matches the approved plan |

## 5. Success Metrics

- Plugin creates valid `conductor/` structure in < 2 seconds
- AI agent correctly reads and follows `plan.md` checkpoints
- Zero "off-plan" code modifications when guardrails are active
- Successful integration with OpenCode's tool execution lifecycle