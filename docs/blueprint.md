# Blueprint & Roadmap: Conductor Agent Workflow Pack (CDD)

## 1. Project Blueprint: Architecture
The Conductor system follows the "Context-Driven Development" (CDD) pattern where the codebase carries its own "brain" in a standardized directory. 

Instead of acting as a TypeScript CLI plugin that intercepts tools or manipulates prompt injection via SDKs, it operates natively as an **Agent Workflow Pack**. The agent manages its own state by reading from and writing to markdown files directly.

### A. Core Philosophy
- **Native Alignment:** The AI natively parses `.agents/workflows/` rather than relying on external programmatic state machines.
- **Artifact-First:** The agent reads from structured Markdown files instead of relying on limited short-term chat history.
- **The Checkbox Rule:** The agent proactively plans its actions against a `plan.md` track and updates checkboxes organically.
- **Just-In-Time Context:** Using modular `<skills>` and workflows allows the agent to pull specific context (like UI guidelines) exactly when it's needed, preventing context-window dilution.

### B. Folder Structure

```text
your-project/
├── .agent/
│   ├── rules.md                  # Global system prompt/rules for the agent
│   └── workflows/                # Agent executable workflows
│       ├── conductor-setup.md    # Agent instructions to scaffold /conductor
│       ├── conductor-status.md   # Agent instructions to read tracks
│       └── conductor-*.md        # Other lifecycle operations
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
```

---

## 2. The Checkbox Workflow Lifecycle
1. **Global Enforcement:** The agent acts under the global identity of the "Conductor."
2. **Setup:** The agent runs the `/conductor-setup` workflow to scaffold context files.
3. **Planning (New Track):** Triggered via `/conductor-newtrack`. The agent writes `spec.md` and `plan.md` into a new track folder.
4. **Execution (Implementation):** Triggered via `/conductor-implement`. The agent works natively through `plan.md` checkmarks, doing Test-Driven Development implicitly.
5. **Review:** Triggered by `/conductor-review`. The agent checks its own work against `spec.md` and the broader `product.md` guidelines.

---

## 3. Development Roadmap

### Phase 1: Core Lifecycle Workflows (Scaffolding & Planning)
- [ ] Define the global `<user_rules>` system prompt template to convert default agents into "Conductors."
- [ ] Implement `conductor-setup.md` workflow for initializing project boilerplate.
- [ ] Implement `conductor-newtrack.md` workflow for planning and task breakdown.

### Phase 2: Execution & Verification Workflows
- [ ] Implement `conductor-implement.md` to guide the agent through sequential code generation and plan checklist updating.
- [ ] Implement `conductor-review.md` for validating test coverage and feature parity before marking a track complete.
- [ ] Implement `conductor-status.md` to audit the project and `tracks.md` state.

### Phase 3: Specialized Skills
- [ ] Create specialized `SKILL.md` documents (e.g., teaching the agent how to navigate massive codebases vs. small codebases under the Conductor framework).
- [ ] Establish sub-workflows for complex state rollbacks (`/conductor-revert`).