# Implementation Plan: Interactive Conductor Setup Wizard

This plan refactors the `conductor:setup` command into a state-aware, interactive wizard using the OpenCode `question` tool.

## Phase 1: Infrastructure & State Management [checkpoint: 2954478]
- [x] Task: Create `src/utils/state.ts` for `setup_state.json` management. [aca0ebc]
    - [ ] Define `SetupState` interface and step enums.
    - [ ] Implement `readState`, `writeState`, and `updateStep` utilities.
- [x] Task: Create `src/utils/discovery.ts` for project analysis. [3591903]
    - [ ] Implement `getProjectMaturity` (Brownfield vs. Greenfield indicators).
    - [ ] Implement a safe, `.gitignore`-aware file scanner for context extraction.
- [x] Task: Refactor `src/commands/setup.ts` entry point. [6a5ab40]
    - [ ] Update `executeSetupCommand` signature to accept the SDK `client`.
    - [ ] Implement the top-level orchestration loop (Resume -> Discovery -> Phase execution).
- [x] Task: Conductor - User Manual Verification 'Infrastructure & State Management' (Protocol in workflow.md)

## Phase 2: Interactive Dialogue & Artifact Generation
- [x] Task: Implement Interactive `product.md` generator. [933e69d]
    - [ ] Use `client.tool.execute('question', ...)` for structured input.
    - [ ] Implement AI-driven "Autogenerate" mode for quick starts.
- [ ] Task: Implement `product-guidelines.md` and `tech-stack.md` dialogues.
    - [ ] For Brownfield: Present inferred stack for user confirmation/correction.
    - [ ] For Greenfield: Provide recommendations based on project goal.
- [ ] Task: Implement Code Style Guide library selection.
    - [ ] Expose available style guides via the `question` tool and copy selected files.
- [ ] Task: Conductor - User Manual Verification 'Interactive Dialogue & Artifact Generation' (Protocol in workflow.md)

## Phase 3: Tracks & Scaffolding
- [ ] Task: Create the `conductor/index.md` context hub.
- [ ] Task: Implement the Initial Track Scaffolder.
    - [ ] Logic to propose a track title based on product definition.
    - [ ] Automated generation of `spec.md`, phased `plan.md`, and `metadata.json`.
    - [ ] Registry update in `conductor/tracks.md`.
- [ ] Task: Implement Git Integration.
    - [ ] Trigger `git init` where needed and perform the final `conductor(setup)` commit.
- [ ] Task: Conductor - User Manual Verification 'Tracks & Scaffolding' (Protocol in workflow.md)

## Phase 4: Integration & Validation
- [ ] Task: Final wiring in `src/index.ts`.
- [ ] Task: Automated Testing (Vitest).
    - [ ] Mock the `question` tool and verify state transitions.
    - [ ] Verify file system outputs for different setup paths.
- [ ] Task: Conductor - User Manual Verification 'Finalization & Integration' (Protocol in workflow.md)
