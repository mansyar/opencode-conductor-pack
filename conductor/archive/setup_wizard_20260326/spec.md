# Specification: Interactive Conductor Setup Wizard

## Overview
Refactor the existing `conductor:setup` command from a simple file-generator into a stateful, interactive wizard that aligns with the Conductor Methodology. This command will handle project discovery, collaborative definition of product and tech-stack artifacts, and initial track scaffolding.

## Functional Requirements
### 1. Project Discovery
- **Maturity Detection:** Identify "Brownfield" (existing) vs. "Greenfield" (new) projects using indicators like `.git`, dependency manifests (`package.json`, etc.), and source code directories.
- **Brownfield Analysis:** Perform a read-only scan of existing codebases (respecting `.gitignore`) to infer the project's tech stack and goal.

### 2. Stateful Execution
- **Resume Logic:** Persist setup progress in `conductor/setup_state.json`.
- **Checkpointing:** Update the state file after each successful step (`product.md`, `tech-stack.md`, etc.).
- **Resume Flow:** If the state file is found, ask the user whether to resume from the last completed step.

### 3. Interactive Wizard
- **Guided Dialogue:** Use structured Q&A (OpenCode `question` tool) to gather information for `product.md`, `product-guidelines.md`, and `tech-stack.md`.
- **Modes:** Support "Interactive" (step-by-step) and "Autogenerate" (AI-drafted) paths for major artifacts.
- **Style Guide Library:** Allow users to select code style guides from a predefined library, copied into `conductor/code_styleguides/`.

### 4. Artifact Scaffolding
- **Context Hub:** Create `conductor/index.md` as the central navigation point.
- **Initial Track:** Propose a single initial track (e.g., "Build core functionality") and generate its `spec.md`, phased `plan.md`, and `metadata.json`.
- **Tracks Registry:** Initialize `conductor/tracks.md` and register the first track.

### 5. Git Integration
- **Git Init:** Initialize a new Git repository if none exists (for Greenfield projects).
- **Initial Commit:** Automatically commit the generated `conductor/` directory with a standard message: `conductor(setup): Add conductor setup files`.

## Acceptance Criteria
- `/conductor:setup` correctly classifies a project's maturity.
- Setup state is correctly persisted and can be resumed across sessions.
- All files in the `conductor/` directory are generated based on user input or AI inference.
- The first track is created with a valid phased `plan.md` containing `[ ]` markers.
- Git repository is left in a clean state with an initial setup commit.

## Out of Scope
- Implementation of the `implement` or `status` commands.
- Advanced repository migration tools.
