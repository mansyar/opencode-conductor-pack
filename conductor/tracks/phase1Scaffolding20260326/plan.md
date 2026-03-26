# Implementation Plan: Phase 1 Scaffolding

## Phase 1: Project Setup [checkpoint: 0fb5a1f]

- [x] Task: Initialize TypeScript project with Vite and Vitest
    - [x] Initialize project with pnpm and package.json
    - [x] Install TypeScript, Vite, Vitest, @types/node using pnpm
    - [x] Create tsconfig.json with strict settings
    - [x] Create vite.config.ts
    - [x] Create basic test setup with Vitest
    - [x] Verify build and test commands work with pnpm

- [x] Task: Create OpenCode plugin entry point structure
    - [x] Create src/index.ts as plugin entry (exports ConductorPlugin)
    - [x] Create src/commands/ directory
    - [x] Set up basic plugin API integration using @opencode-ai/plugin
    - [x] Verify plugin loads in OpenCode

- [x] Task: Implement path isolation utilities
    - [x] Create src/utils/path.ts
    - [x] Implement getProjectRoot() using OpenCode's directory context
    - [x] Implement resolveConductorPath() helper using directory
    - [x] Write unit tests for path utilities
    - [x] Verify >80% coverage on path utils (89.79%)

- [x] Task: Conductor - User Manual Verification 'Phase 1: Project Setup' (Protocol in workflow.md)

---

## Phase 2: Setup Command Implementation

- [x] Task: Create /conductor:setup command handler
    - [x] Create src/commands/setup.ts
    - [x] Create custom tool using tool() helper from @opencode-ai/plugin
    - [x] Check if conductor/ already exists
    - [x] Validate Bun availability (for OpenCode runtime) - Note: Bun is guaranteed by OpenCode runtime
    - [x] Create conductor/ directory structure
    - [x] Write success message with created files (returns string for display)

- [x] Task: Implement template generation system
    - [x] Create src/artifacts/templates.ts
    - [x] Define product.md template
    - [x] Define product-guidelines.md template
    - [x] Define tech-stack.md template
    - [x] Define workflow.md template (full workflow document)
    - [x] Create template rendering function with placeholders

- [x] Task: Generate initial conductor files
    - [x] Generate product.md with basic structure
    - [x] Generate product-guidelines.md with defaults
    - [x] Generate tech-stack.md with placeholders
    - [x] Generate workflow.md with defaults (full workflow)
    - [x] Create code_styleguides/ directory

- [x] Task: Initialize tracks registry
    - [x] Create tracks.md with header
    - [x] Create tracks/ directory
    - [x] Verify all files are created correctly

- [ ] Task: Write integration tests for setup
    - [ ] Create integration tests for /conductor:setup
    - [ ] Test idempotency (should fail if exists)
    - [ ] Test complete file generation
    - [ ] Verify >80% coverage overall

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Setup Command Implementation' (Protocol in workflow.md)

---

## Phase 3: Documentation & Polish

- [ ] Task: Update README.md with setup instructions
    - [ ] Add installation instructions (pnpm)
    - [ ] Add /conductor:setup usage example
    - [ ] Add requirements (Bun for runtime, pnpm for dev)
    - [ ] Add troubleshooting section

- [ ] Task: Final verification and cleanup
    - [ ] Run full test suite with pnpm test
    - [ ] Verify coverage >80%
    - [ ] Check linting passes
    - [ ] Build production bundle with pnpm build

- [ ] Task: Create checkpoint commit
    - [ ] Stage all changes
    - [ ] Commit with message: conductor(checkpoint): Complete Phase 1 Scaffolding

- [ ] Task: Conductor - User Manual Verification 'Phase 3: Documentation & Polish' (Protocol in workflow.md)