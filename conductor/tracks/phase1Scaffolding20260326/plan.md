# Implementation Plan: Phase 1 Scaffolding

## Phase 1: Project Setup

- [x] Task: Initialize TypeScript project with Vite and Vitest
    - [x] Initialize project with pnpm and package.json
    - [x] Install TypeScript, Vite, Vitest, @types/node using pnpm
    - [x] Create tsconfig.json with strict settings
    - [x] Create vite.config.ts
    - [x] Create basic test setup with Vitest
    - [x] Verify build and test commands work with pnpm

- [ ] Task: Create OpenCode plugin entry point structure
    - [ ] Create src/index.ts as plugin entry (exports ConductorPlugin)
    - [ ] Create src/commands/ directory
    - [ ] Set up basic plugin API integration using @opencode-ai/plugin
    - [ ] Verify plugin loads in OpenCode

- [ ] Task: Implement path isolation utilities
    - [ ] Create src/utils/path.ts
    - [ ] Implement getProjectRoot() using OpenCode's directory context
    - [ ] Implement resolveConductorPath() helper using directory
    - [ ] Write unit tests for path utilities
    - [ ] Verify >80% coverage on path utils

- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project Setup' (Protocol in workflow.md)

---

## Phase 2: Setup Command Implementation

- [ ] Task: Create /conductor:setup command handler
    - [ ] Create src/commands/setup.ts
    - [ ] Create custom tool using tool() helper from @opencode-ai/plugin
    - [ ] Check if conductor/ already exists
    - [ ] Validate Bun availability (for OpenCode runtime)
    - [ ] Create conductor/ directory structure
    - [ ] Write success message with created files using tui.toast.show

- [ ] Task: Implement template generation system
    - [ ] Create src/artifacts/templates.ts
    - [ ] Define product.md template
    - [ ] Define product-guidelines.md template
    - [ ] Define tech-stack.md template
    - [ ] Define workflow.md template
    - [ ] Create template rendering function with placeholders

- [ ] Task: Generate initial conductor files
    - [ ] Generate product.md with basic structure
    - [ ] Generate product-guidelines.md with defaults
    - [ ] Generate tech-stack.md with placeholders
    - [ ] Generate workflow.md with defaults
    - [ ] Create code_styleguides/ directory

- [ ] Task: Initialize tracks registry
    - [ ] Create tracks.md with header
    - [ ] Create tracks/ directory
    - [ ] Verify all files are created correctly

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