# Product Guide: OpenCode Conductor Plugin

## 1. Vision & Goals

The **OpenCode Conductor Plugin** brings Context-Driven Development (CDD) to AI-assisted coding workflows. It treats the codebase as a self-documenting entity, where a standardized `conductor/` directory acts as the project's "brain"—carrying vision, plans, and enforcement rules that the AI agent reads and follows.

The plugin serves **AI-Assisted Developers** who want structured, reproducible, and artifact-driven development without sacrificing the flexibility of natural language interaction.

Built on OpenCode's native **Plugin API**, it integrates seamlessly with the tool execution lifecycle, session management, and TUI events.

## 2. Target Users

- **Primary:** Developers who actively use OpenCode with AI coding agents and want enforced structure
- **Secondary:** Teams integrating multiple AI agents that need shared project context
- **Tertiary:** Solo developers who want discipline without bureaucracy

## 3. Core Features

### Phase 1: Scaffolding (Foundation)
- **`/conductor:setup` Command:** Creates the standardized `conductor/` directory structure with all required files
- **Template System:** Hardcoded boilerplates for `product.md`, `tech-stack.md`, `product-guidelines.md`, `workflow.md`
- **Path Isolation:** All file operations resolve relative to OpenCode's `directory` context ensuring safe multi-project usage

### Phase 2: Context Injection (The Brain)
- **System Prompt Hook:** Uses `session.prompt` with `noReply: true` to inject `product.md` and `tech-stack.md` into the AI's context
- **Dynamic Track Loading:** Auto-detects active `<track_id>` and injects corresponding `spec.md` via `experimental.session.compacting`
- **Token Optimization:** Summarizer for large artifact files exceeding context windows

### Phase 3: Build Engine (The Muscle)
- **Tool Interception:** Uses `tool.execute.before` hook to block edits if `plan.md` is missing or out of sync
- **Auto-Progress:** Uses `tool.execute.after` hook to update checkboxes in `plan.md` based on completed work
- **TDD Enforcement:** Requires test coverage before allowing implementation in specific directories

### Phase 4: Integration & Polish
- **TUI Status Bar:** Uses `tui.toast.show` and `tui.prompt.append` for "Current Task" visual indicators
- **Git Integration:** `/conductor:commit` auto-generates messages from completed `plan.md` tasks
- **Session Hooks:** Uses `session.idle`, `session.compacted` events for workflow automation

## 4. Design Philosophy

| Principle | Description |
| :--- | :--- |
| **Project Isolation** | All paths resolve relative to OpenCode's `directory` context — safe for multiple simultaneous projects |
| **Artifact-First** | The agent reads from Markdown files, not just volatile chat history |
| **Guardrails** | Tool calls are intercepted via `tool.execute.before` to ensure code strictly matches the approved plan |
| **Native Integration** | Leverages OpenCode's Plugin API (`@opencode-ai/plugin`) for seamless integration |

## 5. Success Metrics

- Plugin creates valid `conductor/` structure in < 2 seconds
- AI agent correctly reads and follows `plan.md` checkpoints
- Zero "off-plan" code modifications when guardrails are active
- Successful integration with OpenCode's tool execution lifecycle via Plugin API

## 6. Technical Foundation

The plugin is built on:
- **Plugin API:** `@opencode-ai/plugin` for hooks, custom tools, and events
- **SDK:** `@opencode-ai/sdk` for server interaction
- **Bun:** Package management (as required by OpenCode)