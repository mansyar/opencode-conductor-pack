# Blueprint & Roadmap: OpenCode Conductor Plugin (CDD)

## 1. Project Blueprint: Architecture
The plugin follows the "Context-Driven Development" (CDD) pattern where the codebase 
carries its own "brain" in a standardized directory.

### A. Core Philosophy
- **Project Isolation:** All paths are resolved relative to `process.cwd()`.
- **Artifact-First:** The agent reads from Markdown files, not just chat history.
- **Guardrails:** The plugin intercepts tool calls to ensure code matches the plan.

### B. Folder Structure (Gemini CLI Mirror)
To ensure 100% parity with the original Conductor extension:
your-project/
└── conductor/
    ├── product.md                # High-level vision & goals
    ├── product-guidelines.md     # Voice, UI, and UX standards
    ├── tech-stack.md             # Languages, frameworks, and architecture
    ├── workflow.md               # Process rules (TDD, Git, Linting)
    ├── tracks.md                 # Registry of all features/bugs
    ├── code_styleguides/         # Specific formatting rules
    └── tracks/
        └── <track_id>/           # Unique feature folder
            ├── spec.md           # The "What" and "Why"
            └── plan.md           # The "How" (Task Checklist)

---

## 2. State Machine: Workflow Modes
1. IDLE: Default OpenCode behavior.
2. PLANNING: Triggered by `/conductor:new`. Uses high-reasoning models (o1/Claude 4.5).
3. BUILDING: Triggered by `/conductor:build`. Activates strict plan-following hooks.
4. VERIFYING: Post-build check against the `spec.md`.

---

## 3. Development Roadmap

### Phase 1: Scaffolding (The Alpha)
- [ ] Implement `/conductor:setup`: Creates the directory structure + .gitignore entries.
- [ ] Define Templates: Hardcode the boilerplate for `product.md`, `tech-stack.md`, etc.
- [ ] Path Isolation: Ensure all `$` shell calls use absolute paths derived from the 
      OpenCode `directory` context.

### Phase 2: Context Injection (The Brain)
- [ ] System Prompt Hook: Use `experimental.chat.system.transform` to inject 
      `product.md` and `tech-stack.md` into the global context.
- [ ] Dynamic Track Loading: Logic to detect which `<track_id>` is active and 
      auto-inject the corresponding `spec.md`.
- [ ] Token Optimization: Implement a "summarizer" if the conductor files exceed 
      the model's effective context window.

### Phase 3: The Build Engine (The Muscle)
- [ ] Tool Interception: Use `tool.execute.before` to block edits if `plan.md` 
      is missing or out of sync.
- [ ] Auto-Progress: Post-edit hook that updates checkboxes in `plan.md` 
      based on the agent's completed tool calls.
- [ ] TDD Enforcement: Hook that requires a `test` tool call before allowing 
      a `write_file` call in specific directories.

### Phase 4: Integration & UX (The Polish)
- [ ] TUI Status Bar: Add a "Current Task" visual indicator in the OpenCode terminal.
- [ ] Git Integration: `/conductor:commit` tool that auto-generates a message 
      based on the completed `plan.md` tasks.
- [ ] Multi-Model Support: Configuration to automatically toggle models 
      (e.g., Gemini 3 Pro for Planning -> Gemini 3 Flash for Building).