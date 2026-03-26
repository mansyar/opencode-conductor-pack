# Implementation Plan: /conductor:status Command

## Phase 1: Context Resolution & Parsing Engine
- [ ] Task: Create test file for parsing `tracks.md` and `plan.md` files (`tests/parser.test.ts`)
- [ ] Task: Implement `extractTracksFromRegistry` utility to correctly identify active tracks using both formats (`- [ ] **Track:` and `## [ ] Track:`).
- [ ] Task: Implement `readTrackPlan` utility to securely resolve and read `plan.md` paths, handling missing files gracefully.
- [ ] Task: Implement `parsePlanProgress` utility to accurately parse Markdown and tally phases, tasks, completions, blockers, and active tasks.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Context Resolution & Parsing Engine' (Protocol in workflow.md)

## Phase 2: Command Logic & Formatting
- [ ] Task: Create test file for the command module (`tests/commands/status.test.ts`)
- [ ] Task: Implement `/conductor:status` command logic in `src/commands/status.ts` stringing together context resolution and parsing utilities.
- [ ] Task: Implement high-quality formatting function to construct the final output layout (Date/Time, Overall Status, Current Phase, Next Action, Blockers, Breakdown) for `client.tui.appendPrompt`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Command Logic & Formatting' (Protocol in workflow.md)

## Phase 3: Plugin API Integration (UI)
- [ ] Task: Integrate `client.tui.showToast` within `src/commands/status.ts` for the high-level percentage summary summary.
- [ ] Task: Integrate `client.tui.appendPrompt` within `src/commands/status.ts` to inject the detailed summary.
- [ ] Task: Ensure the command is correctly exported and registered in `src/index.ts` within the plugin `tool` manifest.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Plugin API Integration (UI)' (Protocol in workflow.md)
